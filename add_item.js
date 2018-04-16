/**
 * SpinalDrive_App_FileExplorer_addItem
 * @extends {SpinalDrive_App}
 */

class SpinalDrive_App_FileExplorer_addItem extends SpinalDrive_App  {
    /**
   * Creates an instance of SpinalDrive_App_FileExplorer_addItem.
   * @memberof SpinalDrive_App_FileExplorer_addItem
   */

    constructor() {
        super("AddItemExplorer","Visa..","edit","Add to a visa");  
    }

    /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_FileExplorer_addItem
   */

   

   action(obj) {
    let _self = this;
       
    let $mdDialog =  obj.scope.injector.get('$mdDialog');
    // let $scope =  obj.scope.injector.get('$scope');
    let $templateCache = obj.scope.injector.get('$templateCache');
    let visaManagerService = obj.scope.injector.get('visaManagerService');

    let mod = FileSystem._objects[obj.file._server_id];

    $mdDialog.show({

        controller : ["$scope","$mdDialog","visaManagerService",($scope,$mdDialog,visaManagerService) => {
            
/******************************************************************************** */

            $scope.getIdByPriority = function(themeId,priority) {

                for (var i = 0; i < $scope.groupProcess.length; i++) {
                    let myGroupProcess = $scope.groupProcess[i];
                    if(myGroupProcess.id == themeId) {
                        for (var j = 0; j < myGroupProcess.process.length; j++) {
                            let myProcess = myGroupProcess.process[j];
                            if(myProcess.priority == priority) {
                                return myProcess.id.get();
                            }
                        }
                    }
                }
            }

/*********************************************************************************** */


            $scope.groupProcess = visaManagerService.allProcess;
            $scope.visaSelected = {groupId : '0', processId : '0',priority : 0,oldPriority : 0};
            $scope.processes = [];

            $scope.disableButton = {precedent : true, next : true, add : true}


            $scope.SelectChanged = function() {

                for (var i = 0; i < $scope.groupProcess.length; i++) {
                    let process = $scope.groupProcess[i];
                    if(process.id == $scope.visaSelected.groupId) {
                        $scope.processes = process;
                        var exist = false;
                        if(mod._info.visaProcessPlugin) {
                            mod._info.visaProcessPlugin.load((data) => {

                                for (var j = 0; j < data.length; j++) {
                                    if(data[j].groupId.get() == $scope.visaSelected.groupId) {
                                        exist = true;
                                        $scope.visaSelected.priority = data[j].priority.get();

                                        if(data[j].priority.get() > 0) {
                                            $scope.disableButton.precedent = false;                        
                                        }
                                        
                                        if(data[j].priority.get() < $scope.processes.process.length - 1)  {
                                            $scope.disableButton.next = false;
                                        }
                                        break;
                                    }
                                } 
                                
                                if(!exist) {
                                    $scope.disableButton.next = true;
                                    $scope.disableButton.precedent = true;
                                    $scope.disableButton.add = false;
                                }
                                               
                            })
                        } else {
                            $scope.disableButton.next = true;
                            $scope.disableButton.precedent = true;
                            $scope.disableButton.add = false;
                        }
                        
                        break;
                    }

                }
            }

            $scope.hide = function() {
                $mdDialog.hide()
            }

            $scope.cancel = function() {
                $mdDialog.cancel()
            }

            $scope.add = function() {
                $scope.visaSelected.processId = $scope.getIdByPriority($scope.visaSelected.groupId,0);
                $mdDialog.hide({name : 'add', data : $scope.visaSelected});
            }

            $scope.next = function() {
                $scope.visaSelected.oldPriority = $scope.visaSelected.priority;
                $scope.visaSelected.priority += 1;
                $scope.visaSelected.processId = $scope.getIdByPriority($scope.visaSelected.groupId,$scope.visaSelected.priority);

                $mdDialog.hide({name : 'next',data : $scope.visaSelected})
            }

            $scope.precedent = function () {
                $scope.visaSelected.oldPriority = $scope.visaSelected.priority;
                $scope.visaSelected.priority -= 1;
                $scope.visaSelected.processId = $scope.getIdByPriority($scope.visaSelected.groupId,$scope.visaSelected.priority);

                $mdDialog.hide({name : 'precedent', data : $scope.visaSelected})
            }

            // $scope.answer = function() {
            //     if($scope.visaSelected.groupId != '0' && $scope.visaSelected.processId != '0') {
            //         $mdDialog.hide($scope.visaSelected);
            //     } else {
            //         $mdDialog.cancel();
            //     }
            // }


        }],
        template : $templateCache.get('addItemDialogTemplate.html'),
        parent : angular.element(document.body),
        targetEvent : obj.evt,
        clickOutsideToClose : false
      }).then((result) => {
          switch (result.name) {
                case 'add':
                  visaManagerService.addItem(obj.file._server_id,result.data.groupId,result.data.processId,result.data.priority);
                  break;
                case 'precedent':
                    visaManagerService.deleteItem(obj.file._server_id,result.data.groupId,result.data.processId,result.data.oldPriority);
                    visaManagerService.addItem(obj.file._server_id,result.data.groupId,result.data.processId,result.data.priority);
                    break;
                case 'next':
                    visaManagerService.deleteItem(obj.file._server_id,result.data.groupId,result.data.processId,result.data.oldPriority);
                    visaManagerService.addItem(obj.file._server_id,result.data.groupId,result.data.processId,result.data.priority);
                    break;
                  
          }
            // visaManagerService.deleteItem(obj.file._server_id,result.groupId,result.processId,result.oldPriority);
            
      },() => {
          console.log("error");
      })   
   }


    // dialogCtrl($scope,$mdDialog,visaManagerService) {
    //     $scope.groupProcess = visaManagerService.allProcess;
    //     $scope.visaSelected = {groupId : '0', processId : '0'};
    //     $scope.processes = [];

    //     $scope.isDisabled = true;

    //     $scope.SelectChanged = function() {
    //         $scope.isDisabled = false;
    //         $scope.visaSelected.processId = '0';
    //         for (var i = 0; i < $scope.groupProcess.length; i++) {
    //             let process = $scope.groupProcess[i];
    //             if(process.id == $scope.visaSelected.groupId) {
    //                 $scope.processes = process;
    //                 break;
    //             }

    //         }
    //     }


    //     $scope.hide = function() {
    //         $mdDialog.hide()
    //     }

    //     $scope.cancel = function() {
    //         $mdDialog.cancel()
    //     }

    //     $scope.answer = function() {
    //         if($scope.visaSelected.groupId != '0' && $scope.visaSelected.processId != '0') {
    //             $mdDialog.hide($scope.visaSelected);
    //         } else {
    //             $mdDialog.cancel();
    //         }
    //     }

    // }
   
}

module.exports.SpinalDrive_App_FileExplorer_addItem = SpinalDrive_App_FileExplorer_addItem;