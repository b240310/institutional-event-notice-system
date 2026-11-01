import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Bell,
  Calendar,
  PlusCircle,
  BookmarkCheck,
  User,
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isFacultyOrAdmin = user?.role === 'admin' || user?.role === 'faculty';

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'faculty', 'student']
    },
    {
      to: '/notices',
      label: 'Notice Board',
      icon: Bell,
      roles: ['admin', 'faculty', 'student']
    },
    {
      to: '/notices/create',
      label: 'Post Notice',
      icon: PlusCircle,
      roles: ['admin', 'faculty']
    },
    {
      to: '/events',
      label: 'Campus Events',
      icon: Calendar,
      roles: ['admin', 'faculty', 'student']
    },
    {
      to: '/events/create',
      label: 'Create Event',
      icon: PlusCircle,
      roles: ['admin', 'faculty']
    },
    {
      to: '/my-registrations',
      label: 'My Registrations',
      icon: BookmarkCheck,
      roles: ['student', 'faculty', 'admin']
    },
    {
      to: '/profile',
      label: 'My Profile',
      icon: User,
      roles: ['admin', 'faculty', 'student']
    }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <GraduationCap size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            CampusConnect
          </h2>
          <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Event & Notice Hub
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

      <div className="sidebar-footer">
        <div
          style={{
            background: '#1e293b',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}
        >
          <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.2rem' }}>
            {user?.name}
          </div>
          <div style={{ textTransform: 'capitalize' }}>
            {user?.role} • {user?.department}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

