var op1 = document.getElementById("op1")
var op2 = document.getElementById("op2")
var res = document.getElementById("res")
var operacao = ""

function getOperation() {
    var e = document.getElementById("operacao");
    operacao = e.options[e.selectedIndex].value;
    console.log(operacao);
    if (operacao == "!") {
        op2.classList.add("d-none");
    }
    else { 
        op2.classList.remove("d-none");
    }
 }
function calcula() {
    switch (operacao) {
        case "+":
            res.value = parseFloat(op1.value) + parseFloat(op2.value);
            break;
        case "-":
            res.value = parseFloat(op1.value) - parseFloat(op2.value);
            break;
        case "*":
            res.value = parseFloat(op1.value) * parseFloat(op2.value);
            break;
        case ":":
            res.value = parseFloat(op1.value) / parseFloat(op2.value);
            break;
        case "%":
            res.value = parseFloat(op1.value) % parseFloat(op2.value);
            break;

        default:
            alert("Erro: operação não definida...");
    }
}