import { 
  FaCamera, 
  FaUserCheck, 
  FaTrophy, 
  FaSmile,
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
          paddingTop: "4rem",
          paddingBottom: "4rem",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <motion.div {...fadeInUp}>
                <h1
                  className="display-3 fw-bold mb-4"
                  style={{ color: "#333", lineHeight: "1.2" }}
                >
                  Snap. Track. Share<br />
                  <span style={{ color: "#00C853" }}>Your Progress.</span>
                </h1>
                <p
                  className="lead mb-4"
                  style={{ color: "#666", fontSize: "1.1rem" }}
                >
                  We don't rely on AI for your well-being — real certified coaches guide you every step. Snap your meals, get instant macros, stay motivated, and celebrate your consistency by sharing streaks with friends and family.
                </p>
                <motion.button
                  className="btn btn-lg rounded-pill px-5 py-3"
                  style={{
                    backgroundColor: "#00C853",
                    color: "#fff",
                    border: "none",
                    minHeight: "52px",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                >
                  👉 Join Today & Snap Your First Meal
                </motion.button>
              </motion.div>
            </div>
            <div className="col-lg-6 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=500&fit=crop&q=80"
                    alt="Fitness Meal"
                    className="img-fluid rounded-4 shadow-lg"
                    style={{
                      maxHeight: "500px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <motion.div
                    className="position-absolute bg-white rounded-3 p-3 shadow"
                    style={{
                      top: "20px",
                      left: "-20px",
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <small className="text-muted d-block">Streak</small>
                    <strong style={{ color: "#00C853", fontSize: "1.2rem" }}>
                      🔥 7 Days
                    </strong>
                  </motion.div>
                  <motion.div
                    className="position-absolute bg-white rounded-3 p-3 shadow"
                    style={{
                      bottom: "20px",
                      right: "-20px",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <small className="text-muted d-block">Macros</small>
                    <strong style={{ color: "#00C853", fontSize: "1.2rem" }}>
                      ✓ Tracked
                    </strong>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Clients Love Us Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-5"
            style={{ fontSize: "2.5rem", color: "#333" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Clients Love Us
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
                title: "📸 Snap & Upload Meals",
                desc: "Just take a picture — get instant macro feedback, no guesswork.",
                icon: FaCamera,
              },
              {
                title: "🎯 Stay Accountable",
                desc: "Your coach checks in daily to keep you on track.",
                icon: FaUserCheck,
              },
              {
                title: "🏆 Share Your Streaks",
                desc: "Celebrate wins by posting streaks on social media, inspiring your friends (and yourself).",
                icon: FaTrophy,
              },
              {
                title: "🎉 Make Fitness Fun",
                desc: "Daily motivation, achievable goals, and social recognition keep you consistent.",
                icon: FaSmile,
              },
            ].map((feature, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <motion.div
                  className="card border-0 shadow-sm h-100 text-center p-4"
                  style={{ borderRadius: "1rem" }}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon
                    className="mx-auto mb-3"
                    size={48}
                    style={{ color: "#00C853" }}
                  />
                  <h5 className="fw-bold mb-3" style={{ color: "#333" }}>
                    {feature.title}
                  </h5>
                  <p className="text-muted mb-0">{feature.desc}</p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <div className="container">
          <motion.h2
            className="text-center fw-bold mb-5"
            style={{ fontSize: "2.5rem", color: "#333" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
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
                step: "1",
                title: "Snap Your Meal",
                desc: "Upload and get real-time macro feedback.",
              },
              {
                step: "2",
                title: "Coach Keeps You On Track",
                desc: "Stay accountable with daily nudges and motivation.",
              },
              {
                step: "3",
                title: "Celebrate Your Streaks",
                desc: "Share progress on social and keep winning every day.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="col-md-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="card border-0 shadow-sm text-center h-100 p-4 rounded-4">
                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#00C853",
                      color: "#fff",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {step.step}
                  </div>
                  <h5 className="fw-bold text-dark mb-3">{step.title}</h5>
                  <p className="text-muted">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container text-center">
          <motion.h2
            className="text-center fw-bold mb-5"
            style={{ fontSize: "2.5rem", color: "#333" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What Our Clients Say
          </motion.h2>
          <motion.div
            className="mx-auto"
            style={{ maxWidth: "700px" }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="card border-0 shadow-lg rounded-4 p-5">
              <p
                className="text-muted fst-italic mb-4"
                style={{ fontSize: "1.1rem" }}
              >
                🗨️ "I love sharing my streaks! My friends cheer me on, and my coach keeps me consistent — fitness finally feels fun."
              </p>
              <p className="fw-bold text-dark mb-0">— Happy Client</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-5">
        <div className="container text-center">
          <motion.h2
            className="fw-bold mb-4"
            style={{ fontSize: "2.5rem", color: "#333" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Start Your Fitness Journey, One Snap at a Time.
          </motion.h2>
          <motion.button
            className="btn btn-lg rounded-pill px-5 py-3"
            style={{
              backgroundColor: "#00C853",
              color: "#fff",
              border: "none",
              minHeight: "52px",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
          >
            👉 Show Off Your Fitness Wins Now
          </motion.button>
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