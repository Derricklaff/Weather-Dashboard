/* CallBack function */
function render() {
    localStorage.removeItem('cities');
    /* When the page refresh, it's clear the local storage up. */

    /* Given City by the user */
    let cityPicked = "";
    /* storage */
    let citySearched = JSON.parse(localStorage.getItem("cities")) || [];
    /* actual date */
    const date = moment().format("MMMM Do YYYY");

    /* Daily forecast function */
    function getApi() {
        const requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityPicked + "&units=imperial&appid=929ca2e9670ab5d91ac901590336e78c";

        fetch(requestUrl)
            .then(function (data) {
                return data.json();
            }).then(function (data) {
                console.log(data);
                $("#fetch").empty();
                let today = data;
                let jumbo = document.getElementById("#fetch");
                let infoJumbo = $("<div>");
                let day = $("#fetch-elm").addClass("date-of");
                let dayOf = $("<h4>").addClass("actual-date").text(date);
                let expCity = $("<p>").addClass("exp-city").text(" Weather for: ").append(cityPicked);
                let degree = $("<p>").addClass("lead").text(Math.round(today.main.temp) + "˚F");
                let humid = $("<p>").addClass("humidity").text("Humidity: " + today.main.humidity + "%");
                let wind = $("<p>").addClass("wind").text("Wind Speed: " + Math.round(today.wind.speed) + " mph");
                let icon = $("<img>").addClass("rounded mx-auto d-block");
                icon.attr("src", "http://openweathermap.org/img/wn/" + today.weather[0].icon + "@2x.png");
                let iconMain = $("<p>").text(today.weather[0].main).addClass("iconexp");
                console.log(today.weather[0].icon);
                $("#fetch").append(infoJumbo.append(day, dayOf, expCity, degree, humid, wind, icon, iconMain));
                $("#one-day").append(jumbo);


                /* Uv Index Function */
                let latitude = today.coord.lat
                let longtitude = today.coord.lon;
                function uvIndex() {
                    const uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longtitude + "&appid=929ca2e9670ab5d91ac901590336e78cs";
                    fetch(uvUrl)
                        .then(function (datas) {
                            return datas.json();
                        }).then(function (uvInfo) {
                            console.log(uvInfo.value);
                            let uvIn = $("<p>");
                            uvIn.text("UV index: " + uvInfo.value).addClass("uvdesign");
                            if (uvInfo.value <= 3) {
                                uvIn.addClass("great").text("UVindex: " + uvInfo.value + " / Favorable");
                            } else if (3 > uvInfo.value) {
                                uvIn.addClass("mid").text("UVindex: " + uvInfo.value + " / Moderate");
                            } else if (uvInfo.value < 7) {
                                uvIn.addClass("mid").text("UVindex: " + uvInfo.value + " / Moderate");
                            } else if (uvInfo.value > 7) {
                                uvIn.addClass("high").text("UVindex: " + uvInfo.value + " / Severe");
                            }
                            $("#fetch").append(uvIn);
                        })
                }
                uvIndex();
            })
    }

    /* Five days Forecast Function */
    function fiveDaysApi() {
        const urlRequest = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityPicked + "&units=imperial&appid=45b6598a4a1bd706ba39bf0f2ac2fcf4";

        fetch(urlRequest)
            .then(function (data) {
                return data.json();
            }).then(function (data) {
                $("#fetch-five").empty();
                console.log(data);
                for (let i = 0; i < 40; i += 8) {
                    let days = data.list[i];
                    /* console.log(data.list[0].dt_txt); */
                    let cards = document.getElementById("#fetch-five")
                    let cardInit = $("<div>").addClass("col-sm-2 whole");
                    let cardDay = $("<h2>").text(days.dt_txt.slice(0, 10));
                    /* console.log(data.list[0].main.temp + "˚F"); */
                    let degree = $("<p>").text(Math.round(days.main.temp) + "˚F");
                    /* console.log(data.list[0].main.humidity + " %"); */
                    let humid = $("<p>").text("Humidity: " + days.main.humidity + "%");
                    /* console.log(data.list[0].wind.speed + " mph"); */
                    let wind = $("<p>").text("wind Speed: " + Math.round(days.wind.speed) + " mph");
                    let icon = $("<img>");
                    icon.attr("src", "http://openweathermap.org/img/wn/" + days.weather[0].icon + "@2x.png");
                    $("#fetch-five").append(cardInit.append(cardDay, degree, icon, humid, wind));
                    $("#five-days").append(cards);
                }
            })
    }

    /* City Searched history function that spawns the cities under the submit form */
    function searchedCities() {
        $("#searched").empty();
        for (let i = 0; i < citySearched.length; i++) {
            let el = $("<p class='cities'>");
            el.attr("data", citySearched[i]);
            el.text(citySearched[i]);
            $("#searched").append(el);

        }

    }

    /* Click function, it saves searched cities and runs the forecast app.. */
    $("#submitBtn").on("click", function (event) {
        event.preventDefault();
        cityPicked = $("#given-input").val().trim();

        if (!citySearched.includes(cityPicked)) {
            (citySearched).push(cityPicked);
        }
        if (citySearched.length > 5) {
            citySearched.shift();
        }

        searchedCities();
        getApi();
        fiveDaysApi();
        localStorage.setItem("cities", JSON.stringify(citySearched));
        $("#given-input").val("");
        $("#issues").css('display', 'block');
    });

    searchedCities();

    /* Click function, it gets the cities saved under the submit form and runs the forecast app again */
    $(document).on("click", ".cities", function () {
        cityPicked = $(this).text();
        $(cityPicked).on("click", getApi)
        getApi();
        fiveDaysApi();
    });

}
$(document).ready(render);