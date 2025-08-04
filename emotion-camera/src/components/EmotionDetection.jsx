"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function EmotionDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState("Waiting to start...");
  const [stableEmotion, setStableEmotion] = useState(null);
  const [emotionCounts, setEmotionCounts] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });
  const emotionCountsRef = useRef(emotionCounts);
  const [detectionTime, setDetectionTime] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Initialize webcam
  useEffect(() => {
    const initWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Webcam error:", err);
        setError("Webcam access denied or not available");
      }
    };

    initWebcam();
  }, []);

  // Detection logic
  const captureAndSendFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Ensure proper canvas dimensions
    canvas.width = 640;
    canvas.height = 480;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Disable image smoothing for sharper images
    context.imageSmoothingEnabled = false;

    // Draw video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Use PNG for lossless compression
      const imageData = canvas.toDataURL("image/png");

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const detectedEmotion = data.emotion?.toLowerCase() || "neutral";
      setCurrentEmotion(detectedEmotion);

      setEmotionCounts((prev) => {
        const updated = {
          ...prev,
          [detectedEmotion]: prev[detectedEmotion] + 1,
        };
        emotionCountsRef.current = updated;
        return updated;
      });
    } catch (err) {
      console.error("Detection error:", err);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isDetecting) {
      interval = setInterval(() => {
        captureAndSendFrame();
        setDetectionTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= 15) {
            finishDetection();
            return 15;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDetecting, captureAndSendFrame]);

  const finishDetection = useCallback(() => {
    setIsDetecting(false);
    const counts = emotionCountsRef.current;
    const maxEmotion = Object.entries(counts).reduce(
      (max, [emotion, count]) => (count > max.count ? { emotion, count } : max),
      { emotion: "neutral", count: 0 }
    ).emotion;
    setStableEmotion(maxEmotion);
    setCurrentEmotion(maxEmotion);
  }, []);

  const handleStartDetection = useCallback(() => {
    setHasStarted(true);
    setIsDetecting(true);
    setDetectionTime(0);
    setEmotionCounts({
      angry: 0,
      disgust: 0,
      fear: 0,
      happy: 0,
      sad: 0,
      surprise: 0,
      neutral: 0,
    });
    setCurrentEmotion("Detecting...");
    setStableEmotion(null);
    setError(null);
  }, []);

  const handleRestart = useCallback(() => {
    setHasStarted(false);
    setIsDetecting(false);
    setDetectionTime(0);
    setStableEmotion(null);
    setCurrentEmotion("Waiting to start...");
    setError(null);
  }, []);

  const redirectToEmotionPage = useCallback(() => {
    if (stableEmotion) {
      navigate(`/${stableEmotion}`);
    }
  }, [stableEmotion, navigate]);

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: "#10B981",
      sad: "#3B82F6",
      angry: "#EF4444",
      fear: "#8B5CF6",
      surprise: "#F59E0B",
      disgust: "#6B7280",
      neutral: "#6B7280",
    };
    return colors[emotion] || "#6B7280";
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      fear: "😨",
      surprise: "😲",
      disgust: "🤢",
      neutral: "😐",
    };
    return emojis[emotion] || "😐";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%),
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
          linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)
        `,
        backgroundAttachment: "fixed",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
      }}
    >
      <Navbar />
      {/* Background Pattern Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.1) 2px, transparent 0),
            radial-gradient(circle at 75px 75px, rgba(139, 92, 246, 0.1) 2px, transparent 0)
          `,
          backgroundSize: "100px 100px",
          zIndex: -1,
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
            padding: "40px 20px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "15px",
              letterSpacing: "-0.02em",
            }}
          >
            Emotion Detection & Support
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#64748b",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Advanced AI-powered emotion recognition technology to provide
            personalized mental health support
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#dc2626",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              fontWeight: "500",
            }}
          >
            ⚠ {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Video Section */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1e293b",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Live Video Feed
            </h3>

            <div
              style={{
                position: "relative",
                borderRadius: "15px",
                overflow: "hidden",
                backgroundColor: "#000",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />

              {isDetecting && (
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    backgroundColor: "rgba(239, 68, 68, 0.9)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "25px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      marginRight: "8px",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  Analyzing
                </div>
              )}
            </div>
          </div>

          {/* Control Section */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "30px" }}
          >
            {!hasStarted ? (
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "20px",
                  padding: "40px",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "20px",
                  }}
                >
                  Ready to Begin Analysis
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "1.1rem",
                    marginBottom: "30px",
                    lineHeight: "1.6",
                  }}
                >
                  Our advanced AI will analyze your facial expressions for 15
                  seconds to determine your emotional state.
                </p>
                <button
                  onClick={handleStartDetection}
                  disabled={!!error}
                  style={{
                    background: error
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    padding: "16px 32px",
                    fontSize: "1.1rem",
                    borderRadius: "12px",
                    cursor: error ? "not-allowed" : "pointer",
                    boxShadow: error
                      ? "none"
                      : "0 10px 30px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.3s ease",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                  onMouseOver={(e) => {
                    if (!error) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 15px 40px rgba(102, 126, 234, 0.5)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!error) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 10px 30px rgba(102, 126, 234, 0.4)";
                    }
                  }}
                >
                  Start Analysis
                </button>
              </div>
            ) : (
              <>
                {/* Current Emotion Display */}
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "20px",
                    padding: "30px",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "20px",
                    }}
                  >
                    Current Emotion
                  </h3>
                  <div
                    style={{
                      fontSize: "4rem",
                      marginBottom: "15px",
                    }}
                  >
                    {getEmotionEmoji(
                      isDetecting
                        ? currentEmotion
                        : stableEmotion || currentEmotion
                    )}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: getEmotionColor(
                        isDetecting
                          ? currentEmotion
                          : stableEmotion || currentEmotion
                      ),
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "25px",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {isDetecting
                      ? currentEmotion
                      : stableEmotion || currentEmotion}
                  </div>
                </div>

                {isDetecting ? (
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "20px",
                      padding: "30px",
                      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        marginBottom: "25px",
                      }}
                    >
                      Analysis Progress
                    </h4>

                    <div
                      style={{
                        backgroundColor: "#f1f5f9",
                        borderRadius: "12px",
                        height: "12px",
                        marginBottom: "15px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          background:
                            "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                          height: "100%",
                          width: `${(detectionTime / 15) * 100}%`,
                          transition: "width 0.3s ease",
                          borderRadius: "12px",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: "25px",
                        fontSize: "1.1rem",
                        color: "#64748b",
                        fontWeight: "500",
                      }}
                    >
                      {detectionTime} / 15 seconds
                    </div>

                    <h5
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        marginBottom: "15px",
                      }}
                    >
                      Emotion Detection Results
                    </h5>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {Object.entries(emotionCounts).map(([emotion, count]) => (
                        <div
                          key={emotion}
                          style={{
                            backgroundColor: "#f8fafc",
                            padding: "15px",
                            borderRadius: "12px",
                            textAlign: "center",
                            border: "1px solid #e2e8f0",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              textTransform: "capitalize",
                              fontWeight: "600",
                              color: "#374151",
                              marginBottom: "8px",
                              fontSize: "0.9rem",
                            }}
                          >
                            {emotion}
                          </div>
                          <div
                            style={{
                              backgroundColor: getEmotionColor(emotion),
                              color: "white",
                              borderRadius: "20px",
                              padding: "6px 12px",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              display: "inline-block",
                            }}
                          >
                            {count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  stableEmotion && (
                    <div
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "20px",
                        padding: "40px",
                        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        textAlign: "center",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.8rem",
                          fontWeight: "600",
                          color: "#1e293b",
                          marginBottom: "20px",
                        }}
                      >
                        Analysis Complete
                      </h4>

                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "1.1rem",
                          marginBottom: "30px",
                          lineHeight: "1.6",
                        }}
                      >
                        Your primary emotion has been identified as{" "}
                        <strong
                          style={{
                            color: getEmotionColor(stableEmotion),
                            textTransform: "capitalize",
                          }}
                        >
                          {stableEmotion}
                        </strong>
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={redirectToEmotionPage}
                          style={{
                            background:
                              "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "white",
                            border: "none",
                            padding: "14px 28px",
                            fontSize: "1rem",
                            borderRadius: "12px",
                            cursor: "pointer",
                            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)",
                            transition: "all 0.3s ease",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow =
                              "0 15px 40px rgba(16, 185, 129, 0.5)";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow =
                              "0 10px 30px rgba(16, 185, 129, 0.4)";
                          }}
                        >
                          Analyze More
                        </button>

                        <button
                          onClick={handleRestart}
                          style={{
                            backgroundColor: "transparent",
                            color: "#64748b",
                            border: "2px solid #e2e8f0",
                            padding: "14px 28px",
                            fontSize: "1rem",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.borderColor = "#94a3b8";
                            e.target.style.color = "#374151";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.color = "#64748b";
                          }}
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
