import React from 'react';
import {
    BrainCircuit,
    FileText,
    ChevronDown,
    Download,
    CheckCircle2,
    MessageSquare,
    User,
    Paperclip,
    Image as ImageIcon,
    Send,
    ZoomIn,
    Printer,
    Sparkles,
    FolderOpen,
    X,
    File,
    Loader2,
    Trash2,
    Reply,
    CornerUpLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Template, Project } from '../types';

interface AIWorkspaceViewProps {
    templates: Template[];
    projects: Project[];
    onDocumentGenerated?: (doc: { type: string, projectId: number, createdAt: string }) => void;
}

const AIWorkspaceView: React.FC<AIWorkspaceViewProps> = ({ templates, projects, onDocumentGenerated }) => {
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const [isDocDropdownOpen, setIsDocDropdownOpen] = React.useState(false);
    const [isProjectDropdownOpen, setIsProjectDropdownOpen] = React.useState(false);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = React.useState(false);
    const [selectedDocType, setSelectedDocType] = React.useState(templates[0]?.title || 'Tài liệu Yêu cầu Nghiệp vụ (BRD)');
    const [selectedProjectName, setSelectedProjectName] = React.useState(projects[0]?.name || 'CloudScale ERP v4');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [showPreview, setShowPreview] = React.useState(false);
    const [selectionRange, setSelectionRange] = React.useState<{ top: number, left: number, text: string } | null>(null);
    const [chatSelectionRange, setChatSelectionRange] = React.useState<{ top: number, left: number, text: string } | null>(null);
    const [comments, setComments] = React.useState<{ id: number, text: string, quote: string, top: number }[]>([]);
    const [activeCommentInput, setActiveCommentInput] = React.useState<{ top: number, quote: string } | null>(null);
    const [newCommentText, setNewCommentText] = React.useState('');
    const [replyingTo, setReplyingTo] = React.useState<string | null>(null);

    const previewRef = React.useRef<HTMLDivElement>(null);
    const chatRef = React.useRef<HTMLDivElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const folderInputRef = React.useRef<HTMLInputElement>(null);

    const handleStartGeneration = () => {
        setIsGenerating(true);
        // Mock generation process
        setTimeout(() => {
            setIsGenerating(false);
            setShowPreview(true);

            // Record the generation
            const project = projects.find(p => p.name === selectedProjectName);
            if (onDocumentGenerated && project) {
                onDocumentGenerated({
                    type: selectedDocType,
                    projectId: Number(project.id),
                    createdAt: new Date().toISOString()
                });
            }
        }, 2500);
    };

    const docTypes = templates.map(t => ({ id: String(t.id), name: t.title }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setUploadedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = previewRef.current?.getBoundingClientRect();

            if (containerRect) {
                setSelectionRange({
                    top: rect.top - containerRect.top - 40,
                    left: rect.left - containerRect.left + (rect.width / 2),
                    text: selection.toString()
                });
            }
        } else {
            setSelectionRange(null);
        }
    };

    const handleChatSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = chatRef.current?.getBoundingClientRect();

            if (containerRect) {
                setChatSelectionRange({
                    top: rect.top - containerRect.top - 40,
                    left: rect.left - containerRect.left + (rect.width / 2),
                    text: selection.toString()
                });
            }
        } else {
            setChatSelectionRange(null);
        }
    };

    const handleAddComment = () => {
        if (!activeCommentInput || !newCommentText.trim()) return;

        const newComment = {
            id: Date.now(),
            text: newCommentText,
            quote: activeCommentInput.quote,
            top: activeCommentInput.top
        };

        setComments(prev => [...prev, newComment]);
        setActiveCommentInput(null);
        setNewCommentText('');
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-surface">
            {/* Hidden Inputs */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                multiple
            />
            <input
                type="file"
                ref={folderInputRef}
                className="hidden"
                onChange={handleFileChange}
                // @ts-ignore
                webkitdirectory=""
                directory=""
                multiple
            />
            {/* Header/Tools Area */}
            <div className="h-14 bg-white flex items-center justify-between px-6 border-b border-outline-variant/10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)}
                            className="bg-surface-container-lowest px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm border border-outline-variant/5 hover:bg-surface-container-low transition-colors min-w-[280px] justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <FileText size={18} className="text-primary" />
                                <span className="truncate">{selectedDocType}</span>
                            </div>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${isDocDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDocDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDocDropdownOpen(false)}></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-20 overflow-hidden"
                                    >
                                        {docTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => {
                                                    setSelectedDocType(type.name);
                                                    setIsDocDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 ${selectedDocType === type.name
                                                        ? 'bg-primary/5 text-primary font-bold'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${selectedDocType === type.name ? 'bg-primary' : 'bg-transparent'}`}></div>
                                                {type.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <span className="h-4 w-[1px] bg-outline-variant/30"></span>
                    <div className="flex items-center gap-2 relative">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dự án mục tiêu:</span>
                        <button
                            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                            className="text-sm font-semibold text-on-surface flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            <span className="truncate max-w-[150px]">{selectedProjectName}</span>
                            <ChevronDown size={14} className={`transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isProjectDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProjectDropdownOpen(false)}></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-20 overflow-hidden"
                                    >
                                        {projects.map((project) => (
                                            <button
                                                key={project.id}
                                                onClick={() => {
                                                    setSelectedProjectName(project.name);
                                                    setIsProjectDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-xs transition-colors ${selectedProjectName === project.name
                                                        ? 'bg-primary/5 text-primary font-bold'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {project.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                            className="px-4 py-1.5 bg-surface-container-highest text-on-secondary-container rounded-lg text-sm font-medium hover:brightness-95 transition-all flex items-center gap-2"
                        >
                            <Download size={16} />
                            Xuất file
                        </button>

                        <AnimatePresence>
                            {isExportDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsExportDropdownOpen(false)}></div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-outline-variant/10 py-2 z-20 overflow-hidden"
                                    >
                                        <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                            <FileText size={14} className="text-red-500" />
                                            Xuất sang PDF (.pdf)
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                            <File size={14} className="text-blue-500" />
                                            Xuất sang Word (.docx)
                                        </button>
                                        <div className="h-px bg-outline-variant/10 my-1"></div>
                                        <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                            <Send size={14} className="text-primary" />
                                            Đẩy sang Jira Software
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                            Lưu vào Confluence
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={handleStartGeneration}
                        disabled={isGenerating}
                        className="px-4 py-1.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-lg text-sm font-medium shadow-md shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Đang tạo tài liệu...
                            </>
                        ) : (
                            'Hoàn thiện bản thảo'
                        )}
                    </button>
                </div>
            </div>

            {/* Split View Area */}
            <div className="flex-1 flex overflow-hidden p-6 gap-6 justify-center">
                {/* Left: AI Chat Interface */}
                <motion.section
                    layout
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}
                    className={`${showPreview ? 'flex-1' : 'w-full max-w-4xl'} flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10`}
                >
                    <div className="p-4 bg-surface-container-low flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={18} className="text-primary" />
                            <h2 className="font-semibold text-sm">Ngữ cảnh & Yêu cầu</h2>
                        </div>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">GPT-4 PRO</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 relative" ref={chatRef} onMouseUp={handleChatSelection}>
                        {/* Chat Selection Reply Button */}
                        <AnimatePresence>
                            {chatSelectionRange && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                    style={{ top: chatSelectionRange.top, left: chatSelectionRange.left }}
                                    onClick={() => {
                                        setReplyingTo(chatSelectionRange.text);
                                        setChatSelectionRange(null);
                                    }}
                                    className="absolute z-50 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xl -translate-x-1/2 hover:brightness-110 transition-all"
                                >
                                    <Reply size={12} />
                                    <span>Trích dẫn</span>
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Bot Message */}
                        <div className="flex gap-3 max-w-[90%] group relative">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <BrainCircuit size={18} className="text-white" />
                            </div>
                            <div className="p-3 bg-surface-container-low rounded-xl rounded-tl-none relative">
                                <p className="text-sm text-on-surface-variant leading-relaxed">
                                    Xin chào! Tôi đã sẵn sàng giúp bạn soạn thảo <strong>Tài liệu Yêu cầu Nghiệp vụ</strong>. Vui lòng tải lên bất kỳ ảnh chụp màn hình UI, sơ đồ quy trình nào hoặc nhập trực tiếp các mục tiêu chính cho tính năng mới.
                                </p>
                                <button
                                    onClick={() => setReplyingTo("Xin chào! Tôi đã sẵn sàng giúp bạn soạn thảo Tài liệu Yêu cầu Nghiệp vụ...")}
                                    className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-primary"
                                    title="Trả lời"
                                >
                                    <CornerUpLeft size={16} />
                                </button>
                            </div>
                        </div>

                        {/* User Message */}
                        <div className="flex flex-row-reverse gap-3 max-w-[90%] ml-auto">
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                                <User size={18} className="text-primary" />
                            </div>
                            <div className="space-y-2">
                                <div className="p-3 bg-primary text-white rounded-xl rounded-tr-none">
                                    <p className="text-sm leading-relaxed">Đây là wireframe cho mô-đun kho hàng mới. Chúng ta cần tập trung vào cảnh báo tồn kho theo thời gian thực và hỗ trợ đa kho.</p>
                                </div>
                                <div className="w-48 aspect-video rounded-lg overflow-hidden border border-primary/20 shadow-sm">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjiXehoI-xDEPc51QfM09bBqNMbYF1wNZTs4CaQdktLEbs9RGXL3dDTlnINlGyN3OnSUzliS9vnV7WixPTHxqcXxs2kf8ueWhPMoUMJQTEq0r1dBmSLLSVCb_aolbOBdiglRnZPkfLCFCJSyTVKsUbhE4LWnke-hE_NFLdaxwxcpf7-GdJnwBgmkv_Qso88Rspoe7v5jg5Jc1Lvtk0aSt3K-klwJH5qAXm1WYJ_6bTx6W7PNhKtHcHWboSrMOVNFHtOSrfc8Pdvw"
                                        alt="Wireframe upload"
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bot Thinking / Active Message */}
                        <div className="flex gap-3 group relative">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <BrainCircuit size={18} className="text-white" />
                            </div>
                            <div className="p-4 glass-panel border border-primary/5 rounded-xl rounded-tl-none space-y-3 shadow-ambient relative">
                                <p className="text-sm text-on-surface-variant font-medium">Đang phân tích wireframe...</p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-primary">AI ĐÃ PHÁT HIỆN UI</span>
                                    <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-primary">REAL-TIME DB</span>
                                </div>
                                <p className="text-sm text-on-surface-variant">Tôi thấy một bảng điều khiển với "Mức tồn kho toàn cầu" và "Trình chọn kho hàng". Đang khởi tạo Mục 2.3: Yêu cầu chức năng hệ thống...</p>
                                <button
                                    onClick={() => setReplyingTo("Tôi thấy một bảng điều khiển với \"Mức tồn kho toàn cầu\" và \"Trình chọn kho hàng\"...")}
                                    className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-primary"
                                    title="Trả lời"
                                >
                                    <CornerUpLeft size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-surface-container-low border-t border-outline-variant/10">
                        <AnimatePresence>
                            {replyingTo && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mb-3 p-2 bg-primary/5 border-l-4 border-primary rounded-r-lg flex justify-between items-start"
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <CornerUpLeft size={14} className="text-primary flex-shrink-0" />
                                        <p className="text-[11px] text-primary font-medium italic truncate">"{replyingTo}"</p>
                                    </div>
                                    <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-primary">
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            )}
                            {uploadedFiles.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/10"
                                >
                                    {uploadedFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-primary/5 text-primary rounded border border-primary/10 text-[10px] font-bold group">
                                            <File size={12} />
                                            <span className="max-w-[100px] truncate">{file.name}</span>
                                            <button onClick={() => removeFile(idx)} className="hover:text-error transition-colors">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="relative">
                            <textarea
                                className="w-full bg-surface-container-lowest border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 resize-none shadow-inner outline-none"
                                placeholder="Mô tả thêm logic hoặc tải lên tệp..."
                                rows={3}
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                    title="Tải lên tệp"
                                >
                                    <Paperclip size={18} />
                                </button>
                                <button
                                    onClick={() => folderInputRef.current?.click()}
                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                    title="Tải lên thư mục ảnh"
                                >
                                    <FolderOpen size={18} />
                                </button>
                                <button className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all">
                                    <Send size={18} className="fill-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Right: Live Preview Area */}
                <AnimatePresence>
                    {showPreview && (
                        <motion.section
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            className="flex-1 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/10"
                        >
                            <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-secondary" />
                                    <h2 className="font-semibold text-sm">Xem trước tài liệu trực tiếp</h2>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 text-slate-400 hover:bg-surface-container-low rounded transition-colors">
                                        <ZoomIn size={18} />
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:bg-surface-container-low rounded transition-colors">
                                        <Printer size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-surface-container-low/30 p-8 flex justify-center relative" ref={previewRef} onMouseUp={handleTextSelection}>
                                {/* Selection Reply Button */}
                                <AnimatePresence>
                                    {selectionRange && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                            style={{ top: selectionRange.top, left: selectionRange.left }}
                                            onClick={() => {
                                                setActiveCommentInput({ top: selectionRange.top + 40, quote: selectionRange.text });
                                                setSelectionRange(null);
                                            }}
                                            className="absolute z-50 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xl -translate-x-1/2 hover:bg-slate-700 transition-colors"
                                        >
                                            <span>Reply</span>
                                            <Send size={12} className="rotate-[-45deg]" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>

                                {/* Comment Input Popover */}
                                <AnimatePresence>
                                    {activeCommentInput && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            style={{ top: activeCommentInput.top, right: '2rem' }}
                                            className="absolute z-50 w-64 bg-white rounded-xl shadow-2xl border border-primary/20 p-4 space-y-3"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Ghi chú sửa đổi</span>
                                                <button onClick={() => setActiveCommentInput(null)} className="text-slate-400 hover:text-slate-600">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <div className="p-2 bg-slate-50 rounded-lg border-l-2 border-primary/30">
                                                <p className="text-[10px] text-slate-500 italic line-clamp-2">"{activeCommentInput.quote}"</p>
                                            </div>
                                            <textarea
                                                autoFocus
                                                value={newCommentText}
                                                onChange={(e) => setNewCommentText(e.target.value)}
                                                className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:ring-1 focus:ring-primary/30"
                                                placeholder="Nhập nội dung cần sửa..."
                                                rows={3}
                                            />
                                            <button
                                                onClick={handleAddComment}
                                                className="w-full py-2 bg-primary text-white rounded-lg text-[10px] font-bold hover:brightness-110 transition-all"
                                            >
                                                Lưu ghi chú
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Existing Comments Sidebar */}
                                <div className="absolute right-4 top-8 bottom-8 w-64 pointer-events-none hidden xl:block">
                                    {comments.map((comment) => (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{ top: comment.top }}
                                            className="absolute w-full bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-primary/10 shadow-sm pointer-events-auto hover:shadow-md transition-shadow group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User size={10} className="text-primary" />
                                                    </div>
                                                    <span className="text-[9px] font-bold text-slate-700">Alex Chen</span>
                                                </div>
                                                <button
                                                    onClick={() => setComments(prev => prev.filter(c => c.id !== comment.id))}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-slate-500 italic mb-2 line-clamp-1 border-l border-primary/20 pl-2">"{comment.quote}"</p>
                                            <p className="text-[11px] text-slate-800 font-medium">{comment.text}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mock Document Page */}
                                <article className="w-full max-w-2xl bg-white shadow-xl min-h-[1000px] p-12 rounded-sm border border-outline-variant/5 select-text">
                                    <div className="space-y-8">
                                        <header className="border-b border-primary/20 pb-4">
                                            <h1 className="text-3xl font-bold text-on-surface">{selectedDocType}</h1>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-sm font-medium text-primary">Bản thảo phiên bản 0.8 (Tự động tạo)</p>
                                                <p className="text-xs text-slate-400">Cập nhật 2 phút trước</p>
                                            </div>
                                        </header>

                                        <section className="space-y-4">
                                            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                                                1. Tóm tắt điều hành
                                            </h3>
                                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                                Mô-đun kho hàng CloudScale ERP v4 nhằm mục đích thu hẹp khoảng cách giữa hậu cần kho hàng toàn cầu và tính khả dụng của cửa hàng theo thời gian thực. Mô-đun này sẽ thay thế dịch vụ cũ 'StoreSync' bằng kiến trúc hiện đại, ưu tiên API.
                                            </p>
                                        </section>

                                        <section className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-bold text-on-surface">2. Yêu cầu chức năng</h3>
                                                <span className="animate-pulse flex items-center gap-1 text-[10px] font-bold text-primary">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> ĐANG VIẾT...
                                                </span>
                                            </div>
                                            <div className="space-y-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-primary uppercase">2.3.1 Đồng bộ hóa đa kho</p>
                                                    <p className="text-sm text-on-surface-variant">Hệ thống sẽ duy trì một sổ cái kho hàng thống nhất trên nhiều địa điểm vật lý và ảo, cập nhật trong &lt;500ms sau khi hoàn tất bất kỳ giao dịch nào.</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-primary uppercase">2.3.2 Cảnh báo ngưỡng</p>
                                                    <p className="text-sm text-on-surface-variant">Các bên liên quan sẽ nhận được thông báo đẩy tự động khi mức tồn kho cho các mặt hàng "Loại A" giảm xuống dưới ngưỡng dự trữ an toàn động được tính toán bởi dự báo AI.</p>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-6">
                                            <h3 className="text-lg font-bold text-on-surface">3. Bản đồ tham chiếu trực quan</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="h-32 bg-slate-100 rounded border border-dashed border-slate-300 flex items-center justify-center">
                                                        <ImageIcon size={24} className="text-slate-400" />
                                                    </div>
                                                    <p className="text-[10px] text-center text-slate-500 font-medium">Hình 3.1: Giao diện Bảng điều khiển toàn cầu</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-32 bg-slate-100 rounded border border-dashed border-slate-300 flex items-center justify-center">
                                                        <BrainCircuit size={24} className="text-slate-400" />
                                                    </div>
                                                    <p className="text-[10px] text-center text-slate-500 font-medium">Hình 3.2: Sơ đồ luồng dữ liệu</p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </article>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AIWorkspaceView;