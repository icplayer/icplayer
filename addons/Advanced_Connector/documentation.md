## Description
Advanced Connector is a special kind of addon. It combines multiple addons and modules in fully interactive, responsive exercises.

## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Scripts</td>
        <td>List of scripts to be executed when specified conditions occur</td>
    </tr>
    <tr>
        <td>Is disabled</td>
        <td>This property allows to disable Advanced Connector module so that it doesn't react (evaluate any scripts) when new events hit Event Bus.
        </td> 
    </tr>
</table>


## Scripts syntax
Each script starts with the 'EVENTSTART' keyword and ends with 'EVENTEND'. All conditions and script to be executed must be placed between them!  
Each script is executed when specified conditions occur. These conditions match event data sent by other addons. User can filter events through:

* Name - name of the event type. There are few event types: Definition, ItemSelected, ItemConsumed, ItemReturned and ValueChanged. **By default, events are filtered by 'Name:ValueChanged' condition. In order to be able to react to other types of events, it is necessary to specify them in a condition!**
* Source - ID of the addon/page/module which sends the event (ValueChanged and PageLoaded events only)
* Item - 'item' field value of event data
* Value - 'value' field value of event data
* Score - 'score' field value of event data (ValueChanged events only)
* Type - 'type' field value of event data (draggable events only)
* Word - 'word' field value of event data (Definition events only)

For full reference of event types and fields please go to [documentation](/doc/page/Addon-Events "Documentation").

Additionally, the Advanced Connector addon emulates three events: Reset, Check (when entering error checking mode) and Uncheck (when returning from error checking mode). Those three events can be used in event type of scripts (see [demo presentation](/embed/2419014 "Demo presentation") for examples).

Above conditions are specified using the JavaScript Regular Expression format. For more information see [Introductory Guide to regular expressions](http://www.javascriptkit.com/javatutors/re.shtml "Introductory Guide to regular expressions") from [JavaScript Kit](http://www.javascriptkit.com "JavaScript Kit").  
Omitting a particular condition is equal to setting its value to '.*'.

Script to be executed is simply JavaScript script. It has to start with 'SCRIPTSTART' and end with 'SCRIPTEND' keywords.
To access the addon or module a user has to use getModule(moduleID) method from playerController. For example, to switch frame to next in Image Viewer Addon a user can add syntax like below:

    presenter.playerController.getModule('ImageViewer1').next();

Example script from [demo presentation](/embed/2419014 "Demo presentation") looks like below:

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

Above script is executed when the addon with ID TrueFalse1 sends event with item '1-1' and value '1' (other fields don't matter in this example). When this happens, the Audio addon is played, Feedback changes its text and Image Viewer changes its frame.

Additionally to playerController, each executed script has access to 'event' variable which holds all information about the event that triggered current script. For example, let's display them using Text module:

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
	
Event object has following properties:

* name
* source
* item
* value
* score
* word
* type

If some property is not present in a current event, its value is set to empty string ("").

To react on draggable events a user can write scripts like this:

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

For selecting a draggable element (i.e. Image Source) the first script will be executed (because 'value' field has at least one character - '.+' expression) and feedback changes its message to 'ITEM-SELECTED'. When this item is deselected, the event with empty 'value' field ('^$' condition) and feedback will change message to 'ITEM-DESELECTED'.

##Header and Footer Modules

All header and footer modules can be accessed using getHeaderModule() or getFooterModule() methods accordingly. Below you can view a sample script showing how to change a header title on a button click:

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

Advanced Connector addon doesn't expose any CSS classes because its internal structure should not be changed (neither via Advanced Connector nor CSS styles).

## External links in script

Try NOT to keep links to resources in Advanced Connector script. If you want to use external resources try describe them in CSS (Presenter -> Edit CSS...). Example of WRONG script:

    $("#MyElem").css("background", (/file/serve/6757006) 0 0 no-repeat);

It is better to define new class in CSS:

    .background_image {
        background: (/file/serve/6757006) 0 0 no-repeat;
    }

and add to suitable element:

    $("#MyElem").addClass("background_image");

## Demo presentation

[Demo presentation](/embed/2419014 "Demo presentation") contains examples of how to use the Advanced Connector addon.                      