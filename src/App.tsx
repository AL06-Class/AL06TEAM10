import { useEffect, useMemo, useState } from "react";
import "./App.css";

type ModalKind = "submit" | "decline" | null;

type ScreenActions = {
  goTo: (id: string) => void;
  openModal: (kind: Exclude<ModalKind, null>) => void;
};

type Screen = {
  id: string;
  phase: string;
  title: string;
  summary: string;
  render: (actions: ScreenActions) => JSX.Element;
};

const trainer = {
  name: "한민서",
  region: "서울 강남 · 서초",
  career: "3년 8개월",
  certificates: "생활스포츠지도사 2급, NASM-CES",
  score: 82,
  image: "https://picsum.photos/seed/trainer-minseo/160/160"
};

const specialtyRows = [
  { name: "재활", level: 5, label: "상", value: 92 },
  { name: "다이어트", level: 4, label: "중상", value: 84 },
  { name: "시니어", level: 3, label: "중", value: 68 },
  { name: "퍼포먼스", level: 0, label: "미선택", value: 0 }
];

const passScores = [
  { name: "평가 능력", value: 80 },
  { name: "운동 처방", value: 88 },
  { name: "커뮤니케이션", value: 72 },
  { name: "안전 고려", value: 90 }
];

const failScores = [
  { name: "평가 능력", value: 74 },
  { name: "운동 처방", value: 77 },
  { name: "커뮤니케이션", value: 70 },
  { name: "안전 고려", value: 83 }
];

const offers = [
  {
    center: "강남 리포머 피트니스",
    type: "정직원",
    salary: "월 270만원",
    date: "2026.07.18",
    statusLabel: "검토 대기"
  },
  {
    center: "마포 바디밸런스 스튜디오",
    type: "프리랜서",
    salary: "세션당 협의",
    date: "2026.07.15",
    statusLabel: "신규 제안"
  }
];

function ProgressBar({ value }: { value: number }) {
  return (
    <span className="progressTrack" aria-label={`${value}점`}>
      <span className="progressFill" style={{ width: `${value}%` }} />
    </span>
  );
}

