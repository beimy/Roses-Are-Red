//handles event data passing into the itinerary
function selectActivity_handler() {
    //get the activity obj from the data attribute
    var data_str = $(this).offsetParent(".card").data('activity-obj')
    var event_obj = JSON.parse(decodeURIComponent(data_str));
    console.log(event_obj);

    //generate activity object based on type 
    if (event_obj.type == "event") {
        var activity_Obj = {
            name: event_obj.name,
            id: event_obj.id,
            date: event_obj.dates.start.localDate,
            time: event_obj.dates.start.localTime,
            venue: event_obj._embedded.venues[0].name,
            address: event_obj._embedded.venues[0].address.line1,
            location: event_obj._embedded.venues[0].location,
            url: event_obj._embedded.venues[0].url,
            type: 'event',
            img: event_obj.images[0].url,
            city: event_obj._embedded.venues[0].city.name,
            activityDate: JSON.parse(localStorage.getItem('currentSearchParams')).startDate
        };
        console.log(activity_Obj);
    }
    else {
        var activity_Obj = {
            name: event_obj.name,
            id: event_obj.id,
            date: '',
            time: '',
            address: event_obj.street,
            city: event_obj.city,
            location: { longitude: event_obj.longitude, latitude: event_obj.latitude },
            phoneNumber: event_obj.phone,
            url: event_obj.url,
            brewType: event_obj.brewery_type,
            type: 'brewery',
            activityDate: JSON.parse(localStorage.getItem('currentSearchParams')).startDate
        }
        console.log(activity_Obj)
        console.log("Activity is resturant")
    }
    
    //Save activity into active itinerary
    saveActivityToItinerary(activity_Obj);

    return activity_Obj;
}


function saveActivityToItinerary(activity_Obj) {
    //save activity to local storage
    localStorage.setItem('active-activity-obj', JSON.stringify(activity_Obj));

    //update current active itinerary or make one if not present
    if (localStorage.getItem('active-itinerary') == null) {
        console.log('No active itinerary present, making one');
        var newActivityList = {0 : activity_Obj};
        localStorage.setItem('active-itinerary', JSON.stringify(newActivityList));
    }
    else {
        console.log('active itin found, updating');
        tempItin = JSON.parse(localStorage.getItem('active-itinerary'));
        var tempItinLength = Object.keys(tempItin).length;
        tempItin[`${tempItinLength}`] = activity_Obj;
        localStorage.setItem('active-itinerary', JSON.stringify(tempItin));
    }
}

//functions for building cards based on their activity type
function buildActivityCard_Event(activity_Obj) {
    $cardDiv = $('<div>').addClass("card");
    $cardDiv.css({ "width": "800px" });

    $gutterDiv = $('<div>').addClass('row no-gutters');
    $imgDiv = $('<div>').addClass('col-sm-5');
    $img = $('<img>').addClass('card-img');
    $img.attr("src", `${activity_Obj.img}`);
    $imgDiv.append($img);
    $gutterDiv.append($imgDiv);

    $holderDiv = $('<div>').addClass('col-sm-7');
    $cardBody = $('<div>').addClass('card-body');
    $name = $(`<p class="text-white" id="activity-name">${activity_Obj.name}</p>`);
    $time = $(`<p class="text-white" id="activity-time">${activity_Obj.time}</p>`);
    $venue = $(`<p class="text-white" id="activity-venue">${activity_Obj.venue}</p>`);
    $address = $(`<p class="text-white" id="activity-address">${activity_Obj.address}</p>`);
    $link = $(`<a id="activity-link" href="${activity_Obj.url}" target="_blank">TICKET LINK</a>`);
    $cardBody.append($name);
    $cardBody.append($time);
    $cardBody.append($venue);
    $cardBody.append($address);
    $cardBody.append($link);

    $holderDiv.append($cardBody);
    $cardDiv.append($gutterDiv);
    $cardDiv.append($holderDiv);

    $('.activity-list').append($cardDiv);
}

function buildActivityCard_Brewery(activity_Obj) {
    $cardDiv = $('<div>').addClass("card");
    $cardDiv.css({ "width": "800px" });

    //used for adding img's
    // $gutterDiv = $('<div>').addClass('row no-gutters');
    //     $imgDiv = $('<div>').addClass('col-sm-5');
    //         $img = $('<img>').addClass('card-img');
    //         $img.attr("src" , `${activity_Obj.img}`);
    //     $imgDiv.append($img);
    // $gutterDiv.append($imgDiv);

    $holderDiv = $('<div>').addClass('col-sm-7');
    $cardBody = $('<div>').addClass('card-body');
    $name = $(`<p class="text-white" id="activity-name">${activity_Obj.name}</p>`);
    $time = $(`<p class="text-white" id="activity-time">OPENS AT:<span id="opens">0:00</span> CLOSES AT:<span id="closes">12:00</span></p>`);
    $brewType = $(`<p class="text-white" id="activity-brew-type">${activity_Obj.brewType}</p>`);
    $address = $(`<p class="text-white" id="activity-address">${activity_Obj.address}</p>`);
    $link = $(`<a id="activity-link" href="${activity_Obj.url}" target="_blank">TICKET LINK</a>`);
    $cardBody.append($name);
    $cardBody.append($time);
    $cardBody.append($brewType);
    $cardBody.append($address);
    $cardBody.append($link);

    $holderDiv.append($cardBody);
    // $cardDiv.append($gutterDiv);
    $cardDiv.append($holderDiv);

    $('.activity-list').append($cardDiv);
}

function loadLocalItinerary() {
    let itinerary = JSON.parse(localStorage.getItem('active-itinerary'));

    var i = 0;
    for (var activity in itinerary) {
        if (itinerary.hasOwnProperty(activity)) {
            if (itinerary[i].type == 'event') {
                buildActivityCard_Event(itinerary[i])
                console.log('building event card');
            }
            else if (itinerary[i].type == 'brewery') {
                buildActivityCard_Brewery(itinerary[i]);
                console.log('building brewery card');
            }
            else { console.log('type returned wrong') };
        }
        i++;
    }
}

// Currently local storage is not taking the date key names set below. Gotta figure out why. Also have to add dates to itineraries
// if there is already saved itineraries.

function saveActiveItinerary() {
    activeItin = JSON.parse(localStorage.getItem('active-itinerary'));
    if (localStorage.getItem('savedItineraries') === null || localStorage.getItem('savedItineraries') == 'null') {
        console.log('no saved itineraries found, creating key');
        var newItineraryList = {};
        var keyName = JSON.parse(localStorage.getItem('currentSearchParams')).startDate;
        newItineraryList[`${keyName}`] = activeItin;
        localStorage.setItem('savedItineraries', JSON.stringify(newItineraryList));
        
    }
    else {
        console.log('saved itineraries found, appending active itinerary');
        tempItinList = JSON.parse(localStorage.getItem('savedItineraries'));
        var currentListLength = Object.keys(tempItinList).length;
        var keyName = JSON.parse(localStorage.getItem('currentSearchParams')).startDate;
        tempItinList[`${keyName}`] = activeItin; 
        localStorage.setItem('savedItineraries', JSON.stringify(tempItinList));
    }
    
}



function loadSavedItinerary() {

}

loadLocalItinerary();

//place in more contextual areas
saveActiveItinerary();


const modalSearch = document.querySelector('#warning');
        const modalBg = document.querySelector('.modal-background');
        const modal = document.querySelector('.modal');

        modalSearch.addEventListener('click', () => {
            modal.classList.add('is-active');
        });

        modalBg.addEventListener('click', () => {
            modal.classList.remove('is-active');
        });

