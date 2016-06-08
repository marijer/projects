import d3 from 'd3';

var TreeChart = function () {
	var m = [0, 20, 0, 80],
		w = 600 - m[1] - m[3],
		h = 100 - m[0] - m[2],
		i = 0,
		root;

	var tree = d3.layout.tree().size([h, w]);

	var diagonal = d3.svg.diagonal()
		.projection(function(d) {
			return [d.y, d.x];
		});

	var vis = d3.select('#tree-container').append('svg:svg')
		.attr('width', w + m[1] + m[3])
		.attr('height', h + m[0] + m[2])
		.append('svg:g')
		.attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');


	var Tree = {

		jsonLocation: 'components/treechart/assets/data.json',

		nodeSize: 5.5,
		nodeDepth: 95,

		durationFast: 500,
		durationSlow: 5000,

		selectedNode: undefined,

		init: function() {
			var obj = Tree;

			obj.start();
		},

		start: function() {
			d3.json(Tree.jsonLocation, function(json) {
				root = json;
				root.x0 = h / 2;
				root.y0 = 0;

				// Initialize the display to show a few nodes.
				root.children.forEach(Tree.toggleAll);

				Tree.setCurrentNode(root);
			});
		},

		update: function(source) {
			var obj = Tree;

			var duration = d3.event && d3.event.altKey ? obj.durationSlow : obj.durationFast;

			// Compute the new tree layout.
			var nodes = tree.nodes(root).reverse();

			var maxDepth = 0;
			var max_depth = nodes.forEach(function(d) {
				if (d.depth > maxDepth) maxDepth = d.depth
			});


			// Normalize for fixed-depth.
			nodes.forEach(function(d) {
				d.y = d.depth * obj.nodeDepth
			});

			// Update the nodes…
			var node = vis.selectAll('g.node')
				.data(nodes, function(d) {
					return d.id || (d.id = ++i);
				});

			// Enter any new nodes at the parent's previous position.
			var nodeEnter = node.enter().append('svg:g')
				.attr('class', function(d) {
					return d.children || d._children ? 'node left' : 'node right';
				})
				.attr('id', function(d) {
					return 'node_' + d.id;
				})
				.attr('transform', function(d) {
					return 'translate(' + source.y0 + ',' + source.x0 + ')';
				})
				.on('click', obj.onNodeClick);

			nodeEnter.append('svg:circle')
				.attr('r', 1e-6)
				.attr('class', function(d) {
					return d._children ? 'children' : 'expanded';
				});

			nodeEnter.append('svg:text')
				.attr({
					class: function(d) {
						return d.children || d._children ? 'label left' : 'label right';
					},
					x: function(d) {
						return d.children || d._children ? -10 : 10;
					},
					dy: '.35em',
					'text-anchor': function(d) {
						return d.children || d._children ? 'end' : 'start';
					}
				})
				.text(function(d) {
					return d.name;
				})
				.style('fill-opacity', 1e-6);

			// Transition nodes to their new position.
			var nodeUpdate = node.transition()
				.duration(duration)
				.attr('transform', function(d) {
					return 'translate(' + d.y + ',' + d.x + ')';
				});

			nodeUpdate.select('circle')
				.attr('r', obj.nodeSize)
				.attr('class', function(d) {
					return d._children ? 'children' : 'expanded';
				});

			nodeUpdate.select('text')
				.style('fill-opacity', 1);

			// Transition exiting nodes to the parent's new position.
			var nodeExit = node.exit().transition()
				.duration(duration)
				.attr('transform', function(d) {
					return 'translate(' + source.y + ',' + source.x + ')';
				})
				.remove();

			nodeExit.select('circle')
				.attr('r', 1e-6);

			nodeExit.select('text')
				.style('fill-opacity', 1e-6);

			// Update the links…
			var link = vis.selectAll('path.link')
				.data(tree.links(nodes), function(d) {
					return d.target.id;
				});

			// Enter any new links at the parent's previous position.
			link.enter().insert('svg:path', 'g')
				.attr('class', 'link')
				.attr('d', function(d) {
					var o = {
						x: source.x0,
						y: source.y0
					};
					return diagonal({
						source: o,
						target: o
					});
				})
				.transition()
				.duration(duration)
				.attr('d', diagonal);

			// Transition links to their new position.
			link.transition()
				.duration(duration)
				.attr('d', diagonal);

			// Transition exiting nodes to the parent's new position.
			link.exit().transition()
				.duration(duration)
				.attr('d', function(d) {
					var o = {
						x: source.x,
						y: source.y
					};
					return diagonal({
						source: o,
						target: o
					});
				})
				.remove();

			// Stash the old positions for transition.
			nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});
		},

		onNodeClick: function(d) {
			Tree.setCurrentNode(d);
		},

		toggleAll: function(d) {
			if (d.children) {
				d.children.forEach(Tree.toggleAll);
				Tree.toggle(d);
			}
		},

		toggle: function(d) { // Toggle children.
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}

		},

		collapseAll: function() {
			Tree.collapseOrExpand(root, 'collapse');
			Hint.hide(false);
		},

		expandAll: function() {
			Tree.collapseOrExpand(root, 'expand');
			Hint.hide(true);
		},

		collapseOrExpand: function(node, choice) {

			// visible objects are put in the array 'children', invisible ones in _children  > this function took me 2 hourse or more
			var option = (choice == 'expand' ? 'children' : '_children');

			if (!node[option]) {
				Tree.toggle(node);
				Tree.update(node);
			}

			if (node[option]) {

				for (var i in node[option]) {
					Tree.collapseOrExpand(node[option][i], choice);
				}
			}
		},

		traverse: function(node, direction) {

			// this function could be made more extensive so it 'hops' to childs of other parents
			switch (direction) {

				case Nodes.traverseLeft:
					if (node.parent) {
						Tree.setCurrentNode(node.parent);
					}
					break;

				case Nodes.traverseRigth:
					if (node.children) {
						Tree.setCurrentNode(node.children[0], true);
					} else if (node._children) {
						Tree.setCurrentNode(node, true);
					}
					break;

				case Nodes.traverseDown:

					nodePos = Nodes.findNodePos(node) + 1;

					if (node.parent.children[nodePos]) {
						Tree.setCurrentNode(node.parent.children[nodePos], true);
					}

					break;

				case Nodes.traverseUp:

					nodePos = Nodes.findNodePos(node) - 1;

					if (node.parent.children[nodePos]) {
						Tree.setCurrentNode(node.parent.children[nodePos], true);
					}

					break;

				case Nodes.pressedEnter:

					break;


				default:
					break;
			}

		},

		setCurrentNode: function(d, right) {
			Tree.selectedNode = d;

			d3.select('.selected').classed('selected', false);

			d3.select('#node_' + d.id)
				.classed('selected', true);

			if (d.children && right) {} else {
				Tree.toggle(d);
				Tree.update(d);
			}

			InfoWindow.check(d)

			if (root._children) {
				Hint.hide(false);
			} else {
				Hint.hide(true);
			}

		}
	}

	var Hint = {
		stateVisible: true,

		hide: function(state) {
			if (state === Hint.stateVisible) return;
			Hint.stateVisible = state;

			var hint = d3.select('.hint');

			if (state) {
				Lib.fadeOut(hint[0][0], 50, Hint.onFadeOutFinished);
			} else {
				Lib.fadeIn(hint[0][0], 50, Hint.onFadeInFinished);
			}
		}
	}


	var InfoWindow = {
		default: [],
		infoDescription: 'info-description',
		subcontent: 'placeholder-container',

		check: function(d) {
			InfoWindow.setInnerHtml('info-title', d.title);

			var subContent = Lib.getElId(InfoWindow.subcontent);
			InfoWindow.save();
			InfoWindow.clean(subContent);

			if (d.html) {
				InfoWindow.insertType(d.html);
			}


		},

		update: function(d) {
			var obj = InfoWindow;

			InfoWindow.setInnerHtml(obj.infoDescription, d.description);
		},

		setInnerHtml: function(id, s, fn) {
			var el = Lib.getElId(id);
			if (el && s !== undefined) {

				InfoWindow.clean(el);

				if (fn && (typeof fn == 'function')) {
					fn(id, s);
				}
				if (typeof(s) === 'object') {
					el.appendChild(s);
					Lib.getElId('current-input').focus();
				} else {
					el.innerHTML = s;
				}
			}
		},

		insertType: function(obj) {
			var el;

			switch (obj.element) {

				case 'input':
					el = Template.input(obj);
					break;
				case 'currentTime':
					el = Template.timePicker(obj);

				default:
					break;
			}

			InfoWindow.setInnerHtml(InfoWindow.subcontent, el);

		},

		save: function() {
			var input = Lib.getElId('current-input');

			if (input) {
				var name = input.name;
				saveObject[name] = input.value;

				Summary.update();
			}
		},

		clean: function(el) {

			el.innerHTML = '';
		},

		destroy: function(id) {

			id = Lib.getElId(id);

			while (id.hasChildNodes()) {
				id.removeChild(id.lastChild);
			}
		},

		setUrl: function(id, s) {
			id = Lib.getElId(id);

			var a = Lib.getUrlElement(s, "more information")
			id.appendChild(a);
		},

		setDefaultObject: function(d) {
			InfoWindow.default = d;
		},

		setFallback: function() {
			var obj = InfoWindow;

			obj.setInnerHtml(obj.infoDescription, obj.fallbackText);
		}
	}

	var Template = {

		input: function(obj) {
			var input = document.createElement('input');
			input.setAttribute('id', 'current-input')
			input.setAttribute('type', obj.type);
			input.setAttribute('name', obj.name);
			input.setAttribute('class', 'default-input');
			input.setAttribute('placeholder', obj.placeholder);

			return input;
		},

		checkboxes: function() {

		},

		timePicker: function(obj) {

			var d = new Date(),
				hours = String(d.getHours()),
				minutes = String(d.getMinutes()).length === 1 ? '0' + d.getMinutes() : d.getMinutes(),
				seconds = String(d.getSeconds()).length === 1 ? '0' + d.getSeconds() : d.getSeconds();

			var time = hours + ':' + minutes + ':' + seconds;

			var container = document.createElement('div');

			var timeInput = document.createElement('input');
			timeInput.setAttribute('id', 'current-input')
			timeInput.setAttribute('type', 'text');
			timeInput.setAttribute('name', obj.name);
			timeInput.setAttribute('value', time);
			timeInput.setAttribute('class', 'time-input');

			var dateInput = document.createElement('input');
			dateInput.setAttribute('type', 'text');
			dateInput.setAttribute('value', '10-20-2014');
			dateInput.setAttribute('class', 'time-input');

			container.appendChild(timeInput);
			container.appendChild(dateInput);

			return container;
		}
	}

	var Summary = {

		element: 'info-description',

		update: function() {

			var s = '';
			s += Summary.formatText('Incident ', 'incident');
			s += Summary.formatText('Lokatie', 'lokatie');

			Lib.getElId(Summary.element).innerHTML = s;
		},

		formatText: function(title, value) {
			var str = '<div class="summary-line">',
				input = saveObject[value] ? saveObject[value] : 'nog niet gezet';

			str += '<h3 class="summary">' + title + '</h3>';
			str += '<span class="value">' + input + '</span>';
			str += '</div>';
			return str;
		}

	}

	var Nodes = {
		traverseLeft: 'left',
		traverseRigth: 'right',
		traverseUp: 'up',
		traverseDown: 'down',

		pressedEnter: 'enter',

		init: function() {},

		traverse: function(direction) {
			Tree.traverse(Tree.selectedNode, direction);

		},

		findNodePos: function(node) {
			var parent = node.parent;

			for (var i in parent.children) {
				if (parent.children[i].name == node.name) {
					return Number(i);
				}
			}

		}
	}

	d3.select('body')
		.on('keydown', function() {

			switch (d3.event.keyCode) {

				case 13:
					Nodes.traverse(Nodes.pressedEnter);
					break;
				case 37:
					Nodes.traverse(Nodes.traverseLeft);
					break;
				case 38:
					Nodes.traverse(Nodes.traverseUp);
					break;
				case 39:
					Nodes.traverse(Nodes.traverseRigth);
					break;
				case 40:
					Nodes.traverse(Nodes.traverseDown);
					break;

				default: //console.log ( d3.event.keyCode );
					break;
			}
		})


	var Lib = {

		destroy: function(id) {
			var el = document.getElementById(id);
			el.parentNode.removeChild(el);
		},

		destroyChildren: function(id) { // A Medea function

			id = Lib.getElId(id);

			while (id.hasChildNodes()) {
				id.removeChild(id.lastChild);
			}
		},

		getElId: function(id) {
			return document.getElementById(id);
		},

		getUrlElement: function(href, text, target) {
			var a = document.createElement('a');
			a.href = href; // Insted of calling setAttribute
			a.innerHTML = text || href;
			a.target = target || '_blank';
			return a;
		},

		openUrlNewWindow: function(url) {
			var win = window.open(url, '_blank');
			win.focus();
		},

		fadeIn: function(element, duration, fn) {
			var obj = element;
			obj.style.display = '';
			var op = 0;

			var timer = setInterval(function() {
				if (op >= 1 || op >= 1.0) {
					clearInterval(timer);

					if (Lib.isFunction(fn)) {
						fn();
					}
				}

				obj.style.opacity = op.toFixed(1);
				op += 0.1;

			}, duration);
			return this;
		},

		fadeOut: function(element, duration, fn) {
			var obj = element;
			var op = 1;

			var timer = setInterval(function() {

				if (op <= 0) {
					clearInterval(timer);
					obj.style.display = 'none';

					if (Lib.isFunction(fn)) {
						fn();
					}
				}

				obj.style.opacity = op.toFixed(1);
				op -= 0.1;

			}, duration);
			return this;
		},

		isFunction: function(obj) {
			return !!(obj && obj.constructor && obj.call && obj.apply);
		}
	}

	var saveObject = {};

	Tree.init();
	Nodes.init();
}

export default TreeChart;