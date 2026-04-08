import { useState } from "react";
import { ListaClientes } from "@/pages/ListaClientes";
import { PinLogin } from "@/pages/PinLogin";

function App() {
  const [desbloqueado, setDesbloqueado] = useState(false);

  if (!desbloqueado) {
    return <PinLogin onUnlock={() => setDesbloqueado(true)} />;
  }

  return <ListaClientes />;
}

export default App;
