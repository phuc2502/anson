import React, { useState } from 'react';
import {
    Fingerprint,
    Database,
    Network,
    Users,
    Sparkles,
    CheckCircle2,
    Plus,
    ChevronRight,
    ShieldCheck,
    Cpu,
    Zap,
    Settings2,
    FileText
} from 'lucide-react';
import { motion } from 'motion/react';

import { Project } from '../types';

interface ProjectSetupViewProps {
    onAddProject: (project: Project) => void;
    onViewChange: (view: string) => void;
}

const ProjectSetupView: React.FC<ProjectSetupViewProps> = ({ onAddProject, onViewChange }) => {
    const [projectName, setProjectName] = useState('ANSO 2.0');
    const [projectDescription, setProjectDescription] = useState('Mô tả dự án mới...');
    const [selectedPhase, setSelectedPhase] = useState('Giai đoạn 1');
    const [selectedIndustry, setSelectedIndustry] = useState('Fintech');
    const [selectedModel, setSelectedModel] = useState('Llama 3.1 (8B)');
    const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
    const [temperature, setTemperature] = useState(0.7);

    const handleCreateProject = () => {
        const newProject: Project = {
            id: Date.now(),
            name: projectName,
            description: projectDescription,
            domain: `${projectName.toLowerCase().replace(/\s+/g, '-')}.local`,
            status: 'Đang hoạt động',
            createdAt: new Date().toLocaleDateString('vi-VN')
        };
        onAddProject(newProject);
        onViewChange('projects');
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-6">
            {/* Top Header Bar */}
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Cài đặt <span className="text-primary">Dự án</span></h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">Cấu hình hệ sinh thái SDLC thông minh cho {projectName}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-slate-100"></div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-emerald-600">Sẵn sàng khởi tạo</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Độ hoàn thiện</span>
                            <span className="text-xs font-bold text-primary">85%</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => onViewChange('dashboard')}
                        className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleCreateProject}
                        className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Sparkles size={16} />
                        Lưu & Khởi tạo
                    </button>
                </div>
            </div>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-12 gap-6">

                {/* 1. Identity & Core Info - Span 4 */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                            <Fingerprint size={24} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Thông tin cốt lõi</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tên dự án</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:border-primary focus:bg-white transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mô tả dự án</label>
                            <textarea
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:border-primary focus:bg-white transition-all outline-none resize-none"
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Giai đoạn</label>
                            <div className="relative">
                                <select
                                    value={selectedPhase}
                                    onChange={(e) => setSelectedPhase(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:border-primary focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option>Giai đoạn 1</option>
                                    <option>Giai đoạn 2</option>
                                    <option>Giai đoạn 3</option>
                                    <option>Go Live</option>
                                </select>
                                <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lĩnh vực</label>
                            <input
                                type="text"
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:border-primary focus:bg-white transition-all outline-none"
                                placeholder="Ví dụ: Fintech, Thương mại điện tử..."
                            />
                        </div>
                    </div>
                </motion.section>

                {/* 2. AI Orchestration - Span 4 - Dark Accent */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-12 lg:col-span-4 bg-[#0B1221] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full -mr-24 -mt-24"></div>
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/5 rounded-xl text-primary">
                                    <Network size={24} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest">Điều phối AI</h3>
                            </div>
                            <Settings2 size={20} className="text-white/20 hover:text-primary transition-colors cursor-pointer" />
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="space-y-2.5">
                                <label className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">Ollama Server URL</label>
                                <input
                                    type="text"
                                    value={ollamaUrl}
                                    onChange={(e) => setOllamaUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-primary focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">Mô hình cục bộ</label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {['Llama 3.1 (8B)', 'Mistral (7B)', 'Gemma 2 (9B)', 'Phi-3 (Mini)'].map(model => (
                                        <button
                                            key={model}
                                            onClick={() => setSelectedModel(model)}
                                            className={`py-3 px-4 rounded-xl text-[10px] font-bold transition-all border ${selectedModel === model ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10'}`}
                                        >
                                            {model}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Cpu size={16} className="text-primary" />
                                        <span className="text-[11px] font-bold">Ollama Engine Status</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '92%' }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <label className="text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">Temperature</label>
                                    <span className="text-[11px] font-bold text-primary">{temperature}</span>
                                </div>
                                <input
                                    type="range" min="0" max="1" step="0.1" value={temperature}
                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* 3. RAG Knowledge - Span 4 */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                <Database size={24} />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tri thức RAG</h3>
                        </div>
                        <button className="p-2 bg-slate-50 text-slate-400 hover:text-primary rounded-xl transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-4 flex-1">
                        {[
                            { name: 'Tiêu chuẩn BRD', type: 'PDF', size: '2.4MB' },
                            { name: 'Biểu mẫu SRS', type: 'DOCX', size: '1.1MB' },
                            { name: 'QA Framework', type: 'JSON', size: '450KB' },
                        ].map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-primary/20 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">{doc.type} • {doc.size}</p>
                                    </div>
                                </div>
                                <CheckCircle2 size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default ProjectSetupView;