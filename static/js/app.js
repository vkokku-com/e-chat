(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = Ractive.extend({
    template: require('../../tpl/home'),
    components: {
        navigation: require('../views/Navigation'),
        appfooter: require('../views/Footer')
    },
    onrender: function() {
        console.log('Home page rendered');
    }
});

},{"../../tpl/home":10,"../views/Footer":7,"../views/Navigation":8}],2:[function(require,module,exports){
// frontend/js/app.js
var Router = require('./lib/Router')();
var Home = require('./controllers/Home');
var currentPage;
var body;
var showPage = function(newPage) {
    if (currentPage) {
        currentPage.teardown();
    }
    currentPage = newPage;
    body.innerHTML = '';
    currentPage.render(body);
}
window.onload = function() {
    body = document.querySelector('body');
    Router.add('home', function() {
            var p = new Home();
            showPage(p);
        })
        .add(function() {
            Router.navigate('home');
        })
        .listen()
        .check();
}

},{"./controllers/Home":1,"./lib/Router":4}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
module.exports = function() {
    return {
        routes: [],
        add: function(path, handler) {
            if (typeof path === 'function') {
                handler = path;
                path = '';
            }
            this.routes.push({
                path: path,
                handler: handler
            });
            return this;
        },
        check: function(f, params) {
            var fragment, vars;
            if (typeof f !== 'undefined') {
                fragment = f.replace(/^\//, '');
            } else {
                fragment = this.getFragment();
            }
            for (var i = 0; i < this.routes.length; i++) {
                var match, path = this.routes[i].path;
                path = path.replace(/^\//, '');
                vars = path.match(/:[^\s/]+/g);
                var r = new RegExp('^' + path.replace(/:[^\s/]+/g,
                    '([\\w-]+)'));
                match = fragment.match(r);
                if (match) {
                    match.shift();
                    var matchObj = {};
                    if (vars) {
                        for (var j = 0; j < vars.length; j++) {
                            var v = vars[j];
                            matchObj[v.substr(1, v.length)] = match[j];
                        }
                    }
                    this.routes[i].handler.apply({}, (params || []).concat([matchObj]));
                    return this;
                }
            }
            return false;
        },
        getFragment: function() {
            var fragment = '';
            fragment = this.clearSlashes(decodeURI(window.location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.root !== '/' ? fragment.replace(this.root, '') :
                fragment;
            return this.clearSlashes(fragment);
        },
        clearSlashes: function(path) {
            return path.toString().replace(/\/$/, '').replace(/^\//, '');
        },
        listen: function() {
            var self = this;
            var current = self.getFragment();
            var fn = function() {
                if (current !== self.getFragment()) {
                    current = self.getFragment();
                    self.check(current);
                }
            }
            clearInterval(this.interval);
            this.interval = setInterval(fn, 50);
            return this;
        },
        navigate: function(path) {
            path = path ? path : '';
            history.pushState(null, null, this.root + this.clearSlashes(path));
            return this;
        }
    }
};

},{}],5:[function(require,module,exports){
var ajax = require('../lib/Ajax');
module.exports = Ractive.extend({
    data: {
        value: null,
        url: ''
    },
    fetch: function() {
        var self = this;
        ajax.request({
                url: self.get('url'),
                json: true
            })
            .done(function(result) {
                self.set('value', result);
            })
            .fail(function(xhr) {
                self.fire('Error fetching ' + self.get('url'))
            });
        return this;
    },
    bindComponent: function(component) {
        if (component) {
            this.observe('value', function(v) {
                for (var key in v) {
                    component.set(key, v[key]);
                }
            }, {
                init: false
            });
        }
        return this;
    }
});

},{"../lib/Ajax":3}],6:[function(require,module,exports){
var Base = require('./Base');
module.exports = Base.extend({
    data: {
        url: '/api/version'
    }
});

},{"./Base":5}],7:[function(require,module,exports){
var FooterModel = require('../models/Version');
module.exports = Ractive.extend({
    template: require('../../tpl/footer'),
    onrender: function() {
        var model = new FooterModel();
        model.bindComponent(this).fetch();
    }
});

},{"../../tpl/footer":9,"../models/Version":6}],8:[function(require,module,exports){
module.exports = Ractive.extend({
    template: require('../../tpl/navigation')
});

},{"../../tpl/navigation":11}],9:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"footer","f":["Version: ",{"t":2,"r":"version"}]}]}
},{}],10:[function(require,module,exports){
module.exports = {"v":1,"t":[{"t":7,"e":"header","f":[{"t":7,"e":"navigation"}," ",{"t":7,"e":"div","a":{"class":"hero"},"f":[{"t":7,"e":"h1","f":["Node.js by example"]}]}]}," ",{"t":7,"e":"appfooter"}]}
},{}],11:[function(require,module,exports){
module.exports = {"v":1,"t":[]}
},{}]},{},[2])