/**
 * Assignment 01 - Dizajn i implementacija funkcionalnog jezgra e-commerce projekta
 * ====================================================================
 * Tour booking webshop 
 * 
 * ZADACI:
 * MODEL: 5+ proizvoda (zahtevano 3), User, Cart sa svojstvima
 * FUNKCIJE: 5 funkcija + testovi sa ≥2 poziva po funkciji  
 * TESTOVI: Normalni + LOŠI slučajevi + console.log() za sve
 * BONUS: removeFromCart vraća u magacin
 * 
 * @author Adis Sućeska  
 * @version 2.0 
 * @date 2026-03-22
 */

// ============================================================================
// 1. MODELIRANJE PODATAKA: ZADATAK 1 
// ============================================================================

/**
 * PROIZVODI - 5 objekata (zahtevano ≥3)
 * SVA svojstva: id(number), name(string), price(number), quantity(number), category(string)
 */
const PRODUCTS = [
  {
    id: 1,
    name: "City Break in Paris",
    price: 120,
    quantity: 25,  // MAGACINSKO stanje
    category: "City Breaks"
  },
  {
    id: 2,
    name: "Rome Historical Tour", 
    price: 130,
    quantity: 12,
    category: "Historical Tours"
  },
  {
    id: 3,
    name: "Venice Gondola Ride",
    price: 140,
    quantity: 9,
    category: "Special Experiences"
  },
  {
    id: 4,
    name: "Barcelona City Adventure",
    price: 100,
    quantity: 30,
    category: "City Breaks"
  },
  {
    id: 5,
    name: "Budapest Thermal Baths",
    price: 115,
    quantity: 14,
    category: "Special Experiences"
  }
];

/**
 * KORISNIK - ZADATAK 1: username, email, isLoggedIn
 */
const USER = {
  username: "tourist123",
  email: "user@example.com", 
  isLoggedIn: false
};

/**
 * KORPA - ZADATAK 1: items[], totalPrice
 * Napomena: item.quantity = količina U KORPI (ne magacin)
 */
let CART = {
  items: [
    {
      id: 1,
      name: "City Break in Paris", 
      price: 120,
      quantity: 2,  // U KORPI
      category: "City Breaks"
    },
    {
      id: 3,
      name: "Venice Gondola Ride",
      price: 140,
      quantity: 1,
      category: "Special Experiences"
    }
  ],
  totalPrice: 380
};

// ============================================================================
// 2. FUNKCIJE - ZADATAK 2 
// ============================================================================

/**
 * ZADATAK 2.1: isInStock(product, requestedQty) 
 * Vraća true/false - product.quantity >= requestedQty
 * ČISTA FUNKCIJA - bez sporednih efekata
 */
const isInStock = (product, requestedQty) => product.quantity >= requestedQty;

/**
 * updateCartTotal(cart) - pomoćna funkcija
 * Računa totalPrice korpe (reduce)
 */
const updateCartTotal = (cart) => {
  cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return cart.totalPrice;
};

/**
 * ZADATAK 2.2: addToCart(cart, product, qty)
 * 1. Proverava isInStock pre dodavanja  
 * 2. Ispisuje poruku kod greške
 * 3. Dodaje u cart.items (update ili novi)
 * 4. Umanjuje product.quantity
 * 5. Test: isti proizvod više puta + preko limita
 */
const addToCart = (cart, productId, qty) => {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    console.log(`PROIZVOD NE POSTOJI: ID ${productId}`);
    return false;
  }

  if (!isInStock(product, qty)) {
    console.log(`NEDOVOLJNO: ${product.name} (${product.quantity}/${qty})`);
    return false;
  }

  const existingItem = cart.items.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += qty;
    console.log(`++ ${qty}x ${product.name} (UKUPNO: ${existingItem.quantity})`);
  } else {
    const newItem = { ...product, quantity: qty };
    cart.items.push(newItem);
    console.log(`NOVO: ${qty}x ${product.name}`);
  }

  product.quantity -= qty;
  updateCartTotal(cart);
  return true;
};

/**
 * ZADATak 2.3: removeFromCart(cart, productId)
 * 1. Uklanja iz cart.items po ID
 * 2. Ispisuje poruku ako ne postoji
 * BONUS: Vraća količinu u magacin
 */
