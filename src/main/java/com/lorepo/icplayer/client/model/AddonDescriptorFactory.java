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
		addDescriptor("YouTube_Addon", "Youtube", "Media");
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
	
	public Collection<AddonEntry> getEntries(){
		return addonList.values();
	}
}
