TestCase("[Basic Math Gaps] States Tests", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.configuration = {
            'isVisible' : true
        };

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            getSources: sinon.stub(this.presenter.gapsContainer, 'getSources')
        };
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

        var stateString = this.presenter.getState();

        assertEquals('{\"values\":[\"1\",\"2\"],\"sources\":[],\"isVisible\":true}', stateString);
    },

    'test setState works properly' : function() {
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                '<input value="" />' +
                '<span class="element">+</span>' +
                '<input value="" />' +
                '<span class="element">=</span>' +
                '<span class="element">3</span>' +
                '</div>' +
                '</div>');

        this.presenter.setState('{\"values\":[\"1\",\"2\"]}');

        assertEquals('1', this.presenter.$view.find('input:eq(0)').val());
        assertEquals('2', this.presenter.$view.find('input:eq(1)').val());
    }
});