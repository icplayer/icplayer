TestCase("Adding additional classes and styles", {
    'setUp' : function() {
        this.presenter = AddonNavigation_Bar_create();

        this.addAdditionalStyleToPageStub = sinon.stub(this.presenter, 'addAdditionalStyleToPage');
    },

    'tearDown': function () {
        this.presenter.addAdditionalStyleToPage.restore();
    },

    'test styles property is empty': function () {
        this.presenter.configuration = {
            'styles': []
        };

        this.presenter.setPageStyles();

        assertFalse(this.addAdditionalStyleToPageStub.called);
    },

    'test styles property with one empty element': function () {
        this.presenter.configuration = {
            'styles': [{
                'Pages': '',
                'Class': '',
                'Style': ''
            }]
        };

        this.presenter.setPageStyles();

        assertTrue(this.addAdditionalStyleToPageStub.called);
    },

    'test additional styles added to one page': function () {
        this.presenter.configuration = {
            'styles': [{
                'Pages': '1',
                'Class': 'color',
                'Style': 'background-color:red'
            }]
        };

        this.presenter.setPageStyles();

        assertTrue(this.addAdditionalStyleToPageStub.calledWith('1', 'background-color', 'red', 'color'));
    },

    'test additional styles added to more than one page': function () {
        this.presenter.configuration = {
            'styles': [{
                'Pages': '1,2,3',
                'Class': 'color',
                'Style': 'background-color:red'
            }]
        };

        this.presenter.setPageStyles();

        assertEquals(3, this.addAdditionalStyleToPageStub.callCount);
    },

    'test added more than one additional style': function () {
        this.presenter.configuration = {
            'styles': [{
                'Pages': '1,2,3',
                'Class': 'color',
                'Style': 'background-color:red'
            },
            {
                'Pages': '4,5,6',
                'Class': 'color',
                'Style': 'background-color:red'
            }]
        };

        this.presenter.setPageStyles();

        assertEquals(6, this.addAdditionalStyleToPageStub.callCount);
    }
});