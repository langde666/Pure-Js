const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const sounds = ['howDeep', 'bridgeOver', 'dontStopMe', 'dona', 'heyJude', 'hotelCali'];
sounds.forEach(sound => {
    const btn = document.createElement('button');
    btn.id = `${sound}Btn`;
    btn.classList.add('btn');

    btn.innerText = sound;
    btn.addEventListener('click', () => {
        stopSongs();
        $(`#${sound}`).play();
        btn.classList.add('playing');
    });

    $('#buttons').appendChild(btn);
});

$('.btn--reset').addEventListener('click', () => {
    stopSongs();
})

const stopSongs = () => {
    sounds.forEach(sound => {
        $(`#${sound}`).pause();
        $(`#${sound}`).currentTime = 0;
        $(`#${sound}Btn`).classList.remove('playing');
    });
};