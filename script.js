/* 
  LOVE QUEST ENGINE
  Senior Dev Note: Strict relative paths are used for GitHub Pages compatibility.
*/

// --- 1. Image Path & Debugging System ---

const ASSETS = {
    cards: [
        'assets/cards/cat.png',
        'assets/cards/heart.png',
        'assets/cards/cloud.png',
        'assets/cards/star.png'
    ],
    boss: 'assets/boss/boss.png'
};

// Auto-run connection test on load
window.onload = function() {
    console.log("❤ Love Quest Initializing...");
    checkImages();
    startPetalRain();
};

function checkImages() {
    const allImages = [...ASSETS.cards, ASSETS.boss];
    allImages.forEach(path => {
        const img = new Image();
        img.onload = () => console.log(`[OK] Loaded: ${path}`);
        img.onerror = () => console.error(`[FAIL] Missing: ${path} (Check folder structure!)`);
        img.src = path;
    });
}

// --- 2. Navigation Logic ---

function goToLevel(levelNumber) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    // Show target screen
    const target = document.getElementById(`level-${levelNumber}`);
    if (target) {
        target.classList.add('active');
        
        // Initialize level specific logic
        if (levelNumber === 2) initMemoryGame();
        if (levelNumber === 3) initBossLevel();
    }
}

// --- 3. Level 1: The Reason I Smile ---

let revealedCount = 0;

function revealTile(element, index) {
    // Prevent double clicking same tile
    if (element.classList.contains('revealed')) return;

    element.classList.add('revealed');
    revealedCount++;

    if (revealedCount === 3) {
        document.getElementById('btn-level-1').classList.remove('hidden');
    }
}

// --- 4. Level 2: Memory Match ---

const cardTypes = ['cat', 'heart', 'cloud', 'star'];
// Duplicate array to create pairs
let cardsArray = [...cardTypes, ...cardTypes]; 
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchesFound = 0;

function initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = ''; // Clear board
    matchesFound = 0;
    
    // Shuffle
    cardsArray.sort(() => 0.5 - Math.random());

    // Generate HTML
    cardsArray.forEach(name => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = name;

        const inner = document.createElement('div');
        inner.classList.add('card-inner');

        // Front (The lily pattern CSS)
        const front = document.createElement('div');
        front.classList.add('card-front');

        // Back (The PNG Image)
        const back = document.createElement('div');
        back.classList.add('card-back');
        const img = document.createElement('img');
        img.src = `assets/cards/${name}.png`;
        img.alt = name;
        back.appendChild(img);

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    matchesFound++;

    // 4 pairs total
    if (matchesFound === 4) {
        setTimeout(() => {
            document.getElementById('lvl2-message').classList.remove('hidden');
        }, 500);
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// --- 5. Level 3: Boss Battle ---

let bossHP = 100;

function initBossLevel() {
    bossHP = 100;
    updateHealthBar();
}

function hitBoss() {
    if (bossHP <= 0) return;

    bossHP -= 10; // 10 clicks to win
    updateHealthBar();

    const bossImg = document.getElementById('boss-img');
    
    // Reset animation if currently running
    bossImg.classList.remove('shake');
    void bossImg.offsetWidth; // Trigger reflow to restart css animation
    bossImg.classList.add('shake');

    if (bossHP <= 0) {
        setTimeout(() => {
            document.getElementById('lvl3-message').classList.remove('hidden');
            bossImg.style.filter = "grayscale(100%) opacity(0.5)"; // Defeated look
        }, 300);
    }
}

function updateHealthBar() {
    const fill = document.getElementById('hp-bar-fill');
    fill.style.width = bossHP + '%';
    
    // Change color on low health
    if (bossHP < 30) {
        fill.style.backgroundColor = '#ff0000';
    }
}

// --- 6. Final Reveal ---

function askValentine() {
    document.getElementById('ask-btn').style.display = 'none'; // Hide button
    document.getElementById('final-answer').classList.remove('hidden');
}

// --- 7. Aesthetics: Petal Generator ---

function startPetalRain() {
    const container = document.getElementById('petals-container');
    
    // Create a new petal every 300ms
    setInterval(() => {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Randomize size, position, and speed
        const size = Math.random() * 10 + 5; // 5px to 15px
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = Math.random() * 100 + 'vw';
        
        const duration = Math.random() * 3 + 4; // 4s to 7s
        petal.style.animationDuration = `${duration}s`;
        
        container.appendChild(petal);

        // Remove from DOM after animation ends to prevent lag
        setTimeout(() => {
            petal.remove();
        }, duration * 1000);
    }, 300);
}