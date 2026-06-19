import { useState, useEffect } from "react";

function PanierPage() {
  const [panier, setPanier] = useState(() => {
    const panierSauvegarde = localStorage.getItem("panier");
    return panierSauvegarde ? JSON.parse(panierSauvegarde) : [];
  });
  const [nomClient, setNomClient] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");

  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(panier));
  }, [panier]);

  const totalPrix = panier.reduce(
    (sum, item) => sum + item.prix * item.quantite, 0
  );

  const augmenterQuantite = (id) => {
    setPanier(panier.map((item) =>
      item.id === id ? { ...item, quantite: item.quantite + 1 } : item
    ));
  };

  const diminuerQuantite = (id) => {
    setPanier(panier
      .map((item) =>
        item.id === id ? { ...item, quantite: item.quantite - 1 } : item
      )
      .filter((item) => item.quantite > 0)
    );
  };

  const supprimerProduit = (id) => {
    setPanier(panier.filter((item) => item.id !== id));
  };

  const commanderWhatsApp = () => {
    const message = panier
      .map((item) =>
        `- ${item.nom} x${item.quantite} = ${item.prix * item.quantite} FCFA`
      )
      .join("\n");
    const texte = `Bonjour, je souhaite commander :\n\n${message}\n\nTotal : ${totalPrix} FCFA\n\nNom : ${nomClient}\nTéléphone : ${telephone}\nAdresse : ${adresse}`;
    const numero = "22394419746";
    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(texte)}`,
      "_blank"
    );
  };

  return (
    <div className="App">
      <a href="/" className="retour-accueil">⬅ Retour à l'accueil</a>
      <h1>🛒 Ton panier</h1>

      {panier.length === 0 && (
        <div className="empty-state">
          <h2>🛒 Panier vide</h2>
          <p>Tu n'as pas encore ajouté d'article.</p>
          <a href="/">Découvrir les produits</a>
        </div>
      )}

      <div className="produits-grid">
        {panier.map((produit) => (
          <div key={produit.id} className="produit-card">
            <img src={produit.image} alt={produit.nom} className="image-produit" />
            <h3>{produit.nom}</h3>
            <p>Quantité : {produit.quantite}</p>
            <p className="prix">{produit.prix * produit.quantite} FCFA</p>
            <button onClick={() => augmenterQuantite(produit.id)}>➕</button>
            <button onClick={() => diminuerQuantite(produit.id)}>➖</button>
            <button onClick={() => supprimerProduit(produit.id)}>❌ Supprimer</button>
          </div>
        ))}
      </div>

      <h2>Total : {totalPrix} FCFA</h2>

      {panier.length > 0 && (
        <div className="admin-form">
          <input
            type="text"
            placeholder="Votre nom"
            value={nomClient}
            onChange={(e) => setNomClient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
        </div>
      )}

      {panier.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center", marginTop: "20px" }}>
          <button onClick={commanderWhatsApp}>
            📲 Commander sur WhatsApp
          </button>
          <a href="/paiement" className="btn-paiement">
            ✅ Procéder au paiement
          </a>
        </div>
      )}
    </div>
  );
}

export default PanierPage;