# VTV8.today — Hệ sinh thái số Du lịch, Văn hóa & Di sản Việt Nam

Nền tảng số **VTV8.today** quảng bá du lịch, văn hóa, di sản và lịch sử Việt Nam; kết nối điểm đến, doanh nghiệp, cộng đồng hội viên và du khách trong nước, quốc tế cùng Trợ lý AI đa ngôn ngữ 24/7.

---

## 📋 Thông số Cấu hình Mặc định (Production / Staging)

- **Domain**: `dev.vtv8.today`
- **Backend Node.js Port**: `3023`
- **Database Engine**: MySQL 5.7+ / MariaDB 10.x
- **Database Name**: `vtv8`
- **Database Username**: `vtv8`
- **Quản lý tiến trình**: PM2 (`vtv8-today`)
- **Web Server / Reverse Proxy**: Nginx (aaPanel)
- **CI/CD Workflow**: GitHub Actions tự động build sang branch `deploy`

---

## 📁 Cấu trúc Thư mục

```text
vtv8-today/
├── .github/workflows/deploy.yml # Workflow tự động build frontend & push sang branch deploy
├── server.js                    # Express Backend API, xác thực, proxy AI & phục vụ SPA
├── schema.sql                   # Cấu trúc CSDL MySQL đầy đủ cho hệ thống VTV8
├── .env.example                 # Bản mẫu biến môi trường (port 3023, db vtv8)
├── ecosystem.config.js          # Cấu hình khởi chạy PM2 (app name: vtv8-today, port: 3023)
├── nginx.conf                   # Cấu hình Nginx reverse proxy mẫu chống dính cache cho aaPanel
├── package.json                 # Dependencies cho Node.js Backend
│
├── frontend/                    # Mã nguồn React Frontend (Vite + React 18/Router 7)
│   ├── src/                     # Toàn bộ Components, Pages, Contexts của VTV8.today
│   ├── index.html               # Trang HTML gốc tích hợp meta anti-cache
│   ├── vite.config.js           # Cấu hình Vite xuất bundle sang ../public
│   └── package.json             # Dependencies cho Frontend
│
└── public/                      # Thư mục chứa bundle tĩnh đã biên dịch (index.html, JS/CSS hash)
```

---

## 🚀 HƯỚNG DẪN DEPLOY TRÊN AAPANEL VPS (TỪNG BƯỚC CHI TIẾT)

### Bước 1: Tạo Database MySQL trên aaPanel
1. Đăng nhập vào bảng điều khiển **aaPanel** của bạn.
2. Chọn menu **Databases** > Nhấn **Add Database**:
   - **DBName**: `vtv8`
   - **Username**: `vtv8`
   - **Password**: *(Đặt mật khẩu mạnh của bạn và lưu lại để điền vào .env)*
   - **Character Set**: `utf8mb4`
3. Sau khi tạo xong, nhấn **Import** bên cạnh database `vtv8` > Upload và Import tệp `schema.sql` (nằm trong thư mục nguồn của dự án) để tạo đầy đủ các bảng dữ liệu.

---

### Bước 2: Clone Mã nguồn về VPS (Sử dụng nhánh `deploy`)
Mở **Terminal** trên aaPanel (hoặc SSH vào VPS) và chạy các lệnh sau:

```bash
# 1. Di chuyển vào thư mục web của aaPanel
cd /www/wwwroot

# 2. Clone mã nguồn từ branch 'deploy' (nhánh đã được GitHub Actions tự động build sẵn thư mục public)
git clone -b deploy https://github.com/dev-adt/vtv8-today.git dev.vtv8.today

# 3. Đi vào thư mục dự án
cd /www/wwwroot/dev.vtv8.today

# 4. Cài đặt các thư viện backend
npm install --production
```

---

### Bước 3: Tạo và Cấu hình file `.env`
Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
nano .env
```

Điền các thông tin của bạn vào `.env`:

```env
PORT=3023
SITE_URL=https://dev.vtv8.today
ALLOWED_ORIGIN=https://dev.vtv8.today

