/*
* jQuery Flickr Plugin
* https://github.com/matthannigan/jquery-flickr
*
* Copyright 2015, Matt Hannigan
*
* Based upon jQuery Flickr Photoset
* https://github.com/hadalin/jquery-flickr-photoset
* Copyright 2014, Primož Hadalin
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/MIT
*/

;(function ($, window, document, undefined) {

  'use strict';

  var pluginName = "flickr",
    defaults = {
      api_key:     "INSERT YOUR API KEY HERE", /* https://www.flickr.com/services/api/misc.api_keys.html */
      user_id:     "INSERT YOUR USER ID HERE", /* Not your username! Your user_id. Find yours at http://idgettr.com/ */
      error_text:  "Error loading from Flickr",
      src_size:    "Medium", /* user override attribute: data-flickr-defaultsrcsize */
      img_class:   "thumbnail img-responsive", /* user override attribute: data-img-class */
      img_divwrap_class: "col-xs-6 col-center" /* user override attribute: data-img-divwrap-class */
    },
    api_url = 'https://api.flickr.com/services/rest/',
    photos  = [];

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element   = $(element);
    this.settings  = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name     = pluginName;

    this._printError = function() {
      this.element.after($("<div></div>", { "class": "alert alert-danger"})
        .append(this.settings.error_text));
      this.element.detach();
    };

    this._printGallery = function(photos) {
      var _this     = this,
          img_class = _this.settings.img_class,
          img_divwrap_class = _this.settings.img_divwrap_class;
      // override plugin defaults if data attributes exist
      if(typeof _this.element.data("img-class") !== typeof undefined && _this.element.data("img-class")!==""){
        img_class = _this.element.data("img-class");
      }
      if(typeof _this.element.data("img-divwrap-class") !== typeof undefined && _this.element.data("img-divwrap-class")!==""){
        img_divwrap_class = _this.element.data("img-divwrap-class");
      }
      // delete anything that was inside the flickr-gallery div
      _this.element.empty();
      // append the images
      $.each(photos, function(key, photo) {
        var img = $('<img>', { 'class': img_class, 'src': photo.thumbnail });
        _this.element.append($('<div></div>', { 'class': img_divwrap_class })
          .append($('<a></a>', { 'class': '', href: photo.href, 'data-gallery': '' })
            .append(img)));
      });
    };

    this._printResponsiveFlickrPhoto = function(sizes) {
      var _this    = this,
          src      = "",
          srcset   = "",
          src_size = _this.settings.src_size;
      // override plugin default src size if data attribute exists
      if(typeof _this.element.data("flickr-defaultsrcsize") !== typeof undefined && _this.element.data("flickr-defaultsrcsize")!==""){
        src_size = _this.element.data("flickr-defaultsrcsize");
      }
      // build the responsive size list
      $.each(sizes.size, function(key, size) {
        srcset += size.source + " " + size.width + "w, ";
        if (size.label === src_size) {
          // add the url for the default src attrib
          src = size.source;
        };
      });
      // trim the trailing comma and space
      srcset = srcset.substring(0,srcset.length-2);
      // set the src and srcset attributes
      _this.element.attr({
        "src": src,
        "srcset": srcset
      });
    }

    this._buildPhotosFromPhotoset = function(photoset) {
      var _this = this;
      
      photos[photoset.id] = [];
      $.each(photoset.photo, function(key, photo) {
        // Limit number of photos if limit-items attrib set
        if(typeof _this.element.data("limit-items") !== typeof undefined && _this.element.data("limit-items")>0 && key == _this.element.data("limit-items")){
          return false;
        }
        // build the photos array
        photos[photoset.id][key] = {
          thumbnail: 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_q.jpg',
          href: 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg'
        };
      });

      this._printGallery(photos[photoset.id]);            
    }

    this._onFlickrResponse = function(response) {
      if(response.stat === "ok") {
        if(response.hasOwnProperty("sizes")) {
          this._printResponsiveFlickrPhoto(response.sizes);
        }
        if(response.hasOwnProperty("photoset")) {
          this._buildPhotosFromPhotoset(response.photoset);
        }
      }
      else {
        this._printError();
      }
    };

    this._flickrRequest = function(method, data) {
      var url = api_url + "?format=json&jsoncallback=?&method=" + method + "&api_key=" + this.settings.api_key + "&user_id=" + this.settings.user_id;

      $.each(data, function(key, value) {
        url += "&" + key + "=" + value;
      });

      $.ajax({
        dataType: "json",
        url: url,
        context: this,
        success: this._onFlickrResponse
      });
    };

    this._flickrInit = function () {
      // check for photoset id
      if(typeof this.element.data("flickr-photosetid") !== typeof undefined && this.element.data("flickr-photosetid")!==""){
        var method = "flickr.photosets.getPhotos";
        var request_data = {photoset_id: this.element.data("flickr-photosetid")};
      }
      // check for photo id
      if(typeof this.element.data("flickr-photoid") !== typeof undefined && this.element.data("flickr-photoid")!==""){
        var method = "flickr.photos.getSizes";
        var request_data = {photo_id: this.element.data("flickr-photoid")};
      }
      if(typeof method !== typeof undefined && typeof request_data !== typeof undefined) {
        this._flickrRequest(method, request_data);
      }
      else {
        this._printError();
      }
    };

    // Init
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      this._flickrInit();
    }
  };

  // Wrapper
  $.fn[pluginName] = function (options) {
    this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });

    // Chain
    return this;
  };

})(jQuery, window, document);
