
import React from 'react';
import { Status, Department, DepartmentModel } from '../types';

interface FilterControlsProps {
  filters: { status: string; department: string };
  setFilters: React.Dispatch<React.SetStateAction<{ status: string; department: string }>>;
  departments: DepartmentModel[];
  showDepartment?: boolean;
}

const FilterControls: React.FC<FilterControlsProps> = ({ filters, setFilters, departments, showDepartment = true }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#121212] p-5 rounded-2xl shadow-lg border border-gray-800 mb-8 flex flex-col sm:flex-row gap-6">
      <div className="flex-1">
        <label htmlFor="status" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
          Lọc theo Trạng thái
        </label>
        <select
          id="status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="w-full bg-[#1a1a1a] text-white p-3 border border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer"
        >
          <option value="All">Tất cả trạng thái</option>
          {Object.values(Status).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      {showDepartment && (
        <div className="flex-1">
          <label htmlFor="department" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
            Lọc theo Phòng ban
          </label>
          <select
            id="department"
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="w-full bg-[#1a1a1a] text-white p-3 border border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all cursor-pointer"
          >
            <option value="All">Tất cả phòng ban</option>
            {departments.length > 0 ? (
              departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)
            ) : (
              Object.values(Department).map(d => (
                <option key={d} value={d}>{d}</option>
              ))
            )}
          </select>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
