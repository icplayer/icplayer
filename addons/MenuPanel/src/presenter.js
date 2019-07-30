function AddonMenuPanel_create(){
    /* ChangeLog
     - added <img> to appended div in drawElements
     - changed select to selectCommand in presenter.executeCommand, same for deselect
     */

    var presenter = function(){};

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
        presenter.presentation = controller.getPresentation();
        presenter.currentIndex = controller.getCurrentPageIndex();
    };

    presenter.run = function(view, model){
        presenterLogic(view, model);
        presenter.setVisibility(presenter.isVisibleByDefault);
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model);
        presenter.setVisibility(true);
    };

    function presenterLogic(view, model) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.model = model;
        presenter.addonID = model.ID;
        presenter.isError = false;

        presenter.HorizontalAlignment = presenter.HorizontalAlignmentByDefault = model.HorizontalAlignment;
        presenter.VerticalAlignment = presenter.VerticalAlignmentByDefault = model.VerticalAlignment;
        presenter.setAlignment(presenter.HorizontalAlignment, presenter.VerticalAlignment);

        presenter.isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        presenter.isVisibleByDefault = presenter.isVisible;
        presenter.originalDisplay = presenter.$view.css('display') ? presenter.$view.css('display') : 'block';

        presenter.isDisabled = ModelValidationUtils.validateBoolean(model["Disable"]);
        presenter.isDisabledByDefault = presenter.isDisabled;
        presenter.setAbilityAll(!presenter.isDisabledByDefault);

        presenter.menuItemsByDefault = presenter.model.MenuItems;
        presenter.menuItems = presenter.buildElementsArray(presenter.model.MenuItems);
        presenter.drawElements();

        presenter.autoExpand = ModelValidationUtils.validateBoolean(model["autoExpand"]);

        presenter.$view.on('click', function(e){e.stopPropagation();});
    }

    presenter.buildElementsArray = function(itemsArray){
        if(!presenter.isError){
            var nestedItems = new Array;

            $(itemsArray).each(function(i, menuItem){
                if(menuItem.id == ''){
                    presenter.errorHandler('Id in item '+(i+1)+' is empty!');
                    return false;
                }

                var isSelected = ModelValidationUtils.validateBoolean(menuItem.isSelected);
                var isExpanded = ModelValidationUtils.validateBoolean(menuItem.isExpanded);
                var isDisabled = ModelValidationUtils.validateBoolean(menuItem.isDisabled);

                nestedItems[i] = {};
                nestedItems[i].id = menuItem.id;
                nestedItems[i].parentId = menuItem.parentId;
                nestedItems[i].title = menuItem.title;
                nestedItems[i].image = menuItem.image;
                nestedItems[i].isSelected = isSelected;
                nestedItems[i].isExpanded = isExpanded;
                nestedItems[i].isDisabled = isDisabled;
                nestedItems[i].children = [];

                if(menuItem.parentId != ''){
                    $(nestedItems).each(function(i, menuItem2){
                        if(menuItem2['id'] == menuItem['parentId']){
                            nestedItems[i].children.push(menuItem.id);
                        }
                    });
                }
            });

            return nestedItems;
        }
    }

    presenter.drawElements = function(){
        if(!presenter.isError){
            var wrapper = presenter.$view.find('.menu-panel-wrapper')[0];
            $(wrapper).html('')

            $(presenter.menuItems).each(function(i, menuItem){
                var elementClassPrefix = 'item';

                var parent = presenter.menuItems[i].parentId == '' ? wrapper : presenter.$view.find('.'+elementClassPrefix+presenter.menuItems[i].parentId+'.children')[0];
                var content = presenter.menuItems[i].title;

                var selected = presenter.menuItems[i].isSelected ? ' selected' : '';
                var disabled = presenter.menuItems[i].isDisabled ? ' disabled' : '';

                var div = '<div class="menu-panel-item '+elementClassPrefix+menuItem.id+selected+disabled+'">';
                if(presenter.menuItems[i].image != ''){
                    div += '<img src="'+presenter.menuItems[i].image+'" alt="" />';
                }
                div += content+'</div>';

                $(parent).append(div);

                if(presenter.menuItems[i].children != ''){
                    var visibility = presenter.menuItems[i].isExpanded ? 'visible' : 'hidden';
                    var display = presenter.menuItems[i].isExpanded ? 'block' : 'none';
                    var expanded = presenter.menuItems[i].isExpanded ? 'expanded' : 'contracted';

                    $(parent).append('<div class="'+elementClassPrefix+menuItem.id+' children '+expanded+'" style="visibility: '+visibility+'; display:'+display+';"></div>');
                }

                var clickableElement = presenter.$view.find('.'+elementClassPrefix+menuItem.id)[0];
                var clickData = {item: i};
                $(clickableElement).on('click', clickData, presenter.clickHandler);

            });
        }
    }

    presenter.clickHandler = function(e){
        if(!presenter.isDisabled && !presenter.menuItems[e.data.item].isDisabled){
            var value;

            if(presenter.menuItems[e.data.item].isSelected){
                presenter.menuItems[e.data.item].isSelected = false;
                $(presenter.$view.find('.item'+presenter.menuItems[e.data.item].id)[0]).removeClass("selected");
                value = 0;
            }else{
                presenter.menuItems[e.data.item].isSelected = true;
                $(presenter.$view.find('.item'+presenter.menuItems[e.data.item].id)[0]).addClass("selected");
                value = 1;
            }

            presenter.sendEventData(presenter.menuItems[e.data.item].id,value);

            //Auto Expand control
            if(presenter.autoExpand){
                var parentId = presenter.menuItems[e.data.item].parentId;
                var parent = getItemById(parentId);
                var siblings = [];

                if(parentId != ''){
                    $(presenter.menuItems[parent].children).each(function(i,child){
                        if(child != presenter.menuItems[e.data.item].id){
                            siblings.push(child);
                        }
                    });
                }else{
                    $(presenter.menuItems).each(function(i,menuItem){
                        if(menuItem.parentId == '' && menuItem.id != presenter.menuItems[e.data.item].id){
                            siblings.push(menuItem.id);
                        }
                    });
                }

                if(presenter.menuItems[e.data.item].children.length != 0){
                    $(siblings).each(function(i,sibling){
                        //sprawdzić, czy sibling ma dzieci!
                        var item = getItemById(sibling);
                        if(presenter.menuItems[item].children.length != 0){
                            presenter.contract(sibling);
                            presenter.deselect(sibling);
                        }
                    });
                }

                presenter.toggleExpand(presenter.menuItems[e.data.item].id);
            }

        }
    }

    presenter.errorHandler = function(msg){
        presenter.isError = true;
        presenter.$view.find('.menu-panel-errors').append('<p class="mpError">'+msg+'</p>');
    };

    presenter.executeCommand = function(name, params){
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'enable': presenter.enableCommand,
            'disable': presenter.disableCommand,
            'select': presenter.selectCommand,
            'deselect': presenter.deselectCommand,
            'setAlignment': presenter.setAlignmentCommand,
            'expand': presenter.expandCommand,
            'contract': presenter.contractCommand,
            'toggleExpand': presenter.toggleExpandCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.createEventData = function(item,value) {
        return {
            source : presenter.addonID,
            item : item,
            value : value,
            score : ''
        };
    };
    presenter.sendEventData = function (item,value) {
        var eventData = presenter.createEventData(item,value);
        if (presenter.playerController !== null) {
            presenter.playerController.getEventBus().sendEvent('ValueChanged', eventData);
        }
    };

    presenter.select = function(item){
        var i = getItemById(item);
        presenter.menuItems[i].isSelected = true;
        $(presenter.$view.find('.item'+presenter.menuItems[i].id)[0]).addClass("selected");
    }
    presenter.selectCommand = function(params){
        presenter.select(params[0]);
    }
    presenter.deselect = function(item){
        var i = getItemById(item);
        presenter.menuItems[i].isSelected = false;
        $(presenter.$view.find('.item'+presenter.menuItems[i].id)[0]).removeClass("selected");
    }
    presenter.deselectCommand = function(params){
        presenter.deselect(params[0]);
    }

    presenter.toggleExpand = function(item){
        var i = getItemById(item);
        presenter.menuItems[i].isExpanded ? presenter.contract(item) : presenter.expand(item);
    }
    presenter.toggleExpandCommand = function(params){
        presenter.toggleExpand(params[0]);
    }

    presenter.expand = function(item){
        var i = getItemById(item);
        var itemClasss = '.item'+presenter.menuItems[i].id+'.children';
        presenter.menuItems[i].isExpanded = true;
        $(presenter.$view.find(itemClasss)[0]).addClass('expanded');
        $(presenter.$view.find(itemClasss)[0]).removeClass('contracted');
        $(presenter.$view.find(itemClasss)[0]).css('visibility','visible');
        $(presenter.$view.find(itemClasss)[0]).css('display','block');
        //show this item's parents if exists
        if(presenter.menuItems[i].parentId != ''){
            presenter.expand(presenter.menuItems[i].parentId);
        }

    }
    presenter.expandCommand = function(params){
        presenter.expand(params[0]);
    }
    presenter.contract = function(item){
        var i = getItemById(item);
        var itemClasss = '.item'+presenter.menuItems[i].id+'.children';
        presenter.menuItems[i].isExpanded = false;
        $(presenter.$view.find(itemClasss)[0]).removeClass('expanded');
        $(presenter.$view.find(itemClasss)[0]).addClass('contracted');
        $(presenter.$view.find(itemClasss)[0]).css('visibility','hidden');
        $(presenter.$view.find(itemClasss)[0]).css('display','none');
        //hide all children
        $(presenter.menuItems[i].children).each(function(i,child){
            presenter.contract(child);

            if(presenter.autoExpand){
                var childItem = getItemById(child);
                if(presenter.menuItems[childItem].children.length != 0){
                    presenter.deselect(child);
                }
            }
        });
    }
    presenter.contractCommand = function(params){
        presenter.contract(params[0]);
    }

    presenter.setAlignment = function(horizontal, vertical){
        presenter.HorizontalAlignment = horizontal;
        presenter.VerticalAlignment = vertical;

        switch(horizontal){
            case "left": {
                presenter.$view.css({"left":"0","right":"auto"});
                presenter.$view.find('.menu-panel-wrapper').removeClass('horizontal-right horizontal-center');
                presenter.$view.find('.menu-panel-wrapper').addClass('horizontal-left');
                break;
            }
            case "right": {
                presenter.$view.css({"left":"auto","right":"0"});
                presenter.$view.find('.menu-panel-wrapper').removeClass('horizontal-left horizontal-center');
                presenter.$view.find('.menu-panel-wrapper').addClass('horizontal-right');
                break;
            }
            case "center": {
                var pageWidth = parseInt(presenter.$view.parent().css('width'),10);
                var leftPos = (pageWidth / 2) - (presenter.model.Width / 2);
                presenter.$view.css({"left":leftPos,"right":"auto"});
                presenter.$view.find('.menu-panel-wrapper').removeClass('horizontal-right horizontal-left');
                presenter.$view.find('.menu-panel-wrapper').addClass('horizontal-center');
                break;
            }
            //Na przyszłość
            //DODAĆ obsługę defaulta, żeby można było z komendy przywrócić
            //do tego trzeba będzie pewnie zapamiętać stan pozycji z edytora
        }

        switch(vertical){
            case "top": {
                presenter.$view.css({"top":"0","bottom":"auto"});
                presenter.$view.find('.menu-panel-wrapper').removeClass('vertical-bottom vertical-center');
                presenter.$view.find('.menu-panel-wrapper').addClass('vertical-top');
                break;
            }
            case "bottom": {
                presenter.$view.css({"top":"auto","bottom":"0"});
                presenter.$view.find('.menu-panel-wrapper').removeClass('vertical-top vertical-center');
                presenter.$view.find('.menu-panel-wrapper').addClass('vertical-bottom');
                break;
            }
            case "center": {
                var pageHeight = parseInt(presenter.$view.parent().css('height'),10);
                var topPos = (pageHeight / 2) - (presenter.model.Height / 2);
                presenter.$view.css({"top":topPos,"bottom":"auto"});
                presenter.$view.find('.menu-panel-wrapper').removeClass('vertical-bottom vertical-top');
                presenter.$view.find('.menu-panel-wrapper').addClass('vertical-center');
                break;
            }
            //Na przyszłość
            //DODAĆ obsługę defaulta, żeby można było z komendy przywrócić
            //do tego trzeba będzie pewnie zapamiętać stan pozycji z edytora
        }
    }
    presenter.setAlignmentCommand = function (params) {
        presenter.setAlignment(params[0], params[1]);
    };

    presenter.show = function() {
        presenter.setVisibility(true);
    };
    presenter.hide = function(){
        presenter.setVisibility(false);
    };
    presenter.setVisibility = function(isVisible) {
        presenter.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        presenter.$view.css("display", isVisible ? presenter.originalDisplay : "none");
    };

    presenter.enable = function(item) {
        if(typeof item === 'undefined'){
            presenter.setAbilityAll(true);
        }else{
            var i = getItemById(item);
            presenter.menuItems[i].isDisabled = false;
            $(presenter.$view.find('.item'+presenter.menuItems[i].id)[0]).removeClass("disabled");
        }
    };
    presenter.enableCommand = function(params) {
        presenter.enable(params[0]);
    };
    presenter.disable = function(item){
        if(typeof item === 'undefined'){
            presenter.setAbilityAll(false);
        }else{
            var i = getItemById(item);
            presenter.menuItems[i].isDisabled = true;
            $(presenter.$view.find('.item'+presenter.menuItems[i].id)[0]).addClass("disabled");
        }
    };
    presenter.disableCommand = function(params) {
        presenter.disable(params[0]);
    };
    presenter.setAbilityAll = function(ability) {
        presenter.isDisabled = !ability;
        var wrapper = presenter.$view.find('.menu-panel-wrapper')[0];
        if(ability){
            $(wrapper).removeClass("disabled");
        }else{
            $(wrapper).addClass("disabled");
        }
    };


    presenter.reset = function(){
        presenter.setVisibility(presenter.isVisibleByDefault);
        presenter.setAbilityAll(!presenter.isDisabledByDefault);
        presenter.setAlignment(presenter.HorizontalAlignmentByDefault, presenter.VerticalAlignmentByDefault);
        presenter.menuItems = presenter.buildElementsArray(presenter.menuItemsByDefault);
        presenter.drawElements();
    };

    presenter.getState = function(){
        return JSON.stringify({
            isVisible: presenter.isVisible,
            isDisabled: presenter.isDisabled,
            HorizontalAlignment: presenter.HorizontalAlignment,
            VerticalAlignment: presenter.VerticalAlignment,
            menuItems: presenter.menuItems
        });
    };
    presenter.setState = function(stateString){
        if (ModelValidationUtils.isStringEmpty(stateString)) return;

        var state = JSON.parse(stateString);
        presenter.isVisible = state.isVisible;
        presenter.isDisabled = state.isDisabled;
        presenter.HorizontalAlignment = state.HorizontalAlignment;
        presenter.VerticalAlignment = state.VerticalAlignment;
        presenter.menuItems = state.menuItems;

        presenter.setVisibility(presenter.isVisible);
        presenter.setAbilityAll(!presenter.isDisabled);
        presenter.setAlignment(presenter.HorizontalAlignment, presenter.VerticalAlignment);
        presenter.drawElements();
    };

    function getItemById(id){
        var itemToReturn = false;
        $(presenter.menuItems).each(function(i, menuItem){
            if(menuItem.id === id){
                itemToReturn = i;
                return false;
            }
        });
        return itemToReturn;
    }

    presenter.setShowErrorsMode = function(){ };
    presenter.setWorkMode = function(){ };
    presenter.showAnswers = function(){ };
    presenter.hideAnswers = function(){ };

    return presenter;
}