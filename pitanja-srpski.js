"use strict";

/*
  Baza pitanja za igru „Jezički kviz“ (srpski jezik, 2. razred).
  Nove stavke dodaj u odgovarajući niz — igra ih automatski koristi.
  Sve reči piši na latinici; igra ih sama prevodi na ćirilicu kad je ćirilica izabrana.
*/
const BAZA_SRPSKI = {
  // Vrsta reči: vrsta je "imenica", "glagol", "pridev" ili "zamenica".
  vrsteReci: [
    { rec: "kuća", vrsta: "imenica" },
    { rec: "dečak", vrsta: "imenica" },
    { rec: "sunce", vrsta: "imenica" },
    { rec: "knjiga", vrsta: "imenica" },
    { rec: "prijatelj", vrsta: "imenica" },
    { rec: "zima", vrsta: "imenica" },
    { rec: "radost", vrsta: "imenica" },

    { rec: "trči", vrsta: "glagol" },
    { rec: "peva", vrsta: "glagol" },
    { rec: "spava", vrsta: "glagol" },
    { rec: "crta", vrsta: "glagol" },
    { rec: "raste", vrsta: "glagol" },
    { rec: "pada", vrsta: "glagol" },
    { rec: "razmišlja", vrsta: "glagol" },

    { rec: "veliki", vrsta: "pridev" },
    { rec: "crven", vrsta: "pridev" },
    { rec: "lep", vrsta: "pridev" },
    { rec: "brz", vrsta: "pridev" },
    { rec: "hladan", vrsta: "pridev" },
    { rec: "pametan", vrsta: "pridev" },
    { rec: "prijateljski", vrsta: "pridev" },

    { rec: "ja", vrsta: "zamenica" },
    { rec: "ti", vrsta: "zamenica" },
    { rec: "on", vrsta: "zamenica" },
    { rec: "ona", vrsta: "zamenica" },
    { rec: "mi", vrsta: "zamenica" },
    { rec: "vi", vrsta: "zamenica" },
    { rec: "oni", vrsta: "zamenica" },
    { rec: "one", vrsta: "zamenica" }
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
    { rec: "mama", slogova: 2 },
    { rec: "kuća", slogova: 2 },
    { rec: "škola", slogova: 2 },
    { rec: "lopta", slogova: 2 },
    { rec: "sunce", slogova: 2 },
    { rec: "mačka", slogova: 2 },
    { rec: "olovka", slogova: 3 },
    { rec: "banana", slogova: 3 },
    { rec: "žirafa", slogova: 3 },
    { rec: "kišobran", slogova: 3 },
    { rec: "krokodil", slogova: 3 },
    { rec: "lubenica", slogova: 4 },
    { rec: "čokolada", slogova: 4 },
    { rec: "slikovnica", slogova: 4 },
    { rec: "veverica", slogova: 4 },
    { rec: "televizor", slogova: 4 },
    { rec: "pomorandža", slogova: 4 },
    { rec: "učiteljica", slogova: 5 },
    { rec: "biblioteka", slogova: 5 },
    { rec: "fotografija", slogova: 5 },
    { rec: "nezaboravan", slogova: 5 },
    { rec: "matematičarka", slogova: 6 },
    { rec: "hidroelektrana", slogova: 6 },
    { rec: "karakteristika", slogova: 6 }
  ],

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
    { sadasnje: "nosi", proslo: "nosio je", buduce: "nosiće" }
  ]
};
