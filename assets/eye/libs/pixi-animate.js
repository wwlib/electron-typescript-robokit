/**
 * pixi-animate - PIXI plugin for the PixiAnimate Extension
 * @version v0.5.6
 * @link https://github.com/jiborobot/pixi-animate
 * @license MIT
 */
 (function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pixiAnimate = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AnimatorTimeline = require("./AnimatorTimeline");

var _AnimatorTimeline2 = _interopRequireDefault(_AnimatorTimeline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SharedTicker = PIXI.ticker.shared;

var timelines = [];

/**
 * Play animation via start/stop frame labels
 * @class Animator
 * @namespace PIXI.animate
 */

var Animator = function () {
    function Animator() {
        _classCallCheck(this, Animator);
    }

    _createClass(Animator, null, [{
        key: "play",


        /**
         * Play an animation by
         * @method play
         * @static
         * @param {PIXI.animate.MovieClip} instance Movie clip to play.
         * @param {String} event The frame label event to call
         * @param {Function} [callback] Optional callback when complete
         * @return {PIXI.animate.AnimatorTimeline} Timeline object for stopping or getting progress.
         */
        value: function play(instance, event, callback) {
            var startLabel,
                endLabel,
                loop = false;

            for (var i = 0, len = instance.labels.length; i < len; i++) {
                var label = instance.labels[i];
                if (label.label === event) {
                    startLabel = label;
                } else if (label.label === event + this.STOP_LABEL) {
                    endLabel = label;
                } else if (label.label === event + this.LOOP_LABEL) {
                    loop = true;
                    endLabel = label;
                }

                if (startLabel && endLabel) {
                    break;
                }
            }

            if (!startLabel) {
                throw new Error("No start label matching '" + event + "'");
            } else if (!endLabel) {
                throw new Error("No end label matching '" + event + "'");
            }

            // Stop any animation that's playing
            this.stop(instance);

            // Add a new timeline
            var timeline = _AnimatorTimeline2.default.create(instance, loop, startLabel.position, endLabel.position, callback);
            this._timelines.push(timeline);

            // Set the current frame
            if (instance.currentFrame !== startLabel.position) {
                instance.gotoAndPlay(event);
            } else {
                instance.play();
            }
            this._refresh();

            return timeline;
        }

        /**
         * Stop the animation
         * @method stop
         * @static
         * @param {PIXI.animate.MovieClip} instance Movie clip to play.
         */

    }, {
        key: "stop",
        value: function stop(instance) {
            for (var i = 0, len = this._timelines.length; i < len; i++) {
                var timeline = this._timelines[i];
                if (timeline.instance === instance) {
                    this._internalStop(timeline);
                    break;
                }
            }
        }

        /**
         * Stop the animation
         * @method _internalStop
         * @private
         * @static
         * @param {PIXI.animate.AnimatorTimeline} timeline Timeline to stop.
         */

    }, {
        key: "_internalStop",
        value: function _internalStop(timeline) {
            this._timelines.splice(this._timelines.indexOf(timeline), 1);
            timeline.instance.stop();
            timeline.destroy();
            this._refresh();
        }

        /**
         * Refresh if we should be updating
         * @method _refresh
         * @private
         * @static
         */

    }, {
        key: "_refresh",
        value: function _refresh() {
            if (this._updateBind) {
                SharedTicker.remove(this._updateBind);
            }
            this._updateBind = this._update.bind(this);
            if (this._timelines.length > 0) {
                SharedTicker.add(this._updateBind);
            }
        }

        /**
         * Update the animation
         * @method _update
         * @static
         * @private
         */

    }, {
        key: "_update",
        value: function _update() {
            for (var i = this._timelines.length - 1; i >= 0; i--) {
                this._timelines[i].update();
            }
        }
    }, {
        key: "_timelines",


        /**
         * The collection of timelines
         * @property {Array<PIXI.animate.AnimatorTimeline>} _timelines
         * @private
         * @static
         */
        get: function get() {
            return timelines;
        }

        /**
         * Suffix added to label for a stop.
         * @property {String} STOP_LABEL
         * @static
         * @default "_stop"
         */

    }, {
        key: "STOP_LABEL",
        get: function get() {
            return "_stop";
        }

        /**
         * Suffix added to label for a loop.
         * @property {String} LOOP_LABEL
         * @static
         * @default "_loop"
         */

    }, {
        key: "LOOP_LABEL",
        get: function get() {
            return "_loop";
        }
    }]);

    return Animator;
}();

module.exports = Animator;

},{"./AnimatorTimeline":2}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pool = [];

/**
 * Represents a single animation play.
 * @class AnimatorTimeline
 * @namespace PIXI.animate
 */

var AnimatorTimeline = function () {
    function AnimatorTimeline() {
        _classCallCheck(this, AnimatorTimeline);

        this.init(null, null, false, 0, 0);
    }

    /**
     * The pool of timelines to use
     * @method init
     * @param {PIXI.animate.MovieClip} instance
     * @param {Boolean} loop
     * @param {Number} start
     * @param {Number} init
     * @private
     */


    _createClass(AnimatorTimeline, [{
        key: "init",
        value: function init(instance, loop, start, end, callback) {
            this.instance = instance;
            this.loop = loop;
            this.start = start;
            this.end = end;
            this.callback = callback;

            if (instance) {
                instance.gotoAndStop(start);
            }
        }

        /**
         * Don't use after this
         * @method destroy
         * @private
         */

    }, {
        key: "destroy",
        value: function destroy() {
            this.init(null, null, false, 0, 0, null);
            AnimatorTimeline._pool.push(this);
        }

        /**
         * Is the animation complete
         * @method update
         * @return {Boolean} 
         * @private
         */

    }, {
        key: "update",
        value: function update() {
            if (this.instance.currentFrame >= this.end) {
                if (this.loop) {
                    this.instance.gotoAndPlay(this.start);
                } else {
                    var callback = this.callback;
                    this.stop();
                    if (callback) {
                        callback();
                    }
                }
            }
        }

        /**
         * Stop the animation, cannot be reused.
         * @method stop
         */

    }, {
        key: "stop",
        value: function stop() {
            PIXI.animate.Animator._internalStop(this);
        }

        /**
         * The progress from 0 to 1 of the playback.
         * @property {Number} progress
         * @readOnly
         */

    }, {
        key: "progress",
        get: function get() {
            var progress = (this.instance.currentFrame - this.start) / (this.end - this.start);
            return Math.max(0, Math.min(1, progress)); // clamp
        }

        /**
         * The pool of timelines to use
         * @property {Array<AnimatorTimeline>} _pool
         * @static
         * @private
         */

    }], [{
        key: "create",


        /**
         * Create a new timeline
         * @method create
         * @static
         * @param {PIXI.animate.MovieClip} instance
         * @param {Boolean} loop
         * @param {Number} start
         * @param {Number} init
         * @param {Function} callback
         * @return {PIXI.animate.AnimatorTimeline}
         */
        value: function create(instance, loop, start, end, callback) {
            var timeline;
            if (this._pool.length) {
                timeline = this._pool.pop();
            } else {
                timeline = new AnimatorTimeline();
            }
            timeline.init(instance, loop, start, end, callback);
            return timeline;
        }
    }, {
        key: "_pool",
        get: function get() {
            return pool;
        }
    }]);

    return AnimatorTimeline;
}();

module.exports = AnimatorTimeline;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Timeline = require('./Timeline');

var _Timeline2 = _interopRequireDefault(_Timeline);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = PIXI.Container;
var SharedTicker = PIXI.ticker.shared;

/**
 * Provide timeline playback of movieclip
 * @namespace PIXI.animate
 * @class MovieClip
 * @extends PIXI.Container
 * @constructor
 * @param {Object|int} [options] The options object or the mode to play
 * @param {int} [options.mode=0] The playback mode default is independent (0),
 * @param {int} [options.startPosition=0] The starting frame
 * @param {Boolean} [options.loop=true] If playback is looped
 * @param {Object} [options.labels] The frame labels map of label to frames
 * @param {int} [options.duration] The duration, if no duration is provided, auto determines length
 * @param {int} [options.framerate=24] The framerate to use for independent mode
 */

var MovieClip = function (_Container) {
    _inherits(MovieClip, _Container);

    function MovieClip(options, duration, loop, framerate, labels) {
        _classCallCheck(this, MovieClip);

        // Default options

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MovieClip).call(this));

        options = options === undefined ? {} : options;

        // Options can also be the mode
        if (typeof options === 'number') {
            options = {
                mode: options || MovieClip.INDEPENDENT,
                duration: duration || 0,
                loop: loop === undefined ? true : loop,
                labels: labels || {},
                framerate: framerate || 0,
                startPosition: 0
            };
        } else {
            // Apply defaults to options
            options = Object.assign({
                mode: MovieClip.INDEPENDENT,
                startPosition: 0,
                loop: true,
                labels: {},
                duration: 0,
                framerate: 0
            }, options);
        }

        /**
         * Controls how this MovieClip advances its time. Must be one of 0 (INDEPENDENT), 1 (SINGLE_FRAME), or 2 (SYNCHED).
         * See each constant for a description of the behaviour.
         * @property mode
         * @type int
         * @default null
         */
        _this.mode = options.mode;

        /**
         * Specifies what the first frame to play in this movieclip, or the only frame to display if mode is SINGLE_FRAME.
         * @property startPosition
         * @type Number
         * @default 0
         */
        _this.startPosition = options.startPosition;

        /**
         * Indicates whether this MovieClip should loop when it reaches the end of its timeline.
         * @property loop
         * @type Boolean
         * @default true
         */
        _this.loop = !!options.loop;

        /**
         * The current frame of the movieclip.
         * @property currentFrame
         * @type Number
         * @default 0
         * @readOnly
         */
        _this.currentFrame = 0;

        _this._labels = [];
        _this._labelDict = options.labels;
        if (options.labels) {
            for (var name in options.labels) {
                var label = {
                    label: name,
                    position: options.labels[name]
                };
                _this._labels.push(label);
            }
            _this._labels.sort(function (a, b) {
                return a.position - b.position;
            });
        }

        /**
         * If true, this movieclip will animate automatically whenever it is on the stage.
         * @property selfAdvance
         * @type Boolean
         * @default true
         */
        _this.selfAdvance = true;

        /**
         * If true, the MovieClip's position will not advance when ticked.
         * @property paused
         * @type Boolean
         * @default false
         */
        _this.paused = false;

        /**
         * If true, actions in this MovieClip's tweens will be run when the playhead advances.
         * @property actionsEnabled
         * @type Boolean
         * @default true
         */
        _this.actionsEnabled = true;

        /**
         * If true, the MovieClip will automatically be reset to its first frame whenever the timeline adds
         * it back onto the display list. This only applies to MovieClip instances with mode=INDEPENDENT.
         * <br><br>
         * For example, if you had a character animation with a 'body' child MovieClip instance
         * with different costumes on each frame, you could set body.autoReset = false, so that
         * you can manually change the frame it is on, without worrying that it will be reset
         * automatically.
         * @property autoReset
         * @type Boolean
         * @default true
         */
        _this.autoReset = true;

        /**
         * @property _synchOffset
         * @type Number
         * @default 0
         * @private
         */
        _this._synchOffset = 0;

        /**
         * @property _prevPos
         * @type Number
         * @default -1
         * @private
         */
        _this._prevPos = -1; // TODO: evaluate using a ._reset Boolean prop instead of -1.

        /**
         * Note - changed from default: When the MovieClip is framerate independent, this is the time
         * elapsed from frame 0 in seconds.
         * @property _t
         * @type Number
         * @default 0
         * @private
         */
        _this._t = 0;

        /**
         * By default MovieClip instances advance one frame per tick. Specifying a framerate for the MovieClip
         * will cause it to advance based on elapsed time between ticks as appropriate to maintain the target
         * framerate.
         *
         * @property _framerate
         * @type {Number}
         * @default 0
         */
        _this._framerate = options.framerate;

        /**
         * The total time in seconds for the animation. This is changed when setting the framerate.
         * @property _duration
         * @type Number
         * @default 0
         * @private
         */
        _this._duration = 0;

        /**
         * The total duration in frames for the animation.
         * @property _totalFrames
         * @type Number
         * @default 0
         * @private
         */
        _this._totalFrames = options.duration;

        /**
         * Standard tween timelines for all objects. Each element in the _timelines array
         * is a Timeline object - an array of tweens for one target, in order of occurrence.
         * @property _timelines
         * @type Array
         * @protected
         */
        _this._timelines = [];

        /**
         * Array of child timelines denoting if a child is actively a child of this movieclip
         * on any given frame. Each element in the _timedChildTimelines is an array with a 'target'
         * property, and is an array of boolean values indexed by frame.
         * @property _timedChildTimelines
         * @type {Array}
         * @protected
         */
        _this._timedChildTimelines = [];

        /**
         * Array to depth sort timed children
         * @property _depthSorted
         * @type {Array}
         * @private
         */
        _this._depthSorted = [];

        /**
         * Array of frame scripts, indexed by frame.
         * @property _actions
         * @type {Array}
         * @protected
         */
        _this._actions = [];

        if (_this.mode === MovieClip.INDEPENDENT) {
            _this._tickListener = _this._tickListener.bind(_this);
            _this._onAdded = _this._onAdded.bind(_this);
            _this._onRemoved = _this._onRemoved.bind(_this);
            _this.on('added', _this._onAdded);
            _this.on('removed', _this._onRemoved);
        }

        if (options.framerate) {
            _this.framerate = options.framerate;
        }
        return _this;
    }

    _createClass(MovieClip, [{
        key: '_onAdded',
        value: function _onAdded() {
            SharedTicker.add(this._tickListener);
        }
    }, {
        key: '_tickListener',
        value: function _tickListener(tickerDeltaTime) {
            if (this.paused || !this.selfAdvance) {
                //see if the movieclip needs to be updated even though it isn't animating
                if (this._prevPos < 0) {
                    this._goto(this.currentFrame);
                }
                return;
            }
            var seconds = tickerDeltaTime / SharedTicker.speed / PIXI.TARGET_FPMS / 1000;
            this.advance(seconds);
        }
    }, {
        key: '_onRemoved',
        value: function _onRemoved() {
            SharedTicker.remove(this._tickListener);
        }

        /**
         * Returns an array of objects with label and position (aka frame) properties, sorted by position.
         * @property labels
         * @type {Array}
         * @readonly
         */

    }, {
        key: '_autoExtend',


        /**
         * Extend the timeline to the last frame.
         * @method _autoExtend
         * @private
         * @param {int} endFrame
         */
        value: function _autoExtend(endFrame) {
            if (this._totalFrames < endFrame) {
                this._totalFrames = endFrame;
            }
        }

        /**
         * Convert values of properties
         * @method _parseProperties
         * @private
         * @param {Object} properties
         */

    }, {
        key: '_parseProperties',
        value: function _parseProperties(properties) {
            // Convert any string colors to uints
            if (typeof properties.t === 'string') {
                properties.t = _utils2.default.hexToUint(properties.t);
            } else if (typeof properties.v === 'number') {
                properties.v = !!properties.v;
            }
        }

        /**
         * Get a timeline for a child, synced timeline.
         * @method _getChildTimeline
         * @private
         * @param {PIXI.animate.MovieClip} instance
         * @return {PIXI.animate.Timeline}
         */

    }, {
        key: '_getChildTimeline',
        value: function _getChildTimeline(instance) {
            for (var i = this._timelines.length - 1; i >= 0; --i) {
                if (this._timelines[i].target === instance) {
                    return this._timelines[i];
                }
            }
            var timeline = new _Timeline2.default(instance);
            this._timelines.push(timeline);
            return timeline;
        }

        /**
         * Add mask or masks
         * @method addTimedMask
         * @param {PIXI.DisplayObject} instance Instance to mask
         * @param {Object} keyframes The map of frames to mask objects
         * @return {PIXI.animate.MovieClip} instance of clip for chaining
         */

    }, {
        key: 'addTimedMask',
        value: function addTimedMask(instance, keyframes) {
            for (var i in keyframes) {
                this.addKeyframe(instance, {
                    m: keyframes[i]
                }, parseInt(i, 10));
            }

            // Set the initial position/add
            this._setTimelinePosition(this.currentFrame, this.currentFrame, true);
            return this;
        }

        /**
         * Shortcut alias for `addTimedMask`
         * @method am
         * @param {PIXI.DisplayObject} instance Instance to mask
         * @param {Object} keyframes The map of frames to mask objects
         * @return {PIXI.animate.MovieClip} instance of clip for chaining
         */

    }, {
        key: 'am',
        value: function am(instance, keyframes) {
            return this.addTimedMask(instance, keyframes);
        }

        /**
         * Add a tween to the clip
         * @method addTween
         * @param {PIXI.DisplayObject} instance The clip to tween
         * @param {Object} properties The property or property to tween
         * @param {int} startFrame The frame to start tweening
         * @param {int} [duration=0] Number of frames to tween. If 0, then the properties are set
         *                           with no tweening.
         * @param {Function} [ease] An optional easing function that takes the tween time from 0-1.
         * @return {PIXI.animate.MovieClip}
         */

    }, {
        key: 'addTween',
        value: function addTween(instance, properties, startFrame, duration, ease) {

            var timeline = this._getChildTimeline(instance);
            this._parseProperties(properties);
            timeline.addTween(properties, startFrame, duration, ease);
            this._autoExtend(startFrame + duration);
            return this;
        }

        /**
         * Add a tween to the clip
         * @method addKeyframe
         * @param {PIXI.DisplayObject} instance The clip to tween
         * @param {Object} properties The property or property to tween
         * @param {int} startFrame The frame to start tweening
         * @param {int} [duration=0] Number of frames to tween. If 0, then the properties are set
         *                           with no tweening.
         * @param {Function} [ease] An optional easing function that takes the tween time from 0-1.
         * @return {PIXI.animate.MovieClip}
         */

    }, {
        key: 'addKeyframe',
        value: function addKeyframe(instance, properties, startFrame) {

            var timeline = this._getChildTimeline(instance);
            this._parseProperties(properties);
            timeline.addKeyframe(properties, startFrame);
            this._autoExtend(startFrame);
            return this;
        }

        /**
         * Alias for method `addTimedChild`
         * @method at
         * @return {PIXI.animate.MovieClip}
         */

    }, {
        key: 'at',
        value: function at(instance, startFrame, duration, keyframes) {
            return this.addTimedChild(instance, startFrame, duration, keyframes);
        }

        /**
         * Add a child to show for a certain number of frames before automatic removal.
         * @method addTimedChild
         * @param {PIXI.DisplayObject} instance The clip to show
         * @param {int} startFrame The starting frame
         * @param {int} [duration=1] The number of frames to display the child before removing it.
         * @param {String|Array} [keyframes] The collection of static keyframes to add
         * @return {PIXI.animate.MovieClip}
         */

    }, {
        key: 'addTimedChild',
        value: function addTimedChild(instance, startFrame, duration, keyframes) {

            if (startFrame === undefined) // jshint ignore:line
                {
                    startFrame = 0;
                }
            if (duration === undefined || duration < 1) // jshint ignore:line
                {
                    duration = this._totalFrames || 1;
                }

            // Add the starting offset for synced movie clips
            if (instance.mode === MovieClip.SYNCHED) {
                instance.parentStartPosition = startFrame;
            }

            //add tweening info about this child's presence on stage
            //when the child is (re)added, if it has 'autoReset' set to true, then it
            //should be set back to frame 0
            var timeline = void 0,
                i = void 0;
            //get existing timeline
            for (i = this._timedChildTimelines.length - 1; i >= 0; --i) {
                if (this._timedChildTimelines[i].target === instance) {
                    timeline = this._timedChildTimelines[i];
                    break;
                }
            }
            //if there wasn't one, make a new one
            if (!timeline) {
                timeline = [];
                timeline.target = instance;
                this._timedChildTimelines.push(timeline);
            }

            // Fill the timeline with keyframe booleans
            _utils2.default.fillFrames(timeline, startFrame, duration);

            // Update the total frames if the instance extends our current
            // total frames for this movieclip
            if (this._totalFrames < startFrame + duration) {
                this._totalFrames = startFrame + duration;
            }

            // Add the collection of keyframes
            if (keyframes) {
                if (typeof keyframes === "string") {
                    keyframes = _utils2.default.deserializeKeyframes(keyframes);
                }
                // Convert the keyframes object into
                // individual properties
                var lastFrame = {};
                for (var _i in keyframes) {
                    lastFrame = Object.assign({}, lastFrame, keyframes[_i]);
                    this.addKeyframe(instance, lastFrame, parseInt(_i, 10));
                }
                this._getChildTimeline(instance).extendLastFrame(startFrame + duration);
            }

            // Set the initial position/add
            this._setTimelinePosition(startFrame, this.currentFrame, true);

            return this;
        }

        /**
         * Short cut for `addAction`
         * @method aa
         * @param {Function} callback The clip call on a certain frame
         * @param {int|String} startFrame The starting frame index or label
         * @return {PIXI.animate.MovieClip}
         */

    }, {
        key: 'aa',
        value: function aa(callback, startFrame) {
            return this.addAction(callback, startFrame);
        }

        /**
         * Handle frame actions, callback is bound to the instance of the MovieClip.
         * @method addAction
         * @param {Function} callback The clip call on a certain frame
         * @param {int|String} startFrame The starting frame index or label
         * @return {PIXI.animate.MovieClip}
         */

    }, {
        key: 'addAction',
        value: function addAction(callback, startFrame) {

            if (typeof startFrame === 'string') {
                var index = this._labelDict[startFrame];
                if (index === undefined) {
                    throw 'The label \'' + startFrame + '\' does not exist on this timeline';
                }
                startFrame = index;
            }

            var actions = this._actions;
            //ensure that the movieclip timeline is long enough to support the target frame
            if (actions.length <= startFrame) {
                actions.length = startFrame + 1;
            }
            if (this._totalFrames < startFrame) {
                this._totalFrames = startFrame;
            }
            //add the action
            if (actions[startFrame]) {
                actions[startFrame].push(callback);
            } else {
                actions[startFrame] = [callback];
            }
            return this;
        }

        /**
         * Sets paused to false.
         * @method play
         */

    }, {
        key: 'play',
        value: function play() {
            this.paused = false;
        }

        /**
         * Sets paused to true.
         * @method stop
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.paused = true;
        }

        /**
         * Advances this movie clip to the specified position or label and sets paused to false.
         * @method gotoAndPlay
         * @param {String|Number} positionOrLabel The animation name or frame number to go to.
         */

    }, {
        key: 'gotoAndPlay',
        value: function gotoAndPlay(positionOrLabel) {
            this.paused = false;
            this._goto(positionOrLabel);
        }

        /**
         * Advances this movie clip to the specified position or label and sets paused to true.
         * @method gotoAndStop
         * @param {String|Number} positionOrLabel The animation or frame name to go to.
         */

    }, {
        key: 'gotoAndStop',
        value: function gotoAndStop(positionOrLabel) {
            this.paused = true;
            this._goto(positionOrLabel);
        }

        /**
         * Advances the playhead. This occurs automatically each tick by default.
         * @param [time] {Number} The amount of time in seconds to advance by. Only applicable if framerate is set.
         * @method advance
         */

    }, {
        key: 'advance',
        value: function advance(time) {
            if (!this._framerate) {
                var o = this,
                    fps = o._framerate;
                while ((o = o.parent) && !fps) {
                    if (o.mode === MovieClip.INDEPENDENT) {
                        fps = o._framerate;
                    }
                }
                this.framerate = fps;
            }

            if (time) {
                this._t += time;
            }
            if (this._t > this._duration) {
                this._t = this.loop ? this._t - this._duration : this._duration;
            }
            //add a tiny amount to account for potential floating point errors
            this.currentFrame = Math.floor(this._t * this._framerate + 0.00000001);
            //final error checking
            if (this.currentFrame >= this._totalFrames) {
                this.currentFrame = this._totalFrames - 1;
            }
            //update all tweens & actions in the timeline
            this._updateTimeline();
        }

        /**
         * @method _goto
         * @param {String|Number} positionOrLabel The animation name or frame number to go to.
         * @protected
         */

    }, {
        key: '_goto',
        value: function _goto(positionOrLabel) {
            var pos = typeof positionOrLabel === 'string' ? this._labelDict[positionOrLabel] : positionOrLabel;
            if (pos === undefined) // jshint ignore:line
                {
                    return;
                }
            // prevent _updateTimeline from overwriting the new position because of a reset:
            this._prevPos = NaN;
            this.currentFrame = pos;
            //update the elapsed time if a time based movieclip
            if (this._framerate > 0) {
                this._t = pos / this._framerate;
            } else {
                this._t = 0;
            }
            this._updateTimeline();
        }

        /**
         * @method _reset
         * @private
         */

    }, {
        key: '_reset',
        value: function _reset() {
            this._prevPos = -1;
            this._t = 0;
            this.currentFrame = 0;
        }

        /**
         * @method _updateTimeline
         * @protected
         */

    }, {
        key: '_updateTimeline',
        value: function _updateTimeline() {
            var synched = this.mode !== MovieClip.INDEPENDENT;

            if (synched) {
                this.currentFrame = this.startPosition + (this.mode === MovieClip.SINGLE_FRAME ? 0 : this._synchOffset);
                if (this.currentFrame >= this._totalFrames) {
                    this.currentFrame %= this._totalFrames;
                }
            }

            if (this._prevPos === this.currentFrame) {
                return;
            }

            // update timeline position, ignoring actions if this is a graphic.
            this._setTimelinePosition(this._prevPos, this.currentFrame, synched ? false : this.actionsEnabled);

            this._prevPos = this.currentFrame;
        }

        /**
         * Set the timeline position
         * @method _setTimelinePostion
         * @protected
         * @param {int} startFrame
         * @param {int} currentFrame
         * @param {Boolean} doActions
         */

    }, {
        key: '_setTimelinePosition',
        value: function _setTimelinePosition(startFrame, currentFrame, doActions) {
            //handle all tweens
            var i = void 0,
                j = void 0,
                length = void 0,
                _timelines = this._timelines;
            for (i = _timelines.length - 1; i >= 0; --i) {
                var timeline = _timelines[i];
                for (j = 0, length = timeline.length; j < length; ++j) {
                    var tween = timeline[j];
                    //if the tween contains part of the timeline that we are travelling through
                    if (currentFrame >= tween.startFrame && currentFrame <= tween.endFrame) {
                        // set the position within that tween
                        //and break the loop to move onto the next timeline
                        tween.setPosition(currentFrame);
                        break;
                    }
                }
            }

            var timedChildTimelines = this._timedChildTimelines;
            var depthSorted = this._depthSorted;
            for (i = 0, length = timedChildTimelines.length; i < length; ++i) {
                var target = timedChildTimelines[i].target;
                var shouldBeChild = timedChildTimelines[i][currentFrame];
                //if child should be on stage and is not:
                if (shouldBeChild) {
                    // Add to the depthSorted object so we can
                    // check that items are property drawn later
                    depthSorted.push(target);
                    if (target.parent !== this) {
                        // add the target if it's not there already
                        this.addChild(target);
                        if (target.mode === MovieClip.INDEPENDENT && target.autoReset) {
                            target._reset();
                        }
                    }
                } else if (!shouldBeChild && target.parent === this) {
                    this.removeChild(target);
                }
            }

            // Properly depth sort the children
            for (i = 0, length = depthSorted.length; i < length; i++) {
                var _target = depthSorted[i];
                var currentIndex = this.children.indexOf(_target);
                if (currentIndex !== i) {
                    this.addChildAt(_target, i);
                }
            }

            // Clear the temporary depth sorting array
            depthSorted.length = 0;

            //go through all children and update synched movieclips that are not single frames
            var children = this.children,
                child = void 0;
            for (i = 0, length = children.length; i < length; ++i) {
                child = children[i];
                if (child.mode === MovieClip.SYNCHED) {
                    child._synchOffset = currentFrame - child.parentStartPosition;
                    child._updateTimeline();
                }
            }

            //handle actions
            if (doActions) {
                var actions = this._actions;
                //handle looping around
                var needsLoop = false;
                if (currentFrame < startFrame) {
                    length = actions.length;
                    needsLoop = true;
                } else {
                    length = Math.min(currentFrame + 1, actions.length);
                }
                for (i = startFrame >= 0 ? startFrame + 1 : currentFrame; i < length; ++i) {
                    if (actions[i]) {
                        var frameActions = actions[i];
                        for (j = 0; j < frameActions.length; ++j) {
                            frameActions[j].call(this);
                        }
                    }
                    //handle looping around
                    if (needsLoop && i === length - 1) {
                        i = 0;
                        length = currentFrame + 1;
                        needsLoop = false;
                    }
                }
            }
        }
    }, {
        key: 'destroy',
        value: function destroy(destroyChildren) {
            if (this._tickListener) {
                SharedTicker.remove(this._tickListener);
                this._tickListener = null;
            }
            this._actions = null;
            this._timelines = null;
            this._depthSorted = null;
            this._timedChildTimelines = null;
            _get(Object.getPrototypeOf(MovieClip.prototype), 'destroy', this).call(this, destroyChildren);
        }
    }, {
        key: 'labels',
        get: function get() {
            return this._labels;
        }

        /**
         * Returns the name of the label on or immediately before the current frame.
         * @property currentLabel
         * @type {String}
         * @readonly
         */

    }, {
        key: 'currentLabel',
        get: function get() {
            var labels = this._labels;
            var current = null;
            for (var i = 0, len = labels.length; i < len; ++i) {
                if (labels[i].position <= this.currentFrame) {
                    current = labels[i].label;
                } else {
                    break;
                }
            }
            return current;
        }

        /**
         * When the MovieClip is framerate independent, this is the time elapsed from frame 0 in seconds.
         * @property elapsedTime
         * @type Number
         * @default 0
         * @public
         */

    }, {
        key: 'elapsedTime',
        get: function get() {
            return this._t;
        },
        set: function set(value) {
            this._t = value;
        }

        /**
         * By default MovieClip instances advance one frame per tick. Specifying a framerate for the MovieClip
         * will cause it to advance based on elapsed time between ticks as appropriate to maintain the target
         * framerate.
         *
         * For example, if a MovieClip with a framerate of 10 is placed on a Stage being updated at 40fps, then the MovieClip will
         * advance roughly one frame every 4 ticks. This will not be exact, because the time between each tick will
         * vary slightly between frames.
         *
         * This feature is dependent on the tick event object (or an object with an appropriate 'delta' property) being
         * passed into {{#crossLink 'Stage/update'}}{{/crossLink}}.
         * @property framerate
         * @type {Number}
         * @default 0
         */

    }, {
        key: 'framerate',
        get: function get() {
            return this._framerate;
        },
        set: function set(value) {
            if (value > 0) {
                this._framerate = value;
                this._duration = value ? this._totalFrames / value : 0;
            } else {
                this._framerate = this._duration = 0;
            }
        }

        /**
         * Get the total number of frames (duration) of this MovieClip
         * @property totalFrames
         * @type {Number}
         * @default 0
         * @readOnly
         */

    }, {
        key: 'totalFrames',
        get: function get() {
            return this._totalFrames;
        }
    }]);

    return MovieClip;
}(Container);

