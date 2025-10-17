// pages/api/status.js
const allowedOrigins = [
  'https://agri.smvec.ac.in',
  'https://lawcollege.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://arts.smvec.ac.in',
  'https://law.smvec.ac.in',
  'https://medscience.smvec.ac.in/',
];

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Custom logic
  const condition =  true;

  if (condition) {
    return res.status(200).json({
      status: condition,
      img: 'https://res.cloudinary.com/dahwq2a3k/image/upload/v1758606275/standiee_ubpect.webp',
    });
  } else {
    return res.status(200).json({
      status: false,
    });
  }
}
