const db = require("../models");
const User = db.users;
const Building = db.buildings;
const Room = db.rooms;
const Request = db.repairRequests;

const initialUsers = [
    { id: 'U1', name: 'Admin Hệ thống', email: 'admin@school.edu.vn', password: 'admin123', department: 'Phòng CNTT', role: 'ADMIN' },
    { id: 'U2', name: 'Nguyễn Văn Kỹ Thuật', email: 'tech@school.edu.vn', password: 'tech123', department: 'Tổ Kỹ thuật', role: 'TECH' },
    { id: 'U3', name: 'Trần Thị Đào Tạo', email: 'daotao@school.edu.vn', password: 'user123', department: 'Phòng Đào tạo', role: 'USER' },
    { id: 'U4', name: 'Lê Văn Thiết Bị', email: 'thietbi@school.edu.vn', password: 'user123', department: 'Phòng Quản trị Thiết bị', role: 'USER' },
];

const initialBuildings = [
    { id: 'B1', name: 'Tòa nhà A', code: 'TNA', description: 'Khu hiệu bộ và văn phòng' },
    { id: 'B2', name: 'Tòa nhà B', code: 'TNB', description: 'Khu giảng đường lý thuyết' },
    { id: 'B3', name: 'Tòa nhà C', code: 'TNC', description: 'Khu thực hành CNTT' },
];

const initialRooms = [
    { id: 'R1', buildingId: 'B1', roomNumber: 'A101', type: 'Văn phòng', floor: 1 },
    { id: 'R2', buildingId: 'B2', roomNumber: 'B202', type: 'Phòng học', floor: 2 },
    { id: 'R3', buildingId: 'B3', roomNumber: 'C305', type: 'Phòng máy', floor: 3 },
];

const initialRequests = [
    {
        id: 'REQ001',
        title: 'Máy chiếu phòng B102 không hoạt động',
        description: 'Máy chiếu không lên nguồn khi cắm điện. Đã thử kiểm tra dây cắm nhưng không được. Cần sửa chữa gấp cho buổi học chiều nay.',
        department: 'Phòng CNTT',
        location: 'Phòng B102, Tòa nhà B',
        status: 'Mới',
        priority: 'Khẩn cấp',
        submittedDate: new Date('2024-07-20T09:00:00'),
        imageUrl: 'https://picsum.photos/seed/projector/400/300',
    },
    {
        id: 'REQ002',
        title: 'Vòi nước ở toilet nam tầng 3 bị rò rỉ',
        description: 'Vòi nước bị rò rỉ liên tục, gây lãng phí nước và làm sàn nhà ẩm ướt, trơn trượt.',
        department: 'Phòng Quản trị Thiết bị', // Fixed from types.ts enum value
        location: 'Toilet nam, Tầng 3, Tòa nhà A',
        status: 'Đang xử lý',
        priority: 'Cao',
        submittedDate: new Date('2024-07-19T14:30:00'),
    },
    {
        id: 'REQ003',
        title: 'Bàn ghế phòng học C305 bị hỏng',
        description: 'Một số bộ bàn ghế bị gãy chân, không đảm bảo an toàn cho sinh viên.',
        department: 'Phòng Quản trị Thiết bị',
        location: 'Phòng C305, Tòa nhà C',
        status: 'Chờ xác nhận',
        priority: 'Trung bình',
        submittedDate: new Date('2024-07-21T08:15:00'),
        imageUrl: 'https://picsum.photos/seed/desk/400/300',
    },
];

exports.seed = async (req, res) => {
    try {
        // Determine if we should clear existing data
        const force = req.query.force === 'true';

        if (force) {
            await Request.destroy({ where: {}, truncate: true });
            await Room.destroy({ where: {}, truncate: true });
            await Building.destroy({ where: {}, truncate: true });
            await User.destroy({ where: {}, truncate: true });
        }

        // Check if data exists
        const userCount = await User.count();
        if (userCount === 0) {
            await User.bulkCreate(initialUsers);
            await Building.bulkCreate(initialBuildings);
            await Room.bulkCreate(initialRooms);
            await Request.bulkCreate(initialRequests);
            res.send({ message: "Database seeded successfully!" });
        } else {
            res.send({ message: "Database already has data. Use ?force=true to overwrite." });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
