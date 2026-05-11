import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const mount = document.getElementById('game-canvas');
const hud = document.getElementById('hud');
const hudScore = document.getElementById('score');
const hudBest = document.getElementById('best-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const pausePanel = document.getElementById('pause-panel');
const btnStart = document.getElementById('btn-start');
const btnRetry = document.getElementById('btn-retry');
const btnMenu = document.getElementById('btn-menu');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnPauseMenu = document.getElementById('btn-pause-menu');
const newRunConfirm = document.getElementById('new-run-confirm');
const btnConfirmRetry = document.getElementById('btn-confirm-retry');
const btnCancelRetry = document.getElementById('btn-cancel-retry');
const rankingPanel = document.getElementById('ranking-panel');
const rankingList = document.getElementById('ranking-list');
const rankingLimit = rankingPanel.querySelector('.ranking-head span');
const scoreForm = document.getElementById('score-form');
const scoreFormLabel = scoreForm.querySelector('label');
const scoreFormSubmit = scoreForm.querySelector('button[type="submit"]');
const playerNameInput = document.getElementById('player-name');
const finalScore = document.getElementById('final-score');
const finalTime = document.getElementById('final-time');
const resultTitle = document.getElementById('result-title');
const characterName = document.getElementById('character-name');
const characterDesc = document.getElementById('character-desc');
const btnCustomize = document.getElementById('btn-customize');
const customizePanel = document.getElementById('customize-panel');
const customizeClose = document.getElementById('customize-close');
const customizeDone = document.getElementById('customize-done');
const customizeGenderRow = document.getElementById('customize-gender-row');
const customizeGenderName = document.getElementById('customize-gender-name');
const customizeCharacterName = document.getElementById('customize-character-name');
const customizeSkinName = document.getElementById('customize-skin-name');
const customizeHairName = document.getElementById('customize-hair-name');
const customizeShirtName = document.getElementById('customize-shirt-name');
const customizePantsName = document.getElementById('customize-pants-name');
const customizeRows = {
    skin: document.getElementById('customize-skin-row'),
    hair: document.getElementById('customize-hair-row'),
    shirt: document.getElementById('customize-shirt-row'),
    pants: document.getElementById('customize-pants-row'),
};

const STORAGE_KEY = 'if-rush-ranking-v1';
const RANKING_ENDPOINT = 'ranking.json';
const CUSTOMIZE_KEY = 'if-rush-customize-v1';
const MAP_CUSTOMIZE_KEY = 'if-mapa3d-customize-v3';
const LANES = [-4.2, 0, 4.2];
const MODEL_ROOT = 'assets/models/';
const NATURE_ROOT = 'assets/models/nature/glTF/';
const BUILDING_ROOT = 'assets/models/buildings/FBX/';
const TEXTURE_ROOT = 'assets/textures/ambientcg/';
const COURSE_TOPICS = [
    { tag: 'WEB', title: 'Desenvolvimento Web', copy: 'Sites e apps que rodam no navegador.', color: 0x2b9cff },
    { tag: 'IA', title: 'Inteligencia Artificial', copy: 'Sistemas que aprendem padroes e ajudam pessoas.', color: 0x8f62ff },
    { tag: 'BD', title: 'Banco de Dados', copy: 'Organizacao das informacoes por tras dos sistemas.', color: 0xffb020 },
    { tag: 'RED', title: 'Redes', copy: 'Computadores conversando com seguranca e velocidade.', color: 0x20c997 },
    { tag: 'GAM', title: 'Games', copy: 'Logica, arte, fisica e interacao virando jogo.', color: 0xff5d8f },
    { tag: 'SEG', title: 'Seguranca', copy: 'Protecao de dados, sistemas e pessoas online.', color: 0xff5a4f },
    { tag: 'ROB', title: 'Robotica', copy: 'Codigo controlando sensores, motores e ideias reais.', color: 0x4cc9f0 },
];

const PRESETS = {
    hair: [
        { label: 'Liso curto preto', color: 0x1b1b1b },
        { label: 'Castanho curto', color: 0x4e342e },
        { label: 'Loiro curto', color: 0xc9a227 },
        { label: 'Ruivo', color: 0xb35a1f },
        { label: 'Branco', color: 0xe0e0e0 },
    ],
    skin: [
        { label: 'Pele clara', color: 0xffd2bd },
        { label: 'Pele rosada', color: 0xffc8a8 },
        { label: 'Pele media', color: 0xc18164 },
        { label: 'Pele morena', color: 0x8b5e3c },
        { label: 'Pele escura', color: 0x5b3621 },
    ],
    shirt: [
        { label: 'Uniforme IF', color: 0x1f8a45 },
        { label: 'Azul informatica', color: 0x2b9cff },
        { label: 'Coral games', color: 0xe26b5c },
        { label: 'Grafite hacker', color: 0x37474f },
        { label: 'Dourado expo', color: 0xffc94a },
    ],
    pants: [
        { label: 'Jeans azul', color: 0x3d5c8c },
        { label: 'Jeans claro', color: 0x6e8db5 },
        { label: 'Jeans escuro', color: 0x1f3147 },
        { label: 'Calca preta', color: 0x1a1a1a },
        { label: 'Calca caqui', color: 0x8a7a5c },
    ],
    eyebrow: [
        { label: 'Sobrancelha preta', color: 0x1a1a1a },
        { label: 'Sobrancelha castanha', color: 0x3e2723 },
        { label: 'Sobrancelha loira', color: 0xc9a227 },
    ],
    character: [
        { label: 'Aluno Casual', file: 'Casual_Male.gltf' },
        { label: 'Aluna Casual', file: 'Casual_Female.gltf' },
        { label: 'Aluno Casual 2', file: 'Casual2_Male.gltf' },
        { label: 'Aluna Casual 2', file: 'Casual2_Female.gltf' },
        { label: 'Aluno Casual 3', file: 'Casual3_Male.gltf' },
        { label: 'Aluna Casual 3', file: 'Casual3_Female.gltf' },
        { label: 'Aluno Careca', file: 'Casual_Bald.gltf' },
        { label: 'Prof. de Terno', file: 'Suit_Male.gltf' },
        { label: 'Profa. de Terno', file: 'Suit_Female.gltf' },
        { label: 'Prof. Veterano', file: 'OldClassy_Male.gltf' },
        { label: 'Profa. Veterana', file: 'OldClassy_Female.gltf' },
        { label: 'Doutor Veterano', file: 'Doctor_Male_Old.gltf' },
        { label: 'Doutor Jovem', file: 'Doctor_Male_Young.gltf' },
        { label: 'Doutora Veterana', file: 'Doctor_Female_Old.gltf' },
        { label: 'Doutora Jovem', file: 'Doctor_Female_Young.gltf' },
        { label: 'Chef', file: 'Chef_Male.gltf' },
        { label: 'Chef Feminina', file: 'Chef_Female.gltf' },
        { label: 'Funcionario', file: 'Worker_Male.gltf' },
        { label: 'Funcionaria', file: 'Worker_Female.gltf' },
        { label: 'Soldado', file: 'Soldier_Male.gltf' },
        { label: 'Soldada', file: 'Soldier_Female.gltf' },
        { label: 'Soldado Azul', file: 'BlueSoldier_Male.gltf' },
        { label: 'Soldada Azul', file: 'BlueSoldier_Female.gltf' },
        { label: 'Cavaleiro', file: 'Knight_Male.gltf' },
        { label: 'Cavaleiro Dourado', file: 'Knight_Golden_Male.gltf' },
        { label: 'Cavaleira Dourada', file: 'Knight_Golden_Female.gltf' },
        { label: 'Ninja', file: 'Ninja_Male.gltf' },
        { label: 'Ninja Feminina', file: 'Ninja_Female.gltf' },
        { label: 'Ninja Areia', file: 'Ninja_Sand.gltf' },
        { label: 'Ninja Areia Fem.', file: 'Ninja_Sand_Female.gltf' },
        { label: 'Cowboy', file: 'Cowboy_Male.gltf' },
        { label: 'Cowgirl', file: 'Cowboy_Female.gltf' },
        { label: 'Pirata', file: 'Pirate_Male.gltf' },
        { label: 'Pirata Fem.', file: 'Pirate_Female.gltf' },
        { label: 'Viking', file: 'Viking_Male.gltf' },
        { label: 'Viking Fem.', file: 'Viking_Female.gltf' },
        { label: 'Quimono', file: 'Kimono_Male.gltf' },
        { label: 'Quimono Fem.', file: 'Kimono_Female.gltf' },
        { label: 'Mago', file: 'Wizard.gltf' },
        { label: 'Bruxa', file: 'Witch.gltf' },
        { label: 'Elfo', file: 'Elf.gltf' },
        { label: 'Goblin', file: 'Goblin_Male.gltf' },
        { label: 'Goblin Fem.', file: 'Goblin_Female.gltf' },
        { label: 'Zumbi', file: 'Zombie_Male.gltf' },
        { label: 'Zumbi Fem.', file: 'Zombie_Female.gltf' },
        { label: 'Vaca', file: 'Cow.gltf' },
        { label: 'Pug', file: 'Pug.gltf' },
    ],
};

const GENDER_PAIRS = {
    'BlueSoldier_Male.gltf': 'BlueSoldier_Female.gltf',
    'BlueSoldier_Female.gltf': 'BlueSoldier_Male.gltf',
    'Casual_Male.gltf': 'Casual_Female.gltf',
    'Casual_Female.gltf': 'Casual_Male.gltf',
    'Casual2_Male.gltf': 'Casual2_Female.gltf',
    'Casual2_Female.gltf': 'Casual2_Male.gltf',
    'Casual3_Male.gltf': 'Casual3_Female.gltf',
    'Casual3_Female.gltf': 'Casual3_Male.gltf',
    'Chef_Male.gltf': 'Chef_Female.gltf',
    'Chef_Female.gltf': 'Chef_Male.gltf',
    'Cowboy_Male.gltf': 'Cowboy_Female.gltf',
    'Cowboy_Female.gltf': 'Cowboy_Male.gltf',
    'Doctor_Male_Old.gltf': 'Doctor_Female_Old.gltf',
    'Doctor_Female_Old.gltf': 'Doctor_Male_Old.gltf',
    'Doctor_Male_Young.gltf': 'Doctor_Female_Young.gltf',
    'Doctor_Female_Young.gltf': 'Doctor_Male_Young.gltf',
    'Goblin_Male.gltf': 'Goblin_Female.gltf',
    'Goblin_Female.gltf': 'Goblin_Male.gltf',
    'Kimono_Male.gltf': 'Kimono_Female.gltf',
    'Kimono_Female.gltf': 'Kimono_Male.gltf',
    'Knight_Golden_Male.gltf': 'Knight_Golden_Female.gltf',
    'Knight_Golden_Female.gltf': 'Knight_Golden_Male.gltf',
    'Ninja_Male.gltf': 'Ninja_Female.gltf',
    'Ninja_Female.gltf': 'Ninja_Male.gltf',
    'Ninja_Sand.gltf': 'Ninja_Sand_Female.gltf',
    'Ninja_Sand_Female.gltf': 'Ninja_Sand.gltf',
    'OldClassy_Male.gltf': 'OldClassy_Female.gltf',
    'OldClassy_Female.gltf': 'OldClassy_Male.gltf',
    'Pirate_Male.gltf': 'Pirate_Female.gltf',
    'Pirate_Female.gltf': 'Pirate_Male.gltf',
    'Soldier_Male.gltf': 'Soldier_Female.gltf',
    'Soldier_Female.gltf': 'Soldier_Male.gltf',
    'Suit_Male.gltf': 'Suit_Female.gltf',
    'Suit_Female.gltf': 'Suit_Male.gltf',
    'Viking_Male.gltf': 'Viking_Female.gltf',
    'Viking_Female.gltf': 'Viking_Male.gltf',
    'Worker_Male.gltf': 'Worker_Female.gltf',
    'Worker_Female.gltf': 'Worker_Male.gltf',
    'Zombie_Male.gltf': 'Zombie_Female.gltf',
    'Zombie_Female.gltf': 'Zombie_Male.gltf',
};

const MATERIAL_TARGETS = {
    skin: [['Skin', 'Bodymat']],
    hair: [['Hair', 'Hairmat']],
    eyebrow: [['Face']],
    shirt: [['Topmat', 'Shirt', 'TShirt'], ['Clothes'], ['Armor', 'Armor_Light'], ['Main']],
    pants: [['Pants', 'Bottommat'], ['Trousers', 'Shorts', 'Skirt', 'Bottom']],
};

const OBSTACLE_TYPES = [
    { id: 'trafficCones', cue: 'PULE', color: 0xff7a1a, kind: 'jump', hitbox: { halfX: 0.9, halfY: 0.48, halfZ: 0.4, centerY: 0.48 } },
    { id: 'lowBarrier', cue: 'PULE', color: 0xffc94a, kind: 'jump', hitbox: { halfX: 0.98, halfY: 0.44, halfZ: 0.38, centerY: 0.46 } },
    { id: 'cableRamp', cue: 'PULE', color: 0x222632, kind: 'jump', hitbox: { halfX: 0.94, halfY: 0.28, halfZ: 0.38, centerY: 0.28 } },
    { id: 'crateStack', cue: 'DESVIE', color: 0xc27a3a, kind: 'block', hitbox: { halfX: 0.78, halfY: 1.02, halfZ: 0.52, centerY: 1.02 } },
    { id: 'roadBlock', cue: 'DESVIE', color: 0xd83c32, kind: 'block', hitbox: { halfX: 0.8, halfY: 0.98, halfZ: 0.48, centerY: 0.98 } },
    { id: 'overheadSign', cue: 'ABAIXE', color: 0x2b9cff, kind: 'slide', hitbox: { halfX: 1.12, halfY: 0.46, halfZ: 0.44, centerY: 2.05 } },
];

const GAMEPLAY = {
    playerHalfX: 0.46,
    playerHalfZ: 0.42,
    playerHalfY: 1.38,
    playerCenterY: 1.38,
    slideHalfY: 0.54,
    slideCenterY: 0.58,
    slideHalfZ: 0.68,
    startSpeed: 19.5,
    maxSpeed: 44,
    acceleration: 0.34,
    gravity: 31,
    jumpVelocity: 12.4,
    fastDropVelocity: 19,
    laneEase: 18,
    slideDuration: 0.58,
    airborneSlideDuration: 0.46,
    collisionPadding: 0.04,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7ecff4);
const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 7.2, 15.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.16;
mount.appendChild(renderer.domElement);
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const hemi = new THREE.HemisphereLight(0xffffff, 0x4f8c58, 1.15);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 1.8);
sun.position.set(-20, 28, 18);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 80;
sun.shadow.camera.left = -34;
sun.shadow.camera.right = 34;
sun.shadow.camera.top = 34;
sun.shadow.camera.bottom = -34;
scene.add(sun);

const rimLight = new THREE.DirectionalLight(0x7adfff, 0.4);
rimLight.position.set(18, 10, -28);
scene.add(rimLight);

const clock = new THREE.Clock();
const world = new THREE.Group();
scene.add(world);

let state = 'menu';
let laneIndex = 1;
let targetLaneIndex = 1;
let playerVelocityY = 0;
let isSliding = false;
let isFastDropping = false;
let pendingGroundRoll = false;
let slideTimer = 0;
let slideElapsed = 0;
let slideVisualDuration = GAMEPLAY.slideDuration;
let rollRecoveryTimer = 0;
let score = 0;
let distance = 0;
let runTime = 0;
let speed = GAMEPLAY.startSpeed;
let spawnTimer = 0;
let collectibleTimer = 0;
let shield = 0;
let multiplierTimer = 0;
let shake = 0;
let combo = 0;
let comboTimer = 0;
let savedCurrentScore = false;
let currentRunRank = null;
let rankingEditorEnabled = false;
const activeKeys = new Set();
let rankingCache = getStoredRanking();
let rankingUsesJson = false;
let bestScore = rankingCache[0]?.score || 0;
let topicCounts = Object.fromEntries(COURSE_TOPICS.map(topic => [topic.tag, 0]));
let customIndex = loadCustomizeState();
let previewLoadToken = 0;
let playerLoadToken = 0;
let rankingRefreshTimer = 0;
let startCameraIntro = 0;

const START_CAMERA_INTRO_DURATION = 0.92;
const SCENERY_COUNT = 9;
const SCENERY_SPACING = 14;
const SCENERY_START_Z = 18;
const SCENERY_RECYCLE_Z = 24;
const SCENERY_LOOP_LENGTH = SCENERY_COUNT * SCENERY_SPACING;
const SCENERY_SPEED_FACTOR = 0.82;
const CLOUD_COUNT = 8;
const CLOUD_SPACING = 26;
const CLOUD_LOOP_LENGTH = CLOUD_COUNT * CLOUD_SPACING;
const CLOUD_RECYCLE_Z = 82;
const CLOUD_START_Z = CLOUD_RECYCLE_Z - CLOUD_LOOP_LENGTH;
const CLOUD_SPEED_FACTOR = 0.44;
const SOUND_ROOT = 'sounds/';

function makeSound(path) {
    return new Audio(encodeURI(`${SOUND_ROOT}${path}`));
}

