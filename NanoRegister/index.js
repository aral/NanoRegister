var NANO = 1000000000000000000000000000000;
var username = "";
var address = "nano_1z9wqmxdum6164f3pfr43ub3frfif9yipixthjikrds3g86pqen3jes6pgca"; //TODO: Add to HTML as an input
var amount = 0;
var nanoUSD = 0;
var link;

function getPrice() {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=usd')
    .then(response => response.json())
    .then(data => {
        nanoUSD = data.nano.usd;
        amount = parseFloat(sessionStorage.getItem("amount"));
        console.log("Amount: " + amount);
        document.getElementById("nanoUSD-output").innerHTML = "$" + amount.toFixed(2);
        console.log("Nano USD: " + nanoUSD);
        sessionStorage.setItem("nanoUSD", nanoUSD);
    });
}


window.onload = function() {
    //document.getElementById('natricon').src = 'https://natricon.com/api/v1/nano?address=' + sessionStorage.getItem("address");
    document.getElementById('name-output').innerHTML = "Pay " + sessionStorage.getItem("username");
    document.getElementById('address-output').innerHTML = sessionStorage.getItem("address");
    getPrice();
    console.log("Ratio: " + sessionStorage.getItem("amount")/sessionStorage.getItem("nanoUSD"))
    link = "nano://" + sessionStorage.getItem("address") + "?amount=" + ((parseFloat(sessionStorage.getItem("amount"))/sessionStorage.getItem("nanoUSD"))*NANO).toLocaleString('fullwide', { useGrouping: false });
    
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: link,
        width: 268,
        height: 268,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    console.log(link);
}

function submit() {
    sessionStorage.setItem("username", document.getElementById('name-input').value);
    sessionStorage.setItem("address", document.getElementById('address-input').value);
    sessionStorage.setItem("amount", document.getElementById('amount-input').value);
    document.getElementById('amount-input').value = "";
    window.location.href = "./card.html";
}

function openWallet() {
    window.open(link, '_self');
}