import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('guest'); // guest, member, admin
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục phiên làm việc khi load trang
  useEffect(() => {
    const checkAuth = async () => {
      const adminToken = localStorage.getItem('nghean_admin_token');
      const adminUserStr = localStorage.getItem('nghean_admin_user');
      const memberToken = localStorage.getItem('nghean_member_token');
      const memberUserStr = localStorage.getItem('nghean_member_user');

      const creatorToken = localStorage.getItem('nghean_creator_token');
      const creatorUserStr = localStorage.getItem('nghean_creator_user');

      if (adminToken && adminUserStr) {
        try {
          const res = await fetch('/api/admin/check-auth', {
            headers: { 'Authorization': 'Bearer ' + adminToken }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setRole('admin');
              setUser(data.admin);
              setToken(adminToken);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error("Admin session verification failed", e);
        }
        localStorage.removeItem('nghean_admin_token');
        localStorage.removeItem('nghean_admin_user');
      }

      if (creatorToken && creatorUserStr) {
        try {
          const res = await fetch('/api/creator/profile', {
            headers: { 'Authorization': 'Bearer ' + creatorToken }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setRole('creator');
              setUser(data.creator);
              setToken(creatorToken);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error("Creator session verification failed", e);
        }
        localStorage.removeItem('nghean_creator_token');
        localStorage.removeItem('nghean_creator_user');
      }

      if (memberToken && memberUserStr) {
        try {
          const res = await fetch('/api/member/check-auth', {
            headers: { 'Authorization': 'Bearer ' + memberToken }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setRole('member');
              setUser(data.member);
              setToken(memberToken);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error("Member session verification failed", e);
        }
        localStorage.removeItem('nghean_member_token');
        localStorage.removeItem('nghean_member_user');
      }

      // Fallback về guest
      setRole('guest');
      setUser(null);
      setToken(null);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginCreator = async (username, password) => {
    const res = await fetch('/api/creator/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Đăng nhập Biên tập viên không thành công.');
    }

    setToken(data.token);
    setRole('creator');
    setUser(data.creator);

    localStorage.setItem('nghean_creator_token', data.token);
    localStorage.setItem('nghean_creator_user', JSON.stringify(data.creator));
    localStorage.removeItem('nghean_admin_token');
    localStorage.removeItem('nghean_admin_user');
    localStorage.removeItem('nghean_member_token');
    localStorage.removeItem('nghean_member_user');

    return data;
  };

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Đăng nhập không thành công.');
    }

    setToken(data.token);
    setRole(data.role);

    if (data.role === 'admin') {
      setUser(data.admin);
      localStorage.setItem('nghean_admin_token', data.token);
      localStorage.setItem('nghean_admin_user', JSON.stringify(data.admin));
      localStorage.removeItem('nghean_member_token');
      localStorage.removeItem('nghean_member_user');
      localStorage.removeItem('nghean_creator_token');
      localStorage.removeItem('nghean_creator_user');
    } else if (data.role === 'member') {
      setUser(data.user);
      localStorage.setItem('nghean_member_token', data.token);
      localStorage.setItem('nghean_member_user', JSON.stringify(data.user));
      localStorage.removeItem('nghean_admin_token');
      localStorage.removeItem('nghean_admin_user');
      localStorage.removeItem('nghean_creator_token');
      localStorage.removeItem('nghean_creator_user');
    } else if (data.role === 'creator') {
      const creatorObj = data.creator || data.user;
      setUser(creatorObj);
      localStorage.setItem('nghean_creator_token', data.token);
      localStorage.setItem('nghean_creator_user', JSON.stringify(creatorObj));
      localStorage.removeItem('nghean_admin_token');
      localStorage.removeItem('nghean_admin_user');
      localStorage.removeItem('nghean_member_token');
      localStorage.removeItem('nghean_member_user');
    }

    return data;
  };

  const logout = async () => {
    try {
      if (role === 'admin' && token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
      } else if (role === 'member' && token) {
        await fetch('/api/member/logout', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
      } else if (role === 'creator' && token) {
        await fetch('/api/creator/logout', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
      }
    } catch (e) {
      console.error("Logout API call failed", e);
    }

    localStorage.removeItem('nghean_admin_token');
    localStorage.removeItem('nghean_admin_user');
    localStorage.removeItem('nghean_member_token');
    localStorage.removeItem('nghean_member_user');
    localStorage.removeItem('nghean_creator_token');
    localStorage.removeItem('nghean_creator_user');
    
    setRole('guest');
    setUser(null);
    setToken(null);
  };

  const setGuestMode = () => {
    localStorage.removeItem('nghean_admin_token');
    localStorage.removeItem('nghean_admin_user');
    localStorage.removeItem('nghean_member_token');
    localStorage.removeItem('nghean_member_user');
    localStorage.removeItem('nghean_creator_token');
    localStorage.removeItem('nghean_creator_user');
    setRole('guest');
    setUser(null);
    setToken(null);
  };

  const getAuthHeaders = () => {
    return token ? { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  return (
    <AuthContext.Provider value={{ role, user, token, loading, login, loginCreator, logout, setGuestMode, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
