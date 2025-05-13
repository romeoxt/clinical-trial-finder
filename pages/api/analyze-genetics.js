import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { symptoms, geneticData } = req.body;

    if (!symptoms || !geneticData) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const prompt = `Analyze the following genetic data in relation to the reported symptoms:
    
Symptoms: ${symptoms.join(', ')}

Genetic Data:
${JSON.stringify(geneticData, null, 2)}

Please provide:
1. A brief analysis of potential genetic correlations
2. Key genetic markers that might be relevant
3. Suggested areas for further investigation
4. Any notable patterns or connections`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a genetic analysis expert. Provide clear, concise, and scientifically accurate analysis of genetic data in relation to symptoms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = completion.choices[0].message.content;

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error in genetic analysis:', error);
    return res.status(500).json({ message: 'Error processing genetic analysis' });
  }
} 