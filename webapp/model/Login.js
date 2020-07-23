sap.ui.define([
    "sap/ui/base/ManagedObject"
], function (ManagedObject) {
    "use strict";
    let appContext;

    return ManagedObject.extend('wwl.model.login', {
        constructor: function (oView) {
            this._oView = oView;
            appContext = oView.getParent().APP_CONTEXT
        },

        imLogged: function () {
            let that = this;
            let isConnected = false;
            $.ajax({
                async: false,
                method: 'get',
                url: appContext.url.SL + "Users?$select=InternalKey &$ top=1",
                xhrFields: {withCredentials: true}
            }).done((data) => {
                isConnected = data.value ? true : false;
            }).fail((fail) => {
                isConnected = fail.error ? false : true;
            })
            return isConnected
        },

        post: function (login, password) {
            let that = this;
            return $.ajax({
                beforeSend: function () {
                    that._oView.setBusy(true);
                },
                method: "post",
                url: appContext.url.SL + appContext.uri.Login,
                xhrFields: {withCredentials: true},
                data: JSON.stringify({
                    UserName: login,
                    Password: password,
                    CompanyDB: appContext.dbCompany,
                }),
            }).always(() => {
                that._oView.setBusy(false);
            })
        },
    });
});