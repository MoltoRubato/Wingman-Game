"use client";

import { useEffect, useState } from "react";

export const WaitingFor = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + "·")), 600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="splash">
      <div className="splash-inner" style={{ maxWidth: 640 }}>
        <div
          className="eyebrow"
          style={{ textAlign: "center", marginBottom: 14, fontSize: 11 }}
        >
          Court silence{dots}
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 40,
            color: "var(--gold-bright)",
            textAlign: "center",
            margin: "0 0 18px",
            fontWeight: 500,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 19,
            color: "var(--cream)",
            textAlign: "center",
            lineHeight: 1.55,
          }}
        >
          {children}
        </p>
      </div>
    </div>
  );
};
