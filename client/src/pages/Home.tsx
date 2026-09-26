import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Globe2,
  Languages,
  MapPinned,
  Menu,
  Play,
  Sparkles,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

const appUrl = "https://aitourguidecreator.vercel.app/";

const experiences = [
  {
    number: "01",
    eyebrow: "The short escape",
    title: "One-hour adventures",
    description:
      "Turn a free hour between check-in and dinner into a story worth taking home.",
    tags: ["City walks", "Sunset routes", "Quick tastings"],
    accent: "coral",
  },
  {
    number: "02",
    eyebrow: "The local table",
    title: "Food tours",
    description:
      "Build a signature route around the ingredients, people, and places that define your destination.",
    tags: ["Markets", "Wine trails", "Chef-led"],
    accent: "mustard",
  },
  {
    number: "03",
    eyebrow: "The complete journey",
    title: "Four-day packages",
    description:
      "Shape a complete trip with a day-by-day rhythm, local flavour, and premium add-ons.",
    tags: ["Culture", "Nature", "Private travel"],
    accent: "blue",
  },
];

const workflow = [
  {
    step: "01",
    title: "Start with a spark",
    copy: "Choose a destination, audience, and experience style. Your local knowledge is the advantage.",
    icon: <Sparkles size={20} strokeWidth={1.7} />,
  },
  {
    step: "02",
    title: "Let AI shape the route",
    copy: "Generate a strong concept with a clear flow, inclusions, positioning, and a reason to book.",
    icon: <WandSparkles size={20} strokeWidth={1.7} />,
  },
  {
    step: "03",
    title: "Make it yours",
    copy: "Add your brand, adapt for international guests, and prepare a polished product to present.",
    icon: <ArrowUpRight size={20} strokeWidth={1.7} />,
  },
];

const tourPreviews = [
  {
    id: "food",
    label: "Food tour",
    kicker: "AI-generated itinerary",
    title: "Lisbon, one bite at a time",
    destination: "Lisbon · Portugal",
    duration: "3h 30m",
    group: "Up to 8 guests",
    language: "EN · PT · FR",
    description: "A market-to-table route through Alfama, built around family recipes, small producers, and stories that never make the guidebooks.",
    stops: ["Mercado da Figueira", "Pastel de nata workshop", "Hidden taverna tasting"],
    inclusions: ["6 tastings", "Local host", "Digital route card"],
    color: "#f7c95b",
  },
  {
    id: "adventure",
    label: "One-hour adventure",
    kicker: "AI-generated itinerary",
    title: "The city after golden hour",
    destination: "Dubai · UAE",
    duration: "1h",
    group: "Up to 6 guests",
    language: "EN · AR · DE",
    description: "A compact sunset discovery route for travellers between check-in and dinner, with skyline views, local legends, and one perfect photo stop.",
    stops: ["Old Souk stories", "Creek abra crossing", "Golden-hour viewpoint"],
    inclusions: ["Local guide", "Photo stops", "Welcome drink"],
    color: "#f3bbb0",
  },
  {
    id: "package",
    label: "Four-day package",
    kicker: "AI-generated itinerary",
    title: "Douro, slowly discovered",
    destination: "Douro Valley · Portugal",
    duration: "4 days",
    group: "Private journey",
    language: "EN · ES · IT",
    description: "A polished four-day escape that balances vineyard mornings, river landscapes, village kitchens, and unhurried local moments.",
    stops: ["Porto arrival", "Vineyard lunch", "River valley drive"],
    inclusions: ["Day-by-day flow", "Premium add-ons", "White-label PDF"],
    color: "#a8ccd0",
  },
];

const languageOptions = [
  { id: "en", label: "English", short: "EN", direction: "ltr" },
  { id: "pt", label: "Português", short: "PT", direction: "ltr" },
  { id: "es", label: "Español", short: "ES", direction: "ltr" },
  { id: "fr", label: "Français", short: "FR", direction: "ltr" },
  { id: "de", label: "Deutsch", short: "DE", direction: "ltr" },
  { id: "it", label: "Italiano", short: "IT", direction: "ltr" },
  { id: "ar", label: "العربية", short: "AR", direction: "rtl" },
] as const;

