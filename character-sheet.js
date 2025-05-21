
// Ordered list of view IDs
const viewIds = [
    'gender',
    'archetype',
    'roll',
    'mercy',
    'mercy-42'
];
let currentViewIndex = 0;

// Toggle visible views in controls-view
function toggleView(viewId) {
    const allViews = document.querySelectorAll('#controls-view .view');
    allViews.forEach(view => {
        view.style.display = (view.id === viewId) ? 'block' : 'none';
    });
}

// Show initial view
toggleView(viewIds[currentViewIndex]);

// Roll function: 3d10 + 25
function roll() {
    const d10 = () => Math.floor(Math.random() * 10) + 1;
    return d10() + d10() + d10() + 25;
};

// Stats to generate
const statKeys = [
    'combat',
    'brawn',
    'agility',
    'perception',
    'intelligence',
    'willpower',
    'fellowship'
];

// Stats to generate
const secondaryStatKeys = [
    'peril threshold'
];

// Initialize character
let character = {
    combat: 0,
    combatBonus: 0,
    brawn: 0,
    brawnBonus: 0,
    agility: 0,
    agilityBonus: 0,
    perception: 0,
    perceptionBonus: 0,
    intelligence: 0,
    intelligenceBonus: 0,
    willpower: 0,
    willpowerBonus: 0,
    fatePoints: 2,
    fellowship: 0,
    fellowshipBonus: 0,
    gender: '',
    ancestry: 'human',
    previousAncestry: null,
    ancestralModifiersApplied: false,
    archetype: '',
    profession: '',
    rewardPoints: 1000
};

// Ancestral modifiers
const ancestralModifiers = [
    {
        ancestry: 'human',
        combatBonus: 1,
        brawnBonus: 0,
        agilityBonus: -1,
        perceptionBonus: 1,
        intelligenceBonus: 1,
        willpowerBonus: -1,
        fellowshipBonus: -1
    },
    {
        ancestry: 'elf',
        combatBonus: 0,
        brawnBonus: -1,
        agilityBonus: 1,
        perceptionBonus: 1,
        intelligenceBonus: 1,
        willpowerBonus: -1,
        fellowshipBonus: -1
    },
    {
        ancestry: 'gnome',
        combatBonus: -1,
        brawnBonus: -1,
        agilityBonus: 1,
        perceptionBonus: 0,
        intelligenceBonus: 1,
        willpowerBonus: 1,
        fellowshipBonus: -1
    },
    {
        ancestry: 'halfling',
        combatBonus: -1,
        brawnBonus: -1,
        agilityBonus: 1,
        perceptionBonus: 1,
        intelligenceBonus: -1,
        willpowerBonus: 0,
        fellowshipBonus: -1
    },
    {
        ancestry: 'ogre',
        combatBonus: 1,
        brawnBonus: 2,
        agilityBonus: -2,
        perceptionBonus: -1,
        intelligenceBonus:0,
        willpowerBonus: 0,
        fellowshipBonus: 0
    },
    {
        ancestry: 'dwarf',
        combatBonus: 1,
        brawnBonus: 1,
        agilityBonus: -1,
        perceptionBonus: -1,
        intelligenceBonus: 0,
        willpowerBonus: 1,
        fellowshipBonus: -1
    }
];

// Apply ancestry modifiers, undoing previous ones if needed
function applyAncestralModifiers() {
    // Undo previous ancestry modifiers
    if (character.ancestralModifiersApplied && character.previousAncestry) {
        const previous = ancestralModifiers.find(mod => mod.ancestry === character.previousAncestry);
        if (previous) {
            statKeys.forEach(stat => {
                const bonusKey = stat + 'Bonus';
                if (previous.hasOwnProperty(bonusKey)) {
                    character[bonusKey] -= previous[bonusKey];
                }
            });
        }
    }

    // Apply current ancestry modifiers
    const current = ancestralModifiers.find(mod => mod.ancestry === character.ancestry);
    if (!current) return;

    statKeys.forEach(stat => {
        const bonusKey = stat + 'Bonus';
        if (current.hasOwnProperty(bonusKey)) {
            character[bonusKey] += current[bonusKey];
        }
    });

    character.ancestralModifiersApplied = true;
    character.previousAncestry = character.ancestry;

    console.log(`Ancestral modifiers applied for ${character.ancestry}`, character);
}

// Roll stats and compute base bonuses
function rollCharacterStats() {
    statKeys.forEach(stat => {
        const value = roll();
        character[stat] = value;
        character[stat + 'Bonus'] = Math.floor(value / 10);
    });

    character.ancestralModifiersApplied = false; // Reset for fresh application
    applyAncestralModifiers();
    renderStatsTable();
    document.getElementById('print-btn').style.display = 'inline-block';
    document.getElementById('roll-btn').style.display = 'none';
    document.getElementById('forward-btn').style.display = 'none';

}

