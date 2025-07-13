import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/userApi';
import UserFormModal from '../components/UserFormModal';
import '../styles/UserList.css';
import '../styles/Pagination.css';
import ic_add from '../assets/ic_add.png';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const fetchUsers = () => {
        getAllUsers()
            .then(res => setUsers(res.data.data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = user => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleAdd = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="user-list-container">
            <div className="user-list-header">
                <h2 className="user-list-title">Tài khoản người dùng</h2>
                <div className="user-list-actions">
                    <input type="text" placeholder="🔍 Tìm kiếm..." className="user-search-input" value={searchTerm} onChange={handleSearchChange} />
                    <button className="add-button" onClick={handleAdd} title="Thêm người dùng">
                        <img src={ic_add} alt="Thêm" />
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Ảnh đại diện</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Giới tính</th>
                            <th>Vai trò</th>
                            <th className="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={index}>
                                <td>
                                    {user.image ? (
                                        <img src={user.image} alt={user.fullName} className="user-avatar" />
                                    ) : (
                                        <span>--</span>
                                    )}
                                </td>
                                <td className="font-medium">{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.gender === 'male' ? 'Nam' : 'Nữ'}</td>
                                <td>{user.role}</td>
                                <td className="text-center">
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(user)}
                                        title="Chỉnh sửa người dùng"
                                    >
                                        ✏️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-bar">
                    <div className="user-summary">
                        Hiển thị {(currentPage - 1) * pageSize + 1}–
                        {Math.min(currentPage * pageSize, filteredUsers.length)} trong {filteredUsers.length}
                    </div>
                    <div className="pagination-buttons">
                        <button onClick={handlePrev} disabled={currentPage === 1}>❮</button>
                        <button onClick={handleNext} disabled={currentPage === totalPages}>❯</button>
                    </div>
                </div>
            </div>

            {showModal && (
                <UserFormModal
                    user={selectedUser}
                    onClose={() => setShowModal(false)}
                    onRefresh={() => {
                        fetchUsers();
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
}
