/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('TabApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    //configs:{
    refs:
        {
            tabs: 'viewport > #tabs',
            tabMenu: 'main-view #contentPanel',
            mainContent: '#main-view'
        },
    //},
    init: function () {
        this.control({
            'menuitem': {
                click: this.onMenuItemClick
            }
        });
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },
    onMenuItemClick: function(rowmodel, record, index, eOpts) {
        //console.log(rowmodel);
        //console.log(record);
        //console.log(rowmodel.text);
        //var tabmenu = Ext.getCmp("contentPanel");
        //console.log(tabmenu);
        //console.log(this);

        //console.log(this.tabmenu);
        //console.log(this.getTabMenu());

        //console.log(this.getMainContent());
        //console.log(this.lookupReference("contentPanel"));

        var tabmenu = this.lookupReference("contentPanel");
        var count = tabmenu.items.getCount();
        var tab = tabmenu.add({
            title: rowmodel.text,
            xtype: 'mainlist',
            id: 'tab_'+rowmodel.id+"_"+count,
            closable: true,
            autoScroll: true,
            layout: 'fit'
        }).show();

    }
});
