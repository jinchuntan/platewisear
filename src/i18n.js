/**
 * i18n.js — Lightweight, dependency-free internationalisation for PlateNudge.
 *
 * Supports English (en), Bahasa Melayu (ms) and Simplified Chinese (zh-CN).
 * No translation API, no external packages — every string is static below.
 *
 * Public API:
 *   LOCALES, LOCALE_LABELS, LOCALE_NAMES, translations
 *   getLocale() / setLocale(locale)
 *   t(path[, locale])            — dot-path lookup, falls back to English
 *   applyTranslations(root)      — fills [data-i18n*] elements in the DOM
 *   initI18n()                   — sets <html lang> + applies translations
 *   mountLanguageSwitcher(el)    — renders the globe EN / BM / 中文 switcher
 *
 * Re-rendering:
 *   setLocale() dispatches a `platewise:localechange` CustomEvent on window.
 *   This module re-runs applyTranslations() on that event; page controllers add
 *   their own listeners to re-render JS-generated content.
 *
 * Data content (food targets, quiz, pledges) keeps its English source in
 * food-targets.js / content.js. Only the Malay + Chinese variants live here;
 * English requests fall through to the source files via t() returning undefined.
 */

const STORAGE_KEY = 'platewise-locale';

export const LOCALES = ['en', 'ms', 'zh-CN'];

/** Short labels shown on the switcher button. */
export const LOCALE_LABELS = { en: 'EN', ms: 'BM', 'zh-CN': '中文' };

/** Autonyms — a language name is shown in its own language in every locale. */
export const LOCALE_NAMES = { en: 'English', ms: 'Bahasa Melayu', 'zh-CN': '中文' };

