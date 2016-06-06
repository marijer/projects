var Tooltip = {
	templateUrl: 'common/tooltip/tooltip.template.html',
	bindings: {
		content: '<',
		tooltipXPos: '<',
		tooltipYPos: '<'
	},
	transclude: true,
	controller: function() {
		var model = this;

		function setPos() {
			model.myStyle = {top: model.tooltipYPos + 'px', 
							left: model.tooltipXPos + 'px'};
		}

		this.$onChanges = function(value) {
			setPos();
		}
	}
};

export default Tooltip;