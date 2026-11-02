// Tool catalog: one record per live tool. Order = order on the home and tools pages.
export const TOOLS = [
  { id: 'dress-designer', name: 'Dress Designer', path: '/tools/dress-designer/', icon: 'dress',
    blurb: 'Design your own dress: neckline, sleeves, waist, skirt, length, color and print, or your own fabric photo. Download it as an image.' },
  { id: 'color-combination', name: 'Color Combination Finder', path: '/tools/color-combination/', icon: 'palette',
    blurb: 'Pick any clothing color and see the neutrals, accents and color-wheel combinations that go with it.' },
  { id: 'size-converter', name: 'International Size Converter', path: '/tools/size-converter/', icon: 'ruler',
    blurb: 'Convert shoe, dress, suit and shirt sizes between US, UK, EU and AU, with foot length in cm and inches.' },
  { id: 'color-analysis', name: 'Personal Color Analysis', path: '/tools/color-analysis/', icon: 'sparkle',
    blurb: 'Answer 8 quick questions to find your likely color season and your best colors and neutrals.' },
  { id: 'capsule-wardrobe', name: 'Capsule Wardrobe Planner', path: '/tools/capsule-wardrobe/', icon: 'hanger',
    blurb: "Build a 15, 25 or 35 piece women's or men's capsule with a printable checklist and outfit count." },
  { id: 'outfit-generator', name: 'Outfit Generator', path: '/tools/outfit-generator/', icon: 'shuffle',
    blurb: 'Get a complete outfit for the occasion, the temperature and the color you want to wear.' },
  { id: 'body-shape', name: 'Body Shape Calculator', path: '/tools/body-shape-calculator/', icon: 'figure',
    blurb: 'Enter bust, waist, high hip and hip measurements to find your body shape with the FFIT method, plus styling tips.' },
  { id: 'photo-palette', name: 'Photo Color Palette', path: '/tools/photo-color-palette/', icon: 'image',
    blurb: 'Upload an outfit or inspiration photo to see its main colors, their share, matching seasons and color guides.' },
  { id: 'ring-size', name: 'Ring Size Converter', path: '/tools/ring-size-converter/', icon: 'ring',
    blurb: 'Convert ring sizes between US, EU/ISO, inner diameter and circumference in millimeters.' },
  { id: 'cost-per-wear', name: 'Cost Per Wear Calculator', path: '/tools/cost-per-wear-calculator/', icon: 'coin',
    blurb: 'Compare two clothes by what each wear really costs, including care costs and resale value.' },
  { id: 'selfie-analysis', name: 'Selfie Color Analysis', path: '/tools/selfie-color-analysis/', icon: 'camera',
    blurb: 'Tap your skin, hair and eyes on a selfie and answer four undertone questions to find your color season. The photo stays on your phone.' },
  { id: 'wardrobe-colors', name: 'Wardrobe Color Checker', path: '/tools/wardrobe-color-checker/', icon: 'grid',
    blurb: 'Count the colors in your closet to see your neutral balance, how easily they combine and the best colors to buy next.' },
  { id: 'packing-list', name: 'Packing List Generator', path: '/tools/packing-list-generator/', icon: 'suitcase',
    blurb: 'Get a printable packing list sized to your trip: days, trip type, weather and laundry, with outfit count.' },
  { id: 'dress-code', name: 'Dress Code Guide', path: '/tools/dress-code-guide/', icon: 'bowtie',
    blurb: 'See exactly what to wear for white tie, black tie, cocktail, business and casual dress codes, for women and men.' }
];

// Bundle = UI helpers + engines + the tool's UI, in dependency order.
export const BUNDLES = {
  'color-combination': ['src/ui/common.js', 'src/lib/color-core.js', 'src/ui/color-combination.js'],
  'size-converter': ['src/ui/common.js', 'src/lib/size-core.js', 'src/ui/size-converter.js'],
  'color-analysis': ['src/ui/common.js', 'src/lib/season-core.js', 'src/ui/color-analysis.js'],
  'capsule-wardrobe': ['src/ui/common.js', 'src/lib/color-core.js', 'src/lib/capsule-core.js', 'src/lib/garments.js', 'src/ui/capsule-wardrobe.js'],
  'outfit-generator': ['src/ui/common.js', 'src/lib/color-core.js', 'src/lib/outfit-core.js', 'src/lib/garments.js', 'src/ui/outfit-generator.js'],
  'body-shape': ['src/ui/common.js', 'src/lib/body-core.js', 'src/ui/body-shape.js'],
  'photo-palette': ['src/ui/common.js', 'src/lib/color-core.js', 'src/lib/season-core.js', 'src/lib/palette-core.js', 'src/ui/photo-palette.js'],
  'ring-size': ['src/ui/common.js', 'src/lib/ring-core.js', 'src/ui/ring-size.js'],
  'cost-per-wear': ['src/ui/common.js', 'src/lib/cpw-core.js', 'src/ui/cost-per-wear.js'],
  'selfie-analysis': ['src/ui/common.js', 'src/lib/color-core.js', 'src/lib/season-core.js', 'src/lib/selfie-core.js', 'src/ui/color-analysis.js', 'src/ui/selfie-analysis.js'],
  'wardrobe-colors': ['src/ui/common.js', 'src/lib/color-core.js', 'src/lib/season-core.js', 'src/lib/palette-core.js', 'src/lib/wardrobe-core.js', 'src/ui/wardrobe-colors.js'],
  'packing-list': ['src/ui/common.js', 'src/lib/packing-core.js', 'src/lib/garments.js', 'src/ui/packing-list.js'],
  'dress-designer': ['src/ui/common.js', 'src/lib/color-core.js', 'src/lib/season-core.js', 'src/lib/palette-core.js', 'src/lib/dress-core.js', 'src/ui/dress-designer.js'],
  'dress-code': ['src/ui/common.js', 'src/lib/dresscode-core.js', 'src/lib/garments.js', 'src/ui/dress-code.js']
};

export const related = (id, n = 3) => TOOLS.filter((t) => t.id !== id).slice(0, n);
