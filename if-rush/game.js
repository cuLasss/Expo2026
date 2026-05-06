import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const mount = document.getElementById('game-canvas');
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
const btnRanking = document.getElementById('btn-ranking');
const rankingPanel = document.getElementById('ranking-panel');
const btnCloseRanking = document.getElementById('btn-close-ranking');
const btnClearRanking = document.getElementById('btn-clear-ranking');
const rankingList = document.getElementById('ranking-list');
const scoreForm = document.getElementById('score-form');
const playerNameInput = document.getElementById('player-name');
const finalScore = document.getElementById('final-score');
const finalTime = document.getElementById('final-time');
const finalArea = document.getElementById('final-area');
const resultTitle = document.getElementById('result-title');
const characterName = document.getElementById('character-name');
const characterDesc = document.getElementById('character-desc');
const btnCustomize = document.getElementById('btn-customize');
const customizePanel = document.getElementById('customize-panel');
const customizeClose = document.getElementById('customize-close');
const customizeDone = document.getElementById('customize-done');
const customizeGender = document.getElementById('customize-gender');
const customizeCharacterName = document.getElementById('customize-character-name');
const customizeSkinName = document.getElementById('customize-skin-name');
const customizeHairName = document.getElementById('customize-hair-name');
const customizeShirtName = document.getElementById('customize-shirt-name');
const customizePantsName = document.getElementById('customize-pants-name');

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
        { label: 'Personagem Base', file: 'BaseCharacter.gltf' },
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
    shirt: [['Topmat', 'Shirt', 'TShirt'], ['Clothes', 'Main'], ['Armor_Light']],
    pants: [['Pants', 'Bottommat'], ['Trousers', 'Shorts', 'Skirt', 'Bottom'], ['Armor_Dark', 'DarkClothes'], ['Black'], ['Main'], ['Clothes']],
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
scene.background = new THREE.Color(0x8fdcff);
scene.fog = new THREE.Fog(0x8fdcff, 48, 190);

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

const hemi = new THREE.HemisphereLight(0xffffff, 0x4f8c58, 1.65);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 2.4);
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

const rimLight = new THREE.DirectionalLight(0x7adfff, 0.62);
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
let slideTimer = 0;
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
let rankingCache = getStoredRanking();
let rankingUsesJson = false;
let bestScore = rankingCache[0]?.score || 0;
let topicCounts = Object.fromEntries(COURSE_TOPICS.map(topic => [topic.tag, 0]));
let customIndex = loadCustomizeState();
let previewLoadToken = 0;
let playerLoadToken = 0;

