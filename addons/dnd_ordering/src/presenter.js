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
            var isNoItemsOrder = false;
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
                    div.style.display = "inline-block";
                    div.innerHTML = element;

                    if (isGapOrdering) {
                        div.style.top = "-1px";
                        div.style.left = "-1px";
                    }

                    if(itemWidth != null) {
                        div.style.width = itemWidth;
                    }
                    if(itemHeight != null) {
                        div.style.height = itemHeight;
                    }

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

                    if(itemWidth != null) {
                        div.style.width = itemWidth;
                    }
                    if(itemHeight != null) {
                        div.style.height = itemHeight;
                    }
                    div.style.display = "inline-block";
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
                isNoItemsOrder = model['isNoItemsOrder'] === 'True';
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
                            $(this).data().sortable.currentItem[0].classList.remove('ic_sourceListItem-selected');
                            $(this).data().sortable.currentItem[0].setAttribute('data-item', event['item']);
                            $(this).data().sortable.currentItem.style('visibility', 'visible');
                            $(this).data().sortable.currentItem.on('click', function () {
                                presenter.sendRemoveEvent(event);
                                $(this)[0].style.display = 'none';
                            });
                        }
                    });
                }


                $view.droppable({
                    accept: function () {
                        return true;
                    },
                    drop: function (event, ui) {
                        if (selectedItem) {
                            var value = $view.find("div[data-item='" + selectedItem['item'] + "']")[0];
                            if (value) {
                                value.style.display = 'inline-block';
                            }
                            presenter.eventBus.sendEvent('ItemConsumed', selectedItem);
                            lastAddedItem = selectedItem;
                            selectedItem = null;
                        } else {
                            if (isGapOrdering) {
                                var parent = ui.draggable[0].parentElement;
                                var child = $view.children()[0];
                                ui.draggable.detach();
                                $(child).detach();
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

                            if(itemWidth != null) {
                                div.style.width = itemWidth;
                            }
                            if(itemHeight != null) {
                                div.style.height = itemHeight;
                            }
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

                if (isNoItemsOrder) {
                    for (var i = 0; i < Math.min(current.length, answers.length); i++) {
                        if(answers.filter(function(el){return answers[i] === el}).length == current.filter(function(el){return answers[i] === el}).length) {
                            current[i][0].classList.add('correct');
                        } else {
                            current[i][0].classList.add('wrong');
                        }
                        current[i][0].classList.add('ic_element_works_mode');

                        for (var i = Math.min(current.length, answers.length); i < current.length; i++) {
                            current[i][0].classList.add('wrong');
                            current[i][0].classList.add('ic_element_works_mode');
                        }
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

                for (var i = 0; i < answers.length; i++) {
                    if (answers[i] !== current[i]) {
                        return 0;
                    }
                }

                return 1;
			}
			
			presenter.getState = function(){
			}

			presenter.setState = function(state){
			}

			return presenter;
		}