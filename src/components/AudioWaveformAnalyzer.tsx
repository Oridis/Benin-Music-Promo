import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, Radio, Volume2 } from 'lucide-react';

interface AudioWaveformAnalyzerProps {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  audioFileUrl: string | null;
  songTitle: string;
}

export default function AudioWaveformAnalyzer({
  audioRef,
  isPlaying,
  audioFileUrl,
  songTitle,
}: AudioWaveformAnalyzerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const [activeVisualization, setActiveVisualization] = useState<'frequency' | 'waveform' | 'both'>('both');
  const [dbLevel, setDbLevel] = useState<number>(0);
  const [frequencyLabel, setFrequencyLabel] = useState<string>('Calme');

  useEffect(() => {
    // Clean up animation on unmount or file url change
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(err => console.warn('AudioContext close error:', err));
      }
    };
  }, [audioFileUrl]);

  useEffect(() => {
    if (!audioFileUrl || !audioRef.current) return;

    const setupAudioAnalysis = async () => {
      try {
        const audioEl = audioRef.current;
        if (!audioEl) return;

        // Ensure we only hook up the Web Audio API once per audio element
        const customAudio = audioEl as any;
        let analyser = customAudio.__analyser as AnalyserNode | undefined;
        let audioCtx = customAudio.__audioContext as AudioContext | undefined;

        if (!analyser || !audioCtx) {
          // Initialize AudioContext
          audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          analyser = audioCtx.createAnalyser();
          
          // Settings for high-precision waveform and frequency curves
          analyser.fftSize = 256; 
          analyser.smoothingTimeConstant = 0.82;

          // Connect audio element source
          const source = audioCtx.createMediaElementSource(audioEl);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);

          // Save references to prevent duplicate connection errors
          customAudio.__audioContext = audioCtx;
          customAudio.__analyser = analyser;
        }

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        // Auto-resume if context suspended (autoplay defense)
        if (isPlaying && audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
      } catch (err) {
        console.warn('Web Audio API hookup failed (this is expected if already connected):', err);
      }
    };

    setupAudioAnalysis();
  }, [audioFileUrl, isPlaying, audioRef]);

  // Handle live rendering loop
  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !svgRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Draw static ambient wave when paused
      drawStaticWave();
      return;
    }

    const analyser = analyserRef.current;
    const svgElement = svgRef.current;
    const bufferLength = analyser.frequencyBinCount;
    
    const frequencyData = new Uint8Array(bufferLength);
    const waveformData = new Uint8Array(bufferLength);

    const renderFrame = () => {
      if (!analyserRef.current || !isPlaying) return;

      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(waveformData);

      // Compute general dB/volume metric for text labels
      let sum = 0;
      for (let i = 0; i < frequencyData.length; i++) {
        sum += frequencyData[i];
      }
      const avg = sum / frequencyData.length;
      const computedDb = Math.round((avg / 255) * 100);
      setDbLevel(computedDb);

      if (computedDb > 70) {
        setFrequencyLabel('Basses Lourdes 🔥');
      } else if (computedDb > 45) {
        setFrequencyLabel('Médiums Dynamiques ⚡');
      } else if (computedDb > 15) {
        setFrequencyLabel('Ambiance Soft 🎵');
      } else {
        setFrequencyLabel('Silence');
      }

      // Draw using D3
      drawD3Visualization(frequencyData, waveformData);

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    animationRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, activeVisualization, audioFileUrl]);

  const getDimensions = () => {
    if (containerRef.current) {
      return {
        width: containerRef.current.clientWidth,
        height: 120,
      };
    }
    return { width: 400, height: 120 };
  };

  const drawStaticWave = () => {
    if (!svgRef.current) return;
    const { width, height } = getDimensions();
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Draw an elegant ambient line when not playing
    const lineData = d3.range(0, 40).map(i => {
      const angle = (i / 40) * Math.PI * 4;
      return {
        x: (i / 40) * width,
        y: height / 2 + Math.sin(angle) * 8 * Math.cos(angle * 0.5)
      };
    });

    const lineGenerator = d3.line<{ x: number; y: number }>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);

    svg.append('path')
      .datum(lineData)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', 'url(#static-grad)')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.65)
      .attr('class', 'animate-pulse');

    // Gradient definition for static state
    const defs = svg.append('defs');
    const staticGrad = defs.append('linearGradient')
      .attr('id', 'static-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    staticGrad.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981'); // Emerald

    staticGrad.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#f59e0b'); // Yellow/Gold

    staticGrad.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ef4444'); // Red
  };

  const drawD3Visualization = (frequencyData: Uint8Array, waveformData: Uint8Array) => {
    if (!svgRef.current) return;
    const { width, height } = getDimensions();
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');

    // Create custom glowing gradients (Benin flag inspired: Green -> Yellow -> Red)
    const beninGrad = defs.append('linearGradient')
      .attr('id', 'benin-grad')
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');

    beninGrad.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981') // Emerald
      .attr('stop-opacity', 0.15);

    beninGrad.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#eab308') // Gold yellow
      .attr('stop-opacity', 0.85);

    beninGrad.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f43f5e') // Red
      .attr('stop-opacity', 1.0);

    // Waveform line gradient
    const waveGrad = defs.append('linearGradient')
      .attr('id', 'wave-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    waveGrad.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981');

    waveGrad.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#f59e0b');

    waveGrad.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f43f5e');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const numPoints = frequencyData.length;
    const barWidth = width / numPoints;

    // 1. Draw Frequency Analysis (Bars)
    if (activeVisualization === 'frequency' || activeVisualization === 'both') {
      const gBars = svg.append('g').attr('class', 'bars-group');

      gBars.selectAll('rect')
        .data(Array.from(frequencyData))
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * barWidth)
        .attr('y', d => {
          const barHeight = (d / 255) * (height - 10);
          return height - barHeight;
        })
        .attr('width', Math.max(1, barWidth - 1.5))
        .attr('height', d => (d / 255) * (height - 10))
        .attr('fill', 'url(#benin-grad)')
        .attr('rx', 1.5)
        .attr('ry', 1.5)
        .attr('opacity', activeVisualization === 'both' ? 0.45 : 0.95);
    }

    // 2. Draw Waveform (Flowing line)
    if (activeVisualization === 'waveform' || activeVisualization === 'both') {
      const gWave = svg.append('g').attr('class', 'wave-group');

      const waveLineData = Array.from(waveformData).map((val, i) => {
        const x = (i / (numPoints - 1)) * width;
        // Map 0-255 time-domain value into visual bounds
        const amplitude = (val - 128) / 128; // -1.0 to 1.0
        const y = height / 2 + amplitude * (height / 2.3);
        return { x, y };
      });

      const lineGenerator = d3.line<{ x: number; y: number }>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveBasis);

      // Area under the waveform line for visual luxury
      if (activeVisualization === 'waveform') {
        const areaGenerator = d3.area<{ x: number; y: number }>()
          .x(d => d.x)
          .y0(height)
          .y1(d => d.y)
          .curve(d3.curveBasis);

        gWave.append('path')
          .datum(waveLineData)
          .attr('d', areaGenerator)
          .attr('fill', 'url(#benin-grad)')
          .attr('opacity', 0.12);
      }

      // High quality waveform line
      gWave.append('path')
        .datum(waveLineData)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', 'url(#wave-grad)')
        .attr('stroke-width', activeVisualization === 'both' ? 2.5 : 3.5)
        .attr('filter', 'url(#glow)')
        .attr('opacity', 0.95);
    }
  };

  return (
    <div className="rounded-xl border border-purple-950/20 bg-[#0d0a19]/80 p-3.5 space-y-3.5 mt-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-[11px] font-black uppercase text-gray-200 tracking-wider">
              Analyseur de Fréquence & Waveform
            </h5>
            <p className="text-[9px] text-gray-400 truncate max-w-[200px] sm:max-w-xs font-mono">
              En cours : <span className="text-amber-500 font-bold">{songTitle || "Titre musical"}</span>
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-[#141029] p-0.5 rounded-lg border border-purple-950/20">
          <button
            type="button"
            onClick={() => setActiveVisualization('both')}
            className={`px-2 py-1 rounded-md text-[9px] font-black tracking-wider uppercase cursor-pointer transition-all ${
              activeVisualization === 'both'
                ? 'bg-amber-500 text-gray-950 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Dual
          </button>
          <button
            type="button"
            onClick={() => setActiveVisualization('frequency')}
            className={`px-2 py-1 rounded-md text-[9px] font-black tracking-wider uppercase cursor-pointer transition-all ${
              activeVisualization === 'frequency'
                ? 'bg-amber-500 text-gray-950 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Spectre
          </button>
          <button
            type="button"
            onClick={() => setActiveVisualization('waveform')}
            className={`px-2 py-1 rounded-md text-[9px] font-black tracking-wider uppercase cursor-pointer transition-all ${
              activeVisualization === 'waveform'
                ? 'bg-amber-500 text-gray-950 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Onde
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div 
        ref={containerRef}
        className="relative h-[120px] w-full rounded-lg bg-[#070511] overflow-hidden border border-white/5 flex items-center justify-center"
      >
        <svg 
          ref={svgRef} 
          className="w-full h-full block"
          style={{ contentVisibility: 'auto' }}
        />

        {/* Gridlines overlay for extra premium look */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />

        {/* Dynamic status indicators */}
        {isPlaying && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#0d0a19]/90 border border-emerald-500/10 px-1.5 py-0.5 rounded-md text-[8px] font-bold text-emerald-400 font-mono tracking-wider uppercase">
            <Radio className="h-2.5 w-2.5 text-emerald-400 animate-pulse" />
            <span>Flux de décodage Direct</span>
          </div>
        )}

        {isPlaying && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-[#0d0a19]/90 border border-purple-950/20 px-2 py-0.5 rounded-md text-[8px] font-bold text-gray-300 font-mono">
            <Volume2 className="h-2.5 w-2.5 text-amber-500" />
            <span>Niveau: {dbLevel}% • {frequencyLabel}</span>
          </div>
        )}
      </div>

      <div className="text-[9px] text-gray-500 flex items-center justify-between px-1">
        <span>Filtre Passe-bas : 44.1 kHz</span>
        <span className="font-mono">Rendu Vectoriel D3 engine</span>
      </div>
    </div>
  );
}
