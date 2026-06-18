import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AProposPage() {
  return (
    <div className="App">
      <Navbar />

      <section className="pourquoi-section">
        <div className="pourquoi-text">
          <h2>Pourquoi choisir Den ni Ba ?</h2>
          <p>
            Chez Den ni Ba, nous sélectionnons des vêtements et
            accessoires bébé avec amour, douceur et qualité pour
            accompagner vos enfants.
          </p>
        </div>
      </section>

      <section className="valeurs-section">
        <h2>✨ Nos valeurs</h2>
        <div className="valeurs-grid">
          <div className="valeur-card">
            <h3>💜 Bienveillance</h3>
            <p>Nous choisissons chaque article avec attention pour le bien-être des enfants.</p>
          </div>
          <div className="valeur-card">
            <h3>🌸 Élégance</h3>
            <p>Des collections modernes et adorables pour accompagner chaque moment.</p>
          </div>
          <div className="valeur-card">
            <h3>👶 Confort</h3>
            <p>Le confort des bébés reste notre priorité.</p>
          </div>
        </div>
      </section>

      <section className="histoire-section">
        <div className="histoire-content">
          <h2>💜 L’histoire de Den ni Ba</h2>
          <p>
            Den ni Ba est une boutique pensée avec amour pour les bébés
            et les enfants. Notre objectif est de proposer des articles
            doux, élégants et confortables pour accompagner chaque
            famille au quotidien.
          </p>
          <p>
            Nous croyons que chaque enfant mérite des vêtements et
            accessoires choisis avec soin 🌸
          </p>
        </div>
      </section>

      <section className="engagements-clients">
        <h2>🌟 Nos engagements</h2>
        <div className="engagements-grid">
          <div className="engagement-client-card">
            <h3>🌸 Qualité</h3>
            <p>Des matières douces et des produits soigneusement sélectionnés.</p>
          </div>
          <div className="engagement-client-card">
            <h3>🚚 Livraison rapide</h3>
            <p>Des expéditions rapides et un suivi simple des commandes.</p>
          </div>
          <div className="engagement-client-card">
            <h3>💬 Support WhatsApp</h3>
            <p>Une assistance disponible pour répondre à toutes vos questions.</p>
          </div>
        </div>
      </section>

      <section className="avis-section">
        <h2>⭐ Avis de nos clients</h2>
        <div className="avis-grid">
          <div className="avis-card">
            <p>“Très belle qualité et livraison rapide 😍”</p>
            <h4>— Awa</h4>
          </div>
          <div className="avis-card">
            <p>“Les vêtements sont magnifiques pour bébé ❤️”</p>
            <h4>— Mariam</h4>
          </div>
          <div className="avis-card">
            <p>“Service WhatsApp très pratique et gentil 👶”</p>
            <h4>— Fatou</h4>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2>❓ Questions fréquentes</h2>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>🚚 Faites-vous des livraisons ?</h3>
            <p>Oui, selon votre ville et disponibilité.</p>
          </div>
          <div className="faq-card">
            <h3>💬 Comment commander ?</h3>
            <p>Vous pouvez commander directement via WhatsApp.</p>
          </div>
          <div className="faq-card">
            <h3>👶 Quels âges sont disponibles ?</h3>
            <p>Nos articles vont du nouveau-né jusqu’à 11 ans.</p>
          </div>
        </div>
      </section>

      <section className="livraison-section">
        <h2>🌍 Livraison & Contact</h2>
        <div className="livraison-grid">
          <div className="livraison-card">
            <h3>🚚 Livraison</h3>
            <p>Livraison disponible selon votre ville.</p>
          </div>
          <div className="livraison-card">
            <h3>💬 WhatsApp</h3>
            <p>Contact rapide pour les commandes et questions.</p>
          </div>
          <div className="livraison-card">
            <h3>📍 Boutique</h3>
            <p>Den ni Ba - Mode bébé & enfants 💜</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>💜 Contactez-nous</h2>
        <p>Une question ? Une commande ? Nous sommes disponibles sur WhatsApp.</p>
        <a
          href="https://wa.me/22394419746"
          target="_blank"
          rel="noreferrer"
          className="contact-btn"
        >
          💬 Écrire sur WhatsApp
        </a>
      </section>

      <Footer />
    </div>
  );
}

export default AProposPage;