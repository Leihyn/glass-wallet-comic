// Voiceover system for The Glass Wallet comic - with options

class ComicVoiceover {
    constructor() {
        this.isEnabled = false;
        this.isPlaying = false;
        this.currentPage = 1;
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;

        // Settings with defaults
        this.settings = {
            mode: 'narrator', // 'narrator' (single voice), 'characters' (different voices), 'off'
            voice: null,      // Selected voice
            rate: 1.0,        // 0.5 - 2.0
            pitch: 1.0,       // 0.5 - 1.5
        };

        this.availableVoices = [];

        // Simple narrator script (no character distinction)
        this.narratorScript = {
            1: `Meet Alex. Freelance developer. Solana DeFi user. Not a whale. Not a criminal. Just someone trying to build wealth. "Alright, let's swap some SOL for USDC on Jupiter. Simple."`,

            2: `The problem begins. The moment you submit a transaction, everyone sees. Broadcasting to the public mempool. MEV bots are watching. Always watching. They see your trade before it lands. They sandwich you. You get the worse price.`,

            3: `The cost of transparency. MEV attacks cost Solana users millions every month. Alex expected 500 USDC but received only 450. A scammer messages: "Hey, I see you're holding 2,340 SOL..." Your wallet is public. Anyone can look it up. One wallet address, connected to everything. Your purchases, your positions, your patterns. Your landlord checks before negotiating rent. Your employer sees your side income. Scammers know exactly who to target. Alex thinks: "I'm not hiding anything illegal. So why do I feel so exposed?"`,

            4: `More real-world consequences. Price discrimination based on on-chain activity. On-chain history follows you forever. It's like carrying a billboard of your bank statements everywhere you go. News headlines warn of crypto whales robbed, users doxxed after wallets linked to identity. Alex wonders: "I just want to use DeFi without my whole life being on display. Is that so wrong?"`,

            5: `Meanwhile, on the other side of the debate. Maya, a compliance professional, investigates privacy protocols. She explains: "Total anonymity has been exploited. Ransomware payments. Stolen funds. Money laundering. When we can't trace anything, bad actors thrive." She's not wrong. Privacy coins are being delisted. Regulatory pressure is mounting. But Maya also knows what it's like to want privacy. She doesn't post her salary online or share her bank statements. Is wanting that for crypto really so different?`,

            6: `This is the choice we've been given. Full transparency versus total anonymity. Expose everything, or look like a criminal. Alex doesn't want to be a glass wallet. But total darkness serves bad actors just fine. Neither extreme works. There has to be another way. What if privacy didn't have to mean invisibility? What if you could choose what to reveal, and what to protect?`,

            7: `Alex discovers encrypt.trade. Selective privacy. Not hiding. Choosing. A guide explains: "It's not about hiding. It's about choosing who sees what. Right now, when you trade on Solana, it's like sending cash in a clear envelope. Everyone can see what's inside. With encrypt.trade, your envelope is sealed. The network can verify it's valid, but they can't see what's inside."`,

            8: `How it actually works. What stays encrypted: Your balance, so no one knows what you hold. Your route, so no one can front-run your path. Your intent, so no one knows what you're about to do. Think of regular Solana DeFi as a glass building where everyone sees everything. Encrypt.trade is frosted glass. Activity verified, details private. You can still swap using Jupiter's liquidity, bridge to Zcash, and send tokens privately.`,

            9: `The key insight: selective privacy. Alex realizes: "So I'm not becoming invisible. I'm just choosing what's visible." Exactly. Total transparency leaves you vulnerable. Total anonymity raises red flags and enables abuse. Selective privacy is just normal. That's how privacy works in the real world. You don't post your bank statements, but you file taxes. That's selective privacy. Alex can trade without being front-run, without everyone seeing their balance, without painting a target on themselves. And if they ever need to prove something for compliance, they can choose to reveal it. Swap complete. Private.`,

            10: `Maya reviews the concept. Selective privacy means compliance is still possible when needed, but users aren't exposed by default. That's actually reasonable. Privacy and accountability are not opposites. They're a balance. Accountability is opt-in, not opt-out. Privacy isn't about hiding. It's about consent. Alex realizes: "I decide who sees what. Not the blockchain. Not the bots. Not the algorithms." That's what encrypt.trade gives you.`,

            11: `Privacy is a human right. Not a criminal trait. Selective privacy gives you control without requiring trust. Trade privately on Solana. Swap any SPL token. Bridge to Zcash. Send privately. Your balances, routes, and intent stay encrypted. Full Jupiter liquidity. Zero exposure. Encrypt.trade. Privacy isn't hiding. It's choosing.`,

            12: `The end. Thank you for reading The Glass Wallet. Visit encrypt.trade to try selective privacy on Solana.`
        };

        this.init();
    }

