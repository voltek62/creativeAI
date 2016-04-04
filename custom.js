if(Meteor.isClient){

  /// VOTE ///
  Template.custom_post_vote2.helpers({
    enableDownvotes: function () {
      return Settings.get("enableDownvotes", false);
    },
    actionsClass: function () {
      var user = Meteor.user();
      var actionsClass = "";
      if(!user) return false;
      if (user.hasUpvoted(this)) {
        actionsClass += " voted upvoted";
      }
      if (user.hasDownvoted(this)) {
        actionsClass += " voted downvoted";
      }
      if (Settings.get("enableDownvotes", false)) {
        actionsClass += " downvotes-enabled";
      }
      return actionsClass;
    }
  });

  Template.custom_post_vote2.events({
    'click .upvote-link': function(e){
      var post = this;
      var user = Meteor.user();
      e.preventDefault();
      if(!user){
        FlowRouter.go('atSignIn');
        Messages.flash(i18n.t("please_log_in_first"), "info");
      }
      if (user.hasUpvoted(post)) {
        Meteor.call('cancelUpvotePost', post._id, function(){
          Events.track("post upvote cancelled", {'_id': post._id});
        });        
      } else {
        Meteor.call('upvotePost', post._id, function(){
          Events.track("post upvoted", {'_id': post._id});
        });  
      }
    },
    'click .downvote-link': function(e){
      var post = this;
      var user = Meteor.user();
      e.preventDefault();
      if(!user){
        FlowRouter.go('atSignIn');
        Messages.flash(i18n.t("please_log_in_first"), "info");
      }
      if (user.hasDownvoted(post)) {
        Meteor.call('cancelDownvotePost', post._id, function(){
          Events.track("post downvote cancelled", {'_id': post._id});
        });        
      } else {
        Meteor.call('downvotePost', post._id, function(){
          Events.track("post downvoted", {'_id': post._id});
        });  
      }
    }  
  });




  /// HELPERS ///
  function convertMedia(html){
    var pattern1 = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(.+)/g;
    var pattern2 = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
    var pattern3 = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:jpg|jpeg|gif|png))/gi;

    if(pattern1.test(html)){
       var replacement = '<div class="video-container"><iframe width="420" height="345" src="//player.vimeo.com/video/$1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
       var html = html.replace(pattern1, replacement);
    }

    if(pattern2.test(html)){
      var replacement = '<div class="video-container"><iframe width="420" height="345" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>';
      var html = html.replace(pattern2, replacement);
    } 

    if(pattern3.test(html)){
      //var replacement = '<a href="$1" target="_blank"><img class="sml" src="$1" /></a>';
      var replacement = '<img class="sml" src="$1" />';
      var html = html.replace(pattern3, replacement);
    }     
    return html;
  }

  Template.registerHelper("makeVideo", function (object) {
    var convert = convertMedia(this.body);
    var ret = Telescope.utils.sanitize(marked(convert));
    return ret;
  });


	Template.registerHelper("isEmpty", function (object) {
		if(object === undefined){return false;}
    return true;
	});
  Template.registerHelper("encodedTitle", function (object) {
    if(this === undefined){return false;}
    return encodeURIComponent(this.title);
  });
  Template.registerHelper("getSiteUrl", function (object) {
    return Telescope.utils.getSiteUrl().slice(0,-1)
  });

  Template.registerHelper("isMainPage", function () {
    if (FlowRouter.getRouteName() === "postPage") {
      return true;
    }
    return false;
  });
  Template.registerHelper("gotolink", function() {
    if(this === undefined){return false;}
    if(this.url === undefined){return false;}
    return this.url;
  });
  Template.registerHelper("haslink", function() {
    if(this === undefined){return false;}
    if(this.url === undefined){return false;}
    if(this.url.length > 0){
      return true;
    }
    return false
  });


	Template.post_title.helpers({
	  custom_title: function () {
	    return this.title;
	  },
	  custom_link: function (){
	    return '/posts/' + this._id + '/' + this.slug;
	  }
	});
}


/// FIELDS ///
Posts.addField({
  fieldName: 'thumbnailUrl',
  fieldSchema: {
    type: String,
    label: "Thumbnail URL",
    optional: true,
    public: true,
    editableBy: ["member", "admin"],
    autoform: {
      omit: true
    }
  }
});
Posts.addField({
  fieldName: 'categories',
  fieldSchema: {
    type: String,
    label: "category",
    optional: true,
    public: true,
    editableBy: ["member", "admin"],
    autoform: {
      omit: true
    }
  }
});



Posts.addField({
  fieldName: 'title',
  fieldSchema: {
    type: String,
    label: "Title",
    optional: false,
    public: true,
    max:100,
    editableBy: ["member", "admin"],
    autoform: {
      omit: false,
      order: 40
    }
  }
});

// Posts.addField({
//   fieldName: 'services_headline',
//   fieldSchema: {
//     type: String,
//     label: "Headline",
//     optional: true,
//     public: true,
//     max:100,
//     editableBy: ["member", "admin"],
//     autoform: {
//       omit: false,
//       order: 50
//     }
//   }
// });


Posts.addField({
  fieldName: 'url',
  fieldSchema: {
    type: String,
    label: "URL",
    optional: true,
    public: true,
    editableBy: ["member", "admin"],
    autoform: {
      omit: false,
      order: 100
    }
  }
});

Posts.addField({
  fieldName: 'services_thumbnail',
  fieldSchema: {
    type: String,
    label: "Image URL",
    optional: true,
    public: true,
    editableBy: ["member", "admin"],
    autoform: {
      order: 150,
      omit: false
    }
  }
});

Posts.addField({
  fieldName: 'body',
  fieldSchema: {
    type: String,
    label: "",
    defaultValue: "",
    optional: true,
    public: true,
    autoform: {
      omit: false,
      order: 200,
      type:'textarea'
    }
  }
});


Posts.addField(
  {
    fieldName: 'categories',
    fieldSchema: {
      type: [String],
      optional: true,
      editableBy: ["member", "admin"],
      autoform: {
        noselect: true,
        order: 250,
        label: "Categories",
        type: "bootstrap-category",
        options: function () {
          var categories = Categories.find().map(function (category) {
            return {
              value: category._id,
              label: category.name
            };
          });
          return categories;
        }
      }
    }
  }
);

