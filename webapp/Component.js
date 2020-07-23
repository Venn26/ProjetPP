sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "wwl/model/models",
    "wwl/model/Login",
    "wwl/model/Logout",
    "wwl/model/Items",
    "wwl/model/BusinessPartners",
], function (
    UIComponent,
    Device,
    models,
    LoginModel,
    LogoutModel,
    ItemsModel,
    PartnersModel,
) {


    "use strict";

    return UIComponent.extend("wwl.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            this.APP_CONTEXT = {
                dbCompany: 'SBO_INFRAMET_TEST',
                userConnected: undefined,
                url: {
                    SL: 'http://192.168.0.61:50001/b1s/v1/',
                    // SL: 'http://192.168.0.123:8001/api/',
                },
                uri: {
                    Login: 'Login',
                    Logout: "Logout",
                    Items : "Items",
                    Partners : "BusinessPartners"
                }
            };


            // call the base component's init function

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            this.LoginModel = new LoginModel(this.getRootControl())
            this.LogoutModel = new LogoutModel(this.getRootControl());
            this.ItemsModel = new ItemsModel(this.getRootControl());
            this.PartnersModel = new PartnersModel(this.getRootControl());

            this.getRouter().initialize();

        },
    });

});