/**
 * The MovieClip will advance independently of its parent, even if its parent is paused.
 * This is the default mode.
 * @property INDEPENDENT
 * @static
 * @type String
 * @default 0
 * @readonly
 */


MovieClip.INDEPENDENT = 0;

/**
 * The MovieClip will only display a single frame (as determined by the startPosition property).
 * @property SINGLE_FRAME
 * @static
 * @type String
 * @default 1
 * @readonly
 */
MovieClip.SINGLE_FRAME = 1;

/**
 * The MovieClip will be advanced only when its parent advances and will be synched to the position of
 * the parent MovieClip.
 * @property SYNCHED
 * @static
 * @type String
 * @default 2
 * @readonly
 */
MovieClip.SYNCHED = 2;

/**
 * Extend a container
 * @method extend
 * @static
 * @param {PIXI.animate.MovieClip} child The child function
 * @return {PIXI.animate.MovieClip} The child
 */
/**
 * Extend a container (alias for extend)
 * @method e
 * @static
 * @param {PIXI.animate.MovieClip} child The child function
 * @return {PIXI.animate.MovieClip} The child
 */
MovieClip.extend = MovieClip.e = function (child) {
    child.prototype = Object.create(MovieClip.prototype);
    child.prototype.__parent = MovieClip.prototype;
    child.prototype.constructor = child;
    return child;
};

