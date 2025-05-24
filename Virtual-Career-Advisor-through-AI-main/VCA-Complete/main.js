// Initialize Three.js background animation
document.addEventListener('DOMContentLoaded', () => {
    initThreeJsBackground();
    initScrollAnimations();
    initMobileMenu();
});

// Three.js Background Animation
function initThreeJsBackground() {
    const backgroundContainer = document.getElementById('background-animation');
    
    // Create scene, camera and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    backgroundContainer.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const positionArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        // Position
        positionArray[i] = (Math.random() - 0.5) * 10;
        
        // Color
        if (i % 3 === 0) {  // R
            colorArray[i] = Math.random() * 0.3 + 0.2;
        } else if (i % 3 === 1) { // G
            colorArray[i] = Math.random() * 0.3 + 0.5;
        } else { // B
            colorArray[i] = Math.random() * 0.5 + 0.5;
        }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.01,
        vertexColors: true,
        transparent: true,
        sizeAttenuation: true,
        opacity: 0.8
    });
    
    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Camera position
    camera.position.z = 4;
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        targetX = mouseX * 0.1;
        targetY = mouseY * 0.1;
        
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05;
        particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const features = document.querySelectorAll('.feature-card');
    
    // Initial animations on load
    setTimeout(() => {
        document.querySelector('#home').classList.add('fade-in');
    }, 100);
    
    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animate feature cards if they're in the entry
                if (entry.target.id === 'features') {
                    features.forEach((feature, index) => {
                        setTimeout(() => {
                            feature.classList.add('fade-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const chatLauncher = document.getElementById('chat-launcher');
    const chatbot = document.getElementById('chatbot');
    const closeChatBtn = document.getElementById('close-chat-btn');

    // Initial state - hidden
    chatbot.classList.add('chat-hidden');

    function openChat() {
        chatbot.classList.add('chat-visible');
        chatbot.classList.remove('chat-hidden');
    }

    function closeChat() {
        chatbot.classList.add('chat-hidden');
        chatbot.classList.remove('chat-visible');
        
        // Optional: Remove visibility after animation
        chatbot.addEventListener('transitionend', () => {
            if (chatbot.classList.contains('chat-hidden')) {
                chatbot.classList.remove('chat-visible');
            }
        }, {once: true});
    }

    // Toggle chat
    chatLauncher.addEventListener('click', openChat);
    closeChatBtn.addEventListener('click', closeChat);

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatbot.contains(e.target) && !chatLauncher.contains(e.target)) {
            closeChat();
        }
    });
    // Auth state management
const authButton = document.getElementById('authButton');
const userGreeting = document.getElementById('userGreeting');

function updateAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        userGreeting.textContent = `Welcome, ${user.username}`;
        userGreeting.classList.remove('hidden');
        authButton.textContent = 'Sign Out';
    } else {
        userGreeting.classList.add('hidden');
        authButton.textContent = 'Sign In';
    }
}

authButton.addEventListener('click', () => {
    if (authButton.textContent === 'Sign Out') {
        localStorage.removeItem('currentUser');
        updateAuthState();
    } else {
        window.location.href = 'auth.html';
    }
});

// Initialize auth state
updateAuthState();
});
