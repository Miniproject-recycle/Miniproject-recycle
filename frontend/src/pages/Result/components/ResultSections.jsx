import React from "react";

// 아이콘 컴포넌트들
const CategoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const DisposalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13H5v-2h14v2z" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const CautionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z" />
  </svg>
);

const TipIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const SectionCard = ({ title, children, icon: Icon, color = "#4CAF50" }) => (
  <div className="section-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="section-header">
      <div className="section-icon" style={{ color }}>
        <Icon />
      </div>
      <h3 className="section-title">{title}</h3>
    </div>
    <div className="section-content">{children}</div>
  </div>
);

const PlaceholderList = ({ message = "검색 후 결과가 표시됩니다." }) => (
  <div className="placeholder-content">
    <div className="placeholder-icon">🔍</div>
    <p className="placeholder-text">{message}</p>
  </div>
);


// 마크다운 텍스트를 정리하는 함수
const cleanMarkdownText = (text) => {
  if (!text) return text;
  
  return text
    // ** 볼드 제거 (**텍스트** -> 텍스트)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // * 이탤릭/리스트 마커 제거 (*텍스트* -> 텍스트, 줄 시작의 * 제거)
    .replace(/^\*\s+/gm, '')
    .replace(/\*([^*]+)\*/g, '$1')
    // ### 헤더 제거 (### 텍스트 -> 텍스트)
    .replace(/#{1,6}\s*/g, '')
    // 번호 리스트 마커 제거 (1. 텍스트 -> 텍스트)
    .replace(/^\d+\.\s+/gm, '')
    // - 리스트 마커 제거 (- 텍스트 -> 텍스트)
    .replace(/^-\s+/gm, '')
    // + 리스트 마커 제거 (+ 텍스트 -> 텍스트)
    .replace(/^\+\s+/gm, '')
    // 연속된 공백 정리
    .replace(/\s+/g, ' ')
    // 연속된 줄바꿈 정리
    .replace(/\n\s*\n/g, '\n')
    // 앞뒤 공백 제거
    .trim();
};

// VLM 결과에서 상태 분석과 분리수거 가이드를 파싱하는 함수
const parseVLMGuide = (guideText) => {
  console.log("parseVLMGuide 시작, guideText:", guideText);
  
  if (!guideText || typeof guideText !== 'string') {
    console.log("guideText가 없거나 문자열이 아님");
    return { statusAnalysis: [], recyclingGuide: [] };
  }

  const statusAnalysis = [];
  const recyclingGuide = [];

  // 다양한 패턴으로 상태 분석 섹션 찾기
  let statusAnalysisMatch = 
    guideText.match(/### 1\. 상태 분석([\s\S]*?)(?=### 2\. 분리수거 가이드|$)/) ||
    guideText.match(/## 1\. 상태 분석([\s\S]*?)(?=## 2\. 분리수거 가이드|$)/) ||
    guideText.match(/상태 분석([\s\S]*?)(?=분리수거 가이드|$)/) ||
    guideText.match(/\*\*상태 분석\*\*([\s\S]*?)(?=\*\*분리수거 가이드\*\*|$)/);
  
  if (statusAnalysisMatch) {
    console.log("상태 분석 섹션 찾음:", statusAnalysisMatch[1]);
    const statusText = statusAnalysisMatch[1];
    
    // 다양한 패턴으로 항목들 추출
    const patterns = [
      { key: "재질", regex: /\*\s*\*\*재질[:\s]*\*\*(.*?)(?=\n\*\s*\*\*|\n\n|$)/s },
      { key: "오염 여부", regex: /\*\s*\*\*오염\s*여부[:\s]*\*\*(.*?)(?=\n\*\s*\*\*|\n\n|$)/s },
      { key: "이물질 부착 여부", regex: /\*\s*\*\*이물질\s*부착\s*여부[:\s]*\*\*(.*?)(?=\n\*\s*\*\*|\n\n|$)/s }
    ];
    
    patterns.forEach(pattern => {
      const match = statusText.match(pattern.regex);
      if (match) {
        console.log(`${pattern.key} 찾음:`, match[1]);
        statusAnalysis.push({
          title: pattern.key,
          content: cleanMarkdownText(match[1].trim())
        });
      }
    });
    
    // 일반적인 리스트 형태도 파싱
    if (statusAnalysis.length === 0) {
      const listItems = statusText.match(/\*\s+([^*\n]+)/g);
      if (listItems) {
        listItems.forEach((item, idx) => {
          const content = item.replace(/^\*\s+/, '').trim();
          if (content) {
            statusAnalysis.push({
              title: `항목 ${idx + 1}`,
              content: cleanMarkdownText(content)
            });
          }
        });
      }
    }
  }

  // 다양한 패턴으로 분리수거 가이드 섹션 찾기
  let recyclingGuideMatch = 
    guideText.match(/### 2\. 분리수거 가이드([\s\S]*?)(?=### 3\.|$)/) ||
    guideText.match(/## 2\. 분리수거 가이드([\s\S]*?)(?=## 3\.|$)/) ||
    guideText.match(/분리수거 가이드([\s\S]*?)$/) ||
    guideText.match(/\*\*분리수거 가이드\*\*([\s\S]*?)$/) ||
    guideText.match(/2\.\s*분리수거\s*가이드([\s\S]*?)$/) ||
    guideText.match(/분리배출.*?방법([\s\S]*?)$/);
  
  if (recyclingGuideMatch) {
    console.log("분리수거 가이드 섹션 찾음:", recyclingGuideMatch[1]);
    const guideSection = recyclingGuideMatch[1];
    
    // 분리배출이 가능한 경우
    const possiblePatterns = [
      /\*\*1\.\s*분리배출이\s*가능한\s*경우\*\*([\s\S]*?)(?=\*\*2\.|$)/,
      /분리배출이\s*가능한\s*경우([\s\S]*?)(?=분리가\s*어려운\s*경우|$)/,
      /\*\*가능한\s*경우\*\*([\s\S]*?)(?=\*\*어려운\s*경우\*\*|$)/
    ];
    
    for (const pattern of possiblePatterns) {
      const possibleMatch = guideSection.match(pattern);
      if (possibleMatch) {
        console.log("가능한 경우 찾음:", possibleMatch[1]);
        const possibleText = possibleMatch[1];
        
        // 단계별 항목 추출
        const stepMatches = possibleText.match(/\*\s+\*\*(.*?):\*\*(.*?)(?=\n\*\s+\*\*|\n\n|$)/gs) ||
                           possibleText.match(/\*\s+([^*\n]+)/g);
        
        if (stepMatches) {
          stepMatches.forEach(step => {
            const stepMatch = step.match(/\*\s+\*\*(.*?):\*\*(.*)/s);
            if (stepMatch) {
              recyclingGuide.push({
                type: "possible",
                title: cleanMarkdownText(stepMatch[1].trim()),
                content: cleanMarkdownText(stepMatch[2].trim())
              });
            } else {
              const content = step.replace(/^\*\s+/, '').trim();
              if (content) {
                recyclingGuide.push({
                  type: "possible",
                  title: "방법",
                  content: cleanMarkdownText(content)
                });
              }
            }
          });
        }
        break;
      }
    }
    
    // 분리가 어려운 경우
    const difficultPatterns = [
      /\*\*2\.\s*분리가\s*어려운\s*경우\*\*([\s\S]*?)(?=\*\*3\.|$)/,
      /분리가\s*어려운\s*경우([\s\S]*?)(?=기타\s*방법|$)/,
      /\*\*어려운\s*경우\*\*([\s\S]*?)(?=\*\*기타|$)/
    ];
    
    for (const pattern of difficultPatterns) {
      const difficultMatch = guideSection.match(pattern);
      if (difficultMatch) {
        console.log("어려운 경우 찾음:", difficultMatch[1]);
        const difficultText = difficultMatch[1];
        
        const caseMatches = difficultText.match(/\*\s+\*\*(.*?):\*\*(.*?)(?=\n\*\s+\*\*|\n\n|$)/gs) ||
                           difficultText.match(/\*\s+([^*\n]+)/g);
        
        if (caseMatches) {
          caseMatches.forEach(caseItem => {
            const caseMatch = caseItem.match(/\*\s+\*\*(.*?):\*\*(.*)/s);
            if (caseMatch) {
              recyclingGuide.push({
                type: "difficult",
                title: cleanMarkdownText(caseMatch[1].trim()),
                content: cleanMarkdownText(caseMatch[2].trim())
              });
            } else {
              const content = caseItem.replace(/^\*\s+/, '').trim();
              if (content) {
                recyclingGuide.push({
                  type: "difficult",
                  title: "주의사항",
                  content: cleanMarkdownText(content)
                });
              }
            }
          });
        }
        break;
      }
    }
  }

  console.log("파싱 완료 - statusAnalysis:", statusAnalysis, "recyclingGuide:", recyclingGuide);
  return { statusAnalysis, recyclingGuide };
};

const ResultSections = ({ result }) => {
  const category = result?.label || result?.category || "-";
  const guide = result?.guide;
  const confidence = result?.confidence || 0;
  
  // 디버깅을 위한 로그
  console.log("ResultSections - result:", result);
  console.log("ResultSections - guide:", guide);
  console.log("ResultSections - confidence:", confidence, typeof confidence);
  console.log("ResultSections - confidence > 0:", confidence > 0);
  
  // VLM 가이드 파싱
  const { statusAnalysis, recyclingGuide } = parseVLMGuide(guide);
  
  // 파싱 결과 디버깅
  console.log("statusAnalysis:", statusAnalysis);
  console.log("recyclingGuide:", recyclingGuide);


  return (
    <div className="result-details">
      <SectionCard title="품목 종류" icon={CategoryIcon} color="#4CAF50">
          <div className="category-display">
            {confidence > 0.1 ? (
              <span className="category-badge-large">품목 : {category} 신뢰도 : {(confidence * 100).toFixed(1)}%</span>
            ) : (
              <span className="category-badge-large">품목 : {category}</span>
            )}
          </div>
      </SectionCard>


      <SectionCard title="상태 분석" icon={CategoryIcon} color="#2196F3">
        {statusAnalysis.length > 0 ? (
          <div className="analysis-content">
            {statusAnalysis.map((analysis, idx) => (
              <div key={idx} className="analysis-item">
                <h4 className="analysis-title">{analysis.title}</h4>
                <p className="analysis-text">{analysis.content}</p>
              </div>
            ))}
          </div>
        ) : guide ? (
          // VLM 결과는 있지만 파싱에 실패한 경우 원본 텍스트 표시
          <div className="analysis-content">
            <div className="analysis-item">
              <h4 className="analysis-title">분석 결과</h4>
              <p className="analysis-text">{cleanMarkdownText(guide.substring(0, 500))}...</p>
            </div>
          </div>
        ) : (
          <PlaceholderList message="상태 분석 결과를 확인해보세요" />

        )}
      </SectionCard>

      <SectionCard
        title="분리수거 가이드"
        icon={DisposalIcon}
        color="#FF9800"
      >
        {recyclingGuide.length > 0 ? (
          <div className="guide-content">
            {/* 분리배출이 가능한 경우 */}
            {recyclingGuide.some(item => item.type === "possible") && (
              <div className="guide-section">
                <h4 className="guide-section-title possible">
                  ✅ 분리배출이 가능한 경우
                </h4>
                <div className="guide-steps">
                  {recyclingGuide
                    .filter(item => item.type === "possible")
                    .map((step, idx) => (
                      <div key={idx} className="guide-step">
                        <h5 className="step-title">{step.title}</h5>
                        <p className="step-content">{step.content}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* 분리가 어려운 경우 */}
            {recyclingGuide.some(item => item.type === "difficult") && (
              <div className="guide-section">
                <h4 className="guide-section-title difficult">
                  ⚠️ 분리가 어려운 경우
                </h4>
                <div className="guide-steps">
                  {recyclingGuide
                    .filter(item => item.type === "difficult")
                    .map((step, idx) => (
                      <div key={idx} className="guide-step">
                        <h5 className="step-title">{step.title}</h5>
                        <p className="step-content">{step.content}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : guide ? (
          // VLM 결과는 있지만 파싱에 실패한 경우 원본 텍스트 표시
          <div className="guide-content">
            <div className="guide-section">
              <h4 className="guide-section-title possible">
                📋 분리수거 가이드
              </h4>
              <div className="guide-steps">
                <div className="guide-step">
                  <p className="step-content" style={{whiteSpace: 'pre-wrap'}}>{cleanMarkdownText(guide)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PlaceholderList message="분리수거 가이드를 확인해보세요" />
        )}
      </SectionCard>
    </div>
  );
};

export default ResultSections;
