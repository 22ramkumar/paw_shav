/**
 * PawsHaven - Pet Boarding & Daycare Kennel Platform
 * LocalStorage Seed Data & State Initialization
 */

const PawsData = {
  // 12 Comprehensive Pet Care Services
  services: [
    {
      id: "srv-1",
      title: "Overnight Luxury Boarding",
      slug: "overnight-boarding",
      category: "boarding",
      price: 59,
      priceUnit: "per night",
      duration: "Overnight (24h cycle)",
      icon: "bi-moon-stars-fill",
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Private climate-controlled glass suite with orthotic bedding, webcams, and 4 daily exercise sessions.",
      features: ["Private Climate-Controlled Suite", "4 Daily Grass Yard Outings", "24/7 Live HD Webcam Stream", "Bedtime Organic Treat & Tuck-in"]
    },
    {
      id: "srv-2",
      title: "Daytime Daycare & Socialization",
      slug: "daytime-daycare",
      category: "daycare",
      price: 38,
      priceUnit: "per day",
      duration: "Full Day (7 AM – 7 PM)",
      icon: "bi-sun-fill",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Energetic indoor and outdoor playgroups matched strictly by pet size, age, and play temperament.",
      features: ["Size & Temperament Matched Groups", "Splash Pool & Agility Ramps", "Midday Quiet Nap Zone", "Digital Activity Log to Phone"]
    },
    {
      id: "srv-3",
      title: "Puppy & Kitten Nursery Daycare",
      slug: "puppy-kitten-nursery",
      category: "daycare",
      price: 45,
      priceUnit: "per day",
      duration: "Full Day with Potty Breaks",
      icon: "bi-heart-pulse-fill",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Gentle stimulation, early socialization, frequent potty training schedules, and extra cuddle intervals.",
      features: ["2-Hour Potty Training Intervals", "Early Positive Socialization", "Soft Rubber Impact Flooring", "Dedicated Puppy Cuddle Staff"]
    },
    {
      id: "srv-4",
      title: "Bathing & Professional Grooming",
      slug: "bathing-grooming",
      category: "grooming",
      price: 65,
      priceUnit: "starting from",
      duration: "1.5 – 2 Hours",
      icon: "bi-droplet-half",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Full bubble bath with hypoallergenic shampoos, coat de-shedding blow out, sanitary trim, and brush.",
      features: ["Hypoallergenic Organic Shampoos", "High-Velocity Fluff Blowout", "Sanitary & Paw Pad Trim", "Fresh Botanical Scent Spritz"]
    },
    {
      id: "srv-5",
      title: "Nail Trimming & Gentle Pawdicure",
      slug: "nail-trimming",
      category: "grooming",
      price: 22,
      priceUnit: "per session",
      duration: "20 Minutes",
      icon: "bi-scissors",
      image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Quick, stress-free claw clipping followed by smooth grinding buff and soothing organic pad balm.",
      features: ["Quick-Safe Clipping", "Rotary Dremel Smoothing", "Soothing Coconut Paw Balm", "Fear-Free Handling Technique"]
    },
    {
      id: "srv-6",
      title: "Full-Service Spa & Wellness Package",
      slug: "full-service-spa",
      category: "grooming",
      price: 95,
      priceUnit: "package",
      duration: "3 Hours",
      icon: "bi-stars",
      image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?auto=format&fit=crop&w=800&q=80",
      shortDesc: "The ultimate luxury pampering: blueberry facial, dead sea salt hydro-massage, teeth clean, and lavender rub.",
      features: ["Antioxidant Blueberry Facial", "Hydro-Massage Bath System", "Teeth Brushing & Breath Spray", "Warm Lavender Towel Wrap"]
    },
    {
      id: "srv-7",
      title: "Paws Taxi Pickup & Chauffeur",
      slug: "pet-taxi",
      category: "specialized",
      price: 30,
      priceUnit: "per trip (10 mi)",
      duration: "Scheduled Transit",
      icon: "bi-truck-front-fill",
      image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Air-conditioned, crash-tested pet limousine shuttle straight from your front door to our resort and back.",
      features: ["Air-Conditioned Safety Crates", "Live GPS Parent Tracking", "Doorstep Pickup & Delivery", "Seatbelt Safety Harnesses"]
    },
    {
      id: "srv-8",
      title: "Private Positive Training Sessions",
      slug: "training-sessions",
      category: "specialized",
      price: 75,
      priceUnit: "per 45m session",
      duration: "45 Minutes",
      icon: "bi-trophy-fill",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Certified trainer focused on leash manners, recall, impulse control, and joyful agility exercises.",
      features: ["Certified Animal Behaviorist", "Positive Reinforcement Method", "Customized Curriculum", "Take-Home Video Exercise Guide"]
    },
    {
      id: "srv-9",
      title: "Special Needs & Senior Pet Gentle Care",
      slug: "special-needs-senior-care",
      category: "specialized",
      price: 70,
      priceUnit: "per night",
      duration: "24h Dedicated Care",
      icon: "bi-shield-fill-plus",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Extra-soft orthopedic bedding, ramp accessibility, gentle non-slip floors, and quiet companionship.",
      features: ["Zero-Step Heated Suites", "Ramp Access Throughout", "Mobility Assistance & Stretches", "One-on-One Gentle TLC Time"]
    },
    {
      id: "srv-10",
      title: "Medication Administration & Monitoring",
      slug: "medication-administration",
      category: "specialized",
      price: 15,
      priceUnit: "per day",
      duration: "Scheduled Dosing",
      icon: "bi-capsule",
      image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Strict medical logs managed by licensed veterinary technicians for oral, topical, and insulin needs.",
      features: ["Veterinary Tech Supervised", "Insulin & Sub-Q Fluids Capable", "Strict Time-Stamped Log", "Direct Vet On-Call Hotline"]
    },
    {
      id: "srv-11",
      title: "Agility & Supervised Playgroup",
      slug: "playgroup-sessions",
      category: "daycare",
      price: 25,
      priceUnit: "per add-on",
      duration: "60 Minutes",
      icon: "bi-controller",
      image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Small high-energy canine group tackling A-frames, tunnels, ball pits, and bubble chases.",
      features: ["K9 Agility Equipment", "Flirt Pole & Frisbee Drills", "Bacon-Scented Bubble Fun", "High-Definition Photo Snapshots"]
    },
    {
      id: "srv-12",
      title: "Extended Stay & Vacation Packages",
      slug: "extended-boarding-packages",
      category: "boarding",
      price: 360,
      priceUnit: "7-night package",
      duration: "7+ Days Continuous",
      icon: "bi-calendar-check-fill",
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
      shortDesc: "Discounted weekly & monthly all-inclusive packages with daily photos, complimentary bath, and suite upgrade.",
      features: ["15% Long-Stay Discount", "Complimentary Departure Bath", "Priority Suite Placement", "Weekly Video Call with Parent"]
    }
  ],

  // Registered Pets
  pets: [
    {
      id: "pet-101",
      name: "Max",
      species: "Dog",
      breed: "Golden Retriever",
      gender: "Male",
      age: "3 years",
      weight: "68 lbs",
      avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
      ownerId: "usr-01",
      ownerName: "Sarah Jenkins",
      ownerEmail: "sarah@example.com",
      ownerPhone: "+1 (555) 234-5678",
      vaccinationStatus: "Up to Date",
      vaccinationExpiry: "2027-02-15",
      specialNotes: "Friendly with everyone. Loves splash pools. Mild chicken allergy—salmon only.",
      emergencyContact: "Dr. Marcus Vance (555-900-4321)",
      activeStayId: "STAY-9041"
    },
    {
      id: "pet-102",
      name: "Bella",
      species: "Dog",
      breed: "French Bulldog",
      gender: "Female",
      age: "2 years",
      weight: "23 lbs",
      avatar: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80",
      ownerId: "usr-02",
      ownerName: "Michael Ross",
      ownerEmail: "michael.ross@example.com",
      ownerPhone: "+1 (555) 876-5432",
      vaccinationStatus: "Up to Date",
      vaccinationExpiry: "2026-11-20",
      specialNotes: "Needs cooling breaks after 20m play. Eye moisturizing drops twice daily.",
      emergencyContact: "City Pet Hospital (555-443-1200)",
      activeStayId: null
    },
    {
      id: "pet-103",
      name: "Luna",
      species: "Cat",
      breed: "Siamese",
      gender: "Female",
      age: "4 years",
      weight: "9.5 lbs",
      avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
      ownerId: "usr-03",
      ownerName: "Elena Rodriguez",
      ownerEmail: "elena.rodriguez@example.com",
      ownerPhone: "+1 (555) 345-9876",
      vaccinationStatus: "Up to Date",
      vaccinationExpiry: "2027-05-10",
      specialNotes: "Prefers quiet penthouse condo with bird watching window. Loves catnip mice.",
      emergencyContact: "Feline Care Clinic (555-776-8899)",
      activeStayId: "STAY-8820"
    },
    {
      id: "pet-104",
      name: "Charlie",
      species: "Dog",
      breed: "Labrador Retriever",
      gender: "Male",
      age: "4 years",
      weight: "74 lbs",
      avatar: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80",
      ownerId: "usr-01",
      ownerName: "Sarah Jenkins",
      ownerEmail: "sarah@example.com",
      ownerPhone: "+1 (555) 234-5678",
      vaccinationStatus: "Up to Date",
      vaccinationExpiry: "2026-12-05",
      specialNotes: "High stamina, loves fetch. Can be in medium-large playgroup.",
      emergencyContact: "Dr. Marcus Vance (555-900-4321)",
      activeStayId: null
    },
    {
      id: "pet-105",
      name: "Milo",
      species: "Dog",
      breed: "Beagle",
      gender: "Male",
      age: "1.5 years",
      weight: "29 lbs",
      avatar: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=400&q=80",
      ownerId: "usr-04",
      ownerName: "David Kim",
      ownerEmail: "david.kim@example.com",
      ownerPhone: "+1 (555) 654-3210",
      vaccinationStatus: "Up to Date",
      vaccinationExpiry: "2026-10-18",
      specialNotes: "Curious hound dog, keeps nose to the grass. Wear gentle leader on walks.",
      emergencyContact: "David Kim (555-654-3210)",
      activeStayId: "STAY-7914"
    },
    {
      id: "pet-106",
      name: "Daisy",
      species: "Dog",
      breed: "Goldendoodle",
      gender: "Female",
      age: "2.5 years",
      weight: "44 lbs",
      avatar: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80",
      ownerId: "usr-05",
      ownerName: "Emily Watson",
      ownerEmail: "emily.watson@example.com",
      ownerPhone: "+1 (555) 432-1098",
      vaccinationStatus: "Up to Date",
      vaccinationExpiry: "2027-01-30",
      specialNotes: "Gets daily brush out. Enjoys agility course jumps and belly rubs.",
      emergencyContact: "Emily Watson (555-432-1098)",
      activeStayId: null
    }
  ],

  // Active & Past Bookings / Stays
  stays: [
    {
      id: "STAY-9041",
      petId: "pet-101",
      petName: "Max",
      petPhoto: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
      breed: "Golden Retriever",
      serviceName: "Overnight Luxury Boarding",
      suite: "Deluxe Glass Suite #07",
      checkInDate: "2026-09-06",
      checkOutDate: "2026-09-10",
      stageIndex: 3, // 1: Checked In, 2: Settling In, 3: Daily Activities, 4: Health Check, 5: Ready for Pickup
      status: "In Care",
      assignedCaretaker: "Jessica Miller (Pet CPR Certified)",
      latestNote: "Max had a blast in the afternoon splash pool and ate his whole salmon dinner!",
      ownerName: "Sarah Jenkins",
      ownerEmail: "sarah@example.com",
      ownerPhone: "+1 (555) 234-5678",
      amount: 236,
      paymentStatus: "Paid",
      webcamActive: true
    },
    {
      id: "STAY-8820",
      petId: "pet-103",
      petName: "Luna",
      petPhoto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
      breed: "Siamese Cat",
      serviceName: "Feline Penthouse Boarding",
      suite: "Feline Suite #02 (Window View)",
      checkInDate: "2026-09-05",
      checkOutDate: "2026-09-08",
      stageIndex: 4,
      status: "Health Check",
      assignedCaretaker: "Chloe Bennett (Veterinary Tech)",
      latestNote: "Purring and napping in the sunlight. Vitals normal, coat combed.",
      ownerName: "Elena Rodriguez",
      ownerEmail: "elena.rodriguez@example.com",
      ownerPhone: "+1 (555) 345-9876",
      amount: 195,
      paymentStatus: "Paid",
      webcamActive: true
    },
    {
      id: "STAY-7914",
      petId: "pet-105",
      petName: "Milo",
      petPhoto: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=400&q=80",
      breed: "Beagle",
      serviceName: "Daytime Daycare & Agility",
      suite: "Canine Day Lodge",
      checkInDate: "2026-09-07",
      checkOutDate: "2026-09-07",
      stageIndex: 5,
      status: "Ready for Pickup",
      assignedCaretaker: "Liam O'Connor (Trainer)",
      latestNote: "Completed 2 agility courses with flying colors! Cleaned up and resting with toy.",
      ownerName: "David Kim",
      ownerEmail: "david.kim@example.com",
      ownerPhone: "+1 (555) 654-3210",
      amount: 63,
      paymentStatus: "Paid",
      webcamActive: false
    },
    {
      id: "STAY-6510",
      petId: "pet-102",
      petName: "Bella",
      petPhoto: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80",
      breed: "French Bulldog",
      serviceName: "Overnight Luxury Boarding + Spa",
      suite: "Deluxe Suite #04",
      checkInDate: "2026-08-20",
      checkOutDate: "2026-08-24",
      stageIndex: 5,
      status: "Completed",
      assignedCaretaker: "Jessica Miller",
      latestNote: "Wonderful stay, parent picked up happily.",
      ownerName: "Michael Ross",
      ownerEmail: "michael.ross@example.com",
      ownerPhone: "+1 (555) 876-5432",
      amount: 320,
      paymentStatus: "Paid",
      webcamActive: false
    },
    {
      id: "STAY-5420",
      petId: "pet-104",
      petName: "Charlie",
      petPhoto: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80",
      breed: "Labrador Retriever",
      serviceName: "Daytime Daycare",
      suite: "Canine Day Lodge",
      checkInDate: "2026-08-28",
      checkOutDate: "2026-08-28",
      stageIndex: 5,
      status: "Completed",
      assignedCaretaker: "Liam O'Connor",
      latestNote: "Social play leader all afternoon.",
      ownerName: "Sarah Jenkins",
      ownerEmail: "sarah@example.com",
      ownerPhone: "+1 (555) 234-5678",
      amount: 38,
      paymentStatus: "Paid",
      webcamActive: false
    }
  ],

  // Real-time Daily Activity & Feeding Logs
  dailyLogs: [
    {
      id: "log-1",
      stayId: "STAY-9041",
      petName: "Max",
      time: "07:30 AM",
      type: "Feeding",
      icon: "bi-cup-hot-fill",
      badgeClass: "badge-coral",
      title: "Morning Gourmet Breakfast",
      details: "1.5 cups Purina Pro Plan Salmon + warm organic bone broth. Devoured eagerly with clean bowl!",
      staff: "Jessica M."
    },
    {
      id: "log-2",
      stayId: "STAY-9041",
      petName: "Max",
      time: "09:00 AM",
      type: "Activity",
      icon: "bi-tree-fill",
      badgeClass: "badge-teal",
      title: "Private Grass Yard Play & Fetch",
      details: "45 minutes in Yard C. Max made friends with a Golden mix and chased tennis balls endlessly.",
      staff: "Liam O."
    },
    {
      id: "log-3",
      stayId: "STAY-9041",
      petName: "Max",
      time: "12:15 PM",
      type: "Rest",
      icon: "bi-cloud-moon-fill",
      badgeClass: "badge-amber",
      title: "Midday Suite Nap & Classical Music",
      details: "Curled up on the orthotic foam bed with his personal plush toy. Sound asleep for 2 hours.",
      staff: "Jessica M."
    },
    {
      id: "log-4",
      stayId: "STAY-9041",
      petName: "Max",
      time: "02:30 PM",
      type: "Activity",
      icon: "bi-droplet-fill",
      badgeClass: "badge-teal",
      title: "Splash Pool Party & Agility Tunnel",
      details: "Splashed through the shallow water jet pool and ran through the soft agility tube.",
      staff: "Liam O."
    },
    {
      id: "log-5",
      stayId: "STAY-9041",
      petName: "Max",
      time: "04:30 PM",
      type: "Health Check",
      icon: "bi-heart-pulse-fill",
      badgeClass: "badge-coral",
      title: "Afternoon Wellness & Coat Check",
      details: "Temperature: 101.3°F (Normal). Ears clear, paws checked and moisturized with paw balm.",
      staff: "Chloe B."
    },
    {
      id: "log-6",
      stayId: "STAY-9041",
      petName: "Max",
      time: "05:45 PM",
      type: "Feeding",
      icon: "bi-cup-hot-fill",
      badgeClass: "badge-coral",
      title: "Evening Salmon Dinner + Fresh Water",
      details: "1.5 cups kibble + pumpkin purée topper. Refilled filtered hydration fountain.",
      staff: "Jessica M."
    }
  ],

  // 4K Curated Boarding & Daycare High-Res Photos Feed
  photoFeed: [
    {
      id: "photo-01",
      title: "Morning Splash Pool Games",
      petName: "Max & Friends",
      stayId: "STAY-9041",
      date: "Today, 10:45 AM",
      category: "Activity",
      url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=85",
      caption: "Max splashing around with boundless joy under the sunny sprinklers in Yard B!"
    },
    {
      id: "photo-02",
      title: "Cozy Suite Snooze",
      petName: "Max",
      stayId: "STAY-9041",
      date: "Today, 01:15 PM",
      category: "Rest",
      url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=85",
      caption: "Midday recharge in Deluxe Suite #07 with his favorite cozy blanket."
    },
    {
      id: "photo-03",
      title: "Agility Mastery Session",
      petName: "Milo",
      stayId: "STAY-7914",
      date: "Today, 02:40 PM",
      category: "Training",
      url: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=85",
      caption: "Milo clearing the agility hurdle like a pro! Treats were well earned."
    },
    {
      id: "photo-04",
      title: "Sunbeam Perch Nap",
      petName: "Luna",
      stayId: "STAY-8820",
      date: "Today, 11:30 AM",
      category: "Rest",
      url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=85",
      caption: "Luna soaking up the morning sun while watching birds from the window perch."
    },
    {
      id: "photo-05",
      title: "Post-Spa Fluff & Bow",
      petName: "Bella",
      stayId: "STAY-6510",
      date: "Aug 22, 2026",
      category: "Grooming",
      url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85",
      caption: "Looking and smelling fabulous after her organic chamomile spa treatment."
    },
    {
      id: "photo-06",
      title: "Yard Pack Playtime",
      petName: "Charlie & Pack",
      stayId: "STAY-5420",
      date: "Aug 28, 2026",
      category: "Activity",
      url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=85",
      caption: "Full zoomies in the turf field with our favorite caretaker Liam."
    }
  ],

  // Certified Resort Staff
  staff: [
    {
      id: "stf-1",
      name: "Jessica Miller",
      role: "Resort Director & Head Caretaker",
      certifications: ["Certified Pet Care Tech (CPCT)", "Pet First Aid & CPR", "Fear Free Certified"],
      experience: "9+ Years Experience",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Dedicated lifelong pet parent with passion for stress-free animal enrichment and behavioral health."
    },
    {
      id: "stf-2",
      name: "Dr. Marcus Vance, DVM",
      role: "Resident Veterinary Partner",
      certifications: ["Doctor of Veterinary Medicine", "Small Animal Internal Medicine", "Emergency Care"],
      experience: "14+ Years Experience",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&crop=top&w=400&h=400&q=80",
      bio: "Provides daily on-site health inspections and oversees our strict medication and hygiene protocols."
    },
    {
      id: "stf-3",
      name: "Chloe Bennett",
      role: "Lead Pet Stylist & Spa Specialist",
      certifications: ["Master Groomer Certified", "Feline Low-Stress Grooming", "Skin & Coat Specialist"],
      experience: "7+ Years Experience",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Brings a calming touch to nervous pups, specializing in breed-standard trims and hydro-massage therapy."
    },
    {
      id: "stf-4",
      name: "Liam O'Connor",
      role: "Canine Behaviorist & Play Yard Lead",
      certifications: ["CPDT-KA Certified", "Agility Instructor", "Canine Body Language Specialist"],
      experience: "6+ Years Experience",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Expert at reading dog body language and curating joyful, safe, and balanced playgroups."
    }
  ],

  // Pet Parent Testimonials
  testimonials: [
    {
      id: "test-1",
      author: "Sarah Jenkins",
      role: "Parent of Max (Golden Retriever)",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      petAvatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "September 2026",
      text: "Leaving Max used to give me severe travel anxiety until we found PawsHaven. The daily video clips, webcam access, and genuinely loving staff make this feel like a 5-star resort for dogs. He literally wags his tail at drop-off!"
    },
    {
      id: "test-2",
      author: "Michael Ross",
      role: "Parent of Bella (Frenchie)",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      petAvatar: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "August 2026",
      text: "As a Frenchie owner, climate control and attentive care are critical. PawsHaven staff monitored her breathing, gave her eye drops on the dot, and sent the sweetest photos. Best pet facility in the state."
    },
    {
      id: "test-3",
      author: "Elena Rodriguez",
      role: "Parent of Luna (Siamese Cat)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      petAvatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      date: "August 2026",
      text: "Most boarding places treat cats as an afterthought. PawsHaven's Feline Wing is completely separated, peaceful, and features multi-tiered towers with birdwatching windows. Luna came home relaxed and happy!"
    }
  ],

  // Blog Articles
  blogPosts: [
    {
      id: "post-1",
      title: "First Time Boarding?\u200E 7 Steps to Prepare Your Dog for a Stress-Free Stay",
      slug: "first-time-boarding-preparation",
      category: "Boarding Tips",
      author: "Jessica Miller",
      date: "Sep 2, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      excerpt: "Packing your dog's favorite blanket, sticking to their food routine, and pre-stay daycare visits make a world of difference.",
      tags: ["Boarding", "Dog Care", "Travel Prep"]
    },
    {
      id: "post-2",
      title: "Understanding Dog Body Language in Playgroups: What Joy vs. Stress Looks Like",
      slug: "understanding-dog-body-language",
      category: "Pet Behavior",
      author: "Liam O'Connor",
      date: "Aug 26, 2026",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
      excerpt: "Play bows, loose tails, and reciprocal chase are signs of healthy canine communication. Here is how our caretakers monitor playgroups.",
      tags: ["Behavior", "Playgroups", "Canine Psychology"]
    },
    {
      id: "post-3",
      title: "The Ultimate Guide to Pet Vaccinations: Why Bordetella & DHPP Matter",
      slug: "pet-vaccination-guide",
      category: "Health & Wellness",
      author: "Dr. Marcus Vance, DVM",
      date: "Aug 18, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
      excerpt: "Preventative medicine is the cornerstone of community boarding. Learn why kennel cough and core vaccines protect your best friend.",
      tags: ["Vaccines", "Vet Care", "Safety"]
    },
    {
      id: "post-4",
      title: "Blueberry Facials and Hydrotherapy: The Science Behind Canine Spa Pampering",
      slug: "canine-spa-science",
      category: "Grooming",
      author: "Chloe Bennett",
      date: "Aug 10, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
      excerpt: "It is more than just luxury—targeted natural botanicals relieve dry itchy skin, detangle double coats, and ease arthritis joints.",
      tags: ["Grooming", "Spa", "Coat Care"]
    },
    {
      id: "post-5",
      title: "The Ultimate Boarding Packing Checklist: What to Bring & What to Leave at Home",
      slug: "boarding-packing-checklist",
      category: "Boarding Tips",
      author: "Jessica Miller",
      date: "Sep 5, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80",
      excerpt: "Pre-portioned food bags, familiar scent items, and veterinary medication schedules keep your pet feeling calm and right at home.",
      tags: ["Boarding", "Packing", "Travel Tips"]
    },
    {
      id: "post-6",
      title: "Senior Pet Boarding: Orthopedic Comfort, Ramps & Specialized Medication Routines",
      slug: "senior-pet-boarding-care",
      category: "Boarding Tips",
      author: "Dr. Marcus Vance, DVM",
      date: "Aug 29, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
      excerpt: "Low-impact memory foam bedding, heated flooring pads, ramp access, and rigorous clinical logging ensure our golden-age boarders thrive.",
      tags: ["Senior Pets", "Geriatric Care", "Boarding"]
    },
    {
      id: "post-7",
      title: "Separation Anxiety in Pets: Proven Conditioning Techniques Before Travel",
      slug: "separation-anxiety-conditioning",
      category: "Pet Behavior",
      author: "Liam O'Connor",
      date: "Aug 22, 2026",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80",
      excerpt: "Desensitizing luggage triggers, establishing calming morning departures, and counter-conditioning help nervous pets anticipate fun playgroups.",
      tags: ["Behavior", "Anxiety", "Training"]
    },
    {
      id: "post-8",
      title: "Puppy Socialization Windows: How Safe Daycare Groups Prevent Fear Aggression",
      slug: "puppy-socialization-daycare",
      category: "Pet Behavior",
      author: "Liam O'Connor",
      date: "Aug 15, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
      excerpt: "Between 8 and 16 weeks, positive interactions with diverse breeds and trainers lay the bedrock for a confident, well-adjusted adult dog.",
      tags: ["Puppies", "Socialization", "Daycare"]
    },
    {
      id: "post-9",
      title: "Nutrition on the Move: Managing Sensitive Stomachs During Kennel Stays",
      slug: "pet-nutrition-sensitive-stomach",
      category: "Health & Wellness",
      author: "Dr. Marcus Vance, DVM",
      date: "Aug 8, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80",
      excerpt: "Why keeping your pet on their exact home brand diet matters, and how organic pumpkin purée and digestive probiotics soothe transition stress.",
      tags: ["Nutrition", "Health", "Digestion"]
    },
    {
      id: "post-10",
      title: "Hydration, Sun & Splash: Summer Safety for High-Energy Playgroups",
      slug: "summer-hydration-pet-safety",
      category: "Health & Wellness",
      author: "Jessica Miller",
      date: "Jul 31, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80",
      excerpt: "Shaded misting pavilions, filtered bone broth ice pops, and mandatory indoor cooling breaks keep playgroups invigorated without heat exhaustion risk.",
      tags: ["Summer Care", "Hydration", "Safety"]
    },
    {
      id: "post-11",
      title: "Double Coats & Shedding: Why Shaving Your Husky or Golden Can Harm Their Skin",
      slug: "double-coat-grooming-guide",
      category: "Grooming",
      author: "Chloe Bennett",
      date: "Jul 25, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80",
      excerpt: "A dog's topcoat and undercoat act as thermal insulation against both heat and UV radiation. Learn how high-velocity de-shedding protects coat health.",
      tags: ["Grooming", "Coat Care", "De-shedding"]
    },
    {
      id: "post-12",
      title: "Paw Pad Care & Ear Hygiene: Preventative At-Home Grooming Essentials",
      slug: "paw-ear-hygiene-essentials",
      category: "Grooming",
      author: "Chloe Bennett",
      date: "Jul 18, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80",
      excerpt: "From organic beeswax pad balms to pH-balanced ear flushes, simple 5-minute weekly routines keep painful yeast infections and cracked paws away.",
      tags: ["Grooming", "Paw Care", "Ear Health"]
    }
  ],

  // Payment / Invoices
  invoices: [
    {
      id: "INV-2026-9041",
      bookingId: "STAY-9041",
      date: "2026-09-06",
      petName: "Max",
      service: "Overnight Luxury Boarding (4 Nights)",
      subtotal: 236.00,
      tax: 18.88,
      total: 254.88,
      status: "Paid",
      paymentMethod: "Visa ending in 4242",
      customerName: "Sarah Jenkins",
      customerEmail: "sarah@example.com"
    },
    {
      id: "INV-2026-8820",
      bookingId: "STAY-8820",
      date: "2026-09-05",
      petName: "Luna",
      service: "Feline Penthouse Boarding (3 Nights)",
      subtotal: 195.00,
      tax: 15.60,
      total: 210.60,
      status: "Paid",
      paymentMethod: "Mastercard ending in 8891",
      customerName: "Elena Rodriguez",
      customerEmail: "elena.rodriguez@example.com"
    },
    {
      id: "INV-2026-7914",
      bookingId: "STAY-7914",
      date: "2026-09-07",
      petName: "Milo",
      service: "Daycare + Agility Add-on",
      subtotal: 63.00,
      tax: 5.04,
      total: 68.04,
      status: "Paid",
      paymentMethod: "Apple Pay",
      customerName: "David Kim",
      customerEmail: "david.kim@example.com"
    },
    {
      id: "INV-2026-6510",
      bookingId: "STAY-6510",
      date: "2026-08-20",
      petName: "Bella",
      service: "Boarding (4 Nights) + Full Spa Bath",
      subtotal: 320.00,
      tax: 25.60,
      total: 345.60,
      status: "Paid",
      paymentMethod: "Visa ending in 1102",
      customerName: "Michael Ross",
      customerEmail: "michael.ross@example.com"
    }
  ],

  // Pet Owner Accounts
  users: [
    {
      id: "usr-01",
      name: "Sarah Jenkins",
      email: "user@gmail.com",
      password: "1234",
      role: "owner",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      phone: "+1 (555) 234-5678",
      joinedDate: "January 2025"
    },
    {
      id: "usr-02",
      name: "Elena Rodriguez",
      email: "elena.rodriguez@example.com",
      password: "Pet123!",
      role: "owner",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      phone: "+1 (555) 345-6789",
      joinedDate: "March 2025"
    },
    {
      id: "usr-03",
      name: "David Kim",
      email: "david.kim@example.com",
      password: "Pet123!",
      role: "owner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      phone: "+1 (555) 456-7890",
      joinedDate: "April 2025"
    }
  ]
};

