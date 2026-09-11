import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/blog/ArticleDetail";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/lib/blog-data";
import { site } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found — " + site.name,
    };
  }

  return {
    title: `${post.title} — ${site.name}`,
    description: post.summary,
    openGraph: {
      title: `${post.title} — ${site.name}`,
      description: post.summary,
      images: [post.coverImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — ${site.name}`,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  return <ArticleDetail post={post} relatedPosts={relatedPosts} />;
}