const previewLabels = {
  en: { live: "Live AI preview", preview: "Preview", duration: "Duration", format: "Format", languages: "Languages", flow: "Suggested flow", included: "Included in the concept", footer: "A starting point, not a blank page.", action: "Ready to make it yours ↗" },
  pt: { live: "Pré-visualização IA", preview: "Pré-visualizar", duration: "Duração", format: "Formato", languages: "Idiomas", flow: "Roteiro sugerido", included: "Incluído no conceito", footer: "Um ponto de partida, não uma página em branco.", action: "Pronto para personalizar ↗" },
  es: { live: "Vista previa con IA", preview: "Vista previa", duration: "Duración", format: "Formato", languages: "Idiomas", flow: "Ruta sugerida", included: "Incluido en el concepto", footer: "Un punto de partida, no una página en blanco.", action: "Listo para hacerlo tuyo ↗" },
  fr: { live: "Aperçu généré par IA", preview: "Aperçu", duration: "Durée", format: "Format", languages: "Langues", flow: "Parcours suggéré", included: "Inclus dans le concept", footer: "Un point de départ, pas une page blanche.", action: "Prêt à le personnaliser ↗" },
  de: { live: "KI-Vorschau", preview: "Vorschau", duration: "Dauer", format: "Format", languages: "Sprachen", flow: "Vorgeschlagene Route", included: "Im Konzept enthalten", footer: "Ein Ausgangspunkt, keine leere Seite.", action: "Jetzt personalisieren ↗" },
  it: { live: "Anteprima generata dall'IA", preview: "Anteprima", duration: "Durata", format: "Formato", languages: "Lingue", flow: "Itinerario suggerito", included: "Incluso nel concept", footer: "Un punto di partenza, non una pagina vuota.", action: "Pronto per personalizzarlo ↗" },
  ar: { live: "معاينة مباشرة بالذكاء الاصطناعي", preview: "معاينة", duration: "المدة", format: "النوع", languages: "اللغات", flow: "المسار المقترح", included: "المشمول في الفكرة", footer: "نقطة بداية، وليست صفحة فارغة.", action: "جاهز لتخصيصها ↗" },
} as const;
const siteCopy = {
  en: { navBuild: "What you can build", navHow: "How it works", navAudience: "Who it is for", signIn: "Sign in", start: "Start creating", badge: "The experience expansion studio", heroLine1: "Create bigger", heroLine2: "adventures.", heroLine3: "Sell more", heroLine4: "experiences.", heroDescription: "Turn destination knowledge into market-ready tours, food experiences, and multi-day journeys—with AI, your brand, and a faster way to grow.", heroCta: "Build your first tour", heroExplore: "See what you can build", previewTitle: "Preview the experience before you build it.", workflowTitle: "Your destination knowledge is the unfair advantage.", audienceTitle: "Local expertise. Global welcome.", finalTitle: "Your next best experience may already be in your head.", finalCta: "Start creating free" },
  pt: { navBuild: "O que pode criar", navHow: "Como funciona", navAudience: "Para quem é", signIn: "Entrar", start: "Começar a criar", badge: "O estúdio que expande experiências", heroLine1: "Crie aventuras", heroLine2: "maiores.", heroLine3: "Venda mais", heroLine4: "experiências.", heroDescription: "Transforme conhecimento local em tours, experiências gastronómicas e viagens de vários dias prontas para o mercado — com IA, a sua marca e uma forma mais rápida de crescer.", heroCta: "Crie o seu primeiro tour", heroExplore: "Veja o que pode criar", previewTitle: "Pré-visualize a experiência antes de a criar.", workflowTitle: "O seu conhecimento do destino é a sua vantagem.", audienceTitle: "Experiência local. Boas-vindas globais.", finalTitle: "A sua próxima grande experiência pode já estar na sua cabeça.", finalCta: "Começar gratuitamente" },
  es: { navBuild: "Qué puedes crear", navHow: "Cómo funciona", navAudience: "Para quién es", signIn: "Iniciar sesión", start: "Empezar a crear", badge: "El estudio que amplía experiencias", heroLine1: "Crea aventuras", heroLine2: "más grandes.", heroLine3: "Vende más", heroLine4: "experiencias.", heroDescription: "Convierte el conocimiento del destino en tours, experiencias gastronómicas y viajes de varios días listos para el mercado, con IA, tu marca y una forma más rápida de crecer.", heroCta: "Crea tu primer tour", heroExplore: "Descubre qué puedes crear", previewTitle: "Previsualiza la experiencia antes de crearla.", workflowTitle: "Tu conocimiento del destino es tu ventaja.", audienceTitle: "Experiencia local. Bienvenida global.", finalTitle: "Tu próxima gran experiencia puede estar ya en tu cabeza.", finalCta: "Empezar gratis" },
  fr: { navBuild: "Ce que vous pouvez créer", navHow: "Comment ça marche", navAudience: "Pour qui", signIn: "Se connecter", start: "Commencer à créer", badge: "Le studio qui amplifie les expériences", heroLine1: "Créez de plus", heroLine2: "grandes aventures.", heroLine3: "Vendez plus", heroLine4: "d'expériences.", heroDescription: "Transformez votre connaissance d'une destination en circuits, expériences culinaires et voyages de plusieurs jours prêts à être commercialisés, avec l'IA et votre marque.", heroCta: "Créer votre premier circuit", heroExplore: "Voir ce que vous pouvez créer", previewTitle: "Prévisualisez l'expérience avant de la créer.", workflowTitle: "Votre connaissance de la destination est votre avantage.", audienceTitle: "Expertise locale. Accueil mondial.", finalTitle: "Votre prochaine grande expérience est peut-être déjà dans votre tête.", finalCta: "Commencer gratuitement" },
  de: { navBuild: "Was Sie erstellen können", navHow: "So funktioniert es", navAudience: "Für wen es ist", signIn: "Anmelden", start: "Jetzt erstellen", badge: "Das Studio für größere Erlebnisse", heroLine1: "Größere", heroLine2: "Abenteuer schaffen.", heroLine3: "Mehr", heroLine4: "Erlebnisse verkaufen.", heroDescription: "Machen Sie aus Ihrem Ortswissen marktreife Touren, kulinarische Erlebnisse und mehrtägige Reisen – mit KI, Ihrer Marke und einem schnelleren Weg zum Wachstum.", heroCta: "Erste Tour erstellen", heroExplore: "Entdecken, was Sie erstellen können", previewTitle: "Erlebnis ansehen, bevor Sie es erstellen.", workflowTitle: "Ihr Wissen über das Reiseziel ist Ihr Vorteil.", audienceTitle: "Lokale Expertise. Weltweit willkommen.", finalTitle: "Ihr nächstes großes Erlebnis steckt vielleicht schon in Ihrem Kopf.", finalCta: "Kostenlos starten" },
  it: { navBuild: "Cosa puoi creare", navHow: "Come funziona", navAudience: "A chi è rivolto", signIn: "Accedi", start: "Inizia a creare", badge: "Lo studio che amplia le esperienze", heroLine1: "Crea avventure", heroLine2: "più grandi.", heroLine3: "Vendi più", heroLine4: "esperienze.", heroDescription: "Trasforma la conoscenza della destinazione in tour, esperienze gastronomiche e viaggi di più giorni pronti per il mercato, con l'IA e il tuo brand.", heroCta: "Crea il tuo primo tour", heroExplore: "Scopri cosa puoi creare", previewTitle: "Scopri l'esperienza prima di crearla.", workflowTitle: "La tua conoscenza della destinazione è il tuo vantaggio.", audienceTitle: "Competenza locale. Accoglienza globale.", finalTitle: "La tua prossima grande esperienza potrebbe essere già nella tua testa.", finalCta: "Inizia gratis" },
  ar: { navBuild: "ما يمكنك إنشاؤه", navHow: "كيف يعمل", navAudience: "لمن صُمم", signIn: "تسجيل الدخول", start: "ابدأ الإنشاء", badge: "استوديو توسيع التجارب", heroLine1: "اصنع مغامرات", heroLine2: "أكبر.", heroLine3: "وبِع المزيد من", heroLine4: "التجارب.", heroDescription: "حوّل معرفتك بالوجهة إلى جولات وتجارب طعام ورحلات متعددة الأيام جاهزة للسوق، مع الذكاء الاصطناعي وعلامتك التجارية.", heroCta: "أنشئ جولتك الأولى", heroExplore: "اكتشف ما يمكنك إنشاؤه", previewTitle: "عاين التجربة قبل إنشائها.", workflowTitle: "معرفتك بالوجهة هي ميزتك التنافسية.", audienceTitle: "خبرة محلية. ترحيب عالمي.", finalTitle: "قد تكون تجربتك الكبيرة التالية في ذهنك بالفعل.", finalCta: "ابدأ مجاناً" },
} as const;
const tourCopy = {
  food: {
    en: { title: "Lisbon, one bite at a time", description: "A market-to-table route through Alfama, built around family recipes, small producers, and stories that never make the guidebooks." },
    pt: { title: "Lisboa, uma mordida de cada vez", description: "Um percurso do mercado à mesa por Alfama, com receitas de família, pequenos produtores e histórias que nunca chegam aos guias." },
    es: { title: "Lisboa, bocado a bocado", description: "Una ruta del mercado a la mesa por Alfama, con recetas familiares, pequeños productores e historias que no aparecen en las guías." },
    fr: { title: "Lisbonne, bouchée après bouchée", description: "Un parcours du marché à la table dans l’Alfama, entre recettes familiales, petits producteurs et histoires hors des guides." },
    de: { title: "Lissabon, Bissen für Bissen", description: "Eine Route vom Markt auf den Tisch durch Alfama – mit Familienrezepten, kleinen Produzenten und Geschichten abseits der Reiseführer." },
    it: { title: "Lisbona, un assaggio alla volta", description: "Un percorso dal mercato alla tavola attraverso Alfama, tra ricette di famiglia, piccoli produttori e storie fuori dalle guide." },
    ar: { title: "لشبونة، لقمة بعد لقمة", description: "مسار من السوق إلى المائدة عبر ألفاما، يجمع وصفات العائلات والمنتجين المحليين وقصصاً لا تجدها في الأدلة السياحية." },
  },
  adventure: {
    en: { title: "The city after golden hour", description: "A compact sunset discovery route for travellers between check-in and dinner, with skyline views, local legends, and one perfect photo stop." },
    pt: { title: "A cidade depois da hora dourada", description: "Um percurso compacto ao pôr do sol para viajantes entre o check-in e o jantar, com vistas do horizonte, lendas locais e uma paragem fotográfica." },
    es: { title: "La ciudad después de la hora dorada", description: "Una ruta compacta al atardecer para viajeros entre el check-in y la cena, con vistas del skyline, leyendas locales y una parada fotográfica." },
    fr: { title: "La ville après l’heure dorée", description: "Un parcours court au coucher du soleil pour les voyageurs entre l’arrivée et le dîner, avec vues sur la ville, légendes locales et une halte photo." },
    de: { title: "Die Stadt nach der goldenen Stunde", description: "Eine kompakte Sonnenuntergangsroute für Reisende zwischen Check-in und Abendessen – mit Skyline-Blicken, lokalen Legenden und einem perfekten Fotostopp." },
    it: { title: "La città dopo l’ora dorata", description: "Un percorso al tramonto per chi ha poco tempo tra check-in e cena, con viste sullo skyline, leggende locali e una sosta fotografica." },
    ar: { title: "المدينة بعد الساعة الذهبية", description: "مسار قصير لاكتشاف الغروب للمسافرين بين تسجيل الوصول والعشاء، مع إطلالات على الأفق وحكايات محلية وتوقف مثالي للتصوير." },
  },
  package: {
    en: { title: "Douro, slowly discovered", description: "A polished four-day escape that balances vineyard mornings, river landscapes, village kitchens, and unhurried local moments." },
    pt: { title: "Douro, descoberto sem pressa", description: "Uma escapadinha de quatro dias que combina manhãs entre vinhas, paisagens do rio, cozinhas de aldeia e momentos locais sem pressa." },
    es: { title: "Douro, descubierto sin prisa", description: "Una escapada de cuatro días que combina mañanas entre viñedos, paisajes del río, cocinas de pueblo y momentos locales sin prisas." },
    fr: { title: "Le Douro, en douceur", description: "Une escapade de quatre jours entre matinées dans les vignobles, paysages fluviaux, cuisines de village et moments locaux sans se presser." },
    de: { title: "Douro, ganz entspannt entdeckt", description: "Eine stilvolle viertägige Auszeit mit Weinberg-Morgen, Flusslandschaften, Dorfküchen und entspannten lokalen Momenten." },
    it: { title: "Douro, da scoprire lentamente", description: "Una fuga di quattro giorni tra mattine in vigna, paesaggi fluviali, cucine di paese e momenti locali senza fretta." },
    ar: { title: "وادي دورو، باكتشاف هادئ", description: "رحلة راقية لأربعة أيام تجمع بين صباحات الكروم ومناظر النهر ومطابخ القرى ولحظات محلية هادئة." },
  },
} as const;

type PreviewView = {
  id: string;
  label: string;
  kicker: string;
  title: string;
  destination: string;
  duration: string;
  group: string;
  language: string;
  description: string;
  stops: string[];
  inclusions: string[];
  color: string;
  translations?: Array<{ language: string; title: string; description: string }>;
};

