interface RiskMeterProps {
  riskScore: number; // 0-100
}

export const RiskMeter = ({ riskScore }: RiskMeterProps) => {
  const getRiskColor = (score: number) => {
    if (score < 25) return 'bg-green-500';
    if (score < 50) return 'bg-yellow-500';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRiskLabel = (score: number) => {
    if (score < 25) return 'Low Risk';
    if (score < 50) return 'Moderate Risk';
    if (score < 75) return 'High Risk';
    return 'Critical Risk';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Overall Risk Score</span>
        <span className={`text-lg font-bold ${getRiskColor(riskScore).replace('bg-', 'text-')}`}>
          {riskScore}/100
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${getRiskColor(riskScore)} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(riskScore, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">{getRiskLabel(riskScore)}</p>
    </div>
  );
};

