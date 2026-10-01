/* =====================================================================
   PUNJAB JAB TIKKAH GOJRA — script.js
   Vanilla JavaScript. No frameworks, no build step.
   Open index.html directly in a browser.
   ===================================================================== */
'use strict';

/* =====================================================================
   1. CONFIGURATION  (edit everything here)
   ===================================================================== */

const RESTAURANT = {
  name: "Punjab Jab Tikkah Gojra",
  shortName: "Punjab Jab Tikkah",
  // ↓ Replace with the real phone number (country code + number, no "+")
  phone: "923001234567",
  whatsapp: "92XXXXXXXXXX",
  address: "Gojra, Punjab, Pakistan",
  openingHours: "12:00 PM - 11:00 PM",
  // Paste an embedded Google Maps URL here to replace the placeholder map
  mapEmbedUrl: "",
  // Paste a Google Maps "directions" URL here, otherwise a search URL is used
  directionsUrl: "",
  facebook: "#",
  instagram: "#",
  tiktok: "#"
};

// WhatsApp number used for "Order on WhatsApp".
// ↓ Replace "92XXXXXXXXXX" with the restaurant's real WhatsApp number.
const WHATSAPP_NUMBER = "92XXXXXXXXXX";

// Commerce settings
const DELIVERY_FEE = 150;            // Rs.
const FREE_DELIVERY_OVER = 2000;     // Rs. subtotal threshold
const AUTO_DISCOUNT_OVER = 1000;     // Rs. subtotal threshold
const AUTO_DISCOUNT = 100;           // Rs. off
const CURRENCY = "Rs.";
const ESTIMATED_PREP = "25–40 minutes";

// Promo codes: type = percent | fixed | shipping
const PROMO_CODES = {
  "PJT10":   { type: "percent", value: 10,  label: "10% off your order" },
  "GOJRA50": { type: "fixed",   value: 50,  label: "Rs. 50 off" },
  "FREESHIP":{ type: "shipping",value: 0,   label: "Free delivery" }
};

// Optional extras offered in the product modal
const EXTRAS = [
  { id: "cheese", name: "Extra Cheese", price: 150 },
  { id: "bbq",    name: "Extra BBQ",    price: 200 },
  { id: "sauce",  name: "Extra Sauce",  price: 60  },
  { id: "salad",  name: "Extra Salad",  price: 100 }
];

const SPICE_LEVELS = ["Mild", "Medium", "Spicy"];

const ORDER_STATUSES = ["Received","Confirmed","Preparing","Ready","Out for Delivery","Delivered","Cancelled"];
const TRACK_STEPS = [
  { key:"Order Received",  ico:"📥", desc:"We have received your order." },
  { key:"Confirmed",       ico:"✅", desc:"Your order has been confirmed." },
  { key:"Preparing",       ico:"🔥", desc:"Our kitchen is preparing your food." },
  { key:"Ready",           ico:"🍽️", desc:"Your order is packed and ready." },
  { key:"Out for Delivery",ico:"🛵", desc:"Rider is on the way to you." },
  { key:"Delivered",       ico:"🎉", desc:"Order delivered. Enjoy your meal!" }
];

/* =====================================================================
   2. IMAGES
   Unsplash URLs (easy to replace with local files inside assets/).
   Every image has a graceful branded fallback if the URL fails.
   ===================================================================== */
const U = (id, w = 700) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const IMG = {
  tikkah:        U("1544025162-d76694265947"),
  malai:         U("1555939594-58d7cb561ad1"),
  beefTikka:     U("1600891964092-4316c288032e"),
  mutton:        U("1529193591184-b1d58069ecdd"),
  malaiBoti:     U("1567188040759-fb8a883dc6d8"),
  seekh:         U("1555939594-58d7cb561ad1"),
  seekhChicken:  U("1603133872878-684f208fb84b"),
  boti:          U("1607013251379-e6eecfffe234"),
  beefBoti:      U("1600891964092-4316c288032e"),
  kababTali:     U("1626777552726-4a6b54c97e46"),
  platter:       U("1555939594-58d7cb561ad1"),
  familyPlatter: U("1544025162-d76694265947"),
  kababPlatter:  U("1544025162-d76694265947"),
  karahi:        U("1631515243349-e0cb75fb8d3a"),
  muttonKarahi:  U("1603894584373-5ac82b2ae398"),
  handi:         U("1603894584373-5ac82b2ae398"),
  roll:          U("1568051243851-f9b136146e97"),
  wings:         U("1626082927389-6cd097cee6a6"),
  chargha:       U("1604908176997-125f25cc6f3d"),
  daal:          U("1547592180-85f173990554"),
  nihari:        U("1547592180-85f173990554"),
  haleem:        U("1547592180-85f173990554"),
  biryani:       U("1563379091339-03b21ab4a4f8"),
  pulao:         U("1589302168068-964664d93dc0"),
  plainRice:     U("1516684732162-798a0062be99"),
  coldDrink:     U("1581636625402-29b2a704ef13"),
  water:         U("1523362628745-0c100150b504"),
  lassi:         U("1626074353765-517a681e40be"),
  margarita:     U("1544145945-f90425340c7e"),
  fries:         U("1573080496219-bb080dd4f877"),
  raita:         U("1546069901-ba9599a7e63c"),
  salad:         U("1512621776951-a57141f2eefd"),
  naan:          U("1565514020179-026b92b84bb6"),
  roti:          U("1565514020179-026b92b84bb6"),
  garlicNaan:    U("1565514020179-026b92b84bb6"),
  pakora:        U("1601050690597-df0568f70950"),
  restaurant1:   U("1517248135467-4c7edcad34c4", 900),
  restaurant2:   U("1414235077428-338989a2e8c0", 900),
  restaurant3:   U("1552566626-52f8b828add9", 900),
  grill:         U("1555939594-58d7cb561ad1", 900)
};

/* =====================================================================
   3. DATA — categories, products, deals, reviews, gallery
   ===================================================================== */
const CATEGORIES = [
  { id:"Tikkah",     name:"Tikkah",     ico:"🔥" },
  { id:"BBQ",        name:"BBQ",        ico:"🍗" },
  { id:"Kebabs",     name:"Kebabs",     ico:"🥩" },
  { id:"Chicken",    name:"Chicken",    ico:"🍖" },
  { id:"Desi Food",  name:"Desi Food",  ico:"🥘" },
  { id:"Rice",       name:"Rice",       ico:"🍚" },
  { id:"Drinks",     name:"Drinks",     ico:"🥤" },
  { id:"Sides",      name:"Sides",      ico:"🍟" },
  { id:"Deals",      name:"Deals",      ico:"⭐" }
];

const products = [
  // --- Tikkah -------------------------------------------------------
  { id:1,  name:"Chicken Tikkah",       category:"Tikkah",    price:450,  rating:4.8, popular:true,
    description:"Char-grilled chicken pieces marinated in yogurt and desi spices — smoky, juicy and fresh off the grill.", image:IMG.tikkah },
  { id:2,  name:"Chicken Malai Tikkah", category:"Tikkah",    price:550,  rating:4.7, popular:true,
    description:"Creamy malai marinade with cheese and white pepper for a soft, mildly spiced tikkah.", image:IMG.malai },
  { id:3,  name:"Beef Tikka",           category:"Tikkah",    price:780,  rating:4.6,
    description:"Thick-cut beef tikka grilled slowly until tender with a deep smoky crust.", image:IMG.beefTikka },
  { id:4,  name:"Mutton Tikkah",        category:"Tikkah",    price:1250, rating:4.8, popular:true,
    description:"Premium mutton tikkah, marinated overnight and grilled to melt-in-the-mouth tenderness.", image:IMG.mutton },
  { id:5,  name:"Malai Boti",           category:"Tikkah",    price:620,  rating:4.6,
    description:"Boneless chicken boti in a rich cream and cheese marinade.", image:IMG.malaiBoti },

  // --- BBQ ----------------------------------------------------------
  { id:6,  name:"BBQ Platter (Single)",  category:"BBQ",      price:1299, rating:4.7, popular:true,
    description:"A one-person mix of tikkah, seekh kebab, boti and seekh roll with chutney and salad.", image:IMG.platter },
  { id:7,  name:"Family BBQ Platter",    category:"BBQ",      price:1999, rating:4.9, popular:true,
    description:"Our signature family platter — chicken tikkah, beef seekh kebab, chicken boti, fries and drinks for everyone.", image:IMG.familyPlatter },
  { id:8,  name:"BBQ Platter for Two",   category:"BBQ",      price:1699, rating:4.7,
    description:"Two generous portions of mixed BBQ with sides — perfect for sharing.", image:IMG.platter },
  { id:9,  name:"Seekh Kebab Platter",   category:"BBQ",      price:890,  rating:4.6,
    description:"Six juicy seekh kebabs grilled over charcoal with mint chutney.", image:IMG.kababPlatter },

  // --- Kebabs -------------------------------------------------------
  { id:10, name:"Beef Seekh Kebab",     category:"Kebabs",    price:620,  rating:4.6, popular:true,
    description:"Hand-minced beef kebab with green chilli and garam masala, grilled on skewers.", image:IMG.seekh },
  { id:11, name:"Chicken Seekh Kebab",  category:"Kebabs",    price:350,  rating:4.5,
    description:"Light and flavourful chicken seekh kebab — soft, juicy and mildly spiced.", image:IMG.seekhChicken },
  { id:12, name:"Chicken Boti",         category:"Kebabs",    price:500,  rating:4.7, popular:true,
    description:"Boneless chicken chunks tossed in spices and grilled over hot coals.", image:IMG.boti },
  { id:13, name:"Beef Boti",            category:"Kebabs",    price:580,  rating:4.6,
    description:"Tender beef boti with a charred edge and bold desi seasoning.", image:IMG.beefBoti },
  { id:14, name:"Beef Kabab Tali",      category:"Kebabs",    price:720,  rating:4.5,
    description:"Flat beef kabab pan-fried in its own juices — rich and flavourful.", image:IMG.kababTali },

  // --- Chicken ------------------------------------------------------
  { id:15, name:"Chicken Karahi",       category:"Chicken",   price:980,  rating:4.8, popular:true,
    description:"Fresh chicken simmered in tomato, ginger and green chilli — served sizzling in a karahi.", image:IMG.karahi },
  { id:16, name:"Mutton Karahi",        category:"Chicken",   price:1650, rating:4.8,
    description:"Tender mutton cooked low and slow in a rich, aromatic karahi gravy.", image:IMG.muttonKarahi },
  { id:17, name:"Chicken Handi",        category:"Chicken",   price:1150, rating:4.7,
    description:"Creamy chicken handi with yoghurt, nuts and mild spices.", image:IMG.handi },
  { id:18, name:"Chicken Roll",         category:"Chicken",   price:320,  rating:4.6, popular:true,
    description:"Hot paratha roll stuffed with grilled chicken, chutney and onion.", image:IMG.roll },
  { id:19, name:"Chicken Wings",        category:"Chicken",   price:650,  rating:4.5,
    description:"Crispy grilled wings tossed in a smoky BBQ glaze.", image:IMG.wings },
  { id:20, name:"Chicken Chargha",      category:"Chicken",   price:620,  rating:4.6,
    description:"Whole chargha-style fried chicken marinated in vinegar and spice.", image:IMG.chargha },

  // --- Desi Food ----------------------------------------------------
  { id:21, name:"Daal Makhani",         category:"Desi Food", price:480,  rating:4.5,
    description:"Slow-cooked black lentils finished with butter and cream.", image:IMG.daal },
  { id:22, name:"Beef Nihari",          category:"Desi Food", price:720,  rating:4.7,
    description:"Classic slow-cooked nihari with ginger, green chilli and naan.", image:IMG.nihari },
  { id:23, name:"Mutton Nihari",        category:"Desi Food", price:1150, rating:4.7,
    description:"Rich mutton nihari simmered overnight for a deep, warming flavour.", image:IMG.nihari },
  { id:24, name:"Haleem",               category:"Desi Food", price:650,  rating:4.5,
    description:"Thick, hearty haleem topped with fried onion and lemon.", image:IMG.haleem },

  // --- Rice ---------------------------------------------------------
  { id:25, name:"Chicken Biryani",      category:"Rice",      price:480,  rating:4.8, popular:true,
    description:"Fragrant basmati rice layered with spiced chicken — served with raita.", image:IMG.biryani },
  { id:26, name:"Beef Pulao",           category:"Rice",      price:620,  rating:4.6,
    description:"Yakhni pulao cooked with tender beef and whole spices.", image:IMG.pulao },
  { id:27, name:"Mutton Pulao",         category:"Rice",      price:780,  rating:4.7,
    description:"Aromatic mutton pulao with a rich, savoury stock.", image:IMG.pulao },
  { id:28, name:"Plain Rice",           category:"Rice",      price:220,  rating:4.3,
    description:"Steamed basmati rice, perfect with any gravy.", image:IMG.plainRice },

  // --- Drinks -------------------------------------------------------
  { id:29, name:"Cold Drink",           category:"Drinks",    price:150,  rating:4.4,
    description:"Chilled soft drink — the classic pairing with BBQ.", image:IMG.coldDrink },
  { id:30, name:"Water",                category:"Drinks",    price:60,   rating:4.2,
    description:"Chilled mineral water bottle.", image:IMG.water },
  { id:31, name:"Sweet Lassi",          category:"Drinks",    price:200,  rating:4.6,
    description:"Thick, chilled sweet lassi — cooling and creamy.", image:IMG.lassi },
  { id:32, name:"Mint Margarita",       category:"Drinks",    price:250,  rating:4.5,
    description:"Refreshing mint and lime cooler, non-alcoholic.", image:IMG.margarita },

  // --- Sides --------------------------------------------------------
  { id:33, name:"French Fries",         category:"Sides",     price:250,  rating:4.5, popular:true,
    description:"Crispy golden fries with a light seasoning of salt and chaat masala.", image:IMG.fries },
  { id:34, name:"Raita",                category:"Sides",     price:120,  rating:4.4,
    description:"Cooling yoghurt raita with mint and cumin.", image:IMG.raita },
  { id:35, name:"Salad",                category:"Sides",     price:180,  rating:4.4,
    description:"Fresh garden salad with lemon and black pepper.", image:IMG.salad },
  { id:36, name:"Naan",                 category:"Sides",     price:60,   rating:4.6,
    description:"Freshly baked tandoor naan.", image:IMG.naan },
  { id:37, name:"Roti",                 category:"Sides",     price:40,   rating:4.5,
    description:"Soft whole-wheat roti straight from the tawa.", image:IMG.roti },
  { id:38, name:"Garlic Naan",          category:"Sides",     price:120,  rating:4.7,
    description:"Naan topped with garlic butter and coriander.", image:IMG.garlicNaan },
  { id:39, name:"Mixed Pakora",         category:"Sides",     price:320,  rating:4.5,
    description:"Crisp mixed vegetable pakoras with chutney.", image:IMG.pakora }
];

