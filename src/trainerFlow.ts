export type ResultTone = "pass" | "fail";

export type Specialty = {
  name: string;
  level: number;
};

export type CandidateProfile = {
  name: string;
  activeRegion: string;
  careerYears: string;
  certifications: string;
  introduction: string;
  specialties: Specialty[];
};

export type OfferStatus = "pending" | "accepted" | "declined" | "cancelled";

export type HiringOffer = {
  id: string;
  center: string;
  employmentType: string;
  salary: string;
  startDate: string;
  offeredAt: string;
  workSchedule: string;
  manager: string;
  phone: string;
  email: string;
  status: OfferStatus;
  message: string;
};

export type PerformanceStats = {
  totalCoachedMembers: string;
  averageReenrollmentRate: string;
  averagePtDurationMonths: string;
};

export type CaseTestAnswer = {
  assessment: string;
  prescription: string;
  communication: string;
  safety: string;
};

export type CaseAreaId = keyof CaseTestAnswer;

export type CaseTestArea = {
  id: CaseAreaId;
  number: string;
  name: string;
  question: string;
  description: string;
  minimumLength: number;
  criteria: string;
  placeholder: string;
};

export const CASE_TEST_AREAS: CaseTestArea[] = [
  {
    id: "assessment",
    number: "01",
    name: "평가 능력",
    question: "이 회원에게 추가로 확인해야 할 사항은 무엇인가요?",
    description: "회원의 현재 상태와 위험 요인을 파악하는 질문을 작성해 주세요.",
    minimumLength: 30,
    criteria: "주호소·병력·현재 상태 확인",
    placeholder: "통증 발생 시점, 강도, 과거 병력 등을 확인합니다."
  },
  {
    id: "prescription",
    number: "02",
    name: "운동 처방",
    question: "1~4주 운동 처방과 점진적 진행 방법을 제시해 주세요.",
    description: "회원의 목표와 현재 상태에 맞는 단계별 계획을 작성해 주세요.",
    minimumLength: 60,
    criteria: "운동 선택·점진적 부하·재평가",
    placeholder: "1~2주에는 통증 없는 범위에서 시작하고, 3~4주에는 점진적으로 부하를 적용합니다."
  },
  {
    id: "communication",
    number: "03",
    name: "커뮤니케이션",
    question: "회원에게 운동 계획과 목표를 어떻게 설명하고 동의를 이끌어 내시겠어요?",
    description: "회원의 불안을 낮추고 이해를 도울 설명을 작성해 주세요.",
    minimumLength: 40,
    criteria: "회원 눈높이 설명·목표 합의·피드백 확인",
    placeholder: "회원의 걱정을 먼저 듣고 오늘의 목표와 운동 방법, 중단 기준을 쉬운 말로 설명합니다."
  },
  {
    id: "safety",
    number: "04",
    name: "안전 고려",
    question: "어떤 상황에서 운동을 중단하고 병원 진료를 권하시겠어요?",
    description: "운동 중단 기준과 전문가 연계 기준을 작성해 주세요.",
    minimumLength: 40,
    criteria: "위험 신호·중단 기준·전문가 연계",
    placeholder: "통증이 증가하거나 위험 신호가 나타나면 즉시 중단하고 병원 진료를 권합니다."
  }
];

export type ScoreCriterion = {
  name: "평가 능력" | "운동 처방" | "커뮤니케이션" | "안전 고려";
  value: number;
};

export type CaseTestResult = {
  tone: ResultTone;
  overallScore: number;
  scoreByCriteria: ScoreCriterion[];
  strengths: string[];
  improvements: string[];
  feedbackSummary: string;
};

export type CaseTestValidation = {
  isValid: boolean;
  assessmentError: string | null;
  prescriptionError: string | null;
  communicationError?: string | null;
  safetyError?: string | null;
};

export type TrainerFlowInitialState = {
  profile: CandidateProfile;
  performanceStats: PerformanceStats;
  answers: CaseTestAnswer;
  offers: HiringOffer[];
  onboardingCompleted: boolean;
  verified: boolean;
  caseResult: CaseTestResult;
};

export const TRAINER_FLOW_STATE_KEY = "mvp.trainer-flow";

const specialtyNames = [
  "재활",
  "다이어트",
  "시니어 트레이닝",
  "퍼포먼스 / 스포츠",
  "체형 교정",
  "바디프로필 준비"
];

