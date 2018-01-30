TestCase("[gamememo] Setting image for div", {
    setUp: function () {
        this.presenter = Addongamememo_create();
        this.stubs = {
            cssStub: sinon.stub(),
            appendStub: sinon.stub()
        };

        this.div = {
            css: this.stubs.cssStub,
            append: this.stubs.appendStub
        };

        this.image = "image";
    },

    'test should set image as background css when imageMode is stretch': function () {
        this.presenter.imageMode = 'Stretch';

        this.presenter.setDivImage(this.div, this.image);

        assertTrue(this.stubs.cssStub.called);
    },

    'test should set image as img element when imageMode is KeepAspect': function () {
        this.presenter.imageMode = 'KeepAspect';

        this.presenter.setDivImage(this.div, this.image);


        assertTrue(this.stubs.appendStub.called);
    },

    'test should set image as img element when imageMode is other': function () {
        this.presenter.imageMode = '';

        this.presenter.setDivImage(this.div, this.image);

        assertTrue(this.stubs.cssStub.called);
    },

    'test should add span to div when alttext is specified': function () {
        var altText = 'altText';
        var spanClass = 'gamememo_alt_text';

        this.presenter.setDivImage(this.div, this.image, altText);


        assertTrue(this.stubs.appendStub.called);
    },

    'test should not add span to div when alttext is undefined': function () {
        this.presenter.setDivImage(this.div, this.image);

        assertFalse(this.stubs.appendStub.called);
    },
});
