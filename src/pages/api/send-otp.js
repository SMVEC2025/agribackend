import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers
const allowedOrigins = [
  'https://agri.smvec.ac.in',
  'https://lawcollege.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://arts.smvec.ac.in',
  'https://law.smvec.ac.in',

];

const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { mobile_number } = req.body;

  const url = 'https://application.smvec.ac.in/custom/service/v4_1_custom/rest.php';
  const data = {
    method: 'send_otp',
    input_type: 'JSON',
    response_type: 'JSON',
    rest_data: JSON.stringify({
      mobile_number,
      user: process.env.API_USER,
      key: process.env.API_KEY
    })
  };

  try {
    const response = await axios.post(url, new URLSearchParams(data));
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP', details: err.message });
  }
}
