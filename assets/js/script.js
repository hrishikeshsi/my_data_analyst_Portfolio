// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor Logic
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

// Set initial position properties to avoid jumps
gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
gsap.set(cursorOutline, { xPercent: -50, yPercent: -50 });

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows cursor immediately
    gsap.to(cursorDot, {
        x: posX,
        y: posY,
        duration: 0
    }); // Using GSAP for consistency even though instant

    // Outline follows with lag
    gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: "power2.out"
    });
});

// Hover effects for cursor
const links = document.querySelectorAll('a, button, .project-card, .skill-card, .nav-link');

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(cursorOutline, {
            width: 60,
            height: 60,
            backgroundColor: "rgba(0, 243, 255, 0.1)",
            border: "1px solid rgba(0, 243, 255, 0.5)",
            duration: 0.3
        });
    });
    link.addEventListener('mouseleave', () => {
        gsap.to(cursorOutline, {
            width: 30,
            height: 30,
            backgroundColor: "transparent",
            border: "1px solid #00f3ff",
            duration: 0.3
        });
    });
});

// Initial Load Animations
const tl = gsap.timeline();

tl.from('.header', {
    y: -20,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
})
.from('.hero-content > *', { // Selects direct children
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
}, "-=0.5")
.from('.hero-image', {
    x: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
}, "-=0.8")
.from('.scroll-down', {
    y: -10,
    opacity: 0,
    duration: 1
}, "-=0.5");


// Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal');

revealElements.forEach(element => {
    gsap.fromTo(element, 
        {
            y: 50,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        }
    );
});

// Section Title Line Animation
const lines = document.querySelectorAll('.line');
lines.forEach(line => {
    gsap.fromTo(line,
        { width: 0 },
        {
            width: '100px', // or whatever max width in CSS, but let's animate flex-grow feel
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: line,
                start: 'top 90%'
            }
        }
    );
});

// Staggered Skills
const skillCards = document.querySelectorAll('.skill-card');
skillCards.forEach((card, index) => {
    gsap.from(card, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: index * 0.05,
        scrollTrigger: {
            trigger: card.parentElement,
            start: 'top 85%'
        }
    });
});

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navList = document.querySelector('.nav-list');

if(mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        
        if(navList.style.display === 'flex') {
            gsap.to('.nav-link', {
                y: -20,
                opacity: 0,
                duration: 0.3,
                stagger: 0.05,
                onComplete: () => {
                    navList.style.display = 'none';
                }
            });
        } else {
            navList.style.display = 'flex';
            navList.style.position = 'absolute';
            navList.style.top = '70px'; // Below header
            navList.style.left = '0';
            navList.style.width = '100%';
            navList.style.flexDirection = 'column';
            navList.style.background = 'rgba(5, 5, 5, 0.98)';
            navList.style.padding = '40px 0';
            navList.style.borderBottom = '1px solid #333';
            
            gsap.fromTo('.nav-link', 
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }
            );
        }
    });
}

// Background Graph Animation
(function() {
    const canvas = document.getElementById('bg-graph');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Data config
    let points = [];
    const spacing = 40; 
    const speed = 2; 
    let scrollOffset = 0;
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initPoints();
    }

    function initPoints() {
        points = [];
        const numPoints = Math.ceil(width / spacing) + 5;
        let y = 0.5; // Center start
        for (let i = 0; i < numPoints; i++) {
            points.push(y);
            y = nextValue(y);
        }
    }

    function nextValue(prev) {
        // Random walk
        let change = (Math.random() - 0.5) * 0.2;
        let next = prev + change;
        
        // Soft clamping (0.3 to 0.7)
        if (next > 0.7) next -= 0.05;
        if (next < 0.3) next += 0.05;
        
        return next;
    }

    function update() {
        scrollOffset += speed;
        
        if (scrollOffset >= spacing) {
            scrollOffset = 0;
            points.shift();
            points.push(nextValue(points[points.length - 1]));
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        // Gradient (Neon Blue -> Purple)
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(0, 243, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(188, 19, 254, 0.5)');
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = gradient;
        ctx.lineJoin = 'round';
        
        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 243, 255, 0.2)';
        
        ctx.beginPath();
        
        let startX = -spacing - scrollOffset;
        let startY = points[0] * height;
        ctx.moveTo(startX, startY);

        for (let i = 0; i < points.length - 1; i++) {
            const currentX = (i * spacing) - scrollOffset;
            const currentY = points[i] * height;
            
            const nextX = ((i + 1) * spacing) - scrollOffset;
            const nextY = points[i + 1] * height;
            
            const midX = (currentX + nextX) / 2;
            const midY = (currentY + nextY) / 2;
            
            ctx.quadraticCurveTo(currentX, currentY, midX, midY);
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0; 
        
        // Fill
        const lastIndex = points.length - 1;
        const endX = (lastIndex * spacing) - scrollOffset;
        
        ctx.lineTo(endX, height);
        ctx.lineTo(startX, height);
        ctx.closePath();
        
        const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
        fillGrad.addColorStop(0, 'rgba(0, 243, 255, 0.0)');
        fillGrad.addColorStop(1, 'rgba(188, 19, 254, 0.1)');
        ctx.fillStyle = fillGrad;
        ctx.fill();
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    loop();
})();
