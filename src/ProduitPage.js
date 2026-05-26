import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
function ProduitPage() {
  const { id } = useParams();
  const [produitsFirebase, setProduitsFirebase] = useState([]);
  useEffect(() => {
  const chargerProduits = async () => {

    const querySnapshot = await getDocs(
      collection(db, "produits")
    );

    const listeProduits = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    setProduitsFirebase(listeProduits);
  };

  chargerProduits();
}, []);
  

  const [tailleChoisie, setTailleChoisie] = useState("");
  const [imageActive, setImageActive] = useState("");
  const tousLesProduits = produitsFirebase;

const produit = tousLesProduits.find(
  (item) => String(item.id) === String(id)
);

  if (!produit) {
    return (
      <div className="App">
        <a href="/" className="retour-accueil">
  ⬅ Retour à l’accueil
</a>
        <h1>Produit introuvable</h1>
      </div>
    );
  }
  if (!imageActive) {
  setImageActive(produit.image);
}
  return (
    <div className="App">
    <button
  onClick={() => window.history.back()}
>
  ⬅ Retour
</button>
      <div className="fiche-produit">
        <div>
  <img
  src={produit.image}
  alt={produit.nom}
  className="image-produit-detail"
/>

  <div className="miniatures">
    {produit.images?.map((img) => (
      <img
        key={img}
        src={img}
        alt={produit.nom}
        className="miniature"
        onClick={() => setImageActive(img)}
      />
    ))}
  </div>
</div>

        <div className="fiche-info">
          <h1>{produit.nom}</h1>

          <p>🏷️ Marque : {produit.marque}</p>
          <p>👶 Âge : {produit.age}</p>
          <p>📦 Stock : {produit.stock}</p>

          <p className="description">
            {produit.description}
          </p>

          <div className="tailles">
            {produit.tailles?.map((taille) => (
              <button
                key={taille}
                onClick={() => setTailleChoisie(taille)}
                className={tailleChoisie === taille ? "taille-active" : ""}
              >
                {taille}
              </button>
            ))}
          </div>

          <h2>{produit.prix} FCFA</h2>

          <button
  disabled={
    produit.tailles && !tailleChoisie
  }
>
  🛒 Ajouter au panier
</button>
        </div>
      </div>
    </div>
  );
}

export default ProduitPage;