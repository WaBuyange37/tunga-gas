import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'; // For side cart/menu
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // For account dropdown
import { ScrollArea } from '@/components/ui/scroll-area'; // For scrollable cart content
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // For user avatar
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // For account dropdown menu
import { Search, ShoppingCart, User, LogOut, Package, Settings, Info, AlertTriangle, X } from 'lucide-react'; // Icons

// --- Utility Components and Functions ---

// Info Modal for general messages
const InfoModal = ({ message, onClose, title = "Notification" }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-fade-in-up">
        <h3 className="text-lg font-bold mb-3">{title}</h3>
        <p className="text-gray-700 mb-4">{message}</p>
        <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">OK</Button>
      </div>
    </div>
  );
};

// Sanitizes input by replacing potentially harmful characters
const sanitizeInput = (input) => input.replace(/[<>"'`]/g, '');

// Validates email format
const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// Validates password strength (at least 8 characters, one lowercase, one uppercase, one digit, one special character)
const validatePassword = (pw) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(pw);

// Function to get password strength feedback
const getPasswordStrength = (password) => {
  let strength = 0;
  const feedback = [];

  if (password.length >= 8) {
    strength += 1;
  } else {
    feedback.push("Password must be at least 8 characters long.");
  }
  if (/[a-z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Include a lowercase letter.");
  }
  if (/[A-Z]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Include an uppercase letter.");
  }
  if (/\d/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Include a number.");
  }
  if (/[!@#$%^&*]/.test(password)) {
    strength += 1;
  } else {
    feedback.push("Include a special character (!@#$%^&*).");
  }

  let strengthText = "Very Weak";
  let textColor = "text-red-500";
  if (strength >= 3) {
    strengthText = "Weak";
    textColor = "text-orange-500";
  }
  if (strength >= 4) {
    strengthText = "Moderate";
    textColor = "text-yellow-500";
  }
  if (strength === 5) {
    strengthText = "Strong";
    textColor = "text-green-500";
  }

  return { strength, strengthText, textColor, feedback };
};


// Simulates a simple password hashing (for demonstration only, NOT secure for production)
const simulateHashPassword = (password) => {
  return btoa(password).slice(0, 32); // Simple base64 and truncate for simulation
};

// Generates a cryptographically secure token (e.g., for session management)
const generateSecureToken = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

// Custom hook to handle user activity timeout for session expiry
const useActivityTimeout = (onTimeout, delay = 600000) => { // Default delay is 10 minutes (600,000 ms)
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetTimer = useCallback(() => setLastActivity(Date.now()), []);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > delay) {
        onTimeout();
      }
    }, 10000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearInterval(interval);
    };
  }, [lastActivity, resetTimer, onTimeout, delay]);
};

