import { useState, useEffect } from "react";

const PIN_CORRETO = "1234";

export function PinLogin({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [erro, setErro] = useState(false);
  const [shake, setShake] = useState(false);

  const MAX = 4;

  useEffect(() => {
    if (pin.length === MAX) {
      if (pin === PIN_CORRETO) {
        setTimeout(onUnlock, 180);
      } else {
        setErro(true);
        setShake(true);
        setTimeout(() => {
          setPin("");
          setErro(false);
          setShake(false);
        }, 700);
      }
    }
  }, [pin]);

  const pressKey = (k: string) => {
    if (pin.length < MAX) setPin(p => p + k);
  };

  const del = () => setPin(p => p.slice(0, -1));

  const keys = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg, #0f3a24 0%, #1a5c38 60%, #0d2e1c 100%)",
      fontFamily: "'Inter','Segoe UI',sans-serif",
      userSelect: "none",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        width: "100%",
        maxWidth: 320,
        padding: "0 24px",
      }}>
        {/* Logo */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: "rgba(255,255,255,0.12)",
          border: "1.5px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16,
          backdropFilter: "blur(8px)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="white"/>
          </svg>
        </div>

        {/* Título */}
        <p style={{ color: "white", fontSize: 20, fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.3px" }}>
          Rota Cred Bank
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: "0 0 36px" }}>
          Digite seu PIN para continuar
        </p>

        {/* Dots PIN */}
        <div
          style={{
            display: "flex", gap: 14, marginBottom: 36,
            transition: "transform 0.1s",
            transform: shake ? "translateX(0)" : "none",
            animation: shake ? "shake 0.5s ease" : "none",
          }}
        >
          {Array.from({ length: MAX }).map((_, i) => {
            const filled = i < pin.length;
            const isErr = erro;
            return (
              <div key={i} style={{
                width: 14, height: 14, borderRadius: "50%",
                background: isErr
                  ? "#f87171"
                  : filled
                    ? "white"
                    : "rgba(255,255,255,0.25)",
                border: `2px solid ${isErr ? "#f87171" : filled ? "white" : "rgba(255,255,255,0.4)"}`,
                transition: "all 0.15s ease",
                transform: filled ? "scale(1.1)" : "scale(1)",
              }} />
            );
          })}
        </div>

        {/* Mensagem de erro */}
        <p style={{
          color: "#f87171", fontSize: 11, fontWeight: 600,
          margin: erro ? "-24px 0 12px" : "-36px 0 0",
          opacity: erro ? 1 : 0,
          transition: "opacity 0.2s",
          letterSpacing: "0.02em",
        }}>
          PIN incorreto
        </p>

        {/* Teclado numérico */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          width: "100%",
        }}>
          {keys.map((k, i) => {
            if (k === "") return <div key={i} />;
            const isDel = k === "⌫";
            return (
              <button
                key={i}
                onClick={() => isDel ? del() : pressKey(k)}
                style={{
                  height: 58,
                  borderRadius: 14,
                  border: isDel
                    ? "1.5px solid rgba(255,255,255,0.15)"
                    : "1.5px solid rgba(255,255,255,0.12)",
                  background: isDel
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.10)",
                  color: "white",
                  fontSize: isDel ? 18 : 22,
                  fontWeight: isDel ? 400 : 600,
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  transition: "background 0.12s, transform 0.1s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  WebkitTapHighlightColor: "transparent",
                  letterSpacing: 0,
                }}
                onPointerDown={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = isDel
                    ? "rgba(255,255,255,0.14)"
                    : "rgba(255,255,255,0.22)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.94)";
                }}
                onPointerUp={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = isDel
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.10)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
                onPointerLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = isDel
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.10)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                {k}
              </button>
            );
          })}
        </div>

        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, marginTop: 32, letterSpacing: "0.04em" }}>
          SISTEMA DE COBRANÇA • ACESSO RESTRITO
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
