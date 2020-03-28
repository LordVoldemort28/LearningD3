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

var tooltip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<span style='color:palevioletred'>" + d.state +": "+ numberWithCommas(d.gdp) + "</span>";
})

allgroup.call(tooltip);

var sort = false

d3.tsv("../dataset/state_population_gdp.tsv", type, function(error, data) {

    x.domain(d3.range(data.length))
	y.domain([0, d3.max(data, function(d) { return d.gdp; })]);

    chart.attr("height", margin.top + barHeight * data.length);
    
	var bar = allgroup.selectAll("g")
                .data(data)
                .enter()
                .append("rect")
                .attr("fill", "turquoise")
                .attr("transform", function(d, i) { return "translate(0," + barHeight + ")"; })
                .attr("x", function(d,i) { return x(i);})
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.gdp); })
                .attr("height", function(d) { return height - y(d.gdp); })
                .on('mouseover', function(d){
                    d3.select(this).attr("fill", "pink")
                    tooltip.show(d);
                })
                .on('mouseout', function(d){
                    d3.select(this).attr("fill", "turquoise")
                    tooltip.hide(d);
                })
});

function type(d) {
	d.gdp = +d.gdp;
	return d;
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


