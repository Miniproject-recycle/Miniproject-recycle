import React, { useState, useRef } from "react";
import axios from "axios";

function ImageUpload({ onImageUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // 파일 선택
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    }
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      setFile(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // 서버로 업로드
  const handleUpload = async () => {
    if (!file) {
      alert("파일을 선택해주세요!");
      return;
    }

    setLoading(true);
    
    try {
      // Home 컴포넌트의 handleImageUpload 함수 호출
      await onImageUpload(file);
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-section">
      <div
        className={`upload-area ${isDragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="30" fill="#4CAF50" opacity="0.2" />
            <path
              d="M25 25 L35 30 L25 35 M30 25 L30 35"
              stroke="#4CAF50"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>

        <p className="upload-text">이미지를 업로드하거나 드래그하세요</p>
        <p className="upload-formats">지원 형식: JPG, PNG, JPEG, WEBP</p>

        <button
          className="file-select-btn"
          onClick={handleButtonClick}
          disabled={loading}
        >
          {loading ? "분석 중..." : "파일 선택"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* 선택된 파일이 있을 때 분석 버튼 표시 */}
        {file && (
          <div style={{ marginTop: "20px" }}>
            <p
              style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}
            >
              선택된 파일: {file.name}
            </p>
            <button
              className="file-select-btn"
              onClick={handleUpload}
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #4CAF50 0%, #45a049 100%)",
              }}
            >
              {loading ? "AI 분석 중..." : "분석 시작"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
