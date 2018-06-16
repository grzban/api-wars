var minPlanetId = 1;
var maxPlanetId = 61;

var activePage = 1;


function getPlanet(id, tbody) {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", "https://swapi.co/api/planets/" + id + "/");

    xhr.onload = function () {
        let planet = "";
        if (xhr.status === 200) {
            planet = JSON.parse(xhr.response);
            let rowElements = [];
            rowElements.push(createTH(planet.name, ));
            rowElements.push(createTD(planet.diameter));
            rowElements.push(createTD(planet.climate));
            rowElements.push(createTD(planet.terrain));
            rowElements.push(createTD(planet.surface_water));
            rowElements.push(createTD(planet.population));
            rowElements.push(createTD(planet.residents));
            let tr = createRow(rowElements);
            tbody.appendChild(tr);
        }
        else {
            planet = "Empty";
        }

    };
    xhr.send();
}

function createRow(rowElements) {
    let row = document.createElement("tr");
    for (let element of rowElements){
        row.appendChild(element);
    }
    return row;
}

function createTH(thName) {
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(thName));
    th.scope = "col";
    return th;
}

function createTableHead(){
    let rowElements = [];
    rowElements.push(createTH("Name"));
    rowElements.push(createTH("Diameter"));
    rowElements.push(createTH("Climate"));
    rowElements.push(createTH("Terrain"));
    rowElements.push(createTH("Surface Water Percentage"));
    rowElements.push(createTH("Population"));
    rowElements.push(createTH("Residents"));

    return createRow(rowElements);
}

function createTD(tdValue) {
    let td = document.createElement("td");
    td.appendChild(document.createTextNode(tdValue));
    return td;
}

function createTable() {
    let table = document.createElement("table");
    table.className = "table";
    table.appendChild(createTableHead());

    let tbody = document.createElement("tbody");
    let min = this.minPlanetId;
    let max = this.maxPlanetId;
    for (let i = min; i <= max; i++) {
        getPlanet(i, tbody);
    }
    table.appendChild(tbody);
    return table;
}

function createPlanetsView() {
    window.onload = function () {
        var planetList = document.getElementById("planet_list");
        planetList.innerHTML = "";
        planetList.appendChild(createTable());
        createPaginationNav();
    }
}

function createLi(name){
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
        console.log(event.srcElement);
    });

    return li;
}

function calculateNumbersOfPage(max, amountOnThePage){
    let amountOfPages = max/amountOnThePage;
    if (max%amountOnThePage != 0){
      return parseInt((amountOfPages + 1) + "");
    }
    return parseInt(amountOfPages + "") ;
}

function createPaginationNav(){
    let planet_list_pagination = document.getElementById("planet_list_pagination");
    planet_list_pagination.innerText = "";
    let ul = document.createElement("ul");
    let numbersOfPage = calculateNumbersOfPage(maxPlanetId, 10);

    if (numbersOfPage > 1) {
        let previousButton = createLi("Previous");
        if(this.activePage == 1) {
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


/*
<ul class="pagination justify-content-center">
        <li class="page-item disabled">
        <span class="page-link">Previous</span>
        </li>
        <li class="page-item active">
        <span class="page-link">
        1<span class="sr-only">(current)</span>
        </span>
        </li>
        <li class="page-item">
        <a class="page-link" href="#">2</a>
        </li>
        <li class="page-item">
        <a class="page-link" href="#">3</a>
        </li>
        <li class="page-item">
        <a class="page-link" href="#">Next</a>
        </li>
        </ul>
*/
    return planet_list_pagination;
}

createPlanetsView();