/**
 * BRAND CONFIGURATION (CẤU HÌNH THƯƠNG HIỆU TẬP TRUNG)
 * -------------------------------------------------------------
 * File này quản lý toàn bộ thông tin nhận diện thương hiệu của nền tảng.
 * Khi cần clone hoặc đổi sang thương hiệu mới, bạn chỉ cần chỉnh sửa các trường bên dưới
 * hoặc sử dụng AI Agent với file hướng dẫn `PROMPT_FOR_AI_AGENT.md`.
 */

export const brandConfig = {
  // Thông tin định danh thương hiệu
  brandName: 'VTV8.today', // Tên thương hiệu hiển thị chính
  brandShortName: 'VTV8',  // Tên viết tắt ngắn gọn
  platformName: 'VTV8.vn Platform',
  companyLegalName: 'Trung tâm Truyền hình Việt Nam khu vực Miền Trung - Tây Nguyên (VTV8)',
  
  // Slogan & Định vị
  slogan: 'Tôn vinh cội nguồn, kết nối thời đại',
  tagline: 'Cổng kết nối tích hợp Trí tuệ Nhân tạo đa lĩnh vực',
  description: 'Hệ sinh thái số văn hóa, di sản, lịch sử và du lịch Việt Nam; kết nối điểm đến, doanh nghiệp, cộng đồng hội viên và du khách trên nền tảng công nghệ số tiên tiến.',
  
  // Tên miền & Đường dẫn
  domain: 'vtv8.vn',
  baseUrl: 'https://vtv8.vn',
  apiBaseUrl: '/api',

  // Nhận diện hình ảnh & Logo
  logo: {
    primary: '/Logo_vtv8.png', // Đường dẫn logo chính
    alt: 'VTV8.today Logo',
    favicon: '/favicon.ico',
    defaultThumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    fallbackCompanyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
  },

  // Hệ màu chủ đạo (CSS Theme Variables)
  colors: {
    primary: '#1E88E5',
    primaryHover: '#1565C0',
    primaryDark: '#0D47A1',
    primaryLight: '#E3F2FD',
    secondary: '#00ACC1',
    accent: '#FFB300',
    gold: '#D4AF37',
    darkBg: '#0b0f19',
    darkCard: '#131b2e'
  },

  // Trợ lý Trí tuệ Nhân tạo (AI Assistant)
  aiAssistant: {
    name: 'AI VTV8 Assistant',
    shortName: 'VTV8 AI',
    title: 'Trợ lý AI Phân tích Doanh nghiệp & Di sản Văn hóa',
    avatar: '/ai_robot_avatar-removebg.png',
    welcomeMessage: 'Xin chào! Tôi là Trợ lý AI của VTV8.today. Tôi có thể hỗ trợ bạn tra cứu văn hóa, du lịch, phân tích thị trường, kết nối giao thương và hỗ trợ doanh nghiệp hội viên 24/7.',
    systemRole: 'Bạn là trợ lý AI chuyên nghiệp của nền tảng VTV8.today — Hệ sinh thái số Văn hóa, Di sản, Lịch sử và Du lịch Việt Nam.',
    quickSuggestions: [
      'Gợi ý lịch trình du lịch di sản Miền Trung',
      'Cách thức đăng ký kết nối doanh nghiệp hội viên',
      'Tìm hiểu các sự kiện giao thương sắp diễn ra',
      'Đăng tin bài quảng bá trên chuyên mục VTV8'
    ]
  },

  // Thông tin liên hệ & Văn phòng
  contact: {
    hotline: '0236 3822 555',
    phone: '0905 123 456',
    email: 'contact@vtv8.vn',
    supportEmail: 'support@vtv8.vn',
    address: '258 Bạch Đằng, Quận Hải Châu, TP. Đà Nẵng, Việt Nam',
    workingHours: '08:00 - 17:30 (Thứ 2 - Thứ 6)',
    copyright: '© 2026 VTV8.today. Bản quyền thuộc Trung tâm Truyền hình Việt Nam khu vực Miền Trung - Tây Nguyên.'
  },

  // Mạng xã hội
  socials: {
    facebook: 'https://facebook.com/vtv8today',
    youtube: 'https://youtube.com/@vtv8today',
    zalo: 'https://zalo.me/vtv8today',
    tiktok: 'https://tiktok.com/@vtv8today'
  },

  // Thông tin Đăng ký Hội viên & Gói dịch vụ
  membership: {
    benefitsTitle: 'Quyền lợi Hội viên VTV8.today',
    badgeText: 'Mạng lưới kết nối uy tín',
    tiers: [
      { id: 'Standard', name: 'Standard Member', badge: 'Thành viên Tiêu chuẩn' },
      { id: 'Silver', name: 'Silver Partner', badge: 'Đối tác Bạc' },
      { id: 'Gold', name: 'Gold Partner', badge: 'Đối tác Vàng' },
      { id: 'Diamond', name: 'Diamond VIP', badge: 'Đối tác Kim Cương' }
    ]
  }
};

export default brandConfig;
