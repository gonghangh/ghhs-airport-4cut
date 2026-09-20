// 공항네컷 (Airport 4-Cuts) Camera Management Engine
class AirportCamera {
    constructor(videoElement) {
        this.video = videoElement;
        this.stream = null;
        this.currentDeviceId = null;
        this.isMirrored = true;
        this.devices = [];
    }

    async getDevices() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.devices = devices.filter(d => d.kind === 'videoinput');
            return this.devices;
        } catch (err) {
            console.error('카메라 목록 조회 실패:', err);
            return [];
        }
    }

    async startCamera(preferredDeviceId = null) {
        if (this.stream) {
            this.stopCamera();
        }

        const devices = await this.getDevices();
        
        // AHA-C7000 카메라 우선 선택
        let targetId = preferredDeviceId;
        if (!targetId && devices.length > 0) {
            const ahaCam = devices.find(d => d.label.toLowerCase().includes('aha') || d.label.toLowerCase().includes('c7000') || d.label.toLowerCase().includes('usb'));
            targetId = ahaCam ? ahaCam.deviceId : devices[0].deviceId;
        }

        const constraints = {
            audio: false,
            video: {
                width: { ideal: 1920, min: 1280 },
                height: { ideal: 1080, min: 720 },
                frameRate: { ideal: 30 }
            }
        };

        if (targetId) {
            constraints.video.deviceId = { exact: targetId };
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            await this.video.play();
            this.currentDeviceId = targetId;
            this.updateMirror();
            return { success: true, deviceId: targetId };
        } catch (err) {
            console.warn('이상적 해상도로 카메라 시작 실패, 기본 설정으로 재시도:', err);
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                this.video.srcObject = this.stream;
                await this.video.play();
                this.updateMirror();
                return { success: true, deviceId: null };
            } catch (fallbackErr) {
                console.error('카메라 시작 최종 실패:', fallbackErr);
                return { success: false, error: fallbackErr.message };
            }
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.video.srcObject = null;
        }
    }

    toggleMirror() {
        this.isMirrored = !this.isMirrored;
        this.updateMirror();
        return this.isMirrored;
    }

    updateMirror() {
        if (this.isMirrored) {
            this.video.style.transform = 'scaleX(-1)';
        } else {
            this.video.style.transform = 'scaleX(1)';
        }
    }

    // 현재 카메라 화면을 고화질로 캡처
    capturePhoto() {
        if (!this.video || !this.stream) {
            throw new Error('카메라 스트림이 준비되지 않았습니다.');
        }

        const videoW = this.video.videoWidth || 1280;
        const videoH = this.video.videoHeight || 720;

        // 인생네컷 비율 (4:3 또는 3:4 세로 비율)
        // 비디오에서 중앙 3:4 세로 영역 또는 4:3 가로 영역 크롭
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 900; // 4:3 컷 비율
        const ctx = canvas.getContext('2d');

        // 좌우 반전 처리 (거울 모드로 보고 있으므로 캡처 시에도 사용자에게 보이는 그대로 유지)
        if (this.isMirrored) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

        // 비디오 중심 비율에 맞게 크롭 렌더링
        const targetAspect = canvas.width / canvas.height; // 4/3
        const srcAspect = videoW / videoH;
        let sx, sy, sw, sh;

        if (srcAspect > targetAspect) {
            sh = videoH;
            sw = videoH * targetAspect;
            sx = (videoW - sw) / 2;
            sy = 0;
        } else {
            sw = videoW;
            sh = videoW / targetAspect;
            sx = 0;
            sy = (videoH - sh) / 2;
        }

        ctx.drawImage(this.video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.95);
    }
}

window.AirportCamera = AirportCamera;
