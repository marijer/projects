describe('the overview list component', function() {
	beforeEach(module('d3Assignments'));

	var itemsList;

	beforeEach(inject(function ($componentController){
		itemsList = $componentController('overviewList', {
			$scope: {}
		}) 
	}));

	it('should be created', function() {
		expect(itemsList).toBeDefined();
		expect(itemsList.$onInit).toBeDefined();
	});

});