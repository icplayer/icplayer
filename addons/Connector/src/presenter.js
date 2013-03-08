function AddonConnector_create () {
    var presenter = function () {};

    presenter.ERROR_MESSAGES = {
        VT_01: "Each task has to be assigned to source Addon!",
        VT_02: "Each task must have Script section filled!"
    };

    var playerController;
    var eventBus;
    var tasks = [];

    presenter.setPlayerController = function (controller) {
        playerController = controller;
    };

    presenter.onEventReceived = function (eventName, eventData) {
        var scripts = presenter.findMatchingTasks(tasks, eventData);

        for (var i = 0, length = scripts.length; i < length; i += 1) {
            playerController.getCommands().executeEventCode(scripts[i]);
        }
    };

    presenter.createPreview = function (view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };

    function presenterLogic (view, model, isPreview) {
        var validatedTasks = presenter.validateTasks(model.Tasks);

        if (validatedTasks.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_MESSAGES, validatedTasks.errorCode);
            return;
        }

        if (isPreview) return;

        tasks = validatedTasks.tasks;
        eventBus = playerController.getEventBus();
        eventBus.addEventListener('ValueChanged', presenter);

        presenter.setVisibility(view, false);
    }

    presenter.setVisibility = function (view, isVisible) {
        $(view).css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.getTaskWithSource = function (tasks, source) {
        for (var i = 0, length = tasks.length; i < length; i += 1) {
            if (tasks[i].source === source) return { index: i, tasks: tasks[i].tasks };
        }

        return { index: -1 };
    };

    presenter.addTask = function (tasks, task) {
        var index = presenter.getTaskWithSource(tasks, task.source).index;

        if (index === -1) {
            tasks.push(task);
        } else {
            var existingTask = tasks[index];

            for (var i = 0, length = task.tasks.length; i < length; i += 1) {
                existingTask.tasks.push(task.tasks[i]);
            }

        }
    };

    presenter.validateTask = function (task) {
        var isEmpty = ModelValidationUtils.isArrayElementEmpty(task);

        if (!isEmpty && !task.Source) return { isError: true, errorCode: "VT_01" };
        if (!isEmpty && !task.Script) return { isError: true, errorCode: "VT_02" };

        return {
            isError: false,
            isEmpty: isEmpty,
            task: {
                source: task.Source,
                tasks: [{
                    item: task.Item,
                    value: task.Value,
                    score: task.Score,
                    script: task.Script
                }]
            }
        };
    };

    presenter.validateTasks = function (tasks) {
        if (ModelValidationUtils.isArrayEmpty(tasks)) return { tasks: [], isError: false };

        var tasksArray = [];
        var isError = false;

        for (var i = 0, length = tasks.length; i < length; i += 1) {
            var validatedTask = presenter.validateTask(tasks[i]);

            if (validatedTask.isError) return { isError: true, errorCode: validatedTask.errorCode };

            presenter.addTask(tasksArray, validatedTask.task);
        }

        return { tasks: tasksArray, isError: isError };
    };

    presenter.FILTER_FIELD = {
        ITEM: 0,
        VALUE: 1,
        SCORE: 2
    };

    presenter.filterTasks = function (tasks, value, field) {
        var filteredTasks = [];

        for (var i = 0, length = tasks.length; i < length; i += 1) {
            var fieldValue = "";
            switch (field) {
                case presenter.FILTER_FIELD.ITEM:
                    fieldValue = tasks[i].item;
                    break;
                case presenter.FILTER_FIELD.VALUE:
                    fieldValue = tasks[i].value;
                    break;
                case presenter.FILTER_FIELD.SCORE:
                    fieldValue = tasks[i].score;
                    break;
            }

            if (fieldValue !== '') {
                var isWildcardExpression = fieldValue.indexOf('*') !== -1;
                fieldValue = fieldValue.replace('*', '.*');
                var fieldRegExp = new RegExp(fieldValue);

                if (value.match(fieldRegExp)) {
                    if (isWildcardExpression) {
                        filteredTasks.push(tasks[i]);
                    } else  if (fieldValue.length === value.length) {
                        filteredTasks.push(tasks[i]);
                    }
                }
            } else {
                if (value === fieldValue) {
                    filteredTasks.push(tasks[i]);
                }
            }
        }

        return filteredTasks;
    };

    presenter.findMatchingTasks = function (tasks, eventData) {
        var matchingTasks = [];
        var i = 0, length = 0;


        var taskWithSource = presenter.getTaskWithSource(tasks, eventData.source);
        if (taskWithSource.index === -1) {
            return [];
        }

        for (i = 0, length = taskWithSource.tasks.length; i < length; i += 1) {
            matchingTasks.push(taskWithSource.tasks[i]);
        }

        var tasksFilteredByItem = presenter.filterTasks(matchingTasks, eventData.item, presenter.FILTER_FIELD.ITEM);
        var tasksFilteredByValue = presenter.filterTasks(tasksFilteredByItem, eventData.value, presenter.FILTER_FIELD.VALUE);
        var tasksFilteredByScore = presenter.filterTasks(tasksFilteredByValue, eventData.score, presenter.FILTER_FIELD.SCORE);

        var scriptArray = [];
        for (i = 0, length = tasksFilteredByScore.length; i < length; i += 1) {
            scriptArray.push(tasksFilteredByScore[i].script);
        }

        return scriptArray;
    };

    return presenter;
}