// 공항네컷 (Airport 4-Cuts) 300 DPI Canvas Frame Rendering Engine
class AirportFrameRenderer {
    constructor() {
        this.width = 1200;  // 4인치 @ 300 DPI
        this.height = 1800; // 6인치 @ 300 DPI
        
        // 사용자가 제작한 커스텀 프레임 정의
        this.customFrames = {
            'custom_airport': {
                name: '공항네컷 (비행기 & 인천대교)',
                maskSrc: 'frames/mask_airport.png',
                thumbSrc: 'frames/frame_airport.png',
                origW: 724,
                origH: 1024,
                slots: [
                    { x: 47, y: 137, w: 293, h: 396 },  // 1 (상단 좌)
                    { x: 384, y: 136, w: 293, h: 396 }, // 2 (상단 우)
                    { x: 47, y: 578, w: 293, h: 397 },  // 3 (하단 좌)
                    { x: 383, y: 578, w: 292, h: 397 }  // 4 (하단 우)
                ]
            },
            'custom_ghhs_blue': {
                name: 'GHHS FILM (스카이 블루)',
                maskSrc: 'frames/mask_ghhs_blue.png',
                thumbSrc: 'frames/frame_ghhs_blue.png',
                origW: 724,
                origH: 1024,
                slots: [
                    { x: 41, y: 131, w: 305, h: 408 },  // 1 (상단 좌)
                    { x: 378, y: 131, w: 305, h: 408 }, // 2 (상단 우)
                    { x: 41, y: 572, w: 305, h: 408 },  // 3 (하단 좌)
                    { x: 378, y: 572, w: 305, h: 408 }  // 4 (하단 우)
                ]
            },
            'custom_ghhs_wave': {
                name: 'GHHS mansion (윤슬 오션)',
                maskSrc: 'frames/mask_ghhs_wave.png',
                thumbSrc: 'frames/frame_ghhs_wave.png',
                origW: 724,
                origH: 1024,
                slots: [
                    { x: 54, y: 108, w: 305, h: 408 },  // 1 (상단 좌)
                    { x: 371, y: 109, w: 305, h: 408 }, // 2 (상단 우)
                    { x: 54, y: 533, w: 305, h: 408 },  // 3 (하단 좌)
                    { x: 371, y: 533, w: 305, h: 408 }  // 4 (하단 우)
                ]
            },
            'custom_ghism_white': {
                name: 'GHism (화이트 필름)',
                maskSrc: 'frames/mask_ghism_white.png',
                thumbSrc: 'frames/frame_ghism_white.png',
                origW: 724,
                origH: 1024,
                slots: [
                    { x: 47, y: 64, w: 298, h: 401 },   // 1 (상단 좌)
                    { x: 379, y: 141, w: 298, h: 401 }, // 2 (상단 우 - 스태거드)
                    { x: 47, y: 496, w: 298, h: 400 },  // 3 (하단 좌)
                    { x: 379, y: 579, w: 298, h: 400 }  // 4 (하단 우 - 스태거드)
                ]
            },
            'custom_ghism_black': {
                name: 'GHism (블랙 시크)',
                maskSrc: 'frames/mask_ghism_black.png',
                thumbSrc: 'frames/frame_ghism_black.png',
                origW: 724,
                origH: 1024,
                slots: [
                    { x: 49, y: 69, w: 293, h: 396 },   // 1 (상단 좌)
                    { x: 382, y: 146, w: 293, h: 396 }, // 2 (상단 우 - 스태거드)
                    { x: 49, y: 502, w: 293, h: 396 },  // 3 (하단 좌)
                    { x: 382, y: 583, w: 293, h: 396 }  // 4 (하단 우 - 스태거드)
                ]
            },
            'custom_ghism_character': {
                name: 'GHism (귀여운 캐릭터)',
                maskSrc: 'frames/mask_ghism_character.png',
                thumbSrc: 'frames/frame_ghism_character.png',
                origW: 724,
                origH: 1024,
                slots: [
                    { x: 44, y: 61, w: 304, h: 407 },   // 1 (상단 좌)
                    { x: 377, y: 138, w: 303, h: 407 }, // 2 (상단 우 - 스태거드)
                    { x: 44, y: 492, w: 304, h: 407 },  // 3 (하단 좌 - 캐릭터 오버레이)
                    { x: 377, y: 575, w: 303, h: 407 }  // 4 (하단 우 - 스태거드)
                ]
            },
            'custom_chaektok': {
                name: '책톡네컷 (책톡ism)',
                maskSrc: 'frames/mask_chaektok.png',
                thumbSrc: 'frames/frame_chaektok.png',
                origW: 724,
                origH: 1024,
                targetCuts: 4,
                slots: [
                    { x: 44, y: 61, w: 304, h: 407 },   // 1 (상단 좌)
                    { x: 377, y: 138, w: 303, h: 407 }, // 2 (상단 우 - 스태거드)
                    { x: 44, y: 492, w: 304, h: 407 },  // 3 (하단 좌 - 책톡 로고 오버레이)
                    { x: 377, y: 564, w: 303, h: 407 }  // 4 (하단 우 - 스태거드)
                ]
            },
            'custom_doyo': {
                name: '도요필름 (AI융합교육실)',
                maskSrc: 'frames/mask_doyo.png',
                thumbSrc: 'frames/frame_doyo.png',
                origW: 891,
                origH: 1260,
                targetCuts: 2,
                slots: [
                    { x: 26, y: 150, w: 839, h: 456 }, // 1 (상단 와이드 16:9)
                    { x: 26, y: 650, w: 839, h: 456 }  // 2 (하단 와이드 - 도요새 캐릭터 오버레이)
                ]
            },
            'custom_grc': {
                name: 'GRCism (인천공항고 러닝)',
                maskSrc: 'frames/mask_grc.png',
                thumbSrc: 'frames/frame_grc.png',
                origW: 724,
                origH: 1024,
                targetCuts: 4,
                slots: [
                    { x: 44, y: 61, w: 304, h: 407 },   // 1 (상단 좌)
                    { x: 377, y: 138, w: 303, h: 407 }, // 2 (상단 우 - 스태거드)
                    { x: 44, y: 492, w: 304, h: 407 },  // 3 (하단 좌 - GRC 3D 러닝 로고 오버레이)
                    { x: 377, y: 564, w: 303, h: 407 }  // 4 (하단 우 - 스태거드)
                ]
            }
        };

        // 이미지 캐시
        this.maskCache = {};
        this.loadImage('assets/ghhs_emblem.png').catch(()=>{});
    }

