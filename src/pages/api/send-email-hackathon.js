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
    // Format the date for the display card (e.g., DEC 10)
    const dateObj = new Date(data.slot_date);
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
    const formattedDateFull = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    // Construct the subject for the email preview
    const subject = `Your Meeting Scheduled on ${data.slot_date} with ${data.mentor_name}`;
    const timeRange = `${data.start_time} – ${data.end_time} IST`;


    return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
                /* Universal Reset and Base Styles */
                body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                a { color: #007bff; text-decoration: none; }
                
                /* Main Container Styles (The Card) */
                .email-container { 
                    max-width: 600px; 
                    margin: 30px auto; 
                    background-color: #ffffff; 
                    border-radius: 12px; 
                    overflow: hidden; 
                    /* Existing mild shadow */
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); 
                    border: 1px solid #e0e0e0; /* Added a mild border */
                }
                
                /* Gradient Top Bar (REMOVED) */
                
                /* Text Content Padding and Alignment */
                .content { 
                    padding: 30px; 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                    font-size: 16px; 
                    line-height: 1.6; 
                    color: #333333; 
                    text-align: left; /* Explicitly set text alignment to left */
                }
                .content p { 
                    margin-top: 0; 
                    margin-bottom: 20px; 
                    text-align: left; /* Ensure paragraphs are left-aligned */
                }
                
                /* Event Details Block */
                .event-card {
                    padding: 20px;
                    background-color: #f7f7f7;
                    border-radius: 8px;
                    margin: 25px 0;
                    border: 1px solid #e0e0e0;
                }
                
                /* Date Box Styling */
                .date-box {
                    background-color: #166358; /* Color from user input */
                    color: white;
                    padding: 4px 0;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    line-height: 1;
                    margin-bottom: 4px;
                }
                .day-number { font-size: 28px; font-weight: 800; line-height: 1; }
                
                /* Event Info Text */
                .event-title { font-size: 18px; font-weight: bold; color: #1a1a1a; margin: 0 0 5px 0; }
                .event-duration { font-size: 14px; color: #666; margin: 0; }
                
                /* Time Row Text */
                .time-text {
                    color: #555555;
                    font-size: 14px;
                }
                
                /* Button Styles (Applied via inline CSS for max compatibility) */
                .button-td {
                    border-radius: 8px; 
                    background-color: #166358; 
                    box-shadow: 0 4px 10px rgba(25, 60, 124, 0.2);
                }
                .button-link {
                    padding: 15px 35px;
                    color: white !important;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 16px;
                    display: block; /* Important for MSO clients */
                }

                .footer { 
                    padding: 0 30px 30px 30px; 
                    text-align: center; 
                    font-size: 12px; 
                    color: #999999; 
                }
                
            </style>
        </head>
        <body>
            <!-- Main Wrapper Table for Centering -->
            <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;">
                <tr>
                    <td align="center" valign="top">
                        <div class="email-container">
                            
                            <!-- 1. Gradient Top Bar (REMOVED) -->
                            
                            <!-- 2. Main Content Area -->
                            <div class="content">
                                
                                <p>Hey Participants,</p>
                                
                                <p>Your One to one Mentors session is successfully scheduled! We look forward to diving into your project's 
                                    progress during the mentorship slot. Prepare your questions and updates to **maximize the value of this 
                                    meeting**.</p>
                                
                                <p>Join for a virtual session on how you can **accelerate your project and receive actionable feedback**. 
                                    Please review the details below.</p>
                                
                                <!-- 3. Event Details Block (Table-Based Layout) -->
                                <div class="event-card">
                                    
                                    <!-- Event Header - Date and Title/Mentor -->
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <!-- Date Column -->
                                            <td width="70" valign="top" style="text-align: center; padding-right: 15px;">
                                                <div class="date-box">${month}</div>
                                                <div class="day-number">${day}</div>
                                            </td>
                                            <!-- Info Column -->
                                            <td valign="top">
                                                <!-- The original event-title was removed, but I'll add a concise one here for structure -->
                                                <p class="event-title" style="margin: 0 0 5px 0;">Mentorship Session: ${data.team_name} Planning</p>
                                                <p class="event-duration" style="margin: 0;">with ${data.mentor_name}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Time and Location Row (Table-Based Layout) -->
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 15px;">
                                        <tr>
                                            <!-- Icon Column -->
                                            <td width="30" valign="top" style="padding-right: 5px;">
                                                <!-- Unicode Clock Icon (Common in emails) -->
                                                <span class="time-text">&#x23F1;</span>
                                            </td>
                                            <!-- Time Text Column -->
                                            <td valign="top">
                                                <p class="time-text" style="margin: 0;">
                                                    ${formattedDateFull}, ${timeRange}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- 4. Button (Robust Table-Based Centering) -->
                                <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                                    <tr>
                                        <td class="button-td" align="center">
                                            <!-- Button Link Anchor -->
                                            <a href="${data.meet_url}" target="_blank" class="button-link" style="padding: 15px 35px; color: white; text-decoration: none; font-weight: bold; font-size: 16px; display: block;">
                                                <!-- Inner table for image/text alignment -->
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                                    <tr>
                                                        <!-- Image Cell -->
                                                        <td style="padding-right: 10px;">
                                                            <img style="width: 20px; height: auto; display: block;" 
                                                                src="https://res.cloudinary.com/dahwq2a3k/image/upload/v1763609429/meet_oha6ev.png" 
                                                                alt="Meet Icon" 
                                                                width="20" />
                                                        </td>
                                                        <!-- Text Cell -->
                                                        <td style="color: white; font-weight: bold; font-size: 16px; line-height: 1;">
                                                            Join My Session
                                                        </td>
                                                    </tr>
                                                </table>
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                
                                <!-- Alternative link text -->
                                <p style="text-align: center; font-size: 14px; color: #555; margin-bottom: 10px;">
                                    Alternatively, copy and paste this link: 
                                </p>
                                <p style="text-align: center; font-size: 14px; margin-bottom: 0;">
                                    <a href="${data.meet_url}" style="color: #0056b3; word-break: break-all;">${data.meet_url}</a>
                                </p>

                            </div>
                            
                            <!-- 5. Footer -->
                            <div class="footer">
                                <p>This is an automated meeting confirmation. Please do not reply.</p>
                            </div>
                            
                        </div>
                    </td>
                </tr>
            </table>
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
            from: `AIIGNITE - ${process.env.SMTP_USER}`,
            to: recipientList,
            subject: `Meeting Scheduled with ${data.mentor_name}`,
            html: htmlContent,
            // Plain text fallback for non-HTML email clients
            text: `Meeting Invitation  with ${data.mentor_name} on ${data.slot_date} at ${data.start_time}.\nJoin here: ${data.meet_url}`
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