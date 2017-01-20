package com.lorepo.icplayer.client.module;

import java.util.HashMap;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;
import com.lorepo.icplayer.client.module.api.IRectangleItem;

/**
 * Function for positioning module on the page
 * 
 * @author Krzysztof Langner
 */
class AbsolutePositioningModule extends BasicPropertyProvider implements IRectangleItem {

	protected HashMap<String, LayoutDefinition> layoutsDefinitions = new HashMap<String, LayoutDefinition>();

	private ILayoutProperty layoutProperty;
	private IProperty leftProperty;
	private IProperty rightProperty;
	private IProperty topProperty;
	private IProperty bottomProperty;
	private IProperty widthProperty;
	private IProperty heightProperty;
	
	private HashMap<String, HashMap<String, Integer>> positions = new HashMap<String, HashMap<String, Integer>>();
	protected String positionType = "default";
	
	private boolean disableChangeEvent = false;
	
	public AbsolutePositioningModule(String name){
		super(name);
		this.layoutsDefinitions.put("default", new LayoutDefinition());
		this.positions.put(this.positionType, new HashMap<String, Integer>());
	}

	protected void registerPositionProperties() {
		addPropertyLayout();
		addPropertyLeft();
		addPropertyTop();
		addPropertyWidth();
		addPropertyHeight();
		addPropertyRight();
		addPropertyBottom();
	}
	
	@Override
	public ILayoutDefinition getLayout(){
		return this.layoutsDefinitions.get(this.positionType);
	}
	
	private int getPositionValue(String attribute) {
		if (this.hasPositionValue(attribute)) {
			return this.positions.get(this.positionType).get(attribute);
		} else {
			return 0;
		}
	}
	
	private void setPositionValue(String attribute, int value) {
		HashMap<String, Integer> position = this.positions.get(this.positionType);
		position.put(attribute, value);
		
		this.positions.put(this.positionType, position);
	}
	
	@Override
	public int getLeft() {
		return this.getPositionValue("left");
	}
	
	@Override
	public int getRight() {
		return this.getPositionValue("right");
	}

	@Override
	public int getTop() {
		return this.getPositionValue("top");
	}

	@Override
	public int getBottom() {
		return this.getPositionValue("bottom");
	}

	@Override
	public int getWidth() {
		return this.getPositionValue("width");
	}

	@Override
	public int getHeight() {
		return this.getPositionValue("height");
	}
	
	public boolean hasPositionValue(String attribute) {
		return this.positions.get(positionType).containsKey(attribute);
	}
	
	protected String getLayoutXML() {
		return this.layoutsDefinitions.get(this.positionType).toXML();
	}

	@Override
	public void setLeft(int left) {

		this.setPositionValue("left", left);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(leftProperty);
		}
	}

	@Override
	public void setRight(int right) {

		this.setPositionValue("right", right);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(rightProperty);
		}
	}

	@Override
	public void setTop(int top) {

		this.setPositionValue("top", top);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(topProperty);
		}
	}

	@Override
	public void setBottom(int bottom) {

		this.setPositionValue("bottom", bottom);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(bottomProperty);
		}
	}

	@Override
	public void setWidth(int width) {

		this.setPositionValue("width", width);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(widthProperty);
		}
	}

	@Override
	public void setHeight(int height) {

		this.setPositionValue("height", height);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(heightProperty);
		}
	}
	
	public void setPosition(String name, HashMap<String, Integer> position) {
		this.positions.put(name, position);
	}


	private void addPropertyLayout() {

		layoutProperty = new ILayoutProperty() {
			
			@Override
			public void setValue(String newValue) {
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return layoutsDefinitions.get(positionType).getName();
			}
			
			@Override
			public String getName() {
				return "Layout";
			}

			@Override
			public LayoutDefinition getLayout() {
				return layoutsDefinitions.get(positionType);
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("layout");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(layoutProperty);
	}


	private void addPropertyLeft() {

		leftProperty = new IProperty() {
			
			public String ATTRIBUTE_KEY = "left";
			public String ATTRIBUTE_NAME = "Left";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(hasPositionValue(ATTRIBUTE_KEY)){
					return Integer.toString(getLeft());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(leftProperty);
	}

	
	private void addPropertyTop() {

		topProperty = new IProperty() {
			
			public String ATTRIBUTE_KEY = "top";
			public String ATTRIBUTE_NAME = "Top";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(hasPositionValue(ATTRIBUTE_KEY)){
					return Integer.toString(getTop());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(topProperty);
	}

	private void addPropertyWidth() {

		widthProperty = new IProperty() {
			
			public String ATTRIBUTE_KEY = "width";
			public String ATTRIBUTE_NAME = "Width";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(hasPositionValue(ATTRIBUTE_KEY)){
					return Integer.toString(getWidth());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(widthProperty);
	}

	private void addPropertyHeight() {

		heightProperty = new IProperty() {
			
			public String ATTRIBUTE_KEY = "height";
			public String ATTRIBUTE_NAME = "Height";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(hasPositionValue(ATTRIBUTE_KEY)){
					return Integer.toString(getHeight());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(heightProperty);
	}


	@Override
	public void disableChangeEvent(boolean disable) {
		disableChangeEvent = disable;
	}

	private void addPropertyRight() {

		rightProperty = new IProperty() {
			
			public String ATTRIBUTE_KEY = "right";
			public String ATTRIBUTE_NAME = "Right";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(hasPositionValue(ATTRIBUTE_KEY)){
					return Integer.toString(getRight());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(rightProperty);
	}


	private void addPropertyBottom() {

		bottomProperty = new IProperty() {
			
			public String ATTRIBUTE_KEY = "bottom";
			public String ATTRIBUTE_NAME = "Bottom"; 
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(hasPositionValue(ATTRIBUTE_KEY)){
					return Integer.toString(getBottom());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(bottomProperty);
	}
	
	public void loadLayout(Element node) {
		LayoutDefinition layout = this.layoutsDefinitions.get("default");
		layout.load(node);
		this.layoutsDefinitions.put("default", layout);
	}
}
