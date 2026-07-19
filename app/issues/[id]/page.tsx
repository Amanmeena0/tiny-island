import fs from 'fs';
import path from 'path';
import IssueDetailsClient from '../../../components/IssueDetailsClient';

interface Tool {
  id: number;
  issueNumber: number;
  name: string;
  repoUrl: string;
  deployUrl?: string;
  repoOwner: string;
  repoName: string;
  description: string;
  tags: string[];
  language: string;
  screenshot: string;
  stars: number;
  author: string;
  authorAvatar: string;
  createdAt: string;
  category?: string;
}

export async function generateStaticParams() {
  try {
    const filePath = path.join(process.cwd(), 'data/tools.json');
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const tools: Tool[] = JSON.parse(fileContent);
      return tools.map((tool) => ({
        id: tool.issueNumber.toString(),
      }));
    }
  } catch (error) {
    console.error('Error generating static params:', error);
  }
  return [];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <IssueDetailsClient id={resolvedParams.id} />;
}
