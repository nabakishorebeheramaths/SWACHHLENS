// =========================================================
// SWACHHLENS
// ODISHA ORGANIZATION SEED DATA
// =========================================================
//
// FINAL MINIMAL ORGANIZATION SCHEMA
//
// {
//   organizationName: "",
//   location: {
//     state: "",
//     district: "",
//     city: ""
//   },
//   wasteTypes: [],
//   email: "",
//   serviceArea: [],
//   prioritySupport: false,
//   active: true,
//   rating: null
// }
//
// IMPORTANT:
// - Only official/public organization emails are used.
// - No personal phone numbers are stored.
// - rating starts as null unless SWACHHLENS later collects
//   its own verified rating data.
// - Backend matching will use hidden fields.
// - UI will show only name, location and rating.
// =========================================================

const odishaOrganizations = [

  // =======================================================
  // GOVERNMENT / MUNICIPAL RESPONSE ORGANIZATIONS
  // =======================================================

  {
    organizationName:
      "Bhubaneswar Municipal Corporation",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "Paper Waste",
      "Glass Waste",
      "Construction Waste",
      "Other",
    ],

    email:
      "info@bmc.gov.in",

    serviceArea: [
      "Bhubaneswar",
      "Khordha",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "Cuttack Municipal Corporation",

    location: {
      state: "Odisha",
      district: "Cuttack",
      city: "Cuttack",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "Paper Waste",
      "Glass Waste",
      "Construction Waste",
      "Other",
    ],

    email:
      "mccmc@nic.in",

    serviceArea: [
      "Cuttack",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "Rourkela Municipal Corporation",

    location: {
      state: "Odisha",
      district: "Sundargarh",
      city: "Rourkela",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "Paper Waste",
      "Glass Waste",
      "Construction Waste",
      "Other",
    ],

    email:
      "rourkelamunicipality@gmail.com",

    serviceArea: [
      "Rourkela",
      "Sundargarh",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "Sambalpur Municipal Corporation",

    location: {
      state: "Odisha",
      district: "Sambalpur",
      city: "Sambalpur",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "Paper Waste",
      "Glass Waste",
      "Construction Waste",
      "Other",
    ],

    email:
      "sambalpurm.hud@od.gov.in",

    serviceArea: [
      "Sambalpur",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "Berhampur Municipal Corporation",

    location: {
      state: "Odisha",
      district: "Ganjam",
      city: "Berhampur",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "Paper Waste",
      "Glass Waste",
      "Construction Waste",
      "Other",
    ],

    email:
      "ber_municipality@rediffmail.com",

    serviceArea: [
      "Berhampur",
      "Ganjam",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "Khordha Municipal Council",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Khordha",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "Paper Waste",
      "Glass Waste",
      "Construction Waste",
      "Other",
    ],

    email:
      "khurda_municipality@yahoo.co.in",

    serviceArea: [
      "Khordha",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "Balugaon NAC",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Balugaon",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "Paper Waste",
      "Glass Waste",
      "Other",
    ],

    email:
      "eonac.balugaon2013@gmail.com",

    serviceArea: [
      "Balugaon",
      "Khordha",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "Banapur NAC",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Banapur",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "Paper Waste",
      "Glass Waste",
      "Other",
    ],

    email:
      "ulbnac.banpur@gmail.com",

    serviceArea: [
      "Banapur",
      "Khordha",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  // =======================================================
  // ODISHA STATE POLLUTION CONTROL BOARD
  // =======================================================

  {
    organizationName:
      "Odisha State Pollution Control Board - Head Office",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "E-Waste",
      "Biomedical Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "paribesh1@ospcboard.org",

    serviceArea: [
      "Odisha",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Angul",

    location: {
      state: "Odisha",
      district: "Angul",
      city: "Angul",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.angul@ospcboard.org",

    serviceArea: [
      "Angul",
      "Dhenkanal",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Balasore",

    location: {
      state: "Odisha",
      district: "Balasore",
      city: "Balasore",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "E-Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.balasore@ospcboard.org",

    serviceArea: [
      "Balasore",
      "Bhadrak",
      "Mayurbhanj",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Berhampur",

    location: {
      state: "Odisha",
      district: "Ganjam",
      city: "Berhampur",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "E-Waste",
      "Construction Waste",
      "Biomedical Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.berhampur@ospcboard.org",

    serviceArea: [
      "Ganjam",
      "Kandhamal",
      "Nayagarh",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Bhubaneswar",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "E-Waste",
      "Construction Waste",
      "Biomedical Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.bhubaneswar@ospcboard.org",

    serviceArea: [
      "Khordha",
      "Puri",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Bolangir",

    location: {
      state: "Odisha",
      district: "Balangir",
      city: "Balangir",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.bolangir@ospcboard.org",

    serviceArea: [
      "Balangir",
      "Boudh",
      "Nuapada",
      "Subarnapur",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Cuttack",

    location: {
      state: "Odisha",
      district: "Cuttack",
      city: "Cuttack",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "E-Waste",
      "Construction Waste",
      "Biomedical Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.cuttack@ospcboard.org",

    serviceArea: [
      "Cuttack",
      "Jagatsinghpur",
      "Kendrapara",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Jharsuguda",

    location: {
      state: "Odisha",
      district: "Jharsuguda",
      city: "Jharsuguda",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.jharsuguda@ospcboard.org",

    serviceArea: [
      "Jharsuguda",
      "Himgiri block of Sundargarh",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Kalinganagar",

    location: {
      state: "Odisha",
      district: "Jajpur",
      city: "Jajpur Road",
    },

    wasteTypes: [
      "Mixed Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Plastic Waste",
      "Other",
    ],

    email:
      "rospcb.kalinganagar@ospcboard.org",

    serviceArea: [
      "Jajpur",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Koraput",

    location: {
      state: "Odisha",
      district: "Koraput",
      city: "Koraput",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "E-Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.koraput@ospcboard.org",

    serviceArea: [
      "Koraput",
      "Nabarangpur",
      "Malkangiri",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Rayagada",

    location: {
      state: "Odisha",
      district: "Rayagada",
      city: "Rayagada",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "E-Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.rayagada@ospcboard.org",

    serviceArea: [
      "Rayagada",
      "Kalahandi",
      "Gajapati",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Rourkela",

    location: {
      state: "Odisha",
      district: "Sundargarh",
      city: "Rourkela",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "E-Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.rourkela@ospcboard.org",

    serviceArea: [
      "Sundargarh",
      "Deogarh",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Sambalpur",

    location: {
      state: "Odisha",
      district: "Sambalpur",
      city: "Sambalpur",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "E-Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.sambalpur@ospcboard.org",

    serviceArea: [
      "Sambalpur",
      "Bargarh",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "OSPCB Regional Office - Paradeep",

    location: {
      state: "Odisha",
      district: "Jagatsinghpur",
      city: "Paradeep",
    },

    wasteTypes: [
      "Mixed Waste",
      "Plastic Waste",
      "Construction Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "rospcb.paradeep@ospcboard.org",

    serviceArea: [
      "Jagatsinghpur",
      "Kendrapara",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

  // =======================================================
  // SPECIALIZED / PRIVATE / NGO
  // =======================================================

  {
    organizationName:
      "Odisha Recycle",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Plastic Waste",
      "E-Waste",
      "Mixed Waste",
      "Glass Waste",
      "Paper Waste",
      "Other",
    ],

    email:
      "contact@odisharecycle.com",

    serviceArea: [
      "Bhubaneswar",
      "Khordha",
      "Odisha",
    ],

    prioritySupport: false,

    active: true,

    rating: null,
  },

  {
    organizationName:
      "Jana Chetana",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "Paper Waste",
      "Other",
    ],

    email:
      "janachetana.org@gmail.com",

    serviceArea: [
      "Bhubaneswar",
      "Khordha",
      "Odisha",
    ],

    prioritySupport: false,

    active: true,

    rating: null,
  },

  // E-waste collection presence in Odisha
  {
    organizationName:
      "Eyot Technologies - Odisha Collection Network",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "E-Waste",
    ],

    email:
      "recycle@hulladek.pro",

    serviceArea: [
      "Bhubaneswar",
      "Odisha",
    ],

    prioritySupport: false,

    active: true,

    rating: null,
  },
  //
// =======================================================
// ADDITIONAL VERIFIED ODISHA ORGANIZATIONS
// =======================================================

  // =======================================================
  // PRIVATE ENVIRONMENT & WASTE MANAGEMENT
  // =======================================================

  {
    organizationName:
      "SJ Environmental Solutions",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Plastic Waste",
      "E-Waste",
      "Other",
    ],

    email:
      "info@sjenv.com",

    serviceArea: [
      "Bhubaneswar",
      "Khordha",
      "Odisha",
    ],

    prioritySupport: false,

    active: true,

    rating: null,
  },


  {
    organizationName:
      "Western Integrated Waste Management Facility Private Limited",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Mixed Waste",
      "Organic Waste",
      "Municipal Waste",
      "Other",
    ],

    email:
      "project.wiwm@gmail.com",

    serviceArea: [
      "Bhubaneswar",
      "Khordha",
      "Odisha",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },


  {
    organizationName:
      "Shree Ganesh Recycling Private Limited",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Paper Waste",
      "Plastic Waste",
      "Mixed Waste",
      "Other",
    ],

    email:
      "narasingha@sgrgreen.com",

    serviceArea: [
      "Bhubaneswar",
      "Khordha",
      "Odisha",
    ],

    prioritySupport: false,

    active: true,

    rating: null,
  },


  // =======================================================
  // PLASTIC / CIRCULAR ECONOMY
  // =======================================================

  {
    organizationName:
      "Plasticure Private Limited",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Plastic Waste",
    ],

    email:
      "info.plasticure@gmail.com",

    serviceArea: [
      "Bhubaneswar",
      "Khordha",
      "Odisha",
    ],

    prioritySupport: false,

    active: true,

    rating: null,
  },


  {
    organizationName:
      "Relife India Recycler",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Jankia",
    },

    wasteTypes: [
      "Plastic Waste",
    ],

    email:
      "info@relifeindiarecycler.com",

    serviceArea: [
      "Khordha",
      "Bhubaneswar",
      "Odisha",
    ],

    prioritySupport: false,

    active: true,

    rating: null,
  },


  // =======================================================
  // BIOMEDICAL / ENVIRONMENTAL SERVICES
  // =======================================================

  {
    organizationName:
      "Renewable Envirogic Private Limited",

    location: {
      state: "Odisha",
      district: "Khordha",
      city: "Bhubaneswar",
    },

    wasteTypes: [
      "Biomedical Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "envirogic@gmail.com",

    serviceArea: [
      "Bhubaneswar",
      "Khordha",
      "Balangir",
      "Odisha",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },


  {
    organizationName:
      "Greentech Environ Management Private Limited",

    location: {
      state: "Odisha",
      district: "Sambalpur",
      city: "Sambalpur",
    },

    wasteTypes: [
      "Biomedical Waste",
      "Hazardous Waste",
      "Other",
    ],

    email:
      "greentechenviron@gmail.com",

    serviceArea: [
      "Sambalpur",
      "Western Odisha",
      "Odisha",
    ],

    prioritySupport: true,

    active: true,

    rating: null,
  },

];

module.exports = odishaOrganizations;