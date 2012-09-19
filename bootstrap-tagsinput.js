/* ===========================================================
 * bootstrap-input-tags.js v2.0.4

 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAGS INPUT PUBLIC DEFINITION
  * =============================== */

  var TagsInput = function (element, options) {
    this.init(element, options)
  }

  TagsInput.prototype = {

    constructor: TagsInput

  , init: function (element, options) {
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.tags = []

      this.$element.wrap('<div class="tagsinput"/>')
      this.parent = this.$element.parent().css('width', this.options.width)

      this.$hidden_input = $('<input type="hidden"/>').attr('name', this.$element.attr('name') + '_tags').appendTo(this.parent)
      this.parent.append($('<div class="clearfix"/>'))

      this.listen()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn.tagsinput.defaults, options, this.$element.data())

      options.width = this.$element.outerWidth()
      options.horizontal_padding = options.width - this.$element.width() + 2 // +2 for borders TODO

      switch (options.format) {
        case 'space':
          options.format_pattern = /([\w\-]+)(\s)/g
          options.format_joiner = function (tags) {
            return tags.join(' ') + " "
          }
          break
        case 'comma':
          options.format_pattern = /([\w\s\-]+)(\,)/g
          options.format_joiner = function (tags) {
            return tags.join(',') + ","
          }
          break
        case 'square_brackets':
          options.format_pattern = /\[([\w\s]+)\]/g
          options.format_joiner = function (tags) {
            return tags.length > 0 ? '[' + tags.join('][') + ']' : ''
          }
          break
      }

      return options
    }

  , listen: function () {
      this.$element
        .on('keyup', $.proxy(this.keyup, this))
        .keyup()  // trigger initial keyup
    }

  , keyup: function () {
      if(this.parseTags()){
        this.resizeInput()
      }
    }

  , resizeInput: function () {
      var last_tag = this.parent.children('a:last')
        , _coordinates = $.extend({}, last_tag.position(), {
            width: last_tag.outerWidth(true)
          })
        , new_width = this.options.width
            - _coordinates.width
            - _coordinates.left
            - this.options.horizontal_padding

      if(new_width >= this.options.min_width)
        this.$element.css('width', new_width)
      else
        this.$element.css('width', this.options.width - this.options.horizontal_padding)
    }

  , parseTags: function () {
      var element_val = this.$element.val()
        , match
        , matched_tags = []
        , i
        , new_tags = false

      while(null != (match = this.options.format_pattern.exec(element_val))) {
        matched_tags.push(match[1])
      }

      if(matched_tags.length > 0){
        for(i in matched_tags){
          if(typeof(matched_tags[i]) == 'string'){
            if(this.addTag(matched_tags[i]))
              new_tags = true
          }
        }

        // update element value
        this.$element.val($.trim(element_val.replace(this.options.format_pattern, '')))
      }

      return new_tags
    }

  , formatTags: function () {
      return this.options.format_joiner(this.tags)
    }

  , addTag: function (tag) {
      if(this.tags.indexOf(tag) == -1){
        this.tags.push(tag)
        
        // add tag to hidden input
        this.$hidden_input.val(this.formatTags())

        this.createDOMTag(tag)

        return true
      }
      return false
    }

  , removeTag: function (tag) {
    if(this.tags.indexOf(tag) > -1){
      this.tags.remove(this.tags.indexOf(tag))
    }
  }

  , createDOMTag: function (tag) {
      var $this = this
        , $tag = $('<a class="btn btn-mini">' + tag + ' </a>')
        , $tag_close = $('<i class="icon-remove"></i>').click(function(){$this.removeDOMTag(this)}) // TODO use $.proxy

        $tag.append($tag_close).insertBefore(this.$element)
    }

  , removeDOMTag: function (tag_element) {
      var $tag_element = $(tag_element).parent()

      this.removeTag($.trim($tag_element.text()))
      $tag_element.remove()
    }

  }


 /* TAGS INPUT PLUGIN DEFINITION
  * ========================= */

  $.fn.tagsinput = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tagsinput')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tagsinput', (data = new TagsInput(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tagsinput.Constructor = TagsInput

  $.fn.tagsinput.defaults = {
    format: 'space'
  , editable: true
  , min_width: 30
  }

}(window.jQuery);