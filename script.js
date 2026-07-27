/* ============================================
   MANAR - Romantic Website JavaScript
   Falling Hearts, Page Transitions, Audio Player,
   Gallery Slider, and Interactions
   ============================================ */

// =============================================
// 1. FALLING HEARTS BACKGROUND
// =============================================
(function createHearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    const heartSymbols = ['❤', '💕', '💖', '💗', '💝', '✨'];
    const heartCount = 25;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 8 + 6) + 's';
        heart.style.animationDelay = (Math.random() * 10) + 's';
        heart.style.opacity = Math.random() * 0.4 + 0.1;
        container.appendChild(heart);
    }
})();

// =============================================
// 2. PAGE TRANSITION SYSTEM
// =============================================
function navigateTo(url) {
    const transition = document.getElementById('page-transition');
    if (!transition) {
        window.location.href = url;
        return;
    }

    transition.classList.add('active');
    
    setTimeout(() => {
        window.location.href = url;
    }, 800);
}

// =============================================
// 3. LOGIN PAGE (index.html)
// =============================================
function initLogin() {
    const passwordInput = document.getElementById('password-input');
    const loginBtn = document.getElementById('login-btn');
    const loginForm = document.getElementById('login-form');
    const errorEl = document.getElementById('login-error');

    if (!loginForm) return;

    const CORRECT_PASSWORD = 'love';

    function handleLogin() {
        const enteredPassword = passwordInput.value.trim().toLowerCase();
        
        if (enteredPassword === CORRECT_PASSWORD) {
            errorEl.classList.remove('show');
            // Success - navigate to message page
            navigateTo('message.html');
        } else {
            errorEl.textContent = '❌ كلمة السر غلط! حاولي تاني يا قمر 💔';
            errorEl.classList.add('show');
            passwordInput.value = '';
            passwordInput.focus();
            // Shake animation
            passwordInput.style.animation = 'none';
            setTimeout(() => {
                passwordInput.style.animation = 'shake 0.5s';
            }, 10);
        }
    }

    loginBtn.addEventListener('click', handleLogin);

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    });

    passwordInput.focus();
}

// Add shake animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// =============================================
// 4. MESSAGE PAGE (message.html)
// =============================================
function initMessage() {
    const messageBtn = document.getElementById('message-btn');
    if (!messageBtn) return;

    messageBtn.addEventListener('click', () => {
        navigateTo('main.html');
    });
}

// =============================================
// 5. MAIN PAGE (main.html) - GALLERY SLIDER
// =============================================
function initGallery() {
    const slider = document.getElementById('gallery-slider');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const dotsContainer = document.getElementById('gallery-dots');

    if (!slider || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.gallery-dot');

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-slide every 4 seconds
    let autoSlide = setInterval(nextSlide, 4000);

    // Pause auto-slide on hover
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });
        galleryContainer.addEventListener('mouseleave', () => {
            autoSlide = setInterval(nextSlide, 4000);
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        galleryContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoSlide);
        }, { passive: true });

        galleryContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            autoSlide = setInterval(nextSlide, 4000);
        }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });
}

// =============================================
// 6. MAIN PAGE - AUDIO PLAYER
// =============================================
function initAudioPlayer() {
    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('audio-play');
    const muteBtn = document.getElementById('audio-mute');
    const progressFill = document.getElementById('audio-progress-fill');
    const progressBar = document.getElementById('audio-progress');
    const currentTimeEl = document.getElementById('audio-current');
    const durationEl = document.getElementById('audio-duration');
    const audioArt = document.querySelector('.audio-art');

    if (!audio) return;

    let isPlaying = false;
    let isMuted = false;

    // Try autoplay (browsers may block it)
    function attemptAutoplay() {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayButton();
            if (audioArt) audioArt.classList.remove('paused');
        }).catch(() => {
            console.log('Autoplay blocked. User needs to interact first.');
            isPlaying = false;
            updatePlayButton();
            if (audioArt) audioArt.classList.add('paused');
        });
    }

    // Attempt autoplay after user interaction (since autoplay is often blocked)
    document.addEventListener('click', () => {
        if (!isPlaying && audio.paused) {
            attemptAutoplay();
        }
    }, { once: true });

    // Also try immediately
    setTimeout(attemptAutoplay, 1000);

    function updatePlayButton() {
        if (playBtn) {
            playBtn.textContent = isPlaying ? '⏸' : '▶';
        }
    }

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            if (audioArt) audioArt.classList.add('paused');
        } else {
            audio.play();
            isPlaying = true;
            if (audioArt) audioArt.classList.remove('paused');
        }
        updatePlayButton();
    }

    function toggleMute() {
        isMuted = !isMuted;
        audio.muted = isMuted;
        if (muteBtn) {
            muteBtn.textContent = isMuted ? '🔇' : '🔊';
        }
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function updateProgress() {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationEl.textContent = formatTime(audio.duration);
        }
    }

    function setProgress(e) {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;
        audio.currentTime = percentage * audio.duration;
    }

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    if (progressBar) progressBar.addEventListener('click', setProgress);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayButton();
        if (audioArt) audioArt.classList.add('paused');
    });
}

// =============================================
// 7. INITIALIZE ALL PAGES
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we're on and initialize accordingly
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    switch (page) {
        case 'index.html':
        case '':
            initLogin();
            break;
        case 'message.html':
            initMessage();
            break;
        case 'main.html':
            initGallery();
            initAudioPlayer();
            break;
    }

    // Remove transition overlay on page load
    const transition = document.getElementById('page-transition');
    if (transition) {
        setTimeout(() => {
            transition.classList.remove('active');
        }, 100);
    }
});

