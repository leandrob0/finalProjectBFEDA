const eye = document.getElementById('form__password-icon');

eye.addEventListener('click', () => {
    if(eye.src.indexOf('Off') !== -1) {
        eye.src = '../resources/icons/Eye.png';
        eye.previousElementSibling.type = 'password';
    } else {
        eye.src = '../resources/icons/Eye Off.png';
        eye.previousElementSibling.type = 'text';
    }
});