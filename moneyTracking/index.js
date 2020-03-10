const form = document.querySelector('form');
const name = document.querySelector('#name');
const cost = document.querySelector('#cost');
const error = document.querySelector('#error');

form.addEventListener('submit', (e) => {

    //have to prevent refreshing page when clicked "ADD ITEM" button
    e.preventDefault();

    // check if user inserted any values in input field
    // both have to be true other wise we'll throw an error
    if (name.value && cost.value) {

        const item = {
            // item object structure has to be same as the one in firestore
            // cost has to be a number so we gotta conver string to number
            name: name.value,
            cost: parseInt(cost.value)
        };

        // now we gotta save item object into firestore database
        db.collection('expenses').add(item).then(res => {
            // so after item object is saved in firestore database, we wanna clear the form input
            name.value = "";
            cost.value = "";
            error.textContent = "";
            // we could also use form.reset() instead of above lines. 
        })

    } else {
        error.textContent = 'Please enter values before submitting'
    }

})