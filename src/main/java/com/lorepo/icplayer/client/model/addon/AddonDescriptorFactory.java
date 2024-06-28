package com.lorepo.icplayer.client.model.addon;

import com.google.gwt.core.client.GWT;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;

import java.util.Collection;
import java.util.HashMap;

public class AddonDescriptorFactory {

	private static AddonDescriptorFactory theInstance = null;

	public static AddonDescriptorFactory getInstance(){
		if (theInstance == null) {
			theInstance = new AddonDescriptorFactory();
		}
		return theInstance;
	}

	private HashMap<String, AddonEntry>	addonList;

	public AddonDescriptorFactory() {
		registerLocalDescriptors();
	}

	/**
	 * Init list of local addons
	 */
	private void registerLocalDescriptors() {
		addonList = new HashMap<String, AddonEntry>();

		// ACTIVITIES
		addDescriptor("Basic_Math_Gaps", "activities_menu");
		addDescriptor("Clock", "activities_menu");
		addDescriptor("ConnectingDots", "activities_menu");
		addDescriptor("Connection", "activities_menu");
		addDescriptor("Count_and_Graph", "activities_menu");
		addDescriptor("Fractions", "activities_menu");
		addDescriptor("FigureDrawing", "activities_menu");
		addDescriptor("GeometricConstruct", "activities_menu");
		addDescriptor("graph", "activities_menu");
		addDescriptor("Image_Identification", "activities_menu");
		addDescriptor("Line_Number", "activities_menu");
		addDescriptor("Line_Selection", "activities_menu");
		addDescriptor("Math", "activities_menu");
		addDescriptor("MathText", "activities_menu");
		addDescriptor("multiplegap", "activities_menu");
		addDescriptor("Paragraph", "activities_menu");
		addDescriptor("Paragraph_Keyboard", "activities_menu");
		addDescriptor("PieChart", "activities_menu");
		addDescriptor("Plot", "activities_menu");
		addDescriptor("Points_To_Plot", "activities_menu");
		addDescriptor("PointsLines", "activities_menu");
		addDescriptor("Speechace", "activities_menu");
		addDescriptor("Table", "activities_menu");
		addDescriptor("text_identification", "activities_menu");
		addDescriptor("Text_Coloring", "activities_menu");
		addDescriptor("Text_Selection", "activities_menu");
		addDescriptor("TrueFalse", "activities_menu");
		addDescriptor("WritingCalculations", "activities_menu");

		// GAMES
		addDescriptor("Board_Game", "games_menu");
		addDescriptor("Dice", "games_menu");
		addDescriptor("Catch", "games_menu");
		addDescriptor("crossword", "games_menu");
		addDescriptor("Hangman", "games_menu");
		addDescriptor("Magic_Boxes", "games_menu");
		addDescriptor("gamememo", "games_menu");
		addDescriptor("Puzzle", "games_menu");
		addDescriptor("Quiz", "games_menu");
		addDescriptor("Shooting_Range", "games_menu");
		addDescriptor("Sudoku", "games_menu");
		addDescriptor("Maze", "games_menu");

		// REPORTING
		addDescriptor("Animated_Lesson_Progress", "reporting_menu");
		addDescriptor("Animated_Page_Progress", "reporting_menu");
		addDescriptor("Completion_Progress", "reporting_menu");
		addDescriptor("Custom_Scoring", "reporting_menu");
		addDescriptor("Done", "reporting_menu");
		addDescriptor("Hierarchical_Lesson_Report", "reporting_menu");
		addDescriptor("Lesson_Error_Counter", "reporting_menu");
		addDescriptor("Lesson_Progress", "reporting_menu");
		addDescriptor("Lesson_Score_Counter", "reporting_menu");
		addDescriptor("Limited_Show_Answers", "reporting_menu");
		addDescriptor("Limited_Submit", "reporting_menu");
		addDescriptor("Page_Rating", "reporting_menu");
		addDescriptor("Page_Score_Counter", "reporting_menu");
		addDescriptor("Show_Answers", "reporting_menu");
		addDescriptor("Submit", "reporting_menu");
		addDescriptor("Print_Report", "reporting_menu");
		addDescriptor("Page_Progress_Panel", "reporting_menu");
		addDescriptor("Gradual_Show_Answer", "reporting_menu");

		// NAVIGATION
		addDescriptor("External_Link_Button", "navigation_menu");
		addDescriptor("Cross_Lesson", "navigation_menu");
		addDescriptor("Navigation_Bar", "navigation_menu");
		addDescriptor("Assessments_Navigation_Bar", "navigation_menu");
		addDescriptor("Next", "navigation_menu");
		addDescriptor("Page_Counter", "navigation_menu");
		addDescriptor("Page_Name", "navigation_menu");
		addDescriptor("Table_Of_Contents", "navigation_menu");
		addDescriptor("Hierarchical_Table_Of_Contents", "navigation_menu");
		addDescriptor("Adaptive_Next", "navigation_menu");

		// MEDIA
		addDescriptor("Viewer_3D", "media_menu");
		addDescriptor("Animation", "media_menu");
		addDescriptor("Audio", "media_menu");
		addDescriptor("AudioPlaylist", "media_menu");
		addDescriptor("Coloring", "media_menu");
		addDescriptor("Drawing", "media_menu");
		addDescriptor("EdgeAnimation", "media_menu");
		addDescriptor("Glossary", "media_menu");
		addDescriptor("Image_Viewer_Public", "media_menu");
		addDescriptor("Image_Viewer_Button_Controlled_Public", "media_menu");
		addDescriptor("IWB_Toolbar", "media_menu");
		addDescriptor("Layered_Image", "media_menu");
		addDescriptor("Line", "media_menu");
		addDescriptor("LottiePlayer", "media_menu");
		addDescriptor("MultiAudio", "media_menu");
		addDescriptor("ModelViewer3D", "media_menu");
		addDescriptor("Shape_Tracing", "media_menu");
		addDescriptor("Slideshow", "media_menu");
		addDescriptor("Standard_Shapes", "media_menu");
		addDescriptor("SVG2", "media_menu");
		addDescriptor("SwiffyAnimation", "media_menu");
		addDescriptor("Scoreboard", "media_menu");
		addDescriptor("TextAudio", "media_menu");
		addDescriptor("video", "media_menu");
		addDescriptor("Vimeo", "media_menu");
		addDescriptor("YouTube_Addon", "media_menu");
		addDescriptor("Zoom", "media_menu");
		addDescriptor("Zoom_Image", "media_menu");
		addDescriptor("Iframe", "media_menu");
		addDescriptor("Heading", "media_menu");
		addDescriptor("Media_Recorder", "media_menu");
		addDescriptor("FlashCards", "media_menu");
		addDescriptor("EditableWindow", "media_menu");

		// SCRIPTING
		addDescriptor("Advanced_Connector", "scripting_menu");
		addDescriptor("Visual_Feedback_Creator", "scripting_menu");
		addDescriptor("Connector", "scripting_menu");
		addDescriptor("Double_State_Button", "scripting_menu");
		addDescriptor("eKeyboard", "scripting_menu");
		addDescriptor("Event_Listener", "scripting_menu");
		addDescriptor("Event_Sender", "scripting_menu");
		addDescriptor("feedback", "scripting_menu");
		addDescriptor("File_Sender", "scripting_menu");
		addDescriptor("Automatic_Feedback", "scripting_menu");
		addDescriptor("FractionsBinder", "scripting_menu");
		addDescriptor("Logger", "scripting_menu");
		addDescriptor("Multiple_Audio_Controls_Binder", "scripting_menu");
		addDescriptor("Programmed_Drawing", "scripting_menu");
		addDescriptor("SelectableAddonsBinder", "scripting_menu");
		addDescriptor("Single_State_Button", "scripting_menu");
		addDescriptor("Slider", "scripting_menu");
		addDescriptor("MenuPanel", "scripting_menu");
		addDescriptor("Variable_Storage", "scripting_menu");
		addDescriptor("ProgrammingCommandPrompt", "scripting_menu");
		addDescriptor("Grid_Scene", "scripting_menu");
		addDescriptor("Gap_Binder", "scripting_menu");
		addDescriptor("BlocklyCodeEditor", "scripting_menu");
		addDescriptor("Text_To_Speech", "scripting_menu");
        addDescriptor("PseudoCode_Console", "scripting_menu");
		addDescriptor("Timer", "scripting_menu");

		// LEARN PEN
		addDescriptor("LearnPen", "learn_pen_menu");
		addDescriptor("LearnPen_Data", "learn_pen_menu");
		addDescriptor("LearnPen_Report", "learn_pen_menu");
    }

