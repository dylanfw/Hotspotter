(function (angular) {
    'use strict';
//===============================Frontend Dependencies================================================
    var app = angular.module('hotspotter', [
        'ngRoute',
        'ngResource',
        'AxelSoft',
        'nvd3',
        'ngLodash',
        'hotspotter.dashboardCtrl',
        'hotspotter.fileViewCtrl',
        'hotspotter.adminCtrl',
        'hotspotter.scoringCtrl'
    ]);
//==================================Route Provider==============================================================
// Definitions of what happens when urls are hit. This defines the controller and the html page it needs to render
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
        $routeProvider.when(
            '/', {
                templateUrl: 'dashboard/dashboard.html',
                pageName: 'Dashboard'
            });

        $routeProvider.when(
            '/fileView', {
                templateUrl: 'fileView/fileView.html',
                pageName: 'FileView'
            });

         $routeProvider.when(
            '/admin', {
                templateUrl: 'admin/admin.html',
                pageName: 'admin'
            });

        $routeProvider.when(
            '/scoring', {
                templateUrl: 'scoring/scoring.html',
                pageName: 'scoring',
                controller: 'scoringCtrl'
            });

        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
        
    }]);
}(window.angular));