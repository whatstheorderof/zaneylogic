export const RANKS = [
  { name: "Rookie", min: 0 },
  { name: "Detective", min: 3 },
  { name: "Inspector", min: 12 },
  { name: "Chief Inspector", min: 30 },
  { name: "Legend", min: 75 }
];

export const PACKS = [
  {
    id: "museum-robbery",
    name: "Museum robbery",
    object: "the vanished exhibit",
    intro: "A private viewing ended with a priceless piece missing from its case.",
    ending: "The exhibit is returned before the morning papers can turn the theft into folklore.",
    suspects: ["Mara Vale", "Theo Finch", "Priya Stone", "Otis Reed"],
    locations: ["Sculpture Hall", "Archive", "Roof Garden", "Loading Dock"],
    evidence: ["Silver Key", "Torn Glove", "Blue Thread", "Ticket Stub"],
    times: ["8:10 PM", "8:25 PM", "8:40 PM", "8:55 PM"]
  },
  {
    id: "haunted-mansion",
    name: "Haunted mansion",
    object: "the missing heirloom",
    intro: "Thunder rattled the windows as an heirloom vanished from a locked parlor.",
    ending: "The old house quiets down once the human trick is separated from the ghost story.",
    suspects: ["Iris Hollow", "Bram Vale", "Nell Ash", "Corin Pike"],
    locations: ["Blue Parlor", "West Stair", "Attic Door", "Garden Crypt"],
    evidence: ["Wax Seal", "Candle Stub", "Mud Print", "Loose Button"],
    times: ["Midnight", "12:15 AM", "12:30 AM", "12:45 AM"]
  },
  {
    id: "space-station",
    name: "Space station",
    object: "the missing nav chip",
    intro: "The station drifted off schedule after a navigation chip disappeared during docking.",
    ending: "The crew gets its orbit back after the hidden chip is logged and sealed.",
    suspects: ["Nova Chen", "Rafi Sol", "Juno Vex", "Pax Orion"],
    locations: ["Airlock", "Hydroponics", "Med Bay", "Observation"],
    evidence: ["Access Card", "Ion Dust", "Tool Clip", "Data Wafer"],
    times: ["Cycle 04", "Cycle 05", "Cycle 06", "Cycle 07"]
  },
  {
    id: "pirates",
    name: "Pirates",
    object: "the captain's map",
    intro: "The captain's map vanished while the crew argued over a storm-dark horizon.",
    ending: "The map is recovered before the wrong island becomes a very expensive mistake.",
    suspects: ["Red Nell", "Bosun Pike", "Milo Reef", "Captain Voss"],
    locations: ["Gun Deck", "Galley", "Crow's Nest", "Cargo Hold"],
    evidence: ["Brass Compass", "Rope Fiber", "Ink Smudge", "Pearl Bead"],
    times: ["First Bell", "Second Bell", "Third Bell", "Fourth Bell"]
  },
  {
    id: "school-mystery",
    name: "School mystery",
    object: "the missing mascot",
    intro: "The school mascot disappeared minutes before the assembly began.",
    ending: "The mascot reappears, and the assembly gets a much better story than expected.",
    suspects: ["Ava Brooks", "Miles Hart", "Sami Patel", "Lena Fox"],
    locations: ["Science Lab", "Gym", "Library", "Art Room"],
    evidence: ["Paint Fleck", "Hall Pass", "Snack Wrapper", "Glitter Trail"],
    times: ["8:05 AM", "8:15 AM", "8:25 AM", "8:35 AM"]
  },
  {
    id: "lost-treasure",
    name: "Lost treasure",
    object: "the buried locket",
    intro: "A treasure marker was moved before the expedition could verify the final dig site.",
    ending: "The map, marker, and locket finally agree on the same patch of ground.",
    suspects: ["June Rivers", "Cal Moss", "Vera Quill", "Hugo Flint"],
    locations: ["Old Well", "Cedar Trail", "Stone Arch", "Dry Creek"],
    evidence: ["Broken Spade", "Amber Chip", "Compass Note", "Red Ribbon"],
    times: ["Dawn", "Late Morning", "Noon", "Dusk"]
  },
  {
    id: "fantasy-kingdom",
    name: "Fantasy kingdom",
    object: "the queen's signet",
    intro: "A royal signet vanished during a feast filled with music, masks, and whispered wagers.",
    ending: "The court can breathe again once the signet returns to the queen's hand.",
    suspects: ["Sir Rowan", "Mage Elia", "Pip Thorn", "Lady Mira"],
    locations: ["Great Hall", "Moon Tower", "Rose Court", "Armory"],
    evidence: ["Rune Shard", "Velvet Thread", "Gold Feather", "Burnt Note"],
    times: ["First Course", "Bell Song", "Mask Dance", "Moonrise"]
  },
  {
    id: "spy-mission",
    name: "Spy mission",
    object: "the stolen cipher",
    intro: "A cipher changed hands during a gala where every smile had a second meaning.",
    ending: "The cipher is recovered before the midnight transmission goes live.",
    suspects: ["Agent Kestrel", "Mina Cross", "Duke Vale", "Eli Shade"],
    locations: ["Balcony", "Coat Room", "Wine Cellar", "Service Lift"],
    evidence: ["Red Umbrella", "Microdot", "Cufflink", "Matchbook"],
    times: ["9:00 PM", "9:12 PM", "9:24 PM", "9:36 PM"]
  },
  {
    id: "wildlife-reserve",
    name: "Wildlife reserve",
    object: "the missing tracker",
    intro: "A wildlife tracker went missing just as a protected animal crossed the reserve.",
    ending: "The tracker is recovered and the reserve gets its migration data back.",
    suspects: ["Rhea Park", "Owen Reed", "Tala Moss", "Benji Vale"],
    locations: ["North Blind", "River Bend", "Ranger Shed", "Baobab Trail"],
    evidence: ["Boot Cast", "Seed Pod", "Camera Strap", "Green Tag"],
    times: ["Sunrise", "10:00 AM", "2:00 PM", "Sunset"]
  },
  {
    id: "detective-agency",
    name: "Detective agency",
    object: "the client file",
    intro: "A client file disappeared from the agency before anyone could open the safe.",
    ending: "The file returns to the drawer with one very useful fingerprint attached.",
    suspects: ["Nora Case", "Felix Gray", "Tess Vale", "Arlo Quinn"],
    locations: ["Front Desk", "Records", "Interview Room", "Back Alley"],
    evidence: ["Coffee Ring", "Envelope", "Key Tag", "Ink Pad"],
    times: ["4:05 PM", "4:20 PM", "4:35 PM", "4:50 PM"]
  }
];

