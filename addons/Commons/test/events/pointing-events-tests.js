TestCase("[Events Utils - Pointing Events] hasPointerEventSupport tests", {

    tearDown: function () {
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    'test when supported Primary Events': function() {
        this.setPointerEventSupport(true);

        const result = window.EventsUtils.PointingEvents.hasPointerEventSupport();

        assertTrue(result);
    },

    'test when not supported Primary Events': function() {
        this.setPointerEventSupport(false);

        const result = window.EventsUtils.PointingEvents.hasPointerEventSupport();

        assertFalse(result);
    },
});

TestCase("[Events Utils - Pointing Events] TYPES tests", {

    tearDown: function () {
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    'test when supported Primary Events ': function() {
        this.setPointerEventSupport(true);

        assertEquals("pointerup", window.EventsUtils.PointingEvents.TYPES.UP);
        assertEquals("pointerdown", window.EventsUtils.PointingEvents.TYPES.DOWN);
        assertEquals("pointermove", window.EventsUtils.PointingEvents.TYPES.MOVE);
        assertEquals("pointerleave", window.EventsUtils.PointingEvents.TYPES.LEAVE);
        assertEquals("pointerover", window.EventsUtils.PointingEvents.TYPES.OVER);
        assertEquals("pointerout", window.EventsUtils.PointingEvents.TYPES.OUT);
    },

    'test when not supported Primary Events ': function() {
        this.setPointerEventSupport(false);

        assertEquals("mouseup", window.EventsUtils.PointingEvents.TYPES.UP);
        assertEquals("mousedown", window.EventsUtils.PointingEvents.TYPES.DOWN);
        assertEquals("mousemove", window.EventsUtils.PointingEvents.TYPES.MOVE);
        assertEquals("mouseleave", window.EventsUtils.PointingEvents.TYPES.LEAVE);
        assertEquals("mouseover", window.EventsUtils.PointingEvents.TYPES.OVER);
        assertEquals("mouseout", window.EventsUtils.PointingEvents.TYPES.OUT);
    },
});

TestCase("[Events Utils - Pointing Events] isPrimaryEvent tests", {

    tearDown: function () {
        this.setPointerEventSupport(true);
    },

    setPointerEventSupport: function (hasSupport) {
        window.EventsUtils.PointingEvents._internals.refresh(hasSupport);
    },

    'test when not active PointerEvent support': function() {
        this.setPointerEventSupport(false);
        const event = {
            type: "mousemove"
        };

        const result = window.EventsUtils.PointingEvents.isPrimaryEvent(event);

        assertTrue(result);
    },

    'test when active PointerEvent support and event is primary PointerEvent': function() {
        this.setPointerEventSupport(true);
        const event = {
            isPrimary: true,
            type: "pointermove"
        };

        const result = window.EventsUtils.PointingEvents.isPrimaryEvent(event);

        assertTrue(result);
    },

    'test when active PointerEvent support and event is not primary PointerEvent': function() {
        this.setPointerEventSupport(true);
        const event = {
            isPrimary: false,
            type: "pointermove"
        };

        const result = window.EventsUtils.PointingEvents.isPrimaryEvent(event);

        assertFalse(result);
    },

    'test when active PointerEvent support and event is not a PointerEvent': function() {
        this.setPointerEventSupport(true);
        const event = {
            type: "mousemove"
        };

        const result = window.EventsUtils.PointingEvents.isPrimaryEvent(event);

        assertFalse(result);
    },

    'test when active PointerEvent support and PointerEvent is nested in Event': function() {
        this.setPointerEventSupport(true);
        const event = {
            type: "pointermove",
            originalEvent: {
                type: "pointermove",
                isPrimary: true,
            }
        };

        const result = window.EventsUtils.PointingEvents.isPrimaryEvent(event);

        assertTrue(result);
    }
});
