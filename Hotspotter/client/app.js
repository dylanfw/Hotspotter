(function (angular) {
    'use strict';
//===============================Frontend Dependencies================================================
    var app = angular.module('hotspotter', [
        'ngRoute',
        'ngResource',
        'hotspotter.dashboardCtrl'
    ]);
//==================================Route Provider==============================================================
// Definitions of what happens when urls are hit. This defines the controller and the html page it needs to render
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
        $routeProvider.when(
            '/', {
                templateUrl: 'dashboard/dashboard.html',
                pageName: 'Dashboard',
                controller: 'dashboardCtrl'
            });
        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);

    }]);
}(window.angular));