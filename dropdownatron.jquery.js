/**
 * Dropdownatron will convert a select box to something fancier
 *
 * @version 1.1
 * @author John Noel <john.noel@rckt.co.uk>
 * @author Phil Steer <phil.steer@rckt.co.uk>
 * @todo Keyboard shortcuts, focus styles (accessibility) etc.
 */

!function($) {
    var Dropdownatron = function(elem, opts) {
        this.init('dropdownatron', elem, opts);
    };

    Dropdownatron.prototype = {
        constructor: Dropdownatron,
        init: function(type, elem, opts) {
            this.type = type;
            this.$element = $(elem);
            this.options = this.getOptions(opts);

            if (this.$element[0].tagName != 'SELECT') {
                throw 'Cannot bind to anything other than SELECT elements';
            }

            this._build();

            var that = this;
            this.$element.on('change', function(e) {
                that.select($(this).val());
            });
        },

        getOptions: function(opts) {
            return $.extend({}, $.fn[this.type].defaults,
                    this.$element.data(), opts);
        },

        _build: function() {
            var that = this;
            this.$element.trigger('dropdownatron.pre_build');

            this.$element.hide().wrap($('<div/>').addClass('dropdownatron-container'));

            // because apparently wrap() obliterates any loosey references
            this.$container = this.$element.parent();

            // options
            this.$options = $('<ul/>').addClass('dropdownatron-options').appendTo(this.$container);
            this.$element.find('option').each(function() {
                $('<li/>').text($(this).text()).data('val', $(this).attr('value'))
                    .attr('data-val', $(this).attr('value')).appendTo(that.$options).on({
                        'click': function(e) { that.onSelect(e); }
                    });
            });

            // selector
            $('<span/>').addClass('dropdownatron-select').appendTo(this.$container).on({
                'click': function(e) { that.onToggle(e); }
            });

            // set the initially selected one
            var $toDisplay = this.$options.children().first(),
                sel = this.$element.val();

            if (sel) {
                var $selected = this.$options.children().filter(function() {
                        return $(this).data('val') == sel;
                    });

                $toDisplay = ($selected.length > 0) ? $selected : $toDisplay;
            }

            // selected display
            $('<div/>').addClass('dropdownatron-selected')
                .text($toDisplay.text()).data('val', $toDisplay.data('val'))
                .attr('data-val', $toDisplay.data('val'))
                .appendTo(this.$container).on({
                    'click': function(e) { that.onToggle(e); }
                });

            this.$options.hide();
            this.select($toDisplay.data('val'));
            this.$element.trigger('dropdownatron.built');
        },

        /**
         * Return what is currently selected
         * @return string The currently selected value
         */
        selected: function() {
            return this.$container.find('.dropdownatron-selected').data('val');
        },

        onToggle: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        },

        /**
         * Toggle the opened/closed state of the dropdown
         * @return void
         */
        toggle: function() {
            this._event('toggled');
            if (this.$options.is(':visible')) {
                this.close();
            } else {
                this.open();
            }
        },

        /**
         * If the dropdown is closed, show it
         * @return void
         */
        open: function() {
            if (!this.$options.is(':visible') && !this.$options.is(':animated')) {
                this._event('pre_open');
                var that = this;

                if (this.options.animation == 'animate') {
                    var height = this.$options.show().outerHeight();

                    this.$options.css('height', 0).animate({
                        'height': height
                    }, this.options.speed, this.options.easing, function() {
                        that._event('opened');
                    });

                } else {
                    this.$options.fadeIn( this.options.speed, function() {
                        that._event('opened');
                    });
                }

                this.$container.addClass('shown');

                $('body').on('click.dropdownatron', function(e) {
                    that.close();
                    $('body').off('click.dropdownatron');
                });
            }
        },

        /**
         * If the dropdown is shown, close it
         * @return void
         */
        close: function() {
            if (this.$options.is(':visible') && !this.$options.is(':animated')) {
                this._event('pre_close');
                var that = this;

                if (this.options.animation == 'animate') {
                    var height = this.$options.outerHeight();
                    this.$options.animate({
                        'height': 0
                    }, this.options.speed, this.options.easing, function() {
                        $(this).hide().css('height', height);
                        that._event('closed');
                    });
                } else {
                    this.$options.fadeOut( this.options.speed, function() {
                        that._event('closed');
                    });
                }

                this.$container.removeClass('shown');
            }
        },

        onSelect: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.select($(e.target).data('val'));
        },

        /**
         * Select an option
         * @param string val The value to choose
         * @return void
         */
        select: function(val) {
            this.close();

            if (this.selected() == val) {
                return;
            }

            var $selected = this.$options.children().filter(function() {
                return $(this).data('val') == val;
            });

            if ($selected.length == 0) {
                return;
            }

            $selected.addClass('on').siblings().removeClass('on');
            this.$container.find('.dropdownatron-selected').data('val', val).
                text($selected.text());

            this.$element.val(val); // good ol' jQuery
            this._event('change');
        },

        _event: function(name) {
            this.$element.trigger('dropdownatron.'+name);
        }
    };

    $.fn.dropdownatron = function(option) {
        return this.each(function() {
            var $this = $(this),
               data = $this.data('dropdownatron'),
               options = typeof option == 'object' && option;

            if (!data) {
                $this.data('dropdownatron', data = new Dropdownatron(this, options));
            }

            if (typeof option == 'string') {
                data[option]();
            }
        });
    };

    $.fn.dropdownatron.defaults = {
        speed: 250,
        easing: 'swing',
        animation: 'animate' //or fade
    };
}(window.jQuery);
