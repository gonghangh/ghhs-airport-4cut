// 공항네컷 (Airport 4-Cuts) Audio Effects Engine (Web Audio API & Speech Synthesis)
class AirportAudioEngine {
    constructor() {
        this.ctx = null;
        this.voiceEnabled = true;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // 공항 탑승 안내 시그니처 차임벨 (Incheon Airport Chime: F4 -> A4 -> C5 -> F5)
    playAirportChime() {
        if (this.muted) return;
        this.init();
        const notes = [349.23, 440.00, 523.25, 698.46]; // F4, A4, C5, F5
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.28);

            gain.gain.setValueAtTime(0, now + idx * 0.28);
            gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.28 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.28 + 1.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.28);
            osc.stop(now + idx * 0.28 + 1.3);
        });
    }

    // 카운트다운 비프음 (3, 2, 1)
    playCountdownBeep(count) {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 1초 전 마지막 카운트는 더 높은 톤
        const freq = count === 1 ? 880 : 587.33; 
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);

        // 음성 카운트다운 (Web Speech)
        if (this.voiceEnabled && window.speechSynthesis) {
            try {
                window.speechSynthesis.cancel();
                const text = count === 1 ? "하나" : count === 2 ? "둘" : count === 3 ? "셋" : String(count);
                const utter = new SpeechSynthesisUtterance(text);
                utter.rate = 1.3;
                utter.pitch = 1.1;
                utter.lang = 'ko-KR';
                window.speechSynthesis.speak(utter);
            } catch (e) {
                // Speech synthesis failure fallback
            }
        }
    }

    // 카메라 셔터음 (Realistic mechanical shutter)
    playShutter() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        // 1. Shutter click noise
        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.02));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(3, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.12);

        // 2. Second shutter mechanical sound
        setTimeout(() => {
            if (!this.ctx || this.muted) return;
            const now2 = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(280, now2);
            osc.frequency.exponentialRampToValueAtTime(80, now2 + 0.08);

            gain2.gain.setValueAtTime(0.4, now2);
            gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.08);

            osc.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc.start(now2);
            osc.stop(now2 + 0.09);
        }, 60);
    }

    // 스탬프 도장 찍는 쾅! 소리
    playStampSound() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.17);
    }

    // 화면 터치 탭 햅틱 사운드
    playTouchBeep() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // 프린트 출력 시작 사운드
    playPrintStart() {
        if (this.muted) return;
        this.playAirportChime();
        if (this.voiceEnabled && window.speechSynthesis) {
            setTimeout(() => {
                try {
                    const utter = new SpeechSynthesisUtterance("공항네컷 인쇄를 시작합니다. 출구에서 사진을 받아가세요!");
                    utter.lang = 'ko-KR';
                    utter.rate = 1.05;
                    window.speechSynthesis.speak(utter);
                } catch (e) {}
            }, 1200);
        }
    }
}

window.airportAudio = new AirportAudioEngine();