    init() {
        this.loadVoices();
        this.createUI();

        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.availableVoices = this.synth.getVoices();
        this.updateVoiceSelect();

        // Set default voice
        if (!this.settings.voice && this.availableVoices.length > 0) {
            // Prefer a good English voice
            const preferred = this.availableVoices.find(v =>
                v.name.includes('Daniel') ||
                v.name.includes('Samantha') ||
                v.name.includes('Google US English') ||
                v.name.includes('Alex')
            );
            this.settings.voice = preferred || this.availableVoices[0];
        }
    }

    createUI() {
        // Settings panel
        const panel = document.createElement('div');
        panel.className = 'voiceover-panel';
        panel.id = 'voiceoverPanel';
        panel.innerHTML = `
            <div class="voiceover-panel-header">
                <span>Voiceover Settings</span>
                <button class="voiceover-close" id="closePanel">&times;</button>
            </div>
            <div class="voiceover-panel-body">
                <div class="voiceover-option">
                    <label>Voice</label>
                    <select id="voiceSelect"></select>
                </div>
                <div class="voiceover-option">
                    <label>Speed</label>
                    <input type="range" id="rateSlider" min="0.5" max="1.5" step="0.1" value="1.0">
                    <span id="rateValue">1.0x</span>
                </div>
                <div class="voiceover-option">
                    <label>Pitch</label>
                    <input type="range" id="pitchSlider" min="0.5" max="1.5" step="0.1" value="1.0">
                    <span id="pitchValue">1.0</span>
                </div>
                <div class="voiceover-option">
                    <button class="voiceover-test-btn" id="testVoice">Test Voice</button>
                </div>
            </div>
        `;

        // Control buttons
        const controls = document.createElement('div');
        controls.className = 'voiceover-controls';
        controls.innerHTML = `
            <button class="voiceover-btn" id="voiceoverToggle" title="Toggle voiceover">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-off">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-on" style="display:none;">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
            </button>
            <button class="voiceover-btn" id="voiceoverSettings" title="Voiceover settings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
            </button>
            <button class="voiceover-btn" id="playPauseBtn" title="Play/Pause" style="display:none;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-play">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-pause" style="display:none;">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
            </button>
            <button class="voiceover-btn" id="stopBtn" title="Stop" style="display:none;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="4" width="16" height="16" rx="2"/>
                </svg>
            </button>
        `;

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            .voiceover-controls {
                position: fixed;
                bottom: 24px;
                left: 24px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                z-index: 100;
            }
            .voiceover-btn {
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--color-bg-card, #18181b);
                border: 1px solid var(--color-border, #27272a);
                border-radius: 8px;
                color: var(--color-text-secondary, #a1a1aa);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .voiceover-btn:hover {
                border-color: var(--color-accent, #8b5cf6);
                color: var(--color-accent, #8b5cf6);
            }
            .voiceover-btn.active {
                background: var(--color-accent, #8b5cf6);
                border-color: var(--color-accent, #8b5cf6);
                color: white;
            }

            .voiceover-panel {
                position: fixed;
                bottom: 80px;
                left: 24px;
                width: 280px;
                background: var(--color-bg-card, #18181b);
                border: 1px solid var(--color-border, #27272a);
                border-radius: 12px;
                z-index: 101;
                display: none;
                overflow: hidden;
            }
            .voiceover-panel.visible {
                display: block;
            }
            .voiceover-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid var(--color-border, #27272a);
                font-weight: 600;
                font-size: 14px;
            }
            .voiceover-close {
                background: none;
                border: none;
                color: var(--color-text-secondary, #a1a1aa);
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            .voiceover-close:hover {
                color: var(--color-text, #fafafa);
            }
            .voiceover-panel-body {
                padding: 16px;
            }
            .voiceover-option {
                margin-bottom: 16px;
            }
            .voiceover-option:last-child {
                margin-bottom: 0;
            }
            .voiceover-option label {
                display: block;
                font-size: 12px;
                color: var(--color-text-secondary, #a1a1aa);
                margin-bottom: 6px;
            }
            .voiceover-option select {
                width: 100%;
                padding: 8px 12px;
                background: var(--color-bg, #0a0a0b);
                border: 1px solid var(--color-border, #27272a);
                border-radius: 6px;
                color: var(--color-text, #fafafa);
                font-size: 13px;
            }
            .voiceover-option input[type="range"] {
                width: calc(100% - 40px);
                margin-right: 8px;
                vertical-align: middle;
            }
            .voiceover-option span {
                font-size: 12px;
                color: var(--color-text-muted, #71717a);
            }
            .voiceover-test-btn {
                width: 100%;
                padding: 10px;
                background: var(--color-accent, #8b5cf6);
                border: none;
                border-radius: 6px;
                color: white;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s;
            }
            .voiceover-test-btn:hover {
                background: var(--color-accent-hover, #a78bfa);
            }

            .voiceover-status {
                position: fixed;
                top: 60px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.9);
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 13px;
                color: white;
                z-index: 102;
                display: none;
                align-items: center;
                gap: 8px;
            }
            .voiceover-status.visible {
                display: flex;
            }
            .voiceover-status .spinner {
                width: 14px;
                height: 14px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Status indicator
        const status = document.createElement('div');
        status.className = 'voiceover-status';
        status.id = 'voiceoverStatus';
        status.innerHTML = `<div class="spinner"></div><span>Playing...</span>`;

        document.body.appendChild(panel);
        document.body.appendChild(controls);
        document.body.appendChild(status);

        this.bindEvents();
        this.observePageChanges();
    }

    updateVoiceSelect() {
        const select = document.getElementById('voiceSelect');
        if (!select) return;

        select.innerHTML = '';
        this.availableVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            if (this.settings.voice && voice.name === this.settings.voice.name) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    bindEvents() {
        // Toggle voiceover
        document.getElementById('voiceoverToggle').addEventListener('click', () => this.toggle());

        // Settings panel
        document.getElementById('voiceoverSettings').addEventListener('click', () => this.togglePanel());
        document.getElementById('closePanel').addEventListener('click', () => this.togglePanel(false));

        // Play/Pause
        document.getElementById('playPauseBtn').addEventListener('click', () => this.playPause());

        // Stop
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());

        // Voice select
        document.getElementById('voiceSelect').addEventListener('change', (e) => {
            this.settings.voice = this.availableVoices[e.target.value];
        });

        // Rate slider
        document.getElementById('rateSlider').addEventListener('input', (e) => {
            this.settings.rate = parseFloat(e.target.value);
            document.getElementById('rateValue').textContent = `${this.settings.rate}x`;
        });

        // Pitch slider
        document.getElementById('pitchSlider').addEventListener('input', (e) => {
            this.settings.pitch = parseFloat(e.target.value);
            document.getElementById('pitchValue').textContent = this.settings.pitch;
        });

        // Test voice
        document.getElementById('testVoice').addEventListener('click', () => {
            this.stop();
            this.speak("Privacy isn't hiding. It's choosing. This is how your voiceover will sound.");
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('voiceoverPanel');
            const settingsBtn = document.getElementById('voiceoverSettings');
            if (panel.classList.contains('visible') &&
                !panel.contains(e.target) &&
                !settingsBtn.contains(e.target)) {
                this.togglePanel(false);
            }
        });
    }

    observePageChanges() {
        let lastPage = 1;

        // Watch for scroll-based page changes
        window.addEventListener('scroll', () => {
            if (!this.isEnabled) return;

            const pages = document.querySelectorAll('.comic-page');
            pages.forEach((page, index) => {
                const rect = page.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    const newPage = index + 1;
                    if (newPage !== lastPage) {
                        lastPage = newPage;
                        this.currentPage = newPage;
                        this.playPage(newPage);
                    }
                }
            });
        });

        // Also watch the page counter
        const observer = new MutationObserver(() => {
            if (!this.isEnabled) return;
            const el = document.getElementById('currentPage');
            if (el) {
                const newPage = parseInt(el.textContent);
                if (newPage !== lastPage) {
                    lastPage = newPage;
                    this.currentPage = newPage;
                    this.playPage(newPage);
                }
            }
        });

        const currentPageEl = document.getElementById('currentPage');
        if (currentPageEl) {
            observer.observe(currentPageEl, { childList: true, characterData: true, subtree: true });
        }
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        const btn = document.getElementById('voiceoverToggle');
        const playBtn = document.getElementById('playPauseBtn');
        const stopBtn = document.getElementById('stopBtn');

        if (this.isEnabled) {
            btn.classList.add('active');
            btn.querySelector('.icon-off').style.display = 'none';
            btn.querySelector('.icon-on').style.display = 'block';
            playBtn.style.display = 'flex';
            stopBtn.style.display = 'flex';
            this.playPage(this.currentPage);
        } else {
            btn.classList.remove('active');
            btn.querySelector('.icon-off').style.display = 'block';
            btn.querySelector('.icon-on').style.display = 'none';
            playBtn.style.display = 'none';
            stopBtn.style.display = 'none';
            this.stop();
        }
    }

    togglePanel(show) {
        const panel = document.getElementById('voiceoverPanel');
        if (show === undefined) {
            panel.classList.toggle('visible');
        } else {
            panel.classList.toggle('visible', show);
        }
    }

    playPause() {
        if (this.synth.paused) {
            this.synth.resume();
            this.isPlaying = true;
        } else if (this.synth.speaking) {
            this.synth.pause();
            this.isPlaying = false;
        } else {
            this.playPage(this.currentPage);
        }
        this.updateUI();
    }

    stop() {
        this.synth.cancel();
        this.isPlaying = false;
        this.updateUI();
    }

    playPage(pageNum) {
        this.stop();

        const script = this.narratorScript[pageNum];
        if (!script) return;

        this.speak(script);
    }

    speak(text) {
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);

            if (this.settings.voice) {
                utterance.voice = this.settings.voice;
            }
            utterance.rate = this.settings.rate;
            utterance.pitch = this.settings.pitch;

            utterance.onstart = () => {
                this.isPlaying = true;
                this.updateUI();
            };

            utterance.onend = () => {
                this.isPlaying = false;
                this.updateUI();
                resolve();
            };

            utterance.onerror = () => {
                this.isPlaying = false;
                this.updateUI();
                resolve();
            };

            this.synth.speak(utterance);
        });
    }

    updateUI() {
        const playBtn = document.getElementById('playPauseBtn');
        const status = document.getElementById('voiceoverStatus');

        if (playBtn) {
            const playIcon = playBtn.querySelector('.icon-play');
            const pauseIcon = playBtn.querySelector('.icon-pause');

            if (this.isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        }

        if (status) {
            status.classList.toggle('visible', this.isPlaying);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.comic-pages')) {
        window.comicVoiceover = new ComicVoiceover();
    }
});
