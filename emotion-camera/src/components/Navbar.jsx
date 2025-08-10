"use client";

import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 25px rgba(31, 27, 21, 0.15)",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "0",
        borderBottom: "1px solid rgba(24, 23, 23, 0.3)",
        position: "fixed", // CHANGE THIS LINE
        top: "0", // ADD THIS LINE
        left: "0", // ADD THIS LINE
        right: "0", // ADD THIS LINE
        zIndex: 10,
        width: "100%",
      }}
    >
      {/* Logo Section */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            cursor: "pointer",
            fontSize: "1.8rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #000000ff 0%, #000000ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.5px",
            textShadow:
              "0 2px 8px rgba(45, 33, 33, 0.9), 0 0 20px rgba(63, 44, 44, 0.6)",
          }}
        >
          WellnsssWay
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "30px" }}>
        <div
          onClick={() => handleNavigation("/home")}
          style={{
            cursor: "pointer",
            textDecoration: "none",
            color: "#22282fff",
            fontSize: "1.2rem",
            fontWeight: "500",
            padding: "8px 0",
            position: "relative",
            transition: "color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#060606ff")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#272f39ff")}
        >
          Home
          <span
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "0",
              height: "2px",
              backgroundColor: "#060606ff",
              transition: "width 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.width = "100%")}
            onMouseOut={(e) => (e.currentTarget.style.width = "0")}
          />
        </div>
        <div
          onClick={() => handleNavigation("/about")}
          style={{
            cursor: "pointer",
            textDecoration: "none",
            color: "#20262fff",
            fontSize: "1.2rem",
            fontWeight: "500",
            padding: "8px 0",
            position: "relative",
            transition: "color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#2b2219ff")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#475569")}
        >
          About Us
          <span
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "0",
              height: "2px",
              backgroundColor: "#221e1aff",
              transition: "width 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.width = "100%")}
            onMouseOut={(e) => (e.currentTarget.style.width = "0")}
          />
        </div>
        <div
          onClick={() => handleNavigation("/insights")}
          style={{
            cursor: "pointer",
            textDecoration: "none",
            color: "#242a34ff",
            fontSize: "1.2rem",
            fontWeight: "500",
            padding: "8px 0",
            position: "relative",
            transition: "color 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = "#0f0e0dff")}
          onMouseOut={(e) => (e.currentTarget.style.color = "#475569")}
        >
          Insights
          <span
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "0",
              height: "2px",
              backgroundColor: "#1b1a18ff",
              transition: "width 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.width = "100%")}
            onMouseOut={(e) => (e.currentTarget.style.width = "0")}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
