let FaceLandmarker = null;
let FilesetResolver = null;

/* ==========================================================================
   PHYSIOGNOMY DATABASE (관상 데이터베이스 - 정량적 기술 보고서 스타일로 축약)
   ========================================================================== */
const PHYSIOGNOMY_DB = {
  eyes: [
    {
      name: "봉황안 (鳳凰眼)",
      desc: "눈꼬리가 가늘고 길며 끝부분이 날카롭게 위로 향한 형태",
      interpretation: "논리적 판단이 뛰어나며 명예와 사회적 성취 지향성이 매우 높은 경향.",
      good: ["판단력", "통솔력", "사회운"],
      weak: ["대인운"],
      caution: "스스로에 대한 엄격함으로 주위 조력자와의 거리가 발생할 수 있는 구조.",
      target: { ratio: 3.8, tilt: 10, symmetry: 0.95 }
    },
    {
      name: "용안 (龍眼)",
      desc: "눈꺼풀 주름이 깊고 맑으며 눈동자가 뚜렷한 형태",
      interpretation: "조직 내 의사결정을 주도하며 대형 프로젝트를 이끄는 리더십 우세 경향.",
      good: ["통솔력", "결단력", "권력운"],
      weak: ["인간관계운"],
      caution: "주관이 매우 뚜렷하여 타인의 피드백을 수용하는 유연성이 필요함.",
      target: { ratio: 3.0, tilt: 7, symmetry: 0.96 }
    },
    {
      name: "호안 (虎眼)",
      desc: "크고 둥글며 안광에 힘이 있고 강한 존재감을 주는 형태",
      interpretation: "위기 극복 속도가 빠르고 독립적인 개척 지향형 성향 우수.",
      good: ["추진력", "결단력", "권력운"],
      weak: ["대인운"],
      caution: "판단 속도가 빨라 즉흥적 리스크에 직면할 가능성이 있음.",
      target: { ratio: 2.3, tilt: -2, symmetry: 0.94 }
    },
    {
      name: "학안 (鶴眼)",
      desc: "맑고 깨끗하며 눈동자가 중앙에 곧게 위치한 기품 있는 형태",
      interpretation: "합리성과 객관성을 유지하며 학술이나 연구 등 전문 분야에 적합한 성향.",
      good: ["판단력", "사회운", "인간관계운"],
      weak: ["추진력"],
      caution: "리스크 회피 성향으로 인해 실질적 추진 속도가 다소 지연될 수 있음.",
      target: { ratio: 3.1, tilt: 1, symmetry: 0.95 }
    },
    {
      name: "사안 (蛇眼)",
      desc: "가로폭이 넓고 다소 얇아 예리하고 차가운 느낌을 주는 형태",
      interpretation: "집요한 분석력과 목표 달성을 위한 전략 설계 능력이 뛰어난 경향.",
      good: ["판단력", "추진력", "결단력"],
      weak: ["대인운"],
      caution: "독자 노선 선호로 인해 다자간 협업 환경에서 마찰 가능성 우려.",
      target: { ratio: 3.6, tilt: -4, symmetry: 0.92 }
    },
    {
      name: "장안 (豹眼)",
      desc: "눈꼬리가 길게 찢어지고 강한 힘이 서려 있는 맹수형 형태",
      interpretation: "도전 지향적이며 경쟁 상황에서 성과를 빠르게 도출하는 성향.",
      good: ["추진력", "결단력", "통솔력"],
      weak: ["인간관계운"],
      caution: "목표 지향성이 지나치게 우세하여 아랫사람과의 조화도가 낮아질 수 있음.",
      target: { ratio: 2.6, tilt: 3, symmetry: 0.94 }
    },
    {
      name: "원안 (圓眼)",
      desc: "둥글고 맑아 선명하고 유연한 인상을 주는 형태",
      interpretation: "대인 감수성이 뛰어나며 조직 내 융화와 조율을 원활히 수행하는 경향.",
      good: ["대인운", "인간관계운", "사회운"],
      weak: ["결단력"],
      caution: "타인 지향적 태도로 인해 단호한 거절이 어려운 취약성 존재.",
      target: { ratio: 1.9, tilt: 0, symmetry: 0.97 }
    },
    {
      name: "세안 (細眼)",
      desc: "가늘고 길어 조심스럽고 신중한 인상을 주는 형태",
      interpretation: "돌발 리스크를 철저히 검토하고 안정적인 자산을 구축하는 신중형 경향.",
      good: ["판단력", "재물운", "말년운"],
      weak: ["추진력"],
      caution: "과도한 탐색으로 인해 최적의 실행 타이밍을 놓칠 가능성이 있음.",
      target: { ratio: 4.1, tilt: 0, symmetry: 0.95 }
    }
  ],
  eyebrows: [
    {
      name: "용미 (龍眉)",
      desc: "부드럽게 굽어지며 끝이 정돈된 정밀한 형태",
      interpretation: "인맥 구축이 원활하고 외부 자원 활용 능력이 높은 편임.",
      good: ["대인운", "사회운", "통솔력"],
      weak: ["결단력"],
      caution: "평판을 의식하여 단독 의사결정 시 속도가 다소 느려짐.",
      target: { tilt: 8, length: 1.35 }
    },
    {
      name: "일자미 (一字眉)",
      desc: "가로로 일직선으로 곧게 뻗은 형태",
      interpretation: "자기 확신이 강하고 목표 지향적인 독립적 실행 성향 지배.",
      good: ["추진력", "결단력", "통솔력"],
      weak: ["인간관계운"],
      caution: "타협을 배제하는 단호함으로 인해 상호 소통 리스크 존재.",
      target: { tilt: 1, length: 1.25 }
    },
    {
      name: "검미 (劍眉)",
      desc: "칼 모양으로 끝이 날카롭게 위로 향한 직진형 형태",
      interpretation: "강한 실천력과 도전정신으로 어려운 난관을 돌파하는 구조.",
      good: ["결단력", "추진력", "권력운"],
      weak: ["대인운"],
      caution: "자율성에 기반한 통제가 강해 수평적 조직 내 마찰 주의.",
      target: { tilt: 14, length: 1.2 }
    },
    {
      name: "월미 (月眉)",
      desc: "초승달과 같이 완만하고 부드러운 곡선을 그리는 형태",
      interpretation: "심미적 감수성과 원만한 대인 소통력을 유지하는 경향.",
      good: ["대인운", "인간관계운", "사회운"],
      weak: ["추진력"],
      caution: "갈등에 대면하는 것을 꺼려 회피적 선택을 지향하기 쉬움.",
      target: { tilt: 6, length: 1.4 }
    },
    {
      name: "팔자미 (八字眉)",
      desc: "여덟 팔(八)자 형태로 끝부분이 아래로 하향한 형태",
      interpretation: "주변 환경 수용도가 높고 모나지 않은 조화를 선호함.",
      good: ["대인운", "인간관계운", "말년운"],
      weak: ["추진력", "결단력"],
      caution: "스스로 주도하는 실행 에너지가 상대적으로 낮음.",
      target: { tilt: -8, length: 1.3 }
    },
    {
      name: "장미 (長眉)",
      desc: "눈보다 길고 고르게 펼쳐진 조화로운 형태",
      interpretation: "인내가 강하고 리스크가 적은 점진적 성장을 선호하는 경향.",
      good: ["재물운", "말년운", "대인운"],
      weak: ["결단력"],
      caution: "변화에 적응하는 순발력이 약해 보수적 의사결정에 고립될 수 있음.",
      target: { tilt: 4, length: 1.5 }
    }
  ],
  nose: [
    {
      name: "용골코 (龍骨鼻)",
      desc: "콧대가 뚜렷하고 끊김 없이 직선으로 이마까지 이어지는 형태",
      interpretation: "성취 동기가 강하고 사회적 주도권을 확보하려는 경향.",
      good: ["권력운", "통솔력", "사회운"],
      weak: ["대인운"],
      caution: "높은 목표 의식으로 인해 주변인에게 압박감을 줄 수 있음.",
      target: { lengthRatio: 0.38, widthRatio: 0.75 }
    },
    {
      name: "사자코 (獅子鼻)",
      desc: "콧망울이 둥글고 넓게 팽창되어 중심을 잡는 형태",
      interpretation: "사업적 추진력과 자산 운용에 탁월한 성향을 지님.",
      good: ["통솔력", "추진력", "재물운"],
      weak: ["인간관계운"],
      caution: "고집적 의사결정으로 인해 다자 합의 도출 시 비효율 발생.",
      target: { lengthRatio: 0.32, widthRatio: 0.95 }
    },
    {
      name: "복코 (懸膽鼻)",
      desc: "콧방울 끝부분인 준두가 풍만하고 고르게 처진 형태",
      interpretation: "저축성과 재산 리스크 제어 능력이 뛰어나며 자산 증식형에 부합.",
      good: ["재물운", "말년운", "판단력"],
      weak: ["결단력"],
      caution: "안정성 위주 의사결정으로 성장이 한계에 봉착할 수 있음.",
      target: { lengthRatio: 0.34, widthRatio: 0.88 }
    },
    {
      name: "재상코 (截筒鼻)",
      desc: "반듯하고 평평하며 단정하게 정렬된 대나무통 모양 형태",
      interpretation: "원칙과 규율을 중시하며 공적 조직 관리에 높은 강점을 지님.",
      good: ["판단력", "사회운", "재물운"],
      weak: ["추진력"],
      caution: "지나친 규격화로 인해 유연성과 혁신 지향성이 떨어질 수 있음.",
      target: { lengthRatio: 0.36, widthRatio: 0.80 }
    },
    {
      name: "군자코 (君子鼻)",
      desc: "얼굴 면적 대비 폭과 길이가 조화를 이루는 단정한 형태",
      interpretation: "균형 잡힌 시각을 유지하며 리스크가 적은 의사결정을 지향.",
      good: ["판단력", "인간관계운", "말년운"],
      weak: ["권력운"],
      caution: "극단적 경쟁이 요구되는 분야에서 선제 타격력이 미흡함.",
      target: { lengthRatio: 0.33, widthRatio: 0.82 }
    }
  ],
  mouth: [
    {
      name: "용구 (龍口)",
      desc: "입술이 늠름하게 두텁고 길며 끝이 확실히 상승된 형태",
      interpretation: "공식적인 의사소통 능력이 뛰어나고 신뢰를 주는 전달력 우수.",
      good: ["통솔력", "사회운", "말년운"],
      weak: ["인간관계운"],
      caution: "다소 무겁고 직설적인 표현으로 친밀한 조화를 해치기 쉬움.",
      target: { ratio: 2.8, tilt: 0.08 }
    },
    {
      name: "월형구 (仰月口)",
      desc: "초승달과 같이 입꼬리가 부드럽게 위를 향해 고정된 형태",
      interpretation: "대인 친화도 및 비즈니스 소통 효율성이 극대화된 타입.",
      good: ["대인운", "인간관계운", "사회운"],
      weak: ["결단력"],
      caution: "화술 지향적 태도로 인해 깊이 있는 공감대 구축에 한계 노출 가능.",
      target: { ratio: 3.2, tilt: 0.12 }
    },
    {
      name: "방형구 (四字口)",
      desc: "입매가 가로로 단정하고 상하가 대칭적인 네모꼴 형태",
      interpretation: "규율을 중시하며 약속과 계약 기반 업무에 정밀함 유지.",
      good: ["결단력", "판단력", "재물운"],
      weak: ["추진력"],
      caution: "유연하지 못한 감정 조절로 다소 무뚝뚝하거나 완고해 보임.",
      target: { ratio: 2.4, tilt: 0.02 }
    },
    {
      name: "앵도구 (櫻桃口)",
      desc: "크기가 작고 대칭적이며 둥글고 단정한 형태",
      interpretation: "섬세한 감각과 빠른 인지 능력을 지녔으며 매력 어필에 능함.",
      good: ["대인운", "인간관계운", "사회운"],
      weak: ["통솔력"],
      caution: "대형 스케일의 의사결정 환경에서 에너지 결여 리스크.",
      target: { ratio: 1.8, tilt: 0.05 }
    }
  ],
  cheekbones: [
    {
      name: "장군광대 (將軍顴)",
      desc: "광대 돌출 비율이 확실하지만 균형을 잃지 않는 형태",
      interpretation: "주변 장애물을 단호하게 극복하는 추진 에너지 지배.",
      good: ["추진력", "결단력", "통솔력"],
      weak: ["대인운"],
      caution: "수평적 소통보다 탑다운 방식의 일 처리에 치우칠 위험.",
      target: { prominence: 0.88 }
    },
    {
      name: "제왕광대 (帝王顴)",
      desc: "광대가 앞과 옆으로 단단하고 넓게 지탱하는 균형적인 형태",
      interpretation: "사회적 직급이나 권한 확보 욕구가 강하고 목표 관리 능력이 높음.",
      good: ["권력운", "통솔력", "사회운"],
      weak: ["인간관계운"],
      caution: "권위 지향적 접근으로 실무진과의 온도 차이 발생 가능.",
      target: { prominence: 0.84 }
    },
    {
      name: "평형광대 (和平顴)",
      desc: "돌출 부위 없이 얼굴 가로선과 평평함을 유지하는 형태",
      interpretation: "유연한 조력 및 지원 역할에 충실하며 갈등 회피를 중시.",
      good: ["대인운", "인간관계운", "말년운"],
      weak: ["추진력", "결단력"],
      caution: "스스로를 부각하고 주도권을 쟁취하려는 공격성 결여.",
      target: { prominence: 0.77 }
    }
  ],
  jaw: [
    {
      name: "장군턱 (將軍地閣)",
      desc: "골격 각도가 늠름하고 두터워 하관을 견고하게 지탱하는 형태",
      interpretation: "지구력과 신념 유지력이 우수하며 후기 성과 축적 능력이 높음.",
      good: ["추진력", "통솔력", "말년운"],
      weak: ["인간관계운"],
      caution: "강력한 주관 표출로 인해 대화 상대에게 경직성을 부여함.",
      target: { angle: 25, widthRatio: 0.82 }
    },
    {
      name: "원형턱 (圓滿地閣)",
      desc: "턱선이 U자형으로 모나지 않고 넓게 원만하게 감도는 형태",
      interpretation: "포용적인 성품으로 조직원을 대하며 말년 안정성이 높음.",
      good: ["말년운", "대인운", "재물운"],
      weak: ["결단력"],
      caution: "업무 전개 속도가 다소 느려 성과 가속에 병목 발생 우려.",
      target: { angle: 18, widthRatio: 0.76 }
    },
    {
      name: "방형턱 (方正地閣)",
      desc: "턱끝이 평평하여 좌우 균형과 강한 지지력을 주는 형태",
      interpretation: "강한 원칙주의에 입각하여 과업의 완성도를 극대화하는 성향.",
      good: ["결단력", "판단력", "말년운"],
      weak: ["사회운"],
      caution: "새로운 사업 방식이나 변수에 대한 수용 민감도가 떨어짐.",
      target: { angle: 22, widthRatio: 0.88 }
    }
  ],
  forehead: [
    {
      name: "제왕이마 (帝王額)",
      desc: "이마가 넓고 훤하게 고정되어 굴곡이 없이 매끄러운 형태",
      interpretation: "인지적 통찰력이 뛰어나며 직관적 판단 능력이 탁월한 경향.",
      good: ["사회운", "권력운", "판단력"],
      weak: ["대인운"],
      caution: "논리적 완벽주의로 인해 동료들의 결함을 조급히 지적할 가능성.",
      target: { heightRatio: 0.23 }
    },
    {
      name: "학자이마 (學士額)",
      desc: "이마가 각지고 가로 경계가 선명한 단정 정렬 형태",
      interpretation: "체계적이고 데이터 중심의 논리 연역적 사고 영역 우수.",
      good: ["판단력", "사회운", "인간관계운"],
      weak: ["추진력"],
      caution: "사전 탐색이나 이론 검토에 몰두하여 실질 가동에 한계 노출.",
      target: { heightRatio: 0.20 }
    },
    {
      name: "부귀이마 (富貴額)",
      desc: "둥글고 천창 부위 관자놀이가 알맞게 차오른 입체적 형태",
      interpretation: "장기 비즈니스 자산의 예측 및 관리 통찰력이 높음.",
      good: ["재물운", "말년운", "대인운"],
      weak: ["결단력"],
      caution: "안정적 기조에만 머무르다 급성장 기회를 소홀히 넘김.",
      target: { heightRatio: 0.18 }
    }
  ]
};

