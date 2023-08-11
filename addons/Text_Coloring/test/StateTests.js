TestCase("[Text_Coloring] getState/setState", {
    setUp: function () {
        var TOKENS_TYPES = {
            WORD: "word",
            SELECTABLE: "selectable",
            NEW_LINE: "new_line",
            SPACE: "space"
        };


        function getFilteredToken(index, isSelected, selectionColorID, type, value) {
            return {
                index: index,
                isSelected: isSelected,
                selectionColorID: selectionColorID,
                type: type,
                value: value
            };
        }


        this.presenter = new AddonText_Coloring_create();
        this.presenter.configuration = {

        };
        this.tokens = [
            getFilteredToken(0, false, null, TOKENS_TYPES.WORD, "asd"),
            getFilteredToken(1, true, "red", TOKENS_TYPES.SELECTABLE, "red"),
            getFilteredToken(2, false, null, TOKENS_TYPES.NEW_LINE, ""),
            getFilteredToken(3, false, null, TOKENS_TYPES.SPACE, ""),
        ];

        this.presenter.configuration.filteredTokens = this.tokens;

        this.stringifiedStateNotVisible = JSON.stringify({
            isVisible: false,
            tokens: this.tokens
        });

        this.stringifiedStateVisible = JSON.stringify({
            isVisible: true,
            tokens: this.tokens
        });

        this.stubs = {
            colorAllMarkedTokens: sinon.stub(this.presenter, 'colorAllMarkedTokens'),
            show: sinon.stub(this.presenter, 'show'),
            hide: sinon.stub(this.presenter, 'hide')
        };
    },

    tearDown: function () {
        this.presenter.colorAllMarkedTokens.restore();
        this.presenter.show.restore();
        this.presenter.hide.restore();
    },

    'test getState should return filtered tokens stringified': function () {
        this.presenter.configuration.isVisible = false;
        var result = this.presenter.getState();

        assertEquals(JSON.parse(this.stringifiedStateNotVisible), JSON.parse(result));
    },

    'test getState should return actual isVisible state': function () {
        this.presenter.configuration.isVisible = false;
        assertFalse(JSON.parse(this.presenter.getState()).isVisible);

        this.presenter.configuration.isVisible = true;
        assertTrue(JSON.parse(this.presenter.getState()).isVisible);
    },

    'test set state should do nothing when state is empty': function () {
        this.presenter.configuration.filteredTokens = undefined;
        this.presenter.setState("");

        assertFalse(this.stubs.colorAllMarkedTokens.called);
        assertUndefined(this.presenter.configuration.filteredTokens);
    },

    'test set state should do nothing when state is undefined': function () {
        this.presenter.configuration.filteredTokens = undefined;
        this.presenter.setState(undefined);

        assertFalse(this.stubs.colorAllMarkedTokens.called);
        assertFalse(this.stubs.hide.called);
        assertUndefined(this.presenter.configuration.filteredTokens);
    },

    'test set state should set filtered tokens from state string': function () {
        this.presenter.setState(this.stringifiedStateNotVisible);

        assertNotUndefined(this.presenter.configuration.filteredTokens);
        assertEquals(this.tokens, this.presenter.configuration.filteredTokens);
    },

    'test set state should mark all colored tokens': function () {
        this.presenter.setState(this.stringifiedStateNotVisible);

        assertTrue(this.stubs.colorAllMarkedTokens.calledOnce);
    },

    'test set state should hide if addon is not visible': function () {
        this.presenter.setState(this.stringifiedStateNotVisible);

        assertTrue(this.stubs.hide.calledOnce);
        assertFalse(this.presenter.configuration.isVisible);
    },

    'test set state should show if addon is visible': function () {
        this.presenter.setState(this.stringifiedStateVisible);

        assertTrue(this.stubs.show.calledOnce);
        assertTrue(this.presenter.configuration.isVisible);
    }
});