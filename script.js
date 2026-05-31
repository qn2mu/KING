let FaceLandmarker = null;
let FilesetResolver = null;

/* ==========================================================================
   PHYSIOGNOMY DATABASE (관상 데이터베이스 - 장점 및 주의점 포함)
   ========================================================================== */
const PHYSIOGNOMY_DB = {
  eyes: [
    {
      name: "봉황안 (鳳凰眼)",
      desc: "눈 모양이 가늘고 길며 끝부분이 칼집처럼 잘려 올라간 모양",
      interpretation: "전통 관상학에서는 지혜가 깊고 기품이 높아 대의명분을 통해 높은 명예를 얻을 기운으로 해석하기도 합니다.",
      good: ["판단력", "통솔력", "사회운"],
      weak: ["대인운"],
      caution: "스스로에 대한 엄격함으로 인해 주변인들과 조화로운 타협이 다소 어려울 수 있다고 보기도 합니다.",
      target: { ratio: 3.8, tilt: 10, symmetry: 0.95 },
      pros: ["침착함", "신중함", "장기적 시야"],
      cons: ["감정 표현이 적어 보일 수 있음", "친해지는 데 시간이 필요할 수 있음"]
    },
    {
      name: "용안 (龍眼)",
      desc: "눈꺼풀에 맑은 주름이 지고 검은동자가 투명하게 빛나는 모양",
      interpretation: "전통 관상학에서는 큰 조직을 다스리는 주도적 위엄과 제왕적 판단 기세를 품은 상으로 해석하기도 합니다.",
      good: ["통솔력", "결단력", "권력운"],
      weak: ["인간관계운"],
      caution: "자기 확신이 지나치게 우세하여 주변의 경고나 타당한 조언을 배척할 우려가 있다고 해석하기도 합니다.",
      target: { ratio: 3.0, tilt: 7, symmetry: 0.96 },
      pros: ["리더십", "추진력", "안정된 시선"],
      cons: ["자신감이 강하게 비칠 수 있음"]
    },
    {
      name: "호안 (虎眼)",
      desc: "눈이 늠름하게 크고 둥글며 부릅뜬 듯 힘이 서린 모양",
      interpretation: "전통 관상학에서는 강한 용맹성과 기백을 지녀 악조건 속에서도 빠른 성취를 이뤄낼 추진의 기운으로 해석합니다.",
      good: ["추진력", "결단력", "권력운"],
      weak: ["대인운"],
      caution: "급하고 과격한 추진 기향으로 인해 예기치 못한 주변 마찰이 잦을 수 있다고 봅니다.",
      target: { ratio: 2.3, tilt: -2, symmetry: 0.94 },
      pros: ["결단력", "행동력", "뚜렷한 시선"],
      cons: ["경쟁심이 강하게 보일 수 있음"]
    },
    {
      name: "학안 (鶴眼)",
      desc: "눈동자가 깨끗하며 기품 있는 온화함과 평온함을 주는 모양",
      interpretation: "전통 관상학에서는 사리사욕을 다스리며 학문적 성취나 예도에서 널리 신망을 얻을 학자의 기운으로 봅니다.",
      good: ["판단력", "사회운", "인간관계운"],
      weak: ["추진력"],
      caution: "속세적 승부처나 공격적 재물 획득 상황에서 스스로 물러서는 경향이 강하다고 해석합니다.",
      target: { ratio: 3.1, tilt: 1, symmetry: 0.95 },
      pros: ["지적 이미지", "차분함", "부드러운 눈"],
      cons: ["다소 소극적으로 보일 수 있음"]
    },
    {
      name: "사안 (蛇眼)",
      desc: "안형이 얇고 예리하여 차가운 광채를 뿜어내는 모양",
      interpretation: "전통 관상학에서는 집중적인 집착력과 상대의 핵심을 꿰뚫는 예리한 전략을 실현할 모사의 기운으로 봅니다.",
      good: ["판단력", "추진력", "결단력"],
      weak: ["대인운"],
      caution: "단독 지향적인 판단 기조로 인해 집단적 협업에서 고립을 야기하기 쉽다고 조언합니다.",
      target: { ratio: 3.6, tilt: -4, symmetry: 0.92 },
      pros: ["치밀한 분석력", "목표 집중도"],
      cons: ["독단적인 성향으로 비칠 수 있음"]
    },
    {
      name: "장안 (豹眼)",
      desc: "눈매가 힘차게 찢어지고 사나운 위세가 은근히 풍기는 모양",
      interpretation: "전통 관상학에서는 타인의 간섭을 받지 않고 자율적으로 가문을 일으킬 신흥 개척자의 기운으로 해석합니다.",
      good: ["추진력", "결단력", "통솔력"],
      weak: ["인간관계운"],
      caution: "적과 동지를 확실히 나누는 성정으로 인해 아랫사람과의 융화가 약화될 수 있다고 봅니다.",
      target: { ratio: 2.6, tilt: 3, symmetry: 0.94 },
      pros: ["도전 정신", "빠른 실행력"],
      cons: ["아랫사람과의 갈등을 겪을 수 있음"]
    },
    {
      name: "원안 (圓眼)",
      desc: "동그랗고 부드러우며 다정하고 유연한 인상을 지닌 모양",
      interpretation: "전통 관상학에서는 친화적 감수성을 지녀 주변 이들과 넓은 화합을 일구고 호감을 끄는 기운으로 해석합니다.",
      good: ["대인운", "인간관계운", "사회운"],
      weak: ["결단력"],
      caution: "성품이 다소 모질지 못하여 타인의 부탁에 휩쓸려 손실을 입을 우려가 존재합니다.",
      target: { ratio: 1.9, tilt: 0, symmetry: 0.97 },
      pros: ["대인 친화력", "유연한 융화력"],
      cons: ["결정적 순간에 결단이 흔들릴 수 있음"]
    },
    {
      name: "세안 (細眼)",
      desc: "가늘고 길어 신중하고 조심성 있는 분위기를 내뿜는 모양",
      interpretation: "전통 관상학에서는 매사 돌다리도 두드릴 정도의 면밀함으로 리스크 없이 안정적 자산을 지키는 기운으로 봅니다.",
      good: ["판단력", "재물운", "말년운"],
      weak: ["추진력"],
      caution: "과도한 숙고로 인해 일시에 도래하는 일생일대의 돌파 기회를 놓칠 가능성이 있다고 조언합니다.",
      target: { ratio: 4.1, tilt: 0, symmetry: 0.95 },
      pros: ["리스크 관리", "신중함", "안정성"],
      cons: ["최적의 타이밍을 지연시킬 수 있음"]
    }
  ],
  eyebrows: [
    {
      name: "용미 (龍眉)",
      desc: "활 모양으로 아름답게 굽어 눈꼬리 부근에 정갈하게 모인 모양",
      interpretation: "전통 관상학에서는 귀인의 원조를 널리 얻으며 대업을 함께할 조력운이 가득한 기운으로 해석합니다.",
      good: ["대인운", "사회운", "통솔력"],
      weak: ["결단력"],
      caution: "동료의 시선을 우선 의식하느라 자신 고유의 의사결정을 늦추는 경향이 있습니다.",
      target: { tilt: 8, length: 1.35 },
      pros: ["책임감", "조직 통솔력"],
      cons: ["고집이 세다는 인상을 줄 수 있음"]
    },
    {
      name: "일자미 (一字眉)",
      desc: "수평으로 곧고 기운차게 뻗어나간 형태의 모양",
      interpretation: "전통 관상학에서는 강건한 자기 신념을 유지하며 목표를 행해 꺾임 없이 나아가는 추진의 기운으로 봅니다.",
      good: ["추진력", "결단력", "통솔력"],
      weak: ["인간관계운"],
      caution: "협의를 배제하는 완고함으로 인해 대외 소통에서 불화를 자초하기 쉬운 상으로 조언합니다.",
      target: { tilt: 1, length: 1.25 },
      pros: ["논리적 사고", "체계적 계획성"],
      cons: ["융통성이 다소 부족해 보일 수 있음"]
    },
    {
      name: "검미 (劍眉)",
      desc: "시작은 얇다가 끝부분이 칼끝처럼 매섭게 솟아오른 모양",
      interpretation: "전통 관상학에서는 불의를 경계하고 정의감이 굳세어 궂은 난관도 돌파해내는 기운으로 해석합니다.",
      good: ["결단력", "추진력", "권력운"],
      weak: ["대인운"],
      caution: "스스로와 타인에게 극도로 엄격한 잣대를 들이대며 주변을 경직시킬 수 있습니다.",
      target: { tilt: 14, length: 1.2 },
      pros: ["추진력", "강한 실행력"],
      cons: ["다소 급하고 성급해 보일 수 있음"]
    },
    {
      name: "월미 (月眉)",
      desc: "초승달을 그리듯 맑고 단아하게 흐르는 부드러운 모양",
      interpretation: "전통 관상학에서는 평화와 감수성을 상징하며 대인 융화력이 수려한 기운으로 해석하기도 합니다.",
      good: ["대인운", "인간관계운", "사회운"],
      weak: ["추진력"],
      caution: "경쟁이 격화되는 비즈니스 현장에서 결단 기백이 주저앉기 쉬운 취약성이 따릅니다.",
      target: { tilt: 6, length: 1.4 },
      pros: ["감수성", "소통 융화력"],
      cons: ["갈등 회피 성향으로 해석될 수 있음"]
    },
    {
      name: "팔자미 (八字眉)",
      desc: "여덟 팔(八)자 형태로 끝부분이 부드럽게 하향 정렬된 모양",
      interpretation: "전통 관상학에서는 상황 변화를 너그럽게 포용하며 갈등을 원만히 해소하는 상으로 해석합니다.",
      good: ["대인운", "인간관계운", "말년운"],
      weak: ["추진력", "결단력"],
      caution: "스스로 기치를 들고 가동하는 힘이 모자라 타인의 결정을 쫓아 가기 쉽습니다.",
      target: { tilt: -8, length: 1.3 },
      pros: ["포용 태도", "온화한 관계성"],
      cons: ["주도적 판단력이 약화되어 비칠 수 있음"]
    },
    {
      name: "장미 (長眉)",
      desc: "눈보다 확실히 길어 눈가를 평온하게 덮어 주는 무성한 모양",
      interpretation: "전통 관상학에서는 복록이 풍성하고 수명이 길며 가문과 형제간에 화평을 끄는 기운으로 해석합니다.",
      good: ["재물운", "말년운", "대인운"],
      weak: ["결단력"],
      caution: "새로운 전략적 도전에 직면했을 때 안정적 현실 안주에 갇힐 가능성이 있습니다.",
      target: { tilt: 4, length: 1.5 },
      pros: ["안정성", "두터운 인내력"],
      cons: ["보수적 판단에 갇힐 우려가 있음"]
    }
  ],
  nose: [
    {
      name: "용골코 (龍骨鼻)",
      desc: "콧대가 훤칠하고 코끝 준두가 분명하여 이마까지 막힘없이 이어지는 형태",
      interpretation: "전통 관상학에서는 큰 영예와 위세를 얻고 대중을 이끄는 지도자적 격식의 코로 해석합니다.",
      good: ["권력운", "통솔력", "사회운"],
      weak: ["대인운"],
      caution: "지나치게 고고한 자존심으로 인해 아랫사람과의 융화가 결여될 수 있습니다.",
      target: { lengthRatio: 0.38, widthRatio: 0.75 },
      pros: ["목표 의식", "강한 책임감"],
      cons: ["완벽주의 성향으로 비칠 수 있음"]
    },
    {
      name: "사자코 (獅子鼻)",
      desc: "콧망울이 두텁게 부풀어 올라 넓은 균형과 지탱력을 주는 모양",
      interpretation: "전통 관상학에서는 스스로의 힘으로 가업을 일구고 자산을 통솔할 거상의 상으로 봅니다.",
      good: ["통솔력", "추진력", "재물운"],
      weak: ["인간관계운"],
      caution: "타인의 합리적인 의견 제시에 고집을 굽히지 않아 갈등이 발생하기 쉽습니다.",
      target: { lengthRatio: 0.32, widthRatio: 0.95 },
      pros: ["포용력", "인간관계 관리 능력"],
      cons: ["과소비나 씀씀이가 커질 수 있음"]
    },
    {
      name: "복코 (懸膽鼻)",
      desc: "쓸개를 매단 듯이 콧망울 끝 준두가 탄탄하고 둥글게 처진 모양",
      interpretation: "전통 관상학에서는 의식(衣食)이 평생 끊이지 않고 재물을 가두어 축적하는 힘이 좋은 상으로 봅니다.",
      good: ["재물운", "말년운", "판단력"],
      weak: ["결단력"],
      caution: "리스크 감수를 지나치게 경계하여 적극적인 투자나 변화에 주저하는 성향입니다.",
      target: { lengthRatio: 0.34, widthRatio: 0.88 },
      pros: ["저축성", "리스크 감쇄 능력"],
      cons: ["공격적 투자 판단을 망설일 수 있음"]
    },
    {
      name: "재상코 (截筒鼻)",
      desc: "대나무통을 반으로 쪼개 놓은 것처럼 곧고 깨끗하게 뻗은 모양",
      interpretation: "전통 관상학에서는 매사 품행이 바르고 청렴하여 공직이나 중책에서 대업을 이뤄낼 상으로 봅니다.",
      good: ["판단력", "사회운", "재물운"],
      weak: ["추진력"],
      caution: "완벽주의적 일 처리 기조로 인해 동료들과 아랫사람에게 경직된 잣대를 세우기 쉽습니다.",
      target: { lengthRatio: 0.36, widthRatio: 0.80 },
      pros: ["규율 관리력", "원칙 준수"],
      cons: ["융통성이 다소 결여되어 비칠 수 있음"]
    },
    {
      name: "군자코 (君子鼻)",
      desc: "코의 대칭과 폭이 알맞게 어우러져 평범 단정함을 주는 모양",
      interpretation: "전통 관상학에서는 중용의 미덕을 지녀 삶을 순탄하고 무난하게 영위할 성향으로 봅니다.",
      good: ["판단력", "인간관계운", "말년운"],
      weak: ["권력운"],
      caution: "권력을 향한 투쟁적인 욕심이나 파괴적인 성취 에너지는 상대적으로 부족합니다.",
      target: { lengthRatio: 0.33, widthRatio: 0.82 },
      pros: ["중용 지향성", "안정된 시선"],
      cons: ["주도적 돌파 의지가 부족하게 보일 수 있음"]
    }
  ],
  mouth: [
    {
      name: "용구 (龍口)",
      desc: "입술이 늠름하게 두텁고 모서리 입꼬리가 위를 향해 솟구친 모양",
      interpretation: "전통 관상학에서는 신망이 두텁고 전달력이 굳세어 군중 앞에 설 큰 인물의 상으로 봅니다.",
      good: ["통솔력", "사회운", "말년운"],
      weak: ["인간관계운"],
      caution: "언사(言辭)가 너무 단호하고 무거워 아랫사람이 친근하게 다가오기 어렵습니다.",
      target: { ratio: 2.8, tilt: 0.08 },
      pros: ["설득력", "대화 소통 능력"],
      cons: ["말의 영향력이 불필요하게 커질 수 있음"]
    },
    {
      name: "월형구 (仰月口)",
      desc: "초승달처럼 입꼬리가 부드러운 호를 그리며 솟아오른 모양",
      interpretation: "전통 관상학에서는 언변이 유려하고 상대에게 환영받는 사교 및 외교의 기상으로 해석합니다.",
      good: ["대인운", "인간관계운", "사회운"],
      weak: ["결단력"],
      caution: "유려함이 지나쳐 자칫 신뢰성이나 무게감을 잃을 수 있으니 약속에 신중해야 합니다.",
      target: { ratio: 3.2, tilt: 0.12 },
      pros: ["공감 능력", "친화적 호감"],
      cons: ["감정적인 영향에 치우치기 쉬움"]
    },
    {
      name: "방형구 (四字口)",
      desc: "입매가 한자 넉 사(四)자 모양처럼 대칭 정렬로 굳건하게 닫힌 모양",
      interpretation: "전통 관상학에서는 정직과 약속을 소중히 하여 신뢰에 입각한 대업을 쌓을 상으로 해석합니다.",
      good: ["결단력", "판단력", "재물운"],
      weak: ["추진력"],
      caution: "무뚝뚝하거나 지나치게 차가운 인상을 주어 주변의 감정적 거리를 만들 수 있습니다.",
      target: { ratio: 2.4, tilt: 0.02 },
      pros: ["신뢰성", "성실한 성정"],
      cons: ["의사 표현이 다소 단조롭게 비칠 수 있음"]
    },
    {
      name: "앵도구 (櫻桃口)",
      desc: "앵두처럼 작고 입술이 붉으며 아담한 조화를 지닌 모양",
      interpretation: "전통 관상학에서는 총명하고 기지가 번뜩여 대중의 호감과 애정을 한몸에 담는 기운으로 봅니다.",
      good: ["대인운", "인간관계운", "사회운"],
      weak: ["통솔력"],
      caution: "거대한 집단의 의사결정 책임 상황에 당면하면 우유부단하게 가라앉기 쉽습니다.",
      target: { ratio: 1.8, tilt: 0.05 },
      pros: ["섬세한 감각", "지혜로운 기지"],
      cons: ["돌발 저항력에 취약해 보일 수 있음"]
    }
  ],
  cheekbones: [
    {
      name: "장군광대 (將軍顴)",
      desc: "광대 융기가 확실하며 얼굴 윤곽에 위엄을 불어넣는 형태",
      interpretation: "전통 관상학에서는 어떠한 난관 앞에서도 굴하지 않고 깃발을 꽂는 강인한 무장의 기상으로 봅니다.",
      good: ["추진력", "결단력", "통솔력"],
      weak: ["대인운"],
      caution: "목표를 향해 너무 다그치다 주변 조력자들의 원망을 살 수 있습니다.",
      target: { prominence: 0.88 },
      pros: ["의사결정력", "용맹성"],
      cons: ["주위 의견 수렴이 독단적으로 보일 수 있음"]
    },
    {
      name: "제왕광대 (帝王顴)",
      desc: "광대가 앞옆으로 둥글고 단단하게 솟아 얼굴을 주도하는 격식",
      interpretation: "전통 관상학에서는 권세의 기둥이 탄탄하여 집단을 이끌고 명예를 장악할 통치 상으로 해석합니다.",
      good: ["권력운", "통솔력", "사회운"],
      weak: ["인간관계운"],
      caution: "지나친 독점욕으로 주변 조력자들의 자율적 창의성을 억누를 리스크가 있습니다.",
      target: { prominence: 0.84 },
      pros: ["카리스마", "조직 조율 장악력"],
      cons: ["권위적인 면모가 강하게 해석될 수 있음"]
    },
    {
      name: "평형광대 (和平顴)",
      desc: "도드라짐 없이 얼굴 윤곽과 유기적으로 평탄하게 감싸인 모양",
      interpretation: "전통 관상학에서는 모나지 않은 성품을 지녀 갈등을 중재하고 조화롭게 협력하는 상으로 봅니다.",
      good: ["대인운", "인간관계운", "말년운"],
      weak: ["추진력", "결단력"],
      caution: "집단을 단독으로 이끌어 나가는 강력한 패기나 카리스마는 다소 미흡합니다.",
      target: { prominence: 0.77 },
      pros: ["협력성", "원만한 조력 능력"],
      cons: ["주도적 돌파 의지가 부족하게 보일 수 있음"]
    }
  ],
  jaw: [
    {
      name: "장군턱 (將軍地閣)",
      desc: "턱 골격이 두텁고 각이 살아 하관을 굳건히 받치는 형태",
      interpretation: "전통 관상학에서는 강인한 근성과 인내로 아랫사람의 지지를 확보해 가문을 지켜낼 보루의 상으로 봅니다.",
      good: ["추진력", "통솔력", "말년운"],
      weak: ["인간관계운"],
      caution: "자신의 고집을 절대로 굽히지 않아 부하 또는 가족들과 관계가 경직될 우려가 있습니다.",
      target: { angle: 25, widthRatio: 0.82 },
      pros: ["인내심", "과업 지속력"],
      cons: ["고집이 너무 강해 보일 수 있음"]
    },
    {
      name: "원형턱 (圓滿地閣)",
      desc: "턱끝이 U자형으로 풍만하고 부드럽게 감돌며 살집이 두터운 모양",
      interpretation: "전통 관상학에서는 나이가 들수록 추종자가 많아지고 안락한 부귀를 이뤄낼 턱으로 해석합니다.",
      good: ["말년운", "대인운", "재물운"],
      weak: ["결단력"],
      caution: "성정이 느긋하여 돌발 변수 대처 시 실행 속도가 느려질 가능성이 있습니다.",
      target: { angle: 18, widthRatio: 0.76 },
      pros: ["온화함", "포용적 협력성"],
      cons: ["결단 상황에서 지연될 수 있음"]
    },
    {
      name: "방형턱 (方正地閣)",
      desc: "하관의 골격이 평평하고 바위처럼 단단한 대칭을 주는 모양",
      interpretation: "전통 관상학에서는 근면과 인내를 최고의 가치로 삼아 과업을 완수해 내는 신의의 상으로 봅니다.",
      good: ["결단력", "판단력", "말년운"],
      weak: ["사회운"],
      caution: "도전보다는 안전 지향에 쏠려 혁신적인 변화를 수용하지 못할 수 있습니다.",
      target: { angle: 22, widthRatio: 0.88 },
      pros: ["지탱력", "신의 유지력"],
      cons: ["상황 변화 대처 속도가 둔감해 보일 수 있음"]
    }
  ],
  forehead: [
    {
      name: "제왕이마 (帝王額)",
      desc: "이마가 넓고 평평하며 흉이나 주름 없이 하늘을 담은 듯 훤한 모양",
      interpretation: "전통 관상학에서는 직관적 지혜가 출중하여 초년에 학식과 명예를 일찍 확보할 격식의 상으로 봅니다.",
      good: ["사회운", "권력운", "판단력"],
      weak: ["대인운"],
      caution: "지나친 명석함으로 인해 동료나 부하 직원의 결점을 지적하기 쉽습니다.",
      target: { heightRatio: 0.23 },
      pros: ["시야", "조직 관리력"],
      cons: ["지나치게 생각이 많아질 수 있음"]
    },
    {
      name: "학자이마 (學士額)",
      desc: "이마 경계선이 네모반듯하고 가지런하여 차분함을 주는 모양",
      interpretation: "전통 관상학에서는 학리적 탐구 능력이 우수하여 교육이나 깊은 성찰에 어울리는 상으로 봅니다.",
      good: ["판단력", "사회운", "인간관계운"],
      weak: ["추진력"],
      caution: "이론적인 검토에 갇혀 실질적인 돌파 행동이 결여되기 쉽습니다.",
      target: { heightRatio: 0.20 },
      pros: ["탐구심", "정밀한 분석력"],
      cons: ["고민이 많아질 수 있음"]
    },
    {
      name: "부귀이마 (富貴額)",
      desc: "둥그스름하며 특히 양 천창 부위 관자놀이가 잘 차오른 모양",
      interpretation: "전통 관상학에서는 비즈니스 자산의 축적 흐름을 짚어 부를 넉넉하게 축적할 상으로 봅니다.",
      good: ["재물운", "말년운", "대인운"],
      weak: ["결단력"],
      caution: "단기 손익 계산에 얽매여 대국적인 신의를 저해할 리스크가 있습니다.",
      target: { heightRatio: 0.18 },
      pros: ["자산 설계력", "두터운 인맥 자원"],
      cons: ["보수적 프레임에 안주할 수 있음"]
    }
  ]
};

