import React from 'react';
import {
    LayoutDashboard,
    FolderOpen,
    BrainCircuit,
    FileText,
    ShieldCheck,
    Settings,
    Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import logo from '../img/logo.png';

interface SidebarProps {
    activeView: string;
    onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
    const navItems = [
        { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
        { id: 'projects', label: 'Dự án', icon: FolderOpen },
        { id: 'workspace', label: 'Không gian làm việc AI', icon: BrainCircuit },
        { id: 'templates', label: 'Mẫu tài liệu', icon: FileText },
        { id: 'testing', label: 'Kiểm thử', icon: ShieldCheck },
        { id: 'settings', label: 'Cài đặt', icon: Settings },
    ];

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col p-4 space-y-2 z-50 shadow-sm">
            <div className="mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20">
                        <img src={logo} alt="ANSO Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-on-surface leading-tight">ANSO</h1>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">v2.4 Precision</p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onViewChange('setup')}
                className="w-full py-3 px-4 mb-6 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 hover:brightness-110"
            >
                <Plus size={18} />
                Tài liệu mới
            </button>

            <nav className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all rounded-lg group ${isActive
                                    ? 'text-primary bg-surface-container-low shadow-sm translate-x-1'
                                    : 'text-secondary hover:bg-surface-container-lowest'
                                }`}
                        >
                            <Icon size={18} className={isActive ? 'fill-primary/10' : ''} />
                            <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-3 px-3 py-2">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuACYiqe1GbhTVWgavEtvAs0wpSjd3Gjkq_RW26oiJCIh5DnMxIEVgQU-Z4kaVHu1DSQIsRmz7-0lCUt5tMqbUfG4RTouh1JLWiRYog2liAMIWnWpAXGuRZPn1-orwpprkrhsR-4EgjI7E7FJv0DQT8ATXbBgXtDySB-mx8LKwg4FSWIsKWkcpqtthsmgenNZAjzd8fkxp80W264PqVsB7pfXJS8hNJfi8aDabrCLTQA4PQGYinq6sJizb6M2Q4GA_HQNLsXCzzTMA"
                        alt="Alex Chen"
                        className="w-8 h-8 rounded-full border border-primary/10 object-cover"
                        referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-on-surface truncate">Alex Chen</p>
                        <p className="text-[10px] text-secondary truncate">Sr. Architect</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;