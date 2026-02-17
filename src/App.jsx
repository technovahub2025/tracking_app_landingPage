import { useEffect, useRef, useState } from "react";
import employeeShiftImage from "./assets/images/employee-shift.jpg";
import supervisorMonitoringImage from "./assets/images/supervisor-monitoring.jpg";
import mobileCloudImage from "./assets/images/mobile-cloud.jpg";
import brandEaton from "./assets/brand/eaton.jpg";
import brandMeta from "./assets/brand/meta_PNG4.png";
import brandMgm from "./assets/brand/mgm.png";
import brandMrf from "./assets/brand/mrf.png";
import brandPolc from "./assets/brand/polc.png";
import brandRane from "./assets/brand/rane.png";
import brandSg from "./assets/brand/sg.jpg";
import brandSolara from "./assets/brand/solara.png";
import brandTvs from "./assets/brand/tvs.png";

const features = [
  {
    title: "Role-based Access",
    text: "Switch between User and Supervisor modes with dedicated interfaces for each role."
  },
  {
    title: "Live GPS Tracking",
    text: "Track active location updates with map view and clear online/offline indicators."
  },
  {
    title: "Secure Auth Flow",
    text: "Login and register with protected credentials and supervisor controls."
  },
  {
    title: "In-App Messaging",
    text: "Collect updates, quick reports, and user messages in a central inbox."
  },
  {
    title: "Cloud Camera Activity Logs",
    text: "After login, supervisors can view employee activities recorded through the mobile camera until logout, with secure cloud storage."
  }
];

const steps = [
  {
    count: "01",
    title: "Select role",
    text: "User or Supervisor access starts from a clean role picker."
  },
  {
    count: "02",
    title: "Sign in securely",
    text: "Quick login and registration with role-specific behavior."
  },
  {
    count: "03",
    title: "Track and communicate",
    text: "Use map tracking, user lists, and messaging to keep teams aligned."
  }
];

const showcaseImages = [
  {
    src: employeeShiftImage,
    title: "Employee Shift Activity",
    text: "Follow day-to-day employee tasks during active work shifts."
  },
  {
    src: supervisorMonitoringImage,
    title: "Supervisor Monitoring",
    text: "Supervisors can review live updates and employee progress clearly."
  },
  {
    src: mobileCloudImage,
    title: "Mobile Capture + Cloud",
    text: "Camera-recorded activity is saved securely to cloud from login to logout."
  }
];

const stats = [
  { value: 320, suffix: "+", label: "Active field users" },
  { value: 28, suffix: "", label: "Supervisor dashboards" },
  { value: 99, suffix: "%", label: "Location ping uptime" },
  { value: 12000, suffix: "+", label: "Secure cloud uploads/day" }
];

const testimonials = [
  {
    quote:
      "TrackPulse cut our shift follow-up calls in half. Supervisors can spot issues before they become delays.",
    name: "Nina S.",
    role: "Operations Lead"
  },
  {
    quote:
      "Role-specific views are clean and easy to teach. New staff were fully onboarded in less than one day.",
    name: "Karthik P.",
    role: "Regional Manager"
  },
  {
    quote:
      "The camera-to-cloud logs gave us audit clarity without forcing field teams into extra paperwork.",
    name: "Elijah R.",
    role: "Compliance Supervisor"
  }
];

const faqs = [
  {
    question: "Can we separate supervisor and employee permissions?",
    answer: "Yes. Roles are split by default, with dedicated navigation, data visibility, and login behavior."
  },
  {
    question: "How often does the GPS data update?",
    answer:
      "Location checks can run continuously during active sessions and sync automatically based on network quality."
  },
  {
    question: "Is camera activity stored securely?",
    answer:
      "Yes. Media logs are stored in protected cloud storage and can be reviewed only by authorized supervisors."
  }
];

