export const CLINIC_INFO = {
  name: 'Nairobi Skin Centre',
  phone: '+254 (0)20 2720 100',
  email: 'info@nairobiskincentre.co.ke',
  address: 'Hurlingham, Nairobi, Kenya',
  hours: {
    weekday: '8:00 AM - 6:00 PM',
    saturday: '9:00 AM - 4:00 PM',
    sunday: 'Closed',
  },
};

export const SERVICES = [
  {
    id: 'acne',
    title: 'Acne Treatment',
    description: 'Advanced treatments for acne and acne scars including laser therapy and chemical peels.',
    icon: 'Zap',
  },
  {
    id: 'aging',
    title: 'Anti-Aging',
    description: 'Combat signs of aging with dermal fillers, botox, and advanced skincare protocols.',
    icon: 'Activity',
  },
  {
    id: 'pigmentation',
    title: 'Pigmentation',
    description: 'Treat hyperpigmentation, melasma, and uneven skin tone with specialized therapies.',
    icon: 'Sun',
  },
  {
    id: 'hair-loss',
    title: 'Hair Loss Treatment',
    description: 'Comprehensive solutions for hair loss including PRP therapy and medication.',
    icon: 'Wind',
  },
  {
    id: 'laser',
    title: 'Laser Treatments',
    description: 'State-of-the-art laser technology for skin rejuvenation and hair removal.',
    icon: 'Sparkles',
  },
  {
    id: 'eczema',
    title: 'Eczema & Dermatitis',
    description: 'Specialized care for sensitive skin conditions and dermatological diseases.',
    icon: 'Shield',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Kipchoge',
    role: 'Patient',
    text: 'The AI skin analysis was incredibly accurate. The treatment plan was tailored perfectly to my needs. Highly recommended!',
    avatar: 'SK',
  },
  {
    id: 2,
    name: 'James Mwangi',
    role: 'Patient',
    text: 'Professional staff, state-of-the-art equipment, and results that exceed expectations. Best dermatology clinic in Nairobi.',
    avatar: 'JM',
  },
  {
    id: 3,
    name: 'Grace Okonkwo',
    role: 'Patient',
    text: 'The combination of technology and expert doctors made my treatment journey smooth and effective.',
    avatar: 'GO',
  },
];

export const FAQ = [
  {
    question: 'How does the AI skin analysis work?',
    answer:
      'Our AI technology analyzes high-resolution images of your skin to identify concerns, determine skin type, and recommend personalized treatment options. Results are reviewed by our dermatologists before any treatment plan is created.',
  },
  {
    question: 'What is the cost of a consultation?',
    answer: 'Initial consultations are KES 2,500. This includes a thorough skin assessment and personalized recommendations. AI analysis is included at no additional cost.',
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'Yes, we offer flexible payment plans for major treatments. Contact our office to discuss options that work for your budget.',
  },
  {
    question: 'How long do results typically take to show?',
    answer: 'Results vary by treatment type. Some treatments show improvement within 2-4 weeks, while others may take 8-12 weeks. Your doctor will provide a detailed timeline during your consultation.',
  },
  {
    question: 'Are your doctors qualified dermatologists?',
    answer: 'All our doctors are board-certified dermatologists with extensive experience in cosmetic and medical dermatology.',
  },
  {
    question: 'Can I book appointments online?',
    answer: 'Yes, you can book appointments through our patient portal or by calling us directly. We offer flexible scheduling to accommodate your needs.',
  },
];

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
} as const;

export const APPOINTMENT_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;