/* --- Special deals (also appear under the "Deals" category) -------- */
const deals = [
  { id:"deal-1", name:"Family BBQ Deal", ico:"🔥", price:1999, was:2599, popular:true,
    description:"A complete family meal straight off the grill.",
    items:["Chicken Tikkah","Beef Seekh Kebab","Chicken Boti","French Fries","2 Cold Drinks"],
    image:IMG.familyPlatter },
  { id:"deal-2", name:"Couple Deal", ico:"💑", price:999, was:1350, popular:true,
    description:"The perfect meal for two.",
    items:["Chicken Tikkah","French Fries","2 Cold Drinks"],
    image:IMG.tikkah },
  { id:"deal-3", name:"Student Deal", ico:"🎓", price:499, was:720, popular:true,
    description:"Quick, filling and easy on the budget.",
    items:["Chicken Roll","French Fries","1 Cold Drink"],
    image:IMG.roll }
];

/* --- Demo reviews (clearly sample content) ------------------------- */
const reviews = [
  { text:"Great taste and really good BBQ. The tikkah was smoky and juicy.", name:"Demo Customer", role:"Sample review", rating:5 },
  { text:"Family platter was delicious — plenty for four people and arrived hot.", name:"Demo Customer", role:"Sample review", rating:5 },
  { text:"Chicken malai tikkah and garlic naan were a great combination.", name:"Demo Customer", role:"Sample review", rating:4 },
  { text:"Ordering was quick and the roll was fresh. Will try the karahi next time.", name:"Demo Customer", role:"Sample review", rating:4 },
  { text:"Good desi flavour and fair prices. The biryani was nicely spiced.", name:"Demo Customer", role:"Sample review", rating:5 },
  { text:"Pickup was fast and everything was packed properly.", name:"Demo Customer", role:"Sample review", rating:4 }
];

/* --- Gallery ------------------------------------------------------- */
const gallery = [
  { src:IMG.familyPlatter, cap:"Family BBQ Platter", cat:"BBQ" },
  { src:IMG.tikkah,        cap:"Chicken Tikkah",     cat:"Tikkah" },
  { src:IMG.seekh,         cap:"Beef Seekh Kebab",   cat:"Kebab" },
  { src:IMG.grill,         cap:"Fresh off the Grill",cat:"BBQ" },
  { src:IMG.malai,         cap:"Malai Tikkah",       cat:"Tikkah" },
  { src:IMG.boti,          cap:"Chicken Boti",       cat:"Kebab" },
  { src:IMG.restaurant1,   cap:"Dining Area",        cat:"Restaurant" },
  { src:IMG.karahi,        cap:"Chicken Karahi",     cat:"BBQ" },
  { src:IMG.mutton,        cap:"Mutton Tikkah",      cat:"Tikkah" },
  { src:IMG.restaurant2,   cap:"Our Counter",        cat:"Restaurant" },
  { src:IMG.kababPlatter,  cap:"Kebab Platter",      cat:"Kebab" },
  { src:IMG.restaurant3,   cap:"Evening Service",    cat:"Restaurant" }
];
const GALLERY_CATS = ["All","BBQ","Tikkah","Kebab","Restaurant"];

/* =====================================================================
   4. STATE + PERSISTENCE (localStorage)
   ===================================================================== */
const STORE = {
  cart:      "pjt_cart",
  customer:  "pjt_customer",
  checkout:  "pjt_checkout",
  orders:    "pjt_orders",
  promo:     "pjt_promo",
  theme:     "pjt_theme",
  offer:     "pjt_offer_seen",
  announce:  "pjt_announce_dismissed",
  favorites: "pjt_favorites"
};

const state = {
  cart: [],
  promo: null,
  orderType: "delivery",
  payment: "cod",
  customer: { name:"", phone:"", address:"", city:"Gojra", area:"", notes:"" },
  checkoutStep: 1,
  activeCategory: "All",
  searchQuery: "",
  sort: "popular",
  galleryFilter: "All",
  currentProduct: null,
  pmQty: 1,
  pmGallery: [],
  favorites: [],
  orders: [],
  currentOrderId: null,
  lightboxIndex: 0,
  lightboxItems: [],
  reviewIndex: 0,
  reviewTimer: null,
  trackTimer: null
};

/* Generic storage helpers (safe: never throws in private mode) */
function storeGet(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch(e){ return fallback; }
}
function storeSet(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){}
}

function saveCart(){ storeSet(STORE.cart, state.cart); }
function loadCart(){
  const saved = storeGet(STORE.cart, []);
  state.cart = Array.isArray(saved) ? saved : [];
  renderCart();
}
function saveCheckout(){ storeSet(STORE.checkout, { customer: state.customer, orderType: state.orderType, payment: state.payment }); }
function loadCheckout(){
  const d = storeGet(STORE.checkout, null);
  if(d && d.customer){
    state.customer = Object.assign(state.customer, d.customer);
    state.orderType = d.orderType || "delivery";
    state.payment   = d.payment   || "cod";
  }
}
function savePromo(){ storeSet(STORE.promo, state.promo); }
function loadPromo(){ state.promo = storeGet(STORE.promo, null); }
function loadOrders(){ state.orders = storeGet(STORE.orders, []); }
function saveOrders(){ storeSet(STORE.orders, state.orders); }

function loadFavorites(){
  const saved = storeGet(STORE.favorites, []);
  state.favorites = Array.isArray(saved) ? saved.map(Number) : [];
}

