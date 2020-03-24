// DOM elements
const btns = document.querySelectorAll('button[data-activity]');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.querySelector('input');
const error = document.querySelector('.error')

// acitivty will be updated once we click other buttons
let activity = 'cycling';

// event listeners
btns.forEach(btn => {
    btn.addEventListener('click', e => {
        
        // get activity
        activity = e.target.dataset.activity;
        
        // remove and add active class
        btns.forEach(btn => btn.classList.remove('active'))
        e.target.classList.add('active');

        // set id of input field
        input.setAttribute('id', activity)

        // set text of form span
        formAct.textContent = activity

        // call the update function
        update(data)
    })
});

// form submit
form.addEventListener('submit', (e) => {
    
    // prevent default action
    e.preventDefault();

    // get the value, as a number not a string
    const distance = parseInt(input.value);
    if(distance){
        db.collection('activities').add({
            distance: distance,
            activity: activity,
            date: new Date().toString()
        }).then(() =>{
            error.textContent = '';
            input.value = '';
        })
    } else {
        error.textContent = 'Please insert a valid distance'
    }


})