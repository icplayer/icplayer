TestCase("[Commons - Controls-bar] Timers", {
    setUp: function () {
        this.presenter = { };
        this.controlsBar = new CustomControlsBar({
            maxMediaTime: 110,
            actualMediaTime: 24
        });
    },

    'test timer actualization': function () {
        var expected = "00:10/01:40";
        var expected2 = "00:20/02:00";
        this.controlsBar.setMaxDurationTime(100);
        this.controlsBar.setCurrentTime(10);

        var result = this.controlsBar.elements.timer.element.innerHTML;
        assertEquals(expected, result);

        this.controlsBar.setMaxDurationTime(120);
        this.controlsBar.setCurrentTime(20);

        result = this.controlsBar.elements.timer.element.innerHTML;

        assertEquals(expected2, result)
    },

    'test timer created from configutation' : function () {
        var expected = "00:24/01:50";
        var result = this.controlsBar.elements.timer.element.innerHTML;
        assertEquals(expected, result)
    }
});