export function dailySeed(date = new Date()) {
  const start = Date.UTC(2026, 0, 1);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return ((Math.floor((today - start) / 86400000) % 5000) + 5000) % 5000 + 1;
}

export function buildPuzzle(seedInput = 1, preferredPackId = "") {
  const seed = normalizeSeed(seedInput);
  const rng = mulberry32(hashString(String(seed)));
  const pack = preferredPackId
    ? PACKS.find((item) => item.id === preferredPackId) ?? PACKS[seed % PACKS.length]
    : PACKS[seed % PACKS.length];
  const suspects = shuffle(pack.suspects, rng);
  const locations = shuffle(pack.locations, rng);
  const evidence = shuffle(pack.evidence, rng);
  const times = shuffle(pack.times, rng);
  const categories = [
    { name: "Suspects", key: "suspects", items: suspects },
    { name: "Locations", key: "locations", items: locations },
    { name: "Evidence", key: "evidence", items: evidence },
    { name: "Times", key: "times", items: times }
  ];
  const culpritIndex = Math.floor(rng() * suspects.length);
  const assignment = {};

  suspects.forEach((suspect, index) => {
    assignment[suspect] = {
      Locations: locations[index],
      Evidence: evidence[index],
      Times: times[index]
    };
  });

  const culprit = suspects[culpritIndex];
  const solution = {
    culprit,
    location: assignment[culprit].Locations,
    evidence: assignment[culprit].Evidence,
    time: assignment[culprit].Times
  };

  const title = `${titleCase(pack.name)}: ${caseTitle(pack, seed, culpritIndex)}`;
  const id = `ZL-${String(seed).padStart(5, "0")}`;
  const clues = buildClueSet({ categories, assignment, rng });
  const notebook = buildNotebook({ pack, categories, assignment, solution, clues, rng });

  return {
    id,
    seed,
    date: new Date(Date.UTC(2026, 0, 1 + ((seed - 1) % 5000))).toISOString().slice(0, 10),
    title,
    pack: pack.name,
    packId: pack.id,
    image: `assets/cases/${pack.id}.jpg`,
    object: pack.object,
    story: pack.intro,
    ending: pack.ending,
    categories,
    clues,
    solution,
    assignment,
    notebook
  };
}

