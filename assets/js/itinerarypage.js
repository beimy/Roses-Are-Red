//handles event data passing into the itinerary
function selectActivity_handler() {
    //get the activity obj from the data attribute
    var data_str = $(this).offsetParent(".card").data('activity-obj')
    var event_obj = JSON.parse(decodeURIComponent(data_str));
    console.log(event_obj);

    //generate activity object based on type 
    if(event_obj.type == "event") {
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
            city: event_obj._embedded.venues[0].city.name
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
            location: {longitude: event_obj.longitude, latitude: event_obj.latitude},
            phoneNumber: event_obj.phone,
            url: event_obj.url
        }
        console.log(activity_Obj)
        console.log("Activity is resturant")
    }

    //local storage
    localStorage.setItem('active-activity-obj', JSON.stringify(activity_Obj));

    //update current active itinerary or make one if not present
    if(localStorage.getItem('active-itinerary') == null){
        console.log('No active itinerary present, making one');
        tempObj = {1: activity_Obj};
        localStorage.setItem('active-itinerary', JSON.stringify(tempObj));
    }
    else {
        console.log('active itin found, updating');
        tempItin = JSON.parse(localStorage.getItem('active-itinerary'));
        var objectLength = Object.keys(tempItin).length;
        tempItin[(objectLength + 1)] = activity_Obj;
        localStorage.setItem('active-itinerary', JSON.stringify(tempItin));
        console.log(tempItin)
    }
    return activity_Obj;
}

function buildActivityCard_Event(activity_Obj) {
    $cardDiv = $('<div>').addClass("card");
    $cardDiv.css({"width" : "800px"});
    
        $gutterDiv = $('<div>').addClass('row no-gutters');
            $imgDiv = $('<div>').addClass('col-sm-5');
                $img = $('<img>').addClass('card-img');
                $img.attr("src" , `${activity_Obj.img}`);
            $imgDiv.append($img);
        $gutterDiv.append($imgDiv);

        $holderDiv = $('<div>').addClass('col-sm-7');
            $cardBody = $('<div>').addClass('card-body');
                $name = $(`<p id="activity-name">${activity_Obj.name}</p>`).addClass("text-white");
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

        console.log($cardDiv)
        
        $('.activity-list').append($cardDiv);

        

}

function loadLocalItinerary() {
    let itinerary = JSON.parse(localStorage.getItem('active-itinerary'));
    console.log(itinerary);
    
    for(var i = 0; i < Object.keys(itinerary).length; i++){
        buildActivityCard_Event(`${itinerary.keys}`);
    }

    // itinerary.forEach(activity => {
    //     console.log(activity)
    // })
}


loadLocalItinerary();
// buildActivityCard_Event(JSON.parse(localStorage.getItem("active-activity-obj")));
