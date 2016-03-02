(function (angular) {
    'use strict';
    var ngModule = angular.module('hotspotter.fileViewCtrl', ['AxelSoft','nvd3']);
    ngModule.controller('fileViewCtrl', function ($scope, $http) {

        //"Global Variables"
        var vm = this;
        vm.files = false;
        vm.database = true;
        vm.graph = false;
        vm.repos = [];
        vm.loading = false;
        vm.index = 0;
        vm.file = {};
        vm.graph_options = {};
        vm.graph_data = {};

        //"Global Functions"
        vm.viewRepository = viewRepository;
        vm.listRepos = listRepos;
        vm.clearView = clearView;
        vm.fileGraph = fileGraph;
        vm.init =  init;

        //Initialisation;
        init();

        //Anything that needs to be instantiated on page load goes in the init
        function init() {
            listRepos();
        }

        //This function takes care of finding the repository and bringing back its filetree and scores
        function viewRepository(repoURL) {
            // list of file paths

            vm.database = false;
            vm.loading = true;
            vm.selectedFile = false;

            $http.get('/api/repo/' + encodeURIComponent(repoURL)).then(function (response){

                // Example structure
                /*$scope.structure = { folders: [
                 { name: 'Folder 1', files: [{ name: 'File 1.jpg' }, { name: 'File 2.png' }],
                 folders: [{ name: 'Subfolder 1', files: [{ name: 'Subfile 1' }] },
                 { name: 'Subfolder 2' },{ name: 'Subfolder 3' }
                 ]},{ name: 'Folder 2', files: [], folders: [] }
                 ]};*/

                vm.index = response.data.files[0].score.length - 1;
                $scope.structure = response.data;

                console.log(vm.index);

                $scope.options = {

                    onFileSelect: function(file, breadcrums) {
                        $scope.breadcrums = breadcrums;
                        vm.selectedFile = file;
                    }
                };
                vm.files = true;
                vm.loading = false;
            });

        }
        function listRepos() {
            $http.get('/api/repo').then( function (response){
                vm.repos = response.data;

            });
        }

        function clearView(){
            vm.database = true;
            vm.graph = false;
            vm.graph_options = {};
            vm.graph_data = {};
            $scope.structure = [];

        }

        function fileGraph(data) {
            vm.graph = true;

            var repo_start;
            if (data.score.length > 1) repo_start = data.score[0].Time - (data.score[1].Time - data.score[0].Time); //first commit
            else repo_start = data.commits[data.commits.length-1].TimeMs; //first commit on file
            console.log(repo_start);

            vm.graph_options = {
            chart: {
                type: 'multiChart',
                height: 400,
                margin : {
                    top: 20,
                    right: 65,
                    bottom: 75,
                    left: 65
                },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                lines1 : {
                    x : function (d) { return d.x; },
                    y : function (d) { return d.y; },
                    forceY: [0,1],
                    forceX: [repo_start]
                },

                xAxis: {
                    axisLabel: 'Time',
                    tickFormat: function(d){
                        return d3.time.format('%x')(new Date(d));
                    },
                    rotateLabels: 30
                },
                yAxis1: {
                    axisLabel: 'Score',
                    tickFormat: function(d){
                        return d3.format('.2f')(d);
                    }
                },
                duration : 0,
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: data.name + ' lifetime'
            },
            subtitle: {
                enable: true,
                text: 'subtitle',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> caption',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }

            };

            console.log(data);

            var points = [];
            var commits = [];
            var bcommits = [];

            for (var i = 0; i < data.score.length; i++) {
                points.push({x: data.score[i].Time, y: 1-data.score[i].Score});
            }
            for (var j = 0; j < data.commits.length; j++) {
                if (data.commits[j].BugFix)
                    bcommits.push({x: data.commits[j].TimeMs, y: 1});
                else
                    commits.push({x: data.commits[j].TimeMs, y: 1});
            }
            var graph = [];
            if (points.length > 0) {
                graph.push({
                    yAxis : 1,
                    type : 'line',
                    values : points,
                    key : data.name,
                    color : "green"
                });
            }
            if (commits.length > 0) {
                graph.push({
                    yAxis : 1,
                    type : 'line',
                    values : commits,
                    key : 'Commits',
                    color : "blue"
                });
            }
            if (bcommits.length > 0) {
                graph.push({
                    yAxis : 1,
                    type : 'line',
                    values : bcommits,
                    key : 'Fix Commits',
                    color : "red"
                });
            }
            vm.graph_data = graph;

        }

    });
}(window.angular));
