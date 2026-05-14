export const crops = {
  wheat:{base:2250,trendFactor:1.07},paddy:{base:1950,trendFactor:1.05},maize:{base:1850,trendFactor:1.02},bajra:{base:1600,trendFactor:0.98},chana:{base:5100,trendFactor:1.12},arhar:{base:4800,trendFactor:1.06},soybean:{base:4200,trendFactor:1.04},mustard:{base:5500,trendFactor:1.03},cotton:{base:7800,trendFactor:0.95},onion:{base:1500,trendFactor:1.40},potato:{base:1200,trendFactor:1.15},tomato:{base:1100,trendFactor:1.65},chilli:{base:18500,trendFactor:1.05},turmeric:{base:9200,trendFactor:1.08},ginger:{base:8500,trendFactor:1.12},garlic:{base:9800,trendFactor:1.04},mint:{base:3500,trendFactor:1.09},coriander:{base:6500,trendFactor:1.02},sugarcane:{base:320,trendFactor:1.06},rubber:{base:16000,trendFactor:1.01},coffee:{base:18500,trendFactor:1.08},jute:{base:6000,trendFactor:1.03}
};

export const mandiVariations = {
  khanna:{region:"north",var:1.08},karnal:{region:"north",var:1.05},shimla:{region:"north",var:1.12},lucknow:{region:"north",var:0.98},dehradun:{region:"north",var:1.06},azadpur:{region:"north",var:1.10},
  pune:{region:"west",var:1.03},vashi:{region:"west",var:1.10},unjha:{region:"west",var:0.97},indore:{region:"west",var:0.95},jaipur:{region:"west",var:0.97},raipur:{region:"west",var:0.93},
  bengaluru:{region:"south",var:1.06},kochi:{region:"south",var:1.15},chennai:{region:"south",var:1.08},guntur:{region:"south",var:1.02},hyderabad:{region:"south",var:1.04},
  kolkata:{region:"east",var:1.04},patna:{region:"east",var:0.92},guwahati:{region:"east",var:1.18},ranchi:{region:"east",var:0.96},bhubaneswar:{region:"east",var:0.94},shillong:{region:"east",var:1.20}
};

export const regionalData = {
  north:[{name:"Khanna",dist:0,vol:450,trend:"↑"},{name:"Karnal",dist:45,vol:320,trend:"↑"},{name:"Moga",dist:82,vol:890,trend:"↓"},{name:"Ludhiana",dist:12,vol:150,trend:"→"},{name:"Patiala",dist:58,vol:210,trend:"↑"},{name:"Amritsar",dist:140,vol:540,trend:"↑"}],
  west:[{name:"Pune",dist:0,vol:680,trend:"↑"},{name:"Mumbai",dist:150,vol:1200,trend:"↑"},{name:"Nashik",dist:210,vol:950,trend:"↑"},{name:"Lasalgaon",dist:235,vol:1500,trend:"→"},{name:"Nagpur",dist:710,vol:430,trend:"↓"},{name:"Solapur",dist:250,vol:310,trend:"↑"}],
  south:[{name:"Bengaluru",dist:0,vol:380,trend:"↑"},{name:"Mysuru",dist:145,vol:210,trend:"↓"},{name:"Guntur",dist:620,vol:1100,trend:"↑"},{name:"Kochi",dist:530,vol:150,trend:"→"},{name:"Hyderabad",dist:570,vol:890,trend:"↑"},{name:"Chennai",dist:350,vol:420,trend:"↑"}],
  east:[{name:"Kolkata",dist:0,vol:520,trend:"↑"},{name:"Patna",dist:580,vol:410,trend:"↓"},{name:"Hooghly",dist:45,vol:890,trend:"↑"},{name:"Nadia",dist:110,vol:620,trend:"↑"},{name:"Burdwan",dist:95,vol:1200,trend:"↑"},{name:"Malda",dist:330,vol:280,trend:"→"}]
};

export const cropOptions = [
  {group:"Grains & Cereals",items:[{v:"wheat",l:"Wheat (Kanak)"},{v:"paddy",l:"Paddy (Rice)"},{v:"maize",l:"Maize"},{v:"bajra",l:"Bajra"}]},
  {group:"Pulses & Oilseeds",items:[{v:"chana",l:"Gram (Chana)"},{v:"arhar",l:"Arhar (Tur)"},{v:"soybean",l:"Soybean"},{v:"mustard",l:"Mustard"}]},
  {group:"Spices & Cash Crops",items:[{v:"cotton",l:"Cotton"},{v:"onion",l:"Onion"},{v:"potato",l:"Potato"},{v:"tomato",l:"Tomato"},{v:"chilli",l:"Chilli"},{v:"turmeric",l:"Turmeric"},{v:"ginger",l:"Ginger"},{v:"garlic",l:"Garlic"},{v:"mint",l:"Mint"},{v:"coriander",l:"Coriander"},{v:"sugarcane",l:"Sugarcane"},{v:"rubber",l:"Rubber"},{v:"coffee",l:"Coffee"},{v:"jute",l:"Jute"}]}
];

export const mandiOptions = [
  {group:"North India",items:[{v:"khanna",l:"Khanna (Punjab)"},{v:"karnal",l:"Karnal (Haryana)"},{v:"shimla",l:"Shimla (HP)"},{v:"lucknow",l:"Lucknow (UP)"},{v:"dehradun",l:"Dehradun (UK)"},{v:"azadpur",l:"Azadpur (Delhi)"}]},
  {group:"West & Central",items:[{v:"pune",l:"Pune (MH)"},{v:"vashi",l:"Mumbai (Vashi)"},{v:"unjha",l:"Unjha (GJ)"},{v:"indore",l:"Indore (MP)"},{v:"jaipur",l:"Jaipur (RJ)"},{v:"raipur",l:"Raipur (CG)"}]},
  {group:"South India",items:[{v:"bengaluru",l:"Bengaluru (KA)"},{v:"kochi",l:"Kochi (KL)"},{v:"chennai",l:"Chennai (TN)"},{v:"guntur",l:"Guntur (AP)"},{v:"hyderabad",l:"Hyderabad (TS)"}]},
  {group:"East & NE",items:[{v:"kolkata",l:"Kolkata (WB)"},{v:"patna",l:"Patna (BR)"},{v:"guwahati",l:"Guwahati (AS)"},{v:"ranchi",l:"Ranchi (JH)"},{v:"bhubaneswar",l:"Bhubaneswar (OD)"},{v:"shillong",l:"Shillong (ML)"}]}
];
