import React from 'react';
import {
    BarChart3,
    FileText,
    FileJson,
    ShieldCheck,
    ArrowRight,
    Database,
    Cloud,
    Wallet,
    MoreVertical,
    Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { Project, Template } from '../types';
import introVideo from '../img/intro25.mp4';

interface DashboardViewProps {
    projects: Project[];
    templates: Template[];
    testCases: any[];
    generatedDocs: any[];
    onViewChange: (view: string) => void;
}


const DashboardView: React.FC<DashboardViewProps> = ({ projects: realProjects, templates, testCases, generatedDocs, onViewChange }) => {
    const brdCount = generatedDocs.filter(doc => doc.type.includes('BRD')).length;
    const srsCount = generatedDocs.filter(doc => doc.type.includes('SRS') || doc.type.includes('SAD') || doc.type.includes('API')).length;
    const passCount = testCases.filter(tc => tc.status === 'Pass').length;
    const totalTestCases = testCases.length;

    const stats = [
        { label: 'BRD đã tạo', value: brdCount.toString(), change: brdCount > 0 ? '+1' : '0', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'SRS đã xuất bản', value: srsCount.toString(), change: srsCount > 0 ? '+1' : '0', icon: FileJson, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Test Pass', value: passCount.toString(), change: `${totalTestCases} tổng cộng`, icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-50' },
        { label: 'Dự án đang chạy', value: realProjects.length.toString(), change: 'Top 5%', icon: BarChart3, color: 'text-primary', bg: 'bg-primary/5' },
    ];

    const recentProjects = realProjects.slice(0, 3).map(p => {
        const projectDocs = generatedDocs.filter(doc => doc.projectId === Number(p.id));
        return {
            id: p.id,
            name: p.name,
            time: projectDocs.length > 0 ? 'Vừa cập nhật' : 'Gần đây',
            author: 'Hệ thống',
            docs: projectDocs.length > 0 ? projectDocs.map(d => d.type.split(' ')[0]).join(', ') : 'Chưa có',
            status: p.status === 'Đang hoạt động' ? 'Đã duyệt' : 'Nháp',
            icon: Database
        };
    });

    return (
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-full">
            {/* Hero Section */}
            <section className="w-full">
                <div className="relative overflow-hidden rounded-3xl bg-primary/30 p-10 text-white flex flex-col justify-between min-h-[300px] shadow-2xl shadow-primary/20 group">
                    {/* Background Video */}
                    <div className="absolute inset-0 pointer-events-none">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-110"
                        >
                            <source src={introVideo} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary/25 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6">
                            <Sparkles size={14} className="text-blue-200" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">AI-Powered SDLC</span>
                        </div>
                        <h2 className="text-4xl font-black mb-4 leading-tight tracking-tight">Kiến tạo sự <span className="text-blue-300">chuẩn xác</span> kỹ thuật.</h2>
                        <p className="text-blue-50/80 text-sm mb-8 leading-relaxed">Trải nghiệm tương lai của việc soạn thảo tài liệu SDLC. Sử dụng công cụ AI của chúng tôi để tạo BRD, SRS và Thiết kế kỹ thuật toàn diện chỉ trong vài phút.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => onViewChange('setup')}
                                className="bg-white text-primary px-8 py-3 rounded-xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Bắt đầu dự án mới
                            </button>
                            <button
                                onClick={() => onViewChange('templates')}
                                className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold text-sm backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                            >
                                Xem mẫu tài liệu
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/5"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2 ${stat.bg} rounded-lg ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.change.includes('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-extrabold text-on-surface">{stat.value}</p>
                            <p className="text-xs text-on-surface-variant font-medium">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </section>

            {/* Recent Projects */}
            <section className="space-y-4">
                <div className="flex justify-between items-end px-2">
                    <div>
                        <h3 className="text-lg font-bold text-on-surface">Dự án gần đây</h3>
                        <p className="text-xs text-on-surface-variant">Quản lý các đợt tài liệu mới nhất của bạn</p>
                    </div>
                    <button
                        onClick={() => onViewChange('projects')}
                        className="text-sm font-bold text-primary hover:underline"
                    >
                        Xem tất cả
                    </button>
                </div>
                <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10">
                    {recentProjects.map((project, i) => {
                        const Icon = project.icon;
                        return (
                            <div key={i} className="flex items-center justify-between p-4 bg-white hover:bg-blue-50/30 transition-colors group border-b border-outline-variant/5 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-on-surface">{project.name}</h4>
                                        <p className="text-[10px] text-on-surface-variant">Chỉnh sửa lần cuối {project.time} bởi {project.author}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="hidden md:flex flex-col items-end">
                                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tài liệu</p>
                                        <p className="text-xs font-semibold">{project.docs}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${project.status === 'Đã hoàn tất' ? 'bg-emerald-50 text-emerald-700' :
                                        project.status === 'Đã duyệt' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                        {project.status}
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-primary transition-all">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default DashboardView;