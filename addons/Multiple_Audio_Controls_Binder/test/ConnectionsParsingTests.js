TestCase("Connections parsing", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();
    },

    'test proper connection definition': function() {
        var connections = 'Audio5|Double_State_Button6\n' +
                          'Audio6|Double_State_Button5\n' +
                          'Audio7|Double_State_Button7\n' +
                          'Audio8|Double_State_Button8',
            expectedConnections = [
                { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6', Item: undefined},
                { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5', Item: undefined},
                { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7', Item: undefined},
                { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8', Item: undefined}
            ];


        var parsedConnections = this.presenter.validateConnections(connections);

        assertTrue(parsedConnections.isValid);
        assertEquals(expectedConnections, parsedConnections.connections);
    },

    'test proper connection for different items': function() {
        var connections = 'Audio5|Double_State_Button5\n' +
                          'Audio6|Double_State_Button6|1\n' +
                          'Audio6|Double_State_Button7|2\n' +
                          'Audio7|Double_State_Button8\n' +
                          'Audio8|Double_State_Button9',
            expectedConnections = [
                { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button5', Item: undefined},
                { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button6', Item: '1'},
                { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button7', Item: '2'},
                { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button8', Item: undefined},
                { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button9', Item: undefined}
            ];


        var parsedConnections = this.presenter.validateConnections(connections);

        assertTrue(parsedConnections.isValid);
        assertEquals(expectedConnections, parsedConnections.connections);
    },

    'test empty connection definition': function() {
        var connections = '';


        var parsedConnections = this.presenter.validateConnections(connections);

        assertFalse(parsedConnections.isValid);
        assertEquals('CONNECTIONS_01', parsedConnections.errorCode);
    },

    'test undefined connection definition': function() {
        var parsedConnections = this.presenter.validateConnections(undefined);

        assertFalse(parsedConnections.isValid);
        assertEquals('CONNECTIONS_01', parsedConnections.errorCode);
    },

    'test missing separator character': function() {
        var connections = 'Audio5|Double_State_Button6\n' +
                          'Audio6|Double_State_Button5\n' +
                          'Audio7Double_State_Button7';


        var parsedConnections = this.presenter.validateConnections(connections);

        assertFalse(parsedConnections.isValid);
        assertEquals('CONNECTIONS_02', parsedConnections.errorCode);
    },

    'test missing Audio ID': function() {
        var connections = 'Audio5|Double_State_Button6\n' +
            '|Double_State_Button5\n' +
            'Audio7|Double_State_Button7';


        var parsedConnections = this.presenter.validateConnections(connections);

        assertFalse(parsedConnections.isValid);
        assertEquals('CONNECTIONS_03', parsedConnections.errorCode);
    },

    'test missing Double State Button ID': function() {
        var connections = 'Audio5|Double_State_Button6\n' +
            'Audio6|\n' +
            'Audio7|Double_State_Button7';


        var parsedConnections = this.presenter.validateConnections(connections);

        assertFalse(parsedConnections.isValid);
        assertEquals('CONNECTIONS_04', parsedConnections.errorCode);
    },

    'test empty line': function() {
        var connections = 'Audio5|Double_State_Button6\n' +
            'Audio6|Double_State_Button5\n' +
            '\n' +
            'Audio7|Double_State_Button7';


        var parsedConnections = this.presenter.validateConnections(connections);

        assertFalse(parsedConnections.isValid);
        assertEquals('CONNECTIONS_05', parsedConnections.errorCode);
    },

    'test Audio ID repeated': function() {
        var connections = 'Audio5|Double_State_Button6\n' +
                'Audio6|Double_State_Button5\n' +
                'Audio7|Double_State_Button7\n' +
                'Audio6|Double_State_Button8';


        var parsedConnections = this.presenter.validateConnections(connections);

        assertFalse(parsedConnections.isValid);
        assertEquals('CONNECTIONS_06', parsedConnections.errorCode);
    },

    'test Double State Button ID repeated': function() {
        var connections = 'Audio5|Double_State_Button6\n' +
            'Audio6|Double_State_Button5\n' +
            'Audio7|Double_State_Button5\n' +
            'Audio8|Double_State_Button8';


        var parsedConnections = this.presenter.validateConnections(connections);

        assertFalse(parsedConnections.isValid);
        assertEquals('CONNECTIONS_07', parsedConnections.errorCode);
    }
});

TestCase("Connections parsing helper methods", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();
    },

    'test Audio ID not present': function () {
        var connections = [
            { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
            { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
            { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
            { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
        ];

        var isAudioIDPresent = this.presenter.isAudioIDPresent(connections, 'Audio2');

        assertFalse(isAudioIDPresent);
    },

    'test Audio ID present': function () {
        var connections = [
            { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
            { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
            { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
            { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
        ];

        var isAudioIDPresent = this.presenter.isAudioIDPresent(connections, 'Audio7');

        assertTrue(isAudioIDPresent);
    },

    'test Audio ID - empty connections': function () {
        var connections = [];

        var isAudioIDPresent = this.presenter.isAudioIDPresent(connections, 'Audio7');

        assertFalse(isAudioIDPresent);
    },

    'test Double State Button ID not present': function () {
        var connections = [
            { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
            { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
            { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
            { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
        ];

        var isAudioIDPresent = this.presenter.isDoubleStateButtonIDPresent(connections, 'Double_State_Button2');

        assertFalse(isAudioIDPresent);
    },

    'test Double State Button ID present': function () {
        var connections = [
            { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
            { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
            { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
            { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
        ];

        var isAudioIDPresent = this.presenter.isDoubleStateButtonIDPresent(connections, 'Double_State_Button5');

        assertTrue(isAudioIDPresent);
    },

    'test Double State Button ID - empty connections': function () {
        var connections = [];

        var isAudioIDPresent = this.presenter.isDoubleStateButtonIDPresent(connections, 'Double_State_Button2');

        assertFalse(isAudioIDPresent);
    }
});