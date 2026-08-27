import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';

export const AdminEvents = () => {
  const { getAuthHeaders } = useAuth();
  
  // States
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, upcoming, ongoing, completed, cancelled
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    location: '',
    organizer: '',
    capacity: '',
    status: 'upcoming',
    description: ''
  });

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/events', {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Không thể tải danh sách sự kiện.');
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, pageSize]);

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      event_date: '',
      location: '',
      organizer: '',
      capacity: '',
      status: 'upcoming',
      description: ''
    });
    setEditingEventId(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setFormData({
      title: event.title || '',
      event_date: event.event_date ? new Date(event.event_date).toISOString().substring(0, 10) : '',
      location: event.location || '',
      organizer: event.organizer || '',
      capacity: event.capacity || '',
      status: event.status || 'upcoming',
      description: event.description || ''
    });
    setEditingEventId(event.id);
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.event_date) {
      alert('Vui lòng điền tiêu đề và ngày tổ chức.');
      return;
    }

    const payload = {
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : null
    };

    const url = editingEventId ? `/api/admin/events/${editingEventId}` : '/api/admin/events';
    const method = editingEventId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(editingEventId ? 'Cập nhật sự kiện thành công!' : 'Tạo sự kiện mới thành công!');
        setModalOpen(false);
        loadEvents();
      } else {
        const err = await res.json();
        alert(err.error || 'Thao tác thất bại.');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sự kiện "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        alert('Đã xóa sự kiện thành công!');
        loadEvents();
      } else {
        const err = await res.json();
        alert(err.error || 'Thao tác thất bại.');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return <span className="badge pending">Sắp diễn ra</span>;
      case 'ongoing':
        return <span className="badge approved" style={{ background: '#3B82F6', borderColor: '#3B82F6' }}>Đang diễn ra</span>;
      case 'completed':
        return <span className="badge approved">Đã kết thúc</span>;
      case 'cancelled':
        return <span className="badge rejected">Đã hủy</span>;
      default:
        return <span className="badge pending">Chưa rõ</span>;
    }
  };

  // Filter logic
  const filteredEvents = events.filter(e => {
    // 1. Status Filter
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;

    // 2. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title && e.title.toLowerCase().includes(q);
      const matchLocation = e.location && e.location.toLowerCase().includes(q);
      const matchOrganizer = e.organizer && e.organizer.toLowerCase().includes(q);
      if (!matchTitle && !matchLocation && !matchOrganizer) return false;
    }

    return true;
  });

  // Pagination calculation
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + pageSize);

  return (
    <AdminLayout title="Quản Lý Sự Kiện Giao Thương">
      <div className="card" style={{ textAlign: 'left' }}>
        
        {/* Top bar bộ lọc & Nút Thêm mới */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button className={`btn ${statusFilter === 'all' ? 'btn-primary' : ''}`} onClick={() => setStatusFilter('all')} style={{ fontSize: '12px', padding: '6px 12px' }}>Tất cả ({events.length})</button>
            <button className={`btn ${statusFilter === 'upcoming' ? 'btn-primary' : ''}`} onClick={() => setStatusFilter('upcoming')} style={{ fontSize: '12px', padding: '6px 12px' }}>Sắp diễn ra ({events.filter(e => e.status === 'upcoming').length})</button>
            <button className={`btn ${statusFilter === 'ongoing' ? 'btn-primary' : ''}`} onClick={() => setStatusFilter('ongoing')} style={{ fontSize: '12px', padding: '6px 12px' }}>Đang diễn ra ({events.filter(e => e.status === 'ongoing').length})</button>
            <button className={`btn ${statusFilter === 'completed' ? 'btn-primary' : ''}`} onClick={() => setStatusFilter('completed')} style={{ fontSize: '12px', padding: '6px 12px' }}>Đã kết thúc ({events.filter(e => e.status === 'completed').length})</button>
            <button className={`btn ${statusFilter === 'cancelled' ? 'btn-primary' : ''}`} onClick={() => setStatusFilter('cancelled')} style={{ fontSize: '12px', padding: '6px 12px' }}>Đã hủy ({events.filter(e => e.status === 'cancelled').length})</button>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Tìm tên sự kiện, địa điểm..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', width: '200px', outline: 'none' }}
            />
            <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <i className="ti ti-plus"></i> Thêm Sự kiện mới
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light-muted)' }}>
            <i className="ti ti-loader animate-spin" style={{ fontSize: '24px', display: 'block', margin: '0 auto 10px' }}></i> Đang tải danh sách sự kiện...
          </div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#EF4444' }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}></i> Lỗi tải dữ liệu: {error}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light-muted)' }}>
            <i className="ti ti-calendar" style={{ fontSize: '24px', display: 'block', margin: '0 auto 10px' }}></i> Chưa có sự kiện nào phù hợp bộ lọc.
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E2E8F0', textAlign: 'left', background: '#F8FAFC' }}>
                    <th style={{ padding: '12px 16px' }}>Tên Sự Kiện</th>
                    <th style={{ padding: '12px 16px' }}>Ngày Tổ Chức</th>
                    <th style={{ padding: '12px 16px' }}>Địa Điểm</th>
                    <th style={{ padding: '12px 16px' }}>Đơn Vị Tổ Chức</th>
                    <th style={{ padding: '12px 16px' }}>Sức Chứa / Quan Tâm</th>
                    <th style={{ padding: '12px 16px' }}>Trạng Thái</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.map((e) => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A', maxWidth: '250px' }}>{e.title}</td>
                      <td style={{ padding: '12px 16px', color: '#334155' }}>{new Date(e.event_date).toLocaleDateString('vi-VN')}</td>
                      <td style={{ padding: '12px 16px', color: '#334155' }}>{e.location || 'Chưa thiết lập'}</td>
                      <td style={{ padding: '12px 16px', color: '#334155' }}>{e.organizer || 'Chưa thiết lập'}</td>
                      <td style={{ padding: '12px 16px', color: '#334155' }}>
                        <div>Sức chứa: {e.capacity ? `${e.capacity} khách` : 'Không giới hạn'}</div>
                        <div style={{ fontSize: '10px', color: 'var(--amber)', marginTop: '2px' }}>
                          <i className="ti ti-star-filled"></i> {e.interest_count || 0} lượt quan tâm
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>{getStatusBadge(e.status)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button className="quick-btn" onClick={() => handleOpenEditModal(e)} style={{ padding: '4px 8px', fontSize: '11px', background: '#3B82F6', color: '#fff', border: '1px solid #3B82F6', borderRadius: '4px', cursor: 'pointer' }}>Sửa</button>
                          <button className="quick-btn" onClick={() => handleDelete(e.id, e.title)} style={{ padding: '4px 8px', fontSize: '11px', background: '#EF4444', color: '#fff', border: '1px solid #EF4444', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Thanh Phân Trang */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                Hiển thị <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + pageSize, totalItems)}</strong> trên tổng số <strong>{totalItems}</strong> sự kiện
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Số mục / trang:</span>
                <select 
                  value={pageSize} 
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none', background: '#fff' }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>

                <div style={{ display: 'flex', gap: '4px', marginLeft: '10px' }}>
                  <button 
                    disabled={validCurrentPage === 1} 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: validCurrentPage === 1 ? '#F1F5F9' : '#fff', cursor: validCurrentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '12px' }}
                  >
                    ‹ Trước
                  </button>
                  
                  <span style={{ padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center' }}>
                    {validCurrentPage} / {totalPages}
                  </span>

                  <button 
                    disabled={validCurrentPage >= totalPages} 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: validCurrentPage >= totalPages ? '#F1F5F9' : '#fff', cursor: validCurrentPage >= totalPages ? 'not-allowed' : 'pointer', fontSize: '12px' }}
                  >
                    Sau ›
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Thêm/Sửa Sự Kiện */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '1.5rem', background: '#fff', color: '#1E293B', textAlign: 'left', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                {editingEventId ? 'Chỉnh sửa Sự kiện' : 'Thêm Sự kiện giao thương mới'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '18px', cursor: 'pointer' }}><i className="ti ti-x"></i></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>Tên sự kiện <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" id="title" value={formData.title} onChange={handleFormChange} required style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '12.5px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>Ngày tổ chức <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="date" id="event_date" value={formData.event_date} onChange={handleFormChange} required style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '12.5px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>Trạng thái</label>
                    <select id="status" value={formData.status} onChange={handleFormChange} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '12.5px', height: '31.5px' }}>
                      <option value="upcoming">Sắp diễn ra</option>
                      <option value="ongoing">Đang diễn ra</option>
                      <option value="completed">Đã kết thúc</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>Địa điểm tổ chức</label>
                  <input type="text" id="location" value={formData.location} onChange={handleFormChange} placeholder="Ví dụ: GEM Center, Quận 1, TP. HCM..." style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '12.5px' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>Đơn vị tổ chức</label>
                    <input type="text" id="organizer" value={formData.organizer} onChange={handleFormChange} placeholder="Ví dụ: Ban biên tập VTV8.today..." style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '12.5px' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>Sức chứa tối đa (Khách)</label>
                    <input type="number" id="capacity" value={formData.capacity} onChange={handleFormChange} placeholder="Bỏ trống nếu không giới hạn..." style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '12.5px' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>Mô tả sự kiện</label>
                  <textarea id="description" value={formData.description} onChange={handleFormChange} placeholder="Mô tả tóm tắt nội dung chương trình sự kiện..." style={{ width: '100%', height: '80px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '12.5px', resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ padding: '6px 12px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#475569' }}>Hủy</button>
                <button type="submit" style={{ padding: '6px 12px', background: '#1E88E5', border: '1px solid #1E88E5', borderRadius: '6px', fontSize: '12px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Lưu sự kiện</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminEvents;