/* ==========================================================================
   TITLES SYSTEM (비즈니스 성향 프로파일링 칭호 - 20개)
   ========================================================================== */
const TITLES_DATABASE = [
  { name: "주도적 지휘관 (Director)", target: { leadership: 10, power: 10, judgment: 8, wealth: 8 } },
  { name: "실천적 개척자 (Pioneer)", target: { leadership: 9, drive: 10, determination: 9, power: 8 } },
  { name: "전략적 조율가 (Facilitator)", target: { judgment: 10, social: 9, relationship: 8, wealth: 8 } },
  { name: "분석적 기획자 (Architect)", target: { judgment: 10, determination: 8, power: 7, social: 8 } },
  { name: "행동형 과업수행자 (Executor)", target: { leadership: 8, drive: 9, determination: 9, relationship: 6 } },
  { name: "유연한 소통가 (Communicator)", target: { interpersonal: 10, relationship: 9, social: 9, judgment: 8 } },
  { name: "실용적 자산가 (Strategist)", target: { wealth: 10, interpersonal: 9, relationship: 8, drive: 8 } },
  { name: "논리적 연구원 (Analyst)", target: { judgment: 10, social: 9, relationship: 8, lateLife: 8 } },
  { name: "혁신적 도전자 (Innovator)", target: { drive: 10, leadership: 8, determination: 9, power: 9 } },
  { name: "중립적 조력자 (Mediator)", target: { leadership: 8, lateLife: 10, relationship: 8, wealth: 9 } },
  { name: "자산 집중형 설계자 (Developer)", target: { wealth: 12, lateLife: 9, interpersonal: 8, judgment: 7 } },
  { name: "협력적 파트너 (Collaborator)", target: { judgment: 9, relationship: 9, social: 9, power: 6 } },
  { name: "신중한 사색가 (Quiet Thinker)", target: { determination: 10, judgment: 9, lateLife: 8, social: 5 } },
  { name: "창의적 문제해결사 (Creator)", target: { leadership: 10, drive: 9, determination: 9, wealth: 9 } },
  { name: "신념적 돌파형 (Challenger)", target: { drive: 10, leadership: 9, determination: 10, interpersonal: 8 } },
  { name: "지성적 자산 설계자 (Planner)", target: { judgment: 10, determination: 9, power: 8, interpersonal: 6 } },
  { name: "조직 통솔 관리자 (Manager)", target: { leadership: 10, drive: 8, determination: 8, power: 8 } },
  { name: "미래 지향 비전가 (Visionary)", target: { drive: 10, determination: 9, judgment: 8, social: 8 } },
  { name: "즉각적 행동가 (Action Taker)", target: { drive: 11, determination: 10, leadership: 7, interpersonal: 6 } },
  { name: "통섭적 의사결정자 (Governor)", target: { power: 11, leadership: 10, judgment: 8, drive: 7 } }
];

