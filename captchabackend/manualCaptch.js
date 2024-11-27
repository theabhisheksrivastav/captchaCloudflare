const generateSimpleCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const captchaText = Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');

    const svg = `
        <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="100" fill="white" />
            <text x="50" y="70" font-size="40" font-family="Arial" fill="black">${captchaText}</text>
        </svg>
    `;

    console.log('Generated CAPTCHA:', captchaText);

    return { image: svg, text: captchaText };
};

export const generateManualCaptcha = (req, res) => {
    const { image, text } = generateSimpleCaptcha();

    // Store CAPTCHA text in session
    req.session.captchaText = text;

    res.type("svg");
    res.status(200).send(image);
};

export const verifyManualCaptcha = (req, res) => {
    const { captchaInput } = req.body;

    const storedCaptcha = req.session.captchaText;

    if (!storedCaptcha) {
        return res.status(400).json({ success: false, message: "No CAPTCHA generated" });
    }

    if (captchaInput === storedCaptcha) {
        req.session.captchaText = null; // Clear CAPTCHA after verification
        return res.status(200).json({ success: true, message: "CAPTCHA verified successfully" });
    } else {
        return res.status(400).json({ success: false, message: "CAPTCHA verification failed" });
    }
};
