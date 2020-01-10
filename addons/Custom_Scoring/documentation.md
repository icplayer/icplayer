## Description
The Custom Scoring addon has been developed with a view to the needs of all teachers who prepare complex activities in their lessons. With this addon, a teacher can create both simple and complicated activities from a variety of modules available in Player.


## Properties

<table border='1'>
    <tr>
        <th>Property name</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Script</td>
        <td>Script that will be executed when the evaluate() command is called or the Check button is pressed.</td>
    </tr>
	<tr>
		<td>Max Score</td>
		<td>The maximum score of an activity</td>
	</tr>
</table>

## Script

The code provided in a module's property is in fact a fully-functional JavaScript script. Within it, a user has access to the [PlayerController object](http://www.icplayer.com/doc/addon/player_services.html "Player documentation") (saved in the presenter.playerController variable as in [Advanced Connector](http://www.mauthor.com/doc/page/Advanced-Connector "Advanced Connector documentation")), thanks to which it can gain access to all modules placed inside a page. Additionally, the presenter variable has two additional methods:

* setScore
* setErrors

Both are used to set the activity result. They take zero or positive integer value for the parameter. When this score is higher than the 'Max Score' property or is invalid - the score will not be saved.

Remember that after the script is evaluated, it might be necessary to do some work with Advanced Connector in order to restore the state before the evaluation (like in the example below where the mark classes have been removed).

## Script example

The script used in [demo presentation](http://www.mauthor.com/embed/8438171 "Demo presentation") works with three Image Identification modules (with IDs: 'balloon', 'plain' and 'helicopter') and looks like this:

	var balloon = presenter.playerController.getModule('balloon'),
		plain = presenter.playerController.getModule('plain'),
		helicopter = presenter.playerController.getModule('helicopter');

	if (balloon.isSelected() && helicopter.isSelected()) {
		presenter.setScore(1);
		presenter.setErrors(0);

		balloon.markAsCorrect();
		plain.markAsCorrect();
		helicopter.markAsCorrect();
	} else {
		presenter.setScore(0);
		presenter.setErrors(1);
		
		balloon.markAsWrong();
		plain.markAsWrong();
		helicopter.markAsWrong();
	}

In addition, the Advanced Connector script (running on the Uncheck event) looks like this:

	EVENTSTART
	Name:Uncheck
	SCRIPTSTART
		var balloon = presenter.playerController.getModule('balloon'),
			plain = presenter.playerController.getModule('plain'),
			helicopter = presenter.playerController.getModule('helicopter');

		balloon.removeMark();
		plain.removeMark();
		helicopter.removeMark();
	SCRIPTEND
	EVENTEND

## Supported commands

<table border='1'>
    <tr>
        <th>Command name</th>
        <th>Params</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>evaluate</td>
        <td>---</td>
        <td>Evaluates specified script</td>
    </tr>
    <tr>
        <td>setScore</td>
        <td>score</td>
        <td>Sets score value for module. Score value must be a natural number</td>
    </tr>
    <tr>
        <td>setErrors</td>
        <td>errors</td>
        <td>Sets errors value for module. Errors value must be a natural number</td>
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

## Demo presentation
[Demo presentation](http://www.mauthor.com/embed/8438171 "Demo presentation") contains examples of how to use the Custom Scoring addon.               