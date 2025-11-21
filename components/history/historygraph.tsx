'use client';

// 주의: 이 코드는 Recharts 라이브러리가 설치되어 있어야 작동합니다.
// 설치 명령어: npm install recharts

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// HistoryScreen에서 받아올 데이터 구조 (시간대별 센서값)
interface HistoryEvent {
  id: number;
  timestamp: string;
  eventType: '충격' | '기울기' | '온도' | '수동캡처';
  eventValue: number;
  message: string;
  isAlert: boolean;
  imageUrl?: string;
}

interface HistoryGraphProps {
  data: HistoryEvent[];
}

/**
 * 히스토리 데이터를 차트 포맷으로 변환하는 함수
 * 온도, 기울기 값만 추출하고 시간 포맷을 변경합니다.
 */
const formatGraphData = (historyData: HistoryEvent[]) => {
  const result: any[] = [];
  
  // 시간대별로 데이터를 그룹화하여 하나의 시점에 여러 센서값을 포함
  const grouped: { [key: string]: { time: string, temperature?: number, tilt?: number } } = {};

  historyData.forEach(event => {
    // 시간을 "HH:mm" 형식으로 포맷팅 (X축 라벨용)
    const timeKey = new Date(event.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    if (!grouped[timeKey]) {
      grouped[timeKey] = { time: timeKey };
    }

    if (event.eventType === '온도') {
      grouped[timeKey].temperature = event.eventValue;
    } else if (event.eventType === '기울기') {
      grouped[timeKey].tilt = event.eventValue;
    }
  });

  // 배열로 변환하고 시간 순서대로 정렬 (최신 시간이 뒤로 오게)
  return Object.values(grouped).sort((a, b) => (a.time > b.time ? 1 : -1));
};

// 그래프 데이터의 타입 정의
interface ChartData {
  time: string;
  temperature?: number;
  tilt?: number;
}

const HistoryGraph: React.FC<HistoryGraphProps> = ({ data }) => {
  const chartData: ChartData[] = formatGraphData(data);

  if (chartData.length === 0) {
    return (
      <p className="text-gray-500">그래프를 표시할 센서 데이터가 부족합니다.</p>
    );
  }

  // Y축 도메인 설정 (데이터가 없는 경우를 대비해 최소/최대값 지정)
  const yAxisDomain = [
    Math.min(...chartData.map(d => d.temperature || 0), ...chartData.map(d => d.tilt || 0)) * 0.9, 
    Math.max(...chartData.map(d => d.temperature || 0), ...chartData.map(d => d.tilt || 0)) * 1.1
  ];


  return (
    <div className="w-full h-full min-h-[250px] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          
          {/* X축: 시간 */}
          <XAxis dataKey="time" stroke="#555" tick={{ fontSize: 12 }} />
          
          {/* Y축 (좌측): 온도 */}
          <YAxis 
            yAxisId="temp" 
            orientation="left" 
            stroke="#ff7300" // 주황색
            tick={{ fontSize: 12 }} 
            label={{ value: '온도 (°C)', angle: -90, position: 'insideLeft', fill: '#ff7300' }}
            domain={['dataMin', 'dataMax']}
          />
          
          {/* Y축 (우측): 기울기 */}
          <YAxis 
            yAxisId="tilt" 
            orientation="right" 
            stroke="#387908" // 녹색
            tick={{ fontSize: 12 }} 
            label={{ value: '기울기 (도)', angle: 90, position: 'insideRight', fill: '#387908' }}
            domain={['dataMin', 'dataMax']}
          />
          
          {/* 툴팁: 마우스 오버 시 상세 정보 표시 */}
          <Tooltip 
            formatter={(value: any, name: any, props: any) => {
              const unit = props.dataKey === 'temperature' ? '°C' : '도';
              const label = props.dataKey === 'temperature' ? '온도' : '기울기';
              return [`${value}${unit}`, label];
            }}
          />
          
          {/* 범례 */}
          <Legend wrapperStyle={{ paddingTop: 10 }} />

          {/* 온도 데이터 라인 */}
          <Line 
            yAxisId="temp" 
            type="monotone" 
            dataKey="temperature" 
            stroke="#ff7300" 
            strokeWidth={2} 
            dot={false}
            name="온도 변화"
          />

          {/* 기울기 데이터 라인 */}
          <Line 
            yAxisId="tilt" 
            type="monotone" 
            dataKey="tilt" 
            stroke="#387908" 
            strokeWidth={2} 
            dot={false}
            name="기울기 변화"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryGraph;