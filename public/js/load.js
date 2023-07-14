
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
        let arrow = collapseButton.childNodes[1];

        if (collapsibleContent.style.maxHeight) {
            collapsibleContent.style.maxHeight = null;
            arrow.innerText = `⇣`
        } else {
            collapsibleContent.style.maxHeight = `${collapsibleContent.scrollHeight}px`;
            arrow.innerText = `⇡`
        }
    });
})

const primarySelector = document.querySelector('.primary-selector')
const secondarySelector = document.querySelector('.secondary-selector')

if (primarySelector && secondarySelector) {
    primarySelector.addEventListener('change', (e) => {
        const beanVarieties = e.target.options[e.target.selectedIndex].dataset.varieties.split(',')
    
        while (secondarySelector.options.length > 0) {
            secondarySelector.remove(0);
        }
        
        for (let i = 0; i < beanVarieties.length; i+=2) {
            secondarySelector.add(new Option(beanVarieties[i], beanVarieties[i+1]))
        }
    })
}
