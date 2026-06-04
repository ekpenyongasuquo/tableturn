import Link from "next/link";

export default function Home() {
  return (
    <div style={{ background: "#080C14", minHeight: "100vh", color: "#E8EDF5", fontFamily: "system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1A2535", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#00D4FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#080C14", fontSize: 16 }}>T</div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>TableTurn</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="#pricing" style={{ color: "#5A6A80", textDecoration: "none", fontSize: 14 }}>Pricing</a>
          <a href="#how" style={{ color: "#5A6A80", textDecoration: "none", fontSize: 14 }}>How it works</a>
          <Link href="/host/test-kitchen" style={{ background: "#00D4FF", color: "#080C14", padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Host Dashboard →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 60px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ background: "#00D4FF18", border: "1px solid #00D4FF40", color: "#00D4FF", fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 20, display: "inline-block", marginBottom: 24, letterSpacing: 1 }}>
          POWERED BY AURORA DSQL + VERCEL
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, margin: "0 0 24px 0", letterSpacing: -1 }}>
          Restaurant waitlists
          <span style={{ color: "#00D4FF" }}> that just work</span>
        </h1>
        <p style={{ fontSize: 18, color: "#5A6A80", lineHeight: 1.7, margin: "0 0 40px 0", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
          TableTurn gives independent restaurants a professional waitlist and table management system at a price they can actually afford. No more paper lists. No more WhatsApp chaos.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/join/test-kitchen" style={{ background: "#00D4FF", color: "#080C14", padding: "14px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            Try Demo →
          </Link>
          <Link href="/host/test-kitchen" style={{ background: "transparent", border: "1px solid #1A2535", color: "#E8EDF5", padding: "14px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            Host Dashboard
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#1A2535", maxWidth: 900, margin: "0 auto 80px auto" }}>
        {[
          { value: "12M+", label: "Independent restaurants globally" },
          { value: "$29/mo", label: "Starting price vs $300+ competitors" },
          { value: "0ms", label: "Double bookings — guaranteed by Aurora DSQL" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#080C14", padding: "32px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#00D4FF", marginBottom: 8 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#5A6A80", lineHeight: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div id="how" style={{ maxWidth: 900, margin: "0 auto 80px auto", padding: "0 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 48 }}>How it works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { step: "01", title: "Customer scans QR code", desc: "A QR code at the restaurant entrance takes customers directly to the waitlist page on their phone." },
            { step: "02", title: "Host manages the queue", desc: "The host dashboard shows the live queue. One click selects a party and assigns them to an available table." },
            { step: "03", title: "No double bookings — ever", desc: "Aurora DSQL's serializable transactions guarantee two hosts cannot seat two parties at the same table simultaneously." },
          ].map((item) => (
            <div key={item.step} style={{ background: "#0D1420", border: "1px solid #1A2535", borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 12, color: "#00D4FF", fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>{item.step}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: "#5A6A80", lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ maxWidth: 900, margin: "0 auto 80px auto", padding: "0 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 12 }}>Simple pricing</h2>
        <p style={{ textAlign: "center", color: "#5A6A80", marginBottom: 48, fontSize: 15 }}>No per-cover fees. No hidden charges. Cancel anytime.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            {
              name: "Starter", price: "$29", period: "/month",
              features: ["1 location", "Unlimited parties", "Live queue dashboard", "Customer join page", "QR code included"],
              highlight: false,
            },
            {
              name: "Pro", price: "$79", period: "/month",
              features: ["5 locations", "Everything in Starter", "Reservation booking", "Analytics dashboard", "SMS notifications"],
              highlight: true,
            },
            {
              name: "Enterprise", price: "$199", period: "/month",
              features: ["Unlimited locations", "Everything in Pro", "White-label branding", "API access", "Dedicated support"],
              highlight: false,
            },
          ].map((plan) => (
            <div key={plan.name} style={{ background: plan.highlight ? "#00D4FF12" : "#0D1420", border: `1px solid ${plan.highlight ? "#00D4FF" : "#1A2535"}`, borderRadius: 16, padding: 28, position: "relative" }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#00D4FF", color: "#080C14", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 1 }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: plan.highlight ? "#00D4FF" : "#5A6A80", marginBottom: 8 }}>{plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 40, fontWeight: 900 }}>{plan.price}</span>
                <span style={{ color: "#5A6A80", fontSize: 14 }}>{plan.period}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#B0BEC5" }}>
                    <span style={{ color: "#00FF88", fontSize: 16 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", background: plan.highlight ? "#00D4FF" : "transparent", border: `1px solid ${plan.highlight ? "#00D4FF" : "#1A2535"}`, color: plan.highlight ? "#080C14" : "#E8EDF5", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div style={{ background: "#0D1420", borderTop: "1px solid #1A2535", borderBottom: "1px solid #1A2535", padding: "40px 24px", marginBottom: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#5A6A80", letterSpacing: 2, marginBottom: 20 }}>BUILT ON</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {["Amazon Aurora DSQL", "Vercel", "Next.js 16", "TypeScript", "Postgres.js"].map((tech) => (
              <div key={tech} style={{ fontSize: 14, fontWeight: 600, color: "#5A6A80" }}>{tech}</div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "0 24px 80px 24px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Ready to try it?</h2>
        <p style={{ color: "#5A6A80", marginBottom: 32, fontSize: 15 }}>No signup required — explore the live demo now.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/join/test-kitchen" style={{ background: "#00D4FF", color: "#080C14", padding: "14px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            Join Demo Waitlist →
          </Link>
          <Link href="/host/test-kitchen" style={{ background: "transparent", border: "1px solid #1A2535", color: "#E8EDF5", padding: "14px 32px", borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
            Open Host Dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1A2535", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, background: "#00D4FF", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#080C14", fontSize: 12 }}>T</div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>TableTurn</span>
        </div>
        <div style={{ fontSize: 12, color: "#5A6A80" }}>Built for H0: Hack the Zero Stack · Aurora DSQL + Vercel</div>
      </div>

    </div>
  );
}