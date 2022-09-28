function render() {
    localStorage.removeItem('cities');
    /* When the page refresh, it's clear the local storage up. */

    /* Given City by the user */
    var cityPicked = "";
    /* storage */
    var citySearched = JSON.parse(localStorage.getItem("cities")) || [];
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
                var today = data;
                var jumbo = document.getElementById("#fetch");
                var infoJumbo = $("<div>");
                var day = $("#fetch-elm").addClass("date-of");
                var dayOf = $("<h4>").addClass("actual-date").text(date);
                var expCity = $("<p>").addClass("exp-city").text(" Weather for: ").append(cityPicked);
                var degree = $("<p>").addClass("lead").text(Math.round(today.main.temp) + "˚F");
                var humid = $("<p>").addClass("humidity").text("Humidity: " + today.main.humidity + "%");
                var wind = $("<p>").addClass("wind").text("Wind Speed: " + Math.round(today.wind.speed) + " mph");
                var icon = $("<img>").addClass("rounded mx-auto d-block");
                icon.attr("src", "http://openweathermap.org/img/wn/" + today.weather[0].icon + "@2x.png");
                var iconMain = $("<p>").text(today.weather[0].main).addClass("iconexp");
                console.log(today.weather[0].icon);
                $("#fetch").append(infoJumbo.append(day, dayOf, expCity, degree, humid, wind, icon, iconMain));
                $("#one-day").append(jumbo);

                /* Uv Index Function */
                var latitude = today.coord.lat
                var longtitude = today.coord.lon;
                function uvIndex() {
                    const uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longtitude + "&appid=929ca2e9670ab5d91ac901590336e78c";
                    fetch(uvUrl)
                        .then(function (datas) {
                            return datas.json();
                        }).then(function (uvInfo) {
                            console.log(uvInfo.value);
                            var uvIn = $("<p>");
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
}

function fiveDaysApi() {
    const urlRequest = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityPicked + "&units=imperial&appid=45b6598a4a1bd706ba39bf0f2ac2fcf4";

    fetch(urlRequest)
        .then(function (data) {
            return data.json();
        }).then(function (data) {
            $("#fetch-five").empty();
            console.log(data);
            for (var i = 0; i < 40; i += 8) {
                var days = data.list[i];
                /* console.log(data.list[0].dt_txt); */
                var cards = document.getElementById("#fetch-five")
                var cardInit = $("<div>").addClass("col-sm-2 whole");
                var cardDay = $("<h2>").text(days.dt_txt.slice(0, 10));
                /* console.log(data.list[0].main.temp + "˚F"); */
                var degrees = $("<p>").text(Math.round(days.main.temp) + "˚F");
                /* console.log(data.list[0].main.humidity + " %"); */
                var humidity = $("<p>").text("Humidity: " + days.main.humidity + "%");
                /* console.log(data.list[0].wind.speed + " mph"); */
                var wind = $("<p>").text("wind Speed: " + Math.round(days.wind.speed) + " mph");
                var icon = $("<img>");
                icon.attr("src", "http://openweathermap.org/img/wn/" + days.weather[0].icon + "@2x.png");
                $("#fetch-five").append(cardInit.append(cardDay, degrees, icon, humidity, wind));
                $("#five-days").append(cards);