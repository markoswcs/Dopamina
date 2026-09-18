import React, { useState, useEffect, useRef } from"react";
import { trackingStages } from"../productsData";
import { Package, MapPin, Clock, CheckCircle, Truck, Navigation, Edit3, Search, Globe } from"lucide-react";

// Brazilian CEP → approximate coordinates mapping
const CEP_REGIONS = [
 { range: [1000000, 19999999], name:"São Paulo, SP", lat: -23.5505, lng: -46.6333 },
 { range: [20000000, 28999999], name:"Rio de Janeiro, RJ", lat: -22.9068, lng: -43.1729 },
 { range: [29000000, 29999999], name:"Vitória, ES", lat: -20.3155, lng: -40.3128 },
 { range: [30000000, 39999999], name:"Belo Horizonte, MG", lat: -19.9167, lng: -43.9345 },
 { range: [40000000, 48999999], name:"Salvador, BA", lat: -12.9714, lng: -38.5124 },
 { range: [49000000, 49999999], name:"Aracaju, SE", lat: -10.9091, lng: -37.0677 },
 { range: [50000000, 56999999], name:"Recife, PE", lat: -8.0476, lng: -34.877 },
 { range: [57000000, 57999999], name:"Maceió, AL", lat: -9.6658, lng: -35.7353 },
 { range: [58000000, 58999999], name:"João Pessoa, PB", lat: -7.1195, lng: -34.845 },
 { range: [59000000, 59999999], name:"Natal, RN", lat: -5.7945, lng: -35.211 },
 { range: [60000000, 63999999], name:"Fortaleza, CE", lat: -3.7172, lng: -38.5433 },
 { range: [64000000, 64999999], name:"Teresina, PI", lat: -5.0892, lng: -42.8019 },
 { range: [65000000, 65999999], name:"São Luís, MA", lat: -2.5297, lng: -44.2825 },
 { range: [66000000, 68899999], name:"Belém, PA", lat: -1.4558, lng: -48.5024 },
 { range: [69000000, 69299999], name:"Manaus, AM", lat: -3.119, lng: -60.0217 },
 { range: [69900000, 69999999], name:"Rio Branco, AC", lat: -9.9754, lng: -67.8249 },
 { range: [70000000, 72799999], name:"Brasília, DF", lat: -15.7801, lng: -47.9292 },
 { range: [72800000, 72999999], name:"Luziânia, GO", lat: -16.2532, lng: -47.9501 },
 { range: [73000000, 76999999], name:"Goiânia, GO", lat: -16.6869, lng: -49.2648 },
 { range: [77000000, 77999999], name:"Palmas, TO", lat: -10.1689, lng: -48.3317 },
 { range: [78000000, 78899999], name:"Cuiabá, MT", lat: -15.601, lng: -56.0974 },
 { range: [79000000, 79999999], name:"Campo Grande, MS", lat: -20.4697, lng: -54.6201 },
 { range: [80000000, 87999999], name:"Curitiba, PR", lat: -25.4284, lng: -49.2733 },
 { range: [88000000, 89999999], name:"Florianópolis, SC", lat: -27.5954, lng: -48.548 },
 { range: [90000000, 99999999], name:"Porto Alegre, RS", lat: -30.0346, lng: -51.2177 },
];

