        // Animation au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

        // Menu mobile
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            nav.classList.remove('active');
        });

        // Optimisation mobile
        function handleResize() {
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
            }
        }

        window.addEventListener('resize', handleResize);

            // Carrousel de compétences
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.skill-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let cardWidth = cards[0].offsetWidth + 20; // Largeur + gap
    let currentPosition = 0;
    let maxPosition = cards.length * cardWidth - track.parentElement.offsetWidth;
    
    // Fonction pour recalculer les dimensions lors du redimensionnement
    function updateCarouselDimensions() {
        cardWidth = cards[0].offsetWidth + 20;
        maxPosition = cards.length * cardWidth - track.parentElement.offsetWidth;
        
        // S'assurer que la position actuelle est valide
        if (currentPosition > maxPosition) {
            currentPosition = maxPosition;
            updateCarouselPosition();
        }
    }
    
    // Fonction pour mettre à jour la position du carrousel
    function updateCarouselPosition() {
        track.style.transform = `translateX(-${currentPosition}px)`;
    }
    
    // Gestionnaires d'événements pour les boutons de navigation
    prevBtn.addEventListener('click', () => {
        currentPosition = Math.max(currentPosition - cardWidth * 2, 0);
        updateCarouselPosition();
    });
    
    nextBtn.addEventListener('click', () => {
        currentPosition = Math.min(currentPosition + cardWidth * 2, maxPosition);
        updateCarouselPosition();
    });
    
    // Écouter les changements de taille d'écran
    window.addEventListener('resize', updateCarouselDimensions);
    
    // Initialiser les dimensions au chargement
    window.addEventListener('load', updateCarouselDimensions);

        
var unavailableModal = document.getElementById("unavailable");

function openUnavailableElem() {
    document.getElementById("modal-message").innerText = "Cet élément n'est pas disponible";
    document.getElementById("unavailable").style.display = "flex";
}

// Fonction pour ouvrir les infos contact
function openContactElem() {
    document.getElementById("contact").style.display = "flex";
}

// Fonction pour fermer le modal "unavailable"
function closeModal() {
    document.getElementById("unavailable").style.display = "none";
}

// Fonction pour fermer le modal "contact"
function closeContactModal() {
    document.getElementById("contact").style.display = "none";
}

// Gestionnaire pour fermer les modals en cliquant en dehors
window.onclick = function(event) {
    const unavailableModal = document.getElementById("unavailable");
    const contactModal = document.getElementById("contact");
    
    if (event.target === unavailableModal) {
        closeModal();
    }
    if (event.target === contactModal) {
        closeContactModal();
    }
}