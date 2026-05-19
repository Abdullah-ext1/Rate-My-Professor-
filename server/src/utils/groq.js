import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
});

/**
 * Generate quiz questions from notes content using Groq AI.
 * @param {string} subjectName - The subject name for context
 * @param {string} notesContent - The actual notes text to generate questions from
 * @returns {Promise<Array>} Array of question objects
 */
export const generateQuizFromContent = async (subjectName, notesContent) => {
  const prompt = `You are a quiz generator for college students. Based on the following notes for the subject "${subjectName}", generate exactly 10 quiz questions.

Generate a mix of question types:
- 4 Multiple Choice Questions (MCQ) with exactly 4 options each
- 3 One-Word Answer questions
- 3 Short Answer questions (1-2 sentence answers)

IMPORTANT: Return ONLY a valid JSON array, no markdown, no code blocks, no explanation. Each question object must follow this exact structure:

For MCQ:
{"type":"mcq","question":"...","options":["Option 1 text","Option 2 text","Option 3 text","Option 4 text"],"correctAnswer":"MUST BE THE EXACT FULL TEXT of the correct option, NOT a letter like A/B/C/D","explanation":"brief explanation"}

CRITICAL MCQ RULE: The "correctAnswer" field MUST contain the exact same string as one of the items in the "options" array. Do NOT use "A", "B", "C", "D" or any letter/number reference. Copy-paste the correct option text exactly.

For One-Word:
{"type":"one-word","question":"...","correctAnswer":"single word","explanation":"brief explanation"}

For Short Answer:
{"type":"short-answer","question":"...","correctAnswer":"1-2 sentence answer","explanation":"brief explanation"}

Notes content:
${notesContent.substring(0, 6000)}

Return ONLY the JSON array:`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4000,
  });

  const responseText = chatCompletion.choices[0]?.message?.content || '[]';
  
  // Clean up response — strip markdown code fences if present
  let cleaned = responseText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const questions = JSON.parse(cleaned);
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid quiz format returned from Groq');
    }

    // Post-process: ensure MCQ correctAnswer matches an option exactly
    const letterMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    for (const q of questions) {
      if (q.type === 'mcq' && q.options && q.options.length > 0) {
        // Check if correctAnswer already matches an option
        const exactMatch = q.options.find(opt => opt === q.correctAnswer);
        if (!exactMatch) {
          // Try case-insensitive match
          const caseMatch = q.options.find(opt => opt.toLowerCase() === q.correctAnswer?.toLowerCase());
          if (caseMatch) {
            q.correctAnswer = caseMatch;
          } else {
            // Try letter reference (A, B, C, D)
            const letter = q.correctAnswer?.trim().toLowerCase().replace(/[^a-d]/g, '');
            if (letter && letterMap[letter] !== undefined && q.options[letterMap[letter]]) {
              q.correctAnswer = q.options[letterMap[letter]];
            } else {
              // Try partial match (correctAnswer is substring of an option or vice versa)
              const partialMatch = q.options.find(opt => 
                opt.toLowerCase().includes(q.correctAnswer?.toLowerCase()) ||
                q.correctAnswer?.toLowerCase().includes(opt.toLowerCase())
              );
              if (partialMatch) {
                q.correctAnswer = partialMatch;
              } else {
                // Last resort: default to first option
                q.correctAnswer = q.options[0];
              }
            }
          }
        }
      }
    }

    return questions;
  } catch (parseError) {
    console.error('Failed to parse Groq response:', cleaned);
    throw new Error('Failed to parse quiz questions from AI response');
  }
};
