
import React from 'react';
import { RepairRequest } from '../types';
import RequestCard from './RequestCard';
import { FolderOpenIcon } from './Icons';

interface RequestListProps {
  requests: RepairRequest[];
  onEditRequest: (request: RepairRequest) => void;
}

const RequestList: React.FC<RequestListProps> = ({ requests, onEditRequest }) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-24 px-6 bg-[#121212] rounded-3xl border border-gray-800 shadow-xl animate-fadeIn">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderOpenIcon className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight">Dữ liệu trống</h3>
        <p className="mt-2 text-gray-500 font-medium">
          Không tìm thấy yêu cầu nào phù hợp với các tiêu chí lọc hiện tại.
        </p>
        <button onClick={() => window.location.reload()} className="mt-8 text-xs font-black text-orange-500 uppercase tracking-widest hover:text-white transition-colors">
            XÓA TẤT CẢ BỘ LỌC
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {requests.map(request => (
        <RequestCard key={request.id} request={request} onEdit={onEditRequest} />
      ))}
    </div>
  );
};

export default RequestList;
