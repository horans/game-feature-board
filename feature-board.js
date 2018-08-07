/*****************************************************
*  project: game feature board                       *
*  description: inpage functions                     *
*  author: horans@gmail.com                          *
*  url: https://github.com/horans/game-feature-board *
*  update: 180807                                    *
*****************************************************/
/* global _, Vue, WebFont */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "gfb" }] */
/* bus */
var bus = new Vue()

/* font */
WebFont.load({
  google: { families: ['Muli:400,600,700'] },
  timeout: 2000,
  active: function () { bus.$emit('gfb.font') },
  inactive: function () { bus.$emit('gfb.font') }
})

/* vue */
var gfb = new Vue({
  el: '#app',
  data: {
    state: {
      init: false,
      wait: false,
      done: true,
      result: false,
      submit: false,
      email: false
    },
    game: {
      running: false,
      hard: false,
      time: {
        now: 0,
        start: 0,
        end: 0
      },
      cells: [],
      scores: []
    },
    config: {},
    api: {
      // base: 'https://i.wondershare.com/api/v1/activity/',
      base: './asset/submit.json?',
      error: {
        default: 'Something wrong with network, please try again!',
        msg: ''
      },
      types: {
        getConfig: {
          path: '',
          external: true,
          type: 'GET'
        },
        getSVG: {
          path: '',
          external: true,
          type: 'GET'
        },
        addScore: {
          path: '/additive',
          type: 'POST',
          data: {
            site_id: null,
            page: '',
            user_email: '',
            extension: {}
          }
        }
      }
    }
  },
  computed: {
    // config json path
    json: function () {
      var l = window.location.href
      var p = '?config='
      var d = 'feature-board-config.json'
      var i = l.indexOf(p)
      return i === -1 ? d : l.substr(i + p.length)
    },
    // percent of item size
    percent: function () {
      return 100 / (this.config.game.size || 1)
    },
    // timer of game
    timer: function () {
      return this.formatTime(this.game.time.now - this.game.time.start)
    },
    // best result
    best: function () {
      var s = this.game.scores
      return s.length > 0 ? _.sortBy(s, 'time')[0] : null
    },
    // finished at least one round
    again: function () {
      return this.game.scores.length > 0
    }
  },
  methods: {
    // initialize game for first time
    initGame: function () {
      this.api.types.getConfig.path = this.json
      this.apiAction('getConfig')
      this.$on('gfb.config.ready', function () {
        this.resetGame()
      })
      this.$on('gfb.game.ready', function () {
        this.state.init = true
      })
    },
    // reset game for next round
    resetGame: function () {
      var f = []
      for (var fi = 0; fi < this.config.feats.length; fi++) {
        f.push({ index: fi, chosen: false })
      }
      var s = this.config.game.size
      while (f.length > s * s) {
        s++
      }
      this.config.game.size = s
      var fl = f.length
      for (var bi = 0; bi < s * s - fl; bi++) {
        f.push({ index: -1 })
      }
      this.game.cells = _.shuffle(f)
      var t = this
      _.each(this.config.feats, function (o, i) {
        t.config.feats[i].active = false
      })
      this.game.running = false
      this.game.time.now = 0
      this.game.time.start = 0
      this.game.time.end = 0
      if (!this.state.init) this.$emit('gfb.game.ready')
    },
    // game start
    startGame: function () {
      this.state.result = false
      this.state.submit = false
      this.game.running = true
      this.game.time.start = Date.now()
      this.game.time.now = Date.now()
      this.tipGame()
    },
    // choose right feature
    chooseCell: function (ind) {
      this.clickCell(ind)
      var c = this.game.cells[ind]
      if (c.index > -1 && !c.chosen) {
        this.game.cells[ind].chosen = true
        this.config.feats[c.index].active = true
        if (_.filter(this.config.feats, function (o) { return o.active }).length === this.config.feats.length) this.endGame()
      }
    },
    // click effect
    clickCell: function (ind) {
      this.$refs['cell' + ind][0].classList.remove('clicked')
      this.$refs['cell' + ind][0].classList.add('clicked')
      setTimeout(function () {
        gfb.$refs['cell' + ind][0].classList.remove('clicked')
      }, 55)
    },
    // show tip if user don't move
    tipGame: function () {
      var t = this
      var r = 0
      var c = setInterval(function () {
        r++
        if (_.filter(t.config.feats, function (o) { return o.active }).length > 0) {
          clearInterval(c)
        } else {
          if (r < 10) {
            t.clickCell(_.findIndex(t.game.cells, function (p) { return p.index > -1 }))
          } else {
            r = 0
            clearInterval(c)
            t.resetGame()
          }
        }
      }, 2000)
    },
    // end the current round
    endGame: function () {
      this.game.time.end = Date.now()
      this.game.scores.push({
        try: this.game.scores.length + 1,
        time: this.game.time.end - this.game.time.start,
        level: this.game.hard ? 'hard' : 'normal'
      })
      this.api.types.addScore.data.extension = this.best
      this.game.running = false
      this.state.result = true
      this.resetGame()
    },
    // switch game level
    hardGame: function () {
      if (this.game.hard) {
        this.game.hard = false
        this.config.game.size--
      } else {
        this.game.hard = true
        this.config.game.size++
      }
      this.state.result = false
      this.state.submit = false
      this.resetGame()
    },
    // show time with millisecond
    formatTime: function (time) {
      return (time < 10000 ? '0' : '') + (time / 1000).toFixed(3)
    },
    // main action with apis
    apiAction: function (type, data) {
      var a = this.api.types[type]
      var p = (a.external ? '' : this.api.base) + a.path
      var d = a.data
      var t = this
      switch (type) {
        case 'getConfig': break
        case 'getSVG':
          p = data.link
          break
        case 'addScore':
          d.extension = JSON.stringify(d.extension)
          break
        default: break
      }
      if (a) {
        this.state.wait = true
        this.state.done = false
        this.axios({
          url: p,
          method: a.type,
          data: d
        }).then(function (res) {
          var r = res.data
          t.api.error.msg = ''
          switch (type) {
            case 'getConfig':
              t.state.done = true
              var c = true
              if (!r || !r.page || !r.game || !r.feats || !r.label) c = false
              if (c && (!r.page.activityId || !r.page.siteId || !r.page.link)) c = false
              if (c && (!r.game.size || !r.game.icon)) c = false
              if (c && r.feats.length === 0) c = false
              if (c && (!r.label.product || !r.label.submitBefore || !r.label.submitAfter)) c = false
              if (c) {
                t.setConfig(r)
              } else {
                window.console.log('[gfb] fail to load config')
              }
              break
            case 'getSVG':
              t.state.done = true
              if (data.index < 0) {
                t.$set(t.config.game, 'svg', r)
              } else {
                t.$set(t.config.feats[data.index], 'svg', r)
              }
              if (t.config.game.svg && _.filter(t.config.feats, function (o) { return !o.svg }).length === 0) t.$emit('gfb.config.ready')
              break
            case 'addScore':
              if (r.code === 200) {
                t.state.done = true
                t.state.submit = true
                t.state.email = true
              } else {
                t.api.error.msg = r.msg
              }
              break
            default: break
          }
        }).catch(function (err) {
          t.api.error.msg = _.clone(t.api.error.default)
          console.log(err)
        }).then(function () {
          t.state.wait = false
        })
      }
    },
    // load config and load svg
    setConfig: function (conf) {
      this.$set(this.$data, 'config', conf)

      // set up add score api
      this.api.types.addScore.path = this.config.page.activityId + this.api.types.addScore.path
      this.api.types.addScore.data.site_id = _.clone(this.config.page.siteId)
      this.api.types.addScore.data.page = _.clone(this.config.page.link)

      // insert icon svg
      var t = this
      t.apiAction('getSVG', { index: -1, link: t.config.game.icon })
      _.each(t.config.feats, function (o, i) {
        t.apiAction('getSVG', { index: i, link: o.icon })
      })
    }
  },
  created: function () {
    var t = this
    bus.$on('gfb.font', function () {
      t.initGame()
    })
  },
  watch: {
    // update timer
    'game.time.now': _.debounce(function () {
      if (this.game.running) this.game.time.now = Date.now()
    }, 70)
  }
})