/* ==========================================================================
   TITLES DATABASE (전통적 칭호 복구 - 20개)
   ========================================================================== */
const TITLES_DATABASE = [
  { name: "왕의 상 (王之相)", target: { leadership: 10, power: 10, judgment: 8, wealth: 8 } },
  { name: "장군의 상 (將軍之相)", target: { leadership: 9, drive: 10, determination: 9, power: 8 } },
  { name: "책사의 상 (策士之相)", target: { judgment: 10, determination: 8, power: 7, social: 8 } },
  { name: "상인의 상 (商人之相)", target: { wealth: 10, interpersonal: 9, relationship: 8, drive: 8 } },
  { name: "개국공신의 상 (開國功臣之相)", target: { drive: 10, leadership: 8, determination: 9, power: 9 } },
  { name: "천하를 다스릴 상 (희귀) (天下之相)", target: { power: 12, leadership: 12, judgment: 10, wealth: 10 } },
  
  // Fallbacks & alternates
  { name: "영의정 재상의 상 (宰相之相)", target: { judgment: 10, social: 9, relationship: 8, wealth: 8 } },
  { name: "대제학 학자의 상 (學者之相)", target: { judgment: 10, social: 9, relationship: 8, lateLife: 8 } },
  { name: "조정 외교관의 상 (外交官之相)", target: { interpersonal: 10, relationship: 9, social: 9, judgment: 8 } },
  { name: "명문 가주의 상 (名門家主之相)", target: { leadership: 8, lateLife: 10, relationship: 8, wealth: 9 } },
  { name: "일국 대부호의 상 (大富豪之相)", target: { wealth: 12, lateLife: 9, interpersonal: 8, judgment: 7 } },
  { name: "왕을 보좌할 현인의 상 (佐王之相)", target: { judgment: 9, relationship: 9, social: 9, power: 6 } },
  { name: "강호를 지키는 은둔고수의 상 (隱遁高手之相)", target: { determination: 10, judgment: 9, lateLife: 8, social: 5 } },
  { name: "구국의 구도자이자 영웅의 상 (英雄之相)", target: { drive: 10, leadership: 9, determination: 10, interpersonal: 8 } },
  { name: "조정 지휘관의 상 (指揮官之相)", target: { leadership: 10, drive: 8, determination: 8, power: 8 } },
  { name: "국면을 돌파할 선구자의 상 (開拓者之相)", target: { drive: 11, determination: 10, leadership: 7, interpersonal: 6 } },
  { name: "대륙을 다스릴 통치자의 상 (統治者之相)", target: { power: 11, leadership: 10, judgment: 8, drive: 7 } },
  { name: "조정을 기획할 전략가의 상 (戰略家之相)", target: { judgment: 10, determination: 9, power: 8, interpersonal: 6 } },
  { name: "시대를 뒤흔들 혁신가의 상 (革新家之相)", target: { drive: 10, determination: 9, judgment: 8, social: 8 } },
  { name: "대를 이을 사직의 상 (社稷之相)", target: { lateLife: 10, relationship: 9, judgment: 9, social: 7 } }
];

