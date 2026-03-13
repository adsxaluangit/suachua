
import React, { useState } from 'react';
import { INITIAL_USERS } from '../constants';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Import dynamically or assume it's available. 
      // Better to import at top level, but for this tool use, I'll update imports separately or include them here if I can.
      // I will assume I update imports in a separate step or I can use multi_replace.
      // Let's use multi_replace for safer editing including imports.
      const user = await import('../services/api').then(m => m.userService.login({ email, password }));
      onLogin(user);
    } catch (err: any) {
      setError('Email hoặc mật khẩu không chính xác.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full bg-[#121212] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-800 z-10 p-1">
        <div className="bg-[#121212] rounded-[2.4rem] p-10 border border-gray-800">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600/10 border border-orange-600/20 rounded-3xl mb-6 shadow-xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">School Care</h2>
            <p className="mt-3 text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Hệ thống bảo trì</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <div className="bg-red-500/10 border border-red-500/20 p-4 text-red-500 text-xs font-bold rounded-2xl text-center">{error}</div>}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Account (Email or Username)</label>
                <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-[#1a1a1a] text-white px-5 py-4 border border-gray-700 rounded-2xl outline-none" placeholder="daotao hoặc daotao@school.edu.vn" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full bg-[#1a1a1a] text-white px-5 py-4 border border-gray-700 rounded-2xl outline-none" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-4 px-4 rounded-2xl shadow-xl text-xs font-black uppercase tracking-[0.2em] text-white bg-orange-600 hover:bg-orange-700 transition-all">
              {isLoading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
            </button>
          </form>
          <div className="mt-12 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest border-t border-gray-800 pt-6">
            School Maintenance v2.1 RBAC
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
