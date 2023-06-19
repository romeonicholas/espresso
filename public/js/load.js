const btn = document.querySelector('.slider')

btn.addEventListener('click', function() {
    document.querySelectorAll('.header, .footer, .aside, .menu, .main')
        .forEach((element) => { element.classList.toggle('dark-theme') })
})