const audioManager = {
    sounds: {
        bgm: makeSound('Ambiente/nintendo_style_bgm.mp3'),
        jump: makeSound('Player/pular/mixkit-fast-transitions-swoosh-3115.wav'),
        slide: makeSound('Player/Esquivar/mixkit-fast-transitions-swoosh-3115.wav'),
        dodge: makeSound('Player/Esquivar/mixkit-explainer-video-game-alert-sweep-236.wav'),
        hit: makeSound('Programa/losing/mixkit-player-losing-or-failing-2042.wav'),
        coin: makeSound('Programa/quiz/mixkit-bonus-earned-in-video-game-2058.wav'),
        record: makeSound('Programa/record/mixkit-game-level-completed-2059.wav'),
        click: makeSound('Programa/button press/emilianodleon-button-ui-sound-effect-395762.mp3'),
        run: makeSound('Player/correr/mixkit-running-through-the-forest-1232.wav'),
        shieldUp: makeSound('Player/Shield up/bible_images-video-game-power-up-sound-effect-384657.mp3'),
        shieldBreak: makeSound('Player/Shield break/11325622-glass-breaking-sound-effect-240679.mp3'),
    },
    ambientSounds: [
        makeSound('Ambiente/animais/cachorros/mixkit-medium-size-angry-dog-bark-54.wav'),
        makeSound('Ambiente/animais/fazenda/mixkit-cow-moo-in-the-barn-1751.wav'),
        makeSound('Ambiente/animais/fazenda/mixkit-farm-goat-baa-1763.wav'),
        makeSound('Ambiente/animais/gatos/mixkit-angry-cartoon-kitty-meow-94.wav'),
        makeSound('Ambiente/animais/gatos/mixkit-domestic-cat-hungry-meow-45.wav'),
    ],
    ambientTimer: null,
    currentAmbient: null,
    init() {
        this.sounds.bgm.loop = true;
        this.sounds.bgm.volume = 0.3;
        this.sounds.bgm.preload = 'metadata';
        this.sounds.run.loop = true;
        this.sounds.run.volume = 0.15;
        Object.entries(this.sounds).forEach(([name, sound]) => {
            if (name !== 'bgm' && name !== 'run') sound.volume = 0.6;
            sound.preload = name === 'bgm' ? 'metadata' : 'auto';
            if (name !== 'bgm') sound.load();
        });
        this.ambientSounds.forEach(sound => {
            sound.volume = 0;
            sound.preload = 'auto';
            sound.load();
        });
        window.addEventListener('click', event => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            if (target.closest('button') || target.classList.contains('selector-btn') || target.closest('.customize-row')) {
                this.play('click');
            }
        });
    },
    play(name) {
        const sound = this.sounds[name];
        if (!sound) return;
        if (name === 'bgm' || name === 'run') {
            sound.currentTime = 0;
            sound.play().catch(() => { });
            return;
        }
        const clone = sound.cloneNode();
        clone.volume = sound.volume;
        clone.play().catch(() => { });
    },
    stop(name) {
        const sound = this.sounds[name];
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
    },
    startAmbient() {
        if (this.ambientTimer) return;
        const triggerAmbient = () => {
            if (this.currentAmbient) this.fadeOutAmbient(this.currentAmbient);
            this.currentAmbient = this.ambientSounds[Math.floor(Math.random() * this.ambientSounds.length)];
            this.currentAmbient.currentTime = 0;
            this.currentAmbient.play().catch(() => { });
            this.fadeInAmbient(this.currentAmbient);
            this.ambientTimer = setTimeout(triggerAmbient, 6000 + Math.random() * 8000);
        };
        this.ambientTimer = setTimeout(triggerAmbient, 2000 + Math.random() * 4000);
    },
    stopAmbient() {
        if (this.ambientTimer) {
            clearTimeout(this.ambientTimer);
            this.ambientTimer = null;
        }
        if (this.currentAmbient) {
            this.fadeOutAmbient(this.currentAmbient);
            this.currentAmbient = null;
        }
    },
    fadeInAmbient(sound) {
        let volume = 0;
        sound.volume = volume;
        const fadeInterval = setInterval(() => {
            if (volume < 0.25) {
                volume += 0.02;
                sound.volume = Math.min(volume, 0.25);
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    },
    fadeOutAmbient(sound) {
        let volume = sound.volume;
        const fadeInterval = setInterval(() => {
            if (volume > 0.02) {
                volume -= 0.02;
                sound.volume = Math.max(volume, 0);
            } else {
                sound.volume = 0;
                sound.pause();
                clearInterval(fadeInterval);
            }
        }, 100);
    },
};
audioManager.init();

const liveObjects = [];
const roadSegments = [];
const scenery = [];
const cloudScenery = [];
const sparks = [];
const comboPopups = [];
const labelTextureCache = new Map();
const coinTextureCache = new Map();
const characterCache = new Map();
const loaderGLTF = new GLTFLoader();
const loaderFBX = new FBXLoader();
const textureLoader = new THREE.TextureLoader();
const gameAssets = {
    player: null,
    trees: [],
    bushes: [],
    rocks: [],
    buildings: [],
};

function loadGLTFAsset(url) {
    return new Promise((resolve, reject) => {
        loaderGLTF.load(encodeURI(url), resolve, undefined, reject);
    });
}

function loadFBXAsset(url) {
    return new Promise((resolve, reject) => {
        loaderFBX.load(encodeURI(url), resolve, undefined, reject);
    });
}

function normalizeIndex(value, length) {
    return ((value % length) + length) % length;
}

function loadCustomizeState() {
    const base = { character: 0, skin: 0, hair: 0, eyebrow: 0, pants: 0, shirt: 0 };
    for (const key of [CUSTOMIZE_KEY, MAP_CUSTOMIZE_KEY]) {
        try {
            const saved = JSON.parse(localStorage.getItem(key) || 'null');
            if (saved && typeof saved === 'object') {
                Object.assign(base, saved);
                break;
            }
        } catch { }
    }
    for (const region of Object.keys(base)) {
        if (!PRESETS[region]) continue;
        base[region] = normalizeIndex(Number.isInteger(base[region]) ? base[region] : 0, PRESETS[region].length);
    }
    return base;
}

function saveCustomizeState() {
    try {
        localStorage.setItem(CUSTOMIZE_KEY, JSON.stringify(customIndex));
    } catch { }
}

function getCurrentCharacter() {
    return PRESETS.character[customIndex.character];
}

function getCurrentAccentColor() {
    return PRESETS.shirt[customIndex.shirt].color;
}

async function loadCharacterAsset(file) {
    if (characterCache.has(file)) return characterCache.get(file);
    const promise = loadGLTFAsset(MODEL_ROOT + 'chars/' + file).catch(err => {
        console.warn('[IF Rush] Character GLTF falhou:', file, err);
        return null;
    });
    characterCache.set(file, promise);
    return promise;
}

function enableModelShadows(root) {
    root.traverse(child => {
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
            child.material = child.material.clone();
            child.material.roughness = Math.min(0.88, child.material.roughness ?? 0.72);
            child.material.metalness = child.material.metalness ?? 0.02;
        }
    });
}

function fitObjectToBox(object, { width = null, height = null, depth = null } = {}) {
    object.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scaleCandidates = [];
    if (width && size.x > 0) scaleCandidates.push(width / size.x);
    if (height && size.y > 0) scaleCandidates.push(height / size.y);
    if (depth && size.z > 0) scaleCandidates.push(depth / size.z);
    const scale = scaleCandidates.length ? Math.min(...scaleCandidates) : 1;
    object.scale.multiplyScalar(scale);
    object.updateMatrixWorld(true);

    const scaledBox = new THREE.Box3().setFromObject(object);
    const scaledCenter = new THREE.Vector3();
    scaledBox.getCenter(scaledCenter);
    object.position.x -= scaledCenter.x;
    object.position.z -= scaledCenter.z;
    object.position.y -= scaledBox.min.y;
    return object;
}

function cloneStaticModel(source, fit) {
    const obj = source.clone(true);
    enableModelShadows(obj);
    fitObjectToBox(obj, fit);
    return obj;
}

function clonePlayerModel(asset = gameAssets.player) {
    if (!asset) return null;
    const root = SkeletonUtils.clone(asset.scene);
    enableModelShadows(root);
    fitObjectToBox(root, { height: 3.35 });
    root.rotation.y = Math.PI;
    root.userData.basePosition = root.position.clone();
    root.userData.baseRotation = root.rotation.clone();
    applyCustomizationToRoot(root);
    return root;
}

function tintMats(root, names, colorHex) {
    if (!root) return 0;
    let count = 0;
    root.traverse(child => {
        if (!child.isMesh || !child.material) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(material => {
            const matName = material?.name || '';
            const matches = names.some(name => matName === name || matName.toLowerCase().includes(name.toLowerCase()));
            if (matches && material.color) {
                material.color.setHex(colorHex);
                count++;
            }
        });
    });
    return count;
}

function countMatchingMats(root, tiers) {
    if (!root) return 0;
    let count = 0;
    root.traverse(child => {
        if (!child.isMesh || !child.material) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(material => {
            const matName = material?.name || '';
            const matches = tiers.some(names =>
                names.some(name => matName === name || matName.toLowerCase().includes(name.toLowerCase()))
            );
            if (matches) count++;
        });
    });
    return count;
}

function tintCascade(root, tiers, colorHex) {
    for (const names of tiers) {
        if (tintMats(root, names, colorHex) > 0) return;
    }
}

function applyCustomizationToRoot(root) {
    tintCascade(root, MATERIAL_TARGETS.skin, PRESETS.skin[customIndex.skin].color);
    tintCascade(root, MATERIAL_TARGETS.hair, PRESETS.hair[customIndex.hair].color);
    tintCascade(root, MATERIAL_TARGETS.eyebrow, PRESETS.eyebrow[customIndex.eyebrow].color);
    tintCascade(root, MATERIAL_TARGETS.shirt, PRESETS.shirt[customIndex.shirt].color);
    tintCascade(root, MATERIAL_TARGETS.pants, PRESETS.pants[customIndex.pants].color);
}

function prepareLoadedTexture(tex, repeatX = 1, repeatY = 1, useColorSpace = true) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = maxAnisotropy;
    if (useColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

function loadAmbientTexture(assetId, suffix, repeatX, repeatY, useColorSpace = suffix === 'Color') {
    const url = `${TEXTURE_ROOT}${assetId}/${assetId}_1K-JPG_${suffix}.jpg`;
    return prepareLoadedTexture(textureLoader.load(url), repeatX, repeatY, useColorSpace);
}

function makeAmbientMaterial(assetId, repeatX, repeatY, {
    color = 0xffffff,
    normalScale = 0.45,
    roughness = 0.86,
    metalness = 0.02,
} = {}) {
    return new THREE.MeshStandardMaterial({
        color,
        map: loadAmbientTexture(assetId, 'Color', repeatX, repeatY, true),
        normalMap: loadAmbientTexture(assetId, 'NormalGL', repeatX, repeatY, false),
        normalScale: new THREE.Vector2(normalScale, normalScale),
        roughnessMap: loadAmbientTexture(assetId, 'Roughness', repeatX, repeatY, false),
        roughness,
        metalness,
    });
}

function cloneTintedMaterial(material, color) {
    const clone = material.clone();
    clone.color = new THREE.Color(color);
    return clone;
}

function styleImportedBuilding(root, palette) {
    root.updateMatrixWorld(true);
    const rootBox = new THREE.Box3().setFromObject(root);
    const rootHeight = Math.max(0.001, rootBox.max.y - rootBox.min.y);
    const wallMat = cloneTintedMaterial(mats.buildingWall, palette[0]);
    const roofMat = cloneTintedMaterial(mats.roof, palette[1]);
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0x9adcf4,
        roughness: 0.16,
        metalness: 0.02,
        transparent: true,
        opacity: 0.88,
    });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xf8f3e8, roughness: 0.76 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x295846, roughness: 0.62 });

    root.traverse(child => {
        if (!child.isMesh) return;
        const token = `${child.name || ''} ${child.material?.name || ''}`.toLowerCase();
        const childBox = new THREE.Box3().setFromObject(child);
        const childHeight = childBox.max.y - childBox.min.y;
        const childTopRatio = (childBox.max.y - rootBox.min.y) / rootHeight;
        const isTopCap = childTopRatio > 0.78 && childHeight < rootHeight * 0.28;
        if (token.includes('roof') || token.includes('tile') || isTopCap) child.material = roofMat;
        else if (token.includes('window') || token.includes('glass')) child.material = glassMat;
        else if (token.includes('door')) child.material = doorMat;
        else if (token.includes('trim') || token.includes('column') || token.includes('stair')) child.material = trimMat;
        else child.material = wallMat;
        child.castShadow = true;
        child.receiveShadow = true;
    });
}

async function loadGameAssets() {
    const initialCharacter = getCurrentCharacter().file;
    const [playerResult, buildingResults] = await Promise.all([
        loadCharacterAsset(initialCharacter).catch(err => {
            console.warn('[IF Rush] Player GLTF falhou, usando fallback procedural:', err);
            return null;
        }),
        Promise.all([
            '1Story_GableRoof.fbx',
            '2Story_Wide.fbx',
            '2Story_Columns.fbx',
            '3Story_Slim.fbx',
        ].map(file => loadFBXAsset(BUILDING_ROOT + file).catch(err => {
            console.warn('[IF Rush] Building FBX falhou:', file, err);
            return null;
        }))),
    ]);

    gameAssets.player = playerResult;
    gameAssets.trees = [];
    gameAssets.bushes = [];
    gameAssets.rocks = [];
    gameAssets.buildings = buildingResults.filter(Boolean);
}

hudBest.textContent = String(bestScore);

const treeBarkMap = makeNoiseTexture('#a37446', '#6c4328', 70, 512);
const treeLeafMap = makeNoiseTexture('#39c970', '#1d994e', 75, 512);
const stylizedGrassMap = makeLowPolyPatchTexture('#77c649', '#599d34', '#9cdf70', 10, 24, 768, 160);

const mats = {
    road: new THREE.MeshStandardMaterial({ color: 0x65717d, roughness: 0.96 }),
    sidewalk: new THREE.MeshStandardMaterial({ color: 0xffffff, map: makeTileTexture('#f4dfc7', '#d3b89a'), roughness: 0.98 }),
    grass: new THREE.MeshStandardMaterial({ color: 0xffffff, map: stylizedGrassMap, roughness: 0.99 }),
    buildingWall: new THREE.MeshStandardMaterial({ color: 0xffffff, map: makeBuildingWallTexture(), roughness: 0.98 }),
    roof: new THREE.MeshStandardMaterial({ color: 0xffffff, map: makeRoofTexture(), roughness: 0.95 }),
    concrete: new THREE.MeshStandardMaterial({ color: 0xf7efe1, map: makeTileTexture('#f3e5cf', '#d8bea0'), roughness: 0.98 }),
    curb: new THREE.MeshStandardMaterial({ color: 0xfffaf0, map: makeTileTexture('#f3e5cf', '#d8bea0'), roughness: 0.98 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xd4dee5, roughness: 0.28, metalness: 0.01, transparent: true, opacity: 0.92 }),
    white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }),
    black: new THREE.MeshStandardMaterial({ color: 0x172033, roughness: 0.62 }),
    green: new THREE.MeshStandardMaterial({ color: 0x1f8a45, roughness: 0.58 }),
    red: new THREE.MeshStandardMaterial({ color: 0xd83c32, roughness: 0.64 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xffc94a, roughness: 0.46, metalness: 0.02 }),
    warningYellow: new THREE.MeshStandardMaterial({ map: makeWarningStripeTexture('#ffcf43', '#171d25'), roughness: 0.5, metalness: 0.02 }),
    warningRed: new THREE.MeshStandardMaterial({ map: makeWarningStripeTexture('#ef3f36', '#fff6e8'), roughness: 0.54, metalness: 0.02 }),
    crateWood: new THREE.MeshStandardMaterial({ color: 0xd1843d, map: makeCrateTexture(), roughness: 0.74, metalness: 0.01 }),
};

await loadGameAssets();

const player = createPlayer();
scene.add(player.group);
const selectorStage = createSelectorStage();
player.group.visible = false;
player.shadow.visible = false;
selectorStage.visible = true;

createTrack();
for (let i = 0; i < SCENERY_COUNT; i++) {
    addSceneryCluster(SCENERY_START_Z - i * SCENERY_SPACING);
}
for (let i = 0; i < CLOUD_COUNT; i++) {
    addCloudCluster(CLOUD_START_Z + i * CLOUD_SPACING, i);
}
scene.add(createInstitute());
await syncRankingFromJson();
renderRanking();
updateCharacterSelection();
updatePauseUi();

const loading = document.getElementById('loading-screen');
if (loading) loading.remove();
document.getElementById('start-screen').hidden = false;
document.getElementById('start-screen').classList.add('screen-open');

animate();

function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function finishTexture(canvas, repeatX = 1, repeatY = 1) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = maxAnisotropy;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

function makeLowPolyPatchTexture(
    base = '#78c44e',
    shadow = '#5ca338',
    highlight = '#9adf69',
    repeatX = 10,
    repeatY = 22,
    size = 768,
    facets = 140
) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < facets; i++) {
        const cx = Math.random() * size;
        const cy = Math.random() * size;
        const radius = 18 + Math.random() * 68;
        const sides = 4 + Math.floor(Math.random() * 4);
        ctx.beginPath();
        for (let point = 0; point < sides; point++) {
            const angle = (Math.PI * 2 * point) / sides + Math.random() * 0.42;
            const r = radius * (0.72 + Math.random() * 0.42);
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (point === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = i % 5 === 0 ? highlight : i % 2 === 0 ? shadow : base;
        ctx.globalAlpha = i % 5 === 0 ? 0.22 : 0.16;
        ctx.fill();
    }

    ctx.globalAlpha = 0.16;
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, 'rgba(255,255,255,0.22)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 1;

    return finishTexture(canvas, repeatX, repeatY);
}

function makeRoadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#4f5a65');
    grad.addColorStop(0.38, '#68727e');
    grad.addColorStop(0.72, '#59636e');
    grad.addColorStop(1, '#464f59');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.09;
    for (let i = 0; i < 720; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 131) % canvas.height;
        const shade = i % 5 ? '#ffffff' : '#223241';
        ctx.fillStyle = shade;
        ctx.fillRect(x, y, 5 + (i % 13), 1 + (i % 2));
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    for (let y = 0; y < canvas.height; y += 92) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(240, y + 12, 680, y - 10, canvas.width, y + 4);
        ctx.stroke();
    }

    return finishTexture(canvas, 1, 1);
}

function makeRoadBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#858585';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.36;
    for (let i = 0; i < 3600; i++) {
        const shade = 92 + (i % 9) * 8;
        ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
        ctx.fillRect((i * 59) % canvas.width, (i * 113) % canvas.height, 2 + (i % 6), 1 + (i % 4));
    }
    return finishTexture(canvas, 1, 1);
}

