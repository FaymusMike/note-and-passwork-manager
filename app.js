// App state
let currentUser = null;
let passwords = [];
let notes = [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const registerScreen = document.getElementById('registerScreen');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');
const searchInput = document.getElementById('searchInput');
const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const addPasswordBtn = document.getElementById('addPasswordBtn');
const addFirstPassword = document.getElementById('addFirstPassword');
const addNoteBtn = document.getElementById('addNoteBtn');
const addFirstNote = document.getElementById('addFirstNote');
const passwordsList = document.getElementById('passwordsList');
const notesList = document.getElementById('notesList');
const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
const savePasswordBtn = document.getElementById('savePasswordBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const passwordForm = document.getElementById('passwordForm');
const noteForm = document.getElementById('noteForm');
const generatePasswordBtn = document.getElementById('generatePasswordBtn');
const copyGeneratedPassword = document.getElementById('copyGeneratedPassword');
const generatedPassword = document.getElementById('generatedPassword');
const passwordLength = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');
const darkModeToggle = document.getElementById('darkModeToggle');
const themeToggle = document.querySelector('.theme-toggle');
const exportData = document.getElementById('exportData');
const importData = document.getElementById('importData');
const importFile = document.getElementById('importFile');
const generateForModal = document.getElementById('generateForModal');

// Initialize the app
function initApp() {
    // Check if user is already logged in (in a real app, this would check Firebase Auth)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    }

    // Apply dark mode if enabled
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Load saved data
    loadPasswords();
    loadNotes();

    // Set up event listeners
    setupEventListeners();
    generatePassword(); // Generate initial password
}

// Set up all event listeners
function setupEventListeners() {
    // Auth events
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginScreen.style.display = 'none';
        registerScreen.style.display = 'block';
    });
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerScreen.style.display = 'none';
        loginScreen.style.display = 'block';
    });
    logoutBtn.addEventListener('click', handleLogout);

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.getAttribute('data-tab') || e.target.parentElement.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // Search
    searchInput.addEventListener('input', handleSearch);

    // Password actions
    addPasswordBtn.addEventListener('click', () => openPasswordModal());
    addFirstPassword.addEventListener('click', () => openPasswordModal());
    savePasswordBtn.addEventListener('click', savePassword);
    generateForModal.addEventListener('click', () => {
        const password = generatePassword();
        document.getElementById('passwordValue').value = password;
    });

    // Note actions
    addNoteBtn.addEventListener('click', () => openNoteModal());
    addFirstNote.addEventListener('click', () => openNoteModal());
    saveNoteBtn.addEventListener('click', saveNote);

    // Password generator
    generatePasswordBtn.addEventListener('click', () => generatePassword());
    copyGeneratedPassword.addEventListener('click', copyPassword);
    passwordLength.addEventListener('input', () => {
        lengthValue.textContent = passwordLength.value;
        generatePassword();
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Theme toggle
    darkModeToggle.addEventListener('change', toggleDarkMode);
    themeToggle.addEventListener('click', toggleDarkMode);

    // Data management
    exportData.addEventListener('click', exportUserData);
    importData.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', handleFileImport);

    // Password strength indicator for registration
    document.getElementById('registerPassword').addEventListener('input', updatePasswordStrength);
}

// Auth functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // In a real app, this would authenticate with Firebase
    // For demo purposes, we'll simulate authentication
    if (email && password) {
        currentUser = {
            email: email,
            name: email.split('@')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainApp();
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // In a real app, this would create a user in Firebase Auth
    // For demo purposes, we'll simulate registration
    currentUser = {
        email: email,
        name: name
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showMainApp();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    mainApp.style.display = 'none';
    loginScreen.style.display = 'block';
    registerScreen.style.display = 'none';
    
    // Reset forms
    loginForm.reset();
    registerForm.reset();
}

function showMainApp() {
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'none';
    mainApp.style.display = 'block';
    userEmail.textContent = currentUser.email;
}

// Tab navigation
function switchTab(tabName) {
    // Update active nav link
    navLinks.forEach(link => {
        if (link.getAttribute('data-tab') === tabName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Show active tab content
    tabContents.forEach(tab => {
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });
}

// Password functions
function openPasswordModal(password = null) {
    document.getElementById('passwordModalTitle').textContent = password ? 'Edit Password' : 'Add Password';
    document.getElementById('passwordId').value = password ? password.id : '';
    document.getElementById('passwordTitle').value = password ? password.title : '';
    document.getElementById('passwordUsername').value = password ? password.username : '';
    document.getElementById('passwordValue').value = password ? password.password : '';
    document.getElementById('passwordUrl').value = password ? password.url : '';
    document.getElementById('passwordNotes').value = password ? password.notes : '';
    
    passwordModal.show();
}

function savePassword() {
    const id = document.getElementById('passwordId').value || generateId();
    const title = document.getElementById('passwordTitle').value;
    const username = document.getElementById('passwordUsername').value;
    const password = document.getElementById('passwordValue').value;
    const url = document.getElementById('passwordUrl').value;
    const notes = document.getElementById('passwordNotes').value;

    if (!title || !password) {
        alert('Title and password are required');
        return;
    }

    const passwordData = {
        id,
        title,
        username,
        password,
        url,
        notes,
        createdAt: new Date().toISOString()
    };

    // In a real app, this would be encrypted and saved to Firebase
    if (document.getElementById('passwordId').value) {
        // Update existing password
        const index = passwords.findIndex(p => p.id === id);
        if (index !== -1) {
            passwords[index] = passwordData;
        }
    } else {
        // Add new password
        passwords.push(passwordData);
    }

    savePasswords();
    renderPasswords();
    passwordModal.hide();
    passwordForm.reset();
}

function deletePassword(id) {
    if (confirm('Are you sure you want to delete this password?')) {
        passwords = passwords.filter(p => p.id !== id);
        savePasswords();
        renderPasswords();
    }
}

function copyPasswordToClipboard(password) {
    navigator.clipboard.writeText(password).then(() => {
        // Show success feedback
        const toast = document.createElement('div');
        toast.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
        toast.textContent = 'Password copied to clipboard!';
        toast.style.zIndex = '9999';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2000);
    });
}

// Note functions
function openNoteModal(note = null) {
    document.getElementById('noteModalTitle').textContent = note ? 'Edit Note' : 'Add Note';
    document.getElementById('noteId').value = note ? note.id : '';
    document.getElementById('noteTitle').value = note ? note.title : '';
    document.getElementById('noteContent').value = note ? note.content : '';
    
    noteModal.show();
}

function saveNote() {
    const id = document.getElementById('noteId').value || generateId();
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    if (!title || !content) {
        alert('Title and content are required');
        return;
    }

    const noteData = {
        id,
        title,
        content,
        createdAt: new Date().toISOString()
    };

    // In a real app, this would be encrypted and saved to Firebase
    if (document.getElementById('noteId').value) {
        // Update existing note
        const index = notes.findIndex(n => n.id === id);
        if (index !== -1) {
            notes[index] = noteData;
        }
    } else {
        // Add new note
        notes.push(noteData);
    }

    saveNotes();
    renderNotes();
    noteModal.hide();
    noteForm.reset();
}

function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        renderNotes();
    }
}

// Password generator
function generatePassword() {
    const length = parseInt(passwordLength.value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // If no character types selected, use lowercase as default
    if (charset === '') charset = 'abcdefghijklmnopqrstuvwxyz';
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    generatedPassword.value = password;
    updatePasswordStrengthBars(password);
    
    return password;
}

function copyPassword() {
    if (generatedPassword.value) {
        navigator.clipboard.writeText(generatedPassword.value).then(() => {
            // Show success feedback
            const originalText = copyGeneratedPassword.innerHTML;
            copyGeneratedPassword.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyGeneratedPassword.innerHTML = originalText;
            }, 2000);
        });
    }
}

function updatePasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    updatePasswordStrengthBars(password, 'strengthBar');
}

function updatePasswordStrengthBars(password, prefix = 'genStrengthBar') {
    // Simple password strength calculation
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    // Reset all bars
    for (let i = 1; i <= 4; i++) {
        const bar = document.getElementById(`${prefix}${i}`);
        bar.style.backgroundColor = '#e0e0e0';
        if (document.body.classList.contains('dark-mode')) {
            bar.style.backgroundColor = '#444';
        }
    }
    
    // Update bars based on strength
    const strengthText = document.getElementById('passwordStrengthText');
    if (strength <= 2) {
        // Weak
        document.getElementById(`${prefix}1`).style.backgroundColor = '#e63946';
        strengthText.textContent = 'Strength: Weak';
        strengthText.style.color = '#e63946';
    } else if (strength <= 4) {
        // Fair
        document.getElementById(`${prefix}1`).style.backgroundColor = '#fca311';
        document.getElementById(`${prefix}2`).style.backgroundColor = '#fca311';
        strengthText.textContent = 'Strength: Fair';
        strengthText.style.color = '#fca311';
    } else if (strength <= 5) {
        // Good
        document.getElementById(`${prefix}1`).style.backgroundColor = '#ff9f1c';
        document.getElementById(`${prefix}2`).style.backgroundColor = '#ff9f1c';
        document.getElementById(`${prefix}3`).style.backgroundColor = '#ff9f1c';
        strengthText.textContent = 'Strength: Good';
        strengthText.style.color = '#ff9f1c';
    } else {
        // Strong
        document.getElementById(`${prefix}1`).style.backgroundColor = '#2a9d8f';
        document.getElementById(`${prefix}2`).style.backgroundColor = '#2a9d8f';
        document.getElementById(`${prefix}3`).style.backgroundColor = '#2a9d8f';
        document.getElementById(`${prefix}4`).style.backgroundColor = '#2a9d8f';
        strengthText.textContent = 'Strength: Strong';
        strengthText.style.color = '#2a9d8f';
    }
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase();
    
    // Filter passwords
    const filteredPasswords = passwords.filter(password => 
        password.title.toLowerCase().includes(query) ||
        password.username.toLowerCase().includes(query) ||
        (password.notes && password.notes.toLowerCase().includes(query))
    );
    
    // Filter notes
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
    
    renderPasswords(filteredPasswords);
    renderNotes(filteredNotes);
}

// Rendering functions
function renderPasswords(passwordsToRender = passwords) {
    if (passwordsToRender.length === 0) {
        passwordsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-key"></i>
                <h4>No passwords found</h4>
                <p>Try adjusting your search or add a new password</p>
                <button class="btn btn-primary mt-2" id="addFirstPassword">Add Password</button>
            </div>
        `;
        document.getElementById('addFirstPassword').addEventListener('click', () => openPasswordModal());
        return;
    }
    
    passwordsList.innerHTML = passwordsToRender.map(password => `
        <div class="password-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${escapeHtml(password.title)}</h6>
                    <p class="mb-1 text-muted small">${escapeHtml(password.username || 'No username')}</p>
                    <p class="mb-1 small">${password.url ? `<a href="${password.url}" target="_blank">${password.url}</a>` : ''}</p>
                    ${password.notes ? `<p class="mb-1 small">${escapeHtml(password.notes)}</p>` : ''}
                </div>
                <div class="password-actions">
                    <button class="action-btn" onclick="copyPasswordToClipboard('${escapeHtml(password.password)}')" title="Copy password">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn" onclick="openPasswordModal(${escapeHtml(JSON.stringify(password))})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn text-danger" onclick="deletePassword('${password.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderNotes(notesToRender = notes) {
    if (notesToRender.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sticky-note"></i>
                <h4>No notes found</h4>
                <p>Try adjusting your search or add a new note</p>
                <button class="btn btn-primary mt-2" id="addFirstNote">Add Note</button>
            </div>
        `;
        document.getElementById('addFirstNote').addEventListener('click', () => openNoteModal());
        return;
    }
    
    notesList.innerHTML = notesToRender.map(note => `
        <div class="note-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${escapeHtml(note.title)}</h6>
                    <p class="mb-1">${escapeHtml(note.content.length > 150 ? note.content.substring(0, 150) + '...' : note.content)}</p>
                    <small class="text-muted">Created: ${new Date(note.createdAt).toLocaleDateString()}</small>
                </div>
                <div class="note-actions">
                    <button class="action-btn" onclick="openNoteModal(${escapeHtml(JSON.stringify(note))})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn text-danger" onclick="deleteNote('${note.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Data persistence
function loadPasswords() {
    const saved = localStorage.getItem('passwords');
    if (saved) {
        passwords = JSON.parse(saved);
        renderPasswords();
    }
}

function savePasswords() {
    localStorage.setItem('passwords', JSON.stringify(passwords));
}

function loadNotes() {
    const saved = localStorage.getItem('notes');
    if (saved) {
        notes = JSON.parse(saved);
        renderNotes();
    }
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Theme management
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    
    if (isDarkMode) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        darkModeToggle.checked = true;
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        darkModeToggle.checked = false;
    }
    
    // Re-render to update colors
    renderPasswords();
    renderNotes();
}

// Data export/import
function exportUserData() {
    const data = {
        passwords: passwords,
        notes: notes,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `securevault-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.passwords && data.notes) {
                if (confirm('This will replace all your current passwords and notes. Continue?')) {
                    passwords = data.passwords;
                    notes = data.notes;
                    
                    savePasswords();
                    saveNotes();
                    renderPasswords();
                    renderNotes();
                    
                    alert('Data imported successfully!');
                }
            } else {
                alert('Invalid backup file format.');
            }
        } catch (error) {
            alert('Error reading backup file: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset the file input
    event.target.value = '';
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);