const liveObjects = [];
const roadSegments = [];
const scenery = [];
const sparks = [];
const comboPopups = [];
const labelTextureCache = new Map();
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
    const [playerResult, treeResults, bushResults, rockResults, buildingResults] = await Promise.all([
        loadCharacterAsset(initialCharacter).catch(err => {
            console.warn('[IF Rush] Player GLTF falhou, usando fallback procedural:', err);
            return null;
        }),
        Promise.all([
            'CommonTree_1.gltf',
            'CommonTree_3.gltf',
            'CommonTree_5.gltf',
            'Pine_2.gltf',
        ].map(file => loadGLTFAsset(NATURE_ROOT + file).catch(() => null))),
        Promise.all([
            'Bush_Common.gltf',
            'Bush_Common_Flowers.gltf',
            'Flower_3_Group.gltf',
        ].map(file => loadGLTFAsset(NATURE_ROOT + file).catch(() => null))),
        Promise.all([
            'Rock_Medium_1.gltf',
            'Rock_Medium_2.gltf',
            'Rock_Medium_3.gltf',
        ].map(file => loadGLTFAsset(NATURE_ROOT + file).catch(() => null))),
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
    gameAssets.trees = treeResults.filter(Boolean).map(item => item.scene);
    gameAssets.bushes = bushResults.filter(Boolean).map(item => item.scene);
    gameAssets.rocks = rockResults.filter(Boolean).map(item => item.scene);
    gameAssets.buildings = buildingResults.filter(Boolean);
}

hudBest.textContent = String(bestScore);

const treeBarkMap = makeNoiseTexture('#a37446', '#6c4328', 70, 512);
const treeLeafMap = makeNoiseTexture('#39c970', '#1d994e', 75, 512);

const mats = {
    road: makeAmbientMaterial('Asphalt022', 2.1, 9.5, { color: 0x9aa0a4, normalScale: 0.34, roughness: 0.82 }),
    sidewalk: makeAmbientMaterial('PavingStones092', 2.2, 12, { color: 0xf6e9d2, normalScale: 0.5, roughness: 0.9 }),
    grass: makeAmbientMaterial('Grass001', 12, 38, { color: 0x7bcf6a, normalScale: 0.42, roughness: 0.96 }),
    buildingWall: makeAmbientMaterial('Bricks097', 1.8, 3.2, { color: 0xf5e1c3, normalScale: 0.5, roughness: 0.88 }),
    roof: makeAmbientMaterial('RoofingTiles013A', 2.6, 2.6, { color: 0xc84e3f, normalScale: 0.52, roughness: 0.74 }),
    concrete: makeAmbientMaterial('Concrete032', 3.2, 3.2, { color: 0xf0eadf, normalScale: 0.35, roughness: 0.9 }),
    curb: makeAmbientMaterial('Concrete032', 1.2, 8, { color: 0xfffbeb, normalScale: 0.22, roughness: 0.9 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x9adcf4, roughness: 0.2, metalness: 0.02 }),
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
for (let i = 0; i < 34; i++) {
    addSceneryCluster(-18 - i * 13);
}
await syncRankingFromJson();
renderRanking();
updateCharacterSelection();
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

    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 2800; i++) {
        const x = (i * 73) % canvas.width;
        const y = (i * 131) % canvas.height;
        const shade = i % 4 ? '#ffffff' : '#162432';
        ctx.fillStyle = shade;
        ctx.fillRect(x, y, 2 + (i % 5), 1 + (i % 3));
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

    ctx.fillStyle = '#ffe36d';
    for (const x of [canvas.width * 0.365, canvas.width * 0.635]) {
        for (let y = -80; y < canvas.height + 140; y += 174) {
            roundedRect(ctx, x - 11, y, 22, 92, 11);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            roundedRect(ctx, x - 8, y + 8, 6, 70, 5);
            ctx.fill();
            ctx.fillStyle = '#ffe36d';
        }
    }

    ctx.fillStyle = '#fff9e8';
    ctx.fillRect(34, 0, 14, canvas.height);
    ctx.fillRect(canvas.width - 48, 0, 14, canvas.height);
    ctx.fillStyle = 'rgba(31, 138, 69, 0.9)';
    ctx.fillRect(0, 0, 10, canvas.height);
    ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);

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

function createTrack() {
    for (let i = 0; i < 8; i++) {
        const segment = new THREE.Group();
        const z = -i * 34;

        const grass = new THREE.Mesh(new THREE.PlaneGeometry(42, 36), mats.grass);
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

function createCampusGate() {
    const gate = new THREE.Group();
    const archMat = mats.concrete;
    const roofMat = cloneTintedMaterial(mats.roof, 0xc84538);

    [-7.6, 7.6].forEach(x => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 7.2, 1.2), archMat);
        pillar.position.set(x, 3.6, -18);
        pillar.castShadow = true;
        gate.add(pillar);
    });

    const top = new THREE.Mesh(new THREE.BoxGeometry(17, 1.2, 1.4), archMat);
    top.position.set(0, 7.1, -18);
    top.castShadow = true;
    gate.add(top);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(18.5, 0.55, 2.2), roofMat);
    roof.position.set(0, 8.05, -18);
    roof.castShadow = true;
    gate.add(roof);

    const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(5.6, 1.35),
        new THREE.MeshBasicMaterial({ map: makeLabelTexture('IF', '#1f8a45'), transparent: true })
    );
    sign.position.set(0, 7.08, -17.24);
    gate.add(sign);

    [-5.4, 5.4].forEach(x => {
        const planter = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.55, 1.0),
            new THREE.MeshStandardMaterial({ color: 0xf5d197, roughness: 0.78 })
        );
        planter.position.set(x, 0.28, -16.9);
        planter.castShadow = true;
        gate.add(planter);

        for (let i = 0; i < 4; i++) {
            const flower = new THREE.Mesh(
                new THREE.SphereGeometry(0.16, 10, 8),
                new THREE.MeshBasicMaterial({ color: i % 2 ? 0xff5d8f : 0xffc94a })
            );
            flower.position.set(x - 0.75 + i * 0.5, 0.72, -16.9 + (i % 2) * 0.18);
            gate.add(flower);
        }
    });

    scene.add(gate);
}

