import { Slide } from "@/app/types";

export const SLIDES: Slide[] = [
  {
    index: 0,
    title: "Before the Stream: Napster and the Breaking Point",
    body: "In 1999, Napster let 80 million users share music for free. The industry sued. Napster died. But it proved one thing: people wanted music on demand, and they weren't going to stop.",
    facts: ["80M Napster users", "RIAA lawsuit 2001", "$26B in lost CD sales by 2003"],
  },
  {
    index: 1,
    title: "99 Cents Changed Everything",
    body: "Apple's iTunes Store launched in 2003. A dollar per song felt fair — to labels, to consumers, and to Steve Jobs. It saved the industry from piracy but locked music to a device. Ownership was still the model.",
    facts: ["1M songs sold in first week", "10B songs sold by 2010", "DRM locked tracks to iTunes"],
  },
  {
    index: 2,
    title: "You Don't Own It. You Subscribe.",
    body: "Spotify launched in 2008 with a radical bet: unlimited music for a monthly fee. Labels were skeptical. Consumers loved it. By 2023, Spotify had 600 million users and streaming accounted for 84% of US music revenue.",
    facts: [
      "600M Spotify users",
      "84% of US revenue from streaming",
      "$0.003–$0.005 per stream to artists",
    ],
  },
  {
    index: 3,
    title: "The Economics Nobody Talks About",
    body: "Streaming made music accessible to everyone and nearly worthless to create. An independent artist needs 250,000 streams per month to earn minimum wage. The top 1% of artists capture 90% of streams. The middle class of music largely disappeared.",
    facts: [
      "250K streams ≈ $1,000/month",
      "Top 1% capture 90% of streams",
      "Catalog outperforms new releases",
    ],
  },
  {
    index: 4,
    title: "The Next Disruption Is Already Here",
    body: "AI-generated music, spatial audio, direct artist-to-fan platforms, and the vinyl revival are reshaping the industry again. Streaming solved distribution. It didn't solve discovery, fair pay, or artistic sustainability. Those problems are still open.",
    facts: [
      "Vinyl outsold CDs in 2023",
      "AI tools generating millions of tracks",
      "Bandcamp model growing",
    ],
  },
];

export const SLIDES_SUMMARY = SLIDES.map(({ index, title }) => ({ index, title }));
