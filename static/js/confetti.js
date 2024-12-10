class ConfettiEffect {
    constructor() {
        this.canvas = document.getElementById('confetti-canvas');
        if (!this.canvas) {
            console.log('Creating new canvas');
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
        }
        
        // Set canvas dimensions explicitly
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.active = false;

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: -10,
            size: Math.random() * 10 + 5,
            color: ['#ffd700', '#c0c0c0', '#ffffff'][Math.floor(Math.random() * 3)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 6.28,
            spin: Math.random() * 0.2 - 0.1
        };
    }

    start() {
        if (!this.active) {
            console.log('Starting confetti');
            this.active = true;
            this.particles = Array(50).fill().map(() => this.createParticle());
            this.animate();
        }
    }

    stop() {
        console.log('Stopping confetti');
        this.active = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = [];
    }

    animate() {
        if (!this.active) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, index) => {
            p.y += p.speed;
            p.x += Math.sin(p.angle) * 2;
            p.angle += p.spin;

            this.ctx.beginPath();
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x, p.y, p.size, p.size);

            if (p.y > this.canvas.height) {
                this.particles[index] = this.createParticle();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}
