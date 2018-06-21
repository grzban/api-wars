let activePage = 1;
let maxPlanetId = 61;
let pageScopeMin = 1;
let pageScopeMax = 10;
let amountOfThePage = 10;

let planetHeads = [
    "Name",
    "Diameter",
    "Climate",
    "Terrain",
    "Surface Water Percentage",
    "Population",
    "Residents"
];

let planetColumns = [
    "name",
    "diameter",
    "climate",
    "terrain",
    "surface_water",
    "population",
    "residents"
];

let peopleHeads = [
    "Name",
    "Height",
    "Mass",
    "Hair Color",
    "Skin Color",
    "Eye Color",
    "Birth Year",
    "Gender"
];

let peopleColumns = [
    "name",
    "height",
    "mass",
    "hair_color",
    "skin_color",
    "eye_color",
    "birth_year",
    "gender"
];

function getResident(id, table) {
    let httpRequest = new XMLHttpRequest();
    let url = "https://swapi.co/api/people/" + id + "/?format=json";
    let method = "GET";
    httpRequest.onload = function () {
        if (httpRequest.status === 200) {
            let resident = JSON.parse(httpRequest.response);
            table.appendChild(createPeopleTableRow(peopleColumns, resident));
        } else {
            console.log("It's a problem");
        }
    }
    httpRequest.open(method, url, true);
    httpRequest.send();
}

function getPlanet(id, table) {
    let httpRequest = new XMLHttpRequest();
    let url = "https://swapi.co/api/planets/" + id + "/?format=json";
    let method = "GET";
    httpRequest.onload = function () {
        if (httpRequest.status === 200) {
            let planet = JSON.parse(httpRequest.response);
            table.appendChild(createPlanetTableRow(planetColumns, planet));
        } else {
            console.log("It's a problem");
        }
    }
    httpRequest.open(method, url, true);
    httpRequest.send();
}

function createTableHeadRow(heads) {
    let row = document.createElement("tr");
    for (let head of heads) {
        row.appendChild(createTH(head));
    }
    return row;
}

function createTDBtn(tdValue) {
    let td = document.createElement("td");
    td.appendChild(tdValue);
    return td;
}

function createTDTxt(tdValue) {
    let td = document.createElement("td");
    td.appendChild(document.createTextNode(tdValue));
    return td;
}

function checkIfPlanetHasResident(planetResidents) {
    let residentButton = document.createElement('button');
    let residentButtonTxt = document.createTextNode(planetResidents.length + " resident(s)");
    residentButton.appendChild(residentButtonTxt);
    residentButton.addEventListener("click", function () {
        let modal = document.getElementById("residents");
        modal.style.display = "block";
        let residentsClose = document.getElementById("residentsClose");
        residentsClose.addEventListener("click", function () {
            modal.style.display = "none";
        });

        let modalBody = document.getElementById("modal-body");
        modalBody.innerText = "";
        let table = createPeopleTable();
        for (let planetResident of planetResidents) {
            let regex = /https:\/\/swapi.co\/api\/people\//gi;
            let id = planetResident.replace(regex, '');
            regex = /\//gi;
            id = parseInt(id.replace(regex, ""));
            getResident(id, table);
        }
        let modalP = document.createElement("p");
        console.log(table);
        modalP.appendChild(table);
        modalBody.appendChild(modalP);
    });

    if (planetResidents != "") {
        return residentButton;
    }

    return document.createTextNode("No known residents");
}

function createTH(head) {
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(head));
    th.scope = "col";
    return th;
}

function createPlanetTableRow(columns, data) {
    let row = document.createElement("tr");
    for (let column of columns) {
        if (column == "name") {
            row.appendChild(createTH(data[column]));
        } else if (column == "residents") {
            row.appendChild(createTDBtn(checkIfPlanetHasResident(data[column])));
        } else {
            row.appendChild(createTDTxt(data[column]));
        }
    }
    return row;
}

function createPeopleTableRow(columns, data) {
    let row = document.createElement("tr");
    for (let column of columns) {
        row.appendChild(createTDTxt(data[column]));
    }
    return row;
}

//do poprawy
function createPeopleTable() {
    let table = document.createElement("table");
    table.className = "table";
    table.appendChild(createTableHeadRow(peopleHeads));
    /* for (let i = 1; i <= 2; i++) {
         getResident(i, table);
     }*/
    return table;
}

function createPlanetTable(min, max, activePage) {
    let table = document.createElement("table");
    table.className = "table";
    table.appendChild(createTableHeadRow(planetHeads));
    console.log(min, max, activePage);
    for (let i = min; i <= max; i++) {
        getPlanet(i, table);
    }
    return table;
}

function createPaginationNav() {
    let planet_list_pagination = document.getElementById("planet_list_pagination");
    planet_list_pagination.innerText = "";
    let ul = document.createElement("ul");
    let numbersOfPage = calculateNumbersOfPage(maxPlanetId, 10);

    if (numbersOfPage > 1) {
        let previousButton = createLi("Previous");
        if (activePage == 1) {
            previousButton.className += " disabled";
        }
        ul.appendChild(previousButton);
        for (let i = 1; i <= calculateNumbersOfPage(maxPlanetId, 10); i++) {
            ul.appendChild(createLi(i));
        }
        ul.appendChild(createLi("Next"));

    } else {
        ul.appendChild(createLi(1));
    }
    ul.className = "pagination justify-content-center";
    planet_list_pagination.appendChild(ul);

    return planet_list_pagination;
}

function calculateNumbersOfPage(max, amountOfThePage) {
    let amountOfPages = max / amountOfThePage;
    if (max % amountOfThePage != 0) {
        return parseInt((amountOfPages + 1) + "");
    }
    return parseInt(amountOfPages + "");
}

function generateMinPage() {
    pageScopeMin = (activePage * amountOfThePage) - (amountOfThePage - 1);
    return pageScopeMin;
}


function generateMaxPage() {
    pageScopeMax = (activePage * amountOfThePage);
    return pageScopeMax;
}

function generatePlanetTableView() {
    var planetList = document.getElementById("planet_list");
    planetList.innerHTML = "";
    let min = generateMinPage();
    let max = generateMaxPage();
    planetList.appendChild(createPlanetTable(min, max, activePage));
    createPaginationNav();
}


function createLi(name) {
    let li = document.createElement("li");
    let span = document.createElement("span");
    let spanTxt = document.createTextNode(name);
    span.appendChild(spanTxt);
    span.className = "page-link";
    span.id = "span-" + name;
    li.appendChild(span);
    li.className = "page-item";
    li.addEventListener("click", function () {
        event.preventDefault();
        let regex = /span-/gi;
        let id = event.srcElement.id;
        activePage = parseInt(id.replace(regex, ''));
        console.log(activePage);
        generatePlanetTableView();
    });
    return li;
}

window.onload = function () {
    generatePlanetTableView();
}