    // 4컷 사진과 옵션을 받아 최종 인쇄용 Canvas 생성
    async render(photos, options = {}) {
        const {
            layout = 'custom',         // 'custom', '2x6_twin', '2x2_grid'
            theme = 'custom_airport',  // 'custom_airport', 'custom_ghhs_blue', etc.
            filter = 'normal',
            passengerName = 'HAPPY TRAVELER',
            destination = 'SEOUL (ICN) ✈ PARIS (CDG)',
            flightNo = 'AG-0404',
            gate = '07',
            seat = '1A',
            showDate = true,
            showQr = true,
            stamps = [],
            customUploadedMask = null
        } = options;

        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');

        // 필터가 적용된 사진 이미지 로드
        const loadedImages = await this.loadAndFilterPhotos(photos, filter);

        // 사용자가 제작한 프레임인 경우
        if (theme.startsWith('custom_') || customUploadedMask) {
            await this.renderCustomUserFrame(ctx, loadedImages, theme, customUploadedMask);
        } else if (layout === '2x6_twin') {
            await this.renderTwinStrip(ctx, loadedImages, {
                theme, passengerName, destination, flightNo, gate, seat, showDate, showQr, stamps
            });
        } else {
            await this.renderGrid(ctx, loadedImages, {
                theme, passengerName, destination, flightNo, gate, seat, showDate, showQr, stamps
            });
        }

        // 스탬프 장식 그리기
        if (stamps && stamps.length > 0) {
            this.drawStamps(ctx, 0, 0, this.width, this.height, { stamps });
        }

        return canvas;
    }

