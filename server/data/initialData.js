// Initial seed data for Pathao Multi-Service API

export const DHAKA_LOCATIONS = [
  { id: 'loc-1', name: 'Banani Road 11', area: 'Banani', city: 'Dhaka', coords: { x: 380, y: 220 }, tag: 'Recent' },
  { id: 'loc-2', name: 'Gulshan 2 Circle', area: 'Gulshan', city: 'Dhaka', coords: { x: 440, y: 240 }, tag: 'Popular' },
  { id: 'loc-3', name: 'Dhanmondi 27 (Mirpur Rd)', area: 'Dhanmondi', city: 'Dhaka', coords: { x: 260, y: 410 }, tag: 'Favorite' },
  { id: 'loc-4', name: 'Bashundhara R/A Gate 1', area: 'Bashundhara', city: 'Dhaka', coords: { x: 500, y: 150 }, tag: 'Recent' },
  { id: 'loc-5', name: 'Hazrat Shahjalal Intl Airport', area: 'Uttara', city: 'Dhaka', coords: { x: 410, y: 90 }, tag: 'Airport' },
  { id: 'loc-6', name: 'Shahbagh Square / DU', area: 'Shahbagh', city: 'Dhaka', coords: { x: 340, y: 460 }, tag: 'Popular' },
  { id: 'loc-7', name: 'Motijheel Commercial Area', area: 'Motijheel', city: 'Dhaka', coords: { x: 390, y: 520 }, tag: 'Office' },
  { id: 'loc-8', name: 'Mirpur 10 Circle', area: 'Mirpur', city: 'Dhaka', coords: { x: 240, y: 270 }, tag: 'Metro' },
  { id: 'loc-9', name: 'Mohakhali Wireless Gate', area: 'Mohakhali', city: 'Dhaka', coords: { x: 360, y: 290 }, tag: 'Hub' },
  { id: 'loc-10', name: 'GEC Circle', area: 'Chittagong Central', city: 'Chittagong', coords: { x: 300, y: 300 }, tag: 'CTG' },
];

export const MOCK_CAPTAINS = [
  {
    id: 'cap-1',
    name: 'Md. Rafiqul Islam',
    rating: 4.94,
    totalTrips: 3420,
    phone: '+880 1819-876543',
    vehiclePlate: 'DHAKA METRO HA-45-8912',
    vehicleModel: 'Bajaj Pulsar 150 (Red/Black)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    captainType: 'bike',
    badge: 'Top Rated Captain',
    vaccineBadge: 'Verified & Insured',
  },
  {
    id: 'cap-2',
    name: 'Kamrul Hasan Tanvir',
    rating: 4.88,
    totalTrips: 2150,
    phone: '+880 1711-234567',
    vehiclePlate: 'DHAKA METRO GA-23-4129',
    vehicleModel: 'Toyota Corolla Axio (Silver)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    captainType: 'car_lite',
    badge: '5-Star Pro',
    vaccineBadge: 'Verified & Insured',
  },
  {
    id: 'cap-3',
    name: 'Zahangir Alam',
    rating: 4.96,
    totalTrips: 4890,
    phone: '+880 1912-349812',
    vehiclePlate: 'DHAKA METRO LA-12-8877',
    vehicleModel: 'Yamaha FZ-S V3 (Matte Blue)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    captainType: 'bike',
    badge: 'Pathao Hero',
    vaccineBadge: 'Verified & Insured',
  },
  {
    id: 'cap-4',
    name: 'Belal Hossain',
    rating: 4.92,
    totalTrips: 1840,
    phone: '+880 1912-887766',
    vehiclePlate: 'DHAKA METRO HA-33-1290',
    vehicleModel: 'Hero Splendor (Black)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    captainType: 'parcel',
    badge: 'Express Courier',
    vaccineBadge: 'Verified & Insured',
  }
];

