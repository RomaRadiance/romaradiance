insert into public.site_settings (id, gallery_enabled, phone, whatsapp, address, hours)
values (
  1,
  false,
  '9717195965',
  '9717195965',
  'Phone-first local tuition support',
  'Mon-Fri'
)
on conflict (id) do update
set gallery_enabled = excluded.gallery_enabled,
    phone = excluded.phone,
    whatsapp = excluded.whatsapp,
    address = excluded.address,
    hours = excluded.hours;

insert into public.site_content (
  id,
  hero_title_en,
  hero_title_hi,
  hero_subtitle_en,
  hero_subtitle_hi,
  hero_primary_cta_label_en,
  hero_primary_cta_label_hi,
  hero_secondary_cta_label_en,
  hero_secondary_cta_label_hi,
  about_intro_en,
  about_intro_hi,
  teaching_style_en,
  teaching_style_hi,
  contact_heading_en,
  contact_heading_hi,
  contact_text_en,
  contact_text_hi,
  gallery_teaser_title_en,
  gallery_teaser_title_hi,
  gallery_teaser_text_en,
  gallery_teaser_text_hi
)
values (
  1,
  'Fun learning with caring guidance',
  'मज़ेदार पढ़ाई और भरोसेमंद मार्गदर्शन',
  'Roma Tuition helps young learners build confidence through clear explanations, regular practice, and a cheerful classroom rhythm.',
  'Roma Tuition में बच्चों को आसान समझाइश, नियमित अभ्यास और खुशहाल पढ़ाई के माहौल से आत्मविश्वास मिलता है।',
  'Call now',
  'अभी कॉल करें',
  'Learn more',
  'और जानें',
  'Teacher Roma offers phone-first, trust-building tuition support for primary and middle-school learners, with a focus on clear concepts and encouraging routines.',
  'Teacher Roma छोटे और मिडिल स्कूल के बच्चों के लिए भरोसेमंद tuition support देती हैं, जहाँ साफ समझ और नियमित अभ्यास पर ध्यान रहता है।',
  'Classes combine revision, guided homework help, handwriting support, and child-friendly explanation styles that keep children engaged without pressure.',
  'क्लासों में revision, guided homework help, handwriting support और बच्चों को सहज लगे ऐसी teaching style शामिल रहती है।',
  'Talk directly with Teacher Roma',
  'Teacher Roma से सीधे बात करें',
  'Call for batch timings, class details, and a quick conversation about what support your child needs right now.',
  'बैच टाइमिंग, क्लास की जानकारी और आपके बच्चे को अभी किस मदद की ज़रूरत है, इस बारे में बात करने के लिए कॉल करें।',
  'Private parent gallery',
  'माता-पिता के लिए निजी gallery',
  'The gallery is available only to invited parents and may be turned on or off by the admin at different times.',
  'Gallery केवल invited parents के लिए है और admin इसे अलग-अलग समय पर चालू या बंद कर सकता है।'
)
on conflict (id) do update
set hero_title_en = excluded.hero_title_en,
    hero_title_hi = excluded.hero_title_hi,
    hero_subtitle_en = excluded.hero_subtitle_en,
    hero_subtitle_hi = excluded.hero_subtitle_hi,
    hero_primary_cta_label_en = excluded.hero_primary_cta_label_en,
    hero_primary_cta_label_hi = excluded.hero_primary_cta_label_hi,
    hero_secondary_cta_label_en = excluded.hero_secondary_cta_label_en,
    hero_secondary_cta_label_hi = excluded.hero_secondary_cta_label_hi,
    about_intro_en = excluded.about_intro_en,
    about_intro_hi = excluded.about_intro_hi,
    teaching_style_en = excluded.teaching_style_en,
    teaching_style_hi = excluded.teaching_style_hi,
    contact_heading_en = excluded.contact_heading_en,
    contact_heading_hi = excluded.contact_heading_hi,
    contact_text_en = excluded.contact_text_en,
    contact_text_hi = excluded.contact_text_hi,
    gallery_teaser_title_en = excluded.gallery_teaser_title_en,
    gallery_teaser_title_hi = excluded.gallery_teaser_title_hi,
    gallery_teaser_text_en = excluded.gallery_teaser_text_en,
    gallery_teaser_text_hi = excluded.gallery_teaser_text_hi;

insert into public.offerings (id, title_en, title_hi, details_en, details_hi, schedule_en, schedule_hi, sort_order, active)
values
  ('11111111-1111-1111-1111-111111111111', 'Grades 1 to 5 • All subjects', 'कक्षा 1 से 5 • सभी विषय', 'Warm daily support across core school subjects for young learners.', 'छोटे बच्चों के लिए मुख्य स्कूल विषयों में नियमित सहयोग।', '5 days/week', 'सप्ताह में 5 दिन', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'Math and Science • Grades 6 to 8', 'Math और Science • कक्षा 6 से 8', 'Concept clarity, practice, and homework support for middle-school maths and science.', 'मिडिल स्कूल maths और science के लिए concept clarity और practice।', '5 days/week or alternate days', 'सप्ताह में 5 दिन या alternate days', 2, true),
  ('33333333-3333-3333-3333-333333333333', 'Sanskrit and Hindi', 'Sanskrit और Hindi', 'Focused language support with reading, writing, and schoolwork help.', 'भाषा सहायता, reading-writing और schoolwork help के साथ।', 'Alternate days', 'एक दिन छोड़कर', 3, true),
  ('44444444-4444-4444-4444-444444444444', 'Handwriting improvement', 'Handwriting improvement', 'Neat writing practice with guided strokes, spacing, and presentation.', 'साफ लिखावट के लिए guided practice और presentation support।', 'Weekends only', 'सिर्फ weekends', 4, true)
on conflict (id) do update
set title_en = excluded.title_en,
    title_hi = excluded.title_hi,
    details_en = excluded.details_en,
    details_hi = excluded.details_hi,
    schedule_en = excluded.schedule_en,
    schedule_hi = excluded.schedule_hi,
    sort_order = excluded.sort_order,
    active = excluded.active;

insert into public.why_choose_items (id, title_en, title_hi, description_en, description_hi, sort_order, active)
values
  ('55555555-5555-5555-5555-555555555555', 'Small-group personal attention', 'छोटे बैच और व्यक्तिगत ध्यान', 'Children get space to ask questions freely and build confidence with patient correction.', 'बच्चों को खुलकर सवाल पूछने और धैर्य से समझने का मौका मिलता है।', 1, true),
  ('66666666-6666-6666-6666-666666666666', 'Consistent routines', 'नियमित पढ़ाई का रूटीन', 'Steady revision, homework help, and practice keep school learning from piling up.', 'रोज़ का revision और practice बच्चों को पढ़ाई में steady रखता है।', 2, true),
  ('77777777-7777-7777-7777-777777777777', 'Child-friendly environment', 'बच्चों के लिए दोस्ताना माहौल', 'The tone stays cheerful, encouraging, and practical for primary and middle-school learners.', 'माहौल cheerful, encouraging और बच्चों के अनुकूल रखा जाता है।', 3, true)
on conflict (id) do update
set title_en = excluded.title_en,
    title_hi = excluded.title_hi,
    description_en = excluded.description_en,
    description_hi = excluded.description_hi,
    sort_order = excluded.sort_order,
    active = excluded.active;
