package com.lorepo.icplayer.client.model.page.group;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import com.lorepo.icplayer.client.module.StyledGroup;
import com.lorepo.icplayer.client.module.api.IModuleModel;

public abstract class ModulesPropertyProvider extends StyledGroup implements List<IModuleModel>{
	public ModulesPropertyProvider(String name) {
		super(name);
	}

	protected List<IModuleModel> moduleModels = new ArrayList<IModuleModel>(); 
	
	@Override
	public boolean add(IModuleModel model) {
		return moduleModels.add(model); 
	}

	@Override
	public void add(int index, IModuleModel model) {
		moduleModels.add(index,model); 
	}

	@Override
	public boolean addAll(Collection<? extends IModuleModel> models) {
		return moduleModels.addAll(models); 
	}

	@Override
	public boolean addAll(int index, Collection<? extends IModuleModel> models) {
		return moduleModels.addAll(index, models); 
	}

	@Override
	public void clear() {
		moduleModels.clear(); 
	}

	@Override
	public boolean contains(Object obj) {
		return moduleModels.contains(obj); 
	}

	@Override
	public boolean containsAll(Collection<?> objects) {
		return moduleModels.containsAll(objects); 
	}

	@Override
	public IModuleModel get(int index) {
		return moduleModels.get(index);
	}

	@Override
	public int indexOf(Object obj) {
		return moduleModels.indexOf(obj); 
	}

	@Override
	public boolean isEmpty() {
		return moduleModels.isEmpty(); 
	}

	@Override
	public Iterator<IModuleModel> iterator() {
		return moduleModels.iterator(); 
	}

	@Override
	public int lastIndexOf(Object obj) {
		return moduleModels.lastIndexOf(obj); 
	}

	@Override
	public ListIterator<IModuleModel> listIterator() {
		return moduleModels.listIterator(); 
	}

	@Override
	public ListIterator<IModuleModel> listIterator(int index) {
		return moduleModels.listIterator(index); 
	}

	@Override
	public boolean remove(Object obj) {
		return moduleModels.remove(obj); 
	}

	@Override
	public IModuleModel remove(int index) {
		return moduleModels.remove(index); 
	}

	@Override
	public boolean removeAll(Collection<?> models) {
		return moduleModels.removeAll(models);
	}

	@Override
	public boolean retainAll(Collection<?> models) {
		return moduleModels.retainAll(models); 
	}

	@Override
	public IModuleModel set(int index, IModuleModel model) {
		return moduleModels.set(index, model); 
	}

	@Override
	public int size() {
		return moduleModels.size(); 
	}

	@Override
	public List<IModuleModel> subList(int index1, int index2) {
		return moduleModels.subList(index1, index2); 
	}

	@Override
	public Object[] toArray() {
		return moduleModels.toArray(); 
	}

	@Override
	public <T> T[] toArray(T[] arg0) {
		return moduleModels.toArray(arg0); 
	}

}
