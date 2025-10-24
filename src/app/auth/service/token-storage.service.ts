import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private accessKey = 'accessToken';
  private refreshKey = 'refreshToken';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  saveTokens(access: string, refresh?: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.accessKey, access);
      //localStorage.setItem(this.refreshKey, refresh);
    }
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.accessKey);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.refreshKey);
    }
    return null;
  }

  clearTokens() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.accessKey);
      localStorage.removeItem(this.refreshKey);
    }
  }
}
