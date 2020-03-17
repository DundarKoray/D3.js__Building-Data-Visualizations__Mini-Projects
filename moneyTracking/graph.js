/////////////////////////////////
//** PIE CHART DIMENSIONS **//

// dimensions
const dims = { height: 300, width: 300, radius: 150 };
// center of the pie chart (+5 gives some breathing room)
const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 25) } ;

/////////////////////////////////
//** SVG CONTAINER **//

// creating svg (+150 gives some breathing room)
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 200) 
    .attr('height', dims.height + 200) 

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

// legend setup
const legendGroup = svg.append('g')
    .attr('transform', `translate(${dims.width + 40}, 10)`)

const legend = d3.legendColor()
    .shape('circle')
    .shapePadding(10)
    .scale(colour);

const tip = d3.tip()
    .attr('class', 'tip card')
    .html(d => {
        let content = `<div class="name">${d.data.name} ${d.data.cost}€</div>`;
        content += `<div class="delete">Click to delete data</div>`
        return content
    });

graph.call(tip);

/////////////////////////////////
//** FIRESTORE CONNECTION **//


// update function 
const update = (data) => {
    
    // this code gives different color for each data (update colour scale domain)
    colour.domain(data.map(d => d.name))
    
    //  update and call legend
    legendGroup.call(legend);
    legendGroup.selectAll('text').attr('fill', 'grey')
    
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
    paths.attr('d', arcPath)
        .transition().duration(750)
        .attrTween('d', arcTweenUpdate);
    
    paths.enter()
    .append('path')
    .attr('class', 'arc')
    // the code below is disabled because transition is taking care of it now.
    // .attr('d', arcPath)
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
    // this code gives different color for each data
    .attr('fill', d => colour(d.data.name))
    .each(function(d){ this._current = d })
    // transition effect
    .transition().duration(750)
        .attrTween('d', arcTweenEnter);
    
    // add events
    graph.selectAll('path')
        .on('mouseover', (d,i,n) =>{
            tip.show(d, n[i])
            handleMouseOver(d,i,n)
        })
        // .on('mouseout', handleMouseOut)
        .on('mouseout', (d,i,n) => {
            tip.hide();
            handleMouseOut(d,i,n)
        })
        .on('click', handleDelete)

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
        return arcPath(d)
    }
}


// use function keyword to allow use of 'this'
function arcTweenUpdate(d) {
    // console.log(this._current, d)

    // interpolate between the two objects
    var i = d3.interpolate(this._current, d)

    // update the current prop with new updated data
    this._current = i(1);
    // this._current = d

    return function(t) {
        return arcPath(i(t))
    }
}

// event handlers
const handleMouseOver = (d, i, n) => {
    // console.log(n[i])
    // console.log(d.data.name)
    d3.select(n[i])
        .transition('changeSliceFillColour').duration(300)
            .attr('fill', '#fff')
}

const handleMouseOut = (d, i, n) => {
    d3.select(n[i])
        .transition('changeSliceFillColour').duration(300)
            .attr('fill', colour(d.data.name))
}

const handleDelete = (d) => {
    const id = d.data.id;
    // db.collection('expenses').doc(id).delete()
    let question = prompt('You are about to remove this data. Write "delete" to complete the action!')

    console.log(question)
    
    if (question === "delete"){
        db.collection('expenses').doc(id).delete()
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