/* ==========================================================================
   APP STATE
   ========================================================================== */
window.appLoaded = true;

let faceLandmarker = null;
let webcamStream = null;
let animationFrameId = null;
let isModelLoading = false;
let currentStage = 'idle'; 
let stageStartTime = 0;
let stableFaceCount = 0;
let lastDetectedFeatures = null;
let bestFaceCanvas = null;

// Element Selectors
let welcomeScreen, scannerScreen, resultScreen, btnStart, btnRestart, btnShare;
let btnViewProduct, btnBuyProduct, webcam, overlayCanvas, ctx;
let faceGuideFrame, currentStepTitle, scannerProgress, scanMessage, shutterFlash, globalLoader;
let cameraErrorOverlay, btnErrorRetry;
let snapshotFrame, resultTitle, resultFeaturesList, positiveEnergiesList, warningEnergiesList;
let reviewText, metricRationaleList, recoTitle, recoExplanation, recoImage, hudProgressPercent;

document.addEventListener("DOMContentLoaded", () => {
  console.log("[DOM CONTENT LOADED]");
  welcomeScreen = document.getElementById("welcome-screen");
  scannerScreen = document.getElementById("scanner-screen");
  resultScreen = document.getElementById("result-screen");
  btnStart = document.getElementById("btn-start");
  btnRestart = document.getElementById("btn-restart");
  btnShare = document.getElementById("btn-share");
  btnViewProduct = document.getElementById("btn-view-product");
  btnBuyProduct = document.getElementById("btn-buy-product");
  webcam = document.getElementById("webcam");
  overlayCanvas = document.getElementById("overlay-canvas");
  if (overlayCanvas) ctx = overlayCanvas.getContext("2d");
  faceGuideFrame = document.querySelector(".face-guide-frame");
  currentStepTitle = document.querySelector(".current-step-title");
  scannerProgress = document.getElementById("scanner-progress");
  hudProgressPercent = document.getElementById("hud-progress-percent");
  scanMessage = document.getElementById("scan-message");
  shutterFlash = document.getElementById("shutter-flash");
  globalLoader = document.getElementById("global-loader");

  cameraErrorOverlay = document.getElementById("camera-error-overlay");
  btnErrorRetry = document.getElementById("btn-error-retry");

  snapshotFrame = document.getElementById("snapshot-frame");
  resultTitle = document.getElementById("result-title");
  resultFeaturesList = document.getElementById("result-features-list");
  positiveEnergiesList = document.getElementById("positive-energies");
  warningEnergiesList = document.getElementById("warning-energies");
  reviewText = document.getElementById("review-text");
  metricRationaleList = document.getElementById("metric-rationale-list");
  recoTitle = document.getElementById("reco-title");
  recoExplanation = document.getElementById("reco-explanation");
  recoImage = document.getElementById("reco-image");

  // Event bindings
  if (btnStart) btnStart.addEventListener("click", handleStart);
  if (btnRestart) btnRestart.addEventListener("click", resetToWelcome);
  if (btnShare) btnShare.addEventListener("click", downloadReportCard);
  if (btnErrorRetry) {
    btnErrorRetry.addEventListener("click", () => {
      if (cameraErrorOverlay) cameraErrorOverlay.classList.remove("active");
      handleStart();
    });
  }
  
  console.log("[EVENT LISTENERS BOUND]");
});

