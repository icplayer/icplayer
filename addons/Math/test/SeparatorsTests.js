TestCase("[Math] Separators", {
    setUp: function () {
        var text1 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '1000,21';
                    case '2':
                        return '4312 89';
                    case '3':
                        return '67856,s67';
                    case '4':
                        return '5487985.265';
                    case '5':
                        return '54\\4';
                    case '6':
                        return '564/8888';
                    default:
                        return "[error]";
                }
            }
        }, text2 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '244 55645 444 1';
                    case '2':
                        return '1,254,66,879';
                    case '3':
                        return '44.687.1111.6';
                    case '4':
                        return '89$ 4567$ 4';
                    default:
                        return "[error]"
                }
            }
        },
            text3 = {
            getGapValue: function (index) {
                switch (index) {
                    case '1':
                        return '11 254,6987';
                    case '2':
                        return '222.487.65,99';
                    case '3':
                        return '45,989,3,4.';
                    case '4':
                        return '995.1 6';
                    default:
                        return "[error]";
                }
            }
        };

        this.presenter = AddonMath_create();
        sinon.stub(this.presenter, 'getModule');
        this.presenter.getModule.withArgs('Text1').returns(text1);
        this.presenter.getModule.withArgs('Text2').returns(text2);
        this.presenter.getModule.withArgs('Text3').returns(text3);
    },

    tearDown: function () {
        this.presenter.getModule.restore();
    },

    'test decimal separator set': function () {

        var separators =  {
            decimalSeparator: ",",
            isDecimalSeparatorSet:true,
            thousandSeparator: undefined,
            isThousandSeparatorSet: false
        };

        assertNumber(this.presenter.convertVariable('Text1.1', separators));
        assertEquals(1000.21, this.presenter.convertVariable('Text1.1',separators));

        separators.decimalSeparator = " ";
        assertNumber(this.presenter.convertVariable('Text1.2', separators));
        assertEquals(4312.89, this.presenter.convertVariable('Text1.2', separators));

        separators.decimalSeparator = ",s";
        assertNumber(this.presenter.convertVariable('Text1.3', separators));
        assertEquals(67856.67, this.presenter.convertVariable('Text1.3', separators));

        separators.decimalSeparator = ".";
        assertNumber(this.presenter.convertVariable('Text1.4', separators));
        assertEquals(5487985.265, this.presenter.convertVariable('Text1.4', separators));

        separators.decimalSeparator = "\\";
        assertNumber(this.presenter.convertVariable('Text1.5', separators));
        assertEquals(54.4, this.presenter.convertVariable('Text1.5', separators));

        separators.decimalSeparator = "\/";
        assertNumber(this.presenter.convertVariable('Text1.6', separators));
        assertEquals(564.8888, this.presenter.convertVariable('Text1.6', separators));
    },

    'test thousand separator set': function () {

        var separators =  {
            decimalSeparator: undefined,
            isDecimalSeparatorSet: false,
            thousandSeparator: " ",
            isThousandSeparatorSet: true
        };

        assertNumber(this.presenter.convertVariable('Text2.1', separators));
        assertEquals(244556454441, this.presenter.convertVariable('Text2.1', separators));

        separators.thousandSeparator = ",";
        assertNumber(this.presenter.convertVariable('Text2.2', separators));
        assertEquals(125466879, this.presenter.convertVariable('Text2.2', separators));

        separators.thousandSeparator = ".";
        assertNumber(this.presenter.convertVariable('Text2.3', separators));
        assertEquals(4468711116, this.presenter.convertVariable('Text2.3', separators));

        separators.thousandSeparator = "$ ";
        assertNumber(this.presenter.convertVariable('Text2.4', separators));
        assertEquals(8945674, this.presenter.convertVariable('Text2.4', separators));

        separators.thousandSeparator = " ";
        assertString(this.presenter.convertVariable('Text3.1', separators));
        assertEquals('11254,6987', this.presenter.convertVariable('Text3.1', separators));
    },

    'test both separators set': function () {

        var separators =  {
            decimalSeparator: ",",
            isDecimalSeparatorSet: true,
            thousandSeparator: " ",
            isThousandSeparatorSet: true
        };

        assertNumber(this.presenter.convertVariable('Text3.1', separators));
        assertEquals(11254.6987, this.presenter.convertVariable('Text3.1', separators));

        // Test for separators handling
        separators.thousandSeparator = ".";
        separators.decimalSeparator = ",";
        assertNumber(this.presenter.convertVariable('Text3.2', separators));
        assertEquals(22248765.99, this.presenter.convertVariable('Text3.2', separators));

        separators.thousandSeparator = ",";
        separators.decimalSeparator = ".";
        assertNumber(this.presenter.convertVariable('Text3.3', separators));
        assertEquals(4598934., this.presenter.convertVariable('Text3.3', separators));

        separators.thousandSeparator = ".";
        separators.decimalSeparator = " ";
        assertNumber(this.presenter.convertVariable('Text3.4', separators));
        assertEquals(9951.6, this.presenter.convertVariable('Text3.4', separators));


    }

});

