/*
========================================
AUTHENTICATION SYSTEM
========================================
Handles user authentication for Telugu Delicacies Admin Panel
*/

import { supabase } from './lib/supabase.js'

class AuthManager {
  constructor() {
    this.currentUser = null
    this.isLoading = false
    
    this.init()
  }

  async init() {
    try {
      // Check if user is already logged in
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        return
      }

      if (session) {
        this.currentUser = session.user
        // Redirect to admin if already authenticated
        window.location.href = 'admin.html'
      }

      this.setupEventListeners()
      console.log('Auth manager initialized')
    } catch (error) {
      console.error('Error initializing auth:', error)
    }
  }

  setupEventListeners() {
    const form = document.getElementById('authForm')
    const loginBtn = document.getElementById('loginBtn')
    const signupBtn = document.getElementById('signupBtn')
    const passwordToggle = document.getElementById('passwordToggle')
    
    // Form submission for login
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        this.handleLogin()
      })
    }

    // Signup button
    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        this.handleSignup()
      })
    }

    // Password visibility toggle
    if (passwordToggle) {
      passwordToggle.addEventListener('click', () => {
        this.togglePasswordVisibility()
      })
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      
      if (event === 'SIGNED_IN' && session) {
        this.currentUser = session.user
        this.showSuccess('Successfully signed in! Redirecting...')
        
        // Redirect to admin panel after short delay
        setTimeout(() => {
          window.location.href = 'admin.html'
        }, 1500)
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null
      }
    })
  }

  async handleLogin() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (!email || !password) {
      this.showError('Please enter both email and password')
      return
    }

    try {
      this.showLoading('Signing you in...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) {
        throw error
      }

      console.log('Login successful:', data)
      // Success handling is done in onAuthStateChange
      
    } catch (error) {
      console.error('Login error:', error)
      this.hideLoading()
      
      let errorMessage = 'Login failed. Please try again.'
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account first.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment and try again.'
      }
      
      this.showError(errorMessage)
    }
  }

  async handleSignup() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (!email || !password) {
      this.showError('Please enter both email and password')
      return
    }

    if (password.length < 6) {
      this.showError('Password must be at least 6 characters long')
      return
    }

    try {
      this.showLoading('Creating your account...')
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: window.location.origin + '/login.html'
        }
      })

      if (error) {
        throw error
      }

      console.log('Signup successful:', data)
      this.hideLoading()
      
      if (data.user && !data.session) {
        // Email confirmation required
        this.showSuccess('Account created! Please check your email to confirm your account before signing in.')
      } else if (data.session) {
        // Auto sign-in successful
        this.showSuccess('Account created and signed in! Redirecting...')
      }
      
    } catch (error) {
      console.error('Signup error:', error)
      this.hideLoading()
      
      let errorMessage = 'Account creation failed. Please try again.'
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long.'
      } else if (error.message.includes('Unable to validate email')) {
        errorMessage = 'Please enter a valid email address.'
      }
      
      this.showError(errorMessage)
    }
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password')
    const toggleIcon = document.querySelector('#passwordToggle i')
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text'
      toggleIcon.className = 'fas fa-eye-slash'
    } else {
      passwordInput.type = 'password'
      toggleIcon.className = 'fas fa-eye'
    }
  }

  showLoading(message = 'Loading...') {
    this.isLoading = true
    
    const form = document.getElementById('authForm')
    const loading = document.getElementById('authLoading')
    const loadingMessage = document.getElementById('loadingMessage')
    
    if (form) form.classList.add('hidden')
    if (loading) loading.classList.remove('hidden')
    if (loadingMessage) loadingMessage.textContent = message
    
    this.hideMessages()
  }

  hideLoading() {
    this.isLoading = false
    
    const form = document.getElementById('authForm')
    const loading = document.getElementById('authLoading')
    
    if (form) form.classList.remove('hidden')
    if (loading) loading.classList.add('hidden')
  }

  showError(message) {
    const errorDiv = document.getElementById('authError')
    const errorMessage = document.getElementById('errorMessage')
    
    if (errorDiv && errorMessage) {
      errorMessage.textContent = message
      errorDiv.classList.remove('hidden')
    }
    
    // Hide success messages
    const successDiv = document.getElementById('authSuccess')
    if (successDiv) successDiv.classList.add('hidden')
    
    console.error('Auth error:', message)
  }

  showSuccess(message) {
    const successDiv = document.getElementById('authSuccess')
    const successMessage = document.getElementById('successMessage')
    
    if (successDiv && successMessage) {
      successMessage.textContent = message
      successDiv.classList.remove('hidden')
    }
    
    // Hide error messages
    const errorDiv = document.getElementById('authError')
    if (errorDiv) errorDiv.classList.add('hidden')
    
    console.log('Auth success:', message)
  }

  hideMessages() {
    const errorDiv = document.getElementById('authError')
    const successDiv = document.getElementById('authSuccess')
    
    if (errorDiv) errorDiv.classList.add('hidden')
    if (successDiv) successDiv.classList.add('hidden')
  }

  // Static method to check authentication status (for use in admin.js)
  static async checkAuthStatus() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error checking auth status:', error)
        return null
      }
      
      return session
    } catch (error) {
      console.error('Error in checkAuthStatus:', error)
      return null
    }
  }

  // Static method to sign out (for use in admin.js)
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
      
      console.log('Successfully signed out')
      window.location.href = 'login.html'
    } catch (error) {
      console.error('Error in signOut:', error)
      throw error
    }
  }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager()
})

// Export for use in other modules
export { AuthManager }