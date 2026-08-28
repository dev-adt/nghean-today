# Hướng Dẫn Deploy Hệ Thống VTV8.today Trên Domain Chính: vtv8.today

Tài liệu này hướng dẫn từng bước chi tiết cách triển khai nền tảng **VTV8.today** lên **aaPanel Linux VPS** cho tên miền chính thức: **`vtv8.today`** (kèm `www.vtv8.today`).

---

## 📋 THÔNG SỐ HỆ THỐNG MẪU

- **Domain chính**: `vtv8.today` và `www.vtv8.today`
- **Thư mục dự án**: `/www/wwwroot/vtv8.today`
- **Node.js Backend Port**: `3023`
- **Database Engine**: MySQL 5.7+ / MariaDB 10.x
- **Database Name**: `vtv8`
- **Database User**: `vtv8`
- **Tiến trình chạy ngầm**: PM2 (`vtv8-today`)

---

## 🚀 CÁC BƯỚC TRIỂN KHAI CHI TIẾT

### BƯỚC 1: Trỏ DNS Tên Miền về IP VPS
Truy cập trang quản lý DNS (Cloudflare, Namecheap, PA Việt Nam, MatBao...):
1. **Record A**: `@` ➔ `IP_VPS_CỦA_BẠN`
2. **Record A / CNAME**: `www` ➔ `vtv8.today` (hoặc `IP_VPS_CỦA_BẠN`)

---

### BƯỚC 2: Tạo Database MySQL trên aaPanel
*(Nếu bạn đã tạo database `vtv8` trước đó ở bản dev thì có thể bỏ qua bước tạo mới và dùng chung database này)*

1. Đăng nhập vào **aaPanel** ➔ Chọn menu **Databases** ➔ Nhấn **Add Database**:
   - **DBName**: `vtv8`
   - **Username**: `vtv8`
   - **Password**: *(Tự đặt mật khẩu an toàn và lưu lại)*
   - **Character Set**: `utf8mb4`
2. Bấm **Submit**.

---

### BƯỚC 3: Tạo Website trên aaPanel
1. Vào mục **Website** ➔ Bấm **Add site**:
   - **Domain name**: 
     ```text
     vtv8.today
     www.vtv8.today
     ```
   - **Root directory**: `/www/wwwroot/vtv8.today`
   - **PHP Version**: Static hoặc PHP bất kỳ (vì chúng ta sẽ dùng Reverse Proxy sang Node.js)
2. Bấm **Submit**.

---

### BƯỚC 4: Kéo Mã Nguồn từ GitHub về VPS
Mở **Terminal** trên aaPanel (hoặc kết nối SSH qua PuTTY/MobaXterm) và chạy các lệnh:

```bash
# 1. Đi đến thư mục wwwroot
cd /www/wwwroot

# 2. Xóa các file mặc định vừa tạo
rm -rf /www/wwwroot/vtv8.today

# 3. Clone nhánh deploy trực tiếp về thư mục vtv8.today
git clone -b deploy https://github.com/dev-adt/vtv8-today.git vtv8.today

# 4. Truy cập vào thư mục
cd /www/wwwroot/vtv8.today

# 5. Cài đặt các thư viện cần thiết
npm install --production
```

---

### BƯỚC 5: Cấu hình Biến Môi Trường `.env` & Import Database

1. Tạo file `.env`:
   ```bash
   cp .env.example .env
   nano .env
   ```
2. Cấu hình nội dung file `.env` cho domain chính:
   ```env
   NODE_ENV=production
   PORT=3023
   SITE_URL=https://vtv8.today
   ALLOWED_ORIGIN=https://vtv8.today,https://www.vtv8.today

   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_NAME=vtv8
   DB_USER=vtv8
   DB_PASSWORD=DienMatKhauDatabaseCuaBanO_Day

   # Cấu hình API Key AI (Tùy chọn)
   GEMINI_API_KEY=
   OPENAI_API_KEY=
   ```
   *(Nhấn `Ctrl + O` ➔ `Enter` để lưu, `Ctrl + X` để thoát Nano)*

3. Import cấu trúc bảng (nếu dùng database mới):
   ```bash
   mysql -u vtv8 -p vtv8 < schema.sql
   ```
   *(Nhập mật khẩu database khi được hỏi)*

---

### BƯỚC 6: Khởi chạy Ứng dụng với PM2

Khởi chạy server chạy ngầm liên tục và tự khởi động lại khi VPS reboot:

```bash
cd /www/wwwroot/vtv8.today
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Kiểm tra trạng thái tiến trình:
```bash
pm2 status
```
*(Nếu thấy `vtv8-today` ở trạng thái `online` màu xanh lá là thành công)*

---

### BƯỚC 7: Cài đặt SSL (HTTPS) & Reverse Proxy trên aaPanel

1. **Cài đặt chứng chỉ SSL miễn phí**:
   - Trong aaPanel, vào **Website** ➔ Bấm vào tên miền **`vtv8.today`**.
   - Chọn mục **SSL** ➔ Chọn tab **Let's Encrypt**.
   - Tích chọn cả `vtv8.today` và `www.vtv8.today`.
   - Bấm **Apply**. Sau khi cấp chứng chỉ xong, gạt bật công tắc **Force HTTPS**.

2. **Cấu hình Reverse Proxy**:
   - Cũng trong cửa sổ cấu hình website đó, chọn mục **Reverse Proxy** ➔ Bấm **Add reverse proxy**:
     - **Proxy Name**: `vtv8-proxy`
     - **Target URL**: `http://127.0.0.1:3023`
     - **Sent Domain**: `$host`
   - Bấm **Save**.

---

### BƯỚC 8: Cấu hình chống dính Cache Nginx (Khuyên dùng)
Để trình duyệt của người dùng luôn tự động tải bản cập nhật mới nhất, vào mục **Config** của website `vtv8.today` trên aaPanel và thêm đoạn sau vào trong block `server { ... }`:

```nginx
# Tắt cache cho file HTML gốc
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    proxy_pass http://127.0.0.1:3023;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Cache lâu cho tài sản tĩnh có mã hash
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, no-transform";
    proxy_pass http://127.0.0.1:3023;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

Bấm **Save**.

---

## 🔄 LỆNH CẬP NHẬT CODE NHANH SAU NÀY

Mỗi khi có tính năng hoặc code mới được đẩy lên GitHub, bạn chỉ cần mở Terminal VPS và chạy:

```bash
cd /www/wwwroot/vtv8.today
git fetch origin deploy && git reset --hard origin/deploy
pm2 restart vtv8-today
```
