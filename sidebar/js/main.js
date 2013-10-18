App = {
	init: function() {
		console.log("page loaded");
		var appendcount = 0;
		var prependcount = 0;

		var leftsidebar = new App.Sidebar({type: 'left'});
		var rightsidebar = new App.Sidebar({type: 'right'});
		$("#fuckingcontainer").empty();
		$("#fuckingcontainer").append(leftsidebar.el); //add it to something
		$("#fuckingcontainer").append(rightsidebar.el); //add it to something

		var testview1 = new App.TestView({model: new App.TestModel({title: 'Left Sidebar'})});
		var testview2 = new App.TestView({model: new App.TestModel({title: 'Right Sidebar'})});

		leftsidebar.setView(testview1.render());
		rightsidebar.setView(testview2.render());


		$("#btnShow").click(function (ev){
			console.log("btnShow append");
			leftsidebar.show();
		});

		$("#btnHide").click(function (ev){
			console.log("btnHide append");
			leftsidebar.close();
		});

		$("#btnShowRight").click(function (ev){
			console.log("btnShowRight append");
			rightsidebar.show();
		});

		$("#btnHideRight").click(function (ev){
			console.log("btnShowRight append");
			rightsidebar.close();
		});
	}
};

App.TestModel = Backbone.Model.extend({});
App.TestView = Backbone.View.extend({
	className: "testview",

	initialize: function(){
		this.render();
	},

	render: function(){
		this.$el.text(this.model.get('title'));
		this.$el.css('background-color', "#"+((1<<24)*Math.random()|0).toString(16));
		return this;
	}
});

App.Sidebar = Backbone.View.extend({
	className: "sidebar",

	currentView: null,

	events: {
		'release': 'release',
		'dragleft': 'drag',
		'dragright': 'drag',
		'swipeleft': 'swipeleft',
		'swiperight': 'swiperight'
	},

	initialize: function(options){
		if(options.type == 'right')
			this.type = 'right';
		else
			this.type = 'left';

		this.render();

		console.log("adding hammer");
		this.$el.hammer({ drag_lock_to_axis: true });
	},

	render: function(options){
		if(this.type == 'right')
			this.$el.addClass('right');
		return this;
	},

	show: function(){
		if(this.type == 'right')
			this.setContainerOffset(-100, true);
		else
			this.setContainerOffset(0, true);
	},

	close: function(){
		if(this.type == 'right')
			this.setContainerOffset(0, true);
		else
			this.setContainerOffset(-100, true);
	},

	drag: function(ev){
        ev.gesture.preventDefault(); // disable browser scrolling

		var drag_offset = (ev.gesture.deltaX*100)/this.$el.width();

		if(this.type == 'left'){
			// limit to 0%
			drag_offset = Math.min(0, drag_offset);
		}

		if(this.type == 'right'){
			drag_offset = -100 + drag_offset;

			// limit to -100%
			drag_offset = Math.max(-100, drag_offset);
		}

		this.setContainerOffset(drag_offset, false);
	},


	swipeleft: function(ev){
		ev.gesture.preventDefault(); // disable browser scrolling
		if(this.type == 'left')
			this.close();
		ev.gesture.stopDetect();
	},


	swiperight: function(ev){
		ev.gesture.preventDefault(); // disable browser scrolling
		if(this.type == 'right')
			this.close();
		ev.gesture.stopDetect();
	},

	release: function(ev){
		ev.gesture.preventDefault(); // disable browser scrolling

		// more then 50% moved, close
		if(Math.abs(ev.gesture.deltaX) > this.$el.width()/2) {
			if(ev.gesture.direction == 'right' && this.type == 'right') {
				this.close();
			}

			if(ev.gesture.direction == 'left' && this.type == 'left') {
				this.close();
			}
		}
		else {
			this.show();
		}
	},

	setContainerOffset: function(percent, animate) {
		this.$el.removeClass("animate");

		if(animate) {
			this.$el.addClass("animate");
		}

		if(Modernizr.csstransforms3d) {
			this.$el.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
		}
		else {
			this.$el.css("transform", "translate("+ percent +"%,0)");
		}
	},

	setView: function(view) {
		this.currentView = view;
		this.$el.empty();
		this.$el.append(view.el);
	}
});

