'use client';

import React, { useRef, useEffect } from 'react';
import { useFamily, FamilyMember } from '@/context/FamilyContext';

interface ProfileSwitcherProps {
  onClose: () => void;
}

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ onClose }) => {
  const { members, activeMember, setActiveMemberId } = useFamily();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="glass-panel"
      style={{
        padding: '16px',
        width: '260px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ 
        fontSize: '0.8rem', 
        fontWeight: 600, 
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        paddingBottom: '4px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        Who are you?
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {members.map((member) => {
          const isActive = member.id === activeMember.id;
          return (
            <button
              key={member.id}
              onClick={() => {
                setActiveMemberId(member.id);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: isActive ? `1px solid ${member.color}` : '1px solid transparent',
                background: isActive 
                  ? `rgba(${member.colorRgb}, 0.12)` 
                  : 'rgba(255, 255, 255, 0.02)',
                color: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? `0 0 15px rgba(${member.colorRgb}, 0.08)` : 'none'
              }}
              className="profile-item-btn"
              // Custom property for styling hover states
              data-hover-color={member.color}
              data-hover-rgb={member.colorRgb}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: '1.5rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: `rgba(${member.colorRgb}, 0.15)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? `0 0 8px rgba(${member.colorRgb}, 0.2)` : 'none'
                }}>
                  {member.avatar}
                </span>
                <div>
                  <div style={{ fontWeight: isActive ? 600 : 500, fontSize: '0.95rem' }}>{member.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {member.role}
                  </div>
                </div>
              </div>
              
              {isActive && (
                <span style={{ 
                  color: member.color, 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  background: `rgba(${member.colorRgb}, 0.15)`,
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <style jsx>{`
        .profile-item-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
};

export default ProfileSwitcher;
