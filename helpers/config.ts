export const githubOAuthConfig = {
  clientId: process.env.GH_CLIENT_ID || "GH_CLIENT_ID",
  clientSecret: process.env.GH_CLIENT_SECRET || "GH_CLIENT_SECRET",
  redirectUri: process.env.GH_REDIRECT_URI || "https://github.com/",
};
