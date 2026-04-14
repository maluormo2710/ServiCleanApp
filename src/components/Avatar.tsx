import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, className = "" }) => {
  const [error, setError] = React.useState(false);

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-surface-low rounded-full ${className}`}>
        <span className="font-manrope font-bold text-on-surface opacity-60">
          {getInitials(name)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`object-cover rounded-full ${className}`}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  );
};
