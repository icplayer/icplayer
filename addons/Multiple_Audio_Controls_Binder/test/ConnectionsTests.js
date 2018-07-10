TestCase("Get connection with ID", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();
        this.presenter.connections = new this.presenter.Connections([
            { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
            { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
            { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
            { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
        ]);
    },

    'test get connection for proper ID': function () {
        var connection = this.presenter.connections.getConnection('1');

        assertEquals('Audio6', connection.Audio.ID);
        assertEquals('Double_State_Button5', connection.DoubleStateButton.ID);
    }
});

TestCase("Get connection with module ID", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();
        this.presenter.connections = new this.presenter.Connections([
            { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
            { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
            { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
            { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
        ]);
    },

    'test get connection with Audio ID': function () {
        var connection = this.presenter.connections.getConnectionWithAudio('Audio7');

        assertEquals('2', connection.ID);
        assertEquals('Audio7', connection.Audio.ID);
        assertEquals('Double_State_Button7', connection.DoubleStateButton.ID);
    },

    'test get connection with Double State Button ID': function () {
        var connection = this.presenter.connections.getConnectionWithDSB('Double_State_Button8');

        assertEquals('3', connection.ID);
        assertEquals('Audio8', connection.Audio.ID);
        assertEquals('Double_State_Button8', connection.DoubleStateButton.ID);
    }
});

TestCase("Get connections other than", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();
        this.presenter.connections = new this.presenter.Connections([
            { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6'},
            { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button5'},
            { Audio: 'Audio7', DoubleStateButton: 'Double_State_Button7'},
            { Audio: 'Audio8', DoubleStateButton: 'Double_State_Button8'}
        ]);
    },

    'test get connections other than': function () {
        var connection = this.presenter.connections.getConnectionWithAudio('Audio7');
        var connections = this.presenter.connections.getConnectionsOtherThan(connection.ID);

        assertEquals(3, connections.length);

        for (var i = 0; i < connections.length; i++) {
            assertNotEquals(connection.ID, connections[i].ID);
            assertNotEquals(connection.Audio.ID, connections[i].Audio.ID);
            assertNotEquals(connection.DoubleStateButton.ID, connections[i].DoubleStateButton.ID);
        }
    }
});

TestCase("[Multiple_Audio_Controls_Binder] Get connection with module ID and item", {
    setUp: function () {
        this.presenter = AddonMultiple_Audio_Controls_Binder_create();
        this.presenter.connections = new this.presenter.Connections([
            { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button6', Item: "1"},
            { Audio: 'Audio5', DoubleStateButton: 'Double_State_Button5', Item: "2"},
            { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button7', Item: "1" },
            { Audio: 'Audio6', DoubleStateButton: 'Double_State_Button8', Item: "2"}
        ]);
    },

    'test get connection with Audio ID': function () {
        var connection = this.presenter.connections.getConnectionWithAudioAndItem('Audio5', "2");

        assertEquals('1', connection.ID);
        assertEquals('Audio5', connection.Audio.ID);
        assertEquals('Double_State_Button5', connection.DoubleStateButton.ID);
        assertEquals('2', connection.Item.Digit);
    },

    'test get connection with nonexistent item': function () {
        var connection = this.presenter.connections.getConnectionWithAudioAndItem('Audio5', "3");

        assertEquals(undefined, connection);
    },
});