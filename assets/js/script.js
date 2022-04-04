const EVENT_API = `https://www.eventbriteapi.com/v3/users/me/?token=${api_key1}`;

fetch(EVENT_API)
    .then(function(data) {
        return data.json();
    })
    .then(function(response) {
        console.log(response);
    })

$('#start-date-btn').on("click", () =>  {
    document.location.href = "./datebuilder.html";
})

console.log(EVENT_API);