import type { NextApiRequest, NextApiResponse } from 'next'

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  // const examples = await prisma.example.findMany()
  res.status(200).json({ msg: 'success' })
}

export default examples
