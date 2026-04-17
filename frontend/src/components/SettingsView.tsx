import React, { useState } from 'react';
import {
    User,
    Lock,
    Bell,
    Globe,
    Key,
    Shield,
    Mail,
    Camera,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Smartphone,
    LogOut,
    Save,
    Plus
} from 'lucide-react';
import { motion } from 'motion/react';

interface SettingsProps {
    theme?: string;
    onThemeChange?: (theme: string) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ theme: currentTheme = 'light', onThemeChange }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isMfaEnabled, setIsMfaEnabled] = useState(true);
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        weekly: true
    });

    const tabs = [
        { id: 'profile', name: 'Hồ sơ cá nhân', icon: User },
        { id: 'security', name: 'Bảo mật', icon: Lock },
        { id: 'notifications', name: 'Thông báo', icon: Bell },
        { id: 'preferences', name: 'Tùy chỉnh', icon: Globe },
        { id: 'api', name: 'API & Tích hợp', icon: Key },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-surface-container-lowest rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8">
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Hồ sơ cá nhân</h2>
                                    <p className="text-sm text-slate-500">Cập nhật thông tin cá nhân và ảnh đại diện của bạn.</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <img
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt="Avatar"
                                            className="w-24 h-24 rounded-3xl object-cover border-4 border-surface-container-lowest shadow-md"
                                            referrerPolicy="no-referrer"
                                        />
                                        <button className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={20} />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Alex Rivera</h3>
                                        <p className="text-sm text-slate-500">Kỹ sư QA trưởng • ANSO Platform</p>
                                        <div className="flex gap-2 mt-2">
                                            <button className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-dark transition-colors">Thay đổi ảnh</button>
                                            <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-200 transition-colors">Gỡ bỏ</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Họ và tên</label>
                                        <input type="text" defaultValue="Alex Rivera" className="w-full px-4 py-3 bg-surface-container-low border border-slate-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Địa chỉ Email</label>
                                        <input type="email" defaultValue="alex.rivera@anso.ai" className="w-full px-4 py-3 bg-surface-container-low border border-slate-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Chức danh</label>
                                        <input type="text" defaultValue="Kỹ sư QA trưởng" className="w-full px-4 py-3 bg-surface-container-low border border-slate-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phòng ban</label>
                                        <input type="text" defaultValue="Đảm bảo chất lượng (QA)" className="w-full px-4 py-3 bg-surface-container-low border border-slate-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all" />
                                    </div>
                                    <div className="col-span-full space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tiểu sử ngắn</label>
                                        <textarea rows={3} className="w-full px-4 py-3 bg-surface-container-low border border-slate-200 rounded-xl text-sm font-medium focus:border-primary outline-none transition-all resize-none" defaultValue="Đam mê xây dựng các quy trình kiểm thử tự động thông minh và tối ưu hóa chất lượng sản phẩm SDLC." />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">Hủy bỏ</button>
                                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                                        <Save size={18} />
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Bảo mật tài khoản</h2>
                                    <p className="text-sm text-slate-500">Quản lý mật khẩu và các tùy chọn bảo mật nâng cao.</p>
                                </div>

                                {/* Change Password */}
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Shield size={20} className="text-primary" />
                                        <h3 className="text-sm font-bold text-slate-900">Đổi mật khẩu</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mật khẩu hiện tại</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mật khẩu mới</label>
                                                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Xác nhận mật khẩu mới</label>
                                                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">Cập nhật mật khẩu</button>
                                </div>

                                {/* Two-Factor Auth */}
                                <div className="flex items-center justify-between p-6 border border-slate-200 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <Smartphone size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">Xác thực 2 yếu tố (2FA)</h4>
                                            <p className="text-xs text-slate-500">Thêm một lớp bảo mật cho tài khoản của bạn.</p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => setIsMfaEnabled(!isMfaEnabled)}
                                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isMfaEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isMfaEnabled ? 'right-1' : 'left-1'}`}></div>
                                    </div>
                                </div>

                                {/* Active Sessions */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900">Phiên đăng nhập đang hoạt động</h3>
                                    <div className="space-y-3">
                                        {[
                                            { device: 'MacBook Pro • Chrome', location: 'Hà Nội, VN', time: 'Hiện tại', current: true },
                                            { device: 'iPhone 13 • Safari', location: 'TP. Hồ Chí Minh, VN', time: '2 giờ trước', current: false },
                                        ].map((session, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400">
                                                        <Smartphone size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{session.device}</p>
                                                        <p className="text-[10px] text-slate-500">{session.location} • {session.time}</p>
                                                    </div>
                                                </div>
                                                {!session.current && (
                                                    <button className="text-[10px] font-bold text-error hover:underline">Đăng xuất</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Cài đặt thông báo</h2>
                                    <p className="text-sm text-slate-500">Kiểm soát cách bạn nhận thông báo từ hệ thống.</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { id: 'email', title: 'Thông báo qua Email', desc: 'Nhận cập nhật về dự án và báo cáo qua email.', icon: Mail },
                                        { id: 'push', title: 'Thông báo đẩy', desc: 'Nhận thông báo trực tiếp trên trình duyệt.', icon: Bell },
                                        { id: 'weekly', title: 'Báo cáo hàng tuần', desc: 'Bản tóm tắt hiệu suất dự án vào mỗi sáng thứ Hai.', icon: CheckCircle2 },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-6 border border-slate-200 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                                                    <item.icon size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof prev] }))}
                                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifications[item.id as keyof typeof notifications] ? 'bg-primary' : 'bg-slate-200'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.id as keyof typeof notifications] ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'preferences' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Tùy chỉnh cá nhân</h2>
                                    <p className="text-sm text-slate-500">Thiết lập ngôn ngữ và giao diện làm việc của bạn.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ngôn ngữ hiển thị</label>
                                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary appearance-none">
                                            <option>Tiếng Việt (VN)</option>
                                            <option>English (US)</option>
                                            <option>日本語 (JP)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Múi giờ</label>
                                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary appearance-none">
                                            <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                                            <option>(GMT+00:00) UTC</option>
                                            <option>(GMT-08:00) Pacific Time</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Chủ đề giao diện</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { id: 'light', name: 'Sáng' },
                                            { id: 'dark', name: 'Tối' },
                                            { id: 'system', name: 'Hệ thống' }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => onThemeChange?.(t.id)}
                                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${currentTheme === t.id ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-full h-12 rounded-lg ${t.id === 'light' ? 'bg-white' : t.id === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-r from-white to-slate-900'}`}></div>
                                                <span className="text-[10px] font-bold">{t.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'api' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">API & Tích hợp</h2>
                                    <p className="text-sm text-slate-500">Quản lý các khóa API cá nhân để tích hợp với các công cụ bên thứ ba.</p>
                                </div>

                                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                                    <AlertCircle className="text-amber-600 shrink-0" size={20} />
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-900">Bảo mật khóa API</h4>
                                        <p className="text-xs text-amber-700 leading-relaxed">Không bao giờ chia sẻ khóa API của bạn với bất kỳ ai. Bất kỳ ai có khóa này đều có thể truy cập dữ liệu dự án của bạn.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-slate-900">Khóa API của bạn</h3>
                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary-dark transition-all">
                                            <Plus size={14} />
                                            Tạo khóa mới
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { name: 'Development Key', key: 'ans_live_••••••••••••••••', created: '12/03/2026' },
                                            { name: 'CI/CD Pipeline', key: 'ans_live_••••••••••••••••', created: '05/01/2026' },
                                        ].map((apiKey, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">{apiKey.name}</p>
                                                    <code className="text-[10px] text-slate-500 font-mono">{apiKey.key}</code>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] text-slate-400">Tạo ngày {apiKey.created}</span>
                                                    <button className="p-1.5 text-slate-400 hover:text-error transition-colors">
                                                        <LogOut size={14} className="rotate-90" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;