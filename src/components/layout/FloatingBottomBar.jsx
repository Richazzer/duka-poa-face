import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  Bot, 
  User 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function FloatingBottomBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { path: '/app', icon: Home, label: 'Muhtasari', exact: true },
    { path: '/app/pos', icon: ShoppingCart, label: 'POS' },
    { path: '/app/products', icon: Package, label: 'Stock' },
    { path: '/app/customers', icon: Users, label: 'Wateja & Madeni' },
    { path: '/app/ai-manager', icon: Bot, label: 'AI Manager' },
  ];

  const isProfileActive = location.pathname === '/app/profile';

  return (
    <div className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none select-none">
      {/* 
        Exact Liquid Capsule from your photo:
        - Dark titanium slate glass with specular top highlight
      */}
      <nav className="pointer-events-auto h-[62px] px-3.5 bg-[#181f2a]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center gap-1.5 transition-all">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? location.pathname === item.path 
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                relative flex items-center justify-center rounded-full transition-all duration-300
                ${isActive
                  /* Exact pure white active circle from your photo */
                  ? 'w-12 h-12 bg-white text-slate-950 shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-105'
                  : 'w-11 h-11 text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-95'
                }
              `}
              title={item.label}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
            </NavLink>
          );
        })}

        {/* Subtle Slate Divider */}
        <div className="h-6 w-[1px] bg-slate-700/60 mx-1"></div>

        {/* Profile Button */}
        <button
          onClick={() => navigate('/app/profile')}
          className={`
            w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer
            ${isProfileActive
              ? 'bg-white text-slate-950 shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-95'
            }
          `}
          title="Profaili ya Duka"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <User className={`w-5 h-5 ${isProfileActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          )}
        </button>

      </nav>
    </div>
  );
}