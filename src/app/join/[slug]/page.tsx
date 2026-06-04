"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
};

type Party = {
  id: string;
  name: string;
  size: number;
  quoted_wait: number;
  joined_at: string;
};

export default function JoinWaitlist() {
  const params = useParams();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [queueLength, setQueueLength] = useState(0);
  const [step, setStep] = useState<"form" | "success">("form");
  const [party, setParty] = useState<Party | null>(null);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState(2);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch(`/api/queue/${slug}`);
        const data = await res.json();
        setRestaurant(data.restaurant);
        setQueueLength(data.parties.length);
        if (party) {
          const pos = data.parties.findIndex((p: Party) => p.id === party.id);
          setPosition(pos === -1 ? 0 : pos + 1);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [slug, party]);

  const joinWaitlist = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!restaurant) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/party", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurant_id: restaurant.id,
          name: name.trim(),
          phone: phone.trim() || null,
          size,
        }),
      });
      const data = await res.json();
      if (data.party) {
        setParty(data.party);
        setPosition(queueLength + 1);
        setStep("success");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const estimatedWait = () => {
    if (!position) return "Ready soon";
    const mins = position * 15;
    if (mins < 5) return "Less than 5 minutes";
    return `About ${mins} minutes`;
  };

  if (!restaurant) {
    return (
      <div style={{ background: "#080C14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#00D4FF", fontFamily: "monospace" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#080C14", minHeight: "100vh", color: "#E8EDF5", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, background: "#00D4FF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#080C14", fontSize: 20 }}>T</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>TableTurn</div>
          <div style={{ fontSize: 13, color: "#5A6A80" }}>{restaurant.name}</div>
        </div>
      </div>

      {step === "form" && (
        <div style={{ background: "#0D1420", border: "1px solid #1A2535", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420 }}>

          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px 0" }}>Join the Waitlist</h1>
          <p style={{ fontSize: 14, color: "#5A6A80", margin: "0 0 28px 0" }}>
            {queueLength === 0
              ? "No wait — tables available now"
              : `${queueLength} ${queueLength === 1 ? "party" : "parties"} ahead of you`}
          </p>

          {/* Name */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, color: "#5A6A80", display: "block", marginBottom: 6 }}>Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Smith"
              style={{ width: "100%", background: "#080C14", border: "1px solid #1A2535", borderRadius: 8, padding: "12px 14px", color: "#E8EDF5", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, color: "#5A6A80", display: "block", marginBottom: 6 }}>Phone Number <span style={{ color: "#3A4A60" }}>(optional — for SMS alert)</span></label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08012345678"
              style={{ width: "100%", background: "#080C14", border: "1px solid #1A2535", borderRadius: 8, padding: "12px 14px", color: "#E8EDF5", fontSize: 15, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Party size */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, color: "#5A6A80", display: "block", marginBottom: 10 }}>Party Size</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setSize(n)}
                  style={{ width: 48, height: 48, background: size === n ? "#00D4FF22" : "#080C14", border: `1px solid ${size === n ? "#00D4FF" : "#1A2535"}`, borderRadius: 8, color: size === n ? "#00D4FF" : "#5A6A80", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: "#FF3B5C22", border: "1px solid #FF3B5C", borderRadius: 8, padding: "10px 14px", color: "#FF3B5C", fontSize: 13, marginBottom: 18 }}>
              {error}
            </div>
          )}

          <button
            onClick={joinWaitlist}
            disabled={loading}
            style={{ width: "100%", background: loading ? "#1A2535" : "#00D4FF", border: "none", borderRadius: 10, padding: "14px", color: loading ? "#5A6A80" : "#080C14", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
            {loading ? "Joining..." : "Join Waitlist"}
          </button>
        </div>
      )}

      {step === "success" && party && (
        <div style={{ background: "#0D1420", border: "1px solid #1A2535", borderRadius: 16, padding: 32, width: "100%", maxWidth: 420, textAlign: "center" }}>

          {position === 0 ? (
            <>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px 0", color: "#00FF88" }}>Your table is ready!</h2>
              <p style={{ color: "#5A6A80", fontSize: 14, margin: "0 0 24px 0" }}>Please follow the host to your table.</p>
            </>
          ) : (
            <>
              <div style={{ width: 80, height: 80, background: "#00D4FF15", border: "2px solid #00D4FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto" }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: "#00D4FF" }}>#{position}</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px 0" }}>You are on the list!</h2>
              <p style={{ color: "#5A6A80", fontSize: 14, margin: "0 0 24px 0" }}>
                Hi {party.name} — you are #{position} in line
              </p>
            </>
          )}

          <div style={{ background: "#080C14", border: "1px solid #1A2535", borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "#5A6A80", marginBottom: 4 }}>PARTY SIZE</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{party.size} {party.size === 1 ? "person" : "people"}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#5A6A80", marginBottom: 4 }}>EST. WAIT</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#00D4FF" }}>{estimatedWait()}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 8px #00FF88" }} />
            <span style={{ fontSize: 12, color: "#5A6A80" }}>This page updates automatically</span>
          </div>
          <p style={{ fontSize: 12, color: "#3A4A60", margin: 0 }}>Keep this page open — we will notify you when your table is ready</p>
        </div>
      )}
    </div>
  );
}