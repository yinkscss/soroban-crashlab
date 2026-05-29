import { NextRequest, NextResponse } from 'next/server';

interface NotificationFeedItem {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

interface NotificationFeedResponse {
  notifications: NotificationFeedItem[];
  total: number;
  optional: true;
}

function buildEmptyFeed(): NotificationFeedResponse {
  return {
    notifications: [],
    total: 0,
    optional: true,
  };
}

async function fetchNotificationsFeed(request: NextRequest, feedUrl: string): Promise<NotificationFeedResponse> {
  const target = new URL(feedUrl, request.nextUrl.origin);
  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    target.searchParams.set(key, value);
  }

  const response = await fetch(target.toString(), {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return buildEmptyFeed();
  }

  const payload = (await response.json()) as Partial<NotificationFeedResponse> & {
    notifications?: NotificationFeedItem[];
  };

  if (!Array.isArray(payload.notifications)) {
    return buildEmptyFeed();
  }

  return {
    notifications: payload.notifications,
    total: typeof payload.total === 'number' ? payload.total : payload.notifications.length,
    optional: true,
  };
}

export async function GET(request: NextRequest) {
  const feedUrl = process.env.NOTIFICATIONS_FEED_URL ?? process.env.NOTIFICATIONS_API_URL;

  if (!feedUrl) {
    return NextResponse.json(buildEmptyFeed());
  }

  try {
    return NextResponse.json(await fetchNotificationsFeed(request, feedUrl));
  } catch (error) {
    console.error('GET /api/notifications failed:', error);
    return NextResponse.json(buildEmptyFeed());
  }
}