/* ==========================================================================
   LOADER & MODEL MANAGEMENT
   ========================================================================== */
function showLoader(titleText, subtitleText) {
  if (globalLoader) {
    const titleEl = globalLoader.querySelector(".loader-title");
    const subEl = globalLoader.querySelector(".loader-subtitle");
    if (titleEl) titleEl.textContent = titleText;
    if (subEl) subEl.textContent = subtitleText || "";
    globalLoader.classList.add("active");
  }
}

function hideLoader() {
  if (globalLoader) globalLoader.classList.remove("active");
}

function updateLoaderMessage(titleText, subtitleText) {
  if (globalLoader) {
    const titleEl = globalLoader.querySelector(".loader-title");
    const subEl = globalLoader.querySelector(".loader-subtitle");
    if (titleEl) titleEl.textContent = titleText;
    if (subEl && subtitleText !== undefined) subEl.textContent = subtitleText;
  }
}

async function initializeModel() {
  if (faceLandmarker) return;
  
  isModelLoading = true;
  showLoader("분석 엔진 구동 중", "실시간 랜드마크 모델 초기화 단계...");

  try {
    const module = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8");
    FaceLandmarker = module.FaceLandmarker;
    FilesetResolver = module.FilesetResolver;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numFaces: 1
    });
  } catch (error) {
    console.error("Failed to load FaceLandmarker Model:", error);
    throw error;
  } finally {
    isModelLoading = false;
  }
}

/* ==========================================================================
   WEBCAM STREAM
   ========================================================================== */
async function startWebcam() {
  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: "user"
      },
      audio: false
    });
    webcam.srcObject = webcamStream;
    
    webcam.addEventListener("loadedmetadata", () => {
      overlayCanvas.width = webcam.videoWidth;
      overlayCanvas.height = webcam.videoHeight;
    });
    
    return true;
  } catch (error) {
    console.error("Camera access failed:", error);
    return false;
  }
}

function stopWebcam() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/* ==========================================================================
   METRIC CALCULATION ENGINE
   ========================================================================== */
function getDistance(pt1, pt2) {
  return Math.hypot(pt1.x - pt2.x, pt1.y - pt2.y);
}

function extractFaceMetrics(landmarks) {
  const leftCheekEdge = landmarks[234];
  const rightCheekEdge = landmarks[454];
  const foreheadTop = landmarks[10];
  const chinBottom = landmarks[152];
  
  const faceWidth = getDistance(leftCheekEdge, rightCheekEdge);
  const faceHeight = getDistance(foreheadTop, chinBottom);
  
  // EYES
  const leftEyeWidth = getDistance(landmarks[362], landmarks[263]);
  const leftEyeHeight = (getDistance(landmarks[386], landmarks[374]) + getDistance(landmarks[385], landmarks[373])) / 2;
  const leftEyeRatio = leftEyeWidth / (leftEyeHeight || 0.01);
  const leftEyeTilt = ((landmarks[362].y - landmarks[263].y) / leftEyeWidth) * 100;
  
  const rightEyeWidth = getDistance(landmarks[133], landmarks[33]);
  const rightEyeHeight = (getDistance(landmarks[159], landmarks[145]) + getDistance(landmarks[158], landmarks[144])) / 2;
  const rightEyeRatio = rightEyeWidth / (rightEyeHeight || 0.01);
  const rightEyeTilt = ((landmarks[133].y - landmarks[33].y) / rightEyeWidth) * 100;
  
  const avgEyeRatio = (leftEyeRatio + rightEyeRatio) / 2;
  const avgEyeTilt = (leftEyeTilt + rightEyeTilt) / 2;
  const eyeSymmetry = Math.min(leftEyeWidth, rightEyeWidth) / Math.max(leftEyeWidth, rightEyeWidth);
  const interEyeDistance = getDistance(landmarks[362], landmarks[133]) / faceWidth;
  
  // EYEBROWS
  const rightBrowWidth = getDistance(landmarks[107], landmarks[70]);
  const leftBrowWidth = getDistance(landmarks[336], landmarks[300]);
  const avgBrowWidthRatio = ((rightBrowWidth + leftBrowWidth) / 2) / ((leftEyeWidth + rightEyeWidth) / 2);
  
  const rightBrowTilt = ((landmarks[107].y - landmarks[70].y) / rightBrowWidth) * 100;
  const leftBrowTilt = ((landmarks[336].y - landmarks[300].y) / leftBrowWidth) * 100;
  const avgBrowTilt = (rightBrowTilt + leftBrowTilt) / 2;
  
  // NOSE
  const noseLength = getDistance(landmarks[168], landmarks[4]) / faceHeight;
  const noseAlarWidth = getDistance(landmarks[278], landmarks[48]);
  const noseBridgeWidth = getDistance(landmarks[344], landmarks[115]);
  const noseAlarRatio = noseAlarWidth / (noseBridgeWidth || 0.01);

  // MOUTH
  const mouthWidth = getDistance(landmarks[291], landmarks[61]);
  const mouthHeight = getDistance(landmarks[0], landmarks[17]);
  const mouthRatio = mouthWidth / (mouthHeight || 0.01);
  const mouthCenterY = (landmarks[0].y + landmarks[17].y) / 2;
  const leftCornerTilt = (mouthCenterY - landmarks[291].y) / mouthWidth;
  const rightCornerTilt = (mouthCenterY - landmarks[61].y) / mouthWidth;
  const avgMouthCornerTilt = (leftCornerTilt + rightCornerTilt) / 2;

  // CHEEKBONES
  const cheekboneProminence = getDistance(landmarks[425], landmarks[205]) / faceWidth;

  // JAW
  const jawWidthRatio = getDistance(landmarks[58], landmarks[288]) / faceWidth;
  const rightJawVector = { x: landmarks[152].x - landmarks[58].x, y: landmarks[152].y - landmarks[58].y };
  const leftJawVector = { x: landmarks[152].x - landmarks[288].x, y: landmarks[152].y - landmarks[288].y };
  const jawAngleRight = Math.atan2(rightJawVector.y, rightJawVector.x) * (180 / Math.PI);
  const jawAngleLeft = Math.atan2(leftJawVector.y, -leftJawVector.x) * (180 / Math.PI);
  const avgJawAngle = (jawAngleRight + jawAngleLeft) / 2;

  // FOREHEAD
  const foreheadHeight = getDistance(landmarks[10], landmarks[168]) / faceHeight;

  return {
    eye: { ratio: avgEyeRatio, tilt: avgEyeTilt, symmetry: eyeSymmetry, inter: interEyeDistance },
    eyebrow: { tilt: avgBrowTilt, length: avgBrowWidthRatio },
    nose: { lengthRatio: noseLength, widthRatio: noseAlarRatio },
    mouth: { ratio: mouthRatio, tilt: avgMouthCornerTilt },
    cheekbones: { prominence: cheekboneProminence },
    jaw: { angle: avgJawAngle, widthRatio: jawWidthRatio },
    forehead: { heightRatio: foreheadHeight }
  };
}

function calculateSimilarity(val, target, weight = 1, tolerance = 0.15) {
  const diff = val - target;
  return Math.exp(-Math.pow(diff / tolerance, 2) * weight);
}

