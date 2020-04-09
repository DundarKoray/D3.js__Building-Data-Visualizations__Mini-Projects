const modal = document.querySelector('.modal');
M.Modal.init(modal)

const form = document.querySelector('form');
const name = document.querySelector('#name');
const parent = document.querySelector('#parent');
const department = document.querySelector('#department');

form.addEventListener('submit', e => {
    // this prevents refreshing page
    e.preventDefault();

    // this saves data in firestore
    db.collection('employees').add({
        name: name.value,
        parent: parent.value,
        department: department.value
    });

    // this closes the popup window
    let instance = M.Modal.getInstance(modal)
    instance.close();

    // this resets all the values on form back to blank after submitting
    form.reset();
})