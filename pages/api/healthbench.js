import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// HealthBench evaluation categories
const EVALUATION_CATEGORIES = {
  CLINICAL_KNOWLEDGE: 'clinical_knowledge',
  MEDICAL_REASONING: 'medical_reasoning',
  PATIENT_SAFETY: 'patient_safety',
  TREATMENT_RECOMMENDATIONS: 'treatment_recommendations'
};

// Helper function to evaluate clinical trial data using HealthBench
async function evaluateWithHealthBench(userProfile, trials) {
  try {
    // Format the data for evaluation
    const evaluationData = {
      user_profile: {
        condition: userProfile.condition,
        age: userProfile.age,
        gender: userProfile.gender,
        medical_history: userProfile.medicalHistory,
        current_medications: userProfile.currentMedications,
        location: userProfile.location,
        preferences: userProfile.preferences
      },
      trials: trials.map(trial => ({
        trial_id: trial.NCTId,
        title: trial.BriefTitle,
        condition: trial.Condition,
        summary: trial.BriefSummary,
        status: trial.OverallStatus,
        phase: trial.Phase,
        eligibility: trial.EligibilityCriteria
      }))
    };

    const prompt = `You are HealthBench, an AI system specialized in evaluating clinical trial suitability for patients. Analyze the following patient profile and clinical trials to provide personalized recommendations.

Patient Profile:
${JSON.stringify(evaluationData.user_profile, null, 2)}

Available Trials:
${JSON.stringify(evaluationData.trials, null, 2)}

Provide a detailed evaluation in the following JSON format:
{
  "overall_score": number (0-10),
  "summary": "string",
  "recommended_trials": [
    {
      "trial_id": "string",
      "match_score": number (0-10),
      "match_reason": "string"
    }
  ],
  "evaluations": {
    "clinical_knowledge": {
      "score": number (0-10),
      "feedback": ["string"],
      "recommendations": ["string"]
    },
    "medical_reasoning": {
      "score": number (0-10),
      "feedback": ["string"],
      "recommendations": ["string"]
    },
    "patient_safety": {
      "score": number (0-10),
      "feedback": ["string"],
      "recommendations": ["string"]
    },
    "treatment_recommendations": {
      "score": number (0-10),
      "feedback": ["string"],
      "recommendations": ["string"]
    }
  }
}

IMPORTANT: Respond with valid JSON only. No additional text or formatting.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are HealthBench, an AI system specialized in evaluating clinical trial suitability. You must respond with valid JSON only, no additional text or formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const evaluationResults = JSON.parse(completion.choices[0].message.content);
    return evaluationResults;
  } catch (error) {
    console.error('Error evaluating with HealthBench:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userProfile, trials } = req.body;

    if (!userProfile || !trials) {
      return res.status(400).json({ message: 'User profile and trials data are required' });
    }

    // Evaluate the trials using HealthBench
    const evaluationResults = await evaluateWithHealthBench(userProfile, trials);

    // Process and format the evaluation results
    const formattedResults = {
      overall_score: evaluationResults.overall_score || 0,
      summary: evaluationResults.summary || '',
      recommended_trials: evaluationResults.recommended_trials.map(trial => ({
        ...trial,
        match_score: trial.match_score || 0,
        match_reason: trial.match_reason || ''
      })),
      evaluations: {
        clinical_knowledge: {
          score: evaluationResults.evaluations?.clinical_knowledge?.score || 0,
          feedback: evaluationResults.evaluations?.clinical_knowledge?.feedback || [],
          recommendations: evaluationResults.evaluations?.clinical_knowledge?.recommendations || []
        },
        medical_reasoning: {
          score: evaluationResults.evaluations?.medical_reasoning?.score || 0,
          feedback: evaluationResults.evaluations?.medical_reasoning?.feedback || [],
          recommendations: evaluationResults.evaluations?.medical_reasoning?.recommendations || []
        },
        patient_safety: {
          score: evaluationResults.evaluations?.patient_safety?.score || 0,
          feedback: evaluationResults.evaluations?.patient_safety?.feedback || [],
          recommendations: evaluationResults.evaluations?.patient_safety?.recommendations || []
        },
        treatment_recommendations: {
          score: evaluationResults.evaluations?.treatment_recommendations?.score || 0,
          feedback: evaluationResults.evaluations?.treatment_recommendations?.feedback || [],
          recommendations: evaluationResults.evaluations?.treatment_recommendations?.recommendations || []
        }
      },
      last_updated: new Date().toISOString()
    };

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Error in HealthBench evaluation:', error);
    res.status(500).json({
      message: 'Error evaluating trial data',
      error: error.message,
      details: {
        errorType: error.name,
        errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
} 