function makeTileTexture(base = '#f4e3c5', line = '#d4bd98', size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, 'rgba(255,255,255,0.24)');
    grad.addColorStop(1, 'rgba(80,55,30,0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = line;
    ctx.lineWidth = Math.max(2, size / 128);
    for (let y = 0; y <= size; y += size / 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
    }
    for (let x = 0; x <= size; x += size / 5.333) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
        ctx.stroke();
    }

    ctx.globalAlpha = 0.12;
    for (let i = 0; i < 380; i++) {
        ctx.fillStyle = i % 2 ? '#ffffff' : '#6d5a43';
        ctx.beginPath();
        ctx.arc((i * 67) % size, (i * 31) % size, 1 + (i % 4), 0, Math.PI * 2);
        ctx.fill();
    }
    return finishTexture(canvas, 2, 10);
}

function makeSidewalkBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#8e8e8e';
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.strokeStyle = '#5f5f5f';
    ctx.lineWidth = 7;
    for (let y = 0; y <= 1024; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
    }
    for (let x = 0; x <= 1024; x += 192) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
    }
    return finishTexture(canvas, 2, 10);
}

function makeNoiseTexture(a, b, count = 60, size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = a;
    ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 0.34;
    for (let i = 0; i < count; i++) {
        ctx.fillStyle = i % 2 ? b : '#ffffff';
        ctx.beginPath();
        ctx.ellipse((i * 89) % size, (i * 157) % size, 16 + (i % 14), 4 + (i % 7), (i % 7) * 0.8, 0, Math.PI * 2);
        ctx.fill();
    }
    return finishTexture(canvas, 12, 36);
}

function makeWarningStripeTexture(primary = '#ffc94a', secondary = '#151922') {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = secondary;
    ctx.fillRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(-Math.PI / 5.5);
    ctx.fillStyle = primary;
    for (let x = -size * 1.5; x < size * 1.5; x += 112) {
        ctx.fillRect(x, -size * 1.4, 58, size * 2.8);
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.fillRect(0, 0, size, 58);
    return finishTexture(canvas, 1.2, 1.2);
}

function makeCrateTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#e0a25b');
    grad.addColorStop(0.55, '#b86c32');
    grad.addColorStop(1, '#7d451f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(69,35,17,0.55)';
    ctx.lineWidth = 10;
    for (let y = 0; y <= size; y += 96) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y + 12);
        ctx.stroke();
    }
    ctx.lineWidth = 18;
    ctx.strokeRect(24, 24, size - 48, size - 48);
    ctx.beginPath();
    ctx.moveTo(48, size - 48);
    ctx.lineTo(size - 48, 48);
    ctx.stroke();

    ctx.globalAlpha = 0.24;
    for (let i = 0; i < 180; i++) {
        ctx.strokeStyle = i % 2 ? '#fff0c6' : '#4a2512';
        ctx.lineWidth = 2 + (i % 3);
        ctx.beginPath();
        const y = (i * 43) % size;
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(140, y + 12, 280, y - 10, size, y + 4);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return finishTexture(canvas, 1, 1);
}

function makeGrassBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#858585';
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.globalAlpha = 0.42;
    for (let i = 0; i < 1600; i++) {
        const shade = 82 + (i % 11) * 9;
        ctx.strokeStyle = `rgb(${shade},${shade},${shade})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const x = (i * 37) % 1024;
        const y = (i * 71) % 1024;
        ctx.moveTo(x, y);
        ctx.lineTo(x + 8 - (i % 17), y - 18 - (i % 8));
        ctx.stroke();
    }
    return finishTexture(canvas, 12, 36);
}

function makeBuildingWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff4df';
    ctx.fillRect(0, 0, 1024, 1024);
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, 'rgba(255,255,255,0.35)');
    grad.addColorStop(1, 'rgba(160,120,80,0.16)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.globalAlpha = 0.2;
    for (let y = 0; y < 1024; y += 42) {
        ctx.strokeStyle = '#c9bca7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
    }
    for (let i = 0; i < 360; i++) {
        ctx.fillStyle = i % 2 ? '#ffffff' : '#8f7458';
        ctx.fillRect((i * 83) % 1024, (i * 47) % 1024, 2 + (i % 6), 1 + (i % 3));
    }
    return finishTexture(canvas, 1.2, 2.2);
}

function makeRoofTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#c84e3f';
    ctx.fillRect(0, 0, 1024, 1024);
    for (let y = -24; y < 1024; y += 64) {
        for (let x = -36; x < 1024; x += 72) {
            ctx.fillStyle = ((x + y) / 64) % 2 > 1 ? '#d95f4c' : '#b84136';
            roundedRect(ctx, x, y, 66, 44, 10);
            ctx.fill();
            ctx.strokeStyle = 'rgba(92,34,28,0.24)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
    return finishTexture(canvas, 2.4, 2.4);
}

function makeRoofBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#838383';
    ctx.fillRect(0, 0, 1024, 1024);
    for (let y = -24; y < 1024; y += 64) {
        for (let x = -36; x < 1024; x += 72) {
            ctx.strokeStyle = '#5f5f5f';
            ctx.lineWidth = 5;
            roundedRect(ctx, x, y, 66, 44, 10);
            ctx.stroke();
        }
    }
    return finishTexture(canvas, 2.4, 2.4);
}

function makeLabelTexture(label, bg = '#1f8a45', fg = '#ffffff') {
    const cacheKey = `${label}|${bg}|${fg}`;
    if (labelTextureCache.has(cacheKey)) return labelTextureCache.get(cacheKey);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = bg;
    roundedRect(ctx, 24, 38, 208, 180, 36);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    roundedRect(ctx, 44, 58, 168, 44, 22);
    ctx.fill();
    ctx.fillStyle = fg;
    const fontSize = label.length > 5 ? 36 : label.length > 4 ? 42 : label.length > 3 ? 52 : 62;
    ctx.font = `900 ${fontSize}px Outfit, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 128, 138);
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = maxAnisotropy;
    tex.colorSpace = THREE.SRGBColorSpace;
    labelTextureCache.set(cacheKey, tex);
    return tex;
}

function makeCoinFaceTexture(mark = 'IF', bg = '#ffc94a', fg = '#fff8dc') {
    const cacheKey = `${mark}|${bg}|${fg}`;
    if (coinTextureCache.has(cacheKey)) return coinTextureCache.get(cacheKey);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);

    const grad = ctx.createRadialGradient(92, 68, 28, 128, 128, 118);
    grad.addColorStop(0, mark === 'BTC' ? '#d69a2c' : '#fff1a8');
    grad.addColorStop(0.42, bg);
    grad.addColorStop(1, mark === 'BTC' ? '#6f3e06' : '#c58c18');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 112, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(103, 63, 6, 0.48)';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(128, 128, 102, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (mark === 'BTC') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(128, 128, 96, 0, Math.PI * 2);
        ctx.clip();
        ctx.strokeStyle = 'rgba(75, 43, 6, 0.52)';
        ctx.lineCap = 'round';
        for (let r = 28; r <= 92; r += 6) {
            ctx.lineWidth = r % 12 === 0 ? 2.2 : 1.2;
            ctx.beginPath();
            ctx.arc(128, 128, r, Math.PI * 0.08, Math.PI * 1.92);
            ctx.stroke();
        }
        for (let i = 0; i < 34; i++) {
            const angle = i * Math.PI * 2 / 34;
            const start = 48 + (i % 4) * 6;
            const end = 92 - (i % 3) * 5;
            const x1 = 128 + Math.cos(angle) * start;
            const y1 = 128 + Math.sin(angle) * start;
            const x2 = 128 + Math.cos(angle) * end;
            const y2 = 128 + Math.sin(angle) * end;
            ctx.lineWidth = i % 5 === 0 ? 2.2 : 1.1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            if (i % 3 === 0) {
                ctx.beginPath();
                ctx.arc(x2, y2, 2.2, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        ctx.restore();

        ctx.strokeStyle = 'rgba(82, 49, 8, 0.66)';
        ctx.lineWidth = 3;
        for (const radius of [74, 87, 98]) {
            ctx.beginPath();
            ctx.arc(128, 128, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(77, 43, 5, 0.7)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 42; i++) {
            const angle = i * Math.PI * 2 / 42;
            const inner = 101;
            const outer = i % 2 === 0 ? 110 : 106;
            ctx.beginPath();
            ctx.moveTo(128 + Math.cos(angle) * inner, 128 + Math.sin(angle) * inner);
            ctx.lineTo(128 + Math.cos(angle) * outer, 128 + Math.sin(angle) * outer);
            ctx.stroke();
        }

        ctx.fillStyle = '#4a2a06';
        ctx.font = '700 12px Arial, sans-serif';
        ctx.fillText('BITCOIN', 128, 39);
        ctx.fillText('BTC', 128, 220);

        ctx.font = '900 112px Arial, sans-serif';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#2f1b05';
        ctx.lineWidth = 13;
        ctx.strokeText('B', 129, 135);
        const bGrad = ctx.createLinearGradient(82, 64, 174, 186);
        bGrad.addColorStop(0, '#f1d271');
        bGrad.addColorStop(0.42, '#c98516');
        bGrad.addColorStop(1, '#704106');
        ctx.fillStyle = bGrad;
        ctx.fillText('B', 129, 135);
        ctx.strokeStyle = '#2f1b05';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        for (const x of [111, 132]) {
            ctx.beginPath();
            ctx.moveTo(x, 62);
            ctx.lineTo(x, 194);
            ctx.stroke();
        }
        ctx.strokeStyle = '#e1bd5a';
        ctx.lineWidth = 4;
        for (const x of [111, 132]) {
            ctx.beginPath();
            ctx.moveTo(x, 62);
            ctx.lineTo(x, 194);
            ctx.stroke();
        }
        ctx.fillStyle = bGrad;
        ctx.fillText('B', 129, 135);
    } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.36)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(128, 128, 82, Math.PI * 1.08, Math.PI * 1.72);
        ctx.stroke();

        ctx.fillStyle = fg;
        ctx.font = '900 78px Outfit, Arial, sans-serif';
        ctx.fillText(mark, 128, 132);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = maxAnisotropy;
    tex.colorSpace = THREE.SRGBColorSpace;
    coinTextureCache.set(cacheKey, tex);
    return tex;
}

function addRoadMarkings(segment) {
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xfff6d2, transparent: true, opacity: 0.92 });
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.82 });
    for (const x of [-2.1, 2.1]) {
        for (let z = -16; z <= 18; z += 7.2) {
            const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 3.35), dashMat);
            dash.rotation.x = -Math.PI / 2;
            dash.position.set(x, 0.045, z);
            segment.add(dash);
        }
    }
    for (const x of [-6.95, 6.95]) {
        const edge = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 35.5), edgeMat);
        edge.rotation.x = -Math.PI / 2;
        edge.position.set(x, 0.046, 0);
        segment.add(edge);
    }
}

function addMovingSideHills(segment, segmentIndex) {
    for (const side of [-1, 1]) {
        const ridge = new THREE.Mesh(new THREE.IcosahedronGeometry(13.5, 1), mats.grass);
        ridge.position.set(side * 54, -1.25, ((segmentIndex * 13) % 24) - 12);
        ridge.scale.set(2.15, 0.34, 1.65);
        ridge.rotation.y = side * (0.28 + segmentIndex * 0.11);
        ridge.castShadow = true;
        ridge.receiveShadow = true;
        segment.add(ridge);

        for (let i = 0; i < 3; i++) {
            const hill = new THREE.Mesh(new THREE.IcosahedronGeometry(7.5 + i * 1.9, 1), mats.grass);
            const stagger = ((segmentIndex * 19 + i * 9) % 33) - 16;
            hill.position.set(side * (30 + i * 10), -1.08 - i * 0.36, stagger);
            hill.scale.set(1.45 + i * 0.23, 0.38 + i * 0.04, 1.24 + i * 0.16);
            hill.rotation.y = side * (0.35 + segmentIndex * 0.17 + i * 0.48);
            hill.castShadow = true;
            hill.receiveShadow = true;
            segment.add(hill);
        }
    }
}

function createTrack() {
    for (let i = 0; i < 8; i++) {
        const segment = new THREE.Group();
        const z = -i * 34;

        const grass = new THREE.Mesh(new THREE.PlaneGeometry(150, 36), mats.grass);
        grass.rotation.x = -Math.PI / 2;
        grass.position.y = -0.035;
        grass.receiveShadow = true;
        segment.add(grass);

        const road = new THREE.Mesh(new THREE.PlaneGeometry(14.7, 36), mats.road);
        road.rotation.x = -Math.PI / 2;
        road.position.y = 0.012;
        road.receiveShadow = true;
        segment.add(road);

        addRoadMarkings(segment);
        addMovingSideHills(segment, i);

        [-9.3, 9.3].forEach(x => {
            const walk = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 36), mats.sidewalk);
            walk.rotation.x = -Math.PI / 2;
            walk.position.set(x, 0.025, 0);
            walk.receiveShadow = true;
            segment.add(walk);

            const curb = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 36), mats.curb);
            curb.position.set(x > 0 ? 7.62 : -7.62, 0.12, 0);
            curb.castShadow = true;
            segment.add(curb);
        });

        segment.position.z = z;
        world.add(segment);
        roadSegments.push(segment);
    }
}

function createLowPolyCloud() {
    const group = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 1.0 });
    const geo = new THREE.IcosahedronGeometry(2, 0);
    
    const puffs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < puffs; i++) {
        const puff = new THREE.Mesh(geo, cloudMat);
        puff.position.set(i * 2.0 - (puffs * 2.0)/2, Math.random() * 1.5, Math.random() * 1.5);
        puff.scale.set(1, 0.6 + Math.random() * 0.4, 1);
        group.add(puff);
    }
    return group;
}

function createLowPolyTree() {
    const group = new THREE.Group();
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x3a732a, flatShading: true, roughness: 1.0 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x54361c, flatShading: true, roughness: 1.0 });
    
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2, 5), trunkMat);
    trunk.position.y = 1;
    trunk.castShadow = true;
    group.add(trunk);
    
    const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(2.0, 0), leafMat);
    leaves.position.y = 3.2;
    leaves.castShadow = true;
    group.add(leaves);
    
    if (Math.random() > 0.4) {
        const leaves2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 0), leafMat);
        leaves2.position.set(1.0, 2.5, 0);
        leaves2.castShadow = true;
        group.add(leaves2);
    }
    
    group.scale.setScalar(1 + Math.random() * 0.6);
    return group;
}

function registerGroundSpawn(object) {
    object.userData.baseScale = object.scale.clone();
    object.userData.baseY = object.position.y;
    object.userData.growProgress = 1;
    return object;
}

function resetGroundSpawn(group) {
    let index = 0;
    for (const child of group.children) {
        if (!child.userData.baseScale) continue;
        child.userData.growProgress = -index * 0.09;
        child.scale.set(
            child.userData.baseScale.x * 0.68,
            child.userData.baseScale.y * 0.04,
            child.userData.baseScale.z * 0.68
        );
        child.position.y = child.userData.baseY - 0.16;
        index += 1;
    }
}

function updateGroundSpawn(group, delta) {
    for (const child of group.children) {
        const baseScale = child.userData.baseScale;
        if (!baseScale || child.userData.growProgress >= 1) continue;
        child.userData.growProgress = Math.min(1, child.userData.growProgress + delta * 1.35);
        const progress = Math.max(0, child.userData.growProgress);
        const ease = progress * progress * (3 - 2 * progress);
        const widthScale = 0.68 + ease * 0.32;
        child.scale.set(
            baseScale.x * widthScale,
            baseScale.y * Math.max(0.04, ease),
            baseScale.z * widthScale
        );
        child.position.y = child.userData.baseY - (1 - ease) * 0.16;
    }
}