// ===========================================================================
// Translations
// ===========================================================================
export const translations = {
  // -----------------------------------------------------------------------
  en: {
    meta: {
      titleHome: 'PlateNudge',
      titleScan: 'PlateNudge Scan',
      titleDemo: 'PlateNudge Demo',
      titleImages: 'PlateNudge Scan images',
      titleQuiz: 'PlateNudge Quick check',
      titleAbout: 'PlateNudge About',
      titleAI: 'PlateNudge AI Scan',
    },
    nav: { brand: 'PlateNudge', scan: 'Scan', demo: 'Demo', about: 'About', home: 'Home', language: 'Language' },
    hero: {
      chip: 'AR and AI for SDG 12',
      title1: 'Scan. Learn.',
      title2: 'Choose better.',
      sub: 'An AR and AI food waste learning app for SDG 12.',
      startScan: 'Start scan',
      startScanDesc: 'For curated AR image targets',
      tryDemo: 'Try demo',
      tryDemoDesc: 'For a no camera walkthrough',
      viewImages: 'View scan images',
      about: 'About',
    },
    ticker: { wasted: '1.05B tonnes wasted', households: '60% from households', sdg: 'SDG 12.3' },
    journey: {
      eyebrow: 'For learners.',
      title: 'Built for everyday food decisions.',
      subtitle: 'You do not need to be a sustainability expert. PlateNudge turns food-waste images into short AR exhibits that help you see the issue, choose an action, and reflect on what happens next.',
      card1Title: 'Visualise, not just read.',
      card1Body: 'Food waste often feels invisible after it leaves the plate. PlateNudge uses AR to place the impact back in front of the learner.',
      card1Alt: 'Illustration: seeing food-waste impact in AR',
      card2Title: 'Action, not guilt.',
      card2Body: 'The app does not just say “waste less”. It asks people to choose what they would do. They can throw, save, share, or compost.',
      card2Alt: 'Illustration: choosing a food-waste action',
      card3Title: 'Reflection, not a lecture.',
      card3Body: 'After each scan, users get a short fact, target-specific guidance, and a quick check to connect SDG 12 with everyday behaviour.',
      card3Alt: 'Illustration: reflecting on everyday choices',
    },
    impact: {
      title: 'Small choices add up.',
      subtitle: 'PlateNudge connects food-waste facts to simple decisions. Each scan turns a curated image into an AR learning moment. You build awareness, see the impact, choose an action, get feedback, and reflect.',
      stat1Num: '1.05B', stat1Label: 'tonnes of food wasted globally',
      stat1Body: 'Food waste is not just a bin problem. It represents wasted water, energy, labour, land, transport, and packaging.',
      stat2Num: '60%', stat2Label: 'comes from households',
      stat2Body: 'Household decisions matter. PlateNudge focuses on everyday situations learners can recognise and act on.',
      stat3Num: '19%', stat3Label: 'of food available to consumers is wasted',
      stat3Body: 'The app uses short facts and source labels so users can connect what they scan with real sustainability data.',
      stat4Num: 'SDG 12.3', stat4Label: 'halve food waste by 2030',
      stat4Body: 'PlateNudge supports awareness of responsible consumption and encourages people to prevent waste before it is thrown away.',
      cta: 'Start scanning',
      ctaNote: 'Scan a curated food-waste image, choose an action, then take the quick check.',
    },
    scan: {
      statusInitTitle: 'Starting camera…',
      statusInitMsg: 'Allow camera access when asked.',
      troubleshoot: 'Troubleshooting',
      ts1: 'Open the page over <strong>HTTPS</strong> or on <strong>localhost</strong>.',
      ts2: 'Allow <strong>camera permission</strong> for this site.',
      ts3: 'Close other apps or tabs using the camera.',
      ts4: 'Use <strong>Chrome / Firefox on Android</strong> for best results.',
      tryAgain: 'Try again',
      openDemo: 'Open Demo Mode',
      howTo: 'How to scan?',
      step1: 'Step 1 · Point at a scan image',
      scanningHint: 'Looking for a curated food-waste image…',
      sheetEyebrow: 'Exhibit',
      sheetTitleDefault: 'Food-waste exhibit',
      detected: 'Detected',
      homeAria: 'Back to home',
      sheetToggle: 'Collapse or expand panel',
      tapForActions: 'Tap for actions',
      chooseActionBelow: 'Choose an action below',
      step2: 'Step 2 · Choose what you’d do',
      step3: 'Step 3 · Learn more or take the quick check',
      chooseNext: 'Choose what happens next.',
      askMore: 'Ask more',
      quickCheck: 'Quick check →',
      backHome: '← Back to home',
      guideTitle: 'How to scan',
      g1: 'Open <strong>Scan images</strong> on another screen — or print/download them.',
      g2: 'Point the camera at one curated food-waste image.',
      g3: 'Fill most of the frame with the image.',
      g4: 'Hold steady with good lighting.',
      g5: 'Wait for the exhibit to appear.',
      gotIt: 'Got it',
      askLook: 'What am I looking at?',
      askWhy: 'Why it matters',
      askDo: 'What should I do?',
      askSafety: 'Safety note',
      status: {
        permission: { title: 'Camera permission needed', message: 'Tap “Allow” when your browser asks to use the camera.' },
        starting: { title: 'Starting camera…', message: 'Getting the camera ready — a few seconds.' },
        loading: { title: 'Loading AR…', message: 'Preparing image tracking.' },
        ready: { title: 'Ready to scan', message: 'Point your phone at a food-waste image.' },
        notargets: { title: 'Scan targets not installed', message: 'The compiled image-target file isn’t set up yet. Add public/assets/targets/food-waste-targets.mind (see README) — or use Demo Mode, which works now.' },
        insecure: { title: 'HTTPS required for the camera', message: 'Open this page over HTTPS or on localhost, then try again. Demo Mode works without a camera.' },
        unsupported: { title: 'Camera not supported', message: 'This browser can’t access the camera. Try Chrome / Firefox on Android, or use Demo Mode.' },
        denied: { title: 'Camera permission denied', message: 'Allow camera access for this site, then tap “Try again”.' },
        nocamera: { title: 'No camera found', message: 'No camera was found on this device. Use Demo Mode instead.' },
        inuse: { title: 'Camera unavailable', message: 'Another app or tab is using the camera. Close it, then tap “Try again”.' },
        failed: { title: 'AR failed to load', message: 'Image tracking could not start in time. Try again, or use Demo Mode.' },
      },
    },
    actions: {
      throwAway: { short: 'Throw', label: 'Throw Away', aria: 'Throw food away', feedback: 'Binning edible food wastes the water, land and energy used to grow it.' },
      saveLeftovers: { short: 'Save', label: 'Save Leftovers', aria: 'Save leftovers for later', feedback: 'Storing leftovers is the easiest way to cut household food waste.' },
      share: { short: 'Share', label: 'Share', aria: 'Share surplus food', feedback: 'Sharing safe surplus feeds people instead of filling bins.' },
      compost: { short: 'Compost', label: 'Compost', aria: 'Compost scraps', feedback: 'Compost what can’t be eaten — it returns nutrients to the soil.' },
    },
    common: { sourcePrefix: 'Source: ', bestPrefix: 'Best: ', recommendedPrefix: 'Recommended: ', close: 'Close' },
    demo: { chip: 'Demo Mode', title: 'Pick an exhibit', lede: 'Tap a food-waste image — no camera needed.' },
    ai: {
      cta: 'AI Scan',
      title: 'AI Scan',
      intro: 'Point your camera at food waste. PlateNudge will analyse one snapshot and suggest what to do next.',
      scanDesc: 'For camera based AI guidance',
      // Camera scan flow
      useCamera: 'Use camera',
      chooseInstead: 'Choose image instead',
      privacy: 'PlateNudge analyses one snapshot when scanning. It does not store your photo.',
      pointCamera: 'Point your camera at food waste',
      lookingClues: 'Looking for food waste clues',
      analysingSnapshot: 'Analysing snapshot',
      creatingExhibit: 'Creating your learning exhibit',
      sceneDetected: 'Food waste scene detected',
      snapshotAnalysed: 'Snapshot analysed',
      scanAgain: 'Scan again',
      cannotSeeTitle: 'I cannot clearly see food waste yet',
      retryHint: 'Move closer, improve lighting, or try another angle.',
      camFailedTitle: 'Camera could not start',
      camFailedMsg: 'The camera could not start in time. Try again or choose an image instead.',
      unavailableTitle: 'AI Scan is unavailable',
      notConfiguredTitle: 'AI Scan is not set up yet',
      // AI Scan guide
      howAiScan: 'How AI Scan works',
      guideTitle: 'How AI Scan works',
      g1: 'Point your camera at food waste.',
      g2: 'Keep the food clearly visible.',
      g3: 'Use good lighting and avoid blur.',
      g4: 'PlateNudge analyses one snapshot.',
      g5: 'Review the AI exhibit and choose your next action.',
      guidePrivacy: 'PlateNudge does not store your photo.',
      // Shared / upload fallback
      chooseLabel: 'Choose or take a photo',
      takePhoto: 'Take photo',
      chooseImage: 'Choose image',
      changePhoto: 'Change photo',
      analyse: 'Analyse photo',
      analysing: 'Analysing photo…',
      loadingHint: 'Looking for visible food-waste clues…',
      aiExhibit: 'AI exhibit',
      visibleItems: 'Visible items',
      uncertainItems: 'Uncertain items',
      wasteType: 'Waste type',
      confidence: 'Confidence',
      confLow: 'Low', confMedium: 'Medium', confHigh: 'High',
      recommendedAction: 'Recommended action',
      whyAction: 'Why this action',
      followUps: 'You might ask',
      ask: 'Ask',
      askPlaceholder: 'Ask a question…',
      disclaimer: 'AI assisted guidance only. PlateNudge cannot confirm food safety.',
      lowConfidenceNote: 'Low confidence. Please double check before acting.',
      tryScan: 'Start curated AR scan',
      errNoImage: 'Please choose a photo first.',
      errType: 'Unsupported image type. Use JPG, PNG, or WebP.',
      errTooLarge: 'That image is too large. Please use a smaller photo.',
      errUnavailable: 'AI analysis is unavailable right now. You can still use curated AR Scan or Demo Mode.',
      errNotConfigured: 'AI Scan is not configured yet. You can still use curated AR Scan or Demo Mode.',
    },
    images: {
      title: 'Scan images',
      lede: 'Open one on another screen (or print it), then scan it from the Scan page.',
      curatedNote: 'PlateNudge recognises these <strong>curated images only</strong>. Not arbitrary food photos.',
      download: 'Download',
      tryDemoInstead: 'Try demo instead',
      scanningTips: 'Scanning tips',
      tip1: 'Fill the camera frame with the image, held flat.',
      tip2: 'Use good, even lighting and avoid glare.',
      tip3: 'Hold steady about 20–40 cm away.',
      tip4: 'One image at a time works best.',
      cap: {
        rice: { title: 'Leftover rice', note: 'Edible leftovers — save these.', alt: 'A plate of leftover white rice' },
        peels: { title: 'Fruit peels', note: 'Unavoidable scraps — compost.', alt: 'Citrus fruit peels' },
        bread: { title: 'Bread waste', note: 'Edible surplus — share or freeze.', alt: 'A large pile of discarded bread slices' },
        mixed: { title: 'Mixed leftovers', note: 'Use edible parts; compost the rest.', alt: 'Mixed vegetable leftovers and trimmings' },
        drink: { title: 'Drink waste', note: 'Drinks & cups — finish, keep, reuse.', alt: 'Discarded drinks and single-use cups' },
      },
    },
    quiz: {
      eyebrow: 'Reflection', title: 'Quick check', lede: 'Five short questions.',
      titleFor: 'Quick check for {x}',
      contextTarget: 'You last explored {x}. This quick check starts with questions about that exhibit.',
      contextAi: 'You last used AI Scan. This quick check starts with questions about AI assisted guidance.',
      contextNone: 'Answer a few questions about food waste and SDG 12.',
      makePledge: 'Make a pledge', pledgePick: "Pick one change you'll try.",
      savePledge: 'Save pledge', savedResults: 'Your saved results',
      noScore: 'No quiz score saved yet.', noPledge: 'No pledge saved yet.', retry: 'Retry',
      selectFirst: 'Please select a pledge first.',
      pledgeSavedPrefix: 'Pledge saved: ', savedScorePrefix: 'Quiz score: ', savedPledgePrefix: 'Pledge: ',
      lastChoicePrefix: 'Your last choice: ',
      qLabel: 'Q{n}.', optionAriaPrefix: 'Option: ',
      scorePerfect: 'Perfect — you know your food-waste facts.',
      scoreNice: 'Nice work. Check the answers to learn more.',
      scoreKeep: 'Keep exploring — revisit the facts and try again.',
    },
    about: {
      eyebrow: 'About', lede: 'Food-waste images become AR learning exhibits.',
      purposeH: 'Purpose',
      purposeB: 'Scan a curated food-waste image and a short AR exhibit explains what it represents, why it matters for SDG 12, and what you can do. Inspired by food-waste museum concepts that turn discarded food into moments of reflection.',
      sdgB: 'Responsible Consumption & Production. Target 12.3 aims to halve per-person food waste at retail and consumer levels by 2030.',
      whatShows: 'What it shows',
      arVizH: 'AR visualization',
      arVizB: 'A floating exhibit card anchored to the scanned image — title, SDG 12 tag, a statistic, and a recommended-action badge, with a highlight frame.',
      interactionH: 'Interaction',
      interactionB: 'A contextual bottom sheet appears on detection. Choose Throw, Save, Share, or Compost, and tap “Ask more” for a short explanation.',
      eduH: 'Educational content',
      eduB: 'Food-waste statistics from official sources, target-specific guidance, plus a quick quiz and a personal pledge.',
      howH: 'How it works',
      how1: 'Scan a curated food-waste image.',
      how2: 'An AR exhibit appears over it.',
      how3: 'Choose an action and read the guidance.',
      how4: 'Finish with a quick check and a pledge.',
      sourcesH: 'Sources',
      limitsH: 'Limitations',
      limit1: 'The curated AR scan recognises <strong>curated image targets only</strong>. Not arbitrary food photos.',
      limit2: '<strong>AI Scan is optional</strong>. It analyses one snapshot, not live object tracking.',
      limit3: 'Does <strong>not</strong> confirm food safety.',
      limit4: 'No exact weight or carbon estimates.',
      limit5: 'Camera needs HTTPS or localhost.',
      footerNote: 'PlateNudge also has an optional AI Scan that analyses one snapshot from your camera. The curated AR scan recognises only the curated image targets included in the app.',
    },
  },

  // -----------------------------------------------------------------------
  ms: {
    meta: {
      titleHome: 'PlateNudge',
      titleScan: 'PlateNudge Imbas',
      titleDemo: 'PlateNudge Demo',
      titleImages: 'PlateNudge Imej imbasan',
      titleQuiz: 'PlateNudge Semakan pantas',
      titleAbout: 'PlateNudge Perihal',
      titleAI: 'PlateNudge Imbas AI',
    },
    nav: { brand: 'PlateNudge', scan: 'Imbas', demo: 'Demo', about: 'Perihal', home: 'Laman utama', language: 'Bahasa' },
    hero: {
      chip: 'AR dan AI untuk SDG 12',
      title1: 'Imbas. Pelajari.',
      title2: 'Pilih lebih baik.',
      sub: 'Aplikasi pembelajaran sisa makanan AR dan AI untuk SDG 12.',
      startScan: 'Mula imbasan',
      startScanDesc: 'Untuk sasaran imej AR terpilih',
      tryDemo: 'Cuba demo',
      tryDemoDesc: 'Untuk panduan tanpa kamera',
      viewImages: 'Lihat imej imbasan',
      about: 'Perihal',
    },
    ticker: { wasted: '1.05B tan dibazirkan', households: '60% daripada isi rumah', sdg: 'SDG 12.3' },
    journey: {
      eyebrow: 'Untuk pelajar.',
      title: 'Dibina untuk keputusan makanan harian.',
      subtitle: 'Anda tidak perlu menjadi pakar kelestarian. PlateNudge menukar imej sisa makanan menjadi pameran AR ringkas yang membantu anda melihat isunya, memilih tindakan, dan merenung apa yang berlaku seterusnya.',
      card1Title: 'Lihat, bukan sekadar baca.',
      card1Body: 'Sisa makanan sering terasa tidak kelihatan selepas meninggalkan pinggan. PlateNudge menggunakan AR untuk membawa kesannya kembali di hadapan pelajar.',
      card1Alt: 'Ilustrasi: melihat kesan sisa makanan dalam AR',
      card2Title: 'Tindakan, bukan rasa bersalah.',
      card2Body: 'Aplikasi ini bukan sekadar berkata “kurangkan pembaziran”. Ia meminta orang ramai memilih tindakan. Mereka boleh buang, simpan, kongsi, atau kompos.',
      card2Alt: 'Ilustrasi: memilih tindakan sisa makanan',
      card3Title: 'Renungan, bukan syarahan.',
      card3Body: 'Selepas setiap imbasan, pengguna mendapat fakta ringkas, panduan khusus, dan semakan pantas untuk mengaitkan SDG 12 dengan tingkah laku harian.',
      card3Alt: 'Ilustrasi: merenung pilihan harian',
    },
    impact: {
      title: 'Pilihan kecil memberi kesan besar.',
      subtitle: 'PlateNudge mengaitkan fakta sisa makanan dengan keputusan mudah. Setiap imbasan menukar imej terpilih menjadi detik pembelajaran AR. Anda membina kesedaran, melihat kesannya, memilih tindakan, mendapat maklum balas, dan merenung.',
      stat1Num: '1.05B', stat1Label: 'tan makanan dibazirkan di seluruh dunia',
      stat1Body: 'Sisa makanan bukan sekadar masalah tong sampah. Ia mewakili air, tenaga, tenaga kerja, tanah, pengangkutan, dan pembungkusan yang dibazirkan.',
      stat2Num: '60%', stat2Label: 'datang daripada isi rumah',
      stat2Body: 'Keputusan isi rumah penting. PlateNudge menumpukan pada situasi harian yang boleh dikenali dan ditangani oleh pelajar.',
      stat3Num: '19%', stat3Label: 'makanan yang tersedia untuk pengguna dibazirkan',
      stat3Body: 'Aplikasi ini menggunakan fakta ringkas dan label sumber supaya pengguna dapat mengaitkan apa yang diimbas dengan data kelestarian sebenar.',
      stat4Num: 'SDG 12.3', stat4Label: 'kurangkan separuh sisa makanan menjelang 2030',
      stat4Body: 'PlateNudge menyokong kesedaran tentang penggunaan bertanggungjawab dan menggalakkan pengguna mencegah pembaziran sebelum pelupusan.',
      cta: 'Mula mengimbas',
      ctaNote: 'Imbas imej sisa makanan terpilih, pilih tindakan, kemudian lakukan semakan pantas.',
    },
    scan: {
      statusInitTitle: 'Memulakan kamera…',
      statusInitMsg: 'Benarkan akses kamera apabila diminta.',
      troubleshoot: 'Penyelesaian masalah',
      ts1: 'Buka halaman melalui <strong>HTTPS</strong> atau pada <strong>localhost</strong>.',
      ts2: 'Benarkan <strong>kebenaran kamera</strong> untuk laman ini.',
      ts3: 'Tutup aplikasi atau tab lain yang menggunakan kamera.',
      ts4: 'Gunakan <strong>Chrome / Firefox pada Android</strong> untuk hasil terbaik.',
      tryAgain: 'Cuba lagi',
      openDemo: 'Buka Mod Demo',
      howTo: 'Cara mengimbas?',
      step1: 'Langkah 1 · Halakan ke imej imbasan',
      scanningHint: 'Mencari imej sisa makanan terpilih…',
      sheetEyebrow: 'Pameran',
      sheetTitleDefault: 'Pameran sisa makanan',
      detected: 'Dikesan',
      homeAria: 'Kembali ke laman utama',
      sheetToggle: 'Kuncupkan atau kembangkan panel',
      tapForActions: 'Ketik untuk tindakan',
      chooseActionBelow: 'Pilih tindakan di bawah',
      step2: 'Langkah 2 · Pilih tindakan anda',
      step3: 'Langkah 3 · Ketahui lebih lanjut atau buat semakan pantas',
      chooseNext: 'Pilih apa yang berlaku seterusnya.',
      askMore: 'Ketahui lagi',
      quickCheck: 'Semakan pantas →',
      backHome: '← Kembali ke laman utama',
      guideTitle: 'Cara mengimbas',
      g1: 'Buka <strong>Imej imbasan</strong> pada skrin lain — atau cetak/muat turunnya.',
      g2: 'Halakan kamera ke satu imej sisa makanan terpilih.',
      g3: 'Penuhi sebahagian besar bingkai dengan imej itu.',
      g4: 'Pegang dengan stabil dan pencahayaan yang baik.',
      g5: 'Tunggu pameran muncul.',
      gotIt: 'Faham',
      askLook: 'Apa yang saya lihat?',
      askWhy: 'Mengapa ia penting',
      askDo: 'Apa yang patut saya lakukan?',
      askSafety: 'Nota keselamatan',
      status: {
        permission: { title: 'Kebenaran kamera diperlukan', message: 'Ketik “Benarkan” apabila pelayar meminta untuk menggunakan kamera.' },
        starting: { title: 'Memulakan kamera…', message: 'Menyediakan kamera — beberapa saat.' },
        loading: { title: 'Memuatkan AR…', message: 'Menyediakan penjejakan imej.' },
        ready: { title: 'Sedia untuk mengimbas', message: 'Halakan telefon anda ke imej sisa makanan.' },
        notargets: { title: 'Sasaran imbasan belum dipasang', message: 'Fail sasaran imej yang dikompil belum disediakan. Tambah public/assets/targets/food-waste-targets.mind (lihat README) — atau gunakan Mod Demo yang berfungsi sekarang.' },
        insecure: { title: 'HTTPS diperlukan untuk kamera', message: 'Buka halaman ini melalui HTTPS atau pada localhost, kemudian cuba lagi. Mod Demo berfungsi tanpa kamera.' },
        unsupported: { title: 'Kamera tidak disokong', message: 'Pelayar ini tidak dapat mengakses kamera. Cuba Chrome / Firefox pada Android, atau gunakan Mod Demo.' },
        denied: { title: 'Kebenaran kamera ditolak', message: 'Benarkan akses kamera untuk laman ini, kemudian ketik “Cuba lagi”.' },
        nocamera: { title: 'Tiada kamera ditemui', message: 'Tiada kamera ditemui pada peranti ini. Gunakan Mod Demo sebaliknya.' },
        inuse: { title: 'Kamera tidak tersedia', message: 'Aplikasi atau tab lain sedang menggunakan kamera. Tutupnya, kemudian ketik “Cuba lagi”.' },
        failed: { title: 'AR gagal dimuatkan', message: 'Penjejakan imej tidak dapat dimulakan tepat pada masanya. Cuba lagi, atau gunakan Mod Demo.' },
      },
    },
    actions: {
      throwAway: { short: 'Buang', label: 'Buang', aria: 'Buang makanan', feedback: 'Membuang makanan yang masih boleh dimakan membazirkan air, tanah dan tenaga yang digunakan untuk menghasilkannya.' },
      saveLeftovers: { short: 'Simpan', label: 'Simpan Lebihan', aria: 'Simpan lebihan untuk kemudian', feedback: 'Menyimpan lebihan makanan ialah cara paling mudah untuk mengurangkan sisa makanan isi rumah.' },
      share: { short: 'Kongsi', label: 'Kongsi', aria: 'Kongsi lebihan makanan', feedback: 'Berkongsi lebihan yang selamat memberi makan kepada orang lain, bukannya memenuhi tong sampah.' },
      compost: { short: 'Kompos', label: 'Kompos', aria: 'Kompos sisa', feedback: 'Kompos apa yang tidak boleh dimakan — ia mengembalikan nutrien kepada tanah.' },
    },
    common: { sourcePrefix: 'Sumber: ', bestPrefix: 'Terbaik: ', recommendedPrefix: 'Disyorkan: ', close: 'Tutup' },
    demo: { chip: 'Mod Demo', title: 'Pilih pameran', lede: 'Ketik imej sisa makanan — tiada kamera diperlukan.' },
    ai: {
      cta: 'Imbas AI',
      title: 'Imbas AI',
      intro: 'Halakan kamera anda pada sisa makanan. PlateNudge akan menganalisis satu tangkapan dan mencadangkan langkah seterusnya.',
      scanDesc: 'Untuk panduan AI berasaskan kamera',
      // Aliran imbasan kamera
      useCamera: 'Guna kamera',
      chooseInstead: 'Pilih imej sebaliknya',
      privacy: 'PlateNudge menganalisis satu tangkapan semasa mengimbas. Ia tidak menyimpan foto anda.',
      pointCamera: 'Halakan kamera pada sisa makanan',
      lookingClues: 'Mencari petunjuk sisa makanan',
      analysingSnapshot: 'Menganalisis tangkapan',
      creatingExhibit: 'Mencipta pameran pembelajaran anda',
      sceneDetected: 'Pemandangan sisa makanan dikesan',
      snapshotAnalysed: 'Tangkapan dianalisis',
      scanAgain: 'Imbas semula',
      cannotSeeTitle: 'Saya belum nampak sisa makanan dengan jelas',
      retryHint: 'Dekatkan lagi, tingkatkan pencahayaan, atau cuba sudut lain.',
      camFailedTitle: 'Kamera tidak dapat dimulakan',
      camFailedMsg: 'Kamera tidak dapat dimulakan tepat pada masanya. Cuba lagi atau pilih imej.',
      unavailableTitle: 'Imbas AI tidak tersedia',
      notConfiguredTitle: 'Imbas AI belum disediakan',
      // Panduan Imbas AI
      howAiScan: 'Cara Imbas AI berfungsi',
      guideTitle: 'Cara Imbas AI berfungsi',
      g1: 'Halakan kamera pada sisa makanan.',
      g2: 'Pastikan makanan jelas kelihatan.',
      g3: 'Gunakan pencahayaan yang baik dan elakkan imej kabur.',
      g4: 'PlateNudge menganalisis satu tangkapan sahaja.',
      g5: 'Semak pameran AI dan pilih tindakan seterusnya.',
      guidePrivacy: 'PlateNudge tidak menyimpan foto anda.',
      // Kongsi / muat naik sandaran
      chooseLabel: 'Pilih atau ambil foto',
      takePhoto: 'Ambil foto',
      chooseImage: 'Pilih imej',
      changePhoto: 'Tukar foto',
      analyse: 'Analisis foto',
      analysing: 'Menganalisis foto…',
      loadingHint: 'Mencari petunjuk sisa makanan yang kelihatan…',
      aiExhibit: 'Pameran AI',
      visibleItems: 'Item kelihatan',
      uncertainItems: 'Item tidak pasti',
      wasteType: 'Jenis sisa',
      confidence: 'Keyakinan',
      confLow: 'Rendah', confMedium: 'Sederhana', confHigh: 'Tinggi',
      recommendedAction: 'Tindakan disyorkan',
      whyAction: 'Mengapa tindakan ini',
      followUps: 'Anda mungkin bertanya',
      ask: 'Tanya',
      askPlaceholder: 'Tanya satu soalan…',
      disclaimer: 'Panduan berbantukan AI sahaja. PlateNudge tidak boleh mengesahkan keselamatan makanan.',
      lowConfidenceNote: 'Keyakinan rendah. Sila semak semula sebelum bertindak.',
      tryScan: 'Mula imbasan AR terpilih',
      errNoImage: 'Sila pilih foto dahulu.',
      errType: 'Jenis imej tidak disokong. Gunakan JPG, PNG, atau WebP.',
      errTooLarge: 'Imej itu terlalu besar. Sila gunakan foto yang lebih kecil.',
      errUnavailable: 'Analisis AI tidak tersedia buat masa ini. Anda masih boleh menggunakan Imbasan AR terpilih atau Mod Demo.',
      errNotConfigured: 'Imbas AI belum dikonfigurasikan lagi. Anda masih boleh menggunakan Imbasan AR terpilih atau Mod Demo.',
    },
    images: {
      title: 'Imej imbasan',
      lede: 'Buka satu pada skrin lain (atau cetaknya), kemudian imbasnya dari halaman Imbas.',
      curatedNote: 'PlateNudge hanya mengenali <strong>imej terpilih ini sahaja</strong>. Bukan sebarang foto makanan.',
      download: 'Muat turun',
      tryDemoInstead: 'Cuba demo sebaliknya',
      scanningTips: 'Petua mengimbas',
      tip1: 'Penuhi bingkai kamera dengan imej, dipegang rata.',
      tip2: 'Gunakan pencahayaan yang baik dan sekata, elakkan silau.',
      tip3: 'Pegang dengan stabil kira-kira 20–40 cm jauh.',
      tip4: 'Satu imej pada satu masa adalah terbaik.',
      cap: {
        rice: { title: 'Sisa nasi', note: 'Lebihan boleh dimakan — simpan.', alt: 'Sepinggan nasi putih lebihan' },
        peels: { title: 'Kulit buah', note: 'Sisa tidak dapat dielak — kompos.', alt: 'Kulit buah sitrus' },
        bread: { title: 'Sisa roti', note: 'Lebihan boleh dimakan — kongsi atau bekukan.', alt: 'Timbunan besar kepingan roti yang dibuang' },
        mixed: { title: 'Lebihan bercampur', note: 'Guna bahagian boleh dimakan; kompos selebihnya.', alt: 'Lebihan dan cebisan sayur bercampur' },
        drink: { title: 'Sisa minuman', note: 'Minuman & cawan — habiskan, simpan, guna semula.', alt: 'Minuman dan cawan sekali guna yang dibuang' },
      },
    },
    quiz: {
      eyebrow: 'Renungan', title: 'Semakan pantas', lede: 'Lima soalan ringkas.',
      titleFor: 'Semakan pantas untuk {x}',
      contextTarget: 'Anda baru meneroka {x}. Semakan pantas ini bermula dengan soalan tentang pameran itu.',
      contextAi: 'Anda baru menggunakan Imbas AI. Semakan pantas ini bermula dengan soalan tentang panduan berbantukan AI.',
      contextNone: 'Jawab beberapa soalan tentang sisa makanan dan SDG 12.',
      makePledge: 'Buat ikrar', pledgePick: 'Pilih satu perubahan yang akan anda cuba.',
      savePledge: 'Simpan ikrar', savedResults: 'Keputusan tersimpan anda',
      noScore: 'Tiada skor kuiz disimpan lagi.', noPledge: 'Tiada ikrar disimpan lagi.', retry: 'Cuba semula',
      selectFirst: 'Sila pilih ikrar dahulu.',
      pledgeSavedPrefix: 'Ikrar disimpan: ', savedScorePrefix: 'Skor kuiz: ', savedPledgePrefix: 'Ikrar: ',
      lastChoicePrefix: 'Pilihan terakhir anda: ',
      qLabel: 'S{n}.', optionAriaPrefix: 'Pilihan: ',
      scorePerfect: 'Sempurna — anda tahu fakta sisa makanan.',
      scoreNice: 'Syabas. Semak jawapan untuk ketahui lebih lanjut.',
      scoreKeep: 'Teruskan meneroka — semak semula fakta dan cuba lagi.',
    },
    about: {
      eyebrow: 'Perihal', lede: 'Imej sisa makanan menjadi pameran pembelajaran AR.',
      purposeH: 'Tujuan',
      purposeB: 'Imbas imej sisa makanan terpilih dan pameran AR ringkas akan menerangkan apa yang diwakilinya, mengapa ia penting untuk SDG 12, dan apa yang boleh anda lakukan. Diilhamkan oleh konsep muzium sisa makanan yang menjadikan makanan terbuang sebagai detik renungan.',
      sdgB: 'Penggunaan & Pengeluaran Bertanggungjawab. Sasaran 12.3 bertujuan mengurangkan separuh sisa makanan setiap orang di peringkat runcit dan pengguna menjelang 2030.',
      whatShows: 'Apa yang ditunjukkan',
      arVizH: 'Visualisasi AR',
      arVizB: 'Kad pameran terapung yang ditambat pada imej yang diimbas — tajuk, tag SDG 12, satu statistik, dan lencana tindakan disyorkan, dengan bingkai sorotan.',
      interactionH: 'Interaksi',
      interactionB: 'Helaian bawah kontekstual muncul apabila dikesan. Pilih Buang, Simpan, Kongsi, atau Kompos, dan ketik “Ketahui lagi” untuk penerangan ringkas.',
      eduH: 'Kandungan pendidikan',
      eduB: 'Statistik sisa makanan daripada sumber rasmi, panduan khusus, serta kuiz pantas dan ikrar peribadi.',
      howH: 'Cara ia berfungsi',
      how1: 'Imbas imej sisa makanan terpilih.',
      how2: 'Pameran AR muncul di atasnya.',
      how3: 'Pilih tindakan dan baca panduannya.',
      how4: 'Akhiri dengan semakan pantas dan ikrar.',
      sourcesH: 'Sumber',
      limitsH: 'Batasan',
      limit1: 'Imbasan AR terpilih mengenali <strong>sasaran imej terpilih sahaja</strong>. Bukan sebarang foto makanan.',
      limit2: '<strong>Imbas AI pilihan</strong>. Ia menganalisis satu tangkapan, bukan penjejakan objek langsung.',
      limit3: '<strong>Tidak</strong> mengesahkan keselamatan makanan.',
      limit4: 'Tiada anggaran berat atau karbon yang tepat.',
      limit5: 'Kamera memerlukan HTTPS atau localhost.',
      footerNote: 'PlateNudge juga mempunyai Imbas AI pilihan yang menganalisis satu tangkapan daripada kamera anda. Imbasan AR terpilih hanya mengenali sasaran imej terpilih yang disertakan dalam aplikasi.',
    },
  },

  // -----------------------------------------------------------------------
  'zh-CN': {
    meta: {
      titleHome: 'PlateNudge',
      titleScan: 'PlateNudge 扫描',
      titleDemo: 'PlateNudge 演示',
      titleImages: 'PlateNudge 扫描图片',
      titleQuiz: 'PlateNudge 快速测验',
      titleAbout: 'PlateNudge 关于',
      titleAI: 'PlateNudge AI 扫描',
    },
    nav: { brand: 'PlateNudge', scan: '扫描', demo: '演示', about: '关于', home: '首页', language: '语言' },
    hero: {
      chip: '面向 SDG 12 的 AR 与 AI',
      title1: '扫描。了解。',
      title2: '做出更好的选择。',
      sub: '面向 SDG 12 的 AR 与 AI 食物浪费学习应用。',
      startScan: '开始扫描',
      startScanDesc: '用于指定的 AR 图像目标',
      tryDemo: '试用演示',
      tryDemoDesc: '用于无需相机的演示',
      viewImages: '查看扫描图片',
      about: '关于',
    },
    ticker: { wasted: '1.05B 吨被浪费', households: '60% 来自家庭', sdg: 'SDG 12.3' },
    journey: {
      eyebrow: '为学习者而设。',
      title: '为日常饮食决定而打造。',
      subtitle: '你不需要成为可持续发展专家。PlateNudge 把食物浪费的图片变成简短的 AR 展览，帮助你看见问题、选择行动，并思考接下来会发生什么。',
      card1Title: '看见，而不只是阅读。',
      card1Body: '食物离开餐盘后，浪费往往变得看不见。PlateNudge 用 AR 把这种影响重新呈现在学习者眼前。',
      card1Alt: '插图：在 AR 中看见食物浪费的影响',
      card2Title: '行动，而非内疚。',
      card2Body: '这个应用不只是说“少浪费”。它请用户选择会怎么做。可以丢弃、保存、分享或堆肥。',
      card2Alt: '插图：选择一项食物浪费行动',
      card3Title: '反思，而非说教。',
      card3Body: '每次扫描后，用户会获得简短事实、针对性建议，以及一个快速测验，把 SDG 12 与日常行为联系起来。',
      card3Alt: '插图：反思日常的选择',
    },
    impact: {
      title: '小小的选择，积少成多。',
      subtitle: 'PlateNudge 把食物浪费的事实与简单的决定联系起来。每次扫描都会把一张指定图片变成一个 AR 学习时刻。你会建立意识、看见影响、选择行动、获得反馈并反思。',
      stat1Num: '1.05B', stat1Label: '全球被浪费的食物（吨）',
      stat1Body: '食物浪费不只是垃圾桶的问题。它代表着被浪费的水、能源、人力、土地、运输和包装。',
      stat2Num: '60%', stat2Label: '来自家庭',
      stat2Body: '家庭的决定很重要。PlateNudge 聚焦于学习者能够辨认并采取行动的日常情境。',
      stat3Num: '19%', stat3Label: '提供给消费者的食物被浪费',
      stat3Body: '应用使用简短事实和来源标签，让用户把所扫描的内容与真实的可持续发展数据联系起来。',
      stat4Num: 'SDG 12.3', stat4Label: '到 2030 年将食物浪费减半',
      stat4Body: 'PlateNudge 倡导负责任消费的意识，并鼓励用户在丢弃之前预防浪费。',
      cta: '开始扫描',
      ctaNote: '扫描一张指定的食物浪费图片，选择一个行动，然后完成快速测验。',
    },
    scan: {
      statusInitTitle: '正在启动相机…',
      statusInitMsg: '在系统询问时请允许使用相机。',
      troubleshoot: '疑难排解',
      ts1: '请通过 <strong>HTTPS</strong> 或在 <strong>localhost</strong> 上打开此页面。',
      ts2: '为本网站允许<strong>相机权限</strong>。',
      ts3: '关闭其他正在使用相机的应用或标签页。',
      ts4: '使用 <strong>Android 上的 Chrome / Firefox</strong> 可获得最佳效果。',
      tryAgain: '重试',
      openDemo: '打开演示模式',
      howTo: '如何扫描？',
      step1: '第 1 步 · 对准扫描图片',
      scanningHint: '正在寻找指定的食物浪费图片…',
      sheetEyebrow: '展品',
      sheetTitleDefault: '食物浪费展品',
      detected: '已识别',
      homeAria: '返回首页',
      sheetToggle: '收起或展开面板',
      tapForActions: '点击查看操作',
      chooseActionBelow: '在下方选择操作',
      step2: '第 2 步 · 选择你会怎么做',
      step3: '第 3 步 · 了解更多或完成快速测验',
      chooseNext: '选择接下来会怎样。',
      askMore: '了解更多',
      quickCheck: '快速测验 →',
      backHome: '← 返回首页',
      guideTitle: '如何扫描',
      g1: '在另一个屏幕上打开<strong>扫描图片</strong>，或将它们打印／下载。',
      g2: '将相机对准一张指定的食物浪费图片。',
      g3: '让图片占据画面的大部分。',
      g4: '保持稳定，并确保光线充足。',
      g5: '等待展品出现。',
      gotIt: '知道了',
      askLook: '我正在看什么？',
      askWhy: '为什么重要',
      askDo: '我该怎么做？',
      askSafety: '安全提示',
      status: {
        permission: { title: '需要相机权限', message: '当浏览器请求使用相机时，请点按“允许”。' },
        starting: { title: '正在启动相机…', message: '正在准备相机，需要几秒钟。' },
        loading: { title: '正在加载 AR…', message: '正在准备图像追踪。' },
        ready: { title: '可以开始扫描', message: '将手机对准一张食物浪费图片。' },
        notargets: { title: '尚未安装扫描目标', message: '编译后的图像目标文件尚未设置。请添加 public/assets/targets/food-waste-targets.mind（参见 README），或使用现在即可运行的演示模式。' },
        insecure: { title: '相机需要 HTTPS', message: '请通过 HTTPS 或在 localhost 上打开此页面，然后重试。演示模式无需相机即可使用。' },
        unsupported: { title: '不支持相机', message: '此浏览器无法访问相机。请尝试 Android 上的 Chrome / Firefox，或使用演示模式。' },
        denied: { title: '相机权限被拒绝', message: '请为本网站允许相机访问，然后点按“重试”。' },
        nocamera: { title: '未找到相机', message: '在此设备上未找到相机。请改用演示模式。' },
        inuse: { title: '相机不可用', message: '另一个应用或标签页正在使用相机。请关闭它，然后点按“重试”。' },
        failed: { title: 'AR 加载失败', message: '图像追踪未能及时启动。请重试，或使用演示模式。' },
      },
    },
    actions: {
      throwAway: { short: '丢弃', label: '丢弃', aria: '丢弃食物', feedback: '把还能吃的食物扔进垃圾桶，会浪费用来生产它的水、土地和能源。' },
      saveLeftovers: { short: '保存', label: '保存剩菜', aria: '保存剩菜留待稍后', feedback: '保存剩菜是减少家庭食物浪费最简单的方法。' },
      share: { short: '分享', label: '分享', aria: '分享多余的食物', feedback: '分享安全的余量食物能让人受惠，而不是填满垃圾桶。' },
      compost: { short: '堆肥', label: '堆肥', aria: '把残渣堆肥', feedback: '把不能吃的部分拿去堆肥——它能把养分归还给土壤。' },
    },
    common: { sourcePrefix: '来源：', bestPrefix: '最佳：', recommendedPrefix: '建议：', close: '关闭' },
    demo: { chip: '演示模式', title: '选择一个展品', lede: '点按一张食物浪费图片——无需相机。' },
    ai: {
      cta: 'AI 扫描',
      title: 'AI 扫描',
      intro: '将相机对准食物浪费。PlateNudge 会分析一张快照并建议下一步该怎么做。',
      scanDesc: '用于基于相机的 AI 指导',
      // 相机扫描流程
      useCamera: '使用相机',
      chooseInstead: '改为选择图片',
      privacy: 'PlateNudge 扫描时只分析一张快照。它不会保存你的照片。',
      pointCamera: '将相机对准食物浪费',
      lookingClues: '正在寻找食物浪费的线索',
      analysingSnapshot: '正在分析快照',
      creatingExhibit: '正在生成你的学习卡片',
      sceneDetected: '已识别食物浪费场景',
      snapshotAnalysed: '快照已分析',
      scanAgain: '再次扫描',
      cannotSeeTitle: '暂时看不清食物浪费',
      retryHint: '靠近一点、改善光线，或换个角度再试。',
      camFailedTitle: '相机无法启动',
      camFailedMsg: '相机未能及时启动。请重试或改为选择图片。',
      unavailableTitle: 'AI 扫描暂时不可用',
      notConfiguredTitle: 'AI 扫描尚未设置',
      // AI 扫描指南
      howAiScan: 'AI 扫描如何运作',
      guideTitle: 'AI 扫描如何运作',
      g1: '将相机对准食物浪费场景。',
      g2: '确保食物清楚可见。',
      g3: '使用良好光线并避免模糊。',
      g4: 'PlateNudge 只分析一张快照。',
      g5: '查看 AI 学习卡片并选择下一步行动。',
      guidePrivacy: 'PlateNudge 不会保存你的照片。',
      // 共用 / 上传后备
      chooseLabel: '选择或拍摄照片',
      takePhoto: '拍摄照片',
      chooseImage: '选择图片',
      changePhoto: '更换照片',
      analyse: '分析照片',
      analysing: '正在分析照片…',
      loadingHint: '正在寻找可见的食物浪费线索…',
      aiExhibit: 'AI 展品',
      visibleItems: '可见物品',
      uncertainItems: '不确定的物品',
      wasteType: '浪费类型',
      confidence: '置信度',
      confLow: '低', confMedium: '中', confHigh: '高',
      recommendedAction: '建议行动',
      whyAction: '为什么这样做',
      followUps: '你可以问',
      ask: '提问',
      askPlaceholder: '输入一个问题…',
      disclaimer: '仅为 AI 辅助建议。PlateNudge 无法确认食物是否安全食用。',
      lowConfidenceNote: '置信度低。请在行动前再次确认。',
      tryScan: '开始指定图片 AR 扫描',
      errNoImage: '请先选择一张照片。',
      errType: '不支持的图片类型。请使用 JPG、PNG 或 WebP。',
      errTooLarge: '该图片太大。请使用更小的照片。',
      errUnavailable: 'AI 分析暂时不可用。你仍然可以使用指定图片 AR 扫描或演示模式。',
      errNotConfigured: 'AI 扫描尚未配置。你仍然可以使用指定图片 AR 扫描或演示模式。',
    },
    images: {
      title: '扫描图片',
      lede: '在另一个屏幕上打开其中一张（或打印出来），然后在扫描页面进行扫描。',
      curatedNote: 'PlateNudge 仅识别<strong>这些指定图片</strong>。无法识别任意的食物照片。',
      download: '下载',
      tryDemoInstead: '改用演示',
      scanningTips: '扫描技巧',
      tip1: '让图片填满相机画面，并保持平整。',
      tip2: '使用良好、均匀的光线，避免反光。',
      tip3: '保持稳定，距离约 20–40 厘米。',
      tip4: '一次扫描一张图片效果最好。',
      cap: {
        rice: { title: '剩饭', note: '可食用的剩余——保存起来。', alt: '一盘剩下的白米饭' },
        peels: { title: '果皮', note: '无法避免的残渣——堆肥。', alt: '柑橘类水果的果皮' },
        bread: { title: '面包浪费', note: '可食用的余量——分享或冷冻。', alt: '一大堆被丢弃的面包片' },
        mixed: { title: '混合剩菜', note: '先用可食用的部分；其余拿去堆肥。', alt: '混合的蔬菜剩余与切剩部分' },
        drink: { title: '饮料浪费', note: '饮料与杯子——喝完、保存、重复使用。', alt: '被丢弃的饮料和一次性杯子' },
      },
    },
    quiz: {
      eyebrow: '反思', title: '快速测验', lede: '五道简短的题目。',
      titleFor: '{x}快速测验',
      contextTarget: '你刚刚了解了{x}。本次快速测验会先从该展品的相关问题开始。',
      contextAi: '你刚刚使用了 AI 扫描。本次快速测验会先从 AI 辅助建议的相关问题开始。',
      contextNone: '回答几个关于食物浪费和 SDG 12 的问题。',
      makePledge: '做出承诺', pledgePick: '选择一个你愿意尝试的改变。',
      savePledge: '保存承诺', savedResults: '你保存的结果',
      noScore: '尚未保存测验成绩。', noPledge: '尚未保存承诺。', retry: '重试',
      selectFirst: '请先选择一个承诺。',
      pledgeSavedPrefix: '承诺已保存：', savedScorePrefix: '测验成绩：', savedPledgePrefix: '承诺：',
      lastChoicePrefix: '你上次的选择：',
      qLabel: '第 {n} 题', optionAriaPrefix: '选项：',
      scorePerfect: '满分——你很了解食物浪费的知识。',
      scoreNice: '做得好。查看答案以了解更多。',
      scoreKeep: '继续探索——回顾这些事实再试一次。',
    },
    about: {
      eyebrow: '关于', lede: '食物浪费的图片变成 AR 学习展品。',
      purposeH: '目的',
      purposeB: '扫描一张指定的食物浪费图片，简短的 AR 展品会解释它代表什么、为何对 SDG 12 重要，以及你能做什么。灵感来自把被丢弃的食物变成反思时刻的食物浪费博物馆理念。',
      sdgB: '负责任消费与生产。目标 12.3 旨在到 2030 年将零售和消费层面的人均食物浪费减半。',
      whatShows: '它展示什么',
      arVizH: 'AR 可视化',
      arVizB: '一张浮动的展品卡，锚定在被扫描的图片上——包含标题、SDG 12 标签、一项统计数据和推荐行动徽章，并带有高亮边框。',
      interactionH: '互动',
      interactionB: '识别到目标时会出现一个情境式底部面板。选择丢弃、保存、分享或堆肥，并点按“了解更多”获取简短说明。',
      eduH: '教育内容',
      eduB: '来自官方来源的食物浪费统计、针对性建议，以及一个快速测验和个人承诺。',
      howH: '运作方式',
      how1: '扫描一张指定的食物浪费图片。',
      how2: '一个 AR 展品会出现在它上方。',
      how3: '选择一个行动并阅读建议。',
      how4: '以快速测验和承诺作结。',
      sourcesH: '来源',
      limitsH: '限制',
      limit1: '指定图片 AR 扫描仅识别<strong>指定的图像目标</strong>。无法识别任意的食物照片。',
      limit2: '<strong>AI 扫描为可选功能</strong>。它只分析一张快照，并非实时物体追踪。',
      limit3: '<strong>不会</strong>确认食物是否安全食用。',
      limit4: '不提供精确的重量或碳排放估算。',
      limit5: '相机需要 HTTPS 或 localhost。',
      footerNote: 'PlateNudge 还提供可选的 AI 扫描，会分析来自你相机的一张快照。指定图片 AR 扫描只识别应用内附带的指定图像目标。',
    },
  },
};

