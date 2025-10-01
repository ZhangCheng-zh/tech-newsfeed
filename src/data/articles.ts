export type Article = {
  id: string;
  title: string;
  snippet: string;
  imageUrl: string;
  sourceId: string;
};

export const articles: Article[] = [
  {
    id: "1",
    title: "Global Markets Rally on Renewed Optimism",
    snippet:
      "Stocks across Europe and Asia surged as investors reacted to fresh economic data pointing to a resilient recovery and easing inflation pressures.",
    imageUrl:
      "https://images.unsplash.com/photo-1468078809804-4c7b3e60a478?auto=format&fit=crop&w=900&q=80",
    sourceId: "google-developers",
  },
  {
    id: "2",
    title: "Cities Race to Build Climate-Ready Infrastructure",
    snippet:
      "Municipal leaders unveil a coordinated plan to retrofit aging transit systems while accelerating clean energy adoption in high-density neighborhoods.",
    imageUrl:
      "https://images.unsplash.com/photo-1451186859696-371d9477be93?auto=format&fit=crop&w=900&q=80",
    sourceId: "yahoo-engineering",
  },
  {
    id: "3",
    title: "Breakthrough in Quantum Networking Demonstrated",
    snippet:
      "Researchers achieve record-breaking entanglement stability, paving the way for secure communication channels that transcend current internet limits.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    sourceId: "netflix-techblog",
  },
  {
    id: "4",
    title: "Farm-to-Table Movement Expands to Urban Centers",
    snippet:
      "Local growers partner with restaurants to deliver seasonal menus while reducing food miles and spotlighting regenerative agriculture practices.",
    imageUrl:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
    sourceId: "nextdoor-engineering",
  },
  {
    id: "5",
    title: "Streaming Platforms Bet on Interactive Storytelling",
    snippet:
      "Major studios invest in choose-your-own adventure formats after early pilots draw record engagement from younger audiences worldwide.",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    sourceId: "spotify-engineering",
  },
  {
    id: "6",
    title: "Healthcare Innovators Focus on Remote Diagnostics",
    snippet:
      "Startups roll out AI-assisted screening tools that bring specialized care to rural communities through lightweight, connected devices.",
    imageUrl:
      "https://images.unsplash.com/photo-1581091870627-3a344ec62c57?auto=format&fit=crop&w=900&q=80",
    sourceId: "dropbox-tech",
  },
];
