const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const panels = $$('.panel')

panels.forEach(panel => {
    panel.onclick = (e) => handlePanelClick(e);
});

const handlePanelClick = (e) => {
    panels.forEach(panel => {
        panel.classList.remove('active');
    });

    e.target.classList.add('active');
};

// console.log(panels);