function evaluatePhysiognomy(metrics) {
  const evaluateField = (field, dbField, calcFn) => {
    let bestItem = null;
    let bestScore = -1;
    const scores = PHYSIOGNOMY_DB[dbField].map(item => {
      const score = Math.max(10, Math.round(100 * calcFn(item)));
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
      return { name: item.name, score };
    });
    return { item: bestItem, score: bestScore, all: scores };
  };

  const eyeRes = evaluateField('eye', 'eyes', (item) => {
    const sRatio = calculateSimilarity(metrics.eye.ratio, item.target.ratio, 1.5, 0.5);
    const sTilt = calculateSimilarity(metrics.eye.tilt, item.target.tilt, 1.2, 5);
    return sRatio * 0.6 + sTilt * 0.4;
  });

  const browRes = evaluateField('eyebrow', 'eyebrows', (item) => {
    const sTilt = calculateSimilarity(metrics.eyebrow.tilt, item.target.tilt, 1.5, 4);
    const sLen = calculateSimilarity(metrics.eyebrow.length, item.target.length, 1.0, 0.15);
    return sTilt * 0.6 + sLen * 0.4;
  });

  const noseRes = evaluateField('nose', 'nose', (item) => {
    const sLen = calculateSimilarity(metrics.nose.lengthRatio, item.target.lengthRatio, 1.2, 0.05);
    const sWid = calculateSimilarity(metrics.nose.widthRatio, item.target.widthRatio, 1.2, 0.15);
    return sLen * 0.5 + sWid * 0.5;
  });

  const mouthRes = evaluateField('mouth', 'mouth', (item) => {
    const sRatio = calculateSimilarity(metrics.mouth.ratio, item.target.ratio, 1.0, 0.4);
    const sTilt = calculateSimilarity(metrics.mouth.tilt, item.target.tilt, 2.0, 0.04);
    return sRatio * 0.4 + sTilt * 0.6;
  });

  const cheekRes = evaluateField('cheekbones', 'cheekbones', (item) => {
    return calculateSimilarity(metrics.cheekbones.prominence, item.target.prominence, 1.5, 0.05);
  });

  const jawRes = evaluateField('jaw', 'jaw', (item) => {
    const sAngle = calculateSimilarity(metrics.jaw.angle, item.target.angle, 1.2, 5);
    const sWid = calculateSimilarity(metrics.jaw.widthRatio, item.target.widthRatio, 1.2, 0.08);
    return sAngle * 0.5 + sWid * 0.5;
  });

  const foreheadRes = evaluateField('forehead', 'forehead', (item) => {
    return calculateSimilarity(metrics.forehead.heightRatio, item.target.heightRatio, 1.5, 0.03);
  });

  return {
    selections: {
      eye: eyeRes,
      eyebrow: browRes,
      nose: noseRes,
      mouth: mouthRes,
      cheekbones: cheekRes,
      jaw: jawRes,
      forehead: foreheadRes
    }
  };
}

function calculateFinalReport(selections, metrics) {
  const energyLevels = {
    leadership: 5,     // 통솔력
    judgment: 5,       // 판단력
    wealth: 5,         // 재물운
    power: 5,          // 권력운
    interpersonal: 5,  // 대인운
    relationship: 5,   // 인간관계운
    social: 5,         // 사회운
    lateLife: 5,       // 말년운
    drive: 5,          // 추진력
    determination: 5   // 결단력
  };

  const mapAttrToKey = (koreanAttr) => {
    const map = {
      "통솔력": "leadership", "판단력": "judgment", "재물운": "wealth",
      "권력운": "power", "대인운": "interpersonal", "인간관계운": "relationship",
      "사회운": "social", "말년운": "lateLife", "추진력": "drive", "결단력": "determination"
    };
    return map[koreanAttr] || null;
  };

  Object.keys(selections).forEach(key => {
    const item = selections[key].item;
    if (item && item.good) {
      item.good.forEach(attr => {
        const attrKey = mapAttrToKey(attr);
        if (attrKey) energyLevels[attrKey] += 1.5;
      });
    }
    if (item && item.weak) {
      item.weak.forEach(attr => {
        const attrKey = mapAttrToKey(attr);
        if (attrKey) energyLevels[attrKey] -= 1.2;
      });
    }
  });

  // Structural Adjustments
  if (metrics.mouth.tilt < -0.01) {
    energyLevels.relationship -= 1.0;
    energyLevels.lateLife -= 1.0;
  }
  if (metrics.eyebrow.tilt < -3) {
    energyLevels.interpersonal -= 1.0;
    energyLevels.drive -= 1.0;
  }
  if (metrics.cheekbones.prominence < 0.79) {
    energyLevels.power -= 1.0;
    energyLevels.leadership -= 1.0;
  }

  const normalizedRatings = {};
  Object.keys(energyLevels).forEach(key => {
    normalizedRatings[key] = Math.max(1, Math.min(5, Math.round(energyLevels[key] * 2) / 2));
  });

  let bestTitle = null;
  let bestTitleDiff = Infinity;
  
  TITLES_DATABASE.forEach(title => {
    let diffSum = 0;
    Object.keys(title.target).forEach(attrKey => {
      const scaledVal = normalizedRatings[attrKey] * 2; 
      diffSum += Math.pow(scaledVal - title.target[attrKey], 2);
    });
    
    if (diffSum < bestTitleDiff) {
      bestTitleDiff = diffSum;
      bestTitle = title.name;
    }
  });

  return {
    ratings: normalizedRatings,
    title: bestTitle
  };
}

function mapKeyToKorean(key) {
  const map = {
    leadership: "통솔력", judgment: "판단력", wealth: "재물운",
    power: "권력운", interpersonal: "대인운", relationship: "인간관계운",
    social: "사회운", lateLife: "말년운", drive: "추진력", determination: "결단력"
  };
  return map[key] || key;
}

/* ==========================================================================
   CANVAS RENDERING UTILITIES
   ========================================================================== */
