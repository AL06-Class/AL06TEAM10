import { Link } from "react-router-dom";
import type { Trainer } from "../data/trainers";

interface TrainerCardProps {
  trainer: Trainer;
  recommended: boolean;
}

export default function TrainerCard({ trainer, recommended }: TrainerCardProps) {
  return (
    <li>
      <Link
        to={`/trainers/${trainer.id}`}
        className="relative block rounded-lg border border-[#d9dee7] bg-white p-5 shadow-[0_4px_16px_rgba(23,32,42,0.06)] transition hover:border-primary hover:shadow-[0_6px_20px_rgba(0,102,204,0.15)]"
      >
        {recommended && (
          <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
            추천
          </span>
        )}
        <div className="flex items-start gap-4">
          <img
            src={trainer.photoUrl}
            alt={`${trainer.name} 프로필 사진`}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-ink">{trainer.name}</h3>
            <p className="text-sm text-[#52606d]">
              {trainer.region} · 경력 {trainer.careerYears}년
              {trainer.isCertified && (
                <span className="ml-2 rounded bg-[#f5f5f7] px-2 py-0.5 text-xs font-semibold text-primary">
                  인증 트레이너
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {trainer.specialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full border border-[#d9dee7] px-3 py-1 text-xs text-[#52606d]"
            >
              {specialty}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs text-[#52606d]">추천 이유: {trainer.recommendationReason}</p>
      </Link>
    </li>
  );
}
