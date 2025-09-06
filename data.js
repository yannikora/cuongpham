// CV data (from your PDF)
const state = {
  skills: ["PHP","Laravel","Phalcon","JavaScript","React","Vue","Node.js","HTML","CSS","Tailwind","REST API","JWT","MySQL","MongoDB","Redis","S3","Docker","Git","Stripe","PayPal","Socket.IO","Microsoft Entra ID"],
  projects: [
    { title: "Inapps — Unified Campus", desc: "Unified legacy university sites into a single platform. Single‑Sign‑On (Entra ID), workflow for events/equipment. Faster content ops, 1 platform to maintain.", tags: ["PHP","Laravel","MySQL","Entra ID"] },
    { title: "Omniagent — Support", desc: "Support portal for 300+ agents. Contract search in milliseconds, real‑time updates, Redis‑backed caching — built for uptime.", tags: ["Laravel","Redis","Socket.IO","MongoDB"] },
    { title: "DNBCnet — Online Banking", desc: "Online banking suite: cards, top‑up/withdrawal, mobile APIs, analytics. Security first: 2FA & JWT flows.", tags: ["Phalcon","MySQL","Google APIs","JWT"] }
  ],
  experience: [
    { company:"RMIT University", role:"Senior Software Engineer", period:"Apr 2024 – Present", bullets:[
      "Unified multiple university sites; SSO with Entra ID.",
      "Built APIs, optimized DB queries & caching."
    ]},
    { company:"Centrala", role:"PHP Developer", period:"Oct 2023 – Mar 2024", bullets:[
      "Instructor‑led course platform (Zoom); payments via Stripe/PayPal."
    ]},
    { company:"FPT Telecom", role:"PHP Developer", period:"Mar 2021 – Sep 2023", bullets:[
      "Omniagent: high‑availability portal for 300+ agents.",
      "Redis caching, Socket.IO real‑time, security fixes."
    ]},
    { company:"BIN Corporation Group", role:"PHP Dev / Sub Leader", period:"Apr 2019 – Feb 2021", bullets:[
      "DNBCnet: online banking; analytics dashboard; 2FA and JWT.",
      "Paycec / Travelner / GIS: payments & booking platforms."
    ]},
  ],
  awards: [
    { year:"2022", title:"FPT iKhien — Bronze" },
    { year:"2020", title:"BIN Corporation Group — Excellent Employee" }
  ]
};