const demoOffers: HiringOffer[] = [
  {
    id: "offer-gangnam-001",
    center: "강남 리포머 피트니스",
    employmentType: "정직원",
    salary: "월 290만원 + 인센티브",
    startDate: "2026.08.01",
    offeredAt: "2026.07.18",
    workSchedule: "주 5일 · 오후 1시~9시",
    manager: "박서윤 매니저",
    phone: "010-4821-9033",
    email: "hire@reformer-gangnam.example",
    status: "pending",
    message:
      "재활 PT 경험과 회원 유지 성과를 보고 제안드립니다. 주 5일 오후 근무를 우선 협의하고 싶습니다."
  },
  {
    id: "offer-mapo-002",
    center: "마포 바디밸런스 스튜디오",
    employmentType: "프리랜서",
    salary: "세션당 4.5만원",
    startDate: "2026.07.28",
    offeredAt: "2026.07.15",
    workSchedule: "주 3~4일 · 스케줄 협의",
    manager: "정하늘 실장",
    phone: "010-2277-5510",
    email: "team@bodybalance-mapo.example",
    status: "pending",
    message:
      "그룹 리포머와 1:1 재활 세션을 함께 맡아 주실 분을 찾고 있어요. 스케줄은 유연하게 조율할 수 있습니다."
  },
  {
    id: "offer-seongsu-003",
    center: "성수 스트렝스랩",
    employmentType: "파트타임",
    salary: "시급 3.2만원",
    startDate: "2026.08.05",
    offeredAt: "2026.07.12",
    workSchedule: "주 3일 · 저녁 시간대",
    manager: "김도현 대표",
    phone: "010-9033-1188",
    email: "recruit@strengthlab.example",
    status: "pending",
    message:
      "퍼포먼스 향상과 체형 교정에 강점 있는 트레이너를 찾습니다. 초기 온보딩은 저희가 지원합니다."
  }
];

const demoAnswers: CaseTestAnswer = {
  assessment:
    "통증 발생 시점과 강도 NRS, 과거 병력, 병원 진단 및 영상 여부, 가동 범위와 계단 외 통증 유발 동작을 확인합니다.",
  prescription:
    "1~2주는 통증 없는 범위에서 고관절 힌지와 둔근 활성화를 진행하고 회원에게 목표와 중단 기준을 설명합니다. 3~4주는 박스 스쿼트와 낮은 스텝업으로 점진 부하를 적용하며 매 세션 통증 반응을 재평가하고 필요하면 병원 진료를 권합니다.",
  communication:
    "회원이 느끼는 불안과 목표를 먼저 듣고, 오늘은 통증 없는 범위에서 움직임을 회복하는 것이 목표라고 설명합니다. 운동 강도와 중단 기준을 쉬운 말로 안내한 뒤 이해했는지 확인하고 매 세션 피드백을 반영하겠습니다.",
  safety:
    "운동 중 통증이 증가하거나 붓기, 열감, 저림, 힘 빠짐이 나타나면 즉시 운동을 중단합니다. 병원 진단이나 영상 확인이 필요한 경우에는 무리하게 진행하지 않고 병원 진료를 권하며, 상태를 재평가한 뒤 운동 범위를 조정하겠습니다."
};

const PASS_SCORE = 80;

function includesCount(value: string, keywords: string[]) {
  return keywords.filter((keyword) => value.includes(keyword)).length;
}

function cappedScore(base: number, hits: number, pointsPerHit: number, lengthBonus: number) {
  return Math.min(94, base + hits * pointsPerHit + lengthBonus);
}

export function validateCaseTestAnswers(
  assessment: string,
  prescription: string,
  communication?: string,
  safety?: string
): CaseTestValidation {
  const assessmentError =
    assessment.trim().length < 30 ? "추가 확인 사항을 30자 이상 작성해 주세요." : null;
  const prescriptionError =
    prescription.trim().length < 60 ? "4주 운동 처방을 60자 이상 작성해 주세요." : null;
  const baseValidation = {
    isValid: assessmentError === null && prescriptionError === null,
    assessmentError,
    prescriptionError
  };

  if (communication === undefined && safety === undefined) {
    return baseValidation;
  }

  const communicationError =
    (communication ?? "").trim().length < 40 ? "회원에게 설명하는 내용을 40자 이상 작성해 주세요." : null;
  const safetyError =
    (safety ?? "").trim().length < 40 ? "안전 기준을 40자 이상 작성해 주세요." : null;

  return {
    isValid: baseValidation.isValid && communicationError === null && safetyError === null,
    assessmentError,
    prescriptionError,
    communicationError,
    safetyError
  };
}