// ===========================================================================
// Localised DATA (food targets + quiz). English lives in the source modules
// (food-targets.js / content.js); here we only add ms + zh-CN. A request for
// English returns undefined from t(), so callers fall back to the source.
// ===========================================================================
const dataTranslations = {
  ms: {
    targets: {
      'leftover-rice': {
        title: 'Sisa nasi', shortLabel: 'Lebihan boleh dimakan', wasteType: 'Makanan dimasak',
        quickFact: 'Isi rumah menyumbang kira-kira 60% daripada sisa makanan global.',
        defaultMessage: 'Jika masih selamat, menyimpan lebihan biasanya lebih baik daripada membuangnya.',
        actionGuidance: {
          throwAway: 'Buang hanya jika sudah rosak atau tidak selamat.',
          saveLeftovers: 'Simpan dalam bekas yang bersih dan makan segera.',
          share: 'Kongsi hanya jika ia selamat dan bersih.',
          compost: 'Gunakan kompos untuk sisa yang tidak dapat dielak, bukan makanan yang boleh dimakan.',
        },
        askMoreTitle: 'Mengapa ini penting',
        askMoreExplanation: 'Makanan dimasak yang dibazirkan mewakili sumber terkandung seperti air, tenaga, tenaga kerja, pengangkutan, dan pembungkusan.',
        safetyNote: 'Aplikasi ini tidak boleh mengesahkan keselamatan makanan. Periksa bau, tempoh simpanan, dan pencemaran. Nasi yang dimasak khususnya perlu disejukkan dengan cepat, disimpan dalam peti sejuk, dan dipanaskan semula sekali sahaja.',
      },
      'fruit-peels': {
        title: 'Kulit buah', shortLabel: 'Sisa tidak dapat dielak', wasteType: 'Kulit & jangat',
        quickFact: 'Pengkomposan mengembalikan nutrien daripada sisa kepada tanah.',
        defaultMessage: 'Kulit biasanya tidak boleh dimakan — kompos ia dan bukannya menghantar ke tapak pelupusan.',
        actionGuidance: {
          throwAway: 'Elakkan tapak pelupusan jika kompos tersedia.',
          saveLeftovers: 'Sesetengah kulit boleh digunakan — cth. kulit sitrus sebelum mengkompos selebihnya.',
          share: 'Tidak sesuai untuk dikongsi.',
          compost: 'Kompos kulit dan jangat untuk menyuburkan tanah.',
        },
        askMoreTitle: 'Mengapa mengkompos sisa',
        askMoreExplanation: 'Pengkomposan ialah langkah yang betul untuk sisa yang benar-benar tidak boleh dimakan. Ia menghalang bahan organik daripada tapak pelupusan (tempat ia membebaskan metana) dan mengembalikan nutrien kepada tanah.',
        safetyNote: 'Kompos sisa yang tidak dapat dielak sahaja — makanan yang boleh dimakan patut dimakan, disimpan, atau dikongsi dahulu.',
      },
      'bread-waste': {
        title: 'Sisa roti', shortLabel: 'Lebihan / boleh dimakan', wasteType: 'Lebihan bakeri',
        quickFact: 'Kira-kira 19% makanan yang tersedia untuk pengguna dibazirkan.',
        defaultMessage: 'Kebanyakan roti ini kelihatan boleh dimakan — berkongsi atau membekukan lebih baik daripada membuangnya.',
        actionGuidance: {
          throwAway: 'Pilihan terakhir — hanya jika berkulat atau terlalu basi.',
          saveLeftovers: 'Bekukan roti untuk memanjangkan jangka hayatnya, atau gunakannya untuk roti bakar, serbuk roti, atau kroton.',
          share: 'Agihkan semula lebihan yang selamat kepada orang ramai atau bank makanan.',
          compost: 'Kompos hanya kepingan yang berkulat atau benar-benar tidak boleh dimakan.',
        },
        askMoreTitle: 'Mengapa lebihan penting',
        askMoreExplanation: 'Membuang lebihan yang boleh dimakan membazirkan air, tanah, tenaga, dan tenaga kerja yang digunakan untuk menghasilkannya. Mencegah dan mengagihkan semula lebihan berada di puncak hierarki sisa makanan.',
        safetyNote: 'Aplikasi ini tidak boleh mengesahkan keselamatan makanan. Jangan kongsi atau makan roti yang menunjukkan kulat.',
      },
      'mixed-leftovers': {
        title: 'Lebihan bercampur', shortLabel: 'Sisa pinggan', wasteType: 'Bercampur / cebisan',
        quickFact: 'SDG 12.3 bertujuan mengurangkan separuh sisa makanan setiap orang menjelang 2030.',
        defaultMessage: 'Gunakan bahagian yang boleh dimakan dahulu; kompos hanya cebisan yang benar-benar sisa.',
        actionGuidance: {
          throwAway: 'Sisa bercampur dalam tong sukar dipulihkan — asingkannya sebaliknya.',
          saveLeftovers: 'Gunakan bahagian boleh dimakan (batang, kuntum, lada) dalam stok, sup, atau goreng kilas.',
          share: 'Kongsi bahagian boleh dimakan sebelum ia rosak.',
          compost: 'Kompos sisa yang sebenar (kulit, teras, jangat).',
        },
        askMoreTitle: 'Mengapa pencegahan penting',
        askMoreExplanation: 'Kebanyakan sisa pinggan dan penyediaan boleh dielakkan. Merancang bahagian, menggunakan cebisan yang boleh dimakan, dan mengkompos selebihnya sahaja mengurangkan sisa di punca — langkah paling murah dan berkesan.',
        safetyNote: 'Aplikasi ini tidak boleh mengesahkan keselamatan makanan. Apabila ragu-ragu, jangan makan atau kongsi makanan yang meragukan.',
      },
      'drink-waste': {
        title: 'Sisa minuman', shortLabel: 'Minuman & cawan', wasteType: 'Minuman / sekali guna',
        quickFact: 'Minuman yang dibazirkan turut membazirkan air, bahan, dan pembungkusan.',
        defaultMessage: 'Buat atau beli hanya apa yang akan anda habiskan, dan pilih cawan boleh guna semula.',
        actionGuidance: {
          throwAway: 'Tuang cecair yang tidak dapat dielak; kitar semula tin dan botol yang bersih.',
          saveLeftovers: 'Simpan minuman yang belum habis dalam keadaan tertutup untuk kemudian, dan utamakan cawan boleh guna semula.',
          share: 'Minuman tertutup yang belum dibuka boleh dikongsi; yang sudah dibuka biasanya tidak boleh.',
          compost: 'Kebanyakan cawan bersalut plastik — tidak boleh dikompos. Kitar semula jika boleh.',
        },
        askMoreTitle: 'Mengapa minuman penting',
        askMoreExplanation: 'Minuman membawa air dan bahan terkandung, dan cawan sekali guna menambah sisa pembungkusan. Membeli hanya apa yang anda habiskan dan menggunakan barangan boleh guna semula mengurangkan kedua-duanya.',
        safetyNote: 'Aplikasi ini tidak boleh mengesahkan keselamatan minuman. Buang minuman yang dibiarkan terlalu lama.',
      },
    },
    quizQuestions: [
      {
        question: 'Matlamat Pembangunan Mampan yang manakah sejajar dengan PlateNudge?',
        options: ['SDG 2', 'SDG 7', 'SDG 12', 'SDG 15'],
        explanation: 'PlateNudge sejajar dengan SDG 12 — Penggunaan dan Pengeluaran Bertanggungjawab.',
      },
      {
        question: 'Tindakan manakah yang umumnya terbaik untuk lebihan yang boleh dimakan?',
        options: ['Buang', 'Simpan untuk kemudian', 'Kompos', 'Abaikan'],
        explanation: 'Menyimpan lebihan yang boleh dimakan untuk dimakan kemudian ialah salah satu cara paling mudah dan berkesan untuk mengurangkan sisa makanan isi rumah.',
      },
      {
        question: 'Bilakah pengkomposan paling sesuai?',
        options: ['Untuk semua sisa makanan', 'Hanya untuk makanan dimasak', 'Untuk sisa tidak boleh dimakan yang tidak dapat dielak', 'Tidak sekali-kali'],
        explanation: 'Pengkomposan paling sesuai untuk sisa yang tidak dapat dielak seperti kulit, teras, dan cangkerang — makanan yang tidak boleh dimakan, disimpan, atau dikongsi.',
      },
      {
        question: 'Mengapakah sisa makanan lebih daripada sekadar isu pelupusan?',
        options: ['Ia hanya menjejaskan ruang tapak pelupusan', 'Ia membazirkan sumber terkandung seperti air, tanah, tenaga, dan tenaga kerja', 'Ia hanya masalah estetik', 'Ia tiada kesan yang lebih luas'],
        explanation: 'Apabila makanan dibazirkan, semua sumber yang digunakan untuk menghasilkan, mengangkut, dan menyimpannya — air, tanah, tenaga, tenaga kerja, dan pembungkusan — turut hilang.',
      },
      {
        question: 'Kira-kira berapakah peratusan sisa makanan global yang datang daripada isi rumah pada 2022?',
        options: ['20%', '40%', '60%', '80%'],
        explanation: 'Menurut Laporan Indeks Sisa Makanan UNEP 2024, isi rumah menyumbang kira-kira 60% daripada sisa makanan global pada 2022.',
      },
    ],
    pledgeOptions: [
      'Saya akan menyimpan lebihan makanan.',
      'Saya akan merancang bahagian dengan lebih baik.',
      'Saya akan berkongsi lebihan yang boleh dimakan apabila selamat.',
      'Saya akan mengkompos sisa yang tidak dapat dielak.',
    ],
    targetQuizQuestions: {
      'leftover-rice': [
        {
          question: 'Apakah tindakan pertama yang biasanya lebih baik untuk sisa nasi yang boleh dimakan?',
          options: ['Buang serta-merta', 'Simpan dengan selamat dan makan segera', 'Kompos sebelum menyemak', 'Abaikan'],
          explanation: 'Lebihan yang boleh dimakan patut disimpan dahulu jika ia disimpan dengan selamat. PlateNudge tidak boleh mengesahkan keselamatan makanan, jadi tempoh simpanan dan bau tetap penting.',
        },
        {
          question: 'Mengapa membazirkan nasi yang dimasak itu penting?',
          options: ['Ia hanya membazirkan nasi itu sahaja', 'Ia juga membazirkan air, tenaga, tenaga kerja, pengangkutan, dan pembungkusan', 'Ia tiada kesan yang lebih luas', 'Ia hanya masalah penglihatan'],
          explanation: 'Makanan yang dimasak membawa sumber terkandung. Membuangnya membazirkan lebih daripada makanan di atas pinggan.',
        },
      ],
      'fruit-peels': [
        {
          question: 'Bilakah pengkomposan paling sesuai?',
          options: ['Untuk sisa tidak boleh dimakan yang tidak dapat dielak', 'Untuk semua lebihan yang boleh dimakan', 'Untuk lebihan makanan yang tertutup', 'Untuk setiap bekas minuman'],
          explanation: 'Pengkomposan berguna untuk sisa seperti kulit dan jangat, manakala makanan yang boleh dimakan patut dimakan, disimpan, atau dikongsi dahulu.',
        },
        {
          question: 'Mengapa kulit buah contoh kompos yang baik?',
          options: ['Ia biasanya sisa yang tidak dapat dielak', 'Ia sentiasa selamat untuk dikongsi', 'Ia sama seperti lebihan yang dimasak', 'Ia patut sentiasa dihantar ke tapak pelupusan'],
          explanation: 'Kulit dan jangat selalunya tidak boleh dimakan, jadi pengkomposan boleh mengembalikan nutrien kepada tanah apabila kemudahan ada.',
        },
      ],
      'bread-waste': [
        {
          question: 'Apakah yang biasanya lebih baik daripada membuang roti lebihan yang boleh dimakan?',
          options: ['Kongsi atau bekukannya jika sesuai', 'Buang dahulu', 'Kompos setiap keping', 'Biarkan tidak bertutup'],
          explanation: 'Lebihan yang boleh dimakan paling baik digunakan sebelum menjadi sisa. Roti selalunya boleh dikongsi atau dibekukan, tetapi roti berkulat tidak boleh dimakan atau dikongsi.',
        },
        {
          question: 'Apakah yang patut anda semak sebelum berkongsi roti?',
          options: ['Sama ada ia jelas selamat dan tidak berkulat', 'Sama ada aplikasi berkata ia pasti selamat', 'Sama ada ia kelihatan mahal', 'Sama ada ia sudah berada di dalam tong sampah'],
          explanation: 'PlateNudge tidak boleh mengesahkan keselamatan makanan. Jangan kongsi makanan yang meragukan atau berkulat.',
        },
      ],
      'mixed-leftovers': [
        {
          question: 'Apakah yang patut anda lakukan sebelum mengkompos lebihan bercampur?',
          options: ['Asingkan bahagian yang boleh dimakan daripada sisa sebenar', 'Kompos semuanya serta-merta', 'Abaikan bahagian yang boleh dimakan', 'Campurkan dengan pembungkusan'],
          explanation: 'Gunakan bahagian yang boleh dimakan dahulu. Pengkomposan patut untuk sisa sebenar yang tidak boleh dimakan, disimpan, atau dikongsi.',
        },
        {
          question: 'Mengapa pengasingan sisa bercampur membantu?',
          options: ['Ia membantu memulihkan makanan yang boleh dimakan dan mengkompos sisa yang tidak dapat dielak', 'Ia menjadikan semua makanan selamat', 'Ia menghapuskan keperluan SDG 12', 'Ia mencipta data karbon yang tepat'],
          explanation: 'Pengasingan menyokong keputusan yang lebih baik kerana makanan yang boleh dimakan dan sisa yang tidak boleh dimakan memerlukan tindakan berbeza.',
        },
      ],
      'drink-waste': [
        {
          question: 'Apakah tindakan pencegahan yang baik untuk sisa minuman?',
          options: ['Beli atau buat hanya apa yang akan anda habiskan', 'Sentiasa beli minuman yang lebih besar', 'Buang minuman yang belum dibuka', 'Abaikan pembungkusan'],
          explanation: 'Mencegah lebihan biasanya lebih baik daripada menangani sisa kemudian.',
        },
        {
          question: 'Item minuman manakah yang biasanya lebih sesuai untuk dikongsi?',
          options: ['Minuman tertutup yang belum dibuka', 'Minuman yang dibuka dan dibiarkan berjam-jam', 'Cawan pakai buang yang kotor', 'Minuman dengan kandungan yang tidak diketahui'],
          explanation: 'Perkongsian patut terhad kepada lebihan yang tertutup atau jelas sesuai. PlateNudge tidak boleh mengesahkan keselamatan makanan.',
        },
      ],
      'ai-scan': [
        {
          question: 'Apakah yang dianalisis oleh Imbas AI?',
          options: ['Satu tangkapan kamera', 'Aliran penjejakan langsung yang berterusan', 'Status keselamatan makanan yang tepat', 'Berat sisa yang tepat'],
          explanation: 'Imbas AI menganalisis satu tangkapan dan mencipta pameran pembelajaran. Ia tidak melakukan penjejakan objek langsung.',
        },
        {
          question: 'Apakah yang patut anda ingat tentang panduan AI?',
          options: ['Ia tidak boleh mengesahkan keselamatan makanan', 'Ia sentiasa tahu sama ada makanan selamat', 'Ia memberi nilai karbon yang tepat', 'Ia menggantikan akal fikiran'],
          explanation: 'Panduan berbantukan AI hanyalah alat bantu pembelajaran. Periksa tempoh simpanan, bau, pencemaran, dan panduan keselamatan makanan tempatan.',
        },
      ],
    },
  },
  'zh-CN': {
    targets: {
      'leftover-rice': {
        title: '剩饭', shortLabel: '可食用的剩余', wasteType: '熟食',
        quickFact: '家庭约占全球食物浪费的 60%。',
        defaultMessage: '如果仍然安全，保存剩菜通常比丢弃更好。',
        actionGuidance: {
          throwAway: '只有在变质或不安全时才丢弃。',
          saveLeftovers: '放进干净的容器并尽快食用。',
          share: '只有在安全卫生的情况下才分享。',
          compost: '把堆肥用于无法避免的残渣，而不是可食用的食物。',
        },
        askMoreTitle: '为什么这很重要',
        askMoreExplanation: '被浪费的熟食代表着水、能源、人力、运输和包装等内含资源。',
        safetyNote: '此应用无法确认食物是否安全食用。请检查气味、存放时间和是否受污染。尤其是熟米饭，应快速冷却、冷藏，并且只可重新加热一次。',
      },
      'fruit-peels': {
        title: '果皮', shortLabel: '无法避免的残渣', wasteType: '果皮与外皮',
        quickFact: '堆肥能把残渣中的养分归还给土壤。',
        defaultMessage: '果皮通常不可食用——把它拿去堆肥，而不是送往垃圾填埋场。',
        actionGuidance: {
          throwAway: '在可堆肥的情况下，避免送往垃圾填埋场。',
          saveLeftovers: '有些果皮可以利用——例如先取柑橘皮屑，再把其余拿去堆肥。',
          share: '不适合分享。',
          compost: '把果皮和外皮拿去堆肥，以肥沃土壤。',
        },
        askMoreTitle: '为什么要把残渣堆肥',
        askMoreExplanation: '对于真正不可食用的残渣，堆肥是正确的做法。它能让有机物远离垃圾填埋场（在那里会释放甲烷），并把养分归还给土壤。',
        safetyNote: '只把无法避免的残渣拿去堆肥——可食用的食物应先食用、保存或分享。',
      },
      'bread-waste': {
        title: '面包浪费', shortLabel: '余量 / 可食用', wasteType: '烘焙余量',
        quickFact: '提供给消费者的食物中约有 19% 被浪费。',
        defaultMessage: '这些面包大多看起来还能吃——分享或冷冻都比丢弃更好。',
        actionGuidance: {
          throwAway: '最后手段——仅在发霉或太干硬无法食用时。',
          saveLeftovers: '把面包冷冻以延长保存期，或用来做吐司、面包糠或面包丁。',
          share: '把安全的余量重新分发给他人或食物银行。',
          compost: '只把发霉或真正不可食用的部分拿去堆肥。',
        },
        askMoreTitle: '为什么余量很重要',
        askMoreExplanation: '丢弃可食用的余量，会浪费生产它所用的水、土地、能源和人力。预防并重新分配余量位于食物浪费层级的最顶端。',
        safetyNote: '此应用无法确认食物是否安全食用。请勿分享或食用已发霉的面包。',
      },
      'mixed-leftovers': {
        title: '混合剩菜', shortLabel: '餐盘残余', wasteType: '混合 / 切剩',
        quickFact: 'SDG 12.3 旨在到 2030 年将人均食物浪费减半。',
        defaultMessage: '先利用可食用的部分；只把真正的切剩残渣拿去堆肥。',
        actionGuidance: {
          throwAway: '垃圾桶里的混合垃圾很难回收——请改为分类。',
          saveLeftovers: '把可食用的部分（菜茎、菜花、辣椒）用于高汤、汤品或快炒。',
          share: '在变质之前分享可食用的部分。',
          compost: '把真正的残渣（果皮、果核、外皮）拿去堆肥。',
        },
        askMoreTitle: '为什么预防很重要',
        askMoreExplanation: '许多餐盘和备餐的浪费是可以避免的。规划份量、利用可食用的边角料，只把其余的拿去堆肥，就能从源头减少浪费——这是最便宜、最有效的做法。',
        safetyNote: '此应用无法确认食物是否安全食用。如有疑虑，请勿食用或分享可疑的食物。',
      },
      'drink-waste': {
        title: '饮料浪费', shortLabel: '饮料与杯子', wasteType: '饮料 / 一次性',
        quickFact: '浪费饮料也会浪费水、原料和包装。',
        defaultMessage: '只制作或购买你会喝完的量，并选择可重复使用的杯子。',
        actionGuidance: {
          throwAway: '把无法避免的液体倒掉；把干净的罐子和瓶子回收。',
          saveLeftovers: '把没喝完的饮料密封保存留待稍后，并优先使用可重复使用的杯子。',
          share: '密封、未开封的饮料可以分享；已开封的通常不行。',
          compost: '大多数杯子内衬塑料——无法堆肥。尽可能回收。',
        },
        askMoreTitle: '为什么饮料也重要',
        askMoreExplanation: '饮料含有内含的水和原料，而一次性杯子又增加了包装垃圾。只购买你会喝完的量并使用可重复使用的物品，能同时减少这两者。',
        safetyNote: '此应用无法确认饮料是否安全饮用。放置过久的饮料请丢弃。',
      },
    },
    quizQuestions: [
      {
        question: 'PlateNudge 对应哪一个可持续发展目标？',
        options: ['SDG 2', 'SDG 7', 'SDG 12', 'SDG 15'],
        explanation: 'PlateNudge 对应 SDG 12——负责任消费与生产。',
      },
      {
        question: '对于可食用的剩菜，通常哪种做法最好？',
        options: ['丢弃', '保存留待稍后', '拿去堆肥', '置之不理'],
        explanation: '把可食用的剩菜保存起来留待稍后食用，是减少家庭食物浪费最简单、最有效的方法之一。',
      },
      {
        question: '什么时候最适合堆肥？',
        options: ['所有食物浪费', '只有熟食', '无法避免、不可食用的残渣', '永远不要'],
        explanation: '堆肥最适合用于无法避免的残渣，例如果皮、果核和外壳——这些是无法食用、保存或分享的食物。',
      },
      {
        question: '为什么食物浪费不只是处理废弃物的问题？',
        options: ['它只影响垃圾填埋场的空间', '它浪费了水、土地、能源和人力等内含资源', '它只是美观上的问题', '它没有更广泛的影响'],
        explanation: '当食物被浪费时，用来生产、运输和储存它的所有资源——水、土地、能源、人力和包装——也都被浪费了。',
      },
      {
        question: '2022 年全球食物浪费中，大约有多少百分比来自家庭？',
        options: ['20%', '40%', '60%', '80%'],
        explanation: '根据联合国环境规划署《2024 年食物浪费指数报告》，2022 年家庭约占全球食物浪费的 60%。',
      },
    ],
    pledgeOptions: [
      '我会保存剩菜。',
      '我会更好地规划份量。',
      '在安全的情况下，我会分享多余的食物。',
      '我会把无法避免的残渣拿去堆肥。',
    ],
    targetQuizQuestions: {
      'leftover-rice': [
        {
          question: '对于可食用的剩饭，通常更好的第一步行动是什么？',
          options: ['立即丢弃', '安全保存并尽快食用', '先堆肥再检查', '置之不理'],
          explanation: '可食用的剩余应在安全保存的前提下先保存起来。PlateNudge 无法确认食物是否安全，因此存放时间和气味仍然重要。',
        },
        {
          question: '为什么浪费熟米饭很重要？',
          options: ['它只浪费了米饭本身', '它还浪费了水、能源、人力、运输和包装', '它没有更广泛的影响', '它只是外观上的问题'],
          explanation: '熟食含有内含资源。丢弃它浪费的不只是盘中的食物。',
        },
      ],
      'fruit-peels': [
        {
          question: '什么时候最适合堆肥？',
          options: ['无法避免、不可食用的残渣', '所有可食用的剩余', '密封的余量食物', '每一个饮料容器'],
          explanation: '堆肥适用于果皮和外皮等残渣，而可食用的食物应先食用、保存或分享。',
        },
        {
          question: '为什么果皮是很好的堆肥例子？',
          options: ['它们通常是无法避免的残渣', '它们总是可以安全分享', '它们和熟剩菜一样', '它们应该总是送往垃圾填埋场'],
          explanation: '果皮和外皮通常不可食用，因此在有设施时，堆肥能把养分归还给土壤。',
        },
      ],
      'bread-waste': [
        {
          question: '比起把可食用的余量面包丢进垃圾桶，通常更好的做法是什么？',
          options: ['如果合适就分享或冷冻', '先把它丢掉', '把每一片都拿去堆肥', '不加遮盖地放着'],
          explanation: '可食用的余量最好在变成废弃物之前使用。面包通常可以分享或冷冻，但发霉的面包不应食用或分享。',
        },
        {
          question: '分享面包之前你应该检查什么？',
          options: ['它是否明显安全且没有发霉', '应用是否说它一定安全', '它看起来是否昂贵', '它是否已经在垃圾桶里'],
          explanation: 'PlateNudge 无法确认食物是否安全。请勿分享可疑或发霉的食物。',
        },
      ],
      'mixed-leftovers': [
        {
          question: '在把混合剩菜拿去堆肥之前，你应该做什么？',
          options: ['把可食用的部分与真正的残渣分开', '立即把全部拿去堆肥', '忽略可食用的部分', '把它和包装混在一起'],
          explanation: '先利用可食用的部分。堆肥应用于无法食用、保存或分享的真正残渣。',
        },
        {
          question: '为什么对混合垃圾进行分类有帮助？',
          options: ['它有助于回收可食用的食物并堆肥无法避免的残渣', '它能让所有食物变得安全', '它消除了对 SDG 12 的需要', '它能生成精确的碳数据'],
          explanation: '分类有助于做出更好的决定，因为可食用的食物和不可食用的残渣需要不同的处理方式。',
        },
      ],
      'drink-waste': [
        {
          question: '对于饮料浪费，好的预防行动是什么？',
          options: ['只购买或制作你会喝完的量', '总是购买更大份的饮料', '丢弃未开封的饮料', '忽略包装'],
          explanation: '预防多余通常比事后处理浪费更好。',
        },
        {
          question: '哪一种饮料通常更适合分享？',
          options: ['一份密封未开封的饮料', '开封后放置了数小时的饮料', '一个脏的一次性杯子', '一份内容不明的饮料'],
          explanation: '分享应仅限于密封或明显合适的余量。PlateNudge 无法确认食物是否安全。',
        },
      ],
      'ai-scan': [
        {
          question: 'AI 扫描会分析什么？',
          options: ['一张相机快照', '持续的实时追踪画面', '精确的食品安全状态', '废弃物的精确重量'],
          explanation: 'AI 扫描分析一张快照并生成学习卡片。它不进行实时物体追踪。',
        },
        {
          question: '关于 AI 建议，你应该记住什么？',
          options: ['它无法确认食物是否安全', '它总是知道食物是否安全', '它会给出精确的碳数值', '它可以取代常识'],
          explanation: 'AI 辅助建议只是学习辅助。请检查存放时间、气味、是否受污染，并参考当地的食品安全指南。',
        },
      ],
    },
  },
};

