package com.lorepo.icplayer.client.module;

import com.google.gwt.user.client.ui.HTML;
import com.lorepo.icplayer.client.module.addon.AddonModel;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;
import com.lorepo.icplayer.client.module.addon.AddonView;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IModuleView;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.button.ButtonModule;
import com.lorepo.icplayer.client.module.button.ButtonPresenter;
import com.lorepo.icplayer.client.module.button.ButtonView;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonModule;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonPresenter;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonView;
import com.lorepo.icplayer.client.module.checkcounter.CheckCounterModule;
import com.lorepo.icplayer.client.module.checkcounter.CheckCounterPresenter;
import com.lorepo.icplayer.client.module.checkcounter.CheckCounterView;
import com.lorepo.icplayer.client.module.choice.ChoiceModel;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter;
import com.lorepo.icplayer.client.module.choice.ChoiceView;
import com.lorepo.icplayer.client.module.errorcounter.ErrorCounterModule;
import com.lorepo.icplayer.client.module.errorcounter.ErrorCounterPresenter;
import com.lorepo.icplayer.client.module.errorcounter.ErrorCounterView;
import com.lorepo.icplayer.client.module.image.ImageModule;
import com.lorepo.icplayer.client.module.image.ImagePresenter;
import com.lorepo.icplayer.client.module.image.ImageView;
import com.lorepo.icplayer.client.module.imagegap.ImageGapModule;
import com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter;
import com.lorepo.icplayer.client.module.imagegap.ImageGapView;
import com.lorepo.icplayer.client.module.imagesource.ImageSourceModule;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter;
import com.lorepo.icplayer.client.module.imagesource.ImageSourceView;
import com.lorepo.icplayer.client.module.ordering.OrderingModule;
import com.lorepo.icplayer.client.module.ordering.OrderingPresenter;
import com.lorepo.icplayer.client.module.ordering.OrderingView;
import com.lorepo.icplayer.client.module.pageprogress.PageProgressModule;
import com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter;
import com.lorepo.icplayer.client.module.pageprogress.PageProgressView;
import com.lorepo.icplayer.client.module.report.ReportModule;
import com.lorepo.icplayer.client.module.report.ReportPresenter;
import com.lorepo.icplayer.client.module.report.ReportView;
import com.lorepo.icplayer.client.module.shape.ShapeModule;
import com.lorepo.icplayer.client.module.shape.ShapePresenter;
import com.lorepo.icplayer.client.module.shape.ShapeView;
import com.lorepo.icplayer.client.module.sourcelist.SourceListModule;
import com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter;
import com.lorepo.icplayer.client.module.sourcelist.SourceListView;
import com.lorepo.icplayer.client.module.text.TextModel;
import com.lorepo.icplayer.client.module.text.TextPresenter;
import com.lorepo.icplayer.client.module.text.TextView;

public class ModuleFactory implements IModuleFactory{

	class DummyView extends HTML implements IModuleView{
	
