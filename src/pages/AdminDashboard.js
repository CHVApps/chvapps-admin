import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import Navbar from './Navbar';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://chvapps-backend.vercel.app/api';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/form-submissions`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setSubmissions(data);
        setFiltered(data);
      } else {
        setSubmissions([]);
        setFiltered([]);
      }
    } catch {
      setSubmissions([]);
      setFiltered([]);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    if (value === 'All') {
      setFiltered(submissions);
      return;
    }

    setFiltered(
      submissions.filter((sub) => String(sub.type || '').toLowerCase() === value.toLowerCase())
    );
  };

  return (
    <div className="admin">
      <Navbar />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h2 className="heading">Form Submissions</h2>
          <select className="filter-dropdown" value={filter} onChange={handleFilterChange}>
            <option>All</option>
            <option>Contact</option>
            <option>Internship</option>
            <option>Course</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Type</th>
                <th>Subject</th>
                <th>Internship</th>
                <th>Course</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(filtered || []).length > 0 ? (
                filtered.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.id}</td>
                    <td>{sub.name || '-'}</td>
                    <td>{sub.email || '-'}</td>
                    <td>{sub.mobile_number || '-'}</td>
                    <td>{sub.type || '-'}</td>
                    <td>{sub.subject || '-'}</td>
                    <td>{sub.internship || '-'}</td>
                    <td>{sub.course || '-'}</td>
                    <td>{sub.message || '-'}</td>
                    <td>{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">No submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;