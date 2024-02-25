var op1 = "";
var op2 = "";
var operation = "";
var res = document.getElementById("res");


function addNumber() {
    tecla = event.target.value;
    if (operation == "") {
        op1 += tecla
    }
    else {
        op2 += tecla
    }
    res.innerText = op1 + operacao + op2;
}

function addOperation() {
    tecla = event.target.value;
    operacao = tecla;
    res.innerText = op1 + operacao + op2;
}

function clearResult() {
    op1 = "";
    op2 = "";
    operacao = "";
    res.innerText = "0";
}

function calcula() {
    switch (operacao) {
        case "+":
            res.innerText = op1.value + op2.value;
            break;
        case "-":
            res.innerText = op1.value - op2.value;
            break;
        case "*":
            res.innerText = op1.value * op2.value;
            break;
        case "/":
            if (op2 != 0) {
                res.innerText = op1.value / op2.value;
            }
            else { alert("erro:operação inválida") }
            break;
    }
    op1 = res.innerText;
    op2 = "";
    operacao = "";
}