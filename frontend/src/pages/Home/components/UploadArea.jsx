import React, { useRef, useState } from "react";

const UploadArea = ({ onImageUpload, isLoading }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  };

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
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
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
          disabled={isLoading}
        >
          {isLoading ? "분석 중..." : "파일 선택"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default UploadArea;
