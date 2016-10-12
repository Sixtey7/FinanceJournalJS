angular.module('accounts').controller('AccountsController', ['$scope', '$routeParams', '$location', '$mdDialog', '$mdToast',
'$mdMedia', '$log', 'Accounts',

    function($scope, $routeParams, $location, $mdDialog, $mdToast, $mdMedia, $log, Accounts) {
        //TODO: Long Term I really shouldn't keep copying this array everywhere
        var MONTH_NAMES = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
            ];
        
        /**
         * CREATE
         */
        $scope.create = function() {
            $mdDialog.hide();

            var account = new Accounts({
                name : this.name,
                dateCreated : this.dateCreated,
                notes : this.notes
            });

            account.$save(function(response) {
                $log.debug('Successfully Created!');

                //change the date to a date object
                response.date = new Date(response.date);

                //TODO: Put the call to the massage service here

                showToast('Account Successfully Created!');
            }, function(errorResponse) {
                $log.error('Failed on Account Creation!');
                $scope.error = errorResponse.data.message;
            });
        };


        /**
         * READ
         */
        //TODO: Evenually we should remove this and move to events
            //(todo copied from entries.client.controller.js)
        function success(newAccounts) {
            $log.debug('Success Called!');

            if ($scope.accounts) {
                $scope.accounts.splice(0, $scope.accounts.length);
                $scope.accounts.push.apply($scope.accounts, newAccounts);
            }
            else {
                $log.debug('Creating the accounts object');
                $scope.filterDate = {}; //TODO: Not actually using this yet, but it probably a good thing to do {
                $scope.accounts = newAccounts;
            }
        };

        $scope.find = function() {
            $scope.promise = Accounts.query($scope.query, success).$promise;
        };

        $scope.findOne = function() {
            $scope.account = Accounts.get({
                accountId : $routeParams.accountId
            });
        };

        /**
         * UPDATE
         */
        $scope.update = function() {
            $scope.account.$update(function() {
                $location.path('accounts/' + $scope.account._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        /**
         * DELETE
         */
        $scope.delete = function(accountToRemove) {
            if (accountToRemove) {
                accountToRemove.remove(function() {
                    for (var i in $scope.accounts) {
                        if (scope.accounts[i] === accountToRemove) {
                            $log.debug('Found a matching account to remove!');
                            $scope.accounts.splice(i, 1);
                        }
                    }
                });
            }
            else {
                $scope.account.$remove(function() {
                    $location.path('accounts');
                });
            }
        };
    }

])