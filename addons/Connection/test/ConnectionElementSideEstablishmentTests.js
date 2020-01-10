ConnectionElementSideEstablishmentTests = TestCase("[Connection] Connection element side establishment");

ConnectionElementSideEstablishmentTests.prototype.setUp = function() {
    this.presenter = AddonConnection_create();

    this.modelLeftSide = [{
        id: "1",
        content: "Sun is...",
        "connects to": "a",
        "additional class": ""
    }, {
        id: "2",
        content: "Grass is...",
        "connects to": "c",
        "additional class": ""
    }, {
        id: "z",
        content: "Sky is...",
        "connects to": "b",
        "additional class": ""
    }];

    this.modelRightSide = [{
        id: "a",
        content: "blue",
        "connects to": "",
        "additional class": ""
    }, {
        id: "b",
        content: "cloudy",
        "connects to": "",
        "additional class": ""
    }, {
        id: "c",
        content: "green",
        "connects to": "",
        "additional class": ""
    }];
};

ConnectionElementSideEstablishmentTests.prototype.testLeftSide = function() {
    var elementSide = this.presenter.establishElementSide("1", this.modelLeftSide, this.modelRightSide);

    assertEquals(this.presenter.ELEMENT_SIDE.LEFT, elementSide);
};

ConnectionElementSideEstablishmentTests.prototype.testRightSide = function() {
    var elementSide = this.presenter.establishElementSide("b", this.modelLeftSide, this.modelRightSide);

    assertEquals(this.presenter.ELEMENT_SIDE.RIGHT, elementSide);
};