// Assign to namespace
exports.default = MovieClip;

},{"./Timeline":6,"./utils":10}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Contains the collection of graphics data
 * @namespace PIXI.animate
 * @class ShapesCache
 */
var ShapesCache = {};

/**
 * Add an item or itesm to the cache
 * @method add
 * @static
 * @param {String} prop  The id of graphic or the map of graphics to add
 * @param {String|Array<Array>} items Collection of draw commands
 */
Object.defineProperty(ShapesCache, 'add', {
    enumerable: false,
    value: function value(prop, items) {

        // Decode string to map of files
        if (typeof items === "string") {
            items = _utils2.default.deserializeShapes(items);
        }

        // Convert all hex string colors (animate) to int (pixi.js)
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            for (var j = 0; j < item.length; j++) {
                var arg = item[j];
                if (typeof arg === 'string' && arg[0] === '#') {
                    item[j] = _utils2.default.hexToUint(arg);
                }
            }
        }
        ShapesCache[prop] = items;
    }
});

/**
 * Get the graphic from cache
 * @method  fromCache
 * @static
 * @param  {String} id The cache id
 * @return {Array} Series of graphic draw commands
 */
Object.defineProperty(ShapesCache, 'fromCache', {
    enumerable: false,
    value: function value(id) {
        return ShapesCache[id] || null;
    }
});

