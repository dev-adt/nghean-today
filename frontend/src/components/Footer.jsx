import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

export const Footer = () => {
  const { currentLang } = useTranslation();

  return (
    <footer style={{
      backgroundColor: '#051322',
      color: '#94a3b8',
      padding: '4.5rem 0 2rem',
      fontSize: '13.5px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* 4-Column Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Column 1: Brand Info */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1.2rem' }}>
              <div style={{
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: '24px',
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: '-0.5px'
              }}>
                VTV8<span style={{ color: '#ef4444' }}>.today</span>
              </div>
              <div style={{ fontSize: '9px', letterSpacing: '1px', color: '#93c5fd', fontWeight: '600', textTransform: 'uppercase' }}>
                {currentLang === 'en' ? 'Culture • Heritage • History • Tourism' : 'VĂN HÓA - DI SẢN - LỊCH SỬ - DU LỊCH'}
              </div>
            </Link>

            <p style={{ lineHeight: '1.7', color: '#94a3b8', fontSize: '13px', marginBottom: '1.5rem' }}>
              {currentLang === 'en'
                ? 'A specialized digital portal promoting Vietnamese tourism, culture, heritage, history, and fostering an active member ecosystem.'
                : 'Chuyên trang quảng bá du lịch, văn hóa, di sản, lịch sử và phát triển cộng đồng hội viên.'}
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none' }} title="Facebook">
                <i className="ti ti-brand-facebook" style={{ fontSize: '16px' }}></i>
              </a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none' }} title="YouTube">
                <i className="ti ti-brand-youtube" style={{ fontSize: '16px' }}></i>
              </a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none' }} title="TikTok">
                <i className="ti ti-brand-tiktok" style={{ fontSize: '16px' }}></i>
              </a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none' }} title="Website">
                <i className="ti ti-world" style={{ fontSize: '16px' }}></i>
              </a>
            </div>
          </div>

          {/* Column 2: Khám phá */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', marginBottom: '1.4rem', letterSpacing: '0.02em' }}>
              {currentLang === 'en' ? 'Explore' : 'Khám phá'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/posts?category=Điểm đến nổi bật" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Destinations' : 'Điểm đến'}
              </Link>
              <Link to="/posts?category=Di sản – Lịch sử" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Heritage & History' : 'Di sản'}
              </Link>
              <Link to="/posts?category=Văn hóa – Du lịch" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Culture' : 'Văn hóa'}
              </Link>
              <Link to="/posts?category=Ẩm thực Việt Nam" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Cuisine' : 'Ẩm thực'}
              </Link>
              <Link to="/posts?category=Điểm đến nổi bật&sub_category=Tuyến du lịch di sản" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Itineraries' : 'Hành trình'}
              </Link>
              <Link to="/events" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Events & Festivals' : 'Lễ hội & Sự kiện'}
              </Link>
            </div>
          </div>

          {/* Column 3: Hội viên */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', marginBottom: '1.4rem', letterSpacing: '0.02em' }}>
              {currentLang === 'en' ? 'Members' : 'Hội viên'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/guide" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Member Benefits' : 'Quyền lợi hội viên'}
              </Link>
              <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Member Registration' : 'Đăng ký hội viên'}
              </Link>
              <Link to="/members" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Enterprise Showrooms' : 'Doanh nghiệp hội viên'}
              </Link>
              <Link to="/register?type=creator" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Content Creators' : 'Nhà sáng tạo'}
              </Link>
              <Link to="/register?type=partner" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Local Partners' : 'Đối tác địa phương'}
              </Link>
              <Link to="/ai-chat" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>
                {currentLang === 'en' ? 'Multi-Agent AI Assistant' : 'Trợ lý AI đa ngôn ngữ'}
              </Link>
            </div>
          </div>

          {/* Column 4: Hỗ trợ & Pháp lý */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', marginBottom: '1.4rem', letterSpacing: '0.02em' }}>
              {currentLang === 'en' ? 'Support & Legal' : 'Hỗ trợ & Pháp lý'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <Link to="/guide#faq" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Frequently Asked Questions' : 'Câu hỏi thường gặp'}
              </Link>
              <Link to="/guide#privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Privacy Policy' : 'Chính sách bảo mật'}
              </Link>
              <Link to="/guide#terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Terms of Service' : 'Điều khoản sử dụng'}
              </Link>
              <Link to="/guide#content-rules" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Content Regulations' : 'Quy chế nội dung'}
              </Link>
              <Link to="/guide#copyright" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Copyright Policy' : 'Chính sách bản quyền'}
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '12px',
          color: '#64748b'
        }}>
          <div>
            © 2026 <strong>VTV8.today</strong>. {currentLang === 'en' ? 'All rights reserved.' : 'Bảo lưu mọi quyền.'}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
