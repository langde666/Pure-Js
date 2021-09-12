const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const img = $('img');
const loadingText = $('.loading-text');
const loadingCircle = $('.loading-circle');

let load = 0;
let loading = setInterval(() => {
    blurring();
}, 10);

const blurring = () => {
    load++;
    if (load > 99) {
        clearInterval(loading);
        loadingText.style.display = 'none';
        loadingCircle.style.display = 'none';
    }

    loadingText.innerText = `${load}%`;
    loadingText.style.opacity = `${scale(load, 0, 100, 1, 0)}`;

    loadingCircle.style.opacity = `${scale(load, 0, 100, 1, 0)}`;

    img.style.filter = `blur(${scale(load, 0, 100, 100, 0)}px)`;

}

//https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
const scale = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}