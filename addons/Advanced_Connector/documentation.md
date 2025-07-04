## Description
The Advanced Connector is a special kind of module. It combines multiple modules into fully interactive, responsive content.

## Properties

The list starts with the common properties, learn more about them by visiting the [Modules description](https://www.mauthor.com/doc/en/page/Modules-description) section. The other available properties are described below.

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Scripts</td>
        <td>List of scripts to be executed when specified conditions occur.</td>
    </tr>
    <tr>
        <td>Is Disabled</td>
        <td>This property allows disabling the Advanced Connector module so that it doesn't react (evaluate any scripts) when new events hit the Event Bus.
        </td> 
    </tr>
</table>


## Scripts syntax
Each script starts with the 'EVENTSTART' keyword and ends with 'EVENTEND'. All conditions and scripts to be executed must be placed between them!  
Each script is executed when specified conditions occur. These conditions match event data sent by other modules. Users can filter events through:

* Name - name of the event type. There are a few event types: Definition, ItemSelected, ItemConsumed, ItemReturned, and ValueChanged. **By default, events are filtered by 'Name:ValueChanged' condition. To be able to react to other types of events, it is necessary to specify them in a condition!**
<br/>Other available names are:
<br/>PageLoaded - event sent by the player when the current page is loaded.
<br/>Check - on pressing the Check Answers button.
<br/>Uncheck - on disabling the Check Answers mode.
<br/>Reset - when the Reset module is pressed.
* Source - ID of the addon/page/module that sends the event (ValueChanged and PageLoaded events only).
* Item - 'item' field value of event data.
* Value - 'value' field value of event data.
* Score - 'score' field value of event data (ValueChanged events only).
* Type - 'type' field value of event data (draggable events only).
* Word - 'word' field value of event data (Definition events only).

For a full reference of event types and fields, please go to [documentation](/doc/page/Addon-Events "Documentation").

The Advanced Connector addon also emulates three events: Reset, Check (when entering the error-checking mode), and Uncheck (when returning from the error-checking mode). Those three events can be used in the event type of scripts (see [demo presentation](/present/5743683201531904 "Demo presentation") for examples).

The above conditions are specified using the JavaScript Regular Expression format. For more information see [Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions "Regular expressions").  
Omitting a particular condition equals setting its value to '.*'.

The script to be executed is simply JavaScript script. It has to start with 'SCRIPTSTART' and end with 'SCRIPTEND' keywords.
To access the module or addon it is necessary to use the getModule(moduleID) method from the playerController. For example, to switch frame to the next one in the Image Viewer module, the user can add a syntax like the one below:

    presenter.playerController.getModule('ImageViewer1').next();

Example script from the [demo presentation](/present/5743683201531904 "Demo presentation") looks like this:

    EVENTSTART
    Source:TrueFalse1
    Item:1-1
    Value:1
    SCRIPTSTART

		var audioCorrect = presenter.playerController.getModule('Audio_Correct');
		var feedback = presenter.playerController.getModule('feedback1');
		var imageViewer = presenter.playerController.getModule('Image_Viewer_Public1');

		audioCorrect.play();
		feedback.change('TF-1-1');
		imageViewer.moveToFrame(2);

    SCRIPTEND
    EVENTEND

The above script is executed when the addon with the ID TrueFalse1 sends an event with item '1-1' and value '1' (other fields do not matter in this example). When this happens, the Audio module is played, the Feedback module changes its text, and the Image Viewer module changes its frame.

Additionally, to the playerController, each executed script has access to the 'event' variable which holds all information about the event that triggered the current script. For example, let us display them using the Text module:

    EVENTSTART
    Source:TrueFalse1
    SCRIPTSTART

		var textSource = presenter.playerController.getModule('TextSource'),
			textItem = presenter.playerController.getModule('TextItem'),
			textValue = presenter.playerController.getModule('TextValue'),
			textScore = presenter.playerController.getModule('TextScore');

		textSource.setText('Source: ' + event.source);
		textItem.setText('Item: ' + event.item);
		textValue.setText('Value: ' + event.value);
		textScore.setText('Score: ' + event.score);

    SCRIPTEND
    EVENTEND
	
The event object has the following properties:

* name,
* source,
* item,
* value,
* score,
* word,
* type.

If some property is not present in the current event, its value is set to an empty string ("").

To react to draggable events, the user can write scripts like this:

    EVENTSTART
    Name:ItemSelected
    Value:.+
    SCRIPTSTART

        var feedback = presenter.playerController.getModule('feedback1');
        feedback.change('ITEM-SELECTED');

    SCRIPTEND
    EVENTEND


    EVENTSTART
    Name:ItemSelected
    Value:^$
    SCRIPTSTART

        var feedback = presenter.playerController.getModule('feedback1');
        feedback.change('ITEM-DESELECTED');

    SCRIPTEND
    EVENTEND

For selecting a draggable element (i.e. Image Source), the first script will be executed (because the 'value' field has at least one character - '.+' expression) and feedback changes its message to 'ITEM-SELECTED'. When this item is deselected, the event with an empty 'value' field ('^$' condition) and feedback will change the message to 'ITEM-DESELECTED'.

##Header and Footer Modules

All header and footer modules can be accessed using getHeaderModule() or getFooterModule() methods accordingly. Below you can view a sample script showing how to change the header title on a button click:

    var text1 = presenter.playerController.getHeaderModule('Text1');    
    text1.setText("changed title");

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>---</td>
        <td>---</td>
        <td>---</td>
    </tr>
</table>


## CSS classes

<table border='1'>
    <tr>
        <th>Class name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>---</td>
        <td>---</td>
    </tr>
</table>

The Advanced Connector module does not expose any CSS classes because its internal structure should not be changed (neither via Advanced Connector nor CSS styles).

## External links in script

Try NOT to keep links to resources in the Advanced Connector script. If you want to use external resources, try describing them in CSS (Presenter -> Edit CSS...). Example of a WRONG script:

    $("#MyElem").css("background", (/file/serve/6757006) 0 0 no-repeat);

It is better to define a new class in CSS:

    .background_image {
        background: (/file/serve/6757006) 0 0 no-repeat;
    }

and add to the suitable element:

    $("#MyElem").addClass("background_image");

## Demo presentation

[Demo presentation](/embed/2419014 "Demo presentation") contains examples of how to use the Advanced Connector addon.                      