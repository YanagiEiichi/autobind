/**/ void function() {

// UMD 
var umd = function(autobind) { 
  switch(true) {
    // CommonJS
    case typeof module === 'object' && !!module.exports:
      module.exports = autobind;
      break;
    // AMD (Add a 'String' wrapper here to fuck webpack)
    case String(typeof define) === 'function' && !!define.amd:
      define('autobind', function() { return autobind; });
      break;
    // Global
    default:
      /**/ try { /* Fuck IE8- */
      /**/   if(typeof execScript === 'object') execScript('var autobind');
      /**/ } catch(error) {}
      window.autobind = autobind;
  }
};

var bindMethod = function(base, name, desc) {
  var get = desc.get;
  var value = desc.value;
  // For value property
  if(typeof value === 'function') {
    // Remove value description
    delete desc.value;
    delete desc.writable;
    // Replace to a getter function
    desc.get = function() {
      if(this === base) return value;
      var boundValue = value.bind(this);
      // Save result to itself as a cache
      Object.defineProperty(this, name, {
        value: boundValue,
        enumerable: desc.enumerable,
        writable: desc.writable,
        configurable: desc.configurable
      });
      return boundValue;
    };
    // Add a setter to avoid throw on assignment
    desc.set = function(value) {
      Object.defineProperty(this, name, {
        value: value,
        enumerable: true,
        writable: true,
        configurable: true
      });
    };
  }
  return desc;
};

var autobind = function(base, name, desc) {
  // For class
  if(typeof base === 'function' && name === void 0 && desc === void 0) {
    var prototype = base.prototype;
    Object.getOwnPropertyNames(prototype).forEach(function(name) {
      if(name === 'constructor' || typeof prototype[name] !== 'function') return;
      var desc = Object.getOwnPropertyDescriptor(prototype, name);
      bindMethod(prototype, name, desc);
      Object.defineProperty(prototype, name, desc);
    });
  }
  // For method
  else if(typeof desc.value === 'function') {
    bindMethod(base, name, desc);
  }
};

umd(autobind);

/**/ }();
