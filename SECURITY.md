# Security Policy# Security Policy

## Supported Versions## 🔐 Supported Versions

The following versions of Chess Diagram Generator are currently supported:The following versions of **Chess Diagram Generator** are currently supported with security updates:

| Version | Support Status | Security Updates || Version | Support Status | Security Updates | End of Life |

|---------|---------------|------------------||---------|---------------|------------------|-------------|

| v5.x.x | Active | Yes || v3.5.x | ✅ Active | ✅ Yes | Current |

| v4.x.x | Limited | Critical only || v3.0.x | ✅ Supported | ✅ Yes | 2026-06-30 |

| < v4.0 | Unsupported | No || v2.x.x | ⚠️ Limited Support | ⚠️ Critical Only | 2026-03-31 |

| v1.x.x | ❌ End of Life | ❌ No | 2026-01-31 |

**Recommendation:** Use the latest v5.x release for best security and features.| < v1.0 | ❌ Unsupported | ❌ No | N/A |

---> **Important:** Only the **latest stable versions (v3.0+)** receive regular security patches.

> Please upgrade to **v3.5.x** for the best security and feature support.

## Security Architecture

---

### Privacy-First Design

## 🛡️ Security Architecture

This project follows a **zero-backend, client-side-only architecture**:

### Privacy-First Design

- **No data collection** - All processing happens in your browserThis project follows a **zero-backend, client-side-only architecture**:

- **No server storage** - No positions or images are uploaded

- **No tracking** - No analytics, cookies, or telemetry✅ **No data collection** - All processing happens in your browser

- **No third-party services** - Complete offline functionality (except piece image loading)✅ **No server storage** - No positions or images are uploaded

- **Local storage only** - Settings remain on your device✅ **No tracking** - No analytics, cookies, or telemetry

✅ **No third-party services** - Complete offline functionality

### Attack Surface✅ **Local storage only** - Settings remain on your device

- **Minimal risk:** Static client-side JavaScript only### Attack Surface

- **No authentication:** No user accounts or login system- **Minimal risk:** Static client-side JavaScript only

- **No sensitive data:** Only chess positions (FEN notation)- **No authentication:** No user accounts or login system

- **No external APIs:** All features work offline after initial load- **No sensitive data:** Only chess positions (FEN notation)

- **No external APIs:** All features work offline

### Browser Security Features

---

- Content Security Policy (CSP) headers

- HTTPS-only deployment (via Vercel)## 🐞 Reporting a Vulnerability

- No inline scripts or eval() usage

- No dangerouslySetInnerHTML usageIf you discover a security vulnerability, please **do not open a public GitHub issue**.

- React's built-in XSS protection

### 📬 Reporting Methods

---

#### Option 1: GitHub Security Advisory (Preferred)

## Reporting a Vulnerability1. Go to the [Security tab](https://github.com/BilgeGates/chess_viewer/security)

2. Click **"Report a vulnerability"**

If you discover a security vulnerability, **do not open a public GitHub issue**.3. Fill out the advisory form with details

### Reporting Methods#### Option 2: Direct Email

Send details to: **[darkdeveloperassistant@gmail.com](mailto:darkdeveloperassistant@gmail.com)**

**Preferred: GitHub Security Advisory**

