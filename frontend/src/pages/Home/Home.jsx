import React, { useState } from "react";
import Header from "./components/Header";
import UploadArea from "./components/UploadArea";
import SearchSection from "./components/SearchSection";
import GuideModal from "./components/GuideModal";
import ResultModal from "../Result/components/ResultModal";
import axios from "axios";

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const handleImageUpload = async (file) => {
    setUploadedImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      // 업로드 시 백엔드에 분석 요청
      setIsLoading(true);
      setAnalysisResult(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        // Vite proxy를 통해 /predict → http://localhost:8000/predict로 전달됨
        const { data } = await axios.post("/predict", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("이미지 분석 결과:", data);

        const mapped = mapBackendToUi(data);
        setAnalysisResult(mapped);
      } catch (err) {
        setAnalysisResult({
          category: "오류",
          disposal: [
            "분석 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          ],
          cautions: [String(err?.message || "Unknown error")],
          tips: ["네트워크 연결을 확인해 주세요"],
        });
      } finally {
        setIsLoading(false);
        setIsResultOpen(true);
      }
    } else {
      setImageUrl(null);
    }
  };


  // 백엔드 결과를 UI 포맷으로 매핑
  const mapBackendToUi = (payload) => {
    const label = payload?.label || "unknown";
    const confidence = payload?.confidence;
    const percent =
      typeof confidence === "number" ? Math.round(confidence * 100) : undefined;
    
    // VLM 가이드가 있으면 그대로 전달하고, 없으면 기본 템플릿 사용
    if (payload?.guide) {
      return {
        label: label,
        category: label,  // category에서 퍼센트 제거 (별도 표시)
        confidence: confidence,  // confidence 필드 추가
        guide: payload.guide,
        // 기존 형식도 유지 (필요에 따라)
        disposal: [],
        cautions: [],
        tips: []
      };
    }

    // VLM 가이드가 없는 경우 기본 템플릿 사용
    const templates = {
      plastic: {
        category: "플라스틱류",
        confidence: confidence,
        disposal: [
          "내용물을 비우고 가볍게 헹굽니다",
          "라벨과 뚜껑을 분리합니다",
          "플라스틱류 재활용 수거함에 배출합니다",
        ],
        cautions: ["기름·이물질 오염 시 일반쓰레기"],
        tips: ["압착하여 부피를 줄이면 효율적입니다"],
      },
      paper: {
        category: "종이류",
        confidence: confidence,
        disposal: ["이물질 제거", "박스는 펼쳐서 납작하게"],
        cautions: ["코팅지/영수증은 별도 분류"],
        tips: ["깨끗한 종이만 배출"],
      },
      glass: {
        category: "유리병",
        confidence: confidence,
        disposal: ["내용물 비우고 헹굽니다", "금속 뚜껑 분리"],
        cautions: ["깨진 유리는 안전 포장 후 종량제"],
        tips: ["라벨 제거 권장"],
      },
      metal: {
        category: "금속 캔류",
        confidence: confidence,
        disposal: ["내용물 비우고 헹굽니다"],
        cautions: ["날카로운 모서리 주의"],
        tips: ["캔입구를 눌러 부피 줄이기"],
      },
      trash: {
        category: "일반쓰레기",
        confidence: confidence,
        disposal: ["종량제 봉투 배출"],
        cautions: ["재활용 혼입 주의"],
        tips: ["가급적 재사용/감량"],
      },
      unknown: {
        category: "이미지 분석 결과",
        confidence: confidence,
        disposal: ["내용물을 비우고, 라벨/뚜껑 분리 후 배출을 권장합니다."],
        cautions: ["오염 심한 경우 세척 후 배출"],
        tips: ["깨끗하게 헹구면 재활용 효율 향상"],
      },
    };

    const normalizedLabel = label.toLowerCase();
    return templates[normalizedLabel] || templates.unknown;
  };

  const simulateAnalysis = (queryText) => {
    const q = (queryText || "").trim().toLowerCase();

    const db = {
      플라스틱: {
        category: "플라스틱류",
        disposal: [
          "내용물을 비우고 가볍게 헹굽니다",
          "라벨과 뚜껑을 분리합니다",
          "플라스틱류 재활용 수거함에 배출합니다",
        ],
        cautions: [
          "기름·이물질이 묻으면 일반쓰레기로 분류될 수 있습니다",
          "PVC는 별도 분류가 필요할 수 있습니다",
        ],
        tips: [
          "가능하면 압착하여 부피를 줄이세요",
          "깨끗하게 헹구면 재활용 효율이 올라갑니다",
        ],
      },
      유리: {
        category: "유리병",
        disposal: [
          "내용물을 비우고 헹굽니다",
          "금속 뚜껑은 분리하여 금속류로 배출",
          "색상별 분리 배출 권장",
        ],
        cautions: [
          "깨진 유리는 신문지에 싸서 일반쓰레기로",
          "세라믹·내열유리는 재활용 불가",
        ],
        tips: ["라벨은 가능하면 제거", "보관 시 파손 주의"],
      },
      종이: {
        category: "종이류",
        disposal: [
          "스테이플러, 테이프 등 이물질 제거",
          "박스는 펼쳐서 납작하게",
          "코팅지·영수증은 별도 분류",
        ],
        cautions: ["우유팩은 일반 종이와 분리", "오염된 종이는 재활용 불가"],
        tips: ["종이봉투 재사용 권장", "깨끗한 종이만 배출"],
      },
      음식물: {
        category: "음식물류",
        disposal: [
          "물기 제거 후 배출",
          "뼈·조개껍질 등은 일반쓰레기",
          "비닐·포장재는 제거",
        ],
        cautions: ["수분 과다 배출 금지", "동물에게 해로운 재료 주의"],
        tips: ["잔반 줄이기 실천", "퇴비화 가능한 지자체 정책 확인"],
      },
      캔: {
        category: "금속 캔류",
        disposal: [
          "내용물을 비우고 헹굽니다",
          "라벨 제거 권장",
          "알루미늄·철 분리 배출 권장",
        ],
        cautions: ["날카로운 모서리 주의", "압축 시 손 다치지 않게 주의"],
        tips: ["캔입구를 안으로 눌러 부피 줄이기", "캔 따개 분리 수거"],
      },
      페트병: {
        category: "투명 페트병",
        disposal: [
          "라벨 제거 및 내용물 비우기",
          "뚜껑 분리 후 함께 배출",
          "찌그러뜨려 부피 줄이기",
        ],
        cautions: ["유색 페트는 별도 분류", "기름·음료 찌꺼기 제거"],
        tips: [
          "투명 페트 전용 배출함 이용",
          "깨끗하게 세척 시 재활용 품질 향상",
        ],
      },
    };

    const keys = Object.keys(db);
    const matchedKey = keys.find((k) => q.includes(k));
    if (matchedKey) return db[matchedKey];

    return {
      category: q ? `${queryText}` : "이미지 분석 결과",
      disposal: ["내용물을 비우고, 라벨/뚜껑 분리 후 배출을 권장합니다."],
      cautions: ["오염이 심한 경우 세척 후 배출, 불가 시 일반쓰레기 배출"],
      tips: ["깨끗하게 헹구면 재활용 효율이 향상됩니다"],
    };
  };


  const handleSearch = async (query) => {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      console.log("텍스트 검색 시작:", query);
      
      // 텍스트 검색은 VLM API 호출
      const formData = new FormData();
      formData.append("label", query);
      
      const response = await axios.post("/vlm/guide-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      console.log("VLM API 전체 응답:", response);
      console.log("VLM API 응답 데이터:", response.data);
      
      const data = response.data;
      
      if (data?.ok && data.guide) {
        console.log("VLM API 성공, 가이드 설정:", data.guide);
        setAnalysisResult({
          label: query,
          category: query,
          confidence: 0,  // 텍스트 검색 시에는 confidence 0
          guide: data.guide,
          disposal: [],
          cautions: [],
          tips: []
        });
      } else {
        // VLM API 실패 또는 가이드 없음
        console.log("VLM API 실패 또는 가이드 없음:", data);
        console.log("기본 템플릿 사용");
        const result = simulateAnalysis(query);
        setAnalysisResult(result);
      }
    } catch (error) {
      console.error("텍스트 검색 에러:", error);
      console.error("에러 상세:", error.response?.data);
      // 에러 시 기본 템플릿 사용
      const result = simulateAnalysis(query);
      setAnalysisResult(result);
    } finally {
      setIsLoading(false);
      setIsResultOpen(true);
    }
  };

  return (
    <div className="app">
      <Header onOpenGuide={() => setIsGuideOpen(true)} />
      <main className="main-content">
        <div className="hero-section">
          <h1>AI로 쉽게 분리수거하세요</h1>
          {/* <p>이미지를 업로드하고 즉시 확인하세요</p> */}
        </div>

        <SearchSection onSearch={handleSearch} />
        <UploadArea onImageUpload={handleImageUpload} isLoading={isLoading} />

        <div
          className="search-title"
          style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
        >
          최근 검색한 쓰레기
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "20px",
            flexWrap: "nowrap",
          }}
        >
          <img
            src="/images/bottle.png"
            alt="플라스틱"
            style={{ width: "180px", height: "180px", objectFit: "cover" }}
          />
          <img
            src="/images/can.png"
            alt="종이"
            style={{ width: "180px", height: "180px", objectFit: "cover" }}
          />
          <img
            src="/images/plastic.png"
            alt="유리"
            style={{ width: "180px", height: "180px", objectFit: "cover" }}
          />
          <img
            src="/images/plasticBottle.png"
            alt="금속"
            style={{ width: "180px", height: "180px", objectFit: "cover" }}
          />
          <img
            src="/images/styrofoam.png"
            alt="음식물"
            style={{ width: "180px", height: "180px", objectFit: "cover" }}
          />
        </div>
      </main>

      <GuideModal open={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ResultModal
        open={isResultOpen}
        onClose={() => setIsResultOpen(false)}
        imageUrl={imageUrl}
        result={analysisResult}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;
