import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getNewsletterById } from "@/actions/newsletter";
import { upsertUserFromClerk } from "@/actions/user";
import { NewsletterHistoryView } from "@/components/dashboard/newsletter-history-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsletterDetailPage({ params }: PageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    notFound();
  }

  const user = await upsertUserFromClerk(userId);
  const { id } = await params;
  const newsletter = await getNewsletterById(id, user.id);

  if (!newsletter) {
    notFound();
  }

  return <NewsletterHistoryView newsletter={newsletter} />;
}
