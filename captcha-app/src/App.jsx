import { useState, useEffect, useRef } from "react";

const App = () => {
  const [captchaToken, setCaptchaToken] = useState("");
  const [message, setMessage] = useState("");
  const captchaRef = useRef(null); // Ref for the CAPTCHA container

  useEffect(() => {
    if (captchaRef.current) {
      // Dynamically render the Turnstile widget
      window.turnstile.render(captchaRef.current, {
        sitekey: "0x4AAAAAAA06BQycwfDQvE7T",
        callback: (token) => setCaptchaToken(token), // Set token on callback
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setMessage("Please complete the CAPTCHA.");
      return;
    }

    try {
      const response = await fetch("http://localhost:2000/api/verify-captcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaToken }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("CAPTCHA verified successfully!");
      } else {
        setMessage("CAPTCHA verification failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred during verification.");
    }
  };

  return (
    <div className="App" style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Cloudflare CAPTCHA Verification</h1>
      <form onSubmit={handleSubmit}>
        {/* CAPTCHA container */}
        <div ref={captchaRef}></div>
        <button type="submit" style={{ marginTop: "20px" }}>
          Verify
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default App;
