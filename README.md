# jquery-flickr
jQuery plugin for generating responsive Flickr photos and galleries from Flickr photosets.

Expansion and modification of Primož Hadalin's [jquery-flickr-photoset](https://github.com/hadalin/jquery-flickr-photoset)

## Usage
### Default Settings
Edit defaults at top of `js/jquery-flickr.js`. In particular Flickr `api_key` is required and `user_id` is recommended.

### Responsive Photo
Generates the HTML5 `srcset` attribute with various sizes of images from Flickr `photo_id`. [Some modern browsers](http://caniuse.com/#search=srcset) will be able use the information to load the most appropriately sized image based on viewscreen size. The user-configurable data attribute `defaultsrcsize` is used to populate the image `src` attribute for browsers that don't understand `srcset`. 

```HTML
<img src="loading.gif" data-flickr-photoid="###########" data-flickr-defaultsrcsize="Small 320"/>
```
```javascript
jQuery(document).ready(function() {
  jQuery("img[data-flickr-photoid]").flickr();
});
```

### Gallery
Generates a thumbnail gallery and linked images from Flickr `photoset_id`. User-configurable data attributes include:
* `img-divwrap-class` to control the class(es) of DIVs that wrap arround the thumbnails
* `img-class` to control the class(es) of the thumbnails
* `limit-items` to control the number of items printed in the gallery

```HTML
<div class="flickr-gallery" data-flickr-photosetid="#################" 
                            data-img-divwrap-class="col-xs-3 col-center" 
                            data-img-class="thumbnail img-responsive"
                            data-limit-items="10"
><img src="loading.gif"/></div>
```
```javascript
jQuery(document).ready(function() {
  jQuery(".flickr-gallery[data-flickr-photosetid]").flickr();
});
```
