TestCase("[Feedback] GetResponseIndex tests", {
    setUp: function () {
        this.presenter = Addonfeedback_create();
        this.presenter.model = {
            Responses: [
                {'Unique response ID': 'RES-1'},
                {'Unique response ID': 'RES-2'},
                {'Unique response ID': 'RES-3'},
                {'Unique response ID': 'RES-4'},
                {'Unique response ID': 'RES-5'}
            ]
        };
    },

    'test given proper response ID when exectuing command then returns its index': function() {
        var index = this.presenter.executeCommand("getresponseindex", "RES-1");
        assertEquals(0, index);

        index = this.presenter.executeCommand("getresponseindex", "RES-5");
        assertEquals(4, index);
    },

    'test given not proper response ID when exectuing command then returns -1': function() {
        var index = this.presenter.executeCommand("getresponseindex", "Unique response ID");

        assertEquals(-1, index);
    }
});