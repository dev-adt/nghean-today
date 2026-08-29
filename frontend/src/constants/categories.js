/**
 * Cấu hình 8 Chuyên mục chính và các Lĩnh vực con tương ứng
 * dùng chung cho toàn bộ ứng dụng VTV8.today.
 */

export const CATEGORIES_DATA = [
  {
    id: 'van-hoa-du-lich',
    name: 'Văn hóa – Du lịch',
    name_en: 'Culture & Tourism',
    subcategories: [
      'Bản sắc văn hóa vùng miền',
      'Lễ hội & Tín ngưỡng',
      'Tour văn hóa trải nghiệm',
      'Không gian nghệ thuật'
    ]
  },
  {
    id: 'di-san-lich-su',
    name: 'Di sản – Lịch sử',
    name_en: 'Heritage & History',
    subcategories: [
      'Di sản thế giới UNESCO',
      'Di tích lịch sử - văn hóa',
      'Danh nhân & Ký ức thời gian',
      'Tuyến du lịch di sản'
    ]
  },
  {
    id: 'diem-den-noi-bat',
    name: 'Điểm đến nổi bật',
    name_en: 'Featured Destinations',
    subcategories: [
      'Miền Trung & Duyên hải',
      'Đại ngàn Tây Nguyên',
      'Kỳ quan Bắc Bộ',
      'Sắc màu Phương Nam',
      'Thiên đường biển đảo'
    ]
  },
  {
    id: 'le-hoi-su-kien',
    name: 'Lễ hội và sự kiện',
    name_en: 'Festivals & Events',
    subcategories: [
      'Lễ hội truyền thống',
      'Festival văn hóa nghệ thuật',
      'Sự kiện du lịch & Thể thao',
      'Hội chợ & Triển lãm'
    ]
  },
  {
    id: 'am-thuc-viet-nam',
    name: 'Ẩm thực Việt Nam',
    name_en: 'Vietnamese Cuisine',
    subcategories: [
      'Tinh hoa ẩm thực ba miền',
      'Đặc sản địa phương & OCOP',
      'Câu chuyện món ngon',
      'Địa chỉ ẩm thực tuyển chọn'
    ]
  },
  {
    id: 'con-nguoi-lang-nghe',
    name: 'Con người và làng nghề',
    name_en: 'People & Craft Villages',
    subcategories: [
      'Nghệ nhân & Người giữ nghề',
      'Làng nghề truyền thống',
      'Sản phẩm thủ công mỹ nghệ',
      'Trải nghiệm làm nghề'
    ]
  },
  {
    id: 'du-lich-ben-vung',
    name: 'Du lịch bền vững',
    name_en: 'Sustainable Tourism',
    subcategories: [
      'Hành trình xanh & Sinh thái',
      'Du lịch cộng đồng & Bản địa',
      'Quy tắc ứng xử điểm đến'
    ]
  },
  {
    id: 'doanh-nghiep-dich-vu',
    name: 'Doanh nghiệp & Dịch vụ',
    name_en: 'Enterprises & Services',
    subcategories: [
      'Lưu trú & Resort cao cấp',
      'Lữ hành & Vận chuyển',
      'Showroom số doanh nghiệp',
      'Nhu cầu hợp tác & Cung ứng'
    ]
  },
  {
    id: 'lam-chu-ai-but-pha-tuong-lai',
    name: 'Làm chủ AI bứt phá tương lai',
    name_en: 'Master AI to Break Through into the Future',
    subcategories: [
      'AI phường xã',
      'Orion',
      'Edunow.today'
    ]
  }
];

/**
 * Từ điển dịch tên Chuyên mục & Lĩnh vực sang Tiếng Anh
 */