const localizedSections = {
  en: { buildEyebrow: "Build what travelers actually want", buildTitle: "One idea can become a whole new product line.", buildDesc: "A good destination has more than one story. Create experiences that fit different time windows, interests, and markets—without starting from a blank page every time.", foodEyebrow: "The local table", foodTitle: "Every destination has a taste.", foodDesc: "Shape local ingredients, family traditions, and hidden places into a signature food tour your guests will remember.", signature: "Signature product", marketStory: "Market to table: a Lisbon food story.", localStops: "Curated local market stops", ingredients: "Stories behind the ingredients", routeReady: "A route ready to present", createTour: "Create this kind of tour", previewEyebrow: "See the AI thinking in public", previewDesc: "Switch between sample formats and explore how one simple idea becomes a structured, guest-ready tour product.", previewLanguage: "Preview language", createPreview: "Create your own preview", workflowEyebrow: "A faster route from idea to offer", workflowDesc: "AI Tour Guide Creator gives it shape, structure, and a professional finish—so you can spend more time on the experience itself.", audienceEyebrow: "Built to travel further", audienceDesc: "Your destination may be local. Your audience does not have to be. Prepare clear, welcoming tour content for the people you want to reach next.", languageBadge: "6 European languages + Arabic", finalEyebrow: "Ready when your next idea is", finalDesc: "Give it a route, a story, a priceable format, and a professional presentation.", noCard: "No card required to explore the first three generations.", footerDesc: "From local knowledge to global tours. Build experiences people want to remember.", openApp: "Open the app" },
  pt: { buildEyebrow: "Crie o que os viajantes realmente querem", buildTitle: "Uma ideia pode tornar-se numa nova linha de produtos.", buildDesc: "Um bom destino tem mais do que uma história. Crie experiências para diferentes horários, interesses e mercados — sem começar do zero todas as vezes.", foodEyebrow: "A mesa local", foodTitle: "Cada destino tem um sabor.", foodDesc: "Transforme ingredientes locais, tradições familiares e lugares escondidos num tour gastronómico que os seus convidados vão recordar.", signature: "Produto de assinatura", marketStory: "Do mercado à mesa: uma história gastronómica de Lisboa.", localStops: "Paragens em mercados locais", ingredients: "Histórias por trás dos ingredientes", routeReady: "Um roteiro pronto a apresentar", createTour: "Criar este tipo de tour", previewEyebrow: "Veja a IA a pensar em público", previewDesc: "Alterne entre formatos e descubra como uma ideia se transforma num produto estruturado e pronto para os seus convidados.", previewLanguage: "Idioma da pré-visualização", createPreview: "Criar a sua pré-visualização", workflowEyebrow: "Um caminho mais rápido da ideia à oferta", workflowDesc: "O AI Tour Guide Creator dá forma, estrutura e um acabamento profissional à sua ideia — para se concentrar mais na experiência.", audienceEyebrow: "Feito para ir mais longe", audienceDesc: "O seu destino pode ser local. O seu público não precisa de ser. Prepare conteúdo claro e acolhedor para os viajantes que quer alcançar.", languageBadge: "6 idiomas europeus + árabe", finalEyebrow: "Pronto quando surgir a próxima ideia", finalDesc: "Dê-lhe um roteiro, uma história, um formato vendável e uma apresentação profissional.", noCard: "Não precisa de cartão para explorar as três primeiras gerações.", footerDesc: "Do conhecimento local a tours globais. Crie experiências que as pessoas querem recordar.", openApp: "Abrir a aplicação" },
  es: { buildEyebrow: "Crea lo que los viajeros realmente quieren", buildTitle: "Una idea puede convertirse en una nueva línea de productos.", buildDesc: "Un buen destino tiene más de una historia. Crea experiencias para distintos horarios, intereses y mercados, sin empezar desde cero cada vez.", foodEyebrow: "La mesa local", foodTitle: "Cada destino tiene un sabor.", foodDesc: "Convierte ingredientes locales, tradiciones familiares y lugares secretos en un tour gastronómico que tus invitados recordarán.", signature: "Producto de autor", marketStory: "Del mercado a la mesa: una historia gastronómica de Lisboa.", localStops: "Paradas en mercados locales", ingredients: "Historias detrás de los ingredientes", routeReady: "Una ruta lista para presentar", createTour: "Crear este tipo de tour", previewEyebrow: "Mira cómo piensa la IA", previewDesc: "Cambia entre formatos y descubre cómo una idea se convierte en un producto estructurado y listo para tus invitados.", previewLanguage: "Idioma de la vista previa", createPreview: "Crear tu vista previa", workflowEyebrow: "Un camino más rápido de la idea a la oferta", workflowDesc: "AI Tour Guide Creator da forma, estructura y un acabado profesional a tu idea para que dediques más tiempo a la experiencia.", audienceEyebrow: "Creado para llegar más lejos", audienceDesc: "Tu destino puede ser local. Tu público no tiene por qué serlo. Prepara contenido claro y acogedor para los viajeros que quieres alcanzar.", languageBadge: "6 idiomas europeos + árabe", finalEyebrow: "Listo cuando llegue tu próxima idea", finalDesc: "Dale una ruta, una historia, un formato vendible y una presentación profesional.", noCard: "No necesitas tarjeta para explorar las tres primeras generaciones.", footerDesc: "Del conocimiento local a los tours globales. Crea experiencias que la gente quiera recordar.", openApp: "Abrir la aplicación" },
  fr: { buildEyebrow: "Créez ce que les voyageurs veulent vraiment", buildTitle: "Une idée peut devenir une nouvelle gamme de produits.", buildDesc: "Une bonne destination a plus d'une histoire. Créez des expériences adaptées aux horaires, intérêts et marchés, sans repartir de zéro.", foodEyebrow: "La table locale", foodTitle: "Chaque destination a une saveur.", foodDesc: "Transformez ingrédients locaux, traditions familiales et lieux secrets en un circuit culinaire dont vos invités se souviendront.", signature: "Produit signature", marketStory: "Du marché à la table : une histoire gourmande de Lisbonne.", localStops: "Haltes dans les marchés locaux", ingredients: "Histoires derrière les ingrédients", routeReady: "Un parcours prêt à présenter", createTour: "Créer ce type de circuit", previewEyebrow: "Découvrez la réflexion de l'IA", previewDesc: "Passez d'un format à l'autre et voyez comment une idée devient un produit structuré, prêt pour vos invités.", previewLanguage: "Langue de l'aperçu", createPreview: "Créer votre aperçu", workflowEyebrow: "Un chemin plus rapide de l'idée à l'offre", workflowDesc: "AI Tour Guide Creator donne forme, structure et finition professionnelle à votre idée pour vous laisser plus de temps pour l'expérience.", audienceEyebrow: "Conçu pour aller plus loin", audienceDesc: "Votre destination peut être locale. Votre public ne doit pas forcément l'être. Préparez un contenu clair et accueillant pour les voyageurs que vous souhaitez atteindre.", languageBadge: "6 langues européennes + arabe", finalEyebrow: "Prêt pour votre prochaine idée", finalDesc: "Donnez-lui un parcours, une histoire, un format commercial et une présentation professionnelle.", noCard: "Aucune carte requise pour explorer les trois premières générations.", footerDesc: "De la connaissance locale aux circuits mondiaux. Créez des expériences dont on se souvient.", openApp: "Ouvrir l'application" },
  de: { buildEyebrow: "Erstellen Sie, was Reisende wirklich wollen", buildTitle: "Aus einer Idee kann eine ganz neue Produktlinie werden.", buildDesc: "Ein gutes Reiseziel hat mehr als eine Geschichte. Erstellen Sie Erlebnisse für unterschiedliche Zeiten, Interessen und Märkte – ohne jedes Mal neu anzufangen.", foodEyebrow: "Die lokale Tafel", foodTitle: "Jedes Reiseziel hat einen Geschmack.", foodDesc: "Machen Sie aus lokalen Zutaten, Familientraditionen und versteckten Orten eine kulinarische Tour, an die sich Ihre Gäste erinnern.", signature: "Signature-Produkt", marketStory: "Vom Markt auf den Tisch: eine kulinarische Geschichte aus Lissabon.", localStops: "Ausgewählte lokale Marktstopps", ingredients: "Geschichten hinter den Zutaten", routeReady: "Eine präsentationsfertige Route", createTour: "Diese Art Tour erstellen", previewEyebrow: "Sehen Sie der KI beim Denken zu", previewDesc: "Wechseln Sie zwischen Formaten und erleben Sie, wie aus einer Idee ein strukturiertes, gastfertiges Tourprodukt wird.", previewLanguage: "Vorschausprache", createPreview: "Eigene Vorschau erstellen", workflowEyebrow: "Schneller von der Idee zum Angebot", workflowDesc: "AI Tour Guide Creator gibt Ihrer Idee Form, Struktur und ein professionelles Finish, damit Sie sich auf das Erlebnis konzentrieren können.", audienceEyebrow: "Für größere Reichweite", audienceDesc: "Ihr Reiseziel kann lokal sein. Ihr Publikum muss es nicht sein. Erstellen Sie klare, einladende Inhalte für die Reisenden, die Sie erreichen möchten.", languageBadge: "6 europäische Sprachen + Arabisch", finalEyebrow: "Bereit für Ihre nächste Idee", finalDesc: "Geben Sie ihr eine Route, eine Geschichte, ein verkaufbares Format und eine professionelle Präsentation.", noCard: "Keine Karte erforderlich, um die ersten drei Generationen zu testen.", footerDesc: "Vom lokalen Wissen zu globalen Touren. Erlebnisse schaffen, an die man sich gern erinnert.", openApp: "App öffnen" },
  it: { buildEyebrow: "Crea ciò che i viaggiatori desiderano davvero", buildTitle: "Un'idea può diventare una nuova linea di prodotti.", buildDesc: "Una buona destinazione ha più di una storia. Crea esperienze per tempi, interessi e mercati diversi, senza ripartire da zero.", foodEyebrow: "La tavola locale", foodTitle: "Ogni destinazione ha un sapore.", foodDesc: "Trasforma ingredienti locali, tradizioni familiari e luoghi segreti in un tour gastronomico che i tuoi ospiti ricorderanno.", signature: "Prodotto distintivo", marketStory: "Dal mercato alla tavola: una storia gastronomica di Lisbona.", localStops: "Tappe nei mercati locali", ingredients: "Storie dietro gli ingredienti", routeReady: "Un itinerario pronto da presentare", createTour: "Crea questo tipo di tour", previewEyebrow: "Guarda l'IA mentre pensa", previewDesc: "Passa da un formato all'altro e scopri come un'idea diventa un prodotto strutturato e pronto per gli ospiti.", previewLanguage: "Lingua dell'anteprima", createPreview: "Crea la tua anteprima", workflowEyebrow: "Dall'idea all'offerta più velocemente", workflowDesc: "AI Tour Guide Creator dà forma, struttura e una finitura professionale alla tua idea, lasciandoti più tempo per l'esperienza.", audienceEyebrow: "Progettato per andare oltre", audienceDesc: "La tua destinazione può essere locale. Il tuo pubblico non deve esserlo. Prepara contenuti chiari e accoglienti per i viaggiatori che vuoi raggiungere.", languageBadge: "6 lingue europee + arabo", finalEyebrow: "Pronto per la tua prossima idea", finalDesc: "Dalle un itinerario, una storia, un formato vendibile e una presentazione professionale.", noCard: "Nessuna carta richiesta per esplorare le prime tre generazioni.", footerDesc: "Dalla conoscenza locale ai tour globali. Crea esperienze da ricordare.", openApp: "Apri l'app" },
  ar: { buildEyebrow: "أنشئ ما يريده المسافرون فعلاً", buildTitle: "يمكن لفكرة واحدة أن تصبح خط منتجات كامل.", buildDesc: "الوجهة الجيدة لها أكثر من قصة. أنشئ تجارب تناسب الأوقات والاهتمامات والأسواق المختلفة دون البدء من صفحة فارغة كل مرة.", foodEyebrow: "المائدة المحلية", foodTitle: "لكل وجهة مذاقها.", foodDesc: "حوّل المكونات المحلية وتقاليد العائلات والأماكن الخفية إلى جولة طعام سيتذكرها ضيوفك.", signature: "منتج مميز", marketStory: "من السوق إلى المائدة: قصة طعام من لشبونة.", localStops: "محطات في الأسواق المحلية", ingredients: "قصص وراء المكونات", routeReady: "مسار جاهز للعرض", createTour: "أنشئ هذا النوع من الجولات", previewEyebrow: "شاهد كيف يفكر الذكاء الاصطناعي", previewDesc: "بدّل بين النماذج وشاهد كيف تتحول الفكرة إلى منتج منظم وجاهز للضيوف.", previewLanguage: "لغة المعاينة", createPreview: "أنشئ معاينتك", workflowEyebrow: "طريق أسرع من الفكرة إلى العرض", workflowDesc: "يمنحك AI Tour Guide Creator الشكل والبنية واللمسة الاحترافية لتتفرغ للتجربة نفسها.", audienceEyebrow: "مصمم للوصول إلى أبعد", audienceDesc: "قد تكون وجهتك محلية، لكن جمهورك لا يجب أن يكون كذلك. أعد محتوى واضحاً ومرحباً للمسافرين الذين تريد الوصول إليهم.", languageBadge: "6 لغات أوروبية + العربية", finalEyebrow: "جاهز عندما تأتي فكرتك التالية", finalDesc: "امنحها مساراً وقصة وشكلاً قابلاً للبيع وعرضاً احترافياً.", noCard: "لا تحتاج إلى بطاقة لاستكشاف الأجيال الثلاثة الأولى.", footerDesc: "من المعرفة المحلية إلى الجولات العالمية. أنشئ تجارب تستحق التذكر.", openApp: "افتح التطبيق" },
} as const;
const localizedExperienceCards = {
  en: [{ eyebrow: "The short escape", title: "One-hour adventures", description: "Turn a free hour between check-in and dinner into a story worth taking home.", tags: ["City walks", "Sunset routes", "Quick tastings"] }, { eyebrow: "The local table", title: "Food tours", description: "Build a signature route around the ingredients, people, and places that define your destination.", tags: ["Markets", "Wine trails", "Chef-led"] }, { eyebrow: "The complete journey", title: "Four-day packages", description: "Shape a complete trip with a day-by-day rhythm, local flavour, and premium add-ons.", tags: ["Culture", "Nature", "Private travel"] }],
  pt: [{ eyebrow: "A escapadinha curta", title: "Aventuras de uma hora", description: "Transforme uma hora livre entre o check-in e o jantar numa história para levar consigo.", tags: ["Passeios urbanos", "Roteiros ao pôr do sol", "Provas rápidas"] }, { eyebrow: "A mesa local", title: "Tours gastronómicos", description: "Crie um roteiro de assinatura com os ingredientes, pessoas e lugares que definem o destino.", tags: ["Mercados", "Rotas de vinho", "Com chef"] }, { eyebrow: "A viagem completa", title: "Pacotes de quatro dias", description: "Construa uma viagem completa com ritmo diário, sabor local e extras premium.", tags: ["Cultura", "Natureza", "Viagens privadas"] }],
  es: [{ eyebrow: "La escapada corta", title: "Aventuras de una hora", description: "Convierte una hora libre entre el check-in y la cena en una historia para recordar.", tags: ["Paseos urbanos", "Rutas al atardecer", "Degustaciones rápidas"] }, { eyebrow: "La mesa local", title: "Tours gastronómicos", description: "Crea una ruta de autor con los ingredientes, personas y lugares que definen tu destino.", tags: ["Mercados", "Rutas del vino", "Con chef"] }, { eyebrow: "El viaje completo", title: "Paquetes de cuatro días", description: "Diseña un viaje completo con ritmo diario, sabor local y extras premium.", tags: ["Cultura", "Naturaleza", "Viajes privados"] }],
  fr: [{ eyebrow: "La courte escapade", title: "Aventures d'une heure", description: "Transformez une heure libre entre l'arrivée et le dîner en une histoire à raconter.", tags: ["Promenades urbaines", "Parcours au coucher du soleil", "Dégustations express"] }, { eyebrow: "La table locale", title: "Circuits gourmands", description: "Créez un parcours signature autour des ingrédients, personnes et lieux qui définissent votre destination.", tags: ["Marchés", "Routes des vins", "Avec chef"] }, { eyebrow: "Le voyage complet", title: "Séjours de quatre jours", description: "Composez un voyage complet avec un rythme quotidien, des saveurs locales et des options premium.", tags: ["Culture", "Nature", "Voyages privés"] }],
  de: [{ eyebrow: "Die kurze Auszeit", title: "Ein-Stunden-Abenteuer", description: "Machen Sie aus einer freien Stunde zwischen Check-in und Abendessen eine bleibende Geschichte.", tags: ["Stadtspaziergänge", "Sonnenuntergangsrouten", "Schnelle Verkostungen"] }, { eyebrow: "Die lokale Tafel", title: "Kulinarische Touren", description: "Erstellen Sie eine Signature-Route mit Zutaten, Menschen und Orten Ihres Reiseziels.", tags: ["Märkte", "Weinrouten", "Mit Küchenchef"] }, { eyebrow: "Die komplette Reise", title: "Viertägige Pakete", description: "Gestalten Sie eine komplette Reise mit Tagesrhythmus, lokalem Geschmack und Premium-Extras.", tags: ["Kultur", "Natur", "Privatreisen"] }],
  it: [{ eyebrow: "La fuga breve", title: "Avventure di un'ora", description: "Trasforma un'ora libera tra check-in e cena in una storia da portare a casa.", tags: ["Passeggiate in città", "Itinerari al tramonto", "Degustazioni rapide"] }, { eyebrow: "La tavola locale", title: "Tour gastronomici", description: "Crea un percorso distintivo con ingredienti, persone e luoghi che definiscono la destinazione.", tags: ["Mercati", "Strade del vino", "Con chef"] }, { eyebrow: "Il viaggio completo", title: "Pacchetti di quattro giorni", description: "Progetta un viaggio completo con ritmo quotidiano, sapori locali e servizi premium.", tags: ["Cultura", "Natura", "Viaggi privati"] }],
  ar: [{ eyebrow: "الهروب القصير", title: "مغامرات لمدة ساعة", description: "حوّل ساعة فارغة بين تسجيل الوصول والعشاء إلى قصة تستحق أن تعود بها إلى المنزل.", tags: ["جولات المدينة", "مسارات الغروب", "تذوق سريع"] }, { eyebrow: "المائدة المحلية", title: "جولات الطعام", description: "أنشئ مساراً مميزاً حول المكونات والأشخاص والأماكن التي تميز وجهتك.", tags: ["الأسواق", "مسارات النبيذ", "مع طاهٍ"] }, { eyebrow: "الرحلة الكاملة", title: "باقات لأربعة أيام", description: "صمم رحلة كاملة بإيقاع يومي ونكهة محلية وإضافات مميزة.", tags: ["الثقافة", "الطبيعة", "سفر خاص"] }],
} as const;
const localizedWorkflow = {
  en: [{ title: "Start with a spark", copy: "Choose a destination, audience, and experience style. Your local knowledge is the advantage." }, { title: "Let AI shape the route", copy: "Generate a strong concept with a clear flow, inclusions, positioning, and a reason to book." }, { title: "Make it yours", copy: "Add your brand, adapt for international guests, and prepare a polished product to present." }],
  pt: [{ title: "Comece com uma ideia", copy: "Escolha um destino, público e estilo de experiência. O seu conhecimento local é a vantagem." }, { title: "Deixe a IA criar o roteiro", copy: "Gere um conceito forte com fluxo, inclusões, posicionamento e uma razão para reservar." }, { title: "Torne-o seu", copy: "Adicione a sua marca, adapte para visitantes internacionais e prepare um produto profissional." }],
  es: [{ title: "Empieza con una idea", copy: "Elige un destino, público y estilo de experiencia. Tu conocimiento local es la ventaja." }, { title: "Deja que la IA cree la ruta", copy: "Genera un concepto sólido con flujo, inclusiones, posicionamiento y un motivo para reservar." }, { title: "Hazlo tuyo", copy: "Añade tu marca, adapta el contenido para visitantes internacionales y prepara un producto profesional." }],
  fr: [{ title: "Commencez par une idée", copy: "Choisissez une destination, un public et un style d'expérience. Votre connaissance locale est votre avantage." }, { title: "Laissez l'IA créer le parcours", copy: "Générez un concept fort avec un flux clair, des inclusions, un positionnement et une raison de réserver." }, { title: "Personnalisez-le", copy: "Ajoutez votre marque, adaptez-le aux visiteurs internationaux et préparez un produit professionnel." }],
  de: [{ title: "Mit einem Impuls starten", copy: "Wählen Sie Reiseziel, Zielgruppe und Erlebnisstil. Ihr lokales Wissen ist Ihr Vorteil." }, { title: "Die KI formt die Route", copy: "Erstellen Sie ein starkes Konzept mit Ablauf, Leistungen, Positionierung und Buchungsgrund." }, { title: "Machen Sie es zu Ihrem", copy: "Fügen Sie Ihre Marke hinzu, passen Sie es für internationale Gäste an und präsentieren Sie ein professionelles Produkt." }],
  it: [{ title: "Inizia da un'idea", copy: "Scegli destinazione, pubblico e stile dell'esperienza. La tua conoscenza locale è il vantaggio." }, { title: "Lascia che l'IA crei il percorso", copy: "Genera un concept forte con flusso, inclusioni, posizionamento e un motivo per prenotare." }, { title: "Rendilo tuo", copy: "Aggiungi il tuo brand, adatta il tour agli ospiti internazionali e prepara un prodotto professionale." }],
  ar: [{ title: "ابدأ بفكرة", copy: "اختر الوجهة والجمهور ونمط التجربة. معرفتك المحلية هي الميزة." }, { title: "دع الذكاء الاصطناعي يصمم المسار", copy: "أنشئ فكرة قوية بتدفق واضح ومزايا وتموضع وسبب للحجز." }, { title: "اجعلها على طريقتك", copy: "أضف علامتك التجارية وعدّلها للضيوف الدوليين وجهّز منتجاً احترافياً." }],
} as const;
const localizedAudience = {
  en: [{ title: "Independent guides", copy: "Launch more of the experiences you already know how to deliver.", action: "Launch faster" }, { title: "Travel agencies", copy: "Create a consistent product line with your identity on every document.", action: "Scale your catalogue" }, { title: "Destination experts", copy: "Turn under-loved corners, seasonal moments, and local stories into products.", action: "Make it discoverable" }, { title: "Concierge teams", copy: "Give guests polished, relevant ideas before they step outside.", action: "Create guest-ready tours" }],
  pt: [{ title: "Guias independentes", copy: "Lance mais experiências que já sabe proporcionar.", action: "Lançar mais rápido" }, { title: "Agências de viagens", copy: "Crie uma linha de produtos consistente com a sua identidade em cada documento.", action: "Escalar catálogo" }, { title: "Especialistas em destinos", copy: "Transforme lugares esquecidos, momentos sazonais e histórias locais em produtos.", action: "Tornar descobrível" }, { title: "Equipas de concierge", copy: "Ofereça aos hóspedes ideias relevantes e profissionais antes de saírem.", action: "Criar tours prontos" }],
  es: [{ title: "Guías independientes", copy: "Lanza más experiencias que ya sabes ofrecer.", action: "Lanzar más rápido" }, { title: "Agencias de viajes", copy: "Crea una línea de productos coherente con tu identidad en cada documento.", action: "Ampliar catálogo" }, { title: "Expertos en destinos", copy: "Convierte rincones olvidados, momentos de temporada e historias locales en productos.", action: "Hacerlo visible" }, { title: "Equipos de concierge", copy: "Ofrece a tus huéspedes ideas relevantes y cuidadas antes de salir.", action: "Crear tours listos" }],
  fr: [{ title: "Guides indépendants", copy: "Lancez davantage d'expériences que vous savez déjà proposer.", action: "Lancer plus vite" }, { title: "Agences de voyages", copy: "Créez une gamme cohérente avec votre identité sur chaque document.", action: "Développer le catalogue" }, { title: "Experts des destinations", copy: "Transformez lieux méconnus, saisons et histoires locales en produits.", action: "Rendre visible" }, { title: "Équipes de conciergerie", copy: "Donnez aux clients des idées pertinentes avant qu'ils ne sortent.", action: "Créer des circuits prêts" }],
  de: [{ title: "Unabhängige Guides", copy: "Bringen Sie mehr Erlebnisse auf den Markt, die Sie bereits anbieten können.", action: "Schneller starten" }, { title: "Reiseagenturen", copy: "Erstellen Sie eine konsistente Produktlinie mit Ihrer Identität in jedem Dokument.", action: "Katalog skalieren" }, { title: "Reiseziel-Experten", copy: "Machen Sie aus unbekannten Orten, Saisonmomenten und Geschichten Produkte.", action: "Auffindbar machen" }, { title: "Concierge-Teams", copy: "Geben Sie Gästen relevante, hochwertige Ideen, bevor sie losgehen.", action: "Gastfertige Touren erstellen" }],
  it: [{ title: "Guide indipendenti", copy: "Lancia più esperienze che sai già offrire.", action: "Parti più velocemente" }, { title: "Agenzie di viaggio", copy: "Crea una linea di prodotti coerente con il tuo brand in ogni documento.", action: "Amplia il catalogo" }, { title: "Esperti di destinazione", copy: "Trasforma luoghi poco conosciuti, stagioni e storie locali in prodotti.", action: "Rendilo scopribile" }, { title: "Team concierge", copy: "Offri agli ospiti idee pertinenti e curate prima che escano.", action: "Crea tour pronti" }],
  ar: [{ title: "المرشدون المستقلون", copy: "أطلق المزيد من التجارب التي تعرف كيف تقدمها.", action: "ابدأ بسرعة" }, { title: "وكالات السفر", copy: "أنشئ خط منتجات متناسقاً يحمل هويتك في كل وثيقة.", action: "وسّع الكتالوج" }, { title: "خبراء الوجهات", copy: "حوّل الأماكن غير المعروفة واللحظات الموسمية والقصص المحلية إلى منتجات.", action: "اجعلها قابلة للاكتشاف" }, { title: "فرق الكونسيرج", copy: "امنح الضيوف أفكاراً مناسبة واحترافية قبل خروجهم.", action: "أنشئ جولات جاهزة" }],
} as const;
const localizedMicrocopy = {
  en: { trial: "Free trial included", whiteLabel: "White-label ready", busy: "Built for busy operators", experiencePreview: "Experience preview", aiRoute: "AI route", spark: "From spark to sellable.", aiBuilt: "AI-built", markets: "7 language markets", audienceTicker: ["For independent guides", "For travel agencies", "For destination experts", "For concierge teams"] },
  pt: { trial: "Teste gratuito incluído", whiteLabel: "Pronto para white-label", busy: "Feito para operadores ocupados", experiencePreview: "Pré-visualização da experiência", aiRoute: "Roteiro IA", spark: "Da ideia ao produto vendável.", aiBuilt: "Criado com IA", markets: "7 mercados linguísticos", audienceTicker: ["Para guias independentes", "Para agências de viagens", "Para especialistas em destinos", "Para equipas de concierge"] },
  es: { trial: "Prueba gratuita incluida", whiteLabel: "Listo para marca blanca", busy: "Creado para operadores ocupados", experiencePreview: "Vista previa de la experiencia", aiRoute: "Ruta con IA", spark: "De la idea a un producto vendible.", aiBuilt: "Creado con IA", markets: "7 mercados lingüísticos", audienceTicker: ["Para guías independientes", "Para agencias de viajes", "Para expertos en destinos", "Para equipos de concierge"] },
  fr: { trial: "Essai gratuit inclus", whiteLabel: "Prêt pour votre marque", busy: "Pensé pour les opérateurs actifs", experiencePreview: "Aperçu de l'expérience", aiRoute: "Parcours IA", spark: "De l'idée au produit vendable.", aiBuilt: "Créé par l'IA", markets: "7 marchés linguistiques", audienceTicker: ["Pour les guides indépendants", "Pour les agences de voyages", "Pour les experts des destinations", "Pour les équipes de conciergerie"] },
  de: { trial: "Kostenlose Testphase inklusive", whiteLabel: "White-Label-fertig", busy: "Für vielbeschäftigte Anbieter", experiencePreview: "Erlebnisvorschau", aiRoute: "KI-Route", spark: "Vom Impuls zum verkaufbaren Produkt.", aiBuilt: "KI-erstellt", markets: "7 Sprachmärkte", audienceTicker: ["Für unabhängige Guides", "Für Reiseagenturen", "Für Reiseziel-Experten", "Für Concierge-Teams"] },
  it: { trial: "Prova gratuita inclusa", whiteLabel: "Pronto per il white label", busy: "Pensato per operatori impegnati", experiencePreview: "Anteprima dell'esperienza", aiRoute: "Percorso IA", spark: "Dall'idea al prodotto vendibile.", aiBuilt: "Creato con l'IA", markets: "7 mercati linguistici", audienceTicker: ["Per guide indipendenti", "Per agenzie di viaggio", "Per esperti di destinazione", "Per team concierge"] },
  ar: { trial: "تجربة مجانية متاحة", whiteLabel: "جاهز للعلامة البيضاء", busy: "مصمم للمتخصصين المشغولين", experiencePreview: "معاينة التجربة", aiRoute: "مسار بالذكاء الاصطناعي", spark: "من الفكرة إلى منتج قابل للبيع.", aiBuilt: "أنشئ بالذكاء الاصطناعي", markets: "7 أسواق لغوية", audienceTicker: ["للمرشدين المستقلين", "لوكالات السفر", "لخبراء الوجهات", "لفرق الكونسيرج"] },
} as const;

