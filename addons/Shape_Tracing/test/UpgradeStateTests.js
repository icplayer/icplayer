TestCase("Upgrade state", {

    setUp: function() {
        this.presenter = AddonShape_Tracing_create();
    },

    'test upgrade state with opacity': function() {
        var state = {
            imgData: 'url',
            isPencilActive: true,
            color: 'red',
            currentPointNumber: 1,
            numberOfLines: 2,
            numberOfDescentsFromShape: 1,
            isAllPointsChecked: true,
            pointsArray: [1,2],
            isVisible: true,
            opacity: 0.1
        };

        assertEquals(0.1, this.presenter.upgradeStateForOpacity(state).opacity);
    },

    'test upgrade state without opacity': function() {
        var state = {
            imgData: 'url',
            isPencilActive: true,
            color: 'red',
            currentPointNumber: 1,
            numberOfLines: 2,
            numberOfDescentsFromShape: 1,
            isAllPointsChecked: true,
            pointsArray: [1,2],
            isVisible: true
        };

        assertEquals(0.9, this.presenter.upgradeStateForOpacity(state).opacity);
    },

    'test upgrade state with before eraser color': function() {
        var state = {
            imgData: 'url',
            isPencilActive: true,
            color: 'red',
            currentPointNumber: 1,
            numberOfLines: 2,
            numberOfDescentsFromShape: 1,
            isAllPointsChecked: true,
            pointsArray: [1,2],
            isVisible: true,
            opacity: 0.1,
            beforeEraserColor: 'red'
        };

        assertEquals('red', this.presenter.upgradeStateForOpacity(state).beforeEraserColor);
    }

});
