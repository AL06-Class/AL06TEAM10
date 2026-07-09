export default function App() {
  const statusText = "\uc2e4\ud589 \uc644\ub8cc";
  const titleText =
    "Docker \uae30\ubc18 React \uac1c\ubc1c \ud658\uacbd\uc774 \uc815\uc0c1\uc801\uc73c\ub85c \uc900\ube44\ub418\uc5c8\uc2b5\ub2c8\ub2e4.";
  const descriptionText =
    "Node 22 \ucee8\ud14c\uc774\ub108\uc5d0\uc11c Vite \uac1c\ubc1c \uc11c\ubc84\uac00 \uc2e4\ud589\ub420 \uc218 \uc788\ub294 \uc0c1\ud0dc\uc785\ub2c8\ub2e4. \uc774\uc81c \uc774 \ud654\uba74\uc744 \uae30\uc900\uc73c\ub85c \ud504\ub860\ud2b8\uc5d4\ub4dc \uc791\uc5c5\uc744 \uc2dc\uc791\ud558\uba74 \ub429\ub2c8\ub2e4.";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f6f7f9",
        color: "#17202a",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <section className="w-full max-w-[520px] rounded-lg border border-[#d9dee7] bg-white p-8 shadow-[0_10px_30px_rgba(23,32,42,0.08)]">
        <p className="mb-3 text-sm font-bold text-[#18794e]">{statusText}</p>
        <h1 className="mb-4 text-[28px] leading-tight">{titleText}</h1>
        <p className="m-0 text-base leading-[1.6] text-[#52606d]">{descriptionText}</p>
      </section>
    </main>
  );
}
