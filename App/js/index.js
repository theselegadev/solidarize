const menu = document.getElementById('menu')
const menuButton = document.getElementById('menuButton')
const linesMenuButton = menuButton.querySelectorAll('div');
let isVisible = false


menuButton.addEventListener('click', () => {
    if (!isVisible) {
        // Mostra o menu e transforma o hamburguer em X
        menu.style.transition = "left 500ms ease-in-out";
        menu.style.left = "50%";

        linesMenuButton[0].style.transform = "rotate(45deg) translate(5.5px, 5.5px)";
        linesMenuButton[0].style.margin = "0";

        linesMenuButton[1].style.opacity = "0";

        linesMenuButton[2].style.transform = "rotate(-45deg) translate(5.5px, -5.5px)";
        linesMenuButton[2].style.margin = "0";

        isVisible = true;
    } else {
        menu.style.left = "100%";

        // Volta ao normal
        linesMenuButton[0].style.transform = "rotate(0deg) translate(0, 0)";
        linesMenuButton[0].style.margin = "5px";

        linesMenuButton[1].style.opacity = "1";

        linesMenuButton[2].style.transform = "rotate(0deg) translate(0, 0)";
        linesMenuButton[2].style.margin = "5px";

        isVisible = false;
    }
});

