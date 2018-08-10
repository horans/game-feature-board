# Game: Feature Board

"Game: Feature Board" (or "GFB"),
will display icons of feature on an "n x n" board with disguised icons.
It will calculate how much time take user to click on all the right icons.

* Level select.
* Result list.
* Game tips.

## Basic

### Install

Upload everything to your server, eg.:

```text
//sample.com/gfb/
```

### Usage

Embed `iframe.html` into your page, eg.:

```html
<iframe src="//sample.com/gfb/iframe.html" frameBorder="0" width="830" height="640"></iframe>
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

### Scores

We use dummy `json`s for preview only.
Setup your own API to add/get results.

## Extra

### Vendor

* [axios](https://github.com/axios/axios)
* [bootstrap reboot](https://github.com/twbs/bootstrap)
* [ES6-Promise](https://github.com/stefanpenner/es6-promise)
* [Lodash](https://github.com/lodash/lodash)
* [Vue](https://github.com/vuejs/vue)
* [Web Font Loader](https://github.com/typekit/webfontloader)

### Linter

* HTML: [HTMLHint](https://github.com/yaniswang/HTMLHint)
* CSS: [CSSLint](https://github.com/CSSLint/csslint)
* JavaScript: [standard](https://github.com/standard/standard)

### Change Log

__180810__

* add top scores

__180807__

* initial release