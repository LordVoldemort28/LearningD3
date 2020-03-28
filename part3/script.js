var margin = {top: 60, right: 20, bottom: 70, left: 30},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
var barHeight = 14;  
var svgns = "http://www.w3.org/2000/svg";

function maxPopulation(data) {
    let max = 0;
    data.map((data) => {
        if(data.population > max)
            max = data.population
    })
    return max;
}

function scale(rangeVal, domainVal, scaleVal) {
    range = rangeVal[1] - rangeVal[0]
    domain = domainVal[1] - domainVal[0]
    return (scaleVal*(range/domain)+5)
}

var csvFile = "./state_population_gdp.tsv"

var loadDoc = new Promise( (resolve) => {
    var fileContents;
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         fileContents = this.responseText
         resolve(fileContents)
      }
    };

    xhttp.open("GET", csvFile, true);
    xhttp.send();
})

let loadData = async() => {
    return loadDoc.then( (fileContents) => {
        const lines = fileContents.split("\n")
        lines.pop()
        lines.shift()
        
        const data = lines.map((dataLine) => {
            eachLinedata = dataLine.split("	");
            return {
                state: eachLinedata[0],
                population: parseInt(eachLinedata[1]),
                gdp: parseInt(eachLinedata[2])
            }
        })
        return data
    })
}

loadData().then( (data) => {
    console.log(data)
    
    var yRange = [0, height];
    var yDomain = [0, maxPopulation(data)];

    const chart = document.getElementsByClassName("chart")
    chart[0].setAttribute("width", width + margin.left + margin.right)
    chart[0].setAttribute("height", height + margin.top + margin.bottom)

    const allGroup = document.createElementNS(svgns, 'g')
    allGroup.setAttribute("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    chart[0].appendChild(allGroup)

    const tooltip = document.createElementNS(svgns, 'text')
    tooltip.setAttribute("style", "visibility: hidden")

    chart[0].appendChild(tooltip)
    data.forEach((data, i) => {
        const individualBarG = document.createElementNS(svgns, 'g')
        individualBarG.setAttribute("style", "margin-left: 10px")
        
        const rect = document.createElementNS(svgns, 'rect')
        rect.setAttribute("x", barHeight*i)
        rect.setAttribute("width", barHeight-1)
        rect.setAttribute("height",scale(yRange, yDomain, data.population))
        rect.setAttribute("y", height - scale(yRange, yDomain, data.population))
        
        individualBarG.appendChild(rect)
        allGroup.appendChild(individualBarG)

        rect.addEventListener("mouseover", function (e) {
            this.setAttribute("style", "fill: pink")
            
            var tipx = parseInt(this.getAttribute("x")) + 10;
            var tipy = parseInt(this.getAttribute("y")) + 50;
            
            tooltip.setAttribute("x", tipx)
            tooltip.setAttribute("y", tipy)
            tooltip.setAttribute("style", "visibility: visible")
            tooltip.setAttribute("style", "fill: black")
            tooltip.innerHTML = data.population
        })
        
        rect.addEventListener("mouseout", function (e) {
            this.setAttribute("style", "fill: turquoise")
            tooltip.setAttribute("style", "visibility: hidden")
        })
    })
});