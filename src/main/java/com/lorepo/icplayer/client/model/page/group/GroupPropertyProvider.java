package com.lorepo.icplayer.client.model.page.group;


import com.lorepo.icf.properties.IBooleanProperty;
import com.lorepo.icf.properties.IEnumSetProperty;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.dimensions.DimensionName;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.printable.Printable;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class GroupPropertyProvider extends ModulesPropertyProvider{
	
	private String printableValue = "";
	private boolean isSplitInPrintBlocked = false;
	
	public GroupPropertyProvider(String name){
		super(name);
	}
	
	public void initGroupPropertyProvider() {
		for(IModuleModel model: moduleModels) {
			model.setGroupPropertyProvider(this);
		}
		registerLeftAndTopProperties();
		addPropertyPrintable();
		addPropertyIsSplitInPrintBlocked();
		update();
	}

	public void closeGroupPropertyProvider() {
		for(IModuleModel model: moduleModels) {
			model.setGroupPropertyProvider(null);
			if(isDiv()) {
				model.changeRelativeToAbsolute(super.getLeft(), super.getTop());
			}
		}
	   super.setIsDiv(false);
	}

	protected void registerLeftAndTopProperties() {
		addPropertyLeft();
		addPropertyTop();
		addPropertyWidth();
		addPropertyHeight();
		addPropertyGroupToDiv();
		addPropertyIsVisible();
	}

	@Override
	public int getWidth() {
		if(isDiv()) {
			return super.getWidth();
		}else {
			int max = 0;
			for(IModuleModel model : moduleModels) {
				int w = (model.getLeft() - super.getLeft()) + model.getWidth();
				if(max < w) {
					max = w;
				}
			}
			super.setWidth(max);
			return max;
		}
	}

	@Override
	public int getHeight() {
		if(isDiv()) {
			return super.getHeight();
		}else {
			int max = 0;
			for(IModuleModel model : moduleModels) {
				int h = (model.getTop() - super.getTop()) + model.getHeight();
				if(max < h) {
						max = h;
				}
			}
			super.setHeight(max);
			return max;
		}
	}

	@Override
	public void setLeft(int left) {
		int num = left - super.getLeft();
		super.setLeft(left);
		if(!isDiv()){
			for(IModuleModel model : moduleModels) {
				model.setLeft(model.getLeft() + num);
			}
		}
		sendPropertyChangedEvent(leftProperty);
	}

	@Override
	public void setTop(int top) {
		int num = top - super.getTop();
		super.setTop(top);
		if(!isDiv()){
			for(IModuleModel model : moduleModels) {
				model.setTop(model.getTop() + num);
			}
		}
		sendPropertyChangedEvent(topProperty);
	}

	@Override
	public void setWidth(int width) {
		if(isDiv()) {
			super.setIsModificatedWidth(true);
			super.setWidth(width);
		}
		sendPropertyChangedEvent(widthProperty);
	}

	@Override
	public void setHeight(int height) {
		if(isDiv()) {
			super.setIsModificatedHeight(true);
			super.setHeight(height);
		}
		sendPropertyChangedEvent(heightProperty);
	}


	private void addPropertyLeft() {

		this.leftProperty = new IProperty() {

			public String ATTRIBUTE_KEY = DimensionName.LEFT;
			public String ATTRIBUTE_NAME = "Left";

			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setLeft(Integer.parseInt(newValue));
				}
			}

			@Override
			public String getValue() {
				update();
				return Integer.toString(getLeft());
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

		addProperty(this.leftProperty);
	}

	private void addPropertyTop() {

		topProperty = new IProperty() {

			public String ATTRIBUTE_KEY = DimensionName.TOP;
			public String ATTRIBUTE_NAME = "Top";

			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setTop(Integer.parseInt(newValue));
				}
			}

			@Override
			public String getValue() {
				update();
				return Integer.toString(getTop());
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

			public String ATTRIBUTE_KEY = DimensionName.WIDTH;
			public String ATTRIBUTE_NAME = "Width";

			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setWidth(Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return Integer.toString(getWidth());
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

			public String ATTRIBUTE_KEY = DimensionName.HEIGHT;
			public String ATTRIBUTE_NAME = "Height";

			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setHeight(Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return Integer.toString(getHeight());
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

	private void addPropertyGroupToDiv() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);
				if (value != isDiv()) {
					setDiv(value);
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isDiv() ? "True" : "False";
			}

			@Override
			public String getName() {
				return "Group modules in a div container";
			}

			@Override
			public String getDisplayName() {
				return "Group modules in a div container";
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}

	private void addPropertyIsVisible() {
		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isVisible()) {
					setIsVisible(value);
					updateVisible(value);
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isVisible() ? "True" : "False";
			}

			@Override
			public String getName() {
				return "Is Visible";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("is_visible");
			}

			@Override
			public boolean isDefault() {
				return false;
			}

		};

		addProperty(property);
	}


	private void updateVisible(boolean isVisible) {
		for(IModuleModel m : moduleModels) {
			m.setIsVisible(isVisible);
		}
	}

	private void updatePoint() {
		int minLeft = moduleModels.get(0).getLeft();
		int minTop = moduleModels.get(0).getTop();
		for(IModuleModel model : moduleModels) {
			if(minLeft > model.getLeft()) {
				minLeft = model.getLeft();
			}
			if(minTop > model.getTop()) {
				minTop = model.getTop();
			}
		}
		super.setLeft(minLeft);
		super.setTop(minTop);
	}

	public void update() {
		if(!isDiv()) {
			if(moduleModels.size() > 0) {
				updatePoint();
			}
		}
	}

	public void updatePointleft(int delta) {
		if(isDiv()) {
			super.setLeft(super.getLeft() + delta);
		}
	}

	public void updatePointTop(int delta) {
		if(isDiv()) {
			super.setTop(super.getTop() + delta);
		}
	}

	public void setDiv(boolean isDiv) {
		if(isDiv()!= isDiv) {
			if(isDiv) {
				changeAbsoluteToRelative();
				super.setIsModificatedHeight(false);
				super.setIsModificatedWidth(false);
			}
			else {
				changeRelativeToAbsolute();
			}
			super.setIsDiv(isDiv);
		}
	}

	public void changeAbsoluteToRelative() {
		for(IModuleModel m : moduleModels) {
			m.changeAbsoluteToRelative(super.getLeft(), super.getTop());
		}
	}

	public void changeRelativeToAbsolute() {
		for(IModuleModel m : moduleModels) {
			m.changeRelativeToAbsolute(super.getLeft(), super.getTop());
		}
	}

	public void setIsVisible(boolean isVisible) {
		semiResponsivePositions.setIsVisible(isVisible);
	}

	public boolean isVisible() {
		return semiResponsivePositions.isVisible();
	}
	
	public boolean isModificatedHeight() {
		return super.isModificatedHeight(); 
	}
	
	public boolean isModificatedWidth() {
		return super.isModificatedWidth(); 
	}
	
	private void addPropertyPrintable() {
		IProperty property = new IEnumSetProperty() {

			@Override
			public void setValue(String newValue) {	
				printableValue = newValue;
			}

			@Override
			public String getValue() {
				return printableValue;
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get(Printable.NAME_LABEL);
			}

			@Override
			public int getAllowedValueCount() {
				return 3;
			}

			@Override
			public String getAllowedValue(int index) {
				return Printable.getStringValues(index);
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(Printable.NAME_LABEL);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	public PrintableMode getPrintable() {
		return Printable.getPrintableModeFromString(printableValue);
	}
	
	public void setPrintable(PrintableMode mode) {
		printableValue = Printable.getStringValues(mode);
	}
	
	private void addPropertyIsSplitInPrintBlocked() {

		IProperty property = new IBooleanProperty() {

			@Override
			public void setValue(String newValue) {
				boolean value = (newValue.compareToIgnoreCase("true") == 0);

				if (value != isSplitInPrintBlocked) {
					isSplitInPrintBlocked = value;
					sendPropertyChangedEvent(this);
				}
			}

			@Override
			public String getValue() {
				return isSplitInPrintBlocked ? "True" : "False";
			}

			@Override
			public String getName() {
				return DictionaryWrapper.get("printable_block_split_label");
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("printable_block_split_label");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};

		addProperty(property);
	}
	
	public boolean isSplitInPrintBlocked() {
		return isSplitInPrintBlocked;
	}
	
	public void setSplitInPrintBlocked(boolean value) {
		isSplitInPrintBlocked = value;
	}
}
