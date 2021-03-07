var Mnano = 1000000000000000000000000000000;
var merchantName = "";
var merchantAddress = "";
var amount = 0.0;
var paymentAddress = "";
var paymentID = "";
var link = "";

function getPrice() {
    var currency = sessionStorage.getItem("currency");
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=' + currency)
    .then(response => response.json())
    .then(data => {
        currency = currency.toLowerCase();
        console.log("Nano in Fiat: " + data.nano[currency]);
        amount = sessionStorage.getItem("amount");
        amount = (amount/data.nano[currency])*Mnano;
        console.log("Raw Amount: " + amount);
        //TODO: Change this to allow for multiple currency symbols
        document.getElementById("amount-output").innerHTML = "$" + sessionStorage.getItem("amount");
    });
}

function createPayment()  {

    sessionStorage.setItem("merchantName", document.getElementById('merchant-name-input').value);
    sessionStorage.setItem("merchantAddress", document.getElementById('merchant-address-input').value);
    sessionStorage.setItem("amount", document.getElementById('amount-input').value);
    sessionStorage.setItem("currency", document.getElementById("local-currency-select").value);
    if (sessionStorage.getItem("merchantName") != "" && sessionStorage.getItem("merchantAddress") != "" && sessionStorage.getItem("amount") != "") {
        document.getElementById("modal").style.display = "block";
        getPrice();
        console.log("Merchant Address: " + sessionStorage.getItem("merchantAddress"))
        console.log("Fiat Amount: " + sessionStorage.getItem("amount"))
        fetch("https://gonano.dev/payment/new", {
        "referrer": "https://gonano.dev/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"account\":\"" + sessionStorage.getItem("merchantAddress") + "\",\"amount\":\""+ sessionStorage.getItem("amount") + "\"}",
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
        })
        .then(response => response.json())
        .then(data => {
            paymentAddress = data.account;
            console.log("Payment Address: " + paymentAddress);
            paymentID = data.id;
            console.log("Payment ID: " + paymentID);

            //This function is not working :(
            wait();

            sessionStorage.setItem("link", "nano://" + paymentAddress + "?amount=" + amount.toLocaleString('fullwide', { useGrouping: false }));
            console.log(sessionStorage.getItem("link"));
            document.getElementById('amount-input').value = "";
            document.getElementById("qrcode").innerHTML = ""; 
            document.getElementById('name-output').innerHTML = "Pay " + sessionStorage.getItem("merchantName");
            document.getElementById('address-output').innerHTML = sessionStorage.getItem("merchantAddress");
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: sessionStorage.getItem("link"),
                width: 268,
                height: 268,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        });

    } else {
        alert("Please enter all fields")
    }

};

//cancel the payment on modal close
function cancelPayment() {
    document.getElementById("modal").style.display = "none";

    fetch("https://gonano.dev/payment/cancel", {
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"id\":\"" + paymentID + "\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

function wait() {
    fetch("https://gonano.dev/payment/wait", {
    "credentials": "omit",
    "origin" : "https://gonano.dev/",
    "referrer": "https://gonano.dev/",
    "body": "{\"id\":\"" + paymentID + "\"}",
    "method": "POST",
    "mode": "cors"
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        waitResponse = data.block_hash; //TODO: Change name of this variable
        console.log(waitResponse); //temp 
        if (waitResponse != "") {
            console.log("Payment Successful!")
        }
    });
}

//For Donation Link
function openWallet() {
    window.open(link, '_self');
}