/**
 * Remove the graphic from cache
 * @method  remove
 * @static
 * @param  {String|Object} id The cache id or map
 */
Object.defineProperty(ShapesCache, 'remove', {
    enumerable: false,
    value: function value(id) {
        if ((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === "object") {
            for (var name in id) {
                ShapesCache.remove(name);
            }
            return;
        }
        if (ShapesCache[id]) {
            ShapesCache[id].length = 0;
            delete ShapesCache[id];
        }
    }
});

/**
 * Remove all graphics from cache
 * @method  removeAll
 * @static
 */
Object.defineProperty(ShapesCache, 'removeAll', {
    enumerable: false,
    value: function value() {
        for (var id in ShapesCache) {
            ShapesCache.remove(id);
        }
    }
});

// Assign to namespace
exports.default = ShapesCache;

},{"./utils":10}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ShapesCache = require('./ShapesCache');

var _ShapesCache2 = _interopRequireDefault(_ShapesCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The middleware for PIXI's ResourceLoader to be able to 
 * load Flash symbols such as graphics and images.
 * @namespace PIXI.animate
 * @class SymbolLoader
 */
var SymbolLoader = function SymbolLoader() {
    return function (resource, next) {
        var url = resource.url;
        var data = resource.data;

        if (url.search(/\.shapes\.(json|txt)$/i) > -1) {
            _ShapesCache2.default.add(resource.name, data);
        } else if (data.nodeName && data.nodeName === 'IMG') {
            // Add individual images to the texture cache by their
            // short symbol name, not the URL
            PIXI.Texture.addTextureToCache(PIXI.Texture.fromFrame(url), resource.name);
        }
        next();
    };
};

// Assign to the loader
PIXI.loaders.Loader.addPixiMiddleware(SymbolLoader);

exports.default = SymbolLoader;

},{"./ShapesCache":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Tween = require('./Tween');

var _Tween2 = _interopRequireDefault(_Tween);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Timeline class represents a
 * @namespace PIXI.animate
 * @class Timeline
 * @param {PIXI.DisplayObject} Target The target for this string of tweens.
 * @extends Array
 * @constructor
 */
var Timeline = function Timeline(target) {
    Array.call(this);

    /**
     * The target DisplayObject.
     * @property {PIXI.DisplayObject} target
     */
    this.target = target;

    /**
     * Current properties in the tween, to make building the timeline more
     * efficient.
     * @property {Object} _currentProps
     * @private
     */
    this._currentProps = {};
};

var p = Timeline.prototype = Object.create(Array.prototype);

/**
 * Adds one or more tweens (or timelines) to this timeline. The tweens will be paused (to remove them from the normal ticking system)
 * and managed by this timeline. Adding a tween to multiple timelines will result in unexpected behaviour.
 * @method addTween
 * @param tween The tween(s) to add. Accepts multiple arguments.
 * @return Tween The first tween that was passed in.
 */
p.addTween = function (properties, startFrame, duration, ease) {
    this.extendLastFrame(startFrame - 1);
    //ownership of startProps is passed to the new Tween - this object should not be reused
    var startProps = {};
    var prop = void 0;
    //figure out what the starting values for this tween should be
    for (prop in properties) {
        //if we have already set that property in an earlier tween, use the ending value
        if (this._currentProps.hasOwnProperty(prop)) {
            startProps[prop] = this._currentProps[prop];
        }
        //otherwise, get the current value
        else {
                var startValue = startProps[prop] = this.getPropFromShorthand(prop);
                //go through previous tweens to set the value so that when the timeline loops
                //around, the values are set properly - having each tween know what came before
                //allows us to set to a specific frame without running through the entire timeline
                for (var i = this.length - 1; i >= 0; --i) {
                    this[i].startProps[prop] = startValue;
                    this[i].endProps[prop] = startValue;
                }
            }
    }
    //create the new Tween and add it to the list
    var tween = new _Tween2.default(this.target, startProps, properties, startFrame, duration, ease);
    this.push(tween);
    //update starting values for the next tween - if tweened values included 'p', then Tween
    //parsed that to add additional data that is required
    Object.assign(this._currentProps, tween.endProps);
};

/**
 * Add a single keyframe that doesn't tween.
 * @method addKeyframe
 * @param {Object} properties The properties to set.
 * @param {int} startFrame The starting frame index.
 */
p.addKeyframe = function (properties, startFrame) {
    this.extendLastFrame(startFrame - 1);
    var startProps = Object.assign({}, this._currentProps, properties);
    //create the new Tween and add it to the list
    var tween = new _Tween2.default(this.target, startProps, null, startFrame, 0);
    this.push(tween);
    Object.assign(this._currentProps, tween.endProps);
};

/**
 * Extend the last frame of the tween.
 * @method extendLastFrame
 * @param {int} endFrame The ending frame index.
 */
p.extendLastFrame = function (endFrame) {
    if (this.length) {
        var prevTween = this[this.length - 1];
        if (prevTween.endFrame < endFrame) {
            if (prevTween.isTweenlessFrame) {
                prevTween.endFrame = endFrame;
            } else {
                this.addKeyframe(this._currentProps, prevTween.endFrame + 1, endFrame - prevTween.endFrame + 1);
            }
        }
    }
};

/**
 * Get the value for a property
 * @method getPropFromShorthand
 * @param {string} prop
 */
p.getPropFromShorthand = function (prop) {
    var target = this.target;
    switch (prop) {
        case 'x':
            return target.position.x;
        case 'y':
            return target.position.y;
        case 'sx':
            return target.scale.x;
        case 'sy':
            return target.scale.y;
        case 'kx':
            return target.skew.x;
        case 'ky':
            return target.skew.y;
        case 'r':
            return target.rotation;
        case 'a':
            return target.alpha;
        case 'v':
            return target.visible;
        case 'm':
            return target.mask;
        // case 't':
        //   return target.tint;
        //not sure if we'll actually handle graphics this way?
        //g: return null;
    }
    return null;
};

// Assign to namespace
exports.default = Timeline;

},{"./Tween":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Provide timeline playback of movieclip
 * @namespace PIXI.animate
 * @class Tween
 * @constructor
 * @param {PIXI.animate.MovieClip} target The target to play
 * @param {Object} startProps The starting properties
 * @param {Object} endProps The ending properties
 * @param {int} duration Number oframes to tween
 * @param {Function} [ease] Ease function to use
 */

var Tween = function () {
    function Tween(target, startProps, endProps, startFrame, duration, ease) {
        _classCallCheck(this, Tween);

        /**
         * target display object
         * @property {Object} target
         */
        this.target = target;

        /** 
         * properties at the start of the tween
         * @property {Object} startProps
         */
        this.startProps = startProps;

        /**
         * properties at the end of the tween, as well as any properties that are set
         * instead of tweened
         * @property {Object} endProps
         */
        this.endProps = {};

        /**
         * duration of tween in frames. For a keyframe with no tweening, the duration will be 0.
         * @property {int} duration
         */
        this.duration = duration;

        /**
         * The frame that the tween starts on
         * @property {int} startFrame
         */
        this.startFrame = startFrame;

        /**
         * the frame that the tween ends on
         * @property {int} endFrame
         */
        this.endFrame = startFrame + duration;

        /**
         * easing function to use, if any
         * @property {Function} ease
         */
        this.ease = ease;

        /**
         * If we don't tween.
         * @property {Boolean} isTweenlessFrame
         */
        this.isTweenlessFrame = !endProps;

        var prop = void 0;
        if (endProps) {
            //make a copy to safely include any unchanged values from the start of the tween
            for (prop in endProps) {
                this.endProps[prop] = endProps[prop];
            }
        }

        //copy in any starting properties don't change
        for (prop in startProps) {
            if (!this.endProps.hasOwnProperty(prop)) {
                this.endProps[prop] = startProps[prop];
            }
        }
    }

    /**
     * Set the current frame.
     * @method setPosition
     * @param {int} currentFrame
     */


    _createClass(Tween, [{
        key: "setPosition",
        value: function setPosition(currentFrame) {
            //if this is a single frame with no tweening, or at the end of the tween, then
            //just speed up the process by setting values
            if (currentFrame >= this.endFrame) {
                this.setToEnd();
                return;
            }

            if (this.isTweenlessFrame) {
                this.setToEnd();
                return;
            }

            var time = (currentFrame - this.startFrame) / this.duration;
            if (this.ease) {
                time = this.ease(time);
            }
            var target = this.target;
            var startProps = this.startProps;
            var endProps = this.endProps;
            for (var _prop in endProps) {
                var lerp = props[_prop];
                if (lerp) {
                    setPropFromShorthand(target, _prop, lerp(startProps[_prop], endProps[_prop], time));
                } else {
                    setPropFromShorthand(target, _prop, startProps[_prop]);
                }
            }
        }

        /**
         * Set to the end position
         * @method setToEnd
         */

    }, {
        key: "setToEnd",
        value: function setToEnd() {
            var endProps = this.endProps;
            var target = this.target;
            for (var _prop2 in endProps) {
                setPropFromShorthand(target, _prop2, endProps[_prop2]);
            }
        }
    }]);

    return Tween;
}();

//standard tweening


function lerpValue(start, end, t) {
    return start + (end - start) * t;
}

var props = {
    //position
    x: lerpValue,
    y: lerpValue,
    //scale
    sx: lerpValue,
    sy: lerpValue,
    //skew
    kx: lerpValue,
    ky: lerpValue,
    //rotation
    r: lerpRotation,
    //alpha
    a: lerpValue,
    //tinting
    // t: lerpColor,
    t: null,
    //values to be set
    v: null, //visible
    c: null, //colorTransform
    m: null, //mask
    g: null //not sure if we'll actually handle graphics this way?
};

//split r, g, b into separate values for tweening
/*function lerpColor(start, end, t)
{
    //split start color into components
    let sR = start >> 16 & 0xFF;
    let sG = start >> 8 & 0xFF;
    let sB = start & 0xFF;
    //split end color into components
    let eR = end >> 16 & 0xFF;
    let eG = end >> 8 & 0xFF;
    let eB = end & 0xFF;
    //lerp red
    let r = sR + (eR - sR) * percent;
    //clamp red to valid values
    if (r < 0)
        r = 0;
    else if (r > 255)
        r = 255;
    //lerp green
    let g = sG + (eG - sG) * percent;
    //clamp green to valid values
    if (g < 0)
        g = 0;
    else if (g > 255)
        g = 255;
    //lerp blue
    let b = sB + (eB - sB) * percent;
    //clamp blue to valid values
    if (b < 0)
        b = 0;
    else if (b > 255)
        b = 255;

    let combined = (r << 16) | (g << 8) | b;
    return combined;
}*/

var PI = Math.PI;
var TWO_PI = PI * 2;

//handle 355 -> 5 degrees only going through a 10 degree change instead of
//the long way around
//Math from http://stackoverflow.com/a/2708740
function lerpRotation(start, end, t) {
    var difference = Math.abs(end - start);
    if (difference > PI) {
        // We need to add on to one of the values.
        if (end > start) {
            // We'll add it on to start...
            start += TWO_PI;
        } else {
            // Add it on to end.
            end += PI + TWO_PI;
        }
    }

    // Interpolate it.
    var value = start + (end - start) * t;

    // wrap to 0-2PI
    /*if (value >= 0 && value <= TWO_PI)
        return value;
    return value % TWO_PI;*/

    //just return, as it's faster
    return value;
}

function setPropFromShorthand(target, prop, value) {
    switch (prop) {
        case "x":
            target.position.x = value;
            break;
        case "y":
            target.position.y = value;
            break;
        case "sx":
            target.scale.x = value;
            break;
        case "sy":
            target.scale.y = value;
            break;
        case "kx":
            target.skew.x = value;
            break;
        case "ky":
            target.skew.y = value;
            break;
        case "r":
            target.rotation = value;
            break;
        case "a":
            target.alpha = value;
            break;
        case "t":
            target.i(value); // i = setTint
            break;
        case "c":
            target.c.apply(target, value); // c = setColorTransform
            break;
        case "v":
            target.visible = value;
            break;
        case "m":
            target.ma(value);
            break;
    }
}

// Assign to namespace
exports.default = Tween;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _load = require('./load');

var _load2 = _interopRequireDefault(_load);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _MovieClip = require('./MovieClip');

var _MovieClip2 = _interopRequireDefault(_MovieClip);

var _ShapesCache = require('./ShapesCache');

var _ShapesCache2 = _interopRequireDefault(_ShapesCache);

var _SymbolLoader = require('./SymbolLoader');

var _SymbolLoader2 = _interopRequireDefault(_SymbolLoader);

var _Timeline = require('./Timeline');

var _Timeline2 = _interopRequireDefault(_Timeline);

var _Tween = require('./Tween');

var _Tween2 = _interopRequireDefault(_Tween);

var _Animator = require('./Animator');

var _Animator2 = _interopRequireDefault(_Animator);

var _AnimatorTimeline = require('./AnimatorTimeline');

var _AnimatorTimeline2 = _interopRequireDefault(_AnimatorTimeline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    Animator: _Animator2.default,
    AnimatorTimeline: _AnimatorTimeline2.default,
    load: _load2.default,
    utils: _utils2.default,
    MovieClip: _MovieClip2.default,
    ShapesCache: _ShapesCache2.default,
    SymbolLoader: _SymbolLoader2.default,
    Timeline: _Timeline2.default,
    Tween: _Tween2.default
};

},{"./Animator":1,"./AnimatorTimeline":2,"./MovieClip":3,"./ShapesCache":4,"./SymbolLoader":5,"./Timeline":6,"./Tween":7,"./load":9,"./utils":10}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @namespace PIXI.animate
 * @class load
 * @description Entry point for loading Adobe Animate exports:
 * 
 * **Load and auto-add to parent**
 * ```
 * let renderer = new PIXI.autoDetectRenderer(1280, 720);
 * let stage = new PIXI.Container();
 * PIXI.animate.load(lib.MyStage, stage);
 * function update() {
 *      renderer.render(stage);
 *      update();
 * }
 * update();
 * ```
 * **Load and handle with callback**
 * ```
 * let renderer = new PIXI.autoDetectRenderer(1280, 720);
 * let stage = new PIXI.Container();
 * PIXI.animate.load(lib.MyStage, function(instance){
 *     stage.addChild(instance);
 * });
 * function update() {
 *      renderer.render(stage);
 *      update();
 * }
 * update();
 * ```
 */
