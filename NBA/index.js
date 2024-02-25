if (localStorage.getItem('loggedIn')) {
    showLogout();
} else {
    showLogin();
}


function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('enteredUsername');
    showLogin();
    window.location.href = 'login.html';
}

// Função para exibir o contêiner de login
function showLogin() {
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('logoutContainer').style.display = 'none';
}

// Função para exibir o contêiner de logout
function showLogout() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('logoutContainer').style.display = 'block';
    document.getElementById('enteredUsername').innerText = localStorage.getItem('username', enteredUsername);
}

function toggleDarkMode() {
    const body = document.body;
    const darkModeIcon = document.getElementById('darkModeIcon');
    const darkModeText = document.getElementById('darkModeText');
    const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));

    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeIcon.classList.remove('fa-moon-o');
        darkModeIcon.classList.add('fa-sun-o');
        darkModeText.textContent = ' Light Mode';
    } else {
        body.classList.remove('dark-mode');
        darkModeIcon.classList.remove('fa-sun-o');
        darkModeIcon.classList.add('fa-moon-o');
        darkModeText.textContent = ' Dark Mode';
    }
}


function saveDarkModeState(isDarkMode) {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
}


const toggleDarkModeButton = document.getElementById('toggleDarkMode');
if (toggleDarkModeButton) {
    toggleDarkModeButton.addEventListener('click', function () {
        const body = document.body;
        const isDarkMode = body.classList.contains('dark-mode');
        body.classList.toggle('dark-mode');
        saveDarkModeState(!isDarkMode);
        toggleDarkMode();
    });
}


window.addEventListener('DOMContentLoaded', toggleDarkMode);