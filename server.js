const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { products } = require('./data');
const { homePage, searchPage, productPage, cartPage, comparePage } = require('./views');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const accounts = {};
const reviewsByProduct = {
  1: [{ name: 'Minh', stars: 5, text: 'Màn hình gập đẹp, mượt mà!' }],
  2: [{ name: 'Lan', stars: 4, text: 'Pin trâu, máy nhẹ.' }],
};
const cartDemo = [
  { emoji: '🎧', name: 'Tai nghe NoiseCancel Pro', price: 4590000, qty: 1 },
  { emoji: '⌚', name: 'Watch Series X', price: 9990000, qty: 1 },
];

app.use((req, res, next) => {
  let sid = req.cookies.sid;
  if (!sid) {
    sid = crypto.randomBytes(8).toString('hex');
    accounts[sid] = { points: 500 };
    res.cookie('sid', sid, { httpOnly: false });
  }
  if (!accounts[sid]) accounts[sid] = { points: 500 };
  req.sid = sid;
  next();
});

app.get('/', (req, res) => {
  res.send(homePage({ points: accounts[req.sid].points }));
});

app.get('/search', (req, res) => {
  const q = req.query.q || '';
  const results = products.filter(p =>
    p.name.toLowerCase().includes(String(q).toLowerCase())
  );
  res.send(searchPage({ q, results, points: accounts[req.sid].points }));
});

app.get('/product/:id', (req, res) => {
  const p = products.find(x => x.id === Number(req.params.id));
  if (!p) return res.status(404).send('Không tìm thấy sản phẩm');
  const previewHtml = req.query.preview || '';
  const reviews = reviewsByProduct[p.id] || [];
  res.send(productPage({ p, reviews, points: accounts[req.sid].points, previewHtml }));
});

app.post('/product/:id/review', (req, res) => {
  const id = Number(req.params.id);
  if (!reviewsByProduct[id]) reviewsByProduct[id] = [];
  const { name, stars, text } = req.body;
  reviewsByProduct[id].push({
    name: name || 'Ẩn danh',
    stars: Math.min(5, Math.max(1, parseInt(stars, 10) || 5)),
    text: text || '',
  });
  res.redirect('/product/' + id);
});

app.get('/compare', (req, res) => {
  res.send(comparePage({ points: accounts[req.sid].points }));
});

app.get('/cart', (req, res) => {
  res.send(cartPage({ points: accounts[req.sid].points, cartItems: cartDemo }));
});

app.post('/redeem', (req, res) => {
  const amount = parseInt(req.body.amount, 10) || 0;
  accounts[req.sid].points -= amount;
  res.redirect('/cart');
});

app.get('/api/cart', (req, res) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.json({
    sid: req.sid,
    points: accounts[req.sid].points,
    cart: cartDemo,
  });
});

app.listen(PORT, () => {
  console.log(`ShopVN chạy tại http://localhost:${PORT}`);
});
