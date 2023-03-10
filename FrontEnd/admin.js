let modal = null;

const openModal = function (e) {
    e.preventDefault();
    const modalAjout = document.querySelector("#modal1 > div > div.modal-ajout.js-modal-stop")
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display = null;
    modalAjout.style.display = "none"
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
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
});

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

// #####

function createNewWorkModal() {

    const btnAjout = document.querySelector("#modal1 > div > div:nth-child(1) > div > div.modal-content > input")

    btnAjout.addEventListener("click", function () {

        const modalbackgroundNone = document.querySelector("#modal1 > div > div.modal-2")
        const modalDisplayNone = document.querySelector("#modal1 > div > div:nth-child(1) > div > div.modal-content")
        const modalHeaderDisplayNone = document.querySelector("#modal1 > div > div:nth-child(1) > div > div.modal-header")
        const modalDeux = document.querySelector(".modal-ajout")

        modalbackgroundNone.style.display = 'none'
        modalDisplayNone.style.display = "none"
        modalHeaderDisplayNone.style.display = "none"
        modalDeux.style.display = ""

        let divModalHeaders = document.createElement("div")
        divModalHeaders.setAttribute("class", "modal-headers")

        let iconsModalHeaders = document.createElement('i')
        iconsModalHeaders.setAttribute("class", "fa-solid fa-arrow-left fa-lg")

        let marksModalHeaders = document.createElement('i')
        marksModalHeaders.setAttribute("class", "fa-solid fa-xmark fa-lg js-modal-close-ajout")

        let buttonAdd = document.createElement("button")
        buttonAdd.textContent = "Valider"

        let formModal = document.createElement("form")

        let newH3 = document.createElement("h3")
        newH3.textContent = "Ajout photo"

        let inputFile = document.createElement("input")
        inputFile.setAttribute("type", "file")
        inputFile.setAttribute("id", "file")

        let labelFile = document.createElement('label')
        labelFile.setAttribute("class", "label-file")
        labelFile.setAttribute("for", "file")
        labelFile.textContent = "+ Ajouter photo"

        let pFile = document.createElement("p")
        pFile.textContent = "jpg, png : 4mo max"

        let labelInputTxt = document.createElement("label")
        labelInputTxt.textContent = "Titre"
        labelInputTxt.setAttribute("class", "label-titre")

        let inputsTxt = document.createElement("input")
        inputsTxt.setAttribute("type", "text")

        let inputsTxts = document.createElement("select")
        inputsTxts.setAttribute('class', "optionsFiltre")

        let optionsSelect = document.createElement('option')
        optionsSelect.textContent = "Objets"

        let optionsSelectDeux = document.createElement('option')
        optionsSelectDeux.textContent = "Appartements"

        let optionsSelectTrois = document.createElement('option')
        optionsSelectTrois.textContent = "Hôtels & restaurants"

        let newHr = document.createElement("hr")

        let labelSelect = document.createElement("label")
        labelSelect.textContent = "Catégorie"
        labelSelect.setAttribute("class", "label-select")

        modalDeux.appendChild(divModalHeaders)
        modalDeux.appendChild(newH3)
        modalDeux.appendChild(formModal)
        modalDeux.appendChild(labelInputTxt)
        modalDeux.appendChild(inputsTxt)
        modalDeux.appendChild(labelSelect)
        modalDeux.appendChild(inputsTxts)
        modalDeux.appendChild(newHr)

        inputsTxts.appendChild(optionsSelect)
        inputsTxts.appendChild(optionsSelectDeux)
        inputsTxts.appendChild(optionsSelectTrois)

        modalDeux.appendChild(buttonAdd)

        formModal.append(inputFile)
        formModal.append(labelFile)
        formModal.append(pFile)

        divModalHeaders.appendChild(iconsModalHeaders)
        divModalHeaders.appendChild(marksModalHeaders)

        function closeModalAjout() {
            marksModalHeaders.addEventListener("click", closeModal)
        }

        function testReturn() {
            iconsModalHeaders.addEventListener("click", function () {
                const selectModalContentAjout = document.querySelector("#modal1 > div")
                const backModalContent = document.querySelector("#modal1 > div > div.modal-21")

                selectModalContentAjout.style.display = "none"
                backModalContent.style.display = 'block'
            })
        }
        testReturn()
        closeModalAjout()

    })

}

async function main2() {
    const works = await fetchWorks();
    displayWorks(works);
    createCategorieButtons(works);
    handleCategoryFilter(works);
    displayWorksModal(works)
    createNewWorkModal()

}

main2()