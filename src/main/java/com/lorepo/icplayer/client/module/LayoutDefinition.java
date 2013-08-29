package com.lorepo.icplayer.client.module;

import com.google.gwt.xml.client.Element;
import com.google.gwt.xml.client.NodeList;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;

public class LayoutDefinition implements ILayoutDefinition{

	private boolean left = true;
	private boolean top = true;
	private boolean right = false;
	private boolean bottom = false;
	private String leftRelativeTo = "";
	private Property leftRelativeToProperty = Property.left;
	private String topRelativeTo = "";
	private Property topRelativeToProperty = Property.top;
	private String rightRelativeTo = "";
	private Property rightRelativeToProperty = Property.right;
	private String bottomRelativeTo = "";
	private Property bottomRelativeToProperty = Property.bottom;
	
	
	@Override
	public boolean hasLeft() {
		return left;
	}

	@Override
	public boolean hasRight() {
		return right;
	}

	@Override
	public boolean hasTop() {
		return top;
	}

	@Override
	public boolean hasBottom() {
		return bottom;
	}

	public void load(Element rootElement) {
		decodeType(rootElement.getAttribute("type"));
		NodeList children = rootElement.getChildNodes();
		String propertyName;
		for(int i = 0; i < children.getLength(); i++){
			if(children.item(i) instanceof Element){
				Element node = (Element)children.item(i);
				if(node.getNodeName().compareTo("left") == 0){
					leftRelativeTo = node.getAttribute("relative");
					propertyName = node.getAttribute("property");
					leftRelativeToProperty = getPropertyFromString(propertyName);
				}
				else if(node.getNodeName().compareTo("top") == 0){
					topRelativeTo = node.getAttribute("relative");
					propertyName = node.getAttribute("property");
					topRelativeToProperty = getPropertyFromString(propertyName);
				}
				else if(node.getNodeName().compareTo("right") == 0){
					rightRelativeTo = node.getAttribute("relative");
					propertyName = node.getAttribute("property");
					rightRelativeToProperty = getPropertyFromString(propertyName);
				}
				else if(node.getNodeName().compareTo("bottom") == 0){
					bottomRelativeTo = node.getAttribute("relative");
					propertyName = node.getAttribute("property");
					bottomRelativeToProperty = getPropertyFromString(propertyName);
				}
			}
		}
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
		
		if(type.charAt(2) == 'R'){
			right = true;
		}
		
		if(type.charAt(3) == 'B'){
			bottom = true;
		}
	}

	private Property getPropertyFromString(String name) {
		for(Property property : Property.values()){
			if(property.toString().equals(name)){
				return property;
			}
		}
		return Property.left;
	}

	public String toXML() {
		String xml = "<layout type='" + encodeType() + "'>";
		xml += "<left relative='" + leftRelativeTo + "' property='" + leftRelativeToProperty + "'/>";
		xml += "<top relative='" + topRelativeTo + "' property='" + topRelativeToProperty + "'/>";
		xml += "<right relative='" + rightRelativeTo + "' property='" + rightRelativeToProperty + "'/>";
		xml += "<bottom relative='" + bottomRelativeTo + "' property='" + bottomRelativeToProperty + "'/>";
		xml += "</layout>";
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
		
		if(right && left){
			type += "R";
		}
		else{
			type += "W";
		}
		
		if(top && bottom){
			type += "B";
		}
		else{
			type += "H";
		}
		
		return type;
	}

	@Override
	public String getLeftRelativeTo() {
		return leftRelativeTo;
	}

	@Override
	public Property getLeftRelativeToProperty() {
		return leftRelativeToProperty;
	}

	@Override
	public String getTopRelativeTo() {
		return topRelativeTo;
	}

	@Override
	public Property getTopRelativeToProperty() {
		return topRelativeToProperty;
	}

	@Override
	public String getRightRelativeTo() {
		return rightRelativeTo;
	}

	@Override
	public Property getRightRelativeToProperty() {
		return rightRelativeToProperty;
	}

	@Override
	public String getBottomRelativeTo() {
		return bottomRelativeTo;
	}

	@Override
	public Property getBottomRelativeToProperty() {
		return bottomRelativeToProperty;
	}

	public String getName() {
		return encodeType();
	}

	public void setHasRight(boolean value) {
		right = value;
	}

	public void setHasLeft(boolean value) {
		left = value;
	}

	public void setHasBottom(boolean value) {
		bottom = value;
	}

	public void setHasTop(boolean value) {
		top = value;
	}

	public void setLeftRelativeTo(String moduleName) {
		leftRelativeTo = moduleName;
	}	
	

	public void setRightRelativeTo(String moduleName) {
		rightRelativeTo = moduleName;
	}	

	public void setTopRelativeTo(String moduleName) {
		topRelativeTo = moduleName;
	}	

	public void setBottomRelativeTo(String moduleName) {
		bottomRelativeTo = moduleName;
	}

	public void setLeftRelativeToProperty(Property side) {
		leftRelativeToProperty = side;
	}	

	public void setRightRelativeToProperty(Property side) {
		rightRelativeToProperty = side;
	}	

	public void setTopRelativeToProperty(Property side) {
		topRelativeToProperty = side;
	}	

	public void setBottomRelativeToProperty(Property side) {
		bottomRelativeToProperty = side;
	}

	public boolean hasHeight() {
		return !(top && bottom);
	}

	public boolean hasWidth() {
		return !(left && right);
	}	
	
}
