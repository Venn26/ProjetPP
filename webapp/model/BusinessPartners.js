sap.ui.define([
    "sap/ui/base/ManagedObject",
], function (
    ManagedObject,
) {
    "use strict";
    // TODO:
    // Ajouter cette ligne dans le sap.ui.define de Component.js:
    //        "wwl/model/Partners",
    // Ajouter cette ligne en parametre de fonction de Component.js:
    //        PartnersModel,
    // Ajouter cette ligne dans le onInit de Component.js:
    //        this.PartnersModel = new PartnersModel(this.getRootControl());
    // Ajouter ces ligne dans le onBeforeRendering du Controller:
    //        ownerComponent = this.getOwnerComponent();
    //        Models.Partners = ownerComponent.PartnersModel;
    // Ajouter l'uri path dans la variable APP_CONTEXT.uri de Component.js:
    //        Partners : "Partners"
    let appContext;

    return ManagedObject.extend('wwl.model.Partners', {
        query: "",
        idField: "",
        CardCode: "",
        CardName: "",
        /**
         * Mettre les champs utilisé de l'objet ici, ex: code :'Code'
         */
        constructor: function (oView) {
            this._oView = oView;
            appContext = oView.getParent().APP_CONTEXT
        },

        /**
         * ajoute ?$ ou &$ a la query
         * @return {string}
         * @private
         */
        _prepareToAddParam: function () {
            return this.query == "" ? "?$" : "&$";
        },

        /**
         * Ajoute a lquery sous le Select=
         * @param select
         * @return {wwl.model.Partners}
         */
        select: function (select) {
            this.query += this._prepareToAddParam();
            this.query += "select=" + select;
            return this
        },

        /**
         * ajoute a la query sous le Filter=
         * @param filter
         * @return {wwl.model.Partners}
         */
        filter: function (filter) {
            this.query += this._prepareToAddParam();
            this.query += "filter=" + filter;
            return this
        },

        /**
         * met en place l'id dans la query
         * @param id
         * @return {wwl.model.Partners}
         */
        id: function (id) {
            this.query = "(" + id + ")" + this.query;
            return this
        },
        /**
         * reset la Query
         * @private
         */
        _resetQuery: function () {
            this.query = ""
        },

        /**
         * Do query
         * @return {ajax}
         */
        get: function () {
            let that = this;
            return $.ajax({
                method: 'get',
                url: appContext.url.SL + appContext.uri.Partners + that.query,
                xhrFields: {withCredentials: true}
            }).always(() => {
                that._resetQuery();
            })
        },

        /**
         * Prend la data, la stringify et le patch a l'uri de l'object grace au l'id de la data fournie.
         * (http://path:port/uri('data[_id_]')
         * @param nonStringifiedData
         * @return {ajax}
         */
        patch: function (data) {
            let that = this;
            return $.ajax({
                method: 'patch',
                url: appContext.url.SL + appContext.uri.Partners + "('" + data[that.idField] + "')",
                data: JSON.stringify(data),
                xhrFields: {withCredentials: true},
            })
        },

        /**
         * Envoi au SL la data (non Stringifiée car stringifed dans la method)
         * Ca get d'abord l'id de l'object pour faire +1
         * (http://path:port/uri&?select=_id_ &orderby=_id_ desc &$ top=1)
         * Puis ca post la data fourni en param
         * (http://path:port/uri)
         * @param dataToPost
         * @return {ajax}
         */
        post: function (dataToPost) {
            let that = this;
            let code;
            let filters = "?$select=" + that.idField + "&$orderby=" + that.idField + " desc &$ top=1"
            $.ajax({
                method: 'get',
                async: false,
                url: appContext.url.SL + appContext.uri.Partners + filters,
                xhrFields: {withCredentials: true},
            }).done((dataGetted) => {
                code = (parseInt(dataGetted.value[0][that.idField]) + 1).toString()
            });

            dataToPost[that.idField] = code;
            return $.ajax({
                method: 'post',
                url: appContext.url.SL + appContext.uri.Partners,
                data: JSON.stringify(dataToPost),
                xhrFields: {withCredentials: true}
            })

        },

        /**
         * Delete grace au SL l'item aqui le code mis en param appartient.
         * @param code
         * @return {ajax}
         */
        delete: function (code) {
            return $.ajax({
                method: 'delete',
                url: appContext.url.SL + appContext.uri.Partners + "('" + code + "')",
                xhrFields: {withCredentials: true}
            })
        }

    });
});