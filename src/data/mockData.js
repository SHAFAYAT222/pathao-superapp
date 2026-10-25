// Mock Dataset for Pathao Super-App (Dhaka & Chittagong locations, restaurants, captains)

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

export const VEHICLE_OPTIONS = [
  {
    id: 'bike',
    name: 'Pathao Bike',
    tagline: 'Fastest in Dhaka traffic',
    baseRate: 35,
    perKm: 14,
    minTime: '2-4 mins',
    capacity: '1 Seat',
    etaMultiplier: 1.0,
    icon: 'Bike',
    popular: true,
    helmetBadge: 'Spare Helmet Included',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    badge: '⚡ MOST POPULAR',
  },
  {
    id: 'car_lite',
    name: 'Pathao Car Lite',
    tagline: 'Affordable hatchback / Sedan',
    baseRate: 85,
    perKm: 28,
    minTime: '4-7 mins',
    capacity: '4 Seats',
    etaMultiplier: 1.4,
    icon: 'Car',
    popular: false,
    helmetBadge: '100% Chilled AC',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    badge: '❄️ AC COMFORT',
  },
  {
    id: 'car_plus',
    name: 'Pathao Car Plus',
    tagline: 'Premium executive sedan (Axio/Allion)',
    baseRate: 140,
    perKm: 38,
    minTime: '5-9 mins',
    capacity: '4 Seats (Extra Luggage)',
    etaMultiplier: 1.5,
    icon: 'CarTaxiFront',
    popular: false,
    helmetBadge: 'Top Captains & Mineral Water',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    badge: '⭐ EXECUTIVE',
  },
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
    captainType: 'Bike Captain',
    joinedYears: '3.5 years',
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
    captainType: 'Car Captain',
    joinedYears: '2 years',
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
    captainType: 'Bike Captain',
    joinedYears: '4 years',
    badge: 'Pathao Hero',
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
        customizers: [
          {
            title: 'Add-ons',
            required: false,
            options: [
              { name: 'Extra Cheddar Slice', price: 40 },
              { name: 'Spicy Garlic Mayo', price: 30 },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Star Kabab & Restaurant',
    branch: 'Banani DOHS Rd, Dhaka',
    category: 'bengali',
    cuisine: 'Legendary Mutton Kebab, Grilled Chicken & Naan',
    rating: 4.8,
    reviewsCount: 16500,
    deliveryTime: '20-30 min',
    distance: '1.2 km',
    deliveryFee: 35,
    minOrder: 180,
    banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tag: 'Classic Heritage',
    discount: 'Flat ৳50 OFF',
    menu: [
      {
        id: 'star-item-1',
        name: 'Special Star Mutton Boti Kabab',
        description: 'Charcoal grilled marinated succulent mutton cubes served with cucumber salad and mint chutney.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Kabab Specials',
        customizers: [
          {
            title: 'Breads & Accompaniments',
            required: false,
            options: [
              { name: 'Butter Tandoori Naan (1 pc)', price: 40 },
              { name: 'Garlic Naan (1 pc)', price: 55 },
              { name: 'Special Faluda with Kulfi', price: 140 },
            ]
          }
        ]
      },
      {
        id: 'star-item-2',
        name: 'Quarter Char-Grilled Chicken with Naan',
        description: 'Juicy spiced tandoori quarter leg cooked over natural coals, comes with fresh butter naan.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Tandoori Delights',
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'Glazed Donuts & Coffee',
    branch: 'Gulshan Avenue, Dhaka',
    category: 'bakery',
    cuisine: 'Handcrafted Gourmet Donuts & Artisan Espresso',
    rating: 4.9,
    reviewsCount: 4200,
    deliveryTime: '15-25 min',
    distance: '1.5 km',
    deliveryFee: 30,
    minOrder: 150,
    banner: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
    tag: 'Sweet Tooth',
    discount: 'Free 1 Donut on Box of 6',
    menu: [
      {
        id: 'glazed-item-1',
        name: 'Nutella Blast Gourmet Donut',
        description: 'Filled generously with pure Italian Nutella hazelnut spread, dusted with cocoa and toasted hazelnuts.',
        price: 160,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Signature Donuts',
      },
      {
        id: 'glazed-item-2',
        name: 'Box of 6 Assorted Premium Donuts',
        description: 'Choose your favorites: Boston Cream, Belgian Dark Chocolate, Lotus Biscoff, and Classic Glazed.',
        price: 780,
        originalPrice: 880,
        image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=80',
        popular: true,
        category: 'Boxes & Combos',
      }
    ]
  }
];

export const PARCEL_CATEGORIES = [
  { id: 'docs', name: 'Documents & Books', icon: 'FileText', note: 'Legal papers, passports, certificates', price: 60 },
  { id: 'electronics', name: 'Gadgets & Electronics', icon: 'Laptop', note: 'Phones, chargers, accessories', price: 95 },
  { id: 'clothing', name: 'Clothing & Lifestyle', icon: 'ShoppingBag', note: 'Dresses, shoes, fashion items', price: 80 },
  { id: 'fragile', name: 'Fragile & Cakes', icon: 'AlertTriangle', note: 'Handled with extra safety cushion', price: 120 },
];

export const PROMO_CODES = {
  'PATHAOFREE': { discount: 45, type: 'delivery', description: 'Free delivery on all food orders' },
  'KACCHILOVE': { discount: 80, type: 'flat', description: '৳80 off on Biryani orders above ৳400' },
  'BIKERIDE': { discount: 40, type: 'flat', description: '৳40 off on your next bike trip' },
  'PARCEL50': { discount: 30, type: 'flat', description: '৳30 off on parcel courier' },
};

export const RECENT_TRIPS = [
  { id: 'trip-101', type: 'bike', from: 'Banani Rd 11', to: 'Gulshan 2 Circle', date: 'Yesterday, 6:45 PM', fare: 135, captain: 'Md. Rafiqul', status: 'Completed' },
  { id: 'trip-102', type: 'food', restaurant: "Sultan's Dine", items: 'Basmati Kacchi x 1, Borhani x 1', date: '24 Oct, 1:30 PM', fare: 560, status: 'Delivered' },
  { id: 'trip-103', type: 'car', from: 'Dhanmondi 27', to: 'Shahjalal Airport', date: '21 Oct, 9:15 AM', fare: 480, captain: 'Kamrul Hasan', status: 'Completed' },
];

export const PROMO_BANNERS = [
  {
    id: 'promo-1',
    title: 'Dhaka Kacchi Mahotsav 🔥',
    subtitle: 'Flat ৳80 OFF on top biryani houses with code KACCHILOVE',
    badge: 'FOOD FEST',
    gradient: 'from-amber-600 via-red-600 to-rose-700',
    service: 'food',
  },
  {
    id: 'promo-2',
    title: 'Rainy Day? Grab a Car Lite 🚗',
    subtitle: 'Stay dry and chill with AC comfort. 20% off all day.',
    badge: 'RIDES',
    gradient: 'from-blue-700 via-indigo-700 to-slate-900',
    service: 'rides',
  },
  {
    id: 'promo-3',
    title: 'Lightning Parcel Courier 📦',
    subtitle: 'Instant pickup within 15 mins anywhere in Dhaka.',
    badge: 'PARCEL',
    gradient: 'from-emerald-700 via-teal-700 to-slate-900',
    service: 'parcel',
  },
];
