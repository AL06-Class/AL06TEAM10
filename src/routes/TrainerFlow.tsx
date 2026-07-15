import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, login } from "../auth/session";
import ProductHeader from "../components/ProductHeader";
import {
  createDemoOffers,
  loadTrainerFlowState,
  saveTrainerFlowState,
  scoreCaseTest,
  validateCaseTestAnswers,
  type CandidateProfile,
  type CaseTestResult,
  type HiringOffer,
  type OfferStatus,
  type Specialty
} from "../trainerFlow";
type ScreenId =
  | "ob1"
  | "ob2"
  | "ob3"
  | "caseIntro"
  | "caseSession"
  | "result"
  | "certified"
  | "mypage"
  | "offers"
  | "offerDetail"
  | "confirmed";

type ModalKind = "submit" | "accept" | "decline" | "leaveTest" | null;

type MenuEntry = {
  label: string;
  sub: string;
  screen: ScreenId;
  setup?: () => void;
};

const levelLabels = ["미선택", "하", "중하", "중", "중상", "상"];

const screenTitles: Record<ScreenId, string> = {
  ob1: "프로필 등록",
  ob2: "프로필 등록",
  ob3: "프로필 등록",
  caseIntro: "케이스 테스트",
  caseSession: "케이스 테스트",
  result: "예시 채점 결과",
  certified: "인증 완료",
  mypage: "마이페이지",
  offers: "받은 제안",
  offerDetail: "제안 상세",
  confirmed: "채용 확정"
};

function fieldValue(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  return event.target.value;
}

function resetOffers() {
  return createDemoOffers();
}

const reviewSeed = loadTrainerFlowState(true);
const demoPassResult = reviewSeed.caseResult;
const fallbackOffer = createDemoOffers()[0];

const demoFailResult = scoreCaseTest(
  "회원에게 불편한 부분을 충분히 물어보고 현재 상태를 전반적으로 확인한 다음 신중하게 판단하겠습니다.",
  "처음에는 쉬운 운동부터 시작하고 상태가 좋아지는지 지켜보겠습니다. 이후에는 조금씩 어려운 운동을 추가하면서 무리하지 않도록 조절하고 꾸준히 진행하겠습니다."
);

