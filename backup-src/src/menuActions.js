// src/utils/menuActions.js
export const menuActions = {
  file: {
    new: (setProjectName, setProjectStatus) => {
      const name = prompt("Nom du projet:", "Nouveau projet");
      if (name) {
        setProjectName(name);
        setProjectStatus("draft");
        alert(`Projet "${name}" créé`);
      }
    },
    save: (setProjectStatus) => {
      setProjectStatus("saved");
      alert("Projet enregistré");
    },
    // ...
  },
  edit: {
    undo: () => {
      // Logique d'annulation
      console.log("Undo action");
    },
    redo: () => {
      // Logique de rétablissement
      console.log("Redo action");
    },
    // ...
  }
};