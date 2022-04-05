// add click event listener to call search button and run handleClick function
document.getElementById('search').addEventListener('click', handleClick);

// set search history to empty array
searchHistory = [];

// get city input from user
function handleClick() {
    let city = document.getElementById('city').value.trim();
    if (city) {
        fetchEvent(city);
        document.getElementById('city').value = "";
    } else if (!city) {
        alert("Please enter a city.");
        return;
    }
    // set localStorage 
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
    };

    localStorage.setItem("City", JSON.stringify(searchHistory));
};

function fetchEvent(city) {
    let ticket_api = `https://app.ticketmaster.com/discovery/v2/events.json?size=20&city=${city}&apikey=${ticket_api_key}`;
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
            // { const }
        }) 
}