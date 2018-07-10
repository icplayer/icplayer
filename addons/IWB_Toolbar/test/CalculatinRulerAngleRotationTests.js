TestCase("[IWB Toolbar] Calculating ruler vector angle rotation", {
    setUp: function () {
        this.presenter = AddonIWB_Toolbar_create();
    },
    
    'test rotating vector is correct': function () {
        var v1 = {x: -147, y: -2, length: 147.0136048126159};
        var v2 = {x: 14, y: 38, length: 40.496913462633174};

        var angleReturn = this.presenter._calculateVectorsAngle(v1,v2);
        var result = angleReturn.isCorrect;

        assertEquals(true, result);
    },
    
    'test rotating vector is not correct with angleArg === 1': function () {
        var v1 = {x: -5, y: 2, length: 5.385164807134504};
        var v2 = {x: -10, y: 4, length: 10.770329614269007};
        
        var angleReturn = this.presenter._calculateVectorsAngle(v1,v2);
        var result = angleReturn.isCorrect;
        
        assertEquals(false, result);
    },
    
    'test rotating vector is not correct with angleArg > 1 ': function () {
        var v1 = {x: -8, y: 5, length: 9.433981132056603};
        var v2 = {x: -8, y: 5, length: 9.433981132056603};
        
        var angleReturn = this.presenter._calculateVectorsAngle(v1,v2);
        var result = angleReturn.isCorrect;
        
        assertEquals(false, result);
    },
    
    'test rotating vector is not correct with v1.length === v2.length': function () {
        var v1 = {x: -4, y: 2, length: 4.47213595499958};
        var v2 = {x: -4, y: 2, length: 4.47213595499958};
        
        var angleReturn = this.presenter._calculateVectorsAngle(v1,v2);
        var result = angleReturn.isCorrect;
        
        assertEquals(false, result);
    },
    
    'test rotating vector is not correct with v1.length === 0': function () {
        var v1 = {x: 0, y: 0, length: 0};
        var v2 = {x: -8, y: 4, length: 8.94427190999916};
        
        var angleReturn = this.presenter._calculateVectorsAngle(v1,v2);
        var result = angleReturn.isCorrect;
        
        assertEquals(false, result);
    },
    
    'test rotating vector is not correct with v2.length === 0 ': function () {
        var v1 = {x: -147, y: -2, length: 147.0136048126159};
        var v2 = {x: 0, y: 0, length: 0};
        
        var angleReturn = this.presenter._calculateVectorsAngle(v1,v2);
        var result = angleReturn.isCorrect;
        
        assertEquals(false, result);
    }
});