import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, StudentRecord } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vercel, localhost, and other custom domains
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '10mb' }));

// Health check endpoint (critical for Render to prevent/detect spin-down)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Get contest configuration (isTestAccessOpen, cutoffMarks, etc.)
app.get('/api/config', (_req: Request, res: Response) => {
  try {
    const config = db.getConfig();
    res.json({ success: true, config });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update contest configuration (Admin control)
app.post('/api/admin/config', (req: Request, res: Response) => {
  try {
    const { cutoffMarks, isTestAccessOpen, contestTitle } = req.body;
    const updates: any = {};

    if (typeof cutoffMarks === 'number') {
      updates.cutoffMarks = cutoffMarks;
    }
    if (typeof isTestAccessOpen === 'boolean') {
      updates.isTestAccessOpen = isTestAccessOpen;
    }
    if (typeof contestTitle === 'string') {
      updates.contestTitle = contestTitle;
    }

    const updated = db.updateConfig(updates);
    res.json({ success: true, config: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Student login / registration
app.post('/api/students/login', (req: Request, res: Response) => {
  try {
    const { fullName, email, registrationNumber } = req.body;

    if (!email || !fullName || !registrationNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fullName, email, registrationNumber'
      });
    }

    const existing = db.getParticipantByEmail(email);
    if (existing) {
      return res.json({ success: true, student: existing, isNew: false });
    }

    const newRecord: StudentRecord = {
      id: email,
      fullName,
      email,
      registrationNumber,
      loginTime: new Date().toISOString(),
      status: 'registered',
      answers: {}
    };

    const saved = db.upsertParticipant(newRecord);
    res.json({ success: true, student: saved, isNew: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Record test start
app.post('/api/students/start', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const student = db.getParticipantByEmail(email);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    const updated: StudentRecord = {
      ...student,
      status: 'in-progress',
      testStartTime: student.testStartTime || new Date().toISOString()
    };

    db.upsertParticipant(updated);
    res.json({ success: true, student: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Record test submission & evaluation
app.post('/api/students/submit', (req: Request, res: Response) => {
  try {
    const studentRecord: StudentRecord = req.body;

    if (!studentRecord || !studentRecord.email) {
      return res.status(400).json({
        success: false,
        error: 'Valid student submission record with email is required'
      });
    }

    const config = db.getConfig();
    const cutoff = config.cutoffMarks || 15;
    const isQualified =
      typeof studentRecord.score === 'number' ? studentRecord.score >= cutoff : false;

    const completedRecord: StudentRecord = {
      ...studentRecord,
      status: 'submitted',
      submissionTime: studentRecord.submissionTime || new Date().toISOString(),
      isQualified
    };

    const saved = db.upsertParticipant(completedRecord);
    res.json({ success: true, student: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Get all participants
app.get('/api/admin/participants', (_req: Request, res: Response) => {
  try {
    const participants = db.getAllParticipants();
    res.json({ success: true, participants });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Delete a participant
app.delete('/api/admin/participants/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteParticipant(id);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: Reset all participants
app.post('/api/admin/reset', (_req: Request, res: Response) => {
  try {
    db.clearAllParticipants();
    res.json({ success: true, message: 'All contest records reset' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] GFG Code Colosseum API listening on port ${PORT}`);
});
