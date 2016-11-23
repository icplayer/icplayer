package com.lorepo.icplayer.client.model.addon;

public class AddonEntry {

	private String category;
	private String id;
	private String name;
	private String descriptorURL;
	
	public AddonEntry(String id, String name, String descriptorURL, String category){
		
		this.id = id;
		this.name = name;
		this.descriptorURL = descriptorURL;
		this.category = category;
	}
	
	public String getId(){
		return id;
	}
	
	public String getDescriptorURL(){
		return descriptorURL;
	}

	public String getName() {
		return name;
	}
	
	public String getCategory(){
		return category;
	}
	
}
