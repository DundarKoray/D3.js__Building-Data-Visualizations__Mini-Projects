// dimensions tree diagram
const dims = { height: 500, width: 1100 } 

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 100) // 50 margin on both sides
    .attr('height', dims.height + 100) // 50 margin on both up and down

const graph = svg.append('g')
    .attr('transform', 'translate(50,50)');

// data strat
const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent);

const tree = d3.tree()
    .size([dims.width, dims.height]) // we are specifying tree diagram dims


// update function
const update = (data) => {

    // get updated root Node data
    const rootNode = stratify(data);
    // console.log(rootNode);

    const treeData = tree(rootNode); // it give x and y positions
    // console.log(treeData)

    // get nodes selection and join data (descendants converts it to array)
    const nodes = graph.selectAll('.node')
        .data(treeData.descendants())

    console.log('treeData.descendants(): ', treeData.descendants())
    
    // get links selection and join data
    const links = graph.selectAll('.link')
        .data(treeData.links())
    
    console.log('treeData.descendants():', treeData.links())

    // enter new links
    links.enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );

    // create enter node groups
    const enterNodes = nodes.enter()
        .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // append rects to enter nodes
    enterNodes.append('rect')
        .attr('fill', '#aaa')
        .attr('stroke', '#555')
        .attr('stroke-width', 2)
        .attr('height', 50)
        .attr('width', d => d.data.name.length * 20); // coz everyname is different 
    
    // append text to each nodes   
    enterNodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.data.name)
};



// data & firebase hook-up
let data = [];

db.collection('employees').onSnapshot(res => {
    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(), id: change.doc.id};

        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }

    })

    // console.log(data)
    update(data)
})