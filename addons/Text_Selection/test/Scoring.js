TestCase('[Text Selection] scoring tests', {
    setUp : function() {
        this.presenter = AddonText_Selection_create();
        this.presenter.$view = $('<div><div class="text_selection"></div></div>');

        this.presenter.$view
        .find('.text_selection').append($('<span number="4" class="selected">a</span>'))
        .find('.text_selection').append($('<span number="5" class="selected">b</span>'))
        .find('.text_selection').append($('<span number="6" class="selected">c</span>'));

        $('<div class="text_selection"><span number="4" class="selected">a</span><span number="5" class="selected">b</span><span number="6" class="selected">c</span></div>');
    },

    'test getErrorCount noerrors' : function() {
        this.presenter.markers = { markedWrong: [1,2,3] };

        var errors = this.presenter.getErrorCount();

        assertEquals(0, errors);
    },

    'test getErrorCount one error' : function() {
        this.presenter.markers = { markedWrong: [1,2,4] };
        
        var errors = this.presenter.getErrorCount();

        assertEquals(1, errors);
    },

    'test getMaxScore equals zero' : function() {
        this.presenter.markers = { markedCorrect: [] };

        var maxScore = this.presenter.getMaxScore();

        assertEquals(0, maxScore);
    },

    'test getMaxScore equals one' : function() {
        this.presenter.markers = { markedCorrect: [1] };

        var maxScore = this.presenter.getMaxScore();

        assertEquals(1, maxScore);
    },

    'test getScore equals zero' : function() {
        this.presenter.markers = { markedCorrect: [1,2,3] };

        var score = this.presenter.getScore();

        assertEquals(0, score);
    },

    'test getScore equals one' : function() {
        this.presenter.markers = { markedCorrect: [1,2,4] };
        
        var score = this.presenter.getScore();

        assertEquals(1, score);
    }
});