/* ==========================================================================
   APP STATE
   ========================================================================== */
window.appLoaded = true;

let faceLandmarker = null;
let webcamStream = null;
let animationFrameId = null;
let isModelLoading = false;
let currentStage = 'idle'; 
let stageStartTime = 0;
let stableFaceCount = 0;
let lastDetectedFeatures = null;
let bestFaceCanvas = null;

// Element Selectors
let welcomeScreen, scannerScreen, resultScreen, btnStart, btnRestart, btnShare;
let btnViewProduct, btnBuyProduct, webcam, overlayCanvas, ctx;
let faceGuideFrame, currentStepTitle, scannerProgress, scanMessage, shutterFlash, globalLoader;
let cameraErrorOverlay, btnErrorRetry;
let snapshotFrame, resultTitle, resultFeaturesList, positiveEnergiesList, warningEnergiesList;
let reviewText, metricRationaleList, recoTitle, recoExplanation, recoImage, hudProgressPercent;
let resultProsList, resultConsList;

document.addEventListener("DOMContentLoaded", () => {
  console.log("[DOM CONTENT LOADED]");
  welcomeScreen = document.getElementById("welcome-screen");
  scannerScreen = document.getElementById("scanner-screen");
  resultScreen = document.getElementById("result-screen");
  btnStart = document.getElementById("btn-start");
  btnRestart = document.getElementById("btn-restart");
  btnShare = document.getElementById("btn-share");
  btnViewProduct = document.getElementById("btn-view-product");
  btnBuyProduct = document.getElementById("btn-buy-product");
  webcam = document.getElementById("webcam");
  overlayCanvas = document.getElementById("overlay-canvas");
  if (overlayCanvas) ctx = overlayCanvas.getContext("2d");
  faceGuideFrame = document.querySelector(".face-guide-frame");
  currentStepTitle = document.querySelector(".current-step-title");
  scannerProgress = document.getElementById("scanner-progress");
  hudProgressPercent = document.getElementById("hud-progress-percent");
  scanMessage = document.getElementById("scan-message");
  shutterFlash = document.getElementById("shutter-flash");
  globalLoader = document.getElementById("global-loader");

  cameraErrorOverlay = document.getElementById("camera-error-overlay");
  btnErrorRetry = document.getElementById("btn-error-retry");

  snapshotFrame = document.getElementById("snapshot-frame");
  resultTitle = document.getElementById("result-title");
  resultFeaturesList = document.getElementById("result-features-list");
  positiveEnergiesList = document.getElementById("positive-energies");
  warningEnergiesList = document.getElementById("warning-energies");
  reviewText = document.getElementById("review-text");
  metricRationaleList = document.getElementById("metric-rationale-list");
  recoTitle = document.getElementById("reco-title");
  recoExplanation = document.getElementById("reco-explanation");
  recoImage = document.getElementById("reco-image");
  
  resultProsList = document.getElementById("result-pros");
  resultConsList = document.getElementById("result-cons");

  if (btnStart) btnStart.addEventListener("click", handleStart);
  if (btnRestart) btnRestart.addEventListener("click", resetToWelcome);
  if (btnShare) btnShare.addEventListener("click", downloadReportCard);
  if (btnErrorRetry) {
    btnErrorRetry.addEventListener("click", () => {
      if (cameraErrorOverlay) cameraErrorOverlay.classList.remove("active");
      handleStart();
    });
  }
  
  console.log("[EVENT LISTENERS BOUND]");
});

