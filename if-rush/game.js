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
const quizPanel = document.getElementById('quiz-panel');
const quizDifficulty = document.getElementById('quiz-difficulty');
const quizTimer = document.getElementById('quiz-timer');
const quizTimerBar = document.getElementById('quiz-timer-bar');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
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
const rankingTitle = rankingPanel.querySelector('.ranking-head h2');
const rankingLimit = rankingPanel.querySelector('.ranking-head span');
const rankingEditorToggle = document.getElementById('ranking-editor-toggle');
const musicPlayer = document.getElementById('music-player');
const musicTrackLabel = document.getElementById('music-track-label');
const musicPrev = document.getElementById('music-prev');
const musicToggle = document.getElementById('music-toggle');
const musicNext = document.getElementById('music-next');
const musicRandom = document.getElementById('music-random');
const musicVolume = document.getElementById('music-volume');
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
const ONLINE_RANKING_ENDPOINT = '/api/ranking';
const LOCAL_RANKING_ENDPOINT = 'ranking.json';
const CUSTOMIZE_KEY = 'if-rush-customize-v1';
const MAP_CUSTOMIZE_KEY = 'if-mapa3d-customize-v3';
const LANES = [-4.2, 0, 4.2];
const MODEL_ROOT = 'assets/models/';
const NATURE_ROOT = 'assets/models/nature/glTF/';
const BUILDING_ROOT = 'assets/models/buildings/FBX/';
const TEXTURE_ROOT = 'assets/textures/ambientcg/';
const COURSE_TOPICS = [
    { tag: 'WEB', title: 'Desenvolvimento Web', copy: 'Sites e apps que rodam no navegador.', color: 0x2b9cff },
    { tag: 'IA', title: 'Inteligência Artificial', copy: 'Sistemas que aprendem padrões e ajudam pessoas.', color: 0x8f62ff },
    { tag: 'BD', title: 'Banco de Dados', copy: 'Organização das informações por trás dos sistemas.', color: 0xffb020 },
    { tag: 'RED', title: 'Redes', copy: 'Computadores conversando com segurança e velocidade.', color: 0x20c997 },
    { tag: 'GAM', title: 'Games', copy: 'Lógica, arte, física e interação virando jogo.', color: 0xff5d8f },
    { tag: 'SEG', title: 'Segurança', copy: 'Proteção de dados, sistemas e pessoas online.', color: 0xff5a4f },
    { tag: 'ROB', title: 'Robótica', copy: 'Código controlando sensores, motores e ideias reais.', color: 0x4cc9f0 },
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
        { label: 'Pele média', color: 0xc18164 },
        { label: 'Pele morena', color: 0x8b5e3c },
        { label: 'Pele escura', color: 0x5b3621 },
    ],
    shirt: [
        { label: 'Uniforme IF', color: 0x1f8a45 },
        { label: 'Azul informática', color: 0x2b9cff },
        { label: 'Coral games', color: 0xe26b5c },
        { label: 'Grafite hacker', color: 0x37474f },
        { label: 'Dourado expo', color: 0xffc94a },
    ],
    pants: [
        { label: 'Jeans azul', color: 0x3d5c8c },
        { label: 'Jeans claro', color: 0x6e8db5 },
        { label: 'Jeans escuro', color: 0x1f3147 },
        { label: 'Calça preta', color: 0x1a1a1a },
        { label: 'Calça caqui', color: 0x8a7a5c },
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
        { label: 'Funcionário', file: 'Worker_Male.gltf' },
        { label: 'Funcionária', file: 'Worker_Female.gltf' },
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
    { id: 'trafficCones', cue: 'PULE', color: 0x18d72f, kind: 'jump', weight: 0.42, hitbox: { halfX: 1.34, halfY: 0.5, halfZ: 0.46, centerY: 0.5 } },
    { id: 'lowBarrier', cue: 'ABAIXE', color: 0x19d94d, kind: 'slide', multiLane: true, weight: 1.08, hitbox: { halfX: 5.74, halfY: 1.42, halfZ: 0.58, centerY: 3.18 } },
    { id: 'crateStack', cue: 'PULE', color: 0xd7c7ad, kind: 'jump', weight: 1.12, hitbox: { halfX: 0.86, halfY: 0.68, halfZ: 0.58, centerY: 0.68 } },
    { id: 'roadBlock', cue: 'DESVIE', color: 0x18d72f, kind: 'block', multiLane: true, weight: 0.84, hitbox: { halfX: 1.14, halfY: 1.06, halfZ: 0.5, centerY: 1.08 } },
    { id: 'overheadSign', cue: 'ABAIXE', color: 0x2b9cff, kind: 'slide', multiLane: true, weight: 0.92, hitbox: { halfX: 5.72, halfY: 1.18, halfZ: 0.72, centerY: 3.58 } },
    { id: 'snakeDesk', cue: 'DESVIE', color: 0x5f7d36, kind: 'block', weight: 0.74, hitbox: { halfX: 1.12, halfY: 2.16, halfZ: 0.78, centerY: 2.16 } },
    { id: 'crtRunner', cue: 'DESVIE', color: 0x26d960, kind: 'block', weightStart: 0.42, weightEnd: 1.15, solo: true, hitbox: { halfX: 0.72, halfY: 0.96, halfZ: 0.48, centerY: 1.18 } },
];

const GAMEPLAY = {
    playerHalfX: 0.46,
    playerHalfZ: 0.42,
    playerHalfY: 1.38,
    playerCenterY: 1.38,
    slideHalfY: 0.54,
    slideCenterY: 0.58,
    slideHalfZ: 0.68,
    startSpeed: 20.5,
    maxSpeed: 70,
    acceleration: 0.58,
    gravity: 31,
    jumpVelocity: 12.4,
    fastDropVelocity: 24,
    laneEase: 11.4,
    slideDuration: 0.58,
    airborneSlideDuration: 0.46,
    collisionPadding: 0.04,
};

const SCORE_TUNING = {
    rampStart: 0.42,
    rampEnd: 1.35,
    rampSeconds: 150,
    distancePerSecond: 8,
    bookBase: 18,
    bookComboStep: 1.8,
    bookComboCap: 18,
    bitcoin: 55,
    shieldBreak: 35,
    dodgeClose: 22,
    dodgeFar: 8,
    bitcoinMultiplier: 1.5,
};

const COLLECTIBLE_PATH = {
    groundY: 1.1,
    playerCenterY: 1.1,
    verticalCollectRadius: 1.05,
    jumpArcRadius: 7.2,
    jumpArcHeight: 2.25,
    jumpArcClearance: 1.25,
    blockedObstacleGap: 6.4,
};

const SHIELD_VISUAL = {
    duration: 8.5,
    warningSeconds: 3.2,
    pulseBase: 1.04,
    pulseAmount: 0.055,
    coreOpacity: 0.25,
    corePulse: 0.045,
    outlineOpacity: 0.31,
    outlinePulse: 0.045,
    rimOpacity: 0.24,
    rimPulse: 0.04,
    blinkMin: 0.16,
    blinkStartHz: 1.45,
    blinkEndHz: 3.35,
};

const DIFFICULTY_TUNING = {
    rampSeconds: 85,
    spawnStart: 1.28,
    spawnEnd: 0.42,
    secondObstacleStart: 0.24,
    secondObstacleEnd: 0.76,
    thirdObstacleStart: 0,
    thirdObstacleEnd: 0.34,
    powerChanceStart: 0.24,
    powerChanceEnd: 0.13,
    powerCooldownStart: 6,
    powerCooldownEnd: 9.5,
    crtChargeSpeedStart: 31,
    crtChargeSpeedEnd: 82,
    crtTelegraphStart: 1.08,
    crtTelegraphEnd: 0.5,
};

const QUIZ_RULES = {
    easy: { id: 'easy', label: 'Fácil', optionCount: 2, timeLimit: null },
    medium: { id: 'medium', label: 'Médio', optionCount: 2, timeLimit: 22 },
    hard: { id: 'hard', label: 'Difícil', optionCount: 3, timeLimit: 16 },
};

const DEBUG_QUIZ_ORDERED_TEST = false;
const QUIZ_SUCCESS_DELAY = 620;
const QUIZ_FAIL_REVEAL_DELAY = 2200;

const OBSTACLE_REPEAT_MEMORY = 4;
const OBSTACLE_REPEAT_PENALTIES = [0.06, 0.18, 0.38, 0.58];
const OBSTACLE_SPACING_CONFLICTS = {
    lowBarrier: { overheadSign: [0.02, 0.24] },
    overheadSign: { lowBarrier: [0.02, 0.24] },
};

