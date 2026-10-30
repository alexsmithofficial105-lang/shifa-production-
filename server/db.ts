import fs from 'node:fs';
import path from 'node:path';
import type { AppDatabase, TeamMember } from './types.ts';
import { hashPassword } from './auth.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const initialTeamSeed: TeamMember[] = [
  {
    id: 'team-owner-1',
    name: 'Umair Wyne',
    roleType: 'owner',
    title: 'Founder & Studio Owner',
    bio: 'Visionary filmmaker and founder of Shifa Productions. Dedicated to producing theatrical-grade Pakistani cinema, high-impact commercials, and regal wedding films with cutting-edge cinema technology.',
    photo: '/images/hero_cinematic_production_1793180767552.jpg',
    email: 'umairwyc@gmail.com',
    phone: '+92 300 8492026',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    displayOrder: 1,
  },
  {
    id: 'team-ceo-1',
    name: 'Shifa Ur Rehman',
    roleType: 'ceo',
    title: 'Chief Executive Officer (CEO)',
    bio: 'Leads executive studio operations, director-level client commissions, and production strategy across Lahore, Karachi, and Islamabad studio branches with an obsessive focus on cinematic precision.',
    photo: '/images/commercial_film_set_1793180800619.jpg',
    email: 'shifaproductions.pk@gmail.com',
    phone: '+92 300 8492026',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    displayOrder: 2,
  },
  {
    id: 'team-member-1',
    name: 'Bilal Ahmad',
    roleType: 'team_member',
    title: 'Director of Photography (DoP)',
    bio: 'Master of ARRI & RED 8K cinema packages, anamorphic lens flares, and bespoke lighting architecture. Specializes in luxury wedding cinema and narrative brand commercials.',
    photo: '/images/wedding_cinematography_1793180783307.jpg',
    email: 'bilal.dop@shifaproductions.pk',
    phone: '+92 300 8492026',
    instagram: 'https://instagram.com',
    displayOrder: 3,
  },
  {
    id: 'team-member-2',
    name: 'Hamza Tariq',
    roleType: 'team_member',
    title: 'Lead Aerial & Drone Cinematographer',
    bio: 'Certified DJI Inspire 3 & FPV drone pilot. Captures sweeping 8K aerial vistas, royal venue reveals, and dynamic chase sequences across Pakistan.',
    photo: '/images/drone_videography_1793180816827.jpg',
    email: 'hamza.aerial@shifaproductions.pk',
    phone: '+92 300 8492026',
    displayOrder: 4,
  },
  {
    id: 'team-member-3',
    name: 'Ayesha Nadeem',
    roleType: 'team_member',
    title: 'Senior Colorist & Post-Production Supervisor',
    bio: 'DaVinci Resolve certified colorist bringing theatrical tone curves, skin tone perfection, and film-emulation color grades to all Shifa Productions master deliverables.',
    photo: '/images/commercial_film_set_1793180800619.jpg',
    email: 'ayesha.post@shifaproductions.pk',
    displayOrder: 5,
  },
];