function formatTime(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function ProgressSteps({ active }: { active: number }) {
  return (
    <div
      aria-label={`온보딩 ${active}단계`}
      aria-valuemax={3}
      aria-valuemin={1}
      aria-valuenow={active}
      className="progressSteps"
      role="progressbar"
    >
      {[1, 2, 3].map((step) => (
        <span aria-hidden="true" className={step <= active ? "active" : ""} key={step} />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: OfferStatus | "verified" | "unverified" }) {
  const labels: Record<string, string> = {
    pending: "검토 대기",
    accepted: "수락함",
    declined: "거절함",
    cancelled: "취소됨",
    verified: "인증 통과",
    unverified: "인증 전"
  };

  return <span className={`statusBadge ${status}`}>{labels[status]}</span>;
}

export default function App() {
  const reviewMode = new URLSearchParams(window.location.search).get("review") === "1";
  const navigate = useNavigate();
  const initialState = useMemo(() => loadTrainerFlowState(reviewMode), [reviewMode]);
  const [screen, setScreen] = useState<ScreenId>("ob1");
  const [stack, setStack] = useState<ScreenId[]>([]);
  const [name, setName] = useState(initialState.profile.name);
  const [region, setRegion] = useState(initialState.profile.activeRegion);
  const [career, setCareer] = useState(initialState.profile.careerYears);
  const [cert, setCert] = useState(initialState.profile.certifications);
  const [intro, setIntro] = useState(initialState.profile.introduction);
  const [specialties, setSpecialties] = useState<Specialty[]>(initialState.profile.specialties);
  const [members, setMembers] = useState(initialState.performanceStats.totalCoachedMembers);
  const [reReg, setReReg] = useState(initialState.performanceStats.averageReenrollmentRate);
  const [ptDur, setPtDur] = useState(initialState.performanceStats.averagePtDurationMonths);
  const [answer1, setAnswer1] = useState(initialState.answers.assessment);
  const [answer2, setAnswer2] = useState(initialState.answers.prescription);
  const [seconds, setSeconds] = useState(20 * 60);
  const [caseResult, setCaseResult] = useState<CaseTestResult>(initialState.caseResult);
  const [verified, setVerified] = useState(initialState.verified);
  const [offers, setOffers] = useState<HiringOffer[]>(initialState.offers);
  const [onboardingCompleted, setOnboardingCompleted] = useState(initialState.onboardingCompleted);
  const [caseDetailsOpen, setCaseDetailsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(0);
  const [modal, setModal] = useState<ModalKind>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const modalRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reviewMode && getSession()?.role !== "candidate") {
      login("candidate", "리뷰 사용자");
    }
  }, [reviewMode]);

  const ob1Invalid = !(name.trim() && region.trim() && career.trim());
  const selectedSpecialties = useMemo(
    () => specialties.filter((specialty) => specialty.level > 0).sort((a, b) => b.level - a.level),
    [specialties]
  );
  const ob2Invalid = selectedSpecialties.length === 0;
  const activeOffer = offers[selectedOffer] ?? offers[0] ?? fallbackOffer;
  const answerValidation = useMemo(
    () => validateCaseTestAnswers(answer1, answer2),
    [answer1, answer2]
  );
  const candidateProfile = useMemo<CandidateProfile>(
    () => ({
      name,
      activeRegion: region,
      careerYears: career,
      certifications: cert,
      introduction: intro,
      specialties: selectedSpecialties
    }),
    [career, cert, intro, name, region, selectedSpecialties]
  );
  const testExpired = seconds === 0;

  useEffect(() => {
    if (reviewMode) return;
    saveTrainerFlowState({
      profile: { ...candidateProfile, specialties },
      performanceStats: {
        totalCoachedMembers: members,
        averageReenrollmentRate: reReg,
        averagePtDurationMonths: ptDur
      },
      answers: { assessment: answer1, prescription: answer2 },
      offers,
      onboardingCompleted,
      verified,
      caseResult
    });
  }, [answer1, answer2, caseResult, candidateProfile, members, offers, onboardingCompleted, ptDur, reReg, specialties, verified]);

  useEffect(() => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  }, [screen]);

  useEffect(() => {
    if (screen !== "caseSession" || seconds === 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [screen, seconds]);

  useEffect(() => {
    if (screen !== "caseSession" || testExpired) {
      return undefined;
    }

    const warnBeforeLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeLeave);
    return () => window.removeEventListener("beforeunload", warnBeforeLeave);
  }, [screen, testExpired]);

  useEffect(() => {
    const surface = modal ? modalRef.current : menuOpen ? drawerRef.current : null;
    if (!surface) {
      return undefined;
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = Array.from(
      surface.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [menuOpen, modal]);

  const go = (next: ScreenId, setup?: () => void) => {
    setup?.();
    setStack((current) => [...current, screen]);
    setScreen(next);
    setMenuOpen(false);
  };

  const jump = (next: ScreenId, setup?: () => void) => {
    setup?.();
    setStack((current) => [...current, screen]);
    setScreen(next);
    setMenuOpen(false);
  };

  const performBack = () => {
    setStack((current) => {
      if (current.length === 0) {
        return current;
      }

      const nextStack = [...current];
      const previous = nextStack.pop();
      if (previous) {
        setScreen(previous);
      }
      return nextStack;
    });
  };

  const back = () => {
    if (screen === "caseSession" && !testExpired) {
      setModal("leaveTest");
      return;
    }
    performBack();
  };

  const leaveTest = () => {
    setAnswer1("");
    setAnswer2("");
    setSeconds(20 * 60);
    setModal(null);
    performBack();
  };

  const startTest = () => {
    setSeconds(20 * 60);
    setCaseDetailsOpen(false);
    go("caseSession");
  };

  const restartTest = () => {
    setSeconds(20 * 60);
    setAnswer1("");
    setAnswer2("");
    setCaseDetailsOpen(false);
  };

  const submitCaseTest = () => {
    const nextResult = scoreCaseTest(answer1, answer2);
    setCaseResult(nextResult);
    setVerified(nextResult.tone === "pass");
    setModal(null);
    go("result");
  };

  const setLevel = (index: number, level: number) => {
    setSpecialties((current) =>
      current.map((specialty, currentIndex) =>
        currentIndex === index ? { ...specialty, level } : specialty
      )
    );
  };

  const acceptOffer = () => {
    setOffers((current) =>
      current.map((offer, index) => (index === selectedOffer ? { ...offer, status: "accepted" } : offer))
    );
    setModal(null);
    go("confirmed");
  };

  const declineOffer = () => {
    setOffers((current) =>
      current.map((offer, index) => (index === selectedOffer ? { ...offer, status: "declined" } : offer))
    );
    setModal(null);
    go("offers");
  };

  const onboardingScreens: ScreenId[] = ["ob1", "ob2", "ob3", "caseIntro", "caseSession"];
  const showCandidateNav = onboardingCompleted && !onboardingScreens.includes(screen);
  const profileTabActive = screen === "mypage" || screen === "certified";
  const offersTabActive = screen === "offers" || screen === "offerDetail" || screen === "confirmed";

  const navigatePrimary = (next: "mypage" | "offers") => {
    setStack([]);
    setMenuOpen(false);
    navigate(next === "mypage" ? "/trainer" : "/trainer/offers");
  };

  const menuEntries: MenuEntry[] = [
    { label: "온보딩 1 · 기본 정보", sub: "이름·지역·경력 입력", screen: "ob1" },
    { label: "온보딩 2 · 전문 분야", sub: "숙련도 1~5 선택", screen: "ob2" },
    { label: "온보딩 3 · 성과 데이터", sub: "선택 입력", screen: "ob3" },
    { label: "케이스 테스트 안내", sub: "기준·채점 영역", screen: "caseIntro" },
    { label: "케이스 테스트 응시", sub: "타이머·서술형 답변", screen: "caseSession", setup: () => setSeconds(20 * 60) },
    { label: "케이스 테스트 · 시간 종료", sub: "재시작 상태", screen: "caseSession", setup: () => setSeconds(0) },
    {
      label: "채점 결과 · PASS",
      sub: "인증 통과 상태",
      screen: "result",
      setup: () => {
        setVerified(false);
        setCaseResult(demoPassResult);
      }
    },
    {
      label: "채점 결과 · FAIL",
      sub: "인증 미달 상태",
      screen: "result",
      setup: () => {
        setVerified(false);
        setCaseResult(demoFailResult);
      }
    },
    {
      label: "인증 완료",
      sub: "인증 뱃지·점수",
      screen: "certified",
      setup: () => {
        setVerified(true);
        setCaseResult(demoPassResult);
      }
    },
    {
      label: "마이페이지 · 인증 후",
      sub: "점수·제안·이력",
      screen: "mypage",
      setup: () => {
        setVerified(true);
        setCaseResult(demoPassResult);
      }
    },
    { label: "마이페이지 · 인증 전", sub: "empty state", screen: "mypage", setup: () => setVerified(false) },
    { label: "받은 제안 목록", sub: "제안 3건", screen: "offers", setup: () => setOffers(resetOffers()) },
    { label: "받은 제안 · 0건", sub: "empty state", screen: "offers", setup: () => setOffers([]) },
    {
      label: "제안 상세",
      sub: "수락·거절",
      screen: "offerDetail",
      setup: () => {
        setOffers(resetOffers());
        setSelectedOffer(0);
      }
    },
    {
      label: "채용 확정",
      sub: "담당자 연락처",
      screen: "confirmed",
      setup: () => {
        const nextOffers = resetOffers();
        nextOffers[0].status = "accepted";
        setOffers(nextOffers);
        setSelectedOffer(0);
      }
    }
  ];

  const renderScreen = () => {
    switch (screen) {
      case "ob1":
        return (
          <section className="flowSurface narrow">
            <ProgressSteps active={1} />
            <div className="screenGrid">
              <div>
                <p className="kicker">온보딩 1 / 3</p>
                <h1>기본 정보를 입력해요</h1>
                <p className="lead">센터 대표에게 공개되는 프로필의 기본이 되는 정보예요.</p>
                <div className="formGrid">
                  <label className="field span2">
                    <span>이름 <b>필수</b></span>
                    <input value={name} onChange={(event) => setName(fieldValue(event))} placeholder="실명을 입력하세요" />
                  </label>
                  <label className="field">
                    <span>활동 지역 <b>필수</b></span>
                    <input value={region} onChange={(event) => setRegion(fieldValue(event))} placeholder="예: 서울 강남 · 서초" />
                  </label>
                  <label className="field">
                    <span>경력 <b>필수</b></span>
                    <input value={career} onChange={(event) => setCareer(fieldValue(event))} placeholder="예: 3년 8개월" />
                  </label>
                  <label className="field span2">
                    <span>주요 자격증 <small>선택</small></span>
                    <input value={cert} onChange={(event) => setCert(fieldValue(event))} placeholder="예: 생활스포츠지도사 2급" />
                  </label>
                  <label className="field span2">
                    <span>한 줄 소개 <small>선택</small></span>
                    <textarea value={intro} onChange={(event) => setIntro(fieldValue(event))} placeholder="어떤 회원을 잘 돕는지 적어 주세요" />
                  </label>
                </div>
              </div>
              <aside className="sidePanel">
                <div className="profilePreview">
                  <span>미리보기</span>
                  <div>
                    <strong>{name ? name.charAt(0) : "T"}</strong>
                    <p>
                      <b>{name || "이름"}</b>
                      <small>{region || "활동 지역"}</small>
                    </p>
                  </div>
                  <dl>
                    <dt>경력</dt>
                    <dd>{career || "미입력"}</dd>
                  </dl>
                </div>
                <div className="callout info">
                  <strong>필수값 검증</strong>
                  <p>이름, 활동 지역, 경력을 모두 입력해야 다음 단계로 넘어갈 수 있어요.</p>
                </div>
              </aside>
            </div>
            <div className="ctaRow">
              {ob1Invalid ? <span>필수 항목을 모두 입력해 주세요.</span> : null}
              <button className="primaryButton" disabled={ob1Invalid} onClick={() => go("ob2")} type="button">
                다음
              </button>
            </div>
          </section>
        );

      case "ob2":
        return (
          <section className="flowSurface compact">
            <ProgressSteps active={2} />
            <div className="flowMilestone" role="status">기본 정보 입력 완료</div>
            <p className="kicker">온보딩 2 / 3</p>
            <h1>전문 분야와 숙련도</h1>
            <p className="lead">최소 1개 이상 선택하고, 1~5 척도로 숙련도를 표시하세요.</p>
            <div className="scaleLegend" aria-label="숙련도 척도 안내">
              {levelLabels.slice(1).map((label, index) => (
                <span key={label}><b>{index + 1}</b>{label}</span>
              ))}
            </div>
            <div className="specialtyGrid">
              {specialties.map((specialty, index) => (
                <article className="specialtyCard" key={specialty.name}>
                  <div className="specialtyHeader">
                    <div>
                      <strong>{specialty.name}</strong>
                      <span>{specialty.level > 0 ? `${specialty.level} / 5 · ${levelLabels[specialty.level]}` : "미선택"}</span>
                    </div>
                    <button
                      aria-label={`${specialty.name} 미선택`}
                      className="clearLevelButton"
                      disabled={specialty.level === 0}
                      onClick={() => setLevel(index, 0)}
                      type="button"
                    >
                      미선택
                    </button>
                  </div>
                  <span className="srOnly" id={`specialty-${index}-clear-help`}>
                    선택을 해제하려면 {specialty.name} 미선택 버튼을 사용하세요.
                  </span>
                  <div
                    aria-describedby={`specialty-${index}-clear-help`}
                    aria-label={`${specialty.name} 숙련도`}
                    className="levelButtons"
                    role="radiogroup"
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <label className={level === specialty.level ? "active" : ""} key={level}>
                        <input
                          checked={specialty.level === level}
                          className="srOnly"
                          name={`specialty-${index}`}
                          onChange={() => setLevel(index, level)}
                          type="radio"
                          value={level}
                        />
                        <span>{level}</span>
                      </label>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="selectionNote">
              선택한 분야 <strong>{selectedSpecialties.length}개</strong> · 숫자를 선택하거나 미선택으로 해제할 수 있어요.
            </div>
            <div className="ctaRow">
              {ob2Invalid ? <span>전문 분야를 1개 이상 선택해 주세요.</span> : null}
              <button className="primaryButton" disabled={ob2Invalid} onClick={() => go("ob3")} type="button">
                다음
              </button>
            </div>
          </section>
        );

      case "ob3":
        return (
          <section className="flowSurface slim">
            <ProgressSteps active={3} />
            <div className="flowMilestone" role="status">전문 분야 {selectedSpecialties.length}개 선택 완료</div>
            <p className="kicker">온보딩 3 / 3</p>
            <h1>성과 데이터 <span>선택</span></h1>
            <p className="lead">입력한 성과는 나중에 센터와 조건을 협상할 때 근거가 돼요.</p>
            <div className="stackedFields">
              <label className="field">
                <span>누적 지도 회원 수</span>
                <div className="inputWrap">
                  <input inputMode="numeric" value={members} onChange={(event) => setMembers(fieldValue(event))} />
                  <small>명</small>
                </div>
              </label>
              <label className="field">
                <span>평균 재등록률</span>
                <div className="inputWrap">
                  <input inputMode="numeric" value={reReg} onChange={(event) => setReReg(fieldValue(event))} />
                  <small>%</small>
                </div>
                <em>최근 12개월 기준</em>
              </label>
              <label className="field">
                <span>평균 PT 지속 기간</span>
                <div className="inputWrap">
                  <input inputMode="decimal" value={ptDur} onChange={(event) => setPtDur(fieldValue(event))} />
                  <small>개월</small>
                </div>
              </label>
            </div>
            <div className="callout warning">
              성과 데이터는 지금 비워 두고 나중에 채워도 괜찮아요. 자기신고 값으로 저장됩니다.
            </div>
            <div className="ctaRow">
              <button
                className="secondaryButton"
                onClick={() => go("mypage", () => {
                  setOnboardingCompleted(true);
                  setVerified(false);
                })}
                type="button"
              >
                나중에 하기
              </button>
              <button
                className="primaryButton"
                onClick={() => go("caseIntro", () => setOnboardingCompleted(true))}
                type="button"
              >
                케이스 테스트 바로 응시하기
              </button>
            </div>
          </section>
        );

      case "caseIntro":
        return (
          <section className="flowSurface compact">
            <p className="kicker">케이스 테스트</p>
            <h1>실무 역량을 인증받아요</h1>
            <p className="lead">실제 회원 케이스 1개에 서술형으로 답하면 현재 예시 채점 기준으로 인증 결과를 확인할 수 있어요.</p>
            <div className="metricGrid">
              <div className="metricCard">
                <span>소요시간</span>
                <strong>20분</strong>
              </div>
              <div className="metricCard">
                <span>답변 방식</span>
                <strong>서술형</strong>
              </div>
              <div className="metricCard">
                <span>인증 기준</span>
                <strong>80점</strong>
              </div>
            </div>
            <div className="rubricSection">
              <span>채점 영역</span>
              <div className="rubricGrid">
                {demoPassResult.scoreByCriteria.map((row) => (
                  <strong key={row.name}>{row.name}</strong>
                ))}
              </div>
            </div>
            <div className="callout warning">
              임시저장은 지원하지 않아요. 시작하면 도중에 나가거나 새로고침할 경우 작성 내용이 사라질 수 있어요.
            </div>
            <div className="ctaRow">
              <button
                className="secondaryButton"
                onClick={() => go("mypage", () => {
                  setOnboardingCompleted(true);
                  setVerified(false);
                })}
                type="button"
              >
                나중에 하기
              </button>
              <button className="primaryButton" onClick={startTest} type="button">
                테스트 시작하기
              </button>
            </div>
          </section>
        );

      case "caseSession":
        return (
          <section className="flowSurface wide caseSessionSurface">
            <div
              aria-label={`남은 시간 ${formatTime(seconds)}`}
              className={seconds <= 60 ? "timerBox low" : "timerBox"}
              role="timer"
            >
              <span>남은 시간</span>
              <strong>{formatTime(seconds)}</strong>
            </div>
            {seconds === 60 ? <span className="srOnly" role="alert">응시 시간이 1분 남았습니다.</span> : null}
            {testExpired ? (
              <div className="callout danger" role="alert">
                <strong>응시 시간이 종료됐어요</strong>
                <p>현재 답변은 제출할 수 없습니다. 새 응시를 시작하면 작성 내용이 초기화됩니다.</p>
              </div>
            ) : null}
            <div className="caseGrid">
              <aside className={caseDetailsOpen ? "memberCase open" : "memberCase"}>
                <div className="memberCaseHeader">
                  <div>
                    <p className="kicker">회원 케이스</p>
                    <h1>무릎 통증이 있는 회원</h1>
                  </div>
                  <button
                    aria-controls="member-case-details"
                    aria-expanded={caseDetailsOpen}
                    className="caseToggle"
                    onClick={() => setCaseDetailsOpen((current) => !current)}
                    type="button"
                  >
                    {caseDetailsOpen ? "정보 접기" : "정보 펼치기"}
                  </button>
                </div>
                <div className="caseDetails" id="member-case-details">
                  <dl>
                    <div>
                      <dt>회원</dt>
                      <dd>45세 여성 · 주 2회 PT 희망</dd>
                    </div>
                    <div>
                      <dt>주호소</dt>
                      <dd>계단을 오르내릴 때 무릎 앞쪽 통증</dd>
                    </div>
                    <div>
                      <dt>목표</dt>
                      <dd>통증 없이 하체 근력 강화</dd>
                    </div>
                    <div>
                      <dt>주의</dt>
                      <dd>최근 병원 진단 여부는 확인되지 않음</dd>
                    </div>
                  </dl>
                </div>
              </aside>
              <div className="answerStack">
                <label className="field">
                  <span>Q1. 이 회원에게 추가로 확인할 사항은?</span>
                  <textarea
                    aria-describedby="assessment-help"
                    aria-invalid={Boolean(answerValidation.assessmentError)}
                    disabled={testExpired}
                    value={answer1}
                    onChange={(event) => setAnswer1(fieldValue(event))}
                  />
                  <em
                    className={answerValidation.assessmentError ? "fieldMeta error" : "fieldMeta valid"}
                    id="assessment-help"
                  >
                    {answerValidation.assessmentError ?? "제출 가능한 분량입니다."} · {answer1.trim().length}자
                  </em>
                </label>
                <label className="field">
                  <span>Q2. 4주 운동 처방 계획을 제시하세요</span>
                  <textarea
                    aria-describedby="prescription-help"
                    aria-invalid={Boolean(answerValidation.prescriptionError)}
                    disabled={testExpired}
                    value={answer2}
                    onChange={(event) => setAnswer2(fieldValue(event))}
                  />
                  <em
                    className={answerValidation.prescriptionError ? "fieldMeta error" : "fieldMeta valid"}
                    id="prescription-help"
                  >
                    {answerValidation.prescriptionError ?? "제출 가능한 분량입니다."} · {answer2.trim().length}자
                  </em>
                </label>
              </div>
            </div>
            <div className="ctaRow caseSubmitBar">
              {testExpired ? (
                <button className="primaryButton" onClick={restartTest} type="button">
                  테스트 다시 시작하기
                </button>
              ) : (
                <>
                  {!answerValidation.isValid ? <span>두 답변의 최소 분량을 확인해 주세요.</span> : null}
                  <button
                    className="primaryButton"
                    disabled={!answerValidation.isValid}
                    onClick={() => setModal("submit")}
                    type="button"
                  >
                    답변 제출하기
                  </button>
                </>
              )}
            </div>
          </section>
        );

      case "result":
        return (
          <section className="flowSurface compact">
            <p className="kicker">프로토타입 채점</p>
            <h1>예시 채점 결과</h1>
            <p className="lead">실제 AI가 연결되기 전 사용하는 예시 결과예요. 입력 내용에 포함된 평가·안전·처방 근거를 기준으로 계산합니다.</p>
            <div className="resultGrid">
              <div className={`scoreHero ${caseResult.tone}`}>
                <span>{caseResult.tone === "pass" ? "인증 통과" : "인증 미달"}</span>
                <strong>{caseResult.overallScore}</strong>
                <p>
                  {caseResult.tone === "pass"
                    ? "인증 기준 80점을 넘었어요"
                    : `인증 기준 80점에 ${80 - caseResult.overallScore}점 부족해요`}
                </p>
              </div>
              <div className="criteriaList">
                {caseResult.scoreByCriteria.map((row) => (
                  <div className="criteriaItem" key={row.name}>
                    <div>
                      <span>{row.name}</span>
                      <span className={row.value >= 80 ? "criterionStatus pass" : "criterionStatus fail"}>
                        {row.value >= 80 ? "기준 통과" : "보완 필요"}
                      </span>
                      <strong>{row.value}</strong>
                    </div>
                    <span
                      aria-label={`${row.name} ${row.value}점`}
                      aria-valuemax={100}
                      aria-valuemin={0}
                      aria-valuenow={row.value}
                      className="progressTrack"
                      role="progressbar"
                    >
                      <i aria-hidden="true" className="thresholdMark" />
                      <span style={{ width: `${row.value}%` }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="feedbackBox">
              <strong>{caseResult.tone === "pass" ? "예시 피드백 요약" : "보완 피드백"}</strong>
              <p>{caseResult.feedbackSummary}</p>
              <div className="resultInsights">
                <span><b>강점</b>{caseResult.strengths.length > 0 ? caseResult.strengths.join(" · ") : "추가 확인 필요"}</span>
                <span><b>보완</b>{caseResult.improvements.length > 0 ? caseResult.improvements.join(" · ") : "현재 기준 충족"}</span>
              </div>
            </div>
            <div className="ctaRow">
              {caseResult.tone === "pass" ? (
                <button
                  className="primaryButton"
                  onClick={() => {
                    setVerified(true);
                    navigate(`/trainer/certified${reviewMode ? "?review=1" : ""}`);
                  }}
                  type="button"
                >
                  인증 완료 화면으로 이동
                </button>
              ) : (
                <>
                  <span>재응시 가능 여부는 운영 정책에 따라 안내됩니다.</span>
                  <button className="secondaryButton" onClick={() => go("mypage", () => setVerified(false))} type="button">
                    마이페이지로 이동
                  </button>
                  <button className="primaryButton" onClick={() => go("caseIntro")} type="button">
                    재응시하기
                  </button>
                </>
              )}
            </div>
          </section>
        );

      case "certified":
        return (
          <section className="flowSurface slim centerCard">
            <div className="successMark">PASS</div>
            <p className="kicker success">인증 완료</p>
            <h1>검증된 트레이너가 되었어요</h1>
            <p className="lead">인증 뱃지와 점수가 프로필에 표시되고, 센터 대표에게 더 잘 노출돼요.</p>
            <div className="certScore">
              <span>케이스 테스트 점수</span>
              <strong>{caseResult.overallScore}</strong>
            </div>
            <div className="trustSummary" aria-label="인증 근거">
              <span><b>통과 기준</b>80점 이상</span>
              <span><b>검증 강점</b>{caseResult.strengths.join(" · ")}</span>
              <span><b>자격 정보</b>{candidateProfile.certifications || "등록된 자격 정보 없음"}</span>
            </div>
            <div className="tagGroup" aria-label="주요 전문 분야">
              {selectedSpecialties.slice(0, 3).map((specialty) => (
                <span key={specialty.name}>{specialty.name} · {levelLabels[specialty.level]}</span>
              ))}
            </div>
            <div className="ctaRow full">
              <button className="secondaryButton" onClick={() => go("mypage", () => setVerified(true))} type="button">
                내 프로필로 이동
              </button>
              <button className="primaryButton" onClick={() => navigate("/trainer/offers")} type="button">
                채용 제안 확인하기
              </button>
            </div>
          </section>
        );

      case "mypage":
        return (
          <section className="flowSurface compact">
            <div className="profileHeader">
              <div className="avatar">{name ? name.charAt(0) : "T"}</div>
              <div>
                <strong>{candidateProfile.name || "트레이너"}</strong>
                <span>{candidateProfile.activeRegion || "활동 지역"} · {candidateProfile.careerYears || "경력"}</span>
              </div>
              <div className="profileHeaderActions">
                <StatusBadge status={verified ? "verified" : "unverified"} />
                <button className="compactButton" onClick={() => go("ob1")} type="button">
                  프로필 수정
                </button>
              </div>
            </div>

            {verified ? (
              <>
                <div className="sectionHeading">
                  <div>
                    <span>성과 데이터</span>
                    <strong>트레이너 직접 입력</strong>
                  </div>
                  <small>자기신고 정보</small>
                </div>
                <div className="metricGrid">
                  <div className="metricCard">
                    <span>누적 지도 회원</span>
                    <strong>{members ? `${members}명` : "미입력"}</strong>
                  </div>
                  <div className="metricCard">
                    <span>평균 재등록률</span>
                    <strong>{reReg ? `${reReg}%` : "미입력"}</strong>
                  </div>
                  <div className="metricCard">
                    <span>평균 PT 기간</span>
                    <strong>{ptDur ? `${ptDur}개월` : "미입력"}</strong>
                  </div>
                </div>
                <div className="profileEvidence">
                  <div>
                    <span>한 줄 소개</span>
                    <strong>{candidateProfile.introduction || "소개를 입력해 주세요."}</strong>
                  </div>
                  <div>
                    <span>자격 정보</span>
                    <strong>{candidateProfile.certifications || "등록된 자격 정보 없음"}</strong>
                  </div>
                  <div>
                    <span>검증 강점</span>
                    <strong>{caseResult.strengths.join(" · ") || "추가 확인 필요"}</strong>
                  </div>
                </div>
                <div className="tagBlock">
                  <span>전문 분야</span>
                  <div className="tagGroup">
                    {selectedSpecialties.map((specialty) => (
                      <span key={specialty.name}>{specialty.name} · {levelLabels[specialty.level]}</span>
                    ))}
                  </div>
                </div>
                <div className="historyCard">
                  <strong>케이스 테스트 이력</strong>
                  <p>2026.07.10 제출 · 채점 완료 · PASS {caseResult.overallScore}점</p>
                </div>
                <div className="ctaRow">
                  <button className="primaryButton" onClick={() => navigate("/trainer/offers")} type="button">
                    받은 제안 보기
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="emptyGrid">
                  <div className="emptyState">
                    <strong>아직 인증 전입니다</strong>
                    <p>케이스 테스트를 완료하면 인증 상태와 점수가 프로필에 표시돼요.</p>
                  </div>
                  <div className="emptyState">
                    <strong>아직 받은 제안이 없습니다</strong>
                    <p>인증을 완료하고 경력·성과 정보를 입력하면 센터 대표가 역량을 더 쉽게 확인할 수 있어요.</p>
                  </div>
                </div>
                <div className="ctaRow">
                  <button className="primaryButton" onClick={() => go("caseIntro")} type="button">
                    케이스 테스트 응시하기
                  </button>
                </div>
              </>
            )}
          </section>
        );

      case "offers":
        return (
          <section className="listShell">
            <p className="kicker">채용 제안</p>
            <h1>받은 채용 제안</h1>
            {offers.length === 0 ? (
              <div className="emptyState large">
                <strong>아직 받은 제안이 없습니다</strong>
                <p>인증을 완료하고 경력·성과 정보를 입력하면 센터 대표가 역량을 더 쉽게 확인할 수 있어요.</p>
              </div>
            ) : (
              <div className="offerGrid">
                {offers.map((offer, index) => (
                  <article className="offerCard" key={offer.id}>
                    <div>
                      <h2>{offer.center}</h2>
                      <StatusBadge status={offer.status} />
                    </div>
                    <span>{offer.employmentType} · {offer.salary}</span>
                    <dl className="offerFacts">
                      <div><dt>근무</dt><dd>{offer.workSchedule}</dd></div>
                      <div><dt>시작</dt><dd>{offer.startDate}</dd></div>
                    </dl>
                    <footer>
                      <small>제안일 {offer.offeredAt}</small>
                      <a
                        aria-label={`${offer.center} 제안 상세 보기`}
                        className="offerDetailButton"
                        href="#offer-detail"
                        onClick={(event) => {
                          event.preventDefault();
                          go("offerDetail", () => setSelectedOffer(index));
                        }}
                      >
                        제안 상세 보기
                      </a>
                    </footer>
                  </article>
                ))}
              </div>
            )}
          </section>
        );

      case "offerDetail":
        return (
          <section className="detailGrid">
            <div className="flowCard detailCard">
              <StatusBadge status={activeOffer.status} />
              <h1>{activeOffer.center}</h1>
              <p className="lead">제안일 {activeOffer.offeredAt}</p>
              <dl className="detailList">
                <div>
                  <dt>고용 형태</dt>
                  <dd>{activeOffer.employmentType}</dd>
                </div>
                <div>
                  <dt>근무 조건</dt>
                  <dd>{activeOffer.workSchedule}</dd>
                </div>
                <div>
                  <dt>근무 시작일</dt>
                  <dd>{activeOffer.startDate}</dd>
                </div>
              </dl>
              <div className="messageBox">
                <strong>제안 메시지</strong>
                <p>{activeOffer.message}</p>
              </div>
            </div>
            <aside className="flowCard offerAside">
              <span>급여 조건</span>
              <strong>{activeOffer.salary}</strong>
              {activeOffer.status === "pending" ? (
                <div>
                  <button className="primaryButton" onClick={() => setModal("accept")} type="button">
                    수락하기
                  </button>
                  <button className="dangerButton" onClick={() => setModal("decline")} type="button">
                    거절하기
                  </button>
                </div>
              ) : (
                <p>{activeOffer.status === "accepted" ? "이 제안을 수락했어요." : "이 제안을 거절했어요."}</p>
              )}
            </aside>
          </section>
        );

      case "confirmed":
        return (
          <section className="flowSurface compact centerTop">
            <div className="successMark">확정</div>
            <p className="kicker success">채용 확정</p>
            <h1>제안 수락이 완료됐어요</h1>
            <p className="lead">담당자에게 연락해 근무 일정을 확정하세요.</p>
            <div className="confirmedGrid">
              <dl className="detailList">
                <div>
                  <dt>센터</dt>
                  <dd>{activeOffer.center}</dd>
                </div>
                <div>
                  <dt>고용 형태</dt>
                  <dd>{activeOffer.employmentType}</dd>
                </div>
                <div>
                  <dt>근무 시작일</dt>
                  <dd>{activeOffer.startDate}</dd>
                </div>
              </dl>
              <div className="contactCard">
                <span>담당자 연락처</span>
                <strong>{activeOffer.manager}</strong>
                <a href={`tel:${activeOffer.phone.replace(/-/g, "")}`}>{activeOffer.phone}<b>전화</b></a>
                <a href={`mailto:${activeOffer.email}`}>{activeOffer.email}<b>메일</b></a>
              </div>
            </div>
            <div className="ctaRow">
              <button className="secondaryButton" onClick={() => go("mypage", () => setVerified(true))} type="button">
                내 프로필로 돌아가기
              </button>
              <a className="primaryLinkButton" href={`mailto:${activeOffer.email}`}>
                담당자 이메일 확인
              </a>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="appShell">
      <ProductHeader
        contextLabel="트레이너"
        title={screenTitles[screen]}
        actions={(
          <>
            {stack.length > 0 ? (
              <button aria-label="이전 화면으로" className="ghostButton" onClick={back} type="button">
                뒤로
              </button>
            ) : null}
            {reviewMode ? (
              <button className="ghostButton muted" onClick={() => setMenuOpen(true)} type="button">
                리뷰 화면
              </button>
            ) : null}
          </>
        )}
      />

      {showCandidateNav ? (
        <nav aria-label="트레이너 주요 메뉴" className="candidateNav">
          <button
            aria-current={profileTabActive ? "page" : undefined}
            className={profileTabActive ? "active" : ""}
            onClick={() => navigatePrimary("mypage")}
            type="button"
          >
            내 프로필
          </button>
          <button
            aria-current={offersTabActive ? "page" : undefined}
            className={offersTabActive ? "active" : ""}
            onClick={() => navigatePrimary("offers")}
            type="button"
          >
            받은 제안
          </button>
        </nav>
      ) : null}

      <span aria-live="polite" className="srOnly">{screenTitles[screen]} 화면</span>
      <div className="mainSurface">{renderScreen()}</div>

      {reviewMode && menuOpen ? (
        <div className="drawerBackdrop" onClick={() => setMenuOpen(false)} role="presentation">
          <aside
            aria-label="리뷰 화면 이동"
            aria-modal="true"
            className="drawerPanel"
            onClick={(event) => event.stopPropagation()}
            ref={drawerRef}
            role="dialog"
          >
            <div className="drawerHeader">
              <strong>화면 이동 · 리뷰</strong>
              <button onClick={() => setMenuOpen(false)} type="button" aria-label="화면 목록 닫기">
                ×
              </button>
            </div>
            <p>실제 플로우는 화면 안 버튼으로 진행돼요. 아래 목록은 상태를 바로 확인하는 리뷰용입니다.</p>
            <div className="menuList">
              {menuEntries.map((entry) => (
                <button key={`${entry.screen}-${entry.label}`} onClick={() => jump(entry.screen, entry.setup)} type="button">
                  <span>{entry.label}</span>
                  <small>{entry.sub}</small>
                </button>
              ))}
            </div>
          </aside>
        </div>
      ) : null}

      {modal ? (
        <div className="modalBackdrop" onClick={() => setModal(null)} role="presentation">
          <section
            aria-labelledby="flow-modal-title"
            aria-modal="true"
            className="modalPanel"
            onClick={(event) => event.stopPropagation()}
            ref={modalRef}
            role="dialog"
          >
            {modal === "submit" ? (
              <>
                <p>제출 확인</p>
                <h2 id="flow-modal-title">답변을 제출할까요?</h2>
                <span>
                  Q1 {answer1.trim().length}자, Q2 {answer2.trim().length}자를 제출합니다. 제출 후에는 답변을 수정할 수 없어요.
                </span>
                <div className="modalActions">
                  <button className="secondaryButton" onClick={() => setModal(null)} type="button">
                    다시 확인하기
                  </button>
                  <button
                    className="primaryButton"
                    onClick={submitCaseTest}
                    type="button"
                  >
                    제출하고 채점 보기
                  </button>
                </div>
              </>
            ) : modal === "accept" ? (
              <>
                <p>제안 수락 확인</p>
                <h2 id="flow-modal-title">최종 조건을 확인해 주세요</h2>
                <dl className="modalSummary">
                  <div><dt>센터</dt><dd>{activeOffer.center}</dd></div>
                  <div><dt>고용 형태</dt><dd>{activeOffer.employmentType}</dd></div>
                  <div><dt>급여</dt><dd>{activeOffer.salary}</dd></div>
                  <div><dt>시작일</dt><dd>{activeOffer.startDate}</dd></div>
                </dl>
                <span>수락하면 채용 확정 상태로 변경되고 센터 담당자 연락처가 공개됩니다.</span>
                <div className="modalActions">
                  <button className="secondaryButton" onClick={() => setModal(null)} type="button">
                    계속 검토하기
                  </button>
                  <button className="primaryButton" onClick={acceptOffer} type="button">
                    제안 수락 확정
                  </button>
                </div>
              </>
            ) : modal === "decline" ? (
              <>
                <p>제안 거절 확인</p>
                <h2 id="flow-modal-title">이 제안을 거절할까요?</h2>
                <span>거절하면 제안 상태가 거절로 변경됩니다. 이후 같은 조건의 제안은 센터에서 다시 보내야 확인할 수 있습니다.</span>
                <div className="modalActions">
                  <button className="secondaryButton" onClick={() => setModal(null)} type="button">
                    계속 검토하기
                  </button>
                  <button className="dangerButton" onClick={declineOffer} type="button">
                    거절 확정
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>응시 종료 확인</p>
                <h2 id="flow-modal-title">테스트를 나갈까요?</h2>
                <span>현재 응시는 종료되며 작성한 답변은 저장되지 않습니다.</span>
                <div className="modalActions">
                  <button className="secondaryButton" onClick={() => setModal(null)} type="button">
                    계속 작성하기
                  </button>
                  <button
                    className="dangerButton"
                    onClick={leaveTest}
                    type="button"
                  >
                    나가기
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
