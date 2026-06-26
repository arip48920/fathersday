'use client';

import React, { useState } from 'react';
import { useFamily, Photo, FamilyMember } from '@/context/FamilyContext';
import PhotoModal from '@/components/PhotoModal';
import PhotoUploadModal from '@/components/PhotoUploadModal';

export default function GalleryPage() {
  const { photos, members, loading } = useFamily();
  
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | undefined>(undefined);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        Loading Gallery...
      </div>
    );
  }

  // Filter photos by category
  const filteredPhotos = photos.filter((photo) => {
    return filterCategory === 'all' || photo.category === filterCategory;
  });

  const getUploaderInfo = (memberId: string) => {
    return members.find(m => m.id === memberId) || members[1];
  };

  const categories = [
    { name: 'All Memories', value: 'all' },
    { name: '✈️ Vacations', value: 'Vacation' },
    { name: '🎄 Holidays', value: 'Holidays' },
    { name: '📸 Everyday', value: 'Everyday' },
    { name: '🐶 Pets', value: 'Pets' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 0 40px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Filtering Header Controls */}
      <section className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '1.6rem', color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
            Family Memories
          </h1>
          <span style={{ 
            fontSize: '0.8rem', 
            background: 'rgba(255,255,255,0.05)', 
            color: 'var(--text-secondary)',
            padding: '4px 10px', 
            borderRadius: '8px', 
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {filteredPhotos.length} Pictures
          </span>
        </div>

        {/* Category Selector pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isSelected = filterCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '99px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: isSelected 
                    ? `1px solid var(--member-color)` 
                    : '1px solid rgba(255,255,255,0.06)',
                  background: isSelected 
                    ? `rgba(var(--member-color-rgb), 0.15)` 
                    : 'rgba(255,255,255,0.03)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 10px rgba(var(--member-color-rgb), 0.1)` : 'none'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Upload Button */}
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="glass-button glass-button-primary"
          style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '0.9rem' }}
        >
          📸 Upload Photo
        </button>
      </section>

      {/* Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <section 
          className="glass-panel" 
          style={{ 
            padding: '80px 20px', 
            textAlign: 'center', 
            color: 'var(--text-secondary)',
            border: '1px dashed rgba(255, 255, 255, 0.06)'
          }}
        >
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>📷</span>
          <h3>No pictures found in this category.</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Be the first to upload a memory!
          </p>
        </section>
      ) : (
        <section className="gallery-grid">
          {filteredPhotos.map((photo) => {
            const uploader = getUploaderInfo(photo.uploadedBy);
            return (
              <div
                key={photo.id}
                onClick={() => {
                  setSelectedPhoto(photo);
                  setIsPhotoOpen(true);
                }}
                className="glass-panel photo-card"
                style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  padding: 0,
                  position: 'relative',
                  background: 'rgba(15, 23, 42, 0.4)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image Wrap */}
                <div className="photo-img-container" style={{ 
                  height: '240px', 
                  overflow: 'hidden', 
                  position: 'relative', 
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
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    className="gallery-image"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="photo-overlay" style={{
                    position: 'absolute',
                    top: 0, right: 0, bottom: 0, left: 0,
                    background: 'linear-gradient(to top, rgba(3, 7, 18, 0.8) 0%, rgba(3, 7, 18, 0.2) 60%, rgba(3, 7, 18, 0.4) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '16px'
                  }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        background: 'rgba(255, 255, 255, 0.12)', 
                        border: '1px solid rgba(255,255,255,0.15)',
                        padding: '3px 8px', 
                        borderRadius: '6px',
                        color: '#ffffff',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {photo.category}
                      </span>
                      
                      <span style={{ 
                        fontSize: '1.1rem',
                        background: `rgba(${uploader.colorRgb}, 0.2)`,
                        border: `1px solid ${uploader.color}`,
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 10px rgba(${uploader.colorRgb}, 0.25)`
                      }} title={`Uploaded by ${uploader.name}`}>
                        {uploader.avatar}
                      </span>
                    </div>

                    {/* Bottom row */}
                    <div>
                      <h3 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {photo.title}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#cbd5e1', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        Uploaded {photo.date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Footer (always visible for clarity and layout structure) */}
                <div style={{ padding: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    {photo.title}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      ❤️ {photo.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      💬 {photo.comments.length}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </section>
      )}

      {/* Lightbox / Details Modal */}
      {selectedPhoto && (
        <PhotoModal
          isOpen={isPhotoOpen}
          onClose={() => {
            setIsPhotoOpen(false);
            setSelectedPhoto(undefined);
          }}
          photo={selectedPhoto}
        />
      )}

      {/* Upload Modal */}
      <PhotoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <style jsx>{`
        .photo-card:hover .photo-overlay {
          opacity: 1 !important;
        }
        .photo-card:hover .gallery-image {
          transform: scale(1.06) !important;
        }
        .photo-card:hover {
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4) !important;
        }
      `}</style>
    </div>
  );
}
