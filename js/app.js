/*!
* Author: Tinatuh Kolleh
* Display offers to facebook users
*/
$(function (){
var Offer = Backbone.Model.extend({
	defaults: function (){
		return{	
			title: "no offer",
			provider: "n/a",
			selected: false,
			available: false,
			logo: ''
		};
	},
	toggle: function (){
		this.save({
			selected: !this.get('selected')
		});
	}
});

var OfferList = Backbone.Collection.extend({
	model: Offer,
	localStorage: new Backbone.LocalStorage('offer-app'),
	selected: function (){
		return this.where({
			selected: true
		});
	}
});

var offers = new OfferList;

var OfferView = Backbone.View.extend({
	tagName: 'li',
	events:{
		"click .selectOffer" : "toggleSelected",
		"click a.destroy" : "clear"
	},
	initialize: function (){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	render: function (){
		var source = $('#offerTemplate').html();
		var template = Handlebars.compile(source);
		var html = template(this.model.toJSON());

		this.$el.html(html);
		debugger;
		return this;
	},
    clear: function() {
      this.model.destroy();
    },
	toggleSelected: function (){
		this.model.toggle();
	}
});

var AppView = Backbone.View.extend({
	el: $('#offerApp'),
	events:{
		"click #selectedOffers": "toggleAllSelected"
	},
	initialize: function (){
		this.listenTo(offers, 'add', this.addOne);
		this.listenTo(offers, 'reset', this.addAll);
		this.listenTo(offers, 'all', this.render);
		offers.fetch();
	},
	addOne: function (offer){
		var view = new OfferView({
			model: offer
		});
		debugger;
		this.$('#offer-list').append(view.render().el);
	},
	addAll: function (){
		offers.each(this.addOne, this);
	},
	render: function (){
	}
});

var App = new AppView;

var offerA = new Offer;
	offerA.set({	
		title: "Free Two Liter Bottle",
		provider: "Coca Cola",
		selected: false,
		available: true,
		logo: '/image/coke.png'
	});
var offerB = new Offer;
	offerB.set({	
		title: "50% Off Air Jordan",
		provider: "Nike",
		selected: false,
		available: true
	});
offers.add(offerA);
offers.add(offerB);
});