    // 사용자가 만든 커스텀 프레임 렌더링
    async renderCustomUserFrame(ctx, images, themeKey, uploadedMaskUrl) {
        let frameConfig = this.customFrames[themeKey];
        let maskImgSrc = frameConfig ? frameConfig.maskSrc : uploadedMaskUrl;

        // 4x6 인화지 (1200 x 1800) 규격에 맞춤
        const targetW = this.width;   // 1200
        const targetH = this.height;  // 1800

        // 흰 배경으로 초기화
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);

        // 원본 724x1024 프레임을 4x6 비율에 맞게 스케일링 및 중앙 배치
        const origW = frameConfig ? frameConfig.origW : 724;
        const origH = frameConfig ? frameConfig.origH : 1024;

        // 1200x1800 캔버스 내에 알맞게 맞추기 (fit to height or width)
        const scale = Math.min(targetW / origW, targetH / origH);
        const drawW = origW * scale;
        const drawH = origH * scale;
        const offsetX = (targetW - drawW) / 2;
        const offsetY = (targetH - drawH) / 2;

        const slots = frameConfig ? frameConfig.slots : [
            { x: 45, y: 135, w: 297, h: 400 },
            { x: 380, y: 135, w: 297, h: 400 },
            { x: 45, y: 575, w: 297, h: 400 },
            { x: 380, y: 575, w: 297, h: 400 }
        ];

        // 1. 슬롯 위치에 사용자 사진 먼저 그리기
        for (let i = 0; i < slots.length; i++) {
            if (images[i] && slots[i]) {
                const s = slots[i];
                const sx = offsetX + s.x * scale;
                const sy = offsetY + s.y * scale;
                const sw = s.w * scale;
                const sh = s.h * scale;

                ctx.save();
                // 슬롯 영역으로 클리핑 (살짝 2px 안쪽으로 클립하여 프레임 외곽으로 튀어나가지 않도록 함)
                ctx.beginPath();
                ctx.rect(sx - 1, sy - 1, sw + 2, sh + 2);
                ctx.clip();

                // 사진을 슬롯 비율에 맞게 채워서(Center Crop) 그리기
                const img = images[i];
                const imgAspect = img.width / img.height;
                const slotAspect = sw / sh;
                let dx, dy, dw, dh;

                if (imgAspect > slotAspect) {
                    dh = img.height;
                    dw = img.height * slotAspect;
                    dx = (img.width - dw) / 2;
                    dy = 0;
                } else {
                    dw = img.width;
                    dh = img.width / slotAspect;
                    dx = 0;
                    dy = (img.height - dh) / 2;
                }

                ctx.drawImage(img, dx, dy, dw, dh, sx, sy, sw, sh);
                ctx.restore();
            }
        }

