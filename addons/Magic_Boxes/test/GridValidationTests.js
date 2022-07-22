TestCase("[Magic Boxes] Grid validation test", {
    setUp: function () {
        this.presenter = AddonMagic_Boxes_create();
    },

    'test grid undefined': function () {
        var validationResult = this.presenter.validateGrid();

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.GRID_NOT_PROVIDED, validationResult.errorMessage);
    },

    'test grid empty': function () {
        var validationResult = this.presenter.validateGrid("");

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.GRID_NOT_PROVIDED, validationResult.errorMessage);
    },

    'test missing row': function () {
        var grid = "sofiaw\n"
                 + "\n"
                 + "osloem\n"
                 + "pwiln\n"
                 + "jkrzym\n"
                 + "ezudav";

        var validationResult = this.presenter.validateGrid(grid);

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ROWS, validationResult.errorMessage);
    },

    'test missing column element': function () {
        var grid = "sofiaw\n"
                 + "karuti\n"
                 + "osloem\n"
                 + "pwiln\n"
                 + "jkrzym\n"
                 + "ezudav";

        var validationResult = this.presenter.validateGrid(grid);

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.COLUMNS, validationResult.errorMessage);
    },

    'test extra column element': function () {
        var grid = "sofiaw\n"
                 + "karuti\n"
                 + "osloem\n"
                 + "pwilnoo\n"
                 + "jkrzym\n"
                 + "ezudav";

        var validationResult = this.presenter.validateGrid(grid);

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.COLUMNS, validationResult.errorMessage);
    },

    'test different rows and columns length': function () {
        var grid = "test\n"
                 + "test\n"
                 + "test";

        var validationResult = this.presenter.validateGrid(grid);

        assertFalse(validationResult.isError);
        assertEquals(3, validationResult.rows);
        assertEquals(4, validationResult.columns);
    },

    'test comma element': function () {
        var grid = "sofiaw\n"
                 + "karuti\n"
                 + "osloem\n"
                 + "pwilnoo\n"
                 + ",krzym\n"
                 + "ezudav";

        var validationResult = this.presenter.validateGrid(grid);

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.COLUMNS, validationResult.errorMessage);
    },

    'test semicolon': function () {
        var grid = "sofiaw\n"
                 + "karut;\n"
                 + "osloem\n"
                 + "pwilnoo\n"
                 + "jkrzym\n"
                 + "ezudav";

        var validationResult = this.presenter.validateGrid(grid);

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ROWS, validationResult.errorMessage);
    },

    'test whitespaces': function () {
        var grid = "sofiaw\n"
                 + "k rut \n"
                 + "osloem\n"
                 + "pwilnoo\n"
                 + "jkrzym\n"
                 + "ezudav";

        var validationResult = this.presenter.validateGrid(grid);

        assertTrue(validationResult.isError);
        assertEquals(this.presenter.ERROR_MESSAGES.ROWS, validationResult.errorMessage);
    }
});