App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    itemState: null,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",
    roleAddress: "0x0000000000000000000000000000000000000000",
    selectRole: 0,
    roleRenounceAddress: "0x0000000000000000000000000000000000000000",
    selectRenounceRole: 0,
    connectedAddress: "0x0000000000000000000000000000000000000000",
    connectedAddressRoles: null,


    init: async function () {
        console.log(`init function`);
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        console.log(`readForm function`);
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.itemState = $("#itemState").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();
        App.roleAddress = $("#roleAddress").val();
        App.selectRole = $("#selectRole").val();
        App.roleRenounceAddress = $("#roleRenounceAddress").val();
        App.selectRenounceRole = $("#selectRenounceRole").val();
        App.connectedAddress = $("#connectedAddress").val();
        App.connectedAddressRoles = $("#connectedAddressRoles").val();

        console.log(`   EXECUTION OF readForm     `);
        console.log(`#sku: ${App.sku}`);
        console.log(`#upc: ${App.upc}`);
        console.log(`#ownerID: ${App.ownerID}`);
        console.log(`#originFarmerID: ${App.originFarmerID}`);
        console.log(`#originFarmName: ${App.originFarmName}`);
        console.log(`#originFarmInformation: ${App.originFarmInformation}`);
        console.log(`originFarmLatitude: ${App.originFarmLatitude}`);
        console.log(`#originFarmLongitude: ${App.originFarmLongitude}`);
        console.log(`#productNotes: ${App.productNotes}`);
        console.log(`#productPrice: ${App.productPrice}`);
        console.log(`#itemState: ${App.itemState}`);
        console.log(`#distributorID: ${App.distributorID}`);
        console.log(`#retailerID: ${App.retailerID}`);  
        console.log(`#consumerID: ${App.consumerID}`);
        console.log(`#roleAddress: ${App.roleAddress}`);
        console.log(`#selectRole: ${App.selectRole}`);
        console.log(`#roleRenounceAddress: ${App.roleRenounceAddress}`);
        console.log(`#selectRenounceRole: ${App.selectRenounceRole}`);
        console.log(`#connectedAddress: ${App.connectedAddress}`);
        console.log(`#connectedAddressRoles: ${App.connectedAddressRoles}`);
        console.log(`------------------------------`);
    },

    initWeb3: async function () {
        console.log(`initWeb3 function`);
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache (Ganache-cli: default port 8545)
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        console.log(`getMetaskAccountID function`);
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];
            
            // Users can only renounce to their own roles
            App.roleRenounceAddress = App.metamaskAccountID;
            $("#roleRenounceAddress").val(App.roleRenounceAddress);
            
            // Information about the currently connected address and its roles
            App.connectedAddress = App.metamaskAccountID;
            $("#connectedAddress").text(App.connectedAddress);
            App.refreshAddress();
            
            // Information about the default actor IDs
            App.sku = $("#sku").val();
            App.itemState = $("#itemState").val();
            if (App.itemState === "Product has not entered the supply chain yet") {
                App.originFarmerID = App.metamaskAccountID;
                $("#originFarmerID").val(App.originFarmerID);
            }
            if (App.itemState === "ForSale") {
                App.distributorID = App.metamaskAccountID;
                $("#distributorID").val(App.distributorID);
            } 
            if (App.itemState === "Shipped") {
                App.retailerID = App.metamaskAccountID;
                $("#retailerID").val(App.retailerID);
            }
            if (App.itemState === "Received") {
                App.consumerID = App.metamaskAccountID;
                $("#consumerID").val(App.consumerID);
            }
        })
    },

    initSupplyChain: function () {
        console.log(`initSupplyChain function`);
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchEvents();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        console.log(`bindEvents function`);
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        console.log(`handleButtonClick function`);
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                await App.fetchItemBufferOne(event);
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                return await App.roleAddition(event);
                break;
            case 12:
                return await App.roleRemoval(event);
                break;
            case 13:
                break;
        }
    },

    // harvestItem function: this function allows a farmer to mark an item as 'Harvested'
    harvestItem: function(event) {
        console.log(`harvestItem function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        // Input parameters to the harvestItem function
        App.upc = $('#upc').val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.harvestItem(
                App.upc, 
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    // processItem function: this function allows a farmer to mark an item as 'Processed'
    processItem: function (event) {
        console.log(`processItem function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        
        // Input parameters to the processItem function
        App.upc = $('#upc').val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.upc);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    // packItem function: this function allows a farmer to mark an item as 'Packed'
    packItem: function (event) {
        console.log(`packItem function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        // Input parameters to the packItem function
        App.upc = $('#upc').val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(App.upc);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    // sellItem function: this function allows a farmer to mark an item as 'ForSale'
    sellItem: function (event) {
        console.log(`sellItem function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        // Input parameters to the sellItem function
        App.upc = $('#upc').val();
        App.productPrice = $("#productPrice").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei($("#productPrice").val(), "gwei");
            return instance.sellItem(App.upc, productPrice);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
        }).catch(function(err) {
            console.log(err.message);
        }); 
    },

    // buyItem function: this function allows a distributor to mark an item as 'Sold'
    buyItem: function (event) {
        console.log(`buyItem function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        // Input parameters to the buyItem function
        App.upc = $('#upc').val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei($("#productPrice").val(), "gwei");
            return instance.buyItem(App.upc, {value: productPrice});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    // shipItem function: this function allows a distributor to mark an item as 'Shipped'
    shipItem: function (event) {
        console.log(`shipItem function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        // Input parameters to the shipItem function
        App.upc = $('#upc').val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    // receiveItem function: this function allows a retailer to mark an item as 'Received'
    receiveItem: function (event) {
        console.log(`receiveItem function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        // Input parameters to the receiveItem function
        App.upc = $('#upc').val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    // purchaseItem function: this function allows a consumer to mark an item as 'Purchased'
    purchaseItem: function (event) {
        console.log(`purchaseItem function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        // Input parameters to the purchaseItem function
        App.upc = $('#upc').val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItem(App.upc);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    // fetchItemBufferOne function: this function fetches the first half of the item's data
    fetchItemBufferOne: function () {
        console.log(`fetchItemBufferOne function`);

        App.upc = $('#upc').val();
        console.log('Input parameter - upc',App.upc);

        // Initialize fields on user interface
        $("#sku").val(0);
        $("#upc").val(App.upc);
        $("#ownerID").val("0x0000000000000000000000000000000000000000");
        $("#originFarmerID").val("0x0000000000000000000000000000000000000000");
        $("#originFarmName").val(null);
        $("#originFarmInformation").val(null);
        $("#originFarmLatitude").val(null);
        $("#originFarmLongitude").val(null);
        // There is one fetch button only to fetch data, and that includes fetchItemBufferOne and Two
        $("#productNotes").val(null);
        $("#productPrice").val(0);
        $("#itemState").val(null);
        $("#distributorID").val("0x0000000000000000000000000000000000000000");
        $("#retailerID").val("0x0000000000000000000000000000000000000000");
        $("#consumerID").val("0x0000000000000000000000000000000000000000");

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne.call(App.upc);
        }).then(function(result) {
        // Storage of results of fetchItemBufferOne into user interface and App variables
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
          console.log('fetchItemBufferOne sku', result[0].c[0]);
          console.log('fetchItemBufferOne upc', result[1].c[0]);
          console.log('fetchItemBufferOne ownerID', result[2]);
          console.log('fetchItemBufferOne originFarmerID', result[3]);
          console.log('fetchItemBufferOne originFarmName', result[4]);
          console.log('fetchItemBufferOne originFarmInformation', result[5]);
          console.log('fetchItemBufferOne originFarmLatitude', result[6]);
          console.log('fetchItemBufferOne originFarmLongitude', result[7]);
          $("#sku").val(result[0].c[0]);
          App.sku = $("#sku").val();
          $("#upc").val(App.upc);
          App.upc = $("#upc").val();
          $("#ownerID").val(result[2]);
          App.ownerID = $("#ownerID").val();
          $("#originFarmerID").val(result[3]);
          App.originFarmerID = $("#originFarmerID").val();
          $("#originFarmName").val(result[4]);
          App.originFarmName = $("#originFarmName").val();
          $("#originFarmInformation").val(result[5]);
          App.originFarmInformation = $("#originFarmInformation").val();
          $("#originFarmLatitude").val(result[6]);
          App.originFarmLatitude = $("#originFarmLatitude").val();
          $("#originFarmLongitude").val(result[7]);
          App.originFarmLongitude = $("#originFarmLongitude").val();
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    // fetchItemBufferTwo function: this function fetches the second half of the item's data
    fetchItemBufferTwo: function () {
        console.log(`fetchItemBufferTwo function`);

        App.upc = $('#upc').val();
        console.log('Input parameter - upc',App.upc);            
        
        // Initialize fields on user interface
        $("#sku").val(0);
        $("#upc").val(App.upc);
        $("#productNotes").val(null);
        $("#productPrice").val(0);
        $("#itemState").val(null);
        $("#distributorID").val("0x0000000000000000000000000000000000000000");
        $("#retailerID").val("0x0000000000000000000000000000000000000000");
        $("#consumerID").val("0x0000000000000000000000000000000000000000");

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
        // Storage of results of fetchItemBufferOne into user interface and App variables
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
          console.log('fetchItemBufferTwo sku', result[0].c[0]);
          console.log('fetchItemBufferTwo upc', result[1].c[0]);
          console.log('fetchItemBufferTwo productID', result[2].c[0]);
          console.log('fetchItemBufferTwo productNotes', result[3]);
          console.log('fetchItemBufferTwo productPrice', web3.fromWei(result[4], "gwei"));
          console.log('fetchItemBufferTwo itemState', result[5].c[0]);
          console.log('fetchItemBufferTwo distributorID', result[6]);
          console.log('fetchItemBufferTwo retailerID', result[7]);
          console.log('fetchItemBufferTwo consumerID', result[8]);

          $("#sku").val(result[0].c[0]);
          App.sku = $("#sku").val();
          $("#upc").val(App.upc);
          App.upc = $("#upc").val();
          $("#productNotes").val(result[3]);
          App.productNotes = $("#productNotes").val();
          $("#productPrice").val(web3.fromWei(result[4], "gwei"));
          App.productPrice = $("#productPrice").val();

          if (result[5].c[0] === 0 && result[0].c[0] === 0) {
            $("#itemState").val(`Product has not entered the supply chain yet`);
          } else if (result[5].c[0] === 0) {
            $("#itemState").val(`Harvested`);
          } else if (result[5].c[0] === 1) {
            $("#itemState").val(`Processed`);
          } else if (result[5].c[0] === 2) {
            $("#itemState").val(`Packed`);
          } else if (result[5].c[0] === 3) {
            $("#itemState").val(`ForSale`);
          } else if (result[5].c[0] === 4) {
            $("#itemState").val(`Sold`);
          } else if (result[5].c[0] === 5) {
            $("#itemState").val(`Shipped`);
          } else if (result[5].c[0] === 6) {
            $("#itemState").val(`Received`);
          } else if (result[5].c[0] === 7) {
            $("#itemState").val(`Purchased`);
          };
          App.itemState = $("#itemState").val();

          if (result[5].c[0] === 0 && result[0].c[0] === 0) {
            App.originFarmerID = App.metamaskAccountID;
            $("#originFarmerID").val(App.originFarmerID);
          }
          if (result[5].c[0] === 3) {
            App.distributorID = App.metamaskAccountID;
            $("#distributorID").val(App.distributorID);
          } else {
            $("#distributorID").val(result[6]);
          }
          if (result[5].c[0] === 5) {
            App.retailerID = App.metamaskAccountID;
            $("#retailerID").val(App.retailerID);
          } else {
            $("#retailerID").val(result[7]);
          }
          if (result[5].c[0] === 6) {
            App.consumerID = App.metamaskAccountID;
            $("#consumerID").val(App.consumerID);
          } else {
            $("#consumerID").val(result[8]);
          }
          App.originFarmerID = $("#originFarmerID").val();
          App.distributorID = $("#distributorID").val();
          App.retailerID = $("#retailerID").val();
          App.consumerID = $("#consumerID").val();
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    // roleAddition: this function adds a role to an address as specified by the front-end user
    roleAddition: function (event) {
        console.log(`roleAddition function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.roleAddress = $("#roleAddress").val();
        App.selectRole = $("#selectRole").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            if (App.selectRole === "Farmer") {
                return instance.addFarmer(App.roleAddress);
            }
            if (App.selectRole === "Distributor") {
                return instance.addDistributor(App.roleAddress);
            }
            if (App.selectRole === "Retailer") {
                return instance.addRetailer(App.roleAddress);
            }
            if (App.selectRole === "Consumer") {
                return instance.addConsumer(App.roleAddress);
            }
        }).then(function(result) {
            console.log('roleAddition',result);
        }).catch(function(err) {
            console.log('roleAddition',err.message);
        });
    },

    // roleRemoval: this function removes a role from an address as specified by the front-end user
    roleRemoval: function (event) {
        console.log(`roleRemoval function`);
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.roleRenounceAddress = $("#roleRenounceAddress").val();
        App.selectRenounceRole = $("#selectRenounceRole").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            if (App.selectRenounceRole === "Farmer") {
                return instance.renounceFarmer();
            }
            if (App.selectRenounceRole === "Distributor") {
                return instance.renounceDistributor();
            }
            if (App.selectRenounceRole === "Retailer") {
                return instance.renounceRetailer();
            }
            if (App.selectRenounceRole === "Consumer") {
                return instance.renounceConsumer();
            }
        }).then(function(result) {
            console.log('roleRemoval',result);
        }).catch(function(err) {
            console.log('roleRemoval',err.message);
        });
    },

    // refreshAddress function: this function provides the user with information about the currently
    // connected address and its roles
    refreshAddress: function () {
        console.log(`refreshAddress function`);
        try {
            App.contracts.SupplyChain.deployed().then(function(instance) {            
                let assignedRoles = [];
                assignedRoles.push(instance.isFarmer(App.connectedAddress));
                assignedRoles.push(instance.isDistributor(App.connectedAddress));
                assignedRoles.push(instance.isRetailer(App.connectedAddress));
                assignedRoles.push(instance.isConsumer(App.connectedAddress));
                let listAssignedRoles = Promise.all(assignedRoles);
                listAssignedRoles.then(function(results) {
                    App.connectedAddressRoles = "";
                    $("#connectedAddressRoles").text("");
                    if (results[0]) {
                        App.connectedAddressRoles = `${App.connectedAddressRoles} Farmer`;
                    }
                    if (results[1]) {
                        App.connectedAddressRoles = `${App.connectedAddressRoles} Distributor`;
                    }
                    if (results[2]) {
                        App.connectedAddressRoles = `${App.connectedAddressRoles} Retailer`;
                    }
                    if (results[3]) {
                        App.connectedAddressRoles = `${App.connectedAddressRoles} Consumer`;
                    }
                    if (App.connectedAddressRoles === "") {
                        App.connectedAddressRoles = `You have no roles in the suppy chain at the moment`;
                    }
                    $("#connectedAddressRoles").text(App.connectedAddressRoles);
                    return App.connectedAddressRoles;
                });
                listAssignedRoles.catch(function(err) {
                    console.log('refreshAddress 3 listAssignedRoles - error',err.message);
                });    
            }).then(function(result) {
                console.log('refreshAddress - result ',result);
            }).catch(function(err) {
                console.log('refreshAddress 2 - err.message ',err.message);
            }); 
        }
        catch(err) {
            console.log('refreshAddress 1 - err.message ',err.message);
        }         
    },

    fetchEvents: function () {
        console.log(`fetchEvents function`);
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        console.log(`calling App.init()`);
        App.init();
    });
});
