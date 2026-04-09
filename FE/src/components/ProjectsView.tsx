import React, { useState } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    ExternalLink,
    Calendar,
    Globe,
    Trash2,
    Edit2,
    X,
    Folder
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';

interface ProjectsViewProps {
    projects: Project[];
    onAddProject: (project: Project) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (id: string | number) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({
    projects,
    onAddProject,
    onUpdateProject,
    onDeleteProject
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        domain: ''
    });

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenAddModal = () => {
        setFormData({ name: '', description: '', domain: '' });
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (project: Project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            domain: project.domain
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        if (editingProject) {
            onUpdateProject({
                ...editingProject,
                name: formData.name,
                description: formData.description,
                domain: formData.domain
            });
        } else {
            onAddProject({
                id: Date.now(),
                name: formData.name,
                description: formData.description,
                domain: formData.domain,
                status: 'Đang hoạt động',
                createdAt: new Date().toLocaleDateString('vi-VN')
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Dự án của tôi</h1>
                    <p className="text-on-surface-variant max-w-lg">Quản lý các dự án phần mềm và cấu hình AI cho từng môi trường.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                    <Plus size={20} />
                    <span>Thêm dự án mới</span>
                </button>
            </div>

            <div className="relative max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm dự án..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                    <Folder size={24} />
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleOpenEditModal(project)}
                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteProject(project.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{project.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">{project.description}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-50 space-y-3">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Globe size={14} className="text-primary" />
                                    <span className="font-medium truncate">{project.domain}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar size={14} />
                                    <span>Ngày tạo: {project.createdAt}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-full border border-emerald-100">
                                    {project.status}
                                </span>
                                <button
                                    onClick={() => setSelectedProject(project)}
                                    className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                                >
                                    <span>Chi tiết</span>
                                    <ExternalLink size={12} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-on-surface">
                                    {editingProject ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Tên dự án</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-outline-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Ví dụ: Hệ thống ERP v4"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Mô tả dự án</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-outline-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                        placeholder="Mô tả ngắn gọn về mục tiêu dự án..."
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Domain / URL</label>
                                    <input
                                        type="text"
                                        value={formData.domain}
                                        onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-outline-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Ví dụ: erp.company.com"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                                    >
                                        {editingProject ? 'Lưu thay đổi' : 'Tạo dự án'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="bg-primary p-8 text-white relative">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                                    <Folder size={32} />
                                </div>
                                <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                                <p className="text-white/70 text-sm mt-1">Thông tin chi tiết dự án</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span className="text-sm font-bold text-slate-900">{selectedProject.status}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày khởi tạo</span>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="text-sm font-bold text-slate-900">{selectedProject.createdAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mô tả dự án</span>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-sm text-slate-600 leading-relaxed">{selectedProject.description || 'Không có mô tả cho dự án này.'}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông tin kỹ thuật</span>
                                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                            <Globe size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Domain / URL</p>
                                            <p className="text-sm font-bold text-primary">{selectedProject.domain || 'Chưa cấu hình domain'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => {
                                            handleOpenEditModal(selectedProject);
                                            setSelectedProject(null);
                                        }}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Edit2 size={18} />
                                        <span>Chỉnh sửa</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectsView;