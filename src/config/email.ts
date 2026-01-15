import nodemailer from "nodemailer";

const {
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_HOST = "smtp.gmail.com",
  EMAIL_PORT = "587",
  EMAIL_SECURE = "false",
} = process.env;


if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error(
    "Missing email configuration: EMAIL_USER or EMAIL_PASS not set"
  );
}


export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT),
  secure: EMAIL_SECURE === "true",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
 
    rejectUnauthorized: true,
  },
});

(async () => {
  try {
    await transporter.verify();
    console.log("SMTP server is ready to send emails");
  } catch (error) {
    console.error(" SMTP verification failed:", error);
  }
})();


export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"No Reply" <${EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error("Failed to send email:", error.message);

    if (error.code === "EAUTH") {
      console.error(
        "Authentication failed. Check your Gmail App Password and 2FA settings."
      );
    }

    throw error;
  }
};
