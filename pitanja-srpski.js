"use strict";

/*
  Baza pitanja za igru „Jezički kviz“ (srpski jezik, 2. razred).
  Nove stavke dodaj u odgovarajući niz — igra ih automatski koristi.

  nivo: 1 = lako, 2 = srednje, 3 = teško
    Lako koristi nivo 1, Srednje nivoe 1–2, Teško nivoe 2–3.
*/
const BAZA_SRPSKI = {
  // Vrsta reči: vrsta je "imenica", "glagol", "pridev" ili "zamenica".
  vrsteReci: [
    { rec: "kuća", vrsta: "imenica", nivo: 1 },
    { rec: "dečak", vrsta: "imenica", nivo: 1 },
    { rec: "sunce", vrsta: "imenica", nivo: 1 },
    { rec: "knjiga", vrsta: "imenica", nivo: 1 },
    { rec: "prijatelj", vrsta: "imenica", nivo: 2 },
    { rec: "zima", vrsta: "imenica", nivo: 2 },
    { rec: "radost", vrsta: "imenica", nivo: 3 },

    { rec: "trči", vrsta: "glagol", nivo: 1 },
    { rec: "peva", vrsta: "glagol", nivo: 1 },
    { rec: "spava", vrsta: "glagol", nivo: 1 },
    { rec: "crta", vrsta: "glagol", nivo: 1 },
    { rec: "raste", vrsta: "glagol", nivo: 2 },
    { rec: "pada", vrsta: "glagol", nivo: 2 },
    { rec: "razmišlja", vrsta: "glagol", nivo: 3 },

    { rec: "veliki", vrsta: "pridev", nivo: 1 },
    { rec: "crven", vrsta: "pridev", nivo: 1 },
    { rec: "lep", vrsta: "pridev", nivo: 1 },
    { rec: "brz", vrsta: "pridev", nivo: 1 },
    { rec: "hladan", vrsta: "pridev", nivo: 2 },
    { rec: "pametan", vrsta: "pridev", nivo: 2 },
    { rec: "prijateljski", vrsta: "pridev", nivo: 3 },

    { rec: "ja", vrsta: "zamenica", nivo: 1 },
    { rec: "ti", vrsta: "zamenica", nivo: 1 },
    { rec: "on", vrsta: "zamenica", nivo: 1 },
    { rec: "ona", vrsta: "zamenica", nivo: 1 },
    { rec: "mi", vrsta: "zamenica", nivo: 2 },
    { rec: "vi", vrsta: "zamenica", nivo: 2 },
    { rec: "oni", vrsta: "zamenica", nivo: 3 },
    { rec: "one", vrsta: "zamenica", nivo: 3 }
  ],

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

  // Slogovi: slogova je broj od 2 do 6.
  slogovi: [
    { rec: "mama", slogova: 2, nivo: 1 },
    { rec: "kuća", slogova: 2, nivo: 1 },
    { rec: "škola", slogova: 2, nivo: 1 },
    { rec: "lopta", slogova: 2, nivo: 1 },
    { rec: "sunce", slogova: 2, nivo: 1 },
    { rec: "mačka", slogova: 2, nivo: 1 },
    { rec: "olovka", slogova: 3, nivo: 1 },
    { rec: "banana", slogova: 3, nivo: 1 },
    { rec: "žirafa", slogova: 3, nivo: 1 },

    { rec: "kišobran", slogova: 3, nivo: 2 },
    { rec: "krokodil", slogova: 3, nivo: 2 },
    { rec: "lubenica", slogova: 4, nivo: 2 },
    { rec: "čokolada", slogova: 4, nivo: 2 },
    { rec: "slikovnica", slogova: 4, nivo: 2 },
    { rec: "veverica", slogova: 4, nivo: 2 },
    { rec: "televizor", slogova: 4, nivo: 2 },
    { rec: "pomorandža", slogova: 4, nivo: 2 },

    { rec: "učiteljica", slogova: 5, nivo: 3 },
    { rec: "biblioteka", slogova: 5, nivo: 3 },
    { rec: "fotografija", slogova: 5, nivo: 3 },
    { rec: "nezaboravan", slogova: 5, nivo: 3 },
    { rec: "matematičarka", slogova: 6, nivo: 3 },
    { rec: "hidroelektrana", slogova: 6, nivo: 3 },
    { rec: "karakteristika", slogova: 6, nivo: 3 }
  ],

  // Glagoli: isti glagol u sadašnjem, prošlom i budućem vremenu (3. lice jednine).
  glagoli: [
    { sadasnje: "peva", proslo: "pevao je", buduce: "pevaće", nivo: 1 },
    { sadasnje: "trči", proslo: "trčao je", buduce: "trčaće", nivo: 1 },
    { sadasnje: "spava", proslo: "spavao je", buduce: "spavaće", nivo: 1 },
    { sadasnje: "čita", proslo: "čitao je", buduce: "čitaće", nivo: 1 },
    { sadasnje: "piše", proslo: "pisao je", buduce: "pisaće", nivo: 1 },
    { sadasnje: "igra", proslo: "igrao je", buduce: "igraće", nivo: 1 },

    { sadasnje: "crta", proslo: "crtao je", buduce: "crtaće", nivo: 2 },
    { sadasnje: "skače", proslo: "skakao je", buduce: "skakaće", nivo: 2 },
    { sadasnje: "vozi", proslo: "vozio je", buduce: "voziće", nivo: 2 },
    { sadasnje: "uči", proslo: "učio je", buduce: "učiće", nivo: 2 },

    { sadasnje: "razmišlja", proslo: "razmišljao je", buduce: "razmišljaće", nivo: 3 },
    { sadasnje: "priča", proslo: "pričao je", buduce: "pričaće", nivo: 3 },
    { sadasnje: "gradi", proslo: "gradio je", buduce: "gradiće", nivo: 3 },
    { sadasnje: "nosi", proslo: "nosio je", buduce: "nosiće", nivo: 3 }
  ]
};
