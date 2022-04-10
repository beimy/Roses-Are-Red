// add click event listener to call search button and run handleClick function
// document.getElementById('search').addEventListener('click', eventSearch_handleClick);

// set datepicker defaults globally
$.datepicker.setDefaults($.datepicker.regional['nl']);
$.datepicker.setDefaults({ dateFormat: 'yy-mm-dd' });

// start-date date picker
$("#start-date").datepicker({
    changeMonth: true,
    changeYear: true
});

// end-date date picker
$("#end-date").datepicker({
    changeMonth: true,
    changeYear: true
});

// get inputs from user
function eventSearch_handleClick() {
    // create variables for input fields
    var searchedCity = document.getElementById('city').value.trim();
    var searchedCategory = document.getElementById('category').value.trim();
    var searchedStartDate = document.getElementById('start-date').value.trim();
    var searchedEndDate = document.getElementById('end-date').value.trim();

    var activitySelector = document.querySelector('input[name="event-click"]:checked').value;

    //pull all user entered data from search fields and pass into generateSearchParams
    generateSearchParams(activitySelector, searchedCity, searchedCategory, searchedStartDate, searchedEndDate);

    // if (activitySelector == "events" && searchedCity && searchedStartDate && searchedEndDate) {
    //     var searchOptions = {
    //         city: searchedCity,
    //         category: searchedCategory,
    //         startDate: searchedStartDate,
    //         endDate: searchedEndDate,
    //         lastActivityTypeSearched: activitySelector
    //     }
    //     saveSearchParam(searchOptions);
    //     alterSearchSwapper();
    //     fetchEvent(searchOptions);
    //     document.getElementById('city').value = "";
    //     document.getElementById('category').value = "";
    //     document.getElementById('start-date').value = "";
    //     document.getElementById('end-date').value = "";
    //     $(".hero").addClass("hide");
    // } else if (activitySelector == "breweries" && searchedCity && searchedStartDate) {
    //     var searchOptions = {
    //         city: searchedCity,
    //         startDate: searchedStartDate,
    //         lastActivityTypeSearched: activitySelector
    //     }
    //     saveSearchParam(searchOptions);
    //     alterSearchSwapper();
    //     fetchBrew(searchOptions);
    //     document.getElementById('city').value = "";
    //     document.getElementById('category').value = "";
    //     document.getElementById('start-date').value = "";
    //     document.getElementById('end-date').value = "";
    //     $(".hero").addClass("hide");
    // } else {
    //     // please enter required input field modal
    //     const modalSearch = document.querySelector('#search');
    //     const modalBg = document.querySelector('.modal-background');
    //     const modal = document.querySelector('.modal');

    //     modalSearch.addEventListener('click', () => {
    //         modal.classList.add('is-active');
    //     });

    //     modalBg.addEventListener('click', () => {
    //         modal.classList.remove('is-active');
    //     });
    // }
};

//takes 1 string for activity type, and 4 for search params
function generateSearchParams(activitySelector, searchedCity, searchedCategory, searchedStartDate, searchedEndDate) {

    if (activitySelector == "events" && searchedCity && searchedStartDate && searchedEndDate) {
        console.log('here?')
        var searchOptions = {
            city: searchedCity,
            category: searchedCategory,
            startDate: searchedStartDate,
            endDate: searchedEndDate,
            lastActivityTypeSearched: activitySelector
        }
        saveSearchParam(searchOptions);
        alterSearchSwapper();
        fetchEvent(searchOptions);
        document.getElementById('city').value = "";
        document.getElementById('category').value = "";
        document.getElementById('start-date').value = "";
        document.getElementById('end-date').value = "";
        $(".hero").addClass("hide");
    } else if (activitySelector == "breweries" && searchedCity && searchedStartDate) {
        console.log('or herer?')
        var searchOptions = {
            city: searchedCity,
            startDate: searchedStartDate,
            lastActivityTypeSearched: activitySelector
        }
        saveSearchParam(searchOptions);
        alterSearchSwapper();
        fetchBrew(searchOptions);
        document.getElementById('city').value = "";
        document.getElementById('category').value = "";
        document.getElementById('start-date').value = "";
        document.getElementById('end-date').value = "";
        $(".hero").addClass("hide");
    } else {
        // please enter required input field modal
        const modalSearch = document.querySelector('#search');
        const modalBg = document.querySelector('.modal-background');
        const modal = document.querySelector('.modal');

        modalSearch.addEventListener('click', () => {
            modal.classList.add('is-active');
        });

        modalBg.addEventListener('click', () => {
            modal.classList.remove('is-active');
        });
    }
}

