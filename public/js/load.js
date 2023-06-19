const btn = document.querySelector('.slider')

window.onload=function() {
    if(localStorage.prefersDarkMode=='true') {
        document.querySelectorAll('.header, .footer, .aside, .menu, .main')
            .forEach((element) => { element.classList.toggle('dark-theme') })
        
        document.querySelector('.check').checked=true
    } 
  };

btn.addEventListener('click', function() {
    document.querySelectorAll('.header, .footer, .aside, .menu, .main')
        .forEach((element) => { element.classList.toggle('dark-theme') })
    
    localStorage.prefersDarkMode = (localStorage.prefersDarkMode=='true')?'false':'true'
})