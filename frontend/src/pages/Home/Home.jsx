import React, { useState } from "react";
import Header from "./components/Header";
import UploadArea from "./components/UploadArea";
import SearchSection from "./components/SearchSection";
import ResultCard from "./components/ResultCard";

const Home = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (file) => {
    setUploadedImage(file);
    // TODO: API 연동 시 실제 분석 요청
    setIsLoading(true);
    setTimeout(() => {
      setAnalysisResult({
        category: "재활용품",
        confidence: 95,
        guide: [
          "1. 내용물을 비우고 헹구기",
          "2. 라벨 제거",
          "3. 재활용품 수거함에 배출",
        ],
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleSearch = (query) => {
    // TODO: 검색 API 연동
    console.log("Search query:", query);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <h1>AI로 쉽게 분리수거하세요</h1>
          <p>이미지를 업로드하고 즉시 확인하세요</p>
        </div>

        <UploadArea onImageUpload={handleImageUpload} isLoading={isLoading} />

        <SearchSection onSearch={handleSearch} />

        {analysisResult && <ResultCard result={analysisResult} />}
      </main>
    </div>
  );
};

export default Home;
