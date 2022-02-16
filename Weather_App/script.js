const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button");
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    // if enter button and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){ //if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position){
    // getting lat and lon of the user device from coords obj
    const {latitude, longitude} = position.coords;
    // Key request for testing --> https://openweathermap.org/ --> My API keys (after registration)
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${"Key"}`;
    fetchData();
    
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city){
    // Key request for testing --> https://openweathermap.org/ --> My API keys (after registration)
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${"Key"}`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    //getting api response and returning it with parsing into js obj and in another
    //then function calling weatherDetails function with passing api result as an argument 
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else{
        // required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src = "Images/Sun.png";
        } else if(id >= 200 && id <= 232) {
            wIcon.src = "Images/Storm.png";
        } else if(id >= 600 && id <= 622) {
            wIcon.src = "Images/Snow.png";
        } else if(id >= 701 && id <= 781) {
            wIcon.src = "Images/Fog.png";
        } else if(id >= 801 && id <= 804) {
            wIcon.src = "Images/Cloud.png"; 
        } else if(id >= 300 && id <= 321) {
            wIcon.src = "Images/Rain.png";
        }


        // pass these values to particular html element
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        inputField.value = "";
        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }

}


arrowBack.addEventListener("click", ()=> {
    wrapper.classList.remove("active");
})