/* ==========================================================================
   LOADER & MODEL MANAGEMENT
   ========================================================================== */
function showLoader(titleText, subtitleText) {
  if (globalLoader) {
    const titleEl = globalLoader.querySelector(".loader-title");
    const subEl = globalLoader.querySelector(".loader-subtitle");
    if (titleEl) titleEl.textContent = titleText;
    if (subEl) subEl.textContent = subtitleText || "";
    globalLoader.classList.add("active");
  }
}

function hideLoader() {
  if (globalLoader) globalLoader.classList.remove("active");
}

function updateLoaderMessage(titleText, subtitleText) {
  if (globalLoader) {
    const titleEl = globalLoader.querySelector(".loader-title");
    const subEl = globalLoader.querySelector(".loader-subtitle");
    if (titleEl) titleEl.textContent = titleText;
    if (subEl && subtitleText !== undefined) subEl.textContent = subtitleText;
  }
}

async function initializeModel() {
  if (faceLandmarker) return;
  
  isModelLoading = true;
  showLoader("관상가의 혜안을 여는 중", "AI 관상 판정 모델의 랜드마크 엔진을 전개하고 있습니다...");

  try {
    const module = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8");
    FaceLandmarker = module.FaceLandmarker;
    FilesetResolver = module.FilesetResolver;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numFaces: 1
    });
  } catch (error) {
    console.error("Failed to load FaceLandmarker Model:", error);
    throw error;
  } finally {
    isModelLoading = false;
  }
}

/* ==========================================================================
   WEBCAM STREAM
   ========================================================================== */
async function startWebcam() {
  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: "user"
      },
      audio: false
    });
    webcam.srcObject = webcamStream;
    
    webcam.addEventListener("loadedmetadata", () => {
      overlayCanvas.width = webcam.videoWidth;
      overlayCanvas.height = webcam.videoHeight;
    });
    
    return true;
  } catch (error) {
    console.error("Camera access failed:", error);
    return false;
  }
}

function stopWebcam() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/* ==========================================================================
   METRIC CALCULATION ENGINE
   ========================================================================== */
function getDistance(pt1, pt2) {
  return Math.hypot(pt1.x - pt2.x, pt1.y - pt2.y);
}

function extractFaceMetrics(landmarks) {
  const leftCheekEdge = landmarks[234];
  const rightCheekEdge = landmarks[454];
  const foreheadTop = landmarks[10];
  const chinBottom = landmarks[152];
  
  const faceWidth = getDistance(leftCheekEdge, rightCheekEdge);
  const faceHeight = getDistance(foreheadTop, chinBottom);
  
  // EYES
  const leftEyeWidth = getDistance(landmarks[362], landmarks[263]);
  const leftEyeHeight = (getDistance(landmarks[386], landmarks[374]) + getDistance(landmarks[385], landmarks[373])) / 2;
  const leftEyeRatio = leftEyeWidth / (leftEyeHeight || 0.01);
  const leftEyeTilt = ((landmarks[362].y - landmarks[263].y) / leftEyeWidth) * 100;
  
  const rightEyeWidth = getDistance(landmarks[133], landmarks[33]);
  const rightEyeHeight = (getDistance(landmarks[159], landmarks[145]) + getDistance(landmarks[158], landmarks[144])) / 2;
  const rightEyeRatio = rightEyeWidth / (rightEyeHeight || 0.01);
  const rightEyeTilt = ((landmarks[133].y - landmarks[33].y) / rightEyeWidth) * 100;
  
  const avgEyeRatio = (leftEyeRatio + rightEyeRatio) / 2;
  const avgEyeTilt = (leftEyeTilt + rightEyeTilt) / 2;
  const eyeSymmetry = Math.min(leftEyeWidth, rightEyeWidth) / Math.max(leftEyeWidth, rightEyeWidth);
  const interEyeDistance = getDistance(landmarks[362], landmarks[133]) / faceWidth;
  
  // EYEBROWS
  const rightBrowWidth = getDistance(landmarks[107], landmarks[70]);
  const leftBrowWidth = getDistance(landmarks[336], landmarks[300]);
  const avgBrowWidthRatio = ((rightBrowWidth + leftBrowWidth) / 2) / ((leftEyeWidth + rightEyeWidth) / 2);
  
  const rightBrowTilt = ((landmarks[107].y - landmarks[70].y) / rightBrowWidth) * 100;
  const leftBrowTilt = ((landmarks[336].y - landmarks[300].y) / leftBrowWidth) * 100;
  const avgBrowTilt = (rightBrowTilt + leftBrowTilt) / 2;
  
  // NOSE
  const noseLength = getDistance(landmarks[168], landmarks[4]) / faceHeight;
  const noseAlarWidth = getDistance(landmarks[278], landmarks[48]);
  const noseBridgeWidth = getDistance(landmarks[344], landmarks[115]);
  const noseAlarRatio = noseAlarWidth / (noseBridgeWidth || 0.01);

  // MOUTH
  const mouthWidth = getDistance(landmarks[291], landmarks[61]);
  const mouthHeight = getDistance(landmarks[0], landmarks[17]);
  const mouthRatio = mouthWidth / (mouthHeight || 0.01);
  const mouthCenterY = (landmarks[0].y + landmarks[17].y) / 2;
  const leftCornerTilt = (mouthCenterY - landmarks[291].y) / mouthWidth;
  const rightCornerTilt = (mouthCenterY - landmarks[61].y) / mouthWidth;
  const avgMouthCornerTilt = (leftCornerTilt + rightCornerTilt) / 2;

  // CHEEKBONES
  const cheekboneProminence = getDistance(landmarks[425], landmarks[205]) / faceWidth;

  // JAW
  const jawWidthRatio = getDistance(landmarks[58], landmarks[288]) / faceWidth;
  const rightJawVector = { x: landmarks[152].x - landmarks[58].x, y: landmarks[152].y - landmarks[58].y };
  const leftJawVector = { x: landmarks[152].x - landmarks[288].x, y: landmarks[152].y - landmarks[288].y };
  const jawAngleRight = Math.atan2(rightJawVector.y, rightJawVector.x) * (180 / Math.PI);
  const jawAngleLeft = Math.atan2(leftJawVector.y, -leftJawVector.x) * (180 / Math.PI);
  const avgJawAngle = (jawAngleRight + jawAngleLeft) / 2;

  // FOREHEAD
  const foreheadHeight = getDistance(landmarks[10], landmarks[168]) / faceHeight;

  return {
    eye: { ratio: avgEyeRatio, tilt: avgEyeTilt, symmetry: eyeSymmetry, inter: interEyeDistance },
    eyebrow: { tilt: avgBrowTilt, length: avgBrowWidthRatio },
    nose: { lengthRatio: noseLength, widthRatio: noseAlarRatio },
    mouth: { ratio: mouthRatio, tilt: avgMouthCornerTilt },
    cheekbones: { prominence: cheekboneProminence },
    jaw: { angle: avgJawAngle, widthRatio: jawWidthRatio },
    forehead: { heightRatio: foreheadHeight }
  };
}

function calculateSimilarity(val, target, weight = 1, tolerance = 0.15) {
  const diff = val - target;
  return Math.exp(-Math.pow(diff / tolerance, 2) * weight);
}

