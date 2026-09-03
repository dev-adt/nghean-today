/**
 * BACKEND BRAND CONFIGURATION
 * -------------------------------------------------------------
 * File cấu hình thương hiệu tập trung cho Node.js Express Backend.
 * Tự động đồng bộ với biến môi trường (.env) nếu có.
 */

require('dotenv').config();

const brandConfig = {
  appName: process.env.APP_NAME || 'VTV8.today Platform',
  brandName: process.env.BRAND_NAME || 'VTV8.today',
  brandShortName: process.env.BRAND_SHORT_NAME || 'VTV8',
  siteUrl: process.env.SITE_URL || 'https://vtv8.vn',
  
  // AI System Persona Prompt
  ai: {
    agentName: process.env.AI_AGENT_NAME || 'AI VTV8 Assistant',
    systemPrompt: process.env.AI_SYSTEM_PROMPT || 
      "Bạn là trợ lý AI chuyên nghiệp của nền tảng VTV8.today — Hệ sinh thái số Văn hóa, Di sản, Lịch sử và Du lịch Việt Nam. Tôn vinh cội nguồn, kết nối thời đại. Hãy trả lời chuyên sâu, chuẩn xác, truyền cảm hứng và thân thiện bằng tiếng Việt hoặc tiếng Anh theo yêu cầu."
  },

  // Email Brand Info
  email: {
    fromName: process.env.SMTP_FROM_NAME || 'Ban Quản Trị VTV8.today',
    fromAddress: process.env.SMTP_FROM || `"VTV8.today" <${process.env.SMTP_USER || 'no-reply@vtv8.vn'}>`,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@vtv8.vn'
  },

  // Chuyên mục mặc định khi tạo mới cơ sở dữ liệu
  defaultCategories: [
    { name: 'Văn hóa & Di sản', slug: 'van-hoa-di-san', icon: '🏛️', description: 'Bảo tồn, tôn vinh và lan tỏa giá trị di sản văn hóa' },
    { name: 'Du lịch & Trải nghiệm', slug: 'du-lich-trai-nghiem', icon: '✈️', description: 'Khám phá danh lam thắng cảnh, điểm đến độc đáo' },
    { name: 'Ẩm thực & Đặc sản', slug: 'am-thuc-dac-san', icon: '🍲', description: 'Tinh hoa ẩm thực truyền thống và đặc sản vùng miền' },
    { name: 'Giao thương & Đầu tư', slug: 'giao-thuong-dau-tu', icon: '💼', description: 'Kết nối doanh nghiệp, xúc tiến thương mại và đầu tư' },
    { name: 'Công nghệ & Chuyển đổi số', slug: 'cong-nghe-so', icon: '🚀', description: 'Ứng dụng AI, số hóa di sản và công nghệ thông minh' },
    { name: 'Sự kiện & Lễ hội', slug: 'su-kien-le-hoi', icon: '🎉', description: 'Lịch trình festival, hội chợ triển lãm và hội thảo' }
  ]
};

module.exports = brandConfig;
