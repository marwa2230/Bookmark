// loading screen
$(function(){
    $('.loader').fadeOut(1000 ,function(){
        $('.loading').slideUp(1000 ,function(){
            $('body').css('overflow','auto');
            $('.loading').remove()
        })
    })
})
 
//side nav

function openSideNav() {
    $(".side-nav-menu").animate({ left: 0 }, 500);
    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");
    
    $(".links li").each((index, element) => {
        $(element).animate({ top: 0 }, (index + 5) * 300);
    });
}

function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate({ left: -boxWidth }, 500);
    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");
    
    $(".links li").animate({ top: 300 }, 200);
}

closeSideNav();

$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") === "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
});


let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");

//fetchandisplaymeals-home
async function fetchAndDisplayMeals() {
    rowData.innerHTML = "";
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    response = await response.json();

    if (response.meals) {
        displayMeals(response.meals);
    } else {
        displayMeals([]);
    }
}

function displayMeals(meals) {
    let mealsHtml = '';
    for (const meal of meals) {
        mealsHtml += `
            <div class="col-md-3">
                <div class="meal-card">
                    <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <button onclick="displayMealDetails(${meal.idMeal})" class="btn btn-primary">Details</button>
                </div>
            </div>`;
    }
    rowData.innerHTML = mealsHtml;
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayMeals);

async function getMealDetails(mealID) {
    closeSideNav()
    rowData.innerHTML = ""
    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();
    displayMealDetails(respone.meals[0])
}


//search
function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 mt-5">
        <div class="col-md-6">
            <input onkeyup="searchByName(this.value)" class="form-control bg-black text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-black text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;
    rowData.innerHTML = "";
}

function handleSearchClick() {
    showSearchInputs();
    closeSideNav();
}

