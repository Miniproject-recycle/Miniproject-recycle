# python detect.py --device cpu --weights runs/train/yolor_p6.pt --names data/test_newconn.names
# rec\scripts\activate.bat

import argparse
import os
import platform
import shutil
import time
from pathlib import Path

import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random

from .utils.google_utils import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import (
    check_img_size,
    non_max_suppression,
    apply_classifier,
    scale_coords,
    xyxy2xywh,
    strip_optimizer,
)
from utils.plots import plot_one_box
from utils.torch_utils import select_device, load_classifier, time_synchronized

from models.models import *
from utils.datasets import *
from utils.general import *


# FastAPI용 기본 설정 함수 수정 (35-54번째 줄)
def create_default_opt():
    import os
    from pathlib import Path

    # 현재 파일의 디렉토리 기준으로 절대 경로 생성
    current_dir = Path(__file__).parent

    class DefaultOpt:
        def __init__(self):
            self.weights = [str(current_dir / "runs/train/yolor_p6.pt")]
            self.source = "temp_uploads"
            self.output = str(current_dir / "inference/output")
            self.img_size = 1280
            self.conf_thres = 0.4
            self.iou_thres = 0.5
            self.device = "cpu"
            self.view_img = False
            self.save_txt = False
            self.classes = None
            self.agnostic_nms = False
            self.augment = False
            self.update = False
            self.cfg = str(Path(__file__).parent / "cfg/yolor_p6.cfg")  # 절대 경로
            self.names = str(
                Path(__file__).parent / "data/test_newconn.names"
            )  # 절대 경로

    return DefaultOpt()


# 글로벌 모델 변수들
_model = None
_device = None
_names = None
_colors = None
_model_initialized = False

# FastAPI에서 import할 때만 기본 opt 생성
if __name__ != "__main__":
    opt = create_default_opt()


def load_classes(path):
    # Loads *.names file at 'path'
    with open(path, "r", encoding="utf-8") as f:
        names = f.read().split("\n")
    return list(filter(None, names))  # filter removes empty strings (such as last line)


def initialize_model():
    """모델을 한 번만 초기화하는 함수"""
    global _model, _device, _names, _colors, _model_initialized

    if _model_initialized:
        return

    print("🔧 AI 모델 초기화 시작...")

    # Device 설정
    _device = select_device(opt.device)

    # 모델 로딩
    _model = Darknet(opt.cfg, opt.img_size).to(_device)
    _model.load_state_dict(
        torch.load(opt.weights[0], map_location=_device, weights_only=False)["model"]
    )
    _model.to(_device).eval()

    # Half precision 설정
    half = _device.type != "cpu"
    if half:
        _model.half()

    # 클래스 이름과 색상 로딩
    _names = load_classes(opt.names)
    _colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(len(_names))]

    _model_initialized = True
    print("✅ AI 모델 초기화 완료!")


