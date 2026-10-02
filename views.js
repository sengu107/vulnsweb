const { products, formatVND } = require('./data');

function layout({ title, body, points }) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<link rel="stylesheet" href="/style.css">
</head>
<body>
<div class="card">
<nav>
  <a class="logo" href="/">Shop<span>VN</span>.</a>
  <div class="nav-links">
    <a href="/">Trang chủ</a>
    <a href="/cart">Giỏ hàng</a>
    <form class="search-box" action="/search" method="GET">
      <input type="text" name="q" placeholder="Tìm sản phẩm...">
      <button type="submit">🔍</button>
    </form>
  </div>
  <a class="cart-pill" href="/cart">⭐ ${points ?? ''} điểm</a>
</nav>
${body}
<div class="footer-note">ShopVN demo — dự án học bảo mật web, không phải site thật.</div>
</div>
</body>
</html>`;
}

function productCard(p) {
  return `<a class="product-card" href="/product/${p.id}">
    <div class="emoji">${p.emoji}</div>
    <h3>${p.name}</h3>
    <div class="price">${formatVND(p.price)}</div>
    <p>${p.desc}</p>
  </a>`;
}

function homePage({ points }) {
  const body = `
<div class="hero">
  <div class="hero-copy">
    <p class="eyebrow">ShopVN / technology edit</p>
    <h1>Công nghệ<br>cho nhịp sống mới</h1>
    <p class="desc">Những thiết bị được chọn lọc để làm việc, sáng tạo và kết nối mỗi ngày.</p>
    <a class="btn cta-btn" href="#products">Khám phá bộ sưu tập <span>↗</span></a>
  </div>
  <div class="hero-visual" role="img" aria-label="Laptop và phụ kiện công nghệ trên bàn làm việc">
    <span class="hero-stamp">NEW<br>SEASON</span>
  </div>
</div>

<div class="panel" id="partner-widget">
  <b>Đánh giá từ đối tác ReviewHub</b>
  <p style="font-size:13px;color:#777;margin:6px 0 12px">Widget tải đánh giá sản phẩm tổng hợp từ trang đối tác (origin khác).</p>
  <button onclick="loadPartnerReviews()">Tải đánh giá đối tác</button>
  <pre id="partner-out">(chưa tải)</pre>
</div>

<div class="section-heading" id="products">
  <p class="eyebrow">Selected for you</p>
  <h2 class="section-title">Sản phẩm nổi bật</h2>
</div>
<div class="grid">
  ${products.map(productCard).join('')}
</div>

<script>
async function loadPartnerReviews() {
  const out = document.getElementById('partner-out');
  out.textContent = 'Đang gọi http://localhost:4000/no-cors-data ...';
  try {
    const r = await fetch('http://localhost:4000/no-cors-data');
    out.textContent = await r.text();
  } catch (e) {
    out.textContent = 'Trình duyệt chặn request cross-origin này (Same-Origin Policy):\\n' + e.message;
  }
}
</script>`;
  return layout({ title: 'ShopVN - Công nghệ chính hãng', body, points });
}

function searchPage({ q, results, points }) {
  const cards = results.length
    ? `<div class="grid">${results.map(productCard).join('')}</div>`
    : `<p class="desc">Không tìm thấy sản phẩm phù hợp.</p>`;
  const body = `
<a class="back-link" href="/">&larr; Trang chủ</a>
<h1>Kết quả tìm kiếm</h1>
<p class="desc">Từ khoá: ${q}</p>
${cards}`;
  return layout({ title: `Tìm kiếm: ${q} - ShopVN`, body, points });
}

function productPage({ p, reviews, points, previewHtml = '' }) {
  const reviewItems = reviews.map(r => `<div class="review"><b>${r.name}</b> <span class="stars">${'★'.repeat(r.stars)}</span><br>${r.text}</div>`).join('');
  const previewBlock = previewHtml
    ? `<div class="review"><b>Xem trước:</b><br>${previewHtml}</div>`
    : '';
  const body = `
<a class="back-link" href="/">&larr; Trang chủ</a>
<div class="product-detail">
  <div class="emoji-big">${p.emoji}</div>
  <div style="flex:1;min-width:240px">
    <h1>${p.name}</h1>
    <div class="price" style="font-size:22px;color:#a855f7;font-weight:700">${formatVND(p.price)}</div>
    <p class="desc">${p.desc}</p>
    <button onclick="alert('Đã thêm vào giỏ hàng!')">Thêm vào giỏ hàng</button>
  </div>
</div>

