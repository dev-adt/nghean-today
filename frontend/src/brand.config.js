/**
 * BRAND CONFIGURATION (CẤU HÌNH THƯƠNG HIỆU TẬP TRUNG)
 * -------------------------------------------------------------
 * File này quản lý toàn bộ thông tin nhận diện thương hiệu của nền tảng Nghean.today.
 * Áp dụng theo chuẩn tài liệu Giới thiệu & Bản mô tả giao diện Nghean.today 2026.
 */

export const brandConfig = {
  // Thông tin định danh thương hiệu
  brandName: 'Nghean.today', // Tên thương hiệu hiển thị chính
  brandShortName: 'Nghệ An',  // Tên viết tắt ngắn gọn
  platformName: 'Nghean.today Platform',
  companyLegalName: 'Nền tảng Thương hiệu số & Xúc tiến Đầu tư Nghean.today',
  
  // Slogan & Định vị
  slogan: 'Kết nối Nghệ An với Việt Nam và Thế giới',
  tagline: 'Nền tảng thương hiệu số đa ngôn ngữ • Hệ sinh thái thành viên • Lõi Multi‑AI Agent',
  description: 'Nghean.today là nền tảng thương hiệu số đa ngôn ngữ quảng bá du lịch - văn hóa xứ Nghệ, kết nối cộng đồng doanh nghiệp và xúc tiến thu hút đầu tư FDI vào Nghệ An trên nền tảng AI thông minh.',
  
  // 3 Trụ cột chiến lược
  pillars: [
    {
      id: 'tourism-culture',
      title: 'Du lịch – Văn hóa',
      subtitle: 'Lan tỏa bản sắc xứ Nghệ',
      description: 'Quảng bá Quê hương Bác Hồ, Dân ca Ví Giặm, Biển Cửa Lò, Miền Tây Nghệ An, ẩm thực và di sản.'
    },
    {
      id: 'business-matching',
      title: 'Kết nối Doanh nghiệp',
      subtitle: 'Mở rộng thị trường & Chuỗi cung ứng',
      description: 'Showroom số đa ngôn ngữ, kết nối cung cầu, tìm kiếm đối tác và mở rộng giao thương toàn cầu.'
    },
    {
      id: 'fdi-investment',
      title: 'Xúc tiến Đầu tư FDI',
      subtitle: 'Kết nối cơ hội & Nguồn lực quốc tế',
      description: 'Cửa ngõ thông tin khu kinh tế Đông Nam, các KCN, chính sách ưu đãi và cơ hội hợp tác quốc tế.'
    }
  ],

  // Tên miền & Đường dẫn
  domain: 'nghean.today',
  baseUrl: 'https://nghean.today',
  apiBaseUrl: '/api',

  // Nhận diện hình ảnh & Logo
  logo: {
    primary: '/nghean-logo.svg', // Biểu trưng Nghean.today
    alt: 'Nghean.today Logo',
    favicon: '/nghean-logo.svg',
    defaultThumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    fallbackCompanyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
  },

  // Hệ màu chủ đạo (CSS Theme Variables)
  // Xanh lam công nghệ, Xanh lá thiên nhiên/miền Tây, Đỏ trầm hoa sen xứ Nghệ, Vàng ánh kim đầu tư
  colors: {
    primary: '#0284c7',       // Xanh lam công nghệ
    primaryHover: '#0369a1',  // Xanh lam đậm khi hover
    primaryDark: '#081325',   // Xanh đen công nghệ
    primaryLight: '#e0f2fe',  // Xanh nhạt nền
    secondary: '#059669',     // Xanh lá thiên nhiên / miền Tây Nghệ An
    accent: '#b91c1c',        // Đỏ trầm hoa sen / quê hương Bác
    gold: '#f59e0b',          // Vàng ánh kim thành tựu & xúc tiến đầu tư
    darkBg: '#081325',        // Nền tối
    darkCard: '#0f1f38'       // Card tối
  },

  // Trợ lý Trí tuệ Nhân tạo (AI Assistant - Multi-AI Agent Core)
  aiAssistant: {
    name: 'AI NgheAn Assistant',
    shortName: 'NgheAn AI',
    title: 'Trợ lý AI Đa năng Du lịch, Văn hóa, Doanh nghiệp & Xúc tiến Đầu tư Nghệ An',
    avatar: '/ai_robot_avatar-removebg.png',
    welcomeMessage: 'Xin chào! Tôi là Trợ lý AI của Nghean.today. Tôi có thể hỗ trợ bạn khám phá du lịch - di sản xứ Nghệ, tra cứu danh bạ doanh nghiệp, tìm kiếm đối tác và xúc tiến cơ hội đầu tư FDI tại Nghệ An 24/7.',
    systemRole: 'Bạn là trợ lý AI chuyên nghiệp của nền tảng Nghean.today — Nền tảng thương hiệu số đa ngôn ngữ phục vụ 3 trụ cột: Quảng bá du lịch & văn hóa xứ Nghệ; Kết nối doanh nghiệp Nghệ An với Việt Nam và quốc tế; Xúc tiến và thu hút đầu tư FDI vào Nghệ An. Hãy trả lời chuẩn xác, truyền cảm hứng, thân thiện và hỗ trợ đa ngôn ngữ.',
    quickSuggestions: [
      'Gợi ý lịch trình du lịch Xứ Nghệ (Quê Bác - Cửa Lò - Miền Tây)',
      'Tìm kiếm doanh nghiệp và kết nối đối tác giao thương tại Nghệ An',
      'Thông tin môi trường đầu tư, KCN Đông Nam và chính sách FDI Nghệ An',
      'Khám phá Dân ca Ví, Giặm Nghệ Tĩnh và di sản văn hóa xứ Nghệ'
    ]
  },

  // Thông tin liên hệ & Văn phòng
  contact: {
    hotline: '0238 3844 555',
    phone: '0912 345 678',
    email: 'contact@nghean.today',
    supportEmail: 'support@nghean.today',
    address: 'Thành phố Vinh, Tỉnh Nghệ An, Việt Nam',
    workingHours: '08:00 - 17:30 (Thứ 2 - Thứ 6)',
    copyright: '© 2026 Nghean.today. Nền tảng thương hiệu số và xúc tiến đầu tư tỉnh Nghệ An. Bản quyền đã được bảo hộ.'
  },

  // Mạng xã hội
  socials: {
    facebook: 'https://facebook.com/ngheantoday.official',
    youtube: 'https://youtube.com/@ngheantoday',
    zalo: 'https://zalo.me/ngheantoday',
    tiktok: 'https://tiktok.com/@ngheantoday'
  },

  // Thông tin Đăng ký Hội viên & Gói dịch vụ
  membership: {
    benefitsTitle: 'Quyền lợi Hội viên Nghean.today',
    badgeText: 'Mạng lưới kết nối & Xúc tiến Đầu tư Xứ Nghệ',
    tiers: [
      { id: 'Standard', name: 'Standard Member', badge: 'Thành viên Tiêu chuẩn' },
      { id: 'Silver', name: 'Silver Partner', badge: 'Đối tác Bạc' },
      { id: 'Gold', name: 'Gold Partner', badge: 'Đối tác Vàng' },
      { id: 'Diamond', name: 'Diamond VIP', badge: 'Đối tác Kim Cương' }
    ]
  }
};

export default brandConfig;
