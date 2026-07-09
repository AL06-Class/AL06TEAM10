export type GradingReportSource = "mock";

export interface CaseAreaScore {
  evaluationItem: string;
  score: number;
}

export interface CaseSummary {
  age: string;
  gender: string;
  chiefComplaint: string;
  goal: string;
  exerciseExperience: string;
}

export interface GradingReport {
  trainerId: string;
  overallScore: number;
  caseSummary: CaseSummary;
  areaScores: CaseAreaScore[];
  comment: string;
  strengthComment: string;
  improvementComment: string;
  source: GradingReportSource;
}

export const gradingReports: GradingReport[] = [
  {
    trainerId: "t1",
    overallScore: 82,
    caseSummary: {
      age: "34세",
      gender: "여성",
      chiefComplaint: "체지방 감량, 하체 부종",
      goal: "3개월 내 체지방 5% 감소",
      exerciseExperience: "운동 경험 거의 없음(주 1회 걷기 수준)",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 85 },
      { evaluationItem: "운동 처방", score: 88 },
      { evaluationItem: "커뮤니케이션", score: 76 },
      { evaluationItem: "안전 고려", score: 79 },
    ],
    comment: "체계적인 감량 프로그램 설계 능력이 돋보임",
    strengthComment: "회원 목표에 맞춘 단계별 식단·운동 계획 수립이 구체적임",
    improvementComment: "초보 회원 대상 설명 시 전문 용어를 조금 더 풀어서 전달하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t2",
    overallScore: 88,
    caseSummary: {
      age: "41세",
      gender: "남성",
      chiefComplaint: "허리 디스크 수술 후 재활",
      goal: "일상 복귀 및 코어 근력 회복",
      exerciseExperience: "수술 전 주 3회 웨이트 트레이닝 경험 있음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 91 },
      { evaluationItem: "운동 처방", score: 87 },
      { evaluationItem: "커뮤니케이션", score: 90 },
      { evaluationItem: "안전 고려", score: 84 },
    ],
    comment: "재활 케이스에 대한 안전 우선 접근이 인상적임",
    strengthComment: "회원의 통증 신호를 세심하게 확인하며 강도를 조절함",
    improvementComment: "진행 상황 기록을 더 구체적인 수치로 남기면 추적이 용이함",
    source: "mock",
  },
  {
    trainerId: "t3",
    overallScore: 79,
    caseSummary: {
      age: "27세",
      gender: "남성",
      chiefComplaint: "근력 증가, 체형 교정",
      goal: "6개월 내 벤치프레스 1.2배 체중 달성",
      exerciseExperience: "주 4회 이상 웨이트 트레이닝, 중급 이상",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 80 },
      { evaluationItem: "운동 처방", score: 84 },
      { evaluationItem: "커뮤니케이션", score: 74 },
      { evaluationItem: "안전 고려", score: 78 },
    ],
    comment: "중급자 대상 고강도 프로그램 설계 경험이 풍부함",
    strengthComment: "그룹 수업 운영 노하우를 1:1 세션에도 잘 적용함",
    improvementComment: "회원 피드백을 더 자주 확인하는 루틴이 있으면 좋음",
    source: "mock",
  },
];
