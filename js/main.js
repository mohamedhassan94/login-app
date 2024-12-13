var loginForm = document.getElementById("loginForm");
var signupForm = document.getElementById("signupForm");

var signupButton = document.getElementById("signupButton");
var loginButton = document.getElementById("loginButton");
var signoutButton = document.getElementById("signoutButton");

var welcomeMessage = document.getElementById("welcomeMessage");

var loginErrors = {};
var signupErrors = {};

var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(fieldName, value) {
  var trimmedValue = value.trim();

  switch (fieldName) {
    case "user_email":
      if (!trimmedValue) {
        return "Email is required";
      } else if (!emailRegex.test(trimmedValue)) {
        return "Please enter a valid email address";
      }
      return null;

    case "user_password":
      if (!trimmedValue) {
        return "Password is required";
      } else if (trimmedValue.length < 6) {
        return "Password must be at least 6 characters long";
      }
      return null;

    case "name":
      if (!trimmedValue) {
        return "Name is required";
      } else if (trimmedValue.length < 2 || trimmedValue.length > 50) {
        return "Name must be at least 2 characters and 50 characters at most";
      }
      return null;

    default:
      return null;
  }
}

function getUsers() {
  var users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function handleBlur(event, formType, errors, button) {
  var input = event.target;
  var inputName = input.name;
  var inputValue = input.value;

  var errorMessage = validateField(inputName, inputValue);

  if (!errorMessage) {
    if (errors[inputName]) {
      delete errors[inputName];
    }
    displayError(input, "");
  } else {
    errors[inputName] = errorMessage;
    displayError(input, errorMessage);
  }

  var form = formType === "login" ? loginForm : signupForm;
  var inputs = form.querySelectorAll(".form-control");

  toggleButtonState(errors, button, inputs);
}

function displayError(input, errorMessage) {
  var errorSpan = input.nextElementSibling;
  if (errorMessage) {
    errorSpan.textContent = errorMessage;
  } else {
    errorSpan.textContent = "";
  }
}

function toggleButtonState(errors, button, inputs) {
  var hasErrors = Object.keys(errors).length > 0;
  var allFilled = Array.from(inputs).every((input) => input.value.trim() !== "");

  if (hasErrors || !allFilled) {
    button.disabled = true;
  } else {
    button.disabled = false;
  }
}

function handleSignup(inputs, form, errors, button) {
  var name = form.elements["name"].value.trim();
  var email = form.elements["user_email"].value.trim();
  var password = form.elements["user_password"].value.trim();

  var users = getUsers();

  var existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    alert("This email is already registered. Please use a different email.");
    return;
  }

  var newUser = {
    name,
    email,
    password,
    isLogin: false,
  };

  users.push(newUser);
  saveUsers(users);

  console.log("Sign Up Form Data:", newUser);
  alert("Sign Up successful!");

  form.reset();
  Object.keys(errors).forEach((key) => delete errors[key]);
  var errorSpans = form.querySelectorAll(".text-danger");
  errorSpans.forEach((span) => (span.textContent = ""));
  button.disabled = true;
  window.location.href = "/login-app/";
}

function handleSignupSubmit(event, errors, button) {
  event.preventDefault();

  var form = signupForm;
  var inputs = form.querySelectorAll(".form-control");

  var hasErrors = Object.keys(errors).length > 0;

  var allFilled = Array.from(inputs).every((input) => input.value.trim() !== "");

  toggleButtonState(errors, button, inputs);

  if (!hasErrors && allFilled) {
    handleSignup(inputs, form, errors, button);
  } else {
    alert("Please fix the errors in the form before submitting.");
  }
}

function handleLogin(inputs, form, errors, button) {
  var email = form.elements["user_email"].value.trim();
  var password = form.elements["user_password"].value.trim();

  var users = getUsers();

  var userIndex = users.findIndex(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );

  if (userIndex === -1) {
    alert("Invalid email or password. Please try again.");
    return;
  }

  users.forEach((user, index) => {
    user.isLogin = index === userIndex;
  });

  saveUsers(users);

  console.log("Login Form Data:", users[userIndex]);
  alert("Login successful!");

  form.reset();
  Object.keys(errors).forEach((key) => delete errors[key]);
  var errorSpans = form.querySelectorAll(".text-danger");
  errorSpans.forEach((span) => (span.textContent = ""));
  button.disabled = true;

  window.location.href = "/login-app/home.html";
}

function handleLoginSubmit(event, errors, button) {
  event.preventDefault();

  var form = loginForm;
  var inputs = form.querySelectorAll(".form-control");

  var hasErrors = Object.keys(errors).length > 0;

  var allFilled = Array.from(inputs).every((input) => input.value.trim() !== "");

  toggleButtonState(errors, button, inputs);

  if (!hasErrors && allFilled) {
    handleLogin(inputs, form, errors, button);
  } else {
    alert("Please fix the errors in the form before submitting.");
  }
}

function initializeForm(form, formType, errors, button) {
  if (!form) return;

  button.disabled = true;

  var formInputs = form.querySelectorAll(".form-control");

  formInputs.forEach((input) => {
    input.addEventListener("blur", (event) => handleBlur(event, formType, errors, button));
  });

  if (formType === "signup") {
    form.addEventListener("submit", (event) => handleSignupSubmit(event, errors, button));
  } else if (formType === "login") {
    form.addEventListener("submit", (event) => handleLoginSubmit(event, errors, button));
  }
}

initializeForm(loginForm, "login", loginErrors, loginButton);
initializeForm(signupForm, "signup", signupErrors, signupButton);
