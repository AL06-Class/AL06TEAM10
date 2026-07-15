import assert from "node:assert/strict";
import test from "node:test";
import {
  createInitialTrainerState,
  scoreCaseTest,
  validateCaseTestAnswers
} from "../src/trainerFlow.ts";

const strongAnswers = {
  assessment:
    "통증 발생 시점과 강도 NRS, 과거 병력, 병원 진단 및 영상 여부, 가동 범위와 계단 외 통증 유발 동작을 확인합니다.",
  prescription:
    "1~2주는 통증 없는 범위에서 고관절 힌지와 둔근 활성화를 진행하고 회원에게 목표와 중단 기준을 설명합니다. 3~4주는 박스 스쿼트와 낮은 스텝업으로 점진 부하를 적용하며 매 세션 통증 반응을 재평가하고 필요하면 병원 진료를 권합니다."
};

test("답변별 최소 글자 수를 충족해야 제출할 수 있다", () => {
  assert.deepEqual(validateCaseTestAnswers("짧은 답변", "이 답변도 너무 짧습니다."), {
    isValid: false,
    assessmentError: "추가 확인 사항을 30자 이상 작성해 주세요.",
    prescriptionError: "4주 운동 처방을 60자 이상 작성해 주세요."
  });

  assert.deepEqual(validateCaseTestAnswers(strongAnswers.assessment, strongAnswers.prescription), {
    isValid: true,
    assessmentError: null,
    prescriptionError: null
  });
});

test("구체적인 평가·처방·안전 근거가 있는 답변은 인증 기준을 통과한다", () => {
  const result = scoreCaseTest(strongAnswers.assessment, strongAnswers.prescription);

  assert.equal(result.tone, "pass");
  assert.ok(result.overallScore >= 80);
  assert.equal(result.scoreByCriteria.length, 4);
  assert.ok(result.strengths.length > 0);
});

test("4개 평가 영역 답변을 각각 채점하고 합산한다", () => {
  const result = scoreCaseTest(
    strongAnswers.assessment,
    strongAnswers.prescription,
    "회원의 불안을 먼저 듣고 목표와 중단 기준을 쉬운 말로 설명한 뒤 동의를 확인하고 피드백을 반영하겠습니다.",
    "통증이 증가하거나 저림과 힘 빠짐이 나타나면 즉시 중단하고 병원 진료를 권하며 상태를 재평가하겠습니다."
  );

  assert.deepEqual(result.scoreByCriteria.map((criterion) => criterion.name), [
    "평가 능력",
    "운동 처방",
    "커뮤니케이션",
    "안전 고려"
  ]);
  assert.equal(result.scoreByCriteria.length, 4);
  assert.ok(result.overallScore >= 80);
});

test("4개 영역을 모두 작성해야 최종 제출할 수 있다", () => {
  const validation = validateCaseTestAnswers(
    strongAnswers.assessment,
    strongAnswers.prescription,
    "짧은 설명",
    "짧은 안전 답변"
  );

  assert.equal(validation.isValid, false);
  assert.ok(validation.communicationError);
  assert.ok(validation.safetyError);
});

test("분량만 길고 판단 근거가 부족한 답변은 인증 기준을 통과하지 못한다", () => {
  const vagueAssessment = "회원에게 불편한 부분을 충분히 물어보고 현재 상태를 전반적으로 확인한 다음 신중하게 판단하겠습니다.";
  const vaguePrescription =
    "처음에는 쉬운 운동부터 시작하고 상태가 좋아지는지 지켜보겠습니다. 이후에는 조금씩 어려운 운동을 추가하면서 무리하지 않도록 조절하고 꾸준히 진행하겠습니다.";
  const result = scoreCaseTest(vagueAssessment, vaguePrescription);

  assert.equal(result.tone, "fail");
  assert.ok(result.overallScore < 80);
  assert.ok(result.improvements.length > 0);
});

test("일반 사용자 초기 상태는 샘플 데이터 없이 시작한다", () => {
  const state = createInitialTrainerState(false);

  assert.deepEqual(state.profile, {
    name: "",
    activeRegion: "",
    careerYears: "",
    certifications: "",
    introduction: "",
    specialties: [
      { name: "재활", level: 0 },
      { name: "다이어트", level: 0 },
      { name: "시니어 트레이닝", level: 0 },
      { name: "퍼포먼스 / 스포츠", level: 0 },
      { name: "체형 교정", level: 0 },
      { name: "바디프로필 준비", level: 0 }
    ]
  });
  assert.deepEqual(state.performanceStats, {
    totalCoachedMembers: "",
    averageReenrollmentRate: "",
    averagePtDurationMonths: ""
  });
  assert.deepEqual(state.answers, {
    assessment: "",
    prescription: "",
    communication: "",
    safety: ""
  });
  assert.equal(state.offers.length, 0);
  assert.equal(state.onboardingCompleted, false);
});

test("리뷰 초기 상태는 전체 플로우를 확인할 샘플 데이터를 제공한다", () => {
  const state = createInitialTrainerState(true);

  assert.equal(state.profile.name, "한민서");
  assert.equal(state.profile.specialties.filter((specialty) => specialty.level > 0).length, 3);
  assert.equal(state.performanceStats.totalCoachedMembers, "142");
  assert.ok(state.answers.assessment.length >= 30);
  assert.ok(state.answers.prescription.length >= 60);
  assert.ok(state.answers.communication.length >= 40);
  assert.ok(state.answers.safety.length >= 40);
  assert.equal(state.offers.length, 3);
  assert.equal(state.onboardingCompleted, true);
});
