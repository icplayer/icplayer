function setUpPointsLinesForTests (presenter) {
    presenter.addonID = "PointsLines1";
    presenter.visible = true;
    presenter.disabled = false;
    presenter.singleMode = false;
    presenter.points = [
        [25,  25],
        [100, 25],
        [100, 100],
        [25,  100],
        [150, 25],
        [150, 100]
    ];
    presenter.indexes = false;
    presenter.pointsConnected = undefined;

    // Translation of table:
    // Point 1 cannot connect to Point 5 and Point 6
    // Point 4 cannot connect to Point 5 and Point 6
    presenter.blockedLines = [
        [0, 0, 0, 0, 1, 1],
        [null, 0, 0, 0, 0, 0],
        [null, null, 0, 0, 0, 0],
        [null, null, null, 0, 1, 1],
        [null, null, null, null, 0, 0],
        [null, null, null, null, null, 0]
    ]
    // Translation of table:
    // Correct connections: 1-2, 2-3, 3-4, 4-1
    presenter.answer = [
        [0, 1, 0, 1, 0, 0],
        [null, 0, 1, 0, 0, 0],
        [null, null, 0, 1, 0, 0],
        [null, null, null, 0, 0, 0],
        [null, null, null, null, 0, 0],
        [null, null, null, null, null, 0]
    ]
    // Translation of tables:
    // Point 1 connected to Point 2 (correct), Point 3 (wrong), Point 4 (correct)
    // Point 2 connected to Point 1 (correct), Point 3 (starting line, not removable), Point 4 (wrong)
    // Point 3 connected to Point 2 (starting line, not removable), Point 4 (starting line), Point 5 (starting line)
    // Point 4 connected to Point 1 (correct), Point 2 (wrong), Point 3 (starting line)
    // Point 5 not connected
    // Point 6 connected to Point 3 (starting line)
    // Scenario 1 is scenario for Point 2
    // Scenario 2 is scenario for Point 4
    presenter.startingLines = [
        [0, 0, 0, 0, 0, 0],
        [null, 0, 2, 0, 1, 0],
        [null, null, 0, 1, 0, 1],
        [null, null, null, 0, 0, 0],
        [null, null, null, null, 0, 0],
        [null, null, null, null, null, 0]
    ]
    presenter.currentLines = [
        [0, 1, 1, 1, 0, 0],
        [null, 0, 2, 1, 0, 0],
        [null, null, 0, 1, 0, 1],
        [null, null, null, 0, 0, 0],
        [null, null, null, null, 0, 0],
        [null, null, null, null, null, 0]
    ]
}

function buildViewForPointsLinesTests (presenter) {
    let view = document.createElement('div');

    let pointsLinesView = document.createElement('div');
    pointsLinesView.classList.add("pointslines");
    view.append(pointsLinesView);

    presenter.view = view;
    presenter.$view = $(view);

    presenter.drawPoints();
    const numberOfPoints = presenter.points.length;
    for (let i = 0; i < numberOfPoints; i++) {
        for (let j = i; j < numberOfPoints; j++) {
            if (presenter.currentLines[i][j] == 1 || presenter.currentLines[i][j] == 2) {
                presenter.drawLine(i, j);
            }
        }
    }
}

TestCase("[PointsLines] Build KeyboardController tests", {

    setUp: function () {
        this.presenter = new AddonPointsLines_create();

        setUpPointsLinesForTests(this.presenter);
    },

    'test given presenter without built keyboard controller when buildKeyboardController is called then set keyboard controller to presenter with elements returned from getElementsForKeyboardNavigation' : function () {
        const elements = [sinon.spy(), sinon.spy(), sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        this.presenter.getElementsForKeyboardNavigation.returns(elements);

        assertNull(this.presenter.keyboardControllerObject);

        this.presenter.buildKeyboardController();

        assertNotNull(this.presenter.keyboardControllerObject);
        assertTrue(this.presenter.getElementsForKeyboardNavigation.calledOnce);
        assertEquals(elements, this.presenter.keyboardControllerObject.keyboardNavigationElements);
    },

    'test given view when buildKeyboardController is called then keyboard controller have set as elements every point' : function () {
        buildViewForPointsLinesTests(this.presenter);

        this.presenter.buildKeyboardController();

        const expectedElementsNumber = 6;
        assertEquals(expectedElementsNumber, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
    },

    'test given view when buildKeyboardController is called then keyboard controller columns count equals to 1' : function () {
        buildViewForPointsLinesTests(this.presenter);

        this.presenter.buildKeyboardController();

        const expectedColumnsNumber = 1;
        assertEquals(expectedColumnsNumber, this.presenter.keyboardControllerObject.columnsCount);
    },
});