const QUIZ_QUESTIONS = [
    {
        difficulty: 'easy',
        question: 'Qual a duração do curso técnico integrado em Informática?',
        options: ['2 anos', '4 anos'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'O aluno aprende linguagens muito utilizadas no mercado?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'O aluno do curso técnico aprende a desenvolver estas tecnologias, exceto:',
        options: ['Banco de dados para empresas', 'Sistema bancário'],
        answer: 1,
    },
    {
        difficulty: 'easy',
        question: 'O curso tem uma disciplina de Inglês técnico?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'O aluno aprende a montar e realizar manutenção de computadores?',
        options: ['Sim, faz parte da grade de hardware', 'Não, o curso é focado exclusivamente em software'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'Além de programar, o aluno aprende sobre Redes de Computadores?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'O aluno do curso técnico tem acesso às três refeições diárias gratuitas?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'O aluno do curso técnico pode ter acesso a bolsas de estudo?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'No curso de TI é ensinado sobre como ser um empreendedor?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'O aluno do curso técnico pode ter acesso a um estágio remunerado durante o curso?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'Qual área cuida da organização das informações de um sistema?',
        options: ['Banco de Dados', 'Modelagem 3D'],
        answer: 0,
    },
    {
        difficulty: 'easy',
        question: 'HTML é usado principalmente para estruturar páginas web?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'medium',
        question: 'Quantos laboratórios práticos o curso possui?',
        options: ['2 laboratórios práticos', '4 laboratórios práticos', '6 laboratórios práticos'],
        answer: 1,
    },
    {
        difficulty: 'medium',
        question: 'Qual linguagem é comum no início do curso para aprender Lógica de Programação?',
        options: ['Python ou C', 'Assembly'],
        answer: 0,
    },
    {
        difficulty: 'medium',
        question: 'Quantas matérias únicas o curso de T.I. possui?',
        options: ['15 matérias únicas', '20 matérias únicas'],
        answer: 1,
    },
    {
        difficulty: 'medium',
        question: 'Comparada a uma linguagem de baixo nível, uma linguagem de alto nível como Python costuma priorizar legibilidade e produtividade, mas pode ser:',
        options: ['Mais lenta em algumas situações', 'Sempre mais rápida em qualquer situação'],
        answer: 0,
    },
    {
        difficulty: 'medium',
        question: 'No aprendizado de Banco de Dados, qual linguagem é padrão para realizar consultas?',
        options: ['HTML', 'SQL'],
        answer: 1,
    },
    {
        difficulty: 'medium',
        question: 'Uma linguagem de alto nível se caracteriza por:',
        options: ['Estar mais próxima da linguagem humana', 'Estar mais próxima da linguagem de máquina'],
        answer: 0,
    },
    {
        difficulty: 'medium',
        question: 'O curso não aborda conceitos de segurança da informação e proteção de dados.',
        options: ['Verdadeiro', 'Falso'],
        answer: 1,
    },
    {
        difficulty: 'medium',
        question: 'O aluno aprende a utilizar sistemas operacionais de código aberto, como o Linux?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'medium',
        question: 'Qual destes eventos acadêmicos o aluno não consegue participar?',
        options: ['Programmers Guild', 'FECIB'],
        answer: 0,
    },
    {
        difficulty: 'medium',
        question: 'O curso técnico de Informática é oferecido em EAD?',
        options: ['Verdadeiro', 'Falso'],
        answer: 0,
    },
    {
        difficulty: 'medium',
        question: 'Em redes, o IP ajuda a identificar dispositivos conectados?',
        options: ['Sim', 'Não'],
        answer: 0,
    },
    {
        difficulty: 'medium',
        question: 'Qual prática ajuda a proteger contas online?',
        options: ['Usar senhas fortes', 'Repetir a mesma senha'],
        answer: 0,
    },
    {
        difficulty: 'hard',
        question: 'O que é um ponteiro em programação?',
        options: ['Uma variável que armazena o endereço de memória de outra variável', 'Um comando que desenha setas na tela', 'Um tipo de arquivo usado para guardar imagens'],
        answer: 0,
    },
    {
        difficulty: 'hard',
        question: 'No desenvolvimento web, para que serve o CSS?',
        options: ['Para criar a estrutura e o texto do site', 'Para definir o estilo, cores e layout da página', 'Para gerenciar o banco de dados do site'],
        answer: 1,
    },
    {
        difficulty: 'hard',
        question: 'Qual a diferença entre pré-incremento (++x) e pós-incremento (x++) em C?',
        options: ['++x incrementa depois da variável ser usada, enquanto x++ incrementa antes', '++x incrementa antes da variável ser usada, enquanto x++ incrementa depois', 'Não há diferença em nenhuma situação'],
        answer: 1,
    },
    {
        difficulty: 'hard',
        question: 'Qual é a principal função de um compilador em um ambiente de desenvolvimento?',
        options: ['Executar o código linha por linha diretamente', 'Traduzir todo o código de alto nível em linguagem de máquina de uma só vez', 'Armazenar os dados na memória RAM de forma temporária'],
        answer: 1,
    },
    {
        difficulty: 'hard',
        question: 'O que é uma variável na programação?',
        options: ['Um erro no código que impede a execução', 'Um espaço na memória reservado para armazenar um dado que pode mudar', 'Uma peça física do computador'],
        answer: 1,
    },
    {
        difficulty: 'hard',
        question: 'Na disciplina de Desenvolvimento Web, qual tecnologia é usada para adicionar interatividade às páginas?',
        options: ['CSS', 'JavaScript', 'HTML'],
        answer: 1,
    },
    {
        difficulty: 'hard',
        question: 'O que faz o protocolo DHCP em uma rede de computadores?',
        options: ['Realiza uma interconexão entre as máquinas da rede', 'Fornece automaticamente um endereço IP às máquinas da rede', 'Restaura o computador para o modelo de fábrica'],
        answer: 1,
    },
    {
        difficulty: 'hard',
        question: 'Quando a internet foi criada?',
        options: ['1969', '1950', '1971'],
        answer: 0,
    },
    {
        difficulty: 'hard',
        question: 'Quantos bits possui um byte?',
        options: ['12 bits', '8 bits', '4 bits'],
        answer: 1,
    },
    {
        difficulty: 'hard',
        question: 'Em Banco de Dados, qual recurso relaciona uma tabela com a chave primária de outra tabela?',
        options: ['Chave estrangeira', 'Classe CSS', 'Endereço DHCP'],
        answer: 0,
    },
    {
        difficulty: 'hard',
        question: 'Qual conceito descreve uma função chamando a si mesma?',
        options: ['Recursão', 'Renderização', 'Roteamento'],
        answer: 0,
    },
    {
        difficulty: 'hard',
        question: 'Em programação, o que costuma representar um booleano?',
        options: ['Verdadeiro ou falso', 'Uma imagem 3D', 'Um arquivo de áudio'],
        answer: 0,
    },
];

const DEBUG_CRT_RUNNER_ONLY = false;
const DEBUG_SNAKE_DESK_ONLY = false;
const DEBUG_CRT_MONITOR_ONLY = false;
const DEBUG_TRAFFIC_CONES_ONLY = false;
const DEBUG_LOW_BARRIER_ONLY = false;
const DEBUG_ROAD_BLOCK_ONLY = false;
const DEBUG_OVERHEAD_SIGN_ONLY = false;
const DEBUG_SINGLE_OBSTACLE_ONLY = DEBUG_CRT_RUNNER_ONLY || DEBUG_SNAKE_DESK_ONLY || DEBUG_CRT_MONITOR_ONLY || DEBUG_TRAFFIC_CONES_ONLY || DEBUG_LOW_BARRIER_ONLY || DEBUG_ROAD_BLOCK_ONLY || DEBUG_OVERHEAD_SIGN_ONLY;

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
let activeQuiz = null;
let quizRescueCount = 0;
let quizQuestionPools = {};
let quizOrderedTestCursor = 0;
let quizSerial = 0;
let quizInvulnerabilityTimer = 0;
let laneIndex = 1;
let targetLaneIndex = 1;
let laneSlideKick = 0;
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
let powerCooldownTimer = 0;
let shake = 0;
let combo = 0;
let comboTimer = 0;
let recentObstacleIds = [];
let savedCurrentScore = false;
let currentRunRank = null;
let rankingEditorEnabled = false;
const activeKeys = new Set();
let rankingCache = getStoredRanking();
let rankingSource = 'local';
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
const RIGHT_UTILITY_POLE_X = 10.72;
const RIGHT_UTILITY_POLE_ZS = [-17, 0, 17];
const CLOUD_COUNT = 8;
const CLOUD_SPACING = 26;
const CLOUD_LOOP_LENGTH = CLOUD_COUNT * CLOUD_SPACING;
const CLOUD_RECYCLE_Z = 82;
const CLOUD_START_Z = CLOUD_RECYCLE_Z - CLOUD_LOOP_LENGTH;
const CLOUD_SPEED_FACTOR = 0.44;
const SOUND_ROOT = 'sounds/';
const MUSIC_TRACKS = Array.from({ length: 32 }, (_, index) => `Ambiente/tracks/faixa_${index + 1}.mp3`);
const MUSIC_VOLUME_MAX = 0.44;
const MUSIC_VOLUME_DEFAULT = 0.28;
const MUSIC_AUTOPLAY_CLICK_DELAY = 180;
const MUSIC_AUTOPLAY_UNMUTE_DELAYS = [240, 760, 1500, 2600];
const QUIZ_MUSIC_FILE = null; // Troque pelo caminho do MP3 do quiz quando a faixa estiver pronta.
const QUIZ_RECOVERY_INVULNERABILITY = 2;
const SOUND_FILES = {
    jump: 'Player/pular/mixkit-fast-transitions-swoosh-3115.wav',
    slide: 'Player/Esquivar/mixkit-fast-transitions-swoosh-3115.wav',
    dodge: 'Player/Esquivar/mixkit-explainer-video-game-alert-sweep-236.wav',
    hit: 'Programa/losing/mixkit-player-losing-or-failing-2042.wav',
    coin: 'Programa/quiz/mixkit-bonus-earned-in-video-game-2058.wav',
    quizOpen: 'Programa/quiz/mixkit-bonus-earned-in-video-game-2058.wav',
    record: 'Programa/record/mixkit-game-level-completed-2059.wav',
    shieldUp: 'Player/Shield up/bible_images-video-game-power-up-sound-effect-384657.mp3',
    shieldBreak: 'Player/Shield break/11325622-glass-breaking-sound-effect-240679.mp3',
};

function makeSound(path) {
    return new Audio(encodeURI(`${SOUND_ROOT}${path}`));
}

const audioManager = {
    musicTracks: MUSIC_TRACKS,
    musicAudio: makeSound(MUSIC_TRACKS[0]),
    quizMusicAudio: QUIZ_MUSIC_FILE ? makeSound(QUIZ_MUSIC_FILE) : null,
    musicIndex: 0,
    musicVolume: MUSIC_VOLUME_DEFAULT,
    musicShuffle: false,
    musicShouldPlay: false,
    musicPausedByUser: false,
    musicAutoStartPending: false,
    musicMutedByAutoplay: false,
    musicPlayRequest: 0,
    musicUnmuteTimers: [],
    musicWasPlayingBeforeQuiz: false,
    sounds: {
        jump: makeSound(SOUND_FILES.jump),
        slide: makeSound(SOUND_FILES.slide),
        dodge: makeSound(SOUND_FILES.dodge),
        hit: makeSound(SOUND_FILES.hit),
        coin: makeSound(SOUND_FILES.coin),
        quizOpen: makeSound(SOUND_FILES.quizOpen),
        record: makeSound(SOUND_FILES.record),
        shieldUp: makeSound(SOUND_FILES.shieldUp),
        shieldBreak: makeSound(SOUND_FILES.shieldBreak),
    },
    ambientSounds: [
        makeSound('Ambiente/animais/cachorros/mixkit-medium-size-angry-dog-bark-54.wav'),
        makeSound('Ambiente/animais/fazenda/mixkit-cow-moo-in-the-barn-1751.wav'),
        makeSound('Ambiente/animais/fazenda/mixkit-farm-goat-baa-1763.wav'),
        makeSound('Ambiente/animais/gatos/mixkit-angry-cartoon-kitty-meow-94.wav'),
        makeSound('Ambiente/animais/gatos/mixkit-domestic-cat-hungry-meow-45.wav'),
    ],
    soundPools: {},
    poolIndex: {},
    audioContext: null,
    audioBuffers: {},
    decodingBuffers: {},
    webAudioNames: new Set(['coin', 'slide', 'jump', 'dodge', 'hit', 'quizOpen', 'record', 'shieldUp', 'shieldBreak']),
    soundOffsets: {
        coin: 0.005,
        slide: 0.06,
        jump: 0.06,
    },
    poolSizes: {
        coin: 8,
        quizOpen: 3,
        shieldUp: 4,
        jump: 3,
        slide: 3,
        dodge: 3,
        hit: 2,
        record: 2,
        shieldBreak: 3,
    },
    ambientTimer: null,
    currentAmbient: null,
    getAudioContext() {
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return null;
        if (!this.audioContext) this.audioContext = new AudioCtor();
        return this.audioContext;
    },
    loadBuffer(name) {
        if (!this.webAudioNames.has(name) || this.audioBuffers[name] || this.decodingBuffers[name]) return;
        const ctx = this.getAudioContext();
        const path = SOUND_FILES[name];
        if (!ctx || !path) return;
        this.decodingBuffers[name] = fetch(encodeURI(`${SOUND_ROOT}${path}`))
            .then(response => response.arrayBuffer())
            .then(data => ctx.decodeAudioData(data))
            .then(buffer => {
                this.audioBuffers[name] = buffer;
            })
            .catch(() => {
                delete this.audioBuffers[name];
            })
            .finally(() => {
                delete this.decodingBuffers[name];
            });
    },
    unlock() {
        const ctx = this.getAudioContext();
        if (ctx?.state === 'suspended') ctx.resume().catch(() => { });
        this.webAudioNames.forEach(name => this.loadBuffer(name));
    },
    init() {
        this.musicAudio.loop = false;
        this.musicAudio.volume = this.musicVolume;
        this.musicAudio.preload = 'metadata';
        this.musicAudio.addEventListener('play', updateMusicUi);
        this.musicAudio.addEventListener('pause', updateMusicUi);
        this.musicAudio.addEventListener('ended', () => {
            if (this.musicShouldPlay) this.nextMusic({ user: false, forcePlay: true });
        });
        if (this.quizMusicAudio) {
            this.quizMusicAudio.loop = true;
            this.quizMusicAudio.volume = Math.min(this.musicVolume, 0.3);
            this.quizMusicAudio.preload = 'metadata';
        }
        Object.entries(this.sounds).forEach(([name, sound]) => {
            sound.volume = 0.6;
            sound.preload = 'auto';
            sound.load();
        });
        Object.entries(this.poolSizes).forEach(([name, size]) => {
            const source = this.sounds[name];
            if (!source) return;
            this.soundPools[name] = Array.from({ length: size }, (_, index) => {
                const sound = index === 0 ? source : source.cloneNode();
                sound.preload = 'auto';
                sound.volume = source.volume;
                sound.load();
                return sound;
            });
            this.poolIndex[name] = 0;
        });
        this.ambientSounds.forEach(sound => {
            sound.volume = 0;
            sound.preload = 'auto';
            sound.load();
        });
        this.webAudioNames.forEach(name => this.loadBuffer(name));
        const unlockAndResume = event => {
            this.unlock();
            this.resumePendingMusic(event);
        };
        window.addEventListener('pointerdown', unlockAndResume, { passive: true });
        window.addEventListener('keydown', unlockAndResume, { passive: true });
        updateMusicUi();
    },
    getMusicSrc(index = this.musicIndex) {
        return encodeURI(`${SOUND_ROOT}${this.musicTracks[index]}`);
    },
    setMusicIndex(index, { play = this.musicShouldPlay, user = false } = {}) {
        if (!this.musicTracks.length) return;
        const nextIndex = (index + this.musicTracks.length) % this.musicTracks.length;
        const changed = nextIndex !== this.musicIndex;
        this.musicIndex = nextIndex;
        if (user && play) this.musicPausedByUser = false;
        if (changed || !this.musicAudio.src) {
            this.musicAudio.pause();
            this.musicAudio.src = this.getMusicSrc(nextIndex);
            try {
                this.musicAudio.currentTime = 0;
            } catch {
                // Ignore browsers that only allow seeking after metadata is loaded.
            }
            this.musicAudio.load();
        }
        if (play) this.playMusic({ user: false });
        else updateMusicUi();
    },
    playMusic({ user = true, allowMutedFallback = !user } = {}) {
        if (user) {
            this.musicPausedByUser = false;
            this.musicAutoStartPending = false;
            this.musicMutedByAutoplay = false;
        }
        this.unlock();
        this.musicShouldPlay = true;
        const requestId = ++this.musicPlayRequest;
        this.musicAudio.muted = false;
        this.musicAudio.volume = this.musicVolume;
        this.musicAudio.play()
            .then(() => {
                this.musicAutoStartPending = false;
                this.musicMutedByAutoplay = false;
                updateMusicUi();
            })
            .catch(() => {
                if (requestId !== this.musicPlayRequest) return;
                if (allowMutedFallback && !this.musicPausedByUser) {
                    this.playMutedUntilInteraction(requestId);
                    return;
                }
                this.musicShouldPlay = false;
                this.musicAutoStartPending = false;
                this.musicMutedByAutoplay = false;
                updateMusicUi();
            });
        updateMusicUi();
    },
    playMutedUntilInteraction(requestId) {
        if (requestId !== this.musicPlayRequest || this.musicPausedByUser) return;
        this.musicShouldPlay = true;
        this.musicAutoStartPending = true;
        this.musicMutedByAutoplay = true;
        this.musicAudio.muted = true;
        this.musicAudio.volume = this.musicVolume;
        this.musicAudio.play()
            .then(() => updateMusicUi())
            .catch(() => {
                if (requestId !== this.musicPlayRequest) return;
                this.musicShouldPlay = false;
                this.musicMutedByAutoplay = false;
                updateMusicUi();
            });
        this.scheduleAutoplayUnmute(requestId);
        updateMusicUi();
    },
    clearAutoplayUnmuteTimers() {
        this.musicUnmuteTimers.forEach(timer => window.clearTimeout(timer));
        this.musicUnmuteTimers = [];
    },
    scheduleAutoplayUnmute(requestId) {
        this.clearAutoplayUnmuteTimers();
        this.musicUnmuteTimers = MUSIC_AUTOPLAY_UNMUTE_DELAYS.map(delay => (
            window.setTimeout(() => this.tryAutoplayUnmute(requestId), delay)
        ));
    },
    tryAutoplayUnmute(requestId) {
        if (requestId !== this.musicPlayRequest || this.musicPausedByUser || !this.musicMutedByAutoplay) return;
        this.musicAudio.muted = false;
        this.musicAudio.volume = this.musicVolume;
        this.musicAudio.play()
            .then(() => {
                this.musicAutoStartPending = false;
                this.musicMutedByAutoplay = false;
                this.clearAutoplayUnmuteTimers();
                updateMusicUi();
            })
            .catch(() => {
                if (requestId !== this.musicPlayRequest || this.musicPausedByUser) return;
                this.musicAudio.muted = true;
                this.musicAutoStartPending = true;
                this.musicMutedByAutoplay = true;
                updateMusicUi();
            });
    },
    pauseMusic({ user = true } = {}) {
        if (user) {
            this.musicPausedByUser = true;
        }
        this.clearAutoplayUnmuteTimers();
        this.musicShouldPlay = false;
        this.musicAutoStartPending = false;
        this.musicMutedByAutoplay = false;
        this.musicPlayRequest++;
        this.musicAudio.muted = false;
        this.musicAudio.pause();
        updateMusicUi();
    },
    pauseMusicForGameOver() {
        this.clearAutoplayUnmuteTimers();
        this.musicPausedByUser = false;
        this.musicShouldPlay = false;
        this.musicAutoStartPending = false;
        this.musicMutedByAutoplay = false;
        this.musicPlayRequest++;
        this.musicAudio.muted = false;
        this.musicAudio.pause();
        updateMusicUi();
    },
    pauseMusicForQuiz() {
        this.musicWasPlayingBeforeQuiz = this.musicShouldPlay;
        this.clearAutoplayUnmuteTimers();
        this.musicShouldPlay = false;
        this.musicAutoStartPending = false;
        this.musicMutedByAutoplay = false;
        this.musicPlayRequest++;
        this.musicAudio.muted = false;
        this.musicAudio.pause();
        this.startQuizMusic();
        updateMusicUi();
    },
    startQuizMusic() {
        if (!this.quizMusicAudio) return;
        this.quizMusicAudio.volume = Math.min(this.musicVolume, 0.3);
        this.quizMusicAudio.currentTime = 0;
        this.quizMusicAudio.play().catch(() => { });
    },
    stopQuizMusic({ resumeMain = false } = {}) {
        if (this.quizMusicAudio) {
            this.quizMusicAudio.pause();
            this.quizMusicAudio.currentTime = 0;
        }
        const shouldResume = resumeMain && this.musicWasPlayingBeforeQuiz && !this.musicPausedByUser;
        this.musicWasPlayingBeforeQuiz = false;
        if (shouldResume) this.playMusic({ user: false });
        else updateMusicUi();
    },
    toggleMusic() {
        if (this.musicShouldPlay && !this.musicAudio.paused) this.pauseMusic({ user: true });
        else this.playMusic({ user: true, allowMutedFallback: true });
    },
    pickRandomMusicIndex() {
        if (this.musicTracks.length <= 1) return 0;
        let nextIndex = this.musicIndex;
        while (nextIndex === this.musicIndex) {
            nextIndex = Math.floor(Math.random() * this.musicTracks.length);
        }
        return nextIndex;
    },
    nextMusic({ user = true, forcePlay = false } = {}) {
        const nextIndex = this.musicShuffle ? this.pickRandomMusicIndex() : this.musicIndex + 1;
        this.setMusicIndex(nextIndex, { play: forcePlay || this.musicShouldPlay || user, user });
    },
    previousMusic() {
        this.setMusicIndex(this.musicIndex - 1, { play: true, user: true });
    },
    setMusicShuffle(enabled) {
        this.musicShuffle = Boolean(enabled);
        updateMusicUi();
    },
    setMusicVolume(value) {
        const sliderRatio = THREE.MathUtils.clamp(Number(value) || 0, 0, 1);
        this.musicVolume = sliderRatio * MUSIC_VOLUME_MAX;
        this.musicAudio.volume = this.musicVolume;
        if (this.quizMusicAudio) this.quizMusicAudio.volume = Math.min(this.musicVolume, 0.3);
        updateMusicUi();
    },
    requestAutoMusic({ random = false } = {}) {
        if (this.musicPausedByUser) {
            updateMusicUi();
            return;
        }
        if (random) this.setMusicIndex(this.pickRandomMusicIndex(), { play: false, user: false });
        this.musicAutoStartPending = true;
        this.clickMusicPlayButton();
    },
    resumePendingMusic(event) {
        if (!this.musicAutoStartPending || this.musicPausedByUser) return;
        const target = event?.target;
        if (target instanceof Element && target.closest('#music-player')) return;
        this.musicAutoStartPending = false;
        this.musicMutedByAutoplay = false;
        this.clearAutoplayUnmuteTimers();
        this.musicAudio.muted = false;
        this.playMusic({ user: false });
    },
    clickMusicPlayButton() {
        window.setTimeout(() => {
            if (this.musicPausedByUser || this.musicShouldPlay) return;
            if (musicToggle) {
                musicToggle.click();
            } else {
                this.playMusic({ user: false });
            }
        }, MUSIC_AUTOPLAY_CLICK_DELAY);
    },
    startMenuMusic() {
        if (this.musicShouldPlay) {
            this.playMusic({ user: false });
            return;
        }
        this.requestAutoMusic({ random: true });
    },
    startRunMusic() {
        if (this.musicShouldPlay) {
            this.playMusic({ user: false });
            return;
        }
        if (this.musicPausedByUser) {
            updateMusicUi();
            return;
        }
        this.requestAutoMusic({ random: true });
    },
    play(name) {
        const sound = this.sounds[name];
        if (!sound) return;
        if (this.playBuffered(name)) return;
        const pool = this.soundPools[name];
        if (!pool?.length) {
            sound.currentTime = 0;
            sound.play().catch(() => { });
            return;
        }
        const index = this.poolIndex[name] || 0;
        const pooled = pool[index];
        this.poolIndex[name] = (index + 1) % pool.length;
        pooled.pause();
        pooled.volume = sound.volume;
        try {
            pooled.currentTime = this.soundOffsets[name] || 0;
        } catch {
            // Some browsers reject seeking until metadata is ready; still try to play immediately.
        }
        pooled.play().catch(() => { });
    },
    playBuffered(name) {
        const buffer = this.audioBuffers[name];
        if (!buffer) return false;
        const ctx = this.getAudioContext();
        if (!ctx) return false;
        if (ctx.state === 'suspended') ctx.resume().catch(() => { });
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        gain.gain.value = this.sounds[name]?.volume ?? 0.6;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0, this.soundOffsets[name] || 0);
        return true;
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

function updateMusicUi() {
    if (!musicTrackLabel || !musicToggle || !musicRandom || !musicVolume) return;
    const trackTotal = audioManager.musicTracks.length;
    musicTrackLabel.textContent = `Faixa ${audioManager.musicIndex + 1} / ${trackTotal}`;
    const playing = audioManager.musicShouldPlay;
    musicToggle.textContent = playing ? 'Pausar' : 'Tocar';
    musicToggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Tocar música');
    musicRandom.setAttribute('aria-pressed', String(audioManager.musicShuffle));
    musicVolume.value = String(Math.round((audioManager.musicVolume / MUSIC_VOLUME_MAX) * 100));
    if (musicPlayer) musicPlayer.dataset.playing = playing ? 'true' : 'false';
}

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
await syncRanking();
renderRanking();
updateCharacterSelection();
updatePauseUi();

const loading = document.getElementById('loading-screen');
if (loading) loading.remove();
document.getElementById('start-screen').hidden = false;
document.getElementById('start-screen').classList.add('screen-open');
audioManager.startMenuMusic();

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

function makeGlitchPortalTexture() {
    const cacheKey = 'crt-runner-glitch-portal';
    if (labelTextureCache.has(cacheKey)) return labelTextureCache.get(cacheKey);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createRadialGradient(256, 192, 22, 256, 192, 210);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.58, 'rgba(0, 0, 0, 0.98)');
    grad.addColorStop(0.84, 'rgba(0, 255, 234, 0.42)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#020204';
    roundedRect(ctx, 106, 48, 300, 288, 12);
    ctx.fill();

    const bars = [
        ['#08fff0', 62, 44, 178, 10],
        ['#ff1eca', 282, 58, 172, 8],
        ['#fff500', 76, 88, 72, 6],
        ['#08fff0', 64, 126, 92, 7],
        ['#ff1eca', 350, 130, 116, 9],
        ['#08fff0', 330, 178, 92, 7],
        ['#fff500', 78, 236, 118, 8],
        ['#ff1eca', 294, 252, 162, 7],
        ['#08fff0', 102, 306, 154, 8],
        ['#ff1eca', 306, 316, 98, 7],
    ];
    ctx.globalCompositeOperation = 'lighter';
    bars.forEach(([color, x, y, w, h], index) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = index % 3 === 0 ? 0.95 : 0.78;
        ctx.fillRect(x, y, w, h);
        ctx.globalAlpha = 0.28;
        ctx.fillRect(x - 20, y + 10, w * 0.48, Math.max(3, h * 0.5));
    });

    ctx.globalAlpha = 0.92;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(248, 176, 24, 34);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = maxAnisotropy;
    tex.colorSpace = THREE.SRGBColorSpace;
    labelTextureCache.set(cacheKey, tex);
    return tex;
}

function makeCrtAngryFaceTexture() {
    const cacheKey = 'angry-crt-face';
    if (labelTextureCache.has(cacheKey)) return labelTextureCache.get(cacheKey);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const screen = ctx.createLinearGradient(0, 36, 0, 348);
    screen.addColorStop(0, '#9ba59b');
    screen.addColorStop(0.48, '#6f7a71');
    screen.addColorStop(1, '#353d39');
    ctx.fillStyle = screen;
    roundedRect(ctx, 28, 28, 456, 328, 34);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 5;
    roundedRect(ctx, 44, 44, 424, 296, 24);
    ctx.stroke();

    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#111817';
    for (let y = 52; y < 340; y += 12) {
        ctx.fillRect(44, y, 424, 2);
    }
    ctx.globalAlpha = 1;

    const terminalStroke = (draw, width = 14) => {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#061207';
        ctx.lineWidth = width + 8;
        draw();
        ctx.strokeStyle = '#18dd55';
        ctx.lineWidth = width;
        draw();
    };

    terminalStroke(() => {
        ctx.beginPath();
        ctx.moveTo(106, 108);
        ctx.lineTo(205, 145);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(307, 146);
        ctx.lineTo(407, 108);
        ctx.stroke();
    }, 13);

    terminalStroke(() => {
        ctx.beginPath();
        ctx.moveTo(114, 166);
        ctx.lineTo(202, 166);
        ctx.lineTo(162, 250);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(310, 166);
        ctx.lineTo(398, 166);
        ctx.lineTo(350, 250);
        ctx.closePath();
        ctx.stroke();
    }, 12);

    terminalStroke(() => {
        ctx.beginPath();
        ctx.rect(170, 276, 174, 44);
        ctx.stroke();
        for (let x = 210; x <= 302; x += 46) {
            ctx.beginPath();
            ctx.moveTo(x, 278);
            ctx.lineTo(x, 318);
            ctx.stroke();
        }
    }, 10);

    ctx.fillStyle = 'rgba(24, 221, 85, 0.2)';
    roundedRect(ctx, 168, 274, 178, 48, 5);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = maxAnisotropy;
    tex.colorSpace = THREE.SRGBColorSpace;
    labelTextureCache.set(cacheKey, tex);
    return tex;
}

function makeCodeBlockTexture(label = '{}') {
    const cacheKey = `code-block-${label}`;
    if (labelTextureCache.has(cacheKey)) return labelTextureCache.get(cacheKey);
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = 'rgba(23, 255, 74, 0.55)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#061108';
    roundedRect(ctx, 14, 18, 164, 60, 10);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#18df42';
    roundedRect(ctx, 14, 18, 164, 60, 10);
    ctx.stroke();

    ctx.fillStyle = '#24ff58';
    ctx.font = '900 34px Consolas, "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 96, 49);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = maxAnisotropy;
    tex.colorSpace = THREE.SRGBColorSpace;
    labelTextureCache.set(cacheKey, tex);
    return tex;
}

function makeVirusTrailTexture() {
    const cacheKey = 'virus-trail';
    if (labelTextureCache.has(cacheKey)) return labelTextureCache.get(cacheKey);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const blocks = [
        [28, 46, 34, 20, 0.86],
        [64, 60, 30, 18, 0.68],
        [98, 42, 38, 20, 0.76],
        [140, 64, 34, 18, 0.58],
        [180, 50, 26, 16, 0.48],
        [214, 72, 22, 14, 0.38],
    ];
    blocks.forEach(([x, y, w, h, alpha]) => {
        ctx.fillStyle = `rgba(2, 3, 2, ${Math.min(0.86, alpha + 0.08)})`;
        ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
        ctx.fillStyle = `rgba(4, 157, 28, ${alpha})`;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = `rgba(24, 199, 59, ${alpha * 0.36})`;
        ctx.fillRect(x + 4, y + 4, Math.max(6, w - 12), Math.max(4, h - 12));
    });

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
        for (let i = 0; i < 90; i++) {
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

function addRightUtilityPoles(segment) {
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x5d3a20, flatShading: true, roughness: 0.86 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x171b1f, roughness: 0.62 });
    const insulatorMat = new THREE.MeshStandardMaterial({ color: 0xd8f6ef, flatShading: true, roughness: 0.5 });
    const x = RIGHT_UTILITY_POLE_X;
    const wireOffsets = [-0.48, 0.48];

    for (const z of RIGHT_UTILITY_POLE_ZS) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 3.7, 6), poleMat);
        pole.position.set(x, 1.85, z);
        pole.castShadow = true;
        segment.add(pole);

        const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.15, 0.13), poleMat);
        crossbar.position.set(x, 3.42, z);
        crossbar.castShadow = true;
        segment.add(crossbar);

        for (const offset of wireOffsets) {
            const cap = new THREE.Mesh(new THREE.DodecahedronGeometry(0.11, 0), insulatorMat);
            cap.position.set(x + offset, 3.54, z);
            cap.castShadow = true;
            segment.add(cap);
        }
    }

    for (const offset of wireOffsets) {
        for (let i = 0; i < RIGHT_UTILITY_POLE_ZS.length - 1; i++) {
            const start = new THREE.Vector3(x + offset, 3.54, RIGHT_UTILITY_POLE_ZS[i]);
            const mid = new THREE.Vector3(x + offset, 3.38, (RIGHT_UTILITY_POLE_ZS[i] + RIGHT_UTILITY_POLE_ZS[i + 1]) * 0.5);
            const end = new THREE.Vector3(x + offset, 3.54, RIGHT_UTILITY_POLE_ZS[i + 1]);
            segment.add(makeCylinderBetween(start, mid, 0.024, wireMat, 6));
            segment.add(makeCylinderBetween(mid, end, 0.024, wireMat, 6));
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

        addRightUtilityPoles(segment);

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

function makeCylinderBetween(start, end, radius, material, radialSegments = 8) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, radialSegments), material);
    mesh.position.copy(start).addScaledVector(direction, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    mesh.castShadow = true;
    return mesh;
}

function createSidewalkBench(side = 1) {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, flatShading: true, roughness: 0.74 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x5c351e, flatShading: true, roughness: 0.82 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x20262b, flatShading: true, roughness: 0.58, metalness: 0.08 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.16, 1.72), woodMat);
    seat.position.set(0, 0.55, 0);
    seat.castShadow = true;
    seat.receiveShadow = true;
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.72, 1.76), darkWoodMat);
    back.position.set(0.34, 0.86, 0);
    back.rotation.z = -0.08;
    back.castShadow = true;
    group.add(back);

    for (const z of [-0.62, 0.62]) {
        const legA = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.58, 0.12), metalMat);
        legA.position.set(-0.18, 0.27, z);
        legA.castShadow = true;
        group.add(legA);

        const legB = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.58, 0.12), metalMat);
        legB.position.set(0.26, 0.27, z);
        legB.castShadow = true;
        group.add(legB);
    }

    for (const z of [-0.9, 0.9]) {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.09, 0.1), metalMat);
        arm.position.set(0.04, 0.76, z);
        arm.castShadow = true;
        group.add(arm);
    }

    group.rotation.y = side > 0 ? 0 : Math.PI;
    return group;
}

