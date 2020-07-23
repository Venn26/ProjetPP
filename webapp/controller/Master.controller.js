sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "wwl/model/login",
    "sap/m/MessageBox",
    "wwl/utils/Formatter",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/TextArea",
    "sap/ui/layout/HorizontalLayout",
    "sap/ui/layout/VerticalLayout",
    "sap/m/library",
    "sap/ui/model/FilterOperator"
], function (
    Controller,
    JSONModel,
    LoginModel,
    MessageBox,
    Formatter,
    MessageToast,
    Filter,
    Button,
    Dialog,
    Label,
    Text,
    TextArea,
    HorizontalLayout,
    VerticalLayout,
    mobileLibrary,
    FilterOperator
) {
    "use strict";
    let Models = {};
    let modelName = {
        confFile: "conf",
        ConnectedPartner: "ConnectedPartner",
    };
    let ids = {
        mainPage: "mainPage",
    };

    let ButtonType = mobileLibrary.ButtonType;
    let errorMessage = 'Erreur : la valeur entrée doit être positive.';

    return Controller.extend("wwl.controller.Master", {
        Formatter: Formatter,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already postd.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         */
        onInit: function () {
            let that = this;
        },
        pressItem: function (event) {
            console.log(event);
        },
        onBeforeRendering: function () {
            let that = this;
            let ownerComponent = this.getOwnerComponent();
            this.appContext = ownerComponent.APP_CONTEXT;
            Models.Login = ownerComponent.LoginModel;
            Models.Logout = ownerComponent.LogoutModel;
            Models.Items = ownerComponent.ItemsModel;
            Models.Partners = ownerComponent.PartnersModel;
            let items;
            let partners;
            let cart;
            let emptydocumentLines = []
            that._setModel(emptydocumentLines, "documentLines")

            Models.Partners.select("CardCode, CardName, PriceListNum&$top=1").get().done((data) => {
                that._setModel(data.value[0], modelName.ConnectedPartner)
                // Models.Items.select("ItemName, ItemCode, ItemPrices").filter("Valid eq 'tYES'").get()
                //     .done((data) => {

                items = Models.Items.getJSON()
                // let me = that._getModel(modelName.ConnectedPartner).getData()
                // items.forEach((item) => {
                //     item.Price = item.ItemPrices.find((price) => price.PriceList == me.PriceListNum).Price
                // })
                // }).done((data) => {

                // items.forEach((param1, param2, param3) => {
                //     param1.Quantity = Math.floor(Math.random() * Math.floor(10))
                // })

                this._setModel(items, "Items")

                // this._getModel("Items")

                // })
            });

            let tblBody = document.getElementsByClassName("sapMListItems sapMTableTBody");
            let imLogged = Models.Login.imLogged();
            if (!imLogged) {
                that.getOwnerComponent().getRouter().navTo('Login');
            }
        },

        handleValidateDocument: function (event) {
            let that = this;
            let model = that._getModel("documentLines");
            let data = model.getData();
            let object = {
                ItemName: 'item',
                Quantity: 1
            };
            data.push(object)
            model.refresh(true);
            let oDialog = new Dialog({
                title: 'Confirmer',
                type: 'Message',
                content: new Text({text: 'Êtes-vous sûr(e) de vouloir valider votre panier ?'}),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: 'Valider',
                    press: function () {
                        // MessageToast.show('Panier validé, redirection...');
                        // oDialog.close();
                        // that.getOwnerComponent().getRouter().navTo('Validate', true);
                        let oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                        console.log(oRouter)
                        oRouter.navTo('DynamicPageWithWizard');
                        console.log(oRouter)
                    }
                }),
                endButton: new Button({
                    text: 'Annuler',
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        },

        PressMinusBtn: function (event) {

            let bindingContext = event.getSource().getParent().getParent().getBindingContext('Items');
            let that = this;
            let item = that._getModel('Items').getProperty(bindingContext.getPath())
            that._getModel('Items').refresh()
            if (item.Quantity > 0) {
                item.Quantity--
            } else {
                MessageToast.show(errorMessage);
            }
        },

        PressPlusBtn: function (event) {

            let bindingContext = event.getSource().getParent().getParent().getBindingContext('Items');
            let that = this;
            let item = that._getModel('Items').getProperty(bindingContext.getPath())
            item.Quantity++
            that._getModel('Items').refresh()
        },

        submitInput: function (event) {
            let value = event.getParameter("value");
            if (value < 0) {
                let bindingContext = event.getSource().getParent().getParent().getBindingContext('Items');
                let that = this;
                let item = that._getModel('Items').getProperty(bindingContext.getPath())
                item.Quantity = 0
                that._getModel('Items').refresh()
                MessageToast.show(errorMessage);
            }
        },

        onAvatarPress: function (event) {
            let that = this;
            let oDialog = new Dialog({
                title: 'Confirm',
                type: 'Message',
                content: new Text({text: 'Êtes-vous sûr(e) de vouloir vous déconnecter ?'}),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: 'Déconnexion',
                    press: function () {
                        that.handleLogout()
                    }
                }),
                endButton: new Button({
                    text: 'Annuler',
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        },

        onType: function (event) {
            let that = this;
            let item = that._getModel('Items')
            let inputVal = parseInt(event.getSource().getValue(), 10);
            // let input = oEvent.getParameter("value");
            // ====> ALTERNATIVE.

            let selectedRow = event.getSource().getParent();
            let rows = selectedRow.getParent().getAggregation("items")
            let cells = selectedRow.getAggregation("cells");
            let pvKilo = cells[6].getProperty("number");
            let pvColis = cells[7].getProperty("number");
            let quantity = parseInt(cells[2].getProperty("text"), 10);
            let totalFooter = this.getView().getAggregation("content")[0]
                .getAggregation("footer").getAggregation("content")[2]

            let totalHT = cells[8]
            let totalNet = cells[5]

            let HT = Math.round((inputVal * pvKilo) * 100 + Number.EPSILON) / 100
            let TVA = HT * (20 / 100)
            let NET = Math.round((HT + TVA) * 100 + Number.EPSILON) / 100


            // for (let i = 0; i < nRows; i++) {
            //     // console.log(oContext[5].getTemplateClone(0).getProperty("value"))
            //     // console.log(oContext[5].getTemplateClone(5).getProperty("value"))
            // }

            if (isNaN(inputVal)) {
                let error = "Veuillez entrer un chiffre."
                MessageToast.show(error)
                event.getSource().setValue("");
                totalNet.setNumber(0)
                totalHT.setNumber(0)
                totalFooter.setText("Total : " + 0 + " € TTC")
            } else {
                if (inputVal > quantity) {
                    let error = "Stock insuffisant.";
                    MessageToast.show(error);
                    event.getSource().setValue("")
                } else if (inputVal < 0) {
                    let error = "La quantité ne peut être inférieure à 0."
                    MessageToast.show(error);
                    event.getSource().setValue("")
                } else if ("0" + inputVal > quantity) {
                    let error = "Stock insuffisant.";
                    MessageToast.show(error);
                    event.getSource().setValue("")
                } else {
                    totalNet.setNumber(NET)
                    totalHT.setNumber(HT)

                    // Calcul de la somme de chaque ligne.

                    let totalVar = []
                    rows.forEach((column, i, array) => {
                        let numbers = rows[i].getAggregation("cells")[5].getProperty("number")
                        totalVar.push(numbers)
                    })

                    function sum(a) {
                        return (a.length && parseFloat(a[0]) + sum(a.slice(1))) || 0;
                    }

                    let s = sum(totalVar).toFixed(2);

                    totalFooter.setText("Total : " + s + " € TTC")
                }
            }
        },

        onSearch: function (oEvent) {
            let aFilters = [];
            let sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                let filter = new Filter("itemName", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }

            let oTable = this.byId("idProductsTable");
            let oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        onReset: function (oEvent) {
            let that = this;
            let sQuery = oEvent.getParameters("clearButtonPressed").clearButtonPressed
            if (sQuery === true) {

            } else {

            }
        },

        onSearchVeget: function (oEvent) {
            let aFilters = [];
            let sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                let filter = new Filter("itemName", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }

            let oTable = this.byId("idVegeTable");
            let oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        resetBtn: function (event) {

        },

        onAfterRendering: function () {
            let that = this;
            // let table = that._byId("DefaultTable");
            // table.getColumns().forEach((column, key, array) => {
            //         table.autoResizeColumn(key)
            //     }
            // )
        },
        handleLogout: function () {
            let that = this;
            Models.Logout.post().always(() => {
                that.getOwnerComponent().getRouter().navTo('Login');
            })
        },

        _byId: function (name) {
            return sap.ui.getCore().byId(name) ? sap.ui.getCore().byId(name) : this.getView().byId(name)
        },

        _getModel: function (name) {
            return this.getView().getModel(name);
        },

        _setModel: function (data, modelName, sizeLimit) {
            let jsonModel = new JSONModel(data);
            if (sizeLimit) jsonModel.setSizeLimit(sizeLimit);
            return this.getView().setModel(jsonModel, modelName)
        },
    });
});