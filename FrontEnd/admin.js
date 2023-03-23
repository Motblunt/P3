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

const modalGallery = document.querySelector(".modalGallery")
const modalAjout = document.querySelector("body > div:nth-child(3)")
const btnSelectorAddPhoto = document.querySelector(".input-base")

function openModalAjout() {
    btnSelectorAddPhoto.addEventListener("click", function () {
        modalGallery.style.display = "none"
        modalAjout.style.display = ""

        modalAjout.addEventListener("click", closeModalAjout);
        modalAjout.querySelector(".js-modal-close-ajout").addEventListener("click", closeModalAjout);
        modalAjout
            .querySelector(".js-modal-ajout-stop")
            .addEventListener("click", stopPropagation);

    })
}

// Fonction Retour dans la Modal précédente

const iconsReturn = document.querySelector("#modalAjout > div.modal-headers > i.fa-solid.fa-arrow-left.fa-lg")

function retourModalPrecedente() {
    iconsReturn.addEventListener("click", function () {
        modalGallery.style.display = ""
        modalAjout.style.display = "none"
    })
}

// Fermeture de la Modal Ajout.

const iconClose = document.querySelector("#modalAjout > div.modal-headers > i.fa-solid.fa-xmark.fa-lg.js-modal-close-ajout")
const overlayModal = document.querySelector("body")
iconClose.addEventListener("click", closeModalAjout)

function closeModalAjout() {
    modalAjout.style.display = "none"
}

// Recupération des données saisie par l'utilisateur ( File, Titre et Catégorie ).

document.querySelector("#validate-btn").addEventListener("click", function () {

    const titleId = document.querySelector("#titre-id").value
    const imageId = document.querySelector("#file-id").files[0]
    const categorieId = document.querySelector("#categorie-id").value
    const numberId = parseInt(categorieId[0])
    const categoryName = categorieId[1]

    const formData = new FormData()

    formData.append("image", imageId)
    formData.append("title", titleId)
    formData.append("category", numberId)

    // Appel HTTP avec méthode POST.    

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${window.sessionStorage.token}`,
            Content: 'multipart/form-data',
        },
        body: formData,

    })
        .then(function (response) {
            if (response.ok) {
                alert("Nouveau Projet envoyé avec succès !")

            } else {
                alert("Veuillez renseigner tous les champs!")
            }
        })
})

// Preview de l'image que l'on upload via l'input file.

const fileUploadInput = document.querySelector("#file-id")
const labelUploadInput = document.querySelector("#modalAjout > div.modal-content > form > label")
const pUploadInput = document.querySelector("#modalAjout > div.modal-content > form > p")

fileUploadInput.addEventListener("change", previewFile)

function previewFile() {
    if (this.files.length === 0) {

        return
    }

    const file = this.files[0]

    const fileReader = new FileReader()

    fileReader.readAsDataURL(file)

    fileReader.addEventListener("load", (event) => displayImage(event, file))

}

function displayImage(event, file) {
    const imgElement = document.querySelector("#img-preview")
    imgElement.src = event.target.result
    imgElement.style.height = "169px"
    imgElement.style.width = "139px"
    imgElement.style.objectFit = "cover"
    labelUploadInput.style.display = "none"
    pUploadInput.style.display = "none"
}

function displayWorksModal(works) {
    const galleryModal = document.querySelector(".modal-works")

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
    const arrowIconModal = document.createElement("i")

    arrowIconModal.setAttribute("class", "fa-solid fa-arrows-up-down-left-right position-arrow")

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
                    refreshAfterDelete(work.id)
                }
            })
    })

    imgModal.setAttribute("src", work.imageUrl);

    figcaptionModal.append("éditer");

    divModal.appendChild(figureModal)
    divModal.setAttribute('id', work.title)
    divModal.setAttribute('data-work-id', work.id)

    figureModal.appendChild(imgModal);
    figureModal.appendChild(figcaptionModal);
    figureModal.appendChild(buttonModal)
    figureModal.appendChild(arrowIconModal)

    figureModal.addEventListener("mouseenter", (e) => {
        arrowIconModal.style.visibility = "visible"
    })
    figureModal.addEventListener("mouseleave", (e) => {
        arrowIconModal.style.visibility = "hidden"
    })

    return divModal

}

function refreshAfterDelete(workId) {

    const deletedWorks = document.querySelectorAll(`[data-work-id="${workId}"]`)

    deletedWorks.forEach(dl => dl.remove())

}

async function mainAdmin() {
    const works = await fetchWorks();
    displayWorks(works);
    createCategorieButtons(works);
    handleCategoryFilter(works);
    displayWorksModal(works);
    openModalAjout()
    retourModalPrecedente()
    closeModalAjout()
}

mainAdmin()