/**
 * Load the stage class and preload any assets
 * @method load
 * @param {Object} options Options for loading.
 * @param {Function} options.stage Reference to the stage class
 * @param {Object} [options.stage.assets] Assets used to preload
 * @param {PIXI.Container} options.parent The Container to auto-add the stage to.
 * @param {String} [options.basePath] Base root directory
 */
/**
 * Load the stage class and preload any assets
 * @method load
 * @param {Function} StageRef Reference to the stage class.
 * @param {Object} [StageRef.assets] Assets used to preload.
 * @param {Function} complete The callback function when complete.
 */
/**
 * Load the stage class and preload any assets
 * @method load
 * @param {Function} StageRef Reference to the stage class.
 * @param {Object} [StageRef.assets] Assets used to preload.
 * @param {PIXI.Container} parent The Container to auto-add the stage to.
 */
var load = function load(options, parent, complete, basePath) {

    // Support arguments (ref, complete, basePath)
    if (typeof parent === "function") {
        basePath = complete;
        complete = parent;
        parent = null;
    } else {
        if (typeof complete === "string") {
            basePath = complete;
            complete = null;
        }
    }

    if (typeof options === "function") {
        options = {
            stage: options,
            parent: parent,
            basePath: basePath || "",
            complete: complete
        };
    }

    options = Object.assign({
        stage: null,
        parent: null,
        basePath: '',
        complete: null
    }, options || {});

    var loader = new PIXI.loaders.Loader();

    function done() {
        var instance = new options.stage();
        if (options.parent) {
            options.parent.addChild(instance);
        }
        if (options.complete) {
            options.complete(instance);
        }
    }

    // Check for assets to preload
    var assets = options.stage.assets || {};
    if (assets && Object.keys(assets).length) {
        // assetBaseDir can accept either with trailing slash or not
        var _basePath = options.basePath;
        if (_basePath) {
            _basePath += "/";
        }
        for (var id in assets) {
            loader.add(id, _basePath + assets[id]);
        }
        loader.once('complete', done).load();
    } else {
        // tiny case where there's only text and no shapes/animations
        done();
    }
};

