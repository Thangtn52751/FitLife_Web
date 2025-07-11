import React, { useEffect, useState, useMemo } from 'react';
import { getAllUsers } from '../api/userApi';
import { getAllExercises } from '../api/exerciseAPI';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [rawUsers, setRawUsers] = useState([]);
  const [rawExercises, setRawExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterField, setFilterField] = useState('createdAt');
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, exRes] = await Promise.all([
          getAllUsers(),      
          getAllExercises()   
        ]);
        const users = Array.isArray(usersRes.data?.data)
          ? usersRes.data.data
          : [];
        const exercises = Array.isArray(exRes.data?.data)
          ? exRes.data.data
          : [];

        setRawUsers(users);
        setRawExercises(exercises);
      } catch (err) {
        console.error('Fetch data error:', err.response?.data || err.message);
        setError('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const inRange = dateStr => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (startDate && d < new Date(startDate)) return false;
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      if (d > e) return false;
    }
    return true;
  };

 
  const filteredUsers = useMemo(() => {
    return Array.isArray(rawUsers)
      ? rawUsers.filter(u => inRange(u[filterField]))
      : [];
  }, [rawUsers, filterField, startDate, endDate]);

  const filteredExercises = useMemo(() => {
    return Array.isArray(rawExercises)
      ? rawExercises.filter(ex => inRange(ex[filterField]))
      : [];
  }, [rawExercises, filterField, startDate, endDate]);

  const userStats = useMemo(() => {
    const total = filteredUsers.length;
    const male = filteredUsers.filter(u => u.gender === 'male').length;
    const female = filteredUsers.filter(u => u.gender === 'female').length;
    const unknown = filteredUsers.filter(u => !u.gender).length;
    return { total, gender: { male, female, unknown } };
  }, [filteredUsers]);

  const exerciseStats = useMemo(() => {
    const total = filteredExercises.length;
    const byLevel = filteredExercises.reduce((acc, ex) => {
      const lvl = ex.level || 'Unknown';
      acc[lvl] = (acc[lvl] || 0) + 1;
      return acc;
    }, { Beginner: 0, Intermediate: 0, Advanced: 0, Unknown: 0 });
    return { total, byLevel };
  }, [filteredExercises]);
  if (loading) return <div className="dashboard">Đang tải thống kê...</div>;
  if (error)   return <div className="dashboard error">{error}</div>;
  const genderData = [
    { name: 'Nam',     value: userStats.gender.male    },
    { name: 'Nữ',      value: userStats.gender.female  },
    { name: 'Chưa có', value: userStats.gender.unknown }
  ];
  const levelData = Object.entries(exerciseStats.byLevel).map(
    ([name, value]) => ({ name, value })
  );
  const COLORS_GENDER = ['#0088FE', '#00C49F', '#FFBB28'];
  const COLORS_LEVEL  = ['#8884d8', '#82ca9d', '#ffc658', '#d0d0d0'];

  return (
    <div className="dashboard">
      <div className="filter-group">
        <label>
          Lọc theo:
          <select
            value={filterField}
            onChange={e => setFilterField(e.target.value)}
          >
            <option value="createdAt">Ngày tạo</option>
            <option value="updatedAt">Ngày cập nhật</option>
          </select>
        </label>
        <label>
          Từ:
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Đến:
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </label>
      </div>

      
      <div className="stats-cards">
        <div className="card">
          <h3>Tổng người dùng</h3>
          <p>{userStats.total}</p>
        </div>
        <div className="card">
          <h3>Tổng bài tập</h3>
          <p>{exerciseStats.total}</p>
        </div>
      </div>

  
      <div className="charts">
        <div className="chart-card">
          <h4>Thống kê giới tính</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={COLORS_GENDER[i % COLORS_GENDER.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Level Pie */}
        <div className="chart-card">
          <h4>Thống kê cấp độ bài tập</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={levelData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {levelData.map((_, i) => (
                  <Cell key={i} fill={COLORS_LEVEL[i % COLORS_LEVEL.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
