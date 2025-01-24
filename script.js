document.addEventListener('DOMContentLoaded', () => {
    // Elegant Countdown Timer
    const countdownElement = document.getElementById('countdown');
    const birthdayDate = new Date('2025-02-01'); // Set your specific birthday date

    function updateCountdown() {
        const now = new Date();
        const difference = birthdayDate - now;

        if (difference < 0) {
            countdownElement.innerHTML = '<h2>Birthday is here! 🎉</h2>';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div class="countdown-part">
                <span class="number">${days.toString().padStart(2, '0')}</span>
                <span class="label">Days</span>
            </div>
            <div class="countdown-part">
                <span class="number">${hours.toString().padStart(2, '0')}</span>
                <span class="label">Hours</span>
            </div>
            <div class="countdown-part">
                <span class="number">${minutes.toString().padStart(2, '0')}</span>
                <span class="label">Minutes</span>
            </div>
            <div class="countdown-part">
                <span class="number">${seconds.toString().padStart(2, '0')}</span>
                <span class="label">Seconds</span>
            </div>
        `;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Photo Carousel
    const photoCarousel = document.querySelector('.photo-carousel');
    let currentIndex = 0;

    function rotatePhotos() {
        currentIndex = (currentIndex + 1) % 5;
        photoCarousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(rotatePhotos, 3000);

    // Magical Emoji Sprinkle
    const magicalParticles = document.getElementById('magical-particles');
    const emojiMagicButton = document.getElementById('emoji-magic-sprinkle');
    const emojis = ['💖', '🎀', '✨', '🦄', '🌈', '🦋', '💕'];
    let emojiInterval;
    let isSprinkleActive = false;

    function createEmojiSprinkle() {
        const emoji = document.createElement('div');
        emoji.classList.add('magic-emoji');
        
        // Random horizontal position
        emoji.style.left = `${Math.random() * 100}%`;
        
        // Random emoji selection
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Falling animation with adjusted smoother timing
        emoji.style.animation = `particle-soft-fall ${Math.random() * 4 + 4}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        
        magicalParticles.appendChild(emoji);
    
        // Remove emoji after animation ends
        emoji.addEventListener('animationend', () => {
            emoji.remove();
        });
    }

    function toggleEmojiSprinkle() {
        if (!isSprinkleActive) {
            // Start sprinkle
            emojiInterval = setInterval(createEmojiSprinkle, 300);
            isSprinkleActive = true;
            emojiMagicButton.classList.add('active');
        } else {
            // Stop sprinkle
            clearInterval(emojiInterval);
            isSprinkleActive = false;
            emojiMagicButton.classList.remove('active');
        }
    }

    emojiMagicButton.addEventListener('click', toggleEmojiSprinkle);

    // Birthday Music Player
    const musicButton = document.getElementById('birthday-music');
    const audio = new Audio('audio.mp3'); // Replace with your birthday song
    let isPlaying = false;

    musicButton.addEventListener('click', () => {
        if (!isPlaying) {
            audio.play();
            musicButton.classList.add('music-playing');  // Add the 'music-playing' class
            musicButton.classList.add('active');  // You can add an 'active' class for the button's active state
            isPlaying = true;
        } else {
            audio.pause();
            musicButton.classList.remove('music-playing');  // Remove the 'music-playing' class
            musicButton.classList.remove('active');  // Remove the 'active' class
            isPlaying = false;
        }
    });

    // Function to create and animate multiple heart emojis when any button is clicked
    function sprayHearts(event) {
        const heartContainer = document.getElementById('magical-particles');
        const numberOfHearts = 10;  // Number of hearts to generate on each click
        
        for (let i = 0; i < numberOfHearts; i++) {
            const heart = document.createElement('div');
            heart.classList.add('magic-emoji');
            heart.textContent = '💖';  // Heart emoji

            // Position the heart near the center of the button clicked
            const rect = event.target.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            heart.style.left = `${centerX}px`;
            heart.style.top = `${centerY}px`;

            // Apply random direction and movement with custom properties
            const randomX = Math.random() * 100 - 50; // Random x-direction
            const randomY = Math.random() * 100 - 50; // Random y-direction
            heart.style.setProperty('--x', `${randomX}px`);
            heart.style.setProperty('--y', `${randomY}px`);

            // Add the heart to the magical particles container
            heartContainer.appendChild(heart);

            // Apply the animation that spreads the hearts in random directions
            heart.style.animation = `heart-spray 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

            // Remove the heart after the animation ends
            heart.addEventListener('animationend', () => {
                heart.remove();
            });
        }
    }

    // Add event listener to all buttons
    const buttons = document.querySelectorAll('.girly-button');
    buttons.forEach(button => {
        button.addEventListener('click', sprayHearts);
    });




    // Confetti Shower
    const confettiButton = document.getElementById('confetti-shower');

    confettiButton.addEventListener('click', () => {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = getRandomPinkColor();
            confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
            
            magicalParticles.appendChild(confetti);
    
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    });

    function getRandomPinkColor() {
        const pinkColors = [
            '#FF64A5', '#FFB6D1', '#FFCCE5', 
            '#FF69B4', '#FF1493'
        ];
        return pinkColors[Math.floor(Math.random() * pinkColors.length)];
    }
});
