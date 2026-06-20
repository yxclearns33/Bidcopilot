// CPV (Common Procurement Vocabulary) codes
// Used to match Contracts Finder API tenders to sectors

export const SECTOR_CPV_CODES = {
  cleaning: [
    '90910000', // cleaning services general
    '90911000', // accommodation, building and window cleaning
    '90911100', // accommodation cleaning
    '90911200', // building cleaning
    '90911300', // window cleaning
    '90912000', // flue cleaning
    '90913000', // tank cleaning
    '90914000', // car park cleaning
    '90915000', // furnace cleaning
    '90916000', // telephone equipment cleaning
    '90917000', // transport equipment cleaning
    '90918000', // chimney cleaning
    '90919000', // office equipment and building cleaning
    '90919100', // office equipment cleaning
    '90919200', // office cleaning
    '90919300', // school cleaning
    '90920000', // environmental sanitation
    '90921000', // disinfecting and exterminating
    '90922000', // pest control
    '90680000', // beach cleaning
    '90690000', // graffiti removal
  ],
  security: [
    '79710000', // security services
    '79711000', // alarm monitoring
    '79712000', // guard services
    '79713000', // guard services
    '79714000', // surveillance services
    '79715000', // patrol services
    '79716000', // badge issue services
    '79717000', // vetting services
    '79718000', // security consultancy
    '79719000', // door supervision
    '98341140', // caretaking services
  ],
  construction: [
    '45000000', // construction work general
    '45100000', // site preparation
    '45110000', // demolition
    '45111000', // demolition and site clearing
    '45200000', // building and civil engineering
    '45210000', // building work
    '45211000', // residential building
    '45212000', // construction of leisure facilities
    '45213000', // commercial buildings
    '45214000', // education buildings
    '45215000', // health and social facilities
    '45216000', // military facilities
    '45220000', // civil engineering
    '45230000', // pipelines and cables
    '45240000', // hydraulic engineering
    '45250000', // plant construction
    '45260000', // roof and other special works
    '45300000', // M&E
    '45310000', // electrical installation
    '45320000', // insulation work
    '45330000', // plumbing and sanitary works
    '45340000', // fencing and railing installation
    '45350000', // mechanical installations
    '45400000', // building completion work
    '45410000', // plastering work
    '45420000', // joinery and carpentry installation
    '45430000', // floor and wall covering work
    '45440000', // painting and glazing work
    '45450000', // other building completion work',
    '45500000', // hiring of construction and civil engineering machinery
  ]
}

// Map CPV code prefix to sector
export function cpvToSector(cpvCode) {
  if (!cpvCode) return null
  const code = cpvCode.toString().substring(0, 5)
  if (['90910','90911','90912','90913','90914','90915','90916','90917','90918','90919','90920','90921','90922','90680','90690'].includes(code)) return 'cleaning'
  if (['79710','79711','79712','79713','79714','79715','79716','79717','79718','79719','98341'].includes(code)) return 'security'
  if (['45000','45100','45110','45111','45200','45210','45211','45212','45213','45214','45215','45216','45220','45230','45240','45250','45260','45300','45310','45320','45330','45340','45350','45400','45410','45420','45430','45440','45450','45500'].includes(code)) return 'construction'
  return null
}

// Human readable CPV labels
export const CPV_LABELS = {
  '90910000': 'Cleaning Services',
  '90919200': 'Office Cleaning',
  '90919300': 'School / Education Cleaning',
  '90921000': 'Healthcare / Disinfection',
  '79710000': 'Security Services',
  '79711000': 'Alarm Monitoring',
  '79713000': 'Manned Guarding',
  '79714000': 'Surveillance / CCTV',
  '45000000': 'Construction Work',
  '45210000': 'Building Work',
  '45300000': 'Mechanical & Electrical',
  '45400000': 'Building Completion',
}
