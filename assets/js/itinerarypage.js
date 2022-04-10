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
        var newActivityList = { 0: activity_Obj };
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

    $card = $('<div class="col-sm-5 card">');
    $img = $('<img class="card-img">');
    $img.attr('src', `${activity_Obj.img}`);
    $card.append($img);
    $col_sm_7 = $('<div class="col-sm-7">');
    $name = $(`<h4 class="has-text-weight-bold has-text-white" id="activity-name">${activity_Obj.name}</h4>`);
    $time = $(`<h4 class="has-text-weight-bold has-text-white" id="activity-time">${activity_Obj.time}</h4>`);
    $venue = $(`<h4 class="has-text-weight-bold has-text-white" id="activity-venue">${activity_Obj.venue}</h4>`);
    $address = $(`<h4 class="has-text-weight-bold has-text-white" id="activity-address">${activity_Obj.address}</h4>`);
    $link = $(`<a id="activity-link" type="button" class="m-1 has-text-dark-red has-text-weight-bold button is-light
                         is-small is-responsive" href="${activity_Obj.url}" target="_blank">TICKET LINK</a>`);
    $remove = $(`<a id="activity-link" type="button" class="m-1 has-text-dark-red has-text-weight-bold
                         button is-light is-small is-responsive" href="" target="_blank">REMOVE<span class="oi
                         oi-trash has-text-dark-red m-2 has-background-white"></span></a>`);
    $col_sm_7.append($name);
    $col_sm_7.append($time);
    $col_sm_7.append($venue);
    $col_sm_7.append($address);
    $col_sm_7.append($link);
    $col_sm_7.append($remove);
    $card.append($col_sm_7);

    $('.activity-list').append($card);
}

function buildActivityCard_Brewery(activity_Obj) {
    // $cardDiv = $('<div>').addClass("card");
    // $cardDiv.css({ "width": "800px" });

    // used for adding img's
    // $gutterDiv = $('<div>').addClass('row no-gutters');
    //     $imgDiv = $('<div>').addClass('col-sm-5');
    //         $img = $('<img>').addClass('card-img');
    //         $img.attr("src" , `${activity_Obj.img}`);
    //     $imgDiv.append($img);
    // $gutterDiv.append($imgDiv);

    // $holderDiv = $('<div>').addClass('col-sm-7');
    // $cardBody = $('<div>').addClass('card-body');
    // $name = $(`<p class="text-white" id="activity-name">${activity_Obj.name}</p>`);
    // $time = $(`<p class="text-white" id="activity-time">OPENS AT:<span id="opens">0:00</span> CLOSES AT:<span id="closes">12:00</span></p>`);
    // $brewType = $(`<p class="text-white" id="activity-brew-type">${activity_Obj.brewType}</p>`);
    // $address = $(`<p class="text-white" id="activity-address">${activity_Obj.address}</p>`);
    // $link = $(`<a id="activity-link" href="${activity_Obj.url}" target="_blank">TICKET LINK</a>`);
    // $cardBody.append($name);
    // $cardBody.append($time);
    // $cardBody.append($brewType);
    // $cardBody.append($address);
    // $cardBody.append($link);

    // $holderDiv.append($cardBody);
    // $cardDiv.append($gutterDiv);
    // $cardDiv.append($holderDiv);

    // $('.activity-list').append($cardDiv);

    $div = $(`<div class="col-sm-7 card">`);
    $name = $(`<h4 class="has-text-weight-bold has-text-white" id="activity-name">${activity_Obj.name}</h4>`);
    $brewType = $(`<h4 class="has-text-weight-bold has-text-white" id="activity-time">${activity_Obj.brewType}</h4>`);
    $address = $(`<h4 class="has-text-weight-bold has-text-white" id="activity-address">${activity_Obj.address}</h4>`);
    $phone = $(`<h4 class="has-text-weight-bold has-text-white" id="activity-address">${activity_Obj.phoneNumber}</h4>`);
    $link = $(`<a id="activity-link" type="button" class="m-1 has-text-dark-red has-text-weight-bold button is-light is-small
                    is-responsive"  href="${activity_Obj.url}" target="_blank">WEBSITE</a>`);
    $remove = $(`<a id="activity-link" type="button" class="m-1 has-text-dark-red has-text-weight-bold button is-light is-small
                        is-responsive" href="" target="_blank">REMOVE<span class="oi oi-trash has-text-dark-red m-2 has-background-white"></span></a>`)
    $div.append($name);
    $div.append($brewType);
    $div.append($address);
    $div.append($phone);
    $div.append($link);
    $div.append($remove);

    $('.activity-list').append($div);
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
    var savedItineraries = JSON.parse(localStorage.getItem('savedItineraries'));
    console.log(savedItineraries);
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

