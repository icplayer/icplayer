TestCase("[Basic_Math_Gaps] Create gaps", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
        this.presenter.widgetsFactory = new this.presenter.ObjectFactory();

        this.presenter.configuration = {
            gapsDefinition: "testDefs",
            isDisabled: false
        };

        this.stubs = {
            produceGapContainer: sinon.stub(this.presenter.widgetsFactory, 'produce'),
            blockGaps: sinon.stub(this.presenter.gapsContainer, 'block')
        };
    },

    tearDown: function () {
        this.presenter.widgetsFactory.produce.restore();
        this.presenter.gapsContainer.block.restore();
    },

    'test create gaps should dispatch task of producing gap container': function () {
        this.presenter.createGaps();

        assertTrue(this.stubs.produceGapContainer.calledOnce);
        assertTrue(this.stubs.produceGapContainer.calledWith(this.presenter.ObjectFactory.PRODUCTION_TYPE.GAP_CONTAINER,
        this.presenter.configuration.gapsDefinition));
    },

    'test create gaps shouldnt block gaps if addon is not disabled': function () {
        this.presenter.createGaps();

        assertFalse(this.stubs.blockGaps.called);
    },

    'test create gaos should block gaps if addon is disabled': function () {
        this.presenter.configuration.isDisabled = true;

        this.presenter.createGaps();

        assertTrue(this.stubs.blockGaps.calledOnce);
    }
});