export const CATEGORY_TRANSLATIONS = {
  // Main Categories
  'Văn hóa – Du lịch': { vi: 'Văn hóa – Du lịch', en: 'Culture & Tourism' },
  'Di sản – Lịch sử': { vi: 'Di sản – Lịch sử', en: 'Heritage & History' },
  'Điểm đến nổi bật': { vi: 'Điểm đến nổi bật', en: 'Featured Destinations' },
  'Lễ hội và sự kiện': { vi: 'Lễ hội và sự kiện', en: 'Festivals & Events' },
  'Ẩm thực Việt Nam': { vi: 'Ẩm thực Việt Nam', en: 'Vietnamese Cuisine' },
  'Con người và làng nghề': { vi: 'Con người và làng nghề', en: 'People & Craft Villages' },
  'Du lịch bền vững': { vi: 'Du lịch bền vững', en: 'Sustainable Tourism' },
  'Doanh nghiệp & Dịch vụ': { vi: 'Doanh nghiệp & Dịch vụ', en: 'Enterprises & Services' },
  'Làm chủ AI bứt phá tương lai': { vi: 'Làm chủ AI bứt phá tương lai', en: 'Master AI to Break Through into the Future' },

  // Sub Categories
  'AI phường xã': { vi: 'AI phường xã', en: 'Commune & Ward AI' },
  'Orion': { vi: 'Orion', en: 'Orion AI System' },
  'Edunow.today': { vi: 'Edunow.today', en: 'Edunow.today Digital Skills' },
  'Bản sắc văn hóa vùng miền': { vi: 'Bản sắc văn hóa vùng miền', en: 'Regional Cultural Identity' },
  'Lễ hội & Tín ngưỡng': { vi: 'Lễ hội & Tín ngưỡng', en: 'Festivals & Beliefs' },
  'Tour văn hóa trải nghiệm': { vi: 'Tour văn hóa trải nghiệm', en: 'Experiential Cultural Tours' },
  'Không gian nghệ thuật': { vi: 'Không gian nghệ thuật', en: 'Art Spaces' },

  'Di sản thế giới UNESCO': { vi: 'Di sản thế giới UNESCO', en: 'UNESCO World Heritage' },
  'Di tích lịch sử - văn hóa': { vi: 'Di tích lịch sử - văn hóa', en: 'Historical & Cultural Relics' },
  'Danh nhân & Ký ức thời gian': { vi: 'Danh nhân & Ký ức thời gian', en: 'Celebrities & Time Memories' },
  'Tuyến du lịch di sản': { vi: 'Tuyến du lịch di sản', en: 'Heritage Travel Routes' },

  'Miền Trung & Duyên hải': { vi: 'Miền Trung & Duyên hải', en: 'Central Coast Region' },
  'Đại ngàn Tây Nguyên': { vi: 'Đại ngàn Tây Nguyên', en: 'Central Highlands' },
  'Kỳ quan Bắc Bộ': { vi: 'Kỳ quan Bắc Bộ', en: 'Northern Wonders' },
  'Sắc màu Phương Nam': { vi: 'Sắc màu Phương Nam', en: 'Southern Highlights' },
  'Thiên đường biển đảo': { vi: 'Thiên đường biển đảo', en: 'Island & Marine Paradise' },

  'Lễ hội truyền thống': { vi: 'Lễ hội truyền thống', en: 'Traditional Festivals' },
  'Festival văn hóa nghệ thuật': { vi: 'Festival văn hóa nghệ thuật', en: 'Cultural & Art Festivals' },
  'Sự kiện du lịch & Thể thao': { vi: 'Sự kiện du lịch & Thể thao', en: 'Tourism & Sports Events' },
  'Hội chợ & Triển lãm': { vi: 'Hội chợ & Triển lãm', en: 'Fairs & Exhibitions' },

  'Tinh hoa ẩm thực ba miền': { vi: 'Tinh hoa ẩm thực ba miền', en: 'Culinary Quintessence' },
  'Đặc sản địa phương & OCOP': { vi: 'Đặc sản địa phương & OCOP', en: 'Local Specialties & OCOP' },
  'Câu chuyện món ngon': { vi: 'Câu chuyện món ngon', en: 'Food Stories' },
  'Địa chỉ ẩm thực tuyển chọn': { vi: 'Địa chỉ ẩm thực tuyển chọn', en: 'Selected Culinary Spots' },

  'Nghệ nhân & Người giữ nghề': { vi: 'Nghệ nhân & Người giữ nghề', en: 'Artisans & Heritage Keepers' },
  'Làng nghề truyền thống': { vi: 'Làng nghề truyền thống', en: 'Traditional Craft Villages' },
  'Sản phẩm thủ công mỹ nghệ': { vi: 'Sản phẩm thủ công mỹ nghệ', en: 'Handicraft Products' },
  'Trải nghiệm làm nghề': { vi: 'Trải nghiệm làm nghề', en: 'Hands-on Craft Experiences' },

  'Hành trình xanh & Sinh thái': { vi: 'Hành trình xanh & Sinh thái', en: 'Green & Eco Journeys' },
  'Du lịch cộng đồng & Bản địa': { vi: 'Du lịch cộng đồng & Bản địa', en: 'Community-based Tourism' },
  'Quy tắc ứng xử điểm đến': { vi: 'Quy tắc ứng xử điểm đến', en: 'Destination Codes of Conduct' },

  'Lưu trú & Resort cao cấp': { vi: 'Lưu trú & Resort cao cấp', en: 'Accommodations & Luxury Resorts' },
  'Lữ hành & Vận chuyển': { vi: 'Lữ hành & Vận chuyển', en: 'Travel Agencies & Transport' },
  'Showroom số doanh nghiệp': { vi: 'Showroom số doanh nghiệp', en: 'Enterprise Digital Showrooms' },
  'Nhu cầu hợp tác & Cung ứng': { vi: 'Nhu cầu hợp tác & Cung ứng', en: 'Partnership & Supply Needs' }
};

/**
 * Helper lấy nhãn hiển thị đa ngôn ngữ cho Chuyên mục / Lĩnh vực.
 * @param {string|object} item - Tên string hoặc object category ({ name, name_en })
 * @param {string} lang - Mã ngôn ngữ 'vi' hoặc 'en'
 */
export const getCategoryLabel = (item, lang = 'vi') => {
  if (!item) return '';

  if (typeof item === 'object') {
    if (lang === 'en') {
      if (item.name_en && item.name_en.trim()) return item.name_en.trim();
      const trans = CATEGORY_TRANSLATIONS[item.name];
      if (trans && trans.en) return trans.en;
    }
    return item.name || '';
  }

  const strName = String(item).trim();
  if (lang === 'en') {
    const trans = CATEGORY_TRANSLATIONS[strName];
    if (trans && trans.en) return trans.en;
  }
  return strName;
};

export const getSubCategoryLabel = getCategoryLabel;

// Helper lấy danh sách tên tất cả Chuyên mục (Category lớn)
export const ALL_CATEGORIES = CATEGORIES_DATA.map(c => c.name);

// Helper lấy tất cả Lĩnh vực con theo Chuyên mục
export const getSubcategoriesByCategory = (categoryName) => {
  const cat = CATEGORIES_DATA.find(c => c.name === categoryName);
  return cat ? cat.subcategories : [];
};

// Helper lấy tất cả Lĩnh vực con trên toàn hệ thống
export const ALL_SUBCATEGORIES = CATEGORIES_DATA.flatMap(c => c.subcategories);