function addSceneryCluster(z) {
    const group = new THREE.Group();
    const side = z % 24 === 0 ? -1 : 1;
    const xBase = side * (13 + Math.random() * 4);

    const building = createCampusBuilding(2 + Math.floor(Math.random() * 3));
    building.position.set(xBase + side * 3, 0, -4);
    building.rotation.y = side > 0 ? -0.14 : 0.14;
    group.add(building);

    const treeA = createTree();
    treeA.position.set(-side * (12 + Math.random() * 3), 0, 6);
    group.add(treeA);

    const treeB = createTree();
    treeB.position.set(-side * (15 + Math.random() * 2), 0, -8);
    treeB.scale.setScalar(0.8 + Math.random() * 0.28);
    group.add(treeB);

    const bush = createBush();
    bush.position.set(side * 8.4, 0, -12);
    group.add(bush);

    if (Math.random() > 0.44) {
        const rock = createRock();
        rock.position.set(-side * (8.8 + Math.random() * 2), 0, -3);
        group.add(rock);
    }

    const banner = createBanner(COURSE_TOPICS[Math.floor(Math.random() * COURSE_TOPICS.length)]);
    banner.position.set(side * 8.2, 1.7, 10);
    banner.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    group.add(banner);

    group.position.z = z;
    world.add(group);
    scenery.push(group);
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
            new THREE.SphereGeometry(1.08, 28, 18),
            new THREE.MeshBasicMaterial({ color: 0x20c997, transparent: true, opacity: 0.18, depthWrite: false })
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
        new THREE.SphereGeometry(1.28, 28, 18),
        new THREE.MeshBasicMaterial({ color: 0x20c997, transparent: true, opacity: 0.18, depthWrite: false })
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

function createSelectorStage() {
    const stage = new THREE.Group();
    stage.name = 'selector-stage';
    stage.visible = false;
    const accentMeshes = [];

    const floor = new THREE.Mesh(new THREE.CircleGeometry(6.2, 64), mats.sidewalk);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0.05, 2.15);
    floor.receiveShadow = true;
    stage.add(floor);

    const rim = new THREE.Mesh(
        new THREE.TorusGeometry(6.2, 0.055, 8, 80),
        new THREE.MeshBasicMaterial({ color: getCurrentAccentColor(), transparent: true, opacity: 0.78 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, 0.08, 2.15);
    stage.add(rim);
    accentMeshes.push(rim);

    const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(1.15, 1.38, 0.3, 36),
        cloneTintedMaterial(mats.concrete, 0xf7ead2)
    );
    platform.position.set(0, 0.18, 2.15);
    platform.castShadow = true;
    platform.receiveShadow = true;
    stage.add(platform);

    const stageLight = new THREE.PointLight(0xffffff, 3.2, 9, 1.7);
    stageLight.position.set(0, 4.4, 5.1);
    stage.add(stageLight);

    [-3.1, 3.1].forEach(x => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.1, 12), mats.black);
        pole.position.set(x, 1.05, 1.15);
        pole.castShadow = true;
        stage.add(pole);

        const lamp = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 16, 12),
            new THREE.MeshBasicMaterial({ color: getCurrentAccentColor(), transparent: true, opacity: 0.9 })
        );
        lamp.position.set(x, 2.2, 1.15);
        stage.add(lamp);
        accentMeshes.push(lamp);

        const beam = new THREE.Mesh(
            new THREE.ConeGeometry(0.78, 2.7, 24, 1, true),
            new THREE.MeshBasicMaterial({ color: getCurrentAccentColor(), transparent: true, opacity: 0.1, depthWrite: false })
        );
        beam.position.set(x * 0.58, 1.26, 1.72);
        beam.rotation.z = x > 0 ? -0.34 : 0.34;
        stage.add(beam);
        accentMeshes.push(beam);
    });

    const previewGroup = new THREE.Group();
    previewGroup.position.set(0, 0.35, 2.15);
    stage.add(previewGroup);
    stage.userData.preview = { group: previewGroup, root: null, mixer: null, asset: null, platform, rim, accentMeshes };

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
        return;
    }
    if (preview.root) preview.group.remove(preview.root);
    preview.mixer = null;
    const root = clonePlayerModel(asset) || createFallbackPreview();
    root.rotation.y += Math.PI;
    root.scale.multiplyScalar(0.92);
    preview.group.add(root);
    preview.root = root;
    preview.asset = asset;
    preview.mixer = new THREE.AnimationMixer(root);
    const idle = asset.animations?.find(clip => clip.name === 'Idle') || asset.animations?.[0];
    if (idle) preview.mixer.clipAction(idle).play();
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

