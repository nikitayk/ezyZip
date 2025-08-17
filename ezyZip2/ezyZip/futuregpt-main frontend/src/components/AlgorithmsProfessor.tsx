import React, { useState } from 'react';
import { useAI } from '../hooks/useAI';
import { Book, Brain, Send } from 'lucide-react';

const AlgorithmsProfessor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { sendMessage } = useAI({ apiKey: '' }); // API key will be handled by the context in a real app

  const handleExplain = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setExplanation('');

    const prompt = `
      You are a World-Class Algorithms Professor & Coding Mentor.
      Your task is to analyze the following excerpt from the Introduction to Algorithms (CLRS) and explain it in the most intuitive and structured way possible.

      Your response MUST be structured in the following way:
      1. *Introduction* – Summarize what the excerpt is about.
      2. *Why it Matters* – Explain the motivation and importance of the concept.
      3. *Key Points & Gotchas* – Bullet-point breakdown of the most important details + pitfalls.
      4. *Step-by-Step Explanation* – Walk through the concept in depth, step by step.
      5. *Pseudocode / Code Implementation* – Provide working code in Python.
      6. *Examples & Intuition* – Show dry runs, analogies, and real-world examples.
      7. *Complexity Analysis* – Time, space, and tradeoffs.
      8. *Summary for Review* – Key takeaways in 3–5 bullet points.
      9. *Further Insights* – Optional: related concepts or advanced notes.

      Here is the excerpt:
      ---
      ${inputText}
      ---
    `;

    try {
      const response = await sendMessage([{ content: prompt, role: 'user' }]);
      setExplanation(response);
    } catch (error) {
      console.error('Error getting explanation:', error);
      setExplanation('Sorry, I encountered an error while generating the explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <Book className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">CLRS Algorithms Professor</h1>
          <p className="text-gray-400">Your personal guide to mastering algorithms.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 flex flex-col">
          <label htmlFor="clrs-input" className="text-lg font-semibold text-white mb-2">
            Paste CLRS Excerpt Here
          </label>
          <textarea
            id="clrs-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste a section from Introduction to Algorithms..."
            className="w-full flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-white">Explanation</h2>
            <button
              onClick={handleExplain}
              disabled={isLoading || !inputText.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg text-white font-medium transition-colors"
            >
              <Brain className="w-5 h-5" />
              <span>{isLoading ? 'Analyzing...' : 'Explain'}</span>
            </button>
          </div>
          <div className="w-full flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p>Thinking...</p>
              </div>
            ) : explanation ? (
              <pre className="whitespace-pre-wrap font-sans">{explanation}</pre>
            ) : (
              <p className="text-gray-500">The explanation will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsProfessor;
