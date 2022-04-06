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

// get city input from user
function eventSearch_handleClick() {
    //validate search options with an if statement
    var searchedCity = document.getElementById('city').value.trim();
    var searchedCategory = document.getElementById('category').value.trim();
    var searchedStartDate = document.getElementById('start-date').value.trim();
    var searchedEndDate = document.getElementById('end-date').value.trim();

    if(searchedCity && searchedStartDate && searchedEndDate) {
        var searchOptions = {
            city: searchedCity,
            category: searchedCategory,
            // hard code time into localstartdatetime * * * * * * * * * * * *
            // localStartDateTime=2022-04-10T08:00:00,2022-04-15T20:00:00 --> format for date range --> event.dates.start.dateTime
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
    }
    else {  
        alert("Please enter a city, a start date, and an end date.");
        return;
    }
    
};

function fetchEvent(searchOptions) {
    let ticket_api = `https://app.ticketmaster.com/discovery/v2/events.json?size=20&city=${searchOptions.city}&localStartDateTime=${searchOptions.startDate}T00:00:01,${searchOptions.endDate}T23:59:59&classificationName=${searchOptions.category}&apikey=${ticket_api_key}`;
    fetch(ticket_api)
        .then(data => data.json())
        .then (data => {
            // jd = data;
            console.log(data);
            let events = data._embedded.events;
            events.forEach(event => {
                // prints out in this format: April 11th, 2022 @ 7:30pm
                eventDateTime = moment(`${event.dates.start.dateTime}`).format('MMMM Do, YYYY @ hh:mm a');
                document.querySelector(".results").innerHTML += 
                `<a href="${event.url}" class="card">
                        <img src="${event.images[0].url}">
                        <div class="has-text-weight-bold is-size-4">
                        <h4>Event Name: ${event.name}</h4>
                        <h4>Event Classification: ${event.classifications[0].segment.name}</h4>
                        <h4>Event Date & Time: ${eventDateTime}</h4>
                        <h4>Event Venue: ${event._embedded.venues[0].name}</h4>
                        <h4>Event Address: ${event._embedded.venues[0].address.line1}</h4>
                        <h4>${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode}. ${event._embedded.venues[0].postalCode}</h4>
                        </div>
                    </a>`
            });
        }) 
}


function fetchYelp(yelpSearch_Params) {
    let yelp_api = `https://api.yelp.com/v3/businesses/search/${yelp_api_key}`;
    fetch(yelp_api)
        .then(data => data.json())
        .then(data => {
            console.log(data);
        })
}

fetchYelp();
