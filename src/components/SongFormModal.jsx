import React, { useState, useEffect } from 'react';
import { createSong, updateSong, deleteSong } from '../api/songAPI';
import '../styles/AddSongModal.css';

export default function SongFormModal({ isEdit = false, songData = {}, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    singer: '',
    lyric: '',
    duration: '',
  });
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && songData) {
      setFormData({
        name: songData.name || '',
        description: songData.description || '',
        image: songData.image || '',
        singer: songData.singer || '',
        lyric: songData.lyric || '',
        duration: songData.duration || '',
      });
    }
  }, [isEdit, songData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);

      if (isEdit) {
        await updateSong(songData._id, formData);
      } else {
        if (!audio) return alert('Vui lòng chọn file nhạc');
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
        payload.append('audio', audio);
        await createSong(payload);
      }

      alert(isEdit ? 'Đã cập nhật bài hát!' : 'Đã thêm bài hát!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(isEdit ? 'Lỗi khi cập nhật!' : 'Lỗi khi thêm bài hát!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-song-modal">
      <div className="modal-panel">
        <h2 className="modal-title">{isEdit ? 'Sửa bài hát' : 'Thêm bài hát'}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Tên bài hát</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <input name="description" value={formData.description} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Ảnh bài hát (link)</label>
            <input name="image" value={formData.image} onChange={handleChange} />
          </div>

          {!isEdit && (
            <div className="form-group">
              <label>Video (.mp3)</label>
              <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files[0])} required />
            </div>
          )}

          <div className="form-group">
            <label>Ca sĩ</label>
            <input name="singer" value={formData.singer} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Thời gian</label>
            <input name="duration" value={formData.duration} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Lời bài hát</label>
            <textarea name="lyric" rows={4} value={formData.lyric} onChange={handleChange} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn cancel" onClick={onClose}>
              Huỷ
            </button>
            {isEdit && (
              <button
                type="button"
                className="btn danger"
                onClick={async () => {
                  if (window.confirm('Bạn có chắc muốn xoá bài hát này không?')) {
                    try {
                      await deleteSong(songData._id);
                      alert('Đã xoá bài hát');
                      onSuccess();
                      onClose();
                    } catch (err) {
                      console.error(err);
                      alert('Xoá bài hát thất bại');
                    }
                  }
                }}
              >
                🗑️
              </button>
            )}
            <button type="submit" className="btn primary" disabled={loading}>
              {isEdit ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
