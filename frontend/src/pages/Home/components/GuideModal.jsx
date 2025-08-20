import React from "react";

const GuideModal = ({ open, onClose }) => {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
      >
        <div className="modal-header">
          <h2 id="guide-title">프로젝트 가이드</h2>
          <button className="modal-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>
        <div className="modal-body">
          {/* Hero 영역 */}
          <div className="guide-hero" role="banner">
            <div className="hero-icon" aria-hidden>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 3L21 7.5L16.5 12"
                  stroke="#2e7d32"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 21L3 16.5L7.5 12"
                  stroke="#2e7d32"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 7.5H9C6.239 7.5 4 9.739 4 12.5V12.5"
                  stroke="#2e7d32"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 16.5H15C17.761 16.5 20 14.261 20 11.5V11.5"
                  stroke="#2e7d32"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="hero-text">
              <div className="pill-badges">
                <span className="badge">Recycling Guide</span>
                <span className="badge badge-alt">Eco Friendly</span>
              </div>
              <h3 className="hero-title">사진 한 장으로 정확한 분리배출</h3>
              <p className="hero-subtitle">
                당신의 지역 규칙에 맞춘 즉각적인 안내와 실수 예방
              </p>
            </div>
          </div>

          {/* 카드형 섹션 레이아웃 */}
          <div className="guide-grid">
            <section className="guide-card">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  🎯
                </span>
                <h3>프로젝트의 목적/가치</h3>
              </div>
              <p>
                사진 한 장으로 빠르게, 당신이 있는 지역 규칙에 꼭 맞는 분리배출
                방법을 알려드립니다. 복잡한 검색 없이 즉각적인 안내와 실수
                예방이 핵심 가치입니다.
              </p>
            </section>

            <section className="guide-card">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  🧭
                </span>
                <h3>사용 방법 (3단계)</h3>
              </div>
              <ol className="number-list">
                <li>
                  <strong>업로드/촬영:</strong> 분리하고 싶은 물건을 전체가
                  보이게 촬영해 주세요.
                </li>
                <li>
                  <strong>인식/신뢰도 확인:</strong> AI가 재질과 분류를 추정하고
                  신뢰도(Confidence) 를 함께 보여줍니다.
                </li>
                <li>
                  <strong>배출 가이드:</strong> 현재 위치(도시/구)의 규칙에 맞춰
                  분리함/주의사항을 안내합니다.
                </li>
              </ol>
              <div className="callout tip">
                팁: 라벨이 보이도록, 흔들리지 않게 촬영하면 정확도가 올라갑니다.
              </div>
            </section>

            <section className="guide-card">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  ♻️
                </span>
                <h3>지원 범위</h3>
              </div>
              <ul className="bullet-list">
                <li>
                  <strong>재질 분류:</strong> Plastic(PET 등), Paper, Glass,
                  Metal(Aluminum/철), Trash(일반)
                </li>
                <li>
                  <strong>특수 항목(예외):</strong> 배터리/전지류, 형광등,
                  폐가전 등은 전용 수거함을 안내합니다.
                </li>
                <li>
                  <strong>곧 추가:</strong> 의류/섬유, 복합재질
                  포장재(멀티레이어) 세부 분류
                </li>
              </ul>
            </section>

            <section className="guide-card">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  📈
                </span>
                <h3>정확도 & 신뢰도(Confidence)</h3>
              </div>
              <ul className="bullet-list">
                <li>
                  신뢰도는 0~1(또는 %)로 표시되며, 값이 높을수록 모델의 확신이
                  큽니다.
                </li>
                <li>
                  신뢰도 낮음(예: 0.6 미만) 표시 시, 화면의 라벨 수정 버튼으로
                  피드백을 남겨 주세요.
                </li>
                <li>피드백은 모델 개선에 바로 반영됩니다(정확도 향상 루프).</li>
              </ul>
            </section>

            <section className="guide-card">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  🗺️
                </span>
                <h3>지역 규칙 & 예외 처리</h3>
              </div>
              <p>도시/구별 규칙을 매핑하여 서로 다른 배출 방법을 안내합니다.</p>
              <ul className="bullet-list">
                <li>
                  <strong>오염 심함(음식물 잔여물/기름기):</strong> 세척 후
                  배출, 세척 불가 시 일반쓰레기
                </li>
                <li>
                  <strong>혼합재질(플라스틱+금속 등):</strong> 가능한 부분 분리
                  후 배출
                </li>
                <li>
                  <strong>파손 위험(깨진 유리):</strong> 신문지 등으로 감싸 표기
                  후 종량제 배출
                </li>
              </ul>
            </section>

            <section className="guide-card">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  🔐
                </span>
                <h3>개인정보/보안</h3>
              </div>
              <ul className="bullet-list">
                <li>
                  업로드 이미지는 분석 목적으로만 사용되며, 기본적으로 일정 기간
                  후 자동 파기됩니다.
                </li>
                <li>
                  얼굴/주소 등 민감 정보는 수집하지 않도록 안내하며, 필요 시
                  자동 마스킹을 적용합니다.
                </li>
                <li>
                  자세한 내용은 개인정보 처리방침(준비 중)에서 확인하실 수
                  있습니다.
                </li>
              </ul>
            </section>

            <section className="guide-card">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  ⚠️
                </span>
                <h3>주의사항</h3>
              </div>
              <ul className="bullet-list">
                <li>
                  내용물 비우기, 라벨/뚜껑 분리, 가벼운 세척을 권장합니다.
                </li>
                <li>
                  배터리/전지는 일반 분리수거함에 버리지 마세요. 화재 위험이
                  있습니다.
                </li>
                <li>
                  유리 파손 주의: 깨진 유리는 안전하게 포장 후 표기하세요.
                </li>
              </ul>
            </section>

            <section className="guide-card full">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  ❓
                </span>
                <h3>FAQ</h3>
              </div>
              <div className="faq-item">
                <p className="q">Q. 왜 우리 동네랑 다른 안내가 나오죠?</p>
                <p className="a">
                  A. 지자체 규칙이 수시로 업데이트됩니다. 위치 권한이 꺼져
                  있거나 규정 변경이 반영 중일 수 있어요. 화면의 규칙 제보로
                  알려 주세요.
                </p>
              </div>
              <div className="faq-item">
                <p className="q">Q. 사진이 흐리면 인식이 잘 안 돼요.</p>
                <p className="a">
                  A. 밝은 곳에서 전체를 또렷하게 촬영해 주세요. 라벨/재질
                  텍스처가 보이면 정확도가 올라갑니다.
                </p>
              </div>
              <div className="faq-item">
                <p className="q">Q. 결과가 틀린 것 같아요.</p>
                <p className="a">
                  A. 라벨 수정으로 알려 주시면, 검수 후 모델에 반영됩니다.
                </p>
              </div>
            </section>

            <section className="guide-card">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  📬
                </span>
                <h3>피드백/문의</h3>
              </div>
              <ul className="bullet-list">
                <li>이메일: support@example.com</li>
                <li>이슈 트래커: GitHub Issues (링크 준비 중)</li>
                <li>제휴/데이터 제보: partner@example.com</li>
              </ul>
            </section>

            <section className="guide-card">
              <div className="card-header">
                <span className="card-icon" aria-hidden>
                  📝
                </span>
                <h3>버전/변경 내역</h3>
              </div>
              <ul className="bullet-list">
                <li>v0.3.0: 배터리 전용 수거함 안내 추가, UI 접근성 개선</li>
                <li>v0.2.1: 지역 규칙 매핑 정확도 개선, 신뢰도 배지 도입</li>
                <li>v0.1.0: 이미지 업로드 → 인식 → 가이드 MVP 공개</li>
              </ul>
              <p className="last-updated">마지막 업데이트: 2025-08-20</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
