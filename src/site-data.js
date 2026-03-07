/**
 * Facility configuration.
 * meshName must exactly match the node name in the GLTF scene graph
 * as exported from Blender.
 */
export const BUILDINGS = [
  {
    meshName: 'Apothiki_1',
    name: 'Apothiki 1',
    category: 'Tool Storage',
    icon: '🔧',
    hours: 'Mon – Fri: 07:00 – 17:00',
    description: 'Primary storage facility for mining hand tools and small equipment. Houses drills, pickaxes, shovels, safety gear, and personal protective equipment (PPE) issued to site personnel.',
    contact: '+30 210 000 0001',
    photo: null,
  },
  {
    meshName: 'Apothiki_2',
    name: 'Apothiki 2',
    category: 'Maintenance Equipment',
    icon: '⚙️',
    hours: 'Mon – Fri: 07:00 – 17:00',
    description: 'Storage and staging area for heavy maintenance equipment. Contains hydraulic lifts, spare parts for excavators and haul trucks, welding units, and scheduled servicing supplies for on-site machinery.',
    contact: '+30 210 000 0002',
    photo: null,
  },
  {
    meshName: 'Apothiki_3',
    name: 'Apothiki 3',
    category: 'Materials & Consumables',
    icon: '📦',
    hours: 'Mon – Fri: 07:00 – 17:00',
    description: 'Storage of operational consumables including lubricants, hydraulic fluids, blasting accessories, safety signage, and replacement parts for conveyor and crushing systems.',
    contact: '+30 210 000 0003',
    photo: null,
  },
  {
    meshName: 'Kaminada',
    name: 'Kaminada',
    category: 'Processing Stack',
    icon: '🏭',
    hours: 'Continuous Operation',
    description: 'Main processing and ventilation stack of the open pit facility. Manages exhaust emissions from ore processing operations and serves as a reference landmark for site navigation and aerial surveys.',
    contact: '+30 210 000 0004',
    photo: null,
  },
];
