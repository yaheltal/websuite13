type Res = { setHeader: (n: string, v: string) => void; status: (c: number) => { json: (b: unknown) => void } };

export default function handler(_req: { method?: string }, res: Res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const configured = Boolean(process.env.GMAIL_APP_PASSWORD?.trim());
  return res.status(200).json({
    configured,
    hint: configured ? "GMAIL_APP_PASSWORD is set" : "Add GMAIL_APP_PASSWORD in Vercel → Settings → Environment Variables",
  });
}
