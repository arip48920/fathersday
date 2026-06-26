'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFamily } from '@/context/FamilyContext';
import ProfileSwitcher from './ProfileSwitcher';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { activeMember } = useFamily();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'To-Do Lists', path: '/tasks' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <header className="glass-panel" style={{ 
      margin: '20px 20px 0 20px', 
      padding: '12px 24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 90
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.8rem' }}>🏡</span>
        <span style={{ 
          fontSize: '1.4rem', 
          fontWeight: 800, 
          fontFamily: 'Outfit, sans-serif',
          background: 'linear-gradient(90deg, #f8fafc, var(--member-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'all 0.3s ease'
        }}>
          FamilyHub
        </span>
      </Link>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', gap: '8px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="nav-link-hover"
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Profile Swapper Widget */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid rgba(var(--member-color-rgb), 0.25)`,
            borderRadius: '99px',
            padding: '6px 14px 6px 8px',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.9rem',
            boxShadow: `0 0 15px rgba(var(--member-color-rgb), 0.05)`,
            transition: 'all 0.3s ease'
          }}
          className="active-profile-button"
        >
          <span style={{ 
            fontSize: '1.4rem', 
            background: `rgba(var(--member-color-rgb), 0.15)`, 
            borderRadius: '50%', 
            width: '32px', 
            height: '32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: `0 0 10px rgba(var(--member-color-rgb), 0.2)`
          }}>
            {activeMember.avatar}
          </span>
          <span>{activeMember.name}</span>
          <span style={{ 
            fontSize: '0.8rem', 
            opacity: 0.6,
            transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>
            ▼
          </span>
        </button>

        {showProfileMenu && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '48px',
            zIndex: 100,
            animation: 'fadeIn 0.2s ease'
          }}>
            <ProfileSwitcher onClose={() => setShowProfileMenu(false)} />
          </div>
        )}
      </div>

      <style jsx>{`
        .nav-link-hover:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.05);
        }
        .active-profile-button:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--member-color);
          box-shadow: 0 0 20px rgba(var(--member-color-rgb), 0.2);
        }
      `}</style>
    </header>
  );
};

export default Navbar;