// Merge data translations into the main table (keeps en pointing at sources).
translations.ms.targets = dataTranslations.ms.targets;
translations.ms.quizQuestions = dataTranslations.ms.quizQuestions;
translations.ms.targetQuizQuestions = dataTranslations.ms.targetQuizQuestions;
translations.ms.pledgeOptions = dataTranslations.ms.pledgeOptions;
translations['zh-CN'].targets = dataTranslations['zh-CN'].targets;
translations['zh-CN'].quizQuestions = dataTranslations['zh-CN'].quizQuestions;
translations['zh-CN'].targetQuizQuestions = dataTranslations['zh-CN'].targetQuizQuestions;
translations['zh-CN'].pledgeOptions = dataTranslations['zh-CN'].pledgeOptions;

// ===========================================================================
// Locale state
// ===========================================================================
function normalise(loc) {
  if (!loc) return null;
  if (LOCALES.includes(loc)) return loc;
  const base = String(loc).toLowerCase();
  if (base.startsWith('zh')) return 'zh-CN';
  if (base.startsWith('ms') || base.startsWith('id')) return 'ms';
  if (base.startsWith('en')) return 'en';
  return null;
}

let currentLocale =
  normalise(typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) ||
  normalise(typeof navigator !== 'undefined' && navigator.language) ||
  'en';