function updateGenderButton() {
    const character = getCurrentCharacter();
    const pair = GENDER_PAIRS[character.file];
    if (!pair) {
        customizeGender.hidden = true;
        return;
    }
    customizeGender.hidden = false;
    customizeGender.textContent = character.file.endsWith('_Female.gltf') ? 'Sexo: Feminino' : 'Sexo: Masculino';
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
    selectorStage.userData.preview?.accentMeshes?.forEach(mesh => mesh.material?.color?.setHex(getCurrentAccentColor()));
    setPreviewCharacter();
    if (player.root) applyCustomizationToRoot(player.root);
    if (syncPlayer) activatePlayerCharacter();
    saveCustomizeState();
}

function cycleCustomize(region, dir) {
    const arr = PRESETS[region];
    if (!arr) return;
    if (region === 'character') {
        let next = normalizeIndex(customIndex.character + dir, arr.length);
        let guard = arr.length;
        while (isSecondaryGender(arr[next].file) && guard-- > 0) {
            next = normalizeIndex(next + dir, arr.length);
        }
        customIndex.character = next;
    } else {
        customIndex[region] = normalizeIndex(customIndex[region] + dir, arr.length);
    }
    updateCharacterSelection();
}

function updateSelectorStage(delta, t) {
    const visible = state === 'customize' || state === 'menu';
    selectorStage.visible = visible;
    if (!visible) return;
    const targetStageX = state === 'menu' ? 3.05 : 0;
    selectorStage.position.x += (targetStageX - selectorStage.position.x) * (1 - Math.exp(-8 * delta));
    const preview = selectorStage.userData.preview;
    preview?.mixer?.update(delta);
    if (preview?.group) {
        preview.group.rotation.y = Math.sin(t * 1.15) * 0.18;
        preview.group.position.y = 0.35 + Math.sin(t * 2.2) * 0.035;
    }
}

function playPlayerAction(name) {
    if (!player.usesModel) return;
    const action = player.actions[name] || player.actions.Run || player.actions.Idle;
    if (!action || player.currentAction === action) return;
    action.reset();
    action.enabled = true;
    action.fadeIn(0.12);
    action.play();
    if (player.currentAction) player.currentAction.fadeOut(0.12);
    player.currentAction = action;
}

function createCollectible(topic, lane, z) {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
        color: topic.color,
        emissive: topic.color,
        emissiveIntensity: 0.36,
        roughness: 0.22,
        metalness: 0.08,
    });
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.64, 1), mat);
    gem.castShadow = true;
    group.add(gem);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.86, 0.045, 8, 34),
        new THREE.MeshBasicMaterial({ color: topic.color, transparent: true, opacity: 0.74 })
    );
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.46, 0.68, 2.8, 24, 1, true),
        new THREE.MeshBasicMaterial({ color: topic.color, transparent: true, opacity: 0.16, depthWrite: false })
    );
    beam.position.y = 0.22;
    group.add(beam);

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(1.05, 1.05),
        new THREE.MeshBasicMaterial({
            map: makeLabelTexture(topic.tag, '#' + topic.color.toString(16).padStart(6, '0')),
            transparent: true,
        })
    );
    label.position.y = 1.15;
    label.rotation.x = -0.22;
    group.add(label);

    const collectSign = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 0.48),
        new THREE.MeshBasicMaterial({ map: makeLabelTexture('PEGUE', '#20c997'), transparent: true })
    );
    collectSign.position.y = -0.42;
    collectSign.rotation.x = -0.28;
    group.add(collectSign);

    group.position.set(LANES[lane], 1.1, z);
    world.add(group);
    liveObjects.push({ type: 'collectible', topic, lane, group, radius: 1.15, hit: false });
}

