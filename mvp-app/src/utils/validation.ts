export const validators = {
  /**
   * Validate email format
   */
  isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isValidPassword(password: string) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * Validate Korean phone number
   */
  isValidPhoneNumber(phone: string) {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validate health data ranges
   */
  isValidHealthData(data: any) {
    const errors: string[] = [];

    if (data.heart_rate && (data.heart_rate < 30 || data.heart_rate > 200)) {
      errors.push('심박수는 30-200 사이여야 합니다.');
    }

    if (data.blood_pressure_systolic && (data.blood_pressure_systolic < 80 || data.blood_pressure_systolic > 200)) {
      errors.push('수축기 혈압은 80-200 사이여야 합니다.');
    }

    if (data.blood_pressure_diastolic && (data.blood_pressure_diastolic < 40 || data.blood_pressure_diastolic > 130)) {
      errors.push('이완기 혈압은 40-130 사이여야 합니다.');
    }

    if (data.weight && (data.weight < 20 || data.weight > 300)) {
      errors.push('체중은 20-300kg 사이여야 합니다.');
    }

    if (data.height && (data.height < 100 || data.height > 250)) {
      errors.push('키는 100-250cm 사이여야 합니다.');
    }

    if (data.steps && (data.steps < 0 || data.steps > 100000)) {
      errors.push('걸음수는 0-100000 사이여야 합니다.');
    }

    if (data.sleep_hours && (data.sleep_hours < 0 || data.sleep_hours > 24)) {
      errors.push('수면시간은 0-24시간 사이여야 합니다.');
    }

    if (data.mood_rating && (data.mood_rating < 1 || data.mood_rating > 10)) {
      errors.push('기분 점수는 1-10 사이여야 합니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate age
   */
  isValidAge(age: number) {
    return age >= 0 && age <= 150;
  },

  /**
   * Validate required fields
   */
  validateRequired(fields: Record<string, any>) {
    const errors: Record<string, string> = {};

    Object.entries(fields).forEach(([key, value]) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors[key] = '필수 입력 항목입니다.';
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Validate string length
   */
  isValidLength(str: string, min: number, max: number) {
    return str.length >= min && str.length <= max;
  },

  /**
   * Validate positive number
   */
  isPositiveNumber(num: number) {
    return num > 0;
  },

  /**
   * Validate non-negative number
   */
  isNonNegativeNumber(num: number) {
    return num >= 0;
  },

  /**
   * Validate URL format
   */
  isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate date format
   */
  isValidDate(date: string | Date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  },

  /**
   * Validate date range
   */
  isValidDateRange(startDate: string | Date, endDate: string | Date) {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    return this.isValidDate(start) && this.isValidDate(end) && start <= end;
  },

  /**
   * Validate BMI calculation data
   */
  isValidBMIData(weight: number, height: number) {
    return (
      this.isPositiveNumber(weight) &&
      this.isPositiveNumber(height) &&
      weight >= 20 && weight <= 300 &&
      height >= 100 && height <= 250
    );
  },

  /**
   * Calculate BMI
   */
  calculateBMI(weight: number, height: number) {
    if (!this.isValidBMIData(weight, height)) {
      return null;
    }
    
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  },

  /**
   * Get BMI category
   */
  getBMICategory(bmi: number) {
    if (bmi < 18.5) return '저체중';
    if (bmi < 25) return '정상';
    if (bmi < 30) return '과체중';
    return '비만';
  },

  /**
   * Sanitize string input
   */
  sanitizeString(str: string) {
    return str.trim().replace(/[<>]/g, '');
  },

  /**
   * Validate Korean text (한글 포함)
   */
  containsKorean(str: string) {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    return koreanRegex.test(str);
  }
}; 