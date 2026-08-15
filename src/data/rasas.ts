import type { Rasa } from '../types';

/**
 * The Shadrasa — six tastes named in the Charaka Samhita and Sushruta Samhita.
 * A complete Ayurvedic meal is expected to carry all six, in order:
 * sweet first, astringent last.
 *
 * The `zone` coordinates are an artistic layout, not physiology.
 * The famous "tongue map" of separate taste regions is a debunked myth.
 */
export const rasas: Rasa[] = [
  {
    id: 'madhura',
    sanskrit: 'मधुर',
    name: 'Madhura',
    english: 'Sweet',
    elements: 'Earth + Water',
    tagline: 'The first taste, and the one that builds you.',
    description:
      'Madhura is not confectionery — it is rice, wheat, milk, ghee, ripe fruit and jaggery, the taste that carries bulk and nourishment. In classical order it is eaten first, when hunger is sharpest and digestion strongest. Indian sweets are milk-solid and grain territory, not butter-and-cream territory.',
    doctrine:
      'Made of earth and water, madhura is heavy, cooling and unctuous. Charaka calls it the builder of the seven dhatus — plasma, blood, flesh, fat, bone, marrow and reproductive tissue — and the taste that lengthens life and soothes the throat. Taken in excess it breeds heaviness, lethargy and obstruction.',
    dosha: 'Pacifies vata and pitta · aggravates kapha',
    mythBuster:
      'That Indian dessert is "sickly sweet". Most classical Indian sweets are engineered around milk protein and cardamom, not sugar alone — nolen gur, chhena and khoya are the flavour, sugar is the vehicle.',
    carriers: ['Jaggery (gur)', 'Milk & khoya', 'Ghee', 'Rice', 'Coconut', 'Ripe mango', 'Cardamom'],
    color: { base: '#f0a830', light: '#ffe0ac', deep: '#a35f10', ink: '#4a2a05' },
    zone: { x: 50, y: 11, r: 15, zoom: 1.72 },
  },
  {
    id: 'amla',
    sanskrit: 'अम्ल',
    name: 'Amla',
    english: 'Sour',
    elements: 'Earth + Fire',
    tagline: 'India has a dozen ways to be sour, and no two agree.',
    description:
      'Amla is the taste that makes a meal legible — it cuts fat, wakes the tongue and tells you where you are. Kokum on the Konkan, kudampuli in Kerala, tamarind across the Deccan, elephant apple and lemon in Assam, amchur in the north, palm vinegar in Goa. Change the souring agent and you have changed the state.',
    doctrine:
      'Earth kindled by fire: amla is heating, light and moistening. Classical texts credit it with lighting agni (digestive fire), moving stagnant food downward and making the mouth water before the first bite. In excess it is said to slacken the body, loosen teeth and inflame the blood.',
    dosha: 'Pacifies vata · aggravates pitta and kapha',
    mythBuster:
      'That sourness in Indian food means vinegar or lemon. Both are late arrivals in most kitchens — the older, indigenous sours are dried fruit rinds, fermented rice water and unripe mango, chosen for how long they keep in heat.',
    carriers: ['Tamarind', 'Kokum', 'Kudampuli', 'Raw mango & amchur', 'Yoghurt', 'Fermented rice water', 'Gongura'],
    color: { base: '#a8c83c', light: '#e4f2ae', deep: '#5f7a18', ink: '#2c3a06' },
    zone: { x: 78, y: 30, r: 13, zoom: 1.82 },
  },
  {
    id: 'lavana',
    sanskrit: 'लवण',
    name: 'Lavana',
    english: 'Salty',
    elements: 'Water + Fire',
    tagline: 'The only taste that makes every other taste louder.',
    description:
      'Lavana is the smallest rasa by volume and the largest by consequence — it is the amplifier. India rarely uses one salt: rock salt from the Salt Range, black salt fired with charcoal until it smells of sulphur, sea salt from the Rann and the Coromandel pans, and in the Northeast the alkaline ash-water khar that stands in for salt entirely.',
    doctrine:
      'Water and fire together: lavana is heating, heavy and unctuous, and is said to dissolve blockages, soften tissue and provoke salivation and appetite. Charaka warns that excess salt causes wrinkling, greying and thirst — a strikingly early note on what too much sodium does.',
    dosha: 'Pacifies vata · aggravates pitta and kapha',
    mythBuster:
      'That salt is neutral background. In India it is a flavour with its own vocabulary — kala namak tastes of egg because of sulphur compounds formed in the kiln, and a pinch of it turns fruit into chaat.',
    carriers: ['Kala namak', 'Sendha namak (rock salt)', 'Sea salt', 'Fermented fish (ngari, shidal)', 'Salted pickles', 'Khar (alkali)'],
    color: { base: '#7fb2d9', light: '#dceaf7', deep: '#3a6d96', ink: '#10293c' },
    zone: { x: 22, y: 30, r: 13, zoom: 1.82 },
  },
  {
    id: 'katu',
    sanskrit: 'कटु',
    name: 'Katu',
    english: 'Pungent',
    elements: 'Fire + Air',
    tagline: 'One taste out of six. The world thinks it is the whole cuisine.',
    description:
      'Katu is heat, but heat has a history. Before the Portuguese landed chillies on the Malabar coast in the 1500s, Indian pungency meant black pepper, long pepper, ginger, mustard and asafoetida — sharp, aromatic, nasal heat rather than the front-of-mouth burn of capsaicin. Both still coexist in the same spice box.',
    doctrine:
      'Fire and air: katu is hot, light and drying. It is credited with scraping fat, clearing the channels, opening the sinuses and stoking digestion; in excess it depletes tissue, causes tremor and burns the throat. It is the classical remedy for kapha and the classical enemy of pitta.',
    dosha: 'Pacifies kapha · aggravates pitta and vata',
    mythBuster:
      'That "Indian food is spicy" is a description of Indian food. Katu is one rasa of six, and the word "curry" is not Indian at all — it is an English fossil of the Tamil kari, flattened by colonial cookbooks into a single powder no Indian kitchen keeps.',
    carriers: ['Black pepper', 'Long pepper (pippali)', 'Chilli', 'Mustard', 'Ginger', 'Asafoetida', 'Garlic'],
    color: { base: '#e14434', light: '#ffc7bd', deep: '#8e1f14', ink: '#400b06' },
    zone: { x: 50, y: 50, r: 16, zoom: 1.66 },
  },
  {
    id: 'tikta',
    sanskrit: 'तिक्त',
    name: 'Tikta',
    english: 'Bitter',
    elements: 'Air + Ether',
    tagline: 'Not a flaw to be masked. A course to be served first.',
    description:
      'Bitter is the rasa the rest of the world cooks out and India cooks in. Bengal opens a meal with shukto so the palate is cleaned before rice; Tamil kitchens simmer bitter gourd into pitlai; the Deccan eats neem flowers on new year to swallow the year\'s sorrow deliberately. Bitterness is understood as medicine you enjoy.',
    doctrine:
      'Air and ether make tikta the lightest, coolest and driest of the six. It is the great detoxifier of the classical texts — antipyretic, appetite-restoring, drying to fat and lymph, clarifying to the skin. Overdone it emaciates, dries and unsettles vata.',
    dosha: 'Pacifies pitta and kapha · aggravates vata',
    mythBuster:
      'That bitterness is a mistake in the pot. In India it is a designed first course — and no other major cuisine has quite so many bitter vegetables in daily use: karela, methi, neem, fern fronds, jute leaf, drumstick leaf.',
    carriers: ['Bitter gourd (karela)', 'Fenugreek leaf', 'Neem flower', 'Turmeric root', 'Fern fronds', 'Curry leaf'],
    color: { base: '#4a8f5f', light: '#c3e6cd', deep: '#235c37', ink: '#0d2716' },
    zone: { x: 50, y: 88, r: 14, zoom: 1.76 },
  },
  {
    id: 'kashaya',
    sanskrit: 'कषाय',
    name: 'Kashaya',
    english: 'Astringent',
    elements: 'Air + Earth',
    tagline: 'The taste that is really a texture — the mouth drawing tight.',
    description:
      'Kashaya is not flavour so much as sensation: tannins binding to salivary proteins so the mouth puckers and dries. Unripe banana, jamun, betel leaf, black tea, turmeric, sprouted moth beans, lentils, pomegranate rind. Classical order puts it last, to close the meal and seal the palate.',
    doctrine:
      'Air and earth: kashaya is cooling, drying and heavy-yet-rough. It is described as samgrahi — it binds, absorbs, stops bleeding and firms tissue, which is why astringent foods sit at the end of a feast. Excess causes constipation, stiffness and speech that comes out dry.',
    dosha: 'Pacifies pitta and kapha · aggravates vata',
    mythBuster:
      'That Western taste science covers Indian eating. English has no everyday word for kashaya — it is a mouthfeel, not one of the five receptor tastes — yet Ayurveda catalogued it as a full rasa roughly two thousand years before umami was named in 1908.',
    carriers: ['Raw banana & plantain', 'Jamun', 'Betel leaf', 'Turmeric', 'Sprouted moth bean', 'Lentils', 'Bamboo shoot'],
    color: { base: '#9a6ec4', light: '#e2d4f4', deep: '#5c3b86', ink: '#2a1745' },
    zone: { x: 79, y: 68, r: 12, zoom: 1.86 },
  },
];