function Field({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} readOnly />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function TextAnswer({ label, value }: { label: string; value: string }) {
  return (
    <label className="field textAnswer">
      <span>{label}</span>
      <textarea value={value} readOnly />
    </label>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="metricCard">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

function ProfileStrip({ status = "인증 전" }: { status?: string }) {
  return (
    <div className="profileStrip">
      <img src={trainer.image} alt="트레이너 프로필" />
      <div>
        <strong>{trainer.name}</strong>
        <span>{trainer.region}</span>
      </div>
      <span className={status === "인증 통과" ? "statusBadge pass" : "statusBadge"}>{status}</span>
    </div>
  );
}

function ScorePanel({
  title,
  score,
  scores,
  tone
}: {
  title: string;
  score: number;
  scores: typeof passScores;
  tone: "pass" | "fail";
}) {
  return (
    <div className="resultGrid">
      <div className={`scoreHero ${tone}`}>
        <span>{tone === "pass" ? "인증 통과" : "인증 미달"}</span>
        <strong>{score}</strong>
        <p>{title}</p>
      </div>
      <div className="criteriaList">
        {scores.map((item) => (
          <div className="criteriaItem" key={item.name}>
            <div>
              <span>{item.name}</span>
              <strong>{item.value}</strong>
            </div>
            <ProgressBar value={item.value} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OnboardingBasic() {
  return (
    <div className="twoColumn">
      <section className="panel">
        <div className="sectionTitle">
          <p>온보딩 1/3</p>
          <h2>기본 정보를 먼저 확인합니다</h2>
        </div>
        <div className="formGrid">
          <Field label="이름" value={trainer.name} hint="센터에 공개되는 프로필 이름입니다." />
          <Field label="활동 지역" value={trainer.region} hint="채용 제안 매칭의 주요 기준입니다." />
          <Field label="경력" value={trainer.career} hint="정규 근무와 프리랜서 경력을 함께 적습니다." />
          <Field label="주요 자격증" value={trainer.certificates} hint="선택 입력이지만 신뢰도에 영향을 줍니다." />
          <Field label="한 줄 소개" value="통증 이력이 있는 회원의 안전한 재활 운동을 돕습니다." />
        </div>
      </section>
      <aside className="panel quietPanel">
        <ProfileStrip />
        <div className="callout">
          <strong>필수값 검증</strong>
          <p>이름, 활동 지역, 경력이 비어 있으면 다음 단계로 이동하지 않습니다.</p>
        </div>
        <button className="primaryButton">다음</button>
      </aside>
    </div>
  );
}

function OnboardingSpecialty() {
  return (
    <div className="singlePanel">
      <div className="sectionTitle">
        <p>온보딩 2/3</p>
        <h2>전문 분야와 숙련도를 선택합니다</h2>
      </div>
      <div className="specialtyTable">
        {specialtyRows.map((item) => (
          <div className="specialtyRow" key={item.name}>
            <div>
              <strong>{item.name}</strong>
              <span>{item.label}</span>
            </div>
            <ProgressBar value={item.value} />
            <span>{item.level > 0 ? `${item.level} / 5` : "미선택"}</span>
          </div>
        ))}
      </div>
      <div className="bottomNote">
        <strong>선택 규칙</strong>
        <p>전문 분야는 최소 1개 이상 필요하고, 선택한 분야는 숙련도 1~5 척도로 저장합니다.</p>
      </div>
    </div>
  );
}

function OnboardingPerformance() {
  return (
    <div className="twoColumn">
      <section className="panel">
        <div className="sectionTitle">
          <p>온보딩 3/3</p>
          <h2>성과 데이터는 협상 근거가 됩니다</h2>
        </div>
        <div className="metricsGrid">
          <Metric label="누적 지도 회원" value="142명" hint="자기신고 입력" />
          <Metric label="평균 재등록률" value="78%" hint="최근 12개월 기준" />
          <Metric label="평균 PT 지속 기간" value="5.6개월" hint="선택 입력" />
        </div>
      </section>
      <aside className="panel quietPanel">
        <div className="callout">
          <strong>다음 행동</strong>
          <p>바로 케이스 테스트를 응시하거나, 인증 전 마이페이지로 이동해 나중에 시작할 수 있습니다.</p>
        </div>
        <button className="primaryButton">케이스 테스트 바로 응시하기</button>
        <button className="secondaryButton">나중에 하기</button>
      </aside>
    </div>
  );
}

function CaseIntro() {
  return (
    <div className="singlePanel">
      <div className="sectionTitle">
        <p>케이스 테스트 안내</p>
        <h2>테스트 방식과 인증 기준을 먼저 안내합니다</h2>
      </div>
      <div className="infoGrid">
        <Metric label="예상 소요시간" value="25분" hint="케이스 1개" />
        <Metric label="답변 방식" value="서술형" hint="AI 채점 대상" />
        <Metric label="인증 기준" value="80점 이상" hint="PASS 기준" />
      </div>
      <div className="rubricGrid">
        {passScores.map((item) => (
          <div className="rubricCard" key={item.name}>
            <strong>{item.name}</strong>
            <p>{item.name} 관점에서 실제 PT 상담에 필요한 판단과 설명을 평가합니다.</p>
          </div>
        ))}
      </div>
      <div className="warningLine">임시저장이 없을 경우 시작 전 명확히 안내합니다. 이탈하면 작성 내용이 사라질 수 있습니다.</div>
    </div>
  );
}

function CaseSession({ openModal }: ScreenActions) {
  return (
    <div className="caseLayout">
      <aside className="panel memberPanel">
        <span className="timerBadge">남은 시간 18:42</span>
        <div className="sectionTitle">
          <p>회원 케이스</p>
          <h2>무릎 통증 회원</h2>
        </div>
        <dl className="detailList">
          <div>
            <dt>회원</dt>
            <dd>45세 여성</dd>
          </div>
          <div>
            <dt>주호소</dt>
            <dd>계단 이용 시 무릎 통증</dd>
          </div>
          <div>
            <dt>목표</dt>
            <dd>통증 없이 하체 근력 강화</dd>
          </div>
          <div>
            <dt>주의</dt>
            <dd>최근 병원 진단 여부 미확인</dd>
          </div>
        </dl>
      </aside>
      <section className="panel answerPanel">
        <TextAnswer
          label="Q1. 추가로 확인할 사항"
          value="통증 발생 시점, 과거 병력, 통증 강도, 일상 동작 제한, 병원 진단 여부를 먼저 확인합니다."
        />
        <TextAnswer
          label="Q2. 운동 처방 계획"
          value="통증 없는 범위에서 고관절 힌지와 둔근 활성화를 확인하고, 박스 스쿼트와 낮은 스텝업으로 점진 부하를 설계합니다."
        />
        <div className="confirmBox">
          <strong>제출 전 확인</strong>
          <p>제출 후에는 답변을 수정할 수 없습니다. 브라우저 뒤로가기와 새로고침 시 작성 내용이 사라질 수 있습니다.</p>
          <button className="primaryButton" onClick={() => openModal("submit")} type="button">제출하기</button>
        </div>
      </section>
    </div>
  );
}

function ResultPass() {
  return (
    <div className="singlePanel">
      <div className="sectionTitle">
        <p>채점 결과</p>
        <h2>채점 결과: 인증 통과</h2>
      </div>
      <ScorePanel title="인증 기준 80점을 넘었습니다." score={82} scores={passScores} tone="pass" />
      <div className="feedbackBox">
        <strong>AI 피드백 요약</strong>
        <p>안전 우선 접근과 점진적 하체 강화 계획이 명확합니다. 첫 상담에서 불안감을 낮추는 설명을 조금 더 구체화하면 좋습니다.</p>
      </div>
      <button className="primaryButton">인증 완료 화면으로 이동</button>
    </div>
  );
}

function ResultFail() {
  return (
    <div className="singlePanel">
      <div className="sectionTitle">
        <p>채점 결과</p>
        <h2>채점 결과: 인증 미달</h2>
      </div>
      <ScorePanel title="인증 기준 80점에 미달했습니다." score={76} scores={failScores} tone="fail" />
      <div className="feedbackBox">
        <strong>운영 정책 안내</strong>
        <p>재응시 가능 여부는 운영 정책에 따라 안내됩니다. 지금은 마이페이지에서 결과와 보완 피드백을 확인할 수 있습니다.</p>
      </div>
      <div className="buttonRow">
        <button className="primaryButton">재응시하기</button>
        <button className="secondaryButton">마이페이지로 이동</button>
      </div>
    </div>
  );
}

function Certified() {
  return (
    <div className="twoColumn">
      <section className="panel certifiedPanel">
        <ProfileStrip status="인증 통과" />
        <div className="certifiedScore">
          <span>케이스 테스트 점수</span>
          <strong>82</strong>
          <p>재활, 다이어트 분야 중심의 실무 역량이 검증되었습니다.</p>
        </div>
      </section>
      <aside className="panel quietPanel">
        <div className="callout">
          <strong>인증 완료 후 행동</strong>
          <p>1.0에는 별도 센터 탐색 화면이 없으므로 채용 제안 확인과 내 프로필 이동만 제공합니다.</p>
        </div>
        <button className="primaryButton">채용 제안 확인하기</button>
        <button className="secondaryButton">내 프로필로 이동</button>
      </aside>
    </div>
  );
}

function MyPage() {
  return (
    <div className="mypageGrid">
      <section className="panel">
        <ProfileStrip status="인증 통과" />
        <div className="metricsGrid">
          <Metric label="종합 점수" value="82점" />
          <Metric label="받은 제안" value="2건" />
          <Metric label="프로필 완성도" value="92%" />
        </div>
        <div className="historyCard">
          <strong>케이스 테스트 이력</strong>
          <p>2026.07.06 제출 · graded · PASS</p>
        </div>
      </section>
      <aside className="panel quietPanel">
        <div className="emptyState">
          <strong>아직 인증 전입니다</strong>
          <p>케이스 테스트를 완료하면 인증 상태와 점수가 프로필에 표시됩니다.</p>
          <button className="primaryButton">케이스 테스트 응시하기</button>
        </div>
        <div className="emptyState">
          <strong>아직 받은 제안이 없습니다</strong>
          <p>인증과 프로필 완성도가 높을수록 센터 대표에게 더 잘 노출됩니다.</p>
        </div>
      </aside>
    </div>
  );
}

function OfferList() {
  return (
    <div className="singlePanel">
      <div className="sectionTitle">
        <p>채용 제안</p>
        <h2>받은 채용 제안 목록</h2>
      </div>
      <div className="offerList">
        {offers.map((offer) => (
          <article className="offerCard" key={offer.center}>
            <div>
              <strong>{offer.center}</strong>
              <span>{offer.type} · {offer.salary}</span>
            </div>
            <div>
              <span>{offer.date}</span>
              <span className="statusBadge">{offer.statusLabel}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="bottomNote">
        <strong>0건 상태</strong>
        <p>제안이 없으면 "아직 받은 제안이 없습니다" empty state를 표시합니다.</p>
      </div>
    </div>
  );
}

function OfferDetail({ goTo, openModal }: ScreenActions) {
  return (
    <div className="twoColumn">
      <section className="panel">
        <div className="sectionTitle">
          <p>제안 상세</p>
          <h2>강남 리포머 피트니스</h2>
        </div>
        <dl className="detailList strongList">
          <div>
            <dt>고용 형태</dt>
            <dd>정직원</dd>
          </div>
          <div>
            <dt>급여 조건</dt>
            <dd>월 270만원</dd>
          </div>
          <div>
            <dt>근무 시작일</dt>
            <dd>2026.08.01</dd>
          </div>
          <div>
            <dt>제안 메시지</dt>
            <dd>재활 PT 경험과 회원 유지 성과를 보고 제안드립니다. 주 5일 오후 근무를 우선 협의하고 싶습니다.</dd>
          </div>
        </dl>
      </section>
      <aside className="panel quietPanel">
        <div className="callout">
          <strong>상태 처리</strong>
          <p>수락하면 채용 확정 화면으로 이동하고, 거절은 확인 모달을 거친 뒤 처리합니다.</p>
        </div>
        <button className="primaryButton" onClick={() => goTo("11")} type="button">수락하기</button>
        <button className="dangerButton" onClick={() => openModal("decline")} type="button">거절하기</button>
      </aside>
    </div>
  );
}

function Confirmed() {
  return (
    <div className="twoColumn">
      <section className="panel confirmedPanel">
        <div className="sectionTitle">
          <p>채용 확정</p>
          <h2>채용 제안 수락이 완료되었습니다</h2>
        </div>
        <dl className="detailList strongList">
          <div>
            <dt>센터</dt>
            <dd>강남 리포머 피트니스</dd>
          </div>
          <div>
            <dt>고용 형태</dt>
            <dd>정직원</dd>
          </div>
          <div>
            <dt>시작일</dt>
            <dd>2026.08.01</dd>
          </div>
        </dl>
      </section>
      <aside className="panel contactPanel">
        <span>담당자 연락처</span>
        <strong>박서윤 매니저</strong>
        <a href="tel:010-4821-9033">010-4821-9033</a>
        <a href="mailto:hire@reformer-gangnam.example">hire@reformer-gangnam.example</a>
        <button className="primaryButton">담당자 이메일 확인</button>
        <button className="secondaryButton">홈으로 돌아가기</button>
      </aside>
    </div>
  );
}

const screens: Screen[] = [
  {
    id: "01",
    phase: "온보딩",
    title: "기본 정보",
    summary: "이름, 활동 지역, 경력, 자격증을 입력하는 첫 화면입니다.",
    render: OnboardingBasic
  },
  {
    id: "02",
    phase: "온보딩",
    title: "전문 분야",
    summary: "분야별 숙련도를 1~5 척도로 선택합니다.",
    render: OnboardingSpecialty
  },
  {
    id: "03",
    phase: "온보딩",
    title: "성과 데이터",
    summary: "누적 회원, 재등록률, PT 지속 기간을 입력합니다.",
    render: OnboardingPerformance
  },
  {
    id: "04",
    phase: "케이스 테스트",
    title: "테스트 안내",
    summary: "소요시간, 답변 방식, 채점 영역, 인증 기준을 확인합니다.",
    render: CaseIntro
  },
  {
    id: "05",
    phase: "케이스 테스트",
    title: "테스트 응시",
    summary: "회원 케이스와 답변 영역, 제출 전 확인을 보여줍니다.",
    render: CaseSession
  },
  {
    id: "06A",
    phase: "채점 결과",
    title: "PASS 결과",
    summary: "80점 이상으로 인증 기준을 통과한 상태입니다.",
    render: ResultPass
  },
  {
    id: "06B",
    phase: "채점 결과",
    title: "FAIL 결과",
    summary: "80점 미만인 경우 보완 피드백과 재응시 안내를 보여줍니다.",
    render: ResultFail
  },
  {
    id: "07",
    phase: "인증",
    title: "인증 완료",
    summary: "인증 뱃지, 점수, 다음 행동을 정리합니다.",
    render: Certified
  },
  {
    id: "08",
    phase: "마이페이지",
    title: "프로필과 empty state",
    summary: "인증 상태, 테스트 이력, 인증 전 및 제안 0건 상태를 확인합니다.",
    render: MyPage
  },
  {
    id: "09",
    phase: "채용 제안",
    title: "제안 목록",
    summary: "센터명, 고용 형태, 급여 조건, 제안일, 상태를 카드로 보여줍니다.",
    render: OfferList
  },
  {
    id: "10",
    phase: "채용 제안",
    title: "제안 상세",
    summary: "제안 조건과 메시지를 확인하고 수락 또는 거절합니다.",
    render: OfferDetail
  },
  {
    id: "11",
    phase: "채용 확정",
    title: "담당자 연락처",
    summary: "수락 후 전화와 이메일 기반 연락 정보를 제공합니다.",
    render: Confirmed
  }
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const current = screens[activeIndex];
  const CurrentScreen = current.render;
  const progress = useMemo(() => ((activeIndex + 1) / screens.length) * 100, [activeIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeIndex]);

  useEffect(() => {
    if (current.id !== "05") {
      return undefined;
    }

    const warnBeforeLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeLeave);
    return () => window.removeEventListener("beforeunload", warnBeforeLeave);
  }, [current.id]);

  const goTo = (id: string) => {
    const nextIndex = screens.findIndex((screen) => screen.id === id);
    if (nextIndex >= 0) {
      setActiveIndex(nextIndex);
    }
  };

  const goPrev = () => setActiveIndex((index) => Math.max(0, index - 1));
  const goNext = () => setActiveIndex((index) => Math.min(screens.length - 1, index + 1));
  const actions: ScreenActions = { goTo, openModal: (kind) => setActiveModal(kind) };

  return (
    <main className="appShell">
      <nav className="topBar" aria-label="트레이너 플로우 리뷰 메뉴">
        <div className="brandMark">
          <span className="brandDot" />
          FitProof
        </div>
        <div className="topMeta">
          <span>트레이너 구직 플로우</span>
          <strong>{activeIndex + 1} / {screens.length}</strong>
        </div>
      </nav>

      <section className="flowShell">
        <aside className="pageRail" aria-label="페이지 목록">
          <div className="railHeader">
            <span>화면 흐름</span>
            <strong>PRD 5.1-5.11</strong>
          </div>
          <div className="railProgress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="pageList">
            {screens.map((screen, index) => (
              <button
                className={index === activeIndex ? "pageButton active" : "pageButton"}
                key={screen.id}
                aria-current={index === activeIndex ? "step" : undefined}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span>{screen.id}</span>
                <strong>{screen.title}</strong>
                <small>{screen.phase}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="screenStage" aria-live="polite">
          <header className="screenHeader">
            <div>
              <p>{current.phase}</p>
              <h1>{current.id}. {current.title}</h1>
              <span>{current.summary}</span>
            </div>
            <div className="screenCounter">
              <span>현재 페이지</span>
              <strong>{activeIndex + 1}</strong>
            </div>
          </header>

          <div className="screenCanvas">
            <CurrentScreen {...actions} />
          </div>

          <footer className="screenControls">
            <button className="secondaryButton" onClick={goPrev} disabled={activeIndex === 0} type="button">
              이전
            </button>
            <div>
              <span>{current.id}</span>
              <strong>{current.title}</strong>
            </div>
            <button className="primaryButton" onClick={goNext} disabled={activeIndex === screens.length - 1} type="button">
              다음
            </button>
          </footer>
        </section>
      </section>

      {activeModal ? (
        <div className="modalBackdrop" role="presentation" onClick={() => setActiveModal(null)}>
          <section
            aria-labelledby="flow-modal-title"
            aria-modal="true"
            className="modalPanel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            {activeModal === "submit" ? (
              <>
                <p>제출 확인</p>
                <h2 id="flow-modal-title">답변을 제출할까요?</h2>
                <span>제출 후에는 답변을 수정할 수 없습니다. 작성한 답변과 케이스 테스트 결과가 채점에 사용됩니다.</span>
                <div className="modalActions">
                  <button className="secondaryButton" onClick={() => setActiveModal(null)} type="button">다시 확인하기</button>
                  <button className="primaryButton" onClick={() => { setActiveModal(null); goTo("06A"); }} type="button">제출하고 채점 보기</button>
                </div>
              </>
            ) : (
              <>
                <p>제안 거절 확인</p>
                <h2 id="flow-modal-title">이 제안을 거절할까요?</h2>
                <span>거절하면 제안 상태가 거절로 변경됩니다. 이후 같은 조건의 제안은 센터에서 다시 보내야 확인할 수 있습니다.</span>
                <div className="modalActions">
                  <button className="secondaryButton" onClick={() => setActiveModal(null)} type="button">계속 검토하기</button>
                  <button className="dangerButton" onClick={() => setActiveModal(null)} type="button">거절 확정</button>
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}
    </main>
  );
}
