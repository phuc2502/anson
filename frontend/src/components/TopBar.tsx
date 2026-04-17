import React from 'react';
import {
    Search,
    Bell,
    Plus,
    Sparkles
} from 'lucide-react';

interface TopBarProps {
    title: string;
    onViewChange: (view: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, onViewChange }) => {
    return (
        <div className="h-16 bg-surface-container-lowest border-b border-outline-variant/10 flex items-center justify-between px-8 sticky top-0 z-40">
            <h2 className="text-lg font-bold text-on-surface tracking-tight">{title}</h2>

            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/10 rounded-xl text-xs outline-none focus:border-primary/50 transition-all w-48"
                    />
                </div>

                <button className="relative p-2 text-secondary hover:text-primary hover:bg-surface-container-low rounded-xl transition-colors">
                    <Bell size={18} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                </button>

                <button
                    onClick={() => onViewChange('workspace')}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-primary/20 hover:brightness-110 transition-all"
                >
                    <Sparkles size={14} />
                    Tạo với AI
                </button>
            </div>
        </div>
    );
};

export default TopBar;