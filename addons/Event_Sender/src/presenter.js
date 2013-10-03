function AddonEvent_Sender_create() {
    var presenter = function () {};
    presenter.playerController = null;

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
    };

    presenter.run = function(view, model) {
        $(view).find('.event-sender-table button').click(function() {
            var eventData = {
                    source: $(view).find('.event-sender-table #source').val(),
                    item: $(view).find('.event-sender-table #item').val(),
                    value: $(view).find('.event-sender-table #value').val(),
                    score: $(view).find('.event-sender-table #score').val()
                },
                type = $(view).find('.event-sender-table #type').val();

            presenter.eventBus.sendEvent(type, eventData);
        });

        $(view).find("input, select, button").click(function(e) {
            e.stopPropagation();
        });
    };

    return presenter;
}