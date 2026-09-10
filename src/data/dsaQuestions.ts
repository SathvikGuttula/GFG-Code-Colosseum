import { Question } from '../types/contest';

export const DSA_QUESTIONS: Question[] = [
  // 1 - Easy MCQ (Array / Time Complexity)
  {
    id: 1,
    originalIndex: 1,
    type: 'mcq',
    difficulty: 'Easy',
    topic: 'Searching & Complexity',
    question: 'What is the time complexity of searching for an element in a sorted array of size N using Binary Search?',
    options: [
      'O(1)',
      'O(log N)',
      'O(N)',
      'O(N log N)'
    ],
    correctAnswer: 'O(log N)',
    explanation: 'Binary Search repeatedly divides the search interval in half, leading to a logarithmic runtime O(log N).'
  },
  // 2 - Easy MCQ (Stack implementation)
  {
    id: 2,
    originalIndex: 2,
    type: 'mcq',
    difficulty: 'Easy',
    topic: 'Stacks & Queues',
    question: 'What is the minimum number of standard FIFO queues needed to implement a LIFO stack efficiently?',
    options: [
      '1',
      '2',
      '3',
      'None (Queues cannot simulate stacks)'
    ],
    correctAnswer: '2',
    explanation: 'Two queues are required to simulate a stack. By transferring elements between the two queues during push or pop, LIFO order is preserved.'
  },
  // 3 - Easy MCQ (Binary Trees)
  {
    id: 3,
    originalIndex: 3,
    type: 'mcq',
    difficulty: 'Easy',
    topic: 'Trees',
    question: 'Which tree traversal technique visits nodes in non-decreasing sorted order when performed on a Binary Search Tree (BST)?',
    options: [
      'Preorder Traversal',
      'Inorder Traversal',
      'Postorder Traversal',
      'Level Order Traversal'
    ],
    correctAnswer: 'Inorder Traversal',
    explanation: 'Inorder traversal (Left, Root, Right) of any valid Binary Search Tree processes elements in ascending sorted order.'
  },
  // 4 - Easy MCQ (Sorting)
  {
    id: 4,
    originalIndex: 4,
    type: 'mcq',
    difficulty: 'Easy',
    topic: 'Sorting',
    question: 'What is the best-case time complexity of Insertion Sort when the input array is already completely sorted?',
    options: [
      'O(1)',
      'O(N)',
      'O(N log N)',
      'O(N²)'
    ],
    correctAnswer: 'O(N)',
    explanation: 'If the array is already sorted, Insertion Sort only does one comparison per element and zero shifts, resulting in linear O(N) best-case time.'
  },
  // 5 - Easy MCQ (Graphs / BFS)
  {
    id: 5,
    originalIndex: 5,
    type: 'mcq',
    difficulty: 'Easy',
    topic: 'Graphs',
    question: 'Which data structure is primarily utilized to perform Breadth-First Search (BFS) on a graph?',
    options: [
      'Stack',
      'Queue',
      'Priority Queue',
      'Disjoint Set'
    ],
    correctAnswer: 'Queue',
    explanation: 'Breadth-First Search visits vertices level by level, maintaining a first-in first-out (FIFO) Queue for frontier vertices.'
  },
  // 6 - Easy MCQ (Linked Lists)
  {
    id: 6,
    originalIndex: 6,
    type: 'mcq',
    difficulty: 'Easy',
    topic: 'Linked Lists',
    question: 'What is the time complexity to insert a new node at the beginning (head) of a Singly Linked List having N nodes?',
    options: [
      'O(1)',
      'O(log N)',
      'O(N)',
      'O(N²)'
    ],
    correctAnswer: 'O(1)',
    explanation: 'Inserting at the head merely requires creating a node, pointing its next pointer to the current head, and updating head pointer in O(1) constant time.'
  },
  // 7 - Easy MCQ (Hashing)
  {
    id: 7,
    originalIndex: 7,
    type: 'mcq',
    difficulty: 'Easy',
    topic: 'Hashing',
    question: 'In an open-addressing hash table, what is the technique called where collisions are resolved by searching consecutive adjacent slots linearly?',
    options: [
      'Quadratic Probing',
      'Double Hashing',
      'Linear Probing',
      'Separate Chaining'
    ],
    correctAnswer: 'Linear Probing',
    explanation: 'Linear probing resolves collisions by examining (hash(key) + i) % table_size for i = 0, 1, 2, ... consecutively.'
  },
  // 8 - Medium MCQ (Heap construction)
  {
    id: 8,
    originalIndex: 8,
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'Heaps & Priority Queues',
    question: 'What is the overall time complexity to build a binary max-heap from an unsorted array of N elements using the bottom-up heapify algorithm?',
    options: [
      'O(log N)',
      'O(N)',
      'O(N log N)',
      'O(N²)'
    ],
    correctAnswer: 'O(N)',
    explanation: 'By calling max-heapify bottom-up from index ⌊N/2⌋ down to 1, the sum of heights across all nodes forms a convergent geometric series yielding O(N) time.'
  },
  // 9 - Medium MCQ (Graphs / Dijkstra)
  {
    id: 9,
    originalIndex: 9,
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'Graphs',
    question: "What is the time complexity of Dijkstra's algorithm implemented with an adjacency list and a binary min-heap for a graph with V vertices and E edges?",
    options: [
      'O(V²)',
      'O((V + E) log V)',
      'O(V * E)',
      'O(E log E + V²)'
    ],
    correctAnswer: 'O((V + E) log V)',
    explanation: 'Each vertex is extracted from the min-heap once (O(V log V)) and each edge relaxation may decrease key in the heap (O(E log V)), summing to O((V + E) log V).'
  },
  // 10 - Medium MCQ (Dynamic Programming)
  {
    id: 10,
    originalIndex: 10,
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    question: 'For the classical 0/1 Knapsack problem with N items and knapsack capacity W, what is the time complexity of the standard dynamic programming table approach?',
    options: [
      'O(N + W)',
      'O(N * W)',
      'O(2^N)',
      'O(N log W)'
    ],
    correctAnswer: 'O(N * W)',
    explanation: 'The DP state dp[i][w] depends on items up to index i and capacity w up to W, requiring filling an (N+1) x (W+1) table in O(N * W) pseudo-polynomial time.'
  },
  // 11 - Medium MCQ (Graph Cycle Detection)
  {
    id: 11,
    originalIndex: 11,
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'Graphs',
    question: 'Which algorithm or strategy can be used to detect a cycle in a Directed Graph in O(V + E) time?',
    options: [
      'Standard BFS with only a visited array',
      "Kruskal's Algorithm",
      "Kahn's algorithm using in-degree tracking",
      "Prim's Minimum Spanning Tree"
    ],
    correctAnswer: "Kahn's algorithm using in-degree tracking",
    explanation: "Kahn's algorithm computes in-degrees. If the count of processed vertices in topological order is less than V, the directed graph contains at least one cycle."
  },
  // 12 - Medium MCQ (Self-Balancing BST)
  {
    id: 12,
    originalIndex: 12,
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'Trees',
    question: 'What is the balance factor allowed for any internal node in a valid AVL Tree?',
    options: [
      'Strictly 0',
      '-1, 0, or +1',
      '-2 to +2',
      'Any non-negative integer'
    ],
    correctAnswer: '-1, 0, or +1',
    explanation: 'An AVL tree enforces that for every node, the absolute difference in heights between its left and right subtrees (height(left) - height(right)) is at most 1.'
  },
  // 13 - Medium MCQ (Sorting Auxiliary Space)
  {
    id: 13,
    originalIndex: 13,
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'Sorting',
    question: 'What is the auxiliary space complexity of standard 2-way Merge Sort when sorting an array of size N?',
    options: [
      'O(1)',
      'O(log N)',
      'O(N)',
      'O(N²)'
    ],
    correctAnswer: 'O(N)',
    explanation: 'Standard array merge sort requires a temporary buffer array of size N during the merge step, giving O(N) auxiliary space.'
  },
  // 14 - Medium MCQ (Design Patterns in DSA)
  {
    id: 14,
    originalIndex: 14,
    type: 'mcq',
    difficulty: 'Medium',
    topic: 'System Design & DS',
    question: 'Which combination of data structures is optimal for implementing a Least Recently Used (LRU) Cache with O(1) get and put operations?',
    options: [
      'Array and Singly Linked List',
      'Doubly Linked List and Hash Map',
      'Binary Search Tree and Queue',
      'Min-Heap and Stack'
    ],
    correctAnswer: 'Doubly Linked List and Hash Map',
    explanation: 'A Hash Map provides O(1) key lookup, while a Doubly Linked List allows O(1) node removal and insertion to the head/tail to track access recency.'
  },
  // 15 - Hard MCQ (All-pairs Shortest Path)
  {
    id: 15,
    originalIndex: 15,
    type: 'mcq',
    difficulty: 'Hard',
    topic: 'Graphs & DP',
    question: 'Consider the Floyd-Warshall algorithm on a graph with V vertices. What is its time and space complexity respectively?',
    options: [
      'Time: O(V²), Space: O(V)',
      'Time: O(V³), Space: O(V²)',
      'Time: O(V² log V), Space: O(V²)',
      'Time: O(V * E), Space: O(V + E)'
    ],
    correctAnswer: 'Time: O(V³), Space: O(V²)',
    explanation: 'Floyd-Warshall uses three nested loops running V times each (O(V³)) and a distance matrix of dimension V x V (O(V²)).'
  },
  // 16 - Hard MCQ (String Algorithms / KMP)
  {
    id: 16,
    originalIndex: 16,
    type: 'mcq',
    difficulty: 'Hard',
    topic: 'String Matching',
    question: 'In the Knuth-Morris-Pratt (KMP) string matching algorithm, what does the π (pi) or LPS table store at index i?',
    options: [
      'The number of distinct characters up to pattern[i]',
      'The hash code of the pattern substring up to index i',
      'The length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i]',
      'The shift distance to the next occurrence of pattern[0]'
    ],
    correctAnswer: 'The length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i]',
    explanation: 'LPS stands for Longest Proper Prefix which is also Suffix. This precomputed table allows skipping redundant comparisons upon mismatches.'
  },
  // 17 - Hard MCQ (Disjoint Set Union)
  {
    id: 17,
    originalIndex: 17,
    type: 'mcq',
    difficulty: 'Hard',
    topic: 'Advanced Data Structures',
    question: 'What is the amortized per-operation time complexity of Disjoint Set Union (DSU) when both Path Compression and Union by Rank heuristics are employed?',
    options: [
      'O(log N)',
      'O(log² N)',
      'O(α(N)) where α is the Inverse Ackermann function',
      'O(N)'
    ],
    correctAnswer: 'O(α(N)) where α is the Inverse Ackermann function',
    explanation: 'With both path compression and union by rank, m operations on n elements run in O(m * α(n)) time, which is effectively constant (α(n) < 5 for all realistic universe sizes).'
  },
  // 18 - Hard MCQ (Graph Theory - Bipartite)
  {
    id: 18,
    originalIndex: 18,
    type: 'mcq',
    difficulty: 'Hard',
    topic: 'Graph Theory',
    question: 'What is the maximum number of edges in a simple bipartite graph having V total vertices?',
    options: [
      'V - 1',
      'V * (V - 1) / 2',
      '⌊V² / 4⌋',
      '2 * V'
    ],
    correctAnswer: '⌊V² / 4⌋',
    explanation: 'If vertices are partitioned into subsets of sizes k and (V - k), the number of edges is maximized when k = ⌊V/2⌋, yielding k * (V - k) = ⌊V² / 4⌋.'
  },
  // 19 - Hard MCQ (Segment Tree)
  {
    id: 19,
    originalIndex: 19,
    type: 'mcq',
    difficulty: 'Hard',
    topic: 'Advanced Data Structures',
    question: 'For a Segment Tree built over an array of size N to support range minimum queries, what are the construction time and query time respectively?',
    options: [
      'Build: O(N log N), Query: O(1)',
      'Build: O(N), Query: O(log N)',
      'Build: O(N²), Query: O(log N)',
      'Build: O(log N), Query: O(N)'
    ],
    correctAnswer: 'Build: O(N), Query: O(log N)',
    explanation: 'Constructing a Segment Tree takes linear O(N) time because it has roughly 2N nodes, and each range query visits at most O(log N) nodes across the tree height.'
  },
  // 20 - Hard MCQ (Strongly Connected Components)
  {
    id: 20,
    originalIndex: 20,
    type: 'mcq',
    difficulty: 'Hard',
    topic: 'Graphs',
    question: "What is the time complexity of Tarjan's algorithm for finding all Strongly Connected Components (SCCs) in a directed graph G = (V, E)?",
    options: [
      'O(V * E)',
      'O(V + E)',
      'O(V²)',
      'O(E log V)'
    ],
    correctAnswer: 'O(V + E)',
    explanation: "Tarjan's algorithm performs a single DFS traversal maintaining discovery times and low-link values using a stack, running in optimal linear O(V + E) time."
  },

  // ----------------- 5 SHORT ANSWER QUESTIONS -----------------
  // 21 - Short Answer 1
  {
    id: 21,
    originalIndex: 21,
    type: 'short',
    difficulty: 'Easy',
    topic: 'Complexity Analysis',
    question: 'What is the amortized time complexity of appending (push_back) an element into a dynamic array (like std::vector or ArrayList)? Write in standard Big-O notation.',
    correctAnswer: 'O(1)',
    acceptableAnswers: ['O(1)', 'o(1)', 'order 1', 'constant', 'constant time'],
    explanation: 'Although doubling the internal buffer takes O(N), it happens infrequently enough that the amortized cost per append is constant O(1).'
  },
  // 22 - Short Answer 2
  {
    id: 22,
    originalIndex: 22,
    type: 'short',
    difficulty: 'Easy',
    topic: 'Data Structures',
    question: 'Which fundamental data structure operates strictly on the First-In, First-Out (FIFO) principle? (Answer in 1 or 2 words)',
    correctAnswer: 'Queue',
    acceptableAnswers: ['queue', 'fifo queue', 'simple queue', 'linear queue'],
    explanation: 'A Queue adheres strictly to the First-In First-Out (FIFO) principle, where the first element inserted is the first one removed.'
  },
  // 23 - Short Answer 3
  {
    id: 23,
    originalIndex: 23,
    type: 'short',
    difficulty: 'Medium',
    topic: 'Graph Algorithms',
    question: 'Name the single-source shortest path algorithm that can correctly handle graphs containing edges with negative weights (provided there are no negative weight cycles). (1 or 2 words)',
    correctAnswer: 'Bellman Ford',
    acceptableAnswers: ['bellman ford', 'bellman-ford', 'bellman ford algorithm', 'bellman-ford algorithm'],
    explanation: 'The Bellman-Ford algorithm relaxes all E edges V-1 times and can accommodate negative edge weights while also detecting negative cycles.'
  },
  // 24 - Short Answer 4
  {
    id: 24,
    originalIndex: 24,
    type: 'short',
    difficulty: 'Medium',
    topic: 'Graph Theory',
    question: 'How many edges are present in any undirected tree with N vertices? (Express mathematically in terms of N, e.g. N-1)',
    correctAnswer: 'N-1',
    acceptableAnswers: ['n-1', 'n - 1', 'n minus 1', 'n-1 edges'],
    explanation: 'By definition, an undirected tree is a connected acyclic graph with exactly N-1 edges for N vertices.'
  },
  // 25 - Short Answer 5
  {
    id: 25,
    originalIndex: 25,
    type: 'short',
    difficulty: 'Hard',
    topic: 'Algorithmic Paradigms',
    question: "Which general algorithmic paradigm is utilized by both Huffman Coding and Kruskal's Minimum Spanning Tree algorithm? (Answer in 1 or 2 words)",
    correctAnswer: 'Greedy',
    acceptableAnswers: ['greedy', 'greedy algorithm', 'greedy approach', 'greedy technique'],
    explanation: 'Both algorithms make locally optimal choices at each stage (picking smallest frequencies or lowest-weight edges) that lead to a globally optimal solution.'
  }
];

// Admin email whitelist specified by the user
export const ADMIN_WHITELIST: string[] = [
  'tanishka.25bca7602@vitapstudent.ac.in',
  'sathvik.24bce7086@vitapstudent.ac.in',
  'sathvikguttula@gmail.com',
  'gfg.chapter@vitap.ac.in',
  'abhay.23bce7190@vitapstudent.ac.in'
];

export const DEFAULT_CUTOFF = 15; // out of 25 (60%)
export const TOTAL_QUESTIONS_COUNT = 25;
export const CONTEST_DURATION_MINUTES = 40;
export const CONTEST_DURATION_SECONDS = 40 * 60;

