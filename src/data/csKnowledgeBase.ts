export interface CSConcept {
    id: string;
    semester: number;
    topic: string;
    keywords: string[];
    explanation: string;
    related?: string[];
}

export const csKnowledgeBase: CSConcept[] = [
    // Semester 1: Programming Fundamentals & ITC
    {
        id: 'pf-001',
        semester: 1,
        topic: 'Programming Fundamentals',
        keywords: ['programming', 'coding', 'structure', 'syntax', 'logic'],
        explanation: '**Programming Fundamentals** is the foundation of CS. It covers basic concepts like:\n\n*   **Variables:** Storing data (e.g., `int x = 5`).\n*   **Control Structures:** Making decisions (`if/else`) and repeating actions (`loops`).\n*   **Functions:** Reusable blocks of code.\n*   **Arrays:** Storing lists of items.\n\nThink of it as learning the grammar of a language before writing a novel.',
        related: ['Variables', 'Loops', 'Functions']
    },
    {
        id: 'pf-002',
        semester: 1,
        topic: 'Variables',
        keywords: ['variable', 'int', 'string', 'float', 'data type'],
        explanation: 'A **Variable** is like a labeled box where you can store information. \n\n*   `int age = 20;` (Box named "age" holds a number)\n*   `string name = "Alice";` (Box named "name" holds text)\n\nThe type of box determines what you can put inside (e.g., you can\'t put text in a number box).',
    },
    {
        id: 'itc-001',
        semester: 1,
        topic: 'Introduction to Computing',
        keywords: ['computer', 'hardware', 'software', 'history', 'binary'],
        explanation: '**ITC** covers how computers effectively work:\n\n*   **Binary System:** Computers only understand `0`s and `1`s.\n*   **Hardware vs Software:** Physical parts vs Programs.\n*   **Operating Systems:** The manager of the computer (like Windows, Linux).',
    },

    // Semester 2: OOP & discrete structures
    {
        id: 'oop-001',
        semester: 2,
        topic: 'Object Oriented Programming (OOP)',
        keywords: ['oop', 'object', 'class', 'inheritance', 'polymorphism', 'encapsulation'],
        explanation: '**OOP** is a paradigm based on "objects" which contain data and code.\n\n**Core Pillars:**\n1.  **Encapsulation:** Hiding internal details (like a capsule).\n2.  **Inheritance:** Creating new classes from existing ones (Parent -> Child).\n3.  **Polymorphism:** One name, many forms (e.g., a `speak()` function can meow for a Cat and bark for a Dog).\n4.  **Abstraction:** Showing only essential features.',
    },
    {
        id: 'oop-002',
        semester: 2,
        topic: 'Classes and Objects',
        keywords: ['class', 'object', 'instance'],
        explanation: 'Think of a **Class** as a Blueprint (e.g., Car Design) and an **Object** as the actual thing built from it (e.g., That specific Red Toyota).\n\n```cpp\nclass Car { ... }; // The plan\nCar myCar; // The object\n```',
    },

    // Semester 3: Data Structures & Algorithms (DSA)
    {
        id: 'dsa-001',
        semester: 3,
        topic: 'Data Structures',
        keywords: ['data structure', 'array', 'linked list', 'stack', 'queue', 'tree', 'graph'],
        explanation: '**Data Structures** are ways to organize data so it can be used efficiently.\n\n*   **Arrays:** Elements in a row (fast access).\n*   **Linked Lists:** Elements chained together (flexible size).\n*   **Stacks:** LIFO (Last In, First Out) like a stack of plates.\n*   **Queues:** FIFO (First In, First Out) like a ticket line.\n*   **Trees/Graphs:** Hierarchical or connected data.',
    },
    {
        id: 'dsa-002',
        semester: 3,
        topic: 'algorithms',
        keywords: ['algorithm', 'sorting', 'searching', 'complexity', 'big o'],
        explanation: 'An **Algorithm** is a step-by-step procedure to solve a problem.\n\n**Key Types:**\n*   **Sorting:** Bubble Sort, Merge Sort, Quick Sort.\n*   **Searching:** Linear Search, Binary Search.\n\nWe measure efficiency using **Big O Notation** (e.g., O(n), O(log n)).',
    },
    {
        id: 'dsa-003',
        semester: 3,
        topic: 'Binary Search Tree (BST)',
        keywords: ['bst', 'binary search tree', 'tree', 'search'],
        explanation: 'A **BST** is a tree where for every node:\n1.  Values in the LEFT subtree are SMALLER.\n2.  Values in the RIGHT subtree are LARGER.\n\nThis makes searching very fast (O(log n)), like dividing a phonebook in half repeatedly.',
    },

    // Semester 4: OS & Database Systems
    {
        id: 'os-001',
        semester: 4,
        topic: 'Operating Systems',
        keywords: ['os', 'process', 'thread', 'scheduling', 'deadlock', 'memory management'],
        explanation: 'An **OS** manages hardware and software resources.\n\n**Key Concepts:**\n*   **Process:** A program in execution.\n*   **Threads:** Lightweight sub-processes.\n*   **Deadlock:** Two processes waiting for each other forever.\n*   **Scheduling:** Deciding which process runs next (FCFS, Round Robin).',
    },
    {
        id: 'db-001',
        semester: 4,
        topic: 'Database Systems',
        keywords: ['database', 'sql', 'normalization', 'er diagram', 'relational', 'dbms'],
        explanation: '**Databases** store and manage structured data.\n\n**Key Concepts:**\n*   **SQL:** Language to query data (`SELECT * FROM Users`).\n*   **Normalization:** Organizing data to reduce redundancy (1NF, 2NF, 3NF).\n*   **ACID Properties:** Atomicity, Consistency, Isolation, Durability (ensures reliable transactions).',
    },
    {
        id: 'db-002',
        semester: 4,
        topic: 'Normalization',
        keywords: ['normalization', '1nf', '2nf', '3nf', 'bcnf'],
        explanation: '**Normalization** is the process of organizing data in a database.\n\n*   **1NF:** Atomic values (no lists in a cell).\n*   **2NF:** No partial dependencies (all columns depend on the whole primary key).\n*   **3NF:** No transitive dependencies (non-key columns don\'t depend on other non-key columns).',
    },


    // Semester 5: Analysis of Algorithms
    {
        id: 'algo-001',
        semester: 5,
        topic: 'Analysis of Algorithms',
        keywords: ['dynamic programming', 'greedy', 'divide and conquer'],
        explanation: '**Algorithm Analysis** is about designing efficient solutions.\n\n**Strategies:**\n*   **Divide & Conquer:** Break problem into subproblems (e.g., Merge Sort).\n*   **Dynamic Programming:** Solve subproblems and store results to avoid re-work (e.g., Fibonacci).\n*   **Greedy:** Make the best local choice at each step (e.g., Huffman Coding).',
    },

    // Semester 6: AI & Computer Networks
    {
        id: 'ai-001',
        semester: 6,
        topic: 'Artificial Intelligence',
        keywords: ['ai', 'machine learning', 'neural networks', 'search agents', 'heuristics'],
        explanation: '**AI** is creating systems that can perform tasks requiring human intelligence.\n\n**Topics:**\n*   **Search Agents:** BFS, DFS, A* Search.\n*   **Machine Learning:** Systems that learn from data (Supervised, Unsupervised).\n*   **Neural Networks:** Inspired by the human brain.',
    },
    {
        id: 'cn-001',
        semester: 6,
        topic: 'Computer Networks',
        keywords: ['network', 'osi model', 'tcp', 'ip', 'http', 'protocol'],
        explanation: '**Computer Networks** allow computers to communicate.\n\n**The OSI Model (7 Layers):**\n1.  Physical (Cables)\n2.  Data Link (MAC)\n3.  Network (IP)\n4.  Transport (TCP/UDP)\n5.  Session\n6.  Presentation\n7.  Application (HTTP)\n\n"Please Do Not Throw Sausage Pizza Away" is a mnemonic!',
    },

    // Semester 7: Compiler Construction
    {
        id: 'cc-001',
        semester: 7,
        topic: 'Compiler Construction',
        keywords: ['compiler', 'lexical', 'syntax', 'semantic', 'parsing', 'grammar'],
        explanation: '**Compilers** translate high-level code (C++) into machine code (0s and 1s).\n\n**Phases:**\n1.  **Lexical Analysis:** Breaks code into tokens.\n2.  **Syntax Analysis:** Checks grammar (Parse Tree).\n3.  **Semantic Analysis:** Checks meaning (Type checking).\n4.  **Code Generation:** Creates the machine code.',
    },

    // Semester 8: Final Year Project & Information Security
    {
        id: 'is-001',
        semester: 8,
        topic: 'Information Security',
        keywords: ['security', 'cryptography', 'encryption', 'decryption', 'rsa', 'aes'],
        explanation: '**Information Security** protects data.\n\n**CIA Triad:**\n*   **Confidentiality:** Only authorized people see data.\n*   **Integrity:** Data is not tampered with.\n*   **Availability:** Data is accessible when needed.\n\n**Cryptography:** Encrypting messages so hackers can\'t read them.',
    },
    {
        id: 'fyp-001',
        semester: 8,
        topic: 'Final Year Project (FYP)',
        keywords: ['fyp', 'project', 'thesis', 'research'],
        explanation: '**FYP** is your capstone project. It integrates everything you\'ve learned in 4 years. Focus on solving a real-world problem, document your work properly, and practice your presentation skills.',
    }
];

