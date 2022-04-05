// add click event listener to call search button and run handleClick function
document.getElementById('search').addEventListener('click', handleClick);

// set search history to empty array
searchHistory = [];

// get city input from user
function handleClick() {
    var searchOptions = {
        city: document.getElementById('city').value.trim(),
        category: document.getElementById('category').value.trim(),
        // localStartDateTime=2022-04-10T08:00:00,2022-04-15T20:00:00 --> format for date range --> event.dates.start.dateTime
        date: document.getElementById('date').value.trim()
    }

    if (searchOptions) {
        fetchEvent(searchOptions);
        document.getElementById('city').value = "";
        document.getElementById('category').value = "";
        document.getElementById('date').value = "";
        // fix else if statement to alert when city and date are not inputted * * * * * * * * * * *
    } else if (!searchOptions) {
        alert("Please enter a city and a date.");
        return;
    }
    // set localStorage 
    if (!searchHistory.includes(searchOptions)) {
        searchHistory.push(searchOptions);
    };

    localStorage.setItem("City", JSON.stringify(searchHistory));
};

function fetchEvent(searchOptions) {
    let ticket_api = `https://app.ticketmaster.com/discovery/v2/events.json?size=20&city=${searchOptions.city}&localStartDateTime=${searchOptions.date}&classificationName=${searchOptions.category}&apikey=${ticket_api_key}`;
    fetch(ticket_api)
        .then(data => data.json())
        .then (data => {
            jd = data;
            console.log(data);
            let events = data._embedded.events;
            events.forEach(event => {
                eventDate = moment(`${event.dates.start.localDate}`).format('MMMM Do, YYYY');
                document.querySelector(".results").innerHTML += `
                    <a href="${event.url}" class="card" >
                        <img src="${event.images[0].url}"
                        <h4>Event Name: ${event.name}</h4>
                        <h4>Event Classification: ${event.classifications[0].segment.name}</h4>
                        <h4>Event Date: ${eventDate}</h4>
                        <h4>Event Time: ${event.dates.start.localTime}</h4>
                        <h4>Event Venue: ${event._embedded.venues[0].name}</h4>
                        <h4>Event Address: ${event._embedded.venues[0].address.line1}</h4>
                        <h4>${event._embedded.venues[0].city.name}, ${event._embedded.venues[0].state.stateCode}. ${event._embedded.venues[0].postalCode}</h4>
                    </a>
                `
            });
        }) 
}