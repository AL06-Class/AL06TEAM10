import { useState } from "react";

interface HireProposalButtonProps {
  trainerId: string;
}

export default function HireProposalButton({ trainerId }: HireProposalButtonProps) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <span className="block w-full rounded bg-[#f5f5f7] px-4 py-2 text-center text-sm font-semibold text-[#18794e]">
        ✓ 채용 제안을 보냈습니다
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        console.log(`[mock] 채용 제안 발송: trainerId=${trainerId}`);
        setSent(true);
      }}
      className="block w-full rounded bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
    >
      채용 제안 보내기
    </button>
  );
}
