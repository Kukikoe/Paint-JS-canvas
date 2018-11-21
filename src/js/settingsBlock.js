const contentDropDownThemeElem = document.querySelector(".dropdown-content_theme");
const contentDropDownLangElem = document.querySelector(".dropdown-content_lang");
const btnDropDownElem = document.querySelector(".dropbtn-settings");

const DropDownSetElem = document.querySelector(".dropdown-content-settings");

DropDownSetElem.addEventListener("click", function(event) {
    const DropDownContentThemeElem = document.querySelector(".dropdown-content_theme");
    let target = event.target;
    if(target.dataset.id === "theme") {
        contentDropDownThemeElem.classList.toggle("active");
        contentDropDownLangElem.classList.remove("active");

        DropDownContentThemeElem.addEventListener("click", function(event) {
            let target = event.target;
            if(target.dataset.id === "dark") {
                changeTheme('src/css/dark-theme.css');
            }
            if(target.dataset.id === "light"){
                changeTheme('src/css/light-theme.css');
            }
        });
    }
    if(target.dataset.id === "lang") {
        contentDropDownLangElem.classList.toggle("active");
        contentDropDownThemeElem.classList.remove("active");
    }
});

document.addEventListener("click", function(event) {
    let dropdownBlock = DropDownSetElem.parentElement;
    if (dropdownBlock.classList.contains("active")) {
        let isClosestActive = event.target.closest(".dropdown.active");

        if (!isClosestActive) {
            dropdownBlock.classList.remove("active");
            contentDropDownThemeElem.classList.remove("active");
            contentDropDownLangElem.classList.remove("active");
        }
    }
});

function changeTheme(href) {
    let head  = document.getElementsByTagName('head')[0];
    let cssId = 'theme';  // you could encode the css path itself to generate id..
    if (document.getElementById(cssId)) {

        head.removeChild(document.getElementById(cssId));
    }
    if (!document.getElementById(cssId))
    {
        let link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.media = 'all';
        head.appendChild(link);
    }
}

btnDropDownElem.addEventListener("click", function(event) {
    event.target.closest(".dropdown").classList.toggle("active");
    contentDropDownThemeElem.classList.remove("active");
    contentDropDownLangElem.classList.remove("active");
});
    
