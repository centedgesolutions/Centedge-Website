export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response("OAuth client credentials are not configured.", { status: 500 });
  }

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify(data), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = data.access_token;
    const provider = "github";

    // Decap CMS listens for authorization message from window.opener
    const script = `
      <!DOCTYPE html>
      <html>
      <head><title>Authorizing...</title></head>
      <body>
      <script>
        (function() {
          function receiveMessage(e) {
            window.opener.postMessage(
              'authorization:${provider}:success:{"token":"${token}","provider":"${provider}"}',
              e.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:${provider}", "*");
        })();
      </script>
      <p style="font-family: sans-serif; text-align: center; margin-top: 50px;">Authorizing Decap CMS with GitHub. You can close this window...</p>
      </body>
      </html>
    `;

    return new Response(script, {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
