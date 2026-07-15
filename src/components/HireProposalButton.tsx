import { Link } from "react-router-dom";

interface HireProposalButtonProps {
  trainerId: string;
}

export default function HireProposalButton({ trainerId }: HireProposalButtonProps) {
  return (
    <Link
      className="primaryButton"
      to={{
        pathname: "/owner/offer/new",
        search: `?trainerId=${encodeURIComponent(trainerId)}`
      }}
    >
      채용 제안 보내기
    </Link>
  );
}