function createInstitute() {
    const group = new THREE.Group();
    const wallMat = cloneTintedMaterial(mats.buildingWall, 0xfffbef);
    const roofMat = cloneTintedMaterial(mats.roof, 0xc86a44);
    roofMat.side = THREE.DoubleSide;
    const towerRoofMat = cloneTintedMaterial(mats.roof, 0xe0713f);
    towerRoofMat.side = THREE.DoubleSide;
    const timberMat = new THREE.MeshStandardMaterial({ color: 0x3b2a23, roughness: 0.92 });
    const timberLightMat = new THREE.MeshStandardMaterial({ color: 0x76523f, roughness: 0.86 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xf7f2e8, roughness: 0.72 });
    const glassMat = new THREE.MeshStandardMaterial({
        color: 0xcbd7d8,
        roughness: 0.34,
        metalness: 0.01,
        transparent: true,
        opacity: 0.92,
    });
    const clockMat = new THREE.MeshStandardMaterial({ color: 0xf1d5a8, roughness: 0.82 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x31443c, roughness: 0.78 });

    const frontZ = (z, depth) => z + depth / 2 + 0.08;

    const addPlane = (w, h, x, y, z, mat, rotZ = 0, order = 2) => {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
        mesh.position.set(x, y, z);
        mesh.rotation.z = rotZ;
        mesh.renderOrder = order;
        group.add(mesh);
        return mesh;
    };

    const addTrimBox = (w, h, d, x, y, z, mat = timberMat) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        return mesh;
    };

    const makeGableRoof = (width, depth, height, mat) => {
        const hw = width / 2;
        const hd = depth / 2;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([
            -hw, 0, -hd,
             hw, 0, -hd,
             hw, 0,  hd,
            -hw, 0,  hd,
            -hw, height, 0,
             hw, height, 0,
        ], 3));
        geometry.setIndex([
            0, 4, 5, 0, 5, 1,
            3, 2, 5, 3, 5, 4,
            0, 3, 4,
            1, 5, 2,
            0, 1, 2, 0, 2, 3,
        ]);
        geometry.computeVertexNormals();
        return new THREE.Mesh(geometry, mat);
    };

    const addGableRoof = (width, depth, height, x, y, z, mat = roofMat) => {
        const roof = makeGableRoof(width, depth, height, mat);
        roof.position.set(x, y, z);
        roof.castShadow = true;
        roof.receiveShadow = true;
        group.add(roof);
        addTrimBox(width + 0.8, 0.25, 0.42, x, y + 0.05, z + depth / 2 + 0.16, timberLightMat);
        return roof;
    };

    const makeFrontGableRoof = (width, depth, height, mat) => {
        const hw = width / 2;
        const hd = depth / 2;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([
            -hw, 0, -hd,
             hw, 0, -hd,
             hw, 0,  hd,
            -hw, 0,  hd,
             0, height, -hd,
             0, height,  hd,
        ], 3));
        geometry.setIndex([
            0, 3, 5, 0, 5, 4,
            1, 4, 5, 1, 5, 2,
            0, 4, 1,
            3, 2, 5,
            0, 1, 2, 0, 2, 3,
        ]);
        geometry.computeVertexNormals();
        return new THREE.Mesh(geometry, mat);
    };

    const addFrontGableRoof = (width, depth, height, x, y, z, mat = roofMat) => {
        const roof = makeFrontGableRoof(width, depth, height, mat);
        roof.position.set(x, y, z);
        roof.castShadow = true;
        roof.receiveShadow = true;
        group.add(roof);
        addTrimBox(width + 0.8, 0.25, 0.42, x, y + 0.05, z + depth / 2 + 0.16, timberLightMat);
        return roof;
    };

    const makeHippedRoof = (width, depth, height, mat) => {
        const hw = width / 2;
        const hd = depth / 2;
        const ridge = hw * 0.48;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([
            -hw, 0, -hd,
             hw, 0, -hd,
             hw, 0,  hd,
            -hw, 0,  hd,
            -ridge, height, 0,
             ridge, height, 0,
        ], 3));
        geometry.setIndex([
            0, 4, 5, 0, 5, 1,
            3, 2, 5, 3, 5, 4,
            0, 3, 4,
            1, 5, 2,
            0, 1, 2, 0, 2, 3,
        ]);
        geometry.computeVertexNormals();
        return new THREE.Mesh(geometry, mat);
    };

    const addHippedRoof = (width, depth, height, x, y, z, mat = roofMat) => {
        const roof = makeHippedRoof(width, depth, height, mat);
        roof.position.set(x, y, z);
        roof.castShadow = true;
        roof.receiveShadow = true;
        group.add(roof);
        addTrimBox(width + 0.65, 0.22, 0.36, x, y + 0.08, z + depth / 2 + 0.13, timberLightMat);
        return roof;
    };

    const addWindow = (x, y, z, w = 1.5, h = 2.4) => {
        addPlane(w + 0.38, h + 0.46, x, y, z, timberMat, 0, 2);
        addPlane(w + 0.2, h + 0.28, x, y, z + 0.015, frameMat, 0, 3);
        addPlane(w, h, x, y, z + 0.03, glassMat, 0, 4);
        addPlane(0.08, h, x, y, z + 0.045, timberMat, 0, 5);
        addPlane(w, 0.08, x, y, z + 0.05, timberMat, 0, 5);
        addPlane(w + 0.55, 0.16, x, y - h / 2 - 0.26, z + 0.04, timberLightMat, 0, 5);
    };

    const addTimberPattern = (x, y, z, width, height) => {
        addPlane(width, 0.22, x, y + height / 2, z, timberMat);
        addPlane(width, 0.22, x, y - height / 2, z, timberMat);
        addPlane(0.22, height, x - width / 2, y, z, timberMat);
        addPlane(0.22, height, x + width / 2, y, z, timberMat);
        addPlane(0.2, height * 1.08, x - width * 0.24, y, z + 0.012, timberMat, -0.34);
        addPlane(0.2, height * 1.08, x + width * 0.24, y, z + 0.012, timberMat, 0.34);
    };

    const addBody = (w, h, d, x, y, z) => {
        const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
        body.position.set(x, y, z);
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);
        return body;
    };

    const frontWingZ = -176.5;
    const leftGableZ = -174.2;
    const centerBlockZ = -181.3;
    const rightGableZ = -174.6;
    const porchZ = -171.7;
    const towerZ = -180.5;
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x8b5e3c, roughness: 0.82 });

    const addPlinth = (w, x, z, depth) => {
        addTrimBox(w, 0.55, 0.18, x, 0.28, frontZ(z, depth) + 0.06, plinthMat);
        addTrimBox(w, 0.08, 0.14, x, 0.58, frontZ(z, depth) + 0.05, timberMat);
    };
    const addCorners = (x1, x2, y, h, z) => {
        addTrimBox(0.2, h, 0.12, x1, y, z + 0.04, timberMat);
        addTrimBox(0.2, h, 0.12, x2, y, z + 0.04, timberMat);
    };
    const addBand = (w, x, y, z) => addTrimBox(w, 0.12, 0.12, x, y, z + 0.04, timberLightMat);
    const addGableFace = (x, baseY, z, w, h) => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute([-w/2,0,0, w/2,0,0, 0,h,0], 3));
        g.setIndex([0,1,2]); g.computeVertexNormals();
        const m = new THREE.Mesh(g, wallMat);
        m.position.set(x, baseY, z + 0.02); m.renderOrder = 1; group.add(m);
    };
    const addEnxaimel = (x, baseY, z, w, h) => {
        addTrimBox(w*0.82, 0.18, 0.12, x, baseY+0.12, z+0.08, timberMat);
        addTrimBox(0.18, h*0.82, 0.12, x, baseY+h*0.42, z+0.09, timberMat);
        addTrimBox(w*0.52, 0.14, 0.1, x, baseY+h*0.45, z+0.085, timberMat);
        const dr=h*0.72, dn=w*0.36, dl=Math.hypot(dn,dr), da=Math.atan2(dr,dn);
        const l=addTrimBox(dl,0.16,0.11,x-w*0.18,baseY+h*0.42,z+0.09,timberMat); l.rotation.z=da;
        const r=addTrimBox(dl,0.16,0.11,x+w*0.18,baseY+h*0.42,z+0.09,timberMat); r.rotation.z=-da;
        const sr2=h*0.28, sn2=w*0.18, sl2=Math.hypot(sn2,sr2), sa2=Math.atan2(sr2,sn2);
        const sl=addTrimBox(sl2,0.12,0.1,x-w*0.1,baseY+h*0.2,z+0.085,timberLightMat); sl.rotation.z=sa2;
        const sr=addTrimBox(sl2,0.12,0.1,x+w*0.1,baseY+h*0.2,z+0.085,timberLightMat); sr.rotation.z=-sa2;
    };
    const addWinGroup = (cx, y, z, count, w, h, spacing) => {
        const totalW = count*w + (count-1)*spacing;
        addTrimBox(totalW+0.5, 0.16, 0.1, cx, y+h/2+0.22, z+0.05, timberMat);
        addTrimBox(totalW+0.5, 0.16, 0.1, cx, y-h/2-0.22, z+0.05, timberMat);
        addTrimBox(0.16, h+0.44, 0.1, cx-totalW/2-0.22, y, z+0.05, timberMat);
        addTrimBox(0.16, h+0.44, 0.1, cx+totalW/2+0.22, y, z+0.05, timberMat);
        for (let i=0; i<count; i++) {
            const wx = cx - totalW/2 + w/2 + i*(w+spacing);
            addWindow(wx, y, z, w, h);
            if (i < count-1) addTrimBox(0.1, h+0.3, 0.1, wx+w/2+spacing/2, y, z+0.055, timberLightMat);
        }
    };

    // === Small connecting walls between blocks (behind, subtle) ===
    addBody(4.5, 5.0, 5.0, -22.0, 2.5, -176.2);
    addBody(4.5, 5.0, 5.0, -11.5, 2.5, -177.5);
    addBody(3.5, 5.0, 5.0, 1.5, 2.5, -177.5);
    addBody(3.5, 5.0, 5.0, 11.5, 2.5, -176.2);
    addBody(3.0, 5.0, 5.0, 23.5, 2.5, -176.5);

    // === LEFT GABLE BLOCK (front-facing gable) ===
    const fLG = frontZ(leftGableZ, 6.8);
    addBody(12.8, 8.2, 6.8, -28.0, 4.1, leftGableZ);
    addPlinth(12.4, -28.0, leftGableZ, 6.8);
    addGableFace(-28.0, 8.2, fLG, 13.8, 3.7);
    addEnxaimel(-28.0, 8.2, fLG, 12.0, 3.35);
    addFrontGableRoof(15.2, 8.4, 3.7, -28.0, 8.35, leftGableZ);
    addCorners(-33.8, -22.2, 4.1, 7.6, fLG);
    addBand(12.4, -28.0, 5.1, fLG);
    addWinGroup(-28.0, 3.75, fLG, 3, 1.05, 1.75, 0.8);
    addWindow(-28.0, 6.35, fLG, 0.82, 1.15);

    // === LEFT WING ===
    const fFW = frontZ(frontWingZ, 5.8);
    addBody(10.8, 5.45, 5.8, -17.1, 2.72, frontWingZ);
    addPlinth(10.4, -17.1, frontWingZ, 5.8);
    addGableRoof(12.2, 7.1, 2.35, -17.1, 5.62, frontWingZ);
    addCorners(-22.1, -12.1, 2.72, 5.0, fFW);
    addWinGroup(-17.1, 3.2, fFW, 3, 0.92, 1.7, 0.7);

    // === CENTER BLOCK (tall, 2 stories) ===
    const fCB = frontZ(centerBlockZ, 8.6);
    addBody(17.2, 12.6, 8.6, -4.2, 6.3, centerBlockZ);
    addPlinth(16.8, -4.2, centerBlockZ, 8.6);
    addHippedRoof(19.4, 10.2, 3.45, -4.2, 12.8, centerBlockZ);
    addCorners(-12.4, 4.0, 6.3, 12.0, fCB);
    addBand(16.4, -4.2, 8.2, fCB);
    addWinGroup(-4.2, 10.0, fCB, 5, 1.0, 1.65, 0.6);
    addWinGroup(-4.2, 5.05, fCB, 5, 1.05, 1.95, 0.55);

    // === RIGHT WING ===
    addBody(9.9, 5.45, 5.8, 6.9, 2.72, frontWingZ);
    addPlinth(9.5, 6.9, frontWingZ, 5.8);
    addGableRoof(11.2, 7.1, 2.35, 6.9, 5.62, frontWingZ);
    addCorners(2.3, 11.5, 2.72, 5.0, fFW);
    addWinGroup(6.9, 3.2, fFW, 3, 0.92, 1.7, 0.7);

    // === RIGHT GABLE BLOCK (front-facing gable) ===
    const fRG = frontZ(rightGableZ, 6.6);
    addBody(12.7, 7.9, 6.6, 17.5, 3.95, rightGableZ);
    addPlinth(12.3, 17.5, rightGableZ, 6.6);
    addGableFace(17.5, 7.9, fRG, 13.4, 3.45);
    addEnxaimel(17.5, 7.9, fRG, 11.8, 3.05);
    addFrontGableRoof(15.0, 8.2, 3.45, 17.5, 8.05, rightGableZ);
    addCorners(11.6, 23.4, 3.95, 7.4, fRG);
    addBand(12.2, 17.5, 4.9, fRG);
    addWinGroup(17.5, 3.65, fRG, 3, 1.0, 1.72, 0.8);
    addWindow(17.5, 5.85, fRG, 0.78, 1.12);

    // === FAR-RIGHT WING ===
    const fRW = frontZ(-176.8, 5.5);
    addBody(10.8, 5.4, 5.5, 25.2, 2.7, -176.8);
    addPlinth(10.4, 25.2, -176.8, 5.5);
    addGableRoof(12.0, 6.8, 2.25, 25.2, 5.55, -176.8);
    addCorners(20.2, 30.2, 2.7, 5.0, fRW);
    addWinGroup(25.2, 3.15, fRW, 3, 0.86, 1.58, 0.7);

    // === PORCH / ENTRANCE ===
    addBody(6.2, 4.25, 4.8, -2.2, 2.12, porchZ);
    addGableRoof(7.4, 5.5, 1.9, -2.2, 4.45, porchZ, towerRoofMat);
    addPlane(2.55, 2.95, -2.2, 1.72, frontZ(porchZ, 4.8) + 0.03, doorMat, 0, 4);
    addTrimBox(3.2, 0.16, 0.1, -2.2, 3.38, frontZ(porchZ, 4.8)+0.05, timberMat);
    addTrimBox(0.16, 3.4, 0.1, -3.5, 1.78, frontZ(porchZ, 4.8)+0.05, timberMat);
    addTrimBox(0.16, 3.4, 0.1, -0.9, 1.78, frontZ(porchZ, 4.8)+0.05, timberMat);
    addTrimBox(5.4, 0.22, 1.1, -2.2, 0.28, frontZ(porchZ, 4.8) + 0.85, mats.concrete);
    addTrimBox(4.6, 0.18, 0.9, -2.2, 0.12, frontZ(porchZ, 4.8) + 1.34, mats.concrete);
    addTrimBox(3.8, 0.16, 0.78, -2.2, -0.02, frontZ(porchZ, 4.8) + 1.76, mats.concrete);

    // === TOWER (preserved structure, enhanced X-pattern diagonals) ===
    addBody(6.0, 24.0, 5.8, 32.2, 12.0, towerZ);
    addBody(7.2, 5.0, 6.8, 32.2, 26.4, towerZ + 0.15);
    addHippedRoof(8.6, 8.2, 2.4, 32.2, 29.2, towerZ + 0.15, towerRoofMat);

    const towerFront = frontZ(towerZ, 5.8);
    for (const x of [29.55, 34.85]) addTrimBox(0.23, 23.8, 0.12, x, 13.4, towerFront + 0.045, timberMat);
    for (const x of [31.05, 33.35]) addTrimBox(0.13, 23.0, 0.1, x, 13.1, towerFront + 0.04, timberLightMat);
    for (const y of [1.2, 6.8, 12.6, 18.4, 24.1]) addTrimBox(5.2, 0.2, 0.12, 32.2, y, towerFront + 0.045, timberMat);
    for (const y of [4.0, 9.9, 15.7, 21.5]) addTrimBox(4.7, 0.11, 0.09, 32.2, y, towerFront + 0.05, timberLightMat);
    // X-pattern diagonals matching foto1/foto2 tower
    for (const [yB, yT] of [[6.8,12.6],[12.6,18.4],[18.4,24.1]]) {
        const rise=yT-yB, run=2.2, dl=Math.hypot(run,rise), da=Math.atan2(rise,run), cy=(yB+yT)/2;
        const d1=addTrimBox(dl,0.13,0.1,32.2,cy,towerFront+0.055,timberMat); d1.rotation.z=da;
        const d2=addTrimBox(dl,0.13,0.1,32.2,cy,towerFront+0.055,timberMat); d2.rotation.z=-da;
    }
    addWindow(32.2, 3.8, towerFront + 0.05, 0.9, 1.55);
    addWindow(32.2, 9.5, towerFront + 0.05, 0.9, 1.68);
    addWindow(32.2, 15.5, towerFront + 0.05, 0.9, 1.68);
    addWindow(32.2, 20.9, towerFront + 0.05, 0.86, 3.15);

    const upperTowerFront = frontZ(towerZ + 0.15, 6.8);
    addTrimBox(7.6, 0.34, 0.45, 32.2, 28.05, upperTowerFront + 0.03, timberMat);
    addTrimBox(6.3, 0.22, 0.22, 32.2, 24.05, upperTowerFront + 0.03, timberMat);
    for (const x of [29.85, 34.55]) addTrimBox(0.2, 4.1, 0.1, x, 26.2, upperTowerFront + 0.05, timberMat);
    addWindow(32.2, 25.75, upperTowerFront + 0.05, 1.08, 1.7);

    const spireBase = new THREE.Mesh(new THREE.ConeGeometry(7.1, 3.2, 4), towerRoofMat);
    spireBase.rotation.y = Math.PI / 4;
    spireBase.position.set(32.2, 31.3, towerZ + 0.15);
    spireBase.castShadow = true;
    group.add(spireBase);

    const spire = new THREE.Mesh(new THREE.ConeGeometry(4.2, 8.6, 4), towerRoofMat);
    spire.rotation.y = Math.PI / 4;
    spire.position.set(32.2, 36.75, towerZ + 0.15);
    spire.castShadow = true;
    group.add(spire);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 4.0, 8), timberMat);
    antenna.position.set(32.2, 42.9, towerZ + 0.15);
    group.add(antenna);

    group.position.z = 28;
    return group;
}

function addSceneryCluster(z) {
    const group = new THREE.Group();

    for (const side of [-1, 1]) {
        const treeCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < treeCount; i++) {
            const tree = createLowPolyTree();
            tree.position.set(
                side * (21 + Math.random() * 17),
                0,
                -18 + Math.random() * 16
            );
            tree.scale.multiplyScalar(0.74 + Math.random() * 0.34);
            registerGroundSpawn(tree);
            group.add(tree);
        }

        if (Math.random() > 0.2) {
            const bush = createBush();
            bush.position.set(side * (18 + Math.random() * 16), 0, -18 + Math.random() * 16);
            bush.scale.multiplyScalar(0.9 + Math.random() * 0.4);
            registerGroundSpawn(bush);
            group.add(bush);
        }

        if (Math.random() > 0.48) {
            const rock = createRock();
            rock.position.set(side * (18 + Math.random() * 14), 0, -18 + Math.random() * 16);
            rock.scale.multiplyScalar(0.8 + Math.random() * 0.35);
            registerGroundSpawn(rock);
            group.add(rock);
        }
    }

    group.position.z = z;
    world.add(group);
    scenery.push(group);
}

