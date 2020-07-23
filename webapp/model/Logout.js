sap.ui.define([
    "sap/ui/base/ManagedObject",
], function (
    ManagedObject,
) {
    "use strict";
    let appContext;

    return ManagedObject.extend('wwl.model.Logout', {
        /**
         * Mettre les champs utilisé de l'objet ici, ex: code :'Code'
         */
        id: '',

        constructor: function (oView) {
            this._oView = oView;
            appContext = oView.getParent().APP_CONTEXT
        },
        /**
         * Prend la data, la stringify et le patch a l'uri de l'object grace au l'id de la data fournie.
         * (http://path:port/uri('data[_id_]')
         * @param nonStringifiedData
         * @return {ajax}
         */
        post: function (data) {
            let that = this;
            return $.ajax({
                beforeSend: function () {
                    that._oView.setBusy(true);
                },
                method: 'post',
                url: appContext.url.SL + appContext.uri.Logout,
                data: JSON.stringify(data),
                xhrFields: {withCredentials: true},
            }).always(() => {
                that._oView.setBusy(false);
            })
        },


    });
});