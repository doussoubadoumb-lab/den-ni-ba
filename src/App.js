import './App.css';
import { Routes, Route } from "react-router-dom";
import Bienvenue from './Bienvenue';
import CategoriePage from './pages/CategoriePage';
import ProduitPage from "./pages/ProduitPage";
import AdminPage from "./pages/AdminPage";
import FavorisPage from "./pages/FavorisPage";
import PanierPage from "./pages/PanierPage";
import CommandesPage from "./pages/CommandesPage";
import AProposPage from "./pages/AProposPage";
import PaiementPage from "./pages/PaiementPage";
function App() {
  return (
    <Routes>
  <Route path="/" element={<Bienvenue />} />
  <Route path="/admin" element={<AdminPage />} />
  <Route path="/favoris" element={<FavorisPage />} />
  <Route path="/panier" element={<PanierPage />} />
  <Route path="/commandes" element={<CommandesPage />} />
  <Route path="/a-propos" element={<AProposPage />} />
  <Route path="/paiement" element={<PaiementPage />} />
  <Route
  path="/categorie/:nomCategorie"
  element={<CategoriePage />}
/>
<Route path="/produit/:id" element={<ProduitPage />} />
</Routes>
  );
}

export default App;