function evaluatePhysiognomy(metrics) {
  const evaluateField = (field, dbField, calcFn) => {
    let bestItem = null;
    let bestScore = -1;
    const scores = PHYSIOGNOMY_DB[dbField].map(item => {
      const score = Math.max(10, Math.round(100 * calcFn(item)));
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
      return { name: item.name, score };
    });
    return { item: bestItem, score: bestScore, all: scores };
  };

  const eyeRes = evaluateField('eye', 'eyes', (item) => {
    const sRatio = calculateSimilarity(metrics.eye.ratio, item.target.ratio, 1.5, 0.5);
    const sTilt = calculateSimilarity(metrics.eye.tilt, item.target.tilt, 1.2, 5);
    return sRatio * 0.6 + sTilt * 0.4;
  });

  const browRes = evaluateField('eyebrow', 'eyebrows', (item) => {
    const sTilt = calculateSimilarity(metrics.eyebrow.tilt, item.target.tilt, 1.5, 4);
    const sLen = calculateSimilarity(metrics.eyebrow.length, item.target.length, 1.0, 0.15);
    return sTilt * 0.6 + sLen * 0.4;
  });

  const noseRes = evaluateField('nose', 'nose', (item) => {
    const sLen = calculateSimilarity(metrics.nose.lengthRatio, item.target.lengthRatio, 1.2, 0.05);
    const sWid = calculateSimilarity(metrics.nose.widthRatio, item.target.widthRatio, 1.2, 0.15);
    return sLen * 0.5 + sWid * 0.5;
  });

  const mouthRes = evaluateField('mouth', 'mouth', (item) => {
    const sRatio = calculateSimilarity(metrics.mouth.ratio, item.target.ratio, 1.0, 0.4);
    const sTilt = calculateSimilarity(metrics.mouth.tilt, item.target.tilt, 2.0, 0.04);
    return sRatio * 0.4 + sTilt * 0.6;
  });

  const cheekRes = evaluateField('cheekbones', 'cheekbones', (item) => {
    return calculateSimilarity(metrics.cheekbones.prominence, item.target.prominence, 1.5, 0.05);
  });

  const jawRes = evaluateField('jaw', 'jaw', (item) => {
    const sAngle = calculateSimilarity(metrics.jaw.angle, item.target.angle, 1.2, 5);
    const sWid = calculateSimilarity(metrics.jaw.widthRatio, item.target.widthRatio, 1.2, 0.08);
    return sAngle * 0.5 + sWid * 0.5;
  });

  const foreheadRes = evaluateField('forehead', 'forehead', (item) => {
    return calculateSimilarity(metrics.forehead.heightRatio, item.target.heightRatio, 1.5, 0.03);
  });

  return {
    selections: {
      eye: eyeRes,
      eyebrow: browRes,
      nose: noseRes,
      mouth: mouthRes,
      cheekbones: cheekRes,
      jaw: jawRes,
      forehead: foreheadRes
    }
  };
}

function calculateFinalReport(selections, metrics) {
  const energyLevels = {
    leadership: 3.5,
    judgment: 3.5,
    wealth: 3.5,
    power: 3.5,
    interpersonal: 3.5,
    relationship: 3.5,
    social: 3.5,
    lateLife: 3.5,
    drive: 3.5,
    determination: 3.5
  };

  const mapAttrToKey = (koreanAttr) => {
    const map = {
      "통솔력": "leadership", "판단력": "judgment", "재물운": "wealth",
      "권력운": "power", "대인운": "interpersonal", "인간관계운": "relationship",
      "사회운": "social", "말년운": "lateLife", "추진력": "drive", "결단력": "determination"
    };
    return map[koreanAttr] || null;
  };

  Object.keys(selections).forEach(key => {
    const selection = selections[key];
    const item = selection.item;
    const scoreNorm = selection.score / 100; // 0.1 ~ 1.0

    if (item && item.good) {
      item.good.forEach(attr => {
        const attrKey = mapAttrToKey(attr);
        if (attrKey) energyLevels[attrKey] += 1.5 * scoreNorm;
      });
    }
    if (item && item.weak) {
      item.weak.forEach(attr => {
        const attrKey = mapAttrToKey(attr);
        if (attrKey) energyLevels[attrKey] -= 1.2 * scoreNorm;
      });
    }
  });

  // Structural Adjustments based on metrics
  if (metrics.mouth.tilt < -0.01) {
    energyLevels.relationship -= 0.8;
    energyLevels.lateLife -= 0.8;
  }
  if (metrics.eyebrow.tilt < -3) {
    energyLevels.interpersonal -= 0.8;
    energyLevels.drive -= 0.8;
  }
  if (metrics.cheekbones.prominence < 0.79) {
    energyLevels.power -= 0.8;
    energyLevels.leadership -= 0.8;
  }

  const normalizedRatings = {};
  Object.keys(energyLevels).forEach(key => {
    // 0.1 단위 정교한 값 도출 (변별력 향상)
    normalizedRatings[key] = Math.max(1.0, Math.min(5.0, Math.round(energyLevels[key] * 10) / 10));
  });

  // 1. 감지된 개별 부위 추출
  const eye = selections.eye.item.name.split(" ")[0]; // "봉황안", "용안" 등
  const nose = selections.nose.item.name.split(" ")[0]; // "용골코", "사자코" 등
  const brow = selections.eyebrow.item.name.split(" ")[0]; // "용미", "일자미" 등
  const mouth = selections.mouth.item.name.split(" ")[0]; // "용구", "월형구" 등
  const cheek = selections.cheekbones.item.name.split(" ")[0]; // "장군광대" 등
  const jaw = selections.jaw.item.name.split(" ")[0]; // "장군턱", "원형턱" 등
  const forehead = selections.forehead.item.name.split(" ")[0]; // "제왕이마" 등

  let bestTitle = "영의정 재상의 상 (宰相之相)"; // Default fallback

  // Rule-Based Decision Logic matching user spec
  if (eye === "봉황안" && forehead === "제왕이마" && nose === "용골코" && jaw === "장군턱") {
    bestTitle = "천하를 다스릴 상 (희귀) (天下之相)";
  } else if (eye === "봉황안" && brow === "용미" && forehead === "제왕이마") {
    bestTitle = "왕의 상 (王之相)";
  } else if (eye === "용안" && nose === "용골코" && jaw === "장군턱") {
    bestTitle = "장군의 상 (將軍之相)";
  } else if (eye === "학안" && forehead === "학자이마" && brow === "일자미") {
    bestTitle = "책사의 상 (策士之相)";
  } else if (nose === "사자코" && mouth === "월형구") {
    bestTitle = "상인의 상 (商人之相)";
  } else if (eye === "호안" && jaw === "장군턱" && brow === "검미") {
    bestTitle = "개국공신의 상 (開國功臣之相)";
  } else {
    // Dynamic distance backup for other unique combinations
    let minDiff = Infinity;
    TITLES_DATABASE.forEach(title => {
      // Avoid rule titles in the distance fallback to keep them unique
      if (["왕의 상 (王之相)", "장군의 상 (將軍之相)", "책사의 상 (策士之相)", "상인의 상 (商人之相)", "개국공신의 상 (開國功臣之相)", "천하를 다스릴 상 (희귀) (天下之相)"].includes(title.name)) {
        return;
      }
      let diffSum = 0;
      Object.keys(title.target).forEach(attrKey => {
        const scaledVal = normalizedRatings[attrKey] * 2; 
        diffSum += Math.pow(scaledVal - title.target[attrKey], 2);
      });
      if (diffSum < minDiff) {
        minDiff = diffSum;
        bestTitle = title.name;
      }
    });
  }

  return {
    ratings: normalizedRatings,
    title: bestTitle
  };
}

/* ==========================================================================
   CANVAS RENDERING UTILITIES (Hologram cyber mesh & glowing tracers)
   ========================================================================== */

function drawMeshPath(indices, landmarks, strokeStyle, lineWidth) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  indices.forEach((idx, i) => {
    const pt = landmarks[idx];
    if (pt) {
      const cx = pt.x * overlayCanvas.width;
      const cy = pt.y * overlayCanvas.height;
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
  });
  ctx.stroke();
}