<h2 class="section-title">Mô tả chi tiết <span class="badge">người bán tự soạn</span></h2>
<div class="panel">
  <p style="font-size:13px;color:#777">Người bán có thể xem trước mô tả sản phẩm (hỗ trợ HTML) trước khi đăng.</p>
  <form method="GET" action="/product/${p.id}">
    <textarea name="preview" rows="3" placeholder="Nhập mô tả HTML để xem trước...">${previewHtml}</textarea>
    <button type="submit">Xem trước</button>
  </form>
  ${previewBlock}
</div>

<h2 class="section-title">Đánh giá từ khách hàng (${reviews.length})</h2>
<div class="panel">
  <form method="POST" action="/product/${p.id}/review">
    <label>Tên của bạn:</label>
    <input type="text" name="name" placeholder="Tên hiển thị">
    <label>Số sao (1-5):</label>
    <input type="number" name="stars" min="1" max="5" value="5">
    <label>Nhận xét:</label>
    <textarea name="text" rows="3" placeholder="Sản phẩm dùng tốt..."></textarea>
    <button type="submit">Gửi đánh giá</button>
  </form>
  ${reviewItems}
</div>

<p style="margin-top:28px"><a class="back-link" href="/compare#${p.id},2,3">So sánh sản phẩm này với sản phẩm khác →</a></p>`;
  return layout({ title: `${p.name} - ShopVN`, body, points });
}

function cartPage({ points, cartItems }) {
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const rows = cartItems.map(i => `<div class="cart-row"><span>${i.emoji} ${i.name} x${i.qty}</span><span>${formatVND(i.price * i.qty)}</span></div>`).join('');
  const body = `
<a class="back-link" href="/">&larr; Trang chủ</a>
<h1>Giỏ hàng của bạn</h1>
<div class="panel">
  ${rows}
  <div class="cart-total"><span>Tổng cộng</span><span>${formatVND(total)}</span></div>
  <button onclick="alert('Demo - chưa tích hợp thanh toán thật')">Thanh toán</button>
</div>

<h2 class="section-title">Đổi điểm thưởng lấy mã giảm giá</h2>
<div class="panel">
  <p class="desc">Bạn đang có <b>${points}</b> điểm thưởng. Đổi điểm để lấy mã giảm giá gửi tặng bạn bè.</p>
  <form method="POST" action="/redeem">
    <label>Gửi mã giảm giá đến email:</label>
    <input type="text" name="to" value="friend@example.com">
    <label>Số điểm muốn đổi:</label>
    <input type="number" name="amount" value="100">
    <button type="submit">Đổi điểm</button>
  </form>
</div>

<h2 class="section-title">Đồng bộ giỏ hàng qua app di động</h2>
<div class="panel">
  <p class="desc">App di động ShopVN gọi API dưới đây để đồng bộ giỏ hàng + điểm thưởng của bạn.</p>
  <button onclick="callCartApi()">Gọi thử /api/cart</button>
  <pre id="cart-api-out">(kết quả sẽ hiện ở đây)</pre>
</div>
<script>
async function callCartApi() {
  const r = await fetch('/api/cart', { credentials: 'include' });
  document.getElementById('cart-api-out').textContent = await r.text();
}
</script>`;
  return layout({ title: 'Giỏ hàng - ShopVN', body, points });
}

function comparePage({ points }) {
  const body = `
<a class="back-link" href="/">&larr; Trang chủ</a>
<h1>So sánh sản phẩm</h1>
<p class="desc">Dán link so sánh bạn bè gửi (dạng <code>/compare#id1,id2,...</code>) để xem bảng so sánh được render tự động.</p>
<div class="panel">
  <div id="compare-output">Đang tải so sánh từ link...</div>
</div>
<script>
const DB = ${JSON.stringify(products)};
function renderCompare() {
  const ids = decodeURIComponent(location.hash.slice(1)).split(',').map(s => s.trim()).filter(Boolean);
  if (!ids.length) { document.getElementById('compare-output').textContent = 'Chưa có sản phẩm nào để so sánh.'; return; }
  let html = '<table style="width:100%;border-collapse:collapse">';
  html += '<tr><th>ID</th><th>Sản phẩm</th></tr>';
  for (const id of ids) {
    const p = DB.find(x => String(x.id) === id);
    const label = p ? (p.emoji + ' ' + p.name) : id; // id lạ sẽ in thẳng ra
    html += '<tr><td style="padding:6px;border-bottom:1px solid #eee">' + id + '</td><td style="padding:6px;border-bottom:1px solid #eee">' + label + '</td></tr>';
  }
  html += '</table>';
  document.getElementById('compare-output').innerHTML = html;
}
window.addEventListener('hashchange', renderCompare);
window.addEventListener('load', renderCompare);
</script>`;
  return layout({ title: 'So sánh sản phẩm - ShopVN', body, points });
}

module.exports = { layout, homePage, searchPage, productPage, cartPage, comparePage };
