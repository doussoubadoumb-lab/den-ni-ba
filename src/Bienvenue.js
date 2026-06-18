import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function Bienvenue() {
  const [panier, setPanier] = useState(() => {
    const panierSauvegarde = localStorage.getItem("panier");
    return panierSauvegarde ? JSON.parse(panierSauvegarde) : [];
  });
  const [favoris, setFavoris] = useState(() => {
    const favorisSauvegardes = localStorage.getItem("favoris");
    return favorisSauvegardes ? JSON.parse(favorisSauvegardes) : [];
  });
  const [produitsFirebase, setProduitsFirebase] = useState([]);
  const [categorieActive, setCategorieActive] = useState("Tous");
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    localStorage.setItem("favoris", JSON.stringify(favoris));
    window.dispatchEvent(new Event("majCompteurs"));
  }, [favoris]);

  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(panier));
    window.dispatchEvent(new Event("majCompteurs"));
  }, [panier]);

  const categories = [
    "Tous",
    "Vêtements",
    "Chaussures",
    "Accessoires",
    "Soins",
    "Biberons",
    "Sacs"
  ];

  const tousLesProduits = produitsFirebase;

  useEffect(() => {
    const chargerProduits = async () => {
      const querySnapshot = await getDocs(collection(db, "produits"));
      const listeProduits = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProduitsFirebase(listeProduits);
    };
    setChargement(false);
    chargerProduits();
  }, []);

  const produitsFiltres = tousLesProduits.filter((produit) => {
    const correspondCategorie =
      categorieActive === "Tous" || produit.categorie === categorieActive;
    const correspondRecherche = produit.nom
      .toLowerCase()
      .includes(recherche.toLowerCase());
    return correspondCategorie && correspondRecherche;
  });

  const totalArticles = panier.reduce(
    (total, item) => total + item.quantite,
    0
  );

  const totalPrix = panier.reduce(
    (sum, item) => sum + item.prix * item.quantite,
    0
  );

  const commanderWhatsApp = () => {
    const message = panier
      .map(
        (item) =>
          `- ${item.nom} x${item.quantite} = ${
            item.prix * item.quantite
          } FCFA`
      )
      .join("\n");
    const texte = `Bonjour, je souhaite commander :\n\n${message}\n\nTotal : ${totalPrix} FCFA`;
    const numero = "22394419746";
    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(texte)}`,
      "_blank"
    );
  };

  const ajouterAuPanier = (produit) => {
    if (produit.stock === 0) return;
    setPanier((prev) => {
      const existe = prev.find((item) => item.id === produit.id);
      if (existe) {
        return prev.map((item) =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      }
      setNotification("✅ Produit ajouté au panier");
      setTimeout(() => {
        setNotification("");
      }, 2500);
      return [...prev, { ...produit, quantite: 1 }];
    });
  };

  const supprimerDuPanier = (index) => {
    setPanier((prev) => prev.filter((_, i) => i !== index));
  };

  const augmenterQuantite = (id) => {
    setPanier((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantite: item.quantite + 1 } : item
      )
    );
  };

  const diminuerQuantite = (id) => {
    setPanier((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantite: item.quantite - 1 } : item
        )
        .filter((item) => item.quantite > 0)
    );
  };

  const changerFavori = (id) => {
    if (favoris.includes(id)) {
      setFavoris(favoris.filter((favoriId) => favoriId !== id));
      setNotification("❌ Retiré des favoris");
    } else {
      setFavoris([...favoris, id]);
      setNotification("❤️ Ajouté aux favoris");
    }
    setTimeout(() => {
      setNotification("");
    }, 2500);
  };

  return (
    <div className="App">
      {notification && <div className="notification">{notification}</div>}

      <Navbar />

      <section className="banner">
        <div className="banner-text">
          <h1>✨ Nouvelle collection bébé</h1>
          <p>Vêtements, soins et accessoires pour enfants de 0 à 11 ans.</p>
          <button>Découvrir la boutique</button>
        </div>
      </section>

      <div className="toolbar-produits">
  <input
    type="text"
    placeholder="Rechercher un produit..."
    value={recherche}
    onChange={(e) => setRecherche(e.target.value)}
    className="search-input"
  />

  <div className="categories">
    {categories.map((categorie) => (
      <button
        key={categorie}
        onClick={() => setCategorieActive(categorie)}
        className={categorieActive === categorie ? "categorie-active" : ""}
      >
        {categorie}
      </button>
    ))}
  </div>
</div>

      <section className="produits-section">
        <h2>🛍️ Nos produits</h2>
        {chargement && <p>Chargement des produits...</p>}
        <div className="produits-grid">
          {produitsFiltres.map((produit) => (
            <div key={produit.id} className="produit-card">
  <a href={`/produit/${produit.id}`}>
    <img
      src={produit.image}
      alt={produit.nom}
      className="image-produit"
    />
    <span className="badge-nouveau">✨ Nouveau</span>
    <h3>{produit.nom}</h3>
  </a>

  {Number(produit.stock) > 0 ? (
    <span className="badge-stock">🟢 En stock</span>
  ) : (
    <span className="badge-rupture">🔴 Rupture</span>
  )}

  <p className="prix">{produit.prix} FCFA</p>

  <button onClick={() => changerFavori(produit.id)}>
    {favoris.includes(produit.id) ? "❤️" : "🤍"}
  </button>

  <button
    onClick={() => ajouterAuPanier(produit)}
    disabled={produit.stock === 0}
  >
    🛒 Ajouter au panier
  </button>
</div>
          ))}
        </div>
      </section>

      <section className="coup-coeur-section">
        <h2>🌸 Coup de cœur Den ni Ba</h2>
        <div className="coup-coeur-card">
          <div className="coup-coeur-text">
            <h3>Des articles choisis avec amour 💜</h3>
            <p>
              Chaque collection est pensée pour apporter douceur, élégance
              et confort aux enfants.
            </p>
            <button>Découvrir maintenant</button>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h2>500+</h2>
            <p>Articles bébé</p>
          </div>
          <div className="stat-card">
            <h2>100%</h2>
            <p>Clients satisfaits</p>
          </div>
          <div className="stat-card">
            <h2>24h</h2>
            <p>Réponse WhatsApp</p>
          </div>
          <div className="stat-card">
            <h2>0-11</h2>
            <p>Ans disponibles</p>
          </div>
        </div>
      </section>

      <section className="newsletter">
        <h2>💌 Restez informé</h2>
        <p>Recevez les nouveautés et collections bébé Den ni Ba.</p>
        <div className="newsletter-box">
          <input type="email" placeholder="Votre adresse email" />
          <button>S’inscrire</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Bienvenue;