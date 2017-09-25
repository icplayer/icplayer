TestCase("[Navigation_bar] goToPage test case", {
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
            gotoPageIndex: this.stubs.goToPageIndexStub
        };

        this.NAVIGATION_PAGE = {
            FIRST: 0,
            LAST: 1,
            PREVIOUS: 2,
            NEXT: 3,
            OTHER: 4
        };
    },

    'test should go to page index 3': function () {
        var whereTo = this.NAVIGATION_PAGE.LAST;

        this.presenter.__internalElements.goToPage(whereTo, {});

        var result = this.stubs.goToPageIndexStub.args;
        assertEquals(3, result[0]);
    },

    'test should go to page index 0': function () {
        var whereTo = this.NAVIGATION_PAGE.FIRST;

        this.presenter.__internalElements.goToPage(whereTo, {});

        var result = this.stubs.goToPageIndexStub.args;
        assertEquals(0, result[0]);
    },

    'test should go to page index 1 when using NAVIGATION_PAGE.OTHER': function () {
        var whereTo = this.NAVIGATION_PAGE.OTHER;
        this.presenter.currentIndex = 1;

        this.presenter.__internalElements.goToPage(whereTo, 1);

        var result = this.stubs.goToPageIndexStub.args;
        assertEquals(1, result[0]);
    }
});