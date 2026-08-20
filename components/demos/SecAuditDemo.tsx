"use client";

import { useMemo, useState } from "react";

/**
 * A subset of the SecAudit rule set, ported to JavaScript so it can run on the
 * page. The real tool is a single Python file with 60+ rules and no
 * dependencies. These 24 are the ones that survive being demonstrated in a
 * textarea.
 */

type Rule = {
  id: string;
  sev: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  owasp: string;
  title: string;
  why: string;
  re: RegExp;
};

const RULES: Rule[] = [
  { id: "SEC-001", sev: "CRITICAL", owasp: "A07", title: "JWT algorithm set to none", why: "Anyone can forge a token. The signature is not checked at all.", re: /algorithms?\s*[:=]\s*\[?\s*["']none["']/i },
  { id: "SEC-002", sev: "CRITICAL", owasp: "A07", title: "JWT signature verification disabled", why: "verify=False accepts any token, including one an attacker wrote.", re: /verify(_signature)?\s*[:=]\s*(False|false)/ },
  { id: "SEC-003", sev: "CRITICAL", owasp: "A08", title: "pickle.loads on untrusted data", why: "Deserialising a pickle executes code. This is remote code execution, not a data bug.", re: /pickle\.loads?\s*\(/ },
  { id: "SEC-004", sev: "CRITICAL", owasp: "A08", title: "yaml.load without SafeLoader", why: "The default loader constructs arbitrary Python objects. Same class of hole as pickle.", re: /yaml\.load\s*\((?![^)]*Safe)/ },
  { id: "SEC-005", sev: "CRITICAL", owasp: "A03", title: "SQL built by string interpolation", why: "An input containing a quote rewrites the query. Use parameters, not formatting.", re: /(execute|query|cursor\.execute)\s*\(\s*(f["']|["'][^"']*["']\s*[%+]|["'][^"']*\$\{)/ },
  { id: "SEC-006", sev: "CRITICAL", owasp: "A03", title: "Shell command built from a variable", why: "shell=True with interpolated input turns a filename into a command.", re: /(os\.system|subprocess\.(run|call|Popen)[^)]*shell\s*=\s*True)/ },
  { id: "SEC-007", sev: "HIGH", owasp: "A02", title: "Hardcoded API key or token", why: "It is in the repository, in the history, and in every clone. Rotating it is the only fix.", re: /(sk-[A-Za-z0-9]{16,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,})/ },
  { id: "SEC-008", sev: "HIGH", owasp: "A02", title: "Hardcoded password or secret literal", why: "A default secret in code is a production secret the day someone forgets to override it.", re: /(password|passwd|secret|secret_key|api_key|token)\s*[:=]\s*["'][^"'\s]{6,}["']/i },
  { id: "SEC-009", sev: "HIGH", owasp: "A03", title: "dangerouslySetInnerHTML", why: "Any unsanitised value here is stored cross site scripting.", re: /dangerouslySetInnerHTML/ },
  { id: "SEC-010", sev: "HIGH", owasp: "A03", title: "Direct innerHTML assignment", why: "Same hole as above, without React to warn you.", re: /\.innerHTML\s*=/ },
  { id: "SEC-011", sev: "HIGH", owasp: "A01", title: "Auth token stored in localStorage", why: "Readable by any script on the page. One XSS is total account takeover. Use an httpOnly cookie.", re: /localStorage\.(setItem|getItem)\s*\(\s*["'][^"']*(token|jwt|auth|session|key)/i },
  { id: "SEC-012", sev: "HIGH", owasp: "A05", title: "CORS wildcard origin", why: "Every site on the internet can call this API with the browser's credentials.", re: /(allow_origins\s*=\s*\[\s*["']\*["']|Access-Control-Allow-Origin["']?\s*[,:]\s*["']\*["'])/ },
  { id: "SEC-013", sev: "HIGH", owasp: "A02", title: "Secret exposed to the browser bundle", why: "NEXT_PUBLIC, VITE_ and REACT_APP_ variables ship to the client. A secret there is public.", re: /(NEXT_PUBLIC|VITE|REACT_APP)_[A-Z_]*(SECRET|KEY|TOKEN|PASSWORD)/ },
  { id: "SEC-014", sev: "HIGH", owasp: "A02", title: "Timing unsafe secret comparison", why: "== leaks the secret one byte at a time to anyone who can measure. Use a constant time compare.", re: /(secret|token|signature|api_key|hmac)\s*(===?|!==?)\s*[a-zA-Z_$][\w$.]*/i },
  { id: "SEC-015", sev: "HIGH", owasp: "A01", title: "Path built from user input", why: "A path containing ../ reads any file the process can read.", re: /(open|readFile|readFileSync|send_file|sendFile)\s*\([^)]*(req\.|request\.|params|query|body)/ },
  { id: "SEC-016", sev: "MEDIUM", owasp: "A04", title: "Auth endpoint with no rate limit nearby", why: "Login without throttling is a credential stuffing target with no cost to the attacker.", re: /(\/login|\/signin|\/register|\/forgot[-_]?password)/ },
  { id: "SEC-017", sev: "MEDIUM", owasp: "A05", title: "Debug mode enabled", why: "Debug pages return stack traces, source, and sometimes an interactive console.", re: /(DEBUG\s*[:=]\s*True|debug\s*[:=]\s*true|app\.run\([^)]*debug\s*=\s*True)/ },
  { id: "SEC-018", sev: "MEDIUM", owasp: "A09", title: "Stack trace returned to the client", why: "Tells an attacker your framework, paths, and versions for free.", re: /(traceback\.format_exc\s*\(\s*\)\s*[,)]|res\.(send|json)\s*\(\s*(err|error)(\.stack)?\s*\))/ },
  { id: "SEC-019", sev: "MEDIUM", owasp: "A09", title: "Credentials written to logs", why: "Log aggregation puts the secret somewhere with weaker access control than the secret store.", re: /(console\.log|print|logger?\.(info|debug|warn))\s*\([^)]*(password|token|secret|api_key)/i },
  { id: "SEC-020", sev: "MEDIUM", owasp: "A05", title: "Cookie without HttpOnly or Secure", why: "A cookie readable by script, or sent over plain HTTP, is a session waiting to be copied.", re: /(set_cookie|cookie\s*\()(?![^)]*httponly)(?![^)]*secure)/i },
  { id: "SEC-021", sev: "MEDIUM", owasp: "A03", title: "eval or Function constructor", why: "Executes whatever string reaches it. There is almost always another way.", re: /(\beval\s*\(|new\s+Function\s*\()/ },
  { id: "SEC-022", sev: "MEDIUM", owasp: "A02", title: "Weak hash used for a secret", why: "MD5 and SHA-1 are fast, which is exactly wrong for a password. Use bcrypt, scrypt or argon2.", re: /(md5|sha1)\s*\(/i },
  { id: "SEC-023", sev: "LOW", owasp: "A05", title: "Plain HTTP for an external call", why: "Interceptable and modifiable in transit.", re: /["']http:\/\/(?!localhost|127\.0\.0\.1)/ },
  { id: "SEC-024", sev: "LOW", owasp: "A05", title: "Unresolved security TODO", why: "A known hole with a note attached is still a known hole.", re: /(TODO|FIXME|XXX)[^\n]*(secur|auth|token|inject|sanit)/i },
];

const SAMPLE = `# api/auth.py
import jwt, pickle, hashlib
from fastapi import FastAPI, Request

app = FastAPI()
SECRET_KEY = "sup3rs3cr3t-do-not-ship"
STRIPE_KEY = "sk-live_51HxxQpFakeKeyForDemoOnly99"

app.add_middleware(CORSMiddleware, allow_origins=["*"])

@app.post("/login")
def login(req: Request, username: str, password: str):
    cursor.execute(f"SELECT * FROM users WHERE name = '{username}'")
    print(f"login attempt password={password}")
    claims = jwt.decode(req.headers["authorization"], options={"verify_signature": False})
    if claims["sig"] == req.headers["x-sig"]:
        return {"ok": True}
    return {"error": traceback.format_exc()}

@app.post("/restore")
def restore(blob: bytes):
    return pickle.loads(blob)

def check(pw, stored):
    return hashlib.md5(pw.encode()).hexdigest() == stored
`;

const SEV_COLOR: Record<string, string> = {
  CRITICAL: "var(--bad)",
  HIGH: "var(--warn)",
  MEDIUM: "var(--amber)",
  LOW: "var(--text-3)",
};
const SEV_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export default function SecAuditDemo() {
  const [code, setCode] = useState(SAMPLE);

  const findings = useMemo(() => {
    const lines = code.split("\n");
    const out: { rule: Rule; line: number; text: string }[] = [];
    lines.forEach((text, i) => {
      for (const rule of RULES) {
        rule.re.lastIndex = 0;
        if (rule.re.test(text)) out.push({ rule, line: i + 1, text: text.trim() });
      }
    });
    return out.sort(
      (a, b) => SEV_ORDER[a.rule.sev] - SEV_ORDER[b.rule.sev] || a.line - b.line
    );
  }, [code]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    for (const f of findings) c[f.rule.sev]++;
    return c;
  }, [findings]);

  return (
    <div className="demo">
      <div className="demo-bar">
        <span>secaudit</span>
        <span style={{ color: "var(--rule-3)" }}>|</span>
        <span>24 of 60+ rules, running as you type</span>
        <span className="fill" />
        {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((s) => (
          <span key={s} style={{ color: counts[s] ? SEV_COLOR[s] : "var(--text-3)" }}>
            {s[0]}
            {counts[s]}
          </span>
        ))}
      </div>

      <div className="demo-body stack g18">
        <div>
          <label className="eyebrow" htmlFor="sa-code">
            paste code, or edit this
          </label>
          <textarea
            id="sa-code"
            className="field mt8"
            rows={13}
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="stack">
          <div className="row between baseline">
            <span className="eyebrow">findings</span>
            <span className="mono muted" style={{ fontSize: 11 }}>
              {findings.length} across {code.split("\n").length} lines
            </span>
          </div>

          {findings.length === 0 ? (
            <p className="prose mt14" style={{ fontSize: 14 }}>
              Nothing matched. That is not the same as safe. Pattern matching finds shapes,
              not proofs, and it cannot follow data flow to tell a sanitised input from an
              unsanitised one.
            </p>
          ) : (
            <div className="mt14 stack">
              {findings.slice(0, 14).map((f, i) => (
                <div
                  key={`${f.rule.id}-${f.line}-${i}`}
                  style={{
                    borderTop: "1px solid var(--rule)",
                    padding: "13px 0",
                    display: "grid",
                    gridTemplateColumns: "84px 1fr",
                    gap: 14,
                  }}
                >
                  <div className="stack g6">
                    <span
                      className="mono"
                      style={{ fontSize: 9.5, letterSpacing: "0.12em", color: SEV_COLOR[f.rule.sev] }}
                    >
                      {f.rule.sev}
                    </span>
                    <span className="mono muted" style={{ fontSize: 10 }}>
                      L{f.line} · {f.rule.owasp}
                    </span>
                  </div>
                  <div className="stack g6" style={{ minWidth: 0 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 500, color: "var(--text)" }}>
                      {f.rule.title}
                    </span>
                    <span style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>
                      {f.rule.why}
                    </span>
                    <code
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--text-3)",
                        background: "var(--void)",
                        border: "1px solid var(--rule)",
                        borderRadius: 2,
                        padding: "6px 8px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.text.slice(0, 120)}
                    </code>
                  </div>
                </div>
              ))}
              {findings.length > 14 ? (
                <span className="mono muted mt14" style={{ fontSize: 11 }}>
                  {findings.length - 14} more not shown
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
