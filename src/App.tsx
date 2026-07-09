import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import "./App.css";

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

type ResultTone = "pass" | "fail";
type ModalKind = "submit" | "decline" | null;
type OfferStatus = "pending" | "accepted" | "declined" | "cancelled";

type Specialty = {
  name: string;
  level: number;
};

type Offer = {
  center: string;
  type: string;
  salary: string;
  startDate: string;
  date: string;
  extra: string;
  manager: string;
  phone: string;
  email: string;
  status: OfferStatus;
  message: string;
};

type MenuEntry = {
  label: string;
  sub: string;
  screen: ScreenId;
  setup?: () => void;
};

const levelLabels = ["미선택", "하", "중하", "중", "중상", "상"];

const baseOffers: Offer[] = [
  {
    center: "강남 리포머 피트니스",
    type: "정직원",
    salary: "월 290만원 + 인센티브",
    startDate: "2026.08.01",
    date: "2026.07.18",
    extra: "주 5일 · 오후 1시~9시",
    manager: "박서윤 매니저",
    phone: "010-4821-9033",
    email: "hire@reformer-gangnam.example",
    status: "pending",
    message:
      "재활 PT 경험과 회원 유지 성과를 보고 제안드립니다. 주 5일 오후 근무를 우선 협의하고 싶습니다."
  },
  {
    center: "마포 바디밸런스 스튜디오",
    type: "프리랜서",
    salary: "세션당 4.5만원",
    startDate: "2026.07.28",
    date: "2026.07.15",
    extra: "주 3~4일 · 스케줄 협의",
    manager: "정하늘 실장",
    phone: "010-2277-5510",
    email: "team@bodybalance-mapo.example",
    status: "pending",
    message:
      "그룹 리포머와 1:1 재활 세션을 함께 맡아 주실 분을 찾고 있어요. 스케줄은 유연하게 조율할 수 있습니다."
  },
  {
    center: "성수 스트렝스랩",
    type: "파트타임",
    salary: "시급 3.2만원",
    startDate: "2026.08.05",
    date: "2026.07.12",
    extra: "주 3일 · 저녁 시간대",
    manager: "김도현 대표",
    phone: "010-9033-1188",
    email: "recruit@strengthlab.example",
    status: "pending",
    message:
      "퍼포먼스 향상과 체형 교정에 강점 있는 트레이너를 찾습니다. 초기 온보딩은 저희가 지원합니다."
  }
];

const scoreRows = {
  pass: [
    { name: "평가 능력", value: 80 },
    { name: "운동 처방", value: 88 },
    { name: "커뮤니케이션", value: 72 },
    { name: "안전 고려", value: 90 }
  ],
  fail: [
    { name: "평가 능력", value: 74 },
    { name: "운동 처방", value: 77 },
    { name: "커뮤니케이션", value: 70 },
    { name: "안전 고려", value: 83 }
  ]
};

const screenTitles: Record<ScreenId, string> = {
  ob1: "프로필 등록",
  ob2: "프로필 등록",
  ob3: "프로필 등록",
  caseIntro: "케이스 테스트",
  caseSession: "케이스 테스트",
  result: "채점 결과",
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
  return baseOffers.map((offer) => ({ ...offer }));
}

