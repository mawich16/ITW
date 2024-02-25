$(document).ready(function () {
    $('#FichaInscricao').submit(function (event) {
        var retval = true;
        /* Nome */
        if ($('#Nome').val().trim().length < 10 || $('#Nome').val().trim().length > 100) {
            $('#NomeError').removeClass('d-none');
            retval = false;
        }
        else {
            $('#NomeError').addClass('d-none');
        }
        /* Morada */
        if ($('textarea#Morada').val().trim().length < 10 || $('textarea#Morada').val().trim().length > 100) {
            $('#MoradaError').removeClass('d-none');
            retval = false;
        }
        else {
            $('#MoradaError').addClass('d-none');
        }
        /* Email */
        if ($("#Email").val().trim().length < 10 || $("#Email").val().trim().length > 100 || $('#Email').val().trim().indexOf('@') > $('#Email').val().trim().indexOf('.')) {
            $("#EmailError").removeClass('d-none');
            retval = false;
        }
        else {
            $("#EmailError").addClass('d-none');
        }
        /* Checkbox */
        if ($('input[name="local"]:checked').length < 1) {
            $("#checkboxError").removeClass('d-none');
            retval = false;
        }
        else {
            $("#checkboxError").addClass('d-none');
        }
        return retval
    })

    var lst = []
    $('input[name="local"]').change(function () {
        lst.push($('input[name="local"]:checked').val())
        console.log(lst)

        var max = lst[0]
        for (var i = 0; i < lst.length; i++) {
            if (lst[i] > max) {
                max = lst[i];
            }
        }

        document.getElementById("preco").value = max
    })

    $('clean').click(function () {
        $('#NomeError').addClass('d-none');
        $('#MoradaError').addClass('d-none');
        $("#EmailError").addClass('d-none');
    })
})