import React, { useEffect, useState } from 'react';
import { getAllSongs } from '../api/songAPI';
import SongFormModal from '../components/SongFormModal';
import '../styles/SongList.css';
import '../styles/Pagination.css';
import ic_add from '../assets/ic_add.png'
export default function SongList() {
  const [songs, setSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredSongs = songs.filter(song =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.singer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSongs.length / pageSize);


  const currentSongs = filteredSongs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };
  const fetchSongs = () => {
    getAllSongs()
      .then(res => setSongs(res.data.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleEdit = song => {
    setSelectedSong(song);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedSong(null);
    setShowModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };



  return (
    <div className="song-list-container">
      <div className="song-list-header">
        <h2 className="song-list-title">Bài Hát</h2>
        <div className="song-list-actions">
          <input type="text" placeholder="Search" className="song-search-input" value={searchTerm} onChange={handleSearchChange} />
          <button
            className="add-button"
            onClick={handleAdd}
            title="Thêm bài hát"
          >
            <img src={ic_add} alt='Thêm' />
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="song-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Tên bài hát</th>
              <th>Nhà sáng tác</th>
              <th>Thời gian</th>
              <th>Lời nhạc</th>
              <th>Mô tả</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSongs.map((song, index) => (
              <tr key={index}>
                <td><img src={song.image} alt={song.name} className="song-image" /></td>
                <td className="font-medium">{song.name}</td>
                <td>{song.singer}</td>
                <td>{song.duration}</td>
                <td className="truncate-text">{song.lyric}</td>
                <td className="truncate-text">{song.description}</td>
                <td className="text-center">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(song)}
                    title="Chỉnh sửa bài hát"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-bar">
          <div className="song-summary">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredSongs.length)} of {filteredSongs.length}
          </div>
          <div className="pagination-buttons">
            <button onClick={handlePrev} disabled={currentPage === 1}>❮</button>
            <button onClick={handleNext} disabled={currentPage === totalPages}>❯</button>
          </div>
        </div>
      </div>

      {/* Modal Thêm / Sửa bài hát */}
      {showModal && (
        <SongFormModal
          isEdit={!!selectedSong}
          songData={selectedSong}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchSongs();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