function createGrassPlant() {
    const group = new THREE.Group();
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x2f7a38, flatShading: true, roughness: 0.94 });
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x5fa642, flatShading: true, roughness: 0.96 });
    const leafMats = [
        new THREE.MeshStandardMaterial({ color: 0x3d9b3f, flatShading: true, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: 0x75bd4a, flatShading: true, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: 0x2b7f3d, flatShading: true, roughness: 0.9 }),
    ];
    const flowerMats = [
        new THREE.MeshStandardMaterial({ color: 0xf5e9b8, flatShading: true, roughness: 0.82 }),
        new THREE.MeshStandardMaterial({ color: 0xf0cf62, flatShading: true, roughness: 0.82 }),
        new THREE.MeshStandardMaterial({ color: 0xaec9ff, flatShading: true, roughness: 0.84 }),
        new THREE.MeshStandardMaterial({ color: 0xc9a8dd, flatShading: true, roughness: 0.84 }),
    ];
    const flowerCenterMat = new THREE.MeshStandardMaterial({ color: 0x8a6a24, flatShading: true, roughness: 0.88 });
    const leafGeo = new THREE.DodecahedronGeometry(0.12, 0);
    const petalGeo = new THREE.DodecahedronGeometry(0.045, 0);
    const centerGeo = new THREE.DodecahedronGeometry(0.04, 0);

    const base = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), soilMat);
    base.scale.set(2.15, 0.12, 1.2);
    base.position.y = 0.045;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const leafCount = 14 + Math.floor(Math.random() * 7);
    for (let i = 0; i < leafCount; i++) {
        const angle = (i / leafCount) * Math.PI * 2 + Math.random() * 0.34;
        const radius = 0.14 + Math.random() * 0.44;
        const leaf = new THREE.Mesh(leafGeo, leafMats[i % leafMats.length]);
        leaf.position.set(Math.cos(angle) * radius, 0.13 + Math.random() * 0.2, Math.sin(angle) * radius * 0.62);
        leaf.scale.set(0.36, 1.18 + Math.random() * 0.68, 0.22);
        leaf.rotation.set(0.9 + Math.random() * 0.3, angle, (Math.random() - 0.5) * 0.36);
        leaf.castShadow = true;
        leaf.receiveShadow = true;
        group.add(leaf);
    }

    const addStem = (x, z, topY, leanX = 0, leanZ = 0, radius = 0.025) => {
        const start = new THREE.Vector3(x, 0.14, z);
        const end = new THREE.Vector3(x + leanX, topY, z + leanZ);
        const stem = makeCylinderBetween(start, end, radius, stemMat, 5);
        group.add(stem);
        return end;
    };

    const addPetalHead = (position, petalMat, petalCount = 5) => {
        const head = new THREE.Group();
        head.position.copy(position);
        head.rotation.set((Math.random() - 0.5) * 0.18, (Math.random() - 0.5) * 0.28, (Math.random() - 0.5) * 0.12);

        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petal = new THREE.Mesh(petalGeo, petalMat);
            petal.position.set(Math.cos(angle) * 0.07, Math.sin(angle) * 0.07, 0.012);
            petal.scale.set(0.82, 1.16, 0.42);
            petal.rotation.z = angle;
            petal.castShadow = true;
            head.add(petal);
        }

        const center = new THREE.Mesh(centerGeo, flowerCenterMat);
        center.position.z = 0.03;
        center.castShadow = true;
        head.add(center);

        head.scale.setScalar(0.76 + Math.random() * 0.2);
        group.add(head);
        return head;
    };

    const flowerPositions = [
        [-0.42, -0.04, 0.72],
        [0.02, 0.18, 0.9],
        [0.44, -0.12, 0.66],
        [-0.08, -0.34, 0.54],
    ];
    const visibleFlowers = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < visibleFlowers; i++) {
        const [x, z, h] = flowerPositions[i];
        const top = addStem(
            x + (Math.random() - 0.5) * 0.08,
            z + (Math.random() - 0.5) * 0.08,
            h + Math.random() * 0.12,
            (Math.random() - 0.5) * 0.08,
            (Math.random() - 0.5) * 0.08,
            0.012 + Math.random() * 0.006
        );
        addPetalHead(top, flowerMats[(i + Math.floor(Math.random() * flowerMats.length)) % flowerMats.length], 4 + Math.floor(Math.random() * 2));
    }

    for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const top = addStem(
            Math.cos(angle) * (0.1 + Math.random() * 0.34),
            Math.sin(angle) * (0.08 + Math.random() * 0.28),
            0.36 + Math.random() * 0.32,
            (Math.random() - 0.5) * 0.08,
            (Math.random() - 0.5) * 0.08,
            0.009 + Math.random() * 0.005
        );
        const seed = new THREE.Mesh(new THREE.DodecahedronGeometry(0.036, 0), leafMats[i % leafMats.length]);
        seed.position.copy(top);
        seed.scale.set(0.7, 1.1, 0.55);
        seed.castShadow = true;
        group.add(seed);
    }

    group.scale.setScalar(0.82 + Math.random() * 0.18);
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
    // X-pattern diagonals matching the campus tower shape.
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
            bush.position.set(side * (14.5 + Math.random() * 14.5), 0, -18 + Math.random() * 16);
            bush.scale.multiplyScalar(0.9 + Math.random() * 0.4);
            registerGroundSpawn(bush);
            group.add(bush);

            const flowerPatchCount = 1 + (Math.random() > 0.48 ? 1 : 0);
            for (let i = 0; i < flowerPatchCount; i++) {
                const flowers = createGrassPlant();
                flowers.position.set(
                    bush.position.x - side * (0.9 + Math.random() * 1.8) + (Math.random() - 0.5) * 0.44,
                    0,
                    bush.position.z + (Math.random() - 0.5) * 1.55
                );
                flowers.rotation.y = (Math.random() - 0.5) * 0.28;
                flowers.scale.multiplyScalar(0.92 + Math.random() * 0.24);
                registerGroundSpawn(flowers);
                group.add(flowers);
            }
        }

        if (Math.random() > 0.48) {
            const rock = createRock();
            rock.position.set(side * (18 + Math.random() * 14), 0, -18 + Math.random() * 16);
            rock.scale.multiplyScalar(0.8 + Math.random() * 0.35);
            registerGroundSpawn(rock);
            group.add(rock);
        }

        if (Math.random() > 0.62) {
            const bench = createSidewalkBench(side);
            bench.position.set(side * (9.15 + Math.random() * 0.45), 0, -16 + Math.random() * 13);
            bench.rotation.y += (Math.random() - 0.5) * 0.06;
            bench.scale.multiplyScalar(0.9 + Math.random() * 0.16);
            registerGroundSpawn(bench);
            group.add(bench);
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
    const leafMat = new THREE.MeshStandardMaterial({
        color: 0x2f9f48,
        map: treeLeafMap,
        flatShading: true,
        roughness: 0.86,
    });
    const darkMat = new THREE.MeshStandardMaterial({
        color: 0x1a6f35,
        flatShading: true,
        roughness: 0.9,
    });
    const puffGeo = new THREE.DodecahedronGeometry(0.74, 0);
    const puffs = [
        [-0.58, 0.56, 0.02, 0.98, 0.68, 0.82],
        [0.0, 0.74, -0.12, 1.12, 0.82, 0.94],
        [0.58, 0.58, 0.04, 0.92, 0.66, 0.78],
        [-0.08, 0.42, 0.5, 0.84, 0.52, 0.68],
    ];

    puffs.forEach(([x, y, z, sx, sy, sz], index) => {
        const puff = new THREE.Mesh(puffGeo, index === 3 ? darkMat : leafMat);
        puff.position.set(x, y, z);
        puff.scale.set(sx, sy, sz);
        puff.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.35);
        puff.castShadow = true;
        puff.receiveShadow = true;
        group.add(puff);
    });

    const inkMat = new THREE.MeshStandardMaterial({ color: 0x132719, roughness: 0.8 });
    for (const x of [-0.76, 0.76]) {
        const stroke = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 0.08), inkMat);
        stroke.position.set(x, 0.42, 0.02);
        stroke.rotation.z = x < 0 ? -0.22 : 0.22;
        stroke.castShadow = true;
        group.add(stroke);
    }

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

function createShieldAura(radius, centerY) {
    const group = new THREE.Group();
    group.position.y = centerY;
    group.visible = false;

    const core = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 20),
        new THREE.MeshBasicMaterial({ color: 0x38f0c2, transparent: true, opacity: SHIELD_VISUAL.coreOpacity, depthWrite: false })
    );
    group.add(core);

    const outlineMat = new THREE.MeshBasicMaterial({
        color: 0x101411,
        transparent: true,
        opacity: SHIELD_VISUAL.outlineOpacity,
        depthWrite: false,
        depthTest: true,
    });
    const ringGeo = new THREE.TorusGeometry(radius * 1.03, radius * 0.018, 8, 72);
    const rings = [
        { rot: [Math.PI / 2, 0, 0], scale: [1, 0.86, 1] },
        { rot: [0, 0, 0], scale: [0.84, 1, 1] },
        { rot: [0, Math.PI / 2, 0], scale: [0.84, 1, 1] },
    ].map(({ rot, scale }) => {
        const ring = new THREE.Mesh(ringGeo, outlineMat);
        ring.rotation.set(...rot);
        ring.scale.set(...scale);
        group.add(ring);
        return ring;
    });

    const rimMat = new THREE.MeshBasicMaterial({
        color: 0xb9fff1,
        transparent: true,
        opacity: SHIELD_VISUAL.rimOpacity,
        depthWrite: false,
        depthTest: true,
    });
    const rimGeo = new THREE.TorusGeometry(radius * 1.01, radius * 0.012, 8, 72);
    const rims = [
        { rot: [Math.PI / 2, 0, 0], scale: [1.02, 0.9, 1.02] },
        { rot: [0, Math.PI / 2, 0], scale: [0.9, 1.02, 1.02] },
    ].map(({ rot, scale }) => {
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.rotation.set(...rot);
        rim.scale.set(...scale);
        group.add(rim);
        return rim;
    });

    group.userData.core = core;
    group.userData.rings = rings;
    group.userData.rims = rims;
    group.userData.coreBaseOpacity = SHIELD_VISUAL.coreOpacity;
    group.userData.outlineBaseOpacity = SHIELD_VISUAL.outlineOpacity;
    return group;
}

function createPlayerAlertMark() {
    const group = new THREE.Group();
    group.visible = false;
    group.position.set(0, 4.38, -0.08);
    group.userData.baseY = 4.38;

    const red = new THREE.MeshStandardMaterial({
        color: 0xff1717,
        emissive: 0x8a0505,
        emissiveIntensity: 0.42,
        roughness: 0.38,
        metalness: 0.02,
        transparent: true,
        opacity: 1,
        depthTest: false,
    });
    const dark = new THREE.MeshStandardMaterial({
        color: 0x5a0606,
        emissive: 0x240000,
        emissiveIntensity: 0.22,
        roughness: 0.52,
        transparent: true,
        opacity: 1,
        depthTest: false,
    });

    const markOutline = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.72, 6, 12), dark);
    markOutline.position.y = 0.25;
    markOutline.scale.z = 0.38;
    markOutline.renderOrder = 30;
    group.add(markOutline);

    const mark = new THREE.Mesh(new THREE.CapsuleGeometry(0.078, 0.62, 6, 12), red);
    mark.position.y = 0.25;
    mark.scale.z = 0.34;
    mark.renderOrder = 31;
    group.add(mark);

    const dotOutline = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), dark);
    dotOutline.position.y = -0.38;
    dotOutline.scale.set(1, 0.84, 0.42);
    dotOutline.renderOrder = 30;
    group.add(dotOutline);

    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.095, 14, 10), red);
    dot.position.y = -0.38;
    dot.scale.set(1, 0.8, 0.38);
    dot.renderOrder = 31;
    group.add(dot);

    group.userData.materials = [red, dark];
    return group;
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

        const shieldAura = createShieldAura(1.16, 1.75);
        group.add(shieldAura);
        const alertMark = createPlayerAlertMark();
        group.add(alertMark);

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
            alertMark,
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

    const shieldAura = createShieldAura(1.38, 2.0);
    group.add(shieldAura);
    const alertMark = createPlayerAlertMark();
    group.add(alertMark);

    applyCharacterVisual(group);

    return { group, limbs, shadow, shieldAura, alertMark };
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

    if (bitcoin) {
        const faceMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: faceMap,
            transparent: true,
            alphaTest: 0.04,
            roughness: 0.38,
            metalness: 0.16,
            side: THREE.DoubleSide,
        });
        const face = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 1.34), faceMat);
        face.castShadow = true;
        face.receiveShadow = true;
        group.add(face);

        const rim = new THREE.Mesh(
            new THREE.TorusGeometry(0.67, 0.055, 10, 52),
            new THREE.MeshStandardMaterial({
                color: 0x9f5e08,
                emissive: 0x5c3200,
                emissiveIntensity: 0.06,
                roughness: 0.42,
                metalness: 0.18,
            })
        );
        rim.castShadow = true;
        group.add(rim);
        return group;
    }

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

function canCollectibleArcOverObstacle(obstacleType) {
    return obstacleType?.kind === 'jump';
}

function getCollectibleBaseY(lane, z) {
    let baseY = COLLECTIBLE_PATH.groundY;
    for (const obj of liveObjects) {
        if (obj.type !== 'obstacle' || !obstacleAffectsLane(obj, lane) || obj.hit || obj.destroying) continue;
        if (!canCollectibleArcOverObstacle(obj.obstacleType)) continue;
        const distance = Math.abs(obj.group.position.z - z);
        if (distance > COLLECTIBLE_PATH.jumpArcRadius) continue;

        const hitbox = obj.hitbox || obj.obstacleType.hitbox;
        const obstacleTop = (obj.group.position.y || 0) + hitbox.centerY + hitbox.halfY;
        const peakY = Math.max(
            COLLECTIBLE_PATH.groundY + COLLECTIBLE_PATH.jumpArcHeight,
            obstacleTop + COLLECTIBLE_PATH.jumpArcClearance
        );
        const lift = Math.cos((distance / COLLECTIBLE_PATH.jumpArcRadius) * Math.PI * 0.5);
        baseY = Math.max(baseY, COLLECTIBLE_PATH.groundY + (peakY - COLLECTIBLE_PATH.groundY) * lift);
    }
    return baseY;
}

function setCollectiblePathHeight(obj) {
    const baseY = getCollectibleBaseY(obj.lane, obj.group.position.z);
    obj.group.userData.baseY = baseY;
    obj.group.userData.requiresJump = baseY > COLLECTIBLE_PATH.groundY + 0.45;
    obj.group.position.y = baseY;
}

