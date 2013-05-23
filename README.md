Deco
====

Deco is a server-side-framework-agnostic way to implement JS behavior in websites. It works with associations between MVC server-side defined views and javascript defined behaviour via routes. Its name comes from the design patterns it implements, the Decorator pattern.

##Introduction 

Basic Assumption: we want to define a way to insert javascript behavior in a single page without writing the JS code into it between HTML lines. Every script tag has a payoff. We want less script tags as possibile. You want it, trust me.


##The Old Way

Many times during website development happens that some JS event has to trigger only in a specific page, while other behaviors are common to many pages. 

Let's think to a simple contact page, maybe the most common example. We need some form of client-side validation. But there is also some behavior to add to the header on the page, common to the entire website: clicking on a lens makes the search form appear. Let's write some code (jQuery intended for brevity):

	$(document).ready(function() {
		
		var $form = $('form');
		

		if($form.length > 0) 
			$form.submit(function(ev) {
				ev.preventDefault();
				$(this).validate({})
			});
		}

		$('#lens').click(function(ev) {
			ev.preventDefault();
			// do something, make the search form appear
		});

	});

We usually include this script on the bottom of a page and all website works. The contact form is validated through JS (maybe a jquery plugin?), but it is not correct that the code is loaded and parsed in other pages, like in homepage for example. Even if the line ’’’’if($form.lenght > 0) ’’’’ prevents from the code inside to be parsed, this is just bad practice in my opinion. It is also a pain for maintainance when the script become bigger and bigger and the behavior is shared between pages.

##A better way

Now, let's figure a bit of Javascript behaviour as a layer and imagine you can put in on top of HTML code. Every layer you put on must be indipendent from other layers. On a page like the one before, you could apply 2 layers, one for the submit event, one for the click event. On the homepage you can put only the "click" layer. This seem right under many points of view: independency between layers, i.e. small bits of indipendent code, makes testability much more easy. It also promote code decoupling.
Now you just need an easy way to handle this concept


##The Deco way

Deco is a small script to associate javascript behaviour and HTML pages in a simple and intuitive way. It is based on routes, a concept that should be familiar to many PHP/Ruby framework users. This script is born with CodeIgniter, a PHP framework.

###Dependencies

To make Deco work you need to include jQuery (uses the ’’’’exted()’’’’ function, dependency to be removed).

###Installation

First step, include Deco

	<script src="path/to/deco.js"></script>

###Layers

Let's create some behaviour in another file which we'll call ’’’’script.js’’’’, following the previous example. We must create a namespace called ’’’’Decorators’’’’ to include code, following the module pattern.

	var Decorators = {
		
	}

Once created, we should extend the ’’’’PageElement’’’’ object to create a new Layer

	var Decorators = {

		// let's create a new layer
		Header : PageElement.extend({
			
			// mandatory function to include behavior
			bindEvents : function() {

				// put here code you want to include 
				$('#lens').click(function(ev) {
					ev.preventDefault();
					// do something, make the search form appear
				});

			}

		}),

		Contacts : PageElement.extend({
			
			// code to validate contact form

		})

	}

Now we have a layer called ’’’’Header’’’’ that can be applied to every page to handle a click on an element called ’’’’#lens’’’’. 



###Routes

Let's create a third file to handle the associations. Let's call it ’’’’routes.js’’’’. In this file we'll create a way to group layers and associate those groups to the different pages. We must build 2 objects, called Routes and Layers, which will contain respectively the associations and the groups of layers.

	var Routes = {
		// general_page_name : value from the server-side framework
		"HomePage" 		: ["home_view"],
		"Contacts"		: ["contacts_view"],
		"Products"		: ["categories_view", "subcategories_view"]
	}
	var Layers = {
		// group_name   : [list of decorators]
		"HomePage"		: ["Header"],
		"Contacts"		: ["Header", "Contacts"]
	}

Let's analyze the code above: in the Route map, many values that comes from the server-side framework may be associated to a layer group name. The Layers map define which decorators go in every group. Using an MVC server-side framework, it comes easy passing the name of the view. So the code above can be read as following: if the script is initialized with a "home_view" param, load the group named "HomePage", which has the decoraton named "Header".

###Initialization

When I told you that you don't have to write plain JS into HTML I was Lying. We sadly need a way to establish a communication between the server-side framework and Javascript. Don't worry, just 3 lines to add at the very bottom of the page (after loading all the necessary scripts)

	<script type="text/javascript">
		$(document).ready(function() {
			var page = PageFactory.createPage('<?php echo $view; ?>');
		});
	</script>

In this case I used PHP to output the name of the view which will be collected thanks to the routes file we created.

###License

This software in under GPL licence.


