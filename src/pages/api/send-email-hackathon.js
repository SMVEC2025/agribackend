import nodemailer from 'nodemailer';

// IMPORTANT: Ensure you have these environment variables set in your .env.local file:
// SMTP_USER="your-email@gmail.com"
// SMTP_PASS="your-app-password" (use an App Password for services like Gmail)

// --- CORS Configuration ---
const allowedOrigins = [
    'https://agri.smvec.ac.in',
    'https://lawcollege.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:5174', // <-- Added to support running frontend on this port
    'http://localhost:5174', // <-- Added to support running frontend on this port
    'https://arts.smvec.ac.in',
    'https://aiignite.smvec.ac.in',
    'https://law.smvec.ac.in',
    'https://medscience.smvec.ac.in',
    'https://physiotherapy.smvec.ac.in',
];

// --- Nodemailer Transporter Setup ---
// The transporter is created using server-side environment variables.
const transporter = nodemailer.createTransport({
    // Using Gmail is common, but you can change 'service' or use 'host' and 'port'
    // for other SMTP providers.
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER, // Your sender email from .env.local
        pass: process.env.SMTP_PASS, // Your App Password/key from .env.local
    },
});

/**
 * Generates the clean, responsive HTML content for the meeting invitation email.
 * @param {object} data - The meeting data object.
 * @returns {string} The HTML string for the email body.
 */
const generateMeetingEmailHtml = (data) => {
    // Format the date and time for better readability
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(data.slot_date).toLocaleDateString('en-US', dateOptions);

    // Construct the subject for the email preview
    const subject = `Your  Meeting with ${data.mentor_name}`;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4; }
                .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
                .header { background-color: #0056b3; color: white; padding: 20px 25px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 25px; }
                .details-box { border: 1px solid #e0e0e0; border-left: 5px solid #4CAF50; padding: 15px; margin-top: 20px; border-radius: 4px; background-color: #f9f9f9; }
                .details-box p { margin: 0 0 10px 0; font-size: 16px; }
                .details-box strong { color: #0056b3; display: inline-block; width: 100px; }
                .button-container { text-align: center; margin: 30px 0; }
                .button {
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #4CAF50;
                    color: white !important; /* Critical for email client compatibility */
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    font-size: 16px;
                    transition: background-color 0.3s ease;
                }
                .footer { padding: 20px 25px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Meeting Invitation</h1>
                </div>
                <div class="content">
                    <p>Hello Team,</p>
                    <p>This is a confirmation of your scheduled meeting. We look forward to seeing you online.</p>
                    
                    <div class="details-box">
                        <p><strong>Topic:</strong> ${subject}</p>
                        <p><strong>Mentor:</strong> ${data.mentor_name}</p>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Time:</strong> ${data.start_time} - ${data.end_time} IST</p>
                    </div>

                    <div class="button-container">
                        <a href="${data.meet_url}" class="button" target="_blank">
                            Click Here to Join Meeting
                        </a>
                    </div>
                    
                    <p style="text-align: center; font-size: 14px; color: #555;">
                        Alternatively, copy and paste this link: <br>
                        <a href="${data.meet_url}" style="color: #0056b3; word-break: break-all;">${data.meet_url}</a>
                    </p>
                    
                </div>
                <div class="footer">
                    <p>This invitation was sent by your scheduling system.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};


export default async function handler(req, res) {
    const origin = req.headers.origin;

    // --- CORS Setup ---
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Ensure it's a POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    const data = req.body;

    // NEW: Log the incoming data for easier server-side debugging

    // --- Input Validation ---
    const requiredFields = ["emails", "meet_url", "mentor_name", "slot_date", "start_time", "end_time"];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0 || !Array.isArray(data.emails) || data.emails.length === 0) {
        // Log the exact validation failure on the server
        console.error("Validation failed. Missing fields:", missingFields.length > 0 ? missingFields : "Emails list is empty or not an array.");

        return res.status(400).json({
            status: 'error',
            message: 'Missing or invalid required fields in the request body.',
            missing: missingFields.length > 0 ? missingFields : "Emails list is empty or not an array."
        });
    }

    try {
        const htmlContent = generateMeetingEmailHtml(data);
        const recipientList = data.emails.join(', ');

        // --- Define Mail Options ---
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: recipientList,
            subject: `Meeting Scheduled:  with ${data.mentor_name}`,
            html: htmlContent,
            // Plain text fallback for non-HTML email clients
            text: `Meeting Invitation with ${data.mentor_name} on ${data.slot_date} at ${data.start_time}.\nJoin here: ${data.meet_url}`
        };

        // --- Send Email ---
        const info = await transporter.sendMail(mailOptions);


        return res.status(200).json({
            status: 'success',
            message: `Emails successfully sent to ${data.emails.length} recipient(s).`,
            messageId: info.messageId
        });

    } catch (error) {
        console.error("Error sending emails:", error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to send emails due to server error.',
            details: error.message
        });
    }
}