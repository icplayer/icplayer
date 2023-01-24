package com.lorepo.icplayer.client.model;

import java.util.ArrayList;
import java.util.List;

import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.IPropertyListener;
import com.lorepo.icplayer.client.framework.module.IStyleListener;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.INameValidator;


@SuppressWarnings("serial")
public class ModuleList extends ArrayList<IModuleModel> {

	private List<IModuleListListener>	listeners = new ArrayList<IModuleListListener>();
	private INameValidator groupIdValidator;
	
	public void addListener(IModuleListListener	l){
		listeners.add(l);
	}
	
	
	public void removeListener(IModuleListListener	l){
		listeners.remove(l);
	}
	
	
	@Override
	public boolean add(IModuleModel module){
		
		boolean result = super.add(module);
		
		connectModuleListeners(module);
		
		for(IModuleListListener l : listeners){
			l.onModuleAdded(module);
		}
		
		return result;
	}

	
	@Override
	public IModuleModel remove(int index){
		
		IModuleModel module = super.remove(index);
		
		for(IModuleListListener l : listeners){
			l.onModuleRemoved(module);
		}
		
		return module;
	}


	private void fireModuleChangedEvent(IModuleModel module) {
		
		for(IModuleListListener l : listeners){
			l.onModuleChanged(module);
		}
	}

	
	@Override
	public boolean remove(Object page){
		
		int index = indexOf(page);
		
		if(index >= 0){
			remove(index);
			return true;
		}
		
		return false;
	}

	private void connectModuleListeners(final IModuleModel module) {

		module.addStyleListener(new IStyleListener() {
			
			@Override
			public void onStyleChanged() {
				fireModuleChangedEvent(module);
			}
		});

		module.addPropertyListener(new IPropertyListener() {
			
			@Override
			public void onPropertyChanged(IProperty source) {
				fireModuleChangedEvent(module);
			}
		});

		module.addNameValidator(new INameValidator() {
			public boolean canChangeName(String newName) {
				return (
					!newName.isEmpty()
					&& getModuleById(newName) == null
					&& groupIdValidator.canChangeName(newName)
				);
			}
		});
	}

	public void addGroupIdValidator(INameValidator nameValidator) {
		this.groupIdValidator = nameValidator;
	}
	
	public void bringToFrontModule(IModuleModel module) {

		remove(module);
		add(module);
		
		fireModuleChangedEvent(module);
	}

	
	public void sendBackModule(IModuleModel module) {
		remove(module);
		add(0, module);
		
		fireModuleChangedEvent(module);
	}
	
	
	public void moveModuleDown(IModuleModel module) {

		int index = indexOf(module);
		if(index > 0){
			remove(module);
			add(index-1, module);
			
			fireModuleChangedEvent(module);
		}
	}

	
	public void moveModuleUp(IModuleModel module) {

		int index = indexOf(module);
		if(index < size()-1){
			remove(module);
			add(index+1, module);
			
			fireModuleChangedEvent(module);
		}
	}
	
	public void moveModuleToIndex(IModuleModel module, int index) {
		if(index >= 0 && index < size()){
			remove(module);
			add(index, module);
			
			fireModuleChangedEvent(module);
		}
	}

	
	public IModuleModel getModuleById(String name){
		
		IModuleModel foundModule = null;
		
		for(IModuleModel module : this){
			if(module.getId().compareTo(name) == 0){
				foundModule = module;
				break;
			}
		}
		return foundModule;
	}
}