// Initialize LocalStorage with seed data if not present
function initializePawsDatabase() {
  // Sync services with latest relevant high-res images
  const existingServices = localStorage.getItem("paws_services");
  if (!existingServices) {
    localStorage.setItem("paws_services", JSON.stringify(PawsData.services));
  } else {
    try {
      const parsed = JSON.parse(existingServices);
      const updated = PawsData.services.map(s => {
        const found = parsed.find(p => p.id === s.id);
        return found ? { ...found, image: s.image, icon: s.icon, title: s.title } : s;
      });
      localStorage.setItem("paws_services", JSON.stringify(updated));
    } catch(e) {
      localStorage.setItem("paws_services", JSON.stringify(PawsData.services));
    }
  }
  if (!localStorage.getItem("paws_pets")) {
    localStorage.setItem("paws_pets", JSON.stringify(PawsData.pets));
  }
  if (!localStorage.getItem("paws_stays")) {
    localStorage.setItem("paws_stays", JSON.stringify(PawsData.stays));
  }
  if (!localStorage.getItem("paws_dailyLogs")) {
    localStorage.setItem("paws_dailyLogs", JSON.stringify(PawsData.dailyLogs));
  }
  if (!localStorage.getItem("paws_photoFeed")) {
    localStorage.setItem("paws_photoFeed", JSON.stringify(PawsData.photoFeed));
  }
  if (!localStorage.getItem("paws_staff")) {
    localStorage.setItem("paws_staff", JSON.stringify(PawsData.staff));
  }
  if (!localStorage.getItem("paws_testimonials")) {
    localStorage.setItem("paws_testimonials", JSON.stringify(PawsData.testimonials));
  }
  // Sync Blog Posts with full catalog
  const existingBlogs = localStorage.getItem("paws_blogPosts");
  if (!existingBlogs) {
    localStorage.setItem("paws_blogPosts", JSON.stringify(PawsData.blogPosts));
  } else {
    try {
      const parsedBlogs = JSON.parse(existingBlogs);
      const blogMap = new Map();
      PawsData.blogPosts.forEach(b => blogMap.set(b.id, b));
      parsedBlogs.forEach(b => {
        if (blogMap.has(b.id)) {
          blogMap.set(b.id, { ...b, ...blogMap.get(b.id) });
        } else {
          blogMap.set(b.id, b);
        }
      });
      localStorage.setItem("paws_blogPosts", JSON.stringify(Array.from(blogMap.values())));
    } catch(e) {
      localStorage.setItem("paws_blogPosts", JSON.stringify(PawsData.blogPosts));
    }
  }
  if (!localStorage.getItem("paws_invoices")) {
    localStorage.setItem("paws_invoices", JSON.stringify(PawsData.invoices));
  }
  // Ensure paws_users contains pet owners with updated user@gmail.com credentials
  const existingUsers = localStorage.getItem("paws_users");
  if (!existingUsers) {
    localStorage.setItem("paws_users", JSON.stringify(PawsData.users));
  } else {
    try {
      const parsedUsers = JSON.parse(existingUsers);
      const filteredUsers = parsedUsers.filter(u => u.role !== "admin" && u.id !== "adm-01");
      const usr01 = filteredUsers.find(u => u.id === "usr-01");
      if (usr01) {
        usr01.email = "user@gmail.com";
        usr01.password = "1234";
      } else {
        filteredUsers.unshift(PawsData.users[0]);
      }
      localStorage.setItem("paws_users", JSON.stringify(filteredUsers));
    } catch (e) {
      localStorage.setItem("paws_users", JSON.stringify(PawsData.users));
    }
  }

  // Ensure default state is logged out unless actively logged in during this session
  if (!sessionStorage.getItem("paws_logged_in_this_session")) {
    localStorage.removeItem("paws_current_user");
    sessionStorage.removeItem("paws_current_user");
  }
}

// Auto-run on load
initializePawsDatabase();
