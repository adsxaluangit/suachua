
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { RepairRequest, Status, Department, Building, Room, User, Role, DepartmentModel } from './types';
import Header from './components/Header';
import RequestList from './components/RequestList';
import RequestFormModal from './components/RequestFormModal';
import FilterControls from './components/FilterControls';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import BuildingManager from './components/BuildingManager';
import RoomManager from './components/RoomManager';
import DepartmentManager from './components/DepartmentManager';
import StatusSettings from './components/StatusSettings';
import PrioritySettings from './components/PrioritySettings';
import UserManager from './components/UserManager';
import ReportDashboard from './components/ReportDashboard';
import { requestService, buildingService, roomService, userService, departmentService } from './services/api';

type ActiveTab = 'requests' | 'buildings' | 'rooms' | 'departments' | 'statuses' | 'priorities' | 'users' | 'reports';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('requests');

  // Data States
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<RepairRequest | null>(null);
  const [filters, setFilters] = useState<{ status: string; department: string }>({
    status: 'All',
    department: 'All',
  });
  const [dataError, setDataError] = useState<string | null>(null);

  // Load Data
  const loadData = useCallback(async () => {
    if (!currentUser) return;
    setDataError(null);
    console.log('📦 loadData started for user:', currentUser.email);
    try {
      console.log('📡 Fetching all datasets...');
      const [reqsRes, bldsRes, rmsRes, usrsRes, deptsRes] = await Promise.allSettled([
        requestService.getAll(),
        buildingService.getAll(),
        roomService.getAll(),
        userService.getAll(),
        departmentService.getAll()
      ]);

      const reqs = reqsRes.status === 'fulfilled' ? reqsRes.value : [];
      const blds = bldsRes.status === 'fulfilled' ? bldsRes.value : [];
      const rms = rmsRes.status === 'fulfilled' ? rmsRes.value : [];
      const usrs = usrsRes.status === 'fulfilled' ? usrsRes.value : [];
      const depts = deptsRes.status === 'fulfilled' ? deptsRes.value : [];

      let errorCount = 0;
      if (reqsRes.status === 'rejected') { console.error('❌ Requests fetch failed:', reqsRes.reason); errorCount++; }
      if (bldsRes.status === 'rejected') { console.error('❌ Buildings fetch failed:', bldsRes.reason); errorCount++; }
      if (rmsRes.status === 'rejected') { console.error('❌ Rooms fetch failed:', rmsRes.reason); errorCount++; }
      if (usrsRes.status === 'rejected') { console.error('❌ Users fetch failed:', usrsRes.reason); errorCount++; }
      if (deptsRes.status === 'rejected') { console.error('❌ Departments fetch failed:', deptsRes.reason); errorCount++; }

      if (errorCount > 0) {
        setDataError(`Đã có ${errorCount} lỗi xảy ra khi tải dữ liệu. Vui lòng kiểm tra quyền hạn hoặc đăng nhập lại.`);
      }

      console.log(`✅ Data summary: Req:${reqs?.length}, Bld:${blds?.length}, Room:${rms?.length}, User:${usrs?.length}, Dept:${depts?.length}`);

      // Transform dates and flatten relations
      const formattedRequests = (reqs || []).map((r: any) => ({
        ...r,
        submittedDate: new Date(r.submittedDate),
        department: r.department?.name || (typeof r.department === 'string' ? r.department : null) || 'Chưa rõ phòng ban',
        departmentId: r.department?.documentId || r.department?.id || r.departmentId,
        location: r.room?.roomNumber || r.room?.name || (typeof r.room === 'string' ? r.room : null) || 'Chưa rõ vị trí',
        roomId: r.room?.documentId || r.room?.id || r.roomId,
        requesterName: r.requester?.username || r.requester?.name || 'Vô danh',
        requesterId: r.requester?.documentId || r.requester?.id
      }));

      setRequests(formattedRequests);
      setBuildings(blds || []);
      setDepartments(depts || []);

      // Map relation objects to flat IDs for UI components which expect buildingId string
      const formattedRooms = (rms || []).map((r: any) => ({
        ...r,
        // Keep documentId explicitly (flattenStrapi may overwrite .id with .documentId but we ensure both)
        documentId: r.documentId || r.id,
        buildingId: r.building?.documentId || r.building?.id || r.buildingId,
        buildingName: r.building?.name || 'Khu vực khác',
        // Keep the department as a name string for display, but also preserve departmentDocId for lookups
        department: r.department?.name || (typeof r.department === 'string' ? r.department : ''),
        departmentDocId: r.department?.documentId || (typeof r.department === 'object' ? r.department?.id : null)
      }));
      console.log('  Formatted Rooms:', formattedRooms);
      setRooms(formattedRooms);

      const formattedUsers = (usrs || []).map((u: any) => ({
        ...u,
        department: u.department?.name || u.department
      }));
      setUsers(formattedUsers);
      console.log('📦 loadData complete. Buildings:', (blds || []).length, 'Rooms:', formattedRooms.length, 'Depts:', (depts || []).length);
    } catch (error) {
      console.error("❌ Failed to load data:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auth Handling
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);

      // PROACTIVE FIX: If user is TCHC but stuck with wrong department in localStorage
      const name = String(user.name || user.username || '').toLowerCase();
      if (name === 'tchc' && (user.department?.includes('Đào tạo') || user.department === 'Chưa cập nhật')) {
        console.log("🛠️ Proactively fixing TCHC department info...");
        user.department = 'Phòng Tổ chức - Hành chính';
        localStorage.setItem('currentUser', JSON.stringify(user));
      }

      setCurrentUser(user);
    }
  }, []);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('strapi_jwt');
    // Also clear the axios header
    import('./services/api').then(m => {
      delete m.default.defaults.headers.common['Authorization'];
    });
    setActiveTab('requests');
  }, []);

  // Requests Logic
  const handleOpenModal = useCallback((request: RepairRequest | null) => {
    setEditingRequest(request);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingRequest(null);
  }, []);

  const handleSaveRequest = useCallback(async (requestData: Omit<RepairRequest, 'id' | 'submittedDate'> & { id?: string }) => {
    try {
      // Find the real IDs for relations using normalized comparison to avoid NFC/NFD or whitespace issues
      const normalize = (s: any) => String(s || '').normalize('NFC').trim().toLowerCase();
      const targetDept = normalize(requestData.department);
      const targetRoom = normalize(requestData.location);

      const dept = departments.find(d => normalize(d.name) === targetDept);
      const room = rooms.find(r => normalize(r.roomNumber) === targetRoom);

      const payload = {
        title: requestData.title,
        description: requestData.description,
        status: requestData.status,
        priority: requestData.priority,
        department: dept?.documentId || dept?.id || requestData.departmentId || null,
        room: room?.documentId || room?.id || requestData.roomId || null,
        imageUrl: requestData.imageUrl || undefined,
        submittedDate: requestData.id ? undefined : new Date().toISOString(),
        requester: requestData.id ? undefined : (currentUser?.documentId || currentUser?.id || null)
      };

      console.log("💾 ATTEMPTING TO SAVE REQUEST:", {
        isUpdate: !!requestData.id,
        id: requestData.id,
        payload,
        rawData: { targetDept, targetRoom, deptFound: !!dept, roomFound: !!room }
      });

      if (!payload.room && !requestData.id) {
        console.warn("⚠️ Room ID not found in mapping, falling back to document search...");
        // Final fallback if normal find fails
        const fallbackRoom = rooms.find(r => normalize(r.roomNumber) === targetRoom);
        if (fallbackRoom) payload.room = fallbackRoom.documentId || fallbackRoom.id;
      }

      if (requestData.id) {
        await requestService.update(requestData.id, payload);
        loadData();
      } else {
        await requestService.create(payload);
        loadData();
      }
      handleCloseModal();
    } catch (error: any) {
      console.error("❌ Error saving request:", error);
      const msg = error.response?.data?.error?.message || error.message || "Lỗi không xác định";
      alert(`Không thể lưu yêu cầu: ${msg}`);
    }
  }, [handleCloseModal, currentUser, departments, rooms]);

  const handleDeleteRequest = useCallback(async (id: string) => {
    try {
      await requestService.delete(id);
      loadData();
      handleCloseModal();
      alert("Xóa phiếu yêu cầu thành công!");
    } catch (error: any) {
      console.error("❌ Error deleting request:", error);
      const msg = error.response?.data?.error?.message || error.message || "Lỗi không xác định";
      alert(`Không thể xóa yêu cầu: ${msg}`);
    }
  }, [handleCloseModal]);

  const handleAddUser = async (u: Omit<User, 'id'>) => {
    try {
      const normalize = (s: any) => String(s || '').normalize('NFC').trim().toLowerCase();
      const dept = departments.find(d => normalize(d.name) === normalize(u.department));
      // Strapi v5 users-permissions plugin often still requires numeric ID for relations
      const deptId = (dept as any)?.strapiId || dept?.id || null;
      console.log('🔗 Creating user with dept:', { deptName: u.department, deptFound: !!dept, deptId });
      const payload = { ...u, department: deptId };
      await userService.create(payload);
      loadData();
      alert("Tạo tài khoản thành công!");
    } catch (e: any) {
      console.error(e);
      alert("Lỗi khi tạo tài khoản: " + (e.response?.data?.error?.message || e.message));
    }
  };
  const handleUpdateUser = async (u: User) => {
    try {
      const normalize = (s: any) => String(s || '').normalize('NFC').trim().toLowerCase();
      const dept = departments.find(d => normalize(d.name) === normalize(u.department));
      const deptId = (dept as any)?.strapiId || dept?.id || null;
      const payload = {
        name: u.name,
        email: u.email,
        role: u.role,
        department: deptId
      };
      if (u.password && u.password !== 'user123') {
        (payload as any).password = u.password;
      }

      await userService.update(u.id, payload);
      loadData();
      alert("Cập nhật tài khoản thành công!");
    } catch (e: any) {
      console.error(e);
      alert("Lỗi khi cập nhật tài khoản: " + (e.response?.data?.error?.message || e.message));
    }
  };
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await userService.delete(id);
      loadData();
      alert("Xóa tài khoản thành công!");
    } catch (e: any) {
      console.error(e);
      alert("Lỗi khi xóa tài khoản: " + (e.response?.data?.error?.message || e.message));
    }
  };


  // Buildings/Rooms Logic
  const handleAddBuilding = async (b: Omit<Building, 'id'>) => {
    try {
      const newB = await buildingService.create(b);
      setBuildings([...buildings, newB]);
      alert("Thêm dãy nhà thành công!");
    } catch (e: any) {
      console.error(e);
      alert("Lỗi khi thêm dãy nhà: " + (e.response?.data?.error?.message || e.message));
    }
  };
  const handleUpdateBuilding = async (b: Building) => {
    try {
      // Explicitly construct payload for Strapi v5
      const payload = {
        name: b.name,
        code: b.code,
        description: b.description
      };

      await buildingService.update(b.id, payload);
      setBuildings(buildings.map(item => item.id === b.id ? b : item));
      alert("Cập nhật dãy nhà thành công!");
    } catch (e: any) {
      console.error("Update Building Error:", e);
      const serverError = e.response?.data?.error?.message;
      const errorDetails = e.response?.data?.error?.details;
      let msg = serverError || e.message;
      if (errorDetails) {
        msg += " (" + JSON.stringify(errorDetails) + ")";
      }
      alert("Lỗi khi cập nhật dãy nhà: " + msg);
    }
  };
  const handleDeleteBuilding = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dãy nhà này?")) return;
    try {
      await buildingService.delete(id);
      await loadData();
      alert("Xóa dãy nhà thành công!");
    } catch (e: any) {
      console.error(e);
      alert("Lỗi khi xóa dãy nhà: " + (e.response?.data?.error?.message || e.message));
    }
  };

  const handleAddDepartment = async (d: Omit<DepartmentModel, 'id'>) => {
    try {
      const newD = await departmentService.create(d);
      setDepartments([...departments, newD]);
      alert("Thêm phòng ban thành công!");
    } catch (e: any) {
      console.error(e);
      alert("Lỗi khi thêm phòng ban: " + (e.response?.data?.error?.message || e.message));
    }
  };
  const handleUpdateDepartment = async (d: DepartmentModel) => {
    try {
      // Explicitly construct payload
      const payload = {
        name: d.name,
        code: d.code,
        description: d.description
      };

      await departmentService.update(d.id, payload);
      setDepartments(departments.map(item => item.id === d.id ? d : item));
      alert("Cập nhật phòng ban thành công!");
    } catch (e: any) {
      console.error("Update Department Error:", e);
      const serverError = e.response?.data?.error?.message;
      const errorDetails = e.response?.data?.error?.details;
      let msg = serverError || e.message;
      if (errorDetails) {
        msg += " (" + JSON.stringify(errorDetails) + ")";
      }
      alert("Lỗi khi cập nhật phòng ban: " + msg);
    }
  };
  const handleDeleteDepartment = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng ban này?")) return;
    try {
      await departmentService.delete(id);
      await loadData();
      alert("Xóa phòng ban thành công!");
    } catch (e: any) {
      console.error(e);
      alert("Lỗi khi xóa phòng ban: " + (e.response?.data?.error?.message || e.message));
    }
  };

  const handleAddRoom = async (r: Omit<Room, 'id'>) => {
    try {
      const normalize = (s: any) => String(s || '').normalize('NFC').trim().toLowerCase();
      const targetDept = normalize(r.department);
      const dept = departments.find(d => normalize(d.name) === targetDept);

      // Map buildingId to building relation for Strapi
      const payload: any = {
        ...r,
        building: r.buildingId, // Strapi expects relation ID here
        department: dept?.documentId || dept?.id || null,
        floor: Number(r.floor) // Ensure number
      };

      delete payload.buildingId;

      if (!payload.building) {
        alert("Lỗi: Bạn phải chọn một dãy nhà.");
        return;
      }

      await roomService.create(payload);
      await loadData();
      alert("Thêm phòng thành công!");
    } catch (e: any) {
      console.error("Create Room Error Detailed:", e);
      if (e.response) {
        console.error("Response Data:", e.response.data);
        console.error("Response Status:", e.response.status);
      }
      if (e.response && e.response.status === 403) {
        alert("Lỗi: Bạn không có quyền thêm phòng. Vui lòng kiểm tra quyền (Permissions) trong Admin Panel cho role Authenticated.");
      } else {
        alert("Lỗi khi thêm phòng: " + (e.message || "Unknown error"));
      }
    }
  };
  const handleUpdateRoom = async (r: Room) => {
    try {
      const dept = departments.find(d => d.name === r.department);
      // Prepare payload for Strapi
      const payload: any = {
        roomNumber: r.roomNumber,
        type: r.type,
        floor: Number(r.floor),
        building: r.buildingId,
        department: dept?.id
      };

      console.log("Update Payload:", payload);

      await roomService.update(r.id, payload);
      await loadData();
      alert("Cập nhật phòng thành công!");
    } catch (e: any) {
      console.error("Update Room Error:", e);
      const serverError = e.response?.data?.error?.message;
      const errorDetails = e.response?.data?.error?.details;
      let msg = serverError || e.message;
      if (errorDetails) {
        msg += " (" + JSON.stringify(errorDetails) + ")";
      }
      alert("Lỗi khi cập nhật phòng: " + msg);
    }
  };
  const handleDeleteRoom = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;
    try {
      await roomService.delete(id);
      await loadData();
      alert("Xóa phòng thành công!");
    } catch (e: any) {
      console.error(e);
      alert("Lỗi khi xóa phòng: " + (e.response?.data?.error?.message || e.message));
    }
  };

  const filteredRequests = useMemo(() => {
    let result = requests;
    const isTCHC = currentUser?.department?.toLowerCase().includes('tổ chức') && currentUser?.department?.toLowerCase().includes('hành chính');
    // Nếu là phòng ban (USER), chỉ thấy phiếu của phòng ban mình (trừ TCHC)
    if (currentUser?.role === Role.User && !isTCHC) {
      result = result.filter(req => req.department === currentUser.department);
    }

    return result
      .filter(req => filters.status === 'All' || req.status === filters.status)
      .filter(req => filters.department === 'All' || req.department === filters.department)
      .sort((a, b) => b.submittedDate.getTime() - a.submittedDate.getTime());
  }, [requests, filters, currentUser]);

  if (!currentUser) return <Login onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'reports':
        return <ReportDashboard requests={requests} />;
      case 'users':
        return <UserManager users={users} departments={departments} onAdd={handleAddUser} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />;
      case 'buildings':
        return <BuildingManager buildings={buildings} onAdd={handleAddBuilding} onUpdate={handleUpdateBuilding} onDelete={handleDeleteBuilding} />;
      case 'rooms':
        return <RoomManager rooms={rooms} buildings={buildings} departments={departments} onAdd={handleAddRoom} onUpdate={handleUpdateRoom} onDelete={handleDeleteRoom} />;
      case 'departments':
        return <DepartmentManager departments={departments} onAdd={handleAddDepartment} onUpdate={handleUpdateDepartment} onDelete={handleDeleteDepartment} />;

      case 'statuses':
        return <StatusSettings />;
      case 'priorities':
        return <PrioritySettings />;
      default:
        const isTCHC = currentUser?.department?.toLowerCase().includes('tổ chức') && currentUser?.department?.toLowerCase().includes('hành chính');
        const isManagement = currentUser?.role === Role.Admin || currentUser?.role === Role.Tech || isTCHC;
        return (
          <>
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              departments={departments}
              showDepartment={isManagement}
            />
            <RequestList requests={filteredRequests} onEditRequest={handleOpenModal} />
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header onNewRequestClick={() => handleOpenModal(null)} onLogout={handleLogout} />
        <main className="flex-1 container mx-auto p-4 md:p-8 overflow-y-auto">
          {dataError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-bold">{dataError}</span>
              <button onClick={loadData} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider">Thử lại</button>
            </div>
          )}
          {renderContent()}
        </main>
      </div>

      {isModalOpen && (
        <RequestFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveRequest}
          onDeleteRequest={handleDeleteRequest}
          request={editingRequest}
          rooms={rooms}
          departments={departments}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;
