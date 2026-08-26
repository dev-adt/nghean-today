import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingAIBot from '../components/FloatingAIBot';
import InteractiveMap from '../components/InteractiveMap';
import SEOHead from '../components/SEOHead';

export const Home = () => {
  const { role, token } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [stats, setStats] = useState({ members: 0, posts: 0, events: 0 });
  const [latestPosts, setLatestPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [choHaiSanPosts, setChoHaiSanPosts] = useState([]);
  const [loadingChoHaiSan, setLoadingChoHaiSan] = useState(true);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [featuredMembers, setFeaturedMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  
  // Realtime Weather State (Open-Meteo API for Đồ Sơn: 20.7077, 106.7865)
  const [weatherData, setWeatherData] = useState({
    temp: 28,
    desc: 'Nắng nhẹ, gió biển 12 km/h',
    time: 'Vừa cập nhật',
    icon: 'ti-sun',
    status: 'An toàn tắm biển',
    loading: true
  });

  // Search & Map state
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [mapCategory, setMapCategory] = useState('all');

  // Scroll to Top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Map Ref
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Listen to scroll position for Scroll-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Realtime Weather Fetching from Open-Meteo API (100% Free, No API key needed)
  useEffect(() => {
    const fetchLiveWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=20.7077&longitude=106.7865&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FHo_Chi_Minh'
        );
        if (res.ok) {
          const data = await res.json();
          const current = data.current;
          if (current) {
            const temp = Math.round(current.temperature_2m);
            const wind = Math.round(current.wind_speed_10m);
            const code = current.weather_code;

            let desc = 'Trời quang, gió nhẹ';
            let icon = 'ti-sun';
            let status = 'An toàn tắm biển';

            if (code === 0 || code === 1) {
              desc = `Nắng đẹp, gió biển ${wind} km/h`;
              icon = 'ti-sun';
              status = 'An toàn tắm biển';
            } else if (code === 2 || code === 3) {
              desc = `Có mây rải rác, gió biển ${wind} km/h`;
              icon = 'ti-cloud-sun';
              status = 'An toàn tắm biển';
            } else if (code >= 51 && code <= 67) {
              desc = `Mưa nhỏ rải rác, gió biển ${wind} km/h`;
              icon = 'ti-cloud-rain';
              status = 'Chú ý khi tắm biển';
            } else if (code >= 80) {
              desc = `Mưa rào & dông, gió ${wind} km/h`;
              icon = 'ti-cloud-storm';
              status = 'Hạn chế tắm biển';
            }

            setWeatherData({
              temp,
              desc,
              time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' hôm nay',
              icon,
              status,
              loading: false
            });
          }
        }
      } catch (err) {
        console.log('Open-Meteo live weather fetch note:', err);
      }
    };

    fetchLiveWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchLiveWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Public Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/public-stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  // Fetch Latest Approved Posts (Max 9, featured first)
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/posts?status=approved', { headers });
        if (res.ok) {
          const data = await res.json();
          const allPosts = data.data || [];
          const featured = allPosts.filter(p => p.is_featured === 1);
          const normal = allPosts.filter(p => p.is_featured !== 1);
          setLatestPosts([...featured, ...normal].slice(0, 9));
        }
      } catch (err) {
        console.error('Error fetching latest posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchLatestPosts();
  }, [token]);

  // Fetch Posts cho Chuyên mục "Chợ hải sản"
  useEffect(() => {
    const fetchChoHaiSanPosts = async () => {
      setLoadingChoHaiSan(true);
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch(`/api/posts?category=${encodeURIComponent('Chợ hải sản')}&status=approved`, { headers });
        if (res.ok) {
          const data = await res.json();
          let posts = data.data || [];
          if (!posts.length) {
            const res2 = await fetch(`/api/posts?category=${encodeURIComponent('Chợ Hải Sản')}&status=approved`, { headers });
            if (res2.ok) {
              const data2 = await res2.json();
              posts = data2.data || [];
            }
          }
          setChoHaiSanPosts(posts.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching Chợ hải sản posts:', err);
      } finally {
        setLoadingChoHaiSan(false);
      }
    };
    fetchChoHaiSanPosts();
  }, [token]);

  // Fetch Upcoming Events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
        const res = await fetch('/api/events?limit=3&upcoming=true', { headers });
        if (res.ok) {
          const data = await res.json();
          setEvents(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, [token]);

  // Fetch Member Businesses for Homepage Showroom (Prioritizing featured members, max 3)
  useEffect(() => {
    const fetchFeaturedMembers = async () => {
      setLoadingMembers(true);
      try {
        const res = await fetch('/api/members?status=approved');
        if (res.ok) {
          const data = await res.json();
          const allMembers = data.data || [];

          // Sort members: is_featured === 1 comes first, then by tier priority (Platinum > Gold > Silver)
          const sorted = [...allMembers].sort((a, b) => {
            const featA = a.is_featured === 1 ? 1 : 0;
            const featB = b.is_featured === 1 ? 1 : 0;
            if (featB !== featA) return featB - featA;

            const tierWeight = { Platinum: 3, Gold: 2, Silver: 1 };
            const weightA = tierWeight[a.tier] || 0;
            const weightB = tierWeight[b.tier] || 0;
            if (weightB !== weightA) return weightB - weightA;

            return (b.id || 0) - (a.id || 0);
          });

          setFeaturedMembers(sorted);
        }
      } catch (err) {
        console.error('Error fetching member businesses:', err);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchFeaturedMembers();
  }, []);

  // Default fallback members to ensure clean 3-card layout if DB has fewer than 3 members
  const defaultFallbackMembers = [
    {
      id: 'fb1',
      name: 'HTX Nông nghiệp Đồ Sơn – Táo Bàng OCOP 4 sao',
      badge: 'Sản phẩm OCOP địa phương',
      status: 'Xác thực ✔',
      is_featured: 1,
      tier: 'Gold',
      desc: 'Đặc sản Táo Bàng ngọt thanh nổi tiếng Đồ Sơn, chuẩn vệ sinh an toàn thực phẩm OCOP 4 sao.',
      phone: '0904.555.666'
    },
    {
      id: 'fb2',
      name: 'Công ty CP Du lịch & Dịch vụ Hải Phòng',
      badge: 'Doanh nghiệp tiêu biểu',
      status: 'Thành viên Vàng ⭐',
      is_featured: 1,
      tier: 'Platinum',
      desc: 'Kinh doanh chuỗi nhà hàng, khách sạn và tour lữ hành nội địa cao cấp tại Đồ Sơn.',
      phone: '0225.3861.999'
    },
    {
      id: 'fb3',
      name: 'Cơ sở Chả Cá Thu & Nước Mắm Vạn Vân',
      badge: 'Đặc sản truyền thống',
      status: 'Xác thực ✔',
      is_featured: 0,
      tier: 'Silver',
      desc: 'Nước mắm Cát Vân vang danh và chả cá Thu Đồ Sơn nguyên chất không chất bảo quản.',
      phone: '0977.222.333'
    }
  ];

  // Default fallback posts cho chuyên mục Chợ Hải Sản
  const demoSeafoodList = [
    {
      id: 'sf-1',
      title: 'Cua Biển Đồ Sơn Tươi Sống (Cua Gạch & Cua Thịt Đặc Sản)',
      summary: 'Cua biển Đồ Sơn thịt chắc, ngọt thơm. Đánh bắt tươi sống trong ngày tại vùng biển Đồ Sơn - Hải Phòng.',
      image_url: 'https://images.unsplash.com/photo-1559742811-822863c46f43?auto=format&fit=crop&w=600&q=80',
      company_name: 'Hải Sản Tươi Ngon Đồ Sơn',
      category: 'Chợ hải sản',
      sub_category: 'Cua, Ghẹ biển',
      created_at: 'Hôm nay'
    },
    {
      id: 'sf-2',
      title: 'Bề Bề Chao (Tôm Tít) Tươi Sống Nguồn Hàng Giá Sỉ Đồ Sơn',
      summary: 'Chuyên cung cấp Bề bề tươi sống nguyên con, thịt dai ngọt chắc nịch cho nhà hàng, khách sạn và khách du lịch.',
      image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80',
      company_name: 'Ngư Dân Đồ Sơn',
      category: 'Chợ hải sản',
      sub_category: 'Tôm, Bề Bề',
      created_at: 'Hôm nay'
    },
    {
      id: 'sf-3',
      title: 'Mực Lá & Mực Ống Đồ Sơn Cấp Đông Tại Tàu Ngay Khi Đánh Bắt',
      summary: 'Mực biển Đồ Sơn câu tự nhiên, giòn ngọt đậm đà vị biển. Đảm bảo 100% không chất bảo quản.',
      image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
      company_name: 'Hợp Tác Xã Đánh Bắt Hải Sản',
      category: 'Chợ hải sản',
      sub_category: 'Mực biển tươi',
      created_at: 'Hôm nay'
    }
  ];

  // Default fallback posts cho tin tức / bài viết nổi bật (9 bài)
  const demoNewsList = [
    {
      id: 'news-1',
      title: 'Cẩm nang giữ gìn bãi biển Đồ Sơn sạch đẹp: Những việc mỗi người đều có thể thực hiện',
      summary: 'Hướng dẫn tham gia giữ gìn môi trường biển Đồ Sơn sáng - xanh - sạch - đẹp cho khách du lịch và cư dân địa phương.',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      company_name: 'Ban Quản Lý Du Lịch Đồ Sơn',
      created_at: '19/8/2026',
      is_featured: 1
    },
    {
      id: 'news-2',
      title: 'Khách sạn phù hợp gia đình tại Đồ Sơn – những điều cần biết trước khi trải nghiệm',
      summary: 'Tổng hợp danh sách các khách sạn, resort sở hữu không gian tiện nghi, an toàn phù hợp cho các gia đình nghỉ dưỡng.',
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      company_name: 'Hiệp Hội Du Lịch Đồ Sơn',
      created_at: '19/8/2026',
      is_featured: 1
    },
    {
      id: 'news-3',
      title: 'Nhà hàng hải sản uy tín tại Đồ Sơn: Hướng dẫn đầy đủ dành cho người mới',
      summary: 'Bỏ túi bí quyết chọn nhà hàng hải sản tươi sống chất lượng, niêm yết giá công khai chuẩn hóa tại vùng biển Đồ Sơn.',
      image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      company_name: 'Ẩm Thực Đồ Sơn',
      created_at: '19/8/2026',
      is_featured: 1
    },
    {
      id: 'news-4',
      title: 'Đồ Sơn đón sóng du lịch hè 2026 với chuỗi lễ hội văn hóa - thể thao quy mô lớn',
      summary: 'Các hoạt động giải trí, lễ hội âm nhạc bãi biển và giải đua thuyền truyền thống thu hút đông đảo du khách.',
      image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      company_name: 'Sở Văn Hóa & Du Lịch',
      created_at: '18/8/2026'
    },
    {
      id: 'news-5',
      title: 'Hải Phòng tập trung nâng cấp hạ tầng kết nối giao thông tuyến du lịch Đồ Sơn',
      summary: 'Dự án mở rộng đường ven biển và nâng cấp các tuyến đường huyết mạch kết nối trực tiếp đến khu du lịch Đồ Sơn.',
      image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
      company_name: 'Cổng Thông Tin Đồ Sơn',
      created_at: '17/8/2026'
    },
    {
      id: 'news-6',
      title: 'Khai mạc mùa du lịch biển Đồ Sơn 2026: Đỉnh cao trải nghiệm nghỉ dưỡng 4 mùa',
      summary: 'Hệ sinh thái du lịch đa dạng kết hợp giữa nghỉ dưỡng biển, sân golf đẳng cấp quốc tế và công viên giải trí.',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      company_name: 'KDL Quốc Tế Đồi Rồng',
      created_at: '16/8/2026'
    },
    {
      id: 'news-7',
      title: 'Điểm tên các món ăn đặc sản Đồ Sơn không thể bỏ qua khi ghé thăm Hải Phòng',
      summary: 'Bánh đa cua, chả cá thu, bề bề chao, mắm vạn vân và hàng loạt món ngon biển cả trứ danh.',
      image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
      company_name: 'Ẩm Thực Đồ Sơn',
      created_at: '15/8/2026'
    },
    {
      id: 'news-8',
      title: 'Kinh nghiệm du lịch Đồ Sơn tự túc 2 ngày 1 đêm tiết kiệm và trọn vẹn nhất',
      summary: 'Lịch trình chi tiết từ phương tiện di chuyển, gợi ý điểm lưu trú cho đến danh sách địa điểm check-in cực hot.',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      company_name: 'Đồ Sơn Today',
      created_at: '14/8/2026'
    },
    {
      id: 'news-9',
      title: 'Thúc đẩy xúc tiến thương mại và kết nối doanh nghiệp địa phương tại Đồ Sơn',
      summary: 'Hội nghị kết nối giao thương giữa các doanh nghiệp dịch vụ, nhà hàng, khách sạn và các nhà cung ứng hải sản.',
      image_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      company_name: 'Hội Doanh Nghiệp Đồ Sơn',
      created_at: '13/8/2026'
    }
  ];

  // Select top 3 member businesses prioritizing featured members
  const displayShowroomMembers = useMemo(() => {
    if (featuredMembers && featuredMembers.length > 0) {
      const realSlice = featuredMembers.slice(0, 3);
      if (realSlice.length < 3) {
        return [...realSlice, ...defaultFallbackMembers.slice(realSlice.length)];
      }
      return realSlice;
    }
    return defaultFallbackMembers;
  }, [featuredMembers]);

  // Select top 9 news posts prioritizing featured posts
  const displayNewsPosts = useMemo(() => {
    if (latestPosts && latestPosts.length > 0) {
      const realSlice = latestPosts.slice(0, 9);
      if (realSlice.length < 9) {
        return [...realSlice, ...demoNewsList.slice(realSlice.length, 9)];
      }
      return realSlice;
    }
    return demoNewsList;
  }, [latestPosts]);

  const openEventDetail = (event) => {
    if (!token) {
      if (confirm('Vui lòng đăng nhập để xem chi tiết địa điểm và thông tin mô tả sự kiện. Đến trang đăng nhập?')) {
        navigate('/login');
      }
      return;
    }
    setSelectedEvent(event);
    setEventModalOpen(true);
  };

  const handleToggleEventInterest = async (eventId) => {
    if (!token) {
      alert('Vui lòng đăng nhập để thực hiện tính năng này.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`/api/events/${eventId}/interest`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(prev => prev.map(e => {
          if (e.id === eventId) {
            const diff = data.is_interested ? 1 : -1;
            return {
              ...e,
              is_interested: data.is_interested,
              interest_count: Math.max(0, (e.interest_count || 0) + diff)
            };
          }
          return e;
        }));

        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent(prev => {
            const diff = data.is_interested ? 1 : -1;
            return {
              ...prev,
              is_interested: data.is_interested,
              interest_count: Math.max(0, (prev.interest_count || 0) + diff)
            };
          });
        }
      } else {
        alert(data.error || 'Có lỗi xảy ra.');
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAiQuestionSubmit = (e) => {
    e.preventDefault();
    if (aiQuestion.trim()) {
      navigate(`/ai-chat?q=${encodeURIComponent(aiQuestion)}`);
    }
  };

  // Gradient text style for main titles - display block so title stays on 2nd row below badge!
  const gradientTitleStyle = {
    fontFamily: 'var(--font-title, sans-serif)',
    background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 60%, #0369a1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'block',
    margin: 0
  };



  const activeEvent = events.length > 0 ? events[0] : null;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      <SEOHead 
        title="Trang chủ — Cổng thông tin Doanh nghiệp Đồ Sơn"
        description="Nền tảng thương mại điện tử, quảng bá thương hiệu, kết nối đối tác kinh doanh và hỗ trợ hội viên doanh nghiệp tại Đồ Sơn, Hải Phòng."
        keywords="Đồ Sơn Today, doanh nghiệp Đồ Sơn, kết nối kinh doanh, Hải Phòng, thương mại Đồ Sơn, cổng thông tin hội viên"
        url="/"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Đồ Sơn Today",
          "url": "https://doson.today",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://doson.today/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <Navbar />

      {/* Floating AI Bot widget */}
      <FloatingAIBot />

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Lướt lên đầu trang"
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            zIndex: 9998,
            transition: 'transform 0.2s ease, opacity 0.2s ease'
          }}
        >
          <i className="ti ti-arrow-up"></i>
        </button>
      )}

      {/* BLOCK 1: Hero Banner */}
      <section 
        id="hero"
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 50%, #f8fafc 100%)',
          padding: '4rem 1.5rem 3rem',
          textAlign: 'center',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffffff', border: '1px solid #bae6fd', color: '#0284c7', fontSize: '11px', fontWeight: '700', padding: '5px 14px', borderRadius: '99px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)' }}>
            <i className="ti ti-sparkles"></i>
            <span>{t('hero_badge_v2')}</span>
          </div>

          {/* Title with Vibrant Theme Gradient */}
          <h1 style={{ ...gradientTitleStyle, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', lineHeight: '1.25', marginBottom: '1.2rem' }}>
            {t('hero_title_v2')}
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#475569', maxWidth: '820px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
            {t('hero_sub_v2')}
          </p>

          {/* Intelligent Search Box */}
          <form 
            onSubmit={handleSearchSubmit}
            style={{
              backgroundColor: '#ffffff',
              padding: '6px 6px 6px 16px',
              borderRadius: '99px',
              boxShadow: '0 10px 30px rgba(12, 35, 64, 0.1), 0 0 0 1px rgba(2, 132, 199, 0.15)',
              display: 'flex',
              alignItems: 'center',
              maxWidth: '750px',
              margin: '0 auto 1.5rem'
            }}
          >
            <i className="ti ti-search" style={{ fontSize: '20px', color: '#0284c7', marginRight: '10px' }}></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('hero_search_place')}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                color: '#1e293b',
                background: 'transparent'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '99px',
                padding: '10px 24px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              <i className="ti ti-search"></i>
              <span>{t('hero_search_btn')}</span>
            </button>
          </form>

          {/* Quick Search Chips */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px', color: '#64748b', marginBottom: '2.5rem' }}>
            <span style={{ fontWeight: '600' }}>{t('hero_quick_suggest')}</span>
            <button onClick={() => setSearchQuery('Đi đâu cuối tuần')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_1')}</button>
            <button onClick={() => setSearchQuery('Ăn hải sản')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_2')}</button>
            <button onClick={() => setSearchQuery('Khách sạn ven biển')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_3')}</button>
            <button onClick={() => setSearchQuery('Doanh nghiệp Đồ Sơn')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_4')}</button>
            <button onClick={() => setSearchQuery('Cơ hội đầu tư')} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '3px 10px', color: '#334155', cursor: 'pointer', fontSize: '12px' }}>{t('quick_tag_5')}</button>
          </div>

          {/* 3 Main Hero Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a 
              href="#explore" 
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              {t('btn_explore_doson')}
            </a>
            <Link 
              to="/ai-chat" 
              style={{
                backgroundColor: '#0369a1',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="ti ti-robot"></i>
              {t('btn_ask_ai')}
            </Link>
            <Link 
              to="/register" 
              style={{
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                fontWeight: '700',
                fontSize: '14px',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '1px solid #bae6fd'
              }}
            >
              {t('btn_become_member')}
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* BLOCK 2: Quick Access Shortcuts (2-Row Title Layout) */}
        <section id="quick-access" style={{ padding: '4rem 0 3rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('qa_badge')}
            </span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800' }}>
              {t('qa_title')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { icon: 'ti-compass', title: t('qa_1_title'), desc: t('qa_1_desc'), link: '#explore', color: '#0284c7', bg: '#e0f2fe' },
              { icon: 'ti-route', title: t('qa_2_title'), desc: t('qa_2_desc'), link: '#itinerary', color: '#10b981', bg: '#d1fae5' },
              { icon: 'ti-bed', title: t('qa_3_title'), desc: t('qa_3_desc'), link: '#tourism', color: '#f59e0b', bg: '#fef3c7' },
              { icon: 'ti-soup', title: t('qa_4_title'), desc: t('qa_4_desc'), link: '#tourism', color: '#ef4444', bg: '#fee2e2' },
              { icon: 'ti-building-store', title: t('qa_5_title'), desc: t('qa_5_desc'), link: '/members', color: '#8b5cf6', bg: '#ede9fe' },
              { icon: 'ti-award', title: t('qa_6_title'), desc: t('qa_6_desc'), link: '#showroom', color: '#ec4899', bg: '#fce7f3' },
              { icon: 'ti-chart-line', title: t('qa_7_title'), desc: t('qa_7_desc'), link: '#investment', color: '#0ea5e9', bg: '#e0f2fe' },
              { icon: 'ti-users', title: t('qa_8_title'), desc: t('qa_8_desc'), link: '#community', color: '#14b8a6', bg: '#ccfbf1' }
            ].map((item, idx) => (
              <a 
                key={idx}
                className="card-hover-effect"
                href={item.link.startsWith('/') ? undefined : item.link}
                onClick={item.link.startsWith('/') ? () => navigate(item.link) : undefined}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  <i className={`ti ${item.icon}`}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0c2340', margin: '0 0 4px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* BLOCK 3: AI Assistant Box */}
        <section id="ai-box" style={{ marginBottom: '4rem' }}>
          <div 
            style={{
              backgroundColor: '#0c2340',
              backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(2, 132, 199, 0.3) 0%, transparent 60%)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              color: '#ffffff',
              boxShadow: '0 12px 32px rgba(12, 35, 64, 0.2)'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(2, 132, 199, 0.3)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px', marginBottom: '1rem' }}>
              <i className="ti ti-robot"></i>
              <span>{t('ai_box_badge')}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: '700', marginBottom: '1.5rem', color: '#ffffff' }}>
              {t('ai_box_title')}
            </h2>

            <form onSubmit={handleAiQuestionSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '800px', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder={t('ai_box_placeholder')}
                style={{
                  flex: 1,
                  minWidth: '260px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="ti ti-send"></i>
                <span>{t('ai_box_btn')}</span>
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12.5px', color: '#93b4d4' }}>
              <span style={{ fontWeight: '600' }}>{t('ai_prompt_prefix')}</span>
              {[
                t('ai_p1'),
                t('ai_p2'),
                t('ai_p3'),
                t('ai_p4')
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/ai-chat?q=${encodeURIComponent(p)}`)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#e2f0ff',
                    borderRadius: '16px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  📍 {p}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* BLOCK 4: Realtime Weather & Today Real Events Fast Update */}
        <section id="today-highlights" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Realtime Weather Card (Open-Meteo API) */}
            <div className="card-hover-effect" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' }}>THỜI TIẾT & BIỂN ĐỒ SƠN</span>
                <span style={{ fontSize: '11px', backgroundColor: '#d1fae5', color: '#059669', fontWeight: '700', padding: '2px 8px', borderRadius: '99px' }}>
                  {weatherData.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1rem' }}>
                <i className={`ti ${weatherData.icon}`} style={{ fontSize: '42px', color: '#f59e0b' }}></i>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#0c2340', lineHeight: '1' }}>
                    {weatherData.temp}°C
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    {weatherData.desc}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><i className="ti ti-radar"></i> Trạm Đồ Sơn (Realtime)</span>
                <span>🕒 {weatherData.time}</span>
              </div>
            </div>

            {/* Today Fast Update Card - Real Event Data */}
            <div className="card-hover-effect" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', marginBottom: '8px' }}>
                {t('today_badge')}
              </div>
              {activeEvent ? (
                <>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px', lineHeight: '1.4' }}>
                    {activeEvent.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '1rem', flex: 1 }}>
                    📍 {activeEvent.location || 'Quận Đồ Sơn, Hải Phòng'} – {activeEvent.description ? (activeEvent.description.length > 110 ? activeEvent.description.substring(0, 110) + '...' : activeEvent.description) : 'Chuỗi hoạt động văn hóa, du lịch & giao thương sôi động.'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}>
                      <i className="ti ti-calendar"></i> {activeEvent.event_date ? new Date(activeEvent.event_date).toLocaleDateString('vi-VN') : 'Sắp diễn ra'}
                    </span>
                    <button 
                      onClick={() => openEventDetail(activeEvent)} 
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                    >
                      Xem chi tiết sự kiện &gt;
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px', lineHeight: '1.4' }}>
                    {t('today_title')}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '1rem', flex: 1 }}>
                    {t('today_desc')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '12px' }}>
                    <span style={{ color: '#94a3b8' }}><i className="ti ti-clock"></i> {t('today_time')}</span>
                    <Link to="/events" style={{ color: '#0284c7', fontWeight: '700', textDecoration: 'none' }}>{t('today_link')}</Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* BLOCK 5: Local Identity (Khám phá Đồ Sơn - 2-Row Title) */}
        <section id="explore" style={{ marginBottom: '4rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('identity_badge')}
            </span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800' }}>
              {t('identity_title')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { title: t('id_1_t'), desc: t('id_1_d'), icon: 'ti-palmtree' },
              { title: t('id_2_t'), desc: t('id_2_d'), icon: 'ti-building-monument' },
              { title: t('id_3_t'), desc: t('id_3_d'), icon: 'ti-masks-theater' },
              { title: t('id_4_t'), desc: t('id_4_d'), icon: 'ti-user-heart' },
              { title: t('id_5_t'), desc: t('id_5_d'), icon: 'ti-book' },
              { title: t('id_6_t'), desc: t('id_6_d'), icon: 'ti-history' }
            ].map((item, idx) => (
              <div key={idx} className="card-hover-effect" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>
                  <i className={`ti ${item.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 6: Tourism & Dining Experiences (2-Row Title) */}
        <section id="tourism" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t('tourism_badge')}
              </span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800' }}>
                {t('tourism_title')}
              </h2>
            </div>
            <Link to="/search" style={{ color: '#0284c7', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>{t('btn_all_services')} &gt;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              {
                badge: t('tour_item1_badge'),
                verified: t('badge_verified'),
                title: t('tour_item1_t'),
                price: t('tour_item1_price'),
                img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
              },
              {
                badge: t('tour_item2_badge'),
                verified: t('badge_verified'),
                title: t('tour_item2_t'),
                price: t('tour_item2_price'),
                img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
              },
              {
                badge: t('tour_item3_badge'),
                verified: t('badge_verified'),
                title: t('tour_item3_t'),
                price: t('tour_item3_price'),
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
              }
            ].map((item, idx) => (
              <div key={idx} className="card-hover-effect" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(12,35,64,0.85)', color: '#ffffff', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px' }}>{item.badge}</span>
                  <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#d1fae5', color: '#059669', fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }}>{item.verified}</span>
                </div>
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px' }}>{item.title}</h3>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#ef4444', marginBottom: '1rem' }}>{item.price}</div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigate(`/ai-chat?q=${encodeURIComponent(item.title)}`)} style={{ flex: 1, backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: '#334155' }}>
                      <i className="ti ti-robot"></i> {t('btn_ask_ai_short')}
                    </button>
                    <a href="#map" style={{ flex: 1, backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '700', color: '#0284c7', textDecoration: 'none', textAlign: 'center' }}>
                      <i className="ti ti-map-pin"></i> {t('btn_directions')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 7: Suggested Itineraries (2-Row Title) */}
        <section id="itinerary" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t('itin_badge')}
              </span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800' }}>
                {t('itin_title')}
              </h2>
            </div>
            <Link to="/ai-chat" style={{ backgroundColor: '#0284c7', color: '#ffffff', fontWeight: '700', fontSize: '13px', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none' }}>
              {t('btn_custom_ai')}
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {[
              { tag: t('itin1_tag'), title: t('itin1_t'), steps: t('itin1_s') },
              { tag: t('itin2_tag'), title: t('itin2_t'), steps: t('itin2_s') },
              { tag: t('itin3_tag'), title: t('itin3_t'), steps: t('itin3_s') }
            ].map((tour, idx) => (
              <div key={idx} className="card-hover-effect" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '3px 10px', borderRadius: '6px', width: 'fit-content', marginBottom: '10px' }}>{tour.tag}</span>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0c2340', marginBottom: '10px' }}>{tour.title}</h3>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', flex: 1, marginBottom: '1.2rem' }}>📍 {tour.steps}</p>
                <button 
                  onClick={() => alert('Đã lưu hành trình vào tài khoản cá nhân!')}
                  style={{ width: '100%', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}
                >
                  <i className="ti ti-bookmark"></i> {t('btn_save_itin')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 8: Digital Showroom (Doanh nghiệp thành viên thật tiêu biểu, max 3) */}
        <section id="showroom" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t('showroom_badge')}
              </span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800' }}>
                {t('showroom_title')}
              </h2>
            </div>
            <Link to="/members" style={{ color: '#0284c7', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>{t('btn_all_biz')} &gt;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {displayShowroomMembers.map((item, idx) => {
              const isFeatured = item.is_featured === 1;
              const badgeText = item.badge || item.industry || (item.tier ? `Hội viên ${item.tier}` : 'Doanh nghiệp thành viên');
              const statusText = isFeatured ? 'Thành viên Nổi bật ⭐' : (item.status || 'Xác thực ✔');

              return (
                <div key={item.id || idx} className="card-hover-effect" style={{ backgroundColor: '#ffffff', border: isFeatured ? '2px solid #0284c7' : '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: isFeatured ? '0 8px 24px rgba(2, 132, 199, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {isFeatured && (
                    <div style={{ position: 'absolute', top: '-11px', right: '16px', backgroundColor: '#0284c7', color: '#ffffff', fontSize: '10.5px', fontWeight: '800', padding: '2px 10px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(2,132,199,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Nổi bật ★
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', marginTop: isFeatured ? '4px' : '0' }}>
                    <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700' }}>{badgeText}</span>
                    <span style={{ fontSize: '11px', color: isFeatured ? '#d97706' : '#059669', fontWeight: '700' }}>{statusText}</span>
                  </div>

                  <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: '#0c2340', marginBottom: '8px', lineHeight: '1.35' }}>
                    {item.name || item.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '1.2rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description || item.desc}
                  </p>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', gap: '8px' }}>
                    <Link to="/members" style={{ flex: 1, backgroundColor: '#0284c7', color: '#ffffff', textAlign: 'center', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                      {t('btn_view_profile')}
                    </Link>
                    <a href={item.phone ? `tel:${item.phone}` : '/guide'} style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#334155', textAlign: 'center', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>
                      {t('btn_contact_now')}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BLOCK 9: Investment & Collaboration (Dark Container, 2-Row Title) */}
        <section id="investment" style={{ marginBottom: '4rem' }}>
          <div 
            style={{
              backgroundColor: '#0c2340',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              color: '#ffffff',
              boxShadow: '0 12px 32px rgba(12, 35, 64, 0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {t('invest_badge')}
                </span>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '28px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {t('invest_title')}
                </h2>
              </div>
              <Link to="/register" style={{ backgroundColor: '#0284c7', color: '#ffffff', fontWeight: '700', fontSize: '13px', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none' }}>
                {t('btn_post_proposal')}
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {[
                { owner: t('inv1_owner'), title: t('inv1_t'), target: t('inv1_target'), date: t('inv1_date') },
                { owner: t('inv2_owner'), title: t('inv2_t'), target: t('inv2_target'), date: t('inv2_date') },
                { owner: t('inv3_owner'), title: t('inv3_t'), target: t('inv3_target'), date: t('inv3_date') }
              ].map((item, idx) => (
                <div key={idx} className="card-hover-effect" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600', marginBottom: '6px' }}>🔹 {item.owner}</span>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '10px', lineHeight: '1.4' }}>{item.title}</h3>
                  <div style={{ fontSize: '12.5px', color: '#93b4d4', marginBottom: '6px' }}>{item.target}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '1.2rem' }}>🕒 {item.date}</div>
                  <Link to="/register" style={{ marginTop: 'auto', backgroundColor: '#0284c7', color: '#ffffff', textAlign: 'center', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                    {t('btn_connect_now')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOCK 10: Events & Festivals (2-Row Title) */}
        <section id="events" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t('events_badge')}
              </span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800' }}>
                {t('events_title')}
              </h2>
            </div>
            <Link to="/events" style={{ color: '#0284c7', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>{t('btn_all_events')} &gt;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {loadingEvents ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                <i className="ti ti-loader animate-spin" style={{ fontSize: '24px', display: 'block', margin: '0 auto 10px' }}></i> {t('loading_events_list')}
              </div>
            ) : events.length > 0 ? (
              events.map((e) => {
                const dateStr = e.event_date ? new Date(e.event_date).toLocaleDateString('vi-VN') : '15/07/2026';
                return (
                  <div key={e.id} className="card-hover-effect" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', backgroundColor: '#e0f2fe', color: '#0284c7', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>SẮP DIỄN RA</span>
                      <button 
                        onClick={() => handleToggleEventInterest(e.id)}
                        style={{ background: 'none', border: 'none', color: e.is_interested ? '#f59e0b' : '#94a3b8', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <i className={e.is_interested ? "ti ti-star-filled" : "ti ti-star"}></i>
                        <span style={{ fontSize: '12px' }}>{e.interest_count || 0}</span>
                      </button>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px' }}>{e.title}</h3>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '4px' }}>📅 {dateStr}</div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '1rem' }}>🏛️ {e.organizer || 'Đồ Sơn'}</div>
                    <button onClick={() => openEventDetail(e)} style={{ marginTop: 'auto', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>
                      {t('btn_view_details')}
                    </button>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                {t('no_upcoming_events')}
              </div>
            )}
          </div>
        </section>

        {/* BLOCK 11: Community Network (2-Row Title) */}
        <section id="community" style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('community_badge')}
            </span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800' }}>
              {t('community_title')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { title: t('com1_t'), desc: t('com1_d') },
              { title: t('com2_t'), desc: t('com2_d') },
              { title: t('com3_t'), desc: t('com3_d') }
            ].map((com, idx) => (
              <div key={idx} className="card-hover-effect" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0c2340', marginBottom: '10px' }}>{com.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', flex: 1, marginBottom: '1.2rem' }}>{com.desc}</p>
                <Link to="/register" style={{ backgroundColor: '#0284c7', color: '#ffffff', textAlign: 'center', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
                  {t('btn_join_community')}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 12: News & Articles - 2-Row Title, Image Cards, Max 3 */}
        <section id="news" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t('news_badge')}
              </span>
              <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800' }}>
                {t('news_title')}
              </h2>
            </div>
            <Link to="/posts" style={{ color: '#0284c7', fontWeight: '700', fontSize: '14px', textDecoration: 'none', backgroundColor: 'rgba(2, 132, 199, 0.08)', padding: '6px 14px', borderRadius: '99px' }}>
              {t('btn_all_news')} &rarr;
            </Link>
          </div>

          <div className="grid-3-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {displayNewsPosts.map((post) => {
              const imageUrl = post.image_url || post.image || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80";
              const dateStr = post.created_at ? (new Date(post.created_at).toLocaleDateString('vi-VN') !== 'Invalid Date' ? new Date(post.created_at).toLocaleDateString('vi-VN') : post.created_at) : '10/7/2026';
              const publisherName = post.author_name || post.company_name || "Đồi Rồng Đồ Sơn";
              
              return (
                <div 
                  key={post.id}
                  className="card-hover-effect"
                  onClick={() => navigate(`/posts/${post.slug || post.id}`)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(12, 35, 64, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer'
                  }}
                >
                  {/* Thumbnail Image Header */}
                  <div style={{ height: '180px', position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <img 
                      src={imageUrl} 
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {post.is_featured === 1 && (
                      <span 
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#f59e0b',
                          color: '#000000',
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          letterSpacing: '0.04em'
                        }}
                      >
                        NỔI BẬT ⭐
                      </span>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 
                      style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#0c2340',
                        lineHeight: '1.5',
                        marginBottom: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '4.5em'
                      }}
                    >
                      {post.title}
                    </h3>

                    {/* Publisher Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                      <div 
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: '#e0f2fe',
                          color: '#0284c7',
                          fontSize: '10px',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #bae6fd'
                        }}
                      >
                        ĐÔ
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                        {publisherName}
                      </span>
                    </div>

                    {/* Footer Row: Date + Đọc bài Button */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                        {dateStr}
                      </span>
                      <button
                        onClick={(evt) => {
                          evt.stopPropagation();
                          navigate(`/posts/${post.slug || post.id}`);
                        }}
                        style={{
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                        }}
                      >
                        Đọc bài
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BLOCK 13: Interactive Leaflet Digital Map */}
        <section id="map" style={{ marginBottom: '4rem' }}>
          <InteractiveMap />
        </section>

        {/* BLOCK 13.5: Featured Category Section - Chợ Hải Sản Đồ Sơn (Chỉ Khung Xanh Header) */}
        <section id="seafood-market" style={{ marginBottom: '4rem' }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, #0c2340 0%, #0369a1 100%)',
              borderRadius: '20px',
              padding: '2rem 2.25rem',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(3, 105, 161, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <span>🦀 🦞 🦪</span> {t('seafood_badge')}
              </div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', fontWeight: '800', margin: '4px 0 6px', color: '#ffffff' }}>
                {t('seafood_title')}
              </h2>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#bae6fd', opacity: 0.9 }}>
                {t('seafood_desc')}
              </p>
            </div>

            <Link 
              to={`/posts?category=${encodeURIComponent('Chợ hải sản')}`}
              style={{
                backgroundColor: '#38bdf8',
                color: '#0c2340',
                fontWeight: '800',
                fontSize: '13.5px',
                padding: '10px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              className="hover-scale"
            >
              {t('btn_all_seafood')} &rarr;
            </Link>
          </div>
        </section>

        {/* BLOCK 14: Ecosystem Roles (2-Row Title) */}
        <section id="roles" style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('join_badge')}
            </span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '28px', fontWeight: '800' }}>
              {t('join_title')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { title: t('role1_t'), desc: t('role1_d'), btn: t('role1_btn') },
              { title: t('role2_t'), desc: t('role2_d'), btn: t('role2_btn') },
              { title: t('role3_t'), desc: t('role3_d'), btn: t('role3_btn') },
              { title: t('role4_t'), desc: t('role4_d'), btn: t('role4_btn') }
            ].map((roleItem, idx) => (
              <div key={idx} className="card-hover-effect" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', marginBottom: '8px' }}>{roleItem.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', flex: 1, marginBottom: '1.2rem' }}>{roleItem.desc}</p>
                <Link to="/register" style={{ backgroundColor: '#0284c7', color: '#ffffff', textAlign: 'center', borderRadius: '8px', padding: '8px', fontSize: '12.5px', fontWeight: '700', textDecoration: 'none' }}>
                  {roleItem.btn}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* BLOCK 15: Newsletter Subscription (2-Row Title) */}
        <section id="newsletter" style={{ marginBottom: '4rem' }}>
          <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '20px', padding: '2.5rem 2rem', textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0284c7', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('nl_badge')}
            </span>
            <h2 style={{ ...gradientTitleStyle, fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
              {t('nl_title')}
            </h2>
            <p style={{ fontSize: '14px', color: '#475569', maxWidth: '600px', margin: '0 auto 1.5rem' }}>{t('nl_sub')}</p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký nhận bản tin Doson.today!'); }} style={{ display: 'flex', gap: '10px', maxWidth: '550px', margin: '0 auto 1rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                placeholder={t('nl_placeholder')}
                style={{ flex: 1, minWidth: '240px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
              <button type="submit" style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                {t('nl_btn')}
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '12.5px', color: '#475569' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('nl_cb1')}</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('nl_cb2')}</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('nl_cb3')}</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> {t('nl_cb4')}</label>
            </div>
          </div>
        </section>

        {/* BLOCK 16: Partners Logo Bar */}
        <section id="partners" style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            {t('partners_badge')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap', opacity: 0.75, fontWeight: '800', color: '#0c2340', fontSize: '15px' }}>
            <span>ADT GROUP</span>
            <span>DOSON TOURISM</span>
            <span>OCOP HẢI PHÒNG</span>
            <span>HIỆP HỘI DOANH NGHIỆP ĐỒ SƠN</span>
          </div>
        </section>

      </div>

      <Footer />

      {/* Event Details Modal */}
      {eventModalOpen && selectedEvent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,14,30,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '550px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0c2340', margin: 0 }}>
                📅 {t('event_details_title')}
              </h3>
              <button onClick={() => setEventModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem', maxHeight: '50vh', overflowY: 'auto', textAlign: 'left' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#0284c7', fontWeight: '700' }}>{t('label_event_name')}</span>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0c2340' }}>{selectedEvent.title}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#0284c7', fontWeight: '700' }}>{t('label_organizer')}</span>
                <div style={{ fontSize: '13px', color: '#334155' }}>{selectedEvent.organizer || 'Đồ Sơn'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#0284c7', fontWeight: '700' }}>{t('label_location')}</span>
                <div style={{ fontSize: '13px', color: '#334155' }}>{selectedEvent.location || 'Đồ Sơn, Hải Phòng'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#0284c7', fontWeight: '700' }}>{t('label_event_description')}</span>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>{selectedEvent.description || 'Không có mô tả chi tiết cho sự kiện này.'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => handleToggleEventInterest(selectedEvent.id)}
                style={{ backgroundColor: selectedEvent.is_interested ? '#fef3c7' : '#f1f5f9', color: selectedEvent.is_interested ? '#d97706' : '#334155', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                <i className={selectedEvent.is_interested ? "ti ti-star-filled" : "ti ti-star"}></i> {selectedEvent.is_interested ? "Đã quan tâm" : "Quan tâm sự kiện"}
              </button>
              <button onClick={() => setEventModalOpen(false)} style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                {t('btn_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