1. Go to the [Security tab](https://github.com/BilgeGates/chess_viewer/security)### 📋 What to Include

2. Click "Report a vulnerability"Please provide as much information as possible:

3. Fill out the advisory form with details- **Type of vulnerability** (XSS, injection, etc.)

- **Affected version(s)**

**Alternative: Direct Email**- **Steps to reproduce** the issue

- **Potential impact** and severity assessment

Send email to: **darkdeveloperassistant@gmail.com**- **Proof of concept** (if available)

- **Suggested fix** (if you have one)

Subject: `[SECURITY] Brief description`

### ⏱ Response Timeline

Include:- **Initial acknowledgment:** Within 48 hours

- Description of the vulnerability- **Vulnerability assessment:** 2–5 business days

- Steps to reproduce- **Fix development:** 5–10 days (depending on severity)

- Potential impact- **Patch release:** Included in next version or hotfix

- Suggested fix (optional)- **Public disclosure:** After fix is released (coordinated disclosure)

- Your contact information (if you want credit)

### 🏆 Recognition

### Response Timeline- Security researchers will be credited in release notes (unless anonymity is requested)

- Significant findings may be featured in the project README

- **Initial response:** Within 72 hours

- **Status update:** Within 7 days---

- **Fix timeline:** Depends on severity
  - Critical: 1-7 days## 🚫 Out of Scope

  - High: 7-14 days

  - Medium: 14-30 daysThe following are **not considered security vulnerabilities**:

  - Low: Best effort

### Not Security Issues

### Disclosure Policy- ❌ UI/UX bugs or visual glitches

- ❌ Incorrect chess positions from invalid FEN input

- We follow responsible disclosure- ❌ Performance issues or slow rendering

- You will be credited (unless you prefer anonymity)- ❌ Feature requests or enhancement suggestions

- Security fixes are released without detailed exploit information- ❌ Browser compatibility issues

- Full details disclosed 90 days after fix release (or when agreed)- ❌ Issues requiring user to modify source code

- ❌ Social engineering attacks

---- ❌ Physical access to user's device

## Potential Security Concerns### Known Limitations (By Design)

- FEN notation validation is permissive by design

### Input Validation- Browser localStorage is used (can be cleared by user)

- No encryption for local data (not needed for public chess positions)

**FEN String Parsing**

- User input is validated before parsing---

- Invalid FEN rejected with error message

- No code execution from FEN input## 📦 Dependency Security

- Maximum input length enforced

### Third-Party Libraries

**Color Inputs**This project uses the following major dependencies:

- Hex color validation- **React** (v18+, built with v19.x)

- Safe color parsing- **Vite** (build tool)

- No CSS injection possible- **Tailwind CSS** (styling)

- **Lucide React** (icons)

### Canvas Operations

### Dependency Updates

**Export Functionality**- 🔄 **Automated:** Dependabot monitors for security updates

- Canvas operations run client-side- 🔍 **Manual review:** Monthly security audits via `npm audit`

- No server-side processing- ⚡ **Quick response:** Critical vulnerabilities patched within 48 hours

- File size limits enforced- 📋 **Changelog:** All dependency updates documented

- Memory limits respected

### How to Check Dependencies

### LocalStorage```bash

# Check for vulnerabilities in your local installation

**Data Storage**npm audit

- Only non-sensitive data stored (preferences, history)

- No authentication tokens or credentials# View detailed security report

- Data stored per-domain (browser security)npm audit --json

- User can clear at any time

# Fix automatically (when possible)

---npm audit fix

```

## Known Non-Issues

---

These are **not** security vulnerabilities:

## 🔒 Best Practices for Users

- **No HTTPS on localhost** - Development only

- **console.log statements** - Removed in production build### For End Users

- **Source maps** - Disabled in production- ✅ Always use the latest version from the official repo

- **Dependency vulnerabilities (dev-only)** - Not shipped to users- ✅ Clear browser cache after updates

- **Large memory usage on exports** - Expected browser behavior- ✅ Report suspicious behavior immediately

- ✅ Don't modify source code from untrusted sources

---

### For Developers/Contributors

## Security Best Practices for Users- ✅ Review code changes carefully before committing

- ✅ Run `npm audit` before submitting PRs

### Recommended Actions- ✅ Follow secure coding practices

- ✅ Never commit sensitive data or API keys

- Use the **latest browser version**- ✅ Use environment variables for configuration

- Enable **browser security features**- ✅ Sanitize user inputs (even though we only accept FEN notation)

- Don't install **browser extensions** from untrusted sources

- Clear **localStorage** if using a shared computer---



### What We Don't Need## 📄 Security Disclosure Policy



- No password requirements (no accounts)### Responsible Disclosure

- No 2FA (no authentication)We follow a **coordinated disclosure** approach:

- No session management (stateless)

- No CORS configuration (no API)1. **Private notification** → Security issue is reported privately

2. **Acknowledgment** → We confirm receipt within 48 hours

---3. **Investigation** → We assess and validate the issue

4. **Fix development** → We develop and test a patch

## Third-Party Dependencies5. **Coordinated release** → We release the fix in a new version

6. **Public disclosure** → We publish details after users have time to update (typically 7-14 days)

### Dependency Security

### Public Disclosure

- Dependencies audited regularly with `npm audit`After a fix is released, we will:

- Security patches applied promptly- 📢 Publish a security advisory on GitHub

- Minimal dependency footprint- 📝 Document the issue in CHANGELOG.md

- No dependencies with known critical vulnerabilities- 🏆 Credit the reporter (unless anonymity requested)

- 📊 Share lessons learned with the community

### Current Dependencies

---

**Production:**

- React 19.2.3## 🔍 Security Audit History

- React Router 7.11.0

- React Window 1.8.10| Date | Audit Type | Findings | Status |

- React DND 16.0.1|------|-----------|----------|--------|

- Lucide React 0.469.0| 2026-01-04 | Internal Review | 0 critical, 0 high | ✅ Clear |

- Canvg 4.0.2| 2025-12-28 | Dependency Audit | 1 moderate (qs) | ✅ Fixed in v3.5.1 |



**Development:**---

- React Scripts 5.0.1

- CRACO 7.1.0## 📞 Security Contact

- Tailwind CSS 3.3.5

- ESLint 8.57.1**Project Maintainer:** Khatai Huseynzada

**Email:** [darkdeveloperassistant@gmail.com](mailto:darkdeveloperassistant@gmail.com)

All production dependencies are from trusted sources (npm registry, official packages).**GitHub:** [@BilgeGates](https://github.com/BilgeGates)

**Response Time:** Within 24 hours (business days)

---

For urgent critical vulnerabilities, please include **[URGENT SECURITY]** in the email subject.

## Security Checklist

---

### For Contributors

## 📚 Additional Resources

When submitting code:

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

- [ ] No hardcoded secrets or API keys- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

- [ ] No eval() or Function() constructor- [Responsible Disclosure Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)

- [ ] No dangerouslySetInnerHTML

- [ ] Input validation on user data---

- [ ] No SQL/NoSQL injection risks (N/A - no database)

- [ ] No command injection risks (N/A - no server)## 🙏 Acknowledgments

- [ ] No file system access (browser only)

- [ ] Dependencies checked with npm auditWe thank the following security researchers for responsible disclosure:



### For Maintainers- *No security issues reported yet*



Before releasing:---



- [ ] Run `npm audit` and fix critical/high issues**Thank you for helping keep Chess Diagram Generator secure!** ♟️🔒

- [ ] Review all PR changes for security implications

- [ ] Test with latest browser versions*Last updated: January 4, 2026*
- [ ] Verify CSP headers on deployment
- [ ] Check for exposed secrets in git history
- [ ] Update security documentation

---

## Incident Response

### In Case of Security Incident

1. **Immediate:** Take down affected version if critical
2. **Assess:** Evaluate impact and affected versions
3. **Fix:** Develop and test patch
4. **Release:** Deploy patched version
5. **Notify:** Inform users via GitHub release notes
6. **Document:** Update security documentation

### Communication Channels

- GitHub Security Advisory
- GitHub Releases (for public disclosure)
- README.md (for major incidents)

---

## Contact

For security concerns:

- **Email:** darkdeveloperassistant@gmail.com
- **GitHub:** [@BilgeGates](https://github.com/BilgeGates)
- **Security Advisory:** [GitHub Security Tab](https://github.com/BilgeGates/chess_viewer/security)

---

Last Updated: February 7, 2026
```