// International country codes for postal code lookup (Zippopotam.us API)
const COUNTRY_CODES = [
 { code:"US", name:"EUA", flag:"🇺🇸"},
 { code:"GB", name:"Reino Unido", flag:"🇬🇧"},
 { code:"DE", name:"Alemanha", flag:"🇩🇪"},
 { code:"FR", name:"França", flag:"🇫🇷"},
 { code:"IT", name:"Itália", flag:"🇮🇹"},
 { code:"ES", name:"Espanha", flag:"🇪🇸"},
 { code:"PT", name:"Portugal", flag:"🇵🇹"},
 { code:"CA", name:"Canadá", flag:"🇨🇦"},
 { code:"JP", name:"Japão", flag:"🇯🇵"},
 { code:"AU", name:"Austrália", flag:"🇦🇺"},
 { code:"MX", name:"México", flag:"🇲🇽"},
 { code:"AR", name:"Argentina", flag:"🇦🇷"},
 { code:"CL", name:"Chile", flag:"🇨🇱"},
 { code:"CO", name:"Colômbia", flag:"🇨🇴"},
 { code:"IN", name:"Índia", flag:"🇮🇳"},
 { code:"KR", name:"Coreia do Sul", flag:"🇰🇷"},
 { code:"NL", name:"Holanda", flag:"🇳🇱"},
 { code:"BE", name:"Bélgica", flag:"🇧🇪"},
 { code:"CH", name:"Suíça", flag:"🇨🇭"},
 { code:"AT", name:"Áustria", flag:"🇦🇹"},
 { code:"PL", name:"Polônia", flag:"🇵🇱"},
 { code:"SE", name:"Suécia", flag:"🇸🇪"},
 { code:"NO", name:"Noruega", flag:"🇳🇴"},
 { code:"DK", name:"Dinamarca", flag:"🇩🇰"},
 { code:"FI", name:"Finlândia", flag:"🇫🇮"},
 { code:"CZ", name:"Tchéquia", flag:"🇨🇿"},
 { code:"RO", name:"Romênia", flag:"🇷🇴"},
 { code:"HU", name:"Hungria", flag:"🇭🇺"},
 { code:"ZA", name:"África do Sul", flag:"🇿🇦"},
 { code:"NZ", name:"Nova Zelândia", flag:"🇳🇿"},
 { code:"PH", name:"Filipinas", flag:"🇵🇭"},
 { code:"TH", name:"Tailândia", flag:"🇹🇭"},
 { code:"TR", name:"Turquia", flag:"🇹🇷"},
 { code:"RU", name:"Rússia", flag:"🇷🇺"},
 { code:"BR", name:"Brasil", flag:"🇧🇷"},
];

// Detect if postal code is Brazilian (8 digits, only numbers)
function isBrazilianCep(code) {
 const clean = code.replace(/\D/g,"");
 return clean.length === 8 && /^\d{8}$/.test(clean);
}

// Get coordinates from postal code (supports Brazilian CEP and cached international results)
function getCoordsFromPostalCode(postalCode, resolvedData) {
 if (!postalCode) return { lat: -15.7801, lng: -47.9292, name:"Brasil"};

 // Check if we have resolved coordinates from API lookup
 if (resolvedData?.lat && resolvedData?.lng) {
 return { lat: resolvedData.lat, lng: resolvedData.lng, name: resolvedData.name ||"Desconhecido"};
 }

 // Fallback: Brazilian CEP region mapping
 if (isBrazilianCep(postalCode)) {
 const num = parseInt(postalCode.replace(/\D/g,""));
 for (const r of CEP_REGIONS) {
 if (num >= r.range[0] && num <= r.range[1]) return { lat: r.lat, lng: r.lng, name: r.name };
 }
 return { lat: -15.7801, lng: -47.9292, name:"Brasil"};
 }

 // Fallback for unknown international codes
 return { lat: 0, lng: 0, name: postalCode };
}

function formatPostalCode(value, country) {
 if (!country || country ==="BR") {
 const digits = value.replace(/\D/g,"").slice(0, 8);
 if (digits.length > 5) return digits.slice(0, 5) +"-"+ digits.slice(5);
 return digits;
 }
 // International: allow alphanumeric, spaces, hyphens
 return value.replace(/[^a-zA-Z0-9\s\-]/g,"").slice(0, 10).toUpperCase();
}

