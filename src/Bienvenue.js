import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

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
  }, [favoris]);
  useEffect(() => {
  localStorage.setItem("panier", JSON.stringify(panier));
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
        item.id === id
          ? { ...item, quantite: item.quantite + 1 }
          : item
      )
    );
  };

  const diminuerQuantite = (id) => {
    setPanier((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantite: item.quantite - 1 }
            : item
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
      {notification && (
  <div className="notification">
    {notification}
  </div>
)}
      <nav className="navbar">
  <div className="logo-box">
    <span className="logo-icon">🛍️</span>
    <h1>Den ni Ba</h1>
  </div>

  <div className="nav-links">
    <a href="/">Accueil</a>
    <a href="/">Produits</a>
    <a href="/favoris">❤️ Favoris ({favoris.length})</a>
    <a href="/panier">🛒 Panier ({totalArticles})</a>
    <a href="/admin" className="admin-link">Admin</a>
  </div>
</nav>

      <section className="banner">
        <div className="banner-text">
          <h1>✨ Nouvelle collection bébé</h1>
          <p>
            Vêtements, soins et accessoires pour enfants de 0 à 11 ans.
          </p>
          <button>Découvrir la boutique</button>
        </div>
      </section>
       <section className="categories-populaires">
        <section className="pourquoi-section">

  <div className="pourquoi-text">
    <h2>Pourquoi choisir Den ni Ba ?</h2>

    <p>
      Chez Den ni Ba, nous sélectionnons des
      vêtements et accessoires bébé avec amour,
      douceur et qualité pour accompagner vos enfants.
    </p>

    <button>
      Découvrir la collection
    </button>
  </div>

</section>
  <h2>Nos catégories populaires</h2>

  <div className="categories-pop-grid">
    <a href="/categorie/Vêtements">👕 Vêtements</a>
    <a href="/categorie/Chaussures">👟 Chaussures</a>
    <a href="/categorie/Biberons">🍼 Biberons</a>
    <a href="/categorie/Soins">🧴 Soins bébé</a>
  </div>
</section>
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

      <section className="panier-section">
        <h2>🛒 Ton panier</h2>

        <p>Articles : {totalArticles}</p>
        <p>Total : {totalPrix} FCFA</p>

        {panier.length > 0 && (
          <button onClick={commanderWhatsApp}>
            📲 Commander sur WhatsApp
          </button>
        )}

        {panier.length === 0 && <p>Ton panier est vide pour le moment.</p>}

        {panier.map((item, index) => (
          <div key={item.id} className="panier-card">
            <p>
              {item.nom} - {item.prix} FCFA x {item.quantite}
            </p>

            <button onClick={() => supprimerDuPanier(index)}>
              ❌ Supprimer
            </button>

            <button onClick={() => augmenterQuantite(item.id)}>
              ➕
            </button>

            <button onClick={() => diminuerQuantite(item.id)}>
              ➖
            </button>
          </div>
        ))}
      </section>

      <section className="produits-section">
        <h2>🛍️ Nos produits</h2>
         {chargement && (
  <p>Chargement des produits...</p>
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
             <span className="badge-nouveau">
  ✨ Nouveau
</span>
                <h3>{produit.nom}</h3>
              </a>

              <p>🏷️ Marque : {produit.marque}</p>
              <p>👶 Âge : {produit.age}</p>
              <p>
                📏 Taille : {produit.taille || produit.tailles?.join(" • ")}
              </p>
              {Number(produit.stock) > 0 ? (
  <span className="badge-stock">
    🟢 En stock
  </span>
) : (
  <span className="badge-rupture">
    🔴 Rupture
  </span>
)}

              <p className="categorie">{produit.categorie}</p>

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

      <footer className="footer">

  <h2>🛍️ Den ni Ba</h2>

  <p>
    Vêtements et accessoires bébé ❤️
  </p>

  <div className="reseaux">

    <a href="/">
      TikTok
    </a>

    <a href="/">
      Instagram
    </a>

    <a href="/">
      Facebook
    </a>

    <a
      href="https://wa.me/22394419746"
      target="_blank"
      rel="noreferrer"
    >
      WhatsApp
    </a>

  </div>

  <p className="copyright">
    © 2026 Den ni Ba - Tous droits réservés
  </p>

</footer>
<section className="engagements-clients">

  <h2>🌟 Nos engagements clients</h2>

  <div className="engagements-grid">

    <div className="engagement-client-card">
      <h3>💜 Satisfaction</h3>

      <p>
        Nous faisons notre maximum pour satisfaire chaque famille.
      </p>
    </div>

    <div className="engagement-client-card">
      <h3>🚚 Livraison</h3>

      <p>
        Des expéditions rapides et un suivi simple des commandes.
      </p>
    </div>

    <div className="engagement-client-card">
      <h3>💬 Assistance</h3>

      <p>
        Une assistance disponible pour répondre à vos questions.
      </p>
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
<section className="contact-section">

  <h2>💜 Contactez-nous</h2>

  <p>
    Une question ? Une commande ?
    Nous sommes disponibles sur WhatsApp.
  </p>

  <a
    href="https://wa.me/22394419746"
    target="_blank"
    rel="noreferrer"
    className="contact-btn"
  >
    💬 Écrire sur WhatsApp
  </a>

</section>
<section className="faq-section">

  <h2>❓ Questions fréquentes</h2>

  <div className="faq-grid">

    <div className="faq-card">
      <h3>🚚 Faites-vous des livraisons ?</h3>

      <p>
        Oui, selon votre ville et disponibilité.
      </p>
    </div>

    <div className="faq-card">
      <h3>💬 Comment commander ?</h3>

      <p>
        Vous pouvez commander directement via WhatsApp.
      </p>
    </div>

    <div className="faq-card">
      <h3>👶 Quels âges sont disponibles ?</h3>

      <p>
        Nos articles vont du nouveau-né jusqu’à 11 ans.
      </p>
    </div>

  </div>

</section>
<section className="galerie-section">

  <h2>📸 Inspiration bébé</h2>

  <div className="galerie-grid">

    <div className="galerie-card">
      <img
        src="/bebe.png"
        alt="Bébé"
      />
    </div>

    <div className="galerie-card">
      <img
        src="/body.jpg"
        alt="Collection bébé"
      />
    </div>

    <div className="galerie-card">
      <img
        src="/pyjama.jpg"
        alt="Mode enfant"
      />
    </div>

  </div>

</section>
<section className="coup-coeur-section">

  <h2>🌸 Coup de cœur Den ni Ba</h2>

  <div className="coup-coeur-card">

    <div className="coup-coeur-text">

      <h3>Des articles choisis avec amour 💜</h3>

      <p>
        Chaque collection est pensée pour apporter
        douceur, élégance et confort aux enfants.
      </p>

      <button>
        Découvrir maintenant
      </button>

    </div>

  </div>

</section>
<section className="collections-section">

  <h2>🛍️ Collections du moment</h2>

  <div className="collections-grid">

    <div className="collection-card">
      <h3>🌸 Collection fille</h3>

      <p>
        Des vêtements doux et élégants pour les petites princesses.
      </p>
    </div>

    <div className="collection-card">
      <h3>🧸 Collection garçon</h3>

      <p>
        Des tenues modernes et confortables pour les petits aventuriers.
      </p>
    </div>

    <div className="collection-card">
      <h3>👶 Nouveau-né</h3>

      <p>
        Tout le nécessaire pour accueillir bébé avec douceur.
      </p>
    </div>

  </div>

</section>
<section className="valeurs-section">

  <h2>✨ Nos valeurs</h2>

  <div className="valeurs-grid">

    <div className="valeur-card">
      <h3>💜 Bienveillance</h3>

      <p>
        Nous choisissons chaque article avec attention
        pour le bien-être des enfants.
      </p>
    </div>

    <div className="valeur-card">
      <h3>🌸 Élégance</h3>

      <p>
        Des collections modernes et adorables pour
        accompagner chaque moment.
      </p>
    </div>

    <div className="valeur-card">
      <h3>👶 Confort</h3>

      <p>
        Le confort des bébés reste notre priorité.
      </p>
    </div>

  </div>

</section>
<section className="histoire-section">

  <div className="histoire-content">

    <h2>💜 L’histoire de Den ni Ba</h2>

    <p>
      Den ni Ba est une boutique pensée avec amour
      pour les bébés et les enfants.
      Notre objectif est de proposer des articles
      doux, élégants et confortables pour accompagner
      chaque famille au quotidien.
    </p>

    <p>
      Nous croyons que chaque enfant mérite des
      vêtements et accessoires choisis avec soin 🌸
    </p>

  </div>

</section>
<section className="livraison-section">

  <h2>🌍 Livraison & Contact</h2>

  <div className="livraison-grid">

    <div className="livraison-card">
      <h3>🚚 Livraison</h3>

      <p>
        Livraison disponible selon votre ville.
      </p>
    </div>

    <div className="livraison-card">
      <h3>💬 WhatsApp</h3>

      <p>
        Contact rapide pour les commandes et questions.
      </p>
    </div>

    <div className="livraison-card">
      <h3>📍 Boutique</h3>

      <p>
        Den ni Ba - Mode bébé & enfants 💜
      </p>
    </div>

  </div>

</section>
<section className="ages-section">

  <h2>🍼 Pour tous les âges</h2>

  <div className="ages-grid">

    <div className="age-card">
      👶 0 - 6 mois
    </div>

    <div className="age-card">
      🧸 6 - 12 mois
    </div>

    <div className="age-card">
      🌸 1 - 3 ans
    </div>

    <div className="age-card">
      🎒 4 - 11 ans
    </div>

  </div>

</section>
<section className="engagement-section">

  <h2>👶 Notre engagement</h2>

  <div className="engagement-grid">

    <div className="engagement-card">
      <h3>🌸 Douceur</h3>

      <p>
        Des matières agréables pour le confort des bébés.
      </p>
    </div>

    <div className="engagement-card">
      <h3>🛍️ Qualité</h3>

      <p>
        Des produits soigneusement sélectionnés.
      </p>
    </div>

    <div className="engagement-card">
      <h3>💜 Confiance</h3>

      <p>
        Une boutique pensée avec amour pour les familles.
      </p>
    </div>

  </div>

</section>
<section className="newsletter">

  <h2>💌 Restez informé</h2>

  <p>
    Recevez les nouveautés et collections bébé Den ni Ba.
  </p>

  <div className="newsletter-box">

    <input
      type="email"
      placeholder="Votre adresse email"
    />

    <button>
      S’inscrire
    </button>

  </div>

</section>
<section className="social-section">

  <h2>📲 Rejoignez Den ni Ba</h2>

  <p>
    Suivez-nous pour découvrir les nouveautés bébé 💜
  </p>

  <div className="social-grid">

    <a href="/" className="social-card">
      🎵 TikTok
    </a>

    <a href="/" className="social-card">
      📸 Instagram
    </a>

    <a href="/" className="social-card">
      👍 Facebook
    </a>

    <a
      href="https://wa.me/22394419746"
      target="_blank"
      rel="noreferrer"
      className="social-card"
    >
      💬 WhatsApp
    </a>

  </div>

</section>
<section className="avis-section">

  <h2>⭐ Avis de nos clients</h2>

  <div className="avis-grid">

    <div className="avis-card">
      <p>
        “Très belle qualité et livraison rapide 😍”
      </p>

      <h4>— Awa</h4>
    </div>

    <div className="avis-card">
      <p>
        “Les vêtements sont magnifiques pour bébé ❤️”
      </p>

      <h4>— Mariam</h4>
    </div>

    <div className="avis-card">
      <p>
        “Service WhatsApp très pratique et gentil 👶”
      </p>

      <h4>— Fatou</h4>
    </div>

  </div>

</section>
<section className="avantages">

  <div className="avantage-card">
    <h3>🚚 Livraison rapide</h3>
    <p>Recevez vos articles rapidement.</p>
  </div>

  <div className="avantage-card">
    <h3>💬 Support WhatsApp</h3>
    <p>Nous restons disponibles pour vous aider.</p>
  </div>

  <div className="avantage-card">
    <h3>👶 Qualité bébé</h3>
    <p>Des articles pensés pour le confort des enfants.</p>
  </div>

</section>
    </div>
  );
}

export default Bienvenue;
