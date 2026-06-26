'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFamily, Task, Photo } from '@/context/FamilyContext';
import TaskModal from '@/components/TaskModal';
import PhotoModal from '@/components/PhotoModal';
import PhotoUploadModal from '@/components/PhotoUploadModal';

export default function Home() {
  const { activeMember, tasks, photos, members, loading } = useFamily();
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | undefined>(undefined);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        fontSize: '1.2rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>🔄</span>
          <span>Loading Family Hub...</span>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Filter tasks for today
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Today's tasks (family-wide)
  const todaysTasks = tasks.filter(t => t.dueDate === todayStr);

  // Active member's pending tasks
  const myPendingTasks = tasks.filter(t => 
    t.assignedTo.includes(activeMember.id) && t.status !== 'Completed'
  );

  // Get 3 most recent photos
  const recentPhotos = [...photos]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const getMemberInfo = (memberId: string) => {
    return members.find(m => m.id === memberId) || members[1];
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '1200px', margin: '0 auto', padding: '10px 0 40px 0' }}>
      
      {/* Greeting Widget */}
      <section 
        className="glass-panel" 
        style={{ 
          padding: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          background: 'linear-gradient(135deg, rgba(var(--member-color-rgb), 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)',
          borderColor: 'rgba(var(--member-color-rgb), 0.25)',
          boxShadow: '0 8px 32px 0 rgba(var(--member-color-rgb), 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ 
            fontSize: '3.5rem', 
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            {activeMember.avatar}
          </span>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>
              Hello, {activeMember.name}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Welcome back. You have <strong style={{ color: 'var(--member-color)' }}>{myPendingTasks.length} pending</strong> to-do tasks.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => {
              setSelectedTask(undefined);
              setIsTaskModalOpen(true);
            }}
            className="glass-button glass-button-primary"
            style={{ padding: '12px 20px', borderRadius: '12px' }}
          >
            ➕ Add Task
          </button>
          
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="glass-button"
            style={{ 
              padding: '12px 20px', 
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            📸 Upload Photo
          </button>
        </div>
      </section>

      {/* Grid: Tasks & Photo Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }} className="dashboard-grid">
        
        {/* Left Side: Today's Tasks */}
        <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📅 Today&apos;s Schedule
            </h2>
            <Link href="/calendar" style={{ fontSize: '0.85rem', color: 'var(--member-color)', fontWeight: 600 }}>
              View Full Calendar →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todaysTasks.length === 0 ? (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                color: 'var(--text-secondary)',
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px dashed rgba(255, 255, 255, 0.06)',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '8px' }}>🎉</span>
                No tasks scheduled for today. Relax!
              </div>
            ) : (
              todaysTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  className="glass-panel glass-panel-interactive"
                  style={{ 
                    padding: '16px', 
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    background: 'rgba(15, 23, 42, 0.35)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span 
                        style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          background: getPriorityColor(task.priority) 
                        }} 
                      />
                      <h3 style={{ 
                        fontSize: '1rem', 
                        fontWeight: 600,
                        textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                        color: task.status === 'Completed' ? 'var(--text-muted)' : '#ffffff'
                      }}>
                        {task.title}
                      </h3>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '2px 8px', 
                      borderRadius: '8px',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}>
                      {task.category}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {task.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {task.assignedTo.map(id => {
                        const m = getMemberInfo(id);
                        return (
                          <span 
                            key={id}
                            title={m.name}
                            style={{ 
                              fontSize: '1.1rem',
                              background: `rgba(${m.colorRgb}, 0.15)`,
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1px solid rgba(${m.colorRgb}, 0.3)`
                            }}
                          >
                            {m.avatar}
                          </span>
                        );
                      })}
                    </div>

                    <span style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      color: task.status === 'Completed' 
                        ? '#10b981' 
                        : task.status === 'InProgress' 
                          ? '#3b82f6' 
                          : 'var(--text-secondary)'
                    }}>
                      {task.status === 'Completed' ? '✅ Completed' : task.status === 'InProgress' ? '⚡ In Progress' : '📝 To Do'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Side: Recent Photos */}
        <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📸 Recent Memories
            </h2>
            <Link href="/gallery" style={{ fontSize: '0.85rem', color: 'var(--member-color)', fontWeight: 600 }}>
              View Gallery →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentPhotos.length === 0 ? (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                color: 'var(--text-secondary)',
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px dashed rgba(255, 255, 255, 0.06)',
                borderRadius: '12px'
              }}>
                No pictures uploaded yet. Capture a moment!
              </div>
            ) : (
              recentPhotos.map((photo) => {
                const up = getMemberInfo(photo.uploadedBy);
                return (
                  <div
                    key={photo.id}
                    onClick={() => {
                      setSelectedPhoto(photo);
                      setIsPhotoModalOpen(true);
                    }}
                    className="glass-panel glass-panel-interactive"
                    style={{ 
                      borderRadius: '12px',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      display: 'flex',
                      gap: '14px',
                      padding: '10px',
                      background: 'rgba(15, 23, 42, 0.35)'
                    }}
                  >
                    {/* Photo Thumb */}
                    <div style={{ 
                      width: '90px', 
                      height: '80px', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      flexShrink: 0,
                      background: '#030712',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={photo.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    {/* Metadata */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: '2px 0' }}>
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
                          {photo.title}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          By {up.name} • {photo.date}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '6px' }}>
                          #{photo.category}
                        </span>
                        
                        <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          ❤️ {photo.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(undefined);
        }} 
        taskToEdit={selectedTask}
      />

      {selectedPhoto && (
        <PhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => {
            setIsPhotoModalOpen(false);
            setSelectedPhoto(undefined);
          }}
          photo={selectedPhoto}
        />
      )}

      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <style jsx>{`
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
