/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('TabApp.view.main.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'TabApp.view.main.MainController',
        'TabApp.view.main.MainModel',
        'TabApp.view.main.List',
        'Ext.list.Tree',
        'Ext.menu.Menu',
        'Ext.menu.Item'
    ],

    controller: 'main',
    viewModel: 'main',

    ui: 'navigation',


    layout: 'border',


 items: [
        {
            xtype: 'panel',
            region: 'north',
            height: 100,
            itemId: 'headerPanel',
            title: 'Header'
        },
        {
            xtype: 'panel',
            region: 'west',
            split: true,
            itemId: 'menuPanel',
            width: 250,
            layout: 'accordion',
            collapseDirection: 'left',
            title: 'Menu',
            items: [
                {
                    xtype: 'panel',
                    title: 'Group 1',
                    items: [
                        {
                            xtype: 'menu',
                            floating: false,
                            itemId: 'menu1',
                            items: [
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                },
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                },
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: 'Group 2',
                    items: [
                        {
                            xtype: 'menu',
                            floating: false,
                            itemId: 'menu2',
                            items: [
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                },
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                },
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: 'Group 3',
                    items: [
                        {
                            xtype: 'menu',
                            floating: false,
                            itemId: 'menu3',
                            items: [
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                },
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                },
                                {
                                    xtype: 'menuitem',
                                    text: 'Menu Item'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            flex: 1,
            region: 'center',
            itemId: 'contentPanel',
            title: 'Content'
        }
    ]
});
