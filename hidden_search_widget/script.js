const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const search = $('.search');
const input = $('.input');
const btn = $('.btn');

let flag = false;
btn.addEventListener('click', () => {
    search.classList.toggle('active');
    flag = !flag;
    flag && input.focus();
})