const knowledgeBase = [
    {
        id: "binary-search",
        title: "Binary Search",
        keywords: ["binary search", "search", "divide and conquer", "sorted", "algorithm"],
        explanation: "Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you've narrowed down the possible locations to just one.",
        simple: "Imagine looking for a name in a phone book. You open it in the middle. If the name is earlier, you ignore the second half. You keep splitting the section in half until you find the name!",
        related: ["Time Complexity", "Stack vs Queue"]
    },
    {
        id: "stack-queue",
        title: "Stack vs Queue",
        keywords: ["stack", "queue", "fifo", "lifo", "data structure"],
        explanation: "A **Stack** follows LIFO (Last-In, First-Out), like a stack of plates. A **Queue** follows FIFO (First-In, First-Out), like a line at a store.",
        simple: "Stack: Like a stack of pancakes (you eat the top one first). Queue: Like a line for ice cream (the first person in line gets the ice cream first).",
        related: ["Binary Search", "Operating Systems"]
    },
    {
        id: "time-complexity",
        title: "Time Complexity",
        keywords: ["time complexity", "big o", "efficiency", "o(n)", "o(1)", "performance"],
        explanation: "Time complexity is a way to describe how much time an algorithm takes to run as the size of the input data increases. We usually use **Big O notation** like O(n) or O(log n) to measure this.",
        simple: "It's like measuring how long it takes to clean your room. If you have twice as much stuff, does it take twice as long (Linear) or does it keep getting much harder?",
        related: ["Binary Search", "Algorithm"]
    },
    {
        id: "operating-systems",
        title: "Operating Systems",
        keywords: ["operating system", "os", "kernel", "process", "memory", "resource"],
        explanation: "An Operating System (OS) is software that manages computer hardware and software resources. It provides common services for computer programs, like managing memory, processes, and file systems.",
        simple: "The OS is like the manager of a restaurant. It makes sure the chef, waiters, and customers all have what they need to work together smoothly.",
        related: ["Stack vs Queue", "Memory Management"]
    }
];

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
        topic.title.toLowerCase().includes(lowerQuery) ||
        topic.keywords.some(k => lowerQuery.includes(k))
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

    const content = isSimpleMode ? topic.simple : topic.explanation;

    answerContainer.innerHTML = `
        <div class="card answer-card">
            <h2>
                ${topic.title}
                <button class="tts-btn" onclick="speakText('${content.replace(/'/g, "\\'")}')" aria-label="Read Aloud">🔊</button>
            </h2>
            <div class="micro-card">
                <p>${content}</p>
            </div>
            <p style="font-size: 0.8rem; margin-top: 1rem; color: var(--accent); font-weight: 800;">
                #${topic.keywords[0]} #Education
            </p>
        </div>
    `;

    // Related topics
    relatedList.innerHTML = '';
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

function showNotFound() {
    answerContainer.innerHTML = `
        <div class="card">
            <h2>Topic Not Found</h2>
            <p>I couldn't find that specific topic. Try searching for <strong>Binary Search</strong> or <strong>Time Complexity</strong>.</p>
        </div>
    `;
    relatedContainer.classList.add('hidden');
}

function resetUI() {
    welcomeScreen.classList.remove('hidden');
    answerContainer.classList.add('hidden');
    relatedContainer.classList.add('hidden');
}

// Accessibility: Text to Speech
function speakText(text) {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Stop current speech
        speechInstance = new SpeechSynthesisUtterance(text);
        speechInstance.rate = 0.9;
        window.speechSynthesis.speak(speechInstance);
    }
}

// Event Listeners
searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

contrastToggle.addEventListener('click', () => {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast');
    contrastToggle.textContent = isHighContrast ? '☀️' : '🌓';
});

simpleToggle.addEventListener('click', () => {
    isSimpleMode = !isSimpleMode;
    simpleToggle.classList.toggle('active');
    simpleToggle.style.background = isSimpleMode ? 'var(--accent)' : 'rgba(255,255,255,0.1)';

    // Refresh current answer if it exists
    if (searchInput.value) handleSearch(searchInput.value);
});

// Quick topic pills
document.querySelectorAll('.topic-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-query');
        searchInput.value = query;
        handleSearch(query);
    });
});
