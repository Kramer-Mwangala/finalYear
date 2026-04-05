'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle } from 'lucide-react';

export default function SkinAnalysisPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setResults({
        score: 78,
        skinType: 'Combination',
        conditions: [
          { name: 'Mild Acne', severity: 'Mild', confidence: '92%' },
          { name: 'Hyperpigmentation', severity: 'Mild', confidence: '87%' },
        ],
        recommendations: [
          {
            id: 1,
            title: 'Daily Skincare Routine',
            description: 'Cleanse, tone, and moisturize twice daily with products suitable for combination skin.',
            priority: 'High',
          },
          {
            id: 2,
            title: 'Tretinoin Treatment',
            description: 'Start with 0.025% concentration, apply 3x weekly, gradually increase frequency.',
            priority: 'High',
          },
          {
            id: 3,
            title: 'Professional Treatment',
            description: 'Consider laser therapy to address hyperpigmentation and improve overall skin texture.',
            priority: 'Medium',
          },
        ],
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-border p-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Skin Analysis</h1>
        <p className="text-muted-foreground">
          Upload a photo of your skin for instant AI-powered analysis and personalized recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Upload Your Photo</h2>

          {!uploadedImage && (
            <div className="border-2 border-dashed border-border p-12 text-center bg-muted/30 rounded">
              <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground mb-2">Select a photo</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Upload a clear, well-lit photo of the area of concern.
              </p>
              <label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button type="button" onClick={() => fileInputRef.current?.click()}>
                  Choose Image
                </Button>
              </label>
            </div>
          )}

          {uploadedImage && (
            <div className="space-y-4">
              <div className="border border-border p-4 bg-white">
                <img
                  src={uploadedImage}
                  alt="Uploaded skin photo"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setUploadedImage(null)}
                >
                  Change Photo
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="flex-1"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Skin'}
                </Button>
              </div>
            </div>
          )}

          {/* Analysis Tips */}
          <div className="mt-8 border border-border p-6 bg-card">
            <h3 className="font-semibold text-foreground mb-4">Best Practices</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Use natural lighting, avoid shadows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Clean face, no makeup or products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Focus on the affected area</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Use consistent zoom level across photos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div>
          {results ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-border p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <p className="text-muted-foreground">
                  Results reviewed by our dermatology team
                </p>
              </div>

              {/* Score */}
              <div className="border border-border p-6 bg-white">
                <h3 className="font-semibold text-foreground mb-4">Overall Skin Health Score</h3>
                <div className="flex items-end gap-4 mb-6">
                  <span className="text-5xl font-bold text-primary">{results.score}</span>
                  <span className="text-muted-foreground mb-2">/100</span>
                </div>
                <div className="w-full bg-muted h-2 rounded">
                  <div
                    className="bg-primary h-2 rounded transition-all"
                    style={{ width: `${results.score}%` }}
                  />
                </div>
              </div>

              {/* Skin Type */}
              <div className="border border-border p-6 bg-white">
                <h3 className="font-semibold text-foreground mb-4">Skin Type Identified</h3>
                <p className="text-2xl font-bold text-accent">{results.skinType}</p>
              </div>

              {/* Detected Conditions */}
              <div className="border border-border p-6 bg-white">
                <h3 className="font-semibold text-foreground mb-4">Detected Conditions</h3>
                <div className="space-y-3">
                  {results.conditions.map((condition: any, idx: number) => (
                    <div key={idx} className="border-b border-border pb-3 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{condition.name}</span>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {condition.confidence}
                        </span>
                      </div>
                      <div className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        {condition.severity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="border border-border p-6 bg-white">
                <h3 className="font-semibold text-foreground mb-4">Personalized Recommendations</h3>
                <div className="space-y-4">
                  {results.recommendations.map((rec: any) => (
                    <div key={rec.id} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{rec.title}</h4>
                        <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded">
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Next Steps</h3>
                <Button className="w-full mb-3">Book Consultation</Button>
                <Button variant="ghost" className="w-full">
                  View Full Report
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 border border-dashed border-border bg-muted/30 rounded">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Upload a photo to see analysis results</p>
                {analyzing && <p className="text-primary font-semibold animate-pulse">Analyzing...</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
