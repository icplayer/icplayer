function AddonEvent_Listener_create() {
    var presenter = function() {};

    var playerController;
    var eventBus;
    var $view;
    var eventsCount = 0;

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

    function getEventTypeAttr(eventName) {
        var eventTypeAttr = '';
        switch (eventName) {
            case 'ValueChanged':
                eventTypeAttr = 'vc';
                break;
            case 'ItemConsumed':
                eventTypeAttr = 'ic';
                break;
            case 'ItemReturned':
                eventTypeAttr = 'ir';
                break;
            case 'ItemSelected':
                eventTypeAttr = 'is';
                break;
            case 'Definition':
                eventTypeAttr = 'de';
                break;
            case 'PageLoaded':
                eventTypeAttr = 'pl';
                break;
        }

        return eventTypeAttr;
    }

    function createEventInfoElement(eventName) {
        var eventDateTime = new Date(),
            eventFormattedDate = eventDateTime.getHours() + ":" +
                eventDateTime.getMinutes() + ":" + eventDateTime.getSeconds(),
            eventInfo = document.createElement('div'),
            eventNameElement = document.createElement('div'),
            eventDate = document.createElement('div'),
            eventTypeAttr = getEventTypeAttr(eventName),
            isVisible = $('.event-listener-filters input[value=' + eventTypeAttr + ']').is(':checked');

        $(eventInfo).addClass('event-info');
        $(eventInfo).attr('eventType', eventTypeAttr);
        $(eventNameElement).addClass('event-name');
        $(eventNameElement).text("Received event of type " + eventName);
        $(eventInfo).append(eventNameElement);

        $(eventDate).text("Date: " + eventFormattedDate);
        $(eventInfo).append(eventDate);

        if (!isVisible) {
            $(eventInfo).hide();
        }

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

    presenter.run = function(view, model){
        eventBus = playerController.getEventBus();

        eventBus.addEventListener('ValueChanged', this);
        eventBus.addEventListener('ItemConsumed', this);
        eventBus.addEventListener('ItemReturned', this);
        eventBus.addEventListener('ItemSelected', this);
        eventBus.addEventListener('Definition', this);
        eventBus.addEventListener('PageLoaded', this);

        $view = $(view);

        $view.find('.event-listener-clear').click(function () {
            eventsCount = 0;
            $view.find('.event-listener-header').text('No events intercepted');
            $view.find('.event-info').remove();
            $(this).hide();
        });

        $view.find('.event-listener-filters input').change(function () {
            var eventType = $(this).val(),
                isChecked = $(this).is(':checked'),
                eventInfoElements = $view.find('.event-listener-body .event-info[eventtype=' + eventType + ']');

            eventInfoElements.each(function () {
                isChecked ? $(this).show() : $(this).hide();
            });
        });
    };

    return presenter;
}