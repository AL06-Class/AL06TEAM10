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
  {
    trainerId: "t5",
    overallScore: 86,
    caseSummary: {
      age: "48세",
      gender: "남성",
      chiefComplaint: "무릎 수술 후 재활, 하체 근력 저하",
      goal: "일상 보행 안정화 및 계단 오르내리기 개선",
      exerciseExperience: "수술 전 웨이트 트레이닝 경험 있음, 현재는 운동 중단 상태",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 89 },
      { evaluationItem: "운동 처방", score: 85 },
      { evaluationItem: "커뮤니케이션", score: 83 },
      { evaluationItem: "안전 고려", score: 90 },
    ],
    comment: "정형외과 협진 경험을 바탕으로 안전한 재활 설계가 돋보임",
    strengthComment: "통증 부위를 우선 확인하고 단계별로 부하를 늘리는 접근이 체계적임",
    improvementComment: "가정에서 할 수 있는 보조 운동 안내를 조금 더 구체화하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t6",
    overallScore: 81,
    caseSummary: {
      age: "36세",
      gender: "여성",
      chiefComplaint: "출산 후 체중 증가, 복부 체지방",
      goal: "3개월 챌린지 프로그램으로 체지방 감량",
      exerciseExperience: "운동 경험 적음, 최근 홈트레이닝 시도 경험 있음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 82 },
      { evaluationItem: "운동 처방", score: 84 },
      { evaluationItem: "커뮤니케이션", score: 85 },
      { evaluationItem: "안전 고려", score: 74 },
    ],
    comment: "동기부여 코칭과 챌린지형 프로그램 설계 능력이 돋보임",
    strengthComment: "회원의 생활 패턴에 맞춘 현실적인 목표 설정이 좋음",
    improvementComment: "운동 강도를 높이는 구간에서 안전 고려 설명을 더 보강하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t7",
    overallScore: 90,
    caseSummary: {
      age: "31세",
      gender: "남성",
      chiefComplaint: "전신 체력 저하, 반복되는 어깨 통증",
      goal: "체력 향상과 어깨 부상 재발 방지",
      exerciseExperience: "주 5회 이상 크로스핏 경험, 상급자",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 92 },
      { evaluationItem: "운동 처방", score: 90 },
      { evaluationItem: "커뮤니케이션", score: 87 },
      { evaluationItem: "안전 고려", score: 91 },
    ],
    comment: "장기 경력을 바탕으로 고강도·재활 요소를 균형 있게 설계함",
    strengthComment: "부상 이력을 고려한 동작 변형 제시가 능숙함",
    improvementComment: "세션 간 회복 상태 체크리스트를 도입하면 더 좋음",
    source: "mock",
  },
  {
    trainerId: "t11",
    overallScore: 83,
    caseSummary: {
      age: "39세",
      gender: "여성",
      chiefComplaint: "체형 불균형, 만성 어깨 결림",
      goal: "3개월 내 자세 교정 및 체지방 감량",
      exerciseExperience: "필라테스 초급 경험 있음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 84 },
      { evaluationItem: "운동 처방", score: 86 },
      { evaluationItem: "커뮤니케이션", score: 80 },
      { evaluationItem: "안전 고려", score: 82 },
    ],
    comment: "체형 분석 기반 맞춤 프로그램 설계 능력이 돋보임",
    strengthComment: "자세 교정과 체지방 감량을 함께 설계하는 접근이 체계적임",
    improvementComment: "세션 간 진행 기록을 수치로 남기면 추적이 용이함",
    source: "mock",
  },
  {
    trainerId: "t12",
    overallScore: 85,
    caseSummary: {
      age: "29세",
      gender: "남성",
      chiefComplaint: "전신 체력 저하",
      goal: "6개월 내 체력 전반 향상",
      exerciseExperience: "주 3회 이상 크로스핏 경험, 중급",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 86 },
      { evaluationItem: "운동 처방", score: 87 },
      { evaluationItem: "커뮤니케이션", score: 82 },
      { evaluationItem: "안전 고려", score: 85 },
    ],
    comment: "고강도 수업과 회복 운동의 균형 있는 설계가 돋보임",
    strengthComment: "체력 수준별 강도 조절이 능숙함",
    improvementComment: "요가 파트의 심화 동작 설명을 조금 더 보강하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t14",
    overallScore: 84,
    caseSummary: {
      age: "45세",
      gender: "여성",
      chiefComplaint: "무릎 통증, 체중 증가",
      goal: "통증 없이 일상 활동량 회복",
      exerciseExperience: "운동 경험 적음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 87 },
      { evaluationItem: "운동 처방", score: 83 },
      { evaluationItem: "커뮤니케이션", score: 84 },
      { evaluationItem: "안전 고려", score: 88 },
    ],
    comment: "저강도부터 단계적으로 늘리는 재활 설계가 안정적임",
    strengthComment: "통증 신호에 즉각 반응해 강도를 조절함",
    improvementComment: "식단 코칭 자료를 조금 더 구체화하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t15",
    overallScore: 87,
    caseSummary: {
      age: "33세",
      gender: "여성",
      chiefComplaint: "코어 약화, 체형 불균형",
      goal: "3개월 내 코어 안정화",
      exerciseExperience: "필라테스 중급 경험 있음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 88 },
      { evaluationItem: "운동 처방", score: 89 },
      { evaluationItem: "커뮤니케이션", score: 85 },
      { evaluationItem: "안전 고려", score: 86 },
    ],
    comment: "코어 안정화 훈련과 고강도 수업을 함께 설계하는 능력이 뛰어남",
    strengthComment: "세부 동작 교정 피드백이 정교함",
    improvementComment: "홈 트레이닝 병행 가이드를 추가하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t16",
    overallScore: 91,
    caseSummary: {
      age: "50세",
      gender: "남성",
      chiefComplaint: "전신 유연성 저하, 근력 감소",
      goal: "체력 전반 향상과 유연성 회복",
      exerciseExperience: "과거 웨이트 트레이닝 경험 다수",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 93 },
      { evaluationItem: "운동 처방", score: 90 },
      { evaluationItem: "커뮤니케이션", score: 88 },
      { evaluationItem: "안전 고려", score: 92 },
    ],
    comment: "유연성 훈련과 근력 훈련을 균형 있게 설계하는 베테랑",
    strengthComment: "연령대별 프로그램 조정 경험이 풍부함",
    improvementComment: "세션 후 회복 관리 가이드를 조금 더 제공하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t19",
    overallScore: 85,
    caseSummary: {
      age: "37세",
      gender: "여성",
      chiefComplaint: "만성 허리 통증",
      goal: "통증 완화 및 유연성 회복",
      exerciseExperience: "운동 경험 거의 없음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 87 },
      { evaluationItem: "운동 처방", score: 84 },
      { evaluationItem: "커뮤니케이션", score: 86 },
      { evaluationItem: "안전 고려", score: 88 },
    ],
    comment: "호흡·이완 중심 지도로 재활 회원 신뢰도가 높음",
    strengthComment: "통증 부위를 우선 확인하고 점진적으로 강도를 늘림",
    improvementComment: "가정용 스트레칭 가이드를 추가하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t20",
    overallScore: 86,
    caseSummary: {
      age: "40세",
      gender: "여성",
      chiefComplaint: "체지방 증가, 체형 불균형",
      goal: "3개월 챌린지 프로그램 완주",
      exerciseExperience: "필라테스 경험 있음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 88 },
      { evaluationItem: "운동 처방", score: 87 },
      { evaluationItem: "커뮤니케이션", score: 83 },
      { evaluationItem: "안전 고려", score: 85 },
    ],
    comment: "체형 데이터 기반 맞춤 커리큘럼 설계에 강점",
    strengthComment: "챌린지 프로그램 완주율 관리가 체계적임",
    improvementComment: "회원 피드백 주기를 조금 더 짧게 가져가면 좋음",
    source: "mock",
  },
  {
    trainerId: "t21",
    overallScore: 89,
    caseSummary: {
      age: "34세",
      gender: "남성",
      chiefComplaint: "근력 정체기, 체형 교정",
      goal: "6개월 내 근력 15% 향상",
      exerciseExperience: "주 4회 이상 웨이트 트레이닝, 상급자",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 90 },
      { evaluationItem: "운동 처방", score: 91 },
      { evaluationItem: "커뮤니케이션", score: 85 },
      { evaluationItem: "안전 고려", score: 87 },
    ],
    comment: "장기 경력 기반 고강도 프로그램 설계 능력이 뛰어남",
    strengthComment: "정체기 극복을 위한 주기화 훈련 설계가 능숙함",
    improvementComment: "영양 코칭 자료를 함께 제공하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t22",
    overallScore: 82,
    caseSummary: {
      age: "26세",
      gender: "여성",
      chiefComplaint: "스트레스성 긴장, 체형 불균형",
      goal: "유연성 향상 및 체형 교정",
      exerciseExperience: "요가 초급 경험 있음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 83 },
      { evaluationItem: "운동 처방", score: 82 },
      { evaluationItem: "커뮤니케이션", score: 84 },
      { evaluationItem: "안전 고려", score: 80 },
    ],
    comment: "복합 수업 설계와 유연한 시간표 운영에 강점",
    strengthComment: "회원 컨디션에 맞춘 강도 조절이 세심함",
    improvementComment: "심화 동작 전 준비 운동 설명을 보강하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t24",
    overallScore: 80,
    caseSummary: {
      age: "31세",
      gender: "남성",
      chiefComplaint: "체지방 증가, 운동 습관 부재",
      goal: "3개월 챌린지 프로그램으로 체지방 감량",
      exerciseExperience: "운동 경험 거의 없음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 81 },
      { evaluationItem: "운동 처방", score: 83 },
      { evaluationItem: "커뮤니케이션", score: 82 },
      { evaluationItem: "안전 고려", score: 76 },
    ],
    comment: "식단·운동을 함께 관리하는 종합 코칭 능력이 좋음",
    strengthComment: "챌린지 프로그램 완주율 관리가 체계적임",
    improvementComment: "강도를 높이는 구간의 안전 고려 설명을 보강하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t25",
    overallScore: 88,
    caseSummary: {
      age: "42세",
      gender: "여성",
      chiefComplaint: "어깨 수술 후 재활",
      goal: "일상 동작 범위 회복",
      exerciseExperience: "수술 전 필라테스 경험 있음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 90 },
      { evaluationItem: "운동 처방", score: 86 },
      { evaluationItem: "커뮤니케이션", score: 85 },
      { evaluationItem: "안전 고려", score: 91 },
    ],
    comment: "부상 이력 회원 대상 안전한 동작 설계에 강점",
    strengthComment: "통증 부위를 우선 확인하고 부하를 점진적으로 늘림",
    improvementComment: "가정에서 할 수 있는 보조 운동 안내를 보강하면 좋음",
    source: "mock",
  },
  {
    trainerId: "t26",
    overallScore: 92,
    caseSummary: {
      age: "36세",
      gender: "남성",
      chiefComplaint: "전신 체력 저하, 반복되는 무릎 통증",
      goal: "체력 향상과 부상 재발 방지",
      exerciseExperience: "주 5회 이상 크로스핏 경험, 상급자",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 93 },
      { evaluationItem: "운동 처방", score: 92 },
      { evaluationItem: "커뮤니케이션", score: 89 },
      { evaluationItem: "안전 고려", score: 93 },
    ],
    comment: "베테랑 경력 기반 고강도·재활 요소를 균형 있게 설계함",
    strengthComment: "부상 이력을 고려한 동작 변형 제시가 능숙함",
    improvementComment: "세션 간 회복 상태 체크리스트를 도입하면 더 좋음",
    source: "mock",
  },
  {
    trainerId: "t27",
    overallScore: 83,
    caseSummary: {
      age: "38세",
      gender: "여성",
      chiefComplaint: "스트레스성 폭식, 체지방 증가",
      goal: "3개월 내 체지방 4% 감소",
      exerciseExperience: "요가 경험 있음",
    },
    areaScores: [
      { evaluationItem: "평가 능력", score: 84 },
      { evaluationItem: "운동 처방", score: 85 },
      { evaluationItem: "커뮤니케이션", score: 82 },
      { evaluationItem: "안전 고려", score: 81 },
    ],
    comment: "이완·호흡 지도와 식단 관리를 함께 설계함",
    strengthComment: "회원의 생활 패턴에 맞춘 현실적인 목표 설정이 좋음",
    improvementComment: "운동 강도를 높이는 구간의 설명을 보강하면 좋음",
    source: "mock",
  },
];