function createCollectible(topic, lane, z) {
    const group = new THREE.Group();
    const book = createBookObject(topic);
    group.add(book);

    const baseY = getCollectibleBaseY(lane, z);
    group.position.set(LANES[lane], baseY, z);
    group.userData.baseY = baseY;
    group.userData.requiresJump = baseY > COLLECTIBLE_PATH.groundY + 0.45;
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

    const baseY = getCollectibleBaseY(lane, z);
    group.position.set(LANES[lane], baseY, z);
    group.userData.baseY = baseY;
    group.userData.requiresJump = baseY > COLLECTIBLE_PATH.groundY + 0.45;
    group.userData.faceForward = true;
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
    const hint = new THREE.Mesh(
        new THREE.PlaneGeometry(type.multiLane ? 2.2 : 1.5, 0.52),
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
    const screenMat = new THREE.MeshStandardMaterial({ color: 0xc7ded9, roughness: 0.52, metalness: 0.02 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xb9f4ff, roughness: 0.36, metalness: 0.05 });
    const woodDark = new THREE.MeshStandardMaterial({ color: 0x5a3519, roughness: 0.64, metalness: 0.01 });
    const snakeMat = new THREE.MeshStandardMaterial({ color: 0x5f7d36, roughness: 0.58, metalness: 0.01 });
    const snakeLight = new THREE.MeshStandardMaterial({ color: 0xeacb72, roughness: 0.5, metalness: 0.01 });
    const snakeDark = new THREE.MeshStandardMaterial({ color: 0x253219, roughness: 0.66, metalness: 0.01 });

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
        const routerEdge = new THREE.MeshStandardMaterial({ color: 0x050705, roughness: 0.76, metalness: 0.02 });
        const routerBody = new THREE.MeshStandardMaterial({ color: 0x252a27, roughness: 0.62, metalness: 0.04 });
        const routerFace = new THREE.MeshStandardMaterial({ color: 0x131714, roughness: 0.72, metalness: 0.02 });
        const routerTop = new THREE.MeshStandardMaterial({
            color: 0x313b34,
            emissive: 0x063a15,
            emissiveIntensity: 0.14,
            roughness: 0.54,
            metalness: 0.03,
        });
        const routerGreen = new THREE.MeshStandardMaterial({
            color: 0x13c743,
            emissive: 0x05b735,
            emissiveIntensity: 0.38,
            roughness: 0.42,
            metalness: 0.01,
        });
        const routerSignal = new THREE.MeshBasicMaterial({
            color: 0x17e84f,
            transparent: true,
            opacity: 0.86,
            depthWrite: false,
        });
        const routerSignalDark = new THREE.MeshBasicMaterial({
            color: 0x050705,
            transparent: true,
            opacity: 0.72,
            depthWrite: false,
        });
        const cableMat = new THREE.MeshBasicMaterial({ color: 0x050705 });
        const routerSignals = [];
        const routerBits = [];
        const routerLeds = [];
        const routerBodies = [];

        const addRouterMesh = (mesh, x, y, zPos, rotZ = 0) => {
            mesh.position.set(x, y, zPos);
            mesh.rotation.z = rotZ;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);
            return mesh;
        };

        const makeTube = (points, material, radius = 0.028, segments = 32) => {
            const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(point[0], point[1], point[2])));
            const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 7, false), material.clone());
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.renderOrder = 7;
            group.add(mesh);
            return mesh;
        };

        const addSignalStroke = (points, radius = 0.03, phase = 0) => {
            const outlinePoints = points.map(point => [point[0], point[1] - 0.01, point[2] - 0.012]);
            const outline = makeTube(outlinePoints, routerSignalDark, radius + 0.018, 36);
            const core = makeTube(points, routerSignal, radius, 36);
            routerSignals.push({
                outline,
                core,
                phase,
                baseScale: core.scale.clone(),
                baseCorePosition: core.position.clone(),
                baseOutlinePosition: outline.position.clone(),
            });
            return core;
        };

        const addLed = (x, y, zPos, color, phase) => {
            const led = addRouterMesh(
                new THREE.Mesh(
                    new THREE.SphereGeometry(0.035, 10, 8),
                    new THREE.MeshStandardMaterial({
                        color,
                        emissive: color,
                        emissiveIntensity: 0.6,
                        roughness: 0.3,
                    })
                ),
                x,
                y,
                zPos
            );
            routerLeds.push({ mesh: led, phase });
            return led;
        };

        const makeRouterEye = side => {
            const shape = new THREE.Shape();
            if (side < 0) {
                shape.moveTo(-0.11, 0.05);
                shape.lineTo(0.12, 0.02);
                shape.lineTo(-0.04, -0.09);
            } else {
                shape.moveTo(0.11, 0.05);
                shape.lineTo(-0.12, 0.02);
                shape.lineTo(0.04, -0.09);
            }
            shape.closePath();
            return shape;
        };

        const addRouter = (x, zPos, scale = 1, phase = 0, yaw = 0) => {
            const routerGroup = new THREE.Group();
            routerGroup.position.set(x, 0, zPos);
            routerGroup.scale.setScalar(scale);
            routerGroup.rotation.y = yaw;
            group.add(routerGroup);
            routerBodies.push({ group: routerGroup, phase, baseYaw: yaw });

            const localAdd = (mesh, px, py, pz, rz = 0) => {
                mesh.position.set(px, py, pz);
                mesh.rotation.z = rz;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                routerGroup.add(mesh);
                return mesh;
            };

            const blob = new THREE.Mesh(
                new THREE.CircleGeometry(0.62, 24),
                new THREE.MeshBasicMaterial({ color: 0x050705, transparent: true, opacity: 0.34, depthWrite: false })
            );
            blob.position.set(0, 0.035, 0.05);
            blob.rotation.x = -Math.PI / 2;
            blob.scale.set(1.28, 0.52, 1);
            routerGroup.add(blob);

            localAdd(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.34, 0.55), routerEdge), 0, 0.37, 0.02);
            localAdd(new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.24, 0.46), routerBody), 0, 0.4, 0.05);
            const topPlate = localAdd(new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.06, 0.46), routerTop), 0, 0.55, 0.04);
            topPlate.rotation.x = -0.08;
            localAdd(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.15, 0.055), routerFace), 0, 0.35, 0.335);

            [-1, 1].forEach(side => {
                const eyeOutline = localAdd(new THREE.Mesh(new THREE.ShapeGeometry(makeRouterEye(side)), routerEdge), side * 0.21, 0.375, 0.392);
                eyeOutline.scale.setScalar(1.16);
                eyeOutline.castShadow = false;
                eyeOutline.receiveShadow = false;
                const eyeCore = localAdd(new THREE.Mesh(new THREE.ShapeGeometry(makeRouterEye(side)), routerGreen), side * 0.21, 0.375, 0.402);
                eyeCore.scale.setScalar(0.72);
                eyeCore.castShadow = false;
                eyeCore.receiveShadow = false;
            });
            addLed(x - 0.07 * scale, 0.31 * scale, zPos + 0.39 * scale, 0xd83c32, phase + 0.1);
            addLed(x + 0.02 * scale, 0.31 * scale, zPos + 0.39 * scale, 0xd83c32, phase + 0.55);
            addLed(x + 0.12 * scale, 0.31 * scale, zPos + 0.39 * scale, 0x18d72f, phase + 1.0);

            [-1, 1].forEach(side => {
                const antennaOutline = localAdd(new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.76, 10), routerEdge), side * 0.29, 0.9, -0.18);
                antennaOutline.rotation.z = side * -0.42;
                antennaOutline.rotation.x = 0.18;
                const antennaCore = localAdd(new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.7, 8), routerGreen), side * 0.29, 0.9, -0.155);
                antennaCore.rotation.copy(antennaOutline.rotation);
                const cap = localAdd(new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), routerEdge), side * 0.45, 1.24, -0.28);
                cap.scale.set(0.8, 1.1, 0.8);

                const arm = localAdd(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.42, 8), routerEdge), side * 0.48, 0.5, 0.17);
                arm.rotation.z = side * 0.86;
                localAdd(new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 8), white), side * 0.68, 0.6, 0.2);
            });

            [-1, 1].forEach(side => {
                const leg = localAdd(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.32, 8), routerEdge), side * 0.24, 0.17, 0.12);
                leg.rotation.z = side * -0.16;
                const foot = localAdd(new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 7), routerEdge), side * 0.29, 0.06, 0.17);
                foot.scale.set(1.45, 0.52, 1.0);
            });

            const cableStart = x + (phase % 2 ? 0.34 : -0.34) * scale;
            const cableEnd = x + (phase % 2 ? 0.82 : -0.82) * scale;
            makeTube([
                [cableStart, 0.14 * scale, zPos + 0.28 * scale],
                [x + (phase % 2 ? 0.52 : -0.52) * scale, 0.04, zPos + 0.56 * scale],
                [cableEnd, 0.035, zPos + 0.82 * scale],
            ], cableMat, 0.014, 18);
            addRouterMesh(new THREE.Mesh(new THREE.SphereGeometry(0.06 * scale, 8, 6), routerEdge), cableEnd, 0.035, zPos + 0.82 * scale);

            addSignalStroke([
                [x - 0.25 * scale, 1.08 * scale, zPos + 0.02],
                [x - 0.12 * scale, 1.17 * scale, zPos + 0.02],
                [x, 1.09 * scale, zPos + 0.02],
                [x + 0.12 * scale, 1.17 * scale, zPos + 0.02],
                [x + 0.25 * scale, 1.08 * scale, zPos + 0.02],
            ], 0.025 * scale, phase);
            addSignalStroke([
                [x - 0.34 * scale, 1.22 * scale, zPos],
                [x - 0.17 * scale, 1.34 * scale, zPos],
                [x, 1.22 * scale, zPos],
                [x + 0.17 * scale, 1.34 * scale, zPos],
                [x + 0.34 * scale, 1.22 * scale, zPos],
            ], 0.022 * scale, phase + 0.7);
        };

        addRouter(-1.15, -0.12, 0.88, 0, 0.16);
        addRouter(0, 0.14, 0.98, 1.2, 0);
        addRouter(1.15, -0.12, 0.88, 2.4, -0.16);

        addSignalStroke([
            [-1.48, 1.42, 0.02],
            [-1.16, 1.56, 0.02],
            [-0.84, 1.43, 0.02],
            [-0.5, 1.58, 0.02],
            [-0.14, 1.45, 0.02],
            [0.18, 1.58, 0.02],
            [0.52, 1.44, 0.02],
            [0.88, 1.56, 0.02],
            [1.5, 1.44, 0.02],
        ], 0.03, 3.4);

        const bitGeo = new THREE.BoxGeometry(0.08, 0.08, 0.035);
        for (let i = 0; i < 16; i++) {
            const bit = addRouterMesh(
                new THREE.Mesh(bitGeo, i % 4 === 0 ? routerSignalDark.clone() : routerSignal.clone()),
                -1.46 + Math.random() * 2.92,
                1.24 + Math.random() * 0.5,
                -0.08 + Math.random() * 0.24,
                (Math.random() - 0.5) * 1.4
            );
            bit.scale.set(0.58 + Math.random() * 1.0, 0.48 + Math.random() * 0.8, 1);
            bit.castShadow = false;
            bit.receiveShadow = false;
            routerBits.push({
                mesh: bit,
                basePosition: bit.position.clone(),
                phase: Math.random() * Math.PI * 2,
            });
        }

        group.userData.networkRouters = {
            signals: routerSignals,
            bits: routerBits,
            leds: routerLeds,
            bodies: routerBodies,
        };
    } else if (type.id === 'lowBarrier') {
        const cableDark = new THREE.MeshStandardMaterial({ color: 0x080b0a, roughness: 0.68, metalness: 0.04 });
        const cableGreen = new THREE.MeshStandardMaterial({
            color: 0x13983a,
            emissive: 0x0fd34d,
            emissiveIntensity: 0.36,
            roughness: 0.38,
            metalness: 0.01,
        });
        const cableGlow = new THREE.MeshBasicMaterial({
            color: 0x20f45b,
            transparent: true,
            opacity: 0.46,
            depthWrite: false,
        });
        const boxDark = new THREE.MeshStandardMaterial({ color: 0x1b2220, roughness: 0.7, metalness: 0.04 });
        const boxFace = new THREE.MeshStandardMaterial({ color: 0x2f3f36, roughness: 0.58, metalness: 0.04 });
        const ledRed = new THREE.MeshStandardMaterial({
            color: 0xb71919,
            emissive: 0xff2020,
            emissiveIntensity: 0.4,
            roughness: 0.42,
        });
        const rig = { pulses: [], sparks: [], glows: [], leds: [] };

        const makeTube = (points, material, radius = 0.04, segments = 42) => {
            const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(point[0], point[1], point[2])));
            const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 8, false), material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);
            return mesh;
        };

        const terminalXs = [-5.55, 5.55];
        terminalXs.forEach((x, sideIndex) => {
            addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.16, 0.86), cableDark), x, 0.08, 0);
            addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 4.08, 10), cableDark), x, 2.04, 0);
            const terminal = addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.16, 0.64), boxDark), x, 2.66, 0);
            terminal.rotation.y = sideIndex === 0 ? -0.1 : 0.1;
            addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.64, 0.04), boxFace), x, 2.78, -0.35);
            for (let i = 0; i < 3; i++) {
                const led = addMesh(new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), i === 1 ? cableGreen.clone() : ledRed.clone()), x - 0.16 + i * 0.16, 2.2, -0.36);
                rig.leds.push({ mesh: led, phase: sideIndex * 1.7 + i * 0.45 });
            }
        });

        const cableRows = [
            { y: 2.05, z: -0.24, wave: 0.09 },
            { y: 2.58, z: 0.14, wave: -0.08 },
            { y: 3.1, z: -0.04, wave: 0.09 },
            { y: 3.62, z: 0.24, wave: -0.07 },
            { y: 4.02, z: -0.16, wave: 0.05 },
        ];
        const pulseGeo = new THREE.BoxGeometry(0.3, 0.12, 0.08);
        const sparkGeo = new THREE.BoxGeometry(0.1, 0.1, 0.05);

        cableRows.forEach((row, rowIndex) => {
            const points = [
                [-5.5, row.y, row.z],
                [-2.7, row.y + row.wave, row.z + 0.04],
                [0, row.y - row.wave * 0.72, row.z - 0.03],
                [2.7, row.y + row.wave * 0.86, row.z + 0.05],
                [5.5, row.y, row.z],
            ];
            makeTube(points, cableDark.clone(), 0.078, 50);
            const glow = makeTube(points, cableGlow.clone(), 0.032, 50);
            glow.castShadow = false;
            glow.receiveShadow = false;
            rig.glows.push({ mesh: glow, phase: rowIndex * 0.75 });

            for (let i = 0; i < 4; i++) {
                const mat = cableGreen.clone();
                const pulse = addMesh(new THREE.Mesh(pulseGeo, mat), -4.8 + i * 2.75, row.y, row.z + 0.09);
                pulse.castShadow = false;
                pulse.receiveShadow = false;
                rig.pulses.push({
                    mesh: pulse,
                    startX: rowIndex % 2 === 0 ? -5.25 : 5.25,
                    endX: rowIndex % 2 === 0 ? 5.25 : -5.25,
                    y: row.y,
                    z: row.z + 0.09,
                    phase: (i / 4) + rowIndex * 0.12,
                    speed: 0.55 + rowIndex * 0.04,
                });
            }
        });

        for (let i = 0; i < 36; i++) {
            const mat = i % 3 === 0 ? cableDark.clone() : cableGreen.clone();
            if (mat.emissive) mat.emissiveIntensity = 0.18 + Math.random() * 0.28;
            const spark = addMesh(new THREE.Mesh(sparkGeo, mat), -5.0 + Math.random() * 10.0, 1.88 + Math.random() * 2.25, -0.38 + Math.random() * 0.76);
            spark.scale.set(0.6 + Math.random() * 1.1, 0.48 + Math.random() * 0.9, 1);
            spark.castShadow = false;
            spark.receiveShadow = false;
            rig.sparks.push({
                mesh: spark,
                basePosition: spark.position.clone(),
                phase: Math.random() * Math.PI * 2,
            });
        }

        group.userData.lowBarrierNetwork = rig;
    } else if (type.id === 'crateStack') {
        const crtCase = new THREE.MeshStandardMaterial({ color: 0xd7c7ad, roughness: 0.64, metalness: 0.01 });
        const crtCaseDark = new THREE.MeshStandardMaterial({ color: 0xa99473, roughness: 0.72, metalness: 0.01 });
        const crtTrim = new THREE.MeshStandardMaterial({ color: 0xefe3ca, roughness: 0.56, metalness: 0.01 });
        const crtScreen = new THREE.MeshStandardMaterial({
            map: makeCrtAngryFaceTexture(),
            roughness: 0.36,
            metalness: 0.01,
            emissive: 0x123d1d,
            emissiveIntensity: 0.18,
            polygonOffset: true,
            polygonOffsetFactor: -2,
            polygonOffsetUnits: -2,
        });
        const chairCushion = new THREE.MeshStandardMaterial({ color: 0x111315, roughness: 0.78, metalness: 0.02 });
        const chairFrame = new THREE.MeshStandardMaterial({ color: 0x171b20, roughness: 0.55, metalness: 0.18 });
        const chairRubber = new THREE.MeshStandardMaterial({ color: 0x070809, roughness: 0.82, metalness: 0.02 });

        const backRest = addMesh(new THREE.Mesh(new THREE.BoxGeometry(1.72, 1.82, 0.24), chairCushion), 0, 1.58, -0.62);
        backRest.scale.x = 1.05;
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.12, 0.28), chairFrame), 0, 2.52, -0.61);
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.6, 0.26), chairFrame), -0.86, 1.62, -0.6);
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.6, 0.26), chairFrame), 0.86, 1.62, -0.6);

        const seat = addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.88, 0.98, 0.24, 28), chairCushion), 0, 0.72, -0.04);
        seat.scale.z = 0.72;
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.12, 0.84), chairFrame), 0, 0.84, -0.02);

        [-1, 1].forEach(side => {
            addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.56, 10), chairFrame), side * 0.98, 0.99, -0.32);
            addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.52, 10), chairFrame), side * 0.98, 0.98, 0.36);
            addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.13, 1.05), chairCushion), side * 1.02, 1.28, 0.02);
        });

        addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.72, 18), chairFrame), 0, 0.38, -0.03);
        addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.16, 18), chairFrame), 0, 0.16, -0.03);
        for (let i = 0; i < 5; i++) {
            const angle = i * Math.PI * 2 / 5;
            const x = Math.cos(angle);
            const zArm = Math.sin(angle);
            const baseArm = addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.12), chairFrame), x * 0.42, 0.12, -0.03 + zArm * 0.42);
            baseArm.rotation.y = -angle;
            const wheel = addMesh(new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), chairRubber), x * 0.9, 0.06, -0.03 + zArm * 0.9);
            wheel.scale.set(1.1, 0.58, 0.84);
        }
        const lever = addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.54, 8), chairFrame), -0.76, 0.62, 0.46);
        lever.rotation.z = 1.05;
        lever.rotation.x = 0.24;
        addMesh(new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), chairRubber), -1.03, 0.5, 0.5);

        const monitorLift = 0.82;
        const monitorScale = 1.14;
        const monitorParts = [];
        const addMonitorPart = (mesh, x, y, zPos, rotZ = 0) => {
            const part = addMesh(mesh, x, y, zPos, rotZ);
            monitorParts.push(part);
            return part;
        };

        const back = addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(1.66, 1.18, 0.9), crtCaseDark), 0, 1.05 + monitorLift, -0.16);
        back.scale.z = 1.08;
        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(1.92, 1.34, 0.28), crtCase), 0, 1.12 + monitorLift, 0.32);
        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(1.68, 1.1, 0.09), crtTrim), 0, 1.14 + monitorLift, 0.5);
        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.78, 0.06), black), 0, 1.18 + monitorLift, 0.56);

        const screen = addMonitorPart(new THREE.Mesh(new THREE.PlaneGeometry(1.14, 0.7), crtScreen), 0, 1.18 + monitorLift, 0.65);
        screen.receiveShadow = false;
        screen.castShadow = false;
        screen.renderOrder = 6;

        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.16, 0.34), crtTrim), 0, 1.86 + monitorLift, 0.5);
        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.18, 0.34), crtCaseDark), 0, 0.43 + monitorLift, 0.48);
        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.16, 0.34), crtTrim), -0.86, 1.15 + monitorLift, 0.5);
        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.16, 0.34), crtTrim), 0.86, 1.15 + monitorLift, 0.5);

        const button = addMonitorPart(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.055, 18), crtTrim), 0.62, 0.66 + monitorLift, 0.64);
        button.rotation.x = Math.PI / 2;
        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.04, 0.055), black), -0.54, 0.66 + monitorLift, 0.64);
        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.055), black), -0.54, 0.76 + monitorLift, 0.64);

        [-0.88, 0.88].forEach(side => {
            for (let i = 0; i < 4; i++) {
                addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.34), black), side, 0.86 + i * 0.12 + monitorLift, -0.08);
            }
        });
        addMonitorPart(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.18, 24), crtCaseDark), 0, 0.24 + monitorLift, -0.02);
        addMonitorPart(new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.14, 0.72), crtCaseDark), 0, 0.08 + monitorLift, 0);
        monitorParts.forEach(part => {
            part.scale.x *= monitorScale;
            part.scale.y *= monitorScale;
            part.scale.z *= monitorScale;
        });
        group.scale.set(0.82, 0.72, 0.82);
    } else if (type.id === 'roadBlock') {
        const virusGreen = new THREE.MeshStandardMaterial({
            color: 0x049d1c,
            emissive: 0x036a16,
            emissiveIntensity: 0.24,
            roughness: 0.42,
            metalness: 0.02,
        });
        const virusLight = new THREE.MeshStandardMaterial({
            color: 0x18c73b,
            emissive: 0x067a1b,
            emissiveIntensity: 0.18,
            roughness: 0.36,
            metalness: 0.01,
        });
        const virusEdge = new THREE.MeshStandardMaterial({
            color: 0x050505,
            emissive: 0x000000,
            emissiveIntensity: 0.02,
            roughness: 0.68,
            metalness: 0.01,
        });
        const virusFace = new THREE.MeshStandardMaterial({
            color: 0x020402,
            emissive: 0x001600,
            emissiveIntensity: 0.25,
            roughness: 0.58,
        });
        const virusGroup = new THREE.Group();
        virusGroup.position.y = 0.08;
        group.add(virusGroup);
        const pixels = [];
        const codeBlocks = [];
        const trailPlanes = [];
        const px = 0.24;
        const baseY = 0.44;
        const addVirusPixel = (gx, gy, mat = virusGreen, scaleX = 1, scaleY = 1) => {
            const outline = new THREE.Mesh(new THREE.BoxGeometry(px * 1.42 * scaleX, px * 1.42 * scaleY, 0.18), virusEdge);
            outline.position.set(gx * px, baseY + gy * px, -0.02);
            outline.castShadow = true;
            outline.receiveShadow = true;
            virusGroup.add(outline);

            const core = new THREE.Mesh(new THREE.BoxGeometry(px * 0.98 * scaleX, px * 0.98 * scaleY, 0.22), mat);
            core.position.set(gx * px, baseY + gy * px, 0.08);
            core.castShadow = true;
            core.receiveShadow = true;
            core.userData.basePosition = core.position.clone();
            core.userData.seed = pixels.length * 0.63;
            virusGroup.add(core);
            pixels.push(core);
            return core;
        };

        const shapeRows = {
            0: [-5, -4, -2, -1, 1, 2, 4, 5],
            1: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
            2: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
            3: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
            4: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
            5: [-3, -2, -1, 0, 1, 2, 3],
            6: [-2, 2],
            7: [-3, 3],
        };
        Object.entries(shapeRows).forEach(([gy, xs]) => {
            xs.forEach((gx, index) => addVirusPixel(Number(gx), Number(gy), (index + Number(gy)) % 6 === 0 ? virusLight : virusGreen));
        });
        addVirusPixel(-5.15, 0.65, virusGreen, 0.9, 2.2);
        addVirusPixel(5.15, 0.65, virusGreen, 0.9, 2.2);
        addVirusPixel(-2.35, -0.85, virusLight, 1.65, 0.78);
        addVirusPixel(2.35, -0.85, virusLight, 1.65, 0.78);

        const addFacePixel = (gx, gy, w = 1, h = 1) => {
            const face = new THREE.Mesh(new THREE.BoxGeometry(px * 0.94 * w, px * 0.94 * h, 0.22), virusFace);
            face.position.set(gx * px, baseY + gy * px, 0.2);
            face.castShadow = true;
            virusGroup.add(face);
            return face;
        };
        addFacePixel(-2.15, 3.15, 1.05, 1.3);
        addFacePixel(2.15, 3.15, 1.05, 1.3);
        addFacePixel(0, 1.05, 4.0, 0.82);

        const trailRimGeo = new THREE.BoxGeometry(0.42, 0.046, 0.28);
        const trailCoreGeo = new THREE.BoxGeometry(0.3, 0.032, 0.2);
        const trailSparkGeo = new THREE.BoxGeometry(0.13, 0.03, 0.13);
        for (let i = 0; i < 96; i++) {
            const rim = new THREE.Mesh(
                trailRimGeo,
                new THREE.MeshBasicMaterial({
                    color: 0x020402,
                    transparent: true,
                    depthWrite: false,
                    depthTest: true,
                    opacity: 0,
                })
            );
            const core = new THREE.Mesh(
                trailCoreGeo,
                new THREE.MeshBasicMaterial({
                    color: i % 4 === 0 ? 0x18c73b : 0x049d1c,
                    transparent: true,
                    depthWrite: false,
                    depthTest: true,
                    opacity: 0,
                })
            );
            const spark = new THREE.Mesh(
                trailSparkGeo,
                new THREE.MeshBasicMaterial({
                    color: 0x39f060,
                    transparent: true,
                    depthWrite: false,
                    depthTest: true,
                    opacity: 0,
                })
            );
            rim.visible = false;
            core.visible = false;
            spark.visible = false;
            rim.renderOrder = -3;
            core.renderOrder = -2;
            spark.renderOrder = -1;
            group.add(rim);
            group.add(core);
            group.add(spark);
            trailPlanes.push({ rim, core, spark, index: i });
        }

        const codeLabels = ['{}', '01', '</>', 'if', '&&', 'var', '()', 'bug'];
        for (let i = 0; i < 14; i++) {
            const mat = new THREE.MeshBasicMaterial({
                map: makeCodeBlockTexture(codeLabels[i % codeLabels.length]),
                transparent: true,
                depthWrite: false,
                opacity: 0.85,
            });
            const code = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.24), mat);
            const baseX = -1.08 + (i % 7) * 0.36 + (Math.random() - 0.5) * 0.08;
            const baseZ = -0.48 + Math.floor(i / 7) * 0.46;
            code.position.set(baseX, 0.12, baseZ);
            code.rotation.x = -0.18 + (Math.random() - 0.5) * 0.08;
            code.rotation.z = (Math.random() - 0.5) * 0.34;
            code.renderOrder = 6;
            group.add(code);
            codeBlocks.push({
                mesh: code,
                baseX,
                baseZ,
                phase: i / 14,
                drift: (Math.random() - 0.5) * 0.32,
                height: 0.62 + Math.random() * 0.58,
            });
        }

        group.userData.virus = {
            sprite: virusGroup,
            pixels,
            codeBlocks,
            trailPlanes,
            trailHistory: [],
            trailEmitTimer: 0,
            trailBreakTimer: 0,
            lastTrailDir: 0,
            trailDissolving: false,
            bounds: 5.9,
            lateralSpeed: 1.55,
            phase: Math.random() * Math.PI * 2,
            elapsed: 0,
        };
    } else if (type.id === 'crtRunner') {
        const crtCase = new THREE.MeshStandardMaterial({ color: 0xd7c7ad, roughness: 0.6, metalness: 0.01 });
        const crtSide = new THREE.MeshStandardMaterial({ color: 0xa68f72, roughness: 0.68, metalness: 0.01 });
        const crtFace = new THREE.MeshStandardMaterial({ color: 0x262b2e, roughness: 0.48, metalness: 0.02 });
        const neon = new THREE.MeshBasicMaterial({ color: 0x22e45e });
        const summonZ = 42;
        const body = new THREE.Group();
        body.visible = false;
        body.position.z = summonZ;
        group.add(body);

        const addBodyMesh = (mesh, x, y, zPos, rotZ = 0) => {
            mesh.position.set(x, y, zPos);
            mesh.rotation.z = rotZ;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            body.add(mesh);
            return mesh;
        };
        const shell = addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(1.36, 1.12, 0.78), crtCase), 0, 1.48, 0);
        shell.scale.z = 1.08;
        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.82, 0.08), crtFace), 0, 1.5, 0.45);
        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.72, 0.42), crtSide), -0.78, 1.48, -0.08);
        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.72, 0.42), crtSide), 0.78, 1.48, -0.08);
        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.2, 0.54), crtSide), 0, 0.82, -0.05);
        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.12, 0.58), crtCase), 0, 0.62, 0.02);
        addBodyMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), crtFace), 0.45, 1.02, 0.51).rotation.x = Math.PI / 2;

        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.055), neon), -0.3, 1.66, 0.52, 0.35);
        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 0.055), neon), 0.3, 1.66, 0.52, -0.35);
        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.09, 0.055), neon), 0, 1.26, 0.52);
        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.055), neon), -0.25, 1.29, 0.52, -0.12);
        addBodyMesh(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.055), neon), 0.25, 1.29, 0.52, 0.12);

        const limbs = [];
        const makeGlove = (side) => {
            const glove = new THREE.Group();
            const palm = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), white);
            palm.scale.set(1.1, 0.82, 0.64);
            glove.add(palm);
            for (let i = 0; i < 4; i++) {
                const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.22, 8), white);
                finger.position.set(side * (-0.08 + i * 0.052), 0.11 + (i % 2) * 0.035, 0.01);
                finger.rotation.z = side * (-0.55 + i * 0.18);
                glove.add(finger);
            }
            return glove;
        };
        [-1, 1].forEach(side => {
            const arm = new THREE.Group();
            arm.position.set(side * 0.78, 1.65, 0.05);
            const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.58, 8), black);
            upper.position.y = 0.28;
            upper.rotation.z = side * 0.55;
            arm.add(upper);
            const glove = makeGlove(side);
            glove.position.set(side * 0.3, 0.58, 0.02);
            glove.rotation.z = side * 0.22;
            arm.add(glove);
            body.add(arm);
            limbs.push({ part: arm, side, kind: 'arm', base: arm.rotation.clone() });
        });
        [-1, 1].forEach(side => {
            const leg = new THREE.Group();
            leg.position.set(side * 0.34, 0.64, 0.03);
            const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.7, 8), black);
            shin.position.y = -0.34;
            leg.add(shin);
            const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 8), black);
            shoe.position.set(side * 0.04, -0.72, 0.08);
            shoe.scale.set(1.38, 0.55, 0.82);
            leg.add(shoe);
            body.add(leg);
            limbs.push({ part: leg, side, kind: 'leg', base: leg.rotation.clone() });
        });

        const portalMat = new THREE.MeshBasicMaterial({
            map: makeGlitchPortalTexture(),
            transparent: true,
            depthWrite: false,
            depthTest: false,
            opacity: 1,
            blending: THREE.AdditiveBlending,
        });
        const portal = new THREE.Group();
        portal.position.set(0, 1.52, summonZ - 0.08);
        group.add(portal);
        const portalCore = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.05), portalMat);
        portalCore.renderOrder = 13;
        portal.add(portalCore);
        const portalBars = [];
        const portalBarData = [
            [-1.08, 0.76, 0.82, 0.045, 0x08fff0],
            [0.96, 0.62, 0.96, 0.04, 0xff1eca],
            [-0.94, 0.24, 0.58, 0.038, 0xfff500],
            [1.06, 0.08, 0.7, 0.04, 0x08fff0],
            [-0.74, -0.5, 0.86, 0.04, 0xff1eca],
            [0.58, -0.72, 0.68, 0.038, 0xfff500],
        ];
        portalBarData.forEach(([x, y, w, h, color], index) => {
            const mat = new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                depthWrite: false,
                opacity: 0.86,
                blending: THREE.AdditiveBlending,
            });
            const bar = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
            bar.position.set(x, y, 0.04 + index * 0.002);
            bar.renderOrder = 10;
            portal.add(bar);
            portalBars.push({
                mesh: bar,
                basePosition: bar.position.clone(),
                baseScale: bar.scale.clone(),
                phase: index * 1.37,
            });
        });
        portal.scale.set(0.08, 0.02, 1);
        group.userData.crtRunner = {
            body,
            limbs,
            portal,
            portalMat,
            portalBars,
            summonZ,
            predictedLane: lane,
            launched: false,
            elapsed: 0,
        };
    } else if (type.id === 'overheadSign') {
        const droneWhite = new THREE.MeshStandardMaterial({ color: 0xf5f5ee, roughness: 0.54, metalness: 0.03 });
        const droneInk = new THREE.MeshStandardMaterial({ color: 0x07090c, roughness: 0.58, metalness: 0.12 });
        const droneDark = new THREE.MeshStandardMaterial({ color: 0x1d2228, roughness: 0.62, metalness: 0.08 });
        const droneGlass = new THREE.MeshStandardMaterial({
            color: 0x101820,
            emissive: 0x071d2d,
            emissiveIntensity: 0.2,
            roughness: 0.34,
            metalness: 0.04,
        });
        const droneBlue = new THREE.MeshStandardMaterial({
            color: 0x2b9cff,
            emissive: 0x0b4d7a,
            emissiveIntensity: 0.28,
            roughness: 0.38,
            metalness: 0.02,
        });
        const droneSwarm = { drones: [], rotors: [] };
        const droneLift = 1.78;
        const rotorBladeGeo = new THREE.BoxGeometry(1.14, 0.038, 0.14);
        const rotorHubGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.06, 12);

        const addDrone = (x, zPos, scale = 1, phase = 0) => {
            const drone = new THREE.Group();
            drone.position.set(x, 0, zPos);
            drone.scale.setScalar(scale);
            drone.userData.kind = 'slide';
            group.add(drone);
            droneSwarm.drones.push({ group: drone, phase, baseZ: zPos });

            const localAdd = (mesh, px, py, pz, rz = 0) => {
                mesh.position.set(px, py + droneLift, pz);
                mesh.rotation.z = rz;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.userData.kind = 'slide';
                drone.add(mesh);
                return mesh;
            };

            const bodyShadow = localAdd(new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 12), droneInk), 0, 2.18, 0);
            bodyShadow.scale.set(1.08, 0.82, 0.82);
            const body = localAdd(new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 14), droneWhite), 0, 2.24, 0.02);
            body.scale.set(0.88, 1.28, 0.76);
            const belly = localAdd(new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), droneGlass), 0, 1.62, 0.26);
            belly.scale.set(1.18, 1.08, 0.78);
            localAdd(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.22, 12), droneBlue), 0, 1.44, 0.28).rotation.x = Math.PI / 2;
            const lowerSensor = localAdd(new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), droneInk), 0, 1.28, 0.12);
            lowerSensor.scale.set(0.9, 1.28, 0.9);

            const armConfigs = [
                [-0.48, 0.22, -0.34, 0.34],
                [0.48, 0.22, 0.34, 0.34],
                [-0.48, -0.22, -0.34, -0.34],
                [0.48, -0.22, 0.34, -0.34],
            ];
            armConfigs.forEach(([motorX, motorZ, armX, armZ], index) => {
                const arm = localAdd(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.055, 0.06), droneInk), armX * 0.5, 2.22, armZ * 0.5);
                arm.rotation.y = Math.atan2(motorZ, motorX);
                const motor = localAdd(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.12, 14), droneDark), motorX, 2.25, motorZ);
                motor.rotation.x = Math.PI / 2;
                const rotor = new THREE.Group();
                rotor.position.set(motorX, 2.42 + droneLift, motorZ);
                rotor.userData.kind = 'slide';
                drone.add(rotor);
                const hub = new THREE.Mesh(rotorHubGeo, droneInk);
                hub.rotation.x = Math.PI / 2;
                hub.castShadow = true;
                rotor.add(hub);
                const bladeA = new THREE.Mesh(rotorBladeGeo, droneInk);
                const bladeB = new THREE.Mesh(rotorBladeGeo, droneInk);
                bladeB.rotation.y = Math.PI / 2;
                bladeA.castShadow = true;
                bladeB.castShadow = true;
                rotor.add(bladeA, bladeB);
                droneSwarm.rotors.push({ group: rotor, phase: phase + index * 0.46, speed: 18 + index * 1.7, baseY: 2.42 + droneLift });
            });

            const eyeLeft = localAdd(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.035, 0.035), droneBlue), -0.12, 2.28, 0.36, -0.15);
            const eyeRight = localAdd(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.035, 0.035), droneBlue), 0.12, 2.28, 0.36, 0.15);
            eyeLeft.userData.baseScale = eyeLeft.scale.clone();
            eyeRight.userData.baseScale = eyeRight.scale.clone();
        };

        [-4.1, -2.05, 0, 2.05, 4.1].forEach((x, index) => {
            const zOffset = index % 2 === 0 ? 0.02 : -0.16;
            addDrone(x, zOffset, index === 2 ? 1.08 : 0.98, index * 0.74);
        });
        group.userData.droneSwarm = droneSwarm;
    } else if (type.id === 'snakeDesk') {
        const snakeRig = new THREE.Group();
        snakeRig.userData.kind = 'block';
        snakeRig.scale.set(1.18, 1.18, 1.12);
        group.add(snakeRig);

        const cobraParts = {
            rig: snakeRig,
            spots: [],
            belly: [],
            eyes: [],
            pupils: [],
            tongue: null,
            head: null,
            wallMode: true,
            lookYaw: 0,
            lookPitch: 0,
        };

        const addSnakeMesh = (mesh, x, y, zPos, rotZ = 0) => {
            mesh.position.set(x, y, zPos);
            mesh.rotation.z = rotZ;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData.kind = 'block';
            snakeRig.add(mesh);
            return mesh;
        };

        const shadow = addSnakeMesh(
            new THREE.Mesh(
                new THREE.CircleGeometry(1.15, 34),
                new THREE.MeshBasicMaterial({ color: 0x050705, transparent: true, opacity: 0.28, depthWrite: false })
            ),
            0,
            0.035,
            0.04
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.scale.set(1.25, 0.72, 1);

        const cobraPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.72, 0.26, 0.08),
            new THREE.Vector3(-1.02, 0.48, 0.02),
            new THREE.Vector3(-0.82, 0.78, -0.1),
            new THREE.Vector3(-0.16, 0.92, -0.12),
            new THREE.Vector3(0.72, 0.68, 0.02),
            new THREE.Vector3(0.9, 0.38, 0.12),
            new THREE.Vector3(0.24, 0.2, 0.1),
            new THREE.Vector3(-0.58, 0.34, -0.06),
            new THREE.Vector3(-0.76, 0.7, -0.08),
            new THREE.Vector3(-0.24, 1.04, -0.02),
            new THREE.Vector3(0.3, 1.28, 0.02),
            new THREE.Vector3(0.34, 1.72, 0.02),
            new THREE.Vector3(0.12, 2.12, 0.04),
            new THREE.Vector3(-0.06, 2.55, 0.08),
            new THREE.Vector3(0.04, 2.94, 0.14),
            new THREE.Vector3(0.18, 3.16, 0.22),
        ]);

        const cobraBody = new THREE.Mesh(new THREE.TubeGeometry(cobraPath, 130, 0.23, 18, false), snakeMat);
        cobraBody.castShadow = true;
        cobraBody.receiveShadow = true;
        cobraBody.userData.kind = 'block';
        snakeRig.add(cobraBody);
        cobraParts.body = cobraBody;

        const tail = addSnakeMesh(new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.52, 10), snakeMat), -0.98, 0.42, 0.08);
        tail.rotation.z = 1.2;
        tail.rotation.x = -0.2;

        const hoodBackLeft = addSnakeMesh(new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 14), snakeDark), -0.36, 2.68, 0.04);
        hoodBackLeft.scale.set(0.72, 1.08, 0.24);
        hoodBackLeft.rotation.z = -0.24;
        const hoodBackRight = addSnakeMesh(new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 14), snakeDark), 0.38, 2.68, 0.04);
        hoodBackRight.scale.set(0.72, 1.08, 0.24);
        hoodBackRight.rotation.z = 0.24;
        const hoodLeft = addSnakeMesh(new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 14), snakeMat), -0.32, 2.68, 0.1);
        hoodLeft.scale.set(0.64, 0.98, 0.2);
        hoodLeft.rotation.z = -0.22;
        const hoodRight = addSnakeMesh(new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 14), snakeMat), 0.34, 2.68, 0.1);
        hoodRight.scale.set(0.64, 0.98, 0.2);
        hoodRight.rotation.z = 0.22;

        for (let i = 0; i < 13; i++) {
            const y = 1.06 + i * 0.14;
            const x = Math.sin(i * 0.48) * 0.12;
            const plate = addSnakeMesh(new THREE.Mesh(new THREE.BoxGeometry(0.44 - i * 0.01, 0.075, 0.055), snakeLight), x, y, 0.28, Math.sin(i * 0.6) * 0.12);
            plate.userData.basePosition = plate.position.clone();
            cobraParts.belly.push(plate);
        }
        for (let i = 0; i < 8; i++) {
            const y = 2.08 + i * 0.13;
            const plate = addSnakeMesh(new THREE.Mesh(new THREE.BoxGeometry(0.34 - i * 0.012, 0.065, 0.055), snakeLight), Math.sin(i * 0.55) * 0.06, y, 0.32, Math.sin(i) * 0.08);
            plate.userData.basePosition = plate.position.clone();
            cobraParts.belly.push(plate);
        }

        for (let i = 2; i < 35; i++) {
            const point = cobraPath.getPoint(i / 36);
            if (point.y > 2.78 && Math.abs(point.x) < 0.35) continue;
            const spot = addSnakeMesh(
                new THREE.Mesh(new THREE.DodecahedronGeometry(i % 3 === 0 ? 0.085 : 0.06, 0), i % 5 === 0 ? snakeLight : snakeDark),
                point.x + (i % 2 ? 0.18 : -0.18),
                point.y + 0.12,
                point.z + (i % 2 ? 0.12 : -0.1)
            );
            spot.scale.set(1.1, 0.52, 0.75);
            spot.rotation.y = i * 0.3;
            spot.userData.basePosition = spot.position.clone();
            cobraParts.spots.push(spot);
        }

        const headRig = new THREE.Group();
        headRig.position.set(0.14, 3.18, 0.38);
        headRig.userData.kind = 'block';
        headRig.userData.baseRotation = headRig.rotation.clone();
        snakeRig.add(headRig);
        cobraParts.head = headRig;

        const addHeadMesh = (mesh, x, y, zPos, rotZ = 0) => {
            mesh.position.set(x, y, zPos);
            mesh.rotation.z = rotZ;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData.kind = 'block';
            headRig.add(mesh);
            return mesh;
        };

        const head = addHeadMesh(new THREE.Mesh(new THREE.DodecahedronGeometry(0.48, 0), snakeMat), 0, 0, 0);
        head.scale.set(1.18, 0.76, 0.95);
        const snout = addHeadMesh(new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 10), snakeMat), 0, -0.06, 0.3);
        snout.scale.set(1.25, 0.62, 1.15);
        const brow = addHeadMesh(new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.07, 0.1), snakeDark), 0, 0.15, 0.38, -0.04);
        brow.userData.basePosition = brow.position.clone();

        for (const eyeX of [-0.16, 0.16]) {
            const eye = addHeadMesh(new THREE.Mesh(new THREE.SphereGeometry(0.105, 14, 8), red), eyeX, 0.16, 0.48);
            eye.scale.set(1.18, 0.92, 0.72);
            const pupil = addHeadMesh(new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 6), black), eyeX, 0.16, 0.545);
            eye.userData.basePosition = eye.position.clone();
            pupil.userData.basePosition = pupil.position.clone();
            cobraParts.eyes.push(eye);
            cobraParts.pupils.push(pupil);
        }

        for (const fangX of [-0.12, 0.12]) {
            const fang = addHeadMesh(new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.28, 8), white), fangX, -0.26, 0.5);
            fang.rotation.x = Math.PI;
            fang.rotation.z = fangX * 0.35;
        }
        const mouth = addHeadMesh(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.045, 0.08), black), 0, -0.18, 0.5);
        mouth.rotation.z = -0.04;

        const makeTongue = points => {
            const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(point[0], point[1], point[2])));
            const tongue = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.022, 6, false), red);
            tongue.castShadow = false;
            tongue.receiveShadow = false;
            tongue.userData.kind = 'block';
            headRig.add(tongue);
            return tongue;
        };
        const tongueStem = makeTongue([[0, -0.21, 0.56], [0.02, -0.34, 0.72], [0, -0.43, 0.86]]);
        makeTongue([[0, -0.43, 0.86], [-0.09, -0.48, 0.98]]);
        makeTongue([[0, -0.43, 0.86], [0.09, -0.48, 0.98]]);
        tongueStem.userData.basePosition = tongueStem.position.clone();
        cobraParts.tongue = tongueStem;

        group.userData.snake = cobraParts;
    } else if (false && type.id === 'snakeDesk') {
        const tableY = 2.42;
        const monitorY = 3.08;
        const tableWood = new THREE.MeshStandardMaterial({ color: 0x9b5528, roughness: 0.5, metalness: 0.02 });
        const tableEdge = new THREE.MeshStandardMaterial({ color: 0x6b3719, roughness: 0.58, metalness: 0.01 });
        const tableTop = addMesh(new THREE.Mesh(new THREE.BoxGeometry(11.35, 0.32, 1.62), tableWood), 0, tableY, 0);
        tableTop.userData.kind = 'slide';
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(11.55, 0.1, 0.1), tableEdge), 0, tableY + 0.18, 0.86);
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(11.55, 0.1, 0.1), tableEdge), 0, tableY + 0.18, -0.86);
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.62), tableEdge), -5.7, tableY + 0.18, 0);
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.62), tableEdge), 5.7, tableY + 0.18, 0);
        for (let i = 0; i < 14; i++) {
            const x = -5.1 + i * 0.78;
            const grain = addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.38 + Math.random() * 0.55, 0.026, 0.032), woodDark), x, tableY + 0.188, -0.55 + (i % 4) * 0.35, (Math.random() - 0.5) * 0.14);
            grain.scale.y = 0.5;
        }
        const apronY = tableY - 0.27;
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(11.05, 0.22, 0.13), tableEdge), 0, apronY, 0.76);
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(11.05, 0.22, 0.13), tableEdge), 0, apronY, -0.76);
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.22, 1.42), tableEdge), -5.48, apronY, 0);
        addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.22, 1.42), tableEdge), 5.48, apronY, 0);
        const legHeight = tableY - 0.16;
        for (const x of [-5.1, 5.1]) {
            for (const zLeg of [-0.66, 0.66]) {
                const leg = addMesh(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, legHeight, 14), tableWood), x, legHeight * 0.5, zLeg);
                leg.userData.kind = 'slide';
            }
        }

        const computers = [[-3.4, 0.1, -0.08], [0, -0.04, 0.04], [3.4, 0.08, 0.1]];
        const addComputerPart = (mesh, pcX, pcY, pcZ, tilt, offX = 0, offY = 0, offZ = 0, extraRotZ = 0) => {
            const cos = Math.cos(tilt);
            const sin = Math.sin(tilt);
            const part = addMesh(
                mesh,
                pcX + offX * cos - offY * sin,
                pcY + offX * sin + offY * cos,
                pcZ + offZ,
                tilt + extraRotZ
            );
            part.userData.kind = 'slide';
            return part;
        };
        const crtCase = new THREE.MeshStandardMaterial({ color: 0xe5d8be, roughness: 0.58, metalness: 0.01 });
        const crtCaseDark = new THREE.MeshStandardMaterial({ color: 0xb69c78, roughness: 0.66, metalness: 0.01 });
        const crtFace = new THREE.MeshStandardMaterial({ color: 0x1a1d21, roughness: 0.48, metalness: 0.02 });

        const addCrtBreakRing = (pcX, y, zPos, tilt, front = true) => {
            const depth = front ? 0.13 : -0.13;
            const pieces = [
                [0, 0.46, 1.14, 0.11, -0.04],
                [0, -0.46, 1.1, 0.11, 0.04],
                [-0.58, 0, 0.11, 0.72, 0.06],
                [0.58, 0, 0.11, 0.72, -0.06],
                [-0.46, 0.36, 0.24, 0.07, -0.45],
                [0.46, -0.36, 0.24, 0.07, -0.45],
                [0.46, 0.36, 0.24, 0.07, 0.45],
                [-0.46, -0.36, 0.24, 0.07, 0.45],
            ];
            pieces.forEach(([offX, offY, w, h, rot], index) => {
                const material = index < 4 ? crtFace : black;
                addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.055), material), pcX, y, zPos, tilt, offX, offY, depth, rot);
            });
        };

        const addBrokenCrtMonitor = (pcX, pcZ, tilt, variant) => {
            const faceZ = pcZ + 0.5;
            const backZ = pcZ - 0.34;
            const bodyY = monitorY - 0.02;

            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.3, 0.72), crtCase), pcX, bodyY, pcZ, tilt, 0, 0.68, -0.08, -0.035);
            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.28, 0.72), crtCase), pcX, bodyY, pcZ, tilt, 0, -0.68, -0.08, 0.03);
            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.98, 0.72), crtCase), pcX, bodyY, pcZ, tilt, -0.9, 0, -0.08, 0.025);
            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.98, 0.72), crtCase), pcX, bodyY, pcZ, tilt, 0.9, 0, -0.08, -0.025);

            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.16, 0.12), crtCaseDark), pcX, bodyY, backZ, tilt, 0, 0.48, 0);
            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.16, 0.12), crtCaseDark), pcX, bodyY, backZ, tilt, 0, -0.48, 0);
            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.72, 0.12), crtCaseDark), pcX, bodyY, backZ, tilt, -0.72, 0, 0);
            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.72, 0.12), crtCaseDark), pcX, bodyY, backZ, tilt, 0.72, 0, 0);

            addCrtBreakRing(pcX, bodyY, faceZ, tilt, true);
            addCrtBreakRing(pcX, bodyY, backZ, tilt, false);

            const glassBits = [
                [-0.74, 0.48, 0.2, 0.06, -0.36],
                [0.76, 0.48, 0.22, 0.06, 0.34],
                [-0.78, -0.48, 0.22, 0.055, 0.36],
                [0.78, -0.48, 0.2, 0.055, -0.34],
                [-0.34, 0.64, 0.25, 0.05, 0.1],
                [0.34, -0.64, 0.25, 0.05, -0.1],
            ];
            glassBits.forEach(([offX, offY, w, h, rot], index) => {
                addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.045), index % 2 ? screenMat : glassMat), pcX, bodyY, faceZ, tilt, offX, offY, 0.2 + variant * 0.015, rot);
            });

            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.08), crtFace), pcX, bodyY, faceZ, tilt, 0.7, -0.58, 0.17);
            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.08), crtFace), pcX, bodyY, faceZ, tilt, 0.48, -0.6, 0.18);
            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.22), crtCase), pcX, tableY + 0.18, pcZ - 0.05, tilt);
            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.12, 0.52), crtCaseDark), pcX, tableY + 0.39, pcZ + 0.45, tilt);

            addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.09, 0.38), white), pcX, tableY + 0.41, pcZ + 0.78, tilt, 0.18);
            for (let key = 0; key < 8; key++) {
                const keyX = pcX - 0.34 + key * 0.1;
                addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.025, 0.045), black), keyX, tableY + 0.475, pcZ + 0.78 + (key % 2) * 0.08, tilt);
            }
            const tower = addComputerPart(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.92, 0.52), crtCase), pcX, tableY + 0.58, pcZ - 0.46, tilt - 0.04, -0.92);
            tower.rotation.x = 0.12;
            addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.035), glassMat), pcX - 0.92, tableY + 0.82, pcZ - 0.2, tilt - 0.04);
            addMesh(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.035), black), pcX - 0.92, tableY + 0.46, pcZ - 0.2, tilt - 0.04);
        };

        computers.forEach(([pcX, pcZ, tilt], index) => addBrokenCrtMonitor(pcX, pcZ, tilt, index));

        const snakeRig = new THREE.Group();
        snakeRig.userData.kind = 'slide';
        group.add(snakeRig);
        const addSnakeMesh = (mesh, x, y, zPos, rotZ = 0) => {
            mesh.position.set(x, y, zPos);
            mesh.rotation.z = rotZ;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData.kind = 'slide';
            snakeRig.add(mesh);
            return mesh;
        };
        const backPassZ = computers.map(([, pcZ]) => pcZ - 0.34);
        const frontPassZ = computers.map(([, pcZ]) => pcZ + 0.5);
        const snakePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-5.65, monitorY + 0.1, backPassZ[0] - 0.1),
            new THREE.Vector3(-4.45, monitorY + 0.26, backPassZ[0] - 0.02),
            new THREE.Vector3(-3.4, monitorY + 0.02, frontPassZ[0]),
            new THREE.Vector3(-2.25, monitorY + 0.3, frontPassZ[0] + 0.1),
            new THREE.Vector3(-1.15, monitorY + 0.36, frontPassZ[1] + 0.08),
            new THREE.Vector3(0, monitorY + 0.02, backPassZ[1]),
            new THREE.Vector3(1.14, monitorY + 0.34, backPassZ[1] - 0.08),
            new THREE.Vector3(2.25, monitorY + 0.32, backPassZ[2] - 0.05),
            new THREE.Vector3(3.4, monitorY + 0.02, frontPassZ[2]),
            new THREE.Vector3(4.48, monitorY + 0.34, frontPassZ[2] + 0.04),
            new THREE.Vector3(5.14, monitorY + 0.84, 0.58),
            new THREE.Vector3(5.62, monitorY + 0.78, 0.94),
        ]);
        const snakeBody = new THREE.Mesh(new THREE.TubeGeometry(snakePath, 118, 0.31, 16, false), snakeMat);
        snakeBody.castShadow = true;
        snakeBody.receiveShadow = true;
        snakeBody.userData.kind = 'slide';
        snakeRig.add(snakeBody);
        const snakeParts = { rig: snakeRig, body: snakeBody, spots: [], belly: [], eyes: [], pupils: [], tongue: null, head: null, lookYaw: 0, lookPitch: 0 };
        const isCrossingCrtHole = point => computers.some(([pcX]) => Math.abs(point.x - pcX) < 0.68 && point.y < monitorY + 0.18);

        for (let i = 1; i < 28; i++) {
            const point = snakePath.getPoint(i / 29);
            if (isCrossingCrtHole(point)) continue;
            const spot = addSnakeMesh(new THREE.Mesh(new THREE.DodecahedronGeometry(i % 3 === 0 ? 0.14 : 0.105, 0), i % 4 === 0 ? snakeLight : snakeDark), point.x, point.y + 0.26, point.z + (i % 2 === 0 ? 0.19 : -0.19));
            spot.scale.set(1.18, 0.48, 0.74);
            spot.rotation.y = i * 0.41;
            spot.userData.basePosition = spot.position.clone();
            snakeParts.spots.push(spot);
        }
        for (let i = 0; i < 16; i++) {
            const point = snakePath.getPoint(i / 15);
            if (isCrossingCrtHole(point)) continue;
            const belly = addSnakeMesh(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.045, 0.1), snakeLight), point.x, point.y - 0.24, point.z + 0.02);
            belly.rotation.y = i * 0.25;
            belly.userData.basePosition = belly.position.clone();
            snakeParts.belly.push(belly);
        }

        const headRig = new THREE.Group();
        headRig.position.set(5.64, monitorY + 0.82, 0.98);
        headRig.userData.kind = 'slide';
        headRig.userData.baseRotation = headRig.rotation.clone();
        snakeRig.add(headRig);
        const addHeadMesh = (mesh, x, y, zPos, rotZ = 0) => {
            mesh.position.set(x, y, zPos);
            mesh.rotation.z = rotZ;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.userData.kind = 'slide';
            headRig.add(mesh);
            return mesh;
        };
        const head = addHeadMesh(new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), snakeMat), 0, 0, 0);
        head.scale.set(1.25, 0.9, 1.1);
        snakeParts.head = headRig;
        const brow = addHeadMesh(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.12), snakeDark), 0, 0.2, 0.28, -0.03);
        brow.userData.basePosition = brow.position.clone();
        const jaw = addHeadMesh(new THREE.Mesh(new THREE.ConeGeometry(0.29, 0.52, 6), snakeDark), 0, -0.14, 0.34);
        jaw.rotation.x = Math.PI / 2;
        jaw.userData.basePosition = jaw.position.clone();
        for (const eyeX of [-0.16, 0.16]) {
            const eye = addHeadMesh(new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), white), eyeX, 0.18, 0.43);
            const pupil = addHeadMesh(new THREE.Mesh(new THREE.SphereGeometry(0.056, 8, 6), black), eyeX, 0.18, 0.51);
            eye.userData.basePosition = eye.position.clone();
            pupil.userData.basePosition = pupil.position.clone();
            pupil.scale.set(1.12, 1.12, 1.12);
            snakeParts.eyes.push(eye);
            snakeParts.pupils.push(pupil);
        }
        const tongue = addHeadMesh(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.045, 0.66), red), 0, -0.18, 0.72);
        tongue.userData.basePosition = tongue.position.clone();
        snakeParts.tongue = tongue;
        const tail = addSnakeMesh(new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.66, 8), snakeMat), -5.78, monitorY + 0.1, backPassZ[0] - 0.12);
        tail.rotation.z = Math.PI / 2;
        tail.userData.baseRotation = tail.rotation.clone();
        snakeParts.tail = tail;
        group.userData.snake = snakeParts;
    }

    group.position.set(LANES[lane], 0, z);
    world.add(group);
    const obstacle = {
        type: 'obstacle',
        obstacleType: type,
        lane,
        group,
        hitbox: type.hitbox,
        hit: false,
    };
    liveObjects.push(obstacle);
    rememberSpawnedObstacle(type);
    liftCollectiblesAroundJumpObstacle(obstacle);
    return obstacle;
}

