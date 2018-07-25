TestCase("[Commons - Controls-bar] Adding/Removing burger menu", {
    setUp: function () {
        this.configuration = {
            parentElement: {
                getBoundingClientRect: function () {
                    return {
                        left: 0
                    }
                },
                offsetWidth: 200
            }
        };
        this.controlsBar = new CustomControlsBar();
        this.burgerMenuData = [
            {title: "Title 1", callback: sinon.spy()},
            {title: "Title 2", callback: sinon.spy()}
        ];

        this.burgerName = "burgerTestName";
    },


    'test burger menu will be added properly': function () {
        this.controlsBar.addBurgerMenu(this.burgerName, this.burgerMenuData);

        assertNotEquals(undefined, this.controlsBar.elements[this.burgerName]);
        assertNotEquals(undefined, this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_container']);
        assertNotEquals(undefined, this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_0']);
        assertNotEquals(undefined, this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_1']);
    },


    'test burger menu will correctly show burger menu': function () {
        var eventObj = document.createEvent('Events');
        eventObj.initEvent('mouseenter', true, false);

        this.controlsBar.addBurgerMenu(this.burgerName, this.burgerMenuData);

        this.controlsBar.elements[this.burgerName].element.dispatchEvent(eventObj);

        assertEquals('block', this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_container'].element.style.display);
    },

    'test burger menu will correctly hide burger menu': function () {
        var eventObj = document.createEvent('Events');
        eventObj.initEvent('mouseenter', true, false);

        this.controlsBar.addBurgerMenu(this.burgerName, this.burgerMenuData);

        this.controlsBar.elements[this.burgerName].element.dispatchEvent(eventObj);

        eventObj = document.createEvent('Events');
        eventObj.initEvent('mouseleave', true, false);

        this.controlsBar.elements[this.burgerName].element.dispatchEvent(eventObj);

        assertEquals('none', this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_container'].element.style.display);
    },

    'test burger menu correctly connect click events': function () {
        this.controlsBar.addBurgerMenu(this.burgerName, this.burgerMenuData);

        var firstElement = this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_0'];
        var secondElement = this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_1'];

        firstElement.element.click();
        secondElement.element.click();
        firstElement.element.click();

        assertEquals(2, this.burgerMenuData[0].callback.callCount);
        assertEquals(1, this.burgerMenuData[1].callback.callCount);
    },

    'test burger menu will be hidden after click': function () {
        var eventObj = document.createEvent('Events');
        eventObj.initEvent('mouseenter', true, false);

        this.controlsBar.addBurgerMenu(this.burgerName, this.burgerMenuData);

        this.controlsBar.elements[this.burgerName].element.dispatchEvent(eventObj);

        var firstElement = this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_0'];
        firstElement.element.click();

        assertEquals('none', this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_container'].element.style.display);
    },

    'test burger menu properly removes burger menu': function () {
        this.controlsBar.addBurgerMenu(this.burgerName, this.burgerMenuData);

        var mainButton = this.controlsBar.elements[this.burgerName];

        this.controlsBar.removeBurgerMenu(this.burgerName);

        assertEquals(null, this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_0']);
        assertEquals(null, this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_1']);
        assertEquals(null, this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_container']);
        assertEquals(null, mainButton.element.parentNode);
    },

    'test burger callbacks are removed after removing menu': function () {
        this.controlsBar.addBurgerMenu(this.burgerName, this.burgerMenuData);

        var firstElement = this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_0'];
        var secondElement = this.controlsBar.elements['BURGER_MENU_' + this.burgerName + '_1'];
        var mainButton = this.controlsBar.elements[this.burgerName];

        this.controlsBar.removeBurgerMenu(this.burgerName);

        firstElement.element.click();
        secondElement.element.click();

        var eventObj = document.createEvent('Events');
        eventObj.initEvent('mouseenter', true, false);
        mainButton.element.dispatchEvent(eventObj);

        assertEquals(0, this.burgerMenuData[0].callback.callCount);
        assertEquals(0, this.burgerMenuData[1].callback.callCount);
        assertEquals('', mainButton.element.style.display);
    }

});