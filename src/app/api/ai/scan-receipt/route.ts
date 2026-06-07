import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import openai from '@/lib/openai'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageBase64 } = await req.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract from this receipt: amount (number), category (Food/Transport/Shopping/Housing/Health/Entertainment/Utilities/Education/Other), description (merchant name). Return JSON only: {"amount": 0, "category": "Food", "description": ""}',
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        },
      ],
      max_tokens: 200,
    })

    const text = response.choices[0]?.message?.content || '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse receipt data' }, { status: 422 })
    }

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Scan receipt error:', error)
    return NextResponse.json({ error: error.message || 'Failed to scan receipt' }, { status: 500 })
  }
}