        // 2. 투명 마스크 프레임을 사진 위에 덧씌우기 (Overlay)
        // -> 이렇게 하면 프레임의 인천대교 다리 기둥이나 비행기 날개, 글자 등이 사진 위로 깔끔하게 얹어집니다!
        if (maskImgSrc) {
            const maskImg = await this.loadImage(maskImgSrc);
            ctx.drawImage(maskImg, 0, 0, origW, origH, offsetX, offsetY, drawW, drawH);
        }
    }

    async loadImage(src) {
        if (this.maskCache[src]) return this.maskCache[src];
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                this.maskCache[src] = img;
                resolve(img);
            };
            img.onerror = (e) => reject(e);
            img.src = src;
        });
    }

    async loadAndFilterPhotos(photos, filter) {
        const promises = photos.map(photoDataUrl => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const filteredCanvas = document.createElement('canvas');
                    filteredCanvas.width = img.width;
                    filteredCanvas.height = img.height;
                    const fCtx = filteredCanvas.getContext('2d');
                    fCtx.filter = this.getFilterString(filter);
                    fCtx.drawImage(img, 0, 0);
                    resolve(filteredCanvas);
                };
                img.src = photoDataUrl;
            });
        });
        return Promise.all(promises);
    }

    getFilterString(filter) {
        switch (filter) {
            case 'bright':
                return 'brightness(1.08) contrast(1.05) saturate(1.08)';
            case 'mono':
                return 'grayscale(100%) contrast(1.18) brightness(1.02)';
            case 'vintage':
                return 'sepia(30%) contrast(1.05) brightness(1.02) saturate(0.9)';
            case 'sunset':
                return 'sepia(20%) saturate(1.35) hue-rotate(-12deg) brightness(1.03)';
            case 'cool':
                return 'saturate(1.2) hue-rotate(8deg) brightness(1.04)';
            default:
                return 'none';
        }
    }

    // 2x6 Twin Strips
    async renderTwinStrip(ctx, images, opts) {
        const stripW = 600;
        const stripH = 1800;

        ctx.save();
        await this.renderSingleStrip(ctx, 0, 0, stripW, stripH, images, opts);
        ctx.restore();

        ctx.save();
        ctx.translate(600, 0);
        await this.renderSingleStrip(ctx, 0, 0, stripW, stripH, images, opts);
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = opts.theme === 'night_runway' || opts.theme === 'classic_mono' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 12]);
        ctx.beginPath();
        ctx.moveTo(600, 0);
        ctx.lineTo(600, 1800);
        ctx.stroke();

        ctx.font = '16px sans-serif';
        ctx.fillStyle = opts.theme === 'night_runway' ? '#ffffff' : '#666666';
        ctx.textAlign = 'center';
        ctx.fillText('✂', 600, 40);
        ctx.fillText('✂', 600, 1760);
        ctx.restore();
    }

    async renderSingleStrip(ctx, x, y, w, h, images, opts) {
        this.drawThemeBackground(ctx, x, y, w, h, opts.theme);
        this.drawStripHeader(ctx, x, y, w, opts);

        const marginX = 40;
        const photoW = w - (marginX * 2);
        const photoH = 295;
        const startY = 160;
        const gapY = 18;

        for (let i = 0; i < 4; i++) {
            const py = startY + i * (photoH + gapY);
            if (images[i]) {
                ctx.save();
                if (opts.theme === 'airplane_window') {
                    this.roundRect(ctx, x + marginX, py, photoW, photoH, 24);
                } else {
                    this.roundRect(ctx, x + marginX, py, photoW, photoH, 6);
                }
                ctx.clip();
                ctx.drawImage(images[i], 0, 0, images[i].width, images[i].height, x + marginX, py, photoW, photoH);
                ctx.restore();

                ctx.save();
                if (opts.theme === 'boarding_pass') {
                    ctx.strokeStyle = '#e2e8f0';
                    ctx.lineWidth = 3;
                    this.roundRect(ctx, x + marginX, py, photoW, photoH, 6);
                    ctx.stroke();
                } else if (opts.theme === 'airplane_window') {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 6;
                    this.roundRect(ctx, x + marginX, py, photoW, photoH, 24);
                    ctx.stroke();
                } else if (opts.theme === 'night_runway') {
                    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
                    ctx.lineWidth = 2;
                    this.roundRect(ctx, x + marginX, py, photoW, photoH, 6);
                    ctx.stroke();
                }
                ctx.restore();
            }
        }

        const footerY = startY + 4 * (photoH + gapY) + 10;
        await this.drawStripFooter(ctx, x, footerY, w, h - footerY, opts);
    }

    drawThemeBackground(ctx, x, y, w, h, theme) {
        ctx.save();
        if (theme === 'boarding_pass') {
            ctx.fillStyle = '#fdfdfd';
            ctx.fillRect(x, y, w, h);
            const grad = ctx.createLinearGradient(x, y, x + w, y);
            grad.addColorStop(0, '#0284c7');
            grad.addColorStop(1, '#0369a1');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, 14);
        } else if (theme === 'night_runway') {
            const bgGrad = ctx.createLinearGradient(x, y, x, y + h);
            bgGrad.addColorStop(0, '#0a0f1d');
            bgGrad.addColorStop(1, '#030712');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
            ctx.lineWidth = 2;
            ctx.setLineDash([15, 15]);
            ctx.beginPath();
            ctx.moveTo(x + 20, y);
            ctx.lineTo(x + 20, y + h);
            ctx.moveTo(x + w - 20, y);
            ctx.lineTo(x + w - 20, y + h);
            ctx.stroke();
            ctx.setLineDash([]);
        } else if (theme === 'airplane_window') {
            const grad = ctx.createLinearGradient(x, y, x, y + h);
            grad.addColorStop(0, '#bae6fd');
            grad.addColorStop(0.4, '#e0f2fe');
            grad.addColorStop(0.8, '#fbcfe8');
            grad.addColorStop(1, '#fde68a');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
        } else if (theme === 'passport_stamp') {
            ctx.fillStyle = '#f8f4eb';
            ctx.fillRect(x, y, w, h);
        } else {
            ctx.fillStyle = '#121214';
            ctx.fillRect(x, y, w, h);
        }
        ctx.restore();
    }

    drawStripHeader(ctx, x, y, w, opts) {
        ctx.save();
        const isDark = opts.theme === 'night_runway' || opts.theme === 'classic_mono';
        const primaryColor = isDark ? '#ffffff' : '#0f172a';
        const subColor = isDark ? '#94a3b8' : '#64748b';
        const accentColor = isDark ? '#38bdf8' : '#0284c7';

        ctx.fillStyle = primaryColor;
        ctx.font = '900 32px "Noto Sans KR", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('공항네컷', x + 40, y + 65);

        ctx.fillStyle = accentColor;
        ctx.font = '700 16px "Montserrat", sans-serif';
        ctx.fillText('AIRPORT 4-CUTS ✈', x + 40, y + 92);

        ctx.textAlign = 'right';
        ctx.fillStyle = primaryColor;
        ctx.font = '800 20px "Montserrat", monospace';
        ctx.fillText(opts.flightNo, x + w - 40, y + 65);

        ctx.fillStyle = subColor;
        ctx.font = '600 13px "Montserrat", sans-serif';
        ctx.fillText(`GATE ${opts.gate} · SEAT ${opts.seat}`, x + w - 40, y + 90);

        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + 40, y + 125);
        ctx.lineTo(x + w - 40, y + 125);
        ctx.stroke();

        ctx.fillStyle = subColor;
        ctx.font = '600 13px "Montserrat", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(opts.destination, x + w / 2, y + 145);
        ctx.restore();
    }

    async drawStripFooter(ctx, x, y, w, h, opts) {
        ctx.save();
        const isDark = opts.theme === 'night_runway' || opts.theme === 'classic_mono';
        const primaryColor = isDark ? '#ffffff' : '#0f172a';
        const subColor = isDark ? '#94a3b8' : '#64748b';

        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x + 40, y + 15);
        ctx.lineTo(x + w - 40, y + 15);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = subColor;
        ctx.font = '700 12px "Montserrat", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('PASSENGER NAME', x + 40, y + 42);

        ctx.fillStyle = primaryColor;
        ctx.font = '900 18px "Noto Sans KR", sans-serif';
        ctx.fillText(opts.passengerName, x + 40, y + 66);

        const now = new Date();
        const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        ctx.fillStyle = subColor;
        ctx.font = '700 12px "Montserrat", sans-serif';
        ctx.fillText('BOARDING DATE / TIME', x + 40, y + 95);

        ctx.fillStyle = primaryColor;
        ctx.font = '700 15px "Montserrat", sans-serif';
        ctx.fillText(`${dateStr} ${timeStr} · ICN`, x + 40, y + 115);

        const qrCanvas = document.createElement('canvas');
        if (window.renderAirportQR && opts.showQr) {
            window.renderAirportQR(qrCanvas, `https://airport4cut.local/download?t=${now.getTime()}`, 110);
            ctx.drawImage(qrCanvas, x + w - 40 - 110, y + 25);
            ctx.fillStyle = subColor;
            ctx.font = '600 10px "Montserrat", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('SCAN FOR PHOTO', x + w - 40 - 55, y + 150);
        }

        const barcodeY = y + 160;
        const barcodeW = w - 80;
        const barcodeH = 50;
        this.drawBarcode(ctx, x + 40, barcodeY, barcodeW, barcodeH, isDark ? '#ffffff' : '#0f172a');

        ctx.fillStyle = subColor;
        ctx.font = '500 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`AG404-${now.getTime().toString().slice(-8)} 01A`, x + w / 2, barcodeY + barcodeH + 20);
        ctx.restore();
    }

    drawBarcode(ctx, x, y, w, h, color) {
        ctx.save();
        ctx.fillStyle = color;
        const pattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 1, 4, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1, 1, 2, 4, 1, 2];
        const totalUnits = pattern.reduce((a, b) => a + b, 0);
        const unitWidth = w / totalUnits;

        let curX = x;
        pattern.forEach((span, idx) => {
            if (idx % 2 === 0) {
                ctx.fillRect(curX, y, span * unitWidth, h);
            }
            curX += span * unitWidth;
        });
        ctx.restore();
    }

    drawStamps(ctx, x, y, w, h, opts) {
        if (!opts.stamps || opts.stamps.length === 0) return;
        ctx.save();
        opts.stamps.forEach(s => {
            ctx.save();
            ctx.translate(x + s.x, y + s.y);
            ctx.rotate((s.rotate || 0) * Math.PI / 180);

            if (s.icon === '🏫' && this.maskCache['assets/ghhs_emblem.png']) {
                // 인천공항고 공식 교표 스탬프 렌더링
                const size = (s.size || 55) * 1.5;
                ctx.drawImage(this.maskCache['assets/ghhs_emblem.png'], -size/2, -size/2, size, size);
            } else {
                ctx.font = `${s.size || 40}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(s.icon, 0, 0);
            }
            ctx.restore();
        });
        ctx.restore();
    }

    // 2x2 Grid (4x6 단일 시트에 2x2 배치)
    async renderGrid(ctx, images, opts) {
        const w = this.width;
        const h = this.height;

        this.drawThemeBackground(ctx, 0, 0, w, h, opts.theme);
        this.drawStripHeader(ctx, 0, 0, w, opts);

        const marginX = 60;
        const gap = 24;
        const photoW = (w - (marginX * 2) - gap) / 2;
        const photoH = 500;
        const startY = 180;

        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 2; c++) {
                const idx = r * 2 + c;
                const px = marginX + c * (photoW + gap);
                const py = startY + r * (photoH + gap);

                if (images[idx]) {
                    ctx.save();
                    this.roundRect(ctx, px, py, photoW, photoH, 12);
                    ctx.clip();
                    ctx.drawImage(images[idx], 0, 0, images[idx].width, images[idx].height, px, py, photoW, photoH);
                    ctx.restore();

                    ctx.save();
                    ctx.strokeStyle = opts.theme === 'night_runway' ? 'rgba(6, 182, 212, 0.5)' : '#e2e8f0';
                    ctx.lineWidth = 4;
                    this.roundRect(ctx, px, py, photoW, photoH, 12);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        const footerY = startY + 2 * (photoH + gap) + 20;
        await this.drawStripFooter(ctx, 0, footerY, w, h - footerY, opts);
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    // A4 1장에 4장 모아찍기 (2x2) 고해상도 300 DPI 캔버스 생성
    async renderA4Composite(source) {
        let img = source;
        if (typeof source === 'string') {
            img = await this.loadImage(source);
        }

        const a4Canvas = document.createElement('canvas');
        a4Canvas.width = 2480;
        a4Canvas.height = 3508;
        const ctx = a4Canvas.getContext('2d');

        // 1. 깨끗한 흰색 A4 배경
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 2480, 3508);

        // 2. 4분할 좌표 계산 (1120 x 1680, 2:3 비율 유지)
        const photoW = 1120;
        const photoH = 1680;
        const padX = 60;
        const padY = 37;

        const positions = [
            { x: padX, y: padY },                       // 1. 좌상단 (Top-Left)
            { x: 1240 + padX, y: padY },                // 2. 우상단 (Top-Right)
            { x: padX, y: 1754 + padY },               // 3. 좌하단 (Bottom-Left)
            { x: 1240 + padX, y: 1754 + padY }         // 4. 우하단 (Bottom-Right)
        ];

        for (const pos of positions) {
            ctx.save();
            ctx.drawImage(img, 0, 0, img.width, img.height, pos.x, pos.y, photoW, photoH);
            
            // 사진 테두리 (아주 연한 외곽선으로 정밀 재단 지원)
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(pos.x, pos.y, photoW, photoH);

            // 코너 크롭 마크
            this.drawCropMarks(ctx, pos.x, pos.y, photoW, photoH);
            ctx.restore();
        }

        // 3. 중앙 십자 절취선 (Dotted Cut Lines)
        ctx.save();
        ctx.setLineDash([18, 14]);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.5;

        // 세로 중심선
        ctx.beginPath();
        ctx.moveTo(1240, 0);
        ctx.lineTo(1240, 3508);
        ctx.stroke();

        // 가로 중심선
        ctx.beginPath();
        ctx.moveTo(0, 1754);
        ctx.lineTo(2480, 1754);
        ctx.stroke();
        ctx.restore();

        // 4. 가위 아이콘 및 안내 문구
        ctx.save();
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 26px "Pretendard", "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 가장자리 가위 표시
        ctx.fillText('✂️ 절취선', 1240, 20);
        ctx.fillText('✂️ 절취선', 1240, 3488);
        ctx.fillText('✂️', 25, 1754);
        ctx.fillText('✂️', 2455, 1754);
        ctx.fillText('✂️', 1240, 1754);

        // 상/하단 공식 브랜딩 여백 텍스트
        ctx.font = '22px "Pretendard", "Noto Sans KR", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('✈️ 인천공항고등학교 공항네컷 (GHHS 4-CUTS) · A4 4분할 절취용', 620, 20);
        ctx.fillText('✈️ 인천공항고등학교 공항네컷 (GHHS 4-CUTS) · A4 4분할 절취용', 1860, 20);
        ctx.fillText('✂️ 점선을 따라 자르면 4장의 공항네컷이 완성됩니다', 620, 3488);
        ctx.fillText('✂️ 점선을 따라 자르면 4장의 공항네컷이 완성됩니다', 1860, 3488);
        ctx.restore();

        return a4Canvas;
    }

    drawCropMarks(ctx, x, y, w, h) {
        ctx.save();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        const len = 20;

        // Top-Left
        ctx.beginPath();
        ctx.moveTo(x - 6, y); ctx.lineTo(x - 6 - len, y);
        ctx.moveTo(x, y - 6); ctx.lineTo(x, y - 6 - len);
        ctx.stroke();

        // Top-Right
        ctx.beginPath();
        ctx.moveTo(x + w + 6, y); ctx.lineTo(x + w + 6 + len, y);
        ctx.moveTo(x + w, y - 6); ctx.lineTo(x + w, y - 6 - len);
        ctx.stroke();

        // Bottom-Left
        ctx.beginPath();
        ctx.moveTo(x - 6, y + h); ctx.lineTo(x - 6 - len, y + h);
        ctx.moveTo(x, y + h + 6); ctx.lineTo(x, y + h + 6 + len);
        ctx.stroke();

        // Bottom-Right
        ctx.beginPath();
        ctx.moveTo(x + w + 6, y + h); ctx.lineTo(x + w + 6 + len, y + h);
        ctx.moveTo(x + w, y + h + 6); ctx.lineTo(x + w, y + h + 6 + len);
        ctx.stroke();

        ctx.restore();
    }
}

window.AirportFrameRenderer = AirportFrameRenderer;
