# 📖 SỔ TAY HƯỚNG DẪN TÁI CẤU TRÚC & ĐỔI THƯƠNG HIỆU (REBRANDING GUIDE)

Tài liệu này hướng dẫn chi tiết từng bước để nhân bản (clone) và biến codebase này thành một trang web hoàn toàn mới cho bất kỳ tổ chức, doanh nghiệp, kênh truyền thông hay địa phương nào.

---

## 🎯 3 CÁCH TIẾN HÀNH ĐỔI THƯƠNG HIỆU

### Cách 1: Sử dụng AI Agent (Khuyên dùng - Nhanh nhất ⚡)
1. Mở file [PROMPT_FOR_AI_AGENT.md](file:///PROMPT_FOR_AI_AGENT.md).
2. Sao chép nội dung prompt, điền thông tin thương hiệu mới vào các mục `[...]`.
3. Gửi cho AI Agent (Antigravity / Cursor / Claude). AI sẽ tự động thay đổi tất cả các file cấu hình và code liên quan trong vòng 1 phút.

---

### Cách 2: Sử dụng Script CLI Tự động (`scripts/rebrand.js`)
Chạy trực tiếp từ dòng lệnh:

```bash
# Chạy tương tác (Interactive Mode - Trả lời các câu hỏi trên terminal)
node scripts/rebrand.js

# Hoặc chạy với đầy đủ tham số dòng lệnh một lần duy nhất:
node scripts/rebrand.js \
  --name="HUE.today" \
  --short="HUE" \
  --domain="hue.today" \
  --slogan="Tinh hoa di sản cố đô" \
  --company="Trung tâm Bảo tồn Di tích Cố đô Huế" \
  --color="#7c2d12" \
  --ai="AI Cố Đô Assistant" \
  --hotline="0234 3822 555" \
  --email="contact@hue.today"
```

---

### Cách 3: Chỉnh sửa thủ công (Manual Checklist)

Nếu bạn muốn kiểm soát từng chi tiết thủ công, hãy làm theo danh sách kiểm tra (checklist) dưới đây:

#### 1. Cấu hình Frontend Brand (`frontend/src/brand.config.js`)
Mở file [frontend/src/brand.config.js](file:///frontend/src/brand.config.js) và cập nhật các trường:
- `brandName`: Tên thương hiệu hiển thị (VD: `DANANG.today`)
- `brandShortName`: Tên ngắn gọn (VD: `DANANG`)
- `companyLegalName`: Đơn vị chủ quản
- `slogan` & `tagline`: Thông điệp chính
- `domain` & `baseUrl`: Tên miền chính thức
- `logo.primary`: Đường dẫn ảnh logo (đặt trong thư mục `public/`)
- `colors.primary`: Màu sắc chủ đạo HEX
- `aiAssistant`: Tên, avatar và lời chào của trợ lý AI
- `contact`: Hotline, Email, Địa chỉ, Bản quyền
- `socials`: Link Facebook, YouTube, TikTok, Zalo

#### 2. Cấu hình Backend (`config/brand.config.js` & `.env`)
- Mở file [config/brand.config.js](file:///config/brand.config.js): Cập nhật `appName`, `brandName`, `brandShortName`, `siteUrl` và `ai.systemPrompt`.
- Tạo file `.env` từ `.env.example` và điền:
  ```env
  PORT=5000
  SITE_URL=https://your-domain.com
  BRAND_NAME=YOUR_BRAND_NAME
  AI_AGENT_NAME=YOUR_AI_AGENT
  GEMINI_API_KEY=your_gemini_api_key
  DB_NAME=your_database_name
  ```

#### 3. Thay đổi Tài nguyên Đồ họa (Assets & Logos)
Đặt các file hình ảnh mới vào thư mục `public/`:
- `public/logo.png`: Logo thanh điều hướng (Navbar) & Chân trang (Footer).
- `public/favicon.ico` / `public/favicon.png`: Biểu tượng tab trình duyệt.
- `public/ai_robot_avatar-removebg.png`: Avatar đại diện cho Trợ lý Trí tuệ Nhân tạo.

#### 4. Khởi tạo Cơ sở dữ liệu (Database Schema)
1. Tạo database MySQL mới:
   ```sql
   CREATE DATABASE my_new_brand_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Nhập schema ban đầu từ [schema.sql](file:///schema.sql):
   ```bash
   mysql -u root -p my_new_brand_db < schema.sql
   ```
3. Tạo tài khoản Admin mặc định ban đầu:
   - Truy cập trang `/register` hoặc sử dụng tài khoản seed sẵn có trong database để duyệt tài khoản quản trị.

#### 5. Build và Kiểm tra
```bash
# Cài đặt dependencies (nếu clone mới)
npm install
cd frontend && npm install && npm run build && cd ..

# Chạy thử nghiệm
node server.js
```
Truy cập `http://localhost:5000` trên trình duyệt để kiểm tra toàn bộ giao diện và chức năng.
