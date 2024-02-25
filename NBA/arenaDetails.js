﻿// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Arenas/');
    self.displayName = 'NBA Arena Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.StateId = ko.observable('');
    self.StateName = ko.observable('');
    self.TeamId = ko.observable('');
    self.TeamName = ko.observable('');
    self.TeamAcronym = ko.observable('');
    self.Location = ko.observable('');
    self.Capacity = ko.observable('');
    self.Opened = ko.observable('');
    self.Photo = ko.observable('');
    self.Lat = ko.observable('');
    self.Lon = ko.observable('');

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getArena...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.StateId(data.StateId);
            self.StateName(data.StateName);
            self.TeamId(data.TeamId);
            self.TeamName(data.TeamName);
            self.TeamAcronym(data.TeamAcronym);
            self.Location(data.Location);
            self.Capacity(data.Capacity);
            self.Opened(data.Opened);
            self.Photo(data.Photo);
            self.Lat(data.Lat);
            self.Lon(data.Lon);
            console.log("Lat:", data.Lat);
            console.log("Lon:", data.Lon);

            // Initialize Leaflet map with data
            var Latitude = data.Lat;
            var Longitude = data.Lon;

            var mymap = L.map('map').setView([Latitude, Longitude], 13);

            // Add a tile layer from OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mymap);

            // Add a marker to the map
            var marker = L.marker([Latitude, Longitude]).addTo(mymap);

            // Add a popup to the marker
            marker.bindPopup("<b>Location!</b><br>Latitude: " + Latitude + "<br>Longitude: " + Longitude).openPopup();
        });
    };


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
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};




$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});

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