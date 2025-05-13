import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// SNPedia API endpoint
const SNPEDIA_API = 'https://bots.snpedia.com/api.php'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { symptoms, familyHistory, snps } = req.body

    if (!symptoms) {
      return res.status(400).json({ message: 'Symptoms are required' })
    }

    // Fetch SNPedia data if SNPs are provided
    let snpediaData = []
    if (snps && Array.isArray(snps)) {
      try {
        const snpPromises = snps.map(async (snp) => {
          const response = await fetch(`${SNPEDIA_API}?action=query&titles=${snp}&prop=extracts&format=json`)
          const data = await response.json()
          return {
            snp,
            data: data.query?.pages?.[0]?.extract || null
          }
        })
        snpediaData = await Promise.all(snpPromises)
      } catch (error) {
        console.error('Error fetching SNPedia data:', error)
      }
    }

    const prompt = `You are a medical AI assistant specializing in genetic analysis. Analyze the following information and provide a detailed genetic analysis in strict JSON format.

Symptoms: ${symptoms}
${familyHistory ? `Family History: ${familyHistory}` : ''}
${snpediaData.length > 0 ? `SNPedia Data: ${JSON.stringify(snpediaData)}` : ''}

IMPORTANT: Your response must be a valid JSON object with no additional text, markdown, or formatting. The response must start with { and end with }.

Required JSON structure:
{
  "possibleDiagnoses": [
    {
      "condition": "string",
      "confidence": "High|Medium|Low",
      "description": "string",
      "symptoms": ["string"],
      "recommendations": ["string"],
      "clinicalTrials": [
        {
          "id": "string",
          "title": "string",
          "status": "string",
          "link": "string"
        }
      ]
    }
  ],
  "genes": [
    {
      "name": "string",
      "relevance": "High|Medium|Low",
      "description": "string",
      "associatedSNPs": ["string"],
      "familyHistoryRelevance": "string"
    }
  ],
  "snps": [
    {
      "id": "string",
      "gene": "string",
      "description": "string",
      "clinicalSignificance": "string",
      "populationFrequency": "string"
    }
  ],
  "familyHistoryAnalysis": {
    "riskFactors": ["string"],
    "preventiveMeasures": ["string"],
    "screeningRecommendations": ["string"]
  }
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical AI assistant specializing in genetic analysis and symptom interpretation. You must respond with valid JSON only, no additional text or formatting. Double-check your response is valid JSON before sending."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    try {
      const analysis = JSON.parse(completion.choices[0].message.content)
      res.status(200).json(analysis)
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError)
      console.error('Raw response:', completion.choices[0].message.content)
      res.status(500).json({ 
        message: 'Error parsing AI response',
        error: parseError.message,
        rawResponse: completion.choices[0].message.content
      })
    }
  } catch (error) {
    console.error('Error in genetics analysis:', error)
    res.status(500).json({ 
      message: 'Error analyzing symptoms',
      error: error.message 
    })
  }
} 