import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { CATEGORIES_DATA, getCategoryLabel } from '../constants/categories';

export const Navbar = () => {
  const { role, user, logout } = useAuth();
  const { currentLang, changeLang, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES_DATA);
  const [exploreDropdown, setExploreDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setCategoriesList(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic categories in Navbar", err);
      }
    };
    fetchCategories();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'V8';
    return name.trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleNavScroll = (anchorId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/#' + anchorId);
    }
  };

  return (
    <header className="vtv8-navbar-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(8, 24, 43, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '0.65rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand Logo & Tagline */}
        <Link 
          to="/" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', flexShrink: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: '22px',
              fontWeight: '900',
              color: '#ffffff',
              letterSpacing: '-0.5px'
            }}>
              VTV8<span style={{ color: '#ef4444' }}>.today</span>
            </span>
          </div>
          <span style={{
            fontSize: '9px',
            letterSpacing: '1px',
            color: '#93c5fd',
            fontWeight: '600',
            textTransform: 'uppercase',
            marginTop: '-2px'
          }}>
            {currentLang === 'en' ? 'Culture • Heritage • History • Tourism' : 'VĂN HÓA - DI SẢN - LỊCH SỬ - DU LỊCH'}
          </span>
        </Link>

        {/* Center Nav Menu Links */}
        <nav className="vtv8-nav-center" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.8rem, 1.6vw, 1.5rem)',
          flexWrap: 'nowrap'
        }}>
          <Link
            to="/"
            style={{
              color: location.pathname === '/' ? '#ffffff' : '#cbd5e1',
              fontWeight: location.pathname === '/' ? '700' : '500',
              fontSize: '13.5px',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {currentLang === 'en' ? 'Home' : 'Trang chủ'}
          </Link>

          {/* Explore Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setExploreDropdown(true)}
            onMouseLeave={() => setExploreDropdown(false)}
          >
            <Link
              to="/posts"
              style={{
                color: '#cbd5e1',
                fontWeight: '500',
                fontSize: '13.5px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 0'
              }}
            >
              <span>{currentLang === 'en' ? 'Explore' : 'Khám phá'}</span>
              <i className="ti ti-chevron-down" style={{ fontSize: '11px' }}></i>
            </Link>

            {exploreDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '260px',
                backgroundColor: '#0a1d30',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 0',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                zIndex: 2000
              }}>
                {categoriesList.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id || cat.name}
                    to={`/posts?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setExploreDropdown(false)}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#e2e8f0',
                      textDecoration: 'none',
                      fontSize: '13px',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#38bdf8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#e2e8f0'; }}
                  >
                    {getCategoryLabel(cat, currentLang)}
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '4px' }}>
                  <Link
                    to="/posts"
                    onClick={() => setExploreDropdown(false)}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      color: '#f59e0b',
                      fontWeight: '600',
                      textDecoration: 'none',
                      fontSize: '12.5px'
                    }}
                  >
                    {currentLang === 'en' ? 'View all categories →' : 'Xem toàn bộ chuyên mục →'}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavScroll('diem-den-tieu-bieu')}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              fontWeight: '500',
              fontSize: '13.5px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {currentLang === 'en' ? 'Destinations' : 'Điểm đến'}
          </button>

          <button
            onClick={() => handleNavScroll('goi-y-hanh-trinh')}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              fontWeight: '500',
              fontSize: '13.5px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {currentLang === 'en' ? 'Itineraries' : 'Hành trình'}
          </button>

          <Link
            to="/members"
            style={{
              color: '#cbd5e1',
              fontWeight: '500',
              fontSize: '13.5px',
              textDecoration: 'none'
            }}
          >
            {currentLang === 'en' ? 'Members' : 'Hội viên'}
          </Link>

          <button
            onClick={() => handleNavScroll('gia-nhap-cong-dong')}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              fontWeight: '500',
              fontSize: '13.5px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {currentLang === 'en' ? 'Partners' : 'Đối tác'}
          </button>

          <button
            onClick={() => handleNavScroll('ve-chung-toi')}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              fontWeight: '500',
              fontSize: '13.5px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {currentLang === 'en' ? 'About Us' : 'Về chúng tôi'}
          </button>

          <button
            onClick={() => handleNavScroll('lien-he-he-sinh-thai')}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              fontWeight: '500',
              fontSize: '13.5px',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {currentLang === 'en' ? 'Contact' : 'Liên hệ'}
          </button>

          {/* AI Chat Link */}
          <Link
            to="/ai-chat"
            style={{
              color: '#38bdf8',
              fontWeight: '700',
              fontSize: '12.5px',
              textDecoration: 'none',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <i className="ti ti-sparkles" style={{ fontSize: '13px' }}></i>
            <span>AI Bot</span>
          </Link>
        </nav>

        {/* Right side Actions: Language Switcher, Register CTA, User Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Language Switcher (VI | EN Pill) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '2px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <button
              onClick={() => changeLang('vi')}
              style={{
                background: currentLang === 'vi' ? '#ef4444' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: currentLang === 'vi' ? '700' : '500',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              VI
            </button>
            <button
              onClick={() => changeLang('en')}
              style={{
                background: currentLang === 'en' ? '#ef4444' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: currentLang === 'en' ? '700' : '500',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              EN
            </button>
          </div>

          {/* Primary CTA Button: Đăng ký hội viên */}
          <Link
            to="/register"
            className="vtv8-btn-register"
            style={{
              backgroundColor: '#dc2626',
              backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: '700',
              padding: '7px 14px',
              borderRadius: '6px',
              textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(220, 38, 38, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <i className="ti ti-user-plus" style={{ fontSize: '14px' }}></i>
            <span>{currentLang === 'en' ? 'Join as Member' : 'Đăng ký hội viên'}</span>
          </Link>

          {/* User Status / Dashboard */}
          {role === 'guest' ? (
            <Link
              to="/login"
              style={{
                color: '#cbd5e1',
                fontSize: '12.5px',
                textDecoration: 'none',
                fontWeight: '500',
                padding: '6px 8px'
              }}
            >
              {currentLang === 'en' ? 'Login' : 'Đăng nhập'}
            </Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link
                to={role === 'admin' ? "/admin-dashboard" : role === 'creator' ? "/creator-dashboard" : "/member-dashboard"}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  border: '1.5px solid #ffffff'
                }}
                title={user?.name || 'Dashboard'}
              >
                {getInitials(user?.name)}
              </Link>
              <button
                onClick={() => logout()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: '2px 4px'
                }}
                title="Đăng xuất"
              >
                <i className="ti ti-logout"></i>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="vtv8-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '22px',
              cursor: 'pointer',
              display: 'none',
              padding: '4px'
            }}
          >
            <i className={mobileMenuOpen ? "ti ti-x" : "ti ti-menu-2"}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#08182b',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          maxHeight: '75vh',
          overflowY: 'auto'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700' }}>
            {currentLang === 'en' ? 'Home' : 'Trang chủ'}
          </Link>
          <Link to="/posts" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600' }}>
            {currentLang === 'en' ? 'Explore Articles' : 'Khám phá chuyên mục'}
          </Link>
          <button onClick={() => handleNavScroll('diem-den-tieu-bieu')} style={{ background: 'none', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: 0, fontSize: '14px', fontWeight: '600' }}>
            {currentLang === 'en' ? 'Featured Destinations' : 'Điểm đến tiêu biểu'}
          </button>
          <button onClick={() => handleNavScroll('goi-y-hanh-trinh')} style={{ background: 'none', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: 0, fontSize: '14px', fontWeight: '600' }}>
            {currentLang === 'en' ? 'Suggested Itineraries' : 'Gợi ý hành trình'}
          </button>
          <Link to="/members" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600' }}>
            {currentLang === 'en' ? 'Ecosystem Members' : 'Cộng đồng Hội viên'}
          </Link>
          <button onClick={() => handleNavScroll('ve-chung-toi')} style={{ background: 'none', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: 0, fontSize: '14px', fontWeight: '600' }}>
            {currentLang === 'en' ? 'About VTV8.today' : 'Về chúng tôi'}
          </button>
          <button onClick={() => handleNavScroll('lien-he-he-sinh-thai')} style={{ background: 'none', border: 'none', color: '#cbd5e1', textAlign: 'left', padding: 0, fontSize: '14px', fontWeight: '600' }}>
            {currentLang === 'en' ? 'Contact & Collaboration' : 'Liên hệ & Hợp tác'}
          </button>
          <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }}>
            {currentLang === 'en' ? 'AI Assistant 24/7' : 'Trợ lý AI đa ngôn ngữ'}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
