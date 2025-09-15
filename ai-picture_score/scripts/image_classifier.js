const ort = require('onnxruntime-node');
const fs = require('fs');
const sharp = require('sharp');

class ImageClassifier {
  constructor() {
    // 固定模型路径
    this.modelPath = './models/mobilenetv2-10_fp16.onnx';
    this.model = null;

    // ImageNet 1000类完整标签
    this.labels = [
      'tench', 'goldfish', 'great_white_shark', 'tiger_shark', 'hammerhead',
      'electric_ray', 'stingray', 'cock', 'hen', 'ostrich',
      'brambling', 'goldfinch', 'house_finch', 'junco', 'indigo_bunting',
      'robin', 'bulbul', 'jay', 'magpie', 'chickadee',
      'water_ouzel', 'kite', 'bald_eagle', 'vulture', 'great_grey_owl',
      'European_fire_salamander', 'common_newt', 'eft', 'spotted_salamander', 'axolotl',
      'bullfrog', 'tree_frog', 'tailed_frog', 'loggerhead', 'leatherback_turtle',
      'mud_turtle', 'terrapin', 'box_turtle', 'banded_gecko', 'common_iguana',
      'American_chameleon', 'whiptail', 'agama', 'frilled_lizard', 'alligator_lizard',
      'Gila_monster', 'green_lizard', 'African_chameleon', 'Komodo_dragon', 'African_crocodile',
      'American_alligator', 'triceratops', 'thunder_snake', 'ringneck_snake', 'hognose_snake',
      'green_snake', 'king_snake', 'garter_snake', 'water_snake', 'vine_snake',
      'night_snake', 'boa_constrictor', 'rock_python', 'Indian_cobra', 'green_mamba',
      'sea_snake', 'horned_viper', 'diamondback', 'sidewinder', 'trilobite',
      'harvestman', 'scorpion', 'black_and_gold_garden_spider', 'barn_spider', 'garden_spider',
      'black_widow', 'tarantula', 'wolf_spider', 'tick', 'centipede',
      'black_grouse', 'ptarmigan', 'ruffed_grouse', 'prairie_chicken', 'peacock',
      'quail', 'partridge', 'African_grey', 'macaw', 'sulphur-crested_cockatoo',
      'lorikeet', 'coucal', 'bee_eater', 'hornbill', 'hummingbird',
      'jacamar', 'toucan', 'drake', 'red-breasted_merganser', 'goose',
      'black_swan', 'tusker', 'echidna', 'platypus', 'wallaby',
      'koala', 'wombat', 'jellyfish', 'sea_anemone', 'brain_coral',
      'flatworm', 'nematode', 'conch', 'snail', 'slug',
      'sea_slug', 'chiton', 'chambered_nautilus', 'Dungeness_crab', 'rock_crab',
      'fiddler_crab', 'king_crab', 'American_lobster', 'spiny_lobster', 'crayfish',
      'hermit_crab', 'isopod', 'white_stork', 'black_stork', 'spoonbill',
      'flamingo', 'little_blue_heron', 'American_egret', 'bittern', 'crane',
      'limpkin', 'European_gallinule', 'American_coot', 'bustard', 'ruddy_turnstone',
      'red-backed_sandpiper', 'redshank', 'dowitcher', 'oystercatcher', 'pelican',
      'king_penguin', 'albatross', 'grey_whale', 'killer_whale', 'dugong',
      'sea_lion', 'Chihuahua', 'Japanese_spaniel', 'Maltese_dog', 'Pekinese',
      'Shih-Tzu', 'Blenheim_spaniel', 'papillon', 'toy_terrier', 'Rhodesian_ridgeback',
      'Afghan_hound', 'basset', 'beagle', 'bloodhound', 'bluetick',
      'black-and-tan_coonhound', 'Walker_hound', 'English_foxhound', 'redbone', 'borzoi',
      'Irish_wolfhound', 'Italian_greyhound', 'whippet', 'Ibizan_hound', 'Norwegian_elkhound',
      'otterhound', 'Saluki', 'Scottish_deerhound', 'Weimaraner', 'Staffordshire_bullterrier',
      'American_Staffordshire_terrier', 'Bedlington_terrier', 'Border_terrier', 'Kerry_blue_terrier', 'Irish_terrier',
      'Norfolk_terrier', 'Norwich_terrier', 'Yorkshire_terrier', 'wire-haired_fox_terrier', 'Lakeland_terrier',
      'Sealyham_terrier', 'Airedale', 'cairn', 'Australian_terrier', 'Dandie_Dinmont',
      'Boston_bull', 'miniature_schnauzer', 'giant_schnauzer', 'standard_schnauzer', 'Scotch_terrier',
      'Tibetan_terrier', 'silky_terrier', 'soft-coated_wheaten_terrier', 'West_Highland_white_terrier', 'Lhasa',
      'flat-coated_retriever', 'curly-coated_retriever', 'golden_retriever', 'Labrador_retriever', 'Chesapeake_Bay_retriever',
      'German_short-haired_pointer', 'vizsla', 'English_setter', 'Irish_setter', 'Gordon_setter',
      'Brittany_spaniel', 'clumber', 'English_springer', 'Welsh_springer_spaniel', 'cocker_spaniel',
      'Sussex_spaniel', 'Irish_water_spaniel', 'kuvasz', 'schipperke', 'groenendael',
      'malinois', 'briard', 'kelpie', 'komondor', 'Old_English_sheepdog',
      'Shetland_sheepdog', 'collie', 'Border_collie', 'Bouvier_des_Flandres', 'Rottweiler',
      'German_shepherd', 'Doberman', 'miniature_pinscher', 'Greater_Swiss_Mountain_dog', 'Bernese_mountain_dog',
      'Appenzeller', 'EntleBucher', 'boxer', 'bull_mastiff', 'Tibetan_mastiff',
      'French_bulldog', 'Great_Dane', 'Saint_Bernard', 'Eskimo_dog', 'malamute',
      'Siberian_husky', 'dalmatian', 'affenpinscher', 'basenji', 'pug',
      'Leonberg', 'Newfoundland', 'Great_Pyrenees', 'Samoyed', 'Pomeranian',
      'chow', 'keeshond', 'Brabancon_griffon', 'Pembroke', 'Cardigan',
      'toy_poodle', 'miniature_poodle', 'standard_poodle', 'Mexican_hairless', 'timber_wolf',
      'white_wolf', 'red_wolf', 'coyote', 'dingo', 'dhole',
      'African_hunting_dog', 'hyena', 'red_fox', 'kit_fox', 'Arctic_fox',
      'grey_fox', 'tabby', 'tiger_cat', 'Persian_cat', 'Siamese_cat',
      'Egyptian_cat', 'cougar', 'lynx', 'leopard', 'snow_leopard',
      'jaguar', 'lion', 'tiger', 'cheetah', 'brown_bear',
      'American_black_bear', 'ice_bear', 'sloth_bear', 'mongoose', 'meerkat',
      'tiger_beetle', 'ladybug', 'ground_beetle', 'long-horned_beetle', 'leaf_beetle',
      'dung_beetle', 'rhinoceros_beetle', 'weevil', 'fly', 'bee',
      'ant', 'grasshopper', 'cricket', 'walking_stick', 'cockroach',
      'mantis', 'cicada', 'leafhopper', 'lacewing', 'dragonfly',
      'damselfly', 'admiral', 'ringlet', 'monarch', 'cabbage_butterfly',
      'sulphur_butterfly', 'lycaenid', 'starfish', 'sea_urchin', 'sea_cucumber',
      'wood_rabbit', 'hare', 'Angora', 'hamster', 'porcupine',
      'fox_squirrel', 'marmot', 'beaver', 'guinea_pig', 'sorrel',
      'zebra', 'hog', 'wild_boar', 'warthog', 'hippopotamus',
      'ox', 'water_buffalo', 'bison', 'ram', 'bighorn',
      'ibex', 'hartebeest', 'impala', 'gazelle', 'Arabian_camel',
      'llama', 'weasel', 'mink', 'polecat', 'black-footed_ferret',
      'otter', 'skunk', 'badger', 'armadillo', 'three-toed_sloth',
      'orangutan', 'gorilla', 'chimpanzee', 'gibbon', 'siamang',
      'guenon', 'patas', 'baboon', 'macaque', 'langur',
      'colobus', 'proboscis_monkey', 'marmoset', 'capuchin', 'howler_monkey',
      'titi', 'spider_monkey', 'squirrel_monkey', 'Madagascar_cat', 'indri',
      'Indian_elephant', 'African_elephant', 'lesser_panda', 'giant_panda', 'barracouta',
      'eel', 'coho', 'rock_beauty', 'anemone_fish', 'sturgeon',
      'gar', 'lionfish', 'puffer', 'abacus', 'abaya',
      'academic_gown', 'accordion', 'acoustic_guitar', 'aircraft_carrier', 'airliner',
      'airship', 'altar', 'ambulance', 'amphibian', 'analog_clock',
      'apiary', 'apron', 'ashcan', 'assault_rifle', 'backpack',
      'bakery', 'balance_beam', 'balloon', 'ballpoint', 'Band_Aid',
      'banjo', 'bannister', 'barbell', 'barber_chair', 'barbershop',
      'barn', 'barometer', 'barrel', 'barrow', 'baseball',
      'basketball', 'bassinet', 'bassoon', 'bathing_cap', 'bath_towel',
      'bathtub', 'beach_wagon', 'beacon', 'beaker', 'bearskin',
      'beer_bottle', 'beer_glass', 'bell_cote', 'bib', 'bicycle-built-for-two',
      'bikini', 'binder', 'binoculars', 'birdhouse', 'boathouse',
      'bobsled', 'bolo_tie', 'bonnet', 'bookcase', 'bookshop',
      'bottlecap', 'bow', 'bow_tie', 'brass', 'brassiere',
      'breakwater', 'breastplate', 'broom', 'bucket', 'buckle',
      'bulletproof_vest', 'bullet_train', 'butcher_shop', 'cab', 'caldron',
      'candle', 'cannon', 'canoe', 'can_opener', 'cardigan',
      'car_mirror', 'carousel', 'carpenter\'s_kit', 'carton', 'car_wheel',
      'cash_machine', 'cassette', 'cassette_player', 'castle', 'catamaran',
      'CD_player', 'cello', 'cellular_telephone', 'chain', 'chainlink_fence',
      'chain_mail', 'chain_saw', 'chest', 'chiffonier', 'chime',
      'china_cabinet', 'Christmas_stocking', 'church', 'cinema', 'cleaver',
      'cliff_dwelling', 'cloak', 'clog', 'cocktail_shaker', 'coffee_mug',
      'coffeepot', 'coil', 'combination_lock', 'computer_keyboard', 'confectionery',
      'container_ship', 'convertible', 'corkscrew', 'cornet', 'cowboy_boot',
      'cowboy_hat', 'cradle', 'crane', 'crash_helmet', 'crate',
      'crib', 'Crock_Pot', 'croquet_ball', 'crutch', 'cuirass',
      'dam', 'desk', 'desktop_computer', 'dial_telephone', 'diaper',
      'digital_clock', 'digital_watch', 'dining_table', 'dishrag', 'dishwasher',
      'disk_brake', 'dock', 'dogsled', 'dome', 'doormat',
      'drilling_platform', 'drum', 'drumstick', 'dumbbell', 'Dutch_oven',
      'electric_fan', 'electric_guitar', 'electric_locomotive', 'entertainment_center', 'envelope',
      'espresso_maker', 'face_powder', 'feather_boa', 'file', 'fireboat',
      'fire_engine', 'fire_screen', 'flagpole', 'flute', 'folding_chair',
      'football_helmet', 'forklift', 'fountain', 'fountain_pen', 'four-poster',
      'freight_car', 'French_horn', 'frying_pan', 'fur_coat', 'garbage_truck',
      'gasmask', 'gas_pump', 'goblet', 'go-kart', 'golf_ball',
      'golfcart', 'gondola', 'gong', 'gown', 'grand_piano',
      'greenhouse', 'grille', 'grocery_store', 'guillotine', 'hair_slide',
      'hair_spray', 'half_track', 'hammer', 'hamper', 'hand_blower',
      'hand-held_computer', 'handkerchief', 'hard_disc', 'harmonica', 'harp',
      'harvester', 'hatchet', 'holster', 'home_theater', 'honeycomb',
      'hook', 'hoopskirt', 'horizontal_bar', 'horse_cart', 'hourglass',
      'iPod', 'iron', 'jack-o\'-lantern', 'jean', 'jeep',
      'jersey', 'jigsaw_puzzle', 'jinrikisha', 'joystick', 'kimono',
      'knee_pad', 'knot', 'lab_coat', 'ladle', 'lampshade',
      'laptop', 'lawn_mower', 'lens_cap', 'letter_opener', 'library',
      'lifeboat', 'lighter', 'limousine', 'liner', 'lipstick',
      'Loafer', 'lotion', 'loudspeaker', 'loupe', 'lumbermill',
      'magnetic_compass', 'mailbag', 'mailbox', 'maillot', 'maillot',
      'manhole_cover', 'maraca', 'marimba', 'mask', 'matchstick',
      'maypole', 'maze', 'measuring_cup', 'medicine_chest', 'megalith',
      'microphone', 'microwave', 'military_uniform', 'milk_can', 'minibus',
      'miniskirt', 'minivan', 'missile', 'mitten', 'mixing_bowl',
      'mobile_home', 'Model_T', 'modem', 'monastery', 'monitor',
      'moped', 'mortar', 'mortarboard', 'mosque', 'mosquito_net',
      'motor_scooter', 'mountain_bike', 'mountain_tent', 'mouse', 'mousetrap',
      'moving_van', 'muzzle', 'nail', 'neck_brace', 'necklace',
      'nipple', 'notebook', 'obelisk', 'oboe', 'ocarina',
      'odometer', 'oil_filter', 'organ', 'oscilloscope', 'overskirt',
      'oxcart', 'oxygen_mask', 'packet', 'paddle', 'paddlewheel',
      'padlock', 'paintbrush', 'pajama', 'palace', 'panpipe',
      'paper_towel', 'parachute', 'parallel_bars', 'park_bench', 'parking_meter',
      'passenger_car', 'patio', 'pay-phone', 'pedestal', 'pencil_box',
      'pencil_sharpener', 'perfume', 'Petri_dish', 'photocopier', 'pick',
      'pickelhaube', 'picket_fence', 'pickup', 'pier', 'piggy_bank',
      'pill_bottle', 'pillow', 'ping-pong_ball', 'pinwheel', 'pirate',
      'pitcher', 'plane', 'planetarium', 'plastic_bag', 'plate_rack',
      'plow', 'plunger', 'Polaroid_camera', 'pole', 'police_van',
      'poncho', 'pool_table', 'pop_bottle', 'pot', 'potter\'s_wheel',
      'power_drill', 'prayer_rug', 'printer', 'prison', 'projectile',
      'projector', 'puck', 'punching_bag', 'purse', 'quill',
      'quilt', 'racer', 'racket', 'radiator', 'radio',
      'radio_telescope', 'rain_barrel', 'recreational_vehicle', 'reel', 'reflex_camera',
      'refrigerator', 'remote_control', 'restaurant', 'revolver', 'rifle',
      'rocking_chair', 'rotisserie', 'rubber_eraser', 'rugby_ball', 'rule',
      'running_shoe', 'safe', 'safety_pin', 'saltshaker', 'sandal',
      'sarong', 'sax', 'scabbard', 'scale', 'school_bus',
      'schooner', 'scoreboard', 'screen', 'screw', 'screwdriver',
      'seat_belt', 'sewing_machine', 'shield', 'shoe_shop', 'shoji',
      'shopping_basket', 'shopping_cart', 'shovel', 'shower_cap', 'shower_curtain',
      'ski', 'ski_mask', 'sleeping_bag', 'slide_rule', 'sliding_door',
      'slot', 'snorkel', 'snowmobile', 'snowplow', 'soap_dispenser',
      'soccer_ball', 'sock', 'solar_dish', 'sombrero', 'soup_bowl',
      'space_bar', 'space_heater', 'space_shuttle', 'spatula', 'speedboat',
      'spider_web', 'spindle', 'sports_car', 'spotlight', 'stage',
      'steam_locomotive', 'steel_arch_bridge', 'steel_drum', 'stethoscope', 'stole',
      'stone_wall', 'stopwatch', 'stove', 'strainer', 'streetcar',
      'stretcher', 'studio_couch', 'stupa', 'submarine', 'suit',
      'sundial', 'sunglass', 'sunglasses', 'sunscreen', 'suspension_bridge',
      'swab', 'sweatshirt', 'swimming_trunks', 'swing', 'switch',
      'syringe', 'table_lamp', 'tank', 'tape_player', 'teapot',
      'teddy', 'television', 'tennis_ball', 'thatch', 'theater_curtain',
      'thimble', 'thresher', 'throne', 'tile_roof', 'toaster',
      'tobacco_shop', 'toilet_seat', 'torch', 'totem_pole', 'tow_truck',
      'toyshop', 'tractor', 'trailer_truck', 'tray', 'trench_coat',
      'tricycle', 'trimaran', 'tripod', 'triumphal_arch', 'trolleybus',
      'trombone', 'tub', 'turnstile', 'typewriter_keyboard', 'umbrella',
      'unicycle', 'upright', 'vacuum', 'vase', 'vault',
      'velvet', 'vending_machine', 'vestment', 'viaduct', 'violin',
      'volleyball', 'waffle_iron', 'wall_clock', 'wallet', 'wardrobe',
      'warplane', 'washbasin', 'washer', 'water_bottle', 'water_jug',
      'water_tower', 'whiskey_jug', 'whistle', 'wig', 'window_screen',
      'window_shade', 'Windsor_tie', 'wine_bottle', 'wing', 'wok',
      'wooden_spoon', 'wool', 'worm_fence', 'wreck', 'yawl',
      'yurt', 'web_site', 'comic_book', 'crossword_puzzle', 'street_sign',
      'traffic_light', 'book_jacket', 'menu', 'plate', 'guacamole',
      'consomme', 'hot_pot', 'trifle', 'ice_cream', 'ice_lolly',
      'French_loaf', 'bagel', 'pretzel', 'cheeseburger', 'hotdog',
      'mashed_potato', 'head_cabbage', 'broccoli', 'cauliflower', 'zucchini',
      'spaghetti_squash', 'acorn_squash', 'butternut_squash', 'cucumber', 'artichoke',
      'bell_pepper', 'cardoon', 'mushroom', 'Granny_Smith', 'strawberry',
      'orange', 'lemon', 'fig', 'pineapple', 'banana',
      'jackfruit', 'custard_apple', 'pomegranate', 'hay', 'carbonara',
      'chocolate_sauce', 'dough', 'meat_loaf', 'pizza', 'potpie',
      'burrito', 'red_wine', 'espresso', 'cup', 'eggnog',
      'alp', 'bubble', 'cliff', 'coral_reef', 'geyser',
      'lakeside', 'promontory', 'sandbar', 'seashore', 'valley',
      'volcano', 'ballplayer', 'groom', 'scuba_diver', 'rapeseed',
      'daisy', 'yellow_lady\'s_slipper', 'corn', 'acorn', 'hip',
      'buckeye', 'coral_fungus', 'agaric', 'gyromitra', 'stinkhorn',
      'earthstar', 'hen-of-the-woods', 'bolete', 'ear', 'toilet_tissue'
    ];
  }

