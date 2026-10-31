require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 5500);
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!CLIENT_ID || !process.env.SESSION_SECRET) {
  console.error('Missing GOOGLE_CLIENT_ID or SESSION_SECRET. Copy .env.example to .env and fill it in.');
  process.exit(1);
}
const googleClient = new OAuth2Client(CLIENT_ID);
app.use(express.json({ limit: '20kb' }));
app.use(session({
  name: 'dayform.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.post('/auth/google', async (req, res) => {
  try {
    const credential = req.body && req.body.credential;
    if (typeof credential !== 'string') return res.status(400).json({ error: 'Missing Google credential.' });
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: CLIENT_ID });
    const p = ticket.getPayload();
    if (!p || !p.sub || !p.email || !p.email_verified) return res.status(401).json({ error: 'Google did not return a verified account.' });
    req.session.user = { id: p.sub, email: p.email, name: p.name || p.email, picture: p.picture || null };
    res.json({ user: req.session.user });
  } catch (err) {
    console.error('Google token verification failed:', err.message);
    res.status(401).json({ error: 'Google sign-in could not be verified. Check your Client ID and OAuth setup.' });
  }
});
app.get('/auth/me', (req, res) => res.json({ user: req.session.user || null }));
app.post('/auth/logout', (req, res) => req.session.destroy(() => { res.clearCookie('dayform.sid'); res.json({ ok: true }); }));
app.use(express.static(path.join(__dirname)));
app.listen(PORT, () => console.log(`Dayform is running at http://localhost:${PORT}`));
