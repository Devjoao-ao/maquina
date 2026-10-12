// Divisão político-administrativa de Angola: 21 províncias, 326 municípios.
// Fonte: Lei n.º 14/24 e anexo da Lei n.º 8/25 (codificação das unidades territoriais).
// Única lista do projecto — formulário, validação no servidor e detecção usam-na.

export const PROVINCIAS = [
  "Bengo",
  "Benguela",
  "Bié",
  "Cabinda",
  "Cuando",
  "Cuanza Norte",
  "Cuanza Sul",
  "Cubango",
  "Cunene",
  "Huambo",
  "Huíla",
  "Icolo e Bengo",
  "Luanda",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Moxico Leste",
  "Namibe",
  "Uíge",
  "Zaire",
] as const;

export type Provincia = (typeof PROVINCIAS)[number];

export const MUNICIPIOS: Record<Provincia, readonly string[]> = {
  Bengo: [
    "Ambriz",
    "Barra do Dande",
    "Bula Atumba",
    "Dande",
    "Muxaluando",
    "Nambuangongo",
    "Pango Aluquém",
    "Panguila",
    "Piri",
    "Quibaxe",
    "Quicunzo",
    "Úcua",
  ],
  Benguela: [
    "Babaera",
    "Baía Farta",
    "Balombo",
    "Benguela",
    "Biópio",
    "Bocoio",
    "Bolonguera",
    "Caimbambo",
    "Canhamela",
    "Capupa",
    "Catengue",
    "Catumbela",
    "Chicuma",
    "Chila",
    "Chindumbo",
    "Chongorói",
    "Cubal",
    "Dombe Grande",
    "Egito Praia",
    "Ganda",
    "Iambala",
    "Lobito",
    "Navegantes",
  ],
  Bié: [
    "Andulo",
    "Belo Horizonte",
    "Calucinga",
    "Camacupa",
    "Cambândua",
    "Catabola",
    "Chicala",
    "Chinguar",
    "Chipeta",
    "Chitembo",
    "Cuemba",
    "Cuito",
    "Cunhinga",
    "Luando",
    "Lúbia",
    "Mumbué",
    "Nharea",
    "Ringoma",
    "Umpulo",
  ],
  Cabinda: [
    "Belize",
    "Buco Zau",
    "Cabinda",
    "Cacongo",
    "Liambo",
    "Massabi",
    "Miconje",
    "Necuto",
    "Ngoio",
    "Tando Zinze",
  ],
  Cuando: [
    "Cuito Cuanavale",
    "Dima",
    "Dirico",
    "Luengue",
    "Luiana",
    "Mavinga",
    "Mucusso",
    "Rivungo",
    "Xipundo",
  ],
  "Cuanza Norte": [
    "Aldeia Nova",
    "Ambaca",
    "Banga",
    "Bolongongo",
    "Caculo Cabaça",
    "Cambambe",
    "Cazengo",
    "Cêrca",
    "Golungo Alto",
    "Lucala",
    "Luinga",
    "Massangano",
    "Ngonguembo",
    "Quiculungo",
    "Samba Cajú",
    "Tango",
    "Terreiro",
  ],
  "Cuanza Sul": [
    "Amboiva",
    "Boa Entrada",
    "Calulo",
    "Cassongue",
    "Conda",
    "Condé",
    "Ebo",
    "Gabela",
    "Gangula",
    "Gungo",
    "Lonhe",
    "Munenga",
    "Mussende",
    "Pambangala",
    "Porto Amboim",
    "Quenha",
    "Quibala",
    "Quilenda",
    "Quirimbo",
    "Quissongo",
    "Sanga",
    "Seles",
    "Sumbe",
    "Waku Kungo",
  ],
  Cubango: [
    "Caiundo",
    "Calai",
    "Chinguanja",
    "Cuangar",
    "Cuchi",
    "Cutato",
    "Longa",
    "Mavengue",
    "Menongue",
    "Nancova",
    "Savate",
  ],
  Cunene: [
    "Cafima",
    "Cahama",
    "Chiéde",
    "Chissuata",
    "Chitado",
    "Cuanhama",
    "Curoca",
    "Cuvelai",
    "Humbe",
    "Mupa",
    "Namacunde",
    "Naulila",
    "Nehone",
    "Ombadja",
  ],
  Huambo: [
    "Alto Hama",
    "Bailundo",
    "Bimbe",
    "Caála",
    "Cachiungo",
    "Chicala Choloanga",
    "Chilata",
    "Chinjenje",
    "Cuima",
    "Ecunha",
    "Galanga",
    "Huambo",
    "Londuimbali",
    "Longonjo",
    "Mungo",
    "Sambo",
    "Ucuma",
  ],
  Huíla: [
    "Cacula",
    "Caconda",
    "Caluquembe",
    "Capelongo",
    "Capunda Cavilongo",
    "Chibia",
    "Chicomba",
    "Chicungo",
    "Chipindo",
    "Chituto",
    "Cuvango",
    "Dongo",
    "Galangue",
    "Gambos",
    "Hoque",
    "Humpata",
    "Jamba Mineira",
    "Lubango",
    "Matala",
    "Palanca",
    "Quilengues",
    "Quipungo",
    "Viti Vivali",
  ],
  "Icolo e Bengo": ["Bom Jesus", "Cabiri", "Cabo Ledo", "Calumbo", "Catete", "Quiçama", "Sequele"],
  Luanda: [
    "Belas",
    "Cacuaco",
    "Camama",
    "Cazenga",
    "Hoji ya Henda",
    "Ingombota",
    "Kilamba",
    "Kilamba Kiaxi",
    "Maianga",
    "Mulenvos",
    "Mussulo",
    "Rangel",
    "Samba",
    "Sambizanga",
    "Talatona",
    "Viana",
  ],
  "Lunda Norte": [
    "Cafunfo",
    "Cambulo",
    "Camaxilo",
    "Canzar",
    "Capenda Camulemba",
    "Cassanje Calucala",
    "Caungula",
    "Chitato",
    "Cuango",
    "Cuilo",
    "Dundo",
    "Lóvua",
    "Luangue",
    "Lubalo",
    "Lucapa",
    "Luremo",
    "Mussungue",
    "Xá Cassau",
    "Xá Muteba",
  ],
  "Lunda Sul": [
    "Alto Chicapa",
    "Cacolo",
    "Cassai-Sul",
    "Cassengo",
    "Cazage",
    "Chiluage",
    "Dala",
    "Luma Cassai",
    "Muangueji",
    "Muconda",
    "Muriege",
    "Saurimo",
    "Sombo",
    "Xassengue",
  ],
  Malanje: [
    "Cacuso",
    "Caculama",
    "Cahombo",
    "Calandula",
    "Cambo Suinginge",
    "Cambundi Catembo",
    "Cangandala",
    "Capunda",
    "Cateco Cangola",
    "Cuale",
    "Kiwaba Nzoji",
    "Kunda dya Baze",
    "Luquembo",
    "Malanje",
    "Marimba",
    "Massango",
    "Mbanji ya Ngola",
    "Milando",
    "Muquixe",
    "Ngola Luiji",
    "Pungo a Ndongo",
    "Quela",
    "Quêssua",
    "Quihuhu",
    "Quirima",
    "Quitapa",
    "Xandel",
  ],
  Moxico: [
    "Alto Cuito",
    "Camanongue",
    "Cangamba",
    "Cangumbe",
    "Chiúme",
    "Léua",
    "Luena",
    "Lucusse",
    "Lumbala Nguimbo",
    "Lutembo",
    "Lutuai",
    "Ninda",
  ],
  "Moxico Leste": [
    "Caianda",
    "Cameia",
    "Cazombo",
    "Lago Dilolo",
    "Lóvua do Zambeze",
    "Luacano",
    "Luau",
    "Macondo",
    "Nana Candundo",
  ],
  Namibe: [
    "Bibala",
    "Cacimbas",
    "Camucuio",
    "Iona",
    "Lucira",
    "Moçâmedes",
    "Sacomar",
    "Tômbwa",
    "Virei",
  ],
  Uíge: [
    "Alto Zaza",
    "Ambuíla",
    "Bembe",
    "Bungo",
    "Cangola",
    "Damba",
    "Dange Quitexe",
    "Lucunga",
    "Maquela do Zombo",
    "Massau",
    "Milunga",
    "Mucaba",
    "Negage",
    "Nova Esperança",
    "Nsosso",
    "Puri",
    "Quimbele",
    "Quipedro",
    "Sacandica",
    "Sanza Pombo",
    "Songo",
    "Uíge",
    "Vista Alegre",
  ],
  Zaire: [
    "Cuimba",
    "Lufico",
    "Luvo",
    "Mbanza Kongo",
    "Nóqui",
    "Nzeto",
    "Quêlo",
    "Quindeje",
    "Serra de Canda",
    "Soyo",
    "Tomboco",
  ],
};

