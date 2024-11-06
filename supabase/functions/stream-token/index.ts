import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { StreamChat } from 'npm:stream-chat';
import { createClient } from 'jsr:@supabase/supabase-js@2';

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')!;
  console.log("Received auth header:", authHeader);

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const authToken = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseClient.auth.getUser(authToken);
  console.log("Supabase User Data:", data);
  console.log("Supabase Error:", error);
  const user = data.user;
  
  if (error || !data.user) {
    console.log("User not found");
    return new Response(
      JSON.stringify({ error: "User not found" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }


  const serverClient = StreamChat.getInstance(
    Deno.env.get("STREAM_API_KEY"),
    Deno.env.get("STREAM_API_SECRET")
  );
  console.log("StreamChat client created");

  const token = serverClient.createToken(user.id);
  return new Response(
    JSON.stringify({ token }),
    { headers: { "Content-Type": "application/json" } }
  );
});
