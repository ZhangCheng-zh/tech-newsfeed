export type NewsSource = {
  id: string;
  title: string;
  feedUrl: string;
  description?: string;
  delivery?: string;
  logoUrl?: string;
};

const logo = (domain: string) => `https://logo.clearbit.com/${domain}?size=512`;

export const newsSources: NewsSource[] = [
  {
    id: "elon-musk-twitter",
    title: "Elon Musk (@elonmusk) / Twitter",
    feedUrl: "https://rss.app/feeds/2QGhEAkIMt9hrq1z.xml",
    delivery: "Email",
    logoUrl: logo("x.com"),
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
    logoUrl: logo("google.com"),
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
    title: "Nextdoor Engineering - Medium",
    feedUrl: "https://engblog.nextdoor.com/feed",
    description:
      "Stories from the team building Nextdoor, the neighborhood hub for trusted connections.",
    delivery: "Email",
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
    feedUrl: "https://shopify.engineering/blog.atom",
    delivery: "Email",
    logoUrl: logo("shopify.com"),
  },
];
