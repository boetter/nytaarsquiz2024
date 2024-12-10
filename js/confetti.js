class ConfettiParticle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = 0;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 + 3;
        this.size = Math.random() * 6 + 4;
        this.angle = Math.random() * 360;
        this.rotation = Math.random() * 3 - 1.5;
        this.opacity = 1;
        const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.angle += this.rotation;
        this.opacity -= 0.005;

        if (this.y > this.canvas.height || this.opacity <= 0) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

class ConfettiEffect {
    constructor() {
        if (document.getElementById('confetti-canvas')) {
            document.getElementById('confetti-canvas').remove();
        }

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.active = false;
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        if (!this.active) {
            this.active = true;
            this.particles = Array(100).fill().map(() => new ConfettiParticle(this.canvas));
            this.animate();
        }
    }

    stop() {
        this.active = false;
        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }

    animate() {
        if (!this.active) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}
