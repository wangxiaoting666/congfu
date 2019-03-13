(function(a) {
	a.fn.jqChart = function(b, d, e) {
		if(typeof b === "object") d = b;
		else if(typeof b === "string") {
			b = b.toLowerCase();
			if(a.fn.jqChart.methods[b]) return a.fn.jqChart.methods[b].call(this, d, e);
			else a.error("Method " + method + " does not exist on jQuery.jqChart")
		}
		var c = this.data("data");
		if(!c) {
			c = new f(this);
			this.data("data", c)
		}
		c._setOptions(d);
		return this
	};
	a.fn.jqChart.methods = {
		chart: function() {
			return this.data("data")
		},
		destroy: function() {
			var a = this.data("data");
			if(a) {
				a.destroy();
				this.removeData("data")
			}
		},
		option: function(b, c) {
			var a = this.data("data");
			if(!a) return;
			if(!c) return a.options[b];
			a.options[b] = c;
			a._setOptions(a.options)
		},
		update: function(c) {
			var b = this.data("data");
			if(!b) return this;
			var d = a.extend(false, {}, b.options, c || {});
			b._setOptions(d)
		},
		todataurl: function(b) {
			var a = this.data("data");
			return !a ? null : a.toDataURL(b)
		},
		highlightdata: function(b) {
			var a = this.data("data");
			a && a.highlightData(b)
		},
		ismouseover: function() {
			var a = this.data("data");
			return a ? a.isMouseOver : false
		}
	};
	a.fn.jqChart.defaults = {
		title: {
			margin: 8,
			font: "22px sans-serif"
		},
		tooltips: {
			disabled: false,
			type: "normal",
			borderColor: "auto",
			snapArea: 25,
			highlighting: true,
			highlightingFillStyle: "rgba(204, 204, 204, 0.5)",
			highlightingStrokeStyle: "rgba(204, 204, 204, 0.5)"
		},
		crosshairs: {
			enabled: false,
			snapToDataPoints: true,
			hLine: {
				visible: true,
				strokeStyle: "red"
			},
			vLine: {
				visible: true,
				strokeStyle: "red"
			}
		},
		globalAlpha: 1,
		shadows: {
			enabled: false,
			shadowColor: "#cccccc",
			shadowBlur: 4,
			shadowOffsetX: 2,
			shadowOffsetY: 2
		}
	};
	a.fn.jqChart.labelFormatter = function(b, c) {
		return !b ? String(c) : a.fn.jqChart.sprintf(b, c)
	};
	a.fn.jqMouseCapture = function(b) {
		var c = a(document);
		this.each(function() {
			var d = a(this),
				e = {};
			d.mousedown(function(h) {
				var f;
				if(b.move) {
					f = function(a) {
						b.move.call(d, a, e)
					};
					c.mousemove(f)
				}
				var a, g = function() {
					b.move && c.unbind("mousemove", f);
					c.unbind("mouseup", a)
				};
				if(b.up) a = function(a) {
					g();
					return b.up.call(d, a, e)
				};
				else a = g;
				c.mouseup(a);
				h.preventDefault();
				return b.down.call(d, h, e)
			})
		});
		return this
	};

	function Gb(a) {
		this.callback = a;
		this.animations = []
	}
	Gb.prototype = {
		begin: function() {
			if(g.use_excanvas) return;
			var a = this.animations;
			if(!a || a.length == 0) return;
			this.stopped = false;
			for(var d = new Date, b = 0; b < a.length; b++) {
				var c = a[b];
				c.begin(d)
			}
			this.animate()
		},
		animate: function() {
			if(this.stopped) return;
			for(var d = this.animations, g = new Date, b = false, c = 0; c < d.length; c++) {
				var e = d[c],
					f = e.animate(g);
				b = b || f
			}
			if(!b) return;
			this.callback();
			Fb(a.proxy(this.animate, this))
		},
		stop: function() {
			this.stopped = true
		},
		clear: function() {
			this.animations = []
		},
		addAnimation: function(a) {
			this.animations.push(a)
		}
	};
	var Fb = function() {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
			return window.setTimeout(function() {
				a()
			}, 25)
		}
	}();

	function Kb(e) {
		var c = e,
			a = false,
			b = false;

		function d() {
			if(a) {
				c();
				Fb(d);
				b = true;
				a = false
			} else b = false
		}
		this.kick = function() {
			a = true;
			!b && d()
		};
		this.end = function(d) {
			var e = c;
			if(!d) return;
			if(!b) d();
			else {
				c = a ? function() {
					e();
					d()
				} : d;
				a = true
			}
		}
	}

	function fb(a, b, c, d, e) {
		if(!a) return;
		this.enabled = !(a.enabled === false);
		this.delayTime = a.delayTime || 0;
		this.duration = a.duration || 2;
		this.from = d;
		this.to = e;
		this.object = b;
		this.option = c
	}
	fb.prototype = {
		begin: function(a) {
			this.startTime = d.addSeconds(a, this.delayTime);
			this.endTime = d.addSeconds(this.startTime, this.duration);
			this.timeDiff = this.endTime.getTime() - this.startTime.getTime();
			this.valueDiff = this.to - this.from;
			this.object[this.option] = this.from;
			this.lastIsSet = false
		},
		animate: function(a) {
			if(a >= this.endTime) {
				if(!this.lastIsSet) {
					this.object[this.option] = this.to;
					this.lastIsSet = true;
					return true
				}
				return false
			}
			if(a > this.startTime) {
				var c = a.getTime() - this.startTime.getTime(),
					b = this.from + this.valueDiff * c / this.timeDiff;
				if(b === this.to) this.lastIsSet = true;
				this.object[this.option] = b
			}
			return true
		}
	};

	function jb(a, b, c, d, e) {
		fb.call(this, a, b, c, d, e)
	}
	jb.prototype = new fb;
	jb.constructor = jb;
	jb.prototype.begin = function(a) {
		this.startTime = d.addSeconds(a, this.delayTime);
		this.endTime = d.addSeconds(this.startTime, this.duration);
		this.object[this.option] = this.from;
		this.lastIsSet = false
	};
	jb.prototype.animate = function(a) {
		if(a >= this.endTime) {
			if(!this.lastIsSet) {
				this.object[this.option] = this.to;
				this.lastIsSet = true;
				return true
			}
			return false
		}
		return true
	};

	function R(a) {
		this.view = a
	}
	R.prototype = {
		canStart: function() {
			return false
		},
		start: function() {},
		keyDown: function() {},
		keyUp: function() {},
		mouseMove: function() {},
		mouseDown: function() {},
		mouseUp: function() {},
		touchStart: function() {},
		touchMove: function() {},
		touchEnd: function() {},
		stop: function() {},
		stopTool: function() {
			this.view.currentTool == this && this.view.setCurrentTool(null)
		}
	};

	function W(a) {
		R.call(this, a)
	}
	W.prototype = new R;
	W.constructor = W;
	W.prototype.mouseDown = function(d) {
		for(var b = this.view.mouseDownTools, a = 0; a < b.length; a++) {
			var c = b[a];
			if(c.canStart(d)) {
				this.view.setCurrentTool(c);
				return
			}
		}
	};
	W.prototype.mouseMove = function(d) {
		for(var b = this.view.mouseMoveTools, a = 0; a < b.length; a++) {
			var c = b[a];
			if(c.canStart(d)) {
				this.view.setCurrentTool(c);
				return
			}
		}
		this.view._processMouseMove(d)
	};
	W.prototype.touchStart = function(d) {
		for(var b = this.view.touchStartTools, a = 0; a < b.length; a++) {
			var c = b[a];
			if(c.canStart(d)) {
				this.view.setCurrentTool(c);
				return
			}
		}
		this.view._processTouchStart(d)
	};
	W.prototype.touchMove = function(d) {
		for(var b = this.view.touchMoveTools, a = 0; a < b.length; a++) {
			var c = b[a];
			if(c.canStart(d)) {
				this.view.setCurrentTool(c);
				return
			}
		}
		this.view._processTouchMove(d)
	};

	function g(a) {
		if(!a) return;
		this.shapes = [];
		this.mouseDownTools = [];
		this.mouseMoveTools = [];
		this.touchStartTools = [];
		this.touchMoveTools = [];
		this.defaultTool = new W(this);
		this.currentTool = this.defaultTool;
		this._createElements(a)
	}
	g.support_canvas = function() {
		return !!document.createElement("canvas").getContext
	};
	g.use_excanvas = a.browser.msie && !g.support_canvas() ? true : false;
	g.isTouchDevice = !!("ontouchstart" in window);
	g.isGestureDevice = !!("ongesturestart" in window);
	g.prototype = {
		_createElements: function(c) {
			this.elem = c;
			var b = this;
			c.mouseenter(function(a) {
				b._mouseEnter(a)
			});
			c.mouseleave(function(a) {
				b._mouseLeave(a)
			});
			c.jqMouseCapture({
				down: a.proxy(b._mouseDown, this),
				move: a.proxy(b._mouseMove, this),
				up: a.proxy(b._mouseUp, this)
			});
			c.mousemove(function(a) {
				!b.isMouseDown && b._mouseMove(a)
			});
			c.keydown(function(a) {
				b._keyDown(a)
			});
			c.keyup(function(a) {
				b._keyUp(a)
			});
			c.resize(function() {
				b._resize()
			});
			a(window).bind("resize.jqChart", function() {
				b._resize()
			});
			if(g.isTouchDevice) {
				c.bind("touchstart", function(a) {
					b._touchStart(a)
				});
				c.bind("touchmove", function(a) {
					b._touchMove(a)
				});
				c.bind("touchend", function(a) {
					b._touchEnd(a)
				})
			}
			this.canvas = this._createCanvas();
			this.tooltip = this._createTooltip();
			this.shapeRenderer = new P(this.canvas, this);
			this.ctx = this.shapeRenderer.ctx
		},
		_setOptions: function() {
			var a = this.elem;
			!a.hasClass(this.pluginClass) && a.addClass(this.pluginClass);
			a.css("position") == "static" && a.css("position", "relative");
			!this.tooltip.hasClass(this.tooltipClass) && this.tooltip.addClass(this.tooltipClass)
		},
		_createHighlightRenderer: function() {
			if(g.use_excanvas) {
				this.hlCanvas = this._createCanvas(true);
				var b = a('<div style="position:absolute"></div>');
				this.elem.append(b);
				b.append(this.hlCanvas);
				this.hlRenderer = new P(this.hlCanvas, this);
				this.hlRenderer.div = b
			} else {
				this.hlCanvas = this._createCanvas();
				this.hlRenderer = new P(this.hlCanvas, this)
			}
			this.hlRenderer.isHighlighting = true
		},
		_createCanvas: function(c) {
			var b = document.createElement("canvas");
			b.width = 10;
			b.height = 10;
			a(b).css({
				position: "absolute",
				left: 0,
				top: 0
			});
			if(g.use_excanvas) {
				window.G_vmlCanvasManager.init_(document);
				window.G_vmlCanvasManager.initElement(b)
			}!c && this.elem.append(b);
			return b
		},
		_setCanvasSize: function(a, c, b) {
			a.width = c;
			a.height = b
		},
		_createTooltip: function() {
			var b = a('<div style="position:absolute;display:none"></div>');
			this.elem.append(b);
			return b
		},
		_addTrialWatermark: function(c) {
			var b = window.location.host.indexOf("www.jquerychart.com");
			if(b != -1) return;
			b = window.location.host.indexOf("www.jqchart.com");
			if(b != -1) return;
			var a = new w("www.jqchart.com");
			a.chart = this;
			a.font = "14px sans-serif";
			a.fillStyle = "grey";
			a.measure(this.ctx);
			a.x = this._width - a.width - 16;
			a.y = this._height - a.height;
			c.push(a)
		},
		_measure: function() {},
		_arrange: function() {},
		_keyDown: function(a) {
			this.currentTool.keyDown(a)
		},
		_keyUp: function(a) {
			this.currentTool.keyUp(a)
		},
		_mouseEnter: function() {
			this.isMouseOver = true
		},
		_mouseLeave: function() {
			this._clearRenderers();
			this.locOffset = null;
			this.isMouseOver = false
		},
		_mouseDown: function(a) {
			this._oldShape != null && this.elem.trigger("dataPointMouseDown", this._oldShape.context);
			this.isMouseDown = true;
			this.currentTool.mouseDown(a)
		},
		_mouseMove: function(a) {
			this._initMouseInput(a);
			this._processMouseEvents();
			this.currentTool.mouseMove(a)
		},
		_mouseUp: function(a) {
			this._oldShape != null && this.elem.trigger("dataPointMouseUp", this._oldShape.context);
			this.isMouseDown = false;
			this.currentTool.mouseUp(a)
		},
		_touchStart: function(a) {
			this._initTouchInput(a);
			this.isTouchOver = true;
			this._processTouchEvents();
			this.currentTool.touchStart(a)
		},
		_touchMove: function(b) {
			this._initTouchInput(b);
			var a = this.touchInput[0];
			this.isTouchOver = this.contains(a.locX, a.locY);
			this._processTouchEvents();
			this.currentTool.touchMove(b)
		},
		_touchEnd: function(a) {
			this._initTouchInput(a);
			if(this._oldShape != null) {
				this.elem.trigger("dataPointTouchEnd", this._oldShape.context);
				this._oldShape = null
			}
			this.currentTool.touchEnd(a)
		},
		_initMouseInput: function(b) {
			this.isMouseOver = true;
			var c = b.pageX,
				d = b.pageY;
			if(!this.locOffset) this.locOffset = this.elem.offset();
			var a = this.locOffset,
				f = c - a.left,
				g = d - a.top,
				e = {
					x: c,
					y: d,
					locX: f,
					locY: g
				};
			this.mouseInput = e
		},
		_initTouchInput: function(j) {
			var b = j.originalEvent.touches;
			if(!this.locOffset) this.locOffset = this.elem.offset();
			for(var c = this.locOffset, d = [], a = 0; a < b.length; a++) {
				var e = b[a],
					f = e.pageX,
					g = e.pageY,
					h = f - c.left,
					i = g - c.top;
				d.push({
					x: f,
					y: g,
					locX: h,
					locY: i
				})
			}
			this.touchInput = d
		},
		getAllTouches: function(h) {
			for(var f = ["touches", "changedTouches"], b = [], c = 0; c < f.length; c++)
				for(var e = h.originalEvent[f[c]], d = 0; d < e.length; d++) {
					var g = e[d];
					a.inArray(g, b) == -1 && b.push(g)
				}
			return b
		},
		_resize: function() {
			var c = this.elem,
				e = c.width(),
				d = c.height();
			if(e != this._width || d != this._height) {
				var a = this.options;
				if(a) {
					if(!b.isNull(a.width)) a.width = e;
					if(!b.isNull(a.height)) a.height = d
				}
				this._setOptions(this.options)
			}
		},
		_clearRenderers: function() {
			if(this._oldTShapes) {
				this._oldTShapes = null;
				this.elem.trigger("dataHighlighting", null)
			}
			this._oldShape = null;
			this.hideTooltip();
			this.hlRenderer && this.hlRenderer._clear()
		},
		_processMouseMove: function() {
			this._processTooltips(this.mouseInput)
		},
		_processMouseEvents: function() {
			var b = this.mouseInput,
				a = this.hitTest(b.locX, b.locY);
			if(this._oldShape != null && this._oldShape == a) this.elem.trigger("dataPointMouseMove", this._oldShape.context);
			else {
				this._oldShape != null && this.elem.trigger("dataPointMouseLeave", this._oldShape.context);
				a != null && this.elem.trigger("dataPointMouseEnter", a.context);
				this._oldShape = a
			}
		},
		_processTouchEvents: function() {
			var b = this.touchInput[0];
			if(!b) return;
			var a = this.hitTest(b.locX, b.locY);
			if(this._oldShape != null && this._oldShape == a) this.elem.trigger("dataPointTouchMove", this._oldShape.context);
			else {
				this._oldShape != null && this.elem.trigger("dataPointTouchEnd", this._oldShape.context);
				a != null && this.elem.trigger("dataPointTouchStart", a.context);
				this._oldShape = a
			}
		},
		_processTooltips: function(c) {
			var d = this.hasTooltips,
				f = this.hasHighlighting;
			if(!d && !f) return;
			var g = this.options.tooltips.snapArea,
				a = this._getTooltipShapes(c.locX, c.locY, g, c),
				e = true;
			if(this._oldTShapes == null || !b.compareArrays(this._oldTShapes, a)) {
				if(a != null) {
					this._initTooltip(a);
					this._highlightShapes(a)
				}
				this._oldTShapes = a
			} else e = false;
			a && d && e && this._setTooltipPos(a, c)
		},
		_setTooltipPos: function(c, d) {
			var h = this.tooltip.outerWidth(true),
				g = this.tooltip.outerHeight(true),
				f = c[0]._getTooltipPosition(d, h, g, this._width, this._height),
				b = f.y,
				e = c.length;
			if(e > 1) {
				b = 0;
				a.each(c, function() {
					b += this._getTooltipPosition(d, h, g, this._width, this._height).y
				});
				b /= e
			}
			this.tooltip.stop();
			this.tooltip.animate({
				left: f.x,
				top: b
			}, 100)
		},
		_processTouchStart: function() {
			this._processTooltips(this.touchInput[0])
		},
		_processTouchMove: function() {
			this._processTooltips(this.touchInput[0])
		},
		_initTooltip: function(b) {
			if(!this.hasTooltips || !b || !b.length) return;
			var g = b.length,
				f = "",
				d;
			if(g == 1) d = b[0].context;
			else {
				d = [];
				a.each(b, function() {
					d.push(this.context)
				})
			}
			if(!d) return;
			var e = new jQuery.Event("tooltipFormat");
			this.elem.trigger(e, [d]);
			var h = this;
			if(e.result) f = e.result;
			else a.each(b, function() {
				f += h._getTooltip(this)
			});
			this.tooltip.html(f);
			var c = this.options.tooltips;
			if(g == 1)
				if(c.borderColor) {
					c.borderColor == "auto" && this.tooltip.css("border-color", b[0].getTooltipColor());
					this.tooltip.css("border-color", c.borderColor)
				}
			c.background && this.tooltip.css("background", c.background);
			this.showTooltip()
		},
		_highlightShapes: function(f) {
			if(!this.hasHighlighting) return;
			this.hlRenderer._clear();
			var e = this.options.tooltips,
				b = [];
			a.each(f, function(d, c) {
				var a = c._createHighlightShape(e.highlightingFillStyle, e.highlightingStrokeStyle);
				b.push(a)
			});
			var c;
			if(b.length == 1) {
				c = b[0].context;
				c.shape = b[0]
			} else {
				c = [];
				a.each(b, function() {
					c.push(this.context);
					c.shape = this
				})
			}
			var d = new jQuery.Event("dataHighlighting");
			this.elem.trigger(d, [c]);
			if(d.result !== false)
				if(g.use_excanvas) this.hlRenderer._render(b);
				else {
					this.hlRenderer.ctx.save();
					this._setClip && this._setClip(this.hlRenderer.ctx);
					this.hlRenderer._render(b);
					this.hlRenderer.ctx.restore()
				}
		},
		_getClosestShape: function(b, g, f) {
			for(var a = b[0], d = 1; d < b.length; d++) {
				var e = b[d];
				if(c.compare(a, e, f, g) == false) a = e
			}
			return a
		},
		_getTooltip: function() {
			return "Tooltip"
		},
		_getTooltipShapes: function(h, i, a, d) {
			if(!a) a = 0;
			for(var c = [], f = this.shapes.length - 1; f >= 0; f--) {
				var e = this.shapes[f];
				if(!e.context) continue;
				var b = e.hitTest(d.locX, d.locY, a);
				if(b === true) c.push(e);
				else b && c.push(b)
			}
			var g = this._getClosestShape(c, a, d);
			return !g ? null : [g]
		},
		getCurrentTool: function() {
			return this.currentTool
		},
		setCurrentTool: function(a) {
			if(this.currentTool == a) return;
			this.currentTool != null && this.currentTool.stop();
			if(!a) this.currentTool = this.defaultTool;
			else this.currentTool = a;
			this.currentTool && this.currentTool.start()
		},
		contains: function(a, b) {
			return a >= 0 && a <= this._width && b >= 0 && b <= this._height
		},
		hitTest: function(d, e, b) {
			if(!b) b = 0;
			for(var c = this.shapes.length - 1; c >= 0; c--) {
				var a = this.shapes[c];
				if(!a.context) continue;
				if(a.hitTest(d, e, b)) return a
			}
		},
		showTooltip: function() {
			this.tooltip.show()
		},
		hideTooltip: function() {
			this.tooltip.hide()
		},
		stringFormat: function(b, c) {
			return a.type(b) == "date" ? a.fn.jqChart.dateFormat(b, c) : a.fn.jqChart.sprintf(c, b)
		},
		clear: function() {
			this._clearRenderers();
			this.shapeRenderer._clear()
		},
		render: function() {},
		destroy: function() {
			var b = this.elem;
			b.unbind("mouseenter");
			b.unbind("mouseleave");
			b.unbind("mousedown");
			b.unbind("mousemove");
			b.unbind("mouseup");
			b.unbind("kedown");
			b.unbind("keyup");
			b.unbind("resize");
			a(window).unbind("resize.jqChart");
			if(g.isTouchDevice) {
				b.unbind("touchstart");
				b.unbind("touchmove");
				b.unbind("touchend")
			}
			b.children().remove();
			var c = this.options;
			b.hasClass(this.pluginClass) && b.removeClass(this.pluginClass)
		},
		toDataURL: function(a) {
			return g.use_excanvas ? null : this.canvas.toDataURL(a)
		},
		getShapesPerData: function(d) {
			var b = [],
				c = this.shapes;
			a.each(d, function() {
				var d = this;
				a.each(c, function() {
					if(this.context) this.context.dataItem == d && b.push(this)
				})
			});
			return b
		},
		highlightData: function(b) {
			if(!b) {
				this._clearRenderers();
				return null
			}
			var a = this.getShapesPerData(b);
			if(a.length == 0) return null;
			this._highlightShapes(a);
			this._initTooltip(a);
			var c = a[0].getCenter();
			this._setTooltipPos(a, {
				locX: c.x,
				locY: c.y
			});
			return a
		}
	};

	function yb(b) {
		a.extend(this, {
			maxInter200Px: 8,
			lblMargin: 4,
			origin: 0,
			length: 300,
			x: 0,
			y: 0
		});
		this.setOptions(b)
	}
	yb.prototype = {
		_calculateActualInterval: function(m, l) {
			if(this.interval) return this.interval;
			var h = 1;
			if(!this.getOrientation || this.getOrientation() == "x") h = .8;
			for(var k = h * this.maxInter200Px, e = Math.max(this.length * k / 200, 1), g = l - m, a = g / e, j = Math.pow(10, Math.floor(b.log10(a))), f = [10, 5, 2, 1], c = 0; c < f.length; c++) {
				var i = f[c],
					d = j * i;
				if(e < g / d) break;
				a = d
			}
			return a
		},
		_setVisibleRanges: function() {
			if(this.zoomEnabled) {
				this.actualVisibleMinimum = b.isNull(this.visibleMinimum) ? this.actualMinimum : this.visibleMinimum;
				this.actualVisibleMaximum = b.isNull(this.visibleMaximum) ? this.actualMaximum : this.visibleMaximum
			} else {
				this.actualVisibleMinimum = this.actualMinimum;
				this.actualVisibleMaximum = this.actualMaximum
			}
			if(a.type(this.actualVisibleMinimum) == "date") this.actualVisibleMinimum = this.actualVisibleMinimum.getTime();
			if(a.type(this.actualVisibleMaximum) == "date") this.actualVisibleMaximum = this.actualVisibleMaximum.getTime()
		},
		_setMinMax: function(c, a) {
			this.actualMinimum = b.isNull(this.minimum) ? c : this.minimum;
			this.actualMaximum = b.isNull(this.maximum) ? a : this.maximum
		},
		_getNextPosition: function(c, a) {
			return b.round(c + a)
		},
		_getMarkInterval: function(b, c) {
			var a;
			if(b.interval) a = b.interval;
			else if(c) a = this.actualInterval;
			else a = this.actualInterval / 2;
			return a
		},
		_getIntervals: function(c, b) {
			var d = 0;
			if(b && b.intervalOffset) d = b.intervalOffset;
			for(var e = [], f = this._getIntervalStart(this.actualVisibleMinimum, c), a = f + d; a <= this.actualVisibleMaximum; a = this._getNextPosition(a, c)) e.push(a);
			return e
		},
		_getIntervalStart: function(d, b) {
			var c = d - this.crossing,
				a = this._alignToInterval(c, b);
			if(a < d) a = this._alignToInterval(c + b, b);
			return a
		},
		_alignToInterval: function(c, a) {
			return b.round(b.round(Math.floor(c / a)) * a) + this.crossing
		},
		_createLabel: function(d, c) {
			var b = new w(d);
			b.context = {
				chart: this.chart,
				axis: this
			};
			a.extend(b, c);
			this.chart.elem.trigger("axisLabelCreating", b);
			b.measure(this.chart.ctx);
			return b
		},
		_getLabelIntervals: function(a, b) {
			return this._getIntervals(a, b)
		},
		_measureRotatedLabels: function(g) {
			for(var h = this.isAxisVertical, c = 0, b = 0, d = 0; d < g.length; d++) {
				var a = g[d],
					e = Math.sqrt(a.width * a.width + a.height * a.height),
					f = a.rotationAngle;
				if(h) {
					var j = Math.abs(Math.cos(f) * e);
					c = Math.max(c, j)
				} else {
					var i = Math.abs(Math.sin(f) * e);
					b = Math.max(b, i)
				}
			}
			if(this.labels.position == "inside") {
				this.lblsW = c;
				this.lblsH = b;
				return {
					w: 0,
					h: 0
				}
			}
			return {
				w: c,
				h: b
			}
		},
		_correctLabelsPositions: function(n) {
			var i = 0,
				h = 0,
				o = this.reversed === true,
				p = this.labels.position == "inside",
				q = this.isAxisVertical,
				g = this.lblMargin;
			if(q) {
				for(var e = [], d = 0; d < n.length; d++) {
					var a = n[d],
						f = false,
						k = a.y;
					switch(a.textBaseline) {
						case "middle":
							k -= a.height / 2;
							break;
						case "bottom":
							k -= a.height
					}
					for(var c = 0, c = 0; c < e.length; c++) {
						var b = e[c];
						if(o) f = k > b.y + b.h;
						else f = b.y > k + a.height;
						if(f) {
							b.y = k;
							b.h = a.height;
							b.w = Math.max(b.w, a.width + g);
							b.labels.push(a);
							break
						}
					}
					if(f == false) e[c] = {
						y: k,
						h: a.height,
						w: a.width + g,
						labels: [a]
					}
				}
				var m = this.location == "right";
				m = p ? !m : m;
				i = 0;
				for(var d = 0; d < e.length; d++) {
					for(var b = e[d], c = 0; c < b.labels.length; c++) {
						var a = b.labels[c];
						if(m) a.x += i;
						else a.x -= i
					}
					i += b.w
				}
			} else {
				for(var e = [], d = 0; d < n.length; d++) {
					var a = n[d],
						j = a.x;
					switch(a.textAlign) {
						case "center":
							j -= a.width / 2;
							break;
						case "right":
							j -= a.width
					}
					for(var f = false, c = 0, c = 0; c < e.length; c++) {
						var b = e[c];
						if(o) f = b.x > j + a.width + g;
						else f = j > b.x + b.w + g;
						if(f) {
							b.x = j;
							b.w = a.width;
							b.h = Math.max(b.h, a.height + g);
							b.labels.push(a);
							f = true;
							break
						}
					}
					if(f == false) e[c] = {
						x: j,
						w: a.width,
						h: a.height + g,
						labels: [a]
					}
				}
				var l = this.location == "bottom";
				l = p ? !l : l;
				h = 0;
				for(var d = 0; d < e.length; d++) {
					for(var b = e[d], c = 0; c < b.labels.length; c++) {
						var a = b.labels[c];
						if(l) a.y += h;
						else a.y -= h
					}
					h += b.h
				}
			}
			if(this.labels.position == "inside") {
				this.lblsW = i;
				this.lblsH = h;
				return {
					w: 0,
					h: 0
				}
			}
			return {
				w: i,
				h: h
			}
		},
		_removeOverlappedLabels: function(c) {
			var j = 0,
				i = 0,
				f = 0,
				o = 0,
				l = 0,
				g = 0,
				n = 0,
				m = h,
				s = this.reversed === true,
				u = this.labels.position == "inside",
				r = this.isAxisVertical,
				e = this.lblMargin,
				k = 2 * e;
			if(r)
				for(var v = [], b = 0; b < c.length; b++) {
					var d = b;
					if(this.reversed) d = c.length - b - 1;
					var a = c[d],
						t = false,
						q = a.y;
					switch(a.textBaseline) {
						case "middle":
							q -= a.height / 2;
							break;
						case "bottom":
							q -= a.height
					}
					g = a.y;
					n = g + a.height + k;
					if(n < m) m = g;
					else {
						a.visible = false;
						continue
					}
					j = Math.max(a.width + e)
				} else
					for(var b = 0; b < c.length; b++) {
						var d = b;
						if(this.reversed) d = c.length - b - 1;
						var a = c[d],
							p = a.x;
						switch(a.textAlign) {
							case "center":
								p -= a.width / 2;
								break;
							case "right":
								p -= a.width
						}
						f = a.x;
						o = f + a.width + k;
						if(f > l) l = o;
						else {
							a.visible = false;
							continue
						}
						i = Math.max(a.height + e)
					}
			if(this.labels.position == "inside") {
				this.lblsW = j;
				this.lblsH = i;
				return {
					w: 0,
					h: 0
				}
			}
			return {
				w: j,
				h: i
			}
		},
		_measure: function() {
			var b = 0;
			if(this.zoomEnabled) b = this.rangeSliderBreadth;
			var a = {
				w: 0,
				h: 0
			};
			if(this.labels)
				if(this.labels.angle) a = this._measureRotatedLabels(this._getLabels());
				else switch(this.labels.resolveOverlappingMode) {
					case "hide":
						a = this._removeOverlappedLabels(this._getLabels());
						break;
					case "multipleRows":
					default:
						a = this._correctLabelsPositions(this._getLabels())
				}
				this.title._measure();
			var c = this.title.height + b + this.lineWidth;
			if(this.isAxisVertical) a.w += c;
			else a.h += c;
			var d = this.margin + this._getMaxOutsideTickMarksLength();
			if(this.isAxisVertical) {
				if(this.isCustomWidth == false) {
					var f = a.w + d;
					if(this.width != f) {
						this.width = f;
						return true
					}
				}
			} else if(this.isCustomHeight == false) {
				var e = a.h + d;
				if(this.height != e) {
					this.height = e;
					return true
				}
			}
			return false
		},
		_arrange: function() {
			var a = this.x,
				d = this.y,
				c = this.x + this.width,
				e = this.y + this.height;
			switch(this.location) {
				case "left":
					c = a = this.x + this.width - this.lineWidth / 2;
					break;
				case "right":
					c = a = this.x + this.lineWidth / 2;
					break;
				case "top":
					e = d = this.y + this.height - this.lineWidth / 2;
					break;
				case "bottom":
					e = d = this.y + this.lineWidth / 2
			}
			if(this.title.text) switch(this.location) {
				case "left":
					this.title.rotX = this.x;
					this.title.rotY = this.y + (this.height + this.title.width) / 2;
					this.title.rotationAngle = b.radians(-90);
					break;
				case "right":
					this.title.rotX = this.x + this.width;
					this.title.rotY = this.y + (this.height - this.title.width) / 2;
					this.title.rotationAngle = b.radians(90);
					break;
				case "top":
					this.title.x = this.x + (this.width - this.title.width) / 2;
					this.title.y = this.y;
					break;
				case "bottom":
					this.title.x = this.x + (this.width - this.title.width) / 2;
					this.title.y = this.y + this.height - this.title.height
			}
			this.x1 = a;
			this.y1 = d;
			this.x2 = c;
			this.y2 = e;
			this.offset = this.lineWidth
		},
		_updateOrigin: function() {
			if(this.isAxisVertical) {
				this.origin = this.y;
				this.length = this.height
			} else {
				this.origin = this.x;
				this.length = this.width
			}
		},
		_render: function(c) {
			var e = this._getTickMarks(this.minorTickMarks, false);
			a.merge(c, e);
			var d = this._getTickMarks(this.majorTickMarks, true);
			a.merge(c, d);
			var f = this._getMainLine();
			c.push(f);
			var b = this._getLabels();
			if(this.labels && !this.labels.angle) switch(this.labels.resolveOverlappingMode) {
				case "hide":
					this._removeOverlappedLabels(b);
					break;
				case "multipleRows":
				default:
					this._correctLabelsPositions(b)
			}
			this._filterLabels(b);
			this.title._render(c);
			if(this.labels && this.labels.position == "inside") return b;
			a.merge(c, b)
		},
		_getMainLine: function() {
			var a = new m(this.x1, this.y1, this.x2, this.y2);
			a.strokeStyle = this.strokeStyle;
			a.lineWidth = this.lineWidth;
			a.strokeDashArray = this.strokeDashArray;
			return a
		},
		_getMaxInsideTickMarksLength: function() {
			var a = 0;
			if(this.minorTickMarks != null && this.minorTickMarks.visible && this.minorTickMarks.isInside()) a = Math.max(a, this.minorTickMarks.length);
			if(this.majorTickMarks != null && this.majorTickMarks.visible && this.majorTickMarks.isInside()) a = Math.max(a, this.majorTickMarks.length);
			return a
		},
		_getMaxOutsideTickMarksLength: function() {
			var a = 0;
			if(this.minorTickMarks != null && this.minorTickMarks.visible && !this.minorTickMarks.isInside()) a = Math.max(a, this.minorTickMarks.length);
			if(this.majorTickMarks != null && this.majorTickMarks.visible && !this.majorTickMarks.isInside()) a = Math.max(a, this.majorTickMarks.length);
			return a
		},
		_getLabels: function() {
			var c = this.labels;
			if(c == null || c.visible === false) return [];
			var g = c.position == "inside",
				e = this.lblMargin,
				j = this.offset,
				l = this.isAxisVertical;
			if(l && c.vAlign == "center" || !l && c.hAlign == "center") e += g ? this._getMaxInsideTickMarksLength() : this._getMaxOutsideTickMarksLength();
			var m = [],
				o = this._getMarkInterval(c, true);
			if(!o) return [];
			for(var n = this._getLabelIntervals(o, c), p = n.length, r = c.showFirstLabel, s = c.showLastLabel, h = 0; h < p; h++) {
				if(!r && h == 0 || !s && h == p - 1) continue;
				var q = n[h],
					t = this.getLabel(q),
					a = this._createLabel(t, c),
					k = this.getPosition(q);
				switch(this.location) {
					case "left":
						if(g) a.x = this.x + this.width + e;
						else {
							a.x = this.x + this.width - e - j;
							a.textAlign = "right"
						}
						a.y = k;
						switch(c.vAlign) {
							case "bottom":
								a.textBaseline = "top";
								break;
							case "top":
								a.textBaseline = "bottom"
						}
						if(this.labels.angle) {
							var d = Math.min(90, Math.max(-90, this.labels.angle)),
								f = b.radians(d);
							a.rotX = a.x;
							a.rotY = a.y;
							a.rotationAngle = f
						}
						break;
					case "right":
						if(g) {
							a.x = this.x - e;
							a.textAlign = "right"
						} else a.x = this.x + e + j;
						a.y = k;
						switch(c.vAlign) {
							case "bottom":
								a.textBaseline = "top";
								break;
							case "top":
								a.textBaseline = "bottom"
						}
						if(this.labels.angle) {
							var d = Math.min(90, Math.max(-90, this.labels.angle)),
								f = b.radians(d);
							a.rotX = a.x;
							a.rotY = a.y;
							a.rotationAngle = f
						}
						break;
					case "top":
						a.x = k;
						if(g) a.y = this.y + this.height + e + a.height / 2;
						else a.y = this.y + this.height - e - a.height / 2 - j;
						a.textBaseline = "middle";
						switch(c.hAlign) {
							case "center":
								a.textAlign = "center";
								break;
							case "left":
								a.textAlign = "right";
								break;
							case "right":
								a.textAlign = "left"
						}
						if(this.labels.angle) {
							var d = Math.min(90, Math.max(-90, this.labels.angle));
							a.flip = d > 0;
							if(d > 0) d = -180 + d;
							var f = b.radians(d),
								i = Math.sqrt(a.width * a.width + a.height * a.height);
							a.rotX = a.x + .5 * Math.cos(f) * i;
							a.rotY = a.y + .5 * Math.sin(f) * i;
							a.rotationAngle = f
						}
						break;
					case "bottom":
						a.x = k;
						if(g) a.y = this.y - e - a.height / 2;
						else a.y = this.y + e + a.height / 2 + j;
						a.textBaseline = "middle";
						switch(c.hAlign) {
							case "center":
								a.textAlign = "center";
								break;
							case "left":
								a.textAlign = "right";
								break;
							case "right":
								a.textAlign = "left"
						}
						if(this.labels.angle) {
							var d = Math.min(90, Math.max(-90, this.labels.angle));
							a.flip = d < 0;
							if(d < 0) d = 180 + d;
							var f = b.radians(d),
								i = Math.sqrt(a.width * a.width + a.height * a.height);
							a.rotX = a.x + .5 * Math.cos(f) * i;
							a.rotY = a.y + .5 * Math.sin(f) * i;
							a.rotationAngle = f
						}
				}
				m.push(a)
			}
			return m
		},
		_filterLabels: function(b) {
			if(!this.labels || this.labels.position != "inside") return;
			for(var c = this.chart.gridArea, i = c.x, j = c.y, h = c.width, g = c.height, d = b.length - 1; d >= 0; d--) {
				var e = b[d];
				if(!e.isInRect(i, j, h, g)) {
					var f = a.inArray(e, b);
					b.splice(f, 1)
				}
			}
		},
		_getTickMarks: function(c, n) {
			if(c == null || c.visible != true) return [];
			for(var k = [], h = this.offset, g = c.position == "inside", p = this._getMarkInterval(c, n), b = c.length, l = this._getIntervals(p, c, n), d, f, e, a, j = 0; j < l.length; j++) {
				var i = this.getPosition(l[j]);
				switch(this.location) {
					case "left":
						f = a = i;
						if(g) e = this.x + this.width + b;
						else e = this.x + this.width - h;
						d = e - b;
						break;
					case "right":
						f = a = i;
						if(g) d = this.x - b;
						else d = this.x + h;
						e = d + b;
						break;
					case "top":
						d = e = i;
						if(g) a = this.y + this.height + b;
						else a = this.y + this.height - h;
						f = a - b;
						break;
					case "bottom":
						d = e = i;
						if(g) a = this.y - b;
						else a = this.y + h;
						f = a + b
				}
				var o = new m(d, f, e, a);
				c._setLineSettings(o);
				k.push(o)
			}
			return k
		},
		_setChart: function(a) {
			this.chart = a;
			this.title.chart = a
		},
		_getValue: function(a) {
			return a
		},
		_initRadialMeasures: function() {
			var a = Math.min(this.width, this.height);
			this.cx = this.x + this.width / 2;
			this.cy = this.y + this.height / 2;
			this.radius = a / 2
		},
		getZoom: function() {
			if(this.zoomEnabled !== true) return 1;
			if(!this.actualMaximum) return 1;
			var b = this.actualMaximum - this.actualMinimum,
				a = this.actualVisibleMaximum - this.actualVisibleMinimum,
				c = a / b;
			return c
		},
		setOptions: function(c) {
			if(c != null && typeof c.title == "string") {
				c.title = {
					text: c.title
				};
				a.extend(c.title, this.defaults.title)
			}
			var b = a.extend(true, {}, this.defaults, c || {});
			a.extend(this, b);
			this.isCustomWidth = this.width != null;
			this.isCustomHeight = this.height != null;
			this.majorTickMarks = new Ab(b.majorTickMarks);
			if(b.minorTickMarks) {
				this.minorTickMarks = new Ab(b.minorTickMarks);
				this.minorTickMarks.major = this.majorTickMarks
			}
			if(b.majorGridLines) this.majorGridLines = new zb(b.majorGridLines);
			if(b.minorGridLines) {
				this.minorGridLines = new zb(b.minorGridLines);
				this.minorGridLines.major = this.majorGridLines
			}
			this.isAxisVertical = this.isVertical();
			this.title = new Z(b.title)
		},
		getPosition: function(f) {
			var e = this.actualVisibleMaximum,
				d = this.actualVisibleMinimum,
				a = this.length / (e - d) * (f - d),
				b = this.reversed === true,
				c = this.isAxisVertical;
			if(c && b === false || c === false && b) a = this.origin + this.length - a;
			else a += this.origin;
			return a
		},
		getValue: function(f) {
			var d = this.actualVisibleMaximum,
				e = this.actualVisibleMinimum,
				a = (f - this.origin) * (d - e) / this.length + e,
				b = this.reversed === true,
				c = this.isAxisVertical;
			if(c && b === false || c === false && b) a = d - a;
			return a
		},
		getLabel: function(d) {
			var b = null;
			if(this.labels != null) b = this.labels.stringFormat;
			var c = a.fn.jqChart.labelFormatter(b, d);
			return c
		},
		isVertical: function() {
			return this.location == "left" || this.location == "right" ? true : false
		},
		isValueVisible: function(a) {
			return a >= this.actualVisibleMinimum && a <= this.actualVisibleMaximum
		},
		isInVisibleRange: function(d) {
			var c = this.visibleMinimum,
				a = this.visibleMaximum;
			return b.isNull(c) || b.isNull(a) ? true : d >= c && d <= a
		},
		defaults: {
			location: "left",
			labels: {
				visible: true,
				fillStyle: "black",
				lineWidth: 1,
				font: "11px sans-serif",
				position: "outside",
				showLastLabel: true,
				showFirstLabel: true,
				hAlign: "center",
				vAlign: "center"
			},
			title: {
				font: "14px sans-serif",
				margin: 2
			},
			strokeStyle: "black",
			lineWidth: 1,
			margin: 5,
			crossing: 0,
			visible: true,
			reversed: false,
			zoomEnabled: false
		}
	};
	a.fn.jqChart.sprintf = function() {
		function e(a, c, e, d) {
			var b = a.length >= c ? "" : Array(1 + c - a.length >>> 0).join(e);
			return d ? a + b : b + a
		}

		function d(a, d, b, c, g) {
			var f = c - a.length;
			if(f > 0)
				if(b || !g) a = e(a, c, " ", b);
				else a = a.slice(0, d.length) + e("", f, "0", true) + a.slice(d.length);
			return a
		}

		function c(b, f, a, g, i, h, j) {
			var c = b >>> 0;
			a = a && c && ({
				"2": "0b",
				"8": "0",
				"16": "0x"
			})[f] || "";
			b = a + e(c.toString(f), h || 0, "0", false);
			return d(b, a, g, i, j)
		}

		function g(a, c, e, b, f) {
			if(b != null) a = a.slice(0, b);
			return d(a, "", c, e, f)
		}
		var b = arguments,
			f = 0,
			h = b[f++];
		return h.replace(a.fn.jqChart.sprintf.regex, function(t, s, q, a, w, h, m) {
			if(t == "%%") return "%";
			for(var j = false, n = "", k = false, l = false, r = 0; q && r < q.length; r++) switch(q.charAt(r)) {
				case " ":
					n = " ";
					break;
				case "+":
					n = "+";
					break;
				case "-":
					j = true;
					break;
				case "0":
					k = true;
					break;
				case "#":
					l = true
			}
			if(!a) a = 0;
			else if(a == "*") a = +b[f++];
			else if(a.charAt(0) == "*") a = +b[a.slice(1, -1)];
			else a = +a;
			if(a < 0) {
				a = -a;
				j = true
			}
			if(!isFinite(a)) throw new Error("sprintf: (minimum-)width must be finite");
			if(!h) h = "fFeE".indexOf(m) > -1 ? 6 : m == "d" ? 0 : void 0;
			else if(h == "*") h = +b[f++];
			else if(h.charAt(0) == "*") h = +b[h.slice(1, -1)];
			else h = +h;
			var i = s ? b[s.slice(0, -1)] : b[f++];
			switch(m) {
				case "s":
					return g(String(i), j, a, h, k);
				case "c":
					return g(String.fromCharCode(+i), j, a, h, k);
				case "b":
					return c(i, 2, l, j, a, h, k);
				case "o":
					return c(i, 8, l, j, a, h, k);
				case "x":
					return c(i, 16, l, j, a, h, k);
				case "X":
					return c(i, 16, l, j, a, h, k).toUpperCase();
				case "u":
					return c(i, 10, l, j, a, h, k);
				case "i":
				case "d":
					var o = parseInt(+i),
						p = o < 0 ? "-" : n;
					i = p + e(String(Math.abs(o)), h, "0", false);
					return d(i, p, j, a, k);
				case "e":
				case "E":
				case "f":
				case "F":
				case "g":
				case "G":
					var o = +i,
						p = o < 0 ? "-" : n,
						v = (["toExponential", "toFixed", "toPrecision"])["efg".indexOf(m.toLowerCase())],
						u = (["toString", "toUpperCase"])["eEfFgG".indexOf(m) % 2];
					i = p + Math.abs(o)[v](h);
					return d(i, p, j, a, k)[u]();
				default:
					return t
			}
		})
	};
	a.fn.jqChart.sprintf.regex = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
	a.fn.jqChart.dateFormat = function() {
		var e = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
			d = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
			c = /[^-+\dA-Z]/g,
			b = function(a, b) {
				a = String(a);
				b = b || 2;
				while(a.length < b) a = "0" + a;
				return a
			};
		return function(f, g, l) {
			var j = a.fn.jqChart.dateFormat;
			if(arguments.length == 1 && Object.prototype.toString.call(f) == "[object String]" && !/\d/.test(f)) {
				g = f;
				f = undefined
			}
			f = f ? new Date(f) : new Date;
			if(isNaN(f)) throw SyntaxError("invalid date");
			g = String(j.masks[g] || g || j.masks["default"]);
			if(g.slice(0, 4) == "UTC:") {
				g = g.slice(4);
				l = true
			}
			var i = l ? "getUTC" : "get",
				k = f[i + "Date"](),
				q = f[i + "Day"](),
				n = f[i + "Month"](),
				t = f[i + "FullYear"](),
				h = f[i + "Hours"](),
				r = f[i + "Minutes"](),
				s = f[i + "Seconds"](),
				m = f[i + "Milliseconds"](),
				o = l ? 0 : f.getTimezoneOffset(),
				p = {
					d: k,
					dd: b(k),
					ddd: j.i18n.dayNames[q],
					dddd: j.i18n.dayNames[q + 7],
					m: n + 1,
					mm: b(n + 1),
					mmm: j.i18n.monthNames[n],
					mmmm: j.i18n.monthNames[n + 12],
					yy: String(t).slice(2),
					yyyy: t,
					h: h % 12 || 12,
					hh: b(h % 12 || 12),
					H: h,
					HH: b(h),
					M: r,
					MM: b(r),
					s: s,
					ss: b(s),
					l: b(m, 3),
					L: b(m > 99 ? Math.round(m / 10) : m),
					t: h < 12 ? "a" : "p",
					tt: h < 12 ? "am" : "pm",
					T: h < 12 ? "A" : "P",
					TT: h < 12 ? "AM" : "PM",
					Z: l ? "UTC" : (String(f).match(d) || [""]).pop().replace(c, ""),
					o: (o > 0 ? "-" : "+") + b(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
					S: (["th", "st", "nd", "rd"])[k % 10 > 3 ? 0 : (k % 100 - k % 10 != 10) * k % 10]
				};
			return g.replace(e, function(a) {
				return a in p ? p[a] : a.slice(1, a.length - 1)
			})
		}
	}();
	a.fn.jqChart.dateFormat.masks = {
		"default": "ddd mmm dd yyyy HH:MM:ss",
		shortDate: "m/d/yy",
		mediumDate: "mmm d, yyyy",
		longDate: "mmmm d, yyyy",
		fullDate: "dddd, mmmm d, yyyy",
		shortTime: "h:MM TT",
		mediumTime: "h:MM:ss TT",
		longTime: "h:MM:ss TT Z",
		isoDate: "yyyy-mm-dd",
		isoTime: "HH:MM:ss",
		isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
		isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	};
	a.fn.jqChart.dateFormat.i18n = {
		dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	};
	var i = -Number.MAX_VALUE,
		h = Number.MAX_VALUE;

	function b() {}
	b.isNull = function(a) {
		return a === null || a === undefined
	};
	b.roundH = function(a) {
		return Math.round(a) - .5
	};
	b.round = function(a) {
		var c = 1 / a;
		if(Math.abs(c) > 1e4) {
			var d = b.log10(Math.abs(c));
			if(d > 13) return a
		}
		var e = a.toPrecision(14),
			f = parseFloat(e);
		return f
	};
	b.log10 = function(a) {
		return Math.log(a) / Math.LN10
	};
	b.log = function(b, a) {
		return Math.log(b) / Math.log(a)
	};
	b.radians = function(a) {
		return a * (Math.PI / 180)
	};
	b.fitInRange = function(a, c, b) {
		if(a < c) a = c;
		else if(a > b) a = b;
		return a
	};
	b.sum = function(b) {
		for(var c = 0, a = 0; a < b.length; a++) c += b[a];
		return c
	};
	b.compareArrays = function(a, b) {
		if(!a && !b) return true;
		if(!a || !b) return false;
		if(a.length != b.length) return false;
		for(var c = 0; c < a.length; c++)
			if(a[c] !== b[c]) return false;
		return true
	};
	b.rotatePointAt = function(j, k, c, a, b) {
		var e = Math.sin(c),
			d = Math.cos(c),
			f = j - a,
			g = k - b,
			h = a + f * d - g * e,
			i = b + f * e + g * d;
		return {
			x: h,
			y: i
		}
	};
	b.rotatePointsAt = function(d, h, f, g) {
		for(var c = [], a = 0; a < d.length; a += 2) {
			var e = b.rotatePointAt(d[a], d[a + 1], h, f, g);
			c.push(e.x);
			c.push(e.y)
		}
		return c
	};
	b.reversePoints = function(c) {
		for(var b = [], a = c.length - 2; a >= 0; a -= 2) {
			b.push(c[a]);
			b.push(c[a + 1])
		}
		return b
	};

	function d() {}
	d.ticksInDay = 24 * 60 * 60 * 1e3;
	d.getDaysInMonth = function(b, a) {
		return a == 1 ? (new Date(b, 1, 29)).getDate() == 29 ? 29 : 28 : ([31, undefined, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31])[a]
	};
	d.addSeconds = function(c, b) {
		return new Date(c.getTime() + b * 1e3)
	};
	d.addDays = function(b, c) {
		var a = new Date(b.getTime());
		a.setDate(b.getDate() + c);
		return a
	};
	d.addYears = function(b, c) {
		var a = new Date(b.getTime());
		a.setFullYear(b.getFullYear() + c);
		return a
	};
	d.addMonths = function(c, b) {
		var a = new Date(c.getTime()),
			e = a.getDate();
		a.setDate(1);
		a.setMonth(a.getMonth() + b);
		a.setDate(Math.min(e, d.getDaysInMonth(a.getFullYear(), a.getMonth())));
		return a
	};
	d.getDayOfWeek = function(b) {
		var a = b.getDay();
		return a === 0 ? 7 : a
	};
	d.fromDays = function(a) {
		return a * d.ticksInDay
	};
	d.fromHours = function(a) {
		return a * 60 * 60 * 1e3
	};
	d.fromMinutes = function(a) {
		return a * 60 * 1e3
	};
	d.fromSeconds = function(a) {
		return a * 1e3
	};
	d.roundToDay = function(a) {
		return new Date(a.getFullYear(), a.getMonth(), a.getDate())
	};

	function c() {
		this.fillStyle = "black";
		this.strokeStyle = "black";
		this.lineWidth = 1;
		this.lineCap = "butt";
		this.lineJoin = "miter";
		this.miterLimit = 10;
		this.visible = true;
		this.shadowColor = "rgba(0, 0, 0, 0)";
		this.shadowBlur = 0;
		this.shadowOffsetX = 0;
		this.shadowOffsetY = 0
	}
	c.compare = function(b, e, a, j) {
		if(!b.useHitTestArea && !e.useHitTestArea) return true;
		if(b.useHitTestArea && !e.useHitTestArea) return b.hitTest(a.locX, a.locY, j / 3);
		if(b.hitTest(a.locX, a.locY, 0)) return true;
		var f = b.getCenter(a),
			g = e.getCenter(a),
			c = a.locX - f.x,
			d = a.locY - f.y,
			h = Math.sqrt(c * c + d * d);
		c = a.locX - g.x;
		d = a.locY - g.y;
		var i = Math.sqrt(c * c + d * d);
		return h <= i
	};
	c.getColorFromFillStyle = function(a) {
		if(a == null) return "#dddddd";
		if(typeof a == "string") return a;
		if(a.colorStops && a.colorStops[0]) {
			var b = a.colorStops[0].color;
			return b != "white" && b != "#ffffff" ? b : a.colorStops[1].color
		}
		return "#dddddd"
	};
	c.prototype.hitTest = function() {
		return false
	};
	c.prototype.boundsHitTest = function(b, c, a) {
		if(!this.useHitTestArea) a = 0;
		return b >= this.x - a && b <= this.x + this.width + a && c >= this.y - a && c <= this.y + this.height + a
	};
	c.prototype.render = function(a) {
		this.setProperties(a)
	};
	c.prototype.renderDashedLine = function(f, h, g, i, l, c) {
		var r = function(a, b) {
				return a <= b
			},
			q = function(a, b) {
				return a >= b
			},
			n = function(a, b) {
				return Math.min(a, b)
			},
			m = function(a, b) {
				return Math.max(a, b)
			},
			d = {
				thereYet: q,
				cap: n
			},
			e = {
				thereYet: q,
				cap: n
			};
		c.beginPath();
		if(h - i > 0) {
			e.thereYet = r;
			e.cap = m
		}
		if(f - g > 0) {
			d.thereYet = r;
			d.cap = m
		}
		c.moveTo(f, h);
		var a = f,
			b = h,
			k = 0,
			j = true,
			s = l.length;
		while(!(d.thereYet(a, g) && e.thereYet(b, i))) {
			var o = Math.atan2(i - h, g - f),
				p = l[k];
			a = d.cap(g, a + Math.cos(o) * p);
			b = e.cap(i, b + Math.sin(o) * p);
			if(j) c.lineTo(a, b);
			else c.moveTo(a, b);
			k = (k + 1) % s;
			j = !j
		}
		this.strokeStyle != null && this.lineWidth > 0 && c.stroke()
	};
	c.prototype.setProperties = function(a) {
		a.fillStyle = this._createGradient(a, this.fillStyle) || "#000000";
		a.strokeStyle = this.strokeStyle || "#000000";
		a.lineWidth = this.lineWidth || 0;
		a.lineCap = this.lineCap;
		a.lineJoin = this.lineJoin;
		a.miterLimit = this.miterLimit;
		a.shadowColor = this.shadowColor;
		a.shadowBlur = this.shadowBlur;
		a.shadowOffsetX = this.shadowOffsetX;
		a.shadowOffsetY = this.shadowOffsetY
	};
	c.prototype.calculateBounds = function(a) {
		if(a == null) return;
		for(var b = h, c = h, e = i, f = i, d = 0; d < a.length; d += 2) {
			var g = a[d],
				j = a[d + 1];
			b = Math.min(b, g);
			c = Math.min(c, j);
			e = Math.max(e, g);
			f = Math.max(f, j)
		}
		this.x = b;
		this.y = c;
		this.width = e - b;
		this.height = f - c;
		this.center = this.getCenter()
	};
	c.prototype.getCenter = function() {
		return this.center ? this.center : {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2
		}
	};
	c.prototype.getTooltipColor = function() {
		return c.getColorFromFillStyle(this.fillStyle)
	};
	c.prototype._createGradient = function(h, c) {
		if(c == null || typeof c == "string" || this.width == null || this.height == null || this.x == null || this.y == null) return c;
		var d, b = {
			x0: 0,
			y0: 0,
			x1: 1,
			y1: 1,
			r0: 0,
			r1: 1
		};
		a.extend(b, c);
		switch(c.type) {
			case "radialGradient":
				var k = this.x + b.x0 * this.width,
					m = this.y + b.y0 * this.height,
					i = b.r0 * this.width / 2,
					l = this.x + b.x1 * this.width,
					n = this.y + b.y1 * this.height,
					j = b.r1 * this.width / 2;
				d = h.createRadialGradient(k, m, i, l, n, j);
				break;
			default:
				var q = this.x + b.x0 * this.width,
					r = this.y + b.y0 * this.height,
					p = this.x + b.x1 * this.width,
					o = this.y + b.y1 * this.height;
				d = h.createLinearGradient(q, r, p, o)
		}
		var e = b.colorStops;
		if(e != null)
			for(var f = 0; f < e.length; f++) {
				var g = e[f];
				d.addColorStop(g.offset || 0, g.color)
			}
		return d
	};
	c.prototype._createHighlightShape = function(d) {
		var b = new c;
		a.extend(b, this);
		b.fillStyle = b.highlightingFillStyle || d;
		return b
	};
	c.prototype._getTooltipPosition = function(d, f, e, c, b) {
		var a = this._getTooltipOrigin(d);
		return this._getTooltipPositionFromOrigin(a.x, a.y, f, e, c, b)
	};
	c.prototype._getTooltipOrigin = function() {
		return this.tooltipOrigin ? this.tooltipOrigin : {
			x: this.x + this.width / 2,
			y: this.y
		}
	};
	c.prototype._getTooltipPositionFromOrigin = function(d, e, g, f) {
		var a = 15,
			b = d - g - a,
			c = e - f + 10;
		if(b < 0) b = Math.max(0, d + a);
		if(c < 0) c = Math.max(0, e - a);
		return {
			x: b,
			y: c
		}
	};
	c.prototype._getAnimationPoints = function(b, a) {
		if(b.length == a) return b;
		var c = a % 2;
		a -= c;
		var d = b.slice(0, a);
		c /= 2;
		var g = b[a - 2],
			h = b[a - 1],
			e = b[a],
			f = b[a + 1];
		e = g + (e - g) * c;
		f = h + (f - h) * c;
		d.push(e);
		d.push(f);
		return d
	};

	function m(a, d, b, e) {
		c.call(this);
		this.x1 = a;
		this.y1 = d;
		this.x2 = b;
		this.y2 = e;
		this.useHitTestArea = true
	}
	m.prototype = new c;
	m.constructor = new m;
	m.prototype.hitTest = function(f, g, j) {
		var b = this.x1,
			d = this.y1,
			c = this.x2,
			e = this.y2,
			a = Math.max(j, Math.max(3, this.lineWidth / 2));
		if(b == c) {
			var h = f + 1;
			return h > b - a && h < c + a && g >= d - a && g <= e + a ? true : false
		}
		if(d == e) {
			var i = g + .5;
			return f >= b - a && f <= c + a && i > d - a && i < e + a ? true : false
		}
		return false
	};
	m.prototype.hitTestNonHV = function(k, l, j) {
		var a = this.x1,
			b = this.y1,
			c = this.x2,
			d = this.y2;
		if(a < c) {
			this.x = a;
			this.width = c - a
		} else {
			this.x = c;
			this.width = a - c
		}
		if(b < d) {
			this.y = b;
			this.width = d - b
		} else {
			this.y = d;
			this.width = b - d
		}
		if(this.boundsHitTest(k, l, j) == false) return false;
		var g = c - a,
			h = d - b,
			e, f, i;
		if(g == 0) {
			e = 1;
			f = 0;
			i = -a
		} else if(h == 0) {
			e = 0;
			f = -1;
			i = -b
		} else if(Math.abs(g) < Math.abs(h)) {
			e = 1;
			f = g / h;
			i = -((a * d - b * c) / h)
		} else {
			e = -(h / g);
			f = -1;
			i = -((b * c - a * d) / g)
		}
		var n = Math.sqrt(e * e + f * f),
			m = (e * k - f * l + i) / n,
			o = Math.max(j, 3);
		return Math.abs(m) < o ? true : false
	};
	m.prototype.render = function(a) {
		if(!this.visible) return;
		c.prototype.render.call(this, a);
		var d = Math.floor(this.lineWidth % 2) ? b.roundH : Math.round,
			e = d(this.x1),
			g = d(this.y1),
			f = d(this.x2),
			h = d(this.y2);
		if(this.strokeDashArray) {
			this.renderDashedLine(e, g, f, h, this.strokeDashArray, a);
			return
		}
		a.beginPath();
		a.moveTo(e, g);
		a.lineTo(f, h);
		this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
	};

	function k(d, e, b, a) {
		c.call(this);
		this.x = d;
		this.y = e;
		this.width = b;
		this.height = a;
		this.cornerRadius = 0
	}
	k.prototype = new c;
	k.constructor = new k;
	k.prototype.hitTest = function(b, c, a) {
		return this.boundsHitTest(b, c, a)
	};
	k.prototype.render = function(d) {
		if(!this.visible) return;
		c.prototype.render.call(this, d);
		var j = this.strokeStyle != null && this.lineWidth > 0,
			m = j && Math.floor(this.lineWidth % 2) ? b.roundH : Math.round,
			l = this.correction || 0;
		l = Math.round(l);
		var h = m(this.x),
			i = m(this.y),
			f = Math.round(this.width),
			e = Math.round(this.height),
			a = this.context;
		if(this.xDecrease) {
			var k = a.series.realYAxis.crossing,
				g = Math.round(this.xDecrease);
			f -= g;
			if(a && (a.y < k || a.from >= a.to)) h += g
		}
		if(!b.isNull(this.yDecrease)) {
			var k = a.series.realYAxis.crossing,
				g = Math.round(this.yDecrease);
			e -= g;
			if(!a || a.y >= k || a.from < a.to) i += g
		}
		if(f <= 0 || e <= 0) return;
		if(this.cornerRadius == 0) this.renderRectPath(d, h, i, f, e);
		else this.renderRoundedRectPath(d, h, i, f, e);
		this.fillStyle != null && d.fill();
		j && d.stroke()
	};
	k.prototype.renderRectPath = function(a, b, c, e, d) {
		a.beginPath();
		a.moveTo(b, c);
		a.lineTo(b + e, c);
		a.lineTo(b + e, c + d);
		a.lineTo(b, c + d);
		a.closePath()
	};
	k.prototype.renderRoundedRectPath = function(b, c, d, g, f) {
		var a = this.cornerRadius,
			e = Math.PI / 2;
		b.beginPath();
		b.moveTo(c + a, d);
		b.lineTo(c + g - a, d);
		b.arc(c + g - a, d + a, a, -e, 0, false);
		b.lineTo(c + g, d + f - a);
		b.arc(c + g - a, d + f - a, a, 0, e, false);
		b.lineTo(c + a, d + f);
		b.arc(c + a, d + f - a, a, e, 2 * e, false);
		b.lineTo(c, d + a);
		b.arc(c + a, d + a, a, 2 * e, -e, false);
		b.closePath()
	};

	function Bb(d, e, b, a) {
		c.call(this);
		this.x = d;
		this.y = e;
		this.width = b;
		this.height = a
	}
	Bb.prototype = new c;
	Bb.constructor = new Bb;
	Bb.prototype.hitTest = function(f, g, a) {
		if(this.boundsHitTest(f, g, a) == false) return false;
		var c = (this.width + a) / 2,
			b = (this.height + a) / 2,
			h = this.x + c,
			i = this.y + b,
			d = f - h,
			e = g - i,
			j = d * d / (c * c),
			k = e * e / (b * b);
		return j + k <= 1
	};
	Bb.prototype.render = function(a) {
		if(!this.visible) return;
		c.prototype.render.call(this, a);
		var d = this.x,
			f = this.y,
			l = this.width,
			k = this.height,
			g = this.width / 2 * .5522848,
			h = this.height / 2 * .5522848,
			i = d + l,
			j = f + k,
			e = d + l / 2,
			b = f + k / 2;
		a.beginPath();
		a.moveTo(d, b);
		a.bezierCurveTo(d, b - h, e - g, f, e, f);
		a.bezierCurveTo(e + g, f, i, b - h, i, b);
		a.bezierCurveTo(i, b + h, e + g, j, e, j);
		a.bezierCurveTo(e - g, j, d, b + h, d, b);
		a.closePath();
		this.fillStyle != null && a.fill();
		this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
	};

	function Y(b, d, a) {
		c.call(this);
		this.x = b;
		this.y = d;
		this.radius = a;
		this.width = this.height = 2 * a
	}
	Y.prototype = new c;
	Y.constructor = new Y;
	Y.prototype.hitTest = function(e, f, a) {
		var c = this.x + this.width / 2,
			d = this.y + this.height / 2,
			b = Math.pow(e - c, 2) + Math.pow(f - d, 2);
		return b > Math.pow(this.radius + a, 2) ? false : true
	};
	Y.prototype.render = function(a) {
		if(!this.visible) return;
		c.prototype.render.call(this, a);
		a.beginPath();
		var b = this.radius;
		a.arc(Math.round(this.x + b), Math.round(this.y + b), Math.round(b), 0, Math.PI * 2, false);
		a.closePath();
		this.fillStyle != null && a.fill();
		this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
	};

	function lb(f, g, a, b, d) {
		c.call(this);
		this.x = f;
		this.y = g;
		this.radius = a;
		this.startAngle = b;
		this.endAngle = d;
		this.width = this.height = 2 * a;
		var e = (b + d) / 2,
			h = f + a * Math.cos(e),
			i = g + a * Math.sin(e);
		this.center = this.tooltipOrigin = {
			x: h,
			y: i
		}
	}
	lb.prototype = new c;
	lb.constructor = new lb;
	lb.prototype.hitTest = function(d, e) {
		var b = this.x,
			c = this.y,
			f = Math.pow(d - b, 2) + Math.pow(e - c, 2);
		if(f > Math.pow(this.radius, 2)) return false;
		var g = b - d,
			h = c - e,
			a = Math.atan2(h, g) + Math.PI;
		if(a > 3 * Math.PI / 2) a -= 2 * Math.PI;
		return a >= this.startAngle && a < this.endAngle ? true : false
	};
	lb.prototype.render = function(a) {
		if(!this.visible) return;
		if(this.startAngle == this.endAngle) return;
		c.prototype.render.call(this, a);
		a.beginPath();
		var b = Math.round(this.x),
			d = Math.round(this.y);
		a.moveTo(b, d);
		a.arc(b, d, Math.round(this.radius), this.startAngle, this.endAngle, false);
		a.closePath();
		this.fillStyle != null && a.fill();
		this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
	};

	function s() {
		c.call(this)
	}
	s.prototype = new c;
	s.constructor = new s;
	s.prototype.hitTest = function(k, l, g) {
		var e = this.context;
		if(!e || !e.points) return this.boundsHitTest(k, l, g);
		for(var d = this.pts, m = Math.pow(g, 2), c = -1, f = h, i, j, b, a = 0; a < d.length; a += 2) {
			i = d[a];
			j = d[a + 1];
			b = Math.pow(k - i, 2) + Math.pow(l - j, 2);
			if(b > f || b > m) continue;
			f = b;
			c = a
		}
		return c == -1 ? false : this.createHighlightMark(c)
	};
	s.prototype.createHighlightMark = function(c) {
		if(c == -1) return null;
		var d = this.context,
			f = this.pts,
			g = d.points[c / 2],
			e = 5,
			b = new Y(f[c] - e, f[c + 1] - e, e);
		b.fillStyle = b.highlightingFillStyle = this.strokeStyle;
		b.strokeStyle = "white";
		b.lineWidth = 1;
		b.useHitTestArea = true;
		b.context = {
			series: d.series,
			chart: d.chart
		};
		a.extend(b.context, g);
		return b
	};
	s.prototype.getCenter = function(g) {
		if(this.center) return this.center;
		var e = this.context;
		if(!e || !e.points) return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2
		};
		for(var b = this.pts, a = 0, f = h, i = g.locX, d, c = 0; c < b.length; c += 2) {
			d = Math.abs(b[c] - i);
			if(f > d) {
				f = d;
				a = c
			}
		}
		return {
			x: b[a],
			y: b[a + 1],
			mark: this.createHighlightMark(a)
		}
	};
	s.prototype.getLength = function() {
		return this.pts.length
	};

	function A(b, a) {
		s.call(this);
		this.pts = b;
		if(a) {
			this.isBoundsHitTest = a;
			this.calculateBounds(b)
		}
	}
	A.prototype = new s;
	A.constructor = new A;
	A.prototype.renderPoints = function(a, c) {
		var g = c.length;
		if(g <= 2) return;
		if(this.strokeDashArray) {
			this.renderDashed(a, c);
			return
		}
		for(var e = true, b = 2; b < g; b += 2) {
			var d = c[b];
			if(d == null) {
				a.stroke();
				e = false;
				continue
			}
			var f = c[b + 1];
			if(!e) {
				a.beginPath();
				a.moveTo(d, f);
				e = true;
				continue
			}
			a.lineTo(d, f);
			if(b % 1e3 == 0) {
				a.stroke();
				a.beginPath();
				a.moveTo(d, f)
			}
		}
	};
	A.prototype.render = function(d) {
		if(!this.visible) return;
		c.prototype.render.call(this, d);
		var a = this.pts;
		if(!b.isNull(this.length)) a = this._getAnimationPoints(a, this.length);
		var e = a.length;
		if(e <= 2) return;
		d.beginPath();
		d.moveTo(a[0], a[1]);
		this.renderPoints(d, a);
		this.strokeStyle != null && this.lineWidth > 0 && d.stroke()
	};
	A.prototype.renderDashed = function(j, f) {
		for(var i = f.length, h = this.strokeDashArray, c = false, d, e, a = 0; a < i; a += 2) {
			var b = f[a];
			if(b == null) {
				c = false;
				continue
			}
			var g = f[a + 1];
			if(!c) {
				d = b;
				e = g;
				c = true;
				continue
			}
			this.renderDashedLine(d, e, b, g, h, j);
			d = b;
			e = g
		}
	};

	function t(a, b) {
		s.call(this);
		if(!a) return;
		this.closed = b;
		this.pts = a;
		this.calculateBounds(a)
	}
	t.prototype = new s;
	t.constructor = new t;
	t.prototype.renderPoints = function(f, i) {
		var g = .4,
			h = this.closed,
			b = [];
		a.merge(b, i);
		var d = [],
			e = b.length;
		if(e <= 2) return;
		if(e == 4) {
			f.lineTo(b[2], b[3]);
			return
		}
		if(h) {
			b.push(b[0], b[1], b[2], b[3]);
			b.unshift(b[e - 1]);
			b.unshift(b[e - 1]);
			for(var c = 0; c < e; c += 2) d = d.concat(this.getControlPoints(b[c], b[c + 1], b[c + 2], b[c + 3], b[c + 4], b[c + 5], g));
			d = d.concat(d[0], d[1]);
			for(var c = 2; c < e + 2; c += 2) f.bezierCurveTo(d[2 * c - 2], d[2 * c - 1], d[2 * c], d[2 * c + 1], b[c + 2], b[c + 3])
		} else {
			for(var c = 0; c < e - 4; c += 2) d = d.concat(this.getControlPoints(b[c], b[c + 1], b[c + 2], b[c + 3], b[c + 4], b[c + 5], g));
			f.quadraticCurveTo(d[0], d[1], b[2], b[3]);
			for(var c = 2; c < e - 5; c += 2) f.bezierCurveTo(d[2 * c - 2], d[2 * c - 1], d[2 * c], d[2 * c + 1], b[c + 2], b[c + 3]);
			f.quadraticCurveTo(d[2 * e - 10], d[2 * e - 9], b[e - 2], b[e - 1])
		}
	};
	t.prototype.render = function(a) {
		if(!this.visible) return;
		c.prototype.render.call(this, a);
		var d = this.pts;
		if(!b.isNull(this.length)) d = this._getAnimationPoints(d, this.length);
		var e = d.length;
		if(e < 4) return;
		a.beginPath();
		a.moveTo(d[0], d[1]);
		this.renderPoints(a, d);
		if(this.closed) {
			a.closePath();
			this.fillStyle != null && a.fill()
		}
		this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
	};
	t.prototype.getControlPoints = function(d, f, a, b, e, g, j) {
		var h = Math.sqrt(Math.pow(a - d, 2) + Math.pow(b - f, 2)),
			k = Math.sqrt(Math.pow(e - a, 2) + Math.pow(g - b, 2)),
			c = j * h / (h + k),
			i = j - c,
			l = a + c * (d - e),
			m = b + c * (f - g),
			n = a - i * (d - e),
			o = b - i * (f - g);
		return [l, m, n, o]
	};

	function ab(b, c, e, f) {
		s.call(this);
		this.pts = b;
		this.crossPos = c;
		this.vertical = e;
		this.isCurve = f;
		if(b && b.length >= 2) {
			var d = [];
			a.merge(d, b);
			if(e) a.merge(d, [c, b[b.length - 1], c, b[1]]);
			else a.merge(d, [b[b.length - 2], c, b[0], c]);
			this.calculateBounds(d)
		}
	}
	ab.prototype = new s;
	ab.constructor = new ab;
	ab.prototype.render = function(d) {
		if(!this.visible) return;
		c.prototype.render.call(this, d);
		var a = this.pts;
		if(!b.isNull(this.length)) a = this._getAnimationPoints(a, this.length);
		var f = a.length;
		if(f <= 2) return;
		var e;
		if(this.isCurve) e = new t(a);
		else e = new A(a);
		d.beginPath();
		d.moveTo(a[0], a[1]);
		e.renderPoints(d, a);
		if(this.vertical) {
			d.lineTo(this.crossPos, a[a.length - 1]);
			d.lineTo(this.crossPos, a[1])
		} else {
			d.lineTo(a[a.length - 2], this.crossPos);
			d.lineTo(a[0], this.crossPos)
		}
		d.closePath();
		this.fillStyle != null && d.fill();
		this.strokeStyle != null && this.lineWidth > 0 && d.stroke()
	};

	function eb(c, d, e) {
		s.call(this);
		if(!c) return;
		this.pts1 = c;
		this.pts2 = d;
		this.pts = [];
		a.merge(this.pts, c);
		a.merge(this.pts, b.reversePoints(d));
		this.calculateBounds(this.pts);
		this.isCurve = e
	}
	eb.prototype = new s;
	eb.constructor = new eb;
	eb.prototype.getLength = function() {
		return this.pts.length / 2
	};
	eb.prototype.render = function(d) {
		if(!this.visible) return;
		c.prototype.render.call(this, d);
		var e = this.pts1,
			a = this.pts2;
		if(!b.isNull(this.length)) {
			e = this._getAnimationPoints(e, this.length);
			a = this._getAnimationPoints(a, this.length)
		}
		a = b.reversePoints(a);
		var g = e.length;
		if(g < 2) return;
		var f;
		if(this.isCurve) f = new t(e);
		else f = new A(e);
		d.beginPath();
		d.moveTo(e[0], e[1]);
		f.renderPoints(d, e);
		d.lineTo(a[0], a[1]);
		if(this.isCurve) f = new t(a);
		else f = new A(a);
		f.renderPoints(d, a);
		d.closePath();
		this.fillStyle != null && d.fill();
		this.strokeStyle != null && this.lineWidth > 0 && d.stroke()
	};

	function M(a) {
		s.call(this);
		this.pts = a;
		this.calculateBounds(a)
	}
	M.prototype = new s;
	M.constructor = new M;
	M.prototype.hitTest = function(j, a, h) {
		var k = this.context;
		if(k && k.points) return s.prototype.hitTest.call(this, j, a, h);
		var n = this.boundsHitTest(j, a, h);
		if(n == false) return false;
		if(this.isBoundsHitTest && h) return true;
		for(var b = this.pts, g = false, l = b.length, i, c, m, e, d = 0, f = 0; f < l; f += 2) {
			d += 2;
			if(d == l) d = 0;
			i = b[f];
			c = b[f + 1];
			m = b[d];
			e = b[d + 1];
			if(c < a && e >= a || e < a && c >= a)
				if(i + (a - c) / (e - c) * (m - i) < j) g = !g
		}
		return g
	};
	M.prototype.render = function(a) {
		if(!this.visible) return;
		c.prototype.render.call(this, a);
		var b = this.pts,
			e = b.length;
		if(e < 4) return;
		a.beginPath();
		a.moveTo(b[0], b[1]);
		for(var d = 2; d < e; d += 2) a.lineTo(b[d], b[d + 1]);
		a.closePath();
		this.fillStyle != null && a.fill();
		this.strokeStyle != null && this.lineWidth > 0 && a.stroke()
	};

	function w(a, b, c) {
		this.text = a;
		this.x = b;
		this.y = c;
		this.strokeStyle = null;
		this.textBaseline = "middle";
		this.font = "10px sans-serif";
		this.textAlign = "left"
	}
	w.prototype = new c;
	w.constructor = w;
	w.prototype.render = function(a) {
		if(!this.visible) return;
		c.prototype.render.call(this, a);
		var d = b.roundH(this.x),
			e = b.roundH(this.y);
		if(this.rotationAngle && this.rotX && this.rotY) {
			a.save();
			a.translate(this.rotX, this.rotY);
			a.rotate(this.rotationAngle);
			this.flip && a.scale(-1, -1);
			this.fillStyle != null && a.fillText(this.text, 0, 0);
			this.strokeStyle != null && a.strokeText(this.text, 0, 0);
			a.restore()
		} else {
			this.fillStyle != null && a.fillText(this.text, d, e);
			this.strokeStyle != null && a.strokeText(this.text, d, e)
		}
	};
	w.prototype.measure = function(a) {
		this.setProperties(a);
		var d = a.measureText(this.text),
			b = parseFloat(this.font) || 0,
			c = d.width;
		this.width = c;
		this.height = b;
		return {
			width: c,
			height: b
		}
	};
	w.prototype.isInRect = function(e, f, h, g) {
		var a = this.x,
			b = this.y,
			d = this.width,
			c = this.height;
		switch(this.textAlign) {
			case "center":
				a -= d / 2;
				break;
			case "right":
				a -= d
		}
		switch(this.textBaseline) {
			case "middle":
				b -= c / 2;
				break;
			case "bottom":
				b -= c
		}
		return a >= e && b >= f && a + d <= e + h && b + c <= f + g
	};
	w.prototype.setProperties = function(a) {
		c.prototype.setProperties.call(this, a);
		a.font = this.font;
		a.textAlign = this.textAlign;
		a.textBaseline = this.textBaseline
	};

	function cb(b, c, a) {
		this.x = b;
		this.y = c;
		this.src = a
	}
	cb.prototype = new c;
	cb.constructor = cb;
	cb.prototype.hitTest = function(b, c, a) {
		return this.boundsHitTest(b, c, a)
	};
	cb.prototype.render = function(e) {
		if(!this.visible) return;
		var b = new Image,
			c = this.x,
			d = this.y,
			a = this;
		b.onload = function() {
			var g = b.width,
				f = b.height;
			c -= g / 2;
			d -= f / 2;
			a.x = c;
			a.y = d;
			if(a.offsetX) c += a.offsetX;
			if(a.offsetY) d += a.offsetY;
			a.width = g;
			a.height = f;
			e.drawImage(b, c, d)
		};
		b.src = this.src
	};
	cb.prototype._createHighlightShape = function(b) {
		var a = new k;
		a.context = this.context;
		a.x = this.x;
		a.y = this.y;
		a.width = this.width;
		a.height = this.height;
		a.fillStyle = b;
		a.strokeStyle = "grey";
		return a
	};

	function P(a, b) {
		if(this.canvas == null) {
			this.canvas = a;
			this.ctx = this._getContext(this.canvas)
		}
		this.chart = b
	}
	P.prototype._getContext = function(a) {
		return a.getContext ? a.getContext("2d") : null
	};
	P.prototype._render = function(e) {
		var d = this.offsetX && this.offsetY,
			g = this.chart.options,
			b = this.ctx;
		b.globalAlpha = g.globalAlpha;
		if(d) {
			b.save();
			b.translate(this.offsetX, this.offsetY)
		}
		for(var c = 0; c < e.length; c++) {
			var a = e[c];
			if(a) {
				!this.isHighlighting && a.context && a.context.series && this.chart.elem.trigger("shapeRendering", a);
				if(a.src && this.isExcanvas) {
					a.offsetX = this.offsetX;
					a.offsetY = this.offsetY;
					b.translate(-this.offsetX, -this.offsetY);
					a.render(b);
					b.translate(this.offsetX, this.offsetY)
				} else {
					var f = a.shadowColor;
					a.shadowColor = null;
					a.render(b);
					a.shadowColor = f
				}
			}
		}
		d && b.restore()
	};
	P.prototype._renderShadows = function(e) {
		if(g.use_excanvas) return;
		var d = this.offsetX && this.offsetY,
			f = this.chart.options,
			a = this.ctx;
		a.globalAlpha = f.globalAlpha;
		if(d) {
			a.save();
			a.translate(this.offsetX, this.offsetY)
		}
		for(var c = 0; c < e.length; c++) {
			var b = e[c];
			b && b.shadowColor && b.render(a)
		}
		d && a.restore()
	};
	P.prototype._clear = function() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	};

	function Z(a) {
		this.defaults = {
			font: "14px sans-serif",
			fillStyle: "black",
			lineWidth: 0,
			margin: 6
		};
		this.x = 0;
		this.y = 0;
		this.setOptions(a)
	}
	Z.prototype._render = function(a) {
		if(this.text == null) return;
		this.textBlock.x = this.x + this.margin;
		this.textBlock.y = this.y + this.margin;
		this.textBlock.rotX = this.rotX;
		this.textBlock.rotY = this.rotY;
		this.textBlock.rotationAngle = this.rotationAngle;
		a.push(this.textBlock)
	};
	Z.prototype._measure = function() {
		var a;
		if(!this.text) {
			this.width = 0;
			this.height = 0;
			return
		}
		a = this.textBlock.measure(this.chart.ctx);
		var b = 2 * this.margin;
		this.width = a.width + b;
		this.height = a.height + b
	};
	Z.prototype.setOptions = function(c) {
		var b = a.extend({}, this.defaults, c || {});
		a.extend(this, b);
		this.textBlock = new w(this.text);
		this.textBlock.textBaseline = "top";
		this.textBlock.font = this.font;
		this.textBlock.fillStyle = this.fillStyle;
		this.textBlock.strokeStyle = this.strokeStyle;
		this.textBlock.lineWidth = this.lineWidth
	};

	function gb(a) {
		this.defaults = {
			visible: true,
			strokeStyle: "black",
			lineWidth: 1,
			lineCap: "butt",
			lineJoin: "miter",
			miterLimit: 10,
			cornerRadius: 10,
			padding: 4
		};
		this.x = 0;
		this.y = 0;
		this.setOptions(a)
	}
	gb.prototype._setShapeSettings = function(a) {
		a.fillStyle = this.fillStyle;
		a.strokeStyle = this.strokeStyle;
		a.lineWidth = this.lineWidth;
		a.lineCap = this.lineCap;
		a.lineJoin = this.lineJoin;
		a.miterLimit = this.miterLimit;
		a.cornerRadius = this.cornerRadius
	};
	gb.prototype._render = function(c) {
		if(!this.visible) return;
		var a = this.lineWidth / 2,
			f = this.x + a,
			g = this.y + a,
			e = this.width - 2 * a,
			d = this.height - 2 * a,
			b = new k(f, g, e, d);
		this._setShapeSettings(b);
		c.push(b)
	};
	gb.prototype.setOptions = function(c) {
		var b = a.extend({}, this.defaults, c || {});
		a.extend(this, b)
	};
	gb.prototype.getPadding = function() {
		return !this.visible ? 0 : this.lineWidth + this.cornerRadius / 2 + this.padding
	};

	function zb(a) {
		this.defaults = {
			strokeStyle: "gray",
			lineWidth: 1,
			visible: true
		};
		this.setOptions(a)
	}
	zb.prototype._setLineSettings = function(a) {
		a.strokeStyle = this.strokeStyle;
		a.lineWidth = this.lineWidth;
		a.strokeDashArray = this.strokeDashArray
	};
	zb.prototype.setOptions = function(c) {
		var b = a.extend({}, this.defaults, c || {});
		a.extend(this, b)
	};

	function Ab(a) {
		this.defaults = {
			strokeStyle: "black",
			lineWidth: 1,
			length: 6,
			position: "outside",
			visible: true,
			zIndex: 2,
			offset: .4
		};
		this.setOptions(a)
	}
	Ab.prototype.isInside = function() {
		return this.position == "inside"
	};
	Ab.prototype._setLineSettings = function(a) {
		a.strokeStyle = this.strokeStyle;
		a.lineWidth = this.lineWidth;
		a.strokeDashArray = this.strokeDashArray
	};
	Ab.prototype.setOptions = function(c) {
		var b = a.extend({}, this.defaults, c || {});
		a.extend(this, b)
	};

	function Eb(a) {
		this.defaults = {
			fillStyle: "rgba(204, 204, 204, 0.5)",
			lineWidth: 1
		};
		this.setOptions(a)
	}
	Eb.prototype._setSettings = function(a) {
		a.fillStyle = this.fillStyle;
		a.strokeStyle = this.strokeStyle;
		a.lineWidth = this.lineWidth
	};
	Eb.prototype.setOptions = function(c) {
		var b = a.extend({}, this.defaults, c || {});
		a.extend(this, b)
	};

	function Q(a) {
		R.call(this, a)
	}
	Q.prototype = new R;
	Q.constructor = Q;
	Q.prototype.canStart = function(a) {
		if(!this.view.gridArea.isMouseOver) return false;
		if(this.view.canZoom) {
			a.preventDefault();
			return true
		}
		return false
	};
	Q.prototype.start = function() {
		for(var c = [], b = this.view.axes.items, a = 0; a < b.length; a++) b[a].zoomEnabled && c.push(b[a]);
		this.zoomableAxes = c;
		this.oldMouseInput = this.view.mouseInput;
		this.currCursor = this.view.elem.css("cursor").toString();
		this.view.elem.css("cursor", "move");
		this.view.elem.css("cursor", "-moz-grabbing")
	};
	Q.prototype.mouseMove = function() {
		for(var f = this.zoomableAxes, a = this.view.mouseInput, c = this.zoomableAxes, d = this.oldMouseInput.locX - a.locX, e = this.oldMouseInput.locY - a.locY, b = 0; b < c.length; b++) c[b]._moveVisibleRange(d, e);
		this.oldMouseInput = a;
		this.view.partialDelayedUpdate()
	};
	Q.prototype.mouseUp = function() {
		this.stopTool()
	};
	Q.prototype.stop = function() {
		this.zoomableAxes = null;
		this.view.elem.css("cursor", this.currCursor);
		R.prototype.stop.call(this)
	};

	function L(a) {
		R.call(this, a)
	}
	L.prototype = new R;
	L.constructor = L;
	L.prototype.canStart = function(d) {
		if(!this.view.canZoom) return false;
		for(var b = this.view.touchInput, a = 0; a < b.length; a++) {
			var c = b[a];
			if(!this.view.gridArea._contains(c.locX, c.locY)) return false
		}
		d.preventDefault();
		return true
	};
	L.prototype.start = function() {
		for(var c = [], b = this.view.axes.items, a = 0; a < b.length; a++) b[a].zoomEnabled && c.push(b[a]);
		this.zoomableAxes = c;
		this.oldTouchInput = this.view.touchInput
	};
	L.prototype.touchMove = function(b) {
		b.preventDefault();
		if(!this.oldTouchInput) {
			this.oldTouchInput = this.view.touchInput;
			return
		}
		var c = this.view.touchInput.length;
		if(c > 2) return;
		var a = false;
		if(c == 2) a = true;
		if(this.isScaling != a) {
			this.oldTouchInput = this.view.touchInput;
			this.isScaling = a
		}
		if(a) this.doScale(b);
		else this.doPan(b)
	};
	L.prototype.touchEnd = function() {
		if(this.view.touchInput.length == 0) this.stopTool();
		else this.oldTouchInput = null
	};
	L.prototype.stop = function() {
		this.zoomableAxes = null;
		this.oldTouchInput = null;
		R.prototype.stop.call(this)
	};
	L.prototype.doPan = function() {
		for(var e = this.zoomableAxes, c = this.view.touchInput, d = c[0], b = this.oldTouchInput[0], f = b.locX - d.locX, g = b.locY - d.locY, a = 0; a < e.length; a++) e[a]._moveVisibleRange(f, g);
		this.oldTouchInput = c;
		this.view.partialDelayedUpdate()
	};
	L.prototype.doScale = function() {
		var a = this.view.touchInput;
		if(!this.oldTouchInput || this.oldTouchInput.length != 2) {
			this.oldTouchInput = a;
			return
		}
		for(var d = this.getTwoTouchPointData(this.oldTouchInput), e = this.getTwoTouchPointData(a), c = this.zoomableAxes, b = 0; b < c.length; b++) c[b]._scaleVisibleRange(d, e);
		this.oldTouchInput = a;
		this.view.partialDelayedUpdate()
	};
	L.prototype.getTwoTouchPointData = function(b) {
		var a = {
			x1: b[0].locX,
			y1: b[0].locY,
			x2: b[1].locX,
			y2: b[1].locY
		};
		a.centerX = (a.x1 + a.x2) / 2;
		a.centerY = (a.y1 + a.y2) / 2;
		a.dx = Math.abs(a.x2 - a.x1);
		a.dy = Math.abs(a.y2 - a.y1);
		return a
	};

	function f(b) {
		this.pluginClass = "ui-jqchart";
		this.tooltipClass = "ui-jqchart-tooltip";
		g.call(this, b);
		this.timer = new Kb(a.proxy(this.partialUpdate, this));
		this.storyboard = new Gb(a.proxy(this._renderShapes, this));
		this.mouseDownTools.push(new Q(this));
		this.touchMoveTools.push(new L(this))
	}
	f.prototype = new g;
	f.constructor = f;
	f.prototype._createElements = function(c) {
		g.prototype._createElements.call(this, c);
		if(g.use_excanvas) {
			this.areaCanvas = this._createCanvas(true);
			var b = a('<div style="position:absolute"></div>');
			this.elem.append(b);
			b.append(this.areaCanvas);
			this.areaRenderer = new P(this.areaCanvas, this);
			this.areaRenderer.div = b;
			this.areaRenderer.isExcanvas = true
		}
		this.chCanvas = this._createCanvas();
		this.chRenderer = new P(this.chCanvas, this);
		this._createHighlightRenderer();
		this.gridArea = new E(this);
		this.border = new gb;
		this.paletteColors = new Cb;
		this.title = new Z;
		this.title.chart = this;
		this.legend = new hb;
		this.legend.chart = this;
		this.series = new u(this);
		this.axes = new r(this)
	};
	f.prototype._setOptions = function(j) {
		var c = j || {};
		if(typeof c.title == "string") c.title = {
			text: c.title
		};
		c.title = c.title || {};
		c.title = a.extend({}, a.fn.jqChart.defaults.title, c.title);
		c.crosshairs = a.extend(true, {}, a.fn.jqChart.defaults.crosshairs, c.crosshairs);
		c.tooltips = a.extend(true, {}, a.fn.jqChart.defaults.tooltips, c.tooltips);
		c.shadows = a.extend(true, {}, a.fn.jqChart.defaults.shadows, c.shadows);
		c.globalAlpha = b.isNull(c.globalAlpha) ? a.fn.jqChart.defaults.globalAlpha : c.globalAlpha;
		this.hasCrosshairs = c.crosshairs.enabled === true;
		this.hasTooltips = c.tooltips && !c.tooltips.disabled;
		this.hasHighlighting = c.tooltips && c.tooltips.highlighting;
		this.options = c;
		g.prototype._setOptions.call(this, c);
		var d = j || {};
		if(d.width) this.elem.css("width", d.width);
		else this.elem.width() == 0 && this.elem.css("width", "400px");
		if(d.height) this.elem.css("height", d.height);
		else this.elem.height() == 0 && this.elem.css("height", "250px");
		var f = this._width = this.elem.width(),
			e = this._height = this.elem.height(),
			c = this.options;
		this.border.setOptions(c.border);
		this.border.fillStyle = c.background || this.border.fillStyle;
		this.gridArea.fillStyle = c.chartAreaBackground;
		this.paletteColors.setOptions(c.paletteColors);
		this.title.setOptions(c.title);
		this.legend.setOptions(c.legend);
		this.series.setOptions(c.series);
		this.axes.setOptions(c.axes);
		this._setCanvasSize(this.canvas, f, e);
		this._setCanvasSize(this.chCanvas, f, e);
		this._setCanvasSize(this.hlCanvas, f, e);
		this.areaCanvas && this._setCanvasSize(this.areaCanvas, f, e);
		var h = this.options.scaleX,
			i = this.options.scaleY;
		if(h && i) {
			this._width /= h;
			this._height /= i;
			var k = this.canvas.getContext("2d");
			k.scale(h, i)
		}
		this.update()
	};
	f.prototype._measure = function() {
		this.title._measure();
		this.legend._measure();
		return this.axes._measure()
	};
	f.prototype._arrange = function() {
		var g = this._width,
			f = this._height;
		this.border.width = g;
		this.border.height = f;
		var c = this.border.getPadding();
		g -= 2 * c;
		f -= 2 * c;
		var d = c,
			e = c + this.title.height,
			m = this.axes._getTotalWidth(),
			l = this.axes._getTotalHeight();
		if(this.legend._isHorizontal()) {
			this.gridArea.width = Math.round(g - m);
			this.gridArea.height = Math.round(f - (l + this.title.height + this.legend.height))
		} else {
			this.gridArea.width = Math.round(g - (m + this.legend.width));
			this.gridArea.height = Math.round(f - (l + this.title.height))
		}
		switch(this.legend.location) {
			case "left":
				d += this.legend.width;
				break;
			case "top":
				e += this.legend.height
		}
		for(var i = this.axes._getAxesInLoc("left"), b = i.length - 1; b >= 0; b--) {
			var a = i[b];
			a.x = d;
			a.height = this.gridArea.height;
			d = Math.ceil(d + a.width)
		}
		this.gridArea.x = d;
		d += this.gridArea.width;
		for(var j = this.axes._getAxesInLoc("right"), b = 0; b < j.length; b++) {
			var a = j[b];
			a.x = d;
			a.height = this.gridArea.height;
			d = Math.ceil(d + a.width)
		}
		for(var n = this.axes._getAxesInLoc("top"), b = n.length - 1; b >= 0; b--) {
			var a = n[b];
			a.x = this.gridArea.x;
			a.y = e;
			a.width = this.gridArea.width;
			e = Math.ceil(e + a.height)
		}
		this.gridArea.y = e;
		e += this.gridArea.height;
		for(var h = this.axes._getAxesInLoc("bottom"), b = 0; b < h.length; b++) {
			var a = h[b];
			a.x = this.gridArea.x;
			a.y = e;
			a.width = this.gridArea.width;
			e = Math.ceil(e + a.height)
		}
		for(var k = i.concat(j), b = 0; b < k.length; b++) {
			var a = k[b];
			a.y = this.gridArea.y
		}
		for(var h = this.axes._getAxesInLoc("radial"), b = 0; b < h.length; b++) {
			var a = h[b];
			a.x = this.gridArea.x;
			a.y = this.gridArea.y;
			a.width = this.gridArea.width;
			a.height = this.gridArea.height
		}
		this.title.x = this.gridArea.x + (this.gridArea.width - this.title.width) / 2;
		this.title.y = c;
		switch(this.legend.location) {
			case "bottom":
				this.legend.x = this.gridArea.x + (this.gridArea.width - this.legend.width) / 2;
				this.legend.y = c + f - this.legend.height;
				break;
			case "left":
				this.legend.x = c;
				this.legend.y = this.gridArea.y + (this.gridArea.height - this.legend.height) / 2;
				break;
			case "top":
				this.legend.x = this.gridArea.x + (this.gridArea.width - this.legend.width) / 2;
				this.legend.y = c + this.title.height;
				break;
			case "right":
			default:
				this.legend.x = c + g - this.legend.width;
				this.legend.y = this.gridArea.y + (this.gridArea.height - this.legend.height) / 2
		}
		this.gridArea._arrange();
		this.axes._arrange();
		this.legend._arrange()
	};
	f.prototype._processMouseMove = function() {
		var a = this.mouseInput;
		if(this.gridArea) {
			var b = this.gridArea._contains(a.locX, a.locY);
			if(this.gridArea.isMouseOver != b) {
				!b && this._clearRenderers();
				this.gridArea.isMouseOver = b
			}
		}
		if(this.gridArea.isMouseOver) {
			this._processMouseEvents();
			this._processTooltips(a);
			this._initCrosshairs(a)
		}
	};
	f.prototype._initTouchInput = function(c) {
		g.prototype._initTouchInput.call(this, c);
		var b = this.touchInput[0];
		if(!this.gridArea || !b) return;
		var a = this.gridArea._contains(b.locX, b.locY);
		if(this.gridArea.isTouchOver != a) {
			!a && this._clearRenderers();
			this.gridArea.isTouchOver = a
		}
	};
	f.prototype._processTouchStart = function(b) {
		if(!this.gridArea.isTouchOver) return;
		var a = this.touchInput[0];
		b.preventDefault();
		this._processTooltips(a);
		this._initCrosshairs(a)
	};
	f.prototype._processTouchMove = function(b) {
		if(!this.gridArea.isTouchOver) return;
		var a = this.touchInput[0];
		b.preventDefault();
		this._processTouchEvents();
		this._processTooltips(a);
		this._initCrosshairs(a)
	};
	f.prototype._clearRenderers = function() {
		g.prototype._clearRenderers.call(this);
		this.chRenderer && this.chRenderer._clear()
	};
	f.prototype._getClosestShapeAtX = function(e, f) {
		for(var b = null, i = h, j = f.locX, d = e.length - 1; d >= 0; d--) {
			var c = e[d];
			if(!c.context) continue;
			var a = c.getCenter(f),
				g = Math.abs(a.x - j);
			if(i > g) {
				i = g;
				b = c;
				if(a.mark) b = a.mark
			}
		}
		return b
	};
	f.prototype._getClosestShapeAtY = function(c, d) {
		for(var b = null, g = h, j = d.locY, a = c.length - 1; a >= 0; a--) {
			var e = c[a],
				i = e.getCenter(d).y,
				f = Math.abs(i - j);
			if(g > f) {
				g = f;
				b = e
			}
		}
		return b
	};
	f.prototype._getShapesAtX = function(g, c, e, f) {
		var b = [c],
			d = [c.context.series];
		a.each(e, function() {
			if(this != c && this.context) {
				var h = this.context.series,
					e = this.getCenter(f);
				if(a.inArray(h, d) == -1 && Math.abs(g - e.x) < 3) {
					if(e.mark) b.push(e.mark);
					else b.push(this);
					d.push(h)
				}
			}
		});
		return b
	};
	f.prototype._getTooltipShapes = function(h, i, f, c) {
		var b = null,
			e = this.options.tooltips;
		if(e.type == "shared") {
			var d = this._getClosestShapeAtX(this.shapes, c);
			if(d) b = this._getShapesAtX(d.getCenter(c).x, d, this.shapes, c)
		} else b = g.prototype._getTooltipShapes.call(this, h, i, f, c);
		if(b) {
			series = this.series.items;
			b.sort(function(d, e) {
				var b = a.inArray(d.context.series, series),
					c = a.inArray(e.context.series, series);
				return b - c
			})
		}
		return b
	};
	f.prototype._getTooltip = function(a) {
		return a.context.series._getTooltip(a.context)
	};
	f.prototype._initCrosshairs = function(a) {
		if(!this.hasCrosshairs) return;
		var f = this.options.crosshairs,
			d = a.locX,
			e = a.locY;
		if(f.snapToDataPoints) {
			var b = this._getClosestShapeAtX(this.shapes, a);
			if(b) {
				var g = this._getShapesAtX(b.getCenter(a).x, b, this.shapes, a);
				b = this._getClosestShapeAtY(g, a);
				if(b) {
					var c = b.getCenter(a);
					d = c.x;
					e = c.y
				}
			}
		}
		this._renderCrosshairs(d, e)
	};
	f.prototype._renderCrosshairs = function(g, h) {
		if(!this.hasCrosshairs) return;
		var c = this.gridArea,
			b = this.options.crosshairs,
			d = [];
		if(b.hLine && b.hLine.visible) {
			var e = new m(c.x, h, c.x + c.width, h);
			b.hLine && a.extend(e, b.hLine);
			d.push(e)
		}
		if(b.vLine && b.vLine.visible) {
			var f = new m(g, c.y, g, c.y + c.height);
			b.vLine && a.extend(f, b.vLine);
			d.push(f)
		}
		this.chRenderer._clear();
		this.chRenderer._render(d)
	};
	f.prototype._initZooming = function() {
		var b = this;
		a.each(this.axes.items, function() {
			if(this.zoomEnabled)
				if(this.location != "radial")
					if(this.isAxisVertical) b.canZoomVer = true;
					else b.canZoomHor = true
		});
		this.canZoom = this.canZoomVer || this.canZoomHor
	};
	f.prototype.setOptions = function() {};
	f.prototype.clear = function() {
		g.prototype.clear.call(this);
		g.use_excanvas && this.areaRenderer._clear()
	};
	f.prototype._setClip = function(b) {
		var a = this.gridArea;
		b.beginPath();
		b.rect(a.x, a.y, a.width, a.height);
		b.clip()
	};
	f.prototype._createShapes = function() {
		var b = {},
			d = this.gridArea,
			c = b.shapes = [];
		this.border._render(c);
		this.title._render(c);
		this.legend._render(c);
		d._render(c);
		b.postAxisShapes = this.axes._render(c);
		var h = b.stripes = [];
		d._renderStripes(h);
		d._renderPlots(h);
		this._addTrialWatermark(c);
		var f = b.nonGridAreaSerShapes = [];
		this.series._render(f);
		var g = b.serShapes = [];
		d._renderSeries(g);
		var e = [];
		a.merge(e, g);
		a.merge(e, f);
		this.shapes = e;
		this.allShapes = b
	};
	f.prototype._renderShapes = function() {
		this.shapeRenderer._clear();
		g.use_excanvas && this.areaRenderer._clear();
		var a = this.allShapes,
			f = this.gridArea,
			e = a.shapes,
			d = a.stripes;
		if(g.use_excanvas) this.areaRenderer._render(d);
		else {
			this.ctx.save();
			this._setClip(this.ctx);
			this.shapeRenderer._render(d);
			this.ctx.restore()
		}
		var c = a.nonGridAreaSerShapes;
		c.length > 0 && this.elem.trigger("seriesShapesRendering", [c]);
		this.shapeRenderer._render(e);
		this.shapeRenderer._render(c);
		var b = a.serShapes;
		b.length > 0 && this.elem.trigger("seriesShapesRendering", [b]);
		if(g.use_excanvas) this.areaRenderer._render(b);
		else {
			this.ctx.save();
			this._setClip(this.ctx);
			this.shapeRenderer._render(b);
			this.ctx.restore()
		}
		this.shapeRenderer._render(a.postAxisShapes)
	};
	f.prototype.render = function() {
		this._clearRenderers();
		this._createShapes();
		this._renderShapes()
	};
	f.prototype.render1 = function() {
		this.clear();
		var b = this.gridArea,
			d = [];
		this.border._render(d);
		this.title._render(d);
		this.legend._render(d);
		b._render(d);
		var h = this.axes._render(d),
			f = [];
		b._renderStripes(f);
		b._renderPlots(f);
		if(g.use_excanvas) this.areaRenderer._render(f);
		else {
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.rect(b.x, b.y, b.width, b.height);
			this.ctx.clip();
			this.shapeRenderer._render(f);
			this.ctx.restore()
		}
		this._addTrialWatermark(d);
		var e = [];
		this.series._render(e);
		e.length > 0 && this.elem.trigger("seriesShapesRendering", [e]);
		this.shapeRenderer._render(d);
		this.shapeRenderer._render(e);
		var c = [];
		b._renderSeries(c);
		c.length > 0 && this.elem.trigger("seriesShapesRendering", [c]);
		if(g.use_excanvas) this.areaRenderer._render(c);
		else {
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.rect(b.x, b.y, b.width, b.height);
			this.ctx.clip();
			this.shapeRenderer._render(c);
			this.ctx.restore()
		}
		this.shapeRenderer._render(h);
		a.merge(c, e);
		this.shapes = c
	};
	f.prototype.findAxis = function(a) {
		if(this.axes) return this.axes.find(a)
	};
	f.prototype.update = function() {
		this.series._initData();
		this.axes._initSeriesAxes();
		this.axes._initSeries();
		this._initZooming();
		this.series._initVisibleData();
		this.series._initColors();
		this.legend._init();
		this.axes._resetWH();
		for(var a = false, b = 0; b < 10; b++) {
			a = this._measure();
			this._arrange();
			this.axes._updateOrigins();
			this.axes._initRanges();
			this.axes._correctOrigins();
			if(a == false) break
		}
		this.render();
		this.storyboard.begin()
	};
	f.prototype.partialDelayedUpdate = function() {
		this.timer.kick()
	};
	f.prototype.partialUpdate = function() {
		this.series._initVisibleData();
		this.axes._resetWH();
		for(var a = false, b = 0; b < 10; b++) {
			a = this._measure();
			this._arrange();
			this.axes._updateOrigins();
			this.axes._initRanges();
			this.axes._correctOrigins();
			if(a == false) break
		}
		this.render()
	};
	f.prototype.highlightData = function(c) {
		var a = g.prototype.highlightData.call(this, c);
		if(a) {
			var b = a[0].getCenter();
			this._renderCrosshairs(b.x, b.y)
		}
	};
	f.prototype.destroy = function() {
		this.axes.clear();
		g.prototype.destroy.call(this)
	};

	function K(d, a, b, g, e, f) {
		c.call(this);
		this.x = d - f / 2;
		this.width = f;
		this.height = Math.abs(a - b);
		this.y = Math.min(a, b);
		this.isUp = e < g;
		this.tooltipOrigin = {
			x: d,
			y: Math.min(a, b)
		};
		this.center = {
			x: d,
			y: (g + e) / 2
		};
		this.createElements && this.createElements(d, a, b, g, e, f)
	}
	K.prototype = new c;
	K.constructor = new K;
	K.prototype.createElements = function(a, h, i, e, d, g) {
		var c = [],
			f = g / 2,
			b = new m(a, h, a, i);
		c.push(b);
		b = new m(a - f, e, a, e);
		c.push(b);
		b = new m(a, d, a + f, d);
		c.push(b);
		this.items = c
	};
	K.prototype.hitTest = function(c, d, a) {
		if(a) return this.boundsHitTest(c, d, a);
		for(var b = 0; b < this.items.length; b++) {
			var e = this.items[b];
			if(e.hitTest(c, d, a)) return true
		}
		return false
	};
	K.prototype.render = function(d) {
		if(!this.visible) return;
		c.prototype.render.call(this, d);
		for(var b = 0; b < this.items.length; b++) {
			var a = this.items[b];
			this.setProperties(a);
			if(this.isUp) {
				if(this.priceUpStrokeStyle) a.strokeStyle = this.priceUpStrokeStyle
			} else if(this.priceDownStrokeStyle) a.strokeStyle = this.priceDownStrokeStyle;
			a.render(d)
		}
	};
	K.prototype._createHighlightShape = function(c, d) {
		var b = new K;
		a.extend(b, this);
		b.fillStyle = c;
		b.priceUpFillStyle = c;
		b.priceDownFillStyle = c;
		b.strokeStyle = d;
		b.lineWidth += 2;
		return b
	};
	K.prototype.getTooltipColor = function() {
		if(this.isUp)
			if(this.priceUpStrokeStyle) return c.getColorFromFillStyle(this.priceUpStrokeStyle);
		return this.priceDownStrokeStyle ? c.getColorFromFillStyle(this.priceDownStrokeStyle) : c.prototype.getTooltipColor.call(this)
	};

	function bb(f, c, e, d, a, b) {
		K.call(this, f, c, e, d, a, b)
	}
	bb.prototype = new K;
	bb.constructor = new bb;
	bb.prototype.createElements = function(b, e, f, o, l, n) {
		var d = [],
			g = Math.floor(n / 2),
			b = Math.round(b),
			a = Math.round(o),
			c = Math.round(l);
		if(a > c) {
			var j = c;
			c = a;
			a = j
		}
		if(e > f) {
			var j = f;
			f = e;
			e = j
		}
		if(c - a >= 1) {
			var i = new k(b - g, a, 2 * g, c - a);
			i.useHitTestArea = true;
			d.push(i)
		} else {
			var h = new m(b - g, a, b + g, a);
			d.push(h)
		}
		var h = new m(b, e, b, a);
		d.push(h);
		var h = new m(b, c, b, f);
		d.push(h);
		this.items = d
	};
	bb.prototype.render = function(d) {
		if(!this.visible) return;
		c.prototype.render.call(this, d);
		for(var b = 0; b < this.items.length; b++) {
			var a = this.items[b];
			this.setProperties(a);
			if(a instanceof k)
				if(this.isUp) a.fillStyle = this.priceUpFillStyle;
				else a.fillStyle = this.priceDownFillStyle;
			a.render(d)
		}
	};
	bb.prototype.getTooltipColor = function() {
		return this.isUp ? c.getColorFromFillStyle(this.priceUpFillStyle) : c.getColorFromFillStyle(this.priceDownFillStyle)
	};

	function Cb(a) {
		this.colorsDefault = ["#418CF0", "#FCB441", "#E0400A", "#056492", "#BFBFBF", "#1A3B69", "#FFE382", "#129CDD", "#CA6B4B", "#005CDB", "#F3D288", "#506381", "#F1B9A8", "#E0830A", "#7893BE"];
		this.colorsGrayScale = Jb();
		this.defaults = {
			type: "default"
		};
		this.setOptions(a)
	}
	Cb.prototype.setOptions = function(c) {
		var b = a.extend({}, this.defaults, c || {});
		a.extend(this, b)
	};

	function Jb() {
		for(var e = 16, c = [], b = 0; b < e; b++) {
			var a = 200 - b * 11;
			a = a.toString();
			var d = "rgb(" + a + "," + a + "," + a + ")";
			c.push(d)
		}
		return c
	}
	Cb.prototype.getColor = function(b) {
		var a = this.getColors(this.type),
			c = a.length;
		b %= c;
		return a[b]
	};
	Cb.prototype.getColors = function(a) {
		switch(a.toLowerCase()) {
			case "customcolors":
				return this.customColors;
			case "grayscale":
				return this.colorsGrayScale;
			case "default":
			default:
				return this.colorsDefault
		}
	};

	function O(a) {
		this.defaults = {
			lineWidth: 1,
			lineCap: "butt",
			lineJoin: "miter",
			miterLimit: 10,
			size: 8,
			offset: 0,
			linkLineWidth: 1,
			type: "circle"
		};
		this.setOptions(a)
	}
	O.prototype._setShapeSettings = function(a) {
		a.fillStyle = this.fillStyle;
		a.strokeStyle = this.strokeStyle;
		a.lineWidth = this.lineWidth;
		a.lineCap = this.lineCap;
		a.lineJoin = this.lineJoin;
		a.miterLimit = this.miterLimit;
		a.shadowColor = this.shadowColor;
		a.shadowBlur = this.shadowBlur;
		a.shadowOffsetX = this.shadowOffsetX;
		a.shadowOffsetY = this.shadowOffsetY
	};
	O.prototype._setLineSettings = function(a) {
		a.lineWidth = this.linkLineWidth;
		a.strokeStyle = this.linkLineStrokeStyle
	};
	O.prototype.setOptions = function(c) {
		var b = a.extend({}, this.defaults, c || {});
		a.extend(this, b)
	};
	O.prototype.getSize = function() {
		return {
			width: this.size,
			height: this.size
		}
	};
	O.prototype.getShape = function(c, d, b, f) {
		if(this.visible === false) return null;
		var g = 2 * b,
			e = null;
		switch(this.type) {
			case "circle":
				e = new Y(c - b, d - b, b);
				break;
			case "rectangle":
				e = new k(c - b, d - b, g, g);
				break;
			case "diamond":
				var a = [];
				a.push(c);
				a.push(d - b);
				a.push(c + b);
				a.push(d);
				a.push(c);
				a.push(d + b);
				a.push(c - b);
				a.push(d);
				e = new M(a);
				e.isBoundsHitTest = true;
				break;
			case "triangle":
				var a = [];
				a.push(c);
				a.push(d - b);
				a.push(c + b);
				a.push(d + b);
				a.push(c - b);
				a.push(d + b);
				e = new M(a);
				e.isBoundsHitTest = true;
				break;
			case "line":
				e = new m(c - b, d, c + b, d);
				break;
			case "plus":
				var a = [];
				a.push(c - b);
				a.push(d);
				a.push(c + b);
				a.push(d);
				a.push(null);
				a.push(null);
				a.push(c);
				a.push(d - b);
				a.push(c);
				a.push(d + b);
				e = new A(a, true);
				break;
			case "image":
				if(!f) return null;
				e = new cb(c, d, f)
		}
		e.useHitTestArea = true;
		e.center = {
			x: Math.round(c),
			y: Math.round(d)
		};
		return e
	};
	O.prototype.isVisible = function() {
		return this.visible !== false && this.type != "none"
	};

	function Ib(a) {
		this.defaults = {
			strokeStyle: "gray",
			lineWidth: 1,
			title: {
				margin: 2,
				hAlign: "left",
				vAlign: "top"
			}
		};
		this.setOptions(a)
	}
	Ib.prototype = {
		_setLineSettings: function(a) {
			a.strokeStyle = this.strokeStyle;
			a.lineWidth = this.lineWidth;
			a.strokeDashArray = this.strokeDashArray
		},
		setOptions: function(b) {
			if(b != null && typeof b.title == "string") {
				b.title = {
					text: b.title
				};
				a.extend(b.title, this.defaults.title)
			}
			var c = a.extend(true, {}, this.defaults, b || {});
			a.extend(this, c)
		}
	};

	function Hb(a) {
		this.defaults = {
			fillStyle: "gray",
			lineWidth: 0,
			title: {
				margin: 2,
				hAlign: "left",
				vAlign: "top"
			}
		};
		this.setOptions(a)
	}
	Hb.prototype = {
		_setShapeSettings: function(a) {
			a.fillStyle = this.fillStyle;
			a.strokeStyle = this.strokeStyle;
			a.lineWidth = this.lineWidth;
			a.strokeDashArray = this.strokeDashArray
		},
		setOptions: function(b) {
			if(b != null && typeof b.title == "string") {
				b.title = {
					text: b.title
				};
				a.extend(b.title, this.defaults.title)
			}
			var c = a.extend(true, {}, this.defaults, b || {});
			a.extend(this, c)
		}
	};

	function hb(a) {
		this.defaults = {
			location: "right",
			title: {
				margin: 0
			},
			border: {
				padding: 2,
				strokeStyle: "grey",
				cornerRadius: 6
			},
			margin: 4,
			visible: true
		};
		this._itemMargin = 4;
		this.setOptions(a)
	}
	hb.prototype._isHorizontal = function() {
		return this.location == "top" || this.location == "bottom" ? true : false
	};
	hb.prototype._init = function() {
		this.items = [];
		if(this.visible == false) return;
		if(this.customItems)
			for(var d = 0; d < this.customItems.length; d++) {
				var b = this.customItems[d];
				if(b != null && typeof b.text == "string") b.text = {
					text: b.text
				};
				var h = {
					marker: {
						type: "rectangle",
						fillStyle: "#418CF0"
					}
				};
				b = a.extend(true, {}, h, b || {});
				var i = new O(b.marker);
				b.marker = i;
				var c = {};
				a.extend(c, b);
				c.text = b.text.text;
				c.font = b.text.font || "12px sans-serif";
				c.textFillStyle = b.text.fillStyle || "black";
				c.textStrokeStyle = b.text.strokeStyle;
				c.textLineWidth = b.text.lineWidth;
				var e = new db(c);
				e.chart = this.chart;
				this.items.push(e)
			} else
				for(var g = {
						font: this.font,
						textStrokeStyle: this.textStrokeStyle,
						textFillStyle: this.textFillStyle,
						textLineWidth: this.textLineWidth
					}, f = this.chart.series.items, d = 0; d < f.length; d++) {
					var j = f[d];
					a.merge(this.items, j._getLegendItems(g))
				}
	};
	hb.prototype._measure = function() {
		if(this.visible == false) {
			this.width = 0;
			this.height = 0;
			return
		}
		this.padding = this.border.getPadding();
		this.title._measure();
		var f = this.title.width,
			d = this.title.height;
		if(this.title.text) d += this.padding;
		for(var h = this._isHorizontal(), c = 0, b = 0, e = 0; e < this.items.length; e++) {
			var a = this.items[e];
			a._measure();
			if(h) {
				c += a.width + this._itemMargin;
				b = Math.max(b, a.height)
			} else {
				c = Math.max(c, a.width);
				b += a.height
			}
		}
		f = Math.max(f, c);
		d += b;
		var g = 2 * this.margin + 2 * this.padding;
		this.width = f + g;
		this.height = d + g
	};
	hb.prototype._arrange = function() {
		if(this.visible == false) return;
		var c = this.x + this.margin,
			a = this.y + this.margin,
			f = 2 * this.margin;
		this.border.x = c;
		this.border.y = a;
		var e = this.width - f;
		this.border.width = e;
		this.border.height = this.height - f;
		e -= 2 * this.padding;
		c += this.padding;
		a += this.padding;
		if(this.title.text) {
			this.title.x = c + (e - this.title.width) / 2;
			this.title.y = a;
			a += this.title.height + this.padding
		}
		for(var g = this._isHorizontal(), d = 0; d < this.items.length; d++) {
			var b = this.items[d];
			b.x = c;
			b.y = a;
			b._arrange();
			if(g) c += b.width + this._itemMargin;
			else a += b.height
		}
	};
	hb.prototype._render = function(a) {
		if(this.visible == false) return;
		this.border._render(a);
		this.title._render(a);
		for(var b = 0; b < this.items.length; b++) {
			var c = this.items[b];
			c._render(a)
		}
	};
	hb.prototype.setOptions = function(b) {
		if(b != null && typeof b.title == "string") {
			b.title = {
				text: b.title
			};
			a.extend(b.title, this.defaults.title)
		}
		var c = a.extend(true, {}, this.defaults, b || {});
		a.extend(this, c);
		this.margin = c.margin;
		this.border = new gb(c.border);
		this.border.fillStyle = this.background || this.border.fillStyle;
		this.title = new Z(c.title);
		this.title.chart = this.chart
	};

	function db(a) {
		this.defaults = {
			font: "12px sans-serif",
			textFillStyle: "black"
		};
		this.lblMargin = 4;
		this.setOptions(a)
	}
	db.prototype._measure = function() {
		var a;
		if(this.text) a = this.textBlock.measure(this.chart.ctx);
		else a = {
			width: 0,
			height: 0
		};
		this.width = a.width + this.marker.size + this.lblMargin;
		this.height = a.height
	};
	db.prototype._arrange = function() {
		var a = this.marker.size / 2,
			b = this.x + a,
			c = this.y + a + (this.height - this.marker.size) / 2;
		this.markerShape = this.marker.getShape(b, c, a);
		this.markerShape && this.marker._setShapeSettings(this.markerShape);
		this.textBlock.x = this.x + this.marker.size + this.lblMargin;
		this.textBlock.y = this.y
	};
	db.prototype._render = function(a) {
		a.push(this.markerShape);
		a.push(this.textBlock)
	};
	db.prototype.setOptions = function(c) {
		var b = a.extend(true, {}, this.defaults, c || {});
		a.extend(this, b);
		this.textBlock = new w(this.text);
		this.textBlock.textBaseline = "top";
		this.textBlock.font = this.font;
		this.textBlock.fillStyle = this.textFillStyle;
		this.textBlock.strokeStyle = this.textStrokeStyle;
		this.textBlock.lineWidth = this.textLineWidth
	};

	function E(a) {
		this.chart = a;
		this.border = new gb;
		this.border.cornerRadius = 0;
		this.border.lineWidth = 0;
		this.isMouseOver = false
	}
	E.prototype._arrange = function() {
		var a = this.x,
			b = this.y;
		this.border.x = a;
		this.border.y = b;
		this.border.width = this.width;
		this.border.height = this.height;
		this._arrangeRenderer(this.chart.areaRenderer);
		this._arrangeRenderer(this.chart.hlRenderer)
	};
	E.prototype._arrangeRenderer = function(a) {
		if(!g.use_excanvas) return;
		var e = this.x,
			f = this.y,
			b = a.canvas,
			h = a.div,
			d = Math.max(this.width, 0),
			c = Math.max(this.height, 0);
		h.css({
			left: e,
			top: f,
			width: d,
			height: c
		});
		b.width = d;
		b.height = c;
		a.offsetX = -e;
		a.offsetY = -f
	};
	E.prototype._render = function(a) {
		this.border.fillStyle = this.fillStyle;
		this.border._render(a);
		this._renderGridLines(a)
	};
	E.prototype._renderSeries = function(d) {
		for(var b = this.chart.series.items, a = 0; a < b.length; a++) {
			var c = b[a];
			!c.notInGridArea && c._render(d)
		}
	};
	E.prototype._renderStripes = function(e) {
		for(var c = this.chart.axes.items, b = 0; b < c.length; b++) {
			var f = c[b],
				d = this._getStripes(f);
			a.merge(e, d)
		}
	};
	E.prototype._renderPlots = function(c) {
		for(var d = this.chart.axes.items, b = 0; b < d.length; b++) {
			var e = d[b],
				f = this._getPlotBands(e);
			a.merge(c, f);
			var g = this._getPlotLines(e);
			a.merge(c, g)
		}
	};
	E.prototype._renderGridLines = function(e) {
		for(var f = this.chart.axes.items, d = 0; d < f.length; d++) {
			var b = f[d],
				c = b.majorGridLines;
			if(c == null && b.getOrientation() == "y") {
				c = new zb;
				if(b.minorGridLines != null) b.minorGridLines.major = c
			}
			var h = this._getGridLines(b, b.minorGridLines, false);
			a.merge(e, h);
			var g = this._getGridLines(b, c, true);
			a.merge(e, g)
		}
	};
	E.prototype._getStripes = function(b) {
		var d = b.stripes;
		if(d == null || a.isArray(d) != true) return [];
		var c = this,
			e = [];
		a.each(d, function() {
			var a = new Eb(this),
				j;
			if(a.interval) j = a.interval;
			else j = 2 * b.actualInterval;
			var i;
			if(a.width) i = a.width;
			else i = b.actualInterval;
			for(var h = a.lineWidth, o = h / 2, n = b._getIntervals(j, a, true), m = 0; m < n.length; m++) {
				var l = n[m];
				if(l >= b.actualVisibleMaximum) continue;
				var d = b.getPosition(l),
					p = b._getNextPosition(l, i),
					f = b.getPosition(p),
					g;
				if(b.isAxisVertical) g = new k(c.x + o, Math.min(d, f), c.width - h, Math.abs(f - d));
				else g = new k(Math.min(d, f), c.y + o, Math.abs(f - d), c.height - h);
				a._setSettings(g);
				e.push(g)
			}
		});
		return e
	};
	E.prototype._getGridLines = function(a, b, j) {
		if(a.location == "radial" || b == null || b.visible != true) return [];
		for(var h = [], n = a._getMarkInterval(b, j), i = a._getIntervals(n, b, j), c, d, e, f, g = 0; g < i.length; g++) {
			var l = a.getPosition(i[g]);
			if(a.isAxisVertical) {
				d = f = l;
				c = this.x;
				e = c + this.width
			} else {
				c = e = l;
				d = this.y;
				f = d + this.height
			}
			var k = new m(c, d, e, f);
			b._setLineSettings(k);
			h.push(k)
		}
		return h
	};
	E.prototype._getPlotLines = function(h) {
		var g = h.plotLines;
		if(g == null || a.isArray(g) != true) return [];
		for(var e = this, i = [], j = 0; j < g.length; j++) {
			var d = new Ib;
			if(!h.isAxisVertical) d.defaults.title.hAlign = "right";
			d.setOptions(g[j]);
			var f = d.lineWidth / 2,
				l = h.getPosition(d.value),
				c = new Z(d.title);
			c.chart = this.chart;
			c._measure();
			if(h.isAxisVertical) {
				y1 = y2 = l;
				x1 = this.x;
				x2 = x1 + this.width;
				c.x = x1;
				c.y = y1;
				switch(c.hAlign) {
					case "center":
						c.x = e.x + (e.width - c.width) / 2;
						break;
					case "right":
						c.x = e.x + e.width - c.width
				}
				switch(c.vAlign) {
					case "bottom":
						c.y += f;
						break;
					case "center":
						c.y -= c.height / 2;
						break;
					case "top":
						c.y -= c.height + f
				}
			} else {
				x1 = x2 = l;
				y1 = this.y;
				y2 = y1 + this.height;
				c.x = x1;
				c.y = y1;
				switch(c.hAlign) {
					case "right":
						c.x += f;
						break;
					case "center":
						c.x -= c.height / 2;
						break;
					case "left":
						c.x -= c.height + f
				}
				switch(c.vAlign) {
					case "center":
						c.y += (e.height - c.width) / 2;
						break;
					case "bottom":
						c.y += e.height - c.width
				}
				c.rotX = c.x + c.height - c.margin;
				c.rotY = c.y + c.margin;
				c.rotationAngle = b.radians(90)
			}
			var k = new m(x1, y1, x2, y2);
			d._setLineSettings(k);
			i.push(k);
			c._render(i)
		}
		return i
	};
	E.prototype._getPlotBands = function(g) {
		var j = g.plotBands;
		if(j == null || a.isArray(j) != true) return [];
		for(var l = this, p = [], q = 0; q < j.length; q++) {
			var d = new Hb;
			if(!g.isAxisVertical) d.defaults.title.hAlign = "right";
			d.setOptions(j[q]);
			var o = d.lineWidth,
				s = o / 2,
				m = g.getPosition(d.from),
				n = g.getPosition(d.to),
				h, i, f, e;
			if(g.isAxisVertical) {
				h = l.x + s;
				i = Math.min(m, n);
				f = l.width - o;
				e = Math.abs(n - m)
			} else {
				h = Math.min(m, n);
				i = l.y + s;
				f = Math.abs(n - m);
				e = l.height - o
			}
			var r = new k(h, i, f, e);
			d._setShapeSettings(r);
			p.push(r);
			var c = new Z(d.title);
			c.chart = this.chart;
			c._measure();
			if(g.isAxisVertical) {
				c.x = h;
				c.y = i;
				switch(c.hAlign) {
					case "center":
						c.x += (f - c.width) / 2;
						break;
					case "right":
						c.x += f - c.width
				}
				switch(c.vAlign) {
					case "center":
						c.y += (e - c.height) / 2;
						break;
					case "bottom":
						c.y += e - c.height
				}
			} else {
				c.x = h;
				c.y = i;
				switch(c.hAlign) {
					case "center":
						c.x += (f - c.height) / 2;
						break;
					case "right":
						c.x += f - c.height
				}
				switch(c.vAlign) {
					case "center":
						c.y += (e - c.width) / 2;
						break;
					case "bottom":
						c.y += e - c.width
				}
				c.rotX = c.x + c.height - c.margin;
				c.rotY = c.y + c.margin;
				c.rotationAngle = b.radians(90)
			}
			c._render(p)
		}
		return p
	};
	E.prototype._contains = function(a, b) {
		return a >= this.x && a <= this.x + this.width && b >= this.y && b <= this.y + this.height
	};
	E.prototype.getRight = function() {
		return this.x + this.width
	};

	function u(b, a) {
		this.chart = b;
		a && this.setOptions(a)
	}
	u.prototype.setOptions = function(e) {
		this.items = [];
		if(a.isArray(e) == false) return;
		for(var f = 0; f < e.length; f++) {
			var c = e[f];
			if(c == null) continue;
			var b, d = c.type || "column";
			d = d.toLowerCase();
			switch(d) {
				case "area":
					b = new X(c);
					break;
				case "splinearea":
					b = new tb(c);
					break;
				case "bar":
					b = new n(c);
					break;
				case "bubble":
					b = new V(c);
					break;
				case "line":
					b = new I(c);
					break;
				case "spline":
					b = new xb(c);
					break;
				case "pie":
					b = new v(c);
					break;
				case "scatter":
					b = new kb(c);
					break;
				case "stackedcolumn":
					b = new S(c);
					break;
				case "stackedbar":
					b = new T(c);
					break;
				case "rangecolumn":
					b = new G(c);
					break;
				case "rangebar":
					b = new H(c);
					break;
				case "stock":
					b = new z(c);
					break;
				case "candlestick":
					b = new ib(c);
					break;
				case "radar":
				case "radarline":
					b = new C(c);
					break;
				case "radararea":
					b = new wb(c);
					break;
				case "radarspline":
					b = new rb(c);
					break;
				case "radarsplinearea":
					b = new nb(c);
					break;
				case "polar":
				case "polarline":
					b = new x(c);
					break;
				case "polararea":
					b = new vb(c);
					break;
				case "polarspline":
					b = new qb(c);
					break;
				case "polarsplinearea":
					b = new mb(c);
					break;
				case "polarscatter":
					b = new pb(c);
					break;
				case "trendline":
					b = new N(c);
					break;
				case "verticalline":
					b = new J(c);
					break;
				case "verticalspline":
					b = new ub(c);
					break;
				case "verticalarea":
					b = new U(c);
					break;
				case "verticalsplinearea":
					b = new ob(c);
					break;
				case "range":
					b = new q(c);
					break;
				case "splinerange":
					b = new sb(c);
					break;
				case "column":
				default:
					b = new y(c)
			}
			b.type = d;
			b.chart = this.chart;
			this.items.push(b)
		}
	};
	u.prototype._initData = function() {
		for(var b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c._initData()
		}
	};
	u.prototype._initVisibleData = function() {
		for(var b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c._initVisibleData()
		}
	};
	u.prototype._initCategories = function() {
		for(var d = [], e = 0, a = 0, f = this.items, c = 0; c < f.length; c++) {
			var b = f[c];
			if(!b.categories) continue;
			for(a = e; a < b.categories.length; a++) {
				var g = b.categories[a];
				d.push(g)
			}
			e = a
		}
		this.categories = d
	};
	u.prototype._initRanges = function() {
		for(var e = h, d = i, c = h, b = i, g = this.items, f = 0; f < g.length; f++) {
			var a = g[f];
			if(e > a.min) e = a.min;
			if(d < a.max) d = a.max;
			if(c > a.minX) c = a.minX;
			if(b < a.maxX) b = a.maxX
		}
		this.min = e;
		this.max = d;
		this.minX = c;
		this.maxX = b
	};
	u.prototype._findClusters = function(g, f) {
		for(var c = -1, a = 0, d = this.items, b = 0; b < d.length; b++) {
			var e = d[b];
			if(e == g) c = a;
			if(e.type == f) a++
		}
		return {
			index: c,
			count: a
		}
	};
	u.prototype._findStackedClusters = function(h, e) {
		for(var f = h.stackedGroupName, g = this._getStackedGroupsFromType(e), l = a.inArray(f, g), k = g.length, i = -1, b = 0, j = this.items, d = 0; d < j.length; d++) {
			var c = j[d];
			if(c == h) i = b;
			if(c.type == e && c.stackedGroupName == f) b++
		}
		return {
			index: i,
			count: b,
			groupIndex: l,
			groupCount: k
		}
	};
	u.prototype._getSeriesFromType = function(e) {
		for(var b = [], c = this.items, a = 0; a < c.length; a++) {
			var d = c[a];
			d.type == e && b.push(d)
		}
		return b
	};
	u.prototype._getStackedSeriesFromType = function(e, f) {
		for(var c = [], d = this.items, b = 0; b < d.length; b++) {
			var a = d[b];
			a.type == e && a.stackedGroupName == f && c.push(a)
		}
		return c
	};
	u.prototype._getStackedGroupsFromType = function(c) {
		var b = [];
		a.each(this.items, function() {
			if(this.type == c) {
				var d = a.inArray(this.stackedGroupName, b);
				d == -1 && b.push(this.stackedGroupName)
			}
		});
		return b
	};
	u.prototype._initColors = function() {
		for(var b = this.chart.paletteColors, c = this.items, a = 0; a < c.length; a++) {
			var d = c[a];
			d._initColors(b.getColor(a), b)
		}
	};
	u.prototype._getPixelMargins = function(f) {
		for(var b = 0, a = 0, e = this.items, c = 0; c < e.length; c++) {
			var g = e[c],
				d = g._getPixelMargins(f);
			b = Math.max(b, d.left);
			a = Math.max(a, d.right)
		}
		return {
			left: b,
			right: a
		}
	};
	u.prototype._isAnchoredToOrigin = function() {
		for(var b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			if(c._isAnchoredToOrigin()) return true
		}
		return false
	};
	u.prototype._render = function(d) {
		for(var b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c.notInGridArea && c._render(d)
		}
	};
	u.prototype.getSeries = function(a) {
		return this.items[a]
	};

	function e(a) {
		this.setOptions(a)
	}
	e.prototype = {
		_getMarker: function(d, e, b, f, c) {
			if(b == null) b = this.markers.size / 2;
			var a = this.markers.getShape(d, e, b, c);
			if(a == null) return null;
			this.markers._setShapeSettings(a);
			this._setMarkerSettings(a);
			return a
		},
		_addMarker: function(d, e, i, c, h) {
			var a = this._correctMarkerPosition(d, e, c),
				f = this._getMarker(a.x, a.y, i, c, h),
				g = this.markers.offset,
				b = null;
			if(g) {
				b = new m(d, e, a.x, a.y);
				this.markers._setLineSettings(b);
				this._setMarkerLinkLineSettings(b)
			}
			return {
				marker: f,
				line: b,
				offset: a.offset
			}
		},
		_correctMarkerPosition: function(e, b, d) {
			var a = this.markers.offset;
			if(a) {
				var c = d >= this.realYAxis.crossing;
				b = c ? b - a : b + a
			}
			return {
				x: e,
				y: b,
				offset: a
			}
		},
		_addMarkerAndLabel: function(f, n, j, k, b, h, i, c, m, d) {
			var g = 0,
				p = i ? i : b;
			if(this.markers && this.markers.isVisible() && this.realYAxis.isValueVisible(c)) {
				if(!d) d = {
					chart: this.chart,
					series: this,
					dataItem: this.data[b],
					x: this.realXAxis._getValue(p),
					y: c
				};
				var o = d.dataItem[2],
					a = this._addMarker(j, k, null, c, o);
				if(a.marker) {
					a.marker.context = d;
					a.line && f.push(a.line);
					f.push(a.marker);
					g = this.markers.offset;
					this._addShapeAnimation(a.marker, b, h)
				}
			}
			if(this.labels && this.labels.visible !== false) {
				var l = this._getLabelValue(c, b),
					e = this._getDataPointLabel(c, j, k, m + g, l);
				e.context = {
					chart: this.chart,
					series: this,
					dataItem: this.data[b]
				};
				this.chart.elem.trigger("dataPointLabelCreating", e);
				n.push(e);
				this._addShapeAnimation(e, b, h)
			}
		},
		_getAnimation: function() {
			return this.animation || this.chart.options.animation
		},
		_addShapeAnimation: function(e, g, f) {
			var b = this._getAnimation();
			if(!b || b.enabled === false) return;
			var a = new jb(b, e, "visible", false, true),
				c = a.duration / f,
				d = a.delayTime + g * c;
			a.delayTime = d;
			a.duration = c;
			this.chart.storyboard.addAnimation(a)
		},
		_addLengthAnimation: function(b) {
			var a = this._getAnimation();
			if(!a || a.enabled === false) return;
			var c = new fb(a, b, "length", 0, b.getLength());
			this.chart.storyboard.addAnimation(c)
		},
		_setMarkerSettings: function(a) {
			a.fillStyle = a.fillStyle || this.fillStyle;
			a.shadowColor = a.shadowColor || this.shadowColor;
			a.shadowBlur = a.shadowBlur || this.shadowBlur;
			a.shadowOffsetX = a.shadowOffsetX || this.shadowOffsetX;
			a.shadowOffsetY = a.shadowOffsetY || this.shadowOffsetY
		},
		_setMarkerLinkLineSettings: function(a) {
			a.strokeStyle = a.strokeStyle || this.markers.strokeStyle || this.fillStyle
		},
		_setShapeSettings: function(a, c) {
			if(this.fillStyles && !b.isNull(c)) a.fillStyle = this.fillStyles[c % this.fillStyles.length];
			else a.fillStyle = this.fillStyle;
			a.strokeStyle = this.strokeStyle;
			a.lineWidth = this.lineWidth;
			a.lineCap = this.lineCap;
			a.lineJoin = this.lineJoin;
			a.miterLimit = this.miterLimit;
			a.strokeDashArray = this.strokeDashArray;
			a.shadowColor = this.shadowColor;
			a.shadowBlur = this.shadowBlur;
			a.shadowOffsetX = this.shadowOffsetX;
			a.shadowOffsetY = this.shadowOffsetY
		},
		_getXAxisType: function() {
			var b = this.data;
			if(a.isArray(b) == false) return "none";
			for(var d = 0; d < b.length; d++) {
				var c = b[d];
				if(c == null) continue;
				if(a.isArray(c) == false) return "CategoryAxis";
				var e = c[0];
				if(e == null) continue;
				var f = a.type(e);
				switch(f) {
					case "number":
						return "LinearAxis";
					case "date":
						return "DateTimeAxis";
					case "string":
						return "CategoryAxis";
					default:
						return "none"
				}
			}
			return "none"
		},
		_initXYData: function() {
			for(var k = this.data, f = h, e = i, d = h, c = i, l = k.length, j = 0; j < l; j++) {
				var g = k[j];
				if(g == null) continue;
				var a = g[0];
				if(d > a) d = a;
				if(c < a) c = a;
				var b = g[1];
				if(f > b) f = b;
				if(e < b) e = b
			}
			this.min = f;
			this.max = e;
			this.minX = d;
			this.maxX = c
		},
		_initCatValueData: function() {
			for(var j = this.data, g = h, f = i, e = [], k = j.length, d = 0; d < k; d++) {
				var c = j[d];
				if(c == null) {
					e.push((d + 1).toString());
					continue
				}
				var b = c;
				if(a.isArray(c) == false) e.push((d + 1).toString());
				else {
					e.push(c[0]);
					b = c[1]
				}
				if(g > b) g = b;
				if(f < b) f = b
			}
			this.min = g;
			this.max = f;
			this.categories = e
		},
		_initDateValueData: function() {
			for(var k = this.data, f = h, e = i, d = h, c = i, l = k.length, j = 0; j < l; j++) {
				var g = k[j];
				if(g == null) continue;
				var a = g[0].getTime();
				if(d > a) d = a;
				if(c < a) c = a;
				var b = g[1];
				if(f > b) f = b;
				if(e < b) e = b
			}
			this.min = f;
			this.max = e;
			this.minX = d;
			this.maxX = c
		},
		_initXYDataRange: function(n, p) {
			for(var m = this.data, j = h, g = i, f = h, e = i, o = m.length, k = 0; k < o; k++) {
				var d = m[k];
				if(d == null || a.isArray(d) == false) continue;
				var b = d[0];
				if(f > b) f = b;
				if(e < b) e = b;
				for(var l = n; l < p; l++) {
					var c = d[l];
					if(j > c) j = c;
					if(g < c) g = c
				}
			}
			this.min = j;
			this.max = g;
			this.minX = f;
			this.maxX = e
		},
		_initCatValueDataRange: function(k, m) {
			for(var j = this.data, e = h, d = i, c = [], l = j.length, b = 0; b < l; b++) {
				var f = j[b];
				if(f == null) {
					c.push((b + 1).toString());
					continue
				}
				c.push(f[0]);
				for(var g = k; g < m; g++) {
					var a = f[g];
					if(e > a) e = a;
					if(d < a) d = a
				}
			}
			this.min = e;
			this.max = d;
			this.categories = c
		},
		_initDateValueDataRange: function(n, p) {
			for(var m = this.data, j = h, g = i, f = h, e = i, o = m.length, k = 0; k < o; k++) {
				var d = m[k];
				if(d == null || a.isArray(d) == false) continue;
				var b = d[0].getTime();
				if(f > b) f = b;
				if(e < b) e = b;
				for(var l = n; l < p; l++) {
					var c = d[l];
					if(j > c) j = c;
					if(g < c) g = c
				}
			}
			this.min = j;
			this.max = g;
			this.minX = f;
			this.maxX = e
		},
		_initData: function() {
			var a = this._getXAxisType();
			this.xAxisType = a;
			switch(a) {
				case "LinearAxis":
					this._initXYData();
					return;
				case "DateTimeAxis":
					this._initDateValueData();
					return;
				case "CategoryAxis":
					this._initCatValueData();
					return
			}
		},
		_initVisibleData: function() {
			var a = this._getXAxisType();
			this.xAxisType = a;
			switch(a) {
				case "LinearAxis":
				case "DateTimeAxis":
					this._initVisibleXYData();
					return;
				case "CategoryAxis":
					this._initVisibleCatValueData();
					return
			}
		},
		_initVisibleXYData: function() {
			var a = this.realXAxis,
				o = this.realYAxis,
				n = a.zoomEnabled,
				p = o.zoomEnabled;
			if(p || !n) return;
			var d = a.visibleMinimum,
				c = a.visibleMaximum;
			if(b.isNull(d) || b.isNull(c)) return;
			if(a.skipEmptyDays) {
				d = a._addEmptyDaysOffset(d);
				c = a._addEmptyDaysOffset(c)
			}
			for(var l = this.data, g = h, f = i, q = l.length, k = 0; k < q; k++) {
				var j = l[k];
				if(j == null) continue;
				var m = j[0],
					e = j[1];
				if(m >= d && m <= c) {
					if(g > e) g = e;
					if(f < e) f = e
				}
			}
			this.min = g;
			this.max = f
		},
		_initVisibleCatValueData: function() {
			var c = this.realXAxis,
				o = this.realYAxis,
				n = c.zoomEnabled,
				p = o.zoomEnabled;
			if(p || !n) return;
			var g = c.visibleMinimum,
				f = c.visibleMaximum;
			if(b.isNull(g) || b.isNull(f)) return;
			if(c.skipEmptyDays) {
				g = c._addEmptyDaysOffset(g);
				f = c._addEmptyDaysOffset(f)
			}
			for(var m = this.data, l = h, k = i, q = m.length, e = 0; e < q; e++) {
				var j = m[e];
				if(j == null) continue;
				var d = j;
				if(a.isArray(j)) d = j[1];
				if(e + 1 >= g && e <= f) {
					if(l > d) l = d;
					if(k < d) k = d
				}
			}
			this.min = l;
			this.max = k
		},
		_initVisibleCatValueDataRange: function(q, s) {
			var a = this.realXAxis,
				o = this.realYAxis,
				n = a.zoomEnabled,
				p = o.zoomEnabled;
			if(p || !n) return;
			var e = a.visibleMinimum,
				d = a.visibleMaximum;
			if(b.isNull(e) || b.isNull(d)) return;
			if(a.skipEmptyDays) {
				e = a._addEmptyDaysOffset(e);
				d = a._addEmptyDaysOffset(d)
			}
			for(var l = this.data, j = h, g = i, r = l.length, c = 0; c < r; c++) {
				var m = l[c];
				if(m == null) continue;
				if(c + 1 >= e && c <= d)
					for(var k = q; k < s; k++) {
						var f = m[k];
						if(j > f) j = f;
						if(g < f) g = f
					}
			}
			this.min = j;
			this.max = g
		},
		_initVisibleXYDataRange: function(r, t) {
			var a = this.realXAxis,
				p = this.realYAxis,
				o = a.zoomEnabled,
				q = p.zoomEnabled;
			if(q || !o) return;
			var d = a.visibleMinimum,
				c = a.visibleMaximum;
			if(b.isNull(d) || b.isNull(c)) return;
			if(a.skipEmptyDays) {
				d = a._addEmptyDaysOffset(d);
				c = a._addEmptyDaysOffset(c)
			}
			for(var m = this.data, g = h, f = i, s = m.length, k = 0; k < s; k++) {
				var j = m[k];
				if(j == null) continue;
				var n = j[0];
				if(n >= d && n <= c)
					for(var l = r; l < t; l++) {
						var e = j[l];
						if(g > e) g = e;
						if(f < e) f = e
					}
			}
			this.min = g;
			this.max = f
		},
		_createXAxis: function() {
			var b = {
					location: "bottom",
					orientation: "x"
				},
				a;
			switch(this.xAxisType) {
				case "DateTimeAxis":
					a = new l(b);
					break;
				case "CategoryAxis":
					a = new D(b);
					break;
				default:
					a = new j(b)
			}
			a.chart = this.chart;
			return a
		},
		_createYAxis: function() {
			var a = new j({
				location: "left",
				orientation: "y"
			});
			a.chart = this.chart;
			return a
		},
		_initXAxis: function(b) {
			var a = this._findXAxis(b);
			if(a == null) {
				a = this._createXAxis();
				b.push(a)
			}
			this.realXAxis = a
		},
		_initYAxis: function(b) {
			var a = this._findYAxis(b);
			if(a == null) {
				a = this._createYAxis();
				b.push(a)
			}
			this.realYAxis = a
		},
		_initSharedAxes: function() {
			if(this.realXAxis && this.realYAxis) {
				this.realXAxis.sharedAxis = this.realYAxis;
				this.realYAxis.sharedAxis = this.realXAxis
			}
		},
		_findAxis: function(b, d) {
			if(d != null)
				for(var a = 0; a < b.length; a++) {
					var c = b[a];
					if(c.name == d) return c
				}
			return null
		},
		_findXAxis: function(b) {
			var a = this._findAxis(b, this.axisX);
			if(a != null) return a;
			for(var c = 0; c < b.length; c++) {
				a = b[c];
				if(a.getOrientation(this) != "x" || a.isVertical()) continue;
				if(a.DataType == this.xAxisType) return a
			}
			return null
		},
		_findYAxis: function(b) {
			var a = this._findAxis(b, this.axisY);
			if(a != null) return a;
			for(var c = 0; c < b.length; c++) {
				a = b[c];
				if(a.getOrientation(this) != "y" || a.isVertical() == false) continue;
				if(a.DataType == "LinearAxis") return a
			}
			return null
		},
		_getLegendItems: function(c) {
			var f = [],
				d;
			if(this.title != null) d = this.title;
			else {
				var g = a.inArray(this, this.chart.series.items) + 1;
				d = "Series " + g.toString()
			}
			var b = new O;
			b.fillStyle = this.fillStyle;
			b.lineWidth = this.lineWidth;
			b.strokeStyle = this.strokeStyle;
			switch(this.type) {
				case "line":
				case "trendline":
					b.type = "line";
					break;
				case "scatter":
					b.fillStyle = this.fillStyle;
					b.lineWidth = 0;
					if(this.markers) b.type = this.markers.type
			}
			c = a.extend(true, {}, c, {
				text: d,
				marker: b
			});
			var e = new db(c);
			e.chart = this.chart;
			e.series = this;
			f.push(e);
			return f
		},
		_initColors: function(a) {
			this.fillStyle = this.fillStyle || a;
			this.strokeStyle = this.strokeStyle || a
		},
		_getPixelMargins: function(f) {
			var h = 4,
				g = 0,
				d;
			if(this.markers) {
				d = this.markers.getSize();
				g = this.markers.offset
			} else d = {
				width: 0,
				height: 0
			};
			var c;
			if(this.labels && this.labels.visible !== false) {
				var i = new w("TEST");
				a.extend(i, this.labels);
				c = i.measure(this.chart.ctx)
			} else c = {
				width: 0,
				height: 0
			};
			var e = f.isVertical(),
				j = this.isVertical,
				b;
			if(e) b = d.height / 2 + c.height + h;
			else b = d.width / 2 + c.width + h;
			if(j && !e || !j && e) {
				b += g;
				b *= 1.25;
				var k = b / f.length;
				b *= 1 + k
			}
			if(f.getOrientation(this) == "x") b = Math.max(b, 6);
			else b = Math.max(b, 12);
			return {
				left: b,
				right: b
			}
		},
		_isAnchoredToOrigin: function() {
			return false
		},
		_getLabelText: function(c) {
			return a.fn.jqChart.labelFormatter(this.labels.stringFormat, c)
		},
		_getLabelValue: function(a, b) {
			switch(this.labels.valueType) {
				case "percentage":
					a = this.getPercentage(a, b)
			}
			return a
		},
		_getDataPointLabel: function(h, i, d, c, e) {
			var f = h >= this.realYAxis.crossing,
				g = this._getLabelText(e),
				b = new w(g);
			a.extend(b, this.labels);
			b.textAlign = "center";
			b.x = i;
			if(f) {
				b.y = d - c;
				b.textBaseline = "bottom"
			} else {
				b.y = d + c;
				b.textBaseline = "top"
			}
			return b
		},
		_initStackedData: function(b) {
			var f = this._getXAxisType();
			this.xAxisType = f;
			var c = this.data;
			if(a.isArray(c) == false) return;
			var g = this.chart.series._findStackedClusters(this, b),
				e = this.chart.series._getStackedSeriesFromType(b, this.stackedGroupName),
				d = this._calcStackedData(c, g, e);
			a.extend(this, d)
		},
		_initVisibleStackedData: function(b) {
			var f = this._getXAxisType();
			this.xAxisType = f;
			var c = this.data;
			if(a.isArray(c) == false) return;
			var g = this.chart.series._findStackedClusters(this, b),
				e = this.chart.series._getStackedSeriesFromType(b, this.stackedGroupName),
				d = this._calcVisibleStackedData(c, g, e);
			a.extend(this, d)
		},
		_getTotal: function(h, i) {
			for(var f = this.chart.series._getSeriesFromType(h), e = 0, d = 0, c = 0; c < f.length; c++) {
				var j = f[c],
					g = j.data;
				if(g == null) continue;
				var b = g[i];
				if(a.isArray(b)) b = b[1];
				if(b == null) continue;
				if(b > 0) e += b;
				else d += b
			}
			return {
				positive: e,
				negative: d
			}
		},
		_getStackedTotal: function(e, f) {
			for(var d = 0, c = 0, b = 0; b < e.length; b++) {
				var g = e[b],
					a = g.dataValues[f];
				if(a.actualValue > 0) d += a.actualValue;
				else c += a.actualValue
			}
			return {
				positive: d,
				negative: c
			}
		},
		_getPrevStackedPosition: function(g, f, h, e, c, d) {
			for(var b = f - 1; b >= 0; b--) {
				var a = g[b].dataValues[h];
				if(d) {
					if(a.value == a.positive) return c.getPosition(a.value)
				} else if(a.value == a.negative) return c.getPosition(a.value)
			}
			return e
		},
		_calcStackedData: function(m, l, n) {
			for(var j = h, g = i, f = [], p = m.length, k = [], d = 0; d < p; d++) {
				var b = {
						positive: 0,
						negative: 0
					},
					e = null;
				if(l.index > 0) {
					e = n[l.index - 1].dataValues[d];
					b.positive = e.positive;
					b.negative = e.negative
				}
				var c = m[d];
				if(c == null) {
					f.push((d + 1).toString());
					continue
				}
				if(a.isArray(c) == false) f.push((d + 1).toString());
				else f.push(c[0]);
				if(a.isArray(c)) c = c[1];
				b.actualValue = c;
				if(c > 0) {
					b.positive += c;
					b.value = b.positive
				} else if(c < 0) {
					b.negative += c;
					b.value = b.negative
				} else if(e != null) b.value = e.value;
				else b.value = 0;
				k[d] = b;
				g = Math.max(g, b.value);
				j = Math.min(j, b.value)
			}
			var o = {
				min: j,
				max: g,
				dataValues: k,
				categories: f
			};
			return o
		},
		_calcVisibleStackedData: function(n, m, q) {
			var g = this.realXAxis,
				u = this.realYAxis,
				t = g.zoomEnabled,
				v = u.zoomEnabled;
			if(v || !t) return;
			var p = g.visibleMinimum,
				o = g.visibleMaximum;
			if(b.isNull(p) || b.isNull(o)) return;
			for(var k = h, j = i, r = [], w = n.length, l = [], e = 0; e < w; e++) {
				if(e + 1 < p || e > o) continue;
				var c = {
						positive: 0,
						negative: 0
					},
					f = null;
				if(m.index > 0) {
					f = q[m.index - 1].dataValues[e];
					c.positive = f.positive;
					c.negative = f.negative
				}
				var d = n[e];
				if(a.isArray(d)) d = d[1];
				c.actualValue = d;
				if(d > 0) {
					c.positive += d;
					c.value = c.positive
				} else if(d < 0) {
					c.negative += d;
					c.value = c.negative
				} else if(f != null) c.value = f.value;
				else c.value = 0;
				l[e] = c;
				j = Math.max(j, c.value);
				k = Math.min(k, c.value)
			}
			var s = {
				min: k,
				max: j,
				dataValues: l,
				categories: r
			};
			return s
		},
		_getTooltip: function(b) {
			var a = "<b>" + b.y + "</b><br/>";
			if(this.title) {
				var d = c.getColorFromFillStyle(this.fillStyle);
				a = '<span style="color:' + d + '">' + this.title + "</span>: " + a
			}
			return a
		},
		_getDataLengthSum: function() {
			if(this.xAxisType == "CategoryAxis") return this.data.length;
			var c = this.chart.series._getSeriesFromType(this.type),
				b = 0;
			a.each(c, function(c, a) {
				if(a.data) b += a.data.length
			});
			return b
		},
		getPercentage: function(a, d) {
			var b = this._getTotal(this.type, d),
				c = a > 0 ? b.positive : b.negative;
			a = c != 0 ? 100 * Math.abs(a) / Math.abs(c) : 0;
			return a
		},
		setOptions: function(c) {
			var b = a.extend({}, this.defaults, c || {});
			a.extend(this, b);
			if(b.markers != null) this.markers = new O(b.markers)
		},
		defaults: {
			lineCap: "butt",
			lineJoin: "round",
			lineWidth: 1,
			strokeStyle: null,
			miterLimit: 10,
			pointWidth: .6,
			shadowColor: "#cccccc",
			shadowBlur: 4,
			shadowOffsetX: 2,
			shadowOffsetY: 2
		}
	};

	function I(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 2,
			markers: {}
		});
		this.defaults = c;
		e.call(this, b)
	}
	I.prototype = new e;
	I.constructor = I;
	I.prototype._render = function(b) {
		if(!this.data) return;
		var a = this._getXAxisType();
		this.xAxisType = a;
		switch(a) {
			case "LinearAxis":
			case "DateTimeAxis":
				this._renderXYData(b);
				return;
			case "CategoryAxis":
				this._renderCatValueData(b);
				return
		}
	};
	I.prototype._renderCatValueData = function(j) {
		for(var o = this.data.length, e = this.markers != null && this.markers.isVisible(), c = [], i = [], n = [], l = [], q = e ? this.markers.size / 2 : 0, h, k, p, d, g = 0; g < o; g++) {
			var f = this.data[g];
			if(f === null) {
				c.push(null);
				c.push(null);
				!e && i.push(null);
				continue
			}
			p = h = g + .5;
			if(a.isArray(f) == false) d = f;
			else {
				d = f[1];
				if(b.isNull(d)) {
					c.push(null);
					c.push(null);
					!e && i.push(null);
					continue
				}
			}
			h = this.realXAxis.getPosition(h);
			k = this.realYAxis.getPosition(d);
			c.push(h);
			c.push(k);
			!e && i.push({
				dataItem: f,
				x: p,
				y: d
			});
			if(this.realYAxis.isValueVisible(d) === false) continue;
			this._addMarkerAndLabel(n, l, h, k, g, o, null, d, q)
		}
		var m = this._createShape(c, j);
		if(!e && m) m.context = {
			chart: this.chart,
			series: this,
			points: i
		};
		else a.merge(j, n);
		a.merge(j, l)
	};
	I.prototype._renderXYData = function(h) {
		var k = this.data.length,
			d = this.markers != null && this.markers.isVisible(),
			q = this.labels != null && this.labels.visible !== false;
		if(k > 1e3 && d == false && q == false) {
			this._renderLargeXYData(h);
			return
		}
		for(var c = [], g = [], p = [], n = [], r = d ? this.markers.size / 2 : 0, l, m, f, e, j = 0; j < k; j++) {
			var i = this.data[j];
			if(i === null) {
				c.push(null);
				c.push(null);
				!d && g.push(null);
				continue
			}
			f = i[0];
			e = i[1];
			if(b.isNull(f) || b.isNull(e)) {
				c.push(null);
				c.push(null);
				!d && g.push(null);
				continue
			}
			l = this.realXAxis.getPosition(f);
			m = this.realYAxis.getPosition(e);
			c.push(l);
			c.push(m);
			!d && g.push({
				dataItem: i,
				x: f,
				y: e
			});
			if(this.realYAxis.isValueVisible(e) === false) continue;
			this._addMarkerAndLabel(p, n, l, m, j, k, f, e, r)
		}
		var o = this._createShape(c, h);
		if(!d && o) o.context = {
			chart: this.chart,
			series: this,
			points: g
		};
		else a.merge(h, p);
		a.merge(h, n)
	};
	I.prototype._renderLargeXYData = function(s) {
		for(var x = this.data.length, w = this.chart.gridArea.width, r = this.chart.gridArea.height, g = this.realXAxis, h = this.realYAxis, t = 2 * (g.actualVisibleMaximum - g.actualVisibleMinimum) / w, u = 2 * (h.actualVisibleMaximum - h.actualVisibleMinimum) / r, a = [], p, q, b, c, n = 0, o = 0, i = 0, j = 0, d, e, f, v = 0, m = [], k = 0; k < x; k++) {
			d = this.data[k];
			if(d === null) {
				a.push(null);
				a.push(null);
				continue
			}
			b = d[0];
			c = d[1];
			e = n - b;
			f = o - c;
			i += e < 0 ? -e : e;
			j += f < 0 ? -f : f;
			if(i < t && j < u) {
				v++;
				continue
			}
			i = 0;
			j = 0;
			n = b;
			o = c;
			p = g.getPosition(b);
			q = h.getPosition(c);
			a.push(p);
			a.push(q);
			m.push({
				dataItem: d,
				x: b,
				y: c
			})
		}
		var l = this._createShape(a, s);
		if(l) l.context = {
			chart: this.chart,
			series: this,
			points: m
		}
	};
	I.prototype._createShape = function(c, b) {
		var a = new A(c);
		this._setShapeSettings(a);
		b.push(a);
		this._addLengthAnimation(a);
		return a
	};

	function X(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 0,
			markers: null
		});
		this.defaults = c;
		e.call(this, b)
	}
	X.prototype = new I;
	X.constructor = X;
	X.prototype._createShape = function(i, h) {
		var g = [];
		a.merge(g, i);
		var c = new A(g);
		this._setShapeSettings(c);
		var f = this.chart.gridArea,
			k = f.y,
			j = f.y + f.height,
			e = this.realYAxis.getCrossingPosition();
		e = b.fitInRange(e, k, j);
		var d = new ab(i, e);
		d.fillStyle = this.fillStyle;
		d.lineWidth = 0;
		h.push(d);
		h.push(c);
		this._addLengthAnimation(d);
		this._addLengthAnimation(c);
		return c
	};
	X.prototype._isAnchoredToOrigin = function() {
		return true
	};

	function tb(a) {
		X.call(this, a)
	}
	tb.prototype = new X;
	tb.constructor = tb;
	tb.prototype._createShape = function(i, h) {
		var g = [];
		a.merge(g, i);
		var d = new t(g);
		this._setShapeSettings(d);
		var f = this.chart.gridArea,
			k = f.y,
			j = f.y + f.height,
			e = this.realYAxis.getCrossingPosition();
		e = b.fitInRange(e, k, j);
		var c = new ab(i, e, false, true);
		c.fillStyle = this.fillStyle;
		c.lineWidth = 0;
		h.push(c);
		h.push(d);
		this._addLengthAnimation(c);
		this._addLengthAnimation(d);
		return d
	};

	function n(a) {
		this.isVertical = true;
		e.call(this, a)
	}
	n.prototype = new e;
	n.constructor = n;
	n.prototype._createXAxis = function() {
		var b = {
				location: "left",
				orientation: "x"
			},
			a;
		switch(this.xAxisType) {
			case "DateTimeAxis":
				a = new l(b);
				break;
			case "CategoryAxis":
				a = new D(b);
				break;
			default:
				a = new j(b)
		}
		a.chart = this.chart;
		return a
	};
	n.prototype._createYAxis = function() {
		var a = new j({
			location: "bottom",
			orientation: "y"
		});
		a.chart = this.chart;
		return a
	};
	n.prototype._findXAxis = function(b) {
		var a = this._findAxis(b, this.axisX);
		if(a != null) return a;
		var c;
		if(this.categories) c = D;
		else c = j;
		for(var d = 0; d < b.length; d++) {
			a = b[d];
			if(a.getOrientation(this) != "x" || a.isVertical() == false) continue;
			if(a instanceof c) return a
		}
		return null
	};
	n.prototype._findYAxis = function(b) {
		var a = this._findAxis(b, this.axisY);
		if(a != null) return a;
		for(var c = 0; c < b.length; c++) {
			a = b[c];
			if(a.getOrientation(this) != "y" || a.isVertical()) continue;
			if(a instanceof j) return a
		}
		return null
	};
	n.prototype._render = function(a) {
		if(!this.data) return;
		switch(this.xAxisType) {
			case "LinearAxis":
			case "DateTimeAxis":
				this._renderLinearData(a);
				break;
			case "CategoryAxis":
				this._renderCatData(a)
		}
	};
	n.prototype._renderCatData = function(p) {
		var i = this.chart.gridArea,
			y = i.x,
			D = y + i.width,
			e = this.realYAxis.getCrossingPosition();
		e = b.fitInRange(e, y, D);
		e = Math.round(e);
		var q = this.chart.series._findClusters(this, this.type),
			m = this._getDataLengthSum(),
			B = i.height / this.realXAxis.getZoom(),
			w = B / m,
			E = w / q.count,
			h = Math.round(this.pointWidth * E),
			A = q.count * h,
			o = (w - A) / 2;
		o = Math.round(o + q.index * h);
		for(var u = [], r = [], C = this.markers && this.markers.isVisible() ? this.markers.size / 2 + 2 : 2, c, l, d = 0; d < m; d++) {
			var n = this.data[d];
			if(n == null) continue;
			var F = d,
				g;
			if(a.isArray(n) == false) g = n;
			else g = n[1];
			if(g == null) continue;
			l = Math.round(this.realXAxis.getPosition(F) - o - h);
			c = Math.round(this.realYAxis.getPosition(g));
			var z = c,
				f;
			if(c <= e) {
				f = e - c;
				var v = i.x - 10;
				if(c < v) {
					var x = v - c;
					c += x;
					f -= x
				}
			} else {
				f = c - e;
				c = e;
				var s = i.getRight() + 10;
				if(c + f > s) f = s - c
			}
			var t = {
					chart: this.chart,
					series: this,
					dataItem: this.data[d],
					x: this.realXAxis._getValue(d),
					y: g
				},
				j = new k(c, l, f, h);
			j.context = t;
			j.center = {
				x: Math.round(z),
				y: Math.round(l + h / 2)
			};
			this._setShapeSettings(j, d);
			p.push(j);
			this._addAnimation(j, d, m);
			l += h / 2;
			this._addMarkerAndLabel(u, r, z, l, d, m, null, g, C, t)
		}
		a.merge(p, u);
		a.merge(p, r)
	};
	n.prototype._renderLinearData = function(m) {
		var g = this.chart.gridArea,
			w = g.x,
			C = w + g.width,
			d = this.realYAxis.getCrossingPosition();
		d = b.fitInRange(d, w, C);
		d = Math.round(d);
		for(var i = this._getDataLengthSum(), z = g.height / this.realXAxis.getZoom(), B = z / i, o = this.pointWidth * B, t = [], q = [], A = this.markers && this.markers.isVisible() ? this.markers.size / 2 : 0, c, p, e = 0; e < i; e++) {
			var l = this.data[e];
			if(l == null || a.isArray(l) == false) continue;
			var n = l[0],
				j = l[1];
			if(n == null || j == null) continue;
			var s = {
				chart: this.chart,
				series: this,
				dataItem: this.data[e],
				x: n,
				y: j
			};
			p = this.realXAxis.getPosition(n);
			c = Math.round(this.realYAxis.getPosition(j));
			var y = c,
				f;
			if(c <= d) {
				f = d - c;
				var u = g.x - 10;
				if(c < u) {
					var v = u - c;
					c += v;
					f -= v
				}
			} else {
				f = c - d;
				c = d;
				var r = g.getRight() + 10;
				if(c + f > r) f = r - c
			}
			var x = p - o / 2,
				h = new k(c, x, f, o);
			h.context = s;
			h.center = {
				x: Math.round(y),
				y: Math.round(x + o / 2)
			};
			this._setShapeSettings(h, e);
			m.push(h);
			this._addAnimation(h, e, i);
			this._addMarkerAndLabel(t, q, y, p, e, i, null, j, A, s)
		}
		a.merge(m, t);
		a.merge(m, q)
	};
	n.prototype._addAnimation = function(d, g, f) {
		var b = this._getAnimation();
		if(!b || b.enabled === false) return;
		var a = new fb(b, d, "xDecrease", d.width, 0),
			c = a.duration / f,
			e = a.delayTime + g * c;
		a.delayTime = e;
		a.duration = c;
		this.chart.storyboard.addAnimation(a)
	};
	n.prototype._correctMarkerPosition = function(a, e, d) {
		var b = this.markers.offset;
		if(b) {
			var c = d >= this.realYAxis.crossing;
			a = c ? a + b : a - b
		}
		return {
			x: a,
			y: e
		}
	};
	n.prototype._getPixelMargins = function(a) {
		if(a.isVertical() == false) {
			var b = e.prototype._getPixelMargins.call(this, a),
				c = a.length / 10,
				i = Math.max(c, b.left),
				h = Math.max(c, b.right);
			return {
				left: i,
				right: h
			}
		}
		if(this.data == null) return {
			left: 0,
			right: 0
		};
		var g = 4,
			j = this._getDataLengthSum(),
			f = a.length,
			d = .5 * f / j + g;
		return {
			left: d,
			right: d
		}
	};
	n.prototype._isAnchoredToOrigin = function() {
		return true
	};
	n.prototype._getDataPointLabel = function(j, f, k, e, g) {
		var h = j <= this.realYAxis.crossing,
			i = this._getLabelText(g),
			b = new w(i);
		a.extend(b, this.labels);
		b.measure(this.chart.ctx);
		b.y = k;
		var c = this.chart.gridArea;
		if(h) {
			b.x = f - e;
			b.textAlign = "right";
			if(b.x - b.width < c.x + 4) b.x = c.x + b.width + 4
		} else {
			b.x = f + e;
			b.textAlign = "left";
			var d = c.getRight() - 4;
			if(b.x + b.width > d) b.x = d - b.width
		}
		return b
	};
	n.prototype._initColors = function(a) {
		this.fillStyle = this.fillStyle || a
	};

	function V(b) {
		var c = a.extend(true, {}, this.defaults, {
			markers: {
				strokeStyle: null
			}
		});
		this.defaults = c;
		e.call(this, b)
	}
	V.prototype = new e;
	V.constructor = V;
	V.prototype._initData = function() {
		if(!this.data) return;
		var q = this._getXAxisType();
		this.xAxisType = q;
		var c = [];
		a.merge(c, this.data);
		for(var p = this.chart.series.items, b = 0; b < p.length; b++) {
			var m = p[b];
			if(m == this || m.type != "bubble") continue;
			a.merge(c, m.data)
		}
		if(a.isArray(c) == false) return;
		for(var l = h, k = i, j = h, g = i, e = h, d = i, r = c.length, b = 0; b < r; b++) {
			var n = c[b][0],
				o = c[b][1],
				f = c[b][2];
			if(n == null || o == null || f == null) continue;
			j = Math.min(j, n);
			g = Math.max(g, n);
			l = Math.min(l, o);
			k = Math.max(k, o);
			e = Math.min(e, f);
			d = Math.max(d, f)
		}
		this.min = l;
		this.max = k;
		this.minX = j;
		this.maxX = g;
		this.minSize = e;
		this.maxSize = d
	};
	V.prototype._render = function(l) {
		if(!this.data) return;
		var n = this.chart,
			o = n.options,
			g = o.maxBubbleSize;
		if(!g) {
			var q = n.gridArea;
			g = Math.min(q.width, q.height) * .25
		}
		var f = o.maxBubbleScale;
		if(!f) f = this.maxSize;
		for(var i = this.data.length, j, k, e, c, b, a = 0; a < i; a++) {
			var d = this.data[a];
			if(d == null) continue;
			c = d[0];
			b = d[1];
			e = d[2];
			if(c == null || b == null || e == null) continue;
			var t = e / f,
				p = Math.max(t * g, 0);
			j = this.realXAxis.getPosition(c);
			k = this.realYAxis.getPosition(b);
			if(this.markers && this.markers.isVisible()) {
				var s = {
						chart: this.chart,
						series: this,
						dataItem: this.data[a],
						x: c,
						y: b,
						size: e
					},
					h = this._getMarker(j, k, p / 2);
				h.context = s;
				l.push(h);
				this._addShapeAnimation(h, a, i)
			}
			if(this.labels && this.labels.visible !== false) {
				var r = this._getLabelValue(b, a),
					m = this._getDataPointLabel(b, j, k, p / 2, r);
				l.push(m);
				this._addShapeAnimation(m, a, i)
			}
		}
	};
	V.prototype._getPixelMargins = function() {
		var a = this.chart.gridArea;
		if(a.width == null) return {
			left: 0,
			right: 0
		};
		var c = Math.min(a.width, a.height) * .35,
			b = c / 2;
		return {
			left: b + 4,
			right: b + 4
		}
	};
	V.prototype._getTooltip = function(a) {
		var b = "x: <b>" + this.realXAxis.getLabel(a.x) + "</b></br>y: <b>" + a.y.toString() + "</b></br>size: <b>" + a.size.toString() + "</b>";
		if(this.title) {
			var d = c.getColorFromFillStyle(this.fillStyle);
			b = '<div style="color:' + d + '">' + this.title + "</div>" + b
		}
		return b
	};

	function y(a) {
		e.call(this, a)
	}
	y.prototype = new e;
	y.constructor = y;
	y.prototype._render = function(a) {
		if(!this.data) return;
		switch(this.xAxisType) {
			case "LinearAxis":
			case "DateTimeAxis":
				this._renderLinearData(a);
				break;
			case "CategoryAxis":
				this._renderCatData(a)
		}
	};
	y.prototype._renderCatData = function(p) {
		var j = this.chart.gridArea,
			B = j.y,
			A = j.y + j.height,
			d = this.realYAxis.getCrossingPosition();
		d = b.fitInRange(d, B, A);
		d = Math.round(d);
		var q = this.chart.series._findClusters(this, this.type),
			l = this._getDataLengthSum(),
			x = j.width / this.realXAxis.getZoom(),
			u = x / l,
			z = u / q.count,
			i = Math.round(this.pointWidth * z),
			w = q.count * i,
			o = (u - w) / 2;
		o = Math.round(o + q.index * i);
		for(var t = [], r = [], y = this.markers && this.markers.isVisible() ? this.markers.size / 2 : 0, f, g, c = 0; c < l; c++) {
			var m = this.data[c];
			if(m == null) continue;
			f = c;
			var e;
			if(a.isArray(m) == false) e = m;
			else e = m[1];
			if(e == null) continue;
			f = Math.round(this.realXAxis.getPosition(f) + o);
			g = Math.round(this.realYAxis.getPosition(e));
			var v = g,
				n;
			if(g <= d) n = d - g;
			else {
				n = g - d;
				g = d
			}
			var s = {
					chart: this.chart,
					series: this,
					dataItem: this.data[c],
					x: this.realXAxis._getValue(c),
					y: e
				},
				h = new k(f, g, i, n);
			h.context = s;
			h.center = {
				x: Math.round(f + i / 2),
				y: Math.round(v)
			};
			this._setShapeSettings(h, c);
			p.push(h);
			this._addAnimation(h, c, l);
			if(this.realYAxis.isValueVisible(e) === false) continue;
			f += i / 2;
			this._addMarkerAndLabel(t, r, f, v, c, l, null, e, y, s)
		}
		a.merge(p, t);
		a.merge(p, r)
	};
	y.prototype._renderLinearData = function(n) {
		var i = this.chart.gridArea,
			y = i.y,
			x = i.y + i.height,
			c = this.realYAxis.getCrossingPosition();
		c = b.fitInRange(c, y, x);
		c = Math.round(c);
		for(var j = this._getDataLengthSum(), u = i.width / this.realXAxis.getZoom(), w = u / j, o = this.pointWidth * w, r = [], p = [], v = this.markers && this.markers.isVisible() ? this.markers.size / 2 : 0, e, f, d = 0; d < j; d++) {
			var l = this.data[d];
			if(l == null || a.isArray(l) == false) continue;
			e = l[0];
			var h = l[1];
			if(e == null || h == null) continue;
			var q = {
				chart: this.chart,
				series: this,
				dataItem: this.data[d],
				x: e,
				y: h
			};
			e = this.realXAxis.getPosition(e);
			f = Math.round(this.realYAxis.getPosition(h));
			var t = f,
				m;
			if(f <= c) m = c - f;
			else {
				m = f - c;
				f = c
			}
			var s = e - o / 2,
				g = new k(s, f, o, m);
			g.context = q;
			g.center = {
				x: Math.round(s + o / 2),
				y: Math.round(t)
			};
			this._setShapeSettings(g, d);
			n.push(g);
			this._addAnimation(g, d, j);
			if(this.realYAxis.isValueVisible(h) === false) continue;
			this._addMarkerAndLabel(r, p, e, t, d, j, null, h, v, q)
		}
		a.merge(n, r);
		a.merge(n, p)
	};
	y.prototype._addAnimation = function(d, g, f) {
		var b = this._getAnimation();
		if(!b || b.enabled === false) return;
		var a = new fb(b, d, "yDecrease", d.height, 0),
			c = a.duration / f,
			e = a.delayTime + g * c;
		a.delayTime = e;
		a.duration = c;
		this.chart.storyboard.addAnimation(a)
	};
	y.prototype._getPixelMargins = function(a) {
		if(a.isVertical()) {
			var b = e.prototype._getPixelMargins.call(this, a),
				c = a.length / 10,
				i = Math.max(c, b.left),
				h = Math.max(c, b.right);
			return {
				left: i,
				right: h
			}
		}
		if(this.data == null) return {
			left: 0,
			right: 0
		};
		var g = 4,
			j = this._getDataLengthSum(),
			f = a.length,
			d = .5 * f / j + g;
		return {
			left: d,
			right: d
		}
	};
	y.prototype._isAnchoredToOrigin = function() {
		return true
	};
	y.prototype._initColors = function(a) {
		this.fillStyle = this.fillStyle || a
	};

	function v(a) {
		e.call(this, a)
	}
	v.prototype = new e;
	v.constructor = v;
	v.prototype._initXAxis = function() {};
	v.prototype._initYAxis = function() {};
	v.prototype._initVisibleData = function() {};
	v.prototype._getYValues = function() {
		for(var e = [], f = this.data.length, d = 0; d < f; d++) {
			var b = this.data[d];
			if(b == null) continue;
			var c;
			if(a.isArray(b) == false) c = b;
			else c = b[1];
			e.push(Math.abs(c))
		}
		return e
	};
	v.prototype._render = function(r) {
		if(!this.data) return;
		var k = this.chart.gridArea,
			o = k.width,
			n = k.height,
			j = this._getYValues(),
			u = b.sum(j),
			l = j.length,
			q = 10,
			h;
		if(o < n) h = o / 2 - q;
		else h = n / 2 - q;
		if(h < 0) return;
		for(var v = k.x + o / 2, x = k.y + n / 2, t = Math.PI * 2 / u, f = -Math.PI / 2, m = this.fillStyles, c = 0; c < l; c++) {
			var e = j[c],
				i = f + e * t,
				g = new lb(v, x, h, f, i);
			this._setShapeSettings(g);
			if(m) g.fillStyle = m[c % m.length];
			else g.fillStyle = this.palette.getColor(c);
			var y = {
				chart: this.chart,
				series: this,
				dataItem: this.data[c],
				value: e
			};
			g.context = y;
			r.push(g);
			this._addSliceAnimation(g, c, l);
			f = i
		}
		if(!this.labels || this.labels.visible === false) return;
		for(var f = -Math.PI / 2, c = 0; c < l; c++) {
			var e = j[c],
				i = f + e * t;
			switch(this.labels.valueType) {
				case "percentage":
					e = 100 * e / u
			}
			if(e == 0) continue;
			var z = this._getLabelText(e),
				d = new w(z);
			d.textBaseline = "top";
			a.extend(d, this.labels);
			var s = d.measure(this.chart.ctx),
				p = this._getSliceCenter(v, x, (f + i) / 2, h * .6);
			d.x = p.x - s.width / 2;
			d.y = p.y - s.height / 2;
			d.context = {
				chart: this.chart,
				series: this,
				dataItem: this.data[c],
				value: e
			};
			this.chart.elem.trigger("dataPointLabelCreating", d);
			r.push(d);
			this._addShapeAnimation(d, c, l);
			f = i
		}
	};
	v.prototype._getSliceCenter = function(c, d, b, a) {
		return {
			x: c + a * Math.cos(b),
			y: d + a * Math.sin(b)
		}
	};
	v.prototype._getLegendItems = function(c) {
		var d = [];
		if(!this.data) return d;
		for(var e, j = this.data.length, b = 0; b < j; b++) {
			var g = this.data[b];
			if(g == null) continue;
			var k;
			if(a.isArray(g) == false) {
				var i = b + 1;
				e = i.toString()
			} else e = g[0];
			var h = new O;
			h.fillStyle = this.palette.getColor(b);
			c = a.extend(true, {}, c, {
				text: e,
				marker: h
			});
			var f = new db(c);
			f.chart = this.chart;
			f.series = this;
			d.push(f)
		}
		return d
	};
	v.prototype._initColors = function(b, a) {
		this.palette = a
	};
	v.prototype._getTooltip = function(b) {
		var a = this.getPercentage(b.value);
		a = this.chart.stringFormat(a, "%.2f%%");
		var c = "<b>" + b.value + " (" + a + ")</b><br/>",
			d = b.dataItem[0];
		if(d) c = d + "</br>" + c;
		return c
	};
	v.prototype._addSliceAnimation = function(c, g, f) {
		var b = this._getAnimation();
		if(!b || b.enabled === false) return;
		var a = new fb(b, c, "endAngle", c.startAngle, c.endAngle),
			d = a.duration / f,
			e = a.delayTime + g * d;
		a.delayTime = e;
		a.duration = d;
		this.chart.storyboard.addAnimation(a)
	};
	v.prototype.getTotal = function() {
		var a = this._getYValues(),
			c = b.sum(a);
		return c
	};
	v.prototype.getPercentage = function(b) {
		var a = this.getTotal();
		return 100 * b / a
	};

	function kb(b) {
		var c = a.extend(true, {}, this.defaults, {
			markers: {
				type: "diamond"
			}
		});
		this.defaults = c;
		e.call(this, b)
	}
	kb.prototype = new I;
	kb.constructor = kb;
	kb.prototype._createShape = function() {
		return null
	};
	kb.prototype._getTooltip = function(b) {
		var a = "x: <b>" + this.realXAxis.getLabel(b.x) + "</b></br>y: <b>" + this.realYAxis.getLabel(b.y) + "</b>";
		if(this.title) {
			var d = c.getColorFromFillStyle(this.fillStyle);
			a = '<div style="color:' + d + '">' + this.title + "</div>" + a
		}
		return a
	};

	function xb(a) {
		I.call(this, a)
	}
	xb.prototype = new I;
	xb.constructor = xb;
	xb.prototype._createShape = function(c, b) {
		var a = new t(c);
		this._setShapeSettings(a);
		b.push(a);
		this._addLengthAnimation(a);
		return a
	};

	function S(b) {
		var c = a.extend(true, {}, this.defaults, {
			stackedGroupName: ""
		});
		this.defaults = c;
		y.call(this, b)
	}
	S.prototype = new y;
	S.constructor = S;
	S.prototype._initData = function() {
		this._initStackedData("stackedcolumn")
	};
	S.prototype._initVisibleData = function() {
		this._initVisibleStackedData("stackedcolumn")
	};
	S.prototype._render = function(u) {
		if(!this.data) return;
		var q = this.chart.gridArea,
			K = q.y,
			J = q.y + q.height,
			h = this.realYAxis.getCrossingPosition();
		h = b.fitInRange(h, K, J);
		h = Math.round(h);
		var c = this.chart.series._findStackedClusters(this, "stackedcolumn"),
			C = this.data.length,
			F = q.width / this.realXAxis.getZoom(),
			A = F / C,
			I = A / c.groupCount,
			m = Math.round(this.pointWidth * I),
			E = c.groupCount * m,
			t = (A - E) / 2;
		t = Math.round(t + c.groupIndex * m);
		for(var z = [], y = [], w = this.chart.series._getStackedSeriesFromType("stackedcolumn", this.stackedGroupName), G = this.markers && this.markers.isVisible() ? this.markers.size / 2 : 0, e, f, g, d = 0; d < C; d++) {
			var g = this.dataValues[d];
			if(g == null) continue;
			var l = g.value;
			e = d;
			e = Math.round(this.realXAxis.getPosition(e) + t);
			f = Math.round(this.realYAxis.getPosition(l));
			var o = this._getPrevStackedPosition(w, c.index, d, h, this.realYAxis, l >= 0),
				v = f,
				p;
			if(f <= o) p = o - f;
			else {
				p = f - o;
				f = o
			}
			var r = {
					chart: this.chart,
					series: this,
					dataItem: this.data[d],
					value: g.actualValue,
					x: this.realXAxis._getValue(d),
					y: l
				},
				j = new k(e, f, m, p);
			j.context = r;
			j.center = {
				x: Math.round(e + m / 2),
				y: Math.round(v)
			};
			this._setShapeSettings(j, d);
			u.push(j);
			this._addAnimation(j, c.index, c.count);
			e += m / 2;
			if(this.markers && this.realYAxis.isValueVisible(l)) {
				var s = this._getMarker(e, v, null, l);
				s.context = r;
				z.push(s);
				this._addShapeAnimation(s, c.index, c.count)
			}
			if(this.labels && this.labels.visible !== false && g.actualValue != 0) {
				var n = g.actualValue;
				switch(this.labels.valueType) {
					case "percentage":
						var B = this._getStackedTotal(w, d),
							D = n > 0 ? B.positive : B.negative;
						n = D != 0 ? 100 * Math.abs(n) / Math.abs(D) : 0
				}
				var x = this.labels.position == "outside",
					H = x ? G : -p / 2,
					i = this._getDataPointLabel(g.actualValue, e, v, H, n);
				if(!x) i.textBaseline = "middle";
				i.context = r;
				this.chart.elem.trigger("dataPointLabelCreating", i);
				y.push(i);
				this._addShapeAnimation(i, c.index, c.count)
			}
		}
		a.merge(u, z);
		a.merge(u, y)
	};
	S.prototype._getTooltip = function(b) {
		var a = "<b>" + b.value + "</b><br/>";
		if(this.title) {
			var d = c.getColorFromFillStyle(this.fillStyle);
			a = '<span style="color:' + d + '">' + this.title + "</span>: " + a
		}
		return a
	};

	function T(b) {
		var c = a.extend(true, {}, this.defaults, {
			stackedGroupName: ""
		});
		this.defaults = c;
		n.call(this, b)
	}
	T.prototype = new n;
	T.constructor = T;
	T.prototype._initData = function() {
		this._initStackedData("stackedbar")
	};
	T.prototype._initVisibleData = function() {
		this._initVisibleStackedData("stackedbar")
	};
	T.prototype._render = function(t) {
		if(!this.data) return;
		var u = this.chart.gridArea,
			C = u.x,
			J = C + u.width,
			j = this.realYAxis.getCrossingPosition();
		j = b.fitInRange(j, C, J);
		j = Math.round(j);
		var c = this.chart.series._findStackedClusters(this, "stackedbar"),
			D = this.data.length,
			G = u.height / this.realXAxis.getZoom(),
			A = G / D,
			K = A / c.groupCount,
			h = Math.round(this.pointWidth * K),
			F = c.groupCount * h,
			s = (A - F) / 2;
		s = Math.round(s + c.groupIndex * h);
		for(var z = [], y = [], w = this.chart.series._getStackedSeriesFromType("stackedbar", this.stackedGroupName), H = this.markers && this.markers.isVisible() ? this.markers.size / 2 + 2 : 2, e, i, g, d = 0; d < D; d++) {
			var g = this.dataValues[d];
			if(g == null) continue;
			var m = g.value;
			e = d;
			i = Math.round(this.realXAxis.getPosition(e) - s - h);
			e = Math.round(this.realYAxis.getPosition(m));
			var o = this._getPrevStackedPosition(w, c.index, d, j, this.realYAxis, m >= 0),
				v = e,
				p;
			if(e <= o) p = o - e;
			else {
				p = e - o;
				e = o
			}
			var q = {
					chart: this.chart,
					series: this,
					dataItem: this.data[d],
					value: g.actualValue,
					x: this.realXAxis._getValue(d),
					y: m
				},
				l = new k(e, i, p, h);
			l.context = q;
			l.center = {
				x: Math.round(v),
				y: Math.round(i + h / 2)
			};
			this._setShapeSettings(l, d);
			t.push(l);
			this._addAnimation(l, c.index, c.count);
			i += h / 2;
			if(this.markers && this.realYAxis.isValueVisible(m)) {
				var r = this._getMarker(v, i, null, m);
				r.context = q;
				z.push(r);
				this._addShapeAnimation(r, c.index, c.count)
			}
			if(this.labels && this.labels.visible !== false && g.actualValue != 0) {
				var n = g.actualValue;
				switch(this.labels.valueType) {
					case "percentage":
						var B = this._getStackedTotal(w, d),
							E = n > 0 ? B.positive : B.negative;
						n = E != 0 ? 100 * Math.abs(n) / Math.abs(E) : 0
				}
				var x = this.labels.position == "outside",
					I = x ? H : -p / 2,
					f = this._getDataPointLabel(g.actualValue, v, i, I, n);
				if(!x) {
					f.textBaseline = "middle";
					f.textAlign = "center"
				}
				f.context = q;
				this.chart.elem.trigger("dataPointLabelCreating", f);
				y.push(f);
				this._addShapeAnimation(f, c.index, c.count)
			}
		}
		a.merge(t, z);
		a.merge(t, y)
	};
	T.prototype._getTooltip = function(b) {
		var a = "<b>" + b.value + "</b><br/>";
		if(this.title) {
			var d = c.getColorFromFillStyle(this.fillStyle);
			a = '<span style="color:' + d + '">' + this.title + "</span>: " + a
		}
		return a
	};

	function G(a) {
		y.call(this, a)
	}
	G.prototype = new y;
	G.constructor = G;
	G.prototype._initXYData = function() {
		this._initXYDataRange(1, 3)
	};
	G.prototype._initCatValueData = function() {
		this._initCatValueDataRange(1, 3)
	};
	G.prototype._initDateValueData = function() {
		this._initDateValueDataRange(1, 3)
	};
	G.prototype._initVisibleCatValueData = function() {
		this._initVisibleCatValueDataRange(1, 3)
	};
	G.prototype._initVisibleXYData = function() {
		this._initVisibleXYDataRange(1, 3)
	};
	G.prototype._renderCatData = function(u) {
		var v = this.chart.gridArea,
			b = this.chart.series._findClusters(this, this.type),
			g = this._getDataLengthSum();
		b.count = 1;
		b.index = 0;
		var q = v.width / this.realXAxis.getZoom(),
			m = q / g,
			r = m / b.count,
			l = Math.round(this.pointWidth * r),
			p = b.count * l,
			d = (m - p) / 2;
		d = Math.round(d + b.index * l);
		for(var o, i, j, n, e, f, a = 0; a < g; a++) {
			var h = this.data[a];
			if(h == null) continue;
			n = a;
			e = h[1];
			f = h[2];
			o = Math.round(this.realXAxis.getPosition(n) + d);
			i = Math.round(this.realYAxis.getPosition(e));
			j = Math.round(this.realYAxis.getPosition(f));
			var s = {
					chart: this.chart,
					series: this,
					dataItem: this.data[a],
					x: this.realXAxis._getValue(a),
					from: e,
					to: f
				},
				w = Math.min(i, j),
				t = Math.abs(i - j),
				c = new k(o, w, l, t);
			c.context = s;
			this._setShapeSettings(c, a);
			u.push(c);
			this._addAnimation(c, a, g)
		}
	};
	G.prototype._renderLinearData = function(r) {
		for(var s = this.chart.gridArea, j = this._getDataLengthSum(), n = s.width / this.realXAxis.getZoom(), o = n / j, l = this.pointWidth * o, m, h, i, g, e, f, c = 0; c < j; c++) {
			var b = this.data[c];
			if(b == null || a.isArray(b) == false) continue;
			g = b[0];
			e = b[1];
			f = b[2];
			var p = {
				chart: this.chart,
				series: this,
				dataItem: this.data[c],
				x: g,
				from: e,
				to: f
			};
			m = this.realXAxis.getPosition(g);
			h = Math.round(this.realYAxis.getPosition(e));
			i = Math.round(this.realYAxis.getPosition(f));
			var t = m - l / 2,
				u = Math.min(h, i),
				q = Math.abs(h - i),
				d = new k(t, u, l, q);
			d.context = p;
			this._setShapeSettings(d, c);
			r.push(d)
		}
	};
	G.prototype._setShapeSettings = function(a) {
		e.prototype._setShapeSettings.call(this, a);
		if(a.context.from <= a.context.to) {
			if(this.priceUpStrokeStyle) a.strokeStyle = this.priceUpStrokeStyle;
			if(this.priceUpFillStyle) a.fillStyle = this.priceUpFillStyle
		} else {
			if(this.priceDownStrokeStyle) a.strokeStyle = this.priceDownStrokeStyle;
			if(this.priceDownFillStyle) a.fillStyle = this.priceDownFillStyle
		}
	};
	G.prototype._getTooltip = function(b) {
		var a = "From: <b>" + b.from.toString() + "</b></br>To: <b>" + b.to.toString() + "</b>";
		if(this.title) {
			var d = c.getColorFromFillStyle(this.fillStyle);
			a = '<div style="color:' + d + '">' + this.title + "</div>" + a
		}
		return a
	};

	function H(a) {
		n.call(this, a)
	}
	H.prototype = new n;
	H.constructor = H;
	H.prototype._initXYData = function() {
		this._initXYDataRange(1, 3)
	};
	H.prototype._initCatValueData = function() {
		this._initCatValueDataRange(1, 3)
	};
	H.prototype._initDateValueData = function() {
		this._initDateValueDataRange(1, 3)
	};
	H.prototype._initVisibleCatValueData = function() {
		this._initVisibleCatValueDataRange(1, 3)
	};
	H.prototype._initVisibleXYData = function() {
		this._initVisibleXYDataRange(1, 3)
	};
	H.prototype._renderCatData = function(s) {
		var t = this.chart.gridArea,
			b = this.chart.series._findClusters(this, this.type),
			h = this._getDataLengthSum();
		b.count = 1;
		b.index = 0;
		var q = t.height / this.realXAxis.getZoom(),
			m = q / h,
			v = m / b.count,
			d = Math.round(this.pointWidth * v),
			p = b.count * d,
			e = (m - p) / 2;
		e = Math.round(e + b.index * d);
		for(var j, l, o, n, f, g, a = 0; a < h; a++) {
			var i = this.data[a];
			if(i == null) continue;
			n = a;
			f = i[1];
			g = i[2];
			o = Math.round(this.realXAxis.getPosition(n) - e - d);
			j = Math.round(this.realYAxis.getPosition(f));
			l = Math.round(this.realYAxis.getPosition(g));
			var r = {
					chart: this.chart,
					series: this,
					dataItem: this.data[a],
					x: this.realXAxis._getValue(a),
					from: f,
					to: g
				},
				w = Math.min(j, l),
				u = Math.abs(j - l),
				c = new k(w, o, u, d);
			c.context = r;
			this._setShapeSettings(c, a);
			s.push(c);
			this._addAnimation(c, a, h)
		}
	};
	H.prototype._renderLinearData = function(q) {
		for(var r = this.chart.gridArea, g = this._getDataLengthSum(), n = r.height / this.realXAxis.getZoom(), p = n / g, l = this.pointWidth * p, i, j, m, h, e, f, b = 0; b < g; b++) {
			var c = this.data[b];
			if(c == null || a.isArray(c) == false) continue;
			h = c[0];
			e = c[1];
			f = c[2];
			var o = {
				chart: this.chart,
				series: this,
				dataItem: this.data[b],
				x: h,
				from: e,
				to: f
			};
			m = this.realXAxis.getPosition(h);
			i = Math.round(this.realYAxis.getPosition(e));
			j = Math.round(this.realYAxis.getPosition(f));
			var t = m - l / 2,
				u = Math.min(i, j),
				s = Math.abs(i - j),
				d = new k(u, t, s, l);
			d.context = o;
			this._setShapeSettings(d, b);
			q.push(d);
			this._addAnimation(d, b, g)
		}
	};
	H.prototype._setShapeSettings = function(a) {
		e.prototype._setShapeSettings.call(this, a);
		if(a.context.from <= a.context.to) {
			if(this.priceUpStrokeStyle) a.strokeStyle = this.priceUpStrokeStyle;
			if(this.priceUpFillStyle) a.fillStyle = this.priceUpFillStyle
		} else {
			if(this.priceDownStrokeStyle) a.strokeStyle = this.priceDownStrokeStyle;
			if(this.priceDownFillStyle) a.fillStyle = this.priceDownFillStyle
		}
	};
	H.prototype._getTooltip = function(b) {
		var a = "From: <b>" + b.from.toString() + "</b></br>To: <b>" + b.to.toString() + "</b>";
		if(this.title) {
			var d = c.getColorFromFillStyle(this.fillStyle);
			a = '<div style="color:' + d + '">' + this.title + "</div>" + a
		}
		return a
	};

	function z(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 2
		});
		this.defaults = c;
		e.call(this, b)
	}
	z.prototype = new e;
	z.constructor = z;
	z.prototype._initXYData = function() {
		this._initXYDataRange(1, 5)
	};
	z.prototype._initCatValueData = function() {
		this._initCatValueDataRange(1, 5)
	};
	z.prototype._initDateValueData = function() {
		this._initDateValueDataRange(1, 5)
	};
	z.prototype._initVisibleCatValueData = function() {
		this._initVisibleCatValueDataRange(1, 5)
	};
	z.prototype._initVisibleXYData = function() {
		this._initVisibleXYDataRange(1, 5)
	};
	z.prototype._render = function(o) {
		if(!this.data) return;
		var p = this.chart.gridArea,
			i = this.data.length,
			d, f, h, g, e, m = i,
			l = p.width / this.realXAxis.getZoom();
		width = this.pointWidth * l / m;
		for(var c = 0; c < i; c++) {
			var b = this.data[c];
			if(b == null || a.isArray(b) == false) continue;
			var k = c;
			switch(this.xAxisType) {
				case "LinearAxis":
				case "DateTimeAxis":
					d = b[0];
					k = d;
					break;
				case "CategoryAxis":
					d = c + .5
			}
			f = b[1];
			h = b[2];
			g = b[3];
			e = b[4];
			var n = {
				chart: this.chart,
				series: this,
				dataItem: b,
				x: this.realXAxis._getValue(k),
				high: f,
				low: h,
				open: g,
				close: e
			};
			d = this.realXAxis.getPosition(d);
			f = this.realYAxis.getPosition(f);
			h = this.realYAxis.getPosition(h);
			g = this.realYAxis.getPosition(g);
			e = this.realYAxis.getPosition(e);
			var j = this._createShape(d, f, h, g, e, width);
			j.context = n;
			this._addShapeAnimation(j, c, i);
			o.push(j)
		}
	};
	z.prototype._setShapeSettings = function(a) {
		e.prototype._setShapeSettings.call(this, a);
		a.priceDownStrokeStyle = this.priceDownStrokeStyle;
		a.priceUpStrokeStyle = this.priceUpStrokeStyle
	};
	z.prototype._createShape = function(g, d, f, e, b, c) {
		var a = new K(g, d, f, e, b, c);
		this._setShapeSettings(a);
		return a
	};
	z.prototype._getPixelMargins = function(a) {
		if(a.isVertical()) return e.prototype._getPixelMargins.call(this, a);
		if(this.data == null) return {
			left: 0,
			right: 0
		};
		var d = 4,
			f = this.data.length,
			c = a.length,
			b = .5 * c / f + d;
		return {
			left: b,
			right: b
		}
	};
	z.prototype._getTooltip = function(a) {
		var b = "Open: <b>" + a.open.toString() + "</b></br>High: <b>" + a.high.toString() + "</b></br>Low: <b>" + a.low.toString() + "</b></br>Close: <b>" + a.close.toString() + "</b>";
		if(this.title) {
			var d = c.getColorFromFillStyle(this.fillStyle);
			b = '<div style="color:' + d + '">' + this.title + "</div>" + b
		}
		return b
	};

	function ib(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 1
		});
		this.defaults = c;
		e.call(this, b)
	}
	ib.prototype = new z;
	ib.constructor = ib;
	ib.prototype._setShapeSettings = function(a) {
		a.priceDownFillStyle = this.priceDownFillStyle || this.fillStyle;
		a.priceUpFillStyle = this.priceUpFillStyle;
		a.strokeStyle = this.strokeStyle;
		a.lineWidth = this.lineWidth;
		a.lineCap = this.lineCap;
		a.lineJoin = this.lineJoin;
		a.miterLimit = this.miterLimit;
		a.shadowColor = this.shadowColor;
		a.shadowBlur = this.shadowBlur;
		a.shadowOffsetX = this.shadowOffsetX;
		a.shadowOffsetY = this.shadowOffsetY
	};
	ib.prototype._createShape = function(g, d, f, e, b, c) {
		var a = new bb(g, d, f, e, b, c);
		this._setShapeSettings(a);
		return a
	};

	function C(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 2,
			markers: {}
		});
		this.defaults = c;
		e.call(this, b);
		this.notInGridArea = true
	}
	C.prototype = new e;
	C.constructor = C;
	C.prototype._createXAxis = function() {
		var a = new F;
		a.chart = this.chart;
		return a
	};
	C.prototype._createYAxis = function() {
		var a = new p;
		a.chart = this.chart;
		return a
	};
	C.prototype._findXAxis = function(b) {
		var a = this._findAxis(b, this.axisX);
		if(a != null) return a;
		for(var c = 0; c < b.length; c++) {
			a = b[c];
			if(a instanceof F) return a
		}
		return null
	};
	C.prototype._findYAxis = function(b) {
		var a = this._findAxis(b, this.axisY);
		if(a != null) return a;
		for(var c = 0; c < b.length; c++) {
			a = b[c];
			if(a instanceof p) return a
		}
		return null
	};
	C.prototype._render = function(l) {
		if(!this.data) return;
		for(var x = this.data.length, i = this.markers != null && this.markers.isVisible(), s = this.labels != null && this.labels.visible !== false, d = [], j = [], n = [], m = [], t = i ? this.markers.size / 2 : 0, g, h, c, y = this.realYAxis.cx, p = this.realYAxis.cy, e = 0; e < x; e++) {
			var f = this.data[e];
			if(f === null) {
				d.push(null);
				d.push(null);
				!i && j.push(null);
				continue
			}
			if(a.isArray(f) == false) c = f;
			else {
				c = f[1];
				if(c === null) {
					d.push(null);
					d.push(null);
					!i && j.push(null);
					continue
				}
			}
			var w = this.realXAxis._getAngle(e);
			g = this.realYAxis.getPosition(c);
			h = p;
			var q = b.rotatePointAt(g, h, w, y, p);
			g = q.x;
			h = q.y;
			d.push(g);
			d.push(h);
			if(i) {
				var u = {
						chart: this.chart,
						series: this,
						dataItem: f,
						x: this.realXAxis._getValue(e),
						y: c
					},
					o = this._getMarker(g, h);
				o.context = u;
				n.push(o)
			} else j.push({
				dataItem: f,
				x: this.realXAxis._getValue(e),
				y: c
			});
			if(s) {
				var r = this._getLabelValue(c, e),
					v = this._getDataPointLabel(c, g, h, t, r);
				m.push(v)
			}
		}
		var k = this._createShape(d);
		if(k) {
			l.push(k);
			if(!i) k.context = {
				chart: this.chart,
				series: this,
				points: j
			}
		}
		a.merge(l, n);
		a.merge(l, m)
	};
	C.prototype._createShape = function(b) {
		var a = new M(b);
		this._setShapeSettings(a);
		a.fillStyle = null;
		return a
	};
	C.prototype._getPixelMargins = function() {
		return {
			left: 0,
			right: 0
		}
	};

	function wb(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 0,
			markers: null
		});
		this.defaults = c;
		e.call(this, b)
	}
	wb.prototype = new C;
	wb.constructor = wb;
	wb.prototype._createShape = function(b) {
		var a = new M(b);
		this._setShapeSettings(a);
		return a
	};

	function nb(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 0,
			markers: null
		});
		this.defaults = c;
		e.call(this, b)
	}
	nb.prototype = new C;
	nb.constructor = nb;
	nb.prototype._createShape = function(b) {
		var a = new t(b, true);
		this._setShapeSettings(a);
		return a
	};

	function rb(a) {
		e.call(this, a)
	}
	rb.prototype = new C;
	rb.constructor = rb;
	rb.prototype._createShape = function(b) {
		var a = new t(b, true);
		this._setShapeSettings(a);
		a.fillStyle = null;
		return a
	};

	function x(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 2,
			markers: {}
		});
		this.defaults = c;
		e.call(this, b);
		this.notInGridArea = true
	}
	x.prototype = new e;
	x.constructor = x;
	x.prototype._createXAxis = function() {
		var a = new B;
		a.chart = this.chart;
		return a
	};
	x.prototype._createYAxis = function() {
		var a = new p;
		a.chart = this.chart;
		return a
	};
	x.prototype._findXAxis = function(b) {
		var a = this._findAxis(b, this.axisX);
		if(a != null) return a;
		for(var c = 0; c < b.length; c++) {
			a = b[c];
			if(a instanceof B) return a
		}
		return null
	};
	x.prototype._findYAxis = function(b) {
		var a = this._findAxis(b, this.axisY);
		if(a != null) return a;
		for(var c = 0; c < b.length; c++) {
			a = b[c];
			if(a instanceof p) return a
		}
		return null
	};
	x.prototype._render = function(m) {
		if(!this.data) return;
		for(var y = this.data.length, g = this.markers != null && this.markers.isVisible(), t = this.labels != null && this.labels.visible !== false, c = [], j = [], o = [], n = [], u = g ? this.markers.size / 2 : 0, e, f, h, d, z = this.realYAxis.cx, q = this.realYAxis.cy, i = 0; i < y; i++) {
			var k = this.data[i];
			if(k === null) {
				c.push(null);
				c.push(null);
				!g && j.push(null);
				continue
			}
			h = k[0];
			d = k[1];
			if(h === null || d === null) {
				c.push(null);
				c.push(null);
				!g && j.push(null);
				continue
			}
			var x = this.realXAxis._getAngle(h);
			e = this.realYAxis.getPosition(d);
			f = q;
			var r = b.rotatePointAt(e, f, x, z, q);
			e = r.x;
			f = r.y;
			c.push(e);
			c.push(f);
			if(g) {
				var v = {
						chart: this.chart,
						series: this,
						dataItem: this.data[i],
						x: h,
						y: d
					},
					p = this._getMarker(e, f);
				p.context = v;
				o.push(p)
			} else j.push({
				dataItem: k,
				x: h,
				y: d
			});
			if(t) {
				var s = this._getLabelValue(d, i),
					w = this._getDataPointLabel(d, e, f, u, s);
				n.push(w)
			}
		}
		var l = this._createShape(c);
		if(l) {
			m.push(l);
			if(!g) l.context = {
				chart: this.chart,
				series: this,
				points: j
			}
		}
		a.merge(m, o);
		a.merge(m, n)
	};
	x.prototype._createShape = function(b) {
		var a = new M(b);
		this._setShapeSettings(a);
		a.fillStyle = null;
		return a
	};
	x.prototype._getPixelMargins = function() {
		return {
			left: 0,
			right: 0
		}
	};

	function vb(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 0,
			markers: null
		});
		this.defaults = c;
		e.call(this, b)
	}
	vb.prototype = new x;
	vb.constructor = vb;
	vb.prototype._createShape = function(b) {
		var a = new M(b);
		this._setShapeSettings(a);
		return a
	};

	function qb(a) {
		e.call(this, a)
	}
	qb.prototype = new x;
	qb.constructor = qb;
	qb.prototype._createShape = function(b) {
		var a = new t(b, true);
		this._setShapeSettings(a);
		a.fillStyle = null;
		return a
	};

	function mb(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 0,
			markers: null
		});
		this.defaults = c;
		e.call(this, b)
	}
	mb.prototype = new x;
	mb.constructor = mb;
	mb.prototype._createShape = function(b) {
		var a = new t(b, true);
		this._setShapeSettings(a);
		return a
	};

	function pb(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 0,
			markers: {
				type: "diamond"
			}
		});
		this.defaults = c;
		e.call(this, b)
	}
	pb.prototype = new x;
	pb.constructor = pb;
	pb.prototype._createShape = function() {
		return null
	};

	function N(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 2,
			trendlineType: "linear",
			markers: {}
		});
		this.defaults = c;
		e.call(this, b)
	}
	N.prototype = new e;
	N.constructor = N;
	N.prototype._initData = function() {
		var l = this._getXAxisType();
		this.xAxisType = l;
		for(var k = this.tData = this._getTrendlineResult(), f = h, e = i, d = h, c = i, m = k.length, j = 0; j < m; j++) {
			var g = k[j];
			if(g == null) continue;
			var a = g[0];
			if(d > a) d = a;
			if(c < a) c = a;
			var b = g[1];
			if(f > b) f = b;
			if(e < b) e = b
		}
		this.min = f;
		this.max = e;
		this.minX = d;
		this.maxX = c
	};
	N.prototype._getTrendlineResult = function() {
		for(var j = this.data, k = j.length, d, f, i = [], c = [], h = [], b = 0; b < k; b++) {
			var e = j[b];
			if(e == null) continue;
			if(a.isArray(e) == false) {
				c.push(b + .5);
				h.push(e)
			} else {
				var g = e[0];
				switch(this.xAxisType) {
					case "CategoryAxis":
						g = b + .5;
						break;
					case "DateTimeAxis":
						g = g.getTime()
				}
				c.push(g);
				h.push(e[1])
			}
		}
		switch(this.trendlineType) {
			case "exp":
			case "exponential":
				d = this._getExpRegression(c, h);
				for(var b = 0; b < c.length; b++) {
					f = d[1] * Math.pow(d[0], c[b]);
					i.push([c[b], f])
				}
				break;
			case "linear":
			default:
				d = this._getLinearRegression(c, h);
				for(var b = 0; b < c.length; b++) {
					f = d[0] * c[b] + d[1];
					i.push([c[b], f])
				}
		}
		return i
	};
	N.prototype._getRegression = function(m, g) {
		var h = this.trendlineType,
			e = this.data.length,
			b = 0,
			f = 0,
			i = 0,
			j = 0,
			l = 0,
			d = [],
			c = [];
		if(h == "linear") {
			c = m;
			d = g
		} else if(h == "exp" || h == "exponential")
			for(var a = 0; a < g.length; a++)
				if(g[a] <= 0) e--;
				else {
					c.push(m[a]);
					d.push(Math.log(g[a]))
				}
		for(var a = 0; a < e; a++) {
			b = b + c[a];
			f = f + d[a];
			j = j + c[a] * d[a];
			i = i + c[a] * c[a];
			l = l + d[a] * d[a]
		}
		var k = (e * j - b * f) / (e * i - b * b),
			n = (f - k * b) / e;
		return [k, n]
	};
	N.prototype._getLinearRegression = function(a, b) {
		return this._getRegression(a, b)
	};
	N.prototype._getExpRegression = function(d, e) {
		var a = this._getRegression(d, e),
			c = Math.exp(a[0]),
			b = Math.exp(a[1]);
		return [c, b]
	};
	N.prototype._render = function(k) {
		if(!this.data) return;
		var c = this.tData,
			b = [],
			g = 1;
		if(this.trendlineType == "linear") g = c.length - 1;
		for(var i, j, e, f, d = 0; d < c.length; d += g) {
			var h = c[d];
			e = h[0];
			f = h[1];
			i = this.realXAxis.getPosition(e);
			j = this.realYAxis.getPosition(f);
			b.push(i);
			b.push(j)
		}
		var a;
		switch(this.trendlineType) {
			case "exp":
			case "exponential":
				a = new t(b);
				break;
			case "linear":
			default:
				a = new A(b)
		}
		this._setShapeSettings(a);
		k.push(a);
		this._addLengthAnimation(a)
	};

	function J(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 2,
			markers: {}
		});
		this.defaults = c;
		e.call(this, b)
	}
	J.prototype = new n;
	J.constructor = J;
	J.prototype._render = function(b) {
		if(!this.data) return;
		var a = this._getXAxisType();
		this.xAxisType = a;
		switch(a) {
			case "LinearAxis":
			case "DateTimeAxis":
				this._renderXYData(b);
				return;
			case "CategoryAxis":
				this._renderCatValueData(b);
				return
		}
	};
	J.prototype._renderCatValueData = function(j) {
		for(var o = this.data.length, e = this.markers != null && this.markers.isVisible(), c = [], i = [], n = [], l = [], q = e ? this.markers.size / 2 : 0, h, k, p, d, g = 0; g < o; g++) {
			var f = this.data[g];
			if(f === null) {
				c.push(null);
				c.push(null);
				!e && i.push(null);
				continue
			}
			p = h = g + .5;
			if(a.isArray(f) == false) d = f;
			else {
				d = f[1];
				if(b.isNull(d)) {
					c.push(null);
					c.push(null);
					!e && i.push(null);
					continue
				}
			}
			k = this.realXAxis.getPosition(h);
			h = this.realYAxis.getPosition(d);
			c.push(h);
			c.push(k);
			!e && i.push({
				dataItem: f,
				x: p,
				y: d
			});
			if(this.realYAxis.isValueVisible(d) === false) continue;
			this._addMarkerAndLabel(n, l, h, k, g, o, null, d, q)
		}
		var m = this._createShape(c, j);
		if(!e && m) m.context = {
			chart: this.chart,
			series: this,
			points: i
		};
		else a.merge(j, n);
		a.merge(j, l)
	};
	J.prototype._renderXYData = function(j) {
		for(var p = this.data.length, e = this.markers != null && this.markers.isVisible(), r = this.labels != null && this.labels.visible !== false, c = [], g = [], o = [], m = [], q = e ? this.markers.size / 2 : 0, k, l, f, d, i = 0; i < p; i++) {
			var h = this.data[i];
			if(h === null) {
				c.push(null);
				c.push(null);
				!e && g.push(null);
				continue
			}
			f = h[0];
			d = h[1];
			if(b.isNull(f) || b.isNull(d)) {
				c.push(null);
				c.push(null);
				!e && g.push(null);
				continue
			}
			k = this.realXAxis.getPosition(f);
			l = this.realYAxis.getPosition(d);
			c.push(k);
			c.push(l);
			!e && g.push({
				dataItem: h,
				x: f,
				y: d
			});
			if(this.realYAxis.isValueVisible(d) === false) continue;
			this._addMarkerAndLabel(o, m, k, l, i, p, f, d, q)
		}
		var n = this._createShape(c, j);
		if(!e && n) n.context = {
			chart: this.chart,
			series: this,
			points: g
		};
		else a.merge(j, o);
		a.merge(j, m)
	};
	J.prototype._createShape = function(c, b) {
		var a = new A(c);
		this._setShapeSettings(a);
		b.push(a);
		this._addLengthAnimation(a);
		return a
	};
	J.prototype._initColors = function(a) {
		this.fillStyle = this.fillStyle || a;
		this.strokeStyle = this.strokeStyle || a
	};

	function ub(a) {
		J.call(this, a)
	}
	ub.prototype = new J;
	ub.constructor = ub;
	ub.prototype._createShape = function(c, b) {
		var a = new t(c);
		this._setShapeSettings(a);
		b.push(a);
		this._addLengthAnimation(a);
		return a
	};

	function U(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 0,
			markers: null
		});
		this.defaults = c;
		e.call(this, b)
	}
	U.prototype = new J;
	U.constructor = U;
	U.prototype._createShape = function(i, h) {
		var g = [];
		a.merge(g, i);
		var c = new A(g);
		this._setShapeSettings(c);
		var f = this.chart.gridArea,
			k = f.x,
			j = f.x + f.width,
			e = this.realYAxis.getCrossingPosition();
		e = b.fitInRange(e, k, j);
		var d = new ab(i, e, true);
		d.fillStyle = this.fillStyle;
		d.lineWidth = 0;
		h.push(d);
		h.push(c);
		this._addLengthAnimation(d);
		this._addLengthAnimation(c);
		return c
	};
	U.prototype._isAnchoredToOrigin = function() {
		return true
	};

	function ob(a) {
		U.call(this, a)
	}
	ob.prototype = new U;
	ob.constructor = ob;
	ob.prototype._createShape = function(i, h) {
		var g = [];
		a.merge(g, i);
		var d = new t(g);
		this._setShapeSettings(d);
		var f = this.chart.gridArea,
			k = f.x,
			j = f.x + f.width,
			e = this.realYAxis.getCrossingPosition();
		e = b.fitInRange(e, k, j);
		var c = new ab(i, e, true, true);
		c.fillStyle = this.fillStyle;
		c.lineWidth = 0;
		h.push(c);
		h.push(d);
		this._addLengthAnimation(c);
		this._addLengthAnimation(d);
		return d
	};

	function q(b) {
		var c = a.extend(true, {}, this.defaults, {
			lineWidth: 0,
			markers: null
		});
		this.defaults = c;
		e.call(this, b)
	}
	q.prototype = new e;
	q.constructor = q;
	q.prototype._initXYData = function() {
		this._initXYDataRange(1, 3)
	};
	q.prototype._initCatValueData = function() {
		this._initCatValueDataRange(1, 3)
	};
	q.prototype._initDateValueData = function() {
		this._initDateValueDataRange(1, 3)
	};
	q.prototype._initVisibleCatValueData = function() {
		this._initVisibleCatValueDataRange(1, 3)
	};
	q.prototype._initVisibleXYData = function() {
		this._initVisibleXYDataRange(1, 3)
	};
	q.prototype._render = function(b) {
		if(!this.data) return;
		var a = this._getXAxisType();
		this.xAxisType = a;
		switch(a) {
			case "LinearAxis":
			case "DateTimeAxis":
				this._renderXYData(b);
				return;
			case "CategoryAxis":
				this._renderCatValueData(b);
				return
		}
	};
	q.prototype._renderCatValueData = function(k) {
		for(var l = this.data.length, e = this.markers != null && this.markers.isVisible(), c = [], d = [], f = [], r = [], p = [], s = e ? this.markers.size / 2 : 0, j, n, o, m, g, h, b = 0; b < l; b++) {
			var i = this.data[b];
			if(i === null) {
				c.push(null);
				c.push(null);
				d.push(null);
				d.push(null);
				!e && f.push(null);
				continue
			}
			m = b + .5;
			g = i[1];
			h = i[2];
			j = this.realXAxis.getPosition(m);
			n = this.realYAxis.getPosition(g);
			o = this.realYAxis.getPosition(h);
			c.push(j);
			c.push(n);
			d.push(j);
			d.push(o);
			if(!e) f[b] = f[2 * l - b - 1] = {
				dataItem: i,
				x: m,
				from: g,
				to: h
			};
			this._addMarkersAndLabels(r, p, j, n, o, b, l, null, g, h, s)
		}
		var q = this._createShape(c, d, k);
		if(!e && q) q.context = {
			chart: this.chart,
			series: this,
			points: f
		};
		else a.merge(k, r);
		a.merge(k, p)
	};
	q.prototype._renderXYData = function(i) {
		for(var l = this.data.length, d = this.markers != null && this.markers.isVisible(), t = this.labels != null && this.labels.visible !== false, j = [], k = [], e = [], r = [], p = [], s = d ? this.markers.size / 2 : 0, h, n, o, m, f, g, b = 0; b < l; b++) {
			var c = this.data[b];
			if(c === null) {
				pts.push(null);
				pts.push(null);
				!d && e.push(null);
				continue
			}
			m = c[0];
			f = c[1];
			g = c[2];
			h = this.realXAxis.getPosition(m);
			n = this.realYAxis.getPosition(f);
			o = this.realYAxis.getPosition(g);
			j.push(h);
			j.push(n);
			k.push(h);
			k.push(o);
			if(!d) e[b] = e[2 * l - b - 1] = {
				dataItem: c,
				x: m,
				from: f,
				to: g
			};
			this._addMarkersAndLabels(r, p, h, n, o, b, l, null, f, g, s)
		}
		var q = this._createShape(j, k, i);
		if(!d && q) q.context = {
			chart: this.chart,
			series: this,
			points: e
		};
		else a.merge(i, r);
		a.merge(i, p)
	};
	q.prototype._createShape = function(c, d, b) {
		var a = new eb(c, d);
		this._setShapeSettings(a);
		b.push(a);
		this._addLengthAnimation(a);
		return a
	};
	q.prototype._addMarkersAndLabels = function(g, m, i, p, q, c, h, o, d, e, l) {
		var k = 0,
			r = o ? o : c;
		if(this.markers && this.markers.isVisible()) {
			var f = {
				chart: this.chart,
				series: this,
				dataItem: this.data[c],
				x: this.realXAxis._getValue(r),
				from: d,
				to: e
			};
			k = this.markers.offset;
			var n = f.dataItem[3],
				a = this._addMarker(i, p, null, d, n);
			if(a.marker) {
				a.marker.context = f;
				a.line && g.push(a.line);
				g.push(a.marker);
				this._addShapeAnimation(a.marker, c, h)
			}
			a = this._addMarker(i, q, null, e, n);
			if(a.marker) {
				a.marker.context = f;
				a.line && g.push(a.line);
				g.push(a.marker);
				this._addShapeAnimation(a.marker, c, h)
			}
		}
		if(this.labels && this.labels.visible !== false) {
			var j = this._getLabelValue(d, c),
				b = this._getDataPointLabel(d, i, p, l + k, j, d > e),
				f = {
					chart: this.chart,
					series: this,
					dataItem: this.data[c]
				};
			b.context = f;
			this.chart.elem.trigger("dataPointLabelCreating", b);
			m.push(b);
			this._addShapeAnimation(b, c, h);
			j = this._getLabelValue(e, c);
			b = this._getDataPointLabel(e, i, q, l + k, j, e > d);
			b.context = f;
			this.chart.elem.trigger("dataPointLabelCreating", b);
			m.push(b);
			this._addShapeAnimation(b, c, h)
		}
	};
	q.prototype._getDataPointLabel = function(i, h, d, c, e, f) {
		var g = this._getLabelText(e),
			b = new w(g);
		a.extend(b, this.labels);
		b.textAlign = "center";
		b.x = h;
		if(f) {
			b.y = d - c;
			b.textBaseline = "bottom"
		} else {
			b.y = d + c;
			b.textBaseline = "top"
		}
		return b
	};
	q.prototype._getTooltip = function(b) {
		var a = "From: <b>" + b.from.toString() + "</b></br>To: <b>" + b.to.toString() + "</b>";
		if(this.title) {
			var d = c.getColorFromFillStyle(this.fillStyle);
			a = '<div style="color:' + d + '">' + this.title + "</div>" + a
		}
		return a
	};

	function sb(a) {
		q.call(this, a)
	}
	sb.prototype = new q;
	sb.constructor = sb;
	sb.prototype._createShape = function(c, d, b) {
		var a = new eb(c, d, true);
		this._setShapeSettings(a);
		b.push(a);
		this._addLengthAnimation(a);
		return a
	};

	function r(b, a) {
		this.chart = b;
		a && this.setOptions(a)
	}
	r.prototype.setOptions = function(c) {
		this.clear();
		c = c || {};
		for(var e = [], d = 0; d < c.length; d++) {
			var b = c[d],
				a;
			switch(b.type) {
				case "category":
					a = new D(b);
					break;
				case "dateTime":
					a = new l(b);
					break;
				case "linearRadius":
					a = new p(b);
					break;
				case "categoryAngle":
					a = new F(b);
					break;
				case "linearAngle":
					a = new B(b);
					break;
				case "linear":
				default:
					a = new j(b)
			}
			a._setChart(this.chart);
			e.push(a)
		}
		this.userAxes = e
	};
	r.prototype._initSeriesAxes = function() {
		var b = [];
		a.merge(b, this.userAxes);
		for(var e = this.chart.series.items, d = 0; d < e.length; d++) {
			var c = e[d];
			c._initXAxis(b);
			c._initYAxis(b);
			c._initSharedAxes()
		}
		this.items = b
	};
	r.prototype._initSeries = function() {
		for(var b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c._initSeries()
		}
	};
	r.prototype._initRanges = function() {
		for(var b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c._initRange()
		}
	};
	r.prototype._resetWH = function() {
		for(var c = this.items, b = 0; b < c.length; b++) {
			var a = c[b];
			if(!a.isCustomWidth) {
				a.width = 0;
				a.height = 0
			}
		}
	};
	r.prototype._measure = function() {
		for(var c = this.items, a = false, b = 0; b < c.length; b++) {
			var e = c[b],
				d = e._measure();
			a = a || d
		}
		return a
	};
	r.prototype._arrange = function() {
		for(var b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c._arrange()
		}
	};
	r.prototype._getAxesInLoc = function(e) {
		for(var d = [], b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c.location == e && d.push(c)
		}
		return d
	};
	r.prototype._getVAxes = function() {
		for(var d = [], b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c.isVertical() && d.push(c)
		}
		return d
	};
	r.prototype._getHAxes = function() {
		for(var d = [], b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c.isVertical() == false && d.push(c)
		}
		return d
	};
	r.prototype._getTotalWidth = function() {
		for(var a = 0, c = this.items, b = 0; b < c.length; b++) {
			var d = c[b];
			if(d.isVertical()) a = a + d.width
		}
		return a
	};
	r.prototype._getTotalHeight = function() {
		for(var a = 0, c = this.items, b = 0; b < c.length; b++) {
			var d = c[b];
			if(d.isVertical() == false) a = a + d.height
		}
		return a
	};
	r.prototype._render = function(f) {
		for(var d = this.items, c = [], b = 0; b < d.length; b++) {
			var g = d[b],
				e = g._render(f);
			e && a.merge(c, e)
		}
		return c
	};
	r.prototype._updateOrigins = function() {
		for(var b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c._updateOrigin()
		}
	};
	r.prototype._correctOrigins = function() {
		for(var b = this.items, a = 0; a < b.length; a++) {
			var c = b[a];
			c._correctOrigin && c._correctOrigin()
		}
	};
	r.prototype.find = function(d) {
		var b = this.items;
		if(d != null)
			for(var a = 0; a < b.length; a++) {
				var c = b[a];
				if(c.name == d) return c
			}
		return null
	};
	r.prototype.clear = function() {
		if(!this.items) return;
		a.each(this.items, function() {
			this.clear()
		})
	};

	function o(b) {
		var c = a.extend(true, {}, this.defaults, {
			rangeSliderBreadth: 20
		});
		this.defaults = c;
		yb.call(this, b)
	}
	o.prototype = new yb;
	o.constructor = o;
	o.prototype._initSeries = function() {
		for(var c = new u(null, this.chart), d = this.chart.series.items, b = 0; b < d.length; b++) {
			var a = d[b];
			(a.realXAxis == this || a.realYAxis == this) && c.items.push(a)
		}
		this.series = c
	};
	o.prototype._setVisibleRanges = function() {
		yb.prototype._setVisibleRanges.call(this);
		if(!this.rangeSlider) return;
		var a = (this.actualMaximum - this.actualMinimum) / 10;
		this.rangeSlider.jqRangeSlider("update", {
			minimum: this.actualMinimum,
			maximum: this.actualMaximum,
			smallChange: a,
			largeChange: 2 * a,
			minRange: a / 100,
			range: {
				minimum: this.actualVisibleMinimum,
				maximum: this.actualVisibleMaximum
			}
		})
	};
	o.prototype._arrange = function() {
		yb.prototype._arrange.call(this);
		if(!this.zoomEnabled) {
			this.clear();
			return
		}
		var d = this.rangeSliderBreadth;
		this.offset += d;
		var f = this.offset;
		if(!this.rangeSlider) {
			var e = a('<div style="position:absolute"></div>').jqRangeSlider({}),
				b = this;
			e.bind("rangeChanging", function(c, a) {
				var a = a;
				b.visibleMinimum = a.minimum;
				b.visibleMaximum = a.maximum;
				b.chart.partialDelayedUpdate()
			});
			e.bind("rangeChanged", function(c, a) {
				var a = a;
				b.visibleMinimum = a.minimum;
				b.visibleMaximum = a.maximum;
				b.chart.partialDelayedUpdate()
			});
			this.chart.elem.append(e);
			this.rangeSlider = e
		}
		var c;
		switch(this.location) {
			case "left":
				c = {
					left: this.x + this.width - f,
					top: this.y,
					width: d,
					height: this.height
				};
				break;
			case "right":
				c = {
					left: this.x + this.lineWidth,
					top: this.y,
					width: d,
					height: this.height
				};
				break;
			case "top":
				c = {
					left: this.x,
					top: this.y + this.height - f,
					width: this.width,
					height: d
				};
				break;
			case "bottom":
				c = {
					left: this.x,
					top: this.y + this.lineWidth,
					width: this.width,
					height: d
				}
		}
		if(c) {
			var g = this.isAxisVertical ? "vertical" : "horizontal";
			this.rangeSlider.css(c).jqRangeSlider("update", {
				orientation: g,
				reversed: this.reversed
			})
		}
	};
	o.prototype._moveVisibleRange = function(f, g) {
		var e = this.isAxisVertical,
			c = this.actualVisibleMinimum,
			b = this.actualVisibleMaximum,
			d = b - c,
			a = 0;
		if(e) a = -d * g / this.length;
		else a = d * f / this.length;
		if(this.reversed) a = -a;
		a = Math.max(a, this.actualMinimum - c);
		a = Math.min(a, this.actualMaximum - b);
		this.visibleMinimum = c + a;
		this.visibleMaximum = b + a;
		this._setVisibleRanges()
	};
	o.prototype._scaleVisibleRange = function(a, f) {
		var e = this.actualVisibleMinimum,
			d = this.actualVisibleMaximum,
			h = d - e,
			i = this.getZoom(),
			l, b, c, m = this.isAxisVertical;
		if(m) {
			l = a.dy / f.dy;
			var p = f.y1 - a.y1,
				q = f.y2 - a.y2;
			b = -h * q / this.length / i;
			c = -h * p / this.length / i;
			if(a.y1 > a.y2) {
				var j = b;
				b = c;
				c = j
			}
		} else {
			l = a.dx / f.dx;
			var n = f.x1 - a.x1,
				o = f.x2 - a.x2;
			b = h * n / this.length / i;
			c = h * o / this.length / i;
			if(a.x1 > a.x2) {
				var j = b;
				b = c;
				c = j
			}
		}
		if(this.reversed) {
			var j = b;
			b = -c;
			c = -j
		}
		var k = (e + d) / 2,
			g = (this.actualMaximum - this.actualMinimum) / 1e3;
		e = Math.max(this.actualMinimum, e - b);
		d = Math.min(this.actualMaximum, d - c);
		if(e > d - g) {
			g /= 2;
			e = k - g;
			d = k + g
		}
		this.visibleMinimum = e;
		this.visibleMaximum = d;
		this._setVisibleRanges()
	};
	o.prototype.clear = function() {
		if(this.rangeSlider) {
			this.rangeSlider.jqRangeSlider("destroy");
			this.rangeSlider.remove();
			this.rangeSlider = null
		}
	};

	function D(a) {
		o.call(this, a);
		this.DataType = "CategoryAxis"
	}
	D.prototype = new o;
	D.constructor = D;
	D.prototype._initRange = function() {
		var b = this.series;
		b._initCategories();
		var c = b.categories,
			a = c.length;
		if(this.categories) a = Math.max(a, this.categories.length);
		this.actualMinimum = 0;
		this.actualMaximum = a;
		this._setVisibleRanges();
		this.actualInterval = 1;
		this.seriesCategories = c
	};
	D.prototype._getLabelIntervals = function(d, c) {
		var e = 0;
		if(c && c.intervalOffset) e = c.intervalOffset;
		for(var f = [], h = Math.round(this.actualVisibleMinimum), g = this._getIntervalStart(h, d) + .5, a = g + e; a <= this.actualVisibleMaximum; a = b.round(a + d)) f.push(a);
		return f
	};
	D.prototype._getIntervalCount = function() {
		return this.categories.length
	};
	D.prototype._getValue = function(c) {
		var b = Math.round(c),
			a;
		if(this.categories && b < this.categories.length) a = this.categories[b];
		else a = this.seriesCategories[b];
		return a
	};
	D.prototype.getLabel = function(d) {
		var b;
		if(a.type(d) == "string") b = d;
		else {
			var c = Math.round(d - .5);
			if(this.categories && c < this.categories.length) b = this.categories[c];
			else b = this.seriesCategories[c]
		}
		return o.prototype.getLabel.call(this, b)
	};
	D.prototype.getOrientation = function() {
		return "x"
	};

	function Db(a) {
		o.call(this, a)
	}
	Db.prototype = new o;
	Db.constructor = Db;

	function j(b) {
		var c = a.extend(true, {}, this.defaults, {
			logarithmic: false,
			logBase: 10,
			labels: {
				resolveOverlappingMode: "hide"
			}
		});
		this.defaults = c;
		o.call(this, b);
		this.DataType = "LinearAxis"
	}
	j.prototype = new o;
	j.constructor = j;
	j.prototype._initRange = function() {
		var j = this.series;
		j._initRanges();
		var g, f;
		if(this.getOrientation() == "x") {
			g = j.minX;
			f = j.maxX
		} else {
			g = j.min;
			f = j.max
		}
		if(g == h && f == i) {
			g = 0;
			f = 10
		}
		var p = this._addPlotsInRange(g, f);
		g = p.min;
		f = p.max;
		if(this.skipEmptyDays) f -= this.totalEmptyDaysTicks;
		var n = Math.abs(f - g);
		if(n == 0) n = 1;
		var m = 0,
			l = 0,
			d = j._getPixelMargins(this);
		if(this.isAxisVertical) {
			d.left = b.isNull(this.bottomMargin) ? d.left + .5 : this.bottomMargin;
			d.right = b.isNull(this.topMargin) ? d.right + .5 : this.topMargin
		} else {
			d.left = b.isNull(this.leftMargin) ? d.left + .5 : this.leftMargin;
			d.right = b.isNull(this.rightMargin) ? d.right + .5 : this.rightMargin
		}
		var o = n / this.length;
		m = o * d.left;
		l = o * d.right;
		if(this.logarithmic === true) {
			m = b.log(m, this.logBase);
			l = b.log(l, this.logBase)
		}
		var a = g - m,
			c = f + l,
			r = this.series._isAnchoredToOrigin(),
			e = this.crossing;
		if(r && this.getOrientation() == "y")
			if(g >= e && a < e) a = e;
			else if(f <= e && c > e) c = e;
		if(this.extendRangeToOrigin)
			if(a > e) a = e;
			else if(c < e) c = e;
		if(this.logarithmic === true) {
			var q = 1;
			if(a < q) a = q;
			a = b.log(a, this.logBase);
			c = b.log(c, this.logBase);
			var k = this._calculateActualIntervalLogarithmic(a, c);
			a = b.round(Math.floor(a / k) * k);
			c = b.round(Math.ceil(c / k) * k)
		}
		this._setMinMax(a, c);
		this._setVisibleRanges();
		if(this.logarithmic === true) this.actualInterval = this._calculateActualIntervalLogarithmic(this.actualVisibleMinimum, this.actualVisibleMaximum);
		else this.actualInterval = this._calculateActualInterval(this.actualVisibleMinimum, this.actualVisibleMaximum)
	};
	j.prototype._addPlotsInRange = function(b, a) {
		var e = this.plotLines;
		if(e)
			for(var c = 0; c < e.length; c++) {
				var h = e[c].value;
				b = Math.min(b, h);
				a = Math.max(a, h)
			}
		var d = this.plotBands;
		if(d)
			for(var c = 0; c < d.length; c++) {
				var f = d[c].from,
					g = d[c].to;
				b = Math.min(b, f);
				a = Math.max(a, f);
				b = Math.min(b, g);
				a = Math.max(a, g)
			}
		return {
			min: b,
			max: a
		}
	};
	j.prototype._calculateActualIntervalLogarithmic = function(e, d) {
		if(this.interval) return this.interval;
		var c = (d - e) / 3,
			a = Math.floor(b.log10(Math.abs(c)));
		if(a == 0) a = 1;
		return b.round(Math.floor(c / a) * a)
	};
	j.prototype._getIntervals = function(c, a, h) {
		if(this.logarithmic === false) return o.prototype._getIntervals.call(this, c, a);
		if(h === false) return this._getLogarithmicMinorIntervals(c, a);
		var e = 0;
		if(a && a.intervalOffset) e = a.intervalOffset;
		for(var f = [], g = this._getIntervalStart(this.actualVisibleMinimum, c), d = g + e; d <= this.actualVisibleMaximum; d = b.round(d + c)) f.push(Math.pow(this.logBase, d));
		return f
	};
	j.prototype._getLogarithmicMinorIntervals = function(m, k) {
		for(var l = this._getMarkInterval(k.major, true), h = this._getIntervals(l, k.major, true), j = [], d = null, g = 0; g < h.length; g++) {
			var f = h[g];
			if(d == null) {
				d = f;
				continue
			}
			var a = d,
				c = f;
			if(a < c) {
				var n = a;
				a = c;
				c = n
			}
			var i = (a - c) * m / 10,
				e = c + i;
			while(e < a) {
				j.push(b.round(e));
				e += i
			}
			d = f
		}
		return j
	};
	j.prototype._getIntervalCount = function() {
		return Math.ceil(this.actualMaximum - this.actualMinimum)
	};
	j.prototype.getCrossingPosition = function() {
		return this.getPosition(this.crossing)
	};
	j.prototype.getOrientation = function(b) {
		var a = this.isVertical();
		if(this.series)
			for(var c = 0; c < this.series.items.length; c++) b = this.series.items[c];
		if(b && b.isVertical) a = !a;
		return a ? "y" : "x"
	};
	j.prototype.getPosition = function(a) {
		if(this.logarithmic == true) a = b.log(a, this.logBase);
		var c = o.prototype.getPosition.call(this, a);
		return c
	};

	function l(b) {
		var c = a.extend(true, {}, this.defaults, {
			labels: {
				yearsIntervalStringFormat: "yyyy",
				monthsIntervalStringFormat: a.fn.jqChart.dateFormat.masks.shortDate,
				weeksIntervalStringFormat: a.fn.jqChart.dateFormat.masks.shortDate,
				daysIntervalStringFormat: a.fn.jqChart.dateFormat.masks.shortDate,
				hoursIntervalStringFormat: a.fn.jqChart.dateFormat.masks.shortTime,
				minutesIntervalStringFormat: a.fn.jqChart.dateFormat.masks.shortTime,
				secondsIntervalStringFormat: a.fn.jqChart.dateFormat.masks.mediumTime,
				millisecondsIntervalStringFormat: a.fn.jqChart.dateFormat.masks.mediumTime
			},
			skipEmptyDays: false
		});
		this.defaults = c;
		j.call(this, b);
		this.DataType = "DateTimeAxis"
	}
	l.prototype = new j;
	l.constructor = l;
	l.prototype._initRange = function() {
		if(this.skipEmptyDays) {
			this.emptyDays = this._getEmptyDays();
			this.totalEmptyDaysTicks = this.emptyDays.length * d.ticksInDay
		} else this.totalEmptyDaysTicks = 0;
		j.prototype._initRange.call(this);
		this._initActualStringFormat()
	};
	l.prototype._setMinMax = function(c, b) {
		if(this.minimum != null)
			if(a.type(this.minimum) == "date") this.actualMinimum = this.minimum.getTime();
			else this.actualMinimum = this.minimum;
		else this.actualMinimum = c;
		if(this.maximum != null)
			if(a.type(this.minimum) == "date") this.actualMaximum = this.maximum.getTime();
			else this.actualMaximum = this.maximum;
		else this.actualMaximum = b
	};
	l.prototype._calculateActualInterval = function(c, b) {
		if(this.skipEmptyDays) b += this.totalEmptyDaysTicks;
		var a = this._calculateDateTimeInterval(c, b);
		if(this.intervalType != null) this.actualIntervalType = this.intervalType;
		else this.actualIntervalType = this.type;
		if(this.interval != null) a = this.interval;
		return a
	};
	l.prototype._calculateDateTimeInterval = function(j, i) {
		var h = i - j,
			f = .8 * this.maxInter200Px,
			g = Math.max(1, this.length),
			e = g / (200 * 10 / f),
			b = h / e;
		this.type = "year";
		var a = b / (1e3 * 60);
		if(a <= 1) {
			if(b <= 10) {
				this.type = "milliseconds";
				return 1
			}
			if(b <= 50) {
				this.type = "milliseconds";
				return 4
			}
			if(b <= 200) {
				this.type = "milliseconds";
				return 20
			}
			if(b <= 500) {
				this.type = "milliseconds";
				return 50
			}
			var c = b / 1e3;
			if(c <= 7) {
				this.type = "seconds";
				return 1
			}
			if(c <= 15) {
				this.type = "seconds";
				return 2
			}
			if(c <= 30) {
				this.type = "seconds";
				return 5
			}
			if(c <= 60) {
				this.type = "seconds";
				return 10
			}
		} else if(a <= 2) {
			this.type = "seconds";
			return 20
		}
		if(a <= 3) {
			this.type = "Seconds";
			return 30
		}
		if(a <= 10) {
			this.type = "minutes";
			return 1
		}
		if(a <= 20) {
			this.type = "minutes";
			return 2
		}
		if(a <= 60) {
			this.type = "minutes";
			return 5
		}
		if(a <= 120) {
			this.type = "minutes";
			return 10
		}
		if(a <= 180) {
			this.type = "minutes";
			return 30
		}
		if(a <= 60 * 12) {
			this.type = "hours";
			return 1
		}
		if(a <= 60 * 24) {
			this.type = "hours";
			return 4
		}
		if(a <= 60 * 24 * 2) {
			this.type = "hours";
			return 6
		}
		if(a <= 60 * 24 * 3) {
			this.type = "hours";
			return 12
		}
		if(a <= 60 * 24 * 10) {
			this.type = "days";
			return 1
		}
		if(a <= 60 * 24 * 20) {
			this.type = "days";
			return 2
		}
		if(a <= 60 * 24 * 30) {
			this.type = "days";
			return 3
		}
		if(a <= 60 * 24 * 30.5 * 2) {
			this.type = "weeks";
			return 1
		}
		if(a <= 60 * 24 * 30.5 * 5) {
			this.type = "weeks";
			return 2
		}
		if(a <= 60 * 24 * 30.5 * 12) {
			this.type = "months";
			return 1
		}
		if(a <= 60 * 24 * 30.5 * 24) {
			this.type = "months";
			return 3
		}
		if(a <= 60 * 24 * 30.5 * 48) {
			this.type = "months";
			return 6
		}
		this.type = "years";
		var d = a / 60 / 24 / 365;
		return d < 5 ? 1 : d < 10 ? 2 : Math.floor(d / 5)
	};
	l.prototype._getNextPosition = function(b, a) {
		return this._incrementDateTime(b, a, this.actualIntervalType)
	};
	l.prototype._incrementDateTime = function(h, b, c) {
		var a = new Date(h),
			e = 0;
		if(c == "days") a = d.addDays(a, b);
		else if(c == "hours") e = d.fromHours(b);
		else if(c == "milliseconds") e = b;
		else if(c == "seconds") e = d.fromSeconds(b);
		else if(c == "minutes") e = d.fromMinutes(b);
		else if(c == "weeks") a = d.addDays(a, 7 * b);
		else if(c == "months") {
			var f = false;
			if(a.getDate() == d.getDaysInMonth(a.getFullYear(), a.getMonth())) f = true;
			a = d.addMonths(a, Math.floor(b));
			e = d.fromDays(30 * (b - Math.floor(b)));
			if(f && e == 0) {
				var g = d.getDaysInMonth(a.getFullYear(), a.getMonth());
				a = d.addDays(a, g - a.getDate())
			}
		} else if(c == "years") {
			a = d.addYears(a, Math.floor(b));
			e = d.fromDays(365 * (b - Math.floor(b)))
		}
		return a.getTime() + e
	};
	l.prototype._getIntervalStart = function(j, b, e) {
		if(e == null) return j;
		var a = new Date(j);
		if(b > 0 && b != 1)
			if(e == "months" && b <= 12 && b > 1) {
				var i = a,
					c = new Date(a.getFullYear(), 0, 1, 0, 0, 0);
				while(c < a) {
					i = c;
					c = d.addMonths(c, b)
				}
				a = i;
				return a.getTime()
			}
		switch(e) {
			case "years":
				var g = a.getFullYear() / b * b;
				if(g <= 0) g = 1;
				a = new Date(g, 0, 1, 0, 0, 0);
				break;
			case "months":
				var f = a.getMonth() / b * b;
				if(f < 0) f = 0;
				a = new Date(a.getFullYear(), f, 1, 0, 0, 0);
				break;
			case "days":
				var h = a.getDate() / b * b;
				if(h <= 0) h = 1;
				a = new Date(a.getFullYear(), a.getMonth(), h, 0, 0, 0);
				break;
			case "hours":
				var n = a.getHours() / b * b;
				a = new Date(a.getFullYear(), a.getMonth(), a.getDate(), n, 0, 0);
				break;
			case "minutes":
				var l = a.getMinutes() / b * b;
				a = new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), l, 0);
				break;
			case "seconds":
				var m = a.getSeconds() / b * b;
				a = new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), m, 0);
				break;
			case "milliseconds":
				var k = a.getMilliseconds() / b * b;
				a = new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), k);
				break;
			case "weeks":
				a = new Date(a.getFullYear(), a.getMonth(), a.getDate(), 0, 0, 0);
				a = d.addDays(a, -d.getDayOfWeek(a))
		}
		return a.getTime()
	};
	l.prototype._initActualStringFormat = function() {
		if(!this.labels || this.labels.visible === false) return;
		if(this.labels.stringFormat) {
			this.actualStringFormat = this.labels.stringFormat;
			return
		}
		switch(this.actualIntervalType) {
			case "years":
				this.actualStringFormat = this.labels.yearsIntervalStringFormat;
				break;
			case "months":
				this.actualStringFormat = this.labels.monthsIntervalStringFormat;
				break;
			case "weeks":
				this.actualStringFormat = this.labels.weeksIntervalStringFormat;
				break;
			case "days":
				this.actualStringFormat = this.labels.daysIntervalStringFormat;
				break;
			case "hours":
				this.actualStringFormat = this.labels.hoursIntervalStringFormat;
				break;
			case "minutes":
				this.actualStringFormat = this.labels.minutesIntervalStringFormat;
				break;
			case "seconds":
				this.actualStringFormat = this.labels.secondsIntervalStringFormat;
				break;
			case "milliseconds":
				this.actualStringFormat = this.labels.millisecondsIntervalStringFormat;
				break;
			default:
				this.actualStringFormat = "default"
		}
	};
	l.prototype._getIntervals = function(f, c) {
		var i = [],
			e = this.actualVisibleMinimum,
			g = this.actualVisibleMaximum;
		if(this.skipEmptyDays) {
			e = this._addEmptyDaysOffset(e);
			g = this._addEmptyDaysOffset(g)
		}
		var a = this._getIntervalStart(e, f, this.actualIntervalType);
		while(a < e) a = this._incrementDateTime(a, f, this.actualIntervalType);
		if(c && c.intervalOffset) {
			var h = this.actualIntervalType,
				j = c.intervalOffset;
			if(c.intervalOffsetType) h = c.intervalOffsetType;
			a = this._incrementDateTime(a, j, h)
		}
		for(var b = a; b <= g; b = this._incrementDateTime(b, f, this.actualIntervalType)) {
			var d = this._getNextNonEmptyDay(b);
			if(d) {
				if(this.skipEmptyDays && b < d) b = d;
				i.push(d)
			}
		}
		return i
	};
	l.prototype._getIntervalCount = function() {
		var a = this.actualMaximum - this.actualMinimum;
		a = Math.ceil(a / d.ticksInDay);
		return a
	};
	l.prototype._getNextNonEmptyDay = function(b) {
		if(!this.emptyDays) return b;
		var e = a.inArray(b, this.emptyDays);
		if(e == -1) return b;
		var h = d.addDays(new Date(b), 1),
			g = this.actualMaximum;
		if(this.skipEmptyDays) g += this.totalEmptyDaysTicks;
		for(var c = h; c <= g; c = d.addDays(c, 1)) {
			var f = c.getTime(),
				e = a.inArray(f, this.emptyDays);
			if(e == -1) return f
		}
		return null
	};
	l.prototype._getEmptyDaysOffset = function(c) {
		for(var b = 0, a = 0; a < this.emptyDays.length; a++) {
			var e = this.emptyDays[a];
			if(e < c) b++;
			else break
		}
		return b * d.ticksInDay
	};
	l.prototype._addEmptyDaysOffset = function(b) {
		var a = b + this._getEmptyDaysOffset(b),
			c = this._getEmptyDaysOffset(a) - this._getEmptyDaysOffset(b);
		b = a;
		a += c;
		while(c) {
			var c = this._getEmptyDaysOffset(a) - this._getEmptyDaysOffset(b);
			b = a;
			a += c
		}
		return a
	};
	l.prototype._getEmptyDays = function() {
		for(var b = [], a = 0; a < this.series.items.length; a++) {
			var c = this.series.items[a];
			if(a == 0) b = this._getEmptyDaysFromSeries(c);
			else this._excludeDaysFromSeries(c, b)
		}
		return b
	};
	l.prototype._getEmptyDaysFromSeries = function(i) {
		var g = [],
			b = [];
		a.merge(b, i.data);
		b.sort(function(a, b) {
			return a[0] - b[0]
		});
		for(var c = d.roundToDay(b[0][0]), e = 1; e < b.length; e++) {
			for(var h = d.roundToDay(b[e][0]), j = (h - c) / d.ticksInDay, f = 1; f < j; f++) g.push(d.addDays(c, f).getTime());
			c = h
		}
		return g
	};
	l.prototype._excludeDaysFromSeries = function(c, b) {
		a.each(c.data, function(g, e) {
			var f = d.roundToDay(e[0]).getTime(),
				c = a.inArray(f, b);
			c != -1 && b.splice(c, 1)
		})
	};
	l.prototype.getPosition = function(b) {
		if(a.type(b) == "date") b = b.getTime();
		var c = 0;
		if(this.skipEmptyDays) c = this._getEmptyDaysOffset(b);
		var d = j.prototype.getPosition.call(this, b - c);
		return d
	};
	l.prototype.getLabel = function(b) {
		if(!this.labels || this.labels.visible === false || !this.actualStringFormat) return;
		var c = new Date(b);
		return a.fn.jqChart.dateFormat(c, this.actualStringFormat)
	};

	function p(b) {
		var c = a.extend(true, {}, this.defaults, {
			innerExtent: .2,
			renderStyle: "circle",
			majorTickMarks: {
				visible: false
			},
			location: "radial",
			majorGridLines: {
				strokeStyle: "grey",
				lineWidth: 1,
				visible: true
			}
		});
		this.defaults = c;
		j.call(this, b);
		this.DataType = "LinearRadiusAxis"
	}
	p.prototype = new j;
	p.constructor = p;
	p.prototype.getOrientation = function() {
		return "y"
	};
	p.prototype._measure = function() {
		this.width = 0;
		this.height = 0;
		return false
	};
	p.prototype._arrange = function() {
		this._initRadialMeasures()
	};
	p.prototype._updateOrigin = function() {
		var a = this.innerExtent * this.radius;
		this.origin = this.cx + a;
		this.length = this.radius - a;
		this.extent = a
	};
	p.prototype._getLabels = function() {
		var a = this.labels;
		if(a == null || a.visible === false) return [];
		for(var j = this._getMaxOutsideTickMarksLength() + this.lblMargin, e = [], k = this._getMarkInterval(a, true), f = this._getLabelIntervals(k, a), d = 0; d < f.length; d++) {
			var g = f[d],
				i = this.getLabel(g),
				c = this._createLabel(i, a),
				l = this.getPosition(g),
				n = this.cy,
				m = l,
				h = b.rotatePointAt(m, n, -Math.PI / 2, this.cx, this.cy);
			c.x = h.x - j;
			c.y = h.y;
			c.textAlign = "right";
			e.push(c)
		}
		return e
	};
	p.prototype._getTickMarks = function(a, k) {
		if(a == null || a.visible != true) return [];
		for(var h = [], s = this._getMarkInterval(a, k), t = a.length, j = this._getIntervals(s, a, k), g = this.sharedAxis, f = g._getIntervals(g.actualInterval), p, r, q, c, d = 0; d < j.length; d++) {
			var u = this.getPosition(j[d]);
			p = q = u;
			c = this.cy;
			r = c - t;
			for(var e = 0; e < f.length; e++) {
				var v = f[e],
					i = this.sharedAxis._getAngle(v),
					n = b.rotatePointAt(p, r, i, this.cx, this.cy),
					o = b.rotatePointAt(q, c, i, this.cx, this.cy),
					l = new m(n.x, n.y, o.x, o.y);
				a._setLineSettings(l);
				h.push(l)
			}
		}
		return h
	};
	p.prototype._getGridLines = function(a, g) {
		if(a == null || a.visible != true) return [];
		for(var d = [], h = this._getMarkInterval(a, g), e = this._getIntervals(h, a, true), c = 0; c < e.length; c++) {
			var f = e[c],
				b = this._getRenderShape(f);
			a._setLineSettings(b);
			b.fillStyle = null;
			d.push(b)
		}
		return d
	};
	p.prototype._render = function(d) {
		var f = this._getGridLines(this.minorGridLines, false);
		a.merge(d, f);
		var e = this._getGridLines(this.majorGridLines, true);
		a.merge(d, e);
		var c = [],
			i = this._getTickMarks(this.minorTickMarks, false);
		a.merge(c, i);
		var h = this._getTickMarks(this.majorTickMarks, true);
		a.merge(c, h);
		var b = this._getRenderShape(this.actualMinimum);
		b.strokeStyle = this.strokeStyle;
		b.lineWidth = this.lineWidth;
		b.strokeDashArray = this.strokeDashArray;
		b.fillStyle = null;
		d.push(b);
		var g = this._getLabels();
		a.merge(c, g);
		return c
	};
	p.prototype._getRenderShape = function(b) {
		var d = this.getPosition(b),
			a = d - this.origin + this.extent,
			c = this._createRenderShape(this.cx - a, this.cy - a, a);
		return c
	};
	p.prototype._createRenderShape = function(g, h, f) {
		if(this.renderStyle != "polygon") return new Y(g, h, f);
		for(var j = this.sharedAxis, a = [], d = this.sharedAxis.actualMaximum, i = 2 * Math.PI / d, g = this.cx, h = this.cy - f, c = 0; c < d; c++) {
			var e = b.rotatePointAt(g, h, c * i, this.cx, this.cy);
			a.push(e.x);
			a.push(e.y)
		}
		return new M(a)
	};

	function F(b) {
		var c = a.extend(true, {}, this.defaults, {
			strokeStyle: "grey",
			renderLinesOverGraph: true,
			location: "radial"
		});
		this.defaults = c;
		o.call(this, b);
		this.DataType = "CategoryAngleAxis"
	}
	F.prototype = new D;
	F.constructor = F;
	F.prototype._measure = function() {
		this.width = 0;
		this.height = 0;
		return false
	};
	F.prototype._arrange = function() {
		this._initRadialMeasures()
	};
	F.prototype._updateOrigin = function() {
		this.origin = this.cx;
		this.length = 2 * Math.PI * this.radius
	};
	F.prototype._correctOrigin = function() {
		for(var a = 0, j = this.x, k = this.y, i = this.x + this.width, f = this.y + this.height, g = this._getLabels(), c = 0; c < g.length; c++) {
			var b = g[c];
			if(b.x < j) a = Math.max(a, j - b.x);
			var e = b.x + b.width;
			if(e > i) a = Math.max(a, e - i);
			var h = b.y - b.height / 2;
			if(h < k) a = Math.max(a, k - h);
			var d = b.y + b.height / 2;
			if(d > f) a = Math.max(a, d - f)
		}
		this.radius -= a;
		this.length = 2 * Math.PI * this.radius;
		if(this.sharedAxis) {
			this.sharedAxis.radius = this.radius;
			this.sharedAxis._updateOrigin();
			this.sharedAxis._initRange()
		}
	};
	F.prototype._getAngle = function(b) {
		var d = this.actualMaximum,
			c = 2 * Math.PI / d,
			a = b * c;
		if(this.reversed === true) a = 2 * Math.PI - a;
		return a - Math.PI / 2
	};
	F.prototype._getLabels = function() {
		var f = this.labels;
		if(f == null || f.visible === false) return [];
		var g = this.actualMaximum;
		if(g == 0) return;
		for(var i = this.cx, j = this.cy, n = i, o = j - this.radius, m = 2 * Math.PI / g, c = 8, h = [], f = this.labels, e = 0; e < g; e++) {
			var d = e * m,
				k = b.rotatePointAt(n, o, d, i, j),
				l = this.getLabel(e),
				a = this._createLabel(l, f);
			a.x = k.x;
			a.y = k.y;
			if(d == Math.PI) {
				a.x -= a.width / 2;
				a.y += c
			} else if(d == 0) {
				a.x -= a.width / 2;
				a.y -= c
			} else if(d > Math.PI) a.x -= a.width + c;
			else a.x += c;
			h.push(a)
		}
		return h
	};
	F.prototype._render = function(n) {
		var f = [],
			g = this.actualMaximum;
		if(g == 0) return;
		for(var d = this.cx, e = this.cy, q = d, s = e - this.sharedAxis.extent, r = d, t = e - this.radius, o = this.renderLinesOverGraph, p = 2 * Math.PI / g, h = 0; h < g; h++) {
			var i = h * p,
				j = b.rotatePointAt(q, s, i, d, e),
				k = b.rotatePointAt(r, t, i, d, e),
				c = new m(j.x, j.y, k.x, k.y);
			c.strokeStyle = this.strokeStyle;
			c.lineWidth = this.lineWidth;
			c.strokeDashArray = this.strokeDashArray;
			if(o) f.push(c);
			else n.push(c)
		}
		var l = this._getLabels();
		a.merge(f, l);
		return f
	};

	function B(b) {
		var c = a.extend(true, {}, this.defaults, {
			minimum: 0,
			maximum: 360,
			renderLinesOverGraph: true,
			strokeStyle: "gray"
		});
		this.defaults = c;
		o.call(this, b);
		this.DataType = "LinearAngleAxis";
		this.location = "radial"
	}
	B.prototype = new j;
	B.constructor = B;
	B.prototype._initRange = function() {
		var j = this.series;
		j._initRanges();
		var f = j.minX,
			e = j.maxX;
		if(f == h && e == i) {
			f = 0;
			e = 10
		}
		var l = Math.abs(e - f);
		if(l == 0) l = 1;
		var a = f,
			c = e,
			m = this.series._isAnchoredToOrigin(),
			d = this.crossing;
		if(m && this.getOrientation() == "y")
			if(f >= d && a < d) a = d;
			else if(e <= d && c > d) c = d;
		if(this.extendRangeToOrigin)
			if(a > d) a = d;
			else if(c < d) c = d;
		if(this.logarithmic === true) {
			var k = 1;
			if(a < k) a = k;
			a = b.log(a, this.logBase);
			c = b.log(c, this.logBase);
			var g = this._calculateActualIntervalLogarithmic(a, c);
			a = b.round(Math.floor(a / g) * g);
			c = b.round(Math.ceil(c / g) * g)
		}
		this._setMinMax(a, c);
		this._setVisibleRanges();
		if(this.logarithmic === true) this.actualInterval = this._calculateActualIntervalLogarithmic(this.actualVisibleMinimum, this.actualVisibleMaximum);
		else this.actualInterval = this._calculateActualInterval(this.actualVisibleMinimum, this.actualVisibleMaximum)
	};
	B.prototype._measure = function() {
		this.width = 0;
		this.height = 0;
		return false
	};
	B.prototype._arrange = function() {
		this._initRadialMeasures()
	};
	B.prototype._updateOrigin = function() {
		this.origin = this.cx;
		this.length = 2 * Math.PI * this.radius
	};
	B.prototype._correctOrigin = function() {
		for(var a = 0, j = this.x, k = this.y, i = this.x + this.width, f = this.y + this.height, g = this._getLabels(), c = 0; c < g.length; c++) {
			var b = g[c];
			if(b.x < j) a = Math.max(a, j - b.x);
			var e = b.x + b.width;
			if(e > i) a = Math.max(a, e - i);
			var h = b.y - b.height / 2;
			if(h < k) a = Math.max(a, k - h);
			var d = b.y + b.height / 2;
			if(d > f) a = Math.max(a, d - f)
		}
		this.radius -= a;
		this.length = 2 * Math.PI * this.radius;
		if(this.sharedAxis) {
			this.sharedAxis.radius = this.radius;
			this.sharedAxis._updateOrigin();
			this.sharedAxis._initRange()
		}
	};
	B.prototype._getAngle = function(b) {
		var c = this.actualMaximum - this.actualMinimum,
			d = 2 * Math.PI / c,
			a = (b - this.actualMinimum) * d;
		if(this.reversed === true) a = 2 * Math.PI - a;
		return a - Math.PI / 2
	};
	B.prototype._getLabels = function() {
		var d = this.labels;
		if(d == null || d.visible === false) return [];
		for(var j = this.cx, k = this.cy, o = j + this.radius, p = k, e = 8, g = [], n = this._getMarkInterval(d, true), h = this._getLabelIntervals(n, d), f = 0; f < h.length - 1; f++) {
			var i = h[f],
				m = this.getLabel(i),
				c = this._getAngle(i),
				l = b.rotatePointAt(o, p, c, j, k),
				a = this._createLabel(m, d);
			a.x = l.x;
			a.y = l.y;
			c += Math.PI / 2;
			if(c == Math.PI) {
				a.x -= a.width / 2;
				a.y += e
			} else if(c == 0) {
				a.x -= a.width / 2;
				a.y -= e
			} else if(c > Math.PI) a.x -= a.width + e;
			else a.x += e;
			g.push(a)
		}
		return g
	};
	B.prototype._render = function(o) {
		var f = [],
			d = this.cx,
			e = this.cy,
			r = d,
			l = e;
		if(this.sharedAxis) l -= this.sharedAxis.extent;
		for(var s = d, t = e - this.radius, p = this.renderLinesOverGraph, i = this._getIntervals(this.actualInterval), g = 0; g < i.length - 1; g++) {
			var q = i[g],
				h = this._getAngle(q) + Math.PI / 2,
				j = b.rotatePointAt(r, l, h, d, e),
				k = b.rotatePointAt(s, t, h, d, e),
				c = new m(j.x, j.y, k.x, k.y);
			c.strokeStyle = this.strokeStyle;
			c.lineWidth = this.lineWidth;
			c.strokeDashArray = this.strokeDashArray;
			if(p) f.push(c);
			else o.push(c)
		}
		var n = this._getLabels();
		a.merge(f, n);
		return f
	}
})(jQuery)