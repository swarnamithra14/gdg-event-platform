/* ========================================
   GDG EVENT PLATFORM - JAVASCRIPT
   Core functionality for registration, gallery, and participant management
   ======================================== */

// ============================================
// 1. LOCALSTORAGE MANAGEMENT
// ============================================

/**
 * Get data from LocalStorage
 * @param {string} key - The storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Stored data or default value
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from LocalStorage:', error);
        return defaultValue;
    }
}

/**
 * Save data to LocalStorage
 * @param {string} key - The storage key
 * @param {any} value - The value to store
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to LocalStorage:', error);
        alert('Storage limit exceeded. Please clear some data.');
    }
}

// ============================================
// 2. FORM VALIDATION
// ============================================

/**
 * Validate email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (at least 10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone
 */
function isValidPhone(phone) {
    const phoneRegex = /^\d{10,}$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10;
}

/**
 * Validate first name (non-empty, at least 2 characters)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid
 */
function isValidName(name) {
    return name.trim().length >= 2;
}

/**
 * Clear all validation errors
 */
function clearValidationErrors() {
    document.querySelectorAll('.form-text').forEach(error => {
        error.textContent = '';
    });
}

/**
 * Display validation error
 * @param {string} fieldId - Field ID
 * @param {string} message - Error message
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Validate entire registration form
 * @returns {boolean} - True if form is valid
 */
function validateForm() {
    clearValidationErrors();
    let isValid = true;

    // Validate first name
    const firstName = document.getElementById('firstName').value;
    if (!isValidName(firstName)) {
        showError('firstName', 'First name must be at least 2 characters');
        isValid = false;
    }

    // Validate last name
    const lastName = document.getElementById('lastName').value;
    if (!isValidName(lastName)) {
        showError('lastName', 'Last name must be at least 2 characters');
        isValid = false;
    }

    // Validate email
    const email = document.getElementById('email').value;
    if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate phone
    const phone = document.getElementById('phone').value;
    if (!isValidPhone(phone)) {
        showError('phone', 'Phone number must have at least 10 digits');
        isValid = false;
    }

    return isValid;
}

// ============================================
// 3. REGISTRATION FORM HANDLING
// ============================================

/**
 * Get selected interests from checkboxes
 * @returns {array} - Array of selected interests
 */
function getSelectedInterests() {
    const interests = [];
    document.querySelectorAll('.form-check-input:checked').forEach(checkbox => {
        if (checkbox.id.startsWith('interest-')) {
            interests.push(checkbox.value);
        }
    });
    return interests;
}

/**
 * Create registration object
 * @returns {object} - Registration data
 */
function createRegistration() {
    return {
        id: Date.now(),
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        interests: getSelectedInterests(),
        rsvp: document.querySelector('input[name="rsvp"]:checked').value,
        message: document.getElementById('message').value,
        registeredAt: new Date().toLocaleString()
    };
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // Validate form
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }

    // Create registration object
    const registration = createRegistration();

    // Get existing registrations
    let registrations = getFromStorage('registrations', []);

    // Add new registration
    registrations.push(registration);

    // Save to LocalStorage
    saveToStorage('registrations', registrations);

    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';

    // Reset form
    document.getElementById('registrationForm').reset();

    // Clear error messages
    clearValidationErrors();

    // Update participants display
    updateParticipantsDisplay();

    // Hide success message after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);

    console.log('Registration saved:', registration);
}

// ============================================
// 4. GALLERY & IMAGE UPLOAD
// ============================================

/**
 * Convert file to Base64 for LocalStorage
 * @param {File} file - File to convert
 * @returns {Promise} - Promise with Base64 string
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Handle image upload
 * @param {FileList} files - Files to upload
 */
