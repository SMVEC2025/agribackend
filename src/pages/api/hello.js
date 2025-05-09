// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}




async function sendOtp(mobile_number) {
  const url = 'https://application.smvec.ac.in/custom/service/v4_1_custom/rest.php';

  const data = {
    method: 'send_otp',
    input_type: 'JSON',
    response_type: 'JSON',
    rest_data: JSON.stringify({
      mobile_number,
      user: 'Admission_Enquiry',
      key: 'WojY3p37$%s852'
    })
  };

  try {
    const response = await axios.post(url, new URLSearchParams(data));

    // Optional: save OTP to memory (like PHP $_SESSION)
    const returnedOtp = response.data;
  } catch (error) {
    console.error('Error sending OTP:', error.response ? error.response.data : error.message);
  }
}

// C