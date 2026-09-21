// 공항네컷 (Airport 4-Cuts) Kiosk Controller Application
class AirportBoothApp {
    constructor() {
        // App State
        this.currentScreen = 'screen-welcome';
        this.layout = 'custom';
        this.theme = 'custom_airport';
        this.customUploadedMask = null;
        this.timerSeconds = 5;
        this.currentFilter = 'normal';
        this.passengerName = 'GHHS 2026';
        this.destination = '인천공항고 ✈ 빛나는 미래';
        this.copies = 1;
        this.stamps = [];

        // Shooting State
        this.capturedCuts = [];
        this.targetCutsCount = 4;
        this.isCountingDown = false;
        this.countdownTimer = null;
        this.autoResetTimer = null;

        // Rendered Canvas Result
        this.finalCanvas = null;
        this.finalDataUrl = null;
        this.finalA4Canvas = null;
        this.finalA4DataUrl = null;
        this.printPaper = 'a4'; // 기본값: A4 1장에 4장 모아찍기 (여백 절약)
        this.savedSessionFiles = null;

        // Printers & Devices
        this.printers = [];
        this.selectedPrinter = null;
        this.selectedCameraId = null;

        // Subsystems
        this.camera = null;
        this.renderer = new AirportFrameRenderer();
        this.audio = window.airportAudio;
    }

    async init() {
        this.initDOM();
        this.bindEvents();
        this.bindKeyboardShortcuts();

        // Initialize Camera
        const videoEl = document.getElementById('cam-video');
        this.camera = new AirportCamera(videoEl);

        // Load devices and printers
        await this.loadPrinters();
        await this.setupCameraList();

        console.log('공항네컷 키오스크 시스템이 준비되었습니다 ✈️');
    }

    initDOM() {
        this.screens = {
            welcome: document.getElementById('screen-welcome'),
            layout: document.getElementById('screen-layout'),
            shooting: document.getElementById('screen-shooting'),
            customize: document.getElementById('screen-customize'),
            print: document.getElementById('screen-print')
        };
    }

    // 화면 전환 매니저
    switchScreen(targetId) {
        Object.keys(this.screens).forEach(key => {
            const screen = this.screens[key];
            if (screen.id === targetId) {
                screen.classList.add('active');
                screen.style.display = 'flex';
                setTimeout(() => screen.style.opacity = '1', 10);
            } else {
                screen.style.opacity = '0';
                setTimeout(() => {
                    screen.classList.remove('active');
                    screen.style.display = 'none';
                }, 250);
            }
        });

        this.currentScreen = targetId;

        // Screen specific hooks
        if (targetId === 'screen-welcome') {
            this.resetSession();
            this.camera.stopCamera();
        } else if (targetId === 'screen-shooting') {
            this.startCameraSession();
        } else if (targetId === 'screen-customize') {
            this.camera.stopCamera();
            this.updateCustomizePreview();
        } else if (targetId === 'screen-print') {
            this.setupPrintScreen();
        }
    }