async function handleImageUpload(files) {
    const galleryImages = getFromStorage('galleryImages', []);
    const progressSection = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');

    // Show progress bar
    progressSection.style.display = 'block';
    progressBar.style.width = '0%';

    try {
        // Process each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file type
            if (!file.type.startsWith('image/')) {
                console.warn(`Skipping non-image file: ${file.name}`);
                continue;
            }

            // Check file size (max 2MB per image)
            if (file.size > 2 * 1024 * 1024) {
                console.warn(`File too large: ${file.name}`);
                continue;
            }

            // Convert to Base64
            const base64 = await fileToBase64(file);

            // Create image object
            const imageData = {
                id: Date.now() + i,
                src: base64,
                name: file.name,
                uploadedAt: new Date().toLocaleString()
            };

            // Add to gallery
            galleryImages.push(imageData);

            // Update progress
            const progress = ((i + 1) / files.length) * 100;
            progressBar.style.width = progress + '%';
        }

        // Save to LocalStorage
        saveToStorage('galleryImages', galleryImages);

        // Hide progress bar
        setTimeout(() => {
            progressSection.style.display = 'none';
        }, 500);

        // Update gallery display
        displayGalleryImages();

        console.log(`Successfully uploaded ${files.length} images`);
    } catch (error) {
        console.error('Error uploading images:', error);
        alert('Error uploading images. Please try again.');
        progressSection.style.display = 'none';
    }
}

/**
 * Display gallery images from LocalStorage
 */
