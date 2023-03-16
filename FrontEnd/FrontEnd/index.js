// Appel de l'API

async function fetchWorks() {
  return fetch("http://localhost:5678/api/works")
    .then((r) => r.json())
    .then((data) => data)
    .catch((err) => console.log(err));
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");

  gallery.innerHTML = "";

  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const workDOM = createWorkDOM(work);
    gallery.appendChild(workDOM);
  }
}

function createWorkDOM(work) {
  const figure = document.createElement("figure");
  figure.setAttribute('data-work-id', work.id)
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.setAttribute("src", work.imageUrl);
  img.setAttribute("alt", work.title);

  figcaption.append(work.title);

  figure.appendChild(img);
  figure.appendChild(figcaption);

  return figure;
}

function createCategorieButtons(works) {
  const divCategorie = document.querySelector(".categories");

  const buttonAll = document.createElement("button");
  buttonAll.classList.add("btn-category");
  buttonAll.classList.add("active");
  buttonAll.setAttribute("id", "all");
  buttonAll.innerText = "Tous";

  divCategorie.appendChild(buttonAll);

  let categoriesNames = works.map((work) => work.category.name);

  categoriesNames = new Set(categoriesNames);

  categoriesNames.forEach((category) => {
    const categoryButton = document.createElement("button");

    categoryButton.classList.add("btn-category");

    categoryButton.innerText = category;

    divCategorie.appendChild(categoryButton);
  });
}

function handleCategoryFilter(works) {
  const buttons = document.querySelectorAll(".btn-category");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));

      this.classList.add("active");

      const activeCategoryName = this.innerText;

      const correspondingWorks =
        activeCategoryName == "Tous"
          ? works
          : works.filter((w) => w.category.name == activeCategoryName);

      displayWorks(correspondingWorks);
    });
  });
}

async function main() {
  const works = await fetchWorks();
  displayWorks(works);
  createCategorieButtons(works);
  handleCategoryFilter(works);
}

main();


