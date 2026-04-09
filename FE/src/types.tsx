export interface Template {
    id: string | number;
    title: string;
    desc: string;
    version: string;
    time: string;
    status: 'Đang hoạt động' | 'Bản nháp';
    color: string;
    iconName: string;
}

export interface Project {
    id: string | number;
    name: string;
    description: string;
    domain: string;
    status: 'Đang hoạt động' | 'Tạm dừng';
    createdAt: string;
}

export interface DocType {
    id: string;
    name: string;
}