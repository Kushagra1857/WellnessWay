"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("general");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        role === "doctor"
          ? "http://localhost:3001/api/users/doctor"
          : "http://localhost:3001/api/users";

      const response = await axios.post(endpoint, {
        name,
        email,
        password,
        role,
      });

      setSuccess("Registration successful! Please login.");
      setError("");
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 50%, #f0fff4 100%)",
        padding: "0 1rem",
        width: "100vw",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Soft overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, rgba(240, 248, 255, 0.7) 0%, rgba(240, 255, 244, 0.7) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      ></div>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          boxShadow:
            "0 15px 35px rgba(74, 144, 226, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)",
          width: "100%",
          maxWidth: "600px",
          padding: "2.5rem",
          border: "2px solid rgba(123, 179, 240, 0.2)",
          position: "relative",
          zIndex: 1,
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "600",
              margin: "0 0 0.5rem 0",
              color: "#4a90e2",
              textShadow: "0 2px 8px rgba(74, 144, 226, 0.2)",
            }}
          >
            Sign Up
          </h2>
          <p
            style={{
              color: "#718096",
              fontSize: "1.1rem",
              textShadow: "0 1px 2px rgba(113, 128, 150, 0.1)",
              margin: "0 0 2rem 0",
            }}
          >
            Enter your information to create an account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {error && (
            <p
              style={{
                color: "#e53e3e",
                background: "rgba(254, 235, 235, 0.9)",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                margin: "0",
                fontWeight: "500",
                boxShadow: "0 3px 12px rgba(229, 62, 62, 0.15)",
                border: "1px solid rgba(252, 165, 165, 0.4)",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          {success && (
            <p
              style={{
                color: "#38a169",
                background: "rgba(240, 253, 244, 0.9)",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                margin: "0",
                fontWeight: "500",
                boxShadow: "0 3px 12px rgba(56, 161, 105, 0.15)",
                border: "1px solid rgba(167, 243, 208, 0.4)",
                textAlign: "center",
              }}
            >
              {success}
            </p>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="name"
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "#4a5568",
                textShadow: "0 1px 2px rgba(74, 85, 104, 0.05)",
                margin: "0",
              }}
            >
              Name:
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "1rem 1.25rem",
                border: "2px solid rgba(226, 232, 240, 0.5)",
                borderRadius: "15px",
                width: "100%",
                fontSize: "1rem",
                lineHeight: "1.5rem",
                background: "rgba(247, 250, 252, 0.8)",
                transition: "all 0.3s ease",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                margin: "0",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(123, 179, 240, 0.5)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(123, 179, 240, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(226, 232, 240, 0.5)";
                e.target.style.boxShadow = "inset 0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="email"
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "#4a5568",
                textShadow: "0 1px 2px rgba(74, 85, 104, 0.05)",
                margin: "0",
              }}
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: "1rem 1.25rem",
                border: "2px solid rgba(226, 232, 240, 0.5)",
                borderRadius: "15px",
                width: "100%",
                fontSize: "1rem",
                lineHeight: "1.5rem",
                background: "rgba(247, 250, 252, 0.8)",
                transition: "all 0.3s ease",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                margin: "0",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(123, 179, 240, 0.5)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(123, 179, 240, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(226, 232, 240, 0.5)";
                e.target.style.boxShadow = "inset 0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="password"
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "#4a5568",
                textShadow: "0 1px 2px rgba(74, 85, 104, 0.05)",
                margin: "0",
              }}
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "1rem 1.25rem",
                border: "2px solid rgba(226, 232, 240, 0.5)",
                borderRadius: "15px",
                width: "100%",
                fontSize: "1rem",
                lineHeight: "1.5rem",
                background: "rgba(247, 250, 252, 0.8)",
                transition: "all 0.3s ease",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                margin: "0",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(123, 179, 240, 0.5)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(123, 179, 240, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(226, 232, 240, 0.5)";
                e.target.style.boxShadow = "inset 0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            />
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="role"
              style={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "#4a5568",
                textShadow: "0 1px 2px rgba(74, 85, 104, 0.05)",
                margin: "0",
              }}
            >
              Role:
            </label>
            <select
              id="role"
              name="role"
              value={role}
              required
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: "1rem 1.25rem",
                border: "2px solid rgba(226, 232, 240, 0.5)",
                borderRadius: "15px",
                width: "100%",
                fontSize: "1rem",
                lineHeight: "1.5rem",
                background: "rgba(247, 250, 252, 0.8)",
                transition: "all 0.3s ease",
                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                margin: "0",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(123, 179, 240, 0.5)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(123, 179, 240, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(226, 232, 240, 0.5)";
                e.target.style.boxShadow = "inset 0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            >
              <option value="general">General User</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "1.2rem 3rem",
              background: "linear-gradient(135deg, #6bcf7f 0%, #4a90e2 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 25px rgba(107, 207, 127, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              position: "relative",
              overflow: "hidden",
              margin: "0",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #5bb36f 0%, #3a7bc8 100%)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 35px rgba(107, 207, 127, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #6bcf7f 0%, #4a90e2 100%)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px rgba(107, 207, 127, 0.3)";
            }}
          >
            Sign Up
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p
            style={{
              fontSize: "1rem",
              color: "#718096",
              textShadow: "0 1px 2px rgba(113, 128, 150, 0.1)",
              margin: "0",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                textDecoration: "underline",
                color: "#4a90e2",
                fontWeight: "500",
                transition: "color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#3a7bc8")}
              onMouseOut={(e) => (e.target.style.color = "#4a90e2")}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
