window.onload = function(){
let arrGifs = ["developer", "scientist", "engineer", "farmer", "astronomer"];
let arrOfGifs = [];
//function takes an array of terms and creates buttons
function createButtons(){
    let mainButtonDiv = document.getElementById("gifButtons");
    mainButtonDiv.innerHTML = '';
    arrGifs.forEach(function(element) {
        let newDiv = document.createElement("button");
        newDiv.className = "buttons";
        newDiv.setAttribute("name", element);
        newDiv.textContent = element;
        mainButtonDiv.appendChild(newDiv);
        });
}
//function controls the state of the current image and changes it to still or animate
function controlState(e){
    let target = e.target;
    let currentState = target.getAttribute("state");
    let currentId = target.getAttribute("id");
    if(currentState === "still"){
        let newSrc = target.getAttribute("data-animate");
        document.getElementById(currentId).setAttribute("src", newSrc);
        document.getElementById(currentId).setAttribute("state", "animate");
    }else if(currentState === "animate"){
        let newSrc = target.getAttribute("data-still");
        document.getElementById(currentId).setAttribute("src", newSrc);
        document.getElementById(currentId).setAttribute("state", "still");
    }
   
}
//function takes an element and an array of objects(attributes and values) and assigns them to the element. Making it reusable for later
function addAttributes(element, attributesToAdd){
    for(let i = 0; i < attributesToAdd.length; i++){
        for(let a in attributesToAdd[i]){
        element.setAttribute([a], attributesToAdd[i][a]);
        }
    }
}
//function takes an array of objects that were returned from the API and creates DOM elements
function populateDivs(){
    let divToPopulate = document.getElementById("gifs");
    for(let i = 0; i < arrOfGifs.length; i++){
        let rating = arrOfGifs[i].rating.toUpperCase();
        let stillUrl = arrOfGifs[i].still;
        let animatedUrl = arrOfGifs[i].animate;
        let ratingString = "Rating: " + rating
        let newDiv = document.createElement("div");
        let newPara = document.createElement("p");
        let newImg = document.createElement("img");
        let newText = document.createTextNode("Rating: " + rating);
//I wanted to create a function to handle all the attributes.
        addAttributes(newImg,[{"src": stillUrl}, {"data-still":stillUrl}, {"data-animate": animatedUrl},{"state": "still"}, {"id": animatedUrl}])      
        newImg.addEventListener("click", controlState);
        newPara.appendChild(newText);
        newDiv.setAttribute("class", "imgDivs");   
        newDiv.appendChild(newImg);
        newDiv.appendChild(newPara);
        divToPopulate.appendChild(newDiv);
    }
}
//function captures search term based on clicked button and rating from user, sends out the request to the API, then takes the returned information and creates and object. It then pushes that object into an array; it then
//fires populateDivs to begin manipulation to the DOM
function getGif(e){
    arrOfGifs = [];
    let divToPopulate = document.getElementById("gifs");
    divToPopulate.innerHTML = '';
    let userRating = $("#userRating").val();
    let target = e.target;
    let searchTerm = target.innerText;
    let searchRating = target.innerText;
    let queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=9BBJcRiaZkD6MgeOJZVTrzusykvA2cre&q=" + searchTerm + "&limit=10&rating=" + userRating + "&lang=en";
    $.ajax({url:queryUrl, method: "GET"})
        .done(function(response){
            let arrData = response.data;
            if(arrData.length > 0){
                arrData.forEach(function(e){
                let newObj = {"name": searchTerm, "still":e.images.fixed_height_still.url, "animate":e.images.fixed_height.url, "state":"still", "id": e.id, "rating":e.rating}
                arrOfGifs.push(newObj);
            })
            populateDivs();
            }else{
                divToPopulate.innerHTML = "I'm sorry, something went webkitConvertPointFromNodeToPage. Try a different term maybe?";
            }   
        })
        .fail(function(){
            divToPopulate.innerHTML = "I'm sorry, something went wrong. Try again later";
        })
}
//function captures user inputed term and pushs to array of terms. Then fires off an event to create the buttons
function addNewTerm(){
    event.preventDefault();
    document.getElementById("gifs").innerHTML = '';
    let userTerm = document.getElementById("term").value;
    arrGifs.push(userTerm);
    createButtons();
}
createButtons();
$("#gifButtons").on("click", ".buttons", getGif);
$("#submit").on("click", addNewTerm);
}