export function scoreCaseTest(
  assessment: string,
  prescription: string,
  communication?: string,
  safety?: string
): CaseTestResult {
  const communicationAnswer = communication ?? `${assessment} ${prescription}`;
  const safetyAnswer = safety ?? `${assessment} ${prescription}`;
  const assessmentScore = cappedScore(
    50,
    includesCount(assessment, ["통증", "NRS", "병력", "진단", "영상", "가동 범위", "유발 동작"]),
    6,
    assessment.trim().length >= 80 ? 4 : 0
  );
  const prescriptionScore = cappedScore(
    52,
    includesCount(prescription, ["1~2주", "3~4주", "점진", "재평가", "둔근", "스쿼트", "스텝업", "통증 없는"]),
    6,
    prescription.trim().length >= 140 ? 4 : 0
  );
  const communicationScore = cappedScore(
    55,
    includesCount(communicationAnswer, ["회원", "목표", "설명", "동의", "불안", "피드백"]),
    7,
    communicationAnswer.trim().length >= 100 ? 4 : 0
  );
  const safetyScore = cappedScore(
    55,
    includesCount(safetyAnswer, ["병원", "진단", "통증", "중단", "범위", "재평가"]),
    6,
    safetyAnswer.trim().length >= 100 ? 4 : 0
  );

  const scoreByCriteria: ScoreCriterion[] = [
    { name: "평가 능력", value: assessmentScore },
    { name: "운동 처방", value: prescriptionScore },
    { name: "커뮤니케이션", value: communicationScore },
    { name: "안전 고려", value: safetyScore }
  ];
  const overallScore = Math.round(
    scoreByCriteria.reduce((total, criterion) => total + criterion.value, 0) / scoreByCriteria.length
  );
  const strengths = scoreByCriteria
    .filter((criterion) => criterion.value >= PASS_SCORE)
    .map((criterion) => criterion.name);
  const improvements = scoreByCriteria
    .filter((criterion) => criterion.value < PASS_SCORE)
    .map((criterion) => criterion.name);

  return {
    tone: overallScore >= PASS_SCORE ? "pass" : "fail",
    overallScore,
    scoreByCriteria,
    strengths,
    improvements,
    feedbackSummary:
      overallScore >= PASS_SCORE
        ? "판단 근거와 단계별 처방이 구체적입니다. 회원에게 중단 기준과 진행 목표를 설명하는 방식까지 유지해 주세요."
        : "핵심 판단 방향은 확인되지만 근거가 부족합니다. 통증 평가, 단계별 부하, 중단 기준을 더 구체적으로 작성해 주세요."
  };
}

export function createDemoOffers(): HiringOffer[] {
  return demoOffers.map((offer) => ({ ...offer }));
}

export function createInitialTrainerState(reviewMode: boolean): TrainerFlowInitialState {
  const specialties = specialtyNames.map((name, index) => ({
    name,
    level: reviewMode ? [5, 4, 3, 0, 0, 0][index] : 0
  }));
  const answers: CaseTestAnswer = reviewMode
    ? { ...demoAnswers }
    : { assessment: "", prescription: "", communication: "", safety: "" };

  return {
    profile: {
      name: reviewMode ? "한민서" : "",
      activeRegion: reviewMode ? "서울 강남 · 서초" : "",
      careerYears: reviewMode ? "3년 8개월" : "",
      certifications: reviewMode ? "생활스포츠지도사 2급, NASM-CES" : "",
      introduction: reviewMode ? "통증 이력이 있는 회원의 안전한 재활 운동을 돕습니다." : "",
      specialties
    },
    performanceStats: {
      totalCoachedMembers: reviewMode ? "142" : "",
      averageReenrollmentRate: reviewMode ? "78" : "",
      averagePtDurationMonths: reviewMode ? "5.6" : ""
    },
    answers,
    offers: reviewMode ? createDemoOffers() : [],
    onboardingCompleted: reviewMode,
    verified: false,
    caseResult: reviewMode
      ? scoreCaseTest(answers.assessment, answers.prescription)
      : scoreCaseTest("", "")
  };
}

export function loadTrainerFlowState(reviewMode = false): TrainerFlowInitialState {
  const fallback = createInitialTrainerState(reviewMode);
  if (reviewMode || typeof localStorage === "undefined") return fallback;

  const raw = localStorage.getItem(TRAINER_FLOW_STATE_KEY);
  if (!raw) return fallback;

  try {
    const parsed = JSON.parse(raw) as Partial<TrainerFlowInitialState>;
    if (
      parsed.profile &&
      parsed.performanceStats &&
      parsed.answers &&
      parsed.caseResult &&
      Array.isArray(parsed.profile.specialties) &&
      Array.isArray(parsed.offers)
    ) {
      return {
        ...fallback,
        ...parsed,
        answers: {
          assessment: parsed.answers.assessment ?? "",
          prescription: parsed.answers.prescription ?? "",
          communication: parsed.answers.communication ?? "",
          safety: parsed.answers.safety ?? ""
        }
      } as TrainerFlowInitialState;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function saveTrainerFlowState(state: TrainerFlowInitialState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(TRAINER_FLOW_STATE_KEY, JSON.stringify(state));
}
