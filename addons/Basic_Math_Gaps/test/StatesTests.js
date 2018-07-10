TestCase("[Basic Math Gaps] States Tests", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.configuration = {
            'isVisible' : true
        };

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.presenter.isDraggable = true;

        this.stubs = {
            getSources: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getSources'),
            getValues: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getValues'),
            setDisabledInSetState: sinon.stub(this.presenter, 'setDisabledInSetState'),
            setState: sinon.stub(this.presenter.GapsContainerObject.prototype, 'setState'),
            setVisibility: sinon.stub(this.presenter, 'setVisibility')
        };

    },

    tearDown: function () {
        this.presenter.GapsContainerObject.prototype.getSources.restore();
        this.presenter.GapsContainerObject.prototype.getValues.restore();
        this.presenter.GapsContainerObject.prototype.setState.restore();
        this.presenter.setDisabledInSetState.restore();
        this.presenter.setVisibility.restore();
    },

    'test getState works properly' : function() {
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" />' +
                    '<span class="element">+</span>' +
                    '<input value="2" />' +
                    '<span class="element">=</span>' +
                    '<span class="element">3</span>' +
                '</div>' +
            '</div>');

        this.stubs.getSources.returns([]);
        this.stubs.getValues.returns(["1", "2"]);

        var stateString = this.presenter.getState();

        assertEquals('{\"values\":[\"1\",\"2\"],\"sources\":[],\"isVisible\":true,\"droppedElements\":[]}', stateString);
    },

    'test setState works properly' : function() {
        this.presenter.setState('{\"values\":[\"1\",\"2\"]}');

        assertTrue(this.stubs.setState.calledWith(["1", "2"], ["", ""]));
    },

    'test setState should call setDisabledInState': function () {
        this.presenter.setState('{\"values\":[\"1\",\"2\"]}');

        assertTrue(this.stubs.setDisabledInSetState.calledOnce);
    }
});