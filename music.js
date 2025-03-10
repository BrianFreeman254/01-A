 <script>
document.addEventListener('DOMContentLoaded', () => {
    // Create the audio element with proper error handling
    const audio = new Audio();
    
    // Handle loading errors
    audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        // Try a different approach or format if needed
        audio.src = 'Our song.mp3'; // Try loading again
    });
    
    // Set audio properties
    audio.src = 'Our song.mp3';
    audio.loop = true;
    
    // Improved playMusic function with better error handling
    const playMusic = () => {
        // Store the play promise
        const playPromise = audio.play();
        
        // Handle play() promise rejection properly
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('Error playing music:', error);
                
                // If error is related to user interaction requirement
                if (error.name === 'NotAllowedError') {
                    console.log('Waiting for user interaction...');
                } else {
                    // For other errors, retry after delay
                    setTimeout(playMusic, 1000);
                }
            });
        }
    };
    
    // Use multiple events for better browser compatibility
    const handleInteraction = () => {
        playMusic();
        
        // Remove all event listeners to prevent multiple calls
        ['click', 'touchstart', 'keydown', 'scroll'].forEach(event => {
            document.removeEventListener(event, handleInteraction);
        });
        
        // Add a backup check to ensure music is playing
        setTimeout(() => {
            if (audio.paused) {
                console.log('Music not playing, trying again...');
                playMusic();
            }
        }, 1000);
    };
    
    // Add multiple event listeners for better chances of capturing user interaction
    ['click', 'touchstart', 'keydown', 'scroll'].forEach(event => {
        document.addEventListener(event, handleInteraction);
    });
    
    // Provide visual indication that interaction is needed
    console.log('Please interact with the page to play music');
});
</script>
