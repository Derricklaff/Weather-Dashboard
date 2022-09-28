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
                    const uvUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longtitude + "&appid=45b6598a4a1bd706ba39bf0f2ac2fcf4";
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
}