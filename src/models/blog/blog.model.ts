import { Schema, model, connect } from 'mongoose'

export interface IBlog {
  title: string
  summary?: string
  coverImage?: string
  content: string
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Blog = model<IBlog>('Blog', blogSchema)

export default Blog