function fetchEvent(searchOptions) {
    // fetch event data from ticket master api
    let ticket_api = `https://app.ticketmaster.com/discovery/v2/events.json?size=20&city=${searchOptions.city}&localStartDateTime=${searchOptions.startDate}T00:00:01,${searchOptions.endDate}T23:59:59&classificationName=${searchOptions.category}&apikey=${ticket_api_key}`;
    fetch(ticket_api)
        .then(data => data.json())
        .then(data => {
            let events = data._embedded.events;
            events.forEach(event => {
                console.log(event);
                eventDateTime = moment(`${event.dates.start.dateTime}`).format('MMMM Do, YYYY @ hh:mm a');
                document.querySelector(".event-results").innerHTML +=
                    `<div class="card" data-activity-obj=${encodeURIComponent(JSON.stringify(event))}>
                        <img src="${event.images[0].url}">
                        <div class="has-background-white is-size-6">
                        <h4><span class="has-text-dark-red has-background-white">Event Name:</span> ${event.name}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Event Classification:</span> ${event.classifications[0].segment.name}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Event Date & Time:</span> ${eventDateTime}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Event Venue:</span> ${event._embedded.venues[0].name}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Event Address:</span> ${event._embedded.venues[0].address.line1}</h4>
                        <h4>${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode}. ${event._embedded.venues[0].postalCode}</h4>
                        <a type="button" class="m-1 has-text-dark-red has-text-weight-bold button is-dark is-small is-responsive" href=${event.url} target="_blank">Get Tickets Here</a>
                        <a type="button" class="m-1 activity-select-btn button is-dark is-small is-responsive has-text-weight-bold" role="link" id="add-to-itinerary-btn">Add To Itinerary</a>
                        </div>
                    </div>`
            });
        })
};

function fetchBrew(searchOptions) {
    // fetch lat and lon from open weather map api
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${searchOptions.city}&limit=1&appid=${api_key}`
    fetch(url)
        .then(data => data.json())
        .then(data => {
            const { lat, lon } = data[0];

            // fetch brewery data from open brewery db api
            let brew_api = `https://api.openbrewerydb.org/breweries?by_city=${searchOptions.city}&by_dist=${lat},${lon}&per_page=20`
            fetch(brew_api)
                .then(data => data.json())
                .then(data => {
                    for (var i = 0; i <= data.length - 1; i++) {
                        console.log(data[i])
                        document.querySelector(".brew-results").innerHTML +=
                            `<div class="card" data-activity-obj=${encodeURIComponent(JSON.stringify(data[i]))}>
                        <div class="has-background-white is-size-6">
                        <h4><span class="has-text-dark-red has-background-white">Brewery Name:</span> ${data[i].name}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Type:</span> ${data[i].brewery_type}</h4>   
                        <h4><span class="has-text-dark-red has-background-white">Address:</span> ${data[i].street}, ${data[i].city}, ${data[i].state}. ${data[i].postal_code}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Phone Number:</span> ${data[i].phone}</h4> 
                        <a type="button" class="m-1 has-text-dark-red has-text-weight-bold button is-dark is-small is-responsive" href="${data[i].website_url}" target="_blank">Brewery Site</a>
                        <a type="button" class="m-1 activity-select-btn button is-dark is-small is-responsive has-text-weight-bold" id="add-to-itinerary-btn">Add To Itinerary</a>
                        </div>
                    </div>`
                    }
                });
        });
}

