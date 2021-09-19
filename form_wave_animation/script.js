const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const labels = document.querySelectorAll('.form-control label');

labels.forEach(label => {
    label.innerHTML = label.innerHTML
        .split('')
        .map((letter, index) => `<span style="transition-delay:${index * 50}ms">${letter}</span>`)
        .join('');
});