export const getResponse = (query: string, pdfContent?: string): string => {
    const lowerQuery = query.toLowerCase();

    // 1. Direct Knowledge Base Match
    let bestMatch: CSConcept | null = null;
    let maxScore = 0;

    csKnowledgeBase.forEach(concept => {
        let score = 0;
        concept.keywords.forEach(keyword => {
            if (lowerQuery.includes(keyword.toLowerCase())) {
                score += 1;
            }
        });
        if (lowerQuery.includes(concept.topic.toLowerCase())) score += 3; // Boost for topic name match

        if (score > maxScore) {
            maxScore = score;
            bestMatch = concept;
        }
    });

    if (bestMatch && maxScore > 0) {
        return `### ${bestMatch.topic} (Semester ${bestMatch.semester})\n\n${bestMatch.explanation}`;
    }

    // 2. PDF Content Query (If PDF exists)
    if (pdfContent) {
        if (lowerQuery.includes('summarize') || lowerQuery.includes('summary') || lowerQuery.includes('explain')) {
            return `### Document Analysis\n\nI've analyzed the document. Here are the key concepts I found based on my CS knowledge base:\n\n` +
                analyzeText(pdfContent);
        }
        return `### Document Content Match\n\nI found the following in your document:\n\n"${pdfContent.substring(0, 300)}..."\n\n(Ask specific questions like 'Summarize' or 'Explain concepts')`;
    }

    // 3. Fallback General Conversation
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        return "Hello! I'm your offline CS Study Buddy. I can explain concepts from Semester 1-8. Try asking about 'Recursion', 'OOP', 'Normalization', or 'Compilers'!";
    }

    if (lowerQuery.includes('quiz')) {
        return "I can generate a practice quiz for you! (Feature coming soon to offline mode). Try asking me to explain a topic instead.";
    }

    return `I'm not sure about that specific topic yet. My offline database covers core CS subjects like:\n\n*   **PF & OOP** (Sem 1-2)\n*   **DSA & Database** (Sem 3-4)\n*   **OS & Networks** (Sem 4-6)\n*   **AI & Compilers** (Sem 6-7)\n\nTry asking about one of these!`;
};

const analyzeText = (text: string): string => {
    // Simple extraction of known keywords from the PDF text to simulate "Understanding"
    let foundConcepts: string[] = [];
    const lowerText = text.toLowerCase();

    csKnowledgeBase.forEach(concept => {
        if (concept.keywords.some(k => lowerText.includes(k))) {
            if (!foundConcepts.includes(concept.topic)) {
                foundConcepts.push(concept.topic);
            }
        }
    });

    if (foundConcepts.length > 0) {
        return `This document appears to contain information related to:\n\n` +
            foundConcepts.map(c => `*   **${c}**`).join('\n') +
            `\n\nWould you like me to explain any of these topics?`;
    }

    return "This document content seems to be outside my core CS knowledge base, or it's a general document. I've read it successfully!";
}
