TestCase("Create Elements Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
    },

    'test createRowWrapper method': function() {
        // Given
        var index = 10;

        // When
        var rowWrapper = this.presenter.createRowWrapper(index);

        // Then
        assertTrue("", rowWrapper.hasClass("wrapper-row"));
        assertEquals("", index, rowWrapper.attr("id"));
    },

    'test createElement method with different types': function() {
        // Given
        var value = 8;

        // When
        var createdElementSymbol = this.presenter.createElement(value, this.presenter.ELEMENT_TYPE.SYMBOL);
        var createdElementEmptyBox = this.presenter.createElement(value, this.presenter.ELEMENT_TYPE.EMPTY_BOX);
        var createdElementEmptySpace = this.presenter.createElement(value, this.presenter.ELEMENT_TYPE.EMPTY_SPACE);
        var createdElementLine = this.presenter.createElement(value, this.presenter.ELEMENT_TYPE.LINE);
        var createdElementNumber = this.presenter.createElement(value, this.presenter.ELEMENT_TYPE.NUMBER);
        var containerSymbol = createdElementSymbol.children();
        var containerEmptyBox = createdElementEmptyBox.children();
        var containerEmptySpace = createdElementEmptySpace.children();
        var containerLine = createdElementLine.children();
        var containerNumber = createdElementNumber.children();

        // Then
        assertTrue("", containerSymbol.hasClass("container-symbol"));
        assertTrue("", containerEmptyBox.hasClass("container-emptyBox"));
        assertTrue("", containerEmptySpace.hasClass("container-emptySpace"));
        assertTrue("", containerLine.hasClass("container-line"));
        assertTrue("", containerNumber.hasClass("container-number"));
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