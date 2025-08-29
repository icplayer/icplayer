TestCase("[Text Identification] setPrintableState tests", {
    setUp: function () {
        this.presenter = Addontext_identification_create();
    },

    'test of set printable state when got state in current format': function() {
        const isSelectedPossibleStates = ["True", "true", "False", "false", "", "random"];
        const isSelectedExpectedStates = [true, false, false, false, false, false];

        const isVisiblePossibleStates = [true, false];
        const isVisibleExpectedStates = [true, false];

        const isDisabledPossibleStates = [true, false];
        const isDisabledExpectedStates = [true, false];

        for (var selectIdx = 0; selectIdx < isSelectedPossibleStates.length; selectIdx++) {
            for (var visibleIdx = 0; visibleIdx < isVisiblePossibleStates.length; visibleIdx++) {
                for (var disabledIdx = 0; disabledIdx < isDisabledPossibleStates.length; disabledIdx++) {
                    const state =
                        '{"isSelected":"' + isSelectedPossibleStates[selectIdx] + '",'
                         + '"isVisible":' + isVisiblePossibleStates[visibleIdx] + ','
                         + '"isDisabled":' + isDisabledPossibleStates[disabledIdx] + '}';
                    this.presenter.setPrintableState(state);

                    const expectedPrintableState = {
                        isSelected: isSelectedExpectedStates[selectIdx],
                        isVisible: isVisibleExpectedStates[visibleIdx],
                        isDisabled: isDisabledExpectedStates[disabledIdx]
                    };
                    const actualPrintableState = this.presenter.printableState;
                    assertEquals(expectedPrintableState, actualPrintableState);
                }
            }
        }
    },

    'test of set printable state when got state with to many arguments then discard the unnecessary': function() {
        const state = '{"isSelected":"False","NoNeeded1":true,"isVisible":true,"isDisabled":false,"NoNeeded2":true}';
        this.presenter.setPrintableState(state);

        const expectedPrintableState = {
            isSelected: false,
            isVisible: true,
            isDisabled: false
        };
        const actualPrintableState = this.presenter.printableState;
        assertEquals(expectedPrintableState, actualPrintableState);
    },

    'test of set printable state when empty state': function() {
        const possibleStates = [null, "", undefined];
        const expectedPrintableState = null;

        for (var i = 0; i < possibleStates.length; i++) {
            this.presenter.setPrintableState(possibleStates[i]);
            const actualPrintableState = this.presenter.printableState;
            assertEquals(expectedPrintableState, actualPrintableState);
        }
    },

    'test of set printable state when got state without isSelected then throw error': function() {
        const state = '{"isVisible":true,"isDisabled":false}';

        try {
            this.presenter.setPrintableState(state);
            fail("It should throw TypeError");
        } catch (exc) {}
    },

    'test of set printable state when got state without isVisible': function() {
        const state = '{"isSelected":"False","isDisabled":false}';
        this.presenter.setPrintableState(state);

        const expectedPrintableState = {
            isSelected: false,
            isDisabled: false
        };
        const actualPrintableState = this.presenter.printableState;
        assertEquals(expectedPrintableState, actualPrintableState);
    },

    'test of set printable state when got state without isDisabled': function() {
        const state = '{"isSelected":"False","isVisible":true}';
        this.presenter.setPrintableState(state);

        const expectedPrintableState = {
            isSelected: false,
            isVisible: true,
        };
        const actualPrintableState = this.presenter.printableState;
        assertEquals(expectedPrintableState, actualPrintableState);
    },

    'test of set printable state when got state in old format': function() {
        const isSelectedPossibleStates = ["True", "true", "False", "false", "random"];
        const isSelectedExpectedStates = [true, false, false, false, false];

        for (var selectIdx = 0; selectIdx < isSelectedPossibleStates.length; selectIdx++) {
            const state = isSelectedPossibleStates[selectIdx];
            this.presenter.setPrintableState(state);

            const expectedPrintableState = {
                isSelected: isSelectedExpectedStates[selectIdx]
            };
            const actualPrintableState = this.presenter.printableState;
            assertEquals(expectedPrintableState, actualPrintableState);
        }
    },

    'test given printableState with some value when setPrintableState is called with null then printableState should be null': function() {
        this.presenter.printableState = {
            isSelected: false,
            isVisible: true,
        };
        const newState = null;

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    },

    'test given printableState with some value when setPrintableState is called with empty string then printableState should be null': function() {
        this.presenter.printableState = {
            isSelected: false,
            isVisible: true,
        };
        const newState = "";

        this.presenter.setPrintableState(newState);

        assertNull(this.presenter.printableState);
    }
});
