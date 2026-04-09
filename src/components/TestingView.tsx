import React, { useState } from 'react';
import {
    Sparkles,
    MoreVertical,
    Filter,
    Download,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Smartphone,
    Clock,
    Ban,
    BarChart3,
    XCircle,
    Loader2,
    PlayCircle,
    SkipForward,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    FileText,
    ListChecks,
    Target,
    Search,
    Paperclip,
    FolderOpen,
    Image as ImageIcon,
    Upload,
    X,
    File,
    Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";

interface TestingViewProps {
    testCases: any[];
    onUpdateTestCases: React.Dispatch<React.SetStateAction<any[]>>;
}

const TestingView: React.FC<TestingViewProps> = ({ testCases, onUpdateTestCases: setTestCases }) => {
    const [uploadedContext, setUploadedContext] = useState<{ name: string; type: 'doc' | 'image' }[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const folderInputRef = React.useRef<HTMLInputElement>(null);

    const handleContextUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'doc' | 'image' | 'folder') => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map((f: File) => {
                const isImage = f.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name);
                return {
                    name: f.webkitRelativePath || f.name,
                    type: type === 'image' || (type === 'folder' && isImage) ? 'image' as const : 'doc' as const
                };
            });
            setUploadedContext(prev => [...prev, ...newFiles]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files).map((f: File) => {
                const isImage = f.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name);
                return {
                    name: f.name,
                    type: isImage ? 'image' as const : 'doc' as const
                };
            });
            setUploadedContext(prev => [...prev, ...newFiles]);
        }
    };

    const removeContext = (index: number) => {
        setUploadedContext(prev => prev.filter((_, i) => i !== index));
    };

    const [isGenerating, setIsGenerating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTestCase, setSelectedTestCase] = useState<any | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const itemsPerPage = 10;

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredTestCases = testCases.filter(tc =>
        tc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tc.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedTestCases = [...filteredTestCases].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;

        let valA = (a as any)[key];
        let valB = (b as any)[key];

        // Custom sorting for priority
        if (key === 'priority') {
            const priorityOrder: { [key: string]: number } = {
                'Nghiêm trọng': 4,
                'Cao': 3,
                'Trung bình': 2,
                'Thấp': 1
            };
            valA = priorityOrder[valA] || 0;
            valB = priorityOrder[valB] || 0;
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.max(1, Math.ceil(sortedTestCases.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTestCases = sortedTestCases.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, status: newStatus } : tc));
    };

    const statusOptions = [
        { value: 'Pass', label: 'Pass', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { value: 'Fail', label: 'Fail', icon: XCircle, color: 'text-error', bg: 'bg-error/10' },
        { value: 'Untested', label: 'Untested', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
        { value: 'N/A', label: 'N/A', icon: Ban, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    ];

    const getStatusConfig = (status: string) => {
        return statusOptions.find(opt => opt.value === status) || statusOptions[2]; // Fixed: fallback to 'Untested' (index 2), not index 5
    };

    const generateTestCase = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: "Hãy tạo một test case mới cho hệ thống SDLC DocGen. Trả về dưới dạng JSON với các trường: reqId (ví dụ FR-015), title (tiêu đề test case), priority (Nghiêm trọng, Cao, hoặc Trung bình), type (UAT, Unit Test, Integration Test, hoặc System Testing), description (mô tả ngắn), steps (mảng các bước thực hiện), expectedResult (kết quả mong đợi).",
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            reqId: { type: Type.STRING },
                            title: { type: Type.STRING },
                            priority: { type: Type.STRING, enum: ["Nghiêm trọng", "Cao", "Trung bình"] },
                            type: { type: Type.STRING, enum: ["UAT", "Unit Test", "Integration Test", "System Testing"] },
                            description: { type: Type.STRING },
                            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                            expectedResult: { type: Type.STRING }
                        },
                        required: ["reqId", "title", "priority", "type", "description", "steps", "expectedResult"]
                    }
                }
            });

            const result = JSON.parse(response.text || "{}");
            const newId = `TC-GEN-${Math.floor(Math.random() * 900) + 100}`;
            const newTC = {
                id: newId,
                reqId: result.reqId || 'FR-NEW',
                title: result.title || 'Test case mới được tạo',
                priority: result.priority || 'Trung bình',
                type: result.type || 'System Testing',
                status: 'Untested',
                description: result.description || 'Chưa có mô tả.',
                steps: result.steps || [],
                expectedResult: result.expectedResult || 'Chưa có kết quả mong đợi.'
            };
            setTestCases(prev => [newTC, ...prev]);
            setCurrentPage(1); // Reset to first page to see the new case
        } catch (error) {
            console.error("Lỗi khi tạo test case:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (!sortConfig || sortConfig.key !== column) return <ChevronDown size={12} className="opacity-20" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
    };

    return (
        <div className="p-8 space-y-8">
            <div className="grid grid-cols-12 gap-6">
                {/* Main Coverage Metric */}
                <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-sm font-semibold mb-1">Độ phủ yêu cầu</h3>
                            <p className="text-xs text-secondary">Tổng quan ma trận truy vết</p>
                        </div>
                        <div className="px-3 py-1 bg-primary-container text-white rounded-full text-[10px] font-bold">87% TỔNG CỘNG</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                        <div className="space-y-4">
                            <div className="flex items-end justify-between">
                                <span className="text-4xl leading-none font-bold text-primary">124</span>
                                <span className="text-[10px] font-medium text-secondary">Đã phủ</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '87%' }} className="h-full bg-primary" />
                            </div>
                            <p className="text-[10px] text-on-surface-variant">Yêu cầu chức năng</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-end justify-between">
                                <span className="text-4xl leading-none font-bold text-secondary">42</span>
                                <span className="text-[10px] font-medium text-secondary">Một phần</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-secondary" />
                            </div>
                            <p className="text-[10px] text-on-surface-variant">Phi chức năng</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-end justify-between">
                                <span className="text-4xl leading-none font-bold text-error">12</span>
                                <span className="text-[10px] font-medium text-secondary">Còn thiếu</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '15%' }} className="h-full bg-error" />
                            </div>
                            <p className="text-[10px] text-on-surface-variant">Khu vực chưa kiểm thử</p>
                        </div>
                    </div>
                </div>

                {/* Execution Status Card */}
                <div className="col-span-12 lg:col-span-4 bg-primary text-white rounded-xl p-6 relative overflow-hidden shadow-xl shadow-primary/20">
                    <div className="relative z-10">
                        <h3 className="text-sm font-semibold mb-6">Trạng thái thực thi</h3>
                        <div className="space-y-3">
                            {statusOptions.map((opt) => {
                                const count = testCases.filter(t => t.status === opt.value).length;
                                return (
                                    <div key={opt.value} className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <opt.icon size={14} className="opacity-70" />
                                            <span className="text-sm opacity-80">{opt.label}</span>
                                        </div>
                                        <span className="font-bold">{count}</span>
                                    </div>
                                );
                            })}
                            <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Tổng cộng</span>
                                <span className="text-2xl font-bold">{testCases.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute right-4 top-4 opacity-20">
                        <BarChart3 size={64} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Context Upload & AI Queue */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Context Input Section */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`bg-white rounded-xl p-5 border shadow-sm space-y-4 transition-all ${isDragging ? 'border-primary border-2 bg-primary/5 scale-[1.02]' : 'border-outline-variant/10'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Database size={16} className="text-primary" />
                                Tài liệu & Hình ảnh tham chiếu
                            </h3>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 bg-surface-container-low text-secondary hover:text-primary rounded-lg transition-colors"
                                    title="Tải lên tài liệu SRS/BRD"
                                >
                                    <Paperclip size={14} />
                                </button>
                                <button
                                    onClick={() => imageInputRef.current?.click()}
                                    className="p-1.5 bg-surface-container-low text-secondary hover:text-primary rounded-lg transition-colors"
                                    title="Tải lên ảnh màn hình"
                                >
                                    <ImageIcon size={14} />
                                </button>
                                <button
                                    onClick={() => folderInputRef.current?.click()}
                                    className="p-1.5 bg-surface-container-low text-secondary hover:text-primary rounded-lg transition-colors"
                                    title="Tải lên thư mục (Folder)"
                                >
                                    <FolderOpen size={14} />
                                </button>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => handleContextUpload(e, 'doc')} />
                            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" multiple onChange={(e) => handleContextUpload(e, 'image')} />
                            <input
                                type="file"
                                ref={folderInputRef}
                                className="hidden"
                                // @ts-ignore
                                webkitdirectory=""
                                directory=""
                                multiple
                                onChange={(e) => handleContextUpload(e, 'folder')}
                            />
                        </div>

                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                            {uploadedContext.length === 0 ? (
                                <div className="py-8 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-center">
                                    <Upload size={24} className={`mb-2 ${isDragging ? 'text-primary animate-bounce' : 'text-slate-300'}`} />
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        {isDragging ? 'Thả tệp vào đây...' : 'Kéo thả hoặc tải lên tài liệu tham chiếu.'}
                                        <br />Hỗ trợ SRS, Ảnh màn hình hoặc Thư mục.
                                    </p>
                                </div>
                            ) : (
                                uploadedContext.map((item, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={idx}
                                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100 group"
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {item.type === 'doc' ? <FileText size={12} className="text-primary flex-shrink-0" /> : <ImageIcon size={12} className="text-indigo-500 flex-shrink-0" />}
                                            <span className="text-[10px] font-bold text-slate-700 truncate">{item.name}</span>
                                        </div>
                                        <button onClick={() => removeContext(idx)} className="p-1 text-slate-400 hover:text-error opacity-0 group-hover:opacity-100 transition-all">
                                            <X size={12} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={generateTestCase}
                            disabled={isGenerating || uploadedContext.length === 0}
                            className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all shadow-lg shadow-primary/20"
                        >
                            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            Generative Test Case từ Context
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-bold flex items-center gap-2">
                            <Sparkles size={16} className="text-primary" />
                            Hàng đợi xác minh
                        </h3>
                        <span className="bg-surface-container-highest text-primary text-[10px] font-bold px-2 py-1 rounded">5 MỚI</span>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-white rounded-xl p-4 border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">TC-GEN-084</span>
                                <MoreVertical size={14} className="text-secondary" />
                            </div>
                            <p className="text-sm font-semibold mb-3 leading-tight">Xác thực cơ chế dự phòng MFA</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                    <span className="text-[10px] text-secondary font-medium">Mô-đun Auth</span>
                                </div>
                                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Xác minh</button>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">TC-GEN-085</span>
                                <MoreVertical size={14} className="text-secondary" />
                            </div>
                            <p className="text-sm font-semibold mb-3 leading-tight">Kiểm thử áp lực tạo tài liệu đồng thời (50+ người dùng)</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                    <span className="text-[10px] text-secondary font-medium">Hiệu năng</span>
                                </div>
                                <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Xác minh</button>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-3 text-[10px] font-bold text-white bg-on-surface rounded-xl hover:opacity-90 transition-opacity uppercase tracking-widest">
                        Xem tất cả bản nháp AI
                    </button>
                </div>

                {/* Test Repository Table */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-white rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
                        <div className="p-6 border-b border-surface-container-low flex items-center justify-between">
                            <h3 className="text-sm font-bold">Kho lưu trữ kiểm thử</h3>
                            <div className="flex gap-2 items-center">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm ID hoặc tiêu đề..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-lg text-xs outline-none focus:border-primary/50 transition-all w-48 md:w-64"
                                    />
                                </div>
                                <button className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors">
                                    <Filter size={16} />
                                </button>
                                <button className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left table-fixed">
                                <thead className="bg-surface-container-low">
                                    <tr>
                                        <th className="w-[10%] px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('id')}>
                                            <div className="flex items-center gap-2">
                                                ID
                                                <SortIcon column="id" />
                                            </div>
                                        </th>
                                        <th className="w-[8%] px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('reqId')}>
                                            <div className="flex items-center gap-2">
                                                Mã YC
                                                <SortIcon column="reqId" />
                                            </div>
                                        </th>
                                        <th className="w-[28%] px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('title')}>
                                            <div className="flex items-center gap-2">
                                                Tiêu đề
                                                <SortIcon column="title" />
                                            </div>
                                        </th>
                                        <th className="w-[13%] px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('priority')}>
                                            <div className="flex items-center gap-2">
                                                Ưu tiên
                                                <SortIcon column="priority" />
                                            </div>
                                        </th>
                                        <th className="w-[15%] px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('type')}>
                                            <div className="flex items-center gap-2">
                                                Loại Test
                                                <SortIcon column="type" />
                                            </div>
                                        </th>
                                        <th className="w-[18%] px-4 py-3 text-[10px] font-bold text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('status')}>
                                            <div className="flex items-center gap-2">
                                                Trạng thái
                                                <SortIcon column="status" />
                                            </div>
                                        </th>
                                        <th className="w-[8%] px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-container-low">
                                    <AnimatePresence initial={false}>
                                        {paginatedTestCases.flatMap((tc) => [
                                            <motion.tr
                                                key={tc.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                onClick={() => setSelectedTestCase(tc)}
                                                className={`h-14 hover:bg-surface-container-low transition-colors group cursor-pointer ${selectedTestCase?.id === tc.id ? 'bg-surface-container-low' : ''}`}
                                            >
                                                <td className="px-4 py-3 text-xs font-bold text-primary whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {tc.id}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs font-medium text-secondary whitespace-nowrap">{tc.reqId}</td>
                                                <td className="px-4 py-3 text-sm font-medium truncate" title={tc.title}>{tc.title}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${tc.priority === 'Nghiêm trọng' ? 'bg-error/10 text-error' :
                                                            tc.priority === 'Cao' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                                                        }`}>
                                                        {tc.priority}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${tc.type === 'UAT' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                                            tc.type === 'Unit Test' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                                                tc.type === 'Integration Test' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                                                                    'border-slate-200 bg-slate-50 text-slate-700'
                                                        }`}>
                                                        {tc.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                    <div className="relative inline-flex items-center">
                                                        <select
                                                            value={tc.status}
                                                            onChange={(e) => handleStatusChange(tc.id, e.target.value)}
                                                            className={`appearance-none pl-7 pr-7 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer transition-all border border-transparent hover:border-outline-variant ${getStatusConfig(tc.status).bg} ${getStatusConfig(tc.status).color}`}
                                                        >
                                                            {statusOptions.map(opt => (
                                                                <option key={opt.value} value={opt.value} className="bg-white text-on-surface">
                                                                    {opt.label.toUpperCase()}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className={`absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none ${getStatusConfig(tc.status).color}`}>
                                                            {React.createElement(getStatusConfig(tc.status).icon, { size: 14 })}
                                                        </div>
                                                        <div className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${getStatusConfig(tc.status).color}`}>
                                                            <ChevronDown size={12} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-secondary hover:text-primary">
                                                        <ExternalLink size={14} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ])}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-surface-container-low/30 border-t border-surface-container-low flex items-center justify-between">
                            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                                Hiển thị {sortedTestCases.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, sortedTestCases.length)} trên {sortedTestCases.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === page
                                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                    : 'hover:bg-white text-secondary'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedTestCase && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTestCase(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                                            {selectedTestCase.id}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            YC: {selectedTestCase.reqId}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedTestCase.title}</h2>
                                    <div className="flex items-center gap-3 pt-2">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${selectedTestCase.priority === 'Nghiêm trọng' ? 'bg-error/10 text-error' :
                                                selectedTestCase.priority === 'Cao' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                                            }`}>
                                            {selectedTestCase.priority}
                                        </span>
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${selectedTestCase.type === 'UAT' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                                selectedTestCase.type === 'Unit Test' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                                                    selectedTestCase.type === 'Integration Test' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                                                        'border-slate-200 bg-slate-50 text-slate-700'
                                            }`}>
                                            {selectedTestCase.type}
                                        </span>
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusConfig(selectedTestCase.status).bg} ${getStatusConfig(selectedTestCase.status).color}`}>
                                            {React.createElement(getStatusConfig(selectedTestCase.status).icon, { size: 12 })}
                                            {selectedTestCase.status}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTestCase(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                                                <FileText size={18} />
                                                <h4 className="text-sm font-bold uppercase tracking-widest">Mô tả chi tiết</h4>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {selectedTestCase.description || 'Không có mô tả chi tiết cho test case này.'}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                                                <Target size={18} />
                                                <h4 className="text-sm font-bold uppercase tracking-widest">Kết quả mong đợi</h4>
                                            </div>
                                            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-medium leading-relaxed">
                                                {selectedTestCase.expectedResult || 'Chưa xác định kết quả mong đợi.'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                                            <ListChecks size={18} />
                                            <h4 className="text-sm font-bold uppercase tracking-widest">Các bước thực hiện</h4>
                                        </div>
                                        <ul className="space-y-3">
                                            {(selectedTestCase.steps || ['Chưa có các bước thực hiện.']).map((step: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-sm text-slate-600 pt-0.5">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedTestCase(null)}
                                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                                >
                                    Đóng
                                </button>
                                <button
                                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-2"
                                >
                                    <PlayCircle size={18} />
                                    Thực thi Test
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TestingView;
