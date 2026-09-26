export async function onRequestGet(context) {
  const { env, request } = context;
  const clientId = env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID environment variable is not configured.", { status: 500 });
  }

  const redirectUri = new URL(request.url).origin + "/api/callback";
  const scope = "repo,user";

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;

  return Response.redirect(authUrl, 302);
}