async function searchByName(term) {
    closeSideNav();
    rowData.innerHTML = "";
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await response.json();
        displayMeals(data.meals || []);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function searchByFLetter(term) {
    closeSideNav();
    rowData.innerHTML = "";
    try {
        term = term || "a";
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
        const data = await response.json();
        displayMeals(data.meals || []);
    } catch (error) {
        console.error('Error fetching data:', error);
    } 
}



//Category
async function getCategories() {
    rowData.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()
    searchContainer.innerHTML = "";
    displayCategories(response.categories);
}

function displayCategories(Category) {
    let cartoona = ``;
    for (let i = 0; i < Category.length; i++) {
        cartoona += `<div class="col-md-3">
                        <div onclick="getCategoryMeals('${Category[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                          <img class="w-100" src="${Category[i].strCategoryThumb}" alt="" srcset="">
                            <div class="meal-layer position-absolute text-center text-black p-2">
                               <h3>${Category[i].strCategory}</h3>
                               <p>${Category[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                           </div>
                        </div>
                    </div> `
    }

    rowData.innerHTML = cartoona
}
async function getCategoryMeals(category) {
    rowData.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
}


//AREA
async function getArea() {
    rowData.innerHTML = ""
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    console.log(respone.meals);
    searchContainer.innerHTML = "";
    displayArea(respone.meals)
}


function displayArea(arr) {
    let cartoona = ``;
    for (let i = 0; i < arr.length; i++) {
        cartoona += `<div class="col-md-3">
                        <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                             <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <h3>${arr[i].strArea}</h3>
                        </div>
                     </div> `
    }

    rowData.innerHTML = cartoona
}
async function getAreaMeals(area) {
    rowData.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
}
//intgredient
async function getIngredients() {
    rowData.innerHTML = ""
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    console.log(respone.meals);
    searchContainer.innerHTML = "";
    displayIngredients(respone.meals.slice(0, 20))
}


function displayIngredients(intgredient) {
    let cartoona = ``;
    for (let i = 0; i < intgredient.length; i++) {
        cartoona += `<div class="col-md-3">
                       <div onclick="getIngredientsMeals('${intgredient[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                           <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                           <h3>${intgredient[i].strIngredient}</h3>
                           <p>${intgredient[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                        </div>
                     </div> `
    }

    rowData.innerHTML = cartoona
}
async function getIngredientsMeals(ingredients) {
    rowData.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
}
//contact
function showContacts() {
    rowData.innerHTML = `
    <div class="contact vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" onkeyup="validateInput('name')" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" onkeyup="validateInput('email')" type="email" class="form-control" placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Email not valid *example@yyy.zzz
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" onkeyup="validateInput('phone')" type="text" class="form-control" placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid Phone Number
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" onkeyup="validateInput('age')" type="number" class="form-control" placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid age
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="passwordInput" onkeyup="validateInput('password')" type="password" class="form-control" placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number*
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="repasswordInput" onkeyup="validateInput('repassword')" type="password" class="form-control" placeholder="Re-enter Your Password">
                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Passwords do not match
                    </div>
                </div>
            </div>
            <button id="submitBtn" class="btn text-danger border-danger px-3 mt-3" disabled>Submit</button>
        </div>
    </div>`;

    document.getElementById("submitBtn").addEventListener("click", function() {
        if (inputsValidation()) {
            alert("Form Submitted Successfully!");
        }
    });
}

function validateInput(type) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const ageRegex = /^[1-9][0-9]?$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    let inputElement, alertElement, isValid;

    switch (type) {
        case 'name':
            inputElement = document.getElementById('nameInput');
            alertElement = document.getElementById('nameAlert');
            isValid = nameRegex.test(inputElement.value);
            break;
        case 'email':
            inputElement = document.getElementById('emailInput');
            alertElement = document.getElementById('emailAlert');
            isValid = emailRegex.test(inputElement.value);
            break;
        case 'phone':
            inputElement = document.getElementById('phoneInput');
            alertElement = document.getElementById('phoneAlert');
            isValid = phoneRegex.test(inputElement.value);
            break;
        case 'age':
            inputElement = document.getElementById('ageInput');
            alertElement = document.getElementById('ageAlert');
            isValid = ageRegex.test(inputElement.value);
            break;
        case 'password':
            inputElement = document.getElementById('passwordInput');
            alertElement = document.getElementById('passwordAlert');
            isValid = passwordRegex.test(inputElement.value);
            break;
        case 'repassword':
            inputElement = document.getElementById('repasswordInput');
            alertElement = document.getElementById('repasswordAlert');
            const passwordInput = document.getElementById('passwordInput').value;
            isValid = inputElement.value === passwordInput && passwordInput !== '';
            break;
    }

    if (isValid) {
        alertElement.classList.add('d-none');
    } else {
        alertElement.classList.remove('d-none');
    }

    inputsValidation();
}

function inputsValidation() {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const ageRegex = /^[1-9][0-9]?$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const nameInput = document.getElementById('nameInput').value;
    const emailInput = document.getElementById('emailInput').value;
    const phoneInput = document.getElementById('phoneInput').value;
    const ageInput = document.getElementById('ageInput').value;
    const passwordInput = document.getElementById('passwordInput').value;
    const repasswordInput = document.getElementById('repasswordInput').value;

    const isNameValid = nameRegex.test(nameInput);
    const isEmailValid = emailRegex.test(emailInput);
    const isPhoneValid = phoneRegex.test(phoneInput);
    const isAgeValid = ageRegex.test(ageInput);
    const isPasswordValid = passwordRegex.test(passwordInput);
    const isRepasswordValid = repasswordInput === passwordInput && passwordInput !== '';

    const isValid = isNameValid && isEmailValid && isPhoneValid && isAgeValid && isPasswordValid && isRepasswordValid;

    document.getElementById('submitBtn').disabled = !isValid;

    return isValid;
}


//display meal
function displayMeals(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `<div class="col-md-3">
                        <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                          <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                               <h3>${arr[i].strMeal}</h3>
                            </div>
                        </div>
                    </div>`
    }

    rowData.innerHTML = cartoona
}

//mail details
function displayMealDetails(meal) {
    
    searchContainer.innerHTML = "";
    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = cartoona
}




