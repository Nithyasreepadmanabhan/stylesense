import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Palette, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types/user';

export const RoleSwitcher: React.FC = () => {
  const { activeRole, setRole, currentUser } = useAuth();

  const roles: Array<{ id: UserRole; label: string; icon: React.ReactNode; color: string }> = [
    { id: 'user', label: 'User Persona', icon: <User className="w-3.5 h-3.5" />, color: 'from-amber-500 to-amber-700' },
    { id: 'designer', label: 'Designer Studio', icon: <Palette className="w-3.5 h-3.5" />, color: 'from-purple-500 to-indigo-700' },
    { id: 'admin', label: 'Admin Control', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'from-rose-500 to-red-700' }
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#16161A] border border-[#26262E] rounded-full shadow-inner">
      <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase px-2 hidden sm:inline">
        Mode:
      </span>
      {roles.map(r => (
        <button
          key={r.id}
          onClick={() => setRole(r.id)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
            activeRole === r.id
              ? 'bg-[#D4AF37] text-black shadow-md font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {r.icon}
          <span>{r.label.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  );
};