function addCloudCluster(z, index = 0) {
    const group = new THREE.Group();
    const cloudSlots = [-48, -34, -20, -7, 9, 21, 48];
    const cloudCount = index % 3 === 0 ? 2 : 1;
    for (let i = 0; i < cloudCount; i++) {
        const cloud = createLowPolyCloud();
        const slot = cloudSlots[(index + i * 3) % cloudSlots.length];
        cloud.position.set(
            slot + (Math.random() - 0.5) * 5,
            17.8 + Math.random() * 4.2 + i * 1.4,
            (Math.random() - 0.5) * 8
        );
        cloud.scale.multiplyScalar(0.48 + Math.random() * 0.22);
        group.add(cloud);
    }
    group.position.z = z;
    world.add(group);
    cloudScenery.push(group);
}
function createCampusBuilding(floors = 2) {
    const group = new THREE.Group();
    const palette = [
        [0xe6b98f, 0xc84538],
        [0xb9dce9, 0x1f8a45],
        [0xecc29c, 0xff8a38],
        [0xbfccea, 0x2b9cff],
    ][Math.floor(Math.random() * 4)];

    if (gameAssets.buildings.length) {
        const source = gameAssets.buildings[Math.floor(Math.random() * gameAssets.buildings.length)];
        const model = cloneStaticModel(source, {
            width: 6.8 + floors * 0.62,
            depth: 6.8 + floors * 0.54,
            height: 5.0 + floors * 1.62,
        });
        styleImportedBuilding(model, palette);
        model.rotation.y = Math.PI;
        group.add(model);
        return group;
    }

    const wall = new THREE.MeshStandardMaterial({
        color: palette[0],
        roughness: 0.86,
        map: mats.buildingWall.map,
        normalMap: mats.buildingWall.normalMap,
        normalScale: new THREE.Vector2(0.36, 0.36),
        roughnessMap: mats.buildingWall.roughnessMap,
    });
    const roof = cloneTintedMaterial(mats.roof, palette[1]);
    const body = new THREE.Mesh(new THREE.BoxGeometry(6.5, floors * 2.2, 6.2), wall);
    body.position.y = floors * 1.1;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.65, 7), roof);
    roofMesh.position.y = floors * 2.2 + 0.35;
    roofMesh.castShadow = true;
    group.add(roofMesh);

    for (let floor = 0; floor < floors; floor++) {
        for (const x of [-1.9, 1.9]) {
            const win = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.9), mats.glass);
            win.position.set(x, 1.15 + floor * 2.05, -3.12);
            group.add(win);

            const sill = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.12, 0.12), mats.white);
            sill.position.set(x, 0.62 + floor * 2.05, -3.18);
            sill.castShadow = true;
            group.add(sill);
        }
    }

    const door = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.8, 0.16), mats.green);
    door.position.set(0, 0.9, -3.22);
    door.castShadow = true;
    group.add(door);

    const awning = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.9), roof);
    awning.position.set(0, 2.02, -3.55);
    awning.rotation.x = -0.12;
    awning.castShadow = true;
    group.add(awning);

    [-3.3, 3.3].forEach(x => {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, floors * 2.0, 8), mats.black);
        pipe.position.set(x, floors, -3.26);
        pipe.castShadow = true;
        group.add(pipe);
    });
    return group;
}

function createTree() {
    const group = new THREE.Group();
    if (gameAssets.trees.length) {
        const source = gameAssets.trees[Math.floor(Math.random() * gameAssets.trees.length)];
        const model = cloneStaticModel(source, { height: 4.1 + Math.random() * 1.1 });
        model.rotation.y = Math.random() * Math.PI * 2;
        group.add(model);
        return group;
    }

    const barkMat = new THREE.MeshStandardMaterial({
        color: 0x986b42,
        map: treeBarkMap,
        roughness: 0.9,
    });
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.38, 2.45, 9),
        barkMat
    );
    trunk.position.y = 1.2;
    trunk.castShadow = true;
    group.add(trunk);

    const leafMat = new THREE.MeshStandardMaterial({
        color: 0x2fbf68,
        map: treeLeafMap,
        roughness: 0.78,
    });
    const top = new THREE.Mesh(new THREE.IcosahedronGeometry(1.65, 1), leafMat);
    top.position.y = 3.05;
    top.scale.set(1.15, 0.95, 1.15);
    top.castShadow = true;
    group.add(top);

    const small = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), leafMat);
    small.position.set(0.85, 2.45, 0.2);
    small.castShadow = true;
    group.add(small);

    const small2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 1), leafMat);
    small2.position.set(-0.85, 2.55, -0.25);
    small2.castShadow = true;
    group.add(small2);
    return group;
}

function createBush() {
    const group = new THREE.Group();
    if (gameAssets.bushes.length) {
        const source = gameAssets.bushes[Math.floor(Math.random() * gameAssets.bushes.length)];
        const model = cloneStaticModel(source, { height: 1.05 + Math.random() * 0.55 });
        model.rotation.y = Math.random() * Math.PI * 2;
        group.add(model);
        return group;
    }
    const bush = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.8, 1),
        new THREE.MeshStandardMaterial({ color: 0x2fbf68, map: treeLeafMap, roughness: 0.8 })
    );
    bush.position.y = 0.65;
    bush.castShadow = true;
    group.add(bush);
    return group;
}

function createRock() {
    const group = new THREE.Group();
    if (gameAssets.rocks.length) {
        const source = gameAssets.rocks[Math.floor(Math.random() * gameAssets.rocks.length)];
        const model = cloneStaticModel(source, { height: 0.85 + Math.random() * 0.45 });
        model.rotation.y = Math.random() * Math.PI * 2;
        group.add(model);
        return group;
    }
    const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.55, 0),
        new THREE.MeshStandardMaterial({ color: 0x8f8a7d, roughness: 0.92 })
    );
    rock.position.y = 0.42;
    rock.castShadow = true;
    group.add(rock);
    return group;
}

function createBanner(topic) {
    const group = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), mats.black);
    post.position.y = 1.55;
    group.add(post);

    const banner = new THREE.Mesh(
        new THREE.PlaneGeometry(1.55, 1.1),
        new THREE.MeshBasicMaterial({
            map: makeLabelTexture(topic.tag, '#' + topic.color.toString(16).padStart(6, '0')),
            transparent: true,
        })
    );
    banner.position.set(0, 2.55, 0.02);
    group.add(banner);
    return group;
}

function removeCharacterVisual(group) {
    const old = group.getObjectByName('character-style');
    if (old) old.removeFromParent();
}

function applyCharacterVisual(group) {
    removeCharacterVisual(group);
}

function createPlayer() {
    const group = new THREE.Group();
    group.position.set(0, 0, 5.2);

    if (gameAssets.player) {
        const root = clonePlayerModel();
        group.add(root);

        const mixer = new THREE.AnimationMixer(root);
        const actions = {};
        for (const clip of gameAssets.player.animations || []) {
            actions[clip.name] = mixer.clipAction(clip);
        }
        const shadow = new THREE.Mesh(
            new THREE.CircleGeometry(0.9, 32),
            new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.24 })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.025;
        scene.add(shadow);

        const shieldAura = new THREE.Mesh(
            new THREE.SphereGeometry(1.16, 28, 18),
            new THREE.MeshBasicMaterial({ color: 0x38f0c2, transparent: true, opacity: 0.24, depthWrite: false })
        );
        shieldAura.position.y = 1.75;
        shieldAura.visible = false;
        group.add(shieldAura);

        applyCharacterVisual(group);

        return {
            group,
            root,
            mixer,
            actions,
            currentAction: null,
            usesModel: true,
            shadow,
            shieldAura,
        };
    }

    const skin = new THREE.MeshStandardMaterial({ color: 0xf2bf88, roughness: 0.58 });
    const uniform = new THREE.MeshStandardMaterial({ color: 0x1f8a45, roughness: 0.58 });
    const pants = new THREE.MeshStandardMaterial({ color: 0x162640, roughness: 0.62 });
    const shoe = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.46 });
    const backpack = new THREE.MeshStandardMaterial({ color: 0xffc94a, roughness: 0.56 });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 1.1, 8, 14), uniform);
    body.position.y = 2.18;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 18), skin);
    head.position.y = 3.25;
    head.castShadow = true;
    group.add(head);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.58, 0.24, 20), mats.green);
    cap.position.y = 3.73;
    cap.castShadow = true;
    group.add(cap);

    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.46), mats.green);
    brim.position.set(0, 3.65, -0.45);
    brim.castShadow = true;
    group.add(brim);

    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.95, 0.34), backpack);
    pack.position.set(0, 2.25, 0.52);
    pack.castShadow = true;
    group.add(pack);

    const limbs = {};
    [['armL', -0.72, 2.28], ['armR', 0.72, 2.28]].forEach(([name, x, y]) => {
        const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.82, 6, 10), uniform);
        arm.position.set(x, y, 0);
        arm.rotation.z = x < 0 ? -0.26 : 0.26;
        arm.castShadow = true;
        group.add(arm);
        limbs[name] = arm;
    });

    [['legL', -0.32], ['legR', 0.32]].forEach(([name, x]) => {
        const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.92, 6, 10), pants);
        leg.position.set(x, 1.05, 0);
        leg.castShadow = true;
        group.add(leg);
        limbs[name] = leg;

        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.18, 0.72), shoe);
        foot.position.set(x, 0.48, -0.12);
        foot.castShadow = true;
        group.add(foot);
        limbs[name + 'Foot'] = foot;
    });

    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(0.95, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.025;
    scene.add(shadow);

    const shieldAura = new THREE.Mesh(
        new THREE.SphereGeometry(1.38, 28, 18),
        new THREE.MeshBasicMaterial({ color: 0x38f0c2, transparent: true, opacity: 0.24, depthWrite: false })
    );
    shieldAura.position.y = 2.0;
    shieldAura.visible = false;
    group.add(shieldAura);

    applyCharacterVisual(group);

    return { group, limbs, shadow, shieldAura };
}

function createFallbackPreview() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 1.15, 8, 14), mats.green);
    body.position.y = 1.95;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 16), new THREE.MeshStandardMaterial({ color: 0xf2bf88, roughness: 0.58 }));
    head.position.y = 2.95;
    head.castShadow = true;
    group.add(head);
    return group;
}

function centerObjectOnParentGround(object, parent) {
    if (!object || !parent) return;
    object.updateMatrixWorld(true);
    parent.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    const parentPosition = new THREE.Vector3();
    box.getCenter(center);
    parent.getWorldPosition(parentPosition);
    object.position.x -= center.x - parentPosition.x;
    object.position.y -= box.min.y - parentPosition.y;
    object.position.z -= center.z - parentPosition.z;
}

function normalizePreviewObject(object, parent) {
    if (!object || !parent) return;
    object.position.set(0, 0, 0);
    object.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const scaleCandidates = [];
    if (size.x > 0) scaleCandidates.push(1.9 / size.x);
    if (size.y > 0) scaleCandidates.push(3.18 / size.y);
    if (size.z > 0) scaleCandidates.push(1.85 / size.z);
    const scale = scaleCandidates.length ? Math.min(...scaleCandidates, 1.08) : 1;
    object.scale.multiplyScalar(scale);
    centerObjectOnParentGround(object, parent);
}

function createSelectorStage() {
    const stage = new THREE.Group();
    stage.name = 'selector-stage';
    stage.visible = false;
    const accentMeshes = [];

    const stageLight = new THREE.PointLight(0xffffff, 3.2, 9, 1.7);
    stageLight.position.set(0, 4.4, 5.1);
    stage.add(stageLight);

    const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(1.9, 2.05, 0.28, 56),
        new THREE.MeshStandardMaterial({ color: 0xf3e5cf, roughness: 0.82, metalness: 0.02 })
    );
    platform.position.set(0, 0.14, 2.15);
    platform.castShadow = true;
    platform.receiveShadow = true;
    stage.add(platform);

    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(1.93, 0.075, 12, 60),
        new THREE.MeshStandardMaterial({
            color: 0x26313a,
            emissive: 0x111820,
            emissiveIntensity: 0.04,
            roughness: 0.46,
        })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, 0.31, 2.15);
    stage.add(rim);
    accentMeshes.push(rim);

    const mark = new THREE.Mesh(
        new THREE.CircleGeometry(0.52, 32),
        new THREE.MeshStandardMaterial({ color: 0xe7d5bd, roughness: 0.72 })
    );
    mark.rotation.x = -Math.PI / 2;
    mark.position.set(0, 0.325, 2.15);
    stage.add(mark);

    const previewGroup = new THREE.Group();
    previewGroup.position.set(0, 0.32, 2.15);
    stage.add(previewGroup);

    stage.userData.preview = {
        group: previewGroup, root: null, mixer: null, asset: null,
        platform, rim, accentMeshes
    };

    scene.add(stage);
    return stage;
}

async function setPreviewCharacter() {
    const token = ++previewLoadToken;
    const preview = selectorStage.userData.preview;
    if (!preview) return;
    const character = getCurrentCharacter();
    const asset = await loadCharacterAsset(character.file);
    if (token !== previewLoadToken) return;
    if (!asset || preview.asset === asset) {
        if (preview.root) applyCustomizationToRoot(preview.root);
        updateCustomizeAvailability(preview.root);
        return;
    }
    if (preview.root) preview.group.remove(preview.root);
    preview.mixer = null;
    const root = clonePlayerModel(asset) || createFallbackPreview();
    root.rotation.y += Math.PI;
    preview.group.add(root);
    preview.root = root;
    preview.asset = asset;
    preview.mixer = new THREE.AnimationMixer(root);
    const idle = asset.animations?.find(clip => clip.name === 'Idle') || asset.animations?.[0];
    if (idle) {
        preview.mixer.clipAction(idle).play();
        preview.mixer.setTime(0.1);
    }
    normalizePreviewObject(root, preview.group);
    updateCustomizeAvailability(root);
}

async function activatePlayerCharacter() {
    const token = ++playerLoadToken;
    const character = getCurrentCharacter();
    const asset = await loadCharacterAsset(character.file);
    if (token !== playerLoadToken) return;
    if (!asset || !player.usesModel) return;
    if (player.root) player.group.remove(player.root);
    player.mixer?.stopAllAction();
    gameAssets.player = asset;
    player.root = clonePlayerModel(asset);
    player.group.add(player.root);
    player.mixer = new THREE.AnimationMixer(player.root);
    player.actions = {};
    for (const clip of asset.animations || []) {
        player.actions[clip.name] = player.mixer.clipAction(clip);
    }
    player.currentAction = null;
    playPlayerAction(state === 'running' ? 'Run' : 'Idle');
}

function isSecondaryGender(file) {
    return Boolean(GENDER_PAIRS[file]) && file.endsWith('_Female.gltf');
}

function isFemaleCharacter(file) {
    return file.endsWith('_Female.gltf') || [
        'Witch.gltf',
        'Chef_Female.gltf',
        'Cowboy_Female.gltf',
        'Pirate_Female.gltf',
        'Ninja_Sand_Female.gltf',
        'Knight_Golden_Female.gltf',
    ].includes(file);
}

function getPrimaryCharacterFile(file) {
    const pairFile = GENDER_PAIRS[file];
    return pairFile && isFemaleCharacter(file) ? pairFile : file;
}

function findCharacterIndexByFile(file) {
    return PRESETS.character.findIndex(character => character.file === file);
}

function findGenderVariantIndex(primaryFile, wantsFemale) {
    if (!wantsFemale) return findCharacterIndexByFile(primaryFile);
    const pairFile = GENDER_PAIRS[primaryFile];
    if (pairFile && isFemaleCharacter(pairFile)) {
        const pairIndex = findCharacterIndexByFile(pairFile);
        if (pairIndex >= 0) return pairIndex;
    }
    return findCharacterIndexByFile(primaryFile);
}

function updateGenderButton() {
    const character = getCurrentCharacter();
    const pair = GENDER_PAIRS[character.file];
    if (!pair) {
        customizeGenderRow.hidden = true;
        return;
    }
    customizeGenderRow.hidden = false;
    customizeGenderName.textContent = isFemaleCharacter(character.file) ? 'Feminino' : 'Masculino';
}

function updateCustomizeAvailability(root) {
    for (const [region, row] of Object.entries(customizeRows)) {
        if (!row) continue;
        row.hidden = Boolean(root) && countMatchingMats(root, MATERIAL_TARGETS[region]) === 0;
    }
}

function updateCharacterSelection({ syncPlayer = true } = {}) {
    const character = getCurrentCharacter();
    characterName.textContent = character.label;
    characterDesc.textContent = `${PRESETS.shirt[customIndex.shirt].label} - ${PRESETS.pants[customIndex.pants].label}`;
    customizeCharacterName.textContent = character.label;
    customizeSkinName.textContent = PRESETS.skin[customIndex.skin].label;
    customizeHairName.textContent = PRESETS.hair[customIndex.hair].label;
    customizeShirtName.textContent = PRESETS.shirt[customIndex.shirt].label;
    customizePantsName.textContent = PRESETS.pants[customIndex.pants].label;
    updateGenderButton();
    updateCustomizeAvailability(selectorStage.userData.preview?.root);
    setPreviewCharacter();
    if (player.root) applyCustomizationToRoot(player.root);
    if (syncPlayer) activatePlayerCharacter();
    saveCustomizeState();
}

function cycleCustomize(region, dir) {
    if (region === 'gender') {
        const pairFile = GENDER_PAIRS[getCurrentCharacter().file];
        if (!pairFile) return;
        const idx = PRESETS.character.findIndex(character => character.file === pairFile);
        if (idx >= 0) {
            customIndex.character = idx;
            updateCharacterSelection();
        }
        return;
    }
    const arr = PRESETS[region];
    if (!arr) return;
    if (region === 'character') {
        const currentFile = getCurrentCharacter().file;
        const wantsFemale = isFemaleCharacter(currentFile);
        const primaryIndex = findCharacterIndexByFile(getPrimaryCharacterFile(currentFile));
        let next = normalizeIndex((primaryIndex >= 0 ? primaryIndex : customIndex.character) + dir, arr.length);
        let guard = arr.length;
        while (isSecondaryGender(arr[next].file) && guard-- > 0) {
            next = normalizeIndex(next + dir, arr.length);
        }
        customIndex.character = findGenderVariantIndex(arr[next].file, wantsFemale);
        if (customIndex.character < 0) customIndex.character = next;
    } else {
        customIndex[region] = normalizeIndex(customIndex[region] + dir, arr.length);
    }
    updateCharacterSelection();
}

