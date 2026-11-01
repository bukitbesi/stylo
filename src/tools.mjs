// Tool catalog: one record per live tool. Order = order on the home and tools pages.
export const TOOLS = [
  { id: 'color-combination', name: 'Color Combination Finder', path: '/tools/color-combination/', icon: 'palette',
    blurb: 'Pick any clothing color and see the neutrals, accents and color-wheel combinations that go with it.' },
  { id: 'size-converter', name: 'International Size Converter', path: '/tools/size-converter/', icon: 'ruler',
    blurb: 'Convert shoe, dress, suit and shirt sizes between US, UK, EU and AU, with foot length in cm and inches.' },
  { id: 'color-analysis', name: 'Personal Color Analysis', path: '/tools/color-analysis/', icon: 'sparkle',
    blurb: 'Answer 8 quick questions to find your likely color season and your best colors and neutrals.' },
  { id: 'capsule-wardrobe', name: 'Capsule Wardrobe Planner', path: '/tools/capsule-wardrobe/', icon: 'hanger',
    blurb: "Build a 15, 25 or 35 piece women's or men's capsule with a printable checklist and outfit count." },
  { id: 'outfit-generator', name: 'Outfit Generator', path: '/tools/outfit-generator/', icon: 'shuffle',
    blurb: 'Get a complete outfit for the occasion, the temperature and the color you want to wear.' }
];

// Bundle = UI helpers + engines + the tool's UI, in dependency order.
export const BUNDLES = {
  'color-combination': ['src/ui/common.js', 'src/lib/color-core.js', 'src/ui/color-combination.js'],
  'size-converter': ['src/ui/common.js', 'src/lib/size-core.js', 'src/ui/size-converter.js'],
  'color-analysis': ['src/ui/common.js', 'src/lib/season-core.js', 'src/ui/color-analysis.js'],
  'capsule-wardrobe': ['src/ui/common.js', 'src/lib/color-core.js', 'src/lib/capsule-core.js', 'src/lib/garments.js', 'src/ui/capsule-wardrobe.js'],
  'outfit-generator': ['src/ui/common.js', 'src/lib/color-core.js', 'src/lib/outfit-core.js', 'src/lib/garments.js', 'src/ui/outfit-generator.js']
};

export const related = (id, n = 3) => TOOLS.filter((t) => t.id !== id).slice(0, n);
