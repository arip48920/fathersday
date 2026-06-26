'use client';

import React, { useState } from 'react';
import { useFamily, Photo, FamilyMember } from '@/context/FamilyContext';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: Photo;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ isOpen, onClose, photo }) => {
  const { members, activeMember, likePhoto, addCommentToPhoto } = useFamily();
  const [commentText, setCommentText] = useState('');

  if (!isOpen) return null;

  const hasLiked = photo.likedBy.includes(activeMember.id);
  const uploader = members.find(m => m.id === photo.uploadedBy) || members[1];

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likePhoto(photo.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToPhoto(photo.id, commentText);
    setCommentText('');
  };

  const getCommenter = (memberId: string) => {
    return members.find(m => m.id === memberId) || members[1];
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '1000px',
          width: '95vw',
          height: '80vh',
          maxHeight: '800px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          padding: 0,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Left Side: Photo */}
        <div style={{ 
          position: 'relative', 
          background: '#030712', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 10,
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#ffffff',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'none' // will override in media query if needed, or keep standard close on right
            }}
            className="mobile-close"
          >
            ✕
          </button>
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt={photo.title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>

        {/* Right Side: Details & Comments */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          maxHeight: '80vh', 
          background: 'rgba(11, 15, 25, 0.4)'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '20px', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                fontSize: '1.4rem', 
                background: `rgba(${uploader.colorRgb}, 0.15)`, 
                borderRadius: '50%', 
                width: '36px', 
                height: '36px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                {uploader.avatar}
              </span>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#ffffff' }}>{photo.title}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Uploaded by {uploader.name} on {photo.date}
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-secondary)', 
                fontSize: '1.3rem', 
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Description & Likes Bar */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#cbd5e1', marginBottom: '12px' }}>
              {photo.description}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleLike}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: hasLiked ? `rgba(${activeMember.colorRgb}, 0.15)` : 'rgba(255, 255, 255, 0.03)',
                  border: hasLiked ? `1px solid ${activeMember.color}` : '1px solid rgba(255,255,255,0.06)',
                  color: hasLiked ? activeMember.color : 'var(--text-secondary)',
                  borderRadius: '99px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease',
                  boxShadow: hasLiked ? `0 0 10px rgba(${activeMember.colorRgb}, 0.15)` : 'none'
                }}
              >
                <span>❤️</span>
                <span>{photo.likes} Likes</span>
              </button>
              
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tag: <strong style={{ color: 'var(--text-secondary)' }}>{photo.category}</strong>
              </span>
            </div>
          </div>

          {/* Comments List (Scrollable) */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {photo.comments.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}>
                💬 No comments yet. Be the first to share your thoughts!
              </div>
            ) : (
              photo.comments.map((comment) => {
                const commenter = getCommenter(comment.memberId);
                return (
                  <div key={comment.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ 
                      fontSize: '1.2rem',
                      background: `rgba(${commenter.colorRgb}, 0.15)`,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {commenter.avatar}
                    </span>
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      flex: 1
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: commenter.color }}>
                          {commenter.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {comment.date}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                        {comment.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Comment Input */}
          <form 
            onSubmit={handleAddComment}
            style={{ 
              padding: '16px 20px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '10px',
              background: 'rgba(15, 23, 42, 0.3)'
            }}
          >
            <input
              type="text"
              placeholder={`Comment as ${activeMember.name}...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="glass-input"
              style={{ flex: 1, padding: '10px 14px' }}
            />
            <button 
              type="submit" 
              className="glass-button glass-button-primary"
              style={{ padding: '0 16px' }}
            >
              Post
            </button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .glass-panel {
            grid-template-columns: 1fr !important;
            grid-template-rows: 1fr 1.2fr !important;
            height: 90vh !important;
          }
          .mobile-close {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PhotoModal;
