/**
 * BACKEND BRAND CONFIGURATION
 * -------------------------------------------------------------
 * File cấu hình thương hiệu tập trung cho Node.js Express Backend.
 * Tự động đồng bộ với biến môi trường (.env) nếu có.
 */

require('dotenv').config();

const brandConfig = {
  appName: process.env.APP_NAME || 'Nghean.today Platform',
  brandName: process.env.BRAND_NAME || 'Nghean.today',
  brandShortName: process.env.BRAND_SHORT_NAME || 'Nghệ An',
  siteUrl: process.env.SITE_URL || 'https://nghean.today',
  
  // AI System Persona Prompt
  ai: {
    agentName: process.env.AI_AGENT_NAME || 'AI NgheAn Assistant',
    systemPrompt: process.env.AI_SYSTEM_PROMPT || 
      "Bạn là trợ lý AI chuyên nghiệp của nền tảng Nghean.today — Nền tảng thương hiệu số đa ngôn ngữ phục vụ 3 trụ cột: (1) Quảng bá du lịch & văn hóa xứ Nghệ; (2) Kết nối doanh nghiệp Nghệ An với Việt Nam và quốc tế; (3) Xúc tiến và thu hút đầu tư FDI vào Nghệ An. Slogan: 'Kết nối Nghệ An với Việt Nam và Thế giới'. Hãy trả lời chuyên sâu, chuẩn xác, truyền cảm hứng và thân thiện bằng tiếng Việt hoặc tiếng Anh theo yêu cầu."
  },

  // Email Brand Info
  email: {
    fromName: process.env.SMTP_FROM_NAME || 'Ban Quản Trị Nghean.today',
    fromAddress: process.env.SMTP_FROM || `"Nghean.today" <${process.env.SMTP_USER || 'no-reply@nghean.today'}>`,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@nghean.today'
  },

  // Chuyên mục mặc định khi tạo mới cơ sở dữ liệu
  defaultCategories: [
    { name: 'Du lịch & Trải nghiệm', slug: 'du-lich-trai-nghiem', icon: '✈️', description: 'Khám phá Quê Bác, Cửa Lò, Miền Tây và danh lam thắng cảnh xứ Nghệ' },
    { name: 'Văn hóa & Di sản', slug: 'van-hoa-di-san', icon: '🏛️', description: 'Dân ca Ví Giặm, di tích lịch sử, lễ hội và bản sắc văn hóa Nghệ An' },
    { name: 'Doanh nghiệp & OCOP', slug: 'doanh-nghiep-ocop', icon: '🍲', description: 'Danh bạ doanh nghiệp, showroom số và đặc sản OCOP Nghệ An' },
    { name: 'Xúc tiến Đầu tư & FDI', slug: 'xuc-tien-dau-tu', icon: '💼', description: 'Môi trường đầu tư, KCN Đông Nam, logistics và cơ hội FDI' },
    { name: 'Đổi mới sáng tạo & AI', slug: 'doi-moi-sang-tao', icon: '🚀', description: 'Ứng dụng AI, chuyển đổi số và công nghệ thông minh' },
    { name: 'Sự kiện & Lễ hội', slug: 'su-kien-le-hoi', icon: '🎉', description: 'Lịch trình festival, hội chợ xúc tiến thương mại và đầu tư' }
  ]
};

module.exports = brandConfig;