// Component to display security logs in a table
const SecurityLogsTable = ({ logs, filter }) => {
  return (
    <div className="overflow-auto max-h-60 mt-4 border border-gray-200 rounded-lg shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-2 text-gray-600">Time</th>
            <th className="px-4 py-2 text-gray-600">Event</th>
            <th className="px-4 py-2 text-gray-600">Severity</th>
          </tr>
        </thead>
        <tbody>
          {logs
            .filter((log) => !filter || log.severity === filter)
            .map((log, index) => (
              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2">{log.time}</td>
                <td className="px-4 py-2">{log.event}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${log.severity === 'info' ? 'bg-blue-100 text-blue-800' : ''}
                    ${log.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${log.severity === 'critical' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {log.severity.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

// Dummy product data for the E-commerce display
const dummyProducts = [
  { id: 'gas-cyl-5kg', name: '5 KG Propane Gas Cylinder', price: 15.99, imageUrl: 'https://m.media-amazon.com/images/I/41JkS4zD+9L._AC_SY200_.jpg', description: 'Portable and efficient gas cylinder for home use.' },
  { id: 'gas-cyl-10kg', name: '10 KG Butane Gas Cylinder', price: 28.50, imageUrl: 'https://m.media-amazon.com/images/I/41-q0-jWdEL._AC_SY200_.jpg', description: 'Larger capacity, ideal for cooking and heating.' },
  { id: 'regulator-kit', name: 'Gas Regulator & Hose Kit', price: 9.75, imageUrl: 'https://m.media-amazon.com/images/I/41t7t3y-RSL._AC_SY200_.jpg', description: 'Complete kit for safe and secure gas connection.' },
  { id: 'gas-heater', name: 'Outdoor Patio Gas Heater', price: 120.00, imageUrl: 'https://m.media-amazon.com/images/I/41d8o1d0pTL._AC_SY200_.jpg', description: 'Warm your outdoor space with a stylish gas heater.' },
  { id: 'portable-stove', name: 'Portable Dual Fuel Gas Stove', price: 35.00, imageUrl: 'https://m.media-amazon.com/images/I/41m9e0m8QPL._AC_SY200_.jpg', description: 'Compact and powerful stove for camping and outdoor activities.' },
  { id: 'gas-torch', name: 'Butane Gas Torch Kit', price: 22.45, imageUrl: 'https://m.media-amazon.com/images/I/31M0x5J-4wL._AC_SY200_.jpg', description: 'Multi-purpose torch for soldering, culinary, and DIY.' },
  { id: 'refill-adapter', name: 'Propane Refill Adapter', price: 7.99, imageUrl: 'https://m.media-amazon.com/images/I/418f2g-kLUL._AC_SY200_.jpg', description: 'Convenient adapter for refilling smaller propane tanks.' },
  { id: 'gas-detector', name: 'Natural Gas Leak Detector', price: 49.00, imageUrl: 'https://m.media-amazon.com/images/I/419+aV3q2uL._AC_SY200_.jpg', description: 'Ensure safety with audible and visual gas leak alerts.' },
];


// --- Main Application Component (Redesigned) ---

export default function TungaGasSecuritySystem() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logs, setLogs] = useState([]);
  const [lockedOut, setLockedOut] = useState(false); // Overall UI lockout
  const [filter, setFilter] = useState('');
  const [sessionActive, setSessionActive] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [infoModalMessage, setInfoModalMessage] = useState('');
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [loginError, setLoginError] = useState(''); // Specific error for login form

  // OTP states
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0); // Countdown for OTP expiration
  const [resendAttempts, setResendAttempts] = useState(0); // Limit OTP resends
  const maxResendAttempts = 3;

  // Simulated in-memory user store (NOT for production use)
  const [users, setUsers] = useState(() => {
    // Initialize with a default user for easy testing
    const defaultUserEmail = 'user@example.com';
    const defaultUserPassword = simulateHashPassword('Password123!');
    return {
      [defaultUserEmail]: {
        passwordHash: defaultUserPassword,
        role: 'customer',
        failedLoginAttempts: 0, // New: Track failed attempts per user
        failedOtpAttempts: 0,   // New: Track failed OTP attempts per user
        lockedUntil: null,      // Timestamp when lockout expires
      }
    };
  });

  // E-commerce specific states
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to log security events
  const logEvent = (event, severity = 'info') => {
    setLogs((prev) => [...prev, { time: new Date().toLocaleTimeString(), event, severity }]);
  };

  // Effect to manage OTP timer
  useEffect(() => {
    let timerInterval;
    if (showOtpInput && otpTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && showOtpInput) {
      // OTP expired
      setInfoModalTitle('OTP Expired');
      setInfoModalMessage('The OTP has expired. Please request a new one.');
      logEvent('OTP expired', 'warning');
      setShowOtpInput(false);
      setOtp('');
      setSimulatedOtp('');
      setLoginError('OTP expired. Please try logging in again.'); // Set login form error
    }
    return () => clearInterval(timerInterval);
  }, [otpTimer, showOtpInput]);

  // Handles user login - now initiates OTP flow
  const handleLogin = () => {
    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);
    setLoginError(''); // Clear previous login errors

    const user = users[cleanEmail];

    if (!user) {
      setLoginError('Invalid email or password.');
      logEvent(`Login failed: User not found for ${cleanEmail}`, 'warning');
      return;
    }

    // Check if account is currently locked
    if (user.lockedUntil && Date.now() < user.lockedUntil) {
      const remainingTime = Math.ceil((user.lockedUntil - Date.now()) / 1000); // in seconds
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      setLoginError(`Account locked. Try again in ${minutes}m ${seconds}s.`);
      logEvent(`Login attempt on locked account for ${cleanEmail}`, 'warning');
      setLockedOut(true); // Ensure UI reflects lockout
      return;
    }

    if (simulateHashPassword(cleanPassword) !== user.passwordHash) {
      const updatedFailedAttempts = user.failedLoginAttempts + 1;
      let newLockedUntil = null;
      let errorMessage = 'Invalid email or password.';

      // Implement exponential backoff for lockout
      if (updatedFailedAttempts >= 3) { // After 3 failed attempts
        const lockoutDuration = Math.pow(2, updatedFailedAttempts - 3) * 60 * 1000; // 1, 2, 4, 8 minutes etc.
        newLockedUntil = Date.now() + lockoutDuration;
        errorMessage = `Too many failed attempts. Account locked for ${Math.ceil(lockoutDuration / 1000 / 60)} minutes.`;
        setLockedOut(true);
        logEvent(`User ${cleanEmail} locked out for ${Math.ceil(lockoutDuration / 1000 / 60)} minutes`, 'critical');
      }

      setUsers(prev => ({
        ...prev,
        [cleanEmail]: { ...prev[cleanEmail], failedLoginAttempts: updatedFailedAttempts, lockedUntil: newLockedUntil }
      }));
      setLoginError(errorMessage);
      logEvent(`Login failed: Incorrect password for ${cleanEmail}`, 'warning');
      return;
    }

    // If email and password are correct, proceed to OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    setSimulatedOtp(generatedOtp);
    setShowOtpInput(true); // Move to OTP input step
    setOtpTimer(60); // OTP expires in 60 seconds
    setResendAttempts(0); // Reset resend attempts for new login flow
    setInfoModalTitle('OTP Sent');
    setInfoModalMessage(`A 6-digit OTP has been sent to your email (${cleanEmail}). Please enter it to proceed. (Simulated OTP: ${generatedOtp})`);
    logEvent(`OTP sent to ${cleanEmail}`, 'info');
    // Reset login specific attempts for this user, but not overall lockout state yet
    setUsers(prev => ({
      ...prev,
      [cleanEmail]: { ...prev[cleanEmail], failedLoginAttempts: 0 }
    }));
  };

  // Handles OTP verification
  const handleOtpVerification = () => {
    setLoginError(''); // Clear OTP specific errors
    const user = users[email]; // Get current user for OTP attempts

    if (otpTimer === 0) {
      setInfoModalTitle('OTP Expired');
      setInfoModalMessage('The OTP has expired. Please request a new one.');
      logEvent('OTP verification failed: OTP expired', 'warning');
      setShowOtpInput(false);
      setOtp('');
      setSimulatedOtp('');
      setLoginError('OTP expired. Please try logging in again.');
      return;
    }

    if (otp === simulatedOtp) {
      logEvent(`OTP verification successful for ${email}`, 'info');
      setInfoModalTitle('Login Successful');
      setInfoModalMessage('OTP verified. Simulating biometric check... Redirecting to dashboard.');
      setIsAuthenticated(true);
      setShowOtpInput(false); // Hide OTP input
      setOtp(''); // Clear OTP input
      setSimulatedOtp(''); // Clear simulated OTP
      setOtpTimer(0); // Stop OTP timer
      // Clear all lockout and attempt states for the user on successful login
      setUsers(prev => ({
        ...prev,
        [email]: { ...prev[email], failedLoginAttempts: 0, failedOtpAttempts: 0, lockedUntil: null }
      }));
      setLockedOut(false); // Clear overall UI lockout
      const token = generateSecureToken();
      logEvent(`Session token generated: ${token.slice(0, 8)}...`, 'info');
    } else {
      const updatedFailedOtpAttempts = user.failedOtpAttempts + 1;
      let newLockedUntil = null;
      let errorMessage = 'The OTP you entered is incorrect. Please try again.';

      if (updatedFailedOtpAttempts >= 3) { // After 3 failed OTP attempts
        const lockoutDuration = Math.pow(2, updatedFailedOtpAttempts - 3) * 60 * 1000;
        newLockedUntil = Date.now() + lockoutDuration;
        errorMessage = `Too many failed OTP attempts. Account locked for ${Math.ceil(lockoutDuration / 1000 / 60)} minutes.`;
        setLockedOut(true);
        logEvent(`User ${email} locked out after multiple failed OTP attempts`, 'critical');
        setShowOtpInput(false); // Go back to login form
      }

      setUsers(prev => ({
        ...prev,
        [email]: { ...prev[email], failedOtpAttempts: updatedFailedOtpAttempts, lockedUntil: newLockedUntil }
      }));
      setLoginError(errorMessage);
      logEvent('Invalid OTP attempt', 'warning');
    }
  };

  // Handles new user registration
  const handleRegister = () => {
    if (!sessionActive) return;

    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(password);
    const cleanConfirmPassword = sanitizeInput(confirmPassword);
    setLoginError(''); // Clear registration errors

    if (!validateEmail(cleanEmail)) {
      setLoginError('Invalid email format.');
      logEvent('Registration failed: Invalid email', 'warning');
      return;
    }
    const passwordStrength = getPasswordStrength(cleanPassword);
    if (passwordStrength.strength < 5) { // Ensure password is 'Strong'
      setLoginError('Password does not meet strength requirements. ' + passwordStrength.feedback.join(' '));
      logEvent('Registration failed: Weak password', 'warning');
      return;
    }
    if (cleanPassword !== cleanConfirmPassword) {
      setLoginError('Passwords do not match.');
      logEvent('Registration failed: Passwords mismatch', 'warning');
      return;
    }

    if (users[cleanEmail]) {
      setLoginError('An account with this email already exists. Please log in.');
      logEvent(`Registration failed: Email already exists (${cleanEmail})`, 'warning');
      return;
    }

    // Simulate successful registration
    const hashedPassword = simulateHashPassword(cleanPassword);
    setUsers(prev => ({
      ...prev,
      [cleanEmail]: { passwordHash: hashedPassword, role: 'customer', failedLoginAttempts: 0, failedOtpAttempts: 0, lockedUntil: null }
    }));

    logEvent(`New user registered: ${cleanEmail}`, 'info');
    setInfoModalTitle('Registration Successful');
    setInfoModalMessage('Account created! Please log in with your new credentials.');
    setIsRegistering(false); // Switch back to login form
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // Handles session timeout
  const handleTimeout = () => {
    if (isAuthenticated) {
      logEvent('Session expired due to inactivity', 'warning');
      setInfoModalTitle('Session Expired');
      setInfoModalMessage('Your session has expired due to inactivity. Please log in again.');
    }
    setSessionActive(false);
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setLockedOut(false); // Reset overall UI lockout
    setConfirmPassword('');
    setShowOtpInput(false);
    setOtp('');
    setSimulatedOtp('');
    setOtpTimer(0);
    setResendAttempts(0);
    setCartItems([]);
    setLoginError(''); // Clear any login errors
  };

  // Handles logging out the user
  const handleLogout = () => {
    logEvent('User logged out', 'info');
    setIsAuthenticated(false);
    setSessionActive(true);
    setEmail('');
    setPassword('');
    setLockedOut(false); // Reset overall UI lockout
    setConfirmPassword('');
    setShowOtpInput(false);
    setOtp('');
    setSimulatedOtp('');
    setOtpTimer(0);
    setResendAttempts(0);
    setCartItems([]);
    setInfoModalTitle('Logged Out');
    setInfoModalMessage('You have been successfully logged out.');
    setLoginError(''); // Clear any login errors
  };

  // Handles resetting login/registration form state
  const handleResetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLockedOut(false); // Reset overall UI lockout
    setSessionActive(true);
    setInfoModalMessage('');
    setShowOtpInput(false);
    setOtp('');
    setSimulatedOtp('');
    setOtpTimer(0);
    setResendAttempts(0);
    setLoginError(''); // Clear any login errors
    // Also reset individual user's failed attempts if they exist
    if (users[email]) {
        setUsers(prev => ({
            ...prev,
            [email]: { ...prev[email], failedLoginAttempts: 0, failedOtpAttempts: 0, lockedUntil: null }
        }));
    }
    logEvent('Login/Registration form state reset', 'info');
  };

  // Handles simulated forgot password flow
  const handleForgotPassword = () => {
    const cleanEmail = sanitizeInput(email);
    setLoginError(''); // Clear errors

    if (!validateEmail(cleanEmail)) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (!users[cleanEmail]) {
      setLoginError('No account found with that email address.');
      logEvent(`Password reset failed: Email not found (${cleanEmail})`, 'warning');
      return;
    }
    setInfoModalTitle('Password Reset');
    setInfoModalMessage(`A password reset link has been sent to ${cleanEmail}. (Simulation)`);
    logEvent(`Password reset initiated for ${cleanEmail}`, 'info');
  };

  // Handles resending OTP
  const handleResendOtp = () => {
    if (resendAttempts >= maxResendAttempts) {
      setInfoModalTitle('Resend Limit Reached');
      setInfoModalMessage('You have requested too many OTPs. Please try again later or reset the form.');
      logEvent('OTP resend limit reached', 'warning');
      return;
    }
    if (!email) {
      setInfoModalTitle('Resend OTP Error');
      setInfoModalMessage('Please enter your email first.');
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(newOtp);
    setOtpTimer(60); // Reset timer for new OTP
    setResendAttempts(prev => prev + 1);
    setInfoModalTitle('OTP Resent');
    setInfoModalMessage(`A new OTP has been sent to ${email}. (Simulated OTP: ${newOtp})`);
    logEvent(`OTP resent to ${email}`, 'info');
  };

  // E-commerce handlers (unchanged)
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    setInfoModalTitle('Item Added');
    setInfoModalMessage(`${product.name} added to cart.`);
    logEvent(`Added ${product.name} to cart`, 'info');
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find(item => item.id === productId);
      if (itemToRemove && itemToRemove.quantity > 1) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter((item) => item.id !== productId);
      }
    });
    setInfoModalTitle('Item Removed');
    setInfoModalMessage('Item removed from cart.');
    logEvent(`Removed item from cart (ID: ${productId})`, 'info');
  };

  const handleCheckout = () => {
    setInfoModalTitle('Checkout (Simulated)');
    setInfoModalMessage(`Proceeding to checkout with ${cartItems.length} items. Total: $${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}. (Further steps simulated)`);
    logEvent('Checkout initiated (simulated)', 'info');
    setCartItems([]); // Clear cart after simulated checkout
    setIsCartOpen(false); // Close cart
  };

  const filteredProducts = dummyProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const passwordStrength = getPasswordStrength(password);

  useActivityTimeout(handleTimeout);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      {/* Top Navigation Bar (Amazon/eBay Style) */}
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-4">
          <a href="#" className="text-xl font-bold text-orange-400 hover:text-orange-300">TungaGas</a>
          <div className="relative flex-grow max-w-lg">
            <Input
              type="text"
              placeholder="Search Tunga Gas products..."
              className="w-full bg-white text-gray-900 px-4 py-2 rounded-md pl-10 focus:ring-2 focus:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback><User size={20} /></AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Hello, {email.split('@')[0] || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setInfoModalTitle('Account'); setInfoModalMessage('Your account settings (simulated).'); logEvent('Viewed account settings', 'info'); }}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Your Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setInfoModalTitle('Orders'); setInfoModalMessage('Your past orders (simulated).'); logEvent('Viewed orders', 'info'); }}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>Your Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setInfoModalTitle('Security'); setInfoModalMessage('Manage security preferences (simulated).'); logEvent('Viewed security preferences', 'info'); }}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Security</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="ghost" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
            <span className="ml-2 hidden md:inline">Cart</span>
          </Button>
        </div>
      </header>

      <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
        {!sessionActive && !isAuthenticated && (
          <p className="text-red-600 mb-4 font-semibold text-center bg-red-50 p-2 rounded-md border border-red-200">
            Session expired. Please log in again.
          </p>
        )}

        {isAuthenticated ? (
          // Authenticated E-commerce Dashboard View
          <div className="space-y-8">
            <Card className="rounded-xl shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">Explore Tunga Gas Products</CardTitle>
                <CardDescription className="text-gray-600">Find the perfect gas solutions for your home and business.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-contain p-4 bg-gray-50" />
                      <CardContent className="p-4 flex-grow flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-gray-600 text-sm flex-grow line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xl font-bold text-green-700">${product.price.toFixed(2)}</span>
                          <Button onClick={() => handleAddToCart(product)} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {filteredProducts.length === 0 && (
                      <p className="col-span-full text-center text-gray-600 py-10">No products found for "{searchTerm}".</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800">Security & Account Activity</CardTitle>
                <CardDescription className="text-gray-600">Review your recent security logs for suspicious activity.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-3 mb-4">
                  <Button
                    variant={filter === '' ? 'default' : 'outline'}
                    onClick={() => setFilter('')}
                    className="rounded-full px-4 py-2 text-sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === 'info' ? 'default' : 'outline'}
                    onClick={() => setFilter('info')}
                    className="rounded-full px-4 py-2 text-sm"
                  >
                    Info
                  </Button>
                  <Button
                    variant={filter === 'warning' ? 'default' : 'outline'}
                    onClick={() => setFilter('warning')}
                    className="rounded-full px-4 py-2 text-sm"
                  >
                    Warning
                  </Button>
                  <Button
                    variant={filter === 'critical' ? 'default' : 'outline'}
                    onClick={() => setFilter('critical')}
                    className="rounded-full px-4 py-2 text-sm"
                  >
                    Critical
                  </Button>
                </div>
                <SecurityLogsTable logs={logs} filter={filter} />
              </CardContent>
            </Card>
          </div>
        ) : (
          // Login/Registration Forms OR OTP Input (Authentication Gateway)
          <Card className="rounded-xl shadow-lg border-t-4 border-blue-500 max-w-lg mx-auto bg-white">
            <CardHeader className="text-center p-6">
              <CardTitle className="text-2xl font-extrabold text-gray-900">
                {isRegistering ? "Create Your Account" : (showOtpInput ? "Verify Your Login" : "Sign In to TungaGas")}
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                {isRegistering ? "Access exclusive products and services." : "Experience secure and seamless shopping."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-6">
                {!showOtpInput && (
                  <div className="flex justify-center mb-4">
                    <Button
                      variant={!isRegistering ? 'default' : 'outline'}
                      onClick={() => { setIsRegistering(false); handleResetForm(); }}
                      className="rounded-r-none px-6 py-2"
                    >
                      Login
                    </Button>
                    <Button
                      variant={isRegistering ? 'default' : 'outline'}
                      onClick={() => { setIsRegistering(true); handleResetForm(); }}
                      className="rounded-l-none px-6 py-2"
                    >
                      Register
                    </Button>
                  </div>
                )}

                {isRegistering ? (
                  // Registration Form
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled={!sessionActive}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="text-sm font-medium text-gray-700">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled={!sessionActive}
                      />
                      {password && (
                        <p className={`text-xs mt-1 ${passwordStrength.textColor}`}>
                          Strength: {passwordStrength.strengthText}
                          {passwordStrength.feedback.length > 0 && (
                            <span className="ml-2">({passwordStrength.feedback.join(', ')})</span>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled={!sessionActive}
                      />
                    </div>
                    {loginError && <p className="text-red-600 text-center text-sm font-medium">{loginError}</p>}
                    <Button onClick={handleRegister} disabled={!sessionActive}
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200">
                      Create Account
                    </Button>
                  </div>
                ) : (
                  // Login Form or OTP Input
                  showOtpInput ? (
                    // OTP Input Form
                    <div className="grid gap-4">
                      <p className="text-center text-gray-700">
                        An OTP has been sent to <span className="font-semibold">{email}</span>. Please enter it below.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-medium text-gray-700">One-Time Password (OTP)</Label>
                        <Input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(sanitizeInput(e.target.value))}
                          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-center text-lg tracking-widest"
                          maxLength="6"
                          disabled={lockedOut || !sessionActive}
                        />
                      </div>
                      <div className="text-center text-sm text-gray-500">
                        OTP expires in: {Math.floor(otpTimer / 60).toString().padStart(2, '0')}:{(otpTimer % 60).toString().padStart(2, '0')}
                      </div>
                      {loginError && <p className="text-red-600 text-center text-sm font-medium">{loginError}</p>}
                      <Button onClick={handleOtpVerification} disabled={lockedOut || !sessionActive || otp.length !== 6 || otpTimer === 0}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200">
                        Verify OTP
                      </Button>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <Button variant="link" onClick={handleResendOtp} className="px-0 text-blue-600 hover:underline" disabled={!sessionActive || resendAttempts >= maxResendAttempts}>
                          Resend OTP ({maxResendAttempts - resendAttempts} left)
                        </Button>
                        <Button variant="link" onClick={handleResetForm} className="px-0 text-gray-600 hover:underline" disabled={!sessionActive}>
                          Back to Login
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Initial Login Form
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={lockedOut || !sessionActive}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={lockedOut || !sessionActive}
                        />
                      </div>
                      {loginError && <p className="text-red-600 text-center text-sm font-medium">{loginError}</p>}
                      <Button onClick={handleLogin} disabled={lockedOut || !sessionActive}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200">
                        Login Securely
                      </Button>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <Button variant="link" onClick={handleForgotPassword} className="px-0 text-blue-600 hover:underline">
                          Forgot Password?
                        </Button>
                        <Button variant="ghost" onClick={handleResetForm} disabled={lockedOut && sessionActive} className="px-0 text-gray-600 hover:text-gray-900">
                          Reset Form
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Shopping Cart Sheet (Side Panel) */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart /> Your Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
            </SheetTitle>
            <SheetDescription>
              Review your selected items before proceeding to checkout.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-grow my-4 pr-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-600 mt-10">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-contain rounded-md border" />
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} | Price: ${item.price.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleRemoveFromCart(item.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          {cartItems.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total:</span>
                <span>${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full bg-green-600 hover:bg-green-700">
                Proceed to Checkout (Simulated)
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <InfoModal message={infoModalMessage} onClose={() => setInfoModalMessage('')} title={infoModalTitle} />
    </div>
  );
}