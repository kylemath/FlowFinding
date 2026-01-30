// ==========================================
// PATHFINDING ACROSS SCALES - MAIN APPLICATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initCosmicVisualization();
    initEarthSystemsVisualizations();
    initSurfacePhenomena();
    initHumanAlgorithmic();
    initMolecularVisualizations();
    initQuantumVisualizations();
    initHHLVisualizations();
    initGTTIVisualizations();
});

// ==========================================
// NAVIGATION
// ==========================================

function initNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const progressBar = document.querySelector('.progress-bar');
    const ctaButtons = document.querySelectorAll('[data-goto]');
    const scalePoints = document.querySelectorAll('.scale-point');
    
    const tabOrder = ['intro', 'cosmic', 'earth', 'surface', 'human', 'molecular', 'quantum', 'hhl', 'homogenization', 'circuit-mapping', 'unified'];
    
    function switchTab(tabId) {
        // Update nav tabs
        navTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Update content
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
        
        // Update progress bar
        const index = tabOrder.indexOf(tabId);
        const progress = ((index + 1) / tabOrder.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger visualization initialization for the new tab
        triggerTabVisualization(tabId);
    }
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.goto));
    });
    
    scalePoints.forEach(point => {
        point.addEventListener('click', () => switchTab(point.dataset.scale));
    });
}

function triggerTabVisualization(tabId) {
    // Re-initialize visualizations when switching tabs
    switch(tabId) {
        case 'cosmic':
            if (window.cosmicAnimation) cancelAnimationFrame(window.cosmicAnimation);
            initCosmicVisualization();
            break;
        case 'surface':
            // Re-init active phenomenon
            const activePhenomTab = document.querySelector('.phenom-tab.active');
            if (activePhenomTab) {
                initPhenomenon(activePhenomTab.dataset.phenom);
            }
            break;
        case 'homogenization':
        case 'circuit-mapping':
        case 'unified':
            // Re-init GTTI visualizations
            initGTTIVisualizations();
            break;
    }
}

// ==========================================
// COSMIC SCALE VISUALIZATION
// ==========================================

