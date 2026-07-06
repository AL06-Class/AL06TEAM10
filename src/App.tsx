import "./App.css";

const specialtyRows = [
  { name: "재활", level: 5, label: "상", score: 92 },
  { name: "다이어트", level: 4, label: "중상", score: 84 },
  { name: "시니어", level: 3, label: "중", score: 68 },
  { name: "퍼포먼스", level: 2, label: "하", score: 42 }
];

const criteriaScores = [
  { name: "평가 능력", score: 80 },
  { name: "운동 처방", score: 88 },
  { name: "커뮤니케이션", score: 72 },
  { name: "안전 고려", score: 90 }
];

const offers = [
  {
    center: "강남 리포머 피트니스",
    type: "정직원",
    salary: "월 270만원",
    date: "2026.07.18",
    status: "검토 대기"
  },
  {
    center: "마포 바디밸런스 스튜디오",
    type: "프리랜서",
    salary: "세션당 협의",
    date: "2026.07.15",
    status: "신규 제안"
  }
];

function ProgressBar({ value }: { value: number }) {
  return (
    <span className="progressTrack" aria-label={`${value}점`}>
      <span className="progressFill" style={{ width: `${value}%` }} />
    </span>
  );
}

function StepPill({ index, label, active }: { index: string; label: string; active?: boolean }) {
  return (
    <span className={active ? "stepPill active" : "stepPill"}>
      <span>{index}</span>
      {label}
    </span>
  );
}

