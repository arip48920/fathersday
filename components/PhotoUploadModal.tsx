'use client';

import React, { useState, useRef } from 'react';
import { useFamily, Photo } from '@/context/FamilyContext';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ isOpen, onClose }) => {
  const { addPhoto, activeMember } = useFamily();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Photo['category']>('Everyday');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size should be less than 2MB for storage performance.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageUrl(base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
    setUploadError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl || !date) {
      setUploadError('Please fill out all fields and provide an image.');
      return;
    }

    addPhoto({
      title,
      description,
      date,
      url: imageUrl,
      uploadedBy: activeMember.id,
      category,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setCategory('Everyday');
    setDate(new Date().toISOString().split('T')[0]);
    setImageUrl('');
    setImagePreview(null);
    setUploadError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel modal-content animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '650px',
          border: `1px solid rgba(var(--member-color-rgb), 0.15)`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Add Family Picture</h2>
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
          
          {/* Image Upload / Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Select Photo Source
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              {/* Left Column: Image Pickers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* File Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-button"
                  style={{ width: '100%', padding: '12px 14px' }}
                >
                  📁 Upload Local Image File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>- OR -</span>
                </div>

                {/* URL input */}
                <input
                  type="text"
                  placeholder="Paste Image URL..."
                  className="glass-input"
                  value={imageUrl.startsWith('data:') ? '' : imageUrl}
                  onChange={handleUrlChange}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Right Column: Preview Box */}
              <div 
                style={{ 
                  border: '1px dashed rgba(255, 255, 255, 0.12)', 
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
                    No image<br/>selected
                  </span>
                )}
              </div>
            </div>
            {uploadError && (
              <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>⚠️ {uploadError}</span>
            )}
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Photo Title</label>
            <input
              type="text"
              required
              className="glass-input"
              placeholder="e.g. Summer Vacation Beach day..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Description / Caption</label>
            <textarea
              className="glass-input"
              rows={2}
              placeholder="What made this moment special?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Date Taken</label>
              <input
                type="date"
                required
                className="glass-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Category</label>
              <select
                className="glass-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as Photo['category'])}
              >
                <option value="Vacation">✈️ Vacation</option>
                <option value="Holidays">🎄 Holidays</option>
                <option value="Everyday">📸 Everyday</option>
                <option value="Pets">🐶 Pets</option>
                <option value="Other">💡 Other</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '10px',
            marginTop: '12px', 
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '20px'
          }}>
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
              Upload Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoUploadModal;
