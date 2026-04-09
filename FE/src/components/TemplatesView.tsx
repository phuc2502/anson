import React, { useState } from 'react';
import {
    FileText,
    PencilRuler,
    ClipboardCheck,
    Terminal,
    FileCheck,
    Plus,
    Upload,
    ArrowRight,
    X,
    Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Template } from '../types';

interface TemplatesViewProps {
    templates: Template[];
    onAddTemplate: (template: Template) => void;
    onUpdateTemplate: (template: Template) => void;
    onDeleteTemplate: (id: string | number) => void;
}

const iconMap: { [key: string]: any } = {
    FileText,
    PencilRuler,
    ClipboardCheck,
    Terminal,
    FileCheck,
};

const TemplatesView: React.FC<TemplatesViewProps> = ({
    templates,
    onAddTemplate,
    onUpdateTemplate,
    onDeleteTemplate
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [newTemplate, setNewTemplate] = useState({
        title: '',
        desc: '',
        iconName: 'FileText',
        file: null as File | null
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const editFileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAddTemplate = () => {
        if (!newTemplate.title) return;

        const template: Template = {
            id: Date.now(),
            title: newTemplate.title,
            desc: newTemplate.desc || 'Mô tả mẫu tài liệu mới.',
            version: 'v1.0.0',
            time: 'Vừa xong',
            status: 'Đang hoạt động',
            color: 'from-primary to-blue-300',
            iconName: newTemplate.iconName
        };

        onAddTemplate(template);
        setIsModalOpen(false);
        setNewTemplate({ title: '', desc: '', iconName: 'FileText', file: null });
    };

    const handleUpdateTemplate = () => {
        if (!editingTemplate || !editingTemplate.title) return;
        onUpdateTemplate(editingTemplate);
        setEditingTemplate(null);
    };

    const handleDeleteTemplate = (id: string | number) => {
        onDeleteTemplate(id);
        setEditingTemplate(null);
    };

    return (
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Quản lý mẫu tài liệu</h1>
                    <p className="text-on-surface-variant max-w-lg">Quản lý, cập nhật và triển khai các cấu trúc tài liệu SDLC tiêu chuẩn cho công cụ tạo nội dung AI.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/20 transition-colors"
                    >
                        <Plus size={18} />
                        <span>Tạo mẫu mới</span>
                    </button>
                    <button className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all">
                        <Upload size={18} />
                        <span>Tải lên mẫu mới</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, i) => {
                    const Icon = iconMap[template.iconName] || FileText;
                    return (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-6 rounded-xl group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-64 border border-outline-variant/20"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${template.color}`}></div>
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <Icon size={24} />
                                    </div>
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${template.status === 'Đang hoạt động' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                                        }`}>
                                        {template.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{template.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{template.desc}</p>
                            </div>
                            <div className="mt-auto">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded border border-slate-200">{template.version}</span>
                                    <span className="text-[10px] text-slate-300">•</span>
                                    <span className="text-[10px] text-slate-400">Cập nhật {template.time}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-400 font-medium italic">Hệ thống quản lý mẫu</span>
                                    </div>
                                    <button
                                        onClick={() => setEditingTemplate(template)}
                                        className="text-primary hover:text-primary-dark text-xs font-bold flex items-center gap-1 group/btn transition-all"
                                    >
                                        <span>Chỉnh sửa</span>
                                        <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
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
                                <h2 className="text-xl font-bold text-on-surface">Thêm mẫu tài liệu mới</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Tên mẫu tài liệu</label>
                                    <input
                                        type="text"
                                        value={newTemplate.title}
                                        onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-outline-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Ví dụ: Tài liệu Đặc tả Yêu cầu (SRS)"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Mô tả ngắn</label>
                                    <textarea
                                        value={newTemplate.desc}
                                        onChange={(e) => setNewTemplate(prev => ({ ...prev, desc: e.target.value }))}
                                        className="w-full px-4 py-2 bg-slate-50 border border-outline-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                        placeholder="Mô tả mục đích của mẫu tài liệu này..."
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Tải lên tệp mẫu (.docx, .xlsx)</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full p-4 border-2 border-dashed border-outline-variant/20 rounded-xl bg-slate-50 hover:bg-white hover:border-primary/50 transition-all cursor-pointer group flex flex-col items-center justify-center gap-2"
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={(e) => setNewTemplate(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                                            className="hidden"
                                            accept=".doc,.docx,.xlsx"
                                        />
                                        {newTemplate.file ? (
                                            <div className="flex items-center gap-2 text-primary font-medium">
                                                <FileText size={20} />
                                                <span className="text-sm truncate max-w-[200px]">{newTemplate.file.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
                                                <span className="text-xs text-slate-500 font-medium">Chọn tệp hoặc kéo thả vào đây</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Biểu tượng</label>
                                    <div className="flex gap-3">
                                        {Object.keys(iconMap).map(iconName => {
                                            const Icon = iconMap[iconName];
                                            return (
                                                <button
                                                    key={iconName}
                                                    onClick={() => setNewTemplate(prev => ({ ...prev, iconName }))}
                                                    className={`p-3 rounded-xl border transition-all ${newTemplate.iconName === iconName
                                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                            : 'bg-slate-50 text-slate-400 border-outline-variant/10 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <Icon size={20} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAddTemplate}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                                >
                                    Thêm mẫu
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {editingTemplate && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingTemplate(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-on-surface">Chỉnh sửa mẫu tài liệu</h2>
                                <button onClick={() => setEditingTemplate(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Tên mẫu tài liệu</label>
                                    <input
                                        type="text"
                                        value={editingTemplate.title}
                                        onChange={(e) => setEditingTemplate(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-outline-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Mô tả ngắn</label>
                                    <textarea
                                        value={editingTemplate.desc}
                                        onChange={(e) => setEditingTemplate(prev => prev ? ({ ...prev, desc: e.target.value }) : null)}
                                        className="w-full px-4 py-2 bg-slate-50 border border-outline-variant/20 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Thay đổi tệp mẫu (.docx, .xlsx)</label>
                                    <div
                                        onClick={() => editFileInputRef.current?.click()}
                                        className="w-full p-4 border-2 border-dashed border-outline-variant/20 rounded-xl bg-slate-50 hover:bg-white hover:border-primary/50 transition-all cursor-pointer group flex flex-col items-center justify-center gap-2"
                                    >
                                        <input
                                            type="file"
                                            ref={editFileInputRef}
                                            className="hidden"
                                            accept=".doc,.docx,.xlsx"
                                        />
                                        <div className="flex flex-col items-center gap-1">
                                            <Upload size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                                            <span className="text-[10px] text-slate-500 font-medium">Nhấp để thay thế tệp hiện tại</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Biểu tượng</label>
                                    <div className="flex gap-3">
                                        {Object.keys(iconMap).map(iconName => {
                                            const Icon = iconMap[iconName];
                                            return (
                                                <button
                                                    key={iconName}
                                                    onClick={() => setEditingTemplate(prev => prev ? ({ ...prev, iconName }) : null)}
                                                    className={`p-3 rounded-xl border transition-all ${editingTemplate.iconName === iconName
                                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                            : 'bg-slate-50 text-slate-400 border-outline-variant/10 hover:bg-slate-100'
                                                        }`}
                                                >
                                                    <Icon size={20} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingTemplate(null)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleUpdateTemplate}
                                        className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                                    >
                                        Lưu thay đổi
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDeleteTemplate(editingTemplate.id)}
                                    className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    <span>Xóa mẫu tài liệu</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TemplatesView;
