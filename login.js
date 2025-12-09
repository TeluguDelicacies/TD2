import { signIn, getCurrentUser } from './lib/auth.js';

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const loginButton = document.getElementById('loginButton');
const buttonText = document.getElementById('buttonText');
const buttonLoader = document.getElementById('buttonLoader');

async function checkExistingSession() {
    try {
        const user = await getCurrentUser();
        if (user) {
            window.location.href = 'admin.html';
        }
    } catch (error) {
        console.log('No existing session');
    }
}

checkExistingSession();

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }

    setLoading(true);
    hideError();

    try {
        await signIn(email, password);
        window.location.href = 'admin.html';
    } catch (error) {
        console.error('Login error:', error);

        let message = 'Login failed. Please try again.';

        if (error.message.includes('Invalid login credentials')) {
            message = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
            message = 'Please confirm your email address';
        } else if (error.message.includes('network')) {
            message = 'Network error. Please check your connection.';
        }

        showError(message);
    } finally {
        setLoading(false);
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

function setLoading(loading) {
    loginButton.disabled = loading;
    buttonText.style.display = loading ? 'none' : 'inline';
    buttonLoader.style.display = loading ? 'inline-block' : 'none';
}