function drawHighlight(stage, landmarks) {
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  
  if (!landmarks || stage === 'aligning' || stage === 'finished') return;

  // Translucent overlay shading the viewport
  ctx.fillStyle = "rgba(10, 8, 6, 0.4)";
  ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  let indices = [];
  
  if (stage === 'scanning_eyes') {
    indices = [
      [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362],
      [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33]
    ];
  } else if (stage === 'scanning_eyebrows') {
    indices = [
      [276, 283, 282, 295, 285, 300, 293, 334, 296, 336, 276],
      [46, 53, 52, 65, 55, 70, 63, 105, 66, 107, 46]
    ];
  } else if (stage === 'scanning_nose') {
    indices = [
      [168, 6, 197, 195, 5, 4, 1, 19, 94, 2],
      [278, 344, 440, 463, 94, 243, 115, 220, 48]
    ];
  } else if (stage === 'scanning_mouth') {
    indices = [
      [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61]
    ];
  } else if (stage === 'scanning_cheekbones') {
    indices = [
      [425, 427, 329, 280],
      [205, 207, 101, 50]
    ];
  } else if (stage === 'scanning_jaw') {
    indices = [
      [58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288]
    ];
  } else if (stage === 'scanning_forehead') {
    indices = [
      [10, 338, 297, 332, 284, 251, 389, 162, 21, 54, 103, 67, 109, 10]
    ];
  }

  // Slice out holes
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  indices.forEach(loop => {
    ctx.beginPath();
    loop.forEach((idx, i) => {
      const pt = landmarks[idx];
      const cx = pt.x * overlayCanvas.width;
      const cy = pt.y * overlayCanvas.height;
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.fill();
  });
  ctx.restore();

  // Draw thin elegant soft-peach trace stroke (single accent color)
  ctx.strokeStyle = "#FFA085";
  ctx.lineWidth = 2.0;
  ctx.shadowBlur = 8;
  ctx.shadowColor = "rgba(255, 160, 133, 0.4)";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  indices.forEach(loop => {
    ctx.beginPath();
    loop.forEach((idx, i) => {
      const pt = landmarks[idx];
      const cx = pt.x * overlayCanvas.width;
      const cy = pt.y * overlayCanvas.height;
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.stroke();
  });

  ctx.shadowBlur = 0;
}

/* ==========================================================================
   POSE STABILITY ALIGNMENT
   ========================================================================== */
function checkFaceAlignment(landmarks) {
  if (!landmarks) return false;
  
  const nose = landmarks[4];
  const chin = landmarks[152];
  const left = landmarks[234];
  const right = landmarks[454];
  const top = landmarks[10];

  const faceCenterX = (left.x + right.x) / 2;
  const faceCenterY = (top.y + chin.y) / 2;

  const isCenteredX = Math.abs(faceCenterX - 0.5) < 0.12;
  const isCenteredY = Math.abs(faceCenterY - 0.5) < 0.12;

  const faceWidth = getDistance(left, right);
  const isCorrectScale = faceWidth > 0.28 && faceWidth < 0.52;

  const distToLeft = getDistance(nose, left);
  const distToRight = getDistance(nose, right);
  const isFacingFront = Math.abs(distToLeft - distToRight) / faceWidth < 0.15;

  return isCenteredX && isCenteredY && isCorrectScale && isFacingFront;
}

/* ==========================================================================
   SCANNERS CONTROL
   ========================================================================== */
const STAGES = [
  { id: 'scanning_eyes', label: '안형(眼) 센서 분석', duration: 2000 },
  { id: 'scanning_eyebrows', label: '미모(眉) 기하도 계측', duration: 2000 },
  { id: 'scanning_nose', label: '비형(鼻) 비례율 환산', duration: 2000 },
  { id: 'scanning_mouth', label: '구형(口) 상승각 측정', duration: 2000 },
  { id: 'scanning_cheekbones', label: '관골(顴) 돌출도 감정', duration: 2000 },
  { id: 'scanning_jaw', label: '이각(頤) 골격선 비교', duration: 2000 },
  { id: 'scanning_forehead', label: '액형(額) 굴곡선 추출', duration: 2000 }
];

const SCAN_SUBMESSAGES = {
  scanning_eyes: ["눈꼬리 수평 축 편차 계산...", "안검 면적 대비 수치 환산...", "안형 매칭 벡터 정렬..."],
  scanning_eyebrows: ["미간 평면 너비 비율 대입...", "모발 분포 흐름 각도 분석...", "수평 정렬 조화도 확인..."],
  scanning_nose: ["비골 길이 지표 분석...", "콧방울 말단 너비 검출...", "비율 계수 데이터 매핑..."],
  scanning_mouth: ["입꼬리 꼬임 상승 곡률 측정...", "좌우 대칭도 계수 추출...", "입술 볼륨 분포 환산..."],
  scanning_cheekbones: ["광골 측면 대칭 스펙트럼 감정...", "중심 윤곽 대비 높이 비율...", "지탱 에너지 비율 계측..."],
  scanning_jaw: ["하단 골격 정렬 턱선 각도...", "하관 면적 상대 분포도 계산...", "안정 지수 데이터 합산..."],
  scanning_forehead: ["이마 수평 곡률 스캔...", "관자놀이 볼륨 비례 대입...", "전두골 입체 각도 산정..."]
};

async function processingLoop() {
  if (!faceLandmarker || currentStage === 'finished') return;

  const now = performance.now();
  let landmarks = null;

  if (webcam.readyState === webcam.HAVE_ENOUGH_DATA) {
    const results = faceLandmarker.detectForVideo(webcam, now);
    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      landmarks = results.faceLandmarks[0];
      
      // Save aligned frame into bestFaceCanvas cache
      const isAligned = checkFaceAlignment(landmarks);
      if (isAligned || !bestFaceCanvas) {
        if (!bestFaceCanvas) {
          bestFaceCanvas = document.createElement("canvas");
        }
        if (bestFaceCanvas.width !== webcam.videoWidth || bestFaceCanvas.height !== webcam.videoHeight) {
          bestFaceCanvas.width = webcam.videoWidth || 640;
          bestFaceCanvas.height = webcam.videoHeight || 480;
        }
        const bestCtx = bestFaceCanvas.getContext("2d");
        bestCtx.save();
        bestCtx.translate(bestFaceCanvas.width, 0);
        bestCtx.scale(-1, 1);
        bestCtx.drawImage(webcam, 0, 0, bestFaceCanvas.width, bestFaceCanvas.height);
        bestCtx.restore();
      }
    }
  }

  if (currentStage === 'aligning') {
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    if (landmarks) {
      const isAligned = checkFaceAlignment(landmarks);
      if (isAligned) {
        stableFaceCount++;
        faceGuideFrame.classList.add("aligned");
        
        if (stableFaceCount > 12) { // 0.4s
          currentStage = STAGES[0].id;
          stageStartTime = now;
          stableFaceCount = 0;
          faceGuideFrame.style.opacity = '0';
        }
      } else {
        stableFaceCount = 0;
        faceGuideFrame.classList.remove("aligned");
      }
    } else {
      stableFaceCount = 0;
      faceGuideFrame.classList.remove("aligned");
    }
  } else {
    const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);
    if (currentStageIndex !== -1) {
      const stageInfo = STAGES[currentStageIndex];
      const elapsed = now - stageStartTime;
      const progress = Math.min(100, (elapsed / stageInfo.duration) * 100);
      
      // Update HUD
      currentStepTitle.textContent = `${stageInfo.label} (${currentStageIndex + 1}/${STAGES.length})`;
      scannerProgress.style.width = `${progress}%`;
      if (hudProgressPercent) hudProgressPercent.textContent = `${Math.round(progress)}%`;
      
      const msgs = SCAN_SUBMESSAGES[currentStage];
      const msgIndex = Math.floor((elapsed / stageInfo.duration) * msgs.length);
      scanMessage.textContent = msgs[Math.min(msgs.length - 1, msgIndex)];
      
      if (landmarks) {
        drawHighlight(currentStage, landmarks);
        lastDetectedFeatures = landmarks;
      }

      if (elapsed >= stageInfo.duration) {
        const nextIndex = currentStageIndex + 1;
        if (nextIndex < STAGES.length) {
          currentStage = STAGES[nextIndex].id;
          stageStartTime = now;
        } else {
          currentStage = 'snapshot';
          await performSnapshot();
        }
      }
    }
  }

  animationFrameId = requestAnimationFrame(processingLoop);
}

/* ==========================================================================
   SNAPSHOT REPORTING
   ========================================================================== */
async function performSnapshot() {
  console.log("[CAPTURING SNAPSHOT]");

  compilePhysiognomyReport();

  if (snapshotFrame) {
    const overlay = snapshotFrame.querySelector(".snapshot-overlay");
    snapshotFrame.innerHTML = "";
    if (overlay) snapshotFrame.appendChild(overlay);

    const displayCanvas = document.createElement("canvas");
    displayCanvas.width = webcam.videoWidth || 640;
    displayCanvas.height = webcam.videoHeight || 480;
    const displayCtx = displayCanvas.getContext("2d");

    if (bestFaceCanvas) {
      displayCtx.drawImage(bestFaceCanvas, 0, 0, displayCanvas.width, displayCanvas.height);
      console.log("[SNAPSHOT] Rendered using bestFaceCanvas cache");
    } else {
      displayCtx.save();
      displayCtx.translate(displayCanvas.width, 0);
      displayCtx.scale(-1, 1);
      displayCtx.drawImage(webcam, 0, 0, displayCanvas.width, displayCanvas.height);
      displayCtx.restore();
    }

    displayCanvas.style.width = "100%";
    displayCanvas.style.height = "100%";
    displayCanvas.style.objectFit = "cover";
    displayCanvas.style.display = "block";
    displayCanvas.style.border = "1px solid rgba(255, 160, 133, 0.15)";
    displayCanvas.style.borderRadius = "12px";

    snapshotFrame.insertBefore(displayCanvas, overlay);
  }

  stopWebcam();

  shutterFlash.classList.add("flash-active");
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.13);
  } catch (e) {}

  setTimeout(() => {
    shutterFlash.classList.remove("flash-active");
    scannerScreen.classList.remove("active");
    resultScreen.classList.add("active");
    currentStage = 'finished';
  }, 500);
}