function drawFaceMeshHUD(landmarks, activeStage) {
  ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  if (!landmarks) return;

  // 1. Draw entire cybernetic face mesh in transparent holographic cyan
  const cyanStyle = "rgba(0, 229, 255, 0.13)";
  const thinWidth = 0.8;
  
  drawMeshPath([33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33], landmarks, cyanStyle, thinWidth);
  drawMeshPath([362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362], landmarks, cyanStyle, thinWidth);
  drawMeshPath([70, 63, 105, 66, 107, 55, 65, 52, 53, 46], landmarks, cyanStyle, thinWidth);
  drawMeshPath([300, 293, 334, 296, 336, 285, 295, 282, 283, 276], landmarks, cyanStyle, thinWidth);
  drawMeshPath([168, 6, 197, 195, 5, 4, 1, 19, 94, 2], landmarks, cyanStyle, thinWidth);
  drawMeshPath([48, 115, 220, 45, 4, 275, 440, 344, 278], landmarks, cyanStyle, thinWidth);
  drawMeshPath([61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61], landmarks, cyanStyle, thinWidth);
  drawMeshPath([58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288], landmarks, cyanStyle, thinWidth);
  drawMeshPath([10, 338, 297, 332, 284, 251, 389, 162, 21, 54, 103, 67, 109, 10], landmarks, cyanStyle, thinWidth);

  // 2. Highlight active scanning stage with electric gold / glowing border
  if (activeStage === 'aligning' || activeStage === 'finished' || activeStage === 'idle') return;

  ctx.fillStyle = "rgba(6, 9, 19, 0.4)";
  ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  let activeIndices = [];
  if (activeStage === 'scanning_eyes') {
    activeIndices = [
      [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33],
      [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362]
    ];
  } else if (activeStage === 'scanning_eyebrows') {
    activeIndices = [
      [70, 63, 105, 66, 107, 55, 65, 52, 53, 46],
      [300, 293, 334, 296, 336, 285, 295, 282, 283, 276]
    ];
  } else if (activeStage === 'scanning_nose') {
    activeIndices = [
      [168, 6, 197, 195, 5, 4, 1, 19, 94, 2],
      [48, 115, 220, 45, 4, 275, 440, 344, 278]
    ];
  } else if (activeStage === 'scanning_mouth') {
    activeIndices = [
      [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61]
    ];
  } else if (activeStage === 'scanning_cheekbones') {
    activeIndices = [
      [425, 427, 329, 280],
      [205, 207, 101, 50]
    ];
  } else if (activeStage === 'scanning_jaw') {
    activeIndices = [
      [58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288]
    ];
  } else if (activeStage === 'scanning_forehead') {
    activeIndices = [
      [10, 338, 297, 332, 284, 251, 389, 162, 21, 54, 103, 67, 109, 10]
    ];
  }

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  activeIndices.forEach(path => {
    ctx.beginPath();
    path.forEach((idx, i) => {
      const pt = landmarks[idx];
      const cx = pt.x * overlayCanvas.width;
      const cy = pt.y * overlayCanvas.height;
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.fill();
  });
  ctx.restore();

  ctx.strokeStyle = "#B88A44";
  ctx.lineWidth = 2.2;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(184, 138, 68, 0.7)";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  activeIndices.forEach(path => {
    ctx.beginPath();
    path.forEach((idx, i) => {
      const pt = landmarks[idx];
      const cx = pt.x * overlayCanvas.width;
      const cy = pt.y * overlayCanvas.height;
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.stroke();
  });
  ctx.shadowBlur = 0;
  
  if (activeIndices.length > 0) {
    const mainPtIdx = activeIndices[0][0];
    const pt = landmarks[mainPtIdx];
    if (pt) {
      const cx = pt.x * overlayCanvas.width;
      const cy = pt.y * overlayCanvas.height;
      
      ctx.fillStyle = "#00E5FF";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "left";
      
      let telemetryLabel = "";
      if (activeStage === 'scanning_eyes') telemetryLabel = "EYE_RATIO_CALC: OK";
      else if (activeStage === 'scanning_eyebrows') telemetryLabel = "BROW_TILT_RAD: COMP";
      else if (activeStage === 'scanning_nose') telemetryLabel = "NASAL_PROPORTION: DETECT";
      else if (activeStage === 'scanning_mouth') telemetryLabel = "LIP_ELEVATION: MEASURE";
      else if (activeStage === 'scanning_cheekbones') telemetryLabel = "CHEEK_PROMINENCE: TRUE";
      else if (activeStage === 'scanning_jaw') telemetryLabel = "JAW_ANGLE_COMP: OK";
      else if (activeStage === 'scanning_forehead') telemetryLabel = "FOREHEAD_VOLUME: COMP";
      
      ctx.fillText(`▶ ${telemetryLabel}`, cx + 15, cy - 10);
      
      ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 12, cy - 12);
      ctx.lineTo(cx + 80, cy - 12);
      ctx.stroke();
    }
  }
}

/* ==========================================================================
   SCANNERS CONTROL
   ========================================================================== */
const STAGES = [
  { id: 'scanning_eyes', label: '눈(眼) 센서 분석', duration: 2000 },
  { id: 'scanning_eyebrows', label: '눈썹(眉) 기하도 계측', duration: 2000 },
  { id: 'scanning_nose', label: '코(鼻) 비례율 환산', duration: 2000 },
  { id: 'scanning_mouth', label: '입(口) 상승각 측정', duration: 2000 },
  { id: 'scanning_cheekbones', label: '광대(顴) 돌출도 감정', duration: 2000 },
  { id: 'scanning_jaw', label: '턱(頤) 골격선 비교', duration: 2000 },
  { id: 'scanning_forehead', label: '이마(額) 굴곡선 추출', duration: 2000 }
];

const SCAN_SUBMESSAGES = {
  scanning_eyes: ["눈꼬리 수평 축 편차 계산...", "안검 면적 대비 수치 환산...", "안형 매칭 벡터 정렬..."],
  scanning_eyebrows: ["미간 평면 너비 비율 대입...", "모발 분포 흐름 각도 분석...", "수평 정렬 조화도 확인..."],
  scanning_nose: ["비골 길이 지표 분석...", "콧망울 말단 너비 검출...", "비율 계수 데이터 매핑..."],
  scanning_mouth: ["입꼬리 꼬임 상승 곡률 측정...", "좌우 대칭도 계수 추출...", "입술 볼륨 분포 환산..."],
  scanning_cheekbones: ["광골 측면 대칭 스펙트럼 감정...", "중심 윤곽 대비 높이 비율...", "지탱 에너지 비율 계측..."],
  scanning_jaw: ["하단 골격 정렬 턱선 각도...", "하관 면적 상대 분포도 계산...", "안정 지수 데이터 합산..."],
  scanning_forehead: ["이마 수평 곡률 스캔...", "관자놀이 볼륨 비례 대입...", "전두골 입체 각도 산정..."]
};

async function processingLoop() {
  if (!faceLandmarker || currentStage === 'finished') return;

  const now = performance.now();
  let landmarks = null;

  if (webcam.readyState === webcam.HAVE_ENOUGH_DATA) {
    const results = faceLandmarker.detectForVideo(webcam, now);
    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      landmarks = results.faceLandmarks[0];
      
      const isAligned = checkFaceAlignment(landmarks);
      if (isAligned || !bestFaceCanvas) {
        if (!bestFaceCanvas) {
          bestFaceCanvas = document.createElement("canvas");
        }
        if (bestFaceCanvas.width !== webcam.videoWidth || bestFaceCanvas.height !== webcam.videoHeight) {
          bestFaceCanvas.width = webcam.videoWidth || 640;
          bestFaceCanvas.height = webcam.videoHeight || 480;
        }
        const bestCtx = bestFaceCanvas.getContext("2d");
        bestCtx.save();
        bestCtx.translate(bestFaceCanvas.width, 0);
        bestCtx.scale(-1, 1);
        bestCtx.drawImage(webcam, 0, 0, bestFaceCanvas.width, bestFaceCanvas.height);
        bestCtx.restore();
      }
    }
  }

  if (landmarks) {
    drawFaceMeshHUD(landmarks, currentStage);
  }

  if (currentStage === 'aligning') {
    if (landmarks) {
      const isAligned = checkFaceAlignment(landmarks);
      if (isAligned) {
        stableFaceCount++;
        faceGuideFrame.classList.add("aligned");
        
        if (stableFaceCount > 12) { // 0.4s
          currentStage = STAGES[0].id;
          stageStartTime = now;
          stableFaceCount = 0;
          faceGuideFrame.style.opacity = '0';
        }
      } else {
        stableFaceCount = 0;
        faceGuideFrame.classList.remove("aligned");
      }
    } else {
      stableFaceCount = 0;
      faceGuideFrame.classList.remove("aligned");
    }
  } else {
    const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);
    if (currentStageIndex !== -1) {
      const stageInfo = STAGES[currentStageIndex];
      const elapsed = now - stageStartTime;
      const progress = Math.min(100, (elapsed / stageInfo.duration) * 100);
      
      // Update HUD
      currentStepTitle.textContent = `${stageInfo.label} (${currentStageIndex + 1}/${STAGES.length})`;
      scannerProgress.style.width = `${progress}%`;
      if (hudProgressPercent) hudProgressPercent.textContent = `${Math.round(progress)}%`;
      
      const msgs = SCAN_SUBMESSAGES[currentStage];
      const msgIndex = Math.floor((elapsed / stageInfo.duration) * msgs.length);
      scanMessage.textContent = msgs[Math.min(msgs.length - 1, msgIndex)];
      
      if (landmarks) {
        lastDetectedFeatures = landmarks;
      }

      if (elapsed >= stageInfo.duration) {
        const nextIndex = currentStageIndex + 1;
        if (nextIndex < STAGES.length) {
          currentStage = STAGES[nextIndex].id;
          stageStartTime = now;
        } else {
          currentStage = 'snapshot';
          await performSnapshot();
        }
      }
    }
  }

  animationFrameId = requestAnimationFrame(processingLoop);
}

/* ==========================================================================
   SNAPSHOT REPORTING
   ========================================================================== */
async function performSnapshot() {
  console.log("[CAPTURING SNAPSHOT]");

  compilePhysiognomyReport();

  if (snapshotFrame) {
    const overlay = snapshotFrame.querySelector(".snapshot-overlay");
    snapshotFrame.innerHTML = "";
    if (overlay) snapshotFrame.appendChild(overlay);

    const displayCanvas = document.createElement("canvas");
    displayCanvas.width = webcam.videoWidth || 640;
    displayCanvas.height = webcam.videoHeight || 480;
    const displayCtx = displayCanvas.getContext("2d");

    if (bestFaceCanvas) {
      displayCtx.drawImage(bestFaceCanvas, 0, 0, displayCanvas.width, displayCanvas.height);
      console.log("[SNAPSHOT] Rendered using bestFaceCanvas cache");
    } else {
      displayCtx.save();
      displayCtx.translate(displayCanvas.width, 0);
      displayCtx.scale(-1, 1);
      displayCtx.drawImage(webcam, 0, 0, displayCanvas.width, displayCanvas.height);
      displayCtx.restore();
    }

    displayCanvas.style.width = "100%";
    displayCanvas.style.height = "100%";
    displayCanvas.style.objectFit = "cover";
    displayCanvas.style.display = "block";

    snapshotFrame.insertBefore(displayCanvas, overlay);
  }

  stopWebcam();

  shutterFlash.classList.add("flash-active");
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.13);
  } catch (e) {}

  setTimeout(() => {
    shutterFlash.classList.remove("flash-active");
    scannerScreen.classList.remove("active");
    resultScreen.classList.add("active");
    currentStage = 'finished';
  }, 500);
}

