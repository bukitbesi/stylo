/*! SimplyStylo seasonal color analysis engine. (c) SimplyStylo. All rights reserved. */
// Quiz → three scores (temperature, value, chroma) → one of 12 seasonal palettes.
// The 12-season model follows the three Munsell color dimensions: hue (warm/cool), value (light/deep) and
// chroma (bright/soft). The season is named by the strongest dimension, then the next strongest decides between
// the two seasons that share it. This is a self-assessment guide, not a professional draping.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SSSeason = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FACTS = { verified: '2026-11-01' };

  // Each option adds to t (temperature: + warm, − cool), v (value: + deep, − light), c (chroma: + bright, − soft).
  var QUESTIONS = [
    { id: 'veins', q: 'In daylight, what color do the veins on your inner wrist look?', options: [
      { label: 'Blue or purple', t: -2 }, { label: 'A mix, hard to tell', t: 0 }, { label: 'Green or olive', t: 2 }] },
    { id: 'metal', q: 'Which jewelry makes your skin look clearer and brighter?', options: [
      { label: 'Silver or platinum', t: -2 }, { label: 'Both look fine', t: 0 }, { label: 'Gold or brass', t: 2 }] },
    { id: 'white', q: 'Held under your chin, which white is more flattering?', options: [
      { label: 'Crisp pure white', t: -1, c: 1 }, { label: 'Soft off-white', t: 0, c: -1 }, { label: 'Warm cream or ivory', t: 1, c: -1 }] },
    { id: 'sun', q: 'How does your skin usually react to the sun?', options: [
      { label: 'Burns or turns pink first', t: -1 }, { label: 'Burns a little, then tans', t: 0 }, { label: 'Tans golden or bronze easily', t: 1 }] },
    { id: 'hair', q: 'What is your natural hair color (before gray or dye)?', options: [
      { label: 'Light: blonde, strawberry or light ash', v: -2 }, { label: 'Medium: light to mid brown, auburn', v: 0 },
      { label: 'Dark: dark brown or black', v: 2 }] },
    { id: 'skin', q: 'How would you describe your skin depth?', options: [
      { label: 'Fair or light', v: -1 }, { label: 'Medium', v: 0 }, { label: 'Tan, deep or dark', v: 1 }] },
    { id: 'eyes', q: 'What are your eyes like?', options: [
      { label: 'Clear and bright, with sharp contrast to the white of the eye', c: 2 },
      { label: 'Somewhere in between', c: 0 }, { label: 'Soft, blended or grayed (e.g. hazel, gray-green)', c: -2 }] },
    { id: 'contrast', q: 'How much contrast is there between your hair, skin and eyes?', options: [
      { label: 'High: they stand out sharply from each other', c: 2, v: 0 }, { label: 'Medium', c: 0 },
      { label: 'Low: they blend together', c: -2 }] }
  ];

  var SEASONS = {
    'light-spring': { name: 'Light Spring', family: 'Spring', traits: 'light, warm and clear',
      palette: ['#F7D7A8', '#F4B183', '#F59C8C', '#F7C6C7', '#FFE38A', '#B7E3C0', '#8FD3C8', '#9CC9EE', '#B9B4E6', '#E3A36B'],
      neutrals: ['#F4EBDD', '#E4D3B8', '#C9A97E', '#9A8F86'], avoid: ['#1B1B1B', '#4B2C3A', '#3C3F44'] },
    'warm-spring': { name: 'Warm Spring', family: 'Spring', traits: 'warm, clear and medium-light',
      palette: ['#F2A541', '#E86F3C', '#F28C8C', '#FFD05A', '#8CBF4F', '#2FA58F', '#4AA8C8', '#E0B04A', '#C9573A', '#F5C9A0'],
      neutrals: ['#F3E6CF', '#D7B98E', '#A57C4F', '#6C4E35'], avoid: ['#1B1B1B', '#8E9094', '#B7A7D3'] },
    'bright-spring': { name: 'Bright Spring', family: 'Spring', traits: 'bright, warm-leaning and high-contrast',
      palette: ['#FF5A5F', '#FF8C2E', '#FFD23F', '#2EC27E', '#00A6A6', '#1E88E5', '#7A5CFA', '#FF4F9A', '#F7F3E8', '#22313F'],
      neutrals: ['#FAF7EF', '#E9DCC5', '#5A4636', '#22313F'], avoid: ['#B5A77D', '#9CAF94', '#C9B6A6'] },
    'light-summer': { name: 'Light Summer', family: 'Summer', traits: 'light, cool and soft',
      palette: ['#F4C2CC', '#E6A4B4', '#CBB6E3', '#A9C6E3', '#9DD0D9', '#B5DCC6', '#F2E6A6', '#D7A9C9', '#8EA9D6', '#E9D2D6'],
      neutrals: ['#F5F3EF', '#D8D5D2', '#A7A9AC', '#6E7480'], avoid: ['#E0702A', '#1B1B1B', '#A4502B'] },
    'cool-summer': { name: 'Cool Summer', family: 'Summer', traits: 'cool, soft and medium',
      palette: ['#5F7FB5', '#7FA3C8', '#4F8A8B', '#9C5B87', '#C4708E', '#8E7CC3', '#D995A9', '#5B6EA6', '#7C3E5C', '#A6C8C1'],
      neutrals: ['#F2F1EE', '#BFC2C7', '#6D727B', '#2F3A4F'], avoid: ['#E0702A', '#D0A12B', '#B98A57'] },
    'soft-summer': { name: 'Soft Summer', family: 'Summer', traits: 'soft, cool-leaning and muted',
      palette: ['#8FA3B5', '#A7B7A5', '#B08FA3', '#C7A1A6', '#7F8FA6', '#6F8A82', '#9C8FB0', '#C9B7A4', '#7B6A86', '#A3B3C2'],
      neutrals: ['#EDEAE4', '#BDB7AF', '#7E7A75', '#4B4F57'], avoid: ['#FF5A5F', '#FFD23F', '#1B1B1B'] },
    'soft-autumn': { name: 'Soft Autumn', family: 'Autumn', traits: 'soft, warm-leaning and muted',
      palette: ['#C9A27E', '#B58A6A', '#A7A67C', '#8A9A6E', '#C98B78', '#D2B48C', '#7F9C93', '#B9876A', '#9C7C5C', '#D8B89A'],
      neutrals: ['#EFE6D6', '#CDBA9D', '#8F7A63', '#5D4D3F'], avoid: ['#1B1B1B', '#1F4FB0', '#D9327A'] },
    'warm-autumn': { name: 'Warm Autumn', family: 'Autumn', traits: 'warm, rich and medium-deep',
      palette: ['#C1662E', '#A4502B', '#D0A12B', '#6B6B3A', '#8A7A2E', '#1D6E73', '#B5452E', '#E09B4F', '#7C4A2D', '#A68A3C'],
      neutrals: ['#EDE0C8', '#C8A879', '#8B6A45', '#4F3A28'], avoid: ['#B7A7D3', '#E8B9B0', '#8E9094'] },
    'deep-autumn': { name: 'Deep Autumn', family: 'Autumn', traits: 'deep, warm and rich',
      palette: ['#6D1F2E', '#8B3A2B', '#A4502B', '#556B2F', '#1D5C4D', '#B8860B', '#5A3D5C', '#9C4A1A', '#2E4A3F', '#C17A2E'],
      neutrals: ['#E9DCC4', '#9C7B55', '#4E3B2C', '#2A2420'], avoid: ['#E8B9B0', '#A9C6E3', '#B7A7D3'] },
    'deep-winter': { name: 'Deep Winter', family: 'Winter', traits: 'deep, cool and high-contrast',
      palette: ['#6D1F2E', '#11775A', '#1F4FB0', '#5E2C7A', '#B3123A', '#0F5257', '#2B2D6E', '#8C1C4B', '#FAFAF7', '#1B1B1B'],
      neutrals: ['#FAFAF7', '#8E9094', '#3C3F44', '#1B1B1B'], avoid: ['#D8C8AE', '#B98A57', '#D0A12B'] },
    'cool-winter': { name: 'Cool Winter', family: 'Winter', traits: 'cool, clear and medium-deep',
      palette: ['#1F4FB0', '#0F7C8A', '#B3123A', '#C2185B', '#6A3FA0', '#00897B', '#3949AB', '#E91E63', '#E8EEF7', '#1F2A44'],
      neutrals: ['#FFFFFF', '#B0B4BA', '#3C3F44', '#1F2A44'], avoid: ['#E0702A', '#B98A57', '#B5A77D'] },
    'bright-winter': { name: 'Bright Winter', family: 'Winter', traits: 'bright, cool-leaning and high-contrast',
      palette: ['#E3007D', '#0047FF', '#00A88F', '#7B2FF7', '#D50032', '#00B5E2', '#FFE600', '#FF2E93', '#FFFFFF', '#111111'],
      neutrals: ['#FFFFFF', '#9EA3AA', '#2F3542', '#111111'], avoid: ['#B5A77D', '#C9A27E', '#A7B7A5'] }
  };

  // Each pair: [season when the second dimension points one way, season when it points the other].
  function pick(dominant, t, v, c) {
    switch (dominant) {
      case 'light': return t >= 0 ? 'light-spring' : 'light-summer';
      case 'deep': return t >= 0 ? 'deep-autumn' : 'deep-winter';
      case 'bright': return t >= 0 ? 'bright-spring' : 'bright-winter';
      case 'soft': return t >= 0 ? 'soft-autumn' : 'soft-summer';
      // Warm or cool dominant: lighter/brighter → spring/winter-type clear seasons, deeper/softer → autumn/summer.
      case 'warm': return (c - v) >= 0 ? 'warm-spring' : 'warm-autumn';
      case 'cool': return (v + c) >= 0 ? 'cool-winter' : 'cool-summer';
    }
    return null;
  }

  // Max possible magnitudes per axis, so each axis is compared on the same 0–1 scale.
  function axisMax(key) {
    return QUESTIONS.reduce(function (sum, q) {
      return sum + Math.max.apply(null, q.options.map(function (o) { return Math.abs(o[key] || 0); }));
    }, 0);
  }
  var MAX = { t: axisMax('t'), v: axisMax('v'), c: axisMax('c') };

  // answers: { veins: 0..2, metal: 0..2, ... } (option index). Missing answers count as the middle option.
  function score(answers) {
    var s = { t: 0, v: 0, c: 0 };
    QUESTIONS.forEach(function (q) {
      var i = answers && answers[q.id] != null ? +answers[q.id] : 1;
      var o = q.options[i] || q.options[1];
      s.t += o.t || 0; s.v += o.v || 0; s.c += o.c || 0;
    });
    return { t: s.t / MAX.t, v: s.v / MAX.v, c: s.c / MAX.c };
  }

  function analyse(answers) {
    var s = score(answers);
    // Order breaks ties: value, then chroma, then temperature.
    var axes = [
      { key: 'v', mag: Math.abs(s.v), dir: s.v < 0 ? 'light' : 'deep' },
      { key: 'c', mag: Math.abs(s.c), dir: s.c > 0 ? 'bright' : 'soft' },
      { key: 't', mag: Math.abs(s.t), dir: s.t > 0 ? 'warm' : 'cool' }
    ];
    var dom = axes.reduce(function (a, b) { return b.mag > a.mag ? b : a; });
    var id = pick(dom.dir, s.t, s.v, s.c);
    var conf = Math.round(dom.mag * 100);
    // Below 0.25 no dimension clearly leads, so the result is a near-tie between neighbouring seasons.
    return { id: id, season: SEASONS[id], dominant: dom.dir, scores: s, strength: conf, borderline: dom.mag < 0.25 };
  }

  function answered(answers) {
    return QUESTIONS.filter(function (q) { return answers && answers[q.id] != null; }).length;
  }

  return { FACTS: FACTS, QUESTIONS: QUESTIONS, SEASONS: SEASONS, score: score, analyse: analyse, answered: answered };
});