function displayGalleryImages() {
    const galleryContainer = document.getElementById('galleryContainer');
    const noImagesMessage = document.getElementById('noImagesMessage');
    const galleryImages = getFromStorage('galleryImages', []);

    // Clear existing images
    galleryContainer.innerHTML = '';

    if (galleryImages.length === 0) {
        galleryContainer.style.display = 'none';
        noImagesMessage.style.display = 'block';
        return;
    }

    galleryContainer.style.display = 'grid';
    noImagesMessage.style.display = 'none';

    // Display each image
    galleryImages.forEach(imageData => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'col-md-4 col-sm-6';
        galleryItem.innerHTML = `
            <div class="gallery-item">
                <img src="${imageData.src}" alt="${imageData.name}" class="img-fluid">
                <div class="gallery-overlay">
                    <button class="delete-btn" onclick="deleteImage(${imageData.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        galleryContainer.appendChild(galleryItem);
    });

    // Update image count
    updateImageCount();
}

/**
 * Delete an image from gallery
 * @param {number} imageId - Image ID to delete
 */
function deleteImage(imageId) {
    if (!confirm('Are you sure you want to delete this image?')) {
        return;
    }

    let galleryImages = getFromStorage('galleryImages', []);
    galleryImages = galleryImages.filter(img => img.id !== imageId);
    saveToStorage('galleryImages', galleryImages);
    displayGalleryImages();
    console.log('Image deleted:', imageId);
}

/**
 * Update image count in statistics
 */
function updateImageCount() {
    const galleryImages = getFromStorage('galleryImages', []);
    document.getElementById('galleryImageCount').textContent = galleryImages.length;
}

/**
 * Setup drag and drop functionality
 */
function setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');

    // Click to upload
    dropZone.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => handleImageUpload(e.target.files));

    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleImageUpload(e.dataTransfer.files);
    });
}

// ============================================
// 5. COUNTDOWN TIMER
// ============================================

/**
 * Calculate and update countdown timer
 */
function updateCountdown() {
    // Event date: May 15, 2026, 9:00 AM
    const eventDate = new Date('2026-05-15T09:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = eventDate - now;

    // Calculate time units
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Update display
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

    // If event has passed
    if (timeLeft < 0) {
        document.getElementById('countdown').innerHTML = '<p class="w-100 text-center">Event has started!</p>';
    }
}

/**
 * Initialize countdown timer (updates every second)
 */
function initializeCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// 6. PARTICIPANTS MANAGEMENT
// ============================================

/**
 * Calculate and display participant statistics
 */
function updateParticipantStats() {
    const registrations = getFromStorage('registrations', []);
    const rsvpYes = registrations.filter(r => r.rsvp === 'Yes').length;
    const rsvpNo = registrations.filter(r => r.rsvp === 'No').length;

    document.getElementById('totalParticipants').textContent = registrations.length;
    document.getElementById('rsvpYesCount').textContent = rsvpYes;
    document.getElementById('rsvpNoCount').textContent = rsvpNo;
}

/**
 * Display all registered participants
 */
function updateParticipantsDisplay() {
    const registrations = getFromStorage('registrations', []);
    const participantsList = document.getElementById('participantsList');
    const noParticipantsMessage = document.getElementById('noParticipantsMessage');

    // Clear existing list
    participantsList.innerHTML = '';

    if (registrations.length === 0) {
        participantsList.style.display = 'none';
        noParticipantsMessage.style.display = 'block';
        return;
    }

    participantsList.style.display = 'block';
    noParticipantsMessage.style.display = 'none';

    // Sort by registration date (newest first)
    registrations.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

    // Display each participant
    registrations.forEach(registration => {
        const participantItem = document.createElement('div');
        participantItem.className = 'participant-item';

        // Determine RSVP badge
        const rsvpBadgeClass = registration.rsvp === 'Yes' ? 'yes' : 'no';
        const rsvpIcon = registration.rsvp === 'Yes' ? 'check-circle' : 'times-circle';

        // Build interests HTML
        let interestsHTML = '';
        if (registration.interests && registration.interests.length > 0) {
            interestsHTML = `
                <div class="participant-interests">
                    ${registration.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                </div>
            `;
        }

        // Build participant card
        participantItem.innerHTML = `
            <div class="participant-header">
                <h5 class="participant-name">
                    <i class="fas fa-user-circle text-primary me-2"></i>
                    ${registration.firstName} ${registration.lastName}
                </h5>
                <span class="participant-badge ${rsvpBadgeClass}">
                    <i class="fas fa-${rsvpIcon}"></i> ${registration.rsvp}
                </span>
            </div>
            <div class="participant-details">
                <div class="participant-detail">
                    <i class="fas fa-envelope"></i>
                    <span>${registration.email}</span>
                </div>
                <div class="participant-detail">
                    <i class="fas fa-phone"></i>
                    <span>${registration.phone}</span>
                </div>
                ${registration.company ? `
                <div class="participant-detail">
                    <i class="fas fa-building"></i>
                    <span>${registration.company}</span>
                </div>
                ` : ''}
                <div class="participant-detail">
                    <i class="fas fa-clock"></i>
                    <span>${registration.registeredAt}</span>
                </div>
            </div>
            ${interestsHTML}
            ${registration.message ? `
            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
                <strong>Note:</strong> "${registration.message}"
            </div>
            ` : ''}
        `;

        participantsList.appendChild(participantItem);
    });

    // Update statistics
    updateParticipantStats();
}

// ============================================
// 7. DATA MANAGEMENT
// ============================================

/**
 * Clear all data from LocalStorage
 */
function clearAllData() {
    if (!confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
        return;
    }

    localStorage.removeItem('registrations');
    localStorage.removeItem('galleryImages');

    // Reset displays
    updateParticipantsDisplay();
    displayGalleryImages();
    updateParticipantStats();
    updateImageCount();

    alert('All data has been cleared successfully.');
    console.log('All data cleared from LocalStorage');
}

// ============================================
// 8. INITIALIZATION
// ============================================

/**
 * Initialize all components when page loads
 */
function initializeApp() {
    console.log('Initializing GDG Event Platform...');

    // Setup event listeners
    document.getElementById('registrationForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllData);

    // Initialize features
    setupDragAndDrop();
    initializeCountdown();
    displayGalleryImages();
    updateParticipantsDisplay();

    console.log('GDG Event Platform initialized successfully!');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// ============================================
// 9. CONSOLE LOGGING FOR DEBUGGING
// ============================================

// Log current storage state (helpful for debugging)
function logStorageState() {
    console.log('=== LOCALSTORAGE STATE ===');
    console.log('Registrations:', getFromStorage('registrations', []));
    console.log('Gallery Images:', getFromStorage('galleryImages', []).map(img => ({
        id: img.id,
        name: img.name,
        uploadedAt: img.uploadedAt
    })));
    console.log('========================');
}

// Make it available in console for debugging
window.logStorageState = logStorageState;
window.clearAllData = clearAllData;
