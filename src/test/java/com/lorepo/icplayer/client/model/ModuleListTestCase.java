package com.lorepo.icplayer.client.model;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.shape.ShapeModule;


public class ModuleListTestCase {

	@Test
	public void sendBack() {
		
		ModuleList modules = new ModuleList();
		ShapeModule module = new ShapeModule();
		
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());
		modules.add(module);
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());

		modules.sendBackModule(module);
		IModuleModel foundModule = modules.get(0);
		
		assertEquals(foundModule, module);
	}
	

	@Test
	public void sendFront() {
		
		ModuleList modules = new ModuleList();
		ShapeModule module = new ShapeModule();
		
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());
		modules.add(module);
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());

		modules.bringToFrontModule(module);
		IModuleModel foundModule = modules.get(modules.size()-1);
		
		assertEquals(foundModule, module);
	}
	

	@Test
	public void moveUp() {
		
		ModuleList modules = new ModuleList();
		ShapeModule module = new ShapeModule();
		
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());
		modules.add(module);
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());

		modules.moveModuleUp(module);
		IModuleModel foundModule = modules.get(3);
		
		assertEquals(foundModule, module);
	}
	

	@Test
	public void moveDown() {
		
		ModuleList modules = new ModuleList();
		ShapeModule module = new ShapeModule();
		
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());
		modules.add(module);
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());

		modules.moveModuleDown(module);
		IModuleModel foundModule = modules.get(1);
		
		assertEquals(foundModule, module);
	}
	
	@Test
	public void moveToIndex() {
		
		ModuleList modules = new ModuleList();
		ShapeModule module = new ShapeModule();
		
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());
		modules.add(new ShapeModule());
		modules.add(module);
		modules.add(new ShapeModule());

		modules.moveModuleToIndex(module, 1);
		IModuleModel foundModule = modules.get(1);
		
		assertEquals(foundModule, module);
	}
	
}
