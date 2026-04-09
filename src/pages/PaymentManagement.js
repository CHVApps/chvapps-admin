import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';
import './PaymentManagement.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://chvapps-backend.vercel.app/api';

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [courseFilter, setCourseFilter] = useState('ALL');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await fetch(`${API_BASE_URL}/payment-list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch payment records');
      }

      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch payment records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const searchValue = searchText.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        String(item.full_name || '').toLowerCase().includes(searchValue) ||
        String(item.email || '').toLowerCase().includes(searchValue) ||
        String(item.mobile || '').includes(searchValue) ||
        String(item.enrollment_id || '').toLowerCase().includes(searchValue) ||
        String(item.razorpay_payment_id || '').toLowerCase().includes(searchValue) ||
        String(item.razorpay_order_id || '').toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === 'ALL' ||
        String(item.enrollment_status || '').toUpperCase() === statusFilter;

      const matchesCourse =
        courseFilter === 'ALL' ||
        String(item.course_name || '') === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [payments, searchText, statusFilter, courseFilter]);

  const stats = useMemo(() => {
    const total = payments.length;
    const paid = payments.filter((item) => String(item.enrollment_status || '').toUpperCase() === 'PAID').length;
    const pending = payments.filter((item) => String(item.enrollment_status || '').toUpperCase() === 'PENDING').length;
    const failed = payments.filter((item) => String(item.enrollment_status || '').toUpperCase() === 'FAILED').length;

    return { total, paid, pending, failed };
  }, [payments]);

  return (
    <>
      <Navbar />

      <div className="payment-admin-page">
        <div className="payment-admin-wrapper">
          <div className="payment-admin-header">
            <div className="payment-admin-header-content">
              <span className="payment-admin-badge">Admin Panel</span>
              <h1>Payment Management</h1>
              <p>View all course enrollments, payment details, and current payment status.</p>
            </div>

            <button className="refresh-btn" onClick={fetchPayments} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="payment-stats-grid">
            <div className="stat-card">
              <span>Total Records</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <span>Paid</span>
              <strong>{stats.paid}</strong>
            </div>
            <div className="stat-card">
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </div>
            <div className="stat-card">
              <span>Failed</span>
              <strong>{stats.failed}</strong>
            </div>
          </div>

          <div className="payment-filters-card">
            <div className="filter-group search-group">
              <label htmlFor="searchText">Search</label>
              <input
                id="searchText"
                type="text"
                placeholder="Search by name, email, mobile, enrollment ID, payment ID, order ID"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="statusFilter">Status</label>
              <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="INITIATED">Initiated</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="courseFilter">Course</label>
              <select id="courseFilter" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
                <option value="ALL">All</option>
                <option value="Basics">Basics</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="payment-table-card">
            {loading ? (
              <div className="table-message">Loading payment records...</div>
            ) : errorMessage ? (
              <div className="table-message error">{errorMessage}</div>
            ) : filteredPayments.length === 0 ? (
              <div className="table-message">No payment records found.</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Amount</th>
                      <th>Enrollment Status</th>
                      <th>Payment Status</th>
                      <th>Payment ID</th>
                      <th>Order ID</th>
                      <th>Enrollment ID</th>
                      <th>Method</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((item) => (
                      <tr key={item.payment_row_id || item.enrollment_id}>
                        <td>{item.full_name || '-'}</td>
                        <td>{item.mobile || '-'}</td>
                        <td>{item.email || '-'}</td>
                        <td>{item.course_name || '-'}</td>
                        <td>₹{Number(item.amount || 0).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`status-pill ${String(item.enrollment_status || '').toLowerCase()}`}>
                            {item.enrollment_status || '-'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${String(item.payment_status || '').toLowerCase()}`}>
                            {item.payment_status || '-'}
                          </span>
                        </td>
                        <td>{item.razorpay_payment_id || '-'}</td>
                        <td>{item.razorpay_order_id || '-'}</td>
                        <td>{item.enrollment_id || '-'}</td>
                        <td>{item.method || '-'}</td>
                        <td>{item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentManagement;