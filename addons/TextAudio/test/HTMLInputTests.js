TestCase('[TextAudio] HTML Input Tests', {
    setUp: function () {
        this.presenter = AddonTextAudio_create();
    },

    'test HTML input 1': function() {
        var text = 'Lorem || Ipsum';
        var expected = '<span class="textelement0" data-selectionid="0" data-intervalid="0">Lorem </span><span class="textelement1" data-selectionid="1" data-intervalid="1"> Ipsum</span>';

        var result = this.presenter.parseSlideText(text);

        assertEquals(result.split('').sort().join(''), expected.split('').sort().join(''));
    },

    'test HTML input 2': function() {
        var text = '<font color="#0000ff">c</font>||<font color="#0000ff">m</font>||<font color="#ff0000">a</font>';
        var expected = '<font color="#0000ff"><span class="textelement0" data-selectionid="0" data-intervalid="0">c</span></font><font color="#0000ff"><span class="textelement1" data-selectionid="1" data-intervalid="1">m</span></font><font color="#ff0000"><span class="textelement2" data-selectionid="2" data-intervalid="2">a</span></font>';

        var result = this.presenter.parseSlideText(text);

        assertEquals(result.split('').sort().join(''), expected.split('').sort().join(''));
    },

    'test HTML input 3': function() {
        var text = '<div>Introduction ||&nbsp;</div><div>Landmarks || stand || out</div>';
        var expected = '<div><span class="textelement0" data-selectionid="0" data-intervalid="0">Introduction </span><span class="textelement1" data-selectionid="1" data-intervalid="1">&nbsp;</span></div><div><span class="textelement1" data-selectionid="1" data-intervalid="1">Landmarks </span><span class="textelement2" data-selectionid="2" data-intervalid="2"> stand </span><span class="textelement3" data-selectionid="3" data-intervalid="3"> out</span></div>';

        var result = this.presenter.parseSlideText(text);

        assertEquals(result.split('').sort().join(''), expected.split('').sort().join(''));
    },

    'test HTML input 4': function() {
        var text = '<font color="#0000ff"><b><i><u>c</u></i></b></font>';
        var expected = '<font color="#0000ff"><b><i><u><span class="textelement0" data-selectionid="0" data-intervalid="0">c</span></u></i></b></font>';

        var result = this.presenter.parseSlideText(text);

        assertEquals(result.split('').sort().join(''), expected.split('').sort().join(''));
    }
});