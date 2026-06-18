import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function CategoriePage() {
  const { nomCategorie } = useParams();
  const [produitsFirebase, setProduitsFirebase] = useState([]);

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

  const produitsFiltres = tousLesProduits.filter(
    (produit) => produit.categorie === nomCategorie
  );

  return (
    <div className="App">
      <a href="/" className="retour-accueil">
  ⬅ Retour à l’accueil
</a>
      <h1>🛍️ {nomCategorie}</h1>

      {produitsFiltres.length === 0 && (
        <p>Aucun produit dans cette catégorie.</p>
      )}

      <div className="produits-grid">
        {produitsFiltres.map((produit) => (
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

export default CategoriePage;