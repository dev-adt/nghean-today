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
  const [mobileCategory, setMobileCategory] = useState(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(json => {
      if (json.success && Array.isArray(json.data)) setCategories(json.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const label = item => currentLang === 'en' ? (item.name_en || item.name) : item.name;
  const subcategories = cat => Array.isArray(cat.sub_categories) ? cat.sub_categories : [];
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleLogo = e => {
    if (location.pathname === '/') {
      e.preventDefault();
      setOpen(false);
      scrollTop();
    }
  };

  return <>
    <header className="na-navbar">
      <div className="na-nav-inner">
        <Link className="na-brand" to="/" onClick={handleLogo} aria-label="Nghean.today - Lên đầu trang"><span className="na-logo-mark"><img src="/nghean-logo.svg" alt="" /></span><span><strong>Nghean.today</strong><small>Kết nối Nghệ An – Lan tỏa giá trị</small></span></Link>
        <nav className="na-desktop-nav" aria-label="Chuyên mục">
          {categories.map(cat => {
            const subs = subcategories(cat);
            return <div className="na-nav-category" key={cat.id || cat.name}>
              <Link className={location.search.includes(encodeURIComponent(cat.name)) ? 'active' : ''} to={`/posts?category=${encodeURIComponent(cat.name)}`}><span>{label(cat)}</span>{subs.length > 0 && <i className="ti ti-chevron-down" />}</Link>
              {subs.length > 0 && <div className="na-submenu" role="menu">
                <Link className="na-submenu-all" to={`/posts?category=${encodeURIComponent(cat.name)}`}>{currentLang === 'en' ? 'View all' : 'Xem tất cả'} {label(cat)}</Link>
                {subs.map(sub => <Link key={sub.id || sub.name} to={`/posts?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(sub.name)}`}>{label(sub)}</Link>)}
              </div>}
            </div>;
          })}
        </nav>
        <div className="na-nav-actions">
          <div className="na-lang"><button className={currentLang === 'vi' ? 'active' : ''} onClick={() => changeLang('vi')}>VI</button><button className={currentLang === 'en' ? 'active' : ''} onClick={() => changeLang('en')}>EN</button></div>
          <Link className="na-login" to={role === 'guest' ? '/login' : role === 'admin' ? '/admin-dashboard' : '/member-dashboard'}>{role === 'guest' ? 'Đăng nhập' : 'Tài khoản'}</Link>
          {role === 'guest' ? <Link className="na-join" to="/register">Tham gia</Link> : <button className="na-logout" onClick={logout}>Thoát</button>}
          <button className="na-menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Đóng menu' : 'Mở menu'}><i className={`ti ti-${open ? 'x' : 'menu-2'}`} /></button>
        </div>
      </div>
      {open && <nav className="na-mobile-nav" aria-label="Menu di động">
        {categories.map(cat => {
          const subs = subcategories(cat);
          const expanded = mobileCategory === cat.id;
          return <div className="na-mobile-category" key={cat.id || cat.name}>
            <div><Link onClick={() => setOpen(false)} to={`/posts?category=${encodeURIComponent(cat.name)}`}>{label(cat)}</Link>{subs.length > 0 && <button onClick={() => setMobileCategory(expanded ? null : cat.id)} aria-label={`Mở lĩnh vực ${label(cat)}`}><i className={`ti ti-chevron-${expanded ? 'up' : 'down'}`} /></button>}</div>
            {expanded && <div className="na-mobile-subs">{subs.map(sub => <Link key={sub.id || sub.name} onClick={() => setOpen(false)} to={`/posts?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(sub.name)}`}>{label(sub)}</Link>)}</div>}
          </div>;
        })}
        <Link onClick={() => setOpen(false)} to="/members">Danh bạ doanh nghiệp</Link><Link onClick={() => setOpen(false)} to="/ai-chat">Trợ lý AI</Link>
      </nav>}
    </header>
    {showTop && <button className="na-scroll-top" onClick={scrollTop} aria-label="Lên đầu trang" title="Lên đầu trang"><i className="ti ti-arrow-up" /></button>}
  </>;
};
export default Navbar;