function updateSelectorStage(delta, t) {
    const visible = state === 'customize' || state === 'menu';
    selectorStage.visible = visible;
    if (!visible) return;
    const targetStageX = 0;
    selectorStage.position.x += (targetStageX - selectorStage.position.x) * (1 - Math.exp(-8 * delta));
    const preview = selectorStage.userData.preview;
    if (preview?.group) {
        const targetRotation = 0;
        const targetY = 0.32;
        preview.group.rotation.y += (targetRotation - preview.group.rotation.y) * (1 - Math.exp(-10 * delta));
        preview.group.position.y += (targetY - preview.group.position.y) * (1 - Math.exp(-10 * delta));
    }
}

function playPlayerAction(name, { fallback = 'Run', fade = 0.12 } = {}) {
    if (!player.usesModel) return;
    const action = player.actions[name] || player.actions[fallback] || player.actions.Idle;
    if (!action || player.currentAction === action) return;
    action.reset();
    action.enabled = true;
    const oneShot = action === player.actions.Roll || action === player.actions.Death || action === player.actions.Defeat;
    action.setLoop(oneShot ? THREE.LoopOnce : THREE.LoopRepeat, oneShot ? 1 : Infinity);
    action.clampWhenFinished = oneShot;
    action.fadeIn(fade);
    action.play();
    if (player.currentAction) player.currentAction.fadeOut(fade);
    player.currentAction = action;
    return action;
}

function createCoinObject({ bitcoin = false } = {}) {
    const group = new THREE.Group();
    const faceMap = makeCoinFaceTexture(
        bitcoin ? 'BTC' : 'IF',
        bitcoin ? '#b56b08' : '#ffd84a',
        bitcoin ? '#f7df8a' : '#1f8a45'
    );
    const edgeMat = new THREE.MeshStandardMaterial({
        color: bitcoin ? 0x7f4a08 : 0xd39a22,
        roughness: bitcoin ? 0.46 : 0.38,
        metalness: bitcoin ? 0.28 : 0.18,
    });
    const faceMat = new THREE.MeshStandardMaterial({
        color: bitcoin ? 0xd69a2c : 0xffffff,
        map: faceMap,
        roughness: bitcoin ? 0.38 : 0.28,
        metalness: bitcoin ? 0.18 : 0.12,
    });
    const coin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.64, 0.64, 0.16, 48, 1, false),
        [edgeMat, faceMat, faceMat.clone()]
    );
    coin.rotation.x = Math.PI / 2;
    coin.castShadow = true;
    coin.receiveShadow = true;
    group.add(coin);

    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.66, 0.045, 10, 48),
        new THREE.MeshStandardMaterial({
            color: bitcoin ? 0x9f5e08 : 0xffe08a,
            emissive: bitcoin ? 0x5c3200 : 0xffc94a,
            emissiveIntensity: bitcoin ? 0.06 : 0.08,
            roughness: bitcoin ? 0.42 : 0.3,
            metalness: bitcoin ? 0.2 : 0.1,
        })
    );
    rim.position.z = 0.09;
    group.add(rim);

    return group;
}

function createBookObject(topic) {
    const group = new THREE.Group();
    const coverColor = 0x1f8a45;
    const coverCss = '#1f8a45';
    const coverMat = new THREE.MeshStandardMaterial({
        color: coverColor,
        roughness: 0.42,
        metalness: 0.02,
    });
    const spineMat = new THREE.MeshStandardMaterial({
        color: 0x146133,
        roughness: 0.5,
        metalness: 0.02,
    });
    const outlineMat = new THREE.MeshStandardMaterial({
        color: 0x101411,
        roughness: 0.62,
        metalness: 0.0,
    });
    const pageMat = new THREE.MeshStandardMaterial({
        color: 0xfff4d2,
        roughness: 0.66,
        metalness: 0.0,
    });
    const edgeMat = new THREE.MeshStandardMaterial({
        color: 0xd7c49b,
        roughness: 0.72,
        metalness: 0.0,
    });

    const pages = new THREE.Mesh(new THREE.BoxGeometry(0.86, 1.08, 0.14), pageMat);
    pages.position.set(0.05, -0.01, 0);
    pages.castShadow = true;
    pages.receiveShadow = true;
    group.add(pages);

    const backOutline = new THREE.Mesh(new THREE.BoxGeometry(1.12, 1.32, 0.045), outlineMat);
    backOutline.position.z = -0.085;
    backOutline.castShadow = true;
    backOutline.receiveShadow = true;
    group.add(backOutline);

    const backCover = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.22, 0.05), coverMat.clone());
    backCover.position.z = -0.11;
    backCover.castShadow = true;
    backCover.receiveShadow = true;
    group.add(backCover);

    const frontOutline = new THREE.Mesh(new THREE.BoxGeometry(1.12, 1.32, 0.045), outlineMat);
    frontOutline.position.z = 0.085;
    frontOutline.castShadow = true;
    frontOutline.receiveShadow = true;
    group.add(frontOutline);

    const frontCover = new THREE.Mesh(new THREE.BoxGeometry(1.02, 1.22, 0.05), coverMat.clone());
    frontCover.position.z = 0.115;
    frontCover.castShadow = true;
    frontCover.receiveShadow = true;
    group.add(frontCover);

    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.26, 0.22), spineMat);
    spine.position.set(-0.52, 0, 0.01);
    spine.castShadow = true;
    spine.receiveShadow = true;
    group.add(spine);

    const addInkLine = (width, height, x, y) => {
        const line = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.035), outlineMat);
        line.position.set(x, y, 0.152);
        line.castShadow = true;
        group.add(line);
    };
    addInkLine(1.04, 0.045, 0, 0.62);
    addInkLine(1.04, 0.045, 0, -0.62);
    addInkLine(0.045, 1.22, 0.53, 0);
    addInkLine(0.045, 1.22, -0.53, 0);

    for (const y of [-0.34, 0, 0.34]) {
        const pageLine = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.018, 0.025), outlineMat);
        pageLine.position.set(0.1, y, 0.155);
        pageLine.castShadow = true;
        group.add(pageLine);
    }

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(0.66, 0.52),
        new THREE.MeshBasicMaterial({
            map: makeLabelTexture(topic?.tag || 'IF', coverCss),
            transparent: true,
            depthWrite: false,
        })
    );
    label.position.set(0.08, 0.08, 0.171);
    group.add(label);

    const bookmark = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.48, 0.025),
        new THREE.MeshStandardMaterial({ color: 0x93d26b, roughness: 0.45 })
    );
    bookmark.position.set(0.32, -0.45, 0.165);
    bookmark.castShadow = true;
    group.add(bookmark);

    group.rotation.z = -0.12;
    return group;
}

function createCollectible(topic, lane, z) {
    const group = new THREE.Group();
    const book = createBookObject(topic);
    group.add(book);

    group.position.set(LANES[lane], 1.1, z);
    group.userData.baseY = 1.1;
    group.userData.bobPhase = Math.random() * Math.PI * 2;
    group.userData.bobSpeed = 2.15;
    group.userData.bobHeight = 0.08;
    world.add(group);
    liveObjects.push({ type: 'collectible', topic, lane, group, radius: 1.15, hit: false });
}

function createPowerUp(lane, z) {
    const group = new THREE.Group();
    const bitcoin = createCoinObject({ bitcoin: true });
    bitcoin.scale.setScalar(1.12);
    group.add(bitcoin);

    const aura = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.76, 2.3, 28, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xb56b08, transparent: true, opacity: 0.1, depthWrite: false })
    );
    aura.position.y = 0.04;
    group.add(aura);

    group.position.set(LANES[lane], 1.1, z);
    group.userData.baseY = 1.1;
    group.userData.bobPhase = Math.random() * Math.PI * 2;
    group.userData.bobSpeed = 2.35;
    group.userData.bobHeight = 0.12;
    world.add(group);
    liveObjects.push({ type: 'power', lane, group, radius: 1.15, hit: false });
}

function createCueSign(text, color = '#d83c32') {
    const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(1.18, 0.72),
        new THREE.MeshBasicMaterial({ map: makeLabelTexture(text, color), transparent: true, depthWrite: false })
    );
    sign.position.set(0, 2.95, 0.16);
    sign.rotation.x = -0.16;
    return sign;
}

function addObstacleReadability(group, type) {
    const baseColor = type.kind === 'jump' ? 0xffc94a : type.kind === 'slide' ? 0x2b9cff : 0xff3b30;
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(type.kind === 'block' ? 1.18 : 1.34, 0.055, 8, 36),
        new THREE.MeshBasicMaterial({ color: baseColor, transparent: true, opacity: 0.86 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.075;
    group.add(ring);

    const hint = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.52),
        new THREE.MeshBasicMaterial({
            map: makeLabelTexture(type.cue, '#' + baseColor.toString(16).padStart(6, '0')),
            transparent: true,
            depthWrite: false,
        })
    );
    hint.rotation.x = -Math.PI / 2;
    hint.position.set(0, 0.082, -1.05);
    group.add(hint);
}

function createObstacle(type, lane, z) {
    const group = new THREE.Group();
    const orange = new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.5, metalness: 0.02 });
    const red = new THREE.MeshStandardMaterial({ color: 0xd83c32, roughness: 0.55, metalness: 0.02 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x2b9cff, roughness: 0.5, metalness: 0.03 });
    const black = new THREE.MeshStandardMaterial({ color: 0x151922, roughness: 0.58, metalness: 0.03 });
    const yellow = new THREE.MeshStandardMaterial({ color: 0xffc94a, roughness: 0.48, metalness: 0.02 });
    const white = new THREE.MeshStandardMaterial({ color: 0xfff7e8, roughness: 0.5, metalness: 0.01 });
    const wood = mats.crateWood.clone();

    const addMesh = (mesh, x, y, zPos, rotZ = 0) => {
        mesh.position.set(x, y, zPos);
        mesh.rotation.z = rotZ;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        return mesh;
    };

    const addCone = (x, zPos, scale = 1) => {
        const cone = addMesh(new THREE.Mesh(new THREE.ConeGeometry(0.32 * scale, 0.82 * scale, 20), orange), x, 0.43 * scale, zPos);
        const stripe = addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.24 * scale, 0.08 * scale, 20), white), x, 0.54 * scale, zPos);
        const base = addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.72 * scale, 0.1 * scale, 0.72 * scale), black), x, 0.05 * scale, zPos);
        return { cone, stripe, base };
    };

    if (type.id === 'trafficCones') {
        addCone(-0.68, -0.12, 1.08);
        addCone(0.0, 0.22, 0.96);
        addCone(0.68, -0.12, 1.08);
    } else if (type.id === 'lowBarrier') {
        [-0.86, 0.86].forEach(x => {
            addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.05, 0.18), black), x, 0.52, 0);
        });
        const plank = addMesh(new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.42, 0.22), mats.warningYellow.clone()), 0, 0.76, 0);
        for (let i = 0; i < 5; i++) {
            addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.48, 0.24), black), -0.78 + i * 0.39, 0.76, 0.02, 0.55);
        }
        plank.userData.kind = 'jump';
    } else if (type.id === 'cableRamp') {
        const cable = addMesh(new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.095, 10, 34), black), 0, 0.33, 0);
        cable.rotation.x = Math.PI / 2;
        cable.scale.set(1.25, 0.36, 0.36);
        const cable2 = cable.clone();
        cable2.position.set(0.18, 0.27, 0.18);
        cable2.rotation.z = 0.46;
        cable2.castShadow = true;
        group.add(cable2);
        addCone(-1.02, 0, 0.62);
        addCone(1.02, 0, 0.62);
    } else if (type.id === 'crateStack') {
        const boxes = [
            [-0.42, 0.42, 0, 0.08],
            [0.42, 0.42, 0.05, -0.06],
            [0, 1.18, -0.08, 0.03],
        ];
        boxes.forEach(([x, y, zPos, rot]) => {
            const box = addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.82, 0.82), wood), x, y, zPos, rot);
            const band = addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.08, 0.86), black), x, y + 0.08, zPos, rot);
            band.scale.z = 1.02;
            box.receiveShadow = true;
        });
    } else if (type.id === 'roadBlock') {
        const body = addMesh(new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.32, 0.56), mats.warningRed.clone()), 0, 0.72, 0);
        body.receiveShadow = true;
        [-0.54, 0, 0.54].forEach(x => {
            addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.12, 0.6), white), x, 0.72, 0.02, 0.32);
        });
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.18, 0.72), black), 0, 0.12, 0);
    } else if (type.id === 'overheadSign') {
        [-1.08, 1.08].forEach(x => {
            addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.36, 14), black), x, 1.18, 0);
        });
        const sign = addMesh(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.5, 0.3), blue), 0, 2.22, 0);
        const underside = addMesh(new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.12, 0.36), yellow), 0, 1.9, 0.02);
        for (let i = 0; i < 5; i++) {
            addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.58, 0.34), white), -0.78 + i * 0.39, 2.22, 0.17, 0.55);
        }
        sign.userData.kind = 'slide';
        underside.userData.kind = 'slide';
    }

    addObstacleReadability(group, type);
    group.position.set(LANES[lane], 0, z);
    world.add(group);
    liveObjects.push({
        type: 'obstacle',
        obstacleType: type,
        lane,
        group,
        hitbox: type.hitbox,
        hit: false,
    });
}

function spawnWave() {
    const z = -118;
    const blockedLane = Math.floor(Math.random() * 3);
    const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
    createObstacle(type, blockedLane, z);

    if (Math.random() > 0.56) {
        const secondLane = [0, 1, 2].filter(lane => lane !== blockedLane)[Math.floor(Math.random() * 2)];
        createObstacle(OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)], secondLane, z - 7);
    }
}

function isCollectibleSpotClear(lane, z, gap = 5.8) {
    return liveObjects.every(obj => {
        if (obj.type !== 'obstacle' || obj.lane !== lane) return true;
        return Math.abs(obj.group.position.z - z) >= gap;
    });
}

function findClearCollectibleLane(zValues) {
    return [0, 1, 2]
        .sort(() => Math.random() - 0.5)
        .find(lane => zValues.every(z => isCollectibleSpotClear(lane, z)));
}

function findClearCollectibleSpot(preferredLanes, zValues) {
    const lanes = [...preferredLanes].sort(() => Math.random() - 0.5);
    for (const lane of lanes) {
        const z = zValues.find(candidateZ => isCollectibleSpotClear(lane, candidateZ, 6.4));
        if (z !== undefined) return { lane, z };
    }
    return null;
}

function spawnCollectibles() {
    const startZ = -112;
    const bookZs = [0, -4, -8, -12].map(offset => startZ + offset);
    const lane = findClearCollectibleLane(bookZs);
    if (lane === undefined) return;
    const topic = COURSE_TOPICS[Math.floor(Math.random() * COURSE_TOPICS.length)];
    for (const z of bookZs) createCollectible(topic, lane, z);

    if (Math.random() > 0.72) {
        const powerSpot = findClearCollectibleSpot(
            [0, 1, 2].filter(candidateLane => candidateLane !== lane),
            [-106, -122, -130]
        );
        if (powerSpot) createPowerUp(powerSpot.lane, powerSpot.z);
    }
}

function clearRunObjects() {
    for (const obj of liveObjects.splice(0)) {
        obj.group.removeFromParent();
    }
    for (const spark of sparks.splice(0)) {
        spark.removeFromParent();
    }
    for (const popup of comboPopups.splice(0)) {
        popup.removeFromParent();
    }
}

function finishGroundSpawn(group) {
    for (const child of group.children) {
        const baseScale = child.userData.baseScale;
        if (!baseScale) continue;
        child.userData.growProgress = 1;
        child.scale.copy(baseScale);
        child.position.y = child.userData.baseY;
    }
}

function resetVisualWorldLoops() {
    roadSegments.forEach((segment, index) => {
        segment.position.z = -index * 34;
    });
    scenery.forEach((group, index) => {
        group.position.z = SCENERY_START_Z - index * SCENERY_SPACING;
        finishGroundSpawn(group);
    });
    cloudScenery.forEach((group, index) => {
        group.position.z = CLOUD_START_Z + index * CLOUD_SPACING;
    });
}

function resetPlayerRootTransform() {
    if (!player.root) return;
    const basePosition = player.root.userData.basePosition;
    const baseRotation = player.root.userData.baseRotation;
    if (basePosition) player.root.position.copy(basePosition);
    if (baseRotation) {
        player.root.rotation.copy(baseRotation);
    } else {
        player.root.rotation.set(0, Math.PI, 0);
    }
}

function keepPlayerRootAboveGround() {
    if (!player.root) return;
    player.root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(player.root);
    const groundY = player.group.position.y;
    if (box.min.y < groundY) {
        player.root.position.y += groundY - box.min.y;
    }
}

function updatePlayerRollPose(progress) {
    if (!player.root) return;
    const basePosition = player.root.userData.basePosition;
    const baseRotation = player.root.userData.baseRotation;
    if (basePosition) player.root.position.copy(basePosition);
    if (baseRotation) player.root.rotation.copy(baseRotation);

    const clamped = THREE.MathUtils.clamp(progress, 0, 1);
    const eased = clamped * clamped * (3 - 2 * clamped);
    const dive = Math.sin(clamped * Math.PI);
    const tuck = Math.sin(Math.min(1, clamped * 1.32) * Math.PI);
    const rebound = Math.sin(Math.max(0, clamped - 0.58) / 0.42 * Math.PI);

    player.root.rotation.x += -eased * Math.PI * 2 - dive * 0.18;
    player.root.rotation.z += Math.sin(clamped * Math.PI * 2) * 0.08;
    player.root.position.z += -dive * 0.62 + rebound * 0.16;
    player.root.position.y += -tuck * 0.42 + rebound * 0.2;
    keepPlayerRootAboveGround();
}

