TestCase("[Writing Calculations] Adding additional classes and styles", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();

        this.addAdditionalStyleToElementStub = sinon.stub(this.presenter, 'addAdditionalStyleToElement');
    },

    'tearDown': function () {
        this.presenter.addAdditionalStyleToElement.restore();
    },

    'test styles property is empty': function () {
        this.presenter.model = {
            'Styles': []
        };

        this.presenter.addAdditionalStyles();

        assertFalse(this.addAdditionalStyleToElementStub.called);
    },

    'test styles property with one empty element': function () {
        this.presenter.model = {
            'Styles': [{
                'Style': '',
                'Class': '',
                'Row': '',
                'Column': ''
            }]
        };

        this.presenter.addAdditionalStyles();

        assertFalse(this.addAdditionalStyleToElementStub.called);
    },

    'test additional styles added to one element': function () {
        this.presenter.model = {
            'Styles': [{
                'Style': 'color: red;',
                'Class': 'red-text',
                'Row': '1',
                'Column': '2'
            }]
        };

        this.presenter.addAdditionalStyles();

        assertTrue(this.addAdditionalStyleToElementStub.calledWith('1', '2', 'color: red;', 'red-text'));
    },

    'test additional styles added to more than one element': function () {
        this.presenter.model = {
            'Styles': [{
                'Style': 'color: red;',
                'Class': '',
                'Row': '1,2',
                'Column': '1,4,5'
            }]
        };

        this.presenter.addAdditionalStyles();

        assertEquals(6, this.addAdditionalStyleToElementStub.callCount);
    }
});
