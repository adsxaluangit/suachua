
import React, { useMemo } from 'react';
import { RepairRequest, Status, Priority } from '../types';

interface ReportDashboardProps {
  requests: RepairRequest[];
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ requests }) => {
  const stats = useMemo(() => {
    const total = requests.length;
    const completed = requests.filter(r => r.status === Status.Completed).length;
    const pending = requests.filter(r => r.status === Status.New || r.status === Status.InProgress || r.status === Status.PendingConfirmation).length;
    
    const byStatus = Object.values(Status).reduce((acc, status) => {
      acc[status] = requests.filter(r => r.status === status).length;
      return acc;
    }, {} as Record<Status, number>);

    const byPriority = Object.values(Priority).reduce((acc, priority) => {
      acc[priority] = requests.filter(r => r.priority === priority).length;
      return acc;
    }, {} as Record<Priority, number>);

    return { total, completed, pending, byStatus, byPriority };
  }, [requests]);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const handleExportExcel = () => {
    const fileName = `Bao_cao_sua_chua_${new Date().toISOString().split('T')[0]}.xls`;
    
    // Style cho bảng Excel
    const styles = `
      <style>
        .title { font-size: 18pt; font-weight: bold; text-align: center; color: #f97316; }
        .stats-label { font-weight: bold; background-color: #f3f4f6; }
        .header { background-color: #2563eb; color: #ffffff; font-weight: bold; border: 1pt solid #000000; }
        .cell { border: 0.5pt solid #cccccc; padding: 5px; }
        .priority-critical { color: #ef4444; font-weight: bold; }
        .priority-high { color: #f97316; font-weight: bold; }
        .status-completed { color: #16a34a; font-weight: bold; }
      </style>
    `;

    // Phần đầu báo cáo
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-type" content="text/html;charset=utf-8" />
        ${styles}
      </head>
      <body>
        <table>
          <tr><td colspan="7" class="title">BÁO CÁO HOẠT ĐỘNG BẢO TRÌ SỬA CHỮA</td></tr>
          <tr><td colspan="7" style="text-align: center;">Ngày xuất: ${new Date().toLocaleString('vi-VN')}</td></tr>
          <tr><td></td></tr>
          
          <tr>
            <td class="stats-label">Tổng số phiếu:</td>
            <td>${stats.total}</td>
            <td class="stats-label">Đã hoàn thành:</td>
            <td>${stats.completed}</td>
            <td class="stats-label">Tỉ lệ:</td>
            <td>${completionRate}%</td>
          </tr>
          <tr><td></td></tr>

          <thead>
            <tr>
              <th class="header">Mã phiếu</th>
              <th class="header">Tiêu đề</th>
              <th class="header">Phòng ban</th>
              <th class="header">Vị trí</th>
              <th class="header">Trạng thái</th>
              <th class="header">Độ ưu tiên</th>
              <th class="header">Ngày gửi</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Dữ liệu bảng
    requests.forEach(req => {
      const priorityClass = req.priority === Priority.Critical ? 'priority-critical' : (req.priority === Priority.High ? 'priority-high' : '');
      const statusClass = req.status === Status.Completed ? 'status-completed' : '';

      html += `
        <tr>
          <td class="cell">${req.id}</td>
          <td class="cell">${req.title}</td>
          <td class="cell">${req.department}</td>
          <td class="cell">${req.location}</td>
          <td class="cell ${statusClass}">${req.status}</td>
          <td class="cell ${priorityClass}">${req.priority}</td>
          <td class="cell">${new Date(req.submittedDate).toLocaleDateString('vi-VN')}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Tạo Blob và tải về
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Báo cáo Hoạt động</h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Phân tích hiệu suất bảo trì hệ thống</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl flex items-center space-x-3 transition-all active:scale-95 shadow-lg shadow-green-900/20 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="text-xs font-black uppercase tracking-widest">Xuất Bảng Excel</span>
          </button>

          <div className="bg-[#121212] border border-gray-800 px-6 py-3 rounded-2xl flex items-center space-x-4">
              <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Tỉ lệ hoàn thành</p>
                  <p className="text-2xl font-black text-orange-500">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-gray-800 border-t-orange-500 flex items-center justify-center rotate-45">
                   <span className="text-[10px] font-black -rotate-45 text-white">{completionRate}%</span>
              </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121212] p-6 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Tổng số yêu cầu</p>
          <p className="text-4xl font-black text-white">{stats.total}</p>
          <div className="mt-4 h-1 w-12 bg-blue-600 rounded-full"></div>
        </div>

        <div className="bg-[#121212] p-6 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Đã hoàn tất</p>
          <p className="text-4xl font-black text-green-500">{stats.completed}</p>
          <div className="mt-4 h-1 w-12 bg-green-600 rounded-full"></div>
        </div>

        <div className="bg-[#121212] p-6 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Đang xử lý/Chờ</p>
          <p className="text-4xl font-black text-orange-500">{stats.pending}</p>
          <div className="mt-4 h-1 w-12 bg-orange-600 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#121212] rounded-3xl border border-gray-800 p-8">
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-8 flex items-center">
            <span className="w-2 h-6 bg-orange-600 rounded-full mr-3"></span>
            Phân bổ theo Trạng thái
          </h3>
          <div className="space-y-6">
            {Object.entries(stats.byStatus).map(([status, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400 uppercase tracking-widest">{status}</span>
                    <span className="text-white">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#121212] rounded-3xl border border-gray-800 p-8">
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-8 flex items-center">
            <span className="w-2 h-6 bg-red-600 rounded-full mr-3"></span>
            Phân bổ theo Độ ưu tiên
          </h3>
          <div className="space-y-6">
            {Object.entries(stats.byPriority).map(([priority, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              let barColor = 'bg-gray-600';
              if (priority === Priority.Critical) barColor = 'bg-red-600';
              if (priority === Priority.High) barColor = 'bg-orange-500';
              if (priority === Priority.Medium) barColor = 'bg-blue-500';

              return (
                <div key={priority} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400 uppercase tracking-widest">{priority}</span>
                    <span className="text-white">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${barColor} transition-all duration-1000`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-600/30 p-8 rounded-3xl">
          <div className="flex items-center space-x-6">
              <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-900/40">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
              </div>
              <div>
                  <h4 className="text-white font-black uppercase tracking-tight">Gợi ý vận hành</h4>
                  <p className="text-gray-400 text-sm mt-1">
                      {stats.byPriority[Priority.Critical] > 0 
                        ? `Đang có ${stats.byPriority[Priority.Critical]} yêu cầu khẩn cấp cần xử lý ngay lập tức để đảm bảo SLA.` 
                        : "Tất cả các yêu cầu khẩn cấp đã được xử lý. Tiếp tục tập trung vào các yêu cầu có độ ưu tiên cao."}
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
