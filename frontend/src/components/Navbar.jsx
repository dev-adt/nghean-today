import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { CATEGORIES_DATA, getCategoryLabel, getSubCategoryLabel } from '../constants/categories';

// Compact label dictionary for the top navigation bar to prevent horizontal overflow
const SHORT_NAV_LABELS = {
  'Văn hóa – Du lịch': { vi: 'Văn hóa', en: 'Culture' },
  'Di sản – Lịch sử': { vi: 'Di sản', en: 'Heritage' },
  'Điểm đến nổi bật': { vi: 'Điểm đến', en: 'Destinations' },
  'Lễ hội và sự kiện': { vi: 'Lễ hội', en: 'Festivals' },
  'Ẩm thực Việt Nam': { vi: 'Ẩm thực', en: 'Cuisine' },
  'Con người và làng nghề': { vi: 'Làng nghề', en: 'Crafts' },
  'Chuyển đổi số & Du lịch thông minh': { vi: 'Số hóa', en: 'Smart Tech' },
  'Hợp tác & Dịch vụ doanh nghiệp': { vi: 'Doanh nghiệp', en: 'Enterprises' }
};

export const Navbar = () => {
  const { role, user, logout } = useAuth();
  const { currentLang, changeLang, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState(CATEGORIES_DATA);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [mobileExpandedCatId, setMobileExpandedCatId] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load dynamic categories & subcategories from Backend / Database
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            setCategoriesList(json.data);
          }
        }
      } catch (err) {
        console.warn('Navbar: Dùng dữ liệu danh mục mặc định.', err.message);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  // Handle dropdown hover with slight debounce
  const handleMouseEnter = (catId) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdownId(catId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdownId(null);
    }, 150);
  };

  const getInitials = (name) => {
    if (!name) return 'V8';
    return name.trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  // Full name for dropdown and accessibility
  const getFullDisplayName = (cat) => {
    if (currentLang === 'en') {
      return cat.name_en || getCategoryLabel(cat.name, 'en');
    }
    return cat.name;
  };

  // Compact short label for the top-bar to keep the menu sleek & single-line
  const getShortNavLabel = (cat) => {
    const rawName = cat.name || '';
    if (SHORT_NAV_LABELS[rawName]) {
      return currentLang === 'en' ? SHORT_NAV_LABELS[rawName].en : SHORT_NAV_LABELS[rawName].vi;
    }
    if (currentLang === 'en' && cat.name_en) {
      return cat.name_en.length > 14 ? cat.name_en.substring(0, 12) + '...' : cat.name_en;
    }
    return rawName.length > 14 ? rawName.substring(0, 12) + '...' : rawName;
  };

  const getSubDisplayName = (sub) => {
    if (typeof sub === 'object' && sub !== null) {
      if (currentLang === 'en') {
        return sub.name_en || getSubCategoryLabel(sub.name, 'en');
      }
      return sub.name;
    }
    return getSubCategoryLabel(sub, currentLang);
  };

  const getSubList = (cat) => {
    if (Array.isArray(cat.sub_categories) && cat.sub_categories.length > 0) {
      return cat.sub_categories;
    }
    if (Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
      return cat.subcategories;
    }
    return [];
  };

  return (
    <header className="vtv8-navbar-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: '#071628',
      backgroundImage: 'linear-gradient(to right, #071628 0%, #0b1f36 50%, #071628 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
      width: '100%',
      overflow: 'visible'
    }}>
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0.45rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(0.5rem, 1.5vw, 1.25rem)',
        flexWrap: 'nowrap',
        overflow: 'visible'
      }}>
        {/* 1. BRAND LOGO */}
        <Link 
          to="/" 
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            textDecoration: 'none', 
            flexShrink: 0 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
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
            fontSize: '8.5px',
            letterSpacing: '0.8px',
            color: '#93c5fd',
            fontWeight: '600',
            textTransform: 'uppercase',
            marginTop: '-3px'
          }}>
            {currentLang === 'en' ? 'Culture • Heritage • Tourism' : 'VĂN HÓA - DI SẢN - DU LỊCH'}
          </span>
        </Link>

        {/* 2. CENTER NAVIGATION: COMPACT, SINGLE-LINE & ZERO OVERFLOW */}
        <nav className="vtv8-nav-center" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.2rem, 0.5vw, 0.6rem)',
          flexWrap: 'nowrap',
          flexShrink: 1,
          overflow: 'visible'
        }}>
          {/* Dynamic Categories (Top 6) */}
          {categoriesList.slice(0, 6).map((cat) => {
            const subs = getSubList(cat);
            const hasSubs = subs.length > 0;
            const isOpen = activeDropdownId === (cat.id || cat.name);
            const isCatActive = location.pathname === '/posts' && location.search.includes(encodeURIComponent(cat.name));

            return (
              <div
                key={cat.id || cat.name}
                style={{ position: 'relative', flexShrink: 0 }}
                onMouseEnter={() => handleMouseEnter(cat.id || cat.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={`/posts?category=${encodeURIComponent(cat.name)}`}
                  style={{
                    color: isCatActive ? '#38bdf8' : '#e2e8f0',
                    backgroundColor: isOpen || isCatActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    fontWeight: isCatActive ? '700' : '600',
                    fontSize: '13px',
                    textDecoration: 'none',
                    padding: '5px 8px',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    transition: 'all 0.18s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCatActive) e.currentTarget.style.color = '#38bdf8';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCatActive) e.currentTarget.style.color = '#e2e8f0';
                    if (!isOpen && !isCatActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title={getFullDisplayName(cat)}
                >
                  <span>{getShortNavLabel(cat)}</span>
                  {hasSubs && (
                    <i className="ti ti-chevron-down" style={{
                      fontSize: '10px',
                      opacity: 0.75,
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.18s ease'
                    }}></i>
                  )}
                </Link>

                {/* Subcategory Dropdown Panel */}
                {hasSubs && isOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    minWidth: '240px',
                    backgroundColor: '#091c30',
                    backgroundImage: 'linear-gradient(180deg, #0b223a 0%, #081726 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '10px',
                    padding: '6px 0',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65)',
                    zIndex: 2000,
                    animation: 'fadeInDown 0.15s ease-out'
                  }}>
                    {/* Header with Full Category Name */}
                    <Link
                      to={`/posts?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setActiveDropdownId(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 14px',
                        color: '#f59e0b',
                        fontWeight: '700',
                        fontSize: '12.5px',
                        textDecoration: 'none',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        marginBottom: '4px'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.12)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span>{getFullDisplayName(cat)}</span>
                      <i className="ti ti-arrow-right" style={{ fontSize: '11px' }}></i>
                    </Link>

                    {/* Subcategories list */}
                    {subs.map((sub, idx) => {
                      const subName = typeof sub === 'object' ? sub.name : sub;
                      const subLabel = getSubDisplayName(sub);
                      return (
                        <Link
                          key={idx}
                          to={`/posts?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(subName)}`}
                          onClick={() => setActiveDropdownId(null)}
                          style={{
                            display: 'block',
                            padding: '6px 14px',
                            color: '#cbd5e1',
                            textDecoration: 'none',
                            fontSize: '12.5px',
                            fontWeight: '500',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.paddingLeft = '18px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#cbd5e1';
                            e.currentTarget.style.paddingLeft = '14px';
                          }}
                        >
                          • {subLabel}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Members Link */}
          <Link
            to="/members"
            style={{
              color: location.pathname === '/members' ? '#38bdf8' : '#e2e8f0',
              backgroundColor: location.pathname === '/members' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              fontWeight: location.pathname === '/members' ? '700' : '600',
              fontSize: '13px',
              textDecoration: 'none',
              padding: '5px 8px',
              borderRadius: '7px',
              transition: 'all 0.18s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/members') e.currentTarget.style.color = '#38bdf8';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/members') e.currentTarget.style.color = '#e2e8f0';
              if (location.pathname !== '/members') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {currentLang === 'en' ? 'Members' : 'Hội viên'}
          </Link>

          {/* AI Bot Pill */}
          <Link
            to="/ai-chat"
            style={{
              color: '#38bdf8',
              fontWeight: '700',
              fontSize: '12px',
              textDecoration: 'none',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              padding: '4px 10px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.18s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.25)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <i className="ti ti-sparkles" style={{ fontSize: '12px', color: '#f59e0b' }}></i>
            <span>AI Bot</span>
          </Link>
        </nav>

        {/* 3. RIGHT ACTIONS: LANGUAGE SWITCHER + REGISTER + LOGIN/PROFILE */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          {/* Language Switcher (VI | EN Pill) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '2px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <button
              onClick={() => changeLang('vi')}
              style={{
                background: currentLang === 'vi' ? '#ef4444' : 'transparent',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '2px 7px',
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
                borderRadius: '14px',
                padding: '2px 7px',
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
            style={{
              backgroundColor: '#dc2626',
              backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '700',
              padding: '6px 12px',
              borderRadius: '6px',
              textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(220, 38, 38, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              transition: 'transform 0.18s, box-shadow 0.18s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 5px 14px rgba(220, 38, 38, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 3px 10px rgba(220, 38, 38, 0.35)';
            }}
          >
            <i className="ti ti-user-plus" style={{ fontSize: '13px' }}></i>
            <span>{currentLang === 'en' ? 'Join' : 'Đăng ký'}</span>
          </Link>

          {/* User Status / Login */}
          {role === 'guest' ? (
            <Link
              to="/login"
              style={{
                color: '#cbd5e1',
                fontSize: '12.5px',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '5px 8px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; }}
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
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  border: '1.5px solid #ffffff',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)'
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
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '3px'
                }}
                title={currentLang === 'en' ? "Logout" : "Đăng xuất"}
              >
                <i className="ti ti-logout"></i>
              </button>
            </div>
          )}

          {/* Mobile Drawer Toggle */}
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
              padding: '2px 4px'
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
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          {/* Categories on Mobile */}
          {categoriesList.map((cat) => {
            const subs = getSubList(cat);
            const isExpanded = mobileExpandedCatId === (cat.id || cat.name);

            return (
              <div key={cat.id || cat.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link
                    to={`/posts?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '600', fontSize: '13.5px', flex: 1, padding: '4px 0' }}
                  >
                    {getFullDisplayName(cat)}
                  </Link>
                  {subs.length > 0 && (
                    <button
                      onClick={() => setMobileExpandedCatId(isExpanded ? null : (cat.id || cat.name))}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '4px 8px', fontSize: '14px', cursor: 'pointer' }}
                    >
                      <i className={isExpanded ? "ti ti-chevron-up" : "ti ti-chevron-down"}></i>
                    </button>
                  )}
                </div>

                {subs.length > 0 && isExpanded && (
                  <div style={{ paddingLeft: '12px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {subs.map((sub, idx) => {
                      const subName = typeof sub === 'object' ? sub.name : sub;
                      const subLabel = getSubDisplayName(sub);
                      return (
                        <Link
                          key={idx}
                          to={`/posts?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(subName)}`}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{ color: '#93c5fd', textDecoration: 'none', fontSize: '12.5px', padding: '3px 0' }}
                        >
                          • {subLabel}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <Link to="/members" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', padding: '6px 0', fontSize: '13.5px' }}>
            {currentLang === 'en' ? 'Ecosystem Members' : 'Cộng đồng Hội viên'}
          </Link>

          <Link to="/events" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', padding: '6px 0', fontSize: '13.5px' }}>
            {currentLang === 'en' ? 'Events & Festivals' : 'Sự kiện & Lễ hội'}
          </Link>

          <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700', padding: '6px 0', fontSize: '13.5px' }}>
            <i className="ti ti-sparkles" style={{ marginRight: '6px' }}></i>
            {currentLang === 'en' ? 'AI Assistant 24/7' : 'Trợ lý AI đa ngôn ngữ'}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