//save search options into local storage
function saveSearchParam(searchOptions) {
    localStorage.setItem('currentSearchParams', JSON.stringify(searchOptions));
}

//reveals and hides the search dropdown always calls populateSwapper
function alterSearchSwapper() {
    $swapperDiv = $('#hide-swapper');
    if($swapperDiv.hasClass('hide')) {
        $swapperDiv.removeClass('hide');
    }
    // else{$swapperDiv.addClass('hide')}

    populateSwapper();
}



//handles the text of the search by dropdown
function populateSwapper() {
    var lastSearch = JSON.parse(localStorage.getItem('currentSearchParams')).lastActivityTypeSearched;
    $('#dropdown-search').html(`${lastSearch}`);

    $('#datebuilder-dropdown').empty();

    //add terms to this array when adding api's to search 
    var searchTermsArr = ['events', 'breweries'];
    //loop through all activity types and append them as buttons to the dropdown
    searchTermsArr.forEach(term => {
        if(lastSearch != term){
            $newButton = $(`<a type="button">${term}</a>`);
            $newButton.on('click', swapperBtn_handler)
            $('#datebuilder-dropdown').append($newButton);
        }
    });
}

//researches the appropriate API from saved searchOptions
function swapperBtn_handler() {
    var activityType = $(this).html()
    var searchOptions = JSON.parse(localStorage.getItem('currentSearchParams'));
    console.log(searchOptions)

    if(activityType == 'events'){
        $('.event-results').empty();
        $('.brew-results').empty();
        generateSearchParams(activityType, searchOptions.city, searchOptions.category, searchOptions.startDate, searchOptions.startDate);
    }
    if(activityType == 'breweries'){
        $('.event-results').empty();
        $('.brew-results').empty();
        generateSearchParams(activityType, searchOptions.city, searchOptions.category, searchOptions.startDate, searchOptions.startDate);
    }

    // generateSearchParams(activityType, searchOptions.searchedCity, searchOptions.searchedCategory, searchOptions.searchedStartDate, searchOptions.searchedEndDate);
}

// click listeners for category options 
document.getElementById('arts').addEventListener("click", function () {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Arts & Theatre";
});

document.getElementById('concerts').addEventListener("click", function () {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Concerts";
});

document.getElementById('family').addEventListener("click", function () {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Family";
});

document.getElementById('film').addEventListener("click", function () {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Film";
});

document.getElementById('music').addEventListener("click", function () {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Music";
});

document.getElementById('sports').addEventListener("click", function () {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Sports";
});

// hide and unhide input fields depending on which type of activity is selected
$(document).on("click", "#events", () => {
    $(".category-unhide").removeClass("hide");
    $(".category-unhide").addClass("input-box");
    $(".end-date").removeClass("hide");
    $(".radio-wrapper").find("label[for='breweries']").removeClass("has-text-dark-red has-text-weight-bold");
    $(".radio-wrapper").find("label[for='events']").addClass("has-text-dark-red has-text-weight-bold");
});

$(document).on("click", "#breweries", () => {
    $(".category-unhide").addClass("hide");
    $(".category-unhide").removeClass("input-box");
    $(".end-date").addClass("hide");
    $(".radio-wrapper").find("label[for='events']").removeClass("has-text-dark-red has-text-weight-bold");
    $(".radio-wrapper").find("label[for='breweries']").addClass("has-text-dark-red has-text-weight-bold");
});

// refreshes page when new search button clicked
$(document).on("click", "#reload-input-hero", () => {
    location.reload();
});

$(document).on("click", '.activity-select-btn', selectActivity_handler);

$(document).on('click', '.modal-background', () => {
    $('.modal').removeClass('is-active');
});

$(document).on('click', '#itinerary-page', () => {
    saveActiveItinerary();
})

