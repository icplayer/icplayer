function getElementClassesAsArray($element) {
    return $element[0].className.split(/\s+/);
}

TestCase("[TextColoring]", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.$element = $('<div></div>');
    },

    'test should remove class text-coloring-show-answers-red from element': function () {
        this.$element.addClass('text-coloring-show-answers-red');

        this.presenter.removeShowAnswerClasses(this.$element);
        var expected = [''];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test should remove class text-coloring-show-answers-red and ...-blue from element': function () {
        this.$element.addClass('text-coloring-show-answers-red');
        this.$element.addClass('text-coloring-show-answers-blue');

        this.presenter.removeShowAnswerClasses(this.$element);
        var expected = [''];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test should remove only class text-coloring-show-answers-red from element': function () {
        this.$element.addClass('text-coloring-show-answers-red');
        this.$element.addClass('text_coloring_class');

        this.presenter.removeShowAnswerClasses(this.$element);
        var expected = ['text_coloring_class'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test should not remove any from element': function () {
        this.$element.addClass('text_coloring_show');
        this.$element.addClass('text_coloring_class');

        this.presenter.removeShowAnswerClasses(this.$element);
        var expected = ['text_coloring_show', 'text_coloring_class'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test should not remove any from element': function () {
        this.$element.addClass('text_coloring_show');
        this.$element.addClass('text_coloring_class');

        this.presenter.removeShowAnswerClasses(this.$element);
        var expected = ['text_coloring_show', 'text_coloring_class'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test should remove text-coloring-show-answers-blue class from element': function () {
        this.$element.addClass('text_coloring_show');
        this.$element.addClass('text-coloring-show-answers-blue');
        this.$element.addClass('text_coloring_class');

        this.presenter.removeShowAnswerClasses(this.$element);
        var expected = ['text_coloring_show', 'text_coloring_class'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test element should contain text-coloring-show-answers-blue class': function () {
        this.presenter.addShowAnswerClass(this.$element, 'blue');

        var expected = ['text-coloring-show-answers-blue'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    },

    'test should add text-coloring-show-answers-blue class to element': function () {
        this.$element.addClass('test_class');
        this.presenter.addShowAnswerClass(this.$element, 'blue');

        var expected = ['test_class', 'text-coloring-show-answers-blue'];
        var result = getElementClassesAsArray(this.$element);
        assertEquals(expected, result);
    }

});