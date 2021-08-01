const checkbox = document.getElementById('checkbox');
const submitBtn = document.querySelector('button[type=submit]');

//disable checkbox
checkbox.disabled = true;
submitBtn.disabled = true;

const elements = document.querySelectorAll('.element');
const selectColor = document.getElementById('selectColor');

//asign color to elements
elements.forEach((element) => {
    const color = getRandomColor();

    element.style.backgroundColor = color;
    element.innerHTML = color;

    selectColor.innerHTML = color;
});

//generate random color Func
function getRandomColor() {
    const letter = "0123456789ABCDEF";
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letter[Math.floor(Math.random() * 16)];
    }

    return color;
}

//check is right color
elements.forEach((element) =>{
    element.addEventListener('click', function() {
        if (element.innerHTML === selectColor.innerHTML) {
            alert('You are human!');
            checkbox.checked = true;
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-light');
            submitBtn.classList.add('btn-success');
        }
        else {
            alert('Please verify that you are human!');
            location.reload(true);
        }
    })
});

console.log(getRandomColor());