import React from "react";

const ImagePreview = ({ imageUrl }) => {
  return (
    <div className="result-preview">
      <div className="preview-box">
        {imageUrl ? (
          <img src={imageUrl} alt="업로드된 이미지" className="preview-image" />
        ) : (
          <div className="preview-placeholder">이미지가 여기에 표시됩니다</div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
