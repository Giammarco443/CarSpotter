// GESTIONE EFFETTI DI TRANSIZIONE DELLE CARDS AL CARICAMENTO
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".card").forEach(card => {
        card.classList.add("show");
    });
});

// LOGICA CONFIGURATORE MULTI-OPZIONE AVANZATO
const baseImages = {
    bugatti: { esterno: "bugattiesterni.jpg", interno: "bugattiinterni.jpg" },
    f40:     { esterno: "f40esterno.jpg",     interno: "f40interni.jpg" },
    jesko:   { esterno: "jeskoesterno.jpg",   interno: "jeskointerni.jpg" },
    lambo:   { esterno: "lamboesterno.jpg",   interno: "lambointerni.jpg" }
};

let configStato = {
    modello: 'bugatti',
    vista: 'esterno',
    colore: 'bianco',
    cerchi: 'diamond'
};

function setView(viewType) {
    configStato.vista = viewType;
    
    document.getElementById("btn-esterno").classList.remove("active");
    document.getElementById("btn-interno").classList.remove("active");
    document.getElementById("btn-" + viewType).classList.add("active");

    updateConfigurator();
}

function updateConfigurator() {
    const modelSelect = document.getElementById("model");
    const colorSelect = document.getElementById("color");
    const wheelsSelect = document.getElementById("wheels");
    const imgElement = document.getElementById("carImage");
    const logElement = document.getElementById("specLog");

    if (!imgElement) return; 

    configStato.modello = modelSelect.value;
    configStato.colore = colorSelect.value;
    configStato.cerchi = wheelsSelect.value;

    const nomeModello = modelSelect.options[modelSelect.selectedIndex].text;
    const nomeColore = colorSelect.options[colorSelect.selectedIndex].text;
    const nomeCerchi = wheelsSelect.options[wheelsSelect.selectedIndex].text;
    const nomeVista = configStato.vista === 'esterno' ? 'Esterni' : 'Cockpit Interno';

    imgElement.style.opacity = 0.3;
    
    setTimeout(() => {
        imgElement.src = baseImages[configStato.modello][configStato.vista];
        logElement.innerHTML = `Configurazione Sartoriale: ${nomeModello} | Prospettiva: ${nomeVista} | Tonalità: ${nomeColore} | Cerchi: ${nomeCerchi}`;
        imgElement.style.opacity = 1;
    }, 250);
}

function salvaConfigurazione() {
    alert("I dettagli della configurazione sono stati crittografati e inviati al suo Concierge personale. Verrà ricontattato a breve.");
}

// GESTIONE CONCIERGE FORM ASSISTENZA VIP (CON FORMSPREE)
function send() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const msg = document.getElementById("msg").value.trim();
    const out = document.getElementById("out");

    // Controllo campi vuoti
    if (name === "" || email === "" || phone === "" || msg === "") {
        out.style.color = "#d9534f"; // Rosso elegante
        out.innerHTML = "compila tutti i campi richiesti";
        return;
    }

    // Creazione del pacchetto dati da inviare a Formspree
    const formData = new FormData();
    formData.append("Nome", name);
    formData.append("Email", email);
    formData.append("Telefono", phone);
    formData.append("Messaggio", msg);

    out.style.color = "#c5a059";
    out.innerHTML = "Invio in corso...";

    // Invio asincrono a Formspree
    fetch("https://formspree.io/f/mlgvpkzy", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            out.style.color = "#c5a059"; // Oro
            out.innerHTML = "il personale ha ricevuto la tua richiesta";
            
            // Svuota i moduli dopo il successo
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("msg").value = "";
        } else {
            out.style.color = "#d9534f";
            out.innerHTML = "Si è verificato un errore di trasmissione. Riprova.";
        }
    })
    .catch(error => {
        out.style.color = "#d9534f";
        out.innerHTML = "Errore di connessione. Verificare la rete.";
    });
}