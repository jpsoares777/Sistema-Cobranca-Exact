import { useState } from "react";
import { ListaClientes } from "@/pages/ListaClientes";
import { PinLogin } from "@/pages/PinLogin";

function App() {
  const [desbloqueado, setDesbloqueado] = useState(false);

  if (!desbloqueado) {
    return (
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        background: "#000",
      }}>
        <div style={{ width: "100%", maxWidth: 430 }}>
          <PinLogin onUnlock={() => setDesbloqueado(true)} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100dvh",
      display: "flex",
      justifyContent: "center",
      background: "#f0f0f0",
    }}>
      <div style={{ width: "100%", maxWidth: 430, background: "#fff" }}>
        <ListaClientes />
      </div>
    </div>
  );
}

export default App;
