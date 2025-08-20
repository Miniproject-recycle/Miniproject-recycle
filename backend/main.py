from fastapi import FastAPI
from ai_part.DetectionModel.detect import detect
#from ai_part.VlmModel.vlm import run_vlm   # VLM 처리 함수

app = FastAPI()

# 객체 감지 실행 & 라벨 반환 함수
@app.post("/predict")
def predict():
    # 객체 감지 실행
    labels = detect()

    if not labels:
        return {"message": "분리수거 대상이 감지되지 않았습니다.", "labels": []}

    # VLM 호출 (프롬프트 작성은 vlm.py 안에서 처리됨)
    #advice = run_vlm(labels)

    return {"labels": labels }
