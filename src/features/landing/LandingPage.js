import { 
  FaCamera, 
  FaFire,
  FaTrophy,
  FaComments,
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone,
  FaDownload,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import logo3 from "../../assets/images/logo3.jpeg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const checkIfInstalled = () => {
      return window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator.standalone === true) ||
        document.referrer.includes('android-app://');
    };

    if (checkIfInstalled()) {
      setShowInstallButton(false);
      return;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isSupportedPlatform = isMobile || isChrome || isEdge || isSafari || isFirefox;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const checkInstallability = () => {
      if (checkIfInstalled()) {
        setShowInstallButton(false);
        return;
      }

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration && isSupportedPlatform) {
            setShowInstallButton(true);
          }
        }).catch(() => {
          if (isSupportedPlatform && (isMobile || isSafari)) {
            setShowInstallButton(true);
          }
        });
      } else if (isSupportedPlatform && (isMobile || isSafari)) {
        setShowInstallButton(true);
      }
    };

    const timeoutId1 = setTimeout(checkInstallability, 500);
    const timeoutId2 = setTimeout(checkInstallability, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallButton(false);
      }
      setDeferredPrompt(null);
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isIOS) {
        alert('To install this app:\n1. Tap the Share button\n2. Select "Add to Home Screen"');
      } else if (isAndroid) {
        alert('To install this app, look for the "Add to Home Screen" option in your browser menu.');
      } else {
        alert('To install this app, look for the install icon in your browser\'s address bar.');
      }
    }
  };

  const handleSignInNavigation = () => navigate("/login");

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#ffffff" }}>
      {/* Header/Navigation Bar */}
      <nav
        className="navbar navbar-expand-lg navbar-light shadow-sm py-3 fixed-top"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
        }}
      >
        <div className="container">
          <Link
            className="navbar-brand fw-bold"
            to="/"
            style={{ fontSize: "1.5rem", color: "#000000" }}
          >
            <img
              src={logo3}
              alt="LevelGrit"
              style={{
                height: "40px",
                marginRight: "10px",
                borderRadius: "8px",
              }}
            />
            LevelGrit
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            style={{ minHeight: "44px", minWidth: "44px" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  style={{
                    color: "#333",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/about-us"
                  style={{
                    color: "#333",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/contact"
                  style={{
                    color: "#333",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Contact Us
                </Link>
              </li>
              <li className="nav-item ms-2">
                <button
                  className="btn rounded-pill px-4 fw-semibold me-2"
                  onClick={handleSignInNavigation}
                  style={{
                    backgroundColor: "transparent",
                    color: "#00C853",
                    border: "2px solid #00C853",
                  }}
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="py-5"
        style={{
          marginTop: "80px",
          paddingTop: "6rem",
          paddingBottom: "6rem",
          background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <motion.div {...fadeInUp}>
                <h1
                  className="display-2 fw-bold mb-4"
                  style={{ color: "#1a1a1a", lineHeight: "1.2" }}
                >
                  Stay Fit. Stay Consistent.<br />
                  <span style={{ color: "#00C853" }}>Have Fun Doing It.</span>
                </h1>
                <p
                  className="lead mb-4"
                  style={{ color: "#666", fontSize: "1.25rem", lineHeight: "1.6" }}
                >
                  Tracking your meals and progress was never this easy.
                  <br />
                  Just snap a photo of your meals — get instant calories & macros, and keep your streak alive for 32 days straight.
                </p>
                <motion.button
                  className="btn btn-lg rounded-pill px-5 py-3 fw-bold"
                  style={{
                    backgroundColor: "#00C853",
                    color: "#fff",
                    border: "none",
                    minHeight: "56px",
                    fontSize: "1.1rem",
                    boxShadow: "0 4px 15px rgba(0, 200, 83, 0.3)",
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(0, 200, 83, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                >
                  👉 Join the 32-Day Challenge Now
                </motion.button>
                <p className="mt-3 mb-0" style={{ color: "#888", fontSize: "0.95rem" }}>
                  <em>Fitness meets fun. Consistency made effortless.</em>
                </p>
              </motion.div>
            </div>
            <div className="col-lg-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=500&fit=crop&q=80"
                    alt="Fitness Meal Tracking"
                    className="img-fluid rounded-4 shadow-lg"
                    style={{
                      maxHeight: "550px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <motion.div
                    className="position-absolute bg-white rounded-4 p-4 shadow-lg"
                    style={{
                      top: "30px",
                      right: "-30px",
                      border: "3px solid #00C853",
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <FaFire size={24} style={{ color: "#FF6B35" }} />
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Current Streak</small>
                        <strong style={{ color: "#00C853", fontSize: "1.5rem" }}>
                          32 Days
                        </strong>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="position-absolute bg-white rounded-4 p-4 shadow-lg"
                    style={{
                      bottom: "30px",
                      left: "-30px",
                      border: "3px solid #00C853",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <FaCamera size={24} style={{ color: "#00C853" }} />
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Instant Macros</small>
                        <strong style={{ color: "#00C853", fontSize: "1.5rem" }}>
                          ✓ Tracked
                        </strong>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Let's be honest Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="fw-bold mb-4"
              style={{ fontSize: "2.5rem", color: "#1a1a1a" }}
            >
              Let's be honest —
            </h2>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm p-5 rounded-4" style={{ backgroundColor: "#fff" }}>
                  <p className="lead mb-3" style={{ color: "#555", fontSize: "1.2rem", lineHeight: "1.8" }}>
                    Diet plans are easy to start, but hard to follow.
                  </p>
                  <p className="mb-3" style={{ color: "#666", fontSize: "1.1rem", lineHeight: "1.8" }}>
                    Calls, spreadsheets, and reminders? <strong>Boring.</strong>
                    <br />
                    Tracking calories manually? <strong>Exhausting.</strong>
                    <br />
                    And staying consistent? <strong>The hardest part.</strong>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why You'll Love It Section */}
      <section className="py-5">
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-5"
            style={{ fontSize: "2.5rem", color: "#1a1a1a" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            💡 Why You'll Love It
          </motion.h2>
          <motion.div
            className="row g-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                emoji: "📸",
                title: "Snap & Track",
                desc: "Click a meal photo and get instant macros.",
                icon: FaCamera,
                color: "#00C853",
              },
              {
                emoji: "🔥",
                title: "Stay Consistent",
                desc: "Build daily streaks like Snapchat, not spreadsheets.",
                icon: FaFire,
                color: "#FF6B35",
              },
              {
                emoji: "🏆",
                title: "Brag Your Wins",
                desc: "Share your milestones on Instagram.",
                icon: FaTrophy,
                color: "#FFD700",
              },
              {
                emoji: "💬",
                title: "Chat with Your Coach",
                desc: "No boring calls or endless WhatsApp texts.",
                icon: FaComments,
                color: "#4A90E2",
              },
            ].map((feature, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <motion.div
                  className="card border-0 shadow-sm h-100 text-center p-4"
                  style={{ borderRadius: "1.5rem", transition: "all 0.3s ease" }}
                  whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3" style={{ fontSize: "3rem" }}>
                    {feature.emoji}
                  </div>
                  <feature.icon
                    className="mx-auto mb-3"
                    size={40}
                    style={{ color: feature.color }}
                  />
                  <h5 className="fw-bold mb-3" style={{ color: "#1a1a1a", fontSize: "1.2rem" }}>
                    {feature.title}
                  </h5>
                  <p className="text-muted mb-0" style={{ lineHeight: "1.6" }}>
                    {feature.desc}
                  </p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-5"
            style={{ fontSize: "2.5rem", color: "#1a1a1a" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            🚀 How It Works
          </motion.h2>
          <motion.div
            className="row justify-content-center g-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                step: "1️⃣",
                title: "Snap your meals.",
                desc: "Get instant calories & progress updates.",
              },
              {
                step: "2️⃣",
                title: "Keep your streak alive for 32 days.",
                desc: "Build consistency like never before.",
              },
              {
                step: "3️⃣",
                title: "Share your transformation & inspire others.",
                desc: "Celebrate your wins and motivate your community.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="col-md-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="card border-0 shadow-sm text-center h-100 p-5 rounded-4" style={{ backgroundColor: "#fff" }}>
                  <div
                    className="mb-4"
                    style={{
                      fontSize: "3rem",
                    }}
                  >
                    {step.step}
                  </div>
                  <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1.3rem" }}>
                    {step.title}
                  </h5>
                  <p className="text-muted" style={{ lineHeight: "1.6" }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5">
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-5"
            style={{ fontSize: "2.5rem", color: "#1a1a1a" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            💬 Users Love It
          </motion.h2>
          <motion.div
            className="row g-4 justify-content-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="col-md-5">
              <motion.div
                className="card border-0 shadow-lg rounded-4 p-4 h-100"
                style={{ backgroundColor: "#fff" }}
                whileHover={{ y: -5 }}
              >
                <p
                  className="text-muted fst-italic mb-3"
                  style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
                >
                  "It's like Snapchat streaks but for fitness — I've never missed a meal log!"
                </p>
                <p className="fw-bold text-dark mb-0">— Sneha, 28</p>
              </motion.div>
            </div>
            <div className="col-md-5">
              <motion.div
                className="card border-0 shadow-lg rounded-4 p-4 h-100"
                style={{ backgroundColor: "#fff" }}
                whileHover={{ y: -5 }}
              >
                <p
                  className="text-muted fst-italic mb-3"
                  style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
                >
                  "No typing, no tracking — just click and done."
                </p>
                <p className="fw-bold text-dark mb-0">— Rohit, 31</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-5" style={{ 
        background: "linear-gradient(135deg, #00C853 0%, #00a844 100%)",
        color: "#fff"
      }}>
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="fw-bold mb-3"
              style={{ fontSize: "3rem", color: "#fff" }}
            >
              Make Fitness Fun Again.
            </h2>
            <p
              className="lead mb-4"
              style={{ fontSize: "1.5rem", color: "rgba(255,255,255,0.95)" }}
            >
              Snap. Track. Share. Transform.
            </p>
            <motion.button
              className="btn btn-lg rounded-pill px-5 py-3 fw-bold"
              style={{
                backgroundColor: "#fff",
                color: "#00C853",
                border: "none",
                minHeight: "56px",
                fontSize: "1.1rem",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
            >
              👉 Join the 32-Day Challenge
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* PWA Install Button - Floating */}
      {showInstallButton && (
        <motion.button
          className="position-fixed shadow-lg rounded-pill d-flex align-items-center gap-2 px-4 py-3"
          style={{
            bottom: "20px",
            right: "20px",
            zIndex: 1050,
            minHeight: "56px",
            backgroundColor: "#00C853",
            border: "none",
            color: "#fff",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={handleInstallClick}
          whileHover={{ scale: 1.05 }}
        >
          <FaDownload size={20} />
          <span className="fw-semibold">Install App</span>
        </motion.button>
      )}

      {/* Footer */}
      <footer className="bg-dark text-white pt-5 pb-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3">
              <h5 className="fw-bold mb-3">LevelGrit</h5>
              <p className="text-muted mb-3">
                123 Fitness Street
                <br />
                Health City, HC 12345
              </p>
              <div className="d-flex gap-3 mb-3">
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                >
                  <FaFacebook
                    size={24}
                    style={{ cursor: "pointer", color: "#fff" }}
                  />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                >
                  <FaInstagram
                    size={24}
                    style={{ cursor: "pointer", color: "#fff" }}
                  />
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                >
                  <FaLinkedin
                    size={24}
                    style={{ cursor: "pointer", color: "#fff" }}
                  />
                </motion.a>
              </div>
              <p className="text-muted mb-2">
                <FaEnvelope className="me-2" />
                info@levelgrit.com
              </p>
              <p className="text-muted">
                <FaPhone className="me-2" />
                +1 (555) 123-4567
              </p>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Company</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link
                    to="/about-us"
                    className="text-white-50 text-decoration-none"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Resources</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link
                    to="/privacy-policy"
                    className="text-white-50 text-decoration-none"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/terms-conditions"
                    className="text-white-50 text-decoration-none"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/contact"
                    className="text-white-50 text-decoration-none"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h6 className="fw-bold mb-3">Legal</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link
                    to="/cancellation-policy"
                    className="text-white-50 text-decoration-none"
                  >
                    Cancellation Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <hr className="my-4" style={{ borderColor: "#444" }} />
          <div className="text-center text-muted">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} LevelGrit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
