// Auth Mode State
let isLogin = true;

// Elements
const toggleBtn = document.getElementById("toggleBtn");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const nameField = document.getElementById("nameField");
const toggleText = document.getElementById("toggleText");

const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePassword");

const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const fullnameInput = document.getElementById("fullname");
const errorMsg = document.getElementById("errorMsg");

// ----------------------
// Update UI
// ----------------------
function updateFormUI() {
    formTitle.textContent = isLogin ? "Login" : "Sign Up";
    submitBtn.textContent = isLogin ? "Login" : "Create Account";

    toggleText.textContent = isLogin
        ? "Don't have an account?"
        : "Already have an account?";

    toggleBtn.textContent = isLogin ? "Sign Up" : "Login";

    nameField.classList.toggle("hidden", isLogin);

    errorMsg.textContent = "";
    authForm.reset();
}

toggleBtn.addEventListener("click", () => {
    isLogin = !isLogin;
    updateFormUI();
});

// ----------------------
// Show / Hide Password
// ----------------------
togglePasswordBtn.addEventListener("click", () => {
    const isPasswordHidden = passwordInput.type === "password";

    passwordInput.type = isPasswordHidden ? "text" : "password";
    togglePasswordBtn.textContent = isPasswordHidden ? "Hide" : "Show";
});

// ----------------------
// Form Submit Logic
// ----------------------
authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const fullname = fullnameInput.value.trim();

    if (!email || !password) {
        errorMsg.textContent = "Please fill all required fields.";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
        // LOGIN LOGIC
        const existingUser = users.find(
            (user) => user.email === email && user.password === password
        );

        if (existingUser) {
            errorMsg.style.color = "green";
            errorMsg.textContent = "Login successful!";

            localStorage.setItem("currentUser", JSON.stringify(existingUser));

            // Optional: redirect simulation
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

        } else {
            errorMsg.style.color = "red";
            errorMsg.textContent = "Invalid email or password.";
        }

    } else {
        // SIGNUP LOGIC
        if (!fullname) {
            errorMsg.textContent = "Please enter your full name.";
            return;
        }

        const userExists = users.some((user) => user.email === email);

        if (userExists) {
            errorMsg.textContent = "User already exists. Please login.";
            return;
        }

        const newUser = {
            fullname,
            email,
            password
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));


        errorMsg.style.color = "green";
        errorMsg.textContent = "Account created successfully! Please login.";

        isLogin = true;
        updateFormUI();
    }
});
function refresh() {
    window.location.reload();
}
