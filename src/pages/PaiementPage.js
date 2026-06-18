import { useState } from "react";

function PaiementPage() {
  const [zone, setZone] = useState("");

  return (
    <div className="App">
      <h1>💳 Paiement</h1>

      <h2>Choisissez votre zone</h2>

      <button onClick={() => setZone("bamako")}>
        📍 Bamako
      </button>

      <button onClick={() => setZone("autre")}>
        🌍 Hors Bamako / International
      </button>

   {zone === "bamako" && (
  <div className="payment-card">
    <h3>📍 Paiement Bamako</h3>
    <p>✅ 50 % maintenant via Orange Money</p>
    <p>🚚 50 % à la livraison</p>
    <p>📱 Orange Money : +223 70 20 46 64 </p>

    <a
      href="https://wa.me/22394419746"
      target="_blank"
      rel="noreferrer"
    >
      💬 J’ai effectué le paiement
    </a>
  </div>
)}

{zone === "autre" && (
  <div className="payment-card">
    <h3>🌍 Hors Bamako / International</h3>
    <p>✅ Paiement à 100 % avant expédition</p>
    <p>📱 Orange Money : +223 70 20 46 64 </p>

    <a
      href="https://wa.me/22394419746"
      target="_blank"
      rel="noreferrer"
    >
      💬 Envoyer ma preuve de paiement
    </a>
  </div>
)}
      
  
  </div>
  );
}

export default PaiementPage;

