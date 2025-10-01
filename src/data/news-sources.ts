export type NewsSource = {
  id: string;
  title: string;
  feedUrl: string;
  description?: string;
  delivery?: string;
};

export const newsSources: NewsSource[] = [
  {
    id: "elon-musk-twitter",
    title: "Elon Musk (@elonmusk) / Twitter",
    feedUrl: "https://rss.app/feeds/2QGhEAkIMt9hrq1z.xml",
    delivery: "Email",
  },
  {
    id: "yahoo-engineering",
    title: "Yahoo Engineering",
    feedUrl: "https://yahooeng.tumblr.com/rss",
    description: "A peek under the purple rug!",
    delivery: "Email",
  },
  {
    id: "yelp-engineering",
    title: "Yelp Engineering and Product Blog",
    feedUrl: "https://engineeringblog.yelp.com/feed.xml",
    description: "News from the Yelp Engineering and Product Teams",
    delivery: "Email",
  },
  {
    id: "zoom-developer",
    title: "Zoom Developer Blog - Medium",
    feedUrl: "https://medium.com/feed/zoom-developer-blog",
    description:
      "All the ways you can join, build, and create on the Zoom Developer platform - Medium",
    delivery: "Email",
  },
  {
    id: "airbnb-tech",
    title: "The Airbnb Tech Blog - Medium",
    feedUrl: "https://medium.com/feed/airbnb-engineering",
    description:
      "Creative engineers and data scientists building a world where you can belong anywhere.",
    delivery: "Email",
  },
  {
    id: "bittorrent-engineering",
    title: "The BitTorrent Engineering Blog",
    feedUrl: "http://engineering.bittorrent.com/feed/",
    description: "Notes from the front lines of BitTorrent innovation",
    delivery: "Email",
  },
  {
    id: "dropbox-tech",
    title: "Dropbox Tech Blog",
    feedUrl: "https://dropbox.tech/feed",
    delivery: "Email",
  },
  {
    id: "ebay-innovation",
    title: "Innovation Stories",
    feedUrl: "https://innovation.ebayinc.com/stories/rss",
    delivery: "Email",
  },
  {
    id: "github-engineering",
    title: "The latest from GitHub's engineering team - The GitHub Blog",
    feedUrl: "https://github.blog/engineering.atom",
    description:
      "Updates, ideas, and inspiration from GitHub to help developers build and design software.",
    delivery: "Email",
  },
  {
    id: "google-developers",
    title: "Google Developers Blog",
    feedUrl: "https://developers.googleblog.com/feeds/posts/default/",
    description: "Updates on changes and additions to the Google Developers Blog.",
    delivery: "Email",
  },
  {
    id: "high-scalability",
    title: "High Scalability",
    feedUrl: "http://feeds.feedburner.com/HighScalability",
    delivery: "Email",
  },
  {
    id: "instacart-engineering",
    title: "tech-at-instacart - Medium",
    feedUrl: "https://tech.instacart.com/feed",
    description: "Instacart Engineering - Medium",
    delivery: "Email",
  },
  {
    id: "netflix-techblog",
    title: "Netflix TechBlog - Medium",
    feedUrl: "https://medium.com/feed/netflix-techblog",
    description:
      "Learn about Netflix’s world class engineering efforts, company culture, product developments and more.",
    delivery: "Email",
  },
  {
    id: "nextdoor-engineering",
    title: "Nextdoor Engineering - Medium",
    feedUrl: "https://engblog.nextdoor.com/feed",
    description:
      "Stories from the team building Nextdoor, the neighborhood hub for trusted connections.",
    delivery: "Email",
  },
  {
    id: "slack-engineering",
    title: "Engineering at Slack",
    feedUrl: "https://slack.engineering/feed/",
    description:
      "Hear directly from Slack's engineers about what we build, why, and how we build it.",
    delivery: "Email",
  },
  {
    id: "spotify-engineering",
    title: "Spotify Engineering",
    feedUrl: "https://engineering.atspotify.com/feed",
    description: "Spotify’s official technology blog",
    delivery: "Email",
  },
  {
    id: "shopify-engineering",
    title: "Shopify Engineering",
    feedUrl: "https://shopify.engineering/blog.atom",
    delivery: "Email",
  },
];
