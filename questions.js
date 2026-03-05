// ============================================================================
// SYNAPSE — Trivia Question Bank
// ============================================================================
// Mechanics:
//   1. Progressive Clue Drop: 5 clues per question (cryptic → obvious)
//   2. Knowledge Chain: each answer connects to the next via chainHint
//   3. Confidence Wager: players bet points before answering
//
// Structure:
//   dailyChains — 7 themed chains of 10 questions each (70 total)
//   pool        — ~8 extra unchained questions per category (48 total)
// ============================================================================

const QUESTIONS = {

  // ==========================================================================
  // DAILY CHAINS — 10 questions each, linked by chainHint → next question
  // ==========================================================================
  dailyChains: {

    // ========================================================================
    // SCIENCE CHAIN
    // ========================================================================
    science: [
      // Q1: Mitochondria → chain to "powerhouse" / energy → Q2 about ATP
      {
        id: "sci001",
        category: "science",
        difficulty: 2,
        clues: [
          "Lynn Margulis championed the endosymbiotic theory explaining its origin from ancient alpha-proteobacteria",
          "It possesses its own circular DNA, separate from the nucleus, inherited maternally",
          "This double-membraned organelle is most abundant in cardiac muscle cells",
          "It is the site of oxidative phosphorylation and the citric acid cycle",
          "Often called the 'powerhouse of the cell'"
        ],
        answer: "Mitochondria",
        options: ["Mitochondria", "Ribosome", "Chloroplast", "Golgi Apparatus"],
        chainTags: ["biology", "cell", "organelle", "energy"],
        chainHint: "energy currency"
      },
      // Q2: ATP → chain to "adenine" → Q3 about DNA bases
      {
        id: "sci002",
        category: "science",
        difficulty: 1,
        clues: [
          "Fritz Lipmann shared the 1953 Nobel Prize for discovering coenzyme A's role in its metabolism",
          "Hydrolysis of its gamma phosphate bond releases roughly 7.3 kcal/mol of free energy",
          "Its full chemical name is adenosine-5'-triphosphate",
          "Muscles use this molecule during every contraction and relaxation cycle",
          "The three-letter abbreviation for the main energy currency of all living cells"
        ],
        answer: "ATP",
        options: ["ATP", "ADP", "GTP", "NADH"],
        chainTags: ["biology", "chemistry", "energy", "molecule"],
        chainHint: "double helix"
      },
      // Q3: DNA → chain to "code" → Q4 about genetic code / CRISPR
      {
        id: "sci003",
        category: "science",
        difficulty: 1,
        clues: [
          "Rosalind Franklin's Photo 51, an X-ray diffraction image, was key to deciphering its structure",
          "Chargaff's rules state that adenine pairs with thymine, and cytosine pairs with guanine within it",
          "Watson and Crick published its double helix structure in Nature in 1953",
          "It is found in the nucleus of every cell and carries hereditary instructions",
          "The molecule of life, abbreviated with three letters, that encodes your genes"
        ],
        answer: "DNA",
        options: ["DNA", "RNA", "Protein", "Chromosome"],
        chainTags: ["biology", "genetics", "molecule", "heredity"],
        chainHint: "gene editing"
      },
      // Q4: CRISPR → chain to "bacteria" → Q5 about penicillin
      {
        id: "sci004",
        category: "science",
        difficulty: 3,
        clues: [
          "Emmanuelle Charpentier and Jennifer Doudna won the 2020 Nobel Prize in Chemistry for developing this tool",
          "It was originally discovered as a bacterial immune defense against bacteriophages",
          "The Cas9 protein acts as molecular scissors guided by a short RNA sequence",
          "Its full name refers to 'Clustered Regularly Interspaced Short Palindromic Repeats'",
          "This revolutionary gene-editing technology lets scientists cut and modify DNA precisely"
        ],
        answer: "CRISPR",
        options: ["CRISPR", "PCR", "Gene Therapy", "Cloning"],
        chainTags: ["biology", "genetics", "technology", "medicine"],
        chainHint: "accidental discovery"
      },
      // Q5: Penicillin → chain to "mold" → Q6 about fungi/mushrooms
      {
        id: "sci005",
        category: "science",
        difficulty: 2,
        clues: [
          "Howard Florey and Ernst Boris Chain scaled up its production, saving countless lives in World War II",
          "It works by inhibiting the cross-linking of peptidoglycan in bacterial cell walls",
          "Alexander Fleming noticed a contaminated petri dish in 1928 that led to its discovery",
          "This substance was the first true antibiotic used in medicine",
          "The famous drug discovered from bread mold that kills bacteria"
        ],
        answer: "Penicillin",
        options: ["Penicillin", "Aspirin", "Insulin", "Morphine"],
        chainTags: ["medicine", "biology", "discovery", "antibiotic"],
        chainHint: "kingdom of decomposers"
      },
      // Q6: Fungi → chain to "network" → Q7 about the internet
      {
        id: "sci006",
        category: "science",
        difficulty: 2,
        clues: [
          "Mycorrhizal networks allow them to share nutrients with trees in what scientists call the 'Wood Wide Web'",
          "They reproduce via spores rather than seeds and lack chlorophyll entirely",
          "The largest known organism on Earth is a honey fungus spanning 2,385 acres in Oregon",
          "Yeasts, molds, and mushrooms all belong to this biological kingdom",
          "The kingdom of life that includes mushrooms and toadstools"
        ],
        answer: "Fungi",
        options: ["Fungi", "Bacteria", "Protista", "Plantae"],
        chainTags: ["biology", "kingdom", "nature", "decomposer"],
        chainHint: "underground network"
      },
      // Q7: Mycelium → chain to "communication" → Q8 about neuron
      {
        id: "sci007",
        category: "science",
        difficulty: 3,
        clues: [
          "Paul Stamets has proposed using it for bioremediation, filtering pollutants from contaminated soil and water",
          "It can grow at rates exceeding 1.5 centimeters per day and exerts enough force to crack asphalt",
          "Scientists are exploring its use as a sustainable packaging material and building insulation",
          "This is the vegetative, thread-like network of a fungus that grows beneath the surface",
          "The root-like web of fungal threads that connects mushrooms underground"
        ],
        answer: "Mycelium",
        options: ["Mycelium", "Rhizome", "Root System", "Lichen"],
        chainTags: ["biology", "fungi", "network", "nature"],
        chainHint: "electrical signals"
      },
      // Q8: Neuron → chain to "brain" → Q9 about neuroplasticity
      {
        id: "sci008",
        category: "science",
        difficulty: 2,
        clues: [
          "Santiago Ramon y Cajal won the 1906 Nobel Prize for establishing the doctrine that these are discrete cells",
          "They transmit signals via action potentials that travel at speeds up to 120 meters per second",
          "The human brain contains approximately 86 billion of them",
          "Dendrites receive signals and axons transmit them in these specialized cells",
          "The nerve cell — the basic building block of the brain and nervous system"
        ],
        answer: "Neuron",
        options: ["Neuron", "Synapse", "Glial Cell", "Axon"],
        chainTags: ["biology", "brain", "nervous system", "cell"],
        chainHint: "brain adaptation"
      },
      // Q9: Neuroplasticity → chain to "learning" → Q10 about Pavlov
      {
        id: "sci009",
        category: "science",
        difficulty: 3,
        clues: [
          "Eric Kandel won the 2000 Nobel Prize studying this phenomenon in the sea slug Aplysia",
          "London taxi drivers exhibit increased hippocampal volume as a result of this process",
          "It can be structural, involving the growth of new synaptic connections, or functional",
          "Stroke patients rely on this ability for the brain to rewire around damaged areas",
          "The brain's ability to reorganize itself and form new neural connections throughout life"
        ],
        answer: "Neuroplasticity",
        options: ["Neuroplasticity", "Neurogenesis", "Homeostasis", "Muscle Memory"],
        chainTags: ["neuroscience", "brain", "learning", "adaptation"],
        chainHint: "conditioned response"
      },
      // Q10: Pavlov's Dogs
      {
        id: "sci010",
        category: "science",
        difficulty: 1,
        clues: [
          "His original research focused on digestive physiology, for which he won the 1904 Nobel Prize",
          "He measured salivation using surgically implanted fistulas in his subjects' cheeks",
          "His work at the Institute of Experimental Medicine in St. Petersburg lasted over three decades",
          "He discovered that his dogs began salivating at the sound of a bell before food arrived",
          "The Russian scientist famous for conditioning dogs to drool at a bell"
        ],
        answer: "Ivan Pavlov",
        options: ["Ivan Pavlov", "B.F. Skinner", "Sigmund Freud", "Charles Darwin"],
        chainTags: ["psychology", "science", "conditioning", "behavior"],
        chainHint: null
      }
    ],

    // ========================================================================
    // HISTORY CHAIN
    // ========================================================================
    history: [
      // Q1: Library of Alexandria → chain to "ancient knowledge" → Q2
      {
        id: "his001",
        category: "history",
        difficulty: 2,
        clues: [
          "Eratosthenes, who calculated the Earth's circumference, served as its third head librarian",
          "It aimed to collect every written work in the known world, reportedly holding 400,000 scrolls",
          "Ptolemy I Soter founded it around 283 BCE as part of a larger research institution called the Mouseion",
          "Its destruction, possibly during Julius Caesar's siege in 48 BCE, remains one of history's great losses",
          "The most famous ancient repository of knowledge, located in Egypt"
        ],
        answer: "Library of Alexandria",
        options: ["Library of Alexandria", "Oracle at Delphi", "Colossus of Rhodes", "Lighthouse of Pharos"],
        chainTags: ["ancient", "knowledge", "Egypt", "library"],
        chainHint: "Macedonian conqueror"
      },
      // Q2: Alexander the Great → chain to "empire" → Q3
      {
        id: "his002",
        category: "history",
        difficulty: 2,
        clues: [
          "His horse Bucephalus was so beloved that he named a city after it in modern-day Pakistan",
          "Tutored by Aristotle from age 13, he developed a lifelong passion for Homer's Iliad",
          "He never lost a single battle in 15 years of campaigning across three continents",
          "He died in Babylon in 323 BCE at age 32, and his empire was divided among his generals",
          "The young Macedonian king who conquered the Persian Empire and reached India"
        ],
        answer: "Alexander the Great",
        options: ["Alexander the Great", "Julius Caesar", "Genghis Khan", "Hannibal Barca"],
        chainTags: ["ancient", "conqueror", "Greece", "empire"],
        chainHint: "spice trade route"
      },
      // Q3: Silk Road → chain to "trade" → Q4
      {
        id: "his003",
        category: "history",
        difficulty: 2,
        clues: [
          "German geographer Ferdinand von Richthofen coined its modern name in 1877",
          "The bubonic plague of the 14th century likely traveled westward along its routes",
          "Chang'an (modern Xi'an) served as its eastern terminus during the Tang Dynasty",
          "This network of trade routes connected China to the Mediterranean for over 1,500 years",
          "The ancient trade route famous for carrying silk, spices, and ideas between East and West"
        ],
        answer: "Silk Road",
        options: ["Silk Road", "Spice Route", "Amber Road", "Incense Route"],
        chainTags: ["trade", "ancient", "route", "China"],
        chainHint: "maritime exploration"
      },
      // Q4: Age of Exploration / Magellan → chain to "circumnavigation" → Q5
      {
        id: "his004",
        category: "history",
        difficulty: 2,
        clues: [
          "Only 18 of the original 270 crew members survived to complete the journey aboard the Victoria",
          "He was killed in the Battle of Mactan in the Philippines in 1521 and never finished the voyage himself",
          "Born in Portugal, he sailed under the Spanish flag after King Manuel I refused to fund his expedition",
          "His fleet of five ships departed Seville in 1519 seeking a westward route to the Spice Islands",
          "The explorer whose expedition first circumnavigated the globe"
        ],
        answer: "Ferdinand Magellan",
        options: ["Ferdinand Magellan", "Vasco da Gama", "Christopher Columbus", "Francis Drake"],
        chainTags: ["exploration", "navigation", "ocean", "discovery"],
        chainHint: "revolutionary document"
      },
      // Q5: Magna Carta → chain to "rights" → Q6
      {
        id: "his005",
        category: "history",
        difficulty: 2,
        clues: [
          "Archbishop Stephen Langton was instrumental in brokering its terms between the barons and the crown",
          "It was annulled by Pope Innocent III just 10 weeks after its sealing, sparking the First Barons' War",
          "Only four original copies from 1215 survive today, held in cathedrals and the British Library",
          "King John sealed this document at Runnymede under pressure from rebellious barons",
          "The 1215 English charter considered a cornerstone of modern democracy and constitutional law"
        ],
        answer: "Magna Carta",
        options: ["Magna Carta", "Bill of Rights", "Declaration of Independence", "Treaty of Westphalia"],
        chainTags: ["law", "rights", "England", "medieval"],
        chainHint: "revolution"
      },
      // Q6: French Revolution → chain to "guillotine" → Q7
      {
        id: "his006",
        category: "history",
        difficulty: 1,
        clues: [
          "The sans-culottes, urban laborers who wore long trousers instead of knee breeches, were its foot soldiers",
          "The Reign of Terror saw an estimated 16,594 people executed by guillotine in just ten months",
          "It began with the storming of the Bastille prison on July 14, 1789",
          "Marie Antoinette and King Louis XVI were both executed during this upheaval",
          "The late 18th-century uprising in which French citizens overthrew the monarchy"
        ],
        answer: "French Revolution",
        options: ["French Revolution", "American Revolution", "Russian Revolution", "Haitian Revolution"],
        chainTags: ["revolution", "France", "monarchy", "democracy"],
        chainHint: "little corporal"
      },
      // Q7: Napoleon → chain to "exile" → Q8
      {
        id: "his007",
        category: "history",
        difficulty: 2,
        clues: [
          "His Napoleonic Code remains the foundation of civil law in over 70 countries today",
          "He crowned himself Emperor at Notre-Dame, taking the crown from Pope Pius VII's hands",
          "At the Battle of Austerlitz in 1805, he defeated the combined armies of Russia and Austria",
          "He was exiled to Elba, escaped, ruled for 100 days, then was exiled again to Saint Helena",
          "The French military leader who rose from Corsican obscurity to dominate Europe"
        ],
        answer: "Napoleon Bonaparte",
        options: ["Napoleon Bonaparte", "Louis XIV", "Charlemagne", "Duke of Wellington"],
        chainTags: ["France", "war", "emperor", "leader"],
        chainHint: "island exile"
      },
      // Q8: Rosetta Stone → chain to "decipherment" → Q9
      {
        id: "his008",
        category: "history",
        difficulty: 3,
        clues: [
          "Jean-Francois Champollion cracked its code in 1822 using the cartouche of Ptolemy V as his key",
          "It was carved in 196 BCE as a decree from Memphis affirming the royal cult of Ptolemy V Epiphanes",
          "Written in three scripts: hieroglyphic, demotic, and ancient Greek",
          "French soldiers discovered it in 1799 during Napoleon's Egyptian campaign near the town of Rashid",
          "The famous inscribed stone that allowed scholars to finally decipher Egyptian hieroglyphs"
        ],
        answer: "Rosetta Stone",
        options: ["Rosetta Stone", "Dead Sea Scrolls", "Behistun Inscription", "Phaistos Disc"],
        chainTags: ["archaeology", "Egypt", "language", "discovery"],
        chainHint: "ancient builders"
      },
      // Q9: Great Pyramid of Giza → chain to "wonder" → Q10
      {
        id: "his009",
        category: "history",
        difficulty: 1,
        clues: [
          "Recent discoveries suggest its builders were paid laborers, not slaves, housed in a nearby workers' village",
          "It contains an estimated 2.3 million limestone blocks, each averaging 2.5 tons",
          "Built around 2560 BCE, it remained the tallest structure on Earth for nearly 3,800 years",
          "It was constructed as a tomb for the pharaoh Khufu (also known as Cheops)",
          "The only surviving structure of the original Seven Wonders of the Ancient World"
        ],
        answer: "Great Pyramid of Giza",
        options: ["Great Pyramid of Giza", "Sphinx", "Colosseum", "Parthenon"],
        chainTags: ["ancient", "Egypt", "architecture", "wonder"],
        chainHint: "moon landing"
      },
      // Q10: Apollo 11
      {
        id: "his010",
        category: "history",
        difficulty: 1,
        clues: [
          "Michael Collins orbited alone in the command module Columbia while his crewmates walked below",
          "The Eagle lander had only 25 seconds of fuel remaining when it finally touched down",
          "President Kennedy had set the goal in 1961, but did not live to see it achieved",
          "On July 20, 1969, humans first set foot on the lunar surface",
          "The NASA mission where Neil Armstrong took 'one small step for man'"
        ],
        answer: "Apollo 11",
        options: ["Apollo 11", "Apollo 13", "Gemini 4", "Mercury 7"],
        chainTags: ["space", "NASA", "moon", "exploration"],
        chainHint: null
      }
    ],

    // ========================================================================
    // ARTS CHAIN
    // ========================================================================
    arts: [
      // Q1: Mona Lisa → chain to "Renaissance master" → Q2
      {
        id: "art001",
        category: "arts",
        difficulty: 1,
        clues: [
          "In 1911, Vincenzo Peruggia, an Italian handyman, stole it from the Louvre by hiding in a closet overnight",
          "Infrared scans reveal the subject originally had eyebrows that were later removed or faded",
          "The sfumato technique used creates an ambiguity around the corners of her mouth and eyes",
          "Believed to depict Lisa Gherardini, wife of a Florentine merchant, painted starting around 1503",
          "Leonardo da Vinci's most famous painting, known for her mysterious smile"
        ],
        answer: "Mona Lisa",
        options: ["Mona Lisa", "Girl with a Pearl Earring", "The Birth of Venus", "Whistler's Mother"],
        chainTags: ["painting", "Renaissance", "Leonardo", "masterpiece"],
        chainHint: "Sistine ceiling"
      },
      // Q2: Michelangelo → chain to "sculpture" → Q3
      {
        id: "art002",
        category: "arts",
        difficulty: 2,
        clues: [
          "He wrote over 300 sonnets and madrigals, many addressed to the nobleman Tommaso dei Cavalieri",
          "He painted the Sistine Chapel ceiling while standing, not lying on his back as is commonly believed",
          "He carved his masterpiece David from a marble block that two other sculptors had already rejected",
          "Pope Julius II commissioned him to paint the ceiling of a famous Vatican chapel",
          "The Renaissance artist behind both the Pieta and the Sistine Chapel"
        ],
        answer: "Michelangelo",
        options: ["Michelangelo", "Raphael", "Donatello", "Bernini"],
        chainTags: ["Renaissance", "sculpture", "painting", "Italy"],
        chainHint: "starry night"
      },
      // Q3: Van Gogh → chain to "ear" → Q4
      {
        id: "art003",
        category: "arts",
        difficulty: 1,
        clues: [
          "He sold only one known painting during his lifetime: The Red Vineyard, for 400 francs",
          "In just over two years at Arles and Saint-Remy, he produced roughly 900 paintings",
          "His brother Theo, an art dealer, financially supported him and preserved his letters",
          "He painted The Starry Night while in an asylum in Saint-Remy-de-Provence in 1889",
          "The Dutch post-impressionist who famously cut off part of his own ear"
        ],
        answer: "Vincent van Gogh",
        options: ["Vincent van Gogh", "Claude Monet", "Paul Gauguin", "Edvard Munch"],
        chainTags: ["painting", "impressionism", "Dutch", "art"],
        chainHint: "musical genius"
      },
      // Q4: Beethoven → chain to "symphony" → Q5
      {
        id: "art004",
        category: "arts",
        difficulty: 2,
        clues: [
          "His Heiligenstadt Testament, written in 1802, reveals his despair over his encroaching deafness",
          "He was completely deaf by the time he composed his Ninth Symphony with its 'Ode to Joy'",
          "He bridged the Classical and Romantic eras and studied briefly under Haydn in Vienna",
          "His Fifth Symphony's opening four-note motif — da-da-da-DUM — is among the most recognized in music",
          "The German composer who continued writing masterpieces even after losing his hearing"
        ],
        answer: "Ludwig van Beethoven",
        options: ["Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Johann Sebastian Bach", "Franz Schubert"],
        chainTags: ["music", "classical", "composer", "German"],
        chainHint: "tragic playwright"
      },
      // Q5: Shakespeare → chain to "theater" → Q6
      {
        id: "art005",
        category: "arts",
        difficulty: 1,
        clues: [
          "He invented over 1,700 words including 'assassination,' 'eyeball,' and 'lonely'",
          "The 'Lost Years' between 1585 and 1592 remain a biographical mystery with no records",
          "His plays were performed at the Globe Theatre, which burned down in 1613 during Henry VIII",
          "He wrote approximately 37 plays and 154 sonnets in Elizabethan England",
          "The 'Bard of Avon' who wrote Romeo and Juliet and Hamlet"
        ],
        answer: "William Shakespeare",
        options: ["William Shakespeare", "Christopher Marlowe", "Ben Jonson", "Oscar Wilde"],
        chainTags: ["literature", "theater", "playwright", "English"],
        chainHint: "magical realism"
      },
      // Q6: Gabriel Garcia Marquez → chain to "solitude" → Q7
      {
        id: "art006",
        category: "arts",
        difficulty: 3,
        clues: [
          "He worked as a journalist in Bogota and wrote for El Espectador before turning to fiction",
          "His Nobel Prize lecture in 1982 was titled 'The Solitude of Latin America'",
          "He popularized magical realism, blending the fantastical with the mundane in Latin American settings",
          "His masterwork follows seven generations of the Buendia family in the fictional town of Macondo",
          "The Colombian author of One Hundred Years of Solitude"
        ],
        answer: "Gabriel Garcia Marquez",
        options: ["Gabriel Garcia Marquez", "Jorge Luis Borges", "Pablo Neruda", "Isabel Allende"],
        chainTags: ["literature", "Nobel Prize", "Latin America", "magical realism"],
        chainHint: "architectural masterpiece"
      },
      // Q7: Sagrada Familia → chain to "unfinished" → Q8
      {
        id: "art007",
        category: "arts",
        difficulty: 2,
        clues: [
          "Its architect studied the geometry of hyperboloids and paraboloids found in nature for the structural design",
          "Construction began in 1882 and is expected to be completed around 2026, over 140 years later",
          "Its architect was struck by a tram in 1926 and died, leaving only models and sketches to guide completion",
          "Antoni Gaudi devoted the last 15 years of his life exclusively to this project in Barcelona",
          "The famous unfinished basilica in Barcelona designed by Gaudi"
        ],
        answer: "Sagrada Familia",
        options: ["Sagrada Familia", "Notre-Dame de Paris", "St. Peter's Basilica", "Hagia Sophia"],
        chainTags: ["architecture", "Spain", "Gaudi", "basilica"],
        chainHint: "jazz birthplace"
      },
      // Q8: Jazz (New Orleans) → chain to "improvisation" → Q9
      {
        id: "art008",
        category: "arts",
        difficulty: 2,
        clues: [
          "Buddy Bolden is often cited as its first great practitioner, though no recordings of him survive",
          "It emerged from a fusion of blues, ragtime, brass band marches, and African rhythmic traditions",
          "Louis Armstrong's innovative trumpet solos in the 1920s helped transform it into a soloist's art form",
          "Born in the early 1900s in New Orleans, it spread north to Chicago and New York",
          "The genre of music defined by improvisation, swing rhythms, and blue notes"
        ],
        answer: "Jazz",
        options: ["Jazz", "Blues", "Soul", "Ragtime"],
        chainTags: ["music", "genre", "American", "improvisation"],
        chainHint: "silent film era"
      },
      // Q9: Charlie Chaplin → chain to "comedy" → Q10
      {
        id: "art009",
        category: "arts",
        difficulty: 2,
        clues: [
          "He was investigated by the FBI and effectively exiled from the US in 1952 during the Red Scare",
          "He co-founded United Artists studio in 1919 with Mary Pickford, Douglas Fairbanks, and D.W. Griffith",
          "His film The Great Dictator (1940) was a bold satirical attack on Adolf Hitler",
          "He created the iconic 'Little Tramp' character with a bowler hat, cane, and toothbrush mustache",
          "The legendary silent film comedian and director, one of cinema's first global stars"
        ],
        answer: "Charlie Chaplin",
        options: ["Charlie Chaplin", "Buster Keaton", "Harold Lloyd", "Laurel and Hardy"],
        chainTags: ["film", "comedy", "silent era", "cinema"],
        chainHint: "animation pioneer"
      },
      // Q10: Walt Disney
      {
        id: "art010",
        category: "arts",
        difficulty: 1,
        clues: [
          "He holds the record for most Academy Awards won by an individual: 22 competitive Oscars",
          "His first successful cartoon character was Oswald the Lucky Rabbit, whose rights he lost to Universal",
          "Snow White and the Seven Dwarfs (1937) was Hollywood's first full-length animated feature",
          "He opened his first theme park in Anaheim, California in 1955",
          "The creator of Mickey Mouse and the entertainment empire that bears his name"
        ],
        answer: "Walt Disney",
        options: ["Walt Disney", "Jim Henson", "Steven Spielberg", "George Lucas"],
        chainTags: ["film", "animation", "entertainment", "American"],
        chainHint: null
      }
    ],

    // ========================================================================
    // GEOGRAPHY CHAIN
    // ========================================================================
    geography: [
      // Q1: Mariana Trench → chain to "ocean depths" → Q2
      {
        id: "geo001",
        category: "geography",
        difficulty: 2,
        clues: [
          "In 2019, Victor Vescovo's submersible found a plastic bag and candy wrappers at its bottom",
          "Jacques Piccard and Don Walsh first reached its floor in the bathyscaphe Trieste in 1960",
          "It lies near the convergence of the Pacific and Philippine Sea tectonic plates",
          "Its deepest point, Challenger Deep, reaches approximately 36,000 feet below sea level",
          "The deepest known location in the world's oceans, in the western Pacific"
        ],
        answer: "Mariana Trench",
        options: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Tonga Trench"],
        chainTags: ["ocean", "deep", "Pacific", "geology"],
        chainHint: "ring of fire"
      },
      // Q2: Pacific Ring of Fire → chain to "volcanic" → Q3
      {
        id: "geo002",
        category: "geography",
        difficulty: 2,
        clues: [
          "It is home to 452 volcanoes, accounting for roughly 75% of the world's active and dormant volcanoes",
          "Tectonic subduction zones along its boundary trigger about 90% of the world's earthquakes",
          "It stretches approximately 40,000 kilometers in a horseshoe shape around one ocean basin",
          "Countries along it include Japan, Indonesia, Chile, and the western coast of North America",
          "The zone of intense seismic activity encircling the Pacific Ocean"
        ],
        answer: "Ring of Fire",
        options: ["Ring of Fire", "Mid-Atlantic Ridge", "San Andreas Fault", "Great Rift Valley"],
        chainTags: ["geology", "volcano", "earthquake", "Pacific"],
        chainHint: "frozen continent"
      },
      // Q3: Antarctica → chain to "ice" → Q4
      {
        id: "geo003",
        category: "geography",
        difficulty: 1,
        clues: [
          "The Dry Valleys region receives so little precipitation it is technically a desert",
          "Its ice sheet contains about 70% of the world's fresh water",
          "The Antarctic Treaty of 1959, signed by 12 nations, reserves it exclusively for peaceful research",
          "It has no permanent human residents, only rotating research station personnel",
          "The coldest, driest, and windiest continent, located at the South Pole"
        ],
        answer: "Antarctica",
        options: ["Antarctica", "Arctic", "Greenland", "Siberia"],
        chainTags: ["continent", "ice", "polar", "exploration"],
        chainHint: "longest river"
      },
      // Q4: Nile River → chain to "civilization" → Q5
      {
        id: "geo004",
        category: "geography",
        difficulty: 1,
        clues: [
          "The Aswan High Dam, completed in 1970, ended its annual flooding cycle that had sustained agriculture for millennia",
          "The Blue Nile and White Nile converge at Khartoum, Sudan, before flowing north to the Mediterranean",
          "Herodotus famously called Egypt 'the gift of' this river",
          "It flows through eleven countries in northeastern Africa",
          "Often considered the longest river in the world, flowing through Egypt"
        ],
        answer: "Nile River",
        options: ["Nile River", "Amazon River", "Congo River", "Euphrates River"],
        chainTags: ["river", "Africa", "Egypt", "water"],
        chainHint: "tectonic split"
      },
      // Q5: Great Rift Valley → chain to "human origins" → Q6
      {
        id: "geo005",
        category: "geography",
        difficulty: 3,
        clues: [
          "Lucy, the famous 3.2-million-year-old Australopithecus fossil, was found in its Ethiopian section",
          "It contains some of Africa's deepest lakes, including Lake Tanganyika, the world's second deepest",
          "It was formed by tectonic forces that are slowly splitting the African plate into two pieces",
          "It stretches roughly 6,000 kilometers from Lebanon's Beqaa Valley to Mozambique",
          "The massive geological formation running through East Africa where many early human fossils were found"
        ],
        answer: "Great Rift Valley",
        options: ["Great Rift Valley", "Grand Canyon", "Great Dividing Range", "Andes Mountains"],
        chainTags: ["geology", "Africa", "tectonic", "valley"],
        chainHint: "island nation"
      },
      // Q6: Madagascar → chain to "unique wildlife" → Q7
      {
        id: "geo006",
        category: "geography",
        difficulty: 2,
        clues: [
          "The Avenue of the Baobabs, a row of ancient trees lining a dirt road, is one of its most iconic images",
          "Over 90% of its wildlife is found nowhere else on Earth, having evolved in isolation for 88 million years",
          "Lemurs are its most famous endemic animals, with over 100 species found only here",
          "It is the fourth-largest island in the world, located off the southeastern coast of Africa",
          "The large island nation in the Indian Ocean separated from Africa by the Mozambique Channel"
        ],
        answer: "Madagascar",
        options: ["Madagascar", "Sri Lanka", "Borneo", "New Zealand"],
        chainTags: ["island", "Africa", "biodiversity", "wildlife"],
        chainHint: "highest peak"
      },
      // Q7: Mount Everest → chain to "altitude" → Q8
      {
        id: "geo007",
        category: "geography",
        difficulty: 1,
        clues: [
          "The Tibetan name Chomolungma means 'Goddess Mother of the World'",
          "It was named after Sir George Everest, a British Surveyor General of India, though he never saw it",
          "Edmund Hillary and Tenzing Norgay first reached its summit on May 29, 1953",
          "Its peak sits on the border between Nepal and Tibet at 29,032 feet",
          "The tallest mountain on Earth above sea level"
        ],
        answer: "Mount Everest",
        options: ["Mount Everest", "K2", "Kangchenjunga", "Mount Kilimanjaro"],
        chainTags: ["mountain", "Asia", "altitude", "Himalayas"],
        chainHint: "landlocked countries"
      },
      // Q8: Nepal → chain to "temple" → Q9
      {
        id: "geo008",
        category: "geography",
        difficulty: 2,
        clues: [
          "Its flag is the only national flag in the world that is not quadrilateral — it consists of two stacked triangles",
          "Lumbini, located in its southern plains, is the birthplace of Siddhartha Gautama (the Buddha)",
          "Eight of the world's fourteen peaks above 8,000 meters are found within or on its borders",
          "Kathmandu, its capital, sits in a valley that was once an ancient lake bed",
          "The small Himalayan country sandwiched between India and China, home to Mount Everest's south side"
        ],
        answer: "Nepal",
        options: ["Nepal", "Bhutan", "Tibet", "Bangladesh"],
        chainTags: ["country", "Asia", "Himalayas", "culture"],
        chainHint: "ancient wonder"
      },
      // Q9: Great Wall of China → chain to "defense" → Q10
      {
        id: "geo009",
        category: "geography",
        difficulty: 1,
        clues: [
          "Contrary to popular myth, it is not visible from space with the naked eye",
          "Its construction involved an estimated workforce of millions, including soldiers, peasants, and prisoners",
          "The most well-preserved sections were built during the Ming Dynasty (1368-1644)",
          "Stretching over 13,000 miles, it was built over centuries to protect China's northern borders",
          "The famous ancient fortification winding across the mountains of northern China"
        ],
        answer: "Great Wall of China",
        options: ["Great Wall of China", "Hadrian's Wall", "Berlin Wall", "Western Wall"],
        chainTags: ["landmark", "China", "ancient", "architecture"],
        chainHint: "city of canals"
      },
      // Q10: Venice
      {
        id: "geo010",
        category: "geography",
        difficulty: 1,
        clues: [
          "MOSE, a system of 78 flood barriers, was completed in 2020 to protect it from acqua alta flooding",
          "It was built on 118 small islands connected by over 400 bridges in a shallow lagoon",
          "Marco Polo departed from here on his famous journey to China in 1271",
          "Gondolas have been its traditional mode of transport through a network of canals since the 11th century",
          "The Italian city famous for its canals, masks, and Carnival celebrations"
        ],
        answer: "Venice",
        options: ["Venice", "Amsterdam", "Bruges", "Bangkok"],
        chainTags: ["city", "Italy", "water", "culture"],
        chainHint: null
      }
    ],

    // ========================================================================
    // SPORTS CHAIN
    // ========================================================================
    sports: [
      // Q1: Jesse Owens → chain to "Olympics" → Q2
      {
        id: "spo001",
        category: "sports",
        difficulty: 2,
        clues: [
          "German athlete Luz Long gave him advice on his long jump approach, and they became friends despite Nazi ideology",
          "At the 1935 Big Ten meet, he set three world records and tied a fourth — all within 45 minutes",
          "Adolf Hitler reportedly left the stadium to avoid congratulating him, though this is debated by historians",
          "He won four gold medals at the 1936 Berlin Olympics, defying Nazi claims of Aryan supremacy",
          "The African-American sprinter who dominated track and field at Hitler's Olympics"
        ],
        answer: "Jesse Owens",
        options: ["Jesse Owens", "Carl Lewis", "Usain Bolt", "Jackie Robinson"],
        chainTags: ["Olympics", "track", "sprinting", "legend"],
        chainHint: "marathon origins"
      },
      // Q2: Marathon → chain to "endurance" → Q3
      {
        id: "spo002",
        category: "sports",
        difficulty: 2,
        clues: [
          "The official distance of 26.2 miles was set at the 1908 London Olympics to finish before the royal box",
          "Legend says Pheidippides ran from a battlefield to Athens to announce a military victory, then collapsed and died",
          "Eliud Kipchoge broke the two-hour barrier in Vienna in 2019, though it was not an official race record",
          "The Boston version, first run in 1897, is the world's oldest annual event of this type",
          "The long-distance running race named after an ancient Greek battlefield"
        ],
        answer: "Marathon",
        options: ["Marathon", "Triathlon", "Decathlon", "Steeplechase"],
        chainTags: ["running", "endurance", "Olympics", "distance"],
        chainHint: "ice and blades"
      },
      // Q3: Hockey → chain to "puck" → Q4
      {
        id: "spo003",
        category: "sports",
        difficulty: 2,
        clues: [
          "Wayne Gretzky holds the all-time points record with 2,857 — nearly 1,000 more than second place",
          "The Stanley Cup, its championship trophy, has been around since 1893 and is never duplicated",
          "A standard game consists of three 20-minute periods played on a rink of ice",
          "Canada and Russia have historically dominated this sport at the international level",
          "The fast-paced team sport played on ice with sticks and a puck"
        ],
        answer: "Ice Hockey",
        options: ["Ice Hockey", "Field Hockey", "Lacrosse", "Curling"],
        chainTags: ["team sport", "ice", "winter", "NHL"],
        chainHint: "bat and ball"
      },
      // Q4: Cricket → chain to "wicket" → Q5
      {
        id: "spo004",
        category: "sports",
        difficulty: 2,
        clues: [
          "Don Bradman's test batting average of 99.94 is considered the greatest statistical achievement in any sport",
          "A match in the longest format (Test cricket) can last up to five days and still end in a draw",
          "The Ashes series between England and Australia dates back to 1882",
          "It is the second-most popular sport worldwide, with billions of fans in South Asia",
          "The bat-and-ball sport played on an oval field with wickets, hugely popular in India and England"
        ],
        answer: "Cricket",
        options: ["Cricket", "Baseball", "Rugby", "Polo"],
        chainTags: ["bat and ball", "team sport", "international", "wicket"],
        chainHint: "the beautiful game"
      },
      // Q5: Soccer/Football → chain to "World Cup" → Q6
      {
        id: "spo005",
        category: "sports",
        difficulty: 1,
        clues: [
          "The offside rule, introduced in 1863, remains one of the most debated regulations in any sport",
          "Brazil holds the record with five World Cup victories and has qualified for every tournament",
          "The English Premier League, La Liga, and Serie A are among its most-watched domestic competitions",
          "With over 4 billion fans globally, it is by far the most popular sport in the world",
          "Known as 'football' outside the US, this sport is played with a round ball and two goals"
        ],
        answer: "Soccer (Football)",
        options: ["Soccer (Football)", "Rugby", "American Football", "Handball"],
        chainTags: ["team sport", "global", "World Cup", "football"],
        chainHint: "greatest of all time"
      },
      // Q6: Muhammad Ali → chain to "boxing" → Q7
      {
        id: "spo006",
        category: "sports",
        difficulty: 1,
        clues: [
          "He was stripped of his title in 1967 for refusing military induction during the Vietnam War on religious grounds",
          "Born Cassius Clay, he changed his name after converting to Islam in 1964",
          "His 'Rumble in the Jungle' against George Foreman in Zaire is considered one of sport's greatest moments",
          "He famously declared 'I am the greatest' and backed it up with a record of 56 wins",
          "The legendary heavyweight boxer known for floating like a butterfly and stinging like a bee"
        ],
        answer: "Muhammad Ali",
        options: ["Muhammad Ali", "Mike Tyson", "Joe Louis", "Floyd Mayweather"],
        chainTags: ["boxing", "legend", "champion", "American"],
        chainHint: "court legend"
      },
      // Q7: Michael Jordan → chain to "basketball" → Q8
      {
        id: "spo007",
        category: "sports",
        difficulty: 1,
        clues: [
          "He was famously cut from his high school varsity basketball team as a sophomore",
          "His Nike Air Jordan brand generates over $5 billion in annual revenue decades after his retirement",
          "He won six NBA championships with the Chicago Bulls, earning Finals MVP each time",
          "His 'flu game' in the 1997 NBA Finals against the Jazz is one of sport's most iconic performances",
          "Widely considered basketball's greatest player, number 23 for the Chicago Bulls"
        ],
        answer: "Michael Jordan",
        options: ["Michael Jordan", "LeBron James", "Kobe Bryant", "Magic Johnson"],
        chainTags: ["basketball", "NBA", "legend", "American"],
        chainHint: "grand slam"
      },
      // Q8: Serena Williams → chain to "tennis" → Q9
      {
        id: "spo008",
        category: "sports",
        difficulty: 2,
        clues: [
          "She and her sister Venus were coached by their father Richard on public courts in Compton, California",
          "She won the Australian Open while pregnant in 2017, defeating her sister in the final",
          "She has been ranked world No. 1 in singles by the WTA on eight separate occasions",
          "With 23 Grand Slam singles titles in the Open Era, she holds the modern record",
          "The dominant American tennis player who won more Grand Slams than any other player in the Open Era"
        ],
        answer: "Serena Williams",
        options: ["Serena Williams", "Venus Williams", "Steffi Graf", "Martina Navratilova"],
        chainTags: ["tennis", "champion", "American", "women's sports"],
        chainHint: "swimming legend"
      },
      // Q9: Michael Phelps → chain to "medals" → Q10
      {
        id: "spo009",
        category: "sports",
        difficulty: 1,
        clues: [
          "His wingspan of 6 feet 7 inches exceeds his height, giving him a unique hydrodynamic advantage",
          "He won eight gold medals at a single Olympics (Beijing 2008), breaking Mark Spitz's record of seven",
          "He competed in five consecutive Olympic Games from 2000 to 2016",
          "With 23 Olympic gold medals, he is the most decorated Olympian of all time",
          "The American swimmer who holds the record for the most Olympic gold medals ever won"
        ],
        answer: "Michael Phelps",
        options: ["Michael Phelps", "Ryan Lochte", "Ian Thorpe", "Mark Spitz"],
        chainTags: ["swimming", "Olympics", "records", "American"],
        chainHint: "world's game"
      },
      // Q10: FIFA World Cup
      {
        id: "spo010",
        category: "sports",
        difficulty: 1,
        clues: [
          "The 1950 final in Brazil, where Uruguay upset the hosts, is known as the Maracanazo",
          "The trophy was redesigned in 1974 after Brazil got to keep the original Jules Rimet Trophy permanently",
          "It is held every four years and is the most-watched sporting event on television globally",
          "The 2022 edition in Qatar was the first held in the Middle East and in winter",
          "The quadrennial international soccer tournament where nations compete for the golden trophy"
        ],
        answer: "FIFA World Cup",
        options: ["FIFA World Cup", "UEFA Champions League", "Copa America", "Olympics Football"],
        chainTags: ["soccer", "international", "tournament", "world"],
        chainHint: null
      }
    ],

    // ========================================================================
    // POP CULTURE CHAIN
    // ========================================================================
    popculture: [
      // Q1: Star Wars → chain to "force" → Q2
      {
        id: "pop001",
        category: "popculture",
        difficulty: 1,
        clues: [
          "The concept of the Force was influenced by Joseph Campbell's 'The Hero with a Thousand Faces'",
          "Every major studio rejected the script before 20th Century Fox took a chance on it in 1977",
          "James Earl Jones voiced Darth Vader but was uncredited in the original film at his own request",
          "Its opening crawl — 'A long time ago in a galaxy far, far away...' — is instantly recognizable",
          "The sci-fi franchise featuring Jedi, lightsabers, and the Skywalker family"
        ],
        answer: "Star Wars",
        options: ["Star Wars", "Star Trek", "Dune", "Blade Runner"],
        chainTags: ["film", "sci-fi", "franchise", "pop culture"],
        chainHint: "wizarding world"
      },
      // Q2: Harry Potter → chain to "magic" → Q3
      {
        id: "pop002",
        category: "popculture",
        difficulty: 1,
        clues: [
          "Twelve publishers rejected the first manuscript before Bloomsbury accepted it in 1997",
          "The author wrote much of the first book in Edinburgh cafes while living as a single mother on welfare",
          "Hogwarts School sorts students into four houses: Gryffindor, Hufflepuff, Ravenclaw, and Slytherin",
          "The series has sold over 500 million copies, making it the best-selling book series in history",
          "J.K. Rowling's fantasy series about a young wizard with a lightning-bolt scar"
        ],
        answer: "Harry Potter",
        options: ["Harry Potter", "Lord of the Rings", "Narnia", "Percy Jackson"],
        chainTags: ["books", "film", "fantasy", "franchise"],
        chainHint: "streaming wars"
      },
      // Q3: Netflix → chain to "binge" → Q4
      {
        id: "pop003",
        category: "popculture",
        difficulty: 2,
        clues: [
          "Reed Hastings reportedly got the idea after a $40 late fee for Apollo 13 at Blockbuster",
          "Its first original series, House of Cards, debuted in 2013 and changed how shows were released",
          "It pioneered the model of releasing entire seasons at once, creating the 'binge-watching' phenomenon",
          "It started as a DVD-by-mail service in 1997 before pivoting to streaming in 2007",
          "The streaming giant that produces Stranger Things and Squid Game"
        ],
        answer: "Netflix",
        options: ["Netflix", "Hulu", "Amazon Prime Video", "Disney+"],
        chainTags: ["streaming", "TV", "technology", "entertainment"],
        chainHint: "social media revolution"
      },
      // Q4: TikTok → chain to "viral" → Q5
      {
        id: "pop004",
        category: "popculture",
        difficulty: 1,
        clues: [
          "Its recommendation algorithm is considered so powerful that it can determine user interests within minutes of use",
          "It merged with Musical.ly in 2018 to expand its Western user base",
          "Its parent company ByteDance is based in Beijing, which has sparked global security debates",
          "Its short-form video format, originally 15 to 60 seconds, transformed social media content creation",
          "The viral video app famous for dance trends, lip-syncing, and short clips"
        ],
        answer: "TikTok",
        options: ["TikTok", "Instagram Reels", "Snapchat", "YouTube Shorts"],
        chainTags: ["social media", "app", "video", "trends"],
        chainHint: "superhero universe"
      },
      // Q5: Marvel Cinematic Universe → chain to "multiverse" → Q6
      {
        id: "pop005",
        category: "popculture",
        difficulty: 1,
        clues: [
          "Robert Downey Jr. was considered a risky casting choice for the first film due to his troubled past",
          "It began with Iron Man in 2008, a gamble by a then-struggling studio",
          "Avengers: Endgame briefly held the record as the highest-grossing film of all time at $2.8 billion",
          "The franchise spans over 30 interconnected films across multiple 'phases'",
          "The blockbuster film franchise featuring Iron Man, Thor, Captain America, and the Avengers"
        ],
        answer: "Marvel Cinematic Universe",
        options: ["Marvel Cinematic Universe", "DC Extended Universe", "X-Men Series", "Transformers"],
        chainTags: ["film", "superhero", "franchise", "box office"],
        chainHint: "game changer"
      },
      // Q6: Minecraft → chain to "blocks" → Q7
      {
        id: "pop006",
        category: "popculture",
        difficulty: 2,
        clues: [
          "Creator Markus 'Notch' Persson sold his company Mojang to Microsoft for $2.5 billion in 2014",
          "Its procedurally generated worlds can theoretically extend to eight times the surface area of Earth",
          "It has been used in classrooms worldwide as an educational tool for subjects from history to coding",
          "With over 300 million copies sold, it is the best-selling video game of all time",
          "The sandbox game where players mine resources and build with blocks in a pixelated world"
        ],
        answer: "Minecraft",
        options: ["Minecraft", "Roblox", "Terraria", "Fortnite"],
        chainTags: ["gaming", "sandbox", "Microsoft", "cultural phenomenon"],
        chainHint: "true crime obsession"
      },
      // Q7: True Crime Podcasts / Serial → chain to "podcast" → Q8
      {
        id: "pop007",
        category: "popculture",
        difficulty: 2,
        clues: [
          "Sarah Koenig investigated the 1999 murder of Hae Min Lee and conviction of Adnan Syed",
          "It was downloaded over 175 million times, a record that stood for years in its medium",
          "The case was reopened partly due to public attention from this show, and Syed was eventually released",
          "Produced by the team behind This American Life, it debuted in October 2014",
          "The groundbreaking true-crime podcast that made millions of people obsess over one murder case"
        ],
        answer: "Serial",
        options: ["Serial", "My Favorite Murder", "Crime Junkie", "Making a Murderer"],
        chainTags: ["podcast", "true crime", "media", "cultural phenomenon"],
        chainHint: "reality TV"
      },
      // Q8: The Kardashians → chain to "influencer" → Q9
      {
        id: "pop008",
        category: "popculture",
        difficulty: 1,
        clues: [
          "Their father Robert Kardashian was one of O.J. Simpson's defense attorneys in the 1995 trial",
          "Kim's mobile game earned over $200 million in its first two years",
          "Kylie Jenner leveraged the family's fame to build a cosmetics brand valued at hundreds of millions",
          "Their reality show debuted on E! in 2007 and ran for 20 seasons before moving to Hulu",
          "The famous family reality TV dynasty led by Kim, Khloe, Kourtney, and momager Kris"
        ],
        answer: "The Kardashians",
        options: ["The Kardashians", "The Osbournes", "The Real Housewives", "Jersey Shore"],
        chainTags: ["reality TV", "celebrity", "influencer", "pop culture"],
        chainHint: "music royalty"
      },
      // Q9: Beyonce → chain to "queen" → Q10
      {
        id: "pop009",
        category: "popculture",
        difficulty: 1,
        clues: [
          "Her visual album Lemonade explored themes of infidelity, Black womanhood, and resilience through film",
          "She started in the R&B group Destiny's Child before launching a record-breaking solo career",
          "Her surprise self-titled album in 2013, dropped with no advance promotion, changed how music is released",
          "She has won more Grammy Awards than any other artist in history",
          "The superstar singer known as Queen Bey, behind hits like 'Single Ladies' and 'Crazy in Love'"
        ],
        answer: "Beyonce",
        options: ["Beyonce", "Rihanna", "Taylor Swift", "Adele"],
        chainTags: ["music", "celebrity", "pop", "icon"],
        chainHint: "meme culture"
      },
      // Q10: Memes
      {
        id: "pop010",
        category: "popculture",
        difficulty: 2,
        clues: [
          "Richard Dawkins coined the term in his 1976 book The Selfish Gene to describe cultural units of information",
          "Rage comics and Advice Animals on 4chan and Reddit were among the earliest internet formats of this type",
          "The 'Distracted Boyfriend' stock photo became one of the most remixed versions in 2017",
          "They can spread political ideas, inside jokes, or social commentary at lightning speed online",
          "The viral images, videos, and jokes that spread across the internet and define online humor"
        ],
        answer: "Memes",
        options: ["Memes", "GIFs", "Emojis", "Hashtags"],
        chainTags: ["internet", "culture", "humor", "viral"],
        chainHint: null
      }
    ],

    // ========================================================================
    // GAUNTLET CHAIN (mixed categories, generally harder)
    // ========================================================================
    gauntlet: [
      // Q1: (Science) Black Holes → chain to "time" → Q2
      {
        id: "gau001",
        category: "science",
        difficulty: 3,
        clues: [
          "The no-hair theorem states they can be fully described by just three properties: mass, charge, and angular momentum",
          "Stephen Hawking predicted they emit thermal radiation and slowly evaporate over immense timescales",
          "The first direct image of one, in galaxy M87, was captured by the Event Horizon Telescope in 2019",
          "Time dilation near one becomes extreme — a clock there would appear nearly stopped to a distant observer",
          "A region of spacetime where gravity is so strong that nothing, not even light, can escape"
        ],
        answer: "Black Hole",
        options: ["Black Hole", "Neutron Star", "Quasar", "Dark Matter"],
        chainTags: ["space", "physics", "gravity", "relativity"],
        chainHint: "time and clocks"
      },
      // Q2: (History) Invention of the Clock → chain to "navigation" → Q3
      {
        id: "gau002",
        category: "history",
        difficulty: 3,
        clues: [
          "John Harrison spent decades building the H4 marine chronometer to solve the longitude problem at sea",
          "Before his invention, thousands of sailors died because ships could not accurately determine east-west position",
          "The British Parliament offered a prize of 20,000 pounds for a practical solution to the longitude problem",
          "His pocket-watch-sized device lost only 5 seconds over an 81-day Atlantic voyage in 1761",
          "The precision timepiece that finally allowed sailors to determine their exact position at sea"
        ],
        answer: "Marine Chronometer",
        options: ["Marine Chronometer", "Sextant", "Compass", "Astrolabe"],
        chainTags: ["invention", "navigation", "time", "sea"],
        chainHint: "polar explorer"
      },
      // Q3: (Geography) Ernest Shackleton → chain to "endurance" → Q4
      {
        id: "gau003",
        category: "geography",
        difficulty: 3,
        clues: [
          "After his ship was crushed by ice, he sailed 800 miles in a lifeboat across the Southern Ocean to South Georgia",
          "He then crossed the uncharted mountains of South Georgia on foot to reach a whaling station for help",
          "Remarkably, all 27 members of his crew survived after being stranded for nearly two years",
          "His ship Endurance was trapped and crushed by Antarctic pack ice in 1915",
          "The British explorer whose failed Antarctic expedition became one of history's greatest survival stories"
        ],
        answer: "Ernest Shackleton",
        options: ["Ernest Shackleton", "Robert Falcon Scott", "Roald Amundsen", "Edmund Hillary"],
        chainTags: ["exploration", "Antarctica", "survival", "polar"],
        chainHint: "impossible music"
      },
      // Q4: (Arts) Beethoven's Ninth Symphony → chain to "joy" → Q5
      {
        id: "gau004",
        category: "arts",
        difficulty: 3,
        clues: [
          "At its premiere in 1824, the composer had to be turned around to see the audience's ovation because he could hear nothing",
          "It was the first major symphony to include vocal soloists and a full chorus in the final movement",
          "The European Union adopted its final movement as its official anthem in 1985",
          "Friedrich Schiller's poem, set to music in the fourth movement, celebrates universal brotherhood",
          "Beethoven's final complete symphony, famous for the choral finale 'Ode to Joy'"
        ],
        answer: "Beethoven's Ninth Symphony",
        options: ["Beethoven's Ninth Symphony", "Mozart's Requiem", "Handel's Messiah", "Bach's Mass in B Minor"],
        chainTags: ["music", "classical", "masterpiece", "symphony"],
        chainHint: "code breakers"
      },
      // Q5: (History) Enigma Machine → chain to "cipher" → Q6
      {
        id: "gau005",
        category: "history",
        difficulty: 3,
        clues: [
          "Polish mathematicians Marian Rejewski, Jerzy Rozycki, and Henryk Zygalski first broke early versions in 1932",
          "Alan Turing and the team at Bletchley Park built electromechanical 'bombes' to crack its daily-changing settings",
          "It used a system of rotors and a plugboard to produce 158 quintillion possible configurations",
          "Breaking its code is estimated to have shortened World War II by two to four years",
          "The German cipher machine used in WWII whose codes were famously broken by Allied cryptanalysts"
        ],
        answer: "Enigma Machine",
        options: ["Enigma Machine", "Lorenz Cipher", "Navajo Code", "Caesar Cipher"],
        chainTags: ["war", "cryptography", "technology", "WWII"],
        chainHint: "cold war rivalry"
      },
      // Q6: (History/Sports) Space Race → chain to "competition" → Q7
      {
        id: "gau006",
        category: "history",
        difficulty: 2,
        clues: [
          "Sputnik's unexpected 1957 launch triggered a national crisis in America over a perceived 'missile gap'",
          "Yuri Gagarin's orbit on April 12, 1961 made the Soviet Union the first to put a human in space",
          "The rivalry pushed both nations to develop technologies that later became GPS, weather satellites, and memory foam",
          "President Kennedy's 1961 speech set the goal of landing on the Moon before the decade's end",
          "The Cold War competition between the US and Soviet Union to achieve firsts in space exploration"
        ],
        answer: "Space Race",
        options: ["Space Race", "Arms Race", "Cold War", "Manhattan Project"],
        chainTags: ["history", "space", "cold war", "competition"],
        chainHint: "forbidden city"
      },
      // Q7: (Geography) Forbidden City → chain to "dynasty" → Q8
      {
        id: "gau007",
        category: "geography",
        difficulty: 2,
        clues: [
          "It contains exactly 9,999 rooms — one fewer than the mythical 10,000 rooms of heaven, out of respect",
          "Common citizens were forbidden from entering for nearly 500 years, hence its Western name",
          "It served as the imperial palace for 24 emperors across two dynasties: Ming and Qing",
          "Covering 180 acres, it is the largest ancient palatial complex in the world",
          "The massive imperial palace complex at the heart of Beijing, now a museum"
        ],
        answer: "Forbidden City",
        options: ["Forbidden City", "Versailles", "Buckingham Palace", "Topkapi Palace"],
        chainTags: ["architecture", "China", "palace", "history"],
        chainHint: "art heist"
      },
      // Q8: (Pop Culture) The Thomas Crown Affair / art theft → chain to "museum" → Q9
      {
        id: "gau008",
        category: "popculture",
        difficulty: 3,
        clues: [
          "In 2003, two thieves disguised as police officers stole works from the Whitworth Gallery by cutting a window",
          "The 1990 Gardner Museum heist remains unsolved — $500 million of art including a Vermeer are still missing",
          "Vincenzo Peruggia hid in the Louvre overnight in 1911 to steal the world's most famous painting",
          "Empty frames are still displayed at the Gardner Museum as placeholders for the missing works",
          "The crime of stealing valuable artworks from galleries and museums, often dramatized in heist films"
        ],
        answer: "Art Theft",
        options: ["Art Theft", "Forgery", "Art Fraud", "Vandalism"],
        chainTags: ["crime", "art", "museum", "heist"],
        chainHint: "survival game"
      },
      // Q9: (Pop Culture) Squid Game → chain to "competition" → Q10
      {
        id: "gau009",
        category: "popculture",
        difficulty: 1,
        clues: [
          "Creator Hwang Dong-hyuk spent 10 years trying to get it made, facing constant rejection from studios",
          "The green tracksuits and numbered uniforms became the most popular Halloween costume of 2021",
          "The 'Red Light, Green Light' giant doll became an iconic and terrifying image worldwide",
          "It became Netflix's most-watched series ever, with 1.65 billion viewing hours in its first 28 days",
          "The Korean survival drama where desperate players compete in deadly children's games for prize money"
        ],
        answer: "Squid Game",
        options: ["Squid Game", "Squid Game", "The Hunger Games", "Battle Royale"],
        chainTags: ["TV", "Korean", "Netflix", "survival"],
        chainHint: "universal language"
      },
      // Q10: (Science) Mathematics
      {
        id: "gau010",
        category: "science",
        difficulty: 3,
        clues: [
          "The Clay Mathematics Institute offers a $1 million prize for each of seven unsolved 'Millennium Problems'",
          "Grigori Perelman proved the Poincare Conjecture in 2003 and then refused both the Fields Medal and the prize money",
          "The Babylonians used a base-60 number system, which is why we have 60 seconds and 360 degrees today",
          "It is often called the 'queen of the sciences' and underpins physics, engineering, and computer science",
          "The discipline of numbers, equations, and proofs — the universal language of logic"
        ],
        answer: "Mathematics",
        options: ["Mathematics", "Physics", "Philosophy", "Computer Science"],
        chainTags: ["science", "logic", "numbers", "universal"],
        chainHint: null
      }
    ]
  },

  // ==========================================================================
  // POOL — Extra unchained questions for unlimited play (~8 per category)
  // ==========================================================================
  pool: {

    // ========================================================================
    // SCIENCE POOL
    // ========================================================================
    science: [
      {
        id: "sci101",
        category: "science",
        difficulty: 3,
        clues: [
          "Peter Higgs and Francois Englert shared the 2013 Nobel Prize for predicting its existence in the 1960s",
          "It was confirmed by the ATLAS and CMS experiments at CERN's Large Hadron Collider on July 4, 2012",
          "The field associated with it gives mass to fundamental particles through their interaction with it",
          "Its discovery required a 27-kilometer particle accelerator beneath the Swiss-French border",
          "The subatomic particle nicknamed the 'God Particle'"
        ],
        answer: "Higgs Boson",
        options: ["Higgs Boson", "Graviton", "Quark", "Neutrino"],
        chainTags: ["physics", "particle", "CERN", "mass"],
        chainHint: "fundamental forces"
      },
      {
        id: "sci102",
        category: "science",
        difficulty: 2,
        clues: [
          "Marie Curie discovered two elements exhibiting this phenomenon: polonium and radium",
          "Henri Becquerel first detected it accidentally in 1896 using uranium salts and photographic plates",
          "It occurs when unstable atomic nuclei lose energy by emitting alpha, beta, or gamma radiation",
          "Carbon-14 dating, used to determine the age of ancient artifacts, relies on this process",
          "The spontaneous emission of energy from unstable atoms, used in medicine and power generation"
        ],
        answer: "Radioactivity",
        options: ["Radioactivity", "Nuclear Fission", "Electromagnetism", "Photosynthesis"],
        chainTags: ["physics", "nuclear", "energy", "radiation"],
        chainHint: "half-life"
      },
      {
        id: "sci103",
        category: "science",
        difficulty: 1,
        clues: [
          "Dmitri Mendeleev first arranged them by atomic weight in 1869, predicting undiscovered ones",
          "Oganesson, element 118, was the last to be added, confirmed in 2016",
          "Rows are called periods and columns are called groups, with elements sharing similar properties in each group",
          "It organizes all known chemical elements by their atomic number and electron configuration",
          "The chart found in every chemistry classroom that lists all the elements"
        ],
        answer: "Periodic Table",
        options: ["Periodic Table", "Atomic Chart", "Element Map", "Chemical Index"],
        chainTags: ["chemistry", "elements", "science", "organization"],
        chainHint: "building blocks"
      },
      {
        id: "sci104",
        category: "science",
        difficulty: 3,
        clues: [
          "The LIGO observatory first detected them on September 14, 2015, from two merging black holes 1.3 billion light-years away",
          "Einstein predicted them in 1916 as a consequence of general relativity, but doubted they could ever be measured",
          "They travel at the speed of light and compress and stretch space itself as they pass through",
          "The 2017 Nobel Prize in Physics was awarded to Rainer Weiss, Kip Thorne, and Barry Barish for their detection",
          "Ripples in the fabric of spacetime caused by massive accelerating objects like colliding black holes"
        ],
        answer: "Gravitational Waves",
        options: ["Gravitational Waves", "Electromagnetic Waves", "Dark Energy", "Cosmic Rays"],
        chainTags: ["physics", "space", "Einstein", "waves"],
        chainHint: "cosmic ripple"
      },
      {
        id: "sci105",
        category: "science",
        difficulty: 2,
        clues: [
          "Svante Arrhenius first calculated its warming effect in 1896, predicting that doubling it would raise temperatures",
          "Before industrialization, its atmospheric concentration was about 280 parts per million; it now exceeds 420 ppm",
          "Plants absorb it during photosynthesis and all animals exhale it as a byproduct of respiration",
          "It is the primary greenhouse gas driving modern climate change, produced by burning fossil fuels",
          "The gas with the chemical formula CO2 that you exhale with every breath"
        ],
        answer: "Carbon Dioxide",
        options: ["Carbon Dioxide", "Methane", "Ozone", "Nitrogen"],
        chainTags: ["chemistry", "climate", "atmosphere", "gas"],
        chainHint: "greenhouse effect"
      },
      {
        id: "sci106",
        category: "science",
        difficulty: 2,
        clues: [
          "The Voyager 1 probe crossed it in 2012, becoming the first human-made object to enter interstellar space",
          "Its Oort Cloud, a spherical shell of icy bodies, extends roughly 1.5 light-years from the center",
          "It formed approximately 4.6 billion years ago from the gravitational collapse of a molecular cloud",
          "It contains eight planets, five recognized dwarf planets, and billions of smaller bodies",
          "Our cosmic neighborhood — the star, planets, and other objects orbiting the Sun"
        ],
        answer: "Solar System",
        options: ["Solar System", "Milky Way", "Galaxy", "Universe"],
        chainTags: ["space", "astronomy", "planets", "Sun"],
        chainHint: "pale blue dot"
      },
      {
        id: "sci107",
        category: "science",
        difficulty: 3,
        clues: [
          "Richard Feynman famously remarked that nobody truly understands it",
          "The double-slit experiment demonstrates that particles can behave as both waves and particles simultaneously",
          "Schrodinger's cat thought experiment illustrates the paradox of superposition at macroscopic scales",
          "Heisenberg's uncertainty principle states you cannot simultaneously know a particle's exact position and momentum",
          "The branch of physics governing the behavior of atoms and subatomic particles"
        ],
        answer: "Quantum Mechanics",
        options: ["Quantum Mechanics", "Relativity", "Thermodynamics", "Classical Mechanics"],
        chainTags: ["physics", "quantum", "science", "theory"],
        chainHint: "uncertainty"
      },
      {
        id: "sci108",
        category: "science",
        difficulty: 2,
        clues: [
          "Dolly the Sheep, created in 1996 at the Roslin Institute, was the first mammal produced using this technique",
          "Somatic cell nuclear transfer involves placing the nucleus of an adult cell into an enucleated egg cell",
          "Therapeutic versions of this process aim to grow replacement tissues, not whole organisms",
          "It raises profound ethical questions about genetic identity and the meaning of individuality",
          "The process of creating a genetically identical copy of a living organism"
        ],
        answer: "Cloning",
        options: ["Cloning", "Gene Therapy", "In Vitro Fertilization", "Stem Cell Research"],
        chainTags: ["biology", "genetics", "ethics", "technology"],
        chainHint: "identical copy"
      }
    ],

    // ========================================================================
    // HISTORY POOL
    // ========================================================================
    history: [
      {
        id: "his101",
        category: "history",
        difficulty: 3,
        clues: [
          "Its construction required an estimated 100,000 workers and was completed in roughly 20 years",
          "The interior contains a false burial chamber and an unfinished subterranean chamber to deter tomb robbers",
          "Historian Herodotus claimed workers were fed radishes, onions, and garlic, based on inscriptions",
          "It was originally encased in white Tura limestone and topped with a gold capstone, gleaming in the sun",
          "The massive tomb built for Pharaoh Khufu on the Giza plateau around 2560 BCE"
        ],
        answer: "Great Pyramid of Giza",
        options: ["Great Pyramid of Giza", "Pyramid of Djoser", "Temple of Karnak", "Valley of the Kings"],
        chainTags: ["Egypt", "ancient", "architecture", "pharaoh"],
        chainHint: "ancient wonder"
      },
      {
        id: "his102",
        category: "history",
        difficulty: 2,
        clues: [
          "The Tripartite Pact of 1940 formally established the Axis alliance between Germany, Italy, and Japan",
          "D-Day, June 6, 1944, saw over 156,000 Allied troops land on the beaches of Normandy",
          "The conflict resulted in an estimated 70 to 85 million deaths, making it the deadliest in human history",
          "It began with Germany's invasion of Poland on September 1, 1939",
          "The global conflict from 1939 to 1945 fought between the Allies and the Axis powers"
        ],
        answer: "World War II",
        options: ["World War II", "World War I", "Korean War", "Cold War"],
        chainTags: ["war", "global", "20th century", "conflict"],
        chainHint: "atomic age"
      },
      {
        id: "his103",
        category: "history",
        difficulty: 2,
        clues: [
          "Johannes Gutenberg was a goldsmith by training, which gave him the metallurgical skill to cast individual type",
          "The Gutenberg Bible, produced around 1455, was among the first major books printed with this technology",
          "It reduced the cost of books by roughly 80%, making knowledge accessible beyond the clergy and wealthy",
          "Martin Luther's 95 Theses spread rapidly across Europe thanks to this invention, fueling the Reformation",
          "The revolutionary 15th-century invention that made mass production of books possible"
        ],
        answer: "Printing Press",
        options: ["Printing Press", "Telegraph", "Typewriter", "Paper"],
        chainTags: ["invention", "technology", "communication", "Renaissance"],
        chainHint: "information revolution"
      },
      {
        id: "his104",
        category: "history",
        difficulty: 3,
        clues: [
          "The Treaty of Tordesillas in 1494 divided newly discovered lands outside Europe between Portugal and Spain",
          "Hernan Cortes conquered the Aztec Empire with only about 600 men, aided by disease and local allies",
          "The Columbian Exchange introduced potatoes, tomatoes, and tobacco to Europe, transforming global agriculture",
          "An estimated 90% of indigenous Americans died from European diseases like smallpox within a century",
          "The period of European exploration and empire-building in the Americas from the late 1400s onward"
        ],
        answer: "Age of Colonization",
        options: ["Age of Colonization", "Industrial Revolution", "Age of Enlightenment", "Renaissance"],
        chainTags: ["colonialism", "exploration", "Americas", "empire"],
        chainHint: "empire building"
      },
      {
        id: "his105",
        category: "history",
        difficulty: 1,
        clues: [
          "Over 800 people drowned attempting to cross it before its fall, and at least 140 died at the wall itself",
          "Ronald Reagan famously stood at the Brandenburg Gate in 1987 and demanded it be torn down",
          "It was erected overnight on August 13, 1961, catching the world and most Berliners by surprise",
          "Its fall on November 9, 1989 became the most powerful symbol of the Cold War's end",
          "The concrete barrier that divided East and West Germany's capital for 28 years"
        ],
        answer: "Berlin Wall",
        options: ["Berlin Wall", "Iron Curtain", "Great Wall of China", "Hadrian's Wall"],
        chainTags: ["Cold War", "Germany", "division", "freedom"],
        chainHint: "divided city"
      },
      {
        id: "his106",
        category: "history",
        difficulty: 2,
        clues: [
          "She communicated using a secret set of symbols and hand signals with her conductor network",
          "Despite a severe head injury from childhood that caused seizures and narcolepsy, she never lost a passenger",
          "She made 13 trips back to the South and personally guided about 70 enslaved people to freedom",
          "During the Civil War, she served as a spy, scout, and nurse for the Union Army",
          "The 'Moses of her people' who led enslaved Americans to freedom via the Underground Railroad"
        ],
        answer: "Harriet Tubman",
        options: ["Harriet Tubman", "Sojourner Truth", "Frederick Douglass", "Rosa Parks"],
        chainTags: ["American history", "freedom", "civil rights", "hero"],
        chainHint: "path to freedom"
      },
      {
        id: "his107",
        category: "history",
        difficulty: 3,
        clues: [
          "Al-Khwarizmi's 9th-century treatise 'Al-Jabr' laid the foundations of algebra during this period",
          "Ibn al-Haytham's 'Book of Optics' pioneered the scientific method centuries before Galileo",
          "The House of Wisdom in Baghdad translated and preserved Greek, Persian, and Indian texts",
          "From roughly the 8th to 14th centuries, the Islamic world led advances in science, medicine, and mathematics",
          "The era of scientific and cultural flourishing in the medieval Islamic world"
        ],
        answer: "Islamic Golden Age",
        options: ["Islamic Golden Age", "Renaissance", "Age of Enlightenment", "Classical Antiquity"],
        chainTags: ["medieval", "science", "Islam", "knowledge"],
        chainHint: "age of reason"
      },
      {
        id: "his108",
        category: "history",
        difficulty: 1,
        clues: [
          "The British Museum holds the largest single collection of objects from this ancient civilization",
          "Cleopatra VII, its last pharaoh, lived closer in time to the Moon landing than to the building of the Great Pyramid",
          "They developed one of the earliest writing systems — hieroglyphs — around 3200 BCE",
          "The Nile River's annual flooding was the foundation of this civilization's agricultural success",
          "The ancient civilization that built the pyramids, worshipped Ra, and mummified their dead"
        ],
        answer: "Ancient Egypt",
        options: ["Ancient Egypt", "Mesopotamia", "Ancient Greece", "Roman Empire"],
        chainTags: ["ancient", "civilization", "Africa", "pharaoh"],
        chainHint: "land of pharaohs"
      }
    ],

    // ========================================================================
    // ARTS POOL
    // ========================================================================
    arts: [
      {
        id: "art101",
        category: "arts",
        difficulty: 3,
        clues: [
          "Written over 22 years, it was published posthumously and incomplete in 1927",
          "The narrator dips a madeleine cookie in tea, triggering an involuntary flood of childhood memories",
          "Its seven volumes total over 1.2 million words, making it one of the longest novels ever written",
          "It explores themes of memory, time, art, and society in Belle Epoque France",
          "Marcel Proust's monumental novel sequence beginning with 'Swann's Way'"
        ],
        answer: "In Search of Lost Time",
        options: ["In Search of Lost Time", "Ulysses", "War and Peace", "Les Miserables"],
        chainTags: ["literature", "French", "novel", "masterpiece"],
        chainHint: "passage of time"
      },
      {
        id: "art102",
        category: "arts",
        difficulty: 2,
        clues: [
          "It was painted in response to the bombing of a Basque town by German and Italian warplanes during the Spanish Civil War",
          "The monochromatic palette of black, white, and grey emphasizes the horror and chaos of the scene",
          "Picasso insisted the painting remain in exile at MoMA in New York until democracy returned to Spain",
          "It finally arrived at the Museo Reina Sofia in Madrid in 1981, six years after Franco's death",
          "Picasso's massive anti-war masterpiece depicting the horrors of a 1937 aerial bombing"
        ],
        answer: "Guernica",
        options: ["Guernica", "The Persistence of Memory", "The Scream", "Les Demoiselles d'Avignon"],
        chainTags: ["painting", "war", "Picasso", "Spain"],
        chainHint: "protest art"
      },
      {
        id: "art103",
        category: "arts",
        difficulty: 2,
        clues: [
          "It was filmed in black and white and features groundbreaking deep-focus cinematography by Gregg Toland",
          "Orson Welles was only 25 years old when he co-wrote, directed, produced, and starred in it",
          "William Randolph Hearst tried to suppress the film, believing it was a thinly veiled biography of him",
          "The dying word 'Rosebud' drives the entire mystery of the plot",
          "The 1941 film widely considered the greatest movie ever made, directed by Orson Welles"
        ],
        answer: "Citizen Kane",
        options: ["Citizen Kane", "Casablanca", "The Third Man", "Sunset Boulevard"],
        chainTags: ["film", "classic", "cinema", "American"],
        chainHint: "cinematic masterpiece"
      },
      {
        id: "art104",
        category: "arts",
        difficulty: 1,
        clues: [
          "She kept a detailed diary from ages 13 to 15 that was published posthumously by her father, Otto",
          "The family hid in a secret annex behind a bookcase in her father's office building in Amsterdam",
          "She wrote 'I still believe, in spite of everything, that people are truly good at heart'",
          "She died in the Bergen-Belsen concentration camp in February 1945, just weeks before liberation",
          "The young Jewish girl whose diary of hiding from the Nazis became one of the most-read books in history"
        ],
        answer: "Anne Frank",
        options: ["Anne Frank", "Elie Wiesel", "Primo Levi", "Corrie ten Boom"],
        chainTags: ["literature", "WWII", "diary", "Holocaust"],
        chainHint: "hidden story"
      },
      {
        id: "art105",
        category: "arts",
        difficulty: 3,
        clues: [
          "The title character declares 'to be or not to be' while contemplating death and the afterlife",
          "The play-within-a-play 'The Mousetrap' is designed to catch 'the conscience of the king'",
          "Yorick's skull, a prop in the graveyard scene, has become an enduring symbol of mortality",
          "Written around 1600, it is Shakespeare's longest play at over 4,000 lines",
          "Shakespeare's tragedy about the Prince of Denmark who seeks revenge for his father's murder"
        ],
        answer: "Hamlet",
        options: ["Hamlet", "Macbeth", "King Lear", "Othello"],
        chainTags: ["theater", "Shakespeare", "tragedy", "classic"],
        chainHint: "royal drama"
      },
      {
        id: "art106",
        category: "arts",
        difficulty: 2,
        clues: [
          "Frank Lloyd Wright designed it as a continuous spiral ramp, breaking from traditional gallery room layouts",
          "Its exterior resembles an inverted ziggurat or a white ribbon wrapped into a cylinder",
          "Wright did not live to see its opening — he died six months before the museum welcomed its first visitors",
          "It opened in 1959 on Fifth Avenue in Manhattan as a permanent home for abstract and modern art",
          "The iconic spiral-shaped art museum in New York City designed by Frank Lloyd Wright"
        ],
        answer: "Guggenheim Museum",
        options: ["Guggenheim Museum", "Museum of Modern Art", "Whitney Museum", "Metropolitan Museum"],
        chainTags: ["architecture", "museum", "New York", "modern art"],
        chainHint: "modern design"
      },
      {
        id: "art107",
        category: "arts",
        difficulty: 2,
        clues: [
          "He recorded it in just one take after struggling with the lyrics for weeks in the studio",
          "Originally written as a slow, contemplative folk song, it was reimagined with a full band at the Newport Folk Festival",
          "The lyrics reference the Vietnam War, civil rights, and the shifting landscape of 1960s America",
          "He controversially went electric in 1965, scandalizing folk purists who called him a traitor",
          "The Nobel Prize-winning songwriter behind 'Blowin' in the Wind' and 'Like a Rolling Stone'"
        ],
        answer: "Bob Dylan",
        options: ["Bob Dylan", "Leonard Cohen", "Neil Young", "Woody Guthrie"],
        chainTags: ["music", "folk", "songwriter", "American"],
        chainHint: "protest songs"
      },
      {
        id: "art108",
        category: "arts",
        difficulty: 3,
        clues: [
          "The building's titanium-clad exterior panels shift color depending on the light and weather conditions",
          "Fish-shaped forms in the design reflect the architect's childhood memories visiting markets with his grandmother",
          "Its construction transformed a declining industrial city into a world-class cultural destination",
          "Frank Gehry used aerospace software (CATIA) to design its flowing, irregular metallic forms",
          "The spectacular Frank Gehry-designed art museum in Bilbao, Spain, that revitalized the city"
        ],
        answer: "Guggenheim Museum Bilbao",
        options: ["Guggenheim Museum Bilbao", "Centre Pompidou", "Tate Modern", "Sydney Opera House"],
        chainTags: ["architecture", "museum", "Spain", "contemporary"],
        chainHint: "deconstructivist design"
      }
    ],

    // ========================================================================
    // GEOGRAPHY POOL
    // ========================================================================
    geography: [
      {
        id: "geo101",
        category: "geography",
        difficulty: 2,
        clues: [
          "Its Great Barrier Reef, stretching over 2,300 kilometers, is the largest living structure visible from space",
          "Over 80% of its native mammals, reptiles, and frogs are found nowhere else on Earth",
          "It was originally colonized as a British penal settlement beginning in 1788",
          "Despite being a continent, its population of ~26 million is concentrated along the eastern and southeastern coasts",
          "The country-continent known for kangaroos, koalas, and the Sydney Opera House"
        ],
        answer: "Australia",
        options: ["Australia", "New Zealand", "South Africa", "Brazil"],
        chainTags: ["continent", "country", "Oceania", "wildlife"],
        chainHint: "down under"
      },
      {
        id: "geo102",
        category: "geography",
        difficulty: 3,
        clues: [
          "Its Dead Sea, shared with Jordan, sits at 430 meters below sea level, the lowest point on any continent",
          "The Sahara Desert covers about 25% of it and is roughly the same size as the United States",
          "Lake Victoria, the world's second-largest freshwater lake, is shared by three of its countries",
          "It is home to approximately 2,000 distinct languages — about one-third of the world's total",
          "The second-largest and second-most-populous continent, with 54 recognized countries"
        ],
        answer: "Africa",
        options: ["Africa", "Asia", "South America", "Europe"],
        chainTags: ["continent", "diversity", "languages", "geography"],
        chainHint: "cradle of humanity"
      },
      {
        id: "geo103",
        category: "geography",
        difficulty: 1,
        clues: [
          "Its caldera, measuring roughly 45 by 34 miles, sits atop a supervolcano that erupts roughly every 600,000 years",
          "Old Faithful geyser erupts approximately every 90 minutes, shooting water up to 185 feet high",
          "It was the world's first national park, established by Ulysses S. Grant in 1872",
          "It spans parts of Wyoming, Montana, and Idaho in the northwestern United States",
          "America's most famous national park, known for geysers, hot springs, and abundant wildlife"
        ],
        answer: "Yellowstone",
        options: ["Yellowstone", "Yosemite", "Grand Canyon", "Glacier National Park"],
        chainTags: ["national park", "volcano", "nature", "USA"],
        chainHint: "natural wonder"
      },
      {
        id: "geo104",
        category: "geography",
        difficulty: 2,
        clues: [
          "It was formed by the collision of the Indian subcontinent with the Eurasian plate beginning about 50 million years ago",
          "The range contains all 14 of the world's peaks exceeding 8,000 meters in elevation",
          "Its glaciers supply water to rivers that sustain over 1.5 billion people across South and East Asia",
          "It stretches 2,400 kilometers across five countries: India, Nepal, Bhutan, China, and Pakistan",
          "The world's highest mountain range, home to Mount Everest and K2"
        ],
        answer: "Himalayas",
        options: ["Himalayas", "Andes", "Alps", "Rockies"],
        chainTags: ["mountains", "Asia", "tectonic", "altitude"],
        chainHint: "roof of the world"
      },
      {
        id: "geo105",
        category: "geography",
        difficulty: 1,
        clues: [
          "It is the most biodiverse river basin on Earth, containing roughly 10% of all species on the planet",
          "If it were a country, its basin would be the ninth largest in the world by area",
          "Pink river dolphins, piranhas, and anacondas are among its most famous inhabitants",
          "It discharges more water into the ocean than the next seven largest rivers combined",
          "The longest (or second-longest) river in the world, flowing through the South American rainforest"
        ],
        answer: "Amazon River",
        options: ["Amazon River", "Nile River", "Congo River", "Yangtze River"],
        chainTags: ["river", "South America", "rainforest", "biodiversity"],
        chainHint: "lungs of the earth"
      },
      {
        id: "geo106",
        category: "geography",
        difficulty: 3,
        clues: [
          "It is the only country in the world that spans four hemispheres: north, south, east, and west",
          "With roughly 300 distinct ethnic groups speaking over 700 languages, it is one of the most diverse nations",
          "The Puncak Jaya glacier on its territory is one of only three equatorial glaciers in the world",
          "It is the world's largest archipelago, comprising over 17,000 islands stretching across 5,000 kilometers",
          "The Southeast Asian nation of thousands of islands, home to Bali, Java, and Sumatra"
        ],
        answer: "Indonesia",
        options: ["Indonesia", "Philippines", "Malaysia", "Thailand"],
        chainTags: ["country", "archipelago", "Asia", "diversity"],
        chainHint: "island chains"
      },
      {
        id: "geo107",
        category: "geography",
        difficulty: 2,
        clues: [
          "Its name derives from an Inuit word meaning 'deep water' and it is the world's largest fjord system",
          "Despite its icy name, it was given a misleading name by Erik the Red to attract settlers around 985 CE",
          "Its ice sheet, up to 3 kilometers thick, would raise global sea levels by about 7 meters if fully melted",
          "It gained home rule from Denmark in 1979 and self-governance in 2009, though Denmark retains foreign policy control",
          "The world's largest island (not counting continents), mostly covered by a massive ice sheet"
        ],
        answer: "Greenland",
        options: ["Greenland", "Iceland", "Antarctica", "Svalbard"],
        chainTags: ["island", "Arctic", "ice", "Denmark"],
        chainHint: "frozen frontier"
      },
      {
        id: "geo108",
        category: "geography",
        difficulty: 1,
        clues: [
          "Ferdinand de Lesseps oversaw its construction, which took 10 years and cost roughly 1.5 billion francs",
          "Before it existed, ships had to sail around the entire continent of Africa to travel between Europe and Asia",
          "It has no locks — the Mediterranean and Red Sea are at roughly the same elevation",
          "Connecting the Mediterranean Sea to the Red Sea, it reduced the London-to-Mumbai voyage by thousands of miles",
          "The famous man-made waterway in Egypt that connects two seas"
        ],
        answer: "Suez Canal",
        options: ["Suez Canal", "Panama Canal", "Erie Canal", "Grand Canal"],
        chainTags: ["waterway", "engineering", "Egypt", "trade"],
        chainHint: "shortcut"
      }
    ],

    // ========================================================================
    // SPORTS POOL
    // ========================================================================
    sports: [
      {
        id: "spo101",
        category: "sports",
        difficulty: 2,
        clues: [
          "His 'Hand of God' goal in the 1986 World Cup quarterfinal remains one of football's most controversial moments",
          "Just four minutes later, he scored what FIFA named the 'Goal of the Century,' dribbling past five English players",
          "He led Napoli to their only two Serie A titles, becoming a god-like figure in southern Italy",
          "He struggled with addiction but remained beloved, and Argentina declared three days of mourning at his death",
          "The Argentine football legend widely considered one of the greatest players of all time"
        ],
        answer: "Diego Maradona",
        options: ["Diego Maradona", "Lionel Messi", "Pele", "Zinedine Zidane"],
        chainTags: ["soccer", "legend", "Argentina", "World Cup"],
        chainHint: "football genius"
      },
      {
        id: "spo102",
        category: "sports",
        difficulty: 3,
        clues: [
          "Nadia Comaneci's perfect 10.0 at the 1976 Montreal Games was so unexpected the scoreboard could only display 1.0",
          "She was 14 years old at the time and scored seven perfect 10s across the competition",
          "This scoring achievement had never happened before in the history of the sport at the Olympic level",
          "Her performance on the uneven bars was the first to receive this score in Olympic competition",
          "The Romanian gymnast who achieved the first perfect score in Olympic gymnastics history"
        ],
        answer: "Nadia Comaneci",
        options: ["Nadia Comaneci", "Simone Biles", "Mary Lou Retton", "Olga Korbut"],
        chainTags: ["gymnastics", "Olympics", "perfect score", "legend"],
        chainHint: "perfect performance"
      },
      {
        id: "spo103",
        category: "sports",
        difficulty: 1,
        clues: [
          "He holds the record for fastest 100-meter sprint at 9.58 seconds, set at the 2009 World Championships in Berlin",
          "His 200-meter world record of 19.19 seconds from the same championships still stands",
          "He won the 'triple-triple' — gold in the 100m, 200m, and 4x100m relay at three consecutive Olympics",
          "His signature lightning-bolt victory pose became one of sport's most iconic celebrations",
          "The Jamaican sprinter known as the fastest man in history"
        ],
        answer: "Usain Bolt",
        options: ["Usain Bolt", "Carl Lewis", "Tyson Gay", "Yohan Blake"],
        chainTags: ["sprinting", "Olympics", "records", "Jamaica"],
        chainHint: "lightning speed"
      },
      {
        id: "spo104",
        category: "sports",
        difficulty: 2,
        clues: [
          "The All Blacks' pre-match haka, a Maori war dance, is one of sport's most iconic rituals",
          "It originated in England in 1823 when a student allegedly picked up the ball during a football game and ran",
          "The Webb Ellis Cup is awarded to the winner of its World Cup, held every four years",
          "A try is worth five points and a conversion kick after a try is worth two additional points",
          "The full-contact team sport played with an oval ball where players can carry and kick it to score tries"
        ],
        answer: "Rugby",
        options: ["Rugby", "American Football", "Australian Rules Football", "Gaelic Football"],
        chainTags: ["team sport", "contact", "international", "oval ball"],
        chainHint: "tackle sport"
      },
      {
        id: "spo105",
        category: "sports",
        difficulty: 3,
        clues: [
          "Bobby Fischer's victory over Boris Spassky in the 1972 'Match of the Century' became a Cold War symbol",
          "Deep Blue's defeat of Garry Kasparov in 1997 marked the first time a reigning world champion lost to a computer",
          "The current Elo rating system, used to rank players, was developed by Arpad Elo in the 1960s",
          "Each player starts with 16 pieces: one king, one queen, two rooks, two bishops, two knights, and eight pawns",
          "The ancient board game of strategy played on a checkered 64-square board"
        ],
        answer: "Chess",
        options: ["Chess", "Go", "Checkers", "Backgammon"],
        chainTags: ["strategy", "board game", "competition", "mind sport"],
        chainHint: "grandmaster"
      },
      {
        id: "spo106",
        category: "sports",
        difficulty: 1,
        clues: [
          "The scoring system of 15, 30, 40, and game has origins dating back to medieval France",
          "Wimbledon, the oldest tournament, has been played on grass courts since 1877",
          "The four Grand Slam tournaments are the Australian Open, French Open, Wimbledon, and US Open",
          "A match can be decided by tiebreakers, and some Grand Slam finals have lasted over 5 hours",
          "The racket sport played on a court divided by a net, with scoring terms like 'love,' 'deuce,' and 'ace'"
        ],
        answer: "Tennis",
        options: ["Tennis", "Badminton", "Squash", "Table Tennis"],
        chainTags: ["racket sport", "Grand Slam", "individual", "court"],
        chainHint: "court game"
      },
      {
        id: "spo107",
        category: "sports",
        difficulty: 2,
        clues: [
          "Tiger Woods won the 'Tiger Slam' by holding all four major trophies simultaneously in 2000-2001",
          "The Masters Tournament, held at Augusta National, awards the winner a famous green jacket",
          "Scotland is considered its birthplace, with the Old Course at St Andrews dating to the early 1400s",
          "A standard round consists of 18 holes, and the goal is to complete each in as few strokes as possible",
          "The sport where players use clubs to hit a small ball into holes across a landscaped course"
        ],
        answer: "Golf",
        options: ["Golf", "Polo", "Croquet", "Bowling"],
        chainTags: ["individual sport", "outdoors", "precision", "clubs"],
        chainHint: "green jacket"
      },
      {
        id: "spo108",
        category: "sports",
        difficulty: 2,
        clues: [
          "Wilt Chamberlain scored 100 points in a single NBA game on March 2, 1962 — a record that still stands",
          "The original 'Dream Team' of 1992, featuring Jordan, Magic, and Bird, is considered the greatest team ever assembled",
          "James Naismith invented it in 1891 at a YMCA in Springfield, Massachusetts, using peach baskets",
          "The NBA Finals is its premier championship series, held each June",
          "The sport played on a court with two hoops, where teams of five try to shoot a ball through a 10-foot basket"
        ],
        answer: "Basketball",
        options: ["Basketball", "Volleyball", "Handball", "Netball"],
        chainTags: ["team sport", "NBA", "court", "American"],
        chainHint: "hoops"
      }
    ],

    // ========================================================================
    // POP CULTURE POOL
    // ========================================================================
    popculture: [
      {
        id: "pop101",
        category: "popculture",
        difficulty: 2,
        clues: [
          "The original pilot was rejected by Fox before being reworked, and it nearly didn't survive its first season",
          "It features a time-travel element that resets the timeline, creating an alternate universe that splits the fanbase",
          "J.J. Abrams created it after ABC asked for a castaway-themed drama following the success of reality TV",
          "The mystery of the island's smoke monster, the Others, and the Dharma Initiative drove obsessive theorizing",
          "The ABC drama about plane crash survivors on a mysterious island that became a cultural phenomenon"
        ],
        answer: "Lost",
        options: ["Lost", "The Leftovers", "Manifest", "Yellowjackets"],
        chainTags: ["TV", "mystery", "drama", "cultural phenomenon"],
        chainHint: "island mystery"
      },
      {
        id: "pop102",
        category: "popculture",
        difficulty: 1,
        clues: [
          "The Eras Tour became the highest-grossing concert tour of all time, surpassing $1 billion in revenue",
          "She re-recorded her first six albums after a dispute over master recording ownership",
          "Her transition from country to pop with the album 1989 was one of music's most successful genre pivots",
          "She has won more Album of the Year Grammys than any other artist in history",
          "The singer-songwriter behind 'Shake It Off,' 'Love Story,' and 'Anti-Hero'"
        ],
        answer: "Taylor Swift",
        options: ["Taylor Swift", "Adele", "Billie Eilish", "Ariana Grande"],
        chainTags: ["music", "pop", "celebrity", "singer"],
        chainHint: "pop icon"
      },
      {
        id: "pop103",
        category: "popculture",
        difficulty: 3,
        clues: [
          "Satoshi Nakamoto, the pseudonymous creator, published its whitepaper on October 31, 2008",
          "The genesis block, mined on January 3, 2009, contained a headline from The Times about bank bailouts",
          "Its supply is capped at 21 million units, with the last one expected to be mined around 2140",
          "Mining it requires solving cryptographic puzzles and consumes more electricity than some countries",
          "The first and most valuable cryptocurrency, created as a decentralized digital alternative to traditional money"
        ],
        answer: "Bitcoin",
        options: ["Bitcoin", "Ethereum", "Dogecoin", "Litecoin"],
        chainTags: ["cryptocurrency", "technology", "finance", "digital"],
        chainHint: "digital gold"
      },
      {
        id: "pop104",
        category: "popculture",
        difficulty: 1,
        clues: [
          "The cast filmed for 10 seasons on the same soundstage at Warner Bros. Studio in Burbank",
          "Central Perk, the coffee shop where they gathered, became an iconic fictional hangout",
          "The finale in 2004 drew 52.5 million viewers, making it one of the most-watched episodes in TV history",
          "Catchphrases like 'We were on a break!' and 'How you doin'?' entered everyday language",
          "The 1990s-2000s sitcom about six pals living in New York City — Ross, Rachel, Monica, Chandler, Joey, and Phoebe"
        ],
        answer: "Friends",
        options: ["Friends", "Seinfeld", "How I Met Your Mother", "The Big Bang Theory"],
        chainTags: ["TV", "sitcom", "90s", "classic"],
        chainHint: "laugh track"
      },
      {
        id: "pop105",
        category: "popculture",
        difficulty: 2,
        clues: [
          "Hayao Miyazaki came out of retirement multiple times to direct new films for the studio",
          "Spirited Away won the Academy Award for Best Animated Feature in 2003, a first for a non-English-language film",
          "The studio's hand-drawn animation style deliberately resists the industry's shift to CGI",
          "Its films often feature strong female protagonists and themes of environmentalism and pacifism",
          "The legendary Japanese animation studio behind My Neighbor Totoro and Princess Mononoke"
        ],
        answer: "Studio Ghibli",
        options: ["Studio Ghibli", "Pixar", "DreamWorks Animation", "Toei Animation"],
        chainTags: ["animation", "Japanese", "film", "studio"],
        chainHint: "animated worlds"
      },
      {
        id: "pop106",
        category: "popculture",
        difficulty: 2,
        clues: [
          "It was originally called 'Facemash' and compared photos of Harvard students side by side",
          "Mark Zuckerberg launched it from his Harvard dorm room in February 2004",
          "The 2010 film The Social Network dramatized its founding and the lawsuits that followed",
          "It rebranded its parent company to Meta in 2021, signaling a pivot toward virtual reality",
          "The social media platform with billions of users where people share posts, photos, and connect with friends"
        ],
        answer: "Facebook",
        options: ["Facebook", "Twitter", "MySpace", "LinkedIn"],
        chainTags: ["social media", "technology", "Silicon Valley", "platform"],
        chainHint: "connected world"
      },
      {
        id: "pop107",
        category: "popculture",
        difficulty: 1,
        clues: [
          "Emilia Clarke and Kit Harington became global stars for their roles as Daenerys Targaryen and Jon Snow",
          "It holds the record for most Emmy Awards won by a drama series, with 59 total",
          "The show was based on George R.R. Martin's A Song of Ice and Fire book series",
          "Its final season in 2019 drew both record viewership and intense fan controversy",
          "The HBO fantasy epic featuring dragons, the Iron Throne, and the motto 'Winter Is Coming'"
        ],
        answer: "Game of Thrones",
        options: ["Game of Thrones", "The Witcher", "Lord of the Rings", "House of the Dragon"],
        chainTags: ["TV", "fantasy", "HBO", "drama"],
        chainHint: "throne of swords"
      },
      {
        id: "pop108",
        category: "popculture",
        difficulty: 2,
        clues: [
          "The augmented reality game caused a global sensation in the summer of 2016, with millions exploring outdoors",
          "Central Park in New York City and the Santa Monica Pier became famous hotspots where players gathered",
          "It used GPS and phone cameras to overlay digital creatures onto real-world locations",
          "Niantic developed it in partnership with The Pokemon Company and Nintendo",
          "The mobile game that had millions of people walking around outside catching virtual creatures in 2016"
        ],
        answer: "Pokemon Go",
        options: ["Pokemon Go", "Ingress", "Pikmin Bloom", "Geocaching"],
        chainTags: ["gaming", "mobile", "AR", "phenomenon"],
        chainHint: "gotta catch 'em all"
      }
    ]
  }
};

// Make available globally for browser use and as a module export
if (typeof module !== "undefined" && module.exports) {
  module.exports = QUESTIONS;
}
