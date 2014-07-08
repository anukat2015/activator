/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define([
  'main/plugins',
  'commons/utils',
  'commons/widget',
  'text!./monitor.html',
  'text!./monitorWidget.html',
  './solutions/newrelic',
  './solutions/appdynamics',
  'css!./monitor.css'
], function(
  plugins,
  utils,
  Widget,
  template,
  widgetTemplate,
  NewRelic,
  AppDynamics,
  css
){
  var MonitorWidget = utils.Class(Widget, {
    id: 'monitor-widget',
    template: widgetTemplate,
    init: function(args) {
      var self = this;
      self.crumbs = ko.observableArray([]);
      self.views = {
        'newrelic': { contents: new NewRelic() },
        'appdynamics' : {contents: new AppDynamics() }
      };
      self.viewer = ko.computed(function() {
        return self.updateView(self.crumbs());
      });
    },
    route: function(path) {
      this.crumbs(path);
    },
    updateView: function(path) {
      name = path[0];
      return this.views[name];
    }
  });

  var MonitorState = {
    monitorWidget: new MonitorWidget(),
    provider: ko.observable()

  };

  return {
    render: function() {
      var $monitor = $(template)[0];
      ko.applyBindings(MonitorState, $monitor);
      return $monitor;
    },
    route: plugins.memorizeUrl(function(url, breadcrumb) {
      if (url.parameters == undefined || url.parameters.length == 0) {
        MonitorState.provider(null);
      } else {
        MonitorState.provider(url.parameters[0]);
      }
      MonitorState.monitorWidget.route(url.parameters);
    })
  }
});
