
import { Status, Priority, Department, RepairRequest, Building, Room, User, Role } from './types';

export const STATUS_COLORS: { [key in Status]: string } = {
  [Status.New]: 'bg-blue-100 text-blue-800 border-blue-300',
  [Status.InProgress]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [Status.PendingConfirmation]: 'bg-purple-100 text-purple-800 border-purple-300',
  [Status.Completed]: 'bg-green-100 text-green-800 border-green-300',
  [Status.Cancelled]: 'bg-gray-100 text-gray-800 border-gray-300',
};

export const PRIORITY_COLORS: { [key in Priority]: string } = {
  [Priority.Low]: 'bg-gray-200 text-gray-800',
  [Priority.Medium]: 'bg-blue-200 text-blue-800',
  [Priority.High]: 'bg-orange-200 text-orange-800',
  [Priority.Critical]: 'bg-red-200 text-red-800',
};

export const INITIAL_USERS: User[] = [
  { id: 'U1', name: 'Admin Hệ thống', email: 'admin@school.edu.vn', password: 'admin123', department: Department.IT, role: Role.Admin },
  { id: 'U2', name: 'Nguyễn Văn Kỹ Thuật', email: 'tech@school.edu.vn', password: 'tech123', department: Department.Technical, role: Role.Tech },
  { id: 'U3', name: 'Trần Thị Đào Tạo', email: 'daotao@school.edu.vn', password: 'user123', department: Department.Academic, role: Role.User },
  { id: 'U4', name: 'Lê Văn Thiết Bị', email: 'thietbi@school.edu.vn', password: 'user123', department: Department.Facilities, role: Role.User },
];

export const INITIAL_BUILDINGS: Building[] = [
  { id: 'B1', name: 'Tòa nhà A', code: 'TNA', description: 'Khu hiệu bộ và văn phòng' },
  { id: 'B2', name: 'Tòa nhà B', code: 'TNB', description: 'Khu giảng đường lý thuyết' },
  { id: 'B3', name: 'Tòa nhà C', code: 'TNC', description: 'Khu thực hành CNTT' },
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'R1', buildingId: 'B1', roomNumber: 'A101', type: 'Văn phòng', floor: 1 },
  { id: 'R2', buildingId: 'B2', roomNumber: 'B202', type: 'Phòng học', floor: 2 },
  { id: 'R3', buildingId: 'B3', roomNumber: 'C305', type: 'Phòng máy', floor: 3 },
];

export const INITIAL_REQUESTS: RepairRequest[] = [
  {
    id: 'REQ001',
    title: 'Máy chiếu phòng B102 không hoạt động',
    description: 'Máy chiếu không lên nguồn khi cắm điện. Đã thử kiểm tra dây cắm nhưng không được. Cần sửa chữa gấp cho buổi học chiều nay.',
    department: Department.IT,
    location: 'Phòng B102, Tòa nhà B',
    status: Status.New,
    priority: Priority.Critical,
    submittedDate: new Date('2024-07-20T09:00:00'),
    imageUrl: 'https://picsum.photos/seed/projector/400/300',
  },
  {
    id: 'REQ002',
    title: 'Vòi nước ở toilet nam tầng 3 bị rò rỉ',
    description: 'Vòi nước bị rò rỉ liên tục, gây lãng phí nước và làm sàn nhà ẩm ướt, trơn trượt.',
    department: Department.Facilities,
    location: 'Toilet nam, Tầng 3, Tòa nhà A',
    status: Status.InProgress,
    priority: Priority.High,
    submittedDate: new Date('2024-07-19T14:30:00'),
  },
  {
    id: 'REQ003',
    title: 'Bàn ghế phòng học C305 bị hỏng',
    description: 'Một số bộ bàn ghế bị gãy chân, không đảm bảo an toàn cho sinh viên.',
    department: Department.Facilities,
    location: 'Phòng C305, Tòa nhà C',
    status: Status.PendingConfirmation,
    priority: Priority.Medium,
    submittedDate: new Date('2024-07-21T08:15:00'),
    imageUrl: 'https://picsum.photos/seed/desk/400/300',
  },
];