function formatTime(totalSeconds: number) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function ProgressSteps({ active }: { active: number }) {
  return (
    <div className="progressSteps" aria-label={`온보딩 ${active}단계`}>
      {[1, 2, 3].map((step) => (
        <span className={step <= active ? "active" : ""} key={step} />
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
  const [screen, setScreen] = useState<ScreenId>("ob1");
  const [stack, setStack] = useState<ScreenId[]>([]);
  const [name, setName] = useState("한민서");
  const [region, setRegion] = useState("서울 강남 · 서초");
  const [career, setCareer] = useState("3년 8개월");
  const [cert, setCert] = useState("생활스포츠지도사 2급, NASM-CES");
  const [intro, setIntro] = useState("통증 이력이 있는 회원의 안전한 재활 운동을 돕습니다.");
  const [specialties, setSpecialties] = useState<Specialty[]>([
    { name: "재활", level: 5 },
    { name: "다이어트", level: 4 },
    { name: "시니어 트레이닝", level: 3 },
    { name: "퍼포먼스 / 스포츠", level: 0 },
    { name: "체형 교정", level: 0 },
    { name: "바디프로필 준비", level: 0 }
  ]);
  const [members, setMembers] = useState("142");
  const [reReg, setReReg] = useState("78");
  const [ptDur, setPtDur] = useState("5.6");
  const [answer1, setAnswer1] = useState(
    "통증 발생 시점, 과거 병력, 통증 강도(NRS), 계단 외 통증 유발 동작, 병원 진단·영상 여부를 먼저 확인합니다."
  );
  const [answer2, setAnswer2] = useState(
    "1~2주는 통증 없는 범위에서 고관절 힌지와 둔근 활성화를 확인하고, 3~4주에 박스 스쿼트와 낮은 스텝업으로 점진 부하를 설계합니다. 매 세션 통증 반응을 재평가합니다."
  );
  const [seconds, setSeconds] = useState(20 * 60);
  const [resultTone, setResultTone] = useState<ResultTone>("pass");
  const [verified, setVerified] = useState(false);
  const [offers, setOffers] = useState<Offer[]>(resetOffers);
  const [selectedOffer, setSelectedOffer] = useState(0);
  const [modal, setModal] = useState<ModalKind>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const ob1Invalid = !(name.trim() && region.trim() && career.trim());
  const selectedSpecialties = useMemo(
    () => specialties.filter((specialty) => specialty.level > 0).sort((a, b) => b.level - a.level),
    [specialties]
  );
  const ob2Invalid = selectedSpecialties.length === 0;
  const activeOffer = offers[selectedOffer] ?? offers[0] ?? baseOffers[0];
  const score = resultTone === "pass" ? 82 : 76;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  useEffect(() => {
    if (screen !== "caseSession") {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "caseSession") {
      return undefined;
    }

    const warnBeforeLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeLeave);
    return () => window.removeEventListener("beforeunload", warnBeforeLeave);
  }, [screen]);

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

  const back = () => {
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

  const startTest = () => {
    setSeconds(20 * 60);
    go("caseSession");
  };

  const setLevel = (index: number, level: number) => {
    setSpecialties((current) =>
      current.map((specialty, currentIndex) =>
        currentIndex === index ? { ...specialty, level: specialty.level === level ? 0 : level } : specialty
      )
    );
  };

  const acceptOffer = () => {
    setOffers((current) =>
      current.map((offer, index) => (index === selectedOffer ? { ...offer, status: "accepted" } : offer))
    );
    go("confirmed");
  };

  const declineOffer = () => {
    setOffers((current) =>
      current.map((offer, index) => (index === selectedOffer ? { ...offer, status: "declined" } : offer))
    );
    setModal(null);
    go("offers");
  };

  const menuEntries: MenuEntry[] = [
    { label: "온보딩 1 · 기본 정보", sub: "이름·지역·경력 입력", screen: "ob1" },
    { label: "온보딩 2 · 전문 분야", sub: "숙련도 1~5 선택", screen: "ob2" },
    { label: "온보딩 3 · 성과 데이터", sub: "선택 입력", screen: "ob3" },
    { label: "케이스 테스트 안내", sub: "기준·채점 영역", screen: "caseIntro" },
    { label: "케이스 테스트 응시", sub: "타이머·서술형 답변", screen: "caseSession", setup: () => setSeconds(20 * 60) },
    { label: "채점 결과 · PASS", sub: "인증 통과 상태", screen: "result", setup: () => setResultTone("pass") },
    { label: "채점 결과 · FAIL", sub: "인증 미달 상태", screen: "result", setup: () => setResultTone("fail") },
    { label: "인증 완료", sub: "인증 뱃지·점수", screen: "certified", setup: () => setVerified(true) },
    { label: "마이페이지 · 인증 후", sub: "점수·제안·이력", screen: "mypage", setup: () => setVerified(true) },
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
          <section className="flowCard narrow">
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
          <section className="flowCard compact">
            <ProgressSteps active={2} />
            <p className="kicker">온보딩 2 / 3</p>
            <h1>전문 분야와 숙련도</h1>
            <p className="lead">최소 1개 이상 선택하고, 1~5 척도로 숙련도를 표시하세요.</p>
            <div className="specialtyGrid">
              {specialties.map((specialty, index) => (
                <article className="specialtyCard" key={specialty.name}>
                  <div>
                    <strong>{specialty.name}</strong>
                    <span>{specialty.level > 0 ? `${specialty.level} / 5 · ${levelLabels[specialty.level]}` : "미선택"}</span>
                  </div>
                  <div className="levelButtons" aria-label={`${specialty.name} 숙련도`}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        className={level <= specialty.level ? "active" : ""}
                        key={level}
                        onClick={() => setLevel(index, level)}
                        type="button"
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="selectionNote">
              선택한 분야 <strong>{selectedSpecialties.length}개</strong> · 각 숫자를 눌러 숙련도를 조절하세요.
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
          <section className="flowCard slim">
            <ProgressSteps active={3} />
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
              <button className="secondaryButton" onClick={() => go("mypage", () => setVerified(false))} type="button">
                나중에 하기
              </button>
              <button className="primaryButton" onClick={() => go("caseIntro")} type="button">
                케이스 테스트 바로 응시하기
              </button>
            </div>
          </section>
        );

      case "caseIntro":
        return (
          <section className="flowCard compact">
            <p className="kicker">케이스 테스트</p>
            <h1>실무 역량을 인증받아요</h1>
            <p className="lead">실제 회원 케이스 1개에 서술형으로 답하면 AI가 채점해 인증 여부를 판단해요.</p>
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
                {scoreRows.pass.map((row) => (
                  <strong key={row.name}>{row.name}</strong>
                ))}
              </div>
            </div>
            <div className="callout warning">
              임시저장은 지원하지 않아요. 시작하면 도중에 나가거나 새로고침할 경우 작성 내용이 사라질 수 있어요.
            </div>
            <div className="ctaRow">
              <button className="secondaryButton" onClick={() => go("mypage", () => setVerified(false))} type="button">
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
          <section className="flowCard wide">
            <div className={seconds <= 60 ? "timerBox low" : "timerBox"}>
              <span>남은 시간</span>
              <strong>{formatTime(seconds)}</strong>
            </div>
            <div className="caseGrid">
              <aside className="memberCase">
                <p className="kicker">회원 케이스</p>
                <h1>무릎 통증이 있는 회원</h1>
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
              </aside>
              <div className="answerStack">
                <label className="field">
                  <span>Q1. 이 회원에게 추가로 확인할 사항은?</span>
                  <textarea value={answer1} onChange={(event) => setAnswer1(fieldValue(event))} />
                </label>
                <label className="field">
                  <span>Q2. 4주 운동 처방 계획을 제시하세요</span>
                  <textarea value={answer2} onChange={(event) => setAnswer2(fieldValue(event))} />
                </label>
              </div>
            </div>
            <div className="ctaRow">
              <button className="primaryButton" onClick={() => setModal("submit")} type="button">
                제출하기
              </button>
            </div>
          </section>
        );

      case "result":
        return (
          <section className="flowCard compact">
            <p className="kicker">채점 결과</p>
            <h1>AI 채점이 완료됐어요</h1>
            <div className="resultGrid">
              <div className={`scoreHero ${resultTone}`}>
                <span>{resultTone === "pass" ? "인증 통과" : "인증 미달"}</span>
                <strong>{score}</strong>
                <p>{resultTone === "pass" ? "인증 기준 80점을 넘었어요" : "인증 기준 80점에 4점 부족해요"}</p>
              </div>
              <div className="criteriaList">
                {scoreRows[resultTone].map((row) => (
                  <div className="criteriaItem" key={row.name}>
                    <div>
                      <span>{row.name}</span>
                      <strong>{row.value}</strong>
                    </div>
                    <span className="progressTrack">
                      <span style={{ width: `${row.value}%` }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="feedbackBox">
              <strong>{resultTone === "pass" ? "AI 피드백 요약" : "보완 피드백"}</strong>
              <p>
                {resultTone === "pass"
                  ? "안전 우선 접근과 점진적 하체 강화 계획이 명확합니다. 첫 상담에서 회원의 불안을 낮추는 설명을 조금 더 구체화하면 좋습니다."
                  : "핵심 판단 방향은 맞지만 근거 설명이 부족합니다. 통증 원인 가설과 운동 강도 조절 기준을 더 구체적으로 제시하면 점수가 올라갑니다."}
              </p>
            </div>
            <div className="ctaRow">
              {resultTone === "pass" ? (
                <button className="primaryButton" onClick={() => go("certified", () => setVerified(true))} type="button">
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
          <section className="flowCard slim centerCard">
            <div className="successMark">PASS</div>
            <p className="kicker success">인증 완료</p>
            <h1>검증된 트레이너가 되었어요</h1>
            <p className="lead">인증 뱃지와 점수가 프로필에 표시되고, 센터 대표에게 더 잘 노출돼요.</p>
            <div className="certScore">
              <span>케이스 테스트 점수</span>
              <strong>82</strong>
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
              <button className="primaryButton" onClick={() => go("offers", () => setOffers(resetOffers()))} type="button">
                채용 제안 확인하기
              </button>
            </div>
          </section>
        );

      case "mypage":
        return (
          <section className="flowCard compact">
            <div className="profileHeader">
              <div className="avatar">{name ? name.charAt(0) : "T"}</div>
              <div>
                <strong>{name || "트레이너"}</strong>
                <span>{region || "활동 지역"} · {career || "경력"}</span>
              </div>
              <StatusBadge status={verified ? "verified" : "unverified"} />
            </div>

            {verified ? (
              <>
                <div className="metricGrid">
                  <div className="metricCard">
                    <span>종합 점수</span>
                    <strong>82점</strong>
                  </div>
                  <div className="metricCard">
                    <span>받은 제안</span>
                    <strong>{offers.length}건</strong>
                  </div>
                  <div className="metricCard">
                    <span>완성도</span>
                    <strong>92%</strong>
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
                  <p>2026.07.06 제출 · 채점 완료 · PASS 82점</p>
                </div>
                <div className="ctaRow">
                  <button className="primaryButton" onClick={() => go("offers")} type="button">
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
                    <p>인증과 프로필 완성도가 높을수록 센터 대표에게 더 잘 노출돼요.</p>
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
                <p>인증과 프로필 완성도가 높을수록 센터 대표에게 더 잘 노출돼요.</p>
              </div>
            ) : (
              <div className="offerGrid">
                {offers.map((offer, index) => (
                  <button
                    className="offerCard"
                    key={`${offer.center}-${offer.date}`}
                    onClick={() => go("offerDetail", () => setSelectedOffer(index))}
                    type="button"
                  >
                    <div>
                      <strong>{offer.center}</strong>
                      <StatusBadge status={offer.status} />
                    </div>
                    <span>{offer.type} · {offer.salary}</span>
                    <p>
                      <small>제안일 {offer.date}</small>
                      <b>자세히 보기</b>
                    </p>
                  </button>
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
              <p className="lead">제안일 {activeOffer.date}</p>
              <dl className="detailList">
                <div>
                  <dt>고용 형태</dt>
                  <dd>{activeOffer.type}</dd>
                </div>
                <div>
                  <dt>근무 조건</dt>
                  <dd>{activeOffer.extra}</dd>
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
                  <button className="primaryButton" onClick={acceptOffer} type="button">
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
          <section className="flowCard compact centerTop">
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
                  <dd>{activeOffer.type}</dd>
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
                홈으로 돌아가기
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
    <main className="appShell">
      <header className="topBar">
        <div className="brandMark">
          <span className="brandDot" />
          FitProof
        </div>
        <span className="topTitle">트레이너 · {screenTitles[screen]}</span>
        <div className="topActions">
          {stack.length > 0 ? (
            <button className="ghostButton" onClick={back} type="button">
              뒤로
            </button>
          ) : null}
          <button className="ghostButton muted" onClick={() => setMenuOpen(true)} type="button">
            화면 목록
          </button>
        </div>
      </header>

      <div className="mainSurface">{renderScreen()}</div>

      {menuOpen ? (
        <div className="drawerBackdrop" onClick={() => setMenuOpen(false)} role="presentation">
          <aside className="drawerPanel" onClick={(event) => event.stopPropagation()}>
            <div className="drawerHeader">
              <strong>화면 이동 · 리뷰</strong>
              <button onClick={() => setMenuOpen(false)} type="button" aria-label="화면 목록 닫기">
                닫기
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
            role="dialog"
          >
            {modal === "submit" ? (
              <>
                <p>제출 확인</p>
                <h2 id="flow-modal-title">답변을 제출할까요?</h2>
                <span>제출 후에는 답변을 수정할 수 없습니다. 작성한 답변과 케이스 테스트 결과가 채점에 사용됩니다.</span>
                <div className="modalActions">
                  <button className="secondaryButton" onClick={() => setModal(null)} type="button">
                    다시 확인하기
                  </button>
                  <button
                    className="primaryButton"
                    onClick={() => {
                      setModal(null);
                      go("result", () => setResultTone("pass"));
                    }}
                    type="button"
                  >
                    제출하고 채점 보기
                  </button>
                </div>
              </>
            ) : (
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
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
