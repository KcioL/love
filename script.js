// --- LOGIQUE DU BOUTON "NON" QUI S'ENFUIT EN GLISSANT ---
const btnNo = document.getElementById('btn-no');

// Variables pour garder en mémoire son déplacement cumulé
let translateX = 0;
let translateY = 0;

function flee(e) {
    // Si c'est sur téléphone, on prend les coordonnées du doigt, sinon celles de la souris
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Récupérer la position et la taille actuelles du bouton à l'écran
    const rect = btnNo.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;

    // Calcul de la direction opposée à la souris
    let dirX = btnX - clientX;
    let dirY = btnY - clientY;

    // Sécurité : si la souris arrive exactement au centre du bouton à la vitesse de la lumière
    if (dirX === 0 && dirY === 0) {
        dirX = Math.random() - 0.5;
        dirY = Math.random() - 0.5;
    }

    // Normalisation (pour calculer la trajectoire)
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    
    // Le bouton s'échappe de 150 pixels à chaque fois
    const escapeDistance = 150; 
    let moveX = (dirX / length) * escapeDistance;
    let moveY = (dirY / length) * escapeDistance;

    // Gestion des murs (rebond) : S'il touche un bord de l'écran, il esquive dans l'autre sens !
    if (rect.left + moveX < 20 || rect.right + moveX > window.innerWidth - 20) {
        moveX = -moveX; 
    }
    if (rect.top + moveY < 20 || rect.bottom + moveY > window.innerHeight - 20) {
        moveY = -moveY; 
    }

    // On ajoute le nouveau mouvement à la position existante
    translateX += moveX;
    translateY += moveY;

    // Application du mouvement fluide
    btnNo.style.transform = `translate(${translateX}px, ${translateY}px)`;
}

// Détection de l'approche de la souris (PC) ou du doigt (Mobile)
btnNo.addEventListener('mouseover', flee);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Empêche un "vrai" clic si elle essaie de taper très vite
    flee(e);
});

// --- LE RESTE DU CODE NE CHANGE PAS ---
// (Laisse les fonctions nextStep, chooseActivity et validateDate juste en dessous)
// --- GESTION DES ÉTAPES ---
function nextStep(stepNumber) {
    // On cache toutes les sections
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-4').classList.add('hidden');
    
    // On affiche uniquement la section demandée
    document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
}

// --- CHOIX DE L'ACTIVITÉ ---
function chooseActivity(activityName) {
    document.getElementById('chosen-activity').innerText = activityName;
    nextStep(3);
}

// --- VALIDATION DE LA DATE ET DE L'HEURE ---
function validateDate() {
    const date = document.getElementById('date-input').value;
    const time = document.getElementById('time-input').value;

    if (date === "" || time === "") {
        alert("Oups ! N'oublie pas de choisir un jour et une heure ! 🥺");
        return;
    }
    
    nextStep(4);
}