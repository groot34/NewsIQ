import { auth } from "@clerk/nextjs/server";
import { getRssFeedsByUserId } from "@/actions/rss-feed";
import { upsertUserFromClerk } from "@/actions/user";
import { NewsletterForm } from "./newsletter-form";

export async function NewsletterGenerator() {
  const { userId } = await auth();
  const user = await upsertUserFromClerk(userId!);
  const feeds = await getRssFeedsByUserId(user.id);

  if (feeds.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-white">Generate Newsletter</h2>
        <p className="text-slate-400 mt-2">
          Add RSS feeds first to generate newsletters
        </p>
      </div>
    );
  }

  return (
    <NewsletterForm
      feeds={feeds.map((f) => ({
        id: f.id,
        title: f.title,
        url: f.url,
      }))}
    />
  );
}
