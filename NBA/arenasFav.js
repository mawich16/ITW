
// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Arenas');
    self.displayName = 'NBA Arenas List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.searchQuery = ko.observable('');

    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };


    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getArenas...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            $('#myModal').on('shown.bs.modal', function (e) {
                $("#myModal").modal('hide');
            });
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
                $('#myModal').on('shown.bs.modal', function (e) {
                    $("#myModal").modal('hide');
                });

            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }


    function removeFav(Id) {
        console.log("remove fav")
        $("#fav-" + Id).remove();

        let fav = JSON.parse(localStorage.fav || '[]');

        const index = fav.indexOf(Id);

        if (index != -1)
            fav.splice(index, 1);

        localStorage.setItem("fav", JSON.stringify(fav));
    }

    function getFavorites() {
        let fav = localStorage.getItem('fav');
        return fav ? JSON.parse(fav) : [];
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
    $(document).ready(function () {
        $("#myModal").modal('show', {
            keyboard: false
        });
        var pg = getUrlParameter('page');
        console.log(pg);
        if (pg == undefined)
            self.activate(1);
        else {
            self.activate(pg);
        }
        console.log("VM initialized!");
    });
}



$(document).ready(function () {
    console.log("ready!");
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});






$(document).ready(function () {
    $("#myModal").modal('show', {
        keyboard: false
    });

    let fav = JSON.parse(localStorage.fav || '[]');

    console.log(fav);

    Promise.all(fav.map(Id => {
        console.log("Before AJAX call for arenaId:", Id);

        return ajaxHelper('http://192.168.160.58/NBA/API/Arenas/' + Id, 'GET')
            .done(function (data) {
                console.log("Arena details for arenaId:", Id, data);

                $("#table-favourites").empty();

                for (let i = 0; i < dataArray.length; i++) {
                    const data = dataArray[i];
                    const Id = fav[i];

                    if (localStorage.fav.length !== 0) {
                        $("#table-favourites").show();
                        $('#noadd').hide();
                        $('#nofav').hide();
                        $("#table-favourites").append(
                            `<tr id="fav-${Id}">
                        <th scope="col">${Id}</th>
                        <th scope="col">${data.Name}</th>
                        <th scope="col">${data.State}</th>
                        <th scope="col">${data.Team}</th>
                        <th scope="col">${data.Location}</th>
                        <th scope="col" class="text-right"></th>
                            <a class="btn btn-default btn-sm btn-favourite" onclick="removeFav(${Id})"><i class="fa fa-heart text-danger" title="Remove from favorites"></i></a>
                        </td>
                    </tr>`
                        );
                    }
                }
            })
            .catch(error => {
                console.error("Error loading arena details:", error);
            })
            .finally(() => {
                $('#myModal').on('shown.bs.modal', function (e) {
                    $("#myModal").modal('hide');
                });

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

        window.addEventListener('DOMContentLoaded', toggleDarkMode)
    }))