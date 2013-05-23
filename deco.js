/* 
* Deco
* Small MVC Event Binding Javascript Framework
*
* Author 	: Oscar Chinellato
* Date 		: 02-13-2012
* Version 	: 0.1
*/


/*
* PageFactory Object: creates specific page Object following the rules 
* specified by the routes file.
* Singleton pattern applied
*/
var PageFactory = ( function() {
	
	var ref = 0,
		_viewName = '';
	
	function new_constructor(viewName) {
		this._view_name = viewName;
		// page initialization
		var page = new Page();
		
		for(var route in Routes) { // iterate through web pages
			for(var i = 0; i < Routes[route].length; i++) { // iterate through possible views
				if(Routes[route][i] == viewName) { //at this point, route is the name of the class to instantiate
					// instantiate the concrete component
					page = new ConcreteComponents.ConcreteComponent(page).buildPage(route);
				}
			}
		}
		
		return page;
	};
	
	function createPage(viewName) {
		if(ref === 0) {
			ref++;
			return new_constructor(viewName);
		} 
	};
	
	return {
		viewName : _viewName,
		createPage : function(viewName) {
			return createPage(viewName);
		}
		
	}
	
})();


/* DECORATOR: Component
* Base for all the decorator Pattern
*/
var Page = Base.extend( {
	bindEvents : function() {}
} );


/* DECORATOR : Abstract Component
*
*/
var AbstractPage = Page.extend({
	constructor : function(page) {
		this._page = page;
		this.bindEvents();
	},
	buildPage : function(route) {},
	bindEvents : function() {
		this._page.bindEvents();
	}
})


/* Namespace container for Concrete Component
*
*/
var ConcreteComponents = {
	
	/* DECORATOR: Concrete Component
	*
	*/
	ConcreteComponent : AbstractPage.extend({
		buildPage : function(route) {
			for(var layer in Layers) { // iterate through the website pages
				if(layer === route) { // got the one I want to build
					for(var i = 0; i < Layers[layer].length; i++) { // iterate through the decorations
						// instantiate decorations
						this._page = new Decorators[Layers[layer][i]](this._page); 
					}
				}
			}
		}
	})

}


/* DECORATOR : Abstract Decorator
*
*/
var PageElement = AbstractPage.extend({});