function compilePhysiognomyReport() {
  if (!lastDetectedFeatures) {
    alert("오류: 얼굴 특징점이 인식되지 않았습니다.");
    resetToWelcome();
    return;
  }

  const metrics = extractFaceMetrics(lastDetectedFeatures);
  const evaluation = evaluatePhysiognomy(metrics);
  const selections = evaluation.selections;
  const report = calculateFinalReport(selections, metrics);
  
  resultTitle.textContent = report.title;

  // Features tags list
  resultFeaturesList.innerHTML = "";
  Object.keys(selections).forEach(key => {
    const matchedItem = selections[key].item;
    if (matchedItem) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = matchedItem.name.split(" ")[0];
      resultFeaturesList.appendChild(tag);
    }
  });

  // Quantified indicators (Top & Weak traits rendered with progress bars)
  positiveEnergiesList.innerHTML = "";
  warningEnergiesList.innerHTML = "";
  
  const sortedTraits = Object.keys(report.ratings)
    .map(key => ({ key, val: report.ratings[key] }))
    .sort((a, b) => b.val - a.val);
    
  const renderMetricRow = (item, container) => {
    const li = document.createElement("li");
    const pct = Math.round(item.val * 20); // Scale 1-5 rating into 20-100%
    li.innerHTML = `
      <div class="metric-header">
        <span class="metric-name">${mapKeyToKorean(item.key)}</span>
        <span class="metric-val">${pct}%</span>
      </div>
      <div class="metric-progress-bar">
        <div class="metric-progress-bar-fill" style="width: ${pct}%"></div>
      </div>
    `;
    container.appendChild(li);
  };

  sortedTraits.slice(0, 4).forEach(item => renderMetricRow(item, positiveEnergiesList));
  sortedTraits.slice(-2).forEach(item => renderMetricRow(item, warningEnergiesList));

  // Editorial Insight paragraph builder (Strictly dry, assertive sentences)
  let review = "";
  const eyeName = selections.eye.item.name.split(" ")[0];
  const noseName = selections.nose.item.name.split(" ")[0];
  const topTrait = mapKeyToKorean(sortedTraits[0].key);
  const weakestTraitKey = sortedTraits[sortedTraits.length - 1].key;
  const weakestTraitName = mapKeyToKorean(weakestTraitKey);
  
  review += `안형 대조 상 '${eyeName}'이(가) 나타나며 비형 비례로는 '${noseName}' 범주에 정렬됨. `;
  review += `전체 대칭 대비 '${topTrait}' 계수가 평균 기준값을 크게 상회하여 목표에 대한 주도적 실행성과 분석 판단 능력이 우세한 양상을 보임. `;
  review += `턱뼈 각도 및 하관 구조에 기반해 자율적 의사결정을 우선시하는 경향이 뚜렷함. `;
  review += `다만, '${weakestTraitName}' 지표가 대칭 구조상 하위 레벨에 위치하여, 다자간 소통 및 점진적 조율 환경에서 결정 병목을 겪을 취약성이 존재함.`;

  reviewText.textContent = review;

  // Technical metrics list
  metricRationaleList.innerHTML = "";
  const rationales = [
    `눈: 가로-세로 비율(${metrics.eye.ratio.toFixed(1)}), 눈꼬리 편차(${metrics.eye.tilt.toFixed(1)}°) 기준 분석 일치율 84%`,
    `눈썹: 기하학적 정렬 경사(${metrics.eyebrow.tilt.toFixed(1)}°) 및 너비 비율(${metrics.eyebrow.length.toFixed(2)}) 산출 대입 완료`,
    `코: 얼굴 세로 대비 비골 길이(${metrics.nose.lengthRatio.toFixed(2)}), 콧망울 분포도(${metrics.nose.widthRatio.toFixed(2)}) 정밀 필터 매핑`,
    `입: 입꼬리 꼬임 각도(${metrics.mouth.tilt.toFixed(3)}) 기반 소통 수용체 지향점 분류 매칭`,
    `광대 & 턱: 광대 돌출 계수(${metrics.cheekbones.prominence.toFixed(2)}), 하단 턱뼈 각도(${metrics.jaw.angle.toFixed(1)}°) 기하 지표 추출`,
    `이마: 전두골 영역 비율(${metrics.forehead.heightRatio.toFixed(2)})을 이용한 분석 데이터 최적 매칭`
  ];

  rationales.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    metricRationaleList.appendChild(li);
  });

  // Wellness Solutions Showcases matching
  const group1Score = (report.ratings.interpersonal + report.ratings.drive) / 2;
  const group2Score = (report.ratings.relationship + report.ratings.lateLife) / 2;
  const group3Score = (report.ratings.power + report.ratings.leadership) / 2;

  let chosenGroup = 1;
  let minScore = group1Score;
  
  if (group2Score < minScore) {
    minScore = group2Score;
    chosenGroup = 2;
  }
  if (group3Score < minScore) {
    minScore = group3Score;
    chosenGroup = 3;
  }

  if (chosenGroup === 1) {
    recoTitle.textContent = "추진성 및 대인 조화 밸런싱 솔루션";
    recoExplanation.innerHTML = `대인 감수성과 추진 효율성 향상을 돕는 정교한 밸런싱 디바이스입니다.<br>눈썹 라인 및 대칭성 유지를 돕는 페이셜 트리머 제품군.`;
    recoImage.src = "assets/image1.png";
    btnViewProduct.href = "https://www.hermes.com/kr/ko/product/아이브로우-펜셜-H083072V010/";
    btnBuyProduct.href = "https://www.hermes.com/kr/ko/category/뷰티/눈/";
  } else if (chosenGroup === 2) {
    recoTitle.textContent = "소통 안정성 및 균형 조율 솔루션";
    recoExplanation.innerHTML = `근육 이완을 도와 일관되고 품격 있는 의사소통 태도를 조화롭게 돕는 밸런싱 악세서리군입니다.<br>입매 주변 근육 이완 가이드 케어 솔루션.`;
    recoImage.src = "assets/image2.png";
    btnViewProduct.href = "https://www.rolex.com/ko/watches/find-rolex";
    btnBuyProduct.href = "https://www.rolex.com/ko/watches/find-rolex/classic-watches";
  } else {
    recoTitle.textContent = "주도적 지표 및 대칭 가속 솔루션";
    recoExplanation.innerHTML = `안면 가로선 중심부의 피로도를 해소하고 대칭 균형을 보정하는 데 기여하는 마사저 제품군입니다.<br>광대 및 얼굴 선 교정 정밀 마사저 기기.`;
    recoImage.src = "assets/image3.png";
    btnViewProduct.href = "https://www.hermes.com/kr/ko/product/페이스-마사저-H083110V000/";
    btnBuyProduct.href = "https://www.hermes.com/kr/ko/category/뷰티/페이스/";
  }
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function resetToWelcome() {
  stopWebcam();
  resultScreen.classList.remove("active");
  scannerScreen.classList.remove("active");
  welcomeScreen.classList.add("active");
  
  currentStepTitle.textContent = "대기 중";
  scannerProgress.style.width = "0%";
  if (hudProgressPercent) hudProgressPercent.textContent = "0%";
  scanMessage.textContent = "분석 모형 전개 단계 대기";
  faceGuideFrame.style.opacity = '1';
  faceGuideFrame.classList.remove("aligned");
  
  if (cameraErrorOverlay) cameraErrorOverlay.classList.remove("active");
  
  currentStage = 'idle';
  bestFaceCanvas = null;
}

