import { useState } from "react";

interface AvatarProps {
  name: string;
  photoUrl: string;
  sizeClassName: string;
}

// 사진이 없거나(빈 문자열) 로드에 실패하면(onError) 구글식 원형 이니셜 아바타로 전환.
export default function Avatar({ name, photoUrl, sizeClassName }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showInitial = !photoUrl || imageFailed;

  if (showInitial) {
    return (
      <div
        role="img"
        aria-label={`${name} 프로필 이니셜`}
        className={`${sizeClassName} flex shrink-0 items-center justify-center rounded-full bg-[#eaf2fc] text-lg font-semibold text-primary`}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={`${name} 프로필 사진`}
      className={`${sizeClassName} shrink-0 rounded-full object-cover`}
      onError={() => setImageFailed(true)}
    />
  );
}
