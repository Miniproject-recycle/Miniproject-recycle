# ai_part/vlm_model/vlm_service.py
"""
VLM(Gemini) 유틸:
- generate_recycling_guide(image_bytes, label)       : 이미지 + 라벨
- generate_recycling_guide_text_only(label)          : 텍스트(라벨)만
"""

import os
import io
from pathlib import Path
from typing import Dict, Any
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv

# 현재 파일의 위치를 기반으로 프로젝트 루트 경로를 계산합니다.
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
# 프로젝트 루트 폴더에 있는 .env 파일을 정확하게 로드합니다.
load_dotenv(PROJECT_ROOT / ".env")

_GEMINI_MODEL_NAME = "gemini-2.5-flash"
_model = None

def _get_model():
    """Gemini 모델을 1번만 초기화해서 재사용"""
    global _model
    if _model is not None:
        return _model
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("환경변수 GEMINI_API_KEY가 설정되어 있지 않습니다.")
    genai.configure(api_key=api_key)
    _model = genai.GenerativeModel(_GEMINI_MODEL_NAME)
    return _model

def _build_prompt(label: str) -> str:
    """이미지와 함께 쓸 프롬프트"""
    return f"""
# task
You are a recycling policy expert for the Republic of Korea. This image shows the '{label}' that the user intends to sort for recycling.

Please perform the following two tasks step by step:

1. **상태 분석:** First, analyze the condition of the object in the image in detail (e.g., whether it is wet, contaminated, or has other materials attached such as tape or stickers).

2. **분리수거 가이드:** Based on the above analysis and in accordance with the regulations of Korea’s Ministry of Environment, describe the detailed recycling/separate-collection method with the following sections required:
**1. 분리배출이 가능한 경우**,
**2. 분리가 어려운 경우**,
**3. 기타 방법** (cost-saving tips/upcycling/repair services, etc.).
If there is additional information, continue with 4, 5, … in order.
If the item is not recyclable in its current condition, clearly state the reason and how it should be disposed of instead.

# important
Please present each item in list form for readability.
The response must be in Korean.
"""

# def _build_prompt_text_only(label: str) -> str:
#     """텍스트만 있을 때 사용할 프롬프트"""
#     return f"""
# # task
# You are a recycling policy expert for the Republic of Korea. This image shows the '{label}' that the user intends to sort for recycling.

# Please perform the following two tasks step by step:

# 1. **상태 분석:** First, analyze the condition of the object in the image in detail (e.g., whether it is wet, contaminated, or has other materials attached such as tape or stickers).

# 2. **분리수거 가이드:** Based on the above analysis and in accordance with the regulations of Korea’s Ministry of Environment, describe the detailed recycling/separate-collection method with the following sections required:
# **1. 분리배출이 가능한 경우**,
# **2. 분리가 어려운 경우**,
# **3. 기타 방법** (cost-saving tips/upcycling/repair services, etc.).
# If there is additional information, continue with 4, 5, … in order.
# If the item is not recyclable in its current condition, clearly state the reason and how it should be disposed of instead.

# # important
# Please present each item in list form for readability.
# The response must be in Korean.
# """

def generate_recycling_guide(image_bytes: bytes, label: str) -> Dict[str, Any]:
    """이미지 바이트 + 라벨 → Gemini 호출 → 프론트용 dict 반환"""
    # 1) 이미지 열기
    try:
        img = Image.open(io.BytesIO(image_bytes))
    except FileNotFoundError:
        return {"ok": False, "error": "IMAGE_NOT_FOUND", "message": "이미지 파일을 찾을 수 없습니다."}
    except Exception as e:
        return {"ok": False, "error": "IMAGE_OPEN_ERROR", "message": f"이미지를 여는 중 오류: {e}"}
    # 2) 모델 준비
    try:
        model = _get_model()
    except Exception as e:
        return {"ok": False, "error": "MODEL_INIT_ERROR", "message": f"모델 초기화 오류: {e}"}
    # 3) 호출
    try:
        resp = model.generate_content([_build_prompt(label), img])
        guide_text = (resp.text or "").strip()
    except Exception as e:
        return {"ok": False, "error": "VLM_CALL_ERROR", "message": f"VLM 호출 오류: {e}"}
    # 4) 결과
    return {
        "ok": True,
        "model": _GEMINI_MODEL_NAME,
        "label": label,
        "guide_markdown": guide_text,
        "meta": {"prompt_version": "ai-02-kr-v1"},
    }

def generate_recycling_guide_text_only(label: str) -> Dict[str, Any]:
    """라벨(텍스트)만으로 분리수거 가이드 생성"""
    try:
        model = _get_model()
    except Exception as e:
        return {"ok": False, "error": "MODEL_INIT_ERROR", "message": f"모델 초기화 오류: {e}"}
    try:
        resp = model.generate_content(_build_prompt(label))
        guide_text = (resp.text or "").strip()
    except Exception as e:
        return {"ok": False, "error": "VLM_CALL_ERROR", "message": f"VLM 호출 오류: {e}"}
    return {
        "ok": True,
        "model": _GEMINI_MODEL_NAME,
        "label": label,
        "guide_markdown": guide_text,
        "meta": {"prompt_version": "ai-02-kr-v1"},
    }
