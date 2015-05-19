function AddonEvent_Listener_create() {
    var presenter = function() {};

    var playerController;
    var eventBus;
    var $view;
    var eventsCount = 0;

    presenter.STANDARD_EVENTS = {
        'ValueChanged': 'vc',
        'Definition': 'de',
        'ItemSelected': 'is',
        'ItemConsumed': 'ic',
        'ItemReturned': 'ir',
        'PageLoaded': 'pl',
        'PageAllOK': 'pa',
        'ShowAnswers': 'sa',
        'HideAnswers': 'ha',
        'Done': 'do',
        'AllAttempted': 'aa',
        'NotAllAttempted': 'naa',
        'LimitedCheck': 'lc'
    };

    presenter.setPlayerController = function(controller) {
        playerController = controller;
    };

    function insertEventInfo(eventData, infoElement) {
        for (var eventDataName in eventData) {
            if (!eventData.hasOwnProperty(eventDataName)) continue;

            var element = document.createElement('div');
            $(element).text(eventDataName + ': "' + eventData[eventDataName] + '"');
            $(infoElement).append(element);
        }
    }

    function updateHeader() {
        $view.find('.event-listener-header').text('Intercepted ' + eventsCount + ' events');
    }

    function createEventInfoElement(eventName) {
        var eventDateTime = new Date(),
            eventFormattedDate = eventDateTime.getHours() + ":" +
            eventDateTime.getMinutes() + ":" + eventDateTime.getSeconds(),
            eventInfo = document.createElement('div'),
            eventNameElement = document.createElement('div'),
            eventDate = document.createElement('div');

        $(eventInfo).addClass('event-info');
        $(eventNameElement).addClass('event-name');
        $(eventNameElement).text("Received event of type " + eventName);
        $(eventInfo).append(eventNameElement);

        $(eventDate).text("Date: " + eventFormattedDate);
        $(eventInfo).append(eventDate);

        return eventInfo;
    }

    presenter.onEventReceived = function(eventName, eventData) {
        var eventInfo = createEventInfoElement(eventName);
        insertEventInfo(eventData, eventInfo);

        if (!eventsCount) {
            $view.find('.event-listener-body').html(eventInfo);
            $view.find('.event-listener-clear').show();
        } else {
            $view.find('.event-listener-body .event-info:first').before(eventInfo);
        }

        eventsCount++;
        updateHeader();
    };

    presenter.run = function(view){
        eventBus = playerController.getEventBus();

        $.each(presenter.STANDARD_EVENTS, function(name, _) {
            eventBus.addEventListener(name, presenter);
        });

        $view = $(view);

        $view.find('.event-listener-clear').click(function () {
            eventsCount = 0;
            $view.find('.event-listener-header').text('No events intercepted');
            $view.find('.event-info').remove();
            $(this).hide();
        });
    };

    return presenter;
}