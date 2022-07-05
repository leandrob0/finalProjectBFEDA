const menu = document.querySelector('.menu-sm-devices');
const menuBurguer = document.querySelector('.menu__burguer');
const closeMenu = document.querySelector('.close__cross');

menuBurguer.addEventListener('click', () => menu.style.display = 'block');
closeMenu.addEventListener('click', () => menu.style.display = 'none');