# Cấu hình MySQL đã tạo ở Bước 1
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vtv8
DB_USER=vtv8
DB_PASSWORD=MẬT_KHẨU_DATABASE_CỦA_BẠN

# Cấu hình API Key AI (Tùy chọn: OpenAI, Gemini, DeepSeek, OpenRouter...)
GEMINI_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
```

*(Nhấn `Ctrl + O` rồi `Enter` để lưu, sau đó `Ctrl + X` để thoát nano).*

---

### Bước 4: Khởi chạy Backend với PM2
Khởi chạy ứng dụng và thiết lập tự khởi động khi VPS reboot:

```bash
# Khởi chạy ứng dụng qua file cấu hình ecosystem
pm2 start ecosystem.config.js

# Lưu trạng thái PM2
pm2 save
pm2 startup
```

Kiểm tra trạng thái hoạt động:
```bash
pm2 status
pm2 logs vtv8-today
```

*(Bạn sẽ thấy dòng log: `VTV8.today server đang chạy tại http://localhost:3023`)*

---

### Bước 5: Tạo Website & Cấu hình Nginx Reverse Proxy trên aaPanel
1. Vào aaPanel > **Website** > Nhấn **Add site**:
   - **Domain**: `dev.vtv8.today`
   - **Root directory**: `/www/wwwroot/dev.vtv8.today/public`
   - **Database**: *No* (vì đã tạo ở Bước 1)
   - **PHP version**: *Pure / Static* (hoặc bất kỳ vì ta dùng Node.js)
2. Cấu hình **SSL (HTTPS)**:
   - Trong danh sách Website, click vào tên miền `dev.vtv8.today` > chọn tab **SSL** > chọn **Let's Encrypt** > tích chọn domain và bấm **Apply** để cấp chứng chỉ SSL miễn phí tự động gia hạn.
   - Bật công tắc **Force HTTPS**.
3. Cấu hình **Nginx Config (Chống dính cache & Proxy port 3023)**:
   - Cũng trong bảng cài đặt website đó, chuyển sang tab **Config File**.
   - Dán cấu hình Nginx sau vào giữa block `server { ... }` (hoặc thay thế nội dung file config):

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name dev.vtv8.today;

    # Root trỏ vào thư mục public chứa file tĩnh
    root /www/wwwroot/dev.vtv8.today/public;
    index index.html;

    # SSL Cert do aaPanel tự tạo
    # ssl_certificate ...
    # ssl_certificate_key ...

    # Gzip nén trang
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # ── Proxy toàn bộ API về Node.js (Port 3023) ──
    location /api/ {
        proxy_pass         http://127.0.0.1:3023;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 120s;
    }

    # ── Upload media ──
    location /uploads/ {
        proxy_pass         http://127.0.0.1:3023;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
    }

    # ── Assets có hash: Cache dài hạn 1 năm ──
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # ── SPA Routing & CHỐNG DÍNH CACHE index.html ──
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
}
```
4. Bấm **Save** để lưu cấu hình Nginx.

---

## 🔄 QUY TRÌNH CẬP NHẬT CODE SAU NÀY (CI/CD SIÊU NHANH)

Nhờ có quy trình CI/CD tự động bằng GitHub Actions:
1. Mỗi khi bạn chỉnh sửa mã nguồn ở máy cá nhân và chạy `git push origin main`, **GitHub Actions sẽ tự động biên dịch frontend và xuất bản sang branch `deploy`**.
2. Khi muốn cập nhật phiên bản mới nhất lên VPS, bạn chỉ cần mở Terminal trên VPS và chạy 2 lệnh:

```bash
cd /www/wwwroot/dev.vtv8.today
git pull origin deploy
pm2 restart vtv8-today
```

⚡ **Website sẽ lập tức cập nhật phiên bản mới nhất mà không bao giờ bị lỗi dính cache trình duyệt!**
