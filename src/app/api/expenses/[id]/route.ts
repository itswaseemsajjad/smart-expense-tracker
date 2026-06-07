import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const expense = await prisma.expense.findFirst({
      where: { id: params.id, userId },
    })

    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    await prisma.expense.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('DELETE expense error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}