var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
var barHeight = 20;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

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

    x.domain(data.map(function(d) { return d.gdp}))
	y.domain([0, d3.max(data, function(d) { return d.gdp; })]);

	chart.attr("height", margin.top + barHeight * data.length);

	var bar = allgroup.selectAll("g")
			.data(data)
		.enter().append("g")
			.attr("transform", function(d, i) { return "translate(0," + barHeight + ")"; });

	bar.append("rect")
        .style("fill", "turquoise")
        .attr("x", function(d) { return x(d.gdp); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.gdp); })
        .attr("height", function(d) { return height - y(d.gdp); })
        .on("mouseover", function(d, i){
            var tipx = parseInt(d3.select(this).attr("x"))+65;
            var tipy = parseInt(d3.select(this).attr("y"))+30;
            tooltip.attr("x", tipx); 		
            tooltip.attr("y", tipy);
            tooltip.style("visibility", "visible");
            tooltip.style("fill", "black");
            tooltip.text(d.gdp);
            d3.select(this).style("fill", "pink");
        })
        .on("mouseout", function(){
            d3.select(this).style("fill", "turquoise");
            tooltip.style("visibility", "hidden");
        });
});

function type(d) {
	d.gdp = +d.gdp;
	return d;
}

