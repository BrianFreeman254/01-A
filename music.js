// Ensure the music plays after a user interaction
document.addEventListener('DOMContentLoaded', () => {
    const audio = new Audio('Our song.mp3'); // Load the music file
    audio.loop = true; // Loop the music (optional)

    // Function to play the music
    const playMusic = () => {
        audio.play().catch(error => {
            console.error('Error playing music:', error);
            // Retry playing the music after a short delay
            setTimeout(playMusic, 1000);
        });
    };

    // Play music after the first user interaction (e.g., click, tap)
    const handleFirstInteraction = () => {
        playMusic();
        // Remove the event listener after the first interaction
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
});
