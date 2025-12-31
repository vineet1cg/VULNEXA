import { useEffect, useState } from "react";
import { ethicsApi } from "../api/ethics";
import type { EthicalNotice } from "../types/analysis";

export const EthicalBanner = () => {
  const [notice, setNotice] = useState<EthicalNotice | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await ethicsApi.getEthicalNotice();
        setNotice(data);
      } catch (error) {
        console.error("Failed to fetch ethical notice:", error);
      }
    };
    fetchNotice();
  }, []);

  if (!notice || !isVisible) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            {notice.title}
          </h3>
          <p className="text-sm text-yellow-700 whitespace-pre-line">
            {notice.content}
          </p>
          <p className="text-xs text-yellow-600 mt-2">
            <strong>Important:</strong> This is a READ-ONLY, ETHICAL security
            analysis tool. No code execution. No exploit testing. All payloads
            are simulated and NON-EXECUTABLE. For educational purposes only.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-yellow-600 hover:text-yellow-800"
          aria-label="Close banner"
        >
          ×
        </button>
      </div>
    </div>
  );
};
