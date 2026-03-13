
import React, { useState, useEffect } from 'react';
import { DepartmentModel } from '../types';
import { PencilIcon } from './Icons';

interface DepartmentManagerProps {
    departments: DepartmentModel[];
    onAdd: (dept: Omit<DepartmentModel, 'id'>) => void;
    onUpdate: (dept: DepartmentModel) => void;
    onDelete: (id: string) => void;
}

const DepartmentManager: React.FC<DepartmentManagerProps> = ({ departments, onAdd, onUpdate, onDelete }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingDept, setEditingDept] = useState<DepartmentModel | null>(null);
    const [formData, setFormData] = useState({ name: '', code: '', description: '' });

    const handleEdit = (d: DepartmentModel) => {
        setEditingDept(d);
        setFormData({
            name: d.name,
            code: d.code || '',
            description: d.description || ''
        });
        setIsAdding(true);
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDept) {
            onUpdate({ ...editingDept, ...formData });
        } else {
            onAdd(formData);
        }
        handleCancel();
    };

    const handleCancel = () => {
        setFormData({ name: '', code: '', description: '' });
        setIsAdding(false);
        setEditingDept(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Phòng ban quản lý</h2>
                    <p className="text-gray-500 text-sm font-medium">Danh sách các đơn vị, phòng ban trong trường.</p>
                </div>
                <button
                    onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
                    className={`${isAdding ? 'bg-gray-800 border border-gray-700' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/20'} text-white px-5 py-2.5 rounded-xl transition-all font-bold flex items-center shadow-lg`}
                >
                    {isAdding ? 'Đóng form' : 'Thêm phòng ban mới'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-[#121212] p-6 rounded-2xl shadow-2xl border border-gray-800 space-y-5 animate-fadeIn">
                    <h3 className="text-lg font-black text-orange-500 uppercase">{editingDept ? 'Cập nhật phòng ban' : 'Thêm phòng ban'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Tên phòng ban*</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="VD: Phòng Đào tạo"
                                className="mt-1 block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Mã ký hiệu</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="VD: PDT"
                                className="mt-1 block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                            placeholder="Ghi chú thêm về phòng ban..."
                            className="mt-1 block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border outline-none"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                            {editingDept ? 'Lưu cập nhật' : 'Xác nhận lưu'}
                        </button>
                        {editingDept && (
                            <button type="button" onClick={handleCancel} className="px-8 py-3 bg-gray-800 text-gray-300 rounded-xl font-bold hover:bg-gray-700 transition-all border border-gray-700">Hủy</button>
                        )}
                    </div>
                </form>
            )}

            <div className="bg-[#121212] rounded-2xl shadow-xl overflow-hidden border border-gray-800">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-[#1a1a1a]">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Mã</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Tên phòng ban</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Mô tả</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {departments.map((d) => (
                            <tr key={d.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-orange-500">{d.code || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">{d.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-400 font-medium">{d.description || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end items-center space-x-3">
                                        <button
                                            onClick={() => handleEdit(d)}
                                            className="text-blue-400 hover:text-white bg-blue-900/20 p-2 rounded-xl transition-all border border-blue-900/40 hover:bg-blue-600"
                                            title="Chỉnh sửa"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(d.id)}
                                            className="text-red-400 hover:text-white bg-red-900/20 p-2 rounded-xl transition-all border border-red-900/40 hover:bg-red-600"
                                            title="Xóa"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.255H8.084a2.25 2.25 0 0 1-2.244-2.255L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DepartmentManager;
