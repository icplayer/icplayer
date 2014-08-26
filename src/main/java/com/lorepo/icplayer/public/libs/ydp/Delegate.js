//namespace
window.ydpjs_1_0_0_0 = window.ydpjs_1_0_0_0||{};

(function(wnd){

	/**
	 * Delegate util.
	*/
	var Delegate = function(){}

	/**
	 * Delegates method call.
	 * @param thisTarget object which will be available as 'this' inside method
	 * @param functionRef reference to method that will be delegated
	 * @param args additional arguments which will be passed to delegated method
	 * @return reference to delegated method
	*/
	Delegate.create = function(thisTarget, functionRef, args){
		var delegateArgs = Array.prototype.slice.call(arguments);
		delegateArgs = delegateArgs.slice(2);

		return function(){
			var newArgs = Array.prototype.slice.call(arguments).concat(delegateArgs);
			functionRef.apply(thisTarget, newArgs);
		}
	}

	wnd.ydpjs_1_0_0_0.Delegate = Delegate;

}(window));