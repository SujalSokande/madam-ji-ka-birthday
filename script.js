document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements for better performance
    const elements = {
        countdown: document.getElementById('countdown'),
        magicalParticles: document.getElementById('magical-particles'),
        emojiMagicButton: document.getElementById('emoji-magic-sprinkle'),
        musicButton: document.getElementById('birthday-music'),
        confettiButton: document.getElementById('confetti-shower'),
        photoCarousel: document.querySelector('.photo-carousel'),
        buttons: document.querySelectorAll('.girly-button')
    };

    // Configuration constants
    const CONFIG = {
        FIREWORKS_PER_MINUTE: 10,
        PARTICLES_PER_FIREWORK: 30,
        FIREWORK_COLORS: [
            '#FF69B4', '#FFB6C1', '#FF1493', '#FF00FF', 
            '#FF69B4', '#DDA0DD', '#EE82EE', '#DA70D6', 
            '#BA55D3', '#9370DB'
        ],
        EMOJIS: ['💖', '🎀', '✨', '🦄', '🌈', '🦋', '💕'],
        PINK_COLORS: ['#FF64A5', '#FFB6D1', '#FFCCE5', '#FF69B4', '#FF1493']
    };

    // Birthday date configuration
    const birthdayDate = new Date('2025-02-01T00:00:00Z');
    let birthdayMessageDisplayed = false;

    // Audio state management
    let audio = null;
    let isPlaying = true;
    let emojiInterval;
    let isSprinkleActive = false;

    // Initialize error handling for images
    function initializeImageErrorHandling() {
        const images = document.querySelectorAll('.photo-carousel img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
                img.alt = 'Image failed to load';
            });
        });
    }

    // Optimized countdown timer with RAF
    let lastCountdownUpdate = 0;
    function updateCountdown(timestamp) {
        // Throttle updates to once per second
        if (timestamp - lastCountdownUpdate < 1000) {
            requestAnimationFrame(updateCountdown);
            return;
        }

        lastCountdownUpdate = timestamp;
        const now = new Date();
        const difference = birthdayDate - now;

        if (difference <= 0) {
            if (!birthdayMessageDisplayed) {
                displayBirthdayMessage();
                birthdayMessageDisplayed = true;
                startFireworks();
            }
        } else {
            updateCountdownDisplay(difference);
        }

        requestAnimationFrame(updateCountdown);
    }

    function updateCountdownDisplay(difference) {
        const timeUnits = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };

        elements.countdown.innerHTML = Object.entries(timeUnits)
            .map(([unit, value]) => `
                <div class="countdown-part">
                    <span class="number">${value.toString().padStart(2, '0')}</span>
                    <span class="label">${unit}</span>
                </div>
            `).join('');
    }

    function displayBirthdayMessage() {
        elements.countdown.innerHTML = `
            <div class="celebration-message">
                <div class="message-line">Happy Birthday Yash!</div>
                <div class="message-subtitle">To my darling, my love, my everything 💖</div>
                <div class="message-subtitle">You are my sunshine, my teddy bear, and the one who fills my heart with endless joy. 🧸</div>
                <div class="message-subtitle">May your day be filled with joy, laughter, and endless blessings!</div>
                <div class="birthday-emoji">🎂</div>
            </div>
        `;
    }

    // Optimized fireworks with object pooling
    const fireworkPool = [];
    const particlePool = [];

    function getFirework() {
        return fireworkPool.pop() || document.createElement('div');
    }

    function getParticle() {
        return particlePool.pop() || document.createElement('div');
    }

    function recycleElement(element, pool) {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
        pool.push(element);
    }

    function startFireworks() {
        const interval = (60 * 1000) / CONFIG.FIREWORKS_PER_MINUTE;
        
        function launchFireworks() {
            for (let i = 0; i < CONFIG.FIREWORKS_PER_MINUTE; i++) {
                setTimeout(() => createFirework(), i * (interval / CONFIG.FIREWORKS_PER_MINUTE));
            }
        }

        launchFireworks();
        setInterval(launchFireworks, interval);
    }

    function createFirework() {
        const container = document.querySelector('.celebration-container');
        const containerRect = container.getBoundingClientRect();
        const firework = getFirework();
        
        firework.className = 'firework';
        const randomX = containerRect.left + (Math.random() * containerRect.width);
        const randomBurstHeight = containerRect.top + (Math.random() * (containerRect.height * 0.7));
        
        firework.style.left = `${randomX}px`;
        firework.style.setProperty('--firework-color', CONFIG.FIREWORK_COLORS[Math.floor(Math.random() * CONFIG.FIREWORK_COLORS.length)]);
        firework.style.setProperty('--burst-height', `${randomBurstHeight}px`);
        
        elements.magicalParticles.appendChild(firework);

        setTimeout(() => {
            createFireworkParticles(randomX, randomBurstHeight);
            recycleElement(firework, fireworkPool);
        }, 1000);
    }

    function createFireworkParticles(x, y) {
        for (let i = 0; i < CONFIG.PARTICLES_PER_FIREWORK; i++) {
            const particle = getParticle();
            particle.className = 'firework-particle';
            
            particle.style.setProperty('--particle-color', CONFIG.FIREWORK_COLORS[Math.floor(Math.random() * CONFIG.FIREWORK_COLORS.length)]);
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const angle = (Math.PI * 2 * i) / CONFIG.PARTICLES_PER_FIREWORK;
            const velocity = 2 + Math.random() * 2;
            particle.style.setProperty('--angle', angle);
            particle.style.setProperty('--velocity', velocity);
            
            elements.magicalParticles.appendChild(particle);

            setTimeout(() => recycleElement(particle, particlePool), 2000);
        }
    }

    // Optimized emoji sprinkle
    function createEmojiSprinkle() {
        const emoji = document.createElement('div');
        emoji.classList.add('magic-emoji');
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.textContent = CONFIG.EMOJIS[Math.floor(Math.random() * CONFIG.EMOJIS.length)];
        emoji.style.animation = `particle-soft-fall ${Math.random() * 4 + 4}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        
        elements.magicalParticles.appendChild(emoji);
        emoji.addEventListener('animationend', () => emoji.remove());
    }

    function toggleEmojiSprinkle() {
        if (!isSprinkleActive) {
            emojiInterval = setInterval(createEmojiSprinkle, 300);
            isSprinkleActive = true;
            elements.emojiMagicButton.classList.add('active');
        } else {
            clearInterval(emojiInterval);
            isSprinkleActive = false;
            elements.emojiMagicButton.classList.remove('active');
        }
    }

    // Modified audio initialization
    function initializeAudio() {
        if (!audio) {
            audio = new Audio('audio.mp3');
            audio.loop = true;

            audio.addEventListener('ended', () => {
                isPlaying = false;
                elements.musicButton.classList.remove('music-playing', 'active');
            });

            audio.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                elements.musicButton.style.display = 'none';
            });

            // Add loaded metadata listener to start playing as soon as possible
            audio.addEventListener('loadedmetadata', () => {
                playAudioWithRetry();
            });

            // Preload audio
            audio.preload = 'auto';
            audio.load();
        }
    }

    // Function to handle auto-play with retry mechanism
    function playAudioWithRetry(retryCount = 0) {
        const maxRetries = 3;
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                elements.musicButton.classList.add('music-playing', 'active');
            }).catch(error => {
                console.error('Playback failed:', error);
                
                // Retry logic for autoplay
                if (retryCount < maxRetries) {
                    setTimeout(() => {
                        playAudioWithRetry(retryCount + 1);
                    }, 1000); // Wait 1 second before retrying
                } else {
                    // If all retries fail, set up interaction-based playback
                    const startAudio = () => {
                        audio.play().then(() => {
                            isPlaying = true;
                            elements.musicButton.classList.add('music-playing', 'active');
                            // Remove the interaction listeners once audio starts
                            document.removeEventListener('click', startAudio);
                            document.removeEventListener('touchstart', startAudio);
                        });
                    };

                    // Add interaction listeners
                    document.addEventListener('click', startAudio);
                    document.addEventListener('touchstart', startAudio);
                }
            });
        }
    }

    // Modified toggle function
    function toggleMusic() {
        if (!audio) {
            initializeAudio();
            return;
        }

        if (!isPlaying) {
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        isPlaying = true;
                        elements.musicButton.classList.add('music-playing', 'active');
                    })
                    .catch(error => {
                        console.error('Playback failed:', error);
                        isPlaying = false;
                        elements.musicButton.classList.remove('music-playing', 'active');
                    });
            }
        } else {
            audio.pause();
            isPlaying = false;
            elements.musicButton.classList.remove('music-playing', 'active');
        }
    }

    // Optimized heart spray animation
    function sprayHearts(event) {
        const rect = event.target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const heart = document.createElement('div');
            heart.classList.add('magic-emoji');
            heart.textContent = '💖';

            heart.style.left = `${centerX}px`;
            heart.style.top = `${centerY}px`;

            const randomX = Math.random() * 100 - 50;
            const randomY = Math.random() * 100 - 50;
            heart.style.setProperty('--x', `${randomX}px`);
            heart.style.setProperty('--y', `${randomY}px`);

            elements.magicalParticles.appendChild(heart);
            heart.addEventListener('animationend', () => heart.remove());
        }
    }

    // Optimized confetti shower
    function createConfetti() {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = CONFIG.PINK_COLORS[Math.floor(Math.random() * CONFIG.PINK_COLORS.length)];
            confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
            
            confetti.addEventListener('animationend', () => confetti.remove());
            fragment.appendChild(confetti);
        }
        elements.magicalParticles.appendChild(fragment);
    }

    // Photo carousel optimization
    let currentIndex = 0;
    function rotatePhotos() {
        currentIndex = (currentIndex + 1) % 5;
        elements.photoCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Initialize all event listeners
    function initializeEventListeners() {
        elements.emojiMagicButton.addEventListener('click', toggleEmojiSprinkle);
        elements.musicButton.addEventListener('click', toggleMusic);
        elements.confettiButton.addEventListener('click', createConfetti);
        elements.buttons.forEach(button => {
            button.addEventListener('click', sprayHearts);
            // Add touch support for mobile
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                sprayHearts(e);
            });
        });
    }

    // Initialize everything
    function initialize() {
        initializeImageErrorHandling();
        initializeEventListeners();
        initializeAudio(); // This will now trigger automatic playback
        requestAnimationFrame(updateCountdown);
        setInterval(rotatePhotos, 3000);

        // Add smooth scrolling for Safari
        if (navigator.userAgent.indexOf('Safari') !== -1) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }
    }

    // Start the app
    initialize();
});