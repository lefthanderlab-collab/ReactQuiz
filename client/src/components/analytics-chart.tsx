import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { VisitData } from '@/services/analyticsService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface AnalyticsChartProps {
  visits: VisitData[];
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  chartType: 'line' | 'bar';
}

export function AnalyticsChart({ visits, period, chartType }: AnalyticsChartProps) {
  const chartRef = useRef<ChartJS>(null);

  // Group visits by date/period
  const groupVisitsByPeriod = (visits: VisitData[], period: string) => {
    const groups = new Map<string, number>();
    
    visits.forEach(visit => {
      let key: string;
      const date = new Date(visit.date);
      
      switch (period) {
        case 'daily':
          key = visit.date; // YYYY-MM-DD
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'yearly':
          key = String(date.getFullYear());
          break;
        default:
          key = visit.date;
      }
      
      groups.set(key, (groups.get(key) || 0) + 1);
    });
    
    return groups;
  };

  const visitGroups = groupVisitsByPeriod(visits, period);
  const labels = Array.from(visitGroups.keys()).sort();
  const data = labels.map(label => visitGroups.get(label) || 0);

  const formatLabel = (label: string, period: string) => {
    switch (period) {
      case 'daily':
        return new Date(label).toLocaleDateString('ko-KR', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'weekly':
        const weekDate = new Date(label);
        return `${weekDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} 주`;
      case 'monthly':
        const [year, month] = label.split('-');
        return `${year}년 ${month}월`;
      case 'yearly':
        return `${label}년`;
      default:
        return label;
    }
  };

  const chartData = {
    labels: labels.map(label => formatLabel(label, period)),
    datasets: [
      {
        label: '접속 수',
        data: data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: chartType === 'line',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: `접속 통계 (${period === 'daily' ? '일간' : period === 'weekly' ? '주간' : period === 'monthly' ? '월간' : '연간'})`,
        color: 'white',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
          stepSize: 1,
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const ChartComponent = chartType === 'line' ? Line : Bar;

  return (
    <div className="w-full h-96">
      <ChartComponent ref={chartRef} data={chartData} options={options} />
    </div>
  );
}