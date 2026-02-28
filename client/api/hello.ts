export default function handler(_req: { method?: string }, res: { status: (n: number) => { json: (b: unknown) => void } }) {
  res.status(200).json({ ok: true, message: "API works" });
}
