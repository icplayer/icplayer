var AsyncSendEventsTests = AsyncTestCase('[Audio] AsyncSendEventsTests');

AsyncSendEventsTests.prototype.setUp = function() {
    this.presenter = AddonAudio_create();
    sinon.stub(this.presenter, 'sendEventAndSetCurrentTimeAlreadySent');
    sinon.stub(this.presenter, 'getAudioCurrentTime');
};

AsyncSendEventsTests.prototype.tearDown = function() {
    this.presenter.sendEventAndSetCurrentTimeAlreadySent.restore();
    this.presenter.getAudioCurrentTime.restore();
};

AsyncSendEventsTests.prototype.testMultipleInvocations = function(queue) {
    queue.call('Expect three invocations', function(callbacks) {
        var count = 0;
        var intervalHandle;
        var callback = callbacks.add(function() {
            ++count;
            this.presenter.onTimeUpdateSendEventCallback();
            if (count >= 3) {
                window.clearInterval(intervalHandle);
            }
        }, 3); // expect callback to be called no less than 3 times
        intervalHandle = window.setInterval(callback, 1000);
    });

    queue.call('Assert count', function() {
       assertEquals(3, this.presenter.sendEventAndSetCurrentTimeAlreadySent.callCount)
    });
};