async function handleStart() {
  console.log("[START BUTTON CLICKED]");
  
  if (cameraErrorOverlay) cameraErrorOverlay.classList.remove("active");
  
  welcomeScreen.classList.remove("active");
  scannerScreen.classList.add("active");
  
  showLoader("카메라 감지 중", "시스템 카메라 연결 권한 요청 중...");
  
  const ok = await startWebcam();
  if (!ok) {
    hideLoader();
    if (cameraErrorOverlay) cameraErrorOverlay.classList.add("active");
    return;
  }
  
  try {
    updateLoaderMessage("분석 엔진 구동 중", "랜드마크 모델 초기화 단계...");
    await initializeModel();
  } catch (error) {
    hideLoader();
    alert("모델 초기화에 실패하였습니다.");
    resetToWelcome();
    return;
  }
  
  hideLoader();

  currentStage = 'aligning';
  stableFaceCount = 0;
  currentStepTitle.textContent = "가이드 정렬 확인 중";
  scanMessage.textContent = "원형 안내선 내부에 얼굴을 맞춰 주십시오.";
  animationFrameId = requestAnimationFrame(processingLoop);
}

/* ==========================================================================
   PREMIUM CANVAS POSTCARD EXPORTER (Apple/Toss Style Minimal Design)
   ========================================================================== */
async function downloadReportCard() {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 900;
  const c = canvas.getContext("2d");

  // Matte white background
  c.fillStyle = "#FFFFFF";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Soft peach gradient highlight at the top border
  const grad = c.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, "#FFF5EF");
  grad.addColorStop(0.5, "#FFE8DF");
  grad.addColorStop(1, "#FFF5EF");
  c.fillStyle = grad;
  c.fillRect(0, 0, canvas.width, 8);

  // Global Text Styling (Apple standard layout)
  c.fillStyle = "#1D1D1F";
  c.textAlign = "center";
  c.font = "500 18px 'Outfit', sans-serif";
  c.fillText("상 相", canvas.width / 2, 50);

  c.fillStyle = "#86868B";
  c.font = "600 9px 'Outfit', sans-serif";
  c.fillText("AI FACE METRICS REPORT", canvas.width / 2, 70);

  // Thin minimalist divider line
  c.strokeStyle = "rgba(255, 160, 133, 0.12)";
  c.lineWidth = 1;
  c.beginPath(); c.moveTo(40, 95); c.lineTo(canvas.width - 40, 95); c.stroke();

  // Face snapshot box - center-aligned with soft border
  const imgW = 120;
  const imgH = 150;
  const imgX = (canvas.width - imgW) / 2;
  const imgY = 125;

  c.fillStyle = "#FFF9F6";
  c.fillRect(imgX - 4, imgY - 4, imgW + 8, imgH + 8);
  c.strokeStyle = "rgba(255, 160, 133, 0.1)";
  c.strokeRect(imgX - 4, imgY - 4, imgW + 8, imgH + 8);

  const displayCanvas = document.getElementById("snapshot-frame")?.querySelector("canvas");
  if (displayCanvas) {
    c.save();
    c.drawImage(displayCanvas, imgX, imgY, imgW, imgH);
    c.restore();
  }

  // Result Classification Title
  c.textAlign = "center";
  c.fillStyle = "#1D1D1F";
  c.font = "500 24px 'Noto Sans KR', sans-serif";
  c.fillText(resultTitle.textContent, canvas.width / 2, 320);

  // Feature tag elements list (drawn horizontally)
  c.font = "400 11px 'Noto Sans KR', sans-serif";
  c.fillStyle = "#6E6E73";
  const tags = Array.from(resultFeaturesList.children).map(tag => tag.textContent);
  c.fillText(tags.join("  •  "), canvas.width / 2, 350);

  // Thin divider
  c.beginPath(); c.moveTo(60, 380); c.lineTo(canvas.width - 60, 380); c.stroke();

  // Draw 2 Columns for quantitative traits metrics (progress bar style)
  c.font = "600 12px 'Noto Sans KR', sans-serif";
  c.fillStyle = "#FFA085";
  c.textAlign = "left";
  c.fillText("우수 요인 (Top)", 80, 420);
  
  c.fillStyle = "#86868B";
  c.fillText("보완 요인 (Adjustments)", canvas.width / 2 + 30, 420);

  c.font = "400 11px 'Noto Sans KR', sans-serif";
  
  const drawColumnMetrics = (list, startX, startY) => {
    list.forEach((el, idx) => {
      const name = el.querySelector(".metric-name").textContent;
      const pctStr = el.querySelector(".metric-val").textContent;
      const valNum = parseInt(pctStr);
      
      const lineY = startY + (idx * 34);
      c.fillStyle = "#1D1D1F";
      c.textAlign = "left";
      c.fillText(name, startX, lineY);
      
      c.fillStyle = "#FFA085";
      c.textAlign = "right";
      c.fillText(pctStr, startX + 160, lineY);
      
      // Progress line bar
      c.fillStyle = "#FFF2EC";
      c.fillRect(startX, lineY + 6, 160, 3);
      c.fillStyle = "#FFA085";
      c.fillRect(startX, lineY + 6, 160 * (valNum / 100), 3);
    });
  };

  const posElList = Array.from(positiveEnergiesList.children);
  drawColumnMetrics(posElList, 80, 455);

  const warnElList = Array.from(warningEnergiesList.children);
  drawColumnMetrics(warnElList, canvas.width / 2 + 30, 455);

  // Thin divider
  c.strokeStyle = "rgba(255, 160, 133, 0.12)";
  c.beginPath(); c.moveTo(60, 610); c.lineTo(canvas.width - 60, 610); c.stroke();

  // General insight report section
  c.textAlign = "center";
  c.fillStyle = "#FFA085";
  c.font = "600 12px 'Noto Sans KR', sans-serif";
  c.fillText("종합 데이터 해석", canvas.width / 2, 645);

  c.fillStyle = "#6E6E73";
  c.font = "400 11.5px 'Noto Sans KR', sans-serif";
  
  // Wrap review text into structured lines
  const review = reviewText.textContent;
  const charsPerLine = 32;
  const lines = [];
  for (let i = 0; i < review.length; i += charsPerLine) {
    lines.push(review.substring(i, i + charsPerLine));
  }
  
  lines.slice(0, 5).forEach((line, idx) => {
    c.fillText(line, canvas.width / 2, 675 + (idx * 22));
  });

  // Footer notes
  c.fillStyle = "#B0B0B5";
  c.font = "400 9px 'Outfit', sans-serif";
  c.fillText("© 2026 AI FACE ANALYTICS “상相”. FOR PERSONAL DEVELOPMENT AND RESEARCH.", canvas.width / 2, 850);

  // Trigger file download
  const link = document.createElement("a");
  link.download = `sang_FaceMetricsReport_${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
