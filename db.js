/**
 * Nghean.today — Database Module (MySQL)
 * File: db.js
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host     : process.env.DB_HOST     || 'localhost',
  port     : process.env.DB_PORT     || 3306,
  user     : process.env.DB_USER     || 'nghean_today',
  password : process.env.DB_PASSWORD || '',
  database : process.env.DB_NAME     || 'nghean_today_db',
  charset  : 'utf8mb4',
  waitForConnections: true,
  connectionLimit   : 10,
  timezone          : '+07:00',
});

// Test kết nối khi khởi động
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL kết nối thành công — database:', process.env.DB_NAME || 'nghean_today_db');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL lỗi kết nối:', err.message);
    console.error('   Kiểm tra DB_HOST, DB_USER, DB_PASSWORD, DB_NAME trong file .env');
  });

module.exports = pool;
