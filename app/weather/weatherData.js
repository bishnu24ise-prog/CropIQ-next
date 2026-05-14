// Weather code mappings & crop alert logic

export const WMO = {
  0:'Clear Sky',1:'Mainly Clear',2:'Partly Cloudy',3:'Overcast',
  45:'Foggy',48:'Icy Fog',51:'Light Drizzle',53:'Drizzle',55:'Heavy Drizzle',
  61:'Light Rain',63:'Rain',65:'Heavy Rain',71:'Light Snow',73:'Snow',75:'Heavy Snow',
  80:'Rain Showers',81:'Heavy Showers',82:'Violent Showers',95:'Thunderstorm',96:'Thunderstorm + Hail'
};

export const ICONS = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',
  61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'❄️',75:'❄️',80:'🌩️',81:'🌩️',82:'⛈️',95:'⛈️',96:'⛈️'
};

export const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export function getCropAlerts(temp, rain, wind, humidity, uv) {
  const alerts = [];
  if (temp > 42) {
    alerts.push({ type:'high', title:'🔥 Extreme Heat — Critical Alert', crops:'🌾 Wheat, 🍅 Tomato, 🥬 Leafy Vegetables', body:`Temperature ${temp}°C is dangerously high. Wheat grain filling will stop. Tomato flowers will drop causing 40–60% yield loss.`, fertilizer:'❌ Do NOT apply Urea in heat — causes leaf burn. Apply Potassium Nitrate (13:00:45) foliar spray @ 10g/litre to reduce heat stress.', action:'Irrigate at early morning (5–7 AM). Install shade nets (50%) over vegetables. Spray Kaolin clay @ 3% on wheat.' });
  } else if (temp > 38) {
    alerts.push({ type:'high', title:'🔥 Heat Stress Alert', crops:'🌾 Wheat, 🌽 Maize, 🍅 Tomato, 🌶️ Chilli', body:`Temperature ${temp}°C causing heat stress. Maize silk drying may reduce pollination. Chilli bud drop likely.`, fertilizer:'Apply Potassium Sulphate (0:0:50) @ 5kg/acre as soil drench. Spray Boron 0.2% (2g/litre) on flowering crops.', action:'Irrigate every 2–3 days. Mulch with dry straw. Avoid transplanting seedlings today.' });
  }
  if (rain > 75) {
    alerts.push({ type:'high', title:'🌧️ Heavy Rain — Flood Risk', crops:'🌾 Paddy, 🥔 Potato, 🧅 Onion, 🌻 Sunflower', body:`${rain}% rain probability. Paddy roots may rot in waterlogged conditions. Potato & onion at high risk of fungal wilt.`, fertilizer:'After rain clears: Apply Trichoderma viride @ 2.5 kg/acre + FYM to restore soil health. Apply Carbendazim 0.1% spray against fungal diseases.', action:'Open all drainage channels NOW. Do not apply fertilizer before rain. Remove standing water within 24 hours.' });
  } else if (rain > 50) {
    alerts.push({ type:'med', title:'🌦️ Moderate Rain Expected', crops:'🌾 Wheat, 🌿 Pulses, 🌽 Maize', body:`${rain}% rain chance. Good for soil moisture but watch for fungal disease development in humid conditions.`, fertilizer:'Postpone fertilizer application until after rain. Pre-mix Mancozeb 75WP @ 2g/litre as preventive fungicide spray.', action:'Ensure drainage is clear. Avoid harvesting operations today. Cover stored grain from moisture.' });
  }
  if (humidity > 85) {
    alerts.push({ type:'high', title:'🍄 Fungal Disease High Risk', crops:'🍅 Tomato (Late Blight), 🥔 Potato (Early Blight), 🌾 Wheat (Rust), 🌶️ Chilli (Anthracnose)', body:`Humidity ${humidity}% — ideal conditions for fungal spore germination. Phytophthora blight can destroy 70% of tomato crop in 3 days.`, fertilizer:'Spray Metalaxyl + Mancozeb (Ridomil Gold) @ 2.5g/litre on tomato & potato. For wheat rust: spray Propiconazole 25EC @ 1ml/litre.', action:'Apply fungicide within 24 hours. Avoid overhead irrigation. Space plants for better air circulation.' });
  } else if (humidity > 70) {
    alerts.push({ type:'med', title:'💧 Moderate Humidity — Disease Watch', crops:'🌾 Wheat (Powdery Mildew), 🍇 Grapes, 🌽 Maize (Blight)', body:`Humidity ${humidity}% — watch for early signs of powdery mildew on wheat and mango. Spray preventively.`, fertilizer:'Preventive spray: Sulfur 80WP @ 3g/litre on wheat & grapes. Hexaconazole 5EC @ 2ml/litre on mango.', action:'Scout fields daily for white powdery patches. Increase row spacing in next planting cycle.' });
  }
  if (wind > 35) {
    alerts.push({ type:'high', title:'💨 Strong Wind — Crop Damage Risk', crops:'🌽 Maize, 🎋 Sugarcane, 🍌 Banana, 🌻 Sunflower', body:`Wind ${wind} km/h will cause lodging in tall crops. Banana plants may uproot. Maize tassels can break reducing pollination.`, fertilizer:'After wind damage: Apply Humic Acid @ 2ml/litre foliar to help crop recovery. Add Silicon @ 1g/litre to strengthen cell walls.', action:'Stake banana plants NOW. Avoid spraying chemicals. Support sugarcane with earthing up around roots.' });
  } else if (wind > 20) {
    alerts.push({ type:'med', title:'💨 Moderate Wind Advisory', crops:'🍅 Tomato, 🥒 Cucumber, 🌶️ Chilli', body:`Wind ${wind} km/h — light to moderate. Staked crops may loosen. Spraying efficiency will be reduced.`, fertilizer:'Delay foliar spray until wind < 15 km/h to avoid drift. Check stake supports on tomato and chilli.', action:'Check and tighten plant stakes. Schedule irrigation after wind reduces.' });
  }
  if (temp < 10) {
    alerts.push({ type:'high', title:'❄️ Cold Wave — Frost Risk', crops:'🍅 Tomato, 🥒 Cucumber, 🌶️ Chilli, 🍌 Banana', body:`Temperature ${temp}°C near frost level. Warm-season crops will suffer chilling injury. Banana pseudostems may die back.`, fertilizer:'Spray Potassium Nitrate (13:00:45) @ 10g/litre to boost frost resistance. Apply Calcium Boron foliar to protect cell membranes.', action:'Cover nursery beds with polythene. Light irrigation at night raises field temperature by 2–3°C. Harvest mature fruits before frost.' });
  } else if (temp < 18) {
    alerts.push({ type:'med', title:'🌡️ Cool Temperatures', crops:'🍅 Tomato, 🥕 Carrot, 🧅 Onion, 🌿 Fenugreek', body:`Temperature ${temp}°C — cool conditions. Good for rabi crops (wheat, mustard). Tomato flowering may slow down.`, fertilizer:'For wheat: Apply second dose Urea @ 25 kg/acre at Crown Root Initiation (25 days after sowing). Ideal absorption in cool weather.', action:'Cool nights are excellent for rabi sowing. Irrigate wheat at tillering stage for best yield.' });
  }
  if (uv > 8) {
    alerts.push({ type:'med', title:'☀️ High UV Index — Sunburn Risk', crops:'🍇 Grapes, 🍅 Tomato (fruits), 🥒 Cucumber, 🌶️ Chilli', body:`UV Index ${uv} — fruit surfaces may develop sunburn scald, reducing market value by 20–40%.`, fertilizer:'Spray Kaolin Clay @ 3% (30g/litre) on fruit surfaces as sunscreen. Apply Calcium Chloride @ 0.5% to strengthen fruit skin.', action:'Apply reflective mulch. Use 30% shade net over fruiting vegetables. Water early morning to reduce heat load.' });
  }
  if (temp >= 22 && temp <= 32 && rain < 30 && humidity < 70) {
    alerts.push({ type:'good', title:'✅ Excellent Farming Conditions', crops:'🌾 All crops — ideal for most farming operations', body:`Temperature ${temp}°C, humidity ${humidity}%, low rain risk — perfect conditions for field work, sowing, and fertilizer application.`, fertilizer:'Best time for basal fertilizer application: DAP @ 50 kg/acre + MOP @ 25 kg/acre for new crops. Foliar nutrients absorb best in clear weather.', action:'Perfect day for sowing, transplanting, pesticide spray, and harvesting. Use morning hours (6–10 AM) for best results.' });
  }
  if (alerts.length === 0) {
    alerts.push({ type:'good', title:'✅ Normal Weather Conditions', crops:'🌾 All crops — no major risk today', body:'Weather is within normal range. No critical alerts for today.', fertilizer:'Routine fertilizer schedule can be followed. Check soil moisture before irrigation.', action:'Proceed with planned farming operations. Scout fields for early pest signs.' });
  }
  return alerts;
}

