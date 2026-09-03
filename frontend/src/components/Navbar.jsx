import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

export const Navbar = () => {
  const { role, logout } = useAuth();
  const { currentLang, changeLang } = useTranslation();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(json => {
      if (json.success && Array.isArray(json.data) && json.data.length) setCategories(json.data);
    }).catch(() => {});
  }, []);

  const label = cat => currentLang === 'en' ? (cat.name_en || cat.name) : cat.name;

  return <header className="na-navbar">
    <div className="na-nav-inner">
      <Link className="na-brand" to="/" aria-label="Nghean.today - Trang chủ"><span className="na-logo-mark"><i className="ti ti-mountain" /></span><span><strong>Nghean.today</strong><small>Kết nối Nghệ An – Lan tỏa giá trị</small></span></Link>
      <nav className="na-desktop-nav" aria-label="Chuyên mục">
        {categories.map(cat => <Link key={cat.id || cat.name} className={location.search.includes(encodeURIComponent(cat.name)) ? 'active' : ''} to={`/posts?category=${encodeURIComponent(cat.name)}`}>{label(cat)}</Link>)}
      </nav>
      <div className="na-nav-actions">
        <div className="na-lang"><button className={currentLang === 'vi' ? 'active' : ''} onClick={() => changeLang('vi')}>VI</button><button className={currentLang === 'en' ? 'active' : ''} onClick={() => changeLang('en')}>EN</button></div>
        <Link className="na-login" to={role === 'guest' ? '/login' : role === 'admin' ? '/admin-dashboard' : '/member-dashboard'}>{role === 'guest' ? 'Đăng nhập' : 'Tài khoản'}</Link>
        {role === 'guest' ? <Link className="na-join" to="/register">Tham gia</Link> : <button className="na-logout" onClick={logout}>Thoát</button>}
        <button className="na-menu-toggle" onClick={() => setOpen(!open)} aria-label="Mở menu"><i className={`ti ti-${open ? 'x' : 'menu-2'}`} /></button>
      </div>
    </div>
    {open && <nav className="na-mobile-nav">{categories.map(cat => <Link key={cat.id || cat.name} onClick={() => setOpen(false)} to={`/posts?category=${encodeURIComponent(cat.name)}`}>{label(cat)}</Link>)}<Link to="/members">Danh bạ doanh nghiệp</Link><Link to="/ai-chat">Trợ lý AI</Link></nav>}
  </header>;
};
export default Navbar;
