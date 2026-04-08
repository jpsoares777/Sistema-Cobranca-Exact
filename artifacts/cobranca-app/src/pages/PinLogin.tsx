import { useState, useEffect, useRef } from "react";

const PIN_CORRETO = "10600";
const MAX = 5;

const GRAD_TOP = "#0d2b5e";
const GRAD_MID = "#1a6fa8";
const GRAD_BOT = "#3ecfcf";

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "DEL"],
];

export function PinLogin({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [erro, setErro] = useState(false);
  const [shake, setShake] = useState(false);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pin.length === MAX) {
      if (pin === PIN_CORRETO) {
        setTimeout(onUnlock, 200);
      } else {
        setErro(true);
        setShake(true);
        timeoutRef.current = setTimeout(() => {
          setPin("");
          setErro(false);
          setShake(false);
        }, 700);
      }
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [pin]);

  const pressKey = (k: string) => {
    if (pin.length < MAX && !erro) setPin(p => p + k);
  };
  const del = () => { if (!erro) setPin(p => p.slice(0, -1)); };

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: `linear-gradient(180deg, ${GRAD_TOP} 0%, ${GRAD_MID} 55%, ${GRAD_BOT} 100%)`,
      fontFamily: "'Inter','Segoe UI',sans-serif",
      userSelect: "none",
      WebkitTapHighlightColor: "transparent",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 340,
        padding: "0 28px",
        gap: 0,
      }}>
        {/* Logo */}
        <img
          src="/logo_pin.png"
          alt="Logo"
          style={{
            width: "78%",
            maxWidth: 280,
            height: "auto",
            marginBottom: 48,
            objectFit: "contain",
          }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />

        {/* Texto */}
        <p style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: 15,
          fontWeight: 500,
          margin: "0 0 28px",
          letterSpacing: "0.01em",
          textAlign: "center",
        }}>
          Digite seu PIN para acessar
        </p>

        {/* Dots */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 10,
            animation: shake ? "shake 0.5s ease" : "none",
          }}
        >
          {Array.from({ length: MAX }).map((_, i) => {
            const filled = i < pin.length;
            return (
              <div key={i} style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: erro
                  ? "#f87171"
                  : filled
                    ? "#ffffff"
                    : "transparent",
                border: `2px solid ${erro ? "#f87171" : filled ? "#ffffff" : "rgba(255,255,255,0.4)"}`,
                transition: "background 0.15s, border-color 0.15s",
              }} />
            );
          })}
        </div>

        {/* Erro */}
        <p style={{
          color: "#f87171",
          fontSize: 12,
          fontWeight: 600,
          margin: "8px 0 20px",
          opacity: erro ? 1 : 0,
          transition: "opacity 0.2s",
          minHeight: 18,
          letterSpacing: "0.02em",
        }}>
          PIN incorreto
        </p>

        {/* Numpad */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          {ROWS.map((row, ri) => (
            <div key={ri} style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 10 }}>
              {row.map((key, ki) => {
                if (key === "") {
                  return <div key={ki} style={{ width: 82, height: 82 }} />;
                }
                const isDel = key === "DEL";
                const isPressed = pressedKey === `${ri}-${ki}`;
                return (
                  <button
                    key={ki}
                    onPointerDown={() => {
                      setPressedKey(`${ri}-${ki}`);
                      if (isDel) del(); else pressKey(key);
                    }}
                    onPointerUp={() => setPressedKey(null)}
                    onPointerLeave={() => setPressedKey(null)}
                    style={{
                      width: 82,
                      height: 82,
                      borderRadius: "50%",
                      border: "none",
                      background: isPressed
                        ? "rgba(255,255,255,0.30)"
                        : "rgba(255,255,255,0.15)",
                      color: isDel ? "rgba(255,255,255,0.6)" : "#ffffff",
                      fontSize: isDel ? 22 : 26,
                      fontWeight: 400,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.1s",
                      WebkitTapHighlightColor: "transparent",
                      outline: "none",
                      flexShrink: 0,
                    }}
                  >
                    {isDel ? "⌫" : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <p style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: 10,
          marginTop: 40,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          Sistema de Cobrança • Acesso Restrito
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-7px); }
          80% { transform: translateX(7px); }
        }
      `}</style>
    </div>
  );
}