/** @returns {string} the active locale code. */
export function getLocale() {
  return currentLocale;
}

/**
 * Switch language: persist, update <html lang>, then broadcast the change so
 * every page/controller re-renders.
 * @param {string} locale
 */
export function setLocale(locale) {
  const next = normalise(locale) || 'en';
  if (next === currentLocale) return;
  currentLocale = next;
  try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
  document.documentElement.lang = next;
  window.dispatchEvent(new CustomEvent('platewise:localechange', { detail: { locale: next } }));
}

// ===========================================================================
// Lookup
// ===========================================================================
function lookup(tree, path) {
  if (!tree) return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), tree);
}

/**
 * Translate a dot-path. Returns the value for the current locale, falling back
 * to English, then to undefined (so data callers can use their own source).
 * @param {string} path
 * @param {string} [locale]
 * @returns {*}
 */
export function t(path, locale = currentLocale) {
  const val = lookup(translations[locale], path);
  if (val !== undefined && val !== null) return val;
  if (locale !== 'en') {
    const en = lookup(translations.en, path);
    if (en !== undefined && en !== null) return en;
  }
  return undefined;
}

// ===========================================================================
// DOM application
// ===========================================================================
/**
 * Fill every translatable element under `root`:
 *   data-i18n            → textContent
 *   data-i18n-html       → innerHTML (trusted static strings only)
 *   data-i18n-aria-label → aria-label attribute
 *   data-i18n-placeholder→ placeholder attribute
 *   data-i18n-alt        → alt attribute
 * Missing keys leave the existing markup untouched (graceful fallback).
 * @param {ParentNode} [root=document]
 */
