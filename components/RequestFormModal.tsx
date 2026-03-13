
import React, { useState, useEffect } from 'react';
import { RepairRequest, Status, Priority, Department, User, Role, Room, DepartmentModel } from '../types';
import { XMarkIcon } from './Icons';

interface RequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (requestData: Omit<RepairRequest, 'id' | 'submittedDate'> & { id?: string }) => void;
  onDeleteRequest?: (id: string) => void;
  request: RepairRequest | null;
  rooms: Room[];
  departments: DepartmentModel[];
  currentUser: User | null;
}

type FormData = Omit<RepairRequest, 'id' | 'submittedDate' | 'imageUrl'>;

const RequestFormModal: React.FC<RequestFormModalProps> = ({ isOpen, onClose, onSave, onDeleteRequest, request, rooms, departments, currentUser }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    department: Department.Academic,
    location: '',
    status: Status.New,
    priority: Priority.Medium,
  });
  const [imagePreview, setImagePreview] = useState<string | undefined>(request?.imageUrl);

  useEffect(() => {
    if (request) {
      setFormData({
        title: request.title,
        description: request.description,
        department: request.department,
        location: request.location,
        status: request.status,
        priority: request.priority,
      });
      setImagePreview(request.imageUrl);
    } else {
      const normalize = (s: any) => String(s || '').normalize('NFC').trim().toLowerCase();
      const loginName = normalize(currentUser?.name || (currentUser as any)?.username || '');
      const loginDept = normalize(currentUser?.department || '');

      let finalDeptName = Department.Academic;

      // ULTIMATE PRIORITY: Force TCHC for 'tchc' user
      if (loginName === 'tchc' || loginDept.includes('tổ chức') || loginDept.includes('hành chính')) {
        const found = departments.find(d => {
          const n = normalize(d.name);
          return n.includes('tổ chức') && n.includes('hành chính');
        });
        finalDeptName = found?.name || 'Phòng Tổ chức - Hành chính';
      } else {
        const matched = departments.find(d => normalize(d.name) === loginDept);
        finalDeptName = matched?.name || currentUser?.department || Department.Academic;
      }

      console.log(`🛠️ Resolved Form Dept for ${loginName}: ${finalDeptName}`);

      setFormData({
        title: '',
        description: '',
        department: finalDeptName,
        location: '',
        status: Status.New,
        priority: Priority.Medium,
      });
      setImagePreview(undefined);
    }
  }, [request, isOpen, departments, currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: request?.id,
      imageUrl: imagePreview,
    });
  };

  const handleConfirmCompletion = () => {
    onSave({
      ...formData,
      status: Status.Completed,
      id: request?.id,
      imageUrl: imagePreview,
    });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isTCHC = currentUser?.department?.toLowerCase().includes('tổ chức') && currentUser?.department?.toLowerCase().includes('hành chính');
  const isUser = currentUser?.role === Role.User;
  const isTech = currentUser?.role === Role.Tech;
  const isAdmin = currentUser?.role === Role.Admin;
  // If user has no valid department, allow them to select one even if they are a normal USER
  const hasInvalidDept = !departments.some(d => d.name === formData.department);
  const isManagement = isAdmin || isTech || isTCHC || hasInvalidDept;
  const isEditing = !!request;
  const isPending = request?.status === Status.PendingConfirmation;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#121212] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-2xl max-h-[95vh] flex flex-col border border-gray-800 animate-fadeInScale">
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-800">
          <h2 className="text-base font-black text-white uppercase tracking-tight">
            {isEditing ? 'Chi tiết Yêu cầu' : 'Tạo Yêu cầu Mới'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="px-5 py-3 space-y-3">
            {/* Banner xác nhận đặc biệt dành cho Phòng ban khi Kỹ thuật đã làm xong */}
            {isUser && isPending && (
              <div className="bg-purple-600/20 border border-purple-600/40 px-4 py-2.5 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <p className="text-purple-400 font-black text-xs uppercase tracking-wider">Kỹ thuật đã báo hoàn tất</p>
                  <p className="text-gray-400 text-[10px] font-medium">Vui lòng kiểm tra và xác nhận Nghiệm thu phiếu này.</p>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmCompletion}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-lg transition-all active:scale-95 whitespace-nowrap"
                >
                  Xác nhận Nghiệm thu
                </button>
              </div>
            )}

            <div className="bg-[#1a1a1a]/50 px-3 py-2 rounded-xl border border-gray-800/50 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Người gửi yêu cầu</p>
                <p className="text-xs font-bold text-white uppercase tracking-tight">
                  {currentUser?.name || 'N/A'}
                  <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md text-[10px] border border-blue-500/20">
                    {formData.department !== 'Chưa cập nhật' ? formData.department : (currentUser?.department || 'N/A')}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tiêu đề*</label>
              <input disabled={(isTech && !isAdmin) || (isUser && isEditing)} type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 px-3 py-2 border outline-none disabled:opacity-50 text-sm" />
            </div>
            <div>
              <label htmlFor="description" className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Mô tả chi tiết*</label>
              <textarea disabled={(isTech && !isAdmin) || (isUser && isEditing)} name="description" id="description" value={formData.description} onChange={handleChange} required rows={2} className="block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 px-3 py-2 border outline-none disabled:opacity-50 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="department" className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Phòng ban*</label>
                <select
                  disabled={!isManagement}
                  name="department"
                  id="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className={`block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm px-3 py-2 border outline-none ${!isManagement ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-orange-500'}`}
                >
                  {departments.length > 0 ? (
                    departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)
                  ) : (
                    Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Vị trí (Phòng)*</label>
                <select
                  disabled={(isTech && !isAdmin) || (isUser && isEditing)}
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 px-3 py-2 border outline-none disabled:opacity-50 cursor-pointer"
                >
                  <option value="">-- Chọn phòng --</option>
                  {(() => {
                    const normalize = (s: any) => String(s || '').normalize('NFC').trim().toLowerCase();
                    // FILTER BY THE DEPARTMENT SELECTED IN THE FORM
                    const selectedDept = normalize(formData.department);

                    const filteredRooms = rooms.filter(r => {
                      // Extract name from department relation or string
                      const deptName = typeof r.department === 'object' ? (r.department as any).name : r.department;
                      const roomDept = normalize(deptName);
                      return roomDept === selectedDept && selectedDept !== '';
                    });

                    console.log('🔗 Room Selection Filter:', {
                      formDept: formData.department,
                      normalizedFormDept: selectedDept,
                      totalRoomsAvailable: rooms.length,
                      matchedRoomsCount: filteredRooms.length,
                      firstRoomDeptRaw: rooms.length > 0 ? rooms[0].department : 'none'
                    });

                    return filteredRooms.map(r => (
                      <option key={r.id} value={r.roomNumber}>
                        {r.roomNumber} ({r.type}) - {(r as any).buildingName}
                      </option>
                    ));
                  })()}
                  {formData.location && !rooms.some(r => r.roomNumber === formData.location) && (
                    <option value={formData.location}>{formData.location}</option>
                  )}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="priority" className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Mức độ ưu tiên*</label>
                <select
                  disabled={isUser && isEditing && !isAdmin}
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className={`block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm px-3 py-2 border outline-none cursor-pointer transition-all ${isUser && isEditing && !isAdmin ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-orange-500 focus:border-orange-500'}`}
                >
                  {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {isUser && isEditing && !isAdmin && <p className="text-[10px] text-gray-500 mt-1.5 font-bold italic">Chỉ có thể thay đổi độ ưu tiên khi tạo phiếu mới.</p>}
              </div>
              <div>
                <label htmlFor="status" className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Trạng thái*</label>
                <select
                  disabled={(isUser && isEditing && !isAdmin) || (!isEditing && isUser)}
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="block w-full bg-[#1a1a1a] text-white border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 px-3 py-2 border outline-none cursor-pointer disabled:opacity-50"
                >
                  {Object.values(Status).map(s => {
                    // Nếu là User (Phòng ban yêu cầu)
                    if (isUser && !isAdmin) {
                      // Tạo mới: Chỉ được để là "Mới"
                      if (!isEditing) {
                        return s === Status.New ? <option key={s} value={s}>{s}</option> : null;
                      }
                      // Chỉnh sửa: User không được tự đổi trạng thái bằng dropdown này
                      // Họ dùng nút "Xác nhận Nghiệm thu" ở bên trên
                      return null;
                    }

                    // Nếu là Kỹ thuật
                    if (isTech && !isAdmin) {
                      // Kỹ thuật chỉ được chuyển sang 'Đang xử lý' hoặc 'Chờ duyệt' (Báo hoàn thành)
                      if (s === Status.InProgress || s === Status.PendingConfirmation || s === request?.status) {
                        return <option key={s} value={s}>{s}</option>;
                      }
                      return null;
                    }

                    return <option key={s} value={s}>{s}</option>;
                  })}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Hình ảnh minh họa</label>
              <div className="flex items-center justify-center px-4 py-3 border border-gray-700 border-dashed rounded-xl bg-[#1a1a1a]/50 hover:bg-[#1a1a1a] transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  {imagePreview ? (
                    <div className="relative group">
                      <img src={imagePreview} alt="Xem trước" className="h-12 w-auto rounded-lg border border-gray-700" />
                    </div>
                  ) : (
                    <svg className="h-7 w-7 text-gray-600" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {(!isTech || isAdmin) && (
                    <label htmlFor="file-upload" className="cursor-pointer font-black text-orange-500 hover:text-orange-400 text-xs underline decoration-orange-500/30">
                      <span>{imagePreview ? 'Đổi ảnh' : 'Tải ảnh lên'}</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                  )}
                  <span className="text-[10px] text-gray-600 font-bold">JPG, PNG &lt; 10MB</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center px-5 py-3 border-t border-gray-800 bg-[#0a0a0a] rounded-b-2xl">
            <button type="button" onClick={onClose} className="bg-transparent py-3 px-8 border border-gray-700 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
              Đóng
            </button>
            {isAdmin && isEditing && onDeleteRequest && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("❗ CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn phiếu yêu cầu này. Bạn có chắc chắn muốn xóa?")) {
                    onDeleteRequest(request!.id);
                  }
                }}
                className="ml-4 inline-flex justify-center py-3 px-6 border border-red-600/30 text-sm font-black uppercase tracking-wider rounded-xl text-red-500 bg-red-600/10 hover:bg-red-600 hover:text-white transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.255H8.084a2.25 2.25 0 0 1-2.244-2.255L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Xóa vĩnh viễn
              </button>
            )}
            {!(isUser && isEditing && !isAdmin) && (
              <button type="submit" className="ml-4 inline-flex justify-center py-3 px-10 border border-transparent text-sm font-black uppercase tracking-wider rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40 active:scale-95">
                {isEditing ? 'Lưu cập nhật' : 'Gửi yêu cầu'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestFormModal;
