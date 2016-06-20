function AddonBlockyCodeEditor_create () {
    var presenter = function () {};

    presenter.run = function (view, model) {
        presenter.runLogic(view, model);
    };

    presenter.createPreview = function (view, model) {
        presenter.runLogic(view, model);
    };

    presenter.runLogic = function (view, model) {
        var toolbox = '<xml>';
          toolbox += '  <block type="controls_if"></block>';
          toolbox += '  <block type="controls_whileUntil"></block>';
          toolbox += '</xml>';
          var workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});
    };
    
    return presenter;
}
