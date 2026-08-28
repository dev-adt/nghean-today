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

  // Dynamic Live Posts (up to 9 posts: 3 rows x 3 columns, featured prioritized)
  const [latestPosts, setLatestPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Dynamic Live Events (up to 3 upcoming/featured events)
  const [eventsList, setEventsList] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Dynamic Live Members (up to 3 featured & high-tier members)
  const [featuredMembers, setFeaturedMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHomeData = async () => {
      try {
        // 1. Fetch posts
        const resPosts = await fetch('/api/posts?limit=9');
        if (resPosts.ok) {
          const dataPosts = await resPosts.json();
          if (dataPosts.success && Array.isArray(dataPosts.data) && isMounted) {
            setLatestPosts(dataPosts.data);
          }
        }

        // 2. Fetch events
        const resEvents = await fetch('/api/events?limit=3');
        if (resEvents.ok) {
          const dataEvents = await resEvents.json();
          if (dataEvents.success && Array.isArray(dataEvents.data) && isMounted) {
            setEventsList(dataEvents.data);
          }
        }

        // 3. Fetch top 3 featured / high-tier members
        const resMembers = await fetch('/api/members?limit=3');
        if (resMembers.ok) {
          const dataMembers = await resMembers.json();
          if (dataMembers.success && Array.isArray(dataMembers.data) && isMounted) {
            setFeaturedMembers(dataMembers.data);
          }
        }
      } catch (e) {
        console.warn('Could not fetch homepage data:', e);
      } finally {
        if (isMounted) {
          setLoadingPosts(false);
          setLoadingEvents(false);
          setLoadingMembers(false);
        }
      }
    };
    fetchHomeData();
    return () => { isMounted = false; };
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
      alert(currentLang === 'en' ? 'Please fill in all required fields (*).' : 'Vui lòng điền đầy đủ các trường bắt buộc (*).');
      return;
    }
    if (!formData.agreeTerms) {
      alert(currentLang === 'en' ? 'Please agree to the privacy policy.' : 'Vui lòng đồng ý với chính sách bảo vệ dữ liệu.');
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          memberType: formData.memberType,
          companyName: formData.companyName,
          notes: formData.notes
        })
      });
      if (res.ok) {
        setFormSubmitted(true);
      } else {
        const errJson = await res.json();
        alert('Lỗi: ' + (errJson.error || 'Không thể gửi form.'));
      }
    } catch (err) {
      console.error('Submit form error:', err);
      alert(currentLang === 'en' ? 'An error occurred. Please try again.' : 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setFormLoading(false);
    }
  };

  // 6 Chuyên mục chính
  const CATEGORY_CARDS = [
    {
      id: 'van-hoa-du-lich',
      title: currentLang === 'en' ? 'Culture & Tourism' : 'Văn hóa – Du lịch',
      desc: currentLang === 'en'
        ? 'Experience rich regional cultural identities tied to native traditions, beliefs, and artistic spaces.'
        : 'Trải nghiệm bản sắc văn hóa phong phú của các vùng miền gắn liền với lễ hội, tín ngưỡng và tour văn hóa.',
      img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80',
      category: 'Văn hóa – Du lịch'
    },
    {
      id: 'di-san-lich-su',
      title: currentLang === 'en' ? 'Heritage & History' : 'Di sản – Lịch sử',
      desc: currentLang === 'en'
        ? 'Listen to heroic historical chapters and explore UNESCO world heritage and cultural relics.'
        : 'Lắng nghe những trang sử hào hùng và các di sản văn hóa thế giới UNESCO, di tích lịch sử ngàn năm.',
      img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80',
      category: 'Di sản – Lịch sử'
    },
    {
      id: 'diem-den-noi-bat',
      title: currentLang === 'en' ? 'Featured Destinations' : 'Điểm đến nổi bật',
      desc: currentLang === 'en'
        ? 'From magnificent Central beaches to vast Central Highlands forests and northern wonders.'
        : 'Từ những bãi biển miền Trung tuyệt đẹp đến núi rừng Tây Nguyên đại ngàn và sắc màu phương Nam.',
      img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      category: 'Điểm đến nổi bật'
    },
    {
      id: 'le-hoi-su-kien',
      title: currentLang === 'en' ? 'Festivals & Events' : 'Lễ hội và sự kiện',
      desc: currentLang === 'en'
        ? 'Constantly updated traditional festive seasons, cultural arts festivals, and tourism events.'
        : 'Cập nhật liên tục các mùa lễ hội truyền thống, festival văn hóa nghệ thuật và sự kiện du lịch lớn.',
      img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
      category: 'Lễ hội và sự kiện'
    },
    {
      id: 'am-thuc-viet-nam',
      title: currentLang === 'en' ? 'Vietnamese Cuisine' : 'Ẩm thực Việt Nam',
      desc: currentLang === 'en'
        ? 'A rich gastronomic journey through three regions with distinctive specialties and OCOP delicacies.'
        : 'Hành trình vị giác phong phú qua các món ăn đặc sản ba miền, sản phẩm OCOP và câu chuyện món ngon.',
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      category: 'Ẩm thực Việt Nam'
    },
    {
      id: 'con-nguoi-lang-nghe',
      title: currentLang === 'en' ? 'People & Craft Villages' : 'Con người và làng nghề',
      desc: currentLang === 'en'
        ? 'Honoring dedicated artisans keeping traditional flames alive in time-honored craft villages.'
        : 'Tôn vinh những nghệ nhân tâm huyết giữ lửa truyền thống và trải nghiệm các làng nghề thủ công mỹ nghệ.',
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      category: 'Con người và làng nghề'
    }
  ];

  // 3 Điểm đến tiêu biểu
  const FEATURED_DESTINATIONS = [
    {
      id: 'hoi-an',
      badge: currentLang === 'en' ? 'UNESCO Heritage' : 'Di sản UNESCO',
      city: currentLang === 'en' ? 'Quang Nam' : 'Quảng Nam',
      name: currentLang === 'en' ? 'Hoi An Ancient Town' : 'Phố cổ Hội An',
      desc: currentLang === 'en'
        ? 'Where time stands still among mossy roofs, vibrant lanterns, and unique trading heritage.'
        : 'Nơi thời gian ngưng đọng song những mái ngói rêu phong, đèn lồng rực rỡ và nét văn hóa giao thương đặc sắc.',
      img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'da-nang',
      badge: currentLang === 'en' ? 'Liveable City' : 'Thành phố đáng sống',
      city: currentLang === 'en' ? 'Da Nang' : 'Đà Nẵng',
      name: currentLang === 'en' ? 'Da Nang Coastal City' : 'Thành phố biển Đà Nẵng',
      desc: currentLang === 'en'
        ? 'Harmonious blend of modern urban space, pristine My Khe beach, and iconic architectural wonders.'
        : 'Hài hòa giữa không gian đô thị hiện đại, bãi biển Mỹ Khê tuyệt mỹ và những công trình kiến trúc biểu tượng.',
      img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'da-lat',
      badge: currentLang === 'en' ? 'Eco Retreat' : 'Du lịch sinh thái',
      city: currentLang === 'en' ? 'Lam Dong - Highlands' : 'Lâm Đồng - Tây Nguyên',
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
      tag: currentLang === 'en' ? '48 Hours • 5 Stops' : '48 Giờ • 5 Điểm đến',
      name: currentLang === 'en' ? 'Explore Central Heritage Trail' : 'Khám phá di sản miền Trung',
      desc: currentLang === 'en'
        ? 'Itinerary connecting Hue – Da Nang – Hoi An, immersing into distinctive world heritage spaces.'
        : 'Hành trình kết nối Huế – Đà Nẵng – Hội An, trải nghiệm không gian văn hóa di sản thế giới đặc sắc.',
      img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'itin-2',
      tag: currentLang === 'en' ? '3 Days 2 Nights • 4 Stops' : '3 Ngày 2 Đêm • 4 Điểm đến',
      name: currentLang === 'en' ? 'Blue Seas & Local Gastronomy' : 'Biển xanh và ẩm thực địa phương',
      desc: currentLang === 'en'
        ? 'Immerse in turquoise waters and relish the vibrant culinary paradise of the central coast.'
        : 'Hài hòa giữa tắm biển trong xanh và thưởng thức thiên đường ẩm thực miền biển tươi ngon.',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'itin-3',
      tag: currentLang === 'en' ? '4 Days 3 Nights • 6 Stops' : '4 Ngày 3 Đêm • 6 Điểm đến',
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
      q: currentLang === 'en' ? 'What content does VTV8.today provide?' : 'VTV8.today cung cấp những nội dung gì?',
      a: currentLang === 'en'
        ? 'VTV8.today is a dedicated digital ecosystem for Vietnamese tourism, culture, heritage, and history (especially Central & Central Highlands, expanding nationwide). It provides specialized articles, interactive digital maps, curated itineraries, travel guides, event/festival updates, and digital showrooms for verified tourism businesses.'
        : 'VTV8.today là hệ sinh thái số chuyên sâu về du lịch, văn hóa, di sản và lịch sử Việt Nam (đặc biệt là miền Trung - Tây Nguyên và mở rộng toàn quốc). Nền tảng cung cấp các bài viết chuyên đề, bản đồ số, gợi ý hành trình, cẩm nang trải nghiệm, tin tức sự kiện lễ hội và danh bạ showroom số của các doanh nghiệp du lịch uy tín.'
    },
    {
      q: currentLang === 'en' ? 'Who can register as a member?' : 'Ai có thể đăng ký trở thành hội viên?',
      a: currentLang === 'en'
        ? 'Travelers, content creators (KOL/KOC/Writers), tourism businesses (hotels, resorts, restaurants, tour operators), and destination authorities can all register to unlock tailored digital benefits.'
        : 'Mọi cá nhân du khách, nhà sáng tạo nội dung (KOL/KOC/Tác giả), doanh nghiệp du lịch (khách sạn, nhà hàng, lữ hành, dịch vụ) và các cơ quan quản lý/hiệp hội điểm đến đều có thể đăng ký tham gia hệ sinh thái để nhận các quyền lợi chuyên biệt.'
    },
    {
      q: currentLang === 'en' ? 'How do businesses register digital showrooms?' : 'Doanh nghiệp đăng ký showroom số như thế nào?',
      a: currentLang === 'en'
        ? 'Businesses choose the Business Member tier on the Registration page and provide company profiles. Once verified, businesses receive a bilingual digital showroom integrated with interactive maps and AI recommendation engines.'
        : 'Doanh nghiệp chỉ cần chọn gói Hội viên Doanh nghiệp tại trang Đăng ký, điền hồ sơ năng lực và sản phẩm. Sau khi được ban biên tập xác thực pháp nhân, doanh nghiệp sẽ sở hữu showroom số đa ngôn ngữ xuất hiện trên bản đồ và hệ thống gợi ý AI của nền tảng.'
    },
    {
      q: currentLang === 'en' ? 'What knowledge sources power the AI Assistant?' : 'Trợ lý AI sử dụng những nguồn dữ liệu nào?',
      a: currentLang === 'en'
        ? 'The VTV8.today AI Assistant is trained and cross-referenced with verified cultural and historical knowledge archives from VTV8, combined with real-time destination databases, event calendars, and authenticated member profiles.'
        : 'Trợ lý AI VTV8.today được huấn luyện và đối chiếu từ nguồn tri thức chuẩn xác về lịch sử, văn hóa, di sản đã được kiểm duyệt của VTV8, kết hợp với dữ liệu thời gian thực từ cơ sở dữ liệu điểm đến, lịch sự kiện và hồ sơ doanh nghiệp đã xác minh.'
    },
    {
      q: currentLang === 'en' ? 'How to submit media and destination collaboration proposals?' : 'Làm thế nào để đề nghị hợp tác truyền thông?',
      a: currentLang === 'en'
        ? 'You can submit your inquiries via the Registration form on the homepage or reach out directly to the Editorial Board via the Contact section to co-create tailored destination campaigns.'
        : 'Bạn có thể để lại thông tin tại Form Đăng ký hợp tác trên trang chủ hoặc liên hệ trực tiếp với Ban quản trị qua mục Liên hệ để được xây dựng chiến dịch quảng bá điểm đến và sản phẩm phù hợp nhất.'
    }
  ];

  return (
    <div className="vtv8-homepage-wrapper" style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#0f172a' }}>
      <SEOHead
        title={currentLang === 'en' 
          ? "VTV8.today — Honoring Heritage, Connecting the Era | Tourism, Culture & Heritage Portal"
          : "VTV8.today — Tôn vinh cội nguồn, kết nối thời đại | Chuyên trang Du lịch, Văn hóa, Di sản"}
        description={currentLang === 'en'
          ? "Digital platform VTV8.today connects Vietnamese culture, heritage, history and tourism with businesses, members and global travelers."
          : "Nền tảng số VTV8.today kết nối văn hóa, di sản, lịch sử và du lịch Việt Nam với cộng đồng hội viên, doanh nghiệp và du khách."}
      />
      <Navbar />

      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        background: `linear-gradient(180deg, rgba(6, 21, 39, 0.72) 0%, rgba(6, 21, 39, 0.82) 65%, rgba(3, 11, 20, 0.96) 100%), url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2000&q=85') center/cover no-repeat`,
        padding: '6.5rem 1.5rem 7.5rem',
        color: '#ffffff',
        textAlign: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Ambient glow accent */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(2, 132, 199, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            fontSize: '11.5px',
            fontWeight: '800',
            letterSpacing: '2px',
            color: '#38bdf8',
            textTransform: 'uppercase',
            marginBottom: '1.8rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}>
            <span>{currentLang === 'en' ? 'VTV8.TODAY • DIGITAL TOURISM & CULTURE ECOSYSTEM' : 'VTV8.TODAY • HỆ SINH THÁI SỐ DU LỊCH & VĂN HÓA'}</span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', 'Cinzel', serif",
            fontSize: 'clamp(2.5rem, 6vw, 4.4rem)',
            fontWeight: '900',
            lineHeight: '1.15',
            letterSpacing: '1px',
            marginBottom: '1.6rem',
            textTransform: 'uppercase',
            textShadow: '0 4px 24px rgba(0,0,0,0.6)'
          }}>
            {currentLang === 'en' ? (
              <>
                <span style={{ color: '#ffffff', display: 'block', marginBottom: '4px' }}>HONORING THE ROOTS</span>
                <span style={{
                  background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                  textShadow: 'none'
                }}>
                  CONNECTING THE ERA
                </span>
              </>
            ) : (
              <>
                <span style={{ color: '#ffffff', display: 'block', marginBottom: '4px' }}>TÔN VINH CỘI NGUỒN</span>
                <span style={{
                  background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                  textShadow: 'none'
                }}>
                  KẾT NỐI THỜI ĐẠI
                </span>
              </>
            )}
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
            color: '#e2e8f0',
            lineHeight: '1.7',
            maxWidth: '820px',
            margin: '0 auto 2.8rem',
            fontWeight: '400',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {currentLang === 'en'
              ? 'A platform promoting Vietnamese tourism, culture, heritage, and history; connecting destinations, businesses, members, and travelers worldwide.'
              : 'Nền tảng quảng bá du lịch, văn hóa, di sản và lịch sử; kết nối điểm đến, doanh nghiệp, cộng đồng hội viên và du khách trong nước, quốc tế.'}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}>
            <button
              onClick={() => {
                const el = document.getElementById('danh-muc-noi-dung');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: '#dc2626',
                backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '30px',
                padding: '0.95rem 2.2rem',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="ti ti-compass"></i>
              <span>{currentLang === 'en' ? 'Explore Vietnam' : 'Khám phá Việt Nam'}</span>
            </button>

            <Link
              to="/register"
              style={{
                backgroundColor: '#d97706',
                backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '30px',
                padding: '0.95rem 2.2rem',
                fontSize: '15px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(217, 119, 6, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="ti ti-user-plus"></i>
              <span>{currentLang === 'en' ? 'Become a Member' : 'Trở thành hội viên'}</span>
            </Link>
          </div>

          <div style={{
            maxWidth: '750px',
            margin: '0 auto',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '50px',
            padding: '6px 8px 6px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)'
          }}>
            <i className="ti ti-search" style={{ color: '#93c5fd', fontSize: '19px', flexShrink: 0 }}></i>
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
                  fontSize: '14.5px',
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
                padding: '10px 20px',
                fontSize: '13.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
              }}
            >
              <i className="ti ti-sparkles" style={{ fontSize: '15px' }}></i>
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
            {currentLang === 'en' ? 'ABOUT US' : 'VỀ CHÚNG TÔI'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'One Platform – Millions of Vietnamese Stories' : 'Một nền tảng – Hàng triệu câu chuyện Việt Nam'}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            {currentLang === 'en'
              ? 'VTV8.today is a dedicated digital ecosystem for culture, heritage, history, and tourism, combining quality journalism, community members, rich destination data, and multilingual AI assistance.'
              : 'VTV8.today được định hướng trở thành hệ sinh thái số chuyên sâu về văn hóa, di sản, lịch sử và du lịch, kết hợp nội dung chất lượng, cộng đồng hội viên, dữ liệu điểm đến và trợ lý AI đa ngôn ngữ.'}
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
                {currentLang === 'en' ? 'Trusted Content' : 'Nội dung tin cậy'}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.65' }}>
                {currentLang === 'en'
                  ? 'Deeply investigated stories on destinations, culture, and heritage thoroughly verified by field experts.'
                  : 'Những câu chuyện có chiều sâu về điểm đến, văn hóa, lịch sử và di sản được kiểm chứng kỹ lưỡng từ các chuyên gia.'}
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
                {currentLang === 'en' ? 'Member Community' : 'Cộng đồng hội viên'}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.65' }}>
                {currentLang === 'en'
                  ? 'Connecting travelers, businesses, artisans, local authorities, and creators into a unified tourism ecosystem.'
                  : 'Kết nối du khách, doanh nghiệp, nghệ nhân, địa phương và nhà sáng tạo thành một khối đoàn kết phát triển du lịch bền vững.'}
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
                {currentLang === 'en' ? 'Destination Database' : 'Dữ liệu điểm đến'}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.65' }}>
                {currentLang === 'en'
                  ? 'Standardized comprehensive data enabling users to seamlessly search, discover, and build travel itineraries.'
                  : 'Chuẩn hóa thông tin phong phú để người dùng dễ dàng tìm kiếm, tra cứu và lập hành trình khám phá thuận tiện nhất.'}
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
                {currentLang === 'en' ? 'Multilingual AI Assistant' : 'Trợ lý AI đa ngôn ngữ'}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.65' }}>
                {currentLang === 'en'
                  ? 'Smart itinerary suggestions, real-time cultural & historical insights, and personalized service matching.'
                  : 'Tư vấn hành trình thông minh, giải đáp chi tiết thông tin văn hóa lịch sử và kết nối dịch vụ phù hợp theo thời gian thực.'}
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
            {currentLang === 'en' ? 'CONTENT CATEGORIES' : 'DANH MỤC NỘI DUNG'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'Discover the Depth of Vietnam' : 'Khám phá chiều sâu của Việt Nam'}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            {currentLang === 'en'
              ? 'Explore our comprehensive category system reflecting the multifaceted culture, tourism economy, and heritage of Vietnam.'
              : 'Khám phá hệ thống chuyên mục đa dạng, phản ánh toàn diện diện mạo văn hóa, kinh tế du lịch và di sản đất nước.'}
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
                    <span>{currentLang === 'en' ? 'Explore now' : 'Khám phá ngay'}</span>
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
            {currentLang === 'en' ? 'FEATURED DESTINATIONS' : 'ĐIỂM ĐẾN TIÊU BIỂU'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'Destinations Awaiting Your Exploration' : 'Điểm đến đang chờ bạn khám phá'}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            {currentLang === 'en'
              ? 'Top attractive destinations across the Central Coast, Central Highlands, and nationwide.'
              : 'Những tọa độ du lịch hấp dẫn hàng đầu tại miền Trung - Tây Nguyên và mở rộng trên khắp mọi miền Tổ quốc.'}
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
                      <span>{currentLang === 'en' ? 'View Itinerary' : 'Xem hành trình'}</span>
                    </Link>
                    <button
                      onClick={() => alert(currentLang === 'en' ? `Saved ${dest.name} to your travel collection!` : `Đã lưu ${dest.name} vào bộ sưu tập hành trình của bạn!`)}
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
                      title={currentLang === 'en' ? "Save destination" : "Lưu điểm đến"}
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

      {/* 5. BLOCK BÀI VIẾT MỚI NHẤT & TIÊU BIỂU (3 HÀNG X 3 CỘT = 9 BÀI) */}
      <section id="bai-viet-moi-nhat" style={{ padding: '5.5rem 1.5rem', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            {currentLang === 'en' ? 'LATEST & FEATURED ARTICLES' : 'BÀI VIẾT & TIN TỨC MỚI NHẤT'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'Stories from VTV8.today Ecosystem' : 'Khám phá câu chuyện mới nhất từ VTV8.today'}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            {currentLang === 'en'
              ? 'Stay updated with cultural insights, travel experiences, festivals, and verified enterprise opportunities across Vietnam.'
              : 'Cập nhật những góc nhìn sâu sắc, hành trình trải nghiệm và tin tức du lịch - văn hóa tiêu biểu nhất.'}
          </p>

          {loadingPosts ? (
            <div style={{ padding: '3rem', color: '#64748b' }}>
              <i className="ti ti-loader-2 animate-spin" style={{ fontSize: '28px', marginRight: '8px' }}></i>
              <span>{currentLang === 'en' ? 'Loading articles...' : 'Đang tải danh sách bài viết...'}</span>
            </div>
          ) : latestPosts.length === 0 ? (
            <div style={{ padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
              <i className="ti ti-news" style={{ fontSize: '36px', marginBottom: '8px', display: 'block', color: '#cbd5e1' }}></i>
              <span>{currentLang === 'en' ? 'No articles published yet.' : 'Chưa có bài viết nào được xuất bản.'}</span>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem',
              textAlign: 'left',
              marginBottom: '3.5rem'
            }}>
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="vtv8-dest-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/posts/${post.slug || post.id}`)}
                >
                  <div className="img-wrap" style={{ height: '190px' }}>
                    <img 
                      src={post.image_url || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'} 
                      alt={post.title} 
                    />
                    
                    {/* Category Badge */}
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
                      {post.category || 'Văn hóa'}
                    </div>

                    {/* Featured Star Badge */}
                    {post.is_featured === 1 && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#f59e0b',
                        color: '#ffffff',
                        fontSize: '10.5px',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.5)'
                      }}>
                        <i className="ti ti-star-filled" style={{ fontSize: '11px' }}></i>
                        <span>{currentLang === 'en' ? 'Featured' : 'Tiêu biểu'}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Meta info: Date & Views */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11.5px', marginBottom: '0.6rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="ti ti-calendar"></i>
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="ti ti-eye"></i>
                        {post.views || 0} {currentLang === 'en' ? 'views' : 'lượt xem'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '16.5px',
                      fontWeight: '800',
                      color: '#0f172a',
                      marginBottom: '0.6rem',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '46px'
                    }}>
                      {post.title}
                    </h3>

                    {/* Summary / Body Excerpt */}
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      lineHeight: '1.6',
                      flex: 1,
                      marginBottom: '1.2rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '42px'
                    }}>
                      {post.summary || post.body?.replace(/<[^>]*>?/gm, '').substring(0, 110) || 'Đang cập nhật nội dung chi tiết...'}
                    </p>

                    {/* Bottom Author & Read Link */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '0.8rem',
                      marginTop: 'auto'
                    }}>
                      <span style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>
                        ✍️ {post.company_name || 'Ban Biên tập VTV8'}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span>{currentLang === 'en' ? 'Read article' : 'Đọc tiếp'}</span>
                        <i className="ti ti-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Posts Button */}
          <Link
            to="/posts"
            className="btn-vtv8-red"
            style={{ fontSize: '14.5px', padding: '0.9rem 2.4rem' }}
          >
            <i className="ti ti-layout-grid"></i>
            <span>{currentLang === 'en' ? 'View All Articles' : 'Xem toàn bộ bài viết'}</span>
          </Link>
        </div>
      </section>

      {/* 5.5 BLOCK SỰ KIỆN & LỄ HỘI NỔI BẬT */}
      <section id="su-kien-le-hoi" style={{ padding: '5.5rem 1.5rem', backgroundColor: '#fcfbfa', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#0284c7',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            {currentLang === 'en' ? 'FEATURED EVENTS & FESTIVALS' : 'SỰ KIỆN & LỄ HỘI NỔI BẬT'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'Events & Cultural Festivals Calendar' : 'Lịch trình Sự kiện & Lễ hội Văn hóa'}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            {currentLang === 'en'
              ? 'Immerse into distinctive festive traditions, investment promotion symposiums, and vibrant tourism activities across Vietnam.'
              : 'Không gian kết nối giao lưu văn hóa, xúc tiến du lịch và hội thảo đầu tư tiêu biểu tại các địa phương.'}
          </p>

          {loadingEvents ? (
            <div style={{ padding: '3rem', color: '#64748b' }}>
              <i className="ti ti-loader-2 animate-spin" style={{ fontSize: '28px', marginRight: '8px' }}></i>
              <span>{currentLang === 'en' ? 'Loading events calendar...' : 'Đang tải lịch sự kiện...'}</span>
            </div>
          ) : eventsList.length === 0 ? (
            <div style={{ padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px', color: '#64748b', border: '1px solid #e2e8f0' }}>
              <i className="ti ti-calendar" style={{ fontSize: '36px', marginBottom: '8px', display: 'block', color: '#cbd5e1' }}></i>
              <span>{currentLang === 'en' ? 'No upcoming events scheduled.' : 'Chưa có sự kiện nào sắp diễn ra.'}</span>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2rem',
              textAlign: 'left',
              marginBottom: '3.5rem'
            }}>
              {eventsList.map((event) => (
                <div
                  key={event.id}
                  className="vtv8-dest-card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/events')}
                >
                  <div className="img-wrap" style={{ height: '190px' }}>
                    <img 
                      src={event.image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80'} 
                      alt={event.title} 
                    />
                    
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: event.status === 'ongoing' ? '#10b981' : '#f59e0b',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                      {event.status === 'ongoing' 
                        ? (currentLang === 'en' ? '● Ongoing' : '● Đang diễn ra') 
                        : (currentLang === 'en' ? '⏳ Upcoming' : '⏳ Sắp diễn ra')}
                    </div>

                    {/* Interest Count Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <i className="ti ti-star-filled" style={{ color: '#f59e0b', fontSize: '11px' }}></i>
                      <span>{event.interest_count || 0} {currentLang === 'en' ? 'interested' : 'quan tâm'}</span>
                    </div>
                  </div>

                  <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '12px', fontWeight: '700', marginBottom: '0.4rem' }}>
                      <i className="ti ti-calendar-event"></i>
                      <span>{event.event_date ? new Date(event.event_date).toLocaleDateString('vi-VN') : 'Sắp công bố'}</span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '16.5px',
                      fontWeight: '800',
                      color: '#0f172a',
                      marginBottom: '0.6rem',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '46px'
                    }}>
                      {event.title}
                    </h3>

                    {/* Location */}
                    {event.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#dc2626', fontSize: '12px', fontWeight: '600', marginBottom: '0.6rem' }}>
                        <i className="ti ti-map-pin"></i>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.location}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      lineHeight: '1.6',
                      flex: 1,
                      marginBottom: '1.2rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '42px'
                    }}>
                      {event.description || 'Sự kiện văn hóa du lịch tiêu biểu do VTV8.today đồng hành tổ chức...'}
                    </p>

                    {/* Bottom Organizer & CTA */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '0.8rem',
                      marginTop: 'auto'
                    }}>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '500', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        🏛️ {event.organizer || 'VTV8.today'}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span>{currentLang === 'en' ? 'Details' : 'Xem chi tiết'}</span>
                        <i className="ti ti-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Events Button */}
          <Link
            to="/events"
            className="btn-vtv8-gold"
            style={{ fontSize: '14.5px', padding: '0.9rem 2.4rem' }}
          >
            <i className="ti ti-calendar"></i>
            <span>{currentLang === 'en' ? 'View All Events' : 'Xem toàn bộ lịch sự kiện'}</span>
          </Link>
        </div>
      </section>

      {/* 5.6 BLOCK DOANH NGHIỆP HỘI VIÊN TIÊU BIỂU (TỐI ĐA 3 HỘI VIÊN GHIM NỔI BẬT & GÓI CAO) */}
      <section id="hoi-vien-tieu-bieu" style={{ padding: '5.5rem 1.5rem', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            {currentLang === 'en' ? 'FEATURED MEMBER ENTERPRISES' : 'DOANH NGHIỆP HỘI VIÊN TIÊU BIỂU'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'Verified Member Network & Tourism Partners' : 'Mạng lưới Doanh nghiệp & Đối tác Tiêu biểu'}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            {currentLang === 'en'
              ? 'Connect directly with premium hospitality, tour operators, resorts, and cultural culinary brands in the VTV8.today ecosystem.'
              : 'Không gian giới thiệu các thương hiệu lưu trú, lữ hành, nghỉ dưỡng và ẩm thực du lịch uy tín trong hệ sinh thái VTV8.today.'}
          </p>

          {loadingMembers ? (
            <div style={{ padding: '3rem', color: '#64748b' }}>
              <i className="ti ti-loader-2 animate-spin" style={{ fontSize: '28px', marginRight: '8px' }}></i>
              <span>{currentLang === 'en' ? 'Loading verified members...' : 'Đang tải danh bạ hội viên tiêu biểu...'}</span>
            </div>
          ) : featuredMembers.length === 0 ? (
            <div style={{ padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#64748b', border: '1px solid #e2e8f0' }}>
              <i className="ti ti-building-community" style={{ fontSize: '36px', marginBottom: '8px', display: 'block', color: '#cbd5e1' }}></i>
              <span>{currentLang === 'en' ? 'No member profiles available.' : 'Chưa có thông tin hội viên doanh nghiệp.'}</span>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2rem',
              textAlign: 'left',
              marginBottom: '3.5rem'
            }}>
              {featuredMembers.map((member) => {
                const isPlat = member.tier === 'Platinum';
                const isGold = member.tier === 'Gold';
                const initials = member.name ? member.name.substring(0, 2).toUpperCase() : 'DN';

                return (
                  <div
                    key={member.id}
                    className="vtv8-dest-card"
                    style={{
                      cursor: 'pointer',
                      border: isPlat ? '2px solid rgba(245, 158, 11, 0.4)' : '1px solid #e2e8f0',
                      boxShadow: isPlat ? '0 10px 30px rgba(245, 158, 11, 0.12)' : '0 4px 20px rgba(0,0,0,0.04)'
                    }}
                    onClick={() => navigate(`/members?search=${encodeURIComponent(member.name)}`)}
                  >
                    <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      {/* Top Row: Avatar & Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: '14px',
                            background: isPlat 
                              ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' 
                              : isGold 
                              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                              : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                            color: '#ffffff',
                            fontWeight: '800',
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isPlat ? '0 6px 16px rgba(255, 165, 0, 0.4)' : '0 4px 12px rgba(2, 132, 199, 0.3)',
                            flexShrink: 0
                          }}>
                            {initials}
                          </div>

                          <div>
                            <span style={{
                              display: 'inline-block',
                              fontSize: '10.5px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              background: isPlat ? 'rgba(245, 158, 11, 0.15)' : isGold ? 'rgba(245, 158, 11, 0.1)' : 'rgba(2, 132, 199, 0.1)',
                              color: isPlat || isGold ? '#d97706' : '#0284c7',
                              border: `1px solid ${isPlat || isGold ? 'rgba(245, 158, 11, 0.3)' : 'rgba(2, 132, 199, 0.2)'}`
                            }}>
                              {isPlat ? '👑 Platinum' : isGold ? '⭐ Gold' : 'Silver'}
                            </span>
                          </div>
                        </div>

                        {/* Featured Star Pill if is_featured */}
                        {member.is_featured === 1 && (
                          <div style={{
                            backgroundColor: '#f59e0b',
                            color: '#ffffff',
                            fontSize: '10.5px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                          }}>
                            <i className="ti ti-star-filled" style={{ fontSize: '11px' }}></i>
                            <span>{currentLang === 'en' ? 'Featured' : 'Tiêu biểu'}</span>
                          </div>
                        )}
                      </div>

                      {/* Company Name */}
                      <h3 style={{
                        fontSize: '17px',
                        fontWeight: '800',
                        color: '#0f172a',
                        marginBottom: '0.6rem',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '46px'
                      }}>
                        {member.name}
                      </h3>

                      {/* Industry & City */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.8rem', fontSize: '12px', color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <i className="ti ti-briefcase" style={{ color: '#0284c7' }}></i>
                          <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.industry || 'Du lịch & Dịch vụ'}</span>
                        </span>

                        {member.city && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <i className="ti ti-map-pin" style={{ color: '#dc2626' }}></i>
                            <span>{member.city}</span>
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p style={{
                        fontSize: '13px',
                        color: '#64748b',
                        lineHeight: '1.6',
                        flex: 1,
                        marginBottom: '1.4rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '42px'
                      }}>
                        {member.description || 'Doanh nghiệp hội viên uy tín thuộc hệ sinh thái số du lịch, văn hóa VTV8.today.'}
                      </p>

                      {/* Bottom Button */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '0.9rem',
                        marginTop: 'auto'
                      }}>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: '500' }}>
                          {currentLang === 'en' ? 'Verified Member' : 'Đã xác thực pháp nhân'}
                        </span>
                        <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{currentLang === 'en' ? 'View Showroom' : 'Xem Showroom'}</span>
                          <i className="ti ti-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Members Button */}
          <Link
            to="/members"
            className="btn-vtv8-red"
            style={{ fontSize: '14.5px', padding: '0.9rem 2.4rem' }}
          >
            <i className="ti ti-building"></i>
            <span>{currentLang === 'en' ? 'View All Member Enterprises' : 'Xem tất cả doanh nghiệp hội viên'}</span>
          </Link>
        </div>
      </section>

      {/* 6. GỢI Ý HÀNH TRÌNH */}
      <section id="goi-y-hanh-trinh" style={{ padding: '5.5rem 1.5rem', backgroundColor: '#fcfbfa' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '1.5px',
            color: '#dc2626',
            textTransform: 'uppercase',
            marginBottom: '0.6rem'
          }}>
            {currentLang === 'en' ? 'SUGGESTED ITINERARIES' : 'GỢI Ý HÀNH TRÌNH'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'Choose a Journey – Touch a Story' : 'Chọn một hành trình – Chạm vào một câu chuyện'}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            {currentLang === 'en'
              ? 'Standardized itinerary packages designed to optimize time and fully immerse into authentic local culture.'
              : 'Các gói hành trình được thiết kế chuẩn hóa giúp du khách tối ưu thời gian và trải nghiệm trọn vẹn văn hóa bản địa.'}
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
                      to="/posts?category=Điểm đến nổi bật"
                      className="btn-vtv8-red"
                      style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '13px' }}
                    >
                      <span>{currentLang === 'en' ? 'View Details' : 'Xem chi tiết'}</span>
                    </Link>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        alert(currentLang === 'en' ? 'Itinerary link copied!' : 'Đã sao chép liên kết hành trình!');
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
                      title={currentLang === 'en' ? "Share itinerary" : "Chia sẻ hành trình"}
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

      {/* 7. CỘNG ĐỒNG & DOANH NGHIỆP */}
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
            {currentLang === 'en' ? 'COMMUNITY & ENTERPRISES' : 'CỘNG ĐỒNG & DOANH NGHIỆP'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'Join the VTV8.today Ecosystem' : 'Gia nhập cộng đồng VTV8.today'}
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '15px',
            maxWidth: '780px',
            margin: '0 auto 3.5rem',
            lineHeight: '1.7'
          }}>
            {currentLang === 'en'
              ? 'Every member owns a digital profile, tangible benefits, and opportunities to co-create Vietnam’s tourism-culture ecosystem.'
              : 'Mỗi hội viên sở hữu một hồ sơ số, quyền lợi thiết thực và cơ hội đóng góp vào hệ sinh thái du lịch - văn hóa Việt Nam.'}
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
                  {currentLang === 'en' ? 'Individual Members' : 'Hội viên cá nhân'}
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Save & manage personalized itineraries' : 'Lưu và quản lý hành trình cá nhân'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Receive interest-based curated stories' : 'Nhận nội dung chuyên sâu theo sở thích'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Join exclusive cultural events' : 'Tham gia sự kiện văn hóa độc quyền'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Exclusive partner discounts & perks' : 'Nhận ưu đãi đặc quyền từ đối tác'}</span>
                </li>
              </ul>
            </div>

            <div className="vtv8-member-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                <i className="ti ti-camera" style={{ color: '#38bdf8', fontSize: '24px' }}></i>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  {currentLang === 'en' ? 'Content Creators' : 'Nhà sáng tạo'}
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Build a verified author channel' : 'Xây dựng trang tác giả chuyên nghiệp'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Publish photos, videos, travel guides' : 'Giới thiệu hình ảnh, video, bài viết'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Participate in large media campaigns' : 'Tham gia chiến dịch truyền thông lớn'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Monetize content under platform terms' : 'Thương mại hóa nội dung theo chính sách'}</span>
                </li>
              </ul>
            </div>

            <div className="vtv8-member-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                <i className="ti ti-building" style={{ color: '#ec4899', fontSize: '24px' }}></i>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  {currentLang === 'en' ? 'Tourism Enterprises' : 'Doanh nghiệp du lịch'}
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Build a multilingual digital showroom' : 'Xây dựng showroom số đa ngôn ngữ'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Showcase hospitality services & deals' : 'Giới thiệu sản phẩm, dịch vụ, ưu đãi'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Directly featured on interactive maps' : 'Xuất hiện trực tiếp trên bản đồ điểm đến'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Acquire qualified prospective travelers' : 'Tiếp nhận khách hàng tiềm năng chất lượng'}</span>
                </li>
              </ul>
            </div>

            <div className="vtv8-member-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                <i className="ti ti-map-2" style={{ color: '#a855f7', fontSize: '24px' }}></i>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                  {currentLang === 'en' ? 'Local Partners' : 'Đối tác địa phương'}
                </h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Dedicated destination landing portals' : 'Xây dựng chuyên trang địa phương riêng'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Promote key festivals & landmarks' : 'Quảng bá điểm đến và sự kiện đặc quyền'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Cultivate regional business networks' : 'Phát triển cộng đồng doanh nghiệp liên kết'}</span>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <i className="ti ti-check" style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}></i>
                  <span>{currentLang === 'en' ? 'Monitor visitor interest & engagement' : 'Theo dõi dữ liệu quan tâm của du khách'}</span>
                </li>
              </ul>
            </div>
          </div>

          <Link
            to="/register"
            className="btn-vtv8-gold"
            style={{ fontSize: '15px', padding: '0.9rem 2.2rem' }}
          >
            <span>{currentLang === 'en' ? 'Register and Join Now' : 'Đăng ký tham gia ngay'}</span>
          </Link>
        </div>
      </section>

      {/* 8. CÔNG NGHỆ THÔNG MINH */}
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
              {currentLang === 'en' ? 'SMART TECHNOLOGY' : 'CÔNG NGHỆ THÔNG MINH'}
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '1.2rem',
              lineHeight: '1.2'
            }}>
              {currentLang === 'en' ? 'AI Assistant Accompanying Every Journey' : 'Trợ lý AI đồng hành trên mỗi hành trình'}
            </h2>
            <p style={{
              color: '#475569',
              fontSize: '15px',
              lineHeight: '1.7',
              marginBottom: '2rem'
            }}>
              {currentLang === 'en'
                ? 'VTV8.today AI Assistant helps travelers explore destinations, understand historical culture, design customized itineraries, and find verified services in multiple languages accurately.'
                : 'Trợ lý AI VTV8.today giúp du khách khám phá điểm đến, tìm hiểu lịch sử – văn hóa, lập lịch trình, tìm sự kiện và kết nối dịch vụ bằng nhiều ngôn ngữ một cách nhanh chóng, chính xác.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                <i className="ti ti-circle-check-filled" style={{ color: '#10b981', fontSize: '18px' }}></i>
                <span>{currentLang === 'en' ? 'Personalized destination recommendations' : 'Gợi ý điểm đến cá nhân hóa theo sở thích riêng'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                <i className="ti ti-circle-check-filled" style={{ color: '#10b981', fontSize: '18px' }}></i>
                <span>{currentLang === 'en' ? 'Detailed schedules matched to time and budget' : 'Lập hành trình chi tiết theo thời gian và ngân sách'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                <i className="ti ti-circle-check-filled" style={{ color: '#10b981', fontSize: '18px' }}></i>
                <span>{currentLang === 'en' ? 'Visual lookups for history, culture, and relics' : 'Tra cứu lịch sử, văn hóa, di sản trực quan'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                <i className="ti ti-circle-check-filled" style={{ color: '#10b981', fontSize: '18px' }}></i>
                <span>{currentLang === 'en' ? 'Locate member hotels, restaurants & showrooms' : 'Tìm khách sạn, nhà hàng và doanh nghiệp hội viên'}</span>
              </div>
            </div>

            <Link
              to="/ai-chat"
              className="btn-vtv8-red"
              style={{ fontSize: '14.5px', padding: '0.85rem 1.8rem' }}
            >
              <i className="ti ti-sparkles"></i>
              <span>{currentLang === 'en' ? 'Experience AI Assistant' : 'Trải nghiệm trợ lý AI'}</span>
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
                  {currentLang === 'en' ? 'VTV8.today Travel Assistant' : 'Trợ lý du lịch VTV8.today'}
                </div>
                <div style={{ color: '#93c5fd', fontSize: '11px' }}>
                  {currentLang === 'en' ? 'Multilingual Support 24/7' : 'Sẵn sàng hỗ trợ đa ngôn ngữ 24/7'}
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
                {currentLang === 'en'
                  ? 'I have 3 days to explore Central Vietnam. Please create a schedule combining heritage, beach, and local gastronomy.'
                  : 'Tôi có 3 ngày khám phá miền Trung. Hãy xây dựng hành trình kết hợp di sản, biển và ẩm thực.'}
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
                {currentLang === 'en' ? (
                  <>Hello! Based on your request, I propose a 3-day 2-night itinerary: <strong>Da Nang – Hoi An – Hue</strong>. Day 1: Marble Mountains & Hoi An Ancient Town; Day 2: My Khe Beach & local delicacies; Day 3: Imperial City of Hue. Would you like to save this itinerary?</>
                ) : (
                  <>Xin chào! Dựa trên yêu cầu của bạn, tôi đề xuất hành trình 3 ngày 2 đêm: <strong>Đà Nẵng – Hội An – Huế</strong>. Ngày 1 tham quan Ngũ Hành Sơn và phố cổ Hội An; Ngày 2 trải nghiệm bãi biển Mỹ Khê và thưởng thức Mỳ Quảng; Ngày 3 khám phá Đại Nội Huế. Bạn muốn lưu lại hành trình này không?</>
                )}
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
                  onClick={() => navigate(`/ai-chat?q=${encodeURIComponent(currentLang === 'en' ? 'Specialty food recommendations for Da Nang and Hoi An' : 'Gợi ý ẩm thực đặc sản Đà Nẵng và Hội An')}`)}
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
                  🍜 {currentLang === 'en' ? 'Da Nang - Hoi An Cuisine' : 'Đặc sản Đà Nẵng - Hội An'}
                </button>
                <button
                  onClick={() => navigate(`/ai-chat?q=${encodeURIComponent(currentLang === 'en' ? '2-day 1-night travel schedule for Da Lat' : 'Lịch trình 2 ngày 1 đêm khám phá Đà Lạt')}`)}
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
                  🌲 {currentLang === 'en' ? '2D1N Da Lat Itinerary' : 'Lịch trình 2N1Đ Đà Lạt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. DẢI THỐNG KÊ */}
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
            <div className="vtv8-stat-label">{currentLang === 'en' ? 'Featured Destinations' : 'Điểm đến giới thiệu'}</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">500+</div>
            <div className="vtv8-stat-label">{currentLang === 'en' ? 'Cultural Stories' : 'Câu chuyện văn hóa - di sản'}</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">120+</div>
            <div className="vtv8-stat-label">{currentLang === 'en' ? 'Member Enterprises' : 'Doanh nghiệp hội viên'}</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">1,200+</div>
            <div className="vtv8-stat-label">{currentLang === 'en' ? 'Itineraries Created' : 'Hành trình được tạo'}</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">34</div>
            <div className="vtv8-stat-label">{currentLang === 'en' ? 'Provinces Participating' : 'Tỉnh thành tham gia'}</div>
          </div>
          <div className="vtv8-stat-item">
            <div className="vtv8-stat-num">02</div>
            <div className="vtv8-stat-label">{currentLang === 'en' ? 'Bilingual Support (VI/EN)' : 'Ngôn ngữ hỗ trợ (VI/EN)'}</div>
          </div>
        </div>
      </section>

      {/* 10. THAM GIA HỆ SINH THÁI */}
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
            {currentLang === 'en' ? 'JOIN THE ECOSYSTEM' : 'THAM GIA HỆ SINH THÁI'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'Be Part of VTV8.today' : 'Trở thành một phần của VTV8.today'}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '3rem'
          }}>
            {currentLang === 'en'
              ? 'Submit your details below to register member accounts, setup business showrooms, or propose media collaboration.'
              : 'Điền thông tin bên dưới để đăng ký tài khoản hội viên, tạo showroom doanh nghiệp hoặc đề nghị hợp tác truyền thông.'}
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
                  {currentLang === 'en' ? 'Registration Successful!' : 'Đăng ký thành công!'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
                  {currentLang === 'en'
                    ? 'Thank you for joining VTV8.today. Our editorial and development team will contact you shortly.'
                    : 'Cảm ơn bạn đã tham gia hệ sinh thái VTV8.today. Đội ngũ phát triển sẽ liên hệ với bạn trong thời gian sớm nhất.'}
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="btn-vtv8-red"
                  style={{ marginTop: '1.5rem', fontSize: '13.5px' }}
                >
                  {currentLang === 'en' ? 'Submit Another Request' : 'Gửi thêm thông tin'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      {currentLang === 'en' ? 'Full Name *' : 'Họ và tên *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={currentLang === 'en' ? 'Enter your full name' : 'Nhập họ và tên của bạn'}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      {currentLang === 'en' ? 'Phone Number *' : 'Số điện thoại *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={currentLang === 'en' ? 'Enter contact phone number' : 'Nhập số điện thoại liên hệ'}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      {currentLang === 'en' ? 'Email Address *' : 'Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={currentLang === 'en' ? 'Enter email address' : 'Nhập địa chỉ email'}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      {currentLang === 'en' ? 'Province / City' : 'Tỉnh / Thành phố'}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder={currentLang === 'en' ? 'e.g., Da Nang, Quang Nam...' : 'Ví dụ: Đà Nẵng, Quảng Nam...'}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      {currentLang === 'en' ? 'Member Category *' : 'Loại hội viên muốn đăng ký *'}
                    </label>
                    <select
                      value={formData.memberType}
                      onChange={(e) => setFormData({ ...formData, memberType: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none', backgroundColor: '#fff' }}
                    >
                      <option value="member_personal">{currentLang === 'en' ? 'Individual Member / Traveler' : 'Hội viên cá nhân / Du khách'}</option>
                      <option value="member_creator">{currentLang === 'en' ? 'Content Creator / Author' : 'Nhà sáng tạo nội dung / Tác giả'}</option>
                      <option value="member_biz">{currentLang === 'en' ? 'Tourism Enterprise / Hospitality' : 'Doanh nghiệp du lịch / Lưu trú / Dịch vụ'}</option>
                      <option value="member_partner">{currentLang === 'en' ? 'Destination Authority / Association' : 'Đối tác địa phương / Cơ quan / Hiệp hội'}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                      {currentLang === 'en' ? 'Company / Organization Name' : 'Tên doanh nghiệp hoặc đơn vị (Nếu có)'}
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder={currentLang === 'en' ? 'Company, Hotel, Resort name...' : 'Tên công ty, khách sạn, nhà hàng...'}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.4rem' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    {currentLang === 'en' ? 'Collaboration Needs / Notes' : 'Nhu cầu hợp tác / Nội dung cần tư vấn'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={currentLang === 'en' ? 'Share your connection goals or digital showroom requirements...' : 'Chia sẻ thêm về nhu cầu kết nối hoặc xây dựng showroom số của bạn...'}
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
                    {currentLang === 'en' ? 'I agree with VTV8.today data protection policy and terms of service.' : 'Tôi đồng ý với chính sách bảo vệ dữ liệu và điều khoản sử dụng của VTV8.today.'}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-vtv8-red"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '15px' }}
                >
                  {formLoading 
                    ? (currentLang === 'en' ? 'Submitting...' : 'Đang gửi thông tin...') 
                    : (currentLang === 'en' ? 'Register and Join Now' : 'Đăng ký tham gia ngay')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 11. GIẢI ĐÁP THẮC MẮC */}
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
            {currentLang === 'en' ? 'FAQS' : 'GIẢI ĐÁP THẮC MẮC'}
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {currentLang === 'en' ? 'Frequently Asked Questions' : 'Câu hỏi thường gặp'}
          </h2>
          <p style={{
            color: '#475569',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '3rem'
          }}>
            {currentLang === 'en'
              ? 'Detailed insights on operations, membership advantages, and strategic vision of VTV8.today.'
              : 'Tổng hợp thông tin chi tiết về cơ chế hoạt động, quyền lợi hội viên và định hướng phát triển của VTV8.today.'}
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

      {/* 12. BOTTOM BANNER */}
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
            {currentLang === 'en' ? 'Every Land Holds a Story Worth Telling' : 'Mỗi vùng đất đều có một câu chuyện đáng được kể'}
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '2.5rem'
          }}>
            {currentLang === 'en'
              ? 'Join VTV8.today in honoring Vietnamese heritage, connecting communities, and creating inspirational new journeys.'
              : 'Hãy cùng VTV8.today tôn vinh những giá trị của Việt Nam, kết nối cộng đồng và kiến tạo những hành trình mới.'}
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
              {currentLang === 'en' ? 'Explore Now' : 'Khám phá ngay'}
            </button>
            <Link
              to="/register"
              className="btn-vtv8-red"
              style={{ fontSize: '14.5px', padding: '0.85rem 1.8rem' }}
            >
              {currentLang === 'en' ? 'Register as Member' : 'Đăng ký hội viên'}
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
