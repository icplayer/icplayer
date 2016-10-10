/**
 * @module commons
 */
(function (window) {
    function ModelErrorUtils () {

    }

    ModelErrorUtils.getErrorObject = function (errorCode) {
        return {
            isValid: false,
            isError: true,
            errorCode: errorCode
        };
    };

    ModelErrorUtils.showErrorMessage = function (view, message, substitutions) {
        var errorContainer;
        if (typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for (var key in substitutions) {
                if (substitutions.hasOwnProperty(key)) {
                    messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
                }
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }

        view.innerHTML = errorContainer;
    };

    window.ModelErrorUtils = window.ModelErrorUtils || ModelErrorUtils;
})(window);