export interface CSConcept {
    id: string;
    semester: number;
    topic: string;
    keywords: string[];
    explanation: string;
    simple?: string;
    definition?: string;
    example?: string;
    complexity?: string;
    questions?: string[];
    answer?: string;
    related?: string[];
    subject?: string;
}

export const csKnowledgeBase: CSConcept[] = [
    // --- CORE FUNDAMENTALS ---
    {
        id: 'pf-001',
        semester: 1,
        subject: 'Software Engineering',
        topic: 'Programming Fundamentals',
        keywords: ['programming', 'coding', 'structure', 'syntax', 'logic'],
        explanation: 'Programming Fundamentals is the systematic approach to designing and developing software using engineering principles.',
        definition: 'Systematic approach to software creation.',
        questions: ["What is software engineering?", "What is SDLC?"],
        answer: "Software engineering is the application of engineering to software development.",
        related: ['SDLC', 'Agile']
    },
    {
        id: 'se-002',
        semester: 3,
        subject: 'Software Engineering',
        topic: 'Agile & Scrum',
        keywords: ['agile', 'scrum', 'sprint', 'kanban', 'iteration'],
        explanation: 'Agile is an iterative methodology focused on collaboration and delivering small increments. Scrum divides work into sprints.',
        definition: 'Flexible, iterative development framework.',
        simple: 'Building a car one piece at a time (skateboard -> bike -> car) instead of all at once.',
        answer: "Agile focuses on small functional increments and constant feedback.",
        related: ['SDLC', 'Version Control']
    },

    // --- DATA STRUCTURES & ALGORITHMS ---
    {
        id: 'dsa-001',
        semester: 3,
        subject: 'Data Structures',
        topic: 'Arrays',
        keywords: ['array', 'contiguous', 'index', 'memory'],
        definition: 'Elements stored in contiguous memory locations.',
        explanation: 'Arrays provide O(1) access by index but have fixed sizes.',
        complexity: 'Access: O(1), Search: O(n)',
        related: ['Linked List', 'Stack']
    },
    {
        id: 'dsa-002',
        semester: 3,
        subject: 'Data Structures',
        topic: 'Linked Lists',
        keywords: ['linked list', 'nodes', 'pointers', 'dynamic'],
        definition: 'Chain of nodes where each node points to the next.',
        explanation: 'Linked lists allow dynamic memory allocation and efficient O(1) insertions.',
        complexity: 'Access: O(n), Insertion: O(1)',
        related: ['Arrays', 'Queue']
    },

    // --- OPERATING SYSTEMS ---
    {
        id: 'os-001',
        semester: 4,
        subject: 'Operating Systems',
        topic: 'Memory Management',
        keywords: ['paging', 'segmentation', 'virtual memory', 'thrashing'],
        definition: 'Techniques used by the OS to manage computer memory.',
        explanation: 'Paging divides memory into fixed blocks; Segmentation into logical ones. Virtual memory uses disk space to extend RAM.',
        simple: `Virtual memory is like using a bookshelf (disk) to hold books that don't fit on your desk (RAM).`,
        answer: "Thrashing occurs when excessive swapping degrades performance.",
        related: ['Process', 'CPU Scheduling']
    },

    // --- ADVANCED SYSTEMS ---
    {
        id: 'cc-001',
        semester: 7,
        subject: 'Compiler Design',
        topic: 'Compiler Phases',
        keywords: ['lexical', 'syntax', 'semantic', 'optimization', 'compiler'],
        explanation: 'Compilers translate high-level code through phases: Lexical (tokens), Syntax (grammar), Semantic (logic), and Optimization.',
        definition: 'Phased translation of source code to machine code.',
        related: ['Lexical Analysis', 'Parsing']
    },

    // --- EMERGING TECH ---
    {
        id: 'ai-001',
        semester: 6,
        subject: 'Artificial Intelligence',
        topic: 'Machine Learning',
        keywords: ['ml', 'supervised', 'unsupervised', 'overfitting', 'neural networks'],
        definition: 'Systems learning patterns from data for predictions.',
        explanation: 'Supervised learning uses labeled data. Overfitting happens when a model learns noise instead of patterns.',
        simple: 'ML is like a student learning to recognize cats by looking at thousands of labeled cat pictures.',
        related: ['Search Algorithms', 'Neural Networks']
    },
    {
        id: 'bc-001',
        semester: 8,
        subject: 'Blockchain',
        topic: 'Blockchain & Smart Contracts',
        keywords: ['blockchain', 'decentralization', 'smart contract', 'ledger'],
        definition: 'Decentralized secure record-keeping system.',
        explanation: 'Smart contracts are self-executing programs on a blockchain that enforce rules automatically.',
        simple: 'Vending machine for digital agreements.',
        related: ['Cybersecurity', 'Decentralization']
    },
    {
        id: 'cl-001',
        semester: 6,
        subject: 'Cloud Computing',
        topic: 'Cloud Models',
        keywords: ['saas', 'iaas', 'paas', 'serverless', 'virtualization'],
        definition: 'Delivery of computing services over the internet.',
        explanation: 'IaaS (infrastructure), PaaS (platform), and SaaS (software) are core models. Serverless removes server management.',
        related: ['Virtualization', 'Distributed Systems']
    },

    // --- NETWORKS & SECURITY ---
    {
        id: 'sn-001',
        semester: 6,
        subject: 'Networking',
        topic: 'OSI Model',
        keywords: ['osi', 'layers', 'network', 'protocol'],
        explanation: 'A 7-layer framework for network communication standardization.',
        related: ['TCP/IP', 'HTTP']
    },
    {
        id: 'cs-001',
        semester: 8,
        subject: 'Cybersecurity',
        topic: 'Privacy & Integrity',
        keywords: ['encryption', 'hashing', 'phishing', '2fa'],
        definition: 'Encryption protects secrecy; Hashing ensures data hasn\'t changed.',
        explanation: '2FA adds a second layer of security (e.g., phone code + password).',
        related: ['Information Security', 'Malware']
    }
];

