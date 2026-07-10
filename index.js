'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_editbarMenuLeft = (hook, args, cb) => {
  if (args.renderContext.isReadOnly) return cb();
  args.content += eejs.require('ep_font_colors_rgb/templates/editbarButtons.ejs');
  return cb();
};

exports.eejsBlock_styles = (hook, args, cb) => {
  args.content += '<link href="../static/plugins/ep_font_colors_rgb/static/css/color.css" rel="stylesheet">';
  return cb();
};

exports.eejsBlock_body = (hook, args, cb) => {
  args.content += eejs.require('ep_font_colors_rgb/templates/colorPanel.ejs');
  return cb();
};
