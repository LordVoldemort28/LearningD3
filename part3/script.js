var margin = {top: 60, right: 20, bottom: 70, left: 140},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
    
var barHeight = 20;  

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
    const chart = document.getElementsByClassName("chart")
    chart[0].setAttribute("width", width + margin.left + margin.right)
    chart[0].setAttribute("height", height + margin.top + margin.bottom)
    // console.log(chart)
    const allGroup = document.createElement("g")
    allGroup.setAttribute("transform", "translate(" + margin.left + "," + margin.top + ")")
    // console.log(allGroup)
    chart[0].appendChild(allGroup)
    // console.log(chart)
});