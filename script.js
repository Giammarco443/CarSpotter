document.addEventListener("DOMContentLoaded", () => {
    
    // 1. GESTIONE LOADER (Scompare dopo 1.5s)
    const loader = document.getElementById('loader');
    if(loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }, 1500);
    }

    // 2. CURSORE CUSTOM (Solo per Desktop)
    if(window.innerWidth > 768) { 
        const cursor = document.querySelector('.custom-cursor');
        const trail = document.querySelector('.cursor-trail');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            setTimeout(() => {
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
            }, 50); 
        });

        document.querySelectorAll('a, button, .card, select, input, textarea, .closeModal').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(2)';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.border = '1px solid #d4af37';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = '#d4af37';
                cursor.style.border = 'none';
            });
        });
    }

    // 3. MENU MOBILE
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            const spans = mobileMenu.querySelectorAll('span');
            if (navLinks.classList.contains('nav-active')) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // 4. ANIMAZIONI SCROLL REVEAL (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.card, .reveal, .glass-panel').forEach(el => observer.observe(el));
});

// 5. GESTIONE FINESTRA MODALE (Dettagli Vettura)
function showDetails(carId) {
    const modal = document.getElementById("carModal");
    const content = document.getElementById("carDetailsContent");
    if (!modal || !content) return;

    const carData = {
        bugatti: { title: "Bugatti Chiron", desc: "1.500 CV — Propulsore W16 quad-turbo. Velocità massima limitata elettronicamente a 420 km/h. Telaio in carbonio aerospaziale." },
        ferrari: { title: "Ferrari F40", desc: "478 CV — Motore V8 biturbo. L'ultima creatura voluta da Enzo Ferrari. Votata alla pura guida analogica." },
        koenigsegg: { title: "Koenigsegg Jesko", desc: "1.600 CV — Trasmissione LST a 9 rapporti. Genera oltre 1.000 kg di downforce attiva." },
        lamborghini: { title: "Lambo Aventador", desc: "740 CV — L'ultimo leggendario V12 aspirato di Sant'Agata Bolognese. Linee spigolose aeronautiche." }
    };

    if (carData[carId]) {
        content.innerHTML = `
            <h2 style="color: var(--gold); margin-bottom: 15px;">${carData[carId].title}</h2>
            <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.8;">${carData[carId].desc}</p>
        `;
        modal.style.display = "flex";
    }
}
function closeModal() { document.getElementById("carModal").style.display = "none"; }
window.onclick = function(e) { if (e.target === document.getElementById("carModal")) closeModal(); }

// 6. GESTIONE CONFIGURATORE (pagina configuratore.html)
function updateConfigurator() {
    const model = document.getElementById("model");
    const color = document.getElementById("color");
    const log = document.getElementById("specLog");
    const frame = document.getElementById("visualCarFrame");
    if(!log || !frame) return;
    // mappa immagini per modello (esterno / interno)
    const images = {
        bugatti: { esterno: 'bugattiesterni.jpg', interno: 'bugattiinterni.jpg' },
        f40: { esterno: 'f40esterno.jpg', interno: 'f40interni.jpg' },
        jesko: { esterno: 'jeskoesterno.jpg', interno: 'jeskointerni.jpg' }
    };

    const selectedModel = model.value;
    const view = (document.getElementById('btn-interno').classList.contains('active')) ? 'interno' : 'esterno';
    const imgPath = (images[selectedModel] && images[selectedModel][view]) ? images[selectedModel][view] : '';

    frame.style.opacity = '0.2';
    log.innerHTML = `<span style="color:var(--gold);">Sincronizzazione Atelier...</span>`;

    setTimeout(() => {
        frame.innerHTML = ''; // pulisce completamente il frame
        frame.style.backgroundImage = 'none';
        
        if (imgPath) {
            // crea img element SENZA background-image per evitare sovrapposizioni
            const imgEl = document.createElement('img');
            imgEl.src = imgPath;
            imgEl.alt = model.options[model.selectedIndex].text;
            imgEl.style.maxWidth = '100%';
            imgEl.style.maxHeight = '100%';
            imgEl.style.width = 'auto';
            imgEl.style.height = 'auto';
            imgEl.style.objectFit = 'contain';
            imgEl.style.display = 'block';
            imgEl.style.margin = '0 auto';
            imgEl.onerror = function() { 
                this.parentElement.innerHTML = '<span style="color: var(--text-muted);">Immagine non disponibile</span>';
            };
            
            frame.appendChild(imgEl);
        } else {
            frame.innerHTML = model.options[model.selectedIndex].text;
        }

        // aggiunge colore text sotto
        const colorDiv = document.createElement('div');
        colorDiv.style.fontSize = '1rem';
        colorDiv.style.color = 'var(--gold)';
        colorDiv.style.marginTop = '15px';
        colorDiv.style.textAlign = 'center';
        colorDiv.textContent = color.options[color.selectedIndex].text;
        frame.appendChild(colorDiv);

        log.innerHTML = `Configurazione Aggiornata con Successo.`;
        frame.style.opacity = '1';
    }, 600);
}

function setView(view) {
    document.getElementById('btn-esterno').classList.remove('active');
    document.getElementById('btn-interno').classList.remove('active');
    document.getElementById('btn-' + view).classList.add('active');
    updateConfigurator();
}

function salvaConfigurazione() {
    const btn = document.querySelector('.magnetic-btn');
    btn.innerHTML = "ORDINE CIFRATO TRASMESSO ✔";
    btn.style.background = "var(--gold)";
    btn.style.color = "var(--bg-dark)";
    setTimeout(() => {
        btn.innerHTML = "Invia Ordine al Concierge";
        btn.style.background = "transparent";
        btn.style.color = "var(--gold)";
    }, 3000);
}

// 7. GESTIONE FORM VIP CONCIERGE (pagina assistenza.html)
function send() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const out = document.getElementById("out");

    if (name === "" || email === "") {
        out.style.color = "#ff4d4d";
        out.innerHTML = "Accesso Negato: Dati Incompleti.";
        return;
    }
    
    out.style.color = "var(--gold)";
    out.innerHTML = "Inizializzazione crittografia e connessione ai server VIP...";

    setTimeout(() => {
        out.innerHTML = "Trasmissione completata. Il Concierge Privato la contatterà a breve.";
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("msg").value = "";
    }, 2000);
}