exports.default = load;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// If the movieclip plugin is installed
var _prepare = null;

/**
 * @namespace PIXI.animate
 * @class utils
 * @private
 * @description For keyframe conversions
 */

var AnimateUtils = function () {
    function AnimateUtils() {
        _classCallCheck(this, AnimateUtils);
    }

    _createClass(AnimateUtils, null, [{
        key: 'hexToUint',


        /**
         * Convert the Hexidecimal string (e.g., "#fff") to uint
         * @static
         * @method hexToUint
         */
        value: function hexToUint(hex) {
            // Remove the hash
            hex = hex.substr(1);

            // Convert shortcolors fc9 to ffcc99
            if (hex.length === 3) {
                hex = hex.replace(/([a-f0-9])/g, '$1$1');
            }
            return parseInt(hex, 16);
        }

        /** 
         * Fill frames with booleans of true (showing) and false (hidden).
         * @static
         * @method fillFrames
         * @param {Array<Boolean>} timeline
         * @param {int} startFrame The start frame when the timeline shows up
         * @param {int} duration The length of showing
         */

    }, {
        key: 'fillFrames',
        value: function fillFrames(timeline, startFrame, duration) {
            //ensure that the timeline is long enough
            var oldLength = timeline.length;
            if (oldLength < startFrame + duration) {
                timeline.length = startFrame + duration;
                //fill any gaps with false to denote that the child should be removed for a bit
                if (oldLength < startFrame) {
                    //if the browser has implemented the ES6 fill() function, use that
                    if (timeline.fill) {
                        timeline.fill(false, oldLength, startFrame);
                    } else {
                        //if we can't use fill, then do a for loop to fill it
                        for (var i = oldLength; i < startFrame; ++i) {
                            timeline[i] = false;
                        }
                    }
                }
            }
            //if the browser has implemented the ES6 fill() function, use that
            if (timeline.fill) {
                timeline.fill(true, startFrame, startFrame + duration);
            } else {
                var length = timeline.length;
                //if we can't use fill, then do a for loop to fill it
                for (var _i = startFrame; _i < length; ++_i) {
                    timeline[_i] = true;
                }
            }
        }

        /**
         * Convert serialized array into keyframes
         * `"0x100y100 1x150"` to: `{ "0": {"x":100, "y": 100}, "1": {"x": 150} }`
         * @static
         * @method deserializeKeyframes
         * @param {String} keyframes
         * @param {Object} Resulting keyframes
         */

    }, {
        key: 'deserializeKeyframes',
        value: function deserializeKeyframes(keyframes) {
            var result = {};
            var i = 0;
            var keysMap = {
                X: 'x', // x position
                Y: 'y', // y position
                A: 'sx', // scale x
                B: 'sy', // scale y
                C: 'kx', // skew x
                D: 'ky', // skew y
                R: 'r', // rotation
                L: 'a', // alpha
                T: 't', // tint
                F: 'c', // colorTransform
                V: 'v' // visibility
            };
            var c = void 0,
                buffer = '',
                isFrameStarted = false,
                prop = void 0,
                frame = {};

            while (i <= keyframes.length) {
                c = keyframes[i];
                if (keysMap[c]) {
                    if (!isFrameStarted) {
                        isFrameStarted = true;
                        result[buffer] = frame;
                    }
                    if (prop) {
                        frame[prop] = this.parseValue(prop, buffer);
                    }
                    prop = keysMap[c];
                    buffer = '';
                    i++;
                }
                // Start a new prop
                else if (!c || c === ' ') {
                        i++;
                        frame[prop] = this.parseValue(prop, buffer);
                        buffer = '';
                        prop = null;
                        frame = {};
                        isFrameStarted = false;
                    } else {
                        buffer += c;
                        i++;
                    }
            }
            return result;
        }

        /**
         * Convert serialized shapes into draw commands for PIXI.Graphics.
         * @static
         * @method deserializeShapes
         * @param {String} str
         * @param {Array} Resulting shapes map
         */

    }, {
        key: 'deserializeShapes',
        value: function deserializeShapes(str) {
            var result = [];
            // each shape is a new line
            var shapes = str.split("\n");
            var isCommand = /^[a-z]{1,2}$/;
            for (var i = 0; i < shapes.length; i++) {
                var shape = shapes[i].split(' '); // arguments are space separated
                for (var j = 0; j < shape.length; j++) {
                    // Convert all numbers to floats, ignore colors
                    var arg = shape[j];
                    if (arg[0] !== '#' && !isCommand.test(arg)) {
                        shape[j] = parseFloat(arg);
                    }
                }
                result.push(shape);
            }
            return result;
        }

        /** 
         * Parse the value of the compressed keyframe.
         * @method parseValue
         * @static
         * @private
         * @param {String} prop The property key
         * @param {String} buffer The contents
         * @return {*} The parsed value
         */

    }, {
        key: 'parseValue',
        value: function parseValue(prop, buffer) {
            switch (prop) {
                // Color transforms are parsed as an array
                case 'c':
                    {
                        buffer = buffer.split(',');
                        buffer.forEach(function (val, i, buffer) {
                            buffer[i] = parseFloat(val);
                        });
                        return buffer;
                    }
                // Tint value should not be converted
                // can be color uint or string
                case 't':
                    {
                        return buffer;
                    }
                // The visiblity parse as boolean
                case 'v':
                    {
                        return !!parseInt(buffer);
                    }
                // Everything else parse a floats
                default:
                    {
                        return parseFloat(buffer);
                    }
            }
        }

        /** 
         * Upload all the textures and graphics to the GPU. 
         * @method upload
         * @static
         * @param {PIXI.WebGLRenderer} renderer Render to upload to
         * @param {PIXI.DisplayObject} clip MovieClip to upload
         * @param {function} done When complete
         */

    }, {
        key: 'upload',
        value: function upload(renderer, displayObject, done) {
            if (!_prepare) {
                _prepare = renderer.plugins.prepare;
                _prepare.register(this.addMovieClips);
            }
            _prepare.upload(displayObject, done);
        }

        /**
         * Add movie clips to the upload prepare.
         * @method addMovieClips
         * @static
         * @private
         * @param {*} item To add to the queue 
         */

    }, {
        key: 'addMovieClips',
        value: function addMovieClips(item) {
            if (item instanceof PIXI.animate.MovieClip) {
                item._timedChildTimelines.forEach(function (timeline) {
                    var index = item.children.indexOf(timeline.target);
                    if (index === -1) {
                        _prepare.add(timeline.target);
                    }
                });
                return true;
            }
            return false;
        }
    }]);

    return AnimateUtils;
}();

