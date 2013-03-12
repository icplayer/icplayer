TouchSimulationsTests = TestCase("Touch Simulations Tests");

TouchSimulationsTests.prototype.setUp = function() {
    this.presenter = AddonGlossary_create();
    this.presenter.isPinchZoom = false;
    this.presenter.lastReceivedEvent = null;
    this.event = {
        type: '',
        originalEvent: { touches: [] }
    };
};

TouchSimulationsTests.prototype.testClickEventReceived = function() {
    this.event.type = 'click';

    var result = this.presenter.shouldCloseDialog(this.event);

    assertTrue(result);
};

TouchSimulationsTests.prototype.testSimulatedTap = function() {
    // given
    this.event.type = 'touchstart';

    // when
    var result = this.presenter.shouldCloseDialog(this.event);

    // then
    assertFalse(result);
    assertEquals("", 'touchstart', this.presenter.lastReceivedEvent);

    // given - 2nd touch
    this.event.type = 'touchend';

    // when - 2nd touch
    result = this.presenter.shouldCloseDialog(this.event);

    // then - 2nd touch
    assertTrue(result);
    assertEquals("", 'touchstart', this.presenter.lastReceivedEvent);
};

TouchSimulationsTests.prototype.testPinchZoom = function() {
    // given
    this.event.type = 'touchstart';

    // when
    var result = this.presenter.shouldCloseDialog(this.event);

    // then
    assertFalse(result);

    // given - 2nd touch
    this.event.type = 'touchstart';
    this.event.originalEvent.touches = ['first touch', 'second touch'];

    // when - 2nd touch
    result = this.presenter.shouldCloseDialog(this.event);

    // then - 2nd touch
    assertFalse(result);
    assertTrue(this.presenter.isPinchZoom);
};