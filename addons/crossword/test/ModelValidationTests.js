TestCase("Model validation", {
    setUp: function() {
        this.presenter = Addoncrossword_create();

        this.model = {
            "ID": "crossword1",
            "Crossword" : "!E!N!GLISH\n   O   \n NEVER \n E E   \n W     ",
            "Columns": "7",
            "Rows": "5",
            "Cell width": "40",
            "Cell height": "40",
            "Blank cells border color": "black",
            "Blank cells border style": "",
            "Blank cells border width": "0",
            "Letter cells border color": "#aaa",
            "Letter cells border style": "",
            "Letter cells border width": "1",
            "Word numbers": "",
            "Marked column index": "4",
            "Marked row index": ""
        }
    },

    'test proper model': function() {
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertFalse(validatedModel.isError);
    },

    'test empty amount of rows property': function() {
        this.model["Rows"] = "";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ROWS_NOT_SPECIFIED, validatedModel.errorMessage);
    },

    'test empty amount of columns property': function() {
        this.model["Columns"] = "";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.COLUMNS_NOT_SPECIFIED, validatedModel.errorMessage);
    },

    'test negative marked column index': function() {
        this.model["Marked column index"] = "-3";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.INVALID_MARKED_COLUMN_INDEX, validatedModel.errorMessage);
    },

    'test negative marked row index': function() {
        this.model["Marked row index"] = "-2";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.INVALID_MARKED_ROW_INDEX, validatedModel.errorMessage);
    },

    'test empty cell width property': function() {
        this.model["Cell width"] = "";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.CELL_WIDTH_NOT_SPECIFIED, validatedModel.errorMessage);
    },

    'test empty cell height property': function() {
        this.model["Cell height"] = "";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.CELL_HEIGHT_NOT_SPECIFIED, validatedModel.errorMessage);
    },

    'test negative blank cell border width property': function() {
        this.model["Blank cells border width"] = "-1";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.INVALID_BLANK_CELLS_BORDER_WIDTH, validatedModel.errorMessage);
    },

    'test negative letter cell border width property': function() {
        this.model["Letter cells border width"] = "-2";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.INVALID_LETTER_CELLS_BORDER_WIDTH, validatedModel.errorMessage);
    },

    'test different amount of lines and rows': function() {
        this.model["Rows"] = "9";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.INVALID_AMOUNT_OF_ROWS_IN_CROSSWORD, validatedModel.errorMessage);
    },

    'test different amount of characters and columns': function() {
        this.model["Columns"] = "100";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.INVALID_AMOUNT_OF_COLUMNS_IN_CROSSWORD, validatedModel.errorMessage);
    },

    'test doubled exclamation marks': function() {
        this.model["Crossword"] = "!E!N!GLISH\n   O   \n NE!!VER \n E E   \n W     ";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.DOUBLED_EXCLAMATION_MARK, validatedModel.errorMessage);
    },

    'test last character exclamation mark': function() {
        this.model["Crossword"] = "!E!N!GLISH\n   O   \n NEVER \n E E   !\n W     ";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.LAST_CHARACTER_EXCLAMATION_MARK, validatedModel.errorMessage);
    },

    'test exclamation mark before empty field': function() {
        this.model["Crossword"] = "!E!N!GLISH\n   O   \n NEVER \n E E !  \n W     ";
        var validatedModel = this.presenter.readConfiguration(this.model);
        assertTrue(validatedModel.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.EXCLAMATION_MARK_BEFORE_EMPTY_FIELD, validatedModel.errorMessage);
    }
});