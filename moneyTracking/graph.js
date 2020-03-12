/////////////////////////////////
//** PIE CHART DIMENSIONS **//

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


// creating outer and inner arc
const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius / 2);

// this code gives different color for each data
const colour = d3.scaleOrdinal(d3['schemeSet3'])

/////////////////////////////////
//** FIRESTORE CONNECTION **//


// update function 
const update = (data) => {
    // update colour scale domain (map throws a new array)
    // console.log(data)
    
    // this code gives different color for each data
    colour.domain(data.map(d => d.name))
    
    
    
    // join enchanced (pie) data to path elements
    const paths = graph.selectAll('path')
    .data(pie(data))
    
    // console.log(pie(data))
    
    paths.enter()
    .append('path')
    .attr('class', 'arc')
    .attr('d', arcPath)
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
            // this code gives different color for each data
            .attr('fill', d => colour(d.data.name))

}

let data = [];

//connecting firestore data
db.collection('expenses').onSnapshot(res => {
    
    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(), id: change.doc.id};
        // console.log(doc)

        //realtime-update
        switch (change.type) {
            case 'added':
                data.push(doc)
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id)
                break;
            default:
                break;
        }

    });

    update(data)


}) 
    
    
    
    
/* 
    //dummy data
    const angles = pie([
        { name: 'rent', cost: 500 },
        { name: 'bills', cost: 300 },
        { name: 'gaming', cost: 200 }
    ])
    console.log(arcPath(angles[0]))
*/