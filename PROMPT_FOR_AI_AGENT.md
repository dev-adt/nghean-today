# 🤖 PROMPT MẪU CHO AI AGENT — TỰ ĐỘNG REBRAND & TÙY BIẾN DỰ ÁN

Tài liệu này được thiết kế để bạn chỉ cần **sao chép toàn bộ nội dung bên dưới**, điền thông tin thương hiệu mong muốn, sau đó dán vào bất kỳ AI Coding Assistant nào (Antigravity, Cursor, Windsurf, Claude Code, GitHub Copilot, ChatGPT, v.v.). AI Agent sẽ tự động đọc toàn bộ codebase và thực hiện thay đổi 100% chuẩn xác.

---

### 📋 NỘI DUNG PROMPT MẪU (COPY TỪ ĐOÂY)

```markdown
Bạn là Senior Fullstack Developer & AI Engineer. Tôi vừa clone dự án codebase này và muốn bạn thực hiện chuyển đổi thương hiệu (Rebranding & Customization) sang thương hiệu mới của tôi mà vẫn giữ nguyên toàn bộ tính năng và logic sẵn có.

Dưới đây là thông tin nhận diện thương hiệu mới của tôi:

═══════════════════════════════════════════════════════════════
THÔNG TIN THƯƠNG HIỆU MỚI
═══════════════════════════════════════════════════════════════
- Tên thương hiệu hiển thị (Brand Name) : [VD: DANANG.today / SAIGON.today / BIZHUB.vn]
- Tên viết tắt ngắn gọn (Brand Short)  : [VD: DANANG / SAIGON / BIZHUB]
- Tên tổ chức / Đơn vị chủ quản         : [VD: Hiệp hội Du lịch & Doanh nghiệp TP. Đà Nẵng]
- Tên miền chính (Domain)               : [VD: danang.today]
- Slogan / Thông điệp đại diện          : [VD: Khám phá thành phố đáng sống — Kết nối giao thương số 1]
- Mô tả tóm tắt hệ sinh thái (Desc)     : [VD: Hệ sinh thái số du lịch, văn hóa, ẩm thực và xúc tiến đầu tư Đà Nẵng]
- Màu sắc chủ đạo (Primary Color HEX)  : [VD: #059669 (Xanh lá) hoặc #1E88E5 (Xanh dương) hoặc #D97706 (Cam đất)]
- Tên Trợ lý AI (AI Assistant Name)     : [VD: AI DaNang Assistant]
- System Prompt / Vai trò AI            : [VD: Bạn là trợ lý AI chuyên sâu về văn hóa, điểm đến du lịch, ẩm thực và hỗ trợ doanh nghiệp đối tác tại Đà Nẵng.]
- Hotline liên hệ                       : [VD: 0236 3888 999]
- Số điện thoại di động / Zalo          : [VD: 0905 888 999]
- Email liên hệ & hỗ trợ                : [VD: contact@danang.today & support@danang.today]
- Địa chỉ văn phòng                     : [VD: 123 Bạch Đằng, Quận Hải Châu, TP. Đà Nẵng]
- Đường dẫn Logo mới (nếu có)           : [VD: /logo_danang.png hoặc để mặc định /Logo_vtv8.png]
═══════════════════════════════════════════════════════════════

NHIỆM VỤ CỦA BẠN:
1. Đọc file `frontend/src/brand.config.js` và cập nhật toàn bộ thông tin thương hiệu, màu sắc, hotline, email, địa chỉ, slogan và AI config theo thông tin trên.
2. Đọc file `config/brand.config.js` và cập nhật thông tin thương hiệu cho Backend.
3. Cập nhật file `package.json`, `ecosystem.config.js`, `.env.example`, `frontend/index.html` và `public/index.html` đồng bộ tên dự án và SEO title/description.
4. Rà soát lại các text hardcoded đặc thù nếu có trong `frontend/src/contexts/LanguageContext.jsx` để đảm bảo sử dụng dữ liệu thương hiệu mới hoặc thông qua `brandConfig`.
5. Đảm bảo chạy thử `npm run build` trong thư mục `frontend/` (hoặc kiểm tra build syntax) để xác nhận không phát sinh bất kỳ lỗi biên dịch nào.
6. Xuất báo cáo tóm tắt các thay đổi đã thực hiện và hướng dẫn ngắn gọn các bước tiếp theo để chạy dự án.

Hãy bắt đầu phân tích và thực hiện ngay!
```

---

### 💡 HƯỚNG DẪN DÀNH CHO NGƯỜI DÙNG

1. Mở dự án bằng IDE (VS Code / Antigravity / Cursor).
2. Copy đoạn prompt trong khung trên.
3. Thay đổi các giá trị trong ngoặc vuông `[...]` thành thông tin thực tế của bạn.
4. Gửi cho AI và quan sát AI hoàn thiện toàn bộ chỉ trong 1-2 phút!
