import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', type: '' });
  const [categories, setCategories] = useState({ internship: [], course: [] });

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    const res = await fetch('/api/form-submissions');
    const data = await res.json();
    setSubmissions(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    const internship = data.filter(item => item.type === 'internship');
    const course = data.filter(item => item.type === 'course');
    setCategories({ internship, course });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.type) return;

    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory)
    });

    setNewCategory({ name: '', type: '' });
    fetchCategories();
  };

  return (
    <div className="admin-dashboard">
      <h2 className="heading">Form Submissions</h2>
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
            {submissions.map((sub, idx) => (
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
                <td>{new Date(sub.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      <div className="category-display">
        <div className="category-box">
          <h3>Internship List</h3>
          <ul>
            {categories.internship.map((item, idx) => (
              <li key={idx}>{item.name}</li>
            ))}
          </ul>
        </div>
        <div className="category-box">
          <h3>Course List</h3>
          <ul>
            {categories.course.map((item, idx) => (
              <li key={idx}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
