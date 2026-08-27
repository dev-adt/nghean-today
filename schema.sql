-- ============================================
-- VTV8.today — MySQL Database Schema
-- Database: vtv8 | User: vtv8
-- Lệnh import: mysql -u vtv8 -p vtv8 < schema.sql
-- ============================================

-- ── Bảng hội viên ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL COMMENT 'Tên doanh nghiệp / Đơn vị',
  tax_code      VARCHAR(20)  COMMENT 'Mã số thuế',
  license       VARCHAR(50)  COMMENT 'Số giấy phép kinh doanh',
  industry      VARCHAR(100) COMMENT 'Ngành nghề / Lĩnh vực',
  size          VARCHAR(50)  COMMENT 'Quy mô nhân sự',
  address       TEXT         COMMENT 'Địa chỉ',
  website       VARCHAR(255) COMMENT 'Website',
  social        VARCHAR(255) COMMENT 'Fanpage / LinkedIn',
  description   TEXT         COMMENT 'Mô tả hoạt động',
  tier          ENUM('Silver','Gold','Platinum') DEFAULT 'Silver' COMMENT 'Gói hội viên',
  status        ENUM('pending','approved','rejected') DEFAULT 'pending',
  contact_name  VARCHAR(100) COMMENT 'Tên người đại diện',
  contact_pos   VARCHAR(100) COMMENT 'Chức vụ',
  email         VARCHAR(255) NOT NULL COMMENT 'Email liên hệ',
  phone         VARCHAR(20)  COMMENT 'Số điện thoại',
  goal          TEXT         COMMENT 'Mục tiêu tham gia',
  referral      VARCHAR(100) COMMENT 'Biết đến qua kênh nào',
  reject_reason TEXT         COMMENT 'Lý do từ chối',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_tier (tier),
  INDEX idx_industry (industry)
) ENGINE=InnoDB COMMENT='Danh sách hội viên';

-- ── Bảng bài viết ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  member_id     INT          COMMENT 'NULL nếu là bài từ ban biên tập',
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255),
  category      VARCHAR(100) DEFAULT 'Tin tức',
  sub_category  VARCHAR(100) DEFAULT NULL,
  summary       TEXT,
  body          LONGTEXT     NOT NULL,
  image_url     VARCHAR(500),
  author_name   VARCHAR(100),
  author_pos    VARCHAR(100),
  contact_info  VARCHAR(255),
  type          VARCHAR(50)  DEFAULT 'Tin tức' COMMENT 'Tìm đối tác, Cần mua, Cần bán, Tin tức...',
  status        ENUM('pending','approved','rejected') DEFAULT 'pending',
  is_featured   TINYINT(1)   DEFAULT 0,
  views         INT          DEFAULT 0,
  likes         INT          DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_featured (is_featured),
  INDEX idx_created (created_at),
  INDEX idx_category (category)
) ENGINE=InnoDB COMMENT='Bài viết và tin đăng';

-- ── Bảng sự kiện ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  event_date    DATETIME     NOT NULL,
  end_date      DATETIME,
  location      VARCHAR(255),
  organizer     VARCHAR(100),
  image_url     VARCHAR(500),
  status        ENUM('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_event_date (event_date),
  INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='Sự kiện và hội thảo';

-- ── Bảng quan tâm sự kiện ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_interests (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  event_id      INT NOT NULL,
  name          VARCHAR(100) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  email         VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  INDEX idx_event (event_id)
) ENGINE=InnoDB COMMENT='Đăng ký quan tâm sự kiện';

-- ── Bảng quản trị viên & tài khoản hệ thống ───────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  role          ENUM('superadmin','admin','editor','creator','member') DEFAULT 'admin',
  last_login    TIMESTAMP NULL DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Tài khoản quản trị và biên tập viên';

-- ── Bảng cấu hình AI ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_config (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  provider      VARCHAR(50)  NOT NULL DEFAULT 'openrouter',
  model         VARCHAR(100) NOT NULL,
  system_prompt TEXT,
  is_active     TINYINT(1)   DEFAULT 1,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Cấu hình AI Proxy';

-- ── Bảng phiên đăng nhập hội viên ─────────────────────────────
CREATE TABLE IF NOT EXISTS member_sessions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  member_id     INT NOT NULL,
  token         VARCHAR(255) NOT NULL UNIQUE,
  expires_at    TIMESTAMP NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_token (token)
) ENGINE=InnoDB COMMENT='Token phiên đăng nhập hội viên';

-- ── Bảng hội thoại Chatbot AI ─────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id            VARCHAR(100) PRIMARY KEY,
  user_id       VARCHAR(100),
  title         VARCHAR(255) DEFAULT 'Cuộc trò chuyện mới',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Phiên chat AI';

CREATE TABLE IF NOT EXISTS chat_messages (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  session_id    VARCHAR(100) NOT NULL,
  role          ENUM('user', 'assistant', 'system') NOT NULL,
  content       LONGTEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  INDEX idx_session (session_id)
) ENGINE=InnoDB COMMENT='Lịch sử tin nhắn chat AI';

-- ── Bảng chuyên mục & lĩnh vực ────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  name_en       VARCHAR(255) DEFAULT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  order_index   INT DEFAULT 0,
  status        ENUM('active', 'inactive') DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Chuyên mục chính';

CREATE TABLE IF NOT EXISTS sub_categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  category_id   INT NOT NULL,
  name          VARCHAR(255) NOT NULL,
  name_en       VARCHAR(255) DEFAULT NULL,
  slug          VARCHAR(255),
  order_index   INT DEFAULT 0,
  status        ENUM('active', 'inactive') DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id)
) ENGINE=InnoDB COMMENT='Lĩnh vực con';

