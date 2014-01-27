/**
 * @module commons
 */
(function (window) {
    /**
     Promise extending object utils.
     @class LoadedPromise
     */

    // Expose utils to the global object
    window.LoadedPromise = function(object, config){
        /**
         Extends the object with the methods responsible for observing if addon has loaded media and/or LaTeX

         @param object {Object} the object that will be extended
         @param config {Object} the configuration
         */

        var promisesToCreate = config,
            createdPromises = [];

        $.each(promisesToCreate, function(key, _) {
            var promisePrefix = key,
                deferred = new $.Deferred(),
                promise = deferred.promise();

            object[promisePrefix + 'LoadedDeferred'] = deferred;
            object[promisePrefix + 'Loaded'] = promise;

            createdPromises.push(promise);

            object['getLoadedPromise'] = function() {
                var allPromisesDeferred = new $.Deferred(),
                    resolvePromise = function(promises, i) {
                        if (i == promises.length) {
                            allPromisesDeferred.resolve();
                            return;
                        }
                        $.when(promises[i]).then(function() {
                            resolvePromise(promises, i + 1);
                        });
                    };

                resolvePromise(createdPromises, 0);

                return allPromisesDeferred.promise();
            };
        });
    };

})(window);