export const FOOD_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'biryani', name: 'Kacchi & Biryani' },
  { id: 'burgers', name: 'Smash Burgers' },
  { id: 'bengali', name: 'Bengali & Kabab' },
  { id: 'bakery', name: 'Bakery & Sweets' },
  { id: 'pizza', name: 'Pizza & Fast Food' },
];

export const RESTAURANTS = [
  {
    id: 'rest-1',
    name: "Sultan's Dine",
    branch: 'Banani 11, Dhaka',
    category: 'biryani',
    cuisine: 'Authentic Basmati Kacchi, Borhani, Roast',
    rating: 4.9,
    reviewsCount: 14200,
    deliveryTime: '25-35 min',
    distance: '1.8 km',
    deliveryFee: 40,
    minOrder: 250,
    banner: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    tag: 'Dhaka Favorite',
    discount: '৳80 OFF with KACCHILOVE',
    menu: [
      {
        id: 'sultan-item-1',
        name: 'Basmati Kacchi Biryani (1:1 Regular)',
        description: 'Tender mutton cooked in traditional dum style with aromatic aged basmati rice, golden baby potato and alobukhara.',
        price: 490,
        originalPrice: 530,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Kacchi Specials',
        customizers: [
          {
            title: 'Add-ons & Sides',
            required: false,
            options: [
              { name: 'Special Shahi Borhani (250ml)', price: 70 },
              { name: 'Extra Mutton Alobukhara Chutney', price: 35 },
              { name: 'Shahi Chicken Roast (1 pc)', price: 160 },
              { name: 'Golden Fried Egg', price: 25 },
            ]
          },
          {
            title: 'Spice Level',
            required: true,
            single: true,
            options: [
              { name: 'Authentic Mild Royal Spice', price: 0, default: true },
              { name: 'Spicy Dhaka Style', price: 0 },
            ]
          }
        ]
      },
      {
        id: 'sultan-item-2',
        name: 'Basmati Kacchi Platter (1:2 Jumbo)',
        description: 'Generous serving for 2 with 2 mutton cuts, 2 roasted potatoes, boiled eggs, jorda dessert and 2 borhanis.',
        price: 980,
        originalPrice: 1050,
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Kacchi Specials',
        customizers: [
          {
            title: 'Beverage choice',
            required: false,
            options: [
              { name: 'Chilled Coke (500ml)', price: 45 },
              { name: 'Extra Borhani Bottle (500ml)', price: 130 },
            ]
          }
        ]
      },
      {
        id: 'sultan-item-3',
        name: 'Shahi Firni in Clay Pot',
        description: 'Silky slow-cooked rice pudding enriched with saffron, cardamom, pistachio, and silver vark.',
        price: 110,
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=400&q=80',
        popular: false,
        category: 'Desserts',
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Chillox Burgers',
    branch: 'Gulshan 2, Dhaka',
    category: 'burgers',
    cuisine: 'Gourmet Smash Beef & Naga Chicken Burgers',
    rating: 4.8,
    reviewsCount: 8940,
    deliveryTime: '20-30 min',
    distance: '2.1 km',
    deliveryFee: 45,
    minOrder: 200,
    banner: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    tag: 'Trending',
    discount: 'Buy 1 Get 1 Free Drink',
    menu: [
      {
        id: 'chillox-item-1',
        name: 'Ghost Naga Double Beef Smash',
        description: 'Two 100% prime beef patties smashed crisp, infused with spicy Sylheti Ghost Naga chili mayo, double cheddar, and caramelized onions.',
        price: 360,
        originalPrice: 390,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Signature Burgers',
        customizers: [
          {
            title: 'Naga Heat Level',
            required: true,
            single: true,
            options: [
              { name: 'Level 1: Normal Kick', price: 0 },
              { name: 'Level 2: Fire Naga (Recommended)', price: 0, default: true },
              { name: 'Level 3: Insane Ghost Blast 🌶️🌶️', price: 0 },
            ]
          },
          {
            title: 'Add Crispy Sides',
            required: false,
            options: [
              { name: 'Peri Peri Curly Fries', price: 120 },
              { name: 'Melted Cheddar Cheese Dip', price: 50 },
              { name: 'Extra Beef Patty', price: 110 },
              { name: 'Crispy Beef Bacon Strips', price: 70 },
            ]
          }
        ]
      },
      {
        id: 'chillox-item-2',
        name: 'Smoky BBQ Crisp Chicken Burger',
        description: 'Golden fried chicken breast tossed in homemade smoky hickory BBQ glaze with crunchy iceberg lettuce.',
        price: 290,
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Chicken Burgers',
        customizers: []
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Kacchi Bhai',
    branch: 'Dhanmondi 27, Dhaka',
    category: 'biryani',
    cuisine: 'Traditional Old Dhaka Dum Kacchi & Borhani',
    rating: 4.85,
    reviewsCount: 11200,
    deliveryTime: '20-35 min',
    distance: '3.4 km',
    deliveryFee: 50,
    minOrder: 250,
    banner: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    tag: 'Authentic Old Dhaka',
    discount: '৳50 OFF',
    menu: [
      {
        id: 'kb-item-1',
        name: 'Special Basmati Mutton Kacchi',
        description: 'Mutton marinated overnight in spices, layered with fragrant saffron rice and served with potato.',
        price: 470,
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Kacchi',
        customizers: []
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'Star Kabab & Restaurant',
    branch: 'Dhanmondi / Banani, Dhaka',
    category: 'bengali',
    cuisine: 'Mutton Kebab, Chicken Tikka, Mughlai Parata',
    rating: 4.75,
    reviewsCount: 22400,
    deliveryTime: '15-25 min',
    distance: '1.2 km',
    deliveryFee: 35,
    minOrder: 150,
    banner: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
    tag: 'Classic Heritage',
    discount: 'Free Delivery with PATHAOFREE',
    menu: [
      {
        id: 'star-item-1',
        name: 'Mutton Boti Kebab (6 pcs)',
        description: 'Charcoal grilled tender spiced mutton chunks, marinated with ginger garlic and Star special garam masala.',
        price: 240,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Grill & Kebabs',
        customizers: []
      }
    ]
  }
];

export const PARCEL_CATEGORIES = [
  { id: 'document', name: 'Document / Paper', price: 70, maxKg: 1, icon: 'FileText' },
  { id: 'electronic', name: 'Electronics / Mobile', price: 120, maxKg: 3, icon: 'Laptop' },
  { id: 'clothing', name: 'Fashion & Clothing', price: 90, maxKg: 2, icon: 'ShoppingBag' },
  { id: 'fragile', name: 'Fragile / Gift Item', price: 140, maxKg: 5, icon: 'AlertTriangle' },
];

export const INITIAL_WALLET = {
  balance: 1450,
  currency: 'BDT',
  symbol: '৳',
  points: 850,
  user: {
    name: 'Tanvir Hasan',
    phone: '+880 1712-345678',
    badge: 'Platinum Club',
    rating: 4.95,
  }
};

export const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', title: "Sultan's Dine Food Feast", type: 'debit', amount: 560, date: 'Today, 1:15 PM', method: 'Pathao Pay' },
  { id: 'tx-2', title: 'bKash Wallet Recharge', type: 'credit', amount: 1000, date: 'Yesterday, 8:30 PM', method: 'bKash MFS' },
  { id: 'tx-3', title: 'Pathao Bike (Banani to Gulshan 2)', type: 'debit', amount: 135, date: '24 Oct, 6:40 PM', method: 'Pathao Pay' },
  { id: 'tx-4', title: 'Cashback Bonus (Kacchi Promo)', type: 'credit', amount: 50, date: '22 Oct, 2:10 PM', method: 'Promo Credit' },
];
