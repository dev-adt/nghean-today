# Hướng Dẫn Triển Khai (Deploy) Lên VPS Lần Đầu

Tài liệu này hướng dẫn chi tiết cách triển khai hệ thống **VTV8.today** lên Linux VPS của bạn chạy tại cổng **3023** dưới tên miền **dev.vtv8.today**.

---

## 1. Chuẩn bị trên VPS (Yêu cầu hệ thống)
Kết nối SSH vào VPS của bạn dưới quyền `root` hoặc tài khoản có quyền `sudo`, sau đó cài đặt các gói cần thiết:

### Cập nhật hệ thống:
```bash
sudo apt update && sudo apt upgrade -y
```

### Cài đặt Node.js (Version >= 18):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
# Kiểm tra phiên bản
node -v
npm -v
```

### Cài đặt MySQL Server:
```bash
sudo apt install mysql-server -y
# Bật và khởi động MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Cài đặt Nginx & Certbot (SSL):
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Cài đặt PM2 (Quản lý tiến trình Node.js chạy ngầm):
```bash
sudo npm install -y pm2 -g
```

---

## 2. Cài đặt Cơ sở dữ liệu (MySQL)
Truy cập vào MySQL CLI trên VPS:
```bash
sudo mysql
```

Chạy các câu lệnh sau để tạo Cơ sở dữ liệu và tài khoản truy cập:
```sql
CREATE DATABASE IF NOT EXISTS doson_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'doson_user'@'localhost' IDENTIFIED BY 'MatKhauBaoMatCuaBan123!';
GRANT ALL PRIVILEGES ON doson_db.* TO 'doson_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

*Lưu ý: Nhớ thay đổi mật khẩu `'MatKhauBaoMatCuaBan123!'` bằng mật khẩu an toàn của riêng bạn.*

---

## 3. Sao chép Mã nguồn lên VPS & Cấu hình môi trường

1. Đưa mã nguồn lên thư mục `/var/www/doson-today` trên VPS (sử dụng Git Clone hoặc công cụ SFTP/MobaXterm).
   ```bash
   sudo mkdir -p /var/www/doson-today
   sudo chown -R $USER:$USER /var/www/doson-today
   # Clone hoặc tải code vào đây
   ```

2. Tạo file môi trường `.env`:
   ```bash
   cd /var/www/doson-today
   cp .env.example .env
   nano .env
   ```

3. Điền thông tin cấu hình vào `.env`:
   ```env
   PORT=3013
   SITE_URL=https://doson.today
   ALLOWED_ORIGIN=https://doson.today

   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=doson_db
   DB_USER=doson_user
   DB_PASSWORD=MatKhauBaoMatCuaBan123! # Mật khẩu bạn đã tạo ở Bước 2

   # Cấu hình API Key AI (Điền key nếu sử dụng AI Chatbot)
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=
   ```
   *Nhấn `Ctrl + O` -> `Enter` để lưu, `Ctrl + X` để thoát Nano.*

4. Import cấu trúc DB vào database:
   ```bash
   mysql -u doson_user -p doson_db < schema.sql
   # Nhập mật khẩu database của bạn
   ```

---

## 4. Cài đặt Thư viện & Build Frontend

1. Cài đặt thư viện cho Backend:
   ```bash
   cd /var/www/doson-today
   npm install --production
   ```

2. Cài đặt thư viện & Build Frontend sang thư mục tĩnh `public`:
   ```bash
   cd /var/www/doson-today/frontend
   npm install
   npm run build
   ```
   *Lệnh `npm run build` sẽ tự động biên dịch toàn bộ mã nguồn Frontend React/Vite và xuất bản sang thư mục `/var/www/doson-today/public` để Backend phục vụ trực tiếp.*

---

## 5. Khởi chạy Hệ thống bằng PM2 (Chạy ngầm)
Chúng ta sẽ sử dụng file cấu hình `ecosystem.config.js` đã được thiết lập sẵn chạy trên cổng **3013**:

```bash
cd /var/www/doson-today
pm2 start ecosystem.config.js
```

Để đảm bảo hệ thống tự động khởi chạy lại khi VPS bị khởi động lại (Reboot):
```bash
pm2 startup
# Hãy copy câu lệnh sudo mà PM2 in ra màn hình và chạy nó.
pm2 save
```

### Các lệnh quản trị PM2 hữu ích:
- Xem log hoạt động: `pm2 logs doson-today`
- Xem trạng thái: `pm2 status`
- Khởi động lại: `pm2 restart doson-today`

---

## 6. Cấu hình Nginx Proxy & Cấp chứng chỉ SSL miễn phí

1. Tạo file cấu hình Nginx cho tên miền `doson.today`:
   ```bash
   sudo nano /etc/nginx/sites-available/doson
   ```

2. Copy nội dung cấu hình từ file `nginx.conf` đã được thiết lập trong mã nguồn (hoặc dán đoạn dưới đây vào):
   ```nginx
   server {
       listen 80;
       server_name doson.today www.doson.today;

       # Nginx Gzip nén dữ liệu
       gzip on;
       gzip_types text/plain text/css application/json application/javascript;
       gzip_min_length 1000;

       # Proxy ngược về Port 3013 của Backend Node.js
       location /api/ {
           proxy_pass         http://localhost:3013;
           proxy_http_version 1.1;
           proxy_set_header   Upgrade $http_upgrade;
           proxy_set_header   Connection 'upgrade';
           proxy_set_header   Host $host;
           proxy_set_header   X-Real-IP $remote_addr;
           proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_cache_bypass $http_upgrade;
           proxy_read_timeout 120s;
       }

       # Phục vụ thư mục tĩnh public của Frontend SPA
       location / {
           root  /var/www/doson-today/public;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       # Cache file tĩnh
       location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {
           root    /var/www/doson-today/public;
           expires 30d;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. Kích hoạt cấu hình Nginx & khởi động lại:
   ```bash
   sudo ln -s /etc/nginx/sites-available/doson /etc/nginx/sites-enabled/
   # Kiểm tra cú pháp xem có bị lỗi không
   sudo nginx -t
   # Nếu báo Successful, tải lại Nginx
   sudo systemctl reload nginx
   ```

4. Cấp chứng chỉ SSL HTTPS tự động miễn phí bằng Let's Encrypt:
   *Đảm bảo bạn đã trỏ địa chỉ IP của VPS về tên miền `doson.today` và `www.doson.today` trên trang quản lý DNS tên miền.*
   ```bash
   sudo certbot --nginx -d doson.today -d www.doson.today
   ```
   *Làm theo hướng dẫn trên màn hình (chọn tự động redirect từ HTTP sang HTTPS). Khi hoàn tất, trang web của bạn sẽ tự động bảo mật HTTPS và truy cập mượt mà tại địa chỉ [https://doson.today](https://doson.today).*

Chúc bạn triển khai dự án thành công!
