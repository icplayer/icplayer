package com.lorepo.icplayer.client.module.api.event.dnd;


public class DraggableItem {

	private String id;
	private String text;
	
		
	public static DraggableItem createFromString(String data){

		DraggableItem item = null;
		String[] tokens = data.split("@");
		if(tokens.length == 2){
			item = new DraggableItem(tokens[0], tokens[1]);
		}
		
		return item;
	}
	
	
	public DraggableItem(String id, String text){
		this.id = id;
		this.text = text;
	}
	
	
	public String getId(){
		return id;
	}
	
	
	public String getValue(){
		return text;
	}
	
	
	public String toString(){
		return id + "@" + text;
	}
}