/* =====================================================================
   5. UTILITIES
   ===================================================================== */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function formatPrice(n){
  const v = Math.max(0, Math.round(Number(n) || 0));
  return `${CURRENCY} ${v.toLocaleString("en-PK")}`;
}
function escapeHtml(str){
  return String(str == null ? "" : str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function stars(rating){
  const full = Math.round(rating);
  let out = "";
  for(let i = 1; i <= 5; i++) out += i <= full ? "★" : "☆";
  return out;
}

/* Branded SVG fallback if a remote image fails to load ---------------- */
function svgPlaceholder(text, kind){
  const t = String(text || "Punjab Jab Tikkah").replace(/[<>&"]/g, "").slice(0, 34);
  const isLogo = kind === "logo";
  const emoji = isLogo ? "🔥" : "🍢";
  const title = isLogo ? "PJT" : t;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#171717"/><stop offset="1" stop-color="#2b150b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#g)"/>
  <circle cx="300" cy="215" r="104" fill="none" stroke="#F4511E" stroke-width="3" opacity="0.55"/>
  <circle cx="300" cy="215" r="86" fill="rgba(244,81,30,0.10)"/>
  <text x="300" y="245" font-size="86" text-anchor="middle">${emoji}</text>
  <text x="300" y="376" font-size="34" fill="#FFFFFF" font-family="Segoe UI,Arial,sans-serif"
        font-weight="700" text-anchor="middle">${title}</text>
  <text x="300" y="410" font-size="17" fill="#F4511E" font-family="Segoe UI,Arial,sans-serif"
        font-weight="700" letter-spacing="4" text-anchor="middle">PUNJAB JAB TIKKAH</text>
</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
/* Capture-phase image error handler (covers all images, injected or not) */
document.addEventListener("error", (e) => {
  const el = e.target;
  if(!el || el.tagName !== "IMG" || el.dataset.fallbackApplied) return;
  el.dataset.fallbackApplied = "1";
  const isLogo = el.hasAttribute("data-logo") || /logo/i.test(el.getAttribute("src") || "");
  el.src = svgPlaceholder(el.alt || "", isLogo ? "logo" : "food");
}, true);

/* =====================================================================
   6. TOAST NOTIFICATIONS
   ===================================================================== */
function showToast(title, desc = "", type = "success"){
  const wrap = $("#toasts");
  if(!wrap) return;
  const ico = type === "error" ? "⚠️" : type === "info" ? "ℹ️" : "✓";
  const el = document.createElement("div");
  el.className = `toast toast--${type}`;
  el.setAttribute("role", "status");
  el.innerHTML = `
    <span class="toast__ico" aria-hidden="true">${ico}</span>
    <div class="toast__body">
      <p class="toast__title">${escapeHtml(title)}</p>
      ${desc ? `<p class="toast__desc">${escapeHtml(desc)}</p>` : ""}
    </div>
    <button class="toast__x" type="button" aria-label="Dismiss notification">✕</button>`;
  wrap.appendChild(el);
  const remove = () => {
    if(!el.isConnected) return;
    el.classList.add("out");
    setTimeout(() => el.remove(), 320);
  };
  el.querySelector(".toast__x").addEventListener("click", remove);
  setTimeout(remove, 3600);
  while(wrap.children.length > 4) wrap.firstElementChild.remove();
}

/* =====================================================================
   7. RENDERING — categories, products, deals, reviews, gallery
   ===================================================================== */
function renderCategories(){
  const grid = $("#categoryGrid");
  if(!grid) return;
  grid.innerHTML = CATEGORIES.map(c => {
    const count = c.id === "Deals" ? deals.length : products.filter(p => p.category === c.id).length;
    return `
      <button class="cat-card${state.activeCategory === c.id ? " is-active" : ""}" type="button"
              role="listitem" data-category="${escapeHtml(c.id)}" aria-pressed="${state.activeCategory === c.id}">
        <span class="cat-card__ico" aria-hidden="true">${c.ico}</span>
        <span class="cat-card__name">${escapeHtml(c.name)}</span>
        <span class="cat-card__count">${count} item${count === 1 ? "" : "s"}</span>
      </button>`;
  }).join("");
}

function renderMenuChips(){
  const wrap = $("#menuCategoryChips");
  if(!wrap) return;
  const chips = [{ id:"All", name:"All", ico:"🍽️" }].concat(CATEGORIES);
  wrap.innerHTML = chips.map(c => `
    <button class="chip${state.activeCategory === c.id ? " is-active" : ""}" type="button"
            role="tab" aria-selected="${state.activeCategory === c.id}"
            data-category="${escapeHtml(c.id)}">
      <span class="chip__ico" aria-hidden="true">${c.ico}</span>${escapeHtml(c.name)}
    </button>`).join("");
}

function productCard(p){
  return `
    <article class="p-card" data-product-id="${p.id}">
      <div class="p-card__media" data-open-product="${p.id}" role="button" tabindex="0"
           aria-label="View details for ${escapeHtml(p.name)}">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async"
             width="600" height="450" />
        <span class="p-card__cat">${escapeHtml(p.category)}</span>
        <span class="p-card__rating"><span aria-hidden="true">⭐</span> ${p.rating}</span>
      </div>
      <div class="p-card__body">
        <h3 class="p-card__name">${escapeHtml(p.name)}</h3>
        <p class="p-card__desc">${escapeHtml(p.description)}</p>
        <div class="p-card__foot">
          <span class="p-card__price">${formatPrice(p.price)}</span>
          <button class="p-card__add" type="button" data-quick-add="${p.id}"
                  aria-label="Add ${escapeHtml(p.name)} to cart">Add to Cart</button>
        </div>
      </div>
      <button class="p-card__open" type="button" data-open-product="${p.id}"
              aria-label="Open ${escapeHtml(p.name)} details" tabindex="-1"></button>
    </article>`;
}

function dealCard(d){
  const save = Math.max(0, d.was - d.price);
  return `
    <article class="deal-card" data-deal-id="${d.id}">
      <span class="deal-card__flag">Special Deal</span>
      <span class="deal-card__ico" aria-hidden="true">${d.ico}</span>
      <h3 class="deal-card__name">${escapeHtml(d.name)}</h3>
      <p class="section__sub" style="margin:0">${escapeHtml(d.description)}</p>
      <ul class="deal-card__items">${d.items.map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      <div class="deal-card__price-row">
        <span class="deal-card__price">${formatPrice(d.price)}</span>
        <span class="deal-card__was">${formatPrice(d.was)}</span>
        <span class="deal-card__save">Save ${formatPrice(save)}</span>
      </div>
      <button class="btn btn--primary btn--block" type="button" data-add-deal="${d.id}">
        Add Deal to Cart
      </button>
    </article>`;
}

function renderDeals(){
  const grid = $("#dealsGrid");
  if(grid) grid.innerHTML = deals.map(dealCard).join("");
}

function renderPopular(){
  const grid = $("#popularGrid");
  if(!grid) return;
  const list = products
    .filter(p => p.popular)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);
  grid.innerHTML = list.map(productCard).join("");
}

/* --- Menu: filter + search + sort ----------------------------------- */
function filterProducts(){
  const q = state.searchQuery.trim().toLowerCase();
  let list = products.slice();

  if(state.activeCategory && state.activeCategory !== "All"){
    list = list.filter(p => p.category === state.activeCategory);
  }
  if(q){
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  switch(state.sort){
    case "rating":     list.sort((a,b) => b.rating - a.rating); break;
    case "price-asc":  list.sort((a,b) => a.price - b.price);   break;
    case "price-desc": list.sort((a,b) => b.price - a.price);   break;
    case "name":       list.sort((a,b) => a.name.localeCompare(b.name)); break;
    default:           list.sort((a,b) => (b.popular - a.popular) || (b.rating - a.rating));
  }
  return list;
}

function searchProducts(term){
  state.searchQuery = typeof term === "string" ? term : state.searchQuery;
  const headerInput = $("#globalSearch");
  const menuInput   = $("#menuSearch");
  if(headerInput && headerInput.value !== state.searchQuery) headerInput.value = state.searchQuery;
  if(menuInput && menuInput.value !== state.searchQuery) menuInput.value = state.searchQuery;
  renderMenu();

  const count = state.searchQuery.trim() ? filterProducts().length : products.length;
  const sc = $("#searchResultCount");
  if(sc){
    sc.textContent = state.searchQuery.trim()
      ? `${count} item${count === 1 ? "" : "s"} matching “${state.searchQuery}”`
      : "Type to search the full menu";
  }
}

function renderMenu(){
  const grid  = $("#menuGrid");
  const empty = $("#menuEmpty");
  const status= $("#menuStatus");
  if(!grid) return;

  // The "Deals" category shows deal cards instead of products
  if(state.activeCategory === "Deals"){
    const q = state.searchQuery.trim().toLowerCase();
    const list = q ? deals.filter(d =>
      d.name.toLowerCase().includes(q) || d.items.join(" ").toLowerCase().includes(q)
    ) : deals;
    grid.innerHTML = list.map(dealCard).join("");
    if(empty) empty.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    if(status) status.textContent = list.length
      ? `${list.length} deal${list.length === 1 ? "" : "s"} available`
      : "";
    updateCategorySelection();
    return;
  }

  const list = filterProducts();
  grid.innerHTML = list.map(productCard).join("");
  grid.hidden = list.length === 0;
  if(empty) empty.hidden = list.length > 0;

  if(status){
    const bits = [];
    if(state.activeCategory !== "All") bits.push(state.activeCategory);
    if(state.searchQuery.trim()) bits.push(`“${state.searchQuery.trim()}”`);
    status.textContent = list.length
      ? `Showing ${list.length} item${list.length === 1 ? "" : "s"}${bits.length ? " — " + bits.join(" · ") : ""}`
      : "";
  }
  updateCategorySelection();
}

function updateCategorySelection(){
  $$("[data-category]").forEach(el => {
    const on = el.dataset.category === state.activeCategory;
    el.classList.toggle("is-active", on);
    if(el.hasAttribute("aria-pressed")) el.setAttribute("aria-pressed", String(on));
    if(el.hasAttribute("aria-selected")) el.setAttribute("aria-selected", String(on));
  });
}

/* Alias required by the spec */
function renderProducts(){ renderMenu(); }

/* --- Reviews slider -------------------------------------------------- */
function renderReviews(){
  const track = $("#reviewTrack");
  const dots  = $("#reviewDots");
  if(!track) return;

  track.innerHTML = reviews.map(r => `
    <div class="review-slide">
      <article class="review-card">
        <span class="review-card__demo">Demo / sample review</span>
        <div class="review-card__stars" aria-label="${r.rating} out of 5 stars">
          <span class="stars" aria-hidden="true">${stars(r.rating)}</span>
        </div>
        <p class="review-card__text">“${escapeHtml(r.text)}”</p>
        <div class="review-card__who">
          <span class="review-card__avatar" aria-hidden="true">${escapeHtml(r.name.charAt(0))}</span>
          <div>
            <p class="review-card__name">${escapeHtml(r.name)}</p>
            <p class="review-card__tag">${escapeHtml(r.role)} · ⭐ ${r.rating}.0</p>
          </div>
        </div>
      </article>
    </div>`).join("");

  if(dots){
    dots.innerHTML = reviews.map((_, i) => `
      <button class="slider-dot${i === 0 ? " is-active" : ""}" type="button"
              role="tab" aria-selected="${i === 0}" aria-label="Review ${i + 1}" data-review-dot="${i}"></button>`).join("");
  }
  state.reviewIndex = 0;
  goReview(0);
}

function goReview(i){
  const track = $("#reviewTrack");
  if(!track) return;
  const total = reviews.length;
  state.reviewIndex = ((i % total) + total) % total;
  track.style.transform = `translateX(-${state.reviewIndex * 100}%)`;
  $$("[data-review-dot]").forEach((d, idx) => {
    d.classList.toggle("is-active", idx === state.reviewIndex);
    d.setAttribute("aria-selected", String(idx === state.reviewIndex));
  });
}

/* --- Gallery --------------------------------------------------------- */
function renderGalleryChips(){
  const wrap = $("#galleryChips");
  if(!wrap) return;
  wrap.innerHTML = GALLERY_CATS.map(c => `
    <button class="chip${state.galleryFilter === c ? " is-active" : ""}" type="button"
            role="tab" aria-selected="${state.galleryFilter === c}"
            data-gallery-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("");
}

function renderGallery(){
  const grid = $("#galleryGrid");
  if(!grid) return;
  const list = state.galleryFilter === "All"
    ? gallery
    : gallery.filter(g => g.cat === state.galleryFilter);
  state.lightboxItems = list;
  grid.innerHTML = list.map((g, i) => `
    <figure class="g-item" data-gallery-index="${i}" role="button" tabindex="0"
            aria-label="Open ${escapeHtml(g.cap)} in full screen">
      <img src="${g.src}" alt="${escapeHtml(g.cap)}" loading="lazy" decoding="async" width="600" height="600" />
      <figcaption class="g-item__overlay">
        <span class="g-item__cap">${escapeHtml(g.cap)}<span>${escapeHtml(g.cat)}</span></span>
      </figcaption>
    </figure>`).join("");
}

/* --- Contact + social ------------------------------------------------ */
function renderContact(){
  const grid = $("#contactGrid");
  if(!grid) return;
  const phoneDisplay = displayPhone(RESTAURANT.phone);
  const cards = [
    { ico:"📞", title:"Call Us", body:"Tap to call and place your order.", action:"tel",
      link:`tel:+${String(RESTAURANT.phone).replace(/\D/g,"")}`, label:phoneDisplay },
    { ico:"📱", title:"WhatsApp", body:"Send your order directly on WhatsApp.", action:"wa",
      link:buildWhatsAppShareUrl(""), label:whatsAppLabel() },
    { ico:"📍", title:"Location", body:RESTAURANT.address, action:"link",
      link:buildDirectionsUrl(), label:"Open in Google Maps" },
    { ico:"🕒", title:"Opening Hours", body:"Open daily", action:"none",
      link:"", label:RESTAURANT.openingHours }
  ];
  grid.innerHTML = cards.map(c => {
    const inner = `
      <span class="c-card__ico" aria-hidden="true">${c.ico}</span>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.body)}</p>
      <strong>${escapeHtml(c.label)}</strong>`;
    if(c.action === "none") return `<article class="c-card">${inner}</article>`;
    return `<article class="c-card"><a href="${escapeHtml(c.link)}" ${c.action === "link" ? 'target="_blank" rel="noopener"' : ""}>${inner}</a></article>`;
  }).join("");
}

function renderSocial(){
  const wrap = $("#footerSocial");
  if(!wrap) return;
  const links = [
    { name:"Facebook",  short:"f", url:RESTAURANT.facebook },
    { name:"Instagram", short:"ig", url:RESTAURANT.instagram },
    { name:"TikTok",    short:"tt", url:RESTAURANT.tiktok }
  ];
  wrap.innerHTML = links.map(l =>
    `<a class="social-btn" href="${escapeHtml(l.url)}" target="_blank" rel="noopener"
        aria-label="${escapeHtml(l.name)}" title="${escapeHtml(l.name)}">${escapeHtml(l.short)}</a>`
  ).join("");
}

/* --- Hero + about images --------------------------------------------- */
function renderHero(){
  const hero = products.find(p => p.popular) || products[0];
  const img  = $("#heroDishImage");
  if(img && hero){
    img.src = hero.image;
    img.alt = hero.name;
    img.loading = "eager";
  }
  if(hero){
    setText("#heroDishName", hero.name);
    setText("#heroDishRating", hero.rating.toFixed(1));
    setText("#heroDishPrice", formatPrice(hero.price));
  }
  const about = $("#aboutImage");
  if(about){ about.src = IMG.grill; about.loading = "lazy"; }
}
function setText(sel, val){ const el = $(sel); if(el) el.textContent = val; }

/* --- Static config text (address, hours, links) ---------------------- */
function renderConfigText(){
  $$("[data-config]").forEach(el => {
    const key = el.dataset.config;
    if(key in RESTAURANT) el.textContent = RESTAURANT[key];
  });
  setText("#year", String(new Date().getFullYear()));

  const dir = $("#directionsBtn");
  if(dir) dir.href = buildDirectionsUrl();

  const call = $("#locationCallBtn");
  if(call) call.href = `tel:+${String(RESTAURANT.phone).replace(/\D/g,"")}`;

  const wa = $("#footerWhatsApp");
  if(wa) wa.href = buildWhatsAppShareUrl(defaultWhatsAppMessage());

  const mapFrame = $("#mapFrame");
  if(mapFrame && RESTAURANT.mapEmbedUrl) mapFrame.src = RESTAURANT.mapEmbedUrl;
}

function displayPhone(p){
  const d = String(p || "").replace(/\D/g,"");
  if(d.length < 10) return String(p || "");
  return "+" + d;
}
function buildDirectionsUrl(){
  if(RESTAURANT.directionsUrl) return RESTAURANT.directionsUrl;
  const q = encodeURIComponent(RESTAURANT.name + " " + RESTAURANT.address);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/* =====================================================================
   8. WHATSAPP
   ===================================================================== */
function getWhatsAppNumber(){
  const a = String(WHATSAPP_NUMBER || "").replace(/\D/g, "");
  if(a.length >= 12) return a;
  const b = String(RESTAURANT.whatsapp || "").replace(/\D/g, "");
  if(b.length >= 12) return b;
  return null;
}
function whatsAppLabel(){
  const n = getWhatsAppNumber();
  return n ? "+" + n : "Chat on WhatsApp";
}
function buildWhatsAppShareUrl(message){
  const num = getWhatsAppNumber();
  const text = encodeURIComponent(message || "");
  return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
}
function defaultWhatsAppMessage(){
  return `Hello ${RESTAURANT.name}! I would like to place an order.`;
}
function sendWhatsAppOrder(order){
  let msg;
  if(order){
    msg = buildOrderWhatsAppMessage(order);
  }else if(state.cart.length){
    msg = buildCartWhatsAppMessage();
  }else{
    msg = defaultWhatsAppMessage();
  }
  const url = buildWhatsAppShareUrl(msg);
  window.open(url, "_blank", "noopener");
  if(!getWhatsAppNumber()){
    showToast("WhatsApp number not set", "Replace WHATSAPP_NUMBER in script.js with the real number.", "info");
  }else{
    showToast("Opening WhatsApp", "Your order details were added to the message.", "success");
  }
}
function buildCartWhatsAppMessage(){
  const t = calculateCart();
  const lines = state.cart.map(l =>
    `• ${l.name} x${l.qty}${l.options ? ` (${l.options})` : ""} — ${formatPrice(l.price * l.qty)}`
  ).join("\n");
  return [
    `*${RESTAURANT.name}*`,
    "",
    "*My Cart:*",
    lines,
    "",
    `Subtotal: ${formatPrice(t.subtotal)}`,
    `Delivery: ${formatPrice(t.delivery)}`,
    (t.discount > 0 ? `Discount: -${formatPrice(t.discount)}` : ""),
    `*Total: ${formatPrice(t.total)}*`
  ].filter(Boolean).join("\n");
}
function buildOrderWhatsAppMessage(o){
  const lines = o.items.map(l =>
    `• ${l.name} x${l.qty}${l.options ? ` (${l.options})` : ""} — ${formatPrice(l.price * l.qty)}`
  ).join("\n");
  const c = o.customer || {};
  return [
    `*${RESTAURANT.name}*`,
    "",
    `Customer Name: ${c.name || "-"}`,
    `Phone: ${c.phone || "-"}`,
    `Order Number: ${o.number}`,
    "",
    "*Items:*",
    lines,
    "",
    `Subtotal: ${formatPrice(o.totals.subtotal)}`,
    `Delivery: ${formatPrice(o.totals.delivery)}`,
    (o.totals.discount > 0 ? `Discount: -${formatPrice(o.totals.discount)}` : ""),
    `*Total: ${formatPrice(o.totals.total)}*`,
    "",
    `Type: ${o.orderType === "delivery" ? "Delivery" : "Pickup"}`,
    `Address: ${o.orderType === "delivery" ? [c.address, c.area, c.city].filter(Boolean).join(", ") : "Pickup from " + RESTAURANT.name}`,
    `Payment: ${paymentLabel(o.payment)}`
  ].filter(x => x !== null && x !== undefined && x !== "").join("\n");
}
function paymentLabel(p){
  return p === "cod" ? "Cash on Delivery"
       : p === "venue" ? "Pay at Restaurant"
       : p === "online" ? "Online Payment (Demo)"
       : "—";
}

/* =====================================================================
   9. PRODUCT DETAILS — fully data-driven
   Every field below is rendered from the `products` array. Nothing about a
   specific dish is hard-coded in the markup.
   ===================================================================== */

/* Category icons used for the badge over the image */
const CAT_ICO = (CATEGORIES.reduce((acc, c) => (acc[c.id] = c.ico, acc), {}), {});

/* Related shots per category, used to build the thumbnail gallery.
   The product's own photo is always image #1. */
const CAT_GALLERY = {
  "Tikkah":    ["tikkah","malai","boti","grill"],
  "BBQ":       ["platter","familyPlatter","kababPlatter","grill"],
  "Kebabs":    ["seekh","malaiBoti","kababTali","grill"],
  "Chicken":   ["chargha","handi","wings","roll"],
  "Desi Food": ["karahi","muttonKarahi","daal","nihari"],
  "Rice":      ["biryani","pulao","plainRice","haleem"],
  "Drinks":    ["coldDrink","lassi","margarita","water"],
  "Sides":     ["fries","naan","garlicNaan","salad"],
  "Deals":     ["familyPlatter","platter","grill"]
};

/* Build the image list for a product (1–4 unique images). */
function galleryFor(product){
  const pool = CAT_GALLERY[product.category] || [product.category];
  const list = [product.image];
  pool.forEach(k => {
    if(list.length < 4 && IMG[k] && !list.includes(IMG[k])) list.push(IMG[k]);
  });
  return list;
}

/* Extras are per-product when the product defines them, otherwise the
   global EXTRAS list is offered. Products may set `extras:false` to hide
   the section entirely (section is never rendered empty). */
function extrasFor(product){
  if(product.extras === false) return [];
  return product.extrasList || EXTRAS;
}
function spiceEnabled(product){
  return product.spice !== false;
}

function isFavorite(id){
  return state.favorites.indexOf(Number(id)) !== -1;
}

function toggleFavorite(id, silent){
  const pid = Number(id);
  const i = state.favorites.indexOf(pid);
  let added;
  if(i === -1){ state.favorites.push(pid); added = true; }
  else        { state.favorites.splice(i, 1); added = false; }
  storeSet(STORE.favorites, state.favorites);
  if(!silent) showToast(added ? "Saved to favourites" : "Removed from favourites", "", "info");
  return added;
}

function renderFavButton(){
  const btn = $("#pmFavBtn");
  const p = state.currentProduct;
  if(!btn || !p) return;
  const on = isFavorite(p.id);
  btn.setAttribute("aria-pressed", on ? "true" : "false");
  btn.setAttribute("aria-label", on ? "Remove from favourites" : "Save to favourites");
  const ico = btn.querySelector(".pm__fav-ico");
  if(ico) ico.textContent = on ? "♥" : "♡";
}

function renderThumbs(images){
  const wrap = $("#pmThumbs");
  if(!wrap) return;
  wrap.innerHTML = "";
  // spec: hide the thumbnail rail when there is only one image
  wrap.hidden = images.length < 2;

  images.forEach((src, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pm__thumb";
    b.setAttribute("aria-current", i === 0 ? "true" : "false");
    b.setAttribute("aria-label", `Show image ${i + 1} of ${images.length}`);
    b.innerHTML = `<img src="${escapeHtml(src)}" alt="" loading="lazy" decoding="async" />`;
    b.addEventListener("click", () => pmSelectImage(i));
    wrap.appendChild(b);
  });
}

function pmSelectImage(i){
  const img = $("#pmImage");
  const thumbs = $$("#pmThumbs .pm__thumb");
  if(!img || !thumbs.length) return;
  const target = thumbs[i];
  if(!target) return;

  img.classList.add("is-swapping");
  img.src = target.querySelector("img").src;
  img.alt = `${state.currentProduct ? state.currentProduct.name : "Product"} — image ${i + 1}`;
  thumbs.forEach((t, n) => t.setAttribute("aria-current", n === i ? "true" : "false"));

  window.setTimeout(() => img.classList.remove("is-swapping"), 300);
}

function openProductModal(id){
  const p = products.find(x => x.id === Number(id));
  if(!p){ showToast("Item not found", "", "error"); return; }

  state.currentProduct = p;
  state.pmQty = 1;
  state.pmGallery = galleryFor(p);

  /* ---- media ---- */
  const img = $("#pmImage");
  if(img){
    img.src = state.pmGallery[0];
    img.alt = p.name;
    delete img.dataset.fallbackApplied;
  }
  renderThumbs(state.pmGallery);

  setText("#pmCategory", `${CAT_ICO[p.category] ? CAT_ICO[p.category] + " " : ""}${p.category}`);
  setText("#pmBarTitle", p.name);

  /* ---- text ---- */
  setText("#pmName", p.name);
  setText("#pmDesc", p.description);
  setText("#pmStars", stars(p.rating));
  setText("#pmRatingNum", Number(p.rating).toFixed(1));
  setText("#pmRatingText", "Rated by customers · demo data");
  const priceEl = $("#productModal [data-price]");
  if(priceEl) priceEl.textContent = formatPrice(p.price);

  /* ---- optional discount (only shown when the product defines oldPrice) ---- */
  const wasEl = $("#pmWasPrice");
  const offEl = $("#pmOffBadge");
  if(p.oldPrice && p.oldPrice > p.price){
    if(wasEl){ wasEl.textContent = formatPrice(p.oldPrice); wasEl.hidden = false; }
    if(offEl){
      const pctOff = Math.round((1 - p.price / p.oldPrice) * 100);
      offEl.textContent = `${pctOff}% OFF`;
      offEl.hidden = false;
    }
  }else{
    if(wasEl) wasEl.hidden = true;
    if(offEl) offEl.hidden = true;
  }

  /* ---- quantity ---- */
  const qtyEl = $("#pmQty");
  if(qtyEl) qtyEl.value = "1";

  /* ---- spice (hidden entirely when unsupported) ---- */
  const spiceBlock = $("#pmSpiceBlock");
  const spiceWrap = $("#pmSpice");
  const hasSpice = spiceEnabled(p);
  if(spiceBlock) spiceBlock.hidden = !hasSpice;
  if(spiceWrap){
    spiceWrap.innerHTML = hasSpice ? (p.spiceOptions || SPICE_LEVELS).map((level, i) => `
      <label class="pick">
        <input type="radio" name="spice" value="${escapeHtml(level)}"${i === 0 ? " checked" : ""} />
        <span class="pick__mark" aria-hidden="true">✓</span>
        <span class="pick__name">${escapeHtml(level)}</span>
      </label>`).join("") : "";
  }

  /* ---- extras (hidden entirely when none apply) ---- */
  const extrasBlock = $("#pmExtrasBlock");
  const extrasWrap = $("#pmExtras");
  const pExtras = extrasFor(p);
  if(extrasBlock) extrasBlock.hidden = pExtras.length === 0;
  if(extrasWrap){
    extrasWrap.innerHTML = pExtras.map(x => `
      <label class="pick">
        <input type="checkbox" value="${escapeHtml(x.id)}" data-extra />
        <span class="pick__mark" aria-hidden="true">✓</span>
        <span class="pick__name">${escapeHtml(x.name)}</span>
        <span class="pick__extra">+${formatPrice(x.price)}</span>
      </label>`).join("");
  }

  /* ---- special instructions ---- */
  const notes = $("#pmNotes");
  if(notes){ notes.value = ""; }
  setText("#pmNotesCount", "0");

  renderFavButton();
  updateProductModalTotal();
  openModal("productModal");

  const stage = $(".pm__stage");
  if(stage) stage.scrollTop = 0;
}

/* Single source of truth for every price shown in the product modal. */
function pmSelection(){
  const p = state.currentProduct;
  if(!p) return null;

  const qty = Math.max(1, state.pmQty);
  const spiceEl = $("#pmSpice input:checked");
  const spice = spiceEl ? spiceEl.value : (spiceEnabled(p) ? "Mild" : "");
  const extras = $$("#pmExtras input[data-extra]:checked").map(i => i.value);
  const extrasTotal = extras.reduce((s, id) => {
    const found = extrasFor(p).find(x => x.id === id);
    return s + ((found && found.price) || 0);
  }, 0);

  const basePrice = p.price;
  const finalUnitPrice = basePrice + extrasTotal;
  const totalPrice = finalUnitPrice * qty;
  const notesEl = $("#pmNotes");
  const instructions = (notesEl && notesEl.value ? notesEl.value : "").trim().slice(0, 150);

  return { product:p, qty, spice, extras, extrasTotal, basePrice, finalUnitPrice, totalPrice, instructions };
}

function updateProductModalTotal(){
  const s = pmSelection();
  if(!s) return;

  setText("#pmTotal", formatPrice(s.totalPrice));
  setText("#pmQty", String(s.qty));

  const calc = $("#pmCalc");
  if(calc){
    calc.innerHTML = s.qty === 1
      ? `${formatPrice(s.finalUnitPrice)} × 1`
      : `${s.qty} × <b>${formatPrice(s.finalUnitPrice)}</b> = <b>${formatPrice(s.totalPrice)}</b>`
        + (s.extrasTotal ? ` <span style="opacity:.8">(includes ${formatPrice(s.extrasTotal)} extras)</span>` : "");
  }

  const notes = $("#pmNotes");
  const counter = $("#pmNotesCount");
  if(notes && counter) counter.textContent = String(notes.value.length);

  const addBtn = $("#pmAddToCart");
  if(addBtn){
    addBtn.innerHTML = `<span aria-hidden="true">🛒</span> Add to Cart — ${escapeHtml(formatPrice(s.totalPrice))}`;
  }
}

function pmChangeQty(delta){
  // never below 1
  state.pmQty = Math.min(50, Math.max(1, state.pmQty + delta));
  updateProductModalTotal();
}

function pmAddToCart(openCheckoutAfter){
  const s = pmSelection();
  if(!s){ showToast("Item unavailable", "", "error"); return; }

  const p = s.product;
  addToCart(p.id, {
    qty: s.qty,
    spice: s.spice,
    extras: s.extras,
    notes: s.instructions,
    extrasList: extrasFor(p)
  });

  const addBtn = $("#pmAddToCart");
  if(addBtn){
    addBtn.classList.add("is-done");
    window.setTimeout(() => addBtn.classList.remove("is-done"), 460);
  }

  closeModal("productModal");
  if(openCheckoutAfter) openCheckout();
}

/* =====================================================================
   10. CART
   ===================================================================== */
function lineKey(id, opts){
  const spice = opts.spice || "";
  const extras = (opts.extras || []).slice().sort().join(",");
  const notes = (opts.notes || "").trim().toLowerCase().replace(/\s+/g, " ");
  // Same product + same customisation merges; anything different is its own line.
  return `${id}|${spice}|${extras}|${notes}`;
}
function optionsLabel(spice, extras, notes, pool){
  const parts = [];
  if(spice) parts.push(spice === "Mild" ? "Spice: Mild" : spice);
  const list = pool || EXTRAS;
  const ex = (extras || []).map(id => (list.find(x => x.id === id) || {}).name).filter(Boolean);
  if(ex.length) parts.push(ex.join(", "));
  const label = parts.join(" · ");
  return notes ? (label ? `${label} — ${notes}` : notes) : label;
}

/* Extra price lookup that works for both the default and per-product lists */
function extrasPriceFor(extras, list){
  const pool = list || EXTRAS;
  return (extras || []).reduce((s, id) => {
    const found = pool.find(x => x.id === id);
    return s + ((found && found.price) || 0);
  }, 0);
}
function lineUnitPrice(basePrice, extras){
  return basePrice + extrasPriceFor(extras);
}

/* Main add function — supports products and deals */
function addToCart(id, opts = {}){
  const qty = Math.max(1, Number(opts.qty) || 1);
  const deal = deals.find(d => d.id === id);
  const product = products.find(p => p.id === Number(id));

  if(deal){
    const key = `deal|${deal.id}`;
    const existing = state.cart.find(l => l.key === key);
    if(existing) existing.qty += qty;
    else state.cart.push({
      key, id: deal.id, type: "deal", name: deal.name, price: deal.price,
      basePrice: deal.price, finalUnitPrice: deal.price, totalPrice: deal.price * qty,
      image: deal.image, qty, quantity: qty, spice: "", spiceLevel: "",
      extras: [], instructions: "", options: deal.items.join(" + ")
    });
    saveCart(); renderCart(); bumpCartCount();
    showToast(`${deal.name} added to cart`, `${formatPrice(deal.price)} · deal`, "success");
    return;
  }

  if(!product){ showToast("Item not found", "", "error"); return; }

  const spice  = spiceEnabled(product) ? (opts.spice || "Mild") : "";
  const extras = opts.extras || [];
  const notes  = (opts.notes || "").trim().slice(0, 150);
  const list   = opts.extrasList || extrasFor(product);

  const key = lineKey(product.id, { spice, extras, notes });
  const existing = state.cart.find(l => l.key === key);

  if(existing){
    existing.qty += qty;
    existing.quantity = existing.qty;
    existing.totalPrice = existing.finalUnitPrice * existing.qty;
  }else{
    // Full, self-describing cart line so the cart can show exactly what was chosen.
    const finalUnitPrice = product.price + extrasPriceFor(extras, list);
    state.cart.push({
      key,
      id: product.id,
      productId: product.id,
      type: "item",
      name: product.name,
      image: product.image,
      basePrice: product.price,
      finalUnitPrice,
      price: finalUnitPrice,          // legacy field used by totals/receipt
      totalPrice: finalUnitPrice * qty,
      qty,
      quantity: qty,
      spice,
      spiceLevel: spice,
      extras,
      extrasPool: list,
      instructions: notes,
      notes,
      options: optionsLabel(spice, extras, notes, list)
    });
  }

  saveCart(); renderCart(); bumpCartCount();
  const unitFinal = product.price + extrasPriceFor(extras, list);
  showToast(`${product.name} added to cart`,
    `${formatPrice(unitFinal * qty)} · qty ${qty}${notes ? " · note saved" : ""}`, "success");
}

/* Keep the open checkout view in sync with cart edits */
function refreshCheckoutIfOpen(){
  const m = document.getElementById("checkoutModal");
  if(m && !m.hidden && state.checkoutStep !== 6) renderCheckout();
}

function removeFromCart(key){
  const idx = state.cart.findIndex(l => l.key === key);
  if(idx === -1) return;
  const [removed] = state.cart.splice(idx, 1);
  saveCart(); renderCart(); refreshCheckoutIfOpen();
  showToast("Item removed from cart", removed ? removed.name : "", "info");
}

function updateQuantity(key, delta){
  const line = state.cart.find(l => l.key === key);
  if(!line) return;
  line.qty += delta;
  if(line.qty <= 0){ removeFromCart(key); return; }
  if(line.qty > 99) line.qty = 99;
  saveCart(); renderCart(); refreshCheckoutIfOpen();
}

function calculateCart(){
  const subtotal = state.cart.reduce((s, l) => s + l.price * l.qty, 0);
  const count    = state.cart.reduce((s, l) => s + l.qty, 0);

  const freeShip = state.promo && state.promo.type === "shipping";
  let delivery = 0;
  if(state.orderType === "delivery" && subtotal > 0){
    delivery = (freeShip || subtotal >= FREE_DELIVERY_OVER) ? 0 : DELIVERY_FEE;
  }

  let discount = 0;
  if(subtotal >= AUTO_DISCOUNT_OVER) discount += AUTO_DISCOUNT;
  if(state.promo){
    if(state.promo.type === "percent") discount += Math.round(subtotal * state.promo.value / 100);
    else if(state.promo.type === "fixed") discount += state.promo.value;
  }
  discount = Math.min(discount, subtotal);

  const total = Math.max(0, subtotal + delivery - discount);
  return { count, subtotal, delivery, discount, total };
}

function bumpCartCount(){
  const el = $("#cartCount");
  if(!el) return;
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

function renderCart(){
  const t = calculateCart();
  const body = $("#cartBody");
  const foot = $("#cartFoot");

  setText("#cartCount", String(t.count));
  const cc = $("#cartCount"); if(cc) cc.dataset.count = String(t.count);
  setText("#cartDrawerCount", `(${t.count})`);
  setText("#stickyCartCount", String(t.count));
  setText("#stickyCartText", `${t.count} item${t.count === 1 ? "" : "s"} — ${formatPrice(t.total)}`);

  const sticky = $("#stickyCartBtn");
  if(sticky) sticky.hidden = t.count === 0;

  if(!body) return;

  if(state.cart.length === 0){
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__ico" aria-hidden="true">🛒</div>
        <p class="cart-empty__title">Your cart is empty</p>
        <p class="cart-empty__text">Add something delicious from the menu.</p>
        <button class="btn btn--primary" type="button" data-browse-menu>Browse Menu</button>
      </div>`;
    if(foot) foot.hidden = true;
    return;
  }

  body.innerHTML = state.cart.map(l => `
    <div class="c-item" data-line="${escapeHtml(l.key)}">
      <img class="c-item__img" src="${l.image}" alt="${escapeHtml(l.name)}" loading="lazy" width="74" height="74" />
      <div class="c-item__main">
        <p class="c-item__name">${escapeHtml(l.name)}</p>
        ${l.options ? `<p class="c-item__opts">${escapeHtml(l.options)}</p>` : ""}
        <p class="c-item__price">${formatPrice(l.price * l.qty)}</p>
        <div class="c-item__row">
          <div class="qty" role="group" aria-label="Quantity for ${escapeHtml(l.name)}">
            <button class="qty__btn" type="button" data-qty="-1" data-line="${escapeHtml(l.key)}"
                    aria-label="Decrease quantity">−</button>
            <input class="qty__value" type="text" value="${l.qty}" readonly aria-label="Quantity" />
            <button class="qty__btn" type="button" data-qty="1" data-line="${escapeHtml(l.key)}"
                    aria-label="Increase quantity">+</button>
          </div>
          <button class="c-item__remove" type="button" data-remove="${escapeHtml(l.key)}">Remove</button>
        </div>
      </div>
    </div>`).join("");

  if(foot) foot.hidden = false;
  setText("#tSubtotal", formatPrice(t.subtotal));
  setText("#tDelivery", t.delivery === 0 ? (state.orderType === "pickup" ? "Pickup" : "Free") : formatPrice(t.delivery));
  setText("#tDiscount", `− ${formatPrice(t.discount)}`);
  setText("#tGrand", formatPrice(t.total));
  const dRow = $("#tDiscountRow");
  if(dRow) dRow.hidden = t.discount <= 0;

  const pi = $("#promoInput");
  if(pi && state.promo) pi.value = state.promo.code;
}

function openCart(){ openModal("cartDrawer"); }
function closeCart(){ closeModal("cartDrawer"); }

/* --- Promo codes ------------------------------------------------------ */
function applyPromo(){
  const input = $("#promoInput");
  const msg   = $("#promoMsg");
  if(!input || !msg) return;
  const code = input.value.trim().toUpperCase();
  if(!code){ msg.textContent = "Enter a promo code."; msg.className = "promo__msg err"; return; }

  const rule = PROMO_CODES[code];
  if(!rule){
    state.promo = null; savePromo();
    msg.textContent = `“${code}” is not a valid code.`;
    msg.className = "promo__msg err";
    renderCart();
    return;
  }
  state.promo = Object.assign({ code }, rule);
  savePromo(); renderCart();
  msg.textContent = `✓ ${code} applied — ${rule.label}`;
  msg.className = "promo__msg ok";
  showToast("Promo applied", rule.label, "success");
}
function clearPromo(){
  state.promo = null; savePromo();
  const msg = $("#promoMsg");
  if(msg){ msg.textContent = ""; msg.className = "promo__msg"; }
  const pi = $("#promoInput"); if(pi) pi.value = "";
  renderCart();
}

/* =====================================================================
   11. MODAL / DRAWER PLUMBING
   ===================================================================== */
const overlayStack = [];

function focusables(root){
  return $$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', root)
    .filter(el => el.offsetParent !== null || el === document.activeElement);
}
function openModal(id){
  const el = document.getElementById(id);
  if(!el || !el.hidden) return;
  el._prevFocus = document.activeElement;
  el.hidden = false;
  el.dataset.open = "1";
  if(!overlayStack.includes(id)) overlayStack.push(id);
  document.body.style.overflow = "hidden";
  const f = focusables(el)[0];
  if(f) setTimeout(() => { try{ f.focus(); }catch(e){} }, 60);
}
function closeModal(id){
  const el = document.getElementById(id);
  if(!el || el.hidden) return;
  el.hidden = true;
  delete el.dataset.open;
  const i = overlayStack.indexOf(id);
  if(i > -1) overlayStack.splice(i, 1);
  if(!overlayStack.length) document.body.style.overflow = "";
  if(el._prevFocus && el._prevFocus.isConnected){ try{ el._prevFocus.focus(); }catch(e){} }
  if(id === "trackModal" && state.trackTimer){ clearInterval(state.trackTimer); state.trackTimer = null; }
}
function closeTopOverlay(){
  if(!$("#lightbox").hidden){ closeLightbox(); return true; }
  if(!$("#offerPopup").hidden){ closeOffer(); return true; }
  if(!$("#mobileNav").hidden){ closeMobileNav(); return true; }
  const order = ["adminModal","trackModal","checkoutModal","productModal","cartDrawer"];
  const open = order.filter(id => { const e = document.getElementById(id); return e && !e.hidden; });
  if(open.length){ closeModal(open[open.length - 1]); return true; }
  return false;
}

/* =====================================================================
   12. CHECKOUT (6 steps)
   ===================================================================== */
const CHECKOUT_STEPS = [
  { n:1, label:"Your Cart" },
  { n:2, label:"Customer Details" },
  { n:3, label:"Delivery / Pickup" },
  { n:4, label:"Payment" },
  { n:5, label:"Review Order" },
  { n:6, label:"Order Confirmed" }
];

function openCheckout(){
  if(state.cart.length === 0){
    showToast("Your cart is empty", "Add at least one item before checkout.", "error");
    openCart();
    return;
  }
  closeCart();
  if(state.checkoutStep >= 6) state.checkoutStep = 1;
  openModal("checkoutModal");
  renderCheckout();
}

function renderCheckout(){
  const steps = $("#checkoutSteps");
  const body  = $("#checkoutBody");
  const foot  = $("#checkoutFoot");
  if(!steps || !body || !foot) return;

  const cur = state.checkoutStep;
  steps.innerHTML = CHECKOUT_STEPS.map(s => {
    const cls = s.n === cur ? "is-active" : (s.n < cur ? "is-done" : "");
    return `<li class="step ${cls}"${s.n === cur ? ' aria-current="step"' : ""}>
      <span class="step__n">${s.n < cur ? "✓" : s.n}</span>${escapeHtml(s.label)}
    </li>`;
  }).join("");

  body.innerHTML = checkoutStepBody(cur);
  foot.innerHTML = checkoutStepFoot(cur);

  const focusTarget = body.querySelector("h3, h2, input");
  if(focusTarget){ try{ focusTarget.focus({ preventScroll:true }); }catch(e){} }
  body.scrollTop = 0;
}

function checkoutStepBody(step){
  const c = state.customer;
  const t = calculateCart();

  if(step === 1){
    if(state.cart.length === 0){
      return `<div class="empty">
        <div class="empty__ico" aria-hidden="true">🛒</div>
        <p class="empty__title">Your cart is empty</p>
        <p class="empty__text">Add items from the menu to continue.</p>
        <button class="btn btn--primary" type="button" data-browse-menu>Browse Menu</button>
      </div>`;
    }
    return `
      <h3 class="co-title">Your Cart</h3>
      <p class="co-sub">Review your items before continuing. You can change quantities here.</p>
      <div class="ro-list">
        ${state.cart.map(l => `
          <div class="ro-item">
            <div class="ro-item__l">
              <span class="ro-item__name">${escapeHtml(l.name)} × ${l.qty}</span>
              ${l.options ? `<span class="ro-item__opts">${escapeHtml(l.options)}</span>` : ""}
              <div class="c-item__row" style="margin-top:6px">
                <div class="qty" role="group" aria-label="Quantity for ${escapeHtml(l.name)}">
                  <button class="qty__btn" type="button" data-qty="-1" data-line="${escapeHtml(l.key)}" aria-label="Decrease">−</button>
                  <input class="qty__value" type="text" value="${l.qty}" readonly aria-label="Quantity" />
                  <button class="qty__btn" type="button" data-qty="1" data-line="${escapeHtml(l.key)}" aria-label="Increase">+</button>
                </div>
                <button class="c-item__remove" type="button" data-remove="${escapeHtml(l.key)}">Remove</button>
              </div>
            </div>
            <span class="ro-item__r">${formatPrice(l.price * l.qty)}</span>
          </div>`).join("")}
      </div>
      ${checkoutTotals(t)}`;
  }

  if(step === 2){
    return `
      <h3 class="co-title">Customer Details</h3>
      <p class="co-sub">We need these details to confirm and deliver your order.</p>
      <div class="field-grid">
        <div class="field">
          <label for="coName">Full Name <span class="req">*</span></label>
          <input id="coName" type="text" data-field="name" value="${escapeHtml(c.name)}"
                 placeholder="e.g. Ahmed Raza" autocomplete="name" />
          <span class="field__err" data-err="name"></span>
        </div>
        <div class="field">
          <label for="coPhone">Phone Number <span class="req">*</span></label>
          <input id="coPhone" type="tel" data-field="phone" value="${escapeHtml(c.phone)}"
                 placeholder="03XX XXXXXXX" inputmode="tel" autocomplete="tel" />
          <span class="field__err" data-err="phone"></span>
          <span class="field__hint">Used only to contact you about this order.</span>
        </div>
        <div class="field field--full">
          <label for="coNotes">Order Notes <span style="color:var(--muted)">(optional)</span></label>
          <textarea id="coNotes" data-field="notes" placeholder="Less spicy, extra chutney, gate code…">${escapeHtml(c.notes)}</textarea>
        </div>
      </div>`;
  }

  if(step === 3){
    const isDelivery = state.orderType === "delivery";
    return `
      <h3 class="co-title">Delivery or Pickup</h3>
      <p class="co-sub">Choose how you would like to receive your order.</p>
      <div class="choice-grid" role="radiogroup" aria-label="Order type">
        <label class="choice">
          <input type="radio" name="orderType" value="delivery" data-choice="orderType" ${isDelivery ? "checked" : ""} />
          <span class="choice__mark" aria-hidden="true"></span>
          <span class="choice__ico" aria-hidden="true">🚚</span>
          <span class="choice__name">Delivery</span>
          <span class="choice__desc">Delivered to your address. ${formatPrice(DELIVERY_FEE)} fee${FREE_DELIVERY_OVER ? `, free over ${formatPrice(FREE_DELIVERY_OVER)}` : ""}.</span>
        </label>
        <label class="choice">
          <input type="radio" name="orderType" value="pickup" data-choice="orderType" ${!isDelivery ? "checked" : ""} />
          <span class="choice__mark" aria-hidden="true"></span>
          <span class="choice__ico" aria-hidden="true">🥡</span>
          <span class="choice__name">Pickup</span>
          <span class="choice__desc">Pickup from ${escapeHtml(RESTAURANT.name)}.</span>
        </label>
      </div>
      <span class="field__err" data-err="orderType" style="display:block"></span>

      ${isDelivery ? `
        <div class="field-grid" style="margin-top:20px">
          <div class="field field--full">
            <label for="coAddr">Delivery Address <span class="req">*</span></label>
            <input id="coAddr" type="text" data-field="address" value="${escapeHtml(c.address)}"
                   placeholder="House / street, landmard" autocomplete="street-address" />
            <span class="field__err" data-err="address"></span>
          </div>
          <div class="field">
            <label for="coCity">City <span class="req">*</span></label>
            <input id="coCity" type="text" data-field="city" value="${escapeHtml(c.city)}" placeholder="Gojra" autocomplete="address-level2" />
            <span class="field__err" data-err="city"></span>
          </div>
          <div class="field">
            <label for="coArea">Area / Sector <span style="color:var(--muted)">(optional)</span></label>
            <input id="coArea" type="text" data-field="area" value="${escapeHtml(c.area)}" placeholder="e.g. Main Bazaar" />
            <span class="field__err" data-err="area"></span>
          </div>
        </div>` : `
        <div class="notice" style="margin-top:20px">
          <span aria-hidden="true">📍</span>
          <div><strong>Pickup from ${escapeHtml(RESTAURANT.name)}</strong><br>
          ${escapeHtml(RESTAURANT.address)} · ${escapeHtml(RESTAURANT.openingHours)}</div>
        </div>`}`;
  }

  if(step === 4){
    const opts = [
      { v:"cod",    ico:"💵", name:"Cash on Delivery", desc:"Pay the rider when your order arrives." },
      { v:"venue",  ico:"🏪", name:"Pay at Restaurant", desc:"Pay in person at the counter (pickup or delivery)." },
      { v:"online", ico:"💳", name:"Online Payment (Demo)", desc:"Demo only — no real payment is processed." }
    ];
    return `
      <h3 class="co-title">Payment Method</h3>
      <p class="co-sub">Select how you would like to pay.</p>
      <div class="choice-grid" role="radiogroup" aria-label="Payment method">
        ${opts.map(o => `
          <label class="choice">
            <input type="radio" name="payment" value="${o.v}" data-choice="payment" ${state.payment === o.v ? "checked" : ""} />
            <span class="choice__mark" aria-hidden="true"></span>
            <span class="choice__ico" aria-hidden="true">${o.ico}</span>
            <span class="choice__name">${escapeHtml(o.name)}</span>
            <span class="choice__desc">${escapeHtml(o.desc)}</span>
          </label>`).join("")}
      </div>
      <div class="notice" style="margin-top:20px">
        <span aria-hidden="true">🔒</span>
        <div><strong>Frontend demo.</strong> No card details are collected and no payment gateway is connected.
        Payment methods shown here are for demonstration only.</div>
      </div>`;
  }

  if(step === 5){
    const cc = state.customer;
    return `
      <h3 class="co-title">Review Order</h3>
      <p class="co-sub">Please check everything below, then place your order.</p>

      <div class="confirm__grid" style="margin-bottom:20px">
        <div class="confirm__box"><dt>Customer</dt><dd>${escapeHtml(cc.name || "—")}</dd></div>
        <div class="confirm__box"><dt>Phone</dt><dd>${escapeHtml(cc.phone || "—")}</dd></div>
        <div class="confirm__box"><dt>Order Type</dt><dd>${state.orderType === "delivery" ? "Delivery" : "Pickup"}</dd></div>
        <div class="confirm__box"><dt>Payment</dt><dd>${escapeHtml(paymentLabel(state.payment))}</dd></div>
        ${state.orderType === "delivery" ? `
          <div class="confirm__box" style="grid-column:1/-1"><dt>Address</dt>
          <dd>${escapeHtml([cc.address, cc.area, cc.city].filter(Boolean).join(", ") || "—")}</dd></div>` : ""}
      </div>

      <div class="ro-list">
        ${state.cart.map(l => `
          <div class="ro-item">
            <div class="ro-item__l">
              <span class="ro-item__name">${escapeHtml(l.name)} × ${l.qty}</span>
              ${l.options ? `<span class="ro-item__opts">${escapeHtml(l.options)}</span>` : ""}
            </div>
            <span class="ro-item__r">${formatPrice(l.price * l.qty)}</span>
          </div>`).join("")}
      </div>
      ${checkoutTotals(t)}`;
  }

  // Step 6 — confirmation
  const o = state.orders.find(x => x.id === state.currentOrderId) || state.orders[0];
  if(!o) return `<div class="empty"><p class="empty__title">No recent order found.</p></div>`;
  return `
    <div class="confirm">
      <div class="confirm__ico" aria-hidden="true">🎉</div>
      <h3 class="confirm__title">Order Placed Successfully!</h3>
      <p class="confirm__text">Thank you for ordering from ${escapeHtml(RESTAURANT.name)}.</p>
      <div class="confirm__grid">
        <div class="confirm__box"><dt>Order Number</dt><dd class="accent">${escapeHtml(o.number)}</dd></div>
        <div class="confirm__box"><dt>Order Total</dt><dd class="accent">${formatPrice(o.totals.total)}</dd></div>
        <div class="confirm__box"><dt>Order Type</dt><dd>${o.orderType === "delivery" ? "Delivery" : "Pickup"}</dd></div>
        <div class="confirm__box"><dt>Payment</dt><dd>${escapeHtml(paymentLabel(o.payment))}</dd></div>
        <div class="confirm__box"><dt>Estimated Preparation</dt><dd>${ESTIMATED_PREP}</dd></div>
        <div class="confirm__box"><dt>Status</dt><dd>${escapeHtml(o.status)}</dd></div>
      </div>
      <div class="confirm__actions">
        <button class="btn btn--primary" type="button" data-conf="track">View Order</button>
        <button class="btn btn--outline" type="button" data-conf="print">Print Receipt</button>
        <button class="btn btn--ghost" type="button" data-conf="whatsapp">Order on WhatsApp</button>
        <button class="btn btn--ghost" type="button" data-conf="home">Back to Home</button>
      </div>
      <div class="track__disclaimer" style="text-align:left;margin-top:22px">
        This is a <strong>frontend demo</strong>. Your order is saved in this browser only —
        it is not sent to a real kitchen or server.
      </div>
    </div>`;
}

function checkoutTotals(t){
  return `
    <dl class="totals" style="margin-top:6px">
      <div><dt>Subtotal</dt><dd>${formatPrice(t.subtotal)}</dd></div>
      <div><dt>Delivery</dt><dd>${t.delivery === 0 ? (state.orderType === "pickup" ? "Pickup" : "Free") : formatPrice(t.delivery)}</dd></div>
      ${t.discount > 0 ? `<div class="totals__discount" style="display:flex"><dt>Discount</dt><dd>− ${formatPrice(t.discount)}</dd></div>` : ""}
      <div class="totals__grand"><dt>Total</dt><dd>${formatPrice(t.total)}</dd></div>
    </dl>
    <p class="totals__note">Taxes included.</p>`;
}

function checkoutStepFoot(step){
  if(step === 6){
    const curOrder = getOrder(state.currentOrderId) || state.orders[0];
    return `<span class="checkout__foot-note">Save your order number: <strong>${escapeHtml(curOrder ? curOrder.number : "")}</strong></span>
      <button class="btn btn--ghost" type="button" data-close-checkout>Close</button>`;
  }
  const back = step > 1
    ? `<button class="btn btn--ghost" type="button" data-co-back>← Back</button>`
    : `<button class="btn btn--ghost" type="button" data-close-checkout>← Continue Shopping</button>`;
  const next = step === 5
    ? `<button class="btn btn--primary btn--lg" type="button" data-co-place>PLACE ORDER</button>`
    : `<button class="btn btn--primary" type="button" data-co-next>Continue →</button>`;
  return `<span class="checkout__foot-note">Step ${step} of 5${step === 5 ? " · Ready to submit" : ""}</span>${back}${next}`;
}

/* --- collect + validate ---------------------------------------------- */
function collectStepInputs(){
  $$("#checkoutBody [data-field]").forEach(el => {
    state.customer[el.dataset.field] = (el.value || "").trim();
  });
  const ot = $('#checkoutBody [data-choice="orderType"]:checked');
  if(ot) state.orderType = ot.value;
  const pm = $('#checkoutBody [data-choice="payment"]:checked');
  if(pm) state.payment = pm.value;
  saveCheckout();
}
function setFieldError(name, msg){
  const err = $(`#checkoutBody [data-err="${name}"]`);
  if(err) err.textContent = msg || "";
  const input = $(`#checkoutBody [data-field="${name}"]`);
  if(input) input.classList.toggle("is-invalid", !!msg);
}
function clearFieldErrors(){
  $$("#checkoutBody .field__err").forEach(e => e.textContent = "");
  $$("#checkoutBody .is-invalid").forEach(e => e.classList.remove("is-invalid"));
}

function validateCheckout(step){
  collectStepInputs();
  clearFieldErrors();
  let ok = true;
  const deep = step >= 5;

  if(state.cart.length === 0){
    showToast("Your cart is empty", "Add at least one item before checkout.", "error");
    return false;
  }
  if(step >= 2 || deep){
    if(!state.customer.name.trim()){ setFieldError("name", "Please enter your name."); ok = false; }
    const digits = state.customer.phone.replace(/\D/g, "");
    if(digits.length < 10){ setFieldError("phone", "Please enter a valid phone number."); ok = false; }
  }
  if(step >= 3 || deep){
    if(state.orderType === "delivery"){
      if(!state.customer.address.trim()){ setFieldError("address", "Please enter your delivery address."); ok = false; }
      if(!state.customer.city.trim()){ setFieldError("city", "Please enter your city."); ok = false; }
    }
  }
  if(!ok){
    showToast("Please check the form", "Some required details are missing.", "error");
    const firstErr = $("#checkoutBody .is-invalid") || $("#checkoutBody .field__err:not(:empty)");
    if(firstErr){ try{ firstErr.focus({ preventScroll:false }); firstErr.scrollIntoView({ block:"center", behavior:"smooth" }); }catch(e){} }
  }
  return ok;
}

function checkoutNext(){
  collectStepInputs();
  if(!validateCheckout(state.checkoutStep)) return;
  state.checkoutStep = Math.min(5, state.checkoutStep + 1);
  renderCheckout();
}
function checkoutBack(){
  collectStepInputs();
  state.checkoutStep = Math.max(1, state.checkoutStep - 1);
  renderCheckout();
}

/* =====================================================================
   13. ORDERS — generate, save, confirm, track, receipt
   ===================================================================== */
function generateOrderNumber(){
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rnd = String(Math.floor(1000 + Math.random() * 9000));
  return `PJT-${date}-${rnd}`;
}

function saveOrder(order){
  state.orders.unshift(order);
  if(state.orders.length > 60) state.orders.length = 60;
  saveOrders();
  renderOrders();
}

function placeOrder(){
  if(!validateCheckout(5)) return;

  const t = calculateCart();
  const order = {
    id: "ord_" + Date.now() + "_" + Math.floor(Math.random() * 999),
    number: generateOrderNumber(),
    date: new Date().toISOString(),
    customer: Object.assign({}, state.customer),
    orderType: state.orderType,
    payment: state.payment,
    items: state.cart.map(l => ({
      key:l.key, id:l.id, name:l.name, price:l.price, qty:l.qty,
      options:l.options, image:l.image, type:l.type
    })),
    totals: { subtotal:t.subtotal, delivery:t.delivery, discount:t.discount, total:t.total },
    status: "Received",
    history: [{ status:"Received", time: Date.now() }]
  };

  saveOrder(order);
  state.currentOrderId = order.id;

  // Clear the cart after a successful order
  state.cart = [];
  saveCart();
  renderCart();
  clearPromo();

  state.checkoutStep = 6;
  showOrderConfirmation(order);
  showToast("✓ Order placed successfully!", `Order ${order.number}`, "success");
}

function showOrderConfirmation(order){
  state.currentOrderId = order ? order.id : state.currentOrderId;
  state.checkoutStep = 6;
  renderCheckout();
  const head = $("#checkoutBody .confirm__title");
  if(head){ try{ head.setAttribute("tabindex","-1"); head.focus({ preventScroll:true }); }catch(e){} }
}

function getOrder(id){
  return state.orders.find(o => o.id === id) || null;
}

/* --- Tracking --------------------------------------------------------- */
function trackStepsFor(order){
  const base = TRACK_STEPS.map(s => Object.assign({}, s));
  if(order && order.orderType === "pickup"){
    base[4] = { key:"Ready for Pickup", ico:"🥡", desc:"Your order is ready to collect from the counter." };
    base[5] = { key:"Picked Up",         ico:"🎉", desc:"Order collected. Enjoy your meal!" };
  }
  return base;
}
function trackProgress(order){
  if(!order) return 0;
  if(order.status === "Cancelled") return -1;
  const map = order.orderType === "pickup"
    ? { "Received":0, "Confirmed":1, "Preparing":2, "Ready":3, "Out for Delivery":3, "Delivered":5 }
    : { "Received":0, "Confirmed":1, "Preparing":2, "Ready":3, "Out for Delivery":4, "Delivered":5 };
  return map[order.status] != null ? map[order.status] : 0;
}

function openTracking(orderId){
  const order = getOrder(orderId) || state.orders[0];
  if(!order){
    showToast("No order to track", "Place an order first.", "info");
    return;
  }
  state.currentOrderId = order.id;
  renderTracking(order);
  openModal("trackModal");

  if(state.trackTimer) clearInterval(state.trackTimer);
  state.trackTimer = setInterval(() => {
    const o = getOrder(state.currentOrderId);
    if(!o || o.status === "Delivered" || o.status === "Cancelled"){
      clearInterval(state.trackTimer); state.trackTimer = null; return;
    }
    advanceOrderStatus(o.id, true);
  }, 9000);
}

function renderTracking(order){
  const wrap = $("#trackContent");
  if(!wrap) return;
  const steps = trackStepsFor(order);
  const idx = trackProgress(order);
  const cancelled = order.status === "Cancelled";
  const pct = cancelled ? 0 : Math.round((idx / (steps.length - 1)) * 100);
  const d = new Date(order.date);

  wrap.innerHTML = `
    <div class="track__head">
      <p class="track__order">Order <strong>${escapeHtml(order.number)}</strong></p>
      <p class="track__sub">${d.toLocaleString()} · ${order.orderType === "delivery" ? "Delivery" : "Pickup"} · ${formatPrice(order.totals.total)}</p>
      <div class="progress-bar" aria-hidden="true"><div class="progress-bar__fill" style="width:${pct}%"></div></div>
    </div>

    ${cancelled ? `<div class="notice" style="margin-bottom:18px"><span aria-hidden="true">⛔</span>
      <div><strong>This order was cancelled.</strong><br>Start again from the menu to place a new order.</div></div>` : ""}

    <ol class="timeline">
      ${steps.map((s, i) => {
        const done = !cancelled && i < idx;
        const current = !cancelled && i === idx;
        const cls = done ? "done" : current ? "current" : "";
        const ico = done ? "✓" : current ? "●" : s.ico;
        return `<li class="tl-item ${cls}">
          <span class="tl-item__dot" aria-hidden="true">${ico}</span>
          <div class="tl-item__body">
            <p class="tl-item__title">${escapeHtml(s.key)}${current ? " — in progress" : ""}</p>
            <p class="tl-item__desc">${escapeHtml(s.desc)}</p>
          </div>
        </li>`;
      }).join("")}
    </ol>

    <p class="live-status" id="liveStatusNote" role="status" aria-live="polite">
      Next demo update in <b>—</b> — status: <strong>${escapeHtml(order.status)}</strong>
    </p>

    <p class="track__disclaimer">
      <strong>Demo tracking only.</strong> This timeline advances in real time inside your browser to
      demonstrate how live order tracking would look. It is <em>not</em> connected to a real kitchen,
      POS or server. Current demo status: <strong>${escapeHtml(order.status)}</strong>.
    </p>

    <div class="track__actions">
      <button class="btn btn--primary btn--sm" type="button" data-track-advance>Advance demo status</button>
      <button class="btn btn--ghost btn--sm" type="button" data-track-reset>Reset to Received</button>
      <button class="btn btn--ghost btn--sm" type="button" data-track-print>Print Receipt</button>
      <button class="btn btn--ghost btn--sm" type="button" data-track-whatsapp>WhatsApp</button>
      <button class="btn btn--ghost btn--sm" type="button" data-close-track>Close</button>
    </div>`;
}

function updateOrderStatus(orderId, status){
  const order = getOrder(orderId);
  if(!order || !ORDER_STATUSES.includes(status)) return false;
  order.status = status;
  order.updatedAt = Date.now();
  order.history = order.history || [];
  order.history.push({ status, time: Date.now() });
  saveOrders();
  if(!$("#trackModal").hidden && state.currentOrderId === orderId) renderTracking(order);
  return true;
}

/* ---------------------------------------------------------------------
   LIVE AUTO-ADVANCE (real-time feel)
   The timeline now progresses on its own using real elapsed time, so the
   status changes while you watch instead of only on manual clicks.
   Set LIVE_AUTO_ADVANCE = false for the original click-only demo.
   ------------------------------------------------------------------- */
const LIVE_AUTO_ADVANCE = true;
const LIVE_TICK_MS = 1000;

function liveFlowFor(order){
  return order.orderType === "pickup"
    ? ["Received","Confirmed","Preparing","Ready","Delivered"]
    : ["Received","Confirmed","Preparing","Ready","Out for Delivery","Delivered"];
}

/* Time between automatic status changes, per step (ms). */
function liveStepDelay(prevStatus){
  switch(prevStatus){
    case "Received":  return 12000;
    case "Confirmed": return 15000;
    case "Preparing": return 18000;
    case "Ready":     return 12000;
    default:          return 15000;
  }
}

/* Advance anything whose deadline has passed. Called every second. */
function liveSweepOrders(){
  const now = Date.now();
  let changed = false;

  state.orders.forEach((order) => {
    if(!LIVE_AUTO_ADVANCE) return;
    if(order.status === "Delivered" || order.status === "Cancelled") return;

    order.nextAutoAt = order.nextAutoAt || now + liveStepDelay(order.status);
    if(now < order.nextAutoAt) return;

    const flow = liveFlowFor(order);
    const i = flow.indexOf(order.status);
    if(i === -1 || i >= flow.length - 1){ order.nextAutoAt = null; return; }

    order.status = flow[i + 1];
    order.updatedAt = now;
    order.autoAdvanced = true;
    order.history = order.history || [];
    order.history.push({ status: order.status, time: now, auto: true });
    order.nextAutoAt = flow.indexOf(order.status) >= flow.length - 1
      ? null
      : now + liveStepDelay(order.status);
    changed = true;
  });

  if(!changed) return;

  saveOrders();
  const active = state.currentOrderId;
  if(active && !$("#trackModal").hidden) renderTracking(getOrder(active));
  renderOrders();
}

/* Keep the tracking modal's own countdown label fresh every second. */
function liveTickTracking(){
  const el = $("#liveStatusNote");
  if(!el || $("#trackModal").hidden) return;
  const order = getOrder(state.currentOrderId);
  if(!order) return;

  if(order.status === "Delivered"){ el.textContent = "Delivered. Enjoy your meal!"; return; }
  if(order.status === "Cancelled"){ el.textContent = "This order was cancelled."; return; }

  const remain = Math.max(0, Math.ceil(((order.nextAutoAt || Date.now()) - Date.now()) / 1000));
  el.innerHTML = `Next demo update in <b>${remain}s</b> — status: <b>${escapeHtml(order.status)}</b>`;
}

/* Single ticker drives everything real-time on the page. */
function startLiveClock(){
  if(state.liveTimer) return;

  const tick = () => {
    const now = new Date();

    // footer clock
    const clock = $("#liveClock");
    if(clock){
      clock.textContent = now.toLocaleTimeString([], {
        hour:"2-digit", minute:"2-digit", second:"2-digit"
      });
    }

    // open / closed status from opening hours
    const dot = $("#openStatus");
    const label = $("#openStatusText");
    if(dot && label){
      const hours = openingHoursState(now);
      dot.dataset.open = hours.open ? "true" : "false";
      label.textContent = hours.open
        ? `Open now · closes ${hours.closeLabel}`
        : `Closed · opens ${hours.openLabel}`;
    }

    // hero live pill
    const heroPill = $("#heroLive");
    const heroText = $("#heroLiveText");
    if(heroPill && heroText){
      const hours = openingHoursState(now);
      heroPill.dataset.open = hours.open ? "true" : "false";
      heroText.textContent = hours.open
        ? `Open now · closes ${hours.closeLabel}`
        : `Closed · opens ${hours.openLabel}`;
    }

    liveSweepOrders();
    liveTickTracking();
  };

  tick();
  state.liveTimer = setInterval(tick, LIVE_TICK_MS);
}

/* ---------------------------------------------------------------------
   Opening-hours parsing. Format: "12:00 PM - 11:00 PM"
   Falls back to "always open" if the string cannot be parsed.
   ------------------------------------------------------------------- */
function parseOpeningHours(str){
  const fallback = { open:true, openM:0, closeM:1440 };
  if(!str || typeof str !== "string") return fallback;

  const m = str.match(/(\d{1,2})\s*(am|pm)?\s*-\s*(\d{1,2})\s*(am|pm)?/i);
  if(!m) return fallback;

  let h1 = parseInt(m[1], 10);
  const ap1 = (m[2] || "").toLowerCase();
  let h2 = parseInt(m[3], 10);
  const ap2 = (m[4] || "").toLowerCase();

  const to24 = (h, ap, isEnd) => {
    if(ap === "pm" && h < 12) h += 12;
    if(ap === "am" && h === 12) h = 0;
    if(!ap && !isEnd && h <= 7) h += 12; // "12 - 11" style
    return h;
  };

  h1 = to24(h1, ap1, false);
  h2 = to24(h2, ap2, true);

  let closeM = h2 * 60;
  if(closeM <= h1 * 60) closeM += 1440; // overnight closing

  return { open:true, openM:h1 * 60, closeM };
}

function formatMinutes(mins){
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const mm = String(mins % 60).padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm} ${ap}`;
}

function openingHoursState(date){
  const raw = (typeof RESTAURANT !== "undefined" && RESTAURANT.openingHours) || "";
  const { openM, closeM } = parseOpeningHours(raw);
  const nowM = date.getHours() * 60 + date.getMinutes();

  return {
    open: nowM >= openM && nowM < closeM,
    openLabel: formatMinutes(openM),
    closeLabel: formatMinutes(closeM)
  };
}

function advanceOrderStatus(orderId, silent){
  const order = getOrder(orderId);
  if(!order) return;
  const flow = ["Received","Confirmed","Preparing","Ready","Out for Delivery","Delivered"];
  if(order.orderType === "pickup"){
    const pickupFlow = ["Received","Confirmed","Preparing","Ready","Delivered"];
    const i = pickupFlow.indexOf(order.status);
    if(i === -1 || i >= pickupFlow.length - 1) return;
    updateOrderStatus(orderId, pickupFlow[i + 1]);
  }else{
    const i = flow.indexOf(order.status);
    if(i === -1 || i >= flow.length - 1) return;
    updateOrderStatus(orderId, flow[i + 1]);
  }
  if(!silent){
    const o = getOrder(orderId);
    showToast("Demo status updated", o ? o.status : "", "info");
  }
}

/* --- Demo admin dashboard --------------------------------------------- */
function renderOrders(){
  const tbody = $("#adminOrdersBody");
  const empty = $("#adminEmpty");
  const stats = $("#adminStats");
  if(!tbody) return;

  const list = state.orders;
  if(empty) empty.hidden = list.length > 0;

  if(stats){
    const revenue = list.reduce((s, o) => s + (o.totals ? o.totals.total : 0), 0);
    const active  = list.filter(o => !["Delivered","Cancelled"].includes(o.status)).length;
    const done    = list.filter(o => o.status === "Delivered").length;
    stats.innerHTML = `
      <div class="admin-stat"><b>${list.length}</b><span>Orders</span></div>
      <div class="admin-stat"><b>${active}</b><span>In Progress</span></div>
      <div class="admin-stat"><b>${done}</b><span>Delivered</span></div>
      <div class="admin-stat"><b>${formatPrice(revenue)}</b><span>Demo Revenue</span></div>`;
  }

  tbody.innerHTML = list.map(o => {
    const itemText = (o.items || []).map(i => `${i.name} ×${i.qty}`).join(", ");
    const d = new Date(o.date);
    const statusColor =
      o.status === "Cancelled" ? "style=\"color:#ff5252\"" :
      o.status === "Delivered" ? "style=\"color:#4CAF50\"" : "";
    return `<tr>
      <td><button class="ord-no" type="button" data-track-order="${o.id}" title="Open tracking">${escapeHtml(o.number)}</button></td>
      <td>${escapeHtml((o.customer || {}).name || "—")}</td>
      <td>${escapeHtml((o.customer || {}).phone || "—")}</td>
      <td class="ord-items">${escapeHtml(itemText)}</td>
      <td class="ord-total">${formatPrice(o.totals.total)}</td>
      <td><span class="tag tag--${o.orderType === "delivery" ? "delivery" : "pickup"}">${o.orderType === "delivery" ? "Delivery" : "Pickup"}</span></td>
      <td>
        <select class="status-select" data-status-for="${o.id}" aria-label="Status for order ${escapeHtml(o.number)}" ${statusColor}>
          ${ORDER_STATUSES.map(s => `<option value="${s}" ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </td>
      <td>${d.toLocaleDateString()}<br><small>${d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}</small></td>
    </tr>`;
  }).join("");
}

/* =====================================================================
   14. RECEIPT (print)
   ===================================================================== */
function buildReceipt(order){
  if(!order) return "";
  const c = order.customer || {};
  const d = new Date(order.date);
  const addr = order.orderType === "delivery"
    ? [c.address, c.area, c.city].filter(Boolean).join(", ")
    : `Pickup from ${RESTAURANT.name}`;

  return `
    <div class="r-brand">
      <img src="assets/logo.png" alt="" width="70" height="70" style="margin:0 auto 8px;border-radius:50%;border:2px solid #F4511E" data-logo />
      <h1>${escapeHtml(RESTAURANT.name.toUpperCase())}</h1>
      <p>Authentic BBQ &amp; Desi Taste · ${escapeHtml(RESTAURANT.address)}</p>
      <p>${escapeHtml(RESTAURANT.openingHours)}</p>
    </div>

    <div class="r-meta"><span>Order Number</span><strong>${escapeHtml(order.number)}</strong></div>
    <div class="r-meta"><span>Date</span><span>${d.toLocaleString()}</span></div>
    <div class="r-meta"><span>Customer</span><span>${escapeHtml(c.name || "-")}</span></div>
    <div class="r-meta"><span>Phone</span><span>${escapeHtml(c.phone || "-")}</span></div>
    <div class="r-meta"><span>Order Type</span><span>${order.orderType === "delivery" ? "Delivery" : "Pickup"}</span></div>
    <div class="r-meta"><span>Address</span><span>${escapeHtml(addr)}</span></div>

    <div class="r-line"></div>

    <table>
      <thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th></tr></thead>
      <tbody>
        ${order.items.map(i => `
          <tr>
            <td>${escapeHtml(i.name)}${i.options ? `<br><small>${escapeHtml(i.options)}</small>` : ""}</td>
            <td style="text-align:center">${i.qty}</td>
            <td style="text-align:right">${formatPrice(i.price * i.qty)}</td>
          </tr>`).join("")}
      </tbody>
    </table>

    <div class="r-line"></div>

    <div class="r-meta"><span>Subtotal</span><span>${formatPrice(order.totals.subtotal)}</span></div>
    <div class="r-meta"><span>Delivery</span><span>${formatPrice(order.totals.delivery)}</span></div>
    <div class="r-meta"><span>Discount</span><span>${order.totals.discount > 0 ? "-" : ""}${formatPrice(order.totals.discount)}</span></div>
    <table class="r-total">
      <tbody><tr class="r-total"><td>TOTAL</td><td style="text-align:right">${formatPrice(order.totals.total)}</td></tr></tbody>
    </table>

    <div class="r-meta" style="margin-top:10px"><span>Payment Method</span><span>${escapeHtml(paymentLabel(order.payment))}</span></div>
    <div class="r-meta"><span>Status</span><span>${escapeHtml(order.status)}</span></div>

    <p class="r-thanks">THANK YOU FOR ORDERING WITH US!</p>
    <p class="r-disc">Frontend demo receipt · No real payment processed</p>`;
}

function printReceipt(orderId){
  const order = getOrder(orderId) || getOrder(state.currentOrderId) || state.orders[0];
  if(!order){
    showToast("Nothing to print", "No order found.", "error");
    return;
  }
  const box = $("#receipt");
  if(!box) return;
  box.innerHTML = buildReceipt(order);
  showToast("Preparing receipt", "Choose “Save as PDF” or a printer.", "info");
  setTimeout(() => { try{ window.print(); }catch(e){ showToast("Print unavailable", "Use your browser’s print command.", "error"); } }, 260);
}

/* =====================================================================
   15. GALLERY LIGHTBOX
   ===================================================================== */
function openLightbox(i){
  if(!state.lightboxItems.length) return;
  state.lightboxIndex = ((Number(i) || 0) % state.lightboxItems.length + state.lightboxItems.length) % state.lightboxItems.length;
  paintLightbox();
  const lb = $("#lightbox");
  if(lb && lb.hidden) openModal("lightbox");
}
function paintLightbox(){
  const item = state.lightboxItems[state.lightboxIndex];
  if(!item) return;
  const img = $("#lightboxImage");
  if(img){ img.src = item.src; img.alt = item.cap; delete img.dataset.fallbackApplied; }
  const cap = $("#lightboxCaption");
  if(cap) cap.innerHTML = `${escapeHtml(item.cap)}<span>${escapeHtml(item.cat)} · ${state.lightboxIndex + 1} / ${state.lightboxItems.length}</span>`;
}
function lightboxStep(dir){
  const n = state.lightboxItems.length;
  if(!n) return;
  state.lightboxIndex = ((state.lightboxIndex + dir) % n + n) % n;
  paintLightbox();
}
function closeLightbox(){ closeModal("lightbox"); }

/* =====================================================================
   16. THEME
   ===================================================================== */
function setTheme(theme){
  const t = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  storeSet(STORE.theme, t);
  const btn = $("#themeToggle");
  if(btn){
    const icon = btn.querySelector(".theme-toggle__icon");
    if(icon) icon.textContent = t === "dark" ? "🌙" : "☀️";
    btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    btn.setAttribute("aria-pressed", String(t === "light"));
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute("content", t === "dark" ? "#0B0B0B" : "#FAF7F5");
}
function toggleTheme(){
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "light" ? "dark" : "light";
  setTheme(next);
  showToast(next === "dark" ? "Dark theme" : "Light theme", "Theme preference saved on this device.", "info");
}

/* =====================================================================
   17. SPECIAL OFFER POPUP
   ===================================================================== */
function maybeShowOffer(){
  try{
    const today = new Date().toDateString();
    if(localStorage.getItem(STORE.offer) === today) return;
  }catch(e){}
  showOffer();
}
function showOffer(){
  const el = $("#offerPopup");
  if(el && el.hidden) openModal("offerPopup");
}
function closeOffer(){
  closeModal("offerPopup");
  try{ localStorage.setItem(STORE.offer, new Date().toDateString()); }catch(e){}
}

/* =====================================================================
   18. MISC UI — header, reveal, counters, nav, search
   ===================================================================== */
function initHeader(){
  const header = $("#header");
  const toTop  = $("#toTopBtn");
  const onScroll = () => {
    const y = window.scrollY || 0;
    if(header) header.classList.toggle("is-stuck", y > 8);
    if(toTop)  toTop.hidden = y < 520;
  };
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();
}

function initReveal(){
  const els = $$("[data-reveal]");
  if(!("IntersectionObserver" in window) || !els.length){
    els.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(el => io.observe(el));
}

function initCounters(){
  const stats = $("#heroStats");
  if(!stats) return;
  const values = { items: products.length, categories: CATEGORIES.length, deals: deals.length };
  $$("[data-stat]", stats).forEach(el => {
    const to = values[el.dataset.stat];
    if(typeof to === "number") el.dataset.countTo = String(to);
  });
  animateCounters(stats);
}
function animateCounters(root){
  $$("[data-count-to]", root).forEach(el => {
    const target = Number(el.dataset.countTo) || 0;
    if(target <= 0){ el.textContent = String(target); return; }
    const dur = 1100;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if(p < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    };
    requestAnimationFrame(tick);
  });
}

function initActiveNav(){
  const links = $$(".nav__link");
  if(!links.length || !("IntersectionObserver" in window)) return;
  const map = {};
  links.forEach(a => { const id = a.getAttribute("href").slice(1); if(id) map[id] = a; });
  const sections = Object.keys(map).map(id => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        links.forEach(a => a.classList.remove("is-active"));
        const a = map[en.target.id];
        if(a) a.classList.add("is-active");
      }
    });
  }, { threshold: 0.3, rootMargin: "-80px 0px -55% 0px" });
  sections.forEach(s => io.observe(s));
}

