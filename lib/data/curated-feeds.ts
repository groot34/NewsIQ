/**
 * Curated RSS Feeds organized by category
 * Users can browse and add feeds without needing to know URLs
 */

export interface CuratedFeed {
  name: string;
  url: string;
  description?: string;
}

export interface FeedCategory {
  id: string;
  name: string;
  icon: string;
  feeds: CuratedFeed[];
}

export const CURATED_FEEDS: FeedCategory[] = [
  {
    id: "indian-news",
    name: "🇮🇳 Indian News",
    icon: "🇮🇳",
    feeds: [
      { name: "NDTV Latest News", url: "https://feeds.feedburner.com/NDTV-LatestNews" },
      { name: "The Indian Express", url: "https://indianexpress.com/feed/" },
      { name: "Hindustan Times", url: "https://www.hindustantimes.com/feeds/rss/homepage/rssfeed.xml" },
      { name: "The Hindu (National)", url: "https://www.thehindu.com/news/national/feeder/default.rss" },
      { name: "Times of India", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms" },
      { name: "Business Standard", url: "https://www.business-standard.com/rss/home_page_top_stories.rss" },
      { name: "India Today", url: "https://www.indiatoday.in/rss/home" },
      { name: "News18 India", url: "https://www.news18.com/commonfeeds/v1/eng/rss/india.xml" },
      { name: "Deccan Chronicle", url: "https://www.deccanchronicle.com/google_feeds.xml" },
      { name: "Free Press Journal", url: "https://www.freepressjournal.in/stories.rss" },
    ],
  },
  {
    id: "indian-business",
    name: "💼 Indian Business",
    icon: "💼",
    feeds: [
      { name: "Moneycontrol", url: "https://www.moneycontrol.com/rss/latestnews.xml" },
      { name: "Economic Times", url: "https://economictimes.indiatimes.com/rssfeedsdefault.cms" },
      { name: "The Hindu BusinessLine", url: "https://www.thehindubusinessline.com/news/feeder/default.rss" },
    ],
  },
  {
    id: "indian-tech",
    name: "🚀 Indian Tech & Startups",
    icon: "🚀",
    feeds: [
      { name: "YourStory", url: "https://yourstory.com/feed" },
      { name: "Inc42", url: "https://inc42.com/feed/" },
      { name: "Medianama", url: "https://www.medianama.com/feed/" },
    ],
  },
  {
    id: "world-news",
    name: "🌍 International News",
    icon: "🌍",
    feeds: [
      { name: "BBC News", url: "https://feeds.bbci.co.uk/news/rss.xml" },
      { name: "BBC World News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
      { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
      { name: "NPR News", url: "https://feeds.npr.org/1001/rss.xml" },
      { name: "The Atlantic", url: "https://www.theatlantic.com/feed/all/" },
      { name: "The Hill", url: "https://thehill.com/homenews/feed/" },
    ],
  },
  {
    id: "us-news",
    name: "🇺🇸 US News",
    icon: "🇺🇸",
    feeds: [
      { name: "New York Times", url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml" },
      { name: "Wall Street Journal", url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml" },
      { name: "New York Post", url: "https://nypost.com/feed/" },
      { name: "PBS News Politics", url: "https://www.pbs.org/newshour/feeds/rss/politics" },
    ],
  },
  {
    id: "technology",
    name: "💻 Technology",
    icon: "💻",
    feeds: [
      { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
      { name: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
      { name: "Wired", url: "https://www.wired.com/feed/rss" },
      { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index/" },
      { name: "CNET News", url: "https://www.cnet.com/rss/news/" },
      { name: "GigaOM", url: "https://gigaom.com/feed/" },
    ],
  },
  {
    id: "ai-ml",
    name: "🤖 AI & Machine Learning",
    icon: "🤖",
    feeds: [
      { name: "Google AI Blog", url: "http://googleresearch.blogspot.com/atom.xml" },
      { name: "Google Research", url: "https://research.google/blog/rss/" },
      { name: "MarkTechPost", url: "https://www.marktechpost.com/feed" },
    ],
  },
  {
    id: "dev-newsletters",
    name: "📧 Developer Newsletters",
    icon: "📧",
    feeds: [
      { name: "React Status", url: "https://cprss.s3.amazonaws.com/react.statuscode.com.xml" },
      { name: "Node Weekly", url: "https://cprss.s3.amazonaws.com/nodeweekly.com.xml" },
      { name: "JavaScript Weekly", url: "https://cprss.s3.amazonaws.com/javascriptweekly.com.xml" },
      { name: "GoLang Weekly", url: "https://cprss.s3.amazonaws.com/golangweekly.com.xml" },
    ],
  },
  {
    id: "business-finance",
    name: "📈 Business & Finance",
    icon: "📈",
    feeds: [
      { name: "The Economist", url: "https://www.economist.com/latest/rss.xml" },
      { name: "Bloomberg Markets", url: "https://feeds.bloomberg.com/markets/news.rss" },
      { name: "Forbes Business", url: "https://www.forbes.com/business/feed/" },
      { name: "MarketWatch", url: "https://www.marketwatch.com/rss/topstories" },
      { name: "Business Insider", url: "https://www.businessinsider.com/rss" },
      { name: "CNBC", url: "https://www.cnbc.com/id/100003114/device/rss/rss.html" },
    ],
  },
  {
    id: "sports",
    name: "⚽ Sports",
    icon: "⚽",
    feeds: [
      { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/rss.xml" },
      { name: "ESPN", url: "https://www.espn.com/espn/rss/news" },
      { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/" },
      { name: "Sportstar Cricket", url: "https://sportstar.thehindu.com/cricket/feeder/default.rss" },
      { name: "Essentially Sports", url: "https://www.essentiallysports.com/feed/" },
    ],
  },
  {
    id: "entertainment",
    name: "🎬 Entertainment",
    icon: "🎬",
    feeds: [
      { name: "Collider", url: "https://collider.com/feed" },
      { name: "Deadline", url: "https://deadline.com/feed/" },
      { name: "E! Online", url: "https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml" },
      { name: "TMZ", url: "https://tmz.com/rss.xml" },
      { name: "HollywoodLife", url: "https://hollywoodlife.com/feed" },
      { name: "Filmfare (Bollywood)", url: "https://www.filmfare.com/feeds/feeds.xml" },
    ],
  },
  {
    id: "science",
    name: "🔬 Science",
    icon: "🔬",
    feeds: [
      { name: "Science Magazine", url: "https://www.sciencemag.org/rss/current.xml" },
      { name: "Nature", url: "https://www.nature.com/nature.rss" },
      { name: "Popular Science", url: "https://www.popsci.com/arcio/rss/" },
      { name: "Science Daily", url: "https://www.sciencedaily.com/rss/" },
      { name: "SciTechDaily", url: "https://scitechdaily.com/feed/" },
      { name: "New Scientist", url: "https://www.newscientist.com/feed/home/?cmpid=RSS%7CNSNS-Home" },
    ],
  },
  {
    id: "fashion",
    name: "👗 Fashion",
    icon: "👗",
    feeds: [
      { name: "Elle Fashion", url: "https://elle.com/rss/all.xml" },
      { name: "Fashion Bomb Daily", url: "https://fashionbombdaily.com/feed" },
      { name: "Fashion Gone Rogue", url: "https://fashiongonerogue.com/feed" },
      { name: "College Fashion", url: "https://collegefashion.net/feed" },
    ],
  },
  {
    id: "health",
    name: "🏥 Health & Fitness",
    icon: "🏥",
    feeds: [
      { name: "Precision Nutrition", url: "https://precisionnutrition.com/blog/feed" },
      { name: "Science for Sport", url: "https://scienceforsport.com/feed" },
      { name: "Exercise Right", url: "https://exerciseright.com.au/feed" },
      { name: "TrainingPeaks", url: "https://trainingpeaks.com/feed" },
    ],
  },
];

// Helper to get all feed URLs (for checking duplicates)
export function getAllFeedUrls(): string[] {
  return CURATED_FEEDS.flatMap((category) =>
    category.feeds.map((feed) => feed.url)
  );
}

// Helper to find a feed by URL
export function findFeedByUrl(url: string): CuratedFeed | undefined {
  for (const category of CURATED_FEEDS) {
    const feed = category.feeds.find((f) => f.url === url);
    if (feed) return feed;
  }
  return undefined;
}
