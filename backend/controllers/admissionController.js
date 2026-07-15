const Admission = require("../models/Admission");
const nodemailer = require("nodemailer");

// Nodemailer Transporter Setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Create a new Admission Lead
exports.createAdmission = async (req, res) => {
  try {
    const { name, phone, whatsapp, course, shift } = req.body;

    if (!name || !phone || !whatsapp || !course || !shift) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // Save to Database
    const newAdmission = new Admission({
      name,
      phone,
      whatsapp,
      course,
      shift,
    });

    const savedAdmission = await newAdmission.save();

    // Try sending email notification
    try {
      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.EMAIL_USER || "your_email@gmail.com",
        to: process.env.EMAIL_TO || "jmsmodernclasses@gmail.com",
        subject: `New Admission Inquiry - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2b857; border-radius: 10px; background-color: #040814; color: #f3f4f6;">
            <h2 style="color: #e2b857; text-align: center; border-bottom: 2px solid #e2b857; padding-bottom: 10px;">JMS Admission Lead Alert</h2>
            <p>Hello Admin,</p>
            <p>A new student has submitted an admission request from the website. Here are the details:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="border-bottom: 1px solid rgba(226, 184, 87, 0.15);">
                <td style="padding: 10px; font-weight: bold; color: #e2b857; width: 35%;">Student Name:</td>
                <td style="padding: 10px; color: #f3f4f6;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(226, 184, 87, 0.15);">
                <td style="padding: 10px; font-weight: bold; color: #e2b857;">Phone Number:</td>
                <td style="padding: 10px; color: #f3f4f6;"><a href="tel:${phone}" style="color: #f5d68b; text-decoration: none;">${phone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(226, 184, 87, 0.15);">
                <td style="padding: 10px; font-weight: bold; color: #e2b857;">WhatsApp:</td>
                <td style="padding: 10px; color: #f3f4f6;"><a href="https://wa.me/91${whatsapp}" style="color: #f5d68b; text-decoration: none;">${whatsapp} (Chat Now)</a></td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(226, 184, 87, 0.15);">
                <td style="padding: 10px; font-weight: bold; color: #e2b857;">Course/Class:</td>
                <td style="padding: 10px; color: #f3f4f6;">${course}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(226, 184, 87, 0.15);">
                <td style="padding: 10px; font-weight: bold; color: #e2b857;">Library Shift:</td>
                <td style="padding: 10px; color: #f3f4f6;">${shift}</td>
              </tr>
            </table>
            <div style="text-align: center; margin-top: 25px;">
              <a href="https://wa.me/91${whatsapp}?text=Hello%20${encodeURIComponent(name)}%2C%20this%20is%20JMS%20Modern%20Classes%20answering%20your%20admission%20enquiry..." 
                 style="background-color: #e2b857; color: #040814; font-weight: bold; padding: 12px 25px; border-radius: 5px; text-decoration: none; display: inline-block;">
                 Reply on WhatsApp
              </a>
            </div>
            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 30px; border-top: 1px solid rgba(226, 184, 87, 0.1); padding-top: 10px;">
              &copy; JMS Modern Classes & Library Admin Alert System
            </p>
          </div>
        `,
      };

      // Only send if credentials are set
      if (process.env.EMAIL_USER && process.env.EMAIL_USER !== "your_email@gmail.com") {
        await transporter.sendMail(mailOptions);
        console.log(`Email notification sent successfully to admin for ${name}`);
      } else {
        console.log(`Nodemailer email skipped: Email credentials not configured in environment.`);
      }
    } catch (mailError) {
      // Log nodemailer fail, but don't fail the API response! Student details are already safe in DB.
      console.error("Nodemailer failed to send email alert:", mailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Admission inquiry submitted successfully!",
      data: savedAdmission,
    });
  } catch (error) {
    console.error("Create admission error:", error.message);
    res.status(500).json({ error: "Server error, failed to create admission request" });
  }
};
