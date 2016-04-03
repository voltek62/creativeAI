// if(Meteor.startup){
// 	Avatar.options = {
// 		gravatarDefault: 'initials' // default is 404
// 	};
// }


if(Meteor.isClient){

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
      console.log(this);
      console.log( Telescope.utils.getSiteUrl().slice(0,-1));
      console.log(this.getPageUrl());
      return true;
    }
    return false;
  });
  Template.registerHelper("gotolink", function() {
    if(this === undefined){return false;}
    // console.log(this);
    // console.log(this.url);
    // console.log(this.getLinkTarget());
    // console.log(this.getPageUrl());
    // console.log(this.getShareableLink());
    // return this.getShareableLink();
    return this.url;
  });
  Template.registerHelper("haslink", function() {
    if(this === undefined){return false;}
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

Posts.addField({
  fieldName: 'services_headline',
  fieldSchema: {
    type: String,
    label: "Headline",
    optional: true,
    public: true,
    max:100,
    editableBy: ["member", "admin"],
    autoform: {
      omit: false,
      order: 50
    }
  }
});


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
    label: "Thumbnail URL",
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
      optional: false,
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



// Posts.addField({
//   fieldName: 'services_links',
//   fieldSchema: {
//     type: [String],
//     label: "Links",
//     optional: true,
//     public: true,
//     editableBy: ["member", "admin"],
//     autoform: {
//       omit: false
//     }
//   }
// });