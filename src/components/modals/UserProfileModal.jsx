import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { logoutUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { User, Store, Phone, Mail, LogOut, Settings, Award, Sun, Moon } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate('/login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profaili ya Mfanyabiashara & Mipangilio">
      <div className="space-y-6 text-slate-800">
        
        {/* Profile Header Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4 relative overflow-hidden shadow-xs">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-300 shadow-md bg-white flex items-center justify-center shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-slate-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{user?.name || 'Richard Joseph'}</h3>
            <p className="text-xs text-slate-500">Duka Pooa Store Owner (Tanzania)</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-md bg-slate-200 text-[10px] font-bold text-slate-700 uppercase">
                {user?.role || 'Verified Owner'}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold">
                <Award className="w-3 h-3 text-slate-700" /> 5-Star Manager
              </span>
            </div>
          </div>
        </div>

        {/* Theme Switcher in Profile Settings */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Mwonekano wa Mfumo (Theme)</h4>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-200" />}
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {theme === 'light' ? 'White Theme (Clean Light)' : 'Dark Theme'}
                </p>
                <p className="text-xs text-slate-500">Badili mwonekano wa rangi za mfumo</p>
              </div>
            </div>
            <button 
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            >
              Badili kwenda {theme === 'light' ? 'Dark' : 'White'}
            </button>
          </div>
        </div>

        {/* Business Details Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">Taarifa za Biashara</h4>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs shadow-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-2"><Store className="w-4 h-4" /> Jina la Duka</span>
              <span className="font-bold text-slate-900">Duka Pooa General Store</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-200">
              <span className="text-slate-500 flex items-center gap-2"><Mail className="w-4 h-4" /> Barua Pepe</span>
              <span className="font-bold text-slate-900">{user?.email || 'richard@dukapooa.co.tz'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-500 flex items-center gap-2"><Phone className="w-4 h-4" /> Namba ya Simu</span>
              <span className="font-bold text-slate-900">+255 712 345 678</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-3">
          <Button 
            variant="secondary" 
            className="w-full justify-start text-xs font-bold py-3"
            onClick={() => { onClose(); navigate('/app/settings'); }}
          >
            <Settings className="w-4 h-4 text-slate-600" /> Mipangilio ya Kina (Settings)
          </Button>

          <Button 
            variant="danger" 
            className="w-full justify-start text-xs font-bold py-3 bg-rose-600 hover:bg-rose-700 text-white border-0"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 text-white" /> Toka Kwenye Mfumo (Logout)
          </Button>
        </div>

      </div>
    </Modal>
  );
}