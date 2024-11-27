import svgCaptcha from "svg-captcha";

const generate = () => {
    const captcha = svgCaptcha.create({
        size: 6,
        noise: 3,
        color: true,
        background: '#ffffff',
    });

    console.log('Generated CAPTCHA:', captcha.text);

    return { image: captcha.data, text: captcha.text };
};

export const generateSvgCaptcha = (req, res) => {
    const { image, text } = generate();

    // Store CAPTCHA text in session
    req.session.captchaText = text;

    res.type("svg");
    res.status(200).send(image);
};

export const verifySvgCaptcha = (req, res) => {
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
