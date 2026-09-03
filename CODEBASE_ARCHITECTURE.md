# 🏗️ TÀI LIỆU KIẾN TRÚC TOÀN HỆ THỐNG (CODEBASE ARCHITECTURE)

Tài liệu này cung cấp bức tranh tổng thể về mặt kiến trúc phần mềm, luồng dữ liệu, các công nghệ sử dụng và nguyên lý hoạt động của nền tảng **Today Platform Codebase**.

---

## 🏛️ 1. TỔNG QUAN CÔNG NGHỆ (TECH STACK)

| Thành phần | Công nghệ / Thư viện | Vai trò |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6 | Single Page Application (SPA) tốc độ cao |
| **Styling** | Vanilla CSS, Design Tokens, Modern Glassmorphism | Thiết kế giao diện hiện đại, chuẩn UI/UX, không phụ thuộc Tailwind |
| **Icons & Typography** | Tabler Icons, Google Fonts (Outfit, Plus Jakarta Sans, Inter) | Hệ thống icon sắc nét và kiểu chữ cao cấp |
| **Backend** | Node.js, Express.js (RESTful API) | Xử lý logic nghiệp vụ, API, xác thực và phục vụ SPA |
| **Database** | MySQL 8.0 / MariaDB (Pool Connection via `mysql2/promise`) | Lưu trữ cơ sở dữ liệu quan hệ tối ưu tốc độ và an toàn |
| **AI Engine** | Google Gemini API (Gemini 2.5 Flash) | Xử lý hỏi đáp thông minh, RAG tìm kiếm ngữ cảnh dữ liệu hội viên |
| **Authentication** | JWT (JSON Web Tokens) & Session Cookies, Bcrypt | Xác thực phân quyền 3 cấp (Admin, Enterprise Member, Guest) |
| **Email Service** | Nodemailer (SMTP SSL/TLS 465) | Tự động gửi email xác thực, cấp lại mật khẩu và thông báo phê duyệt |
| **Process Manager** | PM2 (`ecosystem.config.js`) | Quản lý tiến trình production, tự động restart khi có sự cố |
| **Web Server** | Nginx Reverse Proxy & Let's Encrypt SSL | Chặn DDoS, cân bằng tải, SSL HTTPS, gzip compression |

---

## 📂 2. CẤU TRÚC THƯ MỤC DỰ ÁN

```plaintext
codebase-today/
├── config/
│   └── brand.config.js        # Cấu hình thương hiệu Backend & AI prompt
├── frontend/
│   ├── public/                # Assets tĩnh (Logo, favicon, icons, avatar)
│   ├── src/
│   │   ├── brand.config.js    # CẤU HÌNH THƯƠNG HIỆU TẬP TRUNG FRONTEND
│   │   ├── components/        # Components tái sử dụng (Navbar, Footer, AIModal,...)
│   │   ├── constants/         # Dữ liệu danh mục, tỉnh thành, gói hội viên
│   │   ├── contexts/          # React Contexts (AuthContext, LanguageContext)
│   │   ├── pages/             # Các trang (Home, Members, Posts, Events, AIChat, Admin,...)
│   │   ├── App.jsx            # Định tuyến (Routing) và layout chính
│   │   ├── index.css          # CSS Tokens & giao diện toàn cục
│   │   └── main.jsx           # Điểm khởi động React
│   ├── index.html             # Template HTML chính
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Cấu hình Vite build & proxy
├── knowledge_base/            # Tài liệu văn bản mở rộng dùng cho RAG của AI
├── scripts/
│   └── rebrand.js             # CLI Tool tự động đổi thương hiệu 1-click
├── .env.example               # Mẫu biến môi trường
├── db.js                      # Kết nối MySQL Connection Pool
├── ecosystem.config.js        # Cấu hình PM2 Cluster
├── nginx.conf                 # Cấu hình Nginx chuẩn VPS Production
├── package.json               # Backend dependencies & npm scripts
├── schema.sql                 # Cấu trúc bảng MySQL và dữ liệu mẫu
├── server.js                  # Toàn bộ API Backend & Server logic
├── PROMPT_FOR_AI_AGENT.md     # Prompt mẫu cho AI Agent tự động clone
├── REBRANDING_GUIDE.md        # Sổ tay hướng dẫn đổi thương hiệu
└── README.md                  # Hướng dẫn tổng quan & cài đặt nhanh
```

---

## 🔄 3. LUỒNG DỮ LIỆU & PHÂN QUYỀN (RBAC)

### 3 Cấp độ Người dùng:
1. **Khách vãng lai (Public / Guest)**:
   - Xem trang chủ, danh sách chuyên mục, bài viết, sự kiện, danh bạ doanh nghiệp.
   - Trò chuyện với Trợ lý Trí tuệ Nhân tạo (AI Assistant).
   - Đăng ký tài khoản hội viên doanh nghiệp (`/register`).
2. **Hội viên Doanh nghiệp (Enterprise Member)**:
   - Đăng nhập (`/login`), quản lý Dashboard riêng (`/member/dashboard`).
   - Cập nhật hồ sơ năng lực doanh nghiệp, sản phẩm, dịch vụ, thông tin liên hệ.
   - Đăng bài viết tin tức, cơ hội giao thương, chào mua / chào bán.
3. **Quản trị viên Hệ thống (System Admin)**:
   - Truy cập trang Quản trị (`/admin`).
   - Duyệt / từ chối hồ sơ đăng ký doanh nghiệp hội viên mới.
   - Duyệt / biên tập / xóa bài viết và sự kiện trên toàn hệ thống.
   - Cấu hình Prompt AI, theo dõi logs và thống kê số liệu.

---

## 🤖 4. CƠ CHẾ HOẠT ĐỘNG CỦA TRỢ LÝ TRÍ TUỆ NHÂN TẠO (AI AGENT)

1. **Prompt Injection & Persona**:
   - Persona được nạp từ `config/brand.config.js` hoặc bảng `ai_config` trong Database.
2. **Context Enrichment (RAG Lite)**:
   - Khi người dùng đặt câu hỏi, hệ thống tự động tổng hợp:
     - Danh sách các doanh nghiệp thành viên đã xác thực trong Database.
     - 10 bài viết và sự kiện mới nhất.
     - Các tài liệu bổ sung trong thư mục `knowledge_base/`.
3. **AI Generation**:
   - Gửi payload kèm Context enriched sang mô hình **Google Gemini 2.5 Flash**.
   - Trả lời bằng định dạng Markdown sinh động, cung cấp thông tin chuẩn xác và gợi ý các hành động tiếp theo.

---

## 🚀 5. QUY TRÌNH TRIỂN KHAI PRODUCTION (VPS DEPLOYMENT)

1. **Cài đặt môi trường VPS**: Node.js 18+, MySQL 8.0, Nginx, PM2, Certbot SSL.
2. **Cấu hình Nginx**: Sử dụng file [nginx.conf](file:///nginx.conf) tích hợp reverse proxy về `http://127.0.0.1:5000`.
3. **Chạy PM2**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```
4. **Cài đặt chứng chỉ bảo mật SSL HTTPS**:
   ```bash
   certbot --nginx -d your-domain.com
   ```