function renderStatsTable() {
    const container = document.getElementById('table');
    //container.innerHTML = '<h3>Primary Attribute Stats</h3>';
    
    const heading = document.createElement('h3');
    heading.textContent = 'Primary Attributes';
    container.appendChild(heading);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const headerRow = document.createElement('tr');
    ['Primary Attribute', 'Value', 'Bonus'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    statKeys.forEach(stat => {
        const row = document.createElement('tr');

        const statCell = document.createElement('td');
        statCell.textContent = capitalize(stat);
        statCell.style.border = '1px solid #D3D9D4';
        statCell.style.padding = '8px';

        const valueCell = document.createElement('td');
        valueCell.textContent = character[stat];
        valueCell.style.border = '1px solid #D3D9D4';
        valueCell.style.padding = '8px';
        valueCell.style.textAlign = 'center';

        const bonusCell = document.createElement('td');
        bonusCell.textContent = character[stat + 'Bonus'];
        bonusCell.style.border = '1px solid #D3D9D4';
        bonusCell.style.padding = '8px';
        bonusCell.style.textAlign = 'center';

        row.appendChild(statCell);
        row.appendChild(valueCell);
        row.appendChild(bonusCell);
        table.appendChild(row);
    });

    container.appendChild(table);
    renderSecondaryAttributesTable();
}

function renderSecondaryAttributesTable() {
    const container = document.getElementById('table');

    // Add a header below the primary table
    const heading = document.createElement('h3');
    heading.textContent = 'Secondary Attributes';
    container.appendChild(heading);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const secondaryAttributes = [
        {
            name: 'Peril Threshold',
            value: character.willpowerBonus + 3,
            formula: 'Willpower Bonus + 3'
        },
        {
            name: 'Damage Threshold',
            value: character.brawnBonus + (character.armorDTMod || 0),
            formula: 'Brawn Bonus + Armor Modifier'
        },
        {
            name: 'Encumbrance Limit',
            value: character.brawnBonus + 3,
            formula: 'Brawn Bonus + 3'
        },
        {
            name: 'Initiative',
            value: character.perceptionBonus + 3,
            formula: 'Perception Bonus + 3'
        },
        {
            name: 'Movement',
            value: character.agilityBonus + 3,
            formula: 'Agility Bonus + 3'
        }
    ];

    const headerRow = document.createElement('tr');
    ['Attribute', '', 'Formula'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    secondaryAttributes.forEach(attr => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = attr.name;
        nameCell.style.border = '1px solid #D3D9D4';
        nameCell.style.padding = '8px';

        const valueCell = document.createElement('td');
        valueCell.textContent = attr.value;
        valueCell.style.border = '1px solid #D3D9D4';
        valueCell.style.padding = '8px';
        valueCell.style.textAlign = 'center';

        const formulaCell = document.createElement('td');
        formulaCell.textContent = attr.formula;
        formulaCell.style.border = '1px solid #D3D9D4';
        formulaCell.style.padding = '8px';
        formulaCell.style.fontStyle = 'italic';

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(formulaCell);
        table.appendChild(row);
    });

    container.appendChild(table);
}

function renderArchetypeAndProfession() {
    const container = document.getElementById('table');
    if (!container) return;

    // Add heading
    const heading = document.createElement('h3');
    heading.textContent = 'Archetype & Profession';
    container.appendChild(heading);

    // Create table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const headerRow = document.createElement('tr');
    ['Category', 'Value'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add rows
    const entries = [
        ['Archetype', capitalize(character.archetype.name) || '—'],
        ['Profession', character.profession || '—']
    ];

    entries.forEach(([label, value]) => {
        const row = document.createElement('tr');

        const labelCell = document.createElement('td');
        labelCell.textContent = label;
        labelCell.style.border = '1px solid #D3D9D4';
        labelCell.style.padding = '8px';

        const valueCell = document.createElement('td');
        valueCell.textContent = value;
        valueCell.style.border = '1px solid #D3D9D4';
        valueCell.style.padding = '8px';

        row.appendChild(labelCell);
        row.appendChild(valueCell);
        table.appendChild(row);
    });

    const paragraph = document.createElement('p');
    paragraph.innerHTML = `
        <p>As ${character.archetype.definiteArticle} <strong>${character.archetype.name}</strong> ${character.profession}, ${character.name} is ${character.archetype.description}.
    `;

    container.appendChild(paragraph);
    container.appendChild(table);
}

function renderPhysicalTraits() {
    const container = document.getElementById('table');
    if (!container || !character.buildType) return;

    const heading = document.createElement('h3');
    heading.textContent = 'Physical Traits';
    container.appendChild(heading);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const headerRow = document.createElement('tr');
    ['Trait', 'Value'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    const traits = [
        ['Age Group', character.ageGroup || '—'],
        ['Distinguishing Mark', character.distinguishingMark || '—'],
        ['Build Type', character.buildType?.name || '—'],
        ['Build Description', character.buildType?.description || '—'],
        ['Build Bonus', character.buildType?.bonus || '—']
    ];

    traits.forEach(([label, value]) => {
        const row = document.createElement('tr');

        const labelCell = document.createElement('td');
        labelCell.textContent = label;
        labelCell.style.border = '1px solid #D3D9D4';
        labelCell.style.padding = '8px';

        const valueCell = document.createElement('td');
        valueCell.textContent = value;
        valueCell.style.border = '1px solid #D3D9D4';
        valueCell.style.padding = '8px';

        row.appendChild(labelCell);
        row.appendChild(valueCell);
        table.appendChild(row);
    });

    container.appendChild(table);
}

function renderBio() {
    assignRandomSocialClass();
    assignRandomUpbringing();
    assignRandomAlignment();
    assignPhysicalTraits();
    assignRandomAgeGroup();
    assignDrawback();
    assignDooming();
    assignGender();

    const container = document.getElementById('table');
    if (!container) return;

    const heading = document.createElement('h3');
    heading.textContent = 'Biography';
    container.appendChild(heading);

    const paragraph = document.createElement('p');
    paragraph.innerHTML = `
        <p><strong>${character.name}</strong> is ${character.ageGroup.definiteArticle} ${character.ageGroup.name} ${character.ancestry} ${character.gender} with ${character.hairColor} hair, and ${character.eyeColor} eyes, with ${character.distinguishingMark}.</p>
       
        <p>${character.subjectPronounCaps} has a ${character.buildType.name} build, and ${character.buildType.description}. <strong>${character.name}</strong> ${character.drawback.description}.</p>

        <p>Born of the ${character.socialClass.name} class, <strong>${character.name}</strong> had a "${character.upbringing.name}" upbringing where ${character.subjectPronoun} ${character.upbringing.description}.

        <p>As ${character.socialClass.definiteArticle} ${character.socialClass.name}, ${character.possessivePronoun} family ${character.socialClass.description}</p>

        <p><strong>${character.name}\'s</strong> ${character.alignment.name} aligns ${character.objectPronoun} with the cause of ${character.alignment.alignment}.</p>

        <p>${character.alignment.description}</p>

        <p>In ${character.possessivePronoun} tenth year, ${character.name}\'s doomsayer told ${character.objectPronoun}:</p>

        <p><strong><em>${character.dooming}</em></strong>.</p>
    `;
    paragraph.style.marginTop = '8px';

    container.appendChild(paragraph);
    renderArchetypeAndProfession();
}

function assignDooming() {
    const seasons = Object.keys(doomingMap);
    const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];
    const doomingList = doomingMap[randomSeason];
    const randomDooming = doomingList[Math.floor(Math.random() * doomingList.length)];

    character.birthSeason = randomSeason;
    character.dooming = randomDooming;

    console.log('Character object:', character);

    //renderDooming();
}

function assignRandomAgeGroup() {
    const keys = Object.keys(ageGroups);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const { name, definiteArticle } = ageGroups[randomKey];

    character.ageGroup = {
        name,
        definiteArticle
    };

    console.log('Age group assigned:', character.ageGroup.name);
}

function assignPhysicalTraits() {
    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Base physical traits
    //character.ageGroup = pickRandom(ageGroups);
    character.distinguishingMark = pickRandom(distinguishingMarksMap);
    character.buildType = pickRandom(buildTypeMap);

    // Hair color by ancestry
    const hairOptions = hairColorMap.find(entry => entry[character.ancestry]);
    character.hairColor = pickRandom(hairOptions[character.ancestry]);

    // Eye color by ancestry
    const eyeOptions = eyeColorMap.find(entry => entry[character.ancestry]);
    character.eyeColor = pickRandom(eyeOptions[character.ancestry]);

    console.log('Physical traits assigned:', {
        ageGroup: character.ageGroup,
        distinguishingMark: character.distinguishingMark,
        buildType: character.buildType.name,
        hairColor: character.hairColor,
        eyeColor: character.eyeColor
    });

    //renderPhysicalTraits();
    //renderBio();

}

function assignGender() {
    if(character.gender === 'man'){
        character.subjectPronoun = 'he',
        character.subjectPronounCaps = 'He',
        character.objectPronoun = 'him',
        character.possessivePronoun = 'his'
        character.possessivePronounCaps = 'His'
    } else if (character.gender === 'woman'){
        character.subjectPronoun = 'she',
        character.subjectPronounCaps = 'She',
        character.objectPronoun = 'her',
        character.possessivePronoun = 'her'
        character.possessivePronounCaps = 'Her'
    }
};

function assignArchetype() {
    const select = document.getElementById('archetype-select');
    const selectedValue = select.value;

    if (professionMap[selectedValue]) {
        const { defintieArticle: definiteArticle } = professionMap[selectedValue];
        const { description: description } = professionMap[selectedValue];
        character.archetype = {
            name: selectedValue,
            definiteArticle: definiteArticle || 'a', // default to 'a' if undefined
            description: description
        };
        console.log('Archetype assigned:', character.archetype);
    } else {
        console.warn(`No matching archetype found for: ${selectedValue}`);
        character.archetype = null;
    }
}

function assignRandomUpbringing() {
    const keys = Object.keys(upbringingMap);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const { name, description, favoredAttribute } = upbringingMap[randomKey];

    character.upbringing = {
        name,
        description,
        favoredAttribute
    };
    console.log('Upbringing assigned:', character.upbringing);
}

function assignDrawback() {
    // Local helper
    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
    const drawbackPool = Object.values(drawbacksMap);
    character.drawback = pickRandom(drawbackPool);
    
}

function assignRandomSocialClass() {
    const keys = Object.keys(socialClassMap);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const { name, description, definiteArticle } = socialClassMap[randomKey];

    character.socialClass = {
        name,
        description,
        definiteArticle
    };

    console.log('Social class assigned:', character.socialClass);
}

function assignRandomAlignment(){
    const keys = Object.keys(alignmentMap);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const { name, description, alignment } = alignmentMap[randomKey];

    character.alignment = {
        name,
        description,
        alignment
    };

    console.log('Alignment assigned:', character.alignment);
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

const doomingMap = {
    spring:[
        'Pride comes before a fall', 
        'Ivy will claw at your skin and prick like a rose',
        'Health is not always healthy',
        'Still waters run deep',
        'The forest will strike when the campfire burns low',
        'Do not pluck low-hanging fruit',
        'The serpent is in the garden',
        'Climb not the mighty oak',
        'Beware the fairy rings and standing stones',
        'The land will reclaim what is hers',
        'Do not stare directly into the light',
        'Good intentions lead to bad situations',
        'Do not accept trust lightly',
        'There is always another problem',
        'Light burns as much as heals',
        'Radiance can\'t illuminate all',
        'Charity will cause your end',
        'Underestimate no one',
        'Birth is but the start of death',
        'Provide no succor to the blind man',
        'Do not pickup discarded coins',
        'Once a kiss, twice a blade, thrice the grave where debts are paid.',
        'Thy fate is cruel, but ironic',
        'A trick is not an illusion',
        'Beware of thine own knife'
    ],
    summer: [
        'Your end will be at the head of a hammer',
        'Your hubris will end you',
        'Those you love will kill you',
        'Beware the comet\'s warning',
        'They will come as twins, but leave as triplets',
        'You will die trying to save someone you love',
        'Beware a lover scorned',
        'You will witness the end, and go into it',
        'The heathen shall cut you down',
        'Your final moments will be divine pain',
        'Your own flame shall consume you',
        'Mercy will be your downfall',
        'Burning bright will snuff you out',
        'Unlit paths are the most dangerous',
        'Iron will bend under heat',
        'Respect the power that disrespects you',
        'Never leave a fire burning',
        'Never turn your back on a foe',
        'Your embers will ever smolder',
        'The sun will be a cruel friend to you',
        'Death will come from above and below',
        'Lightning does strike twice',
        'Beware the squall before the storm',
        'The eye of the storm is scant reprieve',
        'The heavens will open angry and bright'
    ],
    autumn: [
        'The murder of an innocent will herald thine death',
        'Thy skin shall darken as ink',
        'Do not cross the freshly dug tomb',
        'Thine death shall come twice',
        'Up from the canyon soars the raven',
        'Sorrow will drown you',
        'You will not see the end, but it will see you',
        'One step forward, two steps back',
        'The jackdaw is a false omen',
        'A visage will haunt you to your grave',
        'The Eye will look upon you with scorn',
        'You will die in a pool of another\'s blood',
        'Thine death shall be unclean',
        'Sickness shall bring you down',
        'The stench of the grave stalks you',
        'New beginnings herald sudden ends',
        'The abyss gazes back into you',
        'Shadows stalk hungrily',
        'Three flies bring your doom',
        'Beware the Black Stallion',
        'Do not fold, always stay',
        'Confusion will kill you',
        'DO  ot be fooled by appearances',
        'Avoid the exotic when possible',
        'Do not push for more, for you will get it'
    ],
    winter: [
        'Beware the toothless hound',
        'Warm winters bring hard frost',
        'Trust not what you cannot see',
        'The blood on your hands shall be your doom',
        'The oldest are the strongest',
        'Be wary of false friends',
        'Numbers will overwhelm your might',
        'Your killer will not know your name',
        'Being found will be worse than being lost',
        'Do not tread on ice thick, or thin',
        'Iron is weaker than gold',
        'Your left eye is blind to the truth',
        'Revenge will be upon you',
        'Absolute power corrupts absolutely',
        'Being immovable will not be your boon',
        'Somethings man should not know',
        'Justice is blind. And, deaf. And, dumb',
        'Six of one, half of a dozen of the other',
        'Fear the change that changes you',
        'The gavel ring twice',
        'The stars will lead you astray',
        'The shallows invite, but the depths will crush you',
        'The cold eyes you',
        'You will be touched by the unknown',
        'Do not fly too close to the stars'
    ]
};

const professionMap = {
    academic: {
        professions: ["Adherent", "Anchorite", "Antiquarian", "Apothecary", "Astrologer", "Diabolist", "Engineer", "Informer", "Investigator", "Monk", "Preacher", "Scribe"],
        description: 'driven by scholarly and philosophical pursuits',
        defintieArticle: 'an'
    },
    commoner: {
        professions: ["Artisan", "Barber surgeon", "Boatman", "Camp follower", "Cheapjack", "Doomsayer", "Jailer", "Laborer", "Peasant", "Rat Catcher", "Servant"],
        description: 'not given to complaining about the drudery and tedium of work'
    },
    knave: {
        professions: ["Beggar", "Burglar", "Charlatan", "Footpad", "Gambler", "Graverobber", "Guttersnipe", "Highwayman", "Prostitute", "Smuggler", "Vagabond", "Vigilante"],
        description: 'a scoundrel, a thief, a mountebank and fraudster fluent in the thieve\'s cant'
    },
    ranger: {
        professions: ["Bailiff", "Beast Tamer", "Bonepicker", "Bounty Hunter", "Gamekeeper", "Hedgewise", "Old Believer", "Outrider", "Pilgrim", "Reeve", "Slayer", "Trapper"],
        description: 'eking out a hard existence outside of society, contending with weather, warding the land of interlopers, while shunning the trappings of \"civilized life\"'
    },
    socialite: {
        professions: ["Anarchist","Courtier", "Cultist", "Entertainer", "Envoy", "Fop", "Jester", "Provocateur", "Racketeer", "Rake", "Valet"],
        description: 'standing behnd a shield of reputation, putting on airs, and manipulatiing others to get ahead'
    },
    warrior: {
        professions: ["Berseker", "Bravo", "Buccaneer", "Dragoon", "HedgeKnight", "Man-at-Arms", "Militiaman", "Pit Fighter", "Pugilist", "Sellsword", "Squire", "Watchman"],
        description: 'studyig the arts of war and combat, and living the life of violence'
    }
};

const trappingsMap = {
    academic: [],
    commoner: [],
    knave: [],
    ranger: [],
    socialite: [],
    warrior: []
};

const optionalTrappingsMap = {
    academic: [],
    commoner: [],
    knave: [],
    ranger: [],
    socialite: [],
    warrior: []
};

const upbringingMap = {
    cultured: {
        name: 'cultured', 
        description: 'was immersed in culture and taught the value of expression, pride in ability, a sharp eye, and a sharper tongue',
        favoredAttribute: 'fellowship'
    },
    forgotten: {
        name: 'forgotten', 
        description: 'was raised outside of society with little opportunity to integrate. Being from an outcast family is not without benefits, but there seems to be a hole in life',
        favoredAttribute: 'agiltity'
    },
    industrious: {
        name: 'industrious', 
        description: 'was born into a family of laborers, and forced to work to put food on the table, and hates paying other to do the work',
        favoredAttribute: 'brawn'
    },
    militant: {
        name: 'militant', 
        description: 'was hardened by a life of rote and discipline, and hails from a long line of soldiers, sappers, and generals',
        favoredAttribute: 'combat'
    },
    opportunistic: {
        name: 'opportunistic', 
        description: 'learned the underhanded arts from a family of common thieves and government officials, and learned to read others\' intentions and scrutinize truth from lies',
        favoredAttribute: 'perception'
    },
    reverent: {
        name: 'reverent', 
        description: 'was raised to fear and respect the fickle and capricious gods, trusting that dogma foritfies the heart and will',
        favoredAttribute: 'willpower'
    },
    scholastic: {
        name: 'scholastic', 
        description: 'was taught that knowledge is the ultimate weapon. And, that elocution and proper diction are the highest ideal',
        favoredAttribute: 'intelligence'
    }
};

const socialClassMap = {
    lowborn: {
        name: 'lowborn',
        description: 'labored six days a week from morning until night under back-breaking labor to put food on the table.',
        definiteArticle: 'a'
    },
    burgher: {
        name: 'burgher',
        description: 'broke free from the feudal order, consorting with lawyers, academicians, doctors and the like',
        definiteArticle: 'a'
    },
    aristocrat: {
        name: 'aristocrat',
        description: 'can trace its lineage back to the time of the old nobility.',
        definiteArticle: 'an'
    }
};

const drawbacksMap = {
    badTicker: {
        name: 'bad ticker',
        description: 'suffers from a debilitating sickness that makes the blood stir slowly. It will eventually, inevitably, lead to doom',
        effect: 'Whenever yo fail to resist against Stress, Fear, or Terror, you gain 3 additional Corruption'
    },
    blackCataract: {
        name: 'Black Cataract',
        description: 'has an eye grown over with glaucoma making it hard to judge distances, or friend from foe',
        effect: 'Whenever you miss with Attack Actions using a ranged weapon, you must re-roll the result with the same Difficulty Rating. If successful you will strike a random ally who is engaged with you target'
    },
    bleeder: {
        name: 'Bleeder',
        effect: 'Whenever you are treated with the Heal Skill, the caregiver suffers an additional -20 Base Chance unless they expend an additional bandage'
    },
    branded: {
        name: 'branded',
        description: 'is one of the disenfranchised of society; as the bonded serf, slave, or thrall.',
        effect: 'Whenever you interact with those who know you\'re Branded and hold you in contempt due to it, you cannot succeed at Fellowship-based Skill Tests'
    },
    cholericTemperament: {
        name: 'choleric temperament',
        description: 'has a tendency toward one-upsmanship, is rather prickly, and frankly bossy',
        effect: 'Whenever you roll Chaos Dice to determine if you injure a foe, and fail to do so, move one step down the Peril Condition Track egatively whie suffering 1 Corruption'
    },
    cropEar: {
        name: 'cropped ear',
        description: 'is partially deaf from some disfiguring malady, and finds speech difficult, frequently suffering ridicule from others',
        effect: 'You must flip the results to Fail on all Skill Tests requiring hearing'
    },
    cursed: {
        name: 'cursed',
        description: 'suffers some foul hex, or dark magick that might only be lifted by some major sacrifice',
        effect: 'Whenever you intend to sacrifice a Fortune Point, you must roll 1d6 Chaos Die. If the result is a \'6\', you must use 2 Fortune Points instead of one'
    },
    dealWithTheDevil: {
        name: 'deal with the devil',
        description: 'is cursed by a Faustian contract, written in blood, that requires this family to give up part of their souls',
        effect: 'You begin gameplay with one, permanent Chaos Rank'
    },
    debtRidden: {
        name: 'debt-ridden',
        description: 'has spent, and spent, and borrowed for more than can ever be paid back, and may have spent time in a debtor\'s prison',
        effect: 'You must lip the results to Fail for all Skill Tests that rely on your ability to barter, bargain, or strike a deal involving money'
    },
    dunderhead: {
        name: 'dunderhead',
        description: 'is socially awkward and doesn\'t get along well with others, will often stammer, and has getting others to understand',
        effect: 'Whenever you suffer mental Peril, move one additional step down the Peril Condition Track negatively while suffering 1 Corruption'
    },
    lilyLivered: {
        name: 'lily-livered',
        description: 'gets butterflies in the stomach in the most innocuous of situations, has a hard time concentrating',
        effect: 'Whenever yo fail to Resist Stress, Fear ot Terror, you temporarily reduce your Initiative and Movement by -3 (to a minimum of 1). This lasts until you get a good night\'s rest'
    },
    melancholicTemperament: {
        name: 'melancholic temperament',
        description: 'is prone to fits of fatigue, and often suffers from phantom pains in the muscles. And, is difficult to rouse from war-weariness requiring twice the normal medication required to lift the spirits',
        effect: 'Whenever you use Smelling Salts, you must use two instead of one. Using the additional dose of Smelling Salts in this instance has no negative effects'
    },
    neerDoWell: {
        name: 'ne\'er do well',
        description: 'is feckless, irresponsible and prone to idelness. Not completely useless, but unreliable when the chips are down',
        effect:'Yo ucannot assist others\' Skill Tests'
    },
    nemesis: {
        name: 'nemesis',
        description: 'has an implacable enemy that harries at every opportunity',
        effect: 'When confronted by your Nemesis, you cannot sacrifice Fate or Fortune Points'
    },
    painkiller: {
        name: 'painkiller',
        description: 'escapes the stresses of daily life-and the horrors of what\'s out there-by self medicating',
        effect: 'Work with your GM to select a single Addiction'
    },
    persecutionComplex: {
        name: 'persecution complex',
        description: 'has no doubt that everyone-literally everyone-is out to get them. And, believes others are following, defrauding, or trying to pull a con',
        effect: 'You cannot rest to recover from Peril in urban environments, unless you take a dose of laudanum before resting'
    },
    phlegmaticTemperament: {
        name: 'phlegmatic temperament',
        description: 'has a tendency to withdraw from the world when things get tough. Or may even be meek and indecisive in horrific situations',
        effect: 'Whenever you are suffering from Stress, Fear, or Terror, your Fury Dice do not explode. This lasts until you get a good night\'s rest'
    },
    sanguineTemperament: {
        name: 'sanguine temperament',
        desciption: 'is rather outgoing, but also jittery and has a hard time sitting still, and may not have a steady hand in battle',
        effect: 'You cannot Load or Take Aimwithout spending an additional Action Point. In addition, whenever you use the Special Action of Wait, you lose 1 Action Point'
    },
    sourStomach: {
        name: 'sour stomach',
        description: 'has pains in the stomach that make it difficult to keep down \'rich\' food. Other substances may cause health problems and trips to the water closet',
        effect: 'After taking a dose of Laudanum, a Delirient or consuing a substance the GM sees as being hard on your stomach, you cannot recover to unhindered on the Peril Condition Track (only to Imperiled) for the next 24 hours'
    },
    splitFace: {
        name: 'split face',
        description: 'has a poor sense of smell due to some deformity or wound',
        effect: 'You must flip the results to Fail on alll Skill Tests involving smell or taste'
    },
    veteransBoot: {
        name: 'veteran\s boot',
        description: 'sports a wooden boot where the left foot used to reside, which makes a distinctive \'CLUD\' sound with every step',
        effect: 'You cannot Charge, Manuever, or Run with Movement Actions without spending an additional Action Point'
    },
    veteransHand: {
        name: 'veteran\'s hand',
        description: 'sports an iron prosthetic hand having lost the real one in an \'incident\'',
        effect: 'You cannot hold weapons which are two-handed and flip the results fail any Skill Test requiring the use of both hands'
    },
    veteransLeg: {
        name: 'veteran\'s leg',
        description: 'walks at a slower pace on account of the prostethic leg',
        effect: 'You must reduce Movement by 3 and cannot run'
    },
    weakLungs: {
        name: 'weak lungs',
        description: 'was, perhaps stabbed in the chest, or fell on a fence post. The injury makes it difficult to breathe',
        effect: 'Whenever you suffer physical Peril, move one additional step down the Peril Condition Track negatively while suffering 1 Corruption'
    }
}

const ageGroups = {
    young: {
        name: 'young',
        definiteArticle: 'a'
    },
    adult: {
        name: 'adult',
        definiteArticle: 'an'
    },
    middleAged: {
        name: 'middle aged',
        definiteArticle: 'a'
    },
    elderly: {
        name: 'elderly',
        definiteArticle: 'an'
    }
};

const alignmentMap ={
    adaptation: {
        name:'adaptation',
        description: 'Your eccentricity is pronounced. Your mind is curious. Your perceptive powers are formiddable. You are in fact a savant, and find that your interests change as quickly as the weather. Whether a mimic, a sycophant, or simply easily distracted, you adapt to new and changing social dynamics with ease.',
        alignment: 'order'
    },
    mayhem: {
        name:'mayhem',
        description: 'You have a lack of focus and an idiosyncrasy that practically invites chaos into the lives of all who come into contact with you. Worse, you thrive off the social turmoil you cause. Not meant to necessarily imply the wanton spilling of blood, mayhem is a general whirlwind of confusion that follows your actions.',
        alignment: 'chaos'
    },
    ambition: {
        name:'ambition',
        description: 'you are driven to such an extent that no obstacle can possibly withstand your doggedness, as the crashing seas where s rocks into sand. You know what you want out of life, and don\'t just hope to acquire it. In your mind it simply will be. It is a trait you have shared with the greates: king, scholar, and warrior alike.',
        alignment: 'order'
    },
    tyranny: {
        name:'tyranny',
        description: 'A natural leader, certainly, but towards all the wrong ends. You inspire al those who listen to your words into a hateful fervor and possess a paranoid and vindictful streak. ',
        alignment: 'chaos'
    },
    candor: {
        name:'candor',
        description: 'You are direct and steady, a firm believer in the marriage of words and deeds. Others treat your proclamations with the greatest respect and never doubt that you mean what you say.',
        alignment: 'order'
    },
    cruelty: {
        name:'cruelty',
        description: 'Your willingness to act on your words is vicious, potentially even vile. For others, to follow you or know your presence is to invite the pain you willingly impart.',
        alignment: 'chaos'
    },
    charity: {
        name:'charity',
        description: 'Your heart thrives on the notion that it is morally just to provide for the needs of others. While certain charlatans will attempt to prey upon your good will, your generosity will win you many friends and favors in return.',
        alignment: 'order'
    },
    pity: {
        name:'pity',
        description: 'What you view as kind and giving, others view as condescending and mocking. You will never be accepted by those to whom yo offer your hand in aid, as their perceptions were formed by generations of mistrust. What you naively vie as good-hearted, others view as manipulative and self-serving.',
        alignment: 'chaos'
    },
    compassion: {
        name:'compassion',
        description: 'You empathize with the sufferings of others and offer your personal strength to those who lack it, defending any cause you determine is pure and just. You will inspire others to proudly rise up, and wise parents will your example to their children to help them sleep at night.',
        alignment: 'order'
    },
    melancholy: {
        name:'melancholy',
        description: 'Your empathy for the pain of others affects you too deepl, clouding your focus and weakening your resolve. Your depression may manifest in many forms, From general social withdrawal to crippling crippling anxiety, to dangerous indecisiveness.',
        alignment: 'chaos'
    },
    cunning: {
        name:'cunning',
        description: 'Your mind is slippery and tactical, manipulating those whom you interact with towards ends you find favorable. You have a sharp instinct for escaping a parlay gone sour and never appear unnerved.',
        alignment: 'order'
    },
    deceit: {
        name:'deceit',
        description: 'Your trickery and lies make you untrustworthy and unsavory to others and you are unlikely to be accepted as proper company. Friends are hard to come by as your words have no true value, and your machinations may entrap you in the end.',
        alignment: 'chaos'
    },
    dignity: {
        name:'dignity',
        description: 'You are composed and unflabbale, a model of decency and proper behavior in even the most trying and delicate circumstances. You are likely to be trusted as someone who behaves in a way befitting their station, whatever that may be.',
        alignment: 'order'
    },
    vehemence: {
        name:'vehemence',
        description: 'Your drive for personal gain will crush many beneath its bloated weight, friend, foe, and kin alike. You possess the strictest selfishness. Any menas is justified as long as it fulfills your desires. In your mind sacrifice is the price others pay to fulfill your vision.',
        alignment: 'chaos'
    },
    diplomacy: {
        name:'diplomacy',
        description: 'You fully understand the art of the true compromise and that words can be manipulated to achieve the necessary results. You are never single-mindedly comitted to any course, recognizing that one must change with the tides of fate.',
        alignment: 'order'
    },
    hypocrisy: {
        name:'hypocrisy',
        description: 'Others see you for what you are; a charlatan and a liar unwilling or unable to be held to your words. Your judgements and insights are false and unlikely to be followed.',
        alignment: 'chaos'
    },
    duty: {
        name:'duty',
        description: 'Yo uhave taken an oath that guides your actions in all things. No amount of intimidation, bribery, or trickery will sway you.',
        alignment: 'order'
    },
    fatalism: {
        name:'fatalism',
        description: 'Your dedication to a single ideal has twisted your idea of free will. Fate cannot be influenced by the actions of man.',
        alignment: 'chaos'
    },
    enlightenment: {
        name:'enlightenment',
        description: 'Spiritual purity, recognition and meditation have you given you an inner peace thatno ma or god can shake. Your current predicament is but a eye wink in the grand scheme.',
        alignment: 'order'
    },
    detachment: {
        name:'detachment',
        description: 'To most you are a mad stargazer, too busy wihtin your internal world to engage with reality.',
        alignment: 'chaos'
    },
    ferocity: {
        name:'ferocity',
        description: 'The will you possess is capable of moving mountains.',
        alignment: 'order'
    },
    hatred: {
        name:'hatred',
        description: 'The anger you harbor can barely be contained and may explode at inopportune times, burning friend and foe alike.',
        alignment: 'chaos'
    },
    gentility: {
        name:'gentility',
        description: 'Your simplicity is indicative of a pure heart, and never are your goals or desires scond guessed. You are most easily trusted and never taken as a threat often to the chagrin of those who misjudge you.',
        alignment: 'order'
    },
    cowardice: {
        name:'cowardice',
        description: 'You are passive and cautious to the point of being criplled with fear of conflict, unwilling to exert your meager will even in very favorable situations. Others will prey upon you, bullying you, and you will bever inspire more than pity in others.',
        alignment: 'chaos'
    },
    gravitas: {
        name:'gravitas',
        description: 'You have an aura of charisma, knowledge and great confidence; your words carry weight and others put great stock in your abilities. You may inspire others, or terrify them, but they will always listen.',
        alignment: 'order'
    },
    vanity: {
        name:'vanity',
        description: 'Your dedication to yor own perfection is haughty and unseemly; and reflects your ugly judgement of those you see as lesser-which is everyone. The beautiful and accomplished envy and hate you, the ugly will just hate you.',
        alignment: 'chaos'
    },
    heroism: {
        name:'heroism',
        description: 'You are willing and able to make the ultimate scarifice in a world where it may not matter. You are unafraid of overwhelming odds.',
        alignment: 'order'
    },
    martyrdom: {
        name:'martyrdom',
        description: 'You are obsessed with ending your life in a way the \'befits your destiny\'. You are not just willing to die. You pursue that fate with a morbid zeal.',
        alignment: 'chaos'
    },
    humility: {
        name:'humility',
        description: 'You are aware of the limitations of your own abilities and those of others. Your quiet nature does not attract the notice of predators and tends to place you in advantageous situations.',
        alignment: 'order'
    },
    incompetence: {
        name:'incompetence',
        description: 'Others see you as follish and without value. You have a simple and soft-mannered way due to your years of egregious mistakes. No one will view you as capable.',
        alignment: 'chaos'
    },
    impiety: {
        name:'impiety',
        description: 'No god ever filled your belly or your mug. You are aggressively self-reliant and resistant to the manipulation of those who would have you bend the knee to the invisible man in the sky.',
        alignment: 'order'
    },
    heresy: {
        name:'heresy',
        description: 'You are an unclean and wicked thing! Those who understand your nature will do their best to avoid you, or to hasten your trip to hell.',
        alignment: 'chaos'
    },
    independence: {
        name:'independence',
        description: 'You have no time for kings, or princes, or their silly edicts. You despise and avoid petty politics.',
        alignment: 'order'
    },
    rebellion: {
        name:'rebellion',
        description: 'You an enemy of the prevailing authority and your actions are seen as undermining the established order and peace.',
        alignment: 'chaos'
    },
    mystery: {
        name:'mystery',
        description: 'As an outsider, misunderstanding of your ways ad cilture help you sidestep all sorts of inconveniences. Your motives are unclear and so the paths before you are many-an advantage not available to many.',
        alignment: 'order'
    },
    exclusion: {
        name:'exclusion',
        description: 'You are bizarre and exotic in a disconcerting way to those accustomed to a certain decorum. Those of low station will find you uncomforatble at best and a threat at worse. You are likely to run afoul of the law and offend the courts. You find it very difficult to avoid notice.',
        alignment: 'chaos'
    },
    pride: {
        name:'pride',
        description: 'Your name is attached to many great deeds.     ',
        alignment: 'order'
    },
    arrogance: {
        name:'arrogance',
        description: 'You are haughty and disliked, and your inflated sense of self worth is an insult to others. You are inclined to view yourself more capable than you are, and others will be more than willing to correct your mistakes.',
        alignment: 'chaos'
    },
    romanticism: {
        name:'romanticism',
        description: 'You are amorous, but dignified, a great pleasure to be around and others judge you charming and clever. You make excellent company for dinner parties and know great songs for bawdy taverns. Your lust for life flies in the face of social norms.',
        alignment: 'order'
    },
    lechery: {
        name:'lechery',
        description: 'You rlusts are insatiable and your predilections for physical, base needs overwhelm your judgement. Even worse, your taste in matter of the flesh range from distasteful to unholy and sadistic.',
        alignment: 'chaos'
    },
    skepticism: {
        name:'skepticism',
        description: 'Nothin is as it seems, a lesson you\'ve learned all too well. You know better than to take anythig at face value, believing in what your own eyes tell you and nothing more.',
        alignment: 'order'
    },
    cynicism: {
        name:'cynicism',
        description: 'Your absolute lack of faith has led you to many losses in life: opportunities, love, wealth, and friendship. While others leave the ship of despair and strive for a shore not visible, you take sick comfort that many of them will drown.',
        alignment: 'chaos'
    },
    sophistication: {
        name:'sophistication',
        description: 'Your appreciation of the finer things is more than just a way to impress others. Yo uare not a snob, as you appreciate pleasures of all kinds and class, acknowledging quality wherever it exists. Your knowledge makes you well rounded and culturally accepted in wide circles.',
        alignment: 'order'
    },
    indulgence: {
        name:'indulgence',
        description: 'You unbecomingly pursue creature conforts with a sick zeal, taking far more than your share. You are a favored target of the guttersnipe who will fill you head with ideas and empty your purse.',
        alignment: 'chaos'
    },
    wisdom: {
        name:'wisdom',
        description: 'You do not possess more knowledge than others; this simple realization is the pillar upon which your advanced insight is perched. You patiently ruminate, think first, speak later.',
        alignment: 'order'
    },
    rancor: {
        name:'rancor',
        description: 'Regardless of smooth skin, full hair, or sturdy back, you are old. You are cantankerous and cranky ,and set so firmly in your ways you snidely disregard the experience of others.',
        alignment: 'chaos'
    },
    wit: {
        name:'wit',
        description: 'The Way of Words is a science and an art. Your cleverness can make mirth and stem the tide of social currents. You find a welcoming audience wherever you travel.',
        alignment: 'order'
    },
    scorn: {
        name:'scorn',
        description: 'You are in love with the very sound of your own voice. No one is more impressed with your wordy bon mots than you are. Your barbs are weapons and you employ them liberally.',
        alignment: 'chaos'
    },
    zeal: {
        name:'zeal',
        description: 'Your dedication to religious undertaking has helped lead many a soul to greater understanding and set them on the path to salvation. Others are wary of crossing you lest they draw the ire of the gods.',
        alignment: 'order'
    },
    fanaticism: {
        name:'fanaticism',
        description: 'The hand of eithr a just or cruelo god, your unwavering dogma will cause the suffering and misfortune of many who cross your path. You are the personification of oppressive thought, and that is how others see you.',
        alignment: 'chaos'
    },
}

const distinguishingMarksMap = [
    'abnormally white teeth',
    'an abundance of freckles on face',
    'an acne-scarred face',
    'an additional toe',
    'almond-shaped eyes',
    'an asexual appearance',
    'ashy elbows',
    'a balding pate',
    'a beaded mustachio',
    'beady eyes',
    'a beauty mark on the face',
    'big ears',
    'blood-shot eyes',
    'a bow-legged walk',
    'a cattle iron brand',
    'a broken nose',
    'a snaggle tooth',
    'bulging eyes',
    'burning scars',
    'bushy eyebrows',
    'a carefully groomed beard',
    'a cherubic face',
    'clammy hands',
    'a claw-marked face',
    'a black-mole covered face',
    'curly locks of hair',
    'a devilish goatee',
    'different colored eyes',
    'dimpled cheeks',
    'a doll-like face',
    'a drooping eye',
    'dry, flaking skin',
    'a half-missing ear',
    'a tattooed face',
    'excessive body hair',
    'a false finger',
    'eyes too far apart',
    'a farmer\'s tan',
    'a glasgow grin',
    'a golden lock of hair',
    'a hare lip',
    'a hooked nose',
    'a horse face',
    'a humpback',
    'incredible beauty',
    'itchy scabies bites',
    'a jaundiced complexion',
    'lanky hair',
    'a large hairy mole',
    'a very large nose',
    'red, birthmarked-arms',
    'a lazy eye',
    'a leathery countenance',
    'a lichtenberg scar',
    'long eyelashes',
    'a long mustachio',
    'long sideburns',
    'milky eyes',
    'slit nostrils',
    'mismatched eyebrows',
    'a missing finger',
    'a nervous tic',
    'an older-looking face',
    'a painted beard',
    'a pallid countenance',
    'a white patch of hair',
    'perfect posture',
    'a perpetual sneer',
    'a perpetual frown',
    'piercing eyes',
    'a pigeon-toed stance',
    'a pot belly',
    'a pox scarred face',
    'a pronounced brow',
    'purple bags beneath the eyes',
    'rancid breath',
    'a rash of pimples',
    'rheumy eyes',
    'a six-fingered hand',
    'a slouchy posture',
    'a spiked mohawk',
    'a false eye patch',
    'a steely gaze',
    'a strong jaw',
    'sunburn scars',
    'sunken eyes',
    'tanned, leathery skin',
    'tarred and feathered arms',
    'a vacant expression',
    'a veteran\'s nose',
    'a vulgar tattoo',
    'a weak chin',
    'wire spectacles',
    'webbed hands and feet',
    'a widow\'s peak',
    'wind-chapped cheeks',
    'yellow-scummed teeth',
    'yellow finger and toenails'
]

const complexionMap = [
    'pale',
    'fair',
    'light',
    'tan',
    'dark tanned',
    'light brown',
    'brown',
    'dark brown',
    'ebony'
]

const buildTypeMap = [
    {
        name: 'frail',
        modifier: -0.2,
        description: `is a weakling, likely suckled at the breast for too many years`,
        bonus: 'can squeeze into tight spaces'
    },
    {
        name: 'slender',
        modifier: -0.1,
        description: 'a sultry allure, and a cat-like grace',
        bonus: 'grows cold easily, even under the summer\'s heat'
    },
    {
        name: 'normal',
        modifier: 0,
        description: 'an average, unremarkable body',
        bonus: 'clothes are easy to find'
    },
    {
        name: 'husky',
        modifier: 0.1,
        description: 'a muscular shape',
        bonus: 'clothes must be specially made or tailored'
    },
    {
        name: 'corpulent',
        modifier: 0.2,
        description: 'a ponderous, fat bulk that may be seen as disgusting, or as a mark of achievment',
        bonus: 'clothes are expensive'
    }
]

const hairColorMap = [
    { human: ['medium brown', 'dark brown', 'light brown', 'sienna', 'black', 'ash blonde', 'chestnut', 'ginger', 'corn yellow', 'red', 'salt & pepper', 'blue-black', 'grey', 'silver', 'white', 'jet black'] },
    { dwarf: ['medium brown', 'dark brown', 'light brown', 'jet black', 'grey', 'chestnut', 'ginger', 'sienna', 'corn yellow', 'ash blonde', 'salt & pepper', 'silver', 'white', 'red', 'blue-black', 'black'] },
    { elf: ['honey brown', 'golden brown', 'starw yellow', 'golden yellow', 'black', 'ash blonde', 'chestnut', 'copper', 'corn yellow', 'fiery red', 'ivory white', 'blue-black', 'smokey grey', 'silver', 'white', 'jet black'] },
    { gnome: ['medium brown', 'dark brown', 'light brown', 'sienna', 'black', 'ash blonde', 'chestnut', 'ginger', 'corn yellow', 'red', 'salt & pepper', 'blue-black', 'grey', 'silver', 'white', 'jet black'] },
    { halfling: ['medium brown', 'dark brown', 'light brown', 'sienna', 'black', 'ash blonde', 'chestnut', 'ginger', 'corn yellow', 'red', 'salt & pepper', 'blue-black', 'grey', 'silver', 'white', 'jet black'] },
    { ogre: ['medium brown', 'dark brown', 'light brown', 'sienna', 'black', 'ash blonde', 'chestnut', 'ginger', 'corn yellow', 'red', 'salt & pepper', 'blue-black', 'grey', 'silver', 'white', 'jet black'] }
]

const eyeColorMap = [
    { human: ['hazel','light brown','medium brown','grey','dark brown','pale green','copper','green','black','grey blue','blue','dark green','ice blue','violet'] },
    { dwarf: ['hazel','light brown','medium brown','grey','dark brown','pale green','copper','green','black','grey blue','blue','dark green','ice blue','violet'] },
    { elf: ['amber','silver','honey','emerald','molasses','crystal blue','hazel','black','sapphire','copper','blue purple','gold','silver green','violet'] },
    { gnome: ['hazel','light brown','medium brown','grey','dark brown','pale green','copper','green','black','grey blue','blue','dark green','ice blue','violet'] },
    { halfling: ['hazel','light brown','medium brown','grey','dark brown','pale green','copper','green','black','grey blue','blue','dark green','ice blue','violet'] },
    { ogre: ['hazel','light brown','medium brown','grey','dark brown','pale green','copper','green','black','grey blue','blue','dark green','ice blue','violet'] }
]

// DOM loaded event handlers
document.addEventListener('DOMContentLoaded', () => {
    const rollButton = document.getElementById('roll-btn');
    const doomButton = document.getElementById('dooming-btn');
    const archetypeSelect = document.getElementById('archetype-select');
    const professionSelect = document.getElementById('profession-select');
    const nameInput = document.getElementById('character-name');
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const ancestryRadios = document.querySelectorAll('input[name="ancestry"]');

    //Roll for stats listener
    if (rollButton) {
        rollButton.addEventListener('click', () => {
            renderBio();
            rollCharacterStats();
        });
        //
    };

    // Dooming listener
    if(doomButton){
        doomButton.addEventListener('click', () => {
        });
    }

    // Character name listener
    if (nameInput) {
        nameInput.addEventListener('input', (event) => {
            character.name = event.target.value;
            console.log('Name updated:', character.name);
            //console.log('Character object:', character);
        });
    }

    // Select gender listener
    genderRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            character.gender = event.target.value;
           console.log('Gender updated:', character.gender);
            //console.log('Character object:', character);
        });
    });

    // Select ancestry listener
    ancestryRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            character.ancestry = event.target.value;
            applyAncestralModifiers(); // Will undo previous and apply new
            console.log('Ancestry updated:', character.ancestry);
            //console.log('Character object:', character);
        });
    });

    // Archetype and profession listener
    archetypeSelect.addEventListener('change', (event) => {
        const selected = event.target.value;
        // character.archetype = selected;
        assignArchetype();
    
        // Clear previous options
        professionSelect.innerHTML = '<option value="">-- Select Profession --</option>';
    
        // Populate based on selected archetype
        if (professionMap[selected] && professionMap[selected].professions) {
            professionMap[selected].professions.forEach(profession => {
                const option = document.createElement('option');
                option.value = profession;
                option.textContent = profession;
                professionSelect.appendChild(option);
            });
        }
    
        console.log('Archetype updated:', character.archetype);
    });
    

    // Select profession listener
    professionSelect.addEventListener('change', (event) => {
        character.profession = event.target.value;
        console.log('Profession updated:', character.profession);
        console.log('Character object:', character);
    });

    // Navigation buttons listener
    document.getElementById('forward-btn').addEventListener('click', () => {
        if (currentViewIndex < viewIds.length - 1) {
            currentViewIndex++;
            toggleView(viewIds[currentViewIndex]);
        }
    });

    document.getElementById('back-button').addEventListener('click', () => {
        if (currentViewIndex > 0) {
            currentViewIndex--;
            toggleView(viewIds[currentViewIndex]);
        }
    });

});

/**
 * Opens a temporary window, injects only the #character‑sheet‑view markup,
 * fires the browser’s print dialog, then closes the window.
 */
function printCharacterSheet() {
  const src = document.getElementById('character-sheet-view');
  if (!src) {
    console.error('Div #character-sheet-view not found.');
    return;
  }

  // Clone the content into a standalone print window
  const w = window.open('', '', 'width=800,height=600');
  w.document.write(`
    <html>
      <head>
        <title>Character Sheet</title>
        <style>
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>${src.outerHTML}</body>
    </html>
  `);
  w.document.close(); // required for Firefox
  w.focus();

  // Print, then close the helper window
  w.print();
  w.close();
}