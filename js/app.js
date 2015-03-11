/*!
* Author: Tinatuh Kolleh
* Display offers to facebook users
*/
var Offer = Backbone.Model.extend({
	defaults: function (){
		return{	
			title: "no offer",
			provider: "n/a",
			selected: false,
			available: false
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

var Offers = new OfferList;

var OfferView = Backbone.View.extend({
	tagName: 'li',
	events:{
		"click .selectOffer" : "toggleSelected"
	},
	initialize: function (){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},
	render: function (){
		var source = $('#offerTemplate').html();
		var templte = Handlebars.compile(source);
		var html = template(this.model.toJSON());

		this.$el.html(html);
		return this;
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
		this.listenTo(Offers, 'add', this.addOne);
		this.listenTo(Offers, 'reset', this.addAll);
		this.listenTo(Offers, 'all', this.render);
		Offers.fetch();
	},
	addOne: function (offer){
		var view = new OfferView({
			model: offer
		});
		this.$('#offer-list').append(view.render().el);
	},
	addAll: function (){
		Offers.each(this.addOne, this);
	},
	render: function (){
	}
});

