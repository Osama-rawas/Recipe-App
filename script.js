const mealsEl = document.getElementById("meals");
const favoiteContainer = document.getElementById("fav-meals");
const searchBtn = document.getElementById("search");
const searchTerm = document.getElementById("search-term");
const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");
const mealHeaderEl = document.querySelector(".meal-header");
getRandomMeal();
fetchFavMeals();
// localStorage.clear();
async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await resp.json();
  const randomMeal = respData.meals[0];
  console.log(randomMeal);
  addMeal(randomMeal, true);
}
async function getMealById(id) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await resp.json();
  const meal = respData.meals[0];
  return meal;
}
async function getMealBySearch(term) {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const respData = await resp.json();
  const meals = respData.meals;
  return meals;
}

function addMeal(mealData, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
    <div class="meal-header">
    ${random ? `<span class="random">Random Recipe</span>` : ` `}
      <img
        src="${mealData.strMealThumb}"
        alt="${mealData.strMeal}"
      />
    </div>
    <div class="meal-body">
      <h4>${mealData.strMeal}</h4>
      <button class="fav-btn"><i class="fas fa-heart"></i></button>
    </div>
  </div>`;
  const showInfo = meal.querySelector(".meal-header ");

  meal.querySelector(".meal-body .fav-btn").addEventListener("click", (e) => {
    e.target.classList.toggle("active");
    if (e.target.classList.contains("active")) {
      addMealLS(mealData.idMeal);
    } else {
      removeMealLS(mealData.idMeal);
    }

    fetchFavMeals();
  });

  showInfo.addEventListener("click", () => {
    showMealInfo(mealData);
  });
  mealsEl.append(meal);
}
function addMealLS(mealId) {
  const mealIds = getMealLs();
  localStorage.setItem("mealId", JSON.stringify([...mealIds, mealId]));
}
function removeMealLS(mealId) {
  const mealIds = getMealLs();
  localStorage.setItem(
    "mealId",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}
function getMealLs() {
  const mealIds = JSON.parse(localStorage.getItem("mealId"));
  return mealIds === null ? [] : mealIds;
}
async function fetchFavMeals() {
  // clear favorate
  favoiteContainer.innerHTML = "";
  const mealIds = getMealLs();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);
    addMealFav(meal);
  }
}

function addMealFav(mealData) {
  const FavMeal = document.createElement("li");
  FavMeal.innerHTML = `
  <img
              src="${mealData.strMealThumb}"
              alt="${mealData.strMeal}"
            /><span>${mealData.strMeal}</span>
            <button class="clear"><i class="fa fa-close"> </i></button>
      `;
  const showInfo = FavMeal.querySelector("img");
  const btn = FavMeal.querySelector(".clear");
  btn.addEventListener("click", () => {
    removeMealLS(mealData.idMeal);
    fetchFavMeals();

    document.querySelector(".fa-heart").classList.toggle("active");
  });

  showInfo.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  favoiteContainer.appendChild(FavMeal);
}

function showMealInfo(mealData) {
  mealInfoEl.innerHTML = "";
  const mealEl = document.createElement("div");
  const ingredients = [];
  // for ingrediants and measurars
  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }
  mealEl.innerHTML = ` <h2>${mealData.strMeal}</h2>
  <img
    src="${mealData.strMealThumb}"
    alt="${mealData.strMeal}"
  />
  <p>
    ${mealData.strInstructions}
  </p>
  <h3>Ingredients:</h3>
  <ul>
    ${ingredients.map((ing) => ` <li>${ing}</li>`).join("")}
  </ul> `;
  mealInfoEl.appendChild(mealEl);
  mealPopup.classList.remove("hidden");
}
// ---------------------------search-----------

searchBtn.addEventListener("click", async () => {
  mealsEl.innerHTML = " ";
  const search = searchTerm.value;
  getMealBySearch(search);
  const meals = await getMealBySearch(search);
  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
});
// ---------------------------------------------------------

// -----------------------------popup-meal---------------------
popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
{
}
