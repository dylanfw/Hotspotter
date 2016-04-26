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
        'hotspotter.repositoryCtrl',
        'hotspotter.dataCtrl'
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
            '/files', {
               templateUrl: 'fileView/fileView.html',
                pageName: 'Files'
            });

        $routeProvider.when(
            '/repository', {
                templateUrl: 'repository/repository.html',
                pageName: 'repository'
            });

        $routeProvider.when(
            '/admin', {
                templateUrl: 'admin/admin.html',
                pageName: 'Admin'
            });

        $routeProvider.when(
            '/data', {
                templateUrl: 'data/data.html',
                pageName: 'data',
                controller: 'dataCtrl'
            });

        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
        
    }]);
}(window.angular));