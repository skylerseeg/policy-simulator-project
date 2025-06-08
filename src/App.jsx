import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, Scale, ShieldCheck, Zap, TrendingUp, Users, FileText, X } from 'lucide-react';

// --- Helper Components ---

// A visually appealing card component
const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

// Icon wrapper for consistent styling
const IconHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center mb-4">
    <Icon className="w-6 h-6 mr-3 text-cyan-400" />
    <h3 className="text-xl font-bold text-white">{title}</h3>
  </div>
);

// Custom radio button for policy selection
const PolicyOption = ({ id, name, value, label, checked, onChange, description }) => (
  <label htmlFor={id} className="block p-4 mb-2 bg-gray-700/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200">
    <div className="flex items-center justify-between">
      <span className="font-semibold text-gray-200">{label}</span>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-radio h-5 w-5 text-cyan-500 bg-gray-900 border-gray-500 focus:ring-cyan-600"
      />
    </div>
    <p className="text-sm text-gray-400 mt-1">{description}</p>
  </label>
);

// Modal for displaying the generated whitepaper
const WhitepaperModal = ({ content, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex justify-center items-center z-50 p-4">
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
             <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
            <div className="flex items-center mb-6">
                <FileText className="w-8 h-8 mr-4 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Generated Policy Whitepaper</h2>
            </div>
            <div className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/70 p-6 rounded-lg border border-gray-700">
                {content}
            </div>
        </Card>
    </div>
);


// --- Main Application Component ---

export default function App() {
  // State for policy selections
  const [policies, setPolicies] = useState({
    education: 'moderate',
    antitrust: 'moderate',
    ethics: 'moderate',
  });

  // State for simulation results
  const [results, setResults] = useState({
      gdp: 2.0,
      inequality: 45,
      energy: 15,
  });
  const [showModal, setShowModal] = useState(false);
  const [whitepaperContent, setWhitepaperContent] = useState('');
  
  // State to ensure charts render only on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handlePolicyChange = (e) => {
    const { name, value } = e.target;
    setPolicies(prev => ({ ...prev, [name]: value }));
  };

  /**
   * --- Simulation Logic ---
   * This function simulates economic outcomes based on policy selections.
   * The logic is derived from the "AI's Economic Impact Research" document.
   * Modifiers are applied to baseline values.
   */
  const runSimulation = () => {
    // Baseline values representing a "business as usual" scenario
    const baseline = {
      gdp: 2.0,       // Annual GDP Growth %
      inequality: 45, // Gini Coefficient (x100)
      energy: 15,     // Annual % increase in AI-related energy use
    };

    // Modifiers that will be adjusted based on policy choices
    let gdpModifier = 0;
    let inequalityModifier = 0;
    let energyModifier = 0;

    // --- Apply Education Reform Modifiers ---
    // Source: Section 3 & 8 - Effective reskilling boosts productivity and can mitigate wage gaps.
    if (policies.education === 'strong') {
      gdpModifier += 0.4; // Strong investment in skills boosts productivity
      inequalityModifier -= 3.0; // Effective retraining helps displaced workers, reducing inequality
    }
    if (policies.education === 'weak') {
      gdpModifier -= 0.2; // Ineffective programs are a drag on productivity
      inequalityModifier += 2.0; // Skill mismatches worsen inequality
    }

    // --- Apply Antitrust Measures Modifiers ---
    // Source: Section 4 & 7 - Antitrust can foster innovation but may cause short-term disruption. It can also reduce wealth concentration.
    if (policies.antitrust === 'strong') {
      gdpModifier += 0.2; // Fosters long-term innovation and competition
      inequalityModifier -= 4.0; // Breaks up monopolies, distributing wealth more widely
    }
    if (policies.antitrust === 'weak') {
      gdpModifier += 0.1; // Concentrated markets may still innovate, but benefits are narrow
      inequalityModifier += 3.0; // Unchecked monopolies accelerate wealth concentration
    }

    // --- Apply Ethical & Environmental Guidelines Modifiers ---
    // Source: Section 5 & 7 - Green policies curb energy use. Ethical guidelines build trust, aiding adoption.
    if (policies.ethics === 'strong') {
      gdpModifier += 0.15; // Building trust enhances adoption and economic benefit (PwC)
      inequalityModifier -= 2.0; // Fairness/bias mitigation reduces discriminatory outcomes
      energyModifier -= 12.0; // Strong mandates for renewables/efficiency drastically cut energy growth
    }
    if (policies.ethics === 'weak') {
      gdpModifier -= 0.1; // Lack of trust and incidents can hinder adoption
      inequalityModifier += 1.0; // Unchecked biases can perpetuate inequality
      energyModifier += 5.0; // No regulations mean energy use grows unchecked
    }

    const finalResults = {
      gdp: parseFloat((baseline.gdp + gdpModifier).toFixed(2)),
      inequality: parseFloat((baseline.inequality + inequalityModifier).toFixed(2)),
      energy: parseFloat((baseline.energy + energyModifier).toFixed(2)),
    };
    
    setResults(finalResults);
  };

  /**
   * --- Whitepaper Generation Logic ---
   * Creates a formatted text summary of the simulation.
   * Citations are based on the source research document.
   */
  const generateWhitepaper = () => {
    if (!results) return;

    const policyLabels = {
        education: {
            weak: "Minimal Intervention",
            moderate: "Moderate Reform",
            strong: "Aggressive Reskilling Initiative"
        },
        antitrust: {
            weak: "Laissez-faire Approach",
            moderate: "Targeted Oversight",
            strong: "Aggressive Anti-Monopoly Measures"
        },
        ethics: {
            weak: "Industry Self-Regulation",
            moderate: "Standardized Guidelines",
            strong: "Comprehensive Regulation & Green Mandates"
        }
    };
    
    let content = `================================================
AI POLICY IMPACT SIMULATION - WHITEPAPER
================================================

Date: ${new Date().toLocaleDateString()}

I. EXECUTIVE SUMMARY
--------------------
This document outlines the simulated economic and social impacts of a selected package of Artificial Intelligence policies. The simulation models trade-offs between economic growth, social equity, and environmental sustainability based on current research.

II. SELECTED POLICY PACKAGE
--------------------------
The following policy settings were selected for this simulation:

  * Education Reform:           ${policyLabels.education[policies.education]}
  * Antitrust Measures:         ${policyLabels.antitrust[policies.antitrust]}
  * Ethical & Green Guidelines: ${policyLabels.ethics[policies.ethics]}

III. SIMULATED OUTCOMES
-----------------------
Based on the selected policies, the model projects the following outcomes against baseline projections:

  * PROJECTED ANNUAL GDP GROWTH: ${results.gdp}%
    Analysis: The projected growth reflects a balance between productivity gains from AI and the moderating effects of regulatory frameworks. ${policies.education === 'strong' ? "The aggressive reskilling initiative is a key driver, aligning the workforce with new technological demands and boosting productivity (Source: Section 3)." : "The educational policy choice presents a risk of skill mismatches, potentially capping growth (Source: Section 3)."} ${policies.antitrust === 'strong' ? "Strong antitrust measures are expected to foster long-term innovation by ensuring a competitive market (Source: Section 4)." : ""}

  * PROJECTED INEQUALITY INDEX (Gini): ${results.inequality}
    Analysis: The model indicates a shift in economic inequality. ${policies.antitrust === 'strong' || policies.education === 'strong' || policies.ethics === 'strong' ? "The decrease is primarily attributed to a combination of wider wealth distribution from antitrust actions, reduced wage gaps from effective reskilling, and fairness mandates in ethical guidelines (Source: Sections 3, 4, 7)." : "The increase suggests that without strong intervention, the benefits of AI are likely to concentrate among capital owners and high-skill workers, exacerbating existing disparities (Source: Section 7)."}

  * PROJECTED AI ENERGY CONSUMPTION GROWTH: ${results.energy}%
    Analysis: The projected energy use is highly sensitive to policy. ${policies.ethics === 'strong' ? "The significant reduction in energy consumption growth is a direct result of strong green mandates for data centers and incentives for developing energy-efficient AI models (Source: Section 5)." : "The high projected growth highlights the environmental challenge of AI, suggesting that without direct intervention, AI's carbon footprint could undermine climate goals (Source: Section 5)."}

IV. CONCLUSION & KEY TRADE-OFFS
--------------------------------
This policy configuration demonstrates a clear trade-off. For instance, while ${policyLabels.antitrust[policies.antitrust]} may temper the dominance of large tech firms, it must be balanced with fostering an environment where innovation can thrive. The simulation underscores the interconnectedness of these policy domains; sustainable and equitable growth in the AI era requires a holistic approach that addresses skills, market competition, and environmental impact in concert.

(End of Report)
`;
    setWhitepaperContent(content);
    setShowModal(true);
  };


  // Data for the results chart, memoized for performance
  const chartData = useMemo(() => {
    return [
      { name: 'GDP Growth', value: results.gdp, baseline: 2.0, unit: '%' },
      { name: 'Inequality', value: results.inequality, baseline: 45, unit: '' },
      { name: 'Energy Growth', value: results.energy, baseline: 15, unit: '%' }
    ];
  }, [results]);
  
  const colors = ["#34d399", "#f87171", "#fbbf24"];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">AI Policy Impact Simulator</h1>
          <p className="mt-2 text-lg text-gray-400">Test policy packages and visualize their potential economic and environmental trade-offs.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- Policy Controls Panel --- */}
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Policy Control Panel</h2>
            <div className="space-y-6">
              {/* Education Reform */}
              <div>
                <IconHeader icon={BookOpen} title="Education & Reskilling" />
                <PolicyOption id="edu-weak" name="education" value="weak" label="Minimal Intervention" description="Limited public funding for reskilling programs." checked={policies.education === 'weak'} onChange={handlePolicyChange} />
                <PolicyOption id="edu-mod" name="education" value="moderate" label="Moderate Reform" description="Public-private partnerships for targeted training." checked={policies.education === 'moderate'} onChange={handlePolicyChange} />
                <PolicyOption id="edu-strong" name="education" value="strong" label="Aggressive Reskilling Initiative" description="Large-scale, federally-funded programs for lifelong learning." checked={policies.education === 'strong'} onChange={handlePolicyChange} />
              </div>
              
              {/* Antitrust */}
              <div>
                <IconHeader icon={Scale} title="Antitrust & Competition" />
                <PolicyOption id="anti-weak" name="antitrust" value="weak" label="Laissez-faire" description="Allow markets to self-regulate, minimal intervention." checked={policies.antitrust === 'weak'} onChange={handlePolicyChange} />
                <PolicyOption id="anti-mod" name="antitrust" value="moderate" label="Targeted Oversight" description="Regulate specific anti-competitive behaviors." checked={policies.antitrust === 'moderate'} onChange={handlePolicyChange} />
                <PolicyOption id="anti-strong" name="antitrust" value="strong" label="Aggressive Anti-Monopoly" description="Proactively break up monopolies and regulate market concentration." checked={policies.antitrust === 'strong'} onChange={handlePolicyChange} />
              </div>

              {/* Ethics & Environment */}
              <div>
                <IconHeader icon={ShieldCheck} title="Ethical & Green Guidelines" />
                <PolicyOption id="eth-weak" name="ethics" value="weak" label="Industry Self-Regulation" description="Companies develop their own voluntary ethical codes." checked={policies.ethics === 'weak'} onChange={handlePolicyChange} />
                <PolicyOption id="eth-mod" name="ethics" value="moderate" label="Standardized Guidelines" description="Government sets standards for transparency and fairness." checked={policies.ethics === 'moderate'} onChange={handlePolicyChange} />
                <PolicyOption id="eth-strong" name="ethics" value="strong" label="Comprehensive Regulation" description="Mandatory audits, strong data privacy laws, and green energy mandates." checked={policies.ethics === 'strong'} onChange={handlePolicyChange} />
              </div>
            </div>
            <button 
                onClick={runSimulation}
                className="w-full mt-8 bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 flex items-center justify-center text-lg"
            >
                Run Simulation
            </button>
          </Card>

          {/* --- Results Panel --- */}
          <Card className="flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Simulated Outcomes</h2>
              <div className="flex-grow flex flex-col">
                <div className="h-64 w-full mb-6">
                 {isClient && (
                    <ResponsiveContainer>
                      <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                              backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                              borderColor: '#4b5563',
                              borderRadius: '0.5rem',
                              backdropFilter: 'blur(4px)'
                          }}
                          labelStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ color: '#d1d5db' }}/>
                        <Bar dataKey="value" name="Simulated Result" fill="#8884d8">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Bar>
                        <Bar dataKey="baseline" name="Baseline" fill="#4b5563" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center justify-center text-green-400"><TrendingUp className="mr-2"/>GDP Growth</div>
                        <p className="text-2xl font-bold text-white mt-1">{results.gdp}%</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center justify-center text-red-400"><Users className="mr-2"/>Inequality Index</div>
                        <p className="text-2xl font-bold text-white mt-1">{results.inequality}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <div className="flex items-center justify-center text-yellow-400"><Zap className="mr-2"/>Energy Growth</div>
                        <p className="text-2xl font-bold text-white mt-1">{results.energy}%</p>
                    </div>
                </div>

                <button
                    onClick={generateWhitepaper}
                    className="w-full mt-8 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 flex items-center justify-center text-lg"
                >
                    <FileText className="mr-2" />
                    Generate Whitepaper
                </button>
              </div>
          </Card>
        </div>
      </div>
      {showModal && <WhitepaperModal content={whitepaperContent} onClose={() => setShowModal(false)} />}
    </div>
  );
}
