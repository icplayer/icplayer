function AddonLogger_create() {
    var presenter = function () {};

    presenter.run = function(view, model) {
        presenter.$view = $(view);

        jQuery.aop.around({ target:console, method:'log'}, function (invocation) {
            insertLogElement(invocation.arguments[0]);
            return invocation.proceed();
        });

        presenter.$view.find('.logger-clear').click(function () {
            presenter.$view.find('.log-element').remove();
            return false;
        });
    };

    function insertLogElement(logMessage) {
        var $element = $(document.createElement('div')), logDate = new Date(), formattedDate;
        formattedDate = logDate.getHours() + ":" + logDate.getMinutes() + ":" + logDate.getSeconds();

        $element.addClass('log-element');
        $element.text(formattedDate + ": " + logMessage);

        presenter.$view.find('.logger').append($element);
    }

    return presenter;
}