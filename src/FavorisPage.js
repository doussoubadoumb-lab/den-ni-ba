import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function FavorisPage() {
  const [produitsFirebase, setProduitsFirebase] = useState([]);

  const favorisSauvegardes = localStorage.getItem("favoris");
  const favoris = favorisSauvegardes ? JSON.parse(favorisSauvegardes) : [];

  useEffect(() => {
    const chargerProduits = async () => {
      const querySnapshot = await getDocs(collection(db, "produits"));

      const listeProduits = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setProduitsFirebase(listeProduits);
    };

    chargerProduits();
  }, []);

  const tousLesProduits = produitsFirebase;

  const produitsFavoris = tousLesProduits.filter((produit) =>
    favoris.includes(produit.id)
  );

  return (
    <div className="App">
      <a href="/" className="retour-accueil">
  ⬅ Retour à l’accueil
</a>
      <h1>❤️ Mes favoris</h1>

      {produitsFavoris.length === 0 && (
        <div className="empty-state">
  <h2>❤️ Aucun favori</h2>
  <p>Ajoute tes coups de cœur pour les retrouver ici.</p>
  <a href="/">Voir les produits</a>
</div>
      )}

      <div className="produits-grid">
        {produitsFavoris.map((produit) => (
          <div key={produit.id} className="produit-card">
            <a href={`/produit/${produit.id}`}>
              <img
                src={produit.image}
                alt={produit.nom}
                className="image-produit"
              />

              <h3>{produit.nom}</h3>
            </a>

            <p>{produit.prix} FCFA</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavorisPage;