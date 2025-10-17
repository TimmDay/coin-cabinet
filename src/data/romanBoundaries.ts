// Types for historical Roman boundary data

export type TimePeriod = {
  id: string
  name: string
  year: number
  description?: string
  boundaries: GeoJSON.FeatureCollection
}

export type ProvinceProperties = {
  name: string
  latinName: string
  governor?: string
  capital?: string
  established?: number
  notes?: string
}

// Sample GeoJSON boundaries for different Roman periods
// Note: These are simplified test boundaries for demonstration
// Real historical data would be much more detailed and accurate

const EARLY_REPUBLIC_BOUNDARIES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Latium",
        latinName: "Latium",
        capital: "Roma",
        established: -753,
        notes: "Original Roman territory, cradle of Roman civilization"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[12.0, 41.5], [13.5, 41.5], [13.5, 42.2], [12.0, 42.2], [12.0, 41.5]]]
      }
    },
    {
      type: "Feature", 
      properties: {
        name: "Campania",
        latinName: "Campania",
        capital: "Capua",
        established: -340,
        notes: "Rich agricultural region, Roman ally"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[13.5, 40.5], [15.0, 40.5], [15.0, 41.5], [13.5, 41.5], [13.5, 40.5]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Etruria", 
        latinName: "Etruria",
        capital: "Tarquinii",
        established: -295,
        notes: "Former Etruscan territories, conquered by Rome"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[11.0, 42.0], [12.5, 42.0], [12.5, 43.5], [11.0, 43.5], [11.0, 42.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Umbria",
        latinName: "Umbria", 
        capital: "Spoletium",
        established: -295,
        notes: "Central Italian mountain region"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[12.0, 42.5], [13.5, 42.5], [13.5, 43.5], [12.0, 43.5], [12.0, 42.5]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Samnium",
        latinName: "Samnium",
        capital: "Bovianum",
        established: -290,
        notes: "Mountainous region of the Samnites"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[14.0, 41.0], [15.5, 41.0], [15.5, 42.0], [14.0, 42.0], [14.0, 41.0]]]
      }
    }
  ]
}

const LATE_REPUBLIC_BOUNDARIES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    // Italian Peninsula (Ager Romanus expanded)
    {
      type: "Feature",
      properties: {
        name: "Italy",
        latinName: "Italia",
        governor: "Direct Roman administration",
        capital: "Roma",
        established: -264,
        notes: "Italian peninsula, fully incorporated into Roman state"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[6.5, 36.0], [18.5, 36.0], [18.5, 47.0], [6.5, 47.0], [6.5, 36.0]]]
      }
    },
    // Gallic Provinces
    {
      type: "Feature",
      properties: {
        name: "Gallia Cisalpina",
        latinName: "Gallia Cisalpina",
        governor: "Proconsul",
        capital: "Mediolanum",
        established: -81,
        notes: "Gaul on this side of the Alps"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[6.5, 44.0], [12.0, 44.0], [12.0, 47.0], [6.5, 47.0], [6.5, 44.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Gallia Narbonensis", 
        latinName: "Gallia Narbonensis",
        governor: "Proconsul",
        capital: "Narbo Martius",
        established: -121,
        notes: "Roman Province in southern Gaul"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[2.0, 42.5], [6.5, 42.5], [6.5, 45.5], [2.0, 45.5], [2.0, 42.5]]]
      }
    },
    // Hispanic Provinces
    {
      type: "Feature",
      properties: {
        name: "Hispania Citerior",
        latinName: "Hispania Citerior",
        governor: "Proconsul", 
        capital: "Tarraco",
        established: -197,
        notes: "Nearer Spain, eastern and northern regions"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-2.0, 39.0], [3.0, 39.0], [3.0, 43.0], [-2.0, 43.0], [-2.0, 39.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Hispania Ulterior",
        latinName: "Hispania Ulterior",
        governor: "Proconsul",
        capital: "Corduba", 
        established: -197,
        notes: "Further Spain, southern and western regions"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-7.0, 36.0], [-2.0, 36.0], [-2.0, 39.0], [-7.0, 39.0], [-7.0, 36.0]]]
      }
    },
    // Mediterranean Islands
    {
      type: "Feature",
      properties: {
        name: "Sicilia",
        latinName: "Sicilia",
        governor: "Praetor",
        capital: "Syracusae",
        established: -241,
        notes: "First Roman province, conquered from Carthage"
      },
      geometry: {
        type: "Polygon", 
        coordinates: [[[12.0, 36.5], [15.5, 36.5], [15.5, 38.5], [12.0, 38.5], [12.0, 36.5]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Sardinia et Corsica",
        latinName: "Sardinia et Corsica",
        governor: "Praetor",
        capital: "Caralis",
        established: -238,
        notes: "Second Roman province"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[8.0, 38.8], [10.0, 38.8], [10.0, 43.0], [8.0, 43.0], [8.0, 38.8]]]
      }
    },
    // Eastern Provinces
    {
      type: "Feature",
      properties: {
        name: "Macedonia",
        latinName: "Macedonia",
        governor: "Proconsul",
        capital: "Thessalonica",
        established: -146,
        notes: "Former kingdom of Alexander the Great"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[20.0, 39.0], [26.0, 39.0], [26.0, 42.5], [20.0, 42.5], [20.0, 39.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Achaea", 
        latinName: "Achaea",
        governor: "Proconsul",
        capital: "Corinthus",
        established: -146,
        notes: "Southern Greece, formed after Corinth's destruction"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[19.0, 36.0], [24.0, 36.0], [24.0, 39.0], [19.0, 39.0], [19.0, 36.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Asia",
        latinName: "Asia",
        governor: "Proconsul",
        capital: "Pergamon",
        established: -133,
        notes: "Western Anatolia, richest Roman province"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[26.0, 36.0], [32.0, 36.0], [32.0, 40.5], [26.0, 40.5], [26.0, 36.0]]]
      }
    },
    // African Provinces
    {
      type: "Feature",
      properties: {
        name: "Africa",
        latinName: "Africa Proconsularis",
        governor: "Proconsul",
        capital: "Utica",
        established: -146,
        notes: "Territory of destroyed Carthage"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[8.0, 30.0], [12.0, 30.0], [12.0, 37.0], [8.0, 37.0], [8.0, 30.0]]]
      }
    }
  ]
}

const TRAJAN_BOUNDARIES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    // Italian Peninsula
    {
      type: "Feature",
      properties: {
        name: "Italia",
        latinName: "Italia",
        governor: "Direct Imperial administration",
        capital: "Roma",
        established: -264,
        notes: "Heart of the Roman Empire"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[6.5, 36.0], [18.5, 36.0], [18.5, 47.0], [6.5, 47.0], [6.5, 36.0]]]
      }
    },
    // Western Provinces
    {
      type: "Feature",
      properties: {
        name: "Britannia",
        latinName: "Britannia",
        governor: "Legatus Augusti pro praetore", 
        capital: "Londinium",
        established: 43,
        notes: "Island province, Hadrian's Wall northern border"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-5.2, 49.9], // SW Cornwall
          [-4.8, 50.1], // Devon
          [-3.2, 50.7], // Somerset
          [-1.5, 50.8], // Hampshire
          [1.4, 51.3],  // Kent
          [1.8, 52.9],  // Norfolk
          [0.8, 53.4],  // Lincolnshire
          [-0.5, 54.0], // Yorkshire
          [-2.8, 54.7], // Lake District
          [-3.2, 55.8], // Southern Scotland (Hadrian's Wall)
          [-4.5, 55.7], // Galloway
          [-5.1, 56.0], // Ayrshire
          [-4.8, 56.8], // Highlands edge
          [-2.5, 57.1], // Moray Firth
          [-1.8, 56.0], // Aberdeenshire
          [-2.2, 55.0], // Borders
          [-3.0, 54.4], // Cumbria
          [-4.2, 53.2], // Irish Sea
          [-5.5, 51.9], // SW Wales
          [-4.8, 51.2], // Pembrokeshire
          [-3.8, 51.6], // Brecon
          [-3.1, 51.0], // Cardiff
          [-4.2, 50.4], // Exmoor
          [-5.2, 49.9]  // Back to start
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Gallia Lugdunensis",
        latinName: "Gallia Lugdunensis",
        governor: "Legatus Augusti pro praetore",
        capital: "Lugdunum",
        established: -27,
        notes: "Central Gaul, administrative center"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-2.0, 45.5], [6.0, 45.5], [6.0, 50.0], [-2.0, 50.0], [-2.0, 45.5]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Gallia Belgica",
        latinName: "Gallia Belgica",
        governor: "Legatus Augusti pro praetore",
        capital: "Augusta Treverorum",
        established: -27,
        notes: "Northern Gaul and Rhine frontier"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[2.0, 48.0], [8.5, 48.0], [8.5, 52.0], [2.0, 52.0], [2.0, 48.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Gallia Narbonensis",
        latinName: "Gallia Narbonensis",
        governor: "Proconsul",
        capital: "Narbo Martius",
        established: -121,
        notes: "Southern Gaul, highly Romanized"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [1.8, 42.6],  // Eastern Pyrenees
          [3.0, 42.5],  // Roussillon
          [4.8, 43.2],  // Marseille area
          [6.2, 43.1],  // Côte d'Azur
          [7.4, 43.7],  // Nice region
          [7.0, 44.1],  // Maritime Alps
          [6.8, 44.5],  // Gap region
          [6.2, 45.0],  // Grenoble area
          [5.7, 45.2],  // Chambéry
          [5.0, 45.6],  // Lyon approach
          [4.2, 45.8],  // Mâcon region
          [3.5, 46.2],  // Chalon-sur-Saône
          [2.8, 46.0],  // Nevers area
          [2.2, 45.5],  // Clermont approach
          [1.8, 45.0],  // Aurillac region
          [1.2, 44.2],  // Cahors area  
          [0.8, 43.5],  // Toulouse region
          [0.2, 43.0],  // Foix area
          [0.5, 42.7],  // Andorra approach
          [1.8, 42.6]   // Back to start
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Hispania Tarraconensis", 
        latinName: "Hispania Tarraconensis",
        governor: "Legatus Augusti pro praetore",
        capital: "Tarraco",
        established: -27,
        notes: "Largest Spanish province"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-2.0, 39.0], [3.0, 39.0], [3.0, 44.0], [-2.0, 44.0], [-2.0, 39.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Hispania Baetica",
        latinName: "Hispania Baetica",
        governor: "Proconsul",
        capital: "Corduba",
        established: -27,
        notes: "Wealthy southern Spain"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-7.4, 37.0], // Huelva region
          [-6.2, 36.0], // Cádiz area
          [-5.6, 36.1], // Gibraltar approach
          [-4.8, 36.2], // Málaga region
          [-3.8, 36.7], // Granada approach
          [-2.6, 36.8], // Almería region
          [-1.9, 37.2], // Murcia approach
          [-1.2, 38.0], // Albacete region
          [-2.1, 38.8], // Ciudad Real
          [-3.7, 39.5], // Toledo approach
          [-4.8, 39.2], // Cáceres region
          [-5.9, 38.5], // Badajoz area
          [-6.8, 38.0], // Huelva interior
          [-7.4, 37.0]  // Back to coast
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Lusitania",
        latinName: "Lusitania",
        governor: "Legatus Augusti pro praetore",
        capital: "Augusta Emerita",
        established: -27,
        notes: "Western Iberian province"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-9.5, 37.0], [-6.0, 37.0], [-6.0, 42.0], [-9.5, 42.0], [-9.5, 37.0]]]
      }
    },
    // Germanic and Danubian Provinces
    {
      type: "Feature",
      properties: {
        name: "Germania Superior",
        latinName: "Germania Superior", 
        governor: "Legatus Augusti pro praetore",
        capital: "Mogontiacum",
        established: 83,
        notes: "Upper Rhine frontier province"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[6.0, 46.0], [10.0, 46.0], [10.0, 50.0], [6.0, 50.0], [6.0, 46.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Germania Inferior",
        latinName: "Germania Inferior",
        governor: "Legatus Augusti pro praetore", 
        capital: "Colonia Claudia Ara Agrippinensium",
        established: 83,
        notes: "Lower Rhine frontier province"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[4.0, 50.0], [8.0, 50.0], [8.0, 53.0], [4.0, 53.0], [4.0, 50.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Raetia",
        latinName: "Raetia",
        governor: "Procurator",
        capital: "Augusta Vindelicum",
        established: -15,
        notes: "Alpine province between Rhine and Danube"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[8.0, 45.5], [13.0, 45.5], [13.0, 48.5], [8.0, 48.5], [8.0, 45.5]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Noricum",
        latinName: "Noricum",
        governor: "Procurator",
        capital: "Virunum",
        established: 16,
        notes: "Alpine province, source of iron and gold"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[12.0, 45.5], [16.5, 45.5], [16.5, 48.5], [12.0, 48.5], [12.0, 45.5]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Pannonia Superior",
        latinName: "Pannonia Superior",
        governor: "Legatus Augusti pro praetore",
        capital: "Carnuntum",
        established: 103,
        notes: "Upper Pannonia, Danubian frontier"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[15.0, 45.0], [19.0, 45.0], [19.0, 48.5], [15.0, 48.5], [15.0, 45.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Pannonia Inferior",
        latinName: "Pannonia Inferior",
        governor: "Legatus Augusti pro praetore",
        capital: "Aquincum",
        established: 103,
        notes: "Lower Pannonia, Danubian frontier"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[18.0, 44.0], [22.0, 44.0], [22.0, 47.5], [18.0, 47.5], [18.0, 44.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Dacia",
        latinName: "Dacia",
        governor: "Legatus Augusti pro praetore",
        capital: "Sarmizegetusa Ulpia Traiana",
        established: 106,
        notes: "Trajan's conquest, rich in gold and silver"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[20.0, 44.0], [28.0, 44.0], [28.0, 48.0], [20.0, 48.0], [20.0, 44.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Moesia Superior",
        latinName: "Moesia Superior",
        governor: "Legatus Augusti pro praetore",
        capital: "Viminacium",
        established: 86,
        notes: "Upper Moesia, Danubian defense line"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[18.0, 42.0], [23.0, 42.0], [23.0, 45.0], [18.0, 45.0], [18.0, 42.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Moesia Inferior",
        latinName: "Moesia Inferior",
        governor: "Legatus Augusti pro praetore",
        capital: "Novae",
        established: 86,
        notes: "Lower Moesia, controls Danube mouth"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[22.0, 42.5], [29.0, 42.5], [29.0, 46.0], [22.0, 46.0], [22.0, 42.5]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Thracia",
        latinName: "Thracia",
        governor: "Procurator",
        capital: "Philippopolis",
        established: 46,
        notes: "Strategic province controlling Bosphorus approaches"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[23.0, 40.0], [29.0, 40.0], [29.0, 43.0], [23.0, 43.0], [23.0, 40.0]]]
      }
    },
    // Greek and Balkan Provinces
    {
      type: "Feature",
      properties: {
        name: "Macedonia",
        latinName: "Macedonia",
        governor: "Proconsul",
        capital: "Thessalonica",
        established: -146,
        notes: "Strategic province controlling Via Egnatia"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[20.0, 39.0], [26.0, 39.0], [26.0, 42.5], [20.0, 42.5], [20.0, 39.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Achaea",
        latinName: "Achaea",
        governor: "Proconsul", 
        capital: "Corinthus",
        established: -146,
        notes: "Southern Greece, cultural center"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[19.0, 36.0], [24.0, 36.0], [24.0, 39.0], [19.0, 39.0], [19.0, 36.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Epirus",
        latinName: "Epirus",
        governor: "Part of Macedonia",
        capital: "Nicopolis",
        established: -146,
        notes: "Western Greece and Albania"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[18.0, 38.0], [21.0, 38.0], [21.0, 41.0], [18.0, 41.0], [18.0, 38.0]]]
      }
    },
    // Anatolian Provinces
    {
      type: "Feature",
      properties: {
        name: "Asia",
        latinName: "Asia",
        governor: "Proconsul",
        capital: "Ephesus",
        established: -133,
        notes: "Richest province, western Anatolia"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [26.0, 36.2], // Rhodes approach
          [28.1, 36.0], // Lycian coast
          [29.0, 36.1], // Antalya region
          [30.8, 36.3], // Pamphylian coast
          [32.0, 36.8], // Cilician approach
          [31.8, 37.5], // Cappadocian border
          [30.5, 38.2], // Galatian border
          [29.2, 39.1], // Bithynian approach
          [28.0, 40.2], // Sea of Marmara
          [26.8, 40.1], // Dardanelles
          [26.2, 39.4], // Lesbos region  
          [25.8, 38.5], // Chios area
          [26.9, 37.8], // Samos region
          [27.3, 37.0], // Dodecanese
          [26.0, 36.2]  // Back to start
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Bithynia et Pontus",
        latinName: "Bithynia et Pontus",
        governor: "Proconsul",
        capital: "Nicomedia",
        established: -74,
        notes: "Northern Anatolia, Black Sea coast"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[28.0, 40.0], [36.0, 40.0], [36.0, 42.5], [28.0, 42.5], [28.0, 40.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Galatia",
        latinName: "Galatia",
        governor: "Legatus Augusti pro praetore",
        capital: "Ancyra",
        established: -25,
        notes: "Central Anatolia, former Celtic kingdom"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[30.0, 38.5], [36.0, 38.5], [36.0, 41.0], [30.0, 41.0], [30.0, 38.5]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Cappadocia",
        latinName: "Cappadocia",
        governor: "Legatus Augusti pro praetore",
        capital: "Caesarea Mazaca",
        established: 17,
        notes: "Eastern Anatolia, Armenian frontier"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[34.0, 36.0], [40.0, 36.0], [40.0, 40.0], [34.0, 40.0], [34.0, 36.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Lycia et Pamphylia",
        latinName: "Lycia et Pamphylia",
        governor: "Procurator",
        capital: "Perge",
        established: 43,
        notes: "Southern Anatolia coast"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[28.0, 35.5], [33.0, 35.5], [33.0, 37.5], [28.0, 37.5], [28.0, 35.5]]]
      }
    },
    // Eastern Provinces
    {
      type: "Feature",
      properties: {
        name: "Syria",
        latinName: "Syria",
        governor: "Legatus Augusti pro praetore",
        capital: "Antiocheia",
        established: -64,
        notes: "Major eastern province, trade hub"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[35.0, 32.0], [40.0, 32.0], [40.0, 37.0], [35.0, 37.0], [35.0, 32.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Mesopotamia",
        latinName: "Mesopotamia",
        governor: "Legatus Augusti pro praetore",
        capital: "Nisibis",
        established: 114,
        notes: "Trajan's eastern conquest, between Tigris and Euphrates"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[40.0, 32.0], [48.0, 32.0], [48.0, 38.0], [40.0, 38.0], [40.0, 32.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Armenia",
        latinName: "Armenia",
        governor: "Client Kingdom/Legatus",
        capital: "Artaxata",
        established: 114,
        notes: "Briefly conquered by Trajan"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[38.0, 38.0], [46.0, 38.0], [46.0, 42.0], [38.0, 42.0], [38.0, 38.0]]]
      }
    },
    // Levantine Provinces  
    {
      type: "Feature",
      properties: {
        name: "Iudaea",
        latinName: "Iudaea",
        governor: "Legatus Augusti pro praetore",
        capital: "Caesarea Maritima",
        established: 6,
        notes: "Judea, frequently rebellious province"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[34.0, 31.0], [36.0, 31.0], [36.0, 33.5], [34.0, 33.5], [34.0, 31.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Arabia Petraea",
        latinName: "Arabia Petraea",
        governor: "Legatus Augusti pro praetore",
        capital: "Bostra",
        established: 106,
        notes: "Nabataean kingdom, trade route control"
      },
      geometry: {
        type: "Polygon", 
        coordinates: [[[35.0, 25.0], [40.0, 25.0], [40.0, 32.0], [35.0, 32.0], [35.0, 25.0]]]
      }
    },
    // Egyptian and African Provinces
    {
      type: "Feature",
      properties: {
        name: "Aegyptus",
        latinName: "Aegyptus",
        governor: "Praefectus Aegypti",
        capital: "Alexandria", 
        established: -30,
        notes: "Grain supplier, directly ruled by Emperor"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [25.0, 22.0], // Aswan (First Cataract)
          [32.9, 22.0], // Eastern desert to Red Sea
          [34.2, 23.5], // Red Sea coast
          [34.8, 25.0], // Sinai approach
          [34.5, 27.0], // Gaza approach
          [33.8, 29.0], // Pelusium region
          [32.5, 30.0], // Eastern Delta
          [31.2, 31.2], // Alexandria
          [29.5, 31.4], // Western Delta
          [28.0, 30.8], // Libyan desert edge
          [26.8, 29.5], // Fayyum
          [25.8, 28.0], // Western desert
          [25.2, 26.0], // Nile valley
          [25.0, 24.0], // Upper Egypt
          [25.0, 22.0]  // Back to Aswan
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Cyrenaica",
        latinName: "Cyrenaica",
        governor: "Proconsul (with Creta)",
        capital: "Cyrene",
        established: -96,
        notes: "Eastern Libya, combined with Crete"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[20.0, 30.0], [25.0, 30.0], [25.0, 33.0], [20.0, 33.0], [20.0, 30.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Africa Proconsularis",
        latinName: "Africa Proconsularis",
        governor: "Proconsul",
        capital: "Carthago",
        established: -146,
        notes: "Tunisia, rebuilt Carthage as provincial capital"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[8.0, 30.0], [12.0, 30.0], [12.0, 37.0], [8.0, 37.0], [8.0, 30.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Numidia",
        latinName: "Numidia", 
        governor: "Legatus Augusti pro praetore",
        capital: "Lambesis",
        established: 46,
        notes: "Algeria, former Berber kingdom"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[0.0, 28.0], [8.0, 28.0], [8.0, 36.0], [0.0, 36.0], [0.0, 28.0]]]
      }
    },
    {
      type: "Feature", 
      properties: {
        name: "Mauretania Tingitana",
        latinName: "Mauretania Tingitana",
        governor: "Procurator",
        capital: "Tingis",
        established: 44,
        notes: "Northern Morocco"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-6.0, 32.0], [-2.0, 32.0], [-2.0, 36.0], [-6.0, 36.0], [-6.0, 32.0]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Mauretania Caesariensis",
        latinName: "Mauretania Caesariensis", 
        governor: "Procurator",
        capital: "Caesarea",
        established: 44,
        notes: "Western Algeria"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[-2.0, 30.0], [2.0, 30.0], [2.0, 36.0], [-2.0, 36.0], [-2.0, 30.0]]]
      }
    },
    // Mediterranean Islands
    {
      type: "Feature",
      properties: {
        name: "Sicilia",
        latinName: "Sicilia",
        governor: "Praetor",
        capital: "Syracusae",
        established: -241,
        notes: "First Roman province"
      },
      geometry: {
        type: "Polygon", 
        coordinates: [[[12.0, 36.5], [15.5, 36.5], [15.5, 38.5], [12.0, 38.5], [12.0, 36.5]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Sardinia et Corsica",
        latinName: "Sardinia et Corsica",
        governor: "Praetor",
        capital: "Caralis",
        established: -238,
        notes: "Strategic islands controlling western Mediterranean"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[8.0, 38.8], [10.0, 38.8], [10.0, 43.0], [8.0, 43.0], [8.0, 38.8]]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Creta et Cyrenaica",
        latinName: "Creta et Cyrenaica",
        governor: "Proconsul",
        capital: "Gortyn",
        established: -67,
        notes: "Crete and Cyrenaica administered together"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[23.0, 34.5], [26.5, 34.5], [26.5, 36.0], [23.0, 36.0], [23.0, 34.5]]]
      }
    }
  ]
}

const SEVERUS_EARLY_BOUNDARIES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    // Using improved Trajan boundaries as base, with some territorial adjustments
    // Italia remains the same
    {
      type: "Feature",
      properties: {
        name: "Italy",
        latinName: "Italia",
        governor: "Direct Imperial administration",
        capital: "Roma",
        established: -264,
        notes: "Heart of the Roman Empire under the Severan dynasty"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [6.5, 36.0], [18.5, 36.0], [18.5, 47.0], [6.5, 47.0], [6.5, 36.0]
        ]]
      }
    },
    // Britannia - same as Trajan but with more Antonine Wall influence
    {
      type: "Feature",
      properties: {
        name: "Britannia",
        latinName: "Britannia",
        governor: "Legatus Augusti pro praetore",
        capital: "Londinium", 
        established: 43,
        notes: "Island province under Severan rule, Antonine Wall abandoned"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-5.2, 49.9], [-4.8, 50.1], [-3.2, 50.7], [-1.5, 50.8], [1.4, 51.3], [1.8, 52.9],
          [0.8, 53.4], [-0.5, 54.0], [-2.8, 54.7], [-3.2, 55.8], [-4.5, 55.7], [-5.1, 56.0],
          [-4.8, 56.8], [-2.5, 57.1], [-1.8, 56.0], [-2.2, 55.0], [-3.0, 54.4], [-4.2, 53.2],
          [-5.5, 51.9], [-4.8, 51.2], [-3.8, 51.6], [-3.1, 51.0], [-4.2, 50.4], [-5.2, 49.9]
        ]]
      }
    },
    // Dacia - Still held at start of Severus reign
    {
      type: "Feature",
      properties: {
        name: "Dacia",
        latinName: "Dacia",
        governor: "Legatus Augusti pro praetore",
        capital: "Sarmizegetusa Ulpia Traiana",
        established: 106,
        notes: "Trajan's conquest, still Roman under early Severus"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[20.0, 44.0], [28.0, 44.0], [28.0, 48.0], [20.0, 48.0], [20.0, 44.0]]]
      }
    },
    // Syria - Severus' home province, very important
    {
      type: "Feature",
      properties: {
        name: "Syria",
        latinName: "Syria",
        governor: "Legatus Augusti pro praetore",
        capital: "Antiocheia",
        established: -64,
        notes: "Severus' powerbase, divided into Syria Coele and Syria Phoenice"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[35.0, 32.0], [40.0, 32.0], [40.0, 37.0], [35.0, 37.0], [35.0, 32.0]]]
      }
    },
    // Aegyptus with natural boundaries
    {
      type: "Feature",
      properties: {
        name: "Aegyptus",
        latinName: "Aegyptus",
        governor: "Praefectus Aegypti",
        capital: "Alexandria",
        established: -30,
        notes: "Key grain province under Severan rule"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [25.0, 22.0], [32.9, 22.0], [34.2, 23.5], [34.8, 25.0], [34.5, 27.0],
          [33.8, 29.0], [32.5, 30.0], [31.2, 31.2], [29.5, 31.4], [28.0, 30.8],
          [26.8, 29.5], [25.8, 28.0], [25.2, 26.0], [25.0, 24.0], [25.0, 22.0]
        ]]
      }
    }
  ]
}

const SEVERUS_LATE_BOUNDARIES: GeoJSON.FeatureCollection = {
  type: "FeatureCollection", 
  features: [
    // All provinces from early reign plus new divisions
    {
      type: "Feature",
      properties: {
        name: "Italy",
        latinName: "Italia",
        governor: "Direct Imperial administration", 
        capital: "Roma",
        established: -264,
        notes: "Heart of the Roman Empire, Severan dynasty zenith"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [6.5, 36.0], [18.5, 36.0], [18.5, 47.0], [6.5, 47.0], [6.5, 36.0]
        ]]
      }
    },
    // Britannia divided into Superior and Inferior
    {
      type: "Feature", 
      properties: {
        name: "Britannia Superior",
        latinName: "Britannia Superior",
        governor: "Legatus Augusti pro praetore",
        capital: "Londinium",
        established: 197,
        notes: "Upper Britain, southern portion after Severan division"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-5.2, 49.9], [-4.8, 50.1], [-3.2, 50.7], [-1.5, 50.8], [1.4, 51.3],
          [1.8, 52.9], [0.8, 53.4], [-0.5, 54.0], [-2.8, 54.0], [-4.2, 53.2], 
          [-5.5, 51.9], [-4.8, 51.2], [-3.8, 51.6], [-3.1, 51.0], [-4.2, 50.4], [-5.2, 49.9]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Britannia Inferior", 
        latinName: "Britannia Inferior",
        governor: "Praeses",
        capital: "Eboracum",
        established: 197,
        notes: "Lower Britain, northern portion after Severan division"
      },
      geometry: {
        type: "Polygon", 
        coordinates: [[
          [-2.8, 54.0], [-0.5, 54.0], [-2.8, 54.7], [-3.2, 55.8], [-4.5, 55.7],
          [-5.1, 56.0], [-4.8, 56.8], [-2.5, 57.1], [-1.8, 56.0], [-2.2, 55.0], 
          [-3.0, 54.4], [-2.8, 54.0]
        ]]
      }
    },
    // Syria divided into Coele and Phoenice
    {
      type: "Feature",
      properties: {
        name: "Syria Coele",
        latinName: "Syria Coele", 
        governor: "Legatus Augusti pro praetore",
        capital: "Antiocheia",
        established: 194,
        notes: "Hollow Syria, northern portion of Syrian division"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[35.0, 34.5], [40.0, 34.5], [40.0, 37.0], [35.0, 37.0], [35.0, 34.5]]]
      }
    },
    {
      type: "Feature", 
      properties: {
        name: "Syria Phoenice",
        latinName: "Syria Phoenice",
        governor: "Praeses",
        capital: "Tyrus",
        established: 194,
        notes: "Phoenician Syria, coastal region with major trading cities"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[35.0, 32.0], [37.5, 32.0], [37.5, 34.5], [35.0, 34.5], [35.0, 32.0]]]
      }
    },
    // Mesopotamia retained from Trajan, secured by Severus
    {
      type: "Feature",
      properties: {
        name: "Mesopotamia",
        latinName: "Mesopotamia", 
        governor: "Legatus Augusti pro praetore",
        capital: "Nisibis",
        established: 114,
        notes: "Reconquered and secured by Severus after Parthian wars"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[40.0, 32.0], [48.0, 32.0], [48.0, 38.0], [40.0, 38.0], [40.0, 32.0]]]
      }
    },
    // Aegyptus with natural boundaries
    {
      type: "Feature",
      properties: {
        name: "Aegyptus", 
        latinName: "Aegyptus",
        governor: "Praefectus Aegypti",
        capital: "Alexandria",
        established: -30,
        notes: "Vital grain province, thoroughly Romanized under Severus"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [25.0, 22.0], [32.9, 22.0], [34.2, 23.5], [34.8, 25.0], [34.5, 27.0],
          [33.8, 29.0], [32.5, 30.0], [31.2, 31.2], [29.5, 31.4], [28.0, 30.8],
          [26.8, 29.5], [25.8, 28.0], [25.2, 26.0], [25.0, 24.0], [25.0, 22.0]
        ]]
      }
    }
  ]
}

export const ROMAN_TIME_PERIODS: TimePeriod[] = [
  {
    id: 'early-republic',
    name: 'Early Republic',
    year: -264,
    description: 'Roman territory around 264 BCE, before major expansion',
    boundaries: EARLY_REPUBLIC_BOUNDARIES
  },
  {
    id: 'late-republic',
    name: 'Late Republic', 
    year: -44,
    description: 'Roman provinces at the death of Julius Caesar (44 BCE)',
    boundaries: LATE_REPUBLIC_BOUNDARIES
  },
  {
    id: 'trajan',
    name: 'Trajan\'s Empire',
    year: 117,
    description: 'Roman Empire at its greatest extent under Trajan (117 CE)',
    boundaries: TRAJAN_BOUNDARIES
  },
  {
    id: 'severus-early',
    name: 'Severus Early Reign',
    year: 193,
    description: 'Roman Empire when Septimius Severus became emperor (193 CE)',
    boundaries: SEVERUS_EARLY_BOUNDARIES
  },
  {
    id: 'severus-late', 
    name: 'Severus Late Reign',
    year: 211,
    description: 'Roman Empire at death of Septimius Severus (211 CE), with provincial divisions',
    boundaries: SEVERUS_LATE_BOUNDARIES
  }
]