export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = t(el.getAttribute('data-i18n'));
    if (typeof v === 'string') el.textContent = v;
  });
  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const v = t(el.getAttribute('data-i18n-html'));
    if (typeof v === 'string') el.innerHTML = v;
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const v = t(el.getAttribute('data-i18n-aria-label'));
    if (typeof v === 'string') el.setAttribute('aria-label', v);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const v = t(el.getAttribute('data-i18n-placeholder'));
    if (typeof v === 'string') el.setAttribute('placeholder', v);
  });
  root.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const v = t(el.getAttribute('data-i18n-alt'));
    if (typeof v === 'string') el.setAttribute('alt', v);
  });
}

/** Set <html lang> and apply translations to the whole document. Idempotent. */
export function initI18n() {
  document.documentElement.lang = currentLocale;
  applyTranslations();
}

// Re-apply static translations whenever the language changes (page controllers
// add their own listeners for JS-rendered content).
window.addEventListener('platewise:localechange', () => applyTranslations());

// ===========================================================================
// Language switcher (globe · EN / BM / 中文)
// ===========================================================================
const GLOBE_SVG =
  '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"/></svg>';
const CHEV_SVG =
  '<svg class="lang__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

/**
 * Render the language switcher into `container`. Safe to call once per page.
 * @param {HTMLElement} container
 */
