// --- DOM Elements ---
const loginScreen = document.getElementById('login-screen');
const gamesScreen = document.getElementById('games-screen');
const giftScreen = document.getElementById('gift-screen');
const videoScreen = document.getElementById('video-screen');
const waScreen = document.getElementById('wa-screen');

// Audio Element
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.5;

// Login Elements
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

// Minigames Elements
const task1 = document.getElementById('task-1');
const starsArea = document.getElementById('stars-area');
const starCountEl = document.getElementById('star-count');
const task2 = document.getElementById('task-2');
const runawayArea = document.getElementById('runaway-area');
const runawayBtn = document.getElementById('runaway-btn');
const taskComplete = document.getElementById('task-complete');
const nextToGiftBtn = document.getElementById('next-to-gift-btn');

// Gift, Video, & WA
const theGift = document.getElementById('the-gift');
const surpriseVideo = document.getElementById('surprise-video');
const sendWaBtn = document.getElementById('send-wa-btn');
const waMessage = document.getElementById('wa-message');

// --- State ---
const TOTAL_STARS = 5;
let starsRemaining = TOTAL_STARS;

// --- Helper: Switch Screens ---
function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    setTimeout(() => {
        fromScreen.classList.add('hidden');
        toScreen.classList.remove('hidden');
        setTimeout(() => {
            toScreen.classList.add('active');
        }, 50);
    }, 600);
}

// --- 1. Login Logic ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = usernameInput.value.trim().toLowerCase();
    const pass = passwordInput.value.trim();
    
    if (user === 'idung' && pass === 'arifbahik') {
        // Success
        switchScreen(loginScreen, gamesScreen);
        
        // Play music (Audio must be played after user interaction)
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Audio play blocked", e));
        }
        
        initTask1();
    } else {
        // Error
        loginError.classList.remove('hidden');
        loginForm.classList.remove('shake');
        // trigger reflow
        void loginForm.offsetWidth;
        loginForm.classList.add('shake');
    }
});

// --- 2. Minigames Logic ---

// TASK 1: Stars
function initTask1() {
    starCountEl.textContent = starsRemaining;
    for (let i = 0; i < TOTAL_STARS; i++) {
        createStar();
    }
}

function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    
    const topPos = Math.random() * 80;
    const leftPos = Math.random() * 80;
    
    star.style.top = `${topPos}%`;
    star.style.left = `${leftPos}%`;
    
    const moveInterval = setInterval(() => {
        if(!star.classList.contains('popped')){
            star.style.transition = 'top 2s ease-in-out, left 2s ease-in-out';
            star.style.top = `${Math.random() * 80}%`;
            star.style.left = `${Math.random() * 80}%`;
        } else {
            clearInterval(moveInterval);
        }
    }, 2000);
    
    const popStar = (e) => {
        if(e) e.preventDefault();
        if (star.classList.contains('popped')) return;
        
        star.classList.add('popped');
        starsRemaining--;
        starCountEl.textContent = starsRemaining;
        
        setTimeout(() => star.remove(), 300);
        
        if (starsRemaining === 0) {
            finishTask1();
        }
    };
    
    star.addEventListener('touchstart', popStar, { passive: false });
    star.addEventListener('mousedown', popStar);
    
    starsArea.appendChild(star);
}

function finishTask1() {
    task1.classList.add('hidden');
    task2.classList.remove('hidden');
    initTask2();
}

// TASK 2: Runaway Button
function initTask2() {
    const moveBtn = (e) => {
        if(runawayBtn.classList.contains('caught')) return;
        
        const areaWidth = runawayArea.offsetWidth;
        const areaHeight = runawayArea.offsetHeight;
        const btnWidth = runawayBtn.offsetWidth;
        const btnHeight = runawayBtn.offsetHeight;
        
        const newLeft = Math.random() * (areaWidth - btnWidth);
        const newTop = Math.random() * (areaHeight - btnHeight);
        
        runawayBtn.style.transform = 'translate(0, 0)';
        runawayBtn.style.left = `${newLeft}px`;
        runawayBtn.style.top = `${newTop}px`;
    };

    runawayBtn.addEventListener('mouseover', moveBtn);
    runawayBtn.addEventListener('touchstart', (e) => {
        if (Math.random() > 0.3) {
            e.preventDefault(); 
            moveBtn();
        }
    }, {passive: false});
    
    runawayBtn.addEventListener('click', () => {
        runawayBtn.classList.add('caught');
        finishTask2();
    });
}

function finishTask2() {
    runawayBtn.innerText = "Kena deh! 😝";
    runawayBtn.style.backgroundColor = "#4cc9f0"; 
    setTimeout(() => {
        task2.classList.add('hidden');
        taskComplete.classList.remove('hidden');
    }, 1000);
}

nextToGiftBtn.addEventListener('click', () => {
    switchScreen(gamesScreen, giftScreen);
});

// --- 3. Gift Logic ---
theGift.addEventListener('click', () => {
    theGift.classList.add('gift-open-anim');
    
    setTimeout(() => {
        switchScreen(giftScreen, videoScreen);
        
        // Autoplay video
        setTimeout(() => {
            surpriseVideo.play().catch(e => console.log("Video autoplay blocked", e));
        }, 600);
    }, 1000); 
});

// --- 4. Video Ended Logic ---
surpriseVideo.addEventListener('ended', () => {
    // When video ends, go to WA screen
    switchScreen(videoScreen, waScreen);
});

// --- 5. WhatsApp Logic ---
sendWaBtn.addEventListener('click', () => {
    const msg = waMessage.value.trim();
    if (msg === '') {
        alert("Jangan lupa ketik pesannya dulu ya! 💌");
        return;
    }
    
    const encodedMsg = encodeURIComponent(msg);
    const phoneNumber = "6289508840854"; // WA format without '+' or '0' at front
    const waLink = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
    
    window.open(waLink, '_blank');
});
