'use strict';

const settings = require('ep_etherpad-lite/node/utils/Settings');
const {template} = require('ep_plugin_helpers');

exports.eejsBlock_editbarMenuLeft = template('ep_font_colors_rgb/templates/editbarButtons.ejs', {
  skip: () => JSON.stringify(settings.toolbar).indexOf('fontColor') > -1,
});

exports.padInitToolbar = (hook, args, cb) => {
  const toolbar = args.toolbar;
  const colors = ['black', 'red', 'green', 'blue', 'yellow', 'orange'];
  const fontColor = toolbar.selectButton({
    command: 'fontColor',
    class: 'color-selection',
    selectId: 'color-selection',
  });
  fontColor.addOption('dummy', 'color', {'data-l10n-id': 'ep_font_colors_rgb.color'});
  colors.forEach((color, value) => {
    fontColor.addOption(value, color, {'data-l10n-id': `ep_font_colors_rgb.${color}`});
  });

  toolbar.registerButton('fontColor', fontColor);
  return cb();
};