export default function App() {
  return (
    <main className="appShell">
      <nav className="topBar" aria-label="주요 메뉴">
        <div className="brandMark">
          <span className="brandDot" />
          FitProof
        </div>
        <div className="topLinks">
          <a href="#onboarding">온보딩</a>
          <a href="#case-test">검증 테스트</a>
          <a href="#offers">채용 제안</a>
          <a href="#profile">마이페이지</a>
        </div>
        <button className="secondaryButton">프로필 미리보기</button>
      </nav>

      <section className="heroGrid" aria-labelledby="page-title">
        <div className="heroCopy">
          <p className="eyebrow">Trainer verification workspace</p>
          <h1 id="page-title">실무 역량을 증명하고, 더 나은 조건의 제안을 받는 트레이너 플로우</h1>
          <p className="heroText">
            경력과 성과 데이터, 케이스 테스트 결과를 하나의 신뢰 프로필로 묶어 센터 대표가 바로 비교할 수 있게 보여줍니다.
          </p>
          <div className="heroActions">
            <button className="primaryButton">케이스 테스트 시작</button>
            <button className="plainButton">인증 전 프로필 보기</button>
          </div>
        </div>

        <aside className="profilePanel" id="profile" aria-label="트레이너 인증 프로필 요약">
          <div className="profileHeader">
            <img
              src="https://picsum.photos/seed/trainer-minseo/160/160"
              alt="인증 트레이너 프로필 사진"
              className="profileImage"
            />
            <div>
              <p className="profileName">한민서</p>
              <p className="mutedText">재활 · 다이어트 · 서울 강남</p>
            </div>
            <span className="verifiedBadge">인증 통과</span>
          </div>

          <div className="scoreBoard">
            <div>
              <span className="metricLabel">종합 점수</span>
              <strong>82</strong>
              <span className="mutedText">/ 100</span>
            </div>
            <div>
              <span className="metricLabel">재등록률</span>
              <strong>78%</strong>
            </div>
            <div>
              <span className="metricLabel">누적 회원</span>
              <strong>142명</strong>
            </div>
          </div>

          <div className="insightBox">
            <span className="smallLabel">AI 피드백 요약</span>
            <p>무릎 통증 회원에게 안전 우선 접근과 점진적 하체 강화 계획을 제시했습니다. 첫 상담의 심리적 장벽 완화 표현은 보완 여지가 있습니다.</p>
          </div>
        </aside>
      </section>

      <section className="flowLayout">
        <section className="workspaceCard onboardingCard" id="onboarding" aria-labelledby="onboarding-title">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Onboarding</p>
              <h2 id="onboarding-title">트레이너 기본 정보</h2>
            </div>
            <div className="stepRow" aria-label="온보딩 단계">
              <StepPill index="1" label="기본 정보" active />
              <StepPill index="2" label="전문 분야" />
              <StepPill index="3" label="성과 데이터" />
            </div>
          </div>

          <div className="formGrid">
            <label>
              이름
              <input value="한민서" readOnly />
              <span>센터에 공개되는 프로필 이름입니다.</span>
            </label>
            <label>
              활동 지역
              <input value="서울 강남 · 서초" readOnly />
              <span>제안 매칭의 주요 기준입니다.</span>
            </label>
            <label>
              경력
              <input value="3년 8개월" readOnly />
              <span>정규 근무와 프리랜서 경력을 함께 적습니다.</span>
            </label>
            <label>
              주요 자격증
              <input value="생활스포츠지도사 2급, NASM-CES" readOnly />
              <span>검증 프로필의 신뢰 정보를 구성합니다.</span>
            </label>
          </div>

          <div className="specialtyTable">
            {specialtyRows.map((item) => (
              <div className="specialtyRow" key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.label}</span>
                </div>
                <ProgressBar value={item.score} />
                <span className="levelText">{item.level} / 5</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="workspaceCard emptyStateCard" aria-label="인증 전 상태">
          <span className="smallLabel">Empty state</span>
          <h3>아직 인증 전인 트레이너에게는 이렇게 보여줍니다</h3>
          <p>케이스 테스트를 완료하면 인증 상태와 점수가 프로필에 표시됩니다. 인증 전에는 센터 노출이 제한된다는 점을 명확히 안내합니다.</p>
          <button className="primaryButton compact">케이스 테스트 응시하기</button>
        </aside>
      </section>

      <section className="caseGrid" id="case-test" aria-labelledby="case-title">
        <div className="casePanel">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Case test</p>
              <h2 id="case-title">무릎 통증 회원 케이스</h2>
            </div>
            <span className="timerBadge">남은 시간 18:42</span>
          </div>

          <div className="caseContent">
            <div className="memberCard">
              <span className="smallLabel">회원 정보</span>
              <dl>
                <div>
                  <dt>나이</dt>
                  <dd>45세 여성</dd>
                </div>
                <div>
                  <dt>체중</dt>
                  <dd>68kg</dd>
                </div>
                <div>
                  <dt>주호소</dt>
                  <dd>무릎 통증, 계단 불편</dd>
                </div>
                <div>
                  <dt>목표</dt>
                  <dd>하체 근력 강화</dd>
                </div>
              </dl>
            </div>

            <div className="answerStack">
              <label>
                Q1. 추가로 확인할 사항
                <textarea
                  readOnly
                  value="통증 발생 시점, 과거 병력, 통증 강도, 일상 동작 제한, 병원 진단 여부를 먼저 확인합니다."
                />
              </label>
              <label>
                Q2. 운동 처방 계획
                <textarea
                  readOnly
                  value="통증 없는 범위에서 고관절 힌지와 둔근 활성화를 먼저 확인하고, 박스 스쿼트와 낮은 스텝업으로 점진 부하를 설계합니다."
                />
              </label>
              <div className="warningLine">제출 전 확인 모달에서 수정 불가와 이탈 시 저장 제한을 다시 안내합니다.</div>
            </div>
          </div>
        </div>

        <aside className="resultPanel" aria-label="채점 결과">
          <p className="eyebrow">Result</p>
          <h2>82점, 인증 기준 통과</h2>
          <div className="criteriaList">
            {criteriaScores.map((item) => (
              <div className="criteriaItem" key={item.name}>
                <div>
                  <span>{item.name}</span>
                  <strong>{item.score}</strong>
                </div>
                <ProgressBar value={item.score} />
              </div>
            ))}
          </div>
          <div className="failNote">
            <strong>FAIL 상태 보정</strong>
            <p>80점 미만이면 재응시 가능 여부를 운영 정책에 따라 안내하고, 마이페이지로 돌아가는 선택지를 함께 제공합니다.</p>
          </div>
        </aside>
      </section>

      <section className="offersSection" id="offers" aria-labelledby="offers-title">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Hiring offers</p>
            <h2 id="offers-title">받은 채용 제안</h2>
          </div>
          <span className="verifiedBadge subtle">2건 대기 중</span>
        </div>

        <div className="offerGrid">
          {offers.map((offer) => (
            <article className="offerCard" key={offer.center}>
              <div>
                <span className="smallLabel">{offer.status}</span>
                <h3>{offer.center}</h3>
                <p>{offer.type} · {offer.salary} · 시작일 {offer.date}</p>
              </div>
              <div className="offerActions">
                <button className="primaryButton compact">수락하기</button>
                <button className="secondaryButton compact">거절하기</button>
              </div>
            </article>
          ))}
          <article className="offerCard contactCard">
            <span className="smallLabel">채용 확정 후</span>
            <h3>연락은 이메일과 전화로 안내합니다</h3>
            <p>1.0 범위에서는 실시간 메시징을 제외하고 담당자 이름, 전화번호, 이메일을 명확히 제공합니다.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
