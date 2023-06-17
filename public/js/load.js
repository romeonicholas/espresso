console.log('loaded')

const btn = document.querySelector('.btn-toggle');
btn.addEventListener('click', function() {
    document.querySelector('.header').classList.toggle('dark-theme')
    document.querySelector('.footer').classList.toggle('dark-theme')
    document.querySelector('.aside').classList.toggle('dark-theme')
    document.querySelector('.menu').classList.toggle('dark-theme')
    document.querySelector('.main').classList.toggle('dark-theme')

    console.log('Updated color theme')
})