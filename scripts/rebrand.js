#!/usr/bin/env node

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * CODEBASE TODAY — AUTOMATIC REBRANDING CLI TOOL
 * ══════════════════════════════════════════════════════════════════════════════
 * Công cụ tự động đổi thương hiệu (White-label Rebranding Script).
 * 
 * Cách dùng:
 * 1. Chạy tương tác:
 *    node scripts/rebrand.js
 * 
 * 2. Chạy với tham số dòng lệnh:
 *    node scripts/rebrand.js \
 *      --name="DANANG.today" \
 *      --short="DANANG" \
 *      --domain="danang.today" \
 *      --slogan="Khám phá thành phố đáng sống" \
 *      --company="Hiệp hội Du lịch & Doanh nghiệp Đà Nẵng" \
 *      --color="#059669" \
 *      --ai="AI DaNang Assistant" \
 *      --hotline="0236 3888 999" \
 *      --email="contact@danang.today"
 * 
 * 3. Chạy thử nghiệm không ghi đè:
 *    node scripts/rebrand.js --dry-run
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Đọc tham số CLI (Args parsing)
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, ...valParts] = arg.slice(2).split('=');
    params[key] = valParts.join('=') || true;
  }
});

const isDryRun = !!params['dry-run'];
const rootDir = path.resolve(__dirname, '..');