		public DummyView(String text) {
			super(text);
		}
	}
	
	
	private IPlayerServices services;
	
	
	public ModuleFactory(IPlayerServices services){
		this.services = services;
	}
	
	
	@Override
	public IModuleModel createModel(String xmlNodeName){
		
		IModuleModel module = null;
		
		if(xmlNodeName.compareTo("buttonModule") == 0){
			module = new ButtonModule();
		}
		else if(xmlNodeName.compareTo("checkModule") == 0){
			module = new CheckButtonModule();
		}
		else if(xmlNodeName.compareTo("choiceModule") == 0){
			module = new ChoiceModel();
		}
		else if(xmlNodeName.compareTo("imageModule") == 0){
			module = new ImageModule();
		}
		else if(xmlNodeName.compareTo("imageSourceModule") == 0){
			module = new ImageSourceModule();
		}
		else if(xmlNodeName.compareTo("imageGapModule") == 0){
			module = new ImageGapModule();
		}
		else if(xmlNodeName.compareTo("checkCounterModule") == 0){
			module = new CheckCounterModule();
		}
		else if(xmlNodeName.compareTo("errorCounterModule") == 0){
			module = new ErrorCounterModule();
		}
		else if(xmlNodeName.compareTo("orderingModule") == 0){
			module = new OrderingModule();
		}
		else if(xmlNodeName.compareTo("pageProgressModule") == 0){
			module = new PageProgressModule();
		}
		else if(xmlNodeName.compareTo("reportModule") == 0){
			module = new ReportModule();
		}
		else if(xmlNodeName.compareTo("shapeModule") == 0){
			module = new ShapeModule();
		}
		else if(xmlNodeName.compareTo("sourceListModule") == 0){
			module = new SourceListModule();
		}
		else if(xmlNodeName.compareTo("textModule") == 0){
			module = new TextModel();
		}
		else if(xmlNodeName.compareTo("addonModule") == 0){
			module = new AddonModel();
		}
		
		return module;
	}
	
	
	@Override
	public IModuleView createView(IModuleModel module){
		boolean isPreview = (services == null);
		
		if(module instanceof AddonModel){
			return new AddonView((AddonModel) module);
		}
		else if(module instanceof ButtonModule){
			return new ButtonView((ButtonModule)module, services);
		}
		else if(module instanceof CheckButtonModule){
			return new CheckButtonView((CheckButtonModule)module, services);
		}
		else if(module instanceof CheckCounterModule){
			return new CheckCounterView((CheckCounterModule) module, isPreview);
		}
		else if(module instanceof ChoiceModel){
			return new ChoiceView((ChoiceModel) module, isPreview);
		}
		else if(module instanceof ErrorCounterModule){
			return new ErrorCounterView((ErrorCounterModule) module, isPreview);
		}
		else if(module instanceof ImageModule){
			return new ImageView((ImageModule) module, isPreview);
		}
		else if(module instanceof ImageSourceModule){
			return new ImageSourceView((ImageSourceModule) module, isPreview);
		}
		else if(module instanceof ImageGapModule){
			return new ImageGapView((ImageGapModule) module, isPreview);
		}
		else if(module instanceof OrderingModule){
			return new OrderingView((OrderingModule) module, services);
		}
		else if(module instanceof PageProgressModule){
			return new PageProgressView((PageProgressModule) module, isPreview);
		}
		else if(module instanceof ReportModule){
			return new ReportView((ReportModule) module, isPreview);
		}
		else if(module instanceof ShapeModule){
			return new ShapeView((ShapeModule) module, isPreview);
		}
		else if(module instanceof SourceListModule){
			return new SourceListView((SourceListModule) module, isPreview);
		}
		else if(module instanceof TextModel){
			return new TextView((TextModel) module, isPreview);
		}
		
		return new DummyView("Can't find view for module: " + module.toString());
	}
	
	
	@Override
	public IPresenter createPresenter(IModuleModel module){
		if(module instanceof AddonModel){
			return new AddonPresenter((AddonModel) module, services);
		}
		else if (module instanceof ButtonModule) {
			return new ButtonPresenter((ButtonModule) module, services);
		}
		else if (module instanceof CheckButtonModule) {
			return new CheckButtonPresenter((CheckButtonModule) module, services);
		}
		else if(module instanceof CheckCounterModule){
			return new CheckCounterPresenter((CheckCounterModule) module, services);
		}
		else if(module instanceof ErrorCounterModule){
			return new ErrorCounterPresenter((ErrorCounterModule) module, services);
		}
		else if(module instanceof ImageModule){
			return new ImagePresenter((ImageModule) module, services);
		}
		else if(module instanceof ImageGapModule){
			return new ImageGapPresenter((ImageGapModule) module, services);
		}
		else if(module instanceof ImageSourceModule){
			return new ImageSourcePresenter((ImageSourceModule) module, services);
		}
		else if(module instanceof PageProgressModule){
			return new PageProgressPresenter((PageProgressModule) module, services);
		}
		else if(module instanceof ChoiceModel){
			return new ChoicePresenter((ChoiceModel) module, services);
		}
		else if(module instanceof OrderingModule){
			return new OrderingPresenter((OrderingModule) module, services);
		}
		else if(module instanceof ReportModule){
			return new ReportPresenter((ReportModule) module, services);
		}
		else if(module instanceof ShapeModule){
			return new ShapePresenter((ShapeModule) module, services);
		}
		else if(module instanceof SourceListModule){
			return new SourceListPresenter((SourceListModule) module, services);
		}
		else if(module instanceof TextModel){
			return new TextPresenter((TextModel) module, services);
		}
		
		return null;
	}
}