function liftCollectiblesAroundJumpObstacle(obstacle) {
    if (!canCollectibleArcOverObstacle(obstacle.obstacleType)) return;
    for (const obj of liveObjects) {
        if ((obj.type !== 'collectible' && obj.type !== 'power') || !obstacleAffectsLane(obstacle, obj.lane) || obj.hit) continue;
        if (Math.abs(obj.group.position.z - obstacle.group.position.z) > COLLECTIBLE_PATH.jumpArcRadius) continue;
        setCollectiblePathHeight(obj);
    }
}

function obstacleAffectsLane(obj, lane) {
    return obj.obstacleType?.multiLane || obj.lane === lane;
}

function isObstacleSpotClearOfCollectibles(type, lane, z) {
    if (canCollectibleArcOverObstacle(type)) return true;
    return liveObjects.every(obj => {
        if ((obj.type !== 'collectible' && obj.type !== 'power') || obj.hit) return true;
        if (!type.multiLane && obj.lane !== lane) return true;
        return Math.abs(obj.group.position.z - z) >= COLLECTIBLE_PATH.blockedObstacleGap;
    });
}

function getCurrentPlayerLaneIndex() {
    if (!player?.group) return targetLaneIndex;
    let nearestLane = targetLaneIndex;
    let nearestDistance = Infinity;
    LANES.forEach((x, index) => {
        const distance = Math.abs(player.group.position.x - x);
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestLane = index;
        }
    });
    return nearestLane;
}

