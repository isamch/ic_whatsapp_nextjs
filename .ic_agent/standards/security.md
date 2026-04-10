SECURITY STANDARDS:

AUTH:
- Always validate authentication
- Never trust client-side data

DATA:
- Validate all inputs
- Sanitize user data

SECRETS:
- Never expose API keys
- Use environment variables

DATABASE:
- Prevent SQL injection
- Use ORM or parameterized queries

HEADERS:
- Use secure headers (CORS, CSP)

PASSWORDS:
- Hash passwords (bcrypt)
- Never store plain text

ACCESS CONTROL:
- Check permissions for every action