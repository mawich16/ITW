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

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}

function showLoading() {
    $("#myModal").modal('show', {
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
    console.log("sPageURL=", sPageURL);
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

//--- start ....
showLoading();
var pg = getUrlParameter('page');
console.log(pg);
if (pg == undefined)
    self.activate(1);
else {
    self.activate(pg);
}
console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
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

//--- Page Events
self.activate = function (id) {
    console.log('CALL: getSeasonType...');
    var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
    ajaxHelper(composedUri, 'GET').done(function (data) {
        console.log(data);
        hideLoading();
        self.records(data.Records);
        self.currentPage(data.CurrentPage);
        self.hasNext(data.HasNext);
        self.hasPrevious(data.HasPrevious);
        self.pagesize(data.PageSize)
        self.totalPages(data.TotalPages);
        self.totalRecords(data.TotalRecords);
        self.SetFavourites();
    });
};

function showLoading() {
    $("#myModal").modal('show', {
        keyboard: false
    });
}
function hideLoading() {
    $('#myModal').on('shown.bs.modal', function (e) {
        $("#myModal").modal('hide');
    });
}

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}



$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})



function removeFav(Id) {
    console.log("remove fav")
    $("#fav-" + Id).remove();

    let fav = JSON.parse(localStorage.fav || '[]');

    const index = fav.indexOf(Id);

    if (index != -1)
        fav.splice(index, 1);

    localStorage.setItem("fav", JSON.stringify(fav));
}


$(document).ready(function () {
    showLoading();

    let fav = JSON.parse(localStorage.fav || '[]');

    console.log(fav);


    for (const Id of fav) {
        console.log(Id);

        ajaxHelper('http://192.168.160.58/NBA/API/SeasonTypes' + Id, 'GET').done(function (data) {
            console.log(data)
            if (localStorage.fav.length != 0) {
                $("#table-favourites").show();
                $('#noadd').hide();
                $('#nofav').hide();
                $("#table-favourites").append(
                    `<tr id="fav-${Id}">
                        <th scope="col">${ID}</th>
                        <th scope="col">${SeasonType}</th>
                        <th scope="col"></th>
                        <th scope="col">${data.Number of Players} </th>
                        <th scope="col"></th>
                        <th scope="col" class="text-right"></th>
                            <a class="btn btn-default btn-sm btn-favourite" onclick="removeFav(${Id})"><i class="fa fa-heart text-danger" title="Remove from favorites"></i></a>
                        </td>
                    </tr>`
                )

            }
        });
        sleep(50);
    }

    hideLoading();
})