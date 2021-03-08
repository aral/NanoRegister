var Mnano = 1000000000000000000000000000000;
var merchantName = "";
var merchantAddress = "";
var amount = 0.0;
var rawAmount = 0.0;
var paymentAddress = "";
var paymentID = "";
var link = "";
const controller = new AbortController();
const signal = controller.signal;
var timer;

async function getPrice() {
    var currency = sessionStorage.getItem("currency");
    await fetch('https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=' + currency)
    .then(response => response.json())
    .then(data => {
        currency = currency.toLowerCase();
        console.log("Nano in Fiat: " + data.nano[currency]);

        currencySymbol = "";
        if (document.getElementById("local-currency-select").value == "USD") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "IDR") {currencySymbol = "Rp"};
        if (document.getElementById("local-currency-select").value == "TWD") {currencySymbol = "NT$"};
        if (document.getElementById("local-currency-select").value == "EUR") {currencySymbol = "€"};
        if (document.getElementById("local-currency-select").value == "KRW") {currencySymbol = "₩"};
        if (document.getElementById("local-currency-select").value == "JPY") {currencySymbol = "¥"};
        if (document.getElementById("local-currency-select").value == "RUB") {currencySymbol = "₽"};
        if (document.getElementById("local-currency-select").value == "CNY") {currencySymbol = "¥"};
        if (document.getElementById("local-currency-select").value == "AED") {currencySymbol = "د.إ"};
        if (document.getElementById("local-currency-select").value == "ARS") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "AUD") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "BDT") {currencySymbol = "৳"};
        if (document.getElementById("local-currency-select").value == "BHD") {currencySymbol = ".د.ب"};
        if (document.getElementById("local-currency-select").value == "BMD") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "BRL") {currencySymbol = "R$"};
        if (document.getElementById("local-currency-select").value == "CAD") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "CHF") {currencySymbol = "Fr."};
        if (document.getElementById("local-currency-select").value == "CLP") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "CZK") {currencySymbol = "Kč"};
        if (document.getElementById("local-currency-select").value == "DKK") {currencySymbol = "Kr."};
        if (document.getElementById("local-currency-select").value == "GBP") {currencySymbol = "£"};
        if (document.getElementById("local-currency-select").value == "HKD") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "HUF") {currencySymbol = "Ft"};
        if (document.getElementById("local-currency-select").value == "ILS") {currencySymbol = "₪"};
        if (document.getElementById("local-currency-select").value == "INR") {currencySymbol = "₹"};
        if (document.getElementById("local-currency-select").value == "KWD") {currencySymbol = "د.ك"};
        if (document.getElementById("local-currency-select").value == "LKR") {currencySymbol = "රු"};
        if (document.getElementById("local-currency-select").value == "MMK") {currencySymbol = "K"};
        if (document.getElementById("local-currency-select").value == "MXN") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "MYR") {currencySymbol = "RM"};
        if (document.getElementById("local-currency-select").value == "NGN") {currencySymbol = "₦"};
        if (document.getElementById("local-currency-select").value == "NOK") {currencySymbol = "kr"};
        if (document.getElementById("local-currency-select").value == "NZD") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "PHP") {currencySymbol = "₱"};
        if (document.getElementById("local-currency-select").value == "PKR") {currencySymbol = "₨"};
        if (document.getElementById("local-currency-select").value == "PLN") {currencySymbol = "zł"};
        if (document.getElementById("local-currency-select").value == "SAR") {currencySymbol = "ر.س"};
        if (document.getElementById("local-currency-select").value == "SEK") {currencySymbol = "kr"};
        if (document.getElementById("local-currency-select").value == "SGD") {currencySymbol = "$"};
        if (document.getElementById("local-currency-select").value == "THB") {currencySymbol = "฿"};
        if (document.getElementById("local-currency-select").value == "TRY") {currencySymbol = "₺"};
        if (document.getElementById("local-currency-select").value == "UAH") {currencySymbol = "₴"};
        if (document.getElementById("local-currency-select").value == "VEF") {currencySymbol = "Bs"};
        if (document.getElementById("local-currency-select").value == "VND") {currencySymbol = "₫"};
        if (document.getElementById("local-currency-select").value == "ZAR") {currencySymbol = "R"};
        if (document.getElementById("local-currency-select").value == "XDR") {currencySymbol = "XDR"};

        console.log("Fiat Amount: " + sessionStorage.getItem("amount"));
        document.getElementById("amount-output").innerHTML = currencySymbol + sessionStorage.getItem("amount");
        amount = sessionStorage.getItem("amount")/data.nano[currency];
        console.log("NANO amount:" + amount);
        sessionStorage.setItem("amount", amount);
        rawAmount = (amount)*Mnano;
        console.log("Raw Amount: " + rawAmount);
    });
}

