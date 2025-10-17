import axios from 'axios';

export default async function handler(req, res) {
  // Set CORS headers
const allowedOrigins = [
  'https://agri.smvec.ac.in',
  'https://lawcollege.vercel.app',
  'http://localhost:5173',
  'https://arts.smvec.ac.in',
  'https://law.smvec.ac.in',
  'http://localhost:3000',
  'https://medscience.smvec.ac.in/',
  


];

const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
}  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const crmUrl = 'https://application.smvec.ac.in/custom/service/v4_1_custom/rest.php';
  const enquiryData = req.body;

  const postData = {
    method: 'submit_enquiry',
    input_type: 'JSON',
    response_type: 'JSON',
    rest_data: JSON.stringify({
    enquiry: {
      ...enquiryData,
      created_at: new Date(),
    },
    user: process.env.API_USER,
    key: process.env.API_KEY
  })
  };

  try {
    const response = await axios.post(crmUrl, new URLSearchParams(postData));
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Error forwarding to CRM:', err.message);
    res.status(500).json({ error: 'Failed to submit to CRM' });
  }
}
