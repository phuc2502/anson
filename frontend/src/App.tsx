/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardView from './components/DashboardView';
import TestingView from './components/TestingView';
import TemplatesView from './components/TemplatesView';
import AIWorkspaceView from './components/AIWorkspaceView';
import ProjectSetupView from './components/ProjectSetupView';
import SettingsView from './components/SettingsView';
import ProjectsView from './components/ProjectsView';
import { motion, AnimatePresence } from 'motion/react';
import { Template, Project } from './types';

export default function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [theme, setTheme] = useState('light');
    const [templates, setTemplates] = useState<Template[]>([
        { id: 'brd', title: 'Tài liệu Yêu cầu Nghiệp vụ (BRD)', desc: 'Cấu trúc tài liệu nhu cầu các bên liên quan cho v2.4 RAG.', version: 'v1.2.4', time: '2 ngày trước', status: 'Đang hoạt động', color: 'from-primary to-blue-300', iconName: 'FileText' },
        { id: 'sad', title: 'Kiến trúc hệ thống (SAD)', desc: 'Sơ đồ cấu trúc kỹ thuật và yêu cầu hạ tầng đám mây.', version: 'v0.9.1', time: '5 giờ trước', status: 'Bản nháp', color: 'from-orange-400 to-orange-200', iconName: 'PencilRuler' },
        { id: 'uat', title: 'Tài liệu kiểm thử chấp nhận người dùng (UAT)', desc: 'Tiêu chí nghiệm thu của người dùng và quy trình ký duyệt.', version: 'v1.0.0', time: '1 tháng trước', status: 'Đang hoạt động', color: 'from-primary/40 to-primary/10', iconName: 'FileCheck' },
        { id: 'testplan', title: 'Kế hoạch kiểm thử (Test Plan)', desc: 'Các kịch bản kiểm thử dựa trên logic cho quy trình xác thực tự động.', version: 'v2.1.0', time: '1 tuần trước', status: 'Đang hoạt động', color: 'from-blue-600 to-primary', iconName: 'ClipboardCheck' },
        { id: 'api', title: 'Tài liệu API', desc: 'Tài liệu các điểm cuối tương thích chuẩn OpenAPI/Swagger.', version: 'v1.1.2', time: '3 ngày trước', status: 'Đang hoạt động', color: 'from-primary to-blue-300', iconName: 'Terminal' },
    ]);

    const [projects, setProjects] = useState<Project[]>([
        { id: 1, name: 'CloudScale ERP v4', description: 'Hệ thống quản trị doanh nghiệp tích hợp AI cho quy mô lớn.', domain: 'erp.cloudscale.com', status: 'Đang hoạt động', createdAt: '01/03/2026' },
        { id: 2, name: 'Anso Precision v2.4', description: 'Công cụ đo lường và phân tích dữ liệu kỹ thuật chính xác.', domain: 'anso.precision.io', status: 'Đang hoạt động', createdAt: '15/02/2026' },
    ]);

    const [generatedDocs, setGeneratedDocs] = useState<{ id: string, type: string, projectId: number, createdAt: string }[]>([]);

    const [testCases, setTestCases] = useState([
        {
            id: 'TC-001',
            reqId: 'FR-001',
            title: 'Đăng nhập người dùng qua SSO',
            priority: 'Nghiêm trọng',
            type: 'UAT',
            status: 'Pass',
            description: 'Xác minh rằng người dùng có thể đăng nhập thành công bằng tài khoản SSO của doanh nghiệp.',
            steps: [
                'Truy cập trang đăng nhập',
                'Nhấn nút "Đăng nhập bằng SSO"',
                'Nhập thông tin tài khoản doanh nghiệp',
                'Xác thực MFA nếu được yêu cầu'
            ],
            expectedResult: 'Người dùng được chuyển hướng đến trang dashboard với phiên làm việc hợp lệ.'
        },
        {
            id: 'TC-002',
            reqId: 'FR-001',
            title: 'Quy trình đặt lại mật khẩu',
            priority: 'Cao',
            type: 'System Testing',
            status: 'Untested',
            description: 'Kiểm tra luồng khôi phục mật khẩu khi người dùng quên thông tin đăng nhập.',
            steps: [
                'Nhấn "Quên mật khẩu"',
                'Nhập email đã đăng ký',
                'Kiểm tra email nhận mã OTP',
                'Nhập mật khẩu mới'
            ],
            expectedResult: 'Mật khẩu được cập nhật và người dùng có thể đăng nhập bằng mật khẩu mới.'
        },
        {
            id: 'TC-003',
            reqId: 'FR-004',
            title: 'Kiểm tra tính toàn vẹn khi xuất PDF',
            priority: 'Trung bình',
            type: 'Integration Test',
            status: 'Fail',
            description: 'Đảm bảo tài liệu PDF được xuất ra giữ nguyên định dạng và không mất dữ liệu.',
            steps: [
                'Mở tài liệu mẫu',
                'Nhấn nút "Xuất PDF"',
                'Mở file PDF vừa tải về'
            ],
            expectedResult: 'File PDF hiển thị đúng font chữ, hình ảnh và bảng biểu như bản gốc.'
        },
        {
            id: 'TC-004',
            reqId: 'FR-012',
            title: 'Ánh xạ trường tùy chỉnh trong mẫu',
            priority: 'Trung bình',
            type: 'Unit Test',
            status: 'N/A',
            description: 'Xác thực khả năng ánh xạ các trường dữ liệu động vào mẫu tài liệu.',
            steps: [
                'Tạo mẫu mới',
                'Thêm trường tùy chỉnh {{customer_name}}',
                'Gán giá trị từ database'
            ],
            expectedResult: 'Tài liệu được tạo ra hiển thị đúng giá trị thực tế thay vì placeholder.'
        },
        { id: 'TC-005', reqId: 'FR-015', title: 'Kiểm tra hiệu năng API Gateway', priority: 'Cao', type: 'System Testing', status: 'Pass' },
        { id: 'TC-006', reqId: 'FR-018', title: 'Xác thực phân quyền vai trò Admin', priority: 'Nghiêm trọng', type: 'UAT', status: 'Pass' },
        { id: 'TC-007', reqId: 'FR-020', title: 'Kiểm tra đồng bộ dữ liệu thời gian thực', priority: 'Trung bình', type: 'Integration Test', status: 'Untested' },
        { id: 'TC-008', reqId: 'FR-022', title: 'Xử lý lỗi khi mất kết nối mạng', priority: 'Cao', type: 'System Testing', status: 'Untested' },
        { id: 'TC-009', reqId: 'FR-025', title: 'Kiểm tra tính tương thích trình duyệt Safari', priority: 'Trung bình', type: 'UAT', status: 'N/A' },
        { id: 'TC-010', reqId: 'FR-028', title: 'Tối ưu hóa kích thước ảnh tải lên', priority: 'Thấp', type: 'Unit Test', status: 'Pass' },
        { id: 'TC-011', reqId: 'FR-030', title: 'Kiểm tra bảo mật SQL Injection', priority: 'Nghiêm trọng', type: 'System Testing', status: 'Pass' },
        { id: 'TC-012', reqId: 'FR-032', title: 'Xác thực định dạng email đăng ký', priority: 'Trung bình', type: 'Unit Test', status: 'Pass' },
        { id: 'TC-013', reqId: 'FR-035', title: 'Kiểm tra giới hạn ký tự tên người dùng', priority: 'Thấp', type: 'Unit Test', status: 'Pass' },
        { id: 'TC-014', reqId: 'FR-038', title: 'Xử lý thanh toán qua cổng Stripe', priority: 'Cao', type: 'Integration Test', status: 'Untested' },
        { id: 'TC-015', reqId: 'FR-040', title: 'Kiểm tra thông báo đẩy trên mobile', priority: 'Trung bình', type: 'System Testing', status: 'Untested' },
        { id: 'TC-016', reqId: 'FR-042', title: 'Xác thực mã OTP qua SMS', priority: 'Cao', type: 'UAT', status: 'Pass' },
        { id: 'TC-017', reqId: 'FR-045', title: 'Kiểm tra tính năng tìm kiếm nâng cao', priority: 'Trung bình', type: 'System Testing', status: 'Pass' },
        { id: 'TC-018', reqId: 'FR-048', title: 'Xử lý đa ngôn ngữ (i18n)', priority: 'Thấp', type: 'UAT', status: 'Pass' },
        { id: 'TC-019', reqId: 'FR-050', title: 'Kiểm tra giao diện Dark Mode', priority: 'Thấp', type: 'UAT', status: 'Pass' },
        { id: 'TC-020', reqId: 'FR-052', title: 'Xác thực phiên làm việc người dùng', priority: 'Cao', type: 'System Testing', status: 'Pass' },
        { id: 'TC-021', reqId: 'FR-055', title: 'Kiểm tra tính năng khôi phục dữ liệu', priority: 'Nghiêm trọng', type: 'System Testing', status: 'Untested' },
        { id: 'TC-022', reqId: 'FR-058', title: 'Tối ưu hóa tốc độ tải trang chủ', priority: 'Trung bình', type: 'System Testing', status: 'Pass' },
    ]);

    const addTemplate = (newTemplate: Template) => {
        setTemplates(prev => [...prev, newTemplate]);
    };

    const updateTemplate = (updatedTemplate: Template) => {
        setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    };

    const deleteTemplate = (id: string | number) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    const addProject = (newProject: Project) => {
        setProjects(prev => [...prev, newProject]);
    };

    const updateProject = (updatedProject: Project) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    const deleteProject = (id: string | number) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView projects={projects} templates={templates} testCases={testCases} generatedDocs={generatedDocs} onViewChange={setActiveView} />;
            case 'testing':
                return <TestingView testCases={testCases} onUpdateTestCases={setTestCases} />;
            case 'templates':
                return <TemplatesView templates={templates} onAddTemplate={addTemplate} onUpdateTemplate={updateTemplate} onDeleteTemplate={deleteTemplate} />;
            case 'workspace':
                return (
                    <AIWorkspaceView
                        templates={templates}
                        projects={projects}
                        onDocumentGenerated={(doc) => setGeneratedDocs(prev => [...prev, { ...doc, id: Date.now().toString() }])}
                    />
                );
            case 'setup':
                return <ProjectSetupView onAddProject={addProject} onViewChange={setActiveView} />;
            case 'projects':
                return (
                    <ProjectsView
                        projects={projects}
                        onAddProject={addProject}
                        onUpdateProject={updateProject}
                        onDeleteProject={deleteProject}
                    />
                );
            case 'settings':
                return <SettingsView theme={theme} onThemeChange={setTheme} />;
            default:
                return (
                    <DashboardView
                        projects={projects}
                        templates={templates}
                        testCases={testCases}
                        generatedDocs={generatedDocs}
                        onViewChange={setActiveView}
                    />
                );
        }
    };

    const getTitle = () => {
        switch (activeView) {
            case 'dashboard': return 'Bảng điều khiển';
            case 'testing': return 'Kiểm thử & Đảm bảo chất lượng';
            case 'templates': return 'Quản lý mẫu tài liệu';
            case 'workspace': return 'Không gian làm việc AI';
            case 'setup': return 'Thiết lập dự án mới';
            case 'projects': return 'Dự án của tôi';
            case 'settings': return 'Cài đặt';
            default: return '';
        }
    };

    return (
        <div className={`min-h-screen bg-background ${theme === 'dark' ? 'dark' : ''}`}>
            <Sidebar activeView={activeView} onViewChange={setActiveView} />

            <main className="ml-64 min-h-screen flex flex-col">
                {activeView !== 'workspace' && <TopBar title={getTitle()} onViewChange={setActiveView} />}

                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {renderView()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}