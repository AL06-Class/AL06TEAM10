import { Link } from "react-router-dom";
import type { Trainer } from "../data/trainers";
import Avatar from "./Avatar";

interface TrainerCardProps {
  trainer: Trainer;
  recommended: boolean;
}

export default function TrainerCard({ trainer, recommended }: TrainerCardProps) {
  return (
    <li>
      <Link
        to={`/trainers/${trainer.id}`}
        className="trainerListCard"
      >
        {recommended && (
          <span className="recommendBadge">
            추천
          </span>
        )}
        <div className="trainerCardHeader">
          <Avatar name={trainer.name} photoUrl={trainer.photoUrl} sizeClassName="h-16 w-16" />
          <div className="trainerCardIdentity">
            <h3>{trainer.name}</h3>
            <p>
              {trainer.region} · 경력 {trainer.careerYears}년
              {trainer.isCertified && (
                <span className="verifiedBadge">
                  인증 트레이너
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="trainerTags">
          {trainer.specialties.map((specialty) => (
            <span
              key={specialty}
              className="trainerTag"
            >
              {specialty}
            </span>
          ))}
        </div>

        <p className="recommendationReason">추천 이유: {trainer.recommendationReason}</p>
      </Link>
    </li>
  );
}
