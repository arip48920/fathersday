'use client';

import React, { useState } from 'react';
import { useFamily, Task, FamilyMember } from '@/context/FamilyContext';
import TaskModal from '@/components/TaskModal';

export default function CalendarPage() {
  const { tasks, members, activeMember, loading } = useFamily();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterMemberId, setFilterMemberId] = useState<string>('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        Loading Calendar...
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Weekdays header
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate calendar days
  const getCalendarDays = () => {
    const days = [];
    
    // First day of current month (0 = Sunday, ..., 6 = Saturday)
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    // Total days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    // Total days in previous month
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    // 1. Previous Month days to fill start of grid
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const prevDate = new Date(year, month - 1, dayNum);
      days.push({
        date: prevDate,
        dayNum,
        isCurrentMonth: false,
        dateString: prevDate.toISOString().split('T')[0]
      });
    }

    // 2. Current Month days
    for (let i = 1; i <= totalDays; i++) {
      const currDate = new Date(year, month, i);
      days.push({
        date: currDate,
        dayNum: i,
        isCurrentMonth: true,
        dateString: currDate.toISOString().split('T')[0]
      });
    }

    // 3. Next Month days to fill remaining slots (usually 42 grid items)
    const totalGridSlots = 42;
    const remainingSlots = totalGridSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        dayNum: i,
        isCurrentMonth: false,
        dateString: nextDate.toISOString().split('T')[0]
      });
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const isAssignee = filterMemberId === 'all' || task.assignedTo.includes(filterMemberId);
    return isAssignee;
  });

  const getTasksForDate = (dateStr: string) => {
    return filteredTasks.filter(t => t.dueDate === dateStr);
  };

  const getMemberInfo = (memberId: string) => {
    return members.find(m => m.id === memberId) || members[1];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 0 40px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Calendar Header Controls */}
      <section className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#ffffff', minWidth: '200px', fontFamily: 'Outfit, sans-serif' }}>
            {monthNames[month]} {year}
          </h1>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={handlePrevMonth} className="glass-button" style={{ padding: '8px 12px' }}>◀</button>
            <button onClick={handleToday} className="glass-button" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>Today</button>
            <button onClick={handleNextMonth} className="glass-button" style={{ padding: '8px 12px' }}>▶</button>
          </div>
        </div>

        {/* Member Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '4px' }}>Filter by:</span>
          
          {/* All option */}
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
            👥 All Family
          </button>

          {/* Individual members */}
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

        {/* Quick Task Button */}
        <button 
          onClick={() => {
            setSelectedTask(undefined);
            setDefaultDate(new Date().toISOString().split('T')[0]);
            setIsTaskModalOpen(true);
          }}
          className="glass-button glass-button-primary"
          style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '0.9rem' }}
        >
          ➕ Add Task
        </button>
      </section>

      {/* Calendar Grid Container */}
      <section className="glass-panel" style={{ padding: '16px', overflowX: 'auto' }}>
        <div style={{ minWidth: '750px' }}>
          {/* Days Header */}
          <div className="calendar-grid" style={{ marginBottom: '8px' }}>
            {weekdays.map((day) => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="calendar-grid">
            {calendarDays.map((cell, idx) => {
              const dayTasks = getTasksForDate(cell.dateString);
              const cellIsToday = isToday(cell.date);
              
              return (
                <div
                  key={idx}
                  className={`calendar-day ${!cell.isCurrentMonth ? 'calendar-day-other-month' : ''} ${cellIsToday ? 'calendar-day-today' : ''}`}
                  onClick={() => {
                    setSelectedTask(undefined);
                    setDefaultDate(cell.dateString);
                    setIsTaskModalOpen(true);
                  }}
                  style={{
                    borderColor: cellIsToday ? 'var(--member-color)' : undefined,
                    boxShadow: cellIsToday ? '0 0 12px rgba(var(--member-color-rgb), 0.1)' : undefined
                  }}
                >
                  {/* Day Number */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="calendar-day-number">{cell.dayNum}</span>
                    {cellIsToday && (
                      <span style={{ fontSize: '0.65rem', background: 'var(--member-color)', color: '#070913', padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Tasks list in cell */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflow: 'hidden' }}>
                    {dayTasks.slice(0, 3).map((task) => {
                      // Grab primary assignee
                      const primaryMember = getMemberInfo(task.assignedTo[0]);
                      
                      return (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent opening create dialog
                            setSelectedTask(task);
                            setIsTaskModalOpen(true);
                          }}
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 6px',
                            borderRadius: '6px',
                            background: task.status === 'Completed' 
                              ? 'rgba(15, 23, 42, 0.5)'
                              : `rgba(${primaryMember.colorRgb}, 0.08)`,
                            border: `1px solid ${task.status === 'Completed' ? 'rgba(255,255,255,0.06)' : `rgba(${primaryMember.colorRgb}, 0.25)`}`,
                            color: task.status === 'Completed' ? 'var(--text-muted)' : '#ffffff',
                            textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                          className="calendar-task-badge"
                        >
                          <span style={{ fontSize: '0.8rem' }}>{primaryMember.avatar}</span>
                          <span style={{ fontWeight: 500 }}>{task.title}</span>
                        </div>
                      );
                    })}

                    {dayTasks.length > 3 && (
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', paddingLeft: '4px', fontWeight: 600 }}>
                        + {dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Task Creation/Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(undefined);
        }}
        taskToEdit={selectedTask}
        defaultDate={defaultDate}
      />

      <style jsx>{`
        .calendar-task-badge:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
