// import icons from "../img/icons.svg"; // Parcel 1
import icons from "url:../img/icons.svg"; // Parcel 2
import "core-js/stable"; //  polyfill ES6
import "regenerator-runtime"; // async/awwit polyfill

// DOM Elements
const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const renderRecipe = async () => {
  // Render a loading spinner
  renderSpinner(recipeContainer);
  try {
    // Loads recipe data from api
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    let { recipe } = data.data;
    recipe = {
      ...cleanObject(recipe, "image_url", "source_url", "cooking_time"),
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      cookingTime: recipe.cooking_time,
    };

    console.log(recipe);

    /*
cookingTime: 45
id: "5ed6604591c37cdc054bc886"
image: "http://forkify-api.herokuapp.com/images/FlatBread21of1a180.jpg"
ingredients: (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
publisher: "My Baking Addiction"
servings: 4
sourceUrl: "http://www.mybakingaddiction.com/spicy-chicken-and-pepper-jack-pizza-recipe/"
title: "Spicy Chicken and Pepper Jack Pizza"
*/

    // Renders recipe
    // Builds recipe markup
    const recipeMarkup = `
<figure class="recipe__fig">
  <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
  <h1 class="recipe__title">
    <span>${recipe.title}</span>
  </h1>
</figure>

<div class="recipe__details">
  <div class="recipe__info">
    <svg class="recipe__info-icon">
      <use href="${icons}#icon-clock"></use>
    </svg>
    <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
    <span class="recipe__info-text">minutes</span>
  </div>
  <div class="recipe__info">
    <svg class="recipe__info-icon">
      <use href="${icons}#icon-users"></use>
    </svg>
    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
    <span class="recipe__info-text">servings</span>

    <div class="recipe__info-buttons">
      <button class="btn--tiny btn--increase-servings">
        <svg>
          <use href="${icons}#icon-minus-circle"></use>
        </svg>
      </button>
      <button class="btn--tiny btn--increase-servings">
        <svg>
          <use href="${icons}#icon-plus-circle"></use>
        </svg>
      </button>
    </div>
  </div>

<div class="recipe__user-generated">
  <svg>
    <use href="${icons}#icon-user"></use>
  </svg>
</div>
<button class="btn--round">
  <svg class="">
    <use href="${icons}#icon-bookmark-fill"></use>
  </svg>
</button>
</div>

<div class="recipe__ingredients">
  <h2 class="heading--2">Recipe ingredients</h2>
  <ul class="recipe__ingredient-list">
  ${recipe.ingredients
    .map(
      ({ description, quantity, unit }) => `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      ${quantity ? `<div class="recipe__quantity">${quantity}</div>` : ""}
      <div class="recipe__description">
        ${unit ? `<span class="recipe__unit">${unit}</span>` : ""}
        ${description}
      </div>
    </li>`
    )
    .join("")}
  </ul>
</div>

<div class="recipe__directions">
  <h2 class="heading--2">How to cook it</h2>
  <p class="recipe__directions-text">
    This recipe was carefully designed and tested by
    <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
    directions at their website.
  </p>
  <a
    class="btn--small recipe__btn"
    href="${recipe.sourceUrl}"
    target="_blank"
  >
    <span>Directions</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </a>
</div>`;

    // Clears existing markup
    recipeContainer.innerHTML = "";

    // Appends market to document
    recipeContainer.insertAdjacentHTML("afterbegin", recipeMarkup);
  } catch (error) {
    alert(error.message);
  }
};

renderRecipe();

function renderSpinner(parentEl) {
  // Builds spinner markup
  const spinnerMarkup = `
<div class="spinner">
  <svg>
    <use href="${icons}#icon-loader"></use>
  </svg>
</div>`;

  // Clear existin markup in parent container
  parentEl.innerHTML = "";

  // Appends markup to parent container
  parentEl.insertAdjacentHTML("afterbegin", spinnerMarkup);
}

const cleanObject = (object, ...propsToClean) =>
  Object.entries(object).reduce((acc, [key, value]) => {
    !propsToClean.includes(key) && (acc[key] = value);
    return acc;
  }, {});
