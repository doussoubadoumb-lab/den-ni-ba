import { useEffect, useState } from "react";

import { db } from "../firebase";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

function CommandesPage() {
  const [motDePasse, setMotDePasse] = useState("");
  const [connecte, setConnecte] = useState(false);
  const [commandes, setCommandes] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  useEffect(() => {

    const chargerCommandes = async () => {

      const querySnapshot =
        await getDocs(
          collection(db, "commandes")
        );

      const listeCommandes =
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

      setCommandes(listeCommandes);
    };

    chargerCommandes();

  }, []);
  const supprimerCommande = async (id) => {
  await deleteDoc(doc(db, "commandes", id));

  setCommandes(
    commandes.filter((commande) => commande.id !== id)
  );
};
const changerStatut = async (id, nouveauStatut) => {
  await updateDoc(doc(db, "commandes", id), {
    statut: nouveauStatut
  });

  setCommandes(
    commandes.map((commande) =>
      commande.id === id
        ? { ...commande, statut: nouveauStatut }
        : commande
    )
  );
};
const totalVentes = commandes.reduce(
  (total, commande) => total + Number(commande.total),
  0
);
const commandesFiltrees = commandes.filter(
  (commande) => {

    const correspondRecherche =
      commande.nomClient
        .toLowerCase()
        .includes(recherche.toLowerCase());

    const correspondStatut =
      filtreStatut === "Tous"
        ? true
        : commande.statut === filtreStatut;

    return (
      correspondRecherche &&
      correspondStatut
    );
  }
);
if (!connecte) {
  return (
    <div className="App">
      <h1>🔐 Connexion commandes</h1>

      <div className="admin-form">
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
        />

        <button
          onClick={async () => {
            try {
              await signInWithEmailAndPassword(
                auth,
                "doussoubadoumb@gmail.com",
                motDePasse
              );

              setConnecte(true);
            } catch (error) {
              alert("Mot de passe incorrect");
            }
          }}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
  return (

    <div className="App">
   <input
  type="text"
  placeholder="🔍 Rechercher un client..."
  value={recherche}
  onChange={(e) => setRecherche(e.target.value)}
  className="search-input"
/> 
<select
  value={filtreStatut}
  onChange={(e) => setFiltreStatut(e.target.value)}
  className="search-input"
>

  <option value="Tous">
    Tous les statuts
  </option>

  <option value="En attente">
    En attente
  </option>

  <option value="En livraison">
    En livraison
  </option>

  <option value="Livrée">
    Livrée
  </option>

</select>
      <h1>📦 Commandes clients</h1>
      <div className="dashboard-grid">
 <div className="dashboard-card">
  <h2>{totalVentes} FCFA</h2>
  <p>Total ventes</p>
</div>
  <div className="dashboard-card">
    <h2>{commandes.length}</h2>
    <p>Commandes totales</p>
  </div>

  <div className="dashboard-card">
    <h2>
      {commandes.filter(c => c.statut === "En attente").length}
    </h2>
    <p>En attente</p>
  </div>

  <div className="dashboard-card">
    <h2>
      {commandes.filter(c => c.statut === "En livraison").length}
    </h2>
    <p>En livraison</p>
  </div>

  <div className="dashboard-card">
    <h2>
      {commandes.filter(c => c.statut === "Livrée").length}
    </h2>
    <p>Livrées</p>
  </div>

</div>
<h2>🕒 Commandes récentes</h2>
    {commandesFiltrees.length === 0 && (
  <div className="empty-state">
    <h2>📭 Aucune commande trouvée</h2>
    <p>Essaie une autre recherche ou un autre statut.</p>
  </div>
)}
      {commandesFiltrees.map((commande) => (
   
        <div
          key={commande.id}
          className="commande-card"
        >
         <button onClick={() => supprimerCommande(commande.id)}>
  ❌ Supprimer la commande
</button>
          <h3>
            👤 {commande.nomClient}
          </h3>

          <p>
            📞 {commande.telephone}
          </p>
        <a
  href={`https://wa.me/${commande.telephone}`}
  target="_blank"
  rel="noreferrer"
  className="whatsapp-btn"
>
  💬 Contacter sur WhatsApp
</a>
          <p>
            📍 {commande.adresse}
          </p>
        <p>
  📅 {
    commande.date?.seconds
      ? new Date(
          commande.date.seconds * 1000
        ).toLocaleDateString()
      : "Date inconnue"
  }
</p>
          <p>
            💰 {commande.total} FCFA
          </p>
          <p>
  🛍️ Articles :
  {commande.produits.length}
</p>
          <p
  className={
    commande.statut === "Livrée"
      ? "statut-livree"
      : commande.statut === "En livraison"
      ? "statut-livraison"
      : "statut-attente"
  }
>
  📦 Statut : {commande.statut}
</p>
          <div>
  <button onClick={() => changerStatut(commande.id, "En attente")}>
    ⏳ En attente
  </button>

  <button onClick={() => changerStatut(commande.id, "En livraison")}>
    🚚 En livraison
  </button>

  <button onClick={() => changerStatut(commande.id, "Livrée")}>
    ✅ Livrée
  </button>
</div>
       <div className="commande-produits">

  <h4>🛍️ Produits :</h4>

  {commande.produits.map((produit, index) => (

    <div key={index}>

      <p>
        {produit.nom}
      </p>

    </div>

  ))}

</div>
        </div>

      ))}

    </div>
  
  );
}

export default CommandesPage;