  async loadModel() {
    if (!this.model) {
      console.log('正在加载模型...');
      this.model = await ort.InferenceSession.create(this.modelPath);
      console.log('模型加载成功');
    }
  }

  _float16ToFloat32(binary) {
    if (binary === 0) return 0;

    const sign = (binary & 0x8000) !== 0 ? -1 : 1;
    let exponent = (binary & 0x7c00) >> 10;
    const fraction = binary & 0x03ff;

    if (exponent === 0) {
      return sign * Math.pow(2, -14) * (fraction / 0x400);
    } else if (exponent === 31) {
      return fraction ? NaN : sign * Infinity;
    }

    exponent = exponent - 15;
    return sign * Math.pow(2, exponent) * (1 + fraction / 0x400);
  }

  _float32ToFloat16(float32) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, float32);

    const bits = view.getUint32(0);
    const sign = (bits >> 31) & 0x1;
    let exponent = (bits >> 23) & 0xff;
    let fraction = bits & 0x7fffff;

    // 调整指数
    exponent = exponent - 127 + 15;

    // 处理特殊情况
    if (exponent <= 0) {
      // 下溢出，转为0
      return (sign << 15) | 0;
    } else if (exponent > 31) {
      // 上溢出，转为无穷大
      return (sign << 15) | 0x7c00;
    }

    // 正常情况
    exponent = exponent << 10;
    fraction = fraction >> 13;

    return (sign << 15) | exponent | fraction;
  }

  async preprocessImage(imagePath, inputShape) {
    try {
      // 使用 sharp 读取和处理图像
      const image = sharp(imagePath);

      // 根据模型要求调整图像大小
      const shape = Array.from(inputShape);
      const [batchSize, channels, height, width] = shape;
      const resizedImage = await image
        .resize(width, height)
        .removeAlpha()
        .raw()
        .toBuffer();

      // 将图像数据转换为float32数组并归一化
      const float32Data = new Float32Array(width * height * channels);
      for (let i = 0; i < resizedImage.length; i++) {
        float32Data[i] = resizedImage[i] / 255.0;
      }

      // 重塑为模型所需的格式 [batch, channels, height, width]
      const reshapedData = new Float32Array(batchSize * channels * height * width);
      let index = 0;
      for (let b = 0; b < batchSize; b++) {
        for (let c = 0; c < channels; c++) {
          for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
              reshapedData[index++] = float32Data[h * width * channels + w * channels + c];
            }
          }
        }
      }

      // 转换为float16
      const float16Data = new Uint16Array(reshapedData.length);
      for (let i = 0; i < reshapedData.length; i++) {
        float16Data[i] = this._float32ToFloat16(reshapedData[i]);
      }

      // 创建张量
      const tensor = new ort.Tensor('float16', float16Data, shape);
      return tensor;
    } catch (error) {
      console.error('图像预处理失败:', error);
      throw error;
    }
  }

  async classify(imagePath) {
    if (!this.model) {
      await this.loadModel();
    }

    try {
      // 使用默认的输入名称和形状
      const inputName = 'input';
      // 默认输入形状 [batch, channels, height, width]
      const inputShape = [1, 3, 224, 224];

      // 预处理图像
      const tensor = await this.preprocessImage(imagePath, inputShape);

      // 运行推理
      const feeds = { [inputName]: tensor };
      const results = await this.model.run(feeds);

      // 获取输出
      const outputNames = Object.keys(this.model.outputNames);

      // 尝试不同的方式获取输出数据
      let outputData;
      const outputName = outputNames[0] || 'output';

      if (results[outputName]) {
        outputData = results[outputName].data;
      } else {
        // 尝试使用 'output' 作为名称
        outputData = results['output'] ? results['output'].data : null;
      }

      if (!outputData) {
        throw new Error('无法获取模型输出数据');
      }

      // 将float16输出转换为float32
      const output = Array.from(outputData).map(val => this._float16ToFloat32(val));

      // 应用softmax函数确保概率总和为1
      const maxVal = Math.max(...output);
      const expValues = output.map(val => Math.exp(val - maxVal));
      const sumExp = expValues.reduce((a, b) => a + b, 0);
      const probabilities = expValues.map(val => val / sumExp);

      // 获取前5个最高概率的类别
      const indices = Array.from(probabilities.keys())
        .sort((a, b) => probabilities[b] - probabilities[a])
        .slice(0, 5);

      const top5 = indices.map(index => ({
        label: this.labels[index] || `Class ${index}`,
        probability: probabilities[index]
      }));

      return top5;
    } catch (error) {
      console.error('分类失败:', error);
      throw error;
    }
  }
}

async function main() {
  if (process.argv.length < 3) {
    console.log('用法: node image_classifier.js <图像路径>');
    process.exit(1);
  }

  const imagePath = process.argv[2];

  if (!fs.existsSync(imagePath)) {
    console.error('图像文件未找到:', imagePath);
    process.exit(1);
  }

  try {
    const classifier = new ImageClassifier();
    const results = await classifier.classify(imagePath);

    console.log('\n图像分类结果 (前5个):');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.label}: ${(result.probability * 100).toFixed(2)}%`);
    });
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
}

// 如果直接执行此文件则运行main函数
if (require.main === module) {
  main();
}

module.exports = ImageClassifier;
