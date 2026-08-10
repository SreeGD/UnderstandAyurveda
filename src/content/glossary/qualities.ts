import type { GlossaryTerm } from '../schema/glossary'
import { CHARAKA_SUTRA } from '../sources'

/**
 * The twenty gunas, as ten opposed pairs. Kept as glossary entries as well as
 * reference entries because lessons refer to them inline constantly, and gate C2
 * requires every inline [[term]] to resolve.
 */

const guna = (
  id: string,
  term: string,
  pronunciation: string,
  aliases: string[],
  meaning: string,
  example: string,
  partner: string
): GlossaryTerm => ({
  id,
  term,
  aliases,
  pronunciation,
  meaning,
  example,
  relatedTerms: [partner, 'guna'],
  taughtIn: ['twenty-gunas'],
  source: CHARAKA_SUTRA('1'),
})

export const qualityTerms: GlossaryTerm[] = [
  guna('guru', 'Guru', 'GOO-roo', ['heavy'],
    'Heavy — the quality of something that sits and stays with you.',
    'A cheese-heavy pasta at 9pm. You can still feel it at midnight.', 'laghu'),
  guna('laghu', 'Laghu', 'LUH-ghoo', ['light'],
    'Light — the quality of something easy to move and easy to process.',
    'A bowl of clear soup. You feel fed but not weighed down.', 'guru'),

  guna('sheeta', 'Sheeta', 'SHEE-tuh', ['shita', 'cold', 'cooling'],
    'Cold — cooling, slowing, contracting.',
    'Stepping into an air-conditioned room and immediately feeling your shoulders draw in.', 'ushna'),
  guna('ushna', 'Ushna', 'OOSH-nuh', ['hot', 'heating'],
    'Hot — warming, expanding, speeding up.',
    'A bowl of ginger broth on a cold day, and the flush that follows.', 'sheeta'),

  guna('snigdha', 'Snigdha', 'SNIG-dhuh', ['oily', 'unctuous', 'moist'],
    'Oily — lubricating, smoothing, softening.',
    'Olive oil on dry bread: it stops the crumbling.', 'ruksha'),
  guna('ruksha', 'Ruksha', 'ROOK-shuh', ['dry', 'rough', 'rooksha'],
    'Dry — absorbing, roughening, separating.',
    'A cracker versus that same olive-oiled bread. The difference in your mouth is the quality.', 'snigdha'),

  guna('manda', 'Manda', 'MUN-duh', ['slow', 'dull'],
    'Slow — unhurried, gradual, taking its time.',
    'A stew simmering for three hours.', 'tikshna'),
  guna('tikshna', 'Tikshna', 'TEEK-shnuh', ['sharp', 'penetrating', 'teekshna'],
    'Sharp — penetrating, quick-acting, incisive.',
    'A spoonful of hot mustard. It gets everywhere, immediately.', 'manda'),

  guna('sthira', 'Sthira', 'STHIR-uh', ['stable', 'static'],
    'Stable — steady, unmoving, reliable.',
    'A heavy oak table. You do not worry about it shifting.', 'chala'),
  guna('chala', 'Chala', 'CHUH-luh', ['mobile', 'moving', 'chal'],
    'Mobile — moving, shifting, changeable.',
    'A curtain in a draught. Never in quite the same position twice.', 'sthira'),

  guna('mridu', 'Mridu', 'MRI-doo', ['soft', 'mrudu'],
    'Soft — yielding, gentle, tender.',
    'A ripe peach.', 'kathina'),
  guna('kathina', 'Kathina', 'KUH-thin-uh', ['hard', 'kathin'],
    'Hard — firm, resistant, unyielding.',
    'An unripe pear.', 'mridu'),

  guna('vishada', 'Vishada', 'vih-SHAH-duh', ['clear', 'non-slimy'],
    'Clear — clean, non-sticky, leaving no residue.',
    'Water. It rinses away and leaves nothing behind.', 'picchila'),
  guna('picchila', 'Picchila', 'pih-CHEE-luh', ['slimy', 'sticky', 'cloudy'],
    'Slimy — sticky, coating, clinging.',
    'Okra when you cut it. It leaves a film on the knife.', 'vishada'),

  guna('shlakshna', 'Shlakshna', 'SHLUCK-shnuh', ['smooth', 'slakshna'],
    'Smooth — even, frictionless.',
    'A polished stone. Your thumb finds nothing to catch on.', 'khara'),
  guna('khara', 'Khara', 'KUH-ruh', ['rough'],
    'Rough — uneven, abrasive.',
    'Unfinished timber. Everything about it catches.', 'shlakshna'),

  guna('sukshma', 'Sukshma', 'SOOK-shmuh', ['subtle', 'fine', 'sukshm'],
    'Subtle — fine, able to reach into small spaces.',
    'The smell of coffee reaching a room upstairs.', 'sthula'),
  guna('sthula', 'Sthula', 'STHOO-luh', ['gross', 'bulky', 'sthul'],
    'Gross — bulky, obvious, occupying space.',
    'The sack of coffee beans that the smell came from.', 'sukshma'),

  guna('sandra', 'Sandra', 'SUN-druh', ['dense', 'solid'],
    'Dense — thick, compact, concentrated.',
    'Cold honey.', 'drava'),
  guna('drava', 'Drava', 'DRUH-vuh', ['liquid', 'flowing'],
    'Liquid — flowing, spreading, taking the shape of its container.',
    'That same honey warmed until it pours.', 'sandra'),
]
