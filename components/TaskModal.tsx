'use client';

import React, { useState, useEffect } from 'react';
import { useFamily, Task, FamilyMember } from '@/context/FamilyContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task;
  defaultDate?: string; // Pre-fills the date when clicked from Calendar
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit, defaultDate }) => {
  const { members, addTask, updateTask, deleteTask, activeMember } = useFamily();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Task['category']>('Chores');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [status, setStatus] = useState<Task['status']>('Todo');
  const [priority, setPriority] = useState<Task['priority']>('Medium');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setCategory(taskToEdit.category);
      setDueDate(taskToEdit.dueDate);
      setAssignedTo(taskToEdit.assignedTo);
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
    } else {
      // Clear form for new task
      setTitle('');
      setDescription('');
      setCategory('Chores');
      setDueDate(defaultDate || new Date().toISOString().split('T')[0]);
      setAssignedTo([activeMember.id]); // Default assign to the active creator
      setStatus('Todo');
      setPriority('Medium');
    }
  }, [taskToEdit, defaultDate, isOpen, activeMember.id]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const taskData = {
      title,
      description,
      category,
      dueDate,
      assignedTo: assignedTo.length > 0 ? assignedTo : [activeMember.id], // Fallback to active creator
      status,
      priority,
    };

    if (taskToEdit) {
      updateTask({ ...taskToEdit, ...taskData });
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (taskToEdit) {
      deleteTask(taskToEdit.id);
      onClose();
    }
  };

  const handleMemberToggle = (memberId: string) => {
    if (assignedTo.includes(memberId)) {
      setAssignedTo(assignedTo.filter(id => id !== memberId));
    } else {
      setAssignedTo([...assignedTo, memberId]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel modal-content animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ border: `1px solid rgba(var(--member-color-rgb), 0.15)` }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              fontSize: '1.4rem', 
              cursor: 'pointer' 
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Task Title</label>
            <input
              type="text"
              required
              className="glass-input"
              placeholder="e.g. Wash the dishes, Buy birthday card..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Description</label>
            <textarea
              className="glass-input"
              rows={3}
              placeholder="Add details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Due Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Due Date</label>
              <input
                type="date"
                required
                className="glass-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Category</label>
              <select
                className="glass-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as Task['category'])}
                style={{ appearance: 'none', background: 'rgba(15, 23, 42, 0.7)' }}
              >
                <option value="Chores">🧹 Chores</option>
                <option value="School">📚 School</option>
                <option value="Social">🎉 Social</option>
                <option value="Shopping">🛒 Shopping</option>
                <option value="Work">💼 Work</option>
                <option value="Other">💡 Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Priority */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Priority</label>
              <select
                className="glass-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</label>
              <select
                className="glass-input"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
              >
                <option value="Todo">📝 To Do</option>
                <option value="InProgress">⚡ In Progress</option>
                <option value="Completed">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Assigned To */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Assign To</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
              {members.map((member) => {
                const isChecked = assignedTo.includes(member.id);
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleMemberToggle(member.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '99px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      border: isChecked 
                        ? `1px solid ${member.color}` 
                        : '1px solid rgba(255,255,255,0.06)',
                      background: isChecked 
                        ? `rgba(${member.colorRgb}, 0.15)` 
                        : 'rgba(255,255,255,0.03)',
                      color: isChecked ? '#ffffff' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                      boxShadow: isChecked ? `0 0 10px rgba(${member.colorRgb}, 0.1)` : 'none'
                    }}
                    className="assignee-pill"
                  >
                    <span>{member.avatar}</span>
                    <span>{member.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '12px', 
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '20px'
          }}>
            <div>
              {taskToEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="glass-button"
                  style={{ 
                    borderColor: 'rgba(239, 68, 68, 0.4)', 
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🗑️ Delete Task
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={onClose} 
                className="glass-button"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="glass-button glass-button-primary"
              >
                {taskToEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
