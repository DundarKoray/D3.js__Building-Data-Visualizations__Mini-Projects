/////////////////////////////////
//** PIE CHART DIMENSIONS **//

// dimensions
const dims = { height: 300, width: 300, radius: 150 };
// center of the pie chart (+5 gives some breathing room)
const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5) } ;

/////////////////////////////////
//** SVG CONTAINER **//

// creating svg (+150 gives some breathing room)
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 150) 
    .attr('height', dims.height + 150) 

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
    
    // this code gives different color for each data (update colour scale domain)
    colour.domain(data.map(d => d.name))
    
    
    
    // join enchanced (pie) data to path elements
    const paths = graph.selectAll('path')
    .data(pie(data))
    // console.log(pie(data))
    
    // handle the exit selection for graph
    paths.exit()
        .transition().duration(750)
        .attrTween('d', arcTweenExit)
    .remove()

    // handle the current DOM path updates,, changes
    paths.attr('d', arcPath);
    
    paths.enter()
    .append('path')
    .attr('class', 'arc')
    // the code below is disabled because transition is taking care of it now.
    // .attr('d', arcPath)
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
    // this code gives different color for each data
    .attr('fill', d => colour(d.data.name))
    // transition effect
    .transition().duration(750)
        .attrTween('d', arcTweenEnter);

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

 // transition effect function
 const arcTweenEnter = (d) => {
    let i = d3.interpolate(d.endAngle, d.startAngle)

    // 0 represent start point and 1 end point
    return function(t){
        d.startAngle = i(t);
        return arcPath(d)
    }
};

const arcTweenExit = (d) => {
    let i = d3.interpolate(d.startAngle, d.endAngle)

    // 0 present start point and 1 end point
    return function(t) {
        d.startAngle = i(t);
        return artPath(d)
    }
}

    
    
    
    
/* 
    //dummy data
    const angles = pie([
        { name: 'rent', cost: 500 },
        { name: 'bills', cost: 300 },
        { name: 'gaming', cost: 200 }
    ])
    console.log(arcPath(angles[0]))
*/