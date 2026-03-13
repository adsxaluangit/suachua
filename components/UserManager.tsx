
import React, { useState } from 'react';
import { User, Role, DepartmentModel } from '../types';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from './Icons';

interface UserManagerProps {
    users: User[];
    departments: DepartmentModel[];
    onAdd: (user: Omit<User, 'id'>) => void;
    onUpdate: (user: User) => void;
    onDelete: (id: string) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ users, departments, onAdd, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState<Omit<User, 'id'>>({
        name: '',
        email: '',
        password: 'user123',
        department: '',
        role: Role.User
    });

    // Auto-select first department when list becomes available
    React.useEffect(() => {
        if (!formData.department && departments.length > 0) {
            setFormData(prev => ({ ...prev, department: departments[0].name as any }));
        }
    }, [departments, formData.department]);

    const handleOpenAdd = () => {
        setEditingUser(null);
        setFormData({
            name: '',
            email: '',
            password: 'user123',
            department: departments[0]?.name as any || '',
            role: Role.User
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: 'user123', // Default placeholder
            department: user.department,
            role: user.role
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            onUpdate({ ...formData, id: editingUser.id });
        } else {
            onAdd(formData);
        }
        setIsModalOpen(false);
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Quản lý Nhân sự</h1>
                    <p className="text-gray-500 font-medium italic text-sm mt-1">Hệ thống phân quyền: Người dùng & Kỹ thuật</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 font-black uppercase tracking-wider text-xs shadow-lg shadow-orange-900/40 transition-all active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Thêm thành viên</span>
                </button>
            </div>

            <div className="bg-[#121212] rounded-3xl border border-gray-800 p-6">
                <div className="relative mb-6">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 outline-none focus:border-orange-500 transition-colors font-bold"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-800">
                                <th className="px-4 py-4">Thành viên</th>
                                <th className="px-4 py-4">Phòng ban</th>
                                <th className="px-4 py-4">Vai trò</th>
                                <th className="px-4 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-black text-gray-400 group-hover:bg-orange-600/20 group-hover:text-orange-500 transition-colors">
                                                {user.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-white uppercase tracking-tight">{user.name}</div>
                                                <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 font-bold text-xs text-gray-400">
                                        {user.department}
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${user.role === Role.Tech
                                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            : (user.role === Role.Admin ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20')
                                            }`}>
                                            {user.role === Role.Tech ? 'Kỹ thuật' : (user.role === Role.Admin ? 'Quản trị' : 'Người dùng')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5 text-right space-x-2">
                                        <button onClick={() => handleOpenEdit(user)} className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(user.id)}
                                            disabled={user.role === Role.Admin}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-[60] p-4">
                    <div className="bg-[#121212] rounded-3xl border border-gray-800 w-full max-w-md animate-fadeInScale">
                        <div className="p-8 border-b border-gray-800">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                {editingUser ? 'Cập nhật thành viên' : 'Thêm thành viên mới'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Họ và tên*</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl p-3 border outline-none focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Email tài khoản*</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl p-3 border outline-none focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Mật khẩu mới (Tùy chọn)</label>
                                <input
                                    type="password"
                                    placeholder="Để trống nếu không đổi"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl p-3 border outline-none focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Phòng ban*</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                                    className="w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl p-3 border outline-none cursor-pointer"
                                >
                                    {departments.length === 0 && <option value="">Đang tải phòng ban...</option>}
                                    {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Vai trò (Role)*</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                    className="w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl p-3 border outline-none cursor-pointer text-orange-500 font-bold"
                                >
                                    <option value={Role.User}>Phòng ban (User) - Tạo và Nghiệm thu</option>
                                    <option value={Role.Tech}>Kỹ thuật (Tech) - Sửa và Báo xong</option>
                                </select>
                                <p className="mt-2 text-[10px] text-gray-500 italic font-medium">
                                    {formData.role === Role.User
                                        ? "• Có quyền tạo phiếu và ký duyệt hoàn thành (Nghiệm thu)."
                                        : "• Có quyền báo trạng thái Đang xử lý và Báo đã sửa xong."}
                                </p>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-white transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg shadow-orange-900/40 transition-all active:scale-95"
                                >
                                    {editingUser ? 'Lưu thay đổi' : 'Tạo tài khoản'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;
