const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const open = $('#open');
const close = $('#close');
const container = $('.container');

open.addEventListener('click', () => {
    container.classList.add('show-nav');
});

close.addEventListener('click', () => {
    container.classList.remove('show-nav');
})