function compilePhysiognomyReport() {
  if (!lastDetectedFeatures) {
    alert("오류: 얼굴 특징점이 인식되지 않았습니다.");
    resetToWelcome();
    return;
  }

  const metrics = extractFaceMetrics(lastDetectedFeatures);
  const evaluation = evaluatePhysiognomy(metrics);
  const selections = evaluation.selections;
  const report = calculateFinalReport(selections, metrics);
  
  resultTitle.textContent = report.title;

  // Features tags list
  resultFeaturesList.innerHTML = "";
  Object.keys(selections).forEach(key => {
    const matchedItem = selections[key].item;
    if (matchedItem) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = matchedItem.name.split(" ")[0];
      resultFeaturesList.appendChild(tag);
    }
  });

  // Quantified indicators (Top & Weak traits rendered with progress bars)
  positiveEnergiesList.innerHTML = "";
  warningEnergiesList.innerHTML = "";
  
  const sortedTraits = Object.keys(report.ratings)
    .map(key => ({ key, val: report.ratings[key] }))
    .sort((a, b) => b.val - a.val);
    
  const renderMetricRow = (item, container) => {
    const li = document.createElement("li");
    const pct = Math.round(item.val * 20); // Scale 1-5 rating into 20-100%
    li.innerHTML = `
      <div class="metric-header">
        <span class="metric-name">${mapKeyToKorean(item.key)}</span>
        <span class="metric-val">${pct}%</span>
      </div>
      <div class="metric-progress-bar">
        <div class="metric-progress-bar-fill" style="width: ${pct}%"></div>
      </div>
    `;
    container.appendChild(li);
  };

  sortedTraits.slice(0, 4).forEach(item => renderMetricRow(item, positiveEnergiesList));
  sortedTraits.slice(-2).forEach(item => renderMetricRow(item, warningEnergiesList));

  // Determine lowest metric group to connect facial features, weak luck, and product recommendations
  const group1Score = (report.ratings.interpersonal + report.ratings.drive) / 2;
  const group2Score = (report.ratings.relationship + report.ratings.lateLife) / 2;
  const group3Score = (report.ratings.power + report.ratings.leadership) / 2;

  let chosenGroup = 1;
  let minScore = group1Score;
  
  if (group2Score < minScore) {
    minScore = group2Score;
    chosenGroup = 2;
  }
  if (group3Score < minScore) {
    minScore = group3Score;
    chosenGroup = 3;
  }

  let targetFeatureName = "";
  let targetFeatureState = "";
  let targetEnergyName = "";
  
  if (chosenGroup === 1) {
    targetFeatureName = "눈썹(眉)";
    targetFeatureState = selections.eyebrow.item.name.split(" ")[0]; 
    targetEnergyName = "대인 조화력 및 추진 지표";
  } else if (chosenGroup === 2) {
    targetFeatureName = "입(口)";
    targetFeatureState = selections.mouth.item.name.split(" ")[0]; 
    targetEnergyName = "대인 관계도 및 말년 안정성";
  } else {
    targetFeatureName = "광대(顴)";
    targetFeatureState = selections.cheekbones.item.name.split(" ")[0]; 
    targetEnergyName = "사회적 통솔력 및 권한 지표";
  }

  // Editorial Insight paragraph builder
  let review = "";
  const eyeName = selections.eye.item.name.split(" ")[0];
  const noseName = selections.nose.item.name.split(" ")[0];
  const topTrait = mapKeyToKorean(sortedTraits[0].key);
  const weakestTraitKey = sortedTraits[sortedTraits.length - 1].key;
  const weakestTraitName = mapKeyToKorean(weakestTraitKey);
  
  review += `안형 정밀 대조 상 '${eyeName}' 안형이 검출되며, 비골 대칭으로는 '${noseName}' 비형으로 정렬됨. `;
  review += `오관의 대칭 균형 중 '${topTrait}' 계수가 ${Math.round(sortedTraits[0].val * 20)}%로 가장 우수하여 전략적 판단과 조직 관리 속도가 빠른 경향이 우세함. `;
  review += `반면, 현재 ${targetFeatureName}의 골격선과 균형이 '${targetFeatureState}'형 분포에 치우쳐 있어, 이와 직접 연동된 '${weakestTraitName}' 수치가 ${Math.round(sortedTraits[sortedTraits.length - 1].val * 20)}% 수준으로 하락함. `;
  review += `이에 따라 전체적인 ${targetEnergyName} 부문에서 리스크 제어 및 조율 한계가 도출되는 경향을 보임.`;

  reviewText.textContent = review;

  // Gathering Dynamic Pros & Cons based on matched features
  const prosSet = new Set();
  const consSet = new Set();
  
  Object.keys(selections).forEach(key => {
    const item = selections[key].item;
    if (item) {
      if (item.pros) item.pros.forEach(p => prosSet.add(p));
      if (item.cons) item.cons.forEach(c => consSet.add(c));
    }
  });

  if (resultProsList && resultConsList) {
    resultProsList.innerHTML = "";
    resultConsList.innerHTML = "";
    
    // Pick top 3 pros and top 3 cons to avoid crowding the layout
    Array.from(prosSet).slice(0, 3).forEach(pro => {
      const li = document.createElement("li");
      li.textContent = pro;
      resultProsList.appendChild(li);
    });
    
    Array.from(consSet).slice(0, 3).forEach(con => {
      const li = document.createElement("li");
      li.textContent = con;
      resultConsList.appendChild(li);
    });
  }

  // Technical metrics list - Displays "눈은 무슨 눈, 코는 무슨 코" explicitly for all 7 features
  metricRationaleList.innerHTML = "";
  const rationales = [
    `• 눈(眼): ${selections.eye.item.name} [일치율 ${selections.eye.score}%] - 가로-세로 비율(${metrics.eye.ratio.toFixed(1)}), 눈꼬리 편차(${metrics.eye.tilt.toFixed(1)}°) 계측`,
    `• 눈썹(眉): ${selections.eyebrow.item.name} [일치율 ${selections.eyebrow.score}%] - 정렬 경사(${metrics.eyebrow.tilt.toFixed(1)}°) 및 너비 비율(${metrics.eyebrow.length.toFixed(2)}) 산출`,
    `• 코(鼻): ${selections.nose.item.name} [일치율 ${selections.nose.score}%] - 비골 길이(${metrics.nose.lengthRatio.toFixed(2)}), 콧망울 분포도(${metrics.nose.widthRatio.toFixed(2)}) 필터 매핑`,
    `• 입(口): ${selections.mouth.item.name} [일치율 ${selections.mouth.score}%] - 입꼬리 상승 곡률(${metrics.mouth.tilt.toFixed(3)}) 및 종횡비(${metrics.mouth.ratio.toFixed(1)}) 비교`,
    `• 광대(顴): ${selections.cheekbones.item.name} [일치율 ${selections.cheekbones.score}%] - 광골 융기 계수(${metrics.cheekbones.prominence.toFixed(2)}) 대칭도 검출`,
    `• 턱(頤): ${selections.jaw.item.name} [일치율 ${selections.jaw.score}%] - 하단 턱뼈 각도(${metrics.jaw.angle.toFixed(1)}°) 및 하관 면적 대비(${metrics.jaw.widthRatio.toFixed(2)})`,
    `• 이마(額): ${selections.forehead.item.name} [일치율 ${selections.forehead.score}%] - 전두골 영역 높이 비율(${metrics.forehead.heightRatio.toFixed(2)}) 매칭 완료`
  ];

  rationales.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    metricRationaleList.appendChild(li);
  });

  // Wellness Solutions Showcases matching (Linked with the lowest group)
  if (chosenGroup === 1) {
    recoTitle.textContent = `${targetFeatureName} 보정을 통한 ${targetEnergyName} 보완`;
    recoExplanation.innerHTML = `얼굴 분석 결과 ${targetFeatureName}이(가) '${targetFeatureState}'의 상태를 보이고 있어, 이로 인해 상대적으로 약화된 <strong>추진 에너지 및 대인 신뢰도</strong> 지표를 높이기 위한 집중 보완 솔루션입니다. 눈썹의 균형을 고르게 조율하는 데 기여하는 제품군입니다.`;
    recoImage.src = "assets/image1.png";
    btnViewProduct.href = "https://www.hermes.com/kr/ko/product/아이브로우-펜셜-H083072V010/";
    btnBuyProduct.href = "https://www.hermes.com/kr/ko/category/뷰티/눈/";
  } else if (chosenGroup === 2) {
    recoTitle.textContent = `${targetFeatureName} 보정을 통한 ${targetEnergyName} 보완`;
    recoExplanation.innerHTML = `얼굴 분석 결과 ${targetFeatureName}의 정렬이 '${targetFeatureState}'형태를 띠고 있어, 이로 인해 연동 하락한 <strong>대인 조화 및 말년 지수</strong>를 조화롭게 가동하기 위한 솔루션입니다. 입매 주변 근육의 비대칭 긴장을 해소하고 정돈을 유도합니다.`;
    recoImage.src = "assets/image2.png";
    btnViewProduct.href = "https://www.rolex.com/ko/watches/find-rolex";
    btnBuyProduct.href = "https://www.rolex.com/ko/watches/find-rolex/classic-watches";
  } else {
    recoTitle.textContent = `${targetFeatureName} 보정을 통한 ${targetEnergyName} 보완`;
    recoExplanation.innerHTML = `얼굴 분석 결과 ${targetFeatureName}의 융기 균형이 '${targetFeatureState}'의 상태를 지니고 있어, 이로 인해 결여된 <strong>조직 통솔력 및 권한 지수</strong>를 상승시키기 위한 솔루션입니다. 광대 및 페이셜 윤곽 대칭 라인을 설계해 줍니다.`;
    recoImage.src = "assets/image3.png";
    btnViewProduct.href = "https://www.hermes.com/kr/ko/product/페이스-마사저-H083110V000/";
    btnBuyProduct.href = "https://www.hermes.com/kr/ko/category/뷰티/페이스/";
  }
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function resetToWelcome() {
  stopWebcam();
  resultScreen.classList.remove("active");
  scannerScreen.classList.remove("active");
  welcomeScreen.classList.add("active");
  
  currentStepTitle.textContent = "대기 중";
  scannerProgress.style.width = "0%";
  if (hudProgressPercent) hudProgressPercent.textContent = "0%";
  scanMessage.textContent = "분석 모형 전개 단계 대기";
  faceGuideFrame.style.opacity = '1';
  faceGuideFrame.classList.remove("aligned");
  
  if (cameraErrorOverlay) cameraErrorOverlay.classList.remove("active");
  
  currentStage = 'idle';
  bestFaceCanvas = null;
}

