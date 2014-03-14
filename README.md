# dropdownatron.jquery

A jQuery plugin to provide stylised select boxes.

## Usage

```javascript
$('select').dropdownatron();
```

Options provided:

* `speed` (250ms default) - the speed of the animation
* `easing` (`swing` by default) - the easing used in the animation, set to something sexy if you have [extra easing functions](http://api.jqueryui.com/easings/) installed
* `animation` either `animate` or `fade` (animate by default) - defines what animation to use
* `keyboardAccess` either `true` or `false` (true by default) - setting to `true` expects you have HTML5bp 'visuallyhidden' and 'focusable' classes in your styles somewhere

## Thanks

[Phil Steer](http://github.com/pdincubus) for his update to allow differing animation methods.
