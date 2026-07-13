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
};

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
    "1~2주는 통증 없는 범위에서 고관절 힌지와 둔근 활성화를 진행하고 회원에게 목표와 중단 기준을 설명합니다. 3~4주는 박스 스쿼트와 낮은 스텝업으로 점진 부하를 적용하며 매 세션 통증 반응을 재평가하고 필요하면 병원 진료를 권합니다."
};

const PASS_SCORE = 80;

function includesCount(value: string, keywords: string[]) {
  return keywords.filter((keyword) => value.includes(keyword)).length;
}

function cappedScore(base: number, hits: number, pointsPerHit: number, lengthBonus: number) {
  return Math.min(94, base + hits * pointsPerHit + lengthBonus);
}

export function validateCaseTestAnswers(assessment: string, prescription: string): CaseTestValidation {
  const assessmentError =
    assessment.trim().length < 30 ? "추가 확인 사항을 30자 이상 작성해 주세요." : null;
  const prescriptionError =
    prescription.trim().length < 60 ? "4주 운동 처방을 60자 이상 작성해 주세요." : null;

  return {
    isValid: assessmentError === null && prescriptionError === null,
    assessmentError,
    prescriptionError
  };
}

export function scoreCaseTest(assessment: string, prescription: string): CaseTestResult {
  const combined = `${assessment} ${prescription}`;
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
    includesCount(combined, ["회원", "목표", "설명", "동의", "불안", "피드백"]),
    7,
    0
  );
  const safetyScore = cappedScore(
    55,
    includesCount(combined, ["병원", "진단", "통증", "중단", "범위", "재평가"]),
    6,
    0
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
  const answers = reviewMode ? { ...demoAnswers } : { assessment: "", prescription: "" };

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