function getInitialData(): AppDatabase {
  const adminAuth = hashPassword('ShifaAdmin2026!');

  return {
    settings: {
      brandName: 'Shifa Productions',
      tagline: 'Turning Your Vision Into Reality',
      phone: '+92 300 8492026',
      whatsapp: '+92 300 8492026',
      email: 'contact@shifaproductions.pk',
      addressLahore: 'Executive Studio 4B, M.M. Alam Road, Gulberg III, Lahore, Pakistan',
      addressIslamabad: 'Creative Suite 12, Executive Heights, F-7 Markaz, Islamabad, Pakistan',
      socials: {
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        vimeo: 'https://vimeo.com',
        facebook: 'https://facebook.com',
        linkedin: 'https://linkedin.com',
      },
      hero: {
        heading: 'Turning Your Vision Into Reality.',
        subheading: 'Creative storytelling. Professional production. Powerful visual experiences tailored for Pakistan’s leading brands, regal weddings, and ambitious visionaries.',
        bgImage: '/images/hero_cinematic_production_1793180767552.jpg',
      },
      about: {
        title: 'Cinematic Storytelling Born in Pakistan',
        story: 'Founded with an obsessive dedication to visual mastery, Shifa Productions is a full-spectrum film and visual arts production house based in Lahore and Islamabad. We engineer compelling narrative films, regal wedding cinema, high-impact commercials, and dynamic short-form content with state-of-the-art cinema equipment and seasoned industry veterans.',
        experienceYears: '10+',
        completedProjects: '450+',
        filmmakersCount: '18',
        cinematicVision: 'We believe every frame should evoke emotion, command attention, and honor the essence of our clients’ stories. From heritage haveli celebrations to multinational television commercials, our work is defined by precision, grandeur, and cinematic intimacy.',
      },
      seo: {
        metaTitle: 'Shifa Productions | Premier Pakistani Film & Cinematography Agency',
        metaDescription: 'High-end wedding films, commercial brand cinema, corporate films, and drone videography across Lahore, Karachi, Islamabad, and nationwide.',
        keywords: 'production house pakistan, wedding cinematography lahore, commercial film maker karachi, drone videography islamabad, video production pakistan',
      },
    },
    services: [
      {
        id: 'srv-1',
        slug: 'video-production',
        title: 'Video Production',
        shortDesc: 'End-to-end cinema production from script development and storyboarding to on-set execution and master delivery.',
        fullDesc: 'Our flagship full-scale video production service delivers broadcast and theatrical grade productions. We manage every nuance: creative direction, talent casting, location scouting across Pakistan, full lighting design, and precision camera operation.',
        iconName: 'Clapperboard',
        image: '/images/hero_cinematic_production_1793180767552.jpg',
        features: ['Creative scriptwriting & concept art', 'Cinema camera packages (ARRI & RED)', 'Full grip & gaffer lighting package', 'Professional audio capture on set'],
        deliverables: ['Theatrical 4K master file', 'Web & broadcast compression masters', 'Behind-the-scenes documentary cut'],
        startingPricePkr: '350,000',
        turnaroundTime: '3-4 weeks',
        displayOrder: 1,
      },
      {
        id: 'srv-2',
        slug: 'commercial-brand-films',
        title: 'Commercial & Brand Films',
        shortDesc: 'Compelling high-concept brand commercials designed to drive consumer engagement and brand prestige.',
        fullDesc: 'We craft cinematic advertisements and digital brand campaigns for top FMCG, fashion, real estate, and tech enterprises in Pakistan. Our commercial films blend emotional resonance with visual polish.',
        iconName: 'Film',
        image: '/images/portfolio_commercial_brand_1793180768486.jpg',
        features: ['Brand narrative development', 'High-end studio & location shoots', 'High-speed robotic arm movements', 'Color grading and sound design'],
        deliverables: ['60-second Brand Master', '30-second TVC cut', '15-second social ad cuts with vertical 9:16 aspect ratios'],
        startingPricePkr: '450,000',
        turnaroundTime: '2-3 weeks',
        displayOrder: 2,
      },
      {
        id: 'srv-3',
        slug: 'wedding-films-photography',
        title: 'Wedding Films & Photography',
        shortDesc: 'Regal, emotionally rich wedding cinematography capturing royal Pakistani celebrations with cinematic grandeur.',
        fullDesc: 'Pakistani weddings are grand tapestries of culture, love, and vibrant heritage. Shifa Productions specializes in timeless wedding films—from intimate Nikkah ceremonies to majestic Barat and Walima receptions with signature golden-hour lighting.',
        iconName: 'Sparkles',
        image: '/images/portfolio_pakistani_wedding_1793180768110.jpg',
        features: ['Multi-camera cinema crew (up to 8 operators)', 'Same-Day Edit (SDE) teaser screening', 'Bride & Groom dedicated cinematic portraits', 'Full ceremony audio capture with wireless lavs'],
        deliverables: ['3-5 minute Cinematic Wedding Highlight Film', '45-90 minute Full Documentary Feature', '1-minute Instagram Reel Teaser within 72 hours', 'Master high-resolution photo gallery'],
        startingPricePkr: '280,000',
        turnaroundTime: '3-5 weeks',
        displayOrder: 3,
      },
      {
        id: 'srv-4',
        slug: 'corporate-photography',
        title: 'Corporate Photography',
        shortDesc: 'Executive headshots, industrial facility imagery, and professional brand imagery for boardrooms and investor decks.',
        fullDesc: 'Elevate your enterprise presence with clean, magazine-grade corporate photography. We serve multinational corporations, financial institutions, and industry leaders across Karachi, Lahore, and Islamabad.',
        iconName: 'Briefcase',
        image: '/images/service_corporate_photo_1793272713821.jpg',
        features: ['Mobile studio setup at your corporate headquarters', 'Executive executive portraits with live tethering', 'Architectural and workplace environment coverage', 'Rapid next-day proofs selection'],
        deliverables: ['High-res retouched executive headshots', 'Workplace culture image bank', 'Print-ready annual report assets'],
        startingPricePkr: '150,000',
        turnaroundTime: '5-7 business days',
        displayOrder: 4,
      },
      {
        id: 'srv-5',
        slug: 'event-coverage',
        title: 'Event Coverage & Live Switching',
        shortDesc: 'Multi-camera live switching, conference documentation, and VIP gala coverage with real-time delivery.',
        fullDesc: 'Comprehensive coverage for international summits, tech conferences, government forums, fashion shows, and gala dinners. We deploy multi-cam rigs with seamless live broadcast streaming.',
        iconName: 'Calendar',
        image: '/images/service_event_coverage_1793272755046.jpg',
        features: ['Multi-cam HD/4K setup with live vision switcher', 'Real-time social media clip dispatch team', 'Professional audio mixing from house PA', 'Post-event highlight sizzle reel'],
        deliverables: ['Same-day social media summary reel', 'Full unedited event archive', 'Master 3-minute executive highlight film'],
        startingPricePkr: '200,000',
        turnaroundTime: '48 hours for teaser',
        displayOrder: 5,
      },
      {
        id: 'srv-6',
        slug: 'product-photography-videography',
        title: 'Product Photography & Videography',
        shortDesc: 'Crisp studio photography and dynamic 360 macro video for e-commerce, luxury packaging, and retail.',
        fullDesc: 'Highlight every curve, texture, and label with studio-grade tabletop cinematography. Perfect for cosmetics, lawn collections, jewelry, gourmet food, and tech gadgets.',
        iconName: 'Package',
        image: '/images/service_product_macro_1793272771275.jpg',
        features: ['Turntable 360-degree high-speed video capture', 'Macro lens detailing & focus stacking', 'Styling props and custom backdrops', 'E-commerce white-background and editorial shots'],
        deliverables: ['Web-optimized e-commerce gallery images', 'Amazon/Shopify compliant shots', 'Short video loops for ad campaigns'],
        startingPricePkr: '120,000',
        turnaroundTime: '5-7 business days',
        displayOrder: 6,
      },
      {
        id: 'srv-7',
        slug: 'music-videos',
        title: 'Music Videos',
        shortDesc: 'Stylized, visionary music videos with avant-garde visual concepts, stylized color grades, and artistic choreography.',
        fullDesc: 'Collaborating with Pakistan’s top vocalists and independent music producers, we build hypnotic visual narratives that amplify the soul of each track.',
        iconName: 'Music',
        image: '/images/service_music_video_1793272730439.jpg',
        features: ['Narrative & performance script development', 'Special effects & atmospheric lighting', 'Anamorphic cinema optics', 'Dynamic dance and rhythm editing'],
        deliverables: ['Official 4K Music Video Master', 'Vertical TikTok / Reels acoustic clips', 'Cover artwork and promotional posters'],
        startingPricePkr: '500,000',
        turnaroundTime: '3-4 weeks',
        displayOrder: 7,
      },
      {
        id: 'srv-8',
        slug: 'social-media-content-creation',
        title: 'Social Media Content Creation',
        shortDesc: 'High-frequency, thumb-stopping digital content packages designed for Instagram, TikTok, and LinkedIn.',
        fullDesc: 'Monthly retainer production that keeps your brand feed vibrant and trend-forward. We shoot batch content days to supply 30 days of high-retention video.',
        iconName: 'Share2',
        image: '/images/service_short_form_1793272788120.jpg',
        features: ['Monthly content strategy & trend research', '1-2 shooting days per month', 'Native vertical format 9:16 cinematography', 'Subtitles and motion typography overlays'],
        deliverables: ['12-20 ready-to-publish short-form videos', 'Captions & hashtag strategy notes', 'High-res thumbnail stills'],
        startingPricePkr: '180,000 / mo',
        turnaroundTime: 'Continuous weekly delivery',
        displayOrder: 8,
      },
      {
        id: 'srv-9',
        slug: 'documentary-production',
        title: 'Documentary Production',
        shortDesc: 'Deep investigative and human-interest documentaries with rich interviews and cinematic verité cinematography.',
        fullDesc: 'From NGO impact stories and environmental conservation to historical heritage profiles, our documentaries capture profound human truths across all provinces of Pakistan.',
        iconName: 'Tv',
        image: '/images/hero_cinematic_production_1793180767552.jpg',
        features: ['Comprehensive field research & subject interviews', 'Remote location production agility', 'Archive restoration & archival licensing', 'Bilingual Urdu and English subtitling'],
        deliverables: ['Long-form master documentary', 'Festival submission DCP package', 'Short-form trailer and teaser package'],
        startingPricePkr: '600,000',
        turnaroundTime: '6-8 weeks',
        displayOrder: 9,
      },
      {
        id: 'srv-10',
        slug: 'video-editing-post-production',
        title: 'Video Editing & Post-Production',
        shortDesc: 'Precision DaVinci Resolve color grading, dynamic sound design, audio sweetening, and clean visual effects.',
        fullDesc: 'Already have raw footage? Bring it to our post-production suite. We craft sharp editorial pacing, Hollywood-grade color science, Foley sound effects, and clean graphics.',
        iconName: 'Sliders',
        image: '/images/service_post_production_1793272697571.jpg',
        features: ['Industry standard DaVinci Resolve color grading', 'Audio restoration, denoising, and 5.1 mixing', 'Motion graphics, lower thirds, and titles', 'VFX cleanup and object removal'],
        deliverables: ['ProRes 4444 Master Export', 'Web and social deliverables in all aspect ratios'],
        startingPricePkr: '90,000',
        turnaroundTime: '3-5 business days',
        displayOrder: 10,
      },
      {
        id: 'srv-11',
        slug: 'drone-videography',
        title: 'Drone Videography & Aerial Cinematography',
        shortDesc: 'Licensed, breathtaking 5.1K aerial perspectives capturing Pakistan’s vast landscapes, real estate, and events.',
        fullDesc: 'Experience Pakistan from above with smooth cinematic sweeping aerials. Our certified drone pilots navigate complex urban skylines and rugged northern territories safely.',
        iconName: 'Compass',
        image: '/images/portfolio_drone_aerial_1793180768666.jpg',
        features: ['DJI Inspire 3 & Mavic 3 Cine cinema drones', 'Apple ProRes 5.1K aerial recording', 'CAA Pakistan regulatory compliant operations', 'Dual-operator rig (independent pilot + gimbal operator)'],
        deliverables: ['Uncompressed raw ProRes aerial reels', 'Color graded aerial master sequences'],
        startingPricePkr: '110,000',
        turnaroundTime: '48 hours',
        displayOrder: 11,
      },
      {
        id: 'srv-12',
        slug: 'reels-short-form-videos',
        title: 'Reels & Short-Form Videos',
        shortDesc: 'Punchy 15-45 second cinematic hooks designed for rapid viral reach and high user retention.',
        fullDesc: 'We condense high-end film techniques into lightning-fast vertical formats. Ideal for luxury restaurant launches, fashion designers, real estate tours, and thought leaders.',
        iconName: 'Smartphone',
        image: '/images/service_short_form_1793272788120.jpg',
        features: ['Dynamic pacing optimized for 3-second retention', 'Custom sound design drops and beat-matched cuts', 'Kinetic typography and subtle sound effects', 'Platform-specific color grading'],
        deliverables: ['Batch of 5 cinematic vertical reels', 'Hook-tested alternate variations'],
        startingPricePkr: '80,000',
        turnaroundTime: '3 business days',
        displayOrder: 12,
      },
    ],
    portfolio: [
      {
        id: 'port-1',
        title: 'The Royal Haveli Wedding – Lahore',
        category: 'Weddings',
        client: 'Zahra & Daniyal',
        location: 'Old City Haveli, Lahore',
        description: 'An enchanting 3-day royal Pakistani celebration celebrating classical Mughal romance with candlelit courtyards, antique gold bridal couture, and timeless emotion.',
        image: '/images/portfolio_pakistani_wedding_1793180768110.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        year: '2026',
        gearUsed: 'ARRI Alexa Mini LF, Master Anamorphic Lenses, DJI Ronin 2, Astera Titan Tubes',
        deliverables: ['5-Minute Cinematic Film', '60-Minute Documentary Cut', 'Vertical Teaser', '800 Retouched Stills'],
        isFeatured: true,
      },
      {
        id: 'port-2',
        title: 'Oud Al-Miraj Luxury Fragrance Commercial',
        category: 'Commercials',
        client: 'Al-Miraj Parfums',
        location: 'Islamabad Studio 1',
        description: 'A dark, brooding, and opulent commercial film highlighting the rare raw oud distillation and the handcrafted crystal bottle. Commissioned for national broadcast.',
        image: '/images/portfolio_commercial_brand_1793180768486.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        year: '2026',
        gearUsed: 'Phantom Flex 4K High-Speed, RED V-Raptor 8K, Robotic Cine Arm, Aputure 1200d Pro',
        deliverables: ['60s Brand Film', '30s TVC Cut', '15s Social Cutdowns'],
        isFeatured: true,
      },
      {
        id: 'port-3',
        title: 'Heritage of Lahore – 8K Aerial Expedition',
        category: 'Cinematic Films',
        client: 'Punjab Tourism Development Corporation',
        location: 'Lahore, Punjab',
        description: 'A majestic aerial tribute capturing the Badshahi Mosque, Lahore Fort, and the walled city as twilight descends and warm historic street lanterns illuminate.',
        image: '/images/portfolio_drone_aerial_1793180768666.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        year: '2026',
        gearUsed: 'DJI Inspire 3, Zenmuse X9-8K Air, DL 18mm F2.8 Cinema Lens',
        deliverables: ['4-Minute 8K Aerial Masterpiece', 'Stock Archive Library in ProRes 4444'],
        isFeatured: true,
      },
      {
        id: 'port-4',
        title: 'Chiniot Artisan Legacy Documentary',
        category: 'Cinematic Films',
        client: 'National Heritage Foundation',
        location: 'Chiniot, Punjab',
        description: 'A deep, intimate 18-minute visual essay documenting master woodcarvers continuing four generations of handcrafted rosewood furniture traditions.',
        image: '/images/hero_cinematic_production_1793180767552.jpg',
        year: '2025',
        gearUsed: 'Sony FX6, Cooke Anamorphic/i Lenses, Sennheiser MKH 416',
        deliverables: ['18-Minute Festival Documentary', 'Teaser Trailer', 'Archival Photo Book'],
        isFeatured: true,
      },
    ],
    packages: [
      {
        id: 'pkg-1',
        name: 'Essential Package',
        tagline: 'Ideal for single-event coverage, executive corporate interviews, or entry-tier promotional campaigns.',
        pricePkr: '175,000',
        isCustomQuote: false,
        duration: 'Up to 6 Hours on Set',
        crewSize: '2 Cinematographers + 1 Sound Operator',
        includedServices: [
          'Dual Sony FX cinema camera setup in 4K',
          'Professional wireless lavalier audio capture',
          'Portable LED light kit with softboxes',
          'Director & DP on set',
        ],
        deliverables: [
          '3-minute edited highlight reel with licensed cinema music',
          'Full ceremony or interview unedited archive',
          '1 vertical teaser reel for social media (within 72 hours)',
          'Two rounds of client revisions',
        ],
        optionalAddons: ['Licensed Drone Aerial Footage (+PKR 45,000)', 'Additional Shooting Hour (+PKR 25,000/hr)'],
      },
      {
        id: 'pkg-2',
        name: 'Professional Package',
        tagline: 'Our most popular comprehensive tier for multi-day weddings, high-impact corporate summits, and brand films.',
        pricePkr: '380,000',
        isCustomQuote: false,
        duration: 'Full Day Coverage (Up to 12 Hours)',
        crewSize: '4 Cinematographers + 1 Drone Pilot + 1 Lead Audio Engineer',
        isPopular: true,
        includedServices: [
          'Multi-cam RED / Sony FX cinema package in 4K/6K',
          'Licensed 4K drone aerial cinematography',
          'Steadicam / motorized 3-axis gimbal rig',
          'Full cinema lighting gaffer truck on location',
          'Same-Day Edit (SDE) teaser preparation',
        ],
        deliverables: [
          '5-7 minute Signature Cinematic Highlight Film',
          '45-75 minute Full Documentary Feature Edit',
          '3 custom vertical reels for Instagram & TikTok',
          'Delivery in luxury engraved wooden USB box + private cloud link',
          'Three rounds of client revisions',
        ],
        optionalAddons: ['High-speed Phantom 4K slow-motion add-on (+PKR 120,000)', 'Second Day Coverage Discounted rate'],
      },
      {
        id: 'pkg-3',
        name: 'Premium Cinematic Package',
        tagline: 'Uncompromising theatrical-level cinematography with top-tier anamorphic lenses and dedicated post-production team.',
        pricePkr: '750,000',
        isCustomQuote: false,
        duration: 'Multi-Day / Unlimited Shoot Duration',
        crewSize: 'Full Film Crew (8-10 Specialists including Director, DP, Gaffer, Sound & Drone)',
        includedServices: [
          'ARRI Alexa Mini LF / RED V-Raptor dual cinema package',
          'Master Anamorphic prime lenses with signature oval bokeh',
          'Dual-operator DJI Inspire 3 aerial drone team',
          'Dedicated creative director and narrative scriptwriter',
          'Hollywood-grade DaVinci Resolve color grading & custom sound design',
        ],
        deliverables: [
          'Theatrical 10-12 minute Masterpiece Film in 4K HDR',
          'Feature-length 90-minute multicam film',
          '5 tailored high-engagement vertical cuts',
          'Same-Day Edit (SDE) live screening for guests on set',
          'Master hard drive delivery + 10-year private cloud vault backup',
        ],
        optionalAddons: ['Celebrity cameo coordination', 'Film festival submission packaging'],
      },
      {
        id: 'pkg-4',
        name: 'Royal Bespoke Production',
        tagline: 'Customized luxury production designed for multinational brand campaigns, feature films, and grand estate weddings.',
        pricePkr: 'Request a Quote',
        isCustomQuote: true,
        duration: 'Custom Schedule Across Multiple Cities',
        crewSize: 'Tailored Full Cinema Unit',
        includedServices: [
          'Custom location scouting across Pakistan or internationally',
          'Pre-production storyboarding, casting, and wardrobe styling',
          'Techno-crane, robotic camera arms, and high-speed motion control',
          'Private client portal with daily live rushes review',
        ],
        deliverables: [
          'Custom deliverables specified by agency brief',
          'Worldwide perpetual commercial licensing',
          'Raw uncompressed footage archive in ProRes 4444',
        ],
        optionalAddons: ['Original orchestrated musical score', 'Celebrity talent procurement'],
      },
    ],
    testimonials: [
      {
        id: 'test-1',
        clientName: 'Hamza & Ayesha Malik',
        roleOrBrand: 'Wedding Clients',
        city: 'Lahore',
        rating: 5,
        reviewText: 'Shifa Productions delivered a wedding film that made our entire family weep with joy. The colors, the drone shots over the Old City, and the intimate moments they captured felt like a movie premiering on Netflix.',
        projectType: 'Regal Wedding Film',
        isVerifiedCustomer: true,
        date: 'October 2026',
      },
      {
        id: 'test-2',
        clientName: 'Kamran Siddiqui',
        roleOrBrand: 'Head of Brand Marketing, Apex Textiles',
        city: 'Karachi',
        rating: 5,
        reviewText: 'The commercial Shifa Productions shot for our summer luxury lawn campaign shattered all our previous engagement records. Their crew was impeccably disciplined, punctual, and operated true cinema equipment.',
        projectType: 'Commercial Campaign',
        isVerifiedCustomer: true,
        date: 'September 2026',
      },
      {
        id: 'test-3',
        clientName: 'Dr. Sarah Farooq',
        roleOrBrand: 'Managing Director, Horizon Healthcare',
        city: 'Islamabad',
        rating: 5,
        reviewText: 'Professional, courteous, and profoundly creative. They produced our corporate hospital documentary with immense dignity and stunning visual clarity. Highest recommendation in Islamabad.',
        projectType: 'Corporate Documentary',
        isVerifiedCustomer: true,
        date: 'August 2026',
      },
    ],
    faqs: [
      {
        id: 'faq-1',
        question: 'Which cities across Pakistan do you cover?',
        answer: 'While our primary production offices and studio facilities are in Lahore (Gulberg III) and Islamabad (F-7), we regularly travel and deploy full cinema crews nationwide, including Karachi, Rawalpindi, Faisalabad, Multan, Peshawar, Sialkot, and northern destinations (Hunza, Skardu). Travel and logistics are transparently itemized.',
        category: 'General',
      },
      {
        id: 'faq-2',
        question: 'What is your payment and booking deposit structure?',
        answer: 'To reserve your production date on our calendar, we require a 50% advance booking deposit in Pakistani Rupees (PKR) via official bank transfer. 30% is due on the primary shoot date, and the remaining 20% balance is settled upon delivery of the final master approval.',
        category: 'Pricing',
      },
      {
        id: 'faq-3',
        question: 'How long does post-production and editing take?',
        answer: 'For wedding cinema and commercial films, our clients receive an initial vertical social media teaser within 72 hours to 7 days. Full documentary and signature highlight films are meticulously color-graded and delivered within 3 to 5 weeks.',
        category: 'Production',
      },
      {
        id: 'faq-4',
        question: 'What cinema equipment and camera systems do you operate?',
        answer: 'We own and deploy tier-one cinema ecosystems: ARRI Alexa Mini LF, RED V-Raptor 8K, Sony FX6 / FX3 cinema line, Master Anamorphic and Cooke prime lenses, DJI Inspire 3 8K drones, Aputure / Nanlite gaffer lighting, and professional wireless Sennheiser / Sound Devices audio.',
        category: 'Equipment',
      },
      {
        id: 'faq-5',
        question: 'Do you obtain drone flight clearances in Pakistan?',
        answer: 'Yes. Our drone pilots are certified and we handle necessary civil aviation and regional security permissions for commercial and wedding drone operations across Pakistani cities.',
        category: 'Equipment',
      },
    ],
    inquiries: [
      {
        id: 'inq-101',
        fullName: 'Bilal Chaudhry',
        phoneNumber: '+92 321 8849201',
        email: 'bilal.chaudhry@apextech.com.pk',
        city: 'Lahore',
        requiredService: 'Commercial & Brand Films',
        projectDescription: 'We are launching our new consumer fintech app in Pakistan and require a high-energy 60-second commercial film plus 4 vertical shorts. Need shooting in Gulberg and DHA Phase 6.',
        preferredDate: '2026-11-20',
        estimatedBudget: 'PKR 500,000 - 1,000,000',
        preferredContactMethod: 'whatsapp',
        status: 'In Discussion',
        internalNotes: 'Client sent storyboard pitch deck. Meeting scheduled at Lahore studio this Thursday.',
        createdAt: '2026-10-25T14:22:00.000Z',
        updatedAt: '2026-10-26T10:15:00.000Z',
      },
      {
        id: 'inq-102',
        fullName: 'Mahnoor Tariq',
        phoneNumber: '+92 300 5543119',
        email: 'mahnoor.tariq@gmail.com',
        city: 'Islamabad',
        requiredService: 'Wedding Films & Photography',
        projectDescription: '3-day wedding celebration (Mehndi, Barat, Walima) in Islamabad and Rawalpindi. We want full anamorphic cinematography and same-day teaser edit for guests.',
        preferredDate: '2026-12-15',
        estimatedBudget: 'PKR 750,000 - 1,500,000',
        preferredContactMethod: 'phone',
        status: 'New',
        internalNotes: '',
        createdAt: '2026-10-27T09:40:00.000Z',
        updatedAt: '2026-10-27T09:40:00.000Z',
      },
    ],
    admin: {
      id: 'admin-1',
      username: 'Shifa Productions Admin',
      email: 'shifaproductions.pk@gmail.com',
      passwordHash: adminAuth.hash,
      salt: adminAuth.salt,
      createdAt: new Date().toISOString(),
    },
    team: initialTeamSeed,
  };
}

let cachedDb: AppDatabase | null = null;

export function getDb(): AppDatabase {
  if (cachedDb) {
    if (!cachedDb.team || cachedDb.team.length === 0) {
      cachedDb.team = initialTeamSeed;
      try {
        saveDb(cachedDb);
      } catch {
        // ignore
      }
    }
    return cachedDb;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDb = JSON.parse(content);
      if (!cachedDb!.team || cachedDb!.team.length === 0) {
        cachedDb!.team = initialTeamSeed;
        saveDb(cachedDb!);
      }
      return cachedDb!;
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }

  // Seed initial data
  const initial = getInitialData();
  saveDb(initial);
  return initial;
}

export function saveDb(db: AppDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    cachedDb = db;
  } catch (err) {
    console.error('Error saving db.json:', err);
    throw err;
  }
}