async function handleStart() {
  console.log("[START BUTTON CLICKED]");
  
  if (cameraErrorOverlay) cameraErrorOverlay.classList.remove("active");
  
  welcomeScreen.classList.remove("active");
  scannerScreen.classList.add("active");
  
  showLoader("관상가의 혜안을 여는 중", "시스템 카메라 연결 권한 요청 중...");
  
  const ok = await startWebcam();
  if (!ok) {
    hideLoader();
    if (cameraErrorOverlay) cameraErrorOverlay.classList.add("active");
    return;
  }
  
  try {
    updateLoaderMessage("분석 엔진 구동 중", "AI 관상 판정 모델의 랜드마크 엔진을 전개하고 있습니다...");
    await initializeModel();
  } catch (error) {
    hideLoader();
    alert("모델 초기화에 실패하였습니다.");
    resetToWelcome();
    return;
  }
  
  hideLoader();

  currentStage = 'aligning';
  stableFaceCount = 0;
  currentStepTitle.textContent = "가이드 정렬 확인 중";
  scanMessage.textContent = "원형 안내선 내부에 얼굴을 맞춰 주십시오.";
  animationFrameId = requestAnimationFrame(processingLoop);
}

/* ==========================================================================
   PREMIUM ROYAL DECREE CANVAS EXPORTER (Classic scroll parchment styling)
   ========================================================================== */
async function downloadReportCard() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 960;
  const c = canvas.getContext("2d");

  // Parchment cream background
  c.fillStyle = "#F5EFE2";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Background lattice effect
  c.strokeStyle = "rgba(184, 138, 68, 0.04)";
  c.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 32) {
    c.beginPath(); c.moveTo(x, 0); c.lineTo(x, canvas.height); c.stroke();
  }
  for (let y = 0; y < canvas.height; y += 32) {
    c.beginPath(); c.moveTo(0, y); c.lineTo(canvas.width, y); c.stroke();
  }

  // Royal Golden Border
  c.strokeStyle = "#B88A44";
  c.lineWidth = 1.5;
  c.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
  c.lineWidth = 3.0;
  c.strokeRect(22, 22, canvas.width - 44, canvas.height - 44);

  // Top header
  c.fillStyle = "#1A150E";
  c.textAlign = "center";
  c.font = "bold 20px 'Cinzel', serif";
  c.fillText("👑 내가 왕이 될 상인가", canvas.width / 2, 70);
  
  c.fillStyle = "#B88A44";
  c.font = "bold 13px 'Noto Serif KR', serif";
  c.fillText("王 室 觀 相 鑑定 書", canvas.width / 2, 95);

  // Divider
  c.strokeStyle = "rgba(184, 138, 68, 0.4)";
  c.lineWidth = 1.2;
  c.beginPath(); c.moveTo(60, 115); c.lineTo(canvas.width - 60, 115); c.stroke();

  // Face snapshot
  const imgW = 120;
  const imgH = 150;
  const imgX = (canvas.width - imgW) / 2;
  const imgY = 135;

  c.fillStyle = "#EFE7D8";
  c.fillRect(imgX - 6, imgY - 6, imgW + 12, imgH + 12);
  c.strokeStyle = "#B88A44";
  c.lineWidth = 1.5;
  c.strokeRect(imgX - 6, imgY - 6, imgW + 12, imgH + 12);

  const displayCanvas = document.getElementById("snapshot-frame")?.querySelector("canvas");
  if (displayCanvas) {
    c.save();
    c.drawImage(displayCanvas, imgX, imgY, imgW, imgH);
    c.restore();
  }

  // Result title (Royal Style)
  c.fillStyle = "#1A150E";
  c.font = "bold 25px 'Noto Serif KR', serif";
  c.fillText(resultTitle.textContent, canvas.width / 2, 330);

  // Sub features
  c.font = "600 11px 'Noto Serif KR', serif";
  c.fillStyle = "#5A5040";
  const tags = Array.from(resultFeaturesList.children).map(tag => tag.textContent);
  c.fillText(tags.join("  •  "), canvas.width / 2, 360);

  // Single divider
  c.strokeStyle = "rgba(184, 138, 68, 0.25)";
  c.beginPath(); c.moveTo(80, 380); c.lineTo(canvas.width - 80, 380); c.stroke();

  // Draw 2 Columns for Pros & Cons on Canvas
  c.font = "bold 12px 'Noto Serif KR', serif";
  c.fillStyle = "#B88A44";
  c.textAlign = "left";
  c.fillText("성향적 장점 (長處)", 80, 415);
  
  c.fillStyle = "#C85A5A";
  c.fillText("조율이 이로운 점 (愼重)", canvas.width / 2 + 20, 415);

  c.font = "400 10.5px 'Noto Serif KR', serif";
  c.fillStyle = "#332A1C";

  const drawListOnCanvas = (listEl, startX, startY) => {
    const listItems = Array.from(listEl.children).map(li => li.textContent);
    listItems.forEach((text, idx) => {
      const lineY = startY + (idx * 22);
      c.fillText(`• ${text}`, startX, lineY);
    });
  };

  drawListOnCanvas(resultProsList, 80, 445);
  drawListOnCanvas(resultConsList, canvas.width / 2 + 20, 445);

  // Single divider
  c.strokeStyle = "rgba(184, 138, 68, 0.25)";
  c.beginPath(); c.moveTo(80, 545); c.lineTo(canvas.width - 80, 545); c.stroke();

  // Metrics Columns (Gauges)
  c.font = "bold 12px 'Noto Serif KR', serif";
  c.fillStyle = "#B88A44";
  c.textAlign = "left";
  c.fillText("우수 지표 수치", 80, 580);
  c.fillStyle = "#8E6D38";
  c.fillText("보완 필요 지표", canvas.width - 240, 580);

  const drawCanvasMetrics = (list, startX, startY) => {
    c.font = "400 10px monospace";
    list.forEach((el, idx) => {
      const name = el.querySelector(".metric-name").textContent;
      const pctStr = el.querySelector(".metric-val").textContent;
      const valNum = parseInt(pctStr);
      
      const lineY = startY + (idx * 26);
      c.fillStyle = "#1A150E";
      c.textAlign = "left";
      c.fillText(name, startX, lineY);
      
      c.fillStyle = "#B88A44";
      c.textAlign = "right";
      c.fillText(pctStr, startX + 160, lineY);
      
      c.fillStyle = "#EFE7D8";
      c.fillRect(startX, lineY + 5, 160, 3);
      c.fillStyle = "#B88A44";
      c.fillRect(startX, lineY + 5, 160 * (valNum / 100), 3);
    });
  };

  const posList = Array.from(positiveEnergiesList.children);
  drawCanvasMetrics(posList, 80, 610);

  const warnList = Array.from(warningEnergiesList.children);
  drawCanvasMetrics(warnList, canvas.width - 240, 610);

  // Single divider
  c.strokeStyle = "rgba(184, 138, 68, 0.25)";
  c.beginPath(); c.moveTo(80, 725); c.lineTo(canvas.width - 80, 725); c.stroke();

  // Master review section
  c.textAlign = "center";
  c.fillStyle = "#B88A44";
  c.font = "bold 12px 'Noto Serif KR', serif";
  c.fillText("관 상 가 총 평 (鑑定評)", canvas.width / 2, 755);

  c.fillStyle = "#332A1C";
  c.font = "400 11px 'Noto Serif KR', serif";
  
  const review = reviewText.textContent;
  const charsPerLine = 34;
  const lines = [];
  for (let i = 0; i < review.length; i += charsPerLine) {
    lines.push(review.substring(i, i + charsPerLine));
  }
  
  lines.slice(0, 5).forEach((line, idx) => {
    c.fillText(line, canvas.width / 2, 785 + (idx * 20));
  });

  // Stamp and Signatures
  c.textAlign = "right";
  c.font = "italic 10px 'Noto Serif KR', serif";
  c.fillStyle = "#B88A44";
  c.fillText("왕실 관상 감정관 백", canvas.width - 100, 895);

  // Royal seal stamp
  const stampX = 80;
  const stampY = 855;
  c.strokeStyle = "rgba(184, 138, 68, 0.5)";
  c.lineWidth = 1.5;
  c.strokeRect(stampX, stampY, 44, 44);
  c.fillStyle = "rgba(184, 138, 68, 0.7)";
  c.font = "bold 9px 'Noto Serif KR', serif";
  c.textAlign = "center";
  c.fillText("鑑定印", stampX + 22, stampY + 26);

  // Footer notes
  c.fillStyle = "#8E6D38";
  c.font = "8.5px 'Noto Serif KR', serif";
  c.fillText("© 2026 AI 왕실 관상 감정원. 학술 및 전통 오락 전용 리포트.", canvas.width / 2, 930);

  // Exporter trigger
  const link = document.createElement("a");
  link.download = `왕이될상인가_관상감정서_${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
