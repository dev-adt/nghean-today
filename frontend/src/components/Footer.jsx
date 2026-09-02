import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';

export const Footer = () => {
  const { currentLang } = useTranslation();

  return (
    <footer style={{
      backgroundColor: '#111827',
      backgroundImage: 'linear-gradient(180deg, #0b1320 0%, #060c16 100%)',
      color: '#94a3b8',
      padding: '3.5rem 0 1.5rem',
      fontSize: '12.5px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      lineHeight: '1.65'
    }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Main 4-Column Footer Grid matching vtv8.vtv.vn */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Column 1: Logo & Brand Title */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
              <img 
                src="/vtv8_logo.png" 
                alt="VTV8 Logo" 
                style={{ height: '46px', width: 'auto', maxHeight: '46px', objectFit: 'contain', display: 'block' }} 
              />
            </Link>
            <div style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: '12px',
              fontWeight: '800',
              color: '#e2e8f0',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              lineHeight: '1.5',
              marginTop: '0.5rem'
            }}>
              {currentLang === 'en'
                ? 'SPECIALIZED DIGITAL PORTAL FOR CULTURE, HERITAGE, HISTORY AND TOURISM VTV8'
                : 'CHUYÊN TRANG VĂN HÓA, DI SẢN, LỊCH SỬ VÀ DU LỊCH VTV8'}
            </div>
            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: '600', marginTop: '4px', letterSpacing: '0.4px' }}>
              {currentLang === 'en' ? 'NATIONAL TELEVISION CHANNEL — VTV8.VN' : 'KÊNH TRUYỀN HÌNH QUỐC GIA — VTV8.VN'}
            </div>
          </div>

          {/* Column 2: Agency & Regulatory Management */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#64748b' }}>Cơ quan chủ quản:</span>{' '}
              <strong style={{ color: '#f1f5f9' }}>Đài Truyền hình Việt Nam (VTV)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Cơ quan quản lý trực tiếp:</span>{' '}
              <strong style={{ color: '#f1f5f9' }}>Trung tâm Truyền hình Việt Nam khu vực Miền Trung – Tây Nguyên (VTV8)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Cơ quan báo chí:</span>{' '}
              <strong style={{ color: '#f1f5f9' }}>Thời báo VTV</strong>
            </div>
            <div style={{ marginTop: '4px', color: '#cbd5e1', lineHeight: '1.5' }}>
              Giấy phép hoạt động báo in và báo điện tử số <strong style={{ color: '#f59e0b' }}>483/GP-BTTTT</strong> do Cục Phát thanh, truyền hình và thông tin điện tử – Bộ Thông tin và Truyền thông cấp ngày <strong style={{ color: '#f1f5f9' }}>29/12/2023</strong>
            </div>
          </div>

          {/* Column 3: Editorial Board & Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#64748b' }}>Chịu trách nhiệm nội dung:</span>{' '}
              <strong style={{ color: '#f1f5f9' }}>Nhà báo Nguyễn Lâm Thanh – Giám đốc VTV8</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Tổng Biên tập:</span>{' '}
              <strong style={{ color: '#f1f5f9' }}>Vũ Thanh Thủy</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Phó Tổng Biên Tập:</span>{' '}
              <span style={{ color: '#cbd5e1' }}>Nguyễn Thị Mỹ Hạnh, Phạm Quốc Thắng, Nguyễn Trọng Ninh</span>
            </div>
            <div style={{ marginTop: '2px' }}>
              <span style={{ color: '#64748b' }}>Tổng đài VTV:</span>{' '}
              <span style={{ color: '#cbd5e1' }}>024-3835.5931 - 024-3835.5932</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Điện thoại Thời báo VTV / VTV8:</span>{' '}
              <span style={{ color: '#cbd5e1' }}>024-6689.7897</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Email:</span>{' '}
              <a href="mailto:toasoan@vtv.vn" style={{ color: '#38bdf8', textDecoration: 'none' }}>toasoan@vtv.vn</a>
            </div>
          </div>

          {/* Column 4: Advertising, Office Address & Social Media */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '13px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {currentLang === 'en' ? 'Advertising & Communications' : 'Liên hệ quảng cáo và truyền thông'}
            </div>
            <div style={{ color: '#cbd5e1' }}>
              Trung tâm Truyền hình Việt Nam khu vực Miền Trung – Tây Nguyên (VTV8)
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <i className="ti ti-map-pin" style={{ color: '#eebd44', marginTop: '3px', flexShrink: 0 }}></i>
              <span><strong>Địa chỉ:</strong> 258 Bạch Đằng, phường Hải Châu, thành phố Đà Nẵng</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
              <a href="tel:0905884040" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="ti ti-phone"></i> 0905 884 040
              </a>
              <span style={{ color: '#475569' }}>|</span>
              <a href="mailto:vtv8.vtv.vn@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="ti ti-mail"></i> vtv8.vtv.vn@gmail.com
              </a>
            </div>

            {/* Social Media Links matching vtv8 */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                {currentLang === 'en' ? 'Follow us on platforms:' : 'Theo dõi chúng tôi trên các nền tảng:'}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textDecoration: 'none', transition: 'transform 0.2s' }}
                  title="Facebook VTV8"
                >
                  <i className="ti ti-brand-facebook" style={{ fontSize: '16px' }}></i>
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textDecoration: 'none', transition: 'transform 0.2s' }}
                  title="YouTube VTV8"
                >
                  <i className="ti ti-brand-youtube" style={{ fontSize: '16px' }}></i>
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#000000', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textDecoration: 'none', transition: 'transform 0.2s' }}
                  title="TikTok VTV8"
                >
                  <i className="ti ti-brand-tiktok" style={{ fontSize: '16px' }}></i>
                </a>
                <Link 
                  to="/ai-chat"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', textDecoration: 'none', transition: 'transform 0.2s' }}
                  title="Trợ lý AI VTV8"
                >
                  <i className="ti ti-sparkles" style={{ fontSize: '15px' }}></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright Sub-bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.4rem',
          textAlign: 'center',
          fontSize: '11.5px',
          color: '#64748b',
          lineHeight: '1.6'
        }}>
          <div>
            ® Cấm sao chép dưới mọi hình thức nếu không có sự chấp thuận bằng văn bản. Ghi rõ nguồn <strong>"VTV8"</strong> hoặc <strong>"vtv8.vn"</strong> khi phát hành lại thông tin từ website này.
          </div>
          <div style={{ marginTop: '2px', color: '#475569' }}>
            Bản quyền © 2026 thuộc về <strong>Đài Truyền hình Việt Nam (VTV8)</strong>.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
