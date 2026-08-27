import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingAIBot from '../components/FloatingAIBot';
import SEOHead from '../components/SEOHead';

export const Home = () => {
  const { role } = useAuth();
  const { currentLang, t } = useTranslation();
  const navigate = useNavigate();

  // Search & AI State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    memberType: 'member_personal',
    companyName: '',
    notes: '',
    agreeTerms: true
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Dynamic Live Data
  const [latestPosts, setLatestPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch('/api/posts?limit=6');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setLatestPosts(data.data);
          }
        }
      } catch (e) {
        console.warn('Could not fetch latest posts:', e);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAskAI = () => {
    if (searchQuery.trim()) {
      navigate(`/ai-chat?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/ai-chat');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      alert(currentLang === 'en' ? 'Please fill in all required fields.' : 'Vui lòng điền đầy đủ các trường bắt buộc (*).');
      return;
    }
    if (!formData.agreeTerms) {
      alert(currentLang === 'en' ? 'Please agree to the privacy policy.' : 'Vui lòng đồng ý với chính sách bảo vệ dữ liệu.');
      return;
    }

    setFormLoading(true);
    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          tier: formData.memberType === 'member_biz' ? 'Gold' : 'Silver',
          company_name: formData.companyName || formData.fullName,
          notes: formData.notes,
          description: `Đăng ký qua trang chủ VTV8.today: ${formData.memberType}. Ghi chú: ${formData.notes || 'N/A'}`
        })
      });
      setFormSubmitted(true);
    } catch (err) {
      console.error('Submit form error:', err);
      setFormSubmitted(true);
    } finally {
      setFormLoading(false);
    }
  };

  // 6 Danh mục nội dung chính
  const CATEGORY_CARDS = [
    {
      id: 'van-hoa-du-lich',
      title: currentLang === 'en' ? 'Culture & Tourism' : 'Văn hóa – Du lịch',
      desc: currentLang === 'en'
        ? 'Experience rich regional cultural identities tied to native traditions...'
        : 'Trải nghiệm bản sắc văn hóa phong phú của các vùng miền gắn liền với...',
      img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
      category: 'Văn hóa – Du lịch'
    },
    {
      id: 'di-san-lich-su',
      title: currentLang === 'en' ? 'Heritage & History' : 'Di sản – Lịch sử',
      desc: currentLang === 'en'
        ? 'Listen to heroic historical chapters and tangible, intangible heritage...'
        : 'Lắng nghe những trang sử hào hùng và các di sản văn hóa vật thể, phi vật...',
      img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80',
      category: 'Di sản – Lịch sử'
    },
    {
      id: 'diem-den-noi-bat',
      title: currentLang === 'en' ? 'Featured Destinations' : 'Điểm đến nổi bật',
      desc: currentLang === 'en'
        ? 'From magnificent Central beaches to vast Central Highlands forests...'
        : 'Từ những bãi biển miền Trung tuyệt đẹp đến núi rừng Tây Nguyên đại...',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      category: 'Điểm đến nổi bật'
    },
    {
      id: 'le-hoi-su-kien',
      title: currentLang === 'en' ? 'Festivals & Events' : 'Lễ hội và sự kiện',
      desc: currentLang === 'en'
        ? 'Constantly updated traditional festive seasons and cultural arts events...'
        : 'Cập nhật liên tục các mùa lễ hội truyền thống, sự kiện văn hóa nghệ...',
      img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
      category: 'Lễ hội và sự kiện'
    },
    {
      id: 'am-thuc-viet-nam',
      title: currentLang === 'en' ? 'Vietnamese Cuisine' : 'Ẩm thực Việt Nam',
      desc: currentLang === 'en'
        ? 'A rich gastronomic journey through three regions with distinctive specialties...'
        : 'Hành trình vị giác phong phú qua các món ăn đặc sản ba miền mang...',
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      category: 'Ẩm thực Việt Nam'
    },
    {
      id: 'con-nguoi-lang-nghe',
      title: currentLang === 'en' ? 'People & Craft Villages' : 'Con người và làng nghề',
      desc: currentLang === 'en'
        ? 'Honoring dedicated artisans keeping traditional flames alive in craft villages...'
        : 'Tôn vinh những nghệ nhân tâm huyết giữ lửa truyền thống tại các làng...',
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      category: 'Con người và làng nghề'
    }
  ];

  // 3 Điểm đến tiêu biểu
  const FEATURED_DESTINATIONS = [
    {
      id: 'hoi-an',
      badge: 'Di sản UNESCO',
      city: 'Quảng Nam',
      name: currentLang === 'en' ? 'Hoi An Ancient Town' : 'Phố cổ Hội An',
      desc: currentLang === 'en'
        ? 'Where time stands still among mossy roofs, vibrant lanterns, and unique trading heritage.'
        : 'Nơi thời gian ngưng đọng song những mái ngói rêu phong, đèn lồng rực rỡ và nét văn hóa giao thương đặc sắc.',
      img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'da-nang',
      badge: 'Thành phố đáng sống',
      city: 'Đà Nẵng',
      name: currentLang === 'en' ? 'Da Nang City' : 'Thành phố Đà Nẵng',
      desc: currentLang === 'en'
        ? 'Harmonious blend of modern urban space, pristine My Khe beach, and iconic architectural wonders.'
        : 'Hài hòa giữa không gian đô thị hiện đại, bãi biển Mỹ Khê tuyệt mỹ và những công trình kiến trúc biểu tượng.',
      img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'da-lat',
      badge: 'Du lịch sinh thái',
      city: 'Lâm Đồng - Tây Nguyên',
      name: currentLang === 'en' ? 'Da Lat Plateau' : 'Cao nguyên Đà Lạt',
      desc: currentLang === 'en'
        ? 'City of thousand flowers nestled in morning mist, offering soothing retreats and authentic highland coffee.'
        : 'Thành phố ngàn hoa ẩn mình trong sương mờ, mang đến những trải nghiệm nghỉ dưỡng và cà phê nguyên bản.',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // 3 Gợi ý hành trình
  const SUGGESTED_ITINERARIES = [
    {
      id: 'itin-1',
      tag: '48 Giờ • 5 Điểm đến',
      name: currentLang === 'en' ? 'Explore Central Heritage Trail' : 'Khám phá di sản miền Trung',
      desc: currentLang === 'en'
        ? 'Itinerary connecting Hue – Da Nang – Hoi An, immersing into distinctive world heritage spaces.'
        : 'Hành trình kết nối Huế – Đà Nẵng – Hội An, trải nghiệm không gian văn hóa di sản thế giới đặc sắc.',
      img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'itin-2',
      tag: '3 Ngày 2 Đêm • 4 Điểm đến',
      name: currentLang === 'en' ? 'Blue Seas & Local Gastronomy' : 'Biển xanh và ẩm thực địa phương',
      desc: currentLang === 'en'
        ? 'Immerse in turquoise waters and relish the vibrant culinary paradise of the central coast.'
        : 'Hài hòa giữa tắm biển trong xanh và thưởng thức thiên đường ẩm thực miền biển tươi ngon.',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'itin-3',
      tag: '4 Ngày 3 Đêm • 6 Điểm đến',
      name: currentLang === 'en' ? 'Central Highlands Cultural Journey' : 'Khám phá văn hóa Tây Nguyên',
      desc: currentLang === 'en'
        ? 'Tune into gong echoes, majestic highland landscapes, and time-honored indigenous culture.'
        : 'Hòa mình vào không gian cồng chiêng, đại ngàn hùng vĩ và văn hóa bản địa lâu đời.',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // 5 FAQs
  const FAQS = [
    {
      q: 'VTV8.today cung cấp những nội dung gì?',
      a: 'VTV8.today là hệ sinh thái số chuyên sâu về du lịch, văn hóa, di sản và lịch sử Việt Nam (đặc biệt là miền Trung - Tây Nguyên và mở rộng toàn quốc). Nền tảng cung cấp các bài viết chuyên đề, bản đồ số, gợi ý hành trình, cẩm nang trải nghiệm, tin tức sự kiện lễ hội và danh bạ showroom số của các doanh nghiệp du lịch uy tín.'
    },
    {
      q: 'Ai có thể đăng ký trở thành hội viên?',
      a: 'Mọi cá nhân du khách, nhà sáng tạo nội dung (KOL/KOC/Tác giả), doanh nghiệp du lịch (khách sạn, nhà hàng, lữ hành, dịch vụ) và các cơ quan quản lý/hiệp hội điểm đến đều có thể đăng ký tham gia hệ sinh thái để nhận các quyền lợi chuyên biệt.'
    },
    {
      q: 'Doanh nghiệp đăng ký showroom số như thế nào?',
      a: 'Doanh nghiệp chỉ cần chọn gói Hội viên Doanh nghiệp tại trang Đăng ký, điền hồ sơ năng lực và sản phẩm. Sau khi được ban biên tập xác thực pháp nhân, doanh nghiệp sẽ sở hữu showroom số đa ngôn ngữ xuất hiện trên bản đồ và hệ thống gợi ý AI của nền tảng.'
    },
    {
      q: 'Trợ lý AI sử dụng những nguồn dữ liệu nào?',
      a: 'Trợ lý AI VTV8.today được huấn luyện và đối chiếu từ nguồn tri thức chuẩn xác về lịch sử, văn hóa, di sản đã được kiểm duyệt của VTV8, kết hợp với dữ liệu thời gian thực từ cơ sở dữ liệu điểm đến, lịch sự kiện và hồ sơ doanh nghiệp đã xác minh.'
    },
    {
      q: 'Làm thế nào để đề nghị hợp tác truyền thông?',
      a: 'Bạn có thể để lại thông tin tại Form Đăng ký hợp tác trên trang chủ hoặc liên hệ trực tiếp với Ban quản trị qua mục Liên hệ để được xây dựng chiến dịch quảng bá điểm đến và sản phẩm phù hợp nhất.'
    }
  ];

  return (
    <div className="vtv8-homepage-wrapper" style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0f172a' }}>
      <SEOHead
        title="VTV8.today — Tôn vinh cội nguồn, kết nối thời đại | Chuyên trang Du lịch, Văn hóa, Di sản"
        description="Nền tảng số VTV8.today kết nối văn hóa, di sản, lịch sử và du lịch Việt Nam với cộng đồng hội viên, doanh nghiệp và du khách."
      />
      <Navbar />

      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 30%, #0d2847 0%, #061626 70%, #030b14 100%)',
        padding: '5.5rem 1.5rem 6.5rem',
        color: '#ffffff',
        textAlign: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(2, 132, 199, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '11.5px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            color: '#93c5fd',
            textTransform: 'uppercase',
            marginBottom: '1.5rem'
          }}>
            <span>VTV8.TODAY • HỆ SINH THÁI SỐ DU LỊCH & VĂN HÓA</span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: '900',
            lineHeight: '1.12',
            letterSpacing: '-0.5px',
            marginBottom: '1.5rem'
          }}>
            TÔN VINH CỘI NGUỒN<br />
            <span style={{
              background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              KẾT NỐI THỜI ĐẠI
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: '#cbd5e1',
            lineHeight: '1.65',
            maxWidth: '780px',
            margin: '0 auto 2.4rem',
            fontWeight: '400'
          }}>
            {currentLang === 'en'
              ? 'A platform promoting Vietnamese tourism, culture, heritage, and history; connecting destinations, businesses, members, and travelers worldwide.'
              : 'Nền tảng quảng bá du lịch, văn hóa, di sản và lịch sử; kết nối điểm đến, doanh nghiệp, cộng đồng hội viên và du khách trong nước, quốc tế.'}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: '3rem'
          }}>
            <button
              onClick={() => {
                const el = document.getElementById('danh-muc-noi-dung');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-vtv8-red"
              style={{ fontSize: '14.5px', padding: '0.85rem 1.8rem' }}
            >
              <i className="ti ti-compass"></i>
              <span>{currentLang === 'en' ? 'Explore Vietnam' : 'Khám phá Việt Nam'}</span>
            </button>

            <Link
              to="/register"
              className="btn-vtv8-gold"
              style={{ fontSize: '14.5px', padding: '0.85rem 1.8rem' }}
            >
              <i className="ti ti-user-plus"></i>
              <span>{currentLang === 'en' ? 'Become a Member' : 'Trở thành hội viên'}</span>
            </Link>
          </div>

          <div style={{
            maxWidth: '720px',
            margin: '0 auto',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
            padding: '6px 8px 6px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)'
          }}>
            <i className="ti ti-search" style={{ color: '#93c5fd', fontSize: '18px', flexShrink: 0 }}></i>
            <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLang === 'en' ? 'What destination, festival, or heritage do you want to explore?' : 'Bạn muốn khám phá điểm đến, lễ hội, di sản hay trải nghiệm nào?'}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </form>
            <button
              onClick={handleAskAI}
              style={{
                backgroundColor: '#dc2626',
                backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '40px',
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
              }}
            >
              <i className="ti ti-sparkles" style={{ fontSize: '14px' }}></i>
              <span>{currentLang === 'en' ? 'Ask AI Assistant' : 'Hỏi trợ lý AI'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. VỀ CHÚNG TÔI */}
      <section id="ve-chung-toi" style={{ padding: '5.5rem 1.5rem', backgroundColor: '#fcfbfa' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            VỀ CHÚNG TÔI
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Một nền tảng – Hàng triệu câu chuyện Việt Nam
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            VTV8.today được định hướng trở thành hệ sinh thái số chuyên sâu về văn hóa, di sản, lịch sử và du lịch, kết hợp nội dung chất lượng, cộng đồng hội viên, dữ liệu điểm đến và trợ lý AI đa ngôn ngữ.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '2rem 1.6rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
            }} className="card-hover-effect">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
                fontSize: '22px',
                marginBottom: '1.4rem'
              }}>
                <i className="ti ti-book"></i>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '0.6rem' }}>
                Nội dung tin cậy
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.65' }}>
                Những câu chuyện có chiều sâu về điểm đến, văn hóa, lịch sử và di sản được kiểm chứng kỹ lưỡng từ các chuyên gia.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '2rem 1.6rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
            }} className="card-hover-effect">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                fontSize: '22px',
                marginBottom: '1.4rem'
              }}>
                <i className="ti ti-users"></i>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '0.6rem' }}>
                Cộng đồng hội viên
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.65' }}>
                Kết nối du khách, doanh nghiệp, nghệ nhân, địa phương và nhà sáng tạo thành một khối đoàn kết phát triển du lịch bền vững.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '2rem 1.6rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
            }} className="card-hover-effect">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
                fontSize: '22px',
                marginBottom: '1.4rem'
              }}>
                <i className="ti ti-map-pin"></i>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '0.6rem' }}>
                Dữ liệu điểm đến
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.65' }}>
                Chuẩn hóa thông tin phong phú để người dùng dễ dàng tìm kiếm, tra cứu và lập hành trình khám phá thuận tiện nhất.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '2rem 1.6rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
            }} className="card-hover-effect">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
                fontSize: '22px',
                marginBottom: '1.4rem'
              }}>
                <i className="ti ti-robot"></i>
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '0.6rem' }}>
                Trợ lý AI đa ngôn ngữ
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.65' }}>
                Tư vấn hành trình thông minh, giải đáp chi tiết thông tin văn hóa lịch sử và kết nối dịch vụ phù hợp theo thời gian thực.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DANH MỤC NỘI DUNG */}
      <section id="danh-muc-noi-dung" style={{ padding: '5.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            DANH MỤC NỘI DUNG
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Khám phá chiều sâu của Việt Nam
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            Khám phá hệ thống chuyên mục đa dạng, phản ánh toàn diện diện mạo văn hóa, kinh tế du lịch và di sản đất nước.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            {CATEGORY_CARDS.map((cat) => (
              <div
                key={cat.id}
                className="vtv8-category-card"
                onClick={() => navigate(`/posts?category=${encodeURIComponent(cat.category)}`)}
              >
                <img src={cat.img} alt={cat.title} />
                <div className="vtv8-category-overlay">
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '0.4rem' }}>
                    {cat.title}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '0.8rem' }}>
                    {cat.desc}
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>Khám phá ngay</span>
                    <i className="ti ti-arrow-narrow-right"></i>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ĐIỂM ĐẾN TIÊU BIỂU */}
      <section id="diem-den-tieu-bieu" style={{ padding: '5.5rem 1.5rem', backgroundColor: '#fcfbfa' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            ĐIỂM ĐẾN TIÊU BIỂU
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Điểm đến đang chờ bạn khám phá
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            Những tọa độ du lịch hấp dẫn hàng đầu tại miền Trung - Tây Nguyên và mở rộng trên khắp mọi miền Tổ quốc.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            textAlign: 'left'
          }}>
            {FEATURED_DESTINATIONS.map((dest) => (
              <div key={dest.id} className="vtv8-dest-card">
                <div className="img-wrap">
                  <img src={dest.img} alt={dest.name} />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    {dest.badge}
                  </div>
                </div>

                <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontSize: '12px', fontWeight: '600', marginBottom: '0.4rem' }}>
                    <i className="ti ti-map-pin"></i>
                    <span>{dest.city}</span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '0.6rem' }}>
                    {dest.name}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '1.4rem' }}>
                    {dest.desc}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link
                      to={`/posts?category=Điểm đến nổi bật&search=${encodeURIComponent(dest.name)}`}
                      className="btn-vtv8-red"
                      style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '13px' }}
                    >
                      <span>Xem hành trình</span>
                    </Link>
                    <button
                      onClick={() => alert(`Đã lưu ${dest.name} vào bộ sưu tập hành trình của bạn!`)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}
                      title="Lưu điểm đến"
                    >
                      <i className="ti ti-bookmark"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GỢI Ý HÀNH TRÌNH */}
      <section id="goi-y-hanh-trinh" style={{ padding: '5.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            GỢI Ý HÀNH TRÌNH
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Chọn một hành trình – Chạm vào một câu chuyện
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            Các gói hành trình được thiết kế chuẩn hóa giúp du khách tối ưu thời gian và trải nghiệm trọn vẹn văn hóa bản địa.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            textAlign: 'left'
          }}>
            {SUGGESTED_ITINERARIES.map((itin) => (
              <div key={itin.id} className="vtv8-itin-card">
                <div className="img-wrap">
                  <img src={itin.img} alt={itin.name} />
                </div>

                <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#0284c7',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}>
                    <i className="ti ti-clock"></i>
                    <span>{itin.tag}</span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', marginBottom: '0.6rem' }}>
                    {itin.name}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '1.4rem' }}>
                    {itin.desc}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link
                      to="/posts?category=Điểm đến nổi bật&sub_category=Tuyến du lịch di sản"
                      className="btn-vtv8-red"
                      style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '13px' }}
                    >
                      <span>Xem chi tiết</span>
                    </Link>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert('Đã sao chép liên kết hành trình!');
                      }}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        color: '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}
                      title="Chia sẻ hành trình"
                    >
                      <i className="ti ti-share"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CỘNG ĐỒNG & DOANH NGHIỆP */}
      <section id="gia-nhap-cong-dong" style={{
        padding: '6rem 1.5rem',
        background: 'linear-gradient(180deg, #081d33 0%, #051322 100%)',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#f59e0b',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            CỘNG ĐỒNG & DOANH NGHIỆP
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            Gia nhập cộng đồng VTV8.today
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            Mỗi hội viên sở hữu một hồ sơ số, quyền lợi thiết thực và cơ hội đóng góp vào hệ sinh thái du lịch - văn hóa Việt Nam.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left',
            marginBottom: '3.5rem'
          }}>
            <div className="vtv8-member-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                <i className="ti ti-user" style={{ color: '#f59e0b', fontSize: '24px' }}></i>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  Hội viên cá nhân
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Lưu và quản lý hành trình cá nhân</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Nhận nội dung chuyên sâu theo sở thích</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Tham gia sự kiện văn hóa độc quyền</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Nhận ưu đãi đặc quyền từ đối tác</span>
                </li>
              </ul>
            </div>

            <div className="vtv8-member-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                <i className="ti ti-camera" style={{ color: '#38bdf8', fontSize: '24px' }}></i>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  Nhà sáng tạo
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Xây dựng trang tác giả chuyên nghiệp</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Giới thiệu hình ảnh, video, bài viết</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Tham gia chiến dịch truyền thông lớn</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Thương mại hóa nội dung theo chính sách</span>
                </li>
              </ul>
            </div>

            <div className="vtv8-member-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                <i className="ti ti-building" style={{ color: '#ec4899', fontSize: '24px' }}></i>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  Doanh nghiệp du lịch
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Xây dựng showroom số đa ngôn ngữ</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Giới thiệu sản phẩm, dịch vụ, ưu đãi</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Xuất hiện trực tiếp trên bản đồ điểm đến</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Tiếp nhận khách hàng tiềm năng chất lượng</span>
                </li>
              </ul>
            </div>

            <div className="vtv8-member-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                <i className="ti ti-map-2" style={{ color: '#a855f7', fontSize: '24px' }}></i>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  Đối tác địa phương
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Xây dựng chuyên trang địa phương riêng</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Quảng bá điểm đến và sự kiện đặc quyền</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Phát triển cộng đồng doanh nghiệp liên kết</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>Theo dõi dữ liệu quan tâm của du khách</span>
                </li>
              </ul>
            </div>
          </div>

          <Link
            to="/register"
            className="btn-vtv8-gold"
            style={{ fontSize: '15px', padding: '0.9rem 2.2rem' }}
          >
            <span>Đăng ký tham gia ngay</span>
          </Link>
        </div>
      </section>

      {/* 7. CÔNG NGHỆ THÔNG MINH */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#fcfbfa' }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: '800',
              letterSpacing: '1.5px',
              color: '#dc2626',
              textTransform: 'uppercase',
              marginBottom: '0.6rem'
            }}>
              CÔNG NGHỆ THÔNG MINH
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '1.2rem',
              lineHeight: '1.2'
            }}>
              Trợ lý AI đồng hành trên mỗi hành trình
            </h2>
            <p style={{
              color: '#475569',
              fontSize: '15px',
              lineHeight: '1.7',
              marginBottom: '2rem'
            }}>
              Trợ lý AI VTV8.today giúp du khách khám phá điểm đến, tìm hiểu lịch sử – văn hóa, lập lịch trình, tìm sự kiện và kết nối dịch vụ bằng nhiều ngôn ngữ một cách nhanh chóng, chính xác.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                <i className="ti ti-circle-check-filled" style={{ color: '#10b981', fontSize: '18px' }}></i>
                <span>Gợi ý điểm đến cá nhân hóa theo sở thích riêng</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                <i className="ti ti-circle-check-filled" style={{ color: '#10b981', fontSize: '18px' }}></i>
                <span>Lập hành trình chi tiết theo thời gian và ngân sách</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                <i className="ti ti-circle-check-filled" style={{ color: '#10b981', fontSize: '18px' }}></i>
                <span>Tra cứu lịch sử, văn hóa, di sản trực quan</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                <i className="ti ti-circle-check-filled" style={{ color: '#10b981', fontSize: '18px' }}></i>
                <span>Tìm khách sạn, nhà hàng và doanh nghiệp hội viên</span>
              </div>
            </div>

            <Link
              to="/ai-chat"
              className="btn-vtv8-red"
              style={{ fontSize: '14.5px', padding: '0.85rem 1.8rem' }}
            >
              <i className="ti ti-sparkles"></i>
              <span>Trải nghiệm trợ lý AI</span>
            </Link>
          </div>

          <div style={{
            backgroundColor: '#0c2340',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(12, 35, 64, 0.25)'
          }}>
            <div style={{
              backgroundColor: '#08182b',
              padding: '1rem 1.4rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <i className="ti ti-robot"></i>
              </div>
              <div>
                <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '13.5px' }}>
                  Trợ lý du lịch VTV8.today
                </div>
                <div style={{ color: '#93c5fd', fontSize: '11px' }}>
                  Sẵn sàng hỗ trợ đa ngôn ngữ 24/7
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                alignSelf: 'flex-end',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                padding: '10px 14px',
                borderRadius: '14px 14px 2px 14px',
                maxWidth: '85%',
                fontSize: '13px',
                lineHeight: '1.5'
              }}>
                Tôi có 3 ngày khám phá miền Trung. Hãy xây dựng hành trình kết hợp di sản, biển và ẩm thực.
              </div>

              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                padding: '12px 16px',
                borderRadius: '14px 14px 14px 2px',
                maxWidth: '90%',
                fontSize: '13px',
                lineHeight: '1.6',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                Xin chào! Dựa trên yêu cầu của bạn, tôi đề xuất hành trình 3 ngày 2 đêm: <strong>Đà Nẵng – Hội An – Huế</strong>. Ngày 1 tham quan Ngũ Hành Sơn và phố cổ Hội An; Ngày 2 trải nghiệm bãi biển Mỹ Khê và thưởng thức Mỳ Quảng; Ngày 3 khám phá Đại Nội Huế. Bạn muốn lưu lại hành trình này không?
              </div>

              <div style={{
                marginTop: '0.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '0.8rem',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => navigate('/ai-chat?q=Gợi ý ẩm thực đặc sản Đà Nẵng và Hội An')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#93c5fd',
                    borderRadius: '20px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  🍜 Đặc sản Đà Nẵng - Hội An
                </button>
                <button
                  onClick={() => navigate('/ai-chat?q=Lịch trình 2 ngày 1 đêm khám phá Đà Lạt')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#93c5fd',
                    borderRadius: '20px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  🌲 Lịch trình 2N1Đ Đà Lạt
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DẢI THỐNG KÊ */}
      <section style={{
        backgroundColor: '#051322',
        padding: '3.5rem 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">150+</div>
            <div className="vtv8-stat-label">Điểm đến giới thiệu</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">500+</div>
            <div className="vtv8-stat-label">Câu chuyện văn hóa - di sản</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">120+</div>
            <div className="vtv8-stat-label">Doanh nghiệp hội viên</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">1,200+</div>
            <div className="vtv8-stat-label">Hành trình được tạo</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">34</div>
            <div className="vtv8-stat-label">Tỉnh thành tham gia</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">02</div>
            <div className="vtv8-stat-label">Ngôn ngữ hỗ trợ (VI/EN)</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '11px', color: '#64748b' }}>
          * DỮ LIỆU MINH HỌA TRONG GIAI ĐOẠN PHÁT TRIỂN NỀN TẢNG VTV8.TODAY
        </div>
      </section>

      {/* 9. THAM GIA HỆ SINH THÁI */}
      <section id="lien-he-he-sinh-thai" style={{ padding: '6rem 1.5rem', backgroundColor: '#fcfbfa' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            THAM GIA HỆ SINH THÁI
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Trở thành một phần của VTV8.today
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '3rem'
          }}>
            Điền thông tin bên dưới để đăng ký tài khoản hội viên, tạo showroom doanh nghiệp hoặc đề nghị hợp tác truyền thông.
          </p>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            textAlign: 'left'
          }}>
            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '1rem' }}>
                  <i className="ti ti-check"></i>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                  Đăng ký thành công!
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
                  Cảm ơn bạn đã tham gia hệ sinh thái VTV8.today. Đội ngũ phát triển sẽ liên hệ với bạn trong thời gian sớm nhất.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="btn-vtv8-red"
                  style={{ marginTop: '1.5rem', fontSize: '13.5px' }}
                >
                  Gửi thêm thông tin
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nhập họ và tên của bạn"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Nhập số điện thoại liên hệ"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Nhập địa chỉ email"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Tỉnh / Thành phố
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ví dụ: Đà Nẵng, Quảng Nam..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Loại hội viên muốn đăng ký *
                    </label>
                    <select
                      value={formData.memberType}
                      onChange={(e) => setFormData({ ...formData, memberType: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none', backgroundColor: '#fff' }}
                    >
                      <option value="member_personal">Hội viên cá nhân / Du khách</option>
                      <option value="member_creator">Nhà sáng tạo nội dung / Tác giả</option>
                      <option value="member_biz">Doanh nghiệp du lịch / Lưu trú / Dịch vụ</option>
                      <option value="member_partner">Đối tác địa phương / Cơ quan / Hiệp hội</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      Tên doanh nghiệp hoặc đơn vị (Nếu có)
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Tên công ty, khách sạn, nhà hàng..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.4rem' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Nhu cầu hợp tác / Nội dung cần tư vấn
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Chia sẻ thêm về nhu cầu kết nối hoặc xây dựng showroom số của bạn..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.8rem', fontSize: '13px', color: '#475569' }}>
                  <input
                    type="checkbox"
                    id="agreeCheck"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="agreeCheck" style={{ cursor: 'pointer' }}>
                    Tôi đồng ý với chính sách bảo vệ dữ liệu và điều khoản sử dụng của VTV8.today.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-vtv8-red"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '15px' }}
                >
                  {formLoading ? 'Đang gửi thông tin...' : 'Đăng ký tham gia ngay'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 10. GIẢI ĐÁP THẮC MẮC */}
      <section style={{ padding: '5.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            GIẢI ĐÁP THẮC MẮC
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            Câu hỏi thường gặp
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '3rem'
          }}>
            Tổng hợp thông tin chi tiết về cơ chế hoạt động, quyền lợi hội viên và định hướng phát triển của VTV8.today.
          </p>

          <div style={{ textAlign: 'left' }}>
            {FAQS.map((faq, index) => (
              <div key={index} className="vtv8-faq-item">
                <button
                  className="vtv8-faq-question"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  <i className={`ti ${activeFaq === index ? 'ti-chevron-up' : 'ti-chevron-down'}`} style={{ color: '#64748b' }}></i>
                </button>
                {activeFaq === index && (
                  <div className="vtv8-faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. BOTTOM BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, #081d33 0%, #030b14 100%)',
        color: '#ffffff',
        padding: '5rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: '800',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Mỗi vùng đất đều có một câu chuyện đáng được kể
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '2.5rem'
          }}>
            Hãy cùng VTV8.today tôn vinh những giá trị của Việt Nam, kết nối cộng đồng và kiến tạo những hành trình mới.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const el = document.getElementById('danh-muc-noi-dung');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-vtv8-gold"
              style={{ fontSize: '14.5px', padding: '0.85rem 1.8rem' }}
            >
              Khám phá ngay
            </button>
            <Link
              to="/register"
              className="btn-vtv8-red"
              style={{ fontSize: '14.5px', padding: '0.85rem 1.8rem' }}
            >
              Đăng ký hội viên
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingAIBot />
    </div>
  );
};

export default Home;
