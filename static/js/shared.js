'use strict';

const {inlineAttribute} = require('ep_plugin_helpers/attributes');
const {normalizeColor, decodeColorClass} = require('ep_font_colors_rgb/static/js/colorUtils');

const fontColor = inlineAttribute({attr: 'color'});

const STYLE_COLOR_RE = /(?:^|;|\s)color\s*:\s*([^;]+?)\s*(?:;|$)/i;
const CLASS_COLOR_RE = /(?:^| )color:([^ ]+)/;

const collectContentPreOrig = fontColor.collectContentPre;
exports.collectContentPre = (hookName, context) => {
  collectContentPreOrig(hookName, context);

  let color = '';
  if (context.styl) {
    const styleMatch = STYLE_COLOR_RE.exec(context.styl);
    if (styleMatch) color = normalizeColor(styleMatch[1]);
  }

  if (!color && context.cls) {
    const classMatch = CLASS_COLOR_RE.exec(context.cls);
    if (classMatch) color = decodeColorClass(classMatch[1]);
  }

  if (color) context.cc.doAttrib(context.state, `color::${color}`);
};

exports.collectContentPost = fontColor.collectContentPost;
