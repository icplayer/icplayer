TestCase("[Catch] Reset function", {
    setUp: function () {
        this.presenter = AddonCatch_create();

        this.stubs = {
            findStub: sinon.stub(),
            getStaticFilesPathStub: sinon.stub(),
            offStub: sinon.stub(),
            emptyStub: sinon.stub()
        };
        this.stubs.findStub.returns({
            each: function () {}
        });
        this.stubs.getStaticFilesPathStub.returns('fake/file/path/');

        this.presenter.$view = {
            find: this.stubs.findStub,
            off: this.stubs.offStub,
            empty: this.stubs.emptyStub,
            append: function () {},
            css: function () {}
        };
        this.presenter.playerController = {
            getStaticFilesPath: this.stubs.getStaticFilesPathStub
        };
    },

    'test when reset was called then off method from view object was called': function () {
        this.presenter.reset(false);

        assertTrue(this.presenter.$view.off.called);
    },

    'test when reset was called then empty method from view object was called': function () {
        this.presenter.reset(false);

        assertTrue(this.presenter.$view.empty.called);
    },

    'test given mocked view and visible status on true when reset was called then view should be visible': function () {
        this.presenter.$view = $(document.createElement('div'));
        this.presenter.$view.css('visibility', 'hidden');
        this.presenter.configuration = {
            isVisible: true
        };

        this.presenter.reset(false);
        const isVisible = this.presenter.$view.css("visibility") === 'visible';

        assertTrue(isVisible);
    },
});