import React from 'react';
import { Link } from 'react-router-dom';
import brandConfig from '../brand.config';

export const Footer = () => <footer className="na-footer"><div className="na-container">
  <div className="na-footer-grid">
    <div className="na-footer-brand">
      <Link className="na-brand footer" to="/"><span className="na-logo-mark"><img src="/nghean-logo.svg" alt="" /></span><span><strong>Nghean.today</strong><small>Kết nối Nghệ An – Lan tỏa giá trị</small></span></Link>
      <p>Nền tảng kết nối người dân, doanh nghiệp, nhà đầu tư và những người yêu mến Nghệ An trên toàn thế giới.</p>
      <div className="na-socials"><a href={brandConfig.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><i className="ti ti-brand-facebook" /></a><a href={brandConfig.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><i className="ti ti-brand-youtube" /></a><a href={brandConfig.socials.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><i className="ti ti-brand-tiktok" /></a></div>
    </div>
    <div><h3>Khám phá</h3><Link to="/posts">Tin tức Nghệ An</Link><Link to="/members">Danh bạ doanh nghiệp</Link><Link to="/events">Sự kiện & Lễ hội</Link><Link to="/ai-chat">Trợ lý AI đa ngôn ngữ</Link></div>
    <div><h3>Thông tin</h3><Link to="/guide">Hướng dẫn sử dụng</Link><Link to="/register">Đăng ký thành viên</Link><a href={`mailto:${brandConfig.contact.supportEmail}`}>Liên hệ hỗ trợ</a><Link to="/guide">Chính sách bảo mật</Link></div>
    <div><h3>Đăng ký nhận bản tin</h3><p>Nhận những thông tin mới về Nghệ An, kết nối doanh nghiệp và cơ hội đầu tư.</p><form onSubmit={e => e.preventDefault()}><input type="email" aria-label="Email nhận bản tin" placeholder="Email của bạn..." /><button>Đăng ký</button></form></div>
  </div>
  <div className="na-imc-strip">
    <div><span className="na-imc-label">Đơn vị đồng hành</span><strong>Công ty Cổ phần Tư vấn Quản lý Quốc tế – IMC</strong><span>MST: 5700647507</span></div>
    <div className="na-imc-contact"><span><i className="ti ti-map-pin" /> Tầng 5, Tòa nhà Trung Anh, Km2 Đại lộ V.I. Lê Nin, phường Vinh Phú, tỉnh Nghệ An</span><a href="tel:02383525456"><i className="ti ti-phone" /> 0238 352 5456 – 0913 244 286</a><a href="mailto:imc.vietnam@gmail.com"><i className="ti ti-mail" /> imc.vietnam@gmail.com</a></div>
  </div>
  <div className="na-copyright"><span>© 2026 Nghean.today. Kết nối người dân, lan tỏa giá trị và đồng hành cùng Nghệ An vươn ra thế giới.</span><span><Link to="/guide">Điều khoản sử dụng</Link><Link to="/guide">Chính sách bảo mật</Link></span></div>
</div></footer>;
export default Footer;
