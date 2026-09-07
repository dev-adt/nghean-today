import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { selectHomeEvents } from '../utils/homeEvents';

const backgrounds = ['/images/event-culture.png', '/images/event-conference.png', '/images/event-community.png'];
const dateFormat = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' });

export default function HomeEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch('/api/events', { signal: controller.signal });
        if (!response.ok) throw new Error('Cannot load events');
        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid events');
        if (!controller.signal.aborted) { setEvents(result.data); setError(false); }
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) { setLoading(false); setNow(Date.now()); }
      }
    };
    load();
    const clock = setInterval(() => setNow(Date.now()), 1000);
    const refresh = setInterval(load, 60000);
    return () => { controller.abort(); clearInterval(clock); clearInterval(refresh); };
  }, []);

  const selected = selectHomeEvents(events, now);
  return <section className="na-section muted na-home-events" aria-labelledby="home-events-title">
    <div className="na-container">
      <div className="na-heading"><span className="na-kicker">Gặp gỡ • Kết nối • Trải nghiệm</span><h2 id="home-events-title">Sự Kiện</h2><p>Khám phá các sự kiện đang diễn ra và những cuộc hẹn sắp tới tại Nghệ An.</p></div>
      {loading ? <div className="na-empty" role="status">Đang tải sự kiện...</div> : selected.length ? <div className="na-event-grid">{selected.map((event, index) => <article className="na-event-card" key={event.id}>
        <Link className="na-event-cover" to={`/events?event=${encodeURIComponent(event.id)}`} aria-label={`Xem chi tiết: ${event.title}`}>
          <img src={backgrounds[index]} alt="" loading="lazy" width="1672" height="941" />
          <span className={`na-event-status ${event.liveStatus}`}>{event.liveStatus === 'ongoing' ? 'Đang diễn ra' : 'Sắp diễn ra'}</span>
        </Link>
        <div className="na-event-body">
          <div className="na-event-date"><i className="ti ti-calendar-event" aria-hidden="true" /><time dateTime={new Date(event.start).toISOString()}>{dateFormat.format(event.start)}</time></div>
          <h3><Link to={`/events?event=${encodeURIComponent(event.id)}`}>{event.title}</Link></h3>
          <p className="na-event-location"><i className="ti ti-map-pin" aria-hidden="true" />{event.location || 'Địa điểm sẽ được cập nhật'}</p>
          {event.organizer && <p className="na-event-organizer"><i className="ti ti-building" aria-hidden="true" />{event.organizer}</p>}
          <Link className="na-event-details" to={`/events?event=${encodeURIComponent(event.id)}`}>Xem chi tiết <i className="ti ti-arrow-right" aria-hidden="true" /></Link>
        </div>
      </article>)}</div> : <div className="na-empty" role="status"><i className="ti ti-calendar-event" aria-hidden="true" /><p>{error ? 'Chưa tải được sự kiện. Vui lòng thử lại sau.' : 'Hiện chưa có sự kiện đang diễn ra hoặc sắp diễn ra. Hãy quay lại để cập nhật lịch mới.'}</p></div>}
      <div className="na-center-actions"><Link className="na-btn blue" to="/events">Xem toàn bộ sự kiện <i className="ti ti-arrow-right" aria-hidden="true" /></Link></div>
    </div>
  </section>;
}
