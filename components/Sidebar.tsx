
import React from 'react';
import { BuildingOfficeIcon } from './Icons';
import { Role, User } from '../types';

type Tab = 'requests' | 'buildings' | 'rooms' | 'departments' | 'statuses' | 'priorities' | 'users' | 'reports';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser }) => {
  const isTCHC = currentUser?.department?.toLowerCase().normalize('NFC').includes('tổ chức') && currentUser?.department?.toLowerCase().normalize('NFC').includes('hành chính');
  const isAdmin = currentUser?.role === Role.Admin;
  const isTech = currentUser?.role === Role.Tech;

  // ONLY Admin gets full management access (Buildings, Rooms, etc.)
  const isManagement = isAdmin;
  // Techs and TCHC get specific access to tickets and reports
  const canSeeReports = isAdmin || isTech || isTCHC;

  const menuItems = [
    {
      id: 'requests' as Tab, label: 'Yêu cầu sửa chữa', visible: true, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375m1.875-1.875a3.375 3.375 0 0 1 6.75 0v2.25a3.375 3.375 0 0 1-6.75 0v-2.25Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25V1.5a2.25 2.25 0 0 0-2.25-2.25h-6A2.25 2.25 0 0 0 .75 1.5v21a2.25 2.25 0 0 0 2.25 2.25h6a2.25 2.25 0 0 0 2.25-2.25v-9.75" />
        </svg>
      )
    },
    { id: 'buildings' as Tab, label: 'Quản lý Dãy nhà', visible: isManagement, icon: <BuildingOfficeIcon className="w-5 h-5" /> },
    {
      id: 'rooms' as Tab, label: 'Quản lý Phòng', visible: isManagement, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5H3.75A1.5 1.5 0 0 1 2.25 19.5v-15A1.5 1.5 0 0 1 3.75 3Z" />
        </svg>
      )
    },
    {
      id: 'departments' as Tab, label: 'Phòng ban quản lý', visible: isManagement, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" />
        </svg>
      )
    },

    {
      id: 'statuses' as Tab, label: 'Trạng thái', visible: isManagement, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      id: 'priorities' as Tab, label: 'Mức độ ưu tiên', visible: isManagement, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      id: 'reports' as Tab, label: 'Báo cáo Thống kê', visible: canSeeReports, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      )
    },
    {
      id: 'users' as Tab, label: 'Quản lý User', visible: currentUser?.role === Role.Admin, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-2.123-7.674 4.125 4.125 0 0 0-4.622 3.868c0 1.057.273 2.07.754 2.952Zm-6-1.5c.66 0 1.289-.168 1.838-.465a5.25 5.25 0 0 0 3.587-4.505 5.25 5.25 0 0 0-4.593-5.59 5.25 5.25 0 0 0-5.92 4.634 5.25 5.25 0 0 0 4.312 5.66c.26.058.528.087.8.087ZM4.5 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-2.123-7.674 4.125 4.125 0 0 0-4.622 3.868c0 1.057.273 2.07.754 2.952Z" />
        </svg>
      )
    },
    {
      id: 'strapi' as any, label: 'Strapi Admin', visible: isManagement, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      ),
      onClick: () => window.open('http://localhost:1338/admin', '_blank')
    },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] text-white min-h-screen hidden lg:block sticky top-0 border-r border-gray-800">
      <div className="p-6">
        <div className="flex items-center space-x-2 text-orange-500 mb-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83m0 0a2.978 2.978 0 0 1-3.34-3.34L19 2l-2.83 2.83-6.06-6.06a2.978 2.978 0 0 1-3.34 3.34L2 19l2.83 2.83 6.06-6.06Z" />
          </svg>
          <span className="text-xl font-black tracking-tight uppercase">School Care</span>
        </div>
        <nav className="space-y-2">
          {menuItems.filter(item => item.visible).map((item) => (
            <button
              key={item.id}
              onClick={() => (item as any).onClick ? (item as any).onClick() : setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-0 w-full p-6 border-t border-gray-800 bg-[#0f0f0f]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-orange-600/20 border border-orange-600/40 flex items-center justify-center font-bold text-orange-500">
            {(currentUser?.name || 'U').substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{currentUser?.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser?.department}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