	private void addDescriptor(String id, String category) {
		String moduleBaseURL = GWT.getModuleBaseURL().replaceFirst("^(http://|https://)", "//");
		String url = moduleBaseURL + "addons/" + id + ".xml";
		String name = DictionaryWrapper.get(id + "_name");

		AddonEntry entry = new AddonEntry(id, name, url, category);
		addonList.put(entry.getId(), entry);
	}

	public boolean isLocalAddon(String addonId) {
		return addonList.containsKey(addonId);
	}

	public AddonEntry getEntry(String addonId) {
		return addonList.get(addonId);
	}

	public Collection<AddonEntry> getEntries() {
		return addonList.values();
	}
	
	public void setWirisEnabled(boolean isEnabled) {
		setOptionalAddonEnabled(isEnabled, "MathText", "activities_menu");
	}

	public void setSpeechaceEnabled(boolean isEnabled) {
	    setOptionalAddonEnabled(isEnabled, "Speechace", "activities_menu");
	}

	private void setOptionalAddonEnabled(boolean isEnabled, String addonName, String category) {
        if (isEnabled && !addonList.containsKey(addonName)) {
            addDescriptor(addonName, category);
        }

        if (!isEnabled && addonList.containsKey(addonName)) {
            addonList.remove(addonName);
        }
	}
}