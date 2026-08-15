import type { Spice } from '../types';

export const spices: Spice[] = [
  {
    id: 'black-pepper',
    name: 'Black Pepper',
    nativeName: 'काली मिर्च · Kurumulaku',
    rasa: 'katu',
    compound: 'Piperine',
    effect:
      'A slow, back-of-throat heat that arrives after the swallow rather than on contact. Piperine also blocks a liver enzyme pathway, which is why pepper measurably raises the absorption of other compounds eaten with it — turmeric especially.',
    lore:
      'Native to the Malabar coast and traded to Rome by the first century CE, when Pliny the Elder complained about the drain of Roman gold to India. It was pepper that brought Vasco da Gama to Calicut in 1498 and, with him, four centuries of European presence on the coast.',
    color: '#3b2d21',
    wikipedia: 'https://en.wikipedia.org/wiki/Black_pepper',
  },
  {
    id: 'long-pepper',
    name: 'Long Pepper',
    nativeName: 'पिप्पली · Pippali',
    rasa: 'katu',
    compound: 'Piperine & piperlongumine',
    effect:
      'Hotter and sweeter than black pepper, with a numbing tail. Ayurveda treats it as a vahana — a carrier that drags other medicines deeper — and it is one third of trikatu, the classic pepper-pepper-ginger formula.',
    lore:
      'The spice Europe actually meant for most of antiquity: Greek and Roman texts price piperi longum above round pepper. It faded from Western kitchens once chilli arrived, but never left Ayurvedic pharmacies or Northeast Indian cooking.',
    color: '#5a4230',
    wikipedia: 'https://en.wikipedia.org/wiki/Long_pepper',
  },
  {
    id: 'chilli',
    name: 'Chilli',
    nativeName: 'लाल मिर्च · Milagai',
    rasa: 'katu',
    compound: 'Capsaicin',
    effect:
      'Not a taste at all — capsaicin binds TRPV1, the same receptor that reports actual heat, so the brain is told the mouth is burning. It is oil-soluble, which is why yoghurt and coconut milk quench it and water does not.',
    lore:
      'A South American plant that reached India with Portuguese ships in the 1500s, most likely landing first around Goa. Within two centuries it had displaced pepper as the everyday heat of Indian cooking — meaning the "ancient fiery curry" is a post-Columbian invention.',
    color: '#c0281b',
    wikipedia: 'https://en.wikipedia.org/wiki/Chili_pepper',
  },
  {
    id: 'bhut-jolokia',
    name: 'Bhut Jolokia',
    nativeName: 'ভূত জলকীয়া · Umorok / Raja mircha',
    rasa: 'katu',
    compound: 'Capsaicin (over 1,000,000 SHU)',
    effect:
      'A delayed detonation — the burn peaks thirty seconds late and lasts. In Northeast kitchens it is used raw and whole, crushed into fermented pastes, not fried into masala.',
    lore:
      'Grown across Assam, Nagaland and Manipur, it was certified the world\'s hottest chilli by Guinness World Records in 2007 at just over a million Scoville units. Its heat is a natural hybrid trait: it is a cross between Capsicum chinense and Capsicum frutescens.',
    color: '#8f1d10',
    wikipedia: 'https://en.wikipedia.org/wiki/Bhut_jolokia',
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    nativeName: 'हल्दी · Manjal',
    rasa: 'kashaya',
    compound: 'Curcumin',
    effect:
      'Earthy, faintly bitter and drying — an astringent more than a flavouring. Its real job in a pot is colour and preservation; used raw and fresh it tastes closer to carrot and pine.',
    lore:
      'Cultivated in India for well over two thousand years and inseparable from ritual — smeared on brides, on doorframes, on newborns. In 1995 a US patent was granted on turmeric for wound healing; India\'s CSIR had it revoked in 1997 by producing ancient Sanskrit and Urdu texts as prior art.',
    color: '#e0a41c',
    wikipedia: 'https://en.wikipedia.org/wiki/Turmeric',
  },
  {
    id: 'asafoetida',
    name: 'Asafoetida',
    nativeName: 'हींग · Perungayam',
    rasa: 'katu',
    compound: 'Sulphur compounds & ferulic acid esters',
    effect:
      'Vile raw, savoury the instant it hits hot fat — a pinch bloomed in ghee reads as onion and garlic at once. It is the reason Jain and Brahmin kitchens can cook without either.',
    lore:
      'Tapped from the root of Ferula plants in Iran and Afghanistan and imported into India for centuries; almost none was grown here until trial plantations in Himachal Pradesh from 2020. The compounded lump sold in Indian shops is mostly gum and wheat flour — the resin itself is too fierce to use neat.',
    color: '#c9982f',
    wikipedia: 'https://en.wikipedia.org/wiki/Asafoetida',
  },
  {
    id: 'mustard',
    name: 'Mustard',
    nativeName: 'सरसों / राई · Kadugu',
    rasa: 'katu',
    compound: 'Sinigrin → allyl isothiocyanate',
    effect:
      'Nasal heat, not tongue heat. Sinigrin is odourless until the seed is crushed with water and myrosinase releases the isothiocyanate — which is why a Bengali mustard paste must be ground wet, with salt and a green chilli to keep it from turning bitter.',
    lore:
      'Mustard oil is the defining fat of Bengal, Odisha, Assam and much of the north, pungent because it is cold-pressed rather than refined. In the south the same seed is used differently: popped whole in hot oil for tadka, where heat destroys the sharpness and leaves nuttiness.',
    color: '#d8b52a',
    wikipedia: 'https://en.wikipedia.org/wiki/Mustard_seed',
  },
  {
    id: 'cumin',
    name: 'Cumin',
    nativeName: 'जीरा · Jeeragam',
    rasa: 'katu',
    compound: 'Cuminaldehyde',
    effect:
      'Warm and slightly bitter cold; nutty and sweet once toasted, because heat drives off harsher terpenes. The single most common first thing to hit oil in an Indian pan.',
    lore:
      'An Old World spice found in Bronze Age Levantine and Egyptian sites and long naturalised in India — Rajasthan and Gujarat now grow most of the world\'s supply. Confusing it with caraway in translation is why old European recipes for "Indian" food often taste wrong.',
    color: '#8b6a3c',
    wikipedia: 'https://en.wikipedia.org/wiki/Cumin',
  },
  {
    id: 'cardamom',
    name: 'Green Cardamom',
    nativeName: 'इलायची · Elakkai',
    rasa: 'madhura',
    compound: '1,8-cineole & α-terpinyl acetate',
    effect:
      'Cooling, camphorous sweetness that reads as dessert in India and as coffee in Arabia. It sits in both the sweet pot and the biryani pot without contradiction.',
    lore:
      'Native to the Western Ghats — the Cardamom Hills of Kerala are named for it — and second only to saffron and vanilla in price by weight. Arab traders carried it west along the same routes as pepper, which is why gahwa in the Gulf tastes of a Kerala hillside.',
    color: '#7fa64f',
    wikipedia: 'https://en.wikipedia.org/wiki/Cardamom',
  },
  {
    id: 'clove',
    name: 'Clove',
    nativeName: 'लौंग · Grambu',
    rasa: 'katu',
    compound: 'Eugenol',
    effect:
      'Sweet, medicinal and genuinely anaesthetic — eugenol numbs, which is why a clove pressed against a toothache works. One too many will flatten a whole pot.',
    lore:
      'Native not to India but to five tiny islands in the Moluccas, and the object of a Dutch monopoly enforced by destroying trees elsewhere. It entered Indian cooking through the spice trade and settled permanently in garam masala and biryani.',
    color: '#6b3a1e',
    wikipedia: 'https://en.wikipedia.org/wiki/Clove',
  },
  {
    id: 'fennel',
    name: 'Fennel',
    nativeName: 'सौंफ · Perunjeeragam',
    rasa: 'madhura',
    compound: 'Anethole',
    effect:
      'Sweet anise, cooling on the finish. Anethole is roughly thirteen times sweeter than sugar by perception, which is why plain roasted fennel works as an after-dinner mouth freshener with nothing added.',
    lore:
      'Central to Kashmiri cooking, where ground fennel and dry ginger replace the onion and garlic that Kashmiri Pandit kitchens avoid. In the south it is the aromatic backbone of Chettinad masala; in the north it is what you are handed with the bill.',
    color: '#9fbd5c',
    wikipedia: 'https://en.wikipedia.org/wiki/Fennel',
  },
  {
    id: 'fenugreek',
    name: 'Fenugreek',
    nativeName: 'मेथी · Vendhayam',
    rasa: 'tikta',
    compound: 'Sotolon & trigonelline',
    effect:
      'Bitter as a seed, maple-sweet in aroma — sotolon is the same molecule that makes maple syrup smell like maple syrup, and it is excreted, which is why fenugreek shows up in sweat and breast milk.',
    lore:
      'Grown in India since antiquity for leaf, seed and sprout; the leaf is a vegetable in Gujarat and Punjab, the seed a souring-bittering agent in south Indian sambar powder and Bengali panch phoron. Excavations at Bronze Age sites in the Near East have turned up charred seeds.',
    color: '#a58b32',
    wikipedia: 'https://en.wikipedia.org/wiki/Fenugreek',
  },
  {
    id: 'curry-leaf',
    name: 'Curry Leaf',
    nativeName: 'कढ़ी पत्ता · Karuveppilai',
    rasa: 'tikta',
    compound: 'Sabinene & caryophyllene',
    effect:
      'Citrus-bitter, and only released when the fresh leaf hits hot oil — dried curry leaf is nearly inert. The single most recognisable smell of a south Indian kitchen at seven in the morning.',
    lore:
      'A tree, Murraya koenigii, unrelated to anything in a jar of curry powder; the English word "curry" comes from the Tamil kari, meaning a sauced dish, not from this leaf. Households across the south keep one growing by the door.',
    color: '#2f6b39',
    wikipedia: 'https://en.wikipedia.org/wiki/Curry_tree',
  },
  {
    id: 'ginger',
    name: 'Ginger',
    nativeName: 'अदरक / सोंठ · Inji',
    rasa: 'katu',
    compound: 'Gingerol → shogaol',
    effect:
      'Bright and sinus-clearing when fresh; hotter and rounder when dried, because gingerol dehydrates into shogaol, which is markedly more pungent. Fresh and dried ginger are effectively two different spices.',
    lore:
      'One of the oldest cultivated spices in India and among the first traded west — Kerala still exports much of the world\'s dry ginger. Ayurveda calls it vishwabheshaja, the universal medicine, and prescribes it for exactly the digestive complaints modern trials keep testing it against.',
    color: '#c9a15b',
    wikipedia: 'https://en.wikipedia.org/wiki/Ginger',
  },
  {
    id: 'garlic',
    name: 'Garlic',
    nativeName: 'लहसुन · Poondu',
    rasa: 'katu',
    compound: 'Allicin',
    effect:
      'Allicin does not exist in an intact clove — crushing ruptures cells and lets alliinase convert alliin into it within seconds. Chop and wait, and it is sharp; roast whole, and it turns sweet and nutty.',
    lore:
      'Prohibited in Jain, many Brahmin and most temple kitchens as rajasic-tamasic — food that agitates the mind — which is precisely why asafoetida became indispensable. Elsewhere it is a headline act: Kolhapur\'s kanda-lasun masala is built on it.',
    color: '#e6dcc2',
    wikipedia: 'https://en.wikipedia.org/wiki/Garlic',
  },
  {
    id: 'tamarind',
    name: 'Tamarind',
    nativeName: 'इमली · Puli',
    rasa: 'amla',
    compound: 'Tartaric acid',
    effect:
      'Deep, fruity sourness with a sweet undertow, and unusually stable in heat — it can be simmered for an hour without going flat, unlike lemon. The spine of rasam, sambar and pitlai.',
    lore:
      'Despite the name — Arabic tamr hindi, "date of India" — the tree came from tropical Africa and was naturalised here so long ago that Sanskrit texts treat it as native. It travelled onward to Mexico with Spanish ships, where it is now a national flavour.',
    color: '#7a3f22',
    wikipedia: 'https://en.wikipedia.org/wiki/Tamarind',
  },
  {
    id: 'kokum',
    name: 'Kokum',
    nativeName: 'कोकम · Bhirand',
    rasa: 'amla',
    compound: 'Hydroxycitric acid & garcinol',
    effect:
      'Clean, cool sourness with none of tamarind\'s sweetness, and a deep purple-pink stain. It sours without thickening, which is why sol kadhi stays drinkable.',
    lore:
      'Garcinia indica grows only along the Western Ghats and the Konkan; the rind is sun-dried in salt and keeps a year. Konkani cooks reach for it in the monsoon specifically because it is cooling, in a season when the food is otherwise fried.',
    color: '#8e2a4a',
    wikipedia: 'https://en.wikipedia.org/wiki/Garcinia_indica',
  },
  {
    id: 'kudampuli',
    name: 'Kudampuli',
    nativeName: 'കുടംപുളി · Malabar tamarind',
    rasa: 'amla',
    compound: 'Hydroxycitric acid',
    effect:
      'Smoky and resinously sour — the rind is smoke-dried, so it seasons a fish curry twice over. Kerala fish curries use it and not tamarind, because it also keeps the pot from spoiling in humidity.',
    lore:
      'Garcinia gummi-gutta, a Western Ghats endemic, briefly became a global weight-loss supplement on the strength of its hydroxycitric acid — evidence for which is thin. In Kerala it has been the standard fish souring agent for centuries.',
    color: '#4a2a1c',
    wikipedia: 'https://en.wikipedia.org/wiki/Garcinia_gummi-gutta',
  },
  {
    id: 'amchur',
    name: 'Amchur',
    nativeName: 'अमचूर · Dried mango powder',
    rasa: 'amla',
    compound: 'Citric & tartaric acids',
    effect:
      'Sourness with no liquid attached — which is the point. It sours a dry sabzi, a stuffed paratha or a chaat where adding lemon juice would turn everything soggy.',
    lore:
      'Made from unripe mangoes shed in the summer storms and otherwise wasted, sliced and sun-dried on north Indian rooftops before being milled. It is thrift turned into a pantry staple, and it is why the north tastes sour in a completely different register from the south.',
    color: '#c8a55e',
    wikipedia: 'https://en.wikipedia.org/wiki/Amchoor',
  },
  {
    id: 'kala-namak',
    name: 'Black Salt',
    nativeName: 'काला नमक · Kala namak',
    rasa: 'lavana',
    compound: 'Sodium chloride with iron sulphides & hydrogen sulphide',
    effect:
      'Salt that smells of boiled egg. The sulphur compounds formed during kiln-firing give it a savoury funk that turns cut fruit into chaat and is now used worldwide to make vegan food taste of egg.',
    lore:
      'Rock salt from the Himalayan foothills, traditionally fired in a sealed kiln with charcoal, harad seeds and bark, which reduces the sulphates to sulphides. Ayurveda classes it separately from sea salt and considers it the more digestible of the two.',
    color: '#6d5a6b',
    wikipedia: 'https://en.wikipedia.org/wiki/Kala_namak',
  },
  {
    id: 'neem',
    name: 'Neem Flower',
    nativeName: 'नीम · Veppampoo',
    rasa: 'tikta',
    compound: 'Nimbin & azadirachtin',
    effect:
      'Bitterness with no sweetness anywhere behind it — a clean, medicinal drying of the mouth. Dry-roasted in ghee it turns nutty enough to eat by the spoon in a Tamil rasam.',
    lore:
      'The neem tree is planted for shade, chewed as a toothbrush, and its extract used as a field pesticide; a 1994 European patent on neem\'s fungicidal use was revoked in 2000 after a decade-long challenge citing traditional Indian practice.',
    color: '#3d6b3a',
    wikipedia: 'https://en.wikipedia.org/wiki/Azadirachta_indica',
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon & Cassia',
    nativeName: 'दालचीनी · Karuvapatta',
    rasa: 'madhura',
    compound: 'Cinnamaldehyde',
    effect:
      'Sweet-warm without sugar; the bark most Indian kitchens actually use is cassia, thicker and blunter than true Ceylon cinnamon, and it stands up better to a long-simmered gravy.',
    lore:
      'For centuries Arab traders protected their source with stories of giant birds nesting on cinnamon cliffs — a deliberate misdirection recorded by Herodotus. The real supply lines ran through Sri Lanka and the Malabar coast, and control of them helped pull the Portuguese and Dutch into the Indian Ocean.',
    color: '#8a4a24',
    wikipedia: 'https://en.wikipedia.org/wiki/Cinnamon',
  },
];