exports.default = AnimateUtils;

},{}],11:[function(require,module,exports){
"use strict";

/**
 * @class Container
 * @namespace PIXI
 */
var p = PIXI.Container.prototype;

/**
 * Shortcut for addChild.
 * @method ac
 * @param {*} [child*] N-number of children
 * @return {PIXI.DisplayObject} Instance of first child added
 */
p.ac = p.addChild;

/**
 * Extend a container
 * @method extend
 * @static
 * @param {PIXI.Container} child The child function
 * @return {PIXI.Container} THe child
 */
/**
 * Extend a container (shortcut for extend)
 * @method e
 * @static
 * @param {PIXI.Container} child The child function
 * @return {PIXI.Container} THe child
 */
PIXI.Container.extend = PIXI.Container.e = function (child) {
  child.prototype = Object.create(p);
  child.prototype.__parent = p;
  child.prototype.constructor = child;
  return child;
};

},{}],12:[function(require,module,exports){
"use strict";

var _utils = require("../animate/utils");

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @namespace PIXI
 * @class DisplayObject
 */
var p = PIXI.DisplayObject.prototype;

// Color Matrix filter
var ColorMatrixFilter = void 0;
if (PIXI.filters) {
  ColorMatrixFilter = PIXI.filters.ColorMatrixFilter;
}

/**
 * Function to see if this is renderable or not. Useful for setting masks.
 * @method setRenderable
 * @param  {Boolean} [renderable=false] Make renderable
 * @return {PIXI.DisplayObject}
 */
/**
 * Shortcut to setRenderable.
 * @method re
 * @param  {Boolean} [renderable=false] Make renderable
 * @return {PIXI.DisplayObject}
 */
p.setRenderable = p.re = function (renderable) {
  this.renderable = !!renderable;
  return this;
};

/**
 * Shortcut for setTransform.
 * @method tr
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @param {Number} scaleX The X Scale value
 * @param {Number} scaleY The Y Scale value
 * @param {Number} skewX The X skew value
 * @param {Number} skewY The Y skew value
 * @param {Number} pivotX The X pivot value
 * @param {Number} pivotY The Y pivot value
 * @return {PIXI.DisplayObject} Instance for chaining
 */
p.t = p.setTransform;

/**
 * Setter for mask to be able to chain.
 * @method setMask
 * @param {PIXI.Graphics} mask The mask shape to use
 * @return {PIXI.DisplayObject} Instance for chaining
 */
/**
 * Shortcut for setMask.
 * @method ma
 * @param {PIXI.Sprite|PIXI.Graphics} mask The mask shape to use
 * @return {PIXI.DisplayObject} Instance for chaining
 */
p.setMask = p.ma = function (mask) {
  // According to PIXI, only Graphics and Sprites can
  // be used as mask, let's ignore everything else, like other
  // movieclips and displayobjects/containers
  if (mask) {
    if (!(mask instanceof PIXI.Graphics) && !(mask instanceof PIXI.Sprite)) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Warning: Masks can only be PIXI.Graphics or PIXI.Sprite objects.");
      }
      return;
    }
  }
  this.mask = mask;
  return this;
};

/**
 * Setter for the alpha
 * @method setAlpha
 * @param {Number} alpha The alpha amount to use, from 0 to 1
 * @return {PIXI.DisplayObject} Instance for chaining
 */
/**
 * Shortcut for setAlpha.
 * @method a
 * @param {Number} alpha The alpha amount to use, from 0 to 1
 * @return {PIXI.DisplayObject} Instance for chaining
 */
p.setAlpha = p.a = function (alpha) {
  this.alpha = alpha;
  return this;
};

/**
 * Set the tint values by color.
 * @method setTint
 * @param {int} tint The color value to tint
 * @return {PIXI.DisplayObject} Object for chaining
 */
/**
 * Shortcut to setTint.
 * @method tn
 * @param {Number|String} tint The red percentage value
 * @return {PIXI.DisplayObject} Object for chaining
 */
p.setTint = p.i = function (tint) {
  if (typeof tint === "string") {
    tint = _utils2.default.hexToUint(tint);
  }
  // this.tint = tint
  // return this;
  // TODO: Replace with DisplayObject.tint setter
  // once the functionality is added to Pixi.js, for
  // now we'll use the slower ColorMatrixFilter to handle
  // the color transformation
  var r = tint >> 16 & 0xFF;
  var g = tint >> 8 & 0xFF;
  var b = tint & 0xFF;
  return this.c(r / 255, 0, g / 255, 0, b / 255, 0);
};

/**
 * Set additive and multiply color, tinting
 * @method setColorTransform
 * @param {Number} r The multiply red value
 * @param {Number} rA The additive red value
 * @param {Number} g The multiply green value
 * @param {Number} gA The additive green value
 * @param {Number} b The multiply blue value
 * @param {Number} bA The additive blue value
 * @return {PIXI.DisplayObject} Object for chaining
 */
/**
 * Shortcut to setColor.
 * @method c
 * @param {Number} r The multiply red value
 * @param {Number} rA The additive red value
 * @param {Number} g The multiply green value
 * @param {Number} gA The additive green value
 * @param {Number} b The multiply blue value
 * @param {Number} bA The additive blue value
 * @return {PIXI.DisplayObject} Object for chaining
 */
p.setColorTransform = p.c = function (r, rA, g, gA, b, bA) {
  var filter = this.colorTransformFilter;
  filter.matrix[0] = r;
  filter.matrix[4] = rA;
  filter.matrix[6] = g;
  filter.matrix[9] = gA;
  filter.matrix[12] = b;
  filter.matrix[14] = bA;
  this.filters = [filter];
  return this;
};

/**
 * The current default color transforming filters
 * @property {PIXI.filters.ColorMatrixFilter} colorTransformFilter
 */
if (!p.hasOwnProperty('colorTransformFilter')) {
  Object.defineProperty(p, 'colorTransformFilter', {
    set: function set(filter) {
      this._colorTransformFilter = filter;
    },
    get: function get() {
      return this._colorTransformFilter || new ColorMatrixFilter();
    }
  });
}

/**
 * Extend a container
 * @method extend
 * @static
 * @param {PIXI.DisplayObject} child The child function
 * @return {PIXI.DisplayObject} THe child
 */
/**
 * Extend a container (shortcut for extend)
 * @method e
 * @static
 * @param {PIXI.DisplayObject} child The child function
 * @return {PIXI.DisplayObject} THe child
 */
