import React, { useState } from 'react';

interface UserAvatarProps {
  src?: string | null;
  uid?: string;
  name?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, uid, name, className }) => {
  const [hasError, setHasError] = useState(false);
  
  // Primary source: Google/Firebase URL
  // Fallback source: DiceBear Avatar based on UID or Name
  const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid || name || 'guest'}`;
  const displaySrc = (hasError || !src) ? fallbackUrl : src;

  return (
    <img
      src={displaySrc}
      alt={name || 'User'}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

export default UserAvatar;