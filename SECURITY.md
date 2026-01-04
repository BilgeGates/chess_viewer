# Security Policy

## 🔐 Supported Versions

The following versions of **Chess Diagram Generator** are currently supported with security updates:

| Version | Support Status | Security Updates | End of Life |
|---------|---------------|------------------|-------------|
| v3.5.x  | ✅ Active | ✅ Yes | Current |
| v3.0.x  | ✅ Supported | ✅ Yes | 2026-06-30 |
| v2.x.x  | ⚠️ Limited Support | ⚠️ Critical Only | 2026-03-31 |
| v1.x.x  | ❌ End of Life | ❌ No | 2026-01-31 |
| < v1.0  | ❌ Unsupported | ❌ No | N/A |

> **Important:** Only the **latest stable versions (v3.0+)** receive regular security patches.  
> Please upgrade to **v3.5.x** for the best security and feature support.

---

## 🛡️ Security Architecture

### Privacy-First Design
This project follows a **zero-backend, client-side-only architecture**:

✅ **No data collection** - All processing happens in your browser  
✅ **No server storage** - No positions or images are uploaded  
✅ **No tracking** - No analytics, cookies, or telemetry  
✅ **No third-party services** - Complete offline functionality  
✅ **Local storage only** - Settings remain on your device  

### Attack Surface
- **Minimal risk:** Static client-side JavaScript only
- **No authentication:** No user accounts or login system
- **No sensitive data:** Only chess positions (FEN notation)
- **No external APIs:** All features work offline

---

## 🐞 Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public GitHub issue**.

### 📬 Reporting Methods

#### Option 1: GitHub Security Advisory (Preferred)
1. Go to the [Security tab](https://github.com/BilgeGates/chess_viewer/security)
2. Click **"Report a vulnerability"**
3. Fill out the advisory form with details

#### Option 2: Direct Email
Send details to: **[darkdeveloperassistant@gmail.com](mailto:darkdeveloperassistant@gmail.com)**

### 📋 What to Include
Please provide as much information as possible:
- **Type of vulnerability** (XSS, injection, etc.)
- **Affected version(s)**
- **Steps to reproduce** the issue
- **Potential impact** and severity assessment
- **Proof of concept** (if available)
- **Suggested fix** (if you have one)

### ⏱ Response Timeline
- **Initial acknowledgment:** Within 48 hours
- **Vulnerability assessment:** 2–5 business days
- **Fix development:** 5–10 days (depending on severity)
- **Patch release:** Included in next version or hotfix
- **Public disclosure:** After fix is released (coordinated disclosure)

### 🏆 Recognition
- Security researchers will be credited in release notes (unless anonymity is requested)
- Significant findings may be featured in the project README

---

## 🚫 Out of Scope

The following are **not considered security vulnerabilities**:

### Not Security Issues
- ❌ UI/UX bugs or visual glitches
- ❌ Incorrect chess positions from invalid FEN input
- ❌ Performance issues or slow rendering
- ❌ Feature requests or enhancement suggestions
- ❌ Browser compatibility issues
- ❌ Issues requiring user to modify source code
- ❌ Social engineering attacks
- ❌ Physical access to user's device

### Known Limitations (By Design)
- FEN notation validation is permissive by design
- Browser localStorage is used (can be cleared by user)
- No encryption for local data (not needed for public chess positions)

---

## 📦 Dependency Security

### Third-Party Libraries
This project uses the following major dependencies:
- **React** (v18+, built with v19.x)
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Lucide React** (icons)

### Dependency Updates
- 🔄 **Automated:** Dependabot monitors for security updates
- 🔍 **Manual review:** Monthly security audits via `npm audit`
- ⚡ **Quick response:** Critical vulnerabilities patched within 48 hours
- 📋 **Changelog:** All dependency updates documented

### How to Check Dependencies
```bash
# Check for vulnerabilities in your local installation
npm audit

# View detailed security report
npm audit --json

# Fix automatically (when possible)
npm audit fix
```

---

## 🔒 Best Practices for Users

### For End Users
- ✅ Always use the latest version from the official repo
- ✅ Clear browser cache after updates
- ✅ Report suspicious behavior immediately
- ✅ Don't modify source code from untrusted sources

### For Developers/Contributors
- ✅ Review code changes carefully before committing
- ✅ Run `npm audit` before submitting PRs
- ✅ Follow secure coding practices
- ✅ Never commit sensitive data or API keys
- ✅ Use environment variables for configuration
- ✅ Sanitize user inputs (even though we only accept FEN notation)

---

## 📄 Security Disclosure Policy

### Responsible Disclosure
We follow a **coordinated disclosure** approach:

1. **Private notification** → Security issue is reported privately
2. **Acknowledgment** → We confirm receipt within 48 hours
3. **Investigation** → We assess and validate the issue
4. **Fix development** → We develop and test a patch
5. **Coordinated release** → We release the fix in a new version
6. **Public disclosure** → We publish details after users have time to update (typically 7-14 days)

### Public Disclosure
After a fix is released, we will:
- 📢 Publish a security advisory on GitHub
- 📝 Document the issue in CHANGELOG.md
- 🏆 Credit the reporter (unless anonymity requested)
- 📊 Share lessons learned with the community

---

## 🔍 Security Audit History

| Date | Audit Type | Findings | Status |
|------|-----------|----------|--------|
| 2026-01-04 | Internal Review | 0 critical, 0 high | ✅ Clear |
| 2025-12-28 | Dependency Audit | 1 moderate (qs) | ✅ Fixed in v3.5.1 |

---

## 📞 Security Contact

**Project Maintainer:** Khatai Huseynzada  
**Email:** [darkdeveloperassistant@gmail.com](mailto:darkdeveloperassistant@gmail.com)  
**GitHub:** [@BilgeGates](https://github.com/BilgeGates)  
**Response Time:** Within 24 hours (business days)

For urgent critical vulnerabilities, please include **[URGENT SECURITY]** in the email subject.

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Responsible Disclosure Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)

---

## 🙏 Acknowledgments

We thank the following security researchers for responsible disclosure:

- *No security issues reported yet*

---

**Thank you for helping keep Chess Diagram Generator secure!** ♟️🔒

*Last updated: January 4, 2026*