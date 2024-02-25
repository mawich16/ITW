// Function to create modals for each season's players
async function displaySeasonModals() {
    const url = 'http://192.168.160.58/NBA/API/Statistics/Top5RankedPlayerByPlayoffSeason';
    try {
        const response = await fetch(url);
        const data = await response.json();

        const playerCardsContainer = document.getElementById('playerCards');
        let rowDiv;

        data.forEach((season, index) => {
            if (index % 3 === 0) {
                rowDiv = document.createElement('div');
                rowDiv.classList.add('row', 'mb-3');
                playerCardsContainer.appendChild(rowDiv);
            }

            const colDiv = document.createElement('div');
            colDiv.classList.add('col-md-4');

            const card = document.createElement('div');
            card.classList.add('card', 'mb-3');
            card.style.width = '18rem';

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const cardTitle = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.textContent = season.Season;

            cardBody.appendChild(cardTitle);
            card.appendChild(cardBody);
            colDiv.appendChild(card);
            rowDiv.appendChild(colDiv);

            card.addEventListener('click', () => {
                // Show the modal corresponding to the season
                const modal = new bootstrap.Modal(document.getElementById('seasonModal'));
                const modalTitle = document.getElementById('seasonModalLabel');
                modalTitle.textContent = season.Season;

                const modalPlayerList = document.getElementById('modalPlayerList');
                modalPlayerList.innerHTML = ''; // Clear previous data

                season.Players.forEach((player) => {
                    const playerItem = document.createElement('li');
                    playerItem.classList.add('list-group-item');
                    playerItem.textContent = `${player.Rank}. ${player.PlayerName}`;
                    modalPlayerList.appendChild(playerItem);
                });

                modal.show();
            });
        });
    } catch (error) {
        console.error('Error fetching player data:', error);
    }
}

//--- Internal functions

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

document.getElementById('logoutBtn').addEventListener('click', function () {
    logout();
});

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


function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
        }
    });
};

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


window.addEventListener('DOMContentLoaded', function () {
    toggleDarkMode();
    displaySeasonModals(); 
});