export function getCropImpacts(temp, rain, wind, humidity) {
  return [
    { emoji:'🌾', name:'Wheat', status: temp>35?'risk':rain>60?'warn':'safe', impact: temp>35?`Heat ${temp}°C causes grain shrivelling — up to 35% yield loss.`:rain>60?`Heavy rain causes waterlogging & rust disease.`:`Good conditions for grain development at ${temp}°C.`, rec: temp>35?`Spray K-Nitrate (13:00:45) @ 10g/L. Irrigate at 5 AM.`:rain>60?`Apply Propiconazole 25EC @ 1ml/L for rust.`:`Top-dress Urea @ 25kg/acre if at tillering stage.` },
    { emoji:'🌾', name:'Paddy/Rice', status: humidity>85&&rain>60?'risk':temp>38?'warn':'safe', impact: humidity>85?`Blast disease CRITICAL — humidity ${humidity}%. Can destroy 40% crop in days.`:temp>38?`Heat ${temp}°C at flowering causes sterile spikelets.`:`Favorable. Maintain 5cm water level in fields.`, rec: humidity>85?`Spray Tricyclazole 75WP @ 0.6g/L immediately.`:temp>38?`Flood irrigate to cool soil. Apply Silica @ 1g/L.`:`Apply Urea @ 20kg/acre at panicle initiation stage.` },
    { emoji:'🥔', name:'Potato', status: humidity>80||rain>50?'risk':temp>30?'warn':'safe', impact: humidity>80?`Late Blight CRITICAL — humidity ${humidity}% can wipe out crop in 72 hrs.`:temp>30?`Tuber development slows. Small-sized potato likely.`:`Ideal conditions. Monitor for early blight signs.`, rec: humidity>80?`URGENT: Ridomil Gold (Metalaxyl+Mancozeb) @ 2.5g/L every 5 days.`:temp>30?`Irrigate every 4 days. Mulch with straw to cool soil.`:`Apply Calcium Nitrate @ 5kg/acre for tuber quality.` },
    { emoji:'🍅', name:'Tomato', status: temp>38||humidity>80?'risk':wind>25?'warn':'safe', impact: temp>38?`Flower drop certain at ${temp}°C — fruit set reduces 50-70%.`:humidity>80?`Early Blight & Leaf Curl spreading in humid air.`:wind>25?`Wind ${wind}km/h loosens stakes. Fruit bruising risk.`:`Good conditions for fruiting. Continue routine care.`, rec: temp>38?`Spray Boron 0.2% + Ca-Nitrate 0.5% to reduce flower drop.`:humidity>80?`Mancozeb 75WP @ 2g/L + Imidacloprid for virus vectors.`:`Apply 19:19:19 NPK @ 5g/L foliar for balanced growth.` },
    { emoji:'🧅', name:'Onion', status: rain>60?'risk':humidity>75?'warn':'safe', impact: rain>60?`Heavy rain causes bulb rot & purple blotch disease.`:humidity>75?`Purple Blotch & Stemphylium blight spreading in humidity ${humidity}%.`:`Good bulbing weather. Ensure proper spacing.`, rec: rain>60?`Spray Iprodione 50WP @ 2g/L. Improve field drainage NOW.`:humidity>75?`Apply Mancozeb+Cymoxanil @ 2g/L weekly preventively.`:`Apply MOP (0:0:60) @ 20kg/acre for bulb development.` },
    { emoji:'🌿', name:'Cotton', status: wind>30?'risk':temp>40||humidity>80?'warn':'safe', impact: wind>30?`Wind ${wind}km/h causes boll shedding & branch breakage.`:temp>40?`Extreme heat ${temp}°C causes boll & square drop.`:humidity>80?`Alternaria & bacterial blight risk in humid weather.`:`Good cotton weather. Scout for bollworm eggs.`, rec: wind>30?`Stake plants. Spray NAA 40ppm to prevent boll drop.`:temp>40?`Spray Kaolin Clay @ 3% to reflect heat. Irrigate.`:`Chlorpyrifos @ 2ml/L for early bollworm control.` },
    { emoji:'🌽', name:'Maize', status: temp>38||wind>30?'risk':humidity>80?'warn':'safe', impact: temp>38?`Pollen killed at ${temp}°C during silking — grain set loss 60%.`:wind>30?`Wind ${wind}km/h causes stem lodging in tall maize.`:humidity>80?`Turcicum leaf blight & downy mildew spreading.`:`Ideal conditions. Good day to apply top-dress.`, rec: temp>38?`Spray KCl 1% solution. Irrigate at silking stage.`:wind>30?`Hill up soil around base. Skip nitrogen today.`:`Mancozeb 75WP @ 2g/L preventively for leaf blight.` },
    { emoji:'🌱', name:'Soybean', status: rain>70?'risk':humidity>80?'warn':'safe', impact: rain>70?`Root rot & yellow mosaic virus spreading with ${rain}% rain.`:humidity>80?`Cercospora leaf spot & rust risk at humidity ${humidity}%.`:`Good pod-filling conditions. Check for girdle beetle.`, rec: rain>70?`Ensure drainage. Apply Carbendazim @ 1g/L after rain.`:humidity>80?`Hexaconazole 5SC @ 1ml/L for rust. Check girdle beetle.`:`Apply Sulphur 80WP @ 3g/L for disease control.` },
    { emoji:'🎋', name:'Sugarcane', status: wind>35?'risk':temp>40?'warn':'safe', impact: wind>35?`Wind ${wind}km/h causes lodging — cane falls and is hard to harvest.`:temp>40?`Extreme heat reduces sucrose accumulation significantly.`:`Good growth conditions. Ensure earthing-up is done.`, rec: wind>35?`Tie canes together. Apply K @ 20kg/acre for stalk strength.`:temp>40?`Irrigate every 7 days. Apply trash mulch for moisture.`:`Apply Urea @ 50kg/acre at grand growth stage.` },
    { emoji:'🌶️', name:'Chilli', status: temp>38||humidity>80?'risk':wind>20?'warn':'safe', impact: temp>38?`Bud drop at ${temp}°C. Thrips & mites surge in heat.`:humidity>80?`Anthracnose (fruit rot) spreading rapidly.`:wind>20?`Wind ${wind}km/h loosening plants. Pollen drift issues.`:`Good conditions. Scout for thrips under leaves.`, rec: temp>38?`Spiromesifen @ 1ml/L for mites+thrips. Spray Boron for set.`:humidity>80?`Carbendazim+Mancozeb @ 2g/L. Remove infected fruits.`:`19:19:19 NPK @ 4g/L foliar for balanced nutrition.` },
  ];
}
