const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const left = $('.left');
const right = $('.right');
const container = $('.container');

left.addEventListener('mouseenter', () => {
    container.classList.add('hover-left');
})

left.addEventListener('mouseleave', () => {
    container.classList.remove('hover-left');
})

right.addEventListener('mouseenter', () => {
    container.classList.add('hover-right');
})

right.addEventListener('mouseleave', () => {
    container.classList.remove('hover-right');
})