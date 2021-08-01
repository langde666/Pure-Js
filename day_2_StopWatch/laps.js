window.onload = function() {
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');
    const tens = document.getElementById('tens');
    
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');

    const lap = document.getElementById('laps');

    let minutesSet = 0;
    let secondsSet = 0;
    let tensSet = 0;
    let interval;
    let status = 0; //0-origional 1-runing 2-pause

    startBtn.onclick = function() {
        if (status == 0 || status == 2) {
            interval = setInterval(startTimer, 10);
            dimEffect();

            status = 1;
        } 
    }

    stopBtn.onclick = function() {
        if (status == 1) {
            clearInterval(interval);
            dimEffect();

            const li = document.createElement('li');
            li.innerHTML=`lap: <span>${minutes.innerHTML}</span>:<span>${seconds.innerHTML}</span>.<span>${tens.innerHTML}</span>`;

            lap.prepend(li);
            
            status = 2;
        }   
    }

    resetBtn.onclick = function() {
        if (status != 0) {
            if (status == 1) {
                dimEffect();
            }
    
            clearInterval(interval);
            minutesSet = 0;
            secondsSet = 0;
            tensSet = 0;
    
            tens.innerHTML = "0" + tensSet;
            seconds.innerHTML = "0" + secondsSet;
            minutes.innerHTML = "0" + minutesSet;
    
            lap.innerHTML = '';
    
            status = 0;
        }
    }

    //create startTimer Func
    function startTimer() {
        tensSet++;

        if (tensSet < 9) {
            tens.innerHTML = "0" + tensSet;
        }

        if (tensSet > 9) {
            tens.innerHTML = tensSet;
        }

        if (tensSet > 99) {
            secondsSet++;
            seconds.innerHTML = "0" + secondsSet;
            tensSet = 0;
            tens.innerHTML = "0" + tensSet;
        }

        if (secondsSet > 9) {
            seconds.innerHTML = secondsSet;
        }

        if (secondsSet == 60) {
            minutesSet++;
            minutes.innerHTML = "0" + minutesSet;
            secondsSet = 0;
            seconds.innerHTML = "0" +secondsSet;
        }

        if (minutesSet > 9) {
            minutes.innerHTML = minutesSet;
        }
    }

    //Dimming effect Func
    function dimEffect() {
        const lapTime = document.querySelector('.lap-time');
        lapTime.classList.toggle('diming-effect');
    } 
}