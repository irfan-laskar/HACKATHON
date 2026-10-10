import React from 'react';

interface YoutubeIconProps {
  className?: string;
  size?: number;
}

export const YoutubeIcon: React.FC<YoutubeIconProps> = ({ className = 'w-5 h-5', size = 20 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21.582 6.186a2.756 2.756 0 0 0-1.94-1.954C17.93 3.75 12 3.75 12 3.75s-5.93 0-7.642.482a2.756 2.756 0 0 0-1.94 1.954C2 7.91 2 12 2 12s0 4.09.418 5.814a2.756 2.756 0 0 0 1.94 1.954C6.07 20.25 12 20.25 12 20.25s5.93 0 7.642-.482a2.756 2.756 0 0 0 1.94-1.954C22 16.09 22 12 22 12s0-4.09-.418-5.814Z"
        fill="#FF0000"
      />
      <polygon points="9.75,15.5 15.5,12 9.75,8.5" fill="#FFFFFF" />
    </svg>
  );
};