/* --- Search panel ------------------------------------------------------ */
function toggleSearch(force){
  const panel = $("#searchPanel");
  const btn   = $("#searchToggle");
  if(!panel || !btn) return;
  const open = typeof force === "boolean" ? force : panel.hidden;
  panel.hidden = !open;
  btn.setAttribute("aria-expanded", String(open));
  if(open){
    const input = $("#globalSearch");
    if(input) setTimeout(() => input.focus(), 60);
  }
}
function scrollToMenu(){
  const el = $("#menu");
  if(!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 92;
  window.scrollTo({ top: y, behavior: "smooth" });
}

/* --- Mobile nav -------------------------------------------------------- */
function openMobileNav(){
  const el = $("#mobileNav");
  const b  = $("#burgerBtn");
  if(!el) return;
  el.hidden = false;
  if(b){ b.classList.add("is-open"); b.setAttribute("aria-expanded","true"); }
  document.body.style.overflow = "hidden";
  if(!overlayStack.includes("mobileNav")) overlayStack.push("mobileNav");
}
function closeMobileNav(){
  const el = $("#mobileNav");
  const b  = $("#burgerBtn");
  if(!el || el.hidden) return;
  el.hidden = true;
  if(b){ b.classList.remove("is-open"); b.setAttribute("aria-expanded","false"); }
  const i = overlayStack.indexOf("mobileNav");
  if(i > -1) overlayStack.splice(i, 1);
  if(!overlayStack.length) document.body.style.overflow = "";
}

/* =====================================================================
   19. EVENT WIRING
   ===================================================================== */
function initEvents(){

  /* ---- global click delegation ---- */
  document.addEventListener("click", (e) => {
    const t = e.target;

    // close handlers
    if(t.closest("[data-close-modal]"))   { closeModal("productModal"); return; }
    if(t.closest("[data-close-cart]"))    { closeCart(); return; }
    if(t.closest("[data-close-checkout]")){ closeModal("checkoutModal"); return; }
    if(t.closest("[data-close-track]"))   { closeModal("trackModal"); return; }
    if(t.closest("[data-close-admin]"))   { closeModal("adminModal"); return; }
    if(t.closest("[data-close-offer]"))   { closeOffer(); return; }
    if(t.closest("[data-close-mobile-nav]")){ closeMobileNav(); }

    // category filtering (chips + category cards)
    const catBtn = t.closest("[data-category]");
    if(catBtn){
      state.activeCategory = catBtn.dataset.category;
      state.searchQuery = "";
      const mi = $("#menuSearch"); if(mi) mi.value = "";
      const gi = $("#globalSearch"); if(gi) gi.value = "";
      renderCategories(); renderMenuChips(); renderMenu();
      const counts = $("#searchResultCount");
      if(counts) counts.textContent = "Type to search the full menu";
      if(catBtn.classList.contains("cat-card")) scrollToMenu();
      return;
    }

    // gallery category
    const gCat = t.closest("[data-gallery-cat]");
    if(gCat){
      state.galleryFilter = gCat.dataset.galleryCat;
      renderGalleryChips(); renderGallery();
      return;
    }

    // open product
    const openP = t.closest("[data-open-product]");
    if(openP){ openProductModal(openP.dataset.openProduct); return; }

    // quick add from card
    const quick = t.closest("[data-quick-add]");
    if(quick){ addToCart(Number(quick.dataset.quickAdd), { qty: 1 }); return; }

    // add deal
    const dealBtn = t.closest("[data-add-deal]");
    if(dealBtn){ addToCart(dealBtn.dataset.addDeal, { qty: 1 }); return; }

    // cart qty / remove
    const qtyBtn = t.closest("[data-qty]");
    if(qtyBtn){ updateQuantity(qtyBtn.dataset.line, Number(qtyBtn.dataset.qty)); return; }

    const rm = t.closest("[data-remove]");
    if(rm){ removeFromCart(rm.dataset.remove); return; }

    // browse menu from empty cart
    if(t.closest("[data-browse-menu]")){
      closeCart(); closeModal("checkoutModal");
      scrollToMenu();
      return;
    }

    // gallery item → lightbox
    const gItem = t.closest("[data-gallery-index]");
    if(gItem){ openLightbox(Number(gItem.dataset.galleryIndex)); return; }

    // review dots
    const dot = t.closest("[data-review-dot]");
    if(dot){ goReview(Number(dot.dataset.reviewDot)); restartReviewTimer(); return; }

    // checkout navigation
    if(t.closest("[data-co-next]"))   { checkoutNext(); return; }
    if(t.closest("[data-co-back]"))   { checkoutBack(); return; }
    if(t.closest("[data-co-place]"))  { placeOrder(); return; }

    // confirmation actions
    const conf = t.closest("[data-conf]");
    if(conf){
      const kind = conf.dataset.conf;
      if(kind === "track")     openTracking(state.currentOrderId);
      if(kind === "print")     printReceipt(state.currentOrderId);
      if(kind === "whatsapp")  sendWhatsAppOrder(getOrder(state.currentOrderId));
      if(kind === "home"){
        closeModal("checkoutModal");
        state.checkoutStep = 1;
        window.scrollTo({ top:0, behavior:"smooth" });
      }
      return;
    }

    // tracking actions
    if(t.closest("[data-track-advance]")){
      advanceOrderStatus(state.currentOrderId);
      return;
    }
    if(t.closest("[data-track-reset]")){
      updateOrderStatus(state.currentOrderId, "Received");
      showToast("Demo status reset", "Order set back to Received.", "info");
      return;
    }
    if(t.closest("[data-track-print]"))    { printReceipt(state.currentOrderId); return; }
    if(t.closest("[data-track-whatsapp]")) { sendWhatsAppOrder(getOrder(state.currentOrderId)); return; }

    // admin → tracking
    const trackBtn = t.closest("[data-track-order]");
    if(trackBtn){ openTracking(trackBtn.dataset.trackOrder); return; }

    // "Order Now" anchors
    if(t.closest('[data-action="order-now"]')){ closeMobileNav(); return; }

    // search chips
    const sChip = t.closest("[data-search-term]");
    if(sChip){
      searchProducts(sChip.dataset.searchTerm);
      scrollToMenu();
      return;
    }
  });

  /* ---- header ---- */
  const burger = $("#burgerBtn");
  if(burger) burger.addEventListener("click", () => {
    const nav = $("#mobileNav");
    if(nav && nav.hidden) openMobileNav(); else closeMobileNav();
  });
  $$("#mobileNav a").forEach(a => a.addEventListener("click", closeMobileNav));

  const searchToggle = $("#searchToggle");
  if(searchToggle) searchToggle.addEventListener("click", () => toggleSearch());

  const searchClear = $("#searchClear");
  if(searchClear) searchClear.addEventListener("click", () => {
    searchProducts("");
    const gi = $("#globalSearch"); if(gi) gi.value = "";
    toggleSearch(true);
  });

  const headerCart = $("#headerCartBtn");
  if(headerCart) headerCart.addEventListener("click", openCart);

  const themeBtn = $("#themeToggle");
  if(themeBtn) themeBtn.addEventListener("click", toggleTheme);

  const toTop = $("#toTopBtn");
  if(toTop) toTop.addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));

  /* ---- search inputs ---- */
  const globalSearch = $("#globalSearch");
  if(globalSearch) globalSearch.addEventListener("input", (e) => {
    searchProducts(e.target.value);
    if(e.target.value.trim() && window.scrollY < 200) scrollToMenu();
  });
  const menuSearch = $("#menuSearch");
  if(menuSearch) menuSearch.addEventListener("input", (e) => searchProducts(e.target.value));

  const menuSearchClear = $("#menuSearchClear");
  if(menuSearchClear) menuSearchClear.addEventListener("click", () => { searchProducts(""); const m=$("#menuSearch"); if(m) m.value=""; });

  const resetBtn = $("#resetFiltersBtn");
  if(resetBtn) resetBtn.addEventListener("click", () => {
    state.activeCategory = "All";
    state.searchQuery = "";
    state.sort = "popular";
    const s = $("#sortSelect"); if(s) s.value = "popular";
    const m = $("#menuSearch"); if(m) m.value = "";
    const g = $("#globalSearch"); if(g) g.value = "";
    renderCategories(); renderMenuChips(); renderMenu();
    showToast("Filters reset", "Showing the full menu.", "info");
  });

  const sortSelect = $("#sortSelect");
  if(sortSelect) sortSelect.addEventListener("change", (e) => { state.sort = e.target.value; renderMenu(); });

  /* ---- product modal ---- */
  const pmMinus = $("#pmQtyMinus"); if(pmMinus) pmMinus.addEventListener("click", () => pmChangeQty(-1));
  const pmPlus  = $("#pmQtyPlus");  if(pmPlus)  pmPlus.addEventListener("click", () => pmChangeQty(1));
  const pmAdd   = $("#pmAddToCart");if(pmAdd)   pmAdd.addEventListener("click", () => pmAddToCart(false));
  const pmOrder = $("#pmOrderNow"); if(pmOrder) pmOrder.addEventListener("click", () => pmAddToCart(true));

  const pmSpice = $("#pmSpice");
  if(pmSpice) pmSpice.addEventListener("change", updateProductModalTotal);
  const pmExtras = $("#pmExtras");
  if(pmExtras) pmExtras.addEventListener("change", updateProductModalTotal);

  // favourite toggle
  const pmFav = $("#pmFavBtn");
  if(pmFav) pmFav.addEventListener("click", () => {
    if(!state.currentProduct) return;
    toggleFavorite(state.currentProduct.id);
    renderFavButton();
  });

  // special instructions: live counter + keep total in sync
  const pmNotes = $("#pmNotes");
  if(pmNotes){
    pmNotes.addEventListener("input", () => {
      setText("#pmNotesCount", String(pmNotes.value.length));
    });
    pmNotes.addEventListener("change", updateProductModalTotal);
    pmNotes.addEventListener("blur", updateProductModalTotal);
  }

  /* ---- cart ---- */
  const checkoutBtn = $("#checkoutBtn");
  if(checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);
  const waCart = $("#whatsappCartBtn");
  if(waCart) waCart.addEventListener("click", () => sendWhatsAppOrder(null));
  const promoApply = $("#promoApply");
  if(promoApply) promoApply.addEventListener("click", applyPromo);
  const promoInput = $("#promoInput");
  if(promoInput) promoInput.addEventListener("keydown", (e) => { if(e.key === "Enter"){ e.preventDefault(); applyPromo(); } });
  const clearPromoBtn = $("#clearPromo");
  if(clearPromoBtn) clearPromoBtn.addEventListener("click", clearPromo);
  const stickyCart = $("#stickyCartBtn");
  if(stickyCart) stickyCart.addEventListener("click", openCart);

  /* ---- reviews ---- */
  const rPrev = $("#reviewPrev"); if(rPrev) rPrev.addEventListener("click", () => { goReview(state.reviewIndex - 1); restartReviewTimer(); });
  const rNext = $("#reviewNext"); if(rNext) rNext.addEventListener("click", () => { goReview(state.reviewIndex + 1); restartReviewTimer(); });
  const rView = $("#reviewViewport");
  if(rView){
    rView.addEventListener("mouseenter", stopReviewTimer);
    rView.addEventListener("mouseleave", startReviewTimer);
    rView.addEventListener("focusin", stopReviewTimer);
    rView.addEventListener("focusout", startReviewTimer);
  }

  /* ---- lightbox ---- */
  const lbClose = $("#lightboxClose"); if(lbClose) lbClose.addEventListener("click", closeLightbox);
  const lbPrev  = $("#lightboxPrev");  if(lbPrev)  lbPrev.addEventListener("click", () => lightboxStep(-1));
  const lbNext  = $("#lightboxNext");  if(lbNext)  lbNext.addEventListener("click", () => lightboxStep(1));
  const lb = $("#lightbox");
  if(lb) lb.addEventListener("click", (e) => { if(e.target === lb) closeLightbox(); });

  /* ---- offer popup ---- */
  const oClose = $("#offerClose"); if(oClose) oClose.addEventListener("click", closeOffer);
  const oDismiss = $("#offerDismiss"); if(oDismiss) oDismiss.addEventListener("click", closeOffer);
  const oOrder = $("#offerOrderBtn");
  if(oOrder) oOrder.addEventListener("click", () => { closeOffer(); addToCart("deal-1", { qty:1 }); openCheckout(); });

  /* ---- admin ---- */
  const clearOrders = $("#clearOrdersBtn");
  if(clearOrders) clearOrders.addEventListener("click", () => {
    if(!state.orders.length){ showToast("No demo orders", "Nothing to clear.", "info"); return; }
    if(!window.confirm("Delete all demo orders stored in this browser? This cannot be undone.")) return;
    state.orders = [];
    saveOrders();
    renderOrders();
    showToast("Demo orders cleared", "All local order history removed.", "info");
  });
  const adminBody = $("#adminOrdersBody");
  if(adminBody) adminBody.addEventListener("change", (e) => {
    const sel = e.target.closest("[data-status-for]");
    if(!sel) return;
    const ok = updateOrderStatus(sel.dataset.statusFor, sel.value);
    if(ok) showToast("Status updated", `→ ${sel.value}`, "info");
    else   showToast("Invalid status", "", "error");
  });

  const mobileOrders = $("#mobileOrdersBtn");
  if(mobileOrders) mobileOrders.addEventListener("click", () => { closeMobileNav(); openAdmin(); });
  const footMy = $("#footerMyOrders");
  if(footMy) footMy.addEventListener("click", (e) => { e.preventDefault(); openAdmin(); });
  const footDemo = $("#footerDemoOrders");
  if(footDemo) footDemo.addEventListener("click", (e) => { e.preventDefault(); openAdmin(); });
  const footOrder = $("#footerOrderBtn");
  if(footOrder) footOrder.addEventListener("click", () => scrollToMenu());

  /* ---- announcement ---- */
  const annClose = $("#announcementClose");
  if(annClose) annClose.addEventListener("click", () => {
    const bar = $("#announcementBar");
    if(bar) bar.style.display = "none";
    try{ localStorage.setItem(STORE.announce, "1"); }catch(e){}
  });

  /* ---- map ---- */
  const loadMap = $("#loadMapBtn");
  if(loadMap) loadMap.addEventListener("click", () => {
    const frame = $("#mapFrame");
    const ph = $("#mapPlaceholder");
    if(frame){
      frame.src = `https://www.google.com/maps?q=${encodeURIComponent(RESTAURANT.name + " " + RESTAURANT.address)}&output=embed`;
    }
    if(ph) ph.hidden = true;
  });

  /* ---- keyboard ---- */
  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const lbOpen = !$("#lightbox").hidden;

    if(lbOpen){
      if(e.key === "Escape"){ e.preventDefault(); closeLightbox(); return; }
      if(e.key === "ArrowLeft"){ e.preventDefault(); lightboxStep(-1); return; }
      if(e.key === "ArrowRight"){ e.preventDefault(); lightboxStep(1); return; }
    }

    if(e.key === "Escape"){
      if(closeTopOverlay()) e.preventDefault();
      return;
    }

    // focus trap inside the topmost open overlay
    if(e.key === "Tab"){
      const openId = overlayStack[overlayStack.length - 1];
      if(!openId) return;
      const root = document.getElementById(openId);
      if(!root) return;
      const list = focusables(root);
      if(!list.length) return;
      const first = list[0], last = list[list.length - 1];
      if(!active || !root.contains(active)){ e.preventDefault(); first.focus(); }
      else if(e.shiftKey && active === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && active === last){ e.preventDefault(); first.focus(); }
      return;
    }

    // Enter / Space opens a product card or gallery image
    if(e.key === "Enter" || e.key === " "){
      if(active && active !== document.body){
        const opener = active.closest ? active.closest("[data-open-product],[data-gallery-index]") : null;
        if(opener && opener.tagName !== "BUTTON"){
          e.preventDefault();
          if(opener.dataset.galleryIndex != null) openLightbox(Number(opener.dataset.galleryIndex));
          else openProductModal(opener.dataset.openProduct);
          return;
        }
      }
    }

    // "/" focuses the search field
    if(e.key === "/"){
      const tag = active ? active.tagName : "";
      if(!/^(INPUT|TEXTAREA|SELECT)$/.test(tag)){
        e.preventDefault();
        toggleSearch(true);
      }
    }
  });

  /* ---- checkout: re-render step when Delivery/Pickup changes ---- */
  document.addEventListener("change", (e) => {
    const ot = e.target && e.target.closest ? e.target.closest('[data-choice="orderType"]') : null;
    if(!ot) return;
    collectStepInputs();
    renderCheckout();
    const again = $('#checkoutBody [data-choice="orderType"]:checked');
    if(again){ try{ again.focus(); }catch(err){} }
  });

  /* ---- global search: enter scrolls to menu ---- */
  if(globalSearch) globalSearch.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){ e.preventDefault(); scrollToMenu(); }
  });
}