const partnerBrands = [
  { name: "Eaton", logo: brandEaton },
  { name: "Meta", logo: brandMeta },
  { name: "MGM", logo: brandMgm },
  { name: "MRF", logo: brandMrf },
  { name: "POLC", logo: brandPolc },
  { name: "Rane", logo: brandRane },
  { name: "SG", logo: brandSg },
  { name: "Solara", logo: brandSolara },
  { name: "TVS", logo: brandTvs }
];

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("trackpulse-theme");
    return savedTheme ? savedTheme === "dark" : false;
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [statValues, setStatValues] = useState(stats.map(() => 0));
  const [statsStarted, setStatsStarted] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const heroSectionRef = useRef(null);
  const statsSectionRef = useRef(null);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const themeName = isDark ? "dark" : "light";
    document.body.classList.toggle("theme-dark", isDark);
    localStorage.setItem("trackpulse-theme", themeName);
  }, [isDark]);

  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateScrollTopVisibility = () => {
      const section = heroSectionRef.current;
      if (!section) {
        setShowScrollTop(window.scrollY > 300);
        return;
      }

      const triggerPoint = section.offsetTop + section.offsetHeight;
      setShowScrollTop(window.scrollY > triggerPoint);
    };

    updateScrollTopVisibility();
    window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });
    window.addEventListener("resize", updateScrollTopVisibility);
    return () => {
      window.removeEventListener("scroll", updateScrollTopVisibility);
      window.removeEventListener("resize", updateScrollTopVisibility);
    };
  }, []);

  useEffect(() => {
    const section = statsSectionRef.current;
    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || statsStarted) {
          return;
        }
        setStatsStarted(true);
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [statsStarted]);

  useEffect(() => {
    if (!statsStarted) {
      return undefined;
    }

    const animationTime = 1200;
    const start = performance.now();
    let frameId;

    const animate = (time) => {
      const progress = Math.min((time - start) / animationTime, 1);
      setStatValues(stats.map((item) => Math.round(item.value * progress)));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [statsStarted]);

  const handleDemoSubmit = (event) => {
    event.preventDefault();
    setDemoSubmitted(true);
  };

  const handleThemeToggle = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <>
      <div className="bg-noise" />

      <header className="container-lg mt-3 site-header">
        <nav className="topbar navbar navbar-expand-lg rounded-pill px-3 py-2">
          <a className="navbar-brand brand fw-bold d-flex align-items-center gap-2 m-0" href="#">
            <span className="brand-dot" />
            <span>TrackPulse</span>
          </a>
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
            aria-controls="navMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list fs-2" />
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navMenu">
            <ul className="navbar-nav align-items-lg-center gap-lg-3 me-lg-3">
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#workflow">
                  Workflow
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#visuals">
                  Visuals
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
            <button
              type="button"
              className={`theme-toggle me-2 ${isDark ? "is-dark" : ""}`}
              onClick={handleThemeToggle}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              aria-pressed={isDark}
              title={`${isDark ? "Dark" : "Light"} mode enabled`}
            >
              <span className="theme-toggle-track">
                <span className="theme-toggle-thumb">
                  <i className={`bi ${isDark ? "bi-moon-stars-fill" : "bi-sun-fill"}`} />
                </span>
              </span>
            </button>
            <a className="btn btn-dark px-3 nav-cta" href="#contact">
              Get Demo
            </a>
          </div>
        </nav>
      </header>

      <main className="container-lg pb-5 site-main">
        <section ref={heroSectionRef} className="row align-items-center g-4 py-4 hero-section">
          <div className="col-lg-6 reveal">
            <p className="eyebrow text-uppercase mb-2">Employee Tracking, Reimagined</p>
            <h1 className="display-4 fw-bold hero-title">
              Monitor teams in the field with supervisor-level clarity.
            </h1>
            <p className="text-muted mt-3">
              Built for user and supervisor roles with GPS live status, role-based dashboards,
              secure login, and fast message sharing.
            </p>
            <div className="d-flex flex-wrap gap-2 mt-4 hero-actions">
              <a className="btn btn-warning fw-semibold px-3 hero-cta-primary" href="#contact">
                Request a Demo
              </a>
              <a className="btn btn-outline-dark px-3 hero-cta-secondary" href="#features">
                See Features
              </a>
            </div>
          </div>
          <div className="col-lg-6 reveal delay-1">
            <div className="phone-stack mx-auto">
              <article className="phone-card">
                <div className="phone-header text-center text-white fw-semibold fs-5">
                  Supervisor Dashboard
                </div>
                <div className="tabs d-grid">
                  <span className="tab active">Users</span>
                  <span className="tab">Messages</span>
                </div>
                <div className="mini-card m-3">
                  <p className="mini-title mb-2">Registered Users (1)</p>
                  <p className="mb-1">ID: 12345</p>
                  <p className="mb-1">Email: No email</p>
                  <p className="mb-0">Role: user</p>
                </div>
              </article>

              <article className="phone-card offset-card mt-3">
                <div className="phone-header login text-center fw-semibold fs-5">
                  Supervisor Login
                </div>
                <div className="avatar-ring" />
                <div className="input-row mx-3">Enter your email</div>
                <div className="input-row mx-3">Enter password</div>
                <div className="login-btn mx-3 text-center">Login</div>
              </article>
            </div>
          </div>
        </section>



        <section id="features" className="py-4">
          <h2 className="fw-bold reveal section-title">Everything your field team needs in one app.</h2>
          <div className="row g-3 mt-1">
            {features.map((item, index) => (
              <div className="col-md-6" key={item.title}>
                <article className={`feature h-100 reveal delay-${Math.min(index, 3)}`}>
                  <h3 className="h5 mb-2">{item.title}</h3>
                  <p className="mb-0 text-muted">{item.text}</p>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section ref={statsSectionRef} className="stats-strip reveal">
          <div className="row g-3">
            {stats.map((item, index) => (
              <div className="col-6 col-lg-3" key={item.label}>
                <article className={`stat-card h-100 delay-${Math.min(index, 3)}`}>
                  <p className="stat-value mb-1">
                    {statValues[index].toLocaleString()}
                    {item.suffix}
                  </p>
                  <p className="stat-label mb-0">{item.label}</p>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section id="visuals" className="py-4">
          <h2 className="fw-bold reveal section-title">A platform your operations team can see and trust.</h2>
          <div className="visual-grid mt-3">
            {showcaseImages.map((image, index) => (
              <article className={`visual-card reveal delay-${Math.min(index, 3)}`} key={image.title}>
                <img src={image.src} alt={image.title} loading="lazy" />
                <div className="visual-overlay">
                  <h3 className="h5 mb-1">{image.title}</h3>
                  <p className="mb-0">{image.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="workflow p-4 mt-4">
          <h2 className="fw-bold reveal section-title">Simple flow, reliable tracking.</h2>
          <div className="row g-3 mt-1">
            {steps.map((step, index) => (
              <div className="col-lg-4" key={step.count}>
                <article className={`step h-100 reveal delay-${Math.min(index, 3)}`}>
                  <span className="count">{step.count}</span>
                  <h3 className="h5 mt-3">{step.title}</h3>
                  <p className="mb-0 text-muted">{step.text}</p>
                </article>
              </div>
            ))}
          </div>
        </section>


        <section className="map-preview mt-4 p-3 p-md-4 reveal">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-2 mb-3">
            <div>
              <p className="eyebrow text-uppercase mb-1">Live Tracking View</p>
              <h2 className="fw-bold mb-0">Field Map Snapshot</h2>
            </div>
            <span className="text-muted small">Supervisor location monitoring</span>
          </div>
          <div className="map-canvas">
            <div className="map-grid" />
            <div className="map-diagonal" />
            <div className="map-fade" />

            <aside className="map-upload-box">
              <p className="fw-semibold mb-2">Upload Options</p>
              <div className="toggle-track">
                <span className="toggle-thumb" />
                <span>Local Storage</span>
              </div>
            </aside>

            <aside className="map-status-box">
              <p className="mb-1 fw-semibold">GPS Active</p>
              <p className="mb-0">Auto-uploading...</p>
            </aside>

            <button className="map-icon map-arrow" type="button" aria-label="direction">
              <i className="bi bi-arrow-right-circle-fill" />
            </button>
            <button className="map-icon map-user" type="button" aria-label="user">
              <i className="bi bi-person-fill" />
            </button>

            <span className="map-pin">
              <i className="bi bi-geo-alt-fill" />
            </span>

            <div className="map-controls">
              <button type="button" aria-label="zoom in">
                <i className="bi bi-plus-lg" />
              </button>
              <button type="button" aria-label="zoom out">
                <i className="bi bi-dash-lg" />
              </button>
            </div>
          </div>
        </section>

        <section className="testimonials mt-4 p-4 reveal">
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
            <div>
              <p className="eyebrow text-uppercase mb-1">Why Teams Switch</p>
              <h2 className="fw-bold mb-0">Trusted by field-first operations.</h2>
            </div>
            <span className="small text-muted">Real operator feedback</span>
          </div>
          <div className="row g-3 mt-1">
            {testimonials.map((item, index) => (
              <div className="col-lg-4" key={item.name}>
                <article className={`testimonial-card h-100 reveal delay-${Math.min(index, 3)}`}>
                  <p className="mb-3">{item.quote}</p>
                  <p className="mb-0 fw-semibold">{item.name}</p>
                  <p className="mb-0 small text-muted">{item.role}</p>
                </article>
              </div>
            ))}
          </div>
        </section>
        <section className="brands-strip p-4 mt-3 reveal">
          <h2 className="fw-bold text-center mb-3 section-title">Trusted by 200+ brands across 5+ countries</h2>
          <div className="rating-pill mx-auto mb-4">
            <span className="score">4.7/5</span>
            <span className="stars" aria-label="rating 4.7 out of 5">
              <i className="bi bi-star-fill" />
              <i className="bi bi-star-fill" />
              <i className="bi bi-star-fill" />
              <i className="bi bi-star-fill" />
              <i className="bi bi-star-half" />
            </span>
            <span className="small text-uppercase fw-semibold">Rating on G2</span>
          </div>
          <div className="brands-marquee" aria-label="Trusted brand logos">
            <div className="brands-track">
              {[...partnerBrands, ...partnerBrands].map((brand, index) => (
                <article className="brand-tile" key={`${brand.name}-${index}`}>
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} loading="lazy" />
                  ) : (
                    <span>{brand.name}</span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="faq mt-4 p-4 reveal">
          <h2 className="fw-bold section-title">Frequently asked questions</h2>
          <div className="accordion mt-3" id="faqAccordion">
            {faqs.map((item, index) => {
              const headingId = `faq-heading-${index}`;
              const collapseId = `faq-collapse-${index}`;
              return (
                <div className="accordion-item faq-item" key={item.question}>
                  <h3 className="accordion-header" id={headingId}>
                    <button
                      className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${collapseId}`}
                      aria-expanded={index === 0}
                      aria-controls={collapseId}
                    >
                      {item.question}
                    </button>
                  </h3>
                  <div
                    id={collapseId}
                    className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                    aria-labelledby={headingId}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="contact" className="contact contact-shell p-4 mt-4 reveal">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-5">
              <div className="contact-info">
                <h2 className="fw-bold contact-title">Talk to the TrackPulse Team</h2>
                <p className="mb-0 mt-3 contact-copy">
                  Explore how TrackPulse can improve field visibility, supervisor coordination, and
                  daily reporting quality.
                </p>

                <div className="contact-meta mt-4">
                  <p className="meta-label mb-1">EMAIL</p>
                  <p className="meta-value mb-0">technovahubcareer@gmail.com</p>
                </div>

                <div className="contact-meta mt-4">
                  <p className="meta-label mb-1">PHONE</p>
                  <p className="meta-value mb-0">+91 9XXXXXXXXX</p>
                </div>

                <div className="contact-meta mt-4">
                  <p className="meta-label mb-2">WEBSITE</p>
                  <span className="meta-chip"><a href="https://www.technovahub.in/">TechnovaHub</a></span>
                </div>

                <div className="contact-meta mt-3">
                  <p className="meta-label mb-2">ADDRESS</p>
                  <span className="meta-chip meta-chip-outline"><a href="https://www.google.com/maps?q=Technova+Hub">Location</a></span>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <form className="contact-form-box" onSubmit={handleDemoSubmit}>
                <input className="form-control form-control-lg contact-input" type="text" placeholder="Full Name" />
                <input className="form-control form-control-lg contact-input" type="email" placeholder="Work Email" />
                <input
                  className="form-control form-control-lg contact-input"
                  type="text"
                  placeholder="Company Name"
                />
                <input
                  className="form-control form-control-lg contact-input"
                  type="tel"
                  placeholder="Phone Number"
                />
                <textarea
                  className="form-control form-control-lg contact-input contact-textarea"
                  placeholder="Tell us about your requirement"
                />
                <button className="btn contact-submit-btn btn-lg w-100" type="submit">
                  Request a Demo
                </button>
              </form>
            </div>
          </div>

          {demoSubmitted ? (
            <p className="mt-3 mb-0 fw-semibold demo-message">
              Demo request captured. Our team will contact you shortly.
            </p>
          ) : null}
        </section>
      </main>

      <footer className="container-lg pb-4 text-muted">
        <p className="mb-0 footer-copy">
          &copy; 2026 <span className="footer-brand">Technovahub.</span> All Rights Reserved.
        </p>
      </footer>

      <div className="floating-actions">
        <button
          type="button"
          className={`btn btn-dark floating-btn floating-top-btn ${showScrollTop ? "show" : ""}`}
          onClick={handleScrollTop}
        >
          <i className="bi bi-arrow-up-short me-1" />
          Go to Top
        </button>
        <a className="btn btn-warning floating-btn fw-semibold" href="#contact">
          <i className="bi bi-person-plus me-1" />
          Register
        </a>
      </div>
    </>
  );
}