async function createPayment()  {
    duration = 180;
    timer = setInterval(function () {
        if (duration < 0) {
            clearInterval(timer);
            console.log("Transaction Has Expired")
            document.getElementById("countdown").style.display = "none";
            document.getElementById("payment-unsuccessful-output").style.display = "block";
            document.getElementById("payment-unsuccessful-progress-bar-div").style.display = "block";
            setTimeout(() => {
                document.getElementById("modal").style.display = "none";
                document.getElementById("payment-unsuccessful-output").style.display = "none";
                document.getElementById("payment-unsuccessful-progress-bar-div").style.display = "none";
                cancelPayment();
            }, 5000);
        }
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
        if (seconds < 10) {seconds = "0" + seconds};
        document.getElementById("countdown").innerHTML = minutes + ":" + seconds;
        duration--;
    }, 1000);

    sessionStorage.setItem("merchantName", document.getElementById('merchant-name-input').value);
    sessionStorage.setItem("merchantAddress", document.getElementById('merchant-address-input').value);
    sessionStorage.setItem("amount", document.getElementById('amount-input').value);
    sessionStorage.setItem("currency", document.getElementById("local-currency-select").value);
    if (sessionStorage.getItem("merchantName") != "" && sessionStorage.getItem("merchantAddress") != "" && sessionStorage.getItem("amount") != "") {
        document.getElementById("modal").style.display = "block";
        await getPrice();
        console.log("Merchant Address: " + sessionStorage.getItem("merchantAddress"))
        await fetch("https://gonano.dev/payment/new", {
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
            wait();
            sessionStorage.setItem("link", "nano://" + paymentAddress + "?amount=" + rawAmount.toLocaleString('fullwide', { useGrouping: false }));
            console.log(sessionStorage.getItem("link"));
            document.getElementById('amount-input').value = "";
            document.getElementById("qrcode").innerHTML = ""; 
            document.getElementById('name-output').innerHTML = "Pay " + sessionStorage.getItem("merchantName");
            document.getElementById('address-output-beginning').innerHTML = paymentAddress.substring(0, 10);
            document.getElementById('address-output-middle').innerHTML = paymentAddress.substring(10, paymentAddress.length-5);
            document.getElementById('address-output-end').innerHTML = paymentAddress.substring(paymentAddress.length-5, paymentAddress.length);
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
        alert("Please enter all fields");
    }

};

function cancelPayment() {
    clearInterval(timer);
    document.getElementById("modal").style.display = "none";
    controller.abort();
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

async function wait() {
    console.log("Waiting for Payment Confirmation");
    await fetch("https://gonano.dev/payment/wait", {
    "credentials": "omit",
    "signal" : signal,
    "body": "{\"id\":\"" + paymentID + "\"}",
    "method": "POST",
    "mode": "cors"
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        blockhash = data.block_hash;
        console.log("Block Hash: " + blockhash);
        if (blockhash != "") {
            console.log("Payment Successful!")
            clearInterval(timer);
            document.getElementById("countdown").style.display = "none";
            document.getElementById("payment-successful-output").style.display = "block";
            document.getElementById("payment-close-progress-bar-div").style.display = "block";
            
            setTimeout(() => {
                document.getElementById("modal").style.display = "none";
                document.getElementById("payment-successful-output").style.display = "none";
                document.getElementById("payment-close-progress-bar-div").style.display = "none";
            }, 5000);
        }
    });
}

//For Donation Link
function openWallet() {
    window.open(link, '_self');
}