TestCase("Next and previous commands", {
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

        sinon.stub(this.presenter, 'setResponse');
    },

    tearDown: function () {
        this.presenter.setResponse.restore();
    },

    'test next command called when default response was displayed': function() {
        this.presenter.currentStateDefault = true;

        this.presenter.next();

        assertTrue(this.presenter.setResponse.calledOnce);
    },

    'test previous command called when default response was displayed': function() {
        this.presenter.currentStateDefault = true;

        this.presenter.previous();

        assertFalse(this.presenter.setResponse.calledOnce);
    },

    'test next command called when second response was displayed': function() {
        this.presenter.currentStateDefault = false;
        this.presenter.currentStateId = 'RES-2';

        this.presenter.next();

        assertTrue(this.presenter.setResponse.calledOnce);
    },

    'test previous command called when second response was displayed': function() {
        this.presenter.currentStateDefault = false;
        this.presenter.currentStateId = 'RES-2';

        this.presenter.previous();

        assertTrue(this.presenter.setResponse.calledOnce);
    },

    'test next command called when last response was displayed': function() {
        this.presenter.currentStateDefault = false;
        this.presenter.currentStateId = 'RES-5';

        this.presenter.next();

        assertFalse(this.presenter.setResponse.calledOnce);
    },

    'test previous command called when last response was displayed': function() {
        this.presenter.currentStateDefault = false;
        this.presenter.currentStateId = 'RES-5';

        this.presenter.previous();

        assertTrue(this.presenter.setResponse.calledOnce);
    }
});