    // 장치 및 프린터 목록 조회
    async loadPrinters() {
        try {
            const res = await fetch('/api/printers');
            const data = await res.json();
            if (data.success && data.printers) {
                this.printers = data.printers;
                const select = document.getElementById('select-printer-device');
                select.innerHTML = '';

                // L8180 우선 선택
                const l8180 = this.printers.find(p => p.Name.includes('L8180') || p.DriverName.includes('L8180'));
                this.selectedPrinter = l8180 ? l8180.Name : (this.printers[0] ? this.printers[0].Name : '기본 프린터');

                this.printers.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.Name;
                    opt.textContent = `${p.Name} (${p.DriverName})`;
                    if (p.Name === this.selectedPrinter) opt.selected = true;
                    select.appendChild(opt);
                });

                document.getElementById('printer-status-text').textContent = `${this.selectedPrinter} 온라인`;
                document.getElementById('target-printer-name').textContent = this.selectedPrinter;
            }
        } catch (e) {
            console.warn('프린터 정보 로드 실패 (기본값 유지):', e);
            document.getElementById('printer-status-text').textContent = 'EPSON L8180 Series';
            document.getElementById('target-printer-name').textContent = 'EPSON L8180 Series(네트워크)';
        }
    }

    async setupCameraList() {
        const devices = await this.camera.getDevices();
        const select = document.getElementById('select-camera-device');
        select.innerHTML = '';

        devices.forEach((d, i) => {
            const opt = document.createElement('option');
            opt.value = d.deviceId;
            opt.textContent = d.label || `카메라 ${i + 1}`;
            select.appendChild(opt);
        });

        if (devices.length > 0) {
            document.getElementById('camera-status-text').textContent = `${devices[0].label.slice(0, 15)}...`;
        }
    }

    // 이벤트 리스너 바인딩
    bindEvents() {
        // [대기 화면] 탑승 수속 시작 버튼
        document.getElementById('btn-start-checkin').addEventListener('click', () => {
            this.audio.playAirportChime();
            this.switchScreen('screen-layout');
        });

        // [레이아웃 화면] 옵션 선택 카드 클릭
        document.querySelectorAll('#layout-options .select-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('#layout-options .select-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.layout = card.dataset.layout;
            });
        });

        // 테마 선택 (이벤트 위임으로 동적 추가 프레임도 지원)
        document.getElementById('theme-options').addEventListener('click', (e) => {
            const card = e.target.closest('.select-card');
            if (!card) return;
            document.querySelectorAll('#theme-options .select-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            this.theme = card.dataset.theme;
        });

        // 사용자가 새 프레임 이미지 직접 파일 업로드할 때
        const frameFileInput = document.getElementById('input-custom-frame-file');
        if (frameFileInput) {
            frameFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (loadEvt) => {
                    const dataUrl = loadEvt.target.result;
                    this.customUploadedMask = dataUrl;
                    this.theme = 'custom_uploaded';

                    const themeContainer = document.getElementById('theme-options');
                    document.querySelectorAll('#theme-options .select-card').forEach(c => c.classList.remove('active'));

                    const newCard = document.createElement('div');
                    newCard.className = 'select-card active';
                    newCard.dataset.theme = 'custom_uploaded';
                    newCard.innerHTML = `
                        <div class="card-thumb-wrap">
                            <img src="${dataUrl}" alt="업로드 프레임">
                        </div>
                        <div class="card-label">직접 추가한 프레임</div>
                        <div class="card-desc">${file.name}</div>
                    `;
                    themeContainer.prepend(newCard);
                    this.audio.playAirportChime();
                };
                reader.readAsDataURL(file);
            });
        }

        document.querySelectorAll('#timer-options .select-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('#timer-options .select-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.timerSeconds = parseInt(card.dataset.timer, 10);
            });
        });

        document.getElementById('btn-back-to-welcome').addEventListener('click', () => {
            this.switchScreen('screen-welcome');
        });

        document.getElementById('btn-to-shooting').addEventListener('click', () => {
            this.switchScreen('screen-shooting');
        });

        // [촬영 화면] 컨트롤 버튼
        document.getElementById('btn-trigger-shot').addEventListener('click', () => {
            this.startCountdownSequence();
        });

        document.getElementById('btn-retake-last').addEventListener('click', () => {
            this.retakeLastShot();
        });

        document.getElementById('btn-toggle-mirror').addEventListener('click', () => {
            this.camera.toggleMirror();
        });

        // [커스텀 화면] 필터 선택
        document.querySelectorAll('#filter-buttons .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#filter-buttons .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.updateCustomizePreview();
            });
        });

        // 글로벌 터치 햅틱 사운드
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, .select-card, .tag-btn, .stamp-btn, .touch-key');
            if (target) {
                this.audio.playTouchBeep();
            }
        });

        // 대기 화면 터치 시 탑승 수속 시작
        document.getElementById('screen-welcome').addEventListener('click', () => {
            if (this.currentScreen === 'screen-welcome') {
                this.audio.playAirportChime();
                this.switchScreen('screen-layout');
            }
        });

        // 퀵 태그 (원터치 공항고 문구 선택)
        document.querySelectorAll('#quick-tags .tag-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#quick-tags .tag-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.passengerName = btn.dataset.name;
                this.destination = btn.dataset.dest;
                const display = document.getElementById('active-tag-display');
                if (display) {
                    display.innerHTML = `현재 문구: <strong>${this.passengerName} · ${this.destination}</strong>`;
                }
                this.updateCustomizePreview();
            });
        });

        // 터치 가상 키보드
        const kbModal = document.getElementById('touch-keyboard-modal');
        const kbInput = document.getElementById('touch-kb-input');

        document.getElementById('btn-open-touch-kb').addEventListener('click', () => {
            kbInput.value = this.passengerName;
            this.renderTouchKeyboard();
            kbModal.style.display = 'flex';
        });

        document.getElementById('btn-touch-kb-cancel').addEventListener('click', () => {
            kbModal.style.display = 'none';
        });

        document.getElementById('btn-touch-kb-apply').addEventListener('click', () => {
            if (kbInput.value.trim()) {
                this.passengerName = kbInput.value.trim();
                const display = document.getElementById('active-tag-display');
                if (display) {
                    display.innerHTML = `현재 문구: <strong>${this.passengerName} · ${this.destination}</strong>`;
                }
                this.updateCustomizePreview();
            }
            kbModal.style.display = 'none';
        });

        // 스탬프 토글
        document.querySelectorAll('#stamp-selector .stamp-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                const icon = btn.dataset.icon;
                const existingIdx = this.stamps.findIndex(s => s.icon === icon);
                if (existingIdx >= 0) {
                    this.stamps.splice(existingIdx, 1);
                } else {
                    // 무작위 약간의 회전과 위치
                    this.stamps.push({
                        icon,
                        x: 80 + Math.random() * 400,
                        y: 300 + Math.random() * 800,
                        rotate: (Math.random() * 30) - 15,
                        size: 45
                    });
                }
                this.audio.playStampSound();
                this.updateCustomizePreview();
            });
        });

        document.getElementById('btn-back-to-shooting').addEventListener('click', () => {
            this.switchScreen('screen-shooting');
        });

        document.getElementById('btn-to-print').addEventListener('click', () => {
            this.switchScreen('screen-print');
            // 마지막 화면 진입 시 바로 인쇄 다이얼로그 팝업 및 출력 동작!
            setTimeout(() => {
                this.executePrint();
            }, 600);
        });

        // [용지 선택: A4 4장 모아찍기 vs 4x6 전면]
        const btnPaperA4 = document.getElementById('paper-btn-a4');
        const btnPaper4x6 = document.getElementById('paper-btn-4x6');
        if (btnPaperA4 && btnPaper4x6) {
            btnPaperA4.addEventListener('click', () => {
                btnPaper4x6.classList.remove('active');
                btnPaperA4.classList.add('active');
                this.printPaper = 'a4';
                this.updatePrintPreview();
            });
            btnPaper4x6.addEventListener('click', () => {
                btnPaperA4.classList.remove('active');
                btnPaper4x6.classList.add('active');
                this.printPaper = '4x6';
                this.updatePrintPreview();
            });
        }

        // [인쇄 화면] 컨트롤 버튼
        document.getElementById('copies-1').addEventListener('click', (e) => {
            document.getElementById('copies-2').classList.remove('active');
            e.target.classList.add('active');
            this.copies = 1;
        });

        document.getElementById('copies-2').addEventListener('click', (e) => {
            document.getElementById('copies-1').classList.remove('active');
            e.target.classList.add('active');
            this.copies = 2;
        });

        document.getElementById('btn-do-print').addEventListener('click', () => {
            this.executePrint();
        });

        document.getElementById('btn-save-disk').addEventListener('click', () => {
            this.downloadImageDirectly();
        });

        document.getElementById('btn-new-passenger').addEventListener('click', () => {
            this.switchScreen('screen-welcome');
        });

        // 사운드 토글
        document.getElementById('btn-sound-toggle').addEventListener('click', (e) => {
            this.audio.muted = !this.audio.muted;
            e.target.textContent = this.audio.muted ? '🔇' : '🔊';
        });

        // 전체화면 토글
        document.getElementById('btn-fullscreen-toggle').addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        });

        // 설정 모달
        document.getElementById('btn-settings').addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'flex';
        });
        document.getElementById('btn-close-settings').addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'none';
        });
        document.getElementById('btn-close-modal').addEventListener('click', () => {
            document.getElementById('print-modal').style.display = 'none';
        });
    }

    bindKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Spacebar = 카메라 즉시 촬영
            if (e.code === 'Space' && this.currentScreen === 'screen-shooting') {
                e.preventDefault();
                if (!this.isCountingDown) {
                    this.startCountdownSequence();
                }
            }
        });
    }

    // 카메라 세션 시작
    async startCameraSession() {
        const res = await this.camera.startCamera(this.selectedCameraId);
        if (!res.success) {
            alert('카메라를 열 수 없습니다. 연결 상태를 확인해주세요.');
        }
        this.updateSlotsDisplay();
    }

    // 4컷 카운트다운 촬영 시퀀스
    startCountdownSequence() {
        if (this.isCountingDown) return;
        if (this.capturedCuts.length >= this.targetCutsCount) {
            this.switchScreen('screen-customize');
            return;
        }

        this.isCountingDown = true;
        document.getElementById('btn-trigger-shot').disabled = true;

        let secondsLeft = this.timerSeconds;
        const overlay = document.getElementById('countdown-overlay');
        const countText = document.getElementById('countdown-text');

        overlay.style.display = 'flex';
        countText.textContent = secondsLeft;
        this.audio.playCountdownBeep(secondsLeft);

        this.countdownTimer = setInterval(() => {
            secondsLeft--;
            if (secondsLeft > 0) {
                countText.textContent = secondsLeft;
                this.audio.playCountdownBeep(secondsLeft);
            } else {
                clearInterval(this.countdownTimer);
                overlay.style.display = 'none';
                this.takeSingleShot();
            }
        }, 1000);
    }

    // 단일 컷 캡처
    takeSingleShot() {
        // Flash effect
        const flash = document.getElementById('flash-overlay');
        flash.classList.add('active');
        this.audio.playShutter();

        setTimeout(() => {
            flash.classList.remove('active');
        }, 150);

        try {
            const photoDataUrl = this.camera.capturePhoto();
            this.capturedCuts.push(photoDataUrl);
            this.updateSlotsDisplay();

            // 다음 컷 또는 완료 체크
            if (this.capturedCuts.length < this.targetCutsCount) {
                // 1.5초 후 자동으로 다음 컷 촬영 준비
                setTimeout(() => {
                    this.isCountingDown = false;
                    document.getElementById('btn-trigger-shot').disabled = false;
                    this.startCountdownSequence();
                }, 1500);
            } else {
                // 4컷 촬영 완료! 커스텀 화면으로 자동 이동
                this.isCountingDown = false;
                setTimeout(() => {
                    this.audio.playAirportChime();
                    this.switchScreen('screen-customize');
                }, 1200);
            }
        } catch (e) {
            console.error('사진 캡처 실패:', e);
            this.isCountingDown = false;
            document.getElementById('btn-trigger-shot').disabled = false;
        }
    }

    retakeLastShot() {
        if (this.capturedCuts.length > 0) {
            this.capturedCuts.pop();
            this.updateSlotsDisplay();
            this.isCountingDown = false;
            document.getElementById('btn-trigger-shot').disabled = false;
        }
    }

    updateSlotsDisplay() {
        const count = this.capturedCuts.length;
        document.getElementById('cuts-indicator').textContent = `SHOT ${Math.min(count + 1, 4)} / 4`;

        for (let i = 0; i < 4; i++) {
            const slot = document.getElementById(`slot-${i}`);
            slot.classList.remove('current');
            if (i < count) {
                slot.innerHTML = `<img src="${this.capturedCuts[i]}" alt="컷 ${i + 1}">`;
            } else {
                slot.innerHTML = `<span>${i + 1}</span>`;
            }
        }

        if (count < 4) {
            document.getElementById(`slot-${count}`).classList.add('current');
            document.getElementById('btn-shoot-label').textContent = `${count + 1}번째 컷 촬영`;
        } else {
            document.getElementById('btn-shoot-label').textContent = '완료 (프레임 꾸미기)';
        }
    }

    // 커스텀 프리뷰 Canvas 렌더링
    async updateCustomizePreview() {
        if (this.capturedCuts.length === 0) return;

        const canvas = await this.renderer.render(this.capturedCuts, {
            layout: this.layout,
            theme: this.theme,
            filter: this.currentFilter,
            passengerName: this.passengerName,
            destination: this.destination,
            stamps: this.stamps,
            customUploadedMask: this.customUploadedMask
        });

        this.finalCanvas = canvas;
        this.finalDataUrl = canvas.toDataURL('image/png', 0.95);

        // A4 1장에 4장 모아찍기 (2x2) 고해상도 캔버스도 동시 생성
        try {
            this.finalA4Canvas = await this.renderer.renderA4Composite(canvas);
            this.finalA4DataUrl = this.finalA4Canvas.toDataURL('image/png', 0.95);
        } catch (e) {
            console.warn('A4 합성 캔버스 생성 실패:', e);
        }

        // UI에 미리보기 표시
        const previewCanvas = document.getElementById('canvas-preview');
        previewCanvas.width = canvas.width;
        previewCanvas.height = canvas.height;
        const pCtx = previewCanvas.getContext('2d');
        pCtx.drawImage(canvas, 0, 0);
    }

    // 인쇄 화면 준비
    async setupPrintScreen() {
        this.updatePrintPreview();

        // 자동으로 로컬 서버에 영구 보관 (사진 보관 폴더)
        await this.autoSaveToBackend();
    }

    // 인쇄 화면 미리보기 및 UI 라벨 업데이트
    updatePrintPreview() {
        const thumb = document.getElementById('print-final-thumb');
        const statusText = document.getElementById('target-printer-status');
        const printLabel = document.getElementById('btn-print-label');
        const guideText = document.getElementById('print-guide-text');
        const saveDiskLabel = document.getElementById('btn-save-disk-label');

        if (this.printPaper === 'a4') {
            if (thumb && this.finalA4DataUrl) thumb.src = this.finalA4DataUrl;
            if (statusText) statusText.textContent = 'A4 1장에 4장 모아찍기 준비 완료';
            if (printLabel) printLabel.textContent = 'A4 4장 모아찍기 인쇄';
            if (guideText) guideText.textContent = 'A4 1장에 4장이 인쇄되어 친구들과 1장씩 나누기 좋습니다 ✂️';
            if (saveDiskLabel) saveDiskLabel.textContent = '💾 A4 파일 저장 (4장 모음)';
        } else {
            if (thumb && this.finalDataUrl) thumb.src = this.finalDataUrl;
            if (statusText) statusText.textContent = '4x6 포토 인화지 출력 준비 완료';
            if (printLabel) printLabel.textContent = '4x6 포토용지 인쇄';
            if (guideText) guideText.textContent = '4x6 포토 인화지에 꽉 차게 1장 인쇄됩니다';
            if (saveDiskLabel) saveDiskLabel.textContent = '💾 사진 파일 저장 (1장)';
        }
    }

    // 서버로 사진 자동 전송 및 저장
    async autoSaveToBackend() {
        try {
            const res = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mainImage: this.finalDataUrl,
                    a4Image: this.finalA4DataUrl,
                    cuts: this.capturedCuts
                })
            });
            const data = await res.json();
            if (data.success) {
                this.savedSessionFiles = data.files;
                console.log('공항네컷 로컬 저장 완료:', data.timestamp);
            }
        } catch (e) {
            console.warn('로컬 저장 요청 실패 (오프라인 모드 유지):', e);
        }
    }

    // 독립 iframe을 활용한 100% 무결점 인쇄 엔진 (A4 4분할 및 4x6 전면 지원)
    printViaIframe(dataUrl, paperSize = 'a4') {
        return new Promise((resolve) => {
            let iframe = document.getElementById('airport-print-frame');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'airport-print-frame';
                iframe.style.position = 'fixed';
                iframe.style.top = '-10000px';
                iframe.style.left = '-10000px';
                iframe.style.border = 'none';
                iframe.style.zIndex = '-1';
                document.body.appendChild(iframe);
            }

            const isA4 = paperSize === 'a4';
            iframe.style.width = isA4 ? '210mm' : '4in';
            iframe.style.height = isA4 ? '297mm' : '6in';

            const pageCss = isA4
                ? `@page { size: A4 portrait; margin: 0; }
                   * { margin: 0; padding: 0; box-sizing: border-box; }
                   html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; background: #ffffff; overflow: hidden; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                   img { width: 210mm; height: 297mm; display: block; object-fit: contain; }`
                : `@page { size: 4in 6in; margin: 0; }
                   * { margin: 0; padding: 0; box-sizing: border-box; }
                   html, body { width: 4in; height: 6in; margin: 0; padding: 0; background: #ffffff; overflow: hidden; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                   img { width: 4in; height: 6in; display: block; object-fit: fill; }`;

            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>인천공항고 공항네컷</title>
                    <style>
                        ${pageCss}
                    </style>
                </head>
                <body>
                    <img id="print-target-img" src="${dataUrl}">
                </body>
                </html>
            `);
            doc.close();

            const img = doc.getElementById('print-target-img');
            const trigger = () => {
                setTimeout(() => {
                    try {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    } catch(e) {
                        window.print();
                    }
                    resolve();
                }, 250);
            };

            if (img.complete && img.naturalWidth > 0) {
                trigger();
            } else {
                img.onload = trigger;
                img.onerror = () => {
                    window.print();
                    resolve();
                };
            }
        });
    }

    // EPSON L8180 출력 실행
    async executePrint() {
        this.audio.playPrintStart();

        const isA4 = this.printPaper === 'a4';
        const printDataUrl = (isA4 && this.finalA4DataUrl) ? this.finalA4DataUrl : this.finalDataUrl;

        // 1. 프로그레스 모달 표시
        const modal = document.getElementById('print-modal');
        const progressBar = document.getElementById('modal-progress');
        if (modal) modal.style.display = 'flex';
        if (progressBar) progressBar.style.width = '30%';

        const thumb = document.getElementById('print-final-thumb');
        if (thumb) thumb.src = printDataUrl;

        if (progressBar) progressBar.style.width = '60%';

        // 백엔드 직접 인쇄 호출 (저장된 파일이 있는 경우)
        if (this.savedSessionFiles) {
            const targetFilePath = (isA4 && this.savedSessionFiles.a4Local)
                ? this.savedSessionFiles.a4Local
                : this.savedSessionFiles.mainLocal;

            if (targetFilePath) {
                fetch('/api/print', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filePath: targetFilePath,
                        printerName: this.selectedPrinter,
                        paperSize: this.printPaper
                    })
                }).catch(() => {});
            }
        }

        // 2. 독립 iframe을 통해 사진이 100% 확실하게 뜨는 인쇄 다이얼로그 호출!
        await this.printViaIframe(printDataUrl, this.printPaper);

        if (progressBar) progressBar.style.width = '100%';
        setTimeout(() => {
            if (modal) modal.style.display = 'none';
            const label = document.getElementById('btn-print-label');
            if (label) label.textContent = isA4 ? 'A4 1장 더 인쇄하기' : '1장 더 인쇄하기';
        }, 1000);

        // 키오스크 자동 복귀 타이머 설정 (30초)
        if (document.getElementById('check-auto-reset').checked) {
            clearTimeout(this.autoResetTimer);
            this.autoResetTimer = setTimeout(() => {
                this.switchScreen('screen-welcome');
            }, 30000);
        }
    }

    downloadImageDirectly() {
        const isA4 = this.printPaper === 'a4';
        const targetUrl = (isA4 && this.finalA4DataUrl) ? this.finalA4DataUrl : this.finalDataUrl;
        if (!targetUrl) return;

        const link = document.createElement('a');
        link.download = isA4 ? `공항네컷_A4_4분할_${Date.now()}.png` : `공항네컷_${Date.now()}.png`;
        link.href = targetUrl;
        link.click();
    }

    renderTouchKeyboard() {
        const container = document.getElementById('touch-keyboard-keys');
        const input = document.getElementById('touch-kb-input');
        if (!container) return;

        const keys = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
            'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '-',
            'Z', 'X', 'C', 'V', 'B', 'N', 'M', '✈', '❤️', '★',
            { label: '공항고', val: '공항고', class: 'key-wide' },
            { label: '공 백 (SPACE)', val: ' ', class: 'key-space' },
            { label: '← 지우기', action: 'del', class: 'key-del' },
            { label: '추억', val: '추억', class: 'key-wide' }
        ];

        container.innerHTML = '';
        keys.forEach(k => {
            const btn = document.createElement('div');
            btn.className = 'touch-key';
            if (typeof k === 'object') {
                btn.textContent = k.label;
                if (k.class) btn.className += ' ' + k.class;
                btn.addEventListener('click', () => {
                    if (k.action === 'del') {
                        input.value = input.value.slice(0, -1);
                    } else if (k.val) {
                        if (input.value.length < 24) input.value += k.val;
                    }
                });
            } else {
                btn.textContent = k;
                btn.addEventListener('click', () => {
                    if (input.value.length < 24) input.value += k;
                });
            }
            container.appendChild(btn);
        });
    }

    resetSession() {
        this.capturedCuts = [];
        this.stamps = [];
        this.isCountingDown = false;
        clearInterval(this.countdownTimer);
        clearTimeout(this.autoResetTimer);
        this.updateSlotsDisplay();
    }
}

// 앱 실행
window.addEventListener('DOMContentLoaded', () => {
    window.boothApp = new AirportBoothApp();
    window.boothApp.init();
});
