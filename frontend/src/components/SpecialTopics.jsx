import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const topics = [
  { slug: 'tro-ly-ai-phuong-xa', label: 'AI phường xã', icon: 'ti-building-bank', category: 'Công nghệ AI cơ sở', title: 'Trợ lý AI phường xã', summary: 'Trợ lý AI đồng hành cùng các cơ quan hành chính tại phường, xã.', tone: 'blue' },
  { slug: 'orion-chat-loc-tinh-hoa-cua-erp-multimodel-ai-va-nen-tang-xay-dung-ai-agent-de-tao-thanh-mot-he-dieu-hanh-quan-tri-thong-minh-danh-cho-doanh-nghiep', label: 'Orion', icon: 'ti-bolt', category: 'Nền tảng AI thông minh', title: 'Orion chắt lọc tinh hoa của ERP, Multi-Model AI và nền tảng xây dựng AI Agent để tạo thành một hệ điều hành quản trị thông minh dành cho doanh nghiệp.', summary: 'Kết hợp ERP, Multi-Model AI và AI Agent trong một hệ điều hành quản trị thông minh dành cho doanh nghiệp.', tone: 'gold' },
  { slug: 'edunowai-giai-phap-tro-ly-ai-tuyen-sinh-thong-minh-danh-cho-cac-co-so-giao-duc', label: 'Edunow.today', icon: 'ti-school', category: 'Đào tạo & Kỹ năng số', title: 'EDUNOW.AI Giải pháp Trợ lý AI tuyển sinh thông minh dành cho các cơ sở giáo dục', summary: 'Giải pháp Trợ lý AI tuyển sinh thông minh dành cho các cơ sở giáo dục.', tone: 'green' },
];

export default function SpecialTopics() {
  const [articles, setArticles] = useState({});
  useEffect(() => {
    const controller = new AbortController();
    const loadArticles = async () => {
      try {
        const response = await fetch('/api/posts?category=AI&status=approved', { signal: controller.signal });
        if (!response.ok) return;
        const result = await response.json();
        if (result.success && Array.isArray(result.data) && !controller.signal.aborted) {
          setArticles(Object.fromEntries(result.data.map(article => [article.slug, article])));
        }
      } catch { /* Keep the curated title and direct link when the API is unavailable. */ }
    };
    loadArticles();
    return () => controller.abort();
  }, []);

  return <section className="na-section na-special" aria-labelledby="special-topics-title">
    <div className="na-container">
      <div className="na-special-heading">
        <span className="na-special-kicker"><i className="ti ti-sparkles" aria-hidden="true" /> Chuyên đề đặc biệt • Làm chủ AI bứt phá tương lai</span>
        <h2 id="special-topics-title">Làm Chủ AI – <span>Bứt Phá Tương Lai</span></h2>
        <p>Không gian tri thức, giải pháp chuyển đổi số và công nghệ trí tuệ nhân tạo với 3 trụ cột:<br /> AI phường xã, Hệ sinh thái Orion và Đào tạo số Edunow.today.</p>
      </div>
      <div className="na-special-grid">{topics.map(topic => {
        const article = articles[topic.slug];
        const title = article?.title || topic.title;
        const image = article?.image_url || article?.thumbnail || article?.image;
        const to = `/posts/${topic.slug}`;
        return <article className={`na-special-card ${topic.tone}`} key={topic.slug}>
          <Link to={to} className="na-special-image" aria-label={title}>
            <div className="na-special-image-fallback" aria-hidden="true"><i className={`ti ${topic.icon}`} /><strong>{topic.label}</strong></div>
            {image && <img src={image} alt="" loading="lazy" onError={event => { event.currentTarget.style.display = 'none'; }} />}
            <span className="na-special-badge"><i className={`ti ${topic.icon}`} aria-hidden="true" /> {topic.label}</span>
          </Link>
          <div className="na-special-body">
            <span className="na-special-category"><i className={`ti ${topic.icon}`} aria-hidden="true" /> {topic.category}</span>
            <h3><Link to={to}>{title}</Link></h3>
            <p>{article?.excerpt || article?.summary || topic.summary}</p>
            <div className="na-special-card-footer">{article?.company_name && <span title={article.company_name}>{article.company_name}</span>}<Link to={to} aria-label={`Đọc chi tiết: ${title}`}>Đọc chi tiết <i className="ti ti-arrow-right" aria-hidden="true" /></Link></div>
          </div>
        </article>;
      })}</div>
      <div className="na-center-actions"><Link className="na-btn blue" to="/posts?category=Làm%20chủ%20AI%20bứt%20phá%20tương%20lai"><i className="ti ti-layout-grid" aria-hidden="true" /> Xem toàn bộ bài viết chuyên mục AI</Link><Link className="na-btn na-special-chat" to="/ai-chat"><i className="ti ti-sparkles" aria-hidden="true" /> Trò chuyện cùng Trợ lý AI</Link></div>
    </div>
  </section>;
}
