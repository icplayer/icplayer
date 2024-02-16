TestCase("[Writing Calculations] Create Elements Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    'test createRowWrapper method': function() {
        var rowWrapper = this.presenter.createRowWrapper(10);

        assertTrue(rowWrapper.hasClass("wrapper-row"));
        assertTrue(rowWrapper.attr("class").indexOf('row-11') >= 0 );
    },

    'test createElement method with different types': function() {
        // Given

        // When
        var createdElementSymbol = this.presenter.createElement(this.presenter.ELEMENT_TYPE.SYMBOL);
        var createdElementEmptyBox = this.presenter.createElement(this.presenter.ELEMENT_TYPE.EMPTY_BOX);
        var createdElementEmptySpace = this.presenter.createElement(this.presenter.ELEMENT_TYPE.EMPTY_SPACE);
        var createdElementLine = this.presenter.createElement(this.presenter.ELEMENT_TYPE.LINE);
        var createdElementNumber = this.presenter.createElement(this.presenter.ELEMENT_TYPE.NUMBER);
        var createdElementHelpBox = this.presenter.createElement(this.presenter.ELEMENT_TYPE.HELP_BOX);

        var containerSymbol = createdElementSymbol.children();
        var containerEmptyBox = createdElementEmptyBox.children();
        var containerEmptySpace = createdElementEmptySpace.children();
        var containerLine = createdElementLine.children();
        var containerNumber = createdElementNumber.children();
        var containerHelpBox = createdElementHelpBox.children();

        // Then
        assertTrue("", containerSymbol.hasClass("container-symbol"));
        assertTrue("", containerEmptyBox.hasClass("container-emptyBox"));
        assertTrue("", containerEmptySpace.hasClass("container-emptySpace"));
        assertTrue("", containerLine.hasClass("container-line"));
        assertTrue("", containerNumber.hasClass("container-number"));
        assertTrue("", containerHelpBox.hasClass("container-helpBox"));
    },

    'test createWrapperAndContainer method' : function() {
        // Given

        // When
        var wrapper = this.presenter.createWrapperAndContainer("number");

        // Then
        assertTrue("", wrapper.children().hasClass("container-number"));
    },

    'test createAnswer method' : function() {
        // Given
        var expectedAnswer = {
            "rowIndex":1,
            "cellIndex":2,
            "value":5
        };

        // When
        var answer = this.presenter.createAnswer(1, 2, 5);

        // Then
        assertEquals("", expectedAnswer, answer);
    }
});
