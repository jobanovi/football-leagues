import {Injectable} from '@angular/core';
import {RateLimitModel} from "../models/rate-limit-model";

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
      const rateLimitModel: RateLimitModel = JSON.parse(JSON.stringify(rateLimit)) as RateLimitModel;
      if (!Array.isArray(rateLimitModel.errors)
        && (rateLimitModel.errors.rateLimit.includes(RateLimitHandlingService.rateLimitDayMsg)
          || rateLimitModel.errors.rateLimit.includes(RateLimitHandlingService.rateLimitMinuteMsg))) {
        // alert("Unable to provide new results");
        console.error(rateLimitModel.errors);
        return true
      }
    } catch (e) {
      return false;
    }
    return false;
  }
}