-- ============================================
-- DỮ LIỆU KHỞI TẠO MẪU (VTV8.today)
-- ============================================

-- Admin mặc định (Username: admin | Password: Admin@123)
INSERT INTO admins (username, password_hash, name, email, role) VALUES
('admin', '$2b$10$3luJFH.EMVPnxeH8BdXn9.5tnCQ9huv13yzOzHrwYGiRhgV7dcufq', 'Ban Quản Trị VTV8.today', 'admin@vtv8.today', 'superadmin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Hội viên mẫu
INSERT INTO members (name, tax_code, industry, tier, status, contact_name, contact_pos, email, phone, description, address) VALUES
('Công ty Du lịch & Di sản Miền Trung', '0401234567', 'Du lịch - Lữ hành', 'Platinum', 'approved', 'Nguyễn Văn Hùng', 'Giám đốc', 'hung@mientrungtravel.vn', '0901111222', 'Đơn vị tổ chức các tour di sản văn hóa thế giới Huế - Hội An - Mỹ Sơn hàng đầu miền Trung.', 'Hải Châu, Đà Nẵng'),
('Hội An Heritage Eco Resort', '0409876543', 'Khách sạn - Nghỉ dưỡng', 'Gold', 'approved', 'Trần Thị Lan', 'Tổng giám đốc', 'lan@hoianecoresort.vn', '0912333444', 'Khu nghỉ dưỡng sinh thái ven sông Thu Bồn, không gian văn hóa phố cổ độc đáo.', 'Cẩm Châu, Hội An, Quảng Nam'),
('Hợp tác xã Cà phê Arabica Cầu Đất Đà Lạt', '5801234567', 'Nông sản - OCOP', 'Silver', 'approved', 'Lê Quang Minh', 'Chủ nhiệm HTX', 'minh@caudatcoffee.vn', '0933555666', 'Sản xuất và phân phối cà phê Arabica đặc sản Tây Nguyên đạt chứng nhận OCOP 4 sao.', 'Cầu Đất, Đà Lạt, Lâm Đồng');

-- Bài viết mẫu
INSERT INTO posts (member_id, title, summary, body, type, status, is_featured, contact_info) VALUES
(1, 'Hành trình 48 Giờ Khám Phá Di Sản Miền Trung: Huế – Đà Nẵng – Hội An', 'Cẩm nang chi tiết lịch trình 48 giờ trải nghiệm các di sản thế giới tại miền Trung.', 'Hành trình kết nối di sản văn hóa thế giới đưa du khách ghé thăm Quần thể di tích Cố đô Huế, ngắm nhìn Cầu Rồng Đà Nẵng và thả hoa đăng trên sông Hoài phố cổ Hội An...', 'Du lịch', 'approved', 1, 'hung@mientrungtravel.vn | 0901 111 222'),
(2, 'Tôn vinh nghệ nhân giữ lửa làng nghề gốm Thanh Hà 500 năm tuổi', 'Khám phá nét đẹp văn hóa truyền thống của làng gốm cổ bên bờ sông Thu Bồn.', 'Trải qua hơn 5 thế kỷ hình thành và phát triển, các nghệ nhân làng gốm Thanh Hà (Hội An) vẫn miệt mài tạo nên những sản phẩm đất nung mộc mạc mang đậm hồn quê Việt...', 'Văn hóa', 'approved', 1, 'lan@hoianecoresort.vn | 0912 333 444');

-- Sự kiện mẫu
INSERT INTO events (title, event_date, location, organizer, status) VALUES
('Lễ hội Phố Cổ Hội An & Đêm Rằm Hoa Đăng', '2026-09-15 18:00:00', 'Phố cổ Hội An, Quảng Nam', 'Trung tâm Văn hóa Thể thao Hội An', 'upcoming'),
('Festival Biển Quốc Tế Đà Nẵng 2026', '2026-09-22 08:30:00', 'Công viên Biển Đông, Đà Nẵng', 'Sở Du lịch TP. Đà Nẵng', 'upcoming'),
('Diễn đàn Hợp tác Phát triển Du lịch Di sản & Chuyển đổi số VTV8.today', '2026-10-05 09:00:00', 'Đà Nẵng — Trực tuyến toàn quốc', 'Ban Biên tập VTV8.today', 'upcoming');

-- Cấu hình AI mặc định
INSERT INTO ai_config (provider, model, is_active) VALUES ('openrouter', 'google/gemini-3-flash-preview', 1);
