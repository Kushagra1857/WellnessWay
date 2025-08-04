import React from "react";
import Navbar from "../Navbar";
export default function Neutral1c3a() {
  return (
    <div className="recommendations-container">
      <Navbar />
      <h2>Exploring the Effects of Detachment</h2>

      <section>
        <h3>Reflection & Suggestions</h3>
        <ul>
          <li>
            <strong>“Yes, it makes connecting with others difficult”</strong>
            <br />
            <em>Impact on relationships:</em> Emotional detachment can create
            distance in relationships. Consider talking to a trusted friend or
            therapist about ways to reconnect emotionally.
          </li>
          <li>
            <strong>“Yes, it makes me feel unmotivated or numb”</strong>
            <br />
            <em>Impact on motivation:</em> Numbness can affect motivation. Try
            engaging in activities you once enjoyed, even if you don't feel like
            it at first, to re-engage your emotions.
          </li>
          <li>
            <strong>“No, I function fine, it's just how I am”</strong>
            <br />
            <em>Self-acceptance:</em> If you function well and are content, this
            might be part of your emotional baseline. Continue to monitor your
            well-being and seek support if it changes.
          </li>
        </ul>
      </section>

      <p>
        Understanding how detachment shows up in your life helps you choose how
        to respond— whether that's reconnecting emotionally, sparking
        motivation, or embracing your current state.
      </p>

      <style jsx>{`
        .recommendations-container {
          max-width: 800px;
          margin: 50px auto;
          padding: 40px;
          background: #e8f5e9;
          border-radius: 20px;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #102b11ff;
        }

        h2 {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 25px;
          color: #0c1f0dff;
        }

        h3 {
          font-size: 1.3rem;
          color: #0e1b0fff;
          margin-bottom: 15px;
        }

        ul {
          list-style: disc;
          margin-left: 25px;
        }

        ul li {
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        p {
          text-align: center;
          margin-top: 30px;
          font-size: 1.05rem;
          color: #1a361bff;
        }
      `}</style>
    </div>
  );
}
