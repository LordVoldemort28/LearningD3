var margin = {top: 60, right: 20, bottom: 70, left: 140},
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;
    
var barHeight = 20;

var x = d3.scale.linear().range([0, width]);

var y = d3.scale.linear().range([height, 0]);

var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    
var allgroup = chart.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");   

var tooltip = chart.append("text")        
                    .style("text-decoration", "underline")
                    .style("background-color", "black")
                    .style("visibility", "hidden");  
                    
d3.tsv("./state_population_gdp.tsv", type, function(error, data) {

    console.log(typeof(data))
    x.domain([0, d3.max(data, function(d) { return d.population; })])
	y.domain([0, d3.max(data, function(d) { return d.gdp; })]);

                    // .attr("transform", "translate(0," + height + ")");    ;

	var circle = allgroup.selectAll("g")
			.data(data)
		.enter().append("g")

    circle.append("circle")
        .style("fill", "turquoise")
        .attr("cx", function(d) { return x(d.population); })
        .attr("r", 5)
        .attr("cy", function(d) { return y(d.gdp); })
        .on("mouseover", function(d, i){
            var tipx = parseInt(d3.select(this).attr("cx"))+100;
            var tipy = parseInt(d3.select(this).attr("cy"))+45;
            tooltip.attr("x", tipx); 		
            tooltip.attr("y", tipy);
            tooltip.style("visibility", "visible");
            tooltip.style("fill", "black");
            tooltip.text(d.state + ": " + (d.gdp/d.population).toFixed(3));
            d3.select(this).style("fill", "pink");
        })
        .on("mouseout", function(){
            d3.select(this).style("fill", "turquoise");
            tooltip.style("visibility", "hidden");
        });
    
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    allgroup.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .attr("y", 15)
    .attr("x", -20)
    .style("text-anchor", "start");

    var ticksX = d3.select("g.x").selectAll(".tick text");
    ticksX.attr("class", function(d,i){
        if(d == 0){return "zeroX"}    
    });

    var xLabel = d3.select("g.x").append("g")
                    .append("text").text("population")
                    .attr("class", "xLabel")
                    .attr("transform", "translate(" + width + ",-5)")


    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

    allgroup.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .selectAll("text")
    .attr("x", -55)
    .style("text-anchor", "start");

    var ticksY = d3.select("g.y").selectAll(".tick text");
    ticksY.attr("class", function(d,i){
        if(d == 0){return "zeroY"}
    })


    var YLabel = d3.select("g.y").append("g")
                    .append("text").text("gdp")
                    .attr("class", "yLabel")                
});

function type(d) {
    d.gdp = +d.gdp;
	d.population = +d.population;
	return d;
};

