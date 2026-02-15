const knowledgeBase = [
    {
        "subject": "Data Structures",
        "topic": "Array",
        "keywords": ["array", "list", "contiguous", "index", "memory"],
        "definition": "An array is a collection of elements stored in contiguous memory locations and accessed using indices.",
        "explanation": "Arrays store multiple values of the same type in a single structure. Because elements are stored contiguously, accessing any element by index is very fast.",
        "simple": "Like a row of lockers where each locker has a number. You can jump straight to locker #5 instantly, but adding a new locker in the middle means moving everyone else.",
        "example": "int arr[5] = {1,2,3,4,5}; arr[2] returns 3.",
        "complexity": "Access: O(1), Search: O(n), Insertion: O(n), Deletion: O(n)",
        "use_cases": ["Storing lists of data", "Implementing other data structures"],
        "questions": ["What is an array?", "Why are arrays fast for access?", "What are disadvantages of arrays?"],
        "answer": "Arrays allow fast access using indices but have fixed size and slow insertion/deletion.",
        "related": ["Linked List", "Stack", "Queue"]
    },
    {
        "subject": "Data Structures",
        "topic": "Linked List",
        "keywords": ["linked list", "nodes", "pointers", "dynamic", "memory"],
        "definition": "A linked list is a dynamic data structure made of nodes where each node contains data and a pointer to the next node.",
        "explanation": "Unlike arrays, linked lists do not require contiguous memory. They grow dynamically and allow efficient insertion and deletion.",
        "simple": "Like a treasure hunt where each clue tells you where the next one is. You don't need a single big space; you just follow the path.",
        "example": "Node -> Data | Next Pointer",
        "complexity": "Access: O(n), Insertion: O(1), Deletion: O(1)",
        "use_cases": ["Dynamic memory allocation", "Implementing stacks and queues"],
        "questions": ["What is a linked list?", "Difference between array and linked list?"],
        "answer": "Linked lists are dynamic and efficient for insertion, while arrays provide faster access.",
        "related": ["Array", "Stack"]
    },
    {
        "subject": "Algorithms",
        "topic": "Binary Search",
        "keywords": ["binary search", "algorithms", "sorted", "divide and conquer", "log n"],
        "definition": "Binary search is an algorithm used to find an element in a sorted array by repeatedly dividing the search interval in half.",
        "explanation": "Binary search compares the target value to the middle element of the array. If unequal, it eliminates half of the remaining elements and continues the search.",
        "simple": "Searching a name in a dictionary: You open the middle, see if the name is before or after, and ignore the wrong half. Repeat until found.",
        "example": "Search 7 in [1,3,5,7,9] → middle is 5 → search right half.",
        "complexity": "Time: O(log n), Space: O(1)",
        "use_cases": ["Searching in sorted datasets", "Database indexing"],
        "questions": ["How does binary search work?", "What is its time complexity?"],
        "answer": "Binary search reduces the search space by half each step, making it very efficient.",
        "related": ["Time Complexity", "Sorting Algorithms"]
    },
    {
        "subject": "Algorithms",
        "topic": "Time Complexity",
        "keywords": ["time complexity", "big o", "efficiency", "performance", "n squared"],
        "definition": "Time complexity is a way to describe how much time an algorithm takes to run relative to its input size.",
        "explanation": "We use Big O notation (like O(1), O(n), O(log n)) to describe how an algorithm slows down as data grows.",
        "simple": "It's like grading papers. If you grade 1 paper a minute, grading 100 takes 100 mins (Linear). If you have to compare every paper to every other paper, it takes much longer (Quadratic)!",
        "example": "A loop through an array of size N is O(n).",
        "complexity": "O(1) is constant, O(log n) is efficient, O(n) is linear, O(n^2) is slow.",
        "use_cases": ["Comparing algorithms", "Optimizing code performance"],
        "questions": ["What is Big O?", "Is O(1) better than O(n)?"],
        "answer": "Time complexity measures performance scaling. Smaller Big O is generally better.",
        "related": ["Binary Search"]
    },
    {
        "subject": "Operating Systems",
        "topic": "Process",
        "keywords": ["process", "os", "execution", "memory space", "resources"],
        "definition": "A process is a program in execution with its own memory space and resources.",
        "explanation": "Processes are independent and managed by the OS. Each process has a unique ID and allocated memory.",
        "simple": "Think of a process as a chef in their own kitchen. Each chef has their own tools and ingredients, and they don't interfere with other chefs.",
        "example": "Running a browser and a text editor creates separate processes.",
        "complexity": "Context switching overhead exists.",
        "use_cases": ["Multitasking", "Program execution"],
        "questions": ["What is a process?", "What is context switching?"],
        "answer": "A process is an active program. Context switching allows CPU to switch between processes.",
        "related": ["Thread", "CPU Scheduling"]
    },
    {
        "subject": "Operating Systems",
        "topic": "Thread",
        "keywords": ["thread", "multithreading", "execution unit", "lightweight", "shared memory"],
        "definition": "A thread is the smallest unit of execution within a process.",
        "explanation": "Threads share memory within a process, making them lightweight and efficient.",
        "simple": "If a process is a kitchen, threads are multiple cooks working together in that same kitchen, sharing the same stove and ingredients.",
        "example": "A browser tab running multiple threads for loading content.",
        "complexity": "Lower overhead than processes.",
        "use_cases": ["Parallel processing", "Multitasking"],
        "questions": ["Difference between thread and process?"],
        "answer": "Threads share memory and are lightweight; processes are independent.",
        "related": ["Process", "Multithreading"]
    },
    {
        "subject": "Databases",
        "topic": "Normalization",
        "keywords": ["normalization", "database", "redundancy", "dbms", "sql", "integrity"],
        "definition": "Normalization is the process of organizing data in a database to reduce redundancy.",
        "explanation": "It divides large tables into smaller ones and establishes relationships to improve integrity.",
        "simple": "Like organizing your clothes into drawers. Instead of having a giant pile where items repeat, you put shirts in one drawer and pants in another, then cross-reference.",
        "example": "Separating customer and orders tables.",
        "complexity": "Improves efficiency but may require joins.",
        "use_cases": ["Database design", "Reducing redundancy"],
        "questions": ["Why is normalization important?"],
        "answer": "Normalization prevents duplicate data and improves consistency.",
        "related": ["Primary Key", "Foreign Key"]
    },
    {
        "subject": "Computer Networks",
        "topic": "OSI Model",
        "keywords": ["osi model", "networking", "layers", "abstraction", "protocols"],
        "definition": "The OSI model is a framework that standardizes network communication into seven layers.",
        "explanation": "Each layer performs specific functions, enabling interoperability between systems.",
        "simple": "Like sending a physical letter. You write it, put it in an envelope, put a stamp on it, and give it to the mailman. Each step is a layer of the delivery process.",
        "example": "Layer 7: Application, Layer 4: Transport.",
        "complexity": "Conceptual model.",
        "use_cases": ["Network troubleshooting", "Protocol design"],
        "questions": ["What are the OSI layers?"],
        "answer": "Physical, Data Link, Network, Transport, Session, Presentation, Application.",
        "related": ["TCP/IP", "Protocols"]
    },
    {
        "subject": "Compiler Design",
        "topic": "Lexical Analysis",
        "keywords": ["lexical analysis", "compiler", "scanner", "tokens", "source code"],
        "definition": "Lexical analysis is the first phase of a compiler that converts source code into tokens.",
        "explanation": "It scans the code and identifies keywords, identifiers, operators, and symbols.",
        "simple": "Like a librarian scanning a book to pick out all the words. They don't care about the story yet, just making a list of every word found.",
        "example": "int x = 5; → tokens: int, x, =, 5, ;",
        "complexity": "Linear with respect to input size.",
        "use_cases": ["Compiler construction", "Syntax highlighting"],
        "questions": ["What is lexical analysis?", "What are tokens in a compiler?"],
        "answer": "Lexical analysis breaks code into tokens such as keywords and identifiers.",
        "related": ["Parsing", "Syntax Analysis"]
    },
    {
        "subject": "Compiler Design",
        "topic": "Syntax Analysis",
        "keywords": ["syntax analysis", "parsing", "grammar", "parse tree", "compiler"],
        "definition": "Syntax analysis checks if tokens follow the grammar rules of a programming language.",
        "explanation": "It builds a parse tree to represent program structure.",
        "simple": "Like a teacher checking your grammar. The librarian gave them the list of words, and now the teacher checks if they make a proper sentence.",
        "example": "Checking if 'if (x > 0)' follows correct syntax.",
        "complexity": "Depends on parsing algorithm.",
        "use_cases": ["Compiler construction", "Code validation"],
        "questions": ["What is syntax analysis?"],
        "answer": "Syntax analysis verifies the grammatical structure of code.",
        "related": ["Lexical Analysis", "Parse Tree"]
    },
    {
        "subject": "Distributed Systems",
        "topic": "CAP Theorem",
        "keywords": ["cap theorem", "consistency", "availability", "partition tolerance", "distributed systems"],
        "definition": "CAP theorem states that a distributed system can only guarantee two of the following: Consistency, Availability, Partition Tolerance.",
        "explanation": "During network partitions, systems must choose between consistency and availability.",
        "simple": "Imagine a restaurant that's always open (Availability), always gives the exact same menu to everyone (Consistency), and still works if the kitchen loses power (Partition Tolerance). CAP says you can only pick two!",
        "example": "NoSQL databases often choose availability over consistency.",
        "complexity": "Conceptual model.",
        "use_cases": ["Database design", "Cloud systems"],
        "questions": ["What is CAP theorem?"],
        "answer": "CAP theorem explains trade-offs in distributed systems between consistency, availability, and partition tolerance.",
        "related": ["Distributed Databases", "NoSQL"]
    },
    {
        "subject": "Distributed Systems",
        "topic": "Load Balancing",
        "keywords": ["load balancer", "scalability", "traffic", "server", "performance"],
        "definition": "Load balancing distributes workloads across multiple servers to improve performance.",
        "explanation": "It prevents any single server from becoming a bottleneck.",
        "simple": "Like a manager at a grocery store opening more checkout lanes when the line gets too long, so one cashier doesn't get overwhelmed.",
        "example": "Web traffic distributed across multiple servers.",
        "complexity": "Depends on algorithm used.",
        "use_cases": ["Cloud services", "High-traffic websites"],
        "questions": ["What is load balancing?"],
        "answer": "Load balancing spreads traffic across servers to improve reliability and performance.",
        "related": ["Scalability", "Cloud Computing"]
    },
    {
        "subject": "Computer Graphics",
        "topic": "Rasterization",
        "keywords": ["rasterization", "graphics", "pixels", "rendering", "gpu"],
        "definition": "Rasterization converts vector graphics into pixels for display on screens.",
        "explanation": "It determines which pixels correspond to shapes and colors.",
        "simple": "Like turning a connect-the-dots drawing into a coloring book page by filling in all the little square pixels.",
        "example": "Rendering a triangle in a video game.",
        "complexity": "Depends on resolution and object complexity.",
        "use_cases": ["Game development", "3D rendering"],
        "questions": ["What is rasterization?"],
        "answer": "Rasterization converts shapes into pixels for display.",
        "related": ["Rendering", "GPU"]
    },
    {
        "subject": "Blockchain",
        "topic": "Smart Contracts",
        "keywords": ["smart contract", "blockchain", "ethereum", "automation", "cryptography"],
        "definition": "Smart contracts are self-executing programs stored on a blockchain.",
        "explanation": "They automatically enforce agreements without intermediaries.",
        "simple": "Like a vending machine. You put the money in, and it automatically gives you the snack. No shopkeeper needed to verify the deal.",
        "example": "Automatic payment when conditions are met.",
        "complexity": "Depends on contract logic.",
        "use_cases": ["Finance", "Supply chain"],
        "questions": ["What are smart contracts?"],
        "answer": "Smart contracts automatically execute agreements on a blockchain.",
        "related": ["Ethereum", "Cryptography"]
    },
    {
        "subject": "Natural Language Processing",
        "topic": "Tokenization",
        "keywords": ["tokenization", "nlp", "text processing", "ai", "machine learning"],
        "definition": "Tokenization splits text into smaller units such as words or sentences.",
        "explanation": "It is the first step in processing text data.",
        "simple": "Like cutting a long pizza into slices. It's much easier to handle and talk about one slice at a time than the whole pizza.",
        "example": "‘I love AI’ → [I, love, AI]",
        "complexity": "Linear with text length.",
        "use_cases": ["Chatbots", "Search engines"],
        "questions": ["What is tokenization?"],
        "answer": "Tokenization divides text into smaller units for processing.",
        "related": ["Text Processing", "Machine Learning"]
    },
    {
        "subject": "Embedded Systems",
        "topic": "Microcontroller",
        "keywords": ["microcontroller", "arduino", "embedded", "iot", "chip"],
        "definition": "A microcontroller is a compact integrated circuit designed to govern embedded systems.",
        "explanation": "It includes a CPU, memory, and I/O peripherals on a single chip.",
        "simple": "Like the 'brain' inside your microwave. It's not a full PC, but it's perfect for doing one specific job really well.",
        "example": "Arduino boards use microcontrollers.",
        "complexity": "Designed for real-time tasks.",
        "use_cases": ["IoT devices", "Robotics"],
        "questions": ["What is a microcontroller?"],
        "answer": "A microcontroller is a small computer on a chip used in embedded systems.",
        "related": ["Embedded Systems", "Sensors"]
    },
    {
        "subject": "Quantum Computing",
        "topic": "Qubit",
        "keywords": ["qubit", "quantum", "superposition", "computing", "physics"],
        "definition": "A qubit is the basic unit of quantum information.",
        "explanation": "Unlike classical bits, qubits can exist in multiple states simultaneously.",
        "simple": "Like a coin spinning on a table. Before it stops, it's both heads and tails at the same time. This 'spinning' state allows quantum computers to do massive math.",
        "example": "Superposition allows qubits to represent 0 and 1 at the same time.",
        "complexity": "Quantum-level computation.",
        "use_cases": ["Cryptography", "Complex simulations"],
        "questions": ["What is a qubit?"],
        "answer": "A qubit is a quantum bit that can represent multiple states simultaneously.",
        "related": ["Superposition", "Quantum Gates"]
    },
    {
        "subject": "Data Science",
        "topic": "Data Cleaning",
        "keywords": ["data cleaning", "preprocessing", "analytics", "outliers", "data science"],
        "definition": "Data cleaning is the process of removing errors and inconsistencies from datasets.",
        "explanation": "It ensures data quality for analysis and modeling.",
        "simple": "Like washing vegetables before cooking. You want to get rid of the dirt (errors and duplicates) so your meal (analysis) turns out perfect.",
        "example": "Removing duplicate records.",
        "complexity": "Depends on dataset size.",
        "use_cases": ["Machine learning", "Analytics"],
        "questions": ["Why is data cleaning important?"],
        "answer": "Data cleaning improves accuracy and reliability of analysis.",
        "related": ["Data Preprocessing", "Machine Learning"]
    },
    {
        "subject": "Information Retrieval",
        "topic": "Search Index",
        "keywords": ["search index", "indexing", "retrieval", "search engine", "inverted index"],
        "definition": "A search index is a data structure that improves the speed of search queries.",
        "explanation": "It maps keywords to documents for fast retrieval.",
        "simple": "Like the index at the back of a book. Instead of reading every page to find 'Apples', you look at the 'A' section of the index to see exactly which pages mention it.",
        "example": "Google search indexing web pages.",
        "complexity": "Optimized for fast lookup.",
        "use_cases": ["Search engines", "Databases"],
        "questions": ["What is a search index?"],
        "answer": "A search index speeds up data retrieval by organizing searchable terms.",
        "related": ["Inverted Index", "Search Engines"]
    },
    {
        "subject": "Mobile App Development",
        "topic": "Responsive Design",
        "keywords": ["responsive", "mobile", "css", "layout", "design"],
        "definition": "Responsive design ensures apps adapt to different screen sizes.",
        "explanation": "It improves usability across phones, tablets, and desktops.",
        "simple": "Like water in a container. If you pour it into a cup, it takes the shape of the cup. If you pour it into a bowl, it takes the shape of the bowl.",
        "example": "Flexible layouts using CSS media queries.",
        "complexity": "Design strategy.",
        "use_cases": ["Mobile apps", "Web design"],
        "questions": ["What is responsive design?"],
        "answer": "Responsive design adapts layouts for different screen sizes.",
        "related": ["UI Design", "CSS"]
    },
    {
        "subject": "Computer Architecture",
        "topic": "ALU (Arithmetic Logic Unit)",
        "keywords": ["alu", "cpu", "arithmetic", "logic", "processor"],
        "definition": "The ALU is a component of the CPU that performs arithmetic and logical operations.",
        "explanation": "It handles operations like addition, subtraction, comparisons, and bitwise logic. It is essential for executing instructions.",
        "simple": "The ALU is the calculator of the computer. It does all the math and logical checks like 'is A greater than B?'.",
        "example": "Adding two numbers or comparing values in a program.",
        "complexity": "Hardware-level operations occur in clock cycles.",
        "use_cases": ["Mathematical calculations", "Decision making in programs"],
        "questions": ["What is an ALU?", "What operations does the ALU perform?"],
        "answer": "The ALU performs arithmetic and logical operations such as addition, subtraction, and comparisons.",
        "related": ["CPU", "Registers"]
    },
    {
        "subject": "Computer Architecture",
        "topic": "Cache Memory",
        "keywords": ["cache", "l1", "l2", "memory", "speed", "cpu"],
        "definition": "Cache memory is a small, high-speed memory located near the CPU to store frequently accessed data.",
        "explanation": "It reduces access time compared to RAM, improving system performance.",
        "simple": "Like having a small pocket on your shirt for your phone. It's much faster to grab it from there than to walk all the way to your backpack (RAM).",
        "example": "L1, L2, and L3 cache in modern processors.",
        "complexity": "Faster than RAM but smaller in size.",
        "use_cases": ["Speed optimization", "Reducing latency"],
        "questions": ["Why is cache memory important?"],
        "answer": "Cache memory speeds up data access by storing frequently used data close to the CPU.",
        "related": ["RAM", "CPU"]
    },
    {
        "subject": "Theory of Computation",
        "topic": "Regular Expressions",
        "keywords": ["regex", "patterns", "matching", "strings", "text processing"],
        "definition": "Regular expressions are patterns used to match character combinations in strings.",
        "explanation": "They are used in text processing, validation, and search operations.",
        "simple": "Like a super-powered Find and Replace. You can ask for 'any word that starts with A and ends with Z' instead of just a specific word.",
        "example": "Email validation using regex.",
        "complexity": "Depends on pattern; generally efficient for text matching.",
        "use_cases": ["Input validation", "Search tools"],
        "questions": ["What are regular expressions?"],
        "answer": "Regular expressions are patterns used to search and match text.",
        "related": ["Finite Automata", "Parsing"]
    },
    {
        "subject": "Discrete Mathematics",
        "topic": "Logic Gates",
        "keywords": ["logic gates", "and", "or", "xor", "circuits", "boolean"],
        "definition": "Logic gates are basic building blocks of digital circuits that perform logical operations.",
        "explanation": "Common gates include AND, OR, NOT, NAND, NOR, XOR.",
        "simple": "Like switches in a house. An AND gate only turns the light on if BOTH switches are flipped up. An OR gate turns it on if EITHER switch is up.",
        "example": "AND gate outputs 1 only if both inputs are 1.",
        "complexity": "Hardware-level logic.",
        "use_cases": ["Digital circuits", "Computer design"],
        "questions": ["What are logic gates?"],
        "answer": "Logic gates perform basic logical operations in digital systems.",
        "related": ["Boolean Algebra", "Circuits"]
    },
    {
        "subject": "Artificial Intelligence",
        "topic": "Search Algorithms in AI",
        "keywords": ["search", "ai", "a*", "bfs", "dfs", "heuristics"],
        "definition": "AI search algorithms explore possible states to find solutions to problems.",
        "explanation": "Examples include Breadth-First Search, Depth-First Search, and A*.",
        "simple": "Imagine being in a maze. A search algorithm is the strategy you use to find the exit—like always turning right, or checking every path one by one.",
        "example": "Pathfinding in games using A* algorithm.",
        "complexity": "Varies by algorithm.",
        "use_cases": ["Game AI", "Robotics", "Navigation systems"],
        "questions": ["What is A* algorithm?"],
        "answer": "A* is a search algorithm that finds the shortest path using heuristics.",
        "related": ["Graph Theory", "Heuristics"]
    },
    {
        "subject": "Machine Learning",
        "topic": "Supervised Learning",
        "keywords": ["supervised learning", "ml", "labeled data", "training", "prediction"],
        "definition": "Supervised learning is a machine learning approach where models learn from labeled data.",
        "explanation": "The model is trained using input-output pairs to predict outcomes for new data.",
        "simple": "Like a teacher showing a student flashcards with pictures of cats and dogs. After seeing enough labeled examples, the student can identify them on their own.",
        "example": "Spam email classification.",
        "complexity": "Depends on algorithm and dataset size.",
        "use_cases": ["Prediction systems", "Classification tasks"],
        "questions": ["What is supervised learning?"],
        "answer": "Supervised learning uses labeled data to train models for prediction.",
        "related": ["Unsupervised Learning", "Neural Networks"]
    },
    {
        "subject": "Cybersecurity",
        "topic": "Phishing",
        "keywords": ["phishing", "security", "scam", "social engineering", "frauds"],
        "definition": "Phishing is a cyber attack where attackers trick users into revealing sensitive information.",
        "explanation": "It often involves fake emails or websites that mimic trusted sources.",
        "simple": "Like a fake fisherman casting a hook. They send a fake email that looks like your bank, hoping you'll 'bite' by entering your password on their fake site.",
        "example": "Fake bank login page asking for credentials.",
        "complexity": "Social engineering attack.",
        "use_cases": ["Security awareness", "Fraud prevention"],
        "questions": ["What is phishing?"],
        "answer": "Phishing is a scam to steal sensitive information by impersonating trusted entities.",
        "related": ["Malware", "Social Engineering"]
    },
    {
        "subject": "Web Development",
        "topic": "REST API",
        "keywords": ["rest", "api", "http", "json", "get", "post"],
        "definition": "A REST API is a web service that follows REST principles to allow communication between systems.",
        "explanation": "It uses HTTP methods like GET, POST, PUT, DELETE.",
        "simple": "Like a waiter in a restaurant. You (the client) tell the waiter (API) what you want. The waiter takes the request to the kitchen (server) and brings the food (data) back to you.",
        "example": "Fetching user data using GET /users.",
        "complexity": "Stateless communication.",
        "use_cases": ["Web apps", "Mobile apps"],
        "questions": ["What is a REST API?"],
        "answer": "A REST API enables systems to communicate over HTTP using standard methods.",
        "related": ["HTTP", "JSON"]
    },
    {
        "subject": "Cloud Computing",
        "topic": "Virtualization",
        "keywords": ["virtualization", "cloud", "hypervisor", "vm", "hardware abstraction"],
        "definition": "Virtualization is the creation of virtual versions of hardware resources.",
        "explanation": "It allows multiple operating systems to run on a single physical machine.",
        "simple": "Like splitting a large house into multiple separate apartments. Each apartment (VM) thinks it's a whole house, but they all share the same building foundation.",
        "example": "Running Linux on a Windows PC using a virtual machine.",
        "complexity": "Managed by hypervisors.",
        "use_cases": ["Cloud infrastructure", "Testing environments"],
        "questions": ["What is virtualization?"],
        "answer": "Virtualization allows multiple virtual systems to run on one physical machine.",
        "related": ["Hypervisor", "Cloud Services"]
    },
    {
        "subject": "DevOps",
        "topic": "Containerization",
        "keywords": ["container", "docker", "devops", "kubernetes", "isolation"],
        "definition": "Containerization packages applications and dependencies into containers for consistent deployment.",
        "explanation": "Containers ensure applications run the same across different environments.",
        "simple": "Like a shipping container. You pack everything the app needs inside. No matter if the ship is a truck, a boat, or a plane, the contents stay exactly the same and safe inside.",
        "example": "Docker containers.",
        "complexity": "Lightweight compared to virtual machines.",
        "use_cases": ["Microservices", "Cloud deployment"],
        "questions": ["What is containerization?"],
        "answer": "Containerization packages apps with dependencies for consistent deployment.",
        "related": ["Docker", "Kubernetes"]
    },
    {
        "subject": "Human-Computer Interaction",
        "topic": "Usability",
        "keywords": ["usability", "ux", "design", "hci", "user interface"],
        "definition": "Usability measures how easy and efficient it is for users to interact with a system.",
        "explanation": "Good usability improves user satisfaction and productivity.",
        "simple": "Like a well-designed door handle. If you can tell whether to push or pull just by looking at it, it has good usability. If you have to struggle, it's poor design.",
        "example": "Simple navigation in a mobile app.",
        "complexity": "Evaluated through user testing.",
        "use_cases": ["UX design", "Accessibility"],
        "questions": ["What is usability?"],
        "answer": "Usability refers to how easy and efficient a system is to use.",
        "related": ["Accessibility", "User Experience"]
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

    const content = isSimpleMode ? topic.simple : topic.explanation;

    answerContainer.innerHTML = `
        <div class="card answer-card">
            <div class="topic-meta">${topic.subject}</div>
            <h2>
                ${topic.topic}
                <div class="card-actions">
                    <button class="tts-btn" onclick="speakText('${(isSimpleMode ? topic.simple : topic.definition + '. ' + topic.explanation).replace(/'/g, "\\'")}')" aria-label="Read Aloud">🔊</button>
                </div>
            </h2>
            <div class="micro-card">
                <p><strong>Definition:</strong> ${topic.definition}</p>
            </div>
            <div class="micro-card accent-card">
                <p><strong>${isSimpleMode ? 'Simple View' : 'Inside the Topic'}:</strong> ${content}</p>
            </div>
            <div class="micro-card example-card">
                <p><strong>Example:</strong> <code>${topic.example}</code></p>
            </div>
            <div class="complexity-badge">Efficiency Info: ${topic.complexity}</div>
            
            <div class="questions-section">
                <h3>Test Your Knowledge:</h3>
                <ul>
                    ${topic.questions.map(q => `<li>${q}</li>`).join('')}
                </ul>
                <div class="quick-answer">
                    <strong>The Bottom Line:</strong> ${topic.answer}
                </div>
            </div>
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
            <p>I couldn't find that specific topic. Try searching for <strong>Binary Search</strong>, <strong>Phishing</strong>, or <strong>REST API</strong>.</p>
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
        window.speechSynthesis.cancel();
        speechInstance = new SpeechSynthesisUtterance(text);
        speechInstance.rate = 1.0;
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
    simpleToggle.style.background = isSimpleMode ? '#10b981' : 'rgba(255,255,255,0.1)';
    simpleToggle.style.color = 'white';

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
