const knowledgeBase = [
    // --- CORE CONCEPTS ---
    {
        "subject": "Data Structures",
        "topic": "Array",
        "keywords": ["array", "list", "contiguous", "index", "memory"],
        "definition": "An array is a collection of elements stored in contiguous memory locations.",
        "explanation": "Arrays store multiple values of the same type in a single structure. Accessing any element by index is O(1).",
        "simple": "Like a row of lockers where each locker has a number. Fast to jump to a number, slow to add a new locker in the middle.",
        "complexity": "Access: O(1), Search: O(n)",
        "related": ["Linked List", "Stack"]
    },
    {
        "subject": "Algorithms",
        "topic": "Binary Search",
        "keywords": ["binary search", "divide and conquer", "sorted"],
        "definition": "Algorithm used to find an element in a sorted array by halving the interval.",
        "explanation": "Compares target to middle; eliminates half repeatedly.",
        "complexity": "Time: O(log n)",
        "simple": "Searching a name in a dictionary by opening the middle and narrowing down.",
        "related": ["Time Complexity", "Linear Search"]
    },

    // --- EXPERT Q&A INTEGRATION (SOFTWARE ENGINEERING) ---
    { "subject": "Software Engineering", "topic": "What is software engineering?", "keywords": ["software engineering"], "answer": "The systematic approach to designing, developing, testing, deploying, and maintaining software using engineering principles." },
    { "subject": "Software Engineering", "topic": "What is the SDLC?", "keywords": ["sdlc", "phases"], "answer": "The Software Development Life Cycle is a process for building software: requirements, design, implementation, testing, deployment, and maintenance." },
    { "subject": "Software Engineering", "topic": "What is Agile?", "keywords": ["agile"], "answer": "Agile is an iterative development methodology focusing on collaboration, flexibility, and delivering small functional increments." },
    { "subject": "Software Engineering", "topic": "What is Scrum?", "keywords": ["scrum", "sprints"], "answer": "Scrum is an Agile framework where work is divided into sprints, with roles like Product Owner and Scrum Master." },
    { "subject": "Software Engineering", "topic": "What is version control?", "keywords": ["git", "version control"], "answer": "Version control tracks changes to code, allowing collaboration and rollback. Git is the most widely used system." },

    // --- OPERATING SYSTEMS ADVANCED ---
    { "subject": "Operating Systems", "topic": "What is a system call?", "keywords": ["system call"], "answer": "A system call is an interface between a program and the OS kernel for performing low-level operations." },
    { "subject": "Operating Systems", "topic": "What is virtual memory?", "keywords": ["virtual memory"], "answer": "Virtual memory allows programs to use more memory than physically available by using disk space as an extension." },
    { "subject": "Operating Systems", "topic": "What is paging?", "keywords": ["paging"], "answer": "Paging divides memory into fixed-size blocks called pages to manage memory efficiently." },
    { "subject": "Operating Systems", "topic": "What is thrashing?", "keywords": ["thrashing"], "answer": "Thrashing occurs when excessive paging causes performance degradation due to constant swapping." },

    // --- AI & MACHINE LEARNING ---
    { "subject": "AI", "topic": "What is machine learning?", "keywords": ["machine learning", "ml"], "answer": "Machine learning is a subset of AI where systems learn patterns from data to make predictions." },
    { "subject": "AI", "topic": "What is supervised learning?", "keywords": ["supervised learning"], "answer": "Supervised learning uses labeled data to train models for prediction or classification." },
    { "subject": "AI", "topic": "What is overfitting?", "keywords": ["overfitting"], "answer": "Overfitting occurs when a model learns noise instead of patterns, performing poorly on new data." },

    // --- CYBERSECURITY ---
    { "subject": "Cybersecurity", "topic": "What is encryption?", "keywords": ["encryption"], "answer": "Encryption converts data into a secure format to prevent unauthorized access." },
    { "subject": "Cybersecurity", "topic": "What is hashing?", "keywords": ["hashing"], "answer": "Hashing converts data into a fixed-length value used for integrity and password storage." },
    { "subject": "Cybersecurity", "topic": "What is phishing?", "keywords": ["phishing"], "answer": "Phishing is a social engineering attack where attackers trick users into revealing sensitive information." },

    // --- CLOUD & DEVOPS ---
    { "subject": "Cloud Computing", "topic": "What is cloud computing?", "keywords": ["cloud computing"], "answer": "Cloud computing delivers computing services like storage and servers over the internet." },
    { "subject": "DevOps", "topic": "What is containerization?", "keywords": ["containerization", "docker"], "answer": "Containerization packages applications and dependencies into containers for consistent deployment." },

    // --- EMERGING TECH ---
    { "subject": "Blockchain", "topic": "What is a smart contract?", "keywords": ["smart contract", "blockchain"], "answer": "A smart contract is a self-executing contract with rules written in code, typically on a blockchain." },
    { "subject": "IoT", "topic": "What is IoT?", "keywords": ["iot", "internet of things"], "answer": "The Internet of Things connects physical devices to the internet to collect and exchange data." },
    { "subject": "Quantum", "topic": "What is a qubit?", "keywords": ["qubit", "quantum computing"], "answer": "A qubit is the basic unit of quantum information, capable of representing multiple states simultaneously via superposition." }
];

