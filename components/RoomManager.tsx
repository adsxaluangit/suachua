
import React, { useState, useEffect } from 'react';
import { Room, Building, DepartmentModel, Department } from '../types';
import { PencilIcon } from './Icons';

interface RoomManagerProps {
  rooms: Room[];
  buildings: Building[];
  departments: DepartmentModel[];
  onAdd: (room: Omit<Room, 'id'>) => void;
  onUpdate: (room: Room) => void;
  onDelete: (id: string) => void;
}

const RoomManager: React.FC<RoomManagerProps> = ({ rooms, buildings, departments, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Omit<Room, 'id'>>({
    buildingId: buildings[0]?.id || '',
    roomNumber: '',
    type: 'Phòng học',
    floor: 1,
    department: (departments[0]?.name || 'Phòng Đào tạo') as any
  });

  const handleEdit = (r: Room) => {
    setEditingRoom(r);
    setFormData({
      buildingId: r.buildingId,
      roomNumber: r.roomNumber,
      type: r.type,
      floor: r.floor,
      department: r.department
    });
    setIsAdding(true);
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      onUpdate({ ...editingRoom, ...formData });
    } else {
      onAdd(formData);
    }
    handleCancel();
  };

  const handleCancel = () => {
    setFormData({
      buildingId: buildings[0]?.id || '',
      roomNumber: '',
      type: 'Phòng học',
      floor: 1,
      department: (departments[0]?.name || 'Phòng Đào tạo') as any
    });
    setIsAdding(false);
    setEditingRoom(null);
  };

  const getBuildingName = (id: string) => buildings.find(b => b.id === id)?.name || 'N/A';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Danh mục Phòng</h2>
          <p className="text-gray-500 text-sm font-medium">Chi tiết sơ đồ vị trí các phòng chức năng.</p>
        </div>
        <button
          onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
          className={`${isAdding ? 'bg-gray-800 border border-gray-700' : 'bg-orange-600 hover:bg-orange-700'} text-white px-5 py-2.5 rounded-xl transition-all font-bold flex items-center shadow-lg`}
        >
          {isAdding ? 'Đóng form' : 'Thêm phòng mới'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-[#121212] p-6 rounded-2xl shadow-2xl border border-gray-800 space-y-5 animate-fadeIn">
          <h3 className="text-lg font-black text-orange-500 uppercase">{editingRoom ? 'Sửa thông tin phòng' : 'Thêm phòng vào hệ thống'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Dãy nhà*</label>
              <select
                required
                value={formData.buildingId}
                onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                className="mt-1 block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border outline-none cursor-pointer"
              >
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Số phòng*</label>
              <input
                required
                type="text"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="VD: A101"
                className="mt-1 block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Tầng*</label>
              <input
                required
                type="number"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                className="mt-1 block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Loại phòng*</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="mt-1 block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border outline-none cursor-pointer"
              >
                <option value="Phòng học">Phòng học</option>
                <option value="Văn phòng">Văn phòng</option>
                <option value="Phòng máy">Phòng máy</option>
                <option value="Phòng Lab">Phòng Lab</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Phòng ban quản lý*</label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                className="mt-1 block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 border outline-none cursor-pointer"
              >
                {departments.length > 0 ? (
                  departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)
                ) : (
                  <>
                    <option value="Phòng Đào tạo">Phòng Đào tạo</option>
                    <option value="Phòng CNTT">Phòng CNTT</option>
                    <option value="Phòng Quản trị Thiết bị">Phòng Quản trị Thiết bị</option>
                    <option value="Thư viện">Thư viện</option>
                    <option value="Phòng Công tác Sinh viên">Phòng Công tác Sinh viên</option>
                    <option value="Phòng Kế hoạch - Tài chính">Phòng Kế hoạch - Tài chính</option>
                    <option value="Tổ Kỹ thuật">Tổ Kỹ thuật</option>
                  </>
                )}
                <option value="Chưa cập nhật">Chưa cập nhật</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg active:scale-95">
              {editingRoom ? 'Cập nhật thay đổi' : 'Xác nhận thêm'}
            </button>
            {editingRoom && (
              <button type="button" onClick={handleCancel} className="px-8 py-3 bg-gray-800 text-gray-300 rounded-xl font-bold hover:bg-gray-700 transition-all border border-gray-700">Hủy</button>
            )}
          </div>
        </form>
      )}

      <div className="bg-[#121212] rounded-2xl shadow-xl overflow-hidden border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Số phòng</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Dãy nhà</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Tầng</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Loại</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Phòng ban</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rooms.map((r) => (
              <tr key={r.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-orange-500">{r.roomNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">{getBuildingName(r.buildingId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">Tầng {r.floor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${r.type === 'Phòng học' ? 'bg-green-600/10 text-green-500 border border-green-600/30' :
                    r.type === 'Văn phòng' ? 'bg-blue-600/10 text-blue-500 border border-blue-600/30' :
                      r.type === 'Phòng máy' ? 'bg-purple-600/10 text-purple-500 border border-purple-600/30' : 'bg-gray-600/10 text-gray-500 border border-gray-600/30'
                    }`}>
                    {r.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                  {r.department || 'Chưa cập nhật'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-3">
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-blue-400 hover:text-white bg-blue-900/20 p-2 rounded-xl transition-all border border-blue-900/40 hover:bg-blue-600"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
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

export default RoomManager;
