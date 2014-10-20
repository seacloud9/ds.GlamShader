angular.module('templates-app', ['home/home.tpl.html', 'play/play.tpl.html']);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "<div style=\"width:100%; float:left\">\n" +
    "</div>\n" +
    "<div class=\"soundscape\" style=\"display:none\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-4\" data-ng-repeat=\"x in tracks\">\n" +
    "      <div data-id={{x.id}} style=\"display:block; float: left; width: 700px; background-color:#fff;height: 140px;\" class='soundCloudCard' ng-click=goVisualize(x.id) >\n" +
    "      <div style=\"width:100%; float:left\">\n" +
    "        <div style=\"width:20%; float:left;\">\n" +
    "          <img src={{x.user.avatar_url}} style=\"width:100%; float:left\"/>\n" +
    "        </div>\n" +
    "        <div style=\"width:80%; float:left;\">\n" +
    "          <h4><i></i> {{x.title}}</h4>\n" +
    "           <img src= {{x.waveform_url}} style=\"width:100%; float:left\"/>         \n" +
    "       </div>\n" +
    "      </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("play/play.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("play/play.tpl.html",
    "<div class=\"row\">\n" +
    "  <div id=\"glamProcessing\" width=\"512\" height=\"512\" style=\"display:none\"></div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
