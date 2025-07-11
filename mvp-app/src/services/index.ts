// Import all services
import { healthService } from './healthService';
import { userService } from './userService';
import { recommendationsService } from './recommendationsService';
import { communityService } from './communityService';

// Export all services
export { healthService } from './healthService';
export { userService } from './userService';
export { recommendationsService } from './recommendationsService';
export { communityService } from './communityService';

// Backward compatibility - Re-export as database for existing code
export const database = {
  // Health operations
  createHealthData: healthService.createHealthData,
  getHealthData: healthService.getHealthData,
  getLatestHealthData: healthService.getLatestHealthData,
  updateHealthData: healthService.updateHealthData,
  deleteHealthData: healthService.deleteHealthData,
  getHealthStats: healthService.getHealthStats,
  
  // User operations
  getUserProfile: userService.getUserProfile,
  updateUserProfile: userService.updateUserProfile,
  
  // Recommendations operations
  createHealthRecommendation: recommendationsService.createHealthRecommendation,
  getHealthRecommendations: recommendationsService.getHealthRecommendations,
  markRecommendationAsRead: recommendationsService.markRecommendationAsRead,
  
  // Community operations
  getCommunityPosts: communityService.getCommunityPosts,
  createCommunityPost: communityService.createCommunityPost,
  getPostComments: communityService.getPostComments,
  createComment: communityService.createComment,
  toggleLike: communityService.toggleLike,
}; 