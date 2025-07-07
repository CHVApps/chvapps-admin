import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import Navbar from './Navbar';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('All');
  const [newCategory, setNewCategory] = useState({ name: '', type: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('https://chvapps-backend.vercel.app/api/form-submission');
    const data = await res.json();
    setSubmissions(data);
    setFiltered(data);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value === 'All') {
      setFiltered(submissions);
    } else {
      setFiltered(submissions.filter(sub => sub.type === value.toLowerCase()));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.type) return;

    await fetch('https://chvapps-backend.vercel.app/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory)
    });

    setNewCategory({ name: '', type: '' });
  };

  return (
    <div className='admin'>
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
              {filtered.map((sub, idx) => (
                <tr key={idx}>
                  <td>{sub.id}</td>
                  <td>{sub.name}</td>
                  <td>{sub.email}</td>
                  <td>{sub.mobile_number}</td>
                  <td>{sub.type}</td>
                  <td>{sub.subject || '-'}</td>
                  <td>{sub.internship || '-'}</td>
                  <td>{sub.course || '-'}</td>
                  <td>{sub.message}</td>
                  <td>{sub.created_at ? new Date(sub.created_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 
        <h2 className="heading">Add Internship or Course</h2>
        <form className="add-category-form" onSubmit={handleAddCategory}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={newCategory.name}
            onChange={handleInputChange}
            required
          />
          <select name="type" value={newCategory.type} onChange={handleInputChange} required>
            <option value="">Select Type</option>
            <option value="internship">Internship</option>
            <option value="course">Course</option>
          </select>
          <button type="submit">Add</button>
        </form>
        */}
      </div>
    </div>
  );
};

export default AdminDashboard;
