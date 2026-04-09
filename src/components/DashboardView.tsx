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
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-primary p-10 text-white flex flex-col justify-between min-h-[300px] shadow-2xl shadow-primary/20 group">
                    {/* Background Image with Gradient Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        <img
                            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1200"
                            alt="Blockchain Tech"
                            className="h-full w-full object-cover opacity-40 mix-blend-overlay transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
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

                <div className="bg-white rounded-3xl p-8 flex flex-col justify-between border border-slate-100 shadow-sm relative group">
                    <div className="absolute top-4 right-4 group-hover:rotate-12 transition-transform">
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
                            <ShieldCheck size={20} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Sức khỏe tài liệu</h3>
                            <div className="group/info relative">
                                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 cursor-help">?</div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50">
                                    Chỉ số đánh giá độ đầy đủ, tính nhất quán và tuân thủ tiêu chuẩn của các tài liệu đã được AI tạo ra.
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mb-8 font-medium">Dựa trên {generatedDocs.length} tài liệu đã tạo</p>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">Độ phủ yêu cầu</span>
                                    <span className="text-xs font-black text-primary">{generatedDocs.length > 0 ? '94%' : '0%'}</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: generatedDocs.length > 0 ? '94%' : '0%' }}
                                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">Tính nhất quán AI</span>
                                    <span className="text-xs font-black text-primary">{generatedDocs.length > 0 ? '88%' : '0%'}</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: generatedDocs.length > 0 ? '88%' : '0%' }}
                                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 mt-6 border-t border-slate-50">
                        <button className="text-xs font-black text-primary flex items-center gap-2 hover:translate-x-1 transition-transform uppercase tracking-wider">
                            Báo cáo chi tiết <ArrowRight size={14} />
                        </button>
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

            {/* Recent Projects & Activity */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
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
                </div>

                <div className="bg-surface-container-low rounded-xl p-6 h-fit border border-outline-variant/10">
                    <h3 className="text-sm font-bold text-on-surface mb-4">Hoạt động hệ thống</h3>
                    <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/30">
                        <div className="relative pl-8">
                            <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-low"></div>
                            <p className="text-xs font-bold text-on-surface">SRS đã được tạo</p>
                            <p className="text-[10px] text-on-surface-variant">Hệ thống tự động tạo SRS cho 'Fintech API'</p>
                            <p className="text-[10px] font-medium text-primary mt-1">12 phút trước</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-surface-container-low"></div>
                            <p className="text-xs font-bold text-on-surface">Người thẩm định mới tham gia</p>
                            <p className="text-[10px] text-on-surface-variant">David Smith đã được thêm vào nhóm 'Cloud Migration'</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1">1 giờ trước</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-low"></div>
                            <p className="text-xs font-bold text-on-surface">Tài liệu đã xuất</p>
                            <p className="text-[10px] text-on-surface-variant">BRD V2.1 đã xuất sang PDF và Jira</p>
                            <p className="text-[10px] font-medium text-primary mt-1">3 giờ trước</p>
                        </div>
                    </div>
                    <button className="w-full mt-6 py-2 bg-surface-container-highest rounded-lg text-xs font-bold text-primary-container hover:bg-primary-container hover:text-white transition-all">
                        Xem nhật ký kiểm tra
                    </button>
                </div>
            </section>
        </div>
    );
};

export default DashboardView;