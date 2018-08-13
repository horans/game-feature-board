# Game: Feature Board

"Game: Feature Board" (or "GFB"),
will display icons of feature on an "n x n" board with disguised icons.
It will calculate how much time take user to click on all the right icons.

* Level select.
* Result list.
* Game tips.
* notify parent.

## Basic

### Install

Upload everything to your server, eg.:

```text
//sample.com/gfb/
```

### Usage

Embed `iframe.html` into your page, eg.:

```html
<iframe src="//sample.com/gfb/iframe.html" frameborder="0" width="835" height="650"></iframe>
```

## Advanced

### Setup

GFB uses config file to setup everything.
Look into the default `config.json` in `asset` folder for details.
You can also pass your own config file to `iframe`, eg.:

```html
<iframe src="//sample.com/gfb/iframe.html?config=my-features.json"></iframe>
```

### Icons

Icons have to be `svg` with flatten `path` to change color.

### APIs

GFB uses dummy `json`s for preview only.
Setup your own API to add/get results, or get GEOIP country code.

### Notices

GFB will notify parent window by [`window.postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage),
when each round of game is finished,
and when user submit their score.

```javascript
// with jquery
$(window).on('message', function (e) {
  console.log(e.originalEvent.data)
})
```

```javascript
// with native
window.addEventListener('message', function(e) {
  console.log(e.data)
}, false)
```

## Extra

### Vendor

* [axios](https://github.com/axios/axios)
* [bootstrap reboot](https://github.com/twbs/bootstrap)
* [ES6-Promise](https://github.com/stefanpenner/es6-promise)
* [flag-icon-css](https://github.com/lipis/flag-icon-css)
* [Lodash](https://github.com/lodash/lodash)
* [Vue](https://github.com/vuejs/vue)
* [Web Font Loader](https://github.com/typekit/webfontloader)

### Linter

* HTML: [HTMLHint](https://github.com/yaniswang/HTMLHint)
* CSS: [CSSLint](https://github.com/CSSLint/csslint)
* JavaScript: [standard](https://github.com/standard/standard)

### Change Log

__180813__

* notify parent window

__180811__

* add flags

__180810__

* add top scores

__180807__

* initial release