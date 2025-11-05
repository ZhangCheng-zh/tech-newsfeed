export type NewsSource = {
  id: string;
  title: string;
  feedUrl: string;
  type?: "rss" | "youtube";
  channelId?: string;
  description?: string;
  delivery?: string;
  logoUrl?: string;
};

const logo = (domain: string, size = 256) =>
  `https://logo.clearbit.com/${domain}?size=${size}`;

export const newsSources: NewsSource[] = [
  {
    id: "bytebytego-youtube",
    title: "ByteByteGo (YouTube)",
    feedUrl: "https://www.youtube.com/feeds/videos.xml?channel_id=UCZgt6AzoyjslHTC9dz0UoTw",
    type: "youtube",
    channelId: "UCZgt6AzoyjslHTC9dz0UoTw",
    description: "High-quality system design walkthroughs and coding interview prep from ByteByteGo.",
    delivery: "YouTube",
    logoUrl: "https://yt3.googleusercontent.com/ZDRUyBUwc2WXZzvNKP9VS9myI6Mg2puQLaWyp4hibRu-owlsasZ3DVNGSQJwzO1IU-tqoMiGgdc=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    id: "yahoo-engineering",
    title: "Yahoo Engineering",
    feedUrl: "https://yahooeng.tumblr.com/rss",
    description: "A peek under the purple rug!",
    delivery: "Email",
    logoUrl: logo("yahoo.com"),
  },
  {
    id: "yelp-engineering",
    title: "Yelp Engineering and Product Blog",
    feedUrl: "https://engineeringblog.yelp.com/feed.xml",
    description: "News from the Yelp Engineering and Product Teams",
    delivery: "Email",
    logoUrl: logo("yelp.com"),
  },
  {
    id: "zoom-developer",
    title: "Zoom Developer Blog - Medium",
    feedUrl: "https://medium.com/feed/zoom-developer-blog",
    description:
      "All the ways you can join, build, and create on the Zoom Developer platform - Medium",
    delivery: "Email",
    logoUrl: logo("zoom.us"),
  },
  {
    id: "airbnb-tech",
    title: "The Airbnb Tech Blog - Medium",
    feedUrl: "https://medium.com/feed/airbnb-engineering",
    description:
      "Creative engineers and data scientists building a world where you can belong anywhere.",
    delivery: "Email",
    logoUrl: logo("airbnb.com"),
  },
  {
    id: "bittorrent-engineering",
    title: "The BitTorrent Engineering Blog",
    feedUrl: "http://engineering.bittorrent.com/feed/",
    description: "Notes from the front lines of BitTorrent innovation",
    delivery: "Email",
    logoUrl: logo("bittorrent.com"),
  },
  {
    id: "dropbox-tech",
    title: "Dropbox Tech Blog",
    feedUrl: "https://dropbox.tech/feed",
    delivery: "Email",
    logoUrl: logo("dropbox.com"),
  },
  {
    id: "ebay-innovation",
    title: "Innovation Stories",
    feedUrl: "https://innovation.ebayinc.com/stories/rss",
    delivery: "Email",
    logoUrl: logo("ebay.com"),
  },
  {
    id: "github-engineering",
    title: "The latest from GitHub's engineering team - The GitHub Blog",
    feedUrl: "https://github.blog/engineering.atom",
    description:
      "Updates, ideas, and inspiration from GitHub to help developers build and design software.",
    delivery: "Email",
    logoUrl: logo("github.com"),
  },
  {
    id: "google-developers",
    title: "Google Developers Blog",
    feedUrl: "https://developers.googleblog.com/feeds/posts/default/",
    description: "Updates on changes and additions to the Google Developers Blog.",
    delivery: "Email",
    logoUrl: "/logos/google-developers.svg",
  },
  {
    id: "high-scalability",
    title: "High Scalability",
    feedUrl: "http://feeds.feedburner.com/HighScalability",
    delivery: "Email",
    logoUrl: logo("highscalability.com"),
  },
  {
    id: "instacart-engineering",
    title: "tech-at-instacart - Medium",
    feedUrl: "https://tech.instacart.com/feed",
    description: "Instacart Engineering - Medium",
    delivery: "Email",
    logoUrl: logo("instacart.com"),
  },
  {
    id: "netflix-techblog",
    title: "Netflix TechBlog - Medium",
    feedUrl: "https://medium.com/feed/netflix-techblog",
    description:
      "Learn about Netflix’s world class engineering efforts, company culture, product developments and more.",
    delivery: "Email",
    logoUrl: logo("netflix.com"),
  },
  {
    id: "nextdoor-engineering",
    title: "Nextdoor Engineering",
    feedUrl: "https://medium.com/feed/nextdoor-engineering",
    description:
      "Stories from the team building Nextdoor, the neighborhood hub for trusted connections. Hosted on Medium.",
    delivery: "RSS",
    logoUrl: logo("nextdoor.com"),
  },
  {
    id: "slack-engineering",
    title: "Engineering at Slack",
    feedUrl: "https://slack.engineering/feed/",
    description:
      "Hear directly from Slack's engineers about what we build, why, and how we build it.",
    delivery: "Email",
    logoUrl: logo("slack.com"),
  },
  {
    id: "spotify-engineering",
    title: "Spotify Engineering",
    feedUrl: "https://engineering.atspotify.com/feed",
    description: "Spotify’s official technology blog",
    delivery: "Email",
    logoUrl: logo("spotify.com"),
  },
  {
    id: "shopify-engineering",
    title: "Shopify Engineering",
    feedUrl: "https://shopify.engineering/blogs/engineering.atom",
    delivery: "RSS",
    logoUrl: logo("shopify.com"),
  },
  {
    id: "uber-engineering",
    title: "Uber Engineering Blog",
    feedUrl: "https://www.uber.com/blog/engineering/rss/",
    description: "Engineering updates and stories from Uber's teams.",
    delivery: "RSS",
    logoUrl: logo("uber.com"),
  },
  {
    id: "meta-engineering",
    title: "Meta Engineering",
    feedUrl: "https://engineering.fb.com/feed/",
    description: "Engineering breakthroughs and stories from Meta.",
    delivery: "RSS",
    logoUrl: logo("fb.com"),
  },
  {
    id: "microsoft-developer",
    title: "Microsoft DevBlogs",
    feedUrl: "https://devblogs.microsoft.com/feed/",
    description: "Official Microsoft developer news and technical posts.",
    delivery: "RSS",
    logoUrl: logo("microsoft.com"),
  },
  {
    id: "aws-news",
    title: "AWS News Blog",
    feedUrl: "https://aws.amazon.com/blogs/aws/feed/",
    description: "Announcements and deep dives from Amazon Web Services.",
    delivery: "RSS",
    logoUrl: logo("aws.amazon.com"),
  },
  {
    id: "twitter-engineering",
    title: "Twitter Engineering",
    feedUrl: "https://blog.twitter.com/engineering/en_us/rss",
    description: "Engineering updates from the team building X (Twitter).",
    delivery: "RSS",
    logoUrl: logo("x.com"),
  },
  {
    id: "paypal-engineering",
    title: "PayPal Engineering",
    feedUrl: "https://medium.com/feed/paypal-tech",
    description: "Engineering insights from PayPal technologists.",
    delivery: "RSS",
    logoUrl: logo("paypal.com"),
  },
  {
    id: "openai-research",
    title: "OpenAI Research",
    feedUrl: "https://openai.com/research/feed",
    description: "Latest research updates and publications from OpenAI.",
    delivery: "RSS",
    logoUrl: logo("openai.com"),
  },
  {
    id: "deepmind-discover",
    title: "Google DeepMind Discover",
    feedUrl: "https://deepmind.google/discover/rss.xml",
    description: "Research and product stories from Google DeepMind.",
    delivery: "RSS",
    logoUrl: logo("deepmind.google"),
  },
  {
    id: "meta-ai",
    title: "Meta AI Blog",
    feedUrl: "https://ai.meta.com/blog/rss/",
    description: "Advances in AI research and products from Meta.",
    delivery: "RSS",
    logoUrl: logo("meta.com"),
  },
  {
    id: "nvidia-ai",
    title: "NVIDIA AI Blog",
    feedUrl: "https://developer.nvidia.com/blog/category/ai/feed/",
    description: "AI and accelerated computing insights from NVIDIA engineers.",
    delivery: "RSS",
    logoUrl: logo("nvidia.com"),
  },
  {
    id: "huggingface-blog",
    title: "Hugging Face Blog",
    feedUrl: "https://huggingface.co/blog/feed",
    description: "Open-source AI research and product updates from Hugging Face.",
    delivery: "RSS",
    logoUrl: logo("huggingface.co"),
  },
  {
    id: "anthropic-news",
    title: "Anthropic News",
    feedUrl: "https://www.anthropic.com/news/rss.xml",
    description: "Announcements and research from Anthropic.",
    delivery: "RSS",
    logoUrl: logo("anthropic.com"),
  },
  {
    id: "stability-ai",
    title: "Stability AI Blog",
    feedUrl: "https://stability.ai/blog/rss.xml",
    description: "Updates on generative AI research and products from Stability AI.",
    delivery: "RSS",
    logoUrl: logo("stability.ai"),
  },
];
