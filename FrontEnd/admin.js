let modal = null;

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = null;
    modal = target;
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal
        .querySelector(".js-modal-stop")
        .addEventListener("click", stopPropagation);

};

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.removeEventListener("click", closeModal);
    modal
        .querySelector(".js-modal-close")
        .removeEventListener("click", closeModal);
    modal
        .querySelector(".js-modal-stop")
        .removeEventListener("click", stopPropagation);

    modal = null;
}

const stopPropagation = function (e) {
    e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
});

// Ouverture de la modal Ajout suite au click du bouton Ajouter une photo
const modalGallery = document.querySelector(".modal-un")
const modalAjout = document.querySelector("body > div:nth-child(3)")
const btnSelectorAddPhoto = document.querySelector(".input-base")

function openModalAjout() {
    btnSelectorAddPhoto.addEventListener("click", function () {
        modalGallery.style.display = "none"
        modalAjout.style.display = ""
    })
}

// Fonction Retour dans la Modal précédente

const iconsReturn = document.querySelector("#modal2 > div.modal-headers > i.fa-solid.fa-arrow-left.fa-lg")

function retourModalPrecedente() {
    iconsReturn.addEventListener("click", function () {
        modalGallery.style.display = ""
        modalAjout.style.display = "none"
    })
}

// Fermeture de la Modal Ajout

const iconClose = document.querySelector("#modal2 > div.modal-headers > i.fa-solid.fa-xmark.fa-lg.js-modal-close-ajout")
const overlayModal = document.querySelector("body")

function closeModalAjout() {
    iconClose.addEventListener("click", function () {
        modalAjout.style.display = "none"
    })
}


function displayWorksModal(works) {
    const galleryModal = document.querySelector(".modal-gallery")

    galleryModal.innerHTML = "";

    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const workModaleDOM = createWorkModaleDOM(work);
        galleryModal.appendChild(workModaleDOM);
    }
}

function createWorkModaleDOM(work) {

    const divModal = document.createElement("div")
    const figureModal = document.createElement("figure");
    const imgModal = document.createElement("img");
    const buttonModal = document.createElement("button")
    const figcaptionModal = document.createElement("figcaption");

    buttonModal.setAttribute("class", "fa-solid fa-trash-can fa-xs");
    buttonModal.setAttribute('id', 'deleteBtn')

    buttonModal.addEventListener("click", function () {
        fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${window.sessionStorage.token}`,
            },
        })
            .then(response => {
                if (response.ok) {
                    alert("Projet supprimé avec succès !");
                    displayWorksModal(work);
                    createWorkModaleDOM()

                }
            })
    })

    imgModal.setAttribute("src", work.imageUrl);

    figcaptionModal.append("éditer");

    divModal.appendChild(figureModal)
    divModal.setAttribute('id', work.title)

    figureModal.appendChild(imgModal);
    figureModal.appendChild(figcaptionModal);
    figureModal.appendChild(buttonModal)

    return divModal

}


async function main2() {
    const works = await fetchWorks();
    displayWorks(works);
    createCategorieButtons(works);
    handleCategoryFilter(works);
    displayWorksModal(works);
    openModalAjout()
    retourModalPrecedente()
    closeModalAjout()
}

main2()