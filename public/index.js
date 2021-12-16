import { createAdjacencyMatrix } from "./matrixManagement.js";

// Definition de la taille du svg
const margin = { top: 0, right: 30, bottom: 20, left: 10 },
    width = 960,
    height = 960;

// ajout du svg à une 'div id="matrice"' déjà créee dans la page html
var svg = d3
    .select("#visu-tp4")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    // .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.json('got_social_graph.json').then(json => {

    const maxInfluence = Math.max(...json.nodes.map(node => parseInt(node.influence)))

    console.log(maxInfluence)

    var scale = d3.scaleQuantize()
        .domain([0, maxInfluence])
        .range(d3.schemeBlues[9])

    // scale.domain([
    //     d3.min(json.nodes, function (d) {
    //         return d.influence;
    //     }),
    //     d3.max(json.nodes, function (d) {
    //         return d.influence;
    //     })
    // ]);


    console.log("json:", json.nodes)
    let adjancencymatrix = createAdjacencyMatrix(json.nodes, json.links)
    console.log("adjancencymatrix:", adjancencymatrix)


    // un tableau d'autant d'element que de personnages 
    // [0, 1, ..., 106]
    var positionsPersonnages = d3.range(json.nodes.length);

    var echellexy = d3.scaleBand()
        .range([0, width]) // TODO correspond [0, largeur du dessin]
        .domain(positionsPersonnages)
        .paddingInner(0.1)
        .align(0)
        .round(true);


    const matrixViz = svg.selectAll('rect')
        .data(adjancencymatrix)
        .join("rect")
        .attr("width", echellexy(5))
        .attr("height", echellexy(5))
        // .attr("x", 100)
        .attr("x", (adjancency) => echellexy(parseInt(adjancency.x)))
        // .attr("y", 200)
        .attr("y", (adjancency) => echellexy(parseInt(adjancency.y)))
        .attr("stroke", "black")
        .attr("stroke-width", ".02px")
        // .attr("fill", "#abc")
        .style("fill", function (adjancency) {
            return scale(adjancency.weight)
        })

    var labels = d3.select("svg")
        .append("g")
        .attr("transform", "translate(60, 60)")
        .style("font-size", "8px")
        .style("font-family", "sans-serif");

    var columns = labels
        .append("g")
        .selectAll()
        .data(json.nodes.slice(0, 10))
        .join("text").attr("x", function (d, i) {
            console.log(d)
            console.log(i)
            return 
        }).attr("y", echellexy(-30)).text(node => node.character)
        .attr("transform", "rotate(-90)"); // on tourne tout l'axe de 90°

    // var rows = labels
    //     .append("g")
    //     .selectAll()
    //     .data(json.nodes)
    //     .join("text").text(node => node.character)






})
    .catch(console.error)