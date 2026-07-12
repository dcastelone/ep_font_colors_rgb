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
const SUGGESTED_COLORS = [
  '#000000', '#202124', '#3c4043', '#5f6368', '#80868b', '#9aa0a6', '#bdc1c6', '#dadce0', '#f1f3f4', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
  '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
  '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
  '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
  '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130',
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#009688', '#4caf50', '#8bc34a',
  '#cddc39', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b', '#2e7d32', '#1565c0', '#6a1b9a', '#ad1457',
];

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
  const $panel = $('#ep-font-colors-rgb-panel');
  $('.ep-font-colors-rgb-button').css(
      '--ep-font-colors-rgb-current-color',
      normalized || '#202124');
  $panel.find('.ep-font-colors-rgb-picker').val(colorToPickerValue(normalized));
  $panel.find('.ep-font-colors-rgb-value').val(normalized);
  $panel.find('.ep-font-colors-rgb-swatch').removeClass('selected');
  if (normalized) {
    $panel.find('.ep-font-colors-rgb-swatch').filter(function () {
      return normalizeColor($(this).attr('data-color')) === normalized;
    }).addClass('selected');
  }
};

const applyColorFromPanel = (context, rawColor) => {
  const color = normalizeColor(rawColor);
  if (!color) return;
  context.ace.callWithAce((ace) => ace.ace_doInsertColor(color), 'insertRgbFontColor', true);
  setPanelColor(color);
  context.ace.focus();
};

const renderSuggestedColors = ($panel) => {
  const $swatches = $panel.find('.ep-font-colors-rgb-swatches');
  if ($swatches.children().length) return;
  SUGGESTED_COLORS.forEach((color) => {
    $('<button>')
      .attr({
        type: 'button',
        class: 'ep-font-colors-rgb-swatch',
        'data-color': color,
        'aria-label': color,
        title: color,
      })
      .css('background-color', color)
      .appendTo($swatches);
  });
};

exports.postAceInit = (hook, context) => {
  const $panel = $('#ep-font-colors-rgb-panel');
  const $toolbarItem = $('.font-color-icon.ep_font_colors_rgb');
  const $button = $toolbarItem.find('.ep-font-colors-rgb-button');
  renderSuggestedColors($panel);

  const positionPanel = () => {
    const anchor = $toolbarItem[0];
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const panelWidth = $panel.outerWidth() || 176;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - panelWidth - 8));
    $panel.css({
      left,
      top: rect.bottom + 8,
    });
  };

  const closePanel = () => {
    $panel.prop('hidden', true).removeClass('is-open');
    $button.attr('aria-expanded', 'false');
  };

  const openPanel = () => {
    $panel.prop('hidden', false).addClass('is-open');
    positionPanel();
    $button.attr('aria-expanded', 'true');
  };

  const togglePanel = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if ($panel.prop('hidden')) openPanel();
    else closePanel();
  };

  $button.on('click', togglePanel);

  $(window).on('resize scroll', () => {
    if (!$panel.prop('hidden')) positionPanel();
  });

  $panel.on('click', (e) => e.stopPropagation());

  $(document).on('click', (e) => {
    if ($(e.target).closest('.font-color-icon.ep_font_colors_rgb, #ep-font-colors-rgb-panel').length) return;
    closePanel();
  });

  const $outerDocument = $('iframe[name="ace_outer"]').contents();
  const $innerDocument = $outerDocument.find('iframe[name="ace_inner"]').contents();
  $outerDocument.add($innerDocument).off('mousedown.epFontColorsRgbDismiss')
    .on('mousedown.epFontColorsRgbDismiss', closePanel);

  $(document).on('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  $panel.find('.ep-font-colors-rgb-picker').on('input change', function () {
    applyColorFromPanel(context, this.value);
    $panel.prop('hidden', false).addClass('is-open');
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
    closePanel();
  });

  $panel.find('.ep-font-colors-rgb-clear').on('click', () => {
    context.ace.callWithAce((ace) => ace.ace_doInsertColor(''), 'clearRgbFontColor', true);
    setPanelColor('');
    closePanel();
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
