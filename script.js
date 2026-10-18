
const form = document.getElementById("requestForm");
const button = document.getElementById("submitButton");
const statusMessage = document.getElementById("formStatus");

// Remplace cette valeur par ta clé d'accès Web3Forms.
const WEB3FORMS_ACCESS_KEY = "COLLE_ICI_TA_CLE_WEB3FORMS";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  statusMessage.textContent = "";
  statusMessage.className = "form-status";

  if (!form.reportValidity()) {
    return;
  }

  if (form.elements.botcheck.value.trim() !== "") {
    statusMessage.textContent = "La demande n'a pas pu être envoyée.";
    statusMessage.classList.add("error");
    return;
  }

  if (
    !WEB3FORMS_ACCESS_KEY ||
    WEB3FORMS_ACCESS_KEY === "COLLE_ICI_TA_CLE_WEB3FORMS"
  ) {
    statusMessage.textContent =
      "Le formulaire n'est pas encore configuré. Réessayez plus tard.";
    statusMessage.classList.add("error");
    return;
  }

  button.disabled = true;
  button.textContent = "Envoi en cours...";

  try {
    const formData = new FormData(form);
    formData.set("access_key", WEB3FORMS_ACCESS_KEY);
    formData.set("subject", "Nouvelle demande CardCheck");
    formData.set("from_name", "CardCheck - Formulaire");

    const response = await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      throw new Error("L'envoi a échoué.");
    }

    form.reset();

    statusMessage.textContent =
      "Votre demande a été envoyée. Merci !";
    statusMessage.classList.add("success");
  } catch (error) {
    statusMessage.textContent =
      "Impossible d'envoyer votre demande. Vérifiez votre connexion et réessayez.";
    statusMessage.classList.add("error");
  } finally {
    button.disabled = false;
    button.innerHTML =
      'Envoyer ma demande <span aria-hidden="true">→</span>';
  }
});
