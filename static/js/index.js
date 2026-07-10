'use strict';

const {
  NAMED_COLORS,
  normalizeColor,
  colorToPickerValue,
  encodeColorClass,
  decodeColorClass,
} = require('ep_font_colors_rgb/static/js/colorUtils');

const COLOR_CLASS_RE = /(?:^| )color:([^ ]+)/;
const LEGACY_COLORS = [...NAMED_COLORS.keys()];

exports.aceAttribsToClasses = (hook, context) => {
  if (context.key !== 'color') return;
  const color = normalizeColor(context.value);
  if (!color) return;
  return [`color:${encodeColorClass(color)}`];
};

exports.aceCreateDomLine = (hook, context) => {
  const match = COLOR_CLASS_RE.exec(context.cls || '');
  if (!match) return [];
  const color = decodeColorClass(match[1]);
  if (!color) return [];
  return [{
    cls: context.cls,
    extraOpenTags: `<span style="color:${color}">`,
    extraCloseTags: '</span>',
  }];
};

const setPanelColor = (color) => {
  const normalized = normalizeColor(color);
  const $panel = $('#font-color');
  $panel.find('.ep-font-colors-rgb-picker').val(colorToPickerValue(normalized));
  $panel.find('.ep-font-colors-rgb-value').val(normalized);
  $panel.find('.ep-font-colors-rgb-swatch').removeClass('selected');
  if (normalized) {
    $panel.find(`.ep-font-colors-rgb-swatch[data-color="${normalized}"]`).addClass('selected');
  }
};

const applyColorFromPanel = (context, rawColor) => {
  const color = normalizeColor(rawColor);
  if (!color) return;
  context.ace.callWithAce((ace) => ace.ace_doInsertColor(color), 'insertRgbFontColor', true);
  setPanelColor(color);
  context.ace.focus();
};

exports.postAceInit = (hook, context) => {
  const $panel = $('#font-color');

  $('.font-color-icon').on('click', () => {
    $panel.toggle();
    context.ace.focus();
  });

  $panel.find('.ep-font-colors-rgb-picker').on('input change', function () {
    applyColorFromPanel(context, this.value);
  });

  $panel.find('.ep-font-colors-rgb-value').on('keydown', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    applyColorFromPanel(context, this.value);
  }).on('change blur', function () {
    const color = normalizeColor(this.value);
    if (color) applyColorFromPanel(context, color);
    else setPanelColor('');
  });

  $panel.find('.ep-font-colors-rgb-swatch').on('click', function () {
    applyColorFromPanel(context, $(this).attr('data-color'));
  });

  $panel.find('.ep-font-colors-rgb-clear').on('click', () => {
    context.ace.callWithAce((ace) => ace.ace_doInsertColor(''), 'clearRgbFontColor', true);
    setPanelColor('');
    context.ace.focus();
  });
};

const doInsertColor = function (rawColor) {
  const rep = this.rep;
  const documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd)) return;
  const color = normalizeColor(rawColor);
  documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [['color', color]]);
};

exports.aceInitialized = (hook, context) => {
  context.editorInfo.ace_doInsertColor = doInsertColor.bind(context);
  context.editorInfo.ace_doInsertColors = (level) => {
    const color = LEGACY_COLORS[Number(level)] || '';
    doInsertColor.call(context, color);
  };
};

exports.postToolbarInit = (hook, context) => {
  context.toolbar.registerCommand('fontColor', (buttonName, toolbar, item) => {
    $(item.$el).after($('#font-color'));
    $('#font-color').toggle();
  });
};

exports.aceEditEvent = (hook, call) => {
  const cs = call.callstack;
  const attrManager = call.documentAttributeManager;
  const rep = call.rep;
  const allowedEvents = ['handleClick', 'handleKeyEvent'];
  if (allowedEvents.indexOf(cs.type) === -1 && !cs.docTextChanged) return;
  if (cs.type === 'setBaseText' || cs.type === 'setup') return;

  setTimeout(() => {
    if (!rep.selStart || rep.selStart[1] === 0) return;
    if (rep.selStart[1] === 1 && rep.alltext[0] === '*') return;
    const startAttribs = attrManager.getAttributesOnPosition(rep.selStart[0], rep.selStart[1]);
    const endAttribs = attrManager.getAttributesOnPosition(rep.selEnd[0], rep.selEnd[1]);
    const [startColor] = startAttribs.filter((item) => item[0] === 'color');
    const [endColor] = endAttribs.filter((item) => item[0] === 'color');
    const selected = normalizeColor(startColor && startColor[1]);
    const endSelected = normalizeColor(endColor && endColor[1]);
    if (selected && (!endSelected || selected === endSelected)) setPanelColor(selected);
    else setPanelColor('');
  }, 100);
};

exports.aceEditorCSS = () => ['ep_font_colors_rgb/static/css/color.css'];
