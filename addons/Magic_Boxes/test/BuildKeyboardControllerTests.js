function createMagicBoxesConfigurationForTests () {
    return {
        rows: 5,
        columns: 6,
        gridElements: [
        //   0A   1B   2C   3C   4D   5E
            ["O", "N", "E", "T", "E", "A"], // 0
            ["T", "H", "A", "H", "I", "A"], // 1
            ["T", "T", "O", "R", "O", "A"], // 2
            ["S", "W", "V", "E", "T", "A"], // 3
            ["F", "O", "U", "E", "M", "A"]  // 4
        ],
        langTag: "",
    };
}

function createMagicBoxesViewForTests (configuration) {
    const rows = configuration.rows;
    const columns = configuration.columns;

    let view = document.createElement('div');
    let $view = $(view);

    let $gridContainerWrapper = $(document.createElement('div'));
    $gridContainerWrapper.addClass("magicGridWrapper");
    $view.append($gridContainerWrapper);

    let $gridContainer = $(document.createElement('div'));
    $gridContainer.addClass("magicGrid");
    $gridContainerWrapper.append($gridContainer)

    for (let row = 0; row < rows; row++) {
        for(let column = 0; column < columns; column++) {
            let wrapperElement = $(document.createElement('div'));
            wrapperElement.addClass("selectable-element-wrapper");

            let selectableElement = $(document.createElement('div'));
            selectableElement.addClass("selectable-element");
            selectableElement.text(configuration.gridElements[row][column].toUpperCase());

            wrapperElement.append(selectableElement);
            $gridContainer.append(wrapperElement);
        }
    }

    return view;
}

TestCase("[Magic Boxes] Build KeyboardController tests", {

    setUp: function () {
        this.presenter = new AddonMagic_Boxes_create();

        this.presenter.configuration = createMagicBoxesConfigurationForTests();
    },

    buildView: function() {
        this.presenter.view = createMagicBoxesViewForTests(this.presenter.configuration);
        this.presenter.$view = $(this.presenter.view);
    },

    'test given presenter without built keyboard controller when buildKeyboardController is called then set keyboard controller to presenter with elements returned from getElementsForKeyboardNavigation' : function () {
        const elements = [sinon.spy(), sinon.spy(), sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        this.presenter.getElementsForKeyboardNavigation.returns(elements);

        assertTrue(this.presenter.keyboardControllerObject === null);

        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertTrue(this.presenter.getElementsForKeyboardNavigation.calledOnce);
        assertEquals(elements, this.presenter.keyboardControllerObject.keyboardNavigationElements);
    },

    'test given view when buildKeyboardController is called then keyboard controller have set as elements every selectable element' : function () {
        this.buildView();

        this.presenter.buildKeyboardController();

        const expectedElementsNumber = this.presenter.configuration.columns * this.presenter.configuration.rows;
        assertEquals(expectedElementsNumber, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
    },

    'test given view when buildKeyboardController is called then keyboard controller columns count equals to magic boxes columns count' : function () {
        this.buildView();

        this.presenter.buildKeyboardController();

        assertEquals(this.presenter.configuration.columns, this.presenter.keyboardControllerObject.columnsCount);
    },
});
