TestCase('[Connection] Utilities Tests', {
    setUp: function() {
        this.presenter = AddonConnection_create();
        this.presenter.elements = [
            {
                id : 'abc',
                element : $(document.createElement('div')).addClass('element1')
            },
            {
                id: 1,
                element : $(document.createElement('div')).addClass('element2')
            }
        ];

        this.presenter.disabledConnections = [
            this.getDisabledValue('g', '22')
        ];

        this.presenter.configuration = {
            initialConnections: [
                this.getInitialValue('a', '1', true),
                this.getInitialValue('b', '2', false),
                this.getInitialValue('c', '3', true),
                this.getInitialValue('d', '4', true),
                this.getInitialValue('e', '5', false),
                this.getInitialValue('f', '6', false),
                this.getInitialValue('a', '2', true)
            ]
        };
    },

    'test get element by id': function() {
        var expectedElementClass = 'element2';
        var element = this.presenter.getElementById(1);
        assertEquals(expectedElementClass, element.attr('class'))
    },

    'test given initial values when addDIsabledElementsFromInitialValues is called then will add to disabledConnections fields': function () {
        var expectedArray = [
            this.getDisabledValue('g', '22'),
            this.getDisabledValue('a', '1'),
            this.getDisabledValue('c', '3'),
            this.getDisabledValue('d', '4'),
            this.getDisabledValue('a', '2')
        ];

        this.presenter.addDisabledElementsFromInitialValues();

        assertEquals(expectedArray, this.presenter.disabledConnections);
    },

    'test given raw model with some data when executed getInitialValues then will return validated initialConnections and disabledConnectionColor values': function () {
        function getRawInitialConnection (from, to, isDisabled) {
            return {
                from: from,
                to: to,
                isDisabled: isDisabled
            }
        }

        var getInitialConnection = getRawInitialConnection;
        var expectedModel = {
            'initialConnections': [
                getInitialConnection('a', '1', false),
                getInitialConnection(' a ', '2 ', true),
                getInitialConnection('a a', ' 3 ', false),
                getInitialConnection('', '', true),
                getInitialConnection('  ', ' ', false)
            ],
            'disabledConnectionColor': '#21321'
        };

        var rawModel = {
            'initialConnections': [
                getRawInitialConnection('a', '1', 'False'),
                getRawInitialConnection(' a ', '2 ', 'True'),
                getRawInitialConnection('a a', ' 3 ', 'False'),
                getRawInitialConnection('', '', 'True'),
                getRawInitialConnection('  ', ' ', 'False')
                
            ],
            'disabledConnectionColor': '  #21321  '
        };

        var validatedFields = this.presenter.getInitialValues(rawModel);

        assertEquals(expectedModel, validatedFields)
    },

    getInitialValue: function(from, to, isDiabled) {
        return {
            from: from,
            to: to,
            isDisabled: isDiabled
        };
    },

    getDisabledValue: function (from, to) {
        return {
            id1: from,
            id2: to
        };
    }
});