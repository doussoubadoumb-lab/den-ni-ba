import { useState, useEffect } from "react";

function Navbar() {
  const [favorisCount, setFavorisCount] = useState(0);
  const [panierCount, setPanierCount] = useState(0);

  useEffect(() => {
    const majCompteurs = () => {
      const favoris = JSON.parse(localStorage.getItem("favoris")) || [];
      const panier = JSON.parse(localStorage.getItem("panier")) || [];

      setFavorisCount(favoris.length);
      setPanierCount(
        panier.reduce((total, item) => total + item.quantite, 0)
      );
    };

    majCompteurs();

    window.addEventListener("majCompteurs", majCompteurs);

    return () => {
      window.removeEventListener("majCompteurs", majCompteurs);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo-box">
        <span className="logo-icon">🛍️</span>
        <h1>Den ni Ba</h1>
      </div>

      <div className="nav-links">
        <a href="/">Accueil</a>
        <a href="/">Produits</a>
<a href="/a-propos">À propos</a>
        <a href="/favoris">❤️ Favoris ({favorisCount})</a>
        <a href="/panier">🛒 Panier ({panierCount})</a>
        <a href="/admin" className="admin-link">Admin</a>
      </div>
    </nav>
  );
}

export default Navbar;