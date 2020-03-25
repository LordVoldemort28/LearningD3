var margin = {top: 60, right: 20, bottom: 70, left: 40},
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
        .style("visibility", "hidden");    
	
d3.tsv("state_population_gdp.tsv", type, function(error, data) {

    console.log(data)

    x.domain([0, d3.max(data, function(d) { return d.population; })])
	y.domain([0, d3.max(data, function(d) { return d.gdp; })]);

	var circle = allgroup.selectAll("g")
			.data(data)
		.enter().append("g")

    circle.append("circle")
        .style("fill", "turquoise")
        .attr("cx", function(d) { return x(d.population); })
        .attr("r", 5)
        .attr("cy", function(d) { return y(d.gdp); })
        .on("mouseover", function(d, i){
            var tipx = parseInt(d3.select(this).attr("cx"))+65;
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
});

function type(d) {
    d.gdp = +d.gdp;
	d.population = +d.population;
	return d;
}

