TestCase("Decode module ID and gap index", {
    setUp: function () {
        this.presenter = AddonMath_create();
    },

    'test proper module ID': function () {
        var decodedModuleReference = this.presenter.decodeModuleReference('Text4.1');

        assertTrue(decodedModuleReference.isValid);
        assertEquals('Text4', decodedModuleReference.moduleID);
        assertEquals(1, decodedModuleReference.gapIndex);
    },

    'test proper module ID with multiple dots': function () {
        var decodedModuleReference = this.presenter.decodeModuleReference('Text.with.multiple.dots.3');

        assertTrue(decodedModuleReference.isValid);
        assertEquals('Text.with.multiple.dots', decodedModuleReference.moduleID);
        assertEquals(3, decodedModuleReference.gapIndex);
    },

    'test gap identifier invalid': function () {
        assertFalse(this.presenter.decodeModuleReference('Text4').isValid);
        assertFalse(this.presenter.decodeModuleReference('.3').isValid);
        assertFalse(this.presenter.decodeModuleReference('Text3.').isValid);
    }
});

TestCase("Runtime variable conversion", {
    setUp: function () {
        var text1 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '1';
                    case '2':
                        return '12';
                    case '3':
                        return '2a';
                    default:
                        return "[error]";
                }
            }
        }, text2 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '10';
                    case '2':
                        return '3b';
                    default:
                        return "[error]"
                }
            }
        };

        this.presenter = AddonMath_create();
        sinon.stub(this.presenter, 'getModule');
        this.presenter.getModule.withArgs('Text1').returns(text1);
        this.presenter.getModule.withArgs('Text2').returns(text2);
        this.presenter.getModule.withArgs('Text.with.multiple.dots').returns(text1);
    },

    tearDown: function () {
        this.presenter.getModule.restore();
    },

    'test convert variables from existing modules': function () {
        assertNumber(this.presenter.convertVariable('Text1.1'));
        assertEquals(1, this.presenter.convertVariable('Text1.1'));

        assertNumber(this.presenter.convertVariable('Text1.2'));
        assertEquals('12', this.presenter.convertVariable('Text1.2'));

        assertString(this.presenter.convertVariable('Text1.3'));
        assertEquals('2a', this.presenter.convertVariable('Text1.3'));

        assertNumber(this.presenter.convertVariable('Text2.1'));
        assertEquals('10', this.presenter.convertVariable('Text2.1'));

        assertString(this.presenter.convertVariable('Text2.2'));
        assertEquals('3b', this.presenter.convertVariable('Text2.2'));

        assertNumber(this.presenter.convertVariable('Text.with.multiple.dots.1'));
        assertEquals('1', this.presenter.convertVariable('Text.with.multiple.dots.1'));

        assertNumber(this.presenter.convertVariable('Text.with.multiple.dots.2'));
        assertEquals('12', this.presenter.convertVariable('Text.with.multiple.dots.2'));

        assertString(this.presenter.convertVariable('Text.with.multiple.dots.3'));
        assertEquals('2a', this.presenter.convertVariable('Text.with.multiple.dots.3'));
    },

    'test convert variables for not existing modules': function () {
        assertUndefined(this.presenter.convertVariable('Text1.4'));
        assertUndefined(this.presenter.convertVariable('Text2.3'));
        assertUndefined(this.presenter.convertVariable('Text3.1'));
    },

    'test gap identifier invalid': function () {
        assertUndefined(this.presenter.convertVariable('Text4'));
        assertUndefined(this.presenter.convertVariable('.3'));
        assertUndefined(this.presenter.convertVariable('Text3.'));
    }
});

TestCase("Assign variables to current 'this' object", {
    setUp: function () {
        this.presenter = AddonMath_create();
    },

    'test assigning variables': function () {
        var variables = [
            { name: 'gap1', value: 'Text1.1' },
            { name: 'gap2', value: 'Text1.2' },
            { name: 'gap3', value: 'Text1.3' }
        ], object = {};


        this.presenter.assignVariablesToObject(object, variables);

        assertEquals('Text1.1', object.variables['gap1']);
        assertEquals('Text1.2', object.variables['gap2']);
        assertEquals('Text1.3', object.variables['gap3']);
    }
});

TestCase("Getting module ID from variable name", {
    setUp: function () {
        this.presenter = AddonMath_create();
        this.variables = [
            { name: 'gap01', value: 'Text1.1' },
            { name: 'gap02', value: 'Text2.2' },
            { name: 'gap03', value: 'Text3.3' }
        ];
    },

    'test get module ID': function () {
        var moduleReference = this.presenter.getModuleReferenceFromVariable(this.variables, 'gap01');

        assertEquals('Text1.1', moduleReference);
    }
});

TestCase("Runtime variable emptiness checking", {
    setUp: function () {
        this.text1 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '1';
                    case '2':
                        return '';
                    default:
                        return "[error]";
                }
            }
        };
        this.text2 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '1';
                    case '2':
                        return '12';
                    default:
                        return "[error]";
                }
            }
        };

        this.presenter = AddonMath_create();
        sinon.stub(this.presenter, 'getModule');
        this.presenter.getModule.withArgs('Text1').returns(this.text1);
        this.variables = [
            { name: 'gap01', value: 'Text1.1' },
            { name: 'gap02', value: 'Text1.2' }
        ];
    },

    tearDown: function () {
        this.presenter.getModule.restore();
    },

    'test some empty gaps': function () {
        var emptyGaps = this.presenter.getEmptyGaps(this.variables);

        assertEquals({ isValid: true, gaps: ["gap02"]}, emptyGaps);
    },

    'test all gaps filled': function () {
        this.presenter.getModule.withArgs('Text1').returns(this.text2);

        var emptyGaps = this.presenter.getEmptyGaps(this.variables);

        assertEquals({ isValid: true, gaps: [] }, emptyGaps);
    },

    'test runtime conversion error': function () {
        this.variables.push({ name: 'gap03', value: 'Text2.3' });

        var emptyGaps = this.presenter.getEmptyGaps(this.variables);

        assertFalse(emptyGaps.isValid);
    }
});