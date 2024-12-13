var welcomeMessage = document.getElementById("welcomeMessage");
var signoutButton = document.getElementById("signoutButton");

function getUsers() {
  var users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getLoggedInUser() {
  var users = getUsers();
  return users.find((user) => user.isLogin) || null;
}

function displayWelcomeMessage() {
  var user = getLoggedInUser();
  if (user) {
    welcomeMessage.textContent = `Welcome, ${user.name}!`;
  } else {
    alert("You are not logged in. Redirecting to login page.");
    window.location.href = "/login-app/";
  }
}

function handleSignOut(e) {
  e.preventDefault();
  var users = getUsers();
  var userIndex = users.findIndex((user) => user.isLogin);

  if (userIndex !== -1) {
    users[userIndex].isLogin = false;
    saveUsers(users);
    alert("You have been signed out successfully.");
    window.location.href = "/login-app/";
  } else {
    alert("No user is currently logged in.");
    window.location.href = "/login-app/";
  }
}

displayWelcomeMessage();

signoutButton.addEventListener("click", (e) => handleSignOut(e));