// Helper đọc/ghi file an toàn
function updateFile(filePath, mutator) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ Bỏ qua vì không tìm thấy file: ${filePath}`);
    return;
  }
  const original = fs.readFileSync(fullPath, 'utf8');
  const updated = mutator(original);
  if (original !== updated) {
    if (!isDryRun) {
      fs.writeFileSync(fullPath, updated, 'utf8');
    }
    console.log(`✅ [${isDryRun ? 'DRY-RUN' : 'UPDATED'}] ${filePath}`);
  } else {
    console.log(`ℹ️ [UNCHANGED] ${filePath}`);
  }
}

async function promptUser(query, defaultValue) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(`${query} (${defaultValue}): `, answer => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║       TODAY PLATFORM — WHITE-LABEL REBRANDING TOOL        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (isDryRun) {
    console.log('🔍 ĐANG CHẠY Ở CHẾ ĐỘ THỬ NGHIỆM (--dry-run). Không có file nào bị thay đổi.\n');
  }

  // 1. Thu thập thông tin thương hiệu
  const brandName = params.name || (params.nonInteractive ? 'TODAY.vn' : await promptUser('1. Tên thương hiệu hiển thị (VD: HUE.today / BIZ.today)', 'VTV8.today'));
  const brandShort = params.short || (params.nonInteractive ? 'TODAY' : await promptUser('2. Tên viết tắt ngắn gọn (VD: HUE / BIZ)', 'VTV8'));
  const domain = params.domain || (params.nonInteractive ? 'today.vn' : await promptUser('3. Tên miền chính (VD: hue.today / vtv8.vn)', 'vtv8.vn'));
  const slogan = params.slogan || (params.nonInteractive ? 'Kết nối thời đại, kiến tạo tương lai' : await promptUser('4. Slogan / Thông điệp', 'Tôn vinh cội nguồn, kết nối thời đại'));
  const company = params.company || (params.nonInteractive ? `${brandName} Corporation` : await promptUser('5. Tên tổ chức / Đơn vị chủ quản', 'Trung tâm Truyền hình Việt Nam khu vực Miền Trung - Tây Nguyên (VTV8)'));
  const aiName = params.ai || (params.nonInteractive ? `AI ${brandShort} Assistant` : await promptUser('6. Tên trợ lý Trí tuệ Nhân tạo AI', `AI ${brandShort} Assistant`));
  const primaryColor = params.color || (params.nonInteractive ? '#1E88E5' : await promptUser('7. Mã màu chủ đạo HEX (VD: #1E88E5, #059669)', '#1E88E5'));
  const hotline = params.hotline || (params.nonInteractive ? '1900 6868' : await promptUser('8. Hotline hỗ trợ', '0236 3822 555'));
  const email = params.email || (params.nonInteractive ? `contact@${domain}` : await promptUser('9. Email liên hệ', `contact@${domain}`));

  console.log('\n🔄 Đang tiến hành đồng bộ nhận diện thương hiệu mới...');

  // 2. Cập nhật frontend/src/brand.config.js
  updateFile('frontend/src/brand.config.js', content => {
    return content
      .replace(/brandName:\s*'.*?'/g, `brandName: '${brandName}'`)
      .replace(/brandShortName:\s*'.*?'/g, `brandShortName: '${brandShort}'`)
      .replace(/platformName:\s*'.*?'/g, `platformName: '${brandName} Platform'`)
      .replace(/companyLegalName:\s*'.*?'/g, `companyLegalName: '${company}'`)
      .replace(/slogan:\s*'.*?'/g, `slogan: '${slogan}'`)
      .replace(/domain:\s*'.*?'/g, `domain: '${domain}'`)
      .replace(/baseUrl:\s*'.*?'/g, `baseUrl: 'https://${domain}'`)
      .replace(/primary:\s*'.*?'/g, `primary: '${primaryColor}'`)
      .replace(/name:\s*'AI .*?'/g, `name: '${aiName}'`)
      .replace(/shortName:\s*'.*?AI.*?'/g, `shortName: '${brandShort} AI'`)
      .replace(/hotline:\s*'.*?'/g, `hotline: '${hotline}'`)
      .replace(/email:\s*'.*?'/g, `email: '${email}'`)
      .replace(/supportEmail:\s*'.*?'/g, `supportEmail: 'support@${domain}'`);
  });

  // 3. Cập nhật config/brand.config.js (Backend)
  updateFile('config/brand.config.js', content => {
    return content
      .replace(/appName: process\.env\.APP_NAME \|\|\s*'.*?'/g, `appName: process.env.APP_NAME || '${brandName} Platform'`)
      .replace(/brandName: process\.env\.BRAND_NAME \|\|\s*'.*?'/g, `brandName: process.env.BRAND_NAME || '${brandName}'`)
      .replace(/brandShortName: process\.env\.BRAND_SHORT_NAME \|\|\s*'.*?'/g, `brandShortName: process.env.BRAND_SHORT_NAME || '${brandShort}'`)
      .replace(/siteUrl: process\.env\.SITE_URL \|\|\s*'.*?'/g, `siteUrl: process.env.SITE_URL || 'https://${domain}'`)
      .replace(/agentName: process\.env\.AI_AGENT_NAME \|\|\s*'.*?'/g, `agentName: process.env.AI_AGENT_NAME || '${aiName}'`);
  });

  // 4. Cập nhật package.json
  const slugName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  updateFile('package.json', content => {
    try {
      const json = JSON.parse(content);
      json.name = slugName;
      json.description = `${brandName} — Hệ sinh thái số & Nền tảng kết nối toàn diện`;
      json.scripts = json.scripts || {};
      json.scripts.pm2 = `pm2 start server.js --name ${slugName}`;
      return JSON.stringify(json, null, 2) + '\n';
    } catch (e) {
      return content;
    }
  });

  // 5. Cập nhật ecosystem.config.js
  updateFile('ecosystem.config.js', content => {
    return content.replace(/name\s*:\s*'.*?'/g, `name        : '${slugName}-prod'`);
  });

  // 6. Cập nhật .env.example
  updateFile('.env.example', content => {
    return content
      .replace(/APP_NAME=.*/g, `APP_NAME=${brandName} Platform`)
      .replace(/BRAND_NAME=.*/g, `BRAND_NAME=${brandName}`)
      .replace(/BRAND_SHORT_NAME=.*/g, `BRAND_SHORT_NAME=${brandShort}`)
      .replace(/AI_AGENT_NAME=.*/g, `AI_AGENT_NAME=${aiName}`)
      .replace(/SITE_URL=.*/g, `SITE_URL=https://${domain}`)
      .replace(/SUPPORT_EMAIL=.*/g, `SUPPORT_EMAIL=support@${domain}`);
  });

  // 7. Cập nhật frontend/index.html & public/index.html
  const htmlMutator = content => {
    return content
      .replace(/<title>.*?<\/title>/g, `<title>${brandName} — ${slogan}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${brandName} — Hệ sinh thái số kết nối cộng đồng, doanh nghiệp và du khách." />`);
  };
  updateFile('frontend/index.html', htmlMutator);
  updateFile('public/index.html', htmlMutator);

  console.log('\n🎉 ĐỒNG BỘ THƯƠNG HIỆU HOÀN TẤT THÀNH CÔNG!');
  console.log('════════════════════════════════════════════════════════════');
  console.log(`📌 Tên thương hiệu : ${brandName} (${brandShort})`);
  console.log(`🌐 Tên miền        : https://${domain}`);
  console.log(`💡 Slogan          : ${slogan}`);
  console.log(`🤖 Trợ lý AI       : ${aiName}`);
  console.log('════════════════════════════════════════════════════════════');
  console.log('🚀 Tiếp theo bạn chỉ cần:');
  console.log('  1. Cung cấp file ảnh logo mới vào thư mục public/ (hoặc cập nhật đường dẫn trong brand.config.js)');
  console.log('  2. Chạy: npm run dev hoặc npm run build');
  console.log('  3. Khởi động lại backend server: node server.js\n');
}

main().catch(err => {
  console.error('❌ Lỗi khi thực thi script:', err);
  process.exit(1);
});
