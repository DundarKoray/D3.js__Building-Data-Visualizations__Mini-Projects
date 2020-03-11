/////////////////////////////////
//** PIE CHART **//

// dimensions
const dims = { height: 300, width: 300, radius: 150 };
// center of the pie chart (+5 gives some breathing room)
const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5) } ;

/////////////////////////////////
//** SVG CONTAINER **//

// creating svg
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 150) // +150 to give some breathing room
    .attr('height', dims.height + 150) // +150 to give some breathing room

// centering graph in svg
const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`);


// creating pie
const pie = d3.pie()
    .sort(null)
    .value(d => d.cost)


const angles = pie([
    { name: 'rent', cost: 500 },
    { name: 'bills', cost: 300 },
    { name: 'gaming', cost: 200 }
])

console.log(angles)