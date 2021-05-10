//get popup element
var popup = document.getElementById('countryPopup');

//get open modal button
var countryId = document.getElementById('country');

//listen for outside click
window.addEventListener('click', clickOutside);

function clickOutside(e) {
    if (e.target == popup) {
        popup.style.display = 'none'
    }
}