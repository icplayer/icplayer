TestCase("[Crossword] Update direction of move tests", {
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
            "Marked row index": "",
            "autoNavigation": "Extended"
        };
    },

    // Extended auto navigation mode

    'test given horizontal direction and extended mode for auto navigation when calling update then do not change direction': function () {
        this.presenter.setHorizontalDirection();
        this.setExtendedAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given vertical direction and extended mode for auto navigation when calling update then do not change direction': function () {
        this.presenter.setVerticalDirection();
        this.setExtendedAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given TabIndex direction and extended mode for auto navigation when calling update then do not change direction': function () {
        this.presenter.setTabIndexDirection();
        this.setExtendedAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isTabIndexDirection());
    },

    'test no given direction and extended mode for auto navigation when calling update then do not set direction': function () {
        this.presenter.resetDirection();
        this.setExtendedAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isDirectionNotSet());
    },

    // Simple auto navigation mode

    'test given horizontal direction and simple mode for auto navigation when calling update then do not change direction': function () {
        this.presenter.setHorizontalDirection();
        this.setSimpleAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isHorizontalDirection());
    },

    'test given vertical direction and simple mode for auto navigation when calling update then do not change direction': function () {
        this.presenter.setVerticalDirection();
        this.setSimpleAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isVerticalDirection());
    },

    'test given TabIndex direction and simple mode for auto navigation when calling update then reset direction': function () {
        this.presenter.setTabIndexDirection();
        this.setSimpleAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test no given direction and simple mode for auto navigation when calling update then do not set direction': function () {
        this.presenter.resetDirection();
        this.setSimpleAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isDirectionNotSet());
    },

    // Off auto navigation mode

    'test given horizontal direction and off mode for auto navigation when calling update then reset direction': function () {
        this.presenter.setHorizontalDirection();
        this.setOffAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given vertical direction and off mode for auto navigation when calling update then reset direction': function () {
        this.presenter.setVerticalDirection();
        this.setOffAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test given TabIndex direction and off mode for auto navigation when calling update then reset direction': function () {
        this.presenter.setTabIndexDirection();
        this.setOffAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isDirectionNotSet());
    },

    'test no given direction and off mode for auto navigation when calling update then do not set direction': function () {
        this.presenter.resetDirection();
        this.setOffAutoNavigationMode();

        this.presenter.updateDirectionOfMoveRelativeToAutoNavigationMode();

        assertTrue(this.presenter.isDirectionNotSet());
    },

    setExtendedAutoNavigationMode: function () {
        this.model["autoNavigation"] = "Extended";
        this.presenter.readConfiguration(this.model);
    },

    setSimpleAutoNavigationMode: function () {
        this.model["autoNavigation"] = "Simple";
        this.presenter.readConfiguration(this.model);
    },

    setOffAutoNavigationMode: function () {
        this.model["autoNavigation"] = "Off";
        this.presenter.readConfiguration(this.model);
    },
});
