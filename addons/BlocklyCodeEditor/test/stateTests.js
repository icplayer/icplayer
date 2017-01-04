var daieuhefihgf = "dupa"

var setUpFunction = function () {
    this.presenter = AddonBlocklyCodeEditor_create();
    this.blocklyStateValue = JSON.stringify({"code":"<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"text_prompt_ext\" id=\"mFW}==osP6Y*]az/49e-\" x=\"51\" y=\"153\"><mutation type=\"TEXT\"></mutation><field name=\"TYPE\">TEXT</field></block><block type=\"text_prompt_ext\" id=\")Lj~:VnU]2*[`|PbMfQ%\" x=\"131\" y=\"219\"><mutation type=\"TEXT\"></mutation><field name=\"TYPE\">TEXT</field><value name=\"TEXT\"><block type=\"math_single\" id=\"I@js!Bu?k7i1KWD5?^:T\"><field name=\"OP\">ROOT</field><value name=\"NUM\"><block type=\"math_number\" id=\"d$sG;0/0;*22[R!@Y`+%\"><field name=\"NUM\">0</field></block></value></block></value></block><block type=\"variables_set\" id=\".HdMVm$9ht$d|RcviYIG\" x=\"144\" y=\"268\"><field name=\"VAR\">item</field></block></xml>","isVisible":true});
    this.presenter.configuration.workspace = Blockly.inject("body", {
        toolbox: "<xml></xml>",
        sounds: false,
        maxBlocks: 0
    });

    var that = this;
    this.stubs = {
        setVisibility: sinon.stub(this.presenter, 'setVisibility', function (isVisible) {
            that.presenter.configuration.isVisible = isVisible;
        })
    };
};

var tearDownFunction = function () {
    this.presenter.setVisibility.restore();
};

TestCase("[Blockly_Code_Editor] setState", {
    setUp: setUpFunction,
    tearDown: tearDownFunction,

    'test state should be set as provided from player' : function () {
        var expected = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text_prompt_ext" id="mFW}==osP6Y*]az/49e-" x="51" y="153"><mutation type="TEXT"></mutation><field name="TYPE">TEXT</field></block><block type="text_prompt_ext" id=")Lj~:VnU]2*[`|PbMfQ%" x="131" y="219"><mutation type="TEXT"></mutation><field name="TYPE">TEXT</field><value name="TEXT"><block type="math_single" id="I@js!Bu?k7i1KWD5?^:T"><field name="OP">ROOT</field><value name="NUM"><block type="math_number" id="d$sG;0/0;*22[R!@Y`+%"><field name="NUM">0</field></block></value></block></value></block><block type="variables_set" id=".HdMVm$9ht$d|RcviYIG" x="144" y="268"><field name="VAR">item</field></block></xml>';

        this.presenter.setState(this.blocklyStateValue);
        assertEquals(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.presenter.configuration.workspace)), expected);
        assertTrue(this.presenter.configuration.isVisible);
    }
});

TestCase("[Blockly_Code_Editor] getState", {
    setUp: setUpFunction,
    tearDown: tearDownFunction,

    'test get state should be the same as addon state' : function () {
        this.presenter.setState(this.blocklyStateValue);
        var state = this.presenter.getState();
        assertEquals(state, this.blocklyStateValue);
    }
});