import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import createMemoryStore from "memorystore";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { Express, Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      password: string;
      createdAt: Date;
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

export async function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  const secret = process.env.SESSION_SECRET?.trim() || "websuite-dev-secret-change-in-production";
  if (process.env.NODE_ENV === "production" && secret === "websuite-dev-secret-change-in-production") {
    console.warn("[auth] SESSION_SECRET is default. Set SESSION_SECRET in .env for production.");
  }
  const sessionConfig: session.SessionOptions = {
    secret,
    name: "websuite.sid",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax" as const,
    },
  };

  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getAdminByUsername(username);
        if (!user) return done(null, false, { message: "Invalid credentials" });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return done(null, false, { message: "Invalid credentials" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getAdminById(id);
      done(null, user || false);
    } catch (err) {
      done(err);
    }
  });

  // Seed default admin (or reset password if needed)
  const defaultPassword = process.env.ADMIN_PASSWORD?.trim() || "1503";
  const existing = await storage.getAdminByUsername("admin");
  if (!existing) {
    const hash = await bcrypt.hash(defaultPassword, 10);
    await storage.createAdmin({ username: "admin", password: hash });
    console.log("Default admin seeded (username: admin)");
  }

  // Auth routes
  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.json({ user: { id: user.id, username: user.username } });
      });
    })(req, res, next);
  });

  app.post("/api/admin/logout", (req, res) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.json({ ok: true });
      });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      return res.json({ user: { id: user.id, username: user.username } });
    }
    res.status(401).json({ message: "Not authenticated" });
  });
}
