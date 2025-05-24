document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('careerForm');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    
    // Sample career descriptions (in a real app, these would come from your database)
    const careerDescriptions = {
        "Software Engineer": "Develops software applications and systems using programming languages like Python, Java, etc. Involves designing, coding, testing, and maintaining software solutions.",
        "Data Scientist": "Analyzes complex data to extract insights and build predictive models. Uses statistical methods, machine learning, and data visualization techniques.",
        "Cybersecurity Analyst": "Protects systems and networks from cyber threats and vulnerabilities. Implements security measures and monitors for security breaches.",
        "AI/ML Engineer": "Develops artificial intelligence and machine learning systems. Works on algorithms, neural networks, and AI applications.",
        "DevOps Engineer": "Combines software development and IT operations for efficient workflows. Automates processes and manages deployment pipelines.",
        "Cloud Engineer": "Designs, implements, and manages cloud-based systems and infrastructure. Works with platforms like AWS, Azure, or Google Cloud.",
        "Blockchain Developer": "Builds decentralized applications and smart contracts using blockchain technology. Works with platforms like Ethereum.",
        "Game Developer": "Creates video games for various platforms. Involves programming, design, and testing of game mechanics.",
        "Embedded Systems Engineer": "Develops software for embedded devices and hardware systems. Works with microcontrollers and IoT devices.",
        "Full Stack Developer": "Handles both front-end and back-end development of web applications. Works with technologies like React, Node.js, and databases.",
        "Marketing Manager": "Plans and executes marketing campaigns to promote products or services. Analyzes market trends and customer behavior.",
        "Financial Analyst": "Assesses financial data to help businesses make investment decisions. Prepares reports and forecasts.",
        "Journalist": "Researches and reports news stories for various media outlets. Conducts interviews and verifies facts.",
        "Psychologist": "Studies mental processes and behavior to help individuals with psychological issues. Provides therapy and counseling.",
        "School Teacher": "Educates students in various subjects at primary or secondary levels. Develops lesson plans and assesses student progress.",
        "Chef": "Prepares and cooks food in restaurants or other food service establishments. Creates menus and manages kitchen staff.",
        "Artist": "Creates visual art in various mediums like painting, sculpture, or digital art. Expresses ideas and emotions through art.",
        "Business Consultant": "Advises businesses on how to improve performance and efficiency. Analyzes business problems and recommends solutions.",
        "Event Manager": "Plans and organizes events like conferences, weddings, or corporate functions. Coordinates logistics and vendors.",
        "Fashion Designer": "Creates clothing and accessory designs. Selects fabrics and oversees production of designs."
    };
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading animation
        form.style.display = 'none';
        loading.style.display = 'block';
        
        // Simulate API call (in a real app, you would make an actual fetch request to your backend)
        setTimeout(function() {
            loading.style.display = 'none';
            results.style.display = 'block';
            
            // Get form values
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // In a real app, you would send this data to your backend
            // and receive the career recommendations
            console.log("Form data:", data);
            
            // For demo purposes, we'll generate random recommendations
            // based on the education level
            const recommendedCareers = generateRecommendations(data.education);
            
            // Display the primary recommendation
            document.getElementById('primaryCareer').textContent = recommendedCareers[0].career;
            document.getElementById('primaryDescription').textContent = careerDescriptions[recommendedCareers[0].career] || "Description not available.";
            document.getElementById('primaryMatch').textContent = recommendedCareers[0].match + "% Match";
            
            // Animate the percentage bar
            const percentageBar = document.getElementById('primaryPercentage');
            percentageBar.style.width = recommendedCareers[0].match + "%";
            
            // Display alternative recommendations
            for (let i = 1; i <= 5; i++) {
                if (recommendedCareers[i]) {
                    document.getElementById(`altCareer${i}`).textContent = recommendedCareers[i].career;
                    document.getElementById(`altDesc${i}`).textContent = careerDescriptions[recommendedCareers[i].career] || "Description not available.";
                    document.getElementById(`altMatch${i}`).textContent = recommendedCareers[i].match + "% Match";
                }
            }
            
            // Scroll to results
            results.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });
    
    tryAgainBtn.addEventListener('click', function() {
        results.style.display = 'none';
        form.style.display = 'block';
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Helper function to generate demo recommendations based on education
    function generateRecommendations(education) {
        // These would normally come from your ML model
        // For demo, we'll return different careers based on education
        
        const techCareers = [
            { career: "Software Engineer", match: Math.floor(Math.random() * 10) + 85 },
            { career: "Data Scientist", match: Math.floor(Math.random() * 10) + 80 },
            { career: "Cybersecurity Analyst", match: Math.floor(Math.random() * 10) + 75 },
            { career: "AI/ML Engineer", match: Math.floor(Math.random() * 10) + 70 },
            { career: "DevOps Engineer", match: Math.floor(Math.random() * 10) + 65 },
            { career: "Cloud Engineer", match: Math.floor(Math.random() * 10) + 60 }
        ];
        
        const businessCareers = [
            { career: "Marketing Manager", match: Math.floor(Math.random() * 10) + 85 },
            { career: "Financial Analyst", match: Math.floor(Math.random() * 10) + 80 },
            { career: "Business Consultant", match: Math.floor(Math.random() * 10) + 75 },
            { career: "Event Manager", match: Math.floor(Math.random() * 10) + 70 },
            { career: "Human Resource Manager", match: Math.floor(Math.random() * 10) + 65 },
            { career: "Public Relations Specialist", match: Math.floor(Math.random() * 10) + 60 }
        ];
        
        const creativeCareers = [
            { career: "Artist", match: Math.floor(Math.random() * 10) + 85 },
            { career: "Game Developer", match: Math.floor(Math.random() * 10) + 80 },
            { career: "Fashion Designer", match: Math.floor(Math.random() * 10) + 75 },
            { career: "Journalist", match: Math.floor(Math.random() * 10) + 70 },
            { career: "Interior Designer", match: Math.floor(Math.random() * 10) + 65 },
            { career: "Music Producer", match: Math.floor(Math.random() * 10) + 60 }
        ];
        
        const socialCareers = [
            { career: "Psychologist", match: Math.floor(Math.random() * 10) + 85 },
            { career: "School Teacher", match: Math.floor(Math.random() * 10) + 80 },
            { career: "Social Worker", match: Math.floor(Math.random() * 10) + 75 },
            { career: "Counselor", match: Math.floor(Math.random() * 10) + 70 },
            { career: "Personal Trainer", match: Math.floor(Math.random() * 10) + 65 },
            { career: "Nurse", match: Math.floor(Math.random() * 10) + 60 }
        ];
        
        // Determine which career group to use based on education
        let careerGroup;
        
        if (education.includes("CS") || education.includes("IT") || education.includes("Data") || education.includes("AI") || education.includes("Cybersecurity")) {
            careerGroup = techCareers;
        } else if (education.includes("Business") || education.includes("Finance") || education.includes("MBA")) {
            careerGroup = businessCareers;
        } else if (education.includes("Art") || education.includes("Design") || education.includes("Journalism") || education.includes("Game")) {
            careerGroup = creativeCareers;
        } else if (education.includes("Psychology") || education.includes("Education") || education.includes("Social") || education.includes("Counseling")) {
            careerGroup = socialCareers;
        } else {
            // Default to tech careers
            careerGroup = techCareers;
        }
        
        // Shuffle the array and return first 6 items
        return shuffleArray(careerGroup).slice(0, 6);
    }
    
    // Helper function to shuffle an array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});