import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './AddItem.css';

const AddItem = () => {
  const [newCategory, setNewCategory] = useState({ name: '', type: '' });
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch('http://localhost:5000/api/courses-internships');
    const data = await res.json();
    setItems(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.type) return;

    await fetch('http://localhost:5000/api/courses-internships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory)
    });

    setNewCategory({ name: '', type: '' });
    fetchData();
  };

  const filteredItems = items
    .filter(item => (filter === 'All' || item.type === filter.toLowerCase()))
    .sort((a, b) => {
      const keyword = search.toLowerCase();
      const aMatch = a.name.toLowerCase().includes(keyword);
      const bMatch = b.name.toLowerCase().includes(keyword);
      return bMatch - aMatch;
    });

  return (
    <div className="add-item-page">
      <Navbar />
      <div className="add-item-container">
        <div className="add-item-header">
          <h2 className="heading">Add Internship or Course</h2>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
            <option value="All">All</option>
            <option value="internship">Internship</option>
            <option value="course">Course</option>
          </select>
        </div>
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
        <div className="add-item-table-wrapper">
          <table className="add-item-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index} className={search && item.name.toLowerCase().includes(search.toLowerCase()) ? 'highlight' : ''}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
