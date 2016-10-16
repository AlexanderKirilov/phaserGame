/*https://gist.github.com/crisu83/f13ec7ad0de9273480de*/ 
'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _phaser=require('phaser');function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return call&&('object'==typeof call||'function'==typeof call)?call:self}function _inherits(subClass,superClass){if('function'!=typeof superClass&&null!==superClass)throw new TypeError('Super expression must either be null or a function, not '+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}/**
 * Renders the given display objects using the given render session.
 * @param {Array} displayObjects
 * @param {Object} renderSession
 */function renderDisplayObjects(a,b){for(var c=0;c<a.length;c++)a[c]._renderWebGL(b)}/**
 * Returns all the children for the given group recursively.
 * @param {Phaser.Group} group
 * @returns {Array}
 */function getChildrenRecursive(a){var b=[];for(var c=0;c<a.children.length;c++)a.children[c]instanceof _phaser.Group?b=[].concat(_toConsumableArray(b),_toConsumableArray(getChildrenRecursive(a.children[c]))):b.push(a.children[c]);return b}/**
 * Custom Phaser Group that allows for sorting all of it's children recursively.
 * Inspired by the research by Krummelz (http://www.html5gamedevs.com/profile/7879-krummelz/).
 * @see http://www.html5gamedevs.com/topic/3085-depth-sort-multiple-groups/
 */var a=function(_Group){/**
   * @inheritdoc
   */function a(){var _ref;_classCallCheck(this,a);for(var _len=arguments.length,b=Array(_len),_key=0;_key<_len;_key++)b[_key]=arguments[_key];var _this=_possibleConstructorReturn(this,(_ref=a.__proto__||Object.getPrototypeOf(a)).call.apply(_ref,[this].concat(b)));return _this._allChildren=[],_this._allChildren=[],_this}/**
   * @inheritdoc
   */return _inherits(a,_Group),_createClass(a,[{key:'_renderWebGL',value:function _renderWebGL(b){return!this.visible||0>=this.alpha?void 0:this._cacheAsBitmap?void this._renderCachedSprite(b):void(this._mask||this._filters?(this._mask&&(b.spriteBatch.stop(),b.maskManager.pushMask(this.mask,b),b.spriteBatch.start()),this._filters&&(b.spriteBatch.flush(),b.filterManager.pushFilter(this._filterBlock)),renderDisplayObjects(this._allChildren,b),b.spriteBatch.stop(),this._filters&&b.filterManager.popFilter(),this._mask&&b.maskManager.popMask(b),b.spriteBatch.start()):renderDisplayObjects(this._allChildren,b))}/**
   * @inheritdoc
   */},{key:'sort',value:function sort(b,c){2>this.children.length||('undefined'==typeof b&&(b='z'),'undefined'==typeof c&&(c=_phaser.Group.SORT_ASCENDING),this._sortProperty=b,this._allChildren=getChildrenRecursive(this),c===_phaser.Group.SORT_ASCENDING?this._allChildren.sort(this.ascendingSortHandler.bind(this)):this._allChildren.sort(this.descendingSortHandler.bind(this)),this.updateZ())}}]),a}(_phaser.Group);exports.default=a;