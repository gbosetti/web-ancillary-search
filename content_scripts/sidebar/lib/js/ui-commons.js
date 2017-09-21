function UI(){

	this.initialize = function() { //Do not call this methid from the constructor --> Loading error.

		this.loadValidationBehaviour();
		this.loadNavigationTriggers();
		this.loadSubformBehaviour();
	};
	this.loadValidationBehaviour = function() {

		$('form').validate({    
		    "rules": this.getValidationRules()
		});
	};
	this.loadNavigationTriggers = function() {
		console.log("loading prev btn", this.loadPrevNavigationButton);
		if(this.loadPrevNavigationButton) this.loadPrevNavigationButton();
		console.log("loading next btn", this.loadNextNavigationButton);
		if(this.loadNextNavigationButton) this.loadNextNavigationButton();
	};
	this.loadSubformBehaviour = function() {};
};