// Combine definitions/explanations into a single view for QA entries
knowledgeBase.forEach(item => {
    if (item.answer && !item.explanation) {
        item.explanation = item.answer;
        item.definition = "Expert Answer";
    }
});

// State Management
let isHighContrast = false;
let isSimpleMode = false;
let speechInstance = null;

// DOM Elements
const searchInput = document.getElementById('search-input');
const welcomeScreen = document.getElementById('welcome-screen');
const answerContainer = document.getElementById('answer-container');
const relatedContainer = document.getElementById('related-container');
const relatedList = document.getElementById('related-list');
const contrastToggle = document.getElementById('contrast-toggle');
const simpleToggle = document.getElementById('simple-mode-toggle');

// Core Logic: Search
function handleSearch(query) {
    if (!query.trim()) {
        resetUI();
        return;
    }

    const lowerQuery = query.toLowerCase();
    const result = knowledgeBase.find(topic =>
        topic.topic.toLowerCase().includes(lowerQuery) ||
        topic.keywords.some(k => lowerQuery.includes(k)) ||
        topic.subject.toLowerCase().includes(lowerQuery)
    );

    if (result) {
        displayResult(result);
    } else {
        showNotFound();
    }
}

function displayResult(topic) {
    welcomeScreen.classList.add('hidden');
    answerContainer.classList.remove('hidden');
    relatedContainer.classList.remove('hidden');

    const content = isSimpleMode ? (topic.simple || topic.explanation) : topic.explanation;

    answerContainer.innerHTML = `
        <div class="card answer-card">
            <div class="topic-meta">${topic.subject}</div>
            <h2>
                ${topic.topic}
                <div class="card-actions">
                    <button class="tts-btn" onclick="speakText('${(isSimpleMode ? (topic.simple || content) : (topic.definition || '') + '. ' + content).replace(/'/g, "\\'")}')" aria-label="Read Aloud">🔊</button>
                </div>
            </h2>
            ${topic.definition ? `
            <div class="micro-card">
                <p><strong>Info:</strong> ${topic.definition}</p>
            </div>` : ''}
            <div class="micro-card accent-card">
                <p><strong>${isSimpleMode ? 'Simple Mode' : 'Content'}:</strong> ${content}</p>
            </div>
            ${topic.example ? `
            <div class="micro-card example-card">
                <p><strong>Example:</strong> <code>${topic.example}</code></p>
            </div>` : ''}
            <div class="complexity-badge">${topic.complexity ? 'Complexity: ' + topic.complexity : 'Master Topic'}</div>
        </div>
    `;

    // Related topics
    relatedList.innerHTML = '';
    if (topic.related) {
        topic.related.forEach(rel => {
            const btn = document.createElement('button');
            btn.className = 'topic-pill';
            btn.textContent = rel;
            btn.onclick = () => {
                searchInput.value = rel;
                handleSearch(rel);
            };
            relatedList.appendChild(btn);
        });
    }
}

