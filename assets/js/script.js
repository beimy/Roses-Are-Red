// add click event listener to call search button and run handleClick function
document.getElementById('search').addEventListener('click', eventSearch_handleClick);

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

// set search history to empty array
searchHistory = [];

// get inputs from user
function eventSearch_handleClick() {
    // create variables for input fields
    var searchedCity = document.getElementById('city').value.trim();
    var searchedCategory = document.getElementById('category').value.trim();
    var searchedStartDate = document.getElementById('start-date').value.trim();
    var searchedEndDate = document.getElementById('end-date').value.trim();

    // validate search options with an if statement
    if(searchedCity && searchedStartDate && searchedEndDate) {
        var searchOptions = {
            city: searchedCity,
            category: searchedCategory,
            startDate: searchedStartDate,
            endDate: searchedEndDate
        }
        fetchEvent(searchOptions);
        document.getElementById('city').value = "";
        document.getElementById('category').value = "";
        document.getElementById('start-date').value = "";
        document.getElementById('end-date').value = "";

        if (!searchHistory.includes(searchOptions)) {
            searchHistory.push(searchOptions);
        };
    
        localStorage.setItem("City", JSON.stringify(searchHistory));
    } else {  
        alert("Please enter a city, a start date, and an end date.");
        return;
    }
};

function fetchEvent(searchOptions) {
    // fetch event data from ticket master api
    let ticket_api = `https://app.ticketmaster.com/discovery/v2/events.json?size=20&city=${searchOptions.city}&localStartDateTime=${searchOptions.startDate}T00:00:01,${searchOptions.endDate}T23:59:59&classificationName=${searchOptions.category}&apikey=${ticket_api_key}`;
    fetch(ticket_api)
        .then(data => data.json())
        .then (data => {
            let events = data._embedded.events;
            events.forEach(event => {
                eventDateTime = moment(`${event.dates.start.dateTime}`).format('MMMM Do, YYYY @ hh:mm a');
                document.querySelector(".event-results").innerHTML += 
                `<a href="${event.url}" class="card">
                        <img src="${event.images[0].url}">
                        <div class="is-size-6">
                        <h4><span class="has-text-dark-red has-background-white">Event Name:</span> ${event.name}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Event Classification:</span> ${event.classifications[0].segment.name}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Event Date & Time:</span> ${eventDateTime}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Event Venue:</span> ${event._embedded.venues[0].name}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Event Address:</span> ${event._embedded.venues[0].address.line1}</h4>
                        <h4>${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode}. ${event._embedded.venues[0].postalCode}</h4>
                        </div>
                    </a>`
            });
        }) 
    
    // fetch lat and lon from open weather map api
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${searchOptions.city}&limit=1&appid=${api_key}`
    fetch(url)
        .then(data => data.json())
        .then(data => {
            const { lat, lon } = data[0];

    // fetch brewery data from open brewery db api
    let brew_api = `https://api.openbrewerydb.org/breweries?by_city=${searchOptions.city}&by_dist=${lat},${lon}&per_page=10`
    fetch(brew_api)
        .then(data => data.json())
        .then (data => {
            for (var i = 0; i <= data.length - 1; i++) {
                console.log(data[i])
                document.querySelector(".brew-results").innerHTML += 
                `<a href="${data[i].website_url}" class="card">
                        <div class="is-size-6">
                        <h4><span class="has-text-dark-red has-background-white">Brewery Name:</span> ${data[i].name}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Type:</span> ${data[i].brewery_type}</h4>   
                        <h4><span class="has-text-dark-red has-background-white">Address:</span> ${data[i].street}, ${data[i].city}, ${data[i].state}. ${data[i].postal_code}</h4>
                        <h4><span class="has-text-dark-red has-background-white">Phone Number:</span> ${data[i].phone}</h4>    
                        </div>
                    </a>`
            }
        });
    }); 
};

// click listeners for category options 
document.getElementById('arts').addEventListener("click", function() {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Arts & Theatre";
});

document.getElementById('concerts').addEventListener("click", function() {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Concerts";
});

document.getElementById('family').addEventListener("click", function() {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Family";
});

document.getElementById('film').addEventListener("click", function() {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Film";
});

document.getElementById('music').addEventListener("click", function() {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Music";
});

document.getElementById('sports').addEventListener("click", function() {
    document.getElementById('category').value = "";
    document.getElementById('category').value = "Sports";
});

// function fetchYelp(yelpSearch_Params) {
//     let yelp_api = `https://api.yelp.com/v3/businesses/search/${yelp_api_key}`;
//     fetch(yelp_api)
//         .then(data => data.json())
//         .then(data => {
//             console.log(data);
//         })
// }

// fetchYelp();
