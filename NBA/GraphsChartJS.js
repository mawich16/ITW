const composedUri = "http://192.168.160.58/NBA/API/Statistics/NumPlayersBySeason";

$('document').ready(function () {
    const ctx = document.getElementById('myChart');

    ajaxHelper(composedUri, 'GET').done(function (stats) {
        // Interact with the data returned
        var regularSeasonData = [];
        var playoffsData = [];

        $.each(stats, function (index, item) {
            if (item.SeasonType === "Regular Season") {
                regularSeasonData.push({ season: item.Season, players: item.Players });
            } else if (item.SeasonType === "Playoffs") {
                playoffsData.push({ season: item.Season, players: item.Players });
            }
        });
        var regularSeasonLabels = regularSeasonData.map(function (item) {
            return item.season;
        });

        var regularSeasonPlayers = regularSeasonData.map(function (item) {
            return item.players;
        });
        var playoffsLabels = playoffsData.map(function (item) {
            return item.season;
        });

        var playoffsPlayers = playoffsData.map(function (item) {
            return item.players;
        });
        // Instantiate and draw our chart, passing in some options.
        new Chart(ctx, {
            type: 'bar',
            title: 'olá',
            data: {
                labels: regularSeasonLabels,
                datasets: [
                    {
                        label: 'Regular Season Players',
                        data: regularSeasonPlayers,
                        borderWidth: 1,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                    },
                    {
                        label: 'Playoffs Players',
                        data: playoffsPlayers,
                        borderWidth: 1,
                        borderWidth: 1,
                        backgroundColor: 'rgba(255, 159, 64, 0.6)',
                        borderColor: 'rgba(255, 159, 64, 1)'
                    }
                ]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { align: 'start', font: { family: 'Open Sans' } },
                        title: {
                            display: true, text: ['Number of Players By Season and Season Type'], padding: { top: 10, bottom: 10 }, font: { size: 12, family: 'Open Sans' }
                        },
                    }
                },

                indexAxis: 'y',
                scales: {
                    x: {
                        ticks: {
                            font: { family: 'Open Sans', color: '#800' } ,
                        }
                    },
                    y: {
                        beginAtZero: true, 
                        ticks: {
                            font: { family: 'Open Sans', color: '#800', size: 8, width: 200 } ,
                        }
                    }
                }
            }
        });
    });
});

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


window.addEventListener('DOMContentLoaded', toggleDarkMode);