import type * as express from "express-serve-static-core"

declare global {
  namespace Express {
    // 기존 Request 인터페이스 확장
    interface Request {
      user?: any
    }
  }
}

declare module "express" {
  export interface Router extends express.Router {}
}
