import React from "react";

const ImagePreview = ({ imageUrl }) => {
  return (
    <div className="result-preview">
      <div className="preview-box">
        {imageUrl ? (
          <img src={imageUrl} alt="업로드된 이미지" className="preview-image" />
        ) : (
          <img src="/images/logo_1.png" alt="기본 로고" className="preview-image" />
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
