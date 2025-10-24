import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { TokenStorageService } from "../service/token-storage.service";

export class AuthInterceptor implements HttpInterceptor{
    constructor(private tokenService: TokenStorageService) {} 
    intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokenService.getAccessToken();
    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }  

}