def detect(save_img=False):
    # 모델 초기화 (한 번만 실행됨)
    initialize_model()

    # 글로벌 변수 사용
    global _model, _device, _names, _colors

    out, source, view_img, save_txt, imgsz = (
        opt.output,
        opt.source,  # 프론트엔드에서 업데이트된 경로 사용
        opt.view_img,
        opt.save_txt,
        opt.img_size,
    )
    webcam = (
        source == "0"
        or source.startswith("rtsp")
        or source.startswith("http")
        or source.endswith(".txt")
    )

    detected_labels = []
    detected_score = []

    # 출력 폴더 설정
    if os.path.exists(out):
        try:
            shutil.rmtree(out)  # delete output folder
        except PermissionError:
            print(f"Warning: 폴더 삭제 권한 없음. 기존 폴더 유지: {out}")
            pass  # 폴더 삭제 실패해도 계속 진행
    os.makedirs(out, exist_ok=True)  # make new output folder (exist_ok=True 추가)

    # Half precision 설정
    half = _device.type != "cpu"

    # Second-stage classifier
    classify = False
    if classify:
        modelc = load_classifier(name="resnet101", n=2)  # initialize
        modelc.load_state_dict(
            torch.load("weights/resnet101.pt", map_location=_device)["model"]
        )  # load weights
        modelc.to(_device).eval()

    # Set Dataloader
    vid_path, vid_writer = None, None
    if webcam:
        view_img = True
        cudnn.benchmark = True  # set True to speed up constant image size inference
        dataset = LoadStreams(source, img_size=imgsz)
    else:
        save_img = True
        dataset = LoadImages(source, img_size=imgsz, auto_size=64)

    # Run inference
    t0 = time.time()
    img = torch.zeros((1, 3, imgsz, imgsz), device=_device)  # init img
    _ = (
        _model(img.half() if half else img) if _device.type != "cpu" else None
    )  # run once
    for path, img, im0s, vid_cap in dataset:
        img = torch.from_numpy(img).to(_device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        # Inference
        t1 = time_synchronized()
        pred = _model(img, augment=opt.augment)[0]

        # Apply NMS
        pred = non_max_suppression(
            pred,
            opt.conf_thres,
            opt.iou_thres,
            classes=opt.classes,
            agnostic=opt.agnostic_nms,
        )
        t2 = time_synchronized()

        # Apply Classifier
        if classify:
            pred = apply_classifier(pred, modelc, img, im0s)

        # Process detections
        for i, det in enumerate(pred):  # detections per image
            if webcam:  # batch_size >= 1
                p, s, im0 = path[i], "%g: " % i, im0s[i].copy()
            else:
                p, s, im0 = path, "", im0s

            save_path = str(Path(out) / Path(p).name)
            txt_path = str(Path(out) / Path(p).stem) + (
                "_%g" % dataset.frame if dataset.mode == "video" else ""
            )
            s += "%gx%g " % img.shape[2:]  # print string
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
            if det is not None and len(det):
                # Rescale boxes from img_size to im0 size
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                # Print results
                for c in det[:, -1].unique():
                    n = (det[:, -1] == c).sum()  # detections per class
                    s += "%g %ss, " % (n, _names[int(c)])  # add to string

                # Write results
                for *xyxy, conf, cls in det:
                    detected_labels.append(_names[int(cls)])
                    detected_score.append(float(conf))  # tensor를 float로 변환
                    if save_txt:  # Write to file
                        xywh = (
                            (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn)
                            .view(-1)
                            .tolist()
                        )  # normalized xywh
                        with open(txt_path + ".txt", "a") as f:
                            f.write(("%g " * 5 + "\n") % (cls, *xywh))  # label format

                    if save_img or view_img:  # Add bbox to image
                        label = "%s %.2f" % (_names[int(cls)], conf)
                        plot_one_box(
                            xyxy,
                            im0,
                            label=label,
                            color=_colors[int(cls)],
                            line_thickness=3,
                        )

            # Print time (inference + NMS)
            print("%sDone. (%.3fs)" % (s, t2 - t1))

            # Stream results
            if view_img:
                cv2.imshow(p, im0)
                if cv2.waitKey(1) == ord("q"):  # q to quit
                    raise StopIteration

            # Save results (image with detections)
            if save_img:
                if dataset.mode == "images":
                    cv2.imwrite(save_path, im0)
                else:
                    if vid_path != save_path:  # new video
                        vid_path = save_path
                        if isinstance(vid_writer, cv2.VideoWriter):
                            vid_writer.release()  # release previous video writer

                        fourcc = "mp4v"  # output video codec
                        fps = vid_cap.get(cv2.CAP_PROP_FPS)
                        w = int(vid_cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                        h = int(vid_cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                        vid_writer = cv2.VideoWriter(
                            save_path, cv2.VideoWriter_fourcc(*fourcc), fps, (w, h)
                        )
                    vid_writer.write(im0)

    if save_txt or save_img:
        print("Results saved to %s" % Path(out))
        if platform == "darwin" and not opt.update:  # MacOS
            os.system("open " + save_path)

    print("Done. (%.3fs)" % (time.time() - t0))
    return detected_labels, detected_score


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--weights", nargs="+", type=str, default="yolor_p6.pt", help="model.pt path(s)"
    )
    parser.add_argument(
        "--source", type=str, default="inference/images", help="source"
    )  # file/folder, 0 for webcam
    parser.add_argument(
        "--output", type=str, default="inference/output", help="output folder"
    )  # output folder
    parser.add_argument(
        "--img-size", type=int, default=1280, help="inference size (pixels)"
    )
    parser.add_argument(
        "--conf-thres", type=float, default=0.4, help="object confidence threshold"
    )
    parser.add_argument(
        "--iou-thres", type=float, default=0.5, help="IOU threshold for NMS"
    )
    parser.add_argument(
        "--device", default="", help="cuda device, i.e. 0 or 0,1,2,3 or cpu"
    )
    parser.add_argument("--view-img", action="store_true", help="display results")
    parser.add_argument(
        "--save-txt", action="store_true", default=False, help="save results to *.txt"
    )
    parser.add_argument(
        "--classes",
        nargs="+",
        type=int,
        help="filter by class: --class 0, or --class 0 2 3",
    )
    parser.add_argument(
        "--agnostic-nms", action="store_true", help="class-agnostic NMS"
    )
    parser.add_argument("--augment", action="store_true", help="augmented inference")
    parser.add_argument("--update", action="store_true", help="update all models")
    parser.add_argument(
        "--cfg", type=str, default="cfg/yolor_p6.cfg", help="*.cfg path"
    )
    parser.add_argument(
        "--names", type=str, default="data/coco.names", help="*.cfg path"
    )
    opt = parser.parse_args()
    print(opt)

    with torch.no_grad():
        if opt.update:  # update all models (to fix SourceChangeWarning)
            for opt.weights in [""]:
                labels, score = detect()
                strip_optimizer(opt.weights)
        else:
            labels, score = detect()
