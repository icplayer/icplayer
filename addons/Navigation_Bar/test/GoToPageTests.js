TestCase("Adding additional classes and styles", {
    'setUp': function () {
        this.presenter = AddonNavigation_Bar_create();

        this.presenter.currentIndex = 0;
        this.presenter.pageCount = 4;

        this.stubs = {
            getCurrentPageIndexStub: sinon.stub(),
            goToPageIndex: sinon.stub(),
            goToPageIndexStub: sinon.stub()
        };

        this.presenter.playerController = {
            getCurrentPageIndex: this.stubs.getCurrentPageIndexStub
        };

        this.presenter.commander = {
            goToPageIndex: this.stubs.goToPageIndexStub
        };

        this.NAVIGATION_PAGE = {
            FIRST: 0,
            LAST: 1,
            PREVIOUS: 2,
            NEXT: 3,
            OTHER: 4
        };
    },

    'test should go to page index 4': function () {
        var whereTo = this.NAVIGATION_PAGE.LAST;

        this.presenter.goToPage(whereTo, {});

        var result = this.stubs.goToPageIndexStub.calledWith();
        assertEquals(4, result[0]);
    },

    'test should go to page index 0': function () {
        var whereTo = this.NAVIGATION_PAGE.FIRST;

        this.presenter.goToPage(whereTo, {});

        var result = this.stubs.goToPageIndexStub.calledWith();
        assertEquals(0, result[0]);
    },

    'test should go to page index 1 when using NAVIGATION_PAGE.OTHER': function () {
        var whereTo = this.NAVIGATION_PAGE.OTHER;
        this.presenter.currentIndex = 1;

        this.presenter.goToPage(whereTo, 1);

        var result = this.stubs.goToPageIndexStub.calledWith();
        assertEquals(1, result[0]);
    },
});