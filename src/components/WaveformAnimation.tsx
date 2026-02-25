const WaveformAnimation = () => {
  const bars = 24;
  return (
    <div className="flex items-end justify-center gap-[3px] h-12">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar w-[3px] rounded-full bg-primary"
          style={{
            height: '100%',
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${0.8 + Math.random() * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
};

export default WaveformAnimation;
