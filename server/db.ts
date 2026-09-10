import fs from 'fs';
import path from 'path';

export interface StudentAnswer {
  questionId: number;
  answer: string;
  markedForReview: boolean;
}

export interface StudentRecord {
  id: string;
  fullName: string;
  email: string;
  registrationNumber: string;
  loginTime: string;
  testStartTime?: string;
  submissionTime?: string;
  timeTakenSeconds?: number;
  status: 'registered' | 'in-progress' | 'submitted';
  answers: Record<number, StudentAnswer>;
  score?: number;
  mcqScore?: number;
  shortScore?: number;
  isQualified?: boolean;
}

export interface ContestConfig {
  contestTitle: string;
  chapterName: string;
  durationMinutes: number;
  isTestAccessOpen: boolean;
  cutoffMarks: number;
  totalQuestions: number;
  adminWhitelist: string[];
}

export interface DatabaseSchema {
  config: ContestConfig;
  participants: StudentRecord[];
}

const DEFAULT_CONFIG: ContestConfig = {
  contestTitle: 'Code Colosseum - DSA Contest',
  chapterName: 'GeeksforGeeks Student Chapter VIT-AP',
  durationMinutes: 40,
  isTestAccessOpen: true,
  cutoffMarks: 15,
  totalQuestions: 25,
  adminWhitelist: [
    'tanishka.25bca7602@vitapstudent.ac.in',
    'sathvik.24bce7086@vitapstudent.ac.in',
    'sathvikguttula@gmail.com',
    'gfg.chapter@vitap.ac.in',
    'abhay.23bce7190@vitapstudent.ac.in'
  ]
};

// Database file path
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// In-memory cache
let inMemoryData: DatabaseSchema | null = null;

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDatabase(): DatabaseSchema {
  if (inMemoryData) return inMemoryData;

  ensureDataDir();

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryData = JSON.parse(raw);
      if (inMemoryData) {
        // Ensure defaults are present
        inMemoryData.config = { ...DEFAULT_CONFIG, ...inMemoryData.config };
        inMemoryData.participants = inMemoryData.participants || [];
        return inMemoryData;
      }
    } catch (err) {
      console.error('[DB] Error parsing db.json, falling back to defaults:', err);
    }
  }

  inMemoryData = {
    config: { ...DEFAULT_CONFIG },
    participants: []
  };
  saveDatabase();
  return inMemoryData;
}

function saveDatabase(): void {
  if (!inMemoryData) return;
  try {
    ensureDataDir();
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(inMemoryData, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Error saving to db.json:', err);
  }
}

export const db = {
  getConfig(): ContestConfig {
    const data = loadDatabase();
    return data.config;
  },

  updateConfig(updates: Partial<ContestConfig>): ContestConfig {
    const data = loadDatabase();
    data.config = { ...data.config, ...updates };
    saveDatabase();
    return data.config;
  },

  getAllParticipants(): StudentRecord[] {
    const data = loadDatabase();
    return data.participants;
  },

  getParticipantByEmail(email: string): StudentRecord | undefined {
    const data = loadDatabase();
    return data.participants.find((p) => p.email.toLowerCase() === email.toLowerCase());
  },

  upsertParticipant(record: StudentRecord): StudentRecord {
    const data = loadDatabase();
    const index = data.participants.findIndex(
      (p) => p.email.toLowerCase() === record.email.toLowerCase()
    );

    if (index >= 0) {
      data.participants[index] = { ...data.participants[index], ...record };
      saveDatabase();
      return data.participants[index];
    } else {
      data.participants.unshift(record);
      saveDatabase();
      return record;
    }
  },

  deleteParticipant(idOrEmail: string): boolean {
    const data = loadDatabase();
    const prevLength = data.participants.length;
    data.participants = data.participants.filter(
      (p) => p.id !== idOrEmail && p.email.toLowerCase() !== idOrEmail.toLowerCase()
    );
    if (data.participants.length !== prevLength) {
      saveDatabase();
      return true;
    }
    return false;
  },

  clearAllParticipants(): void {
    const data = loadDatabase();
    data.participants = [];
    saveDatabase();
  }
};
