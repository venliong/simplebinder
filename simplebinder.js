(function () {
  window.SimpleBinder = function(a, b, c) {
    // are we listening for something else?
    var watch = (typeof(b) === 'object' && b.watch) ? b.watch: 'value',
    change = (typeof(b) === 'object' && b.change) ? b.change: 'textContent',
    // last arg is callback
    callback = (typeof(b) === 'function') ? b: c,
    targets, inputs, il, tl, evt, loadedModels = [], loadedControllers = [];

    var binder = function() {
      // create items
      newController(a);
      newModel(a);
      makeInputs();
    };

    function rakeControllers(arr) {
      inputs = document.querySelectorAll(loadedControllers.join(','));
      il = inputs.length;
    }

    function newController(contr) {
      loadedControllers.push('[data-controller="' + contr + '"]');
      rakeControllers();
    }

    function rakeModels(arr) {
      targets = document.querySelectorAll(loadedModels.join(','));
      tl = targets.length;
    }

    function newModel(modl) {
      loadedModels.push('[data-model="' + modl + '"]');
      rakeModels();
    }

    function makeInputs() {
      for (var i = 0; i < il; i++) {
        // special inputs
        evt = (inputs[i].type === 'radio' || inputs[i].type === 'checkbox' || inputs[i].type.indexOf('select') !== -1) ? 'change': 'input';
        inputs[i].addEventListener(evt, handleChange);
      }
    }

    function handleChange() {
      for (var i = 0; i < tl; i++) {
        targets[i][change] = this[watch].toString();
      }
      if (callback && typeof(callback) === 'function') {
        callback(this, targets[i]);
      }
    }

    binder.prototype.controllers = loadedControllers;

    binder.prototype.models = loadedModels;

    binder.prototype.destroy = function() {
      for (var i = 0; i < il; i++) {
        inputs[i].removeEventListener(evt, handleChange);
      }
    };

    binder.prototype.addModel = function(nmodel) {
      newModel(nmodel);
      makeInputs();
    };

    binder.prototype.addController = function(ncontroller) {
      newController(ncontroller);
      makeInputs();
    };

    return new binder;
  };
})();