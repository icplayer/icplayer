TestCase("[Coloring] Commands Tests", {
    setUp: function () {
        this.presenter = AddonColoring_create();
        this.model = {
            'Areas' : '55; 150; 255 200 255 255',
            'Tolerance' : '50',
            'DefaultFillingColor' : [255, 50, 50, 255]
        };

        this.presenter.configuration = {
            'tolerance' : 50,
            'lastUsedColor' : [255, 255, 0, 255],
            'areas' : [
                'fake Area'
            ],
            'defaultFillingColor' : [255, 50, 50, 255],
            'colorsThatCanBeFilled' : [[255, 255, 255, 255]],
            'isDisabled' : false
        };

        sinon.stub(this.presenter, 'clickLogic');
        sinon.stub(this.presenter, 'shouldBeTakenIntoConsideration');

        this.presenter.$view = $('' +
            '<div>' +
                '<div class="coloring-wrapper">' +
                    '<div class="coloring-container">' +
                    '</div>' +
                '</div>' +
            '</div>');

        this.presenter.canvas = $('<canvas></canvas>');
    },

    tearDown : function() {
        this.presenter.clickLogic.restore();
        this.presenter.shouldBeTakenIntoConsideration.restore();
    },

    'test show will set invisible view to visible state' : function() {
        this.presenter.$view.css('visible', 'hidden');
        this.presenter.show();
        assertTrue(this.presenter.$view.css('visibility') == 'visible');
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test hide will set visible view to invisible state' : function() {
        this.presenter.hide();
        assertTrue(this.presenter.$view.css('visibility') == 'hidden');
        assertFalse(this.presenter.configuration.isVisible);
    },

    'test disable will disable click logic' : function() {
        this.presenter.configuration.isDisabled = false;

        this.presenter.disable();
        this.presenter.canvas.trigger('click');

        assertTrue(this.presenter.configuration.isDisabled);
        assertFalse(this.presenter.clickLogic.called);
    },

    'test enable will enable click logic' : function() {
        this.presenter.configuration.isDisabled = true;

        this.presenter.enable();
        this.presenter.canvas.trigger('click');

        assertFalse(this.presenter.configuration.isDisabled);
        assertTrue(this.presenter.clickLogic.called);
    },

    'test set color works properly' : function() {
        this.presenter.setColor('255 50 155 255');

        assertEquals([255, 50, 155, 255], this.presenter.configuration.currentFillingColor);
    },

    'test is attempted when user colored one area' : function() {
        this.presenter.isColored = true;
        assertTrue(this.presenter.isAttempted());
    },

    'test is attempted when user did NOT color any area' : function() {
        this.presenter.shouldBeTakenIntoConsideration.returns(false);
        assertFalse(this.presenter.isAttempted());
    }



});