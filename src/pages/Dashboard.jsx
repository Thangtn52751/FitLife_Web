import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const mockData = {
    users: 2340,
    mentalExercises: 5230,
    physicalExercises: 4204,
  };

  return (
    <div className="dashboard">
      <h1>Thống kê</h1>
      <div className="stats-cards">
        <div className="card">
          <h3>Người dùng</h3>
          <p>{mockData.users}</p>
        </div>
        <div className="card">
          <h3>Bài tập tinh thần</h3>
          <p>{mockData.mentalExercises}</p>
        </div>
        <div className="card">
          <h3>Bài tập thể chất</h3>
          <p>{mockData.physicalExercises}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