function createPowerUp(lane, z) {
    const group = new THREE.Group();
    const shieldMat = new THREE.MeshStandardMaterial({
        color: 0x20c997,
        emissive: 0x20c997,
        emissiveIntensity: 0.24,
        roughness: 0.26,
    });
    const shieldMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.78, 1), shieldMat);
    shieldMesh.castShadow = true;
    group.add(shieldMesh);

    const halo = new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.055, 8, 36),
        new THREE.MeshBasicMaterial({ color: 0x20c997, transparent: true, opacity: 0.76 })
    );
    halo.rotation.x = Math.PI / 2;
    group.add(halo);

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(1.1, 1.1),
        new THREE.MeshBasicMaterial({ map: makeLabelTexture('POWER', '#20c997'), transparent: true })
    );
    label.position.y = 1.22;
    group.add(label);

    group.position.set(LANES[lane], 1.1, z);
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

function spawnCollectibles() {
    const unsafeLanes = new Set(
        liveObjects
            .filter(obj => obj.type === 'obstacle' && obj.group.position.z < -82 && obj.group.position.z > -132)
            .map(obj => obj.lane)
    );
    const safeLanes = [0, 1, 2].filter(lane => !unsafeLanes.has(lane));
    const lanePool = safeLanes.length ? safeLanes : [0, 1, 2];
    const lane = lanePool[Math.floor(Math.random() * lanePool.length)];
    const topic = COURSE_TOPICS[Math.floor(Math.random() * COURSE_TOPICS.length)];
    const z = -112;
    for (let i = 0; i < 4; i++) {
        createCollectible(topic, lane, z - i * 4);
    }
    if (Math.random() > 0.72) createPowerUp((lane + 1 + Math.floor(Math.random() * 2)) % 3, z - 10);
}

function resetGame() {
    for (const obj of liveObjects.splice(0)) {
        obj.group.removeFromParent();
    }
    for (const spark of sparks.splice(0)) {
        spark.removeFromParent();
    }
    for (const popup of comboPopups.splice(0)) {
        popup.removeFromParent();
    }
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
    laneIndex = 1;
    targetLaneIndex = 1;
    playerVelocityY = 0;
    isSliding = false;
    isFastDropping = false;
    slideTimer = 0;
    topicCounts = Object.fromEntries(COURSE_TOPICS.map(topic => [topic.tag, 0]));
    player.group.position.set(0, 0, 5.2);
    player.group.rotation.set(0, 0, 0);
    player.group.scale.set(1, 1, 1);
    player.group.visible = true;
    selectorStage.visible = false;
    player.shadow.visible = true;
    player.shieldAura.visible = false;
    if (player.root) applyCustomizationToRoot(player.root);
    hudScore.textContent = '0';
}

function startGame() {
    resetGame();
    state = 'running';
    playPlayerAction('Run');
    customizePanel.hidden = true;
    pausePanel.hidden = true;
    startScreen.hidden = true;
    startScreen.classList.remove('screen-open');
    gameOverScreen.hidden = true;
    rankingPanel.hidden = true;
    updatePauseUi();
}

function endGame() {
    state = 'gameover';
    finalScore.textContent = String(Math.floor(score));
    finalTime.textContent = Math.floor(runTime) + 's';
    const topArea = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'WEB';
    finalArea.textContent = topArea;
    resultTitle.textContent = score > bestScore ? 'Novo recorde!' : 'Boa gameplay!';
    gameOverScreen.hidden = false;
    updatePauseUi();
    setTimeout(() => playerNameInput.focus(), 80);
}

function addScore(points) {
    const mult = multiplierTimer > 0 ? 2 : 1;
    score += points * mult;
    hudScore.textContent = String(Math.floor(score));
}

function showLearn(topic) {
    finalArea.dataset.lastTopic = topic.tag;
}

