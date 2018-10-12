TestCase("[eKeyboard] Destroying keyboard tests", {
   setUp: function () {
       this.presenter = AddoneKeyboard_create();
	   this.presenter.keyboardWrapper = document.createElement('div');
	   this.presenter.view = document.createElement('div');
   },

    "test while configuration is not set when destroy is called then method should stop": function () {

		var first = true;
		var calledMultipleTimes = false;

		Object.defineProperty(this.presenter,'configuration', {get: function() {
			if (first) {
			    // on first call, act as if configuration is empty
				first = false;
				return null;
			}
			calledMultipleTimes = true;
			// otherwise return stub
			return {$inputs: $('div')};
		}});
		var openButtonElement = document.createElement('div');

		this.presenter.destroy();

        assertFalse(calledMultipleTimes);
    },
});