function TrackingMap({ stages, currentStageIndex, destinationCoords }) {
 const mapRef = useRef(null);
 const mapInstanceRef = useRef(null);
 const markersRef = useRef([]);
 const containerId = useRef(`map-${Math.random().toString(36).slice(2, 9)}`);

 const stagesWithDest = stages.map((s, i) =>
 i === stages.length - 1 ? { ...s, lat: destinationCoords.lat, lng: destinationCoords.lng, location: destinationCoords.name } : s
 );

 useEffect(() => {
 if (!window.L || mapInstanceRef.current) return;
 const map = window.L.map(containerId.current, {
 center: [5, 50], zoom: 2, zoomControl: false, attributionControl: false,
 scrollWheelZoom: false, dragging: true, doubleClickZoom: false,
 });
 window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
 maxZoom: 18,
 }).addTo(map);
 window.L.control.zoom({ position:"bottomright"}).addTo(map);
 mapInstanceRef.current = map;
 return () => { map.remove(); mapInstanceRef.current = null; };
 }, []);

 useEffect(() => {
 const map = mapInstanceRef.current;
 if (!map || !window.L) return;

 markersRef.current.forEach(m => map.removeLayer(m));
 markersRef.current = [];
 map.eachLayer(l => { if (l instanceof window.L.Polyline) map.removeLayer(l); });

 const routePoints = stagesWithDest.map(s => [s.lat, s.lng]);

 // Completed route (green)
 if (currentStageIndex > 0) {
 const completedPts = routePoints.slice(0, currentStageIndex + 1);
 const completedLine = window.L.polyline(completedPts, { color:"#2D9F6F", weight: 3, opacity: 0.9, dashArray: null });
 completedLine.addTo(map);
 markersRef.current.push(completedLine);
 }

 // Remaining route (dashed gray)
 if (currentStageIndex < stagesWithDest.length - 1) {
 const remainingPts = routePoints.slice(currentStageIndex);
 const remainingLine = window.L.polyline(remainingPts, { color:"#666", weight: 2, opacity: 0.4, dashArray:"8 8"});
 remainingLine.addTo(map);
 markersRef.current.push(remainingLine);
 }

 // Stage markers
 stagesWithDest.forEach((stage, i) => {
 const isActive = i <= currentStageIndex;
 const isCurrent = i === currentStageIndex;
 const isDestination = i === stagesWithDest.length - 1;

 const size = isCurrent ? 32 : 20;
 const icon = window.L.divIcon({
 className:"custom-marker",
 html:`<div style="
 width:${size}px;height:${size}px;border-radius:50%;
 display:flex;align-items:center;justify-content:center;
 font-size:${isCurrent ? 16 : 10}px;
 background:${isCurrent ?"#E85D3A": isActive ?"#2D9F6F": isDestination ?"#F5A623":"#444"};
 border:2px solid ${isCurrent ?"#fff":"transparent"};
 box-shadow:${isCurrent ?"0 0 12px rgba(232,93,58,0.7)":"none"};
 color:white;cursor:default;
 ${isCurrent ?"animation:pulse-marker 1.5s infinite;":""}
">${stage.emoji}</div>`,
 iconSize: [size, size],
 iconAnchor: [size / 2, size / 2],
 });

 const marker = window.L.marker([stage.lat, stage.lng], { icon });
 marker.bindTooltip(`<b>${stage.location}</b><br/><small>${stage.label}</small>`, {
 className:"tracking-tooltip", direction:"top", offset: [0, -size / 2],
 });
 marker.addTo(map);
 markersRef.current.push(marker);
 });

 // Fit map to show current position + destination
 const bounds = window.L.latLngBounds(routePoints.slice(0, Math.max(currentStageIndex + 2, 2)));
 map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
 }, [currentStageIndex, destinationCoords.lat, destinationCoords.lng]);

 return (
 <div
 id={containerId.current}
 ref={mapRef}
 style={{ width:"100%", height:"260px", borderRadius:"16px", overflow:"hidden", border:"1px solid var(--t-border)", position:"relative", zIndex: 0 }}
 />
 );
}

