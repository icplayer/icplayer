TestCase("[Basic Math Gaps] [Object Factory] Attributes validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.widgetsFactory = new this.presenter.ObjectFactory();
    },

    'test abstract factory should contain gaps factory': function () {
        assertNotUndefined(this.widgetsFactory.gapsFactory);

        assertInstanceOf(this.presenter.GapsFactoryObject, this.widgetsFactory.gapsFactory);
    },

    'test abstract factory should contain gaps container factory': function () {
        assertNotUndefined(this.widgetsFactory.gapsContainerFactory);

        assertInstanceOf(this.presenter.GapsContainerFactoryObject, this.widgetsFactory.gapsContainerFactory);
    }
});

TestCase("[Basic Math Gaps] [Object Factory] Produce validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.widgetsFactory = new this.presenter.ObjectFactory();

        this.stubs = {
            gapsFactoryProduce: sinon.stub(this.widgetsFactory.gapsFactory, 'produce'),
            gapsContainerFactory: sinon.stub(this.widgetsFactory.gapsContainerFactory, 'produce')
        };

        this.data = {
            test: "test data"
        };

        this.expectedItem = {
            test: "expected item"
        };

        this.stubs.gapsFactoryProduce.returns(this.expectedItem);
        this.stubs.gapsContainerFactory.returns(this.expectedItem);
    },

    'test producing editable input gap, should request production at gaps factory': function () {

        var producedItem = this.widgetsFactory.produce(this.presenter.ObjectFactory.PRODUCTION_TYPE.EDITABLE_INPUT_GAP, this.data);

        assertTrue(this.stubs.gapsFactoryProduce.calledOnce);

        assertFalse(this.stubs.gapsContainerFactory.called);

        assertEquals(this.expectedItem, producedItem);
    },

    'test producing fraction gap, should request production at gaps factory': function () {

        var producedItem = this.widgetsFactory.produce(this.presenter.ObjectFactory.PRODUCTION_TYPE.FRACTION_GAP, this.data);

        assertTrue(this.stubs.gapsFactoryProduce.calledOnce);

        assertFalse(this.stubs.gapsContainerFactory.called);

        assertEquals(this.expectedItem, producedItem);
    },

    'test producing element gap, should request production at gaps factory': function () {

        var producedItem = this.widgetsFactory.produce(this.presenter.ObjectFactory.PRODUCTION_TYPE.ELEMENT_GAP, this.data);

        assertTrue(this.stubs.gapsFactoryProduce.calledOnce);

        assertFalse(this.stubs.gapsContainerFactory.called);

        assertEquals(this.expectedItem, producedItem);
    },

    'test producing draggable math gap, should request production at gaps factory': function () {

        var producedItem = this.widgetsFactory.produce(this.presenter.ObjectFactory.PRODUCTION_TYPE.DRAGGABLE_MATH_GAP, this.data);

        assertTrue(this.stubs.gapsFactoryProduce.calledOnce);

        assertFalse(this.stubs.gapsContainerFactory.called);

        assertEquals(this.expectedItem, producedItem);
    },

    'test producing gap container, should request production at gaps container factory': function () {
        var producedItem = this.widgetsFactory.produce(this.presenter.ObjectFactory.PRODUCTION_TYPE.GAP_CONTAINER, this.data);

        assertTrue(this.stubs.gapsContainerFactory.calledOnce);

        assertFalse(this.stubs.gapsFactoryProduce.called);

        assertEquals(this.expectedItem, producedItem);
    }
});