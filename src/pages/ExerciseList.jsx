import React, { useEffect, useState } from 'react';
import { saveExerciseToBackend, searchExercises } from '../api/exerciseAPI';
import '../styles/ExerciseList.css';

const ExerciseList = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedVideoData, setSelectedVideoData] = useState(null);
    const [rounds, setRounds] = useState([
        { title: '', durationSec: 30, order: 1 },
    ]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await searchExercises('cardio workout', 10);
                setVideos(response.data.items);
            } catch (error) {
                console.error('Lỗi khi tải video:', error);
            }
        };
        fetchVideos();
    }, []);

    const handleEdit = (video) => {
        setSelectedVideoData({
            videoId: video.id.videoId,
            title: video.snippet.title,
            channelTitle: video.snippet.channelTitle,
            description: '',
            imageUrl: video.snippet.thumbnails.high.url,
            videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`
        });
        setEditModalOpen(true);
    };

    return (
        <div className="exercise-container">
            <h2 className="exercise-title">Danh sách bài tập Cardio</h2>

            <table className="exercise-table">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên Bài Tập</th>
                        <th>Kênh</th>
                        <th>Thời Gian</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {videos.map((video) => (
                        <tr key={video.id.videoId}>
                            <td>
                                <img
                                    src={video.snippet.thumbnails.default.url}
                                    alt="thumbnail"
                                    className="exercise-thumbnail"
                                />
                            </td>
                            <td>{video.snippet.title}</td>
                            <td>{video.snippet.channelTitle}</td>
                            <td>~5:00</td>
                            <td>
                                <span
                                    className="exercise-action-link"
                                    onClick={() => setSelectedVideo(video.id.videoId)}
                                    style={{ cursor: 'pointer', marginRight: 8 }}
                                >
                                    ▶ Xem
                                </span>
                                <span
                                    className="exercise-edit-icon"
                                    title="Chỉnh sửa"
                                    onClick={() => handleEdit(video)}
                                >
                                    ✏️
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedVideo && (
                <div className="exercise-modal-overlay" onClick={() => setSelectedVideo(null)}>
                    <div className="exercise-modal-content" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            width="640"
                            height="360"
                            src={`https://www.youtube.com/embed/${selectedVideo}`}
                            title="Xem bài tập"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                        <button className="exercise-close-btn" onClick={() => setSelectedVideo(null)}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {editModalOpen && selectedVideoData && (
                <div className="exercise-modal-overlay" onClick={() => setEditModalOpen(false)}>
                    <div className="exercise-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Chỉnh sửa bài tập</h3>
                        <label>
                            Tên bài tập:
                            <input
                                type="text"
                                value={selectedVideoData.title}
                                onChange={(e) =>
                                    setSelectedVideoData({ ...selectedVideoData, title: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Mô tả:
                            <textarea
                                rows="3"
                                value={selectedVideoData.description}
                                onChange={(e) =>
                                    setSelectedVideoData({ ...selectedVideoData, description: e.target.value })
                                }
                            />
                        </label>
                        <div style={{ marginTop: 16 }}>
                            <h4>Chia vòng tập (Rounds)</h4>
                            {rounds.map((round, index) => (
                                <div key={index} style={{ marginBottom: 8 }}>
                                    <input
                                        type="text"
                                        placeholder="Tên động tác"
                                        value={round.title}
                                        onChange={(e) => {
                                            const newRounds = [...rounds];
                                            newRounds[index].title = e.target.value;
                                            setRounds(newRounds);
                                        }}
                                        style={{ width: '45%', marginRight: '10px' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Thời gian (giây)"
                                        value={round.durationSec}
                                        onChange={(e) => {
                                            const newRounds = [...rounds];
                                            newRounds[index].durationSec = Number(e.target.value);
                                            setRounds(newRounds);
                                        }}
                                        style={{ width: '30%', marginRight: '10px' }}
                                    />
                                    <span style={{ fontWeight: 'bold' }}>#{index + 1}</span>
                                </div>
                            ))}
                            <button
                                onClick={() =>
                                    setRounds([
                                        ...rounds,
                                        { title: '', durationSec: 30, order: rounds.length + 1 },
                                    ])
                                }
                                style={{
                                    marginTop: 8,
                                    backgroundColor: '#eee',
                                    border: '1px solid #ccc',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                }}
                            >
                                ➕ Thêm vòng
                            </button>
                        </div>
                        <button
                            className="exercise-close-btn"
                            onClick={async () => {
                                try {
                                    await saveExerciseToBackend({
                                        ...selectedVideoData,
                                        rounds: rounds.map((r, index) => ({
                                            title: r.title,
                                            durationSec: r.durationSec,
                                            order: index + 1,
                                        })),
                                    });
                                    alert('Đã lưu thành công!');
                                    setEditModalOpen(false);
                                } catch (err) {
                                    alert('Lỗi khi lưu bài tập');
                                }
                            }}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseList;
