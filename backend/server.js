

import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
const __dirname = path.resolve();


dotenv.config({ path: path.join(__dirname, '.env') }); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail', // This is the magic part! It sets host, port, and security for you.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  
    }
});

app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // A cleaner HTML template for the email
  const mailOptions = {
    from: `"Diell Contact Form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `
      <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333;">New Message from Your Website</h2>
        <hr>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <h3 style="color: #555; margin-top: 20px;">Message:</h3>
        <p style="background-color: #f7f7f7; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${message}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Signal Transmitted. We will be in touch soon.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email. The signal was lost.' });
  }
});

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));


    app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

app.listen(PORT, () => {
});