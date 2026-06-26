'use client';

import React, { useState } from 'react';
import { useFamily, Task, FamilyMember } from '@/context/FamilyContext';
import TaskModal from '@/components/TaskModal';

export default function TasksPage() {
  const { tasks, members, activeMember, updateTask, loading } = useFamily();
  
  const [filterMemberId, setFilterMemberId] = useState<string>(activeMember.id); // Default to current active user
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        Loading Tasks...
      </div>
    );
  }

  // Filter tasks based on selected family member
  const filteredTasks = tasks.filter((task) => {
    return filterMemberId === 'all' || task.assignedTo.includes(filterMemberId);
  });

  // Split tasks by column
  const todoTasks = filteredTasks.filter(t => t.status === 'Todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'InProgress');
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed');

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

  // Quick status updates
  const moveTaskStatus = (task: Task, newStatus: Task['status']) => {
    updateTask({ ...task, status: newStatus });
  };

  const getDaysRemainingText = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr + 'T00:00:00');
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '📅 Due Today';
    if (diffDays === 1) return '📅 Due Tomorrow';
    if (diffDays === -1) return '⚠️ Overdue by 1 day';
    if (diffDays < -1) return `⚠️ Overdue by ${Math.abs(diffDays)} days`;
    return `📅 Due in ${diffDays} days`;
  };

  const activeFilterMember = members.find(m => m.id === filterMemberId) || activeMember;

  const renderColumn = (title: string, icon: string, taskList: Task[], statusType: Task['status']) => {
    return (
      <div 
        className="glass-panel" 
        style={{ 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          background: 'rgba(15, 23, 42, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          minHeight: '500px'
        }}
      >
        {/* Column Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
          <h2 style={{ fontSize: '1.15rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{icon}</span>
            <span>{title}</span>
          </h2>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            background: 'rgba(255,255,255,0.05)', 
            padding: '2px 8px', 
            borderRadius: '10px',
            color: 'var(--text-secondary)'
          }}>
            {taskList.length}
          </span>
        </div>

        {/* Task Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          {taskList.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px', 
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              border: '1px dashed rgba(255,255,255,0.04)',
              borderRadius: '12px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.05)'
            }}>
              No tasks in this column
            </div>
          ) : (
            taskList.map((task) => (
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
                  background: 'rgba(15, 23, 42, 0.45)',
                  borderLeft: `3px solid ${getPriorityColor(task.priority)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <h3 style={{ 
                    fontSize: '0.95rem', 
                    fontWeight: 600,
                    textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                    color: task.status === 'Completed' ? 'var(--text-muted)' : '#ffffff'
                  }}>
                    {task.title}
                  </h3>
                  <span style={{
                    fontSize: '0.7rem',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-secondary)',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}>
                    {task.category}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {task.description}
                </p>

                <div style={{ fontSize: '0.78rem', color: task.status === 'Completed' ? 'var(--text-muted)' : '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px', margin: '4px 0' }}>
                  {getDaysRemainingText(task.dueDate)}
                </div>

                {/* Footer of Card */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  paddingTop: '10px',
                  marginTop: '4px'
                }}>
                  {/* Assignees */}
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {task.assignedTo.map(id => {
                      const m = getMemberInfo(id);
                      return (
                        <span 
                          key={id}
                          title={m.name}
                          style={{ 
                            fontSize: '1rem',
                            background: `rgba(${m.colorRgb}, 0.15)`,
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid rgba(${m.colorRgb}, 0.2)`
                          }}
                        >
                          {m.avatar}
                        </span>
                      );
                    })}
                  </div>

                  {/* Move Task Buttons */}
                  <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                    {statusType === 'Todo' && (
                      <>
                        <button
                          onClick={() => moveTaskStatus(task, 'InProgress')}
                          title="Start Task"
                          className="status-btn"
                          style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}
                        >
                          ⚡ Start
                        </button>
                        <button
                          onClick={() => moveTaskStatus(task, 'Completed')}
                          title="Mark Complete"
                          className="status-btn"
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                        >
                          ✓ Done
                        </button>
                      </>
                    )}
                    {statusType === 'InProgress' && (
                      <button
                        onClick={() => moveTaskStatus(task, 'Completed')}
                        title="Mark Complete"
                        className="status-btn"
                        style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)' }}
                      >
                        ✓ Done
                      </button>
                    )}
                    {statusType === 'Completed' && (
                      <button
                        onClick={() => moveTaskStatus(task, 'Todo')}
                        title="Reopen Task"
                        className="status-btn"
                        style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        ↩ Reopen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 0 40px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Filtering Header Controls */}
      <section className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '1.6rem', color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
            To-Do Lists
          </h1>
          <span style={{ 
            fontSize: '0.8rem', 
            background: `rgba(${activeFilterMember.colorRgb}, 0.15)`, 
            color: activeFilterMember.color,
            padding: '4px 10px', 
            borderRadius: '8px', 
            fontWeight: 600,
            border: `1px solid rgba(${activeFilterMember.colorRgb}, 0.3)`
          }}>
            {filterMemberId === 'all' ? 'Entire Family' : `${activeFilterMember.name}'s Tasks`}
          </span>
        </div>

        {/* Member Selector pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Show tasks for:</span>
          
          <button
            onClick={() => setFilterMemberId('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '99px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: filterMemberId === 'all' 
                ? `1px solid var(--member-color)` 
                : '1px solid rgba(255,255,255,0.06)',
              background: filterMemberId === 'all' 
                ? `rgba(var(--member-color-rgb), 0.15)` 
                : 'rgba(255,255,255,0.03)',
              color: filterMemberId === 'all' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            👥 Everyone
          </button>

          {members.map((member) => {
            const isSelected = filterMemberId === member.id;
            return (
              <button
                key={member.id}
                onClick={() => setFilterMemberId(member.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '99px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: isSelected 
                    ? `1px solid ${member.color}` 
                    : '1px solid rgba(255,255,255,0.06)',
                  background: isSelected 
                    ? `rgba(${member.colorRgb}, 0.15)` 
                    : 'rgba(255,255,255,0.03)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 10px rgba(${member.colorRgb}, 0.1)` : 'none'
                }}
              >
                <span>{member.avatar}</span>
                <span>{member.name}</span>
              </button>
            );
          })}
        </div>

        {/* Add Task Button */}
        <button 
          onClick={() => {
            setSelectedTask(undefined);
            setIsTaskModalOpen(true);
          }}
          className="glass-button glass-button-primary"
          style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '0.9rem' }}
        >
          ➕ Add Task
        </button>
      </section>

      {/* Kanban Board */}
      <section className="todo-kanban">
        {renderColumn('To Do', '📝', todoTasks, 'Todo')}
        {renderColumn('In Progress', '⚡', inProgressTasks, 'InProgress')}
        {renderColumn('Completed', '✅', completedTasks, 'Completed')}
      </section>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(undefined);
        }}
        taskToEdit={selectedTask}
      />

      <style jsx>{`
        .status-btn {
          font-family: inherit;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .status-btn:hover {
          filter: brightness(1.2);
          transform: translateY(-0.5px);
        }
      `}</style>
    </div>
  );
}
