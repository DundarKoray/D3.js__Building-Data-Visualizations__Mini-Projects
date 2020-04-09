// dimensions tree diagram
const dims = { height: 500, width: 1100 } 

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 100) // 50 margin on both sides
    .attr('height', dims.height + 100) // 50 margin on both up and down

const graph = svg.append('g')
    .attr('transform', 'translate(50,50)');



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

    console.log(data)

})