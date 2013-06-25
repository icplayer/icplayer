TestCase("Show and hide methods", {
    setUp: function () {
        this.presenter = AddonAnimation_create();
        this.presenter.configuration = {
            isVisibleByDefault: true,
            isVisible: false,
            labels: []
        };

        this.presenter.DOMElements.viewContainer = $("<div>" +
                                                        "<div class='animation-label' style='visibility: visible'>1</div>" +
                                                        "<div class='animation-label' style='visibility: visible'>2</div>" +
                                                    "</div>");

        this.presenter.configuration.animationState = this.presenter.ANIMATION_STATE.STOPPED;
        this.presenter.configuration.currentFrame = 0;
    },

    'test show method': function () {
        this.presenter.show();

        assertTrue(this.presenter.configuration.isVisible);
        assertTrue(this.presenter.configuration.isVisibleByDefault);
    },

    'test hide method': function () {
        this.presenter.hide();

        assertFalse(this.presenter.configuration.isVisible);
        assertTrue("defaultVisibility should NOT change !", this.presenter.configuration.isVisibleByDefault);
    },

    'test labels are hiding properly': function () {
        this.presenter.configuration.labels = [
            {
                content: [
                    { text: '1' },
                    { text: '2' }
                ],
                count: 2
            }
        ];

        this.presenter.hide();

        var labels = $(this.presenter.DOMElements.viewContainer).find('.animation-label');

        assertEquals('hidden', $(labels[0]).css('visibility'));
        assertEquals('hidden', $(labels[1]).css('visibility'));
    },

    'test labels are showing properly': function () {
        var labelsBefore = $(this.presenter.DOMElements.viewContainer).find('.animation-label');

        $.each(labelsBefore, function(){
            $(this).css('visibility', 'hidden');
        });

        this.presenter.configuration.labels = {
            content: [
                { text: '1', frames: [1, 2] },
                { text: '2', frames: [1, 2] }
            ],
            count: 2
        };

        this.presenter.show();

        var labelsAfter = $(this.presenter.DOMElements.viewContainer).find('.animation-label');

        assertEquals('visible', $(labelsAfter[0]).css('visibility'));
        assertEquals('visible', $(labelsAfter[1]).css('visibility'));
    }
});