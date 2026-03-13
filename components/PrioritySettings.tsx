
import React from 'react';
import { Priority } from '../types';
import { PRIORITY_COLORS } from '../constants';

const PrioritySettings: React.FC = () => {
  const priorities = Object.values(Priority);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Cấu hình Ưu tiên</h2>
          <p className="text-gray-500 text-sm font-medium">Quy định thời hạn xử lý (SLA) dựa trên mức độ quan trọng.</p>
        </div>
      </div>

      <div className="bg-[#121212] rounded-2xl shadow-xl overflow-hidden border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cấp độ</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Nhãn hiển thị</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cam kết thời gian (SLA)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {priorities.map((priority) => (
              <tr key={priority} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-white">{priority}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${PRIORITY_COLORS[priority]} bg-opacity-20`}>
                    {priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 font-bold">
                  {priority === Priority.Low && 'Trong vòng 7 ngày làm việc'}
                  {priority === Priority.Medium && 'Trong vòng 3 ngày làm việc'}
                  {priority === Priority.High && 'Trong vòng 24 giờ kể từ khi báo'}
                  {priority === Priority.Critical && <span className="text-red-500 animate-pulse uppercase tracking-widest">Xử lý khẩn cấp (&lt; 2 giờ)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrioritySettings;
