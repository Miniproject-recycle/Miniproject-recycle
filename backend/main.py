import sys
import os
from pathlib import Path

# AI 모델 디렉토리를 Python 경로에 추가
ai_model_path = Path(__file__).parent.parent / "ai_part" / "DetectionModel"
sys.path.append(str(ai_model_path))

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil

# 탐지: 이미지
from ai_part.DetectionModel.detect import detect
# VLM: 이미지+라벨 / 텍스트만 두 가지 유틸
from ai_part.vlm_model.vlm_service import (
    generate_recycling_guide,          # 이미지 + 라벨
    generate_recycling_guide_text_only # 텍스트만
)

# from ai_part.VlmModel.vlm import run_vlm   # VLM 처리 함수

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # 배포 시 특정 도메인만 허용 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 업로드된 이미지를 저장할 임시 디렉토리
UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# A) 텍스트만 들어오는 경우 → 바로 VLM 호출
@app.post("/vlm/guide-text")
async def vlm_guide_text(
    label: str = Form(..., description="품목/라벨 텍스트 (예: '종이박스')"),
):
    """
    프론트가 텍스트만 보낼 때 사용.
    - 분류/탐지 없이 라벨 텍스트만으로 분리수거 가이드 생성.
    """
    result = generate_recycling_guide_text_only(label)
    if not result.get("ok"):
        # 내부에서 에러가 났으면 500으로 올려서 프론트에서 에러 처리하기 쉽게 함
        raise HTTPException(status_code=500, detail=result)
    return result


# B) 이미지만 들어오는 경우 → 객체 감지 실행 & 라벨 반환 함수
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # 업로드된 파일 검증
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400, detail="이미지 파일만 업로드 가능합니다."
            )

        # 임시 파일 저장
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 업로드된 이미지 경로를 opt.source에 설정
        from ai_part.DetectionModel.detect import opt

        # 절대경로로 변환 (경로 문제 해결)
        absolute_file_path = os.path.abspath(file_path)
        opt.source = absolute_file_path

        print(f"AI 모델이 처리할 이미지 경로: {absolute_file_path}")
        print("실제 AI 모델 호출 시작...")

        try:
            labels = detect()  # 실제 AI 모델 호출
            print(f"실제 AI 모델 결과: {labels}")
        except Exception as e:
            print(f"AI 모델 에러: {e}")
            import traceback

            traceback.print_exc()
            labels = ["unknown"]  # 에러 시 기본값

        print(f"detect 모델 결과 : {labels}")
        # 파일 바이트로 읽어서 전달
        with open(absolute_file_path, "rb") as f:
            image_bytes = f.read()

        # 라벨이 있으면 VLM 실행, 없으면 guide=None
        guide = generate_recycling_guide(image_bytes, labels[0])

        # 임시 파일 삭제
        os.remove(file_path)

        # 프론트엔드 형식에 맞게 응답
        if labels:
            return {
                "ok": True,
                "label": labels[0],  # 첫 번째 감지된 객체
                "confidence": 0.85,  # 임시 신뢰도
                "labels": labels,  # 전체 감지된 객체들
                "total_detected": len(labels),
                "message": f"{len(labels)}개의 객체가 감지되었습니다.",
                "guide": guide
            }
        else:
            return {
                "label": "unknown",
                "confidence": 0.0,
                "labels": [],
                "message": "분리수거 대상이 감지되지 않았습니다.",
            }


    except Exception as e:
        print(f"❌ AI 모델 에러 발생!")
        print(f"에러 타입: {type(e).__name__}")
        print(f"에러 메시지: {str(e)}")

        # 전체 스택 트레이스 출력
        import traceback

        print("=== 전체 에러 스택 ===")
        traceback.print_exc()
        print("===================")

        # 임시 파일 정리
        if os.path.exists(file_path):
            os.remove(file_path)


    

        raise HTTPException(status_code=500, detail=f"AI 모델 에러: {str(e)}")
