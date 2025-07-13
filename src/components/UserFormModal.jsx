import React, { useEffect, useState } from 'react';
import { createEmployee, updateUserById } from '../api/userApi';
import '../styles/UserFormModal.css';

const genderMap = {
    Nam: 'male',
    Nữ: 'female',
    male: 'Nam',
    female: 'Nữ'
};

export default function UserFormModal({ user, onClose, onRefresh }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        gender: 'Nam',
        role: 'User',
        avatar: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phoneNumber || '', // sửa "phone" thành "phoneNumber" nếu backend dùng key này
                gender: genderMap[user.gender] || 'Nam',
                role: user.role === 'admin' ? 'Admin' : 'User',
                avatar: user.image || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                gender: genderMap[formData.gender], // 'Nam' => 'male'
                phoneNumber: formData.phone,
                image: formData.avatar,
                role: formData.role.toLowerCase(), // 'Admin' => 'admin'
            };

            delete payload.phone;
            delete payload.avatar;

            if (user && user._id) {
                await updateUserById(user._id, payload);
            } else {
                payload.password = '123456'; // hoặc yêu cầu nhập mật khẩu riêng
                await createEmployee(payload);
            }

            onClose();
            onRefresh();
        } catch (err) {
            console.error('Lỗi khi lưu user:', err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">
                    {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
                </h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div>
                        <label>Tên người dùng</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Số điện thoại</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Giới tính</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Vai trò</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>Avatar URL</label>
                        <input
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                        {formData.avatar && (
                            <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                <img
                                    src={formData.avatar}
                                    alt="Avatar Preview"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ccc' }}
                                />
                            </div>
                        )}

                    </div>
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="cancel">
                            Hủy
                        </button>
                        <button type="submit" className="submit">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
