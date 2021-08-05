TestCase("[Assessments_Navigation_Bar] isFloat", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
    },

    'test detecting floats': function () {
        assertTrue(this.presenter.isFloat(12.5));
        assertTrue(this.presenter.isFloat(-1.5));
        assertTrue(this.presenter.isFloat(1.00005));
        assertTrue(this.presenter.isFloat(18.3));
        assertTrue(this.presenter.isFloat(-12312321312.12));
    },

    'test detecting ints': function () {
        assertFalse(this.presenter.isFloat(-1));
        assertFalse(this.presenter.isFloat(0));
        assertFalse(this.presenter.isFloat(5));
        assertFalse(this.presenter.isFloat(8));
        assertFalse(this.presenter.isFloat(9));
        assertFalse(this.presenter.isFloat(12397612321));
    }
});

TestCase("[Assessments_Navigation_Bar] Change to Page", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.stubs = { getPagesMappingStub: sinon.stub() };

        this.playerControllerStub = { getPagesMapping: this.stubs.getPagesMappingStub };

        this.presenter.playerController = this.playerControllerStub;

        this.gotoPageStub = sinon.stub();
        this.presenter.currentPageIndex = 5;

        this.presenter.commander = {
            gotoPageIndex: this.gotoPageStub
        };

    },

    'test shouldnt change page if provided index is equal to current page index': function () {
        this.stubs.getPagesMappingStub.returns([0, 1, 2, 3]);
        this.presenter.changeToPage(5);

        assertFalse(this.gotoPageStub.called);
    },

    'test should change page if provided index is diffrent then current page index': function () {
        this.stubs.getPagesMappingStub.returns([0, 1, 2, 3]);
        this.presenter.changeToPage(4);

        assertTrue(this.gotoPageStub.calledOnce);
    }
});