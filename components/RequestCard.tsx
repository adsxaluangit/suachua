
import React from 'react';
import { RepairRequest } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';
import { CalendarIcon, MapPinIcon, BuildingOfficeIcon } from './Icons';

interface RequestCardProps {
  request: RepairRequest;
  onEdit: (request: RepairRequest) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onEdit }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Khẩn cấp': return '#ef4444';
      case 'Cao': return '#f97316';
      case 'Trung bình': return '#3b82f6';
      default: return '#64748b';
    }
  }

  return (
    <div
      onClick={() => onEdit(request)}
      className="bg-[#121212] rounded-2xl shadow-xl hover:shadow-orange-900/10 transition-all duration-300 cursor-pointer border border-gray-800 hover:border-orange-500/50 group overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <span
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${STATUS_COLORS[request.status]
              } border bg-opacity-10`}
          >
            {request.status}
          </span>
          <span
            className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            style={{ backgroundColor: getPriorityColor(request.priority) }}
            title={`Mức độ: ${request.priority}`}
          ></span>
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors truncate mb-3">{request.title}</h3>

        {request.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden h-44 border border-gray-800">
            <img src={request.imageUrl} alt={request.title} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110" />
          </div>
        )}

        <div className="space-y-2.5 text-xs text-gray-400 font-medium">
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-4 h-4 mr-2 text-orange-500" />
            <span className="truncate">{request.department}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2 text-orange-500" />
            <span className="truncate">{request.location}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-orange-500" />
            <span>{formatDate(request.submittedDate)}</span>
          </div>
          <div className="flex items-center pt-1 border-t border-gray-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Người tạo: <span className="text-gray-300">{request.requesterName}</span></span>
          </div>
        </div>
      </div>
      <div className="bg-[#1a1a1a] px-5 py-3 text-right border-t border-gray-800 flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Priority: {request.priority}</span>
        <span className="text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform inline-flex items-center">
          CHI TIẾT <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default RequestCard;
