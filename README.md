# 🌟 CODEBASE TODAY — WHITE-LABEL DIGITAL ECOSYSTEM PLATFORM

> **Codebase Template chuẩn mực** giúp bạn nhanh chóng khởi tạo và vận hành nền tảng số đa chức năng (Văn hóa, Du lịch, Di sản, Báo chí, Doanh nghiệp, Thương mại điện tử & Trợ lý Trí tuệ Nhân tạo AI) cho **bất kỳ thương hiệu hoặc địa phương nào** chỉ trong vài phút!

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-purple.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)

---

## 🚀 TẠI SAO CHỌN CODEBASE TODAY?

- ⚡ **White-label 100%**: Toàn bộ định danh thương hiệu (Tên, Slogan, Logo, Màu sắc, Hotline, AI Assistant) được quản lý tập trung qua `brand.config.js`.
- 🤖 **Tự động hóa với AI Agent**: Cung cấp sẵn file prompt mẫu [PROMPT_FOR_AI_AGENT.md](PROMPT_FOR_AI_AGENT.md) để AI (Antigravity / Cursor / Claude) tự động clone và tùy biến sang thương hiệu mới chỉ bằng 1 câu lệnh.
- 🛠️ **CLI Rebrand Tool**: Tích hợp sẵn script `node scripts/rebrand.js` giúp đổi tên và đồng bộ toàn bộ dự án từ dòng lệnh.
- 🧠 **Tích hợp Sâu AI Gemini 2.5 Flash**: Trợ lý AI hỏi đáp thông minh, RAG tìm kiếm ngữ cảnh dữ liệu doanh nghiệp và bài viết, tự động phản hồi chuyên nghiệp.
- 👥 **Cổng Doanh nghiệp & Quản trị CMS**: Đầy đủ tính năng Đăng ký hội viên theo gói, Phê duyệt hồ sơ, Đăng tin bài, Quản lý sự kiện, Gửi email tự động SMTP.
- 📦 **Sẵn sàng Triển khai VPS**: Tích hợp sẵn cấu hình Nginx, PM2 Cluster, Let's Encrypt SSL và GitHub Actions CI/CD.

---

## 📂 TÀI LIỆU HƯỚNG DẪN CHI TIẾT

| Tài liệu | Mô tả |
| :--- | :--- |
| 🤖 [**PROMPT_FOR_AI_AGENT.md**](PROMPT_FOR_AI_AGENT.md) | **Prompt mẫu chuẩn** để giao cho AI Agent tự động đổi thương hiệu 100% |
| 📖 [**REBRANDING_GUIDE.md**](REBRANDING_GUIDE.md) | Sổ tay hướng dẫn chi tiết từng bước đổi thương hiệu cho Developer |
| 🏗️ [**CODEBASE_ARCHITECTURE.md**](CODEBASE_ARCHITECTURE.md) | Tài liệu kiến trúc toàn diện (Data flow, API, DB Schema, Gemini RAG) |
| 🌐 [**huong_dan_deploy_vps.md**](huong_dan_deploy_vps.md) | Hướng dẫn triển khai Production lên VPS (aaPanel / Ubuntu / Nginx / PM2) |
| 🛡️ [**huong_dan_admin.md**](huong_dan_admin.md) | Cẩm nang sử dụng bảng điều khiển Quản trị viên (CMS Admin) |
| 🏢 [**huong_dan_doanh_nghiep.md**](huong_dan_doanh_nghiep.md) | Hướng dẫn dành cho Hội viên doanh nghiệp sử dụng portal |

---

## ⚡ BẮT ĐẦU NHANH (QUICK START TRONG 5 PHÚT)

### 1. Clone Kho mã nguồn
```bash
git clone https://github.com/dev-adt/codebase-today.git my-new-project
cd my-new-project
```

### 2. Đổi Thương hiệu (Chọn 1 trong 2 cách)

#### 👉 Cách A: Dùng AI Agent (Khuyên dùng ⚡)
Mở [PROMPT_FOR_AI_AGENT.md](PROMPT_FOR_AI_AGENT.md), điền thông tin thương hiệu mới của bạn và gửi cho AI trong IDE!

#### 👉 Cách B: Dùng Script CLI
```bash
node scripts/rebrand.js
```

---

### 3. Cài đặt Thư viện & Cấu hình Biến môi trường
```bash
# Cài đặt dependencies cho Backend & Frontend
npm install
cd frontend && npm install && npm run build && cd ..

# Tạo file cấu hình môi trường
cp .env.example .env
```
Mở `.env` và điền thông tin kết nối MySQL, Port và Gemini API Key của bạn.

---

### 4. Khởi tạo Cơ sở dữ liệu (MySQL)
```bash
mysql -u root -p -e "CREATE DATABASE my_today_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p my_today_db < schema.sql
```

---

### 5. Khởi chạy Ứng dụng
```bash
# Chạy Backend Server
node server.js

# Hoặc chạy môi trường phát triển Frontend (Hot reload)
cd frontend && npm run dev
```
Truy cập: `http://localhost:3025` (Backend SPA) hoặc `http://localhost:5173` (Frontend Dev Server).

---

## 🏛️ CẤU TRÚC THƯ THƯƠNG HIỆU TẬP TRUNG

Toàn bộ thông số thương hiệu nằm tại:
- **Frontend**: [`frontend/src/brand.config.js`](frontend/src/brand.config.js)
  ```javascript
  export const brandConfig = {
    brandName: 'DANANG.today',
    brandShortName: 'DANANG',
    slogan: 'Khám phá thành phố đáng sống',
    domain: 'danang.today',
    colors: { primary: '#059669', ... },
    aiAssistant: { name: 'AI DaNang Assistant', ... },
    contact: { hotline: '0236 3888 999', email: 'contact@danang.today', ... }
  };
  ```
- **Backend**: [`config/brand.config.js`](config/brand.config.js)

---

## 🚢 TRIỂN KHAI PRODUCTION (VPS / PM2 / NGINX)

```bash
# Khởi chạy bằng PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Xem chi tiết tại [huong_dan_deploy_vps.md](huong_dan_deploy_vps.md).

---

## 📄 GIẤY PHÉP (LICENSE)
Phát triển và bảo trì bởi **dev-adt**. Được cấp phép theo giấy phép MIT.
