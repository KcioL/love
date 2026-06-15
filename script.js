// --- NOUVELLES VARIABLES GLOBALES ---
let activiteChoisie = ""; // Pour garder en mémoire l'activité pour le mail

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
    activiteChoisie = activityName; // On sauvegarde l'activité pour l'e-mail !
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
    
    // Au lieu de passer directement à l'étape 4, on affiche la chatbox
    document.getElementById('chatbox-container').style.display = 'flex';
}


// --- LOGIQUE DE LA CHATBOX (MAILTO) ---
document.getElementById('chatbox-submit-btn').onclick = function() {
    const emailDestinataire = document.getElementById('chatbox-email').value;

    if (!emailDestinataire) {
        alert("S'il te plaît, entre une adresse e-mail valide.");
        return;
    }

    // On récupère la date et l'heure qui ont été validées juste avant
    const dateChoisie = document.getElementById('date-input').value;
    const heureChoisie = document.getElementById('time-input').value;

    // Préparation du sujet et du message
    const sujet = "C'est validé pour notre date ! 🥰";
    const message = `Coucou !\n\nVoici le récapitulatif de notre date :\n- Activité : ${activiteChoisie}\n- Date : ${dateChoisie}\n- Heure : ${heureChoisie}\n\nJ'ai trop hâte ! ❤️`;

    // Création du lien mailto avec l'e-mail saisi dans la chatbox
    const lienMailto = `mailto:${emailDestinataire}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(message)}`;

    // Ouvre l'application mail de son appareil
    window.location.href = lienMailto;

    // On referme la chatbox pour faire propre
    document.getElementById('chatbox-container').style.display = 'none';

    // Et on passe enfin à la toute dernière étape (l'écran de fin) !
    nextStep(4);
};
