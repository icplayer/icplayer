TestCase("[Drawing] Upgrade state", {

    setUp: function() {
        this.presenter = AddonDrawing_create();
    },

    'test upgrade state with opacity': function() {
        var state = {
            isPencil: true,
            color: 'red',
            pencilThickness: 10,
            eraserThickness: 10,
            data: 'data',
            isVisible: true,
            opacity: 0.1
        };

        assertEquals(0.1, this.presenter.upgradeStateForOpacity(state).opacity);
    },

    'test upgrade state without opacity': function() {
        var state = {
            isPencil: true,
            color: 'red',
            pencilThickness: 10,
            eraserThickness: 10,
            data: 'data',
            isVisible: true
        };

        assertEquals(0.9, this.presenter.upgradeStateForOpacity(state).opacity);
    }

});