function LogoMark() {
  return (
    <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f15b43] text-[#fbf9f3] shadow-[0_6px_18px_rgba(241,91,67,0.28)]">
      <span className="absolute h-[17px] w-[17px] rotate-45 rounded-[5px] border-[2px] border-[#fbf9f3]" />
      <span className="absolute h-[6px] w-[6px] rounded-full bg-[#f7c95b]" />
    </span>
  );
}

function PrimaryButton({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <a
      href={appUrl}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center justify-center gap-3 rounded-full px-5 py-3.5 text-sm font-semibold transition duration-200 active:scale-[0.97] ${
        light
          ? "bg-[#fbf9f3] text-[#122c36] shadow-[0_12px_30px_rgba(11,43,54,0.16)] hover:bg-white"
          : "bg-[#f15b43] text-white shadow-[0_12px_30px_rgba(241,91,67,0.22)] hover:-translate-y-0.5 hover:bg-[#dd4c37]"
      }`}
    >
      {children}
      <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTourId, setActiveTourId] = useState("food");
  const [activeLanguage, setActiveLanguage] = useState("en");
  const appliedSavedPreference = useRef(false);
  const [sessionKey] = useState(() => {
    if (typeof window === "undefined") return "preview-server-session";
    const existing = window.localStorage.getItem("aitgc-preview-session");
    if (existing) return existing;
    const generated = `preview-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem("aitgc-preview-session", generated);
    return generated;
  });
  const { data: persistedTours } = trpc.previewData.list.useQuery();
  const { data: savedPreference } = trpc.previewData.preference.useQuery({ sessionKey });
  const savePreference = trpc.previewData.savePreference.useMutation();
  const persistedTourViews: PreviewView[] = (persistedTours ?? []).map((tour) => ({
    id: tour.slug,
    label: tour.label,
    kicker: "AI-generated itinerary",
    title: tour.translations.find((translation) => translation.language === "en")?.title ?? tour.label,
    destination: tour.destination,
    duration: tour.duration,
    group: tour.groupFormat,
    language: tour.languages,
    description: tour.translations.find((translation) => translation.language === "en")?.description ?? "",
    stops: tour.stops,
    inclusions: tour.inclusions,
    color: tour.color,
    translations: tour.translations,
  }));
  const availableTours: PreviewView[] = persistedTourViews.length > 0 ? persistedTourViews : tourPreviews;
  const activeTour = availableTours.find((tour) => tour.id === activeTourId) ?? availableTours[0];
  const activeLanguageOption = languageOptions.find((language) => language.id === activeLanguage) ?? languageOptions[0];
  const copy = siteCopy[activeLanguage as keyof typeof siteCopy] ?? siteCopy.en;
  const sectionCopy = localizedSections[activeLanguage as keyof typeof localizedSections] ?? localizedSections.en;
  const experienceText = localizedExperienceCards[activeLanguage as keyof typeof localizedExperienceCards] ?? localizedExperienceCards.en;
  const workflowText = localizedWorkflow[activeLanguage as keyof typeof localizedWorkflow] ?? localizedWorkflow.en;
  const audienceText = localizedAudience[activeLanguage as keyof typeof localizedAudience] ?? localizedAudience.en;
  const micro = localizedMicrocopy[activeLanguage as keyof typeof localizedMicrocopy] ?? localizedMicrocopy.en;
  const activeLabels = previewLabels[activeLanguage as keyof typeof previewLabels];
  const persistedCopy = activeTour.translations?.find((translation) => translation.language === activeLanguage) ?? activeTour.translations?.find((translation) => translation.language === "en");
  const activeCopy = persistedCopy ?? tourCopy[activeTour.id as keyof typeof tourCopy][activeLanguage as keyof typeof previewLabels] ?? tourCopy[activeTour.id as keyof typeof tourCopy].en;
  const rememberPreference = (tourId: string, language: string) => {
    const normalizedLanguage = languageOptions.some((option) => option.id === language) ? language : "en";
    appliedSavedPreference.current = true;
    setActiveLanguage(normalizedLanguage);
    savePreference.mutate({ sessionKey, selectedTourSlug: tourId, selectedLanguage: normalizedLanguage as "en" | "pt" | "es" | "fr" | "de" | "it" | "ar" });
  };

  useEffect(() => {
    if (!savedPreference || appliedSavedPreference.current) return;
    appliedSavedPreference.current = true;
    setActiveTourId(savedPreference.selectedTourSlug);
    setActiveLanguage(savedPreference.selectedLanguage);
  }, [savedPreference]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div dir={activeLanguageOption.direction} className="min-h-screen overflow-x-hidden bg-[#fbf9f3] text-[#122c36]">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <a href="#top" className="flex items-center gap-3" aria-label="AI Tour Guide Creator home">
            <LogoMark />
            <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white sm:text-[19px]">
              AI Tour Guide Creator
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-[13px] font-medium text-white/75 lg:flex" aria-label="Main navigation">
            <a className="transition hover:text-white" href="#experiences">{copy.navBuild}</a>
            <a className="transition hover:text-white" href="#workflow">{copy.navHow}</a>
            <a className="transition hover:text-white" href="#audience">{copy.navAudience}</a>
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <label className="sr-only" htmlFor="site-language">Site language</label>
            <select id="site-language" value={activeLanguage} onChange={(event) => { setActiveLanguage(event.target.value); rememberPreference(activeTour.id, event.target.value); }} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[12px] font-semibold text-white outline-none backdrop-blur transition hover:bg-white/20">
              {languageOptions.map((language) => <option key={language.id} value={language.id} className="bg-[#122c36] text-white">{language.short} · {language.label}</option>)}
            </select>
            <a href={appUrl} target="_blank" rel="noreferrer" className="text-[13px] font-medium text-white/75 transition hover:text-white">
              {copy.signIn}
            </a>
            <a href={appUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#fbf9f3] px-4 py-2.5 text-[13px] font-semibold text-[#122c36] transition hover:bg-white">
              {copy.start} <ArrowUpRight className="ml-1 inline-block" size={15} />
            </a>
          </div>

          <button
            className="rounded-full border border-white/20 p-2 text-white lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mx-4 rounded-3xl border border-white/15 bg-[#122c36]/95 p-5 shadow-2xl backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-4 text-sm text-white/80" aria-label="Mobile navigation">
              <a onClick={closeMenu} href="#experiences">{copy.navBuild}</a>
              <a onClick={closeMenu} href="#workflow">{copy.navHow}</a>
              <a onClick={closeMenu} href="#audience">{copy.navAudience}</a>
              <label className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white/45" htmlFor="mobile-site-language">Language</label>
              <select id="mobile-site-language" value={activeLanguage} onChange={(event) => { setActiveLanguage(event.target.value); rememberPreference(activeTour.id, event.target.value); }} className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-sm text-white outline-none">
                {languageOptions.map((language) => <option key={language.id} value={language.id} className="bg-[#122c36] text-white">{language.short} · {language.label}</option>)}
              </select>
              <a onClick={closeMenu} href={appUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center justify-center rounded-full bg-[#f15b43] px-4 py-3 font-semibold text-white">
                {copy.start} <ArrowRight className="ml-2" size={16} />
              </a>
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        <section className="relative isolate min-h-[760px] overflow-hidden bg-[#122c36] text-white lg:min-h-[800px]">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_20%,rgba(241,91,67,0.32),transparent_30%),radial-gradient(circle_at_86%_6%,rgba(247,201,91,0.25),transparent_22%),linear-gradient(117deg,#102830_0%,#163943_58%,#102831_100%)]" />
          <div className="absolute inset-0 -z-10 opacity-30 hero-grid" />
          <div className="absolute -right-28 top-10 -z-10 h-[430px] w-[430px] rounded-full border border-white/10 lg:h-[650px] lg:w-[650px]" />
          <div className="absolute -right-12 top-28 -z-10 h-[280px] w-[280px] rounded-full border border-white/10 lg:right-12 lg:top-48 lg:h-[390px] lg:w-[390px]" />

          <div className="mx-auto grid max-w-[1240px] gap-14 px-5 pb-20 pt-36 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-8 lg:px-10 lg:pb-24 lg:pt-48">
            <div className="relative z-10 max-w-[610px]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#f7c95b] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f7c95b] shadow-[0_0_12px_#f7c95b]" />
                {copy.badge}
              </div>
              <h1 className="font-display max-w-[660px] text-[clamp(3.25rem,7vw,6.6rem)] leading-[0.94] tracking-[-0.065em] text-[#fbf9f3]">
                {copy.heroLine1}
                <span className="block italic text-[#f7c95b]">{copy.heroLine2}</span>
                <span className="block">{copy.heroLine3}</span>
                <span className="block italic text-[#f15b43]">{copy.heroLine4}</span>
              </h1>
              <p className="mt-8 max-w-[510px] text-[16px] leading-7 text-white/70 sm:text-[18px] sm:leading-8">
                {copy.heroDescription}
              </p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <PrimaryButton>{copy.heroCta}</PrimaryButton>
                <a href="#experiences" className="group inline-flex items-center gap-2 px-2 py-2 text-sm font-medium text-white/70 transition hover:text-white">
                  {copy.heroExplore} <ChevronDown size={16} className="transition-transform group-hover:translate-y-1" />
                </a>
              </div>
              <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-white/45">
                <span className="inline-flex items-center gap-2"><Check size={14} className="text-[#f7c95b]" /> {micro.trial}</span>
                <span className="inline-flex items-center gap-2"><Check size={14} className="text-[#f7c95b]" /> {micro.whiteLabel}</span>
                <span className="inline-flex items-center gap-2"><Check size={14} className="text-[#f7c95b]" /> {micro.busy}</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
              <div className="relative aspect-[0.88] overflow-hidden rounded-[2rem] border border-white/20 bg-[#d6b075] shadow-[0_35px_100px_rgba(0,0,0,0.3)] sm:aspect-[1.02]">
                <img src="/manus-storage/dubai-golden-hour_c3255796.webp" alt="Golden hour desert travel experience" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102830]/90 via-[#102830]/10 to-[#102830]/10" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="mb-14 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
                    <span>{micro.experiencePreview}</span>
                    <span>04 / 04</span>
                  </div>
                  <p className="font-display text-[34px] leading-[0.96] tracking-[-0.04em] text-white sm:text-[44px]">Four days in Dubai</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-[12px] text-white/70">
                    <span>{micro.experiencePreview} · {activeTour.destination}</span>
                    <span className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">{micro.aiBuilt}</span>
                  </div>
                </div>
              </div>
              <div className="absolute -left-4 top-10 hidden max-w-[172px] rounded-2xl border border-white/20 bg-[#fbf9f3] p-4 text-[#122c36] shadow-[0_16px_45px_rgba(0,0,0,0.2)] sm:block lg:-left-14">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f15b43]">{micro.aiRoute}</span>
                  <WandSparkles size={15} className="text-[#f15b43]" />
                </div>
                <p className="font-display text-[19px] leading-tight tracking-[-0.03em]">{micro.spark}</p>
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-2xl border border-white/15 bg-[#f7c95b] px-4 py-3 text-[#122c36] shadow-[0_16px_45px_rgba(0,0,0,0.22)] sm:-right-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]"><Globe2 size={15} /> {micro.markets}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-b border-[#122c36]/10 bg-[#f7c95b]">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-4 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#122c36]/70 sm:justify-between sm:px-8 lg:px-10">
            <span>{micro.audienceTicker[0]}</span><span className="hidden h-1 w-1 rounded-full bg-[#122c36]/40 sm:block" /><span>{micro.audienceTicker[1]}</span><span className="hidden h-1 w-1 rounded-full bg-[#122c36]/40 sm:block" /><span>{micro.audienceTicker[2]}</span><span className="hidden h-1 w-1 rounded-full bg-[#122c36]/40 sm:block" /><span>{micro.audienceTicker[3]}</span>
          </div>
        </div>

        <section id="experiences" className="relative bg-[#fbf9f3] px-5 py-24 sm:px-8 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="eyebrow"><span /> {sectionCopy.buildEyebrow}</p>
                <h2 className="section-title mt-5 max-w-[470px]">{sectionCopy.buildTitle}</h2>
              </div>
              <p className="max-w-[520px] justify-self-end text-[16px] leading-7 text-[#122c36]/65">
                {sectionCopy.buildDesc}
              </p>
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {experiences.map((experience, index) => (
                <article key={experience.number} className={`experience-card accent-${experience.accent}`}>
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[12px] font-bold tracking-[0.16em] text-[#122c36]/45">{experience.number}</span>
                    <ArrowUpRight size={19} className="text-[#122c36]/35 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <div className="mt-20">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#122c36]/50">{experienceText[index]?.eyebrow}</p>
                    <h3 className="mt-3 font-display text-[32px] leading-[0.98] tracking-[-0.045em]">{experienceText[index]?.title}</h3>
                    <p className="mt-4 max-w-[300px] text-[14px] leading-6 text-[#122c36]/65">{experienceText[index]?.description}</p>
                    <div className="mt-7 flex flex-wrap gap-2">
                      {experienceText[index]?.tags.map((tag) => <span key={tag} className="rounded-full border border-[#122c36]/15 px-3 py-1.5 text-[11px] font-semibold text-[#122c36]/70">{tag}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 grid gap-5 overflow-hidden rounded-[1.75rem] bg-[#e9e5da] p-4 sm:p-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
              <div className="relative min-h-[300px] overflow-hidden rounded-[1.35rem] bg-[#122c36]">
                <img src="/manus-storage/europe-food-market_cae438cf.jpg" alt="Colourful European food market" className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#122c36]/95 via-[#122c36]/45 to-transparent" />
                <div className="relative flex h-full max-w-[420px] flex-col justify-end p-7 text-white sm:p-9">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f7c95b]">{sectionCopy.foodEyebrow}</p>
                  <h3 className="mt-3 font-display text-[35px] leading-none tracking-[-0.045em]">{sectionCopy.foodTitle}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/70">{sectionCopy.foodDesc}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-[1.35rem] bg-[#fbf9f3] p-7 sm:p-9">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#f15b43]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#f15b43]">{sectionCopy.signature}</span>
                    <MapPinned size={19} className="text-[#f15b43]" />
                  </div>
                  <p className="mt-10 font-display text-[27px] leading-[1.03] tracking-[-0.04em]">{sectionCopy.marketStory}</p>
                  <div className="mt-7 space-y-3 text-sm text-[#122c36]/65">
                    <div className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f7c95b] text-[11px] font-bold">1</span> {sectionCopy.localStops}</div>
                    <div className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f7c95b] text-[11px] font-bold">2</span> {sectionCopy.ingredients}</div>
                    <div className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f7c95b] text-[11px] font-bold">3</span> {sectionCopy.routeReady}</div>
                  </div>
                </div>
                <a href={appUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#f15b43] hover:gap-3">{sectionCopy.createTour} <ArrowRight size={16} /></a>
              </div>
            </div>
          </div>
        </section>

        <section id="preview" className="bg-[#fbf9f3] px-5 pb-24 pt-2 sm:px-8 lg:px-10 lg:pb-36">
          <div className="mx-auto max-w-[1240px] rounded-[2rem] bg-[#122c36] p-5 text-[#fbf9f3] shadow-[0_24px_70px_rgba(18,44,54,0.13)] sm:p-8 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div className="max-w-[370px]">
                <p className="eyebrow eyebrow-light"><span /> {sectionCopy.previewEyebrow}</p>
                <h2 className="section-title mt-5 text-[#fbf9f3]">{copy.previewTitle}</h2>
                <p className="mt-6 text-[15px] leading-7 text-white/55">{sectionCopy.previewDesc}</p>
                <div className="mt-7">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">{sectionCopy.previewLanguage}</p>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((language) => (
                      <button
                        key={language.id}
                        type="button"
                        onClick={() => {
                          setActiveLanguage(language.id);
                          rememberPreference(activeTour.id, language.id);
                        }}
                        className={`rounded-full border px-3 py-1.5 text-[10px] font-bold transition ${activeLanguage === language.id ? "border-[#f7c95b] bg-[#f7c95b] text-[#122c36]" : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"}`}
                        aria-pressed={activeLanguage === language.id}
                        title={language.label}
                      >
                        {language.short}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-8 space-y-2">
                  {availableTours.map((tour) => (
                    <button
                      key={tour.id}
                      type="button"
                      onClick={() => {
                        setActiveTourId(tour.id);
                        rememberPreference(tour.id, activeLanguage);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-200 ${activeTour.id === tour.id ? "border-[#f7c95b]/50 bg-white/10" : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"}`}
                      aria-pressed={activeTour.id === tour.id}
                    >
                      <span className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tour.color }} />
                        <span className="text-sm font-semibold">{tour.label}</span>
                      </span>
                      <ArrowRight size={16} className={`transition-transform ${activeTour.id === tour.id ? "translate-x-1 text-[#f7c95b]" : "text-white/35"}`} />
                    </button>
                  ))}
                </div>
                <a href={appUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#f7c95b] hover:gap-3">{sectionCopy.createPreview} <ArrowRight size={16} /></a>
              </div>

              <div dir={activeLanguageOption.direction} className="overflow-hidden rounded-[1.4rem] bg-[#fbf9f3] text-[#122c36]">
                <div className="flex items-center justify-between border-b border-[#122c36]/10 px-5 py-4 sm:px-7">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#122c36]/45"><span className="h-2 w-2 rounded-full bg-[#f15b43]" /> {activeLabels.live}</div>
                  <span className="rounded-full bg-[#122c36]/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#122c36]/55">{activeLabels.live}</span>
                </div>
                <div className="p-5 sm:p-7">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f15b43]">{activeTour.destination}</p>
                      <h3 className="mt-3 max-w-[510px] font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[-0.055em]">{activeCopy.title}</h3>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ backgroundColor: activeTour.color }}><Play size={12} fill="currentColor" /> {activeLabels.preview}</span>
                  </div>
                  <p className="mt-6 max-w-[650px] text-sm leading-6 text-[#122c36]/65">{activeCopy.description}</p>
                  <div className="mt-7 grid grid-cols-3 gap-2 border-y border-[#122c36]/10 py-4 text-[11px] sm:gap-5">
                    <div><p className="font-bold uppercase tracking-[0.12em] text-[#122c36]/40">{activeLabels.duration}</p><p className="mt-1.5 font-semibold">{activeTour.duration}</p></div>
                    <div><p className="font-bold uppercase tracking-[0.12em] text-[#122c36]/40">{activeLabels.format}</p><p className="mt-1.5 font-semibold">{activeTour.group}</p></div>
                    <div><p className="font-bold uppercase tracking-[0.12em] text-[#122c36]/40">{activeLabels.languages}</p><p className="mt-1.5 font-semibold">{activeTour.language}</p></div>
                  </div>
                  <div className="mt-7 grid gap-7 sm:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#122c36]/40">{activeLabels.flow}</p>
                      <div className="mt-4 space-y-3">
                        {activeTour.stops.map((stop, index) => (
                          <div key={stop} className="flex items-center gap-3 text-sm"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ backgroundColor: activeTour.color }}>{String(index + 1).padStart(2, "0")}</span><span>{stop}</span></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#122c36]/40">{activeLabels.included}</p>
                      <div className="mt-4 space-y-3">
                        {activeTour.inclusions.map((inclusion) => <div key={inclusion} className="flex items-center gap-2 text-sm text-[#122c36]/70"><Check size={15} className="text-[#f15b43]" />{inclusion}</div>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 bg-[#e9e5da] px-5 py-4 text-xs sm:px-7"><span className="text-[#122c36]/55">{activeLabels.footer}</span><span className="font-bold text-[#f15b43]">{activeLabels.action}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="relative overflow-hidden bg-[#122c36] px-5 py-24 text-[#fbf9f3] sm:px-8 lg:px-10 lg:py-32">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 hero-grid" />
          <div className="relative mx-auto max-w-[1240px]">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="eyebrow eyebrow-light"><span /> {sectionCopy.workflowEyebrow}</p>
                <h2 className="section-title mt-5 max-w-[560px] text-[#fbf9f3]">{copy.workflowTitle}</h2>
              </div>
              <p className="max-w-[390px] text-[15px] leading-7 text-white/55">{sectionCopy.workflowDesc}</p>
            </div>
            <div className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 lg:grid-cols-3">
              {workflow.map((item, index) => (
                <article key={item.step} className="group bg-[#163943] p-7 transition duration-300 hover:bg-[#1c4651] sm:p-9">
                  <div className="flex items-center justify-between text-[#f7c95b]">
                    <span className="font-mono text-xs tracking-[0.17em]">{item.step}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition group-hover:border-[#f7c95b]/50 group-hover:bg-[#f7c95b]/10">{item.icon}</span>
                  </div>
                  <h3 className="mt-24 font-display text-[27px] tracking-[-0.04em] text-[#fbf9f3]">{workflowText[index]?.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/55">{workflowText[index]?.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="audience" className="bg-[#e9e5da] px-5 py-24 sm:px-8 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div className="lg:sticky lg:top-24">
                <p className="eyebrow"><span /> {sectionCopy.audienceEyebrow}</p>
                <h2 className="section-title mt-5 max-w-[440px]">{copy.audienceTitle}</h2>
                <p className="mt-6 max-w-[390px] text-[16px] leading-7 text-[#122c36]/65">{sectionCopy.audienceDesc}</p>
                <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#122c36] px-4 py-3 text-xs font-semibold text-white"><Languages size={16} className="text-[#f7c95b]" /> {sectionCopy.languageBadge}</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="audience-card bg-[#fbf9f3] sm:translate-y-8"><span className="audience-icon bg-[#f15b43]/10 text-[#f15b43]"><Zap size={19} /></span><h3>{audienceText[0].title}</h3><p>{audienceText[0].copy}</p><a href={appUrl} target="_blank" rel="noreferrer">{audienceText[0].action} <ArrowUpRight size={15} /></a></div>
                <div className="audience-card bg-[#122c36] text-[#fbf9f3]"><span className="audience-icon bg-[#f7c95b] text-[#122c36]"><MapPinned size={19} /></span><h3>{audienceText[1].title}</h3><p className="text-white/55">{audienceText[1].copy}</p><a className="text-[#f7c95b]" href={appUrl} target="_blank" rel="noreferrer">{audienceText[1].action} <ArrowUpRight size={15} /></a></div>
                <div className="audience-card bg-[#f7c95b] sm:translate-y-8"><span className="audience-icon bg-[#122c36] text-[#f7c95b]"><Globe2 size={19} /></span><h3>{audienceText[2].title}</h3><p>{audienceText[2].copy}</p><a href={appUrl} target="_blank" rel="noreferrer">{audienceText[2].action} <ArrowUpRight size={15} /></a></div>
                <div className="audience-card bg-[#f15b43] text-white"><span className="audience-icon bg-white text-[#f15b43]"><Sparkles size={19} /></span><h3>{audienceText[3].title}</h3><p className="text-white/75">{audienceText[3].copy}</p><a className="text-white" href={appUrl} target="_blank" rel="noreferrer">{audienceText[3].action} <ArrowUpRight size={15} /></a></div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#f15b43] px-5 py-24 text-white sm:px-8 lg:px-10 lg:py-32">
          <div className="absolute -left-24 -top-36 h-[430px] w-[430px] rounded-full border border-white/15" />
          <div className="absolute -right-20 bottom-[-260px] h-[620px] w-[620px] rounded-full border border-white/15" />
          <div className="relative mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">{sectionCopy.finalEyebrow}</p>
              <h2 className="mt-5 max-w-[760px] font-display text-[clamp(3rem,6vw,6.2rem)] leading-[0.91] tracking-[-0.065em]">{copy.finalTitle}</h2>
            </div>
            <div className="lg:pb-2 lg:pl-8">
              <p className="max-w-[370px] text-[16px] leading-7 text-white/75">{sectionCopy.finalDesc}</p>
              <div className="mt-8"><PrimaryButton light>{copy.finalCta}</PrimaryButton></div>
              <p className="mt-4 text-[11px] text-white/55">{sectionCopy.noCard}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#102830] px-5 py-10 text-white sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <a href="#top" className="flex items-center gap-3"><LogoMark /><span className="font-display text-lg">AI Tour Guide Creator</span></a>
            <p className="mt-4 max-w-[310px] text-sm leading-6 text-white/45">{sectionCopy.footerDesc}</p>
          </div>
          <div className="flex flex-col gap-4 text-sm text-white/55 sm:items-end"><a className="transition hover:text-white" href={appUrl} target="_blank" rel="noreferrer">{sectionCopy.openApp} <ArrowUpRight className="ml-1 inline-block" size={15} /></a><span>© 2026 AI Tour Guide Creator · created by AhnaX</span></div>
        </div>
      </footer>
    </div>
  );
}