export function countSolutions(puzzle, clues = puzzle.clues, limit = 2) {
  const categories = puzzle.categories;
  const n = categories[0].items.length;
  const permutations = getPermutations(n);
  const categoryOrder = categories.slice(1).map((_, index) => index + 1);
  let count = 0;

  function ownerOf(catIndex, item, candidate) {
    if (catIndex === 0) {
      return categories[0].items.indexOf(item);
    }
    const perm = candidate[catIndex];
    if (!perm) return -1;
    const itemIndex = categories[catIndex].items.indexOf(item);
    return perm.indexOf(itemIndex);
  }

  function clueReady(clue, candidate) {
    return clue.catA === 0 || candidate[clue.catA] ? clue.catB === 0 || candidate[clue.catB] : false;
  }

  function cluePasses(clue, candidate) {
    if (!clueReady(clue, candidate)) return true;
    const same = ownerOf(clue.catA, clue.itemA, candidate) === ownerOf(clue.catB, clue.itemB, candidate);
    return clue.positive ? same : !same;
  }

  function search(depth, candidate) {
    if (count >= limit) return;
    if (depth === categoryOrder.length) {
      count += 1;
      return;
    }
    const catIndex = categoryOrder[depth];
    for (const perm of permutations) {
      candidate[catIndex] = perm;
      let valid = true;
      for (const clue of clues) {
        if (!cluePasses(clue, candidate)) {
          valid = false;
          break;
        }
      }
      if (valid) search(depth + 1, candidate);
      if (count >= limit) return;
      delete candidate[catIndex];
    }
  }

  search(0, {});
  return count;
}

export function getRank(solvedCount) {
  let rank = RANKS[0];
  for (const item of RANKS) {
    if (solvedCount >= item.min) rank = item;
  }
  const next = RANKS.find((item) => item.min > solvedCount);
  const progress = next
    ? Math.max(0, Math.min(100, ((solvedCount - rank.min) / (next.min - rank.min)) * 100))
    : 100;
  return { rank, next, progress };
}

export function normalizeSeed(seedInput) {
  const numeric = Number.parseInt(String(seedInput).replace(/\D/g, ""), 10);
  if (!Number.isFinite(numeric) || numeric <= 0) return 1;
  return ((numeric - 1) % 999999) + 1;
}

function buildClueSet({ categories, assignment, rng }) {
  const coreClues = [];
  const flavorClues = [];
  const suspects = categories[0].items;
  const directSuspects = suspects.slice(0, -1);

  for (const suspect of directSuspects) {
    for (let catIndex = 1; catIndex < categories.length; catIndex += 1) {
      const category = categories[catIndex];
      coreClues.push(makeClue(categories, 0, suspect, catIndex, assignment[suspect][category.name], true));
    }
  }

  for (const suspect of shuffle(suspects, rng)) {
    for (let catIndex = 1; catIndex < categories.length; catIndex += 1) {
      const category = categories[catIndex];
      const wrong = shuffle(category.items.filter((item) => item !== assignment[suspect][category.name]), rng)[0];
      flavorClues.push(makeClue(categories, 0, suspect, catIndex, wrong, false));
    }
  }

  const crossPairs = [];
  for (let a = 1; a < categories.length; a += 1) {
    for (let b = a + 1; b < categories.length; b += 1) {
      for (const suspect of suspects) {
        crossPairs.push(makeClue(categories, a, assignment[suspect][categories[a].name], b, assignment[suspect][categories[b].name], true));
      }
    }
  }

  return [...shuffle(coreClues, rng), ...shuffle(flavorClues, rng).slice(0, 3), ...shuffle(crossPairs, rng).slice(0, 2)].map((clue, index) => ({
    ...clue,
    id: `clue-${index + 1}`,
    number: index + 1
  }));
}

function makeClue(categories, catA, itemA, catB, itemB, positive) {
  const aName = categories[catA].name;
  const bName = categories[catB].name;
  return {
    catA,
    itemA,
    catB,
    itemB,
    positive,
    text: clueText(aName, itemA, bName, itemB, positive),
    note: positive
      ? `${itemA} connects to ${itemB}.`
      : `${itemA} does not connect to ${itemB}.`
  };
}

