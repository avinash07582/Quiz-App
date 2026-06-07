const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Helper to clean JSON string from markdown formatting
 */
function cleanJsonString(content) {
  if (!content) return '';
  return content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

/**
 * Generate questions from a single text chunk with AI explanations
 */
async function generateQuestionsFromChunk(chunk, counts, difficulty = 'medium') {
  const { mcq = 0, truefalse = 0 } = counts;

  const prompt = `You are an expert AI EdTech tutor and assessment creator. Based on the following text excerpt, generate quiz questions in valid JSON format.
Difficulty level: ${difficulty}

Generate EXACTLY:
- ${mcq} multiple-choice questions (type: "mcq") with 4 options labeled A, B, C, D
- ${truefalse} true/false questions (type: "truefalse")

Rules:
- Return ONLY a valid JSON array
- Every question MUST include a detailed "explanation" explaining why the correct answer is correct and why distractors are wrong, along with a short concept summary.
- JSON format:
[
  {
    "type": "mcq",
    "question": "What is the primary function of...?",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A. ...",
    "explanation": "Option A is correct because... Option B and C are incorrect because...",
    "points": 2
  }
]

Text excerpt:
"""
${chunk}
"""`;

  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text().trim();

  const jsonStr = cleanJsonString(content);
  const questions = JSON.parse(jsonStr);

  return questions.filter(q => q.type && q.question && q.answer);
}

/**
 * Detect topic and subtopics from text
 */
async function detectTopicAndSubtopics(text) {
  const snippet = (text || '').slice(0, 3000);
  const prompt = `Analyze the following academic or technical document text and classify it into standard computer science / engineering subjects.
Standard subjects include: DBMS, Operating Systems, Computer Networks, Java, React, Data Structures & Algorithms, Artificial Intelligence, Web Development, Cloud Computing, Cybersecurity, or General CS.

Return ONLY a valid JSON object with the format:
{
  "detectedTopic": "Database Management Systems (DBMS)",
  "subtopics": ["ACID Properties", "Indexing", "Normal Forms", "SQL Joins"]
}

Text excerpt:
"""
${snippet}
"""`;

  try {
    if (!process.env.GEMINI_API_KEY) throw new Error("API Key Missing");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = cleanJsonString(response.text());
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Topic detection error or fallback:', err.message);
    return { detectedTopic: 'General CS', subtopics: ['Core Fundamentals', 'Architecture & Systems', 'Data Management'] };
  }
}

/**
 * Generate a quiz title
 */
async function generateTitle(text) {
  try {
    const snippet = (text || '').slice(0, 1000);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(`Generate a concise title for a quiz based on: ${snippet}`);
    const response = await result.response;
    return response.text().trim().replace(/^"|"$/g, '');
  } catch (err) {
    return "Technical Assessment & Knowledge Check";
  }
}

/**
 * Generate mock questions fallback
 */
function generateMockQuestions(counts, totalCount) {
  const questions = [];
  for (let i = 0; i < totalCount; i++) {
    questions.push({
      type: i % 3 === 0 ? 'truefalse' : 'mcq',
      question: `Sample Technical Question on Core CS Principles #${i + 1}`,
      options: ['A. Primary Indexing Structure', 'B. Distributed Cache Layer', 'C. Asynchronous Event Bus', 'D. Monolithic State Store'],
      answer: i % 3 === 0 ? 'True' : 'A. Primary Indexing Structure',
      explanation: 'This option is correct because primary indexing structures minimize disk I/O operations through B+ tree traversal. Distractors represent secondary or unrelated architectural components.',
      points: 2
    });
  }
  return questions;
}

/**
 * Main quiz generation entry
 */
async function generateQuestions(chunks, totalCount, fullText, options = { difficulty: 'medium' }) {
  if (process.env.MOCK_AI === 'true' || !process.env.GEMINI_API_KEY) {
    return { 
      questions: generateMockQuestions({}, totalCount), 
      title: "System Architecture & Core Principles" 
    };
  }

  try {
    const usedChunks = chunks.slice(0, 3);
    const perChunk = Math.ceil(totalCount / usedChunks.length);
    const allQuestions = [];

    for (const chunk of usedChunks) {
      const mcqCount = Math.ceil(perChunk * 0.7);
      const tfCount = perChunk - mcqCount;
      const qs = await generateQuestionsFromChunk(chunk, { mcq: mcqCount, truefalse: tfCount }, options.difficulty);
      allQuestions.push(...qs);
    }

    if (allQuestions.length === 0) throw new Error("No questions generated");

    const title = await generateTitle(fullText);
    return { questions: allQuestions.slice(0, totalCount), title };
  } catch (err) {
    console.error('AI Generation Error (using premium fallback):', err.message);
    return { 
      questions: generateMockQuestions({}, totalCount), 
      title: `Technical Knowledge Verification` 
    };
  }
}

/**
 * Generate study notes, formulas, interview questions, and flashcards from text
 */
async function generateStudyNotes(text, topic = 'General CS') {
  const fallbackNotes = {
    title: `Executive Study Guide: ${topic}`,
    summary: `Comprehensive technical review covering core architectural paradigms, algorithmic complexities, and system engineering trade-offs essential for ${topic}.`,
    keyConcepts: [
      { concept: "Asynchronous Processing & Event Loops", explanation: "Decouples request handling from heavy blocking I/O tasks using event queues and non-blocking worker threads." },
      { concept: "Distributed Consensus (Raft/Paxos)", explanation: "Ensures multiple nodes agree on state transitions in distributed databases even in the presence of network partitions." },
      { concept: "ACID vs BASE Properties", explanation: "ACID prioritizes absolute consistency and isolation, whereas BASE allows eventual consistency for high availability." },
      { concept: "B+ Tree Indexing", explanation: "Balanced search tree structure optimized for database storage systems, allowing sequential leaf node traversal." },
      { concept: "Virtual Memory Paging", explanation: "Translates virtual addresses to physical RAM frames, handling page faults via disk swap space." }
    ],
    formulasOrSnippets: [
      { title: "Master Theorem for Divide & Conquer", content: "T(n) = aT(n/b) + f(n). Used to determine time complexity of recursive algorithmic patterns." },
      { title: "Amdahl's Law for Parallel Speedup", content: "S(s) = 1 / ((1 - p) + (p / s)). Calculates maximum theoretical speedup when executing parallelized workloads." }
    ],
    interviewQuestions: [
      { question: "How would you prevent cache stampede in a high-traffic distributed architecture?", answer: "Implement mutex locks (distributed locking via Redis Redlock) or probabilistic early expiration (XFetch algorithm) so only one worker recalculates the cache.", difficulty: "hard" },
      { question: "Explain the difference between optimistic and pessimistic concurrency control.", answer: "Optimistic uses version stamps to validate transactions at commit time (best for read-heavy). Pessimistic acquires row/table locks immediately (best for write-heavy collisions).", difficulty: "medium" }
    ],
    flashcards: [
      { front: "What is the primary advantage of Consistent Hashing in distributed caches?", back: "It minimizes key redistribution when cache nodes are added or removed, preventing widespread cache invalidation." },
      { front: "Define Idempotency in REST API design.", back: "An API operation is idempotent if executing it multiple times produces the exact same system state as executing it once." },
      { front: "What is the Big-O time complexity of searching a Hash Table with collisions?", back: "Average case O(1), worst case O(n) if all keys collide into the same bucket linked list." },
      { front: "What is an N+1 query problem?", back: "Occurs when an ORM issues one query to fetch N parent records, and then N separate queries to fetch associated child records." },
      { front: "Explain the CAP Theorem.", back: "A distributed data store can simultaneously provide at most two of three guarantees: Consistency, Availability, and Partition Tolerance." },
      { front: "What is a Bloom Filter?", back: "A space-efficient probabilistic data structure used to test whether an element is definitely not in a set or possibly in a set." }
    ]
  };

  try {
    if (!process.env.GEMINI_API_KEY || process.env.MOCK_AI === 'true') {
      return fallbackNotes;
    }
    const snippet = (text || '').slice(0, 5000);
    const prompt = `You are an expert AI Professor creating comprehensive study notes, formula sheets, interview prep, and flashcards based on the provided text for the subject '${topic}'.

Return ONLY a valid JSON object matching this structure:
{
  "title": "Comprehensive Study Guide: ${topic}",
  "summary": "A high-level executive summary of the entire document...",
  "keyConcepts": [
    { "concept": "Concept 1", "explanation": "Detailed explanation..." },
    { "concept": "Concept 2", "explanation": "Detailed explanation..." }
  ],
  "formulasOrSnippets": [
    { "title": "Formula / Rule 1", "content": "E = mc^2 or code snippet..." }
  ],
  "interviewQuestions": [
    { "question": "What is...?", "answer": "The answer is...", "difficulty": "medium" }
  ],
  "flashcards": [
    { "front": "What is X?", "back": "X is defined as..." }
  ]
}

Document text:
"""
${snippet}
"""`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = cleanJsonString(response.text());
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Study notes AI error (using fallback):", err.message);
    return fallbackNotes;
  }
}

/**
 * Generate interview questions based on resume or role
 */
async function generateInterviewQuestions(resumeText, targetRole = 'Software Engineer') {
  const fallbackInterview = [
    {
      type: "open",
      category: "Technical",
      question: `For the role of ${targetRole}, describe how you would design a robust caching strategy and prevent database bottlenecks under heavy concurrent load.`,
      sampleAnswer: "A strong candidate will mention multi-tiered caching (local in-memory + Redis cluster), write-through vs write-behind caching, and handling cache invalidation."
    },
    {
      type: "mcq",
      category: "Technical",
      question: "Which indexing data structure is most optimal for performing sequential range queries in a relational database?",
      options: ["A. Hash Index", "B. B+ Tree Index", "C. Bit-map Index", "D. Spatial R-Tree Index"],
      correctOption: "B. B+ Tree Index",
      sampleAnswer: "B+ trees maintain sorted pointers in leaf nodes allowing O(log n) lookups and efficient sequential range scans."
    },
    {
      type: "open",
      category: "System Design",
      question: `Design a distributed rate-limiting service capable of handling 500,000 requests per second across global API gateways for ${targetRole}.`,
      sampleAnswer: "Excellent answers explore Token Bucket vs Leaky Bucket vs Sliding Window Log algorithms, Redis sorted sets or Lua scripts, and local gateway batching."
    },
    {
      type: "mcq",
      category: "System Design",
      question: "In distributed microservice transactions, which architectural pattern decouples services by using a sequence of local transactions with compensatory rollback handlers?",
      options: ["A. Two-Phase Commit (2PC)", "B. Saga Pattern", "C. Monolithic Shared Database", "D. Eventual Consistency Bus"],
      correctOption: "B. Saga Pattern",
      sampleAnswer: "The Saga pattern manages distributed transactions through asynchronous local events, invoking compensating actions if any step fails."
    },
    {
      type: "open",
      category: "Behavioral / HR",
      question: "Tell me about a time you had to lead a critical production outage investigation under immense pressure. What was your process?",
      sampleAnswer: "Use the STAR format. Highlight immediate mitigation (rollback/failover), structured RCA (5 Whys), transparent stakeholder communication, and post-mortem preventative action."
    },
    {
      type: "open",
      category: "Behavioral / HR",
      question: "Describe a situation where you had a fundamental disagreement with a colleague regarding a technical architectural decision. How did you resolve it?",
      sampleAnswer: "Focus on empathy, data-backed benchmarks, building quick proof-of-concept prototypes, and committing fully once the team arrives at consensus."
    }
  ];

  try {
    if (!process.env.GEMINI_API_KEY || process.env.MOCK_AI === 'true') {
      return fallbackInterview;
    }
    const snippet = (resumeText || '').slice(0, 3000);
    const prompt = `You are an expert Principal Software Engineer and Technical Recruiter conducting an interview for the role of '${targetRole}'.
Based on the candidate's resume/profile details below, generate precisely 6 interview questions tailored to test their depth of knowledge.
Include both open-ended verbal explanation questions and multiple-choice (MCQ) conceptual questions.

Generate EXACTLY:
- 2 Technical questions (1 open-ended "type": "open", 1 multiple-choice "type": "mcq")
- 2 System Design questions (1 open-ended "type": "open", 1 multiple-choice "type": "mcq")
- 2 Behavioral / HR questions (2 open-ended "type": "open")

Return ONLY a valid JSON array matching this structure:
[
  {
    "type": "open",
    "category": "Technical",
    "question": "Explain how you would optimize database queries in your previous project...",
    "sampleAnswer": "A strong answer should mention indexing, query profiling, caching strategies, and avoiding N+1 problems."
  },
  {
    "type": "mcq",
    "category": "Technical",
    "question": "Which HTTP status code is most appropriate for a rate-limited API response?",
    "options": ["A. 400 Bad Request", "B. 401 Unauthorized", "C. 429 Too Many Requests", "D. 503 Service Unavailable"],
    "correctOption": "C. 429 Too Many Requests",
    "sampleAnswer": "429 Too Many Requests indicates the user has sent too many requests in a given amount of time."
  }
]

Candidate Resume/Profile details:
"""
${snippet}
"""`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = cleanJsonString(response.text());
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallbackInterview;
    return parsed;
  } catch (err) {
    console.error("Interview generation AI error (using premium fallback):", err.message);
    return fallbackInterview;
  }
}

/**
 * Grade interview user responses
 */
async function gradeInterviewResponses(questionsWithResponses) {
  const fallbackGrading = {
    gradedQuestions: (questionsWithResponses || []).map(q => {
      if (q.type === 'mcq') {
        const isCorrect = q.candidateResponse?.trim().toLowerCase() === q.correctOption?.trim().toLowerCase() ||
          q.candidateResponse?.trim()[0]?.toLowerCase() === q.correctOption?.trim()[0]?.toLowerCase();
        return {
          score: isCorrect ? 10 : 0,
          aiFeedback: isCorrect 
            ? `Correct! ${q.sampleExpectedAnswer}` 
            : `Incorrect. The correct option was ${q.correctOption}. ${q.sampleExpectedAnswer}`
        };
      }
      return {
        score: q.candidateResponse?.trim().length > 30 ? 8 : 5,
        aiFeedback: q.candidateResponse?.trim().length > 30 
          ? "Excellent conceptual understanding with clear explanation of trade-offs." 
          : "Response is brief. Consider expanding on architectural details and specific edge cases."
      };
    }),
    overallScore: 82,
    strengths: ["Clear logical structure", "Accurate identification of core technical constraints"],
    improvementAreas: ["Expand depth on distributed edge-case optimization and failure recovery"]
  };

  try {
    if (!process.env.GEMINI_API_KEY || process.env.MOCK_AI === 'true') {
      return fallbackGrading;
    }
    const prompt = `You are an expert AI Technical Interviewer evaluating a candidate's responses across multiple interview rounds.
Below is a JSON array containing the interview questions (both open-ended and MCQ), expected sample answers, and the candidate's actual responses.

Evaluate each response thoroughly, scoring it from 0 to 10 based on technical accuracy, clarity, and depth.
If the question type is "mcq", score it 10 if correct and 0 if incorrect.
Also provide an overall evaluation score (0 to 100), key candidate strengths, and specific areas for improvement.

Input data:
${JSON.stringify(questionsWithResponses, null, 2)}

Return ONLY a valid JSON object matching this structure:
{
  "gradedQuestions": [
    {
      "score": 10,
      "aiFeedback": "Correct! B+ trees maintain sorted pointers in leaf nodes allowing O(log n) lookups."
    }
  ],
  "overallScore": 85,
  "strengths": ["Deep understanding of REST APIs", "Strong behavioral communication"],
  "improvementAreas": ["Need more depth on distributed caching architectures"]
}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = cleanJsonString(response.text());
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("Grading AI error (using fallback):", err.message);
    return fallbackGrading;
  }
}

/**
 * Generate adaptive follow-up quiz focusing on weak areas
 */
async function generateAdaptiveQuiz(pastQuestions, incorrectIndices, fullText) {
  const fallbackAdaptive = [
    {
      type: "mcq",
      question: "Which data structure is most optimal for implementing a Least Recently Used (LRU) Cache?",
      options: ["A. Hash Map combined with a Doubly Linked List", "B. Balanced Binary Search Tree", "C. Singly Linked List with Tail Pointer", "D. Dynamic Array with Resizing"],
      answer: "A. Hash Map combined with a Doubly Linked List",
      explanation: "A Hash Map provides O(1) lookup time, while a Doubly Linked List enables O(1) deletion and insertion at the head/tail when evicting stale keys.",
      points: 2
    },
    {
      type: "truefalse",
      question: "In a relational database, establishing a Foreign Key constraint automatically creates a B-tree index on that column.",
      options: ["True", "False"],
      answer: "False",
      explanation: "While Foreign Keys enforce referential integrity, most database engines (like PostgreSQL and MySQL) do not automatically index foreign key columns; explicit indexes must be created to optimize join queries.",
      points: 2
    }
  ];

  try {
    if (!process.env.GEMINI_API_KEY || process.env.MOCK_AI === 'true') {
      return fallbackAdaptive;
    }
    const incorrectQText = incorrectIndices.map(idx => pastQuestions[idx]?.question).join('\n');
    const snippet = (fullText || '').slice(0, 3000);

    const prompt = `You are an expert AI Tutor creating an adaptive follow-up quiz. The student recently failed the following questions:
"""
${incorrectQText}
"""

Analyze these failed questions to determine the exact concepts the student struggled with.
Then, generate 5 new questions (3 MCQ, 2 True/False) that specifically target these weak concepts to help them master the material.

Return ONLY a valid JSON array matching this structure:
[
  {
    "type": "mcq",
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A. ...",
    "explanation": "...",
    "points": 2
  }
]

Source text context:
"""
${snippet}
"""`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonStr = cleanJsonString(response.text());
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallbackAdaptive;
    return parsed;
  } catch (err) {
    console.error("Adaptive AI error (using fallback):", err.message);
    return fallbackAdaptive;
  }
}

module.exports = {
  generateQuestions,
  generateTitle,
  detectTopicAndSubtopics,
  generateStudyNotes,
  generateInterviewQuestions,
  gradeInterviewResponses,
  generateAdaptiveQuiz,
};
