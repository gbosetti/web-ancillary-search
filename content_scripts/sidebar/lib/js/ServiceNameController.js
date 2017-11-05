serviceCreator.controller('ServiceNameController', function($scope, $state) {

    AbstractController.call(this, $scope, $state);
    $scope.loadValidationRules = function() {
      $('form').validate({  "rules": {
          "search_service_name": {
              "minlength": 2,
              "required": true
          }
      }});
    }
    $scope.loadNextNavigationButton = function() {

      if($("form").valid($state)){
        $state.go('ServiceInput')
      }
    };
    $scope.callPlaceholderNameAdaptation = function() {
      //The only way I ound to communicate the iframe content to the outside
      browser.runtime.sendMessage({
        call: "adaptPlaceholder",
        args: { scoped: "#search_service_name", callback: 'adaptPlaceholderExample' }
      });
    };
    $scope.adaptPlaceholderExample = function(data) {
      document.querySelector("#search_service_name").setAttribute(
        "placeholder", 
        browser.i18n.getMessage("example_acronym") + " " + data.domainName
      );
      $scope.focusElement("#search_service_name");
    };
    $scope.callPlaceholderNameAdaptation();
    $scope.loadValidationRules();
    $scope.localize();
});