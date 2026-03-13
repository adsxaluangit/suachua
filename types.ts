
export enum Status {
  New = 'Mới',
  InProgress = 'Đang xử lý',
  PendingConfirmation = 'Chờ xác nhận',
  Completed = 'Hoàn thành',
  Cancelled = 'Hủy',
}

export enum Priority {
  Low = 'Thấp',
  Medium = 'Trung bình',
  High = 'Cao',
  Critical = 'Khẩn cấp',
}

export enum Department {
  Academic = 'Phòng Đào Tạo',
  Finance = 'Phòng Kế hoạch - Tài chính',
  HR = 'Phòng Tổ chức - Hành chính',
  Clerical = 'Phòng Văn Thư',
  Quality = 'Phòng BĐCLĐT-HTQT',
  Marine = 'Khoa Khoa học Hàng hải',
  Electrical = 'Khoa Điện - Điện tử',
  Economy = 'Khoa Kinh tế - Công nghệ',
}

export enum Role {
  Admin = 'ADMIN',
  Tech = 'TECH',
  User = 'USER',
}

export interface DepartmentModel {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  department: Department; // Keeping for compatibility, but we might transition to model
  departmentId?: string;
  role: Role;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Room {
  id: string;
  buildingId: string;
  roomNumber: string;
  type: 'Phòng học' | 'Văn phòng' | 'Phòng máy' | 'Phòng Lab' | 'Khác';
  floor: number;
  department?: Department;
  buildingName?: string;
}

export interface RepairRequest {
  id: string;
  title: string;
  description: string;
  department: string; // Flattened for UI
  departmentId?: string;
  location: string; // Internal/Frontend use for roomNumber
  roomId?: string;
  status: Status;
  priority: Priority;
  submittedDate: Date;
  imageUrl?: string;
  requesterName?: string;
  requesterId?: string;
}
