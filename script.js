/**
 * PORTFÓLIO CONCEIÇÃO RAMOS - SCRIPT.JS
 * Interações Modernas, Efeito Aquático com Peixes Naturais e Responsividade
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. MENU HAMBÚRGUER MOBILE
    // =========================================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-sublink');

    if (hamburgerBtn && mobileMenu) {
        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.contains('open');
            if (isOpen) {
                mobileMenu.classList.remove('open');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                mobileMenu.classList.add('open');
                hamburgerBtn.classList.add('active');
                hamburgerBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden'; // impede scroll de fundo com menu aberto
            }
        };

        hamburgerBtn.addEventListener('click', toggleMenu);

        // Fecha o menu ao clicar em qualquer link de navegação
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });

        // Fecha ao redimensionar para tela grande
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    }

    // =========================================================================
    // 2. HIGHLIGHT DE SEÇÃO ATIVA NA NAVBAR DESKTOP
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link:not(.dropbtn)');

    const highlightActiveNav = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightActiveNav, { passive: true });

    // =========================================================================
    // 3. COPIAR E-MAIL COM FEEDBACK (TOAST)
    // =========================================================================
    const copyEmailCard = document.getElementById('copy-email-card');
    const copyStatusText = document.getElementById('copy-status-text');
    const toast = document.getElementById('toast');
    const emailToCopy = 'conceicao13c@gmail.com';

    if (copyEmailCard) {
        copyEmailCard.addEventListener('click', () => {
            navigator.clipboard.writeText(emailToCopy).then(() => {
                if (copyStatusText) {
                    copyStatusText.textContent = '✓ E-mail copiado!';
                    setTimeout(() => {
                        copyStatusText.textContent = 'Clique para copiar ou abrir ↗';
                    }, 3000);
                }

                if (toast) {
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                }
            }).catch(() => {
                // Fallback caso permissão seja negada
                window.location.href = `mailto:${emailToCopy}`;
            });
        });

        // Acessibilidade por teclado (Enter ou Espaço)
        copyEmailCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyEmailCard.click();
            }
        });
    }

    // =========================================================================
    // 4. SIMULAÇÃO DOS PEIXINHOS (.fish) - MUDANÇA SOMENTE NA HORIZONTAL
    // =========================================================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fishContainer = document.getElementById('fish-container');

    if (!prefersReducedMotion && fishContainer) {
        const isMobile = window.innerWidth <= 768;
        // Quantidade aumentada conforme pedido: 32 peixes no desktop, 18 no mobile
        const FISH_COUNT = isMobile ? 18 : 32;
        const BASE_W = isMobile ? 65 : 80;
        const BASE_H = isMobile ? 45 : 56;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let isMouseActive = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseActive = true;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                mouseX = e.touches[0].clientX;
                mouseY = e.touches[0].clientY;
                isMouseActive = true;
            }
        }, { passive: true });

        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

        const fishesData = [];

        // Cria os peixes com profundidades e tamanhos variados
        for (let i = 0; i < FISH_COUNT; i++) {
            const fishEl = document.createElement('div');
            fishEl.className = 'fish';

            // Variação de tamanho para criar sensação de cardume e profundidade
            const scaleFactor = Math.random() * 0.4 + 0.7; // entre 70% e 110%
            const fishW = Math.round(BASE_W * scaleFactor);
            const fishH = Math.round(BASE_H * scaleFactor);

            fishEl.style.width = `${fishW}px`;
            fishEl.style.height = `${fishH}px`;

            // Variação sutil de profundidade
            const depthOpacity = Math.random() * 0.4 + 0.6;
            fishEl.style.opacity = depthOpacity;

            fishContainer.appendChild(fishEl);

            const x = Math.random() * (window.innerWidth - fishW);
            const y = Math.random() * (window.innerHeight - fishH);

            // Velocidade predominantemente horizontal (nadando para esquerda ou direita)
            const initialDirection = Math.random() > 0.5 ? 1 : -1;
            const horizSpeed = Math.random() * 1.5 + 1.2;
            const vertSpeed = (Math.random() - 0.5) * 0.8; // ondulação vertical suave

            // facing: 1 = olhando para a esquerda (original de peixef.png), -1 = olhando para a direita
            const facing = initialDirection > 0 ? -1 : 1;

            fishesData.push({
                el: fishEl,
                w: fishW,
                h: fishH,
                x: x,
                y: y,
                vx: initialDirection * horizSpeed,
                vy: vertSpeed,
                facing: facing,
                changeTimer: Math.random() * 160 + 100,
                counter: 0
            });
        }

        // Loop de Animação com requestAnimationFrame
        function animateFishes() {
            const winW = window.innerWidth;
            const winH = window.innerHeight;

            fishesData.forEach(fish => {
                fish.counter++;

                // 1) Mudança de direção aleatória suave
                if (fish.counter >= fish.changeTimer) {
                    // Decide nova velocidade horizontal (mudança predominante na horizontal)
                    const speed = Math.random() * 1.6 + 1.1;
                    const dir = Math.random() > 0.4 ? (fish.vx > 0 ? 1 : -1) : (fish.vx > 0 ? -1 : 1);
                    fish.vx = dir * speed;
                    fish.vy = (Math.random() - 0.5) * 0.9; // flutuação vertical leve

                    fish.counter = 0;
                    fish.changeTimer = Math.random() * 200 + 120;
                }

                // 2) Reação de fuga ao mouse ou toque
                if (isMouseActive) {
                    const centerX = fish.x + fish.w / 2;
                    const centerY = fish.y + fish.h / 2;
                    const dx = centerX - mouseX;
                    const dy = centerY - mouseY;
                    const dist = Math.hypot(dx, dy);
                    const detectRadius = 130;

                    if (dist < detectRadius && dist > 0) {
                        const escapeAngle = Math.atan2(dy, dx);
                        const force = ((detectRadius - dist) / detectRadius) * 2.5;
                        fish.vx += Math.cos(escapeAngle) * force;
                        fish.vy += Math.sin(escapeAngle) * (force * 0.6); // menos força vertical para não disparar para fora
                    }
                }

                // Amortecimento
                fish.vx *= 0.985;
                fish.vy *= 0.98;

                // Garante velocidade horizontal mínima para manter o cardume em movimento
                if (Math.abs(fish.vx) < 0.6) {
                    fish.vx = (fish.vx >= 0 ? 1 : -1) * 0.7;
                }

                // Limita a velocidade vertical máxima para mantê-los nadando horizontalmente
                fish.vy = clamp(fish.vy, -1.8, 1.8);

                // Atualiza posições
                fish.x += fish.vx;
                fish.y += fish.vy;

                // 3) Rebate nas bordas da tela
                if (fish.x <= 0) {
                    fish.x = 0;
                    fish.vx = Math.abs(fish.vx);
                    fish.facing = -1; // vira para a direita
                } else if (fish.x >= winW - fish.w) {
                    fish.x = winW - fish.w;
                    fish.vx = -Math.abs(fish.vx);
                    fish.facing = 1;  // vira para a esquerda
                }

                if (fish.y <= 10) {
                    fish.y = 10;
                    fish.vy = Math.abs(fish.vy);
                } else if (fish.y >= winH - fish.h - 10) {
                    fish.y = winH - fish.h - 10;
                    fish.vy = -Math.abs(fish.vy);
                }

                // 4) Orientação estritamente HORIZONTAL (sem nenhuma rotação ou inclinação):
                // Se estiver se movendo para a direita (vx > 0.1), espelha horizontalmente (scaleX(-1))
                // Se estiver se movendo para a esquerda (vx < -0.1), orientação padrão (scaleX(1))
                // O peixe NUNCA vira de cabeça para baixo!
                if (fish.vx > 0.08) {
                    fish.facing = -1; // Olhando para a direita
                } else if (fish.vx < -0.08) {
                    fish.facing = 1;  // Olhando para a esquerda
                }

                // Aplica somente translação e scaleX horizontal
                fish.el.style.transform = `translate3d(${fish.x}px, ${fish.y}px, 0) scaleX(${fish.facing})`;
            });

            requestAnimationFrame(animateFishes);
        }

        requestAnimationFrame(animateFishes);
    }
});