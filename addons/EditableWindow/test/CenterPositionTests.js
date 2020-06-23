function getPositionObject(domElement) {
    var left = parseInt(domElement.style.left, 10);
    var top = parseInt(domElement.style.top, 10);

    return {
        left: left,
        top: top
    };
}

function getExpectedWidth(windowWidth, elementWidth) {
    return (windowWidth - elementWidth) / 2;
}

TestCase("[EditableWindow] Centering position", {
    setUp: function () {
        this.presenter = AddonEditableWindow_create();
        this.windowWidth = 200;
        this.elementSize = 100;

        this.elementToBeCentered = document.createElement("div");
        this.elementToBeCentered.style.width = this.elementSize + 'px';
        this.elementToBeCentered.style.height = this.elementSize + 'px';

        this.presenter.temporaryState = {
            scrollTop: 0
        };

        this.presenter.jQueryElementsCache = {
            $container: $(this.elementToBeCentered)
        };

        this.mocks = {
            getAvailableWidth: sinon.stub(this.presenter, "getAvailableWidth"),
            updateButtonMenuPosition: sinon.stub(this.presenter, "updateButtonMenuPosition")
        };
        this.mocks.getAvailableWidth.returns(this.windowWidth);
    },

    'test given no scroll top when calling centerPosition then window will be vertically at 25, horizontally at 50%': function () {
        this.presenter.temporaryState.scrollTop = 0;
        var expected = {
            top: 25,
            left: getExpectedWidth(this.windowWidth, this.elementSize)
        };


        this.presenter.centerPosition();

        var result = getPositionObject(this.elementToBeCentered);
        assertEquals(expected, result);
    },

    'test given scroll equal to 500 when calling centerPosition then window will be vertically at 25, horizontally at 50%': function () {
        this.presenter.temporaryState.scrollTop = 500;
        var expected = {
            top: 525,
            left: getExpectedWidth(this.windowWidth, this.elementSize)
        };

        this.presenter.centerPosition();

        var result = getPositionObject(this.elementToBeCentered);
        assertEquals(expected, result);
    }
});

