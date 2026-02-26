import React, { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    joinDate: string;
}

interface UserAvatarProps {
    user: User;
    className?: string;
    dotClassName?: string;
    showDot?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
    user,
    className = "w-10 h-10",
    dotClassName = "w-3 h-3 border-2 border-bg-dark",
    showDot = false
}) => {
    const [imgError, setImgError] = useState(false);

    const getInitials = (name: string) => {
        return name.trim().charAt(0).toUpperCase();
    };

    const hasImage = user.avatar && !imgError;

    return (
        <div className={`relative flex-shrink-0 ${className}`}>
            <div className={`w-full h-full rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-white/5 transition-all duration-300`}>
                {hasImage ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span className="text-white/80 font-bold font-display pointer-events-none select-none" style={{ fontSize: 'inherit' }}>
                        {getInitials(user.name)}
                    </span>
                )}
            </div>

            {showDot && (
                <div className={`absolute bottom-0 right-0 bg-accent-purple rounded-full flex items-center justify-center ${dotClassName}`}>
                    {/* Internal icon or dot can go here if needed */}
                </div>
            )}
        </div>
    );
};