function getPredictedPlayerLaneIndex(leadSeconds = 0.36) {
    if (!player?.group) return targetLaneIndex;
    const targetX = LANES[targetLaneIndex];
    const predictedX = targetX + (player.group.position.x - targetX) * Math.exp(-GAMEPLAY.laneEase * leadSeconds);
    let nearestLane = targetLaneIndex;
    let nearestDistance = Infinity;
    LANES.forEach((x, index) => {
        const distance = Math.abs(predictedX - x);
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestLane = index;
        }
    });
    return nearestLane;
}

function findObstacleSpawnLane(type, z, candidateLanes = [0, 1, 2]) {
    const lanes = [...candidateLanes].sort(() => Math.random() - 0.5);
    return lanes.find(lane => isObstacleSpotClearOfCollectibles(type, lane, z));
}

function getDifficultyProgress() {
    const progress = THREE.MathUtils.clamp(runTime / DIFFICULTY_TUNING.rampSeconds, 0, 1);
    return progress * progress * (3 - 2 * progress);
}

function getDifficultyValue(start, end) {
    return THREE.MathUtils.lerp(start, end, getDifficultyProgress());
}

function getObstacleWeight(type) {
    if (type.weightStart !== undefined && type.weightEnd !== undefined) {
        return getDifficultyValue(type.weightStart, type.weightEnd);
    }
    return type.weight ?? 1;
}

function getObstacleRepeatPenalty(type) {
    const recentIndex = recentObstacleIds.indexOf(type.id);
    if (recentIndex === -1) return 1;
    return OBSTACLE_REPEAT_PENALTIES[recentIndex] ?? 0.7;
}

function getObstacleSpacingPenalty(type) {
    const conflicts = OBSTACLE_SPACING_CONFLICTS[type.id];
    if (!conflicts) return 1;
    let penalty = 1;
    Object.entries(conflicts).forEach(([otherId, penalties]) => {
        const recentIndex = recentObstacleIds.indexOf(otherId);
        if (recentIndex === -1) return;
        penalty = Math.min(penalty, penalties[recentIndex] ?? 1);
    });
    return penalty;
}

function rememberSpawnedObstacle(type) {
    recentObstacleIds = [type.id, ...recentObstacleIds.filter(id => id !== type.id)].slice(0, OBSTACLE_REPEAT_MEMORY);
}

function randomObstacleType(kind = null, { allowMultiLane = true, allowSolo = true } = {}) {
    const pool = OBSTACLE_TYPES.filter(type => {
        if (kind && type.kind !== kind) return false;
        if (!allowMultiLane && type.multiLane) return false;
        if (!allowSolo && type.solo) return false;
        return true;
    });
    const totalWeight = pool.reduce((sum, type) => sum + getObstacleWeight(type) * getObstacleRepeatPenalty(type) * getObstacleSpacingPenalty(type), 0);
    let roll = Math.random() * totalWeight;
    for (const type of pool) {
        roll -= getObstacleWeight(type) * getObstacleRepeatPenalty(type) * getObstacleSpacingPenalty(type);
        if (roll <= 0) return type;
    }
    return pool[pool.length - 1];
}

function spawnObstacleInLanes(type, z, candidateLanes = [0, 1, 2]) {
    let spawnType = type;
    if (spawnType.solo) {
        const targetedLane = getPredictedPlayerLaneIndex(0.32);
        if (isObstacleSpotClearOfCollectibles(spawnType, targetedLane, z)) return createObstacle(spawnType, targetedLane, z);
        return null;
    }
    if (spawnType.multiLane) {
        if (isObstacleSpotClearOfCollectibles(spawnType, 1, z)) return createObstacle(spawnType, 1, z);
        spawnType = randomObstacleType(null, { allowMultiLane: false, allowSolo: false });
    }
    let lane = findObstacleSpawnLane(spawnType, z, candidateLanes);
    if (lane === undefined && !canCollectibleArcOverObstacle(spawnType)) {
        spawnType = randomObstacleType('jump', { allowMultiLane: false });
        lane = findObstacleSpawnLane(spawnType, z, candidateLanes);
    }
    if (lane === undefined) return null;
    return createObstacle(spawnType, lane, z);
}

function spawnWave() {
    const z = -118;
    if (DEBUG_CRT_RUNNER_ONLY) {
        const crtRunner = OBSTACLE_TYPES.find(type => type.id === 'crtRunner');
        if (crtRunner) createObstacle(crtRunner, getPredictedPlayerLaneIndex(0.32), z);
        return;
    }
    if (DEBUG_SNAKE_DESK_ONLY) {
        const snakeDesk = OBSTACLE_TYPES.find(type => type.id === 'snakeDesk');
        if (snakeDesk) createObstacle(snakeDesk, 1, z);
        return;
    }
    if (DEBUG_CRT_MONITOR_ONLY) {
        const crtMonitor = OBSTACLE_TYPES.find(type => type.id === 'crateStack');
        if (crtMonitor) createObstacle(crtMonitor, targetLaneIndex, z);
        return;
    }
    if (DEBUG_TRAFFIC_CONES_ONLY) {
        const trafficCones = OBSTACLE_TYPES.find(type => type.id === 'trafficCones');
        if (trafficCones) createObstacle(trafficCones, targetLaneIndex, z);
        return;
    }
    if (DEBUG_LOW_BARRIER_ONLY) {
        const lowBarrier = OBSTACLE_TYPES.find(type => type.id === 'lowBarrier');
        if (lowBarrier) createObstacle(lowBarrier, 1, z);
        return;
    }
    if (DEBUG_ROAD_BLOCK_ONLY) {
        const roadBlock = OBSTACLE_TYPES.find(type => type.id === 'roadBlock');
        if (roadBlock) createObstacle(roadBlock, 1, z);
        return;
    }
    if (DEBUG_OVERHEAD_SIGN_ONLY) {
        const overheadSign = OBSTACLE_TYPES.find(type => type.id === 'overheadSign');
        if (overheadSign) createObstacle(overheadSign, 1, z);
        return;
    }
    const firstObstacle = spawnObstacleInLanes(randomObstacleType(), z);
    if (!firstObstacle) return;
    if (firstObstacle.obstacleType.multiLane || firstObstacle.obstacleType.solo) return;

    if (Math.random() < getDifficultyValue(DIFFICULTY_TUNING.secondObstacleStart, DIFFICULTY_TUNING.secondObstacleEnd)) {
        const secondLanes = [0, 1, 2].filter(lane => lane !== firstObstacle.lane);
        const secondObstacle = spawnObstacleInLanes(randomObstacleType(null, { allowMultiLane: false, allowSolo: false }), z - 7, secondLanes);
        if (secondObstacle && Math.random() < getDifficultyValue(DIFFICULTY_TUNING.thirdObstacleStart, DIFFICULTY_TUNING.thirdObstacleEnd)) {
            const thirdLanes = [0, 1, 2].filter(lane => lane !== firstObstacle.lane && lane !== secondObstacle.lane);
            spawnObstacleInLanes(randomObstacleType(null, { allowMultiLane: false, allowSolo: false }), z - 14, thirdLanes);
        }
    }
}

