
if (localStorage.prefersDarkMode == 'true') {
    document.querySelectorAll('.header, .footer, .aside, .menu, .main')
        .forEach((element) => { element.classList.toggle('dark-theme') })

    document.querySelector('.check').checked = true
}

const darkModeButton = document.querySelector('.slider')

darkModeButton.addEventListener('click', () => {
    document.querySelectorAll('.header, .footer, .aside, .menu, .main')
        .forEach((element) => { element.classList.toggle('dark-theme') })

    localStorage.prefersDarkMode = (localStorage.prefersDarkMode == 'true') ? 'false' : 'true'
})

const collapseButtons = document.querySelectorAll(".collapse-button");

collapseButtons.forEach((collapseButton) => {
    collapseButton.addEventListener('click', () => {
        collapseButton.classList.toggle("active");

        let collapsibleContent = collapseButton.nextElementSibling;
        if (collapsibleContent.style.maxHeight) {
            collapsibleContent.style.maxHeight = null;
        } else {
            collapsibleContent.style.maxHeight = `${collapsibleContent.scrollHeight}px`;
        }
    });
})