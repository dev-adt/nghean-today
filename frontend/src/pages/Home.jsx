import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SpecialTopics from '../components/SpecialTopics';
import HomeEvents from '../components/HomeEvents';
import FloatingAIBot from '../components/FloatingAIBot';
import SEOHead from '../components/SEOHead';

const pillars = [
  {
    icon: 'ti-map-pin',
    tone: 'green',
    title: 'Khám phá Nghệ An',
    text: 'Kim Liên linh thiêng, biển Cửa Lò rực nắng, đại ngàn miền Tây hùng vĩ, giai điệu Ví Giặm ân tình cùng ẩm thực đậm đà bản sắc.',
    cta: 'Bắt đầu hành trình',
    to: '/posts?category=Du%20lịch%20%26%20Trải%20nghiệm',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=82'
  },
  {
    icon: 'ti-building-skyscraper',
    tone: 'blue',
    title: 'Kết nối Doanh nghiệp',
    text: 'Showroom số đa ngôn ngữ, mạng lưới kết nối cung cầu, tìm kiếm đối tác chiến lược và mở rộng chuỗi cung ứng trong nước và toàn cầu.',
    cta: 'Tìm đối tác kinh doanh',
    to: '/members',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=82'
  },
  {
    icon: 'ti-chart-arrows-vertical',
    tone: 'gold',
    title: 'Đầu tư tại Nghệ An',
    text: 'Cửa ngõ thông tin minh bạch về Khu kinh tế Đông Nam, KCN VSIP, WHA, chính sách ưu đãi cạnh tranh và nguồn nhân lực vàng dồi dào.',
    cta: 'Khám phá cơ hội FDI',
    to: '/posts?category=Xúc%20tiến%20Đầu%20tư%20%26%20FDI',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=82'
  }
];

const regions = [
  ['Thành phố Vinh & Vùng phụ cận', 'Trung tâm kinh tế, văn hóa và dịch vụ năng động bậc nhất Bắc Trung Bộ', '/images/nghean-vinh-city.png', 'Đô thị hạt nhân • Cảng hàng không quốc tế Vinh'],
  ['Cửa Lò & Du lịch biển', 'Bãi biển trong xanh thoai thoải, ẩm thực hải sản tươi ngon và quần thể nghỉ dưỡng hiện đại', '/images/nghean-cua-lo.png', 'Bãi biển đẹp • Cầu Cửa Hội • Cảng biển nước sâu'],
  ['Nam Đàn – Quê hương Bác Hồ', 'Hành trình về nguồn thiêng liêng, làng Sen thơm ngát và các giá trị lịch sử văn hóa đặc biệt', '/images/nghean-nam-dan.png', 'Di tích Quốc gia đặc biệt Kim Liên • Sông Lam hiền hòa'],
  ['Miền Tây Nghệ An', 'Thiên nhiên nguyên sơ hùng vĩ, sinh thái Vườn quốc gia Pù Mát và bản sắc văn hóa các dân tộc', '/images/nghean-western.png', 'Khu dự trữ sinh quyển thế giới • Du lịch cộng đồng']
];

const heritage = [
  {
    icon: 'ti-music',
    title: 'Dân ca Ví–Giặm Nghệ Tĩnh',
    text: 'Di sản văn hóa phi vật thể đại diện của nhân loại được UNESCO công nhận, kết tinh tâm hồn sâu lắng, ân tình và cốt cách kiên định của người xứ Nghệ.'
  },
  {
    icon: 'ti-star',
    title: 'Quê hương Chủ tịch Hồ Chí Minh',
    text: 'Không gian lưu niệm Kim Liên đặc biệt, nơi hội tụ hồn thiêng sông núi, nuôi dưỡng lòng yêu nước nồng nàn và tư tưởng vĩ đại của vị lãnh tụ kính yêu.'
  },
  {
    icon: 'ti-school',
    title: 'Truyền thống hiếu học & Danh nhân',
    text: 'Vùng đất địa linh nhân kiệt sản sinh nhiều bậc hiền tài, trạng nguyên, trí thức lớn đóng góp to lớn vào trang sử vàng hào hùng của dân tộc Việt Nam.'
  }
];