export function mountLanguageSwitcher(container) {
  if (!container || container.querySelector('.lang')) return;

  const wrap = document.createElement('div');
  wrap.className = 'lang';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'lang__btn';
  btn.setAttribute('aria-haspopup', 'listbox');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', t('nav.language') || 'Language');
  btn.innerHTML = `${GLOBE_SVG}<span class="lang__cur">${LOCALE_LABELS[currentLocale]}</span>${CHEV_SVG}`;

  const menu = document.createElement('ul');
  menu.className = 'lang__menu';
  menu.setAttribute('role', 'listbox');
  menu.hidden = true;
  menu.innerHTML = LOCALES.map(
    (loc) =>
      `<li role="option" aria-selected="${loc === currentLocale}">` +
      `<button type="button" class="lang__opt${loc === currentLocale ? ' is-active' : ''}" data-loc="${loc}">` +
      `<span class="lang__tag">${LOCALE_LABELS[loc]}</span><span class="lang__name">${LOCALE_NAMES[loc]}</span></button></li>`
  ).join('');

  wrap.appendChild(btn);
  wrap.appendChild(menu);
  container.appendChild(wrap);

  const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  const open = () => { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.hidden) open(); else close();
  });
  menu.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-loc]');
    if (!opt) return;
    setLocale(opt.dataset.loc);
    close();
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // Keep the button label + active markers in sync with locale changes.
  window.addEventListener('platewise:localechange', () => {
    const cur = wrap.querySelector('.lang__cur');
    if (cur) cur.textContent = LOCALE_LABELS[currentLocale];
    btn.setAttribute('aria-label', t('nav.language') || 'Language');
    menu.querySelectorAll('.lang__opt').forEach((o) => {
      const on = o.dataset.loc === currentLocale;
      o.classList.toggle('is-active', on);
      o.closest('[role="option"]')?.setAttribute('aria-selected', String(on));
    });
  });
}
