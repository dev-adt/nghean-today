import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

export const Footer = () => {
  const { currentLang } = useTranslation();

  return (
    <footer style={{
      backgroundColor: '#051322',
      color: '#94a3b8',
      padding: '4rem 0 2.5rem',
      fontSize: '13px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* 4-Column Footer Navigation Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Column 1: Brand Info */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
              <img 
                src="/vtv8_logo.png" 
                alt="VTV8.vn Logo" 
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                  fontSize: '22px',
                  fontWeight: '900',
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.1
                }}>
                  VTV8<span style={{ color: '#eebd44' }}>.vn</span>
                </div>
                <div style={{ fontSize: '8.5px', letterSpacing: '0.8px', color: '#93c5fd', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>
                  {currentLang === 'en' ? 'Culture • Heritage • History • Tourism' : 'VĂN HÓA - DI SẢN - LỊCH SỬ - DU LỊCH'}
                </div>
              </div>
            </Link>

            <p style={{ lineHeight: '1.65', color: '#94a3b8', fontSize: '12.5px', marginBottom: '1.3rem' }}>
              {currentLang === 'en'
                ? 'National television channel portal for Vietnamese Culture, Heritage, History, and Tourism.'
                : 'Trang thông tin điện tử tổng hợp & Kênh truyền hình Quốc gia về Văn hóa – Di sản – Lịch sử – Du lịch.'}
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="#" style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.2s' }} title="Facebook">
                <i className="ti ti-brand-facebook" style={{ fontSize: '15px' }}></i>
              </a>
              <a href="#" style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.2s' }} title="YouTube">
                <i className="ti ti-brand-youtube" style={{ fontSize: '15px' }}></i>
              </a>
              <a href="#" style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.2s' }} title="TikTok">
                <i className="ti ti-brand-tiktok" style={{ fontSize: '15px' }}></i>
              </a>
              <a href="#" style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.2s' }} title="Website">
                <i className="ti ti-world" style={{ fontSize: '15px' }}></i>
              </a>
            </div>
          </div>

          {/* Column 2: Khám phá */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13.5px', fontWeight: '700', marginBottom: '1.2rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {currentLang === 'en' ? 'Explore' : 'Khám phá'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '12.5px' }}>
              <Link to="/posts?category=Điểm đến nổi bật" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Destinations' : 'Điểm đến nổi bật'}
              </Link>
              <Link to="/posts?category=Di sản – Lịch sử" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Heritage & History' : 'Di sản – Lịch sử'}
              </Link>
              <Link to="/posts?category=Văn hóa – Du lịch" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Culture & Tourism' : 'Văn hóa – Du lịch'}
              </Link>
              <Link to="/posts?category=Ẩm thực Việt Nam" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Vietnamese Cuisine' : 'Ẩm thực Việt Nam'}
              </Link>
              <Link to="/events" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                {currentLang === 'en' ? 'Events & Festivals' : 'Lễ hội & Sự kiện'}
              </Link>
            </div>
          </div>

          {/* Column 3: Hội viên */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13.5px', fontWeight: '700', marginBottom: '1.2rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {currentLang === 'en' ? 'Members' : 'Hội viên'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '12.5px' }}>
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
                {currentLang === 'en' ? 'Content Creators' : 'Nhà sáng tạo nội dung'}
              </Link>
              <Link to="/ai-chat" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '600' }}>
                {currentLang === 'en' ? 'AI Assistant 24/7' : 'Trợ lý AI đa ngôn ngữ'}
              </Link>
            </div>
          </div>

          {/* Column 4: Hỗ trợ & Pháp lý */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '13.5px', fontWeight: '700', marginBottom: '1.2rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {currentLang === 'en' ? 'Support & Legal' : 'Hỗ trợ & Pháp lý'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '12.5px' }}>
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

        {/* Official VTV8 Portal Information Block */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.8rem',
          paddingBottom: '1.8rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
          padding: '1.5rem 1.75rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(238, 189, 68, 0.15)'
        }}>
          <div style={{
            color: '#eebd44',
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            fontWeight: '800',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}>
            TRANG THÔNG TIN ĐIỆN TỬ TỔNG HỢP VTV8
          </div>
          <div style={{
            color: '#93c5fd',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '1rem',
            letterSpacing: '0.2px'
          }}>
            Kênh truyền hình Quốc gia về Văn hóa – Di sản – Lịch sử – Du lịch
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '0.6rem 2rem',
            fontSize: '12.5px',
            lineHeight: '1.65',
            color: '#cbd5e1'
          }}>
            <div>
              <span style={{ color: '#94a3b8' }}>• Cơ quan chủ quản:</span> <strong style={{ color: '#f1f5f9' }}>Đài Truyền hình Việt Nam (VTV)</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>• Cơ quan quản lý trực tiếp:</span> <strong style={{ color: '#f1f5f9' }}>Trung tâm Truyền hình Việt Nam khu vực Miền Trung – Tây Nguyên (VTV8)</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>• Chịu trách nhiệm nội dung:</span> <strong style={{ color: '#f1f5f9' }}>Nhà báo Nguyễn Lâm Thanh – Giám đốc VTV8</strong> <span style={{ color: '#94a3b8', fontSize: '11.5px' }}>(theo Văn bản ủy quyền số: [Số văn bản]-THVN của Tổng Giám đốc Đài Truyền hình Việt Nam)</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>• Giấy phép số:</span> <strong style={{ color: '#f1f5f9' }}>[Số giấy phép]/GP-BTTTT</strong> do Cục Phát thanh, truyền hình và thông tin điện tử – Bộ Thông tin và Truyền thông cấp ngày <strong style={{ color: '#f1f5f9' }}>[Ngày/Tháng/Năm]</strong>
            </div>
          </div>
        </div>

        {/* Contact Information & Copyright Sub-bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          fontSize: '12px',
          color: '#94a3b8',
          lineHeight: '1.6'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', alignItems: 'center' }}>
            <div>
              <i className="ti ti-map-pin" style={{ color: '#eebd44', marginRight: '4px' }}></i>
              <span><strong>Địa chỉ:</strong> 258 Bạch Đằng, Quận Hải Châu, TP. Đà Nẵng</span>
            </div>
            <div>
              <i className="ti ti-phone" style={{ color: '#eebd44', marginRight: '4px' }}></i>
              <span><strong>Điện thoại:</strong> [Số điện thoại]</span>
            </div>
            <div>
              <i className="ti ti-mail" style={{ color: '#eebd44', marginRight: '4px' }}></i>
              <span><strong>Email:</strong> [Email tiếp nhận thông tin/liên hệ công tác]</span>
            </div>
          </div>

          <div style={{ color: '#64748b', fontSize: '11.5px' }}>
            <strong>Bản quyền:</strong> © 2026 thuộc về <strong>Đài Truyền hình Việt Nam (VTV8)</strong>. Ghi rõ nguồn <em>"VTV8"</em> hoặc <em>"vtv8.vn"</em> khi phát hành lại thông tin từ website này.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