function isCollectibleSpotClear(lane, z, gap = 5.8) {
    return liveObjects.every(obj => {
        if (obj.type !== 'obstacle' || !obstacleAffectsLane(obj, lane)) return true;
        if (canCollectibleArcOverObstacle(obj.obstacleType)) return true;
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
    if (DEBUG_SINGLE_OBSTACLE_ONLY) return;
    const startZ = -112;
    const bookZs = [0, -4, -8, -12].map(offset => startZ + offset);
    const lane = findClearCollectibleLane(bookZs);
    if (lane === undefined) return;
    const topic = COURSE_TOPICS[Math.floor(Math.random() * COURSE_TOPICS.length)];
    for (const z of bookZs) createCollectible(topic, lane, z);

    if (powerCooldownTimer <= 0 && Math.random() < getDifficultyValue(DIFFICULTY_TUNING.powerChanceStart, DIFFICULTY_TUNING.powerChanceEnd)) {
        const powerSpot = findClearCollectibleSpot(
            [0, 1, 2].filter(candidateLane => candidateLane !== lane),
            [-106, -122, -130]
        );
        if (powerSpot) {
            createPowerUp(powerSpot.lane, powerSpot.z);
            powerCooldownTimer = getDifficultyValue(DIFFICULTY_TUNING.powerCooldownStart, DIFFICULTY_TUNING.powerCooldownEnd);
        }
    }
}

function clearRunObjects() {
    recentObstacleIds = [];
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

function clearPlayerActionState({ ground = false } = {}) {
    activeKeys.clear();
    isSliding = false;
    isFastDropping = false;
    pendingGroundRoll = false;
    slideTimer = 0;
    slideElapsed = 0;
    slideVisualDuration = GAMEPLAY.slideDuration;
    rollRecoveryTimer = 0;
    playerVelocityY = 0;
    laneSlideKick = 0;
    if (ground) player.group.position.y = 0;
    player.group.rotation.z = 0;
    player.group.scale.set(1, 1, 1);
    resetPlayerRootTransform();
    if (player.alertMark) player.alertMark.visible = false;
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
    hideQuizPanel();
    activeQuiz = null;
    quizRescueCount = 0;
    if (!DEBUG_QUIZ_ORDERED_TEST) quizQuestionPools = {};
    quizInvulnerabilityTimer = 0;
    score = 0;
    distance = 0;
    runTime = 0;
    speed = GAMEPLAY.startSpeed;
    spawnTimer = 0.55;
    collectibleTimer = 0.3;
    shield = 0;
    multiplierTimer = 0;
    powerCooldownTimer = 4;
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
    laneSlideKick = 0;
    playerVelocityY = 0;
    isSliding = false;
    isFastDropping = false;
    pendingGroundRoll = false;
    quizInvulnerabilityTimer = 0;
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
    player.shadow.visible = false;
    player.shieldAura.visible = false;
    if (player.alertMark) player.alertMark.visible = false;
    if (player.root) applyCustomizationToRoot(player.root);
    hudScore.textContent = '0';
}

function startGame() {
    rankingEditorEnabled = false;
    activeKeys.clear();
    audioManager.unlock();
    resetGame();
    audioManager.startRunMusic();
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
    audioManager.pauseMusicForGameOver();
    audioManager.stopAmbient();
    audioManager.play(score > bestScore ? 'record' : 'hit');
    quizPanel.hidden = true;
    activeQuiz = null;
    state = 'gameover';
    isSliding = false;
    isFastDropping = false;
    pendingGroundRoll = false;
    slideTimer = 0;
    slideElapsed = 0;
    rollRecoveryTimer = 0;
    playerVelocityY = 0;
    laneSlideKick = 0;
    player.group.rotation.z = 0;
    player.group.scale.set(1, 1, 1);
    player.group.visible = true;
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

function getQuizRuleForRun() {
    if (quizRescueCount > 1 || runTime >= 120) return QUIZ_RULES.hard;
    if (quizRescueCount >= 1 || runTime >= 60) return QUIZ_RULES.medium;
    return QUIZ_RULES.easy;
}

function shuffleQuizItems(items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getQuizQuestionForRule(rule) {
    if (!quizQuestionPools[rule.id]?.length) {
        const bank = QUIZ_QUESTIONS.filter(item => item.difficulty === rule.id);
        quizQuestionPools[rule.id] = shuffleQuizItems(bank.length ? bank : QUIZ_QUESTIONS);
    }
    return quizQuestionPools[rule.id].pop();
}

function getOrderedQuizQuestionForTest() {
    if (!QUIZ_QUESTIONS.length) return null;
    const question = QUIZ_QUESTIONS[quizOrderedTestCursor % QUIZ_QUESTIONS.length];
    quizOrderedTestCursor = (quizOrderedTestCursor + 1) % QUIZ_QUESTIONS.length;
    return question;
}

function createQuizPayload() {
    const question = DEBUG_QUIZ_ORDERED_TEST ? getOrderedQuizQuestionForTest() : getQuizQuestionForRule(getQuizRuleForRun());
    if (!question) return null;
    const rule = DEBUG_QUIZ_ORDERED_TEST
        ? (QUIZ_RULES[question.difficulty] || QUIZ_RULES.easy)
        : getQuizRuleForRun();

    const sourceOptions = question.options.map((text, index) => ({
        text,
        correct: index === question.answer,
    }));
    const desiredCount = Math.min(rule.optionCount, sourceOptions.length);
    let selectedOptions = sourceOptions.slice(0, desiredCount);
    const correctOption = sourceOptions.find(option => option.correct);
    if (correctOption && !selectedOptions.some(option => option.correct)) {
        selectedOptions[Math.max(0, selectedOptions.length - 1)] = correctOption;
    }
    if (!DEBUG_QUIZ_ORDERED_TEST) selectedOptions = shuffleQuizItems(selectedOptions);

    return {
        rule,
        question: question.question,
        options: selectedOptions,
        answerIndex: selectedOptions.findIndex(option => option.correct),
        timeLimit: rule.timeLimit,
        timeLeft: rule.timeLimit,
    };
}

function updateQuizTimerUi(payload = activeQuiz) {
    if (!quizTimer || !quizTimerBar || !payload?.timeLimit) {
        if (quizTimer) quizTimer.hidden = true;
        if (quizTimer) delete quizTimer.dataset.warning;
        if (quizTimerBar) quizTimerBar.style.transform = 'scaleX(1)';
        return;
    }
    const ratio = THREE.MathUtils.clamp(payload.timeLeft / payload.timeLimit, 0, 1);
    quizTimer.hidden = false;
    quizTimerBar.style.transform = `scaleX(${ratio})`;
    quizTimer.dataset.warning = ratio <= 0.32 ? 'true' : 'false';
}

function renderQuiz(payload) {
    quizDifficulty.textContent = payload.rule.label;
    quizDifficulty.dataset.difficulty = payload.rule.id;
    quizQuestion.textContent = payload.question;
    quizFeedback.textContent = '';
    delete quizFeedback.dataset.kind;
    quizOptions.innerHTML = '';
    quizOptions.dataset.count = String(payload.options.length);
    updateQuizTimerUi(payload);
    payload.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.type = 'button';
        button.dataset.index = String(index);
        const letter = document.createElement('span');
        letter.className = 'quiz-option-letter';
        letter.textContent = `${String.fromCharCode(65 + index)})`;
        const text = document.createElement('span');
        text.className = 'quiz-option-text';
        text.textContent = option.text;
        button.append(letter, text);
        quizOptions.appendChild(button);
    });
    quizPanel.hidden = false;
}

function hideQuizPanel() {
    quizPanel.hidden = true;
    quizOptions.innerHTML = '';
    delete quizOptions.dataset.count;
    delete quizDifficulty.dataset.difficulty;
    if (quizTimer) quizTimer.hidden = true;
    if (quizTimer) delete quizTimer.dataset.warning;
    if (quizTimerBar) quizTimerBar.style.transform = 'scaleX(1)';
    quizFeedback.textContent = '';
    delete quizFeedback.dataset.kind;
}

function timeOutQuiz() {
    if (!activeQuiz || activeQuiz.locked) return;
    activeQuiz.locked = true;
    const quizId = activeQuiz.id;
    revealQuizAnswer(activeQuiz.answerIndex, -1, true);
    quizFeedback.textContent = 'Tempo esgotado.';
    quizFeedback.dataset.kind = 'bad';
    setTimeout(() => failQuizRescue(quizId), QUIZ_FAIL_REVEAL_DELAY);
}

function updateQuiz(delta) {
    if (!activeQuiz || activeQuiz.locked || !activeQuiz.timeLimit) return;
    activeQuiz.timeLeft = Math.max(0, activeQuiz.timeLeft - delta);
    updateQuizTimerUi(activeQuiz);
    if (activeQuiz.timeLeft <= 0) timeOutQuiz();
}

function startQuizRescue(obstacle) {
    const payload = createQuizPayload();
    if (!payload) {
        endGame();
        return;
    }

    activeQuiz = {
        id: ++quizSerial,
        obstacle,
        locked: false,
        ...payload,
    };

    state = 'quiz';
    activeKeys.clear();
    audioManager.stopAmbient();
    audioManager.pauseMusicForQuiz();
    audioManager.play('quizOpen');
    isSliding = false;
    isFastDropping = false;
    pendingGroundRoll = false;
    slideTimer = 0;
    slideElapsed = 0;
    rollRecoveryTimer = 0;
    playerVelocityY = 0;
    laneSlideKick = 0;
    player.group.rotation.z = 0;
    resetPlayerRootTransform();
    if (player.alertMark) player.alertMark.visible = false;
    playPlayerAction('Idle', { fallback: 'Run', fade: 0.08 });
    shake = Math.max(shake, 0.42);
    burstAt(player.group.position.x, 1.2, player.group.position.z, 0xff4d4d);
    renderQuiz(activeQuiz);
    updatePauseUi();
    renderRanking();
}

function finishQuizRescue(quizId) {
    if (!activeQuiz || activeQuiz.id !== quizId) return;
    const rescuedObstacle = activeQuiz.obstacle;
    activeQuiz = null;
    hideQuizPanel();
    audioManager.stopQuizMusic({ resumeMain: true });

    if (rescuedObstacle && liveObjects.includes(rescuedObstacle) && !rescuedObstacle.destroying) {
        startShieldDestroy(rescuedObstacle);
        audioManager.play('shieldBreak');
    }

    quizRescueCount++;
    quizInvulnerabilityTimer = QUIZ_RECOVERY_INVULNERABILITY;
    state = 'running';
    clock.getDelta();
    audioManager.startAmbient();
    playPlayerAction('Run');
    showComboPopup('VIDA EXTRA!', '#20c997');
    addScore(45);
    updatePauseUi();
    renderRanking();
}

function failQuizRescue(quizId) {
    if (!activeQuiz || activeQuiz.id !== quizId) return;
    activeQuiz = null;
    hideQuizPanel();
    audioManager.stopQuizMusic({ resumeMain: false });
    endGame();
}

function revealQuizAnswer(answerIndex, selectedIndex = -1, blinkCorrect = false) {
    const buttons = [...quizOptions.querySelectorAll('.quiz-option')];
    buttons.forEach((button, buttonIndex) => {
        button.disabled = true;
        button.dataset.selected = buttonIndex === selectedIndex ? 'true' : 'false';
        if (buttonIndex === answerIndex) {
            button.dataset.correct = 'true';
            if (blinkCorrect) button.dataset.reveal = 'true';
        }
        if (selectedIndex >= 0 && buttonIndex === selectedIndex && buttonIndex !== answerIndex) {
            button.dataset.wrong = 'true';
        }
    });
}

function answerQuiz(index) {
    if (!activeQuiz || activeQuiz.locked) return;
    if (index < 0 || index >= activeQuiz.options.length) return;
    activeQuiz.locked = true;
    const quizId = activeQuiz.id;
    const correct = index === activeQuiz.answerIndex;
    revealQuizAnswer(activeQuiz.answerIndex, index, !correct);

    if (correct) {
        quizFeedback.textContent = 'Resposta certa. Vida recuperada.';
        quizFeedback.dataset.kind = 'ok';
        setTimeout(() => finishQuizRescue(quizId), QUIZ_SUCCESS_DELAY);
    } else {
        quizFeedback.textContent = 'Resposta errada.';
        quizFeedback.dataset.kind = 'bad';
        setTimeout(() => failQuizRescue(quizId), QUIZ_FAIL_REVEAL_DELAY);
    }
}

function addScore(points) {
    const progress = THREE.MathUtils.clamp(runTime / SCORE_TUNING.rampSeconds, 0, 1);
    const eased = progress * progress * (3 - 2 * progress);
    const ramp = THREE.MathUtils.lerp(SCORE_TUNING.rampStart, SCORE_TUNING.rampEnd, eased);
    const mult = multiplierTimer > 0 ? SCORE_TUNING.bitcoinMultiplier : 1;
    score += points * ramp * mult;
    hudScore.textContent = String(Math.floor(score));
}

function showLearn(topic) {
    rankingPanel.dataset.lastTopic = topic.tag;
}

function makeSpark(x, y, z, color = 0xffffff, options = {}) {
    const geometry = options.geometry || new THREE.SphereGeometry(options.size ?? 0.08, 8, 6);
    const spark = new THREE.Mesh(
        geometry,
        options.material || new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: options.opacity ?? 1,
            depthWrite: false,
            depthTest: options.depthTest ?? true,
        })
    );
    spark.position.set(x, y, z);
    if (options.scale instanceof THREE.Vector3) {
        spark.scale.copy(options.scale);
    } else if (Array.isArray(options.scale)) {
        spark.scale.set(options.scale[0], options.scale[1], options.scale[2]);
    } else if (options.scale) {
        spark.scale.setScalar(options.scale);
    }
    if (options.rotation) spark.rotation.set(options.rotation.x || 0, options.rotation.y || 0, options.rotation.z || 0);
    spark.renderOrder = options.renderOrder ?? 0;
    spark.userData.vel = options.velocity || new THREE.Vector3((Math.random() - 0.5) * 4, Math.random() * 2.4 + 0.8, (Math.random() - 0.5) * 4);
    spark.userData.life = options.life ?? 0.45;
    spark.userData.maxLife = spark.userData.life;
    spark.userData.gravity = options.gravity ?? 8;
    spark.userData.drag = options.drag ?? 0;
    spark.userData.spin = options.spin || null;
    spark.userData.shrink = options.shrink ?? 0;
    spark.userData.baseScale = spark.scale.clone();
    spark.userData.baseOpacity = spark.material.opacity ?? 1;
    scene.add(spark);
    sparks.push(spark);
    return spark;
}

function burstAt(x, y, z, color) {
    for (let i = 0; i < 14; i++) makeSpark(x, y, z, color);
}

function radialVelocity(angle, speedOut, up = 1.2, zSquash = 1) {
    return new THREE.Vector3(
        Math.cos(angle) * speedOut,
        up,
        Math.sin(angle) * speedOut * zSquash
    );
}

function collectBurstAt(x, y, z, color, kind = 'book') {
    const isBitcoin = kind === 'bitcoin';
    const accent = isBitcoin ? 0xffd36a : 0x9be56b;
    const darkAccent = isBitcoin ? 0x8b4c08 : 0x123d22;
    const shardGeo = isBitcoin
        ? new THREE.DodecahedronGeometry(0.14, 0)
        : new THREE.BoxGeometry(0.19, 0.1, 0.09);

    makeSpark(x, y, z, accent, {
        geometry: new THREE.TorusGeometry(0.56, 0.032, 8, 42),
        scale: [1.14, 0.84, 1.14],
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
        velocity: new THREE.Vector3(0, 0.42, 0),
        life: 0.34,
        gravity: 0,
        opacity: 0.84,
        shrink: -0.9,
        depthTest: false,
        renderOrder: 9,
    });

    for (let i = 0; i < 22; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speedOut = 1.95 + Math.random() * 2.95;
        const shardColor = i % 5 === 0 ? 0xfff6c7 : i % 3 === 0 ? accent : color;
        makeSpark(x, y + 0.08, z, shardColor, {
            geometry: shardGeo,
            scale: isBitcoin
                ? 0.86 + Math.random() * 0.48
                : [0.9 + Math.random() * 0.62, 0.76 + Math.random() * 0.4, 0.82 + Math.random() * 0.38],
            life: 0.52 + Math.random() * 0.2,
            gravity: 5.2,
            drag: 0.8,
            spin: new THREE.Vector3(
                (Math.random() - 0.5) * 9,
                (Math.random() - 0.5) * 9,
                (Math.random() - 0.5) * 9
            ),
            shrink: 0.28,
            depthTest: false,
            renderOrder: 8,
            velocity: radialVelocity(angle, speedOut, 1.25 + Math.random() * 1.95, 0.82),
        });
    }

    for (let i = 0; i < 9; i++) {
        const angle = Math.random() * Math.PI * 2;
        makeSpark(x, y + 0.18, z, i % 2 === 0 ? 0xffffff : darkAccent, {
            size: 0.075 + Math.random() * 0.045,
            life: 0.28 + Math.random() * 0.14,
            gravity: 1.6,
            drag: 1.4,
            depthTest: false,
            renderOrder: 10,
            velocity: radialVelocity(angle, 2.7 + Math.random() * 1.9, 0.8 + Math.random() * 1.2, 0.78),
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

function getMaterialColorHex(material, fallback = 0xffffff) {
    const source = Array.isArray(material)
        ? material.find(item => item?.color)
        : material;
    return source?.color?.getHex?.() ?? fallback;
}

function obstacleBreakBurstAt(obj) {
    const center = obj.group.position.clone();
    const fallbackColor = obj.obstacleType?.color ?? 0xffc94a;
    const pieces = [];
    obj.group.traverse(child => {
        if (!child.isMesh || pieces.length >= 26) return;
        if (Math.random() < 0.28 && pieces.length > 8) return;
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        pieces.push({
            position: worldPos,
            color: getMaterialColorHex(child.material, fallbackColor),
        });
    });

    const shardGeo = new THREE.BoxGeometry(0.2, 0.12, 0.16);
    const pebbleGeo = new THREE.DodecahedronGeometry(0.12, 0);
    for (const piece of pieces) {
        const angle = Math.atan2(piece.position.z - center.z, piece.position.x - center.x) + (Math.random() - 0.5) * 1.1;
        const speedOut = 2.0 + Math.random() * 3.1;
        makeSpark(piece.position.x, piece.position.y + 0.12, piece.position.z, piece.color, {
            geometry: Math.random() > 0.35 ? shardGeo : pebbleGeo,
            scale: [0.72 + Math.random() * 0.75, 0.58 + Math.random() * 0.5, 0.6 + Math.random() * 0.55],
            life: 0.58 + Math.random() * 0.24,
            gravity: 6.6,
            drag: 0.55,
            spin: new THREE.Vector3(
                (Math.random() - 0.5) * 11,
                (Math.random() - 0.5) * 11,
                (Math.random() - 0.5) * 11
            ),
            shrink: 0.18,
            velocity: radialVelocity(angle, speedOut, 1.4 + Math.random() * 2.2, 0.82),
        });
    }

    for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        makeSpark(center.x, 0.72 + Math.random() * 1.1, center.z, i % 2 ? 0x20262b : 0xfff2c4, {
            size: 0.08 + Math.random() * 0.05,
            life: 0.35 + Math.random() * 0.18,
            gravity: 3.8,
            drag: 1.0,
            velocity: radialVelocity(angle, 1.4 + Math.random() * 1.8, 0.75 + Math.random() * 1.1, 0.8),
        });
    }
}

function shieldBreakBurstAt(x, y, z) {
    const teal = 0x38f0c2;
    const ink = 0x101411;
    const pale = 0xb9fff1;

    makeSpark(x, y + 0.04, z, pale, {
        geometry: new THREE.SphereGeometry(0.7, 24, 14),
        velocity: new THREE.Vector3(0, 0.1, 0),
        life: 0.22,
        gravity: 0,
        opacity: 0.34,
        shrink: -1.35,
        depthTest: false,
        renderOrder: 12,
    });

    for (let i = 0; i < 3; i++) {
        makeSpark(x, y + 0.12, z, i === 0 ? teal : ink, {
            geometry: new THREE.TorusGeometry(0.62 + i * 0.2, 0.03, 8, 46),
            rotation: new THREE.Vector3(Math.PI / 2 + i * 0.24, i * 0.18, i * 0.7),
            velocity: new THREE.Vector3(0, 0.48 + i * 0.18, -0.15),
            life: 0.36 + i * 0.075,
            gravity: 0.15,
            opacity: i === 0 ? 0.9 : i === 1 ? 0.68 : 0.54,
            shrink: -0.78,
            depthTest: false,
            renderOrder: 11,
        });
    }

    const shellGeo = new THREE.DodecahedronGeometry(0.1, 0);
    const shellShardGeo = new THREE.BoxGeometry(0.32, 0.12, 0.052);
    for (let i = 0; i < 26; i++) {
        const angle = Math.random() * Math.PI * 2;
        const height = -0.62 + Math.random() * 1.38;
        const radial = Math.sqrt(Math.max(0.05, 1 - height * height));
        const shellX = Math.cos(angle) * radial * 1.02;
        const shellY = height * 0.96;
        const shellZ = Math.sin(angle) * radial * 0.66;
        makeSpark(x + shellX, y + shellY, z + shellZ, i % 4 === 0 ? pale : i % 5 === 0 ? ink : teal, {
            geometry: shellShardGeo,
            scale: [0.82 + Math.random() * 0.72, 0.78 + Math.random() * 0.54, 0.82 + Math.random() * 0.42],
            rotation: new THREE.Vector3(Math.random() * Math.PI, angle, Math.random() * Math.PI),
            life: 0.56 + Math.random() * 0.2,
            gravity: 3.4,
            drag: 0.8,
            spin: new THREE.Vector3(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12
            ),
            shrink: 0.28,
            depthTest: false,
            renderOrder: 11,
            velocity: new THREE.Vector3(
                shellX * (2.65 + Math.random() * 1.45),
                0.82 + shellY * 1.08 + Math.random() * 1.35,
                shellZ * (3.0 + Math.random() * 1.35) - 0.34
            ),
        });
    }

    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speedOut = 2.55 + Math.random() * 3.65;
        makeSpark(x, y + 0.05, z, i % 4 === 0 ? pale : i % 3 === 0 ? ink : teal, {
            geometry: shellGeo,
            scale: [0.92 + Math.random() * 0.6, 0.8 + Math.random() * 0.5, 0.78 + Math.random() * 0.48],
            life: 0.5 + Math.random() * 0.22,
            gravity: 4.6,
            drag: 0.9,
            spin: new THREE.Vector3(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12
            ),
            shrink: 0.36,
            depthTest: false,
            renderOrder: 10,
            velocity: radialVelocity(angle, speedOut, 1.15 + Math.random() * 2.1, 0.76),
        });
    }
}

function startShieldDestroy(obj) {
    obj.hit = true;
    obj.destroying = true;
    obj.destroyTimer = 0.48;
    obj.destroyDuration = obj.destroyTimer;
    obj.group.userData.destroyBaseScale = obj.group.scale.clone();
    obstacleBreakBurstAt(obj);
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

function queueAirborneRoll() {
    if (pendingGroundRoll) return;
    pendingGroundRoll = true;
    isSliding = false;
    isFastDropping = true;
    slideTimer = 0;
    slideElapsed = 0;
    playerVelocityY = -GAMEPLAY.fastDropVelocity;
    playPlayerAction('Jump', { fade: 0.05 });
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

function canCollectObject(obj, dx, dz) {
    const playerCollectY = player.group.position.y + COLLECTIBLE_PATH.playerCenterY;
    const dy = Math.abs(obj.group.position.y - playerCollectY);
    return dx < obj.radius && dz < obj.radius && dy < COLLECTIBLE_PATH.verticalCollectRadius;
}

function updateNetworkRouterObstacle(obj, delta, t) {
    obj.group.position.y = Math.abs(Math.sin(t * 5 + obj.group.position.z)) * 0.025;
    const rig = obj.group.userData.networkRouters;
    if (!rig) return;

    rig.signals.forEach(({ core, outline, phase, baseCorePosition, baseOutlinePosition }, index) => {
        const flow = (t * 1.35 + phase * 0.17 + index * 0.09) % 1;
        const breathe = Math.sin(flow * Math.PI);
        const jitter = Math.sin(t * 8.4 + phase + index) * 0.025;
        const lift = flow * 0.18;
        const spread = 1 + flow * 0.1 + breathe * 0.05;
        const opacity = 0.2 + breathe * 0.78;

        core.position.copy(baseCorePosition);
        outline.position.copy(baseOutlinePosition);
        core.position.x += jitter;
        outline.position.x += jitter;
        core.position.y += lift;
        outline.position.y += lift;
        core.position.z += Math.sin(t * 5.2 + phase) * 0.018;
        outline.position.z = core.position.z - 0.012;

        core.material.opacity = opacity;
        outline.material.opacity = 0.22 + opacity * 0.52;
        core.scale.set(spread, 1 + breathe * 0.16, spread);
        outline.scale.copy(core.scale);
    });

    rig.bits.forEach(({ mesh, basePosition, phase }, index) => {
        const wave = Math.sin(t * 4.6 + phase);
        mesh.position.x = basePosition.x + wave * 0.035;
        mesh.position.y = basePosition.y + Math.sin(t * 5.8 + phase) * 0.055;
        mesh.rotation.z += delta * (0.8 + index * 0.035);
        mesh.material.opacity = 0.38 + Math.abs(Math.sin(t * 6.8 + phase)) * 0.48;
    });

    rig.leds.forEach(({ mesh, phase }) => {
        const blink = 0.32 + Math.abs(Math.sin(t * 9.5 + phase)) * 0.68;
        mesh.material.emissiveIntensity = 0.32 + blink * 0.85;
        mesh.scale.setScalar(0.85 + blink * 0.22);
    });

    rig.bodies.forEach(({ group: routerGroup, phase, baseYaw = 0 }) => {
        routerGroup.rotation.z = Math.sin(t * 3.4 + phase) * 0.018;
        routerGroup.rotation.y = baseYaw + Math.sin(t * 2.6 + phase) * 0.025;
        routerGroup.position.y = Math.abs(Math.sin(t * 5.2 + phase)) * 0.025;
    });
}

function updateLowBarrierObstacle(obj, delta, t) {
    obj.group.position.y = Math.sin(t * 4.1 + obj.group.position.z * 0.08) * 0.018;
    const rig = obj.group.userData.lowBarrierNetwork;
    if (!rig) return;

    rig.pulses.forEach(({ mesh, startX, endX, y, z, phase, speed }, index) => {
        const flow = (t * speed + phase) % 1;
        const pulse = Math.sin(flow * Math.PI);
        mesh.position.x = THREE.MathUtils.lerp(startX, endX, flow);
        mesh.position.y = y + Math.sin(t * 8.5 + index) * 0.018;
        mesh.position.z = z + Math.cos(t * 6.2 + index) * 0.012;
        mesh.rotation.z = Math.sin(t * 5.8 + phase * 8) * 0.18;
        mesh.scale.x = 0.7 + pulse * 0.8;
        mesh.material.emissiveIntensity = 0.24 + pulse * 0.72;
    });

    rig.sparks.forEach(({ mesh, basePosition, phase }, index) => {
        const flicker = Math.abs(Math.sin(t * 7.8 + phase));
        mesh.position.copy(basePosition);
        mesh.position.x += Math.sin(t * 2.6 + phase) * 0.05;
        mesh.position.y += Math.sin(t * 5.4 + phase) * 0.06;
        mesh.rotation.z += delta * (1.5 + (index % 4) * 0.35);
        mesh.scale.setScalar(0.45 + flicker * 0.95);
        if (mesh.material.emissive) mesh.material.emissiveIntensity = 0.08 + flicker * 0.7;
    });

    rig.glows.forEach(({ mesh, phase }) => {
        mesh.material.opacity = 0.24 + Math.abs(Math.sin(t * 3.9 + phase)) * 0.34;
    });

    rig.leds.forEach(({ mesh, phase }) => {
        const blink = Math.abs(Math.sin(t * 8.2 + phase));
        mesh.scale.setScalar(0.8 + blink * 0.32);
        if (mesh.material.emissive) mesh.material.emissiveIntensity = 0.28 + blink * 0.8;
    });
}

function updateDroneSwarmObstacle(obj, delta, t) {
    const swarm = obj.group.userData.droneSwarm;
    if (!swarm) return;

    swarm.drones.forEach(({ group: drone, phase, baseZ }, index) => {
        const hover = Math.sin(t * 4.1 + phase);
        drone.position.y = hover * 0.07;
        drone.position.z = baseZ + Math.sin(t * 2.7 + phase) * 0.035;
        drone.rotation.z = Math.sin(t * 3.8 + phase) * 0.045;
        drone.rotation.x = Math.cos(t * 3.2 + phase) * 0.025;
        if (index === 2) drone.scale.setScalar(1.08 + Math.sin(t * 4 + phase) * 0.015);
    });

    swarm.rotors.forEach(({ group: rotor, phase, speed, baseY }, index) => {
        rotor.rotation.y += delta * speed * (index % 2 === 0 ? 1 : -1);
        rotor.position.y = baseY + Math.sin(t * 6.4 + phase) * 0.025;
    });
}

function updateGlitchVirusObstacle(obj, delta, t) {
    const virus = obj.group.userData.virus;
    if (!virus) return;

    virus.elapsed += delta;
    const sweepPhase = virus.elapsed * virus.lateralSpeed + virus.phase;
    const laneSweep = Math.sin(sweepPhase);
    const lateralVelocity = Math.cos(sweepPhase);
    const absLateralVelocity = Math.abs(lateralVelocity);
    let trailDir = virus.lastTrailDir || 1;
    if (absLateralVelocity > 0.12) {
        const currentTrailDir = Math.sign(lateralVelocity);
        if (virus.lastTrailDir && currentTrailDir !== virus.lastTrailDir) {
            const oldDir = virus.lastTrailDir;
            const xs = virus.trailHistory.map(point => point.x);
            const minX = Math.min(...xs, obj.group.position.x);
            const maxX = Math.max(...xs, obj.group.position.x);
            const span = Math.max(0.01, maxX - minX);
            virus.trailHistory.forEach(point => {
                const order = oldDir > 0
                    ? (point.x - minX) / span
                    : (maxX - point.x) / span;
                point.dissolving = true;
                point.dissolveAge = 0;
                point.dissolveDelay = order * 0.16;
                point.dissolveDuration = 0.13 + Math.random() * 0.05;
            });
            const edgeX = laneSweep * virus.bounds;
            for (let i = 0; i < 5; i++) {
                virus.trailHistory.unshift({
                    x: edgeX - currentTrailDir * (0.28 + i * 0.13 + Math.random() * 0.08),
                    z: -0.1 + (Math.random() - 0.5) * 0.24,
                    age: 0,
                    life: 1.25,
                    phase: Math.random() * Math.PI * 2,
                    scaleX: 1.08 + Math.random() * 0.76,
                    scaleZ: 0.9 + Math.random() * 0.58,
                    sparkScale: 0.82 + Math.random() * 0.9,
                    rot: (Math.random() - 0.5) * 0.34,
                });
            }
            virus.trailBreakTimer = 0.02;
            virus.trailEmitTimer = 0;
        }
        virus.lastTrailDir = currentTrailDir;
        trailDir = currentTrailDir;
    }
    obj.group.position.x = laneSweep * virus.bounds;
    obj.group.rotation.y = Math.sin(virus.elapsed * 3.2 + virus.phase) * 0.05;

    const glitchPulse = Math.abs(Math.sin(virus.elapsed * 8.4 + virus.phase));
    virus.sprite.position.y = 0.08 + Math.sin(virus.elapsed * 7.2 + virus.phase) * 0.045;
    virus.sprite.scale.set(
        1 + glitchPulse * 0.035,
        1 - glitchPulse * 0.025,
        1
    );

    virus.pixels.forEach((pixel, index) => {
        const base = pixel.userData.basePosition;
        if (!base) return;
        const pop = Math.sin(virus.elapsed * 13 + pixel.userData.seed) > 0.82 ? 1 : 0;
        pixel.position.x = base.x + pop * (index % 2 ? 0.045 : -0.045);
        pixel.position.y = base.y + Math.sin(virus.elapsed * 5.6 + pixel.userData.seed) * 0.01;
        pixel.position.z = base.z + pop * 0.035;
    });

    virus.trailBreakTimer = Math.max(0, virus.trailBreakTimer - delta);
    virus.trailEmitTimer -= delta;
    if (virus.trailEmitTimer <= 0 && virus.trailBreakTimer <= 0 && absLateralVelocity > 0.1) {
        virus.trailHistory.unshift({
            x: obj.group.position.x - trailDir * (0.44 + Math.random() * 0.28),
            z: -0.1 + (Math.random() - 0.5) * 0.2,
            age: 0,
            life: 1.25,
            phase: Math.random() * Math.PI * 2,
            scaleX: 1.04 + Math.random() * 0.82,
            scaleZ: 0.9 + Math.random() * 0.58,
            sparkScale: 0.82 + Math.random() * 0.9,
            rot: (Math.random() - 0.5) * 0.34,
        });
        virus.trailHistory.length = Math.min(virus.trailHistory.length, virus.trailPlanes.length);
        virus.trailEmitTimer = 0.012 + (1 - absLateralVelocity) * 0.014;
    }

    virus.trailHistory.forEach(point => {
        point.age += delta;
        if (point.dissolving) point.dissolveAge += delta;
    });
    virus.trailHistory = virus.trailHistory.filter(point => {
        if (point.dissolving) {
            return point.dissolveAge < point.dissolveDelay + point.dissolveDuration;
        }
        return point.age < point.life;
    });
    virus.trailPlanes.forEach(({ rim, core, spark, index }) => {
        const point = virus.trailHistory[index];
        if (!point) {
            rim.visible = false;
            core.visible = false;
            spark.visible = false;
            return;
        }
        const ageRatio = THREE.MathUtils.clamp(point.age / point.life, 0, 1);
        const naturalFade = THREE.MathUtils.clamp(1 - Math.max(0, ageRatio - 0.46) / 0.54, 0, 1);
        let dissolveFade = 1;
        if (point.dissolving) {
            const dissolveProgress = THREE.MathUtils.clamp((point.dissolveAge - point.dissolveDelay) / point.dissolveDuration, 0, 1);
            dissolveFade = 1 - dissolveProgress;
        }
        const ageFade = naturalFade * dissolveFade;
        const indexFade = Math.max(0.35, THREE.MathUtils.clamp(1 - index / virus.trailPlanes.length, 0, 1));
        const pulse = 0.9 + Math.sin(t * 12 + point.phase) * 0.14;
        const bubble = Math.sin(ageRatio * Math.PI) * (0.012 + Math.sin(t * 9 + point.phase) * 0.004);
        const x = point.x - obj.group.position.x;
        const z = point.z + Math.sin(t * 5 + point.phase) * 0.012;
        const rot = point.rot + Math.sin(t * 5 + point.phase) * 0.028;
        rim.visible = true;
        core.visible = true;
        spark.visible = ageRatio < 0.55 || point.dissolving;
        rim.position.set(x, 0.03 + index * 0.0002, z);
        core.position.set(x, 0.05 + bubble + index * 0.0002, z);
        spark.position.set(
            x + Math.sin(t * 11 + point.phase) * 0.035,
            0.075 + bubble * 0.6 + Math.sin(ageRatio * Math.PI) * 0.025,
            z + Math.cos(t * 9 + point.phase) * 0.03
        );
        rim.rotation.y = rot;
        core.rotation.y = rot;
        spark.rotation.y = rot + t * 2.2;
        rim.scale.set(point.scaleX * (0.98 + indexFade * 0.3), 1, point.scaleZ * (0.94 + indexFade * 0.2));
        core.scale.set(point.scaleX * (0.78 + indexFade * 0.24) * pulse, 1, point.scaleZ * (0.72 + indexFade * 0.18) * pulse);
        const sparkPop = point.dissolving
            ? Math.sin((1 - dissolveFade) * Math.PI)
            : Math.sin(ageRatio * Math.PI);
        spark.scale.setScalar(point.sparkScale * (0.54 + indexFade * 0.3) * Math.max(0.18, sparkPop));
        rim.material.opacity = Math.max(0, 0.46 * ageFade * indexFade);
        core.material.opacity = Math.max(0, 1.0 * ageFade * indexFade * pulse);
        spark.material.opacity = Math.max(0, 0.86 * ageFade * indexFade);
    });

    virus.codeBlocks.forEach(({ mesh, baseX, baseZ, phase, drift, height }, index) => {
        const cycle = (virus.elapsed * (0.72 + index * 0.012) + phase) % 1;
        const rise = cycle * cycle * (3 - 2 * cycle);
        mesh.position.x = baseX + drift * rise + Math.sin(t * 5 + index) * 0.035;
        mesh.position.y = 0.08 + rise * height;
        mesh.position.z = baseZ + Math.sin(t * 4.6 + phase * 12) * 0.04;
        mesh.rotation.z += delta * (0.7 + index * 0.035);
        mesh.scale.setScalar(0.75 + Math.sin(cycle * Math.PI) * 0.4);
        mesh.material.opacity = Math.max(0, Math.sin(cycle * Math.PI) * 0.88);
    });
}

function updateSnakeDeskObstacle(obj, t, delta) {
    const snake = obj.group.userData.snake;
    if (!snake) return;

    const wallMode = Boolean(snake.wallMode);
    const phase = t * (wallMode ? 3.6 : 5.2) + obj.group.position.z * 0.08;
    snake.rig.position.y = Math.sin(phase) * (wallMode ? 0.014 : 0.04);
    snake.rig.rotation.z = Math.sin(phase * 0.62) * (wallMode ? 0.006 : 0.018);

    const lookEase = 1 - Math.exp(-14 * delta);
    let lookYaw = snake.lookYaw ?? 0;
    let lookPitch = snake.lookPitch ?? 0;
    if (snake.head?.userData.baseRotation) {
        snake.rig.updateMatrixWorld(true);
        const playerTarget = new THREE.Vector3(
            player.group.position.x,
            player.group.position.y + (isSliding ? 1.35 : 2.55),
            player.group.position.z
        );
        const targetLocal = snake.rig.worldToLocal(playerTarget);
        const toPlayerX = targetLocal.x - snake.head.position.x;
        const toPlayerY = targetLocal.y - snake.head.position.y;
        const toPlayerZ = targetLocal.z - snake.head.position.z;
        const targetYaw = THREE.MathUtils.clamp(Math.atan2(toPlayerX, toPlayerZ), -1.08, 1.08);
        const targetPitch = THREE.MathUtils.clamp(-Math.atan2(toPlayerY, Math.max(0.01, Math.hypot(toPlayerX, toPlayerZ))), -0.38, 0.68);
        snake.lookYaw = THREE.MathUtils.lerp(lookYaw, targetYaw, lookEase);
        snake.lookPitch = THREE.MathUtils.lerp(lookPitch, targetPitch, lookEase);
        lookYaw = snake.lookYaw;
        lookPitch = snake.lookPitch;

        const base = snake.head.userData.baseRotation;
        snake.head.rotation.set(
            base.x + lookPitch + Math.sin(phase * 0.72) * (wallMode ? 0.01 : 0.026),
            base.y + lookYaw,
            base.z + lookYaw * -0.08 + Math.sin(phase * 0.58) * (wallMode ? 0.012 : 0.028)
        );
    }

    snake.pupils.forEach((pupil, index) => {
        const base = pupil.userData.basePosition;
        if (!base) return;
        const eyeSide = index === 0 ? -1 : 1;
        const eyeLookX = THREE.MathUtils.clamp(lookYaw / 0.92, -1, 1);
        const eyeLookY = THREE.MathUtils.clamp(lookPitch / 0.58, -1, 1);
        pupil.position.x = base.x + eyeLookX * 0.13;
        pupil.position.y = base.y - eyeLookY * 0.045 + Math.sin(phase * 1.4 + index) * 0.007;
        pupil.position.z = base.z + 0.052 + eyeSide * eyeLookX * 0.006;
    });

    for (let i = 0; i < snake.spots.length; i++) {
        const spot = snake.spots[i];
        const base = spot.userData.basePosition;
        if (base) spot.position.y = base.y + Math.sin(phase + i * 0.55) * (wallMode ? 0.012 : 0.035);
    }
    for (let i = 0; i < snake.belly.length; i++) {
        const belly = snake.belly[i];
        const base = belly.userData.basePosition;
        if (base) belly.position.y = base.y + Math.sin(phase + i * 0.45) * (wallMode ? 0.008 : 0.025);
    }
    if (snake.tongue?.userData.basePosition) {
        snake.tongue.position.copy(snake.tongue.userData.basePosition);
        snake.tongue.position.z += Math.max(0, Math.sin(phase * 2.2)) * (wallMode ? 0.07 : 0.12);
        snake.tongue.scale.z = 1 + Math.max(0, Math.sin(phase * 2.2)) * (wallMode ? 0.18 : 0.34);
    }
}

function disintegratePlayerCrtAlert(alert) {
    if (!alert) return;
    alert.updateMatrixWorld(true);
    const center = new THREE.Vector3();
    alert.getWorldPosition(center);
    const shardGeo = new THREE.BoxGeometry(0.06, 0.11, 0.035);
    for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        makeSpark(
            center.x + (Math.random() - 0.5) * 0.26,
            center.y + (Math.random() - 0.5) * 0.84,
            center.z + (Math.random() - 0.5) * 0.2,
            i % 4 === 0 ? 0x5a0606 : 0xff1717,
            {
                geometry: shardGeo,
                scale: [0.75 + Math.random() * 0.75, 0.7 + Math.random() * 0.8, 0.8],
                rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
                velocity: new THREE.Vector3(
                    Math.cos(angle) * (0.55 + Math.random() * 1.15),
                    0.45 + Math.random() * 1.25,
                    Math.sin(angle) * (0.3 + Math.random() * 0.7)
                ),
                life: 0.28 + Math.random() * 0.16,
                gravity: 2.9,
                drag: 1.4,
                shrink: 0.68,
                depthTest: false,
                renderOrder: 32,
            }
        );
    }
}

function showPlayerCrtAlert(progress, t, runner) {
    const alert = player.alertMark;
    if (!alert) return;

    const clamped = THREE.MathUtils.clamp(progress, 0, 1);
    const alertEnd = 0.46;
    if (clamped >= alertEnd) {
        if (runner && !runner.alertBurstDone) {
            disintegratePlayerCrtAlert(alert);
            runner.alertBurstDone = true;
        }
        alert.visible = false;
        return;
    }

    const local = clamped / alertEnd;
    const intro = THREE.MathUtils.clamp(local / 0.16, 0, 1);
    const heartbeat = Math.sin(Math.min(1, local / 0.42) * Math.PI);
    const settle = 1 - THREE.MathUtils.clamp((local - 0.28) / 0.48, 0, 1) * 0.16;
    const scale = THREE.MathUtils.lerp(0.2, 0.82, intro) + heartbeat * 0.18;
    const blink = local < 0.2 ? 0.75 + Math.abs(Math.sin(t * 32)) * 0.25 : 1;
    alert.visible = true;
    alert.position.y = (alert.userData.baseY || 4.38) + heartbeat * 0.08;
    alert.scale.setScalar(scale * settle * blink);
    alert.rotation.z = -player.group.rotation.z + Math.sin(t * 9) * 0.018;
    alert.rotation.y = Math.sin(t * 7) * 0.045;
    for (const material of alert.userData.materials || []) {
        material.opacity = 0.86 + blink * 0.14;
    }
}

function updateCrtRunnerObstacle(obj, delta, t) {
    const runner = obj.group.userData.crtRunner;
    if (!runner) return;

    runner.elapsed += delta;
    const telegraph = getDifficultyValue(DIFFICULTY_TUNING.crtTelegraphStart, DIFFICULTY_TUNING.crtTelegraphEnd);
    const chargeSpeed = getDifficultyValue(DIFFICULTY_TUNING.crtChargeSpeedStart, DIFFICULTY_TUNING.crtChargeSpeedEnd);
    const warningActive = runner.elapsed < telegraph;
    const summonProgress = THREE.MathUtils.clamp(runner.elapsed / Math.max(telegraph, 0.01), 0, 1);
    const openEase = summonProgress * summonProgress * (3 - 2 * summonProgress);
    const portalCloseDuration = THREE.MathUtils.lerp(0.5, 0.24, getDifficultyProgress());
    const closeProgress = THREE.MathUtils.clamp((runner.elapsed - telegraph) / portalCloseDuration, 0, 1);
    const closeEase = closeProgress * closeProgress * (3 - 2 * closeProgress);

    if (warningActive) {
        const predictionLead = THREE.MathUtils.lerp(0.28, 0.48, getDifficultyProgress());
        runner.predictedLane = getPredictedPlayerLaneIndex(predictionLead);
        const predictedX = LANES[runner.predictedLane];
        obj.group.position.x += (predictedX - obj.group.position.x) * (1 - Math.exp(-13 * delta));
        obj.group.position.z -= speed * delta;
        showPlayerCrtAlert(openEase, t, runner);
        runner.body.visible = summonProgress > 0.58;
    } else {
        if (!runner.launched) {
            obj.group.position.x = LANES[runner.predictedLane ?? getPredictedPlayerLaneIndex(0.22)];
            obj.lane = runner.predictedLane ?? getCurrentPlayerLaneIndex();
            obj.group.position.z += runner.summonZ;
            runner.body.position.z = 0;
            runner.portal.position.z = -0.08;
            runner.launched = true;
        }
        runner.body.visible = true;
        const chargeRamp = THREE.MathUtils.clamp((runner.elapsed - telegraph) / 0.42, 0, 1);
        obj.group.position.z += chargeSpeed * chargeRamp * delta;
    }

    if (runner.portal) {
        runner.portal.visible = closeProgress < 1;
        const flicker = 1 + Math.sin(t * 46 + obj.group.position.z * 0.03) * 0.055;
        const scaleX = THREE.MathUtils.lerp(0.1, 1.18, openEase) * THREE.MathUtils.lerp(1, 0.08, closeEase) * flicker;
        const scaleY = THREE.MathUtils.lerp(0.03, 1.16, openEase) * THREE.MathUtils.lerp(1, 0.025, closeEase);
        runner.portal.scale.set(Math.max(0.03, scaleX), Math.max(0.02, scaleY), 1);
        runner.portal.rotation.z = Math.sin(t * 24) * 0.025 * (1 - closeEase);
        runner.portalMat.opacity = Math.max(0, THREE.MathUtils.lerp(0.35, 1, openEase) * (1 - closeEase));
        runner.portalBars.forEach(({ mesh, basePosition, baseScale, phase }) => {
            const jitter = Math.sin(t * 38 + phase) * 0.16;
            mesh.position.x = basePosition.x + jitter;
            mesh.position.y = basePosition.y + Math.cos(t * 31 + phase) * 0.03;
            mesh.scale.x = baseScale.x * (1 + Math.abs(Math.sin(t * 21 + phase)) * 0.95);
            mesh.material.opacity = Math.max(0, (0.48 + Math.abs(Math.sin(t * 28 + phase)) * 0.52) * (1 - closeEase));
        });
    }

    const runPhase = t * 18 + obj.group.position.z * 0.12;
    runner.body.position.y = Math.abs(Math.sin(runPhase)) * 0.08;
    runner.body.rotation.z = Math.sin(runPhase * 0.5) * 0.06;
    runner.limbs.forEach(({ part, side, kind, base }) => {
        part.rotation.copy(base);
        const swing = Math.sin(runPhase + (kind === 'leg' ? side * Math.PI * 0.5 : side * -Math.PI * 0.5));
        part.rotation.z += side * (kind === 'arm' ? 0.64 : 0.46) + swing * (kind === 'arm' ? 0.48 : 0.42);
    });
}

function updateShieldVisual(t) {
    const aura = player.shieldAura;
    if (!aura) return;
    aura.visible = shield > 0;
    if (shield <= 0) return;

    const ending = THREE.MathUtils.clamp(1 - shield / SHIELD_VISUAL.warningSeconds, 0, 1);
    const blinkRamp = ending * ending * (3 - 2 * ending);
    const blinkHz = THREE.MathUtils.lerp(SHIELD_VISUAL.blinkStartHz, SHIELD_VISUAL.blinkEndHz, blinkRamp);
    const blinkWave = SHIELD_VISUAL.blinkMin + (1 - SHIELD_VISUAL.blinkMin) * (0.5 + Math.sin(t * Math.PI * 2 * blinkHz) * 0.5);
    const blink = shield <= SHIELD_VISUAL.warningSeconds ? blinkWave : 1;
    const pulse = SHIELD_VISUAL.pulseBase + Math.sin(t * 7.2) * SHIELD_VISUAL.pulseAmount;

    aura.scale.setScalar(pulse);
    aura.userData.core.material.opacity = Math.max(
        0.04,
        (SHIELD_VISUAL.coreOpacity + Math.sin(t * 8.6) * SHIELD_VISUAL.corePulse) * blink
    );

    const outlineOpacity = Math.max(
        0.05,
        (SHIELD_VISUAL.outlineOpacity + Math.sin(t * 7.8) * SHIELD_VISUAL.outlinePulse) * blink
    );
    for (const ring of aura.userData.rings) {
        ring.material.opacity = outlineOpacity;
    }

    const rimOpacity = Math.max(
        0.06,
        (SHIELD_VISUAL.rimOpacity + Math.sin(t * 9.4) * SHIELD_VISUAL.rimPulse) * blink
    );
    for (const rim of aura.userData.rims || []) {
        rim.material.opacity = rimOpacity;
    }
}

function breakPlayerShieldVisual() {
    const aura = player.shieldAura;
    if (!aura) return;
    const worldPos = new THREE.Vector3();
    aura.getWorldPosition(worldPos);
    shieldBreakBurstAt(worldPos.x, worldPos.y, worldPos.z);
    aura.visible = false;
}

function updateQuizInvulnerability(delta, t) {
    if (quizInvulnerabilityTimer <= 0) {
        if (state === 'running') player.group.visible = true;
        return;
    }
    quizInvulnerabilityTimer = Math.max(0, quizInvulnerabilityTimer - delta);
    const visible = quizInvulnerabilityTimer <= 0 || Math.sin(t * 32) > -0.15;
    player.group.visible = visible;
}

function updateRunning(delta, t) {
    runTime += delta;
    distance += speed * delta;
    speed = Math.min(GAMEPLAY.maxSpeed, GAMEPLAY.startSpeed + runTime * GAMEPLAY.acceleration);
    addScore(delta * SCORE_TUNING.distancePerSecond);
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
        spawnTimer = DEBUG_SINGLE_OBSTACLE_ONLY
            ? 3.0
            : getDifficultyValue(DIFFICULTY_TUNING.spawnStart, DIFFICULTY_TUNING.spawnEnd) + Math.random() * 0.05;
    }
    if (collectibleTimer <= 0) {
        spawnCollectibles();
        collectibleTimer = 1.7 + Math.random() * 0.8;
    }

    if (multiplierTimer > 0) multiplierTimer -= delta;
    if (powerCooldownTimer > 0) powerCooldownTimer = Math.max(0, powerCooldownTimer - delta);
    if (shield > 0) {
        shield = Math.max(0, shield - delta);
        if (shield <= 0) breakPlayerShieldVisual();
    }
    if (rollRecoveryTimer > 0) rollRecoveryTimer = Math.max(0, rollRecoveryTimer - delta);
    updateQuizInvulnerability(delta, t);
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
            slideTimer = 0;
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
    laneSlideKick *= Math.exp(-9.5 * delta);
    const laneOffset = targetX - player.group.position.x;
    const laneLean = THREE.MathUtils.clamp(laneOffset * 0.07 + laneSlideKick * 0.085, -0.22, 0.22);
    player.group.rotation.z += (laneLean - player.group.rotation.z) * (1 - Math.exp(-16 * delta));

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
    updateShieldVisual(t);
    if (player.alertMark) player.alertMark.visible = false;
    player.shadow.position.set(player.group.position.x, 0.035, player.group.position.z);
    player.shadow.scale.setScalar(1 + player.group.position.y * -0.12);

    for (const segment of roadSegments) {
        segment.position.z += speed * delta;
        if (segment.position.z > 38) segment.position.z -= roadSegments.length * 34;
    }

    for (const obj of liveObjects) {
        obj.group.position.z += speed * delta;
        if (obj.type === 'collectible') {
            obj.group.rotation.y += delta * 2.8;
        } else if (obj.type === 'power') {
            obj.group.rotation.x = 0;
            obj.group.rotation.y += delta * 2.8;
            obj.group.rotation.z = 0;
        } else if (obj.obstacleType?.id === 'trafficCones') {
            updateNetworkRouterObstacle(obj, delta, t);
        } else if (obj.obstacleType?.id === 'lowBarrier') {
            updateLowBarrierObstacle(obj, delta, t);
        } else if (obj.obstacleType?.id === 'roadBlock') {
            updateGlitchVirusObstacle(obj, delta, t);
        } else if (obj.obstacleType?.id === 'snakeDesk') {
            updateSnakeDeskObstacle(obj, t, delta);
        } else if (obj.obstacleType?.id === 'crtRunner') {
            updateCrtRunnerObstacle(obj, delta, t);
        } else if (obj.obstacleType?.id === 'overheadSign') {
            updateDroneSwarmObstacle(obj, delta, t);
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
        if (obj.type === 'collectible' && canCollectObject(obj, dx, dz)) {
            audioManager.play('coin');
            obj.hit = true;
            obj.group.visible = false;
            topicCounts[obj.topic.tag]++;
            combo++;
            comboTimer = 2.1;
            addScore(SCORE_TUNING.bookBase + Math.min(combo * SCORE_TUNING.bookComboStep, SCORE_TUNING.bookComboCap));
            showLearn(obj.topic);
            collectBurstAt(obj.group.position.x, obj.group.position.y + 0.15, obj.group.position.z, 0x37b66a, 'book');
        } else if (obj.type === 'power' && canCollectObject(obj, dx, dz)) {
            audioManager.play('shieldUp');
            obj.hit = true;
            obj.group.visible = false;
            shield = SHIELD_VISUAL.duration;
            multiplierTimer = 5;
            combo++;
            comboTimer = 2.1;
            addScore(SCORE_TUNING.bitcoin);
            showComboPopup('BITCOIN!', '#f7931a');
            showLearn({ tag: 'DBG', title: 'Debug', copy: 'Programar também é testar, corrigir e melhorar.' });
            collectBurstAt(obj.group.position.x, obj.group.position.y + 0.15, obj.group.position.z, 0xd08a20, 'bitcoin');
        } else if (obj.type === 'obstacle' && quizInvulnerabilityTimer <= 0 && canObstacleHitPlayer(obj) && intersectsBox(getPlayerHitbox(), getObjectHitbox(obj), GAMEPLAY.collisionPadding)) {
            combo = 0;
            comboTimer = 0;
            if (shield > 0) {
                startShieldDestroy(obj);
                audioManager.play('shieldBreak');
                breakPlayerShieldVisual();
                shield = 0;
                addScore(SCORE_TUNING.shieldBreak);
                showComboPopup('ESCUDO!', '#20c997');
            } else {
                startQuizRescue(obj);
                return;
            }
        }

        if (obj.type === 'obstacle' && !obj.hit && !obj.scoredDodge && obj.group.position.z > player.group.position.z + 1.15) {
            obj.scoredDodge = true;
            const closeDodge = Math.abs(obj.group.position.x - player.group.position.x) < 2.15;
            addScore(closeDodge ? SCORE_TUNING.dodgeClose : SCORE_TUNING.dodgeFar);
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
        if (spark.userData.drag) {
            spark.userData.vel.multiplyScalar(Math.max(0, 1 - spark.userData.drag * delta));
        }
        spark.position.addScaledVector(spark.userData.vel, delta);
        const fade = Math.max(0, spark.userData.life / (spark.userData.maxLife || 0.45));
        const spin = spark.userData.spin;
        if (spin) {
            spark.rotation.x += spin.x * delta;
            spark.rotation.y += spin.y * delta;
            spark.rotation.z += spin.z * delta;
        }
        if (spark.userData.shrink) {
            const progress = 1 - fade;
            const scaleFactor = spark.userData.shrink > 0
                ? Math.max(0.02, 1 - spark.userData.shrink * progress)
                : 1 + Math.abs(spark.userData.shrink) * progress;
            spark.scale.copy(spark.userData.baseScale).multiplyScalar(scaleFactor);
        }
        spark.material.opacity = (spark.userData.baseOpacity ?? 1) * fade;
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
    if (state === 'quiz') updateQuiz(delta);
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
    updateMusicUi();
}

function pauseGame() {
    if (state !== 'running') return;
    activeKeys.clear();
    audioManager.stopAmbient();
    state = 'paused';
    updatePauseUi();
    renderRanking();
}

function resumeGame() {
    if (state !== 'paused') return;
    clearPlayerActionState({ ground: true });
    audioManager.startAmbient();
    state = 'running';
    clock.getDelta();
    playPlayerAction('Run');
    updatePauseUi();
    renderRanking();
}

function showMenu() {
    audioManager.stopQuizMusic({ resumeMain: false });
    audioManager.stopAmbient();
    clearRunObjects();
    resetVisualWorldLoops();
    hideQuizPanel();
    activeQuiz = null;
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
    audioManager.startMenuMusic();
    updatePauseUi();
    renderRanking();
}

function moveLane(dir) {
    if (state !== 'running') return;
    const previousTarget = targetLaneIndex;
    targetLaneIndex = Math.max(0, Math.min(2, targetLaneIndex + dir));
    if (targetLaneIndex !== previousTarget) {
        laneSlideKick = Math.sign(targetLaneIndex - previousTarget);
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
        queueAirborneRoll();
        return;
    }
    beginGroundRoll();
}

function openCustomize() {
    audioManager.stopQuizMusic({ resumeMain: false });
    state = 'customize';
    hideQuizPanel();
    activeQuiz = null;
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

function isTypingTarget(target) {
    return target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target instanceof HTMLSelectElement
        || Boolean(target?.isContentEditable);
}

window.addEventListener('keydown', event => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (isTypingTarget(event.target)) return;
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
    if (state === 'quiz') {
        event.preventDefault();
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
    if (!event.isPrimary || event.button > 0) return;
    const target = event.target;
    if (target instanceof Element && target.closest('button, input, select, textarea, a, label, .quiz-panel, .pause-panel, .customize-panel, .music-player, .ranking-panel, .screen')) {
        touchStart = null;
        return;
    }
    touchStart = { x: event.clientX, y: event.clientY, type: event.pointerType || 'mouse' };
});

window.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (Math.max(ax, ay) < 18) {
        if (touchStart.type !== 'mouse') jump();
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
musicPrev.addEventListener('click', () => audioManager.previousMusic());
musicToggle.addEventListener('click', () => audioManager.toggleMusic());
musicNext.addEventListener('click', () => audioManager.nextMusic());
musicRandom.addEventListener('click', () => {
    audioManager.setMusicShuffle(!audioManager.musicShuffle);
});
musicVolume.addEventListener('input', () => {
    audioManager.setMusicVolume(Number(musicVolume.value) / 100);
});
rankingList.addEventListener('click', event => {
    const button = event.target.closest('.ranking-delete');
    if (!button) return;
    deleteRankingEntry(Number(button.dataset.rankingIndex));
});
rankingEditorToggle.addEventListener('click', () => {
    if (state === 'running' || state === 'paused' || state === 'quiz') return;
    rankingEditorEnabled = !rankingEditorEnabled;
    renderRanking();
});
btnCustomize.addEventListener('click', openCustomize);
customizeClose.addEventListener('click', closeCustomize);
customizeDone.addEventListener('click', closeCustomize);
quizOptions.addEventListener('click', event => {
    const button = event.target.closest('.quiz-option');
    if (!button) return;
    answerQuiz(Number(button.dataset.index));
});
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

function sanitizeRankingName(value, fallback = 'ALUNOIF') {
    const clean = String(value || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 14);
    return clean || fallback;
}

playerNameInput.addEventListener('input', () => {
    playerNameInput.value = sanitizeRankingName(playerNameInput.value, '');
});

scoreForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (savedCurrentScore) return;
    if (currentRunRank === null) return;
    const name = sanitizeRankingName(playerNameInput.value);
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
        name: 'VOCÊ',
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
            name: sanitizeRankingName(entry.name),
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

function setRanking(nextRanking, options = {}) {
    rankingCache = normalizeRanking(nextRanking);
    rankingSource = options.source || rankingSource || 'local';
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rankingCache));
    } catch { }
    bestScore = rankingCache[0]?.score || 0;
    hudBest.textContent = String(bestScore);
}

async function syncRankingFromEndpoint(endpoint, source) {
    try {
        const url = endpoint.includes('?') ? endpoint : `${endpoint}?v=${Date.now()}`;
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) return false;
        const payload = await response.json();
        setRanking(payload, { source });
        return true;
    } catch {
        return false;
    }
}

async function syncRanking() {
    if (await syncRankingFromEndpoint(ONLINE_RANKING_ENDPOINT, 'online')) return;
    if (await syncRankingFromEndpoint(LOCAL_RANKING_ENDPOINT, 'local')) return;
    rankingSource = 'local';
}

async function persistRankingOnline(entry) {
    try {
        const response = await fetch(ONLINE_RANKING_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });
        if (!response.ok) return false;
        const payload = await response.json();
        setRanking(payload, { source: 'online' });
        return true;
    } catch {
        return false;
    }
}

async function saveScore(entry) {
    const savedOnline = await persistRankingOnline(entry);
    if (!savedOnline) {
        setRanking([...rankingCache, entry], { source: 'local' });
    }
}

async function deleteRankingOnline(index, entry) {
    try {
        const response = await fetch(ONLINE_RANKING_ENDPOINT, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, entry }),
        });
        if (!response.ok) return false;
        const payload = await response.json();
        setRanking(payload, { source: 'online' });
        return true;
    } catch {
        return false;
    }
}

