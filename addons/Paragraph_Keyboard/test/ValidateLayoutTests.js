TestCase("[Paragraph Keyboard] validateLayout", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
    },

    'test given predefined french layoutType when validateLayout is called then returns valid layout': function () {
        // given
        const keyboardLayout = {};
        const layoutType = 'french (special characters)';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertNotUndefined(result.value);
        assertEquals("", result.errorCode);
    },

    'test given predefined german layoutType when validateLayout is called then returns valid layout': function () {
        // given
        const keyboardLayout = {};
        const layoutType = 'german (special characters)';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertNotUndefined(result.value);
        assertEquals("", result.errorCode);
    },

    'test given predefined spanish layoutType when validateLayout is called then returns valid layout': function () {
        // given
        const keyboardLayout = {};
        const layoutType = 'spanish (special characters)';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertNotUndefined(result.value);
        assertEquals("", result.errorCode);
    },

    'test given not existing layoutType when validateLayout is called then returns defaultLayoutError': function () {
        // given
        const keyboardLayout = {};
        const layoutType = 'not existing layout type';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(false, result.isValid);
        assertEquals("defaultLayoutError", result.errorCode);
    },

    'test given layout without default key when validateLayout is called then returns defaultLayoutError': function () {
        // given
        const keyboardLayout = "{ shift: ['A B C'] }";
        const layoutType = '';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(false, result.isValid);
        assertEquals("defaultLayoutError", result.errorCode);
    },

    'test given layout and top position when validateLayout is called then layout will not be transposed': function () {
        // given
        const keyboardLayout = "{ default: ['A B', 'C D'] }";
        const layoutType = '';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertEquals(["A","B"], result.value.default[0]);
        assertEquals(["C","D"], result.value.default[1]);
    },

    'test given layout and bottom position when validateLayout is called then layout will not be transposed': function () {
        // given
        const keyboardLayout = "{ default: ['A B', 'C D'] }";
        const layoutType = '';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertEquals(["A","B"], result.value.default[0]);
        assertEquals(["C","D"], result.value.default[1]);
    },

    'test given layout and custom position when validateLayout is called then layout will not be transposed': function () {
        // given
        const keyboardLayout = "{ default: ['A B', 'C D'] }";
        const layoutType = '';
        const keyboardPosition = 'custom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertEquals(["A","B"], result.value.default[0]);
        assertEquals(["C","D"], result.value.default[1]);
    },

    'test given layout and left position when validateLayout is called then layout is transposed': function () {
        // given
        const keyboardLayout = "{ default: ['A B', 'C D'] }";
        const layoutType = '';
        const keyboardPosition = 'left';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertEquals(["A","C"], result.value.default[0]);
        assertEquals(["B","D"], result.value.default[1]);
    },

    'test given layout and right position when validateLayout is called then layout is transposed': function () {
        // given
        const keyboardLayout = "{ default: ['A B', 'C D'] }";
        const layoutType = '';
        const keyboardPosition = 'right';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertEquals(["A","C"], result.value.default[0]);
        assertEquals(["B","D"], result.value.default[1]);
    },

    'test given layout with alt texts when validateLayout is called then returns valid layout': function () {
        // given
        const keyboardLayout = "{ default: ['A B', '\\alt{C|letter C} D'] }";
        const layoutType = '';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertEquals(["A","B"], result.value.default[0]);
        assertEquals(["\\alt{C|letter C}","D"], result.value.default[1]);
    },

    'test given layout with alt texts and language when validateLayout is called then returns valid layout': function () {
        // given
        const keyboardLayout = "{ default: ['A B', '\\alt{C|letter C}[lang pl] D'] }";
        const layoutType = '';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertEquals(["A","B"], result.value.default[0]);
        assertEquals(["\\alt{C|letter C}[lang pl]","D"], result.value.default[1]);
    },

    'test given layout with alt texts for multiple characters when validateLayout is called then returns valid layout': function () {
        // given
        const keyboardLayout = "{ default: ['A B', '\\alt{H2O|Woda} D'] }";
        const layoutType = '';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(true, result.isValid);
        assertEquals(["A","B"], result.value.default[0]);
        assertEquals(["\\alt{H2O|Woda}","D"], result.value.default[1]);
    },

    'test given layout with alt texts for multiple characters separated by white space when validateLayout is called then returns evaluationError': function () {
        // given
        const keyboardLayout = "{ default: ['A B', '\\alt{H 2 O|Woda} D'] }";
        const layoutType = '';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(false, result.isValid);
        assertEquals("evaluationError", result.errorCode);
    },

    'test given layout with alt texts next to alt text when validateLayout is called then returns evaluationError': function () {
        // given
        const keyboardLayout = "{ default: ['A B', '\\alt{H2O|Woda}\\alt{CH2|Metanol} D'] }";
        const layoutType = '';
        const keyboardPosition = 'bottom';

        // when
        const result = this.presenter.validateLayout(keyboardLayout, layoutType, keyboardPosition);

        // then
        assertEquals(false, result.isValid);
        assertEquals("evaluationError", result.errorCode);
    }
});