const fdiItems = [
  ['Hạ tầng KCN & KKT Đông Nam', 'Kết nối đồng bộ đường bộ cao tốc, cảng biển nước sâu Cửa Lò và Cảng hàng không quốc tế.'],
  ['KCN VSIP, WHA & Hoàng Mai', 'Hạ tầng hiện đại đạt tiêu chuẩn quốc tế, quỹ đất sạch sẵn sàng tiếp nhận các dự án công nghệ cao.'],
  ['Nguồn nhân lực dồi dào', 'Hơn 1,6 triệu lao động trong độ tuổi, hệ thống trường đại học, cao đẳng đào tạo nghề chất lượng.'],
  ['Ưu đãi đầu tư vượt trội', 'Thuế thu nhập doanh nghiệp, miễn giảm tiền thuê đất và cơ chế hỗ trợ thủ tục một cửa thông thoáng.']
];

export const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeRegion, setActiveRegion] = useState(0);

  // Background Video State (Default: Autoplay, Muted, Looping)
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Toggle Mute Audio
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Toggle Video Play / Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Ultra-Smooth Scroll Reveal Observer (Zero-Lag, Hardware-Accelerated)
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Check if user prefers reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale')
        .forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Disconnect element once revealed to free up CPU / memory completely
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [posts, members, activeRegion]);

  // Fetch Public Data
  useEffect(() => {
    Promise.allSettled([
      fetch('/api/posts?limit=3').then(r => r.json()),
      fetch('/api/members?limit=3').then(r => r.json())
    ]).then(([a, b]) => {
      if (a.status === 'fulfilled' && a.value?.success) setPosts(a.value.data || []);
      if (b.status === 'fulfilled' && b.value?.success) setMembers(b.value.data || []);
    });
  }, []);

  const search = e => {
    e.preventDefault();
    if (query.trim()) navigate(`/posts?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="na-home">
      <SEOHead
        title="Nghean.today – Kết nối Nghệ An với Việt Nam và Thế giới"
        description="Nền tảng số đa ngôn ngữ quảng bá du lịch - văn hóa xứ Nghệ, kết nối cộng đồng doanh nghiệp và xúc tiến thu hút đầu tư FDI vào Nghệ An."
      />
      <Navbar />

      <main>
        {/* ================================================================
            CINEMATIC HERO SECTION WITH AUTOPLAY BACKGROUND VIDEO
            ================================================================ */}
        <section className="na-hero-v2" aria-label="Khám phá Nghean.today">
          {/* Background Video Layer */}
          <div className="na-hero-media-wrap">
            <video
              ref={videoRef}
              className="na-hero-video"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="auto"
              poster="/images/hero_network.png"
            >
              <source src="/videos/hero-background.mp4" type="video/mp4" />
            </video>
            <div className="na-hero-overlay" />
            <div className="na-hero-mesh" aria-hidden="true" />
          </div>

          {/* Interactive Media Controls (Mute / Unmute & Play / Pause) */}
          <div className="na-hero-controls">
            <button
              type="button"
              className="na-video-ctrl-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Bật âm thanh video' : 'Tắt âm thanh video'}
              title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
            >
              <i className={`ti ${isMuted ? 'ti-volume-off' : 'ti-volume'}`} />
              <span>{isMuted ? 'Tắt tiếng' : 'Đang phát âm'}</span>
              {!isMuted && (
                <div className="na-audio-wave" aria-hidden="true">
                  <span /><span /><span /><span />
                </div>
              )}
            </button>
            <button
              type="button"
              className="na-video-ctrl-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Tạm dừng video' : 'Tiếp tục phát'}
              title={isPlaying ? 'Tạm dừng video' : 'Phát tiếp'}
            >
              <i className={`ti ${isPlaying ? 'ti-player-pause' : 'ti-player-play'}`} />
              <span>{isPlaying ? 'Tạm dừng' : 'Phát video'}</span>
            </button>
          </div>

          {/* Hero Core Content */}
          <div className="na-hero-inner">
            <div className="reveal-scale is-visible">
              <div className="na-hero-badge">
                <span className="na-badge-dot" />
                <span>Cổng Thương Hiệu Số Tỉnh Nghệ An • 24/7 Connectivity</span>
              </div>
            </div>

            <h1 className="na-hero-title-v2 reveal-on-scroll is-visible">
              NGHEAN.TODAY
            </h1>
            <h2 className="na-hero-subtitle-v2 reveal-on-scroll is-visible">
              Nền tảng kết nối Nghệ An với Việt Nam & Thế giới
            </h2>
            <p className="na-hero-lead-v2 reveal-on-scroll is-visible">
              Khám phá vùng đất địa linh nhân kiệt, kết nối mạng lưới doanh nghiệp thịnh vượng,
              tiếp cận cơ hội đầu tư FDI đột phá và trải nghiệm hệ sinh thái AI thông minh đa ngôn ngữ.
            </p>

            {/* Quick Action Navigation Buttons */}
            <div className="na-hero-actions-v2 reveal-on-scroll is-visible">
              <Link to="/posts?category=Du%20lịch%20%26%20Trải%20nghiệm" className="na-btn-v2 primary">
                <i className="ti ti-compass" /> Khám phá Xứ Nghệ
              </Link>
              <Link to="/posts?category=Xúc%20tiến%20Đầu%20tư%20%26%20FDI" className="na-btn-v2 orange">
                <i className="ti ti-chart-arrows-vertical" /> Cơ hội Đầu tư FDI
              </Link>
              <Link to="/members" className="na-btn-v2 green">
                <i className="ti ti-building-skyscraper" /> Kết nối Doanh nghiệp
              </Link>
              <Link to="/ai-chat" className="na-btn-v2 ai">
                <i className="ti ti-sparkles" /> Hỏi Trợ lý AI
              </Link>
            </div>

            {/* Glassmorphic Smart Search */}
            <form className="na-search-v2 reveal-scale is-visible" onSubmit={search}>
              <i className="ti ti-search" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Bạn muốn tìm hiểu điều gì về Nghệ An (Du lịch, Doanh nghiệp, Đầu tư, Sự kiện)...?"
              />
              <button type="submit">Tìm kiếm thông minh</button>
            </form>

            {/* Quick Keyword Pills */}
            <div className="na-suggestions-v2 reveal-on-scroll is-visible">
              <span>Gợi ý nhanh:</span>
              <button type="button" onClick={() => setQuery('Quê Bác Sen Kim Liên')}>Quê Bác Sen Kim Liên</button>
              <button type="button" onClick={() => setQuery('Du lịch Biển Cửa Lò')}>Du lịch Cửa Lò</button>
              <button type="button" onClick={() => setQuery('KCN VSIP Nghệ An')}>KCN VSIP Nghệ An</button>
              <button type="button" onClick={() => setQuery('Dân ca Ví Giặm')}>Dân ca Ví Giặm</button>
              <button type="button" onClick={() => setQuery('Đầu tư FDI Nghệ An')}>Đầu tư FDI</button>
            </div>

            {/* Live Highlight Metrics Ticker */}
            <div className="na-hero-stats reveal-on-scroll is-visible">
              <div className="na-stat-card">
                <span className="na-stat-number">3.3M+</span>
                <span className="na-stat-label">Dân số & Nhân lực dồi dào</span>
              </div>
              <div className="na-stat-card">
                <span className="na-stat-number">Top 10 FDI</span>
                <span className="na-stat-label">Thu hút đầu tư cả nước</span>
              </div>
              <div className="na-stat-card">
                <span className="na-stat-number">2.600+</span>
                <span className="na-stat-label">Di tích & Thắng cảnh di sản</span>
              </div>
              <div className="na-stat-card">
                <span className="na-stat-number">Hạ Tầng 4.0</span>
                <span className="na-stat-label">Sân bay, Cảng biển & 5+ KCN lớn</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 1: BA TRỤ CỘT CHIẾN LƯỢC
            ================================================================ */}
        <section className="na-section">
          <div className="na-container">
            <div className="reveal-on-scroll">
              <Heading title="Ba Trụ Cột Chiến Lược" kicker="Tầm nhìn & Phát triển bền vững">
                Định hướng phát triển toàn diện nhằm quảng bá bản sắc, kích hoạt giao thương và đưa Nghệ An bứt phá trong kỷ nguyên số.
              </Heading>
            </div>

            <div className="na-pillar-grid-v2">
              {pillars.map((p, i) => (
                <article className={`na-pillar-v2 reveal-scale delay-${(i + 1) * 100}`} key={p.title}>
                  <div className="na-pillar-image-v2" style={{ backgroundImage: `url(${p.image})` }}>
                    <span className="na-pillar-badge-v2">
                      <i className={`ti ${p.icon}`} /> {p.title}
                    </span>
                  </div>
                  <div className="na-pillar-body-v2">
                    <p>{p.text}</p>
                    <Link className={`na-text-link ${p.tone}`} to={p.to}>
                      {p.cta} <i className="ti ti-arrow-right" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SPECIAL TOPICS: LÀM CHỦ AI - BỨT PHÁ TƯƠNG LAI
            ================================================================ */}
        <div className="reveal-on-scroll">
          <SpecialTopics />
        </div>

        {/* ================================================================
            SECTION 2: KHÁM PHÁ NGHỆ AN (INTERACTIVE REGION EXPLORER)
            ================================================================ */}
        <section className="na-section muted">
          <div className="na-container">
            <div className="reveal-on-scroll">
              <Heading title="Khám Phá Nghệ An" kicker="Bản đồ trải nghiệm đa sắc màu">
                Chọn các khu vực trọng điểm để tìm hiểu thắng cảnh, tiềm năng du lịch, di sản và cơ hội đầu tư nổi bật.
              </Heading>
            </div>

            <div className="na-region-layout-v2">
              {/* Region Selector Tabs */}
              <div className="na-region-list-v2 reveal-left">
                {regions.map((r, i) => (
                  <button
                    key={r[0]}
                    type="button"
                    className={`na-region-tab-v2 ${activeRegion === i ? 'active' : ''}`}
                    onClick={() => setActiveRegion(i)}
                  >
                    <strong>{r[0]}</strong>
                    <span>{r[1]}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Region Preview Card */}
              <div
                className="na-region-preview-v2 reveal-right"
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(6,18,30,.94) 0%, rgba(6,18,30,.25) 60%), url(${regions[activeRegion][2]})`
                }}
              >
                <div className="na-region-overlay-v2">
                  <span className="na-region-kicker">Điểm Đến Trọng Điểm</span>
                  <h3>{regions[activeRegion][0]}</h3>
                  <p>{regions[activeRegion][1]}. {regions[activeRegion][3] || ''}</p>
                  <Link to="/posts?category=Du%20lịch%20%26%20Trải%20nghiệm" className="na-btn-v2 primary">
                    Khám phá chi tiết vùng đất này <i className="ti ti-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: VĂN HÓA & DI SẢN (DARK LUXURY GOLD THEME)
            ================================================================ */}
        <section className="na-section dark">
          <div className="na-container">
            <div className="reveal-on-scroll">
              <Heading title="Văn Hóa và Di Sản" light kicker="Hồn Cốt & Bản Sắc Xứ Nghệ">
                Không gian linh thiêng lưu giữ Dân ca Ví–Giặm, Quê hương Bác Hồ và truyền thống kiên trung, hiếu học ngàn đời.
              </Heading>
            </div>

            <div className="na-heritage-grid-v2">
              {heritage.map((h, i) => (
                <article className={`na-heritage-card-v2 reveal-on-scroll delay-${(i + 1) * 100}`} key={h.title}>
                  <div className="na-heritage-icon-wrap">
                    <i className={`ti ${h.icon}`} />
                  </div>
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                  <Link to="/posts?category=Văn%20hóa%20%26%20Di%20sản" className="na-text-link gold">
                    Khám phá câu chuyện di sản <i className="ti ti-arrow-right" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: DOANH NGHIỆP TIÊU BIỂU
            ================================================================ */}
        <section className="na-section na-members-section">
          <div className="na-container">
            <div className="reveal-on-scroll">
              <Heading title="Doanh Nghiệp Tiêu Biểu" kicker="Hệ sinh thái thành viên">
                Ưu tiên tôn vinh các doanh nghiệp hội viên tiên phong, mở rộng kết nối giao thương đa ngành.
              </Heading>
            </div>

            <div className="na-member-tools reveal-on-scroll">
              <input placeholder="Tìm doanh nghiệp, sản phẩm, ngành nghề..." />
              <Link to="/members">Xem toàn bộ danh bạ</Link>
            </div>

            {members.length > 0 ? (
              <div className="na-company-grid reveal-on-scroll">
                {members.slice(0, 3).map(m => (
                  <article className={m.is_featured ? 'featured' : ''} key={m.id || m.name}>
                    {m.is_featured === 1 && (
                      <span className="na-featured-ribbon">
                        <i className="ti ti-pin-filled" /> Nổi bật
                      </span>
                    )}
                    <div className="na-avatar">{(m.name || 'DN').slice(0, 2).toUpperCase()}</div>
                    <div className="na-company-info">
                      <div className="na-company-meta">
                        <span className={`na-tier tier-${(m.tier || 'standard').toLowerCase()}`}>
                          {m.tier || 'Standard'}
                        </span>
                      </div>
                      <h3>{m.name}</h3>
                      <p>{m.industry || m.description}</p>
                    </div>
                    <Link to={`/members?search=${encodeURIComponent(m.name)}`}>
                      Kết nối <i className="ti ti-arrow-right" />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState text="Chưa có doanh nghiệp được công bố. Dữ liệu sẽ hiển thị sau khi được quản trị viên phê duyệt." />
            )}
          </div>
        </section>

        {/* ================================================================
            SECTION 5: TRUNG TÂM XÚC TIẾN ĐẦU TƯ FDI
            ================================================================ */}
        <section className="na-section muted">
          <div className="na-container">
            <div className="reveal-on-scroll">
              <Heading title="Trung Tâm Xúc Tiến Đầu Tư FDI" kicker="Điểm đến của các tập đoàn công nghệ toàn cầu">
                Thông tin minh bạch, hạ tầng khu công nghiệp hiện đại, cơ chế hỗ trợ linh hoạt và chính sách ưu đãi vượt trội.
              </Heading>
            </div>

            <div className="na-fdi-grid-v2">
              {fdiItems.map((x, i) => (
                <article key={x[0]} className={`na-fdi-card-v2 reveal-scale delay-${(i + 1) * 100}`}>
                  <h3>{x[0]}</h3>
                  <p>{x[1]}</p>
                  <Link to="/posts?category=Xúc%20tiến%20Đầu%20tư%20%26%20FDI" className="na-text-link orange">
                    Xem thông số <i className="ti ti-arrow-right" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="na-center-actions reveal-on-scroll">
              <Link className="na-btn orange" to="/posts?category=Xúc%20tiến%20Đầu%20tư%20%26%20FDI">
                <i className="ti ti-download" /> Tải tài liệu hướng dẫn đầu tư
              </Link>
              <Link className="na-btn blue" to="/posts">
                <i className="ti ti-map-2" /> Bản đồ các Khu công nghiệp
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 6: TIN TỨC & DÒNG CHẢY SỰ KIỆN
            ================================================================ */}
        <section className="na-section">
          <div className="na-container">
            <div className="reveal-on-scroll">
              <Heading title="Tin Tức & Dòng Chảy Nghệ An" kicker="Cập nhật 24/7">
                Cập nhật liên tục các hoạt động kinh tế, văn hóa, xúc tiến thương mại và chuyển đổi số trên địa bàn tỉnh.
              </Heading>
            </div>

            {posts.length > 0 ? (
              <div className="na-news-grid">
                {posts.slice(0, 3).map((p, i) => (
                  <article className={`reveal-on-scroll delay-${(i + 1) * 100}`} key={p.id || i}>
                    {(p.image_url || p.thumbnail || p.image) && (
                      <img src={p.image_url || p.thumbnail || p.image} alt={p.title || ''} />
                    )}
                    <div>
                      <span>{p.category_name || p.category || 'Tin tức'}</span>
                      <h3>{p.title}</h3>
                      <p>{p.excerpt || p.summary}</p>
                      <Link to={p.slug ? `/posts/${p.slug}` : `/posts/${p.id}`}>
                        Đọc tiếp <i className="ti ti-arrow-right" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState text="Chưa có bài viết được công bố. Nội dung sẽ hiển thị sau khi được phê duyệt." />
            )}
          </div>
        </section>

        {/* ================================================================
            SECTION 7: SỰ KIỆN NGHỆ AN
            ================================================================ */}
        <div className="reveal-on-scroll">
          <HomeEvents />
        </div>
      </main>

      <Footer />
      <FloatingAIBot />
    </div>
  );
};

const Heading = ({ title, children, light, kicker }) => (
  <div className={`na-heading ${light ? 'light' : ''}`}>
    {kicker && <span className="na-kicker">{kicker}</span>}
    <h2>{title}</h2>
    <p>{children}</p>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="na-empty">
    <i className="ti ti-database-off" />
    <p>{text}</p>
  </div>
);

export default Home;
