function Addondnd_ordering_create(){
			
			var presenter = function(){}

			var element;
            var $view = null;
            var id = null;
            var selectedItem = null;
            var lastAddedItem = null;
            var answers = [];
            var originAnswers = [];
            var isGapOrdering = false;
            var itemWidth = null;
            var itemHeight = null;
            var ignoreOrder = false;
            var mode = 0;  // 0 - running, 1 - setShowErrorsMode 3 - showAnswers
			
            presenter.setPlayerController = function(controller) {
                presenter.playerController = controller;
                presenter.eventBus = presenter.playerController.getEventBus();
                presenter.setUpEvents();

            };

            presenter.onEventReceived = function (eventName, eventData) {
                console.log(eventName, eventData);      
                if (eventName === 'ItemSelected') {
                    selectedItem = eventData;
                } else if (eventName === 'ShowAnswers') {
                    presenter.showAnswers();
                } else if (eventName === 'HideAnswers') {
                    presenter.hideAnswers();
                }
            }

            presenter.showAnswers = function () {
                if (mode == 1) {
                    presenter.setWorkMode();
                }

                mode = 3;
                $view.children().each(function (indx, element) {
                    element.classList.add('ic_element_showAnswer');
                });

                originAnswers.forEach(function (element) {
                    var div = document.createElement('div');
                    div.classList.add('ic_sourceListItem');
                    div.classList.add('ic_element_showAnswer_el');
                    div.classList.add('init')
                    div.style.display = "inherit";
                    div.innerHTML = element;

                    if (isGapOrdering) {
                        div.style.top = "-1px";
                        div.style.left = "-1px";
                    }

                    presenter.setElementSize(div);

                    $view.append(div);
                });
            }

            presenter.hideAnswers = function () {
                if (mode !== 3) {
                    return;
                }

                mode = 0;

                $view.children().each(function (index, element) {
                    if (element.classList.contains('ic_element_showAnswer')) {
                        element.classList.remove('ic_element_showAnswer');
                    } else {
                        $(element).remove();
                    }
                });
            }

            presenter.setUpEvents = function () {
                presenter.eventBus.addEventListener ('ItemSelected', this);
                presenter.eventBus.addEventListener ('ItemConsumed', this);
                presenter.eventBus.addEventListener('ShowAnswers', this);
                presenter.eventBus.addEventListener('HideAnswers', this);
            }

			presenter.run = function(view, model){
                id = model['ID']
                presenter.init(view, model);
			}

            presenter.sendRemoveEvent = function (event) {
                presenter.eventBus.sendEvent("ItemReturned", event);
            }

            presenter.buildStartingElements = function ($view, model) {
                model['startingvalues'].map(function (element) {
                    if (element['value'] === "") {
                        return null;
                    }
                    var div = document.createElement('div');
                    div.classList.add('ic_sourceListItem');
                    div.classList.add('init')
                    if (isGapOrdering) {
                        div.style.top = "-1px";
                        div.style.left = "-1px";
                    }

                    presenter.setElementSize(div);

                    div.style.display = "inherit";
                    div.innerHTML = element['value'];

                    return div;
                }).forEach(function(element) {
                    if (element === null) {
                        return;
                    }
                    $view.append(element);
                    // $(element).draggable({
                    //     helper: "clone",
                    //     connectToSortable: "#" + id
                    // })
                });
            }

            presenter.init = function (view, model) {
                view.classList.add('dndsortable')
                $view = $(view);
                isGapOrdering = model['isGapOrdering'] === 'True';
                ignoreOrder = model['ignoreOrder'] === 'True';
                if (isGapOrdering) {
                    $view.addClass('ordering');
                }

                itemWidth = model['itemWidth'] > 0 ? model['itemWidth'] : null;
                itemHeight = model['itemHeight'] > 0 ? model['itemHeight'] : null;

                answers = model['correctorder'].map(function (element) {
                    return element.value.trim() === '' ? null : element.value.trim();
                }).filter(function (element) {
                    return element !== null;
                }).map(function (element) {
                    return $("<div>" + element + "</div>").text();
                });

                originAnswers = model['correctorder'].map(function (element) {
                    return element.value.trim() === '' ? null : element.value.trim();
                }).filter(function(element) {
                    return element !== null;
                });



                if (!isGapOrdering) {
                    $view.sortable({
                        items: ".ic_sourceListItem:not(.ic_element_works_mode,.ic_element_showAnswer_el)",
                        sort: function () {
                            if (mode === 0) {
                                presenter.eventBus.sendEvent("ValueChanged", {source: id});
                            }
                            $(this).removeClass("ui-state-default");
                        },
                        receive : function(event, ui) {
                            var event = lastAddedItem;
                            if(event){
                                $(this).data().sortable.currentItem[0].classList.remove('ic_sourceListItem-selected');
                                $(this).data().sortable.currentItem[0].setAttribute('data-item', event['item']);
                                $(this).data().sortable.currentItem.style('visibility', 'visible');
                                $(this).data().sortable.currentItem.on('click', function () {
                                    presenter.sendRemoveEvent(event);
                                    $(this)[0].style.display = 'none';
                                });
                            }else{
                                $(this).data().sortable.currentItem[0].classList.remove('ic_sourceListItem-selected');
                                $(this).data().sortable.currentItem[0].remove();
                                $(this).data().sortable.currentItem.on('click', function () {
                                    presenter.sendRemoveEvent(event);
                                });
                            }
                        }
                    });
                }
      
                $view.droppable({
                    accept: function () {
                        return true;
                    },
                    drop: function (event, ui) {
                        if (selectedItem) {
                            console.log("childer all  "+ $view.children());
                            console.log("answer "+ originAnswers.length);
                            console.log($view.children().filter(".ic_sourceListItem.ui-draggable").filter(function() {return $(this).css('display') != 'none';}).length);
                            if($view.children().filter(".ic_sourceListItem.ui-draggable").filter(function() {
                                return $(this).css('display') != 'none';}).filter(function() {
                                    return $(this).css('display') != 'inherit';}).length <= originAnswers.length){
                            var value = $view.find("div[data-item='" + selectedItem['item'] + "']")[0];
                            if (value) {
                                value.style.display = 'block';
                                presenter.setElementSize(value);
                            } else {
                                presenter.setElementSize(ui.draggable[0]);
                            }
                            presenter.eventBus.sendEvent('ItemConsumed', selectedItem);
                            lastAddedItem = selectedItem;
                            selectedItem = null;
                            console.log("done");
                        }else{
                            selectedItem = null;
                            lastAddedItem = null;
                            }
                        } else {
                            if (isGapOrdering) {
                                var parent = ui.draggable[0].parentElement;
                                var child = $view.children()[0];
                                ui.draggable.detach();
                                $(child).detach();
                                console.log("gapordering");
                                $view.append(ui.draggable[0]);
                                // ui.draggable[0].style.position = 'initial';
                                parent.appendChild(child);
                            }
                        }
                    }
                });

                setTimeout(function () {
                    $(".SOURCE_LIST_answer .ic_sourceListItem").draggable({
                        helper: "clone",
                        connectToSortable: ".dndsortable",
                    });

                    $(".ic_sourceList .ic_sourceListItem").draggable({
                        helper: "clone",
                        connectToSortable: ".dndsortable"
                    });
                }, 0);

                presenter.buildStartingElements($view, model);

                if (isGapOrdering) {
                    $view.find(".ic_sourceListItem").draggable({
                        revert: 'invalid',
                        start: function (event) {
                            presenter.eventBus.sendEvent("ValueChanged", {source: id});
                            event.target.style.zIndex = '1';
                        },
                        stop: function (event) {
                            event.target.style.top = '-1px';
                            event.target.style.left = '-1px';
                            event.target.style.zIndex = '';
                            presenter.setElementSize(event.target);
                        }
                    });
                }

                if (!isGapOrdering) {
                    $view.sortable( "refresh" );
                }
            }

            presenter.setVisibility = function (isVisible) {
                $view.css('visibility', isVisible ? 'visible' : 'hidden');
            };
            
            presenter.hide = function () {
                presenter.setVisibility(false);
            };
            
            presenter.show = function () {
                presenter.setVisibility(true);
            };




    presenter.setShowErrorsMode = function() {
                if (mode == 3) {
                    presenter.hideAnswers();
                }

                mode = 1;

                var current = $view.children().map(function (indx, element) { return element.style.display === 'none' ? null : $(element) });
                current = current.filter(function(indx, element) { return element !== null; });

                if (ignoreOrder) {

                    var copyAnswer = answers.slice();

                    for(i = 0; i< current.length; i++){
                        var correctFlag = false;
                        for(j =0; j < copyAnswer.length; j++){
                            if(copyAnswer[j] == current[i].text()){
                                current[i][0].classList.add('correct');
                                copyAnswer[j] = undefined;
                                correctFlag = true;
                                break;
                            }
                        }
                        if(!correctFlag) {
                            current[i][0].classList.add('wrong');
                        }

                        current[i][0].classList.add('ic_element_works_mode');
                    }

                } else {

                    for (var i = 0; i < Math.min(current.length, answers.length); i++) {
                        if (answers[i] !== current[i].text()) {
                            current[i][0].classList.add('wrong');
                        } else {
                            current[i][0].classList.add('correct');
                        }

                        current[i][0].classList.add('ic_element_works_mode');
                    }

                    for (var i = Math.min(current.length, answers.length); i < current.length; i++) {
                        current[i][0].classList.add('wrong');
                        current[i][0].classList.add('ic_element_works_mode');
                    }
                }
            }
			
			presenter.setWorkMode = function(){
                mode = 0;
                var current = $view.children().map(function (indx, element) { return element.style.display === 'none' ? null : $(element) });
                current = current.filter(function(indx, element) { return element !== null; });
                current.each(function (indx, element) { element[0].classList.remove('wrong'); element[0].classList.remove('correct');  element[0].classList.remove('ic_element_works_mode');});
			}
			
			presenter.reset = function(){
			}
			
			presenter.getErrorCount = function(){
			}
			
			presenter.getMaxScore = function(){
                return 1;
			}
			
			presenter.getScore = function(){
                var current = $view.children().map(function (indx, element) { return element.style.display === 'none' ? null : $(element).text() });

                current = current.filter(function(indx, element) { return element !== null; });

                if (current.length !== answers.length) {
                    return 0;
                }

                if (ignoreOrder) {

                    if(current.length != answers.length){
                        return 0;
                    }

                    var copyAnswer = answers.slice();

                    for(i = 0; i < current.length; i++){
                        var correctFlag = false;
                        for(j = 0; j < copyAnswer.length; j++){
                            if(copyAnswer[j] == current[i]){
                                copyAnswer[j] = undefined;
                                correctFlag = true;
                                break;
                            }
                        }
                        if(!correctFlag) {
                            return 0;
                        }
                    }

                 } else {

                    for (var i = 0; i < answers.length; i++) {
                        if (answers[i] !== current[i]) {
                            return 0;
                        }
                    }
                }

                return 1;
			}
			
			presenter.getState = function(){
			}

			presenter.setState = function(state){
			}

            presenter.setElementSize = function (element) {
                if(itemWidth != null) {
                    element.style.width = itemWidth+"px";
                }
                if(itemHeight != null) {
                    element.style.height = itemHeight+"px";
                }
            }

			return presenter;
		}