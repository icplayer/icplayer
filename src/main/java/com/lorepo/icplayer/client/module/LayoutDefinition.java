package com.lorepo.icplayer.client.module;

import com.google.gwt.xml.client.Element;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;

public class LayoutDefinition implements ILayoutDefinition{

	private boolean left = true;
	private boolean top = true;
	private boolean right = false;
	private boolean bottom = false;
	private boolean width = true;
	private boolean height = true;
	
	
	@Override
	public boolean hasLeft() {
		return left;
	}

	@Override
	public boolean hasRight() {
		return right;
	}

	@Override
	public boolean hasWidth() {
		return width;
	}

	@Override
	public boolean hasTop() {
		return top;
	}

	@Override
	public boolean hasBottom() {
		return bottom;
	}

	@Override
	public boolean hasHeight() {
		return height;
	}

	public void load(Element element) {
		decodeType(element.getAttribute("type"));
	}

	private void decodeType(String type) {

		if(type.length() < 4){
			return;
		}
		
		if(type.charAt(0) == 'L'){
			left = true;
		}
		else if(type.charAt(0) == 'R'){
			left = false;
			right = true;
		}

		if(type.charAt(1) == 'T'){
			top = true;
		}
		else if(type.charAt(1) == 'B'){
			top = false;
			bottom = true;
		}
		
		if(type.charAt(2) == 'W'){
			width = true;
		}
		else if(type.charAt(2) == 'R'){
			width = false;
			right = true;
		}
		
		if(type.charAt(3) == 'H'){
			height = true;
		}
		else if(type.charAt(3) == 'B'){
			height = false;
			bottom = true;
		}
	}

	public String toXML() {
		String xml = "<layout type='" + encodeType() + "'/>";
		
		return xml;
	}

	private String encodeType() {
		String type;
		
		if(left){
			type = "L";
		}
		else{
			type = "R";
		}
		
		if(top){
			type += "T";
		}
		else{
			type += "B";
		}
		
		if(width){
			type += "W";
		}
		else{
			type += "R";
		}
		
		if(height){
			type += "H";
		}
		else{
			type += "B";
		}
		
		return type;
	}	
	
	
}
