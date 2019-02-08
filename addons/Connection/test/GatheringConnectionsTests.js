GatheringConnectionsTests = TestCase("[Connection] Gathering Connections Tests");

GatheringConnectionsTests.prototype.setUp = function() {
    this.presenter = AddonConnection_create();
    this.presenter.elements = [
        {
            id : 'abc',
            connects: '1',
            element : $('<table class="connectionItem"></div>')
        },
        {
            id: '1',
            connects: 'abc',
            element : $('<table class="connectionItem"></div>')
        }
    ];
    this.presenter.uniqueIDs = ['abc', '1'];
};

GatheringConnectionsTests.prototype.testCorrectConnectionsPositive = function() {
    var expectedConnections = {
        ids: [['abc', '1']]
    };
    this.presenter.gatherCorrectConnections();

    assertEquals("", expectedConnections.ids.length, this.presenter.correctConnections.ids.length);
    assertEquals("", expectedConnections.ids[0], this.presenter.correctConnections.ids[0]);
};

GatheringConnectionsTests.prototype.testCorrectConnectionsNegative = function() {
    var notExpectedConnections = {
        ids: [['abc', '1'], ['1', 'abc']]
    };

    this.presenter.gatherCorrectConnections();

    assertNotEquals("", notExpectedConnections.ids.length, this.presenter.correctConnections.ids.length);
    assertNotEquals("", notExpectedConnections.ids, this.presenter.correctConnections.ids);
};

GatheringConnectionsTests.prototype.testCorrectConnectionsNoDuplications = function() {
    this.presenter.elements[0].connects = '1,1';
    var expectedConnections = {
        ids: [['abc', '1']]
    };

    this.presenter.gatherCorrectConnections();

    assertEquals("", expectedConnections.ids.length, this.presenter.correctConnections.ids.length);
    assertEquals("", expectedConnections.ids, this.presenter.correctConnections.ids);
};

GatheringConnectionsTests.prototype.testOneElementConnectedWithTwo = function() {
    this.presenter.elements.push({
        id: '3',
        connects: '1',
        element: $('<table class="connectionItem"></div>')
    });
    var expectedConnections = {
        ids: [['abc', '1'], ['1', '3']]
    };

    this.presenter.gatherCorrectConnections();

    assertEquals("", expectedConnections.ids.length, this.presenter.correctConnections.ids.length);
    assertEquals("", expectedConnections.ids, this.presenter.correctConnections.ids);
};

GatheringConnectionsTests.prototype.testConnectsToNotExistingID = function() {
    this.presenter.uniqueIDs = ['abc'];

    var expectedConnections = {
        ids: [['abc', '1']]
    };

    this.presenter.gatherCorrectConnections();

    assertEquals("", expectedConnections.ids.length, this.presenter.correctConnections.ids.length);
    assertEquals("", expectedConnections.ids, this.presenter.correctConnections.ids);
};
