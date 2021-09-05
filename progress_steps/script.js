const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const progress = $('#progress');
const circles = $$('.circle');
const nextBtn = $('#next');
const prevBtn = $('#prev');

nextBtn.addEventListener('click', () => {
    updateProgress(1);
});

prevBtn.addEventListener('click', () => {
    updateProgress(-1);
});

let currentProgressValue = 1;
const updateProgress = (step) => {
    //update current process value
    currentProgressValue += step;

    //update button and limit current process value
    const circlesLength = circles.length;
    if (currentProgressValue >= circlesLength) {
        currentProgressValue = circlesLength;
        nextBtn.disabled = true;
    }
    else if (currentProgressValue <= 1) {
        currentProgressValue = 1;
        prevBtn.disabled = true;
    }
    else {
        nextBtn.disabled = false;
        prevBtn.disabled = false;
    }

    //update circles
    circles.forEach((circle, index) => {
        if (index+1 <= currentProgressValue) {
            circle.classList.add('active');
        }
        else {
            circle.classList.remove('active');
        }
    })

    //update progress
    progress.style.width = `${(currentProgressValue-1) / (circlesLength-1) *100}%`;

    // console.log(currentProgressValue)
};
