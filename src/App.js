import './App.css';
import { Routes, Route } from "react-router-dom";
import Bienvenue from './Bienvenue';
import CategoriePage from './CategoriePage';
import ProduitPage from "./ProduitPage";
import AdminPage from "./AdminPage";
import FavorisPage from "./FavorisPage";
import PanierPage from "./PanierPage";
import CommandesPage from "./CommandesPage";
function App() {
  return (
    <Routes>
  <Route path="/" element={<Bienvenue />} />
  <Route path="/admin" element={<AdminPage />} />
  <Route path="/favoris" element={<FavorisPage />} />
  <Route path="/panier" element={<PanierPage />} />
  <Route path="/commandes" element={<CommandesPage />} />
  <Route
  path="/categorie/:nomCategorie"
  element={<CategoriePage />}
/>
<Route path="/produit/:id" element={<ProduitPage />} />
</Routes>
  );
}

export default App;