package com.lorepo.icplayer.client;

import java.util.List;

import junit.framework.JUnit4TestAdapter;
import junit.framework.Test;
import junit.framework.TestSuite;

import org.fest.assertions.api.Fail;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.junit.runners.model.TestClass;
import org.powermock.modules.junit4.PowerMockRunnerDelegate;

import com.googlecode.gwt.test.GwtModule;
import com.googlecode.gwt.test.GwtModuleRunnerAdapter;
import com.googlecode.gwt.test.GwtReset;
import com.googlecode.gwt.test.exceptions.GwtTestException;
import com.googlecode.gwt.test.internal.AfterTestCallbackManager;
import com.googlecode.gwt.test.internal.GwtConfig;
import com.googlecode.gwt.test.internal.GwtFactory;
import com.googlecode.gwt.test.internal.GwtTestDataHolder;
import com.googlecode.gwt.test.utils.events.Browser.BrowserErrorHandler;


// Test which should add PowerMockito runner and automatically run with icplayer module. 
@RunWith(com.googlecode.gwt.test.GwtRunner.class)
@PowerMockRunnerDelegate(org.powermock.modules.junit4.PowerMockRunner.class)
@GwtModule("com.lorepo.icplayer.Icplayer")
public abstract class GWTPowerMockitoTest extends GwtModuleRunnerAdapter {

	   private static final BrowserErrorHandler FEST_BROWSER_ERROR_HANDLER = new BrowserErrorHandler() {

	      public void onError(String errorMessage) {
	         Fail.fail(errorMessage);
	      }
	   };

	   /**
	    * Bind the GwtClassLoader to the current thread
	    */
	   @BeforeClass
	   public static final void bindClassLoader() {
	      Thread.currentThread().setContextClassLoader(GwtFactory.get().getClassLoader());
	   }

	   /**
	    * Unbind the static classloader instance from the current thread by binding the system
	    * classloader instead.
	    */
	   @AfterClass
	   public static final void unbindClassLoader() {
	      Thread.currentThread().setContextClassLoader(GwtFactory.get().getClassLoader().getParent());
	   }

	   /**
	    * Setup a new gwt-test-utils test class.
	    */
	   public GWTPowerMockitoTest() {
	      TestClass testClass = new TestClass(this.getClass());
	      GwtConfig.get().setupGwtModule(testClass.getJavaClass());
	      GwtConfig.get().setupInstance(this);
	   }

	   @Before
	   public final void setUpGwtTest() throws Exception {
	      this.setCanDispatchEventsOnDetachedWidgets(true);
	      GwtTestDataHolder.get().setCurrentTestFailed(false);
	   }

	   @After
	   public final void tearDownGwtTest() throws Exception {

	      GwtReset.get().reset();

	      boolean currentTestFailed = GwtTestDataHolder.get().isCurrentTestFailed();

	      List<Throwable> throwables = AfterTestCallbackManager.get().triggerCallbacks();

	      if (!currentTestFailed && throwables.size() > 0) {
	         String error = (throwables.size() == 1)
	                  ? "One exception thrown during gwt-test-utils cleanup phase : "
	                  : throwables.size()
	                           + " exceptions thrown during gwt-test-utils cleanup phase. First one is thrown :";

	         throw new GwtTestException(error, throwables.get(0));
	      }

	   }

	   /**
	    * Create a test instance compatible with JUnit 3 {@link Test} so that the current
	    * <code>GwtTest</code> can be added to a {@link TestSuite}.
	    * 
	    * @return A JUnit Test adapter for this test.
	    */
	   protected Test createJUnit4TestAdapter() {
	      return new JUnit4TestAdapter(this.getClass());
	   }

	   /*
	    * (non-Javadoc)
	    * 
	    * @see com.googlecode.gwt.test.GwtModuleRunnerAdapter#getDefaultBrowserErrorHandler ()
	    */
	   @Override
	   protected BrowserErrorHandler getDefaultBrowserErrorHandler() {
	      return FEST_BROWSER_ERROR_HANDLER;
	   }

	}