async function deleteRankingEntry(index) {
    if (!rankingEditorEnabled || state === 'running' || state === 'paused' || state === 'quiz') return;
    if (index < 0 || index >= rankingCache.length) return;
    if (rankingSource === 'online') {
        const deletedOnline = await deleteRankingOnline(index, rankingCache[index]);
        if (!deletedOnline) return;
    } else {
        setRanking(rankingCache.filter((_, itemIndex) => itemIndex !== index), { source: 'local' });
    }
    renderRanking();
}

function renderRanking() {
    const ranking = getRanking();
    const liveMode = state === 'running' || state === 'paused' || state === 'quiz';
    const limit = liveMode ? 5 : 10;
    rankingPanel.dataset.mode = liveMode ? 'live' : 'full';
    rankingPanel.dataset.source = rankingSource;
    rankingTitle.textContent = rankingSource === 'online' ? 'Ranking online' : 'Ranking local';
    rankingPanel.dataset.editor = rankingEditorEnabled && !liveMode ? 'true' : 'false';
    rankingEditorToggle.hidden = liveMode;
    rankingEditorToggle.setAttribute('aria-pressed', rankingEditorEnabled && !liveMode ? 'true' : 'false');
    rankingLimit.textContent = liveMode ? 'Top 5' : 'Top 10';

    let displayRanking;
    if (liveMode) {
        const currentRun = {
            name: 'VOCÊ',
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
        deleteButton.hidden = entry.sourceIndex === undefined;
        deleteButton.setAttribute('aria-label', `Excluir ${entry.name}`);
        li.appendChild(rank);
        li.appendChild(name);
        li.appendChild(scoreWrap);
        li.appendChild(deleteButton);
        rankingList.appendChild(li);
    }
}
