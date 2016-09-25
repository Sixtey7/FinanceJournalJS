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

        
    }

])