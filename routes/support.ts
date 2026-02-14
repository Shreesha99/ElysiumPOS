import { Router } from "express";
import { transporter } from "../utils/mailer";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!message || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await transporter.sendMail({
      from: `"Elysium Support" <${process.env.SMTP_USER}>`,
      to: "hello@the-elysium-project.in",
      replyTo: email,
      subject: `New Support Request from ${name || "User"}`,
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New Support Query</h2>
          <p><strong>Name:</strong> ${name || "Not provided"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p>${message}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ error: "Email failed to send" });
  }
});

export default router;
