import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { CATEGORIES_DATA, getCategoryLabel, getSubCategoryLabel } from '../constants/categories';

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

  const getDisplayName = (cat) => {
    if (currentLang === 'en') {
      return cat.name_en || getCategoryLabel(cat.name, 'en');
    }
    return cat.name;
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
      backgroundImage: 'linear-gradient(to right, #071628 0%, #0c2138 50%, #071628 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.6rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand Logo & Slogan */}
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: '23px',
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

        {/* Center Nav Menu: Dynamic Categories from Admin & Key Links */}
        <nav className="vtv8-nav-center" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.4rem, 0.9vw, 1rem)',
          flexWrap: 'nowrap'
        }}>
          {/* Dynamic Categories */}
          {categoriesList.slice(0, 6).map((cat) => {
            const subs = getSubList(cat);
            const hasSubs = subs.length > 0;
            const isOpen = activeDropdownId === (cat.id || cat.name);
            const isCatActive = location.pathname === '/posts' && location.search.includes(encodeURIComponent(cat.name));

            return (
              <div
                key={cat.id || cat.name}
                style={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter(cat.id || cat.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={`/posts?category=${encodeURIComponent(cat.name)}`}
                  style={{
                    color: isCatActive ? '#38bdf8' : '#e2e8f0',
                    backgroundColor: isOpen || isCatActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                    fontWeight: isCatActive ? '700' : '600',
                    fontSize: '13.5px',
                    textDecoration: 'none',
                    padding: '6px 11px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease',
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
                >
                  <span>{getDisplayName(cat)}</span>
                  {hasSubs && (
                    <i className="ti ti-chevron-down" style={{
                      fontSize: '11px',
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}></i>
                  )}
                </Link>

                {/* Subcategory Dropdown */}
                {hasSubs && isOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    minWidth: '240px',
                    backgroundColor: '#0c223a',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '10px',
                    padding: '8px 0',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.55)',
                    zIndex: 2000,
                    animation: 'fadeInDown 0.15s ease-out'
                  }}>
                    {/* View all in category link */}
                    <Link
                      to={`/posts?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setActiveDropdownId(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 16px',
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
                      <span>{currentLang === 'en' ? `All ${getDisplayName(cat)}` : `Tất cả ${getDisplayName(cat)}`}</span>
                      <i className="ti ti-arrow-right" style={{ fontSize: '12px' }}></i>
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
                            padding: '7px 16px',
                            color: '#cbd5e1',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.15)';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.paddingLeft = '20px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#cbd5e1';
                            e.currentTarget.style.paddingLeft = '16px';
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
              backgroundColor: location.pathname === '/members' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              fontWeight: location.pathname === '/members' ? '700' : '600',
              fontSize: '13.5px',
              textDecoration: 'none',
              padding: '6px 11px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
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

          {/* AI Chat Button */}
          <Link
            to="/ai-chat"
            style={{
              color: '#38bdf8',
              fontWeight: '700',
              fontSize: '12.5px',
              textDecoration: 'none',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              padding: '5px 12px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(56, 189, 248, 0.2)'
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
            <i className="ti ti-sparkles" style={{ fontSize: '13px', color: '#f59e0b' }}></i>
            <span>AI Bot</span>
          </Link>
        </nav>

        {/* Right side Actions: Language Switcher, Register CTA, User Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Language Switcher (VI | EN Pill) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
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
                padding: '3px 9px',
                fontSize: '11.5px',
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
                padding: '3px 9px',
                fontSize: '11.5px',
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
              padding: '7px 15px',
              borderRadius: '7px',
              textDecoration: 'none',
              boxShadow: '0 3px 12px rgba(220, 38, 38, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 3px 12px rgba(220, 38, 38, 0.4)';
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
                fontSize: '13px',
                textDecoration: 'none',
                fontWeight: '600',
                padding: '6px 10px',
                borderRadius: '6px',
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
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  border: '1.5px solid #ffffff',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
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
                  padding: '4px'
                }}
                title={currentLang === 'en' ? "Logout" : "Đăng xuất"}
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
              fontSize: '24px',
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
          gap: '0.6rem',
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
                    style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '600', fontSize: '14px', flex: 1, padding: '4px 0' }}
                  >
                    {getDisplayName(cat)}
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
                          style={{ color: '#93c5fd', textDecoration: 'none', fontSize: '13px', padding: '3px 0' }}
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

          <Link to="/members" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', padding: '6px 0' }}>
            {currentLang === 'en' ? 'Ecosystem Members' : 'Cộng đồng Hội viên'}
          </Link>

          <Link to="/events" onClick={() => setMobileMenuOpen(false)} style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600', padding: '6px 0' }}>
            {currentLang === 'en' ? 'Events & Festivals' : 'Sự kiện & Lễ hội'}
          </Link>

          <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700', padding: '6px 0' }}>
            <i className="ti ti-sparkles" style={{ marginRight: '6px' }}></i>
            {currentLang === 'en' ? 'AI Assistant 24/7' : 'Trợ lý AI đa ngôn ngữ'}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