const removeFromCart = (cart, productId) => {
  const itemIndex = cart.items.findIndex(item => item.id === productId);
  if (itemIndex === -1) {
    console.log(`NIJE U KORPI: ID ${productId}`);
    return false;
  }

  const removedItem = cart.items[itemIndex];
  const product = PRODUCTS.find(p => p.id === productId);

  // BONUS: Povratak u magacin
  if (product) {
    product.quantity += removedItem.quantity;
    console.log(`VRATI ${removedItem.quantity}x ${product.name} → ${product.quantity}`);
  }

  cart.items.splice(itemIndex, 1);
  updateCartTotal(cart);
  console.log(`UKLONJENO: ${removedItem.name} ($${removedItem.price * removedItem.quantity})`);
  return true;
};

/**
 * ZADATAK 2.4: getCheapProducts(products, limit) 
 * ARROW FUNKCIJA + FILTER - cijena < limit
 */
const getCheapProducts = (products, priceLimit) => 
  products.filter(product => product.price < priceLimit);

/**
 * ZADATAK 2.5: getProductsByCategory(products, category)
 * ANONIMNA FUNKCIJA + FILTER - function(p) { ... }
 */
const getProductsByCategory = (products, categoryName) => 
  products.filter(function(product) {
    return product.category === categoryName;
  });

// ============================================================================
// 3. TEST SEKCIJA 
// ============================================================================

/**
 * TEST Kriterijumi:
 * - ≥2 poziva PO FUNKCIJI  
 * - Normalni + LOŠI slučajevi
 * - console.log() za SVE rezultate
 */

console.log("=== E-COMMERCE TEST SUITE - SVI ZADACI ===\n");

// T1: isInStock() ≥4 poziva + dobri/loši
console.log("T1: isInStock() ");
console.log("  Paris(25): 10?", isInStock(PRODUCTS[0], 10));  // TRUE
console.log("  Paris(25): 30?", isInStock(PRODUCTS[0], 30));  // FALSE 
console.log("  Venice(9): 5?", isInStock(PRODUCTS[2], 5));    // TRUE
console.log("  Venice(9): 10?", isInStock(PRODUCTS[2], 10)); // FALSE

// T2: addToCart() ≥4 poziva + isti proizvod + preko limita
console.log("\nT2: addToCart() ");
addToCart(CART, 1, 1);  // Paris (isti proizvod)
addToCart(CART, 2, 2);  // Rome (novi)
addToCart(CART, 3, 10); // Venice (LOŠ: nedovoljno)
addToCart(CART, 4, 3);  // Barcelona (novi)

// T3: removeFromCart() ≥3 poziva + bonus
console.log("\nT3: removeFromCart() + BONUS");
CART.items = [
  { id: 1, name: "City Break in Paris", price: 120, quantity: 3, category: "City Breaks" },
  { id: 3, name: "Venice Gondola Ride", price: 140, quantity: 1, category: "Special Experiences" }
];
CART.totalPrice = 460;

removeFromCart(CART, 1);  // Paris (POSTOJI)
removeFromCart(CART, 3);  // Venice (POSTOJI)
removeFromCart(CART, 99); // Ne postoji (LOŠ)

// T4+T5: Filter funkcije ≥2 poziva + loši slučajevi
console.log("\nT4: getCheapProducts() ARROW");
console.log("  <120USD:", getCheapProducts(PRODUCTS, 120).length);
console.log("  <90USD (LOŠ):", getCheapProducts(PRODUCTS, 90).length);

console.log("\nT5: getProductsByCategory() ANONIMNA"); 
console.log("  City Breaks:", getProductsByCategory(PRODUCTS, "City Breaks").length);
console.log("  Food Tours (LOŠ):", getProductsByCategory(PRODUCTS, "Food Tours").length);

// FINALNO IZVEŠTAJ
console.log("\nFINALNO:");
console.log("KORPA:", CART.items.length, "artikala, €", CART.totalPrice);
console.log("MAGACIN:", PRODUCTS.map(p => `${p.name}:${p.quantity}`).join(" | "));
  