export const getResponse = (query: string, pdfContent?: string): string => {
    const lowerQuery = query.toLowerCase();

    // 1. Direct Knowledge Base Match
    let bestMatch: CSConcept | undefined;
    let maxScore = 0;

    for (const concept of csKnowledgeBase) {
        let score = 0;
        for (const keyword of concept.keywords) {
            if (lowerQuery.includes(keyword.toLowerCase())) {
                score += 1;
            }
        }
        if (lowerQuery.includes(concept.topic.toLowerCase())) score += 3;

        if (score > maxScore) {
            maxScore = score;
            bestMatch = concept;
        }
    }

    if (bestMatch && maxScore > 0) {
        let response = `### ${bestMatch.topic} (Semester ${bestMatch.semester})\n\n`;
        if (bestMatch.definition) response += `**Definition:** ${bestMatch.definition}\n\n`;
        response += `**Explanation:** ${bestMatch.explanation}\n\n`;
        if (bestMatch.simple) response += `*💡 Simple View: ${bestMatch.simple}*\n\n`;
        if (bestMatch.example) response += `**Example:** \`${bestMatch.example}\`\n\n`;
        if (bestMatch.complexity) response += `**Efficiency:** ${bestMatch.complexity}\n\n`;
        if (bestMatch.questions && bestMatch.questions.length > 0) {
            response += `**Practice Questions:**\n` + bestMatch.questions.map(q => `* ${q}`).join('\n') + `\n\n`;
        }
        if (bestMatch.related) response += `*Related: ${bestMatch.related.join(', ')}*`;

        return response;
    }

    // 2. PDF Content Query
    if (pdfContent) {
        if (lowerQuery.includes('summarize') || lowerQuery.includes('summary') || lowerQuery.includes('explain')) {
            return `### Document Analysis\n\nI've analyzed the document. Here are the key concepts I found based on my CS knowledge base:\n\n` +
                analyzeText(pdfContent);
        }
        return `### Document Content Match\n\nI found the following in your document:\n\n"${pdfContent.substring(0, 300)}..."\n\n(Ask specific questions like 'Summarize' or 'Explain concepts')`;
    }

    // 3. Fallback
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        return "Hello! I'm your master-level offline CS Study Buddy. I covered everything from PF to Blockchain. Ask me about 'Cloud Models', 'Agile', or 'Thrashing'!";
    }

    return `I'm not sure about that specific topic yet. Try asking about core CS subjects like **ML**, **OS**, **Cloud**, or **Distributed Systems**.`;
};

const analyzeText = (text: string): string => {
    let foundConcepts: string[] = [];
    const lowerText = text.toLowerCase();

    for (const concept of csKnowledgeBase) {
        if (concept.keywords.some(k => lowerText.includes(k))) {
            if (!foundConcepts.includes(concept.topic)) {
                foundConcepts.push(concept.topic);
            }
        }
    }

    if (foundConcepts.length > 0) {
        return `This document appear to cover:\n\n` +
            foundConcepts.map(c => `*   **${c}**`).join('\n') +
            `\n\nWould you like me to explain any of these?`;
    }

    return "This document content is noted. I'll remember it for our session!";
}
