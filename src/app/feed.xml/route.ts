export async function GET(req: Request) {
  return new Response('Feed temporarily unavailable', {
    status: 200,
    headers: {
      'content-type': 'text/plain',
      'cache-control': 's-maxage=31556952',
    },
  })
}