function makeSpark(x, y, z, color = 0xffffff) {
    const spark = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 6),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 })
    );
    spark.position.set(x, y, z);
    spark.userData.vel = new THREE.Vector3((Math.random() - 0.5) * 4, Math.random() * 2.4 + 0.8, (Math.random() - 0.5) * 4);
    spark.userData.life = 0.45;
    scene.add(spark);
    sparks.push(spark);
}

function burstAt(x, y, z, color) {
    for (let i = 0; i < 14; i++) makeSpark(x, y, z, color);
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
    const airborneSlide = isSliding || isFastDropping;
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

function updateRunning(delta, t) {
    runTime += delta;
    distance += speed * delta;
    speed = Math.min(GAMEPLAY.maxSpeed, GAMEPLAY.startSpeed + runTime * GAMEPLAY.acceleration);
    addScore(delta * speed * 4);

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
    const targetX = LANES[targetLaneIndex];
    player.group.position.x += (targetX - player.group.position.x) * (1 - Math.exp(-GAMEPLAY.laneEase * delta));
    const wasAirborne = player.group.position.y > 0.05;
    player.group.position.y += playerVelocityY * delta;
    playerVelocityY -= GAMEPLAY.gravity * delta;
    if (player.group.position.y <= 0) {
        player.group.position.y = 0;
        playerVelocityY = 0;
        if (isFastDropping || wasAirborne) {
            isFastDropping = false;
            slideTimer = Math.max(slideTimer, 0.18);
            if (wasAirborne) burstAt(player.group.position.x, 0.22, player.group.position.z - 0.25, getCurrentAccentColor());
        }
    }

    if (slideTimer > 0) {
        slideTimer -= delta;
        if (slideTimer <= 0) {
            isSliding = false;
            isFastDropping = false;
        }
    }

    const runPhase = t * (8.4 + speed * 0.08);
    const swing = Math.sin(runPhase);
    player.group.rotation.z = (player.group.position.x - targetX) * -0.055;

    if (player.usesModel) {
        if (isSliding) playPlayerAction('Roll');
        else if (player.group.position.y > 0.08 || playerVelocityY > 0.1) playPlayerAction('Jump');
        else playPlayerAction('Run');
        player.root.rotation.x = isSliding ? -0.2 : THREE.MathUtils.lerp(player.root.rotation.x, 0, 1 - Math.exp(-8 * delta));
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
        const pulse = 1 + Math.sin(t * 8) * 0.06;
        player.shieldAura.scale.setScalar(pulse);
        player.shieldAura.material.opacity = 0.14 + Math.sin(t * 10) * 0.04;
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
        if (obj.type === 'collectible' || obj.type === 'power') {
            obj.group.position.y = 1.12 + Math.sin(t * 4 + obj.group.position.z) * 0.16;
        }
        if (obj.hit) continue;

        const dx = Math.abs(obj.group.position.x - player.group.position.x);
        const dz = Math.abs(obj.group.position.z - player.group.position.z);
        if (obj.type === 'collectible' && dx < 1.15 && dz < 1.15) {
            obj.hit = true;
            obj.group.visible = false;
            topicCounts[obj.topic.tag]++;
            combo++;
            comboTimer = 2.1;
            addScore(120 + Math.min(combo * 12, 140));
            if (combo >= 4 && combo % 4 === 0) showComboPopup(`COMBO x${combo}`);
            showLearn(obj.topic);
            burstAt(obj.group.position.x, 1.4, obj.group.position.z, obj.topic.color);
        } else if (obj.type === 'power' && dx < 1.15 && dz < 1.15) {
            obj.hit = true;
            obj.group.visible = false;
            shield = 6;
            multiplierTimer = 5;
            combo++;
            comboTimer = 2.1;
            addScore(220);
            showComboPopup('DEBUG +2X', '#20c997');
            showLearn({ tag: 'DBG', title: 'Debug', copy: 'Programar tambem e testar, corrigir e melhorar.' });
            burstAt(obj.group.position.x, 1.4, obj.group.position.z, 0x20c997);
        } else if (obj.type === 'obstacle' && intersectsBox(getPlayerHitbox(), getObjectHitbox(obj), GAMEPLAY.collisionPadding)) {
            obj.hit = true;
            combo = 0;
            comboTimer = 0;
            if (shield > 0) {
                shield = 0;
                addScore(100);
                showComboPopup('ESCUDO!', '#20c997');
                burstAt(obj.group.position.x, 1.2, obj.group.position.z, 0x20c997);
            } else {
                shake = 0.75;
                burstAt(player.group.position.x, 1.2, player.group.position.z, 0xff4d4d);
                endGame();
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
        if (liveObjects[i].group.position.z > 18 || liveObjects[i].hit) {
            liveObjects[i].group.removeFromParent();
            liveObjects.splice(i, 1);
        }
    }
}

function updateScenery(delta) {
    for (const group of scenery) {
        group.position.z += speed * delta;
        if (group.position.z > 48) {
            group.position.z -= 410;
        }
    }
}

function updateSparks(delta) {
    for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.userData.life -= delta;
        spark.userData.vel.y -= 8 * delta;
        spark.position.addScaledVector(spark.userData.vel, delta);
        spark.material.opacity = Math.max(0, spark.userData.life / 0.45);
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

    const visualSpeed = state === 'running' ? speed : state === 'paused' ? 0 : 8;
    for (const segment of roadSegments) {
        if (state !== 'running' && state !== 'paused') {
            segment.position.z += visualSpeed * delta;
            if (segment.position.z > 38) segment.position.z -= roadSegments.length * 34;
        }
        segment.children.forEach(child => {
            if (child.material?.map === mats.road.map) {
                child.material.map.offset.y -= delta * visualSpeed * 0.018;
            }
        });
    }

    if (state === 'running') updateRunning(delta, t);
    if (state !== 'paused') {
        if (player.usesModel) player.mixer.update(delta);
        updateSelectorStage(delta, t);
        updateScenery(delta);
        updateSparks(delta);
        updateComboPopups(delta);
    }

    const customizeFocus = new THREE.Vector3(0, 2.08, 2.15);
    const menuFocus = new THREE.Vector3(0, 2.25, -16);
    const lookAt = state === 'customize'
        ? customizeFocus
        : state === 'menu'
            ? menuFocus
            : new THREE.Vector3(player.group.position.x * 0.28, 2.2 + player.group.position.y * 0.2, -10);
    const camTarget = state === 'customize'
        ? new THREE.Vector3(0, 4.35, 9.2)
        : state === 'menu'
            ? new THREE.Vector3(0, 6.2, 17.2)
            : new THREE.Vector3(player.group.position.x * 0.38, 7.2 + player.group.position.y * 0.18, 15.5);
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
}

function pauseGame() {
    if (state !== 'running') return;
    state = 'paused';
    updatePauseUi();
}

function resumeGame() {
    if (state !== 'paused') return;
    state = 'running';
    clock.getDelta();
    playPlayerAction('Run');
    updatePauseUi();
}

function showMenu() {
    state = 'menu';
    player.group.visible = false;
    player.shadow.visible = false;
    selectorStage.visible = true;
    pausePanel.hidden = true;
    customizePanel.hidden = true;
    gameOverScreen.hidden = true;
    rankingPanel.hidden = true;
    startScreen.hidden = false;
    startScreen.classList.add('screen-open');
    updateCharacterSelection({ syncPlayer: false });
    updatePauseUi();
}

function moveLane(dir) {
    if (state !== 'running') return;
    targetLaneIndex = Math.max(0, Math.min(2, targetLaneIndex + dir));
}

function jump() {
    if (state !== 'running') return;
    if (player.group.position.y <= 0.05) {
        playerVelocityY = GAMEPLAY.jumpVelocity;
        isSliding = false;
        isFastDropping = false;
        slideTimer = 0;
        playPlayerAction('Jump');
    }
}

function slide() {
    if (state !== 'running') return;
    isSliding = true;
    playPlayerAction('Roll');
    if (player.group.position.y > 0.08) {
        isFastDropping = true;
        playerVelocityY = Math.min(playerVelocityY, -GAMEPLAY.fastDropVelocity);
        slideTimer = Math.max(slideTimer, GAMEPLAY.airborneSlideDuration);
    } else {
        slideTimer = GAMEPLAY.slideDuration;
    }
}

function openCustomize() {
    state = 'customize';
    startScreen.hidden = true;
    rankingPanel.hidden = true;
    gameOverScreen.hidden = true;
    player.group.visible = false;
    player.shadow.visible = false;
    selectorStage.visible = true;
    pausePanel.hidden = true;
    customizePanel.hidden = false;
    updatePauseUi();
    updateCharacterSelection({ syncPlayer: false });
}

function closeCustomize() {
    state = 'menu';
    customizePanel.hidden = true;
    selectorStage.visible = false;
    player.group.visible = false;
    player.shadow.visible = false;
    pausePanel.hidden = true;
    startScreen.hidden = false;
    startScreen.classList.add('screen-open');
    updateCharacterSelection();
    updatePauseUi();
}

window.addEventListener('keydown', event => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
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
btnRetry.addEventListener('click', startGame);
btnMenu.addEventListener('click', showMenu);
btnPause.addEventListener('click', () => {
    if (state === 'paused') resumeGame();
    else pauseGame();
});
btnResume.addEventListener('click', resumeGame);
btnPauseMenu.addEventListener('click', showMenu);
btnCustomize.addEventListener('click', openCustomize);
customizeClose.addEventListener('click', closeCustomize);
customizeDone.addEventListener('click', closeCustomize);
document.querySelectorAll('[data-custom-region]').forEach(button => {
    button.addEventListener('click', () => {
        cycleCustomize(button.dataset.customRegion, Number(button.dataset.dir));
    });
});
customizeGender.addEventListener('click', () => {
    const pairFile = GENDER_PAIRS[getCurrentCharacter().file];
    if (!pairFile) return;
    const idx = PRESETS.character.findIndex(character => character.file === pairFile);
    if (idx >= 0) {
        customIndex.character = idx;
        updateCharacterSelection();
    }
});
btnRanking.addEventListener('click', () => {
    renderRanking();
    rankingPanel.hidden = false;
});
btnCloseRanking.addEventListener('click', () => {
    rankingPanel.hidden = true;
});
btnClearRanking.addEventListener('click', async () => {
    setRanking([]);
    await persistRankingToJson();
    renderRanking();
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
    const name = playerNameInput.value.trim().toUpperCase() || 'ALUNO IF';
    savedCurrentScore = true;
    await saveScore({
        name,
        score: Math.floor(score),
        time: Math.floor(runTime),
        area: finalArea.textContent,
        date: new Date().toLocaleDateString('pt-BR'),
    });
    playerNameInput.value = '';
    renderRanking();
    rankingPanel.hidden = false;
});

function normalizeRanking(input) {
    const list = Array.isArray(input) ? input : Array.isArray(input?.ranking) ? input.ranking : [];
    return list
        .filter(entry => entry && Number.isFinite(Number(entry.score)))
        .map(entry => ({
            name: String(entry.name || 'ALUNO IF').slice(0, 14).toUpperCase(),
            score: Math.max(0, Math.floor(Number(entry.score))),
            time: Math.max(0, Math.floor(Number(entry.time || 0))),
            area: String(entry.area || 'WEB').slice(0, 8).toUpperCase(),
            date: String(entry.date || new Date().toLocaleDateString('pt-BR')),
        }))
        .sort((a, b) => b.score - a.score)
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
        if (jsonRanking.length || !rankingCache.length) {
            setRanking(jsonRanking);
        } else {
            await persistRankingToJson();
        }
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

function renderRanking() {
    const ranking = getRanking();
    rankingList.innerHTML = '';
    if (!ranking.length) {
        const empty = document.createElement('li');
        empty.innerHTML = '<span>Ninguem</span><span class="meta">Jogue uma rodada para aparecer aqui</span><strong>0</strong>';
        rankingList.appendChild(empty);
        return;
    }
    for (const entry of ranking) {
        const li = document.createElement('li');
        const name = document.createElement('span');
        name.append(document.createTextNode(entry.name));
        const meta = document.createElement('span');
        meta.className = 'meta';
        meta.textContent = `${entry.area} - ${entry.time}s - ${entry.date}`;
        name.appendChild(meta);
        const scoreEl = document.createElement('strong');
        scoreEl.textContent = entry.score;
        li.appendChild(name);
        li.appendChild(scoreEl);
        rankingList.appendChild(li);
    }
}
