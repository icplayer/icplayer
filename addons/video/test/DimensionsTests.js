TestCase("[Video] Dimensions", {
    setUp: function () {
        this.presenter = Addonvideo_create();

        this.container = {
            css: function () {}
        };
        sinon.stub(this.container, 'css');
    },

    'test no borders and margins': function () {
        this.container.css.withArgs('border-top-width').returns('0px');
        this.container.css.withArgs('border-bottom-width').returns('0px');
        this.container.css.withArgs('margin-top').returns('0px');
        this.container.css.withArgs('margin-bottom').returns('0px');

        var containerHeight = this.presenter.calculateVideoContainerHeight(this.container, 300);

        assertEquals(300, containerHeight);
    },

    'test no borders and margins but some are empty strings': function () {
        this.container.css.withArgs('border-top-width').returns('1px');
        this.container.css.withArgs('border-bottom-width').returns('');
        this.container.css.withArgs('margin-top').returns('');
        this.container.css.withArgs('margin-bottom').returns('2px');

        var containerHeight = this.presenter.calculateVideoContainerHeight(this.container, 300);

        assertEquals(297, containerHeight);
    },

    'test custom borders and margins': function () {
        this.container.css.withArgs('border-top-width').returns('1px');
        this.container.css.withArgs('border-bottom-width').returns('2px');
        this.container.css.withArgs('margin-top').returns('3px');
        this.container.css.withArgs('margin-bottom').returns('4px');

        var containerHeight = this.presenter.calculateVideoContainerHeight(this.container, 300);

        assertEquals(290, containerHeight);
    }
});