'use strict';

/**
 * Main AngularJS Web Application
 */
var app = angular.module('bankApp', [
  'ngRoute',
  'ngTable'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "views/home.html", controller: "HomeCtrl"})
    // Pages
    .when("/transactions/:accountNumber", {templateUrl: "views/transactions.html", controller: "TransCtrl"})
    // Transaction
    .when("/transfer", {templateUrl: "views/transfer.html", controller: "TransferCtrl"})
    // Deposit
    .when("/deposit", {templateUrl: "views/deposit.html", controller: "DepositCtrl"})
    // Withdraw
    .when("/withdraw", {templateUrl: "views/withdraw.html", controller: "WithdrawCtrl"})
    // Account operation
    .when("/randOperation", {templateUrl: "views/randOperation.html", controller: "RandOperationCtrl"})
    // 404
    .when("/404", {templateUrl: "views/404.html", controller: "NotFoundCtrl"})
    // else redirect to 404
    .otherwise({redirectTo:'/404'})
  //other settings
  //$locationProvider.html5Mode(false);
	$locationProvider.hashPrefix('');
}]);

app.controller('HomeCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  console.log("HomeCtrl started");
  
  $scope.searchAccount = function(){
    console.log("searching accountNumber: "+$scope.accountNumber);

  	$http.get('http://localhost:8080/rest-api/api/controller/getAccountInfo/'+$scope.accountNumber).then(function(response){
  		console.log('found balance:', response.data);
  		$scope.balanceData = response.data;
  	});
  };

  $scope.goToTransactions = function(){
  	console.log("go to transactions for accountNumber: "+$scope.accountNumber);
  	$location.path('transactions/'+$scope.accountNumber);
  }

}]);

app.controller('TransCtrl', ['$scope', '$http', '$location', '$routeParams', 'NgTableParams', function ($scope, $http, $location, $routeParams, NgTableParams) {
  console.log("TransCtrl started");
  $scope.accountNumber = $routeParams.accountNumber;
  	console.log("searching transactions for accountNumber: "+$scope.accountNumber);

  	$http.get('http://localhost:8080/rest-api/api/controller/transactionsForAccount/'+$scope.accountNumber).then(function(response){
  		console.log('found transactions:', response.data);
  		$scope.tableParams = new NgTableParams({}, { dataset: response.data});
  	});

}]);

app.controller('TransferCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.transferOperation = function() {
    console.log("performing a transaction operation...");
    console.log($scope.transferRequestDTO);
    $http.post("http://localhost:8080/rest-api/api/controller/transferOperation", $scope.transferRequestDTO).then(function(response){
      console.log("transaction successful");
      $location.path('/');
    });
  }
}]);

app.controller('DepositCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.depositOperation = function() {
    console.log("performing a deposit operation...");
    $http.post("http://localhost:8080/rest-api/api/controller/depositOperation", $scope.depositDTO).then(function(response){
      console.log("deposit operation successful");
      $location.path('transactions/' + $scope.depositDTO.toAccount);
    });
  }
}])

app.controller('WithdrawCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.withdrawalOperation = function() {
    console.log("performing a Withdraw operation...");
    $http.post("http://localhost:8080/rest-api/api/controller/withdrawalOperation", $scope.withdrawDTO).then(function(response){
      console.log("withdraw operation successful");
      $location.path('transactions/' + $scope.withdrawDTO.fromAccount);
    });
  }
}])

app.controller('RandOperationCtrl', ['$scope', '$http', 'NgTableParams', function ($scope, $http, NgTableParams) {
  $scope.showTable = false;
  $scope.randOperation =function() {
    console.log("performing a rand operation....");
    $http.post("http://localhost:8080/rest-api/api/controller/transactionInfo", $scope.randDTO).then(function(response) {
      console.log("rand operation successful");
      $scope.showTable = true;
      $scope.tableParams = new NgTableParams({}, { dataset: response.data});
    });
  }
}])



app.controller('NotFoundCtrl', function (/* $scope, $location, $http */) {
  console.log("NotFoundCtrl started");
});