document.addEventListener('DOMContentLoaded', () => {
    // Quiz elements
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizIntro = document.getElementById('quiz-intro');
    const quizContainer = document.getElementById('quiz-container');
    const questionContainer = document.getElementById('question-container');
    const quizProgress = document.getElementById('quiz-progress');
    const prevQuestionBtn = document.getElementById('prev-question-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const quizResults = document.getElementById('quiz-results');
    const resultsContent = document.getElementById('results-content');
    const careerMatches = document.getElementById('career-matches');
    const retakeQuizBtn = document.getElementById('retake-quiz-btn');
    const chatAboutResultsBtn = document.getElementById('chat-about-results-btn');
    
    // Quiz questions data
    const quizQuestions = [
        {
            id: 1,
            question: "Which of these activities do you enjoy the most?",
            options: [
                "Solving complex problems and puzzles",
                "Helping and teaching others",
                "Creating art or designing things",
                "Leading teams and making decisions",
                "Working with data and details"
            ]
        },
        {
            id: 2,
            question: "What's your preferred work environment?",
            options: [
                "A dynamic, fast-paced setting with constant changes",
                "A collaborative team environment",
                "A creative and flexible workspace",
                "A structured and organized environment",
                "Working independently with minimal supervision"
            ]
        },
        {
            id: 3,
            question: "Which skill would you most like to develop further?",
            options: [
                "Technical skills (coding, engineering, etc.)",
                "Communication and interpersonal skills",
                "Creative and artistic expression",
                "Leadership and management abilities",
                "Analytical and problem-solving skills"
            ]
        },
        {
            id: 4,
            question: "What motivates you the most in your work?",
            options: [
                "Making a positive impact on society",
                "Financial security and stability",
                "Creative freedom and expression",
                "Recognition and advancement opportunities",
                "Intellectual challenges and continuous learning"
            ]
        },
        {
            id: 5,
            question: "How do you approach new challenges?",
            options: [
                "By carefully planning and analyzing before acting",
                "By collaborating with others to find solutions",
                "By trying creative and unconventional approaches",
                "By taking charge and making decisive actions",
                "By following established processes and best practices"
            ]
        },
        {
            id: 6,
            question: "Which of these values is most important to you in a career?",
            options: [
                "Work-life balance",
                "Making a difference",
                "Innovation and creativity",
                "Security and stability",
                "Growth and advancement"
            ]
        },
        {
            id: 7,
            question: "How do you prefer to receive feedback?",
            options: [
                "Detailed written feedback with specific examples",
                "In a one-on-one conversation",
                "Through open, creative discussion",
                "Direct and straightforward",
                "With clear metrics and benchmarks"
            ]
        },
        {
            id: 8,
            question: "Which best describes your ideal workday?",
            options: [
                "Solving different problems throughout the day",
                "Interacting with and helping many people",
                "Working on creative projects with flexibility",
                "Leading meetings and making strategic decisions",
                "Focusing deeply on detailed tasks"
            ]
        },
        {
            id: 9,
            question: "What kind of projects energize you?",
            options: [
                "Those requiring technical expertise and innovation",
                "Projects that directly help people",
                "Creative initiatives with aesthetic components",
                "Those involving strategic planning and coordination",
                "Projects requiring precision and attention to detail"
            ]
        },
        {
            id: 10,
            question: "How do you prefer to learn new skills?",
            options: [
                "Through self-directed study and research",
                "By learning from experienced mentors",
                "Through hands-on experimentation",
                "By taking formal courses or training",
                "Through systematic practice and repetition"
            ]
        }
    ];
    
    // Career paths based on scoring patterns
    const careerPaths = [
        {
            type: "Tech & Innovation",
            icon: "fas fa-code",
            careers: [
                "Software Developer",
                "Data Scientist",
                "UX/UI Designer",
                "Systems Engineer",
                "AI Specialist"
            ],
            description: "You have a strong aptitude for technical problem-solving and innovation. You thrive when working on complex challenges that require analytical thinking and creativity."
        },
        {
            type: "Human Services",
            icon: "fas fa-hands-helping",
            careers: [
                "Counselor",
                "Human Resources Manager",
                "Social Worker",
                "Teacher/Educator",
                "Healthcare Administrator"
            ],
            description: "You derive satisfaction from helping others. Your empathy and communication skills make you well-suited for careers that involve supporting people's wellbeing and development."
        },
        {
            type: "Creative & Design",
            icon: "fas fa-paint-brush",
            careers: [
                "Graphic Designer",
                "Content Creator",
                "Marketing Specialist",
                "Product Designer",
                "Digital Media Artist"
            ],
            description: "Your creative vision and artistic sensibilities drive you. You excel in environments where you can innovate and express ideas through visual and conceptual design."
        },
        {
            type: "Leadership & Management",
            icon: "fas fa-briefcase",
            careers: [
                "Project Manager",
                "Business Analyst",
                "Entrepreneur",
                "Operations Manager",
                "Executive Leadership"
            ],
            description: "You have natural leadership abilities and strategic thinking skills. You're adept at coordinating teams and making decisions that drive organizational success."
        },
        {
            type: "Analysis & Research",
            icon: "fas fa-chart-line",
            careers: [
                "Financial Analyst",
                "Market Researcher",
                "Data Analyst",
                "Scientific Researcher",
                "Policy Analyst"
            ],
            description: "You excel at detailed analysis and methodical investigation. Your ability to process complex information and identify patterns makes you valuable in research-intensive roles."
        }
    ];
    
    // Quiz state
    let currentQuestion = 0;
    let userAnswers = [];
    let quizStarted = false;
    
    // Start the quiz
    startQuizBtn.addEventListener('click', () => {
        quizIntro.style.display = 'none';
        quizContainer.classList.remove('hidden');
        userAnswers = new Array(quizQuestions.length).fill(null);
        currentQuestion = 0;
        loadQuestion(currentQuestion);
        quizStarted = true;
    });
    
    // Load a question
    function loadQuestion(index) {
        const question = quizQuestions[index];
        questionContainer.innerHTML = `
            <h3 class="text-xl font-bold text-white mb-6">Question ${index + 1} of ${quizQuestions.length}</h3>
            <p class="text-lg text-white mb-6">${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, i) => `
                    <div class="quiz-option ${userAnswers[index] === i ? 'selected' : ''}" data-index="${i}">
                        ${option}
                    </div>
                `).join('')}
            </div>
        `;
        
        // Update progress bar
        quizProgress.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;
        
        // Enable/disable navigation buttons
        prevQuestionBtn.disabled = index === 0;
        prevQuestionBtn.classList.toggle('opacity-50', index === 0);
        prevQuestionBtn.classList.toggle('cursor-not-allowed', index === 0);
        
        if (userAnswers[index] === null) {
            nextQuestionBtn.textContent = 'Skip';
        } else {
            nextQuestionBtn.textContent = index === quizQuestions.length - 1 ? 'See Results' : 'Next';
        }
        
        // Add event listeners to options
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Store answer
                userAnswers[currentQuestion] = parseInt(option.dataset.index);
                
                // Update next button text
                nextQuestionBtn.textContent = currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next';
            });
        });
    }
    
    // Navigation buttons
    prevQuestionBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion(currentQuestion);
        }
    });
    
    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            loadQuestion(currentQuestion);
        } else {
            showResults();
        }
    });
    
    // Calculate quiz results
    function calculateResults() {
        // Count points for each career type based on answers
        const scores = [0, 0, 0, 0, 0]; // Tech, Human, Creative, Leadership, Analysis
        
        userAnswers.forEach((answer, qIndex) => {
            if (answer !== null) {
                // Each answer adds a point to a corresponding career type
                // This is simplified; a real implementation would have a more complex scoring algorithm
                scores[answer]++;
            }
        });
        
        // Find top two career types
        const results = scores.map((score, index) => ({
            type: careerPaths[index],
            score: score
        })).sort((a, b) => b.score - a.score);
        
        return results.slice(0, 2); // Return top two matches
    }
    
    // Show quiz results
    function showResults() {
        const results = calculateResults();
        quizContainer.classList.add('hidden');
        quizResults.classList.remove('hidden');
        
        // Display personality profile
        resultsContent.innerHTML = `
            <div class="text-center mb-8">
                <div class="inline-block p-4 bg-white bg-opacity-10 rounded-full mb-4">
                    <i class="${results[0].type.icon} text-4xl text-emerald-400"></i>
                </div>
                <h3 class="text-2xl font-bold text-white mb-3">Your Career Profile</h3>
                <p class="text-lg text-white opacity-80">
                    You align most strongly with <span class="text-emerald-400 font-bold">${results[0].type.type}</span> careers, 
                    with elements of <span class="text-emerald-400 font-bold">${results[1].type.type}</span>.
                </p>
            </div>
            <p class="text-white mb-4">${results[0].type.description}</p>
            <p class="text-white">You also show strengths that would benefit you in ${results[1].type.type} roles: ${results[1].type.description}</p>
        `;
        
        // Display career matches
        careerMatches.innerHTML = '';
        
        // Primary career matches
        results[0].type.careers.forEach(career => {
            careerMatches.innerHTML += `
                <div class="career-match-item">
                    <div class="career-match-icon">
                        <i class="${results[0].type.icon}"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-white">${career}</h4>
                        <p class="text-white opacity-70 text-sm">Primary match</p>
                    </div>
                </div>
            `;
        });
        
        // Add top 2 from secondary match
        results[1].type.careers.slice(0, 2).forEach(career => {
            careerMatches.innerHTML += `
                <div class="career-match-item">
                    <div class="career-match-icon">
                        <i class="${results[1].type.icon}"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-white">${career}</h4>
                        <p class="text-white opacity-70 text-sm">Secondary match</p>
                    </div>
                </div>
            `;
        });
    }
    
    // Retake quiz
    retakeQuizBtn.addEventListener('click', () => {
        quizResults.classList.add('hidden');
        quizIntro.style.display = 'block';
        userAnswers = [];
        currentQuestion = 0;
    });
    
    // Chat about results
    chatAboutResultsBtn.addEventListener('click', () => {
        const results = calculateResults();
        const chatbot = document.getElementById('chatbot');
        const chatMessages = document.getElementById('chat-messages');
        
        // Show chat and add a message about results
        chatbot.classList.remove('hidden');
        chatbot.classList.add('slide-in-right');
        
        // Add a message from the bot about the results
        const message = document.createElement('div');
        message.classList.add('bot-message', 'message');
        message.innerHTML = `
            Based on your quiz results, you've shown a strong alignment with ${results[0].type.type} careers. 
            Would you like to know more about specific career paths in this field or discuss how to prepare for them?
        `;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
});