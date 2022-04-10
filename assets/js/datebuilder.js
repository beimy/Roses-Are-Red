function popActivityModal(event_obj) {
    event_obj = event_obj;
    document.querySelector("body").innerHTML +=
        `<div class="modal is-active">
            <div class="modal-background"></div>
                <div class="modal-content">
                    <h1 class="has-text-white has-text-weight-bold is-size-1">
                    You added an Activity to your Itinerary</h1>
            </div>
        </div>`

    let modalSearch = document.querySelector('#add-to-itinerary-btn');
    let modalBg = document.querySelector('.modal-background');
    let modal = document.querySelector('.modal');

    buildActivityObj(event_obj);
}





        