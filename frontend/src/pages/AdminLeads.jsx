import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

export const AdminLeads = () => {
  const { getAuthHeaders } = useAuth();
  const { currentLang } = useTranslation();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected lead for editing notes/status
  const [editingLead, setEditingLead] = useState(null);
  const [editStatus, setEditStatus] = useState('pending');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/leads?status=${statusFilter}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLeads(json.data || []);
        }
      }
    } catch (err) {
      console.error('Lỗi tải danh sách leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setEditStatus(lead.status || 'pending');
    setEditAdminNotes(lead.admin_notes || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingLead) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${editingLead.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: editStatus,
          admin_notes: editAdminNotes
        })
      });
      if (res.ok) {
        alert('Cập nhật trạng thái và ghi chú thành công!');
        setEditingLead(null);
        fetchLeads();
      } else {
        const errJson = await res.json();
        alert('Lỗi: ' + (errJson.error || 'Không thể cập nhật'));
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa thông tin đăng ký của ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        alert('Đã xóa thông tin thành công.');
        fetchLeads();
      }
    } catch (err) {
      alert('Lỗi xóa: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>⏳ Đang chờ</span>;
      case 'contacted':
        return <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>✅ Đã liên hệ</span>;
      case 'other':
        return <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>📝 Khác</span>;
      default:
        return <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{status}</span>;
    }
  };

  const getMemberTypeLabel = (type) => {
    switch (type) {
      case 'member_personal': return 'Hội viên cá nhân / Du khách';
      case 'member_creator': return 'Nhà sáng tạo nội dung / Tác giả';
      case 'member_biz': return 'Doanh nghiệp du lịch / Dịch vụ';
      case 'member_partner': return 'Đối tác địa phương / Cơ quan';
      default: return type || 'N/A';
    }
  };

  return (
    <AdminLayout title="Quản lý Liên hệ & Đăng ký từ Trang chủ">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Controls & Filter */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: statusFilter === 'all' ? '#0284c7' : '#f1f5f9',
                color: statusFilter === 'all' ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Tất cả ({leads.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: statusFilter === 'pending' ? '#f59e0b' : '#f1f5f9',
                color: statusFilter === 'pending' ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              ⏳ Đang chờ
            </button>
            <button
              onClick={() => setStatusFilter('contacted')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: statusFilter === 'contacted' ? '#10b981' : '#f1f5f9',
                color: statusFilter === 'contacted' ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              ✅ Đã liên hệ
            </button>
            <button
              onClick={() => setStatusFilter('other')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: statusFilter === 'other' ? '#8b5cf6' : '#f1f5f9',
                color: statusFilter === 'other' ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              📝 Khác
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Tìm theo tên, sđt, email, đơn vị..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              Tìm
            </button>
          </form>
        </div>

        {/* Leads Table */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          border: '1px solid #e2e8f0'
        }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <i className="ti ti-loader-2 animate-spin" style={{ fontSize: '24px', marginRight: '8px' }}></i>
              Đang tải danh sách đăng ký...
            </div>
          ) : leads.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <i className="ti ti-inbox" style={{ fontSize: '32px', marginBottom: '8px', display: 'block', color: '#cbd5e1' }}></i>
              Không tìm thấy thông tin đăng ký nào phù hợp.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Khách hàng / Liên hệ</th>
                  <th style={{ padding: '12px 16px' }}>Loại hội viên & Đơn vị</th>
                  <th style={{ padding: '12px 16px' }}>Nhu cầu tư vấn / Ghi chú</th>
                  <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                  <th style={{ padding: '12px 16px' }}>Thời gian gửi</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{lead.full_name}</div>
                      <div style={{ color: '#dc2626', fontWeight: '600', marginTop: '3px' }}>
                        <i className="ti ti-phone" style={{ marginRight: '4px' }}></i>
                        {lead.phone}
                      </div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>
                        <i className="ti ti-mail" style={{ marginRight: '4px' }}></i>
                        {lead.email}
                      </div>
                      {lead.city && (
                        <div style={{ color: '#0284c7', fontSize: '11.5px', marginTop: '2px' }}>
                          <i className="ti ti-map-pin" style={{ marginRight: '4px' }}></i>
                          {lead.city}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{getMemberTypeLabel(lead.member_type)}</div>
                      {lead.company_name && (
                        <div style={{ color: '#0284c7', fontWeight: '600', fontSize: '12.5px', marginTop: '3px' }}>
                          🏢 {lead.company_name}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top', maxWidth: '320px' }}>
                      <div style={{ color: '#334155', lineHeight: '1.5' }}>
                        {lead.notes ? lead.notes : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Không có ghi chú</span>}
                      </div>
                      {lead.admin_notes && (
                        <div style={{ marginTop: '8px', padding: '6px 10px', backgroundColor: '#f8fafc', borderRadius: '6px', borderLeft: '3px solid #0284c7', fontSize: '12px', color: '#0369a1' }}>
                          <strong>Ghi chú Admin:</strong> {lead.admin_notes}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                      {getStatusBadge(lead.status)}
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top', color: '#64748b', fontSize: '12px' }}>
                      {new Date(lead.created_at).toLocaleString('vi-VN')}
                    </td>

                    <td style={{ padding: '14px 16px', verticalAlign: 'top', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => openEditModal(lead)}
                          style={{
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Cập nhật trạng thái"
                        >
                          <i className="ti ti-edit"></i>
                          <span>Xử lý</span>
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id, lead.full_name)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                          title="Xóa"
                        >
                          <i className="ti ti-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit Status & Notes Modal */}
        {editingLead && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              maxWidth: '520px',
              width: '100%',
              padding: '1.8rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.8rem' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                  Xử lý Đăng ký / Liên hệ: {editingLead.full_name}
                </h3>
                <button onClick={() => setEditingLead(null)} style={{ background: 'none', border: 'none', fontSize: '18px', color: '#64748b', cursor: 'pointer' }}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Trạng thái liên hệ *
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px',
                      outline: 'none',
                      backgroundColor: '#fff'
                    }}
                  >
                    <option value="pending">⏳ Đang chờ (Chưa liên hệ)</option>
                    <option value="contacted">✅ Đã liên hệ (Đã trao đổi tư vấn)</option>
                    <option value="other">📝 Khác (Ghi chú chi tiết bên dưới)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Ghi chú của Ban Quản Trị
                  </label>
                  <textarea
                    rows={4}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Nhập ghi chú rõ ràng về kết quả liên hệ, lịch hẹn, yêu cầu của khách hàng..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setEditingLead(null)}
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '9px 16px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '9px 18px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminLeads;
