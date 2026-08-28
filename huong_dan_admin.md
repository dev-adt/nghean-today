# Hướng dẫn Quản trị viên: Quản lý & Vận hành Hệ sinh thái VTV8.today

Tài liệu này hướng dẫn Admin cách sử dụng các công cụ quản trị để kiểm duyệt tài khoản, bài đăng, sự kiện, danh mục, biên tập viên và tiếp nhận thông tin liên hệ / đăng ký trên hệ thống VTV8.today.

---

## 1. Truy cập trang quản trị
- Đăng nhập tài khoản Admin thông qua cổng đăng nhập hợp nhất (`/login`).
- Truy cập Dashboard Admin để quản lý các phân mục:
  1. **Dashboard tổng quan** (`/admin-dashboard`)
  2. **Quản lý Hội viên** (`/admin-members`)
  3. **Quản lý Bài đăng** (`/admin-posts`)
  4. **Quản lý Sự kiện** (`/admin-events`)
  5. **Quản lý Chuyên mục & Lĩnh vực** (`/admin-categories`)
  6. **Quản lý Biên tập viên** (`/admin-creators`)
  7. **Tiếp nhận Liên hệ / Đăng ký** (`/admin-leads`)
  8. **Cài đặt AI đa mô hình** (`/admin-ai`)

---

## 2. Quản lý Hội viên (Duyệt, Khóa & Nâng cấp gói)

Truy cập mục **Hội viên** để quản lý danh sách doanh nghiệp tham gia mạng lưới.

### Kiểm duyệt đăng ký mới
- Lọc danh sách theo tab **Chờ duyệt** (Pending).
- Xem thông tin đăng ký của doanh nghiệp (Tên, MST, người đại diện, lĩnh vực hoạt động).
- Thực hiện hành động:
  - **Duyệt**: Kích hoạt tài khoản thành trạng thái hoạt động chính thức (`approved`). Người dùng có thể đăng nhập vào Dashboard của họ.
  - **Từ chối**: Hệ thống sẽ yêu cầu nhập **Lý do từ chối cụ thể** (Ví dụ: MST sai hoặc thiếu hồ sơ). Lý do này sẽ hiển thị trực tiếp cho doanh nghiệp khi họ cố gắng đăng nhập.

### Khóa & Xóa tài khoản hội viên
- **Khóa tài khoản (Tạm khóa)**: Đối với các hội viên vi phạm quy chế hoặc hết hạn phí, Admin nhấn nút **Khóa** để chuyển trạng thái thành `suspended`. Người dùng sẽ ngay lập tức bị đăng xuất khỏi tất cả phiên làm việc và không thể đăng nhập lại (Hệ thống trả về thông báo tài khoản bị khóa). Khi khóa, bạn có thể nhấn **Mở khóa** để kích hoạt lại tài khoản bất kỳ lúc nào.
- **Xóa vĩnh viễn**: Nhấn **Xóa** để xóa toàn bộ thông tin hội viên khỏi cơ sở dữ liệu. Thao tác này sẽ tự động xóa sạch các bài đăng liên quan và lịch sử chat logs của hội viên đó (Không thể khôi phục).

### Duyệt yêu cầu nâng cấp gói hội viên
- Khi hội viên gửi yêu cầu nâng cấp lên gói Gold/Platinum, trên dòng thông tin của hội viên đó sẽ xuất hiện khung yêu cầu màu cam: *Lên Gold* hoặc *Lên Plat*.
- Thực hiện hành động:
  - **Duyệt**: Admin phê duyệt nâng cấp gói và **thiết lập thời hạn sử dụng** cho gói thành viên đó. Gói sẽ tự động hạ cấp xuống Silver khi hết hạn mà không cần admin can thiệp thủ công.
  - **Hủy**: Từ chối yêu cầu nâng cấp và giữ nguyên gói hiện tại của thành viên.

### Ghim "Hội viên nổi bật" ngoài trang chủ & thư mục
- Trên dòng thông tin của mỗi hội viên đã duyệt sẽ có biểu tượng **Ngôi sao**.
- Admin nhấn chọn ngôi sao để ghim hội viên đó thành **Hội viên nổi bật** ngoài trang chủ và trên đầu trang Thư mục hội viên.
- **Giới hạn**: Hệ thống giới hạn **tối đa 3 hội viên nổi bật**. Nếu đã ghim đủ 3 người, hệ thống sẽ báo lỗi và yêu cầu Admin bỏ ghim bớt người cũ trước khi ghim thêm người mới để đảm bảo tính thẩm mỹ của giao diện.

---

## 3. Quản lý Bài đăng (Duyệt tin & Ghim nổi bật)

Truy cập mục **Tin đăng** để quản lý các cơ hội giao thương do doanh nghiệp chia sẻ.

### Kiểm duyệt bài đăng
- Lọc các bài viết ở trạng thái **Chờ duyệt** (Pending).
- Click xem nội dung bài viết và nhấn **Duyệt** để hiển thị bài viết lên Bảng tin công khai.

### Duyệt ghim bài viết nổi bật lên trang chủ
- Ngoài trang chủ hiển thị tối đa **3 bài viết nổi bật nhất** (Dự án kết nối nổi bật).
- Trong trang quản trị, các bài viết được thành viên Platinum gửi kèm yêu cầu ghim sẽ hiển thị nhãn màu cam nổi bật: **`Yêu cầu ghim 🌟`** bên cạnh tiêu đề.
- Admin nhấn vào ngôi sao trên cột **Nổi bật** để duyệt ghim bài viết đó ra trang chủ.
- **Giới hạn**: Giới hạn tối đa 3 bài viết nổi bật. Bạn cần bỏ ghim bài cũ nếu muốn ghim bài viết mới.

---

## 4. Quản lý Sự kiện (Events)

Mục **Sự kiện** cho phép Admin lập lịch trình hoạt động, giao lưu kinh tế của cộng đồng doanh nghiệp.

### Tạo mới & Chỉnh sửa sự kiện
- Nhập các trường thông tin: **Tiêu đề sự kiện**, **Nhà tổ chức**, **Mô tả ngắn**, **Nội dung chi tiết**, **Địa điểm**, **Thời gian tổ chức (Ngày)** và **Ảnh minh họa**.
- Nhấn **Lưu sự kiện** để đăng công khai.

### Trạng thái sự kiện tự động theo thời gian thực (Real-time Auto-status)
Admin **không cần thay đổi trạng thái sự kiện bằng tay**. Hệ thống Backend sẽ tự động đối chiếu thời gian thực của máy chủ với ngày diễn ra sự kiện để tự động cập nhật:
- Trước ngày diễn ra: **Sắp diễn ra** (upcoming)
- Đúng ngày diễn ra: **Đang diễn ra** (ongoing)
- Qua ngày diễn ra: **Đã kết thúc** (completed)

### Theo dõi mức độ quan tâm của doanh nghiệp
- Trong bảng quản lý sự kiện, Admin có thể nhìn thấy cột số lượng doanh nghiệp đã bấm nút **Quan tâm** sự kiện đó để ước lượng số lượng người tham dự thực tế.