function clueText(aName, itemA, bName, itemB, positive) {
  if (positive) {
    if (aName === "Suspects") return `Witness notes place ${itemA} with ${itemB}.`;
    return `The ${label(aName)} ${itemA} connects to ${itemB}.`;
  }
  if (aName === "Suspects") return `${itemA} was not linked to ${itemB}.`;
  return `The ${label(aName)} ${itemA} does not match ${itemB}.`;
}

function buildNotebook({ pack, categories, assignment, solution, clues, rng }) {
  const suspects = categories[0].items;
  const otherSuspect = suspects.find((item) => item !== solution.culprit) ?? suspects[0];
  return {
    introduction: [
      pack.intro,
      `Your final deduction must name who took ${pack.object}, where the trail leads, which evidence seals it, and when it happened.`
    ],
    evidence: [
      `A photo board shows ${solution.evidence.toLowerCase()} near a route marker.`,
      `The scene log has four clean time windows, but only one belongs to the culprit.`,
      `${otherSuspect} gave a statement that rules out one tempting shortcut.`
    ],
    witnesses: [
      `${otherSuspect} insisted their clue belongs with ${assignment[otherSuspect].Locations}.`,
      `A second witness remembered ${clues[0].itemA} only after reviewing clue ${clues[0].number}.`,
      `No witness can identify the culprit alone; the story needs the grid.`
    ],
    timeline: categories[3].items.map((time, index) => ({
      time,
      text: `${time}: ${categories[0].items[index]} appears in one clean entry.`
    })),
    suspects: suspects.map((suspect) => ({
      name: suspect,
      note: `${suspect} has one location, one evidence link, and one time window.`
    })),
    maps: categories[1].items.map((place, index) => ({
      place,
      note: `${place} is connected to ${categories[2].items[index]} in at least one witness route.`
    })),
    hints: [
      `You haven't considered clue ${clues[0].number} together with clue ${clues[1].number}. Mark both before guessing.`,
      `Look for a suspect with three separate connections across location, evidence, and time.`,
      `Use elimination: once three suspects have a ${categories[1].name.toLowerCase()} match, the remaining place is forced.`,
      `Compare the witness statement tab with clue ${clues[2].number}; it narrows one whole row.`
    ]
  };
}

function caseTitle(pack, seed, variant) {
  const nouns = {
    "museum-robbery": ["Vanishing Violin", "Moonlit Marble", "Glass Case", "Silent Gallery"],
    "haunted-mansion": ["Clockwork Ghost", "Blue Parlor", "Whispering Stair", "Locked Portrait"],
    "space-station": ["Orbit Drift", "Silent Airlock", "Hydroponic Signal", "Lost Nav Chip"],
    pirates: ["Captain's Map", "Fogbound Deck", "Pearl Compass", "Midnight Mutiny"],
    "school-mystery": ["Missing Mascot", "Glitter Trail", "Library Bell", "Assembly Switch"],
    "lost-treasure": ["Cedar Trail", "Buried Locket", "Red Ribbon", "Dry Creek Map"],
    "fantasy-kingdom": ["Queen's Signet", "Moon Tower", "Rune Feast", "Golden Feather"],
    "spy-mission": ["Midnight Cipher", "Balcony Signal", "Red Umbrella", "Coat Room Drop"],
    "wildlife-reserve": ["Tracker Trail", "River Bend", "Green Tag", "Sunset Blind"],
    "detective-agency": ["Client File", "Coffee Ring", "Back Alley", "Locked Drawer"]
  };
  const list = nouns[pack.id] ?? ["Hidden Clue"];
  return list[(seed + variant) % list.length];
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function label(categoryName) {
  return categoryName.toLowerCase().replace(/s$/, "");
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, rng) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const permutationCache = new Map();

function getPermutations(n) {
  if (permutationCache.has(n)) return permutationCache.get(n);
  const output = [];
  const used = Array(n).fill(false);
  const current = [];

  function walk() {
    if (current.length === n) {
      output.push([...current]);
      return;
    }
    for (let i = 0; i < n; i += 1) {
      if (used[i]) continue;
      used[i] = true;
      current.push(i);
      walk();
      current.pop();
      used[i] = false;
    }
  }

  walk();
  permutationCache.set(n, output);
  return output;
}
