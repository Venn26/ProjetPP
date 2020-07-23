///Controller pour la vue du login
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "wwl/model/models",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "wwl/model/login"
], function (
    Controller,
    Models,
    JSONModel,
    MessageBox,
    LoginModel
) {
    "use strict";
    let model = {};
    let ids = {
        loginPage: "loginPage",
        passwordInput: "passwordInput",
        usernameInput: "usernameInput",
    };
    let modelName = {
        confFile: "conf"
    };
    /** Gestion de l'ecran de login */
    return Controller.extend("wwl.controller.Login", {

        authModel: null,

        onInit: function () {
            let that = this;
            that._byId(ids.passwordInput).onsapenter = function (oEvent) {
                that.onConnectPress();
            }
        },


        onBeforeRendering: function () {
            let that = this;
            let ownerComponent = this.getOwnerComponent();
            this.Login = ownerComponent.LoginModel;
        },

        onAfterRendering: function () {
        },

        /**
         * Connexion au service layer
         * Creation des variables globale dans window
         * Affichage de la selection mag si admin
         * @returns {Promise<void>}
         */
        onConnectPress: async function () {
            let that = this;
            //todo a (de)commenter si besoin de l'input de Login
            // let login = that.getView().byId(ids.usernameInput).getValue();
            // let pass = that.getView().byId(ids.passwordInput).getValue();

            //todo a (de)commenter si besoin de l'input de login
            let login = that.getView().getModel(modelName.confFile).getResourceBundle().getText('login');
            let pass = that.getView().getModel(modelName.confFile).getResourceBundle().getText('pass');

            this.Login.post(login, pass).done(function (e) {
                that.getOwnerComponent().getRouter().navTo('Master');
            }).fail(function (error) {
                console.log(error);
                MessageBox.error("Erreur:\n" + error.responseJSON.error.message.value);
            })
        },

        _byId: function (name) {
            return sap.ui.getCore().byId(name) ? sap.ui.getCore().byId(name) : this.getView().byId(name)
        },
    });
});