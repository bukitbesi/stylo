// Hand-written styling notes for each of the 12 seasons. Palettes, neutrals and colors to avoid come from
// src/lib/season-core.js so the quiz and these pages always show the same colors.
export const SEASON_GUIDES = {
  'light-spring': {
    intro: 'Light Spring coloring is delicate and warm: light hair, light eyes and skin with a peachy or golden glow. Light, clear and warm colors such as peach, aqua, butter yellow and warm pink make it look fresh; heavy black and dark, cool shades overpower it.',
    metals: 'Light gold, rose gold and polished brass.',
    makeup: 'Peach or apricot blush, coral-pink or warm pink lips, soft brown or bronze liner instead of black.',
    hair: 'Golden blonde, honey, strawberry blonde or light golden brown.',
    outfits: ['Ivory tee, light camel trousers and a peach cardigan.', 'Aqua dress with nude sandals and light gold jewelry.', 'Soft navy blazer over a warm pink top with cream jeans.'],
    vs: ['light-summer', 'Both are light. Light Spring looks best in peach, cream and warm pink; Light Summer looks best in powder pink, lavender and soft cool white. If gold flatters you more than silver, you are more likely Light Spring.']
  },
  'warm-spring': {
    intro: 'Warm Spring is the warmest of the springs: golden or coppery hair, warm eyes and skin that tans golden. Clear, warm colors such as coral, turquoise, golden yellow and leaf green bring it to life; icy and dusty colors make it look tired.',
    metals: 'Yellow gold, brass and copper.',
    makeup: 'Coral or peach blush, coral, warm red or terracotta-pink lips, bronze and golden-brown eyeshadow.',
    hair: 'Golden brown, copper, strawberry blonde or warm auburn.',
    outfits: ['Camel trousers with a coral knit and tan loafers.', 'Turquoise blouse, cream midi skirt and gold hoops.', 'Golden-brown jacket over an ivory shirt and mid-blue jeans.'],
    vs: ['warm-autumn', 'Both are warm. Warm Spring suits brighter, clearer colors (coral, turquoise, golden yellow); Warm Autumn suits deeper, earthier ones (rust, olive, mustard).']
  },
  'bright-spring': {
    intro: 'Bright Spring has vivid, high-contrast coloring with a warm lean: clear eyes and hair noticeably darker than the skin. Saturated colors such as coral red, kelly green, bright aqua and warm pink match its intensity; muted and dusty shades look flat on it.',
    metals: 'Polished yellow gold; bright silver also works.',
    makeup: 'Clear coral-red or bright warm pink lips, peach-pink blush, defined dark-brown liner.',
    hair: 'Dark golden brown, chestnut or medium brown with clear contrast against the skin.',
    outfits: ['White jeans with a bright coral top and tan sandals.', 'Navy blazer over a kelly-green tee with dark jeans.', 'Bright aqua dress with gold jewelry and nude heels.'],
    vs: ['bright-winter', 'Both are bright. Bright Spring leans warm (coral, warm red, golden yellow); Bright Winter leans cool (fuchsia, icy blue, pure white).']
  },
  'light-summer': {
    intro: 'Light Summer coloring is soft, light and cool: ash-blonde or light ash-brown hair, light eyes and pink-toned skin. Light, cool, gently muted colors such as powder blue, lavender, rose pink and soft mint flatter it; black, orange and heavy dark colors overwhelm it.',
    metals: 'Silver, white gold and soft rose gold.',
    makeup: 'Rose or soft pink blush, pink or rosy-nude lips, gray-brown or soft taupe liner.',
    hair: 'Ash blonde, light ash brown, soft silver.',
    outfits: ['Powder-blue shirt with light gray trousers and white sneakers.', 'Lavender knit, soft white jeans and silver jewelry.', 'Dusty pink dress with a gray-blue cardigan.'],
    vs: ['light-spring', 'Both are light. Light Summer looks best in cool pastels and soft cool white; Light Spring looks best in peach, cream and warm pink. Silver usually flatters Light Summer more than gold.']
  },
  'cool-summer': {
    intro: 'Cool Summer is the coolest of the summers: medium depth, blue-pink undertones and soft rather than sharp contrast. Cool, medium colors such as slate blue, raspberry, rose, plum and soft teal suit it; orange, mustard and golden browns clash.',
    metals: 'Silver, pewter and white gold.',
    makeup: 'Berry or rose blush, raspberry, mauve or cool rose lips, gray or navy liner.',
    hair: 'Ash brown, cool medium brown, early silver gray.',
    outfits: ['Navy-gray suit, soft white shirt and a raspberry accent.', 'Slate-blue dress with silver jewelry and gray heels.', 'Rose sweater with charcoal trousers and black loafers.'],
    vs: ['cool-winter', 'Both are cool. Cool Summer suits softer, grayed colors (slate, rose, soft white); Cool Winter suits clearer, darker ones (true blue, magenta, stark white).']
  },
  'soft-summer': {
    intro: 'Soft Summer coloring is muted and cool-leaning: hair, eyes and skin blend together with low contrast. Gray-tinged colors such as dusty blue, sage gray, mauve and soft plum look harmonious; bright, saturated colors and pure black look harsh.',
    metals: 'Brushed silver, pewter and matte rose gold.',
    makeup: 'Dusty rose blush, mauve, rosewood or soft berry lips, taupe and gray-brown eyeshadow.',
    hair: 'Ash brown, mousy brown or dark ash blonde.',
    outfits: ['Gray-green knit with taupe trousers and gray suede shoes.', 'Dusty-blue shirt, charcoal trousers and a pewter watch.', 'Mauve dress with a soft gray coat.'],
    vs: ['soft-autumn', 'Both are soft. Soft Summer leans cool (dusty blue, mauve, gray); Soft Autumn leans warm (camel, sage, terracotta).']
  },
  'soft-autumn': {
    intro: 'Soft Autumn coloring is muted and warm-leaning, with low contrast and a gentle golden warmth. Earthy, softened colors such as camel, sage, olive, terracotta and warm taupe flatter it; black, bright pink and icy colors look harsh.',
    metals: 'Brushed gold, antique gold and bronze.',
    makeup: 'Terracotta or warm rose blush, nude-peach or soft brick lips, bronze and olive eyeshadow.',
    hair: 'Dark blonde, light to medium warm brown, soft auburn.',
    outfits: ['Camel coat, sage knit and cream trousers.', 'Khaki trench with a soft rust top and brown boots.', 'Oatmeal knit dress with tan boots and a gold pendant.'],
    vs: ['soft-summer', 'Both are soft. Soft Autumn suits warm, earthy muted colors; Soft Summer suits cool, gray-blue muted colors. Gold usually looks better than silver on Soft Autumn.']
  },
  'warm-autumn': {
    intro: 'Warm Autumn is the warmest season: golden, coppery or bronze coloring with medium-deep depth. Rich, earthy colors such as rust, mustard, olive, teal and chocolate glow on it; cool pastels and icy colors drain it.',
    metals: 'Yellow gold, bronze and copper.',
    makeup: 'Terracotta or warm peach blush, brick, cinnamon or warm brown lips, bronze and copper eyeshadow.',
    hair: 'Auburn, copper, golden brown or warm chestnut.',
    outfits: ['Olive trousers, mustard knit and brown leather boots.', 'Rust dress with a camel coat and gold jewelry.', 'Teal blouse with chocolate-brown trousers.'],
    vs: ['warm-spring', 'Both are warm. Warm Autumn suits deeper, earthier colors (rust, olive, mustard); Warm Spring suits brighter, clearer ones (coral, turquoise, golden yellow).']
  },
  'deep-autumn': {
    intro: 'Deep Autumn coloring is dark and warm: deep hair and eyes with warmth in the skin. Rich, deep colors such as chocolate, burgundy, forest green, deep teal and rust suit it; pale pastels and icy colors look washed out next to it.',
    metals: 'Antique gold, bronze and copper.',
    makeup: 'Deep peach or brick blush, brick red, deep berry-brown or chocolate lips, bronze and deep olive eyeshadow.',
    hair: 'Dark brown, black-brown with warmth, deep auburn.',
    outfits: ['Chocolate trousers with a burgundy knit.', 'Forest-green coat over camel separates.', 'Aubergine dress with antique-gold jewelry.'],
    vs: ['deep-winter', 'Both are deep. Deep Autumn leans warm (chocolate, olive, rust); Deep Winter leans cool with sharper contrast (black, pure white, sapphire, fuchsia).']
  },
  'deep-winter': {
    intro: 'Deep Winter coloring is dark, cool and high-contrast: deep hair and eyes with skin that looks clear next to them. Deep, cool and jewel colors such as black, pure white, emerald, sapphire, burgundy and true red suit it; beige, camel and muted earth tones look dull.',
    metals: 'Silver, platinum and white gold.',
    makeup: 'Cool berry or plum blush, true red, deep berry or plum lips, black or charcoal liner.',
    hair: 'Dark brown, black.',
    outfits: ['Black trousers, crisp white shirt and an emerald scarf.', 'Burgundy dress with black boots.', 'Navy coat over a sapphire knit and charcoal trousers.'],
    vs: ['deep-autumn', 'Both are deep. Deep Winter leans cool and high-contrast (black, white, sapphire); Deep Autumn leans warm and earthy (chocolate, olive, rust).']
  },
  'cool-winter': {
    intro: 'Cool Winter is the coolest of the winters: blue-pink undertones, clear contrast and medium to deep depth. Cool, clear colors such as true blue, icy blue, fuchsia, emerald and stark white flatter it; orange, camel and golden browns clash.',
    metals: 'Silver, platinum and white gold.',
    makeup: 'Cool pink or berry blush, blue-red, fuchsia or cool pink lips, gray or black liner.',
    hair: 'Dark ash brown, black, salt-and-pepper or silver.',
    outfits: ['Navy suit with an icy-blue shirt.', 'True-red dress with silver jewelry.', 'Charcoal trousers with a magenta knit.'],
    vs: ['cool-summer', 'Both are cool. Cool Winter suits clearer, darker colors (true blue, magenta, stark white); Cool Summer suits softer, grayed ones (slate, rose, soft white).']
  },
  'bright-winter': {
    intro: 'Bright Winter has the most vivid coloring of all: very clear eyes and strong contrast between hair and skin, with a cool lean. Saturated, icy and jewel colors such as fuchsia, cobalt, emerald, pure white and black match its intensity; dusty and earthy colors look flat.',
    metals: 'Polished silver, platinum and white gold.',
    makeup: 'Clear cool pink blush, true red, fuchsia or bright berry lips, defined black liner.',
    hair: 'Black or dark brown with strong contrast against the skin.',
    outfits: ['Black and white with a cobalt-blue jacket.', 'Emerald dress with silver jewelry.', 'White jeans with a hot-pink top and black sandals.'],
    vs: ['bright-spring', 'Both are bright. Bright Winter leans cool (fuchsia, icy blue, pure white); Bright Spring leans warm (coral, warm red, golden yellow).']
  }
};
