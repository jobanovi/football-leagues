import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RateLimitHandlingService {

  public static readonly switchKeyHeaderName: string = "switch-key";
  public static readonly switchKeyHeaderValue: string = "true";

  private static readonly rateLimitMinuteMsg: string = "Too many requests. Your rate limit is 10 requests per minute.";
  private static readonly rateLimitDayMsg: string = "You have reached the request limit for the day";

  constructor() { }

  isRateLimitIssue(rateLimit: string): boolean {
    try {
      // unfortunately, rate limit json models are not the same so using just json string to check
      const rateModelJson: string = JSON.stringify(rateLimit);
      if (rateModelJson.includes(RateLimitHandlingService.rateLimitMinuteMsg)
        || rateModelJson.includes(RateLimitHandlingService.rateLimitDayMsg)) {
        return true
      }
    } catch (e) {
      return false;
    }
    return false;
  }
}