export default function OrderTracking({ orders, userName, onUpdateOrderCep }) {
 const [now, setNow] = useState(Date.now());
 const [editingCep, setEditingCep] = useState(null);
 const [cepInput, setCepInput] = useState("");
 const [selectedCountry, setSelectedCountry] = useState("BR");
 const [postalLookup, setPostalLookup] = useState({}); // key: postalCode, value: { name, lat, lng }
 const [showCountryPicker, setShowCountryPicker] = useState(false);

 useEffect(() => {
 const id = setInterval(() => setNow(Date.now()), 10000);
 return () => clearInterval(id);
 }, []);

 // Lookup postal code via API (Brazilian or International)
 const lookupPostalCode = async (postalCode, countryCode ="BR") => {
 const cleanKey = postalCode.replace(/\s/g,"").toUpperCase();
 if (!cleanKey || cleanKey.length < 3) return;

 try {
 if (countryCode ==="BR") {
 // Use ViaCEP for Brazil
 const clean = postalCode.replace(/\D/g,"");
 if (clean.length !== 8) return;
 const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
 const data = await res.json();
 if (!data.erro) {
 // Get coordinates from our region mapping
 const num = parseInt(clean);
 let lat = -15.7801, lng = -47.9292;
 for (const r of CEP_REGIONS) {
 if (num >= r.range[0] && num <= r.range[1]) { lat = r.lat; lng = r.lng; break; }
 }
 const name =`${data.logradouro ? data.logradouro +",":""}${data.localidade} - ${data.uf}`;
 setPostalLookup(prev => ({ ...prev, [cleanKey]: { name, lat, lng, flag:"🇧🇷"} }));
 }
 } else {
 // Use Zippopotam.us for international
 const res = await fetch(`https://api.zippopotam.us/${countryCode}/${cleanKey}`);
 if (res.ok) {
 const data = await res.json();
 const place = data.places?.[0];
 if (place) {
 const countryInfo = COUNTRY_CODES.find(c => c.code === countryCode);
 const name =`${place["place name"]}, ${place["state abbreviation"] || place.state} — ${data.country}`;
 setPostalLookup(prev => ({
 ...prev,
 [cleanKey]: {
 name,
 lat: parseFloat(place.latitude),
 lng: parseFloat(place.longitude),
 flag: countryInfo?.flag ||"🌍"
 }
 }));
 }
 }
 }
 } catch { /* API offline, use fallback */ }
 };

 const handleSavePostalCode = (orderIndex) => {
 const trimmed = cepInput.trim();
 if (!trimmed) { setEditingCep(null); return; }

 if (onUpdateOrderCep) {
 // Store both the postal code and country
 onUpdateOrderCep(orderIndex, trimmed, selectedCountry);
 lookupPostalCode(trimmed, selectedCountry);
 }
 setEditingCep(null);
 setShowCountryPicker(false);
 };

 if (!orders || orders.length === 0) {
 return (
 <div className="max-w-lg mx-auto py-12 text-center space-y-3">
 <Package className="w-12 h-12 theme-muted mx-auto"/>
 <h2 className="font-display font-bold text-lg theme-text">Nenhum pedido encontrado</h2>
 <p className="text-xs theme-text-secondary">Faça uma compra primeiro para rastrear seu pedido fictício!</p>
 </div>
 );
 }

 return (
 <div className="max-w-lg mx-auto pt-6 pb-32 space-y-6">
 <style>{`
 @keyframes pulse-marker {
 0%, 100% { transform: scale(1); }
 50% { transform: scale(1.25); }
 }
 .tracking-tooltip {
 background: var(--t-card) !important;
 color: var(--t-text) !important;
 border: 1px solid var(--t-border) !important;
 border-radius: 10px !important;
 padding: 6px 10px !important;
 font-family: var(--font-body) !important;
 font-size: 11px !important;
 box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
 }
 .tracking-tooltip::before { border-top-color: var(--t-border) !important; }
 .leaflet-container { background: var(--t-surface) !important; }
`}</style>

 <div className="text-center space-y-1">
 <h2 className="font-display font-extrabold text-xl theme-text">📦 Rastreio de Pedidos</h2>
 <p className="text-xs theme-text-secondary">Acompanhe em"tempo real"seus pedidos fictícios com mapa interativo 🌍</p>
 </div>

 {orders.map((order, oi) => {
 const elapsed = (now - order.timestamp) / 60000;
 const activeStages = trackingStages.filter(s => elapsed >= s.minutesAfter);
 const currentStageIndex = Math.max(0, activeStages.length - 1);
 const isDelivered = activeStages.length >= trackingStages.length;
 const currentStage = trackingStages[currentStageIndex];

 const postalKey = (order.cep ||"").replace(/\s/g,"").toUpperCase();
 const resolvedData = postalLookup[postalKey];
 const destCoords = getCoordsFromPostalCode(order.cep, resolvedData);
 const resolvedAddress = resolvedData?.name;
 const resolvedFlag = resolvedData?.flag || (isBrazilianCep(order.cep ||"") ?"🇧🇷":"🌍");

 // Estimated delivery days based on distance heuristic
 const distFromChina = Math.sqrt(Math.pow(destCoords.lat - 22.5, 2) + Math.pow(destCoords.lng - 114, 2));
 const estimatedDays = Math.max(3, Math.min(30, Math.round(distFromChina / 10)));

 return (
 <div key={oi} className="theme-card border theme-border rounded-2xl overflow-hidden">
 {/* Header */}
 <div className="p-4 border-b theme-border theme-surface flex justify-between items-center">
 <div>
 <div className="text-[10px] theme-muted font-bold uppercase tracking-wider">Pedido #{String(oi + 1).padStart(4,"0")}</div>
 <div className="text-xs font-semibold theme-text mt-0.5">
 {order.items.length} {order.items.length === 1 ?"item":"itens"} • {order.total}
 </div>
 {order.timestamp && (
 <div className="text-[10px] theme-muted mt-1 font-medium">
 Comprado em: {new Date(order.timestamp).toLocaleString("pt-BR")}
 </div>
 )}
 </div>
 <div className={`text-[10px] font-bold py-1 px-2.5 rounded-full ${isDelivered ?"bg-success/10 text-success":"bg-warning/10 text-warning"}`}>
 {isDelivered ?"Entregue ✓":"Em trânsito..."}
 </div>
 </div>

 {/* Items preview */}
 <div className="px-4 py-2 border-b theme-border flex gap-2 overflow-x-auto">
 {order.items.slice(0, 4).map((item, ii) => (
 <img loading="lazy"decoding="async"key={ii} src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border theme-border shrink-0"/>
 ))}
 {order.items.length > 4 && <span className="text-[10px] theme-muted self-center ml-1">+{order.items.length - 4}</span>}
 </div>

 {/* Postal Code & Delivery info */}
 <div className="px-4 py-3 border-b theme-border space-y-2">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1.5 text-[10px] theme-text-secondary">
 <MapPin className="w-3.5 h-3.5 text-accent"/>
 {editingCep === oi ? (
 <div className="flex items-center gap-1.5 flex-wrap">
 {/* Country selector */}
 <div className="relative">
 <button
 onClick={() => setShowCountryPicker(!showCountryPicker)}
 className="theme-surface border theme-border rounded-lg px-2 py-1 text-[11px] theme-text flex items-center gap-1 cursor-pointer hover:border-accent/50 transition-colors"
 >
 <Globe className="w-3 h-3"/>
 {COUNTRY_CODES.find(c => c.code === selectedCountry)?.flag ||"🌍"}
 {selectedCountry}
 </button>
 {showCountryPicker && (
 <div className="absolute top-full left-0 mt-1 z-50 theme-card border theme-border rounded-lg max-h-48 overflow-y-auto w-48">
 {COUNTRY_CODES.map(c => (
 <button
 key={c.code}
 onClick={() => { setSelectedCountry(c.code); setShowCountryPicker(false); setCepInput(""); }}
 className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-accent/10 cursor-pointer flex items-center gap-2 ${selectedCountry === c.code ?"bg-accent/10 text-accent font-bold":"theme-text"}`}
 >
 <span>{c.flag}</span>
 <span>{c.name}</span>
 <span className="theme-muted ml-auto">{c.code}</span>
 </button>
 ))}
 </div>
 )}
 </div>
 <input
 type="text"
 value={cepInput}
 onChange={(e) => setCepInput(formatPostalCode(e.target.value, selectedCountry))}
 onKeyDown={(e) => e.key ==="Enter"&& handleSavePostalCode(oi)}
 placeholder={selectedCountry ==="BR"?"00000-000": selectedCountry ==="US"?"10001": selectedCountry ==="GB"?"SW1A 1AA":"Código postal"}
 maxLength={selectedCountry ==="BR"? 9 : 10}
 className="w-28 theme-surface border theme-border rounded-lg px-2 py-1 text-[11px] theme-text"
 autoFocus
 />
 <button onClick={() => handleSavePostalCode(oi)} className="text-accent hover:text-accent-dark cursor-pointer">
 <CheckCircle className="w-4 h-4"/>
 </button>
 </div>
 ) : (
 <span className="font-medium">
 {resolvedFlag} {order.cep ?`Código Postal: ${order.cep}`:"Endereço não informado"}
 {resolvedAddress && <span className="theme-muted ml-1">({resolvedAddress})</span>}
 </span>
 )}
 </div>
 {editingCep !== oi && (
 <button
 onClick={() => { setEditingCep(oi); setCepInput(order.cep ||""); setSelectedCountry(order.country ||"BR"); setShowCountryPicker(false); }}
 className="text-accent hover:text-accent-dark text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
 >
 <Edit3 className="w-3 h-3"/> {order.cep ?"Alterar":"Adicionar Endereço"}
 </button>
 )}
 </div>
 <div className="flex items-center gap-4 text-[10px]">
 <div className="flex items-center gap-1 theme-text-secondary">
 <Clock className="w-3 h-3"/>
 <span>Previsão: {estimatedDays} dias úteis (ou não)</span>
 </div>
 <div className="flex items-center gap-1 theme-text-secondary">
 <Truck className="w-3 h-3"/>
 <span>Destinatário: {userName ||"Anônimo"}</span>
 </div>
 </div>
 {/* Current Location Badge */}
 <div className="flex items-center gap-1.5 bg-accent/5 border border-accent/20 rounded-lg px-2.5 py-1.5">
 <Navigation className="w-3.5 h-3.5 text-accent"/>
 <span className="text-[11px] font-bold text-accent">
 📍 Localização atual: {currentStage.location ==="Seu Endereço"? destCoords.name : currentStage.location}
 </span>
 </div>
 </div>

 {/* MAP */}
 <div className="p-3">
 <TrackingMap
 stages={trackingStages}
 currentStageIndex={currentStageIndex}
 destinationCoords={destCoords}
 />
 </div>

 {/* Timeline */}
 <div className="p-4 space-y-0 border-t theme-border">
 <div className="text-[10px] font-bold theme-muted uppercase tracking-wider mb-3">Timeline de Rastreio</div>
 {trackingStages.map((stage, si) => {
 const isActive = elapsed >= stage.minutesAfter;
 const isCurrent = isActive && (si === trackingStages.length - 1 || elapsed < trackingStages[si + 1]?.minutesAfter);

 return (
 <div key={si} className="flex items-start gap-3">
 <div className="flex flex-col items-center">
 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-all ${
 isActive ? (isCurrent ?"bg-accent text-white animate-pulse":"bg-success/20 text-success") :"theme-surface border theme-border theme-muted"
 }`}>
 {isActive ? (isCurrent ? stage.emoji : <CheckCircle className="w-3 h-3"/>) : <span className="w-2 h-2 rounded-full theme-border bg-current block"/>}
 </div>
 {si < trackingStages.length - 1 && (
 <div className={`w-0.5 h-8 ${isActive ?"bg-success/30":"theme-border bg-current opacity-20"}`} />
 )}
 </div>
 <div className={`pb-6 ${isCurrent ?"pt-0.5":"pt-1"}`}>
 <p className={`text-xs font-medium ${isActive ?"theme-text":"theme-muted"} ${isCurrent ?"font-bold":""}`}>
 {stage.emoji} {stage.label}
 </p>
 <p className={`text-[9px] mt-0.5 ${isActive ?"theme-muted":"theme-muted opacity-50"}`}>
 {isActive ? (isCurrent ?`📍 ${stage.location ==="Seu Endereço"? destCoords.name : stage.location} — Agora`:`${Math.floor(elapsed - stage.minutesAfter)} min atrás`) : stage.location}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
 })}
 </div>
 );
}