function openAdmin(){
  renderOrders();
  openModal("adminModal");
}

/* =====================================================================
   20. REVIEW AUTOPLAY
   ===================================================================== */
function startReviewTimer(){
  if(state.reviewTimer) return;
  state.reviewTimer = setInterval(() => goReview(state.reviewIndex + 1), 6000);
}
function stopReviewTimer(){
  if(state.reviewTimer){ clearInterval(state.reviewTimer); state.reviewTimer = null; }
}
function restartReviewTimer(){ stopReviewTimer(); startReviewTimer(); }

/* =====================================================================
   21. INIT
   ===================================================================== */
function init(){
  // theme
  const savedTheme = storeGet(STORE.theme, null);
  setTheme(savedTheme || (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));

  // announcement
  try{
    if(localStorage.getItem(STORE.announce) === "1"){
      const bar = $("#announcementBar");
      if(bar) bar.style.display = "none";
    }
  }catch(e){}

  // data
  loadCheckout();
  loadPromo();
  loadOrders();
  loadFavorites();
  loadCart();

  renderConfigText();
  renderHero();
  renderCategories();
  renderMenuChips();
  renderPopular();
  renderMenu();
  renderDeals();
  renderReviews();
  renderGalleryChips();
  renderGallery();
  renderContact();
  renderSocial();
  renderCart();
  renderOrders();

  // restore promo message
  if(state.promo){
    const msg = $("#promoMsg");
    if(msg){ msg.textContent = `✓ ${state.promo.code} applied — ${state.promo.label}`; msg.className = "promo__msg ok"; }
  }

  initHeader();
  initReveal();
  initCounters();
  initActiveNav();
  initEvents();
  startReviewTimer();
  startLiveClock();

  // keyboard hint for search
  setTimeout(maybeShowOffer, 7000);

  console.log(
    "%cPUNJAB JAB TIKKAH GOJRA%c\nFrontend demo ready. Edit RESTAURANT, WHATSAPP_NUMBER, products & prices at the top of script.js.",
    "background:#F4511E;color:#fff;padding:4px 9px;border-radius:5px;font-weight:bold",
    "color:#F4511E;font-weight:bold"
  );
}

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

