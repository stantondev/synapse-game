/* ======================================================
   SYNAPSE — Game Engine
   State machine, mechanics, modes, audio, progression
   ====================================================== */

(function () {
  'use strict';

  // ─── CONSTANTS ───
  const CATEGORIES = ['science', 'history', 'arts', 'geography', 'sports', 'popculture', 'gauntlet'];
  const CATEGORY_NAMES = {
    science: 'Science & Nature',
    history: 'History & World',
    arts: 'Arts & Entertainment',
    geography: 'Geography & Culture',
    sports: 'Sports & Competition',
    popculture: 'Pop Culture',
    gauntlet: 'The Gauntlet'
  };
  const CATEGORY_COLORS = {
    science: '#00e676',
    history: '#ffd740',
    arts: '#ea80fc',
    geography: '#18ffff',
    sports: '#ff5252',
    popculture: '#ff80ab',
    gauntlet: '#ea80fc'
  };
  const DAY_CATEGORIES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const DAY_TO_CAT = {
    0: 'gauntlet',   // Sunday
    1: 'science',
    2: 'history',
    3: 'arts',
    4: 'geography',
    5: 'sports',
    6: 'popculture'
  };

  const CLUE_POINTS = { standard: [500, 400, 300, 200, 100], casual: [500, 420, 340, 260, 180, 100], expert: [500, 375, 250, 125] };
  const CHAIN_MULTIPLIERS = [1.0, 1.2, 1.5, 1.8, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0];
  const WAGER_RATES = { safe: 0.1, bold: 0.5, allin: 1.0 };
  const QUICKFIRE_DURATION = 180; // seconds
  const STARTING_BANK = 1000;

  const BADGES = [
    { id: 'diamond_mind', name: 'Diamond Mind', icon: '\u{1F48E}', desc: 'Answer on Clue 1', check: (s) => s.clue1Answers >= 1 },
    { id: 'diamond_5', name: 'Diamond Collector', icon: '\u{1F48E}', desc: '5 Clue-1 answers', check: (s) => s.clue1Answers >= 5 },
    { id: 'chain_5', name: 'Chain Starter', icon: '\u{1F517}', desc: '5-question chain', check: (s) => s.bestChain >= 5 },
    { id: 'chain_10', name: 'Chain Master', icon: '\u{1F517}', desc: '10-question chain', check: (s) => s.bestChain >= 10 },
    { id: 'chain_25', name: 'Chain Legend', icon: '\u{1F517}', desc: '25-question chain', check: (s) => s.bestChain >= 25 },
    { id: 'streak_7', name: 'Weekly Regular', icon: '\u{1F525}', desc: '7-day streak', check: (s) => s.streak >= 7 },
    { id: 'streak_30', name: 'Monthly Devotee', icon: '\u{1F525}', desc: '30-day streak', check: (s) => s.streak >= 30 },
    { id: 'high_roller', name: 'High Roller', icon: '\u{1F4B0}', desc: 'Win 5 All-In wagers in a row', check: (s) => s.consecutiveAllInWins >= 5 },
    { id: 'polymath', name: 'Polymath', icon: '\u{1F9E0}', desc: 'Play all 7 daily categories', check: (s) => s.categoriesPlayed && s.categoriesPlayed.length >= 6 },
    { id: 'perfect_daily', name: 'Perfect Drop', icon: '\u{1F3C6}', desc: '10/10 on a Daily', check: (s) => s.perfectDailies >= 1 },
    { id: 'speed_demon', name: 'Speed Demon', icon: '\u26A1', desc: 'Score 3000+ in Quick Fire', check: (s) => s.bestQuickFire >= 3000 },
    { id: 'games_10', name: 'Getting Started', icon: '\u{1F3AE}', desc: 'Play 10 games', check: (s) => s.gamesPlayed >= 10 },
  ];

  const TUTORIAL_STEPS = [
    { icon: '\u{1F9E9}', title: 'The Clue Drop', text: 'Each question gives you up to 5 clues, from cryptic to obvious. Answer early for more points \u2014 or wait for clarity.' },
    { icon: '\u{1F4B0}', title: 'The Confidence Wager', text: 'Before clues drop, bet on your confidence. Safe (10%), Bold (50%), or All-In (100%). Win big or lose your stake.' },
    { icon: '\u{1F517}', title: 'The Knowledge Chain', text: 'Every answer connects to the next question. Build your chain for multiplier bonuses \u2014 but one wrong answer shatters it.' },
  ];

  // ─── AUDIO ENGINE ───
  const Audio = {
    ctx: null,
    enabled: true,

    init() {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { this.enabled = false; }
    },

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },

    play(type) {
      if (!this.enabled || !this.ctx) return;
      this.resume();
      const t = this.ctx.currentTime;
      switch (type) {
        case 'clue': this._tone(440, 0.08, 'sine', 0.15); break;
        case 'correct': this._chord([523, 659, 784], 0.3, 'sine', 0.2); break;
        case 'wrong': this._tone(200, 0.3, 'sawtooth', 0.1); break;
        case 'chain_break': this._noise(0.4, 0.15); break;
        case 'wager': this._tone(660, 0.05, 'sine', 0.1); break;
        case 'badge': this._chord([523, 659, 784, 1047], 0.5, 'sine', 0.15); break;
        case 'tick': this._tone(880, 0.03, 'square', 0.05); break;
        case 'click': this._tone(600, 0.04, 'sine', 0.08); break;
        case 'gameover': this._chord([392, 330, 262], 0.6, 'sine', 0.12); break;
      }
    },

    _tone(freq, dur, type, vol) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    },

    _chord(freqs, dur, type, vol) {
      freqs.forEach((f, i) => {
        setTimeout(() => this._tone(f, dur - i * 0.05, type, vol * 0.7), i * 60);
      });
    },

    _noise(dur, vol) {
      const bufferSize = this.ctx.sampleRate * dur;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const source = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      source.buffer = buffer;
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      source.connect(gain).connect(this.ctx.destination);
      source.start();
    }
  };

  // ─── PARTICLE ENGINE ───
  const Particles = {
    canvas: null,
    ctx: null,
    particles: [],
    running: false,

    init() {
      this.canvas = document.getElementById('particle-canvas');
      this.ctx = this.canvas.getContext('2d');
      this._resize();
      window.addEventListener('resize', () => this._resize());
    },

    _resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    burst(x, y, color, count = 20) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5);
        const speed = 2 + Math.random() * 4;
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 2 + Math.random() * 3,
          color,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02
        });
      }
      if (!this.running) this._loop();
    },

    celebrate(color) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      this.burst(cx, cy - 50, color, 40);
      setTimeout(() => this.burst(cx - 60, cy, color, 20), 100);
      setTimeout(() => this.burst(cx + 60, cy, color, 20), 200);
    },

    _loop() {
      this.running = true;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles = this.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.alpha -= p.decay;
        if (p.alpha <= 0) return false;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const match = p.color.match(/\d+/g);
        this.ctx.fillStyle = match ? `rgba(${match[0]},${match[1]},${match[2]},${p.alpha})` : p.color;
        this.ctx.fill();
        return true;
      });
      if (this.particles.length > 0) {
        requestAnimationFrame(() => this._loop());
      } else {
        this.running = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  };

  // ─── STORAGE ───
  const Store = {
    _key: 'synapse_data',

    load() {
      try {
        const raw = localStorage.getItem(this._key);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    },

    save(data) {
      try { localStorage.setItem(this._key, JSON.stringify(data)); } catch {}
    },

    getDefaults() {
      return {
        totalScore: 0,
        gamesPlayed: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        bestChain: 0,
        streak: 0,
        lastPlayedDate: null,
        dailyCompletedDate: null,
        clue1Answers: 0,
        consecutiveAllInWins: 0,
        maxConsecutiveAllInWins: 0,
        perfectDailies: 0,
        bestQuickFire: 0,
        categoriesPlayed: [],
        badges: [],
        recentGames: [],
        categoryStats: {},
        settings: { sound: true, animations: true },
        firstVisit: true
      };
    }
  };

  // ─── SEEDED RANDOM (for daily consistency) ───
  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function getDailySeed() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  function getDayNumber() {
    const start = new Date(2026, 0, 1); // Jan 1, 2026
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    return Math.floor((now - start) / 86400000) + 1;
  }

  function getTodayCategory() {
    return DAY_TO_CAT[new Date().getDay()];
  }

  function getTodayDateStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // ─── GAME STATE ───
  const Game = {
    state: null,
    playerData: null,
    currentQuestions: [],
    currentIndex: 0,
    currentClueIndex: 0,
    currentWager: 0,
    currentWagerType: '',
    bank: STARTING_BANK,
    chain: 0,
    chainMultiplier: 1.0,
    score: 0,
    results: [],
    mode: 'daily',
    difficulty: 'standard',
    selectedCategory: null,
    timerInterval: null,
    timeRemaining: 0,
    gauntletFailed: false,

    init() {
      Audio.init();
      Particles.init();

      this.playerData = Store.load() || Store.getDefaults();
      this._updateStreak();
      this._bindEvents();
      this._updateHome();

      if (this.playerData.firstVisit) {
        this._showTutorial();
        this.playerData.firstVisit = false;
        Store.save(this.playerData);
      }
    },

    // ─── NAVIGATION ───
    _showScreen(id) {
      const target = document.getElementById(`screen-${id}`);
      if (!target) return;

      // Immediately deactivate all screens
      document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active', 'exit-left');
      });

      // Activate target after a micro-delay for CSS transition to trigger
      requestAnimationFrame(() => {
        target.classList.add('active');
        target.scrollTop = 0;
      });
    },

    // ─── EVENT BINDING ───
    _bindEvents() {
      // Mode buttons
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          Audio.play('click');
          Audio.resume();
          const mode = btn.dataset.mode;
          this.mode = mode;
          if (mode === 'daily') {
            if (this.playerData.dailyCompletedDate === getTodayDateStr()) {
              alert('You\'ve already completed today\'s Daily Drop! Come back tomorrow.');
              return;
            }
            this._showScreen('difficulty');
          } else if (mode === 'deepdive') {
            this._showScreen('category');
          } else if (mode === 'quickfire') {
            this._showScreen('difficulty');
          } else if (mode === 'gauntlet') {
            this._showScreen('difficulty');
          }
        });
      });

      // Category selection
      document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => {
          Audio.play('click');
          this.selectedCategory = card.dataset.category;
          this._showScreen('difficulty');
        });
      });

      // Difficulty selection
      document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          Audio.play('click');
          document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.difficulty = btn.dataset.difficulty;
        });
      });

      // Start game
      document.getElementById('btn-start-game').addEventListener('click', () => {
        Audio.play('click');
        this._startGame();
      });

      // Wager buttons
      document.querySelectorAll('.wager-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          Audio.play('wager');
          this._selectWager(btn.dataset.wager);
        });
      });

      // Next clue
      document.getElementById('btn-next-clue').addEventListener('click', () => {
        Audio.play('clue');
        this._revealNextClue();
      });

      // Next question
      document.getElementById('btn-next-question').addEventListener('click', () => {
        Audio.play('click');
        this._nextQuestion();
      });

      // Back buttons
      document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          Audio.play('click');
          this._showScreen(btn.dataset.target);
        });
      });

      // Footer buttons
      document.getElementById('btn-stats').addEventListener('click', () => {
        Audio.play('click');
        this._renderStats();
        this._showScreen('stats');
      });
      document.getElementById('btn-badges').addEventListener('click', () => {
        Audio.play('click');
        this._renderBadges();
        this._showScreen('badges');
      });
      document.getElementById('btn-settings').addEventListener('click', () => {
        Audio.play('click');
        this._loadSettings();
        this._showScreen('settings');
      });

      // Settings
      document.getElementById('setting-sound').addEventListener('change', (e) => {
        Audio.enabled = e.target.checked;
        this.playerData.settings.sound = e.target.checked;
        Store.save(this.playerData);
      });
      document.getElementById('setting-animations').addEventListener('change', (e) => {
        this.playerData.settings.animations = e.target.checked;
        Store.save(this.playerData);
      });
      document.getElementById('btn-reset-data').addEventListener('click', () => {
        if (confirm('This will erase all your stats, badges, and streaks. Are you sure?')) {
          this.playerData = Store.getDefaults();
          this.playerData.firstVisit = false;
          Store.save(this.playerData);
          this._updateHome();
          Audio.play('click');
        }
      });

      // Results actions
      document.getElementById('btn-share').addEventListener('click', () => this._shareResults());
      document.getElementById('btn-play-again').addEventListener('click', () => {
        Audio.play('click');
        if (this.mode === 'daily') {
          this._showScreen('home');
        } else {
          this._startGame();
        }
      });
      document.getElementById('btn-go-home').addEventListener('click', () => {
        Audio.play('click');
        this._updateHome();
        this._showScreen('home');
      });

      // Tutorial
      document.getElementById('btn-tutorial-skip').addEventListener('click', () => {
        document.getElementById('tutorial-overlay').style.display = 'none';
      });
      document.getElementById('btn-tutorial-next').addEventListener('click', () => this._tutorialNext());
    },

    // ─── HOME SCREEN ───
    _updateHome() {
      // Streak
      const streakEl = document.getElementById('home-streak');
      if (this.playerData.streak > 0) {
        streakEl.style.display = 'flex';
        document.getElementById('home-streak-count').textContent = this.playerData.streak;
      } else {
        streakEl.style.display = 'none';
      }

      // Daily banner
      const todayCat = getTodayCategory();
      const dot = document.getElementById('daily-dot');
      dot.style.background = CATEGORY_COLORS[todayCat];
      dot.style.boxShadow = `0 0 8px ${CATEGORY_COLORS[todayCat]}`;
      document.getElementById('daily-category-name').textContent = CATEGORY_NAMES[todayCat];
      document.getElementById('daily-number').textContent = `#${getDayNumber()}`;

      // Check if daily completed
      const dailyBtn = document.querySelector('.mode-daily');
      if (this.playerData.dailyCompletedDate === getTodayDateStr()) {
        dailyBtn.style.opacity = '0.5';
        dailyBtn.querySelector('.mode-desc').textContent = 'Completed today!';
      } else {
        dailyBtn.style.opacity = '1';
        dailyBtn.querySelector('.mode-desc').textContent = '10 questions, one shot';
      }
    },

    _updateStreak() {
      const today = getTodayDateStr();
      const last = this.playerData.lastPlayedDate;
      if (!last) return;

      const lastDate = new Date(last);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / 86400000);

      if (diffDays > 1) {
        this.playerData.streak = 0;
        Store.save(this.playerData);
      }
    },

    // ─── START GAME ───
    _startGame() {
      this.currentIndex = 0;
      this.currentClueIndex = 0;
      this.bank = STARTING_BANK;
      this.chain = 0;
      this.chainMultiplier = 1.0;
      this.score = 0;
      this.results = [];
      this.gauntletFailed = false;

      // Load questions
      this.currentQuestions = this._getQuestions();
      if (!this.currentQuestions || this.currentQuestions.length === 0) {
        alert('No questions available for this category. Try another mode!');
        return;
      }

      this._showScreen('game');
      this._updateGameUI();

      // Timer for Quick Fire
      if (this.mode === 'quickfire') {
        this.timeRemaining = QUICKFIRE_DURATION;
        document.getElementById('timer-container').style.display = 'block';
        this._startTimer();
      } else {
        document.getElementById('timer-container').style.display = 'none';
      }

      // Show first question wager phase
      this._showWagerPhase();
    },

    _getQuestions() {
      if (typeof QUESTIONS === 'undefined') return this._getFallbackQuestions();

      switch (this.mode) {
        case 'daily': {
          const cat = getTodayCategory();
          const chain = QUESTIONS.dailyChains[cat];
          if (chain && chain.length > 0) {
            const rng = seededRandom(getDailySeed());
            // Shuffle within the chain to make each day feel different
            // Actually, don't shuffle — chains are pre-ordered for linking
            return [...chain];
          }
          return this._getPoolQuestions(cat, 10);
        }
        case 'quickfire': {
          // Mix all categories
          const all = [];
          Object.values(QUESTIONS.pool || {}).forEach(qs => all.push(...qs));
          Object.values(QUESTIONS.dailyChains || {}).forEach(qs => all.push(...qs));
          return this._shuffle([...all]);
        }
        case 'deepdive': {
          const cat = this.selectedCategory;
          const pool = [...(QUESTIONS.dailyChains[cat] || []), ...(QUESTIONS.pool[cat] || [])];
          return this._shuffle(pool);
        }
        case 'gauntlet': {
          const chain = QUESTIONS.dailyChains.gauntlet;
          if (chain && chain.length > 0) return [...chain];
          const all = [];
          Object.values(QUESTIONS.pool || {}).forEach(qs => all.push(...qs));
          return this._shuffle([...all]).slice(0, 20);
        }
        default:
          return [];
      }
    },

    _getPoolQuestions(category, count) {
      const pool = [...(QUESTIONS.dailyChains[category] || []), ...(QUESTIONS.pool[category] || [])];
      return this._shuffle(pool).slice(0, count);
    },

    _shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    _getFallbackQuestions() {
      // Minimal fallback if questions.js hasn't loaded
      return [{
        id: 'fb1', category: 'science', difficulty: 1,
        clues: ['It keeps us grounded', 'Newton saw an apple fall', 'F = ma describes it', '9.8 m/s\u00B2 on Earth', 'The force that pulls things down'],
        answer: 'Gravity', options: ['Gravity', 'Magnetism', 'Friction', 'Inertia'],
        chainTags: ['physics', 'force'], chainHint: 'Physics'
      }];
    },

    // ─── GAME UI UPDATE ───
    _updateGameUI() {
      const q = this.currentQuestions[this.currentIndex];
      const modeLabels = { daily: 'Daily Drop', quickfire: 'Quick Fire', deepdive: 'Deep Dive', gauntlet: 'The Gauntlet' };

      document.getElementById('game-mode-label').textContent = modeLabels[this.mode] || 'Synapse';

      if (this.mode === 'quickfire') {
        document.getElementById('question-counter').textContent = `Q${this.currentIndex + 1}`;
      } else {
        const total = this.mode === 'gauntlet' ? '?' : this.currentQuestions.length;
        document.getElementById('question-counter').textContent = `${this.currentIndex + 1}/${total}`;
      }

      document.getElementById('bank-value').textContent = Math.round(this.bank).toLocaleString();

      // Chain nodes
      this._renderChainNodes();

      // Chain multiplier
      const multEl = document.getElementById('chain-multiplier');
      multEl.textContent = `\u00D7${this.chainMultiplier.toFixed(1)}`;
    },

    _renderChainNodes() {
      const container = document.getElementById('chain-nodes');
      container.innerHTML = '';
      const total = Math.min(this.results.length + 1, 15); // show up to 15 nodes

      for (let i = 0; i < total; i++) {
        if (i > 0) {
          const conn = document.createElement('div');
          conn.className = 'chain-node-connector';
          if (this.results[i - 1] && this.results[i - 1].correct) {
            conn.classList.add('active');
          } else if (this.results[i - 1]) {
            conn.classList.add('broken');
          }
          container.appendChild(conn);
        }

        const node = document.createElement('div');
        node.className = 'chain-node';
        if (i < this.results.length) {
          const r = this.results[i];
          if (r.correct) {
            node.classList.add(r.clueIndex <= 1 ? 'diamond' : 'correct');
          } else {
            node.classList.add('wrong');
          }
        } else {
          node.classList.add('pending');
        }
        container.appendChild(node);
      }
    },

    // ─── WAGER PHASE ───
    _showWagerPhase() {
      const q = this.currentQuestions[this.currentIndex];

      // Scroll game screen to top
      document.getElementById('screen-game').scrollTop = 0;

      // Hide other phases
      document.getElementById('clue-area').style.display = 'none';
      document.getElementById('answer-area').style.display = 'none';
      document.getElementById('result-overlay').style.display = 'none';

      // Show chain hint
      const hintContainer = document.getElementById('chain-hint-container');
      if (this.currentIndex === 0) {
        hintContainer.style.display = 'flex';
        document.getElementById('chain-hint-text').textContent = 'Starting link';
        document.getElementById('chain-category-label').textContent = CATEGORY_NAMES[q.category] || q.category;
      } else {
        const prevQ = this.currentQuestions[this.currentIndex - 1];
        hintContainer.style.display = 'flex';
        document.getElementById('chain-hint-text').textContent = prevQ.chainHint || 'Connected';
        document.getElementById('chain-category-label').textContent = CATEGORY_NAMES[q.category] || q.category;
      }

      // Update wager amounts
      const bank = Math.round(this.bank);
      document.getElementById('wager-safe-amt').textContent = Math.round(bank * 0.1).toLocaleString();
      document.getElementById('wager-bold-amt').textContent = Math.round(bank * 0.5).toLocaleString();
      document.getElementById('wager-allin-amt').textContent = bank.toLocaleString();

      // Show wager
      document.getElementById('wager-container').style.display = 'flex';
    },

    _selectWager(type) {
      this.currentWagerType = type;
      this.currentWager = Math.round(this.bank * WAGER_RATES[type]);
      document.getElementById('wager-container').style.display = 'none';
      this._showCluePhase();
    },

    // ─── CLUE PHASE ───
    _showCluePhase() {
      this.currentClueIndex = 0;
      const cluePoints = CLUE_POINTS[this.difficulty] || CLUE_POINTS.standard;

      document.getElementById('clue-area').style.display = 'flex';
      document.getElementById('pts-number').textContent = cluePoints[0];

      // Clear previous clues
      document.getElementById('clues-list').innerHTML = '';

      // Show first clue
      this._renderClue(0);

      // Update next clue button
      this._updateNextClueBtn();

      // Show answer options after 2 clues (or immediately based on difficulty)
      if (this.difficulty === 'casual') {
        // Show answers right away for casual
        this._showAnswers();
      }
    },

    _renderClue(index) {
      const q = this.currentQuestions[this.currentIndex];
      const clues = q.clues;
      const cluePoints = CLUE_POINTS[this.difficulty] || CLUE_POINTS.standard;

      if (index >= clues.length || index >= cluePoints.length) return;

      const list = document.getElementById('clues-list');
      const card = document.createElement('div');
      card.className = 'clue-card';
      card.innerHTML = `
        <span class="clue-number">${index + 1}</span>
        <span class="clue-text">${clues[index]}</span>
      `;
      list.appendChild(card);

      // Update points
      document.getElementById('pts-number').textContent = cluePoints[index];
      document.getElementById('pts-number').classList.add('ticking');
      setTimeout(() => document.getElementById('pts-number').classList.remove('ticking'), 300);

      this.currentClueIndex = index;

      // Auto-scroll to keep clue visible
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      // Show answers after clue 2 (index 1) for standard/expert
      if (index >= 1 && this.difficulty !== 'casual') {
        this._showAnswers();
      }
    },

    _revealNextClue() {
      const cluePoints = CLUE_POINTS[this.difficulty] || CLUE_POINTS.standard;
      const nextIndex = this.currentClueIndex + 1;

      if (nextIndex >= cluePoints.length) return;

      Audio.play('clue');
      this._renderClue(nextIndex);
      this._updateNextClueBtn();
    },

    _updateNextClueBtn() {
      const cluePoints = CLUE_POINTS[this.difficulty] || CLUE_POINTS.standard;
      const btn = document.getElementById('btn-next-clue');
      const nextIndex = this.currentClueIndex + 1;

      if (nextIndex >= cluePoints.length) {
        btn.style.display = 'none';
      } else {
        btn.style.display = 'block';
        const pointDiff = cluePoints[this.currentClueIndex] - cluePoints[nextIndex];
        document.getElementById('clue-cost').textContent = `(-${pointDiff} pts)`;
      }
    },

    // ─── ANSWER PHASE ───
    _showAnswers() {
      const q = this.currentQuestions[this.currentIndex];
      const grid = document.getElementById('answer-grid');
      grid.innerHTML = '';

      // Shuffle options
      const shuffled = [...q.options].sort(() => Math.random() - 0.5);

      shuffled.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => this._submitAnswer(opt, btn));
        grid.appendChild(btn);
      });

      document.getElementById('answer-area').style.display = 'block';
    },

    _submitAnswer(answer, btnEl) {
      const q = this.currentQuestions[this.currentIndex];
      const correct = answer === q.answer;
      const cluePoints = CLUE_POINTS[this.difficulty] || CLUE_POINTS.standard;
      const basePoints = cluePoints[this.currentClueIndex] || cluePoints[cluePoints.length - 1];

      // Disable all answer buttons
      document.querySelectorAll('.answer-btn').forEach(b => {
        b.style.pointerEvents = 'none';
        if (b.textContent === q.answer) {
          b.classList.add('correct-answer');
        } else if (b === btnEl && !correct) {
          b.classList.add('wrong-answer');
        } else {
          b.classList.add('dimmed');
        }
      });

      // Calculate score
      let pointsEarned = 0;
      let wagerResult = 0;

      if (correct) {
        this.chain++;
        this.chainMultiplier = CHAIN_MULTIPLIERS[Math.min(this.chain - 1, CHAIN_MULTIPLIERS.length - 1)];
        wagerResult = this.currentWager;
        pointsEarned = Math.round((basePoints + wagerResult) * this.chainMultiplier);
        this.bank += wagerResult;
        this.score += pointsEarned;

        // Track all-in wins
        if (this.currentWagerType === 'allin') {
          this.playerData.consecutiveAllInWins = (this.playerData.consecutiveAllInWins || 0) + 1;
          this.playerData.maxConsecutiveAllInWins = Math.max(
            this.playerData.maxConsecutiveAllInWins || 0,
            this.playerData.consecutiveAllInWins
          );
        } else {
          this.playerData.consecutiveAllInWins = 0;
        }
      } else {
        wagerResult = -this.currentWager;
        pointsEarned = wagerResult;
        this.bank = Math.max(0, this.bank - this.currentWager);
        this.chain = 0;
        this.chainMultiplier = 1.0;
        this.playerData.consecutiveAllInWins = 0;

        // Ensure bank never drops below a minimum
        if (this.bank < 100) this.bank = 100;
      }

      // Record result
      this.results.push({
        questionId: q.id,
        correct,
        clueIndex: this.currentClueIndex,
        pointsEarned,
        wagerType: this.currentWagerType,
        wagerResult,
        chainLength: this.chain,
        answer: q.answer,
        category: q.category
      });

      // Update UI
      this._updateGameUI();
      document.getElementById('bank-value').textContent = Math.round(this.bank).toLocaleString();
      const bankEl = document.getElementById('bank-value');
      bankEl.classList.add(correct ? 'increase' : 'decrease');
      setTimeout(() => bankEl.classList.remove('increase', 'decrease'), 500);

      // Effects
      if (correct) {
        Audio.play('correct');
        if (this.playerData.settings.animations !== false) {
          Particles.burst(window.innerWidth / 2, window.innerHeight / 2, 'rgb(0, 230, 118)', 15);
        }
        if (this.currentClueIndex === 0) {
          this.playerData.clue1Answers = (this.playerData.clue1Answers || 0) + 1;
        }
      } else {
        Audio.play('wrong');
        if (this.chain === 0 && this.results.length > 1) {
          Audio.play('chain_break');
        }
      }

      // Show result after a brief delay
      setTimeout(() => this._showResult(correct, q, basePoints, pointsEarned, wagerResult), 800);
    },

    _showResult(correct, q, basePoints, pointsEarned, wagerResult) {
      const overlay = document.getElementById('result-overlay');
      const card = document.getElementById('result-card');

      card.className = 'result-card ' + (correct ? 'correct' : 'wrong');

      document.getElementById('result-icon').textContent = correct ? '\u2714\uFE0F' : '\u274C';
      document.getElementById('result-answer').textContent = q.answer;
      document.getElementById('result-points').textContent = (pointsEarned >= 0 ? '+' : '') + pointsEarned.toLocaleString() + ' pts';

      const clueLabel = `Clue ${this.currentClueIndex + 1}`;
      const wagerLabel = this.currentWagerType.charAt(0).toUpperCase() + this.currentWagerType.slice(1);
      const multLabel = `\u00D7${this.chainMultiplier.toFixed(1)}`;
      document.getElementById('result-breakdown').textContent = `${clueLabel} \u2022 ${wagerLabel} wager \u2022 ${multLabel} multiplier`;

      const chainStatus = document.getElementById('result-chain-status');
      if (correct) {
        chainStatus.className = 'result-chain-status chain-grew';
        chainStatus.textContent = `\u{1F517} Chain: ${this.chain}`;
      } else {
        chainStatus.className = 'result-chain-status chain-broke';
        chainStatus.textContent = '\u{1F4A5} Chain broken!';
      }

      // Change button text for last question or gauntlet failure
      const nextBtn = document.getElementById('btn-next-question');
      const isLastQuestion = this.mode !== 'quickfire' && this.currentIndex >= this.currentQuestions.length - 1;
      const gauntletEnd = this.mode === 'gauntlet' && !correct;

      if (isLastQuestion || gauntletEnd) {
        nextBtn.textContent = 'See Results';
      } else {
        nextBtn.textContent = 'Next Question';
      }

      overlay.style.display = 'flex';
    },

    _nextQuestion() {
      document.getElementById('result-overlay').style.display = 'none';

      // Check end conditions
      const isLastQuestion = this.mode !== 'quickfire' && this.currentIndex >= this.currentQuestions.length - 1;
      const gauntletEnd = this.mode === 'gauntlet' && this.results.length > 0 && !this.results[this.results.length - 1].correct;

      if (isLastQuestion || gauntletEnd) {
        this._endGame();
        return;
      }

      this.currentIndex++;

      // Quick fire: loop questions if needed
      if (this.mode === 'quickfire' && this.currentIndex >= this.currentQuestions.length) {
        this.currentQuestions = this._shuffle([...this.currentQuestions]);
        this.currentIndex = 0;
      }

      this._updateGameUI();
      this._showWagerPhase();
    },

    // ─── TIMER (Quick Fire) ───
    _startTimer() {
      const timerBar = document.getElementById('timer-bar');
      const timerText = document.getElementById('timer-text');

      this.timerInterval = setInterval(() => {
        this.timeRemaining--;

        const mins = Math.floor(this.timeRemaining / 60);
        const secs = this.timeRemaining % 60;
        timerText.textContent = `${mins}:${String(secs).padStart(2, '0')}`;

        const pct = (this.timeRemaining / QUICKFIRE_DURATION) * 100;
        timerBar.style.width = pct + '%';

        if (pct < 33) timerBar.classList.add('urgent');
        else timerBar.classList.remove('urgent');

        if (this.timeRemaining <= 10) Audio.play('tick');

        if (this.timeRemaining <= 0) {
          clearInterval(this.timerInterval);
          this._endGame();
        }
      }, 1000);
    },

    // ─── END GAME ───
    _endGame() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      Audio.play('gameover');

      // Update player data
      this.playerData.gamesPlayed++;
      this.playerData.totalScore += this.score;
      this.playerData.totalCorrect += this.results.filter(r => r.correct).length;
      this.playerData.totalQuestions += this.results.length;
      this.playerData.bestChain = Math.max(this.playerData.bestChain, ...this.results.map(r => r.chainLength));

      // Category tracking
      const cats = new Set(this.results.map(r => r.category));
      cats.forEach(c => {
        if (!this.playerData.categoriesPlayed.includes(c)) {
          this.playerData.categoriesPlayed.push(c);
        }
        if (!this.playerData.categoryStats[c]) {
          this.playerData.categoryStats[c] = { correct: 0, total: 0 };
        }
        this.results.forEach(r => {
          if (r.category === c) {
            this.playerData.categoryStats[c].total++;
            if (r.correct) this.playerData.categoryStats[c].correct++;
          }
        });
      });

      // Streak
      const today = getTodayDateStr();
      if (this.playerData.lastPlayedDate !== today) {
        const last = this.playerData.lastPlayedDate;
        if (last) {
          const diffDays = Math.floor((new Date(today) - new Date(last)) / 86400000);
          if (diffDays === 1) {
            this.playerData.streak++;
          } else if (diffDays > 1) {
            this.playerData.streak = 1;
          }
        } else {
          this.playerData.streak = 1;
        }
        this.playerData.lastPlayedDate = today;
      }

      // Daily completion
      if (this.mode === 'daily') {
        this.playerData.dailyCompletedDate = today;
        const allCorrect = this.results.every(r => r.correct);
        if (allCorrect && this.results.length >= 10) {
          this.playerData.perfectDailies = (this.playerData.perfectDailies || 0) + 1;
        }
      }

      // Quick fire best
      if (this.mode === 'quickfire') {
        this.playerData.bestQuickFire = Math.max(this.playerData.bestQuickFire || 0, this.score);
      }

      // Record recent game
      this.playerData.recentGames.unshift({
        date: today,
        mode: this.mode,
        score: this.score,
        correct: this.results.filter(r => r.correct).length,
        total: this.results.length
      });
      if (this.playerData.recentGames.length > 20) this.playerData.recentGames.pop();

      // Check badges
      const newBadges = this._checkBadges();

      Store.save(this.playerData);

      // Show results
      this._showResults(newBadges);
    },

    _checkBadges() {
      const newBadges = [];
      const stats = {
        ...this.playerData,
        consecutiveAllInWins: this.playerData.maxConsecutiveAllInWins || 0
      };

      BADGES.forEach(badge => {
        if (!this.playerData.badges.includes(badge.id) && badge.check(stats)) {
          this.playerData.badges.push(badge.id);
          newBadges.push(badge);
        }
      });

      return newBadges;
    },

    // ─── RESULTS SCREEN ───
    _showResults(newBadges) {
      const correctCount = this.results.filter(r => r.correct).length;
      const totalCount = this.results.length;
      const bestChain = Math.max(0, ...this.results.map(r => r.chainLength));
      const avgClue = totalCount > 0 ? (this.results.reduce((s, r) => s + r.clueIndex + 1, 0) / totalCount).toFixed(1) : '0';

      // Wager style
      const wagerCounts = { safe: 0, bold: 0, allin: 0 };
      this.results.forEach(r => wagerCounts[r.wagerType]++);
      const wagerStyle = Object.entries(wagerCounts).sort((a, b) => b[1] - a[1])[0][0];
      const wagerLabels = { safe: 'Safe', bold: 'Bold', allin: 'All-In' };

      // Grade
      const pct = totalCount > 0 ? correctCount / totalCount : 0;
      let grade, gradeClass;
      if (pct >= 0.95) { grade = 'S'; gradeClass = 'grade-s'; }
      else if (pct >= 0.8) { grade = 'A'; gradeClass = 'grade-a'; }
      else if (pct >= 0.6) { grade = 'B'; gradeClass = 'grade-b'; }
      else if (pct >= 0.4) { grade = 'C'; gradeClass = 'grade-c'; }
      else { grade = 'D'; gradeClass = 'grade-d'; }

      // Title
      const modeLabels = { daily: 'Daily Drop Complete!', quickfire: 'Quick Fire Results', deepdive: 'Deep Dive Complete!', gauntlet: 'Gauntlet Over!' };
      document.getElementById('results-title').textContent = modeLabels[this.mode] || 'Game Over!';
      document.getElementById('results-score-big').textContent = this.score.toLocaleString();

      const gradeEl = document.getElementById('results-grade');
      gradeEl.textContent = grade;
      gradeEl.className = 'results-grade ' + gradeClass;

      document.getElementById('stat-correct').textContent = `${correctCount}/${totalCount}`;
      document.getElementById('stat-chain').textContent = bestChain;
      document.getElementById('stat-avg-clue').textContent = avgClue;
      document.getElementById('stat-wager-style').textContent = wagerLabels[wagerStyle];

      // Emoji grid
      const emojiGrid = document.getElementById('results-emoji-grid');
      const emojis = this.results.map(r => {
        if (!r.correct) return '\u{1F534}'; // red
        if (r.clueIndex <= 1) return '\u{1F48E}'; // diamond
        if (r.clueIndex === 2) return '\u{1F7E2}'; // green
        if (r.clueIndex === 3) return '\u{1F7E1}'; // yellow
        return '\u{1F7E0}'; // orange
      });
      emojiGrid.textContent = emojis.join(' ');

      // Badges
      const badgesSection = document.getElementById('results-badges');
      const badgesList = document.getElementById('badges-earned-list');
      if (newBadges.length > 0) {
        badgesSection.style.display = 'block';
        badgesList.innerHTML = newBadges.map(b =>
          `<div class="badge-pill">${b.icon} ${b.name}</div>`
        ).join('');
        Audio.play('badge');
        if (this.playerData.settings.animations !== false) {
          Particles.celebrate('rgb(255, 215, 64)');
        }
      } else {
        badgesSection.style.display = 'none';
      }

      // Play again button text
      const playAgainBtn = document.getElementById('btn-play-again');
      if (this.mode === 'daily') {
        playAgainBtn.style.display = 'none';
      } else {
        playAgainBtn.style.display = 'block';
        playAgainBtn.textContent = 'Play Again';
      }

      this._showScreen('results');

      if (this.playerData.settings.animations !== false && pct >= 0.8) {
        setTimeout(() => Particles.celebrate('rgb(79, 195, 247)'), 300);
      }
    },

    // ─── SHARE ───
    _shareResults() {
      const correctCount = this.results.filter(r => r.correct).length;
      const totalCount = this.results.length;
      const bestChain = Math.max(0, ...this.results.map(r => r.chainLength));
      const wagerCounts = { safe: 0, bold: 0, allin: 0 };
      this.results.forEach(r => wagerCounts[r.wagerType]++);
      const wagerStyle = Object.entries(wagerCounts).sort((a, b) => b[1] - a[1])[0][0];
      const wagerLabels = { safe: 'Safe', bold: 'Bold', allin: 'All-In' };

      const emojis = this.results.map(r => {
        if (!r.correct) return '\u{1F534}';
        if (r.clueIndex <= 1) return '\u{1F48E}';
        if (r.clueIndex === 2) return '\u{1F7E2}';
        if (r.clueIndex === 3) return '\u{1F7E1}';
        return '\u{1F7E0}';
      });

      const cat = this.results[0]?.category || 'mixed';
      const catName = CATEGORY_NAMES[cat] || 'Mixed';
      const modeLabel = this.mode === 'daily' ? `Daily #${getDayNumber()}` : this.mode.charAt(0).toUpperCase() + this.mode.slice(1);

      let text = `\u26A1 SYNAPSE ${modeLabel} \u2014 ${catName} \u26A1\n\n`;
      text += emojis.join(' ') + '\n\n';
      text += `\u{1F517} Chain: ${bestChain} | \u{1F4B0} ${wagerLabels[wagerStyle]} | \u{1F3AF} ${correctCount}/${totalCount}\n`;
      text += `Score: ${this.score.toLocaleString()} \u2B50`;
      if (this.playerData.streak > 1) text += ` | \u{1F525} ${this.playerData.streak} days`;
      text += '\n\nsynapsegame.com';

      navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('share-toast');
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 2000);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        const toast = document.getElementById('share-toast');
        toast.style.display = 'block';
        setTimeout(() => toast.style.display = 'none', 2000);
      });
    },

    // ─── STATS SCREEN ───
    _renderStats() {
      const pd = this.playerData;
      document.getElementById('total-score').textContent = pd.totalScore.toLocaleString();
      document.getElementById('total-games').textContent = pd.gamesPlayed;
      document.getElementById('accuracy-pct').textContent = pd.totalQuestions > 0
        ? Math.round((pd.totalCorrect / pd.totalQuestions) * 100) + '%' : '0%';
      document.getElementById('best-chain-ever').textContent = pd.bestChain;

      // Category bars
      const barsContainer = document.getElementById('category-bars');
      barsContainer.innerHTML = '';
      const cats = ['science', 'history', 'arts', 'geography', 'sports', 'popculture'];
      cats.forEach(cat => {
        const stats = pd.categoryStats[cat] || { correct: 0, total: 0 };
        const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        const row = document.createElement('div');
        row.className = 'cat-bar-row';
        row.innerHTML = `
          <span class="cat-bar-label">${CATEGORY_NAMES[cat]}</span>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width:${pct}%;background:${CATEGORY_COLORS[cat]}"></div>
          </div>
          <span class="cat-bar-pct">${pct}%</span>
        `;
        barsContainer.appendChild(row);
      });

      // Recent games
      const recentContainer = document.getElementById('recent-games');
      recentContainer.innerHTML = '';
      if (pd.recentGames.length === 0) {
        recentContainer.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No games played yet.</p>';
      } else {
        pd.recentGames.slice(0, 10).forEach(g => {
          const row = document.createElement('div');
          row.className = 'recent-game-row';
          const modeLabels = { daily: 'Daily', quickfire: 'Quick Fire', deepdive: 'Deep Dive', gauntlet: 'Gauntlet' };
          row.innerHTML = `
            <span class="recent-game-date">${g.date}</span>
            <span class="recent-game-mode">${modeLabels[g.mode] || g.mode}</span>
            <span class="recent-game-score">${g.score.toLocaleString()}</span>
          `;
          recentContainer.appendChild(row);
        });
      }
    },

    // ─── BADGES SCREEN ───
    _renderBadges() {
      const grid = document.getElementById('badges-grid');
      grid.innerHTML = '';
      BADGES.forEach(badge => {
        const earned = this.playerData.badges.includes(badge.id);
        const card = document.createElement('div');
        card.className = `badge-card ${earned ? 'earned' : 'locked'}`;
        card.innerHTML = `
          <div class="badge-icon">${badge.icon}</div>
          <div class="badge-name">${badge.name}</div>
          <div class="badge-desc">${badge.desc}</div>
        `;
        grid.appendChild(card);
      });
    },

    // ─── SETTINGS ───
    _loadSettings() {
      document.getElementById('setting-sound').checked = this.playerData.settings.sound !== false;
      document.getElementById('setting-animations').checked = this.playerData.settings.animations !== false;
      Audio.enabled = this.playerData.settings.sound !== false;
    },

    // ─── TUTORIAL ───
    _tutorialStep: 0,

    _showTutorial() {
      this._tutorialStep = 0;
      document.getElementById('tutorial-overlay').style.display = 'flex';
      this._renderTutorialStep();
    },

    _renderTutorialStep() {
      const step = TUTORIAL_STEPS[this._tutorialStep];
      document.getElementById('tutorial-illustration').textContent = step.icon;
      document.getElementById('tutorial-title').textContent = step.title;
      document.getElementById('tutorial-text').textContent = step.text;

      // Dots
      const dots = document.getElementById('tutorial-dots');
      dots.innerHTML = TUTORIAL_STEPS.map((_, i) =>
        `<div class="tutorial-dot ${i === this._tutorialStep ? 'active' : ''}"></div>`
      ).join('');

      // Button text
      const nextBtn = document.getElementById('btn-tutorial-next');
      nextBtn.textContent = this._tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Let\u2019s Play!' : 'Next';
    },

    _tutorialNext() {
      this._tutorialStep++;
      if (this._tutorialStep >= TUTORIAL_STEPS.length) {
        document.getElementById('tutorial-overlay').style.display = 'none';
      } else {
        this._renderTutorialStep();
      }
    }
  };

  // ─── BOOT ───
  document.addEventListener('DOMContentLoaded', () => Game.init());
  document.addEventListener('click', () => Audio.resume(), { once: true });
})();
