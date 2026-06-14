/**
 * i18n.js — Lightweight, dependency-free internationalisation for PlateWise AR.
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
      titleHome: 'PlateWise AR',
      titleScan: 'PlateWise AR — Scan',
      titleDemo: 'PlateWise AR — Demo',
      titleImages: 'PlateWise AR — Scan images',
      titleQuiz: 'PlateWise AR — Quick check',
      titleAbout: 'PlateWise AR — About',
    },
    nav: { brand: 'PlateWise', scan: 'Scan', demo: 'Demo', about: 'About', home: 'Home', language: 'Language' },
    hero: {
      chip: 'Food-waste museum, in AR',
      title1: 'Scan your leftovers.',
      title2: 'Learn what to do next.',
      sub: 'An AR food-waste learning experience for SDG 12.',
      startScan: 'Start scan',
      tryDemo: 'Try demo',
      viewImages: 'View scan images',
      about: 'About',
    },
    ticker: { wasted: '1.05B tonnes wasted', households: '60% from households', sdg: 'SDG 12.3' },
    journey: {
      eyebrow: 'For learners.',
      title: 'Built for everyday food decisions.',
      subtitle: 'You do not need to be a sustainability expert. PlateWise turns food-waste images into short AR exhibits that help you see the issue, choose an action, and reflect on what happens next.',
      card1Title: 'Visualise, not just read.',
      card1Body: 'Food waste often feels invisible after it leaves the plate. PlateWise uses AR to place the impact back in front of the learner.',
      card1Alt: 'Illustration: seeing food-waste impact in AR',
      card2Title: 'Action, not guilt.',
      card2Body: 'The app does not just say “waste less”. It asks users to choose what they would do: throw, save, share, or compost.',
      card2Alt: 'Illustration: choosing a food-waste action',
      card3Title: 'Reflection, not a lecture.',
      card3Body: 'After each scan, users get a short fact, target-specific guidance, and a quick check to connect SDG 12 with everyday behaviour.',
      card3Alt: 'Illustration: reflecting on everyday choices',
    },
    impact: {
      title: 'Small choices add up.',
      subtitle: 'PlateWise connects food-waste facts to simple decisions. Each scan turns a curated image into an AR learning moment: awareness, visualisation, decision, feedback, and reflection.',
      stat1Num: '1.05B', stat1Label: 'tonnes of food wasted globally',
      stat1Body: 'Food waste is not just a bin problem. It represents wasted water, energy, labour, land, transport, and packaging.',
      stat2Num: '60%', stat2Label: 'comes from households',
      stat2Body: 'Household decisions matter. PlateWise focuses on everyday situations learners can recognise and act on.',
      stat3Num: '19%', stat3Label: 'of food available to consumers is wasted',
      stat3Body: 'The app uses short facts and source labels so users can connect what they scan with real sustainability data.',
      stat4Num: 'SDG 12.3', stat4Label: 'halve food waste by 2030',
      stat4Body: 'PlateWise supports awareness of responsible consumption and encourages users to prevent waste before disposal.',
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
    images: {
      title: 'Scan images',
      lede: 'Open one on another screen (or print it), then scan it from the Scan page.',
      curatedNote: 'PlateWise recognises these <strong>curated images only</strong> — not arbitrary food photos (yet).',
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
      limit1: 'Recognises <strong>curated image targets only</strong> — not arbitrary food photos.',
      limit2: '<strong>No AI yet</strong> — image analysis is planned future work.',
      limit3: 'Does <strong>not</strong> confirm food safety.',
      limit4: 'No exact weight or carbon estimates.',
      limit5: 'Camera needs HTTPS or localhost.',
      footerNote: 'A future version may use AI to analyse your own food-waste photos. For now, PlateWise uses curated image targets included in the app.',
    },
  },

  // -----------------------------------------------------------------------
  ms: {
    meta: {
      titleHome: 'PlateWise AR',
      titleScan: 'PlateWise AR — Imbas',
      titleDemo: 'PlateWise AR — Demo',
      titleImages: 'PlateWise AR — Imej imbasan',
      titleQuiz: 'PlateWise AR — Semakan pantas',
      titleAbout: 'PlateWise AR — Perihal',
    },
    nav: { brand: 'PlateWise', scan: 'Imbas', demo: 'Demo', about: 'Perihal', home: 'Laman utama', language: 'Bahasa' },
    hero: {
      chip: 'Muzium sisa makanan dalam AR',
      title1: 'Imbas sisa makanan anda.',
      title2: 'Ketahui tindakan seterusnya.',
      sub: 'Pengalaman pembelajaran sisa makanan AR untuk SDG 12.',
      startScan: 'Mula imbasan',
      tryDemo: 'Cuba demo',
      viewImages: 'Lihat imej imbasan',
      about: 'Perihal',
    },
    ticker: { wasted: '1.05B tan dibazirkan', households: '60% daripada isi rumah', sdg: 'SDG 12.3' },
    journey: {
      eyebrow: 'Untuk pelajar.',
      title: 'Dibina untuk keputusan makanan harian.',
      subtitle: 'Anda tidak perlu menjadi pakar kelestarian. PlateWise menukar imej sisa makanan menjadi pameran AR ringkas yang membantu anda melihat isunya, memilih tindakan, dan merenung apa yang berlaku seterusnya.',
      card1Title: 'Lihat, bukan sekadar baca.',
      card1Body: 'Sisa makanan sering terasa tidak kelihatan selepas meninggalkan pinggan. PlateWise menggunakan AR untuk membawa kesannya kembali di hadapan pelajar.',
      card1Alt: 'Ilustrasi: melihat kesan sisa makanan dalam AR',
      card2Title: 'Tindakan, bukan rasa bersalah.',
      card2Body: 'Aplikasi ini bukan sekadar berkata “kurangkan pembaziran”. Ia meminta pengguna memilih tindakan: buang, simpan, kongsi, atau kompos.',
      card2Alt: 'Ilustrasi: memilih tindakan sisa makanan',
      card3Title: 'Renungan, bukan syarahan.',
      card3Body: 'Selepas setiap imbasan, pengguna mendapat fakta ringkas, panduan khusus, dan semakan pantas untuk mengaitkan SDG 12 dengan tingkah laku harian.',
      card3Alt: 'Ilustrasi: merenung pilihan harian',
    },
    impact: {
      title: 'Pilihan kecil memberi kesan besar.',
      subtitle: 'PlateWise mengaitkan fakta sisa makanan dengan keputusan mudah. Setiap imbasan menukar imej terpilih menjadi detik pembelajaran AR: kesedaran, visualisasi, keputusan, maklum balas, dan renungan.',
      stat1Num: '1.05B', stat1Label: 'tan makanan dibazirkan di seluruh dunia',
      stat1Body: 'Sisa makanan bukan sekadar masalah tong sampah. Ia mewakili air, tenaga, tenaga kerja, tanah, pengangkutan, dan pembungkusan yang dibazirkan.',
      stat2Num: '60%', stat2Label: 'datang daripada isi rumah',
      stat2Body: 'Keputusan isi rumah penting. PlateWise menumpukan pada situasi harian yang boleh dikenali dan ditangani oleh pelajar.',
      stat3Num: '19%', stat3Label: 'makanan yang tersedia untuk pengguna dibazirkan',
      stat3Body: 'Aplikasi ini menggunakan fakta ringkas dan label sumber supaya pengguna dapat mengaitkan apa yang diimbas dengan data kelestarian sebenar.',
      stat4Num: 'SDG 12.3', stat4Label: 'kurangkan separuh sisa makanan menjelang 2030',
      stat4Body: 'PlateWise menyokong kesedaran tentang penggunaan bertanggungjawab dan menggalakkan pengguna mencegah pembaziran sebelum pelupusan.',
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
    images: {
      title: 'Imej imbasan',
      lede: 'Buka satu pada skrin lain (atau cetaknya), kemudian imbasnya dari halaman Imbas.',
      curatedNote: 'PlateWise hanya mengenali <strong>imej terpilih ini sahaja</strong> — bukan sebarang foto makanan (buat masa ini).',
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
      limit1: 'Mengenali <strong>sasaran imej terpilih sahaja</strong> — bukan sebarang foto makanan.',
      limit2: '<strong>Belum ada AI</strong> — analisis imej ialah kerja masa depan yang dirancang.',
      limit3: '<strong>Tidak</strong> mengesahkan keselamatan makanan.',
      limit4: 'Tiada anggaran berat atau karbon yang tepat.',
      limit5: 'Kamera memerlukan HTTPS atau localhost.',
      footerNote: 'Versi akan datang mungkin menggunakan AI untuk menganalisis foto sisa makanan anda sendiri. Buat masa ini, PlateWise menggunakan sasaran imej terpilih yang disertakan dalam aplikasi.',
    },
  },

  // -----------------------------------------------------------------------
  'zh-CN': {
    meta: {
      titleHome: 'PlateWise AR',
      titleScan: 'PlateWise AR — 扫描',
      titleDemo: 'PlateWise AR — 演示',
      titleImages: 'PlateWise AR — 扫描图片',
      titleQuiz: 'PlateWise AR — 快速测验',
      titleAbout: 'PlateWise AR — 关于',
    },
    nav: { brand: 'PlateWise', scan: '扫描', demo: '演示', about: '关于', home: '首页', language: '语言' },
    hero: {
      chip: 'AR 食物浪费学习馆',
      title1: '扫描你的剩余食物。',
      title2: '了解下一步该怎么做。',
      sub: '面向 SDG 12 的 AR 食物浪费学习体验。',
      startScan: '开始扫描',
      tryDemo: '试用演示',
      viewImages: '查看扫描图片',
      about: '关于',
    },
    ticker: { wasted: '1.05B 吨被浪费', households: '60% 来自家庭', sdg: 'SDG 12.3' },
    journey: {
      eyebrow: '为学习者而设。',
      title: '为日常饮食决定而打造。',
      subtitle: '你不需要成为可持续发展专家。PlateWise 把食物浪费的图片变成简短的 AR 展览，帮助你看见问题、选择行动，并思考接下来会发生什么。',
      card1Title: '看见，而不只是阅读。',
      card1Body: '食物离开餐盘后，浪费往往变得看不见。PlateWise 用 AR 把这种影响重新呈现在学习者眼前。',
      card1Alt: '插图：在 AR 中看见食物浪费的影响',
      card2Title: '行动，而非内疚。',
      card2Body: '这个应用不只是说“少浪费”。它请用户选择会怎么做：丢弃、保存、分享或堆肥。',
      card2Alt: '插图：选择一项食物浪费行动',
      card3Title: '反思，而非说教。',
      card3Body: '每次扫描后，用户会获得简短事实、针对性建议，以及一个快速测验，把 SDG 12 与日常行为联系起来。',
      card3Alt: '插图：反思日常的选择',
    },
    impact: {
      title: '小小的选择，积少成多。',
      subtitle: 'PlateWise 把食物浪费的事实与简单的决定联系起来。每次扫描都会把一张指定图片变成一个 AR 学习时刻：意识、可视化、决定、反馈与反思。',
      stat1Num: '1.05B', stat1Label: '全球被浪费的食物（吨）',
      stat1Body: '食物浪费不只是垃圾桶的问题。它代表着被浪费的水、能源、人力、土地、运输和包装。',
      stat2Num: '60%', stat2Label: '来自家庭',
      stat2Body: '家庭的决定很重要。PlateWise 聚焦于学习者能够辨认并采取行动的日常情境。',
      stat3Num: '19%', stat3Label: '提供给消费者的食物被浪费',
      stat3Body: '应用使用简短事实和来源标签，让用户把所扫描的内容与真实的可持续发展数据联系起来。',
      stat4Num: 'SDG 12.3', stat4Label: '到 2030 年将食物浪费减半',
      stat4Body: 'PlateWise 倡导负责任消费的意识，并鼓励用户在丢弃之前预防浪费。',
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
    images: {
      title: '扫描图片',
      lede: '在另一个屏幕上打开其中一张（或打印出来），然后在扫描页面进行扫描。',
      curatedNote: 'PlateWise 仅识别<strong>这些指定图片</strong>——暂时无法识别任意的食物照片。',
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
      limit1: '仅识别<strong>指定的图像目标</strong>——而非任意的食物照片。',
      limit2: '<strong>暂无 AI</strong>——图像分析是计划中的未来工作。',
      limit3: '<strong>不会</strong>确认食物是否安全食用。',
      limit4: '不提供精确的重量或碳排放估算。',
      limit5: '相机需要 HTTPS 或 localhost。',
      footerNote: '未来版本可能会使用 AI 来分析你自己的食物浪费照片。目前，PlateWise 使用应用内附带的指定图像目标。',
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
        question: 'Matlamat Pembangunan Mampan yang manakah sejajar dengan PlateWise AR?',
        options: ['SDG 2', 'SDG 7', 'SDG 12', 'SDG 15'],
        explanation: 'PlateWise AR sejajar dengan SDG 12 — Penggunaan dan Pengeluaran Bertanggungjawab.',
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
        question: 'PlateWise AR 对应哪一个可持续发展目标？',
        options: ['SDG 2', 'SDG 7', 'SDG 12', 'SDG 15'],
        explanation: 'PlateWise AR 对应 SDG 12——负责任消费与生产。',
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
  },
};

// Merge data translations into the main table (keeps en pointing at sources).
translations.ms.targets = dataTranslations.ms.targets;
translations.ms.quizQuestions = dataTranslations.ms.quizQuestions;
translations.ms.pledgeOptions = dataTranslations.ms.pledgeOptions;
translations['zh-CN'].targets = dataTranslations['zh-CN'].targets;
translations['zh-CN'].quizQuestions = dataTranslations['zh-CN'].quizQuestions;
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
