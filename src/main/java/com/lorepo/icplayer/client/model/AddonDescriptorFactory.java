package com.lorepo.icplayer.client.model;

import java.util.Collection;
import java.util.HashMap;

import com.google.gwt.core.client.GWT;

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
		addDescriptor("Advanced_Connector", "Advanced Connector", "Scripting");
		addDescriptor("Animation", "Animation", "Media");
		addDescriptor("Audio", "Audio", "Media");
		addDescriptor("Connection", "Connection", "Activities");
		addDescriptor("Connector", "Connector", "Scripting");
		addDescriptor("crossword", "Crossword", "Activities");
		addDescriptor("Double_State_Button", "Double State Button", "Scripting");
		addDescriptor("Event_Listener", "Event Listener", "Others");
		addDescriptor("Event_Sender", "Event Sender", "Others");
		addDescriptor("feedback", "Feedback", "Scripting");
		addDescriptor("Glossary", "Glossary", "Media");
		addDescriptor("graph", "Graph", "Activities");
		addDescriptor("Hangman", "Hangman", "Activities");
		addDescriptor("Image_Identification", "Image Identification", "Activities");
		addDescriptor("Image_Viewer_Public", "Image Viewer", "Media");
		addDescriptor("Image_Viewer_Button_Controlled_Public", "Image Viewer Button Controlled", "Media");
		addDescriptor("Layered_Image", "Layered Image", "Media");
		addDescriptor("Logger", "Logger", "Others");
		addDescriptor("Magic_Boxes", "Magic Boxes", "Activities");
		addDescriptor("Math", "Math", "Activities");
		addDescriptor("gamememo", "Memo Game", "Activities");
		addDescriptor("MultiAudio", "MultiAudio", "Media");
		addDescriptor("Multiple_Audio_Controls_Binder", "Multiple Audio Controls Binder", "Scripting");
		addDescriptor("multiplegap", "Multiple Gap", "Activities");
		addDescriptor("Navigation_Bar", "Navigation Bar", "Navigation");
		addDescriptor("Page_Counter", "Page Counter", "Navigation");
		addDescriptor("Page_Name", "Page Name", "Navigation");
		addDescriptor("Plot", "Plot", "Activities");
		addDescriptor("Points_To_Plot", "Points To Plot", "Activities");
		addDescriptor("Puzzle", "Puzzle", "Activities");
		addDescriptor("Single_State_Button", "Single State Button", "Scripting");
		addDescriptor("Slider", "Slider", "Scripting");
		addDescriptor("Slideshow", "Slideshow", "Media");
		addDescriptor("Standard_Shapes", "Standard Shapes", "Media");
		addDescriptor("Table", "Table", "Activities");
		addDescriptor("Table_Of_Contents", "Table Of Contents", "Navigation");
		addDescriptor("text_identification", "Text Identification", "Activities");
		addDescriptor("TrueFalse", "True False", "Activities");
		addDescriptor("video", "Video", "Media");
		addDescriptor("WritingCalculations", "Writing Calculations", "Activities");
		addDescriptor("Vimeo", "Vimeo", "Media");
		addDescriptor("YouTube_Addon", "YouTube", "Media");
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
