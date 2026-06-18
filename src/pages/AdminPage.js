import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs
} from "firebase/firestore";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword
} from "firebase/auth";
function AdminPage() {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("");
  const [marque, setMarque] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [idModification, setIdModification] = useState(null);
  const [taille, setTaille] = useState("");
  const [uploadEnCours, setUploadEnCours] = useState(false);
  const [produitsAdmin, setProduitsAdmin] = useState([]);
 const [motDePasse, setMotDePasse] = useState("");
const [connecte, setConnecte] = useState(false);
  useEffect(() => {

  const chargerProduits = async () => {

    const querySnapshot =
      await getDocs(
        collection(db, "produits")
      );

    const listeProduits =
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

    setProduitsAdmin(listeProduits);
  };

  chargerProduits();

}, []);

  const viderFormulaire = () => {
    setNom("");
    setPrix("");
    setCategorie("");
    setStock("");
    setImage("");
    setIdModification(null);
    setMarque("");
    setAge("");
    setTaille("");
    setDescription("");
  };
  
   
const ajouterOuModifierProduit = async () => {

  if (idModification) {

    const produitsModifies = produitsAdmin.map((produit) =>
      produit.id === idModification
        ? {
            ...produit,
            nom,
            prix,
            categorie,
            marque,
            age,
            taille,
            description,
            stock,
            image
          }
        : produit
    );
    await updateDoc(
  doc(db, "produits", String(idModification)), {
  nom,
  prix,
  categorie,
  marque,
  age,
  taille,
  description,
  stock,
  image
});
    setProduitsAdmin(produitsModifies);

  } else {

    const nouveauProduit = {
      nom,
      prix,
      categorie,
      marque,
      age,
      taille,
      description,
      stock,
      image
    };

    const docRef = await addDoc(
      collection(db, "produits"),
      nouveauProduit
    );

    setProduitsAdmin([
      ...produitsAdmin,
      {
        id: docRef.id,
        ...nouveauProduit
      }
    ]);
  }

  viderFormulaire();
};
  const supprimerProduit = async (id) => {

  if (typeof id === "string") {
    await deleteDoc(doc(db, "produits", id));
  }

  const nouveauxProduits = produitsAdmin.filter(
    (produit) => produit.id !== id
  );

  setProduitsAdmin(nouveauxProduits);

  localStorage.setItem(
    "produitsAdmin",
    JSON.stringify(nouveauxProduits)
  );
};

  const modifierProduit = (produit) => {
    setNom(produit.nom);
    setPrix(produit.prix);
    setCategorie(produit.categorie);
    setStock(produit.stock);
    setImage(produit.image);
    setIdModification(String(produit.id));
    setMarque(produit.marque);
    setAge(produit.age);
    setTaille(produit.taille);
    setDescription(produit.description);
  };
  if (!connecte) {
  return (
    <div className="App">
      <h1>🔐 Connexion Admin</h1>

      <div className="admin-form">
        <input
          type="password"
          placeholder="Mot de passe admin"
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
const uploaderImage = async (fichier) => {
  setUploadEnCours(true);
  const formData = new FormData();
  formData.append("image", fichier);

  const response = await fetch(
    "https://api.imgbb.com/1/upload?key=b6bab2b280cc1c31ff29720ae8943d6d",
    { method: "POST", body: formData }
  );

  const data = await response.json();
  setImage(data.data.url);
  setUploadEnCours(false);
};
  return (
    <div className="App">
      <h1>🔐 Panneau Admin</h1>
       <button onClick={() => setConnecte(false)}>
  🚪 Déconnexion
</button>
      <div className="admin-form">
        <input
          type="text"
          placeholder="Nom du produit"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <input
          type="number"
          placeholder="Prix"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
        />

        <input
          type="text"
          placeholder="Catégorie"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
        />
        <input
  type="text"
  placeholder="Marque"
  value={marque}
  onChange={(e) => setMarque(e.target.value)}
/>

<input
  type="text"
  placeholder="Âge"
  value={age}
  onChange={(e) => setAge(e.target.value)}
/>
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

  <input
  type="file"
  accept="image/*"
  onChange={(e) => uploaderImage(e.target.files[0])}
/>
{uploadEnCours && <p>⏳ Upload en cours...</p>}
{image && (
  <img
    src={image}
    alt="Aperçu"
    style={{ width: "100%", borderRadius: "12px", marginTop: "10px" }}
  />
)}
        <input
  type="text"
  placeholder="Taille / pointure"
  value={taille}
  onChange={(e) => setTaille(e.target.value)}
/>
      <textarea
  placeholder="Description du produit"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
></textarea>
        <button onClick={ajouterOuModifierProduit}>
          {idModification ? "✅ Enregistrer modification" : "➕ Ajouter produit"}
        </button>

        {idModification && (
          <button onClick={viderFormulaire}>
            Annuler modification
          </button>
        )}
      </div>

      <div className="produits-grid">
        {produitsAdmin.map((produit) => (
          <div key={produit.id} className="produit-card">
            <img
              src={produit.image}
              alt={produit.nom}
              className="image-produit"
            />

            <h3>{produit.nom}</h3>

            <p>{produit.categorie}</p>
            <p>🏷️ Marque : {produit.marque}</p>
            <p>👶 Âge : {produit.age}</p>
            <p>Stock : {produit.stock}</p>
            <p>{produit.prix} FCFA</p>
            <p>📏 Taille : {produit.taille}</p>
            <p>{produit.description}</p>
            <button onClick={() => supprimerProduit(produit.id)}>
              ❌ Supprimer
            </button>

            <button onClick={() => modifierProduit(produit)}>
              ✏️ Modifier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;