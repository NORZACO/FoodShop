const fridgeStorage = new Map();
const fridgeHistory = [];

const products = [
    {name: "Tomato", price: 0.30},
    {name: "Potato", price: 0.80},
    {name: "Onion", price: 0.40},
    {name: "Carrot", price: 0.50},
    {name: "Celery", price: 1.00},
    {name: "Lettuce", price: 1.20},
    {name: "Spinach", price: 1.10},
    {name: "Cabbage", price: 1.60},
    {name: "Beetroot", price: 0.70},
    {name: "Turnip", price: 0.60},
    {name: "Parsnip", price: 0.90},
    {name: "Mushroom", price: 1.40}
];

$("document").ready(function () {

    let totalPrice = 0;

    for (let i = 0; i < products.length; i++) {
        fridgeStorage.set(products[i].name, 0);
        let name = products[i].name;
        let price = products[i].price;
        if (localStorage.getItem(name) === null) {
            localStorage.setItem(name, "0");
        }
        let amount = parseInt(fridgeStorage.get(name)) + parseInt(localStorage.getItem(name));
        updateStorage(name, amount);
        let total = price * amount;
        totalPrice += total;

        $("#products").append(`<option value="${name}">${name}</option>`);
        $("#tableStorage").append("<tr><td>" + name + "</td><td>" + amount + "</td>");
        }
        priceStorage();
        $("#totalPrice").append("<p id='price'>" + totalPrice.toFixed(2) + "$" + "</p>");

        let content = localStorage.getItem("fridgeHistory");
        content = JSON.parse(content);
        fridgeHistory.push(...content);

    for(let i = 0; i < fridgeHistory.length; i++) {
        $("#history tbody").prepend("<tr><td>" + content[i].type + "</td><td>" + content[i].name + "</td><td>" + content[i].item + "</td><td>" + content[i].amount + "</td><td>" + (content[i].price * content[i].amount).toFixed(2) + "$" + "</td><td>" + content[i].time + "</td></tr>");

    }

    $("#addItems").click(function () {
        let amount = $("#amount").val();
        let employee = "Dennis";
        let selectedOption = $("#products option:selected").val();
        if(amount < 0 || !employee || selectedOption === "0" || amount === "") {
            alert("Please fill out everything correctly: Positive amount and employee name");
        } else {
            addToStorage(employee, selectedOption, parseInt(amount));
        }
        priceStorage();
    });

    $("#removeItems").click(function () {
        let amount = $("#amount").val();
        let employee = "Dennis";
        let selectedOption = $("#products option:selected").val();

        if(amount < 0 || !employee || selectedOption === "0") {
            alert("Please fill out everything correctly: Positive amount and employee name");
        } else if (amount > parseInt(localStorage.getItem(selectedOption))) {
            alert("You can't remove more than you have");
        } else {
            removeFromStorage(employee, selectedOption, parseInt(amount));
        }
        priceStorage();
    });

});

function priceStorage() {
    let totalAmount = 0;

    for(let i = 0; i < products.length ; i++) {
        let name = products[i].name;
        let amount = parseInt(localStorage.getItem(name));
        let price = products[i].price;
        let total = amount * price;
        totalAmount += total;

    }
    $("#price").replaceWith("<p id='price'>" + totalAmount.toFixed(2) + "$" + "</p>");
}

function dateFinder () {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if(second < 10) {
        second = "0" + second;
    }
    if(minute < 10) {
        minute = "0" + minute;
    }
    if(hour < 10) {
        hour = "0" + hour;
    }
    if(day < 10) {
        day = "0" + day;
    }
    if(month < 10) {
        month = "0" + month;
    }

    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second
}

function updateHistory (id, type, name, item, amount, price, time) {
    let content = "<tr><td>" + type + "</td><td>" + name + "</td><td>" + item + "</td><td>" + amount + "</td><td>" + price.toFixed(2) + "$" + "</td><td>" + time + "</td></tr>";
    $("#history tbody").prepend(content);
}

function updateStorage (item, totalAmount) {

    let color = "";
    if (totalAmount < 3) {
        color = "red";
    } else {
        color = "black";
    }
    let data = $("#storage td:contains(" + item + ")");
    data.next().text(totalAmount).css("color", color);

}

function addToStorage (employee, item, amount) {
    if (localStorage.getItem(item) === null) {
        localStorage.setItem(item, "0");
    }
    let time = dateFinder();
    let price = products.find(product => product.name === item).price * amount;
    fridgeHistory.push({
        id: fridgeHistory.length + 1,
        type: "Add",
        name: employee,
        item: item,
        amount: amount,
        price: price,
        time: time
    });
    console.log(fridgeHistory);
    localStorage.setItem("fridgeHistory", JSON.stringify(fridgeHistory));

    updateHistory(fridgeHistory.length + 1, "Add", employee, item, amount, price, time);
    let currentAmount = fridgeStorage.get(item);
    console.log(fridgeStorage);
    fridgeStorage.set(item, (amount + currentAmount));
    let itemAmount = localStorage.getItem(item);
    let totalAmount = parseInt(itemAmount) + amount;
    localStorage.setItem(item, totalAmount);
    updateStorage(item, totalAmount);
}


function removeFromStorage (employee, item, amount) {
    let time = dateFinder();
    let price = products.find(product => product.name === item).price * amount;
    fridgeHistory.push({
        id: fridgeHistory.length + 1,
        type: "Remove",
        name: employee,
        item: item,
        amount: amount,
        price: price,
        time: time
    });
    localStorage.setItem("fridgeHistory", JSON.stringify(fridgeHistory));
    updateHistory(fridgeHistory + 1, "Remove", employee, item, amount, price, time)

    let currentAmount = fridgeStorage.get(item);
    fridgeStorage.set(item, (currentAmount - amount));

    let itemAmount = localStorage.getItem(item);
    let totalAmount = itemAmount - amount;
    localStorage.setItem(item, totalAmount);
    updateStorage(item, totalAmount);
}
