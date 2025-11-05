---
id: 660e8400-e29b-41d4-a716-446655440001
title: Building Scalable REST APIs with Next.js
slug: building-scalable-apis
status: published
published_at: 2024-02-01T09:00:00Z
tags:
  - nextjs
  - api
  - backend
  - typescript
cover_image: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800
---

# Building Scalable REST APIs with Next.js

Next.js 14 introduced powerful improvements to API routes with the App Router. Let's explore how to build production-ready REST APIs.

## Why Next.js for APIs?

Next.js API routes offer several advantages:

- **Co-located with frontend** - Share types and utilities
- **Edge runtime support** - Deploy globally for low latency
- **Built-in TypeScript** - Type safety throughout
- **Automatic code splitting** - Each route is independently optimized

## Basic Route Structure

Here's a simple API route using the App Router:

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const users = await fetchUsers();

  return NextResponse.json(users, {
    headers: {
      'Cache-Control': 'public, s-maxage=60',
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newUser = await createUser(body);

  return NextResponse.json(newUser, { status: 201 });
}
```

## Dynamic Routes

Handle dynamic parameters with bracket notation:

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await fetchUserById(id);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
```

## Error Handling

Implement robust error handling:

```typescript
export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

## Validation with Zod

Use Zod for request validation:

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().min(0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateUserSchema.parse(body);

    const user = await createUser(validated);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    throw error;
  }
}
```

## Authentication & Authorization

Protect routes with middleware:

```typescript
export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization');

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // Proceed with authenticated request
  const data = await fetchUserData(user.id);
  return NextResponse.json(data);
}
```

## Caching Strategies

Implement effective caching:

```typescript
export async function GET(request: NextRequest) {
  const data = await fetchData();

  return NextResponse.json(data, {
    headers: {
      // Cache for 1 hour, revalidate in background
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
```

## Rate Limiting

Protect your API from abuse:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function GET(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  // Process request
  const data = await fetchData();
  return NextResponse.json(data);
}
```

## Best Practices

1. **Use TypeScript** - Type safety prevents bugs
2. **Validate inputs** - Always validate user input
3. **Handle errors gracefully** - Return meaningful error messages
4. **Implement caching** - Reduce database load
5. **Add rate limiting** - Protect against abuse
6. **Use middleware** - Share logic across routes
7. **Monitor performance** - Track response times and errors

## Conclusion

Next.js provides a powerful foundation for building scalable REST APIs. By following these patterns and best practices, you can create robust, production-ready APIs that scale with your application.

Ready to build your next API? Start with a simple route and gradually add features as needed!