function setScoreFormSaved(saved) {
    scoreForm.dataset.saved = saved ? 'true' : 'false';
    scoreFormLabel.textContent = saved ? 'Ranking salvo com sucesso' : 'Nome para o ranking';
    playerNameInput.disabled = saved;
    scoreFormSubmit.disabled = saved;
}

function resetGame() {
    clearRunObjects();
    resetVisualWorldLoops();
    score = 0;
    distance = 0;
    runTime = 0;
    speed = GAMEPLAY.startSpeed;
    spawnTimer = 0.55;
    collectibleTimer = 0.3;
    shield = 0;
    multiplierTimer = 0;
    shake = 0;
    combo = 0;
    comboTimer = 0;
    savedCurrentScore = false;
    currentRunRank = null;
    setScoreFormSaved(false);
    rankingRefreshTimer = 0;
    startCameraIntro = 0;
    laneIndex = 1;
    targetLaneIndex = 1;
    playerVelocityY = 0;
    isSliding = false;
    isFastDropping = false;
    pendingGroundRoll = false;
    slideTimer = 0;
    slideElapsed = 0;
    slideVisualDuration = GAMEPLAY.slideDuration;
    rollRecoveryTimer = 0;
    topicCounts = Object.fromEntries(COURSE_TOPICS.map(topic => [topic.tag, 0]));
    player.group.position.set(0, 0, 5.2);
    player.group.rotation.set(0, 0, 0);
    player.group.scale.set(1, 1, 1);
    resetPlayerRootTransform();
    player.group.visible = true;
    selectorStage.visible = false;
    player.shadow.visible = true;
    player.shieldAura.visible = false;
    if (player.root) applyCustomizationToRoot(player.root);
    hudScore.textContent = '0';
}

function startGame() {
    rankingEditorEnabled = false;
    activeKeys.clear();
    resetGame();
    audioManager.play('bgm');
    audioManager.play('run');
    audioManager.startAmbient();
    state = 'running';
    startCameraIntro = START_CAMERA_INTRO_DURATION;
    playPlayerAction('Run');
    customizePanel.hidden = true;
    pausePanel.hidden = true;
    newRunConfirm.hidden = true;
    startScreen.hidden = true;
    startScreen.classList.remove('screen-open');
    gameOverScreen.hidden = true;
    updatePauseUi();
    renderRanking();
}

function requestRetry() {
    if (state !== 'gameover') {
        startGame();
        return;
    }
    newRunConfirm.hidden = false;
}

function endGame() {
    audioManager.stop('bgm');
    audioManager.stop('run');
    audioManager.stopAmbient();
    audioManager.play(score > bestScore ? 'record' : 'hit');
    state = 'gameover';
    isSliding = false;
    isFastDropping = false;
    pendingGroundRoll = false;
    slideTimer = 0;
    slideElapsed = 0;
    rollRecoveryTimer = 0;
    playerVelocityY = 0;
    player.group.rotation.z = 0;
    player.group.scale.set(1, 1, 1);
    resetPlayerRootTransform();
    if (player.usesModel) {
        playPlayerAction('Death', { fallback: 'Defeat', fade: 0.08 });
    }
    finalScore.textContent = String(Math.floor(score));
    finalTime.textContent = formatRankingTime(runTime);
    resultTitle.textContent = score > bestScore ? 'Novo recorde!' : 'Boa gameplay!';
    currentRunRank = getPotentialRankingPosition(Math.floor(score), Math.floor(runTime));
    scoreForm.hidden = currentRunRank === null;
    gameOverScreen.hidden = false;
    updatePauseUi();
    renderRanking();
    if (currentRunRank !== null) setTimeout(() => playerNameInput.focus(), 80);
}

function addScore(points) {
    const mult = multiplierTimer > 0 ? 2 : 1;
    score += points * mult;
    hudScore.textContent = String(Math.floor(score));
}

function showLearn(topic) {
    rankingPanel.dataset.lastTopic = topic.tag;
}

function makeSpark(x, y, z, color = 0xffffff, options = {}) {
    const spark = new THREE.Mesh(
        new THREE.SphereGeometry(options.size ?? 0.08, 8, 6),
        new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 1,
            depthWrite: false,
            depthTest: options.depthTest ?? true,
        })
    );
    spark.position.set(x, y, z);
    spark.renderOrder = options.renderOrder ?? 0;
    spark.userData.vel = options.velocity || new THREE.Vector3((Math.random() - 0.5) * 4, Math.random() * 2.4 + 0.8, (Math.random() - 0.5) * 4);
    spark.userData.life = options.life ?? 0.45;
    spark.userData.maxLife = spark.userData.life;
    spark.userData.gravity = options.gravity ?? 8;
    scene.add(spark);
    sparks.push(spark);
}

function burstAt(x, y, z, color) {
    for (let i = 0; i < 14; i++) makeSpark(x, y, z, color);
}

function collectBurstAt(x, y, z, color) {
    for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speedOut = 1.25 + Math.random() * 2.05;
        const sparkleColor = i % 3 === 0 ? 0xfff6c7 : color;
        makeSpark(x, y + 0.08, z, sparkleColor, {
            size: 0.08 + Math.random() * 0.032,
            life: 0.42 + Math.random() * 0.14,
            gravity: 4.4,
            depthTest: false,
            renderOrder: 8,
            velocity: new THREE.Vector3(
                Math.cos(angle) * speedOut,
                1.25 + Math.random() * 1.55,
                Math.sin(angle) * speedOut
            ),
        });
    }
}

function cloneMaterialForDestroy(material) {
    const cloned = material.clone();
    cloned.transparent = true;
    cloned.depthWrite = false;
    cloned.opacity = 1;
    return cloned;
}

function startShieldDestroy(obj) {
    obj.hit = true;
    obj.destroying = true;
    obj.destroyTimer = 0.48;
    obj.destroyDuration = obj.destroyTimer;
    obj.group.userData.destroyBaseScale = obj.group.scale.clone();
    obj.group.traverse(child => {
        if (!child.isMesh) return;
        child.material = Array.isArray(child.material)
            ? child.material.map(cloneMaterialForDestroy)
            : cloneMaterialForDestroy(child.material);
        child.userData.destroyVelocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2.2,
            1.15 + Math.random() * 1.55,
            (Math.random() - 0.5) * 2.2
        );
        child.userData.destroySpin = new THREE.Vector3(
            (Math.random() - 0.5) * 5.5,
            (Math.random() - 0.5) * 5.5,
            (Math.random() - 0.5) * 5.5
        );
    });
}

function updateShieldDestroy(obj, delta) {
    if (!obj.destroying) return false;
    obj.destroyTimer -= delta;
    const duration = obj.destroyDuration || 0.48;
    const progress = THREE.MathUtils.clamp(1 - obj.destroyTimer / duration, 0, 1);
    const fade = Math.max(0, 1 - progress);
    const baseScale = obj.group.userData.destroyBaseScale || new THREE.Vector3(1, 1, 1);
    obj.group.scale.copy(baseScale).multiplyScalar(1 - progress * 0.42);
    obj.group.position.y += delta * (0.75 + progress * 0.9);
    obj.group.rotation.y += delta * 3.8;
    obj.group.traverse(child => {
        if (!child.isMesh) return;
        const velocity = child.userData.destroyVelocity;
        const spin = child.userData.destroySpin;
        if (velocity) {
            velocity.y -= 2.8 * delta;
            child.position.addScaledVector(velocity, delta);
        }
        if (spin) {
            child.rotation.x += spin.x * delta;
            child.rotation.y += spin.y * delta;
            child.rotation.z += spin.z * delta;
        }
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(material => {
            if (material) material.opacity = fade;
        });
    });
    return obj.destroyTimer <= 0;
}

function showComboPopup(text, color = '#ffc94a') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 192);
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = 18;
    ctx.fillStyle = color;
    ctx.font = '900 72px Outfit, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 96);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.86)';
    ctx.lineWidth = 6;
    ctx.strokeText(text, 256, 96);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const popup = new THREE.Mesh(
        new THREE.PlaneGeometry(3.7, 1.38),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    popup.position.set(player.group.position.x, 3.9, player.group.position.z - 1.1);
    popup.userData.life = 0.72;
    scene.add(popup);
    comboPopups.push(popup);
}

function getPlayerHitbox() {
    const airborneSlide = slideTimer > 0 || isFastDropping;
    const halfX = GAMEPLAY.playerHalfX;
    const halfY = airborneSlide ? GAMEPLAY.slideHalfY : GAMEPLAY.playerHalfY;
    const halfZ = airborneSlide ? GAMEPLAY.slideHalfZ : GAMEPLAY.playerHalfZ;
    const centerY = player.group.position.y + (airborneSlide ? GAMEPLAY.slideCenterY : GAMEPLAY.playerCenterY);
    return {
        minX: player.group.position.x - halfX,
        maxX: player.group.position.x + halfX,
        minY: centerY - halfY,
        maxY: centerY + halfY,
        minZ: player.group.position.z - halfZ,
        maxZ: player.group.position.z + halfZ,
    };
}

function isPlayerGrounded() {
    return player.group.position.y <= 0.05 && Math.abs(playerVelocityY) < 0.01;
}

function beginGroundRoll() {
    if (isSliding || isFastDropping || pendingGroundRoll || slideTimer > 0 || rollRecoveryTimer > 0) return;
    audioManager.play('slide');
    pendingGroundRoll = false;
    isFastDropping = false;
    isSliding = true;
    slideTimer = GAMEPLAY.slideDuration;
    slideElapsed = 0;
    slideVisualDuration = Math.max(slideTimer, 0.82);
    rollRecoveryTimer = slideVisualDuration;
    playPlayerAction('Run', { fade: 0.05 });
}

function finishPendingGroundRoll() {
    audioManager.play('slide');
    pendingGroundRoll = false;
    isFastDropping = false;
    isSliding = true;
    slideTimer = GAMEPLAY.slideDuration;
    slideElapsed = 0;
    slideVisualDuration = Math.max(slideTimer, 0.82);
    rollRecoveryTimer = slideVisualDuration;
    playPlayerAction('Run', { fade: 0.05 });
}

function getObjectHitbox(obj) {
    const box = obj.hitbox;
    const y = obj.group.position.y || 0;
    return {
        minX: obj.group.position.x - box.halfX,
        maxX: obj.group.position.x + box.halfX,
        minY: y + box.centerY - box.halfY,
        maxY: y + box.centerY + box.halfY,
        minZ: obj.group.position.z - box.halfZ,
        maxZ: obj.group.position.z + box.halfZ,
    };
}

function intersectsBox(a, b, padding = 0) {
    return (
        a.minX < b.maxX - padding &&
        a.maxX > b.minX + padding &&
        a.minY < b.maxY - padding &&
        a.maxY > b.minY + padding &&
        a.minZ < b.maxZ - padding &&
        a.maxZ > b.minZ + padding
    );
}

function canObstacleHitPlayer(obj) {
    const relativeZ = obj.group.position.z - player.group.position.z;
    return relativeZ > -1.45 && relativeZ < 0.74;
}

function updateRunning(delta, t) {
    runTime += delta;
    distance += speed * delta;
    speed = Math.min(GAMEPLAY.maxSpeed, GAMEPLAY.startSpeed + runTime * GAMEPLAY.acceleration);
    addScore(delta * speed * 4);
    rankingRefreshTimer -= delta;
    if (rankingRefreshTimer <= 0) {
        renderRanking();
        rankingRefreshTimer = 0.18;
    }

    spawnTimer -= delta;
    collectibleTimer -= delta;
    if (comboTimer > 0) {
        comboTimer -= delta;
        if (comboTimer <= 0) combo = 0;
    }
    if (spawnTimer <= 0) {
        spawnWave();
        spawnTimer = Math.max(0.54, 1.26 - runTime * 0.011);
    }
    if (collectibleTimer <= 0) {
        spawnCollectibles();
        collectibleTimer = 1.7 + Math.random() * 0.8;
    }

    if (multiplierTimer > 0) multiplierTimer -= delta;
    if (shield > 0) shield -= delta;
    if (rollRecoveryTimer > 0) rollRecoveryTimer = Math.max(0, rollRecoveryTimer - delta);
    const targetX = LANES[targetLaneIndex];
    player.group.position.x += (targetX - player.group.position.x) * (1 - Math.exp(-GAMEPLAY.laneEase * delta));
    const wasAirborne = player.group.position.y > 0.05;
    player.group.position.y += playerVelocityY * delta;
    playerVelocityY -= GAMEPLAY.gravity * delta;
    if (player.group.position.y <= 0) {
        player.group.position.y = 0;
        playerVelocityY = 0;
        if (pendingGroundRoll) {
            finishPendingGroundRoll();
            burstAt(player.group.position.x, 0.22, player.group.position.z - 0.25, getCurrentAccentColor());
        } else if (isFastDropping || wasAirborne) {
            isFastDropping = false;
            slideTimer = Math.max(slideTimer, 0.18);
            if (wasAirborne) burstAt(player.group.position.x, 0.22, player.group.position.z - 0.25, getCurrentAccentColor());
        }
    }

    if (slideTimer > 0) {
        slideTimer -= delta;
        if (slideTimer <= 0) {
            isFastDropping = false;
            slideTimer = 0;
        }
    }
    if (isSliding) {
        slideElapsed = Math.min(slideVisualDuration, slideElapsed + delta);
        if (slideElapsed >= slideVisualDuration) {
            isSliding = false;
            isFastDropping = false;
            slideElapsed = 0;
            resetPlayerRootTransform();
        }
    }

    const runPhase = t * (8.4 + speed * 0.08);
    const swing = Math.sin(runPhase);
    player.group.rotation.z = (player.group.position.x - targetX) * -0.055;

    if (player.usesModel) {
        if (isSliding) {
            playPlayerAction('Run', { fade: 0.05 });
            const rollProgress = Math.min(1, slideElapsed / Math.max(0.001, slideVisualDuration));
            updatePlayerRollPose(rollProgress);
        } else if (player.group.position.y > 0.08 || playerVelocityY > 0.1) {
            playPlayerAction('Jump');
            player.root.rotation.x = THREE.MathUtils.lerp(player.root.rotation.x, 0, 1 - Math.exp(-8 * delta));
            if (Math.abs(player.root.rotation.x) < 0.01) resetPlayerRootTransform();
        } else {
            playPlayerAction('Run');
            player.root.rotation.x = THREE.MathUtils.lerp(player.root.rotation.x, 0, 1 - Math.exp(-8 * delta));
            if (Math.abs(player.root.rotation.x) < 0.01) resetPlayerRootTransform();
        }
    } else {
        player.limbs.armL.rotation.x = swing * 0.75;
        player.limbs.armR.rotation.x = -swing * 0.75;
        player.limbs.legL.rotation.x = -swing * 0.9;
        player.limbs.legR.rotation.x = swing * 0.9;
    }

    const bodySquash = isSliding ? 0.74 : 1;
    const scaleTarget = player.usesModel ? (isSliding ? 0.9 : 1) : bodySquash;
    player.group.scale.y += (scaleTarget - player.group.scale.y) * (1 - Math.exp(-12 * delta));
    player.shieldAura.visible = shield > 0;
    if (shield > 0) {
        const pulse = 1.06 + Math.sin(t * 8) * 0.08;
        player.shieldAura.scale.setScalar(pulse);
        player.shieldAura.material.opacity = 0.24 + Math.sin(t * 10) * 0.06;
    }
    player.shadow.position.set(player.group.position.x, 0.035, player.group.position.z);
    player.shadow.scale.setScalar(1 + player.group.position.y * -0.12);

    for (const segment of roadSegments) {
        segment.position.z += speed * delta;
        if (segment.position.z > 38) segment.position.z -= roadSegments.length * 34;
    }

    for (const obj of liveObjects) {
        obj.group.position.z += speed * delta;
        if (obj.type === 'collectible' || obj.type === 'power') {
            obj.group.rotation.y += delta * 2.8;
        } else if (obj.obstacleType?.id === 'trafficCones') {
            obj.group.position.y = Math.abs(Math.sin(t * 5 + obj.group.position.z)) * 0.025;
        } else if (obj.obstacleType?.kind === 'slide') {
            obj.group.rotation.y = Math.sin(t * 3.2 + obj.group.position.z) * 0.08;
        }
        if (obj.destroying) {
            if (updateShieldDestroy(obj, delta)) obj.destroyDone = true;
            continue;
        }
        if (obj.type === 'collectible' || obj.type === 'power') {
            const baseY = obj.group.userData.baseY ?? 1.1;
            const bobPhase = obj.group.userData.bobPhase ?? 0;
            const bobSpeed = obj.group.userData.bobSpeed ?? 2.2;
            const bobHeight = obj.group.userData.bobHeight ?? 0.1;
            obj.group.position.y = baseY + Math.sin(t * bobSpeed + bobPhase) * bobHeight;
        }
        if (obj.hit) continue;

        const dx = Math.abs(obj.group.position.x - player.group.position.x);
        const dz = Math.abs(obj.group.position.z - player.group.position.z);
        if (obj.type === 'collectible' && dx < 1.15 && dz < 1.15) {
            audioManager.play('coin');
            obj.hit = true;
            obj.group.visible = false;
            topicCounts[obj.topic.tag]++;
            combo++;
            comboTimer = 2.1;
            addScore(120 + Math.min(combo * 12, 140));
            showLearn(obj.topic);
            collectBurstAt(obj.group.position.x, 1.25, obj.group.position.z, 0x37b66a);
        } else if (obj.type === 'power' && dx < 1.15 && dz < 1.15) {
            audioManager.play('shieldUp');
            obj.hit = true;
            obj.group.visible = false;
            shield = 6;
            multiplierTimer = 5;
            combo++;
            comboTimer = 2.1;
            addScore(220);
            showComboPopup('BITCOIN!', '#f7931a');
            showLearn({ tag: 'DBG', title: 'Debug', copy: 'Programar tambem e testar, corrigir e melhorar.' });
            collectBurstAt(obj.group.position.x, 1.25, obj.group.position.z, 0xd08a20);
        } else if (obj.type === 'obstacle' && canObstacleHitPlayer(obj) && intersectsBox(getPlayerHitbox(), getObjectHitbox(obj), GAMEPLAY.collisionPadding)) {
            combo = 0;
            comboTimer = 0;
            if (shield > 0) {
                startShieldDestroy(obj);
                audioManager.play('shieldBreak');
                shield = 0;
                addScore(100);
                showComboPopup('ESCUDO!', '#20c997');
                burstAt(obj.group.position.x, 1.2, obj.group.position.z, 0x20c997);
            } else {
                obj.hit = true;
                shake = 0.75;
                burstAt(player.group.position.x, 1.2, player.group.position.z, 0xff4d4d);
                endGame();
                return;
            }
        }

        if (obj.type === 'obstacle' && !obj.hit && !obj.scoredDodge && obj.group.position.z > player.group.position.z + 1.15) {
            obj.scoredDodge = true;
            const closeDodge = Math.abs(obj.group.position.x - player.group.position.x) < 2.15;
            addScore(closeDodge ? 70 : 25);
            if (closeDodge) showComboPopup('DESVIO!', '#ffc94a');
        }
    }

    for (let i = liveObjects.length - 1; i >= 0; i--) {
        if (liveObjects[i].group.position.z > 18 || liveObjects[i].destroyDone || (liveObjects[i].hit && !liveObjects[i].destroying)) {
            liveObjects[i].group.removeFromParent();
            liveObjects.splice(i, 1);
        }
    }
}

