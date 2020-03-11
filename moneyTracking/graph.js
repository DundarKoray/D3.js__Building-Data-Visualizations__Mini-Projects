/////////////////////////////////
//** PIE CHART **//

// dimensions
const dims = { height: 300, width: 300, radius: 150 };
// center of the pie chart (+5 gives some breathing room)
const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5) } ;

/////////////////////////////////
//** SVG CONTAINER **//
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 150) // +150 to give some breathing room
    .attr('height', dims.height + 150) // +150 to give some breathing room





