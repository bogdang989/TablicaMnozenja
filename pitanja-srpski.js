"use strict";

/*
  Baza pitanja za igru „Jezički kviz“ (srpski jezik, 2. razred).
  Nove stavke dodaj u odgovarajući niz — igra ih automatski koristi.
  Sve reči piši na latinici; igra ih sama prevodi na ćirilicu kad je ćirilica izabrana.

  Savete za nove stavke:
  - Vrste reči: ne dodavaj reči koje su istovremeno u više vrsta (npr. „igra“, „crta“, „slika“, „večera“, „čisti“).
  - Slogovi: slog prave samoglasnici i slovo „r“ kad stoji između dva suglasnika (npr. dr-vo, cr-ven, če-tvr-tak);
    „r“ pored samoglasnika (npr. „torba“, „krokodil“) ne pravi slog. Objašnjenje u igri se računa po ovom pravilu,
    pa broj slogova u ključu mora da mu odgovara.
  - Glagoli: koristi pravilne glagole; proslo je muški rod 3. lica jednine, buduce je jednočlani oblik (npr. „pevaće“).
  - Reči sa pravim „nj“, „lj“ ili „dž“ (a ne dva odvojena slova, npr. „injekcija“) ne dodavati bez provere ćirilice.
*/
const BAZA_SRPSKI = {
  // Vrsta reči: ključ je vrsta (imenica, glagol, pridev, zamenica), a vrednost spisak reči.
  vrsteReci: {
    imenica: [
      "kuća", "dečak", "devojčica", "sunce", "knjiga", "prijatelj", "zima", "leto", "jesen", "proleće",
      "drvo", "cvet", "reka", "planina", "more", "škola", "učenik", "učiteljica", "olovka", "sveska",
      "torba", "stolica", "sto", "prozor", "vrata", "lopta", "igračka", "pas", "mačka", "ptica",
      "riba", "konj", "krava", "jabuka", "kruška", "šljiva", "hleb", "mleko", "sir", "voda",
      "kiša", "sneg", "vetar", "oblak", "zvezda", "mesec", "nebo", "grad", "ulica", "most",
      "auto", "voz", "avion", "brod", "majka", "otac", "baka", "deka", "sestra", "brat",
      "radost", "tuga", "sreća", "ljubav", "pesma", "pismo", "pesak", "selo", "polje", "dugme"
    ],
    glagol: [
      "trči", "peva", "spava", "raste", "pada", "razmišlja", "skače", "čita", "piše", "uči",
      "pliva", "gleda", "sluša", "govori", "voli", "pomaže", "otvara", "zatvara", "hoda", "plače",
      "kuva", "svira", "pleše", "traži", "kupuje", "uzima", "sedi", "leži", "broji", "bira",
      "šeta", "ruča", "čuva", "ljulja", "popravlja", "pozdravlja", "diše", "gura", "baca", "hvata",
      "menja", "čeka", "vežba", "ljubi", "grli", "gradi", "nosi", "vozi", "priča", "odgovara"
    ],
    pridev: [
      "veliki", "mali", "crven", "plav", "zelen", "žut", "beo", "crn", "lep", "ružan",
      "brz", "spor", "hladan", "topao", "visok", "nizak", "debeo", "mršav", "jak", "slab",
      "pametan", "dobar", "loš", "veseo", "tužan", "sladak", "kiseo", "slan", "gorak", "tvrd",
      "mek", "težak", "lak", "mlad", "star", "nov", "čist", "prljav", "svetao", "dubok",
      "plitak", "dug", "kratak", "širok", "uzak", "glasan", "tih", "ljubazan", "hrabar", "vredan",
      "srećan", "prijateljski", "kišovit", "sunčan"
    ],
    zamenica: ["ja", "ti", "on", "ona", "ono", "mi", "vi", "oni", "one"]
  },

  // Slova: tip je "samoglasnik" ili "suglasnik"; lat i cir su ista slova u dva pisma.
  slova: [
    { lat: "A", cir: "А", tip: "samoglasnik" },
    { lat: "E", cir: "Е", tip: "samoglasnik" },
    { lat: "I", cir: "И", tip: "samoglasnik" },
    { lat: "O", cir: "О", tip: "samoglasnik" },
    { lat: "U", cir: "У", tip: "samoglasnik" },

    { lat: "B", cir: "Б", tip: "suglasnik" },
    { lat: "C", cir: "Ц", tip: "suglasnik" },
    { lat: "Č", cir: "Ч", tip: "suglasnik" },
    { lat: "Ć", cir: "Ћ", tip: "suglasnik" },
    { lat: "D", cir: "Д", tip: "suglasnik" },
    { lat: "Dž", cir: "Џ", tip: "suglasnik" },
    { lat: "Đ", cir: "Ђ", tip: "suglasnik" },
    { lat: "F", cir: "Ф", tip: "suglasnik" },
    { lat: "G", cir: "Г", tip: "suglasnik" },
    { lat: "H", cir: "Х", tip: "suglasnik" },
    { lat: "J", cir: "Ј", tip: "suglasnik" },
    { lat: "K", cir: "К", tip: "suglasnik" },
    { lat: "L", cir: "Л", tip: "suglasnik" },
    { lat: "Lj", cir: "Љ", tip: "suglasnik" },
    { lat: "M", cir: "М", tip: "suglasnik" },
    { lat: "N", cir: "Н", tip: "suglasnik" },
    { lat: "Nj", cir: "Њ", tip: "suglasnik" },
    { lat: "P", cir: "П", tip: "suglasnik" },
    { lat: "R", cir: "Р", tip: "suglasnik" },
    { lat: "S", cir: "С", tip: "suglasnik" },
    { lat: "Š", cir: "Ш", tip: "suglasnik" },
    { lat: "T", cir: "Т", tip: "suglasnik" },
    { lat: "V", cir: "В", tip: "suglasnik" },
    { lat: "Z", cir: "З", tip: "suglasnik" },
    { lat: "Ž", cir: "Ж", tip: "suglasnik" }
  ],

  // Slogovi: ključ je broj slogova (2 do 6), a vrednost spisak reči sa tim brojem slogova.
  slogovi: {
    2: [
      "mama", "tata", "kuća", "škola", "lopta", "sunce", "mačka", "voda", "knjiga", "torba",
      "sveska", "zima", "leto", "reka", "dečak", "ptica", "sestra", "ruka", "noga", "glava",
      "zvezda", "mesec", "prozor", "pesma", "pismo", "more", "polje", "nebo", "riba", "kiša",
      "selo", "deca", "leptir", "kompas", "pesak", "vetar", "ljubav", "radost", "sladak", "vrabac",
      "drvo", "grlo", "srce", "brdo", "crkva", "krpa", "vrba", "mrkva", "srna", "vrtić",
      "prsten", "brzo", "crven", "srpski", "krvav", "žrtva", "prvak", "prvi"
    ],
    3: [
      "olovka", "banana", "žirafa", "kišobran", "krokodil", "učenik", "stolica", "devojka", "prijatelj", "planina",
      "avion", "jabuka", "ulica", "sladoled", "paradajz", "računar", "kamion", "bioskop", "ananas", "jagoda",
      "mikroskop", "kilogram", "suglasnik", "pisanje", "čitanje", "pitanje", "učenjak", "kokoška", "ormarić", "mačkica",
      "leptirić", "tikvica", "kupina", "bundeva", "ljubaznost", "pravopis",
      "crveno", "četvrtak", "krtica", "srdačan", "brzina", "trgovac", "trpeza", "hrvatski", "prskati", "grmeti",
      "četvrti", "krvotok"
    ],
    4: [
      "lubenica", "čokolada", "slikovnica", "veverica", "televizor", "pomorandža", "bubamara", "limunada", "marmelada", "karamela",
      "helikopter", "kupatilo", "pozorište", "prijateljstvo", "komšinica", "avantura", "samoglasnik", "rečenica", "imenica", "zamenica",
      "neprijatelj", "razglednica", "kilometar", "domaćica", "ekskurzija", "šargarepa", "otkrivanje", "nezavisnost", "zaljubljenost",
      "trgovina", "grmljavina"
    ],
    5: [
      "učiteljica", "biblioteka", "fotografija", "nezaboravan", "geografija", "akrobatika", "elektronika", "univerzitet", "televizija", "učionica",
      "radionica", "matematika", "biologija", "geometrija", "ekonomija", "planinarenje", "istraživanje", "razumevanje", "dobrodošlica",
      "obrazovanje", "pustolovina", "prijateljica", "astronomija", "ilustracija", "kolekcionar", "avanturista", "međunarodni", "novogodišnji"
    ],
    6: [
      "matematičarka", "hidroelektrana", "karakteristika", "organizacija", "arheologija", "mnogougaonik", "kooperativnost", "fotografisanje", "karikaturista", "elektrotehničar",
      "mikroorganizam", "komunikacija"
    ]
  },

  // Glagoli: isti glagol u sadašnjem, prošlom i budućem vremenu (3. lice jednine).
  glagoli: [
    { sadasnje: "peva", proslo: "pevao je", buduce: "pevaće" },
    { sadasnje: "trči", proslo: "trčao je", buduce: "trčaće" },
    { sadasnje: "spava", proslo: "spavao je", buduce: "spavaće" },
    { sadasnje: "čita", proslo: "čitao je", buduce: "čitaće" },
    { sadasnje: "piše", proslo: "pisao je", buduce: "pisaće" },
    { sadasnje: "igra", proslo: "igrao je", buduce: "igraće" },
    { sadasnje: "crta", proslo: "crtao je", buduce: "crtaće" },
    { sadasnje: "skače", proslo: "skakao je", buduce: "skakaće" },
    { sadasnje: "vozi", proslo: "vozio je", buduce: "voziće" },
    { sadasnje: "uči", proslo: "učio je", buduce: "učiće" },
    { sadasnje: "razmišlja", proslo: "razmišljao je", buduce: "razmišljaće" },
    { sadasnje: "priča", proslo: "pričao je", buduce: "pričaće" },
    { sadasnje: "gradi", proslo: "gradio je", buduce: "gradiće" },
    { sadasnje: "nosi", proslo: "nosio je", buduce: "nosiće" },
    { sadasnje: "radi", proslo: "radio je", buduce: "radiće" },
    { sadasnje: "pliva", proslo: "plivao je", buduce: "plivaće" },
    { sadasnje: "gleda", proslo: "gledao je", buduce: "gledaće" },
    { sadasnje: "sluša", proslo: "slušao je", buduce: "slušaće" },
    { sadasnje: "govori", proslo: "govorio je", buduce: "govoriće" },
    { sadasnje: "odgovara", proslo: "odgovarao je", buduce: "odgovaraće" },
    { sadasnje: "voli", proslo: "voleo je", buduce: "voleće" },
    { sadasnje: "pomaže", proslo: "pomagao je", buduce: "pomagaće" },
    { sadasnje: "otvara", proslo: "otvarao je", buduce: "otvaraće" },
    { sadasnje: "zatvara", proslo: "zatvarao je", buduce: "zatvaraće" },
    { sadasnje: "hoda", proslo: "hodao je", buduce: "hodaće" },
    { sadasnje: "plače", proslo: "plakao je", buduce: "plakaće" },
    { sadasnje: "kuva", proslo: "kuvao je", buduce: "kuvaće" },
    { sadasnje: "svira", proslo: "svirao je", buduce: "sviraće" },
    { sadasnje: "pleše", proslo: "plesao je", buduce: "plesaće" },
    { sadasnje: "traži", proslo: "tražio je", buduce: "tražiće" },
    { sadasnje: "kupuje", proslo: "kupovao je", buduce: "kupovaće" },
    { sadasnje: "uzima", proslo: "uzimao je", buduce: "uzimaće" },
    { sadasnje: "sedi", proslo: "sedeo je", buduce: "sedeće" },
    { sadasnje: "leži", proslo: "ležao je", buduce: "ležaće" },
    { sadasnje: "broji", proslo: "brojao je", buduce: "brojaće" },
    { sadasnje: "bira", proslo: "birao je", buduce: "biraće" },
    { sadasnje: "šeta", proslo: "šetao je", buduce: "šetaće" },
    { sadasnje: "ruča", proslo: "ručao je", buduce: "ručaće" },
    { sadasnje: "čuva", proslo: "čuvao je", buduce: "čuvaće" },
    { sadasnje: "ljulja", proslo: "ljuljao je", buduce: "ljuljaće" },
    { sadasnje: "popravlja", proslo: "popravljao je", buduce: "popravljaće" },
    { sadasnje: "pozdravlja", proslo: "pozdravljao je", buduce: "pozdravljaće" },
    { sadasnje: "diše", proslo: "disao je", buduce: "disaće" },
    { sadasnje: "gura", proslo: "gurao je", buduce: "guraće" },
    { sadasnje: "baca", proslo: "bacao je", buduce: "bacaće" },
    { sadasnje: "hvata", proslo: "hvatao je", buduce: "hvataće" },
    { sadasnje: "menja", proslo: "menjao je", buduce: "menjaće" },
    { sadasnje: "čeka", proslo: "čekao je", buduce: "čekaće" },
    { sadasnje: "vežba", proslo: "vežbao je", buduce: "vežbaće" },
    { sadasnje: "ljubi", proslo: "ljubio je", buduce: "ljubiće" },
    { sadasnje: "grli", proslo: "grlio je", buduce: "grliće" },
    { sadasnje: "doručkuje", proslo: "doručkovao je", buduce: "doručkovaće" },
    { sadasnje: "računa", proslo: "računao je", buduce: "računaće" },
    { sadasnje: "spašava", proslo: "spašavao je", buduce: "spašavaće" }
  ]
};
