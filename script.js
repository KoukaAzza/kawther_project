// Tableau des chemins des cartes pré-définies (40 cartes au total)
const cartes = [
  "1-C.png",
  "1-D.png",
  "1-H.png",
  "1-S.png",
  "2-C.png",
  "2-D.png",
  "2-H.png",
  "2-S.png",
  "3-C.png",
  "3-D.png",
  "3-H.png",
  "3-S.png",
  "4-C.png",
  "4-D.png",
  "4-H.png",
  "4-S.png",
  "5-C.png",
  "5-D.png",
  "5-H.png",
  "5-S.png",
  "6-C.png",
  "6-D.png",
  "6-H.png",
  "6-S.png",
  "7-C.png",
  "7-D.png",
  "7-H.png",
  "7-S.png",
  "9-C.png",
  "9-D.png",
  "9-H.png",
  "9-S.png",
  "10-C.png",
  "10-D.png",
  "10-H.png",
  "10-S.png",
  "8-C.png",
  "8-D.png",
  "8-H.png",
  "8-S.png",
];
// Mélanger aléatoirement les cartes
const cartesMelangees = cartes.sort(() => Math.random() - 0.5);
// Diviser les cartes en lots de 3 pour le joueur et l'ordinateur
const joueurCartes = [];
const ordinateurCartes = [];
for (let i = 3; i < 12; i++) {
  const debut = i * 4;
  const finJoueur = debut + 3;
  const finOrdinateur = debut + 6;
  joueurCartes.push(cartesMelangees.slice(debut, finJoueur));
  ordinateurCartes.push(cartesMelangees.slice(finJoueur, finOrdinateur));
}
const cartesSurTable = [];
let tour = 0;
// Fonction pour afficher les cartes dans une div spécifique
function afficherCartes(elementId, cartesArray, tourJoueur) {
  const divElement = document.getElementById(elementId);
  divElement.innerHTML = "";
  const autoriserClic = elementId === "player-hand" && tourJoueur;
  cartesArray.forEach((carte) => {
    const imgElement = document.createElement("img");
    imgElement.src = carte;
    imgElement.alt = "Carte";
    if (autoriserClic) {
      imgElement.addEventListener("click", function () {
        const chemin = carte;
        const numero = chemin.match(/\d+/);
        const nombre = numero[0];
        console.log(nombre);
        // Utiliser le clic de la carte pour le joueur
        console.log("Clic sur une carte du joueur:", carte);
        // Faites quelque chose pour le joueur...
      });
    }
    divElement.appendChild(imgElement);
  });
}
function mangerCarte(selectedCards, cartesSurTable) {
  const selectedValues = selectedCards.map((card) =>
    parseInt(card.match(/\d+/)[0])
  );
  const possibleCombos = [[]];
  for (let i = 0; i < cartesSurTable.length; i++) {
    const currentLength = possibleCombos.length;
    for (let j = 0; j < currentLength; j++) {
      const currentCombo = possibleCombos[j];
      const newCombo = currentCombo.concat(cartesSurTable[i]);
      possibleCombos.push(newCombo);
    }
  }
  for (let i = 0; i < possibleCombos.length; i++) {
    const sumCombo = possibleCombos[i].reduce(
      (acc, currentCard) => acc + parseInt(currentCard.match(/\d+/)[0]),
      0
    );
    if (
      sumCombo ===
      selectedValues.reduce((acc, currentValue) => acc + currentValue, 0)
    ) {
      return possibleCombos[i]; // Retourner la combinaison de cartes à manger
    }
  }
  return null; // Aucune combinaison trouvée pour manger les cartes
}
let scoreJoueur = 0; // Score du joueur
let tourJoueur = 0; // Nombre de cartes jouées par le joueur dans un tour
let tourOrdinateur = 0; // Nombre de cartes jouées par l'ordinateur dans un
tour;
function jouerCarte() {
  if (tour < 12) {
    if (tour % 2 === 0) {
      // Tour du joueur
      joueurActif = "Joueur";
      const playerHand = document.getElementById("player-hand");
      cartesJoueur = joueurCartes[Math.floor(tour / 2)];
      afficherCartes("player-hand", cartesJoueur, true);
      playerHand.addEventListener("click", function handler(event) {
        if (event.target.tagName === "IMG") {
          const selectedCard = event.target.src;
          const sameValueCardIndex = cartesSurTable.findIndex(
            (card) => card === selectedCard
          );
          const cardValue = parseInt(selectedCard.match(/\d+/)[0]);
          if (sameValueCardIndex !== -1) {
            cartesSurTable.splice(sameValueCardIndex, 1);
            console.log(
              "Carte éliminée du tableau et ajoutée au scoreJoueur:",
              selectedCard
            );
            scoreJoueur++;
            afficherCartes("cartesSurTable", cartesSurTable, false); // Mise à  jour de l'affichage
          } else {
            const sumCombo = mangerCarte([selectedCard], cartesSurTable);
            if (sumCombo) {
              sumCombo.forEach((card) => {
                const index = cartesSurTable.findIndex(
                  (carte) => carte === card
                );
                if (index !== -1) {
                  cartesSurTable.splice(index, 1);
                }
              });
              scoreJoueur += 1 + sumCombo.length; // Score = 1 carte  sélectionnée + nombre de cartes mangées
              afficherCartes("cartesSurTable", cartesSurTable, false); // Mise à jour de l'affichage
            } else {
              cartesSurTable.push(selectedCard);
              afficherCartes("cartesSurTable", cartesSurTable, false); // Mise à jour de l'affichage
              console.log("Carte ajoutée à la table:", selectedCard);
            }
          }
          if (event.target.parentNode === playerHand) {
            playerHand.removeChild(event.target);
          }
          tourJoueur++;
          if (tourJoueur === 3) {
            tourJoueur = 0;
            tour++;
            playerHand.removeEventListener("click", handler); // Supprimer l'écouteur d'événements après que le joueur ait joué ses cartes
            jouerCarteOrdinateur();
          }
        }
      });
    }
  } else {
    console.log("Fin du jeu !");
    alert("Fin du Jeu! Votre score est : " + scoreJoueur);
  }
}
function jouerCarteOrdinateur() {
  joueurActif = "Ordinateur";
  const computerHand = document.getElementById("computer-hand");
  cartesOrdinateur = ordinateurCartes[Math.floor(tour / 2)];
  //afficherCartes("computer-hand", cartesOrdinateur, false);
  setTimeout(() => {
    cartesOrdinateur.forEach((selectedCard) => {
      const sameValueCardIndex = cartesSurTable.findIndex(
        (card) => card === selectedCard
      );
      const cardValue = parseInt(selectedCard.match(/\d+/)[0]);
      if (sameValueCardIndex !== -1) {
        cartesSurTable.splice(sameValueCardIndex, 1);
        console.log(
          "Carte éliminée du tableau par l'ordinateur:",
          selectedCard
        );
      } else {
        const sumCombo = mangerCarte([selectedCard], cartesSurTable);
        if (sumCombo) {
          sumCombo.forEach((card) => {
            const index = cartesSurTable.findIndex((carte) => carte === card);
            if (index !== -1) {
              cartesSurTable.splice(index, 1);
            }
          });
          console.log("Cartes mangées du tableau par l'ordinateur:", sumCombo);
        } else {
          cartesSurTable.push(selectedCard);
          console.log(
            "Carte ajoutée à la table par l'ordinateur:",
            selectedCard
          );
        }
      }
    });
    afficherCartes("cartesSurTable", cartesSurTable, false); // Mise à jour  de l'affichage
    tour++;
    jouerCarte(); // Passer au tour suivant après que l'ordinateur ait joué  ses cartes
  }, 1000); // Délai d'une seconde pour simuler l'action de l'ordinateur
}
function initialiserJeu() {
  cartesSurTable.push(...cartesMelangees.slice(0, 4)); // Afficher les 4 premières cartes de manière aléatoire sur la table
  afficherCartes("cartesSurTable", cartesSurTable, false); // Mise à jour de l'affichage sur la table
  jouerCarte(); // Démarrer le jeu
}
document.addEventListener("DOMContentLoaded", initialiserJeu);