export const isProvincia = (value: unknown): value is Provincia =>
  typeof value === "string" && (PROVINCIAS as readonly string[]).includes(value);

export const isMunicipioDe = (provincia: Provincia, municipio: string) =>
  MUNICIPIOS[provincia].includes(municipio);

// ---------------------------------------------------------------------------
// Correspondência entre nomes devolvidos pela geocodificação e a lista oficial.

/** Minúsculas, sem acentos, sem pontuação e sem prefixos administrativos. */
export const normalizeName = (raw: string) =>
  raw
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\b(provincia|municipio|comuna|distrito urbano)\s+(de|do|da|dos|das)\s+/g, "")
    .replace(/\b(provincia|province|municipio|municipality)\b/g, "")
    .replace(/kw/g, "cu")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Nomes antigos ou alternativos de províncias -> províncias actuais possíveis.
// Os mapas podem ainda usar a divisão anterior a 2024, em que Cuando Cubango,
// Moxico e Luanda eram uma só província cada.
const PROVINCE_ALIASES: Record<string, readonly Provincia[]> = {
  "cuando cubango": ["Cuando", "Cubango"],
  "cuando cuvango": ["Cuando", "Cubango"],
  "kuando kubango": ["Cuando", "Cubango"],
  moxico: ["Moxico", "Moxico Leste"],
  luanda: ["Luanda", "Icolo e Bengo"],
  bengo: ["Bengo", "Icolo e Bengo"],
};

