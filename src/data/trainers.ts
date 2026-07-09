export type TrainerStatus = "active" | "inactive";

// certificationLevels·employmentTypes: data-guide.md 공통 이름 사전에 아직 미등록인 임시
// 필드명(O5 등록 대상, 팀 조율 필요) — 사람 확정 하에 이번 태스크에서만 신규 추가 허용됨.
export type CertificationLevel = "national" | "international";
export type EmploymentTypeValue = "fulltime" | "freelancer";

export interface Trainer {
  id: string;
  name: string;
  photoUrl: string;
  region: string;
  careerYears: number;
  isCertified: boolean;
  certifications: string[];
  certificationLevels: CertificationLevel[];
  specialties: string[];
  performanceSummary: string;
  recommendationReason: string;
  aiSummary: string;
  employmentTypes: EmploymentTypeValue[];
  status: TrainerStatus;
  createdAt: string;
  updatedAt: string;
}

export const SPECIALTY_OPTIONS = [
  "웨이트 트레이닝",
  "필라테스",
  "요가",
  "크로스핏",
  "재활 운동",
  "다이어트 코칭",
] as const;

export const REGION_OPTIONS = ["서울", "경기", "인천", "부산"] as const;

export const trainers: Trainer[] = [
  {
    id: "t1",
    name: "김도윤",
    photoUrl: "https://i.pravatar.cc/160?img=11",
    region: "서울",
    careerYears: 9,
    isCertified: true,
    certifications: ["생활스포츠지도사 2급", "NSCA-CPT"],
    certificationLevels: ["national", "international"],
    specialties: ["웨이트 트레이닝", "다이어트 코칭"],
    performanceSummary: "직전 센터 재등록률 78%, 담당 회원 평균 3개월 체지방 6% 감소",
    recommendationReason: "서울 지역 즉시 투입 가능 · 다이어트 코칭 전문분야 일치 · 경력 9년 · 국가공인 자격 보유",
    aiSummary: "감량 코칭에 강점, 데이터 기반 식단 관리로 회원 만족도 높음",
    employmentTypes: ["fulltime", "freelancer"],
    status: "active",
    createdAt: "2026-06-01T09:00:00+09:00",
    updatedAt: "2026-06-20T09:00:00+09:00",
  },
  {
    id: "t2",
    name: "이서연",
    photoUrl: "https://i.pravatar.cc/160?img=32",
    region: "서울",
    careerYears: 4,
    isCertified: true,
    certifications: ["필라테스 지도자 자격증"],
    certificationLevels: ["national"],
    specialties: ["필라테스", "재활 운동"],
    performanceSummary: "체험 수업 등록 전환율 65%, 재활 회원 만족도 4.8/5",
    recommendationReason: "서울 지역 거주 · 필라테스·재활 전문분야 일치 · 경력 4년 · 국가공인 자격 보유",
    aiSummary: "세심한 자세 교정으로 초보·재활 회원 신뢰도가 높음",
    employmentTypes: ["fulltime", "freelancer"],
    status: "active",
    createdAt: "2026-06-02T09:00:00+09:00",
    updatedAt: "2026-06-18T09:00:00+09:00",
  },
  {
    id: "t3",
    name: "박지훈",
    photoUrl: "https://i.pravatar.cc/160?img=13",
    region: "경기",
    careerYears: 12,
    isCertified: true,
    certifications: ["생활스포츠지도사 1급", "크로스핏 레벨2"],
    certificationLevels: ["national", "international"],
    specialties: ["크로스핏", "웨이트 트레이닝"],
    performanceSummary: "그룹 수업 정원 마감률 92%, 팀 매출 기여 상위 10%",
    recommendationReason: "경기 인근 통근 가능 · 크로스핏·웨이트 전문분야 일치 · 경력 12년 · 정직원 희망 일치",
    aiSummary: "강도 높은 그룹 수업 진행 능력이 뛰어난 시니어 트레이너",
    employmentTypes: ["fulltime"],
    status: "active",
    createdAt: "2026-05-20T09:00:00+09:00",
    updatedAt: "2026-06-25T09:00:00+09:00",
  },
  {
    id: "t4",
    name: "최민아",
    photoUrl: "https://i.pravatar.cc/160?img=45",
    region: "인천",
    careerYears: 2,
    isCertified: false,
    certifications: ["요가 지도자 200시간 과정"],
    certificationLevels: [],
    specialties: ["요가"],
    performanceSummary: "신규 채용 6개월차, 체험 수업 만족도 4.6/5",
    recommendationReason: "인천 지역 거주 · 요가 전문분야 일치 · 프리랜서 희망 일치 · 저연차 대비 회원 유지율 높음",
    aiSummary: "차분한 진행 스타일로 초보 회원 이탈률이 낮음",
    employmentTypes: ["freelancer"],
    status: "active",
    createdAt: "2026-06-15T09:00:00+09:00",
    updatedAt: "2026-06-15T09:00:00+09:00",
  },
  {
    id: "t5",
    name: "정하늘",
    photoUrl: "https://i.pravatar.cc/160?img=22",
    region: "부산",
    careerYears: 7,
    isCertified: true,
    certifications: ["NASM-CPT", "재활운동전문가"],
    certificationLevels: ["international", "national"],
    specialties: ["재활 운동", "웨이트 트레이닝"],
    performanceSummary: "재활 프로그램 완주율 88%, 담당 회원 재방문율 상위권",
    recommendationReason: "부산 지역 즉시 투입 가능 · 재활·웨이트 전문분야 일치 · 경력 7년 · 국제공인 자격 보유",
    aiSummary: "의학적 근거 기반 재활 설계로 부상 회원 대응력이 뛰어남",
    employmentTypes: ["fulltime", "freelancer"],
    status: "active",
    createdAt: "2026-05-28T09:00:00+09:00",
    updatedAt: "2026-06-22T09:00:00+09:00",
  },
  {
    id: "t6",
    name: "한소율",
    photoUrl: "https://i.pravatar.cc/160?img=47",
    region: "경기",
    careerYears: 5,
    isCertified: true,
    certifications: ["생활스포츠지도사 2급"],
    certificationLevels: ["national"],
    specialties: ["다이어트 코칭", "웨이트 트레이닝"],
    performanceSummary: "3개월 챌린지 프로그램 완주율 81%, 재등록률 70%",
    recommendationReason: "경기 인근 통근 가능 · 다이어트·웨이트 전문분야 일치 · 경력 5년 · 국가공인 자격 보유",
    aiSummary: "동기부여 코칭이 강점, SNS 후기 평점이 높음",
    employmentTypes: ["fulltime", "freelancer"],
    status: "active",
    createdAt: "2026-06-05T09:00:00+09:00",
    updatedAt: "2026-06-19T09:00:00+09:00",
  },
  {
    id: "t7",
    name: "오태양",
    photoUrl: "https://i.pravatar.cc/160?img=14",
    region: "서울",
    careerYears: 15,
    isCertified: true,
    certifications: ["생활스포츠지도사 1급", "크로스핏 레벨3"],
    certificationLevels: ["national", "international"],
    specialties: ["크로스핏", "재활 운동"],
    performanceSummary: "센터 운영 경험 포함 15년, 팀 리더 역할 수행 경력 다수",
    recommendationReason: "서울 지역 즉시 투입 가능 · 크로스핏·재활 전문분야 일치 · 경력 15년 · 정직원 희망 일치",
    aiSummary: "베테랑 트레이너, 신입 트레이너 교육 경험도 보유",
    employmentTypes: ["fulltime"],
    status: "active",
    createdAt: "2026-05-10T09:00:00+09:00",
    updatedAt: "2026-06-10T09:00:00+09:00",
  },
  {
    id: "t8",
    name: "윤채림",
    photoUrl: "https://i.pravatar.cc/160?img=48",
    region: "인천",
    careerYears: 3,
    isCertified: false,
    certifications: ["요가 지도자 200시간 과정", "필라테스 매트 자격증"],
    certificationLevels: [],
    specialties: ["요가", "필라테스"],
    performanceSummary: "복합 수업(요가+필라테스) 체험 전환율 60%",
    recommendationReason: "인천 지역 거주 · 요가·필라테스 전문분야 일치 · 프리랜서 희망 일치 · 복합 수업 운영 가능",
    aiSummary: "복합 수업 설계에 강점, 신규 회원 유입 채널 다양",
    employmentTypes: ["freelancer"],
    status: "active",
    createdAt: "2026-06-08T09:00:00+09:00",
    updatedAt: "2026-06-21T09:00:00+09:00",
  },
  {
    id: "t9",
    name: "장은우",
    photoUrl: "https://i.pravatar.cc/160?img=15",
    region: "부산",
    careerYears: 6,
    isCertified: true,
    certifications: ["NSCA-CPT"],
    certificationLevels: ["international"],
    specialties: ["웨이트 트레이닝", "크로스핏"],
    performanceSummary: "PT 세션 재구매율 75%, 남성 회원 비중 높은 센터에서 성과 우수",
    recommendationReason: "부산 지역 거주 · 웨이트·크로스핏 전문분야 일치 · 경력 6년 · 국가공인 자격 보유(현재 비활성 상태)",
    aiSummary: "체계적인 근력 프로그램 설계로 목표 달성률이 높음",
    employmentTypes: ["fulltime", "freelancer"],
    status: "inactive",
    createdAt: "2026-04-20T09:00:00+09:00",
    updatedAt: "2026-06-01T09:00:00+09:00",
  },
  {
    id: "t10",
    name: "서예린",
    photoUrl: "https://i.pravatar.cc/160?img=49",
    region: "서울",
    careerYears: 1,
    isCertified: false,
    certifications: [],
    certificationLevels: [],
    specialties: ["다이어트 코칭"],
    performanceSummary: "입사 3개월차, 체험 수업 진행 이력 누적 중",
    recommendationReason: "서울 지역 즉시 투입 가능 · 다이어트 코칭 전문분야 일치 · 프리랜서 희망 일치 · 상담 만족도 안정적",
    aiSummary: "친화력이 좋아 초기 상담 전환율이 준수함",
    employmentTypes: ["freelancer"],
    status: "active",
    createdAt: "2026-06-25T09:00:00+09:00",
    updatedAt: "2026-06-25T09:00:00+09:00",
  },
];
