export async function GET() {
  return new Response(
    JSON.stringify({ message: "Update already completed successfully." }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