PIXI.DisplayObject.extend = PIXI.DisplayObject.e = function (child) {
  child.prototype = Object.create(p);
  child.prototype.__parent = p;
  child.prototype.constructor = child;
  return child;
};

},{"../animate/utils":10}],13:[function(require,module,exports){
"use strict";

/**
 * @namespace PIXI
 * @class Graphics
 */
var p = PIXI.Graphics.prototype;

/**
 * Shortcut for drawCommands.
 * @method d
 * @param  {Array} commands The commands and parameters to draw
 * @return {PIXI.Graphics}
 */
/**
 * Execute a series of commands, this is the name of the short function
 * followed by the parameters, e.g., `["f", "#ff0000", "r", 0, 0, 100, 200]`
 * @method drawCommands
 * @param  {Array} commands The commands and parameters to draw
 * @return {PIXI.Graphics}
 */
p.drawCommands = p.d = function (commands) {
  var currentCommand,
      params = [],
      i = 0;

  while (i <= commands.length) {
    var item = commands[i++];
    if (item === undefined || this[item]) {
      if (currentCommand) {
        this[currentCommand].apply(this, params);
        params.length = 0;
      }
      currentCommand = item;
    } else {
      params.push(item);
    }
  }
  return this;
};

/**
 * Closes the current path, effectively drawing a line from the current drawing point to the first drawing point specified
 * since the fill or stroke was last set.
 * @method c
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.c = p.closePath;

/**
 * Alias for addHole
 * @method h
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.h = p.addHole;

/**
 * Shortcut to moveTo.
 * @method m
 * @param {Number} x The x coordinate the drawing point should move to.
 * @param {Number} y The y coordinate the drawing point should move to.
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls).
 **/
p.m = p.moveTo;

/**
 * Shortcut to lineTo.
 * @method l
 * @param {Number} x The x coordinate the drawing point should draw to.
 * @param {Number} y The y coordinate the drawing point should draw to.
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.l = p.lineTo;

/**
 * Draws a quadratic curve from the current drawing point to (x, y) using the control point (cpx, cpy). For detailed
 * information, read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-quadraticcurveto">
 * whatwg spec</a>. A tiny API method "qt" also exists.
 * @method q
 * @param {Number} cpx
 * @param {Number} cpy
 * @param {Number} x
 * @param {Number} y
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.q = p.quadraticCurveTo;

/**
 * Shortcut to bezierCurveTo.
 * @method b
 * @param {Number} cp1x
 * @param {Number} cp1y
 * @param {Number} cp2x
 * @param {Number} cp2y
 * @param {Number} x
 * @param {Number} y
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.b = p.bezierCurveTo;

/**
 * Shortcut to beginFill.
 * @method f
 * @param {Uint} color The hex color value (e.g. 0xFFFFFF)
 * null will result in no fill.
 * @param {Number} [alpha=1] The alpha value of fill
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.f = p.beginFill;

/**
 * Shortcut to lineStyle.
 * @method s
 * @param {String} color A CSS compatible color value (ex. "#FF0000", "red", or "rgba(255,0,0,0.5)"). Setting to
 * null will result in no stroke.
 * @param {Number} [thickness=1] The thickness of the stroke
 * @param {Number} [alpha=1] The alpha value from 0 (invisibile) to 1 (visible)
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.s = p.lineStyle;

/**
 * Shortcut to drawRect.
 * @method dr
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w Width of the rectangle
 * @param {Number} h Height of the rectangle
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
/**
 * Shortcut to drawRect.
 * @method r
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w Width of the rectangle
 * @param {Number} h Height of the rectangle
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.dr = p.drawRect;

/**
 * Shortcut to drawRoundedRect.
 * @method rr
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w Width of the rectangle
 * @param {Number} h Height of the rectangle
 * @param {Number} radius The corner radius
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.rr = p.drawRoundedRect;

/**
 * Shortcut to drawRoundedRect.
 * @method rc
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w Width of the rectangle
 * @param {Number} h Height of the rectangle
 * @param {Number} radiusTL The top left corner radius
 * @param {Number} radiusTR The top right corner radius
 * @param {Number} radiusBR The bottom right corner radius
 * @param {Number} radiusBL The bottom left corner radius
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.rc = p.drawRoundedRect;

/**
 * Shortcut to drawCircle.
 * @method dc
 * @param {Number} x x coordinate center point of circle.
 * @param {Number} y y coordinate center point of circle.
 * @param {Number} radius Radius of circle.
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.dc = p.drawCircle;

/**
 * Shortcut to arc.
 * @method ac
 * @param {Number} x
 * @param {Number} y
 * @param {Number} radius
 * @param {Number} startAngle Measured in radians.
 * @param {Number} endAngle Measured in radians.
 * @param {Boolean} anticlockwise
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.ar = p.arc;

/**
 * Shortcut to arcTo.
 * @method at
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} radius
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.at = p.arcTo;

/**
 * Shortcut to drawEllipse.
 * @method  de
 * @param  {Number} x      [description]
 * @param  {Number} y      [description]
 * @param  {Number} width  [description]
 * @param  {Number} height [description]
 */
p.de = p.drawEllipse;

/**
 * Placeholder method for a linear fill. Pixi does not support linear fills,
 * so we just pick the first color in colorArray
 * @method lf
 * @param {Array} colorArray An array of CSS compatible color values @see `f`
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.lf = function (colorArray) {
  console.warn("Linear gradient fills are not supported");
  return this.f(colorArray[0]);
};

/**
 * Placeholder method for a radial fill. Pixi does not support radial fills,
 * so we just pick the first color in colorArray
 * @method rf
 * @param {Array} colorArray An array of CSS compatible color values @see `f`
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.rf = function (colorArray) {
  console.warn("Radial gradient fills are not supported");
  return this.f(colorArray[0]);
};

/**
 * Placeholder method for a beginBitmapFill. Pixi does not support bitmap fills.
 * @method bf
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.bf = function () {
  console.warn("Bitmap fills are not supported");
  return this.f(0x0);
};

/**
 * Placeholder method for a setStrokeDash. Pixi does not support dashed strokes.
 * @method sd
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.sd = function () {
  console.warn("Dashed strokes are not supported");
  return this;
};

/**
 * Placeholder method for a beginBitmapStroke. Pixi does not support bitmap strokes.
 * @method bs
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.bs = function () {
  console.warn("Bitmap strokes are not supported");
  return this;
};

/**
 * Placeholder method for a beginLinearGradientStroke. Pixi does not support gradient strokes.
 * @method ls
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.ls = function () {
  console.warn("Linear gradient strokes are not supported");
  return this;
};

/**
 * Placeholder method for a beginRadialGradientStroke. Pixi does not support gradient strokes.
 * @method rs
 * @return {PIXI.Graphics} The Graphics instance the method is called on (useful for chaining calls.)
 **/
p.rs = function () {
  console.warn("Radial gradient strokes are not supported");
  return this;
};

},{}],14:[function(require,module,exports){
"use strict";

/**
 * @namespace PIXI
 * @class Sprite
 */
var p = PIXI.Sprite.prototype;

/**
 * Extend a container
 * @method extend
 * @static
 * @param {PIXI.Sprite} child The child function
 * @return {PIXI.Sprite} THe child
 */
/**
 * Extend a container (shortcut for extend)
 * @method e
 * @static
 * @param {PIXI.Sprite} child The child function
 * @return {PIXI.Sprite} THe child
 */
PIXI.Sprite.extend = PIXI.Sprite.e = function (child) {
  child.prototype = Object.create(p);
  child.prototype.__parent = p;
  child.prototype.constructor = child;
  return child;
};

},{}],15:[function(require,module,exports){
"use strict";

/**
 * @namespace PIXI
 * @class Text
 */
var p = PIXI.Text.prototype;

/**
 * Setter for the alignment, also sets the anchor point
 * to make sure the positioning is correct.
 * @method setAlign
 * @param {String} align Either, center, right, left
 * @return {PIXI.Text} For chaining
 */
/**
 * Shortcut for `setAlign`.
 * @method g
 * @param {String|int} align Either, center (0), right (1), left (-1)
 * @return {PIXI.Text} For chaining
 */
p.setAlign = p.g = function (align) {
    this.style.align = align || "left";
    var x;
    if (typeof align == "string") {
        switch (align) {
            case "center":
                x = 0.5;
                break;
            case "right":
                x = 1;
                break;
            case "left":
                x = 0;
                break;
        }
    } else {
        x = (align + 1) / 2;
    }
    this.anchor.x = x;
    return this;
};

// Map of short names to long names
var STYLE_PROPS = {
    o: 'font', // TODO: deprecate in Pixi v4
    z: 'fontSize',
    f: 'fontFamily',
    y: 'fontStyle',
    g: 'fontWeight',
    i: 'fill',
    a: 'align',
    s: 'stroke',
    t: 'strokeThickness',
    w: 'wordWrap',
    d: 'wordWrapWidth',
    l: 'lineHeight',
    h: 'dropShadow',
    c: 'dropShadowColor',
    n: 'dropShadowAngle',
    b: 'dropShadowBlur',
    p: 'padding',
    x: 'textBaseline',
    j: 'lineJoin',
    m: 'miterLimit',
    e: 'letterSpacing'
};

/**
 * Set the style, a chainable version of style setter
 * @method setStyle
 * @param {Object} style
 * @return {PIXI.Text} instance of text field
 */
/**
 * Shortcut for `setStyle`.
 * @method ss
 * @param {Object} style
 * @return {PIXI.Text} instance of text field
 */
p.setStyle = p.ss = function (style) {
    // Replace short STYLE_PROPS with long names
    for (var k in STYLE_PROPS) {
        if (style[k] !== undefined) {
            style[STYLE_PROPS[k]] = style[k];
            delete style[k];
        }
    }
    this.style = style;
    return this;
};

/**
 * Initial setting of the drop shadow.
 * @method setShadow
 * @param {String} [color="#000000"] The color to set
 * @param {Number} [angle=Math.PI/4] The angle of offset, in radians
 * @param {Number} [distance=5] The offset distance
 * @return {PIXI.Text} For chaining
 */
/**
 * Shortcut for setShadow.
 * @method sh
 * @param {String} [color="#000000"] The color to set
 * @param {Number} [angle=Math.PI/4] The angle of offset, in radians
 * @param {Number} [distance=5] The offset distance
 * @return {PIXI.Text} For chaining
 */
p.setShadow = p.sh = function (color, angle, distance) {
    var style = this.style;
    style.dropShadow = true;

    // Convert color to hex string
    if (color !== undefined) {
        color = "#" + color.toString(16);
    }
    style.dropShadowColor = isUndefinedOr(color, style.dropShadowColor);
    style.dropShadowAngle = isUndefinedOr(angle, style.dropShadowAngle);
    style.dropShadowDistance = isUndefinedOr(distance, style.dropShadowDistance);
    return this;
};

/**
 * Check if a value is undefined, fallback to default value
 * @method isUndefinedOr 
 * @private
 * @param {*} value The value to check
 * @param {*} defaultValue The default value if value is undefined
 * @return {*} The either the value or the default value
 */
var isUndefinedOr = function isUndefinedOr(value, defaultValue) {
    return value === undefined ? defaultValue : value;
};

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Container = require('./Container');

var _Container2 = _interopRequireDefault(_Container);

var _DisplayObject = require('./DisplayObject');

var _DisplayObject2 = _interopRequireDefault(_DisplayObject);

var _Sprite = require('./Sprite');

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Graphics = require('./Graphics');

var _Graphics2 = _interopRequireDefault(_Graphics);

var _Text = require('./Text');

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    Container: _Container2.default,
    DisplayObject: _DisplayObject2.default,
    Sprite: _Sprite2.default,
    Graphics: _Graphics2.default,
    Text: _Text2.default
};

},{"./Container":11,"./DisplayObject":12,"./Graphics":13,"./Sprite":14,"./Text":15}],17:[function(require,module,exports){
'use strict';

// Export for Node-compatible environments like Electron
if (typeof module !== 'undefined' && module.exports) {
    // Attempt to require the pixi module
    if (typeof PIXI === 'undefined') {

        // Solution for Atom/Electron to work around
        // the V8 restriction on using unsafe-eval code
        // this solution is taken from the loophole module.
        // under the hood this use's node's vm module.
        if (typeof atom !== "undefined") {
            global.Function = require('loophole').Function;
        }

        // Include the Pixi.js module
        require('./pixi.js');
    }

    // Export the module
    module.exports = require('./animate').default;
}
// If we're in the browser make sure PIXI is available
else if (typeof PIXI === 'undefined') {
        throw "Requires PIXI";
    }

// Include the PIXI mixins
require('./mixins');

// Assign to global namespace
PIXI.animate = require('./animate').default;
PIXI.animate.VERSION = '0.5.6' || '';

},{"./animate":8,"./mixins":16,"./pixi.js":undefined,"./pixi.min.js":undefined,"loophole":undefined}]},{},[17])(17)
});
//# sourceMappingURL=pixi-animate.js.map
