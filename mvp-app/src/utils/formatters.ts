import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { HEALTH_CATEGORIES, PRIORITY_LEVELS, ACTIVITY_LEVELS } from '@/constants';

export const formatters = {
  /**
   * Format date to Korean format
   */
  formatDate(date: string | Date, pattern = 'yyyy년 MM월 dd일') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, pattern, { locale: ko });
  },

  /**
   * Format date and time to Korean format
   */
  formatDateTime(date: string | Date, pattern = 'yyyy년 MM월 dd일 HH:mm') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, pattern, { locale: ko });
  },

  /**
   * Format relative time (e.g., "3시간 전")
   */
  formatRelativeTime(date: string | Date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isToday(dateObj)) {
      return `오늘 ${format(dateObj, 'HH:mm')}`;
    }
    
    if (isYesterday(dateObj)) {
      return `어제 ${format(dateObj, 'HH:mm')}`;
    }
    
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: ko });
  },

  /**
   * Format chart date for display
   */
  formatChartDate(date: string | Date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'M월 d일', { locale: ko });
  },

  /**
   * Format number with thousand separator
   */
  formatNumber(num: number) {
    return new Intl.NumberFormat('ko-KR').format(num);
  },

  /**
   * Format weight with unit
   */
  formatWeight(weight: number | null | undefined) {
    if (weight === null || weight === undefined) return '-';
    return `${weight.toFixed(1)}kg`;
  },

  /**
   * Format heart rate with unit
   */
  formatHeartRate(heartRate: number | null | undefined) {
    if (heartRate === null || heartRate === undefined) return '-';
    return `${Math.round(heartRate)}bpm`;
  },

  /**
   * Format blood pressure
   */
  formatBloodPressure(systolic: number | null | undefined, diastolic: number | null | undefined) {
    if (systolic === null || systolic === undefined || diastolic === null || diastolic === undefined) {
      return '-';
    }
    return `${Math.round(systolic)}/${Math.round(diastolic)}`;
  },

  /**
   * Format sleep hours
   */
  formatSleepHours(hours: number | null | undefined) {
    if (hours === null || hours === undefined) return '-';
    return `${hours.toFixed(1)}시간`;
  },

  /**
   * Format steps count
   */
  formatSteps(steps: number | null | undefined) {
    if (steps === null || steps === undefined) return '-';
    return `${this.formatNumber(steps)}보`;
  },

  /**
   * Format mood rating
   */
  formatMoodRating(rating: number | null | undefined) {
    if (rating === null || rating === undefined) return '-';
    return `${rating}/10`;
  },

  /**
   * Get mood emoji
   */
  getMoodEmoji(rating: number | null | undefined) {
    if (rating === null || rating === undefined) return '😐';
    
    if (rating >= 8) return '😊';
    if (rating >= 6) return '🙂';
    if (rating >= 4) return '😐';
    return '😔';
  },

  /**
   * Get mood description
   */
  getMoodDescription(rating: number | null | undefined) {
    if (rating === null || rating === undefined) return '기록 없음';
    
    if (rating >= 8) return '훌륭해요!';
    if (rating >= 6) return '좋아요!';
    if (rating >= 4) return '보통이에요';
    return '힘내세요!';
  },

  /**
   * Format health category
   */
  formatHealthCategory(category: string) {
    return HEALTH_CATEGORIES[category as keyof typeof HEALTH_CATEGORIES] || category;
  },

  /**
   * Format priority level
   */
  formatPriorityLevel(priority: string) {
    return PRIORITY_LEVELS[priority as keyof typeof PRIORITY_LEVELS] || priority;
  },

  /**
   * Format activity level
   */
  formatActivityLevel(level: string) {
    return ACTIVITY_LEVELS[level as keyof typeof ACTIVITY_LEVELS] || level;
  },

  /**
   * Get category icon
   */
  getCategoryIcon(category: string) {
    const icons = {
      exercise: '🏃‍♂️',
      nutrition: '🥗',
      sleep: '😴',
      mental_health: '🧠',
    };
    return icons[category as keyof typeof icons] || '💡';
  },

  /**
   * Get priority color classes
   */
  getPriorityColor(priority: string) {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  },

  /**
   * Format percentage
   */
  formatPercentage(value: number, decimals = 1) {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  /**
   * Format file size
   */
  formatFileSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  }
}; 