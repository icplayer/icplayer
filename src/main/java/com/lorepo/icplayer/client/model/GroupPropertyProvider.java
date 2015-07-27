package com.lorepo.icplayer.client.model;

import java.util.ArrayList;
import java.util.List;

import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icf.properties.IPropertyProvider;
import com.lorepo.icplayer.client.module.api.IModuleModel;

@SuppressWarnings("serial")
public class GroupPropertyProvider extends ArrayList<IModuleModel> implements IPropertyProvider{
	private List<IProperty>	properties = new ArrayList<IProperty>();
	private List<IPropertyListener>	propertyListeners = new ArrayList<IPropertyListener>();
	private final String name;
	
	
	public GroupPropertyProvider(String name){
		this.name = name;
	}
	
	@Override
	public void addPropertyListener(IPropertyListener listener){
		propertyListeners.add(listener);
	}
	
	@Override
	public void removePropertyListener(IPropertyListener listener){
		propertyListeners.remove(listener);
	}
	
	
	@Override
	public int getPropertyCount() {
		return properties.size();
	}

	@Override
	public IProperty getProperty(int index) {
		return properties.get(index);
	}

	public IProperty getPropertyByName(String name) {
		for(IProperty property : properties){
			if(property.getName().compareTo(name) == 0){
				return property;
			}
		}
		
		return null;
	}

	public void addProperty(IProperty property) {
		properties.add(property);
	}
	
	public void removeProperty(IProperty property) {
		properties.remove(property);
	}

	public void sendPropertyChangedEvent(IProperty source){
		for(IPropertyListener listener : propertyListeners){
			listener.onPropertyChanged(source);
		}
	}

	@Override
	public String getProviderName() {
		return name;
	}
}
