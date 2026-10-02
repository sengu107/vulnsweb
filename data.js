const products = [
  { id: 1, emoji: '📱', name: 'Galaxy Z Fold 7', price: 42990000, desc: 'Màn hình gập 7.8", chip Snapdragon mới nhất, camera 200MP.' },
  { id: 2, emoji: '💻', name: 'MacBook Air M4', price: 28990000, desc: 'Mỏng nhẹ, pin 18 giờ, màn hình Liquid Retina 13.6".' },
  { id: 3, emoji: '🎧', name: 'Tai nghe NoiseCancel Pro', price: 4590000, desc: 'Chống ồn chủ động, pin 40 giờ, kết nối đa thiết bị.' },
  { id: 4, emoji: '⌚', name: 'Watch Series X', price: 9990000, desc: 'Theo dõi sức khoẻ 24/7, chống nước 50m, pin 2 ngày.' },
  { id: 5, emoji: '🖥️', name: 'Màn hình 4K UltraWide', price: 13990000, desc: '34 inch cong, 144Hz, chuẩn màu DCI-P3 98%.' },
  { id: 6, emoji: '🎮', name: 'Tay cầm chơi game Pro', price: 1890000, desc: 'Kết nối không dây, rung phản hồi haptic, pin sạc nhanh.' },
];

function formatVND(n) {
  return n.toLocaleString('vi-VN') + '₫';
}

module.exports = { products, formatVND };
