// /pages/api/verify-otp.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST allowed' });
    }
  
    const { inputotp } = req.body;
  
    // OTP & AppNo should ideally be stored in a database or Redis; here we use cookies or temp values for session emulation
    const sessionOtp = req.cookies?.otp; // Requires setting cookie on client when OTP is sent
    const appno = req.cookies?.Appno;
  
    if (!sessionOtp || !appno) {
      return res.status(400).json({ error: 'Session expired or invalid' });
    }
  
    if (inputotp === sessionOtp) {
      const datapara = {
        applicant: {
          application_no: appno,
          is_verified: true,
        },
        user: process.env.API_USER,
        key: process.env.API_KEY,
      };

      
      const payload = {
        method: 'update_otp_verfied',
        input_type: 'JSON',
        response_type: 'JSON',
        rest_data: JSON.stringify(datapara),
      };
  
      try {
        const response = await fetch(process.env.OTP_VERIFY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        const result = await response.json();
  
        const redirectUrl = `https://apply.smvec.ac.in/application?id=${result}`;
        return res.status(200).json({ redirectUrl });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to verify OTP', detail: error.message });
      }
    } else {
      return res.status(200).json({ error: 'Invalid OTP', code: 2 });
    }
  }
  