function showNotFound() {
    const query = searchInput.value;
    const apiKey = localStorage.getItem('openrouter_api_key');

    if (!apiKey) {
        answerContainer.innerHTML = `
            <div class="card">
                <h2>Not Found</h2>
                <p>I couldn't find that exact question. Try searching for **Agile**, **SDLC**, or **Virtual Memory**.</p>
                <div class="micro-card" style="margin-top: 1rem; background: rgba(16, 185, 129, 0.1);">
                    <p>💡 <strong>Pro Tip:</strong> Add an OpenRouter API Key in settings to enable Advanced AI search!</p>
                </div>
            </div>
        `;
    } else {
        answerContainer.innerHTML = `
            <div class="card">
                <h2>Thinking...</h2>
                <p>I couldn't find matches in my offline database. Asking the Global AI Core...</p>
                <div class="loading-spinner"></div>
            </div>
        `;
        callOpenRouter(query, apiKey);
    }
    relatedContainer.classList.add('hidden');
}

async function callOpenRouter(query, apiKey) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.origin,
                "X-Title": "Study Buddy Lite",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openrouter/free",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful Computer Science Study Buddy. Provide concise, accurate academic explanations. Use markdown."
                    },
                    {
                        "role": "user",
                        "content": query
                    }
                ]
            })
        });

        const data = await response.json();
        if (data.choices && data.choices[0].message) {
            const aiContent = data.choices[0].message.content;
            displayAIResult(query, aiContent);
        } else {
            throw new Error("Invalid response");
        }
    } catch (err) {
        answerContainer.innerHTML = `
            <div class="card error-card">
                <h2>AI Connection Failed</h2>
                <p>Check your API key or internet connection. Falling back to offline mode.</p>
            </div>
        `;
    }
}

function displayAIResult(query, content) {
    answerContainer.innerHTML = `
        <div class="card answer-card ai-card">
            <div class="topic-meta">Global AI Core</div>
            <h2>
                ${query}
                <div class="card-actions">
                    <button class="tts-btn" onclick="speakText('${content.replace(/'/g, "\\'")}')" aria-label="Read Aloud">🔊</button>
                </div>
            </h2>
            <div class="micro-card accent-card">
                <p>${content}</p>
            </div>
            <div class="complexity-badge">Powered by OpenRouter/Free</div>
        </div>
    `;
}

function resetUI() {
    welcomeScreen.classList.remove('hidden');
    answerContainer.classList.add('hidden');
    relatedContainer.classList.add('hidden');
}

// TTS
function speakText(text) {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        speechInstance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speechInstance);
    }
}

// Listeners
searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

contrastToggle.addEventListener('click', () => {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast');
    contrastToggle.textContent = isHighContrast ? '☀️' : '🌓';
});

simpleToggle.addEventListener('click', () => {
    isSimpleMode = !isSimpleMode;
    simpleToggle.style.background = isSimpleMode ? '#10b981' : 'rgba(255,255,255,0.1)';
    if (searchInput.value) handleSearch(searchInput.value);
});

const settingsBtn = document.getElementById('settings-btn');

settingsBtn.addEventListener('click', () => {
    const currentKey = localStorage.getItem('openrouter_api_key') || '';
    const newKey = prompt('Enter your OpenRouter API Key:', currentKey);
    if (newKey !== null) {
        localStorage.setItem('openrouter_api_key', newKey.trim());
        if (newKey) alert('API Key Saved! AI Core Enabled.');
    }
});

document.querySelectorAll('.topic-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-query');
        if (query) {
            searchInput.value = query;
            handleSearch(query);
        }
    });
});