function initCosmicVisualization() {
    const canvas = document.getElementById('cosmic-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Celestial bodies
    let bodies = [
        { x: centerX, y: centerY, vx: 0, vy: 0, mass: 1000, radius: 20, color: '#fcd34d', name: 'Star' },
        { x: centerX + 100, y: centerY, vx: 0, vy: 2.5, mass: 10, radius: 8, color: '#3b82f6', name: 'Planet 1' },
        { x: centerX + 180, y: centerY, vx: 0, vy: 1.9, mass: 15, radius: 10, color: '#ef4444', name: 'Planet 2' },
        { x: centerX + 260, y: centerY, vx: 0, vy: 1.6, mass: 8, radius: 6, color: '#10b981', name: 'Planet 3' },
    ];
    
    let trails = bodies.map(() => []);
    let speed = 1;
    
    const G = 0.5; // Gravitational constant
    
    function update() {
        // Calculate gravitational forces
        for (let i = 0; i < bodies.length; i++) {
            let ax = 0, ay = 0;
            
            for (let j = 0; j < bodies.length; j++) {
                if (i === j) continue;
                
                const dx = bodies[j].x - bodies[i].x;
                const dy = bodies[j].y - bodies[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 10) continue; // Prevent extreme forces
                
                const force = G * bodies[j].mass / (dist * dist);
                ax += force * dx / dist;
                ay += force * dy / dist;
            }
            
            bodies[i].vx += ax * speed;
            bodies[i].vy += ay * speed;
        }
        
        // Update positions
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].x += bodies[i].vx * speed;
            bodies[i].y += bodies[i].vy * speed;
            
            // Add to trail
            trails[i].push({ x: bodies[i].x, y: bodies[i].y });
            if (trails[i].length > 200) trails[i].shift();
        }
    }
    
    function draw() {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Draw stars background
        for (let i = 0; i < 100; i++) {
            const x = (Math.sin(i * 567) * 0.5 + 0.5) * width;
            const y = (Math.cos(i * 789) * 0.5 + 0.5) * height;
            const brightness = Math.random() * 0.5 + 0.3;
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.fillRect(x, y, 1, 1);
        }
        
        // Draw trails
        for (let i = 0; i < trails.length; i++) {
            if (trails[i].length < 2) continue;
            
            ctx.beginPath();
            ctx.moveTo(trails[i][0].x, trails[i][0].y);
            
            for (let j = 1; j < trails[i].length; j++) {
                ctx.lineTo(trails[i][j].x, trails[i][j].y);
            }
            
            ctx.strokeStyle = bodies[i].color + '40';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw bodies
        for (const body of bodies) {
            // Glow effect
            const gradient = ctx.createRadialGradient(
                body.x, body.y, 0,
                body.x, body.y, body.radius * 2
            );
            gradient.addColorStop(0, body.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.beginPath();
            ctx.arc(body.x, body.y, body.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Body
            ctx.beginPath();
            ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
            ctx.fillStyle = body.color;
            ctx.fill();
        }
    }
    
    function animate() {
        update();
        draw();
        window.cosmicAnimation = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Controls
    document.getElementById('cosmic-reset')?.addEventListener('click', () => {
        bodies = [
            { x: centerX, y: centerY, vx: 0, vy: 0, mass: 1000, radius: 20, color: '#fcd34d', name: 'Star' },
            { x: centerX + 100, y: centerY, vx: 0, vy: 2.5, mass: 10, radius: 8, color: '#3b82f6', name: 'Planet 1' },
            { x: centerX + 180, y: centerY, vx: 0, vy: 1.9, mass: 15, radius: 10, color: '#ef4444', name: 'Planet 2' },
            { x: centerX + 260, y: centerY, vx: 0, vy: 1.6, mass: 8, radius: 6, color: '#10b981', name: 'Planet 3' },
        ];
        trails = bodies.map(() => []);
    });
    
    document.getElementById('cosmic-add')?.addEventListener('click', () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 200;
        bodies.push({
            x: centerX + Math.cos(angle) * dist,
            y: centerY + Math.sin(angle) * dist,
            vx: Math.sin(angle) * 2,
            vy: -Math.cos(angle) * 2,
            mass: 5 + Math.random() * 15,
            radius: 4 + Math.random() * 6,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            name: 'New Body'
        });
        trails.push([]);
    });
    
    document.getElementById('cosmic-speed')?.addEventListener('input', (e) => {
        speed = parseFloat(e.target.value);
    });
    
    // Initialize gravity math visualization
    initGravityMathCanvas();
}

function initGravityMathCanvas() {
    const canvas = document.getElementById('gravity-math-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Physical constants (scaled for visualization)
    const G_real = 6.674e-11; // m³/(kg·s²)
    const M_sun = 1.989e30; // kg
    const M_earth = 5.972e24; // kg
    const AU = 1.496e11; // m
    
    let centralMass = 1; // Solar masses
    let orbitalRadius = 1; // AU
    let orbitingMass = 1; // Earth masses
    
    let time = 0;
    
    function calculatePhysics() {
        const M = centralMass * M_sun;
        const m = orbitingMass * M_earth;
        const r = orbitalRadius * AU;
        
        const force = G_real * M * m / (r * r);
        const velocity = Math.sqrt(G_real * M / r);
        const period = 2 * Math.PI * r / velocity;
        const periodYears = period / (365.25 * 24 * 3600);
        
        return { force, velocity, period: periodYears };
    }
    
    function updateDisplay() {
        const physics = calculatePhysics();
        
        const forceEl = document.getElementById('force-value');
        const velocityEl = document.getElementById('velocity-value');
        const periodEl = document.getElementById('period-value');
        
        if (forceEl) {
            const exp = Math.floor(Math.log10(physics.force));
            const mantissa = physics.force / Math.pow(10, exp);
            forceEl.textContent = `${mantissa.toFixed(2)} × 10^${exp} N`;
        }
        if (velocityEl) {
            velocityEl.textContent = `${(physics.velocity / 1000).toFixed(1)} km/s`;
        }
        if (periodEl) {
            periodEl.textContent = `${physics.period.toFixed(2)} years`;
        }
    }
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Draw force vs distance graph on left
        const graphMargin = 40;
        const graphWidth = width * 0.4;
        const graphHeight = height - 2 * graphMargin;
        
        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(graphMargin, graphMargin);
        ctx.lineTo(graphMargin, height - graphMargin);
        ctx.lineTo(graphMargin + graphWidth, height - graphMargin);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Inter';
        ctx.fillText('F', graphMargin - 15, graphMargin + 10);
        ctx.fillText('r', graphMargin + graphWidth - 5, height - graphMargin + 15);
        
        // Force curve (1/r²)
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 1; i <= graphWidth; i++) {
            const r = i / graphWidth * 5; // 0 to 5 AU
            const force = 1 / (r * r) * centralMass * orbitingMass;
            const normalizedForce = Math.min(1, force / 5);
            const x = graphMargin + i;
            const y = height - graphMargin - normalizedForce * graphHeight;
            
            if (i === 1) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Mark current radius
        const currentX = graphMargin + (orbitalRadius / 5) * graphWidth;
        const currentForce = 1 / (orbitalRadius * orbitalRadius) * centralMass * orbitingMass;
        const currentY = height - graphMargin - Math.min(1, currentForce / 5) * graphHeight;
        
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw orbital visualization on right
        const orbitCenterX = width * 0.72;
        const orbitCenterY = height / 2;
        const maxOrbitRadius = Math.min(width * 0.25, height * 0.4);
        const scaledRadius = (orbitalRadius / 5) * maxOrbitRadius;
        
        // Central body (star)
        const starRadius = 10 + centralMass * 8;
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(orbitCenterX, orbitCenterY, starRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow
        const gradient = ctx.createRadialGradient(
            orbitCenterX, orbitCenterY, 0,
            orbitCenterX, orbitCenterY, starRadius * 2
        );
        gradient.addColorStop(0, 'rgba(252, 211, 77, 0.5)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orbitCenterX, orbitCenterY, starRadius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Orbit path
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(orbitCenterX, orbitCenterY, scaledRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Orbiting body
        const physics = calculatePhysics();
        const angularVelocity = (2 * Math.PI) / (physics.period * 100); // Scaled for animation
        const angle = time * angularVelocity;
        
        const planetX = orbitCenterX + Math.cos(angle) * scaledRadius;
        const planetY = orbitCenterY + Math.sin(angle) * scaledRadius;
        const planetRadius = 4 + orbitingMass * 0.5;
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Velocity vector
        const vx = -Math.sin(angle) * 30;
        const vy = Math.cos(angle) * 30;
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(planetX, planetY);
        ctx.lineTo(planetX + vx, planetY + vy);
        ctx.stroke();
        
        // Arrow head
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        const arrowAngle = Math.atan2(vy, vx);
        ctx.moveTo(planetX + vx, planetY + vy);
        ctx.lineTo(planetX + vx - 8 * Math.cos(arrowAngle - 0.3), planetY + vy - 8 * Math.sin(arrowAngle - 0.3));
        ctx.lineTo(planetX + vx - 8 * Math.cos(arrowAngle + 0.3), planetY + vy - 8 * Math.sin(arrowAngle + 0.3));
        ctx.closePath();
        ctx.fill();
        
        // Force vector (toward center)
        const fx = (orbitCenterX - planetX) * 0.3;
        const fy = (orbitCenterY - planetY) * 0.3;
        
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(planetX, planetY);
        ctx.lineTo(planetX + fx, planetY + fy);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '11px Inter';
        ctx.fillText('Force ∝ 1/r²', graphMargin + 10, graphMargin + 20);
        ctx.fillStyle = '#10b981';
        ctx.fillText('v (velocity)', width * 0.85, 30);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('F (gravity)', width * 0.85, 50);
        
        time++;
        requestAnimationFrame(draw);
    }
    
    updateDisplay();
    draw();
    
    document.getElementById('central-mass')?.addEventListener('input', (e) => {
        centralMass = parseFloat(e.target.value);
        document.getElementById('central-mass-value').textContent = centralMass.toFixed(1);
        updateDisplay();
    });
    
    document.getElementById('orbital-radius')?.addEventListener('input', (e) => {
        orbitalRadius = parseFloat(e.target.value);
        document.getElementById('orbital-radius-value').textContent = orbitalRadius.toFixed(1);
        updateDisplay();
    });
    
    document.getElementById('orbiting-mass')?.addEventListener('input', (e) => {
        orbitingMass = parseFloat(e.target.value);
        document.getElementById('orbiting-mass-value').textContent = orbitingMass.toFixed(1);
        updateDisplay();
    });
}

// ==========================================
// EARTH SYSTEMS VISUALIZATIONS
// ==========================================

function initEarthSystemsVisualizations() {
    initAtmosphereCanvas();
    initOceanCanvas();
    initTectonicCanvas();
}

function initAtmosphereCanvas() {
    const canvas = document.getElementById('atmosphere-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Wind particles
    const particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            speed: 0.5 + Math.random() * 2,
            size: 1 + Math.random() * 2
        });
    }
    
    function getWindDirection(y) {
        // Simplified Hadley/Ferrel/Polar cells
        const normalizedY = y / height;
        if (normalizedY < 0.2) return -1; // Polar easterlies
        if (normalizedY < 0.4) return 1;  // Westerlies
        if (normalizedY < 0.6) return -1; // Trade winds
        if (normalizedY < 0.8) return 1;  // Westerlies
        return -1; // Polar easterlies
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw Earth curve representation
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.beginPath();
        ctx.arc(width / 2, height + 100, 200, Math.PI, 0);
        ctx.stroke();
        
        // Update and draw particles
        for (const p of particles) {
            const dir = getWindDirection(p.y);
            p.x += dir * p.speed;
            p.y += Math.sin(p.x * 0.02) * 0.3;
            
            // Wrap around
            if (p.x > width) p.x = 0;
            if (p.x < 0) p.x = width;
            if (p.y > height) p.y = 0;
            if (p.y < 0) p.y = height;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + p.size * 0.2})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initOceanCanvas() {
    const canvas = document.getElementById('ocean-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let time = 0;
    
    function animate() {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Draw conveyor belt paths
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 3;
        
        // Warm surface current
        ctx.beginPath();
        ctx.moveTo(0, height * 0.3);
        for (let x = 0; x < width; x += 10) {
            const y = height * 0.3 + Math.sin((x + time * 50) * 0.02) * 20;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.stroke();
        
        // Cold deep current
        ctx.beginPath();
        ctx.moveTo(width, height * 0.7);
        for (let x = width; x > 0; x -= 10) {
            const y = height * 0.7 + Math.sin((x - time * 30) * 0.02) * 15;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.stroke();
        
        // Draw flow particles
        for (let i = 0; i < 20; i++) {
            const t = (time * 0.02 + i * 0.05) % 1;
            const x = t * width;
            const y = height * 0.3 + Math.sin((x + time * 50) * 0.02) * 20;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();
        }
        
        for (let i = 0; i < 15; i++) {
            const t = (time * 0.015 + i * 0.067) % 1;
            const x = width - t * width;
            const y = height * 0.7 + Math.sin((x - time * 30) * 0.02) * 15;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();
        }
        
        // Labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Inter';
        ctx.fillText('Warm Surface', 10, height * 0.25);
        ctx.fillText('Cold Deep', 10, height * 0.65);
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initTectonicCanvas() {
    const canvas = document.getElementById('tectonic-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let time = 0;
    
    function animate() {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Draw mantle convection cells
        const cellWidth = width / 3;
        
        for (let cell = 0; cell < 3; cell++) {
            const cx = cellWidth * cell + cellWidth / 2;
            const direction = cell % 2 === 0 ? 1 : -1;
            
            // Convection arrows
            ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
            ctx.lineWidth = 2;
            
            // Rising at center (or edges)
            for (let i = 0; i < 5; i++) {
                const x = cx + (direction > 0 ? 0 : cellWidth * 0.4 * (i % 2 === 0 ? -1 : 1));
                const yOffset = (time * 2 + i * 30) % height;
                
                ctx.beginPath();
                ctx.moveTo(cx, height - yOffset);
                ctx.lineTo(cx, height - yOffset - 20);
                ctx.stroke();
            }
        }
        
        // Draw crust layer
        ctx.fillStyle = '#374151';
        ctx.fillRect(0, 0, width, height * 0.15);
        
        // Draw plate boundaries
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(width * 0.33, 0);
        ctx.lineTo(width * 0.33, height * 0.15);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(width * 0.67, 0);
        ctx.lineTo(width * 0.67, height * 0.15);
        ctx.stroke();
        
        ctx.setLineDash([]);
        
        // Mantle color gradient
        const gradient = ctx.createLinearGradient(0, height * 0.15, 0, height);
        gradient.addColorStop(0, 'rgba(220, 38, 38, 0.3)');
        gradient.addColorStop(1, 'rgba(220, 38, 38, 0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, height * 0.15, width, height * 0.85);
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==========================================
// SURFACE PHENOMENA
// ==========================================

function initSurfacePhenomena() {
    const phenomTabs = document.querySelectorAll('.phenom-tab');
    const phenomContents = document.querySelectorAll('.phenom-content');
    
    phenomTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const phenom = tab.dataset.phenom;
            
            phenomTabs.forEach(t => t.classList.toggle('active', t === tab));
            phenomContents.forEach(c => {
                c.classList.toggle('active', c.id === `phenom-${phenom}`);
            });
            
            initPhenomenon(phenom);
        });
    });
    
    // Initialize first phenomenon
    initPhenomenon('lightning');
}

function initPhenomenon(type) {
    switch(type) {
        case 'lightning':
            initLightningCanvas();
            break;
        case 'falling':
            initFallingCanvas();
            break;
        case 'rivers':
            initRiverCanvas();
            break;
        case 'trees':
            initTreeCanvas();
            break;
        case 'ecosystems':
            initEcosystemCanvas();
            break;
    }
}

function initLightningCanvas() {
    const canvas = document.getElementById('lightning-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let bolts = [];
    
    function createBolt(x, y, angle, length, depth = 0) {
        if (depth > 8 || length < 5) return [];
        
        const segments = [];
        let currentX = x;
        let currentY = y;
        
        const segmentLength = length / (3 + Math.random() * 3);
        const numSegments = Math.floor(length / segmentLength);
        
        for (let i = 0; i < numSegments; i++) {
            const newAngle = angle + (Math.random() - 0.5) * 0.8;
            const newX = currentX + Math.cos(newAngle) * segmentLength;
            const newY = currentY + Math.sin(newAngle) * segmentLength;
            
            segments.push({
                x1: currentX, y1: currentY,
                x2: newX, y2: newY,
                depth: depth,
                alpha: 1 - depth * 0.1
            });
            
            // Branch chance
            if (Math.random() < 0.3 && depth < 5) {
                const branchAngle = newAngle + (Math.random() - 0.5) * 1.5;
                const branchLength = length * 0.4;
                segments.push(...createBolt(newX, newY, branchAngle, branchLength, depth + 1));
            }
            
            currentX = newX;
            currentY = newY;
            angle = newAngle;
        }
        
        return segments;
    }
    
    function strike() {
        const startX = width * (0.3 + Math.random() * 0.4);
        bolts = createBolt(startX, 0, Math.PI / 2, height * 0.9);
        
        // Fade out over time
        let alpha = 1;
        function fadeOut() {
            ctx.fillStyle = `rgba(10, 10, 15, 0.3)`;
            ctx.fillRect(0, 0, width, height);
            
            // Draw bolts
            for (const seg of bolts) {
                ctx.beginPath();
                ctx.moveTo(seg.x1, seg.y1);
                ctx.lineTo(seg.x2, seg.y2);
                ctx.strokeStyle = `rgba(200, 180, 255, ${alpha * seg.alpha})`;
                ctx.lineWidth = Math.max(1, 4 - seg.depth);
                ctx.stroke();
                
                // Glow
                ctx.strokeStyle = `rgba(150, 120, 255, ${alpha * seg.alpha * 0.3})`;
                ctx.lineWidth = Math.max(2, 8 - seg.depth);
                ctx.stroke();
            }
            
            alpha -= 0.02;
            if (alpha > 0) {
                requestAnimationFrame(fadeOut);
            }
        }
        
        // Initial flash
        ctx.fillStyle = 'rgba(200, 180, 255, 0.3)';
        ctx.fillRect(0, 0, width, height);
        
        fadeOut();
    }
    
    // Draw initial dark sky
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);
    
    // Draw clouds
    ctx.fillStyle = 'rgba(50, 50, 70, 0.5)';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(width * (0.1 + i * 0.2), 30, 40 + Math.random() * 30, 0, Math.PI * 2);
        ctx.fill();
    }
    
    document.getElementById('strike-btn')?.addEventListener('click', strike);
}

function initFallingCanvas() {
    const canvas = document.getElementById('falling-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let objects = [];
    let animating = false;
    
    function createObjects() {
        objects = [];
        for (let i = 0; i < 8; i++) {
            objects.push({
                x: 50 + i * (width - 100) / 7,
                y: 30,
                vx: (Math.random() - 0.5) * 2,
                vy: 0,
                radius: 8 + Math.random() * 8,
                color: `hsl(${30 + Math.random() * 30}, 50%, 40%)`,
                trail: []
            });
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw ground
        ctx.fillStyle = '#374151';
        ctx.fillRect(0, height - 30, width, 30);
        
        let allStopped = true;
        
        for (const obj of objects) {
            // Physics
            if (obj.y < height - 30 - obj.radius) {
                obj.vy += 0.3; // Gravity
                obj.vx *= 0.99; // Air resistance
                obj.x += obj.vx;
                obj.y += obj.vy;
                allStopped = false;
            } else {
                // Bounce
                if (obj.vy > 1) {
                    obj.vy *= -0.5;
                    obj.vx += (Math.random() - 0.5);
                    allStopped = false;
                } else {
                    obj.vy = 0;
                }
            }
            
            // Trail
            obj.trail.push({ x: obj.x, y: obj.y });
            if (obj.trail.length > 50) obj.trail.shift();
            
            // Draw trail
            ctx.beginPath();
            for (let i = 0; i < obj.trail.length; i++) {
                const alpha = i / obj.trail.length * 0.3;
                if (i === 0) {
                    ctx.moveTo(obj.trail[i].x, obj.trail[i].y);
                } else {
                    ctx.lineTo(obj.trail[i].x, obj.trail[i].y);
                }
            }
            ctx.strokeStyle = obj.color + '60';
            ctx.stroke();
            
            // Draw object
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
            ctx.fillStyle = obj.color;
            ctx.fill();
        }
        
        if (!allStopped) {
            requestAnimationFrame(animate);
        } else {
            animating = false;
        }
    }
    
    function drop() {
        createObjects();
        if (!animating) {
            animating = true;
            animate();
        }
    }
    
    // Initial state
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, height - 30, width, 30);
    
    document.getElementById('drop-btn')?.addEventListener('click', drop);
}

function initRiverCanvas() {
    const canvas = document.getElementById('river-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Terrain heightmap
    const resolution = 4;
    const cols = Math.ceil(width / resolution);
    const rows = Math.ceil(height / resolution);
    const terrain = [];
    
    // Generate terrain
    for (let y = 0; y < rows; y++) {
        terrain[y] = [];
        for (let x = 0; x < cols; x++) {
            // Higher on left, lower on right (general slope)
            const baseHeight = 1 - (x / cols) * 0.5;
            // Add noise
            const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.2 +
                         Math.sin(x * 0.05 + y * 0.05) * 0.1;
            terrain[y][x] = Math.max(0, baseHeight + noise);
        }
    }
    
    // Water particles
    let waterParticles = [];
    
    function addRain() {
        for (let i = 0; i < 50; i++) {
            waterParticles.push({
                x: Math.random() * width * 0.3,
                y: Math.random() * height,
                vx: 0,
                vy: 0
            });
        }
    }
    
    function animate() {
        // Draw terrain
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const h = terrain[y][x];
                const green = Math.floor(80 + h * 100);
                const brown = Math.floor(50 + h * 50);
                ctx.fillStyle = `rgb(${brown}, ${green}, ${brown - 20})`;
                ctx.fillRect(x * resolution, y * resolution, resolution, resolution);
            }
        }
        
        // Update and draw water
        const newParticles = [];
        
        for (const p of waterParticles) {
            const gridX = Math.floor(p.x / resolution);
            const gridY = Math.floor(p.y / resolution);
            
            if (gridX < 0 || gridX >= cols - 1 || gridY < 0 || gridY >= rows - 1) {
                continue;
            }
            
            // Flow downhill
            const current = terrain[gridY][gridX];
            const right = terrain[gridY][gridX + 1] ?? current;
            const down = terrain[gridY + 1]?.[gridX] ?? current;
            const downRight = terrain[gridY + 1]?.[gridX + 1] ?? current;
            
            // Gradient
            const gx = (right + downRight) / 2 - (current + down) / 2;
            const gy = (down + downRight) / 2 - (current + right) / 2;
            
            p.vx = p.vx * 0.8 - gx * 5 + (Math.random() - 0.5) * 0.5;
            p.vy = p.vy * 0.8 - gy * 5 + 0.5; // Bias downward
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Erode terrain slightly
            if (terrain[gridY] && terrain[gridY][gridX]) {
                terrain[gridY][gridX] = Math.max(0, terrain[gridY][gridX] - 0.001);
            }
            
            // Keep if in bounds
            if (p.x > 0 && p.x < width && p.y > 0 && p.y < height) {
                newParticles.push(p);
                
                // Draw water
                ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        waterParticles = newParticles;
        
        if (waterParticles.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    // Initial draw
    animate();
    
    document.getElementById('rain-btn')?.addEventListener('click', () => {
        addRain();
        animate();
    });
}

function initTreeCanvas() {
    const canvas = document.getElementById('tree-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    function drawBranch(x, y, length, angle, depth, maxDepth) {
        if (depth > maxDepth) return;
        
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        
        // Draw branch
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = depth < 3 ? '#8B4513' : '#228B22';
        ctx.lineWidth = Math.max(1, maxDepth - depth);
        ctx.stroke();
        
        // Recursive branches
        const newLength = length * (0.65 + Math.random() * 0.15);
        const spread = 0.4 + Math.random() * 0.3;
        
        drawBranch(endX, endY, newLength, angle - spread, depth + 1, maxDepth);
        drawBranch(endX, endY, newLength, angle + spread, depth + 1, maxDepth);
        
        // Sometimes add a middle branch
        if (Math.random() < 0.3) {
            drawBranch(endX, endY, newLength * 0.8, angle + (Math.random() - 0.5) * 0.3, depth + 1, maxDepth);
        }
    }
    
    function drawRoots(x, y, length, angle, depth, maxDepth) {
        if (depth > maxDepth) return;
        
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = Math.max(1, maxDepth - depth);
        ctx.stroke();
        
        const newLength = length * (0.6 + Math.random() * 0.2);
        const spread = 0.5 + Math.random() * 0.3;
        
        drawRoots(endX, endY, newLength, angle - spread, depth + 1, maxDepth);
        drawRoots(endX, endY, newLength, angle + spread, depth + 1, maxDepth);
    }
    
    let growing = false;
    let currentDepth = 0;
    
    function growTree() {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Ground
        ctx.fillStyle = '#3d2817';
        ctx.fillRect(0, height * 0.7, width, height * 0.3);
        
        const treeX = width / 2;
        const treeY = height * 0.7;
        
        // Trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(treeX - 8, treeY - 60, 16, 60);
        
        // Draw branches up to current depth
        if (currentDepth > 0) {
            drawBranch(treeX, treeY - 60, 50, -Math.PI / 2, 0, currentDepth);
            drawRoots(treeX, treeY, 30, Math.PI / 2, 0, Math.min(currentDepth, 4));
        }
        
        if (currentDepth < 7) {
            currentDepth++;
            setTimeout(growTree, 300);
        }
    }
    
    // Initial state
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#3d2817';
    ctx.fillRect(0, height * 0.7, width, height * 0.3);
    
    document.getElementById('grow-btn')?.addEventListener('click', () => {
        currentDepth = 0;
        growTree();
    });
}

function initEcosystemCanvas() {
    const canvas = document.getElementById('ecosystem-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Simple predator-prey simulation
    let prey = [];
    let predators = [];
    
    function init() {
        prey = [];
        predators = [];
        
        for (let i = 0; i < 50; i++) {
            prey.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }
        
        for (let i = 0; i < 5; i++) {
            predators.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                energy: 100
            });
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        // Update prey
        for (const p of prey) {
            // Flee from nearest predator
            let nearestPred = null;
            let nearestDist = Infinity;
            
            for (const pred of predators) {
                const dx = pred.x - p.x;
                const dy = pred.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestPred = pred;
                }
            }
            
            if (nearestPred && nearestDist < 100) {
                const dx = p.x - nearestPred.x;
                const dy = p.y - nearestPred.y;
                p.vx += dx / nearestDist * 0.5;
                p.vy += dy / nearestDist * 0.5;
            }
            
            // Random movement
            p.vx += (Math.random() - 0.5) * 0.3;
            p.vy += (Math.random() - 0.5) * 0.3;
            
            // Limit speed
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > 3) {
                p.vx = p.vx / speed * 3;
                p.vy = p.vy / speed * 3;
            }
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            // Draw
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Update predators
        for (const pred of predators) {
            // Chase nearest prey
            let nearestPrey = null;
            let nearestDist = Infinity;
            
            for (const p of prey) {
                const dx = p.x - pred.x;
                const dy = p.y - pred.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestPrey = p;
                }
            }
            
            if (nearestPrey) {
                const dx = nearestPrey.x - pred.x;
                const dy = nearestPrey.y - pred.y;
                pred.vx += dx / nearestDist * 0.3;
                pred.vy += dy / nearestDist * 0.3;
                
                // Catch prey
                if (nearestDist < 10) {
                    prey = prey.filter(p => p !== nearestPrey);
                    pred.energy += 30;
                }
            }
            
            // Limit speed
            const speed = Math.sqrt(pred.vx * pred.vx + pred.vy * pred.vy);
            if (speed > 4) {
                pred.vx = pred.vx / speed * 4;
                pred.vy = pred.vy / speed * 4;
            }
            
            pred.x += pred.vx;
            pred.y += pred.vy;
            pred.energy -= 0.1;
            
            // Wrap
            if (pred.x < 0) pred.x = width;
            if (pred.x > width) pred.x = 0;
            if (pred.y < 0) pred.y = height;
            if (pred.y > height) pred.y = 0;
            
            // Draw
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(pred.x, pred.y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Remove dead predators
        predators = predators.filter(p => p.energy > 0);
        
        // Reproduce
        if (Math.random() < 0.02 && prey.length < 100) {
            const parent = prey[Math.floor(Math.random() * prey.length)];
            if (parent) {
                prey.push({
                    x: parent.x + (Math.random() - 0.5) * 20,
                    y: parent.y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2
                });
            }
        }
        
        for (const pred of predators) {
            if (pred.energy > 150 && Math.random() < 0.01) {
                predators.push({
                    x: pred.x,
                    y: pred.y,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    energy: 80
                });
                pred.energy -= 50;
            }
        }
        
        // Stats
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Inter';
        ctx.fillText(`Prey: ${prey.length}`, 10, 20);
        ctx.fillText(`Predators: ${predators.length}`, 10, 35);
        
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    document.getElementById('eco-reset')?.addEventListener('click', init);
}

// ==========================================
// HUMAN & ALGORITHMIC
// ==========================================

function initHumanAlgorithmic() {
    initHumanNavCanvas();
    initAlgoCanvas();
}

function initHumanNavCanvas() {
    const canvas = document.getElementById('human-nav-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Simple navigation visualization
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);
    
    // Draw a simple map
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    
    // Roads
    const roads = [
        [[50, 50], [200, 50], [200, 150], [350, 150]],
        [[50, 50], [50, 200], [150, 200]],
        [[150, 200], [350, 200]],
        [[200, 50], [350, 50], [350, 200]]
    ];
    
    for (const road of roads) {
        ctx.beginPath();
        ctx.moveTo(road[0][0], road[0][1]);
        for (let i = 1; i < road.length; i++) {
            ctx.lineTo(road[i][0], road[i][1]);
        }
        ctx.stroke();
    }
    
    // Start and end points
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(50, 50, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '10px Inter';
    ctx.fillText('Start', 35, 75);
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(350, 200, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillText('Goal', 340, 185);
    
    // Human path (not optimal but intuitive)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(200, 50);
    ctx.lineTo(350, 50);
    ctx.lineTo(350, 200);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Human path', 250, 40);
}

function initAlgoCanvas() {
    const canvas = document.getElementById('algo-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    const gridSize = 20;
    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);
    
    let grid = [];
    let start = { x: 1, y: 1 };
    let end = { x: cols - 2, y: rows - 2 };
    let explored = [];
    let path = [];
    let running = false;
    
    function initGrid() {
        grid = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = [];
            for (let x = 0; x < cols; x++) {
                grid[y][x] = Math.random() < 0.25 ? 1 : 0; // 1 = wall
            }
        }
        grid[start.y][start.x] = 0;
        grid[end.y][end.x] = 0;
        explored = [];
        path = [];
    }
    
    function draw() {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (grid[y][x] === 1) {
                    ctx.fillStyle = '#374151';
                    ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
                }
            }
        }
        
        // Draw explored
        for (const cell of explored) {
            ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
            ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize - 1, gridSize - 1);
        }
        
        // Draw path
        for (const cell of path) {
            ctx.fillStyle = '#10b981';
            ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize - 1, gridSize - 1);
        }
        
        // Draw start and end
        ctx.fillStyle = '#10b981';
        ctx.fillRect(start.x * gridSize, start.y * gridSize, gridSize - 1, gridSize - 1);
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(end.x * gridSize, end.y * gridSize, gridSize - 1, gridSize - 1);
    }
    
    async function runAlgorithm(type) {
        if (running) return;
        running = true;
        explored = [];
        path = [];
        
        const openSet = [{ ...start, g: 0, h: 0, f: 0, parent: null }];
        const closedSet = new Set();
        
        function heuristic(a, b) {
            if (type === 'bfs') return 0;
            return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
        }
        
        function getKey(node) {
            return `${node.x},${node.y}`;
        }
        
        while (openSet.length > 0) {
            // Sort by f value (or just FIFO for BFS)
            if (type === 'bfs') {
                // BFS: FIFO
            } else {
                openSet.sort((a, b) => a.f - b.f);
            }
            
            const current = openSet.shift();
            
            if (current.x === end.x && current.y === end.y) {
                // Reconstruct path
                let node = current;
                while (node) {
                    path.unshift({ x: node.x, y: node.y });
                    node = node.parent;
                }
                draw();
                running = false;
                return;
            }
            
            closedSet.add(getKey(current));
            explored.push({ x: current.x, y: current.y });
            
            // Neighbors
            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x, y: current.y - 1 }
            ];
            
            for (const n of neighbors) {
                if (n.x < 0 || n.x >= cols || n.y < 0 || n.y >= rows) continue;
                if (grid[n.y][n.x] === 1) continue;
                if (closedSet.has(getKey(n))) continue;
                
                const g = current.g + 1;
                const h = heuristic(n, end);
                const f = g + h;
                
                const existing = openSet.find(o => o.x === n.x && o.y === n.y);
                if (!existing) {
                    openSet.push({ ...n, g, h, f, parent: current });
                } else if (g < existing.g) {
                    existing.g = g;
                    existing.f = g + existing.h;
                    existing.parent = current;
                }
            }
            
            draw();
            await new Promise(r => setTimeout(r, 20));
        }
        
        running = false;
    }
    
    initGrid();
    draw();
    
    document.getElementById('algo-run')?.addEventListener('click', () => {
        const type = document.getElementById('algo-select')?.value || 'astar';
        runAlgorithm(type);
    });
    
    document.getElementById('algo-reset')?.addEventListener('click', () => {
        running = false;
        initGrid();
        draw();
    });
}

// ==========================================
// MOLECULAR VISUALIZATIONS
// ==========================================

function initMolecularVisualizations() {
    initProteinCanvas();
    initEnzymeCanvas();
    initSignalingCanvas();
    initTransitionCanvas();
}

function initProteinCanvas() {
    const canvas = document.getElementById('protein-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Simplified protein folding visualization
    const numNodes = 20;
    let nodes = [];
    let time = 0;
    
    function init() {
        nodes = [];
        for (let i = 0; i < numNodes; i++) {
            nodes.push({
                x: width * 0.2 + i * 15,
                y: height / 2 + (Math.random() - 0.5) * 50,
                targetX: width / 2 + Math.cos(i * 0.8) * 50,
                targetY: height / 2 + Math.sin(i * 0.8) * 50
            });
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Move toward folded state
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].x += (nodes[i].targetX - nodes[i].x) * 0.02;
            nodes[i].y += (nodes[i].targetY - nodes[i].y) * 0.02;
            nodes[i].y += Math.sin(time * 0.05 + i) * 0.5; // Thermal motion
        }
        
        // Draw connections
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        for (let i = 1; i < nodes.length; i++) {
            ctx.lineTo(nodes[i].x, nodes[i].y);
        }
        ctx.stroke();
        
        // Draw nodes
        for (let i = 0; i < nodes.length; i++) {
            ctx.fillStyle = i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#3b82f6' : '#10b981';
            ctx.beginPath();
            ctx.arc(nodes[i].x, nodes[i].y, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        time++;
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}

function initEnzymeCanvas() {
    const canvas = document.getElementById('enzyme-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Enzyme-substrate binding visualization
    const enzyme = { x: width * 0.7, y: height / 2 };
    let substrates = [];
    
    function init() {
        substrates = [];
        for (let i = 0; i < 30; i++) {
            substrates.push({
                x: Math.random() * width * 0.5,
                y: Math.random() * height,
                vx: (Math.random() - 0.3) * 2,
                vy: (Math.random() - 0.5) * 2,
                bound: false
            });
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw enzyme (pac-man like shape)
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(enzyme.x, enzyme.y, 30, 0.3, Math.PI * 2 - 0.3);
        ctx.lineTo(enzyme.x, enzyme.y);
        ctx.fill();
        
        // Update substrates
        for (const s of substrates) {
            if (!s.bound) {
                s.vx += (Math.random() - 0.5) * 0.3;
                s.vy += (Math.random() - 0.5) * 0.3;
                
                // Limit speed
                const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
                if (speed > 3) {
                    s.vx = s.vx / speed * 3;
                    s.vy = s.vy / speed * 3;
                }
                
                s.x += s.vx;
                s.y += s.vy;
                
                // Bounce
                if (s.x < 0 || s.x > width * 0.9) s.vx *= -1;
                if (s.y < 0 || s.y > height) s.vy *= -1;
                
                // Check binding
                const dx = s.x - enzyme.x;
                const dy = s.y - enzyme.y;
                if (Math.sqrt(dx * dx + dy * dy) < 25 && dx < 0) {
                    s.bound = true;
                    setTimeout(() => {
                        s.x = enzyme.x + 40;
                        s.y = enzyme.y;
                        s.vx = 3;
                        s.vy = (Math.random() - 0.5) * 2;
                        s.bound = false;
                    }, 500);
                }
            }
            
            // Draw
            ctx.fillStyle = s.bound ? '#fcd34d' : '#3b82f6';
            ctx.beginPath();
            ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}

function initSignalingCanvas() {
    const canvas = document.getElementById('signaling-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Signaling network visualization
    const nodes = [];
    const edges = [];
    
    // Create network
    for (let i = 0; i < 15; i++) {
        nodes.push({
            x: 50 + Math.random() * (width - 100),
            y: 30 + Math.random() * (height - 60),
            active: i === 0,
            activationTime: i === 0 ? 0 : -1
        });
    }
    
    // Create edges
    for (let i = 0; i < nodes.length; i++) {
        const numConnections = 1 + Math.floor(Math.random() * 3);
        for (let j = 0; j < numConnections; j++) {
            const target = Math.floor(Math.random() * nodes.length);
            if (target !== i) {
                edges.push({ from: i, to: target });
            }
        }
    }
    
    let time = 0;
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw edges
        for (const edge of edges) {
            const from = nodes[edge.from];
            const to = nodes[edge.to];
            
            ctx.strokeStyle = from.active ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = from.active ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }
        
        // Propagate signal
        if (time % 30 === 0) {
            for (const edge of edges) {
                if (nodes[edge.from].active && !nodes[edge.to].active && Math.random() < 0.3) {
                    nodes[edge.to].active = true;
                    nodes[edge.to].activationTime = time;
                }
            }
        }
        
        // Deactivate old nodes
        for (const node of nodes) {
            if (node.active && node.activationTime >= 0 && time - node.activationTime > 100) {
                node.active = false;
            }
        }
        
        // Keep first node active as signal source
        nodes[0].active = true;
        
        // Draw nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            ctx.fillStyle = node.active ? '#10b981' : '#374151';
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.active ? 8 : 6, 0, Math.PI * 2);
            ctx.fill();
            
            if (i === 0) {
                ctx.strokeStyle = '#10b981';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initTransitionCanvas() {
    const canvas = document.getElementById('transition-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let time = 0;
    
    function animate() {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Left side: classical particles
        for (let i = 0; i < 10; i++) {
            const x = 50 + i * 15 + Math.sin(time * 0.05 + i) * 5;
            const y = height / 2 + Math.cos(time * 0.03 + i * 2) * 20;
            
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Middle: transition zone (getting wavy)
        for (let i = 0; i < 10; i++) {
            const baseX = width * 0.35 + i * 15;
            // Multiple positions (superposition hint)
            for (let j = 0; j < 3; j++) {
                const x = baseX + Math.sin(time * 0.05 + i + j) * (5 + j * 3);
                const y = height / 2 + Math.cos(time * 0.03 + i * 2 + j) * (20 + j * 10);
                
                ctx.fillStyle = `rgba(139, 92, 246, ${0.5 - j * 0.15})`;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Right side: wave function
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = width * 0.65; x < width - 20; x++) {
            const normalizedX = (x - width * 0.65) / (width * 0.35);
            const y = height / 2 + Math.sin(normalizedX * 10 + time * 0.1) * 30 * Math.sin(normalizedX * Math.PI);
            
            if (x === width * 0.65) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '11px Inter';
        ctx.fillText('Classical', 60, height - 10);
        ctx.fillText('Transition', width * 0.4, height - 10);
        ctx.fillText('Quantum', width * 0.75, height - 10);
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==========================================
// QUANTUM VISUALIZATIONS
// ==========================================

function initQuantumVisualizations() {
    initClassicalPathCanvas();
    initQuantumPathCanvas();
    initDoubleSlitCanvas();
    initFeynmanCanvas();
}

function initClassicalPathCanvas() {
    const canvas = document.getElementById('classical-path-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let ballX = 30;
    let time = 0;
    
    function animate() {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Draw path
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, height / 2);
        ctx.quadraticCurveTo(width / 2, height / 2 - 50, width - 30, height / 2);
        ctx.stroke();
        
        // Draw ball
        const t = (Math.sin(time * 0.03) + 1) / 2;
        const x = 30 + t * (width - 60);
        const y = height / 2 - Math.sin(t * Math.PI) * 50;
        
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        for (let i = 1; i <= 5; i++) {
            const trailT = Math.max(0, t - i * 0.05);
            const trailX = 30 + trailT * (width - 60);
            const trailY = height / 2 - Math.sin(trailT * Math.PI) * 50;
            ctx.beginPath();
            ctx.arc(trailX, trailY, 10 - i, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Labels
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(30, height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(width - 30, height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initQuantumPathCanvas() {
    const canvas = document.getElementById('quantum-path-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let time = 0;
    
    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw multiple superposed paths
        const numPaths = 15;
        
        for (let i = 0; i < numPaths; i++) {
            const offset = (i - numPaths / 2) * 8;
            const phase = i * 0.3 + time * 0.02;
            const alpha = 0.3 + 0.2 * Math.cos(phase);
            
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(30, height / 2);
            
            for (let x = 30; x < width - 30; x += 5) {
                const progress = (x - 30) / (width - 60);
                const y = height / 2 + offset * Math.sin(progress * Math.PI) +
                         Math.sin(progress * 5 + phase) * 10;
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
        
        // Central "classical" path highlighted
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(30, height / 2);
        for (let x = 30; x < width - 30; x += 5) {
            const progress = (x - 30) / (width - 60);
            const y = height / 2 + Math.sin(progress * 5 + time * 0.02) * 5;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Start and end
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(30, height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(width - 30, height / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initDoubleSlitCanvas() {
    const canvas = document.getElementById('double-slit-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    const slitX = width * 0.4;
    const screenX = width * 0.85;
    const slitY1 = height * 0.35;
    const slitY2 = height * 0.65;
    const slitWidth = 15;
    
    let particles = [];
    let screenHits = new Array(100).fill(0);
    let detectWhichPath = false;
    
    function drawSetup() {
        // Background
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, width, height);
        
        // Source
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(30, height / 2, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Barrier with slits
        ctx.fillStyle = '#374151';
        ctx.fillRect(slitX, 0, 10, slitY1 - slitWidth / 2);
        ctx.fillRect(slitX, slitY1 + slitWidth / 2, 10, slitY2 - slitY1 - slitWidth);
        ctx.fillRect(slitX, slitY2 + slitWidth / 2, 10, height - slitY2 - slitWidth / 2);
        
        // Screen
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(screenX, 0, 15, height);
        
        // Draw histogram on screen
        const maxHits = Math.max(...screenHits, 1);
        for (let i = 0; i < screenHits.length; i++) {
            const y = (i / screenHits.length) * height;
            const intensity = screenHits[i] / maxHits;
            ctx.fillStyle = `rgba(59, 130, 246, ${intensity})`;
            ctx.fillRect(screenX, y, 15, height / screenHits.length);
        }
    }
    
    function fireParticle() {
        const particle = {
            x: 30,
            y: height / 2,
            vx: 3,
            vy: 0,
            throughSlit: null,
            phase: Math.random() * Math.PI * 2
        };
        particles.push(particle);
    }
    
    function animate() {
        drawSetup();
        
        const newParticles = [];
        
        for (const p of particles) {
            // Before barrier
            if (p.x < slitX) {
                p.x += p.vx;
                
                // Draw as wave before barrier
                if (!detectWhichPath) {
                    ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
            // At barrier - go through slits
            else if (p.x >= slitX && p.x < slitX + 10) {
                if (p.throughSlit === null) {
                    // "Choose" which slit (or both in superposition)
                    if (detectWhichPath) {
                        p.throughSlit = Math.random() < 0.5 ? 1 : 2;
                    } else {
                        p.throughSlit = 'both';
                    }
                }
                p.x += p.vx;
            }
            // After barrier
            else if (p.x < screenX) {
                p.x += p.vx;
                
                if (p.throughSlit === 'both') {
                    // Interference pattern
                    const dy1 = p.y - slitY1;
                    const dy2 = p.y - slitY2;
                    const dist1 = Math.sqrt((p.x - slitX) ** 2 + dy1 ** 2);
                    const dist2 = Math.sqrt((p.x - slitX) ** 2 + dy2 ** 2);
                    const phaseDiff = (dist1 - dist2) * 0.5;
                    
                    // Probability amplitude affects trajectory
                    p.vy = Math.sin(phaseDiff + p.phase) * 0.5;
                } else {
                    // Classical trajectory from one slit
                    const slitY = p.throughSlit === 1 ? slitY1 : slitY2;
                    p.vy = (slitY - height / 2) * 0.01 + (Math.random() - 0.5) * 0.5;
                }
                
                p.y += p.vy;
            }
            // Hit screen
            else {
                const screenIndex = Math.floor((p.y / height) * screenHits.length);
                if (screenIndex >= 0 && screenIndex < screenHits.length) {
                    screenHits[screenIndex]++;
                }
                continue; // Remove particle
            }
            
            // Draw particle
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            
            newParticles.push(p);
        }
        
        particles = newParticles;
        
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    drawSetup();
    
    document.getElementById('fire-particle')?.addEventListener('click', () => {
        fireParticle();
        animate();
    });
    
    document.getElementById('fire-many')?.addEventListener('click', () => {
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                fireParticle();
                if (i === 0) animate();
            }, i * 20);
        }
    });
    
    document.getElementById('slit-reset')?.addEventListener('click', () => {
        particles = [];
        screenHits = new Array(100).fill(0);
        drawSetup();
    });
    
    document.getElementById('which-path')?.addEventListener('change', (e) => {
        detectWhichPath = e.target.checked;
        particles = [];
        screenHits = new Array(100).fill(0);
        drawSetup();
    });
}

function initFeynmanCanvas() {
    const canvas = document.getElementById('feynman-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let time = 0;
    
    function animate() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const startX = 50;
        const startY = height / 2;
        const endX = width - 50;
        const endY = height / 2;
        
        // Draw many paths with varying "craziness"
        const numPaths = 50;
        
        for (let i = 0; i < numPaths; i++) {
            const craziness = Math.abs(i - numPaths / 2) / (numPaths / 2);
            const pathPhase = i * 0.5 + time * 0.02;
            
            // Paths further from classical have more random phases (cancel out)
            const alpha = craziness < 0.3 ? 0.4 : 0.1;
            
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = craziness < 0.3 ? 2 : 1;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            const numPoints = 20;
            for (let j = 1; j <= numPoints; j++) {
                const t = j / numPoints;
                const x = startX + t * (endX - startX);
                
                // Base path
                let y = startY;
                
                // Add wiggles based on craziness
                const wiggleAmplitude = craziness * 80;
                y += Math.sin(t * Math.PI * 2 + pathPhase) * wiggleAmplitude;
                y += Math.sin(t * Math.PI * 4 + pathPhase * 1.5) * wiggleAmplitude * 0.5;
                
                // Offset from center based on path index
                y += (i - numPaths / 2) * 2;
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
        
        // Highlight classical path
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Glow on classical path
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Start and end points
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(startX, startY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.fillText('A', startX - 4, startY + 25);
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(endX, endY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillText('B', endX - 4, endY + 25);
        
        // Legend
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '11px Inter';
        ctx.fillText('Wild paths cancel out', width / 2 - 50, 30);
        ctx.fillText('Classical path: constructive interference', width / 2 - 90, height - 15);
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ==========================================
// HHL VISUALIZATIONS
// ==========================================

function initHHLVisualizations() {
    initInterferenceCanvas();
    initSlimeCanvas();
    initSuperpositionCanvas();
    initEigenvalueCanvas();
}

function initInterferenceCanvas() {
    const canvas = document.getElementById('interference-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let phaseDiff = 0;
    let animating = false;
    let time = 0;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const waveHeight = height * 0.25;
        const centerY = height / 2;
        
        // Wave 1
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width * 0.7; x++) {
            const y = centerY - 60 + Math.sin(x * 0.03 + time * 0.05) * 30;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Wave 2
        const phaseRad = phaseDiff * Math.PI / 180;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width * 0.7; x++) {
            const y = centerY + 60 + Math.sin(x * 0.03 + time * 0.05 + phaseRad) * 30;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Combined wave
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = width * 0.7; x < width; x++) {
            const wave1 = Math.sin(x * 0.03 + time * 0.05);
            const wave2 = Math.sin(x * 0.03 + time * 0.05 + phaseRad);
            const combined = (wave1 + wave2) / 2;
            const y = centerY + combined * 50;
            if (x === width * 0.7) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#3b82f6';
        ctx.font = '12px Inter';
        ctx.fillText('Wave 1', 10, centerY - 90);
        
        ctx.fillStyle = '#ef4444';
        ctx.fillText('Wave 2', 10, centerY + 100);
        
        ctx.fillStyle = '#10b981';
        ctx.fillText('Combined', width * 0.75, centerY - 60);
        
        // Phase indicator
        ctx.fillStyle = 'white';
        ctx.fillText(`Phase: ${phaseDiff}°`, width / 2 - 30, 30);
        
        const interference = Math.cos(phaseRad / 2);
        ctx.fillText(`Amplitude: ${(interference * 100).toFixed(0)}%`, width / 2 - 40, 50);
        
        if (animating) {
            time++;
            requestAnimationFrame(draw);
        }
    }
    
    draw();
    
    document.getElementById('phase-slider')?.addEventListener('input', (e) => {
        phaseDiff = parseInt(e.target.value);
        document.getElementById('phase-value').textContent = `${phaseDiff}°`;
        if (!animating) draw();
    });
    
    document.getElementById('interference-animate')?.addEventListener('click', () => {
        animating = !animating;
        if (animating) draw();
    });
}

function initSlimeCanvas() {
    const canvas = document.getElementById('slime-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let nodes = [];
    let edges = [];
    let running = false;
    
    function init() {
        // Create maze-like structure
        nodes = [
            { x: 30, y: height / 2, type: 'food' },
            { x: width - 30, y: height / 2, type: 'food' },
        ];
        
        // Add intermediate nodes
        for (let i = 0; i < 8; i++) {
            nodes.push({
                x: 60 + Math.random() * (width - 120),
                y: 30 + Math.random() * (height - 60),
                type: 'node'
            });
        }
        
        // Create edges (all initially present)
        edges = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    edges.push({
                        from: i,
                        to: j,
                        flow: 1,
                        distance: dist
                    });
                }
            }
        }
    }
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw edges
        for (const edge of edges) {
            if (edge.flow <= 0) continue;
            
            const from = nodes[edge.from];
            const to = nodes[edge.to];
            
            ctx.strokeStyle = `rgba(250, 204, 21, ${Math.min(1, edge.flow * 0.5)})`;
            ctx.lineWidth = edge.flow * 3;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }
        
        // Draw nodes
        for (const node of nodes) {
            ctx.fillStyle = node.type === 'food' ? '#10b981' : '#fcd34d';
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.type === 'food' ? 10 : 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function simulate() {
        if (!running) return;
        
        // Find shortest path using Dijkstra-like logic
        // Then strengthen edges on that path, weaken others
        
        // Simplified: strengthen edges connecting to food sources
        for (const edge of edges) {
            const fromNode = nodes[edge.from];
            const toNode = nodes[edge.to];
            
            const connectedToFood = fromNode.type === 'food' || toNode.type === 'food';
            
            if (connectedToFood) {
                edge.flow = Math.min(3, edge.flow + 0.05);
            } else {
                // Decay edges not on efficient paths
                edge.flow = Math.max(0, edge.flow - 0.02);
            }
        }
        
        // Propagate flow
        for (const edge of edges) {
            if (edge.flow > 0.5) {
                // Find connected edges and strengthen them
                for (const other of edges) {
                    if (other === edge) continue;
                    if (other.from === edge.to || other.to === edge.from ||
                        other.from === edge.from || other.to === edge.to) {
                        other.flow = Math.min(3, other.flow + 0.01);
                    }
                }
            }
        }
        
        draw();
        setTimeout(simulate, 50);
    }
    
    init();
    draw();
    
    document.getElementById('slime-start')?.addEventListener('click', () => {
        if (!running) {
            running = true;
            simulate();
        } else {
            running = false;
            init();
            draw();
        }
    });
}

function initSuperpositionCanvas() {
    const canvas = document.getElementById('superposition-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let time = 0;
    let running = false;
    let collapsed = false;
    let collapsedState = null;
    
    const states = ['000', '001', '010', '011', '100', '101', '110', '111'];
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        if (!collapsed) {
            // Draw superposition - all states simultaneously
            const barWidth = (width - 40) / states.length;
            
            for (let i = 0; i < states.length; i++) {
                const x = 20 + i * barWidth;
                const amplitude = 0.3 + 0.2 * Math.sin(time * 0.1 + i);
                const barHeight = amplitude * (height - 60);
                
                // Gradient bar
                const gradient = ctx.createLinearGradient(x, height - 30, x, height - 30 - barHeight);
                gradient.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
                gradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x + 5, height - 30 - barHeight, barWidth - 10, barHeight);
                
                // Label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.font = '10px monospace';
                ctx.fillText(`|${states[i]}⟩`, x + 8, height - 10);
            }
            
            ctx.fillStyle = 'white';
            ctx.font = '12px Inter';
            ctx.fillText('All states in superposition', width / 2 - 70, 25);
        } else {
            // Draw collapsed state
            const barWidth = (width - 40) / states.length;
            
            for (let i = 0; i < states.length; i++) {
                const x = 20 + i * barWidth;
                const isCollapsed = states[i] === collapsedState;
                const barHeight = isCollapsed ? (height - 80) : 10;
                
                ctx.fillStyle = isCollapsed ? '#10b981' : 'rgba(100, 100, 100, 0.3)';
                ctx.fillRect(x + 5, height - 30 - barHeight, barWidth - 10, barHeight);
                
                ctx.fillStyle = isCollapsed ? 'white' : 'rgba(255, 255, 255, 0.5)';
                ctx.font = '10px monospace';
                ctx.fillText(`|${states[i]}⟩`, x + 8, height - 10);
            }
            
            ctx.fillStyle = 'white';
            ctx.font = '12px Inter';
            ctx.fillText(`Measured: |${collapsedState}⟩`, width / 2 - 50, 25);
        }
    }
    
    function animate() {
        if (!running) return;
        time++;
        draw();
        requestAnimationFrame(animate);
    }
    
    draw();
    
    document.getElementById('superposition-start')?.addEventListener('click', () => {
        if (!running) {
            running = true;
            collapsed = false;
            animate();
        } else {
            // Collapse!
            collapsed = true;
            collapsedState = states[Math.floor(Math.random() * states.length)];
            running = false;
            draw();
        }
    });
}

function initEigenvalueCanvas() {
    const canvas = document.getElementById('eigenvalue-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let step = 0;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const stageWidth = width / 4;
        
        // Stage indicators
        for (let i = 0; i < 4; i++) {
            ctx.fillStyle = i <= step ? 'rgba(6, 182, 212, 0.2)' : 'rgba(50, 50, 50, 0.2)';
            ctx.fillRect(i * stageWidth + 5, 10, stageWidth - 10, height - 20);
            
            ctx.fillStyle = i <= step ? '#06b6d4' : '#666';
            ctx.font = '11px Inter';
            ctx.fillText(['|b⟩', 'QPE', 'Rotate', 'Measure'][i], i * stageWidth + 10, 30);
        }
        
        // Step 0: Prepare |b⟩
        if (step >= 0) {
            ctx.fillStyle = '#3b82f6';
            ctx.font = '14px monospace';
            ctx.fillText('|b⟩ = α|0⟩ + β|1⟩', stageWidth * 0.1, height / 2);
            
            // Visual: wave packet
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 10; x < stageWidth - 10; x++) {
                const y = height * 0.7 + Math.sin((x - 10) * 0.15) * 20 * Math.exp(-((x - stageWidth / 2) ** 2) / 1000);
                if (x === 10) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        // Step 1: Phase estimation
        if (step >= 1) {
            ctx.fillStyle = '#10b981';
            ctx.font = '12px monospace';
            ctx.fillText('Σ βⱼ|uⱼ⟩|λⱼ⟩', stageWidth * 1.15, height / 2);
            
            // Visual: eigenvalue bars
            const eigenvalues = [0.8, 0.4, 0.2];
            for (let i = 0; i < eigenvalues.length; i++) {
                const barHeight = eigenvalues[i] * 60;
                ctx.fillStyle = `rgba(16, 185, 129, ${0.5 + i * 0.15})`;
                ctx.fillRect(stageWidth + 20 + i * 30, height * 0.7 - barHeight, 20, barHeight);
                ctx.fillStyle = 'white';
                ctx.font = '10px monospace';
                ctx.fillText(`λ${i + 1}`, stageWidth + 25 + i * 30, height * 0.75);
            }
        }
        
        // Step 2: Rotate ancilla
        if (step >= 2) {
            ctx.fillStyle = '#f59e0b';
            ctx.font = '12px monospace';
            ctx.fillText('Σ βⱼ/λⱼ |uⱼ⟩', stageWidth * 2.1, height / 2);
            
            // Visual: inverted eigenvalue bars
            const eigenvalues = [0.8, 0.4, 0.2];
            for (let i = 0; i < eigenvalues.length; i++) {
                const barHeight = (1 / eigenvalues[i]) * 15;
                ctx.fillStyle = `rgba(245, 158, 11, ${0.5 + i * 0.15})`;
                ctx.fillRect(stageWidth * 2 + 20 + i * 30, height * 0.7 - barHeight, 20, barHeight);
                ctx.fillStyle = 'white';
                ctx.font = '10px monospace';
                ctx.fillText(`1/λ${i + 1}`, stageWidth * 2 + 20 + i * 30, height * 0.75);
            }
        }
        
        // Step 3: Measure
        if (step >= 3) {
            ctx.fillStyle = '#ec4899';
            ctx.font = '14px monospace';
            ctx.fillText('|x⟩ = A⁻¹|b⟩', stageWidth * 3.1, height / 2);
            
            // Visual: collapsed state
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(stageWidth * 3.5, height * 0.65, 20, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = '12px Inter';
            ctx.fillText('Solution!', stageWidth * 3.35, height * 0.85);
        }
        
        // Arrows between stages
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            if (i < step) {
                ctx.strokeStyle = '#06b6d4';
            } else {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            }
            ctx.beginPath();
            ctx.moveTo((i + 1) * stageWidth - 15, height / 2);
            ctx.lineTo((i + 1) * stageWidth + 5, height / 2);
            ctx.stroke();
            
            // Arrow head
            ctx.beginPath();
            ctx.moveTo((i + 1) * stageWidth + 5, height / 2);
            ctx.lineTo((i + 1) * stageWidth - 2, height / 2 - 5);
            ctx.lineTo((i + 1) * stageWidth - 2, height / 2 + 5);
            ctx.fill();
        }
    }
    
    draw();
    
    document.getElementById('eigen-step1')?.addEventListener('click', () => { step = 0; draw(); });
    document.getElementById('eigen-step2')?.addEventListener('click', () => { step = 1; draw(); });
    document.getElementById('eigen-step3')?.addEventListener('click', () => { step = 2; draw(); });
    document.getElementById('eigen-step4')?.addEventListener('click', () => { step = 3; draw(); });
    document.getElementById('eigen-reset')?.addEventListener('click', () => { step = 0; draw(); });
}

// ==========================================
// GTTI THEORY VISUALIZATIONS
// ==========================================

function initGTTIVisualizations() {
    initSigmaCanvas();
    initEpsilonCanvas();
    initAlephCanvas();
    initCircuitDepthCanvas();
    initPhaseRegimeCanvas();
    initZenoCanvas();
    initSpectralGapCanvas();
    initRigidityDeathCanvas();
    initUnifiedCanvas();
}

function initSigmaCanvas() {
    const canvas = document.getElementById('sigma-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let historyRate = 0.8;
    let capacityRate = 1.0;
    let timeScale = 5;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const margin = 50;
        const graphWidth = width - 2 * margin;
        const graphHeight = height - 2 * margin;
        
        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, height - margin);
        ctx.lineTo(width - margin, height - margin);
        ctx.stroke();
        
        // Axis labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Inter';
        ctx.fillText('σ(t)', margin - 30, margin + 10);
        ctx.fillText('t', width - margin + 10, height - margin + 5);
        
        // σ = 1 threshold line
        const thresholdY = margin + graphHeight * (1 - 1 / 2); // σ=1 at half height (max σ = 2)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(margin, thresholdY);
        ctx.lineTo(width - margin, thresholdY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('σ = 1 (threshold)', width - margin - 100, thresholdY - 5);
        
        // Draw σ(t) curve
        const sigma = historyRate / capacityRate;
        
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let i = 0; i <= graphWidth; i++) {
            const t = (i / graphWidth) * timeScale;
            // σ can vary over time - show oscillations around base value
            const sigmaT = sigma * (1 + 0.2 * Math.sin(t * 2)) * (1 + t * 0.05);
            const x = margin + i;
            const y = height - margin - (sigmaT / 2) * graphHeight;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, Math.max(margin, y));
        }
        ctx.stroke();
        
        // Draw history accumulation rate (dotted)
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let i = 0; i <= graphWidth; i++) {
            const t = (i / graphWidth) * timeScale;
            const x = margin + i;
            const y = height - margin - (historyRate * (1 + t * 0.1) / 2) * graphHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw capacity growth rate (dotted)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let i = 0; i <= graphWidth; i++) {
            const t = (i / graphWidth) * timeScale;
            const x = margin + i;
            const y = height - margin - (capacityRate * (1 + t * 0.05) / 2) * graphHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Legend
        ctx.fillStyle = '#9333ea';
        ctx.fillText('σ(t) = ṁ*/Ċ', margin + 10, margin + 20);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('History Rate (ṁ*)', margin + 10, margin + 40);
        ctx.fillStyle = '#10b981';
        ctx.fillText('Capacity Rate (Ċ)', margin + 10, margin + 60);
        
        // Current σ value
        ctx.fillStyle = 'white';
        ctx.font = '16px Inter';
        ctx.fillText(`σ = ${sigma.toFixed(2)}`, width - margin - 80, margin + 30);
    }
    
    draw();
    
    document.getElementById('history-rate')?.addEventListener('input', (e) => {
        historyRate = parseFloat(e.target.value);
        document.getElementById('history-rate-value').textContent = historyRate.toFixed(1);
        draw();
    });
    
    document.getElementById('capacity-rate')?.addEventListener('input', (e) => {
        capacityRate = parseFloat(e.target.value);
        document.getElementById('capacity-rate-value').textContent = capacityRate.toFixed(1);
        draw();
    });
    
    document.getElementById('time-scale')?.addEventListener('input', (e) => {
        timeScale = parseInt(e.target.value);
        document.getElementById('time-scale-value').textContent = timeScale;
        draw();
    });
}

function initEpsilonCanvas() {
    const canvas = document.getElementById('epsilon-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let epsilon = 0.5;
    let numImpulses = 20;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const margin = 50;
        const graphWidth = width - 2 * margin;
        const graphHeight = height - 2 * margin;
        
        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, height - margin);
        ctx.lineTo(width - margin, height - margin);
        ctx.stroke();
        
        // Draw impulses
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2;
        
        const impulseSpacing = graphWidth / numImpulses;
        
        for (let i = 0; i < numImpulses; i++) {
            const x = margin + i * impulseSpacing;
            const impulseHeight = graphHeight * 0.7 * (1 - epsilon * 0.5);
            
            ctx.beginPath();
            ctx.moveTo(x, height - margin);
            ctx.lineTo(x, height - margin - impulseHeight);
            ctx.stroke();
            
            // Small arrow at top
            ctx.beginPath();
            ctx.moveTo(x - 3, height - margin - impulseHeight + 10);
            ctx.lineTo(x, height - margin - impulseHeight);
            ctx.lineTo(x + 3, height - margin - impulseHeight + 10);
            ctx.stroke();
        }
        
        // Draw effective continuous law (smoothed)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const smoothing = 1 / epsilon;
        for (let i = 0; i <= graphWidth; i++) {
            const x = margin + i;
            const baseHeight = graphHeight * 0.3;
            // More smoothing with smaller epsilon
            const noise = epsilon > 0.1 ? Math.sin(i * 0.1 / epsilon) * 20 * epsilon : 0;
            const y = height - margin - baseHeight - noise;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Inter';
        ctx.fillText(`ε = ${epsilon.toFixed(2)}`, width - margin - 60, margin + 20);
        ctx.fillStyle = '#9333ea';
        ctx.fillText('Discrete impulses', margin + 10, margin + 20);
        ctx.fillStyle = '#10b981';
        ctx.fillText('Effective continuous', margin + 10, margin + 40);
        
        // Show convergence note
        if (epsilon < 0.1) {
            ctx.fillStyle = '#10b981';
            ctx.font = '14px Inter';
            ctx.fillText('→ Homogenized!', width / 2 - 50, height / 2);
        }
    }
    
    draw();
    
    document.getElementById('epsilon-value')?.addEventListener('input', (e) => {
        epsilon = parseFloat(e.target.value);
        document.getElementById('epsilon-display').textContent = epsilon.toFixed(2);
        draw();
    });
    
    document.getElementById('num-impulses')?.addEventListener('input', (e) => {
        numImpulses = parseInt(e.target.value);
        document.getElementById('impulses-display').textContent = numImpulses;
        draw();
    });
}

function initAlephCanvas() {
    const canvas = document.getElementById('aleph-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let nodes = [];
    let edges = [];
    let sigma = 0;
    let met = 0;
    let animating = false;
    
    function init() {
        nodes = [];
        edges = [];
        sigma = 0;
        met = 0;
        
        // Create initial graph structure
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            nodes.push({
                x: width / 2 + Math.cos(angle) * 80,
                y: height / 2 + Math.sin(angle) * 80,
                stress: 0
            });
        }
        
        // Initial edges
        for (let i = 0; i < nodes.length; i++) {
            edges.push({
                from: i,
                to: (i + 1) % nodes.length
            });
        }
    }
    
    function triggerAleph() {
        // Add new node (topological surgery)
        const newNode = {
            x: width / 2 + (Math.random() - 0.5) * 160,
            y: height / 2 + (Math.random() - 0.5) * 160,
            stress: 0,
            isNew: true
        };
        nodes.push(newNode);
        
        // Connect to nearest nodes
        const newIndex = nodes.length - 1;
        const distances = nodes.slice(0, -1).map((n, i) => ({
            index: i,
            dist: Math.sqrt((n.x - newNode.x) ** 2 + (n.y - newNode.y) ** 2)
        }));
        distances.sort((a, b) => a.dist - b.dist);
        
        edges.push({ from: newIndex, to: distances[0].index, isNew: true });
        edges.push({ from: newIndex, to: distances[1].index, isNew: true });
        
        // Reset sigma, increase met
        sigma = 0.3;
        met++;
        
        // Animate highlight
        setTimeout(() => {
            nodes[newIndex].isNew = false;
            edges.forEach(e => e.isNew = false);
        }, 1000);
    }
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        // Increase sigma over time
        if (animating) {
            sigma = Math.min(1.2, sigma + 0.005);
            
            // Update node stress
            for (const node of nodes) {
                node.stress = sigma;
            }
        }
        
        // Draw edges
        for (const edge of edges) {
            const from = nodes[edge.from];
            const to = nodes[edge.to];
            
            ctx.strokeStyle = edge.isNew ? '#10b981' : `rgba(147, 51, 234, ${0.3 + sigma * 0.4})`;
            ctx.lineWidth = edge.isNew ? 3 : 2;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }
        
        // Draw nodes
        for (const node of nodes) {
            const color = node.isNew ? '#10b981' : 
                         sigma > 0.9 ? '#ef4444' : 
                         sigma > 0.6 ? '#f59e0b' : '#9333ea';
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 10 + sigma * 5, 0, Math.PI * 2);
            ctx.fill();
            
            if (sigma > 0.8) {
                // Pulsing effect near threshold
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 15 + Math.sin(Date.now() * 0.01) * 5, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        // Draw stats
        ctx.fillStyle = 'white';
        ctx.font = '14px Inter';
        ctx.fillText(`σ = ${sigma.toFixed(2)}`, 20, 30);
        ctx.fillText(`Met = ${met}`, 20, 50);
        ctx.fillText(`Nodes = ${nodes.length}`, 20, 70);
        
        // Threshold warning
        if (sigma > 0.9) {
            ctx.fillStyle = '#ef4444';
            ctx.font = '16px Inter';
            ctx.fillText('⚠ Approaching threshold! Aleph event needed', width / 2 - 140, height - 20);
        }
        
        if (animating) {
            requestAnimationFrame(draw);
        }
    }
    
    init();
    draw();
    animating = true;
    draw();
    
    document.getElementById('trigger-aleph')?.addEventListener('click', () => {
        triggerAleph();
    });
    
    document.getElementById('reset-aleph')?.addEventListener('click', () => {
        init();
        draw();
    });
}

function initCircuitDepthCanvas() {
    const canvas = document.getElementById('circuit-depth-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let numQubits = 4;
    let gateDensity = 0.5;
    let decoherence = 0.05;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const margin = 50;
        const circuitWidth = width - 2 * margin;
        const qubitSpacing = (height - 2 * margin) / (numQubits + 1);
        
        // Draw qubit lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < numQubits; i++) {
            const y = margin + (i + 1) * qubitSpacing;
            ctx.beginPath();
            ctx.moveTo(margin, y);
            ctx.lineTo(width - margin, y);
            ctx.stroke();
            
            // Qubit label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '12px monospace';
            ctx.fillText(`|q${i}⟩`, 15, y + 4);
        }
        
        // Draw gates
        const numGates = Math.floor(15 * gateDensity);
        const gateWidth = circuitWidth / (numGates + 2);
        
        let met = 0;
        let coherenceRemaining = 1;
        
        for (let g = 0; g < numGates; g++) {
            const x = margin + (g + 1) * gateWidth;
            const qubit1 = Math.floor(Math.random() * numQubits);
            const y1 = margin + (qubit1 + 1) * qubitSpacing;
            
            // Decoherence effect
            coherenceRemaining *= (1 - decoherence);
            const alpha = Math.max(0.2, coherenceRemaining);
            
            if (Math.random() < 0.3 && numQubits > 1) {
                // Two-qubit gate
                const qubit2 = (qubit1 + 1) % numQubits;
                const y2 = margin + (qubit2 + 1) * qubitSpacing;
                
                ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, Math.min(y1, y2));
                ctx.lineTo(x, Math.max(y1, y2));
                ctx.stroke();
                
                ctx.fillStyle = `rgba(147, 51, 234, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y1, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y2, 8, 0, Math.PI * 2);
                ctx.fill();
                
                met += 2;
            } else {
                // Single-qubit gate
                ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
                ctx.fillRect(x - 12, y1 - 12, 24, 24);
                
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.font = '10px Inter';
                ctx.fillText('U', x - 4, y1 + 4);
                
                met += 1;
            }
        }
        
        // Stats
        ctx.fillStyle = 'white';
        ctx.font = '14px Inter';
        ctx.fillText(`Circuit Depth (Met): ${met}`, width - 180, 30);
        ctx.fillText(`Coherence: ${(coherenceRemaining * 100).toFixed(1)}%`, width - 180, 50);
        ctx.fillText(`Hilbert Dim: 2^${numQubits} = ${Math.pow(2, numQubits)}`, width - 180, 70);
        
        // σ estimate
        const sigma = met / (Math.pow(2, numQubits) * coherenceRemaining * 10);
        ctx.fillStyle = sigma > 1 ? '#ef4444' : sigma > 0.7 ? '#f59e0b' : '#10b981';
        ctx.fillText(`σ ≈ ${sigma.toFixed(2)}`, width - 180, 90);
    }
    
    draw();
    
    document.getElementById('num-qubits')?.addEventListener('input', (e) => {
        numQubits = parseInt(e.target.value);
        document.getElementById('qubits-display').textContent = numQubits;
        draw();
    });
    
    document.getElementById('gate-density')?.addEventListener('input', (e) => {
        gateDensity = parseFloat(e.target.value);
        document.getElementById('density-display').textContent = gateDensity.toFixed(1);
        draw();
    });
    
    document.getElementById('decoherence')?.addEventListener('input', (e) => {
        decoherence = parseFloat(e.target.value);
        document.getElementById('decoherence-display').textContent = decoherence.toFixed(2);
        draw();
    });
}

function initPhaseRegimeCanvas() {
    const canvas = document.getElementById('phase-regime-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let time = 0;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;
        
        // Draw 3D-like phase space
        // Multiple concentric circles with different regimes
        
        for (let r = radius; r > 10; r -= 20) {
            const progress = r / radius;
            
            // Color based on regime (inner = high σ)
            let color;
            if (progress < 0.4) {
                color = `rgba(239, 68, 68, ${0.3 + (1 - progress) * 0.3})`; // Red - collapse
            } else if (progress < 0.7) {
                color = `rgba(245, 158, 11, ${0.3 + (1 - progress) * 0.2})`; // Yellow - critical
            } else {
                color = `rgba(16, 185, 129, ${0.3 + (1 - progress) * 0.2})`; // Green - unitary
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            // Warped circle for 3D effect
            for (let a = 0; a <= Math.PI * 2; a += 0.1) {
                const warp = Math.sin(a * 3 + time * 0.02) * 10 * (1 - progress);
                const x = centerX + Math.cos(a) * (r + warp);
                const y = centerY + Math.sin(a) * (r * 0.6 + warp * 0.5); // Flatten for perspective
                
                if (a === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw trajectory
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let t = 0; t < time; t++) {
            const progress = t / 200;
            const spiralRadius = radius * (1 - progress * 0.8);
            const angle = progress * Math.PI * 4;
            const x = centerX + Math.cos(angle) * spiralRadius;
            const y = centerY + Math.sin(angle) * spiralRadius * 0.6;
            
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Current position
        const progress = (time % 200) / 200;
        const currentRadius = radius * (1 - progress * 0.8);
        const currentAngle = progress * Math.PI * 4;
        const currentX = centerX + Math.cos(currentAngle) * currentRadius;
        const currentY = centerY + Math.sin(currentAngle) * currentRadius * 0.6;
        
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Labels
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.fillText('σ < 1 (Unitary)', width - 120, 30);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(width - 140, 22, 12, 12);
        
        ctx.fillStyle = 'white';
        ctx.fillText('σ ≈ 1 (Critical)', width - 120, 50);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(width - 140, 42, 12, 12);
        
        ctx.fillStyle = 'white';
        ctx.fillText('σ > 1 (Collapse)', width - 120, 70);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(width - 140, 62, 12, 12);
        
        time++;
        requestAnimationFrame(draw);
    }
    
    draw();
}

function initZenoCanvas() {
    const canvas = document.getElementById('zeno-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let measurementFreq = 10;
    let time = 0;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const margin = 50;
        const graphWidth = width - 2 * margin;
        const graphHeight = height - 2 * margin;
        
        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, height - margin);
        ctx.lineTo(width - margin, height - margin);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Inter';
        ctx.fillText('P(initial state)', margin - 40, margin + 10);
        ctx.fillText('Time', width - margin - 20, height - margin + 20);
        
        // Draw survival probability without measurement
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for (let i = 0; i <= graphWidth; i++) {
            const t = i / graphWidth * 5;
            const prob = Math.exp(-t); // Exponential decay
            const x = margin + i;
            const y = height - margin - prob * graphHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw survival probability with Zeno effect
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const dt = 5 / measurementFreq; // Time between measurements
        let prob = 1;
        
        for (let i = 0; i <= graphWidth; i++) {
            const t = i / graphWidth * 5;
            const measurementIndex = Math.floor(t / dt);
            
            // Zeno effect: probability decays slower with more measurements
            // P(survive) ≈ (1 - (dt)²)^n ≈ exp(-t²/n)
            const effectiveDecay = Math.exp(-t * t / measurementFreq);
            prob = effectiveDecay;
            
            const x = margin + i;
            const y = height - margin - prob * graphHeight;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Draw measurement events
        ctx.fillStyle = '#9333ea';
        for (let m = 0; m < measurementFreq; m++) {
            const t = m * dt;
            const x = margin + (t / 5) * graphWidth;
            if (x < width - margin) {
                ctx.beginPath();
                ctx.moveTo(x, height - margin);
                ctx.lineTo(x, height - margin - 10);
                ctx.strokeStyle = '#9333ea';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        // Legend
        ctx.fillStyle = '#ef4444';
        ctx.fillText('No measurement (decay)', margin + 10, margin + 20);
        ctx.fillStyle = '#10b981';
        ctx.fillText('With Zeno measurements', margin + 10, margin + 40);
        ctx.fillStyle = '#9333ea';
        ctx.fillText(`Measurements: ${measurementFreq}`, margin + 10, margin + 60);
    }
    
    draw();
    
    document.getElementById('zeno-freq')?.addEventListener('input', (e) => {
        measurementFreq = parseInt(e.target.value);
        document.getElementById('zeno-freq-display').textContent = measurementFreq;
        draw();
    });
}

function initSpectralGapCanvas() {
    const canvas = document.getElementById('spectral-gap-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let initialGap = 1;
    let rigidityRate = 0.05;
    let currentMet = 20;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        const margin = 50;
        const graphWidth = width - 2 * margin;
        const graphHeight = height - 2 * margin;
        
        // Axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, height - margin);
        ctx.lineTo(width - margin, height - margin);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Inter';
        ctx.fillText('λ₀ (Spectral Gap)', margin - 40, margin + 10);
        ctx.fillText('Met (M)', width - margin - 30, height - margin + 20);
        
        // Draw spectral gap decay
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const maxMet = 100;
        for (let m = 0; m <= maxMet; m++) {
            const x = margin + (m / maxMet) * graphWidth;
            const gap = initialGap * Math.exp(-rigidityRate * m);
            const y = height - margin - (gap / 2) * graphHeight;
            
            if (m === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Critical threshold line
        const criticalGap = 0.1;
        const criticalY = height - margin - (criticalGap / 2) * graphHeight;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(margin, criticalY);
        ctx.lineTo(width - margin, criticalY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('Rigidity Death Threshold', width - margin - 140, criticalY - 5);
        
        // Current position marker
        const currentX = margin + (currentMet / maxMet) * graphWidth;
        const currentGap = initialGap * Math.exp(-rigidityRate * currentMet);
        const currentY = height - margin - (currentGap / 2) * graphHeight;
        
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Current values
        ctx.fillStyle = 'white';
        ctx.font = '14px Inter';
        ctx.fillText(`λ₀(${currentMet}) = ${currentGap.toFixed(3)}`, currentX + 15, currentY);
        
        // Warning if approaching death
        if (currentGap < 0.2) {
            ctx.fillStyle = '#ef4444';
            ctx.font = '16px Inter';
            ctx.fillText('⚠ Approaching Rigidity Death!', width / 2 - 100, margin + 30);
        }
    }
    
    draw();
    
    document.getElementById('initial-gap')?.addEventListener('input', (e) => {
        initialGap = parseFloat(e.target.value);
        document.getElementById('gap-display').textContent = initialGap.toFixed(1);
        draw();
    });
    
    document.getElementById('rigidity-rate')?.addEventListener('input', (e) => {
        rigidityRate = parseFloat(e.target.value);
        document.getElementById('rigidity-display').textContent = rigidityRate.toFixed(2);
        draw();
    });
    
    document.getElementById('current-met')?.addEventListener('input', (e) => {
        currentMet = parseInt(e.target.value);
        document.getElementById('met-display').textContent = currentMet;
        draw();
    });
}

function initRigidityDeathCanvas() {
    const canvas = document.getElementById('rigidity-death-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let time = 0;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        // Visualize transport freezing as rigidity increases
        const numParticles = 30;
        const met = (time % 300) / 300 * 100; // Increases over time
        const mobility = Math.exp(-met * 0.03);
        
        for (let i = 0; i < numParticles; i++) {
            const baseX = (i / numParticles) * width;
            const baseY = height / 2;
            
            // Movement decreases as met increases
            const dx = Math.sin(time * 0.05 + i) * 30 * mobility;
            const dy = Math.cos(time * 0.03 + i * 2) * 20 * mobility;
            
            const x = baseX + dx;
            const y = baseY + dy;
            
            // Color transitions from mobile (cyan) to frozen (red)
            const r = Math.floor(239 * (1 - mobility) + 6 * mobility);
            const g = Math.floor(68 * (1 - mobility) + 182 * mobility);
            const b = Math.floor(68 * (1 - mobility) + 212 * mobility);
            
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Labels
        ctx.fillStyle = 'white';
        ctx.font = '14px Inter';
        ctx.fillText(`Met: ${met.toFixed(0)}`, 20, 30);
        ctx.fillText(`Mobility: ${(mobility * 100).toFixed(1)}%`, 20, 50);
        
        if (mobility < 0.1) {
            ctx.fillStyle = '#ef4444';
            ctx.font = '18px Inter';
            ctx.fillText('RIGIDITY DEATH', width / 2 - 80, height - 20);
        }
        
        time++;
        requestAnimationFrame(draw);
    }
    
    draw();
}

function initUnifiedCanvas() {
    const canvas = document.getElementById('unified-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    let time = 0;
    
    function draw() {
        ctx.fillStyle = '#12121a';
        ctx.fillRect(0, 0, width, height);
        
        // Draw unified diagram showing all scales
        const sections = [
            { label: 'Macro', color: '#3b82f6', y: height * 0.15 },
            { label: 'Meso', color: '#10b981', y: height * 0.38 },
            { label: 'Quantum', color: '#9333ea', y: height * 0.62 },
            { label: 'Compute', color: '#06b6d4', y: height * 0.85 }
        ];
        
        // Draw connecting flow
        for (let i = 0; i < sections.length - 1; i++) {
            const gradient = ctx.createLinearGradient(0, sections[i].y, 0, sections[i + 1].y);
            gradient.addColorStop(0, sections[i].color + '40');
            gradient.addColorStop(1, sections[i + 1].color + '40');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(width * 0.1, sections[i].y, width * 0.8, sections[i + 1].y - sections[i].y);
        }
        
        // Draw each section
        for (const section of sections) {
            // Section line
            ctx.strokeStyle = section.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(width * 0.05, section.y);
            ctx.lineTo(width * 0.95, section.y);
            ctx.stroke();
            
            // Label
            ctx.fillStyle = section.color;
            ctx.font = '14px Inter';
            ctx.fillText(section.label, 20, section.y + 5);
            
            // Animated elements along the line
            for (let i = 0; i < 5; i++) {
                const baseX = width * 0.15 + i * (width * 0.7 / 4);
                const x = baseX + Math.sin(time * 0.03 + i) * 20;
                
                ctx.fillStyle = section.color;
                ctx.beginPath();
                ctx.arc(x, section.y, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Draw σ threshold indicator (vertical)
        const thresholdX = width * 0.7 + Math.sin(time * 0.02) * 50;
        
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(thresholdX, height * 0.1);
        ctx.lineTo(thresholdX, height * 0.9);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px Inter';
        ctx.save();
        ctx.translate(thresholdX + 15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('σ = 1 Threshold', 0, 0);
        ctx.restore();
        
        // Central equation
        ctx.fillStyle = 'white';
        ctx.font = '16px monospace';
        ctx.fillText('σ(t) = ṁ*/Ċ < 1 → Continuous', width / 2 - 100, height * 0.5);
        ctx.fillText('σ(t) → 1 → Aleph Event', width / 2 - 80, height * 0.5 + 25);
        
        time++;
        requestAnimationFrame(draw);
    }
    
    draw();
}
