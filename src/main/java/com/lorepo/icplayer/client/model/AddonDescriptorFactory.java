package com.lorepo.icplayer.client.model;

import com.google.gwt.core.client.GWT;

import java.util.Collection;
import java.util.HashMap;

public class AddonDescriptorFactory {

	private static AddonDescriptorFactory theInstance = null;

	public static AddonDescriptorFactory getInstance(){
		if(theInstance == null){
			theInstance = new AddonDescriptorFactory();
		}
		return theInstance;
	}

	private HashMap<String, AddonEntry>	addonList;

	public AddonDescriptorFactory(){
		registerLocalDescriptors();
	}

    /**
     * Init list of local addons
     */
    private void registerLocalDescriptors() {
        addonList = new HashMap<String, AddonEntry>();

        // ACTIVITIES
        addDescriptor("Basic_Math_Gaps", "Basic Math Gaps", "activities_menu");
        addDescriptor("Clock", "Clock", "activities_menu");
        addDescriptor("ConnectingDots", "Connecting Dots", "activities_menu");
        addDescriptor("Connection", "Connection", "activities_menu");
        addDescriptor("Count_and_Graph", "Count and Graph", "activities_menu");
        addDescriptor("crossword", "Crossword", "activities_menu");
        addDescriptor("Fractions", "Fractions", "activities_menu");
        addDescriptor("graph", "Graph", "activities_menu");
        addDescriptor("Hangman", "Hangman", "activities_menu");
        addDescriptor("Image_Identification", "Image Identification", "activities_menu");
        addDescriptor("Line_Number", "Line Number", "activities_menu");
        addDescriptor("Magic_Boxes", "Magic Boxes", "activities_menu");
        addDescriptor("gamememo", "Memo Game", "activities_menu");
        addDescriptor("Math", "Math", "activities_menu");
        addDescriptor("multiplegap", "Multiple Gap", "activities_menu");
        addDescriptor("Paragraph", "Paragraph", "activities_menu");
        addDescriptor("Plot", "Plot", "activities_menu");
        addDescriptor("Points_To_Plot", "Points To Plot", "activities_menu");
        addDescriptor("PointsLines", "Points and Lines", "activities_menu");
        addDescriptor("Puzzle", "Puzzle", "activities_menu");
        addDescriptor("Sudoku", "Sudoku", "activities_menu");
        addDescriptor("Table", "Table", "activities_menu");
        addDescriptor("text_identification", "Text Identification", "activities_menu");
        addDescriptor("Text_Selection", "Text Selection", "activities_menu");
        addDescriptor("TrueFalse", "True False", "activities_menu");
        addDescriptor("WritingCalculations", "Writing Calculations", "activities_menu");

        // REPORTING
        addDescriptor("Animated_Lesson_Progress", "Animated Lesson Progress", "reporting_menu");
        addDescriptor("Animated_Page_Progress", "Animated Page Progress", "reporting_menu");
        addDescriptor("Completion_Progress", "Completion Progress", "reporting_menu");
        addDescriptor("Custom_Scoring", "Custom Scoring", "reporting_menu");
        addDescriptor("Done", "Done", "reporting_menu");
        addDescriptor("Hierarchical_Lesson_Report", "Hierarchical Lesson Report", "reporting_menu");
        addDescriptor("Lesson_Error_Counter", "Lesson Error Counter", "reporting_menu");
        addDescriptor("Page_Rating", "Page Rating", "reporting_menu");
        addDescriptor("Page_Score_Counter", "Page Score Counter", "reporting_menu");
        addDescriptor("Show_Answers", "Show Answers", "reporting_menu");
        addDescriptor("Submit", "Submit", "reporting_menu");

        // NAVIGATION
        addDescriptor("External_Link_Button", "External Link Button", "navigation_menu");
        addDescriptor("Navigation_Bar", "Navigation Bar", "navigation_menu");
        addDescriptor("Next", "Next", "navigation_menu");
        addDescriptor("Page_Counter", "Page Counter", "navigation_menu");
        addDescriptor("Page_Name", "Page Name", "navigation_menu");
        addDescriptor("Table_Of_Contents", "Table Of Contents", "navigation_menu");

        // SCRIPTING
        addDescriptor("Viewer_3D", "3D Viewer", "media_menu");
        addDescriptor("Animation", "Animation", "media_menu");
        addDescriptor("Audio", "Audio", "media_menu");
        addDescriptor("Coloring", "Coloring", "media_menu");
        addDescriptor("Drawing", "Drawing", "media_menu");
        addDescriptor("EdgeAnimation", "Edge Animation", "media_menu");
        addDescriptor("Glossary", "Glossary", "media_menu");
        addDescriptor("Image_Viewer_Public", "Image Viewer", "media_menu");
        addDescriptor("Image_Viewer_Button_Controlled_Public", "Image Viewer Button Controlled", "media_menu");
        addDescriptor("IWB_Toolbar", "IWB Toolbar", "media_menu");
        addDescriptor("Layered_Image", "Layered Image", "media_menu");
        addDescriptor("Line", "Line", "media_menu");
        addDescriptor("MultiAudio", "MultiAudio", "media_menu");
        addDescriptor("Shape_Tracing", "Shape Tracing", "media_menu");
        addDescriptor("Slideshow", "Slideshow", "media_menu");
        addDescriptor("Standard_Shapes", "Standard Shapes", "media_menu");
        addDescriptor("SVG2", "SVG", "media_menu");
        addDescriptor("SwiffyAnimation", "Swiffy Animation", "media_menu");
        addDescriptor("TextAudio", "TextAudio", "media_menu");
        addDescriptor("video", "Video", "media_menu");
        addDescriptor("Vimeo", "Vimeo", "media_menu");
        addDescriptor("YouTube_Addon", "YouTube", "media_menu");
        addDescriptor("Zoom_Image", "Zoom Image", "media_menu");

        // SCRIPTING
        addDescriptor("Advanced_Connector", "Advanced Connector", "scripting_menu");
        addDescriptor("Connector", "Connector", "scripting_menu");
        addDescriptor("Double_State_Button", "Double State Button", "scripting_menu");
        addDescriptor("eKeyboard", "eKeyboard", "scripting_menu");
        addDescriptor("Event_Listener", "Event Listener", "scripting_menu");
        addDescriptor("Event_Sender", "Event Sender", "scripting_menu");
        addDescriptor("feedback", "Feedback", "scripting_menu");
        addDescriptor("Logger", "Logger", "scripting_menu");
        addDescriptor("Multiple_Audio_Controls_Binder", "Multiple Audio Controls Binder", "scripting_menu");
        addDescriptor("Single_State_Button", "Single State Button", "scripting_menu");
        addDescriptor("Slider", "Slider", "scripting_menu");

        // LEARN PEN
        addDescriptor("LearnPen_Data", "LearnPen Data", "learn_pen_menu");
        addDescriptor("LearnPen", "LearnPen Drawing", "learn_pen_menu");
    }

	private void addDescriptor(String id, String name, String category) {
		AddonEntry entry;
		String url = GWT.getModuleBaseURL() + "addons/" + id + ".xml";
		entry = new AddonEntry(
				id,
				name,
				url,
				category);
		addonList.put(entry.getId(), entry);
	}

	public boolean isLocalAddon(String addonId){
		return addonList.containsKey(addonId);
	}

	public AddonEntry getEntry(String addonId){
		return addonList.get(addonId);
	}

	public Collection<AddonEntry> getEntries(){
		return addonList.values();
	}
}
