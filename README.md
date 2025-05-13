# Clinical Trial Finder

A comprehensive platform for finding and evaluating clinical trials using AI-powered recommendations.

## Features

- 🔍 Search clinical trials by condition and location
- 🤖 AI-powered trial recommendations using HealthBench
- 📊 Detailed trial analysis and match scores
- 🏥 Medical profile-based matching
- 📱 Responsive design for all devices
- 🗺️ Interactive maps for trial locations
- 📈 Real-time data from ClinicalTrials.gov

## Tech Stack

- Next.js
- React
- Tailwind CSS
- OpenAI GPT-4
- ClinicalTrials.gov API
- WHO API for vaccine data

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/romeoxt/clinical-trial-finder.git
cd clinical-trial-finder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API keys:
```
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/pages` - Next.js pages and API routes
- `/components` - React components
- `/lib` - Utility functions and constants
- `/public` - Static assets
- `/styles` - CSS and styling files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- ClinicalTrials.gov for trial data
- OpenAI for AI capabilities
- WHO for vaccine data
