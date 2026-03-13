
import React from 'react';
import { Status } from '../types';
import { STATUS_COLORS } from '../constants';

const StatusSettings: React.FC = () => {
  const statuses = Object.values(Status);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Quy trình Trạng thái</h2>
          <p className="text-gray-500 text-sm font-medium">Danh mục các giai đoạn xử lý yêu cầu kỹ thuật.</p>
        </div>
      </div>

      <div className="bg-[#121212] rounded-2xl shadow-xl overflow-hidden border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Tên trạng thái</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Hiển thị</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Ghi chú vận hành</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {statuses.map((status) => (
              <tr key={status} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-orange-500">{status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border bg-opacity-10 ${STATUS_COLORS[status]}`}>
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                  {status === Status.New && 'Yêu cầu vừa được gửi, đang chờ bộ phận kỹ thuật tiếp nhận.'}
                  {status === Status.InProgress && 'Nhân viên kỹ thuật đang trực tiếp xử lý tại hiện trường.'}
                  {status === Status.PendingConfirmation && 'Kỹ thuật đã xử lý xong. Chờ phòng ban yêu cầu kiểm tra và xác nhận nghiệm thu.'}
                  {status === Status.Completed && 'Phòng ban yêu cầu đã xác nhận hài lòng với kết quả sửa chữa.'}
                  {status === Status.Cancelled && 'Yêu cầu không được thực hiện do lý do khách quan.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-orange-600/10 p-5 rounded-2xl border border-orange-600/30">
        <p className="text-sm text-orange-400 font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          Mẹo: Để đảm bảo chất lượng, Kỹ thuật chỉ được báo "Chờ xác nhận", việc hoàn tất phiếu thuộc về Phòng ban yêu cầu.
        </p>
      </div>
    </div>
  );
};

export default StatusSettings;
