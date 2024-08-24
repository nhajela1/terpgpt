import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; 

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message }: ContactFormData = await req.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Set up Nodemailer transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password here
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USERNAME, // Use the authenticated email address
      to: "info.kardsai@gmail.com", // Send to your company email
      replyTo: email, // Set reply-to as the user's email
      subject: `New Contact Form Submission: ${name}`,
      text: `
        Name: ${name}
        From: ${email}
        Message: ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Error sending email', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}