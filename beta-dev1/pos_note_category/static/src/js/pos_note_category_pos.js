odoo.define('pos_note_category_point_of_sale.popups', function (require) {
"use strict";

// This file contains the Popups.
// Popups must be loaded and named in chrome.js.
// They are instanciated / destroyed with the .gui.show_popup()
// and .gui.close_popup() methods.
    var popups = require('point_of_sale.popups')
    var PosBaseWidget = require('point_of_sale.BaseWidget');
    var gui = require('point_of_sale.gui');
    var _t  = require('web.core')._t;
    var keyboard = require('point_of_sale.keyboard');

    keyboard.OnscreenKeyboardWidget.include({
        deleteAllCharacters: function(){
            var input = this.$target[0];
            if($(input).attr('id') == 'add_description'){
                input.dispatchEvent(this.generateEvent('keypress',{code: 8}));
                input.dispatchEvent(this.generateEvent('keyup',{code: 8}));
            }
            else{
                this._super()
            }
        },
    })

    var PopupWidget = PosBaseWidget.extend({
        template: 'PopupWidget',
        init: function(parent, args) {
            this._super(parent, args);
            this.options = {};
        },
        events: {
            'click .button.cancel':  'click_cancel',
            'click .button.confirm': 'click_confirm',
            'click .selection-item': 'click_item',
            'click .input-button':   'click_numpad',
            'click .mode-button':    'click_numpad',
        },

        // show the popup !
        show: function(options){
            if(this.$el){
                this.$el.removeClass('oe_hidden');
            }

            if (typeof options === 'string') {
                this.options = {title: options};
            } else {
                this.options = options || {};
            }

            this.renderElement();

            // popups block the barcode reader ...
            if (this.pos.barcode_reader) {
                this.pos.barcode_reader.save_callbacks();
                this.pos.barcode_reader.reset_action_callbacks();
            }
        },

        // called before hide, when a popup is closed.
        // extend this if you want a custom action when the
        // popup is closed.
        close: function(){
            if (this.pos.barcode_reader) {
                this.pos.barcode_reader.restore_callbacks();
            }
        },

        // hides the popup. keep in mind that this is called in
        // the initialization pass of the pos instantiation,
        // so you don't want to do anything fancy in here
        hide: function(){
            if (this.$el) {
                this.$el.addClass('oe_hidden');
            }
        },

        // what happens when we click cancel
        // ( it should close the popup and do nothing )
        click_cancel: function(){
            this.gui.close_popup();
            if (this.options.cancel) {
                this.options.cancel.call(this);
            }
        },

        // what happens when we confirm the action
        click_confirm: function(){
            this.gui.close_popup();
            if (this.options.confirm) {
                this.options.confirm.call(this);
            }
        },

        // Since Widget does not support extending the events declaration
        // we declared them all in the top class.
        click_item: function(){},
        click_numad: function(){},
    });
    gui.define_popup({name:'alert', widget: PopupWidget});


    var TextInputPopupWidget = PopupWidget.extend({
        template: 'TextInputPopupWidget',

        show: function(options){
            options = options || {};
            this._super(options);

            this.renderElement();
            this.chrome.widget.keyboard.connect(this.$('input,textarea'));
            this.$('input,textarea').focus();
        },
        click_confirm: function(){
            var value = this.$('input,textarea').val();
            this.gui.close_popup();
            if( this.options.confirm ){
                this.options.confirm.call(this,value);
            }
        },
    });
    gui.define_popup({name:'textinput', widget: TextInputPopupWidget});


    var TextAreaPopupWidget = TextInputPopupWidget.extend({
        template: 'TextAreaPopupWidget',
        events: _.extend({}, TextInputPopupWidget.prototype.events, {
            'click .pos_note_category_button': 'change_active'
        }),
        change_active:function (ev) {
            if($(ev.currentTarget).hasClass('active')){
                $(ev.currentTarget).removeClass('active').removeClass('btn-fill');
            }else{
                $(ev.currentTarget).addClass('active').addClass('btn-fill');
            }
        }

    });
    gui.define_popup({name:'textarea', widget: TextAreaPopupWidget});


});
