
"use strict";

// Remplace cette valeur par ta clé Web3Forms.
// Ne publie pas ta clé dans un dépôt public si tu peux l'éviter.
const WEB3FORMS_ACCESS_KEY = "a00e1400-6647-4f0b-b76b-360ba454af37";

const form = document.getElementById("requestForm");
const providerInput = document.getElementById("provider");
const providerGrid = document.getElementById("providerGrid");
const selectedProvider = document.getElementById("selectedProvider");
const selectedProviderName = document.getElementById("selectedProviderName");
const selectionHint = document.getElementById("selectionHint");
const messageInput = document.getElementById("message");
const characterCount = document.getElementById("characterCount");
const submitButton = document.getElementById("submitButton");
const buttonText = document.getElementById("buttonText");
const statusMessage = document.getElementById("formStatus");

let sending = false;

// Afficher un message de statut.
function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = "form-status " + type;
}

// Sélection du fournisseur.
providerGrid.addEventListener("click", function (event) {
  const card = event.target.closest("[data-provider]");

  if (!card) return;

  const provider = card.dataset.provider;

  providerInput.value = provider;
  selectedProviderName.textContent = provider;
  selectedProvider.classList.add("active");
  selectionHint.textContent = "Fournisseur sélectionné : " + provider;
  selectionHint.classList.remove("error");

  providerGrid.querySelectorAll(".provider-card").forEach(function (item) {
    const isSelected = item === card;

    item.classList.toggle("selected", isSelected);
    item.setAttribute("aria-pressed", String(isSelected));
  });

  statusMessage.className = "form-status";
  statusMessage.textContent = "";
});

// Compteur de caractères.
function updateCharacterCount() {
  characterCount.textContent = messageInput.value.length + " / 2000";
}

messageInput.addEventListener("input", updateCharacterCount);
updateCharacterCount();

// Envoi du formulaire.
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (sending) return;

  statusMessage.textContent = "";
  statusMessage.className = "form-status";

  // Le fournisseur doit être choisi avant l'envoi.
  if (!providerInput.value) {
    selectionHint.textContent =
      "Veuillez sélectionner une carte ou un ticket avant de continuer.";
    selectionHint.classList.add("error");
    providerGrid.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    return;
  }

  if (!form.reportValidity()) return;

  // Champ piège anti-spam.
  if (document.getElementById("website").value.trim() !== "") {
    showStatus("La demande n'a pas pu être envoyée.", "error");
    return;
  }

  sending = true;
  submitButton.disabled = true;
  buttonText.textContent = "Envoi en cours…";

  try {
    const data = new FormData(form);

    data.set("access_key", WEB3FORMS_ACCESS_KEY);
    data.set("subject", "Nouvelle demande CardCheck");
    data.set("from_name", "CardCheck - Formulaire");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error("Le service n'a pas confirmé l'envoi.");
    }

    form.reset();
    providerInput.value = "";
    selectedProviderName.textContent = "Aucun";
    selectedProvider.classList.remove("active");

    providerGrid.querySelectorAll(".provider-card").forEach(function (card) {
      card.classList.remove("selected");
      card.setAttribute("aria-pressed", "false");
    });

    selectionHint.textContent = "Choisissez une carte pour continuer.";
    selectionHint.classList.remove("error");

    updateCharacterCount();

    showStatus(
      "Votre demande a été envoyée. Merci ! Vérifiez votre boîte e-mail si nécessaire.",
      "success"
    );
  } catch (error) {
    showStatus(
      "L'envoi a échoué. Vérifiez votre connexion et réessayez. Si le problème persiste, vérifiez la configuration Web3Forms.",
      "error"
    );
  } finally {
    sending = false;
    submitButton.disabled = false;
    buttonText.textContent = "Envoyer ma demande";
  }
});