function updateScenery(delta, currentSpeed = speed) {
    for (const group of scenery) {
        group.position.z += currentSpeed * SCENERY_SPEED_FACTOR * delta;
        if (group.position.z > SCENERY_RECYCLE_Z) {
            group.position.z -= SCENERY_LOOP_LENGTH;
            resetGroundSpawn(group);
        }
        updateGroundSpawn(group, delta);
    }
}

function updateCloudScenery(delta, currentSpeed = speed) {
    for (const group of cloudScenery) {
        group.position.z += currentSpeed * CLOUD_SPEED_FACTOR * delta;
        if (group.position.z > CLOUD_RECYCLE_Z) {
            group.position.z -= CLOUD_LOOP_LENGTH;
        }
    }
}

function updateSparks(delta) {
    for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.userData.life -= delta;
        spark.userData.vel.y -= (spark.userData.gravity ?? 8) * delta;
        spark.position.addScaledVector(spark.userData.vel, delta);
        spark.material.opacity = Math.max(0, spark.userData.life / (spark.userData.maxLife || 0.45));
        if (spark.userData.life <= 0) {
            spark.removeFromParent();
            sparks.splice(i, 1);
        }
    }
}

function updateComboPopups(delta) {
    for (let i = comboPopups.length - 1; i >= 0; i--) {
        const popup = comboPopups[i];
        popup.userData.life -= delta;
        popup.position.y += delta * 1.8;
        popup.position.z -= delta * 2.2;
        popup.lookAt(camera.position);
        popup.material.opacity = Math.max(0, popup.userData.life / 0.72);
        if (popup.userData.life <= 0) {
            popup.material.map?.dispose();
            popup.material.dispose();
            popup.removeFromParent();
            comboPopups.splice(i, 1);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const startIntroRatio = state === 'running' && startCameraIntro > 0
        ? Math.max(0, startCameraIntro / START_CAMERA_INTRO_DURATION)
        : 0;
    const startIntroEase = startIntroRatio * startIntroRatio * (3 - 2 * startIntroRatio);
    if (state === 'running' && startCameraIntro > 0) {
        startCameraIntro = Math.max(0, startCameraIntro - delta);
    }

    const visualSpeed = state === 'running' ? speed : 0;
    for (const segment of roadSegments) {
        if (state !== 'running' && visualSpeed > 0) {
            segment.position.z += visualSpeed * delta;
            if (segment.position.z > 38) segment.position.z -= roadSegments.length * 34;
        }
    }

    if (state === 'running') updateRunning(delta, t);
    if (state !== 'paused') {
        if (player.usesModel) player.mixer.update(delta);
        updateSelectorStage(delta, t);
        if (state === 'running') {
            updateScenery(delta, speed);
            updateCloudScenery(delta, speed);
        }
        updateSparks(delta);
        updateComboPopups(delta);
    }

    const customizeFocus = new THREE.Vector3(0, 2.08, 2.15);
    const menuFocus = new THREE.Vector3(0, 2.15, 2.15);
    let lookAt;
    let camTarget;
    if (state === 'customize') {
        lookAt = customizeFocus;
        camTarget = new THREE.Vector3(0, 4.35, 9.2);
    } else if (state === 'menu') {
        lookAt = menuFocus;
        camTarget = new THREE.Vector3(0, 5.05, 11.4);
    } else {
        lookAt = new THREE.Vector3(player.group.position.x * 0.28, 2.2 + player.group.position.y * 0.2, -10 + startIntroEase * 6.5);
        camTarget = new THREE.Vector3(
            player.group.position.x * 0.38,
            7.2 + player.group.position.y * 0.18 + startIntroEase * 1.25,
            15.5 + startIntroEase * 7.4
        );
    }
    if (shake > 0) {
        shake -= delta;
        camTarget.x += (Math.random() - 0.5) * shake * 0.55;
        camTarget.y += (Math.random() - 0.5) * shake * 0.3;
    }
    camera.position.lerp(camTarget, 1 - Math.exp(-5 * delta));
    camera.lookAt(lookAt);

    renderer.render(scene, camera);
}

function updatePauseUi() {
    const canPause = state === 'running' || state === 'paused';
    btnPause.hidden = !canPause;
    btnPause.textContent = state === 'paused' ? 'Continuar' : 'Pausar';
    pausePanel.hidden = state !== 'paused';
    hud.dataset.state = state;
    rankingPanel.dataset.state = state;
    document.getElementById('game-shell').dataset.state = state;
}

function pauseGame() {
    if (state !== 'running') return;
    audioManager.stop('run');
    audioManager.stopAmbient();
    state = 'paused';
    updatePauseUi();
    renderRanking();
}

function resumeGame() {
    if (state !== 'paused') return;
    audioManager.play('run');
    audioManager.startAmbient();
    state = 'running';
    clock.getDelta();
    playPlayerAction('Run');
    updatePauseUi();
    renderRanking();
}

function showMenu() {
    audioManager.stop('bgm');
    audioManager.stop('run');
    audioManager.stopAmbient();
    clearRunObjects();
    resetVisualWorldLoops();
    state = 'menu';
    activeKeys.clear();
    newRunConfirm.hidden = true;
    player.group.visible = false;
    player.shadow.visible = false;
    selectorStage.visible = true;
    pausePanel.hidden = true;
    customizePanel.hidden = true;
    gameOverScreen.hidden = true;
    startScreen.hidden = false;
    startScreen.classList.add('screen-open');
    updateCharacterSelection({ syncPlayer: false });
    updatePauseUi();
    renderRanking();
}

function moveLane(dir) {
    if (state !== 'running') return;
    const previousTarget = targetLaneIndex;
    targetLaneIndex = Math.max(0, Math.min(2, targetLaneIndex + dir));
    if (targetLaneIndex !== previousTarget) {
        audioManager.play('dodge');
    }
}

function jump() {
    if (state !== 'running') return;
    if (player.group.position.y <= 0.05) {
        audioManager.play('jump');
        playerVelocityY = GAMEPLAY.jumpVelocity;
        isSliding = false;
        isFastDropping = false;
        pendingGroundRoll = false;
        slideTimer = 0;
        slideElapsed = 0;
        resetPlayerRootTransform();
        playPlayerAction('Jump');
    }
}

function slide() {
    if (state !== 'running') return;
    if (!isPlayerGrounded()) {
        if (pendingGroundRoll || isFastDropping) return;
        pendingGroundRoll = true;
        isSliding = false;
        slideElapsed = 0;
        isFastDropping = true;
        playerVelocityY = Math.min(playerVelocityY, -GAMEPLAY.fastDropVelocity);
        slideTimer = Math.max(slideTimer, GAMEPLAY.airborneSlideDuration);
        resetPlayerRootTransform();
        playPlayerAction('Jump', { fade: 0.05 });
        audioManager.play('slide');
        return;
    }
    beginGroundRoll();
}

function openCustomize() {
    state = 'customize';
    newRunConfirm.hidden = true;
    startScreen.hidden = true;
    gameOverScreen.hidden = true;
    player.group.visible = false;
    player.shadow.visible = false;
    selectorStage.visible = true;
    pausePanel.hidden = true;
    customizePanel.hidden = false;
    updatePauseUi();
    updateCharacterSelection({ syncPlayer: false });
    renderRanking();
}

function closeCustomize() {
    state = 'menu';
    newRunConfirm.hidden = true;
    customizePanel.hidden = true;
    selectorStage.visible = false;
    player.group.visible = false;
    player.shadow.visible = false;
    pausePanel.hidden = true;
    startScreen.hidden = false;
    startScreen.classList.add('screen-open');
    updateCharacterSelection();
    updatePauseUi();
    renderRanking();
}

window.addEventListener('keydown', event => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    activeKeys.add(key);
    activeKeys.add(event.code.toLowerCase());
    if (state === 'menu' && activeKeys.has('b') && activeKeys.has('m') && (activeKeys.has('9') || activeKeys.has('digit9') || activeKeys.has('numpad9'))) {
        rankingEditorEnabled = !rankingEditorEnabled;
        renderRanking();
        return;
    }
    if (state === 'customize' && (key === 'arrowleft' || key === 'a')) {
        cycleCustomize('character', -1);
        return;
    }
    if (state === 'customize' && (key === 'arrowright' || key === 'd')) {
        cycleCustomize('character', 1);
        return;
    }
    if (key === 'escape' && state === 'customize') {
        event.preventDefault();
        closeCustomize();
        return;
    }
    if (key === 'escape' && state === 'running') {
        event.preventDefault();
        pauseGame();
        return;
    }
    if (key === 'escape' && state === 'paused') {
        event.preventDefault();
        resumeGame();
        return;
    }
    if (key === 'arrowleft' || key === 'a') moveLane(-1);
    if (key === 'arrowright' || key === 'd') moveLane(1);
    if (key === 'arrowup' || key === 'w' || key === ' ') {
        event.preventDefault();
        jump();
    }
    if (key === 'arrowdown' || key === 's') slide();
    if (key === 'enter' && state === 'menu') startGame();
});

window.addEventListener('keyup', event => {
    activeKeys.delete(event.key.toLowerCase());
    activeKeys.delete(event.code.toLowerCase());
});

let touchStart = null;
window.addEventListener('pointerdown', event => {
    touchStart = { x: event.clientX, y: event.clientY };
});

window.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (Math.max(ax, ay) < 18) {
        jump();
    } else if (ax > ay) {
        moveLane(dx > 0 ? 1 : -1);
    } else if (dy < 0) {
        jump();
    } else {
        slide();
    }
    touchStart = null;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

btnStart.addEventListener('click', startGame);
btnRetry.addEventListener('click', requestRetry);
btnMenu.addEventListener('click', showMenu);
btnPause.addEventListener('click', () => {
    if (state === 'paused') resumeGame();
    else pauseGame();
});
btnResume.addEventListener('click', resumeGame);
btnPauseMenu.addEventListener('click', showMenu);
btnConfirmRetry.addEventListener('click', startGame);
btnCancelRetry.addEventListener('click', () => {
    newRunConfirm.hidden = true;
});
rankingList.addEventListener('click', event => {
    const button = event.target.closest('.ranking-delete');
    if (!button) return;
    deleteRankingEntry(Number(button.dataset.rankingIndex));
});
btnCustomize.addEventListener('click', openCustomize);
customizeClose.addEventListener('click', closeCustomize);
customizeDone.addEventListener('click', closeCustomize);
document.querySelectorAll('[data-custom-region]').forEach(button => {
    button.addEventListener('click', () => {
        cycleCustomize(button.dataset.customRegion, Number(button.dataset.dir));
    });
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('customize')) {
    setTimeout(openCustomize, 900);
} else if (urlParams.has('autostart')) {
    setTimeout(() => {
        startGame();
        if (urlParams.has('pause')) setTimeout(pauseGame, 900);
    }, 600);
}

scoreForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (savedCurrentScore) return;
    if (currentRunRank === null) return;
    const name = playerNameInput.value.trim().toUpperCase() || 'ALUNO IF';
    savedCurrentScore = true;
    await saveScore({
        name,
        score: Math.floor(score),
        time: Math.floor(runTime),
    });
    playerNameInput.value = '';
    setScoreFormSaved(true);
    renderRanking();
});

function compareRankingEntries(a, b) {
    const scoreDiff = b.score - a.score;
    if (scoreDiff) return scoreDiff;
    const timeDiff = b.time - a.time;
    if (timeDiff) return timeDiff;
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return String(a.name).localeCompare(String(b.name));
}

function formatRankingTime(secondsValue) {
    const totalSeconds = Math.max(0, Math.floor(Number(secondsValue) || 0));
    if (totalSeconds < 60) return `${totalSeconds}seg`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds} min`;
}

function getPotentialRankingPosition(scoreValue, timeValue) {
    const candidate = {
        name: 'VOCE',
        score: Math.max(0, Math.floor(scoreValue)),
        time: Math.max(0, Math.floor(timeValue)),
        current: true,
    };
    const combined = [
        ...rankingCache.map(entry => ({ ...entry, current: false })),
        candidate,
    ].sort(compareRankingEntries);
    const index = combined.findIndex(entry => entry.current);
    return index >= 0 && index < 10 ? index + 1 : null;
}

function normalizeRanking(input) {
    const list = Array.isArray(input) ? input : Array.isArray(input?.ranking) ? input.ranking : [];
    return list
        .filter(entry => entry && Number.isFinite(Number(entry.score)))
        .map(entry => ({
            name: String(entry.name || 'ALUNO IF').slice(0, 14).toUpperCase(),
            score: Math.max(0, Math.floor(Number(entry.score))),
            time: Math.max(0, Math.floor(Number(entry.time || 0))),
        }))
        .sort(compareRankingEntries)
        .slice(0, 10);
}

function getStoredRanking() {
    try {
        return normalizeRanking(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
        return [];
    }
}

function getRanking() {
    return rankingCache;
}

function setRanking(nextRanking) {
    rankingCache = normalizeRanking(nextRanking);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rankingCache));
    } catch { }
    bestScore = rankingCache[0]?.score || 0;
    hudBest.textContent = String(bestScore);
}

async function syncRankingFromJson() {
    try {
        const response = await fetch(`${RANKING_ENDPOINT}?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        rankingUsesJson = true;
        const jsonRanking = normalizeRanking(payload);
        setRanking(jsonRanking);
    } catch {
        rankingUsesJson = false;
    }
}

async function persistRankingToJson() {
    try {
        const response = await fetch(RANKING_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ranking: rankingCache }, null, 2),
        });
        rankingUsesJson = response.ok;
    } catch {
        rankingUsesJson = false;
    }
}

async function saveScore(entry) {
    setRanking([...rankingCache, entry]);
    await persistRankingToJson();
}

async function deleteRankingEntry(index) {
    if (!rankingEditorEnabled || state !== 'menu') return;
    if (index < 0 || index >= rankingCache.length) return;
    setRanking(rankingCache.filter((_, itemIndex) => itemIndex !== index));
    await persistRankingToJson();
    renderRanking();
}

function renderRanking() {
    const ranking = getRanking();
    const liveMode = state === 'running' || state === 'paused';
    const limit = liveMode ? 5 : 10;
    rankingPanel.dataset.mode = liveMode ? 'live' : 'full';
    rankingPanel.dataset.editor = rankingEditorEnabled && state === 'menu' ? 'true' : 'false';
    rankingLimit.textContent = liveMode ? 'Top 5' : 'Top 10';

    let displayRanking;
    if (liveMode) {
        const currentRun = {
            name: 'VOCE',
            score: Math.floor(score),
            time: Math.floor(runTime),
            current: true,
        };
        const combined = [...ranking.map(entry => ({ ...entry, current: false })), currentRun].sort(compareRankingEntries);
        const currentIndex = combined.findIndex(entry => entry.current);
        if (currentIndex < limit) {
            displayRanking = combined.slice(0, limit).map((entry, index) => ({ ...entry, rank: index + 1 }));
        } else {
            displayRanking = [
                ...combined.filter(entry => !entry.current).slice(0, limit - 1).map((entry, index) => ({ ...entry, rank: index + 1 })),
                { ...currentRun, rank: limit },
            ];
        }
    } else {
        displayRanking = ranking.slice(0, limit).map((entry, index) => ({ ...entry, rank: index + 1, sourceIndex: index }));
    }

    rankingList.innerHTML = '';
    if (!displayRanking.length) return;
    for (const entry of displayRanking) {
        const li = document.createElement('li');
        if (entry.current) li.classList.add('current-run');
        const rank = document.createElement('span');
        rank.className = 'rank-number';
        rank.textContent = entry.rank;
        const name = document.createElement('span');
        name.append(document.createTextNode(entry.name));
        const scoreWrap = document.createElement('span');
        scoreWrap.className = 'score-time';
        const scoreEl = document.createElement('strong');
        scoreEl.textContent = entry.score;
        const timeEl = document.createElement('span');
        timeEl.className = 'time';
        timeEl.textContent = formatRankingTime(entry.time);
        scoreWrap.append(scoreEl, timeEl);
        const deleteButton = document.createElement('button');
        deleteButton.className = 'ranking-delete';
        deleteButton.type = 'button';
        deleteButton.textContent = 'X';
        deleteButton.dataset.rankingIndex = String(entry.sourceIndex ?? -1);
        deleteButton.setAttribute('aria-label', `Excluir ${entry.name}`);
        li.appendChild(rank);
        li.appendChild(name);
        li.appendChild(scoreWrap);
        li.appendChild(deleteButton);
        rankingList.appendChild(li);
    }
}
