const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// ใช้ Gmail หรือ SMTP ของคุณ
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "porfaisuwanpadit@gmail.com", // ใส่อีเมลจริง
    pass: "ahhi bidu lztp qiqs",
    // ใช้ App Password (ไม่ใช่รหัสผ่าน Gmail ปกติ)
  },
});

exports.sendOtpToEmail = functions.https.onCall(async (data, context) => {
  const {email, otp} = data;

  const mailOptions = {
    from: "your_email@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {success: true};
  } catch (error) {
    console.error("Error sending email:", error);
    return {success: false, error: error.message};
  }
});
