import React from 'react';
import { AdminIcon } from './icons/AdminIcon';
import { UserIcon } from './icons/UserIcon';

interface HeaderProps {
    currentView: 'user' | 'admin';
    setView: (view: 'user' | 'admin') => void;
    onAdminClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, onAdminClick }) => {
    return (
        <header>
            <span onClick={onAdminClick} style={{ cursor: 'pointer' }}>
                <AdminIcon />
            </span>
            <span onClick={() => setView('user')} style={{ cursor: 'pointer' }}>
                <UserIcon />
            </span>
            <span>App Header</span>
        </header>
    );
};
