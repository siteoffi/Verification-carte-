
/* ========================================
   VERIFICATION DE RECHARGE
   Script adapté à index.html et style.css
======================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Éléments de la page
  const providers = document.querySelectorAll(".provider");
  const providerInput = document.getElementById("providerInput");
  const selectedProvider = document.getElementById("selectedProvider");

  const form = document.querySelector(".verification-card");
  const montantInput = document.getElementById("montant");
  const messageInput = document.getElementById("message");

  if (!form) {
    console.error("Formulaire introuvable : vérifie index.html.");
    return;
  }

  // Fournisseurs officiels et liens d'assistance.
  // Les liens servent à rechercher la procédure officielle.
  const officialHelp = {
    "Paysafecard": "https://www.paysafecard.com/",
    "Transcash": "https://www.transcash.fr/",
    "PCS": "https://www.mypcs.com/",
    "Neosurf": "https://www.neosurf.com/",
    "Xbox": "https://support.xbox.com/",
    "Steam": "https://help.steampowered.com/",
    "Apple": "https://support.apple.com/",
    "Google Play": "https://support.google.com/googleplay/"
  };

  // Sélection d'une carte
  providers.forEach(function (button) {
    button.addEventListener("click", function () {
      const providerName = button.dataset.provider;

      if (!providerName) {
        return;
      }

      // Retirer l'état actif de toutes les cartes
      providers.forEach(function (item) {
        item.classList.remove("active");
        item.removeAttribute("aria-pressed");
      });

      // Activer la carte choisie
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      // Actualiser les informations affichées
      if (providerInput) {
        providerInput.value = providerName;
      }

      if (selectedProvider) {
        selectedProvider.textContent = providerName;
      }

      // Actualiser le lien officiel du bouton d'aide
      updateHelpLink(providerName);
    });
  });

  // Préparer l'accessibilité des boutons
  providers.forEach(function (button) {
    button.setAttribute(
      "aria-pressed",
      button.classList.contains("active") ? "true" : "false"
    );
  });

  // Créer ou actualiser une zone d'aide officielle
  function updateHelpLink(providerName) {
    let helpArea = document.getElementById("officialHelp");

    if (!helpArea) {
      helpArea = document.createElement("div");
      helpArea.id = "officialHelp";
      helpArea.style.marginTop = "16px";
      helpArea.style.padding = "14px";
      helpArea.style.borderRadius = "10px";
      helpArea.style.background = "#edf4ff";
      helpArea.style.textAlign = "center";

      const submitButton = form.querySelector(".verify-button");

      if (submitButton) {
        submitButton.insertAdjacentElement("beforebegin", helpArea);
      } else {
        form.appendChild(helpArea);
      }
    }

    helpArea.replaceChildren();

    const info = document.createElement("p");
    info.textContent =
      "Pour vérifier votre recharge " + providerName +
      ", consultez le site officiel du fournisseur.";

    const link = document.createElement("a");
    link.href = officialHelp[providerName] || "https://www.google.com/";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Ouvrir le site officiel";
    link.style.display = "inline-block";
    link.style.marginTop = "8px";
    link.style.fontWeight = "bold";
    link.style.color = "#1746a2";

    helpArea.appendChild(info);
    helpArea.appendChild(link);
  }

  // Afficher l'aide pour la carte sélectionnée au chargement
  const initialProvider =
    (providerInput && providerInput.value) || "Paysafecard";

  updateHelpLink(initialProvider);

  // Vérifier le montant saisi
  if (montantInput) {
    montantInput.addEventListener("input", function () {
      const amount = Number(montantInput.value);

      if (
        montantInput.value !== "" &&
        (!Number.isFinite(amount) || amount <= 0)
      ) {
        montantInput.setCustomValidity(
          "Entre un montant supérieur à zéro."
        );
      } else {
        montantInput.setCustomValidity("");
      }
    });
  }

  // Empêcher l'envoi des codes secrets complets
  // et ne jamais transmettre ces données à un service tiers.
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const amount = montantInput
      ? Number(montantInput.value)
      : 0;

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Entre un montant supérieur à zéro.");
      if (montantInput) montantInput.focus();
      return;
    }

    alert(
      "Pour vérifier votre recharge, utilisez le site officiel " +
      "du fournisseur sélectionné. Ne saisissez ni ne partagez " +
      "le code secret complet de votre carte."
    );

    const currentProvider =
      (providerInput && providerInput.value) || "Paysafecard";

    updateHelpLink(currentProvider);

    const helpArea = document.getElementById("officialHelp");

    if (helpArea) {
      helpArea.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    if (messageInput) {
      messageInput.value = "";
    }
  });

  console.log("Script de vérification chargé correctement.");
});
