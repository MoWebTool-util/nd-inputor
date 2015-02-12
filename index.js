/**
 * Description: index.js
 * Author: lzhengms <lzhengms@gmail.com>
 * Date: 2015-01-23 20:59:04
 */

'use strict';

var $ = require('$');
var Timer = require('nd-timer');
var Inputor;
/**
 *
 * @param node
 * @param fn
 * @param params
 *     keep: boolean
 *     timer: boolean
 *     runOnBlur: boolean
 */
 Inputor = function(node, fn, params) {
  node = $(node);
  params = params || {};
  var context=params.context||window;//方法的上下文
  var cache = node.val();
  var flag = false;
  var run = Timer.debounce(function(force) {
    if(flag) {
      var val = node.val();
      if(params.keep === true || force === true || val !== cache) {
        fn.call(context,val, node);
        cache = val;
      }
      if(flag) {
        run();
      }
    }
  }, params.timer || 128);
  node.bind('focus.timer', function() {
    flag = true;
    run(true);
  });
  node.bind('blur.timer', function() {
    if (!params.silentBlur) {
      fn.call(context,node.val(), node);
    }
    flag = false;
  });
};

$.fn.timer = function(fn, params) {
  this.each(function() {
    Inputor(this, fn, params);
  });
};

module.exports = Inputor;
