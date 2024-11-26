import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

app.use(bodyParser.json());
app.use(cors());

// Endpoint to verify Turnstile CAPTCHA
app.post("/api/verify-captcha", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "CAPTCHA token is required" });
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      res.status(200).json({ success: true, message: "CAPTCHA verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "CAPTCHA verification failed", error: data["error-codes"] });
    }
  } catch (error) {
    console.error("Error verifying CAPTCHA:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
