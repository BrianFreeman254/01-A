/**
 * Advanced Website PIN Security System
 * Secures website content behind a PIN verification overlay
 * PIN: 2005
 */

// Self-executing function to avoid polluting global namespace
(function() {
  // Configuration
  const CORRECT_PIN = '2005';
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 30000; // 30 seconds in milliseconds
  
  // State variables
  let attempts = 0;
  let isLocked = false;
  let lockTimer = null;
  
  // Check if user has already been authenticated in this session
  const isAuthenticated = sessionStorage.getItem('pinAuthenticated') === 'true';
  
  // Create overlay if not authenticated
  if (!isAuthenticated) {
    createSecurityOverlay();
  }
  
  /**
   * Creates and injects the security overlay into the DOM
   */
  function createSecurityOverlay() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'security-overlay';
    
    // Style the overlay
    const overlayStyles = {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '9999',
      fontFamily: 'Arial, sans-serif'
    };
    
    Object.assign(overlay.style, overlayStyles);
    
    // Create PIN entry container
    const pinContainer = document.createElement('div');
    pinContainer.id = 'pin-container';
    
    const containerStyles = {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '90%'
    };
    
    Object.assign(pinContainer.style, containerStyles);
    
    // Create content for PIN container
    pinContainer.innerHTML = `
      <h2 style="margin-top: 0; color: #333; font-size: 1.5rem;">Security Verification</h2>
      <p style="color: #666; margin-bottom: 1.5rem;">Please enter the PIN to access this website.</p>
      
      <div style="margin-bottom: 1.5rem;">
        <input type="password" id="pin-input" maxlength="4" autocomplete="off" inputmode="numeric" pattern="[0-9]*"
          style="padding: 0.75rem; font-size: 1.25rem; width: 80%; border: 2px solid #ddd; border-radius: 4px; text-align: center; letter-spacing: 0.5rem;">
      </div>
      
      <button id="submit-pin" 
        style="background-color: #4CAF50; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 1rem; cursor: pointer; transition: background-color 0.3s">
        Submit
      </button>
      
      <p id="error-message" style="color: #f44336; margin-top: 1rem; min-height: 1.5rem;"></p>
      <p id="attempts-message" style="color: #666; margin-top: 0.5rem; font-size: 0.9rem;"></p>
    `;
    
    // Append elements to DOM
    overlay.appendChild(pinContainer);
    document.body.appendChild(overlay);
    
    // Focus on PIN input field when overlay is shown
    setTimeout(() => {
      document.getElementById('pin-input').focus();
    }, 100);
    
    // Add event listeners
    const pinInput = document.getElementById('pin-input');
    const submitButton = document.getElementById('submit-pin');
    
    pinInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        verifyPin();
      }
      
      // Auto-submit when 4 digits are entered
      if (pinInput.value.length === 4) {
        setTimeout(verifyPin, 300); // Small delay for better UX
      }
    });
    
    submitButton.addEventListener('click', verifyPin);
    
    // Update attempts message
    updateAttemptsMessage();
  }
  
  /**
   * Verifies the entered PIN
   */
  function verifyPin() {
    if (isLocked) {
      return;
    }
    
    const pinInput = document.getElementById('pin-input');
    const enteredPin = pinInput.value;
    const errorMessage = document.getElementById('error-message');
    
    // Validate input
    if (!/^\d{4}$/.test(enteredPin)) {
      errorMessage.textContent = 'Please enter a 4-digit PIN.';
      pinInput.value = '';
      pinInput.focus();
      return;
    }
    
    // Check if PIN is correct
    if (enteredPin === CORRECT_PIN) {
      grantAccess();
    } else {
      attempts++;
      updateAttemptsMessage();
      
      // Apply security measures based on attempts
      if (attempts >= MAX_ATTEMPTS) {
        lockAccount();
      } else {
        errorMessage.textContent = 'Incorrect PIN. Please try again.';
        pinInput.value = '';
        pinInput.focus();
        
        // Apply subtle delay to prevent brute force
        submitButton.disabled = true;
        setTimeout(() => {
          submitButton.disabled = false;
        }, 1000);
      }
    }
  }
  
  /**
   * Updates the message showing remaining attempts
   */
  function updateAttemptsMessage() {
    const attemptsMessage = document.getElementById('attempts-message');
    const remainingAttempts = MAX_ATTEMPTS - attempts;
    
    if (remainingAttempts > 0 && attempts > 0) {
      attemptsMessage.textContent = `${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`;
    } else {
      attemptsMessage.textContent = '';
    }
  }
  
  /**
   * Locks the account for a specified time period
   */
  function lockAccount() {
    isLocked = true;
    
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.getElementById('submit-pin');
    const pinInput = document.getElementById('pin-input');
    
    errorMessage.textContent = 'Too many incorrect attempts. Please wait 30 seconds.';
    pinInput.disabled = true;
    submitButton.disabled = true;
    
    // Start countdown
    let secondsLeft = LOCKOUT_TIME / 1000;
    const attemptsMessage = document.getElementById('attempts-message');
    
    lockTimer = setInterval(() => {
      secondsLeft--;
      attemptsMessage.textContent = `Account locked. Try again in ${secondsLeft} second${secondsLeft !== 1 ? 's' : ''}.`;
      
      if (secondsLeft <= 0) {
        unlockAccount();
      }
    }, 1000);
  }
  
  /**
   * Unlocks the account after lockout period
   */
  function unlockAccount() {
    clearInterval(lockTimer);
    
    const errorMessage = document.getElementById('error-message');
    const attemptsMessage = document.getElementById('attempts-message');
    const submitButton = document.getElementById('submit-pin');
    const pinInput = document.getElementById('pin-input');
    
    isLocked = false;
    attempts = 0;
    
    errorMessage.textContent = '';
    attemptsMessage.textContent = '';
    
    pinInput.disabled = false;
    submitButton.disabled = false;
    
    pinInput.value = '';
    pinInput.focus();
  }
  
  /**
   * Grants access to the website when correct PIN is entered
   */
  function grantAccess() {
    // Set authenticated flag in session storage
    sessionStorage.setItem('pinAuthenticated', 'true');
    
    // Remove overlay with animation
    const overlay = document.getElementById('security-overlay');
    overlay.style.transition = 'opacity 0.5s ease-out';
    overlay.style.opacity = '0';
    
    // Remove overlay from DOM after animation
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 500);
  }
})();