const provinceCandidates = (state: string | undefined): readonly Provincia[] => {
  if (!state) return [];
  const key = normalizeName(state);
  if (!key) return [];
  const alias = PROVINCE_ALIASES[key];
  if (alias) return alias;
  const exact = PROVINCIAS.find((p) => normalizeName(p) === key);
  return exact ? [exact] : [];
};

const findMunicipio = (provincias: readonly Provincia[], names: readonly string[]) => {
  const matches: { provincia: Provincia; municipio: string }[] = [];
  for (const name of names) {
    const key = normalizeName(name);
    if (!key) continue;
    for (const provincia of provincias) {
      const municipio = MUNICIPIOS[provincia].find((m) => normalizeName(m) === key);
      if (municipio && !matches.some((x) => x.provincia === provincia && x.municipio === municipio))
        matches.push({ provincia, municipio });
    }
    // O primeiro nome que corresponde ganha (os nomes vêm do mais específico para o mais geral).
    if (matches.length > 0) break;
  }
  return matches.length === 1 ? matches[0]! : null;
};

/** Resultado em bruto da geocodificação inversa (apenas texto, sem coordenadas). */
export type GeocodedPlace = {
  countryCode: string | null;
  state: string | null;
  /** Possíveis nomes de município, do mais específico para o mais geral. */
  municipalityNames: string[];
  locality: string | null;
};

export type LocationMatch =
  | { kind: "fora-de-angola" }
  | {
      kind: "angola";
      provincia: Provincia | null;
      /**
       * true quando a província foi deduzida só do nome antigo no mapa (ex.: "Luanda"
       * pode ser Luanda ou Icolo e Bengo). O cliente tem sempre de confirmar.
       */
      provinciaIncerta: boolean;
      /** Outras províncias possíveis, para avisar o cliente. */
      alternativas: readonly Provincia[];
      municipio: string | null;
      localidade: string | null;
    };

export function matchLocation(place: GeocodedPlace): LocationMatch {
  if (place.countryCode?.toLowerCase() !== "ao") return { kind: "fora-de-angola" };

  const candidatas = provinceCandidates(place.state ?? undefined);
  // Primeiro tenta dentro das províncias indicadas pelo mapa; se o mapa não indicar
  // nenhuma, procura em todo o país (só aceita correspondência única).
  const hit = findMunicipio(
    candidatas.length > 0 ? candidatas : PROVINCIAS,
    place.municipalityNames,
  );

  if (hit) {
    return {
      kind: "angola",
      provincia: hit.provincia,
      provinciaIncerta: false,
      alternativas: [],
      municipio: hit.municipio,
      localidade: place.locality,
    };
  }

  const stateKey = place.state ? normalizeName(place.state) : "";
  const provincia =
    candidatas.length === 1
      ? candidatas[0]!
      : (candidatas.find((p) => normalizeName(p) === stateKey) ?? null);
  return {
    kind: "angola",
    provincia,
    provinciaIncerta: candidatas.length > 1,
    alternativas: candidatas.filter((p) => p !== provincia),
    municipio: null,
    localidade: place.locality,
  };
}

/** Extrai do endereço do Nominatim (OpenStreetMap) só os nomes que interessam. */
export function placeFromNominatim(address: Record<string, unknown> | undefined): GeocodedPlace {
  const pick = (...keys: string[]) =>
    keys
      .map((k) => address?.[k])
      .filter((v): v is string => typeof v === "string" && v.trim() !== "")
      .map((v) => v.trim());
  return {
    countryCode: pick("country_code")[0] ?? null,
    state: pick("state", "province", "region")[0] ?? null,
    // Em Luanda o mapa ainda usa "Município de Luanda"; o bairro (ex.: Talatona, Viana)
    // costuma coincidir com o município actual, por isso entra no fim da lista.
    municipalityNames: pick(
      "city_district",
      "town",
      "city",
      "municipality",
      "county",
      "village",
      "suburb",
      "quarter",
    ),
    locality: pick("suburb", "quarter